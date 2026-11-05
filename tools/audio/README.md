# Công cụ bản thu

Các script ở đây tìm bản thu có giấy phép mở, đưa bản thu vào trang (khối `oz-listen` với `data-rec`), chuyển mã bản thu IMSLP để lưu trên site, kiểm tra toàn bộ bản thu của site, và căn mốc tham khảo cho bảng "Theo dõi khi nghe". Chúng thay cho các script cũ của v12–v14 trong `_imslp/_scripts/` (giữ lại để tham khảo, đừng chạy).

| File | Việc | Cần |
|---|---|---|
| `licenses.py` | Danh sách giấy phép được nhận (nơi duy nhất trong code): phạm vi công cộng (kể cả PDM), CC0, CC BY và CC BY-SA từ 2.0 đến 4.0. Không nhận NC, ND | Python 3.10+ |
| `commons.py` | Tìm và tra file trên Wikimedia Commons, đọc trang mô tả file, in JSON khối bản thu cho `attach.py` | Python, mạng |
| `transcode.py` | Chuyển mã bản thu tải tay (IMSLP) thành MP3 trong `docs/assets/audio/`, ghi `NGUON.txt` | Python, ffmpeg |
| `attach.py` | Ghi khối bản thu (hoặc chỉ mốc `ref`) vào trang, kiểm tra trước khi ghi | Python |
| `check_audio.py` | Kiểm tra mọi file, `NGUON.txt` và mọi `data-rec`; `--network` đối chiếu với Commons | Python, ffmpeg |
| `align/` | Căn mốc tham khảo bằng bản nhạc số (DTW) | `requirements.txt` |
| `net.py`, `page.py`, `sound.py` | Phần dùng chung: tải có User-Agent và nghỉ giữa các yêu cầu, đọc và ghi khối bản thu, đo âm lượng | |

Các lệnh dưới đây chạy từ thư mục gốc của repo, bằng `python3`, trừ các lệnh trong `align/` (chạy bằng `.venv-audio/bin/python`, xem mục Căn mốc). Mọi script có `--help`. Bộ nhớ đệm (câu trả lời API, bản thu tải về, bản nhạc số, đặc trưng, hình kiểm tra) nằm ngoài repo, ở `~/.cache/opus-zero/` (đổi bằng biến `OZ_AUDIO_CACHE`).

## Thêm một bản thu, từ đầu đến cuối

### 1. Kiểm tra bản quyền và chọn bản thu

Đọc mục Bản quyền của `AGENTS.md` trước. Tóm tắt: tác phẩm phải hết bảo hộ ở cả Việt Nam và Mỹ; bản thu phải có giấy phép trong danh sách của `licenses.py`. Ở Mỹ, bản thu xuất bản từ 1923 đến 1946 được bảo hộ 100 năm (bản 1924 vào phạm vi công cộng năm 2025, bản 1929 phải tới năm 2030).

Tìm trên Commons (Musopen đăng nhiều bản CC0 và phạm vi công cộng ở đây):

```bash
python3 tools/audio/commons.py search "Mozart sonata K. 331" --limit 50
python3 tools/audio/commons.py info "File:Tên file.ogg"
python3 tools/audio/commons.py --fresh page "File:Tên file.ogg"     # trang mô tả file
```

`search` mặc định trả 20 kết quả, và báo khi chạm giới hạn. Thử thêm truy vấn khác: tên tác phẩm theo tiếng Anh, Đức, Pháp, số danh mục, tên người chơi.

Dấu ✓ chỉ cho biết giấy phép ghi trên Commons nằm trong danh sách được nhận. Mọi thứ khác phải đọc trên trang mô tả của từng file (lệnh `page`; `--fresh` để không dùng bản đã lưu):

- Ai chơi. Trường `artist` của `info` nhiều khi là nhà soạn nhạc.
- Có phải người chơi thật không. Nhiều file là nhạc dựng từ MIDI ("synthesized", "rendered", "MIDI"): không dùng làm bản thu gợi ý.
- Thu năm nào, xuất bản ở đâu (luật Mỹ ở trên).
- Mẫu giấy phép thật trên trang (ví dụ `{{PD-self}}`, `{{cc-by-sa-4.0}}`).

Chọn bản chơi đúng tác phẩm, đúng chương, nghe được trọn. Nếu file dừng giữa chừng, ghi vào `note`, ví dụ "file dừng ở khoảng 6:24". Tác phẩm nhiều chương thì mỗi chương là một phần, theo đúng thứ tự trang dùng.

Bản thu chỉ có trên IMSLP: ghi tên file và link trang file vào báo cáo để chủ site tải tay vào `_imslp/`. Không tải tự động từ IMSLP.

### 2a. Bản thu Commons: ghi vào trang

```bash
python3 tools/audio/commons.py rec --by "Kimiko Ishizaka" "File:A.ogg" "File:B.ogg" --t "Prelude" --t "Fugue" > /tmp/rec.json
python3 tools/audio/attach.py docs/piano/tac-pham/<slug>.md --json /tmp/rec.json --dry-run   # xem trước
python3 tools/audio/attach.py docs/piano/tac-pham/<slug>.md --json /tmp/rec.json
```

`rec` lấy các trường sau, rồi báo lỗi nếu một file không có MP3, giấy phép không được nhận, hoặc các file khác giấy phép nhau:

- MP3 chuyển mã của Commons (`mp3`) và file gốc (`src`);
- độ dài (`d`);
- giấy phép và link giấy phép;
- trang mô tả của file đầu tiên (`page`).

Sửa `by` cho đúng cách ghi người chơi trên site, ví dụ "Frank Lévy (Musopen)": lấy tên từ trang mô tả, không lấy từ `artist`.

### 2b. Bản thu IMSLP: chuyển mã, ghi nguồn, ghi vào trang

```bash
python3 tools/audio/transcode.py "_imslp/PMLP1776-grieg_arietta.mp3" --name grieg-arietta \
    --page docs/piano/tac-pham/grieg-arietta.md --work "Grieg: Arietta Op. 12 số 1" \
    --by "Luis Kolodin" --lic "CC BY-SA 4.0"
# in ra: {"mp3": "../../../assets/audio/grieg-arietta.mp3", "d": 86.83}
python3 tools/audio/attach.py docs/piano/tac-pham/grieg-arietta.md --by "Luis Kolodin" --lic "CC BY-SA 4.0" \
    --source "https://imslp.org/wiki/File:PMLP1776-grieg_arietta.mp3" \
    --part '{"mp3":"../../../assets/audio/grieg-arietta.mp3","d":86.83}'
```

`transcode.py`:

- MP3 tối đa 128 kbps.
- Đầu file: cắt khoảng lặng nhưng giữ 0,5 giây trước nốt đầu.
- Cuối file: chỉ cắt khi đã im hẳn (dưới −60 dBFS) hơn 3,5 giây; giữ 3 giây sau khi tiếng tắt và làm nhỏ dần giây cuối, nằm trọn trong phần đã im.
- Ghi thẻ ID3 (tên tác phẩm, người chơi, giấy phép, nguồn).
- Ghi một dòng vào `docs/assets/audio/NGUON.txt`, thay dòng cũ cùng tên file.
- Link nguồn suy ra từ tên file IMSLP (`PMLP…`); tên file khác thì thêm `--source`.

Thử trước bằng `--out-dir /tmp/thu`: lệnh ghi file vào thư mục đó và không sửa `NGUON.txt`.

Thêm file mới vào `docs/assets/audio/` thì sửa thêm hai chỗ:

- Câu "Thay đổi" ở đầu `NGUON.txt` (mô tả cách cắt đầu, cắt đuôi, làm nhỏ dần) cho đúng với file mới.
- Con số "N bản thu từ IMSLP" ở `docs/tai-lieu-tham-khao.md`. `python3 tests/counts.py` báo chỗ còn số cũ.

Bản thu nhiều file (nhiều chương): chạy `transcode.py` cho từng file, thêm `--t "Tên phần"`. Rồi `attach.py` với nhiều `--part`, theo thứ tự. `page` lúc này là trang tác phẩm trên IMSLP. Ví dụ ở `piano/tac-pham/schumann-album.md`.

Chuyển mã lại một file đã có mốc (sửa đuôi, đổi bitrate): làm theo các bước sau, nếu không mọi mốc sẽ lệch.

1. Lấy số giây đã cắt ở đầu (dòng "cắt đầu") bằng `python3 tools/audio/check_audio.py -v`.
2. Chạy lại với `--start <số đó>`.
3. Ghi lại bằng `attach.py ... --keep-ref`.

### 2c. Bản thu chỉ dẫn link

Bản thu dài (từ khoảng 10 phút) hoặc nhiều chương thì không lưu trên site: repo và site sẽ quá nặng. Bản thu còn bảo hộ ở Mỹ cũng không phát trên site. Khi đó khối bản thu chỉ dẫn link: mỗi phần có `link` thay cho `mp3`, trang hiện link "Mở" từng phần thay cho nút "Nghe bản này", và mốc tham khảo vẫn hiện trong bảng, ghi thời điểm trong từng phần.

```bash
python3 tools/audio/attach.py docs/nghe-nhac/mussorgsky-tranh.md --by "Chiara Bertoglio" --lic "CC BY 3.0" \
    --source "https://imslp.org/wiki/Pictures_at_an_Exhibition_(Mussorgsky,_Modest)" \
    --part '{"link":"https://imslp.org/wiki/Special:ImagefromIndex/251520","src":"https://imslp.org/wiki/File:PMLP03722-Quadri.mp3","d":2023.95}'
```

- `link` (IMSLP): `Special:ImagefromIndex/<số>`, số của file ghi trên trang tác phẩm (`#<số>`). Link này đi qua trang tải của IMSLP, đúng cách IMSLP muốn; đừng dùng link thẳng tới máy chủ file.
- `src` (IMSLP): trang `File:` của file. Căn mốc (`run.py`) dùng bản bạn đã tải tay vào `_imslp/` (tên có hay không có tiền tố `IMSLP<số>-` đều được).
- `d`: độ dài của chính file ở link (`ffprobe`), vì mốc tính theo file đó, không theo bản đã chuyển mã.
- Commons: `link` là trang `File:`, `src` là file gốc trên `upload.wikimedia.org`; `check_audio.py --network` vẫn đối chiếu được.
- File gốc không có trên site nên không thêm dòng vào `NGUON.txt`; người chơi, giấy phép và nguồn ghi trong khối bản thu và ở mục Nguồn của trang.

### 3. Mốc tham khảo

Mỗi số trong `ref` là thời điểm của một dòng trong bảng "Theo dõi khi nghe", theo đúng thứ tự dòng. Số tính bằng giây, **liền qua các phần**: phần 2 bắt đầu ở giây bằng `d` của phần 1. Dòng nào không chắc thì để `null` (trang hiện "chưa có"). **Mốc phải đúng hoặc bỏ trống.** Hai cách lấy mốc:

- Căn bằng bản nhạc số: xem mục Căn mốc bên dưới. Đây là cách đã dùng cho mọi trang hiện có.
- Đo tay rồi ghi: `python3 tools/audio/attach.py <trang> --ref "1,13,null,33"`. Đo bằng `align/explore.py onsets` (khởi âm từng cao độ, giây tính trong phần) hoặc nghe nhiều lần. Ghi cách đo vào báo cáo.

Thay bản thu thì `attach.py` bỏ mốc cũ (in ra để bạn biết). Chỉ thêm `--keep-ref` khi file mới cùng nội dung với file cũ.

### 4. Kiểm tra

```bash
python3 tools/audio/check_audio.py             # file, NGUON.txt, data-rec, độ dài, đuôi file (cần ffmpeg)
python3 tools/audio/check_audio.py --network   # thêm: file Commons còn đó, độ dài và giấy phép khớp
python3 tools/audio/check_audio.py --static --network   # chỉ data-rec và Commons, không cần ffmpeg (CI chạy hằng tuần)
python3 tools/audio/check_audio.py --tail <file.mp3>   # chỉ đo đuôi một file (thử kết quả transcode.py)
mkdocs build --strict && npm test
```

`npm test` (nhóm `nhanh`) chạy `check_audio.py --static`, chỉ kiểm `NGUON.txt` và `data-rec` nên không cần ffmpeg. Bản đầy đủ đo thêm từng file và chạy tay. Lỗi in "LỖI" và làm lệnh thất bại; dòng "chú ý" chỉ để biết (ví dụ file trên site không trang nào dùng, hay giữ ít hơn 3 giây im lặng ở cuối). Đuôi file được kiểm hai cách:

- 0,25 giây cuối không to hơn −50 dBFS: bắt được chỗ cắt khi nhạc còn to.
- Khi file gốc có trong `_imslp/`: so với file gốc, file trên site không được dừng trước khi tiếng tắt. Cách này bắt được cả lỗi của script cũ (cắt theo ngưỡng −45 dB rồi cộng 2 giây, mất tiếng ngân ở mức khoảng −60 dBFS), lỗi mà ngưỡng −50 dBFS bỏ sót.

Cuối cùng ghi vào báo cáo: bản thu đã chọn, giấy phép, link trang mô tả, những dòng để `null` và lý do.

## Căn mốc (`align/`)

Cài môi trường riêng (thư viện nặng, không trộn với môi trường của site). Mọi lệnh trong `align/` chạy bằng Python này:

```bash
python3 -m venv .venv-audio && .venv-audio/bin/pip install -r tools/audio/requirements.txt
PY=.venv-audio/bin/python
$PY tools/audio/align/fetch.py --from _imslp/_scripts/align/src   # bản nhạc số đã dùng (nếu có thư mục này)
```

`fetch.py` tải các file trong `align/sources.json` vào bộ nhớ đệm và chỉ nhận file đúng sha256. Nguồn piano-midi.de chặn tải tự động, còn KernScores đang bảo trì. Các file đó `fetch.py` liệt kê để tải tay, hoặc chép từ `--from` nếu có. Nguồn và giấy phép từng bộ: `align/NGUON.md`.

### Cách căn

`align/core.py` dựng đặc trưng (phổ theo nửa cung, chroma, khởi âm) cho cả bản thu và bản nhạc. Bản nhạc được kéo cho bằng độ dài bản thu: nốt đầu khớp tiếng đầu tiên, nốt cuối khớp tiếng cuối cùng của phần. Rồi DTW tìm đường khớp nhất. Mỗi dòng của bảng ứng với một vị trí ô nhịp (hoặc phách) trong bản nhạc.

Mỗi dòng được căn ba lần với ba bộ tham số: thường, có đặc trưng khởi âm, thô→mịn. Dòng được nhận khi hai lần lệch nhau không quá 2 giây. Nếu job có nguồn bản nhạc thứ hai (`check`), kết quả còn phải khớp nguồn đó trong 2 giây. Dòng không qua được thì ghi `null`, trừ khi bạn đo tay trên phổ và ghi vào `fix`.

Biến thể thô→mịn thường cho ra đúng như biến thể thường, nên "hai trong ba" nhiều khi chỉ là một ý kiến. Đối chiếu bằng một nguồn bản nhạc độc lập (`check`) chặt hơn, nên dùng khi có. Ở đợt kiểm tra 10/2026, cả hai cách đều từng sai ở một vài dòng (xem các `fix` có ghi "kiểm tra 10/2026" trong `pieces.py`). Vì vậy dòng nào có dấu ⚠ đều phải xem lại trên phổ.

### Thêm cấu hình cho một trang

Ghi khối bản thu vào trang trước (mục 2): `run.py` căn bản thu ghi trong `data-rec`. Các lệnh `explore.py` nhận thẳng một file hoặc link âm thanh nếu trang chưa có khối bản thu.

1. **Nguồn bản nhạc số.** Tìm bản đúng tác phẩm và đúng chương (Mutopia, KernScores, ASAP, piano-midi.de...); mở đầu file xem ghi tác phẩm gì. Đọc giấy phép, thêm vào `align/NGUON.md`. Rồi `$PY tools/audio/align/fetch.py --add <tên> --set <bộ> --url <link>`: lệnh tải file, tính sha256, ghi `sources.json` (link GitHub ghim theo commit). Cách đặt tên file ở `fetch.py --help`. Nguồn phải tải tay thì thêm `--file <file đã tải> --manual`. File nằm trong một file zip (Mutopia đóng gói MIDI của bài nhiều phần thành `<tên>-mids.zip`): `--url` là link file zip, thêm `--member <tên file trong zip>`.
2. **Chỉ số ô.** Chạy `$PY tools/audio/align/explore.py bars <tên file> [--qpm 80]`.
    - Cột đầu là chỉ số ô dùng trong `pieces.py`, từ 0, theo thứ tự trong file. Số trong ngoặc vuông là số ô in trên bản nhạc (kern, MEI, MusicXML, DCML); MIDI không có số in.
    - Ô lấy đà, kết 1, kết 2, cadenza là những ô riêng và thường không có số in, nên chỉ số lệch dần so với số in. Luôn tra bảng này, đừng suy từ số in.
    - MIDI có thể đã viết ra các dấu nhắc lại. Kern không mở dấu nhắc lại: dòng `*>[A,A,B,B...]` trong file cho biết thứ tự chơi các đoạn (nhãn `*>A`, `*>B` đánh dấu đầu mỗi đoạn); nối bằng `segs`.
    - Tác phẩm nằm ở nhiều file (chủ đề và từng biến tấu): `bars a.krn b.krn ...` cho chỉ số ô chạy liền qua các file, đúng như `join` trong `pieces.py`.
3. **Bản thu chơi những dấu nhắc lại nào.** Nghe, hoặc so các cách nối đoạn: `$PY tools/audio/align/explore.py structure <trang> <tên file> --segs "" --segs "[(0,7),(0,7),(8,23)]" [--part 0]`.
    - Chi phí thấp và biến thiên tốc độ nhỏ là dấu hiệu tốt.
    - `k` (độ dài bản thu chia độ dài bản nhạc) chỉ có nghĩa khi so giữa các cách nối của cùng một nguồn: với kern, MEI, độ dài bản nhạc tùy `--qpm`.
    - Khi các dấu hiệu không cùng chỉ một cách, nghe lại chỗ nghi ngờ hoặc xem `onsets`, đừng chọn theo một con số.
4. **Viết cấu hình.** Thêm một mục vào `PIECES` trong `align/pieces.py`; docstring ở đầu file giải thích từng khóa.
    - Khóa của `rows` là số thứ tự dòng trong bảng, **tính từ 0**. `run.py` in số dòng tính từ 1, như người đọc thấy.
    - Mỗi job căn trọn một phần của bản thu: bản nhạc (sau `segs`, `join`) phải phủ mọi thứ phần đó chơi, từ nốt đầu tới nốt cuối. Phần chứa nhiều bài mà bản nhạc nằm ở nhiều file thì dùng `join=[dict(src=...), dict(src=...)]` thay cho `src`.
    - Dòng ứng với đầu một phần (chương, bài trong tập, biến tấu nằm ở file riêng) thì ghi `"start"`: lúc có tiếng đầu tiên của phần. Dùng được cả trong job có bản nhạc lẫn job không có.
5. **Chạy.** `$PY tools/audio/align/run.py <tên>` in mỗi dòng: mốc mới, mốc đang ghi trên trang, kết quả ba biến thể, dấu ⚠ khi chưa nhận.
6. **Xem lại dòng ⚠.**
    - `run.py <tên> --plot` vẽ phổ kèm nốt đã căn (PNG trong bộ nhớ đệm, `plots/`).
    - `explore.py onsets <trang> <t0> <t1> Sol4:67 ... [--part N]` liệt kê khởi âm của từng cao độ.
    - Giây trong `fix`, `anchors` và `onsets` tính **trong phần** đó, không liền qua các phần như `ref`.
    - Tìm được thời điểm chắc chắn thì ghi vào `fix` kèm chú thích cách đo; không chắc thì để dòng đó `null`.
7. **Ghi.** `$PY tools/audio/align/run.py <tên> --write` ghi `ref` vào trang (cùng phép kiểm như `attach.py`). Rồi chạy `check_audio.py`, build và test.

Sửa `core.py` thì chạy `$PY tools/audio/align/evalset.py`: 14 mốc đã xác minh tay trên 6 bản thu, in sai số của từng bộ tham số. Không để sai số tăng.

### Trạng thái hiện tại (10/2026)

`pieces.py` có cấu hình cho cả 52 trang có bản thu. Chạy lại toàn bộ thì cả 52 cấu hình cho ra đúng từng mốc đang ghi trên trang. Bốn trang dùng bản thu chỉ dẫn link (mục 2c): K. 331 và *Những bức tranh* (file IMSLP, căn trên bản đã tải vào `_imslp/`), *Préludes* của Debussy và Invention số 1 (bản thu Marcelle Meyer trên Commons). Ở các tác phẩm có dàn nhạc chưa có bản nhạc số (concerto của Grieg, Rachmaninoff, Mozart K. 467; *Rhapsody in Blue*), chỉ dòng mở đầu mỗi chương có mốc. Nhiều mốc thêm ở v15 là số đo tay trên khởi âm hoặc trên phổ, vì căn tự động chọn sai hoặc không ổn định: cách đo ghi trong chú thích (có ghi "10/2026") cạnh `fix`, `anchors` hoặc số giây viết thẳng trong `pieces.py`.
