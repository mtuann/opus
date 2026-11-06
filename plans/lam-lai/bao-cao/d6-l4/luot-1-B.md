# D6-L4, lượt 1, phần B

Claude Opus 5.5, 05/11/2026, nhánh `moi/d6-l4`. Ba bài học (`piano/tac-pham/chopin-valse-si-thu`, `mendelssohn-thuyen-ca`, `schumann-traumerei`), một hướng dẫn nghe (`nghe-nhac/schumann-kinderszenen`) và bốn bản ghi cùng tên (lần 2, các trường chưa khóa).

## Số liệu

| Hồ sơ | Nhận định | Theo loại | Kết quả |
|---|---|---|---|
| trang chopin-valse-si-thu | 115 | cau-truc 47, khuyen-tap 31, ve-site 13, ten 7, dinh-nghia 6, nam 5, lich-su 5, cap-do 1 | dung 72, khong-can-nguon 31, da-sua 12 |
| trang mendelssohn-thuyen-ca | 117 | cau-truc 50, khuyen-tap 32, ve-site 11, lich-su 7, ten 6, dinh-nghia 5, nam 2, so-lieu 2, danh-muc 1, cap-do 1 | dung 78, khong-can-nguon 32, da-sua 6, da-bo 1 |
| trang schumann-traumerei | 80 | cau-truc 29, khuyen-tap 18, ve-site 15, lich-su 9, so-lieu 5, ten 4 | dung 55, khong-can-nguon 18, da-sua 7 |
| trang nghe-nhac/schumann-kinderszenen | 57 | cau-truc 18, lich-su 12, ten 9, khuyen-tap 6, ve-site 6, nam 3, so-lieu 2, cap-do 1 | dung 39, da-sua 8, khong-can-nguon 6, da-bo 2, chưa chắc 2 |
| bản ghi chopin-valse-si-thu (n6–n26) | 21 | cau-truc 9, ten 4, nam 3, cap-do 2, lich-su 1, danh-muc 1, so-lieu 1 | dung 20, da-sua 1 |
| bản ghi mendelssohn-thuyen-ca (n6–n24) | 19 | cau-truc 9, ten 3, cap-do 2, nam 2, lich-su 1, danh-muc 1, so-lieu 1 | dung 18, da-sua 1 |
| bản ghi schumann-traumerei (n7–n25) | 19 | cau-truc 7, ten 4, so-lieu 3, cap-do 2, nam 2, lich-su 1 | dung 17, da-sua 1, chưa chắc 1 |
| bản ghi schumann-kinderszenen (n4–n11) | 8 | so-lieu 3, cau-truc 2, ten 2, lich-su 1 | dung 8 |

`node tools/khoa.mjs xuat` đọc được cả tám hồ sơ. Đã chạy `loiHoSo`: ngoài phần chờ lượt 2 và review, chỉ còn ba câu chưa chắc (`ket_qua: null`). Câu lời khuyên đã đổi chữ ghi `khong-can-nguon`, như musette-re n3 ở D6-L1-gom.

## Bản nhạc và khuông nhạc

| Bài | Bản đã đối chiếu | Số ô |
|---|---|---|
| Valse Si thứ | Mutopia w10-h-moll-cfi (Peters, Scholtz), `.ly` và `.mid` | 144 ô và một phách lấy đà. Ô 33–64 có nhắc lại; hai ô kết cùng tính là ô 64. Trong `.mid`, từ ô 65 số ô MIDI bằng số ô trang cộng 1 |
| Thuyền ca | Mutopia 1679 (Breitkopf & Härtel 1874–77), `.ly` và `.mid` | 46 |
| Träumerei | Mutopia SchumannOp15No07 (*Leichte Stücke*, 1900), `.ly` và `.mid`; ấn bản Peters (Internet Archive, ảnh trang) | 24 ô và nhịp lấy đà |
| Kinderszenen | Số 1–7: Mutopia (`.ly`, `.mid`). Số 8–13: ảnh trang Peters (Internet Archive `robschumannswerk01schu`, tr. 60–72) | giọng, nhịp, ô đầu, ô cuối |

Công cụ: script Python (mido), in nốt MIDI theo ô và theo từng tay; đọc `.ly` để lấy ngón, sắc thái, bàn đạp. Script để trong scratchpad, không để trong repo.

Khuông nhạc: 11 khối.
- **Trích đoạn (2):**
  - Valse Si thứ, nhịp lấy đà và ô 1–8: khớp từng nốt cả hai tay. Ngón, sắc thái, Ped. và `*` cũng khớp.
  - Thuyền ca, ô 7–11: khớp từng nốt cả hai tay.
- **Ví dụ soạn (9):** 3 khối ở Valse, 3 ở Thuyền ca, 3 ở Träumerei. Khối nào cũng đúng lời dẫn, chơi được, đủ phách. Riêng bài tập 3 của Thuyền ca: ô 1 có một ngón 3, lời dẫn nói "ngón 4–5". Đã ghi ở hồ sơ.

## Đã sửa, đã bỏ (trang)

Mỗi chỗ có một mục `doi_chu` viết tay (chữ hiển thị gần đúng), chưa ghép với `so-chu.mjs`.

**Valse Si thứ**
- n4: "bài dài gần gấp đôi" thành "hơn gấp đôi (144 ô so với 56 ô)".
- n12: "không bao giờ trở lại" thành "cuối năm 1830 rời Ba Lan, sống ở Paris đến khi mất (1849)". Nguồn: Britannica, Henle.
- n26: bỏ tên Lipatti, Rubinstein, Cortot và lời đánh giá, như trang Valse La thứ.
- n35, n46: trio lần hai đi bằng "nốt kép, chủ yếu quãng ba". Ô 85–88 có quãng sáu.
- n49: ô 97, câu "xa hợp âm hơn hai quãng tám" thành "thấp hơn nốt Si3 của hợp âm hai quãng tám".
- n68: nốt lặp "ba lần" thành "hai hoặc ba lần" (ô 72, 80 chỉ lặp hai lần).
- n83, n114: rubato theo lời tựa Mikuli 1879 (Internet Archive, đọc nguyên văn), thay sách Eigeldinger.
- n98, n99: mục Học tiếp.
  - Nocturne Op. 9 số 2 "cùng chặng 6".
  - Thuyền ca và Nocturne Op. 72 số 1 thành "Chặng trước (chặng 5)".
- n100: Op. 64 số 2 "khó hơn" thêm mức Henle (6 so với 4).
- n111: dòng Wikipedia ở mục Nguồn thay bằng IMSLP và Ấn bản Quốc gia.

**Thuyền ca**
- n6: bỏ "Chopin, Schumann, Brahms", thay bằng Träumerei.
- n9: "gặp lại ở Chopin, Fauré, Tchaikovsky" thành "các barcarolle khác".
- n18 (bỏ): tên *Lieder ohne Worte* "có lẽ do Mendelssohn nghĩ ra", vai trò của Fanny. Chỉ có ở Wikipedia.
- n19, n21: bỏ "các tên do nhà xuất bản thêm" và "12/8". Thêm thư năm 1835 gửi Klingemann ("das Venetianische Gondolierlied", lời tựa Henle HN 1172).
- n29: bỏ Barenboim.
- n100: bỏ vế về các bản in trên IMSLP.
- n103: "hai thuyền ca còn lại" thành hai bài *Venetianisches Gondellied* cộng *Gondellied* La trưởng (bốn bài của HN 1172).
- n115: Wikipedia thay bằng Britannica.

**Träumerei**
- n11: Album für die Jugend: "cho con mình" thành "cho người trẻ tập đàn, viết mười năm sau".
- n16: Struck "chuyên gia về Schumann, biên tập viên của Henle".
- n21, n22: Horowitz.
  - Bỏ "khán giả rơi lệ" và lời đánh giá.
  - Ghi hai đĩa: Sony 9/5/1965, Träumerei là bài cuối; DG Moskva 1986.
  - Bỏ Brendel.
- n42: "dấu lặng ngân" thành "dấu ngân".
- n67: ấn bản Clara: "đổi số máy đếm nhịp (♩ = 80)". Bỏ "sửa nhiều dấu nhấn".
- n79: mục Nguồn ghi các nguồn đã mở kèm link; bỏ sách Kapilow.

**Kinderszenen**
- n3: bỏ "ở Leipzig"; thêm "số 6 và 9 có thể xong từ mùa thu 1837" (PTNA); in "cuối tháng 2 năm 1839" (Henle).
- n6: độ dài 17–22 phút. Bản Musopen trên trang dài 22 phút 5 giây.
- n7: câu về Clara sửa cả ở mô tả trang.
  - Viết lại: "đã đính hôn …, giữa lúc cuộc đính hôn vấp phải tranh cãi" (Henle).
  - Bỏ "nổi tiếng khắp châu Âu" và "cha cô ngăn cấm".
- n10: thêm "có lẽ" vào câu Op. 99 và Op. 124.
- n14: Rellstab "có lẽ đã khởi nguồn" biệt danh *Ánh trăng* (Henle HN 1062: "vielleicht").
- n37 (bỏ): câu về Réti.
- n45, n46, n47 (bỏ): mục So sánh bản thu.
  - Horowitz: ghi hai đĩa.
  - Argerich: thay lời đánh giá bằng đĩa DG.
  - Bỏ Cortot.
- n55: mục Nguồn thay Réti và Daverio bằng Henle HN 44 và PTNA.

## Dữ liệu (`sua-B.yml`, 4 mục)

1. `chopin-valse-si-thu` `hinh` ghi_chu: "đi bằng quãng ba" thành "đi bằng nốt kép, chủ yếu quãng ba".
2. `mendelssohn-thuyen-ca`, Độ khó: bỏ "(ước lượng; chặng 5 của site)", ghi ABRSM Grade 6 (đề cương 2023–2024), RCM Level 8, Henle mức 4.
3. `schumann-traumerei`, Giọng · nhịp · tốc độ: số ♩ = 100 không do Schumann ghi. Nó in từ lần in sửa của bản in đầu (1839) và Schumann để nguyên (Henle Comments, Struck).
4. Có điều kiện: `schumann-traumerei`, Bản nhạc: bỏ "Wiener Urtext, Bärenreiter" nếu lượt 2 cũng không mở được trang nhà xuất bản.

Ba mục 1–3 hiện trên trang (`::hinh-cau-truc`, `::hop-tac-pham`): áp xong thì thêm `doi_chu`.

## Chưa chắc

- Kinderszenen n36: "môtip năm nốt của số 1 vang lại ở nhiều bản sau". Năm nốt đúng; vế "vang lại" chưa đối chiếu, sách Réti chỉ có metadata.
- Kinderszenen n54, Träumerei bản ghi n21: Wiener Urtext, Bärenreiter.

## Câu `ve-site` ở hồ sơ khác (đã khóa)

- **`piano/not-lap-not-kep`:**
  - n11, n42 (nốt lặp ô 69–72, 77–80; ngón 3–2–1): đúng. Ô 72 và 80 chỉ lặp hai lần. Câu `cau` của n11 ghi "nốt Sol♯" nhưng nốt lặp là Rê♯, Mi, Si, Đô♯ / Si, Đô♯, Sol♯, La♯; trang not-lap-not-kep không ghi Sol♯.
  - n27 (quãng ba ô 81–88): đúng phần lớn. Ô 85–88 xen quãng sáu; trang này giữ chữ "quãng ba" ở tiêu đề hàng.
  - Thuyền ca ô 7–17, 34–39: đúng.
- **`piano/quang-tam-buoc-nhay`:**
  - n33, n45 (ô 97, Si1): đúng.
  - n34 (tay trái nhảy, Valse và Thuyền ca): đúng.
  - n38 (Thuyền ca ô 36–39, "p rồi pp"): quãng tám ở ô 36, 38, 39. Bản nhạc ghi mf (ô 34), dim. (ô 36), pp (ô 38), không có p. "p rồi pp" là lời khuyên cho quãng tám (tiếng vọng nhỏ hơn giai điệu), không trái bản nhạc; giữ nguyên chữ.
- `cap-nhat` n46 (bản thu Commons, FAE Piano cafe): đúng (API Commons).
- `piano/tieng-dan` n57; `chopin-prelude-mi-thu` n73; `tchaikovsky-cau-nguyen-buoi-sang` n72: trang Träumerei giữ đúng các ý ấy.
- `schumann-album` n33: trang Kinderszenen giữ đúng.
- `schumann-album` n69 ("bản nổi tiếng nhất của Kinderszenen"): trang Träumerei không viết câu này. Nguồn bậc 2 gần nhất là Seiffert (Henle): "probably most famous piano composition from the Children's Scenes cycle".

## Việc cho người giao

1. Áp `sua-B.yml`; thêm `doi_chu` cho Thông tin (Thuyền ca, Träumerei) và cho hình Valse Si thứ.
2. Ghép `doi_chu` viết tay với khung của `so-chu.mjs --doi-chu` ở bốn trang.
3. `piano/not-lap-not-kep` (đã khóa), dòng 199: Valse Si thứ nằm ở hàng "5 (≈ Grade 6)". Dữ liệu đã khóa ghi chặng 6. Xem có cần mở khóa không.
4. `schumann-album` n69: cân nhắc thêm "có lẽ" khi mở khóa.
5. Grade đã khóa: không lệch nguồn.
   - Valse Si thứ: ABRSM Grade 8, RCM 8; Henle mức 4 thấp hơn.
   - Thuyền ca: ABRSM Grade 6.
   - Träumerei: không có trong đề cương; Henle mức 5.
6. **Thuật ngữ chưa có trong `thuat-ngu.yml`** (cho D3-L5): con anima, calando, rf (rinforzando), hợp âm sáu tăng, trio, barcarolle, portato, sempre, âm nền (pedal point), recitative, môtip.
7. Lưu ý về file:
   - Script ghi hồ sơ bằng PyYAML, nên phần lần 1 (đã khóa) của bốn hồ sơ bản ghi được ghi lại theo định dạng khác. Nội dung, ngày và mã băm không đổi.
   - `src/data/tac-pham.yml` có thay đổi trong worktree, không phải của phần B.

## Nguồn hay dùng

- **Bản nhạc:** Mutopia (`.ly` qua GitHub, `.mid` qua mutopiaproject.org); Peters *Werke für Pianoforte solo* Bd. 1 (Internet Archive, ảnh trang).
- **Henle:**
  - HN 131: trang sản phẩm, Comments.
  - HN 1172: trang sản phẩm, Preface của Scheideler.
  - HN 44: trang sản phẩm, Preface của Herttrich, Comments.
  - HN 1062: Vorwort.
  - Seiffert, "From deep sleep to MM 100"; phỏng vấn Struck; Henle Blog 2021.
- **Danh mục và niên đại:** IMSLP (wikitext qua api.php); Ấn bản Quốc gia Ba Lan (bảng số); Britannica (Wayback): Chopin, *Songs Without Words*.
- **Khác:**
  - Lời tựa Mikuli 1879 (Internet Archive djvu.txt).
  - PTNA Piano Encyclopedia (Kinderszenen).
- **Đề cương:** ABRSM 2015–16, 2021–22, 2023–24, 2025–26, 2027–28; RCM 2022 (PDF, đọc bằng pypdf).
- **Bản thu:** Commons API (imageinfo, 15 file một lần); Qobuz (Horowitz 1965, 1986); Deutsche Grammophon (Argerich).
- **Không mở được:** Presto (403), DuckDuckGo HTML (captcha), PDF IMSLP. Không vòng chặn.
