# D6-L6-gom: lượt 2 và review

Nhánh `moi/d6-l6-gom`, review ngày 06/11/2026, Claude Opus 5.5 (không làm lượt 1, lượt 2). Một agent con (Claude Opus 5.5, chỉ đọc, không dùng mạng) kiểm các câu `ve-site`. Không khóa gì, không commit.

## Lượt 2 (số liệu)

Kết quả thô ở `d6-l6-gom/ket-qua-*.yml`, đã nhập vào hồ sơ (`node tools/khoa.mjs nhap`). Danh sách cần review: `d6-l6-gom/can-review-*.txt`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (chopin-ballade-1, chopin-fantaisie-impromptu) | 116 | 111 | 0 | 5 | 31 |
| Trang, phần 2 (liszt-liebestraum, nghe-nhac/liszt-liebestraum) | 102 | 96 | 5 | 1 | 30 |
| Dữ liệu (3 bản ghi, lần 2) | 73 | 72 | 0 | 1 | 17 |
| **Cộng** | **291** | **279** | **5** | **7** | **78** |

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L6-gom: …". Mọi câu đã review có `review: dung`. Lần kiểm định cuối của 7 hồ sơ (4 trang, 3 bản ghi) có `nguoi.review`.

### Câu về chính site (51 câu)

Agent con kiểm trên chữ trang, các khối abc soạn cho trang (đủ phách, ngón, nốt), link (trang đích có ở `src/content/docs/` hay thành "sắp có"), và chặng, `hinh` trong `tac-pham.yml`.

Kết quả: 51 đúng, 0 sai, 0 nhãn sai.

Ghi chú lỗi thời được bổ sung kết quả kiểm trên trang mới:
- Ballade n10, n77; Fantaisie-Impromptu n9, n81; Liebestraum n7, n93; hướng dẫn nghe n24: lượt 1 ghi "chưa chuyển", nhưng trang đích nay đã có (chuyển ở D6-L5).
- Ballade n78 và Fantaisie-Impromptu n79 dẫn bản thu Commons hay Henle: nay kiểm trên trang của site (`piano/lo-trinh`, trang Ballade).

### Số ô của Liebestraum (lượt 2 phần trang: n38, n44, n46, n47, n61 sai)

Review đếm lại trên bản in đầu Kistner: BSB `bsb00051595` (ảnh IIIF tr. 17–22). Bản `bsb11307527` của lượt 1 là cùng bản khắc, số bản in 1751/6847, xếp trang giống hệt. Kết quả: **85 ô**.

| Trang | Ô |
|---|---|
| 17 | 1–14 |
| 18 | 15–23; ô 24 (dẫn vào); cadenza 1 = ô 25, không chia vạch nhịp, trải hai dòng, kết bằng vạch kép |
| 19 | 26 (*Più animato con passione*) – 40; *sempre stringendo* ở ô 37 |
| 20 | 41–55 (*appassionato assai* ở ô 50) |
| 21 | ô 56–58 (*affrettando*); **ô 59**: chuỗi nốt hai tay *dimin.*, không chia vạch nhịp, có vạch nhịp ở cuối dòng; **ô 60**: cadenza *leggiero*, tới vạch nhịp trước Tempo primo; Tempo primo ô 61; 61–65 |
| 22 | 66–85 (dòng cuối có 7 ô, 79–85) |

- Lượt 2 phần trang gộp ô 59 và ô 60 nên ra 84 ô. Lượt 2 phần dữ liệu và lượt 1 đều đếm 85.
- Lời bình Henle HN 634 chỉ nêu số ô đến ô 53 (ô 13–14, 28, 44, 51, 53), nên không phân định được hai cách đếm. PTNA cũng ghi Tempo I ở ô 61 và hết bài ở ô 85.
- **Quy ước chọn:** đếm theo bản in đầu, không tính nốt lấy đà; mỗi khúc không chia vạch nhịp nằm giữa hai vạch nhịp tính là một ô.
- Giữ n38, n44, n46, n61 và mọi số ô của hai trang, `hinh` và kế hoạch tập. Ghi chú cách đếm trên trang bài học (n47) và ghi chú của `hinh.bai-hoc` (dữ liệu n31) nói "mỗi cadenza một ô (25, 60)", bỏ sót ô 59, cũng chính là chỗ lượt 2 đếm lệch. Hai ghi chú này được viết lại cho rõ ô 59. Bỏ vế "tức đếm cadenza thứ nhất thành hai ô" vì PTNA vẫn đặt *stringendo* ở ô 37.
- Mốc nghe: hai trang không có mốc tham khảo theo số ô (`::khoi-nghe` không có `moc`), nên không có gì phải sửa.
- Nguồn `kistner-1850` (ở 3 hồ sơ) ghi thêm bản số hóa `bsb00051595`.

### Câu lượt 2 `khong-chac` và câu cần nguồn

| Câu | Quyết định |
|---|---|
| Ballade n37, n68 (sắc thái đầu coda) | Review xem ảnh bản in Pháp đầu (CFEO tr. 12): coda có ₵ ở hai khuông và *fz* ở hợp âm đầu; *ff* là của Klindworth. Hai bảng: "hợp âm *ff*" thành "hợp âm nhấn *fz*". Mục Âm thanh ghi rõ cả hai: "bản in đầu chỉ ghi *fz* …; ấn bản Klindworth ghi *ff* …". Thêm nguồn `cfeo-op23` (bậc 1). Không chạy lại, vì đây là điều lượt 2 đã kiểm. |
| Ballade n38, dữ liệu n18 (coda 2/2) | Lượt 2 và review đều thấy ₵ ở bản in đầu: `dung`. |
| Fantaisie-Impromptu n69, dữ liệu n8, n11, n18 (2/2) | Lượt 2: bản in Pháp đầu (Meissonnier 1856, CFEO) ghi ₵, nốt trắng = 84; Henle "GE gives C instead of ₵". `dung`. Mục có điều kiện của `sua-A.yml` không áp. Thêm nguồn `cfeo-op66` ở hồ sơ bản ghi. |
| Ballade n26 (Rubinstein "tự nhiên") | Giữ bỏ. |
| Fantaisie-Impromptu n18, n85, dữ liệu n17 (năm 1962, "Chopin không cho in") | Danh mục thư viện Hope (nguồn lượt 1 cho năm 1962) nay chặn máy bằng trang kiểm tra robot; review không vòng, và chưa có nguồn khác. Bỏ "in năm 1962" ở trang (mục Bối cảnh, đáp án câu hỏi 4) và dữ liệu. Ở dữ liệu, "Chopin không cho in" thành "chỉ được in sau khi Chopin mất" (Henle: "only published after the composer's death"). Trang (n13) giữ "ông không cho in": lượt 2 `dung`, và Niecks (lượt 2, n14) có ý ấy. Chỉ bỏ vế lượt 2 không xác nhận, nên không chạy lại. |
| Fantaisie-Impromptu n19, n73, n14 | Giữ bỏ: n19 chỉ có một vế có nguồn (NIFC); n73 chưa mở được Eigeldinger; n14 trang không cần. |
| Fantaisie-Impromptu n50 ("liên tục đi xuống") | Theo ghi chú lượt 2: "đi xuống rồi xoay quanh Sol♯". Không chạy lại. |
| Fantaisie-Impromptu n56 (20/10 phút) | Review mở BAPAM, *The Healthy Pianist*: "Practise in twenty minute sessions, interspersed with ten minute breaks". Con số có nguồn; giữ. |
| Ballade n54, n83 ("không quá 10–15 phút liền") | Con số không có trong nguồn. Viết theo BAPAM: "từng đợt khoảng 20 phút, xen 10 phút nghỉ" (câu hỏi 4: "từng đợt khoảng 20 phút xen nghỉ"). Vào lượt 2 bổ sung. |
| Hướng dẫn nghe n21 ("chậm, ủy mị") | Giữ bỏ. |
| Hướng dẫn nghe n56 ("sau Grade 8") | Không có nguồn ABRSM cho bài số 3. Dòng trang đổi thành "Liebestraum số 3 thuộc chặng 7; Henle xếp bài ở mức 7 trên thang 9 ("khó")", như cách làm với *Clair de lune* ở D6-L5-gom. Mức Henle lượt 2 đã xác nhận ở bài học n24 và dữ liệu n22, nên không chạy lại. |
| Các câu lượt 1 đã sửa mà lượt 2 `dung` | Review đọc lại chữ trang và dữ liệu: khớp câu. |

### Soát nhãn

- Câu `ve-site` không chứa điều cần nguồn ngoài (agent con và review).
- Câu `khuyen-tap` không chứa điều về sức khỏe. Ba câu có chữ "cổ tay mềm", "nghỉ", "căng ngón" (Ballade n59, Fantaisie-Impromptu n77, Liebestraum n62) chỉ nói về kỹ thuật; điều về sức khỏe nằm ở các câu `quy-tac` có nguồn BAPAM.
- Ballade n73, Fantaisie-Impromptu n75, Liebestraum n76 (`khuyen-tap`): lượt 1 ghi `da-sua` mà không có nguồn, nên công cụ khóa báo thiếu nguồn. Đổi thành `khong-can-nguon`.

### Chỗ sửa trang và dữ liệu

| File | Đổi |
|---|---|
| `piano/tac-pham/chopin-ballade-1.md` | Hai bảng: "hợp âm nhấn *fz*"; mục Âm thanh: thêm *fz* của bản in đầu; Chỗ khó và câu hỏi 4: 20 phút / 10 phút theo BAPAM |
| `piano/tac-pham/chopin-fantaisie-impromptu.md` | Bỏ "in năm 1962" (Bối cảnh, câu hỏi 4); Chỗ khó: "đi xuống rồi xoay quanh Sol♯" |
| `piano/tac-pham/liszt-liebestraum.md` | Ghi chú cách đếm ô (ô 59) |
| `nghe-nhac/liszt-liebestraum.md` | "chặng 7 (≈ sau Grade 8)" thành "chặng 7; Henle xếp bài ở mức 7 trên thang 9 ("khó")" |
| `src/data/tac-pham.yml` | `chopin-fantaisie-impromptu` Sáng tác / xuất bản (bỏ 1962; "chỉ được in sau khi Chopin mất"); `liszt-liebestraum` `hinh.bai-hoc` `ghi_chu` (ô 59) |

- Đều là trường và trang chưa khóa.
- Mọi chỗ đổi có `doi_chu`: 8 mục cũ cập nhật `moi` và `ly_do`, 4 mục mới. `so-chu.mjs --doi-chu` báo đủ ở cả 4 trang.
- Hồ sơ được ghi lại bằng ruamel.yaml. Cách viết YAML đổi ở vài chỗ (dấu nháy, khoảng trắng trong mảng một dòng); nội dung giữ nguyên.

## Lượt 2 bổ sung

`d6-l6-gom/bo-sung.yml` (`xuat D6-L6 --con-lai`, cộng `xuat du-lieu/tac-pham/<3 slug> --con-lai`) có 4 câu. Kết quả lượt 2 cũ đã gỡ và ghi lại trong `ghi_chu`.

| Câu | Vì sao |
|---|---|
| `piano/tac-pham/chopin-ballade-1` n54 | con số mới theo BAPAM (20/10 phút) |
| `piano/tac-pham/chopin-ballade-1` n83 | như n54 (câu hỏi 4) |
| `piano/tac-pham/liszt-liebestraum` n47 | ghi chú cách đếm viết lại (ô 59) |
| `du-lieu/tac-pham/liszt-liebestraum` n31 | ghi chú của `hinh.bai-hoc` viết lại (ô 59) |

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua, 0 hỏng.
- `loiHoSo` chạy trên 7 hồ sơ: chỉ còn lỗi về 4 câu lượt 2 bổ sung, `nguoi.luot_2` và `nguoi.kiem_mau`.

## Chủ repo cần biết

- **Grade đã khóa của `liszt-liebestraum`** ("Grade 8 trở lên"; chip "≈ Grade 8 trở lên") không có nguồn ABRSM. ABRSM chỉ đưa bài số 2 vào danh sách ARSM; Henle xếp bài số 3 mức 7; RCM 2022 xếp ARCT. Chưa sửa; muốn sửa phải mở khóa `grade`.
- **`piano/lo-trinh` n37** (đã khóa): ghi Fantaisie-Impromptu và Liebestraum "trong khuôn khổ khoảng năm phút". Liebestraum dài khoảng 4–5 phút (ba bản thu Commons dài 3:58–4:43). Lệch nhỏ, chưa sửa.
- **Hồ sơ ngoài lô** (không sửa):
  - `piano/quang-tam-buoc-nhay` n47 (đã khóa): "Fantaisie-Impromptu ô 7 và ô 37–40; Liebestraum số 3 ô 37–60". Câu khớp các trang sau review và cách đếm 85 ô.
- **Thuật ngữ** chưa có trong `thuat-ngu.yml`: danh sách ở `d6-l6.md`.
- **Lưu ý nhỏ của agent con** (chưa sửa): `nghe-nhac/liszt-liebestraum` n35 viết "Link …" cho hai chỉ thị (sơ đồ, khối nghe). Ballade n84 và Fantaisie-Impromptu n86 là câu `ve-site` mà `ket_qua` ghi `da-sua`; công cụ khóa chấp nhận.
- **Còn trống** trong lần kiểm định cuối của 7 hồ sơ: `nguoi.luot_2`, `nguoi.kiem_mau`.
- **Mạng**: mọi yêu cầu dùng User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`:
  - BSB IIIF (`bsb00051595` tr. 17–22, `bsb11307527` tr. 21);
  - PDF Bemerkungen của Henle HN 634 và HN 1320;
  - ảnh CFEO tr. 12 của Ballade;
  - BAPAM, *The Healthy Pianist*;
  - danh mục thư viện Hope: bị chặn bằng trang kiểm tra robot, không vòng.

  Agent con không dùng mạng.
