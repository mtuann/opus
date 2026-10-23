# Sổ tay cho agent: Opus (repo opus)

Opus (bản trước tên Opus Zero) là sổ tay tiếng Việt học piano cổ điển cho người lớn tự học, đang được làm lại trong repo này (`mtuann/opus`, site ở https://mtuann.github.io/opus/). Kế hoạch hiện hành: `plans/lam-lai/README.md`; khi sổ tay này khác kế hoạch thì kế hoạch đúng. Người mới đọc `plans/lam-lai/giao-viec.md`.

## Site cũ

Site cũ (MkDocs, repo `mtuann/opus-zero`, bản v15) ở thư mục cạnh `../opus-zero/`. Chỉ đọc: không sửa, commit hay push gì ở đó. Máy khác: `git clone https://github.com/mtuann/opus-zero.git ../opus-zero`.

Các mục **Cách làm việc**, **Quy tắc nội dung**, **Bản quyền**, **Quy ước ABC** trong `../opus-zero/AGENTS.md` vẫn áp dụng cho site mới, trừ phần gắn với MkDocs (hộp `!!!`, link tới file `.md`, id do MkDocs sinh, đường dẫn `docs/assets/...`, tên kiểm thử cũ): cú pháp mới chốt ở đợt 1 (D1.3–D1.5) và ghi vào đây. Nhánh và báo cáo theo mục "Quy tắc chung" của kế hoạch.

## Thư mục

Như `plans/lam-lai/cong-nghe.md` mục 4.

## Lệnh

Node theo `.nvmrc` (24, bản LTS; Astro 7.4 cần Node từ 22.23.4). Phiên bản gói ghim chính xác trong `package.json` và `package-lock.json`; nâng theo `plans/lam-lai/cong-nghe.md` mục 3.

```bash
npm ci            # cài đúng các gói trong package-lock.json
npm run dev       # máy chủ thử, tự tải lại khi sửa: http://localhost:4321/opus/ (tìm kiếm chỉ chạy ở bản build)
npm run build     # bản thật vào dist/ (từ D1.6: chỉ trang đã khóa)
npm run preview   # xem dist/ vừa build: http://localhost:4321/opus/
npm test          # kiểm thử trên dist/: chạy sau npm run build
```

- Kiểm thử ở `tests/*.test.mjs`, chạy bằng trình kiểm thử có sẵn của Node (`node --test`), không cần gói thêm. Thêm kiểm thử thì thêm file `tests/<tên>.test.mjs`.
- `npm run build:xem` (bản xem, thêm trang chưa khóa) có từ D1.6.
- `tools/` dùng Python 3.12: `python3 -m pip install -r requirements.txt`.
- Chỉ thị trong trang (`::hop-tac-pham`…) lấy chữ từ `src/data/` lúc dựng trang. `npm run build` tự dựng lại mọi trang khi dữ liệu hay plugin Markdown đổi (`dungLaiKhiDoi` trong `src/du-lieu.mjs`); đang chạy `npm run dev` mà sửa `src/data/` thì khởi động lại `npm run dev` để thấy thay đổi.

## Dữ liệu

- Năm bộ dữ liệu YAML trong `src/data/`: `cap-do.yml` (7 chặng), `tac-pham.yml`, `nha-soan-nhac.yml` (mọi người có năm sinh–mất trên site), `thuat-ngu.yml`, `trang.yml` (tầng của mọi trang). Trường, kiểu và các phép kiểm chéo: `src/du-lieu.mjs`; trong code Astro đọc bằng `getCollection('tac-pham')`…
- Thông tin dùng ở nhiều trang (chặng, Grade, năm sinh–mất, số danh mục, danh sách tác phẩm) lấy từ dữ liệu, không viết tay. Trang tác phẩm chỉ khai `tac_pham: <slug>` ở frontmatter.
- Một tác phẩm, một bản ghi. Trang chính của bản ghi là `piano/tac-pham/<slug>` (`loai: bai-hoc`) hay `nghe-nhac/<slug>` (`loai: nghe`). Trường `cap` có hai nghĩa:
  - trang `cap` không có bản ghi riêng: trang đó viết về đúng tác phẩm này và dùng chung bản ghi;
  - trang `cap` có bản ghi riêng (tác phẩm lớn hơn, như *Kinderszenen* của *Träumerei*): hai bản ghi trỏ `cap` sang nhau.
- Dữ liệu sai (YAML hỏng, sai kiểu, trường lạ, trùng id, tham chiếu tới thứ không có) thì build hỏng. Thử: `OPUS_DU_LIEU=tests/du-lieu-hong npm run build`.
- `tools/du_lieu/tach.py` tách dữ liệu từ site cũ, chỉ chạy một lần (D1.2); `src/data/` đã có dữ liệu thì phải thêm cờ `--ghi-de`. Từ đợt 2, sửa `src/data/` bằng tay, theo hồ sơ kiểm định.

## Giao diện

Chủ repo yêu cầu (23/10/2026): site gọn, thân thiện. Điều gì giải thích được bằng hình hay sơ đồ thì vẽ hình, vì dễ nhớ hơn chữ.

- Hình và sơ đồ vẽ bằng SVG hoặc HTML và CSS ngay trong trang, theo màu của site (`src/styles/opus.css`), có bản sáng và tối. Chữ trong sơ đồ là chữ thật, để máy đọc màn hình đọc được và tìm kiếm thấy. Hình chỉ để trang trí thì đặt `aria-hidden`.
- Mọi trang và thành phần phải hiển thị tốt ở 360 px, 768 px và 1280 px, trên Chromium, WebKit (Safari) và Firefox: không tràn ngang; trên màn hình cảm ứng, vùng bấm từ 44 px.
- Không lùi chuẩn Lighthouse ở luật 7 của kế hoạch.
- Bố cục (D1.2b): thanh trên nền giấy (chế độ tối: nền trang), viền 2 px màu nhựa thông; dải màu mực chỉ ở phần đầu trang có `hero`: trang chủ và trang 404 mặc định của Starlight (`src/components/Hero.astro`).
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
- Cuối mục `## Nghe trước khi tập`: `::khoi-nghe`; bảng `## Theo dõi khi nghe` ngay sau, cột đầu mỗi dòng ghi `…`.
- Đầu mục `## Cấu trúc`: `::hinh-cau-truc`.
- Mục `## Học tiếp`: `::hoc-tiep` (bài cùng chặng, bài chặng sau, trang nghe kèm, sinh từ dữ liệu); có thể thêm vài gạch đầu dòng viết tay ngay sau.

### Hướng dẫn nghe (`nghe-nhac/<slug>.md`)

Frontmatter có `tac_pham`. Thứ tự các mục như mẫu ở `../opus-zero/AGENTS.md`. Bảng `| Mục | Thông tin |` đầu trang vẫn viết trong trang. Mục `## Sơ đồ cấu trúc` dùng `::hinh-cau-truc`; mục `## Nghe kèm bản thu` dùng `::khoi-nghe`, bảng `## Theo dõi khi nghe` ngay sau.

### Khối đặc biệt

| Khối | Cách viết | Dựng thành |
|---|---|---|
| Khuông nhạc | Khối ` ```abc ` theo "Quy ước ABC" của `../opus-zero/AGENTS.md`; dòng `T:` ở phần đầu thành tiêu đề | Khuông và trình phát (abcjs 6.7.1 trong `public/vendor/`): tốc độ, lặp, nghe từng tay, gõ nhịp, chế độ giá nhạc. Vẽ khi khối tới gần màn hình; trước khi in thì vẽ hết |
| Câu hỏi kiểm tra nhanh | Khối ` ```quiz `: dòng `? câu hỏi`, `+ đáp án đúng`, `- đáp án sai`, `> giải thích` | Câu hỏi bấm được, thứ tự lựa chọn trộn mỗi lần. Thiếu đáp án đúng hay có dòng lạ thì build hỏng |
| Hộp thông tin tác phẩm | `::hop-tac-pham` | Chip (giọng · nhịp, tốc độ, cấp độ, hình thức) và bảng "Thông tin tác phẩm và bản nhạc nên dùng" thu gọn |
| Hình cấu trúc | `::hinh-cau-truc` | Sơ đồ các đoạn từ `hinh` của bản ghi: `hinh.bai-hoc` ở trang bài học, `hinh.nghe` ở hướng dẫn nghe |
| Khối nghe | `::khoi-nghe` | Trình nghe kèm bản thu; người học bấm "Ghi mốc" ngay trong bảng `## Theo dõi khi nghe`. Bản thu gợi ý lấy từ `ban_thu` của bản ghi (cùng dạng `data-rec` của site cũ; D1.4 chuyển); không có thì người học tự dán link hay chọn file |
| Học tiếp | `::hoc-tiep` | Danh sách bài nên học tiếp, sinh từ dữ liệu |
| Ghi chú, mẹo, chú ý | `:::note`, `:::tip`, `:::caution`, `:::danger`, tiêu đề tùy chọn: `:::tip[Chưa sẵn sàng?]` … `:::` | Aside của Starlight |
| Thu gọn | `<details>`, `<summary>…</summary>`, một dòng trống, nội dung Markdown, một dòng trống, `</details>` | Khối bấm để mở |
| Chú thích cuối trang | `chữ[^1]` … `[^1]: Chú thích.` | Danh sách cuối trang, tách bằng một đường kẻ |
| Id cố định cho tiêu đề | `## Tiêu đề { #id }` | Tiêu đề có id đã chọn (giữ id cũ để link `#mục` cũ còn chạy) |
| Danh sách định nghĩa | Dòng thuật ngữ, rồi dòng `: định nghĩa` | `<dl>` |

- Chỉ thị `::…` đứng một mình trên một dòng, không có chữ hay thuộc tính. Ba chỉ thị `::hop-tac-pham`, `::hinh-cau-truc`, `::hoc-tiep` cần `tac_pham` ở frontmatter; `::hinh-cau-truc` chỉ dùng ở trang bài học hay hướng dẫn nghe, và bản ghi phải có hình cho loại trang đó. Sai thì build hỏng, lỗi ghi tên file.
- Plugin dựng các khối: `src/plugins/opus-markdown.mjs` (đọc trang) và `src/plugins/thanh-phan.mjs` (dựng HTML). JavaScript của khối nằm ở `src/scripts/` và chỉ tải ở trang có khuông nhạc, câu hỏi hay khối nghe (`src/components/MarkdownContent.astro`). CSS: `src/styles/thanh-phan.css`.
- Tiến độ của người học (bài đã làm hết câu hỏi, mốc nghe) lưu trong trình duyệt ở khóa `opus-zero:v1` như site cũ, nên dữ liệu đã lưu ở site cũ vẫn đọc được.
- Link nội bộ: chốt ở D1.4.
