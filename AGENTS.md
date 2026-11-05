# Sổ tay cho agent: Opus (repo opus)

Opus (bản trước tên Opus Zero) là sổ tay tiếng Việt học piano cổ điển cho người lớn tự học, đang được làm lại trong repo này (`mtuann/opus`, site ở https://mtuann.github.io/opus/). Kế hoạch hiện hành: `plans/lam-lai/README.md`; khi sổ tay này khác kế hoạch thì kế hoạch đúng. Người mới đọc `plans/lam-lai/giao-viec.md`.

## Site cũ

Site cũ (MkDocs, repo `mtuann/opus-zero`, bản v15) ở thư mục cạnh `../opus-zero/`. Chỉ đọc: không sửa, commit hay push gì ở đó. Máy khác: `git clone https://github.com/mtuann/opus-zero.git ../opus-zero`.

Các mục **Cách làm việc**, **Quy tắc nội dung**, **Bản quyền**, **Quy ước ABC** trong `../opus-zero/AGENTS.md` vẫn áp dụng cho site mới, trừ phần gắn với MkDocs (hộp `!!!`, link tới file `.md`, id do MkDocs sinh, đường dẫn `docs/assets/...`, tên kiểm thử cũ): cú pháp mới chốt ở đợt 1 (D1.3–D1.5) và ghi vào đây. Nhánh và báo cáo theo mục "Quy tắc chung" của kế hoạch.

## Mạng

Không đưa email hay thông tin cá nhân của chủ repo vào yêu cầu gửi ra ngoài (header User-Agent, tham số, nội dung). Dịch vụ nào đòi thông tin liên hệ thì dùng `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`. Nguồn hay bị chặn và cách vòng: `plans/ben-vung/chuan-kiem-dinh.md`, mục "Nguồn và cách mở". Lời giao việc mẫu cho agent: `plans/lam-lai/loi-giao/`.

## Thư mục

Như `plans/lam-lai/cong-nghe.md` mục 4.

## Lệnh

Node theo `.nvmrc` (24, bản LTS; Astro 7.4 cần Node từ 22.23.4). Phiên bản gói ghim chính xác trong `package.json` và `package-lock.json`; nâng theo `plans/lam-lai/cong-nghe.md` mục 3.

```bash
npm ci            # cài đúng các gói trong package-lock.json
npm run dev       # máy chủ thử (bản xem), tự tải lại khi sửa: http://localhost:4321/opus/ (tìm kiếm chỉ chạy ở bản build)
npm run build     # bản thật vào dist/: chỉ trang đã khóa; deploy dùng bản này
npm run build:xem # bản xem vào dist/: thêm trang chưa khóa, có dải "Chưa kiểm định"; không đăng
npm run preview   # xem dist/ vừa build: http://localhost:4321/opus/
npm test          # kiểm thử trên dist/: chạy sau npm run build hay npm run build:xem
npm run test:trinh-duyet  # kiểm thử trình duyệt trên trang mẫu của dist/: ba trình duyệt, ba cỡ màn hình, axe, thành phần
npm run lighthouse        # Lighthouse ở tối đa ba trang mẫu của dist/, kiểm luật 7 của kế hoạch
```

- Kiểm thử ở `tests/*.test.mjs`, chạy bằng trình kiểm thử có sẵn của Node (`node --test`). Thêm kiểm thử thì thêm file `tests/<tên>.test.mjs`.
- Kiểm thử trình duyệt ở `tests/trinh-duyet/kiem-*.mjs` (Playwright), không nằm trong `npm test`. Chờ điều kiện (khối dựng xong, `document.fonts.ready`, hai khung hình), không chờ cố định: chờ cố định đã làm CI chập chờn trên WebKit ở máy GitHub. Lần đầu cài trình duyệt: `npx playwright install chromium webkit firefox`. Phép thử nào cần trang có khối (khuông nhạc, câu hỏi) mà bản build chưa có thì tự bỏ qua.
- Khuông nhạc: `npm test` kiểm mọi khối ```` ```abc ```` trong `src/content/docs/` (abcjs không cảnh báo, ô nhịp đủ độ dài). Xem chi tiết: `node tools/khuong-nhac.mjs`.
- Trang mới chuyển chưa khóa nên chỉ có ở bản xem: xem và kiểm bằng `npm run build:xem`, không phải `npm run build`.
- `tools/du_lieu/` dùng Python 3.12: `python3 -m pip install -r requirements.txt`. `tools/chuyen/` và `tools/khoa.mjs` chạy bằng Node.
- Chỉ thị trong trang (`::hop-tac-pham`…) lấy chữ từ `src/data/` lúc dựng trang. `npm run build` tự dựng lại mọi trang khi dữ liệu hay plugin Markdown đổi (`dungLaiKhiDoi` trong `src/du-lieu.mjs`); đang chạy `npm run dev` mà sửa `src/data/`, hay thêm, xóa trang (link "sắp có" chỉ tính lại khi trang được dựng lại), thì khởi động lại `npm run dev` để thấy thay đổi.

## Dữ liệu

- Năm bộ dữ liệu YAML trong `src/data/`: `cap-do.yml` (7 chặng), `tac-pham.yml`, `nha-soan-nhac.yml` (mọi người có năm sinh–mất trên site), `thuat-ngu.yml`, `trang.yml` (tầng của mọi trang). Trường, kiểu và các phép kiểm chéo: `src/du-lieu.mjs`; trong code Astro đọc bằng `getCollection('tac-pham')`…
- Thông tin dùng ở nhiều trang (chặng, Grade, năm sinh–mất, số danh mục, danh sách tác phẩm) lấy từ dữ liệu, không viết tay. Trang tác phẩm chỉ khai `tac_pham: <slug>` ở frontmatter; trang chính của mỗi bản ghi, và trang `cap` dùng chung bản ghi, phải khai đúng (`tests/du-lieu.test.mjs`).
- Trang chỉ hiện trường đã khóa. Chỉ thị trong trang đã khóa đọc bản ghi qua `chiDaKhoa` (`src/du-lieu.mjs`). Đọc một trường chưa khóa, kể cả trường bản ghi chưa có, thì build hỏng, lỗi ghi `du-lieu/<bộ>/<id>#<trường>`. Trang luôn đăng mà lấy dữ liệu bằng code Astro (trang chặng, ô gợi ý tập) cũng phải đọc qua `chiDaKhoa`.
- Một tác phẩm, một bản ghi. Trang chính của bản ghi là `piano/tac-pham/<slug>` (`loai: bai-hoc`) hay `nghe-nhac/<slug>` (`loai: nghe`). Trường `cap` có hai nghĩa:
  - trang `cap` không có bản ghi riêng: trang đó viết về đúng tác phẩm này và dùng chung bản ghi;
  - trang `cap` có bản ghi riêng (tác phẩm lớn hơn, như *Kinderszenen* của *Träumerei*): hai bản ghi trỏ `cap` sang nhau.
- Dữ liệu sai (YAML hỏng, sai kiểu, trường lạ, trùng id, tham chiếu tới thứ không có) thì build hỏng. Thử: `OPUS_DU_LIEU=tests/du-lieu-hong npm run build`.
- Bản ghi tác phẩm có thể có `hinh` (sơ đồ các đoạn, theo loại trang `bai-hoc`, `nghe`) và `ban_thu` (bản thu gợi ý cho khối nghe, cùng dạng `data-rec` của site cũ: `by`, `lic`, `licUrl`, `note`, `page`, `parts`; file mp3 của site viết `audio/x.mp3`). Mốc tham khảo theo bảng "Theo dõi khi nghe" của từng trang nên nằm trong trang (`::khoi-nghe{moc="…"}`), không ở dữ liệu.
- `tools/du_lieu/tach.py` tách dữ liệu từ site cũ (D1.2; D1.3 thêm `hinh`, D1.4 thêm `ban_thu`); `src/data/` đã có dữ liệu thì phải thêm cờ `--ghi-de`, và chỉ chạy lại khi dữ liệu chưa kiểm định. Từ đợt 2, sửa `src/data/` bằng tay, theo hồ sơ kiểm định.

## Tìm kiếm

- Pagefind (Starlight) bỏ dấu khi so: gõ "lam lai" ra "làm lại". Chữ "đ" là chữ riêng, nên lúc build `src/tim-kiem/tich-hop.mjs` bọc `dist/pagefind/pagefind.js`: mỗi từ bắt đầu bằng "d" được tìm thêm bản "đ" (tối đa 3 từ như vậy, tức 8 biến thể), rồi gộp kết quả. Gõ "dan" ra "đàn", "do truong" ra "Đô trưởng". Phần bọc ở `src/tim-kiem/boc.js`.
- Trước khi bọc, `tich-hop.mjs` kiểm chỉ mục: `pagefind-entry.json` phải đọc được và không file nào rỗng. Starlight đóng Pagefind ngay khi Pagefind báo đã ghi xong, nên có lần file nằm lại rỗng; khi đó ô tìm kiếm báo "Failed to load Pagefind metadata". Thiếu thì build dựng lại chỉ mục, tối đa 2 lần; vẫn thiếu thì build hỏng.
- Kiểm thử: `tests/tim-kiem.test.mjs` (biến thể, bản build có bản bọc); `tests/trinh-duyet/kiem-tim-kiem.mjs` (bộ truy vấn của site cũ trên trang có trong bản build; gõ "dan" qua API, và qua ô tìm kiếm trên Chromium, WebKit, Firefox).

## CI và đăng site

- `.github/workflows/test.yml`: nhánh `moi/**`, `mo/**`, `them/**`, pull request, hay bấm chạy tay. Build bản xem; sáu job chạy song song: `npm test`, kiểm thử trình duyệt trên chromium, webkit, firefox (mỗi trình duyệt một job), Lighthouse, ảnh chụp. Không đăng gì.
- `.github/workflows/deploy.yml`: mỗi lần push lên `main`. Build bản thật, `npm test`, rồi bốn job song song như trên (ba trình duyệt và Lighthouse); commit đã qua `test.yml` ở nhánh (gộp fast-forward) thì chỉ chạy chromium và Lighthouse, vì bản thật dựng khác bản xem ("sắp có", nút ẩn). Đạt hết thì đăng `dist/` lên GitHub Pages. Hỏng bước nào thì không đăng, site giữ bản trước. Push chỉ đổi `plans/`, `AGENTS.md`, `README.md`, giấy phép thì không chạy.
- `test.yml` (job `anh-chup`) chụp ảnh các trang nhánh đã đổi và trang mẫu, ở 360 và 1280 px (`tools/chup-anh.mjs`), lưu thành tệp `anh-chup` của lần chạy, giữ 7 ngày; bước này hỏng thì không làm hỏng lần chạy. Tải về: `gh run download <số lần chạy> -n anh-chup`. Báo cáo của lô chỉ giữ tối đa 4 ảnh tiêu biểu.
- Hai workflow dùng chung các bước ở `.github/actions/kiem-thu/action.yml`; job build và kiểm thử dừng sau 30 phút, job đăng sau 15 phút. Hỏng thì JSON của Lighthouse được tải lên lần chạy (giữ 14 ngày).
- Trên GitHub không có `../opus-zero/` và `.cache/site-cu/`: kiểm thử cần hai thư mục ấy tự bỏ qua (so chữ với site cũ; script chuyển bỏ phép kiểm trang đích ở site cũ). Thử như CI: clone repo vào thư mục không có `opus-zero` cạnh nó, rồi `npm ci`, build, kiểm thử.
- Trang mẫu của kiểm thử trình duyệt và Lighthouse lấy từ bản build (`tools/trang-mau.mjs`): trang chủ, trang 404, trang nhánh đang làm đã đổi so với `main` (tối đa 8, cỡ một lô), rồi mỗi loại khối (khuông nhạc, câu hỏi, khối nghe, hộp tác phẩm, hình, bảng, khối thu gọn, "sắp có", ô "chưa chuyển", bàn phím, hóa biểu, mười lăm hóa biểu, vòng quãng năm tĩnh và bấm được, luyện hóa biểu) một trang. Thành phần mới thì thêm loại khối vào `KHOI` của file ấy. Thêm trang: `OPUS_TRANG="piano/gam/,nhac-ly/" npm run test:trinh-duyet`. Chỉ một trình duyệt: `OPUS_TRINH_DUYET=webkit npm run test:trinh-duyet`; phép thử chỉ chạy trên Chromium (axe, in, API tìm kiếm) bỏ qua khi không có chromium (`khongChromium` trong `tests/trinh-duyet/chung.mjs`). Lighthouse đo trang chủ và hai trang mẫu đầu; chọn trang khác bằng `LH_TRANG`.
- Máy chủ tĩnh của kiểm thử: `tools/may-chu.mjs` (chỉ nghe 127.0.0.1, có Range như GitHub Pages); chạy riêng: `node tools/may-chu.mjs dist 4400 [--http2]`.

## Review và gộp

Ba mức theo rủi ro (chủ repo chọn ngày 24/10/2026); bảng đủ ở `plans/lam-lai/README.md`, mục "Ba mức review". Nhánh có sửa ở nhiều mức thì theo mức cao nhất.

- **Nhỏ** (chữ trong kế hoạch, báo cáo, tài liệu; một link; config một dòng; sửa đã có kiểm thử bắt): `npm run build`, `npm test`; không review; gộp khi `test.yml` đạt.
- **Vừa** (thành phần, CSS, plugin, script): kiểm thử liên quan; Haiku hay Sonnet chỉ đọc diff; gộp khi CI đạt và review không có chỗ phải sửa.
- **Lớn** (công cụ khóa, dữ liệu dùng chung, workflow deploy, lọc HTML hay link): chạy đủ; Sonnet hay Opus review, có vòng kiểm lại.
- Gom sửa nhỏ vào một nhánh. Sửa theo review mà nhỏ và có kiểm thử kèm thì để CI kiểm lại. Lượt 2 kiểm định nội dung của lô vẫn giữ.

## Khóa

- Trang và bản ghi dữ liệu lên site thật khi đã khóa: mã băm trong `kiem-dinh/khoa.json`, hồ sơ kiểm định trong `kiem-dinh/<trang>.yml` hay `kiem-dinh/du-lieu/<bộ>/<id>.yml` (`plans/ben-vung/chuan-kiem-dinh.md` mục 5–7). Trang hay bản ghi đã khóa mà đổi thì build hỏng, ở cả hai bản; sửa theo thủ tục mở khóa.
- Công cụ `tools/khoa.mjs`; mã băm tính ở `src/khoa.mjs`, dùng chung với bản build. `<mục>` là trang (`nhac-ly/10-hop-am-ba`, `index`) hay bản ghi (`du-lieu/tac-pham/fur-elise`). Khóa từng phần bản ghi, chỉ các trường đã kiểm định: `du-lieu/tac-pham/fur-elise#chang,danh_muc,tac_gia,ten` (tên trường phải có trong schema của bộ); khóa cả bản ghi, hay khóa nhiều trường hơn, thay các khóa từng phần cũ của nó khi chúng còn khớp.

```bash
node tools/khoa.mjs mau <mục>               # tạo hồ sơ mẫu; bản ghi đang khóa từng phần thì thêm lần kiểm định mới
node tools/khoa.mjs khoa <mục>              # kiểm hồ sơ đủ, ghi mã băm vào khoa.json và vào lần cuối của lan
node tools/khoa.mjs tinh                    # kiểm mọi mục đã khóa; lệch thì thoát 1
node tools/khoa.mjs mo <mục> --ly-do "…"    # mở khóa: ghi lý do, thêm một lần mới vào lan để điền
node tools/khoa.mjs xuat D3-L2 [--mau 5]    # nhận định của lô cho lượt 2 (trang Đọc thêm: 5 nhận định ngẫu nhiên mỗi trang; --mau: mẫu cho chủ repo kiểm)
node tools/khoa.mjs nhap <file lượt 2>      # đưa kết quả lượt 2 vào hồ sơ; in nhận định cần review
```

- Câu nói về chính site (loại `ve-site`): review kiểm trên trang và dữ liệu, ghi `review: dung` hay `sai`; `ghi_chu` ghi đã kiểm ở đâu; không kèm nguồn ngoài; không qua lượt 2; không có ở hồ sơ bản ghi dữ liệu. Lời khuyên tập: lượt 2 chỉ kiểm mẫu 3 câu mỗi trang. `xuat` tự bỏ và tự lấy mẫu như vậy. Sau khi nhập kết quả, `xuat … --con-lai` xuất phần còn thiếu, như khi mẫu có câu sai thì phải kiểm mọi câu còn lại. Chi tiết: `plans/ben-vung/chuan-kiem-dinh.md` mục 1 và 3.
- Khóa được khi mọi nhận định đã qua đủ lượt theo tầng (`plans/ben-vung/chuan-kiem-dinh.md` mục 3: trang Đọc thêm chỉ cần lượt 2 cho khoảng 5 nhận định mẫu) và có kết quả, chỗ sửa hay bỏ có ghi chú, chỗ hai lượt khác nhau đã giải quyết, mọi khuông nhạc (khối `abc`) đã kiểm, và lần cuối trong `lan` ghi đủ người (`luot_1`, `luot_2`, `review`, `kiem_mau`). Hồ sơ không có nhận định chỉ khóa được ở trang khung, hay khi có `ghi_chu` giải thích.
- Mục đang khóa thì `khoa` và `mau` từ chối: muốn sửa thì `mo` trước (ghi lý do), không khóa đè. Riêng bản ghi đang khóa từng phần: `mau` thêm lần kiểm định mới để khóa thêm trường hay khóa cả bản ghi, khi các khóa cũ còn khớp.
- Trang viết `.md` (không `.mdx`), không có khoảng trắng cuối dòng (mã băm bỏ qua chúng; ngắt dòng cứng viết `<br>`), khối khuông nhạc mở bằng ` ```abc ` ở đầu dòng (cách công cụ đếm khuông cho hồ sơ). `tests/khoa.test.mjs` chặn.
- `npm run dev` chỉ kiểm khóa lúc khởi động: sửa trang đã khóa khi dev đang chạy thì không bị chặn ngay; `npm run build` mới chặn.
- Trên nhánh lô `moi/d<đợt>-l<lô>`, `tests/pham-vi.test.mjs` so với `main` (cần nhánh `main` hay `origin/main`): file ngoài phạm vi của lô (kế hoạch, mục "Quy tắc chung"; trang của lô theo `plans/lam-lai/anh-xa.md`), hồ sơ của trang ngoài lô bị sửa, trang của lô khác bị khóa hay mở khóa, khóa bản ghi đã có ở `main` bị đổi hay gỡ thì kiểm thử hỏng. Việc kế hoạch giao riêng cho một lô (như trang sinh từ dữ liệu ở D2-L1) ghi trong `THEM` của file kiểm thử đó.

## Giao diện

Chủ repo yêu cầu (23/10/2026): site gọn, thân thiện. Điều gì giải thích được bằng hình hay sơ đồ thì vẽ hình, vì dễ nhớ hơn chữ.

- Hình và sơ đồ vẽ bằng SVG hoặc HTML và CSS ngay trong trang, theo màu của site (`src/styles/opus.css`), có bản sáng và tối. Chữ trong sơ đồ là chữ thật, để máy đọc màn hình đọc được và tìm kiếm thấy. Hình chỉ để trang trí thì đặt `aria-hidden`.
- Mọi trang và thành phần phải hiển thị tốt ở 360 px, 768 px và 1280 px, trên Chromium, WebKit (Safari) và Firefox: không tràn ngang; trên màn hình cảm ứng, vùng bấm từ 44 px. Ngoại lệ (chủ repo chấp nhận ở D3-L1): phím đen của bàn phím từ 24 px, vì hình dạng bàn phím là chính thông tin (WCAG 2.5.8); `kiem-hien-thi.mjs` miễn, `kiem-ban-phim.mjs` vẫn đòi 24 px.
- Không lùi chuẩn Lighthouse ở luật 7 của kế hoạch.
- Bố cục (D1.2b): thanh trên nền giấy (chế độ tối: nền trang), viền 2 px màu nhựa thông; dải màu mực chỉ ở phần đầu trang có `hero`: trang chủ và trang 404 (`src/content/docs/404.md`), dựng bằng `src/components/Hero.astro`.
- Mỗi nhóm nội dung của menu có một màu và một biểu tượng: tên, mô tả, biểu tượng và trang nào thuộc nhóm nào ở `src/nhom.mjs`; màu là biến `--oz-c-<id nhóm>` trong `src/styles/opus.css`, có bản sáng và tối. Màu nhóm hiện ở nhãn trên tiêu đề trang (`src/components/PageTitle.astro`) và thẻ nhóm ở trang chủ. Thêm hay đổi nhóm thì sửa `src/nhom.mjs`, màu trong `opus.css` và thẻ trong `src/content/docs/index.md`; `tests/giao-dien.test.mjs` bắt chỗ thiếu, chỗ lệch và màu chữ dưới 4,5:1.
- Bộ nén CSS của bản build biến `border-image: none` thành `border-image:` (rỗng, trình duyệt bỏ qua): muốn bỏ thì viết thuộc tính con, như `border-image-source: none`. Sửa CSS xong thì xem file trong `dist/_astro/`, đừng chỉ xem mã nguồn.

## Mẫu trang và khối đặc biệt

Chốt ở D1.3. Mọi trang là Markdown trong `src/content/docs/<đường dẫn>.md`. Tiêu đề trang ghi ở frontmatter `title`; Starlight tự đặt nó làm H1, nên thân trang không có dòng `# …`. Nhãn nhóm phía trên tiêu đề và huy hiệu "Đã kiểm định" phía dưới hiện tự động (`src/components/PageTitle.astro`), không ghi gì trong trang.

### Bài học tác phẩm (`piano/tac-pham/<slug>.md`)

```markdown
---
title: "Beethoven: Für Elise, WoO 59"
description: Một câu tóm tắt cho máy tìm kiếm và khi chia sẻ link.
tac_pham: fur-elise
---

Một hai câu mở đầu.

::hop-tac-pham

## Vì sao nên học bài này
```

Thứ tự các mục như mẫu bài học ở `../opus-zero/AGENTS.md` ("Mẫu trang"), với các chỗ đổi sau:

- Hàng chip và hộp thông tin: `::hop-tac-pham`, dựng từ `chip` và `thong_tin` của bản ghi. Không viết tay.
- Cuối mục `## Nghe trước khi tập`: `::khoi-nghe` (hay `::khoi-nghe{moc="…"}`); bảng `## Theo dõi khi nghe` ngay sau, cột đầu mỗi dòng ghi `…`.
- Đầu mục `## Cấu trúc`: `::hinh-cau-truc`.
- Mục `## Học tiếp`: 2–5 bài chọn lọc viết tay như mẫu cũ (gạch đầu dòng, link tới trang có thật), rồi `::hoc-tiep` (trang chặng hiện tại và chặng sau, trang cùng tác phẩm, sinh từ dữ liệu). Danh sách mọi bài của một chặng nằm ở trang chặng, không chép vào từng bài.

### Hướng dẫn nghe (`nghe-nhac/<slug>.md`)

Frontmatter có `tac_pham`. Thứ tự các mục như mẫu ở `../opus-zero/AGENTS.md`. Bảng `| Mục | Thông tin |` đầu trang vẫn viết trong trang. Mục `## Sơ đồ cấu trúc` dùng `::hinh-cau-truc`; mục `## Nghe kèm bản thu` dùng `::khoi-nghe`, bảng `## Theo dõi khi nghe` ngay sau.

### Khối đặc biệt

| Khối | Cách viết | Dựng thành |
|---|---|---|
| Khuông nhạc | Khối ` ```abc ` theo "Quy ước ABC" của `../opus-zero/AGENTS.md`; dòng `T:` ở phần đầu (trước `K:`) thành tiêu đề | Khuông và trình phát (abcjs 6.7.1 trong `public/vendor/`): tốc độ, lặp, nghe từng tay, gõ nhịp, chế độ giá nhạc. Vẽ khi khối tới gần màn hình; trước khi in thì vẽ hết. abcjs tải sẵn lúc trình duyệt rảnh sau khi trang tải xong (Chromium, Firefox: gần như ngay; Safari: sau 3 giây); in sớm hơn thì chỗ khuông chưa vẽ in dòng nhắc |
| Câu hỏi kiểm tra nhanh | Khối ` ```quiz `: dòng `? câu hỏi`, `+ đáp án đúng`, `- đáp án sai`, `> giải thích` | Câu hỏi bấm được, thứ tự lựa chọn trộn mỗi lần, nên lời giải thích không được dựa vào vị trí lựa chọn ("đáp án thứ hai"). Thiếu đáp án đúng hay có dòng lạ thì build hỏng |
| Hộp thông tin tác phẩm | `::hop-tac-pham` | Chip (giọng · nhịp, tốc độ, cấp độ, hình thức) và bảng "Thông tin tác phẩm và bản nhạc nên dùng" thu gọn |
| Hình cấu trúc | `::hinh-cau-truc` | Sơ đồ các đoạn từ `hinh` của bản ghi: `hinh.bai-hoc` ở trang bài học, `hinh.nghe` ở hướng dẫn nghe |
| Khối nghe | `::khoi-nghe`; có mốc tham khảo: `::khoi-nghe{moc="3 61 - 73"}` (số giây cho từng dòng của bảng `## Theo dõi khi nghe`, `-` là dòng chưa có mốc) | Trình nghe kèm bản thu; người học bấm "Ghi mốc" ngay trong bảng `## Theo dõi khi nghe`. Bản thu gợi ý lấy từ `ban_thu` của bản ghi, dùng chung cho bài học và hướng dẫn nghe; mốc tham khảo nằm ở trang vì mỗi trang có bảng riêng. Không có bản thu thì người học tự dán link hay chọn file |
| Học tiếp | `::hoc-tiep` | Link tới trang chặng hiện tại và chặng sau (ở bài học), trang cùng tác phẩm (bài học và hướng dẫn nghe trỏ sang nhau); đặt sau các bài chọn lọc viết tay |
| Hình minh họa | `::hinh{ten="circle"}` (tên như vùng `<!-- fig:… -->` của site cũ) | Hình do thành phần cùng tên vẽ |
| Công cụ luyện tập | `::cong-cu{ten="metronome"}`, thông số thêm như `::cong-cu{ten="piano" range="G3-G4" notes="B3 D4 F#4"}` (tên và thông số như `<div class="oz-tên" data-…>` của site cũ) | Công cụ do thành phần cùng tên dựng |
| Bài kiểm tra đầu vào | Khối ` ```placement ` như site cũ | Công cụ `placement` (đợt 2) |
| Ghi chú, mẹo, chú ý | `:::note`, `:::tip`, `:::caution`, `:::danger`, tiêu đề tùy chọn: `:::tip[Chưa sẵn sàng?]` … `:::` | Aside của Starlight |
| Thu gọn | `<details>`, `<summary>…</summary>`, một dòng trống, nội dung Markdown, một dòng trống, `</details>` | Khối bấm để mở |
| Chú thích cuối trang | `chữ[^1]` … `[^1]: Chú thích.` | Danh sách cuối trang, tách bằng một đường kẻ |
| Id cố định cho tiêu đề | `## Tiêu đề { #id }` | Tiêu đề có id đã chọn (giữ id cũ để link `#mục` cũ còn chạy) |
| Danh sách định nghĩa | Dòng thuật ngữ, rồi dòng `: định nghĩa` | `<dl>` |
| Danh sách việc | `- [ ] việc` (đã làm: `- [x]`) | Ô đánh dấu bấm được, nhãn 44 px, tên đọc được là chữ của việc. Ô đã đánh dấu được nhớ trong trình duyệt, cùng khóa và định dạng với site cũ (`src/plugins/danh-sach-viec.mjs`, `src/scripts/viec.js`) |

- Chỉ thị `::…` đứng một mình trên một dòng, không có chữ, chỉ có thuộc tính ghi trong bảng (`::khoi-nghe` nhận `moc`; `::hinh`, `::cong-cu` cần `ten`; `::cong-cu` nhận thêm thông số của công cụ). Ba chỉ thị `::hop-tac-pham`, `::hinh-cau-truc`, `::hoc-tiep` cần `tac_pham` ở frontmatter; `::hinh-cau-truc` chỉ dùng ở trang bài học hay hướng dẫn nghe, và bản ghi phải có hình cho loại trang đó. Sai, kể cả gõ sai tên chỉ thị, thì build hỏng, lỗi ghi tên file.
- Sau đợt 2 có thêm (D2-L1):
  - `::hinh{ten="lo-trinh"}`: sơ đồ 7 chặng, dựng từ `cap-do.yml`.
  - Công cụ:
    - `placement`: bài kiểm tra nhạc lý; khối ```` ```placement ````, thành phần đọc khối từ nguồn trang;
    - `piano-level`: chọn chặng piano;
    - `goi-y-tap`: mục "Hôm nay tập gì?" ở trang chủ.

    Cả ba lưu trong trình duyệt như site cũ.
  - Link do JavaScript dựng cũng hiện "sắp có" như link dựng lúc build: bản build xuất danh sách trang cho script.
  - Nút của dải mực trỏ tới trang chưa có trong bản build thì tự ẩn.
  - Ảnh chia sẻ: `public/og.png`.
- Sau D3-L1 (bài nhạc lý 1–8):
  - `::cong-cu{ten="piano"}`: bàn phím bấm được. Thông số: `range="C3-C5"` (mặc định `C4-C5`; đầu hay cuối là phím đen thì mở tới phím trắng bên cạnh), `notes="C4 E4 G4"` (phím được tô, phải nằm trong `range`; có `notes` thì có nút "Nghe các nốt được tô"), `play="chord"` (nút nghe phát cùng lúc). Sai hay thông số lạ thì build hỏng (`docThongSoBanPhim`).
  - `::hinh{ten="keysigs"}` (mười lăm hóa biểu), `::hinh{ten="circle"}` (vòng quãng năm tĩnh); `::cong-cu{ten="circle"}` (vòng quãng năm bấm được), `::cong-cu{ten="keysig-quiz"}` (luyện đọc hóa biểu). Bốn chỉ thị này không nhận thông số.
  - Module dùng chung: `src/scripts/nhac-ly.js` (lõi nhạc lý: tên nốt, MIDI, gam, hợp âm, giọng, hóa biểu) và `src/scripts/ve.js` (vẽ SVG: bàn phím, hóa biểu trên khuông, vòng quãng năm) chạy cả lúc build lẫn trên trình duyệt; `src/scripts/am-thanh.js`: âm thanh cho mọi công cụ (mẫu âm piano tải theo vùng, âm tổng hợp khi chưa có mẫu). Công cụ mới phát tiếng thì dùng module này; công cụ dùng micro đặt `navigator.audioSession.type = 'play-and-record'`.
  - Mẫu âm: `public/mau-am/piano/` (Salamander Grand Piano V3, CC BY 3.0, `LICENSE.txt`). Trang có bàn phím hay vòng quãng năm bấm được tự có dòng ghi nguồn ở cuối (`nguonAmPiano`); không viết tay.
  - Phần HTML sinh ra (chữ trong hình, dòng ghi nguồn…) có thuộc tính `data-sinh`: `so-chu.mjs` bỏ phần này khi so với trang cũ. Nhận định `ve-site` nói về chữ sinh ra thì kiểm trên bản xem và trong module dựng nó.
- Sau D3-L2 đến D3-L5 (nhạc lý bài 9–32, âm học, ôn tập, Từ điển):
  - Hình vẽ riêng: `::hinh{ten="functions"}`, `::hinh{ten="modes"}` (`veChucNang`, `veDieuThuc` trong `src/scripts/ve.js`).
  - **Hình tĩnh**: hình cũ (vùng `<!-- fig:tên -->`) chưa cần vẽ lại thì chép nguyên bằng `node src/components/hinh/chuyen-hinh-cu.mjs <tên>` thành `src/components/hinh/<tên>.html`; `::hinh` dùng file này khi không có thành phần riêng (`hinhTinh`). Màu đậm viết cứng thành biến `--oz-h-*` (ba chế độ, `thanh-phan.css`); nền sáng và chữ tối trên nền ấy giữ nguyên. Sửa chữ hay số trong hình thì sửa thẳng file `.html` và ghi ở hồ sơ trang. `tests/hinh-tinh.test.mjs` kiểm.
  - Công cụ âm học `overtones`, `spectrum`, `tuning` (`src/scripts/am-hoc.js`), thẻ ghi nhớ `flashcards` (`src/scripts/the-nho.js`, đọc các bảng có cột đầu "Thuật ngữ" trên trang), trạng thái bài `lesson-status` (`src/scripts/trang-thai-bai.js`; đặt trong khối `<div class="oz-lesson-status">` bọc mục lục như trang `nhac-ly/index`). Không nhận thông số. `am-thanh.js` có thêm `phatTanSo` (sóng sin, răng cưa), `dauRa`, `chuanBiPiano`.
  - `::tu-dien{nhom="<nhóm>"}`: bảng `| Thuật ngữ | Nghĩa | Ghi chú |` dựng từ `src/data/thuat-ngu.yml` theo `nhom`, thứ tự như trong file. Sửa chữ Từ điển là sửa dữ liệu (có hồ sơ bản ghi và `doi_chu` của trang `nhac-ly/tu-dien`).
- Sau D3-L6 (luyện tai): `::cong-cu{ten="interval-trainer"}`, `chord-trainer`, `scale-trainer`, `cadence-trainer` (`src/scripts/luyen-tai.js`; không nhận thông số). Ô dựng sẵn lúc build; tiếng piano qua `am-thanh.js`, chỉ phát khi người học bấm. Lưu kỹ năng `intervals`, `chords`, `scales`, `cadence` và số câu trong ngày ở `opus-zero:v1` như site cũ. `nhac-ly.js` có thêm điệu thức, ngũ cung, hợp âm bảy; `veBanPhim` nhận `to2`, `nhan`; `tien-do.js` có `soHomNay`.
- Sau D5-L1 (lịch sử âm nhạc): dòng thời gian nhà soạn nhạc dựng lúc build từ `src/data/nha-soan-nhac.yml` (`src/scripts/dong-thoi-gian.js`; SVG tĩnh, in được, không cần JavaScript):
  - `::dong-thoi-gian{nguoi="hildegard,bach:J. S. Bach,…"}`: mỗi người một thanh, xếp theo năm sinh, dải nền các thời kỳ, tên và năm cạnh thanh, `<title>` "Tên (sinh–mất), thời kỳ"; người còn sống (`mat: null`) thanh tới năm hiện tại, màu khác; `khoang: true` ghi "khoảng"/"~". `nguoi` là id, thêm `:tên` để hiện một cách viết khác (phải là `ten` hay `cach_viet_khac`). Khung cuộn ngang ở màn hình hẹp.
  - `::bang-nha-soan-nhac` (hay `::bang-nha-soan-nhac{nguoi="…"}`): bảng `| Nhà soạn nhạc | Sinh | Mất | Thời kỳ |` theo thứ tự danh sách, dựng như bảng viết tay (so chữ, tìm kiếm thấy); không ghi `nguoi` thì dùng danh sách của `::dong-thoi-gian` đứng trước trong trang.
  - `::hinh{ten="lifespans"}`: biểu đồ vòng đời từ 1650 (danh sách `NGUOI_VONG_DOI`), dựng từ dữ liệu thay hình tĩnh cũ. Màu thời kỳ (`THOI_KY`) dùng chung cho cả ba hình và hình tĩnh `periods`.
  - Ở trang đã khóa ba chỉ thị chỉ đọc trường đã khóa (`ten, sinh, mat, khoang, thoi_ky`, và `cach_viet_khac` khi đổi tên hiện). Năm sinh–mất viết tay cạnh tên trong các trang `lich-su/` ("Tên (1567–1643)", "(khoảng …)", "(sinh 1935)") phải khớp dữ liệu: `tests/dong-thoi-gian.test.mjs`.
- Sau D5-L3 (nhận diện phong cách): phần còn lại của `recognition.js` cũ (trừ nghe mù `oz-blind`, `oz-blind-log` của trang `nhan-dien/nghe-mu`):
  - `::cong-cu{ten="style-example" id="baroque-1"}`: một trong mười đoạn nhạc ngắn theo đặc trưng thời kỳ (`VI_DU` trong `src/scripts/nhan-dien.js`; id `baroque-1/2`, `classical-1/2`, `romantic-1/2`, `impressionist-1/2`, `modern-1/2`), dựng như khối ```` ```abc ```` (`abc.js` vẽ khuông và trình phát, âm sắc theo `%%MIDI program` của đoạn; đoạn không phải piano có `data-khong-tay`: không có nút nghe từng tay) cùng dòng "Dấu hiệu: …". Chỉ nhận `id`; thiếu, lạ hay thông số khác thì build hỏng.
  - `::cong-cu{ten="style-trainer"}` (đoán thời kỳ, `src/scripts/nhan-dien.js`): ô dựng sẵn; script tải abcjs (`taiAbcjs`, `conTro` của `abc.js`), vẽ khuông ẩn và trình phát của abcjs, chỉ phát khi người học bấm; trả lời đúng thì hiện khuông và dấu hiệu. `::cong-cu{ten="texture-trainer"}` (bốn kết cấu của *Frère Jacques*) nằm trong `CONG_CU_TAI` của `luyen-tai.js` (`phatLaiKhiSai: false`, không có hình phím đàn), tiếng qua `am-thanh.js`. Hai công cụ không nhận thông số. Lưu ở `opus-zero:v1` như site cũ: kỹ năng `style`, `texture`, số câu đúng trong ngày `styles`.
- D7-L1 (9 trang Luyện tập; chốt ở `plans/lam-lai/bao-cao/d7-chuan-bi.md`, lô làm thành phần): chín công cụ mới, tên như lớp cũ bỏ `oz-`, không nhận thông số (thêm vào `KHONG_THONG_SO`; công cụ cũ không đọc `data-*` nào), lớp ngoài cùng như trong `KHOI` của `tools/trang-mau.mjs`:
  - `::cong-cu{ten="midi-status"}` (`oz-midi`): nút "Kết nối đàn MIDI", trạng thái, bật tắt tiếng khi bấm phím. Module chung `src/scripts/midi.js` (từ `midi.js` cũ): phát sự kiện nốt cho mọi công cụ, tự kết nối lại theo `opus-zero:midi-auto`; trình duyệt không có Web MIDI (Safari, iPhone) thì công cụ tự báo, trang không viết tay tên trình duyệt. Kiểm thử trình duyệt giả `navigator.requestMIDIAccess` bằng `addInitScript`, như `tests/browser.mjs` cũ.
  - `piano-explorer` (`oz-tra-phim`, tra hợp âm và gam trên phím, dùng `ganBanPhim`, `veBanPhim`, `nhac-ly.js`), `dictation` (`oz-chep`), `note-reader` (`oz-doc-not`): nhận cả chuột, chạm, bàn phím máy tính và đàn MIDI.
  - `playalong` (`oz-choi-theo`), `singback` (`oz-hat-lai`), `tuner` (`oz-so-cao-do`): dùng micro. Module chung `src/scripts/micro.js`: mở và đóng micro, `audioSession` là `play-and-record` khi micro mở và trả về `playback` khi đóng (`am-thanh.js` đặt `playback` khi phát), một công cụ nghe micro một lúc, đóng khi `pagehide`; tìm cao độ dùng chung với `am-hoc.js` (`tanSoCoBan`, chuyển sang module này). Kiểm thử trình duyệt giả `getUserMedia` bằng luồng từ OscillatorNode (cao độ biết trước), cả trường hợp bị từ chối.
  - `data` (`oz-sao-luu`): xuất và nhập bản sao lưu cùng định dạng với site cũ (`format: "opus-zero-backup"`; `progress`, `settings`, `recordings`), gộp không trùng khi nhập lại; các khóa `opus-zero:v1`, `opus-zero:sound`, `opus-zero:midi-auto`. Phần gộp là hàm thuần trong `src/scripts/sao-luu.js`, có kiểm thử Node với bản xuất từ site cũ. Bản thu (`recordings`, IndexedDB `opus-zero-recordings`) là của công cụ thu âm (D7-L2): D7-L1 giữ nguyên khi nhập, không xóa.
  - `sound-setting` (`oz-chon-am`): chọn mẫu âm piano hay âm tổng hợp, dùng `cheDo`, `datCheDo`, `trangThai` của `am-thanh.js` (giá trị `piano`, `synth` như site cũ).
  - `circle`, `keysig-quiz`, `plan` đã có từ trước.
- D7-L2 (8 trang Luyện tập; chốt ở bước chuẩn bị D7-L2, lô làm thành phần): công cụ mới, tên như lớp cũ bỏ `oz-`, không nhận thông số, lớp ngoài cùng như `KHOI`: `build` (`oz-xay`, `build.js`), `staffpaper` (`oz-giay-khuong`), `worksheet-gen` (`oz-phieu`; năm loại đề như `worksheet.js` cũ: gọi tên nốt khóa Sol, khóa Fa, quãng, hợp âm ba, hóa biểu; hồ sơ `luyen-tap/index` n14), `recorder` (`oz-thu-am`; bản thu ở IndexedDB `opus-zero-recordings`, kho `rec`, như `sao-luu.js` đọc), `rhythm` (`oz-tiet-tau`), `sight` (`oz-thi-tau`), `sight2` (`oz-thi-tau-hai-tay`), `journal` (`oz-nhat-ky`), `skills` (`oz-nang-luc`), `trends` (`oz-tien-bo`). `metronome`, `repertoire`, `midi-status` đã có. Dùng lại module của D7-L1: `midi.js`, `micro.js` (micro cho thu âm và thị tấu: `giuMicro` trước khi mở), `cham-diem.js`, `hinh-so-sanh.js` (thêm dải nhịp gõ, biểu đồ theo tuần), `tien-do.js`. In (giấy kẻ khuông, phiếu bài tập): `@media print` của `thanh-phan.css`, đáp án ẩn khi in. Câu `ve-site` của trang D7-L1 trỏ tới trang của lô này: `grep -rn "luyen-tap/<trang>" kiem-dinh/` (như `thi-tau`, `xay-hop-am` có ô MIDI; báo cáo `d7-l1.md`, mục Còn mở).
- D7-L3 (sách in, blog, Cập nhật, dùng khi mất mạng; chốt ở bước chuẩn bị D7-L3, `plans/lam-lai/bao-cao/d7-chuan-bi.md`; file ngoài phạm vi chung ghi trong `THEM` của `tests/pham-vi.test.mjs`):
  - **Blog**: bài ở `src/content/docs/blog/posts/<yyyy-mm-dd>-<tên>.md` (id như `src/data/trang.yml`), địa chỉ `/opus/blog/posts/<yyyy-mm-dd>-<tên>/`. Frontmatter có `date` (ngày đăng, khai thêm trong `src/content.config.ts`) và `description`. `::danh-sach-bai` (lớp `oz-ds-bai`) ở `blog/index`: bài có trong bản build, mới trước, mỗi bài có tiêu đề (link), ngày và mô tả, dựng lúc build.
  - **Cập nhật**: `::tac-pham-moi` (lớp `oz-tac-pham-moi`): tác phẩm có `them_ngay` mà trang chính có trong bản build, mới trước; ở trang đã khóa chỉ đọc trường đã khóa (`chiDaKhoa`). Chưa có tác phẩm nào thì một dòng nói vậy (trước đợt 6). Các mục còn lại viết tay, kiểm định như mọi nhận định.
  - **Sách in** (`src/sach/`, thay `../opus-zero/hooks/books.py`): bảy cuốn như `BOOKS` cũ, sinh ở `astro:build:done` từ HTML trong `dist/` thành `dist/sach/<id>.html`. Chỉ gồm trang có trong bản build (bản thật: trang đã khóa); chương chưa có thì bỏ, bìa ghi số chương. Như bản cũ: bìa, mục lục, mỗi chương một trang mới, khuông nhạc vẽ bằng abcjs (`public/vendor/`), câu hỏi thành câu hỏi kèm đáp án cuối chương, `<details>` mở sẵn, công cụ bấm được bị bỏ, link thành địa chỉ đầy đủ, id tiêu đề có tiền tố chương. Trang `bat-dau/sach-in` link bằng Markdown: `[Mở sách](/opus/sach/<id>.html)`.
  - **Dùng khi mất mạng** (`src/ung-dung/`): `dist/sw.js` sinh lúc build (phiên bản là mã băm danh sách tệp), phạm vi `/opus/`; trang: lấy mạng trước, mất mạng thì bản đã lưu; tệp tĩnh: lưu trước; bỏ yêu cầu `Range` và âm thanh như `sw.js` cũ. `public/manifest.webmanifest` như manifest cũ (tên Opus), icon 512 và maskable. Script đăng ký chỉ chạy khi `isSecureContext`. Kiểm thử trình duyệt: xem trang rồi tắt mạng (`context.setOffline`), trang mở lại được.
- 7 trang chặng `piano/lo-trinh/chang-1` đến `chang-7` sinh từ dữ liệu ở `src/pages/piano/lo-trinh/[chang].astro`:
  - luôn đăng, cả ở bản thật;
  - không có dải "Chưa kiểm định";
  - mọi chỗ đọc bản ghi đi qua `chiDaKhoa`.

  Menu (thứ tự nhóm `THU_TU`, tên chặng) ở `src/nhom.mjs`. Bản thật không chạy plugin Markdown của dự án cho trang chưa khóa, chỉ áp cho file trong `src/content/docs/` (`chiTrangTrongBan`, `src/ban-build.mjs`).
- Chữ khác trang cũ phải ghi trong `doi_chu` của hồ sơ: mỗi mục có `cu` và/hoặc `moi`, cùng `ly_do`. `tests/chuyen.test.mjs` bắt chỗ đổi chưa ghi và chỗ ghi thừa.
- Chữ trong chip, `thong_tin`, câu hỏi (dòng `?`, `+`, `-`, `>`) và tên tác phẩm là Markdown trong dòng: `*nghiêng*`, `**đậm**`, `[link](/opus/…/)`. Thẻ HTML thô không dùng được: hiện ra thành chữ. Link trong dữ liệu viết như link trong trang (mục "Link nội bộ").
- Hình hay công cụ chưa có thành phần thì hiện ô "… chưa chuyển sang site mới": build vẫn chạy (có cảnh báo `[opus]`) để xem được trang ở bản xem, nhưng trang đã khóa có ô này thì kiểm thử hỏng (`tests/khoa.test.mjs`). Lô đầu tiên chuyển trang dùng hình hay công cụ ấy làm thành phần và thêm vào `HINH`, `CONG_CU` trong `src/plugins/thanh-phan.mjs`.
- Bảng nhiều cột: ở màn hình hẹp, ô tiêu đề mỗi cột giữ độ rộng tối thiểu theo ô dài chữ nhất của cột (`src/plugins/bang-hep.mjs`). Bảng rộng hơn khung thì cuộn ngang trong khung, trang không tràn. Không viết gì thêm trong trang.
- Plugin dựng các khối: `src/plugins/opus-markdown.mjs` (đọc trang) và `src/plugins/thanh-phan.mjs` (dựng HTML). JavaScript của khối nằm ở `src/scripts/` và chỉ tải ở trang có khuông nhạc, câu hỏi hay khối nghe (`src/components/MarkdownContent.astro`). CSS: `src/styles/thanh-phan.css`.
- Tiến độ của người học (bài đã làm hết câu hỏi, mốc nghe) lưu trong trình duyệt ở khóa `opus-zero:v1` như site cũ, nên dữ liệu đã lưu ở site cũ vẫn đọc được.

### Link nội bộ

- Link tới trang viết địa chỉ trên site, có base và `/` ở cuối: `[Gam](/opus/piano/gam/)`, `[…](/opus/piano/gam/#muc)`; trang mục lục là thư mục (`/opus/piano/`); trang chủ `/opus/`. Không viết link tới file `.md`. File tĩnh: `/opus/<đường dẫn trong public/>`.
- Link tới trang chưa có trong bản build (chưa chuyển, hay ở bản thật: chưa khóa) tự thành chữ thường kèm nhãn "sắp có" (`src/plugins/sap-co.mjs`); khi trang lên, link tự hiện lại. Cứ viết link bình thường. Chữ "sắp có" giữ địa chỉ đích (`data-href`).
- Link nội bộ viết bằng Markdown, không viết thẻ `<a>`: chỗ đổi thành "sắp có" chỉ đọc chắc thẻ `<a href="…">` nháy kép, mở và đóng trong cùng một khối HTML. Không đặt link trong tiêu đề: nhãn "sắp có" sẽ lọt vào mục lục bên phải.
- `tests/link.test.mjs` kiểm trên bản build, trong phần nội dung (`<main>`) của mọi trang: link nội bộ (cả link tương đối) tới trang, file và `#mục` có thật; chữ "sắp có" trỏ tới một trang trong kế hoạch (`src/data/trang.yml` cộng 7 trang chặng) mà bản build chưa có, nên link gõ sai hay trang bị bỏ sót khỏi bản build đều bị bắt. Link tới file tĩnh chưa có (như `/opus/audio/NGUON.txt`) thì hỏng: lô đầu tiên link tới file ấy chép nó vào `public/`.
- Id của tiêu đề theo kiểu site cũ (`src/plugins/id-cu.mjs`): bỏ dấu, chữ "đ" mất, ký tự lạ bỏ, trùng thì thêm `_1`, `_2`. Ví dụ `## Trước ngày đầu tiên` có id `truoc-ngay-au-tien`. Nhờ vậy link `#mục` của site cũ, trong site và từ nơi khác, vẫn đúng. Cần id khác thì viết `{ #id }`.

### Chuyển trang từ site cũ

1. Build site cũ ra `.cache/site-cu/` (lệnh ở mục "Quy tắc chung" của kế hoạch).
2. `node tools/chuyen/chuyen.mjs <trang> …`, ví dụ `nhac-ly/10-hop-am-ba` (thêm `--ghi-de` để chuyển lại). Script đổi cú pháp, không đổi chữ, và in cảnh báo cho chỗ không tự quyết. Luật chuyển:
   - `!!!` thành aside: `tip`, `example`, `success` thành `tip`; `note`, `info`, `question` thành `note`; `warning` thành `caution`; `danger` giữ nguyên.
   - `???` thành `<details>`; `++phím++` thành `<kbd>`; HTML có thuộc tính `markdown` thành HTML thường, cách dòng trống.
   - Vùng `<!-- fig:… -->` thành `::hinh-cau-truc` hay `::hinh`; khối `oz-` rỗng thành `::cong-cu`; hộp tác phẩm thành `::hop-tac-pham`.
   - Khối `oz-` bọc nội dung mà JavaScript cũ đọc hay điền (`oz-lesson-status`, `oz-piano-level`): giữ nội dung, thêm `::cong-cu{ten}` (ô "chưa chuyển") và cảnh báo. `oz-print-only` (chỉ hiện khi in) giữ nguyên, site mới có CSS. Lớp `oz-` khác còn trong HTML thô thì cảnh báo; lô của trang thêm CSS hay bỏ lớp.
   - `data-rec` thành `ban_thu` (dữ liệu, đã tách) cộng `moc` (trong trang); link `.md` thành địa chỉ, cả `href` trong HTML thô.
   - Link tới issue của repo cũ (`https://github.com/mtuann/opus-zero/issues`, 4 trang: `tai-lieu-tham-khao`, `tai-nguyen`, `bat-dau/hoi-dap`, một bài blog): giữ nguyên khi repo mới còn riêng tư. Repo cũ công khai nên người đọc vẫn báo lỗi được; link tới repo mới thì ra trang 404 và `tests/khung.test.mjs` chặn. Khi repo mới công khai thì đổi thành `https://github.com/mtuann/opus/issues`.
   - Tiêu đề `#` thành `title` (bỏ định dạng Markdown); mô tả trang lấy thẻ `og:description` của bản build cũ (thẻ `description` cũ bị cắt ở dấu `"`), rỗng hay không có thì cảnh báo.
3. `npm run build:xem`, rồi `node tools/chuyen/so-chu.mjs <trang> …`: chữ hiển thị, mô tả trang, trọn mã ABC của từng khuông, từng câu hỏi (lựa chọn, đáp án đúng, giải thích) và id tiêu đề phải giống trang cũ. `npm test` kiểm lại cho mọi trang đã chuyển, khi máy có `.cache/site-cu/`. Chỗ khác có chủ ý thì ghi vào `doi_chu`: `node tools/chuyen/so-chu.mjs <trang> --doi-chu` in sẵn khung YAML cho các khối khác chưa ghi, chỉ còn điền `ly_do`.
