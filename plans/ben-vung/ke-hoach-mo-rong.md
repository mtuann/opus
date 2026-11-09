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
| Phần còn lại của đợt 9 | Theo `plans/lam-lai/bao-cao/d9.md` mục Việc còn lại: Lighthouse và kiểm link trên site thật sau khi đăng; theo dõi lỗi hai tuần (tới 21/11/2026); đổi hàng đợt 9 của bảng Tiến độ thành "Xong" | agent, chủ repo | nhỏ |
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

Nên thêm `ra_lai` (hay một lần rà mỗi năm) cho các trang dễ cũ chưa có hạn: `luyen-tap/ket-noi-midi` (hỗ trợ Web MIDI của trình duyệt), `tai-lieu-tham-khao`, `lich-su/nu-nha-soan-nhac`, và giấy phép bản thu của mọi trang tác phẩm (đọc trang mô tả file, vì `commons.py` có thể báo sai).

**Hằng năm**: rà mỗi trang tham chiếu ít nhất một lần; sao lưu repo bằng clone mirror (gồm `kiem-dinh/`) và thư mục `_imslp/` của chủ repo (chỉ có trên máy chủ repo).

## 3. Quyết định chờ chủ repo

Xếp theo mức ảnh hưởng. Nguồn ghi tắt: `d6-l4` là `plans/lam-lai/bao-cao/d6-l4.md`.

1. **Chính sách `grade` lệch nguồn** (sửa phải mở khóa `grade` của bản ghi): giữ "≈ Grade" theo cách ước lượng của site, hay theo nguồn. Danh sách ở mục 5.1. Nguồn: `d6-l2-gom` … `d6-l6-gom`. Vừa.
2. **Chặng lệch ABRSM 2027–2028**: *Toccatina* (G4, site chặng 3), *Wilder Reiter* (G3, chặng 2), *The Little Shepherd* (G7, chặng 5), Nocturne B. 49 (G7, chặng 5), Nocturne Op. 72 số 1 (G8, chặng 5), Valse Op. 69 số 2 (ABRSM G8), Brahms Op. 118 số 2 (ARSM). Quyết ở lần rà tháng 1/2027. Nguồn: `d8-gom`, `d8-l1`. Vừa.
3. **Thống nhất `thoi_ky`** (sửa phải mở khóa bản ghi): Beethoven ghi ba cách ("Cổ điển → Lãng mạn", "Cổ điển", "cuối đời"); Debussy *Clair de lune* "Ấn tượng" hay "Cuối thế kỷ 19" như trang mục lục; Satie. Nên chốt một bộ giá trị cố định trong schema. Nguồn: `d6-l10-gom`, `d6-l5`, `d6-l3`. Nhỏ.
4. **`nghe-nhac/index` liệt kê cả 34 bài học** (ô lọc Loại): giữ, hay chỉ hướng dẫn nghe (`::danh-muc-tac-pham{loai="nghe"}`). Nguồn: `d6-l11-gom`. Nhỏ.
5. **Thứ tự sách in** (`THU_TU_TAC_PHAM` theo chặng cũ) hay theo chặng trong dữ liệu. Nguồn: `d6-l11`. Nhỏ.
6. **Trang Cập nhật**: giữ nhật ký v1–15 của Opus Zero hay rút thành một đoạn và link sang site cũ; `them_ngay` cho 73 bản ghi cũ (đề xuất: không đặt). Nguồn: `d7-l3`, `d6-0`. Nhỏ.
7. **Lượt 2 bổ sung để thêm ý có nguồn mới**: Grieg "mặt trời ló dạng" (thư gửi Hennum 14/12/1875, GGA tập 18); Handel, vế "lời kể sớm nhất là thư năm 1780". Nguồn: `d6-l11-gom`, `d6-l9-gom`. Vừa.
8. **Giấy phép bản thu cần ghi chú**: Rachmaninoff (Commons ghi phạm vi công cộng, IMSLP ghi CC BY-SA 3.0); Marcelle Meyer (khối nghe in "phạm vi công cộng" trong khi trang nói còn bảo hộ ở Mỹ): dùng `note` của `ban_thu` hay đổi cách `nghe.js` hiện nhãn. Nguồn: `d6-l8-gom`, `d6-l4-gom`. Nhỏ.
9. **Có nhận cho tác phẩm mới**: bản thu chỉ dẫn link (không phát được), trích đoạn chép tay từ bản quét, cấp độ chỉ ước lượng (pianosyllabus, Henle) không. Quyết trước đợt thêm 2 (mục 6.1). Vừa.
10. **Lựa chọn trình bày nhỏ**: chip "♩ = 100 (Schumann)" của *Träumerei*; chữ "Đỏ" cho màu #e9b3a6 ở ba hình; năm 1825 của Op. 132; tên *Ouverture solennelle "1812"*. Nguồn: `d6-l4`, `d6-l9`, `d6-l10`. Nhỏ.
11. **Công cụ đọc nốt ở trang chủ** ("Thử ngay: đọc một nốt" của trang chủ cũ), mở khóa `index`. Nguồn: `README` đợt 7. Nhỏ.

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

1. Ba sonata Scarlatti: phần cuối chưa đối chiếu bản nhạc (bản Longo trên Internet Archive). `d6-l7-gom`. Vừa.
2. Bỏ "(ước lượng)" ở dòng Độ khó của các bài có trong đề cương ABRSM/Trinity, làm một lần cho mọi bài (kiểm lại trước: lô 3–4 đã bỏ). `d6-l1`, `d6-l2`. Vừa.
3. Trang nghệ sĩ: Pires ngừng biểu diễn sau đột quỵ 11/2025; kiểm không còn link tới `luonghuetrinh.com`. Làm cùng lần rà 2027-10 (cần nguồn tin). `d2-0`. Nhỏ.
4. `ghi_chu` lỗi thời trong hồ sơ đã khóa (không đổi trang, không cần mở khóa vì mã băm chỉ tính trang): nhiều câu `ve-site` còn ghi "chưa chuyển, sắp có"; `beethoven-anh-trang` "Còn mở: n17, n87". `d6-l10`, `d6-l7`, `d6-l4`. Vừa.

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

- Mốc chưa đo (đo tay, ghi bằng `tools/audio/attach.py --ref`): `schubert-impromptu` dòng 3; `mozart-concerto-21` dòng 10; Scarlatti K. 380 dòng 2; Gershwin 6 dòng; Grieg 3 dòng; Rachmaninoff 1 dòng. `d6-l5`, `d6-l7-gom`, `d6-l8-gom`. Vừa.
- Thiếu bản thu: bảy trang không có bản thu (có `mozart-requiem`), K. 141, K. 466; K. 545 chỉ có chương 1; có thể thêm Mùa đông chương 1 (John Harrison, CC BY-SA 4.0). Theo dõi các bản thu cũ vào phạm vi công cộng ở Mỹ: 2028 (Pertile, Kennedy Scott, Landon Ronald), 2030 (Koussevitzky), 2031 (Ravel), 2034 (Barbirolli).
- `bizet-habanera` `danh_muc`: đã thêm (mục 4.1).

### 5.3 Thuật ngữ còn thiếu trong `src/data/thuat-ngu.yml`

Khoảng 200 mục, gom thành một việc dữ liệu riêng chia vài lô (mỗi lô kiểm định, khóa; trang Từ điển tự dựng bằng `::tu-dien`). Danh sách đủ ở ghi chú lượt 1 (`plans/lam-lai/bao-cao/d6-l*/luot-1-*.md`, `d6-l2.md` … `d6-l11.md`, `d8-l2.md`, `d8-l3.md`). Nhóm chính:

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
2. Lighthouse của `bat-dau/tom-tat` sát ngưỡng 95 vì menu lớn (`src/nhom.mjs`, sidebar); đo lại với 241 trang. Vừa.
3. Sửa `src/scripts/*.js` mà plugin dùng lúc build thì bản dev có thể không dựng lại (`d8-gom`; `AGENTS.md` ghi D8-L1 đã làm, kiểm lại). `dauVet` đã tính `tac_pham` của các trang (commit `9b9bb48`). Nhỏ.
4. `tools/audio/commons.py` báo sai giấy phép khi trang mô tả có cả mẫu PD cho tác phẩm lẫn CC cho bản thu; `check_audio.py` không cho ghi `lic` khác Commons. Vừa.
5. Schema dữ liệu: `khoang` áp cho cả cặp năm; `thoi_ky` là chữ tự do; `nha-soan-nhac.yml` thiếu trường vai trò. Vừa (dữ liệu dùng chung, review mức Lớn).
6. Kiểm thử trình duyệt chập chờn (`tests/trinh-duyet/kiem-luyen-tap-d7.mjs:189` trên Firefox, trang Nghe mù). Nhỏ.
7. `tools/chuyen/chuyen.mjs` không đặt nháy cho `description` có dấu `:`; nút chép của khối mã còn chữ tiếng Anh (`astro.config.mjs`). Nhỏ.
8. Ghi thêm vào `chuan-kiem-dinh.md` các cách mở nguồn đã dùng: IIIF/LIDO của Brahms-Portal, `api.nb.no`, lời tựa Bärenreiter `/prefaces/<ISMN>.pdf`, BL `searcharchives` `.json`, API của IMSLP và Commons, bản Mutopia trên GitHub (`raw.githubusercontent.com/MutopiaProject/MutopiaProject/master/ftp/…`) khi mutopiaproject.org bị chặn. Nhỏ.

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
