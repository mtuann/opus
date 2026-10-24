# D2-0, lượt 1, phần A: ghi chú

Phạm vi: 7 chặng (`cap-do/1`–`7`) và 34 bài học (`tac-pham`, `loai: bai-hoc`). Hồ sơ: `kiem-dinh/du-lieu/cap-do/*.yml`, `kiem-dinh/du-lieu/tac-pham/<slug>.yml` (34 file). Sửa đề xuất: `sua-A.yml`. Không sửa `src/data/`. Ngày 24/10/2026.

## Số liệu

| | |
|---|---|
| Hồ sơ | 41 (7 chặng, 34 bài) |
| Nhận định | 211 |
| `dung` | 166 |
| `khong-can-nguon` | 34 (14 lời khuyên tập của chặng, 20 `goi_y`) |
| `da-sua` | 7 (5 `grade`, 2 `chang`; 5 bản ghi) |
| chưa chắc (`ket_qua: null`) | 4 (2 bản ghi) |

Theo trường của 34 bài: `ten`, `tac_gia`, `danh_muc` đều `dung` (34/34, nguồn IMSLP và Henle); `grade` 27 `dung`, 5 `da-sua`, 2 chưa chắc; `chang` 30 `dung`, 2 `da-sua`, 2 chưa chắc. 7 chặng: mọi nhận định `dung` hay `khong-can-nguon`; hai trường khuyên tập khớp ba trang lõi cũ, không mâu thuẫn.

## Chưa chắc (`ket_qua: null`)

- `beethoven-anh-trang` n4 (`grade` "Grade 6–7") và n5 (`chang` 5): không có đề cương ABRSM (2017–2028 cùng Grade 8 của 2015–2016), Trinity (từ 2023) nào liệt kê riêng chương 1; Henle chỉ xếp cả sonata mức 7 (không có mức riêng cho chương 1); RCM chỉ có cả sonata ở bậc diploma ARCT.
- `chopin-prelude-la-truong` n4 (`grade` "Grade 3–4") và n5 (`chang` 4): không có đề cương nào liệt kê Prélude La trưởng; Henle mức 4, cùng mức Prélude Si thứ Op. 28 số 6 (ABRSM Grade 6, 2019–2020) và Mi thứ Op. 28 số 4 (RCM Level 7). Dữ liệu thấp hơn các bài cùng mức một đến hai cấp; gợi ý Grade 5 hay 5–6 nhưng chưa có nguồn riêng cho bài này.

`chang` của hai bài trên chưa chắc chỉ vì suy từ `grade`.

## Sửa đề xuất (chi tiết ở `sua-A.yml`)

Mọi sửa đều dựa trên danh sách tác phẩm chính thức của ABRSM, nơi đúng bài đứng ở cấp ngoài khoảng của dữ liệu:

- `chopin-valse-la-thu`: `grade` "Grade 3–4" thành "Grade 5–6", `chang` 3 thành 5. ABRSM Grade 6 hai kỳ liền (2025–2028), RCM Level 6, Henle mức 3.
- `chopin-valse-si-thu`: `grade` "Grade 5–6" thành "Grade 7–8", `chang` 5 thành 6. ABRSM 2015–2016 xếp Grade 8 (kỳ duy nhất có bài), RCM Level 8, Henle mức 4. Chọn "7–8" thay vì "8" vì chỉ một kỳ; lượt 2 nên xem lại.
- `pathetique-adagio`: `grade` "Grade 7" thành "Grade 7–8". ABRSM xếp Grade 8 ba kỳ liền (2023–2028).
- `schumann-album`: `grade` "Grade 1–3" thành "Grade 1–4". Số 1 Grade 1, số 8 Grade 3, số 10 Grade 4 (2017–2018).
- `tchaikovsky-cau-nguyen-buoi-sang`: `grade` "Grade 3" thành "Grade 3–4". ABRSM 2019–2020 xếp Grade 4.

Sửa `grade` thì phải sửa kèm `chip.cap_do` và dòng "Độ khó" của `thong_tin` (kiểm chéo bắt chip lệch grade). Hai bài Chopin đổi chặng kéo theo bảng chặng, "Tác phẩm theo cấp độ" và các chỗ lộ trình nêu hai bài ấy.

## Cách xét `grade`

1. Đúng bài (hay đúng chương) có trong đề cương chính thức (ABRSM 2017–2028 cùng Grade 8 của 2015–2016, Trinity từ 2023): cấp đề cương phải nằm trong khoảng của dữ liệu. Ngoài khoảng thì `da-sua`; lệch một cấp thì mở rộng khoảng, lệch hai cấp trở lên thì theo đề cương (có hạ một cấp khi RCM, Henle thấp hơn và chỉ một kỳ ABRSM).
2. Không có đúng bài (16 bài): kiểu tương đương, `dung` khi mức Henle, cấp RCM và các bài cùng tập hay cùng mức Henle ở ABRSM cho ước lượng nằm trong hay sát khoảng của dữ liệu; chưa chắc khi ước lượng lệch khỏi khoảng hay không suy được. Henle không có bảng quy đổi sang ABRSM (trang "Levels of Difficulty"), nên `ghi_chu` từng nhận định liệt kê bằng chứng.
3. `chang`: `dung` khi grade (đã kiểm) nằm trong khoảng của chặng theo `cap-do.yml`.

Nhận định tương đương mà bằng chứng nghiêng cao hơn dữ liệu khoảng một cấp (để lượt 2 và review lưu ý): `beethoven-op49-2` (Grade 5; anh em Op. 49 số 1 ở ABRSM Grade 6, RCM Level 8), `chopin-nocturne-op9-2` (Grade 7; các nocturne cùng Henle 5 ở ABRSM Grade 7–8), `chopin-prelude-mi-thu` (Grade 5; Op. 28 số 6 ở Grade 6), `schumann-traumerei` (Grade 6; cùng Henle 5 với Kind im Einschlummern ở Grade 7), `fur-elise`; ngược lại `satie-gymnopedie` (Grade 4; RCM xếp Gnossienne số 3, cùng Henle 2, ở Level 8).

Quan sát chung: các số Grade thấp so với ABRSM hầu hết ở nhạc Lãng mạn (ba bài Chopin, Pathétique, Schumann), có vẻ suy từ mức Henle. Nên rà các bản ghi cùng kiểu ở phần khác.

## Chỗ schema không diễn đạt được, hay cần chủ repo chọn

- `grade` là chuỗi tự do. "Grade 8 trở lên" được `khoangGrade()` đọc là [9, 9] (tức như "sau Grade 8"). Trang gom nhiều bài (`schumann-album`) chỉ có một `grade` cho cả trang.
- Khoảng Grade nằm giữa hai chặng (`burgmuller-la-candeur`, `tchaikovsky-bai-ca-phap-co`, `tchaikovsky-cau-nguyen-buoi-sang`, `beethoven-sonatina-sol`, `schumann-album`): kiểm chéo chấp nhận cả hai chặng, dữ liệu chọn đầu dưới hay trên không theo luật nào. Đề nghị luật: chặng chứa cấp ABRSM đã liệt kê (Bài ca Pháp cổ: Grade 3, nên chặng 3).
- `musette-re`: `khuyet_danh: true` có ABRSM ("Anon.") đỡ; RCM ghi "attr. J.S. Bach" và IMSLP xếp dưới Bach nhưng với số phụ lục Anh. 126. Chọn `khuyet_danh` hay `tac_gia: bach` kèm `gan_cho: true` là quyết định biên tập; schema không có chỗ cho "khuyết danh, từng gán cho Bach".
- `bach-prelude-bwv939`: Henle (lời nói đầu), IMSLP, RCM đều ghi Bach, không nêu nghi vấn; không mở được Bach-Digital nên chưa đối chiếu danh mục. `dung` kèm ghi chú; lượt 2 nên xem lại.
- `satie-gymnopedie`: không có `danh_muc`; nhận định ghi rõ không có số danh mục chuẩn (IMSLP, Henle không ghi).

## Nguồn dùng nhiều nhất

- RCM, Piano Syllabus 2022 Edition (49 nhận định dẫn): mức Level của từng bài, và chữ `attr.` của Anh. 5, Anh. 126.
- ABRSM, danh sách tác phẩm các kỳ 2015–2016 (chỉ Grade 8), 2017–2018, 2019–2020, 2021–2022, 2023–2024, 2025–2026 (PDF chính thức), 2027–2028 (PDF Music Performance Grades, cùng danh sách với Practical Grades); các PDF 2015–2020 là bản lưu Wayback Machine vì `us.abrsm.org` không còn phân giải.
- Trinity, Piano repertoire list from 2023 (bản tháng 8/2026): đúng bài cho BWV 846, Clair de lune, Minuet Sol thứ Petzold.
- Henle: trang từng ấn bản (mục Content/Details cho mức khó từng bài); lời giới thiệu của HN 365 cho nghi vấn tác giả Anh. 5.
- IMSLP: trang tác phẩm cho tên, số danh mục, tác giả (mọi bài).
- Trang Piano chính thức của ABRSM (bản lưu 13/11/2025) và hai đề cương PDF cho cấu trúc cấp của 7 chặng.

Không mở được: Bach-Digital (thử thách chống bot), trang HTML của ABRSM (HTTP 403; thay bằng PDF và bản lưu).

## Khác

- Mọi trang bài học cũ có ở `../opus-zero/docs/piano/tac-pham/<slug>.md` (34/34), và 5 trang nghe của `cap` (`beethoven-moonlight`, `liszt-liebestraum`, `beethoven-pathetique`, `schubert-impromptu`, `schumann-kinderszenen`).
- `goi_y`: 20 bài `goi_y: true` đúng bằng 20 mục của `SUGGEST` trong `practice.js` cũ, mỗi bài đúng chặng `chang`; không bản ghi nào có `goi_y` mà `practice.js` thiếu, hay ngược lại.
- Ngoài phạm vi, chỉ để ý: `thoi_ky` của `satie-gymnopedie` ("Cuối thế kỷ 19") và `debussy-clair-de-lune` ("Ấn tượng") không thuộc danh sách giá trị của nhà soạn nhạc; mức Henle của K. 545 trong bảng cũ ("4–5") nay Henle ghi 5 cho cả sonata.
- Henle gọi bài số 1 của Op. 100 là "Nonchalance" (cùng vị trí với "La candeur" của IMSLP).
