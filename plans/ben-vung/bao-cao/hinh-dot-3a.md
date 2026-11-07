# Đợt hình 3a: ngón bấm 12 gam, ký hiệu bàn đạp, bước nhảy, dây buông, buổi tập và thang máy đếm nhịp

Nhánh `mo/hinh-dot-3a` (tách từ `mo/hinh-dot-2a`, `736f7f4`), Claude Opus 5.5, 07/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md`: đề xuất 7, 11, 14, 28, 30. Thủ tục: `plans/ben-vung/chuan-kiem-dinh.md` mục 7, "Thêm hình minh họa vào trang đã khóa (thủ tục rút gọn)".

Hai commit: mã (thành phần, hình tĩnh, kiểm thử, `AGENTS.md`); trang và hồ sơ (cùng báo cáo này).

## Mã (review riêng, mức "Vừa")

Dùng lại tối đa: bàn phím có số ngón, ngoặc của đợt 1 (`veBanPhim`, `::cong-cu{ten="piano" … ngoac}`), dải thời gian của đợt 2a (`veThoiGian`). Mã mới chỉ là dữ liệu và một lưới bàn phím tĩnh.

| File | Đổi |
|---|---|
| `src/scripts/ve-piano-3.js` (mới) | `HINH_PIANO_3`: `ngon-gam` (mười hai bàn phím nhỏ của `veBanPhim`, 9 phím trắng, tô tám nốt của gam, số ngón hai tay; `NGON_GAM` chép nguyên 12 dòng bảng của `piano/gam`; số trong ngoặc của bảng vẽ viền đứt: thêm lớp `oz-ngon--mut` vào dấu do `veBanPhim` dựng; `aria-label` từng bàn phím đọc tên giọng và số ngón từng nốt; chú giải chung `oz-phim-chu-giai`), `buoc-nhay`, `buoi-tap`, `thang-may` (dữ liệu cho `veThoiGian`). Lỗi ghi tên hình như `HINH_THOI_GIAN`. |
| `src/components/hinh/ky-hieu-ban-dap.html` (mới) | Hình tĩnh SVG (viewBox 360 rộng, lớp `oz-fig-vua` rộng tối đa 34rem để chữ không nhỏ đi ở 360 px). Màu: `currentColor` và `--oz-h-do` (như `pedal-timing`). |
| `src/plugins/thanh-phan.mjs` | Một dòng import, một dòng `...HINH_PIANO_3` trong `HINH`. |
| `src/styles/thanh-phan.css` | Khối mới ở cuối: lưới `oz-ngon-gam` (một cột ở màn hẹp, hai cột khi đủ 17rem; bàn phím giãn theo ô vì không bấm được), dấu viền đứt `oz-ngon--mut` (nền trắng, viền và chữ màu của tay: 5,9:1), `oz-fig-vua`. |
| `tests/piano-3.test.mjs` (mới) | Đọc bảng Markdown trong trang và so với dữ liệu của hình: 12 dòng ngón bấm từng ô, cột "Ngón 4" khớp nốt có ngón 4 (không kể số trong ngoặc), số ngón đọc lại từ SVG từng phím, 14 dấu viền đứt; buổi 30 phút (số phút, tên việc, vị trí và độ dài thanh); thang máy (bắt đầu, cao nhất, vị trí thanh; mỗi ngày bắt đầu thấp hơn mức cao nhất hôm trước); bước nhảy (chữ có trong trang, nốt đích đúng ở vạch phách 2); hình tĩnh bàn đạp (đường kẻ, chỗ gãy dóng với chữ *Ped.* thứ hai). |
| `tests/trinh-duyet/kiem-piano-3.mjs` (mới) | Ba trình duyệt × 360/768/1280 px: không tràn ngang; 12 ô lưới không đè nhau, bàn phím và tên giọng trong ô, tên không đè bàn phím, phím trắng từ 24 px; chữ của hình bàn đạp trong hình, không đè nhau, cỡ chữ hiển thị từ 8,5 px. Ba hình dải thời gian đo ở `kiem-thoi-gian.mjs` (đã tự gồm trang có `oz-tg`). |
| `tests/trinh-duyet/kiem-ban-phim-chu.mjs` | Một dòng: chú giải tìm trong `.oz-ban-phim, .oz-figure` (hình nhiều bàn phím có một chú giải chung), để phép đo dấu số ngón trong phím chạy cả cho `ngon-gam`. |
| `tools/trang-mau.mjs` | Loại khối "ngón bấm 12 gam" (`class="oz-figure oz-ngon-gam`). |
| `AGENTS.md` | Mục "Đợt hình 3a" sau mục đợt 2a. |

Chỗ người review nên xem: `hinhNgonGam` sửa chuỗi SVG của `veBanPhim` (thay `aria-label`, thêm lớp vào `<g class="oz-ngon oz-ngon--<tay>" data-phim="…">`; không thấy thì ném lỗi) thay vì thêm thông số vào `ve.js`, để không đụng module dùng chung của nhánh khác.

## Trang

Bảy trang mở khóa (`node tools/khoa.mjs mo … --ly-do "thêm hình (đợt hình 3): …"`), chưa khóa lại; lần mới trong `lan` có `luot_1`, còn trống `luot_2`, `review`, `kiem_mau`. Trang chỉ thêm một dòng chỉ thị; không câu dẫn mới, nên không có `doi_chu` mới (chữ trong hình có `data-sinh`). Bảng của trang giữ nguyên.

| Trang | Hình (đặt ở) | Đề xuất | Nhận định `ve-site` |
|---|---|---|---|
| `piano/gam` | `::hinh{ten="ngon-gam"}` sau "Cách đọc bảng" (ngay dưới bảng 12 gam trưởng) | 7 | n36 |
| `piano/ban-dap` | `::hinh{ten="ky-hieu-ban-dap"}` sau bảng "Ký hiệu" | 11 | n63 |
| `piano/quang-tam-buoc-nhay` | `::hinh{ten="buoc-nhay"}` sau đoạn đầu mục "Bước nhảy: nhảy sớm, đánh đúng lúc" | 14 | n66 |
| `nhac-cu/violin` | `::cong-cu{ten="piano" range="G3-E5" notes="G3 D4 A4 E5" ngoac="… quãng 5"}` sau đoạn "Bốn dây lên theo quãng 5" | 28 | n32 |
| `nhac-cu/cello` | `::cong-cu{ten="piano" range="C2-A3" notes="C2 G2 D3 A3" ngoac="… quãng 5"}` sau đoạn "Cello có 4 dây" | 28 | n33 |
| `bat-dau/moi-ngay` | `::hinh{ten="buoi-tap"}` sau bảng "Buổi 30 phút (chuẩn)" | 30 | n10 |
| `piano/cach-tap` | `::hinh{ten="thang-may"}` sau bảng "Ví dụ một thang máy đếm nhịp" | 30 | n61 |

Mọi câu là "chỉ vẽ lại": không câu nào đem điều mới, không cần lượt 2. Chỗ người soát nên xem:

- `ban-dap`: hình đặt hai cách ghi cạnh nhau như "cùng một cách đạp". Điều này suy thẳng từ hai dòng bảng (chữ *Ped.* mới không có dấu sao trước = nhả rồi nhấn lại; ∧ = nhả rồi nhấn lại ngay), và chú thích giữ giới hạn "như trong các bài trên site này". Nghĩa "nửa bàn đạp" của ∧ ở vài ấn bản không vẽ. Khuông để trống (không thêm nốt).
- `quang-tam-buoc-nhay`: độ dài các ô là sơ đồ, chú thích ghi "chỉ để so sánh, không phải số đo". Hình không vẽ đường bay nhìn ngang (đề xuất có nhắc) để khỏi thêm hình dáng mà trang không tả.
- `gam`: các phím có số ngón cả hai tay (bảng ghi cả hai tay một quãng tám đi lên); số trong ngoặc viền đứt. Bàn phím rộng 9 phím trắng cho đều cỡ, nên giọng phím trắng có thêm một phím không tô ở cuối.
- `thang-may`: trục ♩ = 58–78; vạch đứt mức cao nhất hôm trước đọc từ ghi chú ngày 2 của bảng.

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `node tools/khoa.mjs tinh`: khớp (thoát 0); `npm test`: 329 đạt, 2 bỏ qua, 0 hỏng (`tests/piano-3.test.mjs` 7 đạt).
- `npm run build` (bản thật, bảy trang mở khóa không có): `npm test` 329 đạt, 2 bỏ qua, 0 hỏng.
- `OPUS_TRANG` bảy trang, `npm run test:trinh-duyet` (ba trình duyệt): 916 đạt, 1 bỏ qua, 0 hỏng; gồm `kiem-piano-3.mjs` 9/9, `kiem-ban-phim-chu.mjs` 9/9 (có 12 bàn phím của `gam` và bàn phím violin, cello), `kiem-thoi-gian.mjs` 9/9 (có ba hình dải thời gian mới), axe, hiển thị 360/768/1280.
- Lighthouse (`LH_TRANG="piano/gam/,piano/cach-tap/"`, 3 lần): hiệu năng 100 và 99; trợ năng, thực hành tốt, SEO 100; TBT 0 ms; CLS 0,001 và 0,009; `gam` 325 KiB.
- Sách in (bản xem): `piano-ky-thuat` có hình `ngon-gam`, ký hiệu bàn đạp và các dải thời gian (hình là `oz-figure`, sách giữ).
- Cuối cùng build lại bản xem (`dist/` là bản xem).

## Ảnh chụp

Không commit, ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh3a-anh/`: mỗi hình một ảnh 1280 px sáng và 360 px tối (độ phân giải gấp đôi), tên `<nhóm>_<trang>_<số hình>-<cỡ>[-toi].png`. Tiêu biểu: `piano_gam_0-1280.png`, `piano_ban-dap_0-360-toi.png`, `piano_quang-tam-buoc-nhay_0-360-toi.png`, `piano_cach-tap_0-360-toi.png`. (Ảnh 1280 của `gam` có thanh tìm kiếm dính của trang đè ở trên: ảnh chụp cả phần tử cao hơn màn hình, không phải lỗi hình.)

## Soát (review mã và kiểm mẫu gộp, thủ tục hình)

Claude Opus 5.5 (không phải người vẽ), 07/11/2026.

**Review mã (mức "Vừa"): đạt, không phải sửa.**

- `hinhNgonGam` sửa chuỗi SVG của `veBanPhim`: thay `aria-label` đầu tiên (của thẻ `<svg>` gốc, luôn đứng trước mọi phần tử con) và thêm `oz-ngon--mut` vào đúng `<g class="oz-ngon oz-ngon--<tay>" data-phim="…">`. Mỗi cặp tay và phím chỉ có một dấu, và không thấy thì ném lỗi có tên hình, nên `veBanPhim` đổi định dạng thì build hỏng chứ không im lặng sai. Cách gọn hơn là cho `veBanPhim` nhận `mut` trong từng mục `ngon` và một nhãn đầy đủ thay `aria-label`; để lại cho lúc gộp các nhánh 3b, 3c (đụng `ve.js` dùng chung), không đáng làm bây giờ.
- Màu: dấu viền đứt dùng `--oz-ngon-phai`, `--oz-ngon-trai` (cùng giá trị ở sáng, tối, in) trên nền trắng (phím trắng sáng ở mọi chế độ). Hình bàn đạp dùng `currentColor` và `--oz-h-do`. Chữ thật; mỗi bàn phím có `aria-label` đọc tên giọng và số ngón từng nốt, tên giọng hiện bằng chữ `aria-hidden` (không đọc lặp). Lưới một cột ở 360 px. Hình là `oz-figure` nên sách in giữ; `break-inside: avoid` khi in. Kiểm thử đọc lại số ngón từ SVG và so bảng trong trang: hợp lý.

**Soát bảy hình trên bản xem (`npm run build:xem`, `dist/<trang>/index.html`): bảy câu `review: dung`.**

| Câu | Đối chiếu |
|---|---|
| `gam` n36 | Đọc từng dấu trong SVG của 12 bàn phím: số ngón hai tay khớp từng ô của bảng; 14 số trong ngoặc viền đứt đúng nốt đầu mút; cột "Ngón 4" hai tay khớp nốt mang ngón 4. |
| `ban-dap` n63 | Vị trí *Ped.*, dấu sao, vạch dọc, chỗ gãy khớp hai dòng đầu bảng. "Cùng một cách đạp" suy thẳng từ bảng (cả hai dòng ghi chỗ ấy là đổi bàn đạp). **Sửa**: chú thích hình thêm "(vài ấn bản dùng nó cho nửa bàn đạp, như bảng ghi)", để hình không bỏ giới hạn bảng đã nêu. |
| `quang-tam-buoc-nhay` n66 | Chữ trong hai hàng khớp đoạn đầu mục và gạch "Đường đi thấp"; phách là trục sơ đồ, chú thích ghi độ dài chỉ để so sánh. |
| `violin` n32, `cello` n33 | Phím tô Sol3, Rê4, La4, Mi5 và Đô2, Sol2, Rê3, La3; mỗi ngoặc "quãng 5" đúng 7 nửa cung. |
| `moi-ngay` n10 | 3, 5, 15, 5, 2 phút theo thứ tự bảng, tổng 30. |
| `cach-tap` n61 | 60→68, 64→72, 66→76, 68→76; vạch đứt 68, 72, 76; "mỗi ngày bắt đầu thấp hơn" suy từ số của bảng. |

Bảy hồ sơ: `review: dung` và đoạn "Soát hình 3A …" nối vào `ghi_chu` của câu; lần cuối của `lan` có `luot_2` "không cần (câu ve-site, thủ tục hình)", `review` và `kiem_mau` cùng tên người soát. Chưa khóa (việc của người gom, sau khi xem ảnh).

Kiểm sau khi sửa: `npm run build:xem` không cảnh báo `[opus]`; `node tools/khoa.mjs tinh` thoát 0; `npm test` 329 đạt, 2 bỏ qua, 0 hỏng.

## Việc cho người gom

- Review mã và soát bảy câu: xong (mục "Soát").
- Xem ảnh chụp rồi khóa lại bảy trang.
- Xung đột khi gộp với nhánh 3b, 3c: dòng import và `HINH` của `thanh-phan.mjs`, `KHOI` của `tools/trang-mau.mjs`, mục `AGENTS.md`, cuối `thanh-phan.css` (chỉ thêm khối). `kiem-ban-phim-chu.mjs` đổi một dòng.
