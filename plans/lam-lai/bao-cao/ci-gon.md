# CI gọn: chọn phần kiểm thử theo file đổi

Nhánh `moi/ci-gon` (từ `main` ở `4bb09b4`), ngày 06/11/2026, Claude Opus 5.5 (agent con, theo đề xuất chủ repo đã đồng ý). Không push. Mức review: **Lớn** (workflow deploy).

## Đổi gì

1. **`test.yml` chọn phần theo file đổi.** Job đầu `chon` (vài giây) chạy `node tools/chon-phan-ci.mjs --nen origin/<nhánh đích>`: `git diff --name-only origin/main...HEAD` (pull request: nhánh đích của PR), rồi ghi `cac-phan` (matrix) và `chi-trang-doi` cho job `kiem-thu`.
   - Mọi file đổi thuộc nhóm nội dung (`src/content/docs/`, `src/data/`, `kiem-dinh/`, `plans/`, `public/audio/`, file `.md` và `LICENSE*` ở gốc repo): `npm-test`, `chromium`, `lighthouse`; job đặt `OPUS_CHI_TRANG_DOI=1`, nên trang mẫu chỉ còn trang chủ, 404 và trang nhánh đã đổi (tối đa 8). Lighthouse vẫn đo trang chủ và hai trang đầu (tức trang đã đổi; không có thì 404).
   - Có file khác (kể cả `src/components/hinh/*.html`, `public/` ngoài `audio/`, `.nvmrc`, `requirements.txt`), danh sách rỗng hay git hỏng: đủ như trước (`npm-test`, ba trình duyệt trên mọi trang mẫu, `lighthouse`).
   - `workflow_dispatch` có hai ô: `du` (chạy đủ) và `anh-chup`.
   - Kiểm thử Node: `tests/chon-phan-ci.test.mjs` (phân loại file nội dung và mã, danh sách, các phần, `fileDoi` trên repo git tạm, `trangMau` có và không có `OPUS_CHI_TRANG_DOI`).
2. **`test.yml` bỏ qua push** chỉ đổi `plans/**`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `LICENSE*` (`paths-ignore`). Pull request không lọc.
3. **Ảnh chụp** chỉ chạy khi bấm chạy tay và chọn `anh-chup`. Ở nhánh nội dung, ảnh chỉ chụp trang chủ, 404 và trang đã đổi.
4. **Cài thư viện hệ thống của Playwright** (`action.yml`): một bước riêng cho mọi phần có trình duyệt (trước đây bước `install --with-deps` khi lưu đệm trượt, `install-deps` khi trúng). Mỗi lần thử `timeout 240` (4 phút; `timeout` dừng cả nhóm tiến trình, kể cả `sudo apt-get`), hỏng thì `dpkg --configure -a` rồi thử lại một lần; tổng khoảng 8 phút. Bước của action dạng composite không nhận `timeout-minutes`, nên giới hạn bằng lệnh `timeout`.
5. **`deploy.yml`** vẫn build bản thật, `npm test`, Chromium (đủ trang mẫu: trên `main` không có trang "đã đổi", `OPUS_CHI_TRANG_DOI` không đặt) và Lighthouse. Bước "Đã kiểm ở nhánh?" (chuyển xuống sau `npm test`, để dùng Node của `.nvmrc`; checkout `fetch-depth: 0`):
   - không có lần chạy `test.yml` đạt ở commit này (do push hay bấm chạy tay; pull request không tính): đủ bốn phần, như trước;
   - có lần chạy đạt mà job webkit và firefox đều đạt (chạy đủ): chỉ chromium, Lighthouse, như trước;
   - chỉ có lần chạy rút gọn: tự phân loại file đổi so với `github.event.before` (`chon-phan-ci.mjs --kieu`); chỉ nội dung thì chromium, Lighthouse, có mã (hay bấm chạy tay, không có commit trước) thì đủ.
6. **`dauVet`** (`src/du-lieu.mjs`) thêm `JSON.stringify([...banGhiCuaTrang()])`: đổi `tac_pham` ở frontmatter một trang thì build tiếp ở máy dựng lại hai trang mục lục (việc ghi ở `d6-l11.md`, "Kiểm lại review mã").
7. **`AGENTS.md`** mục "CI và đăng site" và đoạn trang mẫu: hành vi mới.

Không bỏ phép kiểm nào: ở nhánh nội dung, các phép thử trình duyệt cần trang có khối (khuông, câu hỏi…) tự bỏ qua vì trang mẫu không còn trang ấy; phép thử không dựa vào trang mẫu (tìm kiếm, dùng khi mất mạng…) vẫn chạy.

## Đã kiểm

- `npm run build:xem`, `npm test`: 300 phép thử, 298 đạt, 2 bỏ qua (như `main`), 0 hỏng.
- `OPUS_CHI_TRANG_DOI=1 OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet` ở máy (nhánh này không đổi trang: chỉ trang chủ và 404): 148 phép thử, 138 đạt, 10 bỏ qua (phép thử cần trang có khối), 0 hỏng, khoảng 2 phút.
- Cú pháp workflow: `npx @action-validator/cli` cho `test.yml`, `deploy.yml`, `action.yml`: đạt (validator bắt được file sai thử). Không có `actionlint` ở máy. Lệnh `run` tách ra kiểm `bash -n`; hai biểu thức jq của deploy thử trên JSON mẫu.
- Phân loại trên 12 commit gần nhất của `main`: các commit lượt 2, kiểm mẫu, báo cáo ra `noi-dung`; commit mã và commit chuyển trang có hình `bolero.html` ra `ma`.
- `dauVet` đổi khi đổi `tac_pham` của `nghe-nhac/ravel-bolero`, trở lại như cũ khi trả lại (trang đã khôi phục).

## Thời gian ước tính (mỗi push)

| Nhánh | Trước: thời gian chờ / phút máy | Sau: thời gian chờ / phút máy |
|---|---|---|
| Chỉ nội dung (lượt 2, kiểm mẫu, `mo/**`, `them/**` chỉ Markdown/YAML) | 8–11 phút / ~30 (6 job) | ~3–5 phút / ~6–8 (chon, npm-test, chromium trên 2–10 trang, lighthouse) |
| Chỉ `plans/`, sổ tay | 8–11 / ~30 | không chạy |
| Có mã | 8–11 / ~30, firefox có lúc bị hủy vì apt | 8–11 / ~28 (không ảnh chụp); apt chậm thì tối đa ~8 phút rồi hỏng rõ ràng thay vì treo |
| Deploy sau nhánh nội dung | build + chromium + lighthouse | như trước |
| Deploy sau nhánh có mã nhưng lần chạy cuối của nhánh rút gọn | — | build + bốn phần (thêm webkit, firefox) |

## Rủi ro, chỗ cần review kỹ

- **Phân loại theo cả nhánh** (`origin/main...HEAD`), không theo push: nhánh lô có commit mã thì mọi push sau vẫn chạy đủ. Lợi ích chính ở nhánh chỉ nội dung (`mo/**`, gom lượt 2, kiểm mẫu, `them/**` sau khi có trang khung). Muốn gọn hơn nữa (so với lần chạy đạt trước của nhánh) thì làm sau.
- **Nhóm nội dung gồm `src/data/`**: dữ liệu đổi thì chữ ở nhiều trang đổi (chip, trang chặng, danh mục), nhưng chromium chỉ xem trang có file `.md` đổi. Lỗi dựng do dữ liệu vẫn làm build hỏng và `npm test` bắt; lỗi hiển thị do dữ liệu (chữ dài làm tràn) ở trang không đổi thì không bị bắt ở nhánh, chỉ ở deploy (chromium đủ trang mẫu).
- **Deploy dựa vào tên job** (`test("webkit|firefox")`) để biết lần chạy đủ: đổi tên job `kiem-thu` thì phải sửa biểu thức. Gọi API lỗi thì coi như chưa kiểm, chạy đủ (an toàn).
- **`paths-ignore` xét các commit của lần push**, không cả nhánh: push cuối chỉ đổi `plans/` thì commit ấy không có lần chạy `test.yml`, deploy chạy đủ bốn phần (an toàn, chỉ chậm).
- **Thử lại apt**: lần đầu bị dừng giữa chừng có thể để gói cài dở; `dpkg --configure -a` (giới hạn 60 giây) trước lần hai. Chưa thử trên máy GitHub.
- Chưa chạy được trên GitHub Actions (không push): cần xem lần chạy đầu của `test.yml` ở nhánh này (đổi mã: phải chạy đủ, không có `anh-chup`) và một lần bấm chạy tay có `anh-chup`.
