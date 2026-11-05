"""Tìm và tra bản thu trên Wikimedia Commons qua API, có bộ nhớ đệm (xem net.py).

    python3 tools/audio/commons.py search "Chopin nocturne op 9" [--limit 20]
    python3 tools/audio/commons.py info "File:FurElise.ogg" ["File:..." ...]
    python3 tools/audio/commons.py page "File:FurElise.ogg"
    python3 tools/audio/commons.py rec --by "Người chơi" "File:A.ogg" "File:B.ogg" --t "I. Allegro" --t "II. Adagio"

search: liệt kê file âm thanh khớp truy vấn, kèm độ dài, giấy phép (✓ được nhận, ✗ không) và có MP3 chuyển mã chưa.
        Mặc định 20 kết quả; chạm giới hạn thì tăng --limit hoặc đổi truy vấn (tên tác phẩm, số danh mục, người chơi).
info: thông tin đầy đủ của từng file (giấy phép, link giấy phép, trang mô tả, người chơi, MP3 chuyển mã, file gốc).
      "artist" của Commons nhiều khi là nhà soạn nhạc, không phải người chơi: đọc trang mô tả.
page: nội dung (wikitext) của trang mô tả file: mẫu giấy phép, mô tả, người chơi, ngày thu, nguồn, ghi chú.
rec: in JSON của khối bản thu (by, note, lic, licUrl, page, parts) cho các file đã chọn, theo đúng thứ tự phần,
     để đưa vào attach.py (--json). Báo lỗi nếu một file không có MP3, giấy phép không được nhận, hoặc các file
     khác giấy phép nhau.
--fresh: hỏi lại Commons, không dùng câu trả lời đã lưu (nên dùng khi chốt giấy phép).

Dấu ✓ chỉ nói giấy phép ghi trên Commons thuộc danh sách được nhận. Nó không cho biết file là người chơi thật hay
nhạc dựng từ MIDI ("synthesized"), thu năm nào (bản thu xuất bản ở Mỹ 1923–1946 còn bảo hộ 100 năm), có chơi trọn
tác phẩm không. Đọc trang mô tả (lệnh page) và nghe thử trước khi chọn.
"""
import argparse
import json
import re
import sys
import urllib.parse

import licenses
import net

API = "https://commons.wikimedia.org/w/api.php"
PROPS = {
    "prop": "imageinfo|videoinfo",
    "iiprop": "url|size|mime|extmetadata",
    "iiextmetadatafilter": "LicenseShortName|LicenseUrl|Artist|Credit|ImageDescription|DateTimeOriginal",
    "iiextmetadatalanguage": "en",
    "viprop": "derivatives",
}


FRESH = False                       # --fresh: không dùng câu trả lời đã lưu


def api(**params):
    params.update(format="json", formatversion="2")
    return net.get_json(API + "?" + urllib.parse.urlencode(params), cache=not FRESH)


def text(v):
    """Giá trị extmetadata thành chữ thường (bỏ thẻ HTML, gộp khoảng trắng)."""
    v = v.get("value", "") if isinstance(v, dict) else v
    if isinstance(v, dict):
        v = v.get("en") or next(iter(v.values()), "")
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", str(v or ""))).strip()


def bare(url):
    """Bỏ phần ?utm_... mà API gắn vào link file."""
    return (url or "").split("?")[0]


def row(p):
    """Một trang File: của API -> dict thông tin bản thu."""
    if p.get("missing") or not p.get("imageinfo"):
        return {"title": p.get("title"), "missing": True}
    ii, vi = p["imageinfo"][0], (p.get("videoinfo") or [{}])[0]
    em = ii.get("extmetadata") or {}
    raw_lic, raw_url = text(em.get("LicenseShortName")), text(em.get("LicenseUrl"))
    try:
        lic, url = licenses.parse(raw_lic)
        lic_url = raw_url if raw_url and not licenses.check(lic, raw_url) else url
        why = ""
    except ValueError as e:
        lic, lic_url, why = "", "", str(e)
    mime = ii.get("mime") or ""
    mp3 = [bare(x["src"]) for x in vi.get("derivatives", []) if x.get("transcodekey") == "mp3"]
    original = bare(ii.get("url"))
    if mime == "audio/mpeg":
        mp3, original = [original], ""
    return {
        "title": p["title"], "page": ii.get("descriptionurl"), "mime": mime, "d": round(float(ii.get("duration") or 0), 2),
        "lic_raw": raw_lic, "lic_url_raw": raw_url, "lic": lic, "licUrl": lic_url, "ok": not why, "why": why,
        "artist": text(em.get("Artist")), "credit": text(em.get("Credit")), "desc": text(em.get("ImageDescription")),
        "date": text(em.get("DateTimeOriginal")), "mp3": mp3[0] if mp3 else "", "src": original,
    }


def title(name):
    name = name.strip().replace("_", " ")
    return name if name.startswith("File:") else "File:" + name


def files(names):
    """Thông tin các file (tên có hoặc không có 'File:'), giữ thứ tự đầu vào."""
    names = [title(n) for n in names]
    found = {}
    for i in range(0, len(names), 50):
        d = api(action="query", titles="|".join(names[i:i + 50]), redirects="1", **PROPS)
        q = d.get("query", {})
        for p in q.get("pages", []):
            found[p["title"]] = row(p)
        # tên đã gửi -> tên chuẩn hóa -> tên đích nếu file đã đổi tên (đổi hướng)
        moved = {x["from"]: x["to"] for x in q.get("redirects", [])}
        for x in q.get("normalized", []) + q.get("redirects", []):
            target = moved.get(x["to"], x["to"])
            found.setdefault(x["from"], found.get(target, {"title": target, "missing": True}))
    return [found.get(n, {"title": n, "missing": True}) for n in names]


def wikitext(name):
    """Wikitext của trang mô tả file (chuỗi rỗng nếu không có)."""
    d = api(action="query", titles=title(name), prop="revisions", rvprop="content", rvslots="main", redirects="1")
    pages = d.get("query", {}).get("pages", [])
    revs = pages[0].get("revisions") if pages else None
    return revs[0]["slots"]["main"]["content"] if revs else ""


def search(query, limit=20):
    d = api(action="query", generator="search", gsrnamespace="6", gsrlimit=str(limit), gsrsearch="filetype:audio " + query, **PROPS)
    return sorted((row(p) for p in d.get("query", {}).get("pages", [])), key=lambda r: r["title"])


def rec(names, by, labels=(), note=""):
    """Khối bản thu (dict) cho các file Commons, mỗi file một phần. Lỗi thì báo ValueError."""
    rows = files(names)
    errs = []
    for r in rows:
        if r.get("missing"):
            errs.append("%s: không có trên Commons" % r["title"])
        elif not r["ok"]:
            errs.append("%s: %s" % (r["title"], r["why"]))
        elif not r["mp3"]:
            errs.append("%s: không có MP3 chuyển mã" % r["title"])
    lics = {(r.get("lic"), r.get("licUrl")) for r in rows}
    if not errs and len(lics) != 1:
        errs.append("các file khác giấy phép nhau: %s" % sorted(lics))
    if errs:
        raise ValueError("; ".join(errs))
    if labels and len(labels) != len(rows):
        raise ValueError("có %d file nhưng %d tên phần (--t)" % (len(rows), len(labels)))
    parts = [{"t": labels[i] if labels else "", "mp3": r["mp3"], "src": r["src"], "d": r["d"]} for i, r in enumerate(rows)]
    return {"by": by, "note": note, "lic": rows[0]["lic"], "licUrl": rows[0]["licUrl"], "page": rows[0]["page"], "parts": parts}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("search", help="tìm file âm thanh")
    s.add_argument("query")
    s.add_argument("--limit", type=int, default=20)
    i = sub.add_parser("info", help="thông tin từng file")
    i.add_argument("names", nargs="+")
    w = sub.add_parser("page", help="nội dung trang mô tả file")
    w.add_argument("name")
    r = sub.add_parser("rec", help="JSON khối bản thu cho attach.py")
    r.add_argument("names", nargs="+")
    r.add_argument("--by", required=True, help="người chơi, ghi như trên trang")
    r.add_argument("--note", default="", help="ghi chú, ví dụ 'file dừng ở khoảng 6:24'")
    r.add_argument("--t", action="append", default=[], help="tên phần, theo thứ tự file (khi có nhiều phần)")
    ap.add_argument("--fresh", action="store_true", help="hỏi lại Commons, không dùng câu trả lời đã lưu")
    a = ap.parse_args()
    global FRESH
    FRESH = a.fresh
    if a.cmd == "search":
        found = search(a.query, a.limit)
        for x in found:
            mark = "✓" if x["ok"] else "✗"
            print("- %s | %4.0f s | %s %s | %s | mp3: %s" % (x["title"][5:], x["d"], mark, x["lic_raw"] or "?", x["artist"][:40], "có" if x["mp3"] else "không"))
        if len(found) >= a.limit:
            print("(đủ %d kết quả: có thể còn nữa, tăng --limit hoặc đổi truy vấn)" % a.limit)
    elif a.cmd == "page":
        print(wikitext(a.name) or "không có trang %s" % title(a.name))
    elif a.cmd == "info":
        for x in files(a.names):
            print(json.dumps(x, ensure_ascii=False, indent=1))
    else:
        try:
            print(json.dumps(rec(a.names, a.by, a.t, a.note), ensure_ascii=False, indent=1))
        except ValueError as e:
            sys.exit("commons: " + str(e))


if __name__ == "__main__":
    main()
