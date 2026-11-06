# D6-L4, lượt 1, phần A

Phần A gồm 3 bài học, 1 hướng dẫn nghe và 3 bản ghi. Bài học: `bach-invention-1` (chặng 4), `mozart-k545` (chặng 5), `beethoven-anh-trang` (chặng 5). Hướng dẫn nghe: `nghe-nhac/beethoven-moonlight`, dùng chung bản ghi `beethoven-anh-trang`. Ngày 5/11/2026, Claude Opus 5.5.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu, cap-do | dinh-nghia, quy-tac | khuyen-tap | ve-site | Đã sửa (gồm lời khuyên viết lại) | Đã bỏ | Chưa chắc |
|---|---|---|---|---|---|---|---|---|---|---|
| bach-invention-1 | 82 | 25 | 12 | 4 | 6 | 24 | 11 | 14 | 0 | 1 (n71) |
| mozart-k545 | 80 | 21 | 12 | 6 | 8 | 20 | 13 | 19 | 0 | 0 |
| beethoven-anh-trang | 104 | 34 | 19 | 7 | 7 | 23 | 14 | 13 | 0 | 1 (n17) |
| nghe-nhac/beethoven-moonlight | 29 | 10 | 8 | 7 | 0 | 1 | 3 | 13 | 0 | 0 |

Không có `da-bo`. Câu thừa được viết lại cho cụ thể và ghi `da-sua`. Lời khuyên viết lại ghi `khong-can-nguon`, kèm `ghi_chu` chữ cũ.

Bản ghi (lần 2, chỉ trường chưa khóa):

| Bản ghi | Nhận định | Đúng | Dữ liệu sai | Chưa chắc |
|---|---|---|---|---|
| bach-invention-1 | n7–n28 (22) | 19 | 0 | n20 (tốc độ "thường ♩ ≈ 60–80"), n25 (Bärenreiter, Wiener Urtext), n28 (`lic`) |
| mozart-k545 | n7–n26 (20) | 18 | n20 (dòng Độ khó) | n23 (Wiener Urtext, Bärenreiter) |
| beethoven-anh-trang | n7–n29 (23) | 21 | n23 (dòng Độ khó) | n26 (Bärenreiter, Wiener Urtext, ABRSM) |

Không sửa `src/data/`. Đề xuất nằm ở `sua-A.yml` (5 mục): 2 mục không điều kiện, 3 mục có điều kiện.

## Khuông nhạc

Có 10 khối: 2 trích đoạn, 8 ví dụ soạn.

- **Bach, ô 1–2.** Đối chiếu với Mutopia `bach-invention-01` (Bach-Gesellschaft), đọc tệp `.ly` và in nốt MIDI theo ô bằng script Python (mido). Khớp từng nốt cả hai tay. Nốt hoa mỹ của bản gốc (láy trên ở ô 1, 2) cố ý không ghi, như trang nói.
- **Ánh trăng, ô 1–9.** Đối chiếu với Mutopia `moonlight1-a4.ly` và `moonlight1.mid` (Winterberger 1908). Khớp 9/9 ô cả hai tay: chùm ba, giai điệu, bè trầm quãng tám, Rê♮, Si♯. Trang ghi sẵn hai chỗ khác bản in.
- **Ví dụ soạn.** Bach 2, K. 545 3, Ánh trăng 3. Cả tám khối đúng điều trang nói, đủ phách, ngón chơi được.
  - Ô cuối bài tập 2 của Bach là hợp âm kết dài nửa ô.
- **Số ô.** Chương 1 K. 545 có 73 ô, Ánh trăng 69 ô, Invention 22 ô. Mọi số ô nêu trên các trang đều đếm trên MIDI.

## Chỗ đã sửa trên trang

Mỗi chỗ sửa có mục `doi_chu` trong hồ sơ. Ở `doi_chu`, `cu` và `moi` là chữ gần đúng, người giao dựng lại từ khung của `so-chu.mjs --doi-chu`.

### bach-invention-1

- **Đã biết từ trước, n76.** "Cùng chặng: K. 545, Träumerei" thành "Chặng sau". Theo dữ liệu đã khóa, Invention ở chặng 4, hai bài kia ở chặng 5.
- **n64–n66, n52: tên dấu láy.** Theo thuật ngữ đã khóa, ký hiệu không gạch là **láy trên**, có gạch là **láy dưới**. Chữ mới giữ "theo bảng của Bach là một láy rền ngắn" ở nốt Si ô 1, để `piano/not-hoa-my` n116 vẫn đúng. Thêm chỗ có láy dưới: ô 5 và ô 13, theo Mutopia `\mordent`.
- **n20, n21: đàn của Bach.** Trước ghi "harpsichord, clavichord"; nay ghi theo trang bìa ("Clavier"). Câu "sắc thái mà ông không có" quá: clavichord có sắc thái.
- **Bỏ chữ không kiểm được:**
  - n7: "nền cho mọi fugue";
  - n26: tên Gould, Schiff, Hewitt, chưa thấy trang bản thu, kèm câu đánh giá về Gould;
  - n47: "thường dùng" ngón;
  - n61, n80: "phổ biến";
  - n73: "hai bước tiếp phổ biến", thay bằng mức Henle và ABRSM.
- **n82: mục Nguồn.** Bỏ hai sách in chưa đọc. Thay bằng:
  - lời tựa và bình chú Henle HN 591;
  - trang bìa 1723 (bach-cantatas.com);
  - bài của Yo Tomita (QUB).

### mozart-k545

- **n27: ô 12 là hợp âm Sol trưởng, không phải Rê trưởng.** Sai ở cả bảng Theo dõi lẫn bảng Cấu trúc. Theo MIDI, ô 11–12 chỉ có Sol và Đô/Sol.
- **n30: bỏ "có *sf*" ở phần phát triển, hai bảng.** Henle nói nguồn gốc không có ký hiệu sắc thái nào, nên *sf* là của người biên tập.
- **n4.** "Hình thức sonata trong bốn, năm phút" thành "trong 73 ô nhịp". Bản thu dài 2–3,5 phút khi không nhắc lại.
- **n20, n21: âm vực đàn.** Trước ghi "Fa1–Fa6"; nay Fa1–Sol6, theo Tafelmusik ("FF to g’’’"), như hồ sơ op49-2. Bỏ "tiếng nhẹ, tắt nhanh, búa bọc da"; thêm cần gạt đầu gối và cây đàn Walter của Mozart.
- **n14, n15.** Bỏ "Mozart dạy đàn để kiếm sống, bài rất có thể dành cho học trò". Thay bằng hai điều trong lời tựa Henle: gần như không biết gì về hoàn cảnh ra đời; ngày 2/8 Mozart gửi chị gái "những bài piano mới nhất".
- **n38, chương 2.** Trước ghi "chủ đề tám ô rồi biến thể"; nay ghi "mười sáu ô (chủ đề tám ô rồi tám ô tiếp nối)".
- **Bỏ chữ không kiểm được:**
  - n6: "xương sống", "hàng trăm bài";
  - n8: "tốt nhất";
  - n9: "chậm hơn", trái với trang Clementi, vì hai bài cùng tốc độ đích;
  - n10: "ít Alberti hơn";
  - n11: "sung sức nhất";
  - n24: tên Uchida, Pires, Schiff và câu "hạt ngọc";
  - n25, n70: so sánh K. 331 và K. 330, K. 283;
  - n61: "nhạc Cổ điển gần như không có rubato";
  - n68: "các ấn bản phổ thông thường in rất nhiều".
- **n80: mục Nguồn.** Bỏ Gerber (macromusic.org) và Rosen, chưa mở; thêm Mutopia.

### beethoven-anh-trang

- **n35, n45: ô 22 là hợp âm Đô♯ trưởng, không phải "Đô♯ bảy".** Sai ở hai bảng. Ô 22 không có nốt Si; Fa♯ thứ ở thế 6/4 rồi Đô♯.
- **n2.** Bỏ "chương nhạc nổi tiếng nhất của Beethoven", cả ở mô tả.
- **n6.** Bỏ câu "gặp lại rất nhiều trong nhạc Lãng mạn".
- **n12, n13.** Bỏ so sánh "nhẹ nhàng hơn", "sáng sủa hơn"; ghi chặng và điều trang đích nói.
- **n16.** Bỏ "nhỏ nhắn", "kịch tính nhất".
- **n18.** Bỏ "âm trầm mỏng hơn", như review của `piano/ban-dap` n48.
- **n88.** Bỏ vế bàn đạp giữa: Fitch không nói.
- **n91, n92: ấn bản và ngón cho chùm ba.** Trước ghi "các ấn bản thường thêm..." và "ngón khác nhau nhiều giữa các ấn bản". Nay viết theo bản Winterberger đã đối chiếu: ngón 1–3–5 ở ô 1, 1–2–4 ở ô 3.
- **n94.** Viết lại "chương 2 nhẹ nhàng; chương 3 Grade 8 trở lên" theo IMSLP (60 và 200 ô) và Henle (mức 7, "ABRSM: Piano ARSM").
- **n104: mục Nguồn.** Bỏ Rowland (sách in); ghi rõ Rosen trích qua Fitch; thêm blog Henle về *una corda*.

### nghe-nhac/beethoven-moonlight

- **n6.** "Thời kỳ: Cổ điển sang Lãng mạn" thành "Cổ điển", theo IMSLP. Khớp `thoi_ky` của bản ghi dùng chung.
- **n15–n18.** Bỏ "như lời thì thầm trên mặt nước" và "sự tĩnh lặng ấy là điểm đặc biệt". "Nốt trầm đi từng bước" thành các nốt trầm cụ thể. Thêm "không có chữ *f* nào".
- **n15, n26: thuật ngữ.** "Bộ ba nốt móc (triplet)" và "dòng triplet" thành "chùm ba (liên ba móc đơn)", như trang bài học.
- **n20–n25: bảng Theo dõi.** Sáu dòng viết lại theo bản nhạc, có số ô. Hai dòng cũ quá chung: "Đoạn giữa..." và "Đỉnh điểm cảm xúc...". Nay khớp mốc 112, 149, 195, 282 giây của bản Pitman và bảng ở trang bài học.
- **n27.** Bỏ "(Có lẽ đó chính là ý đồ của Beethoven)". Thay bằng điều lời tựa Henle nói: ba chương nối liền nhau (*attacca*).
- **n29: mục Nguồn.** Bỏ Burkholder và Grove, chưa đọc; thay bằng lời tựa Henle HN 1062.

## Chỗ chưa chắc

- **`bach-invention-1` n71.** "Nhiều ấn bản cũ thêm dấu luyến, sắc thái và tốc độ" chưa có ví dụ đã mở. Lượt 2 kiểm, hoặc bỏ vế này.
- **`beethoven-anh-trang` n17.** Chữ "trẻ" (nữ bá tước trẻ) chưa có nguồn năm sinh. Phần còn lại đúng.
- **`beethoven-anh-trang` n87.** "Đổi theo hòa âm là cách thông dụng": giữ ở mức lời khuyên. Lượt 2 hay review đổi nhãn nếu thấy cần nguồn.
- **Bản ghi:**
  - các ấn bản Bärenreiter, Wiener Urtext, ABRSM: chưa mở trang (như D6-L3);
  - `bach-invention-1` n20 (tốc độ), n28 (`lic`).

## Đã kiểm cho các câu `ve-site` ở hồ sơ khác

Đều đúng trên bản nhạc và giữ nguyên trên trang mới:

- **`beethoven-anh-trang`:**
  - mục `### Bàn đạp: *senza sordino*` (id `ban-ap-senza-sordino`) không đổi;
  - Sol♯ lặp nhịp chấm dôi cuối ô 5, ô 6–9;
  - quãng tám Sol♯ ngân ở bè trầm ô 28–39, nối ở ô 35–37.
- **`mozart-k545`:**
  - vẫn có các mục Cấu trúc (từng ô), Chỗ khó và cách tập, Bài tập chuẩn bị, Kế hoạch tập, Diễn tấu;
  - Alberti trầm – cao – giữa – cao;
  - láy rền có nốt kết ở ô 4 (`f8\trill e16 f`).
- **`bach-invention-1`:**
  - khối chính theo Bach-Gesellschaft, nốt hoa mỹ "chưa ghi";
  - nốt Si ô 1 "theo bảng của Bach là một láy rền ngắn": chữ có thêm tên "láy trên", người giao xem lại câu n116 có cần đổi theo không;
  - hai bè quan trọng ngang nhau;
  - invention hai bè.
- **`nghe-nhac/beethoven-moonlight`:** hướng dẫn nghe chương 1, có link sang bài học.

## Việc cho người giao

- **Ghép `doi_chu`.** Ghép với `node tools/chuyen/so-chu.mjs <trang> --doi-chu` sau `npm run build:xem`, nhất là mô tả trang của `beethoven-anh-trang`, vì đã đổi `description`.
- **Áp `sua-A.yml`.**
  - Hai mục không điều kiện, đều là dòng Độ khó:
    - `mozart-k545`: ghi kỳ đề cương ABRSM 2027–2028 và 2017–2018, Grade 6. "Chương 3 khó hơn một chút" lệch Henle ("noticeably").
    - `beethoven-anh-trang`: Henle có ghi mức riêng cho chương 1, mức 4 trong HN 1820.
  - Ba mục có điều kiện:
    - tốc độ Invention;
    - `lic` của bản thu Meyer;
    - "Triplet đều" thành "Chùm ba đều".
  - Chữ hiện qua `::hop-tac-pham`: sau khi áp thì thêm `doi_chu` cho trang.
- **Grade đã khóa.** Không thấy lệch nguồn.
  - K. 545 Grade 6 có trong đề cương ABRSM.
  - Invention Grade 4–5: ABRSM 2015–2016 xếp Grade 4.
  - Ánh trăng chương 1 Grade 6–7 là ước lượng; Henle xếp mức 4, không mâu thuẫn.
- **Sức khỏe.** `mozart-k545` n45, n54 (cổ tay cứng, mỏi) xếp `quy-tac`, nguồn BAPAM.
- **Nhãn `ve-site`.** Các câu về bài tập soạn và khối nhạc: kiểm ở `khuong_nhac`.
- **Thuật ngữ chưa có bản ghi trong `thuat-ngu.yml`:**
  - *invention* hay *inventio*, phức điệu, chủ đề đảo, chuỗi (Bach);
  - Alberti (K. 545);
  - alla breve, triplet hay chùm ba (Ánh trăng).

  Không sửa `thuat-ngu.yml`.
- **Mốc nghe.** `mozart-k545` có 8 mốc cho 10 dòng của bảng Theo dõi: hai dòng chương 2, 3 không có mốc. Không phải nhận định, nhưng người giao nên biết.

## Nguồn hay dùng

- **Bản nhạc, Mutopia (`.ly`, `.mid`):**
  - `bach-invention-01` (Bach-Gesellschaft);
  - `K545-1`, `K545-2`, `K545-3` (nguồn IMSLP);
  - `moonlight` (Winterberger 1908).

  Đọc bằng script Python (mido) đặt ở thư mục scratchpad.
- **Henle, PDF trên henle.de:**
  - lời tựa HN 591 (Scheideler), bình chú HN 591;
  - lời tựa HN 164 (Herttrich), lời tựa HN 1062 (Gertsch, Perahia);
  - trang sản phẩm HN 591, 164, 1062, 1820;
  - blog Henle về *una corda*.
- **Lịch sử:**
  - trang bìa 1723 (bach-cantatas.com);
  - Yo Tomita (QUB, bản lưu Wayback; trang gốc trả 403);
  - Crumey (tên *Moonlight*);
  - IMSLP: K. 545, K. 543, K. 550, K. 551, Op. 27 số 1, số 2, Schwanengesang, 15 Inventions;
  - Tafelmusik (đàn Walter);
  - U.S. Copyright Office (bản thu trước 1972).
- **Bàn đạp:** Graham Fitch, "Pedalling the Moonlight Sonata" (trích Rosen tr. 108).
- **Từ điển:** Concise Oxford Dictionary of Music trên Encyclopedia.com: invention, inversion, sequence, polyphony, Alberti bass, allegro, adagio, sostenuto, acciaccatura, sonata, Neapolitan sixth. Thêm Dolmetsch (Ornaments).
- **Đề cương:** ABRSM 2015–2016 (Wayback), 2017–2018 (Wayback), 2021–2022, 2027–2028 (PDF).
- **Bản thu:**
  - Commons API: Meyer, Musopen K. 545, Pitman;
  - Library of Congress (Schnabel), Deutsche Grammophon (Kempff), MusicWeb (Brautigam, BIS-SACD-1473).
- **Không mở được:**
  - DuckDuckGo: đòi xác minh người;
  - Open Music Theory: bản lưu Wayback không có các chương cần, nên dùng COD;
  - QUB: trả 403, đọc bản lưu Wayback.
