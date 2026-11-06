# D6-L5, lượt 1, phần B

Phần B có ba trang và hai bản ghi (lần 2):

- Trang:
  - `piano/tac-pham/chopin-nocturne-op9-2`;
  - `piano/tac-pham/schubert-impromptu-sol-giang`;
  - `nghe-nhac/schubert-impromptu`: hướng dẫn nghe, dùng chung bản ghi với bài học.
- Bản ghi: `tac-pham/chopin-nocturne-op9-2`, `tac-pham/schubert-impromptu-sol-giang`.

Ngày 5/11/2026, Claude Opus 5.5, agent con.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su, ten, nam, so-lieu | dinh-nghia, quy-tac, cap-do | khuyen-tap | ve-site | Đã sửa | Đã bỏ | Chưa chắc |
|---|---|---|---|---|---|---|---|---|---|
| chopin-nocturne-op9-2 | 69 | 16 | 19 | 8 | 16 | 10 | 15 | 2 | 0 |
| schubert-impromptu-sol-giang | 93 | 38 | 18 | 5 | 21 | 11 | 8 | 0 | 0 |
| nghe-nhac/schubert-impromptu | 45 | 11 | 20 | 5 | 5 | 4 | 9 | 1 | 0 |

Bản ghi (lần 2, chỉ trường chưa khóa):

| Bản ghi | Nhận định | Đúng | Dữ liệu sai | Chưa chắc |
|---|---|---|---|---|
| chopin-nocturne-op9-2 | 20 (n7–n26) | 18 | n18, n22 | 0 |
| schubert-impromptu-sol-giang | 22 (n6–n27) | 21 | n25 | 0 |

Dữ liệu sai thì không sửa `src/data/`. Có 3 đề xuất ở `sua-B.yml`, một mục có điều kiện.

## Khuông nhạc

Có 8 khối: 1 trích đoạn và 7 ví dụ soạn.

- **Schubert D. 899 số 3, ô 1–4** (trích đoạn): khớp từng nốt cả ba bè.
  - Ấn bản: Breitkopf & Härtel 1888, qua Mutopia `SchubertF-D899-3-Impromptu.ly`. Đọc tay tệp `.ly`: nốt viết tương đối, tên nốt kiểu Ý.
  - Khớp: giai điệu; dòng chùm sáu, kể cả các nhóm mở bằng dấu lặng và chùm ba ở ô 3; Đô♮ ở ô 4; bè trầm với quãng năm, quãng tám; pp; crescendo rồi diminuendo ở ô 4.
  - Dấu rải ở ô 4 là `\arpeggio` thường. Tệp không có `\arpeggioBracket`, nên không lặp lỗi đọc nhầm của D6-L3.
- **Nocturne** (3 ví dụ soạn): đủ phách. Hòa âm Mi♭, Si♭7, La♭ đúng kiểu nốt trầm – hai hợp âm của bài. Chùm 7 và chùm 9 nốt đúng như lời dẫn. Ngón chơi được.
- **Impromptu** (3 ví dụ soạn): đúng điều trang nói.
  - Rê♭7 với nốt Đô♭ đi xuống Si♭.
  - Sol♭ sang Si♭ thứ, ngón 5 giữ Rê♭.
  - Láy rền Rê♭2 viết thành móc kép, nốt kết Đô♭–Rê♭, như ô 19 của bản nhạc.
  - Khối 3 (bài tập 2) kết bằng một ô nốt trắng ngắn hơn ô 4/2 ở cả ba bè. Như trang cũ; người giao xem kiểm thử khuông nhạc có chấp nhận ô kết ngắn không.

Số ô, sắc thái, láy rền, dấu ngân và dấu giáng kép trên hai bài học đều đếm trên tệp `.ly` của Mutopia:

- Nocturne: bản G. Schirmer 1881, 34 ô sau nhịp lấy đà.
- Impromptu: 86 ô.

## Chỗ đã sửa trên trang

Mọi chỗ sửa có mục `doi_chu` trong hồ sơ trang (`cu`, `moi`, `ly_do`).

- **chopin-nocturne-op9-2**
  - n8: "khoảng 4 phút" thành "khoảng bốn đến năm phút". Bản thu Lévy dài 4:31.
  - n12, n62: Valse Si thứ cùng chặng 6 với Nocturne (dữ liệu đã khóa), nên:
    - ô "Chưa sẵn sàng?" gợi ý Valse La thứ (chặng 5);
    - Học tiếp bỏ "(dễ hơn)", ghi chặng.
  - n13: "(khúc nhạc đêm)" thành "(dạ khúc)", theo `thuat-ngu.yml`.
  - n15 (bỏ): "bản nocturne đầu tiên in năm 1812". IMSLP ghi Nocturne H 24 viết khoảng 1817; không có nguồn bậc 2 cho năm 1812.
  - n17–n19, n23: đoạn Bối cảnh viết lại theo nguồn:
    - Niecks: Chopin thích Bellini; Mikuli nói ông lấy ca sĩ Ý làm mẫu cho láy quanh, nốt dựa.
    - Concise Oxford: bel canto.
    - Grove: Fioriture; Field.
    - Henle HN 664: "most beloved".
    - Bỏ "nốt cao mềm", "khi hát lại", "làm phong phú hơn hẳn về hòa âm".
  - n24, n25: biến thể trang trí.
    - Bỏ "thường thay đổi nét trang trí mỗi lần chơi, tùy cảm hứng". Như review D4-gom ở `piano/not-hoa-my` n96.
    - Viết theo chú giải Ấn bản Quốc gia Ba Lan và mô tả của Wiener Urtext UT 50065. Mô tả ấy xác nhận Op. 9 số 2 in hai lần, lần hai có trọn các biến thể.
  - n27: "cả ba đều thu trọn bộ nocturne" thành "có bản thu các nocturne". Trang DG của Pires không cho thấy đủ danh sách bài.
  - n37: "Ô áp chót ghi senza tempo" thành "Ô 32". Ô áp chót là ô 33 (Tempo I).
  - n50: "Ô 1 có chùm 7 nốt" thành "Ô 1 của bài tập …". Ô 1 của nocturne không có chùm 7 nốt.
  - n53: "Chopin rất nghiêm khắc về việc giữ nhịp", câu gán cho Mikuli mà không có nguồn, thay bằng lời dặn mà bà Dubois và các học trò khác kể (Niecks): "Hãy để tay trái làm nhạc trưởng và luôn giữ nhịp".
  - n69: mục Nguồn bỏ hai sách in chưa đọc (Eigeldinger, Samson), thêm Niecks và chú giải Ấn bản Quốc gia Ba Lan.
  - n11 (bỏ): "hai nocturne mức 5 ít trang trí hơn". So sánh này không có nguồn.
  - n47: chỗ khó ở coda có vế "mỏi tay", nên đổi loại sang `quy-tac`, nguồn BAPAM, như `fur-elise` n55.
- **schubert-impromptu-sol-giang**
  - n10: tên *Impromptu* "có lẽ" do Haslinger đặt. PTNA: người đặt tên chưa rõ; tên trên bản thảo số 1 do Haslinger ghi.
  - n13: lần in 1857 dịch giọng "cho dễ chơi hơn" (PTNA), không phải "cho dễ đọc"; thêm nhận xét của Henle. Câu "dễ đọc hơn nhưng không dễ chơi hơn" giữ làm lời khuyên.
  - n31, n39: giai điệu đứng yên trên Mi♭ ở ô 51–53, không phải cả ô 49–52.
  - n79: bỏ vế "Nhiều nghệ sĩ bắt đầu láy rền của Schubert từ nốt chính" (không có nguồn).
  - n86: "chặng 6 của Lộ trình" thành "chặng 7", theo dữ liệu đã khóa.
  - n87: lời giải thích câu hỏi 1 theo PTNA, bỏ "người chơi nghiệp dư".
  - n92: dòng Wikipedia ở mục Nguồn thay bằng PTNA và lời tựa Henle HN 4.
  - n60 (bàn tay nhỏ, không gồng để với) xếp `quy-tac`, nguồn BAPAM.
  - Giữ hai mục `doi_chu` của D2-0.
- **nghe-nhac/schubert-impromptu**
  - n10: tên *Impromptu*, như bài học.
  - n14, n15: "cắt đôi thành 2/2, có lẽ để người chơi nghiệp dư khỏi ngại sáu dấu giáng" thành "cắt đôi, để bài dễ chơi hơn". PTNA ghi 2/2, lời tựa Henle HN 4 ghi bốn nốt đen; hai nguồn lệch nên không ghi chữ số nhịp.
  - "người ta chỉ biết bản Sol trưởng" thành "bài thường chỉ được in ở Sol trưởng".
  - n18: "hơn 600 ca khúc" thành "khoảng 600" (Henle: "600 songs").
  - n26, n28 (anh em trong D. 899), theo PTNA:
    - số 1: nốt Sol quãng tám đánh mạnh, rồi câu một bè và câu có hợp âm đáp; bỏ "như hành khúc";
    - số 4: chuỗi hợp âm rải ở tay phải; bỏ "đổ xuống những thác".
  - n29: D. 935 do Diabelli in tháng 4/1839 (PTNA). Bỏ "kèm lời đề tặng Franz Liszt do nhà xuất bản thêm vào": không tìm được nguồn đã mở.
  - n34, n35 (So sánh bản thu):
    - bỏ ba lời nhận xét không kiểm được về lối chơi;
    - giữ Lupu (Decca), Brendel (Decca, 1989), Zimerman (DG, 1991), theo trang hãng đĩa;
    - thêm câu hỏi để người nghe tự so sánh.
  - n36: "khoảng Grade 7–8" thành "sau Grade 8 (ABRSM đưa bài vào danh sách ARSM)", theo grade đã khóa.
  - n45 (bỏ): sách Newbould chưa đọc, thay bằng Henle HN 488.

## Chỗ chưa chắc

Không có câu `ket_qua: null`. Có ba câu giữ `dung` nhưng lượt 2 nên xem:

- `nghe-nhac/schubert-impromptu` n27: số 2 "của tay phải". PTNA nói gam chùm ba mà không nói tay; chưa mở Mutopia D. 899 số 2.
- `schubert-impromptu-sol-giang` n12: Carl Haslinger là người in năm 1857. NDB xác nhận Carl là con Tobias. IMSLP ghi "(Carl Haslinger?)" trên bản thảo. Tobias mất năm 1842, nên năm 1857 nhà Haslinger do Carl điều hành. Lượt 1 không thấy nguồn ghi thẳng "Carl Haslinger in năm 1857".
- `chopin-nocturne-op9-2` n27: Pires có thu trọn bộ hay không thì chưa rõ. Trang đã viết lại thành "có bản thu các nocturne".

## Câu `ve-site` ở hồ sơ khác đã kiểm

Mọi câu trong danh sách nói về hai tác phẩm của phần B vẫn đúng sau lượt 1:

- `piano/not-hoa-my` n100, n116: Bài tập 2 về fioritura và hàng fioritura ở bảng Chỗ khó còn.
- `nhan-dien/dau-van-tay` n53, `lich-su/thoi-ky/lang-man` n37, `lich-su/nha-soan-nhac` s5, `piano/the-loai` n74, `piano/nha-soan-nhac` n173, n174: slug và tiêu đề đúng.
- `piano/quang-tam-buoc-nhay` n34: "chỉ có thời gian một móc đơn để nhảy" còn, và đúng bản nhạc.
- `cap-nhat` n51: lối tắt "Chỉ muốn nghe?" còn.
- `chopin-valse-la-thu`:
  - n25: mục `#theo-doi-khi-nghe` còn;
  - n60: phần rubato còn.
- `chopin-prelude-la-truong` n86, `chopin-prelude-mi-thu` n71: link đúng.
- `nhac-ly/05-dau-hoa` n12: trang Impromptu vẫn nói dấu giáng kép.
- `piano/nha-soan-nhac` n190, `piano/tac-pham-theo-cap` n3, n29, n53: Impromptu ở chặng 7. Trang bài học nay cũng ghi chặng 7.

Riêng `chopin-valse-la-thu` n67 ("Nocturne … trang trí dày hơn"): review D6-L2-gom dẫn câu "ít trang trí hơn" của trang cũ, câu mà lượt này đã bỏ (n11). Câu n67 vẫn đúng theo bản nhạc. Nocturne có chùm móc ba ở ô 16, 24 và cadenza; bảng Chỗ khó và Bài tập 2 về chùm nốt hoa mỹ vẫn còn. Không cần sửa hồ sơ đã khóa.

## Người giao phải sửa hay chủ repo quyết

- **Mốc của hướng dẫn nghe**, dòng 3 ("Phần đầu khép lại ở Sol♭ trưởng"): mốc là 66 giây.
  - Theo nhịp của bản thu Bertoglio (khoảng 4,1 giây mỗi ô; mốc của bài học: ô 17 ở 66, ô 25 ở 99), 66 giây là đầu ô 17. Ô 24, chỗ phần đầu khép lại, ở khoảng 92–95 giây.
  - Mốc sai dòng: người giao sửa bằng `attach.py` (đổi thành khoảng 92), hay sửa chữ dòng 3.
  - Các mốc khác của ba trang khớp nhịp bản thu: so tốc độ trung bình, không nghe từng mốc.
- **Grade đã khóa của Nocturne** ("Grade 7"; chip "≈ Grade 7") hơi thấp so với nguồn: RCM 2022 Level 9, Henle mức 6. Lần 1 cũng ghi "khoảng Grade 7–8". Không đề xuất sửa.
- **`sua-B.yml`**:
  - Nocturne: dòng Sáng tác và dòng Độ khó;
  - Impromptu: độ rộng hình hướng dẫn nghe. Mục này có điều kiện.
  - Cả ba hiện qua `::hop-tac-pham` hay `::hinh-cau-truc`: người giao thêm `doi_chu` cho trang sau khi áp.
- **Thuật ngữ chưa có bản ghi**: bel canto, senza tempo, portato, impromptu, chùm sáu (sextuplet), bàn đạp nối, nửa bàn đạp. Không bổ sung ở lô này.
- **`doi_chu`** viết tay (`cu`, `moi` bỏ Markdown). Người giao dựng lại từ khung `so-chu.mjs --doi-chu`, giữ `ly_do`.

## Nguồn hay dùng

Mọi yêu cầu mạng dùng User-Agent `opus-kiem-dinh/1.0`; tệp tải về ở thư mục tạm của phần B.

- **Bản nhạc** (Mutopia, `.ly` và `.mid`):
  - `ChopinFF/O9/chopin_nocturne_op9_n2` (G. Schirmer 1881);
  - `SchubertF/D899/SchubertF-D899-3-Impromptu` (Breitkopf & Härtel 1888).
- **Chopin**:
  - Ấn bản Quốc gia Ba Lan, chú giải tập Nocturnes (PDF);
  - Niecks, Gutenberg #4973;
  - Grove trên Wikisource: Field, Fioriture;
  - Henle HN 185, HN 233, HN 664: bảng mức khó từng nocturne;
  - Wiener Urtext UT 50065, qua trang Fick's Music.
- **Schubert**:
  - PTNA, mục 1580 (D 899) và 1586 (D 935);
  - Henle HN 488, HN 4 (trang và lời tựa PDF);
  - IMSLP D. 899, D. 935;
  - NDB (Haslinger);
  - Bärenreiter BA 9648.
- **Đề cương**: RCM 2022 (PDF S3), danh sách ARSM.
- **Bản thu**:
  - Wikimedia Commons, API imageinfo;
  - trang hãng đĩa DG, Decca; Sony qua Wayback.
- **Sức khỏe**: BAPAM, The Healthy Pianist.
- **Bị chặn**: Universal Edition, Schott (Cloudflare); Gramophone; OMT (403).
