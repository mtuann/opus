# D6-L5, lượt 1, phần A

Phần A gồm 4 trang và 4 bản ghi:
- 3 bài học chặng 6: `piano/tac-pham/bach-prelude-fugue-do-thu`, `pathetique-adagio`, `debussy-clair-de-lune`;
- hướng dẫn nghe `nghe-nhac/beethoven-pathetique` (cả ba chương Op. 13);
- bản ghi cùng tên (lần kiểm định 2, chỉ trường chưa khóa).

Ngày 5/11/2026, Claude Opus 5.5 (agent con). Mọi yêu cầu mạng dùng User-Agent `opus-kiem-dinh/1.0`.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu, cap-do | dinh-nghia, quy-tac | khuyen-tap | ve-site | Đã sửa | Đã bỏ | Chưa chắc | doi_chu |
|---|---|---|---|---|---|---|---|---|---|---|---|
| bach-prelude-fugue-do-thu | 129 | 67 | 3 | 13 | 2 | 29 | 15 | 3 | 1 | 4 | 5 |
| pathetique-adagio | 95 | 33 | 4 | 10 | 5 | 25 | 18 | 6 | 2 | 4 | 14 (2 cũ của D2-0, giữ) |
| nghe-nhac/beethoven-pathetique | 70 | 23 | 12 | 20 | 1 | 4 | 10 | 12 | 3 | 2 | 16 |
| debussy-clair-de-lune | 92 | 23 | 9 | 12 | 5 | 28 | 15 | 7 | 1 | 5 | 10 |

Bản ghi (lần 2):

| Bản ghi | Nhận định | Đúng | Dữ liệu sai | Chưa chắc |
|---|---|---|---|---|
| bach-prelude-fugue-do-thu | n7–n27 (21) | 19 | n21 | n24 |
| pathetique-adagio | n7–n27 (21) | 18 | n25 | n19, n24 |
| beethoven-pathetique | n4–n10 (7) | 6 | 0 | n4 |
| debussy-clair-de-lune | n7–n26 (20) | 17 | n22 | n9, n24 |

Dữ liệu sai thì không sửa `src/data/`. Đề xuất ở `sua-A.yml`, 3 mục.

## Bản nhạc và khuông nhạc

- **Nguồn bản nhạc.** Mutopia, tải tệp `.ly` và `.mid`:
  - `bwv847a`: prelude, theo Breitkopf & Härtel 1866;
  - `fuga2`: fugue, theo Edition Peters;
  - `pathetique-1/2/3`: theo Schirmer 1894, Berners 1908, Peters 1910;
  - `debussy_Ste_Bergamesq_Clair`: theo bản in Fromont 1905.
- **Cách đếm.** Script Python (mido) in nốt theo ô và hai tay, có xử lý đổi nhịp ở chương 1. Script tìm đầu chủ đề fugue. Script đếm vạch nhịp trong `\parallelMusic` để gắn chỉ dẫn của Clair de lune với số ô.
- **Số ô.** Prelude 38, fugue 31, Adagio 73, Clair de lune 72. Mọi số ô trên trang khớp.
- **Bach, 3 trích đoạn:**
  - khối 1, prelude ô 1–4;
  - khối 2, fugue ô 1–4;
  - khối 3, fugue ô 7–8.

  Cả ba khớp từng nốt cả hai tay, kể cả nhãn chủ đề, đáp đề, đối đề. Ở khối 3, nốt Fa đầu ô 7 nối từ ô 6, nên MIDI không có khởi âm.
- **9 ví dụ soạn** (Bach 4–6, Adagio 1–3, Clair 1–3): đúng lời dẫn, đủ phách, ngón chơi được.

## Chỗ đã sửa trên trang

Mỗi chỗ sửa có mục `doi_chu` (cu, moi, ly_do), sinh từ diff.

### bach-prelude-fugue-do-thu

- **n10:** bỏ "nhanh và gắt hơn" (so với BWV 846). Đó là đánh giá không nguồn, như D6-L3 ở `bach-prelude-do` n87. Chữ mới: "mỗi ô một hợp âm, rải bằng một hình nốt lặp lại".
- **n30:** bỏ "(tách tiếng, nhịp sắc)" sau tên Gould.
- **Mục Nguồn:**
  - n126 (bỏ): hai sách in chưa đọc (Ledbetter, Wolff);
  - n127: thêm lời nói đầu Henle HN 14;
  - n128: thêm link tới hai tệp `.ly` đã dùng.

### pathetique-adagio

- **n6, n37:** "Chủ đề quay lại ba lần, mỗi lần một kết cấu khác" và "chủ đề A quay lại ba lần" thành "vang lên ba lần". Chủ đề có ở ô 1, 29, 51, và ô 29 cùng kết cấu với ô 1–8. Như D6-L3 ở fur-elise.
- **n13:** "nổi tiếng như một nghệ sĩ piano biểu diễn ngẫu hứng hơn là một nhà soạn nhạc" thành "đã nổi tiếng như một nghệ sĩ piano, nhất là tài ứng tác" (Beethoven-Haus). Thêm "(1792)".
- **n75 (bỏ):** "Đàn của Beethoven năm 1798 có tiếng tắt nhanh hơn đàn hiện đại". Không có nguồn đã mở.
- **n86:** "Cùng chặng" có Schubert Impromptu Sol♭, mà bài này ở chặng 7. Sửa thành "chặng sau".
- **Mục Nguồn:**
  - n93 (bỏ): sách Cooper, Rosen;
  - n92, n94: thay bằng trang Henle HN 1348, lời giới thiệu của Badura-Skoda (K. 457) và tệp Mutopia.

### nghe-nhac/beethoven-pathetique

- **n11 (cả description):** "nổi tiếng ở Vienna trước hết như một nghệ sĩ piano ứng tác dữ dội" thành "đã nổi tiếng … như một nghệ sĩ piano, nhất là tài ứng tác".
- **n17 (bỏ):** "(vài tài liệu khác cho rằng nhà xuất bản đặt và Beethoven đồng ý)". Henle, Beethoven-Haus và Hewitt đều nói Beethoven tự đặt tên.
- **n18:** "gốc từ chữ *pathos* trong kịch Hy Lạp" thành "gốc từ chữ Hy Lạp *pathos*" (Hewitt).
- **n19:** Ánh trăng "chỉ phổ biến sau khi Beethoven mất" thành "có lẽ từ một truyện của Ludwig Rellstab viết năm 1823" (Henle HN 1062).
- **n26, n47 (chủ đề 2 chương 1):** "tay trái liên tục vắt qua tay phải để chơi những nốt láy ở âm vực cao" thành "giai điệu nhảy qua lại giữa âm vực trầm và những nốt láy ở âm vực cao, vượt qua phần đệm ở giữa, nên hai tay liên tục vắt chéo". Trong Mutopia, nốt láy nằm ở khuông trên. Hewitt chỉ viết "perilous hand-crossing", không nói tay nào.
- **n31 (bỏ):** Adagio là "một trong những giai điệu đẹp nhất Beethoven viết".
- **n41:** "đàn Vienna … tiếng mỏng và tắt nhanh …, nhưng ông viết cho nó như viết cho dàn nhạc" thành "Đàn kiểu Vienna thời ấy chỉ có âm vực khoảng năm quãng tám" (Tafelmusik).
- **Mục So sánh bản thu:**
  - Gilels, Brautigam: chữ đánh giá thành câu hỏi nghe.
  - n56, Hewitt: thêm "chỗ ấy do nhà xuất bản thêm về sau", "Rudolf Serkin cũng làm vậy". Bỏ "đa số nghệ sĩ chỉ quay về đầu Allegro" (không nguồn; Hewitt nói nhiều người cũng quay về Grave). Nguồn: lời giới thiệu của Hewitt (Hyperion).
- **Mục Nếu bạn muốn chơi (n59, n62, n63):**
  - Adagio "chương dễ nhất, khoảng Grade 7" thành "khoảng Grade 7–8 (ABRSM xếp ở Grade 8)";
  - Rondo "khoảng Grade 8" thành "cũng được ABRSM xếp ở Grade 8" (đề cương 2027–2028, danh sách A số 2);
  - chương 1: bỏ "khó nhất".
- **Mục Nguồn:**
  - n68 (bỏ): sách Rosen;
  - n67: link Beethoven-Haus trỏ trang tác phẩm;
  - n69: thêm Hewitt, Moscheles (Gutenberg) và đề cương ABRSM 2027–2028.

### debussy-clair-de-lune

- **n10, n13:** "Tên bài lấy từ bài thơ … Chữ bergamasque cũng đến từ chính bài thơ đó" thành:
  - tên bài trùng tên bài thơ mở đầu *Fêtes galantes*;
  - "masques et bergamasques" có trong bài thơ;
  - theo Henle, tên tổ khúc thường được coi là gợi nhớ tập thơ. Henle nêu cả giả thuyết Giraud.
- **n17:** "khi phong cách của ông đã khác hẳn" thành "chính ông ghi năm 1890 lên bản in thử để cho biết đây là tác phẩm thời trẻ" (Henle).
- **n19:** "bản thảo gốc không còn" thành "đến nay chưa tìm thấy" (Henle: "untraceable").
- **n33 (Theo dõi, Coda):** "hợp âm cuối ngân thật lâu" thành "*morendo jusqu'à la fin*". Bản Fromont không có dấu ngân ở hợp âm cuối.
- **n69:** "Bài sống trong vùng từ pp đến p, với vài lần lên mf" thành "từ ppp đến p; chỉ một lần lên f, ở cao trào đoạn B (ô 41)". Bản Fromont qua Mutopia không có mf nào.
- **Mục Nguồn:**
  - n90 (bỏ): ba sách in;
  - n91: thêm Verlaine (Gutenberg) và tệp Mutopia.

## Chỗ chưa chắc (`ket_qua: null`)

### Trang

- **bach-prelude-fugue-do-thu:**
  - n23: Bach viết cho harpsichord, clavichord;
  - n30: Gould, Richter, Schiff, Hewitt, Leonhardt đều thu Bình quân luật;
  - n116: Sinfonia BWV 787–801;
  - n118: BWV 851 ba bè, fugue BWV 846 bốn bè.
- **pathetique-adagio:**
  - n24: Kempff, Brendel thu trọn 32 sonata;
  - n55: đoạn C "dễ mỏi". Vế này dính tới sức khỏe nên xếp `quy-tac`, cần nguồn kiểu BAPAM hoặc bỏ vế ấy;
  - n79: ấn bản Bülow thêm sắc thái, bàn đạp;
  - n80: ấn bản ABRSM của Cooper.
- **nghe-nhac/beethoven-pathetique:**
  - n55: bản thu Gilels;
  - n57: bản thu Brautigam (BIS).
- **debussy-clair-de-lune:**
  - n11: *Fêtes galantes* in năm 1869;
  - n24: Gieseking thu trọn Debussy;
  - n46: "điểm thoát (escapement)";
  - n74: lời "quên rằng piano có búa";
  - n77: ấn bản Œuvres complètes.

### Bản ghi

- bach n24: Bärenreiter, Wiener Urtext.
- pathetique-adagio:
  - n19: Lichnowsky là "người bảo trợ";
  - n24: Bärenreiter (Del Mar), Wiener Urtext, ABRSM (Cooper).
- beethoven-pathetique n4: `thoi_ky` "Cổ điển → Lãng mạn". IMSLP ghi Classical, trang ghi "Cổ điển, giai đoạn đầu". Người giao quyết: giữ (lựa chọn của site) hay đổi.
- debussy:
  - n9: `thoi_ky` "Ấn tượng". IMSLP ghi Romantic, Mutopia ghi Modern; đây là lựa chọn của site, người giao quyết;
  - n24: Œuvres complètes (Durand).

## Bản thu và mốc

Kiểm trên Commons qua API `imageinfo`:

| Bản thu | Người chơi, giấy phép | Độ dài | Khớp `d` |
|---|---|---|---|
| Bach (Ishizaka) | CC0 | 107,29 s và 115,93 s | khớp |
| Op. 13 (Veesey), ba tệp | CC0, 2009 | 384,52 s, 380,54 s, 269,67 s | khớp |
| Clair de lune (Goedhart) | phạm vi công cộng, 2011 | 304,09 s | khớp |

Mốc kiểm qua cấu hình `tools/audio/align/pieces.py`, không nghe lại bản thu. Mỗi dòng bảng ứng đúng ô của sự kiện trên trang.

- **Bach:** 10/10.
- **Adagio:** 9/9. Riêng dòng "Mi trưởng bất ngờ" căn ở ô 43 (hợp âm Mi trưởng), còn Si7 và nốt sf đầu tiên ở ô 42, sớm hơn khoảng một ô. Vẫn chấp nhận được; người giao có thể dời sang ô 42 nếu muốn.
- **Clair de lune:** 8/8.
- **beethoven-pathetique:** 11 mốc cho 12 dòng.
  - Dòng Tái hiện và coda chương I để `-` là đúng. Tệp chương I dài 384,52 s; giây cuối vẫn có tiếng (−15,8 dB, ffmpeg volumedetect), nên tệp bị cắt chứ không kết tự nhiên. Căn MIDI dừng ở khoảng ô 170; phần phát triển là ô 133–194. Vậy "dừng giữa phần phát triển" đúng.
  - Mốc chương II trùng mốc trang Adagio (1, 88, 198, 259 cộng 384,52 s).

Không có gì phải sửa ở `ban_thu` hay mốc.

## Câu `ve-site` ở hồ sơ khác

Đã kiểm, trang mới giữ đúng:
- `hinh-thuc/fugue` n33 và `lich-su/thoi-ky/baroque` n48: link tới bài BWV 847. Trang có, đúng đường dẫn.
- `hinh-thuc/fugue` n16–n29, n42: ba bè, 31 ô, kết Đô trưởng. Trang nói giống.
- `bach-prelude-do` n86, n87.
- `piano/hai-tay`:
  - n47: nhóm hai nốt trong 9/8;
  - n48: link Clair de lune, giữ "Rê♭ trưởng · 9/8" và cách đếm.
- `piano/not-lap-not-kep`:
  - n18, n43: Adagio, tay trái ô 17–28 và tay phải ô 37–50, đúng bản nhạc;
  - n43: Clair de lune ô 1–14.
- `cap-nhat`:
  - n51: có lối tắt "Chỉ muốn nghe?";
  - n80: tệp chương I dừng khoảng 6:24, giữa phần phát triển; ghi chú hiện qua `note` (`src/scripts/nghe.js` dòng 158).
- `beethoven-op49-2` n36, n105; `fur-elise` n79; `satie-gymnopedie` n67: link tới các trang này.
- `piano/nha-soan-nhac` n26, n57, n125: chặng 6.

Không chỗ sửa nào ở lượt này làm sai các câu ấy.

## Người giao phải sửa hay chủ repo quyết

- **Áp `sua-A.yml`** (3 mục ở `thong_tin`, chữ hiện qua `::hop-tac-pham`; nhớ thêm `doi_chu` cho trang):
  - Bach: dòng Độ khó bỏ "(ước lượng)", ghi ABRSM Grade 8 (2015–2016) và RCM Level 9;
  - Clair de lune: dòng Độ khó viết theo Trinity Grade 8, RCM Level 10, Henle mức 5; ABRSM không xếp bài;
  - Adagio: bỏ "có chú thích hữu ích".
- **Grade đã khóa:** không lệch nguồn ở phần A.
  - BWV 847: Grade 7–8 (ABRSM Grade 8, RCM Level 9);
  - Adagio: Grade 7–8 (ABRSM Grade 8);
  - Clair de lune: Grade 8 (Trinity Grade 8).
- **`thoi_ky` của beethoven-pathetique và debussy-clair-de-lune:** xem mục Chỗ chưa chắc.
- **Thuật ngữ chưa có bản ghi** (trang Clair de lune): "đạp nửa", "rung bàn đạp", "điểm thoát (escapement)".
- **Không build, không chạy `so-chu.mjs`.** `doi_chu` sinh từ diff của tệp `.md`: bỏ Markdown, ghép dòng cũ với dòng mới. Người giao dựng lại bằng khung `so-chu.mjs --doi-chu` và giữ `ly_do`.
- **Hồ sơ bản ghi** được ghi lại bằng PyYAML. Nhận định, nguồn và `lan` của lần 1 không đổi (đã so), nhưng cách trình bày YAML đổi.

## Nguồn hay dùng

- Mutopia, tệp `.ly` và `.mid` (bậc 1).
- Henle: trang sản phẩm HN 14/1014, HN 1348, HN 381; lời nói đầu PDF HN 14 (Heinemann), HN 1348 (Gertsch, Perahia 2018), HN 381 (Lesure 1983), HN 1062 (Rellstab).
- Beethoven-Haus: trang Op. 13 và trang về Beethoven nghệ sĩ piano.
- IMSLP: trang tác phẩm (Op. 13, K. 457, Suite bergamasque, Fêtes galantes của Debussy, Children's Corner, Rêverie, Arabesques).
- Lời giới thiệu của Angela Hewitt, Hyperion CDA67605.
- Project Gutenberg:
  - lời kể của Moscheles trong *Life of Beethoven* của Schindler;
  - *Fêtes galantes* của Verlaine.
- Lời giới thiệu đĩa K. 457 của Badura-Skoda (eClassical PDF); LA Phil.
- Đề cương: ABRSM 2015–2016, 2023–2028; RCM 2022 (Bach Level 9, Suite bergamasque Level 10, Op. 13 ở ARCT).
- Wikimedia Commons API; Tafelmusik; Dolmetsch.
