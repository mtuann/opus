# Kế hoạch phát triển bền vững

Phần "vì sao" của việc làm lại site. Mục tiêu: phần lõi (nền tảng nhạc lý, piano, nhạc cổ điển, khung cấp độ) kiểm định một lần rồi không phải đọc lại; phần mở rộng (tác phẩm) chỉ thêm, mỗi lần chỉ kiểm phần thêm. Bản trình bày có số liệu và biểu đồ: tài liệu Claude Docs "Opus Zero: kế hoạch phát triển bền vững" (https://claude.ai/artifact/PMnBEmGUxUfMzyZXufYmxi, chỉ người được chủ repo chia sẻ mới mở được). Hai bản khác nhau thì file trong repo đúng.

**Thực hiện theo `plans/lam-lai/README.md`** (quyết định ngày 23/10/2026): site mới dựng trong repo mới `mtuann/opus`, git từ đầu, đăng ở https://mtuann.github.io/opus/; site cũ ở nguyên repo cũ `mtuann/opus-zero`, thư mục cạnh `../opus-zero/` (chỉ đọc). Nội dung chuyển sang theo 10 đợt và mỗi trang qua kiểm định, khóa trước khi lên site. Thứ tự A–D trước đây không dùng nữa (bảng đổi ở mục "Từ A–D sang các đợt"). Các tầng, bốn luật, lớp dữ liệu, chuẩn kiểm định và quy trình thêm tác phẩm vẫn là chuẩn. Mọi quyết định còn chờ ghi ở mục "Quyết định" của `plans/lam-lai/README.md`.

| File | Nội dung |
|---|---|
| `README.md` (file này) | Vì sao, các tầng, bốn luật, lớp dữ liệu, từ A–D sang các đợt, vận hành sau khi làm lại |
| `kiem-ke.md` | Tầng đề xuất và số liệu của 233 trang cũ; sinh lại bằng `python3 plans/ben-vung/kiem_ke.py > plans/ben-vung/kiem-ke.md` |
| `chuan-kiem-dinh.md` | Nhận định, thứ bậc nguồn, kiểm định hai lượt, hồ sơ, khóa, mở khóa |
| `them-tac-pham.md` | Thêm một tác phẩm, dùng từ sau đợt 6 |

## Vì sao phải làm lại

Số liệu đếm trên commit `5d08189` của repo cũ (23/10/2026, bản v15).

| Nguyên nhân | Bằng chứng | Hệ quả |
|---|---|---|
| Cùng một thông tin viết tay ở nhiều nơi | Cấp độ một bài ghi ở 8 nơi (`tests/levels.py`); 110 chỗ ghi con số về site (`tests/counts.py`); năm sinh–mất viết tay ít nhất 161 lần | Thêm một bài học phải sửa ít nhất 13 file; đổi chặng một bài là sửa 8 chỗ |
| Không có hồ sơ kiểm chứng | Mục Nguồn chỉ liệt kê nguồn, không ghi câu nào đã đối chiếu với nguồn nào | Mỗi lần review bắt đầu lại từ đầu; lỗi cũ lộ ra muộn |
| Mỗi đợt gộp nhiều chủ đề | 9 commit chạm từ 50 file trở lên | Khó thấy chỗ hỏng, review phải đọc lại nhiều |

Kiểm thử của site cũ chỉ báo chỗ lệch sau khi đã sửa tay; chúng không làm giảm số chỗ phải sửa. Muốn hết cảnh sửa rồi kiểm lại, phải bỏ chính các bản sao: mỗi thông tin chỉ ghi một lần, các chỗ khác sinh ra từ đó.

## Các tầng

| Tầng | Trang | Gồm | Giữ đúng bằng cách | Chuyển ở |
|---|---|---|---|---|
| Lõi | 100 | Piano nền tảng 28, nhạc lý 37, nhạc cổ điển nền tảng 22, luyện tai 6, bắt đầu 6, tài liệu tham khảo 1 | Kiểm định một lần, khóa | Đợt 2–5 |
| Tác phẩm | 79 | 34 bài học, 45 hướng dẫn nghe | Kiểm định từng trang, khóa; về sau chỉ thêm | Đợt 6 |
| Tham chiếu có hạn | 7 | Thầy và thi, Tác phẩm theo cấp độ, chọn đàn, nghệ sĩ, hỏi đáp, ứng dụng, tài nguyên | Kiểm định, khóa, rà lại theo ngày ghi | Đợt 8 |
| Khung và công cụ | 34 | Trang chủ, mục lục, công cụ luyện tập, Cập nhật, blog | Sinh từ dữ liệu, kiểm thử tự động | Cùng đợt với mục của nó; công cụ và blog ở đợt 7 |
| Ngoại vi | 13 | Nhạc cụ, opera, nhạc Việt Nam, đương đại, nữ nhà soạn nhạc | Kiểm định, khóa; mục Đọc thêm, ghi "ngoài lộ trình" | Đợt 8 |

Danh sách từng trang: `kiem-ke.md`. Trang nào thuộc đợt, lô nào: `plans/lam-lai/anh-xa.md`.

## Bốn luật

1. **Một thông tin, một chỗ.** Điều gì xuất hiện ở hơn một trang (cấp độ, năm sinh–mất, số danh mục, danh sách tác phẩm, con số về site) nằm trong `src/data/` và được sinh ra lúc build.
2. **Lõi không liệt kê tác phẩm bằng tay.** Lõi được nêu một tác phẩm làm ví dụ; danh sách và con số do dữ liệu sinh.
3. **Tác phẩm chỉ thêm.** Trang tác phẩm dẫn link về lõi để giải thích khái niệm; thêm tác phẩm không sửa trang nào khác.
4. **Một tác phẩm, một bản ghi.** Bài học và hướng dẫn nghe cùng tác phẩm dùng chung bản ghi; năm, ấn bản, cấu trúc chỉ viết ở đó.

## Lớp dữ liệu

| File | Gồm | Thay cho (ở site cũ, trong `../opus-zero/`) | Tách ở | Khóa ở |
|---|---|---|---|---|
| `src/data/cap-do.yml` | 7 chặng: tên, Grade tương đương, mốc thời gian, thời lượng tập | `STAGES` trong `tests/levels.py` và `docs/assets/js/practice.js`; bảng chặng ở `docs/piano/lo-trinh.md` | D1.2 | Đợt 2 |
| `src/data/tac-pham.yml` | 79 bản ghi, trường như `them-tac-pham.md` mục 2 | Chip và hộp thông tin của 34 bài học; bảng ở `piano/tac-pham/index.md`, `nghe-nhac/index.md`; phần bài của site trong `tac-pham-theo-cap.md`, `lo-trinh.md`, `thay-va-thi.md`; nav; `SUGGEST` của `practice.js`; chương sách in; mục "Học tiếp" | D1.2 | Từng trường, ở lô đầu tiên có trang hiện trường ấy: đợt 2 (`ten`, `tac_gia`, `danh_muc`, `chang`, `loai`, `goi_y`; `grade` nếu trang chặng hiện Grade, không thì D8-L1); đợt 6 (phần còn lại) |
| `src/data/nha-soan-nhac.yml` | Mọi người có năm sinh–mất trên site | Năm sinh–mất viết tay | D1.2 | Đợt 2 |
| `src/data/thuat-ngu.yml` | Thuật ngữ và định nghĩa | Các bảng trong `docs/nhac-ly/tu-dien.md` | D1.2 | Đợt 3 (lô D3-L5) |
| `src/data/trang.yml` | Tầng của mọi trang; ngày rà (`ra_lai`) của trang tham chiếu | `kiem-ke.md` | D1.2 | Không khóa; kiểm thử: mỗi trang đúng một tầng, trang tham chiếu có `ra_lai` |

- Con số về site (số bài học, số chặng, số trang) tính lúc build, không viết tay; thay cho `tests/counts.py`.
- Tách bằng script một lần (`tools/du_lieu/`). Chỗ site cũ tự mâu thuẫn (hai năm khác nhau cho cùng người) ghi vào báo cáo, không tự chọn.
- Dữ liệu sai kiểu, trùng id hay tham chiếu tới thứ không có thì build hỏng.

## Từ A–D sang các đợt

| Trước đây | Nay, trong `plans/lam-lai/README.md` |
|---|---|
| A. Nền dữ liệu (A1–A4) | D1.2 (dữ liệu và schema), D1.3–D1.5 (sinh từ dữ liệu, link), đợt 0 (repo mới, `AGENTS.md` và `README.md` mới) |
| Cổng A (chữ trước và sau giống nhau) | Kiểm thử so chữ của `tools/chuyen/` (D1.4); hồ sơ ghi mọi chữ đã đổi |
| B0. Chuẩn và công cụ khóa | D1.6 |
| B1–B4. Kiểm định lõi | Đợt 2–5: mỗi lô vừa chuyển vừa kiểm định |
| C. Quy trình mở rộng, làm thử 3 bài | Công cụ ở việc chuẩn bị của đợt 6; ba bài thử làm ngay sau đợt 6 |
| D. Tác phẩm hiện có và vận hành | Đợt 6 (79 trang có sẵn), đợt 8 (tham chiếu), mục Vận hành dưới đây |

## Vận hành sau khi làm lại

1. **Tác phẩm mới** theo `them-tac-pham.md`. Làm thử trước ba bài của lô C trong `../opus-zero/plans/v16/khao-sat-g6.md`, đã có nguồn Mutopia để đối chiếu và bản thu phát được: Mozart, *Alla turca*; Debussy, Arabesque số 1; Rachmaninoff, Prelude Đô♯ thứ Op. 3 số 2. Sau đó phần còn lại của khảo sát đó (lô A, B) và `../opus-zero/plans/v16/khao-sat-g4c.md`; kiểm lại giấy phép và tình trạng file trước khi dùng.
2. **Trang tham chiếu có hạn** rà theo `ra_lai`; workflow hằng tuần mở issue khi quá hạn. Đầu tiên là Thầy và thi, Tác phẩm theo cấp độ khi chương trình piano ABRSM 2027–2028 bắt đầu dùng (tháng 1/2027).
3. **Sửa trang đã khóa** chỉ theo thủ tục mở khóa (`chuan-kiem-dinh.md` mục 7).
4. **Mở rộng lõi** (các ý ở mục "Ý tưởng để sau" của `../opus-zero/plans/ke-hoach-v15.md`) chỉ theo đợt có kế hoạch, kiểm định đủ trước khi gộp.
5. **Nâng Astro và Starlight** mỗi tháng trên nhánh riêng (`plans/lam-lai/cong-nghe.md` mục 3).

Báo cáo của các việc vận hành: `plans/ben-vung/bao-cao/<mã việc>.md` (ví dụ `them-mozart-alla-turca.md`).
