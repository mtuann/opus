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
npm run dev       # máy chủ thử (bản xem), tự tải lại khi sửa: http://localhost:4321/opus/ (tìm kiếm chỉ chạy ở bản build)
npm run build     # bản thật vào dist/: chỉ trang đã khóa; deploy dùng bản này
npm run build:xem # bản xem vào dist/: thêm trang chưa khóa, có dải "Chưa kiểm định"; không đăng
npm run preview   # xem dist/ vừa build: http://localhost:4321/opus/
npm test          # kiểm thử trên dist/: chạy sau npm run build hay npm run build:xem
```

- Kiểm thử ở `tests/*.test.mjs`, chạy bằng trình kiểm thử có sẵn của Node (`node --test`), không cần gói thêm. Thêm kiểm thử thì thêm file `tests/<tên>.test.mjs`.
- Trang mới chuyển chưa khóa nên chỉ có ở bản xem: xem và kiểm bằng `npm run build:xem`, không phải `npm run build`.
- `tools/du_lieu/` dùng Python 3.12: `python3 -m pip install -r requirements.txt`. `tools/chuyen/` và `tools/khoa.mjs` chạy bằng Node.
- Chỉ thị trong trang (`::hop-tac-pham`…) lấy chữ từ `src/data/` lúc dựng trang. `npm run build` tự dựng lại mọi trang khi dữ liệu hay plugin Markdown đổi (`dungLaiKhiDoi` trong `src/du-lieu.mjs`); đang chạy `npm run dev` mà sửa `src/data/`, hay thêm, xóa trang (link "sắp có" chỉ tính lại khi trang được dựng lại), thì khởi động lại `npm run dev` để thấy thay đổi.

## Dữ liệu

- Năm bộ dữ liệu YAML trong `src/data/`: `cap-do.yml` (7 chặng), `tac-pham.yml`, `nha-soan-nhac.yml` (mọi người có năm sinh–mất trên site), `thuat-ngu.yml`, `trang.yml` (tầng của mọi trang). Trường, kiểu và các phép kiểm chéo: `src/du-lieu.mjs`; trong code Astro đọc bằng `getCollection('tac-pham')`…
- Thông tin dùng ở nhiều trang (chặng, Grade, năm sinh–mất, số danh mục, danh sách tác phẩm) lấy từ dữ liệu, không viết tay. Trang tác phẩm chỉ khai `tac_pham: <slug>` ở frontmatter.
- Một tác phẩm, một bản ghi. Trang chính của bản ghi là `piano/tac-pham/<slug>` (`loai: bai-hoc`) hay `nghe-nhac/<slug>` (`loai: nghe`). Trường `cap` có hai nghĩa:
  - trang `cap` không có bản ghi riêng: trang đó viết về đúng tác phẩm này và dùng chung bản ghi;
  - trang `cap` có bản ghi riêng (tác phẩm lớn hơn, như *Kinderszenen* của *Träumerei*): hai bản ghi trỏ `cap` sang nhau.
- Dữ liệu sai (YAML hỏng, sai kiểu, trường lạ, trùng id, tham chiếu tới thứ không có) thì build hỏng. Thử: `OPUS_DU_LIEU=tests/du-lieu-hong npm run build`.
- Bản ghi tác phẩm có thể có `hinh` (sơ đồ các đoạn, theo loại trang `bai-hoc`, `nghe`) và `ban_thu` (bản thu gợi ý cho khối nghe, cùng dạng `data-rec` của site cũ: `by`, `lic`, `licUrl`, `note`, `page`, `parts`; file mp3 của site viết `audio/x.mp3`). Mốc tham khảo theo bảng "Theo dõi khi nghe" của từng trang nên nằm trong trang (`::khoi-nghe{moc="…"}`), không ở dữ liệu.
- `tools/du_lieu/tach.py` tách dữ liệu từ site cũ (D1.2; D1.3 thêm `hinh`, D1.4 thêm `ban_thu`); `src/data/` đã có dữ liệu thì phải thêm cờ `--ghi-de`, và chỉ chạy lại khi dữ liệu chưa kiểm định. Từ đợt 2, sửa `src/data/` bằng tay, theo hồ sơ kiểm định.

## Khóa

- Trang và bản ghi dữ liệu lên site thật khi đã khóa: mã băm trong `kiem-dinh/khoa.json`, hồ sơ kiểm định trong `kiem-dinh/<trang>.yml` hay `kiem-dinh/du-lieu/<bộ>/<id>.yml` (`plans/ben-vung/chuan-kiem-dinh.md` mục 5–7). Trang hay bản ghi đã khóa mà đổi thì build hỏng, ở cả hai bản; sửa theo thủ tục mở khóa.
- Công cụ `tools/khoa.mjs`; mã băm tính ở `src/khoa.mjs`, dùng chung với bản build. `<mục>` là trang (`nhac-ly/10-hop-am-ba`, `index`) hay bản ghi (`du-lieu/tac-pham/fur-elise`).

```bash
node tools/khoa.mjs mau <mục>               # tạo hồ sơ mẫu
node tools/khoa.mjs khoa <mục>              # kiểm hồ sơ đủ, ghi mã băm vào khoa.json và vào lần cuối của lan
node tools/khoa.mjs tinh                    # kiểm mọi mục đã khóa; lệch thì thoát 1
node tools/khoa.mjs mo <mục> --ly-do "…"    # mở khóa: ghi lý do, thêm một lần mới vào lan để điền
node tools/khoa.mjs xuat D3-L2 [--mau 10]   # nhận định của lô cho lượt 2 (--mau: mẫu cho chủ repo kiểm)
```

- Khóa được khi mọi nhận định đã qua hai lượt và có kết quả, chỗ sửa hay bỏ có ghi chú, chỗ hai lượt khác nhau đã giải quyết, mọi khuông nhạc (khối `abc`) đã kiểm, và lần cuối trong `lan` ghi đủ người (`luot_1`, `luot_2`, `review`, `kiem_mau`).
- Trên nhánh lô `moi/d<đợt>-l<lô>`, `tests/pham-vi.test.mjs` so với `main` (cần nhánh `main` hay `origin/main`): file ngoài phạm vi của lô (kế hoạch, mục "Quy tắc chung"; trang của lô theo `plans/lam-lai/anh-xa.md`) và trang của lô khác bị khóa hay mở khóa thì kiểm thử hỏng. Việc kế hoạch giao riêng cho một lô (như trang sinh từ dữ liệu ở D2-L1) ghi trong `THEM` của file kiểm thử đó.

## Giao diện

Chủ repo yêu cầu (23/10/2026): site gọn, thân thiện. Điều gì giải thích được bằng hình hay sơ đồ thì vẽ hình, vì dễ nhớ hơn chữ.

- Hình và sơ đồ vẽ bằng SVG hoặc HTML và CSS ngay trong trang, theo màu của site (`src/styles/opus.css`), có bản sáng và tối. Chữ trong sơ đồ là chữ thật, để máy đọc màn hình đọc được và tìm kiếm thấy. Hình chỉ để trang trí thì đặt `aria-hidden`.
- Mọi trang và thành phần phải hiển thị tốt ở 360 px, 768 px và 1280 px, trên Chromium, WebKit (Safari) và Firefox: không tràn ngang; trên màn hình cảm ứng, vùng bấm từ 44 px.
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
| Khuông nhạc | Khối ` ```abc ` theo "Quy ước ABC" của `../opus-zero/AGENTS.md`; dòng `T:` ở phần đầu (trước `K:`) thành tiêu đề | Khuông và trình phát (abcjs 6.7.1 trong `public/vendor/`): tốc độ, lặp, nghe từng tay, gõ nhịp, chế độ giá nhạc. Vẽ khi khối tới gần màn hình; trước khi in thì vẽ hết. abcjs tải sẵn lúc trình duyệt rảnh, khoảng một giây sau khi mở trang; in sớm hơn thì chỗ khuông chưa vẽ in dòng nhắc |
| Câu hỏi kiểm tra nhanh | Khối ` ```quiz `: dòng `? câu hỏi`, `+ đáp án đúng`, `- đáp án sai`, `> giải thích` | Câu hỏi bấm được, thứ tự lựa chọn trộn mỗi lần. Thiếu đáp án đúng hay có dòng lạ thì build hỏng |
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

- Chỉ thị `::…` đứng một mình trên một dòng, không có chữ, chỉ có thuộc tính ghi trong bảng (`::khoi-nghe` nhận `moc`; `::hinh`, `::cong-cu` cần `ten`; `::cong-cu` nhận thêm thông số của công cụ). Ba chỉ thị `::hop-tac-pham`, `::hinh-cau-truc`, `::hoc-tiep` cần `tac_pham` ở frontmatter; `::hinh-cau-truc` chỉ dùng ở trang bài học hay hướng dẫn nghe, và bản ghi phải có hình cho loại trang đó. Sai, kể cả gõ sai tên chỉ thị, thì build hỏng, lỗi ghi tên file.
- Chữ trong chip, `thong_tin`, câu hỏi (dòng `?`, `+`, `-`, `>`) và tên tác phẩm là Markdown trong dòng: `*nghiêng*`, `**đậm**`, `[link](/opus/…/)`. Thẻ HTML thô không dùng được: hiện ra thành chữ. Link trong dữ liệu viết như link trong trang (mục "Link nội bộ").
- Hình hay công cụ chưa có thành phần thì hiện ô "… chưa chuyển sang site mới": build vẫn chạy (có cảnh báo `[opus]`) để xem được trang ở bản xem, nhưng trang đã khóa có ô này thì kiểm thử hỏng (`tests/khoa.test.mjs`). Lô đầu tiên chuyển trang dùng hình hay công cụ ấy làm thành phần và thêm vào `HINH`, `CONG_CU` trong `src/plugins/thanh-phan.mjs`.
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
   - Tiêu đề `#` thành `title` (bỏ định dạng Markdown); mô tả trang lấy thẻ `og:description` của bản build cũ (thẻ `description` cũ bị cắt ở dấu `"`), rỗng hay không có thì cảnh báo.
3. `npm run build:xem`, rồi `node tools/chuyen/so-chu.mjs <trang> …`: chữ hiển thị, mô tả trang, trọn mã ABC của từng khuông, từng câu hỏi (lựa chọn, đáp án đúng, giải thích) và id tiêu đề phải giống trang cũ. `npm test` kiểm lại cho mọi trang đã chuyển, khi máy có `.cache/site-cu/`.
