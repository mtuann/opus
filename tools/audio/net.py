"""Tải từ mạng một cách lịch sự, dùng chung cho các công cụ trong tools/audio.

- User-Agent kèm link repo, như AGENTS.md yêu cầu.
- Nghỉ khoảng 2,5 giây giữa hai yêu cầu tới cùng một máy chủ Wikimedia; thử lại khi gặp 429 hoặc 5xx,
  chờ theo Retry-After nếu máy chủ gửi. Khoảng nghỉ tính chung cho mọi tiến trình dùng cùng bộ nhớ đệm (nhiều
  công cụ chạy song song): thời điểm của yêu cầu gần nhất ghi trong throttle/<máy chủ>, khóa bằng flock.
- Bộ nhớ đệm ngoài repo: $OZ_AUDIO_CACHE, mặc định ~/.cache/opus-zero (hoặc $XDG_CACHE_HOME/opus-zero).
  Thư mục con: api/ (câu trả lời API), audio/ (bản thu tải về để căn mốc), scores/ (bản nhạc số), features/.
"""
import hashlib
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

UA = "OpusZeroBot/1.0 (https://github.com/mtuann/opus-zero)"
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
        except (urllib.error.URLError, TimeoutError) as e:
            print("  [lỗi mạng] %s: %s" % (host, e), file=sys.stderr)
            time.sleep(10 * (attempt + 1))
    raise RuntimeError("không tải được sau %d lần: %s" % (tries, url))


def get_json(url, cache=True):
    """JSON từ url, có bộ nhớ đệm (api/<sha1>.json). cache=False: luôn hỏi lại."""
    path = cache_dir("api") / (hashlib.sha1(url.encode()).hexdigest() + ".json")
    if cache and path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    data = json.loads(fetch(url))
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


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
