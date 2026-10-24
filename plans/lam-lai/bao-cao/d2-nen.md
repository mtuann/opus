# D2-nền: chuẩn bị kỹ thuật cho đợt 2

Claude Code (Claude Opus 5.5), ngày 24/10/2026, nhánh `moi/d2-nen` từ `main` (`9498fb2`). Việc chuẩn bị mà review cuối đợt 1 khuyên làm trước lô D2-L1 (`d1.md`, mục "Nên sửa" 1–4 và 6, cùng các dòng "Việc còn mở" giao cho D2-L1), cộng lệnh `nhap` mà D2-0 cần cho lượt 2. Mức review: **lớn** (chạm công cụ khóa và phần kiểm khóa lúc build), nên chạy đủ kiểm thử và nhờ Sonnet review, có vòng kiểm lại.

## Việc đã làm

| Việc | File | Kiểm thử |
|---|---|---|
| Danh sách việc `- [ ]`: ô đánh dấu đặt trong nhãn 44 px, tên đọc được là chữ của việc (`aria-labelledby`), không còn bị khóa. Ô đã đánh dấu được nhớ trong trình duyệt, cùng khóa `opus-zero:v1` và định dạng với site cũ (kho `checks`: trang, rồi mã việc, rồi ngày), nên việc đã đánh dấu ở site cũ vẫn hiện. Mã việc không tính nhãn "sắp có", nên không đổi khi trang được link tới lên site | `src/plugins/danh-sach-viec.mjs`, `src/scripts/viec.js`, `src/scripts/tai.js`, `src/plugins/thanh-phan.mjs` (`canTaiScript`), `src/styles/thanh-phan.css`, `astro.config.mjs` | `tests/thanh-phan.test.mjs` (dựng HTML: mục gọn, mục thưa, danh sách con, `[x]`, mục thường); `tests/trinh-duyet/kiem-thanh-phan.mjs` (chạm góc nhãn thì đánh dấu, lưu đúng định dạng, tải lại vẫn còn, bỏ dấu thì kho sạch; ba trình duyệt) |
| Bảng nhiều cột ở 360 px: ô tiêu đề mỗi cột giữ độ rộng tối thiểu theo ô dài chữ nhất của cột (0,1125rem mỗi chữ, tối đa 18rem). Bảng rộng hơn khung thì cuộn ngang trong khung | `src/plugins/bang-hep.mjs`, `src/styles/thanh-phan.css`, `astro.config.mjs` | Đo bằng Playwright (bảng dưới); `kiem-hien-thi` (không tràn ngang) |
| Trang đã khóa chỉ hiện trường đã khóa: chỉ thị trong trang đã khóa đọc bản ghi qua `chiDaKhoa`. Đọc trường chưa khóa, kể cả trường bản ghi chưa có, thì build hỏng, lỗi ghi `du-lieu/<bộ>/<id>#<trường>` | `src/khoa.mjs` (`truongDaKhoa`), `src/du-lieu.mjs` (`chiDaKhoa`), `src/plugins/opus-markdown.mjs` | `tests/khoa.test.mjs`, `tests/thanh-phan.test.mjs` |
| Lệnh `nhap`: đưa kết quả lượt 2 vào hồ sơ (`luot_2`, `luot_2_nguon`, `luot_2_ghi_chu`). Kiểm hết trước khi ghi: một dòng sai thì không ghi gì. In nhận định cần review và số nhận định còn thiếu lượt 2 | `tools/khoa.mjs`, `plans/ben-vung/chuan-kiem-dinh.md` (mục 5, 8) | `tests/khoa.test.mjs` |
| Hai kiểm thử còn thiếu: trang tác phẩm phải khai đúng `tac_pham` (trang chính của bản ghi, và trang `cap` dùng chung bản ghi); mỗi trang đã dựng mang đúng nhãn nhóm | `tests/du-lieu.test.mjs`, `tests/giao-dien.test.mjs` | Cố ý làm sai (bỏ `tac_pham` ở Für Elise; đổi chữ nhãn nhóm) thì hai kiểm thử hỏng |
| Phép thử `#mục` lấy tiêu đề `h2` đến `h4`, không giả định trang có `h2` (`bat-dau/tom-tat` chỉ có `h3`) | `tests/trinh-duyet/kiem-thanh-phan.mjs` | Chạy lại |
| Chỉ mục tìm kiếm thiếu thì dựng lại (bảng dưới, mục "Lần đăng site hỏng") | `src/tim-kiem/tich-hop.mjs`, `package.json` (`pagefind` 1.5.2, đúng bản Starlight đang dùng) | `tests/tim-kiem.test.mjs`: chỉ mục của bản build đủ; `thieuChiMuc` bắt file rỗng, JSON hỏng, không có ngôn ngữ |
| Phép thử ô tìm kiếm ghi các file của Pagefind đã tải (mã, số byte) khi hỏng | `tests/trinh-duyet/kiem-tim-kiem.mjs` | Cho `pagefind-entry.json` rỗng: lỗi ra đúng như trên máy GitHub, kèm "200 0 B pagefind-entry.json" |
| Góp ý của review Haiku ở nhánh trước: `cuonHet` chỉ đổi lỗi khi chờ quá lâu (lỗi khác giữ nguyên), không che lỗi khi trang đã đóng; phép thử thanh trên báo khi không còn `.right-group` | `tests/trinh-duyet/chung.mjs`, `kiem-hien-thi.mjs` | |
| Chú thích "6–10 phút" của hai workflow: thực tế khoảng 4 phút | `.github/workflows/test.yml`, `deploy.yml` | |
| Sổ tay: khối "Danh sách việc", bảng hẹp, `chiDaKhoa`, kiểm chỉ mục tìm kiếm, lệnh `nhap` | `AGENTS.md` | |

## Bảng ở 360 px (Für Elise, bản xem)

| Bảng | Trước | Sau | Rộng (cuộn ngang trong khung 328 px) |
|---|---|---|---|
| 4 cột | 2947 px | 1127 px | 551 px |
| 3 cột | 2578 px | 1626 px | 459 px |
| 2 cột | 1083 px | 1027 px | vừa khung |

Site cũ: bảng 4 cột cao 1677 px. Trang không tràn ngang ở cả ba cỡ màn hình. Hộp "Thông tin tác phẩm" là HTML dựng sẵn từ dữ liệu, không qua plugin, nên giữ nguyên như D1.3 đã chỉnh.

## Lần đăng site hỏng (`9498fb2`) và chỗ sửa

Lần đăng site của `9498fb2` (gộp việc bỏ link GitHub) hỏng ở phép thử ô tìm kiếm trên bản thật, cả ba trình duyệt: "Failed to load Pagefind metadata: Unexpected end of JSON input". Chạy lại thì đạt, site đã lên.

Thử trên máy: cho `pagefind-entry.json` rỗng thì ra đúng lỗi ấy. Starlight gọi `pagefind.close()` ngay khi Pagefind báo đã ghi xong (`@astrojs/starlight/dist/integrations/pagefind.js`), mà `close()` dừng tiến trình ghi của Pagefind (`pagefind/lib/service.js`). Nên có lần file ghi dở nằm lại rỗng; bản đăng như vậy thì ô tìm kiếm trên site thật hỏng. Phép thử đã chặn lần này. Giờ build tự kiểm và dựng lại chỉ mục: thử trên một bản chép có `pagefind-entry.json` rỗng thì build dựng lại một lần, chỉ mục đủ, `pagefind.js` vẫn là bản bọc.

## Đã thử thành phần với trang thật

Danh sách việc đã thử với `bat-dau/lo-trinh-choi` chuyển tạm (34 ô). Trang này thuộc D2-L1 nên đã xóa trước khi commit.

| Phép thử trên trang chuyển tạm | Kết quả |
|---|---|
| `kiem-hien-thi`: ba trình duyệt × ba cỡ màn hình | Đạt; vùng bấm 44 px ở 360 và 768 px |
| `kiem-tro-nang` (axe) | Đạt; không còn lỗi `label` |
| `kiem-thanh-phan` | Đạt; phép thử mới chạy trên ba trình duyệt |
| Tổng | 98/98 |

Ảnh chụp ở 360 px (sáng) và 1280 px (tối): ô thẳng hàng với dòng chữ đầu, việc đã làm có gạch ngang. Không đổi màu chữ, vì màu nhạt thì dưới 4,5:1.

Trên `main`, chưa trang nào có danh sách việc, nên phép thử trình duyệt của thành phần này tự bỏ qua cho tới khi D2-L1 chuyển trang.

## Cho D2-L1

- Trang chặng và ô gợi ý tập lấy dữ liệu bằng code Astro, nên phải đọc bản ghi qua `chiDaKhoa(banGhi, bo, 'trang chặng …')`. Trường nào chưa khóa thì build hỏng.
- Lọc theo một trường trên mọi bản ghi (như `chang`, `goi_y`) là đọc trường ấy ở mọi bản ghi. Vì vậy D2-0 khóa đủ bộ trường đợt 2 cho cả 73 bản ghi, kể cả trường bản ghi chưa có: công cụ khóa giữ trường ấy ở trạng thái "chưa có".
- Phép thử `#mục` không còn hỏng ở trang chỉ có `h3`. Cấp tiêu đề của `bat-dau/tom-tat` (axe `heading-order`) vẫn do lô sửa, ghi lý do vào hồ sơ.
- Phạm vi file của D2-L1 trong `tests/pham-vi.test.mjs` đã đủ cho trang chặng, menu và trang chủ: không phải thêm gì.

## Review (Claude Sonnet 5.5, mức lớn)

Review đọc diff của `d86704d`, chạy từng file kiểm thử, viết script thử. Script đột biến 29.596 lần trên dữ liệu và không thấy trường nào ảnh hưởng tới HTML mà lọt qua `chiDaKhoa`, trừ id. Ba chỗ phải sửa, đã sửa ở commit sau:

1. **Mã việc đổi khi trang được link tới lên site.** Chữ "sắp có" có dấu cách thật đứng trước; bỏ nhãn mà để dấu cách thì "Âm nhạc hôm nay : cập nhật" khác "Âm nhạc hôm nay: cập nhật". Có 36 trong 48 mục việc có link ở site cũ là kiểu link liền dấu câu. Hậu quả: dấu đã đánh ở site cũ không hiện, và dấu đánh trên site mới mất khi trang đích lên.
   - Sửa: mã việc tính lúc build (`data-viec`, `src/plugins/danh-sach-viec.mjs`), bỏ nhãn cùng dấu cách trước nó.
   - Kiểm thử: dựng cùng danh sách khi trang đích chưa có và khi đã có thì ra cùng mã, và mã bằng mã băm của chữ như site cũ.
2. **`nhap` nhập lại thì còn sót `luot_2_ghi_chu`, `luot_2_nguon` của lần trước.** Sửa: xóa hai khóa trước khi ghi.
3. **`nhap` không thật sự "một dòng sai thì không ghi gì".** Hồ sơ hỏng YAML làm lệnh dừng giữa chừng, khi đã ghi xong vài hồ sơ. Sửa: kiểm `doc.errors` lúc kiểm tra; dựng hết chuỗi rồi mới ghi.

Chỗ nên sửa, cũng đã sửa:
- `nhap` từ chối:
  - `nguon` không phải danh sách;
  - hồ sơ đã khóa (lần cuối trong `lan` có mã băm);
  - hai nhận định cùng id.
- `nhap` nhận lời khuyên tập (`khuyen-tap`) không có nguồn, và không xếp nhận định `khong-can-nguon` mà lượt 2 `dung` vào "cần review".
- Thêm kiểm thử cho `::hoc-tiep` với khóa từng phần. Kiểm thử này cho thấy chỉ thị đọc `loai`, `chang` của các bài học khác, `cap`, `ten`, `tac_gia`, `khuyet_danh`, và tên tác giả khi có trang cùng tác phẩm. Đợt 6 cần khóa các trường ấy trước khi khóa trang có `::hoc-tiep`.
- `khoa`: cảnh báo "bản ghi của trang chưa khóa" tính cả khóa từng phần.
- `thieuChiMuc` bắt cả file thiếu hẳn: `pagefind.js`, và file `pf_meta` của từng ngôn ngữ.

Vòng kiểm lại: chính người review xem các chỗ sửa (mức lớn).

## Kiểm thử

Trên máy (macOS), sau khi xóa trang chuyển tạm. Số đếm là của commit đầu; sau khi sửa theo review thì như ghi ở cuối mục.

| Bản | `npm test` | Kiểm thử trình duyệt |
|---|---|---|
| Bản xem | 91: 90 đạt, 0 hỏng, 1 bỏ qua (so chữ với site cũ, phạm vi lô) | 93: 90 đạt, 0 hỏng, 3 bỏ qua (danh sách việc: chưa trang nào có) |
| Bản thật | 91: 89 đạt, 0 hỏng, 2 bỏ qua (thêm: nhãn nhóm, vì bản thật chỉ có trang chủ và trang 404, không thuộc nhóm nào) | 51: 34 đạt, 0 hỏng, 17 bỏ qua |

`test.yml` trên GitHub cho commit đầu (`d86704d`) đạt cả ba phần: `npm test`, kiểm thử trình duyệt, Lighthouse.

Sau khi sửa theo review:
- `npm test`: 93 phép thử. Bản xem: 92 đạt, 1 bỏ qua. Bản thật: 91 đạt, 2 bỏ qua.
- `kiem-thanh-phan`: 16/16 đạt, có trang chuyển tạm, phép thử danh sách việc chạy trên ba trình duyệt.
