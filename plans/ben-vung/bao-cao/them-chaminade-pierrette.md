# Báo cáo: thêm Chaminade, *Pierrette (Air de ballet)* Op. 41 (lượt 4 của lộ trình)

Nhánh `them/chaminade-pierrette`, 17/11/2026. Lượt 4 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, bài đầu của đợt 3 (nhà soạn nhạc nữ).

## Kết quả

- Trang `piano/tac-pham/chaminade-pierrette` (chặng 6, Grade 8 theo ABRSM), bản ghi, dòng `trang.yml`, hai hồ sơ.
- Năm in lần đầu (khảo sát G6 ghi "chưa kiểm được"): mục lục BnF ghi Enoch & Costallat, Paris, 1889, cotage E. F. & C. 1641. BnF còn có các bản soạn lại (bốn tay 1897, măng-đô-lin 1899, dàn nhạc 1900) và đĩa Delta 1963 có bản thu của chính Chaminade.
- Cấp độ: PDF đề cương ABRSM 2025 & 2026, Grade 8, danh sách C, số 6 (tập gợi ý *Piano Music by Female Composers*, Schott).
- Trích đoạn: ô 1–5 (bốn ô tay trái mở đầu và ô đầu của chủ đề), chép tay từ bản quét M. Bernard (IMSLP #07257). Ba bài tập soạn riêng.
- Bản thu: Luis Kolodin, CC BY-SA 4.0, chỉ dẫn link một file (163,89 s; file IMSLP đuôi .mp3 nhưng là m4a, ffprobe đọc được). 15 mốc theo khoảng lặng (hai ô im lặng ở 66,7 s và 123,0 s) và độ to; tốc độ bản thu ♩ ≈ 104, đúng số in.

## Chỗ chưa chắc

- Bản quét M. Bernard mờ, chữ in nhỏ; nốt ở nhiều ô khó đọc chắc. Trang chỉ nêu số ô ở ô 1–5 (đọc ở 400–600 dpi); các đoạn sau mô tả theo sự kiện (sắc thái, chữ chỉ dẫn, kiểu viết), sơ đồ chia theo thời gian trên bản thu, không theo số ô. Đếm thô được khoảng 125–127 ô; không ghi lên trang.
- Bản M. Bernard không ghi năm (IMSLP đoán khoảng 1885, sớm hơn năm in ở Paris); trang không nêu năm của bản này. Chưa so với bản Enoch 1889 (không có bản quét mở).

## Kiểm định

Lượt 1: 28 nhận định trang, 13 bản ghi, 4 khuông. Lượt 2 (agent riêng, 38 câu): 35 đúng, 3 sai, đã sửa: móc kép của bài phần nhiều có luyến, không phải phần lớn staccato; thiếu *sf* trong danh sách sắc thái; chuỗi đi xuống ở đoạn kết là móc ba. Review (agent thứ ba) sửa thêm bốn chỗ (mục Review dưới). Kiểm mẫu: Claude kiểm thay chủ repo, 5/5 đúng. Khóa 17/11/2026; `npm run build` bản thật, `npm test`, Chromium đạt. Gộp `main` ở máy, chưa push.

## Việc ngoài phạm vi

- `lich-su/nu-nha-soan-nhac` (đã khóa): thêm link sang bài học này, ở nhánh `mo/` sau đợt 3 (như lộ trình mục 4).

## Review (Claude, 17/11/2026)

Agent riêng, không làm lượt 1, lượt 2. Kiểm trên nguồn: n1, n2, n3 (PDF ABRSM tr. 44, C6), n5, n6, n7, n10–n12 (BnF qua API SRU), n14 (wikitext IMSLP, CC BY-SA 4.0), n15–n19, n23; khối abc 1 so từng nốt với bản quét ở 400–800 dpi; ba bài tập soạn; mốc khối nghe so với khoảng lặng và độ to của bản thu.

Đã sửa:

- Khối abc 1, ô 3: bỏ chấm staccato ở Mi♭2 (bản quét chỉ có chấm ở ô 1).
- Bảng Theo dõi khi nghe (dòng cuối) và dòng Đoạn kết của bảng Cấu trúc: trước hai hợp âm *fff* không phải "một ô im lặng" (tay trái có một móc đơn ở phách 1 và quãng tám *fff* ở móc đơn cuối; bản thu lặng 0,37 s), nay là "một khoảng lặng ngắn".
- Mục Sắc thái: "nhấn mạnh bất ngờ" thành "nhấn mạnh đột ngột", như `thuat-ngu.yml`.
- Câu hỏi m.g.: lời giải thích không còn nói mọi chỗ m.g. đều bắt chéo (tr. 6 hệ 1, tr. 7 hệ 4 tay trái chơi dưới tay phải).

Còn để ý: giữa khối *pp leggierissimo* và *ppp* 8va còn một khối *ff*–*mf* nữa (tr. 5 hệ 4); bảng Theo dõi khi nghe và Cấu trúc không nêu, không sai.
