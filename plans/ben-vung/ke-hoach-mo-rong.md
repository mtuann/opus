# Kế hoạch sau khi làm lại: việc còn lại, vận hành và mở rộng

Viết ngày 07/11/2026, sau khi đợt 0–8 và đợt 6 đã khóa xong và phần nội dung của đợt 9 đã khóa. File này để đọc là biết việc tiếp theo. Mỗi việc ghi: làm gì, ở file nào, theo thủ tục nào, ai quyết, cỡ việc (nhỏ / vừa / lớn). Trang cho người đọc tóm tắt kế hoạch này là `src/content/docs/ke-hoach.md`; đổi kế hoạch thì sửa cả hai (trang ấy đã khóa, theo thủ tục mở khóa).

Cách làm: bốn agent đọc các báo cáo (`plans/lam-lai/bao-cao/`, `plans/ben-vung/bao-cao/`), kế hoạch, `AGENTS.md`, dữ liệu và các khảo sát tác phẩm cũ (`../opus-zero/plans/v16/`), mỗi agent một góc nhìn: việc còn mở, người học, tác phẩm, vận hành. Người viết gộp, bỏ mục trùng và mục báo cáo sau đã ghi là xong. **Các mục lấy từ báo cáo có thể đã được sửa ở một lô sau: trước khi làm, đọc lại báo cáo nguồn và trang hiện tại.**

## 0. Hiện trạng

- 243 trang trên site thật (gồm bài blog của đợt 9 và trang kế hoạch), tất cả đã kiểm định và khóa; 73 bản ghi tác phẩm khóa cả bản ghi (34 bài học, 39 hướng dẫn nghe; 6 hướng dẫn nghe dùng chung bản ghi với bài học).
- Bài học theo chặng 2–7: 7, 5, 8, 5, 5, 4 (đếm trên `src/data/tac-pham.yml`; khảo sát G6 cũ ghi khác, dùng số này). Chặng 1 không có bài học tác phẩm (có `piano/10-bai-dau-tien`, `piano/hai-tuan-dau`).
- Bài học theo thời kỳ: 17/34 Lãng mạn, 7 bài Chopin; chưa có bài học Thế kỷ 20, chưa có Haydn, Scarlatti, Handel, Brahms (Scarlatti và Brahms chỉ có hướng dẫn nghe), chưa có nhà soạn nhạc nữ, chưa có tác phẩm Việt Nam.
- Kiểm mẫu của đợt 7, 8, 6 do Claude làm thay chủ repo theo lời giao (ghi ở `nguoi.kiem_mau`); kết quả ở `bao-cao/d7-gom/`, `d8-gom/`, `d6-l*-gom/kiem-mau-ket-qua.yml`.

## 1. Việc trước tiên

| Việc | Cách làm | Ai | Cỡ |
|---|---|---|---|
| Đã làm 09/11/2026 (không cần chủ repo): menu và sách theo chặng; mô tả trang trọn câu (`src/mo-ta.mjs`); CI gọn (`test.yml` chạy tay, `deploy.yml` một job); đợt hình 1–4 và chuẩn hóa hình (`bao-cao/chuan-hoa-hinh.md`); rà trang tổng quan (`bao-cao/mo-tong-quan.md`) | | agent | |
| Phần còn lại của đợt 9 | **Đã làm 10/11/2026**: Lighthouse và kiểm link trên site thật, sửa link OMT (issue #1), hàng đợt 9 của bảng Tiến độ ghi "Xong". Còn theo dõi lỗi tới 21/11/2026 | chủ repo | nhỏ |
| Chạy tay hai workflow hằng tuần lần đầu | Tab Actions: `ra-lai.yml`, `kiem-link.yml` (chưa chạy thật lần nào, `d8-gom`) | chủ repo | nhỏ |
| Chủ repo đọc lại phần kiểm mẫu Claude làm thay | Đọc `kiem-mau-ket-qua.yml` của d7, d8, d6-l1…l11; các câu "đúng có điều kiện" ghi rõ phần nào chưa kiểm lại | chủ repo | vừa |
| Repo cũ `mtuann/opus-zero` | Tạo release `v15` ở `5d08189`; quyết tắt hay giữ Pages. Site mới không còn nhắc hay trỏ tới site cũ (`mo/bo-opus-zero`, 09/11/2026) | chủ repo | nhỏ |
| Repo `mtuann/opus` công khai (09/11/2026) | Đã làm: biểu tượng GitHub (`astro.config.mjs`). Link MIT ở chân trang và link issue đã trỏ repo `mtuann/opus` từ 09/11/2026 (`mo/bo-opus-zero`, chủ repo chọn dù repo còn riêng tư) | agent | nhỏ |

## 2. Lịch định kỳ

**Hằng tuần** (tự chạy thứ Hai): `ra-lai.yml` mở issue nhãn `ra-lai` khi trang tham chiếu quá hạn; `kiem-link.yml` (lychee, link hỏng → issue `link-hong`; job `ban-thu` kiểm bản thu → issue `ban-thu`). Chạy ở máy: `node tools/ra-lai.mjs [--thang 2027-01]`. Xem tab Actions để chắc lịch chạy chưa bị GitHub tắt (repo không có hoạt động 60 ngày).

**Hằng tháng**: nâng Astro và Starlight trên nhánh riêng (`plans/lam-lai/cong-nghe.md` mục 3): `npm ci`, `npm run build`, `npm test`, `npm run test:trinh-duyet`, `npm run lighthouse`; `node tools/khoa.mjs tinh` trên `main`.

**Theo hạn `ra_lai`** (`src/data/trang.yml`). Thủ tục: `node tools/khoa.mjs mo <trang> --ly-do "rà lại"` → kiểm lại các câu dễ cũ → đặt `ra_lai` mới (không quá 12 tháng; `tests/du-lieu.test.mjs` chặn) → `khoa`.

| Tháng | Trang | Kiểm gì |
|---|---|---|
| 2027-01 | `piano/thay-va-thi`, `piano/tac-pham-theo-cap`, `tai-nguyen` | Chương trình piano ABRSM 2027–2028 bắt đầu dùng; quyết luôn các chặng lệch ABRSM (mục 4) và có kiểm từng hàng khoảng 170 bài ngoài bản ghi của `tac-pham-theo-cap` không. Nên thêm Trinity và `piano/thi-tau` |
| 2027-04 | `bat-dau/hoi-dap`, `bat-dau/ung-dung`, `lich-su/viet-nam` | Ứng dụng, giá, nền tảng; câu dễ cũ về Web MIDI trên Safari, iPhone; đơn vị, nhà hát, lịch diễn trong nước |
| 2027-06 | `lich-su/duong-dai` | Giải Pulitzer Âm nhạc (tháng 5), tin, cuộc thi |
| 2027-10 | `nhan-dien/nghe-mu`, `piano/chon-dan`, `piano/nghe-si` | 10 bản thu Commons; giá và mẫu đàn; tin nghệ sĩ |
| 2027-02 | `ke-hoach` (trang kế hoạch) | Cập nhật việc đã xong, việc mới. Trang hứa ít: "dự định", không ngày; giữ như vậy |

Trang dễ cũ ở tầng khác có `ra_soat` (hạn rà soát hằng năm, không hiện trên trang; `tools/ra-lai.mjs` và workflow liệt kê như `ra_lai`): `luyen-tap/ket-noi-midi`, `tai-lieu-tham-khao`, `lich-su/nu-nha-soan-nhac`, hạn 2027-11. Giấy phép bản thu: job `ban-thu` của `kiem-link.yml` đối chiếu hằng tuần; trang Commons có nhiều mẫu giấy phép thì `check_audio.py` đọc wikitext (`commons.license_templates`).

**Hằng năm**: rà mỗi trang tham chiếu ít nhất một lần; sao lưu repo bằng clone mirror (gồm `kiem-dinh/`) và thư mục `_imslp/` của chủ repo (chỉ có trên máy chủ repo).

## 3. Quyết định (chốt ngày 09/11/2026)

Chủ repo chốt 3.1; giao Claude chốt các mục còn lại ("quyết định sao cho phù hợp"). Nguồn ghi tắt: `d6-l4` là `plans/lam-lai/bao-cao/d6-l4.md`.

1. **`grade` lệch nguồn: giữ cách ước lượng của site** (chủ repo chốt). Bảng 5.1 giữ để tham khảo; không mở khóa `grade`.
2. **Chặng lệch ABRSM 2027–2028**: để tới lần rà `piano/tac-pham-theo-cap` tháng 1/2027 như lịch (mục 2). Danh sách: *Toccatina* (G4, site chặng 3), *Wilder Reiter* (G3, chặng 2), *The Little Shepherd* (G7, chặng 5), Nocturne B. 49 (G7, chặng 5), Nocturne Op. 72 số 1 (G8, chặng 5), Valse Op. 69 số 2 (ABRSM G8), Brahms Op. 118 số 2 (ARSM).
3. **`thoi_ky`: đã làm** (`mo/hoan-thien`). Chữ `thoi_ky` của bản ghi giữ nguyên (có trang in chữ ấy trong bảng, như "Cuối Lãng mạn"); bộ lọc "Thời kỳ" của danh mục gom về bảy thời kỳ của site theo năm sáng tác và mốc năm của `lich-su/index` (`THOI_KY`, `NHOM_THOI_KY` trong `src/plugins/thanh-phan.mjs`): "Cổ điển → Lãng mạn" (Giao hưởng số 5, 1808) là Cổ điển; "Beethoven cuối đời" (Op. 132, 1825), "Cuối Lãng mạn", "Cuối thế kỷ 19" là Lãng mạn; "Ấn tượng" là Thế kỷ 20. Cách ghi mới phải thêm vào bảng gom (kiểm thử `tests/danh-muc.test.mjs`).
4. **`nghe-nhac/index` liệt kê cả 34 bài học: giữ.** Bài học nào cũng có bản thu gợi ý và bảng "Theo dõi khi nghe", nên cũng là một trang để nghe; ô lọc Loại tách được khi cần.
5. **Thứ tự sách in: đã làm** (09/11/2026): bài học trong menu và sách xếp theo chặng của dữ liệu.
6. **Trang Cập nhật: đã làm** (09/11/2026): bỏ tên và địa chỉ site cũ, giữ nhật ký v1–15 như lịch sử của "bản trước". `them_ngay` cho 73 bản ghi cũ: không đặt.
7. **Lượt 2 bổ sung để thêm ý mới (Grieg "mặt trời ló dạng", thư Handel 1780): không làm bây giờ.** Trang không thiếu gì khi không có hai ý ấy; thêm thì làm khi trang được mở vì việc khác (ghi ở `d6-l11-gom`, `d6-l9-gom`).
8. **Giấy phép bản thu: đã làm** (`mo/hoan-thien`): ghi ở `note` của `ban_thu`, không đổi `nghe.js`. Invention số 1 (Marcelle Meyer, 1948): "Commons ghi phạm vi công cộng, ở Mỹ còn được bảo hộ nên chỉ dẫn link"; *Préludes* của Debussy đã có ghi chú như vậy; Rachmaninoff số 2: "Commons ghi phạm vi công cộng, IMSLP ghi CC BY-SA 3.0".
9. **Tác phẩm mới (bản thu chỉ dẫn link, trích đoạn chép tay từ bản quét, cấp chỉ ước lượng)**: thuộc phần thêm bài mới (mục 6), quyết trước đợt thêm 2.
10. **Lựa chọn trình bày nhỏ: giữ cả bốn.** Chip "♩ = 100 (Schumann)" là chỉ dẫn tốc độ của chính tác giả, ghi rõ nguồn; chữ "Đỏ" là tên nhóm màu trong chú giải, khớp với các hình khác; năm 1825 của Op. 132 là năm sáng tác; tên *Ouverture solennelle "1812"* là tên gốc.
11. **Công cụ đọc nốt ở trang chủ: không thêm.** Trang chủ đã có "Hôm nay tập gì?" và lối vào Luyện tập; giữ trang chủ nhẹ (Lighthouse).

## 4. Sửa trang đã khóa

Mỗi việc theo thủ tục mở khóa (`plans/ben-vung/chuan-kiem-dinh.md` mục 7), nhánh `mo/<tên ngắn>`. Gom các sửa nhỏ cùng trang vào một nhánh.

### 4.1 Đã sửa (nhánh `mo/sua-nho`, 07/11/2026; báo cáo `plans/ben-vung/bao-cao/mo-sua-nho.md`)

- Valse Si thứ chuyển từ hàng chặng 5 sang hàng chặng 6 ở `piano/not-lap-not-kep` và `piano/quang-tam-buoc-nhay` (dữ liệu: chặng 6).
- `hinh-thuc/minuet-trio`: link ghi rõ "Hướng dẫn nghe chương 1" (Eine kleine, số 40) và "chương 2" (số 94); câu dẫn ví dụ thành "cùng tác phẩm với hướng dẫn nghe chương 1".
- `piano/lo-trinh` n37: "khoảng năm phút" thành "khoảng 4–5 phút".
- `schumann-traumerei` n54 (nốt dưới "thật nhỏ", khối ghi *p*), n72 ("các bè độc lập hơn (hai bè ngang nhau)"); `mozart-k545` n55 ("sang Fa (ô 2: sang Mi)"); `debussy-clair-de-lune` n61 (vòng cung ở ô 1–3); `schubert-impromptu-sol-giang` n61 ("phần lớn với móc đơn chùm sáu"); `schumann-album` n69 ("có lẽ là bản nổi tiếng nhất").
- Chỉ sửa hồ sơ (trang không đổi): `chopin-nocturne-op9-2` n9 đổi nhãn thành `khuyen-tap`; `nghe-nhac/liszt-liebestraum` n35 bỏ chữ "Link"; `piano/not-lap-not-kep` n11 bỏ chữ "Sol♯" sai.
- Dữ liệu: `bizet-habanera` thêm `danh_muc: GB 9; WD 31` (IMSLP).

### 4.2 Đã xem, không sửa

- "Láy rền ngắn" và "láy trên": `piano/not-hoa-my` dùng cả hai và giải thích (cách đọc Baroque của ký hiệu răng cưa không gạch là một láy rền ngắn; tên ký hiệu là láy trên), khớp Từ điển. Không lệch.
- "Nốt cảm", "dấu ngân": không còn trên trang (đã sửa ở các lô trước).
- *Clair de lune*, "Sau Grade 8" và Liebestraum "Grade 8 trở lên": là chữ của trường `grade` đã khóa, gộp vào quyết định 3.1.
- Link NIFC ở Prélude Mi thứ: kiểm link hằng tuần không báo hỏng; giữ.
- `description` của Mùa xuân: câu bị cắt trước phần đã sửa, không trái với thân trang (`d6-l8`); giữ.
- Valse La thứ, "in năm 1860 dưới tên Charlotte de Rothschild": IMSLP (bậc 2) đỡ; giữ.

### 4.3 Còn lại

1. Ba sonata Scarlatti: phần cuối chưa đối chiếu bản nhạc. **Đã làm (09/11/2026, `mo/scarlatti`)**: chủ repo tải tay ba MIDI IMSLP (Pierre Gouin, Éditions Outremontaises 2013, CC BY-SA 4.0) và gửi ảnh trang 1 bản Longo; K. 141 kết Rê thứ, K. 466 nửa sau về Fa thứ, K. 380 có đoạn "vần" ở Mi trưởng. Hồ sơ `nghe-nhac/scarlatti-sonata`: n14, n29, n30, n31 lượt 2 thành `dung`. `d6-l7-gom`.
2. **Đã làm** (`mo/hoan-thien`, 09/11/2026): trong 7 bài còn "(ước lượng)", 3 bài có trong đề cương ABRSM nay ghi đề cương (Sonatina Sol trưởng Anh. 5: chương 1, Grade 2, 2025–2026; Clementi Op. 36 số 1: chương 3, Grade 3, 2023–2024; Bài ca Pháp cổ: Grade 3, 2019–2020); 4 bài không có trong đề cương nào (BWV 939, *La candeur*, Minuet Sol trưởng, K. 2) giữ "(ước lượng)".
3. Trang nghệ sĩ: Pires ngừng biểu diễn sau đột quỵ 11/2025; kiểm không còn link tới `luonghuetrinh.com`. Làm cùng lần rà 2027-10 (cần nguồn tin). `d2-0`. Nhỏ.
4. **Đã chốt** (09/11/2026): `ghi_chu` là nhật ký lúc kiểm, không viết lại (`chuan-kiem-dinh.md` mục 5); "Còn mở" của `beethoven-anh-trang` nối câu ghi đã xong.

## 5. Dữ liệu

### 5.1 `grade` đã khóa lệch nguồn (quyết ở mục 3.1)

| Bài | `grade` đã khóa | Nguồn nói |
|---|---|---|
| BWV 939 | G3 | RCM Level 5, khoảng G4 |
| Arabesque (Burgmüller) | G3 | ABRSM G2 |
| Prélude La trưởng | G3–4 | Henle mức 4 |
| Prélude Mi thứ | G5 | RCM Level 7 |
| Gymnopédie | G4 | Henle mức 2 |
| Op. 49 số 2 | G5 | RCM Level 8 |
| *Ánh trăng* | G6–7 | Henle mức 4 |
| *Träumerei* | G6 | Henle mức 5 |
| Nocturne Op. 9 số 2 | G7 | RCM Level 9, Henle mức 6 |
| Liebestraum | G8+ | không có ABRSM; RCM ARCT |

### 5.2 Bản thu và mốc

- Mốc chưa đo: `schubert-impromptu` dòng 3 **đã đo** (09/11/2026, `tools/audio/align`, bản nhạc ASAP: ô 24 ở 94 giây); Scarlatti K. 380 dòng 2 **đã đo** (09/11/2026, MIDI IMSLP: ô 19 ở 37 giây). Còn lại cần người nghe đo tay (không có bản nhạc số để căn): `mozart-concerto-21` dòng 10; Gershwin 6 dòng; Grieg 3 dòng; Rachmaninoff 1 dòng. Ghi bằng `tools/audio/attach.py --ref`. `d6-l5`, `d6-l7-gom`, `d6-l8-gom`. Vừa.
- Thiếu bản thu: **đã làm phần lớn (10/11/2026, `mo/ban-thu`)**: 13 hướng dẫn nghe có bản thu Commons dùng tự do ở Mỹ (Bach Air, Tổ khúc cello 1, Beethoven 5, Habanera, Brahms 4, Dvořák Largo, Grieg, Hallelujah, Mozart 40, Nữ hoàng bóng đêm, Erlkönig, 1812, Mùa đông chương 1); K. 141, K. 466 (John Sankey) và K. 545 chương 2 (Jason M. C. Han) là "Bản thu khác" của khối nghe. Còn thiếu: Haydn 94, Beethoven Op. 132, Mendelssohn violin (bản Hankyung tải từ YouTube, chưa xác nhận giấy phép), Mozart Requiem, Puccini, Ravel, Schubert Cá hồi, Stravinsky, Hồ thiên nga (chỉ có bản thu còn bảo hộ ở Mỹ hay bản tổng hợp), Pärt, Shostakovich (tác phẩm còn bảo hộ); K. 545 chương 3. Theo dõi các bản thu cũ vào phạm vi công cộng ở Mỹ: 2028 (Pertile, Kennedy Scott, Landon Ronald), 2030 (Koussevitzky), 2031 (Ravel), 2034 (Barbirolli).
- `bizet-habanera` `danh_muc`: đã thêm (mục 4.1).

### 5.3 Thuật ngữ còn thiếu trong `src/data/thuat-ngu.yml`

Khoảng 200 mục, gom thành một việc dữ liệu riêng chia vài lô (mỗi lô kiểm định, khóa; trang Từ điển tự dựng bằng `::tu-dien`). Danh sách đủ ở ghi chú lượt 1 (`plans/lam-lai/bao-cao/d6-l*/luot-1-*.md`, `d6-l2.md` … `d6-l11.md`, `d8-l2.md`, `d8-l3.md`). Nhóm chính:

**Đã làm (10/11/2026, `mo/thuat-ngu`)**: 228 thuật ngữ trong năm lô T1–T5 (hình thức và thể loại 50, chỉ dẫn diễn tấu 38, nhạc lý 94, piano 13, nhóm mới "Nhạc cụ và giọng hát" 33), mỗi bản ghi một hồ sơ, lượt 1 và lượt 2 do hai agent con khác nhau. Chưa thêm (không có nguồn bậc 1–2 đọc được): harmonic rhythm, secondary dominant, cent, double notes, half pedal. Danh sách dưới đây còn vài mục chưa làm (Singspiel đã có; Eingang, tintinnabuli, bariolage, Janissary…): làm khi có nguồn.

- **Hình thức và thể loại**: trio, biến tấu kép, bagatelle, mazurka, invention, barcarolle, impromptu, ballade, intermezzo, prélude, rhapsody, fugue kép, canon, passacaglia, chaconne; các điệu nhảy của tổ khúc (allemande, courante, sarabande, gigue); Lied, recitative, Singspiel, chorale, ritornello, âm nhạc chương trình.
- **Chỉ dẫn diễn tấu**: poco moto, ma non troppo, alla breve, smorzando, risoluto, con anima, calando, portato, con fuoco, pesante, stringendo, Tempo primo, tasto solo…
- **Hòa âm, kỹ thuật**: nhịp điệu hòa âm, Alberti, chùm ba, đa tiết tấu, đảo phách, hợp âm Napoli, hợp âm sáu tăng, trung âm hóa, Lydian, continuo, tintinnabuli, đạp nửa, bắt chéo tay, pizzicato…
- **Nhạc cụ và giọng**: viola, cello, contrabass, oboe d'amore, cor anglais, celesta, fortepiano, mezzo-soprano, baritone; khoảng 25 mục của trang Nhạc cụ.
- **Viết tắt**: HIP, WoO, Op. posth.

## 6. Mở rộng nội dung

Tác phẩm chỉ thêm, theo `plans/ben-vung/them-tac-pham.md` (nhánh `them/<slug>`, `node tools/them-tac-pham.mjs`). Mở rộng lõi (nhạc lý, kỹ thuật, luyện tai) là "đợt mở rộng lõi": lập kế hoạch đợt như `plans/lam-lai/README.md`, kiểm định đủ trước khi gộp (`ben-vung/README.md`, Vận hành 4).

### 6.1 Tác phẩm (bài học)

Chỗ cần lấp: chặng 7, Thế kỷ 20 và Ấn tượng, nhà soạn nhạc nữ, Haydn. Thứ tự làm theo các đợt thêm trong bảng (đợt 1 làm thử quy trình). Nguồn khảo sát: `../opus-zero/plans/v16/khao-sat-g6.md`, `khao-sat-g4c.md`; đọc lại giấy phép trước khi dùng.

| Đợt thêm | Bài | Chặng | Sẵn sàng | Rủi ro, việc cần quyết |
|---|---|---|---|---|
| 1 (làm thử quy trình) | Mozart, *Alla turca* K. 331/III | 6 | Mutopia, kern; bản thu Greiss trên Commons, phát được | ABRSM 2027–2028 đã bỏ bài này; thêm `cap` phải mở khóa bản ghi `mozart-k331` |
| 1 | Debussy, Arabesque số 1 | 6 | Mutopia (Durand 1904); bản thu Prati, phát được | Cấp chỉ ước lượng |
| 1 | Rachmaninoff, Prelude Đô♯ thứ Op. 3 số 2 | 7 | Mutopia; bản thu của chính tác giả (1919), phát được | Ồn mặt đĩa; cấp lệch trang tham chiếu |
| 2 (Thế kỷ 20) | Gretchaninov, *Grandfather's Album* Op. 119 (2–3 bài) | 3 | Chép tay từ bản Schott 1929; bản thu chỉ dẫn link | Cấp ước lượng |
| 2 | Bartók, *Romanian Folk Dances* | 5 | Mutopia có điệu số 2; bản thu CC0 chỉ dẫn link | Phải dùng bản in trước 1934 |
| 2 | Bartók, *For Children* I/1, I/6 (bản 1909) | 2 | Chép tay; bản thu chỉ dẫn link | Bản sửa 1946 còn bảo hộ ở Mỹ |
| 3 (nhà soạn nhạc nữ) | Chaminade, *Pierrette* Op. 41 | 6 | Bản thu chỉ dẫn link | Kiểm năm in đầu |
| 3 | Clara Schumann, Scherzo Op. 14 | 6 | Bản thu chỉ dẫn link | Bằng chứng cấp yếu |
| 3 | Fanny Hensel, *Mélodie* Op. 4 số 2 | 6 | **Chưa có bản thu được nhận** | Thay tạm: Backer Grøndahl *Klage*, Chaminade *Automne* (chặng 7) |
| 4 (lấp chỗ trống) | Một sonata Haydn (Hob. XVI) | 4–5 | Cần khảo sát | Chưa có bài Haydn nào |
| 4 | Chặng 7 không Lãng mạn: một Prelude và Fugue trong Bình quân luật; một sonata Beethoven trọn vẹn | 7 | Cần khảo sát | Chặng 7 hiện chỉ có 4 bài Lãng mạn |
| 4 | Dự phòng: Granados Op. 1; Bartók Sonatina; Debussy *Golliwogg's Cakewalk* | 4–6 | Một phần có bản thu phát được | Xem khảo sát |
| 5 | Tác phẩm Việt Nam hết bảo hộ (tác giả mất từ 1975 trở về trước), bài chặng 1 dùng dân ca Việt Nam | 1–6 | Cần khảo sát bản quyền riêng | Nguồn bản nhạc |

Chặng 6 sẽ đông nhất sau đợt 1 và 3 (khoảng 9–10 bài); cân nhắc khi chọn bài.

### 6.2 Hướng dẫn nghe

- Mỏng: Ấn tượng (1), Thế kỷ 20 (4), Đương đại (1); chưa có Trung cổ, Phục hưng, chưa có hướng dẫn nghe nào của nhà soạn nhạc nữ.
- Ý tưởng sẵn bản thu phát được: *Golliwogg's Cakewalk*, Bartók Sonatina, Chaminade *Automne*, Backer Grøndahl *Klage*, Chopin B. 49 và Op. 64 số 2.
- Mở rộng theo chương: *Ánh trăng* đủ ba chương; chương 3 cho `haydn-94`, `mozart-40`, `mozart-eine-kleine` (cùng việc sửa `hinh-thuc/minuet-trio`).
- Nhạc in sau 1930 còn bảo hộ ở Mỹ: chỉ trích dẫn ngắn, bản thu chỉ dẫn link.

### 6.3 Nhạc lý (mở rộng lõi)

Nhịp 2/2, 3/8, 6/4; canon và mô phỏng (chuẩn bị cho Bach); đọc nhiều bè trên một khuông; hộp "Trên phím đàn" cho bài 15–32; kiểm lại bài 19 xem đã có chuyển giọng xa và qua đồng âm chưa.

### 6.4 Kỹ thuật piano

Trang "Nhiều bè và làm nổi bè" (voicing); "Rubato và câu nhạc"; lộ trình etude theo chặng (Czerny, Heller…); **đệm hát bằng ký hiệu hợp âm** (nhu cầu thực tế của người lớn; nền đã có ở `nhac-ly/27-ky-hieu-hop-am`, `piano/hoa-am/`); trích đoạn từ bản gốc đối chiếu từng nốt cho khoảng 13 bài học hiện chỉ có bài tập soạn riêng.

### 6.5 Luyện tai và công cụ

Công cụ nhận ra loại kết, thể đảo, chỗ chuyển giọng; chép hai bè; xướng âm theo chặng; bộ bài thị tấu theo chặng có tự chấm (ghép với `phieu-bai-tap`). Công cụ mới làm theo mục "Thêm công cụ" ở mục 8.

### 6.6 Lịch sử và bối cảnh

Khối "Nhạc phím thời này" cho mỗi trang thời kỳ; hướng dẫn nghe một tác phẩm Việt Nam.

### 6.7 Lấy ý kiến người học

Đến nay mọi lần sửa đều xuất phát từ rà soát. Mở kênh góp ý; nhờ vài người ở các trình độ theo lộ trình vài tuần, ghi chỗ họ vướng; chọn việc tiếp theo theo phản hồi. Vừa.

## 7. Nợ kỹ thuật

Xếp giảm dần.

1. Khuông nhạc có thể câm khi iPhone ở chế độ im lặng (`src/scripts/abc.js`, Web Audio). `AGENTS.md` và `d8-gom` ghi khác nhau: thử trên máy thật trước. Vừa.
2. **Đã đo lại** (09/11/2026, 243 trang, ba lần): `bat-dau/tom-tat` hiệu năng trung vị 100 (một lần 92), trang chủ 100, `piano/gam` 100; trợ năng, thực hành tốt, SEO đều 100.
3. **Đã kiểm** (09/11/2026): `tepDauVet` (`src/du-lieu.mjs`) tính cả `src/scripts/*.js`, `src/plugins/`, hình tĩnh; có kiểm thử ở `tests/du-lieu.test.mjs`.
4. **Đã sửa** (09/11/2026): `commons.license_templates` đọc mọi mẫu giấy phép trong wikitext; `check_audio.py` nhận `lic` của bản ghi khi có trong các mẫu ấy (cảnh báo, không lỗi). Kiểm thử ở `tools/audio/tests/`.
5. Schema dữ liệu: `khoang` áp cho cả cặp năm; `thoi_ky` là chữ tự do; `nha-soan-nhac.yml` thiếu trường vai trò. Vừa (dữ liệu dùng chung, review mức Lớn).
6. **Đã sửa** (09/11/2026): nguyên nhân là `id` của bản thu là `Date.now()`, hai bản lưu cùng mili giây (Firefox làm tròn đồng hồ) ghi đè nhau. Nay `id` luôn lớn hơn mọi `id` đã có (`src/scripts/thu-am.js`). Phép thử ở trang Nghe mù chưa thấy lặp lại.
7. **Đã xong** (09/11/2026): `chuyen.mjs` ghi frontmatter bằng `yaml.stringify`, đặt nháy đúng (đã thấy ở D8-L3); nút chép của khối mã nay là "Chép vào bộ nhớ tạm" / "Đã chép!" (`src/content/i18n/vi.json`).
8. **Đã ghi** (09/11/2026) vào bảng "Nguồn và cách mở" của `chuan-kiem-dinh.md`.

## 8. Làm X thế nào

| Việc | Thủ tục, file |
|---|---|
| Thêm tác phẩm | `plans/ben-vung/them-tac-pham.md`; `node tools/them-tac-pham.mjs <slug> --loai bai-hoc|nghe …`; nhánh `them/<slug>`; bản thu: `tools/audio/attach.py` |
| Sửa trang đã khóa | `node tools/khoa.mjs mo <trang> --ly-do "…"` → sửa, ghi `doi_chu` → kiểm định câu bị chạm → điền lần mới trong `lan` → `khoa`; `chuan-kiem-dinh.md` mục 7 |
| Rà trang tham chiếu | Như trên, rồi đặt `ra_lai` mới trong `src/data/trang.yml` |
| Thêm thuật ngữ | Bản ghi mới trong `src/data/thuat-ngu.yml` (đúng `nhom`) → `node tools/khoa.mjs mau du-lieu/thuat-ngu/<id>` → kiểm định → `khoa` |
| Thêm công cụ | Thành phần trong `CONG_CU` (`src/plugins/thanh-phan.mjs`), script ở `src/scripts/`, loại khối ở `KHOI` (`tools/trang-mau.mjs`), kiểm thử ở `tests/`; ghi vào `AGENTS.md` |
| Thêm trang lõi mới | Lập đợt mở rộng lõi (lô, lượt 1, gom: lượt 2, review, kiểm mẫu, khóa) như `plans/lam-lai/README.md`; trang mới cần dòng trong `src/data/trang.yml` |
| Kiểm mẫu, khóa một đợt | `node tools/khoa.mjs xuat <lô> --mau <n>` → kiểm → ghi `kiem-mau-ket-qua.yml`, điền `nguoi.kiem_mau` ở lần cuối của mọi hồ sơ → `khoa`; `khoa` báo câu thiếu nguồn thì sửa hồ sơ (ghi nguồn đã đọc, hay `khong-can-nguon` cho lời khuyên tập không dính sức khỏe) |
| Mức review | `AGENTS.md`, mục "Review và gộp" |

## Ghi chú về cách viết

Trang `ke-hoach` cho người đọc đã qua một lượt kiểm độc lập (agent không viết trang): bỏ các chữ hứa quá ("sẽ ghi lại", "sẽ được sửa", "sắp thêm", "chỉ được thêm khi đủ bốn điều"), sửa "các chặng giữa" thành "chặng 2–5", thêm câu "vẫn có thể còn sót". Khi sửa trang, giữ cách viết ấy: chỉ nói dự định, không hứa ngày, không viết tay con số về site.
