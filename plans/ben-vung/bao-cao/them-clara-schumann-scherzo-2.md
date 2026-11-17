# Báo cáo: thêm Clara Schumann, Scherzo số 2 Đô thứ, Op. 14 (lượt 5 của lộ trình)

Nhánh `them/clara-schumann-scherzo-2`, 17/11/2026. Lượt 5 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, bài thứ hai của đợt 3 (nhà soạn nhạc nữ).

## Op. 15 hay Op. 14

Lộ trình dặn tìm lại bản thu mở cho Op. 15 trước khi viết. Trang IMSLP *4 Pièces fugitives*, Op. 15 không có bản thu (chỉ một link YouTube ngoài); Commons không có bản thu nào khi tìm "Clara Schumann Op. 15" và "Clara Schumann Scherzo" (17/11/2026). Nên giữ Op. 14.

## Kết quả

- Trang `piano/tac-pham/clara-schumann-scherzo-2` (chặng 6, Grade 8 ước lượng), bản ghi, dòng `trang.yml`, hai hồ sơ.
- Cấp độ: Op. 14 không có trong đề cương ABRSM 2021–2022, 2023–2024, 2025–2026. Bằng chứng gần nhất: ABRSM 2025–2026 xếp Op. 15 số 4 (Scherzo) ở Grade 7 và Op. 15 số 2 ở Grade 8; Op. 14 dài và nhiều hợp âm lớn hơn, nên ước Grade 8 và ghi rõ "ước lượng".
- Trích đoạn: ô 1–5, chép tay từ bản quét Breitkopf & Härtel *Pianoforte-Werke* [1879] (IMSLP #611197); vị trí dòng kẻ và đầu nốt đo bằng máy ở 500 dpi. Ba bài tập soạn riêng.
- Bản thu: Luis Kolodin, CC BY-SA 4.0, chỉ dẫn link (251,48 s); `note` ghi nhà phát hành Felipe Sarro như IMSLP. 10 mốc theo khoảng lặng và độ to.

## Chỗ chưa chắc

- Bản in đầu 1845 không có bản quét mở; số máy đếm nhịp (nốt trắng chấm dôi = 88) ghi là của bản Breitkopf 1879.
- Hai mốc (chủ đề trở lại, *Tempo I*) ước theo số ô và độ to, có thể lệch vài giây.
- Trang không nêu số ô ngoài ô 1–5.

## Kiểm định

Lượt 1: 22 nhận định trang, 12 bản ghi, 4 khuông. Lượt 2 (agent riêng, 32 câu): 32 đúng; ghi chú: trio có một dấu *mf* (tr. 5 hệ 4), chữ *ben legato* ở nửa sau tr. 5 hệ 2; nguồn thêm NDB, Britannica, Treccani. Review (agent thứ ba) sửa năm chỗ (mục Review). Kiểm mẫu: Claude kiểm thay chủ repo, 5/5 đúng. Khóa 17/11/2026; `npm run build` bản thật, `npm test`, Chromium đạt. Gộp `main` ở máy, chưa push.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 17/11/2026. Mọi nhận định của hai hồ sơ: `review: dung`.

- Kiểm lại trên nguồn: bìa và tr. 2, 5, 6, 7, 9 của bản quét #611197 (300–600 dpi); IMSLP qua API wikitext (giọng, năm viết, năm in, đề tặng, tên khác, phong cách, bản in 1879 số 15120, bản thu Kolodin, Sarro, CC BY-SA 4.0); PDF ABRSM 2025 & 2026 (tr. 40, tr. 43, không có Op. 14). Đều khớp.
- Khối abc 1 (ô 1–5) so từng nốt: nốt, trường độ, nối vạch, dấu hóa, dấu nhấn, dấu nối Rê3, Fa3, sắc thái khớp. Thiếu hai vòng luyến từ hợp âm ô 3 sang ô 4 (La♭3 sang Sol3, Đô3 sang Si♮2): đã thêm một vòng luyến bọc hai hợp âm. Ba bài tập soạn: lời kèm, hòa âm, số ngón đúng.
- Mốc (đo chroma và độ to bản thu): chủ đề trở lại ở 71,8 s, không phải 69 (69 là ô tay trái rải Sol đi lên, bốn ô trước); hợp âm *f* "tay trái sang khóa Sol" ở 63,1 s, không phải 61. Đã ghi lại `0 40 63 72 95 97 106 182 232 246` bằng `attach.py --ref`. *Tempo I* ở 182,2 s: 182 đúng. Sơ đồ `hinh` đổi theo: 40, 23, 34, 84, 51, 18.
- Sửa chữ: mục Sắc thái "Trio nhỏ (*p*)" thành "Trio bắt đầu nhỏ (*p*) và liền tiếng; về sau có dấu *mf*, to hơn một chút" (dấu *mf* ở ô cuối tr. 5, sau đó tới hết trio không còn dấu sắc thái nào); nghĩa *Con fuoco* "nồng nhiệt" thành "rực lửa" (trang và bản ghi) cho khớp `thuat-ngu.yml`.

## Việc ngoài phạm vi

- `lich-su/nu-nha-soan-nhac` (đã khóa): thêm link sang bài này và bài Chaminade, ở nhánh `mo/` sau đợt 3.
