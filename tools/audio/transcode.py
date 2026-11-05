"""Chuyển mã một bản thu tải tay (thường từ IMSLP, nằm trong _imslp/) thành MP3 lưu trên site.

    python3 tools/audio/transcode.py ../opus-zero/_imslp/PMLP1776-grieg_arietta.mp3 --name grieg-arietta \\
        --work "Grieg: Arietta Op. 12 số 1" --by "Luis Kolodin" --lic "CC BY-SA 4.0" \\
        [--source https://imslp.org/wiki/File:...] [--t "Tên phần"]

Việc làm:
- MP3 tối đa 128 kbps (không tăng bitrate của file gốc), bỏ thẻ siêu dữ liệu cũ, ghi thẻ ID3: tên tác phẩm,
  người chơi, giấy phép, nguồn.
- Đầu file: nếu nốt đầu tiên đến sau hơn 1 giây im lặng, cắt bớt nhưng giữ 0,5 giây trước nốt đầu.
- Cuối file: chỉ cắt khi đã im lặng thật (dưới −60 dBFS) lâu hơn 3,5 giây; giữ 3 giây sau khi tiếng tắt
  và làm nhỏ dần 1 giây cuối (nằm trọn trong phần đã im). Còn tiếng tới cuối thì không cắt.
- Ghi file vào public/audio/<name>.mp3 và một dòng vào public/audio/NGUON.txt (thay dòng cũ cùng file).
- In JSON của phần bản thu ({t, mp3, d}, mp3 viết audio/<name>.mp3 như trong ban_thu) để đưa vào attach.py --part.

--out-dir DIR: ghi file vào DIR thay vì public/audio, không sửa NGUON.txt (để thử).
--ghi-de: file đích đã có thì phải thêm cờ này. File đang dùng trong ban_thu đã khóa thì từ chối (mở khóa trước).
--source: trang file ở nguồn; bỏ trống thì suy ra từ tên file IMSLP (PMLP…/IMSLP…): https://imslp.org/wiki/File:<tên>.
  File tải từ IMSLP thường có thêm tiền tố IMSLP<số>- (IMSLP815839-PMLP1846-….mp3): trang file là phần sau tiền tố.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import urllib.parse
from pathlib import Path

import licenses
import page
import sound

RATES = (32, 40, 48, 56, 64, 80, 96, 112, 128)
HEAD_KEEP, TAIL_KEEP, FADE = 0.5, 3.0, 1.0


def imslp_page(filename):
    filename = re.sub(r"^IMSLP\d+-(?=PMLP)", "", filename)   # tiền tố của file tải về, không có trong tên trang file
    return "https://imslp.org/wiki/File:" + urllib.parse.quote(filename.replace(" ", "_"), safe="/:(),'_-.")


def plan(src, start=None):
    """(giây bắt đầu, giây kết thúc, có làm nhỏ dần ở cuối không, thông tin đo) cho file gốc.
    start: ép điểm bắt đầu (chuyển mã lại một file đã có mốc mà không làm lệch mốc)."""
    dur = sound.probe(src)[0]
    lv = sound.levels(src)
    first, last = sound.sound_span(lv)
    if first is None:
        raise SystemExit("transcode: cả file im lặng (dưới %.0f dBFS)" % sound.SILENT)
    a = start if start is not None else (first - HEAD_KEEP if first > 2 * HEAD_KEEP else 0.0)
    z, fade = dur, False
    if dur - last > TAIL_KEEP + 0.5:
        z, fade = last + TAIL_KEEP, True
    return a, z, fade, dict(dur=round(dur, 2), first=round(first, 2), last=round(last, 2))


def bitrate(src):
    kbps = sound.probe(src)[1]
    return max([r for r in RATES if r <= min(128, kbps or 128)] or [RATES[0]])


def nguon_line(name, work, by, lic, lic_url, source):
    return "%s.mp3 — %s; trình bày: %s; giấy phép %s%s; nguồn: %s" % (name, work, by, lic, " (%s)" % lic_url if lic_url else "", source)


def update_nguon(line):
    f = page.AUDIO / "NGUON.txt"
    lines = f.read_text(encoding="utf-8").splitlines()
    key = line.split(" — ")[0] + " — "
    for i, x in enumerate(lines):
        if x.startswith(key):
            lines[i] = line
            break
    else:
        lines.append(line)
    f.write_text("\n".join(lines) + "\n", encoding="utf-8")


def dich_bi_chan(name, out_dir, ghi_de):
    """Lý do không được ghi file <name>.mp3 vào out_dir (None nếu được): file đã có mà thiếu --ghi-de; file trong
    public/audio/ đang dùng ở ban_thu đã khóa của một bản ghi (đổi file là đổi bản thu đã kiểm định: mở khóa trước)."""
    dst = Path(out_dir) / (name + ".mp3")
    if dst.exists() and not ghi_de:
        return "%s đã có: thêm --ghi-de để chuyển mã lại (giữ mốc thì dùng --start, xem tools/audio/README.md)" % dst
    if Path(out_dir).resolve() == page.AUDIO.resolve():
        mp3 = page.asset_url(name + ".mp3")
        for r in page.records():
            if any(p.get("mp3") == mp3 for b in r.get("ban_thu") or [] for p in b.get("parts") or []) and page.field_locked(r["slug"], "ban_thu"):
                return "%s đang dùng trong ban_thu đã khóa của bản ghi %s: %s" % (mp3, r["slug"], page.unlock_hint("du-lieu/tac-pham/" + r["slug"]))
    return None


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", help="file gốc, ví dụ ../opus-zero/_imslp/PMLP1776-grieg_arietta.mp3")
    ap.add_argument("--name", required=True, help="tên file trên site, không có đuôi: chữ thường, số, gạch nối")
    ap.add_argument("--work", required=True, help='tên tác phẩm, ví dụ "Grieg: Arietta Op. 12 số 1"')
    ap.add_argument("--by", required=True, help="người chơi; ghi chú thêm trong ngoặc, ví dụ \"Jewgeni Smirnow (đàn piano điện)\"")
    ap.add_argument("--lic", required=True, help="giấy phép ghi trên trang file ở nguồn")
    ap.add_argument("--source", help="link trang file ở nguồn")
    ap.add_argument("--t", default="", help="tên phần (bản thu nhiều phần)")
    ap.add_argument("--start", type=float, help="ép điểm bắt đầu (giây trong file gốc); dùng khi chuyển mã lại file đã có mốc, "
                    "lấy số 'cắt đầu' từ check_audio.py -v để mốc không lệch")
    ap.add_argument("--out-dir", help="thư mục ra để thử (không sửa NGUON.txt)")
    ap.add_argument("--ghi-de", action="store_true", help="ghi đè file đã có")
    a = ap.parse_args(argv)

    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", a.name):
        sys.exit("transcode: --name chỉ gồm chữ thường không dấu, số và gạch nối")
    chan = dich_bi_chan(a.name, Path(a.out_dir) if a.out_dir else page.AUDIO, a.ghi_de)
    if chan:
        sys.exit("transcode: " + chan)
    sound.need_ffmpeg()
    try:
        lic, lic_url = licenses.parse(a.lic)
    except ValueError as e:
        sys.exit("transcode: " + str(e))
    src = Path(a.src)
    source = a.source
    if not source:
        if not re.match(r"(PMLP|IMSLP)\d", src.name):
            sys.exit("transcode: cần --source (link trang file ở nguồn)")
        source = imslp_page(src.name)
    out_dir = Path(a.out_dir) if a.out_dir else page.AUDIO
    out_dir.mkdir(parents=True, exist_ok=True)
    dst = out_dir / (a.name + ".mp3")

    start, end, fade, info = plan(src, a.start)
    rate = bitrate(src)
    # Không cắt đuôi thì giữ trọn luồng: độ dài ffprobe báo có thể ngắn hơn phần giải mã được (mất tiếng ngân cuối)
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", "%.3f" % start] + (["-to", "%.3f" % end] if fade else []) + [
           "-i", str(src), "-map", "0:a:0", "-map_metadata", "-1"]
    if fade:
        cmd += ["-af", "afade=t=out:st=%.3f:d=%.3f" % (end - start - FADE, FADE)]
    if sound.probe(src)[2] > 48000:
        cmd += ["-ar", "48000"]
    cmd += ["-c:a", "libmp3lame", "-b:a", "%dk" % rate, "-id3v2_version", "3",
            "-metadata", "title=" + a.work, "-metadata", "artist=" + a.by,
            "-metadata", "copyright=" + (lic + (" " + lic_url if lic_url else "")),
            "-metadata", "comment=Nguồn: " + source, str(dst)]
    subprocess.run(cmd, check=True)
    d = round(sound.probe(dst)[0], 2)

    print("%s: gốc %.2f s, tiếng từ %.2f đến %.2f s; cắt %.2f–%.2f s%s; %d kbps; ra %.2f s, %d KB" % (
        dst, info["dur"], info["first"], info["last"], start, end, ", làm nhỏ dần 1 s cuối" if fade else "", rate, d,
        os.path.getsize(dst) // 1024), file=sys.stderr)
    if not a.out_dir:
        update_nguon(nguon_line(a.name, a.work, a.by, lic, lic_url, source))
        print("đã ghi dòng nguồn vào %s" % (page.AUDIO / "NGUON.txt").relative_to(page.ROOT), file=sys.stderr)
    part = {"t": a.t, "mp3": page.asset_url(a.name + ".mp3"), "d": d}
    print(json.dumps({k: v for k, v in part.items() if v != ""}, ensure_ascii=False))


if __name__ == "__main__":
    main()
