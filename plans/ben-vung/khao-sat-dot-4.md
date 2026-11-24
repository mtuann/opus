# Khảo sát đợt 4 (lượt 10 của lộ trình thêm tác phẩm)

24/11/2026. Mục 6 của `plans/ben-vung/lo-trinh-them-tac-pham.md`: khảo sát trước khi viết, chủ repo duyệt. Ba agent khảo sát độc lập, chỉ đọc (IMSLP qua API wikitext và HTML trang tác phẩm, Commons qua `tools/audio/commons.py`, đề cương ABRSM 2011–2028, Trinity từ 2023, RCM 2022, Henle); không tải file từ IMSLP. Mỗi ứng viên đủ sáu mục của `plans/ben-vung/them-tac-pham.md` mục 1.

Hiện trạng bài học theo chặng 2–7: 8, 6, 8, 6, 9, 6 (43 bài).

## Tóm tắt và đề xuất

| Mảng | Đề xuất làm trong lượt 10 | Chặng | Cấp | Đối chiếu | Bản thu |
|---|---|---|---|---|---|
| Haydn | Hob. XVI:27 Sol trưởng, chương 3 *Finale. Presto* (`haydn-xvi-27`) | 5 | RCM 2022 Level 8; Henle 5 (cả sonata); không có trong ABRSM | Mutopia PD (id 187, LilyPond + MIDI) | Luis Kolodin, CC BY-SA 4.0, IMSLP: chỉ dẫn link |
| Chặng 7 không Lãng mạn | Bach, Prelude và Fugue Sol thứ BWV 861, *Bình quân luật* I số 16 (`bach-prelude-fugue-sol-thu`) | 7 | ABRSM ARSM (danh sách 6/2024); Henle P5/F6, nhãn ARSM | Mutopia PD (id 806, 805) | Kimiko Ishizaka, CC0, Commons: **phát được** |
| Scarlatti | Sonata La trưởng K. 208 *Adagio e cantabile* (`scarlatti-k208`) | 5 | **ABRSM Grade 6** (2021–2028, cả bốn kỳ); Henle 4; RCM Level 7 | Không có bản số mở; chép tay từ Longo (Ricordi 1906), soát với bản Gouin (CC BY-SA 4.0, PDF + MIDI) | Robert Stephen Hill (fortepiano), PD, IMSLP: chỉ dẫn link |

Đề xuất làm cả ba trong lượt 10 (ba chặng khác nhau; chặng 5 có thêm hai bài, thành 8; chặng 7 có bài Baroque đầu tiên). Không bài nào đụng bản ghi đã khóa (không cần `cap`).

**Để lượt sau (đã khảo sát, xem chi tiết):**
- Beethoven, *Pathétique* Op. 13 trọn ba chương (chặng 7; ARSM "complete"; Henle 7; Paul Pitman CC0 đủ ba chương; Mutopia đủ): vướng `cap` với `nghe-nhac/beethoven-pathetique` và bài học chương 2 `pathetique-adagio` đã khóa; đề nghị bản ghi riêng không `cap`, link tay (cách A1).
- Scarlatti K. 380 (chặng 6, ABRSM Grade 7; bản thu Smullyan phát được; MIDI đã có): chặng 6 đã 9 bài; cặp với `nghe-nhac/scarlatti-sonata` cần mở khóa.
- Bach BWV 853 (LRSM; cần bài lõi "Canon và mô phỏng").

**Chỗ cần chủ repo quyết:**
1. Duyệt ba bài đề xuất (hay đổi: ví dụ Haydn XVI:6 chương 4 có ABRSM Grade 6 nhưng không có bản số và bản thu chưa rõ người chơi; Haydn XVI:2 Menuetto có bản thu phát được nhưng bằng chứng cấp cũ).
2. Haydn XVI:27 và Scarlatti K. 208 chỉ có bản thu IMSLP chỉ dẫn link (khối nghe không phát): chấp nhận được không.
3. Dòng "Haydn: Sonata Đô trưởng Hob. XVI:35" ở `piano/tac-pham-theo-cap` (chặng 5) xếp thấp so với RCM (trọn sonata Level 10): sửa ở nhánh `mo/` sau đợt.

## File chủ repo cần tải (vào `../opus-zero/_imslp/`)

| Bài | File | Link |
|---|---|---|
| Haydn XVI:27 | Bản in Päsler, *Haydns Werke* XIV Bd. 2, Breitkopf & Härtel 1918 | https://imslp.org/wiki/Special:ImagefromIndex/472026 |
| Haydn XVI:27 | Bản thu Luis Kolodin, chương 3 | https://imslp.org/wiki/Special:ImagefromIndex/836476 |
| Bach BWV 861 | Bach-Gesellschaft Band 14 (1866) | https://imslp.org/wiki/Special:ImagefromIndex/173661 |
| Scarlatti K. 208 | Bản thu Robert Stephen Hill | https://imslp.org/wiki/Special:ImagefromIndex/961413 |
| Scarlatti K. 208 | MIDI Pierre Gouin | https://imslp.org/wiki/Special:ImagefromIndex/293026 |
| Scarlatti K. 208 | PDF Pierre Gouin | https://imslp.org/wiki/Special:ImagefromIndex/293023 |

Bản in Longo của K. 208 (Ricordi 1906, IMSLP #914846) có sẵn ở GitHub `craigsapp/scarlatti-keyboard-sonatas`, `reference-edition/L238K208.pdf`, không cần tải từ IMSLP. Bản thu Ishizaka (BWV 861) ở Commons, không cần tải.

## 1. Haydn

Khảo sát ngày 24/11/2026, chỉ đọc. Mọi nguồn dưới đây đã mở trong ngày (PDF giáo trình tải về và trích chữ bằng pypdf; IMSLP đọc wikitext qua API và HTML trang tác phẩm để lấy số chỉ mục; Commons đọc bằng `commons.py page/info`; không tải file từ IMSLP).

### Tóm tắt

| Thứ tự | Ứng viên | Chặng | Cấp (bằng chứng) | Đối chiếu | Bản thu |
|---|---|---|---|---|---|
| **1 (đề nghị)** | Hob. XVI:27 Sol trưởng, chương 3 *Finale. Presto* | 5 | RCM 2022 Level 8; Henle mức 5 (cả sonata); chương 1 cùng sonata ở Trinity Grade 8 | **Mutopia PD** (cả ba chương, LilyPond + MIDI) và kern (NC, chỉ dùng trên máy) | Luis Kolodin, CC BY-SA 4.0, IMSLP (chỉ dẫn link) |
| 2 | Hob. XVI:6 Sol trưởng, chương 4 *Finale: Allegro molto* | 5 | **ABRSM Grade 6** (2021–2022, 2023–2024, 2025–2026; không còn ở 2027–2028); Henle mức 5 | Không có bản số cho chương 4; chép tay từ Päsler 1918 | GnuTuxZila, CC BY 4.0, IMSLP (chỉ dẫn link); **không ghi tên người chơi, phải nghe kiểm** |
| 3 | Hob. XVI:2 Si♭ trưởng, chương 3 *Menuetto* (có Trio) | 4 | ABRSM Grade 5 (2011–2012, cũ); Henle mức 4 | Không có bản số; chép tay từ Päsler 1918 | **Stefano Ligoratti, CC BY 3.0, Commons: phát được** |

Không có sonata Haydn nào ở Grade 4–6 vừa có trong ABRSM/Trinity 2025–2028, vừa có bản số mở, vừa có bản thu phát được. Mỗi ứng viên thiếu một hay hai mục; xem "Đánh đổi" cuối file.

### Hiện trạng site

- Bài học theo chặng 2–7: 8, 6, 8, 6, 9, 6 (đọc `src/data/tac-pham.yml`). Thêm một bài chặng 5 thì chặng 5 thành 7.
- `nha-soan-nhac.yml` đã có `haydn` (1732–1809, Cổ điển). Hướng dẫn nghe hiện có: `nghe-nhac/haydn-94` (giao hưởng, không phải piano; nếu chọn sonata thì không có trang `cap` để cặp).
- `piano/tac-pham-theo-cap.md` mục "Chặng 5" đang ghi "Haydn: Sonata Đô trưởng Hob. XVI:35" (không link). Bằng chứng dưới đây cho thấy XVI:35 không đủ điều kiện làm bài học (không có bản thu được nhận), và xếp chặng 5 cho cả sonata là quá thấp so với RCM (Level 10, trọn sonata). Nếu chọn XVI:27 thì nên sửa dòng này (việc của lượt viết, không làm ở đây).
- `tools/audio/align/sources.json`: chưa có tệp Haydn nào.

### Bằng chứng cấp độ (đã đọc)

Haydn trong giáo trình piano ABRSM (chỉ ghi sonata Hob. XVI, Grade 4–8):

| Giáo trình | Grade 4 | Grade 5 | Grade 6 | Grade 7 | Grade 8 |
|---|---|---|---|---|---|
| 2011–2012 | | XVI:2 Menuet và Trio | | | XVI:36 I; XVI:38 I |
| 2013–2014 | | | | | XVI:41 I |
| 2015–2016 | | | | | XVI:26 I |
| 2017–2018 | XVI:43 Minuet và Trio | | | XVI:23 Presto (III) | XVI:34 Presto (I) |
| 2019–2020 | XVI:26 Finale (III) | | | XVI:49 Tempo di Minuetto (III) | XVI:20 I; XVI:48 Rondo (II) |
| 2021–2022 | | **XVI:G1 Allegro (I)** | **XVI:6 Finale (IV)** | XVI:31 I | XVI:46 I |
| 2023–2024 | | XVI:4 Minuet và Trio; XVI:G1 I | XVI:6 IV | XVI:32 I; XVI:31 I | XVI:37 I |
| 2025–2026 | XVI:1 Menuet và Trio (III) | XVI:G1 I | XVI:6 IV | XVI:31 I | XVI:37 I; XVI:49 I |
| 2027–2028 | | XVI:G1 I | (Adagio Hob. XVII:9; Andante Hob. XVII/Diff. petites pièces số 1: không phải sonata) | XVI:31 I | XVI:37 I; XVI:49 I |

- Trinity (danh sách từ 2023, bản cập nhật 8/2026): Grade 3 XVI:8 Andante (III); Grade 6 XVI:4 Allegro (I), **XVI:35 Finale (III)**; Grade 7 XVI:22 Andante (II), XVI:24 Finale (III); Grade 8 XVI:37 I, **XVI:27 I**, XVI:44 I.
- RCM 2022: Level 4 XVI:9 (III); Level 5 XVI:8 (I; III và IV), XVI:10 (I); Level 6 XVI:3 Minuetto, XVI:4 Minuet, **XVI:G1 (I)**; Level 7 XVI:1 (I, II), **XVI:27 (II: Minuet và Trio)**, XVI:28 (III), XVI:G1 (III), XVII:D1 (III); Level 8 XVI:4 (I), **XVI:27 (III: Finale)**, XVI:39 (I); Level 9 XVI:2 (I), XVI:5, XVI:12, XVI:23 (I, II), XVI:34 (I, II), XVI:37 (I; II–III); Level 10 trọn sonata XVI:31, 32, 33, **35**, 36, 44, 48, 51, 19 (I–II)…
- Henle (trang các tập "Complete Piano Sonatas" HN 1336, 1338, 1340 và HN 1576; mức cho cả sonata, không cho từng chương): XVI:G1 3; XVI:1 3; XVI:8 3; XVI:2 4; XVI:4 4; XVI:9 4; XVI:6 5; XVI:23 5; XVI:27 5; XVI:34 5; **XVI:35 5** (HN 1576); XVI:37 6; XVI:31 6; XVI:51, 52 7.
- Đối chiếu cách site quy RCM: `ke-hoach-mo-rong.md` ghi Op. 49 số 2 (Grade 5) là RCM Level 8, Prélude Mi thứ (Grade 5) là RCM Level 7. Như vậy RCM Level 8 ≈ Grade 5–6.

### Ứng viên 1 (đề nghị): Hob. XVI:27, chương 3 *Finale. Presto*

| Mục | Nội dung |
|---|---|
| Bản quyền | Haydn mất 1809: hết ở VN. Ấn bản dùng trích đoạn: Päsler, *Haydns Werke*, Serie XIV, Bd. 2, Breitkopf & Härtel, Leipzig, 1918, số bản in J.H. XIV:27 (Päsler mất 1942): hết ở Mỹ và VN. Bản Mutopia ghi "Public Domain" (người chép đặt PD), nguồn "C. F. Peters, 1880s". **Đạt** |
| Ấn bản | Päsler 1918, IMSLP [#472026](https://imslp.org/wiki/Special:ImagefromIndex/472026) (10 tr., cả sonata). Thay thế: Köhler, Peters, số bản in 6424 (IMSLP #471785); Martienssen, Peters 1937 (#00143; 1937 sau 1930, không dùng làm ấn bản trích đoạn) |
| Nguồn đối chiếu | **Mutopia** `HaydnFJ/HOB-XVI-27/hob-xvi-27-iii-presto` (Mutopia-2013/07/07-187, PD, LilyPond 2.16.1, có `.mid`; người chép Bas Wassink; Sol trưởng, 2/4, nhịp lấy đà móc đơn, 6 đoạn `\repeat volta`). Cùng bộ có chương 1 (id 185) và chương 2 (id 186). Thêm: kern `craigsapp/haydn-piano-sonatas/kern/sonata42-3.krn` (SCT Hob. XVI:27, Presto, 2/4, theo Universal Edition 1901), giấy phép **CC BY-NC-SA 4.0**: chỉ dùng trên máy để soát nốt, không chép vào site. MIDI Mutopia dùng được cho `tools/audio/align` (thêm vào `sources.json`) |
| Bản thu | Luis Kolodin, piano, CC BY-SA 4.0, IMSLP: bản 2020 [#836476](https://imslp.org/wiki/Special:ImagefromIndex/836476) (3:13; đăng 26/1/2023) và bản trong album *Classical Sonatas* của Felipe Sarro [#292404](https://imslp.org/wiki/Special:ImagefromIndex/292404) (3:32; đăng 15/8/2013). **Chỉ dẫn link** (khối nghe không phát). Commons: không có bản thu người chơi của XVI:27. Loại: Gabriel Antonio Hernandez Romero (CC BY-NC 4.0, #518228) |
| Cấp độ | RCM 2022 Level 8 (chương 3); chương 2 RCM Level 7; chương 1 Trinity Grade 8 (từ 2023). Henle HN 1338: mức 5 cả sonata. Không có trong ABRSM 2011–2028. Ước **Grade 6, chặng 5** |
| Chỗ đứng | Chặng 5 (đang ít: 6 bài), thời Cổ điển (chặng 5 đã có Mozart K. 545 và *Ánh trăng*; chưa có Haydn). Bài học Haydn đầu tiên của site |

- Slug đề nghị: `haydn-xvi-27` (tránh `haydn-sonata-sol` vì XVI:6, XVI:G1, XVI:8 cũng Sol trưởng). Tác giả: `haydn` (đã có).
- Kỹ năng chính: Presto 2/4 nhẹ và đều; câu nhạc có nhắc lại theo đoạn, mỗi lần đổi hình nốt (đọc và nghe cách Haydn biến hóa một chủ đề); phát âm Cổ điển (staccato, luyến hai nốt), chạy ngón tay phải trên đệm tay trái mỏng.
- Chưa chắc:
  - Hình thức chương 3: Mutopia có 6 đoạn lặp, kern đánh dấu 6 đoạn A–F rồi G; không thấy đổi hóa biểu trong cả hai file. Cần xem bản in Päsler để gọi đúng tên (rondo-biến tấu hay chủ đề và biến tấu, có đoạn thứ hay không) trước khi viết.
  - Cấp chỉ dựa trên RCM (một hội đồng) và Henle (cả sonata). Nếu chủ repo muốn bằng chứng ABRSM/Trinity cho chương được dạy thì ứng viên 2 mạnh hơn.
  - Mutopia chương 1 ghi `\time 2/4 \partial 8` giống chương 3; chưa kiểm có khớp bản in không (không ảnh hưởng nếu chỉ dạy chương 3).
  - Hai bản thu Kolodin chưa ai nghe; chọn một bản sau khi nghe.
- File chủ repo cần tải: Päsler [#472026](https://imslp.org/wiki/Special:ImagefromIndex/472026); bản thu Kolodin [#836476](https://imslp.org/wiki/Special:ImagefromIndex/836476) (hay [#292404](https://imslp.org/wiki/Special:ImagefromIndex/292404)) nếu muốn nghe kiểm, căn mốc.

### Ứng viên 2: Hob. XVI:6, chương 4 *Finale: Allegro molto*

| Mục | Nội dung |
|---|---|
| Bản quyền | Hết ở VN. Päsler, *Haydns Werke* XIV Bd. 1, Breitkopf & Härtel 1918, số bản in J.H. XIV:No.6: hết ở Mỹ. **Đạt** |
| Ấn bản | Päsler 1918, IMSLP [#471957](https://imslp.org/wiki/Special:ImagefromIndex/471957). Còn có bản viết tay (Royal College of Music, #956618), Roitzsch/Köhler, Peters số 8426 |
| Nguồn đối chiếu | Không có bản số cho chương 4: kern `sonata13-1.krn` chỉ có chương 1 (và là CC BY-NC-SA); Mutopia không có. Chép tay từ Päsler |
| Bản thu | GnuTuxZila, CC BY 4.0, IMSLP [#651084](https://imslp.org/wiki/Special:ImagefromIndex/651084) (chương 4, 2:16; cả bốn chương #651081–651084, đăng 8/10/2020). Ô "Performers" ghi "Yamaha Upright Piano SU7", không có tên người; cùng ngày người đăng tải bản thu XVI:1, 3, 4, 5, 7, 8 trong vòng 35 phút. **Phải nghe để chắc là người chơi, không phải nhạc dựng từ MIDI**; nếu nghi ngờ thì loại. Lev Kitkin (CC BY 4.0, #930317) chỉ có chương 3. Commons: không có |
| Cấp độ | **ABRSM Grade 6, danh sách A** (2021–2022, 2023–2024, 2025–2026, số 9); bỏ ở 2027–2028. Henle HN 1336: mức 5. → **chặng 5** |
| Chỗ đứng | Chặng 5, Cổ điển sớm (khoảng 1760–1766), bổ sung một sonata thời đầu bên cạnh Mozart, Beethoven |

- Slug: `haydn-xvi-6`; tác giả `haydn`.
- Kỹ năng: Allegro molto nhanh, gọn, ngón nhẹ kiểu đàn harpsichord, phát âm rõ.
- Chưa chắc: bản thu (trên); không có bản số nên mốc phải đo tay; IMSLP ghi tên tác phẩm "Partita" (Divertimento), cần thống nhất tên trên trang.
- File cần tải: [#471957](https://imslp.org/wiki/Special:ImagefromIndex/471957), [#651084](https://imslp.org/wiki/Special:ImagefromIndex/651084).

### Ứng viên 3: Hob. XVI:2, chương 3 *Menuetto* (có Trio)

| Mục | Nội dung |
|---|---|
| Bản quyền | Hết ở VN. Päsler, *Haydns Werke* XIV Bd. 1, Breitkopf & Härtel 1918: hết ở Mỹ. **Đạt** |
| Ấn bản | Päsler 1918, IMSLP [#471947](https://imslp.org/wiki/Special:ImagefromIndex/471947) |
| Nguồn đối chiếu | Không có bản số (kern, Mutopia, ASAP không có XVI:2). Chép tay |
| Bản thu | **Commons** [IMSLP213376-PMLP01624-Haydn Sonata Hob.XVI 2 3rd.ogg](https://commons.wikimedia.org/wiki/File:IMSLP213376-PMLP01624-Haydn_Sonata_Hob.XVI_2_3rd.ogg): Stefano Ligoratti, CC BY 3.0, 214,0 s, `commons.py info` báo được nhận, có MP3 chuyển mã: **phát được**. Cùng bộ chương 1, 2 trên Commons |
| Cấp độ | ABRSM Grade 5 (2011–2012, danh sách A số 3, "Menuet and Trio: 3rd movt"); Henle HN 1336 mức 4 (cả sonata); RCM Level 9 chỉ cho chương 1. → **chặng 4** |
| Chỗ đứng | Chặng 4 (đã 8 bài), Cổ điển sớm. Lợi thế duy nhất: bản thu phát được |

- Slug: `haydn-xvi-2-menuetto`; tác giả `haydn`.
- Kỹ năng: minuet 3/4 với trio tương phản, nốt hoa mỹ, phát âm Cổ điển.
- Chưa chắc: bằng chứng cấp chỉ có ABRSM 2011–2012 (đã 15 năm); bản thu 214 s gồm cả Trio và nhắc lại, chưa nghe kiểm.
- File cần tải: [#471947](https://imslp.org/wiki/Special:ImagefromIndex/471947).

### Đã xét, không đề nghị

| Tác phẩm | Lý do |
|---|---|
| XVI:35 Đô trưởng (site đang ghi ở chặng 5) | Không có bản thu được nhận: IMSLP chỉ có Hernandez Romero CC BY-NC 4.0 (#383044); Commons "Haydn 35 1/2/3.ogg" là Bernd Krueger, nguồn piano-midi.de (nhạc dựng từ MIDI). Không có bản số mở (kern và Mutopia không có). Cấp: chương 3 Trinity Grade 6, nhưng trọn sonata RCM Level 10; Henle HN 1576 mức 5. Päsler Bd. 2 có (#472034) |
| XVI:G1 Sol trưởng, chương 1 | Cấp tốt nhất (ABRSM Grade 5 cả bốn giáo trình 2021–2028; RCM Level 6; Henle 3) → chặng 4, nhưng **không có bản thu được nhận** (IMSLP không có bản thu; Commons chỉ có các đoạn `.mid` minh họa). IMSLP không có bản quét trước 1930 (chỉ bản dựng Peterpiano CC BY 4.0 và một bản EMB không rõ năm) |
| XVI:1 Đô trưởng, Menuet và Trio | ABRSM Grade 4 (2025–2026), Henle 3 → chặng 4 (đã đông). Có bản dựng Gouin CC BY-SA 4.0 (kèm MIDI), Denchev CC0; bản thu chỉ có GnuTuxZila (như ứng viên 2) và Hernandez Romero (NC). Dự phòng nếu muốn chặng 4 |
| XVI:23 Fa trưởng | Bản thu Commons phát được (Ivan Ilić, CC BY 3.0, ba chương), nhưng ABRSM Grade 7 (2017–2018, chương 3), RCM Level 9 → chặng 6 (đã đông nhất) |
| XVI:34 Mi thứ | ABRSM Grade 8 (2017–2018, chương 1), RCM 9 → chặng 6. Bản thu: chương 1 NC; Commons chỉ có hai bản "classroom draft" của học trò |
| XVI:37 Rê trưởng | ABRSM Grade 8 (2023–2028), RCM 9; kern chương 1 (NC); Commons chương 3 (người đăng "Oxford", CC BY 3.0) → chặng 6 |
| XVI:9 Fa trưởng | RCM Level 4 (chương 3) → chặng 3; bản thu Commons chỉ có Bernd Krueger (MIDI) |
| XVI:8 Sol trưởng | Trinity Grade 3, ABRSM Grade 2 (2019–2020), RCM 5 → chặng 2–3, ngoài phạm vi |

### Đánh đổi giữa ba ứng viên

- XVI:27 có nguồn đối chiếu tốt nhất (Mutopia PD kèm MIDI để căn mốc, cộng kern để soát) và bản thu người chơi có tên, giấy phép rõ; yếu ở chỗ cấp chỉ có RCM cho chương được dạy và bản thu không phát trên site.
- XVI:6 có bằng chứng ABRSM rõ nhất cho chặng 5, nhưng không có bản số và bản thu đáng ngờ.
- XVI:2 là đường duy nhất có bản thu phát được, đổi lại cấp chỉ dựa trên ABRSM 2011–2012 và rơi vào chặng 4.
- Nếu sau này có bản thu XVI:27 trên Commons (bản Kolodin CC BY-SA 4.0 cho phép đưa lên), ứng viên 1 đủ cả sáu mục.

### Nguồn đã mở (24/11/2026)

- ABRSM: [Piano 2025 & 2026](https://www.abrsm.org/sites/default/files/2024-06/Piano%202025%20%26%202026%20Prac%20syllabus%2020240524_access.pdf) (tr. 25, 31, 34, 37, 40, 43); [Piano 2027 & 2028](https://www.abrsm.org/sites/default/files/2026-06/Piano%20Practical%20Grades%20Qualification%20Specification%202027%20%26%202028.pdf) (tr. 22, 25, 31, 34, 37, 40, 43); [2023 & 2024](https://www.abrsm.org/sites/default/files/2023-09/piano-2023-2024-practical-grades-syllabus-may-2022.pdf); [2021 & 2022](https://www.abrsm.org/sites/default/files/2023-09/piano-2021-2022-syllabus-rev-sep-2020-final.pdf); [2019 & 2020](https://web.archive.org/web/20201112011213/https://gb.abrsm.org/media/62972/piano_syllabus_2019___2020_complete.pdf); [2017–2018](https://web.archive.org/web/20170215031502/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoSyllabusComplete17.pdf); [2015–2016](https://web.archive.org/web/20160314222929/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoSyllabusComplete15.pdf); [2013–2014](https://web.archive.org/web/20140308031625/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoSyllabusComplete13.pdf); [2011–2012](https://web.archive.org/web/20131007054337/http://us.abrsm.org/fileadmin/user_upload/syllabuses/pianoComplete11.pdf). Chữ "List A/B/C" không trích được từ PDF; danh sách suy theo chỗ đánh số lại từ 1.
- Trinity: [Piano repertoire list from 2023, cập nhật 8/2026](https://www.trinitycollege.com/resource?id=10125).
- RCM: [Piano Syllabus 2022](https://rcmusic-production-strapi-media.s3.ca-central-1.amazonaws.com/piano_syllabus_2022_edition_9c6a49bb96.pdf) (tr. 56, 64, 73, 83, 94).
- Henle: [HN 1576 (XVI:35)](https://www.henle.de/en/Piano-Sonata-C-major-Hob.-XVI-35/HN-1576), [Complete Piano Sonatas I, HN 1336](https://www.henle.de/en/Complete-Piano-Sonatas-Volume-I/HN-1336), [II, HN 1338](https://www.henle.de/en/Complete-Piano-Sonatas-Volume-II/HN-1338), [III, HN 1340](https://www.henle.de/en/Complete-Piano-Sonatas-Volume-III/HN-1340).
- Mutopia: [danh sách Haydn](https://www.mutopiaproject.org/cgibin/make-table.cgi?Composer=HaydnFJ) (sonata piano chỉ có XVI:27 và XVI:28, cả hai PD, Peters 1880s); [id 185](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=185), [186](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=186), [187](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=187).
- Kern: [craigsapp/haydn-piano-sonatas](https://github.com/craigsapp/haydn-piano-sonatas) (theo Universal Edition 1901; CC BY-NC-SA 4.0; có XVI:6 I, 12, 13 I, 14, 20 III, 22 I, 27 III, 30 III, 33 I, 34 III, 36 I, 37 I, 38 III, 39 III, 45 III, 49 I, 51, 52; không có XVI:2, 23, 35, G1). ASAP (`fosfrancesco/asap-dataset/Haydn/Keyboard_Sonatas`): không có ứng viên nào.
- IMSLP (wikitext qua API và HTML): [XVI:27](https://imslp.org/wiki/Keyboard_Sonata_in_G_major,_Hob.XVI:27_(Haydn,_Joseph)), [XVI:6](https://imslp.org/wiki/Partita_in_G_major,_Hob.XVI:6_(Haydn,_Joseph)), [XVI:2](https://imslp.org/wiki/Partita_in_B-flat_major,_Hob.XVI:2_(Haydn,_Joseph)), [XVI:35](https://imslp.org/wiki/Keyboard_Sonata_in_C_major,_Hob.XVI:35_(Haydn,_Joseph)), [XVI:G1](https://imslp.org/wiki/Keyboard_Sonata_in_G_major,_Hob.XVI:G1_(Haydn,_Joseph)), [XVI:23](https://imslp.org/wiki/Keyboard_Sonata_in_F_major,_Hob.XVI:23_(Haydn,_Joseph)), [XVI:34](https://imslp.org/wiki/Keyboard_Sonata_in_E_minor,_Hob.XVI:34_(Haydn,_Joseph)), [XVI:1](https://imslp.org/wiki/Divertimento_in_C_major,_Hob.XVI:1_(Haydn,_Joseph)), [XVI:4](https://imslp.org/wiki/Divertimento_in_D_major,_Hob.XVI:4_(Haydn,_Joseph)); đóng góp của người dùng GnuTuxZila (API `usercontribs`).
- Commons: `commons.py search` (nhiều truy vấn), thể loại [Audio files of piano music by Joseph Haydn](https://commons.wikimedia.org/wiki/Category:Audio_files_of_piano_music_by_Joseph_Haydn); trang mô tả [Haydn 35 1.ogg](https://commons.wikimedia.org/wiki/File:Haydn_35_1.ogg) (piano-midi.de), [Haydn sonata hob. XVI 23 mvt 1.oga](https://commons.wikimedia.org/wiki/File:Haydn_sonata_hob._XVI_23_mvt_1.oga), [Hob.XVI 2 3rd](https://commons.wikimedia.org/wiki/File:IMSLP213376-PMLP01624-Haydn_Sonata_Hob.XVI_2_3rd.ogg).

### Nguồn bị chặn hay không kiểm được

- pianosyllabus.com: trang tìm kiếm không mở được bằng địa chỉ đoán (404), máy tìm kiếm không có trang Haydn nào; không có số AMEB, LCM.
- Henle chỉ cho mức cả sonata, không cho từng chương.
- Thư mục `scratchpad/dl/` rỗng (PDF ABRSM nói trong lời giao không còn); đã tải lại từ abrsm.org và web.archive.org.
- Musopen không thử (các khảo sát trước ghi bị chặn 403).

## 2. Chặng 7 không Lãng mạn: Beethoven trọn sonata hay Bình quân luật

Khảo sát ngày 24/11/2026, chỉ đọc. Không sửa file nào trong repo. Mọi link dưới đây đã mở ngày 24/11/2026, trừ chỗ có ghi khác.

Hiện trạng: chặng 7 có 6 bài học, đều Lãng mạn: Chopin Ballade 1, *Fantaisie-Impromptu*, Liszt *Liebestraum*, Schubert Impromptu Sol♭, Chaminade *Automne*, Rachmaninoff Op. 3/2. Lộ trình (`plans/ben-vung/lo-trinh-them-tac-pham.md` mục 6) gợi ý hai hướng: (a) một sonata Beethoven trọn vẹn, (b) một Prelude và Fugue khác của *Bình quân luật*.

### Bằng chứng cấp dùng chung

- **ABRSM ARSM, danh sách piano tháng 6/2024** ("valid from June 2024 until further notice"): [PDF trên abrsm.org](https://www.abrsm.org/sites/default/files/2024-06/ARSM%20Repertoire%20(June%202024%20-%20Piano)%20PROOF4%20(Final)%20(1).pdf). Có: Beethoven *Sonata in C minor ('Pathétique'), Op. 13: complete*; Bach WTC I BWV 857, 859, 861; WTC II BWV 874, 878, 880, 885, 886. Danh sách ARSM 2017 ([bản lưu](https://web.archive.org/web/20210725061338/https://gb.abrsm.org/media/14967/pianoarsm.pdf)) có cùng các bài này.
- **ABRSM LRSM, danh sách piano tháng 7/2023** ("valid from July 2023 until further notice"): [bản lưu Wayback của gb.abrsm.org](https://web.archive.org/web/20230712204113/https://gb.abrsm.org/media/67232/lrsm-repertoire-piano-jul-2023.pdf). Có: Beethoven Op. 31 số 1, 2 (*Tempest*), 3, *complete*; Bach WTC I BWV 848, **849**, 852, **853**, 865, 869; WTC II BWV 872, 873, 879, 883, 885, 887, 890–893.
- Thứ bậc diploma: ARSM, rồi LRSM, rồi FRSM. Bài ARSM nằm ngay sau Grade 8, nên hợp **chặng 7** theo quy tắc của site. Bài LRSM khó hơn một bậc.
- **Henle**, WTC I [HN 14](https://www.henle.de/The-Well-Tempered-Clavier-Part-I-BWV-846-869/HN-14) và [HN 1014](https://www.henle.de/The-Well-Tempered-Clavier-Part-I-BWV-846-869/HN-1014): mức khó từng prelude (P) và fugue (F), kèm nhãn ABRSM:

| BWV | P | F | Nhãn ABRSM trên Henle | Số bè của fugue (kern) | Số ô (kern: P / F) |
|---|---|---|---|---|---|
| 847 (đã có, chặng 6) | 6 | 5 | không | 3 | 38 / 31 |
| 849 Đô♯ thứ | 5 | 6 | LRSM | 5 | 39 / 115 |
| 853 Mi♭ thứ / Rê♯ thứ | 4 | 6 | LRSM | 3 | 40 / 87 |
| 857 Fa thứ | 4 | 6 | ARSM | 4 | 22 / 58 |
| 859 Fa♯ thứ | 4 | 5 | ARSM | 4 | 24 / 40 |
| 861 Sol thứ | 5 | 6 | ARSM | 4 | 19 / 34 |

- Henle với Beethoven: [*Pathétique* HN 1348](https://www.henle.de/Piano-Sonata-no.-8-c-minor-op.-13-Grande-Sonata-Pathetique/HN-1348) mức **7** ("difficult"), nhãn "ABRSM: Piano ARSM". Theo [Piano Sonatas Vol. II, HN 34](https://www.henle.de/Piano-Sonatas-Volume-II/HN-34): *Tempest* Op. 31/2 mức **8**, nhãn LRSM; *Appassionata* Op. 57 và *Waldstein* Op. 53 mức **9**, nhãn FRSM (quá khó cho bài đầu tiên ngoài Lãng mạn ở chặng 7, nên loại).
- Trinity và RCM: chưa tra, vì bằng chứng ABRSM và Henle đã đủ và khớp nhau.

---

### Hướng (a): một sonata Beethoven trọn vẹn

#### Ứng viên a1 (đề nghị): Beethoven, Sonata số 8 Đô thứ Op. 13, *Pathétique*, trọn ba chương

| Mục | Nội dung |
|---|---|
| Bản quyền | Beethoven (1770–1827). In năm 1799. Hết bảo hộ ở Việt Nam và Mỹ. **Đạt** |
| Ấn bản | (1) Joseph Eder, Wien, không ghi năm [1800], số bản in 128. IMSLP ghi "First edition (reprint)", có lẽ in lại từ bản Hoffmeister 1799: [#50958](https://imslp.org/wiki/Special:ImagefromIndex/50958). (2) *Ludwig van Beethovens Werke*, Breitkopf & Härtel, 1862, Serie 16 Nr. 131: [#243128](https://imslp.org/wiki/Special:ImagefromIndex/243128) và [#994456](https://imslp.org/wiki/Special:ImagefromIndex/994456) (bản quét 600 dpi; cần xem lúc mở file xem số nào là bản quét Kalmus). Trang tác phẩm: [IMSLP](https://imslp.org/wiki/Piano_Sonata_No.8,_Op.13_(Beethoven,_Ludwig_van)) (đọc wikitext qua API và HTML). |
| Nguồn đối chiếu | Bản số, so được từng nốt. **Mutopia**, cả ba chương phạm vi công cộng: chương 1 [id 299](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=299) (Schirmer 1894 và Berners 1908), chương 2 [id 295](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=295) (Berners 1908, Peters 1910), chương 3 [id 296](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=296) (Berners 1908). **kern**: [craigsapp/beethoven-piano-sonatas](https://github.com/craigsapp/beethoven-piano-sonatas) `sonata08-1/2/3.krn`, theo Durand 1915 do Paul Dukas biên tập (Dukas mất 1935, Durand in 1915: hết bảo hộ); 312, 73 và 210 ô, tổng 595 ô. **ASAP**: `Beethoven/Piano_Sonatas/8-1`, `8-2`, `8-3` (`midi_score` kèm mốc ô nhịp; `sources.json` đã có 8-2). `sources.json` cũng đã có `cpm_pathetique_1/2/3.mid` (piano-midi) để căn mốc. |
| Bản thu | **Paul Pitman (Musopen), CC0**, trên Commons, phát được, đủ ba chương: [I](https://commons.wikimedia.org/wiki/File:Beethoven,_Sonata_No._8_in_C_Minor_Pathetique,_Op._13_-_I._Grave_-_Allegro_di_molto_e_con_brio.ogg) 419,8 s, [II](https://commons.wikimedia.org/wiki/File:Beethoven,_Sonata_No._8_in_C_Minor_Pathetique,_Op._13_-_II._Adagio_cantabile.ogg) 298,2 s, [III](https://commons.wikimedia.org/wiki/File:Beethoven,_Sonata_No._8_in_C_Minor_Pathetique,_Op._13_-_III._Rondo_-_Allegro.ogg) 275,2 s. Đã đọc trang mô tả (`commons.py --fresh page`): mẫu `{{Cc-zero}}`, nguồn `{{Musopen}}`, người chơi Paul Pitman. Thay thế: eldüendesüarez, CC BY-SA 4.0, 2023 ([I](https://commons.wikimedia.org/wiki/File:Beethoven_-_Pathetique_Sonata_Op-13_Mvt-1_(Piano_Performance_by_eldüendesüarez).wav) 419 s, II 306 s, III 267 s). Bản Daniel Veesey (CC0) đang dùng ở `beethoven-pathetique` thì **không dùng cho chương 1**, vì file dừng ở khoảng 6:24, giữa phần phát triển. |
| Cấp độ | ABRSM **ARSM** (2024, và 2017): *Op. 13: complete*. Henle HN 1348: mức 7, nhãn ARSM. Bài học chương 2 đã có ở chặng 6 (ABRSM Grade 8). Trọn sonata: **chặng 7** |
| Chỗ đứng | Chặng 7, thời kỳ Cổ điển. Đây sẽ là bài Cổ điển đầu tiên của chặng 7, và là sonata trọn vẹn đầu tiên của site: dạy kiến trúc ba chương, sức bền, tương phản tính cách giữa các chương. |

- **Slug đề nghị:** `beethoven-pathetique-tron` (trang `piano/tac-pham/beethoven-pathetique-tron`). Tên: "*Pathétique* Op. 13, trọn ba chương".
- **Tác giả:** `beethoven` (đã có).
- **Kỹ năng chính:** phần Grave với hợp âm nặng và chùm nốt nhanh; tremolo quãng tám tay trái của Allegro (*murky bass*); tay trái bắt chéo qua tay phải; giữ mạch hình thức sonata có Grave quay lại; rondo chương 3; sức bền khoảng 17 phút.
- **Cách làm để không trùng bài chương 2 (`pathetique-adagio`, chặng 6, đã khóa):**
  - Chương 1 và chương 3 dạy sâu: bối cảnh, cấu trúc, chỗ khó, bài tập chuẩn bị, trích khuông.
  - Chương 2 chỉ một mục ngắn: vai trò của nó trong cả sonata, cách giữ tốc độ và không khí khi nối các chương, rồi link sang `piano/tac-pham/pathetique-adagio`. Không chép lại bài tập của trang ấy.
  - `hinh.bai-hoc`: sơ đồ ba chương, có thể dựa trên `hinh.nghe` của `beethoven-pathetique`.
- **Quan hệ `cap`, ràng buộc trong `src/du-lieu.mjs` (dòng 330–340):** mỗi trang chỉ được làm `cap` của một bản ghi. Hiện `nghe-nhac/beethoven-pathetique` và `pathetique-adagio` trỏ `cap` sang nhau, cả hai đã khóa. Có hai cách:
  - **A1 (đề nghị):** bản ghi mới **không có `cap`**. Trang mới link tay tới `nghe-nhac/beethoven-pathetique` và `piano/tac-pham/pathetique-adagio`, ở phần mở đầu và mục Học tiếp. Không phải mở khóa gì. Muốn hai trang cũ link ngược lại thì làm ở một nhánh `mo/` sau lượt (sửa chữ trong trang, như `mo/sau-dot-1`). Thiếu sót: `::hoc-tiep` của trang mới không tự hiện "cùng tác phẩm".
  - **A2:** chuyển `cap` của `beethoven-pathetique` sang bài mới (bài học trọn sonata khớp với hướng dẫn nghe trọn sonata hơn), và bỏ `cap` của `pathetique-adagio`. Phải mở khóa hai bản ghi và hai trang, và trang chương 2 mất link tự động sang hướng dẫn nghe. Việc nhiều hơn, rủi ro "Lớn" (dữ liệu dùng chung).
- **Chỗ chưa chắc:**
  - Bản Pitman chương 1 dài 7:00: có lẽ đủ chương, không lặp phần trình bày; **phải nghe kiểm** xem có đủ đến coda không.
  - Trang rất dài: 595 ô, 3 chương. Có thể phải tách khuông theo chương, giữ tối đa khoảng 10 khuông.
  - Henle không ghi mức riêng cho từng chương, chỉ cho cả sonata.
- **File chủ repo cần tải:** bản Eder [#50958](https://imslp.org/wiki/Special:ImagefromIndex/50958), hay bản Breitkopf 1862 [#243128](https://imslp.org/wiki/Special:ImagefromIndex/243128), để kiểm trích đoạn. Bản thu và bản số tải tự động được (Commons, Mutopia, GitHub).

#### Ứng viên a2: Beethoven, Sonata số 17 Rê thứ Op. 31 số 2, *Tempest*

| Mục | Nội dung |
|---|---|
| Bản quyền | Beethoven, in năm 1803. Hết bảo hộ. **Đạt** |
| Ấn bản | Breitkopf & Härtel, Gesamtausgabe 1862–1865 (nguồn của Mutopia). Chưa tra số chỉ mục IMSLP. |
| Nguồn đối chiếu | **Mutopia** chỉ có chương 1 và 2 (phạm vi công cộng, Breitkopf 1862–1865), **không có chương 3**. **kern** `sonata17-1/2/3.krn` (craigsapp, Durand 1915). **ASAP** `17-1`, `17-2`, `17-3`. |
| Bản thu | **Stefano Ligoratti, CC BY-SA 4.0**, Commons, 2010, gốc từ IMSLP, phát được: [I](https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_Sonata_Op._31_No._2_(The_Tempest)_-_First_Movement.ogg) 473 s, II 438 s, III 362 s. Bản Schnabel trên Commons (thu 1932, mẫu `{{PD-EU-audio}}`) **không nhận**: bản thu phát hành ở Mỹ năm 1932 còn bảo hộ đến hết 2032. |
| Cấp độ | ABRSM **LRSM** (7/2023), *complete*; Henle (HN 34) mức 8, nhãn LRSM. Chặng 7, ở mức cao. |
| Chỗ đứng | Chặng 7, Cổ điển (Beethoven thời giữa). Site chưa có hướng dẫn nghe *Tempest*, nên không vướng `cap`. Có thể thêm hướng dẫn nghe cặp với bài sau. |

- **Slug đề nghị:** `beethoven-tempest`. **Tác giả:** `beethoven`.
- **Kỹ năng chính:** đổi tốc độ Largo và Allegro, đoạn recitativo dùng bàn đạp giữ dài (chỉ dẫn của Beethoven), chương 3 móc kép liên tục *moto perpetuo*.
- **Chỗ chưa chắc:** bản thu Ligoratti chưa nghe; chương 3 không có Mutopia (dùng kern và ASAP); khó hơn *Pathétique* một bậc (LRSM, Henle 8).

**Hướng (a) đề nghị a1 (*Pathétique*):** ABRSM ARSM và Henle 7 khớp nhau, có bản thu CC0 đủ ba chương, bốn nguồn bản số, MIDI đã sẵn trong `sources.json`, hình ba chương có sẵn ở `hinh.nghe`. Việc phải quyết duy nhất là `cap` (đề nghị A1).

---

### Hướng (b): một Prelude và Fugue khác trong *Bình quân luật*, quyển 1

*Bình quân luật* quyển 2 **không có bản thu mở trên Commons** (tìm "Kimiko Ishizaka Book 2", "BWV 870", "BWV 871" không ra bản piano nào được nhận). Vì vậy chỉ xét quyển 1, nơi bộ *Open Well-Tempered Clavier* của Kimiko Ishizaka (2015, **CC0**, nguồn welltemperedclavier.org) có trên Commons, mỗi prelude và mỗi fugue một file. Đã đọc trang mô tả: mẫu `{{cc-zero}}`, người chơi Kimiko Ishizaka, ngày 19/3/2015.

Ấn bản chung: **Bach-Gesellschaft Ausgabe, Band 14** (Franz Kroll, Breitkopf & Härtel, 1866), IMSLP [#173661](https://imslp.org/wiki/Special:ImagefromIndex/173661), trên [trang tác phẩm](https://imslp.org/wiki/Das_wohltemperierte_Klavier_I,_BWV_846-869_(Bach,_Johann_Sebastian)). Hết bảo hộ (Bach mất 1750; Kroll mất 1877).

kern: [humdrum-tools/bach-wtc](https://github.com/humdrum-tools/bach-wtc) (`wtc1pNN.krn`, `wtc1fNN.krn`), ghi "Copyright 1994, David Huron; rights … reserved": **chỉ dùng trên máy để so nốt**, không đăng lại, như cách site đã dùng KernScores cho Invention.

#### Ứng viên b1 (đề nghị): Prelude và Fugue Sol thứ, BWV 861 (WTC I số 16)

| Mục | Nội dung |
|---|---|
| Bản quyền | Hết bảo hộ. **Đạt** |
| Ấn bản | BGA Band 14 (1866), [#173661](https://imslp.org/wiki/Special:ImagefromIndex/173661). |
| Nguồn đối chiếu | **Mutopia**: prelude [id 806](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=806) và fugue [id 805](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=805), phạm vi công cộng, nguồn Bach-Gesellschaft 1866. **kern**: `wtc1p16`, `wtc1f16` (fugue 4 bè). ASAP không có 861. |
| Bản thu | Ishizaka, CC0, Commons, phát được (đã đọc trang mô tả: `{{cc-zero}}`, Kimiko Ishizaka, 19/3/2015): [Prelude](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_Bach_-_Well-Tempered_Clavier,_Book_1_-_31_Prelude_No._16_in_G_minor,_BWV_861.ogg) 134,2 s; [Fugue](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_Bach_-_Well-Tempered_Clavier,_Book_1_-_32_Fugue_No._16_in_G_minor,_BWV_861.ogg) 113,5 s. Có MP3 chuyển mã. |
| Cấp độ | ABRSM **ARSM** (6/2024 và 2017); Henle: P5, F6, nhãn ARSM. **Chặng 7** |
| Chỗ đứng | Chặng 7, Baroque. Bước tiếp theo tự nhiên sau BWV 847 (chặng 6): fugue **4 bè** thay vì 3, mà vẫn ngắn (prelude 19 ô, fugue 34 ô). Prelude là kiểu hoa mỹ với chùm láy trên nốt giữ dài. |

- **Slug đề nghị:** `bach-prelude-fugue-sol-thu`. **Tác giả:** `bach`.
- **Kỹ năng chính:** bốn bè trong hai tay (chia bè giữa cho hai tay); chủ đề có bước nhảy quãng 6 thứ ([Wikipedia BWV 861](https://en.wikipedia.org/wiki/BWV_861)); stretto; láy trên nốt ngân ở prelude.
- **Bài lõi canon và mô phỏng:** **không bắt buộc**. Thành phần của fugue (chủ đề, đáp đề, đối đề, đoạn chuyển, stretto, âm nền) đã có ở `hinh-thuc/fugue`; phức điệu mô phỏng và canon hai bè đã có ở `nhac-ly/28-ket-cau`. Bài học giải thích stretto ngay trong trang và link sang hai trang ấy.
- **Chỗ chưa chắc:**
  - Vị trí các lần stretto: một luận văn có bảng stretto của BWV 861 ([core.ac.uk](https://core.ac.uk/download/286340515.pdf), chưa đọc đủ). Phải kiểm từ bản số ở lượt 1.
  - Bước khó so với BWV 847 không lớn theo Henle (P5/F6 so với P6/F5). Bằng chứng xếp chặng 7 là danh sách ARSM.

#### Ứng viên b2: Prelude Mi♭ thứ và Fugue Rê♯ thứ, BWV 853 (WTC I số 8)

| Mục | Nội dung |
|---|---|
| Bản quyền | Hết bảo hộ. **Đạt** |
| Ấn bản | BGA Band 14 (1866), [#173661](https://imslp.org/wiki/Special:ImagefromIndex/173661). |
| Nguồn đối chiếu | **Mutopia**: prelude [id 563](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=563), fugue [id 597](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=597), phạm vi công cộng, Breitkopf & Härtel 1866. **kern**: `wtc1p08` (3/2, 40 ô), `wtc1f08` (3 bè, 87 ô). |
| Bản thu | Ishizaka, CC0, Commons, phát được: [Prelude](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_Bach_-_Well-Tempered_Clavier,_Book_1_-_15_Prelude_No._8_in_E-flat_minor,_BWV_853.ogg) 238,2 s; [Fugue](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_Bach_-_Well-Tempered_Clavier,_Book_1_-_16_Fugue_No._8_in_D-sharp_minor,_BWV_853.ogg) 235,0 s. Có MP3 chuyển mã. |
| Cấp độ | ABRSM **LRSM** (7/2023); Henle: P4, F6, nhãn LRSM. Chặng 7, mức cao. |
| Chỗ đứng | Chặng 7, Baroque. Fugue là "sách giáo khoa" của mô phỏng: chủ đề **đảo**, **tăng trường độ**, stretto giữa các dạng ấy ([earsense](https://www.earsense.org/Earsense/WTC/Book1/08/words.html); luận văn ở [core.ac.uk](https://core.ac.uk/download/286340515.pdf) có ví dụ "stretto by augmentation and inversion"). Prelude chậm, 3/2, kiểu sarabande. |

- **Slug đề nghị:** `bach-prelude-fugue-mi-giang-thu`. **Tác giả:** `bach`.
- **Kỹ năng chính:** nghe và làm rõ chủ đề ở dạng gốc, đảo và tăng trường độ; legato nhiều bè ở tốc độ chậm; đọc 6 dấu giáng (prelude) rồi 6 dấu thăng (fugue) của cùng một giọng viết khác tên (đồng âm).
- **Bài lõi canon và mô phỏng: cần.** Site chưa có trang nào nói về đảo, ngược, tăng và giảm trường độ của chủ đề. Lô làm thêm một bài lõi (nhạc lý hay hình thức: "Canon và mô phỏng") theo `ke-hoach-mo-rong.md` mục 6, hay mở khóa `hinh-thuc/fugue` để thêm mục. Phạm vi lô vì vậy lớn hơn b1.
- **Chỗ chưa chắc:** vị trí từng lần đảo và tăng trường độ phải đọc từ bản số ở lượt 1; chưa đọc đủ hai nguồn phân tích.

#### Ứng viên dự phòng (không đề nghị)

- **BWV 849 Đô♯ thứ:** LRSM; Henle P5, F6. Fugue 5 bè, 115 ô, ba chủ đề. Mutopia [562](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=562) và [596](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=596) (phạm vi công cộng, Breitkopf 1866); Ishizaka CC0 ([fugue](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_Bach_-_Well-Tempered_Clavier,_Book_1_-_08_Fugue_No._4_in_C-sharp_minor,_BWV_849.ogg) 161 s). Quá nặng cho bài 4 bè đầu tiên: năm bè trong hai tay.
- **BWV 857 Fa thứ:** ARSM; Henle P4, F6; fugue 4 bè, 58 ô, chủ đề nửa cung. Mutopia [2226](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2226) và [2225](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2225) (BGA 1866; giấy phép Creative Commons, chưa đọc đủ loại); có ASAP `bwv_857`. Ngang b1; có thể thay nếu chủ repo thích chủ đề nửa cung.
- **BWV 859 Fa♯ thứ:** ARSM; Henle P4, F5; fugue 6/4. **Không có trên Mutopia**: phải dùng kern hay chép tay.

**Hướng (b) đề nghị b1 (BWV 861):** đúng mức ARSM (ngay sau Grade 8), ngắn, bước 3 bè lên 4 bè rõ ràng, có Mutopia phạm vi công cộng và bản thu CC0, không cần bài lõi mới. Chọn b2 nếu chủ repo muốn lượt này làm luôn bài lõi canon và mô phỏng.

---

### Đề xuất làm trước (một bài trong lượt này)

**Làm b1 trước: Bach, Prelude và Fugue Sol thứ BWV 861.** Lý do:

1. **Rủi ro thấp nhất.** Không đụng `cap` hay bản ghi đã khóa, không cần bài lõi mới. Trang dài vừa phải (19 + 34 ô), cỡ bài BWV 847.
2. **Bằng chứng cấp thẳng.** ABRSM ARSM (2024) và nhãn ARSM của Henle trùng nhau, nên xếp chặng 7 theo đúng quy tắc của site.
3. **Đủ nguồn.** Ấn bản BGA 1866 (#173661), Mutopia phạm vi công cộng cho cả prelude và fugue, kern để so nốt, bản thu CC0 phát được trên site (Ishizaka, cùng bộ với bản đang dùng cho BWV 846, 847).
4. **Lấp đúng chỗ.** Chặng 7 có bài Baroque đầu tiên, nối tiếp BWV 847 ở chặng 6 (Học tiếp của trang BWV 847 vẫn đang gợi ý "các fugue khác của quyển 1").

***Pathétique* trọn ba chương (a1) để lượt sau.** Trước đó chủ repo chọn cách xử lý `cap`: A1 là bản ghi mới không có `cap`, link tay, không mở khóa (đề nghị); A2 là chuyển `cap` của hướng dẫn nghe sang bài mới. Trước khi viết cũng phải nghe kiểm bản Pitman chương 1. Bài này cũng đủ điều kiện: ARSM *complete*, Henle 7, bản thu CC0 đủ ba chương, bốn nguồn bản số. Nhưng việc lớn hơn nhiều (595 ô, ba chương, tránh trùng bài chương 2).

### Nguồn bị chặn hay chưa kiểm

- `abrsm.org`: trang HTML trả 403 với WebFetch. File PDF ARSM 2024 trên `www.abrsm.org/sites/default/files/` tải được bằng curl. Danh sách LRSM 2023 và ARSM 2017 lấy qua bản lưu Wayback.
- `henle.de`: link kiểu cũ `henle.de/en/detail/?Title=…` trả 410. Dùng link mới `henle.de/<tên>/HN-<số>`, đọc được.
- piano-midi.de: không mở lại. MIDI *Pathétique* đã có trong `sources.json`.
- Chưa tra Trinity, RCM; chưa nghe bản thu nào.
- IMSLP: chỉ đọc API và HTML, không tải file.

Tệp tạm của khảo sát (PDF ABRSM, file kern, HTML IMSLP) ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/5aff8b71-fece-4be3-9817-e9eb6d2a985d/scratchpad/ks4/c7dl/`.

## 3. Scarlatti

Làm ngày 24/11/2026; mọi link dưới đây mở trong ngày đó. Chỉ đọc repo, không sửa gì.

### Hiện trạng trong repo

- Tác giả `scarlatti` đã có trong `src/data/nha-soan-nhac.yml` (Domenico Scarlatti, 1685–1757). Bản ghi này không có `thoi_ky` và `cach_viet_khac`; bài học tự ghi `thoi_ky: Baroque` nên không cần sửa bản ghi tác giả.
- Hướng dẫn nghe `nghe-nhac/scarlatti-sonata`, bản ghi `scarlatti-sonata` (`loai: nghe`, `ten: Ba bản sonata`, `danh_muc: K. 380, K. 141, K. 466`). Trang viết về ba sonata, mục "Nếu bạn muốn chơi" ghi K. 380 "khoảng chặng 6 (ABRSM Grade 7 theo trang của Henle, mức 5…)", rồi khuyên bắt đầu bằng K. 32 hay K. 34. `ban_thu` có Smullyan K. 380 (CC BY-SA 2.0, 180,33 s, phát được) và hai bản Sankey; mốc `0 37 - 88`.
- Quan hệ `cap`: bản ghi `scarlatti-sonata` là bản ghi riêng của một tác phẩm lớn hơn (ba sonata), như *Kinderszenen* với *Träumerei*. Bài học K. 380 có thể `cap: nghe-nhac/scarlatti-sonata`, nhưng khi đó bản ghi `scarlatti-sonata` (đã khóa) phải trỏ `cap` ngược lại. Đó là việc ngoài phạm vi, làm ở nhánh `mo/` như lượt 9 (Alla turca). K. 208 và K. 32 không nằm trong trang nghe nên không có `cap`; chỉ link bằng chữ.
- Bài học theo chặng 2–7 (đếm trên `tac-pham.yml` hôm nay): 8, 6, 8, **6**, **9**, 6. Chặng 5 không có bài Baroque nào (Beethoven, Chopin, Mendelssohn, Mozart, Schumann, Bartók); chặng 6 đã có 9 bài.
- Trang `piano/tac-pham-theo-cap`: K. 32 ở chặng 4 (không link); K. 208 và K. 380 chưa có. Trang `piano/nha-soan-nhac`: "K. 32 … → K. 1, K. 466 → K. 380 (Grade 7) → K. 141".
- `tools/audio/align/sources.json`: `imslp_Scarlatti_K380.mid` (Pierre Gouin, IMSLP, `manual: true`). Chưa có MIDI K. 208 hay K. 32.

### Bằng chứng cấp độ (đã đọc)

| Sonata | ABRSM | RCM 2022 | Henle (thang 1–9) |
|---|---|---|---|
| K. 208 La trưởng (L. 238) | **Grade 6** ở cả bốn kỳ 2021–22, 2023–24, 2025–26, 2027–28 (danh sách A, sách *200 Sonatas* tập 2, EMB) | Level 7 | **4** (HN 581, *Selected Piano Sonatas* IV; Henle ghi "ABRSM Piano Grade 6") |
| K. 380 Mi trưởng (L. 23) | **Grade 7** ở cả bốn kỳ 2021–2028 (sách ABRSM *Keyboard Pieces and Sonatas* Book 3, tr. 30–33, hay EMB tập 3) | Level 9 | **5** (HN 395, tập I; trang lẻ HN 574 ghi trường mức khó là 5, nhưng phần mô tả lại viết "level 4/5"; cả hai ghi "ABRSM Piano Grade 7") |
| K. 32 Rê thứ (L. 423, *Aria*) | không có ở 2021–2028 | Level 4 | **3** (HN 581) |
| (tham khảo) K. 1 Rê thứ | không | – | 4 (HN 581) |
| (tham khảo) K. 83, chương 2 *Minuet* | Grade 4, 2027–2028 (chỉ một chương) | – | – |
| (tham khảo) K. 513 / K. 443 | Grade 8 (2025–26 / 2021–2028) | – | 6 / – |

Nguồn:
- ABRSM: PDF đề cương 2021–2022, 2023–2024, 2025–2026, 2027–2028 (bản các agent khác đã tải ở `ks4/pdf/a2122…a2728`; URL gốc trên abrsm.org, như các khảo sát trước). Đã kiểm tiêu đề GRADE đứng trước từng dòng: K. 208 nằm sau "GRADE 6", K. 380 sau "GRADE 7".
- RCM: *Piano Syllabus, 2022 Edition*, https://teacherportal.rcmusic.com/getattachment/57f3734d-97e5-4777-b67e-4b1111ee31a3/piano-syllabus-2022-edition.pdf (K. 32 dưới "Level 4", K. 208 dưới "Level 7", K. 380 dưới "Level 9").
- Henle: https://www.henle.de/Selected-Piano-Sonatas-Volume-IV/HN-581 (K. 1, K. 32, K. 208), https://www.henle.de/Selected-Piano-Sonatas-Volume-I/HN-395 và https://www.henle.de/en/Piano-Sonata-in-E-major-K.-380-L.-23/HN-574 (K. 380). Mức khó từng bài lấy từ bảng nội dung của tập.
- Trinity: không có đề cương trong tay; tìm trên web không thấy K. 32, K. 208, K. 380 trong danh sách Trinity. Chưa kiểm.

### Ứng viên (xếp theo thứ tự đề nghị)

#### 1. Đề nghị: Sonata La trưởng K. 208 (L. 238), *Adagio e cantabile*: chặng 5

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `scarlatti-sonata-la-truong` (hay `scarlatti-k208`), `scarlatti` (đã có) |
| Bản quyền | Scarlatti mất 1757. Ấn bản Longo: Ricordi, Milano, 1906; Alessandro Longo mất 1945. Ở Việt Nam phần biên tập hết bảo hộ (50 năm sau khi mất, từ 1996); ở Mỹ in trước 1930. Không dùng bản Gilbert (Heugel 1974; Gilbert mất 2020, IMSLP ghi "Public Domain" theo luật Canada) hay Kirkpatrick (Schirmer 1953) |
| Ấn bản | Longo, *Opere complete per clavicembalo* tập 5, Ricordi 1906, số bản in E.R. 545, tr. 147–148, số 238: IMSLP #914846. Cùng bản quét có ở repo `craigsapp/scarlatti-keyboard-sonatas`, file `reference-edition/L238K208.pdf` (commit `567731b`, đã tải và xem trang 1). Longo ghi "Andantino cantabile (♩=72)", thêm sắc thái, ngón và chú thích a), b) về chỗ ông sửa. Chỉ dẫn gốc của bản chép tay là *Adagio e cantabile* (IMSLP, Henle), nên trang dùng chữ gốc, không dùng chữ của Longo |
| Nguồn đối chiếu | Không có kern hay Mutopia (repo kern của Sapp có 65 bản, không có K. 208; Mutopia chỉ có K. 11, K. 455, K. 491 và một bản Đô trưởng). Chép tay trích đoạn từ bản quét Longo, so nốt với bản Pierre Gouin (Éditions Outremontaises 2013, biên soạn từ bản chép tay, CC BY-SA 4.0): PDF IMSLP #293023, MIDI #293026 (MIDI cũng dùng để căn mốc) |
| Bản thu | Commons: **không có bản dùng tự do ở Mỹ**. Bản duy nhất là Ralph Kirkpatrick, Columbia 1954 (gắn PD-EU-audio, PD-US-record; theo Music Modernization Act còn bảo hộ ở Mỹ tới 2064), nên loại. IMSLP: **Robert Stephen Hill, fortepiano, "Public Domain"** do chính người chơi đăng (2025, tên file ghi 2004, chơi theo bản chép tay), #961413: **chỉ dẫn link**. Loại: Fou Ts'ong (Music Guild 1962: còn bảo hộ ở Mỹ tới 2067), Bradley-Fulgoni (CC BY-NC-ND), Rondeau (dựng từ MIDI). Musopen trả về 403, chưa kiểm được |
| Cấp độ | ABRSM Grade 6 ở bốn kỳ liền nhau 2021–2028; Henle mức 4; RCM Level 7. Grade 6 suy ra chặng 5 |
| Chỗ đứng | Chặng 5 đang có 6 bài và không có bài Baroque nào. K. 208 là bài Baroque duy nhất ở chặng này, và là bài học Scarlatti đầu tiên |
| Kỹ năng chính | Hát một giai điệu có trang trí (appoggiatura, trill, nhóm móc ba nhanh) trên bè trầm đi đều từng phách bằng quãng và hợp âm staccato nhẹ; giữ nhịp chậm 4/4 mà không lê; hình thức hai đoạn (nửa đầu sang Mi trưởng, "vần" ở cuối hai nửa). Học cùng [nốt hoa mỹ](/opus/piano/not-hoa-my/) |
| Chỗ chưa chắc | (a) Bản thu chỉ dẫn link, và là fortepiano chứ không phải piano. Cần nghe để biết có chơi các dấu nhắc lại không, và đo độ dài. (b) Bản Longo khác bản chép tay ở vài chỗ (chú thích a, b): đối chiếu với Gouin, ghi trong hồ sơ. (c) K. 208 thường đi cặp với K. 209; trang có thể nhắc, không cần dạy. (d) Phải thêm K. 208 vào bảng chặng 5 của `piano/tac-pham-theo-cap`: việc của nhánh `mo/` |
| Chủ repo tải | Bản thu Hill: https://imslp.org/wiki/Special:ImagefromIndex/961413; MIDI Gouin: https://imslp.org/wiki/Special:ImagefromIndex/293026; PDF Gouin: https://imslp.org/wiki/Special:ImagefromIndex/293023. Bản Longo không cần tải từ IMSLP (đã có trên GitHub) |

#### 2. Sonata Mi trưởng K. 380 (L. 23), *Andante commodo*: chặng 6 (như lộ trình gợi ý)

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `scarlatti-sonata-mi-truong` (hay `scarlatti-k380`), `scarlatti`; `cap: nghe-nhac/scarlatti-sonata` |
| Bản quyền | Như trên. Longo tập 1, Ricordi 1906 |
| Ấn bản | Longo tập 1, E.R. 541, tr. 78–81, số 23: IMSLP #691879; cũng có ở `reference-edition/L023K380.pdf` của repo Sapp (4 trang, đã tải). Bản chép tay 1754, *Libro X*: IMSLP #964987 |
| Nguồn đối chiếu | Không có kern hay Mutopia. MIDI Gouin (CC BY-SA 4.0) **đã có** (`imslp_Scarlatti_K380.mid`); PDF Gouin IMSLP #133292. Chép tay trích đoạn từ Longo, so nốt với MIDI |
| Bản thu | **Phát được**: Raymond Smullyan, piano, Commons, CC BY-SA 2.0, 180,33 s, không chơi dấu nhắc lại. Bản này đã ở `ban_thu` của `scarlatti-sonata`, mốc ô 19 ở 37 giây đã đo. Loại: Marcelle Meyer 1954 (Commons, PD-EU, còn bảo hộ ở Mỹ), Fou Ts'ong 1962, Luisi (NC), Sankey (dựng từ MIDI) |
| Cấp độ | ABRSM Grade 7 ở bốn kỳ 2021–2028; Henle mức 5 (trang lẻ HN 574 viết "4/5"); RCM Level 9. Suy ra chặng 6 |
| Chỗ đứng | Có sẵn nhiều nhất: MIDI, bản thu, mốc, trang nghe để ghép `cap`. Nhưng chặng 6 đã có 9 bài, đông nhất, và lộ trình đã từng phải bỏ bớt bài ở chặng này |
| Kỹ năng chính | Lời gọi kèn và đối đáp hai "nhóm nhạc cụ"; trill, nốt lặp, nhảy quãng; tiếng nhẹ, gọn, ít bàn đạp |
| Chỗ chưa chắc | Ghép `cap` phải mở khóa bản ghi `scarlatti-sonata` (nhánh `mo/`, sau khi gộp nhánh `them/`). Câu "Ba bản trong trang này…" và mục "Nếu bạn muốn chơi" của trang nghe có thể phải link sang bài học: cũng là việc `mo/` |
| Chủ repo tải | Không bắt buộc (MIDI đã có, Longo trên GitHub). Tùy chọn: bản chép tay https://imslp.org/wiki/Special:ImagefromIndex/964987 |

#### 3. Sonata Rê thứ K. 32 (L. 423), *Aria*: chặng 4 (ước lượng)

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `scarlatti-aria-re-thu` (hay `scarlatti-k32`), `scarlatti` |
| Bản quyền | Như trên. Bản in đầu: Roseingrave, *XLII Suites de pièces*, London (B. Cooke) 1739, tập 1 (in khi tác giả còn sống, hết bảo hộ) |
| Ấn bản | Roseingrave 1739: IMSLP #461759 (bản chụp lại) và #913910; Longo tập 9, Ricordi 1910, E.R. 549, tr. 99, số 423: IMSLP #626440, cũng có ở `reference-edition/L423K032.pdf` (1 trang, đã xem: 3/8, 25 ô nhịp, 9 + 16, Longo ghi "Aria, Moderato (♩.=40)") |
| Nguồn đối chiếu | Không có kern hay Mutopia. Chép tay từ Roseingrave hay Longo; MIDI Gouin (CC BY-SA 4.0) IMSLP #276768 để so nốt và căn mốc |
| Bản thu | **Phát được**: Commons, "Domenico Scarlatti, Sonata in D minor, K.32.wav", AugusteBlanqui (tự thu, ghi "Piano recording"), 2020, CC BY-SA 4.0, 125,64 s, có MP3 chuyển mã. Loại: Sylvia Marlowe (Capitol 1956, còn bảo hộ ở Mỹ), Marcelle Meyer 1954 |
| Cấp độ | Không có trong ABRSM 2021–2028. RCM Level 4; Henle mức 3. Ghi "(ước lượng)": khoảng Grade 4, chặng 4, khớp chỗ trang `tac-pham-theo-cap` đang đặt |
| Chỗ đứng | Bài ngắn nhất và dễ nhất (một trang); hai trang `the-loai` và `nha-soan-nhac` đã giới thiệu nó là bài nên chơi đầu tiên. Nhưng chặng 4 đã có 8 bài, và cấp độ chỉ là ước lượng |
| Kỹ năng chính | Giai điệu aria nhịp 3/8 trong giọng thứ, nhóm móc kép nối, hai bè rõ, hợp âm tay trái giữ ngân |
| Chỗ chưa chắc | Phải nghe để chắc đây là đàn thật (người đăng là người dùng Commons, không phải nghệ sĩ có tên) và xem có chơi dấu nhắc lại không |
| Chủ repo tải | MIDI Gouin: https://imslp.org/wiki/Special:ImagefromIndex/276768 |

Không đề nghị K. 1 (Henle 4): không có trong đề cương nào trong tay; bản thu chỉ có NC (Mantione, Höger) hay Sankey (dựng từ MIDI). K. 431 và K. 391: chỉ có bản Sankey, không có bằng chứng cấp độ.

### Kết luận

Đề nghị số 1 là **K. 208**, cho chặng 5:
- bằng chứng cấp độ mạnh nhất (ABRSM Grade 6 suốt 2021–2028, Henle 4, RCM 7);
- lấp đúng chỗ trống: chặng 5 đang ít bài và chưa có bài Baroque;
- bài ngắn, chậm, hợp người lớn tự học.

Điểm yếu: không có bản thu phát được, chỉ dẫn link IMSLP (Hill, fortepiano). Nếu chủ repo muốn bài có bản thu phát được, hay muốn giữ đúng lộ trình, thì chọn K. 380 (chặng 6). K. 380 có sẵn mọi thứ, nhưng chặng 6 đã đông và phải mở khóa `scarlatti-sonata` để ghép `cap`. Có thể làm cả K. 208 lẫn K. 380, vì hai bài ở hai chặng khác nhau.

### Nguồn đã mở (24/11/2026)

- IMSLP (API wikitext, rồi số chỉ mục lấy từ HTML của trang): https://imslp.org/wiki/Keyboard_Sonata_in_A_major,_K.208_(Scarlatti,_Domenico); …_D_minor,_K.32_…; …_E_major,_K.380_…; …_D_minor,_K.1_….
- Henle: ba trang đã ghi ở mục cấp độ.
- ABRSM: PDF đề cương 2021–2022, 2023–2024, 2025–2026, 2027–2028; RCM 2022 (link ở trên).
- Commons: thể loại "Audio files of music by Domenico Scarlatti" (367 file), trang mô tả từng file đã nhắc ở trên (đọc bằng `tools/audio/commons.py page/info`), mẫu PD-US-record.
- Mutopia: https://www.mutopiaproject.org/cgibin/make-table.cgi?Composer=ScarlattiD
- Kern: https://github.com/craigsapp/scarlatti-keyboard-sonatas (theo ấn bản Longo; giấy phép **CC BY-NC-SA 4.0**, nên dù có bản nào cũng chỉ dùng để đối chiếu, không chép lên site). Trong ba sonata ứng viên, repo chỉ có bản quét Longo, không có file kern.

### Nguồn bị chặn hay chưa kiểm

- Musopen (musopen.org): 403.
- Trinity: không có đề cương trong tay.
- ABRSM trước 2021: chưa kiểm.
- File chép tay Venice và Parma của K. 208: chưa tìm trên IMSLP.
