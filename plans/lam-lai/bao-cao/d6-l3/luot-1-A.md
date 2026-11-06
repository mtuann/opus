# D6-L3, lượt 1, phần A

Phần A gồm 3 bài học chặng 4 và 3 bản ghi cùng tên: `bach-prelude-do`, `beethoven-op49-2`, `fur-elise`. Ngày 5/11/2026, Claude Opus 5.5.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu, cap-do | dinh-nghia, quy-tac | khuyen-tap | ve-site | Đã sửa | Đã bỏ | Chưa chắc |
|---|---|---|---|---|---|---|---|---|---|---|
| bach-prelude-do | 100 | 43 | 16 | 10 | 2 | 13 | 16 | 12 | 0 | 1 |
| beethoven-op49-2 | 113 | 55 | 6 | 15 | 6 | 16 | 15 | 15 | 1 | 1 |
| fur-elise | 90 | 35 | 16 | 8 | 6 | 13 | 12 | 13 | 0 | 4 |

Bản ghi (lần 2, chỉ trường chưa khóa): mỗi bản ghi 22 nhận định (n7–n28).

| Bản ghi | Đúng | Dữ liệu sai | Chưa chắc |
|---|---|---|---|
| bach-prelude-do | 18 | n23 | n19, n21, n26 |
| beethoven-op49-2 | 18 | n17, n22 | n20, n25 |
| fur-elise | 16 | n18, n23 | n13, n17, n21, n26 |

Dữ liệu sai thì không sửa `src/data/`. Đề xuất ghi ở `sua-A.yml` (8 mục, có mục có điều kiện).

## Khuông nhạc

Có 11 khối: 3 trích đoạn và 8 ví dụ soạn.

Ba trích đoạn khớp từng nốt cả hai tay:

- **Bach, khung hòa âm 35 ô.** Script Python (mido) in năm nốt đầu của từng ô từ MIDI Mutopia `wtk1-prelude1`. Kiểm chéo với MusicXML ASAP và bản quét Novello (Harold Brooke). Kết quả: 35/35 ô khớp hai nốt tay trái, ba nốt tay phải và tên hợp âm phía trên.
  - Ô 34, bè trên tay trái: Mutopia ghi Si2, ASAP ghi Đô3, MIDI CPM ghi Rê3. Bản Novello in rõ Si2, nên khung (Si2) đúng.
  - Mọi ô nêu trên trang (6, 10, 11, 12, 14, 19, 20, 22–24, 24–31, 32–35) đều đếm trên bản nhạc và khớp.
- **Op. 49 số 2, ô 1–8.** So với Mutopia (Breitkopf & Härtel 1862–1865), qua MIDI và tệp `.ly`: khớp nốt, dấu luyến, láy rền với nốt kết, chữ *p* ở ô 6 và chỗ đổi khóa. Chương có 122 ô; mọi số ô trên trang khớp.
- **Für Elise, nhịp lấy đà và ô 1–8.** So với Mutopia (Breitkopf & Härtel 1888): khớp.

Tám ví dụ soạn đúng điều trang nói, đủ phách, ngón chơi được.

## Chỗ đã sửa trên trang

Mọi chỗ sửa có mục `doi_chu` trong hồ sơ trang, sinh từ diff (`cu`/`moi` đã bỏ Markdown).

- **bach-prelude-do**
  - n6: bỏ "nền của mọi lối đệm hợp âm rải về sau".
  - n18: bản trong *Clavier-Büchlein* (BWV 846a) chỉ còn "sớm hơn", bỏ "ngắn hơn": không nguồn nào đã mở nói vậy.
  - n20: câu về lối dạo đầu ngẫu hứng thay bằng định nghĩa prelude của Concise Oxford Dictionary of Music.
  - n30: Gounod "về sau thành bài *Ave Maria*". Theo IMSLP, bản 1853 in dưới tên *Méditation*, lời *Ave Maria* có ở bản 1859.
  - n32: bỏ câu đánh giá về Gould. Câu về Schiff viết theo ghi chú của chính ông trong Henle HN 14: có thể chơi trọn tập mà không chạm bàn đạp.
  - n73: "nhắc lại hai lần" thành "chơi hai lượt".
  - n87: Prelude BWV 847: bỏ "nhanh và mạnh hơn nhiều", thay bằng "một trong số ít bài có chỉ dẫn tốc độ của Bach".
  - n89: bỏ "theo gương Bach".
  - n96–n99: mục Nguồn bỏ ba sách in chưa đọc, thay bằng lời nói đầu Henle HN 14, blog Henle về ô Schwencke, Thayer (bài của Neefe năm 1783), bản Novello.
- **beethoven-op49-2**
  - n2: mô tả và câu mở đầu: "chương sonata thật đầu tiên mà nhiều người học có thể chơi trọn" thành "chương sonata trọn vẹn mà bản in đầu tiên gọi là 'sonata dễ'".
  - n12: "bè trầm đi từng bước" thành "bè trầm có giai điệu riêng".
  - n18–n20, n109 (bối cảnh, theo lời giới thiệu Henle):
    - số 2 có lẽ viết năm 1796;
    - bỏ "được biết đến trước hết như nghệ sĩ piano";
    - việc Carl chào các nhà xuất bản: từ cuối năm 1802 đến khi in, tháng 1 năm 1805.
  - n23: bỏ "rất gần ngôn ngữ của Haydn và Mozart".
  - n24: Septet "1799", không phải "1799–1800" (theo Henle).
  - n25: âm vực đàn Vienna Fa1–Sol6 theo Tafelmusik; bỏ "tiếng nhẹ và tắt nhanh".
  - n33: bỏ tên Kempff, Brendel, Schiff vì chưa thấy trang bản thu. Giữ Brautigam (BIS).
  - n48: ô 122 có hợp âm, rồi dấu lặng có dấu ngân.
  - n66: chùm ba ở ô 53, 56 đi xuống, nên tên hàng bỏ "đi lên".
  - n83: ghi rõ ô của các chuỗi gam ở Rê trưởng và Đô trưởng.
  - n101, n102: bỏ "nhẹ nhàng hơn", "buồn và hát".
  - Viết lại thành lời khuyên hai câu chung không nguồn: "Nhạc Cổ điển gần như không co giãn nhịp" và "bản Breitkopf đáng tin về nốt nhạc".
  - n112 (`da-bo`): bỏ hai sách in chưa đọc ở mục Nguồn (Cooper, Rosen).
- **fur-elise**
  - n2: mô tả và câu mở đầu theo Henle: "một trong những tác phẩm nổi tiếng nhất của Beethoven".
  - n8, n83: "chủ đề quay lại ba lần" thành "vang lên ba lần".
  - n10: bỏ "rất nhiều người dừng ở tám ô đầu".
  - n24: giả thuyết Röckel: của Kopitz, đã bị Lorenz phản bác (theo danh mục Beethoven của Henle, 2014). Bỏ "nữ ca sĩ", "có tài liệu gọi là Elise".
  - n25: giả thuyết Barensfeld: có thể là học trò piano của Therese Malfatti, giả thuyết của Steblin. Bỏ "ca sĩ, quê Regensburg".
  - n31: bỏ câu tả tiếng fortepiano; câu "nhiều người chơi chậm" viết lại thành lời khuyên.
  - n70: bỏ "và nhiều ấn bản khác" (bàn đạp).
  - n74: bỏ "hay bàn đạp".
  - Câu chung về bản "đơn giản hóa" viết lại thành lời khuyên.
  - n81: K. 545: bỏ "dài hơi hơn".
  - n87–n89: mục Nguồn thay ba sách in bằng:
    - lời nói đầu và bình chú Henle HN 1347;
    - mục WoO 59 trong danh mục Beethoven của Henle (2014), thay bản Kinsky–Halm 1955;
    - Beethoven-Haus.

## Chỗ chưa chắc

- `bach-prelude-do` n57: "ngón 4 và 5 yếu hơn" chưa có nguồn.
- `beethoven-op49-2` n87: nghĩa của "ma non troppo". `fur-elise` n30, n84: nghĩa của "poco" trong *Poco moto*. Lý do chung:
  - COD trên Encyclopedia.com chỉ có mục *moto*;
  - Merriam-Webster và Cambridge trả 403.
- `fur-elise` n14: "những năm sáng tác dồi dào nhất". Đây là đánh giá, chưa có nguồn.
- `fur-elise` n16: nghĩa "chuyện vặt" của *bagatelle*.
- Bản ghi:
  - `bach-prelude-do` n19: "ngắn hơn".
  - `bach-prelude-do` n21: "thường ♩ ≈ 60–72". Bốn bản thu đã đo cho ♩ ≈ 52–78.
  - Các ấn bản Bärenreiter và Wiener Urtext: `bach-prelude-do` n26, `beethoven-op49-2` n25, `fur-elise` n26. Không mở được danh mục.
  - `beethoven-op49-2` n20 (ma non troppo).
  - `fur-elise` n13: "đoạn A ≈ Grade 3".
  - `fur-elise` n17: nghĩa của WoO.
  - `fur-elise` n21 (poco).

## Việc cho người giao

- Ghép `doi_chu` với `node tools/chuyen/so-chu.mjs <trang> --doi-chu` sau `npm run build:xem`.
- Áp `sua-A.yml`. Chữ hiện qua `::hop-tac-pham`, nên trang cần thêm mục `doi_chu` sau khi áp.
  - Bỏ "(ước lượng)" ở dòng Độ khó:
    - `bach-prelude-do`: Trinity Grade 5, danh sách từ 2023;
    - `beethoven-op49-2`: RCM 2022 Level 8;
    - `fur-elise`: RCM 2022 Level 7.

    Đã mở PDF đề cương RCM 2022 (tr. 60, 64, 73).
  - `beethoven-op49-2`: năm sáng tác "có lẽ 1796".
  - `fur-elise`: bản viết tay đề "27 tháng 4", không ghi năm. Câu cũ "27 tháng 4 năm 1810" sai theo Henle.
  - Đề xuất có điều kiện:
    - `bach-prelude-do`: bỏ "ngắn hơn"; tốc độ;
    - `fur-elise`: bỏ "đoạn A ≈ Grade 3" ở dòng Độ khó và ở chip.
- Grade đã khóa không đổi, và không thấy chỗ lệch.
- Hình của `fur-elise`: độ rộng 22, 16, 20, 18, 5, 21 lệch 1–2 ô so với cách đánh số thường dùng (22, 15, 22, 17, 5, 22). Chú thích đã ghi "gần đúng", nên không sai; đổi hay không tùy người giao.
- Câu ở hồ sơ khác trỏ tới các trang này:
  - Đã giữ:
    - lối tắt "Chỉ muốn nghe?" (`cap-nhat` n51);
    - id `#theo-doi-khi-nghe` và bảng với đủ các ô (`nhac-ly/26-phan-tich` n7, `bach-prelude-bwv939` n30);
    - âm nền át ô 24–31 và âm nền chủ ô 32–35 (`nhac-ly/18-am-ngoai-hop-am` n19, `luyen-tai/nghe-tien-trinh` n34);
    - 8 ô đầu Für Elise, hai tay thay phiên, móc kép, 3/8 (`piano/10-bai-dau-tien` n2, n34);
    - đoạn C có nốt lặp, và các ô của Op. 49 số 2 (`piano/not-lap-not-kep` n10, n41; `piano/quang-tam-buoc-nhay` n37, n45).

    Đã đếm trên bản nhạc: cả các ô nêu trong những câu ấy đều đúng.
  - `hinh-thuc/rondo` n20: câu chỉ nói về link nên vẫn đúng, nhưng `ghi_chu` của hồ sơ ấy chép chữ cũ "quay lại ba lần". Không sửa hồ sơ ấy.
- Soát nhãn cho review:
  - Ba câu có yếu tố mỏi tay xếp `quy-tac`, nguồn BAPAM: Op. 49 n75 (nốt lặp ô 59–62), Für Elise n55 và n77 (đoạn C).
  - Mấy câu về ví dụ soạn trên trang xếp `ve-site`: Bach n66, Op. 49 n80, n82.
- Thuật ngữ chưa có bản ghi trong `thuat-ngu.yml`:
  - *bagatelle*;
  - *poco moto*, *ma non troppo*;
  - *alla breve*: có ở trang, chưa có bản ghi.

## Nguồn hay dùng

- **Bản nhạc:**
  - Mutopia (`.ly` và `.mid`): `wtk1-prelude1`, `bwv847a`, `LVB_Sonate_49no2_1`, `fur_Elise_WoO59`, `K545-1`.
  - Bản quét Internet Archive:
    - Novello, Harold Brooke biên tập, `31761064484983`;
    - Schirmer 1893, Czerny biên tập, `welltemperedclav01bach`: có ô Schwencke, 36 ô.
  - Commons: ảnh trang BWV 846a.
- **Henle (PDF trên henle.de):**
  - lời nói đầu HN 14 (cả ghi chú diễn tấu của Schiff), HN 1327, HN 1347, HN 1062;
  - bình chú HN 14, HN 1347;
  - mục WoO 59 của danh mục Beethoven (2014);
  - blog Henle về ô Schwencke.
- **Beethoven-Haus:** trang WoO 59, BH 116, triển lãm về thính giác.
- **Thayer, 1921, bản OCR trên Internet Archive:** bài của Neefe năm 1783.
- **Bản thu:**
  - Commons, xem độ dài qua API: Ishizaka, Veesey, V. Gao.
  - Trang hãng và cửa hàng: ECM (Schiff), Apple Music Classical (Gould), Qobuz (Richter), eClassical/BIS (Brautigam).
- **Từ điển, giáo trình:**
  - OMT: Seventh Chords, Embellishing Tones, Sonata Form, Rondo, Binary Form, Simple Meter. WebFetch bị chặn; curl với User-Agent trình duyệt đọc được.
  - COD trên Encyclopedia.com: prelude, moto, alla breve.
  - Dolmetsch: Ornaments, tempo.
  - Ngón bấm: Evansville (bản lưu Wayback; trang gốc trả 404), Fitch (gam nửa cung).
  - BAPAM.
- **Đề cương:** RCM 2022 (PDF), Trinity (lần 1).
- **Không mở được:**
  - IMSLP: PDF, và đôi lúc lỗi 502 hay ECONNRESET;
  - Bach-Digital;
  - Merriam-Webster, Cambridge (403);
  - danh mục PDF của Universal Edition.
