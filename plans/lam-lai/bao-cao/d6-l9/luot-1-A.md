# D6-L9, lượt 1, phần A

Người làm: Claude Opus 5.5 (D6-L9 phần A), ngày 06/11/2026, nhánh `moi/d6-l9`.

Phần A gồm 4 hướng dẫn nghe (tầng Tác phẩm): `nghe-nhac/bach-air`, `bach-cello-1`, `handel-hallelujah`, `haydn-94`. Kèm lần 2 của 4 bản ghi `tac-pham/` cùng tên, với các trường `thoi_ky`, `luyen_nghe` và `hinh` (chỉ `haydn-94` có `hinh`). Không build, không chạy `npm`. Cả 8 hồ sơ đọc được bằng `node tools/khoa.mjs xuat`.

## Số liệu

**Trang:** 116 nhận định.

| Hồ sơ | Tổng | dung | da-sua | da-bo | khong-can-nguon |
|---|---|---|---|---|---|
| bach-air | 26 | 9 | 15 | 1 | 1 |
| bach-cello-1 | 32 | 14 | 15 | 2 | 1 |
| handel-hallelujah | 35 | 10 | 22 | 2 | 1 |
| haydn-94 | 23 | 11 | 11 | 0 | 1 |
| **Cộng** | **116** | **44** | **63** | **5** | **4** |

Theo loại:

| Loại | Số |
|---|---|
| cau-truc | 47 |
| lich-su | 23 |
| nam | 12 |
| ve-site | 12 |
| ten | 8 |
| danh-muc | 4 |
| khuyen-tap | 4 |
| so-lieu | 3 |
| dinh-nghia | 3 |

Khuông nhạc: 1 khối (`haydn-94`, trích đoạn), kết quả `dung`.

**Bản ghi (lần 2):** 11 nhận định, đều `dung`: 4 câu `lich-su` (`thoi_ky`) và 7 câu `cau-truc` (`luyen_nghe`, `hinh`). File `sua-A.yml` vì vậy rỗng.

## Chỗ sửa chính

- **Đọc lại bản nhạc** (Mutopia; tổng phổ Cranz quét trên Internet Archive cho Haydn):
  - `bach-cello-1` có hai chỗ sai.
    - Fermata ở ô 22 rơi trên nốt **Rê** (âm át của Sol trưởng), không phải nốt "La, âm át của Rê trưởng".
    - Đoạn bariolage (ô 31–36) là nốt La lặp lại xen với các nốt khác, vừa lên vừa xuống. Chuỗi đi lên theo nửa cung nằm ở ô 37–38, trên nốt Rê lặp lại.
  - `bach-air` viết sai hình dáng giai điệu. Câu "đi lên từng nấc thang" và dòng "chất liệu mở đầu quay lại" không khớp bản nhạc. Đã viết lại theo hai nửa (6 và 12 ô) và theo giọng: La trưởng, Si thứ, La trưởng, Rê trưởng.
  - `handel-hallelujah`, đối chiếu từng ô với Mutopia (theo bản Chrysander):
    - Phần mở đầu là chủ điệu (bốn bè cùng nhịp), không phải "đồng thanh".
    - Câu "for the Lord God" hát đồng âm.
    - Ở đoạn fugue, các bè vào theo thứ tự bass, tenor, alto, soprano.
    - Đoạn "King of Kings" chỉ có soprano (lúc đầu cùng alto) và trumpet 1 giữ nốt dài, lên từng bậc. Trang cũ ghi "cả hợp xướng".
    - Đoạn im lặng gần cuối dài hai phách, không phải "một nhịp".
  - `haydn-94`: bảng Theo dõi ghi cụ thể theo tổng phổ.
    - Biến tấu 1: chủ đề ở violin 2 và viola.
    - Biến tấu 2: *Minore*, ff.
    - Biến tấu 3: *Maggiore*, oboe chơi chủ đề bằng móc kép.
    - Biến tấu 4: tutti ff.
    - Coda: *sempre dim.*, pp.
- **Lịch sử** (theo lời tựa Urtext và các danh mục):
  - `bach-air`:
    - Năm sáng tác và nguồn bản nhạc: nguồn chính là bộ phần bè chép khoảng 1730–31, một phần do chính Bach chép. Năm sáng tác có lẽ 1729–31 (Bärenreiter TP 194).
    - Bản Wilhelmj (1871) là cho violin **và piano** (COD).
    - "Air" chỉ nghĩa là "giai điệu"; bỏ "trong tiếng Pháp".
  - `bach-cello-1`:
    - Sáu tổ khúc còn lại qua bốn bản chép tay, bản của Anna Magdalena (1727–31) gần bản gốc nhất (Henle HN 666).
    - Bản in đầu tiên ra ở Paris năm 1824.
    - Casals: năm 1890 tìm thấy bản Grützmacher, là người đầu tiên chơi trọn các tổ khúc trước công chúng, thu âm 1936–39 ở London và Paris (Fundació Pau Casals, Gran Enciclopèdia Catalana).
    - Câu "kinh thánh" thay bằng câu của Henle.
  - `handel-hallelujah`:
    - Handel sinh ở Đức (COD: "Ger.-born"). Ông chuyển *dần* sang oratorio khi opera Ý bớt được ưa chuộng; oratorio không phải "thể loại mới".
    - Bản nhạc viết "phần lớn" trong 22/8–14/9/1741 (Thư viện Anh, COD).
    - Số thứ tự là 44, có ấn bản đánh số 39.
    - Nội dung ba phần viết theo lời trong bản nhạc.
    - Lời bài là ba câu sách Khải Huyền (đối chiếu bản King James).
  - `haydn-94`:
    - Chính Haydn đã bác chuyện "đánh thức khán giả" (Griesinger, qua lời tựa Henle HN 9062).
    - Thêm ngày công diễn 23/3/1792, tên Salomon và ô 16.
- **Bản thu:** `bach-cello-1` ghi thêm hãng và năm, theo MusicBrainz.
  - Casals: HMV/EMI, thu 1936–39; Prelude số 1 thu ở Paris năm 1938.
  - Yo-Yo Ma: CBS Masterworks (thu 1982) và Sony Classical (1997).
- **Câu `ve-site` sai:** `handel-hallelujah` n32. Trang dẫn sang Baroque "để hiểu vì sao trumpet và timpani gắn với chiến thắng", nhưng trang Baroque (đã khóa) không nói điều đó. Đã viết lại thành "về kèn trumpet chưa có van".
- **Đã bỏ** (không có nguồn bậc 1–2 đọc được):
  - `bach-air` n9: "một trong những giai điệu nổi tiếng nhất…".
  - `bach-cello-1` n10: "thế kỷ 19 coi là bài tập kỹ thuật".
  - `bach-cello-1` n13: "tập hơn chục năm".
  - `handel-hallelujah` n14: "nợ nần, tưởng sự nghiệp đã hết".
  - `handel-hallelujah` n18: "buổi hòa nhạc từ thiện".
- Cũng bỏ các lời đánh giá đi kèm: "âm sắc dày, ấm", "như chuông", "như bài hát thiếu nhi", "hùng tráng", "rực rỡ", "260 trang", và "trọng âm phách 2" của sarabande (D4-gom đã bỏ chữ này ở `piano/the-loai`).
- **Mục Nguồn** của cả 4 trang: bỏ Burkholder/Grout/Palisca và Grove (chưa đọc), cùng các link "tìm trên IMSLP". Thay bằng nguồn đã đọc, link thẳng tới trang.
- **Mô tả trang** (`description`) của `bach-air`, `bach-cello-1`, `handel-hallelujah` sửa theo đoạn đầu. Đã ghi ở `doi_chu`.

## Chưa chắc

- `handel-hallelujah` n22: giai thoại vua George II đứng dậy.
  - COD (bậc 2) kể chuyện này như sự kiện, ở một buổi diễn tại London năm 1743.
  - Ý "không có bằng chứng đương thời" của trang cũ chỉ thấy ở nguồn bậc 3, nên đã bỏ khỏi trang. Trang nay viết "chuyện thường được kể là…".
  - Nếu lượt 2 hay review tìm được nguồn bậc 2 nói không có bằng chứng (như Burrows, hay một thư viện, nhà xuất bản) thì thêm lại một câu kèm nguồn.
- Ở `bach-cello-1`, nốt La của đoạn bariolage được ghi là "đúng cao độ dây La buông". Bản nhạc không ghi dây, nhưng định nghĩa bariolage (COD) hàm ý dây buông.

## Nguồn hay dùng

- **Bản nhạc:**
  - Mutopia: Air BWV 1068 (Bach-Gesellschaft), BWV 1007 (Schirmer 1916), Messiah (Chrysander 1902).
  - Tổng phổ Cranz Haydn 94 trên Internet Archive (`symphonies00hayd`).
  - Cao độ từng ô tính bằng script (relative → tuyệt đối). Tổng phổ Haydn đọc bằng ảnh cắt.
- **Lời tựa:** Bärenreiter TP 194 (`barenreiter.co.uk/prefaces/…`), Henle HN 666 và HN 9062. PDF tìm qua trang sản phẩm, lấy từ sitemap.
- **IMSLP:** wikitext qua `api.php`.
- **Concise Oxford Dictionary of Music** (Encyclopedia.com): air, Air on the G String, sarabande, bariolage, broken chord, oratorio, Messiah, Hallelujah Chorus, Handel.
- **Khác:**
  - Thư viện Anh: hồ sơ R.M.20.f.2, có bản `.json`.
  - BnF: năm sinh, năm mất.
  - MusicBrainz API: độ dài, nơi và năm thu, hãng.
  - Kinh Thánh bản King James qua `bible-api.com`.
  - Fundació Pau Casals, Gran Enciclopèdia Catalana.
- **Không dùng được:**
  - Britannica: 403, Wayback không có bản lưu.
  - Bach-Digital: treo.
- **Cách mở mới** (có thể thêm vào `chuan-kiem-dinh.md`, mục "Nguồn và cách mở"):
  - Lời tựa Bärenreiter mở được ở `https://www.barenreiter.co.uk/prefaces/<ISMN>.pdf`.
  - Hồ sơ của Thư viện Anh đọc được ở `searcharchives.bl.uk/catalog/<id>`, có cả bản `.json`.

## Người giao phải quyết hay làm

1. Ghép `doi_chu` với khung của `node tools/chuyen/so-chu.mjs <trang> --doi-chu` sau khi build bản xem.
   - Mục `doi_chu` viết tay theo từng khối: đoạn văn, bảng, danh sách, mô tả trang.
   - Bảng `Sơ đồ cấu trúc` và bảng `Theo dõi` của `handel-hallelujah` ghi theo dòng, cột đầu viết tắt bằng "…". Cần chỉnh theo khối mà `so-chu` in ra.
2. `hinh-thuc/minuet-trio` m26 (đã khóa) gọi `nghe-nhac/haydn-94` là hướng dẫn nghe cho chương 3 (minuet), nhưng trang chỉ viết về chương 2.
   - Theo lời giao, phần A không thêm chương 3.
   - Còn mở: sửa câu ở `minuet-trio` khi mở khóa sau này, hay chấp nhận như hiện trạng.
   - Các câu khác trỏ tới trang này đã giữ đúng: `bien-tau` n35, `20-doc-tong-pho` n18 và n21, `co-dien` n31.
3. `bach-cello-1`: các câu ở hồ sơ khác trỏ tới trang này vẫn đúng.
   - Giữ "Tổ khúc: Prelude và 5 điệu nhảy".
   - Giữ trật tự Prelude – Allemande – Courante – Sarabande – Menuet I và II – Gigue.
4. Trang có link mới ra ngoài: Mutopia, IMSLP, Bärenreiter, Henle, Thư viện Anh, Encyclopedia.com, paucasals.org, MusicBrainz, Internet Archive. Chúng nằm trong `src/content/docs/**/*.md`, nên lychee hằng tuần sẽ kiểm.
   - Link IMSLP có dấu ngoặc trong địa chỉ, giống các trang đã khóa khác.
   - Đã thử: ba thư mục Mutopia và trang IMSLP BWV 1068 trả 200.

## Thuật ngữ chưa có bản ghi trong `thuat-ngu.yml`

continuo, air, bariolage, dây buông, hợp âm rải (arpeggio, broken chord; đã dùng ở trang nhạc lý đã khóa), prelude, allemande, courante, sarabande, gigue, đồng âm (unison; đã dùng ở trang đã khóa), chủ đề và biến tấu, sempre, oboe.
