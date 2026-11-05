"""Đọc và ghi khối bản thu trên trang Markdown, dùng chung cho attach.py, check_audio.py và align/run.py.

Khối bản thu: <div class="oz-listen" data-rec="…"></div>, data-rec là JSON đã escape HTML, các khóa theo thứ tự
by, note, lic, licUrl, page, parts, ref (AGENTS.md, mục Khối đặc biệt). Mỗi phần trong parts: t, mp3, link, src, d;
phần chỉ có link (không có mp3) là bản thu chỉ dẫn link, không phát trên trang.
"""
import html
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
AUDIO = DOCS / "assets" / "audio"
ORDER = ("by", "note", "lic", "licUrl", "page", "parts", "ref")
PART_ORDER = ("t", "mp3", "link", "src", "d")
LISTEN = re.compile(r'<div class="oz-listen"(?: data-rec="([^"]*)")?></div>')
TABLE_HEAD = "## Theo dõi khi nghe"


def md_path(arg):
    """'docs/nghe-nhac/x.md', 'nghe-nhac/x.md', 'nghe-nhac/x' hoặc đường dẫn tuyệt đối -> Path của file .md."""
    p = Path(arg)
    if not p.is_absolute():
        p = ROOT / p if (ROOT / p).exists() else DOCS / p
    if p.suffix != ".md":
        p = p.with_suffix(".md")
    if not p.exists():
        raise SystemExit("không có trang: %s" % arg)
    return p.resolve()


def rel(md):
    """Đường dẫn của trang tính từ docs/, ví dụ 'piano/tac-pham/fur-elise.md'."""
    return Path(md).resolve().relative_to(DOCS).as_posix()


def url_dir(md):
    """Thư mục URL của trang đã build (use_directory_urls): docs/a/b.md -> docs/a/b, docs/a/index.md -> docs/a."""
    p = Path(md).resolve().with_suffix("")
    return p.parent if p.name == "index" else p


def asset_url(md, filename):
    """Đường dẫn tương đối từ trang tới docs/assets/audio/<filename>, ví dụ '../../../assets/audio/x.mp3'."""
    return os.path.relpath(AUDIO / filename, url_dir(md)).replace(os.sep, "/")


def local_file(md, mp3):
    """File trên máy ứng với link mp3 tương đối của trang (None nếu là URL)."""
    if re.match(r"^[a-z]+://", mp3):
        return None
    return Path(os.path.normpath(url_dir(md) / mp3))


def find_block(text):
    """(match, rec hoặc None) của khối bản thu duy nhất trên trang."""
    found = list(LISTEN.finditer(text))
    if len(found) != 1:
        raise ValueError("trang cần đúng một khối oz-listen, có %d" % len(found))
    m = found[0]
    return m, (json.loads(html.unescape(m.group(1))) if m.group(1) else None)


def normalize(rec):
    """Sắp khóa theo thứ tự quy ước, bỏ khóa rỗng (note, licUrl, t, src), bỏ các null ở cuối ref."""
    out = {}
    for k in ORDER:
        v = rec.get(k)
        if k == "parts":
            v = [{pk: p[pk] for pk in PART_ORDER if p.get(pk) not in (None, "")} for p in v or []]
        if k == "ref":
            v = list(v or [])
            while v and v[-1] is None:
                v.pop()
        if v not in (None, "", []):
            out[k] = v
    extra = set(rec) - set(ORDER)
    if extra:
        raise ValueError("khóa lạ trong data-rec: %s" % ", ".join(sorted(extra)))
    return out


def block(rec):
    """Chuỗi HTML của khối bản thu (rec=None: khối trống để người học tự dán link)."""
    if not rec:
        return '<div class="oz-listen"></div>'
    attr = html.escape(json.dumps(normalize(rec), ensure_ascii=False, separators=(",", ":")), quote=True)
    return '<div class="oz-listen" data-rec="%s"></div>' % attr


def listen_rows(text):
    """Các dòng của bảng ngay sau tiêu đề '## Theo dõi khi nghe' (bỏ dòng tiêu đề bảng và dòng ---),
    mỗi dòng là danh sách ô. Trang không có bảng thì trả về []."""
    i = text.find("\n" + TABLE_HEAD)
    if i < 0:
        return []
    rows, started = [], False
    for line in text[i + 1:].splitlines()[1:]:
        if line.startswith("## "):
            break
        if line.startswith("|"):
            started = True
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if not all(re.fullmatch(r":?-+:?", c) for c in cells):
                rows.append(cells)
        elif started and line.strip():
            break
    return rows[1:]
