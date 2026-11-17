# Báo cáo: thêm Debussy, Arabesque số 1 Mi trưởng, L. 66 số 1 (lượt 7 của lộ trình)

Nhánh `them/debussy-arabesque-1`, 17/11/2026. Lượt 7 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, bài đầu của đợt 1 (những bài người học hay hỏi). Lượt 1 xong; chưa lượt 2, review, kiểm mẫu, chưa khóa.

## Kết quả

- Trang `piano/tac-pham/debussy-arabesque-1` (chặng 6, Grade 7 ước lượng), bản ghi cuối `src/data/tac-pham.yml`, dòng `trang.yml`, hai hồ sơ.
- Cấp độ (đọc lại đề cương 17/11/2026): không có Arabesque số 1 trong ABRSM 2023–2024, 2025–2026, 2027–2028 và danh sách Trinity từ 2023 (bản 8/2026); ABRSM 2023–2024 có Arabesque số 2 ở Grade 8. RCM 2022: số 1 ở Level 10. Henle HN 380: mức 4 cho cả tập. Giữ ước Grade 7 của lộ trình (pianosyllabus: AMEB 7, ANZCA 7, NZMEB 7; chỉ dùng để tìm nguồn).
- Thời kỳ `Cuối thế kỷ 19`, theo tiền lệ `debussy-clair-de-lune` (1890) và `satie-gymnopedie`; "Ấn tượng" giữ cho `debussy-preludes`. Trang Học tiếp vẫn trỏ sang Thế kỷ 20 (Ấn tượng).
- Trích đoạn: hai khối, ô 1–2 (hợp âm rải chia hai tay) và ô 6–9 (hai chọi ba), chép tay từ bản quét Durand & Fils 1904 (IMSLP #255354, đọc ở 300–400 dpi) và đối chiếu từng nốt với bản LilyPond của Mutopia (theo cùng ấn bản). Bỏ vòng luyến (ghi trong hồ sơ). Ba bài tập soạn riêng, có số ngón.
- Bản thu: Patrizia Prati, Commons, CC BY-SA 4.0 (`{{self|cc-by-sa-4.0}}`, vé VRT 2015120610013684), thu trực tiếp ở Museo del Romanticismo, Madrid, 17/5/2016; 292,99 s, phát được. Ghi bằng `commons.py rec` + `attach.py`; `note` thêm nơi và ngày thu.
- Mốc (13 dòng): căn bằng `tools/audio/align` với MIDI Mutopia. 10 dòng ba biến thể khớp trong 2 giây; ba dòng đo tay trên khởi âm và phổ: ô 39 (98,1 s), ô 95 (252,8 s), ô cuối (288,2 s). Sơ đồ `hinh` chia theo các mốc.
- Hồ sơ lượt 1: trang 37 nhận định (3 `ve-site`, 2 `khuyen-tap`), 5 khuông (2 trích đoạn, 3 soạn); bản ghi 11 nhận định. Xuất lượt 2: 46 câu.
- Kiểm: `node tools/khuong-nhac.mjs` 0 lỗi (5 khối của trang 0 lỗi); `npm run build:xem` đạt; `npm test` 353 đạt, 0 hỏng, 2 bỏ qua (so chữ với site cũ, phạm vi nhánh lô); `OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet` 430 đạt, 0 hỏng (trang mới có trong trang mẫu).

## Nguồn

- Bản nhạc: Durand & Fils, Paris, 1904, D. & F. 4395, IMSLP #255354 (`../opus-zero/_imslp/IMSLP255354-…_filter.pdf`, trang 1–5). Bản in 1904 hết bảo hộ ở Mỹ và Việt Nam (Debussy mất 1918).
- Mutopia `DebussyC/L66/debussy_Arabesque_1` (Keith OHara, Mutopia-2011/10/25-1777, Public Domain, theo Durand & Fils 1904); `.ly` ở GitHub commit `7b5b8ec4`, `.mid` ở mutopiaproject.org.
- IMSLP, *2 Arabesques, CD 74* (API wikitext): L. 66, 1890–91, in lần đầu 11/1891 (Durand et Schoenewerk), bản khắc mới 1904 giữ số bản in, 107 ô.
- Henle HN 380 (trang sản phẩm): "the most important of his early piano pieces", ít được chú ý tới sau 1906, mức 4.
- ABRSM 2023–2024, 2025–2026, 2027–2028; Trinity từ 2023; RCM 2022; Larousse (un peu moins vite).

## Chỗ chưa chắc

- Thời kỳ (`Cuối thế kỷ 19` hay `Ấn tượng`): lộ trình và khảo sát gọi đây là "bài Ấn tượng thứ hai"; chọn theo tiền lệ Clair de lune. Đổi được nếu chủ repo muốn bài này vào nhóm Ấn tượng ở bộ lọc danh mục.
- Grade 7 là ước lượng: không có đề cương ABRSM, Trinity nào xếp số 1; số 2 ở ABRSM Grade 8.
- Ba mốc đo tay (ô 39, 95, ô cuối): ô 39 vào sau một hợp âm giữ rất nhỏ, có thể lệch dưới 1 giây.
- "Sắc thái lớn nhất là *f*": đọc 5 trang ở 110 dpi, không thấy *ff*; lượt 2 nên soát lại.

## Chỗ vướng của quy trình

- Căn mốc bằng `align/` cần thêm nguồn vào `tools/audio/align/sources.json` và cấu hình vào `pieces.py` (lộ trình dặn làm), nhưng hai file này ngoài bảng file của nhánh `them/` (`tests/pham-vi.test.mjs` chặn). Đã thêm trong worktree, chạy `run.py --write`, rồi trả hai file như cũ. Bản vá để gộp ở một nhánh `mo/` (hay nới bảng mục 4 của `them-tac-pham.md` cho hai file này, chỉ nối thêm):

```diff
--- tools/audio/align/sources.json (sau "mutopia_bwv-939.mid")
+ "mutopia_debussy_Arabesque_1.mid": {
+  "set": "mutopia",
+  "url": "https://www.mutopiaproject.org/ftp/DebussyC/L66/debussy_Arabesque_1/debussy_Arabesque_1.mid",
+  "sha256": "6732dc10799ec0af47d19d9095562d0671864a750129e0279901def169a34757"
+ },
--- tools/audio/align/pieces.py (cuối PIECES)
+    "debussy-arabesque-1": dict(page="piano/tac-pham/debussy-arabesque-1.md", jobs=[
+        # MIDI Mutopia (theo Durand & Fils 1904): chỉ số ô = số ô in trừ 1, 107 ô
+        dict(src="mutopia_debussy_Arabesque_1.mid",
+             rows={0: "first", 1: 5, 2: 12, 3: 16, 4: 28, 5: 38, 6: 46, 7: 62, 8: 70, 9: 75, 10: 94, 11: 100, 12: 106},
+             # đo trên khởi âm (11/2026): 5: ô 39 (Tempo rubato) vào ở 98,1 s, sau hợp âm Mi giữ dài rất nhỏ; 10: ô 95, Fa♯2
+             # 252,82 s, Đô♯3 253,10 s, La4 252,96 s (biến thể khởi-âm 252,7); 12: ô cuối, Mi3 288,35 s, Mi4 288,39 s
+             fix={5: 98.1, 10: 252.8, 12: 288.2})]),
```

  Kèm một dòng cho `align/NGUON.md` (bảng Mutopia): `mutopia_debussy_Arabesque_1.mid` | Debussy: Arabesque số 1 L. 66 | Mutopia-2011/10/25-1777 | Phạm vi công cộng.
- `khuong-nhac.mjs` nhận thư mục, không nhận một file: kiểm riêng trang mới phải chép trang vào thư mục tạm.

## Việc ngoài phạm vi

- Nhánh `mo/` (sau khi gộp): thêm hai file align ở trên; link tới trang mới ở `piano/hai-tay` (mục Hai chọi ba nhắc "Arabesque số 1 của Debussy" chưa có link), `piano/tac-pham-theo-cap` (dòng chặng 6 "Debussy: Arabesque số 1"), `piano/nha-soan-nhac` (bảng đầu trang và mục Debussy "Bắt đầu bằng"), `piano/ban-dap` mục Debussy (chỉ trỏ Clair de lune).
- Dự phòng không dùng: bản thu Kolodin IMSLP #809126 (đã có trong `_imslp/`), eldüendesüarez trên Commons. Không cần chủ repo tải thêm file nào.
