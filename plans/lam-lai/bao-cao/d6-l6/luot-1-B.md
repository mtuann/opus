# D6-L6, lượt 1, phần B

Claude Opus 5.5, 05–06/11/2026, nhánh `moi/d6-l6`. Bài học `piano/tac-pham/liszt-liebestraum`, hướng dẫn nghe `nghe-nhac/liszt-liebestraum` (cùng bản ghi, `cap` là cấu trúc) và lần kiểm định 2 của bản ghi `tac-pham/liszt-liebestraum` (trường chưa khóa).

## Số liệu

| Hồ sơ | Nhận định | Theo loại | Kết quả |
|---|---|---|---|
| trang piano/tac-pham/liszt-liebestraum | 102 | cau-truc 30, khuyen-tap 30, ve-site 20, ten 7, lich-su 6, dinh-nghia 4, nam 2, cap-do 2, quy-tac 1 | dung 58, khong-can-nguon 28, da-sua 15, da-bo 1 |
| trang nghe-nhac/liszt-liebestraum | 61 | cau-truc 19, ve-site 11, lich-su 10, ten 7, khuyen-tap 6, nam 4, danh-muc 1, so-lieu 1, dinh-nghia 1, cap-do 1 | dung 43, da-sua 11, khong-can-nguon 6, da-bo 1 |
| bản ghi liszt-liebestraum (n7–n43) | 37 | cau-truc 24, nam 4, so-lieu 3, cap-do 2, ten 2, lich-su 1, danh-muc 1 | dung 29, da-sua 8 |

`node tools/khoa.mjs xuat` đọc được cả ba hồ sơ. Không có câu chưa chắc. Phần lần 1 (đã khóa) của hồ sơ bản ghi được ghi lại bằng PyYAML: cách viết đổi, nội dung, ngày và mã băm giữ nguyên (đã so).

## Bản nhạc và khuông nhạc

| Bản | Cách đọc | Dùng cho |
|---|---|---|
| Bản in đầu, Kistner, Leipzig [1850], bản của Thư viện Quốc gia Bayern (2 Mus.pr. 4748, số bản in 1751/6847: lần in lại từ cùng bản khắc, Henle gọi E 2) | ảnh trang qua IIIF (`api.digitale-sammlungen.de`, bsb11307527, tr. 16–22) | đếm ô, chỉ dẫn, nốt |
| Schirmer's Library vol. 341 (Joseffy), 1895/1915 | Internet Archive `lisztconsolation00unse`, PDF tr. 34–39, chuyển ảnh bằng PyMuPDF | đối chiếu |
| Bản gõ lại RSB 2011 (Commons/Internet Archive `imslp-s541-liszt-franz`) | PDF | chỉ để so cách đếm (đánh số cả nhịp lấy đà, tách cadenza thành nhiều ô) |

**Số ô đếm được** (không tính nhịp lấy đà; mỗi cadenza một ô, như bản in đầu in): 85 ô.

- 1–23: giai điệu lần một; ô 23 là ô ngân, tay trái Fa♭ – Mi♭ – Rê♭…
- 24: tay trái đi lên, *p*, nối vào cadenza.
- 25: cadenza 1, một ô không vạch nhịp, trải hai dòng.
- 26: *Più animato con passione*, Si trưởng.
- 36: hợp âm *f*.
- 37: *sempre stringendo*, Đô trưởng.
- 41: *ff*, quãng tám.
- 50: *appassionato assai*, La♭.
- 56: *affrettando*.
- 58: hợp âm rải lớn.
- 59: chuỗi đi xuống, *dimin.*, có vạch nhịp ở cuối.
- 60: cadenza 2, *leggiero*.
- 61: *Tempo primo*.
- 75: *più smorz. e rit.*
- 85: hết.

Henle theo bản in đầu (lời tựa). Comments đánh số khớp cách đếm này (ô 44, 51, 53 là các ô có dấu hairpin như bản in đầu).

PTNA có các mốc 37, 41, 61, 77–80, 81–83, 85 khớp cách đếm trên. Nhưng PTNA đặt *Più animato* ở ô 27. Như thế đoạn Si trưởng chỉ còn 10 ô, trái bản nhạc: cả hai ấn bản đều in 11 ô. Trang và dữ liệu nay theo bản in đầu, có ghi chú về PTNA.

Khuông nhạc: 3 khối ví dụ soạn (Mi♭ trưởng). Cả ba đúng lời dẫn, đủ phách, ngón chơi được ở chặng 7.
- Khối 1: giai điệu ngón cái nằm dưới lớp móc đơn của cùng tay.
- Khối 2: các nhóm theo hợp âm Si♭ bảy, mỗi nhóm bắt đầu từ nốt thứ hai của nhóm trước.
- Khối 3: giai điệu khối 1 bằng quãng tám, tay trái nhảy khoảng một quãng tám.

## Đã sửa, đã bỏ (trang)

**Bài học**
- n9 (bỏ): "mở cửa cho Schubert, Schumann, Brahms, Rachmaninoff". Câu chung chung.
- n13: "người nghe nhận ra sau vài nốt" thành câu của Henle ("one of the most frequently played piano pieces").
- n17: lời thơ in trước bài. Bỏ ý "để người chơi đọc trước", theo đúng ý của Henle.
- n24: bỏ "bài nổi tiếng nhất".
- n28: Howard thu "nhạc piano độc tấu" (Hyperion).
- n32: dưới giai điệu là nốt trầm, không phải hợp âm rải.
- n33, n42: cadenza 1 là ô 24–25. Cadenza in bằng nốt cỡ thường, không phải "nốt nhỏ".
- n34, n43, n60, n76: *Più animato* ở ô 26, đoạn Si trưởng 26–36 (bảng Theo dõi, Cấu trúc, Chỗ khó, Kế hoạch).
- n47: ghi chú cách đếm, theo bản in đầu, có nhắc PTNA.
- n49: quan hệ trung âm hóa (Open Music Theory) thay "đặc trưng thời Lãng mạn".
- n78 (`quy-tac`): mỏi, căng thì xem lại cách tập; đau thì dừng ngay. Theo BAPAM và trang `piano/suc-khoe` đã khóa.
- n101: mục Nguồn bỏ Walker; thêm lời tựa Henle và bản in đầu (BSB).

**Hướng dẫn nghe**
- n16: "nổi tiếng hơn hẳn hai bản kia" thành câu của Henle.
- n18: lời thơ đoạn cuối. Người kia "đi và khóc" (*geht und weint*), không phải "đã ra đi".
- n21 (bỏ): "nhiều bản thu chơi chậm và ủy mị". Đánh giá không có nguồn.
- n28: bỏ "vì ở âm vực này ngón cái hát đẹp nhất".
- n31, n38: cadenza không phải "nốt nhỏ".
- n34, n42: cadenza 2 ghi *leggiero*, không phải "quãng ba gãy". Bỏ "như một lời từ biệt"; thêm *dolce armonioso*.
- n46: Bolet. Ghi bản thu Decca, bỏ lời đánh giá phong cách.
- n48: bỏ Kissin, vì video chỉ thấy ở blog. Thay bằng cây đàn Bechstein của Liszt ở Weimar, theo Bechstein và HfM Weimar.
- n51: Howard. Ghi Hyperion CDA66593, bỏ đánh giá.
- n60: mục Nguồn bỏ Walker, Grove; thêm Henle, PTNA, bản in đầu, Oxford Song.

Không thêm hay bớt dòng ở hai bảng Theo dõi. Không sửa `::khoi-nghe{moc=…}` và không đo lại mốc.

## Dữ liệu (`sua-B.yml`, 4 mục)

1. `thong_tin` Độ khó: bỏ ước lượng ABRSM và vế chặng. Ghi Henle 7 (hai bài kia 6), RCM 2022 ARCT, ABRSM không xếp.
2. `hinh.bai-hoc` đoạn: cadenza 1 "ô 24–25", 2 ô; A' "ô 26–36", 11 ô.
3. `hinh.bai-hoc` ghi chú: số ô theo bản in đầu; PTNA đặt *Più animato* ở ô 27.
4. `hinh.nghe`:
   - Chữ: cadenza 1 "nốt dài, không vạch nhịp"; cadenza 2 "leggiero, trôi xuống".
   - Độ dài 23 / 1 / 25 thay 21 / 2 / 26. Phần này có điều kiện, vì chú thích ghi "gần đúng".

Bốn mục hiện trên trang qua `::hop-tac-pham` và `::hinh-cau-truc`: áp xong thì thêm `doi_chu`.

Các trường khác (giọng, nhịp, thời kỳ, kỹ năng, luyện nghe, chip, thông tin còn lại, `ban_thu`) đúng. `ban_thu` đã đối chiếu qua API Commons:
- người chơi Backhaus, thu 15/10/1923 ở London, HMV D 788;
- Public domain (PD-old-70);
- 238,249 giây;
- địa chỉ FLAC và MP3 khớp;
- "đĩa 78 vòng": Public Domain Project số hóa đĩa shellac 78 vòng.

## Chỗ chưa chắc

Không có.

## Câu ở hồ sơ khác

- `piano/quang-tam-buoc-nhay` n47 (Liebestraum ô 37–60, quãng tám, bước nhảy): đúng. Tay trái nhảy ở ô 38–46; quãng tám ở ô 41–49. Trang bài học giữ.
- `piano/lo-trinh` n37: trang giữ quãng tám và hai cadenza. "Khoảng năm phút" hơi dài: ba bản thu trên Commons dài 3:58, 3:59 và 4:43, nên hướng dẫn nghe ghi 4–5 phút.
- `piano/tac-pham-theo-cap` n26, n38: Henle 7; Consolation số 3 (Henle 5) đứng trước Liebestraum. Trang giữ.
- `piano/nha-soan-nhac` n96 (chặng 7): đúng.
- `nhan-dien/dau-van-tay` n35 và `lich-su/nha-soan-nhac` l2 (tên bài): trang giữ tên.

## Việc cho người giao

1. Áp `sua-B.yml`, rồi thêm `doi_chu` cho:
   - dòng Độ khó (bài học);
   - `hinh.bai-hoc` (bài học);
   - `hinh.nghe` (hướng dẫn nghe).
2. Ghép `doi_chu` viết tay của hai trang với khung của `so-chu.mjs --doi-chu`.
3. `piano/lo-trinh` n37 ("khoảng năm phút"): cân nhắc đổi thành "khoảng 4–5 phút" khi mở khóa. Câu không sai hẳn.
4. Grade đã khóa ("Grade 8 trở lên") khớp nguồn: RCM ARCT, Henle 7, ABRSM không có bài.
5. Thuật ngữ chưa có trong `thuat-ngu.yml` (cho D3-L5):
   - chỉ dẫn: *più animato* (animato), *con passione*, *con affetto*, *poco*, *cantando*, *armonioso*;
   - tốc độ: *stringendo*, *Tempo primo* (Tempo I), *affrettando*;
   - khác: notturno, chromatic mediant (trung âm hóa).

## Nguồn hay dùng

- **Bản nhạc:** BSB (IIIF, bản in đầu Kistner); Internet Archive (Schirmer 1915).
- **Henle HN 634:**
  - trang sản phẩm: mức khó từng bài, mô tả, mục về Liszt;
  - lời tựa và Comments (PDF ở `henle.de/media/…`, tìm từ link trên trang sản phẩm).
  - Henle HN 465 (Consolations).
- **Tham khảo khác:**
  - PTNA (trang 23749);
  - IMSLP (wikitext qua `api.php`: S.541, S.298, Myrthen/S.566);
  - Oxford Song (lời thơ, bản dịch Stokes);
  - Open Music Theory (Mediants; Compound Meters), đọc qua Wayback (CDX API để tìm bản 200);
  - Concise Oxford Dictionary of Music (affetto, stringendo, symphonic poem).
- **Đề cương:** RCM 2022 (PDF, PyMuPDF).
- **Bản thu và đàn:**
  - Commons API (Backhaus, Weber, Goldstein);
  - Hyperion CDA66593, CDA67414;
  - Decca (Bolet, Complete Decca Recordings);
  - Bechstein, HfM Weimar (đàn của Liszt);
  - BAPAM (The Healthy Pianist).
- **Không mở được:**
  - Presto, thư viện ICPL: 403;
  - PDF trên IMSLP: không thử.
  - Kissin trên đàn Bechstein chỉ có ở blog andantemoderato.com, không dùng làm nguồn.
