# Công nghệ của site mới

**Đã chọn** (mục "Quyết định" của `README.md`, 23/10/2026): Astro 7 và Starlight, build tĩnh, trong repo mới `mtuann/opus`, deploy lên GitHub Pages ở https://mtuann.github.io/opus/. D1.1 dùng Astro 7.4.2 và Starlight 0.42.7 (lúc viết đề xuất, kế hoạch ghi Starlight 0.41; bản 0.42.0 ra ngày 2/9/2026). Số liệu và tình trạng dưới đây là lúc kiểm, 23/10/2026. Site cũ (MkDocs) ở repo cũ `mtuann/opus-zero`, thư mục cạnh `../opus-zero/`; mọi đường dẫn tới site cũ dưới đây tính từ thư mục đó.

## 1. Vì sao

| Tiêu chí | MkDocs 1.6.1 + Material 9.7.7 (site cũ) | Zensical | Astro 7 + Starlight |
|---|---|---|---|
| Tình trạng | Material ngừng thêm tính năng từ 11/2025 (9.7.0 là bản tính năng cuối), cam kết vá lỗi nghiêm trọng ít nhất 12 tháng; MkDocs 1.x không còn bản mới | Cùng nhóm làm Material; bản 0.0.x (mới nhất 0.0.71 khi kiểm), chưa có lịch ra 1.0, API module chưa công khai | Astro 7 ra tháng 6/2026; Cloudflare mua Astro ngày 16/1/2026, Astro vẫn mã nguồn mở MIT |
| Dữ liệu có schema | Tự viết hook | Chưa làm được | Content collections, schema Zod |
| Trang và danh sách sinh từ dữ liệu | Hook tự viết | Chưa làm được | Code Astro thường |
| Tìm kiếm | lunr và hook `search_vi` | Plugin search thay thế | Pagefind có sẵn; tài liệu Pagefind ghi mặc định bỏ qua dấu (tùy chọn `exactDiacritics`) |

Công chuyển sang Astro cao (5 hook, cú pháp Material ở 105 file, thành phần riêng ở 183 file, 40 module JavaScript), nhưng phần lớn trùng với việc phải làm dù ở lại MkDocs: mọi trang đằng nào cũng đi qua kiểm định, lớp dữ liệu đằng nào cũng phải viết. Chọn MkDocs thì các đợt vẫn như nhau, chỉ phần kỹ thuật của đợt 1 đổi.

## 2. Hai điểm phải thử ở đợt 1

1. **Bộ xử lý Markdown.** Astro 7 mặc định dùng Sätteri (viết bằng Rust) thay cho remark/rehype; Sätteri có plugin riêng (`mdastPlugins`, `hastPlugins`) và không chạy plugin remark/rehype. Muốn giữ remark/rehype thì cài `@astrojs/markdown-remark` và đặt `markdown.processor`. Nhóm Astro nói không định bỏ hỗ trợ unified, nhưng không nói đến bao giờ. Đợt 1 (D1.3, D1.4) thử cả hai cách cho: chỉ thị thành phần, khối ```abc, aside của Starlight, chú thích. Chọn Sätteri nếu làm được hết; không thì dùng unified. Plugin của dự án viết trên cây mdast/hast để chuyển giữa hai bên dễ.
   **Kết quả (D1.3): chọn Sätteri** (`@astrojs/markdown-satteri` 0.4.5, `satteri` 0.10.5). Chỉ thị thành phần, khối ```abc và ```quiz, aside của Starlight, chú thích cuối trang, id cố định cho tiêu đề và danh sách định nghĩa đều chạy, với một plugin mdast của dự án (`src/plugins/opus-markdown.mjs`). D1.4 thử thêm trên trang thật. Ba điều cần biết khi sửa plugin: Astro tách frontmatter trước khi gọi Sätteri và đưa vào `ctx.data.astro.frontmatter`; plugin của dự án chạy trước plugin của Starlight; Astro giữ HTML đã dựng của trang giữa các lần build, nên `src/content.config.ts` bọc bộ nạp trang bằng `dungLaiKhiDoi` (dựng lại mọi trang khi dữ liệu hay plugin đổi).
2. **Tìm kiếm tiếng Việt.** Chạy bộ truy vấn của `../opus-zero/tests/search.mjs` trên Pagefind. Chữ "đ" không phải chữ "d" có dấu nên có thể không khớp khi gõ "dan"; nếu vậy thì thêm bước chuẩn hóa lúc build (ví dụ một trường ẩn chứa chữ đã bỏ dấu, chỉ cho Pagefind đọc).

## 3. Phiên bản và môi trường

- Node 24 trong `.nvmrc` (D1.1): Astro 7.4 cần Node từ 22.23.4; Node 24 là bản LTS, hỗ trợ đến 30/4/2028 (Node 22 của site cũ hết hỗ trợ 30/4/2027). Node 26 thành LTS ngày 28/10/2026: có thể chuyển ở lần nâng cấp tháng 11. Python 3.12 cho `tools/`.
- Phiên bản đang dùng: `astro` 7.4.2, `@astrojs/starlight` 0.42.7 (D1.1); xem `package.json`.
- Ghim phiên bản chính xác trong `package-lock.json`. Nâng mỗi tháng một lần trên nhánh `moi/nang-cap-<tháng>`, gộp khi mọi kiểm thử đạt.
- abcjs: giữ bản đang dùng trong `../opus-zero/docs/assets/js/vendor/`, chép sang `public/vendor/`.

## 4. Thư mục

```text
astro.config.mjs            # site 'https://mtuann.github.io', base '/opus'
package.json, package-lock.json, tsconfig.json
src/content.config.ts       # schema frontmatter và năm bộ dữ liệu
src/du-lieu.mjs             # schema, bộ nạp và kiểm chéo của năm bộ dữ liệu (content.config.ts dùng)
src/nhom.mjs                # nhóm nội dung của menu: tên, mô tả, biểu tượng; trang nào thuộc nhóm nào
src/kiem-dinh.mjs           # trạng thái kiểm định của trang (đọc kiem-dinh/), cho huy hiệu "Đã kiểm định"
src/khoa.mjs                # mã băm, đọc và kiểm kiem-dinh/khoa.json, bản build đang dựng (thật hay xem)
src/ban-build.mjs           # trang nào có trong bản build (cho link "sắp có"); bản thật bỏ trang chưa khóa
src/content/docs/           # trang; cùng đường dẫn với ../opus-zero/docs/
src/data/                   # cap-do.yml, tac-pham.yml, nha-soan-nhac.yml, thuat-ngu.yml, trang.yml
src/components/             # thành phần Astro
src/plugins/                # plugin Markdown của dự án (chỉ thị, khối abc, link "sắp có")
src/pages/                  # trang sinh: chặng, danh mục tác phẩm, sách in
src/scripts/                # module JavaScript chuyển từ ../opus-zero/docs/assets/js/
src/styles/
public/                     # font, abcjs, biểu tượng, mẫu âm piano (lô D3-L1), bản thu (đợt 6), sw.js
tests/                      # kiểm thử site mới
kiem-dinh/                  # hồ sơ kiểm định, khoa.json (không đăng lên site)
tools/chuyen/               # script chuyển cú pháp
tools/du_lieu/              # script tách dữ liệu một lần
tools/khoa.mjs              # hồ sơ mẫu, khóa, tính, mở khóa, xuất nhận định cho lượt 2
tools/khuong-nhac.mjs       # kiểm khối ```abc: cảnh báo của abcjs, độ dài ô nhịp
tools/may-chu.mjs           # máy chủ tĩnh cho kiểm thử trình duyệt và Lighthouse (HTTP/2 như GitHub Pages)
tools/lighthouse/kiem.mjs   # đo Lighthouse, kiểm luật 7
tools/audio/                # chép từ ../opus-zero/tools/audio/ ở đợt 6
plans/                      # kế hoạch, báo cáo
.github/workflows/          # deploy.yml, test.yml (từ D1.7)
.github/actions/kiem-thu/   # các bước build và kiểm thử dùng chung cho hai workflow
AGENTS.md, CLAUDE.md, README.md, LICENSE, LICENSE-CONTENT, .nvmrc, .gitignore

# git bỏ qua: dist/, .astro/, .cache/, node_modules/, .claude/
```

Site cũ nằm ở thư mục cạnh `../opus-zero/` (repo cũ, chỉ đọc). Máy khác: `git clone https://github.com/mtuann/opus-zero.git ../opus-zero`.

## 5. Nội dung trong trang

- Trang vẫn là Markdown (`.md`), không dùng MDX trừ khi một trang thật sự cần.
- Thành phần riêng viết bằng chỉ thị ngắn, plugin của dự án đổi thành HTML lúc build. Cú pháp chốt ở D1.3 và ghi vào `AGENTS.md`; ví dụ `::khoi-nghe` (đọc bản thu từ bản ghi của trang), `::hinh-cau-truc`, `::hoc-tiep`.
- Thông tin tác phẩm (hộp thông tin, chip cấp độ) không viết trong trang; trang chỉ khai báo `tac_pham: <slug>` ở frontmatter.
- Trạng thái kiểm định không ghi vào trang: huy hiệu đọc từ `kiem-dinh/` lúc build.
- Khối ```abc giữ nguyên cú pháp như site cũ. Link nội bộ viết địa chỉ trên site, có base (`/opus/piano/gam/#muc`), thay link tới file `.md` của MkDocs; id của tiêu đề theo kiểu site cũ để link `#mục` cũ vẫn đúng (D1.4; `AGENTS.md`, mục "Link nội bộ").
- Trang chuyển từ site cũ bằng `tools/chuyen/chuyen.mjs`; `tools/chuyen/so-chu.mjs` so chữ hiển thị với bản build cũ (D1.4).

## 6. Thành phần và nguồn chuyển

| Thành phần | Lấy từ site cũ |
|---|---|
| Khuông nhạc ABC, vẽ khi gần màn hình và khi in | `../opus-zero/docs/assets/js/abc.js`, `loader.js`, `print.js` |
| Khối nghe có mốc tham khảo | `listen.js` |
| Hình cấu trúc | `../opus-zero/tools/figures.py` (thông số chuyển vào bản ghi) |
| Câu hỏi kiểm tra nhanh | `quiz.js` |
| Bàn phím, hóa biểu, vòng quãng năm, máy đếm nhịp | `piano.js`, `theory.js`, `circle.js`, `metronome.js`; âm thanh dùng chung `audio.js` và mẫu âm `../opus-zero/docs/assets/samples/piano/` (CC BY 3.0), chép ở lô đầu tiên có bàn phím (D3-L1) |
| Kế hoạch tập, nhật ký, dữ liệu học | `practice.js`, `plan.js`, `journal.js`, `data.js` |
| Kiểm tra đầu vào | `placement.js` |
| Các công cụ luyện tập khác | các module còn lại trong `../opus-zero/docs/assets/js/` |
| Sách in | `../opus-zero/hooks/books.py` |
| Chuyển hướng | `../opus-zero/hooks/redirects.py` |
| Font, màu, CSS | `../opus-zero/docs/assets/`, `../opus-zero/overrides/` |

## 7. Bản thật và bản xem

| | Bản thật | Bản xem |
|---|---|---|
| Lệnh | `npm run build` | `npm run build:xem` |
| Gồm | trang đã khóa và trang sinh từ dữ liệu | mọi trang trong `src/content/docs/`, kể cả chưa khóa |
| Trang chưa khóa | không có; link tới nó hiện "sắp có" | có, với dải "Chưa kiểm định" ở đầu trang |
| Trang đã khóa mà mã băm lệch | build hỏng | build hỏng |
| Dùng cho | deploy từ `main` | review lô, ảnh chụp, kiểm thử trên nhánh |
| Đăng lên mạng | có | không |

Cách làm (D1.6):

- **Chọn bản:** biến môi trường `OPUS_BAN=xem` là bản xem (`npm run build:xem`, `npm run dev`); không có biến là bản thật (`ban()` trong `src/khoa.mjs`).
- **Lọc ở bộ nạp:** `locTheoBan` (`src/ban-build.mjs`) bọc bộ nạp trang của Starlight. Ở bản thật, nạp xong thì xóa khỏi bộ `docs` mọi trang không có trong `kiem-dinh/khoa.json`, nên Starlight không biết trang đó: không dựng, không đưa vào menu, nút Trước và Tiếp, tìm kiếm, sitemap. Không dùng `draft` của Starlight, vì phải ghi vào frontmatter, làm đổi mã băm của trang.
- **Khóa từng phần bản ghi:** khóa `du-lieu/<bộ>/<id>#<trường>,…` chỉ băm các trường đã khai (tên trường phải có trong schema của bộ); trường khác sửa tự do. Khóa cả bản ghi, hay khóa nhiều trường hơn, thay các khóa từng phần cũ của bản ghi, khi các khóa cũ vẫn khớp.
- **Không khóa đè:** mục đang khóa thì `khoa` và `mau` từ chối; muốn sửa thì `mo` (ghi lý do vào hồ sơ, thêm lần kiểm định mới), sửa, rồi khóa lại. Trên nhánh lô, kiểm thử phạm vi chặn việc đổi hay gỡ khóa bản ghi đã có ở `main`.
- **Kiểm khóa lúc nạp cấu hình:** `src/content.config.ts` gọi `kiemKhoa()`. Trang hay bản ghi đã khóa mà mã băm lệch, hay không còn, thì build hỏng ở cả hai bản; thông báo kèm lệnh mở khóa.
- **Dải "Chưa kiểm định":** `src/components/Banner.astro` thay thành phần Banner của Starlight; chỉ hiện ở bản xem, ở trang chưa khóa, đầu phần nội dung.
- **Link "sắp có"** (D1.5) đọc danh sách trang từ `trangTrongBan()`, nên ở bản thật link tới trang chưa khóa cũng hiện "sắp có".
- **Công cụ khóa viết bằng Node** (`tools/khoa.mjs`), không phải Python như kế hoạch ban đầu (`tools/khoa.py`). Lý do: mã băm của trang và JSON chuẩn của bản ghi chỉ có một chỗ tính (`src/khoa.mjs`), dùng chung cho bản build và công cụ. Hai bản tính ở hai ngôn ngữ dễ lệch nhau (cách viết số, thoát ký tự Unicode trong JSON).

## 8. Deploy

- **Đến D1.7:** chưa đăng gì. Repo mới có trên GitHub từ đợt 0 nhưng chưa bật Pages.
- **Từ D1.7:** Pages của repo mới đã bật, nguồn GitHub Actions. `deploy.yml` build bản thật, chạy kiểm thử (`npm test`, kiểm thử trình duyệt, Lighthouse), rồi đăng `dist/` bằng `upload-pages-artifact`, `deploy-pages` (không cần `configure-pages`: Astro đã có `site` và `base`). Kiểm thử hỏng thì site giữ bản trước. `test.yml` chạy bản xem và các kiểm thử ấy trên nhánh `moi/**`, `mo/**`, `them/**` và pull request, không đăng. Hai workflow dùng chung `.github/actions/kiem-thu/`.
- **Site cũ:** bạn tắt Pages của repo cũ khi muốn (Settings → Pages → Unpublish site). Không cần sửa gì trong repo cũ. Service worker của site cũ chỉ có phạm vi `/opus-zero/`, nên không đụng tới site mới ở `/opus/`.
- **Service worker của site mới:** chưa có cho đến đợt 7; khi có, phạm vi `/opus/`, danh sách tệp và phiên bản sinh lúc build.
- **Tùy chọn, không bắt buộc:** muốn người vào địa chỉ cũ tìm được site mới thì đăng lại Pages của repo cũ chỉ với một trang chuyển hướng `/opus-zero/<trang>/` → `/opus/<trang>/`. Đường dẫn giữ nguyên (luật 4) nên ánh xạ chỉ là đổi phần đầu địa chỉ.
- Không có noindex trên site mới. Sitemap tự sinh, chỉ có trang của bản thật.

## 9. Kiểm thử site mới

| Kiểm thử | Ở site mới | Thay cho (trong `../opus-zero/`) |
|---|---|---|
| Schema dữ liệu và frontmatter lúc build | `src/content.config.ts`, `tests/du-lieu.test.mjs` | `tests/levels.py`, `tests/counts.py` |
| Khóa: mã băm trang và bản ghi | `tests/khoa.test.mjs` | (mới) |
| Phạm vi lô | `tests/pham-vi.test.mjs` | (mới) |
| Link và anchor nội bộ, link "sắp có" | `tests/link.test.mjs` | `tests/anchors.py`, phần link của `tests/site_static.py` |
| Khuông nhạc: cảnh báo ABC, đủ phách | `tests/khuong-nhac.test.mjs` (`tools/khuong-nhac.mjs`) | `tests/abc_warn.mjs`, `tests/abc_bars.py` |
| Trợ năng trên các trang mẫu | `tests/trinh-duyet/kiem-tro-nang.mjs` (axe trên trình duyệt thật) | `tests/a11y.mjs` |
| Trình duyệt: hiển thị, công cụ khởi tạo, in | `tests/trinh-duyet/kiem-hien-thi.mjs`, `kiem-thanh-phan.mjs`; ngoại tuyến từ đợt 7 | `tests/browser.mjs` |
| Tìm kiếm: bộ truy vấn chuẩn, gõ không dấu cả chữ "đ" | `tests/trinh-duyet/kiem-tim-kiem.mjs`, `tests/tim-kiem.test.mjs` | `tests/search.mjs` |
| Lighthouse ở ba trang | `tools/lighthouse/kiem.mjs` | `tools/lighthouse/` |
| Bản thu và mốc (từ đợt 6) | | `tools/audio/check_audio.py` (vẫn ở gốc, đổi đường dẫn) |

`npm test` chạy các file `tests/*.test.mjs`; kiểm thử trình duyệt và Lighthouse chạy riêng (`npm run test:trinh-duyet`, `npm run lighthouse`). CI chạy cả ba (mục 8).

## Nguồn

- Material for MkDocs vào chế độ bảo trì: https://github.com/squidfunk/mkdocs-material/issues/8523 và https://discuss.privacyguides.net/t/mkdocs-material-is-now-in-maintenance-mode/32736
- Zensical, câu hỏi thường gặp: https://zensical.org/docs/community/faqs/ ; bản 0.0.58: https://newreleases.io/project/pypi/zensical/release/0.0.58
- Astro 7 và Starlight 0.41: https://astro.build/blog/whats-new-june-2026/
- Nâng cấp lên Astro 7 (Sätteri, trình biên dịch Rust): https://docs.astro.build/it/guides/upgrade-to/v7/
- Sätteri: https://docs.astro.build/fr/reference/markdown-processors/satteri/ và https://infoq.com/news/2026/08/astro-satteri-rust
- Cloudflare mua Astro: https://gigazine.net/gsc_news/en/20260119-cloudflare-acquires-astro
- Starlight, tìm kiếm Pagefind: https://starlight.astro.build/guides/site-search ; mở rộng frontmatter: https://starlight.astro.build/reference/frontmatter/
- Pagefind, tùy chọn dấu: https://unreleased.pagefind.app/docs/search-config
