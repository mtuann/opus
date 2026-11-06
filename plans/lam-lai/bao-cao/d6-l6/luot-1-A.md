# D6-L6, lượt 1, phần A

Phần A gồm 2 bài học chặng 7 và 2 bản ghi: `piano/tac-pham/chopin-ballade-1`, `piano/tac-pham/chopin-fantaisie-impromptu`, cùng lần 2 của `tac-pham/chopin-ballade-1`, `tac-pham/chopin-fantaisie-impromptu`. Ngày 5–6/11/2026, Claude Opus 5.5.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu, cap-do | dinh-nghia, quy-tac | khuyen-tap | ve-site | Đã sửa | Đã bỏ | Chưa chắc |
|---|---|---|---|---|---|---|---|---|---|---|
| chopin-ballade-1 | 84 | 24 | 10 | 7 | 12 | 20 | 11 | 18 | 1 (n26) | 2 (n38, n66) |
| chopin-fantaisie-impromptu | 86 | 31 | 6 | 7 | 13 | 20 | 9 | 11 | 3 (n14, n19, n73) | 1 (n69) |

Lời khuyên dính sức khỏe (đau, căng, mỏi, nghỉ) xếp `quy-tac`, nguồn BAPAM như hồ sơ `piano/suc-khoe`, `piano/quang-tam-buoc-nhay`.

Bản ghi (lần 2, chỉ trường chưa khóa; n7–n24):

| Bản ghi | Nhận định | Đúng | Dữ liệu sai | Chưa chắc |
|---|---|---|---|---|
| chopin-ballade-1 | 18 | 14 | n17 (Sáng tác / xuất bản), n20 (Độ khó), n22 (Bản nhạc) | n18 (coda 2/2) |
| chopin-fantaisie-impromptu | 18 | 13 | n17 (Sáng tác / xuất bản), n20 (Độ khó) | n8, n11, n18 (nhịp 2/2) |

Không sửa `src/data/`. Đề xuất nằm ở `sua-A.yml` (7 mục): 5 mục không điều kiện, 2 mục có điều kiện (2/2).

## Khuông nhạc

7 khối: 1 trích đoạn, 6 ví dụ soạn.

- **Fantaisie-Impromptu, ô 5–8.** Đối chiếu với Mutopia `chopin_fantaisie-impromptu` (Scholtz): `.ly` và `.mid`, in nốt MIDI theo ô bằng script Python (mido). Khớp 4/4 ô, từng nốt cả hai tay, gồm sắc thái, dấu luyến tay phải và bàn đạp. Khác bản in có chủ ý, trang đã nói: nhóm sáu tay trái viết thành hai nhóm liên ba. Khối ghi M:2/2, còn `.ly` ghi `\time 4/4` (xem chỗ chưa chắc).
- **Ví dụ soạn.** Ballade 3 khối, Fantaisie-Impromptu 3 khối. Cả sáu đúng điều trang nói, đủ phách, ngón chơi được.
- **Số ô.**
  - Ballade số 1: 264 ô, đếm trên MIDI. Mười đoạn của `hinh` khớp, tổng 7 + 28 + 32 + 26 + 12 + 20 + 40 + 28 + 14 + 57 = 264.
  - Fantaisie-Impromptu: 138 ô (4 + 36 + 42 + 36 + 20).
  - Mọi số ô trang nêu đều đã kiểm.

## Chỗ đã sửa trên trang

Mỗi chỗ sửa có mục `doi_chu` trong hồ sơ. Ở `doi_chu`, `cu` và `moi` là chữ gần đúng.

### chopin-ballade-1

- **n9.** Bỏ "biểu diễn rất thường xuyên". Thay bằng hai điều của Henle: "one of Chopin’s most popular works", và bài thuộc danh sách bằng LRSM.
- **n14, n15: năm sáng tác.** Trước ghi "phác thảo ở Vienna năm 1831 …". Henle chỉ nói hợp đồng in ký ngày 9/1/1836, nên bài xong năm 1835; IMSLP ghi "1831?". Câu "không bao giờ trở về" viết lại theo Henle: Chopin ở Paris đến cuối đời.
- **n16: câu trích Schumann dịch ngược nghĩa.** Henle trích "genialischstes (nicht genialstes)", bản Anh của Henle là "most brilliant (not most inspired)". Đã viết lại theo Henle, không trích.
- **n17, n18: Mickiewicz.** Bỏ "nhà thơ lớn". Bỏ "ông vốn không thích gán chương trình" và ví dụ *Konrad Wallenrod*. Viết theo Henle: không có lời nào của Chopin còn lại về việc này.
- **n20.** Thêm tên Hosenfeld (nguồn WOSU, Sony).
- **n24–n26: nghệ sĩ.** Giữ Horowitz 9/5/1965 (Sony) và Zimerman, DG 1988. Bỏ ba lời đánh giá và câu về Rubinstein. Thêm câu hỏi để người học tự nghe.
- **n36, n37, n68, n73: chủ đề 1 trở lại và coda.** Bản Klindworth cho thấy chủ đề 1 lớn dần (*sempre cresc.*, *molto cresc.*) tới *il più forte possibile* ở ô 206, trước coda. Coda vào *ff* ở ô 208 và kết bằng quãng tám nửa cung ngược chiều. Trước trang ghi "lắng xuống trước cơn bão", "coda từ *pp* lên *forte possibile*", "gam xen kẽ", "mô-típ gợi lại phần mở đầu". Đã sửa cả hai bảng, mục Âm thanh và mục Lỗi thường gặp.
- **n60.** "nấc ♩ = 4" thành "4 vạch máy đếm (nốt trắng)", vì khối 2 đặt tốc độ theo nốt trắng.
- **n70: Mi♭ hay Rê ở ô 7.** Trước ghi "ví dụ Klindworth đưa Rê", nhưng Klindworth in Mi♭. Theo bình chú Henle, Rê là của bản Đức in đầu (Breitkopf 1836) và bản Scholtz in sau. Bỏ "các Urtext đều thảo luận".
- **n72.** Thêm Paweł Kamiński (trang Wydanie Narodowe). Câu chung về bản in thế kỷ 19 thay bằng ví dụ Scholtz của Henle.
- **n75.** "Số 3 dễ nhất" thành mức Henle: số 1–3 mức 8, số 4 mức 9.
- **n84: mục Nguồn.** Bỏ Samson, Eigeldinger, Schumann và Wydanie Narodowe, vì đều là sách chưa đọc. Thay bằng Henle HN 867 (trang, lời tựa, bình chú), HN 862, Mutopia (Klindworth) và IMSLP.

### chopin-fantaisie-impromptu

- **n1, n3.** Bỏ "rất nhiều người lớn mơ được chơi", ở câu mở đầu và `description`. Bỏ "ở dạng nổi tiếng nhất".
- **n13, n14.** Năm 1834 ghi "theo Fontana" (Henle; IMSLP ghi 1834–35). Bỏ "không ai biết chắc vì sao" và "dù ông đã dặn không in".
- **n16: tên bài.** Theo bình chú Henle: bản tay chỉ ghi chỉ dẫn tốc độ, bản chép của Franchomme ghi "Impromptu", tên ghép nhiều khả năng do Fontana đặt.
- **n17–n20, n85: bản d'Este.**
  - Giữ: ngày "Paris Vendredi 1835" và album d'Este (Henle); "soạn cho" (IMSLP); bộ sưu tập Rubinstein (Henle); bản in G. Schirmer [1962] (thư mục).
  - Bỏ: năm mua 1960, cuộc đấu giá và các ý của lời tựa Rubinstein. Chỉ thấy ở nguồn phổ thông.
  - Thêm: ý của Henle rằng bản tay có thể là bản chép sau, và bản Fontana khớp bản chép của Franchomme.
- **n56.** "Nghỉ sau mỗi 20–25 phút" thành "tập từng đợt khoảng 20 phút, xen 10 phút nghỉ", theo BAPAM.
- **n73.** Bỏ vế Eigeldinger (sách in chưa đọc).
- **n75.** "Ở coda, đổi bàn đạp theo từng nốt" thành "theo giai điệu", vì Scholtz đổi theo ô.
- **n86: mục Nguồn.** Bỏ Wikipedia, lời tựa Rubinstein và Eigeldinger. Thêm bình chú Henle và link IMSLP của bài.

Không thêm hay bớt dòng bảng `## Theo dõi khi nghe`, không sửa `::khoi-nghe{moc}`. Hai bảng vẫn 10 dòng, khớp 10 mốc.

## Chỗ chưa chắc

- **Nhịp 2/2.**
  - Ballade n38: coda ở nhịp 2/2? Bản Klindworth ghi 4/4 ở ô 208.
  - Fantaisie-Impromptu n69: bài ở nhịp 2/2? Mutopia ghi `\time 4/4` nhưng `\tempo 2 = 84`.
  - Liên quan: dữ liệu `nhip` và chip của FI, dòng Giọng · nhịp · tốc độ ở cả hai bản ghi.
  - Chưa mở được bản in đầu (IMSLP chặn PDF) hay trang nhạc Henle. Lượt 2 nên xem.
- **Ballade n66 (rubato kiểu Chopin).** Nguồn đúng là lời tựa Mikuli 1879, đã dùng ở hồ sơ `chopin-valse-si-thu` (`mikuli-1879`). Lần này tải lại không được, Internet Archive trả trang lỗi.
- **Sắc thái đầu coda Ballade (n37).** Trang nay theo Klindworth: *ff*. Lượt 2 nên đối chiếu một bản Urtext (Henle, Paderewski).

## Câu `ve-site` ở hồ sơ khác

Đã kiểm trên hai trang mới. Tất cả vẫn đúng.

- **`piano/hai-tay`**
  - n61–n63: Op. 66; bốn móc kép tay phải trên ba nốt liên ba tay trái mỗi phách đen; link. Trang giữ nguyên các chữ ấy.
  - Bài 9, bài 10, lưới 12, hình 3 – 1 – 2 – 2 – 1 – 3, mục *Ba chọi bốn*: khớp `src/content/docs/piano/hai-tay.md`, dòng 205–234.
- **`piano/quang-tam-buoc-nhay`**
  - n37: cú vọt lên Si6 ở ô 7 của FI. Có ở bảng Chỗ khó và ở câu sau khối 1; MIDI có D♯6 rồi B6.
  - n47: FI ô 7 và ô 37–40; Ballade số 1 (đoạn *agitato*, coda). Trang Ballade còn "Đoạn chuyển (*agitato*)" và coda *Presto con fuoco*.
- **Chặng và tiêu đề.** Hai bài vẫn chặng 7 theo dữ liệu đã khóa, tiêu đề không đổi. Các câu đã kiểm:
  - `lo-trinh` n37 (FI khoảng năm phút: Commons 5 phút 27 giây), n38;
  - `tac-pham-theo-cap` n25, n28, n38;
  - `thay-va-thi` n4;
  - `the-loai` n3, n35, n44;
  - `index` n7;
  - `nha-soan-nhac` n82.
- **`chopin-valse-si-thu` n102.** Fontana in FI năm 1855: trang giữ câu này (IMSLP, Henle).

## Nguồn hay dùng

- **Bản nhạc (Mutopia):**
  - `chopin-op23-ballade-1` (Klindworth, Bote & Bock): `.ly`, `-defs.ly`, `.mid`, PDF;
  - `chopin_fantaisie-impromptu` (Scholtz).
- **Henle:**
  - trang HN 867, HN 862, HN 1320;
  - PDF trên henle.de: lời tựa HN 867 (2007), bình chú HN 867 (bản 2025), bình chú HN 1320 (1974).
- **IMSLP** (wikitext qua api.php): Op. 23, Op. 66, Op. 29, 36, 51, Op. 69, 70.
- **Khác:**
  - COD (Encyclopedia.com): ballade, impromptu, Neapolitan sixth;
  - Open Music Theory, Sonata Form (bản lưu Wayback 2025);
  - Wydanie Narodowe (trang chủ);
  - thư mục Hope College (G. Schirmer 1962);
  - BAPAM.
- **Bản thu và phim:**
  - thông cáo Sony Classical (Horowitz 1965; nhạc phim The Pianist);
  - Deutsche Grammophon (Zimerman);
  - WOSU Public Media (cảnh phim);
  - Commons API (hai bản Frank Lévy: 613,59 giây và 326,89 giây, phạm vi công cộng, Musopen).
- **Không mở được:**
  - Viện Chopin (chopin.nifc.pl): quá thời gian chờ;
  - Mikuli trên Internet Archive: trang lỗi;
  - Niecks trên Gutenberg: chưa tìm được bản;
  - classite: 403.

## Người giao phải sửa hay quyết

1. Áp `sua-A.yml`: 5 mục không điều kiện, rồi thêm `doi_chu` cho hai trang, vì `::hop-tac-pham` hiện `thong_tin`.
2. Quyết về 2/2 khi có kết quả lượt 2: mục có điều kiện ở `sua-A.yml`, hồ sơ trang n38 (Ballade) và n69 (FI).
3. Ballade n66: thêm nguồn `mikuli-1879` (như hồ sơ `chopin-valse-si-thu`) nếu mở lại được.
4. Dựng lại `cu`/`moi` chính xác của `doi_chu` bằng `node tools/chuyen/so-chu.mjs <trang> --doi-chu`. Ở FI, mục "Eigeldinger" chỉ có `cu`.
5. Thuật ngữ chưa có trong `thuat-ngu.yml`:
   - ballade;
   - hợp âm Napoli;
   - con fuoco;
   - il più forte possibile;
   - pesante;
   - impromptu;
   - đa tiết tấu (ba chọi bốn);
   - liên bảy.
