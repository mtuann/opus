# D6-L5-gom: lượt 2 và review

Nhánh `moi/d6-l5-gom`, ngày 05/11/2026. Review: Claude Opus 5.5 (phiên Claude Code), không làm lượt 1 hay lượt 2 của lô. Có một agent con Claude Opus 5.5 kiểm các câu `ve-site`; nó chỉ đọc, không sửa file. Không khóa gì, không commit, không push.

## Lượt 2 (số liệu)

Kết quả thô ở `d6-l5-gom/ket-qua-*.yml`, đã nhập vào hồ sơ (`node tools/khoa.mjs nhap`). Danh sách cần review: `d6-l5-gom/can-review-*.txt`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (bach, debussy) | 140 | 140 | 0 | 0 | 21 |
| Trang, phần 2 (pathetique-adagio, nghe-nhac/beethoven-pathetique) | 114 | 108 | 0 | 6 | 30 |
| Trang, phần 3 (chopin, schubert, nghe-nhac/schubert-impromptu) | 149 | 143 | 3 | 3 | 34 |
| Dữ liệu (6 bản ghi, lần 2) | 111 | 106 | 2 | 3 | 13 |
| **Cộng** | **514** | **497** | **5** | **12** | **98** |

## Review

Chi tiết từng câu ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L5-gom: …". Mọi câu đã review có `review: dung`, trừ 5 câu chờ lượt 2 bổ sung (xem dưới). Lần kiểm định cuối của 13 hồ sơ (7 trang, 6 bản ghi) có `nguoi.review`.

### Câu về chính site (83 câu)

Agent con kiểm trên:
- trang `.md` và khối abc soạn cho trang (ngón, Ped., chùm nốt, láy rền, số ô);
- link: trang đích ở `src/content/docs/`, hay ở `../opus-zero/docs/` khi chưa chuyển; `#boi-canh`, `#theo-doi-khi-nghe` có thật;
- chặng trong `tac-pham.yml`, mốc nghe của `nghe-nhac/beethoven-pathetique` so với `tools/audio/align/pieces.py` và `ban_thu`.

Kết quả: 83 đúng, 0 sai, 2 nhãn sai. Cả hai đã đổi (mục Soát nhãn). Còn 82 câu `ve-site`.

### Soát nhãn

- **`nghe-nhac/schubert-impromptu` n1** ("Franz Schubert (1797–1828)"): năm sinh–mất là loại `nam`, cần nguồn. Câu Beethoven ở `nghe-nhac/beethoven-pathetique` đã xếp như vậy. Đổi sang `nam`, nguồn `nha-soan-nhac.yml` (đã khóa) và Henle HN 488. Câu vào lượt 2 bổ sung.
- **`debussy-clair-de-lune` n83** ("Sau Grade 8: Liebestraum, Ballade số 1"): phần Grade là `cap-do`, theo ví dụ Für Elise ở `chuan-kiem-dinh.md` mục 1. Tách câu:
  - n83 giữ `ve-site`: link và chặng 7.
  - **n93** (mới, `cap-do`): nguồn là hồ sơ bản ghi `liszt-liebestraum` và `chopin-ballade-1`, có `grade` đã khóa. Câu vào lượt 2 bổ sung.
- **`debussy-clair-de-lune` n46**: đổi từ `dinh-nghia` sang `quy-tac`, vì viết lại (xem dưới).
- **`schubert-impromptu-sol-giang` n79** (`khuyen-tap`): lượt 1 ghi `da-sua` mà không có nguồn, nên công cụ khóa sẽ báo lỗi. Sau khi bỏ vế về các nghệ sĩ, câu chỉ còn lời khuyên. Đổi thành `khong-can-nguon`.
- Không câu `khuyen-tap` nào chứa điều về sức khỏe. Hai câu về mỏi tay (Nocturne n47, Impromptu n60) đã xếp `quy-tac` từ lượt 1, nguồn BAPAM.

### Năm câu lượt 2 ghi `sai`

Lượt 2 đúng ở cả năm câu. Trang hay dữ liệu sửa theo câu đúng của lượt 2, nên không chạy lại.

| Câu | Kiểm và sửa |
|---|---|
| `chopin-nocturne-op9-2` n57 | Niecks: Chopin "very frequently altered the ornamentations"; Gutmann kể có đoạn ông chơi "always in that way". Nên "mỗi lần một khác" là nói quá. Nay: "Chính Chopin cũng thường thay đổi phần trang trí khi chơi và khi dạy". |
| `schubert-impromptu-sol-giang` n47 | Nốt La♮ cuối ô 4 nằm ở giai điệu, không ở bè trầm. Tách câu: "… Rê♭ trưởng. Ở giai điệu, nốt La♮ …". |
| `nghe-nhac/schubert-impromptu` n34 | Bản Brendel năm 1989 là Philips 422 237-2 (MusicBrainz). Trang Decca của lượt 1 là bản phát hành lại về sau. "Decca" thành "Philips"; `ten` của nguồn `dc-brendel` ghi rõ điều này. |
| dữ liệu `debussy-clair-de-lune` n22 | Danh sách ARSM 6/2024 có "Any one from *Suite bergamasque*". Dòng Độ khó nay: "không có trong đề cương các Grade của ABRSM, nhưng danh sách bằng ARSM của ABRSM (từ 2024) cho chọn một chương bất kỳ của *Suite bergamasque*". |
| dữ liệu `schubert-impromptu-sol-giang` n25 | Lượt 2 chấm câu cũ (tỉ lệ 2 : 1,6 : 1,8). Lượt 1 đã đổi dữ liệu thành 24, 30, 32, chú thích "độ dài theo số ô nhịp". Review xem `hinh.nghe` thấy khớp, và `cau` nay ghi theo dữ liệu. |

### Câu `khong-chac` và câu nguồn yếu

- **`chopin-nocturne-op9-2`:**
  - n6, n66: đổi định nghĩa fioritura theo đề nghị của lượt 2: "nét trang trí hoa mỹ cho giai điệu, bắt chước lối luyến láy của ca sĩ; ở Chopin, chúng thường viết bằng nốt nhỏ, thành chùm không chia đều theo phách". Đổi ở cả mục Vì sao, đáp án đúng và lời giải thích của câu hỏi 2. "Luôn nhỏ hơn giai điệu chính" thành lời khuyên "chơi nhẹ hơn giai điệu chính".
  - n11: giữ bỏ.
- **`pathetique-adagio`:**
  - n52: "giai điệu phần lớn đi bậc, có vài bước nhảy".
  - n73: lượt 2 không thấy chấm staccato ở đoạn B; nay ghi "đoạn C và coda". Ý về độ dài dấu luyến chưa có nguồn. Review đọc lại `pathetique-2.ly` (Peters 1910): ở chủ đề, dấu luyến nối qua hai ô (ô 1–2, 4–5, 6–7); ở đoạn B, mỗi dấu luyến gọn trong một ô. Câu viết lại theo đó. Chữ mới: vào lượt 2 bổ sung.
  - n80: bỏ hai vế chưa có nguồn ("gợi ý ngón bấm", "ghi rõ phần nào là của người biên tập"). Còn: ấn bản ABRSM *The 35 Piano Sonatas* do Barry Cooper biên tập, có lời bình về nguồn và cách chơi (Forsyths, lượt 2).
- **`nghe-nhac/beethoven-pathetique`:**
  - n17: giữ bỏ. Beethoven-Haus, Henle và Hewitt đều nói Beethoven tự đặt tên; trang ghi theo hai nguồn đầu.
  - n19: "viết năm 1823" thành "truyện *Theodor* … đăng năm 1824", khớp hướng dẫn nghe *Ánh trăng* đã khóa.
  - n31: giữ bỏ; trang không còn câu này.
- **`bach-prelude-fugue-do-thu` n33**: "bè trầm đi xuống dần" thành "nhìn chung đi xuống", theo ghi chú của lượt 2 (bè trầm lên lại ở ô 12–15).
- **`debussy-clair-de-lune`:**
  - n46: nguồn lượt 2 là trang của thợ đàn. Câu viết lại theo điều trang `piano/tieng-dan` (đã khóa) đã kiểm: "Độ to theo tốc độ phím đi xuống: ấn quá chậm thì nốt không kêu, hơi nhanh là đã to". Nguồn Askenfelt, Goebl 2004; bỏ chữ "điểm thoát". Vào lượt 2 bổ sung.
  - n74: nguồn lượt 2 là trang cá nhân. Review tìm được bài của David Grayson trên *Nineteenth-Century Music Review* 11/2 (Cambridge 2014), dẫn Marguerite Long, *At the Piano with Debussy*, tr. 13. Câu nay: "Marguerite Long kể một câu Debussy hay nói: phải quên rằng piano có búa." Vào lượt 2 bổ sung.
  - n66 (Andante): giữ. Nguồn là `thuat-ngu.yml` đã khóa; Wiktionary chỉ là nguồn phụ.
  - n71, n86 (*con sordina*): giữ. Blog Henle là trang của nhà xuất bản (bậc 2); thêm vào `nguon`.
- **Câu lượt 1 chưa có kết quả, lượt 2 `dung`** (bach n23, n30, n116, n118; debussy n11, n24, n77; pathetique-adagio n24, n79; beethoven-pathetique n55, n57): ghi `dung`. Link lượt 2 vào `nguon` của câu, id `l2-<câu>-<số>`.
- **Câu lượt 1 bỏ, lượt 2 `dung`:** giữ bỏ. Lượt 2 chỉ xác nhận điều cũ có thật, như sách in có thật (Open Library).
  - bach n126; debussy n90; pathetique-adagio n93; beethoven-pathetique n68; nghe-nhac/schubert-impromptu n45.
  - pathetique-adagio n75: nguồn của lượt 2 nói về một đàn năm 1830, không phải đàn năm 1798.
  - chopin n15: năm 1812 hay khoảng 1817 tùy nguồn, và trang không cần năm.
- Các câu lượt 1 đã sửa mà lượt 2 `dung`: review đọc lại chữ trang, khớp câu.

### Dữ liệu (`src/data/tac-pham.yml`, trường chưa khóa)

| Bản ghi | Trường | Đổi |
|---|---|---|
| `chopin-nocturne-op9-2` | Sáng tác (n18) | "in tháng 12 năm 1832" thành "in khoảng 1832–1833". Hai nguồn bậc 2 lệch nhau: Ấn bản Quốc gia Ba Lan ghi 12/1832, NIFC ghi 1833. Viết chung theo IMSLP (`chuan-kiem-dinh.md` mục 2). |
| `debussy-clair-de-lune` | Độ khó (n22) | thêm danh sách ARSM (trên) |
| `debussy-clair-de-lune` | `thoi_ky` (n9) | "Ấn tượng" thành "Cuối thế kỷ 19" (xem dưới) |
| `beethoven-pathetique` | `thoi_ky` (n4) | "Cổ điển → Lãng mạn" thành "Cổ điển" (xem dưới) |

- **`thoi_ky`** không hiện trên trang nào, nên không có `doi_chu`. Chọn cho nhất quán:
  - `beethoven-pathetique` thành "Cổ điển":
    - IMSLP ghi "Classical";
    - hướng dẫn nghe này ghi "Cổ điển, giai đoạn đầu của Beethoven";
    - `pathetique-adagio`, `beethoven-anh-trang` (Op. 27, viết sau Op. 13) và hướng dẫn nghe *Ánh trăng* (D6-L4) đều ghi "Cổ điển".

    `beethoven-5` (ngoài lô) còn ghi "Cổ điển → Lãng mạn".
  - `debussy-clair-de-lune` thành "Cuối thế kỷ 19":
    - bài viết năm 1890 (Henle HN 381);
    - IMSLP ghi "Romantic"; Henle nói hòa âm của bài còn "conventional";
    - nhãn cùng kiểu với `satie-gymnopedie` (1888);
    - trang bài học viết bài "ở ngưỡng giữa thế kỷ 19 và thế kỷ 20".

    `debussy-preludes` (1909–1913) giữ "Ấn tượng".
- `bach-prelude-fugue-do-thu` n18 (Simrock): review mở blog Henle (Oppermann, 31/10/2022): "Around 1800, three firms – Hans Georg Nägeli (Zurich), Nikolaus Simrock (Bonn) and the Bureau de Musique Hoffmeister & Kühnel (Vienna/Leipzig) – published in direct competition editions of the WTC I". Câu đúng; giữ.
- Các câu còn lại (bach n21, n24; chopin n22; debussy n24; pathetique-adagio n19, n24, n25): `dung`. Nguồn ấn bản Bärenreiter, Wiener Urtext lấy từ trang bán lẻ, như D6-L3 và D6-L4.
- `xuat du-lieu/tac-pham/<6 slug> --con-lai`: 0 câu.

### doi_chu

Mọi chỗ đổi chữ trên trang và trong dữ liệu đều có `doi_chu`: 10 mục mới, 4 mục cũ cập nhật `moi` và `ly_do`. `so-chu.mjs --doi-chu` báo đủ, trừ dòng "*Chỉ muốn nghe?*" của Nocturne và *Clair de lune*. Dòng ấy chỉ dời chỗ, như `d6-l5.md` mục 1 đã ghi; `tests/chuyen.test.mjs` đạt.

Hồ sơ được ghi lại bằng ruamel.yaml. Cách viết YAML đổi ở vài chỗ (dấu nháy, mảng một dòng), nội dung giữ nguyên.

## Lượt 2 bổ sung

`d6-l5-gom/bo-sung.yml` (`node tools/khoa.mjs xuat D6-L5 --con-lai`) có 5 câu. Kết quả lượt 2 cũ, nếu có, đã gỡ và ghi lại trong `ghi_chu`.

| Câu | Vì sao |
|---|---|
| `nghe-nhac/schubert-impromptu` n1 | đổi từ `ve-site` sang `nam` |
| `piano/tac-pham/debussy-clair-de-lune` n46 | viết lại, nguồn mới (Askenfelt, Goebl 2004) |
| `piano/tac-pham/debussy-clair-de-lune` n74 | thêm người kể (Long), nguồn mới (Grayson 2014) |
| `piano/tac-pham/debussy-clair-de-lune` n93 | câu mới tách từ n83 |
| `piano/tac-pham/pathetique-adagio` n73 | chữ mới về độ dài dấu luyến |

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua (kiểm thử phạm vi của nhánh lô và nhánh `them/`), 0 hỏng.
- `loiHoSo` (`tools/khoa.mjs`) chạy trên 13 hồ sơ: chỉ còn các lỗi về lượt 2 bổ sung, người làm lượt 2 và mẫu kiểm.

## Chủ repo cần biết

- **Mốc dòng 3 của `nghe-nhac/schubert-impromptu`** (66 giây): chưa sửa. Review không đo được, vì máy chưa có `.venv-audio` cho `tools/audio/align/` và review không nghe bản thu. Lượt 1 ước theo tốc độ bản thu: ô 24 ở khoảng 92–95 giây. Đo xong thì chạy `python3 tools/audio/attach.py schubert-impromptu-sol-giang --ref "1 33 <giây> 99 114 209 219 301" --trang nghe-nhac/schubert-impromptu`.
- **Grade đã khóa của Nocturne Op. 9 số 2** ("Grade 7"): thấp hơn nguồn (RCM Level 9, Henle mức 6; ABRSM không xếp bài). Chip vẫn ghi "≈ Grade 7". Không sửa; muốn sửa phải mở khóa `grade`.
- **"Sau Grade 8" ở dòng Học tiếp của *Clair de lune***: `grade` đã khóa của Liebestraum là "Grade 8 trở lên", của Ballade số 1 là "Sau Grade 8". Lệch nhỏ, chưa sửa.
- **Lưu ý của agent con** (câu vẫn đúng, không sửa):
  - `debussy-clair-de-lune` n61: "mỗi ô tay trái là một vòng cung" chỉ đúng ở ô 1–3; ô 4 là nốt kết.
  - `schubert-impromptu-sol-giang` n61: "nhịp 4/2 với móc đơn chùm sáu" không đúng cho bài tập 3 (khối 4, láy rền móc kép).
  - `chopin-nocturne-op9-2` n9 ("đủ để học kỹ trong hai tháng") gần với `khuyen-tap` hơn.
- **`ghi_chu` lỗi thời**: nhiều câu `ve-site` còn ghi "chưa chuyển, sắp có" cho trang nay đã có ở `src/content/docs/`. Đó là các trang bach-invention-1, schumann-traumerei, beethoven-anh-trang, nghe-nhac/beethoven-moonlight, chopin-valse-si-thu, mendelssohn-thuyen-ca. Review thêm sau các ghi chú ấy kết quả kiểm trên trang mới.
- **Hồ sơ ngoài lô** (không sửa): `chopin-valse-la-thu` n67 (đã khóa) dẫn câu "ít trang trí hơn" của trang Nocturne cũ, như `d6-l5.md` đã ghi. Câu n67 vẫn đúng theo bản nhạc.
- **Còn trống** trong lần kiểm định cuối của 13 hồ sơ: `nguoi.luot_2` và `nguoi.kiem_mau`.
- **Mạng**: mọi yêu cầu của review dùng User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`: blog Henle, Mutopia `pathetique-2.ly`, Forsyths, bài Grayson và một trang khác trên cambridge.org. Thêm hai lượt tìm kiếm trên web. Không vòng chặn. Agent con không dùng mạng.

## Lượt 2 bổ sung và trạng thái khóa (người gom)

- Lượt 2 bổ sung (Claude Opus 5.5): `ket-qua-bo-sung.yml` 4 dung (`nghe-nhac/schubert-impromptu` n1; `debussy-clair-de-lune` n46, n74; `pathetique-adagio` n73), 1 khong-chac (`debussy-clair-de-lune` n93: Liebestraum số 3 không có nguồn ABRSM sau Grade 8, chỉ Henle mức 7; Ballade số 1 có trong danh sách LRSM 2023); đã `nhap`.
- Người gom: dòng Học tiếp "Sau Grade 8" đổi thành "Chặng 7" (đúng `chang` đã khóa của hai bản ghi, n83 đã kiểm), n93 `da-bo`, `doi_chu`. Không cần chạy lại lượt 2 (chỉ bỏ vế lượt 2 không xác nhận).
- Đã điền `nguoi.luot_2` cho 13 hồ sơ (7 trang, 6 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l5-gom/kiem-mau.yml` (`xuat D6-L5 --mau 8`).
- Chủ repo: `grade` đã khóa của `liszt-liebestraum` ("Grade 8 trở lên") chưa có nguồn ABRSM; xem lại ở D6-L6 hay khi mở khóa.
