"""Đọc bản nhạc số thành nốt theo giây và điểm đầu từng ô nhịp (Score).

Nguồn: MIDI (piano-midi.de, Mutopia), ASAP (MIDI kèm chú thích phách và ô nhịp), kern (Humdrum), MEI, MusicXML,
bảng nốt DCML (TSV). File nằm trong scores/ của bộ nhớ đệm (xem fetch.py và sources.json).

Chỉ số ô nhịp trong code là thứ tự ô trong nguồn, bắt đầu từ 0 (có phần lẻ cho vị trí giữa ô: 8.5 là giữa ô
thứ 9 của nguồn). Nguồn có nhịp lấy đà thì ô 0 là nhịp lấy đà. Kết 1, kết 2 cũng là những ô riêng, nên chỉ số
ô có thể lệch dần so với số ô in. Với kern, MEI, MusicXML, DCML, số ô in trên bản nhạc nằm trong Score.labels
(chuỗi rỗng khi ô không có số: nhịp lấy đà, kết 2...); MIDI và ASAP không có số ô in. Kern không mở dấu nhắc lại:
dòng *>[A,A,B,B...] trong file cho biết thứ tự chơi các đoạn, nối bằng segs. Dùng explore.py bars để xem nội dung
từng ô trước khi ghi cấu hình.
"""
import csv
import os
import sys
import warnings
from fractions import Fraction
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import net  # noqa: E402


class Score:
    def __init__(self, notes, bars, labels=None):
        self.notes = np.asarray(notes, float)              # (giây bắt đầu, giây kết thúc, cao độ MIDI, lực bấm)
        self.bars = np.asarray(bars, float)                # giây bắt đầu từng ô, theo thứ tự trong nguồn
        self.labels = [str(x) for x in labels] if labels is not None else [""] * len(bars)

    def t(self, barf):
        """Giây ứng với vị trí ô nhịp (chỉ số trong nguồn, có phần lẻ)."""
        b = int(np.floor(barf))
        fr = barf - b
        if b >= len(self.bars) - 1:
            last = min(b, len(self.bars) - 1)
            nxt = self.notes[:, 1].max() if b == len(self.bars) - 1 else self.bars[-1]
            return self.bars[last] + fr * (nxt - self.bars[last])
        return self.bars[b] + fr * (self.bars[b + 1] - self.bars[b])


def path(name):
    p = net.cache_dir("scores") / name
    if not p.exists():
        raise SystemExit("chưa có bản nhạc %s trong %s: chạy python3 tools/audio/align/fetch.py %s" % (name, p.parent, name))
    return p


# ---------------------------------------------------------------- MIDI
def read_midi(file):
    """Nốt (tick) và ranh giới ô nhịp (tick, theo số chỉ nhịp trong file), kèm hàm tick -> giây."""
    import mido
    mf = mido.MidiFile(str(file))
    tpb = mf.ticks_per_beat
    events = []
    for ti, tr in enumerate(mf.tracks):
        t = 0
        for msg in tr:
            t += msg.time
            if msg.type == "set_tempo":
                events.append((t, 0, msg.tempo))
            elif msg.type == "time_signature":
                events.append((t, 1, (msg.numerator, msg.denominator)))
            elif msg.type in ("note_on", "note_off"):
                events.append((t, 2, (msg.type, msg.note, msg.velocity, msg.channel, ti)))
    events.sort(key=lambda e: (e[0], e[1]))
    tempos = sorted([(0, 500000)] + [(e[0], e[2]) for e in events if e[1] == 0])
    tt = np.array([x[0] for x in tempos], float)
    tv = np.array([x[1] for x in tempos], float)
    keep = np.r_[tt[1:] != tt[:-1], True]               # cùng tick thì giữ tốc độ đặt sau
    tt, tv = tt[keep], tv[keep]
    secs = np.zeros(len(tt))
    for i in range(1, len(tt)):
        secs[i] = secs[i - 1] + (tt[i] - tt[i - 1]) * tv[i - 1] / 1e6 / tpb

    def t2s(tick):
        tick = np.asarray(tick, float)
        i = np.searchsorted(tt, tick, side="right") - 1
        return secs[i] + (tick - tt[i]) * tv[i] / 1e6 / tpb
    notes, on = [], {}
    for t, k, d in events:
        if k != 2:
            continue
        typ, n, v, ch, tr = d
        key = (n, ch, tr)
        if typ == "note_on" and v > 0:
            if key in on:
                notes.append((on[key][0], t, n, on[key][1]))
            on[key] = (t, v)
        elif key in on:
            notes.append((on[key][0], t, n, on[key][1]))
            del on[key]
    notes.sort()
    nt = np.array(notes, float) if notes else np.zeros((0, 4))
    ts = sorted([(e[0], e[2]) for e in events if e[1] == 1] or [(0, (4, 4))])
    end_tick = max(nt[:, 1].max() if len(nt) else 0, 0)
    bars, t, j, cur = [], 0, 0, ts[0][1]
    while t <= end_tick:
        while j + 1 < len(ts) and ts[j + 1][0] <= t:
            j += 1
            cur = ts[j][1]
        bars.append(t)
        t += int(round(tpb * 4 * cur[0] / cur[1]))
    return dict(tpb=tpb, notes_tick=nt, t2s=t2s, bars_tick=np.array(bars, float), ts=ts)


def midi(name):
    """MIDI: ô nhịp tính theo số chỉ nhịp trong file từ tick 0 (nhịp lấy đà đủ ô thì ô 0 là ô lấy đà)."""
    m = read_midi(path(name))
    nt, t2s = m["notes_tick"], m["t2s"]
    return Score(np.c_[t2s(nt[:, 0]), t2s(nt[:, 1]), nt[:, 2], nt[:, 3]], t2s(m["bars_tick"]))


def asap(prefix):
    """ASAP: MIDI của bản nhạc (<prefix>_midi_score.mid) và điểm đầu ô nhịp theo chú thích 'db' (downbeat)."""
    m = read_midi(path(prefix + "_midi_score.mid"))
    nt, t2s = m["notes_tick"], m["t2s"]
    db = []
    for line in path(prefix + "_midi_score_annotations.txt").read_text(encoding="utf-8").splitlines():
        p = line.strip().split("\t")
        if len(p) >= 3 and p[2].startswith("db"):
            db.append(float(p[0]))
    return Score(np.c_[t2s(nt[:, 0]), t2s(nt[:, 1]), nt[:, 2], nt[:, 3]], db)


# ---------------------------------------------------------------- kern, MEI, MusicXML (partitura), DCML
def _from_quarters(on_q, du_q, pitch, mq, labels, qpm, tempi=None):
    """Nốt và ô nhịp tính bằng phách đen -> Score theo giây. tempi: [(nhãn ô, qpm)] đổi tốc độ từ ô đó."""
    on_q, du_q = np.asarray(on_q, float), np.asarray(du_q, float)
    segs = [(mq[0], qpm)] + [(mq[[str(x) for x in labels].index(str(bar))], q) for bar, q in (tempi or [])]
    segs.sort()

    def q2s(q):
        q = np.asarray(q, float)
        out = np.zeros_like(q)
        for i, (q0, tq) in enumerate(segs):
            q1 = segs[i + 1][0] if i + 1 < len(segs) else 1e12
            out += np.where(q > q0, (np.clip(q, q0, q1) - q0) * 60.0 / tq, 0)
        return out
    base = float(q2s(np.array([min(mq[0], on_q.min())]))[0])
    notes = np.c_[q2s(on_q) - base, q2s(on_q + du_q) - base, pitch, np.full(len(pitch), 70)]
    notes = notes[np.argsort(notes[:, 0], kind="stable")]
    return Score(notes, q2s(np.array(mq, float)) - base, labels)


def _partitura(score, qpm, tempi):
    import partitura as pt
    parts = score.parts if hasattr(score, "parts") else [score]
    part = pt.score.merge_parts(parts) if len(parts) > 1 else parts[0]
    na = part.note_array()
    qmap = part.quarter_map
    ms = list(part.iter_all(pt.score.Measure))
    on_q = na["onset_quarter"] if "onset_quarter" in na.dtype.names else qmap(na["onset_div"])
    du_q = na["duration_quarter"] if "duration_quarter" in na.dtype.names else qmap(na["onset_div"] + na["duration_div"]) - on_q
    names = ["" if getattr(m, "name", None) in (None, "") else str(m.name) for m in ms]   # số ô in (number là thứ tự)
    return _from_quarters(on_q, du_q, na["pitch"], [float(qmap(m.start.t)) for m in ms], names, qpm, tempi)


def kern(name, qpm=80.0, tempi=None):
    import partitura as pt
    warnings.filterwarnings("ignore")
    return _partitura(pt.load_kern(str(path(name))), qpm, tempi)


def mei(name, qpm=80.0, tempi=None):
    import partitura as pt
    warnings.filterwarnings("ignore")
    return _partitura(pt.load_mei(str(path(name))), qpm, tempi)


def musicxml(name, qpm=80.0, tempi=None):
    import partitura as pt
    warnings.filterwarnings("ignore")
    return _partitura(pt.load_musicxml(str(path(name))), qpm, tempi)


def dcml(stem, qpm=60.0, tempi=None):
    """Bảng nốt và ô nhịp DCML (<stem>.notes.tsv, <stem>.measures.tsv); bỏ phần nối tiếp của nốt có dấu nối."""
    rows = list(csv.DictReader(path(stem + ".notes.tsv").open(encoding="utf-8"), delimiter="\t"))
    meas = list(csv.DictReader(path(stem + ".measures.tsv").open(encoding="utf-8"), delimiter="\t"))
    keep = [r for r in rows if r.get("tied", "").strip() not in ("-1", "0")]
    on = [float(Fraction(r["quarterbeats"])) for r in keep]
    du = [float(Fraction(r["duration_qb"])) for r in keep]
    pitch = np.array([int(r["midi"]) for r in keep])
    return _from_quarters(on, du, pitch, [float(Fraction(m["quarterbeats"])) for m in meas], [m["mn"] for m in meas], qpm, tempi)


# ---------------------------------------------------------------- nối đoạn (nhắc lại)
def expand(score, segs):
    """Nối các đoạn theo thứ tự chơi. segs: [(từ ô, đến ô)] chỉ số ô trong nguồn, gồm cả hai đầu.
    Trả về (nốt đã nối, hàm pos(đoạn, vị trí ô) -> giây trong bản đã nối)."""
    out, starts, cur = [], [], 0.0
    for a, b in segs:
        t0 = score.t(a)
        t1 = score.t(b + 1) if b + 1 < len(score.bars) else score.notes[:, 1].max()
        sel = score.notes[(score.notes[:, 0] >= t0 - 1e-6) & (score.notes[:, 0] < t1 - 1e-6)].copy()
        sel[:, 0] += cur - t0
        sel[:, 1] += cur - t0
        out.append(sel)
        starts.append((cur, t0))
        cur += t1 - t0

    def pos(seg, barf):
        c, t0 = starts[seg]
        return c + score.t(barf) - t0
    return np.vstack(out), pos


def concat(parts):
    """Nối nhiều bản nhạc liền nhau (ví dụ chủ đề và từng biến tấu nằm ở các file riêng) thành một Score.
    Ô trống ở cuối mỗi file (vạch kết) bị bỏ; chỉ số ô của file sau nối tiếp file trước."""
    notes, bars, labels, t0 = [], [], [], 0.0
    for sc in parts:
        end = sc.notes[:, 1].max()
        keep = [i for i, b in enumerate(sc.bars) if b < end - 1e-6]
        n = sc.notes.copy()
        n[:, :2] += t0
        notes.append(n)
        bars += [sc.bars[i] + t0 for i in keep]
        labels += [sc.labels[i] for i in keep]
        t0 += end
    return Score(np.vstack(notes), bars, labels)


KINDS = {".mid": "midi", ".midi": "midi", ".krn": "kern", ".mei": "mei", ".musicxml": "musicxml", ".xml": "musicxml", ".mxl": "musicxml"}


def kind(src):
    """Cách đọc suy từ tên file: asap_… (ASAP), dcml_… (DCML), đuôi .mid, .krn, .mei, .musicxml/.xml/.mxl."""
    if src.startswith("asap_"):
        return "asap"
    if src.startswith("dcml_"):
        return "dcml"
    k = KINDS.get(os.path.splitext(src)[1].lower())
    if not k:
        raise SystemExit("không biết đọc %s: ghi read=... (midi, asap, kern, mei, musicxml, dcml, hand)" % src)
    return k


def load(spec):
    """Score từ mô tả nguồn trong pieces.py: dict(src=tên file hoặc tiền tố, read=cách đọc, qpm=..., tempi=...),
    hoặc dict(join=[mô tả, mô tả...]) để nối nhiều file liền nhau."""
    if spec.get("join"):
        return concat([load(s) for s in spec["join"]])
    read = spec.get("read") or kind(spec["src"])
    if read == "hand":
        import hand
        return getattr(hand, spec["src"])(spec.get("qpm"))
    fn = {"midi": midi, "asap": asap, "kern": kern, "mei": mei, "musicxml": musicxml, "dcml": dcml}[read]
    if read in ("midi", "asap"):
        return fn(spec["src"])
    return fn(spec["src"], spec.get("qpm", 80.0), spec.get("tempi"))
