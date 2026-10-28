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

## Review

Bốn agent review (Claude Opus 5.5), không làm lượt 1 hay lượt 2 của các trang: nhóm A (bài 9–20), nhóm B (bài 21–32), nhóm C (âm học, ôn tập, mục lục, Từ điển, luyện tai), thuật ngữ. Mọi mục ở `can-review.txt` đã xử lý; không còn câu `ket_qua: null`; 190 câu `ve-site` có `review: dung` và nơi đã kiểm; soát nhãn đổi loại vài câu. Chữ đổi sau lượt 2 (54 câu) qua **lượt 2 bổ sung** (`bo-sung.yml`, `ket-qua-bo-sung.yml`): 49 dung, 2 sai, 3 khong-chac; người gom giải quyết 5 câu ấy (bài 9 n30 viết lại; bài 20 n6, bài 31 n28, luyện tai `nghe-tien-trinh` n14 giữ kèm lý do; `grave` bỏ ghi chú vì nguồn mâu thuẫn).

Chỗ sửa chính của review: bảng viết tắt nhạc cụ bài 20 chỉ giữ viết tắt có ở Dolmetsch; chú thích hình keymap (Sol trưởng và Fa trưởng ở hai bên Đô trưởng); láy trên là *upper mordent*; vòng Canon tám hợp âm (OMT 1e); Romanesca hai dạng (Gjerdingen) thống nhất giữa bài 29 và trang luyện tai; "hạ át" thay "tiền át" ở bài 24, 27 theo quyết định thuật ngữ; ba đoạn (OMT: đoạn có thể đóng hay mở) ở bài 31 và hình `form-small`; bỏ hay viết lại các câu cảm giác nghe ở trang luyện tai; bỏ số BPM của sáu thuật ngữ tốc độ (Dolmetsch: các nguồn lệch nhau nhiều); bỏ câu "nhịp phức" (không có nguồn bậc 1–2). Câu đàn bầu (bài Âm học) chỉ dựa vào báo Nhân Dân (báo chính thức, dùng khi không có nguồn tốt hơn).

## Kiểm mẫu

Chủ repo kiểm 10 nhận định ngẫu nhiên (`kiem-mau.yml`, kết quả `kiem-mau-ket-qua.yml`): 6 đúng, 4 câu về site và lời khuyên tập không kiểm độc lập được trên máy của chủ repo, 0 sai. Người gom kiểm lại 4 câu ấy trên repo (khối abc ghi ngón, tọa độ hình đối âm, `ve.js`): đúng. Theo góp ý: "Cách nhanh nhất" thành "Một cách dễ nhớ" (mục lục Luyện tai); link Dolmetsch của *maestoso* sửa thành trang từ điển M; ghi chú số dòng của `ve.js` sửa.

## Khóa

- 37 trang (bài nhạc lý 9–32, âm học, ôn tập 1–3, Từ điển, mục lục Nhạc lý, 7 trang luyện tai).
- 154 bản ghi `thuat-ngu.yml`, cả bản ghi (24 bản ghi khóa từng phần ở D3-L1 nay khóa cả bản ghi, thêm `nghia`, `nhom`).
- `npm run build` (bản thật): 62 trang; `npm test` đạt; `node tools/khoa.mjs tinh` khớp. Kiểm thử trình duyệt và Lighthouse chạy ở CI khi push.
