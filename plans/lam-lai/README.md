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
- Trang ngoại vi vào mục Đọc thêm, chuyển ở đợt 8: 9 trang sau khi duyệt bảng tầng (24/10/2026; lúc đầu 13).
- Thứ tự làm các đợt: 0 đến 5, rồi 7, 8, 6, 9. Tác phẩm (đợt 6) làm sau cùng, khi khung site, phần lõi, công cụ, sách in và trang tham chiếu đã xong. Đợt 6 thêm tác phẩm theo lô (D6-L1 đến D6-L11); sau đợt 6, mỗi tác phẩm mới thêm theo `../ben-vung/them-tac-pham.md`. Số đợt, tên lô, tên nhánh và `anh-xa.md` giữ nguyên. Chủ repo chọn ngày 23/10/2026, lúc đang làm đợt 1.
  - Ba trang thử của D1.8 (`nhac-ly/10-hop-am-ba`, Für Elise, Bach Goldberg) chuyển ở đợt 1, chỉ có ở bản xem, để kiểm khung. Lô của chúng (D3-L2 và hai lô đợt 6) chỉ kiểm định và khóa, không chuyển lại.
  - Trang ngoài đợt 6 vẫn hiện vài trường của bản ghi tác phẩm (danh sách ở trang chặng, ô gợi ý tập, Tác phẩm theo cấp độ, Thầy và thi). Các trường đó khóa riêng, ở lô đầu tiên có trang hiện chúng (mục "Quy tắc chung"); đợt 6 khóa nốt phần còn lại.

Năm mục cần chốt trước đợt 1 và đợt 2, đã chốt cả (ngày ghi ở từng mục). Câu hỏi nhỏ còn chờ ghi ở cuối mục này, kèm lô cần có câu trả lời.

- [x] Công nghệ: Astro 7 và Starlight (khuyên dùng; lý do ở `cong-nghe.md`), hay MkDocs và Material như cũ. **Chọn Astro 7 và Starlight** (23/10/2026, khi duyệt D1.1).
- [x] Giao diện: giữ font, màu và giọng văn hiện có (khuyên dùng), hay làm nhận diện mới ở đợt 1. **Giữ font, màu, giọng văn** (23/10/2026, khi duyệt D1.1); thêm yêu cầu về hình ảnh ở mục "Giao diện" của `AGENTS.md`. Cùng ngày, sau khi so ba bản mẫu, chủ repo chọn bố cục **bản B** (thanh trên nền giấy viền nhựa thông, màu và biểu tượng riêng cho từng nhóm nội dung) **cộng phần đầu trang chủ của bản C** (dải màu mực tràn ngang); làm ở D1.2b.
- [x] Mức kiểm định: **theo tầng của trang** (24/10/2026; chi tiết ở `../ben-vung/chuan-kiem-dinh.md` mục 3).
  - Lõi và dữ liệu dùng ở nhiều trang: đủ hai lượt. Lượt 1 do agent làm lô, nhận định nào cũng có nguồn. Lượt 2 do một agent khác làm độc lập: Sonnet cho việc đối chiếu, Opus cho chỗ khó. Trang Tác phẩm cũng hai lượt, vì trang và bản ghi của chúng là dữ liệu dùng ở nhiều trang.
  - Đọc thêm (ngoại vi): một lượt, kèm lượt 2 kiểm khoảng 5 nhận định mỗi trang, chọn ngẫu nhiên.
  - Tham chiếu có hạn: kiểm như lõi, ghi ngày kiểm và ngày rà lại; đến hạn thì rà lại.
  - Bạn chỉ đọc bản tóm tắt hồ sơ và xem ngẫu nhiên vài nhận định (khoảng 5) mỗi lô; không kiểm tay mọi nhận định.
- [x] Nguồn chính cho nhạc lý: **Open Music Theory** (https://viva.pressbooks.pub/openmusictheory/; 24/10/2026): miễn phí, đọc được trên mạng, dẫn link được tới từng mục, nên agent kiểm định mở được để đối chiếu và người đọc bấm vào xem được. Phần liên quan đến Grade đối chiếu với đề cương chính thức của ABRSM. Sách in (như *The AB Guide to Music Theory*) chỉ làm nguồn phụ, vì agent không đọc được sách in. Thuật ngữ tiếng Việt chốt trong `thuat-ngu.yml`, khóa ở D3-L5.
- [x] Bảng tầng: **duyệt bảng hiện có, soát hai chỗ dễ sai** (24/10/2026): trang có thông tin mau cũ (giá, ứng dụng, thiết bị, link bản thu, sự kiện) là phần chính thì vào Tham chiếu có hạn; trang nằm giữa Lõi và Đọc thêm mà người mới cần trên lộ trình thì vào Lõi. Một agent soát cả 233 trang, có câu trích làm bằng chứng (báo cáo `bao-cao/d2-bang-tang.md`). Đổi 5 trang:
  - `lich-su/opera`, `nhac-cu/dan-nhac`: Ngoại vi thành Lõi (lộ trình nghe hiểu giao đọc ở tháng 5 và tháng 3). `dan-nhac` học cùng phần nhận diện (lô D5-L3), để mọi trang Lõi xong ở đợt 5.
  - `lich-su/duong-dai` (rà lại 2027-06), `lich-su/viet-nam` (2027-04): Ngoại vi thành Tham chiếu có hạn: tin, cuộc thi, đơn vị và lịch diễn là phần chính.
  - `nhan-dien/nghe-mu` (2027-10): Lõi thành Tham chiếu có hạn: phần chính là 10 bản thu phát từ Wikimedia Commons và gợi ý dịch vụ nghe.
  - `tai-nguyen` rà lại 2027-01 (có ngày của chương trình ABRSM), thay 2027-04.
  - Giữ: mục "Sau 6 tháng: đi sâu hơn" của lộ trình nghe hiểu không tính là bước của người mới, nên `lich-su/nhac-truyen-thong-viet-nam` vẫn ở Đọc thêm. Trang Tác phẩm giữ tầng: link bản thu của chúng nằm trong dữ liệu (`ban_thu`) và sẽ có kiểm link định kỳ.

  Sau khi đổi: Lõi 101, Tác phẩm 79, Khung và công cụ 34, Tham chiếu có hạn 10, Ngoại vi 9.

  Chủ repo xác nhận cách hiểu (24/10/2026): thông tin mau cũ là phần chính thì trang vào Tham chiếu có hạn; chỉ là câu lẻ thì trang giữ tầng, và trang Lõi không giữ câu ấy: lô của trang viết lại cho bền hay chuyển sang trang tham chiếu (`../ben-vung/chuan-kiem-dinh.md` mục 3).

Thêm, chốt ngày 24/10/2026:

- [x] Thuật ngữ tiếng Việt: **khóa dần theo lô**. Mỗi lô kiểm định và khóa (từng phần) các bản ghi của `thuat-ngu.yml` mà trang của lô dùng; D3-L5 khóa nốt và dựng trang Từ điển. Bài đã khóa không phải mở lại vì đổi thuật ngữ.
- [x] CI của nhánh lô: từ đợt 2, **push nhánh lô lên GitHub trước khi gộp**, chờ `test.yml` (bản xem) đạt rồi mới gộp vào `main`; gộp xong xóa nhánh trên GitHub. Agent làm lô vẫn không push; người gộp push.
- [x] Hai link tới repo trên site (biểu tượng GitHub ở thanh trên, chữ "MIT" ở chân trang): **bỏ tạm** khi repo còn riêng tư (người đọc mở ra trang 404); thêm lại khi repo công khai. Link tới issue cũng vậy: các trang đang trỏ tới issue của repo cũ (công khai) giữ link ấy cho tới khi repo mới công khai.
- [x] Review: **ba mức theo rủi ro** (Nhỏ, Vừa, Lớn), cho mọi thay đổi về sau; bảng ở mục "Ba mức review" (cuối Quy tắc chung). Thay cho cách cũ "gộp và push mỗi việc sau khi review". Lượt 2 kiểm định nội dung của mỗi lô vẫn giữ.
- [x] Đợt 2: **tách phần dữ liệu thành việc D2-0**, làm trước D2-L1 (mục Đợt 2). D2-L1 chỉ làm trang và dùng các trường đã khóa.
- [x] **Làm các đợt sau cho đỡ tốn mà không giảm chất lượng.** Chủ repo đưa gợi ý và giao Claude chọn ngày 24/10/2026, sau đợt 2; chi tiết ở `loi-giao/README.md` và `../ben-vung/chuan-kiem-dinh.md`.
  - Câu nói về chính site (`ve-site`): review kiểm thẳng trên trang và dữ liệu, không qua lượt 2.
  - Lời khuyên tập: lượt 2 chỉ kiểm mẫu 3 câu mỗi trang; mẫu có câu sai thì kiểm hết. Lời khuyên dính tới sức khỏe xếp loại cần nguồn, nên vẫn đủ hai lượt.
  - Mục "Nguồn và cách mở" trong chuẩn kiểm định.
  - Lời giao việc mẫu ở `loi-giao/`.
  - Tối đa 2–3 agent nặng cùng lúc; model theo phần việc (Opus cho lô có thành phần mới, Sonnet cho chuyển chữ, kiểm định và review, Haiku cho kiểm lại).
  - Ảnh chụp do CI chụp (tệp của lần chạy); báo cáo giữ tối đa 4 ảnh.
  - Kiểm thử chờ điều kiện, không chờ cố định.
  - Không làm: dùng chung trang nguồn đã tải giữa hai lượt (để giữ độc lập); chạy song song hai lô (các lô làm lần lượt).
- [x] Đợt 3: **làm thử D3-L1 trọn vẹn, rồi gom D3-L2 đến D3-L6** (chủ repo chọn ngày 24/10/2026; cách làm ở mục Đợt 3). Mục đích: kiểm định cả loạt bài nhạc lý một lượt (bài dẫn chéo nhau, dùng chung thuật ngữ) và bớt phần việc lặp lại của từng lô, nhưng vẫn thử thành phần dùng chung và cách làm mới ở một lô trước.

Câu hỏi nhỏ còn chờ (từ review nhánh quyết định, `bao-cao/d2-bang-tang.md`); hỏi chủ repo trước lô ghi bên cạnh:

- `nhan-dien/nghe-mu` ở Tham chiếu nên 6 trang trỏ tới nó (3 ở D3-L6, 3 ở D5-L3) hiện "sắp có" tới đợt 8: giữ vậy, hay giữ trang ở Lõi và đưa 10 bản thu vào dữ liệu có kiểm link. Trước D3-L6.
- Mục "Sau 6 tháng: đi sâu hơn" của lộ trình nghe hiểu: `nhac-ly/am-hoc` (Lõi) và `lich-su/nhac-truyen-thong-viet-nam` (Đọc thêm) nằm cùng một dòng việc. Có tính mục ấy là lộ trình không (tính thì trang nhạc truyền thống vào Lõi, lô D5-L1). Trước D5-L1.
- Cỡ mẫu lượt 2 của trang Đọc thêm: 5 nhận định mỗi trang (đang làm), hay theo lô, hay theo tỉ lệ. Trước đợt 8.
- Trang Tác phẩm có cần đủ hai lượt không: xem lại khi đã đo được tỉ lệ hai lượt lệch nhau ở các lô Lõi. Trước D6-0.

## Tiến độ

| Đợt | Nội dung | Lô | Sau đợt này site mới có thêm | Trạng thái |
|---|---|---|---|---|
| 0 | Dựng repo mới | | Chưa đăng gì | Xong 23/10/2026 |
| 1 | Nền kỹ thuật | D1.1–D1.8 | Trang chủ tạm và trang 404 ở `/opus/`; chưa có bài | Xong 24/10/2026: trang chủ tạm và trang 404 trên site thật; ba trang thử ở bản xem |
| 2 | Khung cấp độ và lối vào | 1 | Trang chủ, Bắt đầu, lộ trình và 7 trang chặng, bài kiểm tra đầu vào | Xong 24/10/2026: D2-nền (chuẩn bị kỹ thuật), D2-0 (khóa 223 bản ghi), D2-L1 (khóa 9 trang; 17 trang trên site thật: trang chủ mới, 7 trang Bắt đầu, lộ trình piano, 7 trang chặng, 404) |
| 3 | Nhạc lý và luyện tai | 6 | 45 trang, Từ điển | Chưa làm |
| 4 | Piano nền tảng | 4 | 28 trang: bắt đầu bên phím, kỹ thuật, tập luyện, hòa âm bên phím, văn học piano | Chưa làm |
| 5 | Nhạc cổ điển nền tảng | 3 | 27 trang: thời kỳ, hình thức, nhận diện; đủ 101 trang lõi | Chưa làm |
| 7 | Công cụ, sách in, blog, Cập nhật | 3 | 17 công cụ luyện tập, sách in, blog, dùng khi mất mạng | Chưa làm |
| 8 | Tham chiếu có hạn và Đọc thêm | 3 | 20 trang | Chưa làm |
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
- Một lô chỉ chạm: trang của lô trong `src/content/docs/`; dữ liệu liên quan trong `src/data/`; thành phần, script và file tĩnh mà trang của lô cần lần đầu (`src/components/`, `src/scripts/`, `public/`; đăng ký trong `src/plugins/thanh-phan.mjs`, CSS trong `src/styles/thanh-phan.css`, kiểm thử trong `tests/`); hồ sơ trong `kiem-dinh/`; báo cáo của lô (cả danh sách nhận định, kết quả lượt 2, ảnh chụp). Việc kế hoạch giao riêng cho một lô (như trang sinh từ dữ liệu ở D2-L1) ghi trong `THEM` của `tests/pham-vi.test.mjs`. Kiểm thử phạm vi chặn chỗ khác.
- Không push (bạn push). Không sửa `.claude/`. Không sửa trang đã khóa: kiểm thử khóa chặn; cần sửa thì theo thủ tục mở khóa (`../ben-vung/chuan-kiem-dinh.md` mục 7).
- Không thêm trang ngoài kế hoạch cho đến hết đợt 6; sau đó tác phẩm mới theo `../ben-vung/them-tac-pham.md`.
- Trang chỉ hiện trường dữ liệu đã khóa. Trang của lô hiện một trường chưa khóa thì lô đó kiểm định và khóa trường ấy cùng trang. Khóa từng phần bản ghi: `../ben-vung/chuan-kiem-dinh.md` mục 6.
- Commit message, mạng, `_imslp/`: như mục "Cách làm việc" của `AGENTS.md`.
- **Người review:** mặc định là Claude (phiên Cowork hay Claude Code của bạn); có thể là người hay LLM khác, miễn không làm lượt 1 hay lượt 2 của chính lô đó.

### Ba mức review

Chủ repo chọn ngày 24/10/2026, cho mọi thay đổi về sau. Nhánh có sửa ở nhiều mức thì theo mức cao nhất.

| Mức | Loại sửa | Chạy trên máy | Review | Gộp khi |
|---|---|---|---|---|
| **Nhỏ** | Chữ trong kế hoạch, báo cáo, tài liệu; bỏ hay đổi một link; config một dòng; sửa đã có kiểm thử bắt | `npm run build` và `npm test` (1–2 phút). Chỉ đổi `plans/` thì không cần chạy | Không | `test.yml` trên GitHub đạt |
| **Vừa** | Mã thành phần, CSS, plugin, script | Kiểm thử liên quan | Haiku hay Sonnet, chỉ đọc diff, không build lại | CI đạt và review không có chỗ phải sửa |
| **Lớn** | Công cụ khóa, dữ liệu dùng chung, workflow deploy, phần lọc HTML hay link (bảo mật) | Chạy đủ: build hai bản, `npm test` cho mỗi bản, kiểm thử trình duyệt | Sonnet hay Opus, có vòng kiểm lại | CI đạt; review và vòng kiểm lại không còn chỗ phải sửa |

- Ba lớp chặn, theo thứ tự: `npm test` trên máy; `test.yml` trên GitHub (thêm kiểm thử trình duyệt và Lighthouse); `deploy.yml` chạy lại tất cả trước khi đăng, hỏng thì không đăng và site giữ bản cũ. Lỡ sai thì `git revert` commit đó.
- Gom nhiều sửa nhỏ vào một nhánh, kiểm một lần.
- Sửa theo review mà chỗ sửa nhỏ và có kiểm thử kèm theo thì bỏ vòng kiểm lại; CI làm việc đó.
- Người review không chạy lại toàn bộ kiểm thử, vì CI đã chạy: chỉ đọc diff và chạy đúng phép thử liên quan.
- Lượt 2 kiểm định nội dung của mỗi lô không phải review mã: vẫn giữ, theo `../ben-vung/chuan-kiem-dinh.md`.

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
- **D1.6 Khóa, phạm vi, bản thật và bản xem:** `tools/khoa.mjs` (`tinh`, `khoa`, `mo`, `mau`, `xuat`; kế hoạch ban đầu ghi `tools/khoa.py`, lý do đổi ở `cong-nghe.md` mục 7) theo `../ben-vung/chuan-kiem-dinh.md`, cả khóa từng phần bản ghi (`du-lieu/<bộ>/<id>#<trường>,…`); `kiem-dinh/khoa.json`; kiểm thử khóa; kiểm thử phạm vi lô (so nhánh `moi/dN-lM` với `anh-xa.md`). `npm run build` chỉ đưa trang đã khóa; `npm run build:xem` đưa cả trang chưa khóa, có dải "Chưa kiểm định" ở đầu. Khóa trang chủ tạm và trang 404 (hồ sơ không có nhận định). Ghi cách làm đã chọn vào `cong-nghe.md` mục 7.
- **D1.7 CI và deploy:** `.github/workflows/test.yml` (nhánh `moi/**`: bản xem và kiểm thử) và `deploy.yml` (nhánh `main`: bản thật, kiểm thử, rồi đăng `dist/` lên GitHub Pages). Kiểm thử gồm build, schema, khóa, link, trợ năng, Lighthouse ở ba trang; hỏng thì không đăng. Bạn bật Pages của repo mới (Settings → Pages, nguồn GitHub Actions) trước khi gộp việc này.
- **D1.8 Thử:** chuyển ba trang `nhac-ly/10-hop-am-ba`, `piano/tac-pham/fur-elise`, `nghe-nhac/bach-goldberg` bằng `tools/chuyen/`; chưa kiểm định, chưa khóa, nên chỉ có ở bản xem. Trang `10-hop-am-ba` hiện ô "chưa chuyển" ở chỗ bàn phím (thành phần làm ở D3-L1): được phép ở bản xem, không tính là lỗi hiển thị. Chạy bộ truy vấn tìm kiếm của `../opus-zero/tests/search.mjs` trên bản xem.

**Xong khi:** ba trang thử hiện đúng ở bản xem (ảnh chụp 360 px và 1280 px), đạt chuẩn ở luật 7, và không có trong bản thật; bộ dữ liệu hỏng làm build hỏng; tìm "hop am ba" ra bài 10, tìm "dan" ra trang có chữ "đàn"; https://mtuann.github.io/opus/ hiện trang chủ tạm, địa chỉ không có ra trang 404 mới.

## Đợt 2. Khung cấp độ và lối vào (lô D2-L1)

Từ đợt này, mỗi lô gộp vào `main` là trang của lô lên site thật.

- Kiểm định và khóa: `cap-do.yml`; `nha-soan-nhac.yml`; các trường của 73 bản ghi trong `tac-pham.yml` mà trang của lô hiện ra, khóa từng phần (`../ben-vung/chuan-kiem-dinh.md` mục 6). Tối thiểu:
  - `ten`, `tac_gia`, `danh_muc`, `chang`, `loai`: trang chặng liệt kê bài, link tới đúng trang bài học hay hướng dẫn nghe;
  - `goi_y`: ô gợi ý tập ở trang chủ;
  - `grade` nếu trang chặng hiện Grade của từng bài; không thì `grade` khóa ở D8-L1 (Tác phẩm theo cấp độ).

  Trang chặng hiện thêm trường nào thì khóa thêm trường ấy, ghi trong báo cáo. Các trường còn lại khóa ở đợt 6.
- Kiểm thử hỏng nếu trang đã khóa hiện một trường chưa khóa của bản ghi, qua chỉ thị trong trang, trang chặng hay ô gợi ý tập.
- Ô gợi ý tập (`practice.js` cũ, ở trang chủ; đợt 4, 7 dùng lại ở trang Piano, Luyện tập) sinh link bằng JavaScript. Link tới trang chưa có phải hiện "sắp có" như link dựng lúc build. Vì vậy bản build xuất danh sách trang cho script; D2-L1 làm việc này khi chuyển `practice.js` (phạm vi của D2-L1 gồm cả cấu hình build, xem kiểm thử phạm vi của D1.6).
- Kiểm định trường của 73 bản ghi là phần nặng nhất của đợt, nên tách thành **việc D2-0** (chủ repo chọn ngày 24/10/2026), làm trước D2-L1 trên nhánh `moi/d2-0-du-lieu`:
  - Kiểm định `cap-do.yml`, `nha-soan-nhac.yml` và các trường đợt 2 của `tac-pham.yml`: `ten`, `tac_gia`, `gan_cho`, `khuyet_danh`, `danh_muc`, `chang`, `grade`, `loai`, `goi_y`. `grade` kiểm luôn để D2-L1 không phải quay lại.
  - Lượt 1 chia bốn phần chạy song song: A gồm 7 chặng và 34 bài học; B gồm 39 hướng dẫn nghe; C và D chia đôi 146 người.
  - Chỗ sửa dữ liệu ghi vào `bao-cao/d2-0/sua-<phần>.yml`, rồi gom lại một lần. Sau đó là lượt 2 độc lập, review, chủ repo kiểm mẫu khoảng 5 nhận định, và khóa từng phần.
  - Báo cáo `bao-cao/d2-0.md`.
- Việc chuẩn bị kỹ thuật **D2-nền** (nhánh `moi/d2-nen`, làm song song với D2-0) gồm những việc mà review cuối đợt 1 khuyên làm trước lô (`bao-cao/d1.md`, mục "Nên sửa" 1–4 và 6):
  - thành phần danh sách việc có nhãn;
  - phép thử `#mục` không giả định `h2`;
  - bảng hẹp ở 360 px;
  - hai kiểm thử còn thiếu;
  - lệnh `nhap` đưa kết quả lượt 2 vào hồ sơ;
  - kiểm thử "trang đã khóa chỉ hiện trường đã khóa".
  Báo cáo `bao-cao/d2-nen.md`.
- 7 trang chặng `piano/lo-trinh/chang-1` đến `chang-7` sinh từ dữ liệu; trang lộ trình giữ các mục chặng dạng tóm tắt, mỗi mục dẫn sang trang chặng.
- 9 trang của lô, gồm trang chủ mới (thay trang chủ tạm) và bài kiểm tra đầu vào (`placement.js`).
- Menu đủ 9 nhóm; nhóm chưa có trang hiện nhãn "sắp có". Mô tả nhóm Đọc thêm bỏ chữ "opera" (opera thành Lõi khi duyệt bảng tầng), sửa cùng lúc ở `src/nhom.mjs` và thẻ của trang chủ mới.

**Xong khi:** trang của lô và phần dữ liệu trên đã khóa và có trên site thật; người mới đi được từ trang chủ tới trang chặng của mình; ô gợi ý tập ở trang chủ chỉ dùng trường đã khóa, link tới bài chưa lên hiện "sắp có".

## Đợt 3. Nhạc lý và luyện tai (D3-L1 đến D3-L6)

- `thuat-ngu.yml` khóa dần (chủ repo chọn 24/10/2026): mỗi lô của đợt 3 kiểm định và khóa từng phần các bản ghi thuật ngữ mà trang của lô dùng; D3-L5 khóa nốt và dựng trang Từ điển từ dữ liệu.
- Thành phần mà các bài này dùng (bàn phím, hóa biểu, vòng quãng năm, máy đếm nhịp, câu hỏi) chuyển trong lô có trang đầu tiên cần nó. Bàn phím (`piano.js` cũ) phát tiếng qua `audio.js`, module âm thanh dùng chung. Lô đầu tiên có bàn phím là D3-L1 (bài 1). Lô đó chép kèm `audio.js` và mẫu âm piano (`../opus-zero/docs/assets/samples/piano/`, Salamander Grand Piano, CC BY 3.0, cả file `LICENSE.txt` của thư mục). Trước đó, trang thử `nhac-ly/10-hop-am-ba` của D1.8 hiện ô "chưa chuyển" ở chỗ bàn phím.

- **Cách làm (chủ repo chọn ngày 24/10/2026):**
  1. **D3-L1** làm trọn vẹn như một lô (lượt 1, lượt 2, review, kiểm mẫu, khóa, đăng). Lô này làm các thành phần dùng chung (bàn phím, `audio.js`, mẫu âm piano, công cụ luyện tai), nên thử chúng và cách làm mới trước. Lỗi hệ thống sửa ở đây, trước khi nhân ra 37 trang.
  2. **Lượt 1 của D3-L2 đến D3-L6:**
     - lần lượt từng lô, mỗi lúc một agent;
     - mỗi lô một nhánh `moi/d3-l<lô>` từ `main`;
     - push để `test.yml` kiểm phạm vi và kiểm thử của từng lô;
     - mỗi lô xuất danh sách cho lượt 2.
  3. **Nhánh gom `moi/d3-gom`** từ `main`, gộp năm nhánh lô. Trên nhánh này, làm chung một lần cho cả loạt:
     - Lượt 2, chia phần khoảng 150 nhận định, mỗi lần 2–3 agent. Kết quả nhập vào hồ sơ bằng `nhap`.
     - Review: chỗ hai lượt lệch nhau, chỗ sửa, câu về chính site, và chỗ các bài nói khác nhau hay dùng thuật ngữ lệch nhau.
     - Chủ repo kiểm mẫu khoảng 10 nhận định cho cả loạt (`node tools/khoa.mjs xuat D3-L2 D3-L3 D3-L4 D3-L5 D3-L6 --mau 10`).
     - Khóa, rồi gộp vào `main` một lần.
  4. **Thuật ngữ:** mỗi lô lập hồ sơ cho bản ghi thuật ngữ mà trang của lô dùng. Trên nhánh gom, lô sau thêm vào hồ sơ đã có, không lập lại. D3-L5 dựng trang Từ điển và khóa nốt.

**Xong khi:** 45 trang của 6 lô và `thuat-ngu.yml` đã khóa.

## Đợt 4. Piano nền tảng (D4-L1 đến D4-L4)

**Xong khi:** 28 trang của 4 lô đã khóa; 10 bài đầu tiên phát và vẽ khuông đúng.

## Đợt 5. Nhạc cổ điển nền tảng (D5-L1 đến D5-L3)

- Trang nhà soạn nhạc và dòng thời gian đọc năm sinh–mất từ `nha-soan-nhac.yml`.

**Xong khi:** 27 trang của 3 lô đã khóa; đủ 101 trang lõi.

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

- Trang tham chiếu có `ra_lai` trong `trang.yml`; workflow hằng tuần mở issue "Trang cần rà lại" khi quá hạn (không chặn deploy). Cùng lúc: workflow kiểm link ra ngoài hằng tuần (như `link-check.yml` của site cũ, dùng lychee), gồm link bản thu trong `ban_thu` của `tac-pham.yml`; link hỏng thì mở issue. D8-L1 đặt lại các ngày rà lại tính từ ngày khóa: ví dụ khóa sau tháng 1/2027 thì trang theo chương trình ABRSM rà lại tháng 1/2028.
- Thầy và thi, Tác phẩm theo cấp độ: kiểm định theo chương trình ABRSM đang dùng lúc làm (từ tháng 1/2027 là chương trình piano 2027–2028). Hai trang liệt kê tác phẩm: dùng trường đã khóa; `grade` khóa ở đợt 2 nếu trang chặng hiện Grade, không thì chính lô này khóa. Link tới bài chưa lên hiện "sắp có".
- Trang Đọc thêm có dòng "ngoài lộ trình" ở đầu.

**Xong khi:** 20 trang của 3 lô đã khóa.

## Đợt 6. Tác phẩm (D6-L1 đến D6-L11), làm sau đợt 8

Khung, lõi, công cụ và tham chiếu đã lên site; đợt này thêm tác phẩm từng lô. Link "sắp có" tới bài học (ở trang lõi, trang chặng, ô gợi ý tập, công cụ, trang tham chiếu) tự thành link khi lô lên. Mỗi lô khóa nốt các trường còn lại của bản ghi tác phẩm trong lô.

- Trước lô đầu, một việc riêng (nhánh `moi/d6-0-chuan-bi`, báo cáo `d6-0.md`): chép các bản thu từ `../opus-zero/docs/assets/audio/` sang `public/audio/` (cả `NGUON.txt`); chép `../opus-zero/tools/audio/` sang `tools/audio/` rồi sửa để `attach.py`, `check_audio.py`, phần căn mốc đọc và ghi bản thu trong bản ghi của `tac-pham.yml` thay vì trong trang; thông số hình cấu trúc nằm trong bản ghi; `tools/them_tac_pham.py` và kiểm thử `tac_pham` theo `../ben-vung/them-tac-pham.md`.
- Đối chiếu nốt và căn mốc bản thu IMSLP dùng `../opus-zero/_imslp/` (chỉ có trên máy bạn, không có trong git).
- D6-L1 đến D6-L6: bài học chặng 2 đến 7, kèm hướng dẫn nghe cùng tác phẩm; D6-L7 đến D6-L11: các hướng dẫn nghe còn lại theo thứ tự nav cũ, cùng hai trang mục lục.
- Danh mục `tac-pham` sinh từ dữ liệu, lọc theo chặng, thời kỳ, tác giả, loại.

**Xong khi:** 81 trang của 11 lô đã khóa; mọi trường của 73 bản ghi tác phẩm đã khóa (khóa cả bản ghi); `python3 tools/audio/check_audio.py` không lỗi; danh mục, trang chặng và "Học tiếp" hiện đủ; hai cuốn sách in có tác phẩm ("Hướng dẫn nghe", "Piano: 10 bài đầu tiên và bài học tác phẩm") đủ chương.

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

1. Bạn giao lô bằng `loi-giao/lo.md`, chọn model theo phần việc (`loi-giao/README.md`).
2. Agent chuyển trang bằng `tools/chuyen/`, tách dữ liệu, kiểm định lượt 1, ghi hồ sơ (chưa khóa). Câu về chính site ghi loại `ve-site`, có ghi chú đã kiểm ở đâu.
3. Agent khác kiểm định lượt 2 độc lập (`loi-giao/luot-2-trang.md`), mức theo tầng của trang (`../ben-vung/chuan-kiem-dinh.md` mục 3). Danh sách do `node tools/khoa.mjs xuat` tách: bỏ câu về chính site, lấy mẫu lời khuyên tập. Kết quả vào hồ sơ bằng `node tools/khoa.mjs nhap`.
4. Người gộp push nhánh lô lên GitHub; `test.yml` chạy trên bản xem: build, schema, khóa, link, khuông nhạc, kiểm thử trình duyệt, trợ năng, Lighthouse trang mẫu. Phải đạt trước khi gộp. CI chụp từng trang của nhánh ở 360 px và 1280 px (tệp `anh-chup` của lần chạy, giữ 7 ngày). Báo cáo chỉ giữ tối đa 4 ảnh tiêu biểu.
5. Review báo cáo, hồ sơ và ảnh chụp: chỗ hai lượt lệch nhau, mọi chỗ sửa, câu về chính site. Chỗ cần sửa trả về agent trên cùng nhánh. Phần mã của lô review theo mục "Ba mức review" (`loi-giao/review-ma.md`).
6. Bạn đọc tóm tắt hồ sơ trong báo cáo của lô và xem ngẫu nhiên khoảng 5 nhận định (`node tools/khoa.mjs xuat <lô> --mau 5`); agent khóa; bạn gộp vào `main` và push. Trang của lô lên site thật.

Các lô làm lần lượt (chủ repo chọn ngày 24/10/2026, sau đợt 2); chỉ chồng phần việc nhẹ, như chờ CI hay chờ chủ repo kiểm mẫu. Các đợt làm lần lượt, theo thứ tự ở bảng Tiến độ. Cuối mỗi đợt, người review xét cả đợt theo "Xong khi" và cập nhật bảng Tiến độ.

## Lời giao việc mẫu

Một phiên một việc, mở trong thư mục `opus/`. Đổi các chỗ trong `<>` trước khi gửi.

**Một lô (đợt 2 đến 8), lượt 2, review mã:** dùng các file ở `loi-giao/`:
- `lo.md`;
- `luot-2-trang.md`;
- `luot-1-du-lieu.md`, `luot-2-du-lieu.md` (việc dữ liệu riêng như D2-0);
- `review-ma.md`.

Chỉ đổi phần trong `<>`. Lời giao của đợt 1 và của lô trước đợt 3 nằm trong lịch sử git của file này.

**Review một lô (nội dung):**

> Bạn review lô **D<đợt>-L<lô>** của repo opus, nhánh `moi/d<đợt>-l<lô>`.
>
> - Đọc mục "Review những gì" trong `plans/lam-lai/README.md`, `plans/ben-vung/chuan-kiem-dinh.md`, báo cáo của lô, và hồ sơ trong `kiem-dinh/` của các trang trong lô.
> - Kiểm lại:
>   - mọi nhận định hai lượt cho kết quả khác nhau, mọi chỗ đã sửa (mở đúng nguồn ghi trong hồ sơ);
>   - mọi câu về chính site (`ve-site`), trên trang và dữ liệu.
> - Không chạy lại toàn bộ kiểm thử: CI đã chạy.
> - Ghi vào cuối báo cáo, mục "Review": chỗ phải sửa (file, dòng, lý do, nguồn), chỗ nên sửa, kết luận gộp được hay chưa.
> - Không sửa trang. Không push.

**Review cuối đợt:**

> Bạn review **đợt <đợt>** của repo opus theo mục "Review những gì" trong `plans/lam-lai/README.md`. Kiểm tiêu chí "Xong khi" của đợt; so số trang đã khóa trong `kiem-dinh/khoa.json` với `plans/lam-lai/anh-xa.md`; mở site thật xem phần mới lên. Cập nhật bảng Tiến độ trong README; ghi kết quả vào `plans/lam-lai/bao-cao/d<đợt>.md`. Không push.

## Review những gì

- **Mỗi lô:** phạm vi file; soát nhãn nhận định (câu `ve-site` chỉ nói về site; `khuyen-tap` không có điều về sức khỏe hay sự kiện cần nguồn) và ghi `review` cho mọi câu `ve-site`; hồ sơ đủ; trường dữ liệu mà trang của lô hiện ra đã kiểm định (khóa cùng trang); mọi chỗ hai lượt lệch nhau và mọi chỗ đã sửa; trang dựng đúng trên ảnh chụp; thành phần mới có kiểm thử; dữ liệu tách ra khớp trang cũ trong `../opus-zero/`; `git -C ../opus-zero diff --stat` trống.
- **Đợt 1:** chạy lại build và kiểm thử; đọc schema, plugin, script chuyển; so chữ ba trang thử với site cũ; thử dữ liệu hỏng; bản thật không có trang chưa khóa; link "sắp có" và trang 404; đo Lighthouse.
- **Cuối mỗi đợt:** tiêu chí "Xong khi"; số trang đã khóa khớp `anh-xa.md`; site thật hiện đúng phần đã khóa, không link chết.
