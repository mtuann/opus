# Báo cáo: sửa công cụ sau đợt 1 thêm tác phẩm (`mo/cong-cu-sau-dot-1`)

Claude, 17/11/2026. Nhánh từ `main` (f41bd45), worktree riêng. Gom các chỗ vướng của quy trình ghi ở báo cáo các lượt thêm tác phẩm (`them-debussy-arabesque-1`, `them-rachmaninoff-prelude-do-thang-thu`, `them-mozart-alla-turca`, `them-chaminade-automne`, `them-gretchaninov-op119`, `them-bartok-for-children`). Không đụng chữ trang hay dữ liệu đã khóa.

## Đã làm

1. **Căn mốc (`tools/audio/align/`).**
   - `sources.json`: thêm `mutopia_debussy_Arabesque_1.mid` (sha256 trùng bản vá của báo cáo Debussy) và `mutopia_rach-prelude-op3-no2.mid` (Mutopia-2015/07/09-2033, CC BY-SA 4.0), thêm bằng `fetch.py --add`; hai dòng ở bảng Mutopia của `NGUON.md`. *Alla turca* dùng `kern_sonata11-3.krn` đã có.
   - `pieces.py`: ba cấu hình. `run.py` (không `--write`) cho đúng mốc đang có trên trang, cả ba không còn dòng `≠`:
     - `debussy-arabesque-1`: như bản vá của báo cáo Debussy (`fix` 5, 10, 12).
     - `rachmaninoff-prelude-do-thang-thu`: MIDI Mutopia bỏ qua nhịp lấy đà nên ô b ở chỉ số b − 1,5 (chỗ đổi tốc độ tính riêng, ghi ở chú thích); `tuning="auto"` (−0,38); neo ô 15 và ô 46; `fix` 1, 2, 3, 5, 7 theo số đo ở hồ sơ trang (n24). Đoạn *Lento* và coda vẫn căn không ổn định.
     - `mozart-alla-turca`: `segs` theo cách bản thu Greiss chơi (đoạn La thứ và hành khúc hai lần trước đoạn Fa♯ thứ, theo chroma của lượt 2); `tuning=-0.85` (đàn 1850 thấp khoảng 0,85 nửa cung: `estimate_tuning` chỉ thấy phần lẻ +0,15); neo 104,0, 140,33, 163,9 s (sau 163,9 s là tiếng vỗ tay); `fix` 1, 2, 4, 6, 8 theo hồ sơ trang. Không chỉnh cao độ thì cả bài căn hỏng; chỉnh rồi thì dòng 4 (Fa♯ thứ), 6, 8 tự ra đúng.
   - Lệch cao độ: `core.Params.tune` (nửa cung) dời các ô CQT của bản thu trước khi dựng đặc trưng; `core.estimate_tune` dùng `librosa.estimate_tuning` (có bộ nhớ đệm). Job có `tuning` (`"auto"` hay số); `run.py --tuning auto|off|<số>` thay cho mọi job. Mặc định 0: khóa bộ nhớ đệm và đặc trưng như cũ.
   - Kiểm không đổi kết quả bài cũ: chạy lại `fur-elise`, `mozart-k545`, `burgmuller-arabesque`, `chopin-valse-si-thu`, `grieg-arietta`, `tchaikovsky-bai-ca-phap-co`, `beethoven-op49-2`: mốc trùng trang (0 dòng `≠`), cả khi `--tuning auto` (các bản thu ấy lệch dưới 0,1 nửa cung). `evalset.py` dùng tham số mặc định, không đổi.
2. **`tools/them-tac-pham.mjs`.** `title` của trang khung bỏ định dạng Markdown của `--ten` (`boDinhDang`: `*…*`, `**…**`, `[chữ](link)`, `` `…` ``; dấu `*` đứng riêng giữ nguyên); `ten` của bản ghi giữ Markdown. Bài học nhận `--giong`, `--nhip` (điền sẵn hai trường và chip đầu) hay `--nhieu-bai` (không sinh `giong`, `nhip`; chip đầu là chỗ điền số danh mục, các bài). Lời nhắc sau khi tạo nói thêm có thể bỏ `giong`, `nhip`. Kiểm thử (`tests/tac-pham.test.mjs`) dùng slug giả `vi-du-kiem-thu-*` (bỏ `debussy-arabesque-nghe`, theo báo cáo *Alla turca*).
3. **`tools/khuong-nhac.mjs`.** Độ dài ô theo nhịp của từng ô: trường trong dòng `[M:…]`, `[L:…]` (đứng đầu ô thì áp cho cả ô ấy), dòng `M:`, `L:` giữa phần thân; ô có `M:none` không kiểm. Sửa kèm: vạch nhịp không còn nuốt `[` của trường đứng ngay sau nó; dòng `V:` trong phần thân đổi bè như `[V:…]` (trước đây các bè viết bằng dòng `V:` bị gộp làm một). Nhận một file `.md` thay cho thư mục (báo cáo Debussy). 400 khối của site vẫn 0 lỗi; khối đổi nhịp của `bartok-romanian-folk-dances` nay được kiểm thật.
4. **`tools/khoa.mjs`.** Loại `vi-du-soan` (câu tả bài tập soạn riêng) như `khuyen-tap`: `nhap` không đòi `nguon` ở lượt 2; `khoa` không đòi `nguon` và nhận `khong-can-nguon`. Hai loại này cũng không bắt buộc nguồn khi `da-sua` (chỗ vướng 9 của báo cáo Bartók); có ghi nguồn thì vẫn phải có trong `nguon`. Vẫn qua lượt 2 như cũ. Ghi ở `chuan-kiem-dinh.md` (bảng loại nhận định, giá trị `ket_qua`) và mục Khóa của `AGENTS.md`.
5. `AGENTS.md` (Lệnh, Khóa), `plans/ben-vung/them-tac-pham.md` mục 2, `tools/audio/README.md` (bước 6 của Căn mốc): cách dùng mới.

## Kiểm thử

- `npm run build`: đạt (252 trang). `npm test`: 354 đạt, 3 bỏ qua (cần `.cache/site-cu/`, hai kiểm thử phạm vi của nhánh lô, nhánh `them/`), 0 hỏng. `python3 -m unittest discover -s tools/audio/tests`: 25 đạt (PyYAML từ thư mục tạm).
- Kiểm thử mới: `tests/khuong-nhac.test.mjs` (nhịp đổi giữa khối, `[L:]`, `M:none` giữa khối, kết 1–2, dòng `V:`, một file); `tests/khoa.test.mjs` (`nhap` với `vi-du-soan` không nguồn; `loiHoSo`: `vi-du-soan` không nguồn, `khong-can-nguon`, `da-sua`, vẫn cần lượt 2; `khuyen-tap` `da-sua` không nguồn; loại khác vẫn đòi nguồn); `tests/tac-pham.test.mjs` (`--giong`/`--nhip`, `--nhieu-bai`, title bỏ Markdown, lỗi khi trộn cờ, `boDinhDang`).
- Không chạy kiểm thử trình duyệt: không đổi trang, thành phần hay CSS.

## Review

Nhánh chạm công cụ khóa (`tools/khoa.mjs`): mức **lớn** (Sonnet hay Opus review, có vòng kiểm lại) trước khi gộp. Chưa review, chưa gộp, chưa push.

## Chỗ vướng của quy trình

- Môi trường `../opus-zero/.venv-audio` vẫn không có PyYAML và `-I` bỏ `PYTHONPATH`: chạy `align/` bằng một script bọc thêm thư mục PyYAML tạm vào `sys.path` (không sửa môi trường của site cũ).
- `estimate_tuning` chỉ trả phần lẻ trong [−0,5; 0,5): bản thu lệch gần một nửa cung trở lên (*Alla turca*) phải ghi số trong cấu hình; `auto` cho ra sai hướng (+0,15).

## Chưa làm (ngoài phạm vi giao)

- Các chỗ vướng khác của báo cáo Bartók: menu, thứ tự trang chặng đã sửa ở nhánh khác; công cụ khung còn sinh nhận định `them_ngay` (chỗ vướng 9, phần đầu); trường `doan` của sơ đồ chưa nhận Markdown; `trangDaDoi` chỉ tính thay đổi đã commit.
- `cap` hai chiều `mozart-k331` ↔ `mozart-alla-turca` và các trang đã khóa cần thêm link (`piano/tac-pham-theo-cap`, `piano/nha-soan-nhac`…): việc nội dung, nhánh khác.
