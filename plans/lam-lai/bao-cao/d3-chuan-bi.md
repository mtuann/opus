# D3, nhánh chuẩn bị (trước D3-L2)

Nhánh `moi/d3-chuan-bi`, ngày 27/10/2026, Claude Opus 5.5 (phiên Cowork). Mức review: **Vừa** (script công cụ, kiểm thử, tài liệu). Làm các việc mục "Cần chủ repo quyết" (mục 2) và "Việc cho nhánh sau" của `d3-l1.md`.

## Đã làm

- **Trang mẫu** (`tools/trang-mau.mjs`): thêm sáu loại khối vào `KHOI` (bàn phím, hóa biểu, mười lăm hóa biểu, vòng quãng năm tĩnh, vòng quãng năm bấm được, luyện hóa biểu); trang đã đổi lấy làm mẫu tối đa 8 (`TOI_DA_TRANG_DOI`), bằng số trang một lô của đợt 3.
- **So chữ** (`tools/chuyen/so-chu.mjs`):
  - `boPhanSinh`, `khoiSo`, `tru` chuyển từ `tests/chuyen.test.mjs` sang script và xuất ra; script bỏ phần `data-sinh` như phép thử (trước đây CLI báo khác ở trang có hình sinh ra);
  - `--doi-chu`: in khung YAML `doi_chu` cho các khối khác chưa ghi trong hồ sơ, chỉ còn điền `ly_do` (`khungDoiChu`); trang chưa build thì báo "KHÔNG SO ĐƯỢC" rồi làm trang sau.
- **Nhập lượt 2** (`tools/khoa.mjs nhap`): `luot_2_nguon` ghi link trong nháy kép, để PyYAML đọc được link có `?`. Thêm một phép thử trong `tests/khoa.test.mjs`. Hồ sơ cũ không đổi.
- **Lời giao**:
  - mới `loi-giao/luot-1-trang.md` (lượt 1 khi agent làm lô giao cho agent con); `lo.md`, `README.md` của `loi-giao/` và mục "Lời giao việc mẫu" của kế hoạch trỏ tới;
  - `luot-2-trang.md`: link trong nháy kép; kiểm file bằng thư viện `yaml` của repo (Node), không bằng PyYAML.
- **`AGENTS.md`**: thông số `::cong-cu{ten="piano"}`, hai hình và hai công cụ mới, `nhac-ly.js`, `ve.js`, `am-thanh.js`, `public/mau-am/piano/` và dòng ghi nguồn tự sinh, `data-sinh`; ngoại lệ phím đen từ 24 px (chủ repo đã chấp nhận); lời giải thích câu hỏi không dựa vào vị trí lựa chọn; trang mẫu tối đa 8 và loại khối mới; `so-chu.mjs --doi-chu`; công cụ dùng micro đặt `audioSession` là `play-and-record`.
- **Chuẩn kiểm định**: quy ước cho câu `ve-site` trỏ tới trang chưa chuyển và câu nói về phần do thành phần sinh ra; quy tắc lời giải thích câu hỏi; "Nguồn và cách mở": OMT (403, cách mở), Internet Archive, Britannica/ISO/Carleton, tìm tạm qua DuckDuckGo HTML. IMSLP: không vòng qua bước chờ của trang tải (không ghi cách lấy link `s9.imslp.org` mà D3-L1 nêu), lấy bản nhạc ở Mutopia, Commons, Internet Archive.
- **Kế hoạch**: bảng Tiến độ ghi đợt 3 đang làm, D3-L1 xong 24/10.

## Chưa làm, để lại

- **Việc dài của abcjs và Lighthouse ở trang nhiều khuông** (TBT 318 ms ở tờ tóm tắt khi đăng): cần đo trên trình duyệt, máy làm nhánh này không có trình duyệt Playwright. Nên làm thành một nhánh riêng mức Vừa trước D3-L3 (lô có nhiều khuông hơn), hay trong D3-L2 nếu Lighthouse của lô lùi dưới 95.
- **Giữ chỗ cho khuông chưa vẽ** (`thanh-phan.css`, hằng số chỉ đo ở Für Elise): cùng lý do, đo cùng lúc với việc trên.
- Trước D4-L1: `giuMau` bỏ mẫu có yêu cầu cũ nhất; chờ lâu dần khi tải mẫu hỏng liên tục.

## Kiểm thử

- `npm run build:xem`: 28 trang, không cảnh báo `[opus]`.
- `npm test`: 133 phép thử, 132 đạt, 1 bỏ qua (kiểm thử phạm vi: nhánh này không phải nhánh lô), 0 hỏng.
- `node tools/chuyen/so-chu.mjs nhac-ly/08-hoa-bieu nhac-ly/11-hop-am-bay --doi-chu`: bài 8 "doi_chu đã đủ"; bài 11 (chưa chuyển) "KHÔNG SO ĐƯỢC".
- Kiểm thử trình duyệt và Lighthouse: chạy ở `test.yml` khi push nhánh.

## Sửa theo review mã

Review (Claude Sonnet 5.5, mức Vừa, chỉ đọc diff): không có chỗ phải sửa; đã sửa các chỗ nên sửa sau.

- `khungDoiChu` gộp khối khác theo vị trí trong danh sách khối khác, nên hai chỗ khác cách xa nhau trên trang có thể bị gộp làm một mục. Nay gộp theo bước của phép so (`buoc`): chỉ gộp khi không có khối giống xen giữa. `khacNhau` giữ nguyên kết quả.
- `--doi-chu`: không gọi `process.exit` ngay sau khi ghi ra (có thể cắt chữ khi ghi vào ống); trang không so được thì mã thoát 1; hồ sơ có `doi_chu` không phải danh sách, hay YAML hỏng, thì báo ở trang ấy thay vì dừng cả lệnh.
- Đầu file `so-chu.mjs` ghi rõ: phần tử `data-sinh` bị bỏ hẳn, kể cả tiêu đề, khuông, câu hỏi nằm trong nó.
- Không sửa: bộ nhận dạng `oz-ks-hinh`, `oz-vong-tinh` của `KHOI` (đã kiểm: chỉ có trong HTML của khối ấy; CSS nằm ở file riêng, không trong HTML trang).
