# Thêm tác phẩm: Scarlatti, Sonata La trưởng K. 208 (L. 238)

Nhánh `them/scarlatti-k208`, 24/11/2026. Lượt 10 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, mục "Scarlatti" của `plans/ben-vung/khao-sat-dot-4.md` (chủ repo duyệt 24/11/2026). Lượt 1.

## Kết quả

- Trang `piano/tac-pham/scarlatti-k208` (chặng 5, Grade 6), bản ghi `scarlatti-k208` (tác giả `scarlatti` đã có, `thoi_ky: Baroque`), dòng `trang.yml`, hai hồ sơ. Không `cap`: K. 208 không nằm trong `nghe-nhac/scarlatti-sonata`, trang chỉ link bằng chữ.
- Cấp độ: ABRSM Grade 6, danh sách A, ở cả bốn kỳ 2021–2028; RCM 2022 Level 7; Henle HN 581 mức 4 (ghi ABRSM Grade 6). Chỗ đứng: bài Baroque duy nhất ở chặng 5 (sau hai bài Bach chặng 4, trước BWV 847 chặng 6), bài học Scarlatti đầu tiên.
- Bản nhạc: nốt trích đoạn (ô 1–3) chép từ bản quét Longo (Ricordi 1906, tập 5, E.R. 545, tr. 147–148, số 238; `reference-edition/L238K208.pdf` của `craigsapp/scarlatti-keyboard-sonatas`), soát với PDF Gouin (IMSLP #293023) và MIDI Gouin (#293026, đọc bằng mido). Ba ô này hai bản giống nhau từng nốt; không chép sắc thái, luyến, staccato, ngón, tenuto của Longo.
- Trang dùng chỉ dẫn gốc *Adagio e cantabile*, có mục "Longo thêm gì": Longo đổi thành *Andantino cantabile* (♩ = 72), thêm sắc thái, luyến dài, staccato tay trái, ngón; thay chữ *tremulo* ở ô 15 bằng dấu *tr*; sửa nốt ở ô 4, 13, 20, 22 (cách viết "C. V." in ở chú thích). Bản Gouin ô 4 khớp cách viết C. V. của Longo, nên coi Gouin là theo bản chép tay Venice.
- Ba bài tập soạn riêng (4 khối abc: tay trái đều/tay phải hát; nốt dựa, cách viết và một cách chơi; trill kết câu). Tổng 5 khối abc, `tools/khuong-nhac.mjs`: 0 lỗi.
- Bản thu: Robert Stephen Hill, fortepiano, IMSLP #961413, "Public Domain", chỉ dẫn link (`d` 281,19 s theo ffprobe FLAC). Đo: đàn thấp hơn La 440 một nửa cung (nghe như La♭ trưởng), **có chơi cả hai dấu nhắc lại**, khoảng ♩ = 45–48. Trang nói rõ fortepiano khác piano hiện đại và lên dây thấp.
- Mốc (11 dòng): `0 14 18 34 51 75 150 160 186 206 245`. Căn bằng `tools/audio/align/run.py` với cấu hình tạm ngoài repo (scratchpad `scarlatti-k208/align_k208.py`, MIDI Gouin chép vào bộ đệm riêng tên `imslp_Scarlatti_K208.mid`, `tuning -1`); không sửa `pieces.py`, `sources.json`. Dòng 6 (nửa đầu nhắc lại) run.py cho 78,5 s; khởi âm và sắc âm cho 75,2 s, ghi 75. Dòng 11 soát lại bằng khởi âm (245,2 s).
- Sơ đồ `hinh`: bốn ô theo thời gian bản thu (nửa đầu 75, nhắc lại 75, nửa sau 56, nhắc lại 72 s).

## Kiểm định

Lượt 1: 38 nhận định trang (2 `ve-site`), 11 nhận định bản ghi, 5 khối `khuong_nhac`. Xuất lượt 2: `node tools/khoa.mjs xuat piano/tac-pham/scarlatti-k208 du-lieu/tac-pham/scarlatti-k208` → 46 câu (file ở scratchpad `scarlatti-k208/luot2/xuat.yml`). Chưa lượt 2, review, kiểm mẫu, chưa khóa.

## Chỗ chưa chắc

- Bản chép tay (Venice, Parma) không xem trực tiếp: "chữ của bản chép tay" dựa vào bản Gouin (IMSLP ghi "Urtext keyboard score") và chú thích C. V. của Longo.
- Năm viết K. 208 không rõ; trang không nêu năm (không có nguồn chắc cho năm của tập Venice III).
- *Tremulo*: trang dẫn Dolmetsch (nốt phụ phía dưới, khác trill), ghi rõ là ý của Dolmetsch; cách hiểu này còn tranh luận.
- Số IMSLP #914846 (Longo) và #961413 lấy từ khảo sát (HTML trang tác phẩm); API wikitext không có số chỉ mục.
- Nốt dựa ô 1: trang đưa "một cách chơi" theo quy tắc C. P. E. Bach (hai phần ba), ghi rằng có thể ngắn hơn (MIDI Gouin lấy khoảng một phần ba).
- Bản thu fortepiano thấp nửa cung: người học dùng máy đếm nhịp hay chơi theo sẽ nghe lệch giọng; trang đã báo.
- Trang Henle chặn User-Agent không có "Mozilla" (404); link vẫn đúng khi mở bằng trình duyệt.

## Chỗ vướng của quy trình

1. `run.py` chỉ đọc cấu hình trong `pieces.py` (ngoài phạm vi nhánh `them/`): phải viết bọc tạm chèn `PIECES` và dùng `OZ_AUDIO_CACHE` riêng cho MIDI chưa có trong `sources.json`.
2. `scratchpad/pylib` chung (PyYAML) bị hỏng giữa chừng (thư mục `yaml/` chỉ còn `__pycache__`, có lẽ do agent khác cài lại); đã cài bản riêng vào `scarlatti-k208/pylib`.
3. run.py bắt nhầm đầu lần nhắc lại (78,5 thay vì 75,2 s) dù hai biến thể khớp nhau: với bản nhắc lại nguyên văn, nên soát tay mốc đầu lần nhắc.

## Việc ngoài phạm vi (nhánh `mo/` sau đợt)

- Thêm K. 208 vào bảng chặng 5 của `piano/tac-pham-theo-cap` (có link để `tests/tac-pham-theo-cap.test.mjs` bắt) và, nếu cần, dòng Scarlatti ở `piano/nha-soan-nhac`.
- Có thể thêm K. 208 vào mục "Nếu bạn muốn chơi" của `nghe-nhac/scarlatti-sonata` (đã khóa).
- Thêm MIDI Gouin K. 208 vào `tools/audio/align/sources.json` (bộ `imslp-outremontaises`, `manual: true`, sha256 `f253c9625ea75f7e55db9d40634e17be4e90ef4b2c4754e2f6ce093c51b2caec`) và cấu hình `scarlatti-k208` vào `pieces.py` (rows như hồ sơ trang, `tuning=-1`, `fix={5: 75.2}`).
