#!/usr/bin/env python3
"""Sinh plans/lam-lai/anh-xa.md: mỗi trang của site cũ thuộc nhóm menu nào, đợt nào, lô nào ở site mới.

Chạy từ thư mục gốc của repo:  python3 plans/lam-lai/anh_xa.py > plans/lam-lai/anh-xa.md
Chỉ đọc. Đọc site cũ ở gốc repo cũ (opus-zero), hay ở thư mục cạnh ../opus-zero/ khi chạy trong repo mới (opus).
Tầng lấy từ plans/ben-vung/kiem_ke.py; thứ tự hướng dẫn nghe lấy từ nav trong mkdocs.yml;
chặng của bài học lấy từ bảng ở docs/piano/tac-pham/index.md.
"""
import collections
import importlib.util
import pathlib
import re
import subprocess
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
CU = ROOT if (ROOT / "docs").is_dir() else ROOT.parent / "opus-zero"  # site cũ: gốc repo cũ, hay thư mục cạnh
DOCS = CU / "docs"
spec = importlib.util.spec_from_file_location("kiem_ke", ROOT / "plans/ben-vung/kiem_ke.py")
kk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(kk)

# Bài học và hướng dẫn nghe cùng tác phẩm (tests/counts.py, lesson_guide_pairs) đi cùng một lô.
CAP = {"beethoven-anh-trang": "beethoven-moonlight", "liszt-liebestraum": "liszt-liebestraum",
       "pathetique-adagio": "beethoven-pathetique", "schubert-impromptu-sol-giang": "schubert-impromptu",
       "schumann-traumerei": "schumann-kinderszenen"}
PIANO_LO = {
    "L1": ["piano/index", "piano/tu-the", "piano/ban-do-ban-phim", "piano/hai-tuan-dau", "piano/10-bai-dau-tien"],
    "L2": ["piano/nam-ngon", "piano/gam", "piano/hop-am-rai", "piano/tieng-dan", "piano/ban-dap", "piano/not-hoa-my",
           "piano/hai-tay", "piano/quang-tam-buoc-nhay", "piano/not-lap-not-kep", "piano/bai-tap-ngon"],
    "L3": ["piano/cach-tap", "piano/thi-tau", "piano/hoc-thuoc-bieu-dien", "piano/choi-cung-nguoi-khac",
           "piano/suc-khoe", "piano/lich-su-dan", "piano/the-loai", "piano/nha-soan-nhac"],
    "L4": ["piano/hoa-am/index", "piano/hoa-am/ket", "piano/hoa-am/dem-giai-dieu", "piano/hoa-am/mau-galant",
           "piano/hoa-am/ung-tac"],
}
TEN_DOT = {2: "Khung cấp độ và lối vào", 3: "Nhạc lý và luyện tai", 4: "Piano nền tảng", 5: "Nhạc cổ điển nền tảng",
           6: "Tác phẩm", 7: "Công cụ, sách in, blog, Cập nhật", 8: "Tham chiếu có hạn và Đọc thêm"}


def nav_pages():
    class L(yaml.SafeLoader):
        pass
    L.add_multi_constructor("tag:yaml.org,2002:python/", lambda l, s, n: None)
    cfg = yaml.load(open(CU / "mkdocs.yml", encoding="utf-8"), Loader=L)
    out = []

    def walk(x):
        if isinstance(x, str):
            out.append(x[:-3])
        elif isinstance(x, dict):
            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
    walk(cfg["nav"])
    return out


def chang_bai_hoc():
    t = (DOCS / "piano/tac-pham/index.md").read_text(encoding="utf-8")
    out = {}
    for line in t.splitlines():
        m = re.search(r"\]\(([a-z0-9-]+)\.md\)", line)
        c = re.search(r"\(chặng (\d)\)", line)
        if m and c:
            out.setdefault(m.group(1), int(c.group(1)))
    return out


def nhom_menu(k, tang):
    muc = k.split("/")[0] if "/" in k else ""
    if k == "index":
        return "Trang chủ"
    if k in ("cap-nhat", "tai-nguyen", "tai-lieu-tham-khao", "bat-dau/sach-in") or muc == "blog":
        return "Thêm"
    if muc == "bat-dau":
        return "Bắt đầu"
    if k == "piano/lo-trinh":
        return "Lộ trình 7 chặng"
    if k.startswith("piano/tac-pham/") or muc == "nghe-nhac":
        return "Tác phẩm"
    if muc == "piano":
        return "Piano"
    if muc in ("nhac-ly", "luyen-tai"):
        return "Nhạc lý và luyện tai"
    if muc == "luyen-tap":
        return "Luyện tập"
    if tang == "ngoai-vi" or k == "nhac-cu/index":
        return "Đọc thêm"
    return "Nhạc cổ điển"


def main():
    pages = sorted(p.relative_to(DOCS).as_posix()[:-3] for p in DOCS.rglob("*.md"))
    tang = {k: kk.tang(k) for k in pages}
    gan = {}  # trang -> (đợt, lô)

    def dat(ds, dot, lo):
        for k in ds:
            assert k in tang, k
            assert k not in gan, (k, gan.get(k))
            gan[k] = (dot, lo)
    dat(["index", "bat-dau/index", "piano/lo-trinh", "bat-dau/bai-0", "bat-dau/kiem-tra-dau-vao", "bat-dau/lo-trinh-choi",
         "bat-dau/lo-trinh-nghe", "bat-dau/moi-ngay", "bat-dau/tom-tat"], 2, "L1")
    so = sorted(k for k in pages if re.match(r"nhac-ly/\d\d-", k))
    for i in range(4):
        dat(so[i * 8:(i + 1) * 8], 3, f"L{i + 1}")
    dat([k for k in pages if k.startswith("nhac-ly/") and k not in gan], 3, "L5")
    dat([k for k in pages if k.startswith("luyen-tai/")], 3, "L6")
    for lo, ds in PIANO_LO.items():
        dat(ds, 4, lo)
    dat([k for k in pages if k.startswith("lich-su/") and tang[k] != "ngoai-vi"], 5, "L1")
    dat([k for k in pages if k.startswith("hinh-thuc/")], 5, "L2")
    dat([k for k in pages if k.startswith("nhan-dien/")] + ["tai-lieu-tham-khao"], 5, "L3")
    chang = chang_bai_hoc()
    bai = sorted((k for k in pages if k.startswith("piano/tac-pham/") and not k.endswith("/index")),
                 key=lambda k: (chang[k.split("/")[-1]], k))
    for n in range(2, 8):
        ds = [k for k in bai if chang[k.split("/")[-1]] == n]
        ds += ["nghe-nhac/" + CAP[k.split("/")[-1]] for k in ds if k.split("/")[-1] in CAP]
        dat(ds, 6, f"L{n - 1}")
    nghe = [k for k in nav_pages() if k.startswith("nghe-nhac/") and not k.endswith("/index") and k not in gan]
    lo = 7
    for i in range(0, len(nghe), 8):
        dat(nghe[i:i + 8], 6, f"L{lo}")
        lo += 1
    dat(["piano/tac-pham/index", "nghe-nhac/index"], 6, f"L{lo - 1}")
    cc = sorted(k for k in pages if k.startswith("luyen-tap/"))
    dat(cc[:9], 7, "L1")
    dat(cc[9:], 7, "L2")
    dat([k for k in pages if k.startswith("blog/")] + ["cap-nhat", "bat-dau/sach-in"], 7, "L3")
    dat([k for k in pages if tang[k] == "tham-chieu"], 8, "L1")
    dat([k for k in pages if k.startswith("nhac-cu/")], 8, "L2")
    dat([k for k in pages if k.startswith("lich-su/") and tang[k] == "ngoai-vi"], 8, "L3")
    thieu = [k for k in pages if k not in gan]
    assert not thieu, thieu

    head = subprocess.run(["git", "-C", str(CU), "log", "-1", "--format=%h %ad", "--date=short"],
                          capture_output=True, text=True).stdout.strip()
    ten_tang = {"loi": "lõi", "tac-pham": "tác phẩm", "tham-chieu": "tham chiếu", "khung": "khung", "ngoai-vi": "ngoại vi"}
    out = []
    w = out.append
    w("# Ánh xạ trang cũ sang site mới")
    w("")
    w(f"Sinh bằng `python3 plans/lam-lai/anh_xa.py` trên commit `{head}`. Mỗi trang của site cũ thuộc đúng một lô. "
      "Đường dẫn giữ nguyên: `../opus-zero/docs/<trang>.md` (site cũ) thành `src/content/docs/<trang>.md` ở site mới; "
      "trên web, `/opus-zero/<trang>/` thành `/opus/<trang>/` (riêng bài blog: xem đợt 7 trong `README.md`). "
      "Tầng lấy từ `plans/ben-vung/kiem-ke.md`; bạn đổi tầng ở đó thì chạy lại script này.")
    w("")
    w("Ngoài các trang dưới đây, site mới có 8 trang mới sinh từ dữ liệu: 7 trang chặng `piano/lo-trinh/chang-1` đến "
      "`chang-7` (đợt 2) và danh mục `tac-pham` (đợt 6).")
    w("")
    w("## Tổng theo đợt")
    w("")
    w("| Đợt | Nội dung | Lô | Trang cũ |")
    w("|---|---|---|---|")
    theo_dot = collections.defaultdict(list)
    for k, (d, l) in gan.items():
        theo_dot[d].append(l)
    for d in sorted(theo_dot):
        w(f"| {d} | {TEN_DOT[d]} | {len(set(theo_dot[d]))} | {len(theo_dot[d])} |")
    w(f"| **Cộng** | | **{sum(len(set(v)) for v in theo_dot.values())}** | **{len(gan)}** |")
    for d in sorted(theo_dot):
        w("")
        w(f"## Đợt {d}. {TEN_DOT[d]}")
        los = sorted(set(theo_dot[d]), key=lambda s: int(s[1:]))
        for l in los:
            ds = [k for k, v in gan.items() if v == (d, l)]
            w("")
            w(f"### D{d}-{l} ({len(ds)} trang)")
            w("")
            w("| Trang cũ | Tầng | Nhóm menu mới |")
            w("|---|---|---|")
            for k in sorted(ds, key=lambda k: (k.endswith("/index"), k)):
                w(f"| `{k}` | {ten_tang[tang[k]]} | {nhom_menu(k, tang[k])} |")
    sys.stdout.write("\n".join(out) + "\n")


if __name__ == "__main__":
    main()
