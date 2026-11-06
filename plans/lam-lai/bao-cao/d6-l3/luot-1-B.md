# D6-L3, lượt 1, phần B

Claude Opus 5.5, 05/11/2026, nhánh `moi/d6-l3`. Bốn bài học chặng 4 (`piano/tac-pham/chopin-prelude-la-truong`, `chopin-prelude-mi-thu`, `grieg-arietta`, `satie-gymnopedie`) và bốn bản ghi cùng tên (lần 2, các trường chưa khóa).

## Số liệu

| Hồ sơ | Nhận định | Theo loại | Kết quả |
|---|---|---|---|
| trang chopin-prelude-la-truong | 95 | cau-truc 41, ve-site 18, khuyen-tap 15, ten 6, lich-su 5, so-lieu 4, quy-tac 3, dinh-nghia 2, cap-do 1 | dung 73, khong-can-nguon 15, da-sua 5, chưa chắc 2 |
| trang chopin-prelude-mi-thu | 84 | cau-truc 34, khuyen-tap 16, ve-site 15, lich-su 7, ten 7, dinh-nghia 4, cap-do 1 | dung 61, khong-can-nguon 16, da-sua 7 |
| trang grieg-arietta | 89 | cau-truc 23, khuyen-tap 20, ve-site 16, lich-su 9, ten 7, so-lieu 5, dinh-nghia 3, quy-tac 3, nam 2, cap-do 1 | dung 64, khong-can-nguon 20, da-sua 4, da-bo 1 |
| trang satie-gymnopedie | 78 | cau-truc 30, khuyen-tap 17, ve-site 10, lich-su 7, ten 7, dinh-nghia 4, so-lieu 2, cap-do 1 | dung 50, khong-can-nguon 17, da-sua 10, da-bo 1 |
| bản ghi chopin-prelude-la-truong (n6–n27) | 22 | cau-truc 11, ten 4, lich-su 2, cap-do 2, nam 2, so-lieu 1 | dung 20, da-sua 1, chưa chắc 1 |
| bản ghi chopin-prelude-mi-thu (n6–n26) | 21 | cau-truc 10, ten 4, lich-su 2, cap-do 2, nam 2, so-lieu 1 | dung 18, da-sua 2, chưa chắc 1 |
| bản ghi grieg-arietta (n6–n25) | 20 | cau-truc 10, ten 4, cap-do 2, nam 2, lich-su 1, so-lieu 1 | dung 19, da-sua 1 |
| bản ghi satie-gymnopedie (n6–n24) | 19 | cau-truc 8, ten 4, lich-su 2, cap-do 2, nam 2, so-lieu 1 | dung 17, da-sua 1, chưa chắc 1 |

Hồ sơ đọc được bằng `node tools/khoa.mjs xuat` (cả tám). Kiểm thêm bằng `loiHoSo` của `tools/khoa.mjs`: chỉ còn lỗi do chưa có lượt 2, review, và các câu chưa chắc (`ket_qua: null`).

## Bản nhạc và khuông nhạc

| Bài | Bản đã đối chiếu | Số ô |
|---|---|---|
| Prélude La trưởng | Mutopia 470 (Edition Peters, `.ly` tải mới), kern của Craig Sapp trong `../opus-zero/_imslp/` | 16 ô và một phách lấy đà |
| Prélude Mi thứ | Mutopia 468 (Peters 1879, `.ly` tải mới) | 25 ô và một nhịp lấy đà |
| Arietta | Schirmer's Library Vol. 201 (1899, Internet Archive, ảnh trang 3) | 23 ô (4 + 5 + 5 + 4 + 5) |
| Gymnopédie số 1 | bản in gốc 1888 (IMSLP 03213, bản quét trên Wikimedia Commons, ảnh từng trang) | 78 ô viết liền: 4 + 8 + 9 + 10 + 8, rồi 31 + 8 |

Mutopia không có Arietta và Gymnopédie. PDF trên IMSLP bị chặn, nên không dùng.

Khuông: 11 khối.
- **Trích đoạn (1):** Prélude La trưởng, nhịp lấy đà và ô 1–4. Khớp từng nốt cả hai tay với Mutopia và kern, kể cả dấu bàn đạp.
- **Ví dụ soạn (10):** 3 (La trưởng) + 2 (Mi thứ) + 3 (Arietta) + 2 (Gymnopédie). Đúng điều trang nói, ngón chơi được, mỗi ô đủ phách.

## Đã sửa, đã bỏ (trang)

Mỗi chỗ có mục `doi_chu` viết tay, chữ hiển thị đã bỏ Markdown, chưa ghép với `so-chu.mjs`.

**Prélude La trưởng**
- n13: "bài khó hơn về kiểm soát tiếng đàn" (so với Mi thứ) thành mức Henle (cả hai mức 4) và số ô (16 và 25).
- n18: "Si thứ u buồn" thành chỉ dẫn tốc độ *Lento assai*, *Molto agitato* (IMSLP).
- n24: tên bộ biến tấu Mompou viết *Variations sur un thème de Chopin* (đĩa Naxos qua MusicWeb). Tên tiếng Tây Ban Nha không có nguồn.
- n55: "hơn một quãng mười" thành "một quãng mười". La♯4–Đô♯6 là quãng mười thứ.
- n75: hai đường rải riêng "(hai tay rải cùng lúc)" thành "không nhất thiết là hai tay rải cùng lúc", như trang đã khóa `piano/not-hoa-my`.

**Prélude Mi thứ**
- n4: câu mở đầu và mô tả: "một trong những trang nhạc buồn nhất" thành "được chơi trong lễ tang của chính Chopin".
- n12: "Bài Chopin đầu tiên lý tưởng … âm nhạc sâu" thành mức Henle 4, thấp nhất trong Op. 28.
- n14: "Chopin tôn sùng Bach" thành "mang theo Bình quân luật tới Mallorca" (Henle).
- n18: bỏ tên Hans von Bülow ở biệt danh "Ngạt thở". Chỉ Wikipedia ghi tên này.
- n19, n70 (lễ tang): NIFC ghi "Preludes in E minor and B flat minor", Ville de Paris ghi Mi thứ và Si thứ. Viết chung: "hai prelude, trong đó có bài Mi thứ". Bỏ "(cũng được chơi trong lễ tang)" ở Học tiếp.
- n45: bỏ vế sức khỏe "cẳng tay dễ mỏi và cứng". Giữ "chơi từ mặt phím".
- n82: dòng Wikipedia ở mục Nguồn thay bằng Henle HN 882 và NIFC.

**Arietta**
- n19: *Vektersang*, *Fedrelandssang* thành *Vægtersang*, *Fædrelandssang* (IMSLP).
- n23 (bỏ): "giai điệu Grieg yêu thích nhất". Chỉ Wikipedia.
- n30: Gilels: bỏ "nổi tiếng". Ghi thêm: album Deutsche Grammophon của ông mở đầu bằng Arietta.
- n82: lời giải thích câu hỏi 1.
- n87: dòng Wikipedia ở mục Nguồn thay bằng IMSLP và Britannica.

**Gymnopédie số 1**
- n5: "ô nào cũng vậy" thành "gần như ô nào cũng vậy". Ô 38–39 và 77–78 là hợp âm khối.
- n9: bỏ "những thứ Debussy, Ravel và các nhạc sĩ tối giản về sau đi tiếp", thay bằng Britannica ("then-novel chords … pioneer in harmony").
- n12, n14, n13 (bỏ): Bối cảnh.
  - Thêm "vừa rời nhà cha mẹ" (Henle).
  - Bỏ câu về Wagner.
  - "đi theo hướng ngược lại hoàn toàn" thành "được viết thật giản dị".
- n16: "thích những cái tên bí ẩn" thành lời tự giải thích đầy mỉa mai (Salammbô; Henle).
- n19: "được nghe nhiều nhất, trong phim, quảng cáo, phòng chờ" thành "những bản piano nổi tiếng nhất của Satie" (Britannica).
- n58, n71: "không có chỗ nào cần *f*" sai. Bản in gốc ghi *f* ở ô 9 và ô 48, dưới nốt Fa♯ ngân dài. Đã viết lại câu sắc thái và lời giải thích câu hỏi 2.
- n76, n77: mục Nguồn.
  - Thêm lời tựa Henle HN 1072.
  - "đối chiếu với bản LilyPond của Mutopia (Dover)" thành "đối chiếu với bản in gốc (Commons)". Mutopia không còn Gymnopédie.

## Dữ liệu (`sua-B.yml`, 7 mục)

1. `chopin-prelude-la-truong` và `chopin-prelude-mi-thu`, Sáng tác: "viết trong khoảng 1835–1839" sai, vì không nguồn nào có mốc 1835. Đề xuất "hoàn tất ở Mallorca mùa đông 1838–1839 (vài bài có thể có từ đầu thập niên 1830)". Nguồn: Ấn bản Quốc gia "1831(?)–1839"; Henle.
2. `chopin-prelude-mi-thu`, Độ khó: bỏ "(ước lượng)". Bài có trong đề cương RCM 2022, Level 7; Henle mức 4.
3. `grieg-arietta`, Độ khó: bỏ "(ước lượng)". Bài có trong đề cương: ABRSM Grade 4 (2019–2020), RCM Level 6; Henle mức 4.
4. `satie-gymnopedie`, Sáng tác: "khi Satie 22 tuổi" thành "(tháng 2 đến đầu tháng 4) … chưa đầy 22 tuổi". Satie sinh 17/5/1866, nên lúc viết ông 21 tuổi; Henle lại ghi "at the age of 22".
5. Có điều kiện:
   - `satie-gymnopedie`, Bản nhạc: bỏ "Dover".
   - Hai bản ghi Prélude, Bản nhạc: bỏ "Wiener Urtext".

   Chỉ áp khi lượt 2 cũng không mở được nguồn.

Cả bảy mục hiện trên trang qua `::hop-tac-pham`, nên áp xong thì thêm `doi_chu`.

## Chưa chắc

- **La trưởng, trang:**
  - n77: học trò kể Chopin muốn phần đệm giữ nhịp. Chỉ có sách Eigeldinger, như `chopin-valse-la-thu` n56.
  - n79: "Bản Peters là một ấn bản thế kỷ 19". Mutopia 470 không ghi năm; bản số 4 của cùng người nhập ghi "Peters, 1879".
- **Bản ghi Prélude n21 (cả hai bài):** Wiener Urtext có Op. 28 (UT 50005). Trang của Universal Edition trả 403 nên chưa mở được.
- **Satie, bản ghi n19:** bản in lại của Dover.
- **Lượt 2 nên soát:**
  - Arietta n30: Steen-Nøkleberg là người Na Uy, chưa mở nguồn nói thẳng quốc tịch.
  - Satie n24: de Leeuw "cực chậm"; MusicWeb chỉ ghi "slower".

## Việc cho người giao

1. Áp `sua-B.yml`, rồi thêm `doi_chu` cho dòng Thông tin ở bốn trang.
2. Chạy `npm run build:xem` và `node tools/chuyen/so-chu.mjs <trang> --doi-chu` cho bốn trang để ghép `doi_chu` viết tay. Đáng soát:
   - mô tả trang Mi thứ;
   - các đoạn Bối cảnh (Mi thứ, Satie);
   - bảng Chỗ khó (La trưởng ô 12, Mi thứ hợp âm lặp);
   - mục Nguồn (Mi thứ, Arietta, Satie).
3. **Grade:**
   - Prélude Mi thứ: RCM Level 7 cao hơn grade đã khóa (Grade 5).
   - Prélude La trưởng: grade đã khóa Grade 3–4, nhưng Henle xếp mức 4, bằng bài Mi thứ (Grade 5). Lần 1 cũng đã nêu điều này.

   Cả hai không đổi ở lô này. Chủ repo cân nhắc khi mở khóa.
4. **Mi thứ:** link NIFC ở mục Nguồn là địa chỉ gốc (nay không mở được, đọc qua Wayback 2019). Có thể đổi sang bản lưu.
5. **Câu ở hồ sơ khác, đã soát, không câu nào bị làm sai:**
   - `bat-dau/hoi-dap` n12;
   - `piano/not-lap-not-kep` n10, n16, n41: bốn nốt Sol lặp ô 1 Arietta (Schirmer, PTNA "GGGG"); hợp âm lặp pp Mi thứ; hợp âm lặp phách 2–3 La trưởng;
   - `piano/quang-tam-buoc-nhay` n34, n37, n45: tay trái Gymnopédie; cú nhảy lên Đô6 ở ô 17 Mi thứ, sau láy quanh ô 16;
   - `piano/tieng-dan` n57;
   - `chopin-valse-la-thu` n66;
   - `tchaikovsky-cau-nguyen-buoi-sang` n72;
   - `tchaikovsky-bai-ca-phap-co` n73;
   - `piano/the-loai` n3.

   Riêng `quang-tam-buoc-nhay` n34 nói tay trái Gymnopédie nhảy từ nốt trầm lên hợp âm: đúng, trừ hai ô cuối mỗi lượt.
6. **Thuật ngữ chưa có trong `thuat-ngu.yml`** (cho D3-L5): stretto, smorzando, mazurka, semplice, arietta; *Lent*, *douloureux* (tiếng Pháp).
7. **Satie `thoi_ky` "Cuối thế kỷ 19":** đúng theo năm 1888, nhưng IMSLP xếp Satie và bài này vào "Early 20th century". Nhãn là lựa chọn của site; ghi ở bản ghi n7.

## Nguồn hay dùng

- **Bản nhạc:**
  - Mutopia 468, 469, 470, 472 (Peters, `.ly`);
  - Internet Archive (Schirmer Op. 12, 1899);
  - Wikimedia Commons (bản in gốc Gymnopédies).
- **Ấn bản và nhà xuất bản:**
  - Henle: HN 882 (trang sản phẩm có mức từng prelude; Preface), HN 1072 (Preface Krämer 2011), HN 619, HN 44;
  - Ấn bản Quốc gia Chopin: Preludes Commentary, bảng số WN, trang biên tập.
- **IMSLP** (wikitext qua `api.php`):
  - Op. 28; Lyric Pieces Op. 12, 38–71; Op. 16; 3 Gymnopédies;
  - Category Chopin, Grieg, Satie.
- **Tiểu sử và lịch sử:**
  - NIFC niên biểu 1849 (Wayback); chopin.pl; paris.fr;
  - Britannica (Wayback): Grieg, Satie, Trois gymnopédies, mazurka;
  - Norsk biografisk leksikon; HMT Leipzig.
- **Phân tích:** PTNA (Arietta).
- **Thuật ngữ:** COD qua Encyclopedia.com (mazurka, cadence, stretto, German sixth); Trinity resource 785; Treccani (arietta, smorzando); CNRTL.
- **Đề cương:** ABRSM 2019–2020 và RCM 2022 (PDF đã tải ở D6-L2, mở lại).
- **Bản thu:** Naxos (Cortot, Steen-Nøkleberg), Deutsche Grammophon (Pollini, Argerich, Gilels), Warner (Ciccolini), Decca (Rogé), MusicWeb (Mompou, de Leeuw); Commons API (thời lượng); `ffprobe` cho file Arietta.
- **Sách** (Internet Archive, Open Library): chỉ đọc metadata (Eigeldinger, Samson, Banowetz, Higgins, Orledge, Whiting).
- **Không mở được:**
  - Open Music Theory (403, cả qua Wayback);
  - Universal Edition;
  - Presto Music.

  Không vòng chặn.
