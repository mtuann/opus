"""Ghi bản thu gợi ý vào bản ghi tác phẩm (ban_thu trong src/data/tac-pham.yml) và mốc tham khảo vào trang
(::khoi-nghe{moc="…"}). Đừng sửa tay hai chỗ này: lệnh kiểm giấy phép, file, độ dài và mốc trước khi ghi.

Mục đầu tiên là slug của bản ghi (fur-elise) hay một trang dùng bản ghi (piano/tac-pham/fur-elise,
nghe-nhac/x.md, src/content/docs/nghe-nhac/x.md).

    # bản thu Commons: lấy JSON từ commons.py rồi ghi
    python3 tools/audio/commons.py rec --by "Daniel Veesey" "File:A.ogg" > /tmp/rec.json
    python3 tools/audio/attach.py <slug> --json /tmp/rec.json

    # bản thu lưu trên site (sau transcode.py): mỗi --part là JSON một phần, theo thứ tự
    python3 tools/audio/attach.py grieg-arietta --by "Luis Kolodin" --lic "CC BY-SA 4.0" \\
        --source "https://imslp.org/wiki/File:...mp3" --part '{"mp3":"audio/grieg-arietta.mp3","d":86.83}'

    # bản thu chỉ dẫn link (file lớn, không lưu trên site, không phát trên trang): mỗi phần có link (trang tải ở nguồn),
    # src (trang file, để căn mốc tìm được file gốc trong _imslp/) và d (độ dài file ở link); mốc tính theo file ở link
    python3 tools/audio/attach.py mussorgsky-tranh --by "Chiara Bertoglio" --lic "CC BY 3.0" \\
        --source "https://imslp.org/wiki/<trang tác phẩm>" \\
        --part '{"link":"https://imslp.org/wiki/Special:ImagefromIndex/251520","src":"https://imslp.org/wiki/File:PMLP03722-Quadri.mp3","d":2023.95}'

    # chỉ ghi mốc tham khảo vào một trang (giây hay -, theo thứ tự các dòng của bảng "Theo dõi khi nghe")
    python3 tools/audio/attach.py piano/tac-pham/x --ref "1 13 - 33"
    python3 tools/audio/attach.py x --ref "1,13,null,33" --trang nghe-nhac/y    # bản ghi dùng ở hai trang

    # bỏ bản thu (khối nghe trống: người học tự dán link); mốc ở mọi trang dùng bản ghi cũng bị bỏ
    python3 tools/audio/attach.py <slug> --clear

Thay bản thu thì mốc cũ ở mọi trang dùng bản ghi bị bỏ (in ra để bạn biết), vì mốc của bản thu này không dùng được cho
bản khác. Chỉ khi thay bằng một file cùng nội dung (cùng bản thu, chuyển mã lại...) mới thêm --keep-ref để giữ mốc cũ.
Trang chưa chuyển sang site mới thì bỏ qua (mốc ghi khi trang có). Trang hay trường ban_thu đã khóa thì từ chối (mở
khóa trước). --dry-run: in phần sẽ ghi, không ghi.
"""
import argparse
import json
import re
import sys

import licenses
import page


def rec_problems(rec):
    """Lỗi của bản thu rec (danh sách rỗng là hợp lệ)."""
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
        if not isinstance(p.get("d"), (int, float)) or isinstance(p.get("d"), bool) or p["d"] <= 0:
            errs.append("phần %d: thiếu độ dài d (giây)" % i)
        if len(parts) > 1 and not p.get("t"):
            errs.append("phần %d: bản thu nhiều phần cần tên phần t" % i)
        if not link_only:
            try:
                f = page.local_file(p["mp3"])
            except ValueError as e:
                errs.append("phần %d: %s" % (i, e))
                continue
            if f is not None and not f.exists():
                errs.append("phần %d: không có file %s" % (i, f.relative_to(page.ROOT)))
    return errs


def moc_problems(rec, ref, text):
    """Lỗi của mốc ref (danh sách giây hay None) trên trang có chữ text, với bản thu rec."""
    if not ref:
        return []
    if not rec:
        return ["trang có mốc nhưng bản ghi không có bản thu (ban_thu)"]
    errs = []
    rows = page.listen_rows(text)
    if not rows:
        errs.append('có mốc nhưng trang không có bảng "Theo dõi khi nghe"')
    elif len(ref) > len(rows):
        errs.append("có %d mốc nhưng bảng chỉ có %d dòng" % (len(ref), len(rows)))
    end = page.total(rec)
    last = -1
    for i, x in enumerate(ref, 1):
        if x is None:
            continue
        if not isinstance(x, (int, float)) or isinstance(x, bool) or x < 0:
            errs.append("mốc %d không phải số giây: %r" % (i, x))
        elif x > end:
            errs.append("mốc %d (%s giây) nằm sau cuối bản thu (%.2f giây)" % (i, x, end))
        elif x < last:
            errs.append("mốc %d (%s) nhỏ hơn mốc trước (%s): các dòng của bảng đi theo thứ tự trong nhạc" % (i, x, last))
        else:
            last = x
    return errs


def target(arg):
    """(slug, trang được nêu hay None) từ mục đầu tiên của lệnh."""
    if "/" in arg or arg.endswith(".md"):
        md = page.md_path(arg, must_exist=False)
        return page.slug_of_page(md), page.rel(md)
    page.record(arg)
    return arg, None


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("muc", help="slug bản ghi (fur-elise) hay trang (piano/tac-pham/fur-elise)")
    ap.add_argument("--json", help="file JSON của bản thu (khóa by, note, lic, licUrl, page, parts; ref nếu có thì là mốc)")
    ap.add_argument("--by")
    ap.add_argument("--note")
    ap.add_argument("--lic", help='tên giấy phép, ví dụ "CC BY-SA 4.0" (link giấy phép tự điền nếu không có --lic-url)')
    ap.add_argument("--lic-url")
    ap.add_argument("--source", dest="src_page", help="page: trang mô tả file hoặc trang tác phẩm ở nguồn")
    ap.add_argument("--part", action="append", default=[], help="JSON một phần {t, mp3, src, d} hoặc {t, link, src, d} (chỉ dẫn link), theo thứ tự")
    ap.add_argument("--ref", help='mốc tham khảo, ví dụ "1 13 - 33" (hay "1,13,null,33")')
    ap.add_argument("--trang", help="trang nhận mốc --ref khi bản ghi dùng ở hai trang")
    ap.add_argument("--keep-ref", action="store_true", help="giữ mốc cũ khi thay bằng file cùng nội dung")
    ap.add_argument("--clear", action="store_true", help="bỏ bản thu (khối nghe trống)")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)

    slug, named = target(a.muc)
    if a.trang:
        named = page.rel(page.md_path(a.trang, must_exist=False))
    recs = page.records()
    if named and named not in page.pages_of(slug, recs):
        sys.exit("attach: trang %s không dùng bản ghi %s" % (named, slug))
    ban_thu = list(page.record(slug, recs).get("ban_thu") or [])
    old = ban_thu[0] if ban_thu else None
    # các trang dùng bản ghi này đã có trên site mới
    pages = {pid: page.md_path(pid, must_exist=False) for pid in page.pages_of(slug, recs)}
    pages = {pid: md for pid, md in pages.items() if md.exists()}

    replacing = bool(a.json or a.part or a.clear)
    edit_rec = replacing or any(x is not None for x in (a.by, a.note, a.lic, a.lic_url, a.src_page))
    json_ref = None
    if a.clear:
        rec = None
    elif edit_rec:
        if a.json:
            with open(a.json, encoding="utf-8") as f:
                rec = json.load(f)
            json_ref = rec.pop("ref", None)
        elif a.part:
            rec = {k: (old or {}).get(k) for k in ("by", "lic", "licUrl", "page")}
            rec["parts"] = [json.loads(p) for p in a.part]
        elif old:
            rec = dict(old)
        else:
            sys.exit("attach: bản ghi %s chưa có bản thu; cần --json hoặc --part" % slug)
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
        try:
            rec = page.normalize(rec)
        except ValueError as e:
            sys.exit("attach: " + str(e))
        errs = rec_problems(rec)
        if errs:
            sys.exit("attach: bản thu của %s:\n  - %s" % (slug, "\n  - ".join(errs)))
    else:
        rec = old
        if a.ref is None:
            sys.exit("attach: không có gì để ghi (cần --json, --part, --ref, --clear hay sửa một trường)")

    # mốc mới của từng trang: thay bản thu thì bỏ mốc cũ (trừ --keep-ref)
    plan = {}
    for pid, md in pages.items():
        text = md.read_text(encoding="utf-8")
        try:
            _, cur = page.find_listen(text)
        except ValueError as e:
            if replacing or a.ref is not None:
                sys.exit("attach: %s: %s" % (pid, e))
            continue
        ref = cur
        if replacing and cur:
            if a.keep_ref and rec:
                if abs(page.total(old) - page.total(rec)) > 2:
                    print("attach: chú ý: tổng độ dài đổi từ %.1f thành %.1f giây; kiểm tra lại mốc cũ của %s" % (
                        page.total(old), page.total(rec), pid), file=sys.stderr)
            else:
                print('attach: %s: đã bỏ mốc cũ "%s" (thêm --keep-ref nếu file mới cùng nội dung)' % (pid, page.format_moc(cur)), file=sys.stderr)
                ref = None
        plan[pid] = (text, ref)
    want_ref = a.ref if a.ref is not None else (",".join("null" if x is None else str(x) for x in json_ref) if json_ref else None)
    if want_ref is not None:
        if rec is None:
            sys.exit("attach: --ref cần bản thu (bản ghi %s không có ban_thu)" % slug)
        pid = named if named else (next(iter(plan)) if len(plan) == 1 else None)
        if pid is None:
            sys.exit("attach: bản ghi %s dùng ở %s: chọn trang bằng --trang" % (
                slug, ", ".join(plan) or "trang chưa có trên site mới (chuyển trang trước rồi ghi mốc)"))
        if pid not in plan:
            sys.exit("attach: trang %s chưa có trên site mới, hay không có dòng ::khoi-nghe" % pid)
        try:
            plan[pid] = (plan[pid][0], page.parse_moc(want_ref))
        except ValueError as e:
            sys.exit("attach: --ref: %s" % e)

    errs = [("%s: %s" % (pid, e)) for pid, (text, ref) in plan.items() for e in moc_problems(rec, ref, text)]
    if errs:
        sys.exit("attach: không ghi:\n  - " + "\n  - ".join(errs))

    # khóa: trường ban_thu hay trang đã khóa thì không ghi
    new_ban_thu = ([rec] + ban_thu[1:]) if rec else ban_thu[1:]
    rec_changes = [page.normalize(b) for b in new_ban_thu] != [page.normalize(b) for b in ban_thu]
    changed = {}
    for pid, (text, ref) in plan.items():
        new = page.set_moc(text, ref)
        if new != text:
            changed[pid] = new
    locked = []
    if rec_changes and page.field_locked(slug, "ban_thu"):
        locked.append("bản ghi tac-pham/%s đã khóa trường ban_thu: %s" % (slug, page.unlock_hint("du-lieu/tac-pham/" + slug)))
    locked += ["trang %s đã khóa: %s" % (pid, page.unlock_hint(pid)) for pid in changed if page.page_locked(pid)]
    if locked:
        sys.exit("attach: không ghi:\n  - " + "\n  - ".join(locked))

    data = page.DATA.relative_to(page.ROOT)
    if a.dry_run:
        if rec_changes:
            print("\n".join(page.dump_field("ban_thu", [page.normalize(b) for b in new_ban_thu])) if new_ban_thu else "(bỏ ban_thu)")
        for pid, text in changed.items():
            print("%s: %s" % (pid, page.find_listen(text)[0].group(0)))
        return
    if rec_changes:
        page.write_recordings(slug, new_ban_thu)
        print("%s: đã %s ban_thu của %s" % (data, "ghi" if rec else "bỏ", slug))
    for pid, text in changed.items():
        pages[pid].write_text(text, encoding="utf-8")
        ref = page.find_listen(text)[1]
        print("%s: %s" % (pid, "đã ghi %d mốc" % len([x for x in ref if x is not None]) if ref else "đã bỏ mốc"))
    if not rec_changes and not changed:
        print("%s: không đổi" % slug)
    missing = [pid for pid in page.pages_of(slug, recs) if pid not in pages]
    if missing and rec:
        print("chú ý: %s chưa có trên site mới; khi chuyển trang thì ghi mốc bằng --ref" % ", ".join(missing), file=sys.stderr)


if __name__ == "__main__":
    main()
