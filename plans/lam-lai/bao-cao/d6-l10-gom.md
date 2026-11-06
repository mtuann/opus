# D6-L10-gom: lượt 2 và review của 8 hướng dẫn nghe và 8 bản ghi

Nhánh `moi/d6-l10-gom`, ngày 06/11/2026. Review: Claude Opus 5.5 (không làm lượt 1 hay lượt 2), không dùng agent con. Không khóa gì, không push.

## Lượt 2

Danh sách: `d6-l10-nhan-dinh.yml` (trang, chia `d6-l10-gom/trang-1.yml`, `trang-2.yml`) và `d6-l10-nhan-dinh-du-lieu.yml` (`d6-l10-gom/du-lieu.yml`). Kết quả thô: `d6-l10-gom/ket-qua-*.yml`, đã `nhap`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (beethoven-5, beethoven-op132, mendelssohn-violin, schubert-ca-hoi) | 122 | 119 | 0 | 3 | 34 |
| Trang, phần 2 (bizet-habanera, schubert-erlkonig, tchaikovsky-1812, tchaikovsky-ho-thien-nga) | 117 | 116 | 0 | 1 | 51 |
| Bản ghi (8, lần 2) | 36 | 36 | 0 | 0 | 0 |
| **Tổng** | **275** | **271** | **0** | **4** | **85** |

Cần review gồm 4 câu lượt 2 `khong-chac` và 81 câu lượt 1 đã sửa (75) hay đã bỏ (6) mà lượt 2 ghi `dung`.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L10-gom: …". Đã review 109 câu, câu nào cũng có `review: dung`:
- 20 câu `ve-site`;
- 85 câu cần review;
- 4 câu lượt 2 ghi `dung` mà có ghi chú cần xem: `mendelssohn-violin` n18, n26, n27 và `schubert-ca-hoi` n18.

Lần kiểm định cuối của 16 hồ sơ (8 trang, 8 bản ghi) đã có `nguoi.review`. Ở hồ sơ bản ghi, hai câu `dung` có ghi chú cũng có `review` (xem dưới).

### Câu về chính site (20 câu)

Review kiểm trên:
- **trang đích:** có trong `src/content/docs/` và trong bản xem. Các trang đã khóa (`kiem-dinh/khoa.json`): `tai-lieu-tham-khao`, `nhac-ly/16-dieu-thuc-ngu-cung`, `luyen-tap/ban-phim`, `nhac-ly/07-gam-thu`, `lich-su/opera`, `hinh-thuc/concerto`, `hinh-thuc/sonata`, `hinh-thuc/bien-tau`, `lich-su/thoi-ky/lang-man`. Các trang chưa khóa: `nghe-nhac/mau` (8 câu) và `nghe-nhac/beethoven-5` (`mendelssohn-violin` n30) có ở bản xem, bản thật hiện "sắp có". Hợp lệ;
- **chữ của trang đích:**
  - bảng điệu thức ở bài 16 có dòng "Fa | Lydian";
  - `GAM` của `src/scripts/nhac-ly.js` có "Điệu Lydian" (công cụ `piano-explorer` ở `luyen-tap/ban-phim`);
  - mục "Giọng thứ song song và giọng thứ cùng tên" của bài 7;
  - `hinh-thuc/concerto` dòng 32 và `hinh-thuc/sonata` dòng 47 (Mendelssohn);
  - "từ Đô thứ tăm tối đến Đô trưởng chiến thắng" ở Beethoven 5;
- **chính trang:** Beethoven 5 có `::khoi-nghe` và bảng 9 dòng, dòng cuối là chỗ chương 3 nối sang chương 4.

Kết quả: 20 đúng, 0 sai.

### Câu lượt 2 `khong-chac` (4 câu) và câu `dung` có ghi chú

| Câu | Quyết định |
|---|---|
| `beethoven-5` n7 (Thời kỳ "Cổ điển, chuyển sang Lãng mạn"; lượt 2: IMSLP, CMS chỉ ghi Classical) | Giữ chữ của trang cũ. Lượt 1 có bài của Cambridge: Dahlhaus gọi bài điểm Giao hưởng số 5 của Hoffmann (1810) là "the founding document of musical romanticism". Lượt 2 của hồ sơ bản ghi (n4) mở Eastman: bản giao hưởng mang "hallmarks of Romanticism". Khác *Pathétique* (D6-L5 chọn "Cổ điển"): Op. 13 là tác phẩm sớm và không có nguồn riêng cho ý Lãng mạn, còn Giao hưởng số 5 có. `thoi_ky` "Cổ điển → Lãng mạn" của bản ghi giữ, cùng lý do. Xem "Chủ repo cần biết". |
| `beethoven-op132` n17 ("cửa vào tốt nhất"; lượt 1 đã bỏ) | Giữ bỏ. Câu là đánh giá, hai lượt đều không có nguồn. |
| `schubert-ca-hoi` n5 (Sáng tác 1819, sau mùa hè ở Steyr) | Mọi nguồn đều rào năm: Henle "probably", "around 1819"; Bärenreiter "one can assume"; IMSLP "1819?". Chuyện viết trong hay sau chuyến đi Steyr thì các nguồn không thống nhất. Sửa theo gợi ý của lượt 2: "Có lẽ năm 1819, trong hay sau mùa hè ở Steyr (Áo)". Không chạy lại. |
| `schubert-erlkonig` n18 (Schubert viết lại liên ba thành móc đơn; lượt 2: chỉ thấy Wikipedia) | Giữ. Review tải trang Hyperion mà lượt 1 dẫn. Ghi chú của Graham Johnson (1990) viết nguyên văn: "in one of these he re-writes the fiendish piano triplets as simple quaver duplets". Đây là nguồn hãng đĩa, bậc 2. Không chạy lại. |
| `mendelssohn-violin` n8 (độ dài 24–27 phút; lượt 2 `dung`, gợi ý 25–30) | Gộp số đo của hai lượt. Lượt 2: 74 bản thu Naxos trên IMSLP dài 24,0–30,4 phút, trung vị khoảng 27. Lượt 1: ba bản thu dài 23:49–26:50, Cleveland ghi 25 phút. Sửa thành "Khoảng 25–30 phút". Không chạy lại. |
| `mendelssohn-violin` n18 (bassoon giữ nốt để khán giả không vỗ tay) | Ledbetter (BSO, Aspen) viết "The obvious intention here is to forestall intrusive applause". Đó là diễn giải của người viết chú giải, không phải lời Mendelssohn. Viết nhẹ: "…nối chương 1 sang chương 2, có lẽ để khán giả không vỗ tay chen giữa". Đổi `ket_qua` thành `da-sua`. Không chạy lại, vì chữ mới chỉ bớt mức chắc chắn. |
| `mendelssohn-violin` n26 (*Giấc mộng đêm hè*) | Giữ. Nguồn của lượt 2 chỉ nói "fairy music". Nguồn của lượt 1 (Indianapolis) viết "Echoes of Midsummer Night's Dream are everywhere". |
| `mendelssohn-violin` n27 ("Khác với Mozart") | Giữ. Tài liệu CMU của lượt 1 lấy Mozart làm mẫu cho phần trình bày riêng của dàn nhạc. |
| `schubert-ca-hoi` n18 (nội dung ca khúc gốc) | Giữ. Lượt 1 đọc lời Schubart in trong bản Peters. |
| Bản ghi `beethoven-5` n12 (ô III của hình rộng 0,9, thực tế khoảng 0,7–0,8) | Giữ 0,9. Hai lượt cùng thấy thứ tự dài ngắn đúng. Câu và chú thích hình chỉ nói "gần đúng", và hình không ghi thời lượng. |
| Bản ghi `schubert-ca-hoi` n7 (ô Allegretto dài 1,2) | Giữ. Đây là cách vẽ của site, giọng và nhạc cụ đúng theo tổng phổ. |

### Câu lượt 1 đã sửa hay đã bỏ mà lượt 2 `dung` (81 câu)

- **75 câu đã sửa:** review đọc lại cả tám trang: bảng thông tin, đoạn văn, bảng Theo dõi khi nghe, câu hỏi, mục Nguồn, mô tả trang. Chữ trên trang khớp câu ở mọi câu. Riêng *1812* có 28 câu đã sửa, và lượt 2 xác nhận từng câu, phần lớn bằng tổng phổ Muzyka 1983 và Tchaikovsky Research.
- **6 câu đã bỏ:**
  - 5 câu là dòng nguồn "Burkholder, Grout, Palisca; Grove" (`beethoven-5` n37, `bizet-habanera` n27, `schubert-erlkonig` n31, `tchaikovsky-1812` n38, `tchaikovsky-ho-thien-nga` n23). Lượt 2 chỉ xác nhận sách và cơ sở dữ liệu có thật; không nhận định nào dựa vào chúng.
  - `mendelssohn-violin` n12 ("được biểu diễn nhiều nhất mọi thời đại"). Lượt 2 chỉ tìm được một ghi chú chương trình, không có số liệu. Giữ bỏ.

  Review đã tìm trên tám trang: không còn chữ "Burkholder", "Grove", "nổi tiếng nhất", "nhiều nhất mọi thời đại", "cửa vào", "đỉnh cao".

### Soát nhãn

- Không câu `ve-site` nào chứa điều cần nguồn ngoài.
- 6 câu `khuyen-tap` đều là câu hỏi nghe hay gợi ý nghe, không câu nào nói về sức khỏe.
- Không đổi nhãn câu nào.

### Chỗ sửa trang và dữ liệu

| File | Đổi |
|---|---|
| `nghe-nhac/mendelssohn-violin.md` | Độ dài "Khoảng 25–30 phút"; "có lẽ để khán giả không vỗ tay chen giữa" |
| `nghe-nhac/schubert-ca-hoi.md` | Sáng tác "Có lẽ năm 1819, trong hay sau mùa hè ở Steyr (Áo)" |

- Hai trang đều chưa khóa. `src/data/` không đổi.
- `doi_chu`:
  - `mendelssohn-violin`: cập nhật `moi` và `ly_do` của mục độ dài, thêm 1 mục (câu bassoon);
  - `schubert-ca-hoi`: thêm 1 mục (dòng Sáng tác).

  `so-chu.mjs --doi-chu` báo đủ ở cả 8 trang.
- Không trang nào có mốc (`moc`), nên không cần `tools/audio`.

## Lượt 2 bổ sung

Không có. Lệnh `node tools/khoa.mjs xuat D6-L10 --con-lai` và lệnh `xuat du-lieu/tac-pham/<slug> --con-lai` cho 8 bản ghi đều ra 0 nhận định, nên không có `d6-l10-gom/bo-sung.yml`. Ba chỗ đổi chữ đều theo gợi ý của lượt 2 hay làm nhẹ một vế cho đúng với nguồn hai lượt đã đọc (Mendelssohn n8, n18; Cá hồi n5).

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua (phạm vi nhánh lô và nhánh `them/`), 0 hỏng.

## Chủ repo cần biết

- **Thời kỳ của Beethoven 5:** site giữ "Cổ điển, chuyển sang Lãng mạn" ở trang và "Cổ điển → Lãng mạn" ở `thoi_ky` (trường chưa khóa). *Pathétique* là "Cổ điển", Op. 132 là "Beethoven cuối đời" / "giai đoạn cuối (cầu nối sang Lãng mạn)". Muốn mọi tác phẩm Beethoven ghi "Cổ điển" như IMSLP thì sửa `beethoven-5` ở hai chỗ, có nguồn IMSLP. Chữ ấy chỉ bỏ vế, không cần lượt 2.
- **Link ngoài mới ở mục Nguồn** (lychee sẽ kiểm hằng tuần):
  - Beethoven-Haus (Beethoven 5);
  - Chamber Music Society (Op. 132);
  - trang IMSLP của Op. 64, Internet Archive, BSO, Cleveland (Mendelssohn);
  - Tchaikovsky Research (*1812*, *Hồ thiên nga*).

  Đều là nguồn bậc 2 hay thư viện, review đề nghị giữ.
- ***1812*:**
  - trang không còn tên *Ouverture solennelle "1812"* (chưa có nguồn bậc 1–2);
  - tổng phổ Muzyka 1983 mà hai lượt đọc là bản Liên Xô: đoạn quốc ca ở coda do Shebalin viết lại. Câu về *God Save the Tsar* theo nguyên tác (Tchaikovsky Research).
- **Op. 132:** trang ghi năm 1825 (Beethoven-Haus, Cooper); IMSLP ghi 1823–25, tính từ lúc nhận đặt hàng.
- **`bizet-habanera`** vẫn không có `danh_muc` (IMSLP: "GB 9 ; WD 31"). Trường đã khóa, không đổi.
- **Hồ sơ ngoài lô:** `ghi_chu` của nhiều câu `ve-site` trỏ tới trang của lô vẫn ghi trang đích "chưa chuyển": `hinh-thuc/overture` n22, `nhac-cu/trumpet` n27, n28, `piano/choi-cung-nguoi-khac`… Các câu vẫn đúng. Không sửa, vì nằm ngoài lô.
- **Thuật ngữ chưa có** trong `thuat-ngu.yml`: danh sách ở `d6-l10.md`.
- **Còn trống** ở lần kiểm định cuối của 16 hồ sơ: `nguoi.luot_2`, `nguoi.kiem_mau`.
- **Mạng:** một yêu cầu, User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`: trang Hyperion "Erlkönig, D328" (`tw.asp?w=W1933`).

## Trạng thái khóa (người gom)

- Lượt 2 phần trang-1: agent đầu bị chủ repo dừng sau khi đã ghi xong phần Beethoven (65 câu, `beethoven-5`, `beethoven-op132`); phần ấy giữ nguyên, phần Mendelssohn và Schubert (57 câu) chạy lại bằng agent Opus mới; hai phần ghép theo thứ tự `trang-1.yml`.
- Không có lượt 2 bổ sung.
- Đã điền `nguoi.luot_2` cho 16 hồ sơ (8 trang, 8 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l10-gom/kiem-mau.yml` (`xuat D6-L10 --mau 8`).
