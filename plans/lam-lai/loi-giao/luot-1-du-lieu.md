# Lượt 1 cho bản ghi dữ liệu (<việc>, phần <x>)

Bạn kiểm định **lượt 1** cho các bản ghi `<bộ>/<id>…` trong `src/data/`. Đọc trước:
- `plans/ben-vung/chuan-kiem-dinh.md`: mục 1, 2 (kể cả "Nguồn và cách mở") và 5;
- `src/du-lieu.mjs`, đối tượng `schema`.

## Mỗi bản ghi

1. `node tools/khoa.mjs mau du-lieu/<bộ>/<id>` tạo hồ sơ mẫu.
2. Viết nhận định cho các trường của việc. Mỗi nhận định có:
   - `id`;
   - `cau`: câu tiếng Việt nói đúng điều dữ liệu ghi;
   - `loai`;
   - `truong`: các trường câu ấy nói tới, ví dụ `[sinh, mat, khoang]`;
   - `nguon`;
   - `ket_qua`;
   - `ghi_chu` khi cần.

   Không ghi `luot_2`. Tách gọn: tên một câu, năm một câu, thời kỳ một câu.
3. Nguồn bậc 2: chỉ ghi trang đã mở và có nói điều ấy.
4. Kết quả:
   - `dung`.
   - Dữ liệu sai: **không sửa `src/data/`**. Ghi `da-sua`, viết câu đúng vào `cau`, ghi cũ và mới cùng lý do ở `ghi_chu`. Thêm một mục vào file sửa của phần: `{ban_ghi, truong, cu, moi, nhan_dinh, nguon, ly_do}`. Người gom áp dụng một lần, vì nhiều agent cùng làm.
   - Không quyết được: `ket_qua: null`, `ghi_chu: "chưa chắc: …"`.
5. Điền `lan[0].ngay` và `nguoi.luot_1`. Kiểm hồ sơ đọc được bằng `node tools/khoa.mjs xuat du-lieu/<bộ>/<id>`.

## Gợi ý theo bộ dữ liệu

Rút từ D2-0.

- **Người:**
  - Năm sinh, mất theo IMSLP, BnF, LoC (`.json`) và GND (qua deutsche-biographie.de).
  - Năm ước chừng thì `khoang: true`.
  - Người còn sống: tìm tin mất tới tháng hiện tại.
  - Id mơ hồ (cùng họ) thì xác định người qua `ten` và cách site cũ dùng, ghi ở `ghi_chu` của hồ sơ.
- **Tác phẩm:**
  - Tên, tác giả (`gan_cho`, `khuyet_danh`), số danh mục: IMSLP, danh mục tác phẩm, Henle.
  - Grade: tìm đúng bài trong đề cương chính thức (ABRSM, Trinity, RCM) trước. Không có thì viết "tương đương khoảng" theo mức Henle.
  - `chang` phải khớp `grade` và `cap-do.yml`.
- `loai` của tác phẩm, tên chặng: lựa chọn của site, ghi ở `ghi_chu` của hồ sơ, không phải nhận định.

## Đầu ra

- Hồ sơ của phần.
- File sửa `plans/lam-lai/bao-cao/<việc>/sua-<x>.yml`.
- Ghi chú `plans/lam-lai/bao-cao/<việc>/luot-1-<x>.md`:
  - số liệu;
  - chỗ chưa chắc;
  - vấn đề schema;
  - nguồn hay dùng.

## Quy tắc

- Chỉ ghi các file của phần mình: có agent khác làm cùng worktree.
- Không build, không chạy kiểm thử, không commit, không push.
- Không đưa thông tin cá nhân của chủ repo ra ngoài.
- Xong thì trả lời: số liệu, chỗ chưa chắc, chỗ sửa, điều người gom phải quyết.
