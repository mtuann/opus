"""Ghi khối bản thu <div class="oz-listen" data-rec="…"></div> vào một trang.

    # bản thu Commons: lấy JSON từ commons.py rồi ghi
    python3 tools/audio/commons.py rec --by "Daniel Veesey" "File:A.ogg" > /tmp/rec.json
    python3 tools/audio/attach.py docs/nghe-nhac/x.md --json /tmp/rec.json

    # bản thu lưu trên site (sau transcode.py): mỗi --part là JSON một phần, theo thứ tự
    python3 tools/audio/attach.py docs/piano/tac-pham/x.md --by "Luis Kolodin" --lic "CC BY-SA 4.0" \\
        --source "https://imslp.org/wiki/File:...mp3" --part '{"mp3":"../../../assets/audio/x.mp3","d":87.88}'

    # bản thu chỉ dẫn link (file lớn, không lưu trên site, không phát trên trang): mỗi phần có link (trang tải ở nguồn),
    # src (trang file, để căn mốc tìm được file gốc trong _imslp/) và d (độ dài file ở link); mốc tính theo file ở link
    python3 tools/audio/attach.py docs/nghe-nhac/x.md --by "Chiara Bertoglio" --lic "CC BY 3.0" \\
        --source "https://imslp.org/wiki/<trang tác phẩm>" \\
        --part '{"link":"https://imslp.org/wiki/Special:ImagefromIndex/251520","src":"https://imslp.org/wiki/File:PMLP03722-Quadri.mp3","d":2023.95}'

    # chỉ ghi mốc tham khảo (giây hoặc null, theo thứ tự các dòng của bảng "Theo dõi khi nghe")
    python3 tools/audio/attach.py docs/piano/tac-pham/x.md --ref "1,13,null,33"

    # trả về khối trống (người học tự dán link)
    python3 tools/audio/attach.py docs/nghe-nhac/x.md --clear

Thay bản thu thì mốc cũ bị bỏ (in ra để bạn biết), vì mốc của bản thu này không dùng được cho bản khác.
Chỉ khi thay bằng một file cùng nội dung (cùng bản thu, chuyển mã lại...) mới thêm --keep-ref để giữ mốc cũ.
--dry-run: in khối mới, không ghi.
"""
import argparse
import json
import re
import sys

import licenses
import page


def problems(md, rec, text):
    """Lỗi của khối bản thu rec trên trang md (danh sách rỗng là hợp lệ)."""
    errs = ["licUrl/lic: " + e for e in licenses.check(rec.get("lic", ""), rec.get("licUrl", ""))]
    if not rec.get("by"):
        errs.append("thiếu by (người chơi)")
    if not rec.get("page"):
        errs.append("thiếu page (trang mô tả file hoặc trang tác phẩm ở nguồn)")
    parts = rec.get("parts") or []
    if not parts:
        errs.append("thiếu parts")
    link_only = bool(parts) and all(not p.get("mp3") and p.get("link") for p in parts)
    for i, p in enumerate(parts, 1):
        if link_only:                                  # bản thu chỉ dẫn link: link tới trang file ở nguồn, không phát
            if not re.match(r"^https?://", p["link"]):
                errs.append("phần %d: link phải là URL đầy đủ: %s" % (i, p["link"]))
        elif not p.get("mp3"):
            errs.append("phần %d: thiếu mp3 (bản thu chỉ dẫn link thì mọi phần có link, không phần nào có mp3)" % i)
            continue
        if not isinstance(p.get("d"), (int, float)) or p["d"] <= 0:
            errs.append("phần %d: thiếu độ dài d (giây)" % i)
        if len(parts) > 1 and not p.get("t"):
            errs.append("phần %d: bản thu nhiều phần cần tên phần t" % i)
        if not link_only:
            f = page.local_file(md, p["mp3"])
            if f is not None and not f.exists():
                errs.append("phần %d: không có file %s" % (i, f))
    ref = rec.get("ref") or []
    rows = page.listen_rows(text)
    if ref and not rows:
        errs.append('có ref nhưng trang không có bảng "Theo dõi khi nghe"')
    if len(ref) > len(rows):
        errs.append("ref có %d mốc nhưng bảng chỉ có %d dòng" % (len(ref), len(rows)))
    total = sum(p.get("d") or 0 for p in parts)
    last = -1
    for i, x in enumerate(ref, 1):
        if x is None:
            continue
        if not isinstance(x, (int, float)) or x < 0:
            errs.append("mốc %d không phải số giây: %r" % (i, x))
        elif x > total + 1:
            errs.append("mốc %d (%s giây) nằm sau cuối bản thu (%.0f giây)" % (i, x, total))
        elif x < last:
            errs.append("mốc %d (%s) nhỏ hơn mốc trước (%s): các dòng của bảng đi theo thứ tự trong nhạc" % (i, x, last))
        else:
            last = x
    return errs


def parse_ref(s):
    out = []
    for x in s.split(","):
        x = x.strip()
        out.append(None if x in ("", "null", "None", "-") else (int(x) if x.lstrip("-").isdigit() else float(x)))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("page", help="trang .md, ví dụ docs/nghe-nhac/x.md")
    ap.add_argument("--json", help="file JSON của khối bản thu (khóa by, note, lic, licUrl, page, parts, ref)")
    ap.add_argument("--by")
    ap.add_argument("--note")
    ap.add_argument("--lic", help='tên giấy phép, ví dụ "CC BY-SA 4.0" (link giấy phép tự điền nếu không có --lic-url)')
    ap.add_argument("--lic-url")
    ap.add_argument("--source", dest="src_page", help="page: trang mô tả file hoặc trang tác phẩm ở nguồn")
    ap.add_argument("--part", action="append", default=[], help="JSON một phần {t, mp3, src, d} hoặc {t, link, src, d} (chỉ dẫn link), theo thứ tự")
    ap.add_argument("--ref", help='mốc tham khảo, ví dụ "1,13,null,33"')
    ap.add_argument("--keep-ref", action="store_true", help="giữ mốc cũ khi thay bằng file cùng nội dung")
    ap.add_argument("--clear", action="store_true", help="trả về khối trống")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    md = page.md_path(a.page)
    text = md.read_text(encoding="utf-8")
    try:
        m, old = page.find_block(text)
    except ValueError as e:
        sys.exit("attach: %s: %s" % (page.rel(md), e))

    if a.clear:
        rec = None
    else:
        old = old or {}
        replacing = bool(a.json or a.part)
        if a.json:
            with open(a.json, encoding="utf-8") as f:
                rec = json.load(f)
        elif a.part:
            rec = {k: old.get(k) for k in ("by", "lic", "licUrl", "page")}
            rec["parts"] = [json.loads(p) for p in a.part]
        elif old:
            rec = dict(old)
        else:
            sys.exit("attach: trang chưa có bản thu; cần --json hoặc --part")
        if a.by:
            rec["by"] = a.by
        if a.note is not None:
            rec["note"] = a.note
        if a.lic:
            try:
                rec["lic"], url = licenses.parse(a.lic)
            except ValueError as e:
                sys.exit("attach: " + str(e))
            rec["licUrl"] = a.lic_url or url
        elif a.lic_url:
            rec["licUrl"] = a.lic_url
        if a.src_page:
            rec["page"] = a.src_page
        if replacing and "ref" not in rec and old.get("ref"):
            if a.keep_ref:
                d_old = sum(p.get("d") or 0 for p in old["parts"])
                d_new = sum(p.get("d") or 0 for p in rec["parts"])
                if abs(d_old - d_new) > 2:
                    print("attach: chú ý: tổng độ dài đổi từ %.1f thành %.1f giây; kiểm tra lại mốc cũ" % (d_old, d_new), file=sys.stderr)
                rec["ref"] = old["ref"]
            else:
                print("attach: đã bỏ mốc cũ %s (thêm --keep-ref nếu file mới cùng nội dung)" % json.dumps(old["ref"]), file=sys.stderr)
        if a.ref is not None:
            rec["ref"] = parse_ref(a.ref)
        try:
            rec = page.normalize(rec)
        except ValueError as e:
            sys.exit("attach: " + str(e))
        errs = problems(md, rec, text)
        if errs:
            sys.exit("attach: %s:\n  - %s" % (page.rel(md), "\n  - ".join(errs)))

    out = page.block(rec)
    if a.dry_run:
        print(out)
        return
    if out == m.group(0):
        print("%s: không đổi" % page.rel(md))
        return
    md.write_text(text[:m.start()] + out + text[m.end():], encoding="utf-8")
    n = len([x for x in (rec or {}).get("ref", []) if x is not None])
    print("%s: đã ghi khối bản thu%s" % (page.rel(md), " (%d mốc)" % n if rec else " trống"))


if __name__ == "__main__":
    main()
