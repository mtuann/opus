# Mở khóa mo/link-hong: link ngoài hỏng (lychee 07/11/2026)

Nhánh `mo/link-hong` từ `main` (`3990788`), Claude Opus 5.5, 06/11/2026. Đầu vào: báo cáo lychee (workflow `kiem-link.yml`) có 19 lỗi và 2 lần quá giờ, ở 17 link khác nhau trên 16 trang.

## Cách kiểm

- Mỗi link mở bằng `curl` hai lần, User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`. Không giả User-Agent trình duyệt.
- Tên miền không kết nối được thì tra DNS. `digfir-published.macmillanusa.com` là CNAME tới `digfir-published-macmillanusa.macmillan.cloud`, mà tên này không có bản ghi A. Bộ *Listen* nay do W. W. Norton phát hành, nên trang cũ đã bị gỡ hẳn.
- Bản lưu tìm qua API CDX của Wayback Machine. Mỗi bản lưu đều được tải bản gốc (`id_`), lọc lấy chữ và đối chiếu với câu trên trang cùng nhận định trong hồ sơ. Câu trích dẫn đã ghi vào `ghi_chu` của từng nhận định.

## Hỏng thật: đã sửa (13 trang, đã mở khóa, chưa khóa lại)

| Link cũ | Phân loại | Cách sửa | Trang | Nhận định |
|---|---|---|---|---|
| `digfir-published.macmillanusa.com/listen8e/listen8e_ch10_13.html` (*Listen* 8e, ritornello) | Tên miền chết; Wayback không lưu | Thay bằng MIT OCW 21M.011 (2024, Goetjen, Ritornello form) và LibreTexts 8.2 Concertos in the Baroque Period | `hinh-thuc/concerto` | n5, n6, n7, n8, n9, n32 |
| `lcsproductions.net/…/Ritornello.html` | 404 | Bản lưu Wayback 11/02/2020 | `hinh-thuc/concerto` | n3, n4, n5, n32 |
| `berliner-philharmoniker.de/…/mozart-symphony-no-41…-jupiter/` | 404 (cả khi bỏ `/` cuối) | Bản lưu Wayback 20/01/2026. Bản 22/04/2026 không có chữ vì bài nạp bằng JavaScript | `hinh-thuc/fugue` | n36 |
| `macromusic.org/journal/volume1/Gerber.html` | 404 | Bản lưu Wayback 13/02/2026 | `hinh-thuc/sonata` | n17, n20–n22, n24–n27, q4 |
| `lakevieworchestra.org/notes/2018/6/17/smetana-vltava-die-moldau` | 404 | Bản lưu Wayback 23/10/2022 | `hinh-thuc/symphonic-poem` | n16 |
| `hollywoodbowl.com/musicdb/pieces/768/…` | 404: trang đã chuyển chỗ | Địa chỉ mới `hollywoodbowl.com/works/the-young-persons-guide-to-the-orchestra-op-34`, cùng bài | `nhac-cu/dan-nhac` | d24 |
| `hollywoodbowl.com/musicdb/pieces/5203/symphony-no-40` | 404: trang đã chuyển chỗ | Địa chỉ mới `hollywoodbowl.com/works/symphony-no-40-in-g-minor-k-550`, cùng bài | `nhac-ly/19-at-phu-chuyen-giong` | n27 |
| `…/listen8e_ch12_16.html` (Classical Counterpoint) | Tên miền chết; Wayback không lưu | Thay bằng SFCM, Sonata form developments ("themes or fragments in imitative contrapuntal textures") | `nhac-ly/28-ket-cau` | n3 (chỉ bỏ nguồn), n17, n27 |
| `…/listen8e_ch9_16.html` (chuỗi, Brandenburg số 5) | Tên miền chết; Wayback không lưu | Thay bằng MIT OCW 21M.011 (2006, Harris, Lecture III). Ví dụ trong lời giải thích câu hỏi đổi từ Bach, *Brandenburg* số 5 sang Vivaldi, *La stravaganza*, chương 1 | `nhac-ly/29-chuoi-hoa-am` | n2, n3, n34 |
| `music.arts.uci.edu/…/Gjerdingen…Ch_2.pdf` | 404 | Bản lưu Wayback 09/02/2026 | `nhac-ly/29-chuoi-hoa-am`, `piano/hoa-am/index` | n17; i9, i17, i18, i26 |
| `…/listen8e_ch15_13.html` (bảng nghe Beethoven 5) | Tên miền chết; Wayback không lưu | Thay bằng Đại học Rochester (đã có trên trang) và BHSO, Beethoven Symphony no 5 | `nhac-ly/30-phat-trien-motip` | n20, n21, n37 |
| `berliner-philharmoniker.de/…/alban-berg-concerto…` | 404; bản lưu duy nhất (01/02/2026) không có chữ của bài | Bỏ. Vế hợp âm ba theo bài giảng MUS347W (đã có); vế "ba bước một cung" theo tập sách đĩa Shaham của San Francisco Symphony | `nhac-ly/32-ky-thuat-the-ky-20` | n32, n34, n35 |
| `faculty.evansville.edu/gu2/Scales.htm` | 404 | Bản lưu Wayback 29/07/2024 (tài liệu sửa lần cuối 07/01/2021). Hồ sơ `beethoven-op49-2` đã dùng bản lưu này | `piano/gam`, `piano/hop-am-rai` | gam: mọi nhận định dùng `evansville` (ghi ở n11, n19); hop-am-rai: n18, n22 |

Mỗi trang có lần kiểm định mới trong `lan`: `luot_1` đã ghi, các vai còn lại để trống cho người gom. Hồ sơ đã sửa `nguon` (link mới, hay thay và bỏ nguồn chết) và thêm vào `ghi_chu` của từng nhận định câu trích của nguồn mới. Chỗ chữ khác trang cũ đã ghi ở `doi_chu`: `so-chu.mjs` báo đủ cho cả 13 trang.

### Người gom cần xem lại

1. **`hinh-thuc/concerto` n7** ("độc tấu chơi nhanh và điêu luyện hơn"): nguồn mới đỡ vế "điêu luyện" (LibreTexts: "very challenging and demanding music … a virtuoso"). Vế "nhanh" chỉ có ở *Listen* ("faster and more brilliant"), mà trang này không còn. Cần chọn: giữ chữ "nhanh" hay bỏ.
2. **`nhac-ly/30-phat-trien-motip` n21**: Rochester gọi mảnh bị chia nhỏ là "main motive", không gọi là chủ đề cầu nối. BHSO đặt đoạn hợp âm chuyền giữa hai bè ngay sau "the horn call is played twice". Cả hai nguồn ghi "winds" (bộ hơi), còn trang ghi "bộ gỗ". Cần xem có sửa chữ không.
3. **`nhac-ly/29-chuoi-hoa-am` n34**: lời giải thích câu hỏi 3 đã đổi ví dụ. Không tìm được nguồn bậc 1–2 nào đọc được nói *Brandenburg* số 5 có chuỗi ở chủ đề. Muốn giữ ví dụ Bach thì phải kiểm trên bản nhạc.
4. `piano/gam` (không chạm): bản lưu Evansville ghi tay trái Si trưởng là "1 3 2 1 4 3 2 1 …", tức bắt đầu bằng ngón 1. n13 và n23 nói bắt đầu bằng ngón 4, theo PianoScales. Hồ sơ cũ đã dùng cùng bảng này, nên chỗ khác nhau có từ trước, không do đổi link.

## Lỗi tạm thời hay chặn bot: không sửa trang

| Link | Kết quả kiểm lại (06/11/2026) | Đề xuất |
|---|---|---|
| `vienamnhac.vn/bai-viet/nhac-co/tuong-co---di-san-van-hoa-can-gin-giu` | Lychee: connection reset. Kiểm lại: 200 cả hai lần | Giữ để theo dõi |
| `bachbib.bw.edu/script/bach2.pl?23=42453` | Lần 1: 503, lần 2: 200 | Giữ để theo dõi |
| `http://www.piano-midi.de/` | Lần nào cũng 418 (máy chủ từ chối công cụ) | Thêm vào `--exclude` (hay chấp nhận mã 418 như đã chấp nhận 403 và 429) |
| `www.bach-digital.de/receive/BachDigitalSource_source_00001849` | Quá giờ cả hai lần, cả trang chủ cũng vậy. `chuan-kiem-dinh.md` đã ghi Bach-Digital chặn bot | Thêm vào `--exclude` |
| `en.chopin.nifc.pl/chopin/life/calendar/year/1849` | Quá giờ cả hai lần, cả trang chủ cũng vậy | Giữ để theo dõi; lần chạy sau còn quá giờ thì thêm vào `--exclude` |
| `www.lvbeethoven.it/anhang_05/` | Lychee (máy GitHub): TLS "InvalidContentType". Máy kiểm: cổng 443 trả HTTP thường, chuyển sang trang cảnh báo của bộ lọc mạng (Comcast "Advanced Security"), nên ở đây không xác định được. Wayback lưu được trang này với mã 200 ngày 14/07/2026 | Giữ để theo dõi. Lần sau còn lỗi thì kiểm từ mạng khác; nếu trang chết thật thì đổi sang bản lưu 14/07/2026 |

Không sửa workflow.

## Còn link chết trong hồ sơ (không trên trang)

Lychee không kiểm `kiem-dinh/`. Các link sau vẫn còn trong hồ sơ của những trang không đổi, ở `nguon` hay `luot_2_nguon`. Chúng là dấu vết của lần kiểm cũ, chưa sửa:

- `digfir-published…` ở `piano/choi-cung-nguoi-khac`, `nhac-ly/20-doc-tong-pho`, `nhac-ly/31-hinh-thuc-nho`, `nhan-dien/dau-van-tay`, `nhan-dien/so-sanh-thoi-ky`, `nhac-cu/dan-nhac` (`luot_2_nguon` của d25), `du-lieu/thuat-ngu/fragmentation`;
- Evansville ở `piano/hai-tay`, `piano/nam-ngon`;
- bản trích Gjerdingen ở `piano/hoa-am/mau-galant`.

Nên sửa khi các trang ấy được mở khóa lần sau.

## Kiểm thử

- `npm run build:xem`: 242 trang, không có cảnh báo `[opus]`.
- `npm test` trên bản xem: lần đầu hỏng 1 phép (`tests/chuyen.test.mjs`: `doi_chu` của `nhac-ly/28-ket-cau` ghi sai chỗ). Đã sửa, chạy lại đạt 302, 2 bỏ qua, 0 hỏng.
- `npm run build` (bản thật): 229 trang, vì 13 trang đang mở khóa bị loại; link tới chúng thành "sắp có". `npm test` trên bản ấy cũng đạt 302, 0 hỏng.
- Đã build lại bản xem. `node tools/khoa.mjs tinh`: mọi mục còn khóa đều khớp.

Việc còn lại cho người gom: lượt 2 và review các nhận định đã chạm (theo bảng trên), giải quyết ba điểm ở mục "Người gom cần xem lại", rồi `node tools/khoa.mjs khoa <trang>` cho 13 trang.
