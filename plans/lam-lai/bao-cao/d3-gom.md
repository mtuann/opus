# D3, nhánh gom: lượt 2, review, khóa (đang làm)

Nhánh `moi/d3-gom` từ `main` (`635abd0`), Claude Opus 5.5 (phiên Cowork), 28/10/2026.

## Lượt 2

Danh sách xuất từ hồ sơ hiện tại (`node tools/khoa.mjs xuat D3-L2 … D3-L6 --ra …`; thuật ngữ: mọi hồ sơ `du-lieu/thuat-ngu/*`, `--con-lai`): 1.123 nhận định trang và 224 nhận định thuật ngữ, chia 11 phần (`d3-gom/trang-1..9.yml`, `thuat-ngu-1..2.yml`). Mỗi phần một agent Claude Sonnet 5.5, độc lập với lượt 1, theo `loi-giao/luot-2-trang.md` và `luot-2-du-lieu.md`.

| Phần | Số | dung | sai | khong-chac | Đã nhập |
|---|---|---|---|---|---|
| trang-1 (bài 9–11) | 120 | 116 | 0 | 4 | có |
| trang-2 (bài 12–15) | 147 | 136 | 0 | 11 | có |
| trang-3 (bài 16–19) | 147 | 135 | 1 | 11 | có |
| trang-4 (bài 20–23) | 125 | 107 | 1 | 17 | có |
| trang-5 (bài 24–27) | 121 | 118 | 1 | 2 | có |
| trang-6 (bài 28–31) | 137 | 116 | 0 | 21 | có |
| trang-7 (bài 32, âm học, ôn tập, mục lục) | 140 | 110 | 0 | 30 | có |
| trang-8 (luyện tai) | 144 | 127 | 1 | 16 | có |
| trang-9 (luyện tai) | 42 | 31 | 0 | 11 | có |
| thuat-ngu-2 | 75 | 72 | 0 | 3 | có |
| thuat-ngu-1 | 149 | | | | **chưa**: 60 câu `dung` không có nguồn đã mở (WebSearch hết lượt giữa chừng); `nhap` từ chối. Làm lại phần này (`ket-qua-thuat-ngu-1-chua-dat.yml` chỉ để tham khảo) |

Bốn câu `sai`: bài 19 n30 (aria-label hình keymap: Sol trưởng và Fa trưởng không cạnh nhau trên vòng quãng năm, mà ở hai bên Đô trưởng); bài 23 n20 (Ngũ tấu D. 956, chương 2: đối lập Mi trưởng với Fa thứ, không phải trưởng–thứ cùng chủ âm; câu này lượt 1 đã bỏ khỏi trang); bài 27 n22 (vòng Canon: hợp âm thứ tư là iii); luyện tai `nghe-gam` n28 (ngũ cung "không có nửa cung" chỉ đúng với dạng anhemitonic).

Ghi chú về chất lượng lượt 2: WebSearch có hạn mức mỗi lượt làm việc và đã hết ở các phần sau; nhiều câu `khong-chac` là do không mở được nguồn (chương OMT, bản nhạc IMSLP), không phải vì câu sai. Danh sách xuất có cả câu `da-bo` (chữ đã bỏ khỏi trang): kết quả lượt 2 của chúng không cần xử lý.

## Còn lại

1. Làm lại lượt 2 phần `thuat-ngu-1` (149 câu) khi có lại hạn mức tìm kiếm; nhập.
2. Review (`can-review.txt`, 321 mục): chỗ hai lượt khác nhau, chỗ lượt 1 sửa hay bỏ, 47 câu lượt 1 chưa quyết (`ket_qua: null`), mọi câu `ve-site` (ghi `review`), soát nhãn; sửa trang và hình theo kết luận; câu `khong-chac` vì thiếu nguồn: tìm thêm nguồn hay viết lại cho kiểm được.
3. Chủ repo kiểm mẫu khoảng 10 nhận định (`node tools/khoa.mjs xuat D3-L2 D3-L3 D3-L4 D3-L5 D3-L6 --mau 10`).
4. Khóa 37 trang và 154 bản ghi thuật ngữ (đủ các trường trang Từ điển hiện: `thuat_ngu`, `nghia`, `ghi_chu`, `nhom`); gộp vào `main`.
