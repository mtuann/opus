# D6-L4, nhánh gom: review (chờ lượt 2 bổ sung, kiểm mẫu và khóa)

Nhánh `moi/d6-l4-gom`, 05/11/2026. Lô D6-L4 gồm 6 bài học (`piano/tac-pham/bach-invention-1`, `beethoven-anh-trang`, `chopin-valse-si-thu`, `mendelssohn-thuyen-ca`, `mozart-k545`, `schumann-traumerei`), 2 hướng dẫn nghe (`nghe-nhac/beethoven-moonlight`, `nghe-nhac/schumann-kinderszenen`) và lần kiểm định 2 của 7 bản ghi tác phẩm (trường chưa khóa).

- Chủ repo giao agent làm theo đề xuất, review sau.
- Người review: Claude Opus 5.5. Người này không làm lượt 1 hay lượt 2 của lô.
- Một agent con Claude Opus 5.5 kiểm 86 câu `ve-site` trên trang, khối abc, dữ liệu và `src/scripts/nghe.js`, không sửa repo, không dùng mạng. Review đọc kết quả rồi ghi vào hồ sơ.
- Review tự mở lại vài nguồn để quyết định (User-Agent `opus-kiem-dinh/1.0`): lời tựa Henle HN 1062 (PDF), Mutopia `SchumannOp15No07.ly`, PTNA Kinderszenen.
- Không khóa gì. Làm theo cách của `d6-l3-gom.md`.

## Lượt 2

Kết quả lượt 2 đã nhập ở commit trước (`d6-l4-gom/ket-qua-*.yml`). Danh sách cần review: `can-review-{trang-1,trang-2,trang-3,du-lieu}.txt`.

| Phần | Câu | dung | sai | khong-chac |
|---|---|---|---|---|
| Trang | 445 | 424 | 7 | 14 |
| Bản ghi | 132 | 124 | 0 | 8 |

Cần review: trang 88 câu (lượt 1 da-sua, da-bo hay chưa có kết quả, hoặc lượt 2 sai, khong-chac), bản ghi 14 câu.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, mở đầu bằng "Review D6-L4-gom: …". Mọi câu đã review có `review: dung`. Lần kiểm định cuối của 15 hồ sơ có `nguoi.review`.

### Câu về chính site (86 câu)

Agent con kiểm trên:
- trang `.md`, khối abc soạn cho trang (giọng, nốt, ngón, sắc thái, bàn đạp);
- link: trang đích ở `src/content/docs/`, hay ở `../opus-zero/docs/` khi chưa chuyển; không link nào có `#mục`;
- `tac-pham.yml`, `cap-do.yml`, `trang.yml`, `src/scripts/nghe.js`.

Kết quả: 84 đúng, 2 sai, 0 nhãn sai. Cả hai câu sai đã sửa trang, ghi `da-sua`:
- `chopin-valse-si-thu` n15: "xem trang Valse La thứ về … chỗ đứng [của valse] trong các phòng khách Paris". Trang đích (đã khóa) không còn đoạn về phòng khách, vì D6-L2 đã bỏ. Sửa thành "về thể loại valse và những năm Chopin sống ở Paris", đúng điều trang đích viết.
- `mendelssohn-thuyen-ca` n82 (bài tập 3): chữ nói giai điệu "ngón 4–5", nhưng khối ghi ngón 3 cho nốt La ở ô 1. Sửa chữ theo khối: "các ngón đã ghi (chủ yếu 4–5, riêng La ở ô 1 ngón 3)". Khối giữ nguyên.

`beethoven-anh-trang` n104 (mục Nguồn) có `cau` mới, khớp mục Nguồn sau khi bỏ dòng Rosen (n85).

Lưu ý của agent con (câu vẫn đúng, không sửa):
- `traumerei` n54: chữ bài tập 1 nói các nốt dưới kêu ở *pp*, nhưng khối ghi `!p!`.
- `mozart-k545` n55: "luồn ngón cái sang Fa" chỉ đúng ở ô 1.
- `traumerei` n72: "Nhiều bè độc lập hơn: Invention số 1" dễ đọc thành "nhiều bè hơn".

### Soát nhãn

- **`beethoven-anh-trang`:**
  - n86 (`khuyen-tap`) có điều cần nguồn: "gần nhất với làn sương Beethoven nghe", "hợp hơn với fortepiano". Bỏ hai vế ấy.
  - n87 (`khuyen-tap`, lượt 1 nêu): "là cách thông dụng trên đàn hiện đại" là điều cần nguồn mà không có. Bỏ vế ấy.
  - n31, n88: đổi từ `quy-tac` sang `khuyen-tap` (xem dưới).
- Không câu `khuyen-tap` nào chứa điều về sức khỏe. Câu cổ tay cứng, mỏi tay của K. 545 (n45, n54) đã ở loại `quy-tac` từ lượt 1.

### Bảy câu lượt 2 ghi `sai`

Lượt 2 đúng ở cả bảy câu. Trang sửa theo câu đúng của lượt 2, nên không chạy lại lượt 2.

| Câu | Kiểm và sửa |
|---|---|
| `schumann-traumerei` n31, n42, n62 | Review mở tệp Mutopia `SchumannOp15No07.ly`: fermata có ở ô 22 và ở hợp âm cuối ô 24, cả hai khuông. Câu của Seiffert "only one fermate, namely shortly before the end" không tính dấu ngân ở hợp âm cuối. Đã sửa ba chỗ: dòng Câu 6 của bảng Theo dõi, hàng A' của bảng Cấu trúc và đoạn Diễn tấu. Nay ghi "dấu ngân duy nhất trước hợp âm cuối", "hợp âm cuối cũng có dấu ngân". |
| `schumann-traumerei` n46 | Nốt dài của giai điệu ở ô 6 là La, không phải Fa: "Fa cao ở ô 2, La cao ở ô 6…". |
| `mozart-k545` n42 | Chương 3 "khoảng 1,5 phút" thành "chưa tới 2 phút". |
| `bach-invention-1` n49 | Ô 3–4 và 11–12 xuống từng quãng ba, ô 15–18 xuống từng bậc. Sửa bảng Chỗ khó và lời giải thích câu hỏi 4 ("mỗi lần dời xuống"). |
| `beethoven-anh-trang` n24 | Lenz không ghi năm. "Hai mươi năm trước" gắn với biệt danh, không gắn với lời so sánh của Rellstab. |

### Đàn thời Beethoven và bàn đạp (*Ánh trăng*)

Nguồn của chuỗi câu n18, n19, n31, n84, n85, n88 là bài blog của Graham Fitch. Đây là nguồn phổ thông, không được làm nguồn duy nhất, và lượt 2 không tìm được nguồn bậc 2 cho các vế nhân quả. Review đọc lời tựa Henle HN 1062. Perahia viết: "Neither can be taken literally … I don't think they should obliterate the harmonic sense … the clash between major and minor at mm. 9 and 10 … there should always be a pedalled sound".

**Giữ** (có nguồn):
- n18: cần gạt đầu gối trên đàn Vienna khoảng 1800 (Tafelmusik).
- Blog Henle về *senza sordino* (n82, n83).

**Viết lại theo Perahia** (n19, n84, lời giải thích câu hỏi 1 n99):
- Chỉ dẫn bàn đạp không thể hiểu theo nghĩa đen.
- Không được xóa mất nghĩa hòa âm; chỗ trưởng và thứ va nhau ở ô 9–10 phải nghe rõ.
- Lúc nào cũng có tiếng bàn đạp.
- Bỏ: "đàn cũ hơn dùng nút gạt bằng tay", "tiếng tắt nhanh hơn đàn hiện đại nhiều", "làn sương mỏng vì tiếng tắt nhanh", "người chơi thường đổi theo hòa âm".

**Bỏ:**
- n85: "Charles Rosen đọc chỉ dẫn theo nghĩa này" và dòng Rosen ở mục Nguồn. Sách in chưa đọc, chỉ biết qua blog Fitch.

**Đổi sang `khuyen-tap`:**
- n31: còn lời khuyên "nghe xem bàn đạp giữ lâu vang thế nào trên mỗi cây đàn".
- n88: cách đổi một phần là kỹ thuật bàn đạp người dạy đàn khuyên. "Chút sương" thành "chút vang".

Mục Nguồn thêm link lời tựa HN 1062 (n103).

### Câu `khong-chac` và câu lượt 1 chưa có kết quả

- **Thuyền ca:**
  - n18: giữ bỏ. Lời tựa HN 327 (lượt 2) không nói cái tên *Lieder ohne Worte* "có lẽ do Mendelssohn nghĩ ra".
  - n19: danh sách lượt 2 còn ghi chữ cũ. Vế "phần lớn tên do nhà xuất bản thêm" giữ bỏ: HN 327 chỉ nói các tên ấy không do Mendelssohn đặt. Vế "dùng tên thêm hai lần" là n20 (lượt 2 dung). Câu n19 nay chỉ còn lá thư năm 1835 gửi Klingemann, nên đưa vào lượt 2 bổ sung.
  - n54: bỏ "không đưa ra chủ đề mới". Ô 18–21 và ô 26–31 là chất liệu mới.
  - **Số opus nhất quán:** `danh_muc` đã khóa ghi "Op. 19 số 6"; dòng Tác phẩm ghi "có nơi ghi Op. 19b". Trên trang, hai bài cùng tên kia là Op. 30 số 6 và Op. 62 số 5 (Henle HN 1172), và RCM xếp đúng "op. 19b, no. 6". Không có chỗ lệch.
- **Valse Si thứ:**
  - n4: câu mở đầu bỏ so sánh "tay trái đổi thế nhiều hơn, nhiều trang trí hơn". Viết lại bằng điều đã kiểm ở n5, n6: hợp âm đổi gần như mỗi ô, trang trí viết bằng nốt thường. Số 56 ô của Valse La thứ lấy từ hồ sơ đã khóa của trang ấy.
  - n44: Si♭ ở ô 33 được chuẩn bị bằng chính nốt ấy ở cuối ô 32. Theo Open Music Theory, nốt này không hẳn là appoggiatura. Trang thành "một nốt nghịch rơi đúng phách, rồi giải bậc xuống La".
- **K. 545**, n60: bỏ "thời Mozart là nhanh vừa", vì không có nguồn.
- **Ánh trăng**, n17: bỏ chữ "trẻ" ở dòng Bối cảnh, vì không có nguồn năm sinh.
- **Invention số 1**, n71: lượt 2 dẫn bản Czerny (Carl Fischer), có Allegro, sắc thái và dấu luyến của người biên tập. Ghi `dung`.
- **Kinderszenen:**
  - n20: review so 13 tên dịch trên trang với tên Đức. Tên nào cũng đúng nghĩa.
  - n36: bỏ vế "vang lại ở nhiều bản sau". Thay bằng "số 4 có liên hệ rõ với chủ đề này" theo PTNA ("A clear connection to the theme of No. 1"). Review đã mở lại trang PTNA.
  - n37 (Réti): giữ bỏ.
  - n47 (Cortot): giữ bỏ. Lượt 2 thấy bản thu năm 1935 trên Internet Archive, nhưng phần đã bỏ chủ yếu là đánh giá.
  - n54 (Wiener Urtext UT 50190): `dung`. Nguồn là trang bán lẻ, như D6-L3 dùng Thomann.

### Dữ liệu (`src/data/tac-pham.yml`, trường chưa khóa)

| Bản ghi | Trường | Đổi |
|---|---|---|
| `bach-invention-1` | Giọng · nhịp · tốc độ (n20) | bỏ "(thường ♩ ≈ 60–80)" (mục có điều kiện của `sua-A.yml`) |
| `bach-invention-1` | Bản nhạc (n25) | bỏ Bärenreiter, Wiener Urtext |
| `beethoven-anh-trang` | Độ khó (n23) | bỏ "Khoảng ABRSM Grade 6–7 (ước lượng; chặng 5 của site)"; thêm "ABRSM không xếp riêng chương 1 vào Grade nào; cả bản sonata có trong danh sách bằng ARSM" |
| `beethoven-anh-trang` | Bản nhạc (n26) | bỏ Bärenreiter (Del Mar), Wiener Urtext, ấn bản ABRSM (Barry Cooper) |
| `mozart-k545` | Bản nhạc (n23) | bỏ Wiener Urtext, Bärenreiter |
| `schumann-traumerei` | Độ khó (n18) | "Khoảng ABRSM Grade 6 (ước lượng)" thành "Henle xếp mức 5 …; bài không có trong đề cương ABRSM 2021–2028 và RCM 2022" |
| `schumann-traumerei` | Bản nhạc (n21) | bỏ Bärenreiter; giữ Wiener Urtext (UT 50190, nguồn mới `wiener-ut50190` trong hồ sơ bản ghi); "in đúng số máy đếm nhịp của Schumann" thành "in số máy đếm nhịp của bản in đầu", khớp n16 |

- Không chạy lại lượt 2 cho dữ liệu: chữ mới chỉ bỏ vế không có nguồn hay dùng điều lượt 2 đã nêu.
- `bach-invention-1` n28 (`lic` của bản thu Meyer): giữ nhãn của Commons. Lượt 2 xác nhận nhãn ấy, và `check_audio.py --network` so `lic` với Commons. Xem mục "Chủ repo cần biết".
- Chip "≈ Grade" của *Ánh trăng* (n14) và *Träumerei* (n12): giữ, vì phải khớp `grade` đã khóa.

### doi_chu

Mọi chỗ đổi chữ trên trang hay trong dữ liệu đều có `doi_chu`: 26 mục mới và 7 mục cũ cập nhật `moi` và `ly_do`. `so-chu.mjs` báo đủ cho cả 8 trang.

Phần `doi_chu` của 7 hồ sơ trang được ghi lại bằng PyYAML. Cách viết YAML đổi, nội dung giữ nguyên.

## Lượt 2 bổ sung

`d6-l4-gom/bo-sung.yml` (`node tools/khoa.mjs xuat D6-L4 --con-lai`) có 2 câu. Kết quả lượt 2 cũ của cả hai đã gỡ và ghi lại trong `ghi_chu`.
- `beethoven-anh-trang` n84: viết lại theo lời tựa HN 1062. Câu có chi tiết lượt 2 chưa kiểm (chỗ trưởng–thứ ở ô 9–10, "luôn có tiếng bàn đạp").
- `mendelssohn-thuyen-ca` n19: lá thư năm 1835 gửi Klingemann ("das Venetianische Gondolierlied").

Phần dữ liệu: `xuat du-lieu/tac-pham/<7 slug> --con-lai` ra 0 câu.

## Kiểm

- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua (kiểm thử phạm vi của nhánh lô và nhánh `them/`), 0 hỏng.
- `node tools/khoa.mjs tinh`: không lỗi.

## Chủ repo cần biết

- **Grade đã khóa không có nguồn đỡ** (không sửa ở lô này):
  - *Ánh trăng* khóa "Grade 6–7". ABRSM không xếp chương 1, Henle xếp mức 4.
  - *Träumerei* khóa "Grade 6". Bài không có trong đề cương nào; Henle xếp mức 5.

  Dòng Độ khó nay không còn ước lượng ABRSM, nhưng chip vẫn ghi "≈ Grade" theo `grade` đã khóa. Muốn chip theo nguồn thì phải mở khóa `grade`.
- **`lic` của bản thu Marcelle Meyer (Invention số 1)**: khối nghe in "phạm vi công cộng" (nhãn của Commons). Ngay trên đó, trang nói bản thu ở Mỹ còn được bảo hộ, nên site chỉ dẫn link. `check_audio.py` không cho ghi `lic` khác Commons. Nếu muốn ghi rõ, có thể dùng `note` của `ban_thu` hay đổi cách `nghe.js` hiện nhãn.
- **Hai trang đã khóa xếp Valse Si thứ ở hàng chặng 5** (`piano/not-lap-not-kep`, `piano/quang-tam-buoc-nhay`) và `schumann-album` n69 ("nổi tiếng nhất"): như `d6-l4.md` đã ghi; chưa sửa.
- **Chip "♩ = 100 (Schumann)" của *Träumerei***: giữ như đề xuất của lượt 1. Dòng Thông tin đã nói rõ số này có từ bản in đầu và Schumann để nguyên.
- **Ba chỗ nhỏ agent con nêu** (n54, n55, n72 ở trên): chưa sửa, vì câu vẫn đúng.
- **`ghi_chu` chung của hồ sơ `beethoven-anh-trang`** còn ghi "Còn mở: n17, n87". Hai câu này đã giải quyết ở review; chi tiết nằm ở `ghi_chu` của từng câu.
- **Còn trống trong lần kiểm định cuối của 15 hồ sơ:** `nguoi.luot_2` (người làm lượt 2 và lượt 2 bổ sung) và `nguoi.kiem_mau`.

## Lượt 2 bổ sung và trạng thái khóa (người gom)

- Lượt 2 bổ sung (Claude Opus 5.5): `ket-qua-bo-sung.yml`, `beethoven-anh-trang` n84 (lời tựa Henle HN 1062, mục của Perahia) và `mendelssohn-thuyen-ca` n19 (lời tựa Henle HN 1172, thư gửi Klingemann 17/4/1835) đều `dung`; đã `nhap`.
- Đã điền `nguoi.luot_2` cho 15 hồ sơ (8 trang, 7 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l4-gom/kiem-mau.yml` (`xuat D6-L4 --mau 8`).
- Lượt 2 phần dữ liệu: agent gọi vài lần đường dẫn `/search` của henle.de (robots.txt cấm), rồi dừng, không dùng kết quả; các trang Henle dẫn đều tìm qua sitemap.
