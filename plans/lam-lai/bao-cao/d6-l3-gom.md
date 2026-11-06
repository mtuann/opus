# D6-L3, nhánh gom: review (chờ lượt 2 bổ sung, kiểm mẫu và khóa)

Nhánh `moi/d6-l3-gom`, 05/11/2026. Lô D6-L3 gồm 7 bài học tác phẩm chặng 4 (`piano/tac-pham/bach-prelude-do`, `beethoven-op49-2`, `chopin-prelude-la-truong`, `chopin-prelude-mi-thu`, `fur-elise`, `grieg-arietta`, `satie-gymnopedie`) và 7 bản ghi tác phẩm (lần kiểm định 2, trường chưa khóa).

- Chủ repo giao agent làm theo đề xuất, review sau.
- Người review: Claude Opus 5.5. Người này không làm lượt 1 hay lượt 2 của lô.
- Một agent con Claude Opus 5.5 kiểm 102 câu `ve-site` trên trang, khối abc và dữ liệu, không sửa repo; review đọc kết quả rồi ghi vào hồ sơ. Review tự mở lại các nguồn dùng để quyết định (Mutopia, Project Gutenberg, Wikisource), User-Agent `opus-kiem-dinh/1.0`.
- Không khóa gì. Làm theo cách của `d6-l2-gom.md`.

## Lượt 2

Kết quả lượt 2 đã nhập ở commit trước (`d6-l3-gom/ket-qua-*.yml`). Danh sách cần review: `can-review-{trang-1,trang-2,trang-3,du-lieu}.txt`.

| Phần | Câu | dung | sai | khong-chac |
|---|---|---|---|---|
| Trang | 458 | 439 | 9 | 10 |
| Bản ghi | 148 | 140 | 0 | 8 |

Cần review: trang 91 câu (lượt 1 da-sua, da-bo hay chưa có kết quả, hoặc lượt 2 sai, khong-chac), bản ghi 27 câu.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, mở đầu bằng "Review D6-L3-gom: …". Mọi câu đã review có `review: dung`. Lần kiểm định cuối của 14 hồ sơ có `nguoi.review`.

### Câu về chính site (102 câu)

Đã kiểm trên trang `.md`, khối abc soạn cho trang (từng ô: giọng, nốt, ngón, dấu nối), link (trang đích ở `src/content/docs/`, hay ở `../opus-zero/docs/` khi chưa chuyển; `#mục` theo id kiểu cũ), `tac-pham.yml`, `cap-do.yml`, `src/scripts/nghe.js`. Kết quả: 102 đúng, 0 sai, 0 nhãn sai.

Thêm một câu `ve-site` mới: `bach-prelude-do` n13 (trước là `cap-do`, xem dưới).

Ba câu đúng nhưng đáng ghi:
- `beethoven-op49-2` n80 (bài tập 1, ô 2): chỉ nốt móc đơn thứ nhất rơi giữa hai nốt tay trái; câu đúng với cách đếm "và".
- `chopin-prelude-la-truong` n83 ("sau đó là Prélude Si thứ, số 6") và `grieg-arietta` n81 ("một năm sau Op. 12"): phần cần nguồn đã có nguồn ở n18, n20 của cùng hồ sơ.

Soát nhãn:
- `bach-prelude-do` n57: vế "ngón 4 và 5 yếu hơn" không có nguồn ở cả hai lượt; bỏ vế ấy, phần còn lại là kinh nghiệm dạy đàn, đổi sang `khuyen-tap`. Không có yếu tố sức khỏe.
- `bach-prelude-do` n13: bỏ so sánh "nhẹ nhàng hơn" (Henle xếp cả hai bài mức 1), còn điều về site: "Minuet Sol trưởng ở chặng 2 là bước đệm"; đổi sang `ve-site`.
- `grieg-arietta` n80: "(khoảng Grade 6)" của Träumerei thành "(chặng 5)"; đổi sang `cau-truc`.
- Không câu `khuyen-tap` nào chứa điều về sức khỏe. Ba câu có yếu tố mỏi tay đã ở loại `quy-tac` từ lượt 1 (op49 n75; fur-elise n55, n77).

### Chín câu lượt 2 ghi `sai`

Review tự kiểm cả chín câu trên bản nhạc. Lượt 2 đúng ở cả chín; trang sửa theo câu đúng của lượt 2 nên không chạy lại.

| Câu | Kiểm |
|---|---|
| `satie-gymnopedie` n30, n38 | Mutopia `gymnopedie_1.ly`: câu 1 và câu 2 mở ở Fa♯5–La5. Đoạn giữa bắt đầu ở La4–Si4–Đô5 (ô 22), đỉnh La5 ở ô 28 chỉ bằng đỉnh câu 1. "Lên cao hơn" thành "đi lên từng bậc (từ La4 tới La5)". |
| `beethoven-op49-2` n60, n107 | Mutopia `LVB_Sonate_49no2_1.ly`, ô 15–19: tay trái rải Rê–Fa♯–La xen Rê–Sol–Si trên nốt Rê trầm, tay phải có Đô♮. Đây là âm át ngân trong Sol trưởng, và ô 20 là nửa kết ở giọng chủ. Rê trưởng chỉ đến khi chủ đề 2 vào ở ô 21. Đã viết lại đoạn "Điều đáng chú ý nhất" và lời giải thích câu hỏi 2. |
| `beethoven-op49-2` n92 | Ô 2 `g'4 g'( fis' g')`: ba nốt sau có dấu luyến. Giai điệu không luyến là ô 3–4. |
| `chopin-prelude-la-truong` n9 | Ô 11–14 bàn đạp đổi mỗi ô. Thêm vế này ở mục "Vì sao nên học". |
| `chopin-prelude-la-truong` n34, n73 | Xem mục dưới. |
| `grieg-arietta` n4 | Bản Schirmer 1899: mỗi nhóm bốn móc kép chia cho hai tay. Ghi chú của lượt 1 cũng nói vậy. |

### Ô 12 của Prélude La trưởng không có dấu rải

Lượt 2 đọc ảnh PDF của Mutopia 470 và bình chú Henle: dấu ngoặc bên trái hợp âm tay phải ở ô 12 là ngoặc số ngón. Henle ghi: "[ 1 for the third interval a♯1/c♯2".

Review mở tệp `.ly` của Mutopia 470. Ô 12 viết `\arpeggioBracket … <as, cs-1>2\)\arpeggio`, tức một dấu ngoặc kèm số ngón 1, không phải dấu rải. Lượt 1 đã đọc nhầm lệnh `\arpeggio` thành dấu rải. Vì vậy mọi chỗ trên trang coi ô 12 là "hợp âm rải" đều được viết lại cho thống nhất:
- **Viết lại (da-sua):**
  - n34 (bảng Theo dõi khi nghe và bảng Cấu trúc): "hợp âm lớn nhất bài ở ô 12";
  - n4 (câu mở đầu): "chơi một hợp âm thật lớn";
  - mục Vì sao nên học: "Một hợp âm thật lớn";
  - n26 (câu hỏi khi nghe): "đánh cùng lúc hay rải";
  - n55 (hàng Chỗ khó);
  - n64 (kế hoạch tập, dòng tự kiểm);
  - n69;
  - n80: bỏ "cách ghi dấu rải ở ô 12";
  - n90 (câu hỏi 3).
- **Mục "Hợp âm ở ô 12"** (giữ id cũ `hop-am-rai-o-o-12`): bản Peters không ghi dấu rải. Tay với tới quãng mười thì đánh cùng lúc, tay nhỏ thì rải nhanh từ dưới lên; dù chơi cách nào, Đô♯6 hát rõ nhất.
- **Bỏ (da-bo):**
  - n73 (quy tắc rải của Ấn bản Quốc gia): không áp cho chỗ không có dấu rải. Lượt 2 cũng chỉ ra câu chỉ nói một nửa quy tắc (tay trái rải trước phách).
  - n75 (hai cách ghi dấu rải): không có nguồn.
- **Giữ:**
  - bài tập 3 "Hợp âm rải lớn": ví dụ soạn, rải hợp âm ô 2;
  - "ai rải hợp âm ô 12 chậm nhất" khi so bản thu (n28);
  - "rải như harp" ở lỗi thường gặp (n82).

### Câu `khong-chac` và câu lượt 1 chưa có kết quả

- **Bach BWV 846:**
  - n32: thêm ngoại lệ mà chính Schiff nêu: "trừ đoạn cuối fugue La thứ của quyển 1".
  - Bản ghi n19: bỏ "và ngắn hơn".
  - Bản ghi n21: bỏ "(thường ♩ ≈ 60–72)", vì không có nguồn; bốn bản thu đo được từ ♩ ≈ 52 đến 78.
  - Bản ghi n26: Bärenreiter và danh mục Wiener Urtext (IMSLP) do lượt 2 tìm.
- **Beethoven Op. 49 số 2:**
  - n87 và bản ghi n20 (*ma non troppo*): dùng Dolmetsch.
  - Bản ghi n25: bỏ "có chú thích hữu ích", là lời đánh giá.
  - n66: ô 56 là nốt La5 có nốt hoa mỹ, không phải hợp âm. Hàng bảng nói chung cho nhóm ô, nên không sửa.
- **Prélude La trưởng:**
  - n77: sách Eigeldinger chưa đọc. Lượt 2 tìm được Niecks, *Frederick Chopin as a Man and Musician*, tập 2, 1888 (Project Gutenberg); review đọc lại câu Mikuli: "the accompanying hand, continued to play strictly in time". Trang viết thành "Carl Mikuli, một học trò của Chopin, kể … (Niecks dẫn lại)".
  - n92 (mục Nguồn): Eigeldinger thay bằng Niecks.
  - n79: IMSLP ghi Peters, Scholtz [1879].
  - Bản ghi n21: Wiener Urtext UT 50005 qua trang Thomann (UE trả 403). Không áp mục có điều kiện của `sua-B.yml`.
- **Prélude Mi thứ, n63:** Henle nói dấu bàn đạp khác nhau giữa các nguồn ở nhiều bài, không nói riêng bài số 4. Trang thành "Các ấn bản của bộ Prélude không phải lúc nào cũng ghi bàn đạp giống nhau".
- **Für Elise:**
  - n50: review so khối 1 với Mutopia `fur_Elise_WoO59.ly` (Breitkopf & Härtel 1888). Nhịp lấy đà và ô 1–8, cả hai tay, khớp từng nốt; ô 8 là lần chơi thứ nhất.
  - n14: tiểu sử Beethoven trên trang Henle ("1803–10/12 Frenzy of creativity").
  - n16 (*bagatelle*): Wiktionary là nguồn phổ thông. Review mở Grove, mục Bagatelle (Wikisource): "BAGATELLE (Fr. 'a trifle')".
  - n30, n84 (*poco*): OnMusic.
  - n25: giữ. Vế "học trò piano của Therese Malfatti" có nguyên văn trong danh mục Henle 2014 mà lượt 1 dẫn.
  - Bản ghi n17 (WoO): Beethoven-Haus. Bản ghi n21: Musicca. Bản ghi n26: lượt 2.
- **Satie:**
  - n59: trang thêm "Bản in không ghi dấu bàn đạp; cách đổi này suy từ cách ghi nốt trầm". Cả hai lượt đều ghi điều này.
  - n77: chữ trang đúng, nhưng lý do của lượt 1 "Mutopia không còn Gymnopédie" sai. Mutopia có `gymnopedie_1.ly` (nguồn Dover). Đã ghi ở `ghi_chu` chung của hồ sơ.
  - Bản ghi n19 (Dover): header của tệp `.ly` ghi nguồn "Dover Edition". Giữ chữ, không áp `sua-B.yml`.
- **Arietta:** n23 giữ bỏ. n30: lượt 2 xác nhận Steen-Nøkleberg là người Na Uy.

### Grade và dữ liệu

Chip "≈ Grade" phải khớp `grade` đã khóa, nên giữ nguyên. Dòng Độ khó trong `thong_tin` là trường chưa khóa. Ở đó, ước lượng ABRSM không có nguồn được bỏ, và dòng viết theo nguồn có:

| Bài | Dòng Độ khó mới | Chip |
|---|---|---|
| BWV 846 | Trinity Grade 5 (từ 2023), Henle mức 1 | ≈ Grade 4–5 (giữ) |
| Op. 49 số 2 | RCM Level 8 (2022), Henle mức 3 | ≈ Grade 5 (giữ) |
| Prélude La trưởng | Henle mức 4; không có trong ABRSM 2019–2020, RCM 2022 | ≈ Grade 3–4 (giữ) |
| Prélude Mi thứ | RCM Level 7 (2022), Henle mức 4 | ≈ Grade 5 (giữ) |
| Für Elise | RCM Level 7 (2022), Henle mức 3 | "≈ Grade 5 (đoạn A ≈ Grade 3)" thành "≈ Grade 5" (bản ghi n13; mục có điều kiện của `sua-A.yml`) |
| Gymnopédie | Henle mức 2; không có trong ABRSM 2025–2026, Trinity (từ 2023), RCM 2022 | ≈ Grade 4 (giữ) |
| Arietta | không đổi (ABRSM Grade 4 có thật) | ≈ Grade 4 |

`src/data/tac-pham.yml` đổi 10 dòng, đều ở trường chưa khóa (`thong_tin`, `chip`).

`tests/thanh-phan.test.mjs` dòng 84 đổi theo chip mới của Für Elise. Kiểm thử ấy so chip của `fur-elise` với chuỗi viết cứng.

Mọi chỗ đổi chữ trang hay dữ liệu đều có `doi_chu`: 32 mục mới, 7 mục cũ cập nhật `moi` và `ly_do`. `so-chu.mjs`: đã đủ cho cả 7 trang.

## Lượt 2 bổ sung

`d6-l3-gom/bo-sung.yml` có 1 câu, viết tay cùng định dạng với `xuat`:
- `chopin-prelude-la-truong` n74: lời khuyên tập, đổi theo n34 (thêm cách đánh cùng lúc). Kết quả lượt 2 cũ đã gỡ và ghi lại trong `ghi_chu`.

`xuat D6-L3 --con-lai` tự chọn một lời khuyên ngẫu nhiên khác (n61) cho đủ mẫu 3 câu; review thay bằng n74 vì đó là câu có chữ mới. Phần dữ liệu: `xuat du-lieu/tac-pham/<7 slug> --con-lai` ra 0 câu.

Các câu đổi chữ khác không chạy thêm lượt 2. Đó là những câu chỉ theo câu đúng của lượt 2, chỉ bỏ vế không có nguồn, hay chỉ dùng nguồn lượt 2 đã nêu (Niecks, Grove ở n16 là nguồn review thêm cho một nghĩa từ mà lượt 2 đã xác nhận).

## Kiểm

- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua (kiểm thử phạm vi nhánh lô và nhánh `them/`), 0 hỏng.
- `node tools/khoa.mjs tinh`: không lỗi.

## Chủ repo cần biết

- **Grade đã khóa lệch nguồn** (không sửa ở lô này):
  - Prélude La trưởng khóa "Grade 3–4", Henle xếp mức 4. Lượt 2 so với các bài Henle 4 khác: Arietta ABRSM Grade 4, Prélude số 6 Grade 6. Không nguồn nào đỡ Grade 3.
  - Prélude Mi thứ khóa "Grade 5", RCM xếp Level 7.
  - Gymnopédie khóa "Grade 4", Henle xếp mức 2 (dễ); không đề cương nào xếp bài.
  - Op. 49 số 2 khóa "Grade 5", RCM xếp Level 8.

  Dòng Độ khó nay không còn ước lượng ABRSM, nhưng chip vẫn ghi "≈ Grade" theo grade đã khóa. Muốn chip theo nguồn thì phải mở khóa `grade`.
- **Hồ sơ cũ có thể đọc nhầm `\arpeggio` của Mutopia.** Lượt 1 đọc `\arpeggio` trong tệp `.ly` thành dấu rải, mà ở Mutopia 470 lệnh này đi cùng `\arpeggioBracket`, tức một dấu ngoặc. Lô sau đối chiếu với tệp `.ly` thì nên xem kiểu dấu (`\arpeggioBracket`, `\arpeggioParenthesis`).
- **Bảng Cấu trúc Op. 49 số 2**, cột Giọng của đoạn chuyển (ô 15–20), vẫn ghi "Sol → Rê" (n52, cả hai lượt đúng): chữ chỉ hướng đi sang chủ đề 2. Nếu muốn khớp chặt với n60 thì có thể ghi "Sol trưởng (dừng ở át)".
- **Bài tập 3 của Prélude La trưởng** (ví dụ soạn, rải hợp âm ô 2) vẫn ghi "bắt đầu đúng phách". Đó là lời khuyên cho bài tập, không nói về ô 12.
- **Năm của bản quét Gymnopédie trên Commons:** lượt 1 gọi là bản in gốc 1888, lượt 2 gọi là bản in 1895 (BnF). Trang chỉ viết "bản in gốc", không ghi năm.
- `hinh-thuc/rondo` (đã khóa), n20: `ghi_chu` còn chép chữ cũ "quay lại ba lần" (như `d6-l3.md` đã ghi). Không sửa.
- **Còn trống trong lần kiểm định cuối của 14 hồ sơ:** `nguoi.luot_2` (người làm lượt 2 và lượt 2 bổ sung) và `nguoi.kiem_mau`.

## Lượt 2 bổ sung và trạng thái khóa (người gom)

- Lượt 2 bổ sung (Claude Opus 5.5, người gom): `ket-qua-bo-sung.yml`, `chopin-prelude-la-truong` n74 `dung`; đã `nhap`.
- Đã điền `nguoi.luot_2` cho 14 hồ sơ (7 trang, 7 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l3-gom/kiem-mau.yml` (`xuat D6-L3 --mau 8`).
- Lượt 2 phần dữ liệu: một agent con dùng User-Agent trình duyệt khi thử tìm đề cương ABRSM qua DuckDuckGo (bị chặn, không thử lại). Trái quy tắc mạng; từ D6-L4 lời giao ghi rõ quy tắc cho cả agent con.
