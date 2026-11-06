# D6-L9-gom: lượt 2 và review của 8 hướng dẫn nghe và 8 bản ghi

Nhánh `moi/d6-l9-gom`, ngày 06/11/2026. Review: Claude Opus 5.5 (không làm lượt 1 hay lượt 2), không dùng agent con. Không khóa gì, không push.

## Lượt 2

Danh sách: `d6-l9-nhan-dinh.yml` (trang, chia `d6-l9-gom/trang-1.yml`, `trang-2.yml`) và `d6-l9-nhan-dinh-du-lieu.yml` (`d6-l9-gom/du-lieu.yml`). Kết quả thô: `d6-l9-gom/ket-qua-*.yml`, đã `nhap`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (bach-air, bach-cello-1, handel-hallelujah, haydn-94) | 104 | 98 | 2 | 4 | 68 |
| Trang, phần 2 (mozart-40, mozart-eine-kleine, mozart-nu-hoang-bong-dem, mozart-requiem) | 98 | 93 | 1 | 4 | 45 |
| Bản ghi (8) | 33 | 32 | 0 | 1 | 1 |
| **Tổng** | **235** | **223** | **3** | **9** | **114** |

Cần review gồm 12 câu lượt 2 `sai` hay `khong-chac`, và 102 câu lượt 1 đã sửa (99) hay đã bỏ (3) mà lượt 2 ghi `dung`.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L9-gom: …". Mọi câu đã review có `review: dung`: 24 câu `ve-site` (23 câu, cộng `mozart-requiem` n31 đổi nhãn) và 114 câu cần review. Lần kiểm định cuối của 16 hồ sơ (8 trang, 8 bản ghi) đã có `nguoi.review`.

### Câu về chính site (24 câu)

Review kiểm trên:
- link: trang đích có trong `src/content/docs/` và trong bản xem (`dist/`); `#i-qua-mot-tac-pham-mozart-eine-kleine-nachtmusik-chuong-3` có trong `dist/hinh-thuc/minuet-trio/`;
- chữ của trang đích: `lich-su/thoi-ky/baroque` dòng 39 (trumpet chưa có van), `hinh-thuc/fugue` (các bè "đuổi theo" nhau), `lich-su/opera` (dòng *Die Zauberflöte* link ngược lại), tiêu đề `nhac-ly/07-gam-thu`, `hinh-thuc/sonata`;
- mốc: `mozart-eine-kleine` có 8 mốc cho 8 dòng bảng; bảng Requiem có 8 dòng từ Introitus đến Lacrimosa.

Kết quả: 24 đúng, 0 sai.
- `piano/tac-pham/bach-prelude-do` (`bach-cello-1` n19) và `nghe-nhac/mau` (8 câu) có ở bản xem, nhưng chưa khóa nên bản thật hiện "sắp có". Hợp lệ.
- **Đổi nhãn:** `mozart-requiem` n31 (`so-lieu` thành `ve-site`, như lượt 2 đề nghị). Câu chỉ nói trang đã bỏ vế "phần lớn người nghe không nhận ra"; trên trang, vế ấy không còn.

### Câu lượt 2 `sai` và `khong-chac` (12 câu)

| Câu | Quyết định |
|---|---|
| `handel-hallelujah` n27 (sai; Cao trào) | Soprano giữ La hai lần (ô 51–56), rồi nhảy quãng 4 lên Rê; chỉ từ Rê mới lên từng bậc. Ghi chú của lượt 1 cũng cho thấy vậy. Sửa ô Kỹ thuật theo câu đúng: "giữ nốt La dài hai lần, rồi lên Rê và từ đó mỗi lần lên cao hơn một bậc (Rê, Mi, Fa♯, Sol); trumpet giữ cùng nốt (lúc còn ở La thì cao hơn một quãng tám)". Dòng 5 của bảng Theo dõi khi nghe (n29) có cùng vế, nên sửa theo. Không chạy lại. |
| `bach-cello-1` n14 (sai; Casals là người đầu tiên chơi trọn) | Theo The Strad, Grützmacher (1867), Piatti (1873) và Klengel (1894) đã chơi trọn một tổ khúc. Vế "điều trước đó chưa ai làm" (GEC chép lời Casals tự nhận) đã bỏ. Chữ mới theo câu đúng: "về sau, từ khoảng năm 1902, ông đưa trọn từng tổ khúc vào chương trình hòa nhạc, rồi thu âm cả sáu bản … lần đầu cả bộ được thu âm". Thêm nguồn `strad-casals`. Không chạy lại. |
| `mozart-requiem` n29 (sai; trombone "chỉ" ở nhà thờ) | Đổi "chỉ" thành "chủ yếu" theo câu đúng: *L'Orfeo* của Monteverdi và *Saul* của Handel có trombone. Không thêm vế ví dụ. Không chạy lại. |
| `handel-hallelujah` n8 (độ dài 3–4 phút) | Giữ. Các bản thu thương mại trên MusicBrainz dài 3:22–4:00; ước tính theo bản nhạc khoảng 3:20. Ba tệp IMSLP dài hơn 4:30 là độ dài tệp, có thể gồm khoảng lặng hay tiếng vỗ tay. |
| `handel-hallelujah` n14 (nợ nần, "tưởng hết sự nghiệp"; lượt 1 đã bỏ) | Giữ bỏ. Không có nguồn bậc 1–2, và lời tựa Bärenreiter còn bác cách giải thích này. Ý opera Ý bớt được ưa chuộng đã có ở n10. |
| `bach-cello-1` n10 (bị coi là bài tập kỹ thuật; lượt 1 đã bỏ) | Giữ bỏ. Các nguồn mâu thuẫn nhau, và hướng dẫn nghe không cần câu này. |
| `bach-air` n26 (mục Nguồn, COD) | Lượt 2 mở Oxford Reference (lỗi 403), nhưng link của trang trỏ tới Encyclopedia.com. Review tải trang ấy: có mục "Air on the G String" ghi nguồn *The Concise Oxford Dictionary of Music*, chữ khớp nguồn `cod-air-g`. Giữ. |
| `mozart-eine-kleine` n20 (dòng 2: bè cao hát, bè thấp trả lời) | Giữ. Review đọc tệp Mutopia `01_allegro`. Ô 11: hai violin chơi nốt trắng Rê–Mi (p), viola và cello nghỉ. Ô 12: viola (Fa♯–Sol) và cello (Rê–Mi) vào bằng cùng hình nốt trắng, trong khi violin chơi nốt đen có nốt hoa mỹ. Ô 15–16 lặp lại. Lượt 2 đọc nhầm ô 11 là chỉ có violin 1. |
| `mozart-requiem` n7 (50–55 phút; khoảng 30 phút) | Gộp số đo của hai lượt: Krips 54/29 phút, Kertész 53/28, Herreweghe 47/25, Abbado 48/24. Sửa thành "Khoảng 45–55 phút; … khoảng 25–30 phút". Không chạy lại. |
| `mozart-requiem` n15 ("nhiều nợ", "hai lần không thành") | "Nhiều nợ" có nguồn ở Carus ("considerable debt"); NMA nói gia đình túng thiếu, không trái với Carus. Về "hai lần", Carus nói hai lần thất bại; NMA kể Eybler bỏ dở rồi vài người khác từ chối. Đổi thành "sau vài lần không thành", đúng với cả hai nguồn. Không chạy lại. |
| `mozart-requiem` n31 (lượt 1 đã bỏ) | Đổi nhãn thành `ve-site` và kiểm trên trang (xem trên). |
| Dữ liệu `mozart-requiem` n7 (Introitus "Mozart viết trọn") | Lời tựa của Cohrs ("Instrumentation begun by Mozart, possibly not entirely completed by him") và lời tựa 6159 ("almost complete") nói Introitus gần trọn; Carus và NMA nói trọn. Sửa theo gợi ý của lượt 2 thành "Mozart viết gần trọn, kể cả phối khí", ở ba chỗ: chú giải màu xanh của `hinh.nghe` (n6, n7 của hồ sơ bản ghi), và câu của trang (`nghe-nhac/mozart-requiem` n12, lượt 2 trang ghi `dung` theo NMA). Chữ "gần trọn" đúng với mọi nguồn. Thêm nguồn `cohrs-626` cho hai hồ sơ. Không chạy lại. |

### Câu lượt 1 đã sửa hay đã bỏ mà lượt 2 `dung` (102 câu)

- **99 câu đã sửa:** review đọc lại cả tám trang (bảng, đoạn văn, bảng Theo dõi khi nghe, câu hỏi, mục Nguồn, mô tả trang). Chữ khớp câu ở mọi câu.
- **3 câu đã bỏ:** chữ đã bỏ không còn trên trang và mô tả trang (đã tìm "nổi tiếng nhất", "bài tập kỹ thuật", "hơn chục năm", "nợ nần", "từ thiện", "chưa ai làm", "phần lớn người nghe"). Chữ "nổi tiếng nhất" còn ở `mozart-eine-kleine`, nhưng đó là lời trích Köchel online (n7), không phải câu đã bỏ. Lượt 2 tìm được nguồn cho cả ba câu, nhưng chỉ là nguồn phổ thông; câu không cần cho hướng dẫn nghe nên vẫn bỏ:
  - `bach-air` n9 ("nổi tiếng nhất của cả nhạc cổ điển"): Hollywood Bowl, Parlance; câu là lời đánh giá.
  - `bach-cello-1` n13 (Casals tập 12 năm): sách của Siblin.
  - `handel-hallelujah` n18 (buổi đầu là hòa nhạc từ thiện): History Ireland.
- **`mozart-nu-hoang-bong-dem` n7:** lượt 2 ghi `dung` nhưng thấy "khoảng 3 phút" sát hơn (MusicBrainz: 2:52–3:39, trung vị 2:57). Trả về chữ cũ "Khoảng 3 phút", `ket_qua: dung`, bỏ mục `doi_chu`.
- **`handel-hallelujah` n22 (George II):** giữ câu (xem "Chủ repo cần biết").

### Soát nhãn

- Không câu `ve-site` nào chứa điều cần nguồn ngoài.
- Không câu `khuyen-tap` nào nói về sức khỏe (đã soát cả 10 câu, đều là câu hỏi nghe hay lời mời nghe).
- Đổi một nhãn: `mozart-requiem` n31 (`so-lieu` thành `ve-site`).

### Chỗ sửa trang và dữ liệu

| File | Đổi |
|---|---|
| `nghe-nhac/handel-hallelujah.md` | Dòng Cao trào của bảng Sơ đồ cấu trúc; dòng 5 của bảng Theo dõi khi nghe |
| `nghe-nhac/bach-cello-1.md` | Câu về Casals: bỏ "điều trước đó chưa ai làm"; thêm "từ khoảng năm 1902…", "lần đầu cả bộ được thu âm" |
| `nghe-nhac/mozart-requiem.md` | Độ dài 45–55 phút, khoảng 25–30 phút; "Mozart viết gần trọn Introitus, kể cả phối khí"; "sau vài lần không thành"; trombone "chủ yếu" |
| `nghe-nhac/mozart-nu-hoang-bong-dem.md` | Độ dài "Khoảng 3 phút" (chữ cũ) |
| `src/data/tac-pham.yml` | `mozart-requiem` `hinh.nghe`: "Xanh: Mozart viết gần trọn, kể cả phối khí." |

- Đều là trang và trường chưa khóa: bản ghi `mozart-requiem` chỉ khóa từng phần, các trường của đợt 2, không có `hinh`.
- `doi_chu`: cập nhật `moi` và `ly_do` của 6 mục cũ (bach-cello-1: đoạn Casals; handel: dòng Cao trào, bảng Theo dõi; requiem: độ dài, đoạn "Ai viết phần nào", câu hỏi trombone). Thêm 1 mục mới: chú thích hình Requiem, ở hồ sơ trang. Bỏ 1 mục: độ dài của Nữ hoàng bóng đêm. `so-chu.mjs --doi-chu` báo đủ cho cả 8 trang.
- Không trang nào có mốc (`moc`) đổi, nên không cần `tools/audio`.

## Lượt 2 bổ sung

Không có. `node tools/khoa.mjs xuat D6-L9 --con-lai` ra 0 nhận định, nên không có `d6-l9-gom/bo-sung.yml`. Mọi chỗ đổi chữ theo một trong ba cách:
- theo câu đúng của lượt 2;
- theo gợi ý của lượt 2 (Introitus "gần trọn"; độ dài Nữ hoàng bóng đêm);
- làm nhẹ một vế cho đúng với nguồn hai lượt đã đọc (độ dài Requiem, "vài lần").

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua, 0 hỏng.

## Chủ repo cần biết

- **George II (`handel-hallelujah` n22):** lượt 2 đề nghị thêm một vế: "không có tài liệu thời ấy xác nhận vua có mặt; lời kể sớm nhất là một lá thư năm 1780". Thư ấy là thư của James Beattie, in trong Forbes, tập 2. Review không thêm, vì hai lẽ:
  - vế ấy là nhận định mới, và chữ "sớm nhất" chỉ có nguồn bậc 3 (Bard);
  - trang đã viết "chuyện thường được kể là…".

  Muốn thêm thì cần một lượt 2 bổ sung.
- **Casals:** trang không còn nói Casals là người đầu tiên chơi trọn tổ khúc. Hồ sơ đã khóa khác có thể còn câu như vậy: chưa tìm trong lô này, vì nằm ngoài phạm vi.
- **`hinh-thuc/minuet-trio` m26** (đã khóa, ngoài lô) dẫn `haydn-94` và `mozart-40` làm hướng dẫn nghe cho chương 3, trong khi hai trang chỉ viết về chương 2 và chương 1. Muốn sửa thì mở khóa ở việc riêng (như `d6-l9.md`).
- **Chữ "Đỏ"** cho màu hồng cam (#e9b3a6) ở chú thích hình Requiem: giữ, cho nhất quán với hình của Debussy Préludes và Kinderszenen; muốn đổi thì đổi cả ba.
- **Introitus:** các nguồn chưa thống nhất (NMA, Carus: Mozart viết trọn; Cohrs: có thể chưa xong phối khí). Site nay viết "gần trọn, kể cả phối khí" ở trang và hình.
- **Thuật ngữ chưa có** trong `thuat-ngu.yml`, và **cách mở nguồn mới** đề xuất cho `chuan-kiem-dinh.md`: danh sách ở `d6-l9.md`.
- **Còn trống** ở lần kiểm định cuối của 16 hồ sơ: `nguoi.luot_2`, `nguoi.kiem_mau`.
- **Mạng:** mọi yêu cầu dùng User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`:
  - Mutopia: zip `.ly` của K. 525;
  - Encyclopedia.com: mục "Air on the G String".

## Trạng thái khóa (người gom)

- Không có lượt 2 bổ sung (`xuat D6-L9 --con-lai` ra 0).
- Đã điền `nguoi.luot_2` cho 16 hồ sơ (8 trang, 8 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l9-gom/kiem-mau.yml` (`xuat D6-L9 --mau 8`).
- Casals ở trang khác: `nhac-cu/cello` (đã khóa) chỉ viết Casals "làm sống lại sự quan tâm… qua việc biểu diễn sáu tổ khúc", không nói "đầu tiên": không mâu thuẫn với chữ mới của `bach-cello-1`.

## Kiểm mẫu và khóa (06/11/2026)

Chủ repo giao Claude Opus 5.5 (phiên Cowork) kiểm mẫu thay, điền `kiem_mau` và khóa; người kiểm không phải chủ repo (`nguoi.kiem_mau` ghi rõ). 8 nhận định ở `d6-l9-gom/kiem-mau.yml`, kết quả `d6-l9-gom/kiem-mau-ket-qua.yml`: không câu nào sai. Nguồn ngoài mở lại bằng agent đọc trang web; file .ly của Mutopia đọc trên bản GitHub của MutopiaProject; câu về site kiểm trên repo. Câu chỉ kiểm được một phần ghi rõ trong `ghi_chu` của file kết quả. Khóa mọi trang và bản ghi của lô; bản build thật 231 trang (cùng D6-L1 đến D6-L10).
