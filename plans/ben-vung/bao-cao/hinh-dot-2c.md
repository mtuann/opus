# Đợt hình 2c: âm ngoài hợp âm, thứ tự bè trong tổng phổ, mẫu galant

Nhánh `mo/hinh-dot-2c` từ `main` (`d578eb5`), Claude Opus 5.5, 06/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md`, đề xuất 19, 21 và 26 (26 là phần "nếu còn thời gian"). Thủ tục hình rút gọn (`plans/ben-vung/chuan-kiem-dinh.md` mục 7): cả ba hình chỉ vẽ lại bảng của trang.

Hai commit: mã (ba hình tĩnh, CSS, kiểm thử, `trang-mau.mjs`, `AGENTS.md`); trang, hồ sơ và báo cáo này.

## Mã (review riêng, mức "Vừa")

Không có module mới: ba hình đều là hình tĩnh (`src/components/hinh/<tên>.html`, `::hinh` tự dùng qua `hinhTinh`), nên không đụng `src/plugins/thanh-phan.mjs` hay `src/scripts/`. HTML sinh một lần bằng script ở scratchpad (không commit), sau đó sửa thẳng file như mọi hình tĩnh.

| File | Đổi |
|---|---|
| `src/components/hinh/am-ngoai.html` (mới) | Lưới `oz-fig-grid oz-nct`, sáu thẻ: tên (HTML), một SVG nhỏ (`role="img"`, `aria-label` kể đủ đường nét), dòng "đến: …; rời: …" chép hai cột bảng. Chấm đặc `--oz-h-xanh` là nốt hợp âm, chấm rỗng viền `--oz-h-do` là âm ngoài hợp âm (khác hình, không chỉ khác màu); lưới bậc mờ; mũi tên `currentColor`; cung nối; vạch đứt đổi hợp âm; thanh âm nền `--oz-h-vang`. Chú thích (●, ○ là chữ thật) giải nghĩa ký hiệu. |
| `src/components/hinh/tong-pho.html` (mới) | Một SVG: 17 khuông trống, tên viết tắt căn phải, tên bộ và thanh ngoặc màu bên trái; khuông "nếu có" nét đứt. Màu ngoặc đúng màu ô của `seating.html` (#8cc49a, #e0b45e, #c9a0dc, #9fd0d0, #7aa6d6, đã có trong `MAU_GIU`); chữ `currentColor` trên nền trang. |
| `src/components/hinh/galant.html` (mới) | HTML và CSS (không SVG): tám thẻ, hai hàng "Giai điệu" (vòng viền `--oz-h-xanh`) và "Bass" (vòng `--oz-h-vang`), bậc là chữ thật; "…" giữa hai cặp; "N giữ nguyên" là thanh dài bằng số bước giai điệu (`--n`). |
| `src/styles/thanh-phan.css` | Lưới `.oz-fig-grid.oz-nct` (hai cột ở màn hẹp, tối đa ba), thẻ `.oz-nct-the`, `svg.oz-tong-pho` rộng tối đa 26rem, khối `.oz-galant-*`. Không biến màu mới (dùng `--oz-h-*` đã có ba chế độ). |
| `tests/hinh-ve-lai-bang.test.mjs` (mới) | Đọc bảng Markdown của trang và so với hình: am-ngoai (tên, chữ "đến/rời" đúng hai cột, một chấm rỗng mỗi thẻ trừ âm nền, tên nốt), tong-pho (thứ tự bộ, 15 tên viết tắt theo cột "Nhạc cụ", số khuông, màu ngoặc = màu ô trong `seating.html`, hình đặt ngay trên seating), galant (đọc lại từng hàng thành chữ "1–7 … 4–3", "5 giữ nguyên" khớp bảng; cùng số bước). Sửa bảng mà quên sửa hình thì hỏng. |
| `tests/trinh-duyet/kiem-hinh-ve-lai-bang.mjs` (mới) | Ba trình duyệt × 360/768/1280 px: không tràn ngang; chữ SVG không đè nhau, không ra ngoài hình, không đè chấm/thanh; mọi phần tử nằm trong thẻ; vòng galant tròn, bước i của giai điệu và bass cùng cột (lệch ≤ 1 px), chữ "giữ nguyên" một dòng trong thanh. Lần chạy đầu bắt hai lỗi thật (chữ "phách mạnh" sát mép trên bị cắt ở Firefox; hai dòng nhãn "Đàn hạc, / piano, celesta" sát nhau), đã sửa trước khi commit. |
| `tools/trang-mau.mjs` | Ba loại khối: "thẻ âm ngoài hợp âm", "tổng phổ giản lược", "thẻ mẫu galant". |
| `AGENTS.md` | Một mục ngắn "Đợt hình 2c". |

Sách in: hình tĩnh giữ nguyên trong sách (`src/sach/sach.mjs` không bỏ `oz-figure`); `dist/sach/nhac-ly-nang-cao.html` có am-ngoai và tong-pho, CSS chung nên thẻ vẫn đúng bố cục; màu `--oz-h-*` có bản in.

## Trang

Ba trang mở khóa (`node tools/khoa.mjs mo … --ly-do "thêm hình (đợt hình 2): …"`), chưa khóa lại. Lần 2 trong `lan`: `ngay`, `luot_1` đã điền; còn trống `luot_2`, `review`, `kiem_mau` cho người soát. Không có câu dẫn mới trong trang (chỉ thêm một dòng `::hinh`; chú thích hình có `data-sinh`), nên không có `doi_chu`.

| Trang | Hình | Đặt ở | Nhận định mới |
|---|---|---|---|
| `nhac-ly/18-am-ngoai-hop-am` | `::hinh{ten="am-ngoai"}` | ngay dưới bảng "Các loại chính" | n29 (`ve-site`) |
| `nhac-ly/20-doc-tong-pho` | `::hinh{ten="tong-pho"}` | ngay trên `::hinh{ten="seating"}`, sau câu "…trong tổng phổ, bộ gỗ ở trên cùng và bộ dây ở dưới cùng:" (câu dẫn chung cho hai hình) | n33 (`ve-site`) |
| `piano/hoa-am/mau-galant` | `::hinh{ten="galant"}` | ngay dưới bảng đầu trang | n88 (`ve-site`) |

Bảng giữ nguyên ở cả ba trang (bảng mang nhiều thông tin hơn hình: cột ví dụ, hòa âm, "thường đứng ở").

Chỗ đã cân nhắc để giữ "chỉ vẽ lại":

- am-ngoai: hướng nhảy của nốt dựa (Sol lên Rê) lấy từ khuông "Nốt dựa" của trang; nốt đón trước không vẽ nốt đến (cột "Đến bằng": không có quy định), chỉ "?" và mũi tên nét đứt. Ba hợp âm của thẻ âm nền là chấm chung chung, không tên.
- tong-pho: khuông trống, không vẽ khóa nhạc (trang chỉ nói viola dùng khóa Đô alto, không nói khóa từng bè); "đàn hạc, piano, celesta" không viết tắt vì bảng không viết tắt.
- galant: không vẽ "hai nửa lệch bậc" của Fonte/Monte (đề xuất 26 có ý này, trang không viết thành chữ), không vẽ cột hòa âm.

Không có câu nào cần thủ tục đủ.

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `npm test` 306 đạt, 2 bỏ qua.
- `npm run build` (bản thật, ba trang đang mở không có): `npm test` 306 đạt, 2 bỏ qua.
- `OPUS_TRANG="nhac-ly/18-am-ngoai-hop-am/,nhac-ly/20-doc-tong-pho/,piano/hoa-am/mau-galant/" npm run test:trinh-duyet`: 775 đạt, 1 bỏ qua, 0 hỏng (ba trình duyệt; cả `kiem-hinh-ve-lai-bang.mjs` 9/9, axe, hiển thị 360/768/1280, sách in).
- Lighthouse: `LH_TRANG="nhac-ly/18-am-ngoai-hop-am/,piano/hoa-am/mau-galant/"`, 3 lần: cả hai trang hiệu năng 100, trợ năng, thực hành tốt, SEO 100; TBT 0 ms, CLS ≤ 0,001, khoảng 307 KiB.
- Cuối cùng build lại bản xem.

## Ảnh chụp

Không commit, ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh2c-anh/` (độ phân giải gấp đôi): `am-ngoai-360-toi.png`, `am-ngoai-1280.png`, `tong-pho-360-toi.png`, `tong-pho-1280.png`, `tong-pho-va-seating-ngay-duoi-*.png` (hình chỗ ngồi đứng ngay dưới, để so màu), `galant-360-toi.png`, `galant-1280.png`. Log kiểm thử trình duyệt: `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh2c-trinh-duyet.log`.

## Việc cho người gom

- Review mã (mức "Vừa", commit mã riêng).
- Người soát (không phải người vẽ): đối chiếu ba hình với bảng trên bản xem, ghi `review` cho n29 (18), n33 (20), n88 (mau-galant); `nguoi.review` và `nguoi.kiem_mau` cùng tên ("review và kiểm mẫu gộp, thủ tục hình"); `nguoi.luot_2`: "không cần (câu ve-site, thủ tục hình)".
- Xem ảnh chụp, rồi `node tools/khoa.mjs khoa` ba trang.
- Gộp với hai nhánh song song: `src/styles/thanh-phan.css` (khối mới đặt ngay sau `.oz-fig-grid > *`), `tools/trang-mau.mjs` (`KHOI`, sau "hình tĩnh lưới"), `AGENTS.md` (mục mới đặt trước "D6-L1") có thể xung đột vị trí; nội dung độc lập.
- Ở màn 360 px, thẻ galant xếp một cột (tám thẻ khá dài). Nếu thấy dài, đợt sau có thể thu vòng tròn nhỏ hơn để hai cột.

## Soát

Claude Opus 5.5, người soát (không phải người vẽ), 07/11/2026: review mã mức "Vừa" và soát hình (gộp review và kiểm mẫu, thủ tục hình rút gọn).

**Mã: đạt**, một sửa nhỏ. Ba hình tĩnh dùng biến `--oz-h-*` (đủ tối, sáng, in), chữ thật (`<text>` trong SVG, `<span>` trong galant), `role="img"` và `aria-label` kể đủ đường nét ở từng SVG; galant là HTML nên máy đọc màn hình đọc thẳng chữ. Không biến màu mới. Sách in giữ hình (`dist/sach/nhac-ly-nang-cao.html` có am-ngoai và tong-pho, `piano-ky-thuat.html` có galant; CSS chung `middleware.*.css` có các lớp mới). Kiểm thử Node đọc bảng của trang và so với hình (sửa bảng mà quên hình thì hỏng); kiểm thử trình duyệt chờ `load` và `document.fonts.ready`, không chờ cố định. Ảnh chụp 360 px tối và 1280 px: không đè, không tràn.

- Đã sửa: thanh "giữ nguyên" của galant (`.oz-galant-giu`) là màu nền CSS, trình duyệt bỏ khi in (mặc định không in nền): thêm vào nhóm `print-color-adjust: exact` của `@media print` (cùng `.oz-seg`, `.oz-chip`…). Chữ "giữ nguyên" vẫn in được trước khi sửa, nên không mất thông tin, chỉ mất thanh.

**Hình: ba câu đều `dung`.**

| Câu | Trang | Đối chiếu |
|---|---|---|
| n29 | `nhac-ly/18-am-ngoai-hop-am` | Sáu thẻ theo sáu dòng bảng; hướng và cỡ bước: lướt lên, lên (cùng hướng); thêu lên rồi quay lại; treo giữ (cung nối qua vạch đổi hợp âm) rồi xuống một bậc; dựa nhảy lên bốn bậc Sol–Rê ở phách mạnh rồi xuống một bậc tới Đô (khuông X:3); đón trước "?" (không có quy định), giữ sang hợp âm sau (khuông X:4); âm nền thanh Sol dưới ba hợp âm đổi. |
| n33 | `nhac-ly/20-doc-tong-pho` | Sáu nhóm và 15 tên viết tắt đúng thứ tự bảng; "(nếu có)" khuông nét đứt; mỗi ngoặc phủ đúng các khuông của bộ; màu ngoặc bằng màu ô `seating` (gỗ, đồng, gõ, Harp, dây). |
| n88 | `piano/hoa-am/mau-galant` | Tám thẻ, đọc lại từng bậc (cả ♯1, ♭7, ♯4, ♮7) khớp cột Giai điệu và Bass; "…" ở Meyer, Fonte, Monte; thanh giữ nguyên dài ba bước (Ponte), bốn bước (Quiescenza). |

Hình không nói điều trang không viết. Hồ sơ: `review: dung` và ghi chú "Soát hình 2C…" ở n29, n33, n88; lần 2 của `lan`: `review`, `kiem_mau` cùng chuỗi người soát, `luot_2: "không cần (câu ve-site, thủ tục hình)"`. Chưa khóa (việc của người gom sau khi xem ảnh).

Kiểm: `npm run build:xem` không cảnh báo `[opus]`; `node tools/khoa.mjs tinh` khớp hết; `npm test` 306 đạt, 2 bỏ qua, 0 hỏng.
