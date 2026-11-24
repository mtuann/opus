# Thêm tác phẩm: Bach, Prelude và fugue Sol thứ BWV 861

Nhánh `them/bach-prelude-fugue-sol-thu`, 24/11/2026. Lượt 10 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, ứng viên b1 của `plans/ben-vung/khao-sat-dot-4.md` (chủ repo duyệt 24/11/2026).

## Kết quả (lượt 1)

- Trang `piano/tac-pham/bach-prelude-fugue-sol-thu` (chặng 7, grade "Sau Grade 8"), bản ghi `bach-prelude-fugue-sol-thu`, dòng `trang.yml`, hai hồ sơ. Chặng 7 có bài Baroque đầu tiên.
- Cấp độ: ABRSM ARSM (danh sách tháng 6/2024); Henle HN 14: prelude mức 5, fugue mức 6, nhãn "ABRSM: Piano ARSM".
- Bản nhạc: bản quét Bach-Gesellschaft Band 14 (IMSLP #173661): prelude ở trang PDF 57, fugue ở trang 58–59. Đối chiếu với Mutopia (prelude id 806, fugue id 805, đều theo Bach-Gesellschaft 1866, phạm vi công cộng). Bản kern `wtc1p16`, `wtc1f16` chỉ dùng trên máy: một script đọc kern tìm mọi lần vào của chủ đề và đối đề.
- Ba trích đoạn: prelude ô 1–2, fugue ô 1–4 (chủ đề, đáp đề, đối đề), fugue ô 28–29 (stretto ba bè). Hai bài tập soạn riêng có số ngón (láy rền viết ra từng nốt; một bè chia cho hai tay), thêm một danh sách tập theo bè.
- Cấu trúc fugue đọc từ bản số và bản in: phần trình bày theo thứ tự alto, soprano, bass, tenor; 16 dòng lần vào; stretto hai bè ở ô 17 (bass, rồi alto nửa ô sau), stretto ba bè ở ô 28–29 (soprano, tenor, bass, mỗi bè cách nửa ô); đối đề đi cùng mọi lần vào trừ ô 1, 23, 28–29 và 33 (khớp Earsense).
- Bản thu: Kimiko Ishizaka, CC0, Commons, phát được, hai phần (Prelude 134,23 s; Fugue 113,49 s). 13 mốc: căn bằng `tools/audio/align` với MIDI Mutopia, cấu hình tạm ngoài repo, không sửa `pieces.py`; rồi kiểm từng mốc bằng `explore.py onsets`. Sửa hai mốc theo khởi âm: ô 17 thành 184, ô 28 thành 217. Bỏ một biến thể căn sai ở ô 33. Cách đo ghi ở `ghi_chu` của hồ sơ trang.
- Hồ sơ lượt 1: trang có 46 nhận định (một câu `da-sua`: "bốn móc đơn" thành "ba móc đơn") và 5 khuông; bản ghi có 14 nhận định. Xuất cho lượt 2: 53 nhận định.

## Chỗ chưa chắc

- Kern ô 28 soprano phách 3 ghi Fa♮4; bản in Bach-Gesellschaft và Mutopia ghi Fa♯4. Trang theo bản in.
- Lần vào alto ô 23 có đầu chủ đề đổi nhịp và đuôi đổi. Trang tính nó là một lần vào; có tài liệu phân tích có thể không tính.
- Ô 13 bass, trang gọi là "dạng đáp đề, Fa trưởng": suy từ các nốt (Si♭ Rê Fa Mi♮ Fa), không có nguồn phân tích riêng.
- Câu về các nghệ sĩ thu âm (Gould, Richter, Schiff, Hewitt, Leonhardt) dùng lại nguồn MusicBrainz của hồ sơ đã khóa BWV 847; lượt 1 không mở lại.
- Mốc 217 (ô 28): khởi âm Rê5 lẫn với Rê4 cùng lúc; ước ở khoảng 83,25 s trong phần, giữa 217 và 218.

## Chỗ vướng quy trình

1. `them-tac-pham.mjs --grade "ARSM"` bị từ chối vì không hợp chặng 7; phải dùng "Sau Grade 8". Tên bằng ARSM nằm ở dòng Độ khó.
2. `scratchpad/pylib/yaml` rỗng (chỉ còn `__pycache__`), nên `.venv-audio` không import được PyYAML. Đã dùng một thư mục riêng có symlink tới PyYAML của miniconda.
3. Bộ căn cho kết quả lệch ở một số dòng (biến thể "khởi âm" ở dòng 2, 3, 13; dòng 10, 12 lệch khoảng 0,4 s). Cần kiểm bằng `onsets` như đã làm.

## Việc ngoài phạm vi (nhánh `mo/` sau đợt)

- `piano/tac-pham-theo-cap`: thêm BWV 861 vào chặng 7.
- `piano/tac-pham/bach-prelude-fugue-do-thu` (đã khóa): mục Học tiếp đang gợi ý "các fugue ba bè khác… BWV 846 có bốn bè"; có thể thêm link sang bài này.
- `hinh-thuc/fugue` (đã khóa): có thể link sang bài này làm ví dụ stretto.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 24/11/2026. Mọi nhận định của hai hồ sơ có `review`: `dung`, trừ n24 của trang (`sai`, đồng ý với lượt 2; đã sửa).

- **n24 (lượt 2 sai):** chủ đề fugue là ba móc đơn Rê – Mi♭ – Sol (bước nhảy quãng 6 thứ), rồi **hai** móc đen Fa♯ – Sol; nửa sau, sau lặng móc đơn, là nhóm La Si♭ (móc kép), Đô (móc đơn), Si♭ La (móc kép), kết Si♭ móc đen. Câu cũ bỏ mất Sol móc đen và gọi nhóm có Đô móc đơn là "chuỗi móc kép". Sửa câu ở mục Fugue ô 1–4, dòng Theo dõi khi nghe và mục Phát âm ("giữ đủ hai nốt móc đen, nối liền nhóm móc kép"), theo bản quét tr. 58 hệ 1 và khối abc 2.
- **Ghi chú lượt 2:** n26, n27 viết rõ "nửa phách sau khi bè trước chạm nốt móc đen thứ nhất, lúc nốt ấy còn đang ngân" (mục Fugue ô 1–4 và câu sau khối 3). n20: bản quét tr. 57 cho thấy cuối ô 12 bè trầm lên Fa♯ (cảm âm của Sol thứ), ô 13 mở bằng hợp âm Sol thứ; bảng prelude sửa "từ ô 14" thành "cuối ô 12 … từ ô 13 nhạc về lại Sol thứ". n16: thay nguồn nghiệp dư bach-cantatas.com của lượt 2 bằng API MusicBrainz (nguồn của lượt 1, có hãng và số đĩa: Sony, RCA, Decca, Hyperion, Deutsche Harmonia Mundi/BMG); trang Hyperion chặn máy. n22: thêm nguồn gốc C. P. E. Bach, *Versuch* I.2.3 §5 ("always starts from the second above the main tone") và bảng *Explication* của J. S. Bach (Commons), cả hai là nguồn của trang đã khóa `piano/not-hoa-my`; đủ, không cần Duffin.
- **Soprano ô 15:** bản quét tr. 58 (400 dpi) có dấu bình trước Mi4 (Mi♮), Mutopia ghi Mi♭. Trang theo bản in: dòng "15–16 Soprano, Chủ đề, Fa trưởng" khớp; không khối abc và không câu nào nói Mi♭ ở ô 15.
- **Khuông nhạc:** ba trích đoạn so từng nốt với bản quét ở 300–600 dpi (prelude ô 1–2; fugue ô 1–4; ô 28–29 cả bốn bè, Fa♯4 soprano ô 28 có dấu thăng in): khớp, đếm đủ 16 móc kép mỗi bè mỗi ô, kể cả ô đầu. Hai bài tập soạn: đủ phách mọi bè, hòa âm Sol thứ – át – Sol thứ, số ngón chơi được; lời kèm bài tập 2 sửa "ngón 5 vẫn giữ nốt Sol cao" thành "giữ" (ô 2 là nốt Sol mới, ô 1 giữ Si♭).
- **Sự kiện ngẫu nhiên (đều đúng):** thứ tự 16 của BWV 861 (Henle HN 14), ba nhà in khoảng 1800 (blog Henle), danh sách ARSM 6/2024 chỉ có BWV 857, 859, 861 của quyển 1, câu bàn đạp của Schiff (PDF HN 14), mức Henle 5 và 6, alto ô 23 có Rê đầu chủ đề là móc kép (bản quét tr. 59).
- **Mốc:** đo lại onset (librosa CQT) trên mp3 Commons tải lại: Si♭3 ô 7 prelude 39,45 s; Sol2 ô 18 110,04 s; fugue Rê3 bass ô 5 13,18 s, Fa3 bass ô 17 50,11 s, Sol3 ô 20 59,39 s, Rê4 tenor ô 33 98,92 s (cộng 134,23 s): mốc 39, 110, 147, 184, 194, 233 đều trong 0,5 s, không sửa.
- **Bản thu:** API Commons cho cả hai file: CC0, `licUrl` creativecommons.org/publicdomain/zero/1.0, "performed by Kimiko Ishizaka", 134,23 s và 113,49 s: khớp `ban_thu`.
- **Chữ, thuật ngữ:** chủ đề, đáp đề, đối đề, đoạn chuyển, stretto, láy rền, âm nền, nốt treo, cảm âm, chuỗi, quãng 3 Picardy khớp `thuat-ngu.yml`. Phần fugue đọc được cho người tự học sau khi viết rõ hai nửa chủ đề và chỗ các bè vào.
