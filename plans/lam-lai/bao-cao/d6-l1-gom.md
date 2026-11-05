# D6-L1, nhánh gom: lượt 2, review (chờ lượt 2 bổ sung, kiểm mẫu và khóa)

Nhánh `moi/d6-l1-gom`, 05/11/2026. Lô D6-L1: 7 bài học tác phẩm chặng 2 (`piano/tac-pham/burgmuller-la-candeur`, `minuet-sol`, `minuet-sol-thu`, `mozart-minuet-k2`, `musette-re`, `schumann-album`, `tchaikovsky-bai-ca-phap-co`) và 7 bản ghi tác phẩm (lần kiểm định 2, trường chưa khóa). Chủ repo giao agent làm theo đề xuất, review sau. Người review: Claude Opus 5.5. Người này không làm lượt 1 hay lượt 2 của lô. Có hai agent con Claude Sonnet 5.5, chỉ tìm và đọc nguồn, không sửa repo. Không khóa gì.

## Lượt 2

Đã nhập ở hai commit trước (`d6-l1-gom/ket-qua-trang-{1,2,3}.yml`, `ket-qua-du-lieu.yml`).

| Phần | Câu | dung | sai | khong-chac |
|---|---|---|---|---|
| Trang | 425 | 409 | 3 | 13 |
| Bản ghi | 170 | 167 | 0 | 3 |

Danh sách cần review: `can-review-{1,2,3,du-lieu}.txt`.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, mở đầu bằng "Review D6-L1-gom: …". Mọi câu đã review có thêm `review: dung`. Lần kiểm định cuối của 14 hồ sơ có `nguoi.review`.

### Câu về chính site (84 câu)

Kiểm trên bản xem (`dist/`), trang đích, khối abc, `tac-pham.yml` và site cũ (trang chưa chuyển). Kết quả: 82 câu đúng, 2 câu sai, đã sửa.

- `minuet-sol` n32 và `mozart-minuet-k2` n33 sai: hai câu link tới "hướng dẫn nghe *Eine kleine Nachtmusik*" để nghe chương 3 (minuet). Nhưng trang ấy (site cũ, bản ghi `mozart-eine-kleine`: "chương 1") chỉ nói về chương 1. Đã trỏ sang `hinh-thuc/minuet-trio` (đã khóa), mục "Đi qua một tác phẩm: Mozart, Eine kleine Nachtmusik, chương 3".
- `tchaikovsky-bai-ca-phap-co` n73: "Nhẹ hơn một chút: La candeur" là so sánh độ khó, cần nguồn ngoài. Trong dữ liệu đã khóa, hai bài cùng chặng 2 và cùng "Grade 2–3". Đã đổi thành "Cùng chặng".
- `minuet-sol`: thêm link tới trang Minuet Sol thứ ở hai chỗ (chữ không đổi).

Soát nhãn của 15 câu mà lượt 2 nêu (về khuông hay bài tập trên site). Đã kiểm phần nói về khuông và bài tập trên từng khối abc, đều đúng, và giữ nhãn vì vế nói về bản nhạc đã qua lượt 2. Khuông trích đoạn đã đối chiếu thêm với file `.ly` của Mutopia: K. 2 ô 1–8 và La candeur ô 1–8, khớp.

### Ba câu lượt 2 ghi `sai`

| Câu | Quyết định |
|---|---|
| `mozart-minuet-k2` n49 | Lượt 2 đúng. Đếm trên `menuet_k2.ly`: ô 1 rơi quãng sáu, ô 2 và ô 3 rơi quãng năm. Trang sửa theo câu đúng của lượt 2. Sửa luôn n38 (bảng Cấu trúc) theo ghi chú của chính hai lượt. Bài tập 1 vẫn rơi quãng sáu ở cả ba ô, nên câu dẫn đúng. |
| `mozart-minuet-k2` n52 | Lượt 2 đúng. Tay trái ô 3 nhảy thẳng Đô4 → Đô3; ô 4 và ô 8 đi xuống qua nốt giữa (Fa3 – Đô3 – Fa2, Đô4 – Sol3 – Đô3). Hàng bảng sửa theo câu đúng. |
| `schumann-album` n18 | Không theo câu đúng của lượt 2. Câu ấy dựa vào bản dịch tiếng Anh trong lời tựa Henle HN 45 ("before the year is out … will have been sold"). Nguyên văn tiếng Đức của quảng cáo (Signale, số đầu tháng 8/1850) trong cùng lời tựa là: "binnen Jahresfrist … eine Auflage von nahe an 2000 Exempl. Absatz gefunden hat", tức "trong vòng một năm đã bán được". Chữ mới: "Tháng 8 năm 1850, nhà xuất bản quảng cáo rằng chỉ trong vòng một năm album đã bán được gần 2.000 bản." Câu này khác câu đúng của lượt 2, nên đã gỡ kết quả lượt 2 và đưa vào lượt 2 bổ sung. |

### 16 câu `khong-chac`

| Câu | Quyết định |
|---|---|
| `burgmuller-la-candeur` n30 | Lượt 1 đã bỏ câu; lượt 2 cũng đề nghị bỏ. Giữ bỏ. |
| `minuet-sol-thu` n6 | Bỏ vế "chưa từng biết cây đàn piano", giữ "Petzold viết cho harpsichord" (lượt 2 xác nhận). Câu mở đầu trang đổi theo. |
| `minuet-sol-thu` n25, n69 | Giữ "giọng trưởng song song". Lượt 2 nêu OMT gọi giọng này là *relative*, nhưng các trang đã khóa của site dùng "song song" theo nghĩa relative: `nhac-ly/07-gam-thu` (định nghĩa "giọng thứ song song (relative minor)"), `08-hoa-bieu`, và `19-at-phu-chuyen-giong`, trang này viết nguyên câu "Si♭ trưởng, giọng trưởng song song của Sol thứ". |
| `minuet-sol-thu` n49 | Giữ. Ô 9 là quãng hai đi xuống tới nốt có láy trên. Dolmetsch (mục Pralltriller, review tự mở): nốt đầu nối với nốt trước. Cùng quy tắc với câu đã khóa ở `piano/not-hoa-my`. |
| `minuet-sol-thu` n61 | Bỏ vế "các ấn bản khác nhau ở chi tiết này". Bỏ luôn vế giống thế ở `minuet-sol` (n64, câu nhãn `khuyen-tap` mà chứa điều cần nguồn). |
| `mozart-minuet-k2` n24 | Không tìm được nguồn bậc 2 cho "câu ngắn, giai điệu dễ hát, bè trầm giản dị"; chỉ có Wikipedia nói vậy. Viết lại theo Concise Oxford Dictionary of Music, mục *galant*: "Courtly. 18th-cent. term to describe elegant style … favoured by … early Mozart". Đưa vào lượt 2 bổ sung. |
| `musette-re` n7 | "chỉ khoảng một phút" thành "khoảng một đến hai phút", theo đề nghị của lượt 2. |
| `musette-re` n43, n70 | Giữ. Concise Oxford, mục *da capo*: "until you come to the word fine (end), or the pause mark". |
| `musette-re` n67 | Giữ. Britannica, mục harpsichord (bản lưu Wayback): cần hai bàn phím để đổi to nhỏ nhanh "for pieces in echo style". Đã thêm nguồn. |
| `schumann-album` n64 | Lượt 1 đã bỏ; lượt 2 cũng không có nguồn. Giữ bỏ. |
| `tchaikovsky-bai-ca-phap-co` n69 | Câu cũ chỉ ghi "(bảy dòng)", không có nội dung. Đã ghi đủ bảy lỗi thường gặp và thêm vào lượt 2 bổ sung. |
| Bản ghi `minuet-sol` n20, `minuet-sol-thu` n18 | Bỏ ấn bản C. F. Peters 1880. Cả hai lượt và agent con đều chỉ thấy nó ở Wikipedia: IMSLP chỉ có Peters 1920; Hofmeister XIX không mở được. Giữ Bach-Gesellschaft 1894. |
| Bản ghi `schumann-album` n19, trang n56, n72 | Agent con xem bản quét bản in đầu: BSB bsb11108083, Schuberth & Co., số bản khắc 1232. Trang 1 *Melodie* không có chữ chỉ tốc độ; trang 3 *Trällerliedchen* có "Nicht schnell.". Bản in năm 1900 in "(Nicht schnell.)" trong ngoặc; Peters ghi *pas vite*. Đã viết lại ba chỗ: chỉ dẫn này do người biên tập thêm. Câu hỏi 2 vẫn hỏi nghĩa của chữ. Cả ba chỗ đưa vào lượt 2 bổ sung. |

### Các câu lượt 2 xác nhận nhưng còn để mở

- `minuet-sol` n11, n74, n75 (năm 1950 của BWV, nghĩa của Anh.): giữ, thêm nguồn bậc 2.
  - Bài điểm sách BWV³ trên IfB: "hrsg. von Wolfgang Schmieder. - Leipzig : Breitkopf & Härtel, 1950". Bài này trích lời tựa Schmieder: chia "echt" (Hauptteil) và "zweifelhaft" (Anhang II).
  - IMSLP ghi số "BWV Anh. II 114".
- `mozart-minuet-k2` n16 (ghi chú của Leopold ngày 26/1/1761): giữ. Lượt 2 tìm được, review đã đọc: Otto Jahn, *Life of Mozart* (1882, Gutenberg), trích nguyên văn ghi chú.
- `minuet-sol` n9 (bỏ câu "dạy các con"): giữ bỏ. Lượt 2 thấy lời tựa Henle HN 349 có ý này, nên muốn thì đưa lại được.
- `mozart-minuet-k2` n86 (bỏ dòng PTNA ở mục Nguồn): giữ bỏ. Lượt 2 tìm được mục PTNA 63258.

## Thuật ngữ và dữ liệu

- **Dấu láy.** `thuat-ngu.yml` (mục mordent: có gạch là chính–dưới–chính, "Không gạch là láy trên") và `piano/not-hoa-my`, cả hai đã khóa, thống nhất: ký hiệu không gạch là **láy trên**, ký hiệu có gạch là **láy dưới**. Câu "không gạch là một láy rền ngắn" ở `not-hoa-my` nói về cách chơi trong bảng của Bach, không phải tên gọi. Vậy hai trang đã khóa không mâu thuẫn. `minuet-sol` đổi "dấu láy (mordent)" thành "láy dưới" và "láy rền ngắn" thành "láy trên". `minuet-sol-thu` đã đúng sẵn.
- **Cảm âm.** `ky_nang_chinh` của `minuet-sol-thu` đổi "nốt cảm" thành "cảm âm", theo thuật ngữ leading-tone đã khóa.
- **Bỏ "(ước lượng)".** Hai bài có trong đề cương nên ghi kỳ đề cương, theo lần 1 đã khóa:
  - `minuet-sol-thu`: "ABRSM xếp bài ở Grade 2 (đề cương 2027–2028); Trinity cũng ở Grade 2 (danh sách từ 2023)".
  - `musette-re`: "ABRSM xếp bài ở Grade 2 (đề cương 2019–2020)".
- **`burgmuller-la-candeur`.** Dữ liệu n15 đổi "người Đức" thành "sinh ở Regensburg (Đức); … năm 1842 nhập quốc tịch Pháp", theo lời tựa Henle HN 1726. Trang n101: dòng Wikipedia ở mục Nguồn (bài ghi sai nơi mất) thay bằng lời tựa Henle HN 1726 và Deutsche Biographie.
- **`schumann-album` n16 (12/1848 hay 1849).** Giữ tháng 12/1848 theo Henle HN 45, phần Bemerkungen ("E1 … erschienen im Dezember 1848"); IMSLP ghi 1849.
- **`minuet-sol-thu` n27 (bản thu).** File gốc trên IMSLP dài 99,72 s, gồm 6,6 s lặng ở đầu và 11,0 s lặng ở cuối. File của site dài 84,65 s. Phần có tiếng của hai file đều dài 82,1 s (đo bằng ffmpeg silencedetect): site chỉ cắt khoảng lặng, không cắt nhạc.
- **Nhãn `musette-re` n52, n84** ("đập quãng tám liên tục dễ làm cứng cổ tay, mỏi"; "xoay cẳng tay giữ sức"). Câu có yếu tố sức khỏe, nên đổi sang `quy-tac`, nguồn BAPAM (như trang đã khóa `piano/quang-tam-buoc-nhay`), và đưa vào lượt 2 bổ sung.
- **Bảy nhận định thiếu `nguon`.** Đây là chỗ sót của lô, `khoa.mjs` sẽ báo khi khóa. Đã thêm nguồn, không đổi chữ:
  - La candeur n69, n82; Tchaikovsky n6: nguồn lấy từ Mutopia, OMT, hay nguồn của bản ghi thuật ngữ đã khóa.
  - Độ dài bản thu ở bốn bản ghi: nguồn là trang file gốc trên IMSLP.
- **`musette-re` n3** (lời khuyên tập ghi `da-sua` mà không có nguồn): đổi thành `khong-can-nguon`, như cách d8 đã làm.

Mọi chỗ đổi chữ trang hay dữ liệu đều có `doi_chu` (21 mục mới), so với trang cũ bằng `so-chu.mjs`. Đã sửa `src/data/tac-pham.yml` ở 7 dòng, đều là trường chưa khóa.

## Lượt 2 bổ sung

- `d6-l1-gom/bo-sung.yml` có 9 câu: `xuat D6-L1 --con-lai`, cộng tay thêm Tchaikovsky n69.
  - Câu viết lại có điều mới hay đổi nhãn: `mozart-minuet-k2` n24; `musette-re` n52, n84; `schumann-album` n18, n56, n72; `tchaikovsky-bai-ca-phap-co` n69.
  - Hai câu lời khuyên tập để mẫu đủ 3 câu (script chọn ngẫu nhiên): `musette-re` n47, `tchaikovsky-bai-ca-phap-co` n25.
- `d6-l1-gom/bo-sung-du-lieu.yml` có 1 câu: `schumann-album` n19.

Mọi câu khác đổi chữ chỉ theo câu đúng của lượt 2, hay chỉ bỏ vế lượt 2 không xác nhận, hay chỉ đổi tên gọi theo thuật ngữ đã khóa. Theo quy ước của d8, các câu ấy không chạy thêm lượt 2; `ghi_chu` ghi "phần còn lại lượt 2 đã xác nhận".

## Kiểm

- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 283 phép, 281 đạt, 2 bỏ qua, 0 hỏng.
- `node tools/khoa.mjs tinh`: không lỗi.
- Gọi `loiHoSo` cho 14 hồ sơ (không ghi gì). Ngoài `nguoi.luot_2` và `nguoi.kiem_mau` còn trống, chỉ còn thiếu kết quả lượt 2 của các câu trong `bo-sung*.yml`.

## Chủ repo cần biết

- `schumann-album` n18: review không theo câu đúng của lượt 2 (lý do ở bảng trên). Lượt 2 bổ sung nên đọc nguyên văn tiếng Đức trong lời tựa Henle HN 45.
- Nguồn của n56, n72, n19 (Schumann): agent con đọc ảnh quét bản in đầu của BSB; review không tự xem ảnh. Lượt 2 bổ sung nên xem lại trang 1 của bsb11108083.
- Câu "chương 3 của *Eine kleine Nachtmusik*": lô chuyển `nghe-nhac/mozart-eine-kleine` có hai lựa chọn: hoặc giữ trang ấy chỉ nói chương 1 (trang của lô này đã không còn link tới đó), hoặc thêm chương 3. Trang đã khóa `hinh-thuc/minuet-trio` cũng gọi trang ấy là "hướng dẫn nghe" cho chương 3; xem lại khi chuyển.
- Lô D6-L2 (`burgmuller-arabesque`) nên viết Burgmüller như dữ liệu mới: sinh ở Regensburg, sống ở Paris từ 1832, nhập quốc tịch Pháp năm 1842, mất ở Beaulieu. Không viết "ở lại Paris đến cuối đời".
- Dòng "Độ khó" của `burgmuller-la-candeur` và nhiều bản ghi khác vẫn có "(ước lượng)". Lô này chỉ sửa hai bài đã được giao.
- Còn trống `nguoi.luot_2` (người làm lượt 2 và lượt 2 bổ sung) và `nguoi.kiem_mau` trong lần kiểm định cuối của 14 hồ sơ.

## Lượt 2 bổ sung và trạng thái khóa (người gom)

- Lượt 2 bổ sung (Claude Opus 5.5): `ket-qua-bo-sung.yml` 9 dung, `ket-qua-bo-sung-du-lieu.yml` 1 dung; đã `nhap`. Schumann n18 đúng nguyên văn Henle HN 45 ("binnen Jahresfrist … nahe an 2000 Exempl."); *Melodie* không ghi tốc độ ở bản in đầu (BSB bsb11108083), "(Nicht schnell.)" là của Peters.
- Đã điền `nguoi.luot_2` cho 14 hồ sơ (7 trang, 7 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau` (chủ repo).
- Mẫu kiểm cho chủ repo: 8 nhận định ở `d6-l1-gom/kiem-mau.yml` (`xuat D6-L1 --mau 8`).
- `npm run build:xem` không cảnh báo `[opus]`; `npm test` 281 đạt; `node tools/khoa.mjs tinh` không lỗi.
