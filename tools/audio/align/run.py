"""Căn mốc tham khảo cho bảng "Theo dõi khi nghe" của một trang (cấu hình trong pieces.py).

    python3 tools/audio/align/run.py fur-elise                # in bảng: mốc mới, ba biến thể, mốc đang ghi trên trang
    python3 tools/audio/align/run.py fur-elise --plot         # thêm hình phổ cho các dòng chưa nhận (để kiểm tra tay)
    python3 tools/audio/align/run.py fur-elise --plot-all     # hình phổ cho mọi dòng
    python3 tools/audio/align/run.py fur-elise --write        # ghi ref vào data-rec của trang
    python3 tools/audio/align/run.py --list                   # các cấu hình có trong pieces.py

Mỗi dòng được căn ba lần với ba bộ tham số (core.VARIANTS). Nhận khi có hai lần lệch nhau không quá 2 giây (lấy
trung bình hai lần đó); job có nguồn đối chiếu (check) thì kết quả còn phải khớp nguồn thứ hai trong 2 giây.
Dòng không nhận được ghi null (trang hiện "chưa có"), trừ khi đã đo tay trên phổ và ghi vào fix của job.
Bản thu lấy từ data-rec của trang: file trên site đọc thẳng, file trên mạng tải một lần vào bộ nhớ đệm.
"""
import argparse
import itertools
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import attach  # noqa: E402
import net  # noqa: E402
import page  # noqa: E402

import core  # noqa: E402
import scores  # noqa: E402
from pieces import PIECES  # noqa: E402

TOL = 2.0


def audio_for(md, part):
    """File âm thanh để căn một phần. Phần chỉ dẫn link: file gốc ở src (trang file IMSLP: bản đã tải tay vào _imslp/;
    file trên Commons: tải về bộ nhớ đệm), vì mốc tính theo file ở link."""
    if part.get("mp3"):
        f = page.local_file(md, part["mp3"])
        return f if f is not None else net.cached_audio(part["mp3"])
    src = part.get("src") or ""
    if "imslp.org/wiki/File:" in src:
        import check_audio
        f = check_audio.original(src)
        if f is None:
            raise SystemExit("cần file gốc trong _imslp/ để căn mốc: %s (tải tay từ %s)" % (src, part.get("link")))
        return f
    if not src:
        raise SystemExit("phần chỉ dẫn link cần src (file gốc) để căn mốc: %s" % part.get("link"))
    return net.cached_audio(src)


def positions(sc, segs):
    """(nốt theo thứ tự chơi, hàm (đoạn, vị trí) -> giây trong bản nhạc)."""
    if segs:
        return scores.expand(sc, segs)
    return sc.notes, (lambda seg, b: sc.t(b))


def at(notes, pos, spec):
    seg, b = spec if isinstance(spec, tuple) else (0, spec)
    if b == "first":
        return notes[:, 0].min()
    if not isinstance(b, (int, float)):
        raise SystemExit("vị trí không hợp lệ: %r (cần số ô, 'first', (đoạn, số ô); 'start' chỉ dùng như một dòng riêng)" % (spec,))
    return pos(seg, b)


def first_sound(audio):
    """Giây có tiếng đầu tiên của một phần bản thu (mức trên mức 95% trừ 30 dB)."""
    p = core.Params()
    return core.first_last_sound(core.audio_feat(audio, p), p.fps)[0]


def align_job(job, audio, verbose=True):
    """Căn một job theo ba biến thể. Trả về (nốt, pos, danh sách (tên, hàm, thông tin))."""
    sc = scores.load(job)
    notes, pos = positions(sc, job.get("segs"))
    long = notes[:, 1].max() - notes[:, 0].min() > 420
    base = core.Params(hop=2048 if long else 1024, wpitch=job.get("wpitch", 0.6))
    anchors = [(at(notes, pos, a), t) for a, t in job.get("anchors", [])]
    out = []
    for name, p in core.variants(base):
        if anchors:
            f, info = core.align_anchored(notes, audio, anchors, p)
        else:
            f, info = core.align(notes, audio, p, band=job.get("band"))
        out.append((name, f, info))
    return notes, pos, out


def run(name, plot=None, verbose=True):
    """Mốc của mọi dòng {dòng: giây tính liền qua các phần, hoặc None} và bảng in ra."""
    cfg = PIECES[name]
    md = page.md_path(cfg["page"])
    text = md.read_text(encoding="utf-8")
    _, rec = page.find_block(text)
    if not rec:
        raise SystemExit("%s: trang chưa có bản thu (data-rec)" % cfg["page"])
    rows = page.listen_rows(text)
    offs = np.cumsum([0] + [float(p.get("d") or 0) for p in rec["parts"]])
    res, detail = {}, {}
    for job in cfg["jobs"]:
        part = job.get("part", 0)
        if part >= len(rec["parts"]):
            raise SystemExit("%s: job có part=%d nhưng bản thu chỉ có %d phần" % (name, part, len(rec["parts"])))
        aligned = "src" in job or "join" in job
        rows_to_align = {r: v for r, v in job["rows"].items() if v != "start"} if aligned else {}
        audio = audio_for(md, rec["parts"][part]) if rows_to_align or "start" in job["rows"].values() else None
        for r, v in job["rows"].items():               # dòng là thời điểm cố định hoặc đầu phần, không cần căn
            if v == "start":
                v = first_sound(audio)
                detail[r] = "tiếng đầu tiên của phần %d: %.2f s" % (part + 1, v)
            elif not aligned:
                detail[r] = "đo tay"
            else:
                continue
            res[r] = offs[part] + v
        if not rows_to_align:
            continue
        notes, pos, V = align_job(job, audio)
        info = V[1][2]
        if verbose:
            print("[%s] phần %d: âm thanh %.1f–%.1f / %.1f s, bản nhạc %.1f s%s" % (
                name, part, info["a0"], info["a1"], info["dur"], notes[:, 1].max() - notes[:, 0].min(),
                ", neo %d mốc" % len(job["anchors"]) if job.get("anchors") else ""))
        alt = {}
        if job.get("check"):
            chk = job["check"]
            n2, pos2, V2 = align_job(chk, audio)
            for r, spec in chk["rows"].items():
                alt[r] = float(V2[1][1](at(n2, pos2, spec)))
        marks, flagged = [], []
        for r, spec in rows_to_align.items():
            vals = [float(f(at(notes, pos, spec))) for _, f, _ in V]
            gap, t = min((abs(a - b), (a + b) / 2) for a, b in itertools.combinations(vals, 2))
            ok = gap <= TOL
            why = "" if ok else "ba biến thể lệch nhau quá %d giây" % TOL
            if ok and r in alt and abs(alt[r] - t) > TOL:
                ok, why = False, "nguồn đối chiếu lệch %.1f giây" % (alt[r] - t)
            how = " ".join("%6.1f" % (v + offs[part]) for v in vals) + (" | đối chiếu %6.1f" % (alt[r] + offs[part]) if r in alt else "")
            if r in job.get("fix", {}):
                t, ok, why = job["fix"][r], True, ""
                how += " | đo tay"
            res[r] = offs[part] + t if ok else None
            detail[r] = how + ("" if ok else " | ⚠ " + why)
            marks.append(("dòng %d" % (r + 1), t))
            if not ok:
                flagged.append(("dòng %d" % (r + 1), t))
        if plot and (flagged or plot == "all"):
            import plot as P
            sel = marks if plot == "all" else flagged
            out = net.cache_dir("plots") / ("%s-p%d.png" % (name, part))
            segs = [(max(0, t - 3), min(info["dur"], t + 5)) for _, t in sel]
            P.verify(audio, notes, V[1][1], segs, out, sel, "%s phần %d" % (name, part))
            print("  hình kiểm tra: %s" % out)
    old = rec.get("ref") or []
    ref = [None if res.get(i) is None else int(np.floor(res[i] + 0.5)) for i in range(len(rows))]
    if verbose:
        print("  dòng   mốc  (trên trang)  thường khởi-âm thô→mịn")
        for i, row in enumerate(rows):
            cur = old[i] if i < len(old) else None
            mark = "" if ref[i] == cur else "  ≠"
            print("  %3d %5s %8s     %s%s   %s" % (i + 1, "-" if ref[i] is None else ref[i], "-" if cur is None else cur,
                                                detail.get(i, "(không có trong cấu hình)"), mark, row[-1][:50]))
    while ref and ref[-1] is None:
        ref.pop()
    return md, rec, ref


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("name", nargs="?", help="tên cấu hình trong pieces.py")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--plot", action="store_true", help="hình phổ cho các dòng chưa nhận")
    ap.add_argument("--plot-all", action="store_true", help="hình phổ cho mọi dòng")
    ap.add_argument("--write", action="store_true", help="ghi ref vào trang")
    a = ap.parse_args()
    if a.list or not a.name:
        for k, v in PIECES.items():
            print("%-34s %s" % (k, v["page"]))
        return
    if a.name not in PIECES:
        sys.exit("không có cấu hình %r trong pieces.py (xem --list)" % a.name)
    md, rec, ref = run(a.name, plot="all" if a.plot_all else a.plot)
    if a.write:
        text = md.read_text(encoding="utf-8")
        m, _ = page.find_block(text)
        new = page.normalize(dict(rec, ref=ref))
        errs = attach.problems(md, new, text)
        if errs:
            sys.exit("không ghi: " + "; ".join(errs))
        out = page.block(new)
        if out != m.group(0):
            md.write_text(text[:m.start()] + out + text[m.end():], encoding="utf-8")
            print("đã ghi ref vào %s" % page.rel(md))
        else:
            print("%s: ref không đổi" % page.rel(md))


if __name__ == "__main__":
    main()
