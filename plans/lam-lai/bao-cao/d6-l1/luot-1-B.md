# D6-L1, lượt 1, phần B

Claude Opus 5.5, 05/11/2026, nhánh `moi/d6-l1`. Ba trang bài học (`piano/tac-pham/burgmuller-la-candeur`, `schumann-album`, `tchaikovsky-bai-ca-phap-co`) và ba bản ghi cùng tên (lần 2, các trường chưa khóa).

## Số liệu

| Hồ sơ | Nhận định | Theo loại | Kết quả |
|---|---|---|---|
| trang burgmuller-la-candeur | 102 | cau-truc 41, khuyen-tap 21, ve-site 15, ten 8, danh-muc 5, nam 4, dinh-nghia 4, lich-su 3, so-lieu 1 | dung 78, khong-can-nguon 21, da-sua 1, da-bo 1, chưa chắc 1 |
| trang schumann-album | 79 | cau-truc 22, lich-su 17, khuyen-tap 14, ten 9, ve-site 8, nam 5, so-lieu 2, cap-do 1, danh-muc 1 | dung 60, khong-can-nguon 14, da-sua 2, da-bo 1, chưa chắc 2 |
| trang tchaikovsky-bai-ca-phap-co | 80 | cau-truc 38, khuyen-tap 12, ve-site 10, ten 7, danh-muc 7, dinh-nghia 3, nam 2, lich-su 1 | dung 67, khong-can-nguon 12, da-sua 1 |
| bản ghi burgmuller-la-candeur (n6–n35) | 30 | cau-truc 13, ten 6, lich-su 4, cap-do 2, nam 2, danh-muc 1, so-lieu 1, khuyen-tap 1 | dung 29, khong-can-nguon 1 |
| bản ghi schumann-album (n7–n34) | 28 | cau-truc 13, ten 5, nam 4, lich-su 2, cap-do 2, danh-muc 1, so-lieu 1 | dung 26, da-sua 1, chưa chắc 1 |
| bản ghi tchaikovsky-bai-ca-phap-co (n6–n31) | 26 | cau-truc 10, ten 6, nam 3, lich-su 2, cap-do 2, danh-muc 1, so-lieu 1, khuyen-tap 1 | dung 25, khong-can-nguon 1 |

Khuông nhạc: 11 khối. 2 trích đoạn đối chiếu từng nốt: La candeur ô 1–8, **sai một nốt, đã sửa**; Old French Song lấy đà và ô 1–8, khớp. 9 ví dụ soạn, đúng.

Nhận định bản ghi chỉ ghi `truong` là trường chưa khóa. Chip và dòng "Độ khó" nói về cấp độ thì ghi `truong: [chip]` hay `[thong_tin]`, nguồn là nguồn của `grade` ở lần 1.

## Đã sửa, đã bỏ

- **La candeur, khối 1**: nốt cuối ô 8 tay phải là Sol5 (`g2`), không phải Sol4 (`G2`). Đã đối chiếu với Mutopia 202 qua file .ly, ảnh PDF và MIDI tải mới. File `../opus-zero/_imslp/mid/mut_burg01.mid` ghi G4 và khác file trên Mutopia, nên lỗi lọt qua lần kiểm ở site cũ.
- **La candeur n16**: câu cũ "sang Paris năm 1832 và ở lại đó đến cuối đời" sai, vì ông mất ở Beaulieu(-sur-Mer) (Deutsche Biographie). Đã sửa thành "sống ở Pháp đến cuối đời". Trang Arabesque cũ có cùng câu: lô chuyển trang Arabesque cần sửa theo.
- **La candeur n30 (bỏ)**: câu "Bài này được thu rất nhiều, cả bởi nghệ sĩ lẫn giáo viên" không kiểm được. IMSLP chỉ có một bản thu số 1.
- **Schumann n47**: câu cũ "Ba bài đều xây từ những câu 4 ô" sai, vì đoạn b của số 10 dài 6 ô. Đã sửa thành "những câu ngắn, phần lớn 4 ô".
- **Schumann n64 (bỏ)**: câu "Nhiều người học bài này trước cả Wilder Reiter" không kiểm được.
- **Schumann n78**: câu cũ "bản dàn trang công cộng theo ấn bản Peters" sai, vì các file Op. 68 trên Mutopia mang giấy phép CC BY-SA 2.5. Đã ghi rõ giấy phép.
- **Tchaikovsky n9**: câu cũ "bước đầu của lối viết nhiều bè trong nhạc Lãng mạn" là khái quát không có nguồn. Đã sửa thành "bước đầu để chơi hai bè trong một bàn tay".
- **Bản ghi schumann-album n22** (đề xuất trong `sua-B.yml`): dòng Hình thức "các câu 4 ô" đổi thành "các câu ngắn, phần lớn 4 ô". Dòng này hiện trên trang qua `::hop-tac-pham`.

Mỗi chỗ sửa trên trang có mục `doi_chu` viết tay theo chữ hiển thị. Chưa chạy `so-chu.mjs` (không build).

## Chưa chắc

- **Nicht schnell ở Melodie** (trang schumann n56, n72 (câu hỏi 2); bản ghi n19). Bản Peters trên Mutopia ghi *pas vite*. Hai bản in đọc được trên Internet Archive không ghi chỉ dẫn tốc độ cho số 1: bản Schuberth 1867 (Klauser) và một bản không ghi tên. Cả hai bản ấy vẫn ghi "Nicht schnell" ở số 3 và số 5. Chưa xem được bản in đầu hay bản Henle. Người giao quyết: nếu bản gốc không có, sửa ba chỗ (Diễn tấu, câu hỏi 2, `thong_tin`) thành "Schumann không ghi chữ chỉ tốc độ; bản Peters ghi *pas vite* (không nhanh)".
- **Trang La candeur n2**: câu "tập étude được yêu thích nhất của Burgmüller" là đánh giá, không có nguồn đo. Câu này có cả trong `description`.

## Người giao cần làm

1. Áp dụng `sua-B.yml`, rồi thêm `doi_chu` cho dòng Hình thức của bảng thông tin trên trang schumann-album, vì chữ do `::hop-tac-pham` dựng khác trang cũ.
2. Chạy `npm run build:xem` và `node tools/chuyen/so-chu.mjs <trang> --doi-chu` cho ba trang, để kiểm `doi_chu` viết tay. Đáng soát nhất là khối ABC và các đoạn có link "sắp có".
3. Quyết hai chỗ chưa chắc ở trên.
4. Ghi chú cho lô chuyển `burgmuller-arabesque`: câu "ở lại đó đến cuối đời" sai (n16, n18 của trang La candeur).

## Nguồn hay dùng

- Mutopia: file .ly, PDF (vẽ bằng PDFKit qua Swift) và MIDI tải mới. Bản 202 (Litolff) và 2080 (Schirmer 1904) là phạm vi công cộng. Op. 68 gồm 647, 655, 659, 676, 650 (Peters, CC BY-SA 2.5).
- IMSLP: đọc wikitext qua `api.php?action=parse&prop=wikitext` (tên bài, lần in đầu, bản thu, giấy phép bản thu).
- Henle HN 45: PDF lời tựa và Bemerkungen tải được từ trang sản phẩm (`henle.de/media/…-sync.pdf`). Hai file này chứa gần hết lịch sử của Op. 68 (Haushaltbuch, Breitkopf, Schuberth, Richter, "40 Clavierstücke", 2000 bản, thư gửi Reinecke, bản in 12/1848, 12/1850, 1859).
- Tchaikovsky Research: trang Children's Album và The Maid of Orleans.
- Deutsche Biographie (GND 117168890) cùng bài NDB, BnF: tiểu sử Burgmüller.
- Internet Archive: hai bản in Op. 68 để xem chỉ dẫn tiếng Đức.
- Wikisource (de): văn bản Haus- und Lebensregeln.
- CNRTL (candeur); từ điển Ushakov trên gufo.me (песенка); KTH (âm piano tắt dần sau khi đánh).
- Đo chroma bằng librosa trên file `public/audio/schumann-album-8.mp3`: Wilder Reiter chơi đoạn A một lần, xác nhận ghi chú `note` của bản thu.
