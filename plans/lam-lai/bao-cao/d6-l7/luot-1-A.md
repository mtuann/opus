# D6-L7, lượt 1, phần A

Phần A gồm ba hướng dẫn nghe và lần kiểm định 2 của ba bản ghi:
- `nghe-nhac/bach-goldberg`, `nghe-nhac/scarlatti-sonata`, `nghe-nhac/mozart-k331`;
- `tac-pham/bach-goldberg`, `scarlatti-sonata`, `mozart-k331` (các trường `thoi_ky`, `luyen_nghe`, `hinh`, `ban_thu`).

Ngày 6/11/2026, Claude Opus 5.5.

## Số liệu

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu, cap-do | khuyen-tap | ve-site | Đã sửa | Chưa chắc |
|---|---|---|---|---|---|---|---|---|
| bach-goldberg | 49 | 22 | 6 | 13 | 4 | 4 | 18 | 0 |
| scarlatti-sonata | 42 | 8 | 7 | 18 | 5 | 4 | 14 | 3 (n14, n15, n29) |
| mozart-k331 | 36 | 14 | 6 | 9 | 4 | 3 | 10 | 0 |

Không có `da-bo`. Câu không kiểm được thì viết lại cho cụ thể và ghi `da-sua`. Mọi chỗ sửa có mục `doi_chu` trong hồ sơ. Ở `doi_chu`, `cu` và `moi` là chữ gần đúng: người giao dựng lại bằng `so-chu.mjs --doi-chu` sau khi build.

| Bản ghi (lần 2) | Nhận định | Đúng | Dữ liệu sai | Chưa chắc |
|---|---|---|---|---|
| bach-goldberg | n4–n12 (9) | 8 | n7 (ô Aria: "sarabande") | 0 |
| scarlatti-sonata | n4–n10 (7) | 6 | 0 | n8 ("gieo vần", crux) |
| mozart-k331 | n4–n10 (7) | 7 | 0 | 0 |

Không sửa `src/data/`. Đề xuất nằm ở `sua-A.yml` (2 mục, một có điều kiện).

## Bản nhạc

- **Goldberg.** Đối chiếu với Mutopia `bwv-988-aria.ly` (Bach-Gesellschaft):
  - Aria 32 ô (16 + 16), 3/4, hai dấu nhắc lại;
  - bè trầm ô 1–8 là G F♯ E D B C D G: khối abc 1 khớp từng nốt, đúng quãng tám.

  Chỉ dẫn từng biến tấu (a 1/a 2 Clav., Canone alla …, Adagio…) lấy từ danh sách của IMSLP. Giọng, nhịp, số bè lấy từ bản chuyển soạn guitar trên Mutopia: chỉ 15, 21, 25 ở Sol thứ; biến tấu 15 là canon đảo. Mười một biến tấu "a 2 Clav." khớp Henle ("eleven of the thirty").
- **Scarlatti.** Mutopia không có ba sonata này; PDF của IMSLP không tải. Đã đọc ảnh trang đầu ba bản chép tay trên Commons:
  - K. 380, Parma: 3/4, *And.te Commodo*;
  - K. 141, Worgan: 3/8, *Allegro*, nốt lặp, tay trái vắt lên;
  - K. 466, Venice: C, *And.e Moderato*.

  Chỉ thấy trang đầu, nên phần nửa sau ("vần") chưa đối chiếu được.
- **K. 331.** Mutopia, đủ ba chương:
  - chủ đề 8 + 10 ô;
  - biến tấu 3 La thứ, biến tấu 5 Adagio, biến tấu 6 Allegro 4/4;
  - trio Rê trưởng, quãng 3 và quãng 6;
  - rondo La thứ, La trưởng, Fa♯ thứ;
  - tay trái vắt lên ở biến tấu 4.

## Chỗ sửa đáng chú ý

### bach-goldberg

- Bỏ "Landowska gọi biến tấu 25 là viên ngọc đen", ở cả bảng (n21, n36). Chỉ thấy podcast, blog, Wikipedia.
- Bỏ "sarabande" ở ba chỗ (n14, n29, n45). Không có nguồn bậc 1–2 đọc được. Dữ liệu `hinh` còn chữ này (`sua-A.yml`).
- n8: thay "một trong số ít tác phẩm Bach cho in…, bộ biến tấu đồ sộ nhất" bằng "phần thứ tư của Clavier-Übung". Description sửa theo.
- n18: link "canon" trỏ tới `nhac-ly/22-doi-am`, nhưng trang này không nói về canon. Đã đổi sang `/opus/nhac-ly/28-ket-cau/#phuc-ieu-polyphony`. **Người giao kiểm id bằng link.test.**
- n41–n44, mục Bản thu và mục Chơi:
  - bỏ "nổi tiếng nhất", "bỏ hết dấu nhắc lại";
  - thêm độ dài của Gould 1955 và 1981, theo MusicBrainz;
  - thêm hãng đĩa của Schiff, Hantaï, Pinnock;
  - thay "sau Grade 8" bằng "Henle mức 9".
- Mục Nguồn: bỏ Williams, Wolff, Grove. Thêm Henle, Forkel (bản dịch Terry trên Gutenberg), Netherlands Bach Society, Commons.

### scarlatti-sonata

- n12: Kirkpatrick "cố gắng" xếp theo thứ tự thời gian, dựa theo các tập chép ở Venice (Treccani, Henle). n13: Longo 1906–1910.
- n16: bỏ "vũ điệu dân gian Iberia" và "còn tranh luận". Giữ ý vũ điệu và guitar, theo Treccani.
- n5, n20: "chủ yếu harpsichord". Henle: Scarlatti viết cả cho fortepiano.
- n21, n22, n23: thêm nhịp và chữ tốc độ, theo bản chép tay. Bỏ "vũ điệu Tây Ban Nha" và "ít được biết đến".
- n30: dòng bảng K. 141 bỏ "nhịp đảo phách kiểu vũ điệu", giữ số dòng.
- n33–n35:
  - Horowitz: thêm DG;
  - Argerich: bỏ "hay chơi như encore", thay bằng đĩa Concertgebouw;
  - Hewitt: Hyperion 2016;
  - Scott Ross: bỏ "người đầu tiên", ghi Erato 1984–1985.
- n38: K. 380 từ "≈ Grade 8" thành "ABRSM Grade 7 theo Henle, mức 5". Khớp trang `piano/nha-soan-nhac` (Grade 7). Chặng 6 vẫn đúng.
- Mục Nguồn: bỏ Kirkpatrick 1953, Boyd, Grove.

### mozart-k331

- n18: tên "Alla turca" có lẽ được thêm lúc in, do Mozart hay nhà xuất bản (Henle 2021). Trang cũ ghi "do chính Mozart ghi".
- n23: bản in đầu ghi *Allegrino*, nhiều ấn bản ghi *Allegretto*. Bỏ "nhiều bản thu chơi quá nhanh".
- n24: bản thảo Budapest (9/2014) gồm từ biến tấu 3 chương 1 tới ô 10 của trio. Bỏ "bốn trang", chưa có nguồn. Trước đó chỉ có một tờ các ô cuối chương 3.
- n3: năm sáng tác chưa rõ. NMA đoán 1783, ở Vienna hay Salzburg; Henle cho là sớm hơn, ở Vienna. In tháng 8/1784.
- n16: "chuông" thành "kẻng tam giác". n22: bỏ "siciliana" (ba chỗ).
- n30: bỏ đánh giá Uchida, Barenboim, Schiff; giữ tên (MusicBrainz có bản thu K. 331 của cả ba). n33: Henle mức 6, ABRSM Grade 8.

## Chưa chắc

- scarlatti-sonata n14, n29 và bản ghi n8: "phần cuối nửa đầu trở lại ở cuối nửa sau, ở giọng chính" (gieo vần). Chưa mở được nguồn bậc 1–2: Open Music Theory trả 403 với User-Agent của dự án, Wayback trả 429. Chưa có cả bản nhạc.
- scarlatti-sonata n15: tên "crux" của Kirkpatrick. Chỉ có sách in 1953 và blog. Lượt 2 không tìm được thì bỏ câu, và áp mục có điều kiện trong `sua-A.yml`.

## Nguồn lệch nhau

- Năm tìm thấy bản in riêng của Bach ở Strasbourg: IMSLP và Netherlands Bach Society ghi 1974, Henle ghi 1975. Trang giữ 1974.
- Năm sinh của Goldberg: Terry (1920) ghi khoảng 1720; LoC, theo Grove, ghi rửa tội năm 1727. "Khoảng 14 tuổi" theo Grove.

## Câu ở trang khác trỏ tới trang của phần A

Đều giữ đúng:
- Scarlatti "bậc thầy bắt chéo tay" (n17, Treccani "acrobatici incroci di mano");
- K. 141 có bắt chéo tay, "nốt lặp lại cực nhanh gần như suốt bài";
- Goldberg có `::khoi-nghe` và bảng "Theo dõi khi nghe";
- Aria có nhiều nốt hoa mỹ;
- K. 331 là hướng dẫn nghe Sonata La trưởng.

## Thuật ngữ chưa có ở thuat-ngu.yml

canon, quodlibet, fughetta, khúc mở màn kiểu Pháp (ouverture), bắt chéo tay, hình thức hai đoạn, crux, trio, hợp âm rải.

## Nguồn hay dùng

- Bản nhạc: Mutopia (`.ly` trên GitHub); ảnh chép tay Scarlatti trên Commons; trang bìa Goldberg trên Commons.
- Tham khảo:
  - IMSLP (wikitext qua `api.php`);
  - lời tựa và trang sản phẩm Henle (HN 1159, 574, 1221, 581, 1300);
  - Treccani, *Dizionario Biografico*;
  - Forkel/Terry trên Project Gutenberg;
  - Netherlands Bach Society;
  - Concise Oxford Dictionary of Music trên Encyclopedia.com;
  - LoC JSON.
- Bản thu: Commons (`tools/audio/commons.py info`), MusicBrainz API, MusicWeb International (Scott Ross).
- Gallica (BnF) chặn bằng Cloudflare.
