"""Đọc và ghi bản thu của site mới, dùng chung cho attach.py, check_audio.py, transcode.py và align/.

Site cũ ghi cả bản thu lẫn mốc trong khối <div class="oz-listen" data-rec="…"> của trang. Site mới (D1.4, D6-0) tách
làm hai chỗ:

- Bản thu nằm trong bản ghi tác phẩm, trường ban_thu của src/data/tac-pham.yml (danh sách; khối nghe gợi ý bản đầu
  tiên). Mỗi bản thu cùng dạng data-rec cũ, khóa theo thứ tự by, note, lic, licUrl, page, parts; mỗi phần t, mp3, link,
  src, d. File lưu trên site viết audio/<tên>.mp3 (nằm ở public/audio/); phần chỉ có link (không có mp3) là bản thu chỉ
  dẫn link, không phát trên trang.
- Mốc tham khảo nằm trong trang, ở chỉ thị ::khoi-nghe{moc="2 12 - 41"} (số giây cho từng dòng của bảng "Theo dõi khi
  nghe" ngay sau, "-" là dòng chưa có mốc), vì bài học và hướng dẫn nghe dùng chung bản ghi nhưng mỗi trang có bảng
  riêng.

Một bản ghi được dùng ở trang chính (piano/tac-pham/<slug> hay nghe-nhac/<slug>) và ở trang cap khi trang ấy không có
bản ghi riêng (AGENTS.md, mục Dữ liệu).

Gốc repo mặc định là thư mục chứa tools/; đổi bằng biến OPUS_GOC hay set_root() (kiểm thử chạy trên thư mục tạm).
"""
import json
import os
import re
from pathlib import Path

import yaml

ROOT = DOCS = AUDIO = DATA = KHOA = None


def set_root(root):
    """Đặt gốc repo (và các đường dẫn tính từ đó)."""
    global ROOT, DOCS, AUDIO, DATA, KHOA
    ROOT = Path(root).resolve()
    DOCS = ROOT / "src" / "content" / "docs"
    AUDIO = ROOT / "public" / "audio"
    DATA = ROOT / "src" / "data" / "tac-pham.yml"
    KHOA = ROOT / "kiem-dinh" / "khoa.json"


set_root(os.environ.get("OPUS_GOC") or Path(__file__).resolve().parents[2])

ORDER = ("by", "note", "lic", "licUrl", "page", "parts")
PART_ORDER = ("t", "mp3", "link", "src", "d")
# Thứ tự trường của bản ghi tác phẩm như schema (src/du-lieu.mjs): trường mới chèn đúng chỗ
FIELD_ORDER = ("slug", "loai", "tac_gia", "gan_cho", "khuyet_danh", "ten", "thuoc", "danh_muc", "giong", "nhip", "nam",
               "thoi_ky", "chang", "grade", "ky_nang_chinh", "luyen_nghe", "an_ban", "doi_chieu", "cap", "ky_nang", "goi_y",
               "chip", "thong_tin", "hinh", "ban_thu", "them_ngay")
LISTEN = re.compile(r'^::khoi-nghe(?:\{moc="([^"]*)"\})?[ \t]*$', re.M)
TABLE_HEAD = "## Theo dõi khi nghe"
MP3 = re.compile(r"^audio/([a-z0-9]+(?:-[a-z0-9]+)*\.mp3)$")


# ---------- Trang ----------

def md_path(arg, must_exist=True):
    """'piano/tac-pham/x', 'piano/tac-pham/x.md', 'src/content/docs/piano/tac-pham/x.md' hay đường dẫn tuyệt đối ->
    Path của file .md trong src/content/docs/."""
    p = Path(arg)
    if not p.is_absolute():
        p = ROOT / p if str(p).startswith("src/content/docs/") else DOCS / p
    if p.suffix != ".md":
        p = p.with_suffix(".md")
    if must_exist and not p.exists():
        raise SystemExit("không có trang: %s (trang chưa chuyển sang site mới?)" % arg)
    return p.resolve()


def rel(md):
    """Đường dẫn trang tính từ src/content/docs/, không đuôi, ví dụ 'piano/tac-pham/fur-elise'."""
    return Path(md).resolve().relative_to(DOCS).with_suffix("").as_posix()


def frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    return (yaml.safe_load(m.group(1)) or {}) if m else {}


def find_listen(text):
    """(match, mốc hoặc None) của chỉ thị ::khoi-nghe duy nhất trên trang."""
    found = list(LISTEN.finditer(text))
    if len(found) != 1:
        raise ValueError("trang cần đúng một dòng ::khoi-nghe, có %d" % len(found))
    m = found[0]
    return m, (parse_moc(m.group(1)) if m.group(1) is not None else None)


def parse_moc(s):
    """'2 12 - 41' -> [2, 12, None, 41]. Cũng nhận dấu phẩy và null (cách viết ref cũ): '2,12,null,41'."""
    out = []
    for x in re.split(r"[\s,]+", s.strip()):
        if x in ("-", "null", "None"):
            out.append(None)
        elif re.fullmatch(r"\d+(\.\d+)?", x):
            out.append(int(x) if x.isdigit() else float(x))
        else:
            raise ValueError("mốc %r không phải số giây (dòng chưa có mốc ghi -)" % x)
    if not out or out == [None] * len(out):
        raise ValueError("mốc rỗng (không có mốc thì bỏ cả thuộc tính moc)")
    return out


def format_moc(ref):
    """[2, 12, None, 41.5] -> '2 12 - 41.5' (bỏ các dòng chưa có mốc ở cuối)."""
    ref = list(ref)
    while ref and ref[-1] is None:
        ref.pop()
    return " ".join("-" if x is None else ("%d" % x if float(x).is_integer() else repr(float(x))) for x in ref)


def listen_line(ref):
    """Dòng chỉ thị ::khoi-nghe với mốc ref (None hay toàn chưa có mốc: không có thuộc tính moc)."""
    s = format_moc(ref or [])
    return '::khoi-nghe{moc="%s"}' % s if s else "::khoi-nghe"


def set_moc(text, ref):
    m, _ = find_listen(text)
    return text[:m.start()] + listen_line(ref) + text[m.end():]


def listen_rows(text):
    """Các dòng của bảng ngay sau tiêu đề '## Theo dõi khi nghe' (bỏ dòng tiêu đề bảng và dòng ---), mỗi dòng là danh
    sách ô. Trang không có bảng thì trả về []."""
    i = text.find("\n" + TABLE_HEAD + "\n")
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


# ---------- Bản ghi ----------

def records():
    return yaml.safe_load(DATA.read_text(encoding="utf-8")) or []


def record(slug, recs=None):
    for r in recs if recs is not None else records():
        if r.get("slug") == slug:
            return r
    raise SystemExit("không có bản ghi %r trong %s" % (slug, DATA.relative_to(ROOT)))


def main_page(r):
    return ("piano/tac-pham/" if r["loai"] == "bai-hoc" else "nghe-nhac/") + r["slug"]


def pages_of(slug, recs=None):
    """Các trang dùng bản ghi: trang chính, và trang cap nếu trang ấy không có bản ghi riêng."""
    recs = records() if recs is None else recs
    r = record(slug, recs)
    out = [main_page(r)]
    if r.get("cap") and r["cap"] not in {main_page(x) for x in recs}:
        out.append(r["cap"])
    return out


def slug_of_page(md, recs=None):
    """Slug bản ghi của trang: tac_pham ở frontmatter; trang chưa có thì suy từ đường dẫn (trang chính hay trang cap)."""
    md = Path(md)
    if md.exists():
        s = frontmatter(md.read_text(encoding="utf-8")).get("tac_pham")
        if s:
            return s
    rp = rel(md)
    recs = records() if recs is None else recs
    for r in recs:
        if rp in pages_of(r["slug"], recs):
            return r["slug"]
    raise SystemExit("trang %s không gắn với bản ghi nào (thiếu tac_pham ở frontmatter)" % rp)


def recording(slug, recs=None):
    """Bản thu gợi ý (bản đầu tiên của ban_thu) hay None."""
    bt = record(slug, recs).get("ban_thu") or []
    return bt[0] if bt else None


def local_file(mp3):
    """File trong public/audio/ ứng với 'audio/x.mp3' (None nếu là URL). Đường dẫn khác thì ValueError."""
    if re.match(r"^[a-z]+://", mp3):
        return None
    m = MP3.match(mp3)
    if not m:
        raise ValueError("file lưu trên site phải viết audio/<tên>.mp3 (tên: chữ thường, số, gạch nối): %s" % mp3)
    return AUDIO / m.group(1)


def asset_url(filename):
    return "audio/" + filename


def normalize(rec):
    """Sắp khóa theo thứ tự quy ước, bỏ khóa rỗng (note, licUrl, t, src). Khóa lạ thì ValueError. ref (mốc, cách ghi của
    site cũ) bị bỏ: mốc nằm ở trang."""
    extra = set(rec) - set(ORDER) - {"ref"}
    if extra:
        raise ValueError("khóa lạ trong bản thu: %s" % ", ".join(sorted(extra)))
    out = {}
    for k in ORDER:
        v = rec.get(k)
        if k == "parts":
            for p in v or []:
                la = set(p) - set(PART_ORDER)
                if la:
                    raise ValueError("khóa lạ trong phần bản thu: %s" % ", ".join(sorted(la)))
            v = [{pk: p[pk] for pk in PART_ORDER if p.get(pk) not in (None, "")} for p in v or []]
        if v not in (None, "", []):
            out[k] = v
    return out


def total(rec):
    return sum(p.get("d") or 0 for p in (rec or {}).get("parts") or [])


# ---------- Ghi YAML: như tools/du_lieu/tach.py (bản ghi dạng khối, danh sách ngắn một dòng) ----------

class Dumper(yaml.SafeDumper):
    pass


def _seq(d, data):
    flow = all(not isinstance(x, (list, dict)) for x in data)
    return d.represent_sequence("tag:yaml.org,2002:seq", data, flow_style=flow)


def _map(d, data):
    return d.represent_mapping("tag:yaml.org,2002:map", data.items(), flow_style=False)


Dumper.add_representer(list, _seq)
Dumper.add_representer(dict, _map)


def dump_field(field, value):
    """Các dòng YAML của một trường bản ghi (thụt 2 dấu cách như trong tac-pham.yml)."""
    text = yaml.dump({field: value}, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1_000_000)
    return ["  " + line for line in text.splitlines()]


FIELD_LINE = re.compile(r"^  ([a-z_]+):")


def _record_span(lines, slug):
    """(dòng đầu, dòng sau cuối) của bản ghi slug trong tac-pham.yml."""
    start = next((i for i, l in enumerate(lines) if l.rstrip() == "- slug: %s" % slug), None)
    if start is None:
        raise SystemExit("không có bản ghi %r trong %s" % (slug, DATA.relative_to(ROOT)))
    end = start + 1
    while end < len(lines) and (lines[end].startswith("  ") or not lines[end].strip()):
        end += 1
    while end > start + 1 and not lines[end - 1].strip():
        end -= 1
    return start, end


def replace_field(text, slug, field, value):
    """Chữ mới của tac-pham.yml sau khi đặt trường field của bản ghi slug thành value (None: bỏ trường). Chỉ đổi các
    dòng của trường ấy; phần còn lại của file giữ nguyên từng ký tự."""
    if field not in FIELD_ORDER:
        raise ValueError("trường lạ: %s" % field)
    lines = text.split("\n")
    start, end = _record_span(lines, slug)
    fields = [(i, FIELD_LINE.match(lines[i]).group(1)) for i in range(start + 1, end) if FIELD_LINE.match(lines[i])]
    new = [] if value is None else dump_field(field, value)
    at = next((k for k, (_, f) in enumerate(fields) if f == field), None)
    if at is not None:
        a = fields[at][0]
        b = fields[at + 1][0] if at + 1 < len(fields) else end
    else:
        if value is None:
            return text
        rank = FIELD_ORDER.index(field)
        after = [i for i, f in fields if f in FIELD_ORDER and FIELD_ORDER.index(f) > rank]
        a = b = after[0] if after else end
    return "\n".join(lines[:a] + new + lines[b:])


def same_except(old, new, slug, ban_thu):
    """new giống old ở mọi chỗ, trừ ban_thu của bản ghi slug, và ban_thu ấy đúng là ban_thu (None: không có trường)."""
    if not isinstance(old, list) or not isinstance(new, list) or len(old) != len(new):
        return False
    for o, n in zip(old, new):
        if o.get("slug") != slug:
            if o != n:
                return False
            continue
        if {k: v for k, v in o.items() if k != "ban_thu"} != {k: v for k, v in n.items() if k != "ban_thu"}:
            return False
        if n.get("ban_thu") != ban_thu:
            return False
    return True


def write_recordings(slug, ban_thu):
    """Ghi ban_thu (danh sách bản thu; rỗng hay None: bỏ trường) cho bản ghi slug. Trả về True nếu file đổi."""
    text = DATA.read_text(encoding="utf-8")
    new = replace_field(text, slug, "ban_thu", [normalize(b) for b in ban_thu] if ban_thu else None)
    if not same_except(yaml.safe_load(text), yaml.safe_load(new), slug, [normalize(b) for b in ban_thu] if ban_thu else None):
        raise SystemExit("ghi %s không đúng (đọc lại khác dữ liệu định ghi, hay lệch ở chỗ khác); không ghi" % DATA.relative_to(ROOT))
    if new != text:
        DATA.write_text(new, encoding="utf-8")
    return new != text


# ---------- Khóa (kiem-dinh/khoa.json; plans/ben-vung/chuan-kiem-dinh.md mục 6) ----------

def _khoa():
    try:
        return json.loads(KHOA.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {"trang": {}, "ban_ghi": {}}


def page_locked(page_id):
    return page_id in (_khoa().get("trang") or {})


def field_locked(slug, field):
    """Trường field của bản ghi tác phẩm slug đang khóa (khóa cả bản ghi, hay khóa từng phần có trường ấy)."""
    for k in _khoa().get("ban_ghi") or {}:
        ban_ghi, _, truong = k.partition("#")
        if ban_ghi == "tac-pham/" + slug and (not truong or field in truong.split(",")):
            return True
    return False


def unlock_hint(muc):
    return 'mở khóa trước: node tools/khoa.mjs mo %s --ly-do "…" (plans/ben-vung/chuan-kiem-dinh.md mục 7)' % muc
