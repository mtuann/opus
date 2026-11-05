# Review D8-gom: piano/tac-pham-theo-cap

Claude Opus 5.5, không làm lượt 1 hay lượt 2 của trang này. Trang tham chiếu có hạn, kiểm như trang lõi. Việc kiểm từng hàng của các bảng chặng chia cho hai agent Sonnet (chặng 1–4, chặng 5–7). Review đọc lại kết quả và ghi hồ sơ.

## Câu về chính site

19 câu: 19 `review: dung`, 0 sai. Gồm 18 câu của lượt 1 và n53, câu đổi loại ở review. Review kiểm trên trang, trên `src/data/` (`cap-do.yml`, `tac-pham.yml`, `trang.yml`) và trên bản xem dựng riêng trong scratchpad, rồi chạy `tests/tac-pham-theo-cap.test.mjs` (đạt). Review cũng mở lại cả 44 link ngoài: tất cả trả 200, trừ abrsm.org (trả 403 với robot, đã biết từ trước). `ghi_chu` của mỗi câu ghi "Review D8-gom: …".

**Soát nhãn:**

- n53 (Impromptu Op. 90 số 2 ở chặng 6, số 3 ở chặng 7) đổi từ `cap-do` sang `ve-site`. Trang không ghi Grade hay mức Henle cho hai bài này, nên chặng chỉ là lựa chọn của site.
- n49 đổi sang `khuyen-tap`. Câu chỉ còn phần mô tả kỹ năng mỗi bài dạy. Các điều kiểm được bằng nguồn trong các hàng nay nằm ở r1–r7.
- Không câu `khuyen-tap` nào nói về sức khỏe.

## Câu hai lượt lệch, hay lượt 1 chưa có kết quả

| Câu | Quyết định |
|---|---|
| n18, n30 | Giữ (lượt 1 đã sửa, lượt 2 ghi `dung`). n30 có chữ đổi theo n32 |
| n32 | Bỏ chữ "rất khó" (nhận xét không có nguồn). Tên chương *Presto agitato* lấy theo IMSLP. Ghi `da-sua` |
| n41 | Ghi `dung`, chữ giữ nguyên. Nguồn đã mở: Henle "What is Urtext?", ấn bản Urtext của Bärenreiter (IMSLP), Wiener Urtext (danh sách ABRSM 2027–2028), trang chính thức của Wydanie Narodowe (Jan Ekier là tổng biên tập) |
| n43 | Ghi `dung`. Mở lại IMSLP: tập 1 in 1792, tập 2 in 1795 |
| n45 | Ghi `dung`. Luận văn Đại học Oregon 2014: "Started in 1973" |
| n46, n47 | Ghi `dung`. Nguồn: IMSLP (sổ 1725; Anh. 122 ghi "Ph.E. Bach"; K. 1a, K. 3) và Hal Leonard ("20. Clowns"). Tên bài "Burleske" bỏ khỏi trang vì không có nguồn bậc 1–2 |
| n49 | Đổi sang `khuyen-tap` (xem Soát nhãn) |
| n51 | Giữ. ABRSM 2027–2028 xếp Invention số 8 ở Grade 5. Số 4 và số 13 ở chặng 5 là lựa chọn của site |
| n52 | Nocturne Op. 72 số 1 **không có bản ghi** trong `tac-pham.yml`, nên chặng 5 là lựa chọn của site. Giữ chặng 5 và thêm vào ô "Học được gì" câu: "Op. 72 số 1 có trong danh sách Grade 8 của ABRSM (2027–2028), còn Henle xếp mức 5". Đã kiểm ở PDF ABRSM, tr. 43. "B. 49" đúng theo IMSLP. Ghi `da-sua` |
| n53 | Đổi sang `ve-site`, ghi `dung` |
| n54 | Ghi `dung`. Nguồn: PDF ABRSM 2027–2028 (ARSM, LRSM, FRSM) và trang Trinity (ATCL, LTCL, FTCL) |
| n58 | Ghi `dung`. Trang mẫu Musicnotes (ảnh trang 1) có "Moderately, expressively" |
| n59, n60, n61 | Số liệu đúng với bản Musicnotes có link ở trang (trang sản phẩm và trang mẫu), nhưng bản soạn khác ghi khác. Trang nay ghi "theo bản Musicnotes ở dòng Bản nhạc (bản soạn khác có thể …)". Phần 12/8 (♩. = 78) của *Nuvole bianche* đã kiểm trên trang mẫu. *Mariage d'Amour*: không thấy ô 5/4 ở nguồn nào, nên bỏ; gạch đầu dòng "quãng tám ở đoạn cao trào" cũng bỏ |
| n62 | Ghi `dung`. Nguồn: LoC (Lee Ru-ma, sinh 1978), Qobuz (2001, 2003), © Stomp Music trên trang mẫu Musicnotes |
| n63 | Sửa "do chính ông ghi/soạn" thành "được tác giả duyệt" (Faber ghi "official authorised scores"). Bỏ câu về tập *First SOLO* vì không tìm thấy tập này ở nguồn nào |
| n64 | Classic FM viết *River Flows in You* "does also feature later on the soundtrack" của *Twilight*, trái với câu của trang. Bỏ câu "không có trong album nhạc phim", đổi tiêu đề đoạn thành "Không phải *Bella's Lullaby*" |
| n65 | Bỏ: bài mở đầu album, tên tiếng Nhật, dàn nhạc New Japan Philharmonic, Hisaishi chỉ huy và chơi piano (chỉ có nguồn bậc 3). Năm sinh 1950 theo LoC |
| n66 | Bỏ "lời của Wakako Kaku": cả hai lượt đều không có nguồn bậc 1–2 |
| n67 | Bỏ: Olivier Toussaint, Delphine, năm sáng tác 1978, album đầu tiên 1979 (chỉ có Wikipedia). Năm 1933–2023 theo BnF. Ghi năm bản quyền 1980 của bản in. Mục Nguồn đổi từ Wikipedia sang BnF |
| n68 | Bỏ câu về video của George Davidson và số lượt xem: hai nguồn bậc 3 ghi hai con số khác nhau. Tác giả lấy theo bản nhạc được cấp phép |
| n69 | Bỏ: hãng Virgin, và ba bài *Comptine d'été* của *Rue des Cascades*. Năm sinh 1970 theo LoC |
| n70, n71 | Ghi `dung`. Nguồn: mục lục AMEB trên Australian Music Centre; LoC; uDiscover (Decca phát hành lại); hai trang Hal Leonard (Chester Music) |
| n75 | Ấn bản 4 của Hinson và Roberts ra năm 2013 (trang IU Press), không phải 2014: sửa. Magrath (Alfred, 1995) đúng theo thư mục thư viện |

## Kiểm từng hàng (r1–r7)

Có 100 hàng bảng, trong đó khoảng 170 tác phẩm không có bản ghi. Review kiểm tên, tác giả, số danh mục, giọng, năm, thời kỳ, và các con số hay quy gán trong cột "Học được gì". Nguồn chủ yếu là IMSLP và bản Mutopia; thêm Henle, Hal Leonard, Boosey, PTNA và bản lưu Wayback của Universal Edition và Schott. Không hàng nào ghi Grade hay mức Henle riêng, ngoài n52.

Hàng có link tới bài học (bản ghi đã khóa) không kiểm lại. Mỗi bảng chặng là một nhận định (loại `danh-muc`), nguồn là các trang tác phẩm đã mở. Bảng chặng 5 (r5) không có chỗ sai. Sáu bảng còn lại có sửa:

- r1, r3: cột Thời kỳ của Diabelli Op. 149, Op. 151 và Op. 168 sửa thành "Thế kỷ 19, phong cách Cổ điển" (các tập in 1831–1839). Czerny Op. 599 sửa thành "Thế kỷ 19" (in 1839, 1840).
- r2: bỏ tên bài "Burleske" của *Notenbuch für Wolfgang*.
- r4: Prélude số 20 sửa thành "sắc thái đi từ *ff* xuống *p* rồi *pp*", theo bản Mutopia. Bỏ "Gnossienne viết không có vạch nhịp" (chỉ có Wikipedia).
- r6: bỏ "54 ô nhịp" của Ravel, *Menuet sur le nom d'Haydn* (chỉ có nguồn bậc 3).
- r7: "Fugue bốn, năm bè" sửa thành "Fugue nhiều bè". "fugue (Op. 110), biến tấu (Op. 109, Op. 111)" sửa thành "chương fugue của Op. 110", vì phần biến tấu chưa có nguồn đọc được.

**Chi tiết bản nhạc ở mục ngoài cổ điển (s1–s6, loại `cau-truc`):** các gạch đầu dòng "Bài này dạy gì" nêu chi tiết của bản nhạc (8va, portato, khóa Sol ở tay trái…), nhưng lượt 1 chưa tách chúng thành nhận định. Review đối chiếu với ảnh trang 1 trên trang sản phẩm Musicnotes và bỏ những vế không thấy trên ảnh.

## Chỗ sửa trang

Có 34 chỗ sửa ở `src/content/docs/piano/tac-pham-theo-cap.md`. Hồ sơ `doi_chu` được dựng lại đủ: so với bản xem riêng, không còn khối nào thiếu hay thừa (cùng phép so của `tests/chuyen.test.mjs`, chạy bằng `--dist` riêng). Các mục của lượt 1 giữ nguyên lý do. Mục nào gộp chỗ sửa của lượt 1 với chỗ sửa của review thì ghi cả hai lý do.

## Lượt 2 bổ sung

Có 26 câu của trang này (`node tools/khoa.mjs xuat D8-L1 --con-lai` đã thử: xuất 61 câu cho cả lô, trong đó 26 câu của trang):

- n32, n52, n59, n60, n61, n63, n64, n65, n66, n67, n68, n69, n75: chữ đổi sau lượt 2, kết quả lượt 2 cũ ghi lại trong `ghi_chu`;
- r1–r7: kiểm từng hàng;
- s1–s6: chi tiết bản nhạc.

Lượt 2 bổ sung nên xem kỹ ba chỗ: vế "Hayao Miyazaki" (n65), vế "trên mạng có khi mang tên Spring Waltz" (n68), "vòng bốn hợp âm" (s1).

## Chủ repo cần biết

- Bản ghi Nocturne Op. 72 số 1 không có trong `src/data/tac-pham.yml`, khác với điều người giao ghi. Chặng 5 vẫn giữ.
- Đọc nhanh PDF ABRSM 2027–2028 thấy vài bài lệch với chặng của site (không phải nhận định, vì trang chỉ ghi chặng):
  - *Toccatina* của Kabalevsky: Grade 4, site xếp chặng 3;
  - *Wilder Reiter*: Grade 3, site xếp chặng 2;
  - *The Little Shepherd*: Grade 7, site xếp chặng 5 (≈ Grade 6);
  - *Von fremden Ländern und Menschen*: Grade 5, site xếp chặng 5.

  Muốn đổi chặng thì quyết ở lần rà lại.
- Hồ sơ được ghi lại bằng thư viện `yaml`, nên định dạng cả file đổi: diff lớn, nội dung chỉ đổi như trên. Danh sách nguồn có thêm khoảng 110 trang tác phẩm (id `r-<dòng>-<k>`).
- Không khóa gì. `node tools/khoa.mjs tinh` không lỗi. Bốn file `tests/chuyen`, `khoa`, `du-lieu`, `tac-pham-theo-cap` đạt 41/41.
