# Kế hoạch làm lại site theo đợt

Site mới (Astro và Starlight) dựng trong **repo mới `mtuann/opus`**, ở thư mục `opus/` cạnh thư mục cũ, lịch sử git bắt đầu từ đầu, đăng ở https://mtuann.github.io/opus/. Tên site đổi thành Opus (bản trước tên Opus Zero). Site cũ (MkDocs) ở nguyên repo cũ `mtuann/opus-zero`, thư mục cạnh `../opus-zero/`: đọc và chép nội dung từ đó, không sửa. Nội dung chuyển sang theo 10 đợt (0 đến 9), làm theo thứ tự 0, 1, 2, 3, 4, 5, 7, 8, 6, 9: tác phẩm làm sau cùng. Trang chỉ lên site sau khi đã kiểm định và khóa, nên trong lúc làm lại, site chỉ có những phần đã xong và lớn dần sau mỗi lô.

File này là bản chuẩn cho người làm và agent. Bản cho người đọc, có hình: `so-do.md` (GitHub tự vẽ) và tài liệu Claude Docs "Opus Zero: kế hoạch làm lại site theo đợt" (https://claude.ai/artifact/512CAjWi2xmyqsTYkqANXS, chỉ người được chủ repo chia sẻ mới mở được). Hai bản khác nhau thì file này đúng.

| File | Nội dung |
|---|---|
| `README.md` (file này) | Quyết định, tiến độ, luật, các đợt, rủi ro, quy trình mỗi lô, lời giao việc, review |
| `giao-viec.md` | Giao việc cho người mới: gửi gì, đọc theo thứ tự nào, đưa tài liệu có hình cho người khác thế nào |
| `so-do.md` | Sơ đồ: các đợt, một lô, trang nào lên site, lớp dữ liệu, menu mới |
| `cong-nghe.md` | Công nghệ, phiên bản, thư mục, thành phần, bản thật và bản xem, deploy, kiểm thử |
| `anh-xa.md` | Mỗi trang cũ thuộc nhóm menu nào, đợt nào, lô nào; sinh lại bằng `python3 plans/lam-lai/anh_xa.py > plans/lam-lai/anh-xa.md` |
| `../ben-vung/README.md` | Vì sao làm lại; các tầng, bốn luật, lớp dữ liệu; vận hành sau khi xong |
| `../ben-vung/chuan-kiem-dinh.md` | Nhận định, thứ bậc nguồn, kiểm định hai lượt, hồ sơ, khóa, mở khóa |
| `../ben-vung/kiem-ke.md` | Tầng và số liệu của từng trang cũ |
| `../ben-vung/them-tac-pham.md` | Thêm tác phẩm, từ sau đợt 6 |

## Quyết định

Đã chọn ngày 23/10/2026:

- Repo mới `mtuann/opus`, thư mục mới `opus/`, git từ đầu. Repo cũ `mtuann/opus-zero` và thư mục `../opus-zero/` để nguyên; tạo release `v15` khi bạn muốn; tắt Pages của repo cũ nên để sau khi đợt 6 xong (mục Rủi ro).
- Site mới ở `https://mtuann.github.io/opus/`; địa chỉ cũ `/opus-zero/` không giữ. Không có bản xem trước trên mạng.
- Tên site: Opus. Ban đầu chọn giữ tên Opus Zero; chủ repo đổi thành Opus ngày 23/10/2026, khi duyệt giao diện. Khóa dữ liệu học trong trình duyệt vẫn là `opus-zero:v1`, để giữ tiến độ của người học cũ.
- Giữ 7 chặng.
- 13 trang ngoại vi vào mục Đọc thêm, chuyển ở đợt 8.
- Thứ tự làm các đợt: 0 đến 5, rồi 7, 8, 6, 9. Tác phẩm (đợt 6) làm sau cùng, khi khung site, phần lõi, công cụ, sách in và trang tham chiếu đã xong. Đợt 6 thêm tác phẩm theo lô (D6-L1 đến D6-L11); sau đợt 6, mỗi tác phẩm mới thêm theo `../ben-vung/them-tac-pham.md`. Số đợt, tên lô, tên nhánh và `anh-xa.md` giữ nguyên. Chủ repo chọn ngày 23/10/2026, lúc đang làm đợt 1.
  - Ba trang thử của D1.8 (`nhac-ly/10-hop-am-ba`, Für Elise, Bach Goldberg) chuyển ở đợt 1, chỉ có ở bản xem, để kiểm khung. Lô của chúng (D3-L2 và hai lô đợt 6) chỉ kiểm định và khóa, không chuyển lại.
  - Trang ngoài đợt 6 vẫn hiện vài trường của bản ghi tác phẩm (danh sách ở trang chặng, ô gợi ý tập, Tác phẩm theo cấp độ, Thầy và thi). Các trường đó khóa riêng, ở lô đầu tiên có trang hiện chúng (mục "Quy tắc chung"); đợt 6 khóa nốt phần còn lại.

Chờ bạn. Mục "khuyên dùng" là lựa chọn mà kế hoạch đang giả định. Đợt 0 không phụ thuộc các mục này nên giao được ngay; hai mục đầu cần có trước đợt 1, ba mục sau trước đợt 2.

- [x] Công nghệ: Astro 7 và Starlight (khuyên dùng; lý do ở `cong-nghe.md`), hay MkDocs và Material như cũ. **Chọn Astro 7 và Starlight** (23/10/2026, khi duyệt D1.1).
- [x] Giao diện: giữ font, màu và giọng văn hiện có (khuyên dùng), hay làm nhận diện mới ở đợt 1. **Giữ font, màu, giọng văn** (23/10/2026, khi duyệt D1.1); thêm yêu cầu về hình ảnh ở mục "Giao diện" của `AGENTS.md`. Cùng ngày, sau khi so ba bản mẫu, chủ repo chọn bố cục **bản B** (thanh trên nền giấy viền nhựa thông, màu và biểu tượng riêng cho từng nhóm nội dung) **cộng phần đầu trang chủ của bản C** (dải màu mực tràn ngang); làm ở D1.2b.
- [ ] Mức kiểm định: hai lượt agent, review, bạn kiểm khoảng 10 nhận định mỗi lô (khuyên dùng); hay một lượt agent và review.
- [ ] Nguồn chính cho nhạc lý: giáo trình bạn có (ghi tên và lần in), hay giáo trình mở Open Music Theory (https://viva.pressbooks.pub/openmusictheory/).
- [ ] Bảng tầng: duyệt `../ben-vung/kiem-ke.md`, nhất là các trang tham chiếu có hạn và ngày rà lại.

## Tiến độ

| Đợt | Nội dung | Lô | Sau đợt này site mới có thêm | Trạng thái |
|---|---|---|---|---|
| 0 | Dựng repo mới | | Chưa đăng gì | Xong 23/10/2026 |
| 1 | Nền kỹ thuật | D1.1–D1.8 | Trang chủ tạm và trang 404 ở `/opus/`; chưa có bài | Đang làm: D1.1, D1.2, D1.2b xong |
| 2 | Khung cấp độ và lối vào | 1 | Trang chủ, Bắt đầu, lộ trình và 7 trang chặng, bài kiểm tra đầu vào | Chưa làm |
| 3 | Nhạc lý và luyện tai | 6 | 45 trang, Từ điển | Chưa làm |
| 4 | Piano nền tảng | 4 | 28 trang: bắt đầu bên phím, kỹ thuật, tập luyện, hòa âm bên phím, văn học piano | Chưa làm |
| 5 | Nhạc cổ điển nền tảng | 3 | 26 trang: thời kỳ, hình thức, nhận diện; đủ 100 trang lõi | Chưa làm |
| 7 | Công cụ, sách in, blog, Cập nhật | 3 | 17 công cụ luyện tập, sách in, blog, dùng khi mất mạng | Chưa làm |
| 8 | Tham chiếu có hạn và Đọc thêm | 3 | 21 trang | Chưa làm |
| 6 | Tác phẩm | 11 | 34 bài học, 45 hướng dẫn nghe, danh mục tác phẩm; đủ 233 trang cũ | Chưa làm |
| 9 | Hoàn tất | | Site mới không còn cần `../opus-zero/` | Chưa làm |

Bảng xếp theo thứ tự làm: đợt 6 (tác phẩm) sau đợt 8. Số trang tính cả trang mục lục của mỗi mục. Danh sách trang của từng lô: `anh-xa.md`. Người review cập nhật bảng này cuối mỗi đợt.

## Bảy luật

1. **Cổng vào:** trang chỉ lên site khi có hồ sơ kiểm định đủ và mã băm trong `kiem-dinh/khoa.json`; bản build thật tự bỏ trang chưa khóa. Không chép nguyên trạng.
2. **Site cũ chỉ đọc:** không sửa, commit hay push gì trong `../opus-zero/`; thư mục đó chỉ là nguồn để chuyển và để so chữ.
3. **Dữ liệu trước, trang sau:** thông tin dùng ở nhiều nơi vào `src/data/` (có schema) trước khi trang dùng nó được chuyển.
4. **Giữ đường dẫn:** `../opus-zero/docs/<trang>.md` thành `src/content/docs/<trang>.md`; trang cũ `/opus-zero/<trang>/` thành `/opus/<trang>/`. Trang gộp hay bỏ ghi trong `anh-xa.md`. Link tới trang chưa lên site hiện chữ "sắp có" và tự thành link khi trang lên.
5. **Mỗi đợt một chủ đề, mỗi lô một nhánh,** có tiêu chí xong.
6. **Chuyển bằng script, sửa qua kiểm định:** cú pháp đổi bằng `tools/chuyen/`; chữ chỉ đổi khi hồ sơ ghi lý do.
7. **Không lùi chuẩn:** Lighthouse trên điện thoại: hiệu năng từ 95; trợ năng, thực hành tốt và SEO đều 100. Quy tắc nội dung, bản quyền và quy ước ABC trong `AGENTS.md` giữ nguyên.

## Quy tắc chung

- Lệnh (từ đợt 1): `npm ci`; `npm run build` (bản thật, chỉ trang đã khóa); `npm run build:xem` (bản xem, thêm trang chưa khóa, không đăng); `npm test`. Chi tiết và phiên bản: `cong-nghe.md`. Site cũ build lại để so chữ, ra ngoài thư mục cũ: `PYTHONDONTWRITEBYTECODE=1 mkdocs build -f ../opus-zero/mkdocs.yml -d "$PWD/.cache/site-cu"`, chạy từ `opus/`, môi trường Python như `../opus-zero/AGENTS.md`. Đường dẫn `-d` phải tuyệt đối: MkDocs tính đường dẫn tương đối theo thư mục chứa `mkdocs.yml`, nên `.cache/site-cu` sẽ ghi vào `../opus-zero/.cache/`. `PYTHONDONTWRITEBYTECODE=1` để Python không ghi `__pycache__` vào `../opus-zero/hooks/`.
- Nhánh: `moi/d1-<số việc>-<tên ngắn>` cho việc ở đợt 1; `moi/d<đợt>-l<lô>` cho một lô (ví dụ `moi/d3-l2`). Đợt 0 commit thẳng lên `main` vì repo mới chưa có commit nào.
- Báo cáo: `plans/lam-lai/bao-cao/<mã>.md` (ví dụ `d0.md`, `d1-3.md`, `d3-l2.md`): việc đã làm và file đã chạm, số nhận định, số đã sửa và đã bỏ, chỗ chưa chắc, kết quả kiểm thử, nguồn đã dùng. Người review ghi tiếp vào cuối cùng file.
- Một lô chỉ chạm: trang của lô trong `src/content/docs/`; dữ liệu liên quan trong `src/data/`; thành phần, script và file tĩnh mà trang của lô cần lần đầu (`src/components/`, `src/scripts/`, `public/`); hồ sơ trong `kiem-dinh/`; báo cáo của lô. Kiểm thử phạm vi chặn chỗ khác.
- Không push (bạn push). Không sửa `.claude/`. Không sửa trang đã khóa: kiểm thử khóa chặn; cần sửa thì theo thủ tục mở khóa (`../ben-vung/chuan-kiem-dinh.md` mục 7).
- Không thêm trang ngoài kế hoạch cho đến hết đợt 6; sau đó tác phẩm mới theo `../ben-vung/them-tac-pham.md`.
- Trang chỉ hiện trường dữ liệu đã khóa. Trang của lô hiện một trường chưa khóa thì lô đó kiểm định và khóa trường ấy cùng trang. Khóa từng phần bản ghi: `../ben-vung/chuan-kiem-dinh.md` mục 6.
- Commit message, mạng, `_imslp/`: như mục "Cách làm việc" của `AGENTS.md`.
- **Người review:** mặc định là Claude (phiên Cowork hay Claude Code của bạn); có thể là người hay LLM khác, miễn không làm lượt 1 hay lượt 2 của chính lô đó.

## Đợt 0. Dựng repo mới

Claude đã dựng thư mục `opus/` ngày 23/10/2026: `git init`, `.gitignore`, `plans/` (kế hoạch này), giấy phép, `AGENTS.md`, `CLAUDE.md`, `README.md`; chưa commit. Site cũ ở thư mục cạnh `../opus-zero/`, không chép sang: agent đọc thẳng ở đó.

1. **Bạn:** xem các file, commit đầu tiên, tạo repo trống `mtuann/opus` trên GitHub (không thêm README hay giấy phép), push.
2. **Bạn, khi muốn:** trong repo cũ, tạo release `v15` ở commit `5d08189` và tắt Pages (Settings → Pages, bấm "…" cạnh dòng "Your site is live at", chọn Unpublish site). Tắt Pages nên để sau khi đợt 6 xong: tới lúc đó site mới chưa có trang tác phẩm (mục Rủi ro). Repo cũ không cần sửa gì khác.

**Xong khi:** repo mới có commit đầu tiên trên GitHub.

## Đợt 1. Nền kỹ thuật

Mỗi việc một nhánh, làm theo thứ tự. Site mới chưa đăng gì cho đến khi D1.7 gộp.

- **D1.1 Khởi tạo:** dự án Astro và Starlight ở thư mục gốc theo `cong-nghe.md`: `site: 'https://mtuann.github.io'`, `base: '/opus'`, địa chỉ dạng thư mục như cũ (`/opus/piano/gam/`), tiếng Việt; font tự host và màu lấy từ `../opus-zero/docs/assets/` và `../opus-zero/overrides/`; trang chủ tạm ("Opus đang được làm lại; từng phần sẽ lên sau khi được kiểm tra lại từ đầu"); `.nvmrc` theo Node mà Astro 7 cần; `.gitignore` thêm `dist/`, `.astro/` nếu chưa có. Điền mục lệnh vào `AGENTS.md`.
- **D1.2 Dữ liệu và schema:** `src/content.config.ts`: frontmatter của Starlight cộng `tac_pham` (slug bản ghi, chỉ trang tác phẩm). Tầng và ngày rà nằm trong `trang.yml`; trạng thái kiểm định đọc từ `kiem-dinh/` lúc build, không ghi vào trang (để mã băm không đổi khi khóa). Năm bộ dữ liệu trong `src/data/`, nội dung và thứ chúng thay như `../ben-vung/README.md` mục "Lớp dữ liệu"; trường của `tac-pham.yml` như `../ben-vung/them-tac-pham.md` mục 2. Script tách một lần trong `tools/du_lieu/`, đọc `../opus-zero/docs/`. Chỗ site cũ tự mâu thuẫn (hai năm khác nhau cho cùng người) thì ghi vào báo cáo, không tự chọn. Dữ liệu sai thì build hỏng; có bộ dữ liệu hỏng mẫu để thử. Dữ liệu chưa khóa ở việc này.
- **D1.2b Giao diện** (thêm ngày 23/10/2026, theo bản mẫu chủ repo chọn ở mục Quyết định): thanh trên nền giấy (tối: nền trang), viền nhựa thông; logo hai bản cho nền sáng và tối; dải mực tràn ngang ở phần đầu trang chủ; mỗi nhóm nội dung một màu và một biểu tượng (`src/nhom.mjs`), nhãn nhóm trên tiêu đề trang, thẻ "Sắp có trên site" ở trang chủ tạm. Đổi tên hiển thị thành Opus.
- **D1.3 Thành phần tối thiểu:** chip cấp độ, hộp thông tin tác phẩm, khuông nhạc ABC (khối ```abc, abcjs tải khi gần màn hình, vẽ đủ khi in), khối nghe, hình cấu trúc từ dữ liệu, câu hỏi kiểm tra nhanh, "Học tiếp", huy hiệu "Đã kiểm định". Logic lấy từ module trong `../opus-zero/docs/assets/js/`. Chốt cú pháp trong trang và ghi vào mục "Mẫu trang", "Khối đặc biệt" của `AGENTS.md`.
- **D1.4 Script chuyển cú pháp** `tools/chuyen/`: đọc `../opus-zero/docs/<trang>.md`, ghi `src/content/docs/<trang>.md`. Admonition thành aside; khối thu gọn thành `<details>`; khối `oz-` thành chỉ thị thành phần; vùng `<!-- fig: -->` thành thành phần hình; `data-rec` thành dữ liệu của khối nghe; link tới file `.md` thành link theo địa chỉ; giữ nguyên khối ```abc và chú thích. Kiểm thử: chữ hiển thị của một trang ở bản build cũ (`.cache/site-cu/`) và ở bản xem giống nhau.
- **D1.5 Link và 404:** link tới trang không có trong bản build hiện chữ thường kèm nhãn "sắp có", tự thành link khi trang lên; kiểm link và anchor nội bộ trên cả bản thật và bản xem. Trang 404 thân thiện: báo site đang được làm lại, dẫn về trang chủ và ô tìm kiếm.
- **D1.6 Khóa, phạm vi, bản thật và bản xem:** `tools/khoa.py` (`tinh`, `khoa`, `mo`, `mau`, `xuat`) theo `../ben-vung/chuan-kiem-dinh.md`; `kiem-dinh/khoa.json`; kiểm thử khóa; kiểm thử phạm vi lô (so nhánh `moi/dN-lM` với `anh-xa.md`). `npm run build` chỉ đưa trang đã khóa; `npm run build:xem` đưa cả trang chưa khóa, có dải "Chưa kiểm định" ở đầu. Khóa trang chủ tạm và trang 404 (hồ sơ không có nhận định). Ghi cách làm đã chọn vào `cong-nghe.md` mục 7.
- **D1.7 CI và deploy:** `.github/workflows/test.yml` (nhánh `moi/**`: bản xem và kiểm thử) và `deploy.yml` (nhánh `main`: bản thật, kiểm thử, rồi đăng `dist/` lên GitHub Pages). Kiểm thử gồm build, schema, khóa, link, trợ năng, Lighthouse ở ba trang; hỏng thì không đăng. Bạn bật Pages của repo mới (Settings → Pages, nguồn GitHub Actions) trước khi gộp việc này.
- **D1.8 Thử:** chuyển ba trang `nhac-ly/10-hop-am-ba`, `piano/tac-pham/fur-elise`, `nghe-nhac/bach-goldberg` bằng `tools/chuyen/`; chưa kiểm định, chưa khóa, nên chỉ có ở bản xem. Trang `10-hop-am-ba` hiện ô "chưa chuyển" ở chỗ bàn phím (thành phần làm ở D3-L1): được phép ở bản xem, không tính là lỗi hiển thị. Chạy bộ truy vấn tìm kiếm của `../opus-zero/tests/search.mjs` trên bản xem.

**Xong khi:** ba trang thử hiện đúng ở bản xem (ảnh chụp 360 px và 1280 px), đạt chuẩn ở luật 7, và không có trong bản thật; bộ dữ liệu hỏng làm build hỏng; tìm "hop am ba" ra bài 10, tìm "dan" ra trang có chữ "đàn"; https://mtuann.github.io/opus/ hiện trang chủ tạm, địa chỉ không có ra trang 404 mới.

## Đợt 2. Khung cấp độ và lối vào (lô D2-L1)

Từ đợt này, mỗi lô gộp vào `main` là trang của lô lên site thật.

- Kiểm định và khóa: `cap-do.yml`; `nha-soan-nhac.yml`; các trường của 79 bản ghi trong `tac-pham.yml` mà trang của lô hiện ra, khóa từng phần (`../ben-vung/chuan-kiem-dinh.md` mục 6). Tối thiểu:
  - `ten`, `tac_gia`, `danh_muc`, `chang`, `loai`: trang chặng liệt kê bài, link tới đúng trang bài học hay hướng dẫn nghe;
  - `goi_y`: ô gợi ý tập ở trang chủ;
  - `grade` nếu trang chặng hiện Grade của từng bài; không thì `grade` khóa ở D8-L1 (Tác phẩm theo cấp độ).

  Trang chặng hiện thêm trường nào thì khóa thêm trường ấy, ghi trong báo cáo. Các trường còn lại khóa ở đợt 6.
- Kiểm thử hỏng nếu trang đã khóa hiện một trường chưa khóa của bản ghi, qua chỉ thị trong trang, trang chặng hay ô gợi ý tập.
- Ô gợi ý tập (`practice.js` cũ, ở trang chủ; đợt 4, 7 dùng lại ở trang Piano, Luyện tập) sinh link bằng JavaScript. Link tới trang chưa có phải hiện "sắp có" như link dựng lúc build. Vì vậy bản build xuất danh sách trang cho script; D2-L1 làm việc này khi chuyển `practice.js` (phạm vi của D2-L1 gồm cả cấu hình build, xem kiểm thử phạm vi của D1.6).
- Kiểm định trường của 79 bản ghi là phần nặng nhất của đợt. Quá tải thì tách thành một việc dữ liệu riêng, làm trước D2-L1 (chủ repo quyết).
- 7 trang chặng `piano/lo-trinh/chang-1` đến `chang-7` sinh từ dữ liệu; trang lộ trình giữ các mục chặng dạng tóm tắt, mỗi mục dẫn sang trang chặng.
- 9 trang của lô, gồm trang chủ mới (thay trang chủ tạm) và bài kiểm tra đầu vào (`placement.js`).
- Menu đủ 9 nhóm; nhóm chưa có trang hiện nhãn "sắp có".

**Xong khi:** trang của lô và phần dữ liệu trên đã khóa và có trên site thật; người mới đi được từ trang chủ tới trang chặng của mình; ô gợi ý tập ở trang chủ chỉ dùng trường đã khóa, link tới bài chưa lên hiện "sắp có".

## Đợt 3. Nhạc lý và luyện tai (D3-L1 đến D3-L6)

- `thuat-ngu.yml` kiểm định và khóa cùng lô D3-L5; trang Từ điển sinh từ dữ liệu.
- Thành phần mà các bài này dùng (bàn phím, hóa biểu, vòng quãng năm, máy đếm nhịp, câu hỏi) chuyển trong lô có trang đầu tiên cần nó. Bàn phím (`piano.js` cũ) phát tiếng qua `audio.js`, module âm thanh dùng chung. Lô đầu tiên có bàn phím là D3-L1 (bài 1). Lô đó chép kèm `audio.js` và mẫu âm piano (`../opus-zero/docs/assets/samples/piano/`, Salamander Grand Piano, CC BY 3.0, cả file `LICENSE.txt` của thư mục). Trước đó, trang thử `nhac-ly/10-hop-am-ba` của D1.8 hiện ô "chưa chuyển" ở chỗ bàn phím.

**Xong khi:** 45 trang của 6 lô và `thuat-ngu.yml` đã khóa.

## Đợt 4. Piano nền tảng (D4-L1 đến D4-L4)

**Xong khi:** 28 trang của 4 lô đã khóa; 10 bài đầu tiên phát và vẽ khuông đúng.

## Đợt 5. Nhạc cổ điển nền tảng (D5-L1 đến D5-L3)

- Trang nhà soạn nhạc và dòng thời gian đọc năm sinh–mất từ `nha-soan-nhac.yml`.

**Xong khi:** 26 trang của 3 lô đã khóa; đủ 100 trang lõi.

## Đợt 7. Công cụ, sách in, blog, Cập nhật (D7-L1 đến D7-L3)

- 17 trang công cụ và các module còn lại.
- Dữ liệu học giữ khóa `opus-zero:v1` và định dạng sao lưu cũ. Trình duyệt lưu dữ liệu theo tên miền `mtuann.github.io`, không theo đường dẫn, nên site mới ở `/opus/` đọc được tiến độ người học đã lưu ở site cũ.
- Service worker của site mới (phạm vi `/opus/`): danh sách tệp và phiên bản sinh lúc build; dùng khi mất mạng và cài như ứng dụng như site cũ.
- Sách in sinh từ dữ liệu (thay `../opus-zero/hooks/books.py`), chỉ gồm trang đã khóa. Hai cuốn có tác phẩm ("Hướng dẫn nghe", "Piano: 10 bài đầu tiên và bài học tác phẩm") lúc này chỉ có phần không phải tác phẩm, và tự đủ chương khi đợt 6 xong. Nhật ký trang Cập nhật sinh từ dữ liệu và các mục viết tay.
- Bài blog chuyển sang với đường dẫn theo cú pháp của site mới.
- Nhật ký tác phẩm mới ở trang Cập nhật (theo `them_ngay`) chỉ hiện tác phẩm đã lên site (trang đã khóa); trước đợt 6 phần này trống. `them_ngay` khóa cùng bản ghi ở đợt 6.
- Mục viết tay chép từ site cũ có câu chỉ đúng khi tác phẩm đã lên (như "bản thu lưu ngay trên site"): kiểm định như mọi nhận định, viết lại cho đúng với site lúc đăng.

**Xong khi:** mọi công cụ chạy; ô gợi ý tập chỉ dùng trường đã khóa, link tới bài chưa lên hiện "sắp có"; bản sao lưu xuất từ site cũ (build `../opus-zero/` trên máy) khôi phục được; sách in đủ chương, trừ phần tác phẩm; trang đã xem mở lại được khi mất mạng.

## Đợt 8. Tham chiếu có hạn và Đọc thêm (D8-L1 đến D8-L3)

- Trang tham chiếu có `ra_lai` trong `trang.yml`; workflow hằng tuần mở issue "Trang cần rà lại" khi quá hạn (không chặn deploy).
- Thầy và thi, Tác phẩm theo cấp độ: kiểm định theo chương trình ABRSM đang dùng lúc làm (từ tháng 1/2027 là chương trình piano 2027–2028). Hai trang liệt kê tác phẩm: dùng trường đã khóa; `grade` khóa ở đợt 2 nếu trang chặng hiện Grade, không thì chính lô này khóa. Link tới bài chưa lên hiện "sắp có".
- Trang Đọc thêm có dòng "ngoài lộ trình" ở đầu.

**Xong khi:** 21 trang của 3 lô đã khóa.

## Đợt 6. Tác phẩm (D6-L1 đến D6-L11), làm sau đợt 8

Khung, lõi, công cụ và tham chiếu đã lên site; đợt này thêm tác phẩm từng lô. Link "sắp có" tới bài học (ở trang lõi, trang chặng, ô gợi ý tập, công cụ, trang tham chiếu) tự thành link khi lô lên. Mỗi lô khóa nốt các trường còn lại của bản ghi tác phẩm trong lô.

- Trước lô đầu, một việc riêng (nhánh `moi/d6-0-chuan-bi`, báo cáo `d6-0.md`): chép các bản thu từ `../opus-zero/docs/assets/audio/` sang `public/audio/` (cả `NGUON.txt`); chép `../opus-zero/tools/audio/` sang `tools/audio/` rồi sửa để `attach.py`, `check_audio.py`, phần căn mốc đọc và ghi bản thu trong bản ghi của `tac-pham.yml` thay vì trong trang; thông số hình cấu trúc nằm trong bản ghi; `tools/them_tac_pham.py` và kiểm thử `tac_pham` theo `../ben-vung/them-tac-pham.md`.
- Đối chiếu nốt và căn mốc bản thu IMSLP dùng `../opus-zero/_imslp/` (chỉ có trên máy bạn, không có trong git).
- D6-L1 đến D6-L6: bài học chặng 2 đến 7, kèm hướng dẫn nghe cùng tác phẩm; D6-L7 đến D6-L11: các hướng dẫn nghe còn lại theo thứ tự nav cũ, cùng hai trang mục lục.
- Danh mục `tac-pham` sinh từ dữ liệu, lọc theo chặng, thời kỳ, tác giả, loại.

**Xong khi:** 81 trang của 11 lô đã khóa; mọi trường của 79 bản ghi tác phẩm đã khóa (khóa cả bản ghi); `python3 tools/audio/check_audio.py` không lỗi; danh mục, trang chặng và "Học tiếp" hiện đủ; hai cuốn sách in có tác phẩm ("Hướng dẫn nghe", "Piano: 10 bài đầu tiên và bài học tác phẩm") đủ chương.

## Đợt 9. Hoàn tất

- Mọi trang trong `anh-xa.md` có trang tương ứng trên site mới, hoặc được ghi rõ là gộp hay bỏ.
- Repo mới không còn cần `../opus-zero/`: âm thanh, dữ liệu, mã đã chép sang; build và kiểm thử chạy được khi không có thư mục cũ. Repo cũ vẫn ở GitHub.
- Bài blog thông báo; theo dõi lỗi hai tuần.

**Xong khi:** Lighthouse và kiểm tra link đạt trên site thật; build và kiểm thử đạt khi không có `../opus-zero/`; `../ben-vung/them-tac-pham.md` là đường duy nhất để thêm tác phẩm.

## Rủi ro

| Rủi ro | Cách giữ |
|---|---|
| Site thưa trong nhiều tháng: người đọc chỉ thấy phần đã xong | Lõi trước, theo thứ tự người mới cần; menu và trang chủ ghi rõ phần "sắp có"; lô nhỏ để site lớn đều |
| Link cũ và kết quả tìm kiếm tới `/opus-zero/` hết tác dụng khi tắt Pages của repo cũ | Site cũ mới ra 12 ngày nên ít link ngoài. Nếu cần, sau này đăng lại Pages của repo cũ chỉ với một trang chuyển hướng từ `/opus-zero/<trang>/` sang `/opus/<trang>/` (một commit nhỏ trong repo cũ, không bắt buộc) |
| Service worker của site cũ còn trong trình duyệt người từng vào | Phạm vi của nó là `/opus-zero/`, không đụng tới site mới ở `/opus/` |
| Người học cũ mất tiến độ | Cùng tên miền nên dữ liệu còn; đợt 7 đọc lại khóa `opus-zero:v1`; kiểm khôi phục bản sao lưu |
| Agent sửa nhầm repo cũ qua `../opus-zero/` | Luật 2; `../opus-zero/` chỉ để đọc, không commit, không push; kiểm `git -C ../opus-zero diff --stat` trống ở mỗi review đợt |
| Công cụ luyện tập vắng đến đợt 7 | Cần sớm thì đưa D7-L1, D7-L2 lên ngay sau đợt 2 (công cụ ít nhận định, chủ yếu là code) |
| Astro hoặc Starlight đổi API | Ghim phiên bản, nâng mỗi tháng trên nhánh riêng, ít override |
| `_imslp/` chỉ có trên máy bạn | Người làm đợt 6 ở máy khác cần bạn gửi riêng thư mục này, bỏ tài liệu có giấy phép dùng cá nhân |
| Tác phẩm lên sau cùng: lâu mới có bài học và hướng dẫn nghe; trang lõi, trang chặng, ô gợi ý tập, công cụ và trang tham chiếu có nhiều link "sắp có" tới bài học | Link "sắp có" tự thành link khi trang lên (cả link do JavaScript sinh); danh sách tác phẩm ở trang chặng và danh mục sinh từ dữ liệu. Nên để site cũ chạy (chưa tắt Pages của repo cũ) tới khi đợt 6 xong, để người đang học bài tác phẩm vẫn đọc được. Muốn có vài trang tác phẩm sớm thì làm việc chuẩn bị D6-0 rồi đưa một lô của đợt 6 lên trước, ví dụ D6-L1 (bài học chặng 2) |

## Quy trình mỗi lô

1. Bạn giao lô bằng lời mẫu dưới đây.
2. Agent chuyển trang bằng `tools/chuyen/`, tách dữ liệu, kiểm định lượt 1, ghi hồ sơ (chưa khóa).
3. Agent khác kiểm định lượt 2 độc lập (`../ben-vung/chuan-kiem-dinh.md` mục 3 và 8).
4. CI trên bản xem: build, schema, khóa, link, khuông nhạc, trợ năng, Lighthouse một trang; ảnh chụp từng trang ở 360 px và 1280 px đính vào báo cáo.
5. Review báo cáo, hồ sơ và ảnh chụp; chỗ cần sửa trả về agent trên cùng nhánh.
6. Bạn kiểm khoảng 10 nhận định; agent khóa; bạn gộp vào `main` và push. Trang của lô lên site thật.

Hai lô cùng đợt làm song song được nếu không chung file. Các đợt làm lần lượt, theo thứ tự ở bảng Tiến độ. Cuối mỗi đợt, người review xét cả đợt theo "Xong khi" và cập nhật bảng Tiến độ.

## Lời giao việc mẫu

Một phiên một việc, mở trong thư mục `opus/`. Đổi các chỗ trong `<>` trước khi gửi.

**Một việc của đợt 1:**

> Bạn làm việc **D1.<số>** trong `plans/lam-lai/README.md` của repo opus. Đọc `AGENTS.md`, `plans/lam-lai/README.md` (Quyết định, Bảy luật, Quy tắc chung, Đợt 1) và `plans/lam-lai/cong-nghe.md`. Tạo nhánh `moi/d1-<số>-<tên ngắn>` từ `main`. Chỉ làm việc này; gặp việc khác thì ghi vào báo cáo. Không sửa `../opus-zero/`. Không push. Khi xong: `npm ci`, `npm run build`, `npm test` đạt (từ D1.6 chạy thêm `npm run build:xem`); commit; viết báo cáo `plans/lam-lai/bao-cao/d1-<số>.md`.

**Một lô (đợt 2 đến 8):**

> Bạn làm lô **D<đợt>-L<lô>** trong `plans/lam-lai/README.md` của repo opus. Đọc `AGENTS.md`; các mục Bảy luật, Quy tắc chung, Quy trình mỗi lô và Đợt <đợt> trong kế hoạch; danh sách trang của lô trong `plans/lam-lai/anh-xa.md`; `plans/ben-vung/chuan-kiem-dinh.md`. Tạo nhánh `moi/d<đợt>-l<lô>` từ `main`. Chuyển từng trang từ `../opus-zero/docs/` bằng `tools/chuyen/`, tách dữ liệu, kiểm định lượt 1 và ghi hồ sơ, kể cả các trường dữ liệu chưa khóa mà trang của lô hiện ra; chưa khóa gì. Chỉ chạm file của lô. Không push. Khi xong: `npm run build:xem` và `npm test` đạt; commit; viết báo cáo `plans/lam-lai/bao-cao/d<đợt>-l<lô>.md`; xuất danh sách nhận định cho lượt 2 bằng `python3 tools/khoa.py xuat D<đợt>-L<lô>`.

**Lượt 2:** lời mẫu ở `../ben-vung/chuan-kiem-dinh.md` mục 8.

**Review một lô:**

> Bạn review lô **D<đợt>-L<lô>** của repo opus, nhánh `moi/d<đợt>-l<lô>`. Đọc mục "Review những gì" trong `plans/lam-lai/README.md`, `plans/ben-vung/chuan-kiem-dinh.md`, báo cáo của lô và hồ sơ trong `kiem-dinh/` của các trang trong lô; xem diff của nhánh so với `main`. Chạy `npm ci`, `npm run build:xem`, `npm test`. Kiểm lại mọi nhận định hai lượt cho kết quả khác nhau và mọi chỗ đã sửa, mở đúng nguồn ghi trong hồ sơ. Ghi vào cuối báo cáo, mục "Review": chỗ phải sửa (file, dòng, lý do, nguồn), chỗ nên sửa, kết luận gộp được hay chưa. Không sửa trang. Không push.

**Review cuối đợt:**

> Bạn review **đợt <đợt>** của repo opus theo mục "Review những gì" trong `plans/lam-lai/README.md`. Kiểm tiêu chí "Xong khi" của đợt; so số trang đã khóa trong `kiem-dinh/khoa.json` với `plans/lam-lai/anh-xa.md`; mở site thật xem phần mới lên. Cập nhật bảng Tiến độ trong README; ghi kết quả vào `plans/lam-lai/bao-cao/d<đợt>.md`. Không push.

## Review những gì

- **Mỗi lô:** phạm vi file; hồ sơ đủ; trường dữ liệu mà trang của lô hiện ra đã kiểm định (khóa cùng trang); mọi chỗ hai lượt lệch nhau và mọi chỗ đã sửa; trang dựng đúng trên ảnh chụp; thành phần mới có kiểm thử; dữ liệu tách ra khớp trang cũ trong `../opus-zero/`; `git -C ../opus-zero diff --stat` trống.
- **Đợt 1:** chạy lại build và kiểm thử; đọc schema, plugin, script chuyển; so chữ ba trang thử với site cũ; thử dữ liệu hỏng; bản thật không có trang chưa khóa; link "sắp có" và trang 404; đo Lighthouse.
- **Cuối mỗi đợt:** tiêu chí "Xong khi"; số trang đã khóa khớp `anh-xa.md`; site thật hiện đúng phần đã khóa, không link chết.
