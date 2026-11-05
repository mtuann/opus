"""Tải từ mạng một cách lịch sự, dùng chung cho các công cụ trong tools/audio.

- User-Agent kèm link site, như AGENTS.md (mục Mạng) yêu cầu; không kèm email hay thông tin cá nhân.
- Nghỉ khoảng 2,5 giây giữa hai yêu cầu tới cùng một máy chủ Wikimedia; thử lại khi gặp 429 hoặc 5xx,
  chờ theo Retry-After nếu máy chủ gửi. Khoảng nghỉ tính chung cho mọi tiến trình dùng cùng bộ nhớ đệm (nhiều
  công cụ chạy song song): thời điểm của yêu cầu gần nhất ghi trong throttle/<máy chủ>, khóa bằng flock.
- Bộ nhớ đệm ngoài repo: $OZ_AUDIO_CACHE, mặc định ~/.cache/opus-zero (hoặc $XDG_CACHE_HOME/opus-zero): giữ tên của
  site cũ để dùng lại bản nhạc số, đặc trưng và câu trả lời API đã tải.
  Thư mục con: api/ (câu trả lời API), audio/ (bản thu tải về để căn mốc), scores/ (bản nhạc số), features/.
"""
import hashlib
import http.client
import json
try:
    import fcntl
except ImportError:            # Windows: chỉ nghỉ trong từng tiến trình
    fcntl = None
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = "opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)"
PAUSE = 2.5
SLOW = ("wikimedia.org", "wikipedia.org", "imslp.org")   # máy chủ cần nghỉ giữa các yêu cầu


def cache_dir(sub=""):
    base = os.environ.get("OZ_AUDIO_CACHE") or os.path.join(os.environ.get("XDG_CACHE_HOME") or os.path.expanduser("~/.cache"), "opus-zero")
    d = Path(base) / sub
    d.mkdir(parents=True, exist_ok=True)
    return d


_last = {}


def _wait(host):
    if not any(host.endswith(h) for h in SLOW):
        return
    if fcntl is None:
        dt = time.time() - _last.get(host, 0)
        if dt < PAUSE:
            time.sleep(PAUSE - dt)
        _last[host] = time.time()
        return
    with open(cache_dir("throttle") / host, "a+") as f:
        fcntl.flock(f, fcntl.LOCK_EX)          # tiến trình khác chờ ở đây; khóa nhả khi đóng file
        f.seek(0)
        try:
            last = float(f.read() or 0)
        except ValueError:
            last = 0.0
        dt = time.time() - last
        if dt < PAUSE:
            time.sleep(PAUSE - dt)
        f.seek(0)
        f.truncate()
        f.write(repr(time.time()))


def fetch(url, headers=None, tries=6, timeout=60):
    """Nội dung (bytes) của url. Thử lại khi gặp 429/5xx hoặc lỗi mạng; lỗi khác (404, 403...) báo ngay."""
    host = urllib.parse.urlsplit(url).hostname or ""
    for attempt in range(tries):
        _wait(host)
        req = urllib.request.Request(url, headers=dict({"User-Agent": UA}, **(headers or {})))
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 and e.code < 500:
                raise
            wait = int(e.headers.get("Retry-After") or 0) or 10 * (attempt + 1)
            print("  [%d] %s: chờ %d giây rồi thử lại" % (e.code, host, wait), file=sys.stderr)
            time.sleep(min(wait, 120))
        except (urllib.error.URLError, TimeoutError, ConnectionError, http.client.HTTPException) as e:   # cả IncompleteRead
            print("  [lỗi mạng] %s: %s" % (host, e), file=sys.stderr)
            time.sleep(10 * (attempt + 1))
    raise RuntimeError("không tải được sau %d lần: %s" % (tries, url))


class ApiError(RuntimeError):
    """Câu trả lời của API báo lỗi hay thiếu phần cần có: không lưu đệm, lần sau hỏi lại."""


def get_json(url, cache=True, need=()):
    """JSON từ url, có bộ nhớ đệm (api/<sha1>.json). cache=False: luôn hỏi lại. Câu trả lời có khóa "error" (API của
    MediaWiki báo lỗi), hay thiếu một khóa trong need, thì ném ApiError và không lưu đệm (kể cả bản đệm cũ hỏng)."""
    path = cache_dir("api") / (hashlib.sha1(url.encode()).hexdigest() + ".json")
    if cache and path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError):           # bản đệm hỏng (file bị cắt…): bỏ, tải lại
            data = None
        if data is not None and _problem(data, need) is None:
            return data
        path.unlink(missing_ok=True)
    data = json.loads(fetch(url))
    why = _problem(data, need)
    if why:
        raise ApiError("%s: %s" % (why, url))
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


def _problem(data, need):
    if not isinstance(data, dict):
        return "câu trả lời không phải đối tượng JSON"
    if "error" in data:
        e = data["error"]
        return "API báo lỗi %s" % (e.get("code", e) if isinstance(e, dict) else e)
    miss = [k for k in need if k not in data]
    return "câu trả lời thiếu %s" % ", ".join(miss) if miss else None


def download(url, dest):
    """Tải url về file dest (bỏ qua nếu đã có). Trả về Path."""
    dest = Path(dest)
    if dest.exists() and dest.stat().st_size:
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_name(dest.name + ".part")
    tmp.write_bytes(fetch(url, timeout=180))
    tmp.replace(dest)
    return dest


def cached_audio(url):
    """Bản thu ở url, tải một lần vào audio/ của bộ nhớ đệm (tên file theo sha1 của url, giữ đuôi)."""
    ext = os.path.splitext(urllib.parse.urlsplit(url).path)[1] or ".mp3"
    return download(url, cache_dir("audio") / (hashlib.sha1(url.encode()).hexdigest()[:16] + ext))
