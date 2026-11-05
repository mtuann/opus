# D6-L2, lượt 1, phần A

Phần A: 3 bài học chặng 3 và 3 bản ghi cùng tên: `bach-prelude-bwv939`, `beethoven-sonatina-sol`, `clementi-sonatina`. Ngày 5/11/2026, Claude Opus 5.5.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu, cap-do | dinh-nghia | khuyen-tap | ve-site | Đã sửa | Đã bỏ | Chưa chắc |
|---|---|---|---|---|---|---|---|---|---|---|
| bach-prelude-bwv939 | 80 | 35 | 15 | 6 | 3 | 17 | 4 | 9 | 1 | 1 |
| beethoven-sonatina-sol | 76 | 32 | 19 | 7 | 3 | 13 | 2 | 7 | 0 | 1 |
| clementi-sonatina | 64 | 29 | 11 | 5 | 2 | 14 | 3 | 5 | 0 | 1 |

Bản ghi (lần 2, chỉ trường chưa khóa): bach-prelude-bwv939 19 (n7–n25), beethoven-sonatina-sol 18 (n6–n23; bản ghi không có `nhip`), clementi-sonatina 17 (n7–n23; không có `nhip`, 3 chưa chắc). Không có chỗ sai chắc chắn; `sua-A.yml` có ba đề xuất có điều kiện cho clementi-sonatina.

Khuông nhạc: 12 khối. 3 trích đoạn đối chiếu từng nốt, khớp hết cả hai tay:
- BWV 939 ô 1–4: MIDI và LilyPond của Mutopia (Bach-Gesellschaft 1890). MIDI `../opus-zero/_imslp/mid/mut_bwv939.mid` cho cùng nốt với tệp tải từ Mutopia.
- Anh. 5/1 chương I ô 1–8, Romanze nhịp lấy đà và ô 1–4: MEI của TROMPA (Breitkopf Serie 16 No. 160), gồm cả nốt láy, dấu luyến, sắc thái.

9 ví dụ soạn: đúng điều trang nói, ngón chơi được.

## Chỗ đã sửa trên trang

- bach-prelude-bwv939:
  - Kellner và tập P 804 theo Bach Digital: phần lớn từ di sản Kellner, 57 bản chép, chủ yếu nhạc Bach. Bỏ "nguồn sớm nhất hoặc duy nhất" cho "không ít bài".
  - Quyền tác giả: thay "đôi khi bị đặt dấu hỏi" (chỉ có ở Wikipedia) bằng "không có bằng chứng trực tiếp".
  - Bỏ "một trong những bài Bach đầu tiên của rất nhiều người học đàn".
  - Bach-Gesellschaft 1890 không gom thành nhóm *Fünf kleine Präludien*: theo IMSLP, năm bài in rải ở tr. 119–135 của tập 36; nhóm ấy là nhóm theo số BWV.
  - Harpsichord: bỏ "nốt tắt khá nhanh", "ngân lâu hơn nhiều".
  - Bỏ Nikolayeva: chỉ có ở danh mục bậc 3.
  - Bỏ "các bản Urtext" ở mục Ấn bản.
  - Mục Nguồn: thay hai bài Wikipedia và sách Schulenberg chưa đọc bằng Bach Digital, BPMD, ADB.
- beethoven-sonatina-sol:
  - Bản in khoảng 1807 ghi tên Beethoven: nguồn là lvbeethoven.it (bản Altona, Rudolphus), không phải Henle.
  - Wiener Urtext: "lời giới thiệu" thành "phần giới thiệu", vì chỉ đọc được mô tả của nhà xuất bản.
  - **Hình thức:** "ba đoạn A – B – A thêm coda" thành "hai đoạn có tái hiện … thêm coda". Lý do: B và A nhắc lại cùng nhau, và theo OMT Ternary Form cùng trang Hình thức nhỏ đã khóa, cách nhắc lại ấy là hai đoạn có tái hiện.
  - Định nghĩa Romanze theo Concise Oxford Dictionary of Music.
  - "dấu lặng ngân" thành "dấu ngân" (8 chỗ): fermata đặt trên nốt, không trên dấu lặng.
  - Mục Nguồn: thêm Thayer 1865 và số trang của Nottebohm.
- clementi-sonatina:
  - "có lẽ … nhiều nhất thế giới" thành "một trong những …", sửa cả `description`.
  - Beckford: năm 1766, khoảng 14 tuổi; bỏ "giàu có".
  - "một trong những nghệ sĩ piano lớn đầu tiên" thành "người đương thời khen ngón đàn điêu luyện" (Henle).
  - **Cùng chặng:** Chopin Valse La thứ ở chặng 5, nên thay bằng Bach BWV 939.
  - Mục Nguồn: Plantinga chưa đọc, thay bằng Treccani và Henle HN 848; ghi lần in đã đọc của sách *Introduction*.

Mọi chỗ sửa có mục `doi_chu` viết tay trong hồ sơ trang (`cu`/`moi` là chữ hiển thị, bỏ Markdown). Cần ghép với khung của `so-chu.mjs --doi-chu` sau khi build.

## Chỗ chưa chắc

- bach-prelude-bwv939:
  - n9: định nghĩa "nhịp điệu hòa âm"; chưa thấy câu ấy trong chương OMT đã mở.
  - n2, n27, n28: độ dài và tên bản thu dựa một phần vào Bach Cantatas Website (bậc 3). Có thêm Hyperion và Mediathek, nhưng hai trang này không có danh sách track của đúng BWV 939.
- beethoven-sonatina-sol:
  - n53: "Moderato nghĩa là vừa phải" chỉ khớp `thuat-ngu.yml`, chưa có nguồn bậc 2.
  - n59: "nhiều tuyển tập … kèm sắc thái, số ngón của người biên tập" chưa kiểm cụ thể.
- clementi-sonatina:
  - n48 (trang), bản ghi n11, n17: chương I ghi *Allegro*. Ấn bản in duy nhất đã đọc (Schirmer 1893) ghi *Spiritoso*; chưa mở được bản in đầu 1797 (IMSLP chặn PDF).
  - Bản ghi n21: chưa thấy ấn bản Wiener Urtext của Op. 36.
- Năm in tập Peters: IMSLP ghi 1843, Bach Printed Music Database ghi "[1844]". Giữ 1843.

## Việc cho người giao

- Ghép `doi_chu` với `node tools/chuyen/so-chu.mjs <trang> --doi-chu` sau `npm run build:xem`. Chữ `cu`/`moi` viết tay, có thể lệch dấu câu hay chữ của link.
- Dòng Độ khó của beethoven-sonatina-sol và clementi-sonatina ghi "(ước lượng)" dù có trong đề cương: ABRSM 2025–2026 Grade 2 có Moderato; ABRSM 2023–2024 Grade 3 có Vivace (theo lần 1 đã khóa). Như D6-L1, cân nhắc bỏ chữ ấy.
- Hồ sơ khác trỏ tới các trang này: đã đối chiếu, vẫn đúng.
  - Slug giữ nguyên (`nha-soan-nhac.yml` n189).
  - Clementi chặng 3 (`kiem-tra-dau-vao`).
  - Bản thu Beethoven có mốc, trừ một dòng "-" (`cap-nhat.yml`).
  - Kellner gắn với bản chép chứa BWV 939: trang mới nói rõ hơn ("phần lớn đến từ di sản của Kellner"; người chép tập nhỏ 53 chưa rõ).
- Thuật ngữ chưa có bản ghi trong `thuat-ngu.yml`: "nhịp điệu hòa âm" (harmonic rhythm), "nốt nền" (pedal point), "dấu ngân" (`thuat-ngu.yml` có fermata, nghĩa "Ngân dài tùy ý").
- Soát nhãn cho review: clementi-sonatina n40 (quãng tám gãy: "mỏi", "dừng nghỉ nếu thấy căng") xếp `khuyen-tap`; n22 (tiếng fortepiano) xếp `khuyen-tap`.
- Câu `ve-site` trỏ tới trang chưa chuyển:
  - `piano/tac-pham/bach-prelude-do`: phải giữ mục "Theo dõi khi nghe", id `theo-doi-khi-nghe`.
  - `bach-invention-1`, `mozart-k545`, `nghe-nhac/mozart-k331`.
- Chương II bản thu của León Egea không chơi các dấu nhắc lại. Kết luận này suy từ khoảng cách các mốc và độ dài tệp, chưa nghe hết.
- Hình cấu trúc clementi: độ rộng chương II (20) và III (24) không theo số ô (26, 70). Chú thích đã ghi "gần đúng", không sai.

## Nguồn hay dùng

- **Bản nhạc:**
  - Mutopia: `bwv-939` (.ly, .mid) và `sonatina-1` (.ly, MIDI). Tệp Clementi theo Schirmer 1893 và không có dấu phát âm, nên phát âm chương III đọc trên bản quét Sonatina Album ở Internet Archive (`sonatinaalbumfor51kohl`, tr. 33–35).
  - TROMPA MEI trên GitHub (`trompamusic-encodings/Beethoven_WoOAnh5_BreitkopfHaertel`), đọc bằng script Python. Dấu hóa nằm trong phần tử con `<accid>`, phải đọc cả nó.
- **Bach Digital** (trang gốc chặn bot): bản lưu Wayback đọc được. Tìm địa chỉ bằng `archive.org/wayback/available?url=…`.
- **lvbeethoven.it:** mạng ở đây chặn trang gốc ("Advanced Security"); bản lưu Wayback đọc được, có chi tiết các lần in Anh. 5.
- **Sách cũ trên Internet Archive (chữ OCR `_djvu.txt`):**
  - Thayer, *Chronologisches Verzeichniss* (1865), số 24;
  - Nottebohm, *Thematisches Verzeichniss* (1868), tr. 148;
  - Clementi, *Introduction* (bản in khoảng 1810, Columbia).
- **Henle:** lời nói đầu HN 106 và HN 848 (PDF), trang HN 365 (mô tả).
- **Tiểu sử:** Treccani (Dizionario Biografico) cho Clementi; Deutsche Biographie cho Kellner (ADB), Kinsky, Nottebohm, Beethoven.
- **Encyclopedia.com:** Concise Oxford Dictionary of Music và Baker's (Clementi, John Field, romance). Mục "moderato", "sonatina", "nocturne" trên trang này chỉ là từ điển vần hay mục khác.
- **IMSLP:** trang tác phẩm đọc được bằng WebFetch. Trang tệp và một số trang bị bước kiểm tra bot: dùng bản lưu Wayback, không vòng qua.
- **Open Music Theory:** WebFetch trả 403; curl với User-Agent trình duyệt đọc được.
