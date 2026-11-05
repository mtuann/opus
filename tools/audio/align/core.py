"""Căn bản nhạc (danh sách nốt) với bản thu bằng DTW.

Đặc trưng của bản thu: phổ CQT gộp theo nửa cung (MIDI 24–107), chroma, khởi âm theo từng lớp cao độ và độ im lặng.
Bản nhạc được "tổng hợp" thành cùng loại đặc trưng (nốt tắt dần, có họa âm), kéo giãn cho bằng độ dài bản thu,
rồi DTW tìm đường đi rẻ nhất. Kết quả là một hàm: giây trong bản nhạc -> giây trong bản thu.

Ba biến thể tham số (VARIANTS) được dùng để đối chiếu với nhau trong run.py: thường (chỉ phổ và chroma),
khởi âm (thêm đặc trưng khởi âm, trọng số 0,4), thô→mịn (căn thô trên đặc trưng làm mượt 1,5 giây,
rồi căn mịn trong dải ±3 giây quanh đường thô).
"""
import hashlib
import os
import sys
from dataclasses import dataclass, replace
from pathlib import Path

import librosa
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import net  # noqa: E402

SR = 22050
LO, NB = 24, 84                     # MIDI 24..107


@dataclass(frozen=True)
class Params:
    hop: int = 1024                 # mẫu mỗi khung (1024 ≈ 21,5 khung/giây; bản thu dài trên 7 phút dùng 2048)
    wpitch: float = 0.6             # trọng số phổ nửa cung so với chroma
    won: float = 0.4                # trọng số đặc trưng khởi âm (0 = không dùng)
    coarse: float = 0.0             # giây: cửa sổ làm mượt cho bước căn thô (0 = tắt)
    band: float = 3.0               # giây: bước căn mịn chỉ tìm quanh đường căn thô trong khoảng này

    @property
    def fps(self):
        return SR / self.hop


VARIANTS = (("thường", dict(coarse=0.0, won=0.0)), ("khởi âm", dict(coarse=0.0, won=0.4)), ("thô→mịn", dict(coarse=1.5, won=0.0)))


def variants(base):
    return [(name, replace(base, **kw)) for name, kw in VARIANTS]


def _norm(F):
    return F / (np.linalg.norm(F, axis=0, keepdims=True) + 1e-9)


def _decay(F, r=0.6, n=6):
    """Khởi âm kéo dài vài khung, tắt dần."""
    out = F.copy()
    for k in range(1, n):
        out[:, k:] += (r ** k) * F[:, :-k]
    return out


def _onorm(F, fps):
    """Chuẩn hóa theo trung bình động (khởi âm mạnh hay yếu so với vùng lân cận), rồi L2 từng khung."""
    e = np.linalg.norm(F, axis=0)
    w = int(fps * 2)
    loc = np.convolve(e, np.ones(2 * w + 1) / (2 * w + 1), mode="same") + 1e-9
    G = F / loc
    n = np.linalg.norm(G, axis=0, keepdims=True)
    return np.where(n > 0.2, G / (n + 1e-9), 0.0)


def audio_raw(path, p):
    """(phổ nửa cung P, mức dB từng khung, độ dài giây) của bản thu, có bộ nhớ đệm trong features/."""
    st = os.stat(path)
    key = hashlib.sha1(("%s|%d|%d|v3|%d" % (os.path.abspath(path), st.st_size, int(st.st_mtime), p.hop)).encode()).hexdigest()[:16]
    fn = net.cache_dir("features") / (key + ".npz")
    if fn.exists():
        d = np.load(fn)
        return d["P"], d["db"], float(d["dur"])
    y, _ = librosa.load(str(path), sr=SR, mono=True)
    dur = len(y) / SR
    C = np.abs(librosa.cqt(y, sr=SR, hop_length=p.hop, fmin=librosa.midi_to_hz(LO), n_bins=NB * 3, bins_per_octave=36))
    P = C.reshape(NB, 3, -1).max(axis=1)
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=p.hop)[0]
    n = min(P.shape[1], len(rms))
    P, rms = P[:, :n], rms[:n]
    db = 20 * np.log10(rms + 1e-9)
    np.savez(fn, P=P, db=db, dur=dur)
    return P, db, dur


def audio_feat(path, p, sil_db=32):
    P, db, dur = audio_raw(path, p)
    P = np.log1p(1000 * P / (P.max() + 1e-9))
    ref = np.percentile(db, 95)
    sil = np.clip((ref - sil_db - db) / 6.0, 0, 1)       # 0: có tiếng, 1: im lặng (chuyển mềm)
    chroma = np.zeros((12, P.shape[1]))
    for k in range(NB):
        chroma[(LO + k) % 12] += P[k]
    O = np.maximum(0, np.diff(P, axis=1, prepend=P[:, :1]))
    Oc = np.zeros((12, P.shape[1]))
    for k in range(NB):
        Oc[(LO + k) % 12] += O[k]
    Oc = _decay(Oc)
    return dict(P=_norm(np.vstack([P * (1 - sil), 3 * sil * P.max()])), Ch=_norm(np.vstack([chroma * (1 - sil), 3 * sil * chroma.max()])),
                On=_onorm(Oc, p.fps), sil=sil, dur=dur, db=db)


def score_feat(notes, p, total=None):
    """notes: mảng (giây bắt đầu, giây kết thúc, cao độ MIDI, lực bấm). Nốt tắt dần (nốt cao tắt nhanh hơn), có họa âm."""
    notes = np.asarray(notes, float)
    fps = p.fps
    end = total if total else notes[:, 1].max() + 0.5
    n = int(np.ceil(end * fps)) + 1
    P = np.zeros((NB, n))
    act = np.zeros(n)
    t = np.arange(n) / fps
    for on, off, pitch, v in notes:
        pitch = int(pitch)
        tau = 1.6 * 2 ** (-(pitch - 60) / 24.0)            # khoảng 1,6 giây ở Đô giữa, ngắn dần lên cao
        a = int(on * fps)
        b = min(n, int((max(off, on + 0.05) + 0.12) * fps) + 1)
        if b <= a:
            continue
        w = np.exp(-(t[a:b] - on) / tau) * (0.5 + 0.5 * (v / 127.0 if v else 0.6))
        for dp, hw in ((0, 1.0), (12, 0.45), (19, 0.3), (24, 0.2), (28, 0.15), (31, 0.1)):
            k = pitch + dp - LO
            if 0 <= k < NB:
                P[k, a:b] += hw * w
        act[a:b] += 1
    P = np.log1p(10 * P)
    sil = (act == 0).astype(float)
    chroma = np.zeros((12, n))
    for k in range(NB):
        chroma[(LO + k) % 12] += P[k]
    Oc = np.zeros((12, n))
    for on, off, pitch, v in notes:
        i = int(round(on * fps))
        if 0 <= i < n:
            for dp, hw in ((0, 1.0), (19, 0.3), (28, 0.15)):
                Oc[(int(pitch) + dp) % 12, i] += hw * (0.5 + 0.5 * (v / 127.0 if v else 0.6))
    Oc = _decay(Oc)
    return dict(P=_norm(np.vstack([P * (1 - sil), 3 * sil * (P.max() or 1)])), Ch=_norm(np.vstack([chroma * (1 - sil), 3 * sil * (chroma.max() or 1)])),
                On=_onorm(Oc, fps), sil=sil)


def _sim(X, Y):
    """Tích vô hướng giữa các khung (cột) của X và Y. numpy 2 dùng BLAS Accelerate trên macOS có thể báo cảnh báo
    tràn số giả khi nhân ma trận (đầu vào đã chuẩn hóa, kết quả vẫn đúng), nên tắt cảnh báo ở đây."""
    with np.errstate(divide="ignore", over="ignore", invalid="ignore"):
        return X.T @ Y


def cost_matrix(S, A, p):
    base = p.wpitch * (1 - _sim(S["P"], A["P"])) + (1 - p.wpitch) * (1 - _sim(S["Ch"], A["Ch"]))
    if p.won and "On" in S and "On" in A:
        so = np.linalg.norm(S["On"], axis=0) > 0
        ao = np.linalg.norm(A["On"], axis=0) > 0
        on = 1 - _sim(S["On"], A["On"])
        on = np.where(so[:, None] & ao[None, :], on, np.where(so[:, None] | ao[None, :], 0.8, 0.3))
        return (1 - p.won) * base + p.won * on
    return base


def _smooth(F, w):
    if w <= 1:
        return F
    k = np.ones(w) / w
    return _norm(np.apply_along_axis(lambda r: np.convolve(r, k, mode="same"), 1, F))


STEPS = np.array([[1, 1], [0, 1], [1, 0]])
WEIGHTS = np.array([2, 1, 1])


def dtw(S, A, p, band=None):
    """Đường DTW (khung bản nhạc, khung bản thu) và chi phí trung bình dọc đường."""
    C = cost_matrix(S, A, p)
    if p.coarse:
        q = 4
        w = max(1, int(p.coarse * p.fps / q))

        def down(F):
            n = F.shape[1] // q
            return _norm(F[:, :n * q].reshape(F.shape[0], n, q).mean(axis=2))
        Sc = {k: _smooth(down(S[k]), w) for k in ("P", "Ch")}
        Ac = {k: _smooth(down(A[k]), w) for k in ("P", "Ch")}
        Cc = p.wpitch * (1 - _sim(Sc["P"], Ac["P"])) + (1 - p.wpitch) * (1 - _sim(Sc["Ch"], Ac["Ch"]))
        _, wc = librosa.sequence.dtw(C=Cc, step_sizes_sigma=STEPS, weights_mul=WEIGHTS, backtrack=True)
        wc = wc[::-1]
        si = wc[:, 0] * q + q / 2
        ai = wc[:, 1] * q + q / 2
        order = np.argsort(si, kind="stable")
        exp_a = np.interp(np.arange(C.shape[0]), si[order], ai[order])
        J = np.arange(C.shape[1])[None, :]
        C = np.where(np.abs(J - exp_a[:, None]) <= p.band * p.fps, C, 4.0)
    kw = dict(global_constraints=True, band_rad=band) if band else {}
    _, wp = librosa.sequence.dtw(C=C, step_sizes_sigma=STEPS, weights_mul=WEIGHTS, subseq=False, backtrack=True, **kw)
    wp = wp[::-1]
    return wp, float(C[wp[:, 0], wp[:, 1]].mean())


def mapper(wp, fps, a_off=0.0):
    """Hàm giây bản nhạc (đã chuẩn độ dài) -> giây bản thu, theo điểm đầu tiên trên đường ở mỗi khung bản nhạc."""
    s, a = wp[:, 0], wp[:, 1]
    ns = s.max() + 1
    first = np.full(ns, np.inf)
    np.minimum.at(first, s, a)
    have = np.isfinite(first)
    if not have.all():
        first = np.interp(np.arange(ns), np.where(have)[0], first[have])

    def f(sec):
        x = sec * fps
        i0 = max(0, min(ns - 1, int(np.floor(x))))
        i1 = min(ns - 1, i0 + 1)
        fr = min(max(x - i0, 0), 1)
        return a_off + ((1 - fr) * first[i0] + fr * first[i1]) / fps
    return f


def first_last_sound(A, fps, thr_db=30):
    """Giây có tiếng đầu tiên và cuối cùng (mức trên mức 95% trừ thr_db)."""
    db = A["db"]
    on = np.where(db > np.percentile(db, 95) - thr_db)[0]
    return on[0] / fps, (on[-1] + 1) / fps


def _cut(A, i0, i1):
    return {k: (v[:, i0:i1] if isinstance(v, np.ndarray) and v.ndim == 2 else v) for k, v in A.items()}


def align(notes, audio_path, p, band=None):
    """Căn từ nốt đầu đến nốt cuối: bỏ im lặng hai đầu của cả bản nhạc lẫn bản thu.
    Trả về (hàm giây bản nhạc -> giây bản thu, thông tin)."""
    notes = np.asarray(notes, float)
    A = audio_feat(audio_path, p)
    a0, a1 = first_last_sound(A, p.fps)
    s0, s1 = notes[:, 0].min(), notes[:, 1].max()
    k = (a1 - a0) / (s1 - s0)                    # kéo bản nhạc cho bằng độ dài bản thu
    sh = notes.copy()
    sh[:, 0] = (sh[:, 0] - s0) * k
    sh[:, 1] = (sh[:, 1] - s0) * k
    S = score_feat(sh, p, total=(s1 - s0) * k)
    i0, i1 = int(a0 * p.fps), int(np.ceil(a1 * p.fps))
    wp, cost = dtw(S, _cut(A, i0, i1), p, band)
    g = mapper(wp, p.fps, i0 / p.fps)
    return (lambda sec: g((sec - s0) * k)), dict(cost=cost, a0=a0, a1=a1, dur=A["dur"], wp=wp, k=k)


def align_anchored(notes, audio_path, anchors, p):
    """Căn từng đoạn giữa các mốc neo đã biết chắc [(giây bản nhạc, giây bản thu)], rồi nối lại."""
    notes = np.asarray(notes, float)
    A = audio_feat(audio_path, p)
    a0, a1 = first_last_sound(A, p.fps)
    s0, s1 = notes[:, 0].min(), notes[:, 1].max()
    pts = [(s0, a0)] + sorted(anchors) + [(s1, a1)]
    pieces = []
    for (sa, aa), (sb, ab) in zip(pts[:-1], pts[1:]):
        sel = notes[(notes[:, 0] >= sa - 1e-6) & (notes[:, 0] < sb - 1e-6)].copy()
        k = (ab - aa) / (sb - sa)
        sel[:, 0] = (sel[:, 0] - sa) * k
        sel[:, 1] = np.minimum((sel[:, 1] - sa) * k, (sb - sa) * k)
        S = score_feat(sel, p, total=(sb - sa) * k)
        i0, i1 = int(aa * p.fps), int(np.ceil(ab * p.fps))
        wp, _ = dtw(S, _cut(A, i0, i1), p)
        pieces.append((sa, sb, k, mapper(wp, p.fps, i0 / p.fps)))

    def f(sec):
        for i, (sa, sb, k, g) in enumerate(pieces):
            if sec < sb or i == len(pieces) - 1:
                return g((max(sec, sa) - sa) * k)
    return f, dict(a0=a0, a1=a1, dur=A["dur"], cost=0.0, wp=None, k=None)


def onset_map(path, p):
    """Độ mạnh khởi âm theo từng nửa cung (hàng = MIDI LO + chỉ số): hiệu dương của log-CQT giữa hai khung liền nhau."""
    P, _, _ = audio_raw(path, p)
    L = np.log1p(1000 * P / (P.max() + 1e-9))
    return np.maximum(0, np.diff(L, axis=1, prepend=L[:, :1]))


def tempo_spread(wp, fps, win=6.0):
    """Độ biến thiên tốc độ cục bộ dọc đường DTW: phân vị 5% và 95% của log2(tỉ lệ) trên cửa sổ win giây."""
    s, a = wp[:, 0] / fps, wp[:, 1] / fps
    order = np.argsort(s, kind="stable")
    s, a = s[order], a[order]
    grid = np.arange(0, s.max() - win, win / 3)
    if len(grid) < 2:
        return 0.0, 0.0
    r = np.log2(np.maximum(np.interp(grid + win, s, a) - np.interp(grid, s, a), 0.05) / win)
    return float(np.percentile(r, 5)), float(np.percentile(r, 95))
