# Đợt hình 2b: cung và nửa cung, hợp âm, dịch giọng, khuông kép nối phím

Nhánh `mo/hinh-dot-2b` từ `main` (`d578eb5`), Claude Opus 5.5, 06/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md`, đề xuất 13, 9, 29, 27, 2; thủ tục rút gọn cho hình chỉ vẽ lại (`plans/ben-vung/chuan-kiem-dinh.md` mục 7).

Hai commit: mã (khuông kép nối phím), rồi trang, hồ sơ và báo cáo này.

## Mã (review riêng, mức "Vừa")

Phần lớn hình dùng lại bàn phím có `nhan`, `ngoac`, `phai`, `trai` của đợt 1; không đổi `ve.js` hay `docThongSoBanPhim`. Mã mới chỉ cho hình 2. Hình 27 (dịch giọng) đủ bằng một bàn phím có ngoặc xếp tầng, không cần hai dải phím.

| File | Đổi |
|---|---|
| `src/scripts/ve-khuong-phim.js` (mới) | `veKhuongKepPhim`, `hinhKhuongKepPhim`: khuông khóa Sol và khóa Fa (nét dọc nối ở đầu), dòng đánh số 1–5 từ dưới lên, dòng 2 khóa Sol và dòng 4 khóa Fa tô màu nhựa thông; ba nốt mốc Fa3, Đô4 (vẽ ở cả hai khuông, trên dòng kẻ phụ), Sol4 đặt thẳng trên tâm phím của nó (`tamPhim`), nét đứt nối xuống đỉnh phím; bàn phím Mi3–La4 lấy từ `veBanPhim` (phím mốc tô, nhãn "Fa3 / dòng 4 / khóa Fa", "Đô4 / Đô giữa", "Sol4 / dòng 2 / khóa Sol"), bỏ thẻ `<svg>` ngoài và dời xuống dưới khuông. Khóa và đầu nốt dùng ký hiệu chung `#oz-kh-…` (như `veNotDon`). Một `role="img"` với `aria-label` đủ ý; chữ trong hình `aria-hidden`; `figcaption` chữ thật; `data-sinh`. |
| `src/plugins/thanh-phan.mjs` | Một dòng import và một mục `'khuong-kep-phim'` trong `HINH`. |
| `src/styles/thanh-phan.css` | Khối `.oz-kp`: rộng tối đa 36rem, dòng mốc và nét nối `--oz-accent`, số dòng `--sl-color-gray-3`, nhãn 7 px (đơn vị viewBox) để ở 360 px chữ còn khoảng 8 px. Phím và nhãn dùng lớp sẵn có của bàn phím (sáng, tối, in). |
| `tools/trang-mau.mjs` | Loại khối "khuông kép nối phím" (`class="oz-figure oz-khuong-phim`). |
| `tests/khuong-phim.test.mjs` (mới) | Nốt đúng dòng (Sol4 dòng 2, Fa3 dòng 4, Đô4 một khe ngoài mỗi khuông), dòng mốc đúng, chỉ Đô4 có dòng kẻ phụ, tâm nốt bằng tâm phím, ba phím tô và có nhãn, số dòng 1–5 hai lần, một vai trò, `::hinh` dựng đúng figure. |
| `tests/trinh-duyet/kiem-khuong-phim.mjs` (mới) | Ba trình duyệt × 360/768/1280 px: không tràn; tâm đầu nốt lệch tâm phím dưới 1 px; nốt không đè khóa; nét nối chạm đỉnh phím (đo hình học bằng `getBBox`, vì Firefox tính cả nét vẽ vào khung); số dòng và nhãn không đè nhau, không đè phím, không ra ngoài hình; nhãn từ 7 px; có chú thích. |
| `AGENTS.md` | Một mục cho `::hinh{ten="khuong-kep-phim"}` cạnh `keysigs`, `circle`. |

Kiểm thử trình duyệt lần đầu bắt hai lỗi thật, đã sửa: nét nối dừng cách đỉnh phím 1 đơn vị (phím bắt đầu ở y 1 của bàn phím); trên Firefox số dòng ở mép phải ra ngoài hình (lề phải nới từ 10 lên 12, số lùi vào).

## Trang

Mười một trang mở khóa (`node tools/khoa.mjs mo … --ly-do "thêm hình (đợt hình 2): …"`), chưa khóa lại. Lần 2 trong `lan` có `luot_1`; `luot_2`, `review`, `kiem_mau` còn trống cho người soát. Mỗi câu dẫn mới có trong `doi_chu`; chữ trong hình có `data-sinh`.

| Trang | Hình | Nhận định mới (`ve-site`) |
|---|---|---|
| `nhac-ly/05-dau-hoa` | Đô4–Đô5: ngoặc ½ Đô–Đô♯, ½ Đô♯–Rê, 1 Đô–Rê (tầng trên), ½ Mi–Fa, ½ Si–Đô; tô Mi, Fa, Si, Đô. Bàn phím cũ C4–B4 giữ nguyên. | n35 |
| `nhac-ly/06-gam-truong` | Gam Đô trưởng (mới, dưới bảng) với ngoặc 1 1 ½ 1 1 1 ½; bàn phím Sol trưởng đã có thêm ngoặc. | n34, n35 |
| `nhac-ly/07-gam-thu` | La thứ tự nhiên (bàn phím đã có, thêm ngoặc); hòa âm (mới: nhãn "bậc 7", ngoặc Fa–Sol♯ 1½); giai điệu đi lên (mới: nhãn "bậc 6", "bậc 7"). | n41, n42, n43 |
| `nhac-ly/10-hop-am-ba` | Bốn bàn phím (trưởng, thứ, giảm, tăng), mỗi cái hai ngoặc quãng 3 như cột "Cấu tạo" và ngoặc quãng 5 (đúng, đúng, giảm, tăng) theo đoạn ngay trên; nút "Nghe hợp âm". | n36, n37 |
| `nhac-ly/11-hop-am-bay` | Ba thể của Đô trưởng: nhãn nốt gốc, nốt ba, nốt năm; ngoặc quãng 6 (đảo 1), quãng 4 và quãng 6 (đảo 2) tính từ nốt trầm. | n36, n37 |
| `piano/hop-am-rai` | Ba thể với số ngón hai tay của bảng trên cùng ba phím, ngoặc quãng 3 / quãng 4 như cột "Khoảng, từ dưới lên". | n73, n74 |
| `nhac-ly/32-ky-thuat-the-ky-20` | Gam toàn cung (ngoặc toàn 1), gam bát cung (½, 1 xen kẽ, đúng các nốt của khuông: Đô Rê♭ Mi♭ Mi Fa♯ Sol La Si♭ Đô). | n54, n55 |
| `nhac-ly/17-khoa-do-dich-giong` | Một bàn phím Rê3–Đô4: "viết Đô" ở Đô4, bốn ngoặc xếp tầng tới Si♭3, La3, Fa3, Mi♭3 (bốn dòng đầu của bảng, tên nhạc cụ và quãng). | n45 |
| `nhac-cu/clarinet` | Sol3–Đô4: ngoặc "clarinet Si♭: một cung", "clarinet La: 3 thứ". | n34 |
| `nhac-cu/trumpet` | Sol3–Đô4: ngoặc "trumpet Si♭: một cung". | n43 |
| `nhac-ly/02-khuong-nhac-khoa` | `::hinh{ten="khuong-kep-phim"}` sau tip "Trên phím đàn" của mục "Khuông kép". | n40, n41 |

Sách in: bàn phím có ngoặc, nhãn, số ngón vào sách như đợt 1 (`nhac-ly-co-ban` 15 hình, `nhac-ly-nang-cao` 3, `piano-ky-thuat` 21); khuông kép nối phím vào `nhac-ly-co-ban` cùng định nghĩa ký hiệu. `clarinet`, `trumpet` không thuộc cuốn nào.

### Chỗ người soát nên xem (giới hạn "chỉ vẽ lại")

- `07-gam-thu` n43: ba ngoặc Mi–Fa♯ 1, Fa♯–Sol♯ 1, Sol♯–La ½ của gam giai điệu không có trong chữ trang; hình đếm phím theo định nghĩa của bài 5. n42: Sol♯–La ½ cũng đếm phím (chữ trang chỉ nói nâng bậc 7 nửa cung). Tôi xếp `ve-site`; nếu người soát thấy là điều mới thì đưa hai câu qua lượt 2 (OMT Minor Scales đã là nguồn của hồ sơ).
- `17`, `clarinet`, `trumpet`: trang nói "viết Đô"; hình chọn Đô4 (câu dẫn ghi rõ), phím vang đếm theo bảng nửa cung bài 9.
- `10-hop-am-ba`: lời giao gợi ý nhãn "4 + 3 nửa cung"; trang này không ghi số nửa cung, nên ngoặc ghi tên quãng như bảng ("3 trưởng", "3 thứ", "5 đúng"…). Thêm số nửa cung thì là chữ mới (có ở bài 9, không ở bài 10).
- `11-hop-am-bay` n37: ngoặc "quãng 6" ở đảo 1 suy từ câu "các con số ghi các quãng tính từ nốt trầm"; đảo 2 có câu hỏi cuối trang nói thẳng "6 và 4".
- `hop-am-rai`: hai tay vẽ trên cùng ba phím của cột ví dụ (khuông chơi tay trái thấp hơn hai quãng tám); "quãng 4 nổi bật" chỉ bằng chữ của ngoặc, không có màu riêng (bàn phím chưa có thông số đó).

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `npm test` 308 đạt, 2 bỏ qua, 0 hỏng.
- `npm run build` (bản thật, mười một trang mở khóa không có): `npm test` 308 đạt, 2 bỏ qua.
- `OPUS_TRANG="<11 trang>" npm run test:trinh-duyet` (ba trình duyệt): 856 phép thử, 855 đạt, 1 bỏ qua, 0 hỏng (cả `kiem-khuong-phim.mjs` 9/9, `kiem-ban-phim-chu.mjs` 9/9, axe, hiển thị 360/768/1280). Log: `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/h2b-trinh-duyet.log`.
- Lighthouse: `LH_TRANG="nhac-ly/02-khuong-nhac-khoa/,nhac-ly/10-hop-am-ba/"`, 3 lần: hiệu năng 100 cả hai (02: 99/100/100), trợ năng, thực hành tốt, SEO 100; TBT 0 ms, CLS 0,001, khoảng 305 KiB.
- Cuối cùng build lại bản xem.

## Ảnh chụp

Không commit, ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh2b-anh/`: 22 hình, mỗi hình 360 px (tối) và 1280 px (sáng), độ phân giải gấp đôi; tên `<nhóm>_<trang>_<thứ tự>-<cỡ>.png`. Tiêu biểu: `nhac-ly_02-khuong-nhac-khoa_0-1280.png`, `nhac-ly_07-gam-thu_1-1280.png` (hòa âm, 1½), `nhac-ly_17-khoa-do-dich-giong_0-360.png`, `piano_hop-am-rai_1-360.png`.

## Việc cho người gom

- Review mã (mức "Vừa", commit mã riêng): `ve-khuong-phim.js`, đăng ký trong `HINH`, CSS, hai kiểm thử.
- Người soát (không phải tôi): review và kiểm mẫu gộp cho 19 câu `ve-site` mới của 11 trang, đối chiếu SVG trong `dist/` với chữ trang; quyết định hai câu ở 07 (mục trên).
- Xem ảnh, rồi khóa lại 11 trang. Nhánh này sửa `src/plugins/thanh-phan.mjs` (một import, một mục `HINH`), `thanh-phan.css`, `tools/trang-mau.mjs` (`KHOI`), `AGENTS.md`: có thể xung đột nhỏ với hai nhánh song song khi gộp.

## Soát

Claude Opus 5.5, 07/11/2026, không phải người vẽ; review mã và soát hình gộp review với kiểm mẫu (thủ tục hình, `plans/ben-vung/chuan-kiem-dinh.md` mục 7).

**Review mã (mức "Vừa"): đạt, không sửa.** `ve-khuong-phim.js` là module thuần dựng lúc build, dùng lại `veBanPhim`, `tamPhim` và ký hiệu chung `#oz-kh-…` (trang và sách in có định nghĩa: `nhac-ly-co-ban.html` có `oz-kh-khoa-sol`). Màu theo biến site: dòng mốc và nét nối `--oz-accent` (sáng, tối), số dòng `--sl-color-gray-3`, phím và nhãn dùng lớp của bàn phím (đã có bản in); CSS `.oz-kp` vào `dist/_astro/` đúng (không dính lỗi `border-image` của bộ nén). Một `role="img"` với `aria-label` nói đủ ý, chữ trong hình `aria-hidden`, `figcaption` chữ thật, `data-sinh`. Đăng ký trong `HINH` gọn (một import, một dòng). Kiểm thử Node kiểm điều quan trọng (dòng của từng nốt mốc đọc từ SVG, dòng tô, dòng kẻ phụ chỉ ở Đô4, tâm nốt bằng tâm phím, ba phím tô, nhãn, một vai trò, `::hinh` dựng đúng); kiểm thử trình duyệt chờ `load` và `document.fonts.ready`, không chờ cố định, đo tràn ngang, nốt lệch phím, nét nối chạm phím, chữ đè. Ghi nhận nhỏ, không sửa: số dòng 6,5 đơn vị viewBox, ở 360 px còn khoảng 7 px (kiểm thử chỉ đòi 7 px cho nhãn phím); đọc được trong ảnh 360 px.

**Soát hình: 19/19 câu `dung`, 0 `sai`, không sửa hình, câu hay `doi_chu`.** Bản xem (`npm run build:xem`, không cảnh báo `[opus]`): đọc `aria-label` của 22 hình trong `dist/` (liệt kê từng phím tô, nhãn, số ngón, ngoặc) và đối chiếu với chữ, bảng, khuông abc của từng mục; xem thêm ảnh 360/1280 px của người vẽ (02, 05, 10, 17, hop-am-rai).

- 05: ngoặc ½ Đô–Đô♯, ½ Đô♯–Rê, 1 Đô–Rê (tầng trên), ½ Mi–Fa, ½ Si–Đô khớp định nghĩa ngay trên. 06: 1 1 ½ 1 1 1 ½ ở Đô trưởng và Sol trưởng khớp bảng, công thức, đoạn Fa♯. 07: tự nhiên khớp bảng; hòa âm 1½ ở Fa–Sol♯ khớp "3 nửa cung"; giai điệu bậc 6, 7 khớp bảng "So sánh ba dạng". n42, n43 có lượt 2 OMT (dung), nên ngoặc ½, 1, 1 đếm phím không phải điều mới.
- 10: bốn hợp âm đúng nốt của cột "Ví dụ" và khuông; ngoặc quãng 3 khớp cột "Cấu tạo"; ngoặc quãng 5 đúng, đúng, giảm, tăng khớp đoạn sau khuông. 11: ba thể đúng quãng tám của khuông `[CEG] [EGc] [Gce]`, nhãn gốc/ba/năm đúng vai trò; quãng 6 (đảo 1), quãng 4 và 6 (đảo 2) tính từ nốt trầm khớp cột "Ký hiệu số", câu bè trầm số và đáp án "6 và 4".
- hop-am-rai: số ngón hai tay từng phím khớp bảng (phải 1-3-5, 1-2-5, 1-3-5; trái 5-3-1, 5-3-1, 5-2-1, từ dưới lên); ngoặc quãng 3/4 khớp cột "Khoảng, từ dưới lên".
- 32: toàn cung tô đúng khuông, sáu ngoặc 1; bát cung tô đúng khuông (Đô Rê♭ Mi♭ Mi Fa♯ Sol La Si♭ Đô), ½ và 1 xen kẽ bắt đầu bằng ½ như tiêu đề khuông.
- 17, clarinet, trumpet: nốt vang Si♭3, La3, Fa3, Mi♭3 dưới Đô4 đúng 2 trưởng, 3 thứ, 5 đúng, 6 trưởng như bảng (clarinet: một cung, 3 thứ; trumpet: một cung). Ngoặc "horn in F" rút gọn "Kèn horn in F" của bảng, không đổi nghĩa.
- 02: Fa3 trên dòng 4 khóa Fa, Đô4 trên dòng kẻ phụ (ngoài cả hai khuông), Sol4 trên dòng 2 khóa Sol, dòng đánh số từ dưới lên, nét đứt xuống đúng phím; `aria-label` và chú thích chỉ nói lại mục Khóa Sol, Khóa Fa, Dòng kẻ phụ, Khuông kép, tip "Trên phím đàn".

Hồ sơ: 19 câu có `review: dung` và ghi chú "Soát hình 2B (gộp review và kiểm mẫu): …"; lần cuối của 11 hồ sơ có `review` và `kiem_mau` cùng chuỗi, `luot_2` "không cần (câu ve-site, thủ tục hình)" (07 giữ lượt 2 Sonnet cho n42, n43). Còn lại cho người gom: xem ảnh rồi khóa lại 11 trang.

Kiểm sau soát: `node tools/khoa.mjs tinh` thoát 0; `npm test` (bản xem) 308 đạt, 2 bỏ qua, 0 hỏng.
