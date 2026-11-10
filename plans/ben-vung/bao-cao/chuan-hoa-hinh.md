# Chuẩn hóa sau các đợt hình (09/11/2026)

Nhánh `mo/chuan-hoa-hinh`. Chủ repo: "phần làm hình đã xong, chuẩn hóa, xem còn gì".

## Kiểm toàn site

Trên bản thật (243 trang), 152 trang có hình, chạy bằng Playwright:

- tương phản chữ trong SVG với nền ngay sau chữ, chế độ sáng và tối, 1280 px: không có chỗ dưới 3:1 (hai chỗ báo ở `piano/gam` là thanh trên cùng đè lên ảnh chụp hình cao hơn màn hình, không phải lỗi hình);
- chữ ra ngoài khung SVG: không có;
- hình tràn ngang ở 360 px: không có;
- mọi SVG trong nội dung có `role="img"` và `aria-label` (trừ biểu tượng 24 px, `aria-hidden`); mọi `figure` có chú thích, viết hoa đầu câu, kết bằng dấu chấm (trừ dòng thời gian bấm được ở `lich-su/dong-thoi-gian`, có tiêu đề riêng);
- mọi hình tĩnh trong `src/components/hinh/` đều có trang dùng; không có tên `::hinh` nào thiếu thành phần.

## Đã sửa

| Mục | Sửa | Hồ sơ |
|---|---|---|
| `piano/tieng-dan` | "búa chặn tiếng" thành "bộ giảm âm", như hình `bo-may-dan`, `ban-dap`, `lich-su-dan`, Từ điển (báo cáo hinh-dot-4, "Còn mở") | n3, n87, doi_chu; lần 4 |
| `nghe-nhac/beethoven-moonlight` | Đề xuất 17 còn lại: mục "Sơ đồ cấu trúc", sáu ô theo sáu dòng bảng "Theo dõi khi nghe" | n30 (ve-site), doi_chu |
| bản ghi `tac-pham/beethoven-anh-trang` | Thêm `hinh.nghe` (hinh.bai-hoc giữ nguyên) | n30 (cau-truc); lượt 2 độc lập: dung (bản Humdrum của Craig Sapp, 69 ô; Mutopia bị chặn ở máy kiểm) |
| `piano/tac-pham/beethoven-anh-trang` | Không đổi chữ; mở và khóa lại vì bản ghi dùng chung được mở | lần mới |
| `AGENTS.md` | Gom mô tả các đợt hình thành một mục, theo thứ tự đợt, kèm quy ước chung cho hình mới | |
| `de-xuat-hinh.md` | Ghi trạng thái: đủ 30 đề xuất, đợt nào làm đề xuất nào | |

Soát (review và kiểm mẫu gộp, thủ tục hình) do một agent khác người vẽ: hai n30 dung, n3 và n87 dung; ảnh 1280/360 px, sáng và tối đọc được, không tràn.

## Còn mở (để chủ repo quyết)

- Hình bộ máy đàn giản lược (bỏ wippen, bộ chặn ngược; chú thích ghi "vẽ giản lược"): giữ.
- Sơ đồ đoạn (`::hinh-cau-truc`) cho mỗi ô một độ rộng tối thiểu, nên độ dài các ô chỉ gần đúng theo số ô nhịp, nhất là ở 360 px (ô xuống hai hàng). Chú thích "độ dài các ô theo số ô nhịp" vẫn chấp nhận được; muốn chính xác thì đổi thành phần (mức "Vừa").
