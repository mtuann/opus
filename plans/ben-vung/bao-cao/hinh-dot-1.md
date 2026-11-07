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

## Việc cho người gom

- Review mã (mức "Vừa", commit mã riêng).
- Lượt 2 cho n67 của `nhac-ly/09-quang` (`node tools/khoa.mjs xuat …`); review các câu `ve-site` mới và n10 của `nam-ngon`; kiểm mẫu; khóa lại bốn trang.
- Trang `nam-ngon` dài thêm 15 bàn phím (mỗi cái có dòng "Bấm vào phím…" và nút nghe). Nếu thấy nặng: đợt sau có thể thêm thông số tắt dòng nhắc, hay xếp lưới các bàn phím nhỏ.
- Đợt hình sau có thể dùng ngay thành phần A cho: `piano/gam` (ngón 12 gam, đề xuất 7), `piano/hop-am-rai`, `luyen-tai/choi-bang-tai`, nhạc lý 05, 06, 07, 10, 11 (đề xuất 9, dùng `ngoac`).
