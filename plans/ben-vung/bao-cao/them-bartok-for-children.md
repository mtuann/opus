# Báo cáo: thêm Bartók, *For Children* số 1 và 6 (lượt 1 của lộ trình thêm tác phẩm)

Nhánh `them/bartok-for-children`, 16/11/2026. Lượt 1 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, kiêm chạy thử quy trình `plans/ben-vung/them-tac-pham.md` sau làm lại.

## Kết quả

- Trang `piano/tac-pham/bartok-for-children` (chặng 2, Grade 1–2), bản ghi `bartok-for-children` (cuối `src/data/tac-pham.yml`), dòng `trang.yml`, hai hồ sơ kiểm định.
- Trích đoạn: số 1 ô 1–4, số 6 ô 5–8, chép tay từ bản quét bản in đầu (Rozsnyai, Budapest, 1909; IMSLP #893790). Ba bài tập soạn riêng.
- Bản thu: Mississippi College Piano Pedagogy, CC BY-SA 4.0, chỉ dẫn link hai phần (IMSLP #469932, #469925), 11 mốc đo khởi âm trên file gốc.
- Kiểm định: lượt 1 (67 nhận định trang, 17 bản ghi, 5 khuông), lượt 2 bởi một agent khác (75 câu xuất: 71 đúng, 1 sai, 3 không chắc), review bởi agent thứ ba. Đã sửa: n22 (lượt 2: "bỏ hai bài, đặt tên cho mọi bài" sai, bản sửa còn 79 bài và nhiều bài vẫn không tên) và lời dưới bài tập 1 (review: nốt gạch ngang là nốt đen, "một phách" chứ không phải "hai phách"). Review: năm câu về site, năm câu cần giải quyết, hai khối trích đoạn (từng nốt với bản quét), ba khối soạn, chín sự kiện chọn thêm, giấy phép bản thu: không còn chỗ phải sửa.
- Kiểm mẫu: Claude kiểm thay chủ repo (lời giao 17/11/2026), 5 nhận định mẫu, 5 đúng. Khóa trang và bản ghi 17/11/2026 (`them_ngay` đổi thành ngày gộp). `npm run build` bản thật, `npm test` 353 đạt, Chromium 435 đạt. Gộp `main` ở máy, chưa push (chủ repo: push sau cả loạt lượt).
- Kiểm thử: `npm run build:xem`, `npm test` (353 đạt), `OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet` (435 đạt, có trang mới).

## Nguồn đã dùng

| Nguồn | Dùng cho |
|---|---|
| Bản quét Rozsnyai 1909 (IMSLP #893790, tải tay vào `../opus-zero/_imslp/`) | Nốt, cấu trúc, sắc thái, số ngón; trang tựa; lời bài hát (Jegyzetek) |
| Henle HN 1225: lời tựa và Comments của László Vikárius (PDF trên trang sản phẩm), trang sản phẩm | Lịch sử (bài giảng 1940, 1908–1911, Rozsnyai đặt hàng, bản sửa 1943/1946, buổi phát thanh 1/1945), mức khó 1 và 2 |
| IMSLP, wikitext trang tác phẩm (API) | 85/79 bài, năm in 1909/1911, giấy phép bản thu |
| ABRSM Piano 2015 & 2016 (Wayback), Trinity repertoire list từ 2023 (8/2026) | Grade 1 (ABRSM), Grade 2 (Trinity) cho số 1 |
| Trinity, Musical terms and directions | Nghĩa staccato, legato, tenuto, semplice, sempre, marcato |

## Khác với khảo sát

- **Số 6 không phải "tay trái giữ giai điệu".** Ở bản in 1909 giai điệu ở tay phải; tay trái đánh quãng móc đơn gần như suốt bài. Tên "Study for the Left Hand" của bản sửa nói về phần đệm ấy. Trang viết theo bản in.
- **Không gọi số 6 là "Rê Dorian"** (IMSLP và khảo sát ghi vậy): tay trái có cả Si (Si–Sol, Sol–Si) lẫn Si giáng. Trang chỉ tả nốt và link tới bài Điệu thức.
- Bản thu số 6 khớp bản in 1909 ở những chỗ đo được (lượt tay trái Si–Sol, Fa–Đô, đoạn kết), nên mốc theo bố cục ô của bản in.

## Chỗ vướng của quy trình (lượt chạy thử)

1. **Menu xếp sai bài mới** (`tests/giao-dien.test.mjs` hỏng): bài học do `them-tac-pham.mjs` tạo không có trong `THU_TU` của `src/nhom.mjs` nên nằm cuối nhóm Tác phẩm, trái luật xếp theo chặng (sách in thì đã tự xếp). Đã sửa ở nhánh riêng `mo/them-tac-pham-menu` (gộp `main` ở máy trước nhánh này): `menu()` nhận chặng của bài học, bài mới đứng sau bài cuối có chặng không lớn hơn. Review (Sonnet, đọc diff): không có chỗ phải sửa. Bản thật hiện tại không đổi (243 trang HTML giống hệt).
2. **Kiểm thử phạm vi hỏng ngẫu nhiên**: `tests/tim-kiem.test.mjs` tạo `tests/.tam-pagefind-*` đúng lúc `tests/pham-vi.test.mjs` đọc `git status`. Sửa cùng nhánh trên: `.gitignore` bỏ qua `tests/.tam-*/`.
3. **`them-tac-pham.mjs` chép Markdown của `--ten` vào `title`**: tiêu đề sinh ra là `"Bartók: *For Children* (*Gyermekeknek*) …"` (dấu sao hiện thành chữ trên tab trình duyệt và menu). Sửa tay. Nên: bỏ `*` khỏi `title`, hay nhận thêm `--tieu-de`.
4. **Khung bản ghi có `giong`, `nhip`**: trang dạy hai bài khác giọng thì phải bỏ hai trường (như `schumann-album`); lời nhắc của công cụ chỉ nói bỏ `danh_muc`, `doi_chieu`.
5. **Chữ trong ô sơ đồ đoạn không nhận Markdown** (trường `doan` là chuỗi thô): viết *più p* thì hiện dấu sao. Đã viết chữ thường. Nên ghi trong `AGENTS.md` hay cho trường nhận Markdown như `chip`.
6. **Trang mẫu của kiểm thử trình duyệt chỉ tính thay đổi đã commit** (`trangDaDoi`): chạy `test:trinh-duyet` trước khi commit thì trang mới không được kiểm mà kiểm thử vẫn đạt. Nên ghi trong `AGENTS.md` ("commit rồi mới chạy"), hay tính cả file chưa commit.
7. **Căn mốc tự động không dùng được** vì không có bản nhạc số; `align/explore.py onsets` cần môi trường `.venv-audio` có PyYAML (môi trường ở `../opus-zero/.venv-audio` không có, không được sửa thư mục đó). Đã đo khởi âm bằng một script tạm (librosa onset + CQT) với PyYAML cài riêng vào thư mục tạm. Nên ghi trong `tools/audio/README.md` cách dựng `.venv-audio` cho repo mới.
8. **Trang chặng lệch kiểm thử khi có bài mới** (`tests/trang-chang.test.mjs`, chỉ lộ ra ở bản build thật sau khi khóa bản ghi): `getCollection('tac-pham')` không trả theo thứ tự file, mà kiểm thử chờ thứ tự file; trước nay trùng vì file xếp theo chữ cái. Sửa ở nhánh `mo/trang-chang-thu-tu` (gộp `main` ở máy): trang và kiểm thử cùng xếp theo slug. Review (Haiku, đọc diff): không có chỗ phải sửa; bản thật không đổi.
9. **Công cụ khóa đòi nguồn** cho nhận định loại `nam` của `them_ngay` (việc nội bộ, hồ sơ bản ghi không nhận `ve-site`) và cho câu `khuyen-tap` có `ket_qua: da-sua`: bỏ nhận định ngày thêm (ghi lý do ở `ghi_chu` hồ sơ), để câu lời khuyên là `khong-can-nguon` kèm ghi chú chỗ sửa. Nên: công cụ tạo khung không sinh nhận định cho `them_ngay`, và cho `khuyen-tap` ghi `da-sua` không cần nguồn.
10. `attach.py`, `khoa.mjs xuat/nhap`, kiểm thử `tac_pham`, khuông nhạc, link, bản thu: chạy đúng, không vướng.

## Chưa chắc

- Hai câu tạm dịch tên bài hát tiếng Hungary (n19, n20) là bản dịch của trang; lượt 2 kiểm nghĩa từ bằng Wiktionary.
- "Kiss" (nguồn của bài số 6) chỉ ghi họ như bản in; chưa tra tên đầy đủ của nhà sưu tầm.
- Ghi chú khuông 1: số ngón tay trái ô 1 trong bản quét in mờ, đã bỏ khỏi trích đoạn.

## File chủ repo đã tải (16/11/2026)

`IMSLP469932-…Children_At_Play_Bartok.mp3`, `IMSLP469925-…Study_for_Left_Hand_Bartok.mp3`, `IMSLP893790-…For-Children-Book1-Hungarian.pdf` trong `../opus-zero/_imslp/`. Danh sách cho mọi lượt: mục 9 của lộ trình.

## Việc ngoài phạm vi (làm sau, nhánh `mo/`)

- Sau đợt 2: cập nhật `piano/tac-pham-theo-cap` (Bartók *For Children* đã ở bảng chặng 2: có thể link tới bài học mới) và mục 6 của `ke-hoach-mo-rong.md`, như mục 2 của lộ trình.
- Có thể đặt `goi_y: true` (gợi ý tập ở trang chủ) nếu chủ repo muốn; bản ghi để `false`.
- Bản thu ngắn (30 s, 45 s): có thể chuyển mã để phát được trên trang như `schumann-album` (cùng nhóm MCPP), thay vì chỉ dẫn link như lộ trình ghi. Cần chủ repo quyết.
