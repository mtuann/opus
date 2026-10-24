# Báo cáo: duyệt bảng tầng trước đợt 2

Quyết định của chủ repo ngày 24/10/2026 (`plans/lam-lai/README.md`, mục Quyết định): duyệt bảng tầng hiện có, chỉ soát hai chỗ dễ sai. Một là trang có thông tin mau cũ (giá, ứng dụng, thiết bị, link bản thu, sự kiện) phải ở tầng Tham chiếu có hạn. Hai là trang nằm giữa Lõi và Đọc thêm: người mới cần trên lộ trình thì vào Lõi.

- **Soát:** Claude Code (Claude Sonnet 5.5) cùng năm agent con, chỉ đọc, ngày 24/10/2026. Phần phân tích bên dưới là của người soát, giữ nguyên.
- **Duyệt và sửa:** Claude Code (Claude Opus 5.5), nhánh `moi/d2-quyet-dinh`.

## Đã chốt và đã làm

- **Đổi 5 trang**, đúng như mục 1 bên dưới: `lich-su/opera`, `nhac-cu/dan-nhac` thành Lõi; `lich-su/duong-dai`, `lich-su/viet-nam`, `nhan-dien/nghe-mu` thành Tham chiếu có hạn.
- **Ba chỗ người soát để chủ repo quyết**, chọn theo đúng hai quy tắc trên (chủ repo đổi được):
  1. `nhac-cu/dan-nhac` vào lô D5-L3 (cùng phần nhận diện), để mọi trang Lõi xong ở đợt 5.
  2. `nhan-dien/nghe-mu` sang Tham chiếu có hạn: phần chính của trang là link bản thu, đúng quy tắc một. Cách khác (giữ Lõi, đưa 10 bản thu vào dữ liệu có kiểm link) chưa làm.
  3. Mục "Sau 6 tháng: đi sâu hơn" của lộ trình nghe hiểu không tính là bước của người mới, nên `lich-su/nhac-truyen-thong-viet-nam` vẫn ở Đọc thêm.
- **`tai-nguyen`:** rà lại 2027-01 (trang có ngày của chương trình ABRSM), thay 2027-04.
- **Ngày rà lại tính từ ngày khóa:** ghi vào mục Đợt 8 của kế hoạch (D8-L1 đặt lại ngày khi khóa).
- **Mô tả nhóm Đọc thêm còn chữ "opera":** chưa sửa, vì thẻ nằm ở trang chủ đã khóa. D2-L1 làm trang chủ mới và menu 9 nhóm, sửa cùng lúc ở `src/nhom.mjs` và thẻ của trang chủ mới (ghi vào mục Đợt 2 của kế hoạch).
- **Link tới issue của repo cũ** (mục 6, điểm 6): ghi vào `AGENTS.md` (mục "Chuyển trang từ site cũ") để lô của trang đổi sang repo mới.

File đã sửa:

| File | Sửa gì |
|---|---|
| `plans/ben-vung/kiem_ke.py`, `kiem-ke.md` | Ba trang thêm vào Tham chiếu có hạn, kèm ngày rà lại; hai trang thành Lõi; nhóm của `nhac-cu/` ở bảng Lõi là "Nhạc cổ điển nền tảng"; sinh lại bảng |
| `plans/lam-lai/anh_xa.py`, `anh-xa.md` | D5-L1 bỏ trang `lich-su/` tham chiếu; D5-L3 bỏ trang tham chiếu, thêm `nhac-cu/dan-nhac`; D8-L2 bỏ trang đã có lô; sinh lại bảng: đợt 5 có 27 trang, đợt 8 có 20 trang |
| `src/data/trang.yml` | Tầng của 5 trang; ngày rà lại và lý do của 3 trang mới vào Tham chiếu có hạn; ngày của `tai-nguyen` |
| `src/nhom.mjs` | Trang `nhac-cu/` tầng Lõi thuộc nhóm Nhạc cổ điển (như `nhom_menu()` của `anh_xa.py`) |
| `plans/lam-lai/README.md`, `so-do.md`, `plans/ben-vung/README.md` | Mục Quyết định; số trang theo tầng và theo đợt; ghi chú cho D2-L1 và D8-L1 |

Kiểm thử: `npm run build`, `npm test` đạt (82 kiểm thử, 80 đạt, 2 bỏ qua). Kiểm thử giao diện so nhóm menu của 233 trang với `anh-xa.md` mới: khớp. Kiểm thử phạm vi đọc đủ 31 lô và 233 trang.

## Phân tích của người soát

Soát 233 trang của site cũ (`../opus-zero/docs/`, commit `5d08189`) theo hai tiêu chí chủ repo chốt ngày 24/10/2026. Không sửa file nào ở `opus` hay `opus-zero`. Mọi câu trích là nguyên văn site cũ, ghi dạng `trang:dòng`; từng dòng đã được máy đối chiếu với file.

### Cách làm và hai quy ước

**Cách làm.**

- Quét cả 233 trang bằng mẫu từ khóa theo năm loại (giá; ứng dụng, phần mềm, dịch vụ; thiết bị; link bản thu; sự kiện, cuộc thi, kỳ thi theo năm), rồi đọc các dòng khớp. Quét số tiền (triệu, nghìn, đồng, VND, USD, $, €, £): không trang nào ghi giá cụ thể.
- Tôi đọc toàn văn: 5 trang `lich-su/` ngoại vi; 9 trang `nhac-cu/`; `nhan-dien/{index, luyen-nghe, nghe-mu}`; `lich-su/index`; `bat-dau/{lo-trinh-nghe, index, sach-in, hoi-dap, ung-dung}`; `tai-nguyen`; `tai-lieu-tham-khao`; `piano/{thay-va-thi, chon-dan}`; `luyen-tap/{ket-noi-midi, du-lieu}`. Với `piano/tac-pham-theo-cap` và `piano/nghe-si`: mục lục và các dòng mau cũ.
- Năm agent con được giao đọc toàn văn (công cụ Read) 123 trang còn lại (nhạc lý, piano, hình thức, lịch sử, luyện tai, bắt đầu, công cụ, blog, Cập nhật, trang chủ) và báo từng câu mau cũ. Tôi đối chiếu cả 118 câu trích của họ với file: đúng nguyên văn hết. Câu nào không thuộc loại đang tìm thì bỏ (ví dụ "Nghe Mozart Giao hưởng số 40", chuẩn La = 440 Hz, năm sinh của nhà soạn nhạc còn sống). Không agent nào thấy trang mà phần lớn là thông tin mau cũ.
- 79 trang Tác phẩm: quét bằng mẫu từ khóa và đọc các dòng khớp, không đọc toàn văn.
- Dựng đồ thị link của 233 trang (3.149 link) để biết trang nào trỏ tới trang nào, ở dòng nào.
- Chạy thử đề xuất trên bản sao của `kiem_ke.py`, `anh_xa.py`, `src/nhom.mjs` ở thư mục tạm, để biết lô mới và chỗ script hỏng. Chưa chạy `npm test`.

**Phần chính hay chi tiết lẻ (điểm 1).** Trang vào Tham chiếu có hạn khi thông tin mau cũ là chức năng chính của trang hoặc chiếm quá nửa số mục nội dung. Một câu hay một link thì là chi tiết lẻ: giữ tầng, ghi câu để lô xử lý (mục 4).

**Bước trên lộ trình (điểm 2).** Trang được lộ trình nêu thành một việc phải làm: một dòng `- [ ]` hay một hàng bảng kế hoạch trong phần chính (`bat-dau/lo-trinh-nghe` Tháng 1–6 và bảng nhánh nhạc lý, `bat-dau/lo-trinh-choi`, `piano/lo-trinh`). Mục "Sau 6 tháng: đi sâu hơn" (`bat-dau/lo-trinh-nghe.md:52`) tôi tính là mở rộng, không phải bước phải học; link kiểu "xem thêm" trong bài học cũng không tính. Nếu chủ repo muốn tính cả mục "đi sâu hơn", thêm đúng một trang cần chuyển: `lich-su/nhac-truyen-thong-viet-nam` (mục 2).

**Khi hai tiêu chí cùng đúng** (`lich-su/duong-dai`, `lich-su/viet-nam`) tôi chọn tiêu chí 1, vì chủ repo viết "phải". Link từ lộ trình vẫn giữ: trang tham chiếu không có dòng "ngoài lộ trình". Không tách trang thành hai, vì kế hoạch cấm thêm trang ngoài kế hoạch cho đến hết đợt 6.

### 1. Đề xuất đổi tầng (5 trang)

| Trang | Tầng: nay → đề xuất | Rà lại | Lý do | Bằng chứng (site cũ, `trang:dòng`) | Lô: nay → mới |
|---|---|---|---|---|---|
| `lich-su/opera` | Ngoại vi → **Lõi** | không | Lộ trình nghe hiểu giao đúng trang này làm việc đọc của Tháng 5; `nhac-cu-khac` và `nghe-gi-tiep` dẫn tới để học về giọng hát. | `bat-dau/lo-trinh-nghe.md:41` «## Tháng 5: Giọng hát và sân khấu»<br>`bat-dau/lo-trinh-nghe.md:43` «- [ ] Đọc [Nhập môn opera](../lich-su/opera.md).»<br>`nhac-cu/nhac-cu-khac.md:14` «Các loại giọng (soprano, mezzo, alto, tenor, baritone, bass) được giới thiệu ở [Nhập môn opera]»<br>`nghe-nhac/nghe-gi-tiep.md:38` «**Giọng hát:** Xem [Nhập môn opera]» | D8-L3 → **D5-L1** (9 → 10 trang). Không phải sửa riêng: `anh_xa.py` tự xếp trang `lich-su/` không ngoại vi vào D5-L1. |
| `nhac-cu/dan-nhac` | Ngoại vi → **Lõi** | không | Việc đọc của Tháng 3; trang mục Nhận diện trỏ tới như nơi học yếu tố "biên chế"; 8 trang ngoài `nhac-cu/` trỏ tới. | `bat-dau/lo-trinh-nghe.md:30` «## Tháng 3: Dàn nhạc và màu sắc»<br>`bat-dau/lo-trinh-nghe.md:32` «- [ ] Đọc [Dàn nhạc giao hưởng](../nhac-cu/dan-nhac.md), nghe *Peter và chó sói* và Britten *Young Person's Guide*.»<br>`nhan-dien/index.md:17` cột "Học ở đâu" của yếu tố "**1. Biên chế**": «[Dàn nhạc](../nhac-cu/dan-nhac.md), [Nhạc cụ khác](../nhac-cu/nhac-cu-khac.md)»<br>`nhac-cu/dan-nhac.md:3` «Nhận ra từng nhạc cụ khi nghe là bước lớn để nghe giao hưởng có chủ đích.» | D8-L2 → D8-L2: script xếp mọi trang `nhac-cu/` vào D8-L2, không phải sửa. Tùy chọn D5-L3 (mục 6). **Phải sửa `src/nhom.mjs`** (mục 6). |
| `lich-su/duong-dai` | Ngoại vi → **Tham chiếu có hạn** | **2027-06** | Trang tự nhận là chỗ "theo dõi phần đang sống": ba mục tin, nguồn theo dõi, cuộc thi chiếm 47% số chữ (79% nếu tính bảng nhà soạn nhạc còn sống). Giải Pulitzer công bố tháng 5 nên rà sau đó. Lộ trình cũng dẫn tới trang này: chọn tiêu chí 1, giữ link. | `lich-su/duong-dai.md:3` «Trang này là điểm khởi đầu để theo dõi phần "đang sống" của truyền thống này.»<br>`:5` «*Cập nhật lần cuối: 10/2026. Hãy bổ sung khi bạn khám phá thêm.*»<br>`:24` «**Cuộc thi Piano Quốc tế Chopin lần thứ 19** (Warsaw, tháng 10/2025)»<br>`:25` «**Giải Pulitzer Âm nhạc** (trao cho tác phẩm của nhà soạn nhạc Mỹ): 2024 – Tyshawn Sorey»<br>`:38` «xem hòa nhạc trực tuyến (có phí, có buổi miễn phí)»<br>`cap-nhat.md:181` «cập nhật tin đáng chú ý (cuộc thi lớn, giải Pulitzer Âm nhạc công bố tháng 5, nhà soạn nhạc qua đời)»<br>Lộ trình: `bat-dau/lo-trinh-nghe.md:48` «Đọc [Lịch sử](../lich-su/index.md), [dòng thời gian](../lich-su/dong-thoi-gian.md), [Âm nhạc hôm nay](../lich-su/duong-dai.md).» | D8-L3 → **D8-L1** (D8-L1: 7 → 10 sau cả ba trang chuyển vào). **Phải sửa `anh_xa.py` dòng 115**: không sửa thì script dừng với `AssertionError: ('lich-su/duong-dai', (5, 'L1'))`. |
| `lich-su/viet-nam` | Ngoại vi → **Tham chiếu có hạn** | **2027-04** | Trang tự dặn thông tin đổi thường xuyên; 5 trên 7 mục nội dung là đơn vị, nhà hát, lịch diễn, giá vé (58% số chữ, không tính mục Nguồn). Site cũ rà trang này mỗi quý. Lộ trình cũng dẫn tới trang: chọn tiêu chí 1, giữ link. | `lich-su/viet-nam.md:5` «*Cập nhật lần cuối: 10/2026. Thông tin về các đơn vị và lịch diễn thay đổi thường xuyên; hãy kiểm tra trang chính thức trước khi đi.*»<br>Năm mục: `## Đào tạo` (7-15), `## Dàn nhạc và đơn vị biểu diễn` (17-23), `## Nhà hát` (25-29), `## Nhạc sĩ đương đại trong nước` (57-66), `## Đi xem hòa nhạc` (68-72)<br>`:63` «hiện là Trưởng phòng Tổ chức biểu diễn của HBSO»<br>`:71` «**Giá vé** thay đổi rất nhiều»<br>`cap-nhat.md:182` «dàn nhạc, nhà hát, sự kiện mới.»<br>Lộ trình: `bat-dau/lo-trinh-nghe.md:50` «Đi xem một buổi hòa nhạc trực tiếp. Xem [nhạc cổ điển ở Việt Nam](../lich-su/viet-nam.md).» | D8-L3 → **D8-L1**. **Phải sửa `anh_xa.py` dòng 115** (như trên). |
| `nhan-dien/nghe-mu` | Lõi → **Tham chiếu có hạn** | **2027-10** | Phần chính là bản thu và dịch vụ nghe (69% số chữ). Mười bản thu phát thẳng từ Wikimedia; 7 trong 10 không có trong `ban_thu` của `src/data/tac-pham.yml`; kiểm bản thu hằng tuần của site cũ chỉ xét `data-rec` của trang tác phẩm, không xét danh sách này. | `nhan-dien/nghe-mu.md:3` «một bộ 10 bản thu thật để luyện»<br>`:14` «Bản thu được phát trực tiếp từ máy chủ Wikimedia, cần có mạng. Nếu một bản không phát được, bấm "Bản khác".»<br>`:35-47` danh sách 10 link `commons.wikimedia.org/wiki/File:…`<br>`:20` «**Radio nhạc cổ điển** (BBC Radio 3 trực tuyến, hoặc các kênh nhạc cổ điển trên ứng dụng nghe nhạc)»<br>`:21` «(ví dụ "Classical Essentials")»<br>`../opus-zero/docs/assets/js/recognition.js`: 10 URL `upload.wikimedia.org/…`<br>`../opus-zero/tools/audio/check_audio.py:1` «Kiểm tra bản thu của site: file lưu trên site, NGUON.txt và mọi khối data-rec.» | D5-L3 → **D8-L1** (D5-L3: 7 → 6). **Phải sửa `anh_xa.py` dòng 117.** Thành phần `oz-blind` (chỉ trang này dùng) làm ở D8-L1; phần còn lại của `recognition.js` vẫn cần ở D3-L6 và D5-L3 (`luyen-tai/nghe-tien-trinh`, `nhan-dien/luyen-nghe`). Phương án khác: giữ Lõi, đưa 10 URL vào dữ liệu có kiểm link như `ban_thu`, bỏ `:20-21`. |

### 2. Điểm 2: lộ trình dẫn tới 13 trang Ngoại vi thế nào

| Trang | Lộ trình, trang bắt đầu dẫn tới | Bài nhạc lý, piano dẫn tới | Kết luận |
|---|---|---|---|
| `lich-su/opera` | Tháng 5, `bat-dau/lo-trinh-nghe.md:43` (xem mục 1) | không | **Lõi** |
| `nhac-cu/dan-nhac` | Tháng 3, `bat-dau/lo-trinh-nghe.md:32` (xem mục 1) | Không có bài nhạc lý hay piano. Tám trang ngoài `nhac-cu/` trỏ tới: `bat-dau/lo-trinh-nghe.md:32`, `hinh-thuc/fugue.md:49`, `lich-su/thoi-ky/the-ky-20.md:61`, `nghe-nhac/dvorak-9-largo.md:41`, `nghe-nhac/ravel-bolero.md:62`, `nhan-dien/index.md:17`, `nhan-dien/the-loai.md:71`, `tai-nguyen.md:37` | **Lõi** |
| `lich-su/duong-dai` | Tháng 6, `bat-dau/lo-trinh-nghe.md:48` | `piano/nha-soan-nhac.md:275` «Các nhà soạn nhạc đương đại khác: xem [Âm nhạc hôm nay]»; `piano/nghe-si.md:100` | Tham chiếu (điểm 1) |
| `lich-su/viet-nam` | Tháng 6, `bat-dau/lo-trinh-nghe.md:50`; `bat-dau/hoi-dap.md:72` | `piano/nghe-si.md:88` «Đọc thêm ở [Nhạc cổ điển ở Việt Nam]» | Tham chiếu (điểm 1) |
| `lich-su/nhac-truyen-thong-viet-nam` | Chỉ ở mục "Sau 6 tháng: đi sâu hơn": `bat-dau/lo-trinh-nghe.md:60` «- [ ] Đọc [Âm học cơ bản](../nhac-ly/am-hoc.md) và [Nhạc truyền thống Việt Nam và nhạc cổ điển]» | `nhac-ly/28-ket-cau.md:83` «xem [trang này]» (ví dụ phụ); `luyen-tai/choi-bang-tai.md:31`. Bài 16 tự đủ: có mục riêng «## Kết nối với âm nhạc Việt Nam» (`nhac-ly/16-dieu-thuc-ngu-cung.md:64`) và không trỏ sang trang này | Giữ Ngoại vi |
| `lich-su/nu-nha-soan-nhac` | không | `piano/nha-soan-nhac.md:139` «- **Cuộc đời và các tác phẩm khác:** [Các nhà soạn nhạc nữ]» | Giữ |
| `nhac-cu/violin`, `cello`, `sao` | không | `piano/choi-cung-nguoi-khac.md:163` «Xem thêm [violin](../nhac-cu/violin.md), [cello](../nhac-cu/cello.md), [sáo](../nhac-cu/sao.md).» | Giữ |
| `nhac-cu/clarinet` | không | `nghe-nhac/gershwin-rhapsody.md:16` (nhắc trong lời văn) | Giữ |
| `nhac-cu/guitar`, `trumpet` | không | không | Giữ |
| `nhac-cu/nhac-cu-khac` | không; cách hai bước: `nhan-dien/index.md:17` (cột "Học ở đâu"), mà mục Nhận diện nằm trong phần "Sau 6 tháng: đi sâu hơn" (`bat-dau/lo-trinh-nghe.md:52`, `:58`) | `piano/lich-su-dan.md:13` «Xem [các nhạc cụ khác]» | Giữ (sát ranh giới) |

`nhac-cu/index` hiện là Khung (nhóm Đọc thêm). Chỉ blog, Cập nhật và các trang con trỏ tới; `nhac-cu/index.md:3` tự ghi «Các trang trong mục này thuộc phần **nghe**». Giữ nguyên.

### 3. Trang Lõi và Khung sát ranh giới: giữ

Không đề xuất hạ trang Lõi nào xuống Đọc thêm.

| Trang | Bằng chứng cần trên lộ trình hay trong bài | Kết luận |
|---|---|---|
| `lich-su/dong-thoi-gian` | `bat-dau/lo-trinh-nghe.md:48` (Tháng 6) | Lõi |
| `lich-su/index`, `lich-su/thoi-ky/*` (6) | `bat-dau/lo-trinh-nghe.md:48,54`; `baroque`, `co-dien`, `lang-man` được 6, 8, 9 bài học tác phẩm trỏ tới | Lõi |
| `lich-su/nha-soan-nhac` | Lộ trình không nêu, nhưng `piano/index.md:123` «[chân dung nhà soạn nhạc](../lich-su/nha-soan-nhac.md)» và 20 mục của `piano/nha-soan-nhac.md` (ví dụ `:56`) đều trỏ tới | Lõi |
| `hinh-thuc/*` (9) | `bat-dau/lo-trinh-nghe.md:38` «- [ ] Đọc [Hình thức & thể loại]»; `:57` sonata, fugue, biến tấu; `piano/lo-trinh.md:113,136`; `bat-dau/lo-trinh-choi.md:96`. `overture` và `symphonic-poem` yếu nhất: `overture` chỉ có `hinh-thuc/index.md:36` và `hinh-thuc/symphonic-poem.md:42` trỏ tới; `symphonic-poem` chỉ có `hinh-thuc/index.md:39` và hai hướng dẫn nghe (`nghe-nhac/liszt-liebestraum.md:14`, `nghe-nhac/mussorgsky-tranh.md:15`) | Lõi. Hai trang ấy là ứng viên đầu tiên nếu sau này muốn Lõi gọn hơn; tôi không đề xuất hạ |
| `nhan-dien/*` (trừ `nghe-mu`) | `bat-dau/lo-trinh-nghe.md:58` (trong phần "Sau 6 tháng: đi sâu hơn") | Lõi |
| `nhac-ly/27`, `nhac-ly/32` | `piano/lo-trinh.md:159` «[Bài 27](../nhac-ly/27-ky-hieu-hop-am.md) đến [bài 32](../nhac-ly/32-ky-thuat-the-ky-20.md)» (chặng 6) | Lõi |
| `nhac-ly/20`, `nhac-ly/am-hoc` | `bat-dau/lo-trinh-nghe.md:72`, `:60`, `:73` | Lõi |
| `piano/lich-su-dan`, `the-loai`, `nha-soan-nhac`, `choi-cung-nguoi-khac` | `piano/lo-trinh.md:183`; `bat-dau/lo-trinh-nghe.md:56` và `index.md:38`; `piano/index.md:104`; `piano/lo-trinh.md:112,140,181` | Lõi |
| `tai-lieu-tham-khao` | `piano/lo-trinh.md:203`; 169 trang trỏ tới | Lõi |

### 4. Giữ tầng, có chi tiết mau cũ

Các câu dưới đây là chi tiết lẻ: một câu, một dòng bảng hay một mục ngắn. Trang giữ tầng; lô của trang viết lại hay tách theo gợi ý. Xếp theo lô.

| Trang (tầng, lô) | Câu trích (`dòng`) | Gợi ý cho lô |
|---|---|---|
| `bat-dau/lo-trinh-nghe` (Lõi, D2-L1) | `:14` «YouTube là đủ để bắt đầu; các dịch vụ chuyên nhạc cổ điển có ở [Tài nguyên]» | Giữ câu trỏ sang Tài nguyên, bỏ tên YouTube. |
| `nhac-ly/20-doc-tong-pho` (Lõi, D3-L3) | Mục «## Tìm tổng phổ ở đâu?» (`:46-50`): `:48` «**[IMSLP](https://imslp.org/)**: tổng phổ miễn phí»; `:49` «**Video "score"** trên YouTube»; `:50` «Bärenreiter, Henle, Eulenburg». Cùng mẹo "score" ở `nghe-nhac/index.md:14` và `hinh-thuc/fugue.md:42` | Rút còn IMSLP; YouTube và nhà xuất bản trỏ sang Tài nguyên. |
| `luyen-tai/index` (Khung, D3-L6) | Mục «## Công cụ khác» (`:44-49`): `:46` «luyện quãng, hợp âm, gam; miễn phí.»; `:48` «có bản miễn phí giới hạn.»; `:49` «Ứng dụng điện thoại: *Functional Ear Trainer*, *Complete Musician*, *Tenuto*.» | Lặp lại `tai-nguyen.md:26-28`: thay bằng một link sang Tài nguyên. |
| `piano/hoc-thuoc-bieu-dien` (Lõi, D4-L3) | `:7` «Trong kỳ thi ABRSM, chơi thuộc các tác phẩm là tùy chọn và không được cộng điểm trực tiếp»; `:226` «ABRSM, *Practical Music Grades: Piano Syllabus 2025 & 2026*» | Quy định thi gắn với chương trình theo năm; lặp ở `piano/thay-va-thi.md:111`. Viết "theo chương trình ABRSM hiện hành" và trỏ sang trang Thầy và thi. (`piano/gam.md:220` đã viết an toàn: «Nếu định thi, hãy tra chương trình hiện hành.») |
| `piano/thi-tau` (Lõi, D4-L3) | `:182` «Sight Reading Factory (trả phí)»; `:181` «Đề mẫu thị tấu của ABRSM và Trinity» | Hai dòng của bảng "Tài liệu theo trình độ". Bỏ chữ "(trả phí)" hay trỏ sang Tài nguyên. |
| `piano/suc-khoe` (Lõi, D4-L3) | `:79` «Hiện chúng còn ít, đắt và thường phải chờ lâu.»; `:125` «**BAPAM** (British Association for Performing Arts Medicine) là tổ chức từ thiện khám miễn phí» | Ghi "tính đến 2026" hay bỏ "đắt và thường phải chờ lâu"; bỏ chữ "miễn phí". |
| `piano/nha-soan-nhac` (Lõi, D4-L3) | Mục «## Hôm nay» (`:267-275`, nhà soạn nhạc còn sống); `:271` «**György Kurtág** (sinh 1926, tròn 100 tuổi năm 2026)» và «nay đã mười tập» | Bỏ «tròn 100 tuổi năm 2026» và «nay đã mười tập», hay ghi năm. |
| `lich-su/dong-thoi-gian` (Lõi, D5-L1) | `:44` «Nhà hát Hồ Gươm khai trương ở Hà Nội» (2023); `:45` «Cuộc thi Chopin lần thứ 19; Eric Lu đoạt giải Nhất» (2025) | Bảng dừng ở 2025 và sẽ cũ dần. Bỏ hai mốc (cùng sự kiện đã nằm ở `viet-nam` và `duong-dai`) hay ghi "đến 2025". |
| `lich-su/opera` (Lõi sau khi chuyển, D5-L1) | `:61` «các dịch vụ trả phí như *Met Opera on Demand*»; `:63` «chương trình kỷ niệm 3 năm của Nhà hát Hồ Gươm (năm 2026) có ba ca sĩ opera quốc tế»; `:85` «**tenor Ninh Đức Hoàng Long**»; `:87` «được vinh danh "Tinh hoa sân khấu" tại giải Tinh hoa Việt 2025»; `:89` «theo dõi lịch diễn của VNOB và HBSO nếu muốn xem opera trực tiếp» | Trang vào Lõi: bỏ `:61`, `:63`, `:89` (trỏ sang `viet-nam` và Tài nguyên); giữ `:85`, `:87` như sự việc đã xảy ra, có năm. |
| `tai-lieu-tham-khao` (Lõi, D5-L3) | 41% số chữ là ba mục Âm thanh, Phần mềm, Giấy phép của chính site: `:55` «khung và giao diện của site»; `:60` «"Opus Zero, https://mtuann.github.io/opus-zero/, CC BY-SA 4.0"»; `:49` «Mười ba bản thu từ IMSLP, dùng cho mười bài học». Thêm `:41` «tin tức, giải thưởng, lịch diễn» | Viết lại theo site mới (Astro và Starlight, tên Opus, địa chỉ `/opus/`, số bản thu lấy từ dữ liệu). Không mau cũ theo thời gian nên không đổi tầng. |
| `luyen-tap/ket-noi-midi` (Khung, D7-L1) | `:10` «Safari và mọi trình duyệt trên iPhone, iPad **chưa hỗ trợ** MIDI trên web.» | Lặp ở `bat-dau/hoi-dap.md:83`; đổi theo phiên bản trình duyệt. Để công cụ tự báo (phát hiện tính năng) hay ghi ngày, và chỉ ở một chỗ. |
| `bat-dau/sach-in` (Khung, D7-L3) | `:26` «iPhone (Safari) chọn Chia sẻ → In, rồi đặt hai ngón tay lên trang xem trước và kéo giãn ra» | Hướng dẫn theo giao diện từng phiên bản: giữ ngắn hay bỏ. |
| `cap-nhat` (Khung, D7-L3) | Mục «## Quy trình giữ nội dung luôn đúng» (`:170-188`); `:183` «giáo trình piano ABRSM 2027–2028 dùng được từ 1/1/2027» | Thay danh sách rà theo quý bằng `ra_lai` của `trang.yml` (đúng với đợt 8). |
| `lich-su/nhac-truyen-thong-viet-nam` (Ngoại vi, D8-L3) | `:5` «*Cập nhật lần cuối: 10/2026.*»; `:52` «Tính đến cuối năm 2025, Việt Nam có 17 di sản»; `:77` «**chèo chưa được UNESCO ghi danh**»; `:89` «Tuồng đến nay vẫn **chưa được UNESCO ghi danh**.»; `:101` «**cải lương và vọng cổ đến nay vẫn chưa được UNESCO ghi danh**»; `:113` «Tìm trên YouTube hoặc ứng dụng nghe nhạc theo các từ khóa» | Gom bốn câu về UNESCO vào một đoạn có ngày "đến cuối 2025"; bỏ dòng "Cập nhật lần cuối" của cả trang. |
| `lich-su/nu-nha-soan-nhac` (Ngoại vi, D8-L3) | `:49` «**Gabriela Lena Frank**, Mỹ, giải Pulitzer Âm nhạc 2026» | Trùng `duong-dai.md:25`: chỉ giữ ở một trang. |
| `nhac-cu/*` (D8-L2) | Chỉ có lời định tính về giá, không có số: `cello.md:36` «cello tốt không rẻ»; `sao.md:36` «Sáo học sinh tốt không quá đắt»; `clarinet.md:41` «nhạc cụ học sinh giá vừa phải»; `trumpet.md:37` «Kèn học sinh giá vừa phải». Giáo trình: `violin.md:32` «*Suzuki Violin School*»; `guitar.md:23` «Frederick Noad *Solo Guitar Playing*». Mục "Nghệ sĩ nên tìm" (người còn sống): `violin.md:28`, `cello.md:32` | Giữ nguyên. |

Trang Tác phẩm: không trang nào vượt mức chi tiết lẻ. Link bản thu của chúng nằm trong `data-rec` (sẽ là `ban_thu`). Ngoài ra chỉ có `nghe-nhac/doc-ten-tac-pham.md:87-88` (BBC Radio 3 *Building a Library*, Gramophone), lặp lại `tai-nguyen.md:41-43`: lô D6-L7 trỏ sang Tài nguyên.

Link Nguồn tới Open Music Theory (52 trang), musictheory.net (37 trang), IMSLP (110 trang), Wikipedia: ổn định, để kiểm link ngoài hằng tuần lo; không cần đổi tầng.

### 5. Ngày rà lại của bảy trang tham chiếu

| Trang | Ngày nay | Kết luận | Lý do, bằng chứng |
|---|---|---|---|
| `piano/thay-va-thi` | 2027-01 | Giữ | `:110` «chương trình piano **2027–2028** dùng được từ **1/1/2027**; chương trình **2025–2026** vẫn có hiệu lực đến hết **31/12/2027**»; `:130` «Địa điểm và lịch thi thay đổi theo từng năm.» Link abrsm.org bị loại khỏi kiểm link tự động của site cũ (`../opus-zero/.github/workflows/link-check.yml`, `--exclude "^https://www\.abrsm\.org/"`), nên chỉ ngày rà giữ cho trang đúng. Sau lần rà này đặt ngày kế tiếp 2028-01, khi chương trình 2025–2026 hết hạn. |
| `piano/tac-pham-theo-cap` | 2027-01 | Giữ | `:291` «(chương trình 2025–2026)»; `:371` «Chương trình piano 2027–2028 của ABRSM dùng được từ 1/1/2027.» Khoảng 39% số dòng (216–368) là mục bài phổ biến ngoài cổ điển, có link bán bản nhạc và kênh YouTube (`:289`, `:332`). |
| `piano/chon-dan` | 2027-10 | Giữ | Không có giá hay hãng cụ thể (`:68` «Đừng mua đàn rẻ nhất»). Thông số đổi chậm: `:24` «**128 trở lên**», `:27` «**USB-MIDI** (cổng "USB to Host") hoặc Bluetooth MIDI»; lời khuyên bảo dưỡng `:93,95` dựa trên Yamaha. 12 tháng đủ. |
| `piano/nghe-si` | 2027-10 | Giữ | Bảng cuộc thi ghi chu kỳ và lần gần nhất: `:95` Tchaikovsky «4 năm một lần … Sergei Davydchenko (2023)», `:96` Leeds «3 năm một lần … Jaeden Izik-Dzurko (2024)». Theo chu kỳ ấy cả hai có kỳ mới trong 2027; trang không ghi tháng tổ chức, phải tra khi rà. 2027-10 nằm sau hai kỳ này nếu cả hai kết thúc trước tháng 10. `:95` còn câu về WFIMC «Từ tháng 4/2022 … loại cuộc thi khỏi danh sách thành viên». |
| `bat-dau/hoi-dap` | 2027-04 | Giữ | `:25` «Simply Piano, Flowkey … Synthesia»; `:23` «Musicnotes»; `:83` Web MIDI «Chrome, Edge hoặc Opera … Safari và mọi trình duyệt trên iPhone, iPad chưa hỗ trợ». Bốn trong 24 câu hỏi (`:22`, `:25`, `:79`, `:82`); ứng dụng và trình duyệt đổi vài lần một năm. Theo tiêu chí "quá nửa" trang này sát ranh giới; giữ Tham chiếu như bảng đã duyệt. |
| `bat-dau/ung-dung` | 2027-04 | Giữ | Cả trang là tên menu của trình duyệt (`:5`, `:11`, `:17`) và `:19` «Cài đặt Opus Zero» (tên site đổi). Phụ thuộc service worker của đợt 7: rà sau khi đợt 7 chạy thật. |
| `tai-nguyen` | 2027-04 | Giữ, kèm điều kiện | Link được kiểm tự động hằng tuần ở site cũ, nên 6 tháng đủ cho nội dung. Nhưng `:9` và `:11` ghi chương trình ABRSM theo năm. Ngày ABRSM hiện ở bốn trang (`thay-va-thi.md:110`, `tac-pham-theo-cap.md:371`, `tai-nguyen.md:9`, `cap-nhat.md:183`): giữ ở `thay-va-thi`, ba trang kia trỏ sang. Không làm vậy thì đổi ngày của `tai-nguyen` thành 2027-01. |

Link `abrsm.org` ở 5 trang Lõi đều là trang chủ trong mục Nguồn (`piano/lo-trinh.md:199`, `piano/thi-tau.md:224`, `piano/nha-soan-nhac.md:308`, `piano/hoc-thuoc-bieu-dien.md:226`, `tai-lieu-tham-khao.md:27`): ổn định, không cần ngày rà.

Điều kiện chung: ngày rà phải sau ngày khóa của D8-L1. Ngày gắn với sự kiện (ABRSM 1/1/2027, Pulitzer tháng 5) thì giữ nguyên. Ngày chỉ là 6 hay 12 tháng thì tính lại từ ngày khóa. Nếu D8-L1 khóa sau 1/1/2027, trang ABRSM được kiểm định thẳng theo chương trình 2027–2028 (`plans/lam-lai/README.md:155`) và ngày rà đặt 2028-01.

### 6. Việc kèm theo (đề xuất của người soát)

Đã chạy thử trên bản sao ở thư mục tạm; repo không bị đụng. Bản chưa sửa của `kiem_ke.py` và `anh_xa.py` tái tạo đúng `anh-xa.md` hiện có.

1. **`src/data/trang.yml`** (5 mục):

   ```yaml
   - id: lich-su/opera
     tang: loi
   - id: nhac-cu/dan-nhac
     tang: loi
   - id: lich-su/duong-dai
     tang: tham-chieu
     ra_lai: 2027-06
     ly_do_ra_lai: giải Pulitzer Âm nhạc công bố tháng 5; tin và cuộc thi
   - id: lich-su/viet-nam
     tang: tham-chieu
     ra_lai: 2027-04
     ly_do_ra_lai: đơn vị, nhà hát và lịch diễn trong nước
   - id: nhan-dien/nghe-mu
     tang: tham-chieu
     ra_lai: 2027-10
     ly_do_ra_lai: 10 bản thu phát từ Wikimedia Commons; gợi ý radio và danh sách phát
   ```

2. **`plans/ben-vung/kiem_ke.py`**: `THAM_CHIEU` thêm ba trang với ngày ở trên; `NGOAI_VI` bỏ `lich-su/opera`, `lich-su/viet-nam`, `lich-su/duong-dai`; trong `tang()`, trước dòng `if k in NGOAI_VI or muc == "nhac-cu":` thêm ngoại lệ Lõi cho `nhac-cu/dan-nhac`; `nhom_loi()` thêm `"nhac-cu": "Nhạc cổ điển nền tảng"` (không thì bảng Lõi xếp `dan-nhac` vào "Tài liệu tham khảo"). Chạy lại để sinh `kiem-ke.md`. Kết quả thử: Lõi 101 trang (132.249 chữ), Tác phẩm 79, Tham chiếu có hạn 10 (23.541), Khung 34, Ngoại vi 9 (6.643); cộng 233.

3. **`plans/lam-lai/anh_xa.py`**:
   - Dòng 115, bắt buộc (cho `duong-dai`, `viet-nam`): đổi điều kiện thành `tang[k] not in ("ngoai-vi", "tham-chieu")`.
   - Dòng 117, bắt buộc (cho `nghe-mu`): thêm điều kiện `and tang[k] != "tham-chieu"` vào danh sách `nhan-dien/`.
   - Tùy chọn, cho `dan-nhac`: thêm `"nhac-cu/dan-nhac"` vào danh sách D5-L3 (dòng 117) và đổi dòng 136 thành `... k.startswith("nhac-cu/") and k not in gan`. Khi đó đợt 5 có 27 trang, đợt 8 có 20 trang, và "đủ Lõi sau đợt 5" vẫn đúng. Tôi nghiêng về cách này. Không chọn thì `dan-nhac` ở D8-L2 và là trang Lõi duy nhất ở đợt 8.
   - Không trang nào trong năm trang nằm trong danh sách tên riêng của D2-L1 hay `PIANO_LO`; hai dòng trên là chỗ duy nhất phải sửa vì tầng.
   - Rồi sinh lại `anh-xa.md`. Kết quả thử (không chọn tùy chọn): đợt 5 vẫn 26 trang, đợt 8 vẫn 21 trang; D5-L1 10, D5-L3 6, D8-L1 10, D8-L2 9, D8-L3 2.

4. **`src/nhom.mjs`**:
   - Dòng 59: `nhomCuaTrang` xếp mọi trang `nhac-cu/` vào Đọc thêm. Với `anh-xa.md` mới (`dan-nhac` là Lõi, nhóm "Nhạc cổ điển"), `tests/giao-dien.test.mjs:40` sẽ báo lệch 1 dòng. Tôi chạy hàm bằng Node trên bản hiện tại với 233 dòng của `anh-xa.md` mới: lệch đúng `nhac-cu/dan-nhac`. Sửa hai dòng 59–60:

     ```js
     if (!ma && (tang === 'ngoai-vi' || (thuoc('nhac-cu') && tang !== 'loi'))) ma = 'doc-them';
     if (!ma && (CO_DIEN.some(thuoc) || thuoc('nhac-cu'))) ma = 'co-dien';
     ```

     Thử trên bản sao: 233 dòng, 0 lệch; các ví dụ ở `tests/giao-dien.test.mjs:54-63` vẫn đúng.
   - Dòng 30: mô tả nhóm Đọc thêm ghi «Nhạc cụ, opera, nhạc Việt Nam»; opera sẽ ở nhóm Nhạc cổ điển nên bỏ "opera". Thẻ cùng chữ ở `src/content/docs/index.md:32`; `tests/giao-dien.test.mjs:99-102` so hai nơi, nên sửa cả hai cùng lúc.

5. **Chỗ ghi con số tầng**: `plans/ben-vung/README.md` (bảng "Các tầng": Lõi 100, tham chiếu 7, ngoại vi 13; cột "Gồm"), `plans/lam-lai/README.md:27` («13 trang ngoại vi»), `:49` và `:138` («đủ 100 trang lõi»), `plans/lam-lai/so-do.md:13`, `:57`, `:76`, `:87`. Bản trên Claude Docs mà README nhắc cũng ghi các số này.

6. **Ngoài hai tiêu chí**: bốn trang trỏ tới issue của repo cũ (`tai-lieu-tham-khao.md:3`, `tai-nguyen.md:3`, `bat-dau/hoi-dap.md:3`, `blog/posts/2026-10-23-phien-ban-15.md:55`, đều «https://github.com/mtuann/opus-zero/issues»): sửa khi chuyển, vì repo mới là `mtuann/opus`.

### 7. Kết luận

**5 trang đổi tầng:**

- `lich-su/opera`, `nhac-cu/dan-nhac`: Ngoại vi → Lõi.
- `lich-su/duong-dai`, `lich-su/viet-nam`: Ngoại vi → Tham chiếu có hạn.
- `nhan-dien/nghe-mu`: Lõi → Tham chiếu có hạn.

Bảy trang tham chiếu hiện có: giữ cả bảy ngày rà lại, với hai điều kiện: `tai-nguyen` bỏ ngày ABRSM (hoặc đổi ngày thành 2027-01), và mọi ngày tính từ ngày khóa của D8-L1 (mục 5). Chín trang Ngoại vi còn lại giữ tầng. Không trang Tác phẩm nào cần đổi.

**Số trang mỗi tầng sau khi đổi** (nay → sau):

| Tầng | Nay | Sau |
|---|---|---|
| Lõi | 100 | 101 |
| Tác phẩm | 79 | 79 |
| Khung và công cụ | 34 | 34 |
| Ngoại vi | 13 | 9 |
| Tham chiếu có hạn | 7 | 10 |
| **Cộng** | **233** | **233** |

**Số trang mỗi lô sau khi đổi:** D5-L1 10 (nay 9), D5-L3 6 (nay 7), D8-L1 10 (nay 7), D8-L2 9, D8-L3 2 (nay 5). Đợt 5 vẫn 26 trang, đợt 8 vẫn 21 trang.

**Ba chỗ cần chủ repo quyết:**

1. `nhac-cu/dan-nhac` vào D8-L2 (theo quy tắc hiện hành, không sửa script) hay D5-L3 (sửa hai dòng, giữ "đủ Lõi sau đợt 5"). Tôi nghiêng về D5-L3.
2. `nhan-dien/nghe-mu`: chuyển Tham chiếu, hay giữ Lõi và đưa 10 URL bản thu vào dữ liệu có kiểm link.
3. Mục "Sau 6 tháng: đi sâu hơn" của lộ trình nghe hiểu có tính là bước phải học không. Nếu có, `lich-su/nhac-truyen-thong-viet-nam` chuyển Lõi (D8-L3 → D5-L1, không sửa script).

## Review nhánh quyết định

Claude Code (Claude Sonnet 5.5), ngày 24/10/2026, ở commit `e214a45`

**Đã kiểm** (Node 24.22.1, bản chép của nhánh):

- `npm run build` và `npm test` đạt: 82 kiểm thử, 80 đạt, 2 bỏ qua đúng chỗ (cần `.cache/site-cu/`; nhánh không phải nhánh lô). `npm run build:xem` rồi `npm test` cũng đạt. Kiểm thử mới chạy lặp 15 lần, không chập chờn.
- `python3 plans/ben-vung/kiem_ke.py | diff - plans/ben-vung/kiem-ke.md` và `python3 plans/lam-lai/anh_xa.py | diff - plans/lam-lai/anh-xa.md`: không khác (site cũ ở `5d08189`).
- Tầng, ngày rà lại và lý do của 5 trang đổi, cộng `tai-nguyen`, khớp ở `trang.yml`, `kiem-ke.md`, `anh-xa.md`. Tầng của cả 233 trang giữa ba file cũng khớp (so bằng script ngoài repo).
- `src/nhom.mjs`: đọc mã, hai dòng mới đúng; kiểm thử giao diện so đủ 233 dòng với `anh-xa.md`, khớp. `tests/pham-vi.test.mjs` đã cho D2-L1 sửa `src/nhom.mjs`, nên việc đổi mô tả nhóm Đọc thêm ở D2-L1 không bị chặn.
- `AGENTS.md`: 4 trang có link issue của repo cũ đúng như ghi (`tai-lieu-tham-khao`, `tai-nguyen`, `bat-dau/hoi-dap`, bài blog `2026-10-23-phien-ban-15`).
- Mục 1 của báo cáo: 28 cặp (`trang:dòng`, câu trích) kiểm bằng script, khớp cả 28; các câu viết tắt tên file (như `cello.md:36`) và các câu ở mục 4 (`opera.md:61–89`, `thi-tau.md:181–182`, v.v.) tôi xem tay, đúng. Tỉ lệ chữ gần đúng khi đếm lại theo mục (`viet-nam` 58%, `nghe-mu` khoảng 67%; `duong-dai` tôi đếm 44%, báo cáo ghi 47%).
- `tools/khoa.mjs`: đọc phần mới và chạy 9 kịch bản trên bản chép (trang ít hơn 5 nhận định, hồ sơ không có `tang`, bản ghi dữ liệu, tầng lệch, mẫu có `sai`, `xuat` ba lần, `--mau`). Kết quả ở "Nên sửa" 1 và 2.
- Tài liệu: `grep` số cũ và cụm cũ trong cả repo, trừ báo cáo đợt 1.

### Phải sửa

Cả ba chỉ là chữ và số trong tài liệu, không đụng mã.

1. **`plans/lam-lai/so-do.md` dòng 15, 19, 35 còn số và câu cũ.** Báo cáo (mục 6, điểm 5) chỉ liệt kê dòng 13, 57, 76, 87.
   - Dòng 15: đợt 5 ghi "3 lô, 26 trang"; phải là 27 (`README.md` bảng Tiến độ và `anh-xa.md` ghi 27).
   - Dòng 19: đợt 8 ghi "3 lô, 21 trang"; phải là 20.
   - Dòng 35: "Bạn kiểm khoảng 10 nhận định"; theo quyết định 1 là bạn đọc tóm tắt hồ sơ và xem khoảng 5 nhận định mỗi lô.
   - Thử lại: `grep -n -E "26 trang|21 trang|10 nhận định|khoảng<br/>10" plans/lam-lai/so-do.md` không ra dòng nào.
2. **Phần "Quy tắc xếp tầng" và đầu file của `kiem-ke.md` (sinh từ `plans/ben-vung/kiem_ke.py` dòng 101–104, 122–131) mâu thuẫn với bảng ngay bên dưới.**
   - `kiem-ke.md:24`: Ngoại vi gồm "opera, nhạc Việt Nam, nhạc đương đại". Nay opera là Lõi, `duong-dai` và `viet-nam` là Tham chiếu; Ngoại vi chỉ còn nhạc cụ, nhạc truyền thống Việt Nam, nữ nhà soạn nhạc.
   - `kiem-ke.md:20, 22`: Lõi và Tham chiếu chưa ghi hai quy tắc chủ repo chốt (thông tin mau cũ là phần chính thì vào Tham chiếu; người mới cần trên lộ trình thì vào Lõi). Dòng 22 còn "ngày đề xuất".
   - `kiem-ke.md:3` (và `plans/ben-vung/README.md:10`): "Đây là đề xuất: bạn duyệt tầng…". Bảng đã duyệt ngày 24/10/2026; tầng nay ở `src/data/trang.yml`.
   - Cách làm: sửa chữ trong `kiem_ke.py`, sinh lại `kiem-ke.md`. Thử lại: `python3 plans/ben-vung/kiem_ke.py | diff - plans/ben-vung/kiem-ke.md` rỗng; `python3 plans/lam-lai/anh_xa.py | diff - plans/lam-lai/anh-xa.md` vẫn rỗng.
3. **Câu "còn chờ" sai khi cả năm mục đã `[x]`:** `plans/lam-lai/README.md:32` ("Chờ bạn. Mục 'khuyên dùng'… ba mục sau trước đợt 2") và `plans/ben-vung/README.md:5` ("Mọi quyết định còn chờ ghi ở mục 'Quyết định'"). Bỏ, hay đổi thành "Năm quyết định đã chốt; đổi thì ghi ngày và lý do ở đây". Thử lại: `grep -n -E "Chờ bạn|còn chờ" plans/lam-lai/README.md plans/ben-vung/README.md` không ra dòng nào.

### Nên sửa

Theo mức quan trọng. Từ 1 đến 5 và 8 nên làm luôn trong nhánh này (đợt 2 chạy theo chúng); 6, 7, 9 làm sau cũng được.

1. **`tools/khoa.mjs:103`: tầng lấy từ trường `tang` của hồ sơ, không đối chiếu `src/data/trang.yml`.** Nay trường ấy quyết định có được bỏ lượt 2 hay không (trước chỉ quyết định chuyện hồ sơ trang khung không có nhận định).
   - Thử: tạo hồ sơ khi trang ghi `ngoai-vi`, đổi `trang.yml` sang `loi`, điền `luot_2` cho 5 trên 10 nhận định, chạy `khoa`: khóa được. Trang Lõi chỉ qua nửa lượt 2. Sửa tay `tang:` trong hồ sơ cũng qua.
   - Đổi tầng sau khi tạo hồ sơ chắc sẽ xảy ra (chủ repo đổi được ba chỗ đã chọn).
   - Cách sửa: `loiHoSo` đọc tầng từ `trang.yml` (qua `goc`) và báo lỗi khi khác `hs.tang`; so với `?? null`, vì hồ sơ `404` có `tang: null` và trang không có trong `trang.yml`. Kiểm thử "mọi mục trong `khoa.json` còn khớp" nhờ đó bắt luôn trang đã khóa mà tầng đổi.
   - Hồ sơ không có `tang` thì bị chặt như Lõi: đúng.
2. **`tools/khoa.mjs:118–122` và `chuan-kiem-dinh.md` mục 3: mẫu lượt 2 có `sai` không kéo theo kiểm cả trang.** Thử: 12 nhận định, 5 có lượt 2, một cái `sai` đã ghi cách giải quyết: `loiHoSo` trả `[]`, 7 nhận định còn lại chưa qua lượt 2. Quy tắc mẫu của chính chủ repo là "mẫu sai thì kiểm lại cả lô". Thêm một câu vào mục 3 (mẫu có `sai` hay `khong-chac` thì lượt 2 kiểm nốt cả trang) và một điều kiện vào `loiHoSo`.
3. **Luật "Lõi không giữ chi tiết mau cũ" mới nằm ở báo cáo này (mục 4), không nằm nơi lô đọc.** Quy tắc 1 chỉ xếp tầng. Trang Lõi giữ lại một dòng như "Sight Reading Factory (trả phí)" hay "tròn 100 tuổi năm 2026" thì khóa một lần rồi cũ dần. Mục 4 liệt kê 15 trang (9 Lõi, 4 Khung, 2 Ngoại vi) kèm gợi ý theo lô; ngoài báo cáo này, chỉ `plans/lam-lai/README.md:42` nhắc tới nó, và lời giao việc lô không trỏ tới. Riêng `lich-su/opera`, vừa vào Lõi, có 5 dòng như vậy (`:61`, `:63`, `:85`, `:87`, `:89` của trang cũ; mục 4 đề nghị bỏ ba, giữ hai có ghi năm). Cách sửa: thêm vào `chuan-kiem-dinh.md` (mục 1 hay 3) "trang Lõi và Tác phẩm không ghi giá, ứng dụng, thiết bị, sự kiện theo năm: bỏ, hay trỏ sang trang Tham chiếu; review kiểm"; thêm vào lời giao việc mẫu "Một lô": đọc mục 4 của `bao-cao/d2-bang-tang.md` cho trang của lô.
4. **Câu hứa "sẽ có kiểm link định kỳ" (`README.md:47`) chưa có việc nào đỡ**, mà lý do giữ Tác phẩm ở tầng cũ dựa vào nó. `.github/workflows/` chỉ có `test.yml` và `deploy.yml`. Workflow hằng tuần của site cũ (`link-check.yml`: lychee, và `check_audio.py --static --network`) chỉ được nhắc ở `bao-cao/d1-7.md:79` ("đợt 8 hay đợt 9"). `README.md` không giao việc này cho đợt 8, đợt 9 hay D6-0 (đợt 9 chỉ đòi kiểm tra link đạt một lần trên site thật). Ghi việc này vào đợt 8 (cùng workflow `ra_lai`) hay D6-0.
5. **Hai chỗ của `chuan-kiem-dinh.md`.**
   - Mục 7 "Chỉ trong ba trường hợp" thiếu "đến hạn rà lại" của Tham chiếu, trong khi mục 3 bảo đến hạn thì rà lại, mỗi lần là một lần kiểm định mới (cần `mo`). Thêm trường hợp 4.
   - Mục 2 chỉ xếp sách in vào nguồn phụ. Grove Music Online (cần tài khoản, agent không mở được) có ở 42 trang cũ. Xếp cùng loại: nguồn trả phí là nguồn phụ, nhận định cần thêm một nguồn đọc được.
6. **Kiểm thử còn thiếu; tên trang mẫu dễ lẫn.** Thêm: trang ít hơn 5 nhận định (phải đủ cả số nhận định đang có), hồ sơ lệch tầng (sau mục 1), mẫu có `sai` (sau mục 2). Hai kiểm thử dùng `lich-su/opera` làm trang Đọc thêm (`tests/khoa.test.mjs:207–231`, `tests/giao-dien.test.mjs:60`) trong khi trang ấy nay là Lõi: đổi sang `lich-su/nu-nha-soan-nhac`. Thêm `nhom('nhac-cu/dan-nhac', 'loi') === 'co-dien'` để quy tắc mới có kiểm thử riêng, không chỉ nằm trong bảng 233 dòng.
7. **Tầng nằm ở ba chỗ.** `trang.yml` (nguồn thật), `kiem_ke.py` (sinh `kiem-ke.md`), `anh_xa.py` (sinh `anh-xa.md`); không kiểm thử nào so cột "Tầng" của `anh-xa.md` với `trang.yml` (kiểm thử giao diện chỉ so cột nhóm). Nay khớp, nhưng lần đổi tầng sau dễ lệch. Thêm một phép so cột tầng vào kiểm thử giao diện, hay cho `kiem_ke.py` đọc `trang.yml`.
   - `anh_xa.py:118` gõ cứng `"nhac-cu/dan-nhac"`: đổi thành "trang `nhac-cu/` tầng Lõi". Không thì hạ tầng trang ấy mà nó vẫn nằm ở D5-L3, không báo gì (D8-L2 lọc `k not in gan` che đi).
   - `anh-xa.md:3` (từ `anh_xa.py:152`) còn ghi "Tầng lấy từ kiem-ke.md; bạn đổi tầng ở đó". Đổi tầng nay là sửa `trang.yml` và `kiem_ke.py`, rồi sinh lại hai bảng; ghi vào `AGENTS.md` mục "Dữ liệu".
8. **"Tóm tắt hồ sơ" cho chủ repo chưa có mẫu.** Quyết định 1 nói chủ repo chỉ đọc tóm tắt. `README.md` mục Quy tắc chung, phần Báo cáo, có "số nhận định, số đã sửa và đã bỏ, chỗ chưa chắc" nhưng không gọi tên một mục. Thêm mục "Tóm tắt hồ sơ" vào lời giao việc lô: mỗi trang có số nhận định theo loại, số chỗ lượt 2 khác lượt 1, số sửa và bỏ (kèm lý do), nguồn chính, chỗ không chắc, và 5 nhận định mẫu.
9. **Chữ nhỏ còn cũ.**
   - `plans/lam-lai/README.md:15`, `plans/ben-vung/README.md:11`: "kiểm định hai lượt" thành "mức kiểm định theo tầng".
   - `chuan-kiem-dinh.md:73`: ví dụ `kiem_mau: "bạn, 3/31 nhận định"`; nên ví dụ 5 nhận định.
   - `tools/khoa.mjs:88–89`: "đã qua hai lượt".
   - `AGENTS.md:75` nói "khoảng 5"; mã đòi ít nhất 5 (hay hết, nếu ít hơn).
   - `AGENTS.md` mục "Chuyển trang từ site cũ" chỉ nói link issue. `tai-lieu-tham-khao.md:60–61` còn `mtuann.github.io/opus-zero/` và hai link giấy phép của repo cũ; trang `/opus-zero/` sẽ chết khi tắt Pages. Mở rộng thành mọi link tới `mtuann/opus-zero` và `mtuann.github.io/opus-zero`.
   - Bảng "File đã sửa" ở đầu báo cáo này thiếu `AGENTS.md`, `chuan-kiem-dinh.md`, `giao-viec.md`, `tools/khoa.mjs`, `tests/khoa.test.mjs` (commit `f1e5cf7`).

### Nên hỏi lại chủ repo

Chỗ người làm nhánh tự diễn giải, hoặc chủ repo chưa nói. Theo mức quan trọng. Không câu nào chặn D2-L1.

1. **`nhan-dien/nghe-mu` sang Tham chiếu có hạn (làm ở D8-L1).** Đúng chữ của quy tắc 1 (link bản thu). Nhưng 6 trang đang trỏ tới nó: `luyen-tai/index`, `nghe-tien-trinh`, `choi-bang-tai` (D3-L6); `nhan-dien/index` (xếp nó vào "Tháng 2"), `so-sanh-thoi-ky`, `tai-lieu-tham-khao` (D5-L3). Chúng hiện "sắp có" tới đợt 8. Cùng hệ quả với `duong-dai`, `viet-nam` (bước Tháng 6 của lộ trình nghe hiểu, cũng làm ở D8-L1). Hỏi: giữ vậy; hay giữ Lõi và đưa 10 URL bản thu vào dữ liệu có kiểm link; hay Tham chiếu nhưng làm sớm ở D5-L3. Tôi nghiêng về giữ vậy, vì hợp chữ của chủ repo và hậu quả chỉ là "sắp có". Hỏi trước D3-L6.
2. **Ngưỡng "phần chính" của quy tắc 1.** Chủ repo viết trang có thông tin mau cũ "phải ở Tham chiếu có hạn"; `README.md` thêm "là phần chính" (báo cáo: quá nửa số mục). Theo chữ chặt hơn, ít nhất 15 trang ở mục 4 của báo cáo cũng thành Tham chiếu, và nhiều trang trong đó là Lõi. Cách của người làm hợp lý (Lõi mà gồm 15 trang rà lại thì mất ý nghĩa khóa một lần), với điều kiện có luật "Lõi không giữ chi tiết mau cũ" ("Nên sửa" 3). Xin chủ repo xác nhận.
3. **Mục "Sau 6 tháng: đi sâu hơn" không tính là lộ trình** (nên `lich-su/nhac-truyen-thong-viet-nam` ở lại Đọc thêm). Trang là một dòng `- [ ]` ở `bat-dau/lo-trinh-nghe.md:60`, cùng dòng với `nhac-ly/am-hoc` (Lõi); `nhan-dien/index` (Lõi) ở dòng 58 cùng mục. Cách xếp đang bất đối xứng: giữ Lõi cho các trang kia, không nâng trang này. Nếu tính cả mục ấy thì đổi một trang (thành Lõi, D5-L1; Ngoại vi còn 8). Hỏi trước D5-L1.
4. **Cỡ mẫu lượt 2 của Đọc thêm: 5 mỗi trang.** Chủ repo nói "vài nhận định", không nói "mỗi trang". Ước thô theo số câu, 9 trang có khoảng 300 nhận định: mẫu 5 mỗi trang là 45 (15%). Trang lớn bị kiểm rất thưa (`nhac-truyen-thong-viet-nam` khoảng 100 câu: 5%; `nu-nha-soan-nhac` khoảng 65: 8%), trang nhỏ gần hết (`guitar` khoảng 9: 55%). Hỏi: giữ 5 mỗi trang, hay 5 mỗi lô, hay theo tỉ lệ (ví dụ số lớn hơn của 5 và 25% số nhận định). Hỏi trước D8.
5. **Hai lượt cho Tham chiếu có hạn, Tác phẩm, và hàng Khung "không có nhận định" là suy luận của người làm.** Chủ repo chỉ nói Tham chiếu "ghi ngày kiểm, đến hạn thì rà lại".
   - Tham chiếu: mỗi lần rà lại là một lần kiểm định mới, tức hai lượt mỗi lần, cho 10 trang mỗi 6 đến 12 tháng. Nặng hơn chữ "rà lại".
   - Tác phẩm: lý do ghi ở `README.md` ("trang và bản ghi là dữ liệu dùng ở nhiều trang") đúng với bản ghi, chưa đúng với trang bài học. Đây là 79 trang, 44% số chữ, phần tốn nhất. Gợi ý: để nguyên hai lượt, nhưng hỏi lại trước D6-0, khi đã đo được tỉ lệ lệch giữa hai lượt ở Lõi (đợt 2 đến 5).
   - Khung (34 trang, có blog, Cập nhật): vài trang có câu khẳng định thật (như "Safari chưa hỗ trợ MIDI"); chuẩn ghi "không có nhận định".
6. **Nguồn nhạc lý.** Chủ repo viết "ví dụ Open Music Theory"; `chuan-kiem-dinh.md` mục 2 ghi cứng "nguồn chính là Open Music Theory… khi các sách gọi tên hay định nghĩa khác nhau thì theo nguồn này". Hỏi: Open Music Theory là nguồn duy nhất, hay các nguồn miễn phí cùng loại (musictheory.net, 37 trang cũ dẫn) ngang bậc? Luật "theo nguồn này" có đúng ý không (Open Music Theory là giáo trình Mỹ, ABRSM là Anh, tên gọi có chỗ khác nhau)? Thêm: `thuat-ngu.yml` khóa ở D3-L5, nhưng 32 bài của D3-L1 đến L4 khóa trước và dùng thuật ngữ ấy; nếu D3-L5 đổi thuật ngữ thì phải mở khóa nhiều bài. Có chốt danh sách thuật ngữ trước D3-L1 không? Hỏi trước D3-L1.

### Kết luận

**Chưa gộp.** Ba quyết định ghi đúng ý chủ repo ở `README.md`, `chuan-kiem-dinh.md` và `AGENTS.md`, trừ các chỗ tự diễn giải ở "Nên hỏi lại". Build và 82 kiểm thử đạt; hai script sinh lại đúng hai bảng; tầng, ngày rà lại và nhóm menu của 233 trang khớp; bằng chứng ở mục 1 của báo cáo đúng. Còn ba chỗ chữ và số phải sửa (không đụng mã), rồi gộp được. Nên làm luôn "Nên sửa" 1 và 2 (mã `tools/khoa.mjs`, vài dòng và một kiểm thử mỗi chỗ), vì chúng nới cổng kiểm định ở tầng Đọc thêm. Hai tài liệu Claude Docs (`giao-viec.md` dòng 8 đến 11) vẫn ghi số cũ: cập nhật sau khi gộp.

### Sửa theo review

Claude Code (Claude Opus 5.5), ngày 24/10/2026, trên commit review `ba2d0eb`.

**Phải sửa: đã sửa cả ba.**

1. `so-do.md`: đợt 5 có 27 trang, đợt 8 có 20 trang; bước kiểm mẫu ghi "đọc tóm tắt, xem khoảng 5 nhận định".
2. `kiem_ke.py` (rồi sinh lại `kiem-ke.md`): bỏ chữ "đề xuất"; quy tắc xếp tầng ghi đúng ba tầng đã đổi và hai quy tắc chủ repo chốt.
3. `plans/lam-lai/README.md` và `plans/ben-vung/README.md`: không còn câu "chờ bạn"; các mục đã chốt hết.

**Nên sửa: đã làm.**

- `tools/khoa.mjs` lấy tầng từ `src/data/trang.yml`; hồ sơ ghi tầng khác thì báo lỗi. Mẫu lượt 2 của trang Đọc thêm có nhận định sai thì lượt 2 phải kiểm cả trang. Có kiểm thử. Hai kịch bản của người review (`k8.mjs`: K8, K9) nay đều ra lỗi.
- Luật "trang Lõi không giữ chi tiết mau cũ" ghi vào `chuan-kiem-dinh.md` mục 3 và lời giao việc lô. Chủ repo xác nhận cách hiểu này ngày 24/10/2026.
- Kiểm link định kỳ cho link bản thu (`ban_thu`): ghi vào mục Đợt 8 (workflow kiểm link ra ngoài hằng tuần, cùng workflow "Trang cần rà lại").

**Hỏi chủ repo:** đã hỏi hai câu ảnh hưởng sớm.

- Cách hiểu "mau cũ" là phần chính, kèm luật trang Lõi bỏ câu mau cũ lẻ: chủ repo chọn cách này.
- Thuật ngữ: chủ repo chọn khóa dần theo lô; mục Đợt 3 đã sửa.

Bốn câu còn lại chưa cần ngay (`nghe-mu`, mục "Sau 6 tháng", cỡ mẫu Đọc thêm, mức kiểm của Tác phẩm). Đã ghi ở cuối mục Quyết định của README, kèm lô cần có câu trả lời. Câu về "ví dụ Open Music Theory" không hỏi lại: đó cũng là lựa chọn đã ghi sẵn trong kế hoạch.

**Chưa làm:** hai tài liệu Claude Docs mà README trỏ tới còn số cũ. README ghi rõ "hai bản khác nhau thì file trong repo đúng", nên để chủ repo cập nhật khi cần.

Kiểm thử: `npm run build`, `npm test` 82 kiểm thử, 80 đạt, 2 bỏ qua; `kiem_ke.py` và `anh_xa.py` sinh lại đúng bảng đang commit.
