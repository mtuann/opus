# Thêm tác phẩm: Chaminade, *Automne* Op. 35 số 2

Nhánh `them/chaminade-automne`, 17/11/2026. Lượt 6 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, bài thứ ba của đợt 3 (nhà soạn nhạc nữ), thay Hensel *Mélodie* Op. 4 số 2 (không có bản thu được nhận, chốt 16/11/2026).

## Kết quả

- Trang `piano/tac-pham/chaminade-automne` (chặng 7, sau Grade 8), bản ghi `chaminade-automne`, dòng `trang.yml`, hai hồ sơ.
- Cấp độ: đề cương RCM 2022 đưa *Études de concert* Op. 35 (bài bất kỳ) vào danh sách etude của bằng ARCT (tr. 107 của file); pianosyllabus.com ghi bài ở AMEB AMusA, LCM DipLCM (và Trinity ATCL, theo lượt 2; trang không nêu). ABRSM 2025–2026 không có bài này.
- Bản nhạc: bản quét IMSLP #768244 (bản in Enoch, bản khắc E. F. & C. 1312; bìa ghi "Enoch & Cie", lần in sau từ cùng bản khắc). Năm in lần đầu 1886 theo mục lục BnF (cả tập và *Automne* riêng) và IMSLP (BdlF 6/11/1886). Khảo sát G6 ghi số bản khắc 1316: đó là số của cả tập (và *Tarentelle*); *Automne* là 1312.
- Trích đoạn: ô 1–2, chép tay từ bản quét (đo dòng kẻ và đầu nốt bằng máy). Ba bài tập soạn riêng.
- Bản thu: eldüendesüarez, Commons, CC BY-SA 4.0, phát được (385,64 s). 16 mốc; phần A và A trở lại lúc đầu ước theo số ô (khoảng 4,24 s mỗi ô 4/4, ♪ ≈ 113), lượt 2 và review đo lại bằng chroma và onset (xem Review).

## Chỗ chưa chắc

- Bản in có dấu ⊕ kèm "(1)" ở tr. 15 và ⊕ ở tr. 16 (có thể là chỗ được phép cắt) nhưng không in chú thích; trang không nói tới. Người chơi trong bản thu chơi đủ.
- Trang không nêu số ô ngoài ô 1–2; đoạn sau mô tả theo chữ chỉ dẫn và sắc thái.
- Nghĩa *slargando*, *calmato*, *tutta forza*, *a piacere* lấy theo Dolmetsch (không có trong Từ điển của site); lượt 2 không mở được Dolmetsch (Cloudflare), người gom đọc được bằng User-Agent của dự án.

## Kiểm định

Lượt 1 (Claude): 31 nhận định trang, 14 bản ghi, 4 khuông. Lượt 2 (agent riêng, 43 câu): 42 đúng, 1 sai (hai mốc cuối 303, 341 thành 307, 348). Review (agent thứ ba): xem dưới. Kiểm mẫu: Claude (agent riêng) kiểm thay chủ repo, 5/5 đúng (trang n3, n18, n21, n25; bản ghi n10). Khóa trang và bản ghi 17/11/2026.

## Chỗ vướng của quy trình

1. `them-tac-pham.mjs` vẫn chép `--ten` vào `title` và sinh `giong`, `nhip` (bài này một bài nên dùng được).
2. `khoa.mjs nhap` đòi link nguồn cho câu `vi-du-soan` của lượt 2 (bài tập soạn riêng, không có nguồn ngoài): người gom thêm link trang IMSLP và ghi rõ trong ghi chú. Nên cho `vi-du-soan` như `khuyen-tap`.
3. Mốc ước theo số ô lệch tới 8 s ở đoạn giữa (tốc độ đổi nhiều): với bài nhiều *stringendo*/*slargando* nên đo bằng chroma, onset ngay từ lượt 1.

## Việc ngoài phạm vi (nhánh `mo/` sau đợt 3)

- `piano/tac-pham-theo-cap`: thêm *Automne* (chặng 7), cùng *Pierrette* và Scherzo của Clara Schumann.
- `lich-su/nu-nha-soan-nhac`: link sang ba bài học đợt 3.
- `ke-hoach` và mục 6.1 của `ke-hoach-mo-rong.md`.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 17/11/2026. Mọi nhận định của hai hồ sơ có `review`: `dung`, trừ n16 của trang và n10 của bản ghi (`sai`, đã sửa).

- Kiểm lại trên nguồn: bản quét #768244 tr. 9–12, 14–15 (110–450 dpi): Lento ♪ = 112, Con fuoco ♩ = 84, đề tặng Hélène Kryzanowska, số bản khắc E. F. & C. 1312, ô đầu Con fuoco trên Fa thứ, Poco più largo appassionato, ff rapido energico với m.g., Ped. ở ô 2–4. Trang mô tả Commons (API, User-Agent `opus-kiem-dinh/1.0`): `{{cc-by-sa-4.0}}`, ngày 2023-11-03, 385,64 s; mp3 tải lại đo ffprobe 385,64 s. Đều khớp.
- Khối abc 1 (ô 1–2) so từng nốt với tr. 9 hệ 1 ở 400–450 dpi: nốt, trường độ, bè, dấu nối, luyến, *p* khớp; không sửa. Ba bài tập soạn: đủ nhịp, hòa âm (Rê♭ trưởng; Fa thứ, Si♭ thứ; I–IV–V–I, quãng mười), số ngón và lời kèm đúng.
- Mốc (librosa CQT, chroma, onset trên mp3 Commons, đối chiếu bản quét): hai mốc lượt 1 ước theo số ô lệch rõ: *Poco più largo* ở 131,0 s (tay trái Đô♭3–Sol♭3–Mi♭4), không phải 127 (127 còn ở ô *ff* của Con fuoco); *p* ở âm vực trầm ở 143,9 s, không phải 136 (136 là hợp âm ngân cuối ô 2 của Poco più largo, sau đó còn hai ô *sff*). Thêm bốn mốc chỉnh theo onset: 47 thành 46, 67 thành 66, 224 thành 223 (*ff rapido energico*: Sol♮1 ở 223,0 s), và hai mốc lượt 2 307 thành 306, 348 thành 347 (onset 306,4 và 347,4 s; cùng độ lệch 240 s với lần đầu ở 66,0 và 104,8 s). 160, 187, 237, 265 đo lại khớp trong 1 s. Ghi bằng `attach.py --ref`: `0 26 46 66 105 117 131 144 160 187 200 223 237 265 306 347`.
- Sơ đồ `hinh`: ô Coda (ô 2/4 *pp*, *p ma marcato*, *rit. a piacere* theo bảng Cấu trúc) bắt đầu 347 s, không phải 349: A (Lento, pp) 112 thành 110, Coda 30 thành 32; tổng vẫn 379 s.
- Sửa chữ: mục Vì sao bỏ vế "Bài dài khoảng sáu phút" lặp câu mở đầu; Lỗi thường gặp "*Ff* và *fff* gắt" thành "Tiếng *ff* và *fff* gắt", "*Rit. a piacere* ở cuối" thành "Chỗ *rit. a piacere* cuối bài" (không viết hoa ký hiệu). Thuật ngữ khớp `thuat-ngu.yml` (stringendo, allargando, a tempo, dolce, con fuoco, appassionato, agitato, energico, marcato); slargando, calmato, a piacere, tutta forza không có trong Từ điển, nghĩa theo Dolmetsch.
