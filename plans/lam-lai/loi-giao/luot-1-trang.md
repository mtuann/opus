# Lượt 1 cho trang (<D…-L…>, phần <x>/<n>)

Agent làm lô giao cho agent con khi lô nhiều trang (rút từ D3-L1: 8 trang, 2 phần). Trang đã chuyển và đã so chữ; agent con chỉ kiểm định.

Bạn kiểm định **lượt 1** cho các trang `<trang…>` (worktree `<đường dẫn>`, nhánh `moi/<d…-l…>`). Đọc trước:
- `plans/ben-vung/chuan-kiem-dinh.md`: mục 1 (loại nhận định, kể cả `ve-site`), 2 (kể cả "Nguồn và cách mở"), 3, 4, 5;
- `AGENTS.md`, mục "Mẫu trang và khối đặc biệt";
- một hồ sơ đã khóa cùng loại để xem cách ghi, như `kiem-dinh/nhac-ly/08-hoa-bieu.yml`.

## Mỗi trang

1. `node tools/khoa.mjs mau <trang>` (nếu người giao chưa tạo). Giữ `doi_chu` người giao đã ghi.
2. Tách trang thành nhận định: mọi câu có thể đúng hay sai, kể cả chữ trong bảng, câu hỏi (dòng `+`, `>`), chú thích, chữ của hình hay công cụ mà trang hiện ra. Mỗi nhận định: `id`, `cau`, `loai`, `nguon`, `ket_qua`, `ghi_chu` khi cần. Không ghi `luot_2`.
3. Nguồn: theo thứ bậc của chuẩn; nhạc lý theo Open Music Theory, dẫn link đúng chương. Chỉ ghi trang đã mở và có nói điều ấy; chỗ quan trọng thì trích nguyên văn ngắn ở `ghi_chu`.
4. Câu về chính site (`ve-site`): kiểm trên trang, dữ liệu, bản xem; `ghi_chu` ghi đã kiểm ở đâu. Trang đích chưa chuyển thì kiểm trên site cũ và ghi rõ điều cần giữ (chuẩn mục 1). Câu vừa nói về site vừa có điều cần nguồn thì tách đôi.
5. Kết quả:
   - `dung`;
   - sai: sửa trang (mỗi chỗ sửa có nguồn), `da-sua`, `ghi_chu` ghi chữ cũ, chữ mới, lý do; thêm mục vào `doi_chu` (`node tools/chuyen/so-chu.mjs <trang> --doi-chu` in khung);
   - câu thừa hay không kiểm được: bỏ khỏi trang, `da-bo`;
   - không quyết được: `ket_qua: null`, `ghi_chu: "chưa chắc: …"`.
6. Khuông nhạc: mỗi khối ```` ```abc ```` một mục `khuong_nhac` (chuẩn mục 4). Ví dụ soạn: kiểm đúng điều trang nói, số ngón chơi được.
7. Thuật ngữ trang dùng: nhận định cho bản ghi `src/data/thuat-ngu.yml` (`node tools/khoa.mjs mau du-lieu/thuat-ngu/<id>`, mỗi nhận định có `truong`). Tên tiếng Việt (`nghia`) và `nhom` là lựa chọn của site, không phải nhận định. Thuật ngữ chưa có bản ghi thì ghi ở `ghi_chu` của hồ sơ trang cho D3-L5.
8. Điền `lan[0].ngay`, `nhanh`, `nguoi.luot_1` (model và phần). Kiểm hồ sơ đọc được: `node tools/khoa.mjs xuat <trang>`.

## Quy tắc

- Chỉ ghi trang và hồ sơ của phần mình: agent khác làm cùng worktree. Không sửa thành phần, dữ liệu, kiểm thử: chỗ cần sửa thì ghi lại cho người giao.
- Câu hỏi: lời giải thích không dựa vào vị trí lựa chọn. Trang không có khoảng trắng cuối dòng.
- Lời khuyên dính tới sức khỏe không xếp `khuyen-tap`. Trang Lõi không giữ chi tiết mau cũ.
- Không build, không commit, không push. Không đưa thông tin cá nhân của chủ repo ra ngoài; User-Agent khi cần: `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`.

## Trả lời

Ngắn: số nhận định theo loại; đã sửa, đã bỏ (trang, id, một dòng lý do); chỗ chưa chắc; nguồn hay dùng; chỗ người giao phải sửa hay quyết.
