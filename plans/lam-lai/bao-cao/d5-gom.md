# D5, nhánh gom: lượt 2, review, khóa (đang làm)

Nhánh `moi/d5-gom` từ `main` (`1c5d92f`), Claude Opus 5.5 (phiên Cowork), 29/10/2026.

## Lượt 2

Danh sách xuất từ hồ sơ hiện tại (`node tools/khoa.mjs xuat D5-L1 D5-L2 D5-L3 --ra …`): 1.032 nhận định của 27 trang, chia 7 phần (`d5-gom/trang-1..7.yml`). Mỗi phần một agent Claude Sonnet 5.5, độc lập với lượt 1, theo `loi-giao/luot-2-trang.md`.

| Phần | Trang | Số | dung | sai | khong-chac | Đã nhập |
|---|---|---|---|---|---|---|
| trang-1 | nhà soạn nhạc, dòng thời gian | 155 | 138 | 0 | 17 | có |
| trang-2 | opera, mục lục Lịch sử, Trung cổ, Phục hưng | 156 | 144 | 0 | 12 | có |
| trang-3 | Baroque, Cổ điển, Lãng mạn, Thế kỷ 20 | 149 | 140 | 0 | 9 | có |
| trang-4 | biến tấu, sonata, fugue, minuet và trio | 135 | 117 | 0 | 18 | có |
| trang-5 | concerto, overture, rondo, scherzo, symphonic poem, mục lục Hình thức | 166 | 159 | 1 | 6 | có |
| trang-6 | so sánh các thời kỳ, dấu vân tay, luyện nghe | 159 | 56 | 0 | 103 | có |
| trang-7 | dàn nhạc, thể loại, tài liệu tham khảo, mục lục Nhận diện | 112 | 103 | 0 | 9 | có |

Chỗ lượt 2 nêu cần review: Beethoven mất thính lực "khoảng 1798" (nguồn: 1796); Vivaldi "hơn 500 concerto" (nguồn lệch); Sibelius "30 năm cuối đời"; Carmen bị chê "vô luân và thô tục"; Người tạc tượng "sáng tác từ 1968", bối cảnh và ngày công diễn; tên cuộc thi và ca sĩ ở mục Opera ở Việt Nam; "Opera ra đời (L'Orfeo, 1607)" ở mục lục (opera ra đời khoảng 1600 với Peri).

Tổng: 857 dung, 1 sai, 174 khong-chac. Câu `sai`: symphonic-poem n16, bảng Moldau đoạn tiên nữ: sáo và clarinet (không phải oboe). Phần trang-6 nhiều `khong-chac` (103): lượt 2 không đọc được mã ABC của mười ví dụ (câu không kèm mã) và nhiều trang Britannica, OMT không mở được; review tự kiểm.

Khác: Trumpet "E3 đến C6" lẫn âm thực và âm viết; timpani D2–C4 không nguồn nào ghi; Für Elise đoạn C "không rời giọng chính" (hòa âm lướt qua Rê thứ, Si♭); K. 545 chủ đề 2 vào ô 14 hay 13; Liszt 12 hay 13 symphonic poem.

Danh sách cho review: `d5-gom/can-review.txt` (373 mục).

## Review

Bốn agent review (Claude Opus 5.5), không làm lượt 1 hay lượt 2 của các trang: nhóm A (nhà soạn nhạc, dòng thời gian, mục lục Lịch sử, opera, Trung cổ, Phục hưng), B (Baroque, Cổ điển, Lãng mạn, Thế kỷ 20, dàn nhạc, thể loại, tài liệu tham khảo, mục lục Nhận diện), C (mười trang hình thức), D (so sánh thời kỳ, dấu vân tay, luyện nghe và chữ trong công cụ). Mọi mục ở `can-review.txt` (373) đã xử lý; không còn `ket_qua: null`.

Quyết định chung:

- Pärt, Reich, Glass, Adams theo dữ liệu đã khóa (`thoi_ky: Đương đại`): mục lục Lịch sử, trang Thế kỷ 20 ghi rõ họ sinh ở thế kỷ 20 nhưng site xếp vào Đương đại; Dấu vân tay thêm mục "Đương đại".
- K. 265: giữ "biến tấu 11 Adagio, 12 Allegro" theo ấn bản C. F. Peters (bản scan IMSLP) và Mutopia (Porro); cân nhắc khôi phục ở trang đã khóa `piano/hoa-am/ung-tac` khi có dịp mở khóa.
- Hình `ranges-voices` dựng lại: bảy giọng như bảng (thêm countertenor), "Contralto (alto)", tên nốt kiểu Đô4, âm vực theo COD (bass theo OnMusic). Hình `ranges-orchestra` theo VSL Academy (âm thực): violin tới La7, viola tới La6, sáo Đô4–Rê7, bassoon tới Mi♭5, trumpet Đô Fa♯3–Đô6, timpani Đô2–Đô4; bỏ guitar.
- Sửa đáng kể khác: Beethoven mất thính lực từ khoảng 1796; Vivaldi "khoảng 500 concerto"; Elgar, Puccini theo Britannica; "Opera ra đời ở Ý quanh năm 1600 (Peri)", L'Orfeo là vở sớm nhất còn được diễn; chủ nghĩa tối giản "từ thập niên 1960"; Người tạc tượng viết xong 1970, công diễn 1971; Moldau đoạn tiên nữ: sáo và clarinet (không phải oboe); Für Elise đoạn C: nốt La lặp ở bè trầm, hòa âm qua Rê thứ rồi rời La; K. 545 chương 1: 73 ô; Baroque khôi phục "nhịp đều đặn (motor rhythm)" theo Clark; ví dụ romantic-1 và trang Lãng mạn: "Fa trưởng chuyển sang Fa thứ" thay "hợp âm mượn" (đoạn quy về La thứ); modern-1 "mỗi lần chỉ đổi một nốt" thay "quá trình cộng dồn".
- Trang đã khóa `piano/lich-su-dan`: dòng 149 ghi "(1655–1731)" là nguyên văn tiêu đề bài của Met, không phải năm site nêu (dòng 20 ghi 1655–1732): không cần sửa.

Chữ đổi sau lượt 2 và câu đổi nhãn: 43 câu ở `bo-sung.yml` cho lượt 2 bổ sung.

## Lượt 2 bổ sung

43 câu (`d5-gom/bo-sung.yml`, kết quả `d5-gom/ket-qua-bo-sung.yml`, đã `nhap`): 25 dung, 1 sai, 17 khong-chac.

- Sai (e2, `lich-su/nha-soan-nhac`): Beethoven từ khoảng 1818 vẫn trả lời bằng lời khi khách viết câu hỏi vào sổ đàm thoại (Baker). Người gom sửa trang theo câu đúng của lượt 2.
- 17 khong-chac: lượt 2 không mở được nguồn hoặc nguồn không nói thẳng. Người gom giữ chữ (review đã mở nguồn) và ghi chú "Người gom (D5-gom)" vào từng câu; đưa vào kiểm mẫu nếu rơi vào mẫu.

## Kiểm mẫu và khóa

10 nhận định mẫu (`d5-gom/kiem-mau.yml`), kết quả của chủ repo ở `d5-gom/kiem-mau-ket-qua.yml`: 7 đúng (2 có điều kiện), 0 sai, 3 câu về site chủ repo không kiểm độc lập được vì máy kiểm không có repo (người gom kiểm lại: khớp).

- `hinh-thuc/index` n10: "đối thoại" chỉ là ví von; đổi chữ theo nguồn ("tương phản và hòa với cả dàn nhạc", ritornello là đoạn tutti trở lại).
- `lich-su/nha-soan-nhac` st1: bỏ hai mốc không có trong nguồn đã mở khỏi ghi chú.
- `lich-su/thoi-ky/trung-co`: link COD Notre Dame school trả 404, bỏ khỏi nguồn n11, n21, n22 (Britannica đủ).
- `hinh-thuc/concerto` n8: trang Listen người gom mở lại được, ghi trích dẫn vào hồ sơ.

Đã điền `nguoi.luot_2` và `nguoi.kiem_mau` cho 27 hồ sơ, `khoa` 27 trang, `khoa tinh` khớp, bản build thật 117 trang, `npm test` 187 pass.
