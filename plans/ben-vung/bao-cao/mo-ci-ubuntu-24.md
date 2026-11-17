# Mở khóa mo/ci-ubuntu-24: ghim máy CI ở Ubuntu 24.04

Nhánh `mo/ci-ubuntu-24` từ `main` (`9512e93`), Claude Opus 5.5, 17/11/2026.

## Lỗi

Lần deploy `44107926414` (push lên `main`, 17/11/2026) hỏng, site giữ bản trước.

- Nhãn `ubuntu-latest` của GitHub đã sang Ubuntu 26.04 (máy chạy ghi "Image: ubuntu-26.04", ảnh `ubuntu26/20261111`; GitHub báo trước từ 19/10/2026, `actions/runner-images#14748`).
- WebKit trên máy (`webkit-2370`, MiniBrowser WPE) là bản dựng cho Ubuntu 24.04, cần `libicudata.so.74` (ICU 74). Ubuntu 26.04 không có thư viện này, nên WebKit không mở được: "error while loading shared libraries: libicudata.so.74", 70 phép thử hỏng. Bản ấy đến từ đệm: xem mục Review.
- Job Firefox bị hủy do `fail-fast: true` của ma trận `ba-trinh-duyet`, không phải do lỗi của Firefox.
- Job `kiem` (build, `npm test`, Chromium) đạt.

## Đã sửa

- Mọi `runs-on: ubuntu-latest` trong `.github/workflows/` thành `ubuntu-24.04`: `deploy.yml` (3 job), `test.yml` (2), `ra-lai.yml` (1), `kiem-link.yml` (2). Lần đầu ở mỗi file có chú thích lý do và khi nào bỏ ghim. `ra-lai.yml`, `kiem-link.yml` không dùng trình duyệt, ghim cho mọi workflow cùng một máy.
- `AGENTS.md`, mục "CI và đăng site": một dòng về chỗ ghim.

Không đổi:

- `.github/actions/kiem-thu/action.yml`: không nhắc nhãn máy. Khóa lưu đệm trình duyệt dùng `runner.os` (`Linux` ở cả hai bản Ubuntu). Bản WebKit trên máy 26.04 cần ICU 74, tức là bản dựng cho Ubuntu 24.04, nên đệm lưu ở máy 26.04 (nếu có) dùng lại được ở 24.04. Chưa kiểm trên máy CI: lần push tới hỏng ở bước mở trình duyệt thì xóa đệm `playwright-Linux-1.64.1-*` ở tab Actions → Caches.
- `tools/chon-phan-ci.mjs` và kiểm thử: không đọc nhãn máy. Không kiểm thử nào đọc `runs-on`.
- `fail-fast: true` của `ba-trinh-duyet` (`deploy.yml`): job nào hỏng thì không đăng, nên hủy job còn lại cho đỡ phút là hợp lý. Mặt trái là không thấy lỗi của trình duyệt kia trong cùng lần chạy; khi cần xem đủ thì bấm chạy `test.yml` (ma trận `fail-fast: false`).

## Kiểm

- `npm run build` (248 trang), `npm test` trong worktree: 355 phép thử, 352 đạt, 0 hỏng, 3 bỏ qua.
- Workflow không chạy được ở máy. Lần kiểm thật là lần push tiếp theo lên `main` (`deploy.yml`, cần có đổi mã để chạy job `ba-trinh-duyet`; nhánh này đổi workflow nên tính là có mã), hay bấm chạy tay `test.yml` trên nhánh này với `du`.

## Còn mở

- Bỏ ghim: một nhánh đổi `runs-on` về `ubuntu-latest` trong `test.yml`, chạy tay với `du`; đạt thì bỏ ghim ở mọi workflow (xem mục Review).
- GitHub giữ ảnh `ubuntu-24.04` thêm một thời gian rồi mới bỏ; chưa có ngày cụ thể.

## Review

Claude Opus 5.5, 17/11/2026, commit sau `7cd81f8`.

- Chẩn đoán ban đầu chưa đúng. Playwright 1.64.1 hỗ trợ chính thức Ubuntu 26.04 (`hostPlatform` `ubuntu26.04-x64`, `isOfficiallySupportedPlatform`, `node_modules/playwright-core/lib/coreBundle.js`) và có bản WebKit riêng `webkit-ubuntu-26.04.zip`. Nhật ký job webkit của lần `44107926414`: "Cache hit for: playwright-Linux-1.64.1-webkit", bước "Cài webkit" bị bỏ qua. Đệm này lưu từ máy 24.04 (khóa chỉ có `runner.os`, là `Linux` ở cả hai), nên máy 26.04 chạy bản WebKit của 24.04. Chromium (Chrome for Testing) và Firefox dùng cùng một bản cho 24.04 và 26.04, nên chỉ WebKit hỏng.
- Đã sửa: khóa đệm trình duyệt có thêm bản Ubuntu lấy từ `/etc/os-release` (`playwright-Linux-ubuntu24.04-1.64.1-webkit`), ở `.github/actions/kiem-thu/action.yml` và job `kiem` của `deploy.yml`. Lần chạy đầu sau khi gộp không trúng đệm, tải lại trình duyệt (khoảng 2 phút mỗi job).
- Giữ ghim `ubuntu-24.04`: ảnh 26.04 chưa thử với các bước apt, Lighthouse. Chú thích trong workflow, dòng ở `AGENTS.md` và mục "Còn mở" sửa theo: bỏ ghim sau khi `test.yml` chạy `du` đạt trên `ubuntu-latest`, không phải đợi nâng Playwright.
- Mục "Không đổi" về đệm phía trên đã cũ: không cần xóa đệm `playwright-Linux-1.64.1-*` bằng tay, khóa mới không trùng khóa cũ.
- Kiểm: YAML của bốn workflow và `action.yml` đọc được bằng gói `yaml`; mọi job có `runs-on: ubuntu-24.04`; `actions/deploy-pages`, `upload-pages-artifact`, `setup-python` 3.12 có trên 24.04.
