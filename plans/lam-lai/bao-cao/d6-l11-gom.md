# D6-L11-gom: lượt 2 và review của 8 hướng dẫn nghe, 2 trang mục lục và 8 bản ghi

Nhánh `moi/d6-l11-gom`, ngày 06/11/2026. Review: Claude Opus 5.5. Người review không làm lượt 1 hay lượt 2 và không dùng agent con. Phần mã (danh mục, sách in) đã review và kiểm lại riêng (`d6-l11.md`, mục Mã); review này chỉ xét nội dung và các câu `ve-site` về danh mục. Không khóa gì, không push.

## Lượt 2

Danh sách: `d6-l11-nhan-dinh.yml` (trang, chia `d6-l11-gom/trang-1.yml`, `trang-2.yml`) và `d6-l11-nhan-dinh-du-lieu.yml` (`d6-l11-gom/du-lieu.yml`). Kết quả thô: `d6-l11-gom/ket-qua-*.yml`, đã `nhap`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (brahms-4, dvorak-9-largo, grieg-buoi-sang, part-spiegel, nghe-nhac/index, piano/tac-pham/index) | 121 | 118 | 1 | 2 | 61 |
| Trang, phần 2 (puccini-nessun-dorma, ravel-bolero, shostakovich-5, stravinsky-sacre) | 117 | 116 | 0 | 1 | 61 |
| Bản ghi (8, lần 2) | 28 | 28 | 0 | 0 | 2 |
| **Tổng** | **266** | **262** | **1** | **3** | **124** |

Cần review gồm:
- câu lượt 2 `sai` (1) hay `khong-chac` (3);
- câu lượt 1 đã sửa hay đã bỏ mà lượt 2 ghi `dung` (119);
- câu lượt 1 chưa có kết quả (1: bản ghi `shostakovich-5` n10).

Lượt 2 gỡ được ba điểm lượt 1 để ngỏ:
- `brahms-4`: 30 biến tấu và coda (Bach-cantatas, BSO, ASO); Brahms chỉ huy buổi đầu (BSO, LA Phil);
- `part-spiegel` n5, n14: Fa trưởng (Interlude, bài FAZ in trên trang ECM).

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L11-gom: …". Đã review 174 câu:
- 46 câu `ve-site`: 44 `review: dung`, 2 `review: sai`;
- 124 câu cần review: đều `review: dung`, sau khi sửa ở các chỗ ghi dưới đây;
- 4 câu lượt 2 ghi `dung` mà lời giao nêu là nguồn yếu hay nên sửa chữ: `part-spiegel` n6, `stravinsky-sacre` n7, n11, `ravel-bolero` n5.

Lần kiểm định cuối của 18 hồ sơ (10 trang, 8 bản ghi) đã có `nguoi.review`.

### Câu về chính site (46 câu)

Review kiểm trên `src/content/docs/`, `kiem-dinh/khoa.json`, `src/data/`, các module dựng phần sinh ra, và bản xem vừa build:
- **Link tới trang đã khóa:** `hinh-thuc/bien-tau`, `nhac-ly/15-…`, `nhac-ly/16-…`, `nhac-ly/am-hoc`, `nhac-cu/dan-nhac`, `lich-su/opera`, `lich-su/nha-soan-nhac`, `lich-su/thoi-ky/lang-man`, `lich-su/thoi-ky/the-ky-20`, `tai-lieu-tham-khao`, `piano/10-bai-dau-tien`, `piano/tac-pham-theo-cap`, `piano/hai-tay`, `piano/cach-tap`, `piano/nghe-si`, `luyen-tap/nhat-ky`, `bat-dau/lo-trinh-choi`, `bat-dau/lo-trinh-nghe`, `nhan-dien/index`. Điều câu nói về trang đích có thật ở đúng dòng: mục "Gam ngũ cung", dòng Oboe, "Opera ở Việt Nam", "Chuỗi bồi âm" đánh số từ 1, "Ô nhịp không đều và đổi nhịp", "Cách đọc danh mục", Bài 9 và 10, 12 bảng "Tai và nghe", "30 tác phẩm piano nên nghe"…; id `edvard-grieg-18431907` có trong bản build.
- **Link tới trang chưa khóa:** `nghe-nhac/mau`, `nghe-gi-tiep`, `doc-ten-tac-pham`, `beethoven-5`, `mendelssohn-violin`, `tchaikovsky-ho-thien-nga`, năm trang "Cùng tác phẩm", `piano/tac-pham/bach-prelude-do`. Các trang này có ở bản xem; bản thật hiện "sắp có". Hồ sơ `brahms-4` n26 và `stravinsky-sacre` n21 còn ghi "chưa chuyển": các trang đích đã chuyển ở D6-L10, review ghi lại.
- **Khối abc của `part-spiegel`** (n16): bè T là nốt của hợp âm Rê thứ gần nhất phía dưới bè M, ở cả 9 nốt.
- **Danh mục và bài học:** `danhMucTacPham`, `mucDanhMuc`, `hopTacPham`, `src/scripts/danh-muc.js`, `nghe.js`, `MUC` của `tools/them-tac-pham.mjs`, `tac-pham.yml`:
  - 34/34 bài học có `ban_thu`; 33 có mp3, `bach-invention-1` chỉ có file .ogg;
  - 15/39 bản ghi nghe có `ban_thu`, 39/39 có `luyen_nghe`;
  - chín chuỗi "từ dễ đến khó" không giảm chặng;
  - năm bộ chương trình nhỏ có chặng gần nhau và ba thời kỳ khác nhau.

| Câu | Kết quả |
|---|---|
| `piano/tac-pham/index` n7 (bài tập chuẩn bị "viết trên khuông hai tay có số ngón") | **Sai một phần.** Đếm 98 khối abc ở 34 bài học: số khối (30 bài có 3, 4 bài có 2) đúng. Nhưng 8 khối chỉ có một khuông (một tay), và 2 khối không ghi số ngón (`burgmuller-arabesque` khối 2, `fur-elise` khối 3). Sửa trang thành "…soạn riêng trên khuông nhạc, phần lớn cho hai tay và có số ngón…" (`doi_chu`). |
| `piano/tac-pham/index` n12 ("bài nằm giữa hai cấp…", lượt 1 đã bỏ) | **Sai**, giữ bỏ: site không ghi quy tắc này ở đâu. |

### Câu lệch và quyết định

| Câu | Quyết định |
|---|---|
| `grieg-buoi-sang` n18 (lượt 2 `sai`: màn 4 "ở Ma-rốc và sa mạc Sahara") | Sửa theo câu đúng của lượt 2: "…mà ở Bắc Phi: bờ biển Ma-rốc, sa mạc Sahara, rồi Ai Cập." Các cảnh cuối màn 4 ở Ai Cập: văn bản Ibsen (UiO); bản Archer của lượt 1 cũng ghi "a madhouse at Cairo". Không chạy lại. |
| `grieg-buoi-sang` n10 (lượt 2 `khong-chac`: "nổi tiếng nhất của Na Uy") | Giữ. Review mở lại *Store norske leksikon*, trang viết nguyên văn "Edvard Grieg er Norges viktigste og mest kjente komponist". Nguồn bậc 2 nói thẳng, nên không đổi thành "một trong những". |
| `grieg-buoi-sang` n20 (ghi chú trong tổng phổ; lượt 2 `dung` nhưng nguồn là lời bình của Grieg Gesamtausgabe) | Hai nguồn nói cùng một điều: lượt 1 có ghi chú dán trên bản tổng phổ màn 4 (Mus.ms. 6900), lượt 2 có lời bình hiệu đính GGA tập 18 (tr. 312). Viết rõ hơn: "Một ghi chú dán trong bản tổng phổ dùng cho màn 4 cho biết…". Trang không nói Grieg viết ghi chú ấy. Thêm nguồn `gga-18` vào hồ sơ. Không chạy lại. |
| `grieg-buoi-sang` n21, `puccini-nessun-dorma` n35 (lượt 1 đã bỏ, lượt 2 `khong-chac`) | Giữ bỏ. Hai câu là lời về cảm nhận chung ("gần như ai nghe", "thuộc lòng"), không kiểm được; trang không còn hai câu này. |
| `part-spiegel` n6 (độ dài "8–10 phút"; lượt 2 gợi ý "khoảng 10 phút") | Sửa thành "Khoảng 10 phút". Trung tâm Arvo Pärt, Universal Edition và IRCAM đều ghi 10 phút; review mở lại trang của Trung tâm. Chữ mới khớp câu hỏi "trong 10 phút". Không chạy lại. |
| `part-spiegel` n17 ("piano bắt đầu…"; lượt 2: không nguồn nói piano vào trước) | Bỏ "bắt đầu với": "Piano chơi hình đệm ba nốt đi lên, lặp lại đều đặn". Chỉ bỏ vế, không chạy lại. |
| `part-spiegel` n20 ("lần lượt" trên và dưới; nguồn yếu) | Giữ. Trang tác phẩm của Trung tâm Arvo Pärt (review mở, trả 200) viết "alternately sound above and below the melodic line". |
| `stravinsky-sacre` n7 ("người Slav cổ"; nguồn nói "pagan Russia") | Sửa thành "nghi lễ ngoại giáo của nước Nga cổ" ở cả đoạn văn và mô tả trang, theo phụ đề tổng phổ (*Tableaux de la Russie païenne*), Huscher, Laki và Britannica. Không chạy lại. |
| `stravinsky-sacre` n11 (nghịch tai "như màu sắc"; diễn giải) | Giữ. Hai lượt cùng đọc tổng phổ: hợp âm ghép lặp nguyên nhiều ô, không giải quyết. |
| `ravel-bolero` n5 ("14–17 phút"; có bản thu khoảng 13 phút) | Giữ. Câu đã ghi "khoảng" và "tùy nhạc trưởng"; IMSLP ghi trung bình 15 phút, Ravel nói "seventeen-minute". |
| `dvorak-9-largo` n9 (nguồn lượt 2 là trang khóa học St. Olaf) | Giữ. Nguồn lượt 1 (antonin-dvorak.cz) dẫn lời Dvořák "carefully studied a certain number of Indian melodies which a friend gave me". |
| `dvorak-9-largo` n14, n18 (đối chiếu tổng phổ bằng mắt) | Giữ. Hai lượt độc lập đọc tổng phổ Simrock, ra cùng nhạc cụ, sắc thái và giọng. |
| `brahms-4` n8 ("ví dụ nổi tiếng nhất") | Giữ, theo đúng chữ của Baker's: "most famously expressed … Symphony no. 4". |
| Bản ghi `shostakovich-5` n10 (ô IV "Rê thứ → Rê trưởng"; lượt 1 chưa chắc, lượt 2 `dung` suy từ blog phân tích tổng phổ của K. Woods) | Bỏ vế "Rê thứ" theo `sua-B.yml`. Không nguồn bậc 1–2 nào nói thẳng chương 4 mở ở Rê thứ, mà tổng phổ còn bảo hộ ở Mỹ. Ô IV thành `[IV. Allegro non troppo, kết ở Rê trưởng, 1, a]`, trường `hinh` chưa khóa. Vế Rê trưởng có nguồn (Laki, McBurney). Trang không viết chương 4 mở ở Rê thứ. Không chạy lại. |
| Bản ghi `brahms-4` n7 (ô BT 16–30) | Giữ. `tac-pham.yml` đã ghi "Mi thứ" (đã áp `sua-A.yml`); lượt 2 `dung`. |

### Câu lượt 1 đã sửa hay đã bỏ mà lượt 2 `dung`

- **118 câu đã sửa** ở 10 trang và bản ghi `brahms-4` n7. Review đọc lại cả mười trang: bảng thông tin, đoạn văn, sơ đồ, bảng Theo dõi khi nghe, câu hỏi, mục Nguồn và mô tả trang. Chữ trên trang khớp câu ở mọi câu. Hình `bolero` (`h3`, `h5`) đã ghi "ff" và "tới hai ô cuối".
- **1 câu đã bỏ:** `piano/tac-pham/index` n23 (sách Magrath). Sách có thật, nhưng chưa đọc và site không dẫn nó cho điều nào. Giữ bỏ.

### Soát nhãn

- Không câu `ve-site` nào chứa điều cần nguồn ngoài. Riêng `piano/tac-pham/index` n18 có dựa vào `thoi_ky` (chưa khóa, kiểm ở hồ sơ bản ghi của các lô D6).
- 18 câu `khuyen-tap` của lô đều là câu hỏi nghe hay lời khuyên cách nghe, cách dùng bài học; không câu nào nói về sức khỏe. Câu duy nhất về căng tay (`piano/tac-pham/index` n9) đã xếp `quy-tac` và có nguồn.
- Không đổi nhãn câu nào.

### Chỗ sửa trang và dữ liệu

| File | Đổi |
|---|---|
| `nghe-nhac/grieg-buoi-sang.md` | Màn 4 "ở Bắc Phi: bờ biển Ma-rốc, sa mạc Sahara, rồi Ai Cập"; "Một ghi chú dán trong bản tổng phổ dùng cho màn 4 cho biết…" |
| `nghe-nhac/part-spiegel.md` | Độ dài "Khoảng 10 phút"; Theo dõi dòng 1 "Piano chơi hình đệm…" |
| `nghe-nhac/stravinsky-sacre.md` | "nghi lễ ngoại giáo của nước Nga cổ" (đoạn văn và mô tả trang) |
| `piano/tac-pham/index.md` | Dòng Bài tập chuẩn bị của bảng "Mỗi bài học có gì" |
| `src/data/tac-pham.yml` | `shostakovich-5` `hinh.nghe` ô IV: "kết ở Rê trưởng" (trường chưa khóa) |

- Cả bốn trang đều chưa khóa. `doi_chu`:
  - cập nhật `moi` và `ly_do` ở `grieg-buoi-sang`, `part-spiegel` (bảng Theo dõi), `stravinsky-sacre` (đoạn mở đầu);
  - thêm mục: độ dài (`part-spiegel`), mô tả trang (`stravinsky-sacre`), dòng Bài tập chuẩn bị (`piano/tac-pham/index`), chú thích hình ô IV (`shostakovich-5`).

  `so-chu.mjs --doi-chu` báo đủ ở năm trang đã đổi.
- Không trang nào có mốc (`moc`), nên không cần `tools/audio`.

## Lượt 2 bổ sung

Không có, nên không có `d6-l11-gom/bo-sung.yml`. Lệnh `node tools/khoa.mjs xuat D6-L11 --con-lai` và lệnh `xuat du-lieu/tac-pham/<8 slug> --con-lai` đều ra 0 nhận định. Mỗi chỗ đổi chữ thuộc một trong ba loại:
- là câu đúng của lượt 2 (Grieg n18) hay gợi ý của lượt 2 (Pärt n6);
- chỉ bỏ một vế không có nguồn (Pärt n17, bản ghi Shostakovich n10);
- viết sát hơn với nguồn hai lượt đã đọc (Grieg n20, Stravinsky n7, `piano/tac-pham/index` n7: câu `ve-site`, review kiểm).

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 294 phép, 292 đạt, 2 bỏ qua (phạm vi nhánh lô và nhánh `them/`), 0 hỏng.

## Chủ repo cần biết

- **Khóa hai trang mục lục:** câu `ve-site` `nghe-nhac/index` n7 và `piano/tac-pham/index` n13 nói danh mục lọc được theo thời kỳ, mỗi mục ghi điều luyện nghe hay kỹ năng chính. Hai câu đúng ở bản xem. Ở trang đã khóa, danh mục chỉ đọc trường đã khóa. Hiện `thoi_ky`, `luyen_nghe`, `ky_nang_chinh` chưa khóa ở bản ghi nào (`khoa.json` chỉ khóa trường đợt 2). Nếu khóa trang trước, bản thật sẽ không có ô thời kỳ và dòng mô tả, và hai câu ấy sai. Nên khóa các trường ấy của mọi bản ghi trước hay cùng lúc với hai trang (có thể kiểm trên `npm run build` sau khi khóa).
- **Grieg, "mặt trời ló dạng":** lượt 1 đã bỏ hình ảnh này vì không có nguồn. Lượt 2 (n26) lại tìm thấy trong GGA tập 18 thư Grieg gửi nhạc trưởng Hennum (14/12/1875): mặt trời ló qua mây "at the first f". Muốn đưa lại ý ấy (có dẫn thư) thì cần lượt 2 bổ sung. Review chưa thêm.
- **Lượt 1 nêu, chủ repo quyết:**
  - `nghe-nhac/index` liệt kê cả 34 bài học, có ô lọc Loại. Muốn chỉ hiện hướng dẫn nghe thì dùng `{loai="nghe"}`; khi ấy không trang nào còn ô lọc Loại.
  - `cap-nhat` n66 (đã khóa) còn nói trang Nghe nhạc chia hai bảng. Đó là nhật ký của site cũ, đúng ở thời điểm ấy.
  - Sách in giữ thứ tự chặng cũ (`THU_TU_TAC_PHAM`).
  - `plans/ben-vung/them-tac-pham.md` (ngoài lô) còn câu "Còn chờ D6-L11"; nên bỏ khi gộp.
  - `THEM['D6-L11']` của `tests/pham-vi.test.mjs` do lô tự nới: thêm `tools/trang-mau.mjs` và chính file kiểm thử.
- **Việc mã để sau** (kiểm lại review mã): `dauVet` chưa tính frontmatter `tac_pham`.
- **Thuật ngữ chưa có** trong `thuat-ngu.yml`: danh sách ở `d6-l11.md`.
- **Link ngoài mới ở mục Nguồn** (lychee sẽ kiểm hằng tuần): Brahms-Portal, nb.no, antonin-dvorak.cz, arvopart.ee, catalog.puccini.it, DOI của JRMA, các bản quét trên Internet Archive. Đều là nguồn bậc 1–2 hay thư viện; review đề nghị giữ.
- **Còn trống** ở lần kiểm định cuối của 18 hồ sơ: `nguoi.luot_2`, `nguoi.kiem_mau`.
- **Mạng:** hai yêu cầu, User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`: `snl.no/Edvard_Grieg` và `arvopart.ee/en/arvo-part/work/544/`.

## Trạng thái khóa (người gom)

- Không có lượt 2 bổ sung.
- Đã điền `nguoi.luot_2` cho 18 hồ sơ (10 trang, 8 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l11-gom/kiem-mau.yml` (`xuat D6-L11 --mau 8`).
- AGENTS.md: áp `d6-l11/agents-md.patch` (danh mục tác phẩm, sách in đọc dữ liệu). `plans/ben-vung/them-tac-pham.md`: bỏ câu "Còn chờ D6-L11", ghi cách danh mục và sách in tự nhận tác phẩm thêm sau.
- Thứ tự khóa: khóa `thoi_ky`, `luyen_nghe`, `ky_nang_chinh` của các bản ghi trước hay cùng lúc với hai trang mục lục (câu `ve-site` `nghe-nhac/index` n7, `piano/tac-pham/index` n13 nói về ô lọc thời kỳ và dòng mô tả).

## Kiểm mẫu và khóa (06/11/2026)

Chủ repo giao Claude Opus 5.5 (phiên Cowork) kiểm mẫu thay, điền `kiem_mau` và khóa; người kiểm không phải chủ repo (`nguoi.kiem_mau` ghi rõ). 8 nhận định ở `d6-l11-gom/kiem-mau.yml`, kết quả `d6-l11-gom/kiem-mau-ket-qua.yml`: 8 đúng, 4 có điều kiện (Boléro h3, Brahms n12, Dvořák n6 dựa một phần vào tổng phổ lượt 1 đã đọc; số biến tấu chương cuối Giao hưởng số 4 của Brahms các nguồn đếm khác nhau: 30 và coda theo bản in, 32 theo ghi chú chương trình Dayton).

Thứ tự khóa theo mục "Trạng thái khóa": khóa 8 bản ghi trước; sau đó cả 73 bản ghi `tac-pham` đều khóa cả bản ghi (gồm `thoi_ky`, `luyen_nghe`, `ky_nang_chinh`), rồi khóa 8 hướng dẫn nghe và hai trang mục lục. Bản build thật 241 trang; trang mục lục có ô lọc thời kỳ. `khoa` báo `nghe-nhac/index` n1 (lời khuyên tập đã đổi chữ) thiếu nguồn: đổi `da-sua` thành `khong-can-nguon`. `npm test` 292 pass.
