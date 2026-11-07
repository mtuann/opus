# Đợt hình 1: bàn phím có số ngón, nhãn, ngoặc (thành phần A) và bốn trang người mới

Nhánh `mo/hinh-dot-1` từ `main` (`df74100`), Claude Opus 5.5, 06/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md` (khảo sát, commit cùng nhánh): thành phần A, đề xuất số 1, 3, 4.

Bốn commit: khảo sát; mã (thành phần, kiểm thử, AGENTS.md); sửa nhỏ của mã sau lần chạy kiểm thử trình duyệt đầu; trang và hồ sơ (cùng báo cáo này).

## Mã (review riêng, mức "Vừa")

Hai commit "Bàn phím có số ngón, nhãn, ngoặc…" và "Bàn phím có chữ: dấu số ngón…". Bàn phím cũ không thông số mới thì SVG giữ nguyên (kiểm thử so `viewBox` và thuộc tính `y`), nên 26 bàn phím đã khóa ở các trang khác không đổi.

| File | Đổi |
|---|---|
| `src/plugins/thanh-phan.mjs` | `docThongSoBanPhim` nhận thêm `phai`, `trai` (`"C4:1 D4:2"`, ngón 1–5), `nhan` (`"C4:0 Db4:1\|2_thứ"`: `_` là khoảng trắng, `\|` xuống dòng, tối đa ba dòng), `ngoac` (`"E4-F4:½"`). Nốt phải trong `range`; một phím một số ngón mỗi tay, một nhãn; sai hay thông số lạ thì build hỏng như trước. Phím có số ngón là phím được tô (nút "Nghe các nốt được tô" phát chúng). `banPhim` thêm dòng chú giải hai tay (chữ thật, hình như trên phím) khi có số ngón. |
| `src/scripts/ve.js` | `veBanPhim` nhận `ngon`, `nhanPhim`, `ngoac`; `tamPhim` (tâm x của phím). Số ngón vẽ trên phím: phím trắng ngay dưới phím đen (y 71), phím đen ở cuối phím; tay phải hình tròn, tay trái hình vuông bo góc (khác hình, không chỉ khác màu); hai tay chung phím thì hai dấu nhỏ cạnh nhau. Nhãn phím trắng dưới bàn phím, phím đen trên; nhãn hai phím kề nhau dài quá bề rộng phím thì xếp so le hai hàng (phím trắng: dòng đầu vẫn thẳng hàng, chỉ dòng sau lùi). Ngoặc nối tâm hai phím, chữ trên ngoặc; ngoặc chồng (ước lượng cả bề rộng chữ) thì lên tầng trên. Chữ trong hình `aria-hidden`; mô tả vào `aria-label` của cả hình và `data-mo-ta` của từng phím. Lớp `oz-phim--chu` trên `svg` khi có chữ thêm. |
| `src/scripts/ban-phim.js` | Tên đọc được của phím thêm `data-mo-ta` ("Đô (C4), được tô, tay phải ngón 1; tay trái ngón 1"). |
| `src/styles/thanh-phan.css` | `--oz-ngon-phai` `#2b65a8`, `--oz-ngon-trai` `#a9472f`, `--oz-ngon-chu` trắng, khai ở ba khối (tối, sáng, in) cùng giá trị: dấu nằm trên phím mà phím trắng sáng ở cả hai chế độ; chữ trắng trên hai màu từ 5:1. Viền dấu màu phím trắng để tách khỏi phím đen. Nhãn và ngoặc `currentColor`. In: `print-color-adjust: exact` cho dấu. |
| `tests/ban-phim.test.mjs` | Đọc thông số (đúng và 12 kiểu sai), SVG (hình dấu theo tay, `data-mo-ta`, `aria-label`, vị trí nhãn trên/dưới, tầng ngoặc, so le), bàn phím không chữ thêm không đổi, chú giải, lỗi ghi tên file. |
| `tests/trinh-duyet/kiem-ban-phim-chu.mjs` (mới) | Ba trình duyệt × 360/768/1280 px, mọi trang có bàn phím loại này: không tràn ngang; dấu nằm trong phím của nó và không bị phím đen che; chữ nhãn, ngoặc không đè nhau, không đè phím; có chú giải; tên đọc được của phím có số ngón; bấm phím có số ngón vẫn đọc tên (1280 px). |
| `tools/trang-mau.mjs` | Loại khối "bàn phím có số ngón, nhãn, ngoặc" (`class="oz-phim oz-phim--chu`). |
| `AGENTS.md` | Mục D3-L1: thông số mới. |

Chỗ người review nên xem: ước lượng bề rộng chữ (`rongChu`, 3,6 đơn vị mỗi ký tự ở cỡ 6,5) quyết định so le và tầng ngoặc; kiểm thử trình duyệt đo bằng `getBoundingClientRect` để bắt chỗ ước lượng sai. Vùng bấm không đổi (dấu, chữ `pointer-events: none`; phím trắng ≥ 44 px, phím đen ≥ 24 px như cũ).

## Trang

Bốn trang mở khóa (`node tools/khoa.mjs mo … --ly-do "thêm hình (đợt hình 1): …"`), chưa khóa lại; lần 2 trong `lan` có `luot_1`, còn trống `luot_2`, `review`, `kiem_mau`.

| Trang | Hình thêm | Nhận định mới |
|---|---|---|
| `nhac-ly/09-quang` | Mục "Bước 2": thước nửa cung Đô4–Đô5 (mỗi phím: số nửa cung từ Đô4 và tên quãng), đặt trên bảng; bảng giữ nguyên (n10–n23 đã khóa, hồ sơ khác trỏ tới). Mục "Đảo quãng": bàn phím tô Đô4, Mi4, Đô5 với ba ngoặc "3 trưởng, 4 nửa cung", "6 thứ, 8 nửa cung", "8 đúng, 12 nửa cung" và một câu "4 + 8 = 12". | n66, n68 (`ve-site`); n67 (`quy-tac`, nguồn OMT Intervals và Mount 11 đã có: 4 + 8 = 12 từ n15, n19, n23) cần lượt 2 |
| `piano/nam-ngon` | Thế Đô (bàn phím cũ, thay `notes` bằng `phai`/`trai`, vẫn mười phím được tô), thêm thế Đô giữa, thế Sol, thế Fa (hai tay). Mười hai giọng: 12 bàn phím tay phải ngón 1–5, nhãn "thứ" ở phím bậc 3 của thế thứ, theo bốn nhóm của bảng. | n10 sửa câu theo cú pháp mới (bỏ `review` cũ, cần review lại); n62, n63 (`ve-site`) |
| `piano/10-bai-dau-tien` | Bài 1 (phải thế Đô, trái thế Sol), bài 2 ô 1–2 (mở rộng, nhãn "mở rộng"), bài 4 (hai hình hợp âm tay trái 5-3-1, 5-2-1, nút "Nghe hợp âm"), bài 7 (trái 1-2-3-4 trên La–Mi), bài 10 (trái 5-2-1 La–Mi–La, phải 1-2-4 Đô–Mi–La theo khuông). | n110–n114 (`ve-site`) |
| `piano/hai-tuan-dau` | Ngày 2–3: thế Đô hai tay; ngày 5–6: phải thế Đô, trái thế Sol. | n42, n43 (`ve-site`) |

- Mỗi hình đối chiếu với chữ của trang và khuông `abc` (ghi trong `ghi_chu` của nhận định); không thêm điều trang chưa nói. Riêng bài 10, số ngón tay phải lấy từ khuông (chữ không ghi).
- Không vẽ: bài 5, 6 (nhiều lần dời tay, bàn phím quá rộng), bài 8 (chỉ "quãng 5 bằng ngón 5 và 1"), bài 9 (tay trái thế Sol, trùng hình bài 1).
- `doi_chu`: câu dẫn mới (09-quang 2 mục, nam-ngon 2, 10-bai-dau-tien 2; hai-tuan-dau không có câu mới). Chữ trong hình có `data-sinh`, so-chu bỏ qua.
- Câu `ve-site` mới kiểm trên bản xem và trong `veBanPhim`, `docThongSoBanPhim`; review cần kiểm lại (chuẩn kiểm định mục 3).

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `npm test` 303 đạt, 2 bỏ qua (kiểm thử phạm vi của nhánh lô và nhánh `them/`).
- `npm run build` (bản thật, bốn trang mở khóa không có): `npm test` 302 đạt, 3 bỏ qua.
- `OPUS_TRANG="nhac-ly/09-quang/,piano/nam-ngon/,piano/10-bai-dau-tien/,piano/hai-tuan-dau/" npm run test:trinh-duyet`: 825 đạt, 1 bỏ qua, 0 hỏng (ba trình duyệt; cả `kiem-ban-phim-chu.mjs` 9/9, axe, hiển thị 360/768/1280).
  - Lần chạy đầu `kiem-ban-phim-chu.mjs` bắt hai lỗi thật, đã sửa trước khi chạy lại: dấu số ngón phím trắng (y 71, r 7) chạm đáy phím đen 1 đơn vị, chuyển xuống y 72,5, r 6,5; hai hàng nhãn so le sát nhau, thêm khoảng hở 2 đơn vị. Phép đo chữ bớt 15% trên, dưới khung chữ (khoảng trống của phông) để đo phần nét chữ.
- Lighthouse (`LH_TRANG="piano/nam-ngon/,nhac-ly/09-quang/"`, 3 lần): `nam-ngon` hiệu năng 99, `09-quang` 100; trợ năng, thực hành tốt, SEO đều 100. `nam-ngon` (16 bàn phím) TBT 13 ms, 319 KiB.
- Cuối cùng build lại bản xem.

## Ảnh chụp

Không commit (chỉ để người gom xem), ở scratchpad của phiên:

- Cả trang, 360 và 1280 px (`OPUS_CHI_TRANG_DOI=1 node tools/chup-anh.mjs`): `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/anh-chup/` (bốn trang `nhac-ly--09-quang`, `piano--nam-ngon`, `piano--10-bai-dau-tien`, `piano--hai-tuan-dau`, cộng trang chủ, 404, `bat-dau--tom-tat`).
- Từng bàn phím (1280 px sáng, 360 px tối, độ phân giải gấp đôi): `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/xem/`. Tiêu biểu: `nhac-ly_09-quang_0-360.png` (thước nửa cung), `nhac-ly_09-quang_1-1280.png` (đảo quãng), `piano_nam-ngon_1-1280.png` (thế Đô giữa, hai ngón cái chung phím), `piano_nam-ngon_10-1280.png` (Rê♭, nhãn "thứ").

## Review

Claude Opus 5.5, 06/11/2026, không phải người làm lượt 1 hay lượt 2. Review nội dung (câu `ve-site` và n67), không review mã.

- Cách kiểm: `npm run build:xem`, rồi đọc từng SVG `oz-phim--chu` trong `dist/<trang>/index.html`: tâm x và `data-m` của từng phím, dấu số ngón (lớp `oz-ngon--phai`, `oz-ngon--trai`) ứng với phím chứa nó, nhãn (`oz-phim-nhan`), ngoặc (`oz-phim-ngoac`: hai đầu path ở tâm hai phím, tầng), phím tô, chữ nút nghe. Đối chiếu với thông số `::cong-cu` trong trang, chữ, bảng và khuông `abc` cùng mục (ký hiệu `!n!` của từng nốt). Xem thêm ảnh chụp từng bàn phím của lượt 1.
- Kết quả: 13 câu, 13 `dung`, 0 `sai`; không sửa trang hay thông số hình. Mỗi câu có `review: dung` và đoạn "Review hình đợt 1 (06/11/2026): …" trong `ghi_chu`. `nguoi.review` điền ở lần 2 của bốn hồ sơ; `nguoi.luot_2` ghi "không cần (câu ve-site không qua lượt 2)" ở `nam-ngon`, `10-bai-dau-tien`, `hai-tuan-dau` (`09-quang` đã có lượt 2 cho n67).

| Trang | Câu | Đã kiểm |
|---|---|---|
| `nhac-ly/09-quang` | n66, n67, n68 | Thước: 13 nhãn đều ở phím MIDI 60 + số nửa cung, số và tên quãng khớp từng dòng bảng (0 = 1 đúng … 12 = 8 đúng; phím đen 2 thứ, 3 thứ, 4 tăng/5 giảm, 6 thứ, 7 thứ). Đảo quãng: ngoặc Đô4–Mi4 (4), Mi4–Đô5 (8) cùng tầng, Đô4–Đô5 (12) tầng trên; tự đếm lại 4 + 8 = 12 (n67, lượt 1 và lượt 2 cùng dung, nhãn `quy-tac` đúng). |
| `piano/nam-ngon` | n10, n62, n63 | Bốn thế tay khớp từng ô bảng thế tay (thế Đô giữa: hai dấu nhỏ trên Đô4; thế Fa: Si♭ dưới ngón 4 phải, ngón 2 trái). Mười hai giọng: năm phím có số ngón là cột "Năm nốt", nhãn "thứ" ở phím nửa cung dưới bậc 3 (cột "Thế thứ", kể cả phím Mi cho Fa♭, phím Si cho Đô♭). |
| `piano/10-bai-dau-tien` | n110–n114 | Số ngón của năm hình không mâu thuẫn khuông 1, 2, 4, 8, 11. Bài 2: Sol3 ngón 1 tay trái có ở ô 4 chứ không ở ô 1–2, nhưng hình vẽ vị trí tay theo chữ ("Sol3 ngón 1"), không trái khuông. Bài 10: hình là ô 2 (tay trái cũng ô 4, 6, 8); ô 3, 7 không vẽ. |
| `piano/hai-tuan-dau` | n42, n43 | Ngày 2–3 khớp khuông khởi động 1; ngày 5–6 giống hình bài 1. |

Ghi nhận, không phải lỗi (không sửa):

- `09-quang`: tên quãng ở phím đen chỉ đúng với cách viết giáng của cột ví dụ (Đô–Rê♭ là 2 thứ; Đô–Đô♯ cùng phím là 1 tăng). Câu dẫn đã nói "bảng dưới ghi cùng các quãng ấy, kèm ví dụ từ Đô", và bảng cũng xếp theo số nửa cung, nên hình không nói khác bảng. Nếu muốn chặt hơn, đợt sau có thể thêm vào câu dẫn "phím đen đọc theo tên trong cột ví dụ".
- `10-bai-dau-tien` bài 2: nhãn "mở / rộng" hai dòng nên chữ "mở" in đậm như dòng đầu của mọi nhãn (dòng số ở `09-quang`). Chỉ là kiểu chữ.

Kiểm sau review: `node tools/khoa.mjs tinh` thoát 0 (mọi mục đã khóa khớp); `npm test` (trên bản xem) 303 đạt, 2 bỏ qua, 0 hỏng. Còn lại trước khi khóa lại: kiểm mẫu (`kiem_mau`), rồi `node tools/khoa.mjs khoa` bốn trang.

## Sửa theo review mã

Review mã của người gom: gộp được, sửa ba chỗ (một commit mới; trang và hồ sơ không đổi).

1. **Sách in bỏ mất hình.** `src/sach/sach.mjs` bỏ mọi `oz-ban-phim`, nên bàn phím có số ngón, nhãn, ngoặc của `nam-ngon`, `hai-tuan-dau`, `09-quang`, `10-bai-dau-tien` không vào sách. Nay khối có `svg.oz-phim--chu` là hình của bài: giữ trong sách (không tính là công cụ, nên mục chứa nó không bị bỏ), chỉ bỏ dòng tên nốt, nút nghe (`oz-phim-ten`, `oz-row`) và `<noscript>` bên trong, như `@media print`. Bàn phím chỉ tô phím vẫn bỏ như cũ. Bản xem: `piano-ky-thuat` 18 hình (16 `nam-ngon`, 2 `hai-tuan-dau`), `nhac-ly-co-ban` 2, `piano-tac-pham` 6. Kiểm thử `tests/sach.test.mjs`: `lamChuong` giữ hình và chú giải, bỏ tên nốt và nút; mọi `oz-ban-phim` trong `dist/sach/` đều có `oz-phim--chu`, không còn `oz-phim-ten`, `oz-row`.
2. **Thứ tự phím tô trong tên đọc được.** Trước: notes, rồi tay phải, rồi tay trái. Nay có số ngón thì `to` xếp theo cao độ; không có số ngón thì giữ thứ tự `notes` (HTML bàn phím cũ không đổi). Kiểm thử ở `tests/ban-phim.test.mjs`.
3. **Chữ ở mép hình bị cắt.** Nhãn hay chữ ngoặc ở phím đầu, phím cuối dài hơn nửa phím thì vượt `viewBox`. Nay mỗi dòng dịch vào trong theo bề rộng ước lượng nhân 1,1 (`trongHinh` trong `veBanPhim`); không nới `viewBox`, để phím không nhỏ đi dưới 44 px. Kiểm thử Node (nhãn dài ở Đô4 và Mi4 nằm trong hình) và trình duyệt (`kiem-ban-phim-chu.mjs`: khung mỗi `tspan` nằm trong `svg`).

Kiểm lại: `npm run build:xem` (không `[opus]`), `npm test` 303 đạt, 2 bỏ qua; `node --test tests/ban-phim.test.mjs tests/sach.test.mjs` 25 đạt; `OPUS_TRANG` 4 trang `npm run test:trinh-duyet` 771 đạt, 1 bỏ qua, 0 hỏng (ba trình duyệt). Bản xem là bản build cuối.

## Việc cho người gom

- Review mã (mức "Vừa", commit mã riêng).
- Lượt 2 cho n67 của `nhac-ly/09-quang` (`node tools/khoa.mjs xuat …`); review các câu `ve-site` mới và n10 của `nam-ngon`; kiểm mẫu; khóa lại bốn trang.
- Trang `nam-ngon` dài thêm 15 bàn phím (mỗi cái có dòng "Bấm vào phím…" và nút nghe). Nếu thấy nặng: đợt sau có thể thêm thông số tắt dòng nhắc, hay xếp lưới các bàn phím nhỏ.
- Đợt hình sau có thể dùng ngay thành phần A cho: `piano/gam` (ngón 12 gam, đề xuất 7), `piano/hop-am-rai`, `luyen-tai/choi-bang-tai`, nhạc lý 05, 06, 07, 10, 11 (đề xuất 9, dùng `ngoac`).
