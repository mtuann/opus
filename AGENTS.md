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

Chốt ở D1.3; trước đó tra `../opus-zero/AGENTS.md`.
