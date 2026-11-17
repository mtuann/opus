# Báo cáo: thêm Gretchaninov, *Grandfather's Album* Op. 119 số 1 và 7 (lượt 2 của lộ trình)

Nhánh `them/gretchaninov-op119`, 17/11/2026. Lượt 2 của `plans/ben-vung/lo-trinh-them-tac-pham.md`.

## Kết quả

- Tác giả mới `gretchaninov` (Alexander Gretchaninov, 1864–1956; IMSLP, LoC) kèm hồ sơ; không ghi `thoi_ky` (IMSLP xếp ông vào thời kỳ Lãng mạn, các tập piano cho trẻ em viết ở thế kỷ 20).
- Trang `piano/tac-pham/gretchaninov-op119` (chặng 3, Grade 3 ước lượng), bản ghi `gretchaninov-op119`, dòng `trang.yml`, ba hồ sơ.
- Trích đoạn: giai điệu số 1 ô 1–4, chép tay từ bản quét Schott [khoảng 1929] (IMSLP #269926). Ba bài tập soạn riêng.
- Bản thu: Jörg Römgens, CC BY-SA 4.0, chỉ dẫn link hai phần (#517116, #517122); 10 mốc theo đoạn (người chơi chơi đủ dấu nhắc lại), đo bằng khoảng lặng và khởi âm.
- Kiểm định: lượt 1 (37 nhận định trang, 15 bản ghi, 2 tác giả, 4 khuông), lượt 2 bởi agent khác (48 câu: 48 đúng), review bởi agent thứ ba. Review bắt một lỗi của lượt 1: dòng sơ đồ "f, rall." không có nháy nên dấu phẩy tách phần tử, build hỏng (lượt 1 đã commit mà chưa build lại); đã sửa. Theo gợi ý review: nốt hoa mỹ viết có gạch chéo (acciaccatura) như bản in, chip ghi "khoảng năm 1929", "ngón cái (ngón 1)", link tới mục Appoggiatura và acciaccatura.
- Kiểm mẫu: Claude kiểm thay chủ repo, 5/5 đúng. Khóa tác giả, bản ghi, trang 17/11/2026; `npm run build` bản thật, `npm test` 353 đạt, Chromium 435 đạt. Gộp `main` ở máy, chưa push.

## Chọn bài

Lộ trình gợi ý số 1, 4, 7, "chốt sau khi xem bản nhạc". Chọn **số 1 và số 7** (hai kỹ năng tương phản: giai điệu trên hợp âm ở Fa trưởng; hai bè trong một tay ở Mi thứ). Số 4 để dành: tay phải nhiều nốt kép, hóa âm (Si♯, kết trên Đô♯ trong hóa biểu bốn dấu thăng) khó khẳng định chắc từ bản quét. Bằng chứng cấp độ yếu: đề cương RCM 2022 xếp số 2, 4, 15, 16 của tập ở Level 4; số 1, 7 không có trong RCM 2022, ABRSM 2015–2016, Trinity từ 2023; nên Grade 3 ghi "ước lượng".

## Nguồn đã dùng

| Nguồn | Dùng cho |
|---|---|
| Bản quét Schott (IMSLP #269926, tải tay) | Nốt, cấu trúc, sắc thái, tựa bốn thứ tiếng |
| IMSLP (API): trang tác phẩm, Category:Grechaninov | 17 bài, Schott ca.1929 (số bản in 32355), năm sinh–mất, giấy phép bản thu (bản MCPP là NC: không dùng) |
| LoC n79145180 | Năm sinh–mất |
| RCM Piano Syllabus 2022 | Level 4 (số 2, 4, 15, 16); Op. 98, Op. 123 ở các cấp thấp hơn |
| Trinity, Musical terms | Dolce, Moderato, rall., a tempo, dim. |

## Chỗ chưa chắc

- `thoi_ky: Thế kỷ 20` của bản ghi theo năm viết (1929) và theo cách trang `piano/tac-pham-theo-cap` đã xếp Op. 98, Op. 123; IMSLP xếp phong cách Op. 119 là "Romantic". Lượt 2 chấp nhận.
- Không có tài liệu lịch sử bậc 2 về hoàn cảnh viết Op. 119; mục Bối cảnh chỉ nói điều đọc được trên bản in và IMSLP.
- Số 7 không có trích đoạn (hai bè ô 1 đọc chưa chắc); phần đệm tay trái số 1 không chép.

## Chỗ vướng của quy trình

1. Ba chỗ vướng của lượt 1 (menu, kiểm thử phạm vi, thứ tự trang chặng) đã sửa trước lượt này: không gặp lại.
2. `them-tac-pham.mjs` vẫn chép `--ten` (có Markdown) vào `title`, và vẫn sinh `giong`, `nhip` cho bài học nhiều bài: sửa tay như lượt 1.
3. Thêm tác giả mới: không có công cụ, chép tay một bản ghi vào cuối `nha-soan-nhac.yml` và hồ sơ theo mẫu (như `kabalevsky`). Không vướng kiểm thử.

## Việc ngoài phạm vi (nhánh `mo/` sau đợt 2)

- `piano/tac-pham-theo-cap`: Op. 98 đang ở bảng chặng 2; lộ trình ghi thay bằng Op. 119, nay là bài học ở chặng 3: thêm dòng chặng 3 có link, cân nhắc giữ Op. 98.
- Có thể thêm số 4 (RCM Level 4) vào trang khi có bản số hay đọc chắc phần nốt kép.
