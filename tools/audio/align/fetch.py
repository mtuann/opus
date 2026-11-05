"""Tải bản nhạc số cần cho việc căn mốc vào scores/ của bộ nhớ đệm (xem net.py), theo danh sách sources.json.

    python3 tools/audio/align/fetch.py                       # mọi file trong sources.json
    python3 tools/audio/align/fetch.py cpm_elise.mid ...     # một vài file
    python3 tools/audio/align/fetch.py --from _imslp/_scripts/align/src   # chép từ thư mục có sẵn trước khi tải
    python3 tools/audio/align/fetch.py --status              # file nào đã có, file nào còn thiếu
    python3 tools/audio/align/fetch.py --add kern_sonata11-3.krn --set kernscores-mozart \\
        --url https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/<commit>/kern/sonata11-3.krn
                                                             # thêm một nguồn: tải, tính sha256, ghi sources.json

Đặt tên file theo bộ: asap_<Tác giả>_<Tác phẩm>_<số>_midi_score.mid (kèm _midi_score_annotations.txt), cpm_<tên>.mid
(piano-midi.de), kern_<tên>.krn, mutopia_<tên>.mid, dcml_<tên>.notes.tsv và .measures.tsv; MEI, MusicXML giữ tên gốc.
--add với file đã tải tay (site chặn tải tự động): thêm --file <đường dẫn> --manual.
--add với file nằm trong một file zip (Mutopia đóng gói MIDI của bài nhiều phần thành <tên>-mids.zip): --url là link
file zip, thêm --member <tên file trong zip>; sha256 tính trên file đã lấy ra.

Mỗi file phải khớp sha256 ghi trong sources.json (đúng bản đã dùng để căn mốc hiện có). File "manual" (site chặn
tải tự động hoặc tạm ngừng) thì tải tay bằng trình duyệt từ link in ra, đặt vào thư mục scores/ với đúng tên.
Nguồn và giấy phép của từng bộ: NGUON.md. Các file này không đưa lên git.
"""
import argparse
import hashlib
import io
import json
import shutil
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import net  # noqa: E402

SOURCES = json.loads((HERE / "sources.json").read_text(encoding="utf-8"))


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def get(url, tmp, member=None):
    """Tải url về tmp; member: url là file zip, chỉ giữ file member trong đó."""
    net.download(url, tmp)
    if member:
        data = zipfile.ZipFile(io.BytesIO(tmp.read_bytes())).read(member)
        tmp.write_bytes(data)
    return tmp


def add(a):
    if a.add in SOURCES:
        sys.exit("%s đã có trong sources.json" % a.add)
    if not (a.url and a.dataset):
        sys.exit("--add cần --url và --set")
    dest = net.cache_dir("scores")
    if a.file:
        data = Path(a.file).read_bytes()
    elif a.manual:
        sys.exit("nguồn tải tay: tải bằng trình duyệt rồi chạy lại với --file <đường dẫn>")
    else:
        data = get(a.url, dest / (a.add + ".new"), a.member).read_bytes()
        (dest / (a.add + ".new")).unlink()
    entry = {"set": a.dataset, "url": a.url, "sha256": hashlib.sha256(data).hexdigest()}
    if a.member:
        entry["member"] = a.member
    if a.manual:
        entry["manual"] = True
    if a.note:
        entry["note"] = a.note
    (dest / a.add).write_bytes(data)
    SOURCES[a.add] = entry
    (HERE / "sources.json").write_text(json.dumps(dict(sorted(SOURCES.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("đã thêm %s (sha256 %s) vào sources.json và chép vào %s" % (a.add, entry["sha256"], dest))
    if a.dataset not in {v["set"] for k, v in SOURCES.items() if k != a.add}:
        print("bộ %r mới: thêm nguồn và giấy phép vào align/NGUON.md" % a.dataset)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("names", nargs="*", help="tên file trong sources.json (bỏ trống: tất cả)")
    ap.add_argument("--from", dest="mirror", help="thư mục có sẵn các file cùng tên (chỉ nhận file đúng sha256)")
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--add", metavar="TÊN", help="thêm một file vào sources.json (cần --url, --set)")
    ap.add_argument("--url", help="link tải (GitHub: ghim theo commit)")
    ap.add_argument("--set", dest="dataset", help="tên bộ dữ liệu, như trong NGUON.md (thêm dòng mới vào NGUON.md nếu là bộ mới)")
    ap.add_argument("--file", help="lấy nội dung từ file này thay vì tải (file đã tải tay)")
    ap.add_argument("--manual", action="store_true", help="đánh dấu phải tải tay")
    ap.add_argument("--member", help="--url là file zip: tên file cần lấy trong zip")
    ap.add_argument("--note", help="ghi chú cho người tải sau")
    a = ap.parse_args()
    if a.add:
        add(a)
        return
    unknown = [n for n in a.names if n not in SOURCES]
    if unknown:
        sys.exit("không có trong sources.json: " + ", ".join(unknown))
    dest = net.cache_dir("scores")
    todo, manual, bad = a.names or sorted(SOURCES), [], []
    for name in todo:
        s = SOURCES[name]
        target = dest / name
        if target.exists() and sha256(target) == s["sha256"]:
            if a.status:
                print("có    %s" % name)
            continue
        if a.status:
            print("thiếu %s%s" % (name, " (tải tay)" if s.get("manual") else ""))
            continue
        if a.mirror and (Path(a.mirror) / name).exists():
            src = Path(a.mirror) / name
            if sha256(src) == s["sha256"]:
                shutil.copyfile(src, target)
                print("chép  %s" % name)
                continue
        if s.get("manual"):
            manual.append((name, s))
            continue
        tmp = dest / (name + ".new")
        tmp.unlink(missing_ok=True)
        try:
            get(s["url"], tmp, s.get("member"))
        except Exception as e:                       # 404, máy chủ ngừng...: báo rồi làm tiếp file khác
            bad.append((name, None))
            print("LỖI  %s: %s (%s)" % (name, e, s["url"]))
            continue
        got = sha256(tmp)
        if got != s["sha256"]:
            bad.append((name, got))
            print("KHÁC  %s: sha256 %s, sources.json ghi %s (giữ ở %s)" % (name, got[:12], s["sha256"][:12], tmp))
            continue
        tmp.replace(target)
        print("tải   %s" % name)
    if manual:
        print("\nCần tải tay (đặt vào %s, giữ đúng tên):" % dest)
        for name, s in manual:
            print("  %s  <-  %s%s" % (name, s["url"], "  (%s)" % s["note"] if s.get("note") else ""))
    if any(got for _, got in bad):
        print("\nNguồn đã đổi so với bản dùng để căn mốc: so lại nội dung (explore.py bars) trước khi cập nhật sha256.")
    sys.exit(1 if (manual or bad) and not a.status else 0)


if __name__ == "__main__":
    main()
