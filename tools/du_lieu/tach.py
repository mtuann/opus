#!/usr/bin/env python3
"""Tách một lần năm bộ dữ liệu của site mới (src/data/*.yml) từ site cũ ở ../opus-zero/docs/ (việc D1.2).

Chạy từ thư mục gốc của repo:  python3 tools/du_lieu/tach.py [--ghi-de] > /tmp/tach.md
Ghi src/data/cap-do.yml, tac-pham.yml, nha-soan-nhac.yml, thuat-ngu.yml, trang.yml; in ra (Markdown) các chỗ site cũ
tự mâu thuẫn và các chỗ script không tự quyết, để chép vào báo cáo. Chỉ đọc ../opus-zero/ (file và lịch sử git).
Trường hinh của tac-pham.yml (sơ đồ các đoạn, từ ../opus-zero/tools/figures.py) thêm ở việc D1.3.

src/data/ đã có dữ liệu thì script từ chối ghi, trừ khi có cờ --ghi-de. Chỉ ghi đè trước khi dữ liệu được kiểm định;
từ đợt 2, src/data/ sửa tay theo hồ sơ kiểm định.
Cần PyYAML (requirements.txt).
"""
import ast
import collections
import importlib.util
import pathlib
import posixpath
import re
import subprocess
import sys
import unicodedata

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
CU = ROOT.parent / "opus-zero"
DOCS = CU / "docs"
OUT = ROOT / "src" / "data"
HEAD = ("# Sinh một lần bằng tools/du_lieu/tach.py từ ../opus-zero/docs/ (commit {commit}), việc D1.2.\n"
        "# Chưa kiểm định, chưa khóa. Từ nay sửa tay; trường và kiểu: src/du-lieu.mjs.\n")

TEP = ("cap-do.yml", "trang.yml", "thuat-ngu.yml", "nha-soan-nhac.yml", "tac-pham.yml")
bao = collections.defaultdict(list)  # mục báo cáo -> các dòng
BASE = "/opus/"


def link_moi(chu, trang):
    """Link Markdown tới file .md của site cũ, tương đối với trang `trang` (như "nhac-ly/tu-dien"), thành địa chỉ trên
    site mới (/opus/…/; trang mục lục là thư mục), như tools/chuyen/ làm với trang (AGENTS.md, mục "Link nội bộ")."""
    def doi(m):
        p = posixpath.normpath(posixpath.join(posixpath.dirname(trang), m.group(1)))
        p = "" if p == "index" else p.removesuffix("/index")
        return f"]({BASE}{p + '/' if p else ''}{m.group(2) or ''})"
    return re.sub(r"\]\(([^)\s#:]+)\.md(#[^)\s]*)?\)", doi, chu)


def doc(rel):
    return (DOCS / rel).read_text(encoding="utf-8")


def bo_code(t):
    """Chữ của trang sau khi thay mỗi khối code (```…```) bằng một dấu cách, để năm trong khuông nhạc không bị quét."""
    return re.sub(r"^ *```.*?^ *```", " ", t, flags=re.M | re.S)


def o_bang(line):
    """Các ô của một dòng bảng Markdown (bỏ thụt đầu dòng)."""
    return [c.strip() for c in line.strip().strip("|").split("|")]


def bang_sau(t, tieu_de):
    """Các hàng (đã tách ô) của bảng có dòng tiêu đề bắt đầu bằng `tieu_de`, kể cả bảng thụt 4 dấu cách."""
    m = re.search(r"^( *)" + re.escape(tieu_de) + r".*\n\1\|[-| :]+\|\n((?:\1\|.*\n?)+)", t, re.M)
    return [o_bang(x) for x in m.group(2).splitlines()] if m else None


def khong_dau(s):
    s = s.replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", khong_dau(s).lower()).strip("-")


# ---------- Ghi YAML: bản ghi dạng khối, danh sách ngắn (chip, hàng bảng) dạng một dòng ----------
class Dumper(yaml.SafeDumper):
    pass


def _seq(d, data):
    flow = all(not isinstance(x, (list, dict)) for x in data)
    return d.represent_sequence("tag:yaml.org,2002:seq", data, flow_style=flow)


def _map(d, data):
    return d.represent_mapping("tag:yaml.org,2002:map", data.items(), flow_style=False)


Dumper.add_representer(list, _seq)
Dumper.add_representer(dict, _map)


def ghi(ten, ban_ghi, commit, them=""):
    OUT.mkdir(parents=True, exist_ok=True)
    text = yaml.dump(ban_ghi, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1_000_000)
    (OUT / ten).write_text(HEAD.format(commit=commit) + them + "\n" + text, encoding="utf-8")


# ---------- cap-do.yml: 7 chặng ----------
def cap_do():
    hang = bang_sau(doc("piano/lo-trinh.md"), "| Chặng | Tương đương")
    lv = (CU / "tests" / "levels.py").read_text(encoding="utf-8")
    stages = {int(k): (lab, int(a), int(b)) for k, lab, a, b in re.findall(r'(\d): \("([^"]+)", (\d), (\d)\)', lv)}
    js = (DOCS / "assets" / "js" / "practice.js").read_text(encoding="utf-8")
    ten_js = re.findall(r'\["([^"]+)", "[^"]+"\]', js.split("const SUGGEST")[0])
    recs = []
    for r in hang:
        so, ten = re.match(r"(\d)\. (.+)", r[0]).groups()
        so = int(so)
        nhan, tu, den = stages[so]
        if ten_js[so - 1] != ten:
            bao["Chặng"].append(f"Chặng {so}: tên ở `piano/lo-trinh.md` là \"{ten}\", ở `practice.js` là \"{ten_js[so - 1]}\".")
        recs.append({"id": so, "ten": ten, "nhan_grade": nhan, "tuong_duong": r[1], "grade_tu": tu, "grade_den": den,
                     "moc_thoi_gian": r[2], "thoi_luong": r[3]})
    return recs


# ---------- trang.yml: tầng của mọi trang (theo plans/ben-vung/kiem_ke.py) ----------
def trang():
    spec = importlib.util.spec_from_file_location("kiem_ke", ROOT / "plans" / "ben-vung" / "kiem_ke.py")
    kk = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(kk)
    recs = []
    for p in sorted(DOCS.rglob("*.md")):
        k = p.relative_to(DOCS).as_posix()[:-3]
        r = {"id": k, "tang": kk.tang(k)}
        if r["tang"] == "tham-chieu":
            m = re.match(r"(\d{4}-\d{2})(?: \((.+)\))?$", kk.THAM_CHIEU[k])
            r["ra_lai"] = m.group(1)
            if m.group(2):
                r["ly_do_ra_lai"] = m.group(2)
        recs.append(r)
    return recs


# ---------- thuat-ngu.yml: các bảng của nhac-ly/tu-dien.md ----------
def thuat_ngu():
    recs, nhom = [], None
    for line in doc("nhac-ly/tu-dien.md").splitlines():
        if line.startswith("## "):
            nhom = line[3:].strip()
        elif line.startswith("| ") and not line.startswith("| Thuật ngữ"):
            tn, nghia, ghi = o_bang(line)
            r = {"id": slug(tn), "thuat_ngu": tn, "nghia": link_moi(nghia, "nhac-ly/tu-dien")}
            if ghi:
                r["ghi_chu"] = link_moi(ghi, "nhac-ly/tu-dien")
            r["nhom"] = nhom
            recs.append(r)
    return recs


# ---------- nha-soan-nhac.yml: mọi người có năm sinh–mất trên site ----------
HAT = {"van", "von", "de", "di", "da", "del", "der", "des", "le", "la", "du", "y", "d'", "d’"}
# Chữ viết hoa đứng trước "(năm–năm)" mà không phải tên người: thời kỳ, tác phẩm, năm…
KHONG_PHAI_TEN = {"Thời", "Năm", "Bài", "Bản", "Tập", "Grade", "Op.", "Sonata", "Septet", "Concerto", "Giao", "Nhạc",
                  "Baroque", "Trung", "Phục", "Cổ", "Lãng", "Thế", "Đương", "Chương", "Quyển", "Wikipedia", "Lyric",
                  "Pieces", "Album", "Bộ", "Opera", "Vở", "Tứ", "Ngũ", "Tổ", "Messiah", "Requiem", "Etude", "Étude"}
TEN_VN = re.compile(r"[đĐăĂâÂêÊôÔơƠưƯẠ-ỹ]")
NAM = re.compile(r"\((khoảng |k\. )?(\d{3,4})\s*[–-]\s*(\d{3,4})(?:[,;][^)]*)?\)")
# "(sinh 1941)", "(sinh năm 1935, Estonia)", "(sinh 1958 ở Hà Nội)", "(tên thật Lee Ru-ma, sinh 1978)"
SONG = re.compile(r"\((?:[^()]*?, )?sinh(?: năm)? (\d{4})(?:[^)\d][^)]*)?\)")


def la_tu_ten(tok):
    """Từ có thể thuộc một tên người: viết hoa chữ đầu (kể cả chữ tắt "J."), hoặc tiểu từ như van, von, de."""
    return tok in HAT or (tok[0].isupper() and re.fullmatch(r"[^\W\d_][\w’'.-]*", tok) is not None)


def ten_truoc(t, i):
    """Tên người nằm ngay trước vị trí i (chỗ mở ngoặc của năm), hoặc None.

    Đi lùi qua các từ của tên, cách nhau đúng một dấu cách; dừng ở dấu câu, dấu bảng, dấu ** hay đầu dòng.
    """
    j = i
    while j > 0 and t[j - 1] in " *":
        j -= 1
    toks = []
    while True:
        m = re.search(r"([^\s|*()\[\],;:]+)$", t[:j])
        if not m:
            break
        tok = m.group(1)
        if tok in KHONG_PHAI_TEN:
            return None
        if not la_tu_ten(tok):
            break
        toks.insert(0, tok)
        j = m.start()
        if j > 1 and t[j - 1] == " " and t[j - 2] not in " |*\n#>":
            j -= 1
            continue
        break
    while toks and toks[0] in HAT:
        toks.pop(0)
    return " ".join(toks) if toks else None


# Chữ đứng trước "(năm–năm)" mà script nhận nhầm là tên người (địa danh, tác phẩm, nhà in), đã xem từng chỗ.
KHONG_PHAI_NGUOI = {"Children's Corner", "Härtel", "Kim Trọng Thúy Kiều", "Köthen", "Leipzig", "Music-Meister", "Paris",
                    "Parnassum", "Trent"}
# Tên người nhưng năm trong ngoặc là năm sáng tác, không phải năm sinh–mất: (tên, trang)
NAM_KHAC = {("Ligeti", "piano/the-loai")}
# Cách viết khác của cùng một người -> tên chuẩn
BI_DANH = {"J. S. Bach": "Johann Sebastian Bach", "W. A. Mozart": "Wolfgang Amadeus Mozart",
           "L. van Beethoven": "Ludwig van Beethoven", "G. F. Handel": "George Frideric Handel",
           "P. I. Tchaikovsky": "Pyotr Ilyich Tchaikovsky", "Felix Mendelssohn Bartholdy": "Felix Mendelssohn",
           "Fanny Mendelssohn Hensel": "Fanny Mendelssohn"}
# id đặt tay: người cùng họ với người khác, tên có tiểu từ, người quen gọi bằng tên riêng
ID = {"Johann Sebastian Bach": "bach", "Carl Philipp Emanuel Bach": "cpe-bach", "Wolfgang Amadeus Mozart": "mozart",
      "Leopold Mozart": "leopold-mozart", "Robert Schumann": "schumann", "Clara Schumann": "clara-schumann",
      "Felix Mendelssohn": "mendelssohn", "Fanny Mendelssohn": "fanny-mendelssohn",
      "Nadia Boulanger": "nadia-boulanger", "Lili Boulanger": "lili-boulanger", "Hildegard von Bingen": "hildegard",
      "Josquin des Prez": "josquin", "Élisabeth Jacquet de La Guerre": "jacquet-de-la-guerre", "Lang Lang": "lang-lang",
      "Max Richter": "max-richter"}


def nha_soan_nhac():
    """Bản ghi người và các lần nhắc (để báo mâu thuẫn). Nguồn: bảng dòng thời gian và mọi chỗ "Tên (năm–năm)"."""
    moc = {}
    for r in bang_sau(doc("lich-su/dong-thoi-gian.md"), "| Nhà soạn nhạc | Sinh | Mất"):
        moc[r[0]] = (int(r[1]), int(r[2]) if r[2] else None, r[3])
    lan = []  # (tên như viết, sinh, mất, khoảng, trang)
    for p in sorted(DOCS.rglob("*.md")):
        k = p.relative_to(DOCS).as_posix()[:-3]
        t = bo_code(p.read_text(encoding="utf-8"))
        for m in NAM.finditer(t):
            ten = ten_truoc(t, m.start())
            if ten and ten not in KHONG_PHAI_NGUOI and (ten, k) not in NAM_KHAC:
                lan.append((ten, int(m.group(2)), int(m.group(3)), bool(m.group(1)), k))
        for m in SONG.finditer(t):
            ten = ten_truoc(t, m.start())
            if ten and ten not in KHONG_PHAI_NGUOI:
                lan.append((ten, int(m.group(1)), None, False, k))
        # Bảng có cột "Năm sinh" (ví dụ lich-su/duong-dai.md): tên ở cột đầu, bỏ phần trong ngoặc (nước)
        for bang in re.finditer(r"^\|([^\n]*\| Năm sinh \|[^\n]*)\n\|[-| :]+\|\n((?:\|.*\n?)+)", t, re.M):
            cot = o_bang(bang.group(1)).index("Năm sinh")
            for hang in bang.group(2).splitlines():
                o = o_bang(hang)
                ten = re.sub(r"\s*\([^)]*\)$", "", o[0]).strip("* ")
                ns = re.fullmatch(r"(\d{4})(?:\s*[–-]\s*(\d{4}))?", o[cot])
                if ns and ten:
                    lan.append((ten, int(ns.group(1)), int(ns.group(2)) if ns.group(2) else None, False, k))
    for ten, (s, d, _) in moc.items():
        lan.append((ten, s, d, False, "lich-su/dong-thoi-gian"))

    # Gộp: tên đầy đủ (từ hai chữ trở lên, không viết tắt) là một người; bí danh, tên một chữ theo họ
    def chuan(ten):
        return BI_DANH.get(ten, ten)
    day_du = {chuan(x[0]) for x in lan if len(chuan(x[0]).split()) > 1 and not re.search(r"\b[A-Z]\.", chuan(x[0]))}
    theo_ho = collections.defaultdict(set)
    for ten in day_du:
        theo_ho[ten.split()[-1]].add(ten)
    nguoi = collections.defaultdict(list)
    for ten, s, d, kh, k in lan:
        c = chuan(ten)
        if c not in day_du and len(c.split()) == 1 and len(theo_ho.get(c, ())) == 1:
            c = next(iter(theo_ho[c]))
        nguoi[c].append((ten, s, d, kh, k))
    recs, dung_id = [], {}
    for ten in sorted(nguoi, key=lambda x: min(n[1] for n in nguoi[x])):
        ds = nguoi[ten]
        nam = sorted({(s, d) for _, s, d, _, _ in ds}, key=lambda x: (x[0], x[1] or 0))
        if ten in ID:
            i = ID[ten]
        elif TEN_VN.search(ten) or len(ten.split()) == 1:
            i = slug(ten)
        else:
            i = slug(ten.split()[-1])
        if i in dung_id:
            bao["Nhà soạn nhạc: id trùng"].append(f"`{i}`: {dung_id[i]} và {ten}; cần đặt id tay.")
            i = slug(ten)
        dung_id[i] = ten
        r = {"id": i, "ten": ten}
        if len(nam) == 1:
            r["sinh"], r["mat"] = nam[0]
            if any(kh for _, _, _, kh, _ in ds):
                r["khoang"] = True
        else:
            r["mau_thuan"] = [{"sinh": s, "mat": d, "trang": sorted({k for _, s2, d2, _, k in ds if (s2, d2) == (s, d)})}
                              for s, d in nam]
            ct = "; ".join(f"{s}–{d or ''} ({', '.join('`' + k + '`' for k in m['trang'])})"
                           for (s, d), m in zip(nam, r["mau_thuan"]))
            bao["Nhà soạn nhạc: năm khác nhau cho cùng người"].append(f"{ten}: {ct}.")
        cach_viet = sorted({t for t, *_ in ds} - {ten})
        if cach_viet:
            r["cach_viet_khac"] = cach_viet
        tk = next((v[2] for k, v in moc.items() if chuan(k) == ten), None)
        if tk:
            r["thoi_ky"] = tk
        recs.append(r)
    return recs


# ---------- tac-pham.yml: một bản ghi cho mỗi tác phẩm có bài học hay hướng dẫn nghe ----------
DANH_MUC = re.compile(r"(BWV Anh\. \d+|BWV \d+|Anh\. \d+(?: số \d+)?|Op\. \d+(?: số \d+)?|K\. \d+|WoO \d+"
                      r"|D\. \d+(?: số \d+)?|B\. \d+|S\. \d+(?: số \d+)?|L\. \d+|Hob\. [IVXL]+:\d+|HWV \d+|RV \d+)")
# Bài học và hướng dẫn nghe về đúng một tác phẩm (luật 4: một tác phẩm, một bản ghi): hướng dẫn dùng bản ghi của bài học
CUNG_TAC_PHAM = {"liszt-liebestraum": "nghe-nhac/liszt-liebestraum",
                 "schubert-impromptu-sol-giang": "nghe-nhac/schubert-impromptu",
                 "beethoven-anh-trang": "nghe-nhac/beethoven-moonlight"}
# Bài học có hướng dẫn nghe cho cả tác phẩm lớn hơn (piano/tac-pham/index.md, mục "Nghe kèm"): mỗi trang một bản ghi
NGHE_KEM = {"schumann-traumerei": "nghe-nhac/schumann-kinderszenen",
            "pathetique-adagio": "nghe-nhac/beethoven-pathetique"}
GIONG = re.compile(r"(Đô|Rê|Mi|Fa|Sol|La|Si)[♯♭]? (trưởng|thứ)")
NHIP = re.compile(r"\d+/\d+")
KHONG_PHAI_TAC_PHAM = {"index", "mau", "doc-ten-tac-pham", "nghe-gi-tiep"}  # trang trong nghe-nhac/ không về một tác phẩm


def link_hang(hang):
    """(chữ của link, đường dẫn trang không có .md) ở ô đầu của một hàng bảng."""
    m = re.match(r"\[(.+?)\]\(([^)#]+)\.md\)", hang[0])
    return (m.group(1), m.group(2)) if m else (None, None)


def tac_pham(nguoi):
    ten_ve_id = {}
    for r in nguoi:
        for t in [r["ten"], *r.get("cach_viet_khac", [])]:
            ten_ve_id[t] = r["id"]
    ho_ve_id = collections.defaultdict(set)
    for r in nguoi:
        ho_ve_id[r["ten"].split()[-1]].add(r["id"])

    def tim_tac_gia(o, rel):
        """id người từ ô "Nhà soạn nhạc" của bảng thông tin; (id, gán cho, khuyết danh)."""
        if o.startswith("Khuyết danh"):
            return None, False, True
        gan = o.startswith("Gán cho ")
        ten = re.match(r"(?:Gán cho )?([^(,.]+?)\s*\(", o)
        ten = ten.group(1).strip() if ten else o.split(",")[0].strip()
        if ten in ten_ve_id:
            return ten_ve_id[ten], gan, False
        ids = ho_ve_id.get(ten.split()[-1], set())
        if len(ids) == 1:
            return next(iter(ids)), gan, False
        bao["Tác phẩm: không tìm ra tác giả"].append(f"`{rel}`: ô Nhà soạn nhạc \"{o}\".")
        return None, gan, False

    def bo_tien_to(chu, tac_gia):
        """Bỏ "Tên: " ở đầu tên tác phẩm khi đó là họ của tác giả."""
        m = re.match(r"([^:*\[]{2,40}): (.+)$", chu)
        if m and tac_gia and m.group(1).split()[-1] in {x["ten"].split()[-1] for x in nguoi if x["id"] == tac_gia}:
            return m.group(2)
        return chu

    # Các nguồn danh sách của site cũ
    js = (DOCS / "assets" / "js" / "practice.js").read_text(encoding="utf-8")
    goi_y = set(re.findall(r'\["piano/tac-pham/([a-z0-9-]+)/"', js))
    chang_cap, chang = {}, None
    for line in doc("piano/tac-pham-theo-cap.md").splitlines():
        m = re.match(r"## Chặng (\d)", line)
        if m:
            chang = int(m.group(1))
        elif line.startswith("## "):
            chang = None
        elif chang and line.startswith("| "):
            # bài thuộc chặng khi link tới nó nằm ở ô đầu của một hàng trong mục "## Chặng N" (như tests/levels.py cũ)
            for sl in re.findall(r"\]\(tac-pham/([a-z0-9-]+)\.md", o_bang(line)[0]):
                chang_cap[sl] = chang
    chi_muc_bai = {}
    for h in bang_sau(doc("piano/tac-pham/index.md"), "| Tác phẩm | Cấp (≈)"):
        chu, dich = link_hang(h)
        chi_muc_bai[dich] = (chu, h)
    chi_muc_nghe = {}
    t = doc("nghe-nhac/index.md")
    for m in re.finditer(r"^\| Tác phẩm \| Thời kỳ \| Luyện nghe \|\n\|[-|]+\|\n((?:\|.*\n?)+)", t, re.M):
        for line in m.group(1).splitlines():
            h = o_bang(line)
            chu, dich = link_hang(h)
            chi_muc_nghe[dich[3:] if dich.startswith("../") else "nghe-nhac/" + dich] = (chu, h)

    recs = []
    for p in sorted((DOCS / "piano" / "tac-pham").glob("*.md")):
        sl = p.stem
        if sl == "index":
            continue
        rel = "piano/tac-pham/" + sl
        t = p.read_text(encoding="utf-8")
        tt = dict(bang_sau(t, "| Mục | Thông tin |") or [])
        tg, gan, kd = tim_tac_gia(tt.get("Nhà soạn nhạc", ""), rel)
        chu, h = chi_muc_bai[sl]
        gm = re.match(r"(.+?) \(chặng (\d)\)$", h[1])
        if int(gm.group(2)) != chang_cap.get(sl):
            bao["Tác phẩm: chặng khác nhau"].append(
                f"`{rel}`: chặng {gm.group(2)} ở `piano/tac-pham/index.md`, chặng {chang_cap.get(sl)} ở `piano/tac-pham-theo-cap.md`.")
        r = {"slug": sl, "loai": "bai-hoc"}
        if tg:
            r["tac_gia"] = tg
        if gan:
            r["gan_cho"] = True
        if kd:
            r["khuyet_danh"] = True
        r["ten"] = bo_tien_to(chu, tg)
        dm = DANH_MUC.search(chu) or DANH_MUC.search(tt.get("Tác phẩm", ""))
        if dm:
            r["danh_muc"] = dm.group(1)
        khoi = re.search(r'<div class="oz-piece" markdown>\n(.*?)\n</div>', t, re.S)
        chip = []
        for m in re.finditer(r'<span class="oz-chip( oz-chip--level)?">(.*?)</span>', khoi.group(1) if khoi else ""):
            chip.append({"cap_do": m.group(2)} if m.group(1) else m.group(2))
        # Giọng, nhịp: lấy ở dòng "Giọng · nhịp · tốc độ" khi dòng đúng dạng ba phần; bài nhiều chương hay nhiều bài
        # thì lấy ở chip đầu (chip ghi giọng chính); không có thì để trống và ghi vào báo cáo
        gnt = [x.strip() for x in tt.get("Giọng · nhịp · tốc độ", "").split(" · ")]
        if re.match(r"I\.|Số \d", gnt[0]):  # dòng tả từng chương hay từng bài: giọng, nhịp của phần đầu không đại diện
            gnt = [""]
        chip0 = [x.strip() for x in (chip[0] if chip and isinstance(chip[0], str) else "").split(" · ")]
        giong = next((x[0] for x in (gnt, chip0) if GIONG.fullmatch(x[0])), None)
        nhip = next((x[1] for x in (gnt, chip0) if len(x) > 1 and NHIP.fullmatch(x[1])), None)
        if giong:
            r["giong"] = giong
        if nhip:
            r["nhip"] = nhip
        if not (GIONG.fullmatch(gnt[0]) and len(gnt) > 1 and NHIP.fullmatch(gnt[1])):
            bao["Tác phẩm: dòng giọng · nhịp không đúng dạng ba phần"].append(
                f"`{rel}`: giong {giong or '(trống)'}, nhip {nhip or '(trống)'}"
                + (" (lấy ở chip)" if giong and not GIONG.fullmatch(gnt[0]) or nhip and not (len(gnt) > 1 and NHIP.fullmatch(gnt[1])) else "") + ".")
        r["thoi_ky"] = h[2]
        r["chang"] = chang_cap.get(sl, int(gm.group(2)))
        r["grade"] = gm.group(1)
        r["ky_nang_chinh"] = h[3]
        if sl in goi_y:
            r["goi_y"] = True
        cap = CUNG_TAC_PHAM.get(sl) or NGHE_KEM.get(sl)
        if cap:
            r["cap"] = cap
        nghe = chi_muc_nghe.get(CUNG_TAC_PHAM.get(sl)) or chi_muc_nghe.get(rel)
        if nghe:
            r["luyen_nghe"] = nghe[1][2]
        r["chip"] = chip
        r["thong_tin"] = [[k, link_moi(v, rel)] for k, v in tt.items()]
        recs.append(r)

    for p in sorted((DOCS / "nghe-nhac").glob("*.md")):
        sl = p.stem
        rel = "nghe-nhac/" + sl
        if sl in KHONG_PHAI_TAC_PHAM or rel in CUNG_TAC_PHAM.values():
            continue
        t = p.read_text(encoding="utf-8")
        tt = dict(bang_sau(t, "| Mục | Thông tin |") or [])
        tg, gan, kd = tim_tac_gia(tt.get("Nhà soạn nhạc", ""), rel)
        chu, h = chi_muc_nghe.get(rel, (None, None))
        if chu is None:
            bao["Tác phẩm: hướng dẫn nghe không có trong nghe-nhac/index.md"].append(f"`{rel}`")
            chu = re.search(r"^# (.+)$", t, re.M).group(1)
        r = {"slug": sl, "loai": "nghe"}
        if tg:
            r["tac_gia"] = tg
        r["ten"] = bo_tien_to(chu, tg)
        # trang về nhiều tác phẩm (các phần cách nhau bằng ";"): ghép số danh mục đầu tiên của từng phần
        dong = tt.get("Tên đầy đủ", "") or tt.get("Tác phẩm", "")
        dm = list(dict.fromkeys(m.group(1) for m in (DANH_MUC.search(x) for x in dong.split(";")) if m))
        if not dm and DANH_MUC.search(chu):
            dm = [DANH_MUC.search(chu).group(1)]
        if not dm:  # vài trang chỉ ghi số danh mục ở dòng khác, ví dụ Erlkönig: "1815, … (D. 328)"
            for muc, noi in tt.items():
                m = DANH_MUC.search(noi) if muc not in ("Nhà soạn nhạc", "Tên đầy đủ", "Tác phẩm") else None
                if m:
                    dm = [m.group(1)]
                    bao["Tác phẩm: số danh mục lấy ở dòng khác"].append(f"`{rel}`: {m.group(1)}, ở dòng \"{muc}\".")
                    break
        if dm:
            r["danh_muc"] = ", ".join(dm)
        if h:
            r["thoi_ky"] = h[1]
            r["luyen_nghe"] = h[2]
        cap = next((("piano/tac-pham/" + k) for k, v in NGHE_KEM.items() if v == rel), None)
        if cap:
            r["cap"] = cap
        recs.append(r)
    return recs


# ---------- hinh: sơ đồ các đoạn của tác phẩm (form_map trong ../opus-zero/tools/figures.py), việc D1.3 ----------
def so_do_hinh():
    """Tên hình (p-…, g-…) -> danh sách sơ đồ {chu_thich, doan, ghi_chu}. Đọc mã cũ bằng ast, không chạy nó."""
    cay = ast.parse((CU / "tools" / "figures.py").read_text(encoding="utf-8"))

    def cac_form_map(nut):
        """Các lời gọi form_map(...) trong một biểu thức: form_map(...) hay "".join([form_map(...), ...])."""
        if isinstance(nut, ast.Call) and getattr(nut.func, "id", None) == "form_map":
            return [nut]
        if isinstance(nut, ast.Call) and isinstance(nut.func, ast.Attribute) and nut.func.attr == "join":
            ds = nut.args[0]
            if isinstance(ds, (ast.List, ast.Tuple)):
                out = []
                for e in ds.elts:
                    r = cac_form_map(e)
                    if r is None:
                        return None
                    out += r
                return out
        return None

    hinh = {}
    for d in (n for n in ast.walk(cay) if isinstance(n, ast.Dict)):
        for k, v in zip(d.keys, d.values):
            if not (isinstance(k, ast.Constant) and isinstance(k.value, str) and re.match(r"[pg]-", k.value)):
                continue
            goi = cac_form_map(v)
            if goi is None:
                bao["Hình: không đọc được"].append(f"`{k.value}`: không phải form_map")
                continue
            so_do = []
            for g in goi:
                chu_thich, doan, *ghi_chu = [ast.literal_eval(a) for a in g.args]
                x = {"chu_thich": chu_thich, "doan": [list(o) for o in doan]}
                if ghi_chu and ghi_chu[0]:
                    x["ghi_chu"] = ghi_chu[0]
                so_do.append(x)
            hinh[k.value] = so_do
    return hinh


def them_hinh(recs):
    """Thêm trường hinh: sơ đồ ở trang bài học (khóa bai-hoc) và ở trang hướng dẫn nghe (khóa nghe) của bản ghi.
    Hình thuộc trang chứa vùng <!-- fig:… --> của nó, kể cả khi tên hình mở đầu bằng g- mà nằm ở trang bài học."""
    hinh = so_do_hinh()
    da_dung = set()
    for r in recs:
        trang = {r["loai"]: ("piano/tac-pham/" if r["loai"] == "bai-hoc" else "nghe-nhac/") + r["slug"]}
        if r.get("cap") in CUNG_TAC_PHAM.values():  # hướng dẫn nghe dùng chung bản ghi của bài học
            trang["nghe"] = r["cap"]
        h = {}
        for loai, rel in trang.items():
            ten = re.findall(r"<!-- fig:([pg]-[a-z0-9-]+) -->", doc(rel + ".md"))
            thieu = [t for t in ten if t not in hinh]
            if thieu:
                bao["Hình: trang dùng hình không có trong figures.py"].append(f"`{rel}`: {', '.join(thieu)}")
            ds = [x for t in ten if t in hinh for x in hinh[t]]
            da_dung.update(ten)
            if ds:
                h[loai] = ds
        if h:
            r["hinh"] = h
    thua = sorted(set(hinh) - da_dung)
    if thua:
        bao["Hình: có trong figures.py nhưng không trang tác phẩm nào dùng"].append(", ".join(f"`{t}`" for t in thua))
    return recs


def main():
    if any((OUT / f).exists() for f in TEP) and "--ghi-de" not in sys.argv:
        sys.exit("src/data/ đã có dữ liệu. Chỉ ghi đè trước khi dữ liệu được kiểm định: chạy lại với --ghi-de.")
    commit = subprocess.run(["git", "-C", str(CU), "log", "-1", "--format=%h"], capture_output=True, text=True).stdout.strip()
    ghi("cap-do.yml", cap_do(), commit)
    ghi("trang.yml", trang(), commit)
    ghi("thuat-ngu.yml", thuat_ngu(), commit)
    nguoi = nha_soan_nhac()
    ghi("nha-soan-nhac.yml", nguoi, commit)
    ghi("tac-pham.yml", them_hinh(tac_pham(nguoi)), commit,
        "# Trường hinh thêm ở D1.3, từ form_map trong ../opus-zero/tools/figures.py.\n")
    for muc, dong in bao.items():
        print(f"### {muc}\n")
        for d in dong:
            print(f"- {d}")
        print()


if __name__ == "__main__":
    main()
