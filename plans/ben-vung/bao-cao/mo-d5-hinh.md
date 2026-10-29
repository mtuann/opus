# Mở khóa mo/d5-hinh: sơ đồ mermaid thành hình tĩnh

Nhánh `mo/d5-hinh` từ `main` (`7abbe36`), Claude Opus 5.5 (phiên Cowork), 29/10/2026.

## Lỗi

Chủ repo báo (29/10/2026): ở `hinh-thuc/sonata`, sơ đồ hiện nguyên mã `flowchart LR …`. Site cũ (MkDocs) vẽ Mermaid; site mới không có gì vẽ Mermaid, nên khối ```mermaid thành khối mã. Năm trang đã khóa ở đợt 5 bị lỗi này (site cũ chỉ dùng Mermaid ở đúng năm trang): `hinh-thuc/sonata`, `rondo`, `concerto`, `fugue`, `nhan-dien/the-loai`. Kiểm thử và review đợt 5 không bắt được vì bản build vẫn đạt.

## Sửa

- Năm hình tĩnh mới trong `src/components/hinh/` (HTML và CSS, màu theo các ô `oz-seg` sẵn có, đọc được ở chế độ tối, không cần thư viện):
  - `form-sonata`: bốn phần, mỗi phần một tên, cùng màu là cùng chủ đề;
  - `form-rondo`: A B A C A;
  - `form-ritornello`: ritornello xen độc tấu;
  - `fugue-trinh-bay`: lưới ba bè theo ô nhịp của phần trình bày BWV 847 (chữ lấy từ bảng ô nhịp của trang); đặt dưới đoạn giới thiệu BWV 847;
  - `cay-the-loai`: cây quyết định bằng danh sách lồng nhau (6 câu hỏi, 8 ô thể loại, 13 nhánh như sơ đồ cũ).
- CSS mới trong `src/styles/thanh-phan.css` (`oz-form-nhom`, `oz-form-khoi`, `oz-fugue`, `oz-cay`).
- Kiểm thử `tests/hinh-tinh.test.mjs`: không trang nào còn khối mermaid; năm hình có đủ nhãn của sơ đồ cũ; cây có đúng số câu hỏi, ô và nhánh.
- `src/du-lieu.mjs`: dấu vết dựng lại tính cả hình tĩnh (`src/components/hinh/*.html`). Trước đây sửa hình mà trang không đổi thì bản build trên máy giữ HTML cũ (bản build sạch trên CI không bị). Kiểm thử ở `tests/du-lieu.test.mjs`.

## Kiểm định

Mỗi trang một nhận định `ve-site` mới về hình; các nhận định về sơ đồ cũ ghi chú thêm. Lượt 2 là một agent độc lập: đối chiếu hình với khối mermaid cũ, chữ của trang và ảnh chụp (1280px và 390px, sáng và tối). Góp ý đã làm: hình fugue chuyển xuống dưới đoạn giới thiệu BWV 847 (hình ghi ô nhịp của bài này), đoạn chuyển ô 5–6 là một ô trải hai bè, đáp đề cùng màu chủ đề, rondo không xuống dòng trên điện thoại, cây bớt bo tròn.

Khóa lại năm trang; bản build thật 117 trang; `npm test` 188 pass.

Trang link tới đoạn đã sửa: không có link tới anchor của các sơ đồ; chữ quanh hình không đổi.
