# D6-L7-gom: lượt 2 và review của 8 hướng dẫn nghe và 5 bản ghi

Nhánh `moi/d6-l7-gom`, ngày 06/11/2026. Review: Claude Opus 5.5 (không làm lượt 1 hay lượt 2), cùng 1 agent con (Claude, chỉ đọc repo, không dùng mạng) kiểm câu `ve-site` và đọc lại chữ của các câu đã sửa. Không khóa gì, không push.

## Lượt 2

Danh sách: `d6-l7-nhan-dinh.yml` (trang, chia `d6-l7-gom/trang-1.yml`, `trang-2.yml`) và `d6-l7-nhan-dinh-du-lieu.yml` (`d6-l7-gom/du-lieu.yml`). Kết quả thô: `d6-l7-gom/ket-qua-*.yml`, đã `nhap`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (bach-goldberg, mozart-concerto-21, mozart-k331, scarlatti-sonata) | 149 | 140 | 0 | 9 | 58 |
| Trang, phần 2 (chopin-etude, doc-ten-tac-pham, nghe-gi-tiep, mau) | 119 | 105 | 2 | 12 | 31 |
| Bản ghi (5) | 41 | 40 | 0 | 1 | 5 |
| **Tổng** | **309** | **285** | **2** | **22** | **94** |

Cần review gồm 24 câu lượt 2 `sai` hay `khong-chac`, và 70 câu lượt 1 đã sửa (hay chưa có kết quả) mà lượt 2 ghi `dung`.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L7-gom: …". Mọi câu đã review có `review` (31 câu `ve-site`, 94 câu cần review). Lần kiểm định cuối của 13 hồ sơ (8 trang, 5 bản ghi) có `nguoi.review`.

### Câu về chính site (31 câu)

Agent con kiểm trên chữ trang, link (trang đích có trong `src/content/docs/` hay thành "sắp có" vì có trong `trang.yml`; `#id` có trong bản build), dữ liệu (`cap-do.yml`, chặng và `ban_thu` trong `tac-pham.yml`) và `src/scripts/nghe.js`. Review đọc lại kết quả.

Kết quả: 30 đúng, 1 sai, 0 nhãn sai.

- **`nghe-gi-tiep` n1 sai**: trang (mô tả và câu mở đầu) viết "Mỗi gợi ý giải thích vì sao nó liên quan", nhưng chỉ bảng đầu có cột "Vì sao". Sửa trang thành "Bảng đầu tiên giải thích vì sao từng gợi ý liên quan"; câu sửa theo (`review: sai`, `ket_qua: da-sua`).
- Trang đích vẫn chưa có (hiện "sắp có", hợp lệ): `nghe-nhac/index` (`mau` n1), `nghe-nhac/mozart-40`, `schubert-erlkonig`, `handel-hallelujah`, `puccini-nessun-dorma`.
- Nhãn: không câu nào chứa điều cần nguồn ngoài. Vài vế nhẹ, giữ `ve-site`: `bach-goldberg` n46 ("Sinfonia ba bè"), n48 ("chơi trên piano", đã kiểm ở hồ sơ bản ghi), `mozart-k331` n32 ("chương 1 và chương 3" là lời khuyên đi kèm; mức Henle ở n33).

### Câu lượt 2 `sai` và `khong-chac` (24 câu)

Review mở lại nhiều nguồn lượt 2 không mở được (mUltimate Chopin, lời tựa Henle, BBC Music Magazine, Eastman, Early Music America, Hi-Fi+, Open Music Theory qua Wayback, Treccani, PTNA, Mozarteum, Gramophone qua Wayback).

| Câu | Quyết định |
|---|---|
| `chopin-etude` n8 (độ dài; lượt 2 sai) | Theo câu đúng của lượt 2: số 3 khoảng 3,5–4,5 phút, cả Op. 10 khoảng 27–30 phút (Pollini, Cortot, các bản thu trên IMSLP). Thêm nguồn `mb-pollini-op10`. Không chạy lại. |
| `nghe-gi-tiep` n27 (giao hưởng; lượt 2 sai) | Theo câu đúng: "25–45 phút" (IMSLP: Giao hưởng số 38 của Mozart 25 phút). Không chạy lại. |
| `chopin-etude` n3 (bản thảo số 3, 25/8/1832) | Review mở trang AI trên mUltimate Chopin: "Paris, 25 August [18]32", chữ Chopin. Giữ. |
| `chopin-etude` n4 (in 1833 ở London) | mUltimate Chopin: bản Wessel đầu tiên "not found", có lẽ VIII 1833; bản sớm nhất còn lại 1835–1836; IMSLP khoảng 1834. Viết "in năm 1833 ở Paris và Leipzig, rồi ở London". |
| `chopin-etude` n25 (truyền thuyết số 12, bản chép sạch 1832–1833) | mUltimate Chopin: A "IX 1832-III 1833"; Henle HN 658: "unsubstantiated legend". Giữ. |
| `chopin-etude` n47 (mục Nguồn) | Như n4: "bản in đầu ở Paris, Leipzig (1833) và London". |
| `doc-ten-tac-pham` n24 (Rellstab 1824) | Như review D6-L5-gom ở `beethoven-pathetique` n19: "trong truyện ngắn *Theodor* đăng năm 1824" (Crumey; khớp `beethoven-moonlight` đã khóa). Thêm nguồn `crumey`. |
| `doc-ten-tac-pham` n25 ("Định mệnh") | Lời tựa Henle HN 9813: hình ảnh "probably contrived by Schindler", "the very unfortunate sobriquet Fate Symphony". Giữ. |
| `doc-ten-tac-pham` n38 (mono trước khoảng 1955) | Hi-Fi+: LP đầu là mono; đĩa stereo thương mại đầu tiên 11/1957. Giữ. |
| `doc-ten-tac-pham` n40, n42, n45 (HIP: từ những năm 1970, nhạc cụ, vibrato, tốc độ, tên nghệ sĩ) | BBC Music Magazine (Morrison 2025): "back in the 1970s and '80s … Harnoncourt, Christopher Hogwood and Norrington"; "Vibrato was out of the question"; "old woodwinds, valveless brass instruments and gut fiddles"; "different attitude to speeds … timbre". Gardiner: lượt 2 xác nhận. Giữ. |
| `doc-ten-tac-pham` n41 (A = 415 Hz) | Eastman: "at low pitch (A=415)"; Early Music America: "a baroque orchestra tuned to a' = 415hz". Giữ. |
| `doc-ten-tac-pham` n47 (Gramophone Awards) | Trang gốc 403 với User-Agent của dự án; bản lưu Wayback 2025 mở được. Giữ. |
| `bach-goldberg` n26 (1974) | IMSLP, Hội Bach Hà Lan: 1974; Henle, Bärenreiter: 1975. Viết chung "khoảng năm 1974–1975". Không chạy lại. |
| `mozart-concerto-21` n13 (Giao hưởng số 40) | PTNA: "a motif in the piano part that later appears in Symphony No. 40". Viết lại: "Theo PTNA, một môtip trong phần piano của chương này về sau xuất hiện lại trong Giao hưởng số 40." **Vào lượt 2 bổ sung.** |
| `mozart-concerto-21` n24 (đàn Walter, FF–g''') | Tách hai vế: Mozart chơi đàn Walter của mình ở các buổi hòa nhạc tại Vienna (Mozarteum); âm vực nói về "đàn kiểu Walter" (Tafelmusik), như `mozart-k545` n21 đã khóa. Thêm nguồn `mozarteum-fp`. Không chạy lại. |
| `scarlatti-sonata` n12 (Kirkpatrick, thứ tự thời gian, Venice) | Treccani: "tentativi di ordinamento cronologico (Kirkpatrick, 1953 …)". Vế "dựa vào thứ tự các tập chép tay ở Venice" không thấy trong PDF Henle HN 581: bỏ. |
| `scarlatti-sonata` n14 (hai đoạn, "vần") | Thêm "phần lớn" (Hyperion: "the great majority"). Vế "vần": Open Music Theory, Binary Form, mục balanced (Wayback 2024, như lượt 2 phần dữ liệu): chất liệu cuối nửa đầu trở lại cuối nửa sau ở giọng chính, ví dụ Scarlatti K. 322. Thêm nguồn `omt-binary`. |
| `scarlatti-sonata` n15 (crux của Kirkpatrick) | OMT định nghĩa "crux point" nhưng không nói của Kirkpatrick. Bỏ tên Kirkpatrick: "Điểm ở nửa sau mà từ đó đoạn "vần" bắt đầu gọi là **crux**." |
| `scarlatti-sonata` n29 (K. 380, nửa sau) | Không có bản nhạc nửa sau. Cách kiểm ghi ở hồ sơ: OMT và phân tích bản thu Smullyan của lượt 2 (đoạn cuối lặp lại chất liệu giây 67–77, dịch quãng năm), mốc 88 giây do `run.py` căn. Bỏ "đi qua các giọng xa", viết "rời giọng chính". |
| `scarlatti-sonata` n30, n31 (K. 141, K. 466, phần cuối) | Phần cuối bản nhạc không đọc được. Viết theo hình thức hai đoạn (OMT: bắt đầu và kết cùng giọng): "nửa sau trở về giọng chính để kết / để khép lại"; bỏ "mạnh mẽ", "lặng lẽ". |
| Dữ liệu `mozart-concerto-21` n10 ("cadenza ngắn") | Theo lượt 2: "có chỗ cadenza" (NMA chỉ đánh dấu chỗ cadenza). |

Các câu chỉ bỏ vế lượt 2 không xác nhận, viết chung hai năm lượt 2 đã thấy, hay theo câu đúng của lượt 2, nên không chạy lại.

### Câu lượt 1 đã sửa mà lượt 2 `dung` (70 câu)

Agent con đọc lại chữ trang và dữ liệu: cả 70 câu khớp, không còn chữ cũ đã bỏ (đã grep siciliana, sarabande, viên ngọc, thất lạc, L'Adieu…). Năm chỗ trang có thêm một cụm mà câu không nói; review xét từng chỗ, ghi ở `ghi_chu`, không sửa:
- `bach-goldberg` n37 "bùng nổ kỹ thuật:", `scarlatti-sonata` n22 "Một bản trình diễn kỹ thuật thật sự:": nhãn mô tả chung, dẫn vào các chi tiết đã kiểm;
- `chopin-etude` n12 "có giai điệu, hòa âm và kịch tính": diễn giải "tác phẩm trọn vẹn";
- `chopin-etude` n17 "Ông chỉ đánh số và ghi tốc độ": khớp lượt 2 (bản in đầu chỉ ghi "Etude No. 3" và chữ tốc độ);
- `chopin-etude` n18 "Chopin mới đổi": mUltimate Chopin ghi Chopin sửa các chỉ dẫn khi duyệt bản in Pháp.

Dữ liệu: `scarlatti-sonata` n8 (lượt 1 chưa chắc, lượt 2 `dung` theo OMT): `ket_qua: dung`, nguồn `omt-binary`. Ghi chú hình giữ chữ crux vì không ghi tên Kirkpatrick, nên mục có điều kiện của `d6-l7/sua-A.yml` không áp.

### Soát nhãn

- Không câu `ve-site` nào chứa điều cần nguồn ngoài.
- Không câu `khuyen-tap` nào trong 94 câu cần review. Lời khuyên tập của 8 trang không nói về sức khỏe (đau, chấn thương, thính lực).

### Chỗ sửa trang và dữ liệu

| File | Đổi |
|---|---|
| `nghe-nhac/bach-goldberg.md` | "khoảng năm 1974–1975" |
| `nghe-nhac/chopin-etude.md` | Bảng: in "ở Paris và Leipzig, rồi ở London"; độ dài 3,5–4,5 / 27–30 phút; mục Nguồn: "Paris, Leipzig (1833) và London" |
| `nghe-nhac/doc-ten-tac-pham.md` | "trong truyện ngắn *Theodor* đăng năm 1824" |
| `nghe-nhac/mozart-concerto-21.md` | Câu Giao hưởng số 40 theo PTNA; câu đàn Walter tách hai vế |
| `nghe-nhac/nghe-gi-tiep.md` | Mô tả và câu mở đầu ("Bảng đầu tiên giải thích…"); "25–45 phút" |
| `nghe-nhac/scarlatti-sonata.md` | Bỏ vế Venice; "phần lớn ở hình thức hai đoạn"; câu crux bỏ tên Kirkpatrick; ba dòng "Theo dõi khi nghe" (K. 380, K. 141, K. 466) |
| `src/data/tac-pham.yml` | `mozart-concerto-21` `hinh.nghe` ô chương 3: "có chỗ cadenza" |

- Đều là trang và trường chưa khóa.
- Mọi chỗ đổi có `doi_chu`: 7 mục cũ cập nhật `moi` hay `ly_do`, 9 mục mới. `so-chu.mjs --doi-chu` báo đủ ở cả 6 trang có đổi.
- Hồ sơ ghi lại bằng ruamel.yaml, giữ nguyên cách viết YAML (đọc rồi ghi lại không đổi byte nào trước khi sửa).
- Bản vá `d6-l7/agents-md.patch` còn đúng với mã (lớp `oz-anatomy`, `role="img"`, sáu `span` `p1`–`p6` trong `doc-ten-tac-pham`; CSS ở `thanh-phan.css`): đã áp vào `AGENTS.md`.

## Lượt 2 bổ sung

`d6-l7-gom/bo-sung.yml` (`node tools/khoa.mjs xuat D6-L7 --con-lai`): 1 câu. Kết quả lượt 2 cũ đã gỡ và ghi lại trong `ghi_chu`.

| Câu | Vì sao |
|---|---|
| `nghe-nhac/mozart-concerto-21` n13 | Vế Giao hưởng số 40 viết lại theo PTNA (nội dung mới: môtip của phần piano về sau xuất hiện trong Giao hưởng số 40) |

Bản ghi: không có câu bổ sung.

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua, 0 hỏng.
- `loiHoSo` trên 13 hồ sơ: chỉ còn `nguoi.luot_2`, `nguoi.kiem_mau` và câu lượt 2 bổ sung (`mozart-concerto-21` n13).

## Chủ repo cần biết

- **Mốc chưa đo** (cần người nghe bản thu đo tay, ghi bằng `attach.py --ref`): `mozart-concerto-21` dòng 10 (cadenza chương 3); `scarlatti-sonata` dòng 2 (môtip mới của K. 380). Dòng 3 của K. 380 (nhắc lại) để trống vì Smullyan không chơi dấu nhắc lại; K. 141, K. 466 không có bản thu.
- **Phần cuối ba sonata Scarlatti** chưa đối chiếu được trên bản nhạc: Commons chỉ có trang đầu bản chép tay, Mutopia không có, PDF trên IMSLP chặn bot. Ba dòng "Theo dõi khi nghe" đã viết theo nguyên tắc chung của hình thức hai đoạn. Có bản in tự do (như Longo trên Internet Archive) thì nên đối chiếu lại.
- **"Sarabande" ở Aria Goldberg**: lượt 2 cũng không tìm được nguồn; giữ bỏ ở trang và dữ liệu.
- **Nút chép của khối mã** (`nghe-nhac/mau`): chữ tiếng Anh mặc định của Expressive Code ("Copy to clipboard"); dịch ở việc riêng (cấu hình `astro.config.mjs`).
- **Lưu ý của lượt 2, không đổi câu**: `bach-goldberg` n3 (NBA: năm in có thể 1741/42; trang theo trang bìa 1741); `mozart-concerto-21` n32, n33 (Perahia thu 1976, Bilson thu 1986; trang ghi năm phát hành 1978, 1987).
- **`ghi_chu` lỗi thời ở hồ sơ khác**: nhiều câu `ve-site` trỏ tới trang của lô còn ghi "chưa chuyển" (`d6-l7.md` mục 7); không sửa (ngoài lô).
- **Thuật ngữ** chưa có trong `thuat-ngu.yml`: danh sách ở `d6-l7.md`; thêm "crux" (nay định nghĩa theo Open Music Theory).
- **Còn trống** trong lần kiểm định cuối của 13 hồ sơ: `nguoi.luot_2`, `nguoi.kiem_mau`.
- **Mạng**: mọi yêu cầu dùng User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`:
  - mUltimate Chopin (trang edition và trang nguồn của Op. 10 số 3, số 12); Henle (trang HN 658, PDF HN 9813, HN 581); Crumey;
  - BBC Music Magazine, Eastman, Early Music America, Hi-Fi+; Gramophone (403; bản lưu Wayback mở được);
  - PTNA 275; Mozarteum, Tafelmusik; Treccani;
  - Open Music Theory: trang gốc và bản lưu 2025 trả 403, bản lưu 2024 mở được (không vòng chặn);
  - Wikimedia Commons (API tìm ảnh chép tay Scarlatti); GitHub API (thư mục Scarlatti của Mutopia); một lần tìm qua html.duckduckgo.com (không có kết quả dùng được).

  Agent con không dùng mạng.
