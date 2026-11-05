"""Kiểm tra bản thu của site: file lưu trên site, NGUON.txt và mọi khối data-rec.

    python3 tools/audio/check_audio.py              # kiểm tra cả site (cần ffmpeg)
    python3 tools/audio/check_audio.py --network    # thêm: hỏi Commons độ dài và giấy phép hiện tại của từng file
    python3 tools/audio/check_audio.py --tail a.mp3 b.mp3   # chỉ đo đuôi các file này (thử kết quả transcode.py)
    python3 tools/audio/check_audio.py --static     # chỉ mục 1 và 2, không cần ffmpeg (chạy trong npm test, nhóm nhanh)
    python3 tools/audio/check_audio.py --static --network   # mục 1, 2 và 5, không cần ffmpeg (CI chạy hằng tuần)

Kiểm:
1. Mọi file trong docs/assets/audio/ có một dòng trong NGUON.txt theo mẫu
   "<file>.mp3 — <tác phẩm>; trình bày: <người chơi>; giấy phép <tên> (<link>); nguồn: <link>", và ngược lại.
2. Mọi data-rec: khóa đúng thứ tự, có lic, licUrl (trừ phạm vi công cộng), page; giấy phép được nhận
   (licenses.py); mỗi phần có mp3 (hoặc link, với bản thu chỉ dẫn link) và d; ref là số giây hoặc null, tăng dần,
   không dài hơn bảng "Theo dõi khi nghe".
3. File lưu trên site: d khớp độ dài file (lệch không quá 0,5 giây); 0,25 giây cuối không to hơn −50 dBFS
   (bắt lỗi cắt cụt đuôi khi nhạc còn to).
4. Khi có file gốc trong _imslp/ (theo link nguồn IMSLP ở NGUON.txt): so với file gốc, file trên site dừng trước
   khi tiếng tắt (dưới −60 dBFS) là lỗi. Phép kiểm này bắt được lỗi của script cũ (cắt theo ngưỡng −45 dB, mất
   tiếng ngân ở mức khoảng −60 dBFS) mà ngưỡng −50 dBFS bỏ sót. Tiếng đã tắt nhưng giữ ít hơn 3 giây khoảng lặng
   sau đó (trong khi file gốc có) thì chỉ in "chú ý": không nghe thấy khác biệt; transcode.py giữ đủ 3 giây.
   Số "cắt đầu" in ra với -v là --start của transcode.py khi chuyển mã lại mà giữ nguyên mốc.
   File gốc không có trên máy (ví dụ trong CI) thì bỏ qua.
5. --network: file trên Commons còn đó, độ dài khớp d, giấy phép trên Commons vẫn là giấy phép ghi trên trang.
Bản đầy đủ không chạy trong npm test (cần ffmpeg, và --network cần mạng); npm test chạy --static.
Có lỗi thì thoát với mã 1.
"""
import argparse
import glob
import re
import sys
import urllib.parse

import attach
import licenses
import page
import sound

TAIL_DB = -50.0
D_TOL = 0.5
KEEP = 3.0                      # giây cần giữ sau khi tiếng tắt (như transcode.py)
IMSLP_DIR = page.ROOT / "_imslp"
NGUON = re.compile(r"^(?P<file>[a-z0-9-]+\.mp3) — (?P<work>[^;]+); trình bày: (?P<by>[^;]+); giấy phép (?P<lic>[^;(]+?)"
                   r"(?: \((?P<url>https?://[^)\s]+)\))?; nguồn: (?P<src>https?://\S+)$")


def tail_level(path, span=0.25):
    """Mức to nhất (dBFS, theo khung 50 ms) trong span giây cuối file."""
    lv = sound.levels(path, start=-span)
    return max(lv) if lv else -120.0


def check_nguon(errs):
    """Kiểm NGUON.txt; trả về {file trên site: link nguồn}."""
    lines = (page.AUDIO / "NGUON.txt").read_text(encoding="utf-8").splitlines()
    files = {p.name for p in page.AUDIO.glob("*.mp3")}
    sources = {}
    for i, line in enumerate(lines, 1):
        if not re.match(r"^[a-z0-9-]+\.mp3 — ", line):
            continue
        m = NGUON.match(line)
        if not m:
            errs.append("NGUON.txt dòng %d: không đúng mẫu: %s" % (i, line[:90]))
            continue
        sources[m["file"]] = m["src"]
        if m["file"] not in files:
            errs.append("NGUON.txt dòng %d: không có file %s" % (i, m["file"]))
        errs.extend("NGUON.txt dòng %d: %s" % (i, e) for e in licenses.check(m["lic"].strip(), m["url"] or ""))
    errs.extend("%s: không có dòng trong NGUON.txt" % f for f in sorted(files - set(sources)))
    return sources


def original(source_url):
    """File gốc trong _imslp/ ứng với link trang file IMSLP (None nếu không có trên máy). File tải từ IMSLP có thể
    mang thêm tiền tố IMSLP<số>- trước tên trang file."""
    m = re.match(r"https?://imslp\.org/wiki/File:(.+)$", source_url or "")
    if not m:
        return None
    name = urllib.parse.unquote(m.group(1))
    f = IMSLP_DIR / name
    if f.exists():
        return f
    found = [g for g in IMSLP_DIR.glob("IMSLP*-" + glob.escape(name)) if re.fullmatch(r"IMSLP\d+-", g.name[:-len(name)])]
    return found[0] if len(found) == 1 else None


def head_trim(hosted, orig, secs=20.0, win=0.01, max_lag=8.0):
    """Giây đã cắt ở đầu file gốc: độ lệch khớp nhất giữa đường bao mức âm (dBFS) 20 giây đầu của file trên site và
    của file gốc. Không dùng hiệu "tiếng đầu tiên" của hai file: bản thu mở đầu rất nhỏ thì sau khi chuyển mã, tiếng
    vượt ngưỡng −60 dBFS ở chỗ khác, lệch cả chục khung."""
    h = [max(x, -80.0) for x in sound.levels(hosted, win=win, dur=secs)]
    o = [max(x, -80.0) for x in sound.levels(orig, win=win, dur=secs + max_lag)]
    mh = sum(h) / len(h)
    h = [x - mh for x in h]
    best, best_lag = None, 0
    for lag in range(0, min(int(max_lag / win), len(o) - len(h)) + 1):
        seg = o[lag:lag + len(h)]
        mo = sum(seg) / len(seg)
        c = sum(a * (b - mo) for a, b in zip(h, seg))
        if best is None or c > best:
            best, best_lag = c, lag
    return best_lag * win


def compare_tail(hosted, orig):
    """So file trên site với file gốc: (giây tiếng ngân bị mất, giây còn giữ sau khi tiếng tắt, giây file gốc có
    sau khi tắt, giây đã cắt ở đầu). Giây cắt ở đầu là --start cần dùng nếu chuyển mã lại mà giữ nguyên mốc."""
    o_dur, h_dur = sound.probe(orig)[0], sound.probe(hosted)[0]
    _, o_last = sound.sound_span(sound.levels(orig))
    trim = head_trim(hosted, orig)
    end = h_dur + trim                             # cuối file trên site, tính theo thời gian của file gốc
    return max(0.0, o_last - end), end - o_last, o_dur - o_last, trim


def commons_title(part):
    """Tên File: trên Commons của một phần (None nếu không phải file Commons)."""
    for u in (part.get("src"), part.get("mp3")):
        if not u or "upload.wikimedia.org/wikipedia/commons/" not in u:
            continue
        segs = urllib.parse.urlsplit(u).path.split("/")
        name = segs[-2] if "/transcoded/" in u else segs[-1]
        return "File:" + urllib.parse.unquote(name).replace("_", " ")
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--network", action="store_true", help="đối chiếu với Commons (chậm lần đầu, có bộ nhớ đệm)")
    ap.add_argument("--tail", nargs="+", metavar="FILE", help="chỉ đo đuôi các file này")
    ap.add_argument("-v", "--verbose", action="store_true", help="in số đo của từng file so với file gốc")
    ap.add_argument("--static", action="store_true", help="chỉ kiểm NGUON.txt và data-rec, không đo file (không cần ffmpeg)")
    a = ap.parse_args()
    if a.tail or not a.static:
        sound.need_ffmpeg()

    if a.tail:
        bad = 0
        for f in a.tail:
            lv, d = tail_level(f), sound.probe(f)[0]
            ok = lv <= TAIL_DB
            bad += not ok
            print("%s %s: %.2f s, 0,25 giây cuối to nhất %.1f dBFS" % ("ok " if ok else "LỖI", f, d, lv))
        sys.exit(1 if bad else 0)

    errs, warns = [], []
    sources = check_nguon(errs)
    used, remote = set(), []
    n_pages = 0
    for md in sorted(page.DOCS.rglob("*.md")):
        text = md.read_text(encoding="utf-8")
        if "oz-listen" not in text:
            continue
        where = page.rel(md)
        try:
            m, rec = page.find_block(text)
        except ValueError as e:
            errs.append("%s: %s" % (where, e))
            continue
        if not rec:
            continue
        n_pages += 1
        try:
            if page.block(rec) != m.group(0):
                errs.append("%s: data-rec chưa đúng thứ tự khóa hoặc cách escape (chạy attach.py để ghi lại)" % where)
            errs.extend("%s: %s" % (where, e) for e in attach.problems(md, page.normalize(rec), text))
        except ValueError as e:
            errs.append("%s: %s" % (where, e))
        for i, p in enumerate(rec.get("parts") or [], 1):
            f = page.local_file(md, p["mp3"]) if p.get("mp3") else None   # phần chỉ dẫn link: không có file để đo
            if f is None:
                remote.append((where, i, p, rec))
                continue
            if f.parent != page.AUDIO:
                errs.append("%s phần %d: file lưu trên site phải nằm trong docs/assets/audio/: %s" % (where, i, p["mp3"]))
            if not f.exists():
                continue
            used.add(f.name)
            if a.static:
                continue
            d = sound.probe(f)[0]
            if abs(d - (p.get("d") or 0)) > D_TOL:
                errs.append("%s phần %d: d = %s nhưng file dài %.2f giây" % (where, i, p.get("d"), d))
            lv = tail_level(f)
            if lv > TAIL_DB:
                errs.append("%s phần %d: %s: 0,25 giây cuối to tới %.1f dBFS (đuôi bị cắt cụt?)" % (where, i, f.name, lv))
    for f in sorted({p.name for p in page.AUDIO.glob("*.mp3")} - used):
        warns.append("%s: không trang nào dùng" % f)
    compared = 0
    for name, url in sorted(sources.items()):
        orig = None if a.static else original(url)
        if not orig or not (page.AUDIO / name).exists():
            continue
        compared += 1
        lost, kept, avail, trim = compare_tail(page.AUDIO / name, orig)
        if a.verbose:
            print("%s: cắt đầu %.2f giây; sau khi tiếng tắt giữ %.2f giây (file gốc có %.2f)" % (name, trim, kept, avail))
        if lost > 0.1:
            errs.append("%s: dừng trước khi tiếng tắt, mất %.1f giây tiếng ngân so với file gốc" % (name, lost))
        elif kept < min(KEEP, avail) - 0.3:
            warns.append("%s: tiếng đã tắt hẳn nhưng chỉ giữ %.1f giây khoảng lặng sau đó (file gốc có %.1f giây; transcode.py giữ %.0f)"
                         % (name, kept, avail, KEEP))

    if a.network:
        import commons
        titles = [commons_title(p) for _, _, p, _ in remote]
        info = {r["title"]: r for r in commons.files(sorted({t for t in titles if t}))}
        for (where, i, p, rec), t in zip(remote, titles):
            if not t:
                if "imslp.org/" not in (p.get("link") or ""):   # bản thu IMSLP chỉ dẫn link: không có API để đối chiếu
                    warns.append("%s phần %d: không phải file Commons, không đối chiếu được: %s" % (where, i, (p.get("mp3") or p.get("link") or "")[:80]))
                continue
            r = info.get(t, {})
            if r.get("missing"):
                errs.append("%s phần %d: %s không còn trên Commons" % (where, i, t))
                continue
            if abs(r["d"] - (p.get("d") or 0)) > D_TOL:
                errs.append("%s phần %d: d = %s nhưng file Commons dài %.2f giây" % (where, i, p.get("d"), r["d"]))
            if r["lic"] != rec.get("lic"):
                errs.append("%s phần %d: Commons ghi giấy phép %r (%s), trang ghi %r" % (where, i, r["lic_raw"], r["lic"] or r["why"], rec.get("lic")))

    for w in warns:
        print("chú ý:", w)
    for e in errs:
        print("LỖI:", e)
    if a.static:
        print("check_audio --static: %d file trên site, %d trang có bản thu%s, %d lỗi (chưa đo file: chạy không có --static, cần ffmpeg)" % (
            len(list(page.AUDIO.glob("*.mp3"))), n_pages,
            " (%d phần trên mạng, đã đối chiếu Commons)" % len(remote) if a.network else "", len(errs)))
    else:
        print("check_audio: %d file trên site (%d so được với file gốc trong _imslp/), %d trang có bản thu (%d phần trên mạng%s), %d lỗi" % (
            len(list(page.AUDIO.glob("*.mp3"))), compared, n_pages, len(remote), ", đã đối chiếu Commons" if a.network else "", len(errs)))
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
