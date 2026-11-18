# Báo cáo: thêm hướng dẫn nghe Debussy, *Golliwogg's Cakewalk* (*Children's Corner* số 6)

Nhánh `them/golliwogg-cakewalk`, 17/11/2026. Hướng dẫn nghe số 1 của `plans/ben-vung/lo-trinh-them-tac-pham.md` (mục 7), mảng Ấn tượng. Lượt 1, lượt 2 (41 câu: 37 đúng, 4 sai) và review xong; chưa kiểm mẫu, chưa khóa.

## Kết quả

- Trang `nghe-nhac/debussy-golliwogg` (tầng `tac-pham`), bản ghi `loai: nghe` cuối `src/data/tac-pham.yml` (`danh_muc: L. 113 số 6`, `thoi_ky: Ấn tượng` như `debussy-preludes`, `luyen_nghe`, `doi_chieu`, `hinh.nghe` bảy ô, `ban_thu`), dòng `trang.yml`, hai hồ sơ. Slug `debussy-golliwogg` theo kiểu `<tác giả>-<tên>` của các hướng dẫn nghe khác (lúc đầu là `golliwogg-cakewalk` như tên nhánh và worktree; đổi theo lời giao của người gom, nhánh giữ tên cũ).
- Nội dung: bảng đầu trang; bốn đoạn "Điều cần biết" (tổ khúc cho Chouchou; cakewalk và ragtime; nhân vật Golliwogg, viết trung tính, có nguồn, không minh họa; câu trích *Tristan und Isolde*); hai trích đoạn; sơ đồ; bảng "Theo dõi khi nghe" 14 dòng có số ô; câu hỏi; so sánh bản thu (chỉ những bản có trên IMSLP: cuộn piano của Debussy, Firkušný 1956, Ligoratti, bản phối Caplet); "Nếu bạn muốn chơi" (Henle mức 6; không có trong ABRSM 2025–2028, Trinity từ 2023) với link tới `debussy-clair-de-lune`, `debussy-arabesque-1`, `nghe-nhac/debussy-preludes`; Nguồn.
- Trích đoạn (chép tay, chỉ giai điệu): khối 1 bè trên tay phải ô 10–13 (đảo phách móc kép – móc đơn – móc kép), khối 2 câu Wagner ô 61–63 (La♮3 – Fa4 – Mi♮4 – Mi♭4, K:Gb). Đo dòng kẻ và đầu nốt bằng máy ở 400–600 dpi; ghi từng ô trong `khuong_nhac`.
- Số ô đếm trên bản quét: 25 + 27 + 25 + 24 + 27 = 128, khớp IMSLP và cách đánh số của Henle (Bemerkungen M 28/108, 36/116).
- Bản thu: Commons, eldüendesüarez (người chơi tự tải lên), `{{cc-by-4.0}}`, 2023-12-21, 160,50 s, phát được. `commons.py rec` + `attach.py`.
- Mốc (14 dòng): không có MIDI mở (Mutopia không có bài này), đo tay bằng librosa (độ to theo giây, khởi âm) trên mp3 chuyển mã; cách đo từng mốc ở hồ sơ trang n27, sai số ước ±1 s. Sơ đồ chia theo các mốc.
- Hồ sơ lượt 1: trang 35 nhận định (1 `ve-site`, 1 `khuyen-tap`), 2 khuông (trích đoạn); bản ghi 7 nhận định. Xuất lượt 2: 41 câu, `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/5aff8b71-fece-4be3-9817-e9eb6d2a985d/scratchpad/golliwogg-cakewalk/luot2/xuat.yml`.
- Kiểm: `node tools/khuong-nhac.mjs` 402 khối, 0 lỗi; `npm run build:xem` đạt; `npm test` 353 đạt, 1 bỏ qua, 1 hỏng (`tests/chuyen.test.mjs`, không do nhánh này, xem mục Chỗ vướng); `OPUS_TRINH_DUYET=chromium OPUS_TRANG=nghe-nhac/debussy-golliwogg/ npm run test:trinh-duyet` 435/435 đạt.

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
- Hướng dẫn nghe không có trích đoạn từ Mutopia nên phải tự viết script đo dòng kẻ (bản ở thư mục nháp `debussy-golliwogg/bin/`); `ann.py` của lượt trước giả định khuông khóa Sol và khóa Fa xen kẽ từ đầu ảnh, cắt ảnh lệch thì nhãn sai.

- `tests/pham-vi.test.mjs` lấy slug từ tên nhánh (`them/<slug>`): nhánh vẫn tên `them/golliwogg-cakewalk` mà file mang slug `debussy-golliwogg`, nên phép thử phạm vi báo bốn file mới "ngoài phạm vi". Đổi tên nhánh thành `them/debussy-golliwogg` (`git branch -m`) trước khi chạy lại `npm test` và trước khi khóa, thì phép thử đạt.

## Việc ngoài phạm vi

- `piano/nha-soan-nhac` (mục Debussy, "Bắt đầu bằng" nhắc *Golliwogg's Cakewalk* không có link) và `piano/tac-pham/debussy-clair-de-lune` (Học tiếp nhắc *Children's Corner*): thêm link tới trang mới ở nhánh `mo/` sau khi gộp.
- `nghe-nhac/debussy-preludes` (dòng *Minstrels*) có thể link sang trang mới.
- Không cần chủ repo tải thêm file.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 17/11/2026. Mọi nhận định của hai hồ sơ có `review`: `dung`, trừ n20, n26, n27 của trang và n5, n6 của bản ghi (`sai`, đã sửa, `ket_qua: da-sua`).

- Phần kết (trang n26, bản ghi n5): bản quét tr. 28 hệ 5 ở 400–500 dpi: ô 127, 128 mỗi ô một móc đơn *ff* có dấu ^, tay phải Mi♭3, tay trái quãng tám Mi♭1–Mi♭2, không phải hợp âm. Ô 110–111 khác hòa âm ô 30–31 (và ô 113 ghi *sff* thay *ff* của ô 33), nên bỏ vế "chỉ ba ô cuối khác hẳn". Dòng 14 của bảng: "…một chuỗi nốt chạy xuống *f* rồi hai tiếng Mi♭ *ff* thật ngắn, hai tay cùng đánh Mi♭ chồng quãng tám"; `hinh.nghe` `ghi_chu` sửa theo. Bản ghi không có `thong_tin` (hướng dẫn nghe).
- Ô 5 (trang n20, thêm): ô 5 là ô lặng ở cả hai tay (tr. 24 hệ 2), không phải tay trái đã vào như ghi chú lượt 1; dòng 2 của bảng thêm "sau một ô lặng ở cả hai tay". Trên bản thu: lặng 4,4–5,3 s, tay trái vào 5,4 s.
- Mốc (trang n27): đo lại trên mp3 Commons tải lại (librosa: CQT 88 nốt, khởi âm, độ to từng 0,1 s; chroma so phần đầu với phần trở lại, lệch 105,4–105,7 s), đối chiếu bản quét. Đổi: ô 10 11 → 10 (Si♭4 La♭4 Si♭4 Fa Si♭4 từ 9,71 s); ô 38 39 → 40 (độ to lên −13,6 dB lúc 40,1); ô 41 42 → 44 (chuỗi *ff* của ô 40 tới 43,3 s, hợp âm *p* đầu tiên 43,85; lượt 2 đề nghị 43 nhưng 43,0 còn là nốt trầm *ff* cuối ô 40); ô 47 48 → 51 (ô 45 hợp âm từ 48,0; ô 46 Mi♭2 49,0, Fa2 49,7; ô 47 Sol♭2–Rê♭3 *pp* 50,7; lượt 2 đề nghị 50); ô 126 153 → 155 (ô 125 tới 154,1, lặng đen đầu ô 126 kéo tới 155,1, chuỗi nốt 155,2, hai tiếng Mi♭ 155,84 và 157,1; lượt 2 đề nghị 154, là đầu ô nhưng còn lặng). Giữ 0, 5, 27, 68, 80, 97, 101, 115, 117 (đo lại khớp trong 1 s). Ghi bằng `attach.py --ref`: `0 5 10 27 40 44 51 68 80 97 101 115 117 155`.
- Sơ đồ (bản ghi n6): đầu các đoạn 0; 9,71; ~26,8; 50,7; 67,75; 114,54; ~154,2 s, tiếng đàn tắt ~158,3 s: 10, 17, 24, 17, 47, 40, 4 giây (lượt 2 ghi Kết 6 vì tính tới hết file 160,5 s; giữ cách lượt 1, tính tới lúc tiếng đàn tắt).
- Hai khối abc so từng nốt với bản quét: khối 1 (ô 10–13) ở 400 và 600 dpi, dòng kẻ và đầu nốt đo bằng máy; khối 2 (ô 61–63) ở 450 dpi. Khớp, không sửa.
- Kiểm lại trên nguồn (tải lại, User-Agent `opus-kiem-dinh/1.0`): lời tựa Lesure (Durand cuối tháng 9/1908; Bauer 18/12/1908, Cercle musical; Chouchou "barely three years old"; Miss Gibbs), trang Henle (ragtime style; mức 6, 6, 4), COD cakewalk, LAITS (ô 61, Rê♯ viết thành Mi♭, bốn lần, "a joke"), Jim Crow Museum. Đều khớp. Commons API: `{{cc-by-4.0}}`, 2023-12-21, người tải lên Elduendesuarez, 160,50 s; trường author ghi Debussy, người chơi ở description và source.
- Golliwogg: đoạn ba câu, trung tính, có nguồn, nói rõ chỉ nhắc tên vì là tên bài; giữ. Sửa chữ một câu cho sát nguồn ("a caricature of American black faced minstrels"): "Nhân vật nhại những người diễn trò hát rong bôi mặt đen (*minstrel*) của Mỹ" thay "được vẽ theo một con búp bê nhại…" (n14, vẫn `dung`).
- Thuật ngữ khớp `thuat-ngu.yml` (đảo phách, a tempo, Tempo primo, nốt hoa mỹ, dim.). Nhãn `khuyen-tap` (n34) và `ve-site` (n35) đúng loại.
- Kiểm: YAML hai hồ sơ và `tac-pham.yml` đọc bằng `parseDocument` không lỗi; `node tools/khuong-nhac.mjs` 402 khối, 0 lỗi; `npm run build:xem` đạt; `npm test` 353 đạt, 1 bỏ qua, 1 hỏng (`tests/chuyen.test.mjs`: `doi_chu` của `lich-su/nu-nha-soan-nhac`, `piano/tac-pham-theo-cap`, lỗi đã sửa ở `main`, nhánh chưa rebase; không sửa ở đây); `OPUS_TRINH_DUYET=chromium OPUS_TRANG=nghe-nhac/debussy-golliwogg/ npm run test:trinh-duyet` 435/435 đạt.
