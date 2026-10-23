#!/usr/bin/env python3
"""Sinh plans/ben-vung/kiem-ke.md: tầng đề xuất và số liệu của từng trang của site cũ.

Chạy từ thư mục gốc của repo:  python3 plans/ben-vung/kiem_ke.py > plans/ben-vung/kiem-ke.md
Chỉ đọc (file và lịch sử git), không sửa gì. Đọc site cũ ở gốc repo cũ (opus-zero), hay ở thư mục cạnh
../opus-zero/ khi chạy trong repo mới (opus); lịch sử git lấy từ chính repo của site cũ. Ở việc D1.2 của
plans/lam-lai/README.md, bảng tầng dưới đây chuyển thành src/data/trang.yml.
"""
import collections
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
CU = ROOT if (ROOT / "docs").is_dir() else ROOT.parent / "opus-zero"  # site cũ: gốc repo cũ, hay thư mục cạnh
DOCS = CU / "docs"

# Tầng đề xuất. Mặc định: lõi. Ngoại lệ liệt kê ở đây (đường dẫn trong docs/, không có .md).
THAM_CHIEU = {  # đổi theo thời gian: rà theo ngày ghi bên cạnh
    "piano/thay-va-thi": "2027-01 (chương trình ABRSM 2027–2028)",
    "piano/tac-pham-theo-cap": "2027-01 (danh sách bài thi ABRSM)",
    "piano/chon-dan": "2027-10",
    "piano/nghe-si": "2027-10",
    "bat-dau/hoi-dap": "2027-04",
    "bat-dau/ung-dung": "2027-04",
    "tai-nguyen": "2027-04",
}
NGOAI_VI = {"lich-su/opera", "lich-su/nhac-truyen-thong-viet-nam", "lich-su/viet-nam", "lich-su/duong-dai",
            "lich-su/nu-nha-soan-nhac"}
KHUNG = {"index", "cap-nhat", "bat-dau/index", "bat-dau/sach-in", "piano/index", "piano/tac-pham/index",
         "nghe-nhac/index", "nhac-ly/index", "lich-su/index", "hinh-thuc/index", "nhan-dien/index",
         "luyen-tai/index", "nhac-cu/index"}
TEN_TANG = {"loi": "Lõi", "tac-pham": "Tác phẩm", "tham-chieu": "Tham chiếu có hạn", "khung": "Khung và công cụ",
            "ngoai-vi": "Ngoại vi"}
CACH = {"loi": "Kiểm định một lần rồi khóa (đợt 2–5)",
        "tac-pham": "Kiểm định từng trang rồi khóa (trang có sẵn: đợt 6; trang mới: them-tac-pham.md)",
        "tham-chieu": "Rà theo ngày ghi trong cột Rà lại (chuyển ở đợt 8)",
        "khung": "Sinh từ dữ liệu; kiểm thử tự động (chuyển cùng đợt với mục của nó)",
        "ngoai-vi": "Vào mục Đọc thêm với dòng \"ngoài lộ trình\" (chuyển ở đợt 8)"}


def tang(k):
    muc = k.split("/")[0] if "/" in k else ""
    if k in KHUNG or muc in ("luyen-tap", "blog"):
        return "khung"
    if k in THAM_CHIEU:
        return "tham-chieu"
    if k in NGOAI_VI or muc == "nhac-cu":
        return "ngoai-vi"
    if k.startswith("piano/tac-pham/") or muc == "nghe-nhac":
        return "tac-pham"
    return "loi"


def nhom_loi(k):
    muc = k.split("/")[0] if "/" in k else "(gốc)"
    return {"nhac-ly": "Nhạc lý", "luyen-tai": "Luyện tai", "piano": "Piano nền tảng", "bat-dau": "Bắt đầu",
            "hinh-thuc": "Nhạc cổ điển nền tảng", "lich-su": "Nhạc cổ điển nền tảng",
            "nhan-dien": "Nhạc cổ điển nền tảng"}.get(muc, "Tài liệu tham khảo")


def lich_su_git():
    # Chỉ tính commit thêm hoặc sửa trang (A, M), không tính commit xóa.
    log = subprocess.run(["git", "-C", str(CU), "log", "--no-renames", "--diff-filter=AM", "--format=tformat:@@",
                          "--name-only"],
                         capture_output=True, text=True).stdout
    dem = collections.Counter(line.strip() for line in log.splitlines() if line.strip() and line != "@@")
    return dem


def do_trang(p, dem):
    t = p.read_text(encoding="utf-8")
    abc = re.findall(r"^```abc\n(.*?)^```", t, re.M | re.S)
    soan = sum(1 for b in abc if "soạn cho trang này" in (re.search(r"^T:(.*)$", b, re.M) or [None, ""])[1])
    than = re.sub(r"^```.*?^```", " ", t, flags=re.M | re.S)
    than = re.sub(r"<[^>]+>", " ", than)
    rel = "docs/" + p.relative_to(DOCS).as_posix()  # đường dẫn trong lịch sử git của site cũ
    return dict(k=p.relative_to(DOCS).as_posix()[:-3], chu=len(re.findall(r"\w+", than)), abc=len(abc), soan=soan,
                nguon=bool(re.search(r"^## Nguồn", t, re.M)), ban_thu="data-rec" in t, sua=dem.get(rel, 0))


def main():
    dem = lich_su_git()
    rows = [do_trang(p, dem) for p in sorted(DOCS.rglob("*.md"))]
    for r in rows:
        r["tang"] = tang(r["k"])
    head = subprocess.run(["git", "-C", str(CU), "log", "-1", "--format=%h %ad", "--date=short"],
                          capture_output=True, text=True).stdout.strip()
    out = []
    w = out.append
    w("# Kiểm kê trang: tầng đề xuất và số liệu")
    w("")
    w(f"Sinh bằng `python3 plans/ben-vung/kiem_ke.py` trên commit `{head}`. Đây là **đề xuất**: bạn duyệt tầng của từng "
      "trang, nhất là các trang tham chiếu có hạn và ngày rà lại; sau khi duyệt, việc D1.2 của `plans/lam-lai/README.md` "
      "chuyển bảng này thành `src/data/trang.yml`. Đường dẫn trang tính trong `docs/` của site cũ (từ repo mới là "
      "`../opus-zero/docs/`).")
    w("")
    w("Cột: **Chữ** là số chữ ngoài khối code; **Khuông** là số khối ABC (trong ngoặc: số khối ghi \"soạn cho trang này\"); "
      "**Nguồn** là trang có mục `## Nguồn`; **Sửa** là số commit đã thêm hoặc sửa trang ở site cũ.")
    w("")
    w("## Tổng theo tầng")
    w("")
    w("| Tầng | Trang | Chữ | Khuông | Thiếu mục Nguồn | Giữ đúng bằng cách |")
    w("|---|---|---|---|---|---|")
    for t in TEN_TANG:
        rs = [r for r in rows if r["tang"] == t]
        w(f"| {TEN_TANG[t]} | {len(rs)} | {sum(r['chu'] for r in rs):,} | {sum(r['abc'] for r in rs)} | "
          f"{sum(not r['nguon'] for r in rs)} | {CACH[t]} |".replace(",", "."))
    w(f"| **Cộng** | **{len(rows)}** | **{sum(r['chu'] for r in rows):,}** | **{sum(r['abc'] for r in rows)}** | "
      f"**{sum(not r['nguon'] for r in rows)}** | |".replace(",", "."))
    w("")
    w("## Quy tắc xếp tầng")
    w("")
    w("- **Lõi:** nền tảng nhạc lý, luyện tai, piano (kỹ thuật, cách tập, hòa âm bên phím, lộ trình 7 chặng), nhạc cổ điển "
      "(thời kỳ, hình thức, nhận diện, nhà soạn nhạc) và các trang bắt đầu. Nội dung ít đổi theo thời gian.")
    w("- **Tác phẩm:** mỗi trang viết về một tác phẩm hoặc một tập: bài học trong `piano/tac-pham/`, hướng dẫn nghe "
      "trong `nghe-nhac/`. Thêm mới theo `them-tac-pham.md`.")
    w("- **Tham chiếu có hạn:** nội dung đổi theo thời gian (chương trình thi, ứng dụng, giá đàn, tài nguyên). "
      "Cột Rà lại là ngày đề xuất.")
    w("- **Khung và công cụ:** trang chủ, trang mục lục, trang công cụ luyện tập, nhật ký Cập nhật, blog. "
      "Danh sách và con số trong các trang này sẽ sinh từ dữ liệu.")
    w("- **Ngoại vi:** ngoài trọng tâm piano cổ điển: nhạc cụ khác, opera, nhạc Việt Nam, nhạc đương đại, nữ nhà soạn nhạc. "
      "Vào mục Đọc thêm (đã chọn ngày 23/10/2026).")
    for t in TEN_TANG:
        rs = [r for r in rows if r["tang"] == t]
        w("")
        w(f"## {TEN_TANG[t]} ({len(rs)} trang)")
        w("")
        if t == "loi":
            w("| Trang | Nhóm | Chữ | Khuông | Nguồn | Sửa |")
            w("|---|---|---|---|---|---|")
            for r in sorted(rs, key=lambda r: (nhom_loi(r["k"]), r["k"])):
                w(f"| `{r['k']}` | {nhom_loi(r['k'])} | {r['chu']} | {r['abc']} ({r['soan']}) | "
                  f"{'có' if r['nguon'] else '**thiếu**'} | {r['sua']} |")
        elif t == "tham-chieu":
            w("| Trang | Chữ | Nguồn | Sửa | Rà lại |")
            w("|---|---|---|---|---|")
            for r in rs:
                w(f"| `{r['k']}` | {r['chu']} | {'có' if r['nguon'] else '**thiếu**'} | {r['sua']} | {THAM_CHIEU[r['k']]} |")
        elif t == "tac-pham":
            w("| Trang | Loại | Chữ | Khuông | Bản thu | Nguồn | Sửa |")
            w("|---|---|---|---|---|---|---|")
            for r in rs:
                loai = "bài học" if r["k"].startswith("piano/") else "hướng dẫn nghe"
                w(f"| `{r['k']}` | {loai} | {r['chu']} | {r['abc']} ({r['soan']}) | {'có' if r['ban_thu'] else 'không'} | "
                  f"{'có' if r['nguon'] else '**thiếu**'} | {r['sua']} |")
        else:
            w("| Trang | Chữ | Khuông | Nguồn | Sửa |")
            w("|---|---|---|---|---|")
            for r in rs:
                w(f"| `{r['k']}` | {r['chu']} | {r['abc']} | {'có' if r['nguon'] else 'không'} | {r['sua']} |")
    sys.stdout.write("\n".join(out) + "\n")


if __name__ == "__main__":
    main()
