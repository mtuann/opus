# Báo cáo: thêm Mozart, *Alla turca* (Sonata La trưởng K. 331, chương 3) (lượt 9 của lộ trình)

Nhánh `them/mozart-alla-turca`, 17/11/2026. Lượt 9 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, bài cuối của đợt 1. Tới lượt 1 kiểm định: chưa có lượt 2, review, kiểm mẫu; chưa khóa.

## Kết quả

- Trang `piano/tac-pham/mozart-alla-turca` (chặng 6, Grade 8), bản ghi `mozart-alla-turca` cuối `tac-pham.yml`, dòng `trang.yml`, hai hồ sơ (trang: 29 nhận định, 4 khuông; bản ghi: 12 nhận định).
- Cấp độ (đọc lại 17/11/2026): ABRSM Piano Practical Grades 2025–2026, Grade 8, danh sách A số 1, "with first, third and final repeat"; đề cương 2027–2028 không có (chỉ còn chương 1 K. 331). Henle HN 1300: mức 6 cho cả sonata, "ABRSM: Piano Grade 8".
- Trích đoạn: nhịp lấy đà và ô 1–8, chép tay từ bản quét bản in đầu Artaria (IMSLP #292670, số bản in 47), đo dòng kẻ bằng máy ở 400 dpi, nốt nhỏ ở 900 dpi; đối chiếu từng nốt với Mutopia (Mutopia-2015/08/13-108, phạm vi công cộng): cùng nốt, cùng trường độ khi chơi. Bản in viết nốt dựa bằng nốt nhỏ (Si trước La ở nhịp lấy đà, Rê trước Đô ở ô 1…), Mutopia viết thẳng thành móc kép; trang giữ cách viết của bản in và giải thích cách chơi. Ba bài tập soạn riêng (vòng quanh nốt chính, tiếng trống tay trái, quãng tám).
- Bản thu: Romuald Greiss (Commons, `{{PD-author}}`, 180,53 s), phát được trên site; `note` theo trang mô tả (thu năm 2000 trong buổi hòa nhạc ở Filharmonia Zabrze, đàn Budynowicz 1850). Chín mốc.
- Trang không lặp hướng dẫn nghe K. 331: bối cảnh "nhạc Thổ" chỉ một câu và link sang; phần mới là bản in đầu (Allegrino, nốt nhỏ), kỹ thuật và kế hoạch tập.

## Chọn lựa

- **Không có `cap`.** Lộ trình dặn `cap: nghe-nhac/mozart-k331`, nhưng kiểm chéo dữ liệu (`src/du-lieu.mjs`, dòng "cap … có bản ghi riêng … nên … phải có cap …") làm build hỏng khi chỉ một bản ghi trỏ `cap`; `tests/du-lieu.test.mjs` cũng có ca kiểm điều này. `mozart-k331` đã khóa, nên lượt này bỏ `cap`; trang link tay sang hướng dẫn nghe ở mở đầu, Bối cảnh và Học tiếp. Thêm `cap` ở cả hai bản ghi là việc của nhánh `mo/` (mục Việc ngoài phạm vi). Cần chủ repo chọn: (a) giữ như vậy, thêm `cap` hai chiều ở nhánh `mo/` sau khi gộp; hay (b) gộp nhánh này cùng lúc với việc mở khóa `mozart-k331`.
- Số ô theo cách đếm của Mutopia và kern (Alte Mozart-Ausgabe): ô kết 1 và kết 2 của hành khúc cuối là ô 96, 97; coda từ ô 98, hết ở ô 128. Trang ghi rõ cách đếm.
- Sơ đồ (`hinh`) theo thứ tự trong bản thu Greiss, có hai ô "chơi lại", vì người chơi chơi lại cả phần đầu.

## Mốc và bản thu

- Bản thu Greiss nghe **thấp gần nửa cung** (đo: chroma lệch một bậc, pyin, La khoảng 419 Hz), có lẽ vì đàn năm 1850. Trang có nói điều này.
- Nhạc từ 1,0 s tới khoảng 163,9 s, sau đó khoảng 13 s vỗ tay.
- Cấu trúc trong bản thu: (ô 1–8 hai lần, ô 9–24, hành khúc hai lần) chơi hai lượt, rồi Fa♯ thứ (ô 33–40 hai lần, ô 41–56), hành khúc hai lần, đoạn La thứ (ô 65–72 hai lần, ô 73–88), hành khúc hai lần, coda.
- `tools/audio/align` với kern `sonata11-3.krn` (đối chiếu Mutopia), cấu hình tạm ngoài repo (không thêm vào `pieces.py` vì ngoài phạm vi nhánh), không ổn định, kể cả khi hạ bản nhạc một nửa cung và neo nốt cuối. Mốc đo tay bằng tự tương quan chroma, khởi âm và độ to (chi tiết trong `ghi_chu` của hồ sơ trang). Mốc 149 (đoạn *p* giữa coda) ước theo số ô, có thể lệch một giây.
- Bản thu thay thế (Luis Kolodin, IMSLP #815841) không cần dùng.

## Chỗ chưa chắc

- Lời tựa Henle (năm viết, tên *Alla Turca* thêm lúc in, *Allegrino*) trích theo nguồn `henle-hn1300` của hồ sơ `nghe-nhac/mozart-k331`; lượt 1 không đọc lại PDF.
- Lượt 1 không đếm từng ô trên bản quét; số ô theo kern và Mutopia, nội dung từng đoạn đối chiếu bản quét.
- Một nét ngắn khó đọc ở tay trái ô 1–2 bản in (có thể là dấu luyến) không chép.
- Commons ghi 180,53 s, ffprobe file gốc 181,60 s (không ảnh hưởng mốc).

## Kiểm thử

- `node tools/khuong-nhac.mjs`: 386 khối, 0 lỗi. `npm run build:xem` đạt.
- `npm test`: 352 đạt, 2 bỏ qua, **1 hỏng**: `tests/tac-pham.test.mjs` "them-tac-pham: thêm bản ghi ở cuối…" chạy `them-tac-pham.mjs` với slug ví dụ `mozart-alla-turca` trên bản sao `src/data/`; nay bản ghi ấy đã có nên công cụ từ chối ("tac-pham.yml đã có bản ghi mozart-alla-turca"). Không phải lỗi của bài; sửa bằng cách đổi slug ví dụ trong kiểm thử (như `vi-du-them`), file ngoài phạm vi nhánh `them/`. Cần làm trước hay cùng lúc khi gộp.
- `OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet`: 430/430 đạt (trang mẫu; trang mới chưa commit nên chưa vào trang đã đổi); chạy thêm với `OPUS_CHI_TRANG_DOI=1 OPUS_TRANG=piano/tac-pham/mozart-alla-turca/`: 194 đạt, 3 bỏ qua, 0 hỏng.

## Chỗ vướng của quy trình

- Kiểm thử công cụ thêm tác phẩm dùng đúng slug của một bài trong lộ trình (như trên).
- `cap` hai chiều không làm được trong nhánh `them/` khi bản ghi kia đã khóa: lộ trình và `them-tac-pham.md` mục 2 đã ghi, nhưng không nói bản ghi mới bỏ `cap` trong lúc chờ.
- Bộ căn mốc không có cách khai báo bản thu lệch cao độ (đàn cổ, băng chạy chậm); phải sửa tạm trên máy.

## Việc ngoài phạm vi (không làm)

- Bản ghi `mozart-k331` (đã khóa) và bản ghi này: thêm `cap` hai chiều (nhánh `mo/`, mở khóa `du-lieu/tac-pham/mozart-k331` và khóa lại bản ghi này).
- Đoạn "Năm bài học…" ở `piano/tac-pham/index` (đã khóa).
- `tests/tac-pham.test.mjs`: đổi slug ví dụ.
- Sau đợt 1: `piano/tac-pham-theo-cap` (chưa có *Alla turca*), `piano/nha-soan-nhac` (đang ghi K. 331 "≈ Grade 7–8"), mục "Nếu bạn muốn chơi" của `nghe-nhac/mozart-k331` có thể link sang bài học này.
- Cấu hình căn mốc trong `tools/audio/align/pieces.py` (nếu muốn giữ lại cách đo).

## Lượt 2

`node tools/khoa.mjs xuat piano/tac-pham/mozart-alla-turca du-lieu/tac-pham/mozart-alla-turca`: 37 nhận định.
