# Quy trình thêm tác phẩm

Áp dụng cho trang thuộc tầng Tác phẩm của site mới: bài học trong `src/content/docs/piano/tac-pham/` và hướng dẫn nghe trong `src/content/docs/nghe-nhac/`. Mục tiêu: thêm một tác phẩm chỉ tạo file mới và nối thêm dữ liệu, không sửa trang nào khác, nên review chỉ cần đọc phần thêm.

**Trạng thái:** dùng được từ sau đợt 6 của `plans/lam-lai/README.md`, khi bản ghi tác phẩm đã đủ trường, `tools/audio/` đã đọc và ghi bản thu trong bản ghi, và công cụ ở mục 2, 4 đã có (việc chuẩn bị của đợt 6). Trước đó không thêm tác phẩm. Ba bài làm thử đầu tiên: xem `README.md` mục "Vận hành sau khi làm lại".

## 1. Khảo sát và duyệt

Như `../opus-zero/plans/v16/khao-sat-g6.md`. Mỗi ứng viên cần đủ:

| Mục | Yêu cầu |
|---|---|
| Bản quyền | Hết bảo hộ ở Việt Nam (tác giả mất từ năm 1975 trở về trước, tính đến năm 2026) và ở Mỹ (xuất bản từ năm 1930 trở về trước, tính đến năm 2026), đúng ấn bản sẽ dùng |
| Ấn bản | Ấn bản hết bảo hộ dùng cho trích đoạn, có số bản in hoặc link IMSLP |
| Nguồn đối chiếu | File số để so từng nốt (Mutopia, kern...) hoặc bản in để chép tay; ghi rõ loại nào |
| Bản thu | PD, CC0, CC BY, CC BY-SA; phát được trên site hay chỉ dẫn link |
| Cấp độ | Bằng chứng: chương trình thi (kỳ nào), trang Henle của đúng tác phẩm |
| Chỗ đứng | Chặng nào, thời kỳ nào, lấp khoảng trống gì |

Bạn duyệt danh sách. Chỉ ứng viên đã duyệt mới sang bước 2.

## 2. Tạo khung

`python3 tools/them_tac_pham.py <slug> --loai bai-hoc|nghe` (tạo ở việc chuẩn bị của đợt 6) sinh:

- một bản ghi cuối `src/data/tac-pham.yml`, điền từ kết quả khảo sát;
- trang mới theo mẫu, đủ các mục bắt buộc (mẫu lấy từ mục "Mẫu trang" của `AGENTS.md`, chốt ở D1.3);
- hồ sơ kiểm định rỗng `kiem-dinh/<đường dẫn>.yml`.

Bản ghi mẫu (giá trị trong `<>` lấy từ khảo sát):

```yaml
- slug: mozart-alla-turca
  loai: bai-hoc                    # bai-hoc | nghe
  tac_gia: mozart                  # id trong src/data/nha-soan-nhac.yml; chưa có thì thêm bản ghi ở đó
  ten: "Rondo alla turca"
  thuoc: "Sonata La trưởng K. 331, chương 3"
  danh_muc: "<số danh mục>"
  giong: "<giọng>"
  nhip: "<nhịp>"
  nam: {gia_tri: "<năm>", nguon: "<id nguồn>"}
  chang: <chặng>
  grade: "<Grade, theo khảo sát>"
  an_ban: {ten: "<ấn bản dùng cho trích đoạn>", nguon: "<link>"}
  doi_chieu: "<Mutopia/kern/chép tay từ bản in>"
  cap: nghe-nhac/mozart-k331       # trang cùng tác phẩm, nếu có
  ky_nang: []                      # cho mục "Chọn bài theo mục tiêu"
  goi_y: false                     # có đưa vào gợi ý tập trong practice.js không
  hinh: {}                         # thông số hình cấu trúc (site cũ để ở tools/figures.py)
  ban_thu: []                      # bản thu và mốc; tools/audio/attach.py ghi, không sửa tay
  them_ngay: <ngày gộp>
```

Danh sách bài cùng chặng, menu, mục lục, danh mục tác phẩm, sách in, "Học tiếp", con số và dòng nhật ký trên trang Cập nhật đều sinh từ bản ghi này lúc build.

## 3. Viết

- Trang theo mẫu; hộp thông tin và chip cấp độ là chỉ thị sinh từ bản ghi, không viết tay.
- Trích đoạn thật đối chiếu từng nốt theo `chuan-kiem-dinh.md` mục 4; bài tập chuẩn bị soạn riêng, ghi "soạn cho trang này".
- Bản thu gắn bằng `tools/audio/attach.py` theo `tools/audio/README.md` (ghi vào bản ghi, không vào trang).
- Ghi hồ sơ kiểm định cho trang mới (lượt 1).

## 4. Kiểm tự động

| Kiểm thử | Kiểm gì |
|---|---|
| Kiểm thử `tac_pham` cho `<slug>` (tạo ở việc chuẩn bị của đợt 6) | Bản ghi đủ trường, đúng kiểu; tác giả có trong dữ liệu; trang đủ mục bắt buộc; khuông nhạc không cảnh báo và đủ phách; trích đoạn có mục đối chiếu trong hồ sơ; bản thu đúng giấy phép; mục Nguồn có link; link nội bộ và anchor đúng |
| Kiểm thử phạm vi (D1.6, mở rộng cho nhánh `them/<slug>`) | Nhánh chỉ chạm các file ở bảng dưới; không sửa dòng có sẵn trong `src/data/` |
| `npm run build:xem`, `npm test` | Như mọi lần: build, schema, khóa, link, trợ năng |

Các file nhánh `them/<slug>` được chạm:

| File | Được làm gì |
|---|---|
| `src/data/tac-pham.yml` | Thêm một bản ghi ở cuối |
| `src/data/nha-soan-nhac.yml` | Thêm một bản ghi, chỉ khi tác giả chưa có |
| `src/content/docs/piano/tac-pham/<slug>.md` hoặc `src/content/docs/nghe-nhac/<slug>.md` | Tạo mới |
| `kiem-dinh/piano/tac-pham/<slug>.yml` hoặc `kiem-dinh/nghe-nhac/<slug>.yml` | Tạo mới |
| `kiem-dinh/khoa.json` | Thêm một dòng (bước 6) |
| `public/audio/<slug>*.mp3`, `public/audio/NGUON.txt` | Thêm file, thêm dòng; chỉ khi bản thu lưu trên site |
| `plans/ben-vung/bao-cao/them-<slug>.md` | Tạo mới |

Cần sửa file khác (một trang lõi muốn dẫn tác phẩm mới làm ví dụ, một lỗi phát hiện ở trang khác) thì ghi vào báo cáo; đó là một việc riêng, có mở khóa nếu trang đã khóa.

## 5. Kiểm định và review

- Lượt 2 độc lập theo `chuan-kiem-dinh.md` mục 3.
- Review (mặc định Claude) chỉ đọc trang mới, bản ghi và hồ sơ: ít nhất 5 sự kiện chọn ngẫu nhiên, trích đoạn so với nguồn ghi trên trang, giấy phép bản thu, giọng văn và thuật ngữ khớp lõi, link về lõi đúng chỗ.
- Bạn kiểm mẫu theo mức đã chọn.

## 6. Gộp và khóa

`node tools/khoa.mjs khoa <trang> du-lieu/tac-pham/<slug>` ghi mã băm của trang và của bản ghi vào `kiem-dinh/khoa.json`, và lần kiểm định vào hồ sơ. Gộp vào `main`: trang lên site thật. Từ đây trang chỉ đổi qua thủ tục mở khóa.

## Lời giao việc mẫu

> Bạn thêm tác phẩm **<tên>** (slug `<slug>`) vào repo opus theo `plans/ben-vung/them-tac-pham.md`. Đọc `AGENTS.md`, `plans/ben-vung/them-tac-pham.md`, `plans/ben-vung/chuan-kiem-dinh.md` và mục của tác phẩm trong file khảo sát đã duyệt. Tạo nhánh `them/<slug>` từ `main`. Chỉ chạm các file trong bảng ở mục 4. Khi xong: `npm run build:xem`, `npm test` (gồm kiểm thử `tac_pham` cho `<slug>` và kiểm thử phạm vi) đều đạt; commit; viết báo cáo `plans/ben-vung/bao-cao/them-<slug>.md` (nguồn đã dùng, chỗ chưa chắc). Không push.
