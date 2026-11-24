# Báo cáo: thêm Haydn, *Finale* (Presto), chương 3 Sonata Sol trưởng Hob. XVI:27 (lượt 10 của lộ trình)

Nhánh `them/haydn-xvi-27`, 24/11/2026. Lượt 10 (đợt 4) của `plans/ben-vung/lo-trinh-them-tac-pham.md`, theo mục "1. Haydn" của `plans/ben-vung/khao-sat-dot-4.md` (chủ repo duyệt 24/11/2026). Tới lượt 1 kiểm định: chưa có lượt 2, review, kiểm mẫu; chưa khóa.

## Kết quả

- Trang `piano/tac-pham/haydn-xvi-27` (chặng 5, Grade 6 ước lượng), bản ghi `haydn-xvi-27` cuối `tac-pham.yml`, dòng `trang.yml`, hai hồ sơ (trang: 38 nhận định, 5 khuông; bản ghi: 11 nhận định). Bài học Haydn đầu tiên của site.
- Cấp độ (đọc lại 24/11/2026): RCM Piano Syllabus 2022, tr. 73, Level 8, List B ("3rd movement: Finale"); Henle HN 1338, mức 5 cho cả sonata; ABRSM 2025–2026 và 2027–2028 không có XVI:27 (khảo sát đọc 2011–2028). Quy ra Grade 6 (ước lượng), chặng 5. Đối chiếu: RCM Level 8 cũng có Beethoven Op. 49 số 2, site đang để Grade 5, chặng 4.
- Hình thức (khảo sát chưa chắc): đọc bản Päsler, đây là **chủ đề và biến tấu**: chủ đề 24 ô (8 + 16, hai dấu nhắc lại), biến tấu 1 (móc kép), biến tấu 2 (*f*, móc kép liên tục), nửa đầu chủ đề trở lại một lần (ô 73–80, *mf*), đoạn Sol thứ (ô 81–104; không đổi hóa biểu, dấu giáng viết cạnh nốt; câu thứ hai viết ra hai lần), biến tấu cuối Sol trưởng (ô 105–152, tay trái móc kép liên tục, các lần nhắc lại viết ra và đổi khác). 152 ô không tính nhịp lấy đà. Kern ghi đoạn A–F có nhắc lại rồi G, khớp. Trang không gọi là rondo-biến tấu (không có nguồn ngoài gọi tên); chỉ mô tả việc nửa đầu chủ đề trở lại trước đoạn Sol thứ.
- Trích đoạn: hai khối. (1) Nhịp lấy đà và ô 1–8 (chủ đề, hai tay); (2) nhịp lấy đà và ô 25–28 (biến tấu 1), để đặt cạnh ô 1–4. Chép tay từ bản quét Päsler (IMSLP #472026, trang PDF 7), đối chiếu Mutopia id 187: cùng nốt, trừ hai chỗ trang theo Päsler: láy ô 8 (Päsler răng cưa không gạch, Mutopia `\mordent`), nốt cuối ô 28 (Päsler Si4, Mutopia Sol4). Ba bài tập soạn riêng (hợp âm rải trong lòng bàn tay; móc kép quay quanh một nốt; tay trái chạy móc kép), có số ngón.
- Bản thu: Luis Kolodin (IMSLP #836476, CC BY-SA 4.0, "Luis Kolodin, 2020"), chỉ dẫn link, `d` 193,26 s (ffprobe file tải tay). Mười mốc: `2 16 42 83 122 129 151 157 164 177`.

## Mốc

- `tools/audio/align` với MIDI Mutopia (cấu hình tạm ngoài repo, script ở thư mục nháp `haydn-xvi-27/run_tam.py`; MIDI chép vào bộ nhớ đệm `scores/mutopia_hob-xvi-27-iii-presto.mid`), `segs` mở cả 6 dấu nhắc lại: `explore.py structure` cho cách nối này tốt nhất (chi phí 0,357, biến thiên tốc độ ±0,2), nên người chơi giữ mọi dấu nhắc lại.
- Biến thể thường và khởi âm khớp trong 1,5 s; biến thể thô→mịn hỏng ở mọi dòng trừ dòng 1. Mỗi mốc kiểm lại bằng `explore.py onsets`; sửa hai dòng so với số căn ra: biến tấu 1 (42, căn ra 43: nhịp lấy đà 42,12 s) và đoạn *p* ô 113 (157, căn ra 158: hai móc kép lấy đà 157,34 s). Chi tiết từng mốc trong `ghi_chu` hồ sơ trang.
- Không thêm vào `pieces.py`, `sources.json`, `align/NGUON.md` (ngoài phạm vi nhánh). Cấu hình nếu muốn giữ: `dict(src="mutopia_hob-xvi-27-iii-presto.mid", segs=[(0,7),(0,7),(8,23),(8,23),(24,31),(24,31),(32,47),(32,47),(48,55),(48,55),(56,71),(56,71),(72,151)], rows={0:(0,"first"),1:(2,8),2:(4,24),3:(8,48),4:(12,72),5:(12,80),6:(12,104),7:(12,112),8:(12,120),9:(12,136)}, fix={2:42.1, 7:157.3})`.

## Nguồn

- Ấn bản: *Joseph Haydns Werke*, Serie XIV, Bd. 2 (Päsler), Breitkopf & Härtel 1918, IMSLP #472026 (bản quét 10 trang, không có bìa; năm, tập theo IMSLP).
- Đối chiếu: Mutopia id 187 (`.ly`, `.mid`, PD, theo Peters 1880s); kern `sonata42-3.krn` (CC BY-NC-SA, chỉ dùng trên máy để đếm ô, soát đoạn).
- IMSLP wikitext trang tác phẩm (năm 1774–76 ca, in 1778, Op. 14 số 1, Klaviersonate Nr. 42, chương và Trio Sol thứ; bản thu Kolodin) và danh sách tác phẩm Haydn (nhóm Hob. XVI).
- Henle HN 1338 (mức 5; niên biểu 1776 về Eszterháza), RCM 2022 (tr. 64, 73), ABRSM 2025–2026, 2027–2028.

## Chỗ chưa chắc

- Grade 6 chỉ dựa trên RCM (một hội đồng) và Henle (cả sonata); RCM Level 8 trên site đang ứng với cả Grade 5 (Op. 49 số 2).
- Gọi hình thức "chủ đề và biến tấu" là đọc từ bản nhạc; không có nguồn ngoài gọi tên (n6 hồ sơ trang).
- Cách chơi láy trên ở ô 8 (Rê–Mi–Rê, đúng phách) theo trang `not-hoa-my` (cột thế kỷ 19); với nhạc Haydn những năm 1770 có thể bắt đầu từ nốt trên. Lượt 2 nên kiểm (n24).
- Ô 113–116: khuông dưới trống, mọi nốt viết ở khuông trên; bản Päsler không ghi tay nào chơi nốt nào (Mutopia cho tay trái lên khuông trên). Trang chỉ tả "mọi nốt ở âm vực cao, khuông dưới gần như nghỉ".
- Các dấu sắc thái trong ngoặc ở biến tấu cuối: trang chỉ ghi là "đặt trong ngoặc", không nói của ai.
- File IMSLP tải tay tên `.mp3` nhưng là MP4/AAC (DASH). Chỉ dẫn link nên không phát trên site; trình duyệt mở link IMSLP vẫn chơi được, nhưng `check_audio.py` (có ffmpeg) và librosa đọc qua audioread.
- `note` của bản thu ghi "IMSLP ghi năm 2020" (Publisher Information), không chắc là năm thu.

## Kiểm thử

- `node tools/khuong-nhac.mjs src/content/docs/piano/tac-pham/haydn-xvi-27.md`: 5 khối, 0 lỗi.
- `npm run build:xem` đạt. `npm test`: 356 đạt, 1 bỏ qua, 0 hỏng.
- `OPUS_TRINH_DUYET=chromium OPUS_TRANG=piano/tac-pham/haydn-xvi-27/ npm run test:trinh-duyet`: 429 đạt, 4 bỏ qua, 2 hỏng. Cả hai hỏng là `page.goto` quá 30 s ở trang khác (`minuet-sol`, `bach-invention-1#nguon`) khi máy quá tải (load average khoảng 15, các agent khác chạy song song; một phép thử kéo dài 1 036 s). Chạy lại riêng `kiem-tap-bai.mjs` và `kiem-thanh-phan.mjs` (cùng biến môi trường): 14/14 đạt. Mọi phép thử trên trang mới đều đạt.
- Sau commit: `tests/pham-vi.test.mjs`, `tests/tac-pham.test.mjs` đạt.

## Chỗ vướng của quy trình

- `scratchpad/pylib` của lời giao không còn PyYAML (thư mục `yaml/` chỉ còn `__pycache__`), nên `python -I` của `.venv-audio` không nhập được `yaml`; lượt này chép PyYAML vào `haydn-xvi-27/pylib` và chạy không `-I` với `PYTHONPATH`.
- `align/run.py` chỉ đọc cấu hình từ `pieces.py`: phải viết script bọc ngoài repo để chèn cấu hình tạm.

## Việc ngoài phạm vi (không làm)

- `piano/tac-pham-theo-cap` (đã khóa), mục "Chặng 5", dòng 167: "Haydn: Sonata Đô trưởng Hob. XVI:35" xếp thấp (RCM Level 10 cho cả sonata; khảo sát đợt 4). Nên thay bằng bài này (có link, chặng 5 khớp `tac-pham.yml`), và đưa XVI:35 lên chặng phù hợp hay bỏ.
- `piano/nha-soan-nhac` (đã khóa), mục Haydn, "Bắt đầu bằng": có thể thêm bài này (Hob. XVI:27, chương 3) với link.
- `hinh-thuc/bien-tau` (đã khóa), "Nghe thêm": có thể thêm bài này làm ví dụ biến tấu cho piano.
- Cấu hình căn mốc trong `tools/audio/align/pieces.py`, `sources.json`, `NGUON.md` (mục Mốc ở trên).

## Lượt 2

`node tools/khoa.mjs xuat piano/tac-pham/haydn-xvi-27 du-lieu/tac-pham/haydn-xvi-27`: 43 nhận định.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 24/11/2026. Mọi nhận định của hai hồ sơ có `review: dung`; sửa (`ket_qua: da-sua`) n6, n24, n27, n34, n36 của trang và n7, n9, n11 của bản ghi.

- **Dấu láy ô 8 (n24, n36; lượt 2 không chắc).** Bản quét ở 600 dpi và ảnh gốc (1836 × 2448 px): răng cưa ngắn hai đỉnh, có một nét nhỏ ở giữa nhô ra 1–2 px, không đọc chắc được là gạch dọc; Mutopia (theo Peters) ghi `\mordent` (láy dưới). Bản thu Kolodin (CQT): Rê5 7,93 s, Mi5 7,98 s, Rê5 8,06 s, tức Rê–Mi–Rê từ nốt chính. Trang viết lại: "thường được chơi như láy trên: Rê–Mi–Rê, bắt đầu từ nốt chính, thật nhanh, đúng phách; bản thu gợi ý cũng chơi như vậy. Có người chơi thành một láy rền ngắn bắt đầu từ Mi" (nguồn thêm: Dolmetsch, bài 23, Pralltriller và Schneller). Bỏ chữ "không gạch"; bảng Cấu trúc, Chỗ khó, Lỗi thường gặp và `ky_nang_chinh`/dòng Kỹ năng chính đổi "láy trên" thành "dấu láy". Bỏ câu hỏi về dấu láy (đáp án sai cũ "Rê–Đô♯–Rê" lại chính là cách đọc của Mutopia). Khối abc giữ `!uppermordent!`, khớp chữ mới.
- **Cấp độ.** Giữ Grade 6 (ước lượng), chặng 5. RCM 2022 tr. 73 và Henle (tải lại) khớp. So các bài RCM Level 8 trên site: Mendelssohn *Thuyền ca* (ABRSM 6, Henle 4) chặng 5; Beethoven Op. 49 số 2 (Henle 3, "dễ") chặng 4; Chopin Valse Si thứ (ABRSM 8) chặng 6. Bài này Henle 5 cho cả sonata, móc kép liên tục ở Presto: đứng cạnh Mendelssohn là nhất quán. Lý do ghi ở n4 (trang, bản ghi).
- **Hình thức.** Đếm lại trên bản in: chủ đề 1–24, biến tấu 25–48, 49–72, nửa đầu chủ đề 73–80, Sol thứ 81–104 (bốn hệ đầu trang PDF 9: 9 + 8 + 8 + 7 ô; câu 89–96 viết lại 97–104), biến tấu cuối 105–152: khớp. Không tìm được nguồn ngoài gọi tên hình thức chương này (IMSLP, Henle, Mutopia, hai lần tìm web). Trang bỏ câu "Bài là chủ đề và biến tấu" và câu hỏi "hình thức nào" (thay bằng câu hỏi về ô 73–80), chỉ tả "dựng trên một chủ đề và các biến tấu của nó"; chip và dòng Hình thức của bản ghi đổi theo.
- **Trích đoạn.** Khối 1 (lấy đà, ô 1–8) và khối 2 (lấy đà, ô 25–28) so từng nốt với bản quét ở 150–600 dpi, đo dòng kẻ: khớp, kể cả hai chỗ khác Mutopia (dấu láy ô 8; nốt cuối ô 28 tay phải là Si4, nằm trên dòng giữa). Ba bài tập soạn: nhịp, hòa âm, số ngón, lời kèm đúng.
- **Sự kiện kiểm ngẫu nhiên** (tải lại nguồn): năm 1774–76, in 1778; Klaviersonate Nr. 42, Op. 14 số 1; ba chương; Mutopia nguồn Peters 1880s, Public Domain; RCM tr. 73; Henle mức 5; giấy phép bản thu CC BY-SA 4.0: đều khớp.
- **Mốc.** Đo lại 16, 129, 157, 177 (onset, CQT): khớp, không đổi. `note` của bản thu đổi thành "IMSLP ghi thông tin phát hành “Luis Kolodin, 2020”" (đó là trường Publisher Information, không phải năm thu), ghi bằng `attach.py --note --keep-ref`.
- Thuật ngữ: láy trên, láy rền khớp `thuat-ngu.yml` (`mordent`, `trill`).

## Kiểm mẫu và khóa

Claude (agent riêng) kiểm thay chủ repo 5 nhận định mẫu (trang n21, n29, n32, n36; bản ghi n10) trên bản Päsler, IMSLP, Mutopia, Henle và bản thu: 5 đúng. Khóa trang và bản ghi 24/11/2026.
