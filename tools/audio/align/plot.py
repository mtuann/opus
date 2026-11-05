"""Hình để kiểm tra mốc bằng mắt: phổ CQT của bản thu (trục cao độ MIDI), chồng nốt của bản nhạc đã căn và vạch mốc."""
import numpy as np
import librosa
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

import core  # noqa: E402


def verify(audio_path, notes, fmap, segs, out, marks=(), title=""):
    """segs: [(t0, t1)] giây trong bản thu; notes: nốt theo giây bản nhạc; fmap: giây bản nhạc -> giây bản thu;
    marks: [(tên, giây bản thu)]. Ghi PNG vào out."""
    y, sr = librosa.load(str(audio_path), sr=core.SR, mono=True)
    hop = 256
    cols = 2 if len(segs) > 2 else 1
    nrows = (len(segs) + cols - 1) // cols
    fig, axs = plt.subplots(nrows, cols, figsize=(16, 2.6 * nrows), squeeze=False)
    axes = [axs[i // cols][i % cols] for i in range(len(segs))]
    for j in range(len(segs), nrows * cols):
        axs[j // cols][j % cols].axis("off")
    on_a = np.array([fmap(n[0]) for n in notes])
    off_a = np.array([fmap(n[1]) for n in notes])
    for ax, (t0, t1) in zip(axes, segs):
        a, b = int(t0 * sr), int(t1 * sr)
        C = np.abs(librosa.cqt(y[a:b], sr=sr, hop_length=hop, fmin=librosa.midi_to_hz(28), n_bins=72, bins_per_octave=12))
        C = librosa.amplitude_to_db(C, ref=np.max)
        ax.imshow(C, origin="lower", aspect="auto", cmap="magma", vmin=-60, vmax=0, extent=[t0, t0 + C.shape[1] * hop / sr, 27.5, 99.5])
        sel = (on_a >= t0 - 1) & (on_a <= t1)
        for (on, off, p, v), x0, x1 in zip(notes[sel], on_a[sel], off_a[sel]):
            ax.plot([x0, max(x0 + 0.05, min(x1, x0 + 0.4))], [p, p], color="cyan", lw=1.6, alpha=0.85)
            ax.plot([x0], [p], "o", color="cyan", ms=2.5)
        for name, t in marks:
            if t0 <= t <= t1:
                ax.axvline(t, color="lime", lw=1.5)
                ax.text(t, 97, name, color="lime", fontsize=8, va="top")
        ax.set_xlim(t0, t1)
        ax.set_ylim(27.5, 99.5)
        ax.set_ylabel("MIDI")
    fig.suptitle(title)
    plt.tight_layout()
    plt.savefig(out, dpi=70)
    plt.close(fig)


def overview(audio_path, out, marks=(), per_row=60.0, title="", p=core.Params()):
    """Toàn cảnh bản thu: phổ nửa cung nén theo thời gian, mỗi dòng per_row giây, có vạch mốc."""
    P, _, dur = core.audio_raw(audio_path, p)
    L = np.log1p(1000 * P / (P.max() + 1e-9))
    n = int(np.ceil(dur / per_row))
    fig, axes = plt.subplots(n, 1, figsize=(16, 2.0 * n), squeeze=False)
    for i in range(n):
        ax = axes[i][0]
        t0, t1 = i * per_row, min(dur, (i + 1) * per_row)
        a, b = int(t0 * p.fps), int(t1 * p.fps)
        ax.imshow(L[:, a:b], origin="lower", aspect="auto", cmap="magma",
                  extent=[t0, t0 + (b - a) / p.fps, core.LO - 0.5, core.LO + core.NB - 0.5])
        for name, t in marks:
            if t0 <= t <= t1:
                ax.axvline(t, color="lime", lw=1.2)
                ax.text(t, core.LO + core.NB - 3, name, color="lime", fontsize=8, va="top")
        ax.set_xlim(t0, t0 + per_row)
        ax.set_yticks([36, 48, 60, 72, 84, 96])
    axes[0][0].set_title(title)
    plt.tight_layout()
    plt.savefig(out, dpi=60)
    plt.close(fig)
