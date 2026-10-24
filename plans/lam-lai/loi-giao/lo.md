# Giao lô <D đợt-L lô>

Bạn làm lô **<D…-L…>** trong `plans/lam-lai/README.md` của repo opus.

- Worktree: `<đường dẫn>`, nhánh `moi/<d…-l…>` đã tạo từ `main`, đã `npm ci`.
- Site cũ đã build ở `.cache/site-cu/`, dùng cho `so-chu`.

## Đọc trước

1. `AGENTS.md`.
2. Trong `plans/lam-lai/README.md`: Quyết định, Bảy luật, Quy tắc chung (cả "Ba mức review"), Quy trình mỗi lô, mục của đợt.
3. Danh sách trang của lô: `plans/lam-lai/anh-xa.md`.
4. `plans/ben-vung/chuan-kiem-dinh.md`, nhất là mục 1 (loại nhận định, kể cả `ve-site`) và "Nguồn và cách mở".
5. `plans/lam-lai/loi-giao/README.md`: cách chạy cho đỡ tốn, quy tắc chung.
6. Báo cáo của lô trước và các dòng "Việc còn mở" giao cho lô này.

## Việc

- Chuyển từng trang bằng `tools/chuyen/`, rồi so chữ (`tools/chuyen/so-chu.mjs`). Chữ khác trang cũ phải ghi `doi_chu` trong hồ sơ.
- Thành phần, hình, công cụ mà trang cần lần đầu:
  - làm và đăng ký trong `src/plugins/thanh-phan.mjs`;
  - CSS ở `src/styles/thanh-phan.css`;
  - kiểm thử trong `tests/`.
- Kiểm định lượt 1 theo mức của tầng, ghi hồ sơ (`node tools/khoa.mjs mau <trang>`):
  - Mỗi nhận định một loại đúng. Câu về chính site là `ve-site`, có `ghi_chu` ghi đã kiểm ở đâu.
  - Lời khuyên dính tới sức khỏe không xếp `khuyen-tap`.
  - Trang Lõi không giữ chi tiết mau cũ.
  - Lập hồ sơ cho trường dữ liệu chưa khóa mà trang hiện ra, và cho bản ghi thuật ngữ trang dùng (từ đợt 3).
- Trang và thành phần đọc dữ liệu qua `chiDaKhoa`: trang chỉ hiện trường đã khóa.
- Chưa khóa gì. Chỉ chạm file của lô; kiểm thử phạm vi chặn chỗ khác.

## Quy tắc

- Theo `loi-giao/README.md`: tối đa 2 agent con; không đưa thông tin cá nhân của chủ repo ra ngoài.
- Commit message tiếng Việt, kết thúc bằng dòng Co-Authored-By của model đang dùng.
- Giao diện theo mục Giao diện của `AGENTS.md`:
  - ba cỡ màn hình, ba trình duyệt;
  - vùng bấm 44 px;
  - không lùi Lighthouse;
  - hình bằng SVG hay HTML/CSS, có bản sáng và tối.
- Kiểm thử trình duyệt chờ điều kiện, không chờ cố định.

## Khi xong

1. `npm run build:xem` và `npm test` đạt. Chạy kiểm thử trình duyệt liên quan với `OPUS_TRANG` cho trang của lô.
2. Commit.
3. Viết báo cáo `plans/lam-lai/bao-cao/<d…-l…>.md`:
   - việc đã làm và file đã chạm;
   - số nhận định theo loại, đã sửa, đã bỏ;
   - chỗ chưa chắc;
   - kết quả kiểm thử;
   - nguồn đã dùng;
   - tối đa 4 ảnh tiêu biểu (ảnh đủ do CI chụp).
4. Xuất danh sách cho lượt 2: `node tools/khoa.mjs xuat <D…-L…>`. Lệnh tự bỏ câu về chính site và lấy mẫu lời khuyên tập.
5. Trả lời ngắn: đã làm gì, còn gì, cần chủ repo quyết gì.
