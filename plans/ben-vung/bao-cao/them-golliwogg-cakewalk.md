# Báo cáo: thêm hướng dẫn nghe Debussy, *Golliwogg's Cakewalk* (*Children's Corner* số 6)

Nhánh `them/golliwogg-cakewalk`, 17/11/2026. Hướng dẫn nghe số 1 của `plans/ben-vung/lo-trinh-them-tac-pham.md` (mục 7), mảng Ấn tượng. Lượt 1 xong; chưa lượt 2, review, kiểm mẫu, chưa khóa.

## Kết quả

- Trang `nghe-nhac/golliwogg-cakewalk` (tầng `tac-pham`), bản ghi `loai: nghe` cuối `src/data/tac-pham.yml` (`danh_muc: L. 113 số 6`, `thoi_ky: Ấn tượng` như `debussy-preludes`, `luyen_nghe`, `doi_chieu`, `hinh.nghe` bảy ô, `ban_thu`), dòng `trang.yml`, hai hồ sơ. Slug giữ `golliwogg-cakewalk` như worktree (các hướng dẫn nghe khác đặt `<tác giả>-<tên>`, như `debussy-preludes`; nếu muốn thống nhất thì `debussy-golliwogg` hợp hơn, nhưng đổi sau sẽ phải đổi cả nhánh).
- Nội dung: bảng đầu trang; bốn đoạn "Điều cần biết" (tổ khúc cho Chouchou; cakewalk và ragtime; nhân vật Golliwogg, viết trung tính, có nguồn, không minh họa; câu trích *Tristan und Isolde*); hai trích đoạn; sơ đồ; bảng "Theo dõi khi nghe" 14 dòng có số ô; câu hỏi; so sánh bản thu (chỉ những bản có trên IMSLP: cuộn piano của Debussy, Firkušný 1956, Ligoratti, bản phối Caplet); "Nếu bạn muốn chơi" (Henle mức 6; không có trong ABRSM 2025–2028, Trinity từ 2023) với link tới `debussy-clair-de-lune`, `debussy-arabesque-1`, `nghe-nhac/debussy-preludes`; Nguồn.
- Trích đoạn (chép tay, chỉ giai điệu): khối 1 bè trên tay phải ô 10–13 (đảo phách móc kép – móc đơn – móc kép), khối 2 câu Wagner ô 61–63 (La♮3 – Fa4 – Mi♮4 – Mi♭4, K:Gb). Đo dòng kẻ và đầu nốt bằng máy ở 400–600 dpi; ghi từng ô trong `khuong_nhac`.
- Số ô đếm trên bản quét: 25 + 27 + 25 + 24 + 27 = 128, khớp IMSLP và cách đánh số của Henle (Bemerkungen M 28/108, 36/116).
- Bản thu: Commons, eldüendesüarez (người chơi tự tải lên), `{{cc-by-4.0}}`, 2023-12-21, 160,50 s, phát được. `commons.py rec` + `attach.py`.
- Mốc (14 dòng): không có MIDI mở (Mutopia không có bài này), đo tay bằng librosa (độ to theo giây, khởi âm) trên mp3 chuyển mã; cách đo từng mốc ở hồ sơ trang n27, sai số ước ±1 s. Sơ đồ chia theo các mốc.
- Hồ sơ lượt 1: trang 35 nhận định (1 `ve-site`, 1 `khuyen-tap`), 2 khuông (trích đoạn); bản ghi 7 nhận định. Xuất lượt 2: 41 câu, `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/5aff8b71-fece-4be3-9817-e9eb6d2a985d/scratchpad/golliwogg-cakewalk/luot2/xuat.yml`.
- Kiểm: `node tools/khuong-nhac.mjs` 402 khối, 0 lỗi; `npm run build:xem` đạt; `npm test` 353 đạt, 1 bỏ qua, 1 hỏng (`tests/chuyen.test.mjs`, không do nhánh này, xem mục Chỗ vướng); `OPUS_TRINH_DUYET=chromium OPUS_TRANG=nghe-nhac/golliwogg-cakewalk/ npm run test:trinh-duyet` 435/435 đạt.

## Nguồn

- Bản nhạc: Durand & Fils, IMSLP #252526 (`../opus-zero/_imslp/IMSLP252526-…_filter.pdf`, Golliwogg ở trang PDF 26–30, trang in 24–28). Bản quét là lần in tháng 2/1952 ("Février 1952 Imp. Mounot") từ bản khắc 1908 ("Copyright by A. Durand & Fils 1908", D. & F. 7188); IMSLP ghi bản 1908. Bản khắc 1908 hết bảo hộ ở Mỹ và Việt Nam (Debussy mất 1918); lần in lại không đổi bản khắc.
- IMSLP (API wikitext): L. 113, 128 ô, 1906–1908, Durand 1908, buổi đầu 18/12/1908 (Harold Bauer), các bản thu.
- Henle HN 382: trang sản phẩm (mức khó từng bài, "in ragtime style"), lời tựa Lesure 1983, Bemerkungen Heinemann 1983.
- *The Concise Oxford Dictionary of Music* (encyclopedia.com): cakewalk, ragtime, cédez, retenu, giusto. Larousse (net, sec, moins, toujours, émotion).
- Jim Crow Museum, Ferris State University: nhân vật Golliwogg (Upton 1895, gốc búp bê minstrel, biếm họa phân biệt chủng tộc).
- Câu trích *Tristan*: PTNA Piano Encyclopedia (mảnh giai điệu Tristan ở đoạn giữa) và trang *Tristan and Isolde* của UT Austin (LAITS, 2007: ô 61, Longing motive, đúng cao độ, Rê♯ viết thành Mi♭, bốn lần, "a joke").
- ABRSM 2025–2026, 2027–2028 và Trinity từ 2023: không có bài.

## Chỗ chưa chắc

- Nguồn cho câu trích *Tristan* là bậc 2 nhưng không phải ấn bản học thuật lớn (PTNA, trang khóa học UT Austin); không mở được Grove. Cao độ La–Fa–Mi đọc thẳng trên bản quét; "đúng cao độ Wagner" dựa vào LAITS (chưa đối chiếu với tổng phổ *Tristan*). Lượt 2 nên kiểm với bản in *Tristan* trên IMSLP.
- Số lần trích: LAITS nói bốn; bản in có năm chỗ Cédez (ô 61, 65, 69, 73, 76). Trang viết "nhiều lần".
- Mốc đo tay (±1 s), nhất là ô 26, 41, 79 (đầu ô là dấu lặng), ô 126 (suy từ nhịp, khởi âm 153,4).
- Thời kỳ `Ấn tượng`: theo `debussy-preludes`; IMSLP ghi Romantic. Đổi được nếu chủ repo muốn.
- Đoạn về cakewalk theo COD: "slaves" không ghi miền Nam; trang không thêm chi tiết khác (Paris, Williams và Walker) cho gọn.

## Chỗ vướng của quy trình

- `tests/chuyen.test.mjs` hỏng ở worktree này vì `.cache/site-cu` (liên kết tới checkout chính) có mặt, nên phép so chữ chạy; nó báo các khối mới chưa ghi `doi_chu` ở `lich-su/nu-nha-soan-nhac` và `piano/tac-pham-theo-cap`, hai trang đã sửa ở `mo/sau-dot-2`, `mo/sau-dot-3` (có sẵn trên `main`). Không liên quan tới nhánh này; ở các worktree không có `.cache/site-cu` phép thử tự bỏ qua. Cần một nhánh `mo/` ghi `doi_chu` cho hai trang ấy.
- Hướng dẫn nghe không có trích đoạn từ Mutopia nên phải tự viết script đo dòng kẻ (bản ở thư mục nháp `golliwogg-cakewalk/bin/`); `ann.py` của lượt trước giả định khuông khóa Sol và khóa Fa xen kẽ từ đầu ảnh, cắt ảnh lệch thì nhãn sai.

## Việc ngoài phạm vi

- `piano/nha-soan-nhac` (mục Debussy, "Bắt đầu bằng" nhắc *Golliwogg's Cakewalk* không có link) và `piano/tac-pham/debussy-clair-de-lune` (Học tiếp nhắc *Children's Corner*): thêm link tới trang mới ở nhánh `mo/` sau khi gộp.
- `nghe-nhac/debussy-preludes` (dòng *Minstrels*) có thể link sang trang mới.
- Không cần chủ repo tải thêm file.
