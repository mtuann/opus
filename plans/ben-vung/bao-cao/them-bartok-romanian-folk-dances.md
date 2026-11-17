# Báo cáo: thêm Bartók, *Romanian Folk Dances* Sz. 56 (lượt 3 của lộ trình)

Nhánh `them/bartok-romanian-folk-dances`, 17/11/2026. Lượt 3 của `plans/ben-vung/lo-trinh-them-tac-pham.md`.

## Kiểm ấn bản trước khi viết

Lộ trình yêu cầu chứng minh bản quét IMSLP #918136 là bản in trước 1934 (bản sửa 1934 có thể còn bảo hộ ở Mỹ). Bản quét đạt cả ba dấu hiệu: không có "(1915)" sau ô cuối (tr. 10), "Copyright 1918 by Universal-Edition" (tr. 2, chân tr. 3), điệu 4 tên *Tanz der Butschumer*; không thấy ghi thời lượng. Nên không cần chuyển sang Granados.

## Kết quả

- Trang `piano/tac-pham/bartok-romanian-folk-dances` (chặng 5, Grade 6 ước lượng cho cả bộ), bản ghi, dòng `trang.yml`, hai hồ sơ.
- Trích đoạn: điệu 2 ô 1–4, đối chiếu bản Mutopia (PD, theo UE 1918) và bản quét. Ba bài tập soạn riêng (nốt trầm – hợp âm, quãng hai tăng, đổi nhịp).
- Bảng tên ba thứ tiếng, nghĩa và nơi tìm thấy của sáu điệu, chép từ bản in.
- Bản thu: Chris Breemer, CC0 1.0, chỉ dẫn link một file 5:22; 6 mốc đầu điệu đo bằng khoảng lặng (điệu 5 và 6 nối liền, cách nhau khoảng lặng 0,6 s).

## Nguồn

Bản quét UE 1918 (tải tay); Mutopia-2017/01/11-2162 (điệu 2); Henle HN 1402 (năm 1915, bản dàn nhạc, mức khó 3, 2, 3, 3, 4, 4); ABRSM 2015 & 2016 Grade 4 (điệu 3); Trinity từ 2023 Grade 5 (điệu 4, ô 1–18); IMSLP (giấy phép bản thu).

## Chỗ vướng của quy trình

1. **`tools/khuong-nhac.mjs` không theo nhịp đổi**: chỉ dùng dòng `M:` cuối cùng của khối, nên khối có `[M:3/4]` trong dòng hay nhiều dòng `M:` bị báo sai độ dài ô. Bài tập đổi nhịp (khối 4) khai `M:none` và ghi nhịp trong dòng (công cụ bỏ qua phép đếm, abcjs vẫn vẽ số nhịp); đã đếm tay. Nên sửa công cụ đọc `[M:…]` trong dòng (nhánh `mo/`), rồi bỏ `M:none` ở khối này.
2. Không đếm số ô từng điệu trên trang (bản quét nhiều hàng, nhiều đổi nhịp): trang chỉ nói điều đọc chắc.

## Việc ngoài phạm vi

- `piano/tac-pham-theo-cap` đã xếp *Romanian Folk Dances* ở chặng 5: có thể thêm link tới bài học (nhánh `mo/` sau đợt 2).
