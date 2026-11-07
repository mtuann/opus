# Đợt hình 2a: lưới phách, dải thời gian (thành phần B) và tám trang

Nhánh `mo/hinh-dot-2a` từ `main` (`d578eb5`), Claude Opus 5.5, 06/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md`: thành phần B, đề xuất số 5, 6, 8, 10, 16. Thủ tục: `plans/ben-vung/chuan-kiem-dinh.md` mục 7, "Thêm hình minh họa vào trang đã khóa (thủ tục rút gọn)".

Hai commit: mã (thành phần, kiểm thử, `AGENTS.md`); trang và hồ sơ (cùng báo cáo này).

## Mã (review riêng, mức "Vừa")

| File | Đổi |
|---|---|
| `src/scripts/ve-thoi-gian.js` (mới) | `veThoiGian({ n, moTa, chuThich, hang, lop })`: hình là vài hàng chồng trên một trục chia `n` phần đều; mỗi hàng có nhãn và các mục `{ bat, dai, chu, lop, lan }` (ô phách `manh`/`vua`/`nhe`, phần chia `chia`, ô có nốt `co`, thanh "phím đang giữ" `thanh`/`dinh`, thanh hai tay `phai`/`trai`, phần ngân `tuy-y`, chữ không khung `chu`, khối chất liệu `a`/`b`/`c`/`ket`), hàng nhiều làn (`lan`) cho nốt chồng nhau, vạch dọc mờ (`vach`). `kiemMoTa` bắt mục ra ngoài trục, làn sai, vạch sai (build hỏng). `hinhNot`: hình nốt tròn, trắng, đen, móc đơn, móc kép, chấm dôi (SVG trong dòng, `aria-hidden`). `HINH_THOI_GIAN`: 12 hình của tám trang, dữ liệu viết trong module, mỗi hàm ghi ở chú thích chữ trang nó vẽ lại. |
| `src/plugins/thanh-phan.mjs` | Một dòng import, một dòng `...HINH_THOI_GIAN` trong `HINH`: dùng chỉ thị sẵn có `::hinh{ten="…"}`, không thêm chỉ thị hay thông số. |
| `src/styles/thanh-phan.css` | Mục mới ở cuối file (lớp `oz-tg`). Dựng bằng HTML và CSS chứ không SVG: chữ giữ cỡ `--sl-text-xs` ở 360 px (chữ trong SVG co theo bề rộng), vị trí mục theo phần trăm nên tỉ lệ thời gian giữ ở mọi cỡ. Khung dưới 30rem (container query) thì nhãn hàng lên dòng riêng. Ô nền sáng chữ tối `#1b1b1b` ở cả hai chế độ, như sơ đồ đoạn (`--oz-tg-*`); ô chia và chữ không khung theo màu chữ; thanh hai tay dùng `--oz-ngon-phai`, `--oz-ngon-trai` của bàn phím (đợt 1); vạch đậm đầu thanh là lúc phím xuống. In: `print-color-adjust: exact`. |
| `tests/thoi-gian.test.mjs` (mới) | Mọi hình dựng được, có `figure data-sinh`, `role="img"`, `aria-label`, chú thích; mục trong trục; `kiemMoTa` bắt lỗi; số liệu khớp chữ trang: hai chọi ba (1, 3, 5 / 1, 4; câu đọc), ba chọi bốn (1, 4, 7, 10 / 1, 5, 9; hình chung tính lại từ hai tay = 3 1 2 2 1 3), nhịp (cảm giác theo bảng, chia đôi / chia ba), trường độ (1 = 2 = 4 = 8 = 16; chấm dôi), legato (hở < đúng = 0 < legatissimo < dính); `::hinh{ten}` dựng hình. |
| `tests/trinh-duyet/kiem-thoi-gian.mjs` (mới) | Ba trình duyệt × 360/768/1280 px, mọi trang có hình: không tràn ngang; trục trong hình, mục trong trục; vị trí đo được khớp phần trăm (tỉ lệ thời gian); chữ trong ô không ra ngoài ô; chữ không đè nhau; nhãn hàng không đè trục. Đo bằng `Range.getBoundingClientRect` của chữ (bớt 15% trên, dưới như đợt 1). |
| `tools/trang-mau.mjs` | Loại khối "lưới phách, dải thời gian" (`class="oz-figure oz-tg`). |
| `AGENTS.md` | Mục "Đợt hình 2a" trong "Mẫu trang và khối đặc biệt". |

Chọn `::hinh{ten}` với dữ liệu trong module (như `functions`, `modes`) thay vì chỉ thị mới có thông số: mỗi hình đều riêng một trang, mô tả hàng và mục viết trong chỉ thị một dòng sẽ dài và khó đọc; kiểm thử Node đọc lại số liệu từ HTML. Sửa hình là sửa module (dấu vết dựng lại `tepDauVet` đã tính `src/scripts/*.js`).

## Trang

Tám trang mở khóa (`node tools/khoa.mjs mo … --ly-do "thêm hình (đợt hình 2): lưới phách, dải thời gian vẽ lại chữ và bảng của trang"`), chưa khóa lại; lần mới trong `lan` có `luot_1`, còn trống `luot_2`, `review`, `kiem_mau`. Trang chỉ thêm dòng `::hinh{ten="…"}` (không câu dẫn mới, nên không có `doi_chu` mới; chữ trong hình có `data-sinh`).

| Trang | Hình (đặt ở) | Đề xuất | Nhận định `ve-site` |
|---|---|---|---|
| `nhac-ly/04-nhip` | `nhip`: 2/4, 3/4, 4/4, 6/8 trên một trục 8 móc đơn (sau bảng "Số chỉ nhịp") | 5 | n46 |
| `luyen-tai/nghe-tiet-tau` | `nhip-don-kep`: "1 và 2 và" / "1 la li 2 la li" (sau hai gạch đầu dòng); `dem-to`: ví dụ "đen – móc đơn móc đơn – đen" (sau đoạn ví dụ) | 5 | n29, n30 |
| `nhac-ly/03-truong-do` | `truong-do`: tròn → trắng → đen → móc đơn → móc kép trên 4 phách (sau bảng); `cham-doi`: 2 + 1, 1 + ½ (mục "Dấu chấm dôi") | 6 | n34, n35 |
| `piano/hai-tay` | `hai-choi-ba` (sau bảng Lưới 6), `ba-choi-bon` (sau bảng Lưới 12) | 8 | n78, n79 |
| `piano/tieng-dan` | `legato`: hở, nối đúng, legatissimo, dính (mục Legato); `kieu-ngat`: legato, tenuto, portato, staccato, staccatissimo (sau bảng kiểu ngắt) | 10 | n83, n84 |
| `nhac-ly/14-ky-hieu-bieu-dien` | `dien-tau`: staccato, legato, tenuto, fermata (sau bảng "Cách diễn tấu") | 10 | n64 |
| `nhac-ly/13-ket` | `doan-nhac`: Ode to Joy, câu hỏi 1–4 (kết nửa ô 4), câu trả lời 5–8 (kết trọn ô 8), ô 1–3 và 5–7 cùng màu (sau khuông) | 16 | n35 |
| `nhac-ly/30-phat-trien-motip` | `cau-nhac`: trình bày 1–4 (ý cơ bản 1–2, nhắc lại 3–4), tiếp nối 5–8 (sau bảng) | 16 | n41 |

Bảng của trang giữ nguyên (hình không thay bảng: bảng có cột tên tiếng Anh, câu tiếng Anh, chuyển động… hình không vẽ).

### Chỗ người soát nên xem (chỉ vẽ lại hay không)

Không câu nào thêm sự kiện, quy tắc hay nguồn mới. Ba chỗ là cách đọc chữ trang thành độ dài, ghi rõ trong `ghi_chu` của nhận định và trong chú thích hình ("độ dài chỉ để so sánh, không phải số đo"):

- `tieng-dan` n83: dính vẽ chồng nhiều hơn legatissimo (trang: legatissimo "một chút xíu", dính "nghe nhòe", không cho số).
- `tieng-dan` n84: portato vẽ dài hơn staccato (trang: portato "hơi tách", staccato "nốt ngắn, có khoảng lặng phía sau").
- `nghe-tiet-tau` n30: nốt đen vẽ dài hai vị trí đếm, móc đơn một (trang ghi hình nốt và vị trí; độ dài theo bài 3 trang dẫn tới).

Không vẽ vì trang không nói: chia ô 5–8 của câu ở `30-phat-trien-motip` thành "1 + 1 + 2" (đề xuất cũ; bảng chỉ nói "mảnh ngắn hơn"); độ dài của accent, sforzando, ba kiểu staccato ngón, cổ tay, cẳng tay; chữ đếm cho móc đơn của nhịp đơn ở `04-nhip`.

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `npm test` 313 đạt, 2 bỏ qua (kiểm thử phạm vi của nhánh lô và nhánh `them/`); `node --test tests/thoi-gian.test.mjs` 10 đạt.
- `npm run build` (bản thật, tám trang mở khóa không có): `npm test` 313 đạt, 2 bỏ qua.
- `OPUS_TRANG` tám trang, `npm run test:trinh-duyet` (ba trình duyệt): lần đầu 838 đạt, 3 hỏng: `kiem-thoi-gian.mjs` ở 360 px bắt chữ "Đô" tràn ra ngoài thanh staccatissimo (3/48 trục, khoảng 20 px). Sửa: thanh ngắn hơn 5 phần không ghi tên nốt (`bonNot`). Lần sau (bản xem cuối): 841 đạt, 1 bỏ qua, 0 hỏng (cả axe, hiển thị 360/768/1280, `kiem-thoi-gian.mjs` 9/9).
- Lighthouse (`LH_TRANG="nhac-ly/03-truong-do/,piano/tieng-dan/"`, 3 lần): hiệu năng 99 cả hai; trợ năng, thực hành tốt, SEO 100; TBT 0 ms; CLS 0,076 và 0.
- Sách in (bản xem): `nhac-ly-co-ban` 5 hình, `nhac-ly-nang-cao` 1, `piano-ky-thuat` 4 (hình là `oz-figure`, sách giữ; CSS của site đi kèm).
- Cuối cùng build lại bản xem (`dist/` là bản xem).

## Ảnh chụp

Không commit, ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh2a-anh/`: mỗi hình một ảnh 1280 px sáng và 360 px tối (độ phân giải gấp đôi), tên `<nhóm>_<trang>_<số hình>-<cỡ>[-toi].png`. Tiêu biểu: `nhac-ly_04-nhip_0-360-toi.png`, `nhac-ly_03-truong-do_0-1280.png`, `piano_hai-tay_1-1280.png`, `piano_tieng-dan_0-1280.png`.

## Việc cho người gom

- Review mã (mức "Vừa", commit mã riêng).
- Một người soát (không phải người vẽ): review và kiểm mẫu gộp theo thủ tục hình cho 12 câu `ve-site` (bảng trên), đối chiếu từng hình với chữ trang trên bản xem; xem kỹ ba chỗ ở mục "Chỗ người soát nên xem". `nguoi.luot_2`: "không cần (câu ve-site, thủ tục hình)".
- Xem ảnh chụp rồi khóa lại tám trang.
- Xung đột khi gộp với nhánh 2b, 2c: chỉ ở dòng import và `HINH` của `thanh-phan.mjs`, `KHOI` của `tools/trang-mau.mjs`, mục `AGENTS.md`, cuối `thanh-phan.css` (thêm khối, không sửa khối có sẵn).
- Thành phần B dùng được tiếp cho đề xuất 14 (`quang-tam-buoc-nhay`, bước nhảy) và nhạc lý 15 (liên ba, đảo phách).

## Soát

Claude Opus 5.5, 07/11/2026; người soát không phải người vẽ. Review mã (mức "Vừa") và soát hình (review và kiểm mẫu gộp, thủ tục hình) trên bản xem.

### Review mã: đạt, có ba chỗ nhỏ đã sửa

Module dựng HTML và CSS đúng như mô tả: chữ thật, `role="img"` và `aria-label` đủ ý ở khung hình, chú thích ngoài khung, hình nốt `aria-hidden`; vị trí theo phần trăm; nền ô sáng chữ tối cố định ở cả hai chế độ (như sơ đồ đoạn), phần còn lại theo màu chữ; in có `print-color-adjust: exact`, sách in giữ 10 hình (luyện tai không có trong sách). `kiemMoTa` chặn mục ngoài trục, làn, vạch; lỗi qua plugin ghi tên file. Kiểm thử trình duyệt chờ `load` và `document.fonts.ready`, không chờ cố định.

- **Vạch đầu thanh mất ở chế độ tối** (hình `legato`): hàng nhiều làn có viền trên, dưới trong suốt và `background-clip: padding-box`, nên viền trái 4 px (màu mờ) nằm trên nền trang: chế độ tối không thấy, chế độ sáng thò vào khe giữa hai làn. Sửa: vạch đầu thanh vẽ bằng bóng trong (`--oz-tg-dau`, `inset 4px 0 0`), cùng màu cho tay phải, tay trái; xem lại ảnh 360 px tối và 1280 px sáng.
- **Lỗi mô tả không ghi tên hình**: `HINH_THOI_GIAN` bọc từng hàm, lỗi thành `::hinh{ten="…"}: hình thời gian: …`.
- **Kiểm thử Node thiếu sáu hình** (`nhip-don-kep`, `dem-to`, `kieu-ngat`, `dien-tau`, `doan-nhac`, `cau-nhac`): thêm một phép thử đọc lại số liệu (chữ đếm, vị trí và độ dài nốt của câu đếm to, thứ tự độ dài các kiểu ngắt, ô nhịp và màu của đoạn nhạc, câu nhạc).

### Soát hình: 12 câu dung, 0 sai

Đối chiếu từng hình trên `dist/<trang>/index.html` với chữ, bảng, khuông của trang (ghi ở `ghi_chu` từng câu, đoạn "Soát hình 2A"). Ba chỗ hình đọc chữ thành độ dài đều là **chỉ vẽ lại**, không cần lượt 2:

- `tieng-dan` n83: trang tách legatissimo ("chồng nhau một chút xíu", chỉ làm khi tai đã phân biệt rõ hở và dính) khỏi dính ("chồng lên nhau, nghe nhòe"); chỗ khác nhau chỉ có thể là mức chồng. Đã thêm vào chú thích hình "độ hở, độ chồng chỉ để so sánh, không phải số đo" (báo cáo vẽ nói chú thích có câu này, hình `legato` chưa có).
- `tieng-dan` n84: bảng ghi portato (mezzo-staccato) "hơi tách", staccato "nốt ngắn, có khoảng lặng phía sau", staccatissimo "rất ngắn": thứ tự đọc thẳng từ chữ bảng, chú thích ghi không phải số đo.
- `nghe-tiet-tau` n30: bước 2 của trang (mỗi âm tiết là một vị trí) và vị trí nốt (1, 2, "và", 3) cho đen ở 1 kéo tới 2, móc đơn một vị trí; đen ở 3 cùng hình nốt nên cùng độ dài; bài 3 trang dẫn tới ghi đen 1 phách, móc đơn ½.

Lần mới trong `lan` của tám hồ sơ: `review`, `kiem_mau` là "Claude Opus 5.5 (soát hình 2A, review và kiểm mẫu gộp, thủ tục hình, 07/11/2026)", `luot_2` "không cần (câu ve-site, thủ tục hình)". Chưa khóa: người gom xem ảnh rồi khóa.

### Kiểm sau khi sửa

- `npm run build:xem`: không cảnh báo `[opus]`; `node tools/khoa.mjs tinh`: khớp (thoát 0); `npm test`: 314 đạt, 2 bỏ qua, 0 hỏng (`tests/thoi-gian.test.mjs` 11 đạt).
- `node --test tests/trinh-duyet/kiem-thoi-gian.mjs` (ba trình duyệt × 360 tối, 768, 1280): 9/9 đạt sau khi đổi vạch đầu thanh.
- Ảnh chụp cũ ở thư mục ảnh của người vẽ chụp trước khi sửa: hình `legato` (`piano_tieng-dan_0-*`) cần chụp lại trước khi khóa.
