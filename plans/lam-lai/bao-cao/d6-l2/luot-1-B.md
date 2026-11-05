# D6-L2, lượt 1, phần B

Claude Opus 5.5, 05/11/2026, nhánh `moi/d6-l2`. Ba trang bài học (`piano/tac-pham/burgmuller-arabesque`, `chopin-valse-la-thu`, `tchaikovsky-cau-nguyen-buoi-sang`) và ba bản ghi cùng tên (lần 2, các trường chưa khóa).

## Số liệu

| Hồ sơ | Nhận định | Theo loại | Kết quả |
|---|---|---|---|
| trang burgmuller-arabesque | 75 | cau-truc 21, khuyen-tap 14, ve-site 10, dinh-nghia 7, lich-su 6, ten 5, nam 5, danh-muc 4, so-lieu 3 | dung 55, khong-can-nguon 14, da-sua 5, da-bo 1 |
| trang chopin-valse-la-thu | 73 | cau-truc 18, khuyen-tap 16, ve-site 14, lich-su 7, ten 5, nam 4, dinh-nghia 3, cap-do 2, so-lieu 2, danh-muc 2 | dung 44, khong-can-nguon 15, da-sua 10, chưa chắc 4 |
| trang tchaikovsky-cau-nguyen-buoi-sang | 80 | cau-truc 31, khuyen-tap 18, ve-site 14, lich-su 8, ten 6, danh-muc 2, so-lieu 1 | dung 59, khong-can-nguon 18, da-sua 3 |
| bản ghi burgmuller-arabesque (n7–n27) | 21 | cau-truc 8, ten 4, lich-su 2, cap-do 2, nam 2, danh-muc 2, so-lieu 1 | dung 20, da-sua 1 (n23) |
| bản ghi chopin-valse-la-thu (n6–n30) | 25 | cau-truc 9, nam 6, ten 4, cap-do 3, lich-su 1, danh-muc 1, so-lieu 1 | dung 23, chưa chắc 2 (n17, n18) |
| bản ghi tchaikovsky-cau-nguyen-buoi-sang (n6–n30) | 25 | cau-truc 11, nam 4, ten 4, lich-su 2, cap-do 2, danh-muc 1, so-lieu 1 | dung 24, da-sua 1 (n27) |

Khuông nhạc: 10 khối. 1 trích đoạn (Cầu nguyện buổi sáng ô 1–8, Schirmer 1904 qua Mutopia 2032): khớp từng nốt, cả hai tay, đối chiếu bằng MIDI tải mới (script đọc MIDI viết tay, không thư viện) và `.ly`. 9 ví dụ soạn (3 + 3 + 3): đúng điều trang nói, ngón chơi được, mỗi ô đủ phách.

Nhận định bản ghi chỉ ghi `truong` là trường chưa khóa. Chip và dòng "Độ khó" nói về cấp độ ghi `truong: [chip]` hay `[thong_tin]`, nguồn là nguồn của `grade` ở lần 1 (đã mở lại ABRSM 2019–2020, RCM 2022, trang Henle).

## Đã sửa, đã bỏ (trang)

Mỗi chỗ có mục `doi_chu` viết tay theo chữ hiển thị (chưa chạy `so-chu.mjs`).

- **Arabesque**
  - n1, n3: câu mở đầu và description. Bỏ "một trong những bài được yêu thích nhất", "nghe khó hơn thực tế" (như La candeur ở D6-L1). "Chưa đầy một phút" thành "Khoảng một phút", vì bản thu gợi ý dài 65 giây.
  - n10: "Chưa đến một phút" thành "Khoảng một phút".
  - n14: "ở lại [Paris] đến cuối đời" thành "sống ở Pháp đến cuối đời"; bỏ "được ưa chuộng".
  - n29 (bỏ): "bài này được thu rất nhiều". IMSLP có 2 bản thu.
  - n65: link "cùng chặng" tới Valse La thứ (nay chặng 5) thay bằng Cầu nguyện buổi sáng (chặng 3).
- **Valse La thứ**
  - n1: câu mở đầu và description. "Với nhiều người, đây là bản nhạc Chopin đầu tiên" thành "Đây là valse dễ nhất của Chopin theo thang độ khó của Henle". Henle xếp bài mức 3, thấp nhất trong các valse.
  - n4: "vừa sức người mới qua chặng sơ cấp" thành "vừa sức người đã vững trình độ trung cấp" (chặng 5).
  - n10, n12: bỏ "món không thể thiếu của các phòng khách ở Paris"; "khoảnh khắc ngẫu hứng" thành "chỗ co giãn nhịp" (Britannica, Henle HN 1822).
  - n16: bỏ "Prod'homme 1939" và "số đặc biệt". Chi tiết này chỉ thấy ở Wikipedia; bài MQ 1939 của Prod'homme có tên "Two Musical Libraries of Paris" (theo Crossref) nhưng không đọc được. Giữ "1955, La Revue musicale" (Henle).
  - n20: Op. 34 số 2: bỏ "dài hơn", thêm mức Henle 5 so với 3.
  - n24: bỏ "nhiều người thấy Lipatti… Rubinstein…" và tên hai bản thu, viết lại thành gợi ý tự so sánh.
  - n33, n34: coda "nhỏ dần đến lặng", "khép lại lặng lẽ" thành "có một láy rền ở ô áp chót, khép lại ở La thứ". Bản thảo không ghi sắc thái.
  - n69: "cùng chặng": Clementi, Arabesque (chặng 3) thay bằng Mozart K. 545, Träumerei (chặng 5, chưa chuyển nên hiện "sắp có").
- **Cầu nguyện buổi sáng**
  - n14: "phác thảo cả 24 bài trong vài tuần" thành "phác thảo xong cả 24 bài vào đầu tháng 5". Tchaikovsky Research: bắt đầu khoảng 13/5, xong 16/5 (lịch mới).
  - n23: Phụng vụ Op. 41 viết tháng 5–6/1878, không phải "mùa hè". Câu chung "nhạc lễ Chính thống giáo Nga hát không có nhạc cụ" thay bằng điều TR ghi về Op. 41: "hợp xướng bốn bè không nhạc đệm".
  - n35: ô 12 "chỗ to nhất bài" thành "f có dấu nhấn, đỉnh của câu 2". Lý do: Schirmer cũng ghi f ở đầu coda, và nốt cao nhất bài ở ô 16.

## Dữ liệu (`sua-B.yml`)

- `burgmuller-arabesque` `thong_tin` Độ khó:
  - cũ: "Khoảng ABRSM Grade 3 (ước lượng)";
  - mới: "Khoảng ABRSM Grade 3: ABRSM xếp bài ở Grade 2 (đề cương 2019–2020), RCM Level 3; Henle mức 1".
- `tchaikovsky-cau-nguyen-buoi-sang` `hinh`, đoạn Coda: "· pp" thành "· f → pp".

Cả hai chữ hiện trên trang (qua `::hop-tac-pham`, `::hinh-cau-truc`), nên áp xong thì thêm `doi_chu`.

## Chưa chắc

- Valse, trang:
  - n56: học trò kể rằng tay đệm giữ nhịp khi Chopin co giãn giai điệu.
  - n62: theo Eigeldinger, nốt hoa mỹ vào đúng phách.

  Hai câu chỉ có nguồn là sách in. Bản Eigeldinger trên Internet Archive chỉ cho mượn; lời tựa của Mikuli là PDF trên IMSLP, bị chặn. Đề nghị: nếu lượt 2 không tìm được, viết n62 thành lời khuyên và bỏ tên Eigeldinger.
- Valse, trang n78: bản WIMA "1999" và "hai bản cùng cho 56 ô". PDF IMSLP bị chặn, không vòng qua. Đề nghị: bỏ năm và vế "hai bản cùng", nếu lượt 2 cũng không mở được.
- Valse, trang n79: sách Brown (Macmillan 1960). Chỉ thấy ở Wikipedia.
- Valse, bản ghi:
  - n17: "Maurice Brown ghi 1843". Henle ghi 1843 nhưng không nói theo ai.
  - n18: "học giả cho là 1832–1833" (Belotti). Chỉ thấy ở Wikipedia.

  Đề nghị: "ấn bản Henle ghi 1843", và bỏ vế 1832–1833 nếu lượt 2 không có nguồn.
- Bản thu Valse (bản ghi n29): Commons ghi phạm vi công cộng (PD-author, Musopen); IMSLP ghi cùng bản thu là CC BY 4.0. Site dùng file Commons, nên ghi `dung`. Đã có tên Musopen trong `by`.

## Việc cho người giao

1. Áp `sua-B.yml`, rồi thêm `doi_chu` cho dòng Độ khó (Arabesque) và nhãn coda trong hình (Tchaikovsky).
2. Chạy `npm run build:xem` và `node tools/chuyen/so-chu.mjs <trang> --doi-chu` cho ba trang để ghép `doi_chu` viết tay. Đáng soát nhất:
   - description;
   - các dòng bảng "Theo dõi khi nghe";
   - đoạn có link "sắp có" (Valse: Nocturne, Valse Si thứ, K. 545, Träumerei).
3. Nơi Burgmüller mất:
   - Deutsche Biographie ghi "Beaulieu";
   - PTNA ghi "Beaulieu, Marolles-en-Hurepoix" (Essonne, gần Paris);
   - hồ sơ La candeur n16 (D6-L1) viết Beaulieu-sur-Mer.

   Chữ trang ("sống ở Pháp") đúng với cả hai; chỉ ghi chú của hồ sơ La candeur có thể cần sửa.
4. Grade Arabesque (đã khóa, Grade 3): ABRSM có xếp bài, ở Grade 2 (2019–2020); RCM Level 3; Henle mức 1. Lần 1 lượt 2 đã nêu. Chủ repo cân nhắc "Grade 2–3" khi mở khóa; lần này chưa đổi.
5. Điều hồ sơ khác đòi giữ, đã soát:
   - Arabesque: đoạn tiểu sử dài (Regensburg 1806, Paris 1832, dạy piano, nhạc salon, *La Péri* 1843); Op. 100 số 2; ngón nhanh và staccato.
   - Valse:
     - cấu trúc A 1–16, B 17–24 nhắc lại, A' 25–32 cùng C 33–40 nhắc lại, A'' 41, 56 ô;
     - in năm 1860 dưới tên Charlotte de Rothschild;
     - tay trái valse nhảy;
     - chặng 5 và Grade 5–6 (thân trang không còn ghi chặng 3 hay Grade 3–4).
   - Tchaikovsky:
     - bối cảnh Florence 2/1878, Kamenka, 24 bài, đề tặng Volodya Davydov;
     - kết cấu hợp xướng bốn bè.

     Chữ "trong vài tuần" đổi thành mốc đúng.
6. Thuật ngữ *risoluto* chưa có trong `thuat-ngu.yml`; nghĩa đã kiểm theo Treccani (Arabesque n35).

## Nguồn hay dùng

- Mutopia: 203 (`25EF-02`, l'Arabesque, Litolff) và 2032 (Morning Prayer, Schirmer 1904), `.ly`, PDF và MIDI tải mới. MIDI tải mới khác `../opus-zero/_imslp/mid/mut_burg02.mid` và `mut_tch01.mid` ở phần đầu tệp; nốt của Arabesque giống nhau. Thêm 25EF-07 và 25EF-15 để kiểm câu Học tiếp.
- Bản LilyPond `rdj/music` (B. 150, chép theo bản thảo ở BnF, có `\barNumberCheck`).
- IMSLP wikitext qua `api.php?action=parse&prop=wikitext`: Op. 100, 105, 109, *La Péri*, B. 150, Op. 34, 69, 70, Op. 39, Category.
- Henle: HN 131 (Comments, Preface; trang sản phẩm có mức khó từng valse), HN 1822 (trang mẫu Valse La thứ có lời bình), HN 1726 (mức Arabesque), HN 45 Preface, Henle Blog (valse 2024).
- Chopin National Edition: PDF bảng số WN. chopin.pl (Chopin đến Paris 5/10/1831).
- Tchaikovsky Research: Children's Album, Liturgy, Symphony No. 6, Kamenka, Vladimir Davydov, Nadezhda von Meck (đọc wikitext qua `api.php`).
- Deutsche Biographie, NDB, PTNA (Burgmüller). BnF data trả "Application indisponible" ngày 05/11.
- ABRSM 2019–2020 (Wayback), RCM 2022 (PDF S3), Britannica "waltz" (Wayback), CNRTL "arabesque", Treccani "risoluto", Wiktionary ru "утренний".
- Open Music Theory: Binary Form, Rondo, Embellishing Tones, Diatonic Sequences, Modal Mixture, Leading-Tone Chord, Phrase Model (IAC/PAC). Mở bằng User-Agent trình duyệt.
