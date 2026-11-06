# D6-L7, lượt 1, phần B

Claude Opus 5.5, 06/11/2026, nhánh `moi/d6-l7`. Phần này gồm năm trang và hai bản ghi:
- hai hướng dẫn nghe: `nghe-nhac/chopin-etude`, `nghe-nhac/mozart-concerto-21`;
- ba trang không có bản ghi: `nghe-nhac/doc-ten-tac-pham`, `nghe-nhac/nghe-gi-tiep`, `nghe-nhac/mau`;
- bản ghi `chopin-etude` và `mozart-concerto-21`, lần 2 (các trường chưa khóa: `thoi_ky`, `luyen_nghe`, `hinh`, `ban_thu`).

## Số liệu

| Hồ sơ | Nhận định | Theo loại | Kết quả |
|---|---|---|---|
| trang chopin-etude | 47 | lich-su 10, cau-truc 10, ten 7, ve-site 6, nam 5, khuyen-tap 5, cap-do 2, so-lieu 1, dinh-nghia 1 | dung 26, da-sua 16, khong-can-nguon 5 |
| trang mozart-concerto-21 | 41 | cau-truc 11, ten 9, lich-su 7, ve-site 4, khuyen-tap 3, nam 2, so-lieu 2, dinh-nghia 2, cap-do 1 | dung 27, da-sua 11, khong-can-nguon 3 |
| trang doc-ten-tac-pham | 57 | danh-muc 20, lich-su 11, dinh-nghia 10, khuyen-tap 5, ten 5, ve-site 4, nam 1, so-lieu 1 | dung 44, da-sua 8, khong-can-nguon 5 |
| trang nghe-gi-tiep | 27 | ten 20, khuyen-tap 3, ve-site 2, nam 1, so-lieu 1 | dung 21, da-sua 3, khong-can-nguon 3 |
| trang mau | 8 | ve-site 4, khuyen-tap 3, cau-truc 1 | dung 5, khong-can-nguon 3 |
| bản ghi chopin-etude (n4–n11) | 8 | cau-truc 3, lich-su 2, ten 2, so-lieu 1 | dung 8 |
| bản ghi mozart-concerto-21 (n4–n13) | 10 | cau-truc 7, lich-su 2, ten 1 | dung 8, da-sua 2 |

- `node tools/khoa.mjs xuat` đọc được cả bảy hồ sơ (bản ghi: `--con-lai`).
- Không có chỗ `ket_qua: null`.
- Không trang nào có khối abc.
- Mỗi chỗ sửa trang có một mục `doi_chu` viết tay, chữ gần đúng. Người giao ghép lại bằng `so-chu.mjs --doi-chu` sau khi build.

## Bản nhạc đã đối chiếu

| Bài | Bản | Ghi chú |
|---|---|---|
| Chopin Op. 10 số 3 | G. Schirmer 1916, Friedheim (Internet Archive `chopinetudesforp00unse`, tr. 12–15) | Đọc ảnh trang, độ phân giải vừa. Đoạn *con bravura* đọc phóng to: quãng sáu hai tay trên hợp âm bảy giảm. Số ô lấy theo Henle (*poco più animato* ở ô 21) |
| Chopin Op. 10 số 12 | Mutopia `op-10-12-wfi.ly` (Peters, Scholtz 1900) | 84 ô; mở đầu, chủ đề, coda và hợp âm Đô trưởng ô 84 |
| Mozart K. 467 | NMA V/15/6, ảnh trang trên DME Mozarteum: tr. 93–105 (chương 1, tới ô 139), tr. 138–149 (Andante, trọn 104 ô) | Chú thích tr. 93: chỉ dẫn tốc độ không có trong bản thảo, lấy từ danh mục của Mozart; *sordini* chỉ ở violin và viola |
| Bach BWV 846 (trang `mau`) | Mutopia `wtk1-prelude1.ly` | Bè trầm Sol ở ô 24–31 |

## Đã sửa, đã bỏ (trang)

**chopin-etude**
- n3: bỏ "số 12 khoảng 1831". Năm ấy chỉ là truyền thuyết (Henle HN 658); thay bằng ngày bản thảo nháp số 3, 25/8/1832 (Viện Chopin, mUltimate Chopin).
- n8: cả Op. 10 dài "khoảng 30–35 phút" (PTNA 33:30).
- n9, n10, n12 (cả mô tả trang): étude là "bài luyện", khớp `thuat-ngu.yml`. Bỏ "hiếm khi được chơi trong hòa nhạc" và "những étude đầu tiên trở thành tiết mục hòa nhạc"; dùng ý của COD.
- n17: bỏ biệt danh "L'Adieu" (không có ở nguồn đã mở).
- n18: bỏ "ngày nay hầu như ai cũng chơi chậm hơn con số máy đếm nhịp". Giữ "kèm một số máy đếm nhịp" (Henle: bản thảo không có số máy đếm nhịp).
- n25: viết lại đoạn số 12. Tháng 9/1831 là truyền thuyết không có chứng cứ; bản chép sạch viết khoảng 1832–1833.
- n29: bỏ lời dẫn Cortot "sức ép chứ không phải cú đánh" (không kiểm được); giữ lời khuyên.
- n30: câu cũ "Chopin không ghi bàn đạp" sai. Bản thảo có bàn đạp, Henle khuyên thay bàn đạp thường hơn chỗ ông ghi.
- n36–n38: bỏ các đánh giá ("chuẩn mực một thời", "tự do, nhiều rubato", "ấm, hát…"); ghi bản thu có thật:
  - Pollini: DG;
  - Cortot: thu năm 1933, ấn bản 1915;
  - Perahia: phát hành năm 2002.
- n40, n41: "phần lớn thuộc chặng 7" thành "Op. 10 và Op. 25 thuộc chặng 7". Henle ghi cả 24 bài "ABRSM: Piano LRSM", mức 6–9.
- n45: *Trois nouvelles études* ở mức Henle 6–7.
- n47: mục Nguồn bỏ Eigeldinger, *Wydanie Narodowe* và dòng ấn bản Cortot; thêm Henle HN 124, mUltimate Chopin, Niecks (Gutenberg).

**mozart-concerto-21**
- n6: độ dài 26–30 phút.
- n12: "bản thảo không ghi chỉ dẫn tốc độ; chữ *Allegro maestoso* lấy từ danh mục" (chú thích NMA). Câu cũ chỉ nói riêng chữ *maestoso*.
- n14: bỏ "như cảnh hài trong opera".
- n16: "Violin và viola gắn sordino", thay "Đàn dây". Cello và bass chơi pizzicato.
- n22: "cadenza … đã thất lạc" thành "không có cadenza nào của ông cho K. 467 còn lại". Thêm: Mozart thường ứng tác (Köchel, PTNA).
- n24: âm vực đàn thành "FF–g''', đàn kiểu Walter" (Tafelmusik), khớp trang `mozart-k545`. Bỏ "nhẹ tiếng và tắt nhanh".
- n31–n33: bản thu có thật, bỏ đánh giá:
  - Anda: DG, thu tháng 5/1961; TIME 1968 xác nhận bản thu này dùng trong phim;
  - Perahia: CBS 1978;
  - Bilson, Gardiner, English Baroque Soloists: Archiv 1987.
- n35: bỏ "Grade 8" (không có nguồn); thay bằng mức Henle 6 (HN 766).
- n40: dòng Nguồn ghi lời tựa Breitkopf 2007 đổi thành lời tựa Henle HN 766 (Gertsch 2006, bản đã đọc). Bỏ Hutchings và Rosen (sách in).

**doc-ten-tac-pham**
- n8: số opus "chỉ cho biết gần đúng thứ tự sáng tác" (COD). Câu cũ "thường theo thứ tự xuất bản" không có nguồn.
- n24, n55: "Ánh trăng" "có lẽ" bắt nguồn từ Rellstab (1824); bản in năm 1802 chỉ ghi *Sonata quasi una fantasia*. Bỏ "chỉ phổ biến sau khi Beethoven mất", ở cả đoạn văn và lời giải thích câu hỏi 3. Review D7-gom đã bỏ đúng câu này ở trang `cap-nhat`.
- n37: "hãng nổi tiếng" thành "hãng đĩa nhạc cổ điển".
- n40, n42:
  - mốc HIP thành "khoảng những năm 1970";
  - câu tả âm thanh thành "âm sắc khác hẳn, cách chọn tốc độ cũng khác, ít vibrato" (BBC Music Magazine).
- n45: tên nghệ sĩ HIP chỉ giữ người có nguồn đã mở: Harnoncourt, Hogwood, Norrington, Gardiner với English Baroque Soloists. Bỏ Pinnock, Christie, Savall, Il Giardino Armonico.
- n46: bỏ "nguồn tham khảo tốt nhất cho người mới"; "mỗi tuần" thành "mỗi kỳ".

**nghe-gi-tiep**
- n10: câu "Giai điệu dân gian Séc" (Dvořák số 9) kiểm được và không đúng; viết lại thành lời gợi ý.
- n15: Partita của Bach viết "cho đàn phím", không phải "cho piano".
- n25: *Asturias* nguyên bản cho piano (Suite española Op. 47); trang ghi rõ là bản chuyển soạn cho guitar.
- n27: "Một chương nocturne" thành "Một nocturne".

**mau**: không sửa.

## Chỗ chưa chắc, cho lượt 2 xem kỹ

- chopin-etude n22: "chuỗi hợp âm bảy giảm" trước *con bravura*.
  - Đoạn *cresc. molto* trên ảnh quá mờ, chưa đọc từng hợp âm.
  - Đoạn *con bravura* thì chắc chắn là bảy giảm.
- chopin-etude n10: Cramer chưa đọc trang IMSLP chi tiết.
- mozart-concerto-21 n7: phần phát triển, tái hiện, cadenza của chương 1 trong hinh (bản ghi n7) chưa xem ảnh trang (NMA tr. 106–137). Hiện chỉ dựa vào PTNA ("Concerto-sonata form").
- mozart-concerto-21 n10 (bản ghi): chương 3 "có cadenza ngắn" chưa đối chiếu bản nhạc.
- doc-ten-tac-pham n31: nghĩa của "Anh." (Anhang). Nguồn đã mở chỉ cho thấy Anh. II, III và phần "Incerta und Fehlzuschreibungen", chưa có câu định nghĩa trực tiếp. Trang khác dẫn tới câu này.

## Đề xuất sửa dữ liệu (`sua-B.yml`)

- `mozart-concerto-21`, `hinh`: ô Andante đổi "dây gắn sordino" thành "violin, viola gắn sordino" (bản ghi n9).
- `mozart-concerto-21`, `hinh`: `ghi_chu` đổi "đã thất lạc" thành "Không còn cadenza nào của Mozart…" (bản ghi n12).

Hai đề xuất đều hiện trên trang qua `::hinh-cau-truc`. Áp xong thì thêm `doi_chu` cho trang.

`chopin-etude`: không đề xuất sửa. Trường đã khóa (`grade`, `chang`): hai bản ghi không có giá trị, không lệch nguồn.

## Câu ở trang khác

- Mọi câu được dẫn tới đều giữ ý. Hai tiêu đề `## Các danh mục riêng` và `## Theo tâm trạng` không đổi.
- Ở `doc-ten-tac-pham`, đoạn HIP đổi mốc năm và câu tả âm thanh; câu "thường A = 415 Hz cho nhạc Baroque" và link về `am-hoc` giữ nguyên.
- `mau` n1: trang `nghe-nhac/index` chưa chuyển. Lô chuyển trang ấy phải giữ tiêu đề "## Phương pháp 4 lần nghe" và bốn lần nghe.
- Link "sắp có" (trang chưa chuyển):
  - `nghe-nhac/mozart-40`;
  - `schubert-erlkonig`, `handel-hallelujah`, `puccini-nessun-dorma`.

## Nguồn hay dùng

- Bản nhạc: IMSLP (wikitext qua `api.php`; trang thường bị bot check), Mutopia, Internet Archive, NMA trên DME Mozarteum.
- Henle: lời tựa và ghi chú dạng PDF; trang sản phẩm cho mức khó.
- Chopin: Viện Fryderyk Chopin, mUltimate Chopin (`sm.multimatechopin.com`), mô tả từng bản thảo và bản in đầu; Niecks trên Project Gutenberg.
- Mozart: Köchel online.
- Danh mục tác phẩm:
  - danh sách của Music Library Association ("Thematic Indexes Used in LC/NACO"): mỗi nhà soạn nhạc một trang, có tên người lập;
  - COD qua Encyclopedia.com;
  - Lưu trữ Bartók (Budapest).
- Bản thu: MusicBrainz (ws/2, có quan hệ conductor, instrument); trang DG; bản ghi thư viện ECU; TIME 1968.
- Mở qua Wayback Machine: Criterion, Gramophone (Cloudflare chặn) và Thư viện Morgan.
- Bị chặn, không dùng: Merriam-Webster, Svensk Filmdatabas, Universal Edition, chopin.nifc.pl (trang chạy bằng JavaScript).

## Thuật ngữ chưa có trong `thuat-ngu.yml`

- nốt kép, quãng sáu kép, hợp âm bảy giảm, hợp âm bảy át;
- *con bravura*, *poco più animato*;
- *Eingang* (lead-in), chùm ba (triplet: đã chọn ở D6-L1-gom nhưng chưa có bản ghi);
- fortepiano, *maestoso*;
- HIP, danh mục tác phẩm (thematic catalogue), Op. posth., WoO, remaster.
