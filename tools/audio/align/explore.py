"""Công cụ xem tay khi viết cấu hình căn mốc hoặc kiểm tra một mốc trên phổ.

    # nội dung từng ô của một nguồn (để biết chỉ số ô, nhịp lấy đà, phần nhắc lại đã viết ra chưa); nhiều file thì
    # xem như đã nối (join trong pieces.py), chỉ số ô chạy liền qua các file
    python3 tools/audio/align/explore.py bars cpm_elise.mid [--qpm 80] [--first 0 --last 20]
    python3 tools/audio/align/explore.py bars kern_sonata11-1a.krn kern_sonata11-1b.krn --qpm 100

    # khởi âm theo từng cao độ trong một khoảng thời gian của bản thu (đo mốc tay: nốt nào vang lúc nào)
    python3 tools/audio/align/explore.py onsets docs/piano/tac-pham/fur-elise.md 80 90 A2:45 E5:76 [--part 0]

    # toàn cảnh phổ của một phần bản thu, kèm vạch các mốc đang ghi trên trang (PNG trong plots/ của bộ nhớ đệm)
    python3 tools/audio/align/explore.py overview docs/piano/tac-pham/fur-elise.md [--part 0]

    # so chi phí DTW của các cách nối đoạn (bản thu có chơi dấu nhắc lại không?)
    python3 tools/audio/align/explore.py structure docs/piano/tac-pham/mozart-minuet-k2.md mutopia_menuet_k2.mid \\
        --segs "" --segs "[(0,7),(0,7),(8,23)]" --segs "[(0,7),(0,7),(8,23),(8,23)]"
Thay cho trang có thể đưa thẳng một file âm thanh hoặc link file (khi chưa ghi khối bản thu vào trang).
--part chọn phần của bản thu nhiều phần (từ 0); giây trong onsets là giây trong phần đó.
structure so các cách nối của cùng một nguồn. Chi phí thấp và biến thiên tốc độ nhỏ là dấu hiệu tốt; k (độ dài bản
thu chia độ dài bản nhạc) chỉ có nghĩa khi so giữa các cách nối, vì độ dài bản nhạc kern, MEI tùy qpm bạn đặt. Khi
các dấu hiệu không cùng chỉ một cách, nghe lại chỗ nghi ngờ (đầu đoạn có thể nhắc lại) hoặc xem onsets.
"""
import argparse
import ast
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import net  # noqa: E402
import page  # noqa: E402

import core  # noqa: E402
import scores  # noqa: E402
from run import audio_for  # noqa: E402

NAMES = "C C# D Eb E F F# G Ab A Bb B".split()


def note_name(p):
    return "%s%d" % (NAMES[int(p) % 12], int(p) // 12 - 1)


AUDIO_EXT = (".mp3", ".ogg", ".oga", ".flac", ".wav", ".m4a", ".opus")


def part_audio(arg, part):
    """(trang hoặc None, data-rec hoặc None, file âm thanh) cho một trang (phần part) hoặc một file, link âm thanh."""
    if arg.startswith(("http://", "https://")):
        return None, None, net.cached_audio(arg)
    if arg.lower().endswith(AUDIO_EXT):
        return None, None, Path(arg)
    md = page.md_path(arg)
    _, rec = page.find_block(md.read_text(encoding="utf-8"))
    if not rec:
        raise SystemExit("trang chưa có bản thu: ghi khối bản thu trước (attach.py), hoặc đưa thẳng file âm thanh")
    if part >= len(rec["parts"]):
        raise SystemExit("bản thu chỉ có %d phần (--part từ 0)" % len(rec["parts"]))
    return md, rec, audio_for(md, rec["parts"][part])


def cmd_bars(a):
    specs = [dict(src=x, read=a.read, qpm=a.qpm) for x in a.src]
    sc = scores.load(specs[0] if len(specs) == 1 else dict(join=specs))
    print("ô: %d, nốt: %d, dài %.1f s (qpm %s). Cột đầu: chỉ số ô dùng trong pieces.py; [ ]: số ô in trên bản nhạc (nếu nguồn có)"
          % (len(sc.bars), len(sc.notes), sc.notes[:, 1].max(), a.qpm))
    for b in range(a.first, min(len(sc.bars), a.last + 1)):
        t0 = sc.bars[b]
        t1 = sc.bars[b + 1] if b + 1 < len(sc.bars) else 1e9
        sel = sc.notes[(sc.notes[:, 0] >= t0 - 1e-6) & (sc.notes[:, 0] < t1 - 1e-6)]
        sel = sel[np.lexsort((sel[:, 2], sel[:, 0]))]
        print("%4d [%s] %7.2f s  %s" % (b, sc.labels[b], t0, " ".join(note_name(p) for p in sel[:a.limit, 2])))


def cmd_onsets(a):
    _, _, audio = part_audio(a.page, a.part)
    p = core.Params()
    O = core.onset_map(audio, p)
    t = np.arange(O.shape[1]) / p.fps
    seg = (t >= a.t0) & (t <= a.t1)
    tt = t[seg]
    for spec in a.pitches:
        name, m = spec.split(":")
        row = O[int(m) - core.LO][seg]
        peaks = [(tt[i], row[i]) for i in range(1, len(row) - 1) if row[i] > row[i - 1] and row[i] >= row[i + 1] and row[i] > 0.4 * row.max()]
        print("%-5s khởi âm (giây, độ mạnh): %s" % (name, " ".join("%.2f(%.1f)" % x for x in peaks[:14])))


def cmd_overview(a):
    import plot
    md, rec, audio = part_audio(a.page, a.part)
    marks, title = [], str(audio)
    if rec:
        offs = np.cumsum([0] + [float(x.get("d") or 0) for x in rec["parts"]])
        marks = [("dòng %d" % (i + 1), r - offs[a.part]) for i, r in enumerate(rec.get("ref") or [])
                 if r is not None and offs[a.part] <= r < offs[a.part + 1]]
        title = "%s phần %d (%d dòng trong bảng)" % (page.rel(md), a.part, len(page.listen_rows(md.read_text(encoding="utf-8"))))
    out = net.cache_dir("plots") / ("%s-p%d-toan-canh.png" % (md.stem if md else Path(str(audio)).stem, a.part))
    plot.overview(audio, out, marks, title=title)
    print(out)


def cmd_structure(a):
    _, _, audio = part_audio(a.page, a.part)
    sc = scores.load(dict(src=a.src, read=a.read, qpm=a.qpm))
    for s in a.segs:
        segs = ast.literal_eval(s) if s.strip() else None
        notes = scores.expand(sc, segs)[0] if segs else sc.notes
        p = core.Params()
        f, info = core.align(notes, audio, p)
        lo, hi = core.tempo_spread(info["wp"], p.fps)
        print("%-40s chi phí %.4f  k %.2f  biến thiên tốc độ %+.2f..%+.2f  bản nhạc %.0f s, bản thu %.0f s" % (
            s or "(như trong nguồn)", info["cost"], info["k"], lo, hi, notes[:, 1].max() - notes[:, 0].min(), info["a1"] - info["a0"]))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("bars")
    b.add_argument("src", nargs="+", help="tên file trong sources.json (nhiều file: nối liền)")
    b.add_argument("--read", help="cách đọc, khi tên file không đủ để đoán (midi, asap, kern, mei, musicxml, dcml)")
    b.add_argument("--qpm", type=float, default=80.0)
    b.add_argument("--first", type=int, default=0)
    b.add_argument("--last", type=int, default=10 ** 6)
    b.add_argument("--limit", type=int, default=12, help="số nốt in mỗi ô")
    o = sub.add_parser("onsets")
    o.add_argument("page", help="trang .md, hoặc file/link âm thanh")
    o.add_argument("--part", type=int, default=0)
    o.add_argument("t0", type=float)
    o.add_argument("t1", type=float)
    o.add_argument("pitches", nargs="+", help="tên:số MIDI, ví dụ A2:45")
    v = sub.add_parser("overview")
    v.add_argument("page", help="trang .md, hoặc file/link âm thanh")
    v.add_argument("--part", type=int, default=0)
    s = sub.add_parser("structure")
    s.add_argument("page", help="trang .md, hoặc file/link âm thanh")
    s.add_argument("src")
    s.add_argument("--part", type=int, default=0)
    s.add_argument("--read", help="cách đọc, khi tên file không đủ để đoán (midi, asap, kern, mei, musicxml, dcml)")
    s.add_argument("--qpm", type=float, default=80.0)
    s.add_argument("--segs", action="append", default=[], help='danh sách đoạn, ví dụ "[(0,7),(0,7),(8,23)]"; "" = như nguồn')
    a = ap.parse_args()
    {"bars": cmd_bars, "onsets": cmd_onsets, "overview": cmd_overview, "structure": cmd_structure}[a.cmd](a)


if __name__ == "__main__":
    main()
