# D8, nhánh chuẩn bị (trước D8-L1)

Nhánh `moi/d8-chuan-bi`, ngày 05/11/2026, Claude Opus 5.5 (phiên Claude Code). Mức review: **Nhỏ** (danh sách khối của trang mẫu, mục `THEM` của kiểm thử phạm vi, tài liệu, báo cáo; không có thành phần). Làm như `d7-chuan-bi.md`: kiểm kê trang của đợt, chốt tên và cách làm cho các lô. Chủ repo giao agent làm theo đề xuất, không hỏi lại (05/11/2026: "bạn cứ làm với đề xuất của bạn đi ko cần hỏi tôi, sau này tôi sẽ review lại sau"); chỗ agent tự chọn ghi ở mục "Đã chọn", chủ repo review sau.

## Đã làm

- **Trang mẫu** (`tools/trang-mau.mjs`): thêm bốn loại khối vào `KHOI`: nghe mù (`oz-nghe-mu`), phiếu nghe mù (`oz-phieu-nghe-mu`), ngày rà lại ở đầu trang tham chiếu (`oz-ra-lai`), dòng "ngoài lộ trình" ở đầu trang Đọc thêm (`oz-ngoai-lo-trinh`). Chưa trang nào có các lớp này.
- **Kiểm thử phạm vi**: `THEM['D8-L1']`: hai workflow hằng tuần (`.github/workflows/ra-lai.yml`, `kiem-link.yml`), script của chúng (`tools/ra-lai.mjs`, `tools/kiem-link.mjs`), `src/kiem-dinh.mjs` (ngày kiểm của hồ sơ). `src/components/` đã nằm trong phạm vi chung.
- **Kế hoạch**: bảng Tiến độ ghi đợt 8 đang làm; câu hỏi cỡ mẫu lượt 2 của trang Đọc thêm ghi lựa chọn.

## Trang của đợt

Đếm trên `../opus-zero/docs/` (dòng; link ra ngoài; khối đặc biệt) và số trang đã chuyển đang trỏ tới (hiện "sắp có" tới khi trang lên):

| Lô | Trang | Dòng | Link ngoài | Khối | Trang trỏ tới |
|---|---|---|---|---|---|
| D8-L1 | `bat-dau/hoi-dap` | 83 | 3 | | 3 |
| | `bat-dau/ung-dung` | 30 | 0 | | 1 |
| | `lich-su/duong-dai` | 48 | 6 | dòng "Cập nhật lần cuối" | 5 |
| | `lich-su/viet-nam` | 85 | 11 | dòng "Cập nhật lần cuối" | 4 |
| | `nhan-dien/nghe-mu` | 47 | 10 | `oz-blind`, `oz-blind-log` | 6 |
| | `piano/chon-dan` | 138 | 1 | 1 câu hỏi | 7 |
| | `piano/nghe-si` | 210 | 6 | 1 câu hỏi | 7 |
| | `piano/tac-pham-theo-cap` | 390 | 57 | bảng theo chặng | 12 |
| | `piano/thay-va-thi` | 201 | 7 | 1 câu hỏi | 11 |
| | `tai-nguyen` | 68 | 21 | dòng "Kiểm tra lần cuối" | 1 |
| D8-L2 | `nhac-cu/cello`, `clarinet`, `guitar`, `sao`, `trumpet`, `violin` | 27–47 | 1 mỗi trang | | |
| | `nhac-cu/nhac-cu-khac` | 56 | 2 | hình `ranges-voices` | |
| | `nhac-cu/index` | 40 | 0 | | 0 (lối vào nhóm Đọc thêm ở menu và trang chủ) |
| D8-L3 | `lich-su/nhac-truyen-thong-viet-nam` | 124 | 6 | 1 khuông nhạc | 6 |
| | `lich-su/nu-nha-soan-nhac` | 73 | 3 | | 2 |

- **Grade** đã khóa ở D2-0 (`truong` của mọi bản ghi `tac-pham` có `grade`), nên `piano/tac-pham-theo-cap` không phải khóa thêm trường cho Grade. Bảng theo chặng của trang ấy là chữ viết tay (tác phẩm ngoài 73 bản ghi chiếm phần lớn); bài có bản ghi thì tên, chặng, Grade phải khớp dữ liệu: lô thêm phép kiểm như `tests/dong-thoi-gian.test.mjs` (năm sinh–mất viết tay khớp dữ liệu), không dựng bảng từ dữ liệu.
- **Chương trình ABRSM**: trang cũ đã viết theo cả hai chương trình (2025–2026 còn hiệu lực đến 31/12/2027; 2027–2028 dùng được từ 1/1/2027). Lô kiểm theo đề cương đăng trên abrsm.org lúc làm (abrsm.org chặn robot: theo "Nguồn và cách mở" của chuẩn kiểm định, đọc PDF đề cương qua bản lưu hay nguồn bậc 2).
- **Nghe mù**: 10 bản thu Wikimedia Commons nằm trong `recognition.js` cũ (khoảng 30 dòng có `commons`/`upload.wikimedia.org`). Công cụ mới đưa danh sách vào module (`src/scripts/nghe-mu.js`), và workflow kiểm link đọc cả file ấy.
- **`bat-dau/ung-dung`**: rà lại theo service worker của D7-L3 (`d7-chuan-bi.md`, "Việc cho nhánh sau"): site mới cài được như ứng dụng, dùng khi mất mạng với trang đã xem.
- **`bat-dau/hoi-dap`**: câu "Safari và iPhone chưa hỗ trợ MIDI" là câu dễ cũ đi (`d7-chuan-bi.md`): viết chung như ô MIDI đã làm (công cụ tự báo khi trình duyệt không có Web MIDI), hay ghi tháng kiểm. Link tới issue của repo cũ giữ như AGENTS.md ghi.

## Đã chọn

1. **Cỡ mẫu lượt 2 của trang Đọc thêm** (câu hỏi "trước đợt 8" ở mục Quyết định): **giữ 5 nhận định mỗi trang**, như chuẩn kiểm định mục 3 và `khoa.mjs xuat` đang làm. Đợt này chỉ có 9 trang Đọc thêm, ngắn (27–124 dòng): lấy mẫu theo lô (khoảng 5 câu cho cả lô) thì có trang không câu nào được kiểm lại; theo tỉ lệ thì trang ngắn gần như không có mẫu. Mẫu có câu sai thì kiểm hết các câu còn lại của trang (`xuat --con-lai`), như lời khuyên tập.
2. **Ngày kiểm và ngày rà lại hiện tự động** ở đầu trang tham chiếu có hạn (`src/components/PageTitle.astro`, lớp `oz-ra-lai`): "Kiểm tra lần cuối: tháng 11/2026 · rà lại tháng 4/2027", tháng kiểm lấy từ lần cuối trong `lan` của hồ sơ (`src/kiem-dinh.mjs`), tháng rà lại từ `ra_lai` của `trang.yml`. Thay ba dòng viết tay "Cập nhật lần cuối: 10/2026", "Kiểm tra lần cuối: 10/2026" của trang cũ (ghi `doi_chu`): viết tay thì dễ quên sửa khi rà lại, và khóa trang thì phải mở khóa chỉ để đổi ngày. Ở bản xem (trang chưa khóa) dòng ghi "chưa kiểm định" thay tháng kiểm.
3. **Dòng "ngoài lộ trình"** ở đầu trang Đọc thêm (kế hoạch, đợt 8) cũng hiện tự động theo tầng `ngoai-vi` (lớp `oz-ngoai-lo-trinh`, dưới tiêu đề): "Đọc thêm, ngoài lộ trình: không cần cho các chặng." cùng link tới lộ trình. D8-L2 làm (lô đầu tiên có trang ngoại vi); `nhac-cu/index` (tầng khung) không có.
4. **Ngày rà lại** (`ra_lai`): giữ các tháng đã chọn ở bảng tầng (lý do riêng cho từng trang trong `ly_do_ra_lai`, như giải Pulitzer công bố tháng 5). D8-L1 kiểm mỗi `ra_lai` nằm sau tháng khóa và không quá 12 tháng sau đó; khóa muộn (chủ repo khóa khi review) thì người khóa đặt lại theo luật của kế hoạch ("khóa sau tháng 1/2027 thì trang theo chương trình ABRSM rà lại tháng 1/2028"). Lô thêm phép kiểm vào `tests/du-lieu.test.mjs`: trang đã khóa có `ra_lai` sau tháng kiểm của hồ sơ.
5. **Workflow hằng tuần**, như `../opus-zero/.github/workflows/link-check.yml` (thứ Hai 02:00 UTC, bấm chạy tay được; mỗi loại một issue: mở, cập nhật issue đang mở, tự đóng khi hết lỗi):
   - `ra-lai.yml`: `node tools/ra-lai.mjs` liệt kê trang có `ra_lai` đã qua (tháng hiện tại trở về trước), mở issue "Trang cần rà lại" nhãn `ra-lai`. Không chặn deploy.
   - `kiem-link.yml`: lychee trên `src/content/docs/**/*.md`, `src/data/*.yml` (gồm link bản thu trong `ban_thu`) và module có link ngoài (nghe mù), giữ các luật cũ: chấp nhận 403, 429; bỏ `abrsm.org` (chặn robot) và trang chủ Oxford Music Online. Issue "Báo cáo link hỏng" nhãn `link-hong`. Phần đối chiếu bản thu với Commons (`check_audio.py`) để D6-0, khi `tools/audio/` sang repo này.
   - Repo đang riêng tư: workflow chạy và mở issue được bình thường; GitHub tắt lịch chạy sau 60 ngày repo không có hoạt động, nên ghi ở AGENTS.md.
   - Mức review: **Vừa** (workflow không đăng gì, chỉ đọc repo và mở issue), quyền `contents: read`, `issues: write`.

## Rủi ro

- **Lighthouse**: `bat-dau/tom-tat` sát ngưỡng 95 vì menu lớn theo số trang đã khóa (HTML nén vượt cửa sổ TCP đầu; `d7-gom.md`). Đợt 8 thêm 20 trang vào menu: lô đo lại ba trang mẫu; tụt dưới ngưỡng thì làm menu nhẹ hơn (việc riêng, mức Vừa) trước khi khóa.
- **Thông tin mau cũ** là phần chính của D8-L1 (giá, ứng dụng, cuộc thi, lịch diễn): lượt 1 ghi ngày truy cập nguồn; câu không còn nguồn thì viết lại cho bền hay bỏ, ghi `doi_chu`.
- **Đăng site**: job Đăng ở `main` đang hỏng vì GitHub chưa nhận gói của tài khoản cho Pages riêng tư (05/11/2026, chủ repo đang xử lý). Không ảnh hưởng việc làm lô. Agent làm đợt 8 như đợt 7: chạy đủ các bước của CI ở máy trước mỗi lần gộp vào `main`, push khi xong đợt hay khi chủ repo bảo.

## Kiểm thử

- `npm run build:xem`: không cảnh báo `[opus]`.
- `npm test`: 239 phép thử, 238 đạt, 1 bỏ qua, 0 hỏng.
- Kiểm thử trình duyệt và Lighthouse: không đổi gì chạy trên trình duyệt (chưa trang nào có lớp mới), không chạy.
