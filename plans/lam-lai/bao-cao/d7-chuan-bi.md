# D7, nhánh chuẩn bị (trước D7-L1)

Nhánh `moi/d7-chuan-bi`, ngày 05/11/2026, Claude Opus 5.5 (phiên Claude Code). Mức review: **Nhỏ** (danh sách khối của trang mẫu, tài liệu, báo cáo; không có thành phần). Làm như `d3-chuan-bi.md`: gom việc còn để lại ở các báo cáo trước, kiểm kê công cụ cũ của D7-L1, chốt tên và cách viết cho lô.

## Đã làm

- **Trang mẫu** (`tools/trang-mau.mjs`): thêm chín loại khối của D7-L1 vào `KHOI`, theo lớp ngoài cùng đã chốt ở bảng dưới. Chưa trang nào có các lớp này nên chưa có trang mẫu mới; khi lô dựng thành phần thì trang của nó tự vào danh sách mẫu.
- **`AGENTS.md`**: mục "D7-L1" trong "Mẫu trang và khối đặc biệt": tên công cụ, lớp, hai module chung (`midi.js`, `micro.js`), định dạng sao lưu, cách giả MIDI và micro trong kiểm thử trình duyệt.
- **CI**: `.github/actions/kiem-thu/action.yml` xuống dòng phần mô tả quá dài.
- **Kế hoạch**: bảng Tiến độ ghi đợt 7 đang làm.

## Công cụ của D7-L1

Công cụ cũ (`../opus-zero/docs/assets/js/`) là IIFE gắn `window.OZ*`, nạp theo `loader.js`; không công cụ nào đọc `data-*` từ trang (mọi lựa chọn là ô `<select data-k>` dựng bên trong), nên công cụ mới không nhận thông số.

| Công cụ (`::cong-cu{ten}`) | Lớp mới | File cũ (dòng) | API trình duyệt | Lưu | Trang cũ dùng | Site mới có gì |
|---|---|---|---|---|---|---|
| `midi-status` | `oz-midi` | `midi.js` (61) | Web MIDI | `opus-zero:midi-auto` | `ban-phim`, `doc-not`, `ket-noi-midi`; D7-L2: `thi-tau`, `xay-hop-am` | Chưa có; là nguồn nốt cho bốn công cụ dưới |
| `piano-explorer` | `oz-tra-phim` | `piano.js` (phần cuối, khoảng 60) | AudioContext | | `ban-phim` | Dùng lại `ganBanPhim`, `veBanPhim`, `nhac-ly.js` (gam, hợp âm) |
| `dictation` | `oz-chep` | `dictation.js` (65) | AudioContext, MIDI | kỹ năng ở `opus-zero:v1` | `chep-giai-dieu` | Dùng lại `ganBanPhim`, `choiNot`, `tien-do.js` |
| `note-reader` | `oz-doc-not` | `note-reader.js` (222) | abcjs, MIDI | thống kê nốt yếu ở `opus-zero:v1` | `doc-not`, trang chủ cũ | Dùng lại `abc.js` (`taiAbcjs`), `am-thanh.js`, `tien-do.js` |
| `playalong` | `oz-choi-theo` | `playalong.js` (khoảng 130), `assess.js` (62), `mic.js` (42) | micro, MIDI, abcjs | kỹ năng | `choi-theo` | Dùng lại `abc.js`, `tanSoCoBan` của `am-hoc.js`; chấm điểm (`assess.js`) chuyển mới |
| `singback` | `oz-hat-lai` | `playalong.js` (khoảng 75) | micro | kỹ năng | `hat-lai` | Như trên |
| `tuner` | `oz-so-cao-do` | `tuner.js` (118) | micro, AnalyserNode | | `hat-lai` | Micro và tìm cao độ có ở `am-hoc.js` (công cụ `spectrum`); còn thiếu kim lệch cent và dây đàn mẫu |
| `data` | `oz-sao-luu` | `data.js` (233) | tải file, chọn file, IndexedDB | đọc và gộp `opus-zero:v1`, `opus-zero:sound`, `opus-zero:midi-auto` | `du-lieu` | `tien-do.js` đã dùng cùng khóa; phần xuất, nhập, gộp chưa có |
| `sound-setting` | `oz-chon-am` | `audio.js` (125–147) | | `opus-zero:sound` (`piano`, `synth`) | `luyen-tap/index` | Phần lưu có ở `am-thanh.js` (`cheDo`, `datCheDo`, `trangThai`, cùng giá trị); còn thiếu ô chọn |
| `circle`, `keysig-quiz` | | `circle.js` | | | `hoa-bieu` (và bài 8) | Đã có |
| `plan` | | `plan.js` | | | `luyen-tap/index` | Đã có (`ke-hoach.js`) |

Chín trang đều có trong `src/data/trang.yml`, tầng khung, chưa trang nào chuyển. Chưa trang đã chuyển nào có ô "chưa chuyển" của các công cụ này. Trang `ket-noi-midi` có link tới `thi-tau`, `xay-hop-am` (D7-L2): hiện "sắp có" tới lô sau.

## Rủi ro cho lô

- **MIDI**: chỉ Chrome, Edge, Opera trên máy tính, cần trang HTTPS. Kiểm thử trình duyệt chưa có cách giả; chuyển cách của `../opus-zero/tests/browser.mjs` (giả `navigator.requestMIDIAccess`, phát nốt qua móc kiểm thử). Câu "Safari và iPhone chưa hỗ trợ MIDI" (trang `ket-noi-midi`, và `bat-dau/hoi-dap` chưa chuyển) là câu dễ cũ đi: công cụ tự báo khi không có Web MIDI; ở trang, viết chung hay ghi tháng kiểm (`d2-bang-tang.md`).
- **Micro**: `am-thanh.js:89` đặt `audioSession` là `playback` mỗi lần phát, `am-hoc.js:246` đặt `play-and-record` khi mở micro. Trang `hat-lai` có hai công cụ micro (hát lại vừa phát vừa nghe, so cao độ): gom vào `micro.js` để chế độ không bị lật giữa chừng, chỉ một công cụ nghe một lúc (`activeStop` của `tuner.js` cũ), đóng luồng khi `pagehide`. Giữ tắt `echoCancellation`, `noiseSuppression`, `autoGainControl` như `am-hoc.js`; kiểm tiếng mẫu không lọt vào micro làm sai cao độ. Kiểm thử: Chromium có `--use-fake-device-for-media-stream`, nhưng nên giả `getUserMedia` bằng OscillatorNode để biết trước cao độ, chạy được cả WebKit và Firefox.
- **Sao lưu**: "Xong khi" của đợt 7 đòi bản sao lưu xuất từ site cũ khôi phục được. Lô build `../opus-zero/`, xuất một bản thật làm mẫu cho kiểm thử; giữ dạng cũ `{days, store}`; nhập hai lần không nhân đôi số liệu.
- **Lighthouse ở trang nhiều khuông** (`d3-chuan-bi.md`, còn mở): abcjs đã tải sẵn lúc rảnh nhưng việc vẽ chưa chia nhỏ; `bat-dau/tom-tat` dao động 94–98 ở CI (ngưỡng 95). `chep-giai-dieu`, `choi-theo`, `doc-not` dùng abcjs: lô đo Lighthouse ở ba trang này (`LH_TRANG`).

## Cần chủ repo quyết

1. **Cách làm đợt 7**: như đợt 3–5 (lượt 1 từng lô, rồi nhánh gom: lượt 2, review, kiểm mẫu, khóa), hay khóa từng lô? Trang Luyện tập đều tầng khung, nhận định chủ yếu là câu về chính site (không qua lượt 2), nên gom ít lợi hơn các đợt trước.
2. **Đọc nốt ở trang chủ**: trang chủ cũ có công cụ đọc nốt ("Thử ngay: đọc một nốt"); trang chủ mới (đã khóa) không có. Thêm thì phải mở khóa `index` sau khi `note-reader` lên; không thêm thì giữ như hiện nay.
3. **Nút "Tôi đang tập bài này"** ở hộp tác phẩm (`practice.js` cũ; `d1.md` để chủ repo chọn D6 hay D7-L1): D4-L1 đã làm ô bài đang tập và ghi nút là việc của đợt 6. Đề nghị chốt đợt 6.

## Việc cho nhánh sau

- **D7-L2, D7-L3 và phần còn lại của đợt 7** cần mục trong `THEM` của `tests/pham-vi.test.mjs` khi biết file: service worker và manifest (`d1-1.md`), sách in sinh từ dữ liệu (thay `books.py`; 7 link `../../sach/*.html` của `bat-dau/sach-in`, `d1-4.md`), nhật ký trang Cập nhật. Thêm ở nhánh chuẩn bị của lô ấy.
- **Mất mạng**: abcjs lấy soundfont từ `paulrosen.github.io` (`d1-3.md`, `d5-l3.md`): service worker phải lưu hay site tự có soundfont, không thì khuông không có tiếng khi mất mạng.
- **D7-L3**: `cap-nhat` link tới `/opus/audio/NGUON.txt` và câu "bản thu lưu trên site" (đúng sau D6-0); blog chốt đường dẫn mới, 3 bài chưa có mô tả (`d1-4.md`); `bat-dau/ung-dung` rà lại sau khi có service worker (`d2-bang-tang.md`).
- Không liên quan đợt 7, vẫn còn mở: "Dân ca Pháp" ở hai chỗ của `piano/10-bai-dau-tien` (`d4-gom.md`); nhãn biến tấu 11, 12 của K. 265 ở `piano/hoa-am/ung-tac` (`d5-gom.md`, tùy chọn); hai câu hỏi về lượt 2 trang Đọc thêm (trước đợt 8) và trang Tác phẩm (trước D6-0) ở mục Quyết định của kế hoạch.

## Kiểm thử

- `npm run build:xem`: không cảnh báo `[opus]`.
- `npm test`: 190 phép thử, 188 đạt, 2 bỏ qua (kiểm thử phạm vi: nhánh này không phải nhánh lô; so chữ với site cũ khi thiếu `.cache/site-cu/`), 0 hỏng.
- `trangMau('dist')`: 24 trang mẫu như trước (chưa trang nào có lớp mới).
- Kiểm thử trình duyệt và Lighthouse: ở `test.yml` khi push nhánh.
