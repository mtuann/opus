# D8-gom: review phần tham chiếu (9 trang D8-L1)

Trang: `bat-dau/hoi-dap`, `bat-dau/ung-dung`, `lich-su/duong-dai`, `lich-su/viet-nam`, `nhan-dien/nghe-mu`, `piano/chon-dan`, `piano/nghe-si`, `piano/thay-va-thi`, `tai-nguyen` (không gồm `piano/tac-pham-theo-cap`).

Claude Opus 5.5, không làm lượt 1 hay lượt 2 của các trang này. Ba agent con (fork, cùng mô hình) chia trang:

- `hoi-dap`, `tai-nguyen`, `thay-va-thi`;
- `viet-nam`, `duong-dai`;
- `chon-dan`, `nghe-si`.

Người review làm `ung-dung`, `nghe-mu` và gom kết quả. `nguoi.review` đã điền ở cả chín hồ sơ. Chưa khóa gì.

## Câu về chính site

64 câu: 63 `review: dung`, 1 `sai` (đã sửa). Mỗi câu có "Review D8-gom: …" trong `ghi_chu`, ghi đã kiểm ở đâu.

| Trang | ve-site | Ghi chú |
|---|---|---|
| `hoi-dap` | 24 dung | gồm n47 mới (tách từ n5). Câu "ít nhất 9 bài đầu" (n31) viết lại theo `bat-dau/lo-trinh-nghe` (đã khóa); trang ấy dùng **sáu** bài nhạc lý: 1, 4 (tháng 1), 6, 7 (tháng 2), 12, 13 (tháng 3) |
| `ung-dung` | 7 dung | `src/ung-dung/ung-dung.mjs` (`CHO_DANG_KY`, `mangTruoc`, `tepLuuSan`, `MAY_NGOAI`), `public/manifest.webmanifest`, `sao-luu.js` |
| `duong-dai` | 1 dung | |
| `viet-nam` | 3 dung | gồm n33 đổi nhãn (xem Soát nhãn) |
| `nghe-mu` | 10 dung | `src/scripts/nghe-mu.js` (`BAN_THU`, `CHU_NM`), trang đã khóa `nhan-dien/index`, `luyen-nghe`, `so-sanh-thoi-ky` |
| `chon-dan` | 2 dung, 1 sai | n15 sai: trang Kết nối MIDI chỉ hướng dẫn cáp USB, nên bỏ "hoặc Bluetooth MIDI" |
| `nghe-si` | 4 dung | `src/scripts/nghe.js`, `bach-goldberg.md` |
| `thay-va-thi` | 7 dung | |
| `tai-nguyen` | 5 dung | |

**Câu trỏ tới trang chưa có:** đã kiểm ở `../opus-zero` và ghi trang đích. Lô chuyển các trang đích phải giữ điều các câu này nói.

- `nghe-nhac/index`: `nghe-mu` n12.
- `nghe-nhac/doc-ten-tac-pham`: `tai-nguyen` n23, `nghe-si`.
- `nghe-nhac/nghe-gi-tiep`: `hoi-dap` n37, n39 và `nghe-si`. Tiêu đề thật của trang này là "Nghe gì tiếp?".

## Soát nhãn

- `hoi-dap` n5: con số giờ tập không có nguồn ngoài. Tách thành ba câu:
  - n5 (quy-tac, BAPAM): tăng dần, xen giờ nghỉ;
  - n47 (ve-site): con số theo `thoi_luong` của `cap-do.yml`. Chữ cũ "20–45 phút" không khớp năm đầu;
  - n48 (khuyen-tap).
- `hoi-dap` n32: vế "ở Việt Nam dùng Đô Rê Mi" tách thành n49 (`ten`), viết theo câu đã khóa ở `nhac-ly/01`.
- `hoi-dap` n44: hành vi của iOS tách thành n50 (quy-tac, WebKit Bugzilla 237322). Chữ cũ "công tắc im lặng chặn cả âm thanh trang web" nói quá, vì `am-thanh.js` đặt `audioSession = "playback"`. Chữ mới: chế độ im lặng mặc định tắt tiếng do trang web phát, kể cả khuông nhạc.
- `hoi-dap` n45: bỏ `nguon` (câu ve-site).
- `viet-nam` n33: "tư liệu còn ít và phân tán" là nhận định cần nguồn. Viết lại thành câu về chính mục ("Mục này chỉ ghi vài điều có nguồn đọc được…"), đổi sang `ve-site`.
- `chon-dan` n8: "Nhiều người nâng cấp khi đến khoảng Grade 4–5" cần nguồn ngoài. Viết thành lời khuyên của site, đổi sang `khuyen-tap`. Mốc Grade 4–5 giữ, vì `piano/ban-dap` (đã khóa) dựa vào nó.
- `chon-dan` n27: có phần tư thế (ghế, bục kê chân), là điều về sức khỏe. Đổi `khuyen-tap` thành `quy-tac` (BAPAM).
- `nghe-si` n67 (khuyen-tap): bỏ vế "bản to hơn gần như luôn có vẻ hay hơn" (cần nguồn, trang khoa học chặn robot). Đáp án câu hỏi 3 (n77) sửa theo.

## Câu cần review và quyết định

Nguyên tắc: trang tham chiếu chỉ giữ câu có nguồn bậc 1–2 đọc được. Báo chính thức chỉ dùng khi không có nguồn tốt hơn, như mục "Nguồn và cách mở" cho phép với nhạc sĩ Việt Nam.

### `bat-dau/hoi-dap`

| Câu | Quyết định |
|---|---|
| n2 | da-sua: bỏ "nhiều người bắt đầu ở tuổi 40, 50, 60…" (không nguồn) |
| n5 | da-sua: tách như ở Soát nhãn |
| n17, n18, n19, n20 | Giữ. n20: giữ câu chung về Điều 27 Luật SHTT, không ghi con số (chưa đọc được văn bản sau sửa đổi 2022) |
| n33 | da-sua: "các nước như Pháp, Ý", theo nguồn bậc 2 ở hồ sơ `nhac-ly/01`. Bỏ Tây Ban Nha, Nga (chỉ có Wikipedia) |
| n34 | da-sua: theo OAKE. Đô di động phát triển trong dạy hợp xướng ở Anh; Kodály chủ trương dùng nó để dạy đọc nhạc. Bỏ "Mỹ" và "rất mạnh cho luyện tai" |
| n16 (khuyen-tap) | Bỏ vế "hai thứ hay mai một nhất" |

### `bat-dau/ung-dung`

| Câu | Quyết định |
|---|---|
| n2 | da-sua. Bước 2 ở iPhone viết theo đúng chữ của Apple, Hướng dẫn sử dụng iPhone (bản tiếng Việt, đã mở): "Chạm vào [nút Menu của trang], sau đó chạm vào Chia sẻ. Nếu bố cục tab là Dưới cùng hoặc Trên cùng, hãy chạm vào [nút Chia sẻ]". Bỏ "ở một số bản iOS", "cạnh thanh địa chỉ". Nhãn "Thêm vào Màn hình chính" khớp bản tiếng Việt |
| n10 | Giữ, dung. Review mở lại hai nguồn bậc 2: MDN ("the two apps will … not share any data") và WebKit Bugzilla 181849 ("Home Screen apps are created as isolated entities without shared state with the browser", 2022). Nguồn iOS đã cũ: xem lại khi rà (4/2027) |

### `nhan-dien/nghe-mu`

| Câu | Quyết định |
|---|---|
| n2 | Đồng ý chữ mới (bỏ "duy nhất"); lượt 2 dung |
| n27 (BWV 1042, bè trầm lặp) | dung. Netherlands Bach Society (All of Bach): "a free-flowing, melancholy solo melody above a repetitive bass motif" |
| n33 (K. 516, Allegro Sol trưởng) | dung. Thunder Bay Symphony (ghi chú chương trình, PDF): "a lengthy Adagio introduction … the sprightly G major Allegro". Music in the Round: phần mở đầu chậm bi thương rồi "major-key ebullience" |
| n39 (Debussy, Arabesque số 2) | Giữ, dung. IMSLP: soạn 1890–91, Piece Style: Romantic. Năm ấy nằm trong khoảng Ấn tượng của `so-sanh-thoi-ky` (đã khóa). "Nằm giữa" là cách site giải thích quy tắc chấm (nhận cả hai đáp án) |

### `lich-su/viet-nam`

| Câu | Quyết định |
|---|---|
| n4, n10, n11, n13, n14, n16, n18, n22, n23, n24, n26, n28, n29, n37, n40 | Giữ; hai lượt khớp. n22 thêm hồ sơ Hội Nhạc sĩ |
| n5 | da-sua: theo hcmcons.vn (trang chính thức): lập năm 1956, tiền thân là Trường Quốc gia Âm nhạc Sài Gòn. Bỏ ngày 12/4 (chỉ có Wikipedia) |
| n8 | da-bo vế "một trong những đơn vị … hàng đầu" (lời khen trong thư chúc mừng) |
| n19 | da-bo "World Travel Awards top 10" (10Best không phải giải WTA) |
| n27 | da-sua: bỏ "ban nhạc của các đài phát thanh" (chỉ có monhoc.vn) |
| n30 | da-sua: bỏ "một trong những nhạc sĩ hòa âm nổi tiếng nhất" |
| n31, n32 | da-bo cả đoạn Lê Văn Khoa, Phạm Thế Mỹ, Phan Miêng, Nguyễn Tiến Dũng, Đỗ Thế Phiệt. Nguồn duy nhất là một bài người dùng tải lên monhoc.vn, không rõ nơi đăng gốc |
| n34 | Giữ: hồ sơ Hội Nhạc sĩ Việt Nam xác nhận đủ. Bỏ nguồn ArtTimes |
| n35 | da-sua: theo hồ sơ Hội. Bỏ *Sắc xuân*, *Vầng trăng Him Lam* và danh sách nước (chỉ có ArtTimes) |
| n36 | da-sua: theo hồ sơ Hội (Đặng Hữu Phúc). Bỏ *Ngày hội*, *Pizzicato* |
| n38 | da-sua: theo Viet Nam News (TTXVN). Bỏ "đại diện cho hướng nhạc mới" và "nhà soạn nhạc Pháp" |

### `lich-su/duong-dai`

| Câu | Quyết định |
|---|---|
| n5, n9, n14, n15, n21, n22, n24, n25, n30 | Giữ; hai lượt khớp |
| n6, n8, n18 | Giữ, thêm nguồn bậc 2: Wise Music, Faber, Deutsche Grammophon, PWM, Oberlin |
| n20 | Giữ: bản lưu Wayback trang chủ Gramophone |
| n27 | dung: bản lưu Wayback trang chính thức cuộc thi Tchaikovsky. Kỳ XVII có Piano, Violin, Cello, Voice, Woodwinds, Brass |
| n16 | da-sua: lời đánh giá Gubaidulina viết theo Boosey & Hawkes |

### `piano/chon-dan`

| Câu | Quyết định |
|---|---|
| n1, n10, n26 | Giữ. Yamaha Hub (Weighted Keys) |
| n3, n28, n31 | dung |
| n5 | da-sua. Bỏ "kiểm soát tiếng và bàn đạp tốt nhất". Phần đánh lặp viết theo Yamaha: đàn đại khoảng 15 lần mỗi giây, đàn đứng khoảng 7 |
| n6 | da-sua. Bỏ "giá cao". Viết lại: đàn cơ có hệ thống tắt tiếng vẫn cần lên dây và giữ độ ẩm |
| n12 | da-sua. Bỏ "128 trở lên" (chỉ có nguồn cửa hàng); viết theo FAQ của Kawai. Loại đổi `so-lieu` sang `quy-tac` |
| n13 | da-sua. Bỏ "bàn đạp rời nhỏ hay trượt"; bộ ba bàn đạp ghi là lời khuyên của site |
| n16 | da-sua. Bỏ "ghế chữ X lung lay"; trỏ sang `piano/tu-the` |
| n21 | da-sua theo Piano Buyer và Yamaha. Bỏ "mối mọt" |
| n22 | da-sua theo Piano Buyer (*Pierce Piano Atlas*) |
| n27 | Đổi loại (xem Soát nhãn) |
| n29 | da-sua. Bỏ "vài tuần để quen phòng" |
| n30 | dung. Thêm PTG Servicing |
| n34 | Câu hỏi 2 viết lại cho khớp hàng polyphony: nốt được bàn đạp giữ ngân vẫn tính vào polyphony |

### `piano/nghe-si`

| Câu | Quyết định |
|---|---|
| n5 (Liszt chơi thuộc) | da-sua theo BBC Music Magazine ("performed only a fraction of his repertoire from memory"). Chữ mới: "chơi nhiều bài thuộc lòng (… dù không phải bài nào ông cũng chơi thuộc)" |
| n16 (Cortot) | Bỏ "không hoàn hảo về nốt" (chỉ có Wikipedia) |
| n39 (Schiff) | da-sua: "không dùng bàn đạp vang (theo bài viết của chính ông)" |
| n51 (Eric Lu) | dung: Polskie Radio |
| n31 (Ashkenazy) | dung: thêm thông báo của HarrisonParrott |
| n58 (Nghiêm Phú Phi) | dung: RFA ghi "trường Quốc gia Âm nhạc và Kịch nghệ" |
| n7, n34, n44, n45, n46, n49, n63, n65 | dung; hai lượt khớp |

Hộp "Dùng trang này thế nào" có thêm câu: các chữ tả tiếng đàn và phong cách ở cột "Nổi tiếng với" là nhận xét của site.

### `piano/thay-va-thi`

| Câu | Quyết định |
|---|---|
| n8, n16, n26, n28, n32, n50 | Giữ. n28: trang Trinity Vietnam có liên hệ ở Hà Nội và TP. HCM |
| n25 | da-sua: thêm điều kiện thay Grade 8 cho LRSM, FRSM, theo PDF đặc tả diploma 2024 của ABRSM |
| n30 | da-bo: trung tâm luyện thi ABRSM trong nước (không nguồn) |
| n31 | da-sua. Bỏ "ba … lớn" và "nhiều hệ bắt đầu từ nhỏ". Chỉ ghi hai trường có khoa Piano trên trang chính thức (vnam.edu.vn, hcmcons.vn) |
| n35 | da-sua theo Berklee: dùng tai nghe; nếu nghe qua loa thì bật Echo cancellation |
| n37 | dung: Trinity, "Dealing with latency" |
| n51 | dung: Open Library |

### `tai-nguyen`

| Câu | Quyết định |
|---|---|
| n3, n5, n15, n17, n26 | Giữ da-sua |
| n7 | dung: Henle (mức khó 1–9); Wiener Urtext, Bärenreiter theo trang nhà xuất bản trên IMSLP |
| n13 | dung: Coursera "Offered by Berklee" |
| n16 | dung: App Store của Complete Ear Trainer |
| n18 | da-sua theo leonardbernstein.com; bỏ "tìm trên YouTube hoặc DVD" |
| n20, n22, n25, n27, n29 | dung |
| n21 | da-sua. Podcast Record Review phát hai tuần một lần, nên bỏ "mỗi tuần" |
| n24 | da-sua. Bỏ so sánh "đầy đủ hơn" |
| n31 | da-sua theo lời giới thiệu của chính các kênh; kênh David Bennett nay tên "David Bennett Music Theory" |

## Chỗ sửa trang

Mọi chỗ đổi chữ đều ghi `doi_chu`. Đã build bản xem riêng (`OPUS_BAN=xem astro build --outDir …/scratchpad/dist-tham-chieu`, không có cảnh báo `[opus]`). Trên bản ấy, cả chín trang không thiếu và không thừa `doi_chu`, kiểm cùng phép so của `tests/chuyen.test.mjs`.

| Trang | Chỗ sửa chính |
|---|---|
| `bat-dau/hoi-dap` | 7 khối: sáu bài nhạc lý của lộ trình nghe; giờ tập theo `cap-do.yml`; Đô cố định, Đô di động; chế độ im lặng của iPhone; tuổi bắt đầu |
| `bat-dau/ung-dung` | Bước 2 ở iPhone |
| `lich-su/viet-nam` | Bỏ đoạn năm nhạc sĩ miền Nam (không nguồn); viết lại Nhạc viện TP.HCM, Đỗ Hồng Quân, Đặng Hữu Phúc, Nguyễn Mạnh Duy Linh; bỏ WTA; mục Nguồn thêm Hội Nhạc sĩ, Nhạc viện TP.HCM, bỏ monhoc.vn, ArtTimes |
| `lich-su/duong-dai` | Gubaidulina |
| `piano/chon-dan` | Polyphony, bàn đạp, ghế, đàn cũ, đàn đại, Bluetooth MIDI; câu hỏi 2 |
| `piano/nghe-si` | Liszt, Cortot, Schiff; bước so sánh âm lượng và câu hỏi 3; câu "nhận xét của site" |
| `piano/thay-va-thi` | Diploma, trường nhạc, chơi qua mạng, trung tâm luyện thi |
| `tai-nguyen` | Bernstein, Building a Library, Henle, kênh YouTube, Coursera, ToneGym, Complete Ear Trainer |

## Lượt 2 bổ sung (35 câu)

Kết quả lượt 2 cũ của các câu này đã gỡ khỏi hồ sơ và chép lại trong `ghi_chu` ("Chữ đổi sau lượt 2: lượt 2 bổ sung. Lượt 2 cũ…"). Xuất bằng `node tools/khoa.mjs xuat D8-L1 --con-lai`.

- `bat-dau/hoi-dap`: n2, n5, n33, n34; câu mới n49, n50
- `bat-dau/ung-dung`: n2
- `lich-su/duong-dai`: n16
- `lich-su/viet-nam`: n5, n27, n30, n35, n36, n38
- `piano/chon-dan`: n5, n6, n12, n13, n16, n21, n22, n27, n29, n34
- `piano/nghe-si`: n5, n16, n39, n77
- `piano/thay-va-thi`: n25, n31, n35
- `tai-nguyen`: n18, n21, n24, n31

## Điều chủ repo cần biết

- **`nghe-si`, `duong-dai`:** nhiều câu tiểu sử, và bảng nhà soạn nhạc (Pärt, Reich, Glass, Shaw), hai lượt chỉ có Wikipedia. Review chỉ thêm nguồn bậc 2 cho câu trong danh sách cần review. Trước khi khóa, cần quyết: rà thêm một lượt tìm nguồn, hay chấp nhận.
- **Câu chỉ có báo hay tạp chí:** `nghe-si` n5, n7, n34, n58 (BBC Music Magazine, The Violin Channel, RFA, Polskie Radio), và nhiều câu ở `viet-nam` (báo chính thức).
- **`viet-nam`:** mục "Miền Nam trước 1975" nay chỉ còn Nhà hát Lớn, Trường Quốc gia Âm nhạc và Nghiêm Phú Phi. Tìm được nơi đăng gốc của bài Nguyễn Thị Ngọc Dung (có tài liệu tham khảo của Viện Âm nhạc) thì có thể khôi phục đoạn đã bỏ. Tin Nhà hát Lớn trùng tu cần kiểm lại khi rà.
- **`hoi-dap` n7** (*Mariage d'Amour*, 1978): hai lượt chỉ có Wikipedia. Giữ vì cùng chi tiết nằm ở `tac-pham-theo-cap` (người khác review); trang ấy bỏ năm thì câu này nên bỏ theo.
- **`hoi-dap` n6** dựa vào việc Nocturne Mi thứ Op. 72 số 1 ở chặng 5, điều còn chờ chủ repo quyết (`d8-l1.md`, câu hỏi 1).
- **Lời giao nêu tuyến nghe "bài 1, 4, 12, 13"**, nhưng `lo-trinh-nghe` (đã khóa) dùng cả bài 6, 7. Trang `hoi-dap` ghi đủ sáu bài.
- **Khuông nhạc trên iPhone:** `abc.js` không đặt `audioSession`, nên khi máy ở chế độ im lặng, khuông nhạc không có tiếng, còn các công cụ (qua `am-thanh.js`) vẫn kêu. Trang `hoi-dap` nay nói đúng điều ấy. Muốn khuông cũng kêu thì là việc sửa thành phần (mức Vừa), ngoài lô này.
- **Hai trang không đọc được:** bộ lọc an toàn chặn hai lệnh, không vòng qua:
  - một lệnh tới thecanadianencyclopedia.ca với User-Agent trình duyệt;
  - một lệnh `curl -k` tới hocvienamnhachue.edu.vn (lỗi chứng chỉ). Trang Huế sau đó đọc được bằng công cụ đọc web.

## Kiểm thử

- `node tools/khoa.mjs tinh`: không lỗi.
- `node --test tests/chuyen.test.mjs tests/khoa.test.mjs tests/du-lieu.test.mjs tests/dong-thoi-gian.test.mjs tests/nghe-mu.test.mjs`: 56 đạt, 1 bỏ qua (cần bản build ở `dist/`).
- Bản xem riêng: so chữ và `doi_chu` của chín trang đạt (như trên). `tests/link.test.mjs` chưa chạy trên bản này: người gom chạy `npm test` sau `npm run build:xem`.
