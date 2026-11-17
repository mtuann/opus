# Báo cáo: thêm Rachmaninoff, Prelude Đô♯ thứ, Op. 3 số 2 (lượt 8 của lộ trình)

Nhánh `them/rachmaninoff-prelude-do-thang-thu`, 17/11/2026. Lượt 8 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, bài thứ hai của đợt 1 (những bài người học hay hỏi). Báo cáo này viết sau lượt 1; lượt 2, review, kiểm mẫu và khóa chưa làm.

## Kết quả

- Trang `piano/tac-pham/rachmaninoff-prelude-do-thang-thu` (chặng 7, "Grade 8 trở lên" ước lượng), bản ghi cuối `src/data/tac-pham.yml`, dòng `trang.yml`, hai hồ sơ lượt 1.
- Cấp độ: Op. 3 số 2 không có trong đề cương ABRSM 2021–2022, 2023–2024, 2025–2026 (Rachmaninoff chỉ có *Moment musical* Op. 16 số 5 ở Grade 8) và danh sách ARSM 6/2024. pianosyllabus.com: RCM 10, AMEB *Certificate of Performance*, ANZCA *A.Dip.A.*, PS 9. Henle HN 1211: mức 5 ("medium") trên thang 1–9. Nên giữ chặng 7 như khảo sát đề xuất.
- Trích đoạn: hai khối, ô 1–4 (ba nốt mở đầu và chủ đề *ppp*) và ô 15–16 (đầu đoạn *Agitato*), chép tay từ bản quét IMSLP #868299 ở 400 dpi, đối chiếu từng nốt với MIDI và `.ly` của Mutopia: trùng khớp. Ba bài tập soạn riêng (quãng tám rơi bằng sức nặng cánh tay; hợp âm giữa nhẹ, bè trầm hát; hợp âm luân phiên hai tay).
- Bản thu: Commons, chính Rachmaninoff, Edison Diamond Disc 82187-R (thu 1919, phát hành 12/1920), `{{PD-old-auto-record-expired}}`, 227,91 s, phát được. Ghi bằng `commons.py rec` + `attach.py`. Chín mốc: `1 9 40 105 133 140 146 193 220`.
- Kiểm định lượt 1: 37 nhận định trang, 14 bản ghi, 5 khuông. Xuất cho lượt 2: 49 câu (`node tools/khoa.mjs xuat …`), ở thư mục nháp của phiên.
- Kiểm: `node tools/khuong-nhac.mjs` 0 lỗi (387 khối); `npm run build:xem` đạt; `npm test` 353 đạt, 0 hỏng, 2 bỏ qua (so chữ site cũ: không có `.cache/site-cu/`; phạm vi nhánh lô: không phải nhánh lô); `tests/pham-vi.test.mjs` phần `them/<slug>` đạt.

## Chọn lựa

- **Số ô:** theo bản Mutopia, ô lấy đà hai phách là ô 1, cả bài 62 ô (Agitato ô 15, Tempo primo ô 46). Trang nói rõ cách đếm này ở mục Cấu trúc.
- **Thời kỳ:** `Cuối Lãng mạn`, như bản ghi `rachmaninoff-2` (Henle gọi bài là "late Romantic"); bản ghi tác giả ghi Thế kỷ 20.
- **Năm in:** 1893 theo IMSLP (Henle ghi 1892), như khảo sát dặn; dòng thông tin ghi "(theo IMSLP)".
- **Hai trích đoạn:** ô 1–4 cho kết cấu ba lớp, ô 15–16 cho chùm ba có giai điệu ở nốt đầu. Không chép đoạn bốn khuông (ô 46–55): quá dày cho một khối abc hai khuông.
- **Coda từ ô 56:** chỗ đổi kết cấu (hợp âm chậm trên Đô♯ trầm); ô 54–55 (*dim.*) xếp vào đoạn A trở lại.

## Nguồn

- Bản nhạc: IMSLP #868299 (`../opus-zero/_imslp/IMSLP868299-…pdf`), bản khắc Gutheil [1893] A. 6516 G do Boosey & Hawkes in lại 1992 (B. & H. 20707). Mutopia `RachmaninoffS/O3/rach-prelude-op3-no2` (`.ly`, `.mid`; CC BY-SA 4.0; nguồn Bosworth 1896, UE 1910).
- IMSLP (API wikitext): trang Op. 3, Op. 23, Op. 32, Category Rachmaninoff. Henle HN 1211. ABRSM ba PDF 2021–2026 và ARSM 6/2024. pianosyllabus.com ref 3082417. Commons (trang mô tả file bản thu).
- Trang site đã khóa làm nguồn bậc 2: `piano/nghe-si`, `lich-su/nha-soan-nhac`, `src/data/thuat-ngu.yml`.

## Chỗ chưa chắc

- **Bản in lại 1992.** Chân trang đầu của bản quét ghi "Revised edition © Copyright 1992 by Hawkes & Son"; IMSLP ghi file là bản khắc Gutheil in lại, không thấy số bản in Gutheil trên bản quét. Hai đoạn chép đều đối chiếu với bản Mutopia (theo Bosworth 1896 / UE 1910, độc lập với bản 1992) và trùng từng nốt, nên không chép phần nào có thể là sửa đổi 1992. Lượt 2 hay review nên xem thêm một bản quét Gutheil khác trên IMSLP nếu muốn chắc về chữ chỉ dẫn (sắc thái, *tenuto*). Đã giải quyết ở review: ấn bản chính đổi sang bản quét Gutheil #86365 (mục Review).
- **Mốc.** Bản thu lệch khoảng −0,4 nửa cung; căn DTW (`tools/audio/align`, `core.align` với MIDI Mutopia) ra kết quả sai ở đoạn *Lento* kể cả sau khi chỉnh cao độ. Mốc lấy bằng khởi âm và cao độ từng khởi âm, so với nốt từng ô (chi tiết ở hồ sơ trang, n24). Mốc 40 (ô 7) có thể lệch tới khoảng 1 s (nốt Sol♯ trầm đầu ô rất yếu); mốc 220 (hợp âm cuối) có một khởi âm nữa ở 221 s. Không thêm cấu hình vào `tools/audio/align/pieces.py` vì file ngoài phạm vi nhánh `them/`.
- **"ABRSM có Op. 3 số 1, 3, 4 ở Grade 8"** (lộ trình, khảo sát): không thấy trong ba kỳ 2021–2026; có thể ở các kỳ 2011–2020 (không đọc lại). Trang không nói điều này.
- Câu "Rachmaninoff là một trong những nghệ sĩ piano lớn nhất thời mình" chỉ dựa vào trang `piano/nghe-si` đã khóa: lượt 2 cần nguồn ngoài.

## Chỗ vướng của quy trình

- `them-tac-pham.mjs` chép `--ten` vào `title` như các lượt trước; tên lần này không có Markdown nên không phải sửa.
- Bản thu Commons có cao độ lệch khoảng 0,4 nửa cung, làm hỏng căn DTW (phổ theo nửa cung). `core.py` không tự ước lượng lệch cao độ; nên thêm bước `librosa.estimate_tuning` và dịch cao độ trước khi dựng đặc trưng (việc riêng, ngoài phạm vi).
- Căn mốc bằng `align/` cần thêm nguồn vào `sources.json` và `pieces.py`, nằm ngoài bảng file được chạm của nhánh `them/`: lượt này căn bằng script nháp, ghi cách đo vào hồ sơ.

## File chủ repo phải tải

Không có (bản nhạc #868299 và bản thu dự phòng #928449 đã có trong `_imslp/`; bản thu chính ở Commons).

## Việc ngoài phạm vi

- `piano/tac-pham-theo-cap` (đã khóa): bài đang ở mục chặng 6, phải chuyển sang chặng 7 cho khớp bản ghi (`tests/tac-pham-theo-cap.test.mjs`), và viết link tới trang mới.
- `piano/nha-soan-nhac` (đã khóa): bảng đầu trang và mục Rachmaninoff có thể ghi lại cấp của Op. 3 số 2 ("Grade 8 trở lên", chặng 7) và link tới bài học.
- `tools/audio/align`: thêm nguồn MIDI Mutopia vào `sources.json`, cấu hình vào `pieces.py` (với `fix` cho các mốc đo tay), và bước chỉnh cao độ cho bản thu lệch.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 17/11/2026. Mọi nhận định của hai hồ sơ có `review`: `dung`, trừ n24 của trang (`sai`, đã sửa mốc).

- **Đổi ấn bản chính** sang bản quét Gutheil IMSLP #86365 (thư viện Sibley; IMSLP: "First edition (later printing)", Gutheil n.d. [1893], A. 6516 G; hết bảo hộ), thay bản in lại Boosey & Hawkes 1992 #868299 ("Revised edition © 1992"). Bìa #86365 liệt kê cả Op. 10, nên đây là một lần in sau 1894 của bản khắc đầu tiên. Đã sửa: trang (mục Cấu trúc, hai tiêu đề khuông, mục Nguồn thêm Bosworth 1896 làm bản đối chiếu và bỏ bản 1992), bản ghi (`doi_chieu`, dòng Bản nhạc), hồ sơ (nguồn `gutheil-1893` trỏ #86365; thêm `bh-1992` để ghi lại bản lượt 1 đã đọc, `bosworth-1896`).
- **Hai khối trích đoạn** so lại từng nốt trên #86365 (300–500 dpi): ô 1–4 khớp hoàn toàn (kể cả ♮♯ trước Fa♯ sau Fa𝄪, dấu bình nhắc ở La). Ô 15–16: #86365 mất khuông trên ở đầu tr. 3 (IMSLP: "Pages 2-3 of No.2: Prélude damaged"); tay trái, *mf* và nốt dưới các chùm ba đọc được và khớp; giai điệu, nốt trên chùm ba, luyến và chữ *Agitato* đối chiếu Bosworth 1896 (#79003, tr. 4 hệ 1, 400 dpi) và Mutopia: khớp. Trang ghi rõ chỗ đối chiếu thêm này. Không sửa nốt.
- **Năm in:** IMSLP ghi 1893 (bản in không ghi năm, IMSLP ước n.d. [1893]), Henle ghi 1892. Trang: "in bài khoảng năm 1893 (bản in không ghi năm)"; bản ghi: "in khoảng năm 1893 (bản in không ghi năm; IMSLP ghi 1893, Henle ghi 1892)".
- **Bốn khuông:** #86365 tr. 5 hệ 3 giữ hai cặp khuông m.d./m.g. tới hết bài (ô 55–62), không dừng ở ô 55 như ghi chú lượt 1. Bảng Chỗ khó sửa "(ô 46–55)" thành "(từ ô 46 tới hết bài)", Lỗi thường gặp thành "(từ ô 46)"; câu về kết cấu móc đơn/hợp âm trầm giữ cho ô 46–55.
- **Sự kiện kiểm lại** (wikitext IMSLP, Henle, Commons, đọc lại): năm viết 1892, buổi đầu 1892/09/20 ở Moskva, đề tặng Arensky, "The Bells of Moscow", Op. 23 (1901–03, 10 bài), Op. 32 (1910, 13 bài) và 24 giọng, Henle ("most famous late Romantic", Siloti anh họ, tiếng la "C sharp minor!"), bản thu Edison 82187-R thu 1919, phát hành 12/1920: đều khớp.
- **Giấy phép bản thu:** Commons `{{PD-old-auto-record-expired|deathyear=1943}}`; phát hành 12/1920, ở Mỹ phạm vi công cộng theo CPAA (bản ghi âm phát hành trước 1923 hết bảo hộ từ 1/1/2022). Trang chỉ ghi "phạm vi công cộng": đúng.
- **Mốc** (đo lại trên file Commons tải về, 227,908 s; onset và CQT sau chỉnh +0,38 nửa cung): ô 7 sửa 40 thành 39 (Sol♯ trầm đầu ô ở 38,77 s, hợp âm đầu 40,25 s). Các mốc khác khớp trong 0,5 s (1,22; 8,75; 104,52; 133,04; 140,24; 145,59; 192,85; 220,3). Ghi bằng `attach.py --ref "1 9 39 105 133 140 146 193 220"`. Sơ đồ `hinh` không đổi.
- **Ba bài tập soạn:** đủ nhịp (8 móc đơn mỗi ô; chùm ba ở bài 3), hòa âm (Đô♯ thứ, Sol♯ trưởng V; Đô♯ thứ – La trưởng – Sol♯ thứ), số ngón, lời kèm đúng; bài 3 luân phiên phải–trái–phải | trái–phải–trái đúng như ô 36 (#86365 tr. 4 hệ 2). Bài 2 trên nốt La dùng Mi–La–Mi (quãng năm trống): không sai, giữ.
- **Chữ, thuật ngữ, thời kỳ:** Lento, agitato, Tempo primo, pesante, tenuto, coda khớp `thuat-ngu.yml`; `thoi_ky: Cuối Lãng mạn` cùng nhãn với `rachmaninoff-2`.
- Kiểm: `npm run build:xem` đạt; `npm test` 353 đạt, 0 hỏng, 2 bỏ qua. Chưa chạy kiểm thử trình duyệt (trang đổi chữ, không đổi mã).

