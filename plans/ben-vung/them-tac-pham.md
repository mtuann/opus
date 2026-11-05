# Quy trình thêm tác phẩm

Áp dụng cho trang thuộc tầng Tác phẩm của site mới: bài học trong `src/content/docs/piano/tac-pham/` và hướng dẫn nghe trong `src/content/docs/nghe-nhac/`. Mục tiêu: thêm một tác phẩm chỉ tạo file mới và nối thêm dữ liệu, không sửa trang nào khác, nên review chỉ cần đọc phần thêm.

**Trạng thái:** dùng được từ sau đợt 6 của `plans/lam-lai/README.md`, khi bản ghi tác phẩm đã đủ trường. `tools/audio/` đọc và ghi bản thu trong bản ghi, công cụ ở mục 2 và kiểm thử ở mục 4 đã có từ việc chuẩn bị D6-0 (`plans/lam-lai/bao-cao/d6-0.md`). Trước khi đợt 6 xong không thêm tác phẩm. Còn chờ D6-L11: danh mục tác phẩm, và sách in đọc danh sách tác phẩm từ dữ liệu (lúc D6-0, chương sách in còn liệt kê tay trong `src/sach/sach.mjs`; menu đã tự thêm trang mới vào nhóm Tác phẩm). Ba bài làm thử đầu tiên: xem `README.md` mục "Vận hành sau khi làm lại".

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

```bash
node tools/them-tac-pham.mjs <slug> --loai bai-hoc --tac-gia <id> --ten "<tên>" --chang <1–7> --grade "Grade <n>" [--danh-muc "<số danh mục>"] [--thoi-ky "<thời kỳ>"]
node tools/them-tac-pham.mjs <slug> --loai nghe --tac-gia <id> --ten "<tên>"
```

Công cụ làm ở D6-0, viết bằng Node thay cho `tools/them_tac_pham.py` ghi lúc đầu: dùng chung schema và kiểm chéo của `src/du-lieu.mjs`, lệnh `mau` của `tools/khoa.mjs` và cách đọc ghi YAML của bản build. Nó sinh:

- một bản ghi cuối `src/data/tac-pham.yml`: trường như bản ghi cùng loại đã có, chỗ cần điền ghi `[[điền: …]]`; dòng "Nhà soạn nhạc" của bảng thông tin và chip cấp độ lấy từ dữ liệu;
- một dòng `- id: <trang>`, `tang: tac-pham` cuối `src/data/trang.yml` (kiểm chéo của dữ liệu đòi trang chính của bản ghi có tầng);
- trang mới theo mẫu, đủ các mục bắt buộc (mẫu lấy từ mục "Mẫu trang" của `AGENTS.md`, chốt ở D1.3);
- hồ sơ kiểm định mẫu của trang `kiem-dinh/<đường dẫn>.yml` và của bản ghi `kiem-dinh/du-lieu/tac-pham/<slug>.yml` (`node tools/khoa.mjs mau`).

Dữ liệu sau khi thêm phải qua schema và kiểm chéo; không qua thì công cụ trả lại các file như cũ. Tác giả chưa có trong `nha-soan-nhac.yml` thì thêm bản ghi tác giả trước (có hồ sơ), rồi chạy lại. `--cap` tới trang có bản ghi riêng (như `nghe-nhac/mozart-k331`) cần bản ghi kia trỏ `cap` ngược lại, tức sửa một bản ghi đã có: việc riêng, có mở khóa nếu bản ghi ấy đã khóa.

Bản ghi chưa khóa trường nào không hiện ở trang đã khóa hay trang luôn đăng (trang chặng, ô gợi ý tập, danh sách "Học tiếp"…; `coTruongDaKhoa` trong `src/du-lieu.mjs`), nên thêm bản ghi không làm hỏng build; tác phẩm hiện ở các danh sách ấy khi bản ghi được khóa (mục 6).

Bản ghi mẫu (giá trị trong `<>` lấy từ khảo sát; `ban_thu` không có cho tới khi `attach.py` ghi, vì schema không nhận danh sách rỗng):

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
  hinh: {bai-hoc: [...]}           # sơ đồ các đoạn (site cũ để ở tools/figures.py); công cụ sinh khung một đoạn
  ban_thu: [...]                   # bản thu; tools/audio/attach.py ghi, không sửa tay. Mốc ở trang: ::khoi-nghe{moc="…"}
  them_ngay: <ngày gộp>
```

Danh sách bài cùng chặng, menu, mục lục, danh mục tác phẩm, sách in, "Học tiếp", con số và dòng nhật ký trên trang Cập nhật đều sinh từ bản ghi này lúc build.

## 3. Viết

- Trang theo mẫu; hộp thông tin và chip cấp độ là chỉ thị sinh từ bản ghi, không viết tay.
- Trích đoạn thật đối chiếu từng nốt theo `chuan-kiem-dinh.md` mục 4; bài tập chuẩn bị soạn riêng, ghi "soạn cho trang này".
- Bản thu gắn bằng `tools/audio/attach.py` theo `tools/audio/README.md` (bản thu ghi vào bản ghi, mốc tham khảo ghi vào `::khoi-nghe{moc="…"}` của trang).
- Ghi hồ sơ kiểm định cho trang mới (lượt 1).

## 4. Kiểm tự động

| Kiểm thử | Kiểm gì |
|---|---|
| Kiểm thử `tac_pham` (D6-0): `tests/tac-pham.test.mjs` cho mọi trang tác phẩm | Trang đủ mục bắt buộc, đúng thứ tự, chỉ thị đúng mục; bảng "Theo dõi khi nghe" cột đầu "…"; mục Nguồn có link; bản ghi đủ trường; không còn `[[điền: …]]` |
| Các kiểm thử khác của `npm test` | Bản ghi đúng kiểu, tác giả có trong dữ liệu (`du-lieu.test.mjs`); khuông nhạc không cảnh báo và đủ phách (`khuong-nhac.test.mjs`); bản thu đúng giấy phép, file có thật, mốc hợp bảng (`ban-thu.test.mjs`: `tools/audio/check_audio.py --static`); link nội bộ và anchor (`link.test.mjs`); trích đoạn có mục đối chiếu trong hồ sơ (`node tools/khoa.mjs khoa`) |
| Kiểm thử phạm vi (`tests/pham-vi.test.mjs`, nhánh `them/<slug>`, D6-0) | Nhánh chỉ chạm các file ở bảng dưới; dữ liệu và `NGUON.txt` chỉ nối thêm ở cuối; khóa đã có trong `khoa.json` giữ nguyên, khóa mới chỉ của tác phẩm (và tác giả mới) |
| `npm run build:xem`, `npm test` | Như mọi lần: build, schema, khóa, link, trợ năng |

Các file nhánh `them/<slug>` được chạm:

| File | Được làm gì |
|---|---|
| `src/data/tac-pham.yml` | Thêm một bản ghi ở cuối |
| `src/data/nha-soan-nhac.yml` | Thêm một bản ghi, chỉ khi tác giả chưa có |
| `src/data/trang.yml` | Thêm một dòng (tầng `tac-pham` của trang mới) |
| `src/content/docs/piano/tac-pham/<slug>.md` hoặc `src/content/docs/nghe-nhac/<slug>.md` | Tạo mới |
| `kiem-dinh/piano/tac-pham/<slug>.yml` hoặc `kiem-dinh/nghe-nhac/<slug>.yml` | Tạo mới |
| `kiem-dinh/du-lieu/tac-pham/<slug>.yml`; `kiem-dinh/du-lieu/nha-soan-nhac/<id>.yml` (tác giả mới) | Tạo mới |
| `kiem-dinh/khoa.json` | Thêm khóa của trang và của bản ghi (bước 6) |
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
