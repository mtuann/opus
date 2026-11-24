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

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 24/11/2026. Mọi nhận định của hai hồ sơ có `review`: `dung`, trừ n23 của trang (`sai`, đã sửa). Đã sửa (`da-sua`): trang n6, n8, n12, n23, n33, n34, khối abc 3 và 4; bản ghi n10.

- **Mốc (n23).** Đo lại trên FLAC (librosa: khởi âm, CQT, cộng một nửa cung để đổi về nốt viết), đối chiếu MIDI Gouin: hợp âm Mi3 La3 Đô♯4 với La4 của ô 23 lần hai ở 248,0 s (245 rơi vào phách 3 ô 22): lượt 2 đúng. Thêm hai mốc: ô 23 lần một 187,0 s (thay 186, còn ở phách 4 ô 22); nửa sau nhắc lại 205,4 s (thay 206). Tám mốc còn lại khớp trong 0,5 s. Ghi bằng `attach.py --ref "0 14 18 34 51 75 150 160 187 205 248"`. Sơ đồ `hinh` theo mốc: nửa sau 55, nhắc lại 73 (thay 56, 72; tổng vẫn 278).
- **Khối abc 3, 4 (bài tập nốt dựa).** Ô 1 tay phải chỉ có 12 móc kép, tay trái 16: thiếu phách 4. Thêm Rê5 đen ở phách 4 (`c4 {f}e6 dc d4`); nốt dựa vẫn ở phách 2, lời kèm không đổi. `tools/khuong-nhac.mjs` không bắt lỗi này vì coi ô đầu là ô lấy đà, kể cả khi hai bè dài khác nhau (xem "Chỗ vướng" 4).
- **Trích đoạn ô 1–3.** So từng nốt với Longo tr. 147 (350–400 dpi, PDF tải lại, sha256 trùng bản lượt 1) và Gouin tr. 1 (300 dpi): nốt, trường độ, nốt nhỏ, tay trái khớp; không sửa. Ba bài tập còn lại (khối 2, 5): nhịp, hòa âm, ngón và lời kèm đúng.
- **Lưu ý của lượt 2.**
  - n12: Henle ghi "from 1728"; Treccani (*Dizionario Biografico degli Italiani*) ghi năm 1729 Scarlatti theo Maria Barbara tới Seville. Sửa thành "Năm 1729, sau khi bà kết hôn với thái tử Tây Ban Nha, ông theo bà sang Seville", thêm Treccani vào Nguồn.
  - n6: bản Gouin còn dấu láy ngắn ở ô 13 và ô 23 (Longo in *tr*). Chữ thành "một trill ghi *tr* (ô 11 và ô 25), ngoài vài dấu láy ngắn".
  - n19: thay Wikipedia bằng Nicholas Giordano, *Acoustics Today* 12/1 (2016) và ghi chú kèm bài: dây căng thấp hơn nên tiếng nhỏ hơn, tiếng tắt nhanh hơn. Chữ trang giữ nguyên, thêm nguồn vào mục Nguồn.
  - n8, n33, n34: chữ trang nói rõ là theo bản Urtext của Gouin. Sửa mở đầu mục "Longo thêm gì", dòng ô 15, mục Tốc độ, Sắc thái, Bàn đạp và giải thích câu hỏi 3. Bàn đạp: cả Gouin lẫn Longo đều không ghi.
- **Sự kiện kiểm ngẫu nhiên** (đều khớp):
  - n10: chú thích C. V. a)–d) ở ô 4, 13, 20, 22;
  - n15: "C. V. Libro III, N. 3";
  - n16: tr. 147–148, E.R. 545, số 238;
  - n11: sinh ở Napoli 26/10/1685, mất ở Madrid 23/7/1757 (Treccani);
  - n17: giấy phép MIDI Gouin CC BY-SA 4.0;
  - n22: ô 15 tay trái Si2 Si3 Sol♮3 Mi3.
- **Giấy phép bản thu.** Đọc wikitext IMSLP qua API (User-Agent `opus-kiem-dinh/1.0`): Hill, fortepiano, "Publisher Information: Robert Stephen Hill, 2025.", Copyright "Public Domain". API `imageinfo` của trang File: cho 14161236 byte, tải lên 2025-03-18, bằng cỡ file FLAC chủ repo tải. Khớp `ban_thu`.
- **Câu `ve-site`.** n5: chặng 5 chỉ K. 208 là Baroque; BWV 861 của lượt 10 ở chặng 7, gộp sau không làm câu sai. n38: link, mục. Nhãn `khuyen-tap`, `ve-site` đúng.
- **Thuật ngữ** khớp `thuat-ngu.yml`: adagio, andantino, cantabile, appoggiatura, trill, legato, staccato, fortepiano (tiếng mềm hơn), harpsichord, Urtext. *Tremulo* không có trong Từ điển, nghĩa theo Dolmetsch như trang ghi.

Chỗ vướng thêm của quy trình:

4. `tools/khuong-nhac.mjs` cho ô đầu ngắn (lấy đà) mà không so độ dài giữa các bè, nên ô 1 thiếu phách ở một tay lọt qua cả lượt 1 lẫn lượt 2. Nên bắt khi các bè của ô lấy đà dài khác nhau (nhánh `mo/` sau đợt).

## Kiểm mẫu và khóa

Claude (agent riêng) kiểm thay chủ repo 5 nhận định mẫu (trang n12, n18, n19, n28, n31) trên IMSLP, Henle, Treccani, Giordano và khối abc: 5 đúng. Khóa trang và bản ghi 24/11/2026. Mốc và sơ đồ đúng là số ở mục Review (mục Kết quả ghi số của lượt 1).
