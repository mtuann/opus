# Thêm tác phẩm: Bach, Prelude và fugue Sol thứ BWV 861

Nhánh `them/bach-prelude-fugue-sol-thu`, 24/11/2026. Lượt 10 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, ứng viên b1 của `plans/ben-vung/khao-sat-dot-4.md` (chủ repo duyệt 24/11/2026).

## Kết quả (lượt 1)

- Trang `piano/tac-pham/bach-prelude-fugue-sol-thu` (chặng 7, grade "Sau Grade 8"), bản ghi `bach-prelude-fugue-sol-thu`, dòng `trang.yml`, hai hồ sơ. Chặng 7 có bài Baroque đầu tiên.
- Cấp độ: ABRSM ARSM (danh sách tháng 6/2024); Henle HN 14: prelude mức 5, fugue mức 6, nhãn "ABRSM: Piano ARSM".
- Bản nhạc: bản quét Bach-Gesellschaft Band 14 (IMSLP #173661): prelude ở trang PDF 57, fugue ở trang 58–59. Đối chiếu với Mutopia (prelude id 806, fugue id 805, đều theo Bach-Gesellschaft 1866, phạm vi công cộng). Bản kern `wtc1p16`, `wtc1f16` chỉ dùng trên máy: một script đọc kern tìm mọi lần vào của chủ đề và đối đề.
- Ba trích đoạn: prelude ô 1–2, fugue ô 1–4 (chủ đề, đáp đề, đối đề), fugue ô 28–29 (stretto ba bè). Hai bài tập soạn riêng có số ngón (láy rền viết ra từng nốt; một bè chia cho hai tay), thêm một danh sách tập theo bè.
- Cấu trúc fugue đọc từ bản số và bản in: phần trình bày theo thứ tự alto, soprano, bass, tenor; 16 dòng lần vào; stretto hai bè ở ô 17 (bass, rồi alto nửa ô sau), stretto ba bè ở ô 28–29 (soprano, tenor, bass, mỗi bè cách nửa ô); đối đề đi cùng mọi lần vào trừ ô 1, 23, 28–29 và 33 (khớp Earsense).
- Bản thu: Kimiko Ishizaka, CC0, Commons, phát được, hai phần (Prelude 134,23 s; Fugue 113,49 s). 13 mốc: căn bằng `tools/audio/align` với MIDI Mutopia, cấu hình tạm ngoài repo, không sửa `pieces.py`; rồi kiểm từng mốc bằng `explore.py onsets`. Sửa hai mốc theo khởi âm: ô 17 thành 184, ô 28 thành 217. Bỏ một biến thể căn sai ở ô 33. Cách đo ghi ở `ghi_chu` của hồ sơ trang.
- Hồ sơ lượt 1: trang có 46 nhận định (một câu `da-sua`: "bốn móc đơn" thành "ba móc đơn") và 5 khuông; bản ghi có 14 nhận định. Xuất cho lượt 2: 53 nhận định.

## Chỗ chưa chắc

- Kern ô 28 soprano phách 3 ghi Fa♮4; bản in Bach-Gesellschaft và Mutopia ghi Fa♯4. Trang theo bản in.
- Lần vào alto ô 23 có đầu chủ đề đổi nhịp và đuôi đổi. Trang tính nó là một lần vào; có tài liệu phân tích có thể không tính.
- Ô 13 bass, trang gọi là "dạng đáp đề, Fa trưởng": suy từ các nốt (Si♭ Rê Fa Mi♮ Fa), không có nguồn phân tích riêng.
- Câu về các nghệ sĩ thu âm (Gould, Richter, Schiff, Hewitt, Leonhardt) dùng lại nguồn MusicBrainz của hồ sơ đã khóa BWV 847; lượt 1 không mở lại.
- Mốc 217 (ô 28): khởi âm Rê5 lẫn với Rê4 cùng lúc; ước ở khoảng 83,25 s trong phần, giữa 217 và 218.

## Chỗ vướng quy trình

1. `them-tac-pham.mjs --grade "ARSM"` bị từ chối vì không hợp chặng 7; phải dùng "Sau Grade 8". Tên bằng ARSM nằm ở dòng Độ khó.
2. `scratchpad/pylib/yaml` rỗng (chỉ còn `__pycache__`), nên `.venv-audio` không import được PyYAML. Đã dùng một thư mục riêng có symlink tới PyYAML của miniconda.
3. Bộ căn cho kết quả lệch ở một số dòng (biến thể "khởi âm" ở dòng 2, 3, 13; dòng 10, 12 lệch khoảng 0,4 s). Cần kiểm bằng `onsets` như đã làm.

## Việc ngoài phạm vi (nhánh `mo/` sau đợt)

- `piano/tac-pham-theo-cap`: thêm BWV 861 vào chặng 7.
- `piano/tac-pham/bach-prelude-fugue-do-thu` (đã khóa): mục Học tiếp đang gợi ý "các fugue ba bè khác… BWV 846 có bốn bè"; có thể thêm link sang bài này.
- `hinh-thuc/fugue` (đã khóa): có thể link sang bài này làm ví dụ stretto.
