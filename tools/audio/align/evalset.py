"""Bộ kiểm tra bộ căn: các mốc đã xác minh tay trên phổ (khởi âm từng cao độ), để đo sai số khi sửa core.py.

    python3 tools/audio/align/evalset.py

In sai số (giây) của từng biến thể tham số: trung bình |sai số|, lớn nhất, số mốc lệch quá 1 giây.
Mỗi mục: trang, phần, nguồn bản nhạc (như job trong pieces.py), {vị trí: giây đúng trong bản thu}.
"""
import argparse
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import page  # noqa: E402

import core  # noqa: E402
import scores  # noqa: E402
from run import audio_for, at, positions  # noqa: E402

TRUTH = [
    ("piano/tac-pham/fur-elise.md", 0, dict(src="cpm_elise.mid"), {44.5: 60.6, 60.0: 85.0, 81.0: 113.2, 99.0: 137.8, 104.0: 144.2}),
    ("nghe-nhac/beethoven-moonlight.md", 0, dict(src="cpm_mond_1.mid"), {8: 42.0, 9: 46.2, 41: 195.3}),
    ("piano/tac-pham/bach-prelude-do.md", 0, dict(src="asap_Bach_Prelude_bwv_846"), {10: 44.3, 11: 48.7, 18: 79.5}),
    ("piano/tac-pham/mozart-k545.md", 0, dict(src="cpm_mz_545_1.mid", segs=[(0, 27), (56, 100)]), {(1, 69): 74.7}),
    ("piano/tac-pham/pathetique-adagio.md", 0, dict(src="asap_Beethoven_Piano_Sonatas_8-2"), {28: 154.5}),
    ("nghe-nhac/brahms-intermezzo.md", 0, dict(src="asap_Brahms_Six_Pieces_op_118_2"), {64: 158.1}),
]
GRID = [(c, w) for c in (0.0, 1.5, 3.0) for w in (0.0, 0.4)]


def main():
    argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter).parse_args()
    cases = []
    for rel, part, spec, truth in TRUTH:
        md = page.md_path(rel)
        _, rec = page.find_block(md.read_text(encoding="utf-8"))
        notes, pos = positions(scores.load(spec), spec.get("segs"))
        cases.append((audio_for(md, rec["parts"][part]), notes, pos, truth))
    for coarse, won in GRID:
        errs = []
        for audio, notes, pos, truth in cases:
            f, _ = core.align(notes, audio, core.Params(coarse=coarse, won=won))
            errs += [f(at(notes, pos, k)) - v for k, v in truth.items()]
        e = np.abs(errs)
        print("thô %.1f  khởi âm %.1f   trung bình |sai số| %.2f  lớn nhất %.2f  lệch >1 s: %d/%d   %s" % (
            coarse, won, e.mean(), e.max(), (e > 1).sum(), len(e), " ".join("%+.1f" % x for x in errs)))


if __name__ == "__main__":
    main()
