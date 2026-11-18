# Báo cáo: việc sau ba hướng dẫn nghe mới (`mo/sau-nghe-1-3`)

17/11/2026. Việc ngoài phạm vi của ba nhánh `them/bartok-sonatina`, `them/backer-grondahl-klage`, `them/debussy-golliwogg` (mục "Việc ngoài phạm vi" của ba báo cáo): link sang ba hướng dẫn nghe mới từ các trang đã khóa, thêm Agathe Backer Grøndahl vào trang nhà soạn nhạc nữ, thuật ngữ mới cho Từ điển.

## Lượt 1 (Claude Opus 5.5)

Mở khóa 9 mục và thêm 7 bản ghi thuật ngữ (chưa khóa; khóa sau lượt 2, review, kiểm mẫu):

- **`lich-su/nu-nha-soan-nhac`**: mục Thế kỷ 19 thêm **Agathe Backer Grøndahl** (1847–1907), Na Uy, sau Clara Schumann (theo năm sinh): nghệ sĩ piano và nhà soạn nhạc, một trong những nghệ sĩ piano hàng đầu của Na Uy, thành công trong và ngoài nước; 250 ca khúc và khoảng 150 bản piano (Store norske leksikon / Norsk biografisk leksikon, bản JSON của snl.no). Dòng *Nghe:* link `nghe-nhac/backer-grondahl-klage`. Mục Nguồn thêm SNL. Nhận định n108 (nam), n109 (lich-su), n110 (so-lieu), n111 (ten), n112 (ve-site); `doi_chu` hai khối mới. Trang không có `::dong-thoi-gian` hay `::bang-nha-soan-nhac`, nên không thêm `backer-grondahl` vào danh sách nào; năm viết tay khớp `nha-soan-nhac.yml` (`tests/dong-thoi-gian.test.mjs` đạt).
- **`piano/tac-pham-theo-cap`**: chặng 6 thêm dòng "Bartók: Sonatina Sz. 55, chương 1 *Dudások* (Những người thổi kèn túi)", Thế kỷ 20, sau Ravel: học được gì theo hướng dẫn nghe (quãng năm nhấn ở bè trầm, chùm ba, nốt láy; đoạn *Allegro* nhẹ, nhịp đổi 2/4 và 3/4), "Có trong danh sách Grade 7 của ABRSM (2025–2028)", link hướng dẫn nghe ở ô cuối (không có bài học nên ô đầu không link). n85 (cap-do), n86 (cau-truc), n87 (ve-site); `doi_chu` một hàng mới.
- **`piano/nha-soan-nhac`**: Debussy, "Bắt đầu bằng": *Golliwogg's Cakewalk* link hướng dẫn nghe, "(có hướng dẫn nghe)" (n193). Bartók, "Bắt đầu bằng": Sonatina link hướng dẫn nghe, "(chương *Bagpipers*: Grade 7, chặng 6; có hướng dẫn nghe)" (n194). Cả hai ve-site; `moi`, `ly_do` của hai mục `doi_chu` sẵn có cập nhật.
- **`piano/tac-pham/debussy-clair-de-lune`** Học tiếp: link bài học Arabesque số 1 và "các bài trong *Children's Corner* (nghe trước bài cuối với hướng dẫn nghe *Golliwogg's Cakewalk*)" (n96 ve-site, `doi_chu`).
- **`nghe-nhac/debussy-preludes`**: sau câu về minstrel show (dưới bảng Theo dõi khi nghe): "Một bài khác của Debussy cũng mượn nhạc giải trí Mỹ: *Golliwogg's Cakewalk*, bài cuối của *Children's Corner*, một điệu cakewalk theo phong cách ragtime" (n99 lich-su, Henle HN 382; n100 ve-site; `doi_chu` khối sẵn có cập nhật).
- **`piano/tac-pham/bartok-romanian-folk-dances`** Học tiếp: "Cùng tác giả, khó hơn: Sonatina, viết cùng năm 1915 từ giai điệu múa dân gian Romania (chương 1: chặng 6); nghe trước với hướng dẫn nghe Sonatina" (n32 lich-su, Henle HN 1401; n33 ve-site). Trang không có ở site cũ.
- **`ke-hoach`**: đoạn hướng dẫn nghe bỏ "(hiện chưa có hướng dẫn nghe nào)", thêm "Đã có: Debussy, *Golliwogg's Cakewalk*; Bartók, Sonatina; Agathe Backer Grøndahl, *Klage*, hướng dẫn nghe đầu tiên về tác phẩm của một nhà soạn nhạc nữ", ba link (n9 da-sua, ve-site; đếm bản ghi `loai: nghe` theo thời kỳ: Ấn tượng 2, Thế kỷ 20 5, Đương đại 1, nhà soạn nhạc nữ 1).
- **Từ điển** (`src/data/thuat-ngu.yml`, bảy bản ghi mới, mỗi bản một hồ sơ `kiem-dinh/du-lieu/thuat-ngu/<id>.yml`): `slargando` (Thay đổi tốc độ, sau allargando), `a-piacere` (Thay đổi tốc độ, sau rubato), `tutta-forza` (Cường độ), `lunga` (Cách diễn tấu, sau fermata; ghi chú: bản in Sonatina của Bartók ghi *longa*), `dolcissimo`, `calmato` (Tính cách), `sonatina` (Hình thức và thể loại). Nguồn: Dolmetsch (curl, User-Agent `opus-kiem-dinh/1.0`), Trinity "Musical terms and directions" (a piacere), Britannica qua Wayback (sonatina: "a shorter and often lighter form of the sonata"). `leggero` không thêm bản ghi riêng: `leggiero` đã có; mở bản ghi ấy, thêm ghi chú "Cũng viết *leggero*" (n3, Dolmetsch). Trang **`nhac-ly/tu-dien`** phải mở (trang đã khóa không đọc được bản ghi chưa khóa): chữ trang không đổi, `doi_chu` 8 khối (7 hàng mới, ô Ghi chú của leggiero).
- **`plans/ben-vung/ke-hoach-mo-rong.md` mục 6.2**: số hướng dẫn nghe theo mảng cập nhật; dòng "Đã có" cho ba trang; ý tưởng còn lại: Chaminade *Automne*, Chopin B. 49 và Op. 64 số 2.

Câu cần lượt 2: 18 (`node tools/khoa.mjs xuat … --con-lai`): tac-pham-theo-cap n85, n86; debussy-preludes n99; bartok-romanian-folk-dances n32; thuật ngữ leggiero n3, slargando n1–n2, a-piacere n1–n2, tutta-forza n1–n2, lunga n1–n3, dolcissimo n1, calmato n1, sonatina n1–n2. Câu ve-site (nu-nha-soan-nhac n112, tac-pham-theo-cap n87, nha-soan-nhac n193, n194, debussy-clair-de-lune n96, debussy-preludes n100, bartok-romanian-folk-dances n33, ke-hoach n9) chỉ cần review. nu-nha-soan-nhac n108–n111: trang Đọc thêm, `xuat --con-lai` không đòi lượt 2 (như n106, n107 ở `mo/sau-dot-3`); kiểm mẫu nên lấy một câu trong số này.

Kiểm thử: `npm run build:xem` đạt; `npm test` 355 đạt, 2 bỏ qua, 0 hỏng (có `.cache/site-cu/`: `tests/chuyen.test.mjs` so chữ thật). Mọi hồ sơ đã sửa đọc bằng `yaml.parseDocument` không lỗi.

## Chỗ chưa chắc

- **`lunga` và *longa***: Dolmetsch giải thích *lunga* viết trên hay dưới dấu ngân là ngân lâu hơn; *longa* (chữ Bartók in) chỉ có ở Dolmetsch như tên một trường độ cổ. Câu "Bản in Sonatina của Bartók ghi *longa*" dựa vào bản quét (bậc 1, đã đọc ở ba lượt của hồ sơ `nghe-nhac/bartok-sonatina`). Review có thể chọn bỏ vế này hay tách *longa* thành mục riêng.
- **Chặng 6 cho Sonatina**: Sonatina không có bài học nên không có `chang` trong dữ liệu; "chặng 6" là cách xếp của site theo ABRSM Grade 7 (như hướng dẫn nghe đã viết). Ở `tac-pham-theo-cap` dòng không có link bài học nên `tests/tac-pham-theo-cap.test.mjs` không kiểm.
- **Nhóm của `a piacere`** (Thay đổi tốc độ, như rubato) và của `lunga` (Cách diễn tấu, cạnh fermata) là lựa chọn của site.
- **Lần mở bản ghi `leggiero`** (khóa từng phần: `ghi_chu, nghia, thuat_ngu`): lần 2 của `lan` chưa ghi `truong`; khi khóa lại dùng `khoa.mjs` như với bản ghi khóa từng phần.

## Không làm

- Thuật ngữ khác trong báo cáo Sonatina (cuộn đàn tự động, kèn túi) và các chữ cakewalk, ragtime của *Golliwogg's Cakewalk*: chưa có trong lời giao; để lô thuật ngữ sau.
- `lich-su/thoi-ky/the-ky-20` link sang hướng dẫn nghe Sonatina (báo cáo Sonatina gợi ý): không trong lời giao.
- `piano/nha-soan-nhac`: không thêm link bài học *Romanian Folk Dances*, *For Children* ở dòng Bartók (chưa có trong lời giao); dòng 6.1 "Dự phòng: … Bartók Sonatina; Debussy *Golliwogg's Cakewalk*" của kế hoạch giữ nguyên (hai bài đã thành hướng dẫn nghe, ghi ở 6.2).

## Review

Claude Opus 5.5 (agent riêng, 17/11/2026). Ghi `review: dung` cho 30 nhận định mới hay sửa của lần mở này (18 câu qua lượt 2, 8 câu `ve-site`, nu-nha-soan-nhac n108–n111) và `nguoi.review` ở lần cuối của `lan` cả 17 hồ sơ (9 mục mở, 7 bản ghi mới, `nhac-ly/tu-dien`). Không câu nào sai.

- **Backer Grøndahl**: đọc lại `snl.no/Agathe_Backer_Gr%C3%B8ndahl.json` (User-Agent `opus-kiem-dinh/1.0`): sinh 1.12.1847, mất 4.6.1907, khớp `nha-soan-nhac.yml`; ba câu tiểu sử dịch sát SNL/NBL. Tên, Op. 36 số 1, "Lời than" khớp hướng dẫn nghe đã khóa.
- **Link sang ba hướng dẫn nghe**: chữ khớp `nghe-nhac/bartok-sonatina` (Grade 7 → chặng 6, 1915, giai điệu múa dân gian Romania, chương 1), `debussy-golliwogg` (bài số 6, cuối *Children's Corner*, cakewalk theo phong cách ragtime), `backer-grondahl-klage`; số hướng dẫn nghe theo thời kỳ ở `ke-hoach` n9 đếm lại đúng.
- **Chặng 6 cho Sonatina**: hợp lý. `cap-do.yml` đặt chặng 6 là Grade 7–8; ABRSM Grade 7 (2025–2028); dòng mới viết như dòng Chopin Op. 72 số 1 cùng trang.
- **Bản quét** IMSLP893630: xem lại tr. 3 ô 20 ("longa" trên dấu ngân) và tr. 4 ("p leggero"). `luot_2_ghi_chu` của tac-pham-theo-cap n86 viết nhầm "p leggiero"; chữ trang không nêu chữ này, ghi ở review.
- **Từ điển**: nghĩa và ghi chú của 7 mục khớp Dolmetsch (curl lại defsl, defsl1, defss3, defst5), Trinity, Britannica; nhóm hợp lý. Hai chỗ sửa chữ (dữ liệu, hồ sơ bản ghi và `doi_chu` của `nhac-ly/tu-dien` sửa theo):
  - `lunga`: giữ một mục, *longa* ở ghi chú (Dolmetsch không có mục *longa* nghĩa "ngân lâu", chỉ là tên trường độ cổ, "Latin, literally 'long'"); thêm "(tiếng Latin, cùng nghĩa)" để người đọc hiểu vì sao *longa* nằm ở mục *lunga*.
  - `a piacere`: ghi chú thành "Như *ad libitum* (*ad lib.*): người chơi tự quyết, chẳng hạn có giữ đúng nhịp hay không" (câu cũ thiếu chủ ngữ).
- **`leggiero` khóa cả bản ghi**, không phải khóa từng phần: `khoa.json` ở `main` ghi `"thuat-ngu/leggiero"` (không `#`), như cả 382 bản ghi thuật ngữ; `truong` ở lần 1 là dạng ghi của đợt 3. Lần 2 không cần `truong`; khóa lại bằng `node tools/khoa.mjs khoa du-lieu/thuat-ngu/leggiero` (mục "Chỗ chưa chắc" phía trên ghi nhầm).
- Kiểm thử: `npm run build:xem` đạt; `npm test` 355 đạt, 2 bỏ qua, 0 hỏng.
- Kiểm mẫu còn lại: `kiem_mau` để trống; nên lấy một câu trong nu-nha-soan-nhac n108–n111.

## Kiểm mẫu và khóa

Claude (agent riêng) kiểm thay chủ repo bốn câu (nu-nha-soan-nhac n109, tac-pham-theo-cap n85, thuat-ngu/slargando n1, thuat-ngu/lunga n1): 4 đúng. Khóa lại các mục đã mở và khóa 7 thuật ngữ mới 17/11/2026.
