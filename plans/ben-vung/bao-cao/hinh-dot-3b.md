# Đợt hình 3b: khối hình thức (minuet–trio, scherzo, concerto, overture, Moldau) và Erlkönig

Nhánh `mo/hinh-dot-3b` từ `main` (`bd1f51f`), Claude Opus 5.5, 06/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md`, đề xuất 18, 22, 23, 24, 25. Thủ tục hình rút gọn (`plans/ben-vung/chuan-kiem-dinh.md` mục 7): cả sáu hình chỉ vẽ lại chữ và bảng của trang.

Hai commit: mã (sáu hình tĩnh, CSS, kiểm thử, `trang-mau.mjs`, `AGENTS.md`); trang, hồ sơ và báo cáo này.

## Mã (review riêng, mức "Vừa")

Không có module mới, không đụng `src/plugins/thanh-phan.mjs` hay `src/scripts/`: sáu hình là hình tĩnh `src/components/hinh/<tên>.html` (`::hinh` tự dùng qua `hinhTinh`), dải ô `oz-form-map`, `oz-form-nhom` như `form-small.html`, `form-sonata.html`.

| File | Đổi |
|---|---|
| `src/components/hinh/form-minuet-trio.html` (mới) | Ba ô Minuet (A) – Trio (B) – Minuet da capo (A), dòng phụ chép bảng "Cấu trúc: ABA"; tách mới, không sửa `form-small.html` (trang 31 đang khóa dùng nó). |
| `src/components/hinh/form-scherzo.html` (mới) | Nhóm "Chương 3": Scherzo (Đô thứ), Trio (Đô trưởng, đối âm), Scherzo da capo (pizzicato, rất nhỏ), Đoạn chuyển (không ngắt); nhóm "Chương 4": vào ngay (attacca, Đô trưởng). |
| `src/components/hinh/form-concerto-co-dien.html` (mới) | Nhóm "Chương 1: nhanh": dàn nhạc trình bày, độc tấu trình bày, "…", cadenza, dàn nhạc vào lại để kết; "Chương 2" chậm; "Chương 3" nhanh, thường là rondo. Dàn nhạc xanh, độc tấu vàng như `form-ritornello` cùng trang. |
| `src/components/hinh/form-overture.html` (mới) | Hai nhóm ba ô: overture Pháp (Lully) chậm – nhanh – chậm, overture Ý nhanh – chậm – nhanh; ô nhanh cao hơn (`oz-seg-nhanh`), dải thẳng đáy (`oz-form-toc-do`). |
| `src/components/hinh/form-moldau.html` (mới) | Bảy ô theo bảy dòng bảng Moldau; hai ô có giai điệu *Moldau* (đoạn 2, 7) cùng màu xanh. |
| `src/components/hinh/erlkonig.html` (mới) | Bốn ô vai (chép bảng nhân vật), rồi một SVG (`oz-fig oz-fig-mid oz-erlkonig`, `role="img"`, `aria-label` kể đủ): dòng 4–7 của bảng "Theo dõi khi nghe" từ trái sang phải trên ba làn Vua tinh, Đứa con, Người cha; ba cột tiếng kêu cùng đáy, cao dần, nhãn "cao hơn", "cao nhất". Màu ô là màu nền sáng có sẵn của `oz-seg` (`MAU_GIU`), chữ `#1b1b1b` trên ô, chữ ngoài ô `currentColor`. |
| `src/styles/thanh-phan.css` | `.oz-form-map.oz-form-toc-do`, `.oz-seg.oz-seg-nhanh`, `svg.oz-erlkonig` (tối đa 30rem). Không biến màu mới. |
| `tests/hinh-khoi-hinh-thuc.test.mjs` (mới) | Đọc bảng, danh sách của trang và so với hình: tên, dòng phụ, thứ tự, màu từng ô; hình đứng ngay sau bảng hay dòng nó vẽ lại; concerto không có phát triển, tái hiện; Erlkönig: thứ tự bảy ô theo dòng 4–7, ba cột kêu cao dần cùng đáy, màu làn bằng màu ô vai. |
| `tests/trinh-duyet/kiem-hinh-khoi-hinh-thuc.mjs` (mới) | Ba trình duyệt × 360/768/1280 px: không tràn ngang; chữ không tràn khỏi ô; ô nhanh của overture cao hơn và cùng đáy; chữ SVG của Erlkönig không đè nhau, không ra ngoài hình, chữ trong ô nằm trọn trong ô, ba cột cao dần. Lần chạy đầu bắt hai lỗi thật trên Firefox ("cao nhất" sát mép phải bị cắt, "trấn an" tràn khỏi ô): nới khung SVG và ô, sửa trước khi commit. |
| `tools/trang-mau.mjs` | Hai loại khối: "khối tốc độ overture", "bốn vai Erlkönig". |
| `AGENTS.md` | Một mục ngắn "Đợt hình 3b" sau mục đợt hình 2c. |

Sách in: hình tĩnh giữ nguyên trong sách (`src/sach/sach.mjs` không bỏ `oz-figure`); màu ô `oz-seg` in được như các sơ đồ đoạn có sẵn.

## Trang

Sáu trang mở khóa (`node tools/khoa.mjs mo … --ly-do "thêm hình (đợt hình 3): …"`), chưa khóa lại. Lần mới trong `lan`: `ngay`, `luot_1` đã điền; còn trống `luot_2`, `review`, `kiem_mau` cho người soát. Trang chỉ thêm một dòng `::hinh` (chú thích hình có `data-sinh`), không có câu dẫn mới, nên không có `doi_chu`. Không đụng dữ liệu (`tac-pham.yml`).

| Trang | Hình | Đặt ở | Nhận định mới |
|---|---|---|---|
| `hinh-thuc/minuet-trio` | `form-minuet-trio` | ngay dưới bảng "Cấu trúc: ABA" | m28 |
| `hinh-thuc/scherzo` | `form-scherzo` | ngay dưới bảng Giao hưởng số 5 | s36 |
| `hinh-thuc/concerto` | `form-concerto-co-dien` | cuối danh sách "Concerto thời Cổ điển và Lãng mạn" | n36 |
| `hinh-thuc/overture` | `form-overture` | ngay dưới danh sách "Hai gốc Baroque" | n28 |
| `hinh-thuc/symphonic-poem` | `form-moldau` | ngay dưới bảng 7 đoạn Moldau | n35 |
| `nghe-nhac/schubert-erlkonig` | `erlkonig` | ngay dưới bảng "Theo dõi khi nghe" | n33 |

Bảng giữ nguyên ở cả sáu trang (bảng nhiều chữ hơn hình). Cả sáu câu đều `ve-site`.

Chỗ đã bỏ so với đề xuất để giữ "chỉ vẽ lại":

- 18: minuet–trio là khung chung theo bảng (trio không ghi giọng cụ thể); scherzo vẽ thẳng Giao hưởng số 5 theo bảng của trang, không lặp khung chung. Scherzo da capo không ghi giọng (bảng không ghi).
- 22: phần giữa chương 1 chỉ là "…": trang nói chương 1 "kết hợp hình thức sonata" nhưng không kể phát triển, tái hiện, coda, nên không vẽ.
- 23: lời giao ghi "overture Pháp (chậm – nhanh)", trang viết chậm – nhanh – chậm: hình theo trang. Không vẽ mũi tên sang "giao hưởng ba chương" (chỉ chú thích chép câu trang); không vẽ hình tiết tấu chấm dôi, chỉ ghi chữ "tiết tấu chấm". Chiều cao ô chỉ phân biệt nhanh, chậm.
- 24: ô rộng bằng nhau, không vẽ sông rộng dần (bảng chỉ nói "sông lớn dần" ở đoạn 2).
- 25: chỉ vẽ dòng 4–7 của bảng; không có làn người kể theo thời gian và làn piano. Vẽ cả bài thì phải nói ai hát ở dòng 8 ("Người cha phi nhanh hơn"), bảng không ghi. Bốn vai đứng ở dải ô phía trên (chép bảng nhân vật).

Không có câu nào cần thủ tục đủ.

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `npm test` 318 đạt, 2 bỏ qua, 0 hỏng.
- `npm run build` (bản thật, sáu trang đang mở không có): `npm test` 318 đạt, 2 bỏ qua, 0 hỏng.
- `OPUS_TRANG="hinh-thuc/minuet-trio/,hinh-thuc/scherzo/,hinh-thuc/concerto/,hinh-thuc/overture/,hinh-thuc/symphonic-poem/,nghe-nhac/schubert-erlkonig/" npm run test:trinh-duyet`: 890 phép, 888 đạt, 1 bỏ qua, 1 hỏng: "firefox: thu âm qua micro (giả)" của `kiem-luyen-tap-d7.mjs`, không liên quan (trang Luyện tập, không đụng tới); chạy lại riêng file ấy trên Firefox hai lần, đạt cả hai (7/7). `kiem-hinh-khoi-hinh-thuc.mjs` 9/9, axe, hiển thị 360/768/1280, sách in đạt.
- `node tools/khoa.mjs tinh`: mọi mục đã khóa khớp.
- Cuối cùng build lại bản xem.
- Không chạy Lighthouse: không có mã mới (lời giao chung đợt 3), chỉ hình tĩnh HTML/SVG nhỏ.

## Ảnh chụp

Không commit, ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh3b-anh/` (độ phân giải gấp đôi): mỗi hình `<tên>-360-toi.png`, `<tên>-360.png`, `<tên>-1280.png` với tên `minuet-trio`, `scherzo`, `concerto`, `overture`, `moldau`, `erlkonig`. Log: `…/scratchpad/hinh3b-trinh-duyet.log`, `…/scratchpad/hinh3b-test.log`.

## Việc cho người gom

- Review mã (mức "Vừa", commit mã riêng).
- Người soát (không phải người vẽ): đối chiếu sáu hình với chữ trang trên bản xem, ghi `review` cho m28, s36, n36, n28, n35, n33; `nguoi.review` và `nguoi.kiem_mau` cùng tên ("review và kiểm mẫu gộp, thủ tục hình"); `nguoi.luot_2`: "không cần (câu ve-site, thủ tục hình)".
- Xem ảnh chụp, rồi `node tools/khoa.mjs khoa` sáu trang.
- Gộp với hai nhánh song song: `src/styles/thanh-phan.css` (khối mới ngay sau `svg.oz-fig-wide`), `tools/trang-mau.mjs` (`KHOI`, sau "thẻ mẫu galant"), `AGENTS.md` (mục mới ngay sau "Đợt hình 2c") có thể xung đột vị trí; nội dung độc lập.

## Soát

Claude Opus 5.5 (người soát, không phải người vẽ), 07/11/2026; thủ tục hình rút gọn, review và kiểm mẫu gộp.

- Review mã (mức "Vừa"): đạt. Sáu hình tĩnh dùng lớp `oz-seg` có sẵn (nền sáng, chữ tối ở cả hai chế độ, in được); chữ ngoài ô của SVG Erlkönig là `currentColor`; mọi chữ là chữ thật; SVG có `role="img"` và `aria-label` kể đúng bảy ô. CSS chỉ thêm ba luật, không màu mới. Sách in giữ hình (`dist/sach/huong-dan-nghe.html` có `oz-erlkonig`). Kiểm thử Node đọc bảng của trang và so với hình; kiểm thử trình duyệt đo tràn ở 360/768/1280 px. Không sửa mã.
- Soát nội dung trên `dist/` (`npm run build:xem`): thứ tự, nhãn, phần nhắc lại (minuet), tốc độ (overture), bảy đoạn Moldau, bốn vai và ba tiếng kêu Erlkönig khớp chữ, bảng của trang. Sửa ba chú thích hình:
  - `erlkonig`: "Vua tinh dỗ dành ba lần" trái dòng 7 của bảng (lần 3: đe dọa, dùng sức mạnh), nay "Vua tinh đến ba lần (lần 1 dỗ dành, lần 3 đe dọa)".
  - `form-moldau`: "hai ô xanh" thành "hai ô xanh dương" (ô đoạn 4 màu xanh lá).
  - `form-concerto-co-dien`: "Chương 1 có" thành "Chương 1 thường có" (như trang), "(xanh)" thành "(xanh dương)" (ô chương 2 xanh lá).
- m28, s36, n36, n28, n35, n33: `review: dung` (ba câu sau khi sửa chú thích), `ghi_chu` thêm "Soát hình 3B (gộp review và kiểm mẫu): …". Lần cuối của sáu hồ sơ: `luot_2` "không cần (câu ve-site, thủ tục hình)", `review` và `kiem_mau` "Claude Opus 5.5 (soát hình 3B, review và kiểm mẫu gộp, thủ tục hình, 07/11/2026)".
- `node tools/khoa.mjs tinh`: khớp. `npm test` (bản xem): 318 đạt, 2 bỏ qua, 0 hỏng.
- Còn lại cho người gom: xem ảnh chụp (chú thích ba hình đã đổi chữ, chụp lại nếu cần), khóa sáu trang.
