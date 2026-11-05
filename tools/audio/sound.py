"""Đo file âm thanh bằng ffprobe và ffmpeg (cần có trong PATH): độ dài, bitrate, mức âm lượng theo từng khung."""
import array
import json
import math
import shutil
import subprocess

SR = 22050          # tần số lấy mẫu khi đo mức
WIN = 0.05          # giây mỗi khung đo
SILENT = -60.0      # dBFS: dưới mức này coi là im lặng thật


def need_ffmpeg():
    if not (shutil.which("ffmpeg") and shutil.which("ffprobe")):
        raise SystemExit("cần ffmpeg và ffprobe trong PATH (macOS: brew install ffmpeg; Ubuntu: apt install ffmpeg)")


def probe(path):
    """(độ dài giây, bitrate kbps hoặc 0, tần số lấy mẫu, số kênh)."""
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
                          "format=duration,bit_rate:stream=sample_rate,channels", "-of", "json", str(path)],
                         capture_output=True, text=True, check=True).stdout
    o = json.loads(out)
    st = (o.get("streams") or [{}])[0]
    return (float(o["format"]["duration"]), int(o["format"].get("bit_rate") or 0) // 1000,
            int(st.get("sample_rate") or 0), int(st.get("channels") or 0))


def levels(path, start=None, win=WIN, dur=None):
    """Mức RMS (dBFS) của từng khung win giây, trộn về một kênh. start: chỉ đo từ giây này (âm: tính từ cuối file);
    dur: chỉ đo chừng ấy giây."""
    cmd = ["ffmpeg", "-v", "error"]
    if start is not None:
        cmd += ["-sseof" if start < 0 else "-ss", "%.3f" % start]
    if dur is not None:
        cmd += ["-t", "%.3f" % dur]
    cmd += ["-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    a = array.array("h")
    a.frombytes(subprocess.run(cmd, capture_output=True, check=True).stdout)
    n = max(1, int(SR * win))
    out = []
    for i in range(0, len(a), n):
        chunk = a[i:i + n]
        if len(chunk) < n // 2:
            break
        ms = sum(x * x for x in chunk) / len(chunk)
        out.append(10 * math.log10(ms / 32768.0 ** 2 + 1e-12))
    return out


def sound_span(lv, win=WIN, thr=SILENT):
    """(giây có tiếng đầu tiên, giây tiếng tắt hẳn) theo ngưỡng thr; (None, None) nếu cả file im lặng."""
    loud = [i for i, x in enumerate(lv) if x > thr]
    if not loud:
        return None, None
    return loud[0] * win, (loud[-1] + 1) * win
