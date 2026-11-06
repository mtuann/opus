# D6-L2, nhánh gom: review (chờ lượt 2 bổ sung, kiểm mẫu và khóa)

Nhánh `moi/d6-l2-gom`, 05/11/2026. Lô D6-L2 gồm 6 bài học tác phẩm chặng 3 (`piano/tac-pham/bach-prelude-bwv939`, `beethoven-sonatina-sol`, `burgmuller-arabesque`, `chopin-valse-la-thu`, `clementi-sonatina`, `tchaikovsky-cau-nguyen-buoi-sang`) và 6 bản ghi tác phẩm (lần kiểm định 2, trường chưa khóa).

- Chủ repo giao agent làm theo đề xuất, review sau.
- Người review: Claude Opus 5.5. Người này không làm lượt 1 hay lượt 2 của lô.
- Hai agent con Claude Sonnet 5.5 chỉ tìm và đọc nguồn, không sửa repo. Review tự mở lại các nguồn dùng để quyết định.
- Không khóa gì. Làm theo cách của `d6-l1-gom.md`.

## Lượt 2

Kết quả lượt 2 đã nhập ở các commit trước (`d6-l2-gom/ket-qua-*.yml`). Danh sách cần review: `can-review-{1,2,du-lieu}.txt`.

| Phần | Câu | dung | sai | khong-chac |
|---|---|---|---|---|
| Trang | 327 | 313 | 4 | 10 |
| Bản ghi | 125 | 109 | 0 | 16 |

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, mở đầu bằng "Review D6-L2-gom: …". Mọi câu đã review có `review: dung`. Lần kiểm định cuối của 12 hồ sơ có `nguoi.review`.

### Câu về chính site (47 câu)

Đã kiểm trên các nguồn sau: bản xem (`dist/`), trang đích, khối abc, `tac-pham.yml`, `cap-do.yml`, và site cũ cho trang chưa chuyển. Kết quả: 46 câu đúng; 1 câu sửa; 1 dòng nguồn được thay.

- Câu sửa: `burgmuller-arabesque` n47. Khối abc ghi `!p!`, chữ trang lại viết "Ô 1–2 rất nhỏ" (tức *pp*). Đã sửa thành "Ô 1–2 nhỏ (*p*)".
- Dòng nguồn thay: `burgmuller-arabesque` n74. Dòng Nguồn dẫn Wikipedia, mà bài Wikipedia ghi Burgmüller mất ở Paris, là sai. Đã thay bằng *Deutsche Biographie*, như trang La candeur ở D6-L1-gom.

Soát nhãn:
- `clementi-sonatina` n40 (cổ tay cứng, mỏi, "dừng nghỉ nếu thấy căng"): câu có yếu tố sức khỏe. Đổi sang `quy-tac`, nguồn BAPAM như `musette-re` n52, rồi đưa vào lượt 2 bổ sung.
- `clementi-sonatina` n22 và `beethoven-sonatina-sol` n27 (fortepiano "tiếng mỏng và rõ"): nhận xét về âm sắc không có nguồn. Đã bỏ vế ấy, câu còn lại là lời khuyên nghe: "để so tiếng đàn với đàn hiện đại".

### Bốn câu lượt 2 ghi `sai`

Review tự kiểm cả bốn câu. Lượt 2 đúng ở cả bốn, và trang đã sửa theo câu đúng của lượt 2.

| Câu | Kiểm |
|---|---|
| `beethoven-sonatina-sol` n12, n72 | Năm của ấn bản Wiener Urtext UT 50290 là 2020. DNB (d-nb.info/1228647941) ghi "Erscheinungsdatum: [2020] © 2020". |
| `beethoven-sonatina-sol` n56 | MEI TROMPA (Nr1_2), ô 19: hairpin `dim` bắt đầu ở `tstamp 1`, và fermata đặt trên nốt Mi5 ở phách 1. Vậy nhỏ dần bắt đầu ngay trên nốt có dấu ngân. |
| `tchaikovsky-cau-nguyen-buoi-sang` n76 | Mutopia 2032: hợp âm La bảy (Đô♯ ở bè trầm) nằm ở phách 3 ô 7. Ô 8 là hợp âm Rê, có nốt treo Sol–Fa♯. |

### Câu `khong-chac` và những chỗ cần tìm bản nhạc

**Beethoven, chương II (Romanze).** Review đọc MEI TROMPA Nr1_2 (theo bản Breitkopf) bằng script:
- nhịp 6/8, đầu chương chỉ có chữ "Romanze", không ghi tốc độ;
- nhịp lấy đà rồi 40 ô;
- dấu nhắc lại: A (ô 0–8), rồi B và A cùng nhắc lại (ô 8–29);
- ô 9–16 ở Rê trưởng, ô 17–19 là Rê bảy, ô 22–29 nhắc nguyên ô 1–8, coda từ nửa sau ô 29 đến ô 40;
- tay trái: nốt trầm rồi hai hợp âm.

Dữ liệu n16, n17, n19, n21 đúng.

**Beethoven, lvbeethoven.it.** Bản lưu Wayback ngày 14/7/2026 mở được. Trang có các câu: "apparvero a stampa intorno al 1807 … presso Altona, Rudolphus", "I manoscritti originali sono sconosciuti", "Beethoven non menzionò mai le sonatine". Với nguồn này:
- trang n10, n11, n75 và dữ liệu n15 đúng;
- n7: bỏ "dễ hơn", vì Henle xếp cả hai bài mức 3; giữ "ngắn hơn" (hai chương thay vì ba);
- n59: bỏ vế "kèm sắc thái và số ngón của người biên tập"; câu viết lại theo Nottebohm và bản Breitkopf, rồi đưa vào lượt 2 bổ sung;
- n53: dùng nguồn OMT mà lượt 2 tìm được.

**Chopin, Valse La thứ.** Review đọc hai trang nhạc mẫu của Henle HN 1822 (2017), bằng ảnh dựng từ PDF:
- đầu bài ghi *Allegretto*, nhịp 3/4, có nhịp lấy đà;
- dấu nhắc lại ‖: ô 17–24 :‖ và ‖: ô 25–40 :‖;
- chủ đề trở lại ở ô 25 và ô 41;
- ô 33–40 ở La trưởng;
- bài dài 56 ô.

Bản này khớp với bản rdj mà lượt 1 dùng. Henle in thêm một dấu mở nhắc lại ở ô 41 mà không có dấu đóng; trang không nhắc tới chi tiết này. Với nguồn này, dữ liệu n10, n19, n20, n25, n26, n27 đúng.

Các câu Chopin còn lại:
- **n18 (niên đại 1832–1833):** bỏ. Chỉ thấy niên đại này ở Wikipedia (dẫn Belotti). Ấn bản Quốc gia Ba Lan ghi "Walc a WN 63 – 1847–49" và xếp bài vào nhóm những tác phẩm cuối cùng của Chopin. Dòng thông tin còn lại: "Ấn bản Quốc gia Ba Lan xếp vào 1847–1849, Maurice Brown ghi 1843".
- **n17 (Brown 1843):** dùng danh sách tác phẩm Chopin trên IMSLP và bảng của Henle HN 131.
- **n62 (Eigeldinger):** thay bằng lời bình của Ấn bản Quốc gia cho chính bài này (Ekier, Kamiński). Theo lời bình, chơi nốt đầu của các cặp nốt hoa mỹ cùng lúc với tay trái thì hợp phong cách hơn, nhưng chơi trước phách cũng được. Đưa vào lượt 2 bổ sung.
- **n56:** nguồn là lời tựa của Carl Mikuli (1879). Review đọc nguyên văn: "spielte immer eine, die begleitende Hand streng gemessen fort". Vì đây là lời của một học trò, chữ "Các học trò của Chopin kể" thành "Carl Mikuli, một học trò của Chopin, kể".
- **n78:** bỏ bản WIMA và năm 1999 (không có nguồn), thay bằng trang mẫu Henle.
- **n81, n82:** mục Nguồn bỏ sách Eigeldinger, thêm lời tựa Mikuli và lời bình của Ấn bản Quốc gia. Cả n78, n81, n82 đưa vào lượt 2 bổ sung.
- **n22 ("thường gồm 14 bản"):** viết lại: "Một số album … như *14 Waltzes* của Dinu Lipatti". Đưa vào lượt 2 bổ sung.
- **n79:** dùng nguồn Open Library mà lượt 2 tìm được.

**Bach BWV 939.** Review mở trang Bach Digital P 804 fasc. 53 (bản lưu Wayback 21/1/2026). Trang ghi: "No title or ascription to any composer", "1726/1727 oder später (Stinson)", nguồn gốc từ J. P. Kellner. Chữ "duy nhất" đã được lượt 2 xác nhận ở câu cùng nội dung của trang bài học (n13). Với các nguồn này:
- dữ liệu n15 và n17 đúng;
- trang n52 (bài tập 3 thấp hơn ô 14 một bậc): review đối chiếu khối abc với Mutopia, đúng;
- trang n9: dùng nguồn OMT mà lượt 2 tìm được.

**Arabesque n29 ("được thu rất nhiều").** Giữ bỏ.

### Clementi: *Allegro* hay *Spiritoso*

Quyết theo lượt 2, không áp `sua-A.yml` (cả ba mục). Review đọc PDF bình chú của Henle HN 848. Phụ lục in Sonatina I theo bản in sau, E6 (khoảng 1821, "With considerable improvements, BY THE AUTHOR"), có dòng "Anhang / Sonatine I / I Allegro". *Spiritoso* là chữ của bản Köhler/Schirmer.

Bình chú không nêu tên chương I của bản 1797 (E1). Vì vậy câu "Allegro là chữ của Clementi" chỉ chắc cho bản in sau.

Kết quả:
- chip, `thong_tin` và trang n48 giữ nguyên;
- "hoặc Wiener Urtext" giữ: tập Urtext Primo 6 in trọn Op. 36 số 1 và 2 (bài điểm sách Pianodao).

### Nơi Burgmüller mất

Ông mất ở Beaulieu, một làng thuộc Marolles-en-Hurepoix, gần Paris. Nguồn:
- Weber-Gesamtausgabe (A0025C9): "† February 13, 1874 in Beaulieu bei Marolles-en-Hurepoix";
- *Deutsche Biographie* chỉ ghi "Beaulieu";
- PTNA cũng ghi Marolles-en-Hurepoix.

Ông không mất ở Beaulieu-sur-Mer. Đã sửa ghi chú ở các hồ sơ D6-L1 `piano/tac-pham/burgmuller-la-candeur` (đoạn `ghi_chu` đầu, n16, một mục `doi_chu`) và `du-lieu/tac-pham/burgmuller-la-candeur` (n16). Chữ trang ("sống ở Pháp đến cuối đời") đúng với cả hai nơi, nên không đổi.

### Grade và dữ liệu

Chip "≈ Grade" phải khớp `grade` đã khóa (`src/du-lieu.mjs`), nên không sửa. Chỉ sửa dòng Độ khó trong `thong_tin`, là trường chưa khóa:

| Bài | Dòng Độ khó | Chip |
|---|---|---|
| BWV 939 | Thêm "RCM xếp bài ở Level 5 (đề cương 2022)". Review đã mở PDF RCM, tr. 44. | Giữ "≈ Grade 3" theo grade đã khóa. |
| Arabesque | "Khoảng ABRSM Grade 3" thành "Khoảng ABRSM Grade 2–3", cho khớp ABRSM Grade 2 và RCM Level 3. | Giữ "≈ Grade 3". |
| Chopin | Không đổi. ABRSM Grade 6 nằm trong "Grade 5–6". | Không đổi. |

Thay đổi khác ở dữ liệu: Chopin, bỏ vế 1832–1833.

`src/data/tac-pham.yml` đổi 3 dòng, đều ở trường chưa khóa. Mọi chỗ đổi chữ trang hay dữ liệu đều có `doi_chu`: 14 mục mới và 4 mục cũ được cập nhật. `so-chu.mjs --doi-chu` báo "đã đủ" cho cả 6 trang.

## Lượt 2 bổ sung

`d6-l2-gom/bo-sung.yml` có 8 câu (`xuat D6-L2 --con-lai`):

- `beethoven-sonatina-sol` n59;
- `chopin-valse-la-thu` n22, n62, n78, n81, n82;
- `clementi-sonatina` n40 (đổi nhãn);
- `clementi-sonatina` n44: lời khuyên tập, script chọn ngẫu nhiên để mẫu đủ 3 câu.

Phần dữ liệu không có câu nào: `xuat du-lieu/tac-pham/<6 slug> --con-lai` ra 0 câu, nên không có `bo-sung-du-lieu.yml`.

Các câu đổi chữ còn lại không chạy thêm lượt 2, theo quy ước của D6-L1-gom. Đó là những câu chỉ theo câu đúng của lượt 2, chỉ bỏ vế không có nguồn, hay chỉ thêm nguồn mà lượt 2 đã nêu (như Bach n20, Arabesque n23).

## Kiểm

- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua, 0 hỏng.
- `node tools/khoa.mjs tinh`: không lỗi.

## Chủ repo cần biết

- **Grade đã khóa lệch nguồn.**
  - BWV 939 khóa "Grade 3"; RCM xếp Level 5, khoảng Grade 4.
  - Arabesque khóa "Grade 3"; ABRSM xếp Grade 2.

  Nếu muốn chip theo nguồn thì phải mở khóa `grade` (ví dụ Grade 3–4 và Grade 2–3).
- **Trang mẫu Henle HN 1822** có dấu mở nhắc lại ở ô 41 mà không có dấu đóng. Bản rdj không có dấu này. Trang không nhắc tới.
- **Niên đại bản in đầu của Valse La thứ.** Trang và `cap-nhat` (đã khóa) viết "in năm 1860 dưới tên Charlotte de Rothschild", theo IMSLP và đã qua lượt 2. Nhưng Ấn bản Quốc gia và Henle chỉ nói bản in đầu tiên dưới tên Chopin là năm 1955 (*La Revue musicale*). Hai điều này không mâu thuẫn, nhưng chỉ có IMSLP nói về bản in năm 1860.
- **Còn trống trong lần kiểm định cuối của 12 hồ sơ:** `nguoi.luot_2` (người làm lượt 2 và lượt 2 bổ sung) và `nguoi.kiem_mau`.

## Lượt 2 bổ sung và trạng thái khóa (người gom)

- Lượt 2 bổ sung (Claude Opus 5.5): `ket-qua-bo-sung.yml` 8 dung; đã `nhap`.
- Đã điền `nguoi.luot_2` cho 12 hồ sơ (6 trang, 6 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l2-gom/kiem-mau.yml` (`xuat D6-L2 --mau 8`).

## Kiểm mẫu và khóa (06/11/2026)

Chủ repo giao Claude Opus 5.5 (phiên Cowork) kiểm mẫu thay, điền `kiem_mau` và khóa; người kiểm không phải chủ repo (`nguoi.kiem_mau` ghi rõ). 8 nhận định ở `d6-l2-gom/kiem-mau.yml`, kết quả `d6-l2-gom/kiem-mau-ket-qua.yml`: không câu nào sai. Nguồn ngoài mở lại bằng agent đọc trang web; file .ly của Mutopia đọc trên bản GitHub của MutopiaProject; câu về site kiểm trên repo. Câu chỉ kiểm được một phần ghi rõ trong `ghi_chu` của file kết quả. Khóa mọi trang và bản ghi của lô; bản build thật 231 trang (cùng D6-L1 đến D6-L10).

Khi khóa, `khoa` báo mười câu thiếu nguồn (lượt 1 để trống, lượt 2 và review không bắt): bốn câu độ dài bản thu trong bản ghi (`bach-prelude-bwv939` n25, `beethoven-sonatina-sol` n23, `burgmuller-arabesque`, `tchaikovsky-cau-nguyen-buoi-sang`) ghi nguồn là file IMSLP của bản thu, như các hồ sơ đã khóa cùng loại; bốn câu định nghĩa thuật ngữ (`burgmuller-arabesque` n27, n57, n69, n70; `chopin-valse-la-thu` n46) ghi nguồn là `src/data/thuat-ngu.yml` (đã khóa); `chopin-valse-la-thu` n24 (lời khuyên tập đã đổi chữ) đổi `da-sua` thành `khong-can-nguon`.
