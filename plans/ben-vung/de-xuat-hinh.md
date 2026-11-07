# Đề xuất hình cho Opus: chỗ hình nói rõ hơn chữ

Khảo sát chỉ đọc, ngày 06/11/2026, trên `main` (eafff93). Không sửa file nào trong repo.

## Lưu ý chung

- **Mọi trang đều đã khóa**: 235/235 trang trong `src/content/docs/` có mã băm trong `kiem-dinh/khoa.json`, và bản ghi dữ liệu cũng khóa. Thêm hình nào cũng phải `node tools/khoa.mjs mo <trang> --ly-do "…"`, kiểm định câu trong hình (thường là câu `ve-site` hay nhận định nhạc lý mới), rồi khóa lại. Hình đề xuất dưới đây chủ yếu vẽ lại điều trang đã nói, nên ít nhận định mới; vẫn phải kiểm số liệu trong hình (số nửa cung, số ngón, ô nhịp).
- Chữ trong hình mới không có ở trang cũ: `so-chu.mjs` sẽ báo khác. Hoặc đặt `data-sinh` cho phần hình dựng từ code (như `veBanPhim`), hoặc ghi vào `doi_chu`.
- Đề xuất dùng thành phần mới (`::hinh{ten}` mới, thông số mới cho `::cong-cu{ten="piano"}`) cần thêm vào `HINH`/`CONG_CU`, `docThongSoBanPhim`, `KHOI` của `tools/trang-mau.mjs`, kiểm thử 360/768/1280 px, sáng/tối, ba trình duyệt (mức review "Vừa").
- Không đề xuất ảnh chụp hay chép bản nhạc còn bản quyền. Mọi ví dụ nhạc là nhạc cổ, bài soạn cho site, hay sơ đồ trừu tượng.

## Hình đã có (để không trùng)

- **Hình tĩnh** (`src/components/hinh/*.html`): `beats`, `bolero`, `cay-the-loai`, `counterpoint`, `form-overview`, `form-ritornello`, `form-rondo`, `form-small` (hai đoạn, hai đoạn có tái hiện, ba đoạn, minuet và trio), `form-sonata`, `form-variations-k265`, `fugue-trinh-bay`, `hands` (số ngón, nhìn từ trên), `keyboard-ranges`, `keymap`, `luon-ngon` (gam Đô có số ngón, chỗ luồn), `pedal-timing`, `periods`, `piano-88`, `ranges-orchestra`, `ranges-satb`, `ranges-voices`, `seating`, `texture-rolls`, `the-tay` (thế tay nhìn ngang, đúng và hai lỗi), `tu-the-ngoi` (ngồi đúng, nhìn ngang), `voice-leading`.
- **Hình dựng từ code** (`src/scripts/ve.js`, `dong-thoi-gian.js`): `keysigs`, `circle`, `functions`, `modes`, `lo-trinh`, `lifespans`, `::dong-thoi-gian`, `::bang-nha-soan-nhac`.
- **Bàn phím** `::cong-cu{ten="piano" range notes play}`: 26 chỗ (01, 05, 06, 07, 10, 16, nam-ngon, gam, hop-am-rai, hai-tuan-dau, quang-tam, choi-bang-tai, 8 bài học). Chỉ tô phím; **chưa ghi được số ngón, nhãn hay ngoặc cung/nửa cung** (`veBanPhim` có `to2`, `nhan` nhưng chỉ công cụ luyện tai dùng).
- **Sơ đồ đoạn** `::hinh-cau-truc`: 33 bài học, 27 hướng dẫn nghe.
- **Inline SVG** trong `bat-dau/tom-tat.md`: bàn phím Đô3–Đô5 có ngoặc ½ ở Mi–Fa, Si–Đô; vòng quãng năm.
- Công cụ tương tác: đọc nốt, tiết tấu, luyện tai, xây hợp âm, tra phím, metronome… (không lặp lại ở đây).

## Thành phần dùng chung (một thành phần, nhiều chỗ dùng)

| Mã | Thành phần | Dùng ở | Cách làm |
|---|---|---|---|
| **A** | **Bàn phím có số ngón và nhãn**: thêm thông số cho `::cong-cu{ten="piano"}`, ví dụ `phai="C4:1 D4:2 E4:3 F4:4 G4:5"`, `trai="C3:5 … G3:1"` (hai màu tay), `ngoac="E4-F4:½ B4-C5:½"` (ngoặc cung/nửa cung, nhãn quãng) | nam-ngon, 10-bai-dau-tien, hai-tuan-dau, gam, hop-am-rai, choi-bang-tai, bai-tap-ngon, nhạc lý 05, 06, 07, 09, 10, 11, 32 | Mở rộng `veBanPhim` (đã có `nhan`, `to2`) và `docThongSoBanPhim`. Hình dựng lúc build, chữ thật, in được. **Đáng làm nhất**: khoảng 15 trang dùng ngay |
| **B** | **Lưới phách / dải thời gian**: hàng ô theo phách và phần chia của phách, phách mạnh tô đậm; nhiều hàng chồng nhau (hai tay, nhiều lớp); thanh ngang cho "phím đang giữ" | 03, 04, 15 nhạc lý; hai-tay (2:3, 3:4); luyen-tai/nghe-tiet-tau; tieng-dan (legato/staccato); quang-tam-buoc-nhay; 14 (cách diễn tấu) | Một hàm vẽ SVG trong `ve.js` (như `veChucNang`), nhận mô tả ngắn qua thông số `::hinh{ten="luoi-phach" …}`, hay vài hình tĩnh vẽ tay theo cùng mẫu CSS |
| **C** | **Thước nửa cung**: trục 0–12 nửa cung đặt trên dải phím, cung vòng nối hai nốt có nhãn "3 trưởng = 4 nửa cung" | 09 (quãng, đảo quãng), 10 (hợp âm ba = 4+3, 3+4, 3+3, 4+4), 11 (hợp âm bảy), 06/07 (công thức gam) | Biến thể của A (ngoặc trên phím) hoặc hàm riêng `veThuocNuaCung` |
| **D** | **Khối hình thức**: dải khối màu theo chiều dài, cùng màu là cùng chất liệu (như `form-*.html`) | minuet-trio, scherzo, overture, concerto, symphonic-poem; 13/30 (câu, đoạn nhạc); 14 hướng dẫn nghe chưa có `hinh.nghe` | Phần lớn **dùng lại** `::hinh-cau-truc` (chỉ thêm dữ liệu `hinh.nghe`) hay chép mẫu `form-small.html` |
| **E** | **Mặt cắt bộ máy đàn**: phím → búa → dây → bộ giảm âm, bàn đạp vang nhấc giảm âm | tieng-dan, ban-dap, lich-su-dan, chon-dan | Một SVG tĩnh lớn, có thể thêm trạng thái (phím xuống, bàn đạp xuống) bằng CSS |
| **F** | **Đường nét bậc nhạc**: chấm nốt trên vài dòng bậc, nốt hợp âm đặc, nốt ngoài hợp âm rỗng, mũi tên hướng đi; hay "thẻ mẫu" với bậc khoanh tròn | 18 (âm ngoài hợp âm), hoa-am/mau-galant (Romanesca, Prinner, Fonte, Monte…), hoa-am/ket, 29 (chuỗi) | Hàm vẽ nhỏ trong `ve.js`, dữ liệu viết trong thông số |
| **G** | **Dịch giọng**: hai hàng phím (nốt viết / nốt vang), mũi tên lệch một cung hay quãng 3 thứ | 17, 20, clarinet, trumpet | Biến thể của A (hai bàn phím chồng, mũi tên) |

## Ưu tiên 1: người mới, lợi ích lớn, công sức vừa phải

### 1. Quãng: thước nửa cung trên phím (thay bảng 13 dòng)
- **Trang**: `nhac-ly/09-quang`, mục "Bước 2: tính chất" (bảng `| Quãng | Số nửa cung | Ví dụ từ Đô |`) và "Đảo quãng".
- **Chữ hiện tại**: bảng 13 dòng "2 thứ | 1 | Đô – Rê♭" … "8 đúng | 12"; quy tắc "con số mới = 9 − con số cũ".
- **Hình**: dải phím Đô4–Đô5, mỗi phím có số nửa cung từ Đô (0…12) và tên quãng tương ứng dưới phím; nhóm màu: đúng (1, 4, 5, 8), trưởng/thứ (2, 3, 6, 7), tritone ở giữa. Hình thứ hai: đảo quãng, Đô–Mi (4 nửa cung) và Mi–Đô (8 nửa cung) hai cung vòng cộng lại thành 12.
- **Vì sao**: "số nửa cung" là đếm phím; nhìn phím thì đếm được ngay, bảng phải đọc từng dòng. Tritone "chia đôi quãng tám" thấy ngay bằng mắt.
- **Thành phần**: C (hay A với `ngoac`). Hình mới, tĩnh, dựng từ code.
- **Công sức**: vừa (thành phần C), sau đó nhỏ cho 10, 11.

### 2. Khuông kép nối với bàn phím (đọc nốt)
- **Trang**: `nhac-ly/02-khuong-nhac-khoa`, mục "Khuông kép (của piano)" và tip "Trên phím đàn" (nốt mốc Fa3, Đô4, Sol4); dùng lại ở `bat-dau/tom-tat` mục 4, `piano/thi-tau` "Quãng trên khuông và trên phím".
- **Chữ hiện tại**: "Đô giữa nằm trên dòng kẻ phụ ngay dưới khuông khóa Sol, và cũng là một dòng kẻ phụ ngay trên khuông khóa Fa… Thuộc vài nốt mốc (Fa3 trên dòng 4 khóa Fa, Sol4 trên dòng 2 khóa Sol)".
- **Hình**: khuông kép bên trái, bàn phím Sol2–Fa5 nằm ngang bên dưới; đường mảnh nối ba nốt mốc (Fa3 / Đô4 / Sol4) và nét xoắn khóa Sol, hai chấm khóa Fa xuống đúng phím; dòng/khe đánh số 1–5 từ dưới lên.
- **Vì sao**: chỗ người mới vấp nhiều nhất là chuyển "vị trí trên giấy" sang "phím dưới tay"; chữ phải nói ba lần ba điều, hình nối thẳng hai không gian.
- **Thành phần**: hình mới (khuông vẽ SVG + `veBanPhim`; `veNotDon` đã vẽ được nốt trên khuông). Tĩnh.
- **Công sức**: vừa.

### 3. Thế tay năm ngón ở mười hai giọng
- **Trang**: `piano/nam-ngon`, mục "Thế tay năm ngón là gì" (bảng 4 thế) và "Năm ngón trưởng và thứ ở mười hai giọng" (bảng 12 dòng, 4 nhóm "trắng – trắng – trắng", "trắng – đen – trắng"…).
- **Chữ hiện tại**: "Rê♭ | Rê♭ Mi♭ Fa Sol♭ La♭ | Rê♭ (1), Mi♭ (2), Sol♭ (4), La♭ (5)".
- **Hình**: lưới 12 bàn phím nhỏ (mỗi cái 1 quãng tám), xếp theo 4 nhóm hình dạng; phím được tô có số ngón tay phải; phím bậc 3 có dấu phụ "thứ: lùi một phím". Bốn thế (Đô, Đô giữa, Sol, Fa) vẽ hai tay trên một bàn phím, hai màu.
- **Vì sao**: bảng tả *hình dạng* (trắng-đen-trắng) bằng chữ; nhìn 12 hình nhỏ thì nhận ra nhóm ngay, và tay nhớ hình chứ không nhớ chữ.
- **Thành phần**: A (cần số ngón). Nếu chưa có A: tạm thay bằng nhiều `::cong-cu{ten="piano" notes=…}` (không có số ngón, dài trang).
- **Công sức**: vừa (sau A thì nhỏ).

### 4. Thế tay cho mỗi bài trong "10 bài đầu tiên" và "Hai tuần đầu tiên"
- **Trang**: `piano/10-bai-dau-tien` (bài 1, 2, 4, 5, 7, 10: "Tay trái ở thế Sol: ngón 5 trên Sol2, ngón 1 trên Rê3", "ngón 4 trên Sol, ngón 5 trên La", "Đô–Mi–Sol (5-3-1) và Si–Fa–Sol (5-2-1)"); `piano/hai-tuan-dau` ngày 2–3 (thế Đô, đã có bàn phím tô Đô4 nhưng không có số ngón); `luyen-tai/choi-bang-tai` bước "Đặt tay".
- **Hình**: mỗi bài một dải phím nhỏ: phím có số ngón tay phải (trên) và tay trái (dưới), hai màu; chỗ "mở rộng" hay "dời tay" vẽ thêm phím tô nhạt có mũi tên.
- **Vì sao**: người mới đọc "ngón 5 trên Sol2" phải tự dò; hình cho đặt tay ngay. Đây là trang người mới mở đầu tiên.
- **Thành phần**: A. Không A thì `::cong-cu{ten="piano" notes=…}` đã dùng được ngay (nhỏ, nhưng thiếu số ngón).
- **Công sức**: nhỏ mỗi chỗ sau khi có A.

### 5. Nhịp: phách mạnh – nhẹ, nhịp đơn và nhịp kép
- **Trang**: `nhac-ly/04-nhip` (mục "Phách, ô nhịp, vạch nhịp", đoạn "Nhịp đơn và nhịp kép"), `luyen-tai/nghe-tiet-tau` (trang không có khuông hay hình nào: "Mạnh – nhẹ – vừa – nhẹ", "1 và 2 và" / "1 la li 2 la li").
- **Hình**: bốn hàng lưới: 2/4, 3/4, 4/4, 6/8; ô to cho phách (đậm = mạnh, vừa = phách 3 của 4/4), ô nhỏ cho phần chia (2 hay 3), chữ đếm "1 và 2 và" / "1 la li 2 la li" nằm trong ô.
- **Vì sao**: "6/8 là 2 phách lớn chia ba, không phải 6 phách" là câu khó nhất của bài; nhìn lưới 6/8 cạnh 3/4 (cùng 6 móc đơn, nhóm khác nhau) thì thấy ngay.
- **Thành phần**: B. Tĩnh.
- **Công sức**: vừa (thành phần B), nhỏ cho chỗ dùng sau.

### 6. Trường độ: cây chia đôi
- **Trang**: `nhac-ly/03-truong-do`, mục "Các hình nốt" (bảng tên, hình dạng "đầu rỗng, không đuôi", số phách), "Dấu chấm dôi"; `bat-dau/tom-tat` mục 5.
- **Hình**: cây năm tầng có độ dài tỉ lệ: 1 nốt tròn = 2 trắng = 4 đen = 8 móc đơn = 16 móc kép, mỗi tầng là thanh chia đôi trên cùng một trục 4 phách, đầu mỗi thanh có hình nốt (vẽ bằng glyph của abcjs hay SVG path). Thêm: nốt trắng chấm dôi = thanh 2 + thanh 1.
- **Vì sao**: cột "Hình dạng" mô tả bằng chữ thứ vốn là hình; quan hệ "gấp đôi" là quan hệ độ dài, thấy bằng mắt.
- **Thành phần**: B (dải thời gian) + glyph nốt. Tĩnh.
- **Công sức**: vừa.

### 7. Ngón bấm 12 gam trưởng trên phím
- **Trang**: `piano/gam`, mục "Bảng ngón bấm 12 gam trưởng" (bảng 12 dòng "2 3 1 2 3 4 1 2"), "Nguyên tắc nhóm ngón".
- **Hình**: bàn phím một quãng tám có số ngón tay phải trên phím, tay trái dưới phím, ngón 4 tô màu riêng; chọn giọng bằng nút (theo vòng quãng năm). Bản in: lưới 12 hình nhỏ. Nhóm 1-2-3 và 1-2-3-4 khoanh nền nhạt.
- **Vì sao**: dòng số trong bảng tách khỏi phím; người tập phải dịch "4 trên Si♭" sang tay. Hình nối số với phím đen/trắng, và mẹo "ngón cái không đặt phím đen" hiện ra tự nhiên.
- **Thành phần**: A (+ nút chọn giọng nếu làm tương tác). `luon-ngon` đã có nhưng chỉ gam Đô.
- **Công sức**: vừa (tĩnh) đến lớn (tương tác).

### 8. Hai chọi ba, ba chọi bốn
- **Trang**: `piano/hai-tay`, mục "Hai chọi ba" và "Ba chọi bốn" (bảng `| Lưới 6 | 1 | … | ● |`).
- **Chữ hiện tại**: bảng với dấu ● và câu đọc "Một – ly cà phê".
- **Hình**: hai hàng trên một trục thời gian thật (độ dài bằng nhau), chấm tay phải chia 3, tay trái chia 2, đường dọc mờ cho lưới 6; chữ "Một – ly – cà – phê" dưới đúng chỗ. Tương tự lưới 12 cho 3:4, có hình chung "3 – 1 – 2 – 2 – 1 – 3".
- **Vì sao**: bảng đã gần là hình nhưng các cột bằng nhau nên không thấy tỉ lệ; hình cho thấy nốt thứ hai của tay chơi hai rơi *giữa* hai nốt tay kia.
- **Thành phần**: B.
- **Công sức**: nhỏ (sau B).

### 9. Hợp âm ba = chồng hai quãng 3 (và thể đảo)
- **Trang**: `nhac-ly/10-hop-am-ba` (bảng "3 trưởng + 3 thứ… 3 thứ + 3 thứ"), `nhac-ly/11-hop-am-bay` ("Thể đảo của hợp âm ba", bảng hợp âm bảy), `piano/hop-am-rai` ("Hợp âm ba ở các thể đảo": quãng 4 xuất hiện ở đâu quyết định ngón 1-2-5 hay 1-3-5).
- **Hình**: bốn "tháp gạch" hai tầng, chiều cao gạch tỉ lệ số nửa cung (4 và 3), ghi Đô–Mi–Sol…; hình thể đảo: ba tháp Đô–Mi–Sol, Mi–Sol–Đô, Sol–Đô–Mi, gạch quãng 4 tô màu khác, cạnh là số ngón tay phải/trái.
- **Vì sao**: "quãng 4 nằm trên nên dùng ngón 2" là lý lẽ hình học; một hình thay cả đoạn giải thích.
- **Thành phần**: C (hay A với ngoặc), tĩnh.
- **Công sức**: vừa (nhỏ nếu đã có C).

### 10. Legato hở / dính / legatissimo và các kiểu ngắt
- **Trang**: `piano/tieng-dan`, mục "Legato: nối liền bằng ngón" ("Hở (nhả sớm)… Dính (nhả muộn)… chồng nhau một chút xíu") và "Staccato và các kiểu ngắt"; `nhac-ly/14-ky-hieu-bieu-dien` mục "Cách diễn tấu".
- **Hình**: kiểu piano roll (như `texture-rolls`): mỗi nốt là thanh "phím đang giữ"; ba hàng: hở (khe trắng), đúng (đầu–đuôi chạm), legatissimo (chồng nhẹ), dính (chồng nhiều, tô đỏ). Hình hai: cùng 4 nốt ở legato, staccato, portato, tenuto: thanh dài khác nhau.
- **Vì sao**: đây là chuyện *thời điểm nhả*, vô hình trên bản nhạc; thanh thời gian cho thấy đúng thứ cần nghe.
- **Thành phần**: B. Tĩnh.
- **Công sức**: nhỏ – vừa.

## Ưu tiên 2: lợi ích rõ, công sức vừa

### 11. Ký hiệu bàn đạp dưới khuông
- **Trang**: `piano/ban-dap`, mục "Ký hiệu" (bảng: "Đường kẻ dưới khuông, có vạch dọc ở hai đầu… chỗ gãy nhọn (∧) là nhả rồi nhấn lại").
- **Hình**: một khuông ngắn hai ô nhịp, bên dưới ba cách ghi cùng một cách đạp: *Ped.* … ✱; đường kẻ có vạch dọc và chỗ ∧; dóng thẳng hàng với dải "chân lên/xuống" của `pedal-timing`.
- **Vì sao**: tả ký hiệu bằng chữ là tả một hình; abcjs không vẽ được đường bàn đạp, nên trang hiện không có hình nào của nó.
- **Thành phần**: hình tĩnh mới (cùng màu `pedal-timing`).
- **Công sức**: nhỏ – vừa.

### 12. Mặt cắt bộ máy đàn và ba bàn đạp
- **Trang**: `piano/tieng-dan` "Tiếng piano sinh ra thế nào" (búa, cơ chế thoát); `piano/ban-dap` "Ba bàn đạp", "Bàn đạp vang hoạt động thế nào" (bộ giảm âm), "Đặt chân" (điểm bắt); `piano/lich-su-dan`.
- **Hình**: mặt cắt đơn giản: phím (cần bẩy) → búa → dây, bộ giảm âm nằm trên dây; trạng thái 1: phím nghỉ; 2: phím xuống, giảm âm nhấc, búa bật ra sau khi chạm; 3: bàn đạp vang nhấc mọi giảm âm. Thước đứng cạnh bàn đạp: đỉnh – điểm bắt – nửa bàn đạp – đáy. Hình phụ: ba bàn đạp nhìn từ trước, ghi tên và tác dụng.
- **Vì sao**: "độ to phụ thuộc tốc độ búa, ấn thêm không làm to hơn" và "nửa bàn đạp" chỉ hiểu được khi thấy bộ máy.
- **Thành phần**: E. Tĩnh, có thể có công tắc trạng thái.
- **Công sức**: lớn (vẽ cẩn thận, kiểm định chi tiết cơ khí). Lợi ích cao, dùng ở 3–4 trang.

### 13. Cung, nửa cung trên công thức gam; ba dạng gam thứ
- **Trang**: `nhac-ly/06-gam-truong` (bảng "Từ – đến | Đô–Rê | … Khoảng cách | cung | … nửa cung"), `nhac-ly/07-gam-thu` (bảng tương tự; bảng "Dạng | Bậc 6 | Bậc 7"), `nhac-ly/05-dau-hoa` "Nửa cung và cung".
- **Hình**: gam Đô trưởng và La thứ trên phím, ngoặc nhỏ "1" / "½" giữa từng cặp nốt (như hình bàn phím trong `tom-tat`); gam thứ: ba hàng (tự nhiên, hòa âm, giai điệu) chồng, chỉ bậc 6, 7 đổi màu, khoảng 1½ cung Fa–Sol♯ đánh dấu.
- **Vì sao**: bảng hai hàng là cách gượng để vẽ một dãy phím; hình cho thấy "nửa cung là chỗ không có phím đen".
- **Thành phần**: A (`ngoac`). Hiện các trang đã có bàn phím tô phím, chỉ cần thêm ngoặc.
- **Công sức**: nhỏ (sau A).

### 14. Bước nhảy: rời sớm, bay thấp, chờ ở đích
- **Trang**: `piano/quang-tam-buoc-nhay`, mục "Bước nhảy: nhảy sớm, đánh đúng lúc".
- **Hình**: hai làn thời gian dưới hai phách: làn "sai": tay bay suốt khoảng, đập xuống trễ; làn "đúng": đánh – rời ngay – cung bay thấp – chạm mặt phím – chờ – đánh đúng phách. Hình nhỏ đường bay thấp vs vòng cao nhìn ngang.
- **Vì sao**: chữ phải tách "di chuyển" và "đánh" thành hai việc; hình làm phần "chờ" hiện ra rõ.
- **Thành phần**: B. Tĩnh.
- **Công sức**: vừa.

### 15. Ghế cao, vừa, thấp: so sánh cẳng tay
- **Trang**: `piano/tu-the`, bảng "Ghế và khoảng cách", dòng "Chiều cao": "cẳng tay dốc lên là ghế quá thấp, dốc xuống nhiều là ghế quá cao".
- **Hình**: ba hình người ngồi nhỏ (lấy nét từ `tu-the-ngoi`), cẳng tay dốc lên / ngang / dốc xuống, góc ghi bằng đường gạch; dấu đúng ở hình giữa. Có thể thêm khoảng cách gần – vừa – xa.
- **Vì sao**: `tu-the-ngoi` chỉ có tư thế đúng; người tự học cần so mình với lỗi (như `the-tay` đã làm cho bàn tay).
- **Thành phần**: hình tĩnh mới, dùng lại nét `tu-the-ngoi.html`.
- **Công sức**: vừa.

### 16. Câu nhạc: đoạn (hỏi – đáp) và câu (nói – nhắc – dồn)
- **Trang**: `nhac-ly/13-ket` "Câu nhạc và đoạn nhạc" (Ode to Joy); `nhac-ly/30-phat-trien-motip` "Cấu trúc câu nhạc" (bảng Trình bày 1–4 / Tiếp nối 5–8).
- **Hình**: hai dải 8 ô nhịp: đoạn = 4 + 4, cùng màu ô 1–3 và 5–7, nhãn "kết nửa" ở ô 4, "kết trọn" ở ô 8; câu = 2 + 2 + (1+1+2), các mảnh ngắn dần, mũi tên dồn tới kết.
- **Vì sao**: "nói – nhắc lại – rồi dồn tới" là hình dạng thời gian; một dải khối cho thấy tỉ lệ mà bảng không cho.
- **Thành phần**: D (mẫu `form-small.html`).
- **Công sức**: nhỏ.

### 17. Thêm sơ đồ đoạn cho 14 hướng dẫn nghe chưa có
- **Trang**: `nghe-nhac/` bach-air, bach-cello-1, beethoven-moonlight, gershwin-rhapsody, grieg-buoi-sang, handel-hallelujah, mozart-eine-kleine, mozart-nu-hoang-bong-dem, part-spiegel, puccini-nessun-dorma, schubert-erlkonig, tchaikovsky-1812, tchaikovsky-ho-thien-nga, vivaldi-mua-dong (bản ghi không có `hinh.nghe`; `beethoven-anh-trang` chỉ có `hinh.bai-hoc`).
- **Hình**: `::hinh-cau-truc` từ bảng "Theo dõi khi nghe" sẵn có của từng trang (ví dụ Eine kleine chương 1: trình bày – phát triển – tái hiện; Hallelujah: các khối hợp xướng; 1812: các chủ đề).
- **Vì sao**: các trang cùng loại đều có sơ đồ; người nghe cần bản đồ trước khi bấm nghe.
- **Thành phần**: **dùng lại** `::hinh-cau-truc`, chỉ thêm dữ liệu `hinh.nghe` trong `tac-pham.yml` (bản ghi khóa: mở khóa bản ghi lẫn trang).
- **Công sức**: nhỏ mỗi trang (dữ liệu + kiểm số ô nhịp/độ dài).

### 18. Minuet – trio và scherzo
- **Trang**: `hinh-thuc/minuet-trio` mục "Cấu trúc: ABA" (bảng 3 dòng), `hinh-thuc/scherzo` "Từ minuet đến scherzo" (không trang nào có hình).
- **Hình**: dùng lại khung "Minuet và trio" của `form-small.html` (A B A lớn, mỗi khối hai đoạn có dấu nhắc); scherzo: cùng khung, thêm biến thể Beethoven số 5 (scherzo nối thẳng sang finale).
- **Thành phần**: tách khung minuet-trio của `form-small.html` thành `form-minuet-trio.html` (`::hinh` hiện chèn cả file 4 khung).
- **Công sức**: nhỏ.

### 19. Âm ngoài hợp âm: sáu đường nét
- **Trang**: `nhac-ly/18-am-ngoai-hop-am`, bảng "Các loại chính" (cột "Đến bằng" / "Rời bằng": bước liền, cùng hướng, quay lại, nhảy, giữ).
- **Hình**: sáu thẻ nhỏ; mỗi thẻ 3 chấm trên lưới bậc: nốt hợp âm đặc, nốt ngoài hợp âm rỗng, mũi tên "bước" (ngắn) hay "nhảy" (dài); nốt treo có dấu nối từ hợp âm trước; âm nền là thanh dài ở dưới.
- **Vì sao**: bảng là ma trận "đến bằng × rời bằng", tức là hình dạng; hình nhận diện được ngay khi đọc bản nhạc.
- **Thành phần**: F. Tĩnh.
- **Công sức**: vừa.

### 20. Lộ trình năm đầu trên một trang
- **Trang**: `bat-dau/lo-trinh-choi` (4 quý, 12 tháng, mỗi tháng một bảng bên đàn / nhạc lý / nghe).
- **Hình**: bản đồ 12 cột tháng × 3 làn (bên đàn, nhạc lý, nghe), mốc chính (10 bài đầu, bàn đạp, Minuet, chương trình cuối năm) là ô màu, link tới mục tháng.
- **Vì sao**: trang dài 160 dòng; người mới cần thấy toàn cảnh và mình đang ở đâu. `lo-trinh` (7 chặng) không cho chi tiết năm đầu.
- **Thành phần**: hình mới, tĩnh (HTML/CSS lưới; màn hẹp thì cuộn ngang trong khung).
- **Công sức**: vừa.

## Ưu tiên 3: hữu ích, ít người mới cần hơn hay công sức lớn hơn

### 21. Thứ tự bè trong tổng phổ, đối chiếu chỗ ngồi
- **Trang**: `nhac-ly/20-doc-tong-pho` "Thứ tự các bè" (bảng 6 dòng; câu "Thứ tự trong tổng phổ không giống chỗ ngồi trên sân khấu").
- **Hình**: trang tổng phổ giản lược (dòng khuông trống) có ngoặc nhóm bộ gỗ/đồng/gõ/dây, cùng màu với `seating`, đặt cạnh hình chỗ ngồi.
- **Công sức**: vừa. Dùng lại màu của `seating`.

### 22. Concerto Cổ điển: hai lần trình bày và cadenza
- **Trang**: `hinh-thuc/concerto` "Concerto thời Cổ điển và Lãng mạn".
- **Hình**: dải khối như `form-sonata`: trình bày dàn nhạc – trình bày độc tấu – phát triển – tái hiện – cadenza (khối độc tấu có dấu fermata trước) – coda; ba chương nhanh – chậm – nhanh.
- **Thành phần**: D. **Công sức**: nhỏ – vừa.

### 23. Overture Pháp và overture Ý
- **Trang**: `hinh-thuc/overture` "Hai gốc Baroque".
- **Hình**: hai dải ba khối, chiều cao khối là tốc độ (chậm – nhanh – chậm / nhanh – chậm – nhanh), khối chậm của overture Pháp có hình tiết tấu chấm dôi; mũi tên từ overture Ý sang "giao hưởng ba chương".
- **Thành phần**: D. **Công sức**: nhỏ.

### 24. Moldau: dòng sông bảy đoạn
- **Trang**: `hinh-thuc/symphonic-poem` "Đi qua một tác phẩm: Smetana, Moldau" (bảng 7 đoạn).
- **Hình**: dòng sông chảy trái sang phải, rộng dần, bảy trạm có nhãn (hai suối, thợ săn, đám cưới, tiên nữ, thác, Prague), chủ đề *Moldau* đánh dấu chỗ xuất hiện.
- **Thành phần**: hình tĩnh mới (hay `::hinh-cau-truc` nếu thêm bản ghi). **Công sức**: vừa.

### 25. Erlkönig: bốn nhân vật và ba tiếng kêu cao dần
- **Trang**: `nghe-nhac/schubert-erlkonig`, bảng "Theo dõi khi nghe" (tiếng kêu "lần 2, cao hơn… lần 3, cao nhất").
- **Hình**: bốn làn (người kể, cha, con, Vua tinh) theo thời gian, ba tiếng kêu của đứa con là ba bậc thang lên; làn piano (vó ngựa liên ba) chạy suốt rồi đứt ở cuối.
- **Thành phần**: hình riêng (hay `hinh.nghe` cho phần cơ bản). **Công sức**: vừa.

### 26. Mẫu galant: thẻ bậc khoanh tròn
- **Trang**: `piano/hoa-am/mau-galant` (bảng "Giai điệu 6–5–4–3 | Bass 4–3–2–1"), `piano/hoa-am/ket` (bảng cadenza semplice/composta).
- **Hình**: mỗi mẫu một thẻ: hàng trên bậc giai điệu, hàng dưới bậc bass trong vòng tròn, nối theo cột (cách vẽ chuẩn của Gjerdingen); Fonte/Monte có hai nửa lệch bậc.
- **Thành phần**: F. **Công sức**: vừa. Người học ở chặng sau.

### 27. Dịch giọng: nốt viết và nốt vang
- **Trang**: `nhac-ly/17-khoa-do-dich-giong` "Nhạc cụ dịch giọng", `nhac-cu/clarinet`, `nhac-cu/trumpet`.
- **Hình**: hai dải phím chồng: "viết Đô" ở trên, mũi tên chéo xuống "vang Si♭" (clarinet, trumpet Si♭: thấp một cung), "vang La" (clarinet La: thấp 3 thứ), horn Fa (thấp 5 đúng).
- **Thành phần**: G. **Công sức**: vừa. Hình phụ cho 17: Đô4 trên khóa Sol, khóa Đô alto (dòng giữa), khóa Fa (dùng chung nét với đề xuất 2).

### 28. Dây buông của violin, cello
- **Trang**: `nhac-cu/violin` ("Bốn dây lên theo quãng 5: Sol3 – Rê4 – La4 – Mi5"), `nhac-cu/cello` ("Đô2 – Sol2 – Rê3 – La3").
- **Hình**: `::cong-cu{ten="piano" range="G3-E5" notes="G3 D4 A4 E5"}` và `range="C2-A3" notes="C2 G2 D3 A3"`: nghe được bốn dây, thấy cách đều quãng 5.
- **Thành phần**: **dùng lại** bàn phím có sẵn. **Công sức**: nhỏ. Trang Đọc thêm nên ưu tiên thấp.

### 29. Gam toàn cung, gam bát cung
- **Trang**: `nhac-ly/32-ky-thuat-the-ky-20` "Gam toàn cung", "Gam bát cung" (trang không có bàn phím).
- **Hình**: `::cong-cu{ten="piano" range="C4-C5" notes="C4 D4 E4 F#4 G#4 A#4 C5"}`, bát cung `notes="C4 D4 Eb4 F4 Gb4 Ab4 A4 B4 C5"`; với A thêm ngoặc 1 / ½ xen kẽ.
- **Thành phần**: **dùng lại**. **Công sức**: nhỏ.

### 30. Buổi tập 30 phút và thang máy đếm nhịp
- **Trang**: `bat-dau/moi-ngay` (bảng 3 + 5 + 15 + 5 + 2 phút); `piano/cach-tap` "Ví dụ một thang máy đếm nhịp" (bảng 4 ngày: bắt đầu thấp hơn mức cao nhất hôm qua).
- **Hình**: thanh ngang 30 phút chia tỉ lệ năm màu (khởi động, kỹ thuật, bài, đọc nốt, nhật ký); biểu đồ bậc thang 4 ngày, mỗi ngày một đoạn từ "bắt đầu" lên "cao nhất", thấy ngày sau bắt đầu thấp hơn và ngày 4 đứng ở 76.
- **Vì sao**: tỉ lệ thời gian và "không tăng đều" là điều mắt thấy nhanh hơn đọc bảng. Lợi ích vừa.
- **Thành phần**: hình tĩnh nhỏ (biểu đồ: theo màu nhóm của site). **Công sức**: nhỏ.

## Bỏ qua (đã xét)

- `lich-su/nhac-truyen-thong-viet-nam`: thang Hò–Xự–Xang đã có khuông kèm lời hai hệ tên.
- `piano/suc-khoe` bảng "Dấu hiệu cảnh báo": chữ đủ rõ (phần lớn dòng là "đi khám"); hình đèn giao thông chỉ trang trí.
- `piano/hoc-thuoc-bieu-dien` (bốn loại trí nhớ), `piano/cach-tap` (12 bước): danh sách thao tác, sơ đồ quy trình không rõ hơn chữ.
- `nhac-ly/12`, `19`, `21`, `22`, `28`, `31`, `16`, `08`, `am-hoc`, `lich-su/index`, `nhac-cu/dan-nhac`, `nhan-dien/the-loai`: đã có hình phù hợp.
- `bat-dau/index` "Đi theo thứ tự nào?": danh sách 6 bước đã gọn; sơ đồ thêm ít.
