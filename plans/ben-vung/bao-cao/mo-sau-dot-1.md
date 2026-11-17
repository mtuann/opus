# Báo cáo: việc sau đợt 1 thêm tác phẩm (`mo/sau-dot-1`)

17/11/2026. Mục 2 của `plans/ben-vung/lo-trinh-them-tac-pham.md` ("Sau mỗi đợt"), sau ba lượt của đợt 1 (Debussy Arabesque số 1, Rachmaninoff Prelude Đô♯ thứ Op. 3 số 2, Mozart *Alla turca*), cùng hai câu phát hiện khi đối chiếu bản in đầu.

## Lượt 1 (Claude Opus 5.5)

Mở khóa 12 mục (chưa khóa lại; khóa sau lượt 2, review, kiểm mẫu):

- **`piano/tac-pham-theo-cap`**: dòng Debussy Arabesque số 1 (chặng 6) thành link bài học; dòng Rachmaninoff Op. 3 số 2 chuyển từ bảng chặng 6 sang chặng 7, có link (chữ giữ nguyên); thêm dòng *Alla turca* ở chặng 6 (link bài học và hướng dẫn nghe K. 331). Nhận định n83 (ve-site), n84 (ten, IMSLP); r6 nối ghi chú dòng Rachmaninoff đã chuyển. `doi_chu`: ghi luôn các dòng thêm ở `mo/sau-dot-2`, `mo/sau-dot-3` mà lúc ấy chưa ghi (máy không có `.cache/site-cu/`, nên `tests/chuyen.test.mjs` bỏ qua).
- **`piano/nha-soan-nhac`**: bảng "Muốn chơi…" link Arabesque số 1 và Prelude Op. 3 số 2; dòng "Bắt đầu bằng" của Mozart thêm "(chương 3, *Alla turca*: chặng 6)", của Debussy "Arabesque số 1 (chặng 6)", của Rachmaninoff "Prelude Op. 3 số 2 (chặng 7)", đều có link. Trang không có chữ "≈ Grade 7–8" cho K. 331 (đó là chữ của site cũ, đã bỏ ở D4). n191 (ve-site), n192 (ten).
- **`piano/hai-tay`** mục Hai chọi ba: link Arabesque số 1 (n80). **`piano/ban-dap`** mục Debussy: "Áp dụng vào Clair de lune, và thử nửa bàn đạp ở Arabesque số 1" (n67; bài học có lời khuyên nửa bàn đạp ở mục Diễn tấu).
- **`cap` hai chiều**: `mozart-alla-turca` có `cap: nghe-nhac/mozart-k331`, `mozart-k331` có `cap: piano/tac-pham/mozart-alla-turca` (mở cả hai bản ghi; n13, n11 ve-site, trường `cap`). Bài học có thêm dòng "Nghe kèm" do `::hoc-tiep` sinh. Trang `piano/tac-pham/mozart-alla-turca` phải mở cùng (không sửa chữ): trang đã khóa đọc bản ghi qua `chiDaKhoa`, bản ghi đang mở thì build hỏng. Trong lúc mở, `piano/tac-pham/index` và `nghe-nhac/index` ở bản xem không liệt kê hai bản ghi này (như đợt hình 3c).
- **`piano/tac-pham/index`**: không có đoạn "Năm bài học…"; mục "Nghe kèm" thêm "Mozart: Sonata K. 331 (cho *Alla turca*)" (n24). **`nghe-nhac/mozart-k331`** "Nếu bạn muốn chơi": chương 3 "có bài học riêng (chặng 6)", link (n37).
- **`nghe-nhac/brahms-intermezzo`** n29 (da-sua): "hai phách sau khi bè trên vào, nó nhắc lại bốn nốt mở đầu của bè trên (Đô♯ – Fa♯ – Mi – Rê) ở quãng tám dưới, mỗi nốt một phách". Xem mục Chỗ chưa chắc.
- **`piano/tac-pham/debussy-clair-de-lune`**: thêm nguồn bản Fromont 1905 (IMSLP #83536). Coda (bảng Theo dõi, bảng Cấu trúc, bảng Chỗ khó, kế hoạch tuần 6) bỏ "tay bắt chéo": bản in không ghi m.g., m.d.; tay trái rải từ nốt trầm lên khuông trên, ô 67 tới La♭4 nằm giữa Fa♭4 và Rê♭5 của tay phải, ô 69–70 tới Fa♭5 dưới La♭5–Đô♭6 tay phải (n33, n43 da-sua; n94 mới; n56 khuyen-tap; n95 ve-site). Mở đầu (n26, n34 da-sua): ô 1 tay trái vào ở móc đơn thứ hai (Fa4–La♭4, khuông dưới), tay phải ở móc đơn thứ ba (Fa5–La♭5), vẫn trong phách đầu. Bản ghi `debussy-clair-de-lune` (`hinh`, `thong_tin`) không có câu nào như vậy: không mở.
- **`ke-hoach`** mục 3 Thứ tự dự định: "(đã có)", link ba bài (n14).
- **`plans/ben-vung/ke-hoach-mo-rong.md` mục 6.1**: đợt 1 xong; bài học theo chặng 2–7: 8, 6, 8, 6, 9, 6 (43 bài).
- `kiem-dinh/lich-su/nu-nha-soan-nhac.yml` (trang đã khóa, chỉ sửa hồ sơ): `doi_chu` của dòng "Tập:" thêm ở `mo/sau-dot-3` chưa ghi; ghi lại để `tests/chuyen.test.mjs` đạt khi máy có `.cache/site-cu/`.

Câu cần lượt 2: 8 (`node tools/khoa.mjs xuat … --con-lai`): tac-pham-theo-cap n84; nha-soan-nhac n192; brahms-intermezzo n29; debussy-clair-de-lune n26, n33, n34, n43, n94. Câu ve-site (n83, n191, n80, n67, n24, n37, n14, n95, n13, n11) chỉ cần review.

Kiểm thử: `npm run build:xem` đạt; `npm test` 353 đạt, 2 bỏ qua, 0 hỏng (có `.cache/site-cu/`, nối tới thư mục của repo chính).

## Chỗ chưa chắc

- **Canon Brahms (n29).** Lời giao đọc Đô♯5 bè trên ở phách 1 ô 49 (bè giữa vào sau một phách). Bản quét Simrock (trang PDF 5) cho thấy cuối ô 48 có Đô♯5 nốt đen ở phách 3 (*p*), với dấu nối ngắn sang Đô♯5 móc đơn đầu ô 49 (hệ sau mở bằng nửa dấu nối, cạnh dấu luyến dài), như review D6-L8-gom đã đọc trên Mutopia. Theo cách đọc này bè giữa vào sau hai phách, Mi và Rê cũng sau hai phách, riêng Fa♯ sau một phách rưỡi. Câu mới viết theo cách đọc có dấu nối, và thêm "mỗi nốt một phách" cho bè giữa. Review cần xem lại dấu nối ấy.
- **Thứ tự dòng Rachmaninoff ở `nha-soan-nhac`**: Prelude Op. 3 số 2 (chặng 7, sau Grade 8) đứng trước *Moments musicaux* số 5 (ABRSM Grade 8), trong khi dòng "Bắt đầu bằng" đi từ dễ đến khó. Giữ thứ tự cũ (n139); review quyết có đổi không.
- **Coda Clair de lune**: "dưới hay xen giữa các nốt tay phải" theo bản Fromont và tệp Mutopia; ghi chú cũ (n33 lượt 2: "ô 69–70 tay trái chạy lên trên hợp âm tay phải") không khớp bản in.
- `piano/tac-pham/mozart-alla-turca` mở khóa mà không sửa chữ: khóa lại cùng lúc với bản ghi.

## Không làm

- Bảng mức Henle đầu `tac-pham-theo-cap`: không thêm ba bài (không bắt buộc).
- Chuỗi bài "Chọn bài theo mục tiêu" ở `piano/tac-pham/index`: không thêm ba bài mới.
- `tests/tac-pham.test.mjs` (slug ví dụ), cấu hình căn mốc `tools/audio/align/`: ngoài phạm vi nhánh này.

## Review (Claude Opus 5.5, agent riêng, 17/11/2026)

Đọc diff của 12 mục mở và chữ trên bản xem; đối chiếu ảnh bản Simrock 1893 (tr. PDF 5) và Fromont 1905 (tr. PDF 18, 22–23). Mọi nhận định mới hay sửa của lần mở ghi `review: dung`, `ghi_chu` thêm "Review (Claude, 17/11/2026): …"; `nguoi.review` điền ở lần cuối của 12 hồ sơ đã mở.

- **Canon Brahms (n29)**: lượt 2 đúng (Đô♯5 nối từ phách 3 ô 48; bè giữa Đô♯4 phách 2 ô 49, mỗi nốt một phách). Chữ "hai phách sau khi bè trên vào" dễ hiểu là tính từ đầu ô 49 (đầu đoạn, có vạch nhắc lại), nên viết lại: "hai phách sau nốt Đô♯ mở đầu của bè trên, nó nhắc lại bốn nốt đầu ấy (…) ở quãng tám dưới, mỗi nốt một phách". Cùng nghĩa câu lượt 2 đã kiểm; câu không nói hai bè cùng trường độ. Sửa cả `cau`, `doi_chu`.
- **Rachmaninoff ở `nha-soan-nhac`**: dời Prelude Op. 3 số 2 (chặng 7, sau Grade 8) xuống sau *Moments musicaux* (số 5: Grade 8), cùng bước với *Études-tableaux*; *Élégie* Op. 3 số 1 đứng riêng. Sửa n139 (`cau`), `doi_chu`.
- **Clair de lune**: ô 1 và coda khớp bản Fromont (không có m.g., m.d.; ô 67 tay trái chen giữa hai nốt tay phải; ô 69–70 tay trái dưới hợp âm tay phải). Không còn chữ "bắt chéo" trên trang.
- **`cap` hai chiều**: build không lỗi; bài học hiện "Nghe kèm: Mozart: Sonata K. 331". Hướng dẫn nghe không dùng `::hoc-tiep` (như các hướng dẫn khác), link tới bài học ở "Nếu bạn muốn chơi"; ghi chú n11 sửa cho đúng.
- **`ke-hoach-mo-rong.md`**: đếm `loai: bai-hoc` theo `chang` trong `tac-pham.yml`: 8, 6, 8, 6, 9, 6 (43), khớp; chặng 7 có 6 bài, đều Lãng mạn.
- Link, kiểu dòng ở `tac-pham-theo-cap`, `hai-tay`, `ban-dap`, `tac-pham/index`, `mozart-k331`, `ke-hoach`: đúng.

Kiểm thử: `npm run build:xem` đạt; `npm test` 353 đạt, 2 bỏ qua, 0 hỏng (có `.cache/site-cu/`).

## Kiểm mẫu và khóa

Claude (agent riêng) kiểm thay chủ repo ba câu mới (brahms-intermezzo n29, debussy-clair-de-lune n43, nha-soan-nhac n192): 3 đúng. Khóa lại 12 mục 17/11/2026.
