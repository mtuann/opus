# D6-L1, lượt 1, phần A

Phần A: 4 bài học chặng 2 và 4 bản ghi cùng tên: `minuet-sol`, `minuet-sol-thu`, `musette-re`, `mozart-minuet-k2`. Ngày 5/11/2026, Claude Opus 5.5.

## Số liệu

Trang (nhận định theo loại):

| Trang | Tổng | cau-truc | lich-su | ten, nam, danh-muc, so-lieu | dinh-nghia, quy-tac | khuyen-tap | ve-site | Đã sửa | Đã bỏ | Chưa chắc |
|---|---|---|---|---|---|---|---|---|---|---|
| minuet-sol | 82 | 23 | 15 | 10 | 5 | 16 | 13 | 4 | 1 | 3 |
| minuet-sol-thu | 78 | 30 | 3 | 5 | 12 | 13 | 15 | 7 | 0 | 0 |
| musette-re | 88 | 26 | 10 | 8 | 14 | 18 | 12 | 5 | 0 | 0 |
| mozart-minuet-k2 | 86 | 36 | 13 | 11 | 2 | 13 | 11 | 2 | 1 | 2 |

Bản ghi (lần 2, chỉ trường chưa khóa: giong, nhip, thoi_ky, ky_nang_chinh, chip, thong_tin, hinh, ban_thu): minuet-sol 23 (1 chưa chắc), minuet-sol-thu 22 (1 chưa chắc), musette-re 22, mozart-minuet-k2 19. Không có chỗ sai trong dữ liệu; `sua-A.yml` có hai đề xuất có điều kiện (ấn bản Peters 1880).

Khuông nhạc: 16 khối. 4 trích đoạn đối chiếu từng nốt với MIDI và LilyPond của Mutopia (Anh. 114 ô 1–16, Anh. 115 ô 1–8, Anh. 126 ô 1–8, KV 2 ô 1–8): khớp hết, cả hai tay. 12 ví dụ soạn: đúng điều trang nói, ngón chơi được; các ô mượn từ bản gốc (K. 2 bài tập 2, 3; Minuet Sol trưởng bài tập 2) cũng khớp từng nốt.

## Chỗ đã sửa trên trang

- minuet-sol: người chép (bỏ "các bài số 3 đến 11"), bỏ câu "dạy các con nhỏ", bỏ Leonhardt và Egarr (chưa thấy bản thu), ô 8 và 12 (ô 12 tay phải không giữ nốt dài), mục Nguồn (Bach-Jahrbuch 65, tr. 45–64, link bản số hóa). Các sửa này đã nằm trong commit chuyển trang của người giao (sửa trước khi rebase).
- minuet-sol-thu: tay trái ô 4 không phải nốt trắng chấm dôi (hai chỗ), bỏ "công thức rất quen", "tám chương khác" thành tên các chương (Schulze in đủ chương: còn bảy nếu tính cặp minuet là một), bỏ "tiếng tắt nhanh"/"ngân lâu", tên nghệ sĩ thu âm, link Gam và ngón bấm (trang ấy chưa có gam thứ giai điệu), mục Nguồn.
- musette-re: bỏ "tự nhiên nhất", bỏ "kẹp dưới cánh tay" và "giấc mơ đồng quê" của nhạc cụ, "phần lớn" thành "nhiều" (người chép), câu tiếng vọng thành gợi ý, mục Nguồn (Grove thành Britannica và COD).
- mozart-minuet-k2: bỏ Guy Penson, dấu ngân ô 20 ("Bản Breitkopf in dấu ngân"), bỏ dòng PTNA ở mục Nguồn.

Mọi chỗ sửa có mục `doi_chu` trong hồ sơ trang.

## Chỗ chưa chắc

- minuet-sol n11, n74, n75: năm 1950 của BWV và nghĩa "Anh. II = nghi vấn" chỉ thấy ở Wikipedia; IMSLP chỉ ghi số Anh. II 114. Bach-Digital, Breitkopf không đọc được.
- mozart-minuet-k2 n16: ghi chú của Leopold ngày 26/1/1761 (minuet và trio trong nửa giờ) chỉ thấy ở Wikipedia; cần NMA IX/27/1 trên dme.mozarteum.at.
- mozart-minuet-k2 n24: mô tả phong cách galant chưa có nguồn bậc 2.
- Bản ghi minuet-sol n20, minuet-sol-thu n18: ấn bản C. F. Peters 1880.

## Vấn đề cho người giao

- Thuật ngữ: minuet-sol gọi ký hiệu răng cưa không gạch (prall) là "láy rền ngắn" (như trang Nốt hoa mỹ); minuet-sol-thu gọi là "láy trên" (như `thuat-ngu.yml`, mục mordent: "Không gạch là láy trên"). Bản ghi minuet-sol-thu dùng "nốt cảm", trang dùng "cảm âm". Cân nhắc thống nhất.
- Chữ "(ước lượng)" ở dòng Độ khó của minuet-sol-thu và musette-re thừa: hai bài có trong đề cương (ABRSM, Trinity Grade 2) theo lần 1 đã khóa.
- Câu `ve-site` trỏ tới trang chưa chuyển (lô chuyển trang ấy cần giữ): nghe-nhac/doc-ten-tac-pham (BWV, Anh., K. của Köchel 1862), nghe-nhac/mozart-eine-kleine (chương 3 minuet), piano/tac-pham/clementi-sonatina, bach-invention-1, bach-prelude-bwv939, bach-prelude-do, beethoven-sonatina-sol, mozart-k545. Tìm bằng `grep -rn "<trang đích>" kiem-dinh/piano/tac-pham/`.
- Lời khuyên về mỏi tay ở bè trầm quãng tám (musette-re n52, n84) xếp khuyen-tap; review soát nhãn.
- mozart-minuet-k2 n75: câu "đều có trong tập Wiener Urtext ở trên" dựa vào dòng Bản nhạc của hộp tác phẩm (thong_tin), chỉ hiện khi trường ấy đã khóa.

## Nguồn hay dùng

- Mutopia: tệp `.ly` và `.mid` của anna-magdalena-04, -05, -22 (Bach-Gesellschaft, Allen Garvin) và menuet_k2 (Breitkopf). Đối chiếu bằng script Python (mido) in nốt MIDI theo ô; MIDI của Mutopia do LilyPond sinh nên khớp tệp `.ly`.
- Hans-Joachim Schulze, Bach-Jahrbuch 65 (1979), tr. 45–64, bản số hóa trên bjb.publia.org (article 1686; ảnh scan, đọc từng trang). Đây là nguồn bậc 2 đọc được cho mọi chuyện về Petzold: tổ khúc, Tzschirich, Walther, Telemann, cái chết năm 1733, W. F. Bach, chuyến đi Dresden 9/1725.
- IMSLP qua WebFetch (curl bị trang kiểm tra bot): trang tác phẩm, trang Notebooks for Anna Magdalena Bach (số bài, người chép).
- Köchel online: trang dựng bằng JavaScript; WebFetch đọc được khi dùng địa chỉ có tên (`/en/work/piano-piece-in-f-1009`), không đọc được `/en/work/1009`.
- Neue Deutsche Biographie (deutsche-biographie.de) cho W. A. và Leopold Mozart; lời tựa Henle HN 1236 (PDF) cho sổ nhạc Nannerl; Türk 1789 bản OCR trên Internet Archive (`klavierschuleode00trkd`).
- Britannica bị 403: đọc bản lưu `web.archive.org/web/2025/https://www.britannica.com/art/musette`. Concise Oxford Dictionary of Music qua Encyclopedia.com (minuet, musette, da capo, cadence).
- Bản thu: trang Commons, trang IMSLP; độ dài file trong `public/audio/` đo bằng `afinfo`; thứ tự đoạn của bản thu Musette kiểm bằng chroma (librosa).
