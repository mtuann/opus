# D6-L8-gom: lượt 2 và review của 8 hướng dẫn nghe và 8 bản ghi

Nhánh `moi/d6-l8-gom`, ngày 06/11/2026. Review: Claude Opus 5.5 (không làm lượt 1 hay lượt 2), cùng 1 agent con (Claude, chỉ đọc repo, không dùng mạng) kiểm câu `ve-site` và đọc lại chữ của các câu đã sửa, đã bỏ. Không khóa gì, không push.

## Lượt 2

Danh sách: `d6-l8-nhan-dinh.yml` (trang, chia `d6-l8-gom/trang-1.yml`, `trang-2.yml`, `trang-3.yml`) và `d6-l8-nhan-dinh-du-lieu.yml` (`d6-l8-gom/du-lieu.yml`). Kết quả thô: `d6-l8-gom/ket-qua-*.yml`, đã `nhap`.

| Phần | Nhận định | dung | sai | khong-chac | Cần review |
|---|---|---|---|---|---|
| Trang, phần 1 (brahms-intermezzo, debussy-preludes) | 139 | 136 | 3 | 0 | 34 |
| Trang, phần 2 (gershwin-rhapsody, mussorgsky-tranh, rachmaninoff-2) | 141 | 138 | 2 | 1 | 33 |
| Trang, phần 3 (grieg-concerto, vivaldi-mua-dong, vivaldi-mua-xuan) | 120 | 120 | 0 | 0 | 24 |
| Bản ghi (8) | 70 | 67 | 1 | 2 | 4 |
| **Tổng** | **470** | **461** | **6** | **3** | **95** |

Cần review gồm 9 câu lượt 2 `sai` hay `khong-chac`, và 86 câu lượt 1 đã sửa, đã bỏ hay chưa có kết quả mà lượt 2 ghi `dung`.

## Review

Chi tiết từng câu nằm ở `ghi_chu` của hồ sơ, sau chữ "Review D6-L8-gom: …". Mọi câu đã review có `review: dung`: 46 câu `ve-site`, 95 câu cần review, và thêm hồ sơ bản ghi `brahms-intermezzo` n5 (sửa ghi chú). Lần kiểm định cuối của 16 hồ sơ (8 trang, 8 bản ghi) đã có `nguoi.review`.

### Câu về chính site (46 câu)

Agent con kiểm trên:
- chữ trang;
- link: trang đích có trong `src/content/docs/`, hay hiện "sắp có" vì có trong `trang.yml`; `#id` có trong bản build;
- dữ liệu: chặng trong `piano/tac-pham-theo-cap`, `cap-do.yml`, `ban_thu` trong `tac-pham.yml`;
- mốc: số mốc so với số dòng bảng, mốc đầu chương so với độ dài các phần;
- `src/scripts/nghe.js` và `src/plugins/thanh-phan.mjs`.

Review đọc lại kết quả.

Kết quả: 46 đúng, 0 sai, 0 nhãn sai.
- Trang đích chưa có (hiện "sắp có", hợp lệ): `piano/tac-pham/grieg-buoi-sang` (`grieg-concerto` n14), `nghe-nhac/ravel-bolero` (`mussorgsky-tranh` n46).
- 8 câu có `ghi_chu` cũ ghi `nghe-nhac/mau` "chưa chuyển": brahms n63, debussy n93, gershwin n34, grieg n66, mussorgsky n85, rachmaninoff n30, vivaldi-mua-dong n33, vivaldi-mua-xuan n31. Trang ấy đã chuyển ở D6-L7: có ở bản xem, nhưng chưa khóa nên bản thật vẫn hiện "sắp có". Câu vẫn đúng; đã ghi thêm vào `ghi_chu`.
- Nhãn giáp ranh, giữ `ve-site`: `brahms-intermezzo` n56. Phần tả trong ngoặc ("nhiều bè trong một tay") chỉ nhắc lại trang đã khóa `piano/tieng-dan`.

### Câu lượt 2 `sai` và `khong-chac` (9 câu)

| Câu | Quyết định |
|---|---|
| `brahms-intermezzo` n29 (canon; lượt 2 trang: chậm hai phách, lượt 2 dữ liệu: chậm một phách) | Review đọc tệp Mutopia (nguồn Simrock). Bè trên: Đô♯ vào ở phách 3 ô 48, nối sang ô 49; Fa♯ ở móc đơn thứ hai; Mi ở phách 2; Rê ở phách 3. Bè giữa, thấp một quãng tám: Đô♯ ở phách 2 ô 49, Fa♯ ở phách 3, Mi ở phách 1 ô 50, Rê ở phách 2. Hai bè cách nhau **hai phách**: lượt 1 không thấy dấu nối của Đô♯ bè trên. Sửa theo câu đúng của lượt 2: "ở quãng tám dưới, chậm hơn hai phách". Câu dữ liệu (`luyen_nghe`, `hinh`) không nói khoảng cách: chỉ sửa ghi chú hồ sơ bản ghi n5. Không chạy lại. |
| `brahms-intermezzo` n43 (A trở về) | Mutopia: ô 1–16 trở lại thành ô 77–84, viết khác từ ô 78; ô 85–116 gần nguyên ô 17–48. Theo câu đúng của lượt 2: "phần mở đầu được rút ngắn (16 ô còn 8 ô, viết khác đi); từ đó đến hết, các nốt gần như không đổi". Không chạy lại. |
| `debussy-preludes` n39 (cột Delphi, Louvre) | Cột gốc ở Delphi; Louvre có bản đúc (trang gypsothèque của Louvre: "Delphes avec … la colonne des Danseuses"). Theo câu đúng của lượt 2, bỏ vế "Debussy xem" (Henle chỉ nói "displayed in the Louvre"): "cột đá cổ tìm thấy ở Delphi (Hy Lạp); bản đúc của cột được bày ở bảo tàng Louvre (Paris)". Thêm nguồn `louvre-gypso`. Không chạy lại. |
| `gershwin-rhapsody` n25, n26 (dòng 2, 3 của bảng) | Lượt 2 đọc bản thảo tay 1924 ở Library of Congress: ban nhạc chơi trọn chủ đề (số tập 1) rồi piano mới vào "solo"; số tập 2: ban nhạc cùng piano. Dòng 2: "Chủ đề chính đầu tiên: clarinet chơi tiếp, cả ban nhạc nhắc lại; rồi **piano** mới vào, độc tấu lần đầu". Dòng 3: "Ban nhạc trở lại, chơi cùng piano". Thêm nguồn `loc-ms`. Không chạy lại. |
| `mussorgsky-tranh` n78 (Promenade Grade 5–6; lượt 1 đã bỏ) | Lượt 2 cũng không tìm được nguồn. Giữ bỏ. |
| Dữ liệu `mussorgsky-tranh` n10 (Promenade trở lại trong Cổng lớn Kiev) | Review đọc Mutopia (nguồn Lamm, `great-gate-allegro.ily`). Đoạn chuông ô 97–99, bè trên: Đô–Si♭ \| Mi♭–Fa–Si♭ \| Sol–Fa. Đây là bảy nốt đầu của Promenade (Sol–Fa–Si♭–Đô–Fa–Rê–Đô) dịch sang Mi♭ trưởng. Đúng; thêm nguồn `mut-great-gate`. |
| Dữ liệu `rachmaninoff-2` n9 (giấy phép bản thu) | Giữ `lic: phạm vi công cộng` theo Commons. File site dùng là file Commons, và `check_audio.py --network` đối chiếu với Commons. IMSLP ghi CC BY-SA 3.0 cho bản đăng ở IMSLP (xem Chủ repo cần biết). |
| Dữ liệu `vivaldi-mua-xuan` n7 (ô Bão) | Đoạn Bão bắt đầu ở Mi trưởng rồi về Đô♯ thứ. Sửa ô Bão của `hinh.nghe` thành "chuyển sang giọng thứ", theo câu đúng của lượt 2. Câu sửa theo, `ket_qua: da-sua`. Không chạy lại. |

### Câu lượt 1 đã sửa, đã bỏ hay chưa có kết quả mà lượt 2 `dung` (86 câu)

Agent con đọc lại chữ trang: 81 câu `da-sua` khớp câu; 9 câu `da-bo` không còn trên trang. Không còn chữ cũ đã bỏ (đã tìm Swafford, Grove, Mortier, 1894, huyền thoại, Christiania, Hardanger, Grade 5–6, bàn tay rất lớn, Hollywood, điệp khúc nhỏ…). Cụm thêm duy nhất ("thiết kế một cổng thành cho Kiev…", `mussorgsky-tranh` n18) đã có ở n19.

Các câu có nguồn yếu mà lượt 2 ghi chú, review xét từng câu:
- `grieg-concerto` n22 (lượt 1 chưa có kết quả): lượt 2 đã đối chiếu tổng phổ Schumann Op. 54 (Peters). Ghi `ket_qua: dung`, thêm nguồn `ia-schumann-op54`.
- `grieg-concerto` n15: có Grainger ("Søllerød, Zealand") và lex.dk.
- `grieg-concerto` n17: một chú giải chương trình; câu nhẹ, không nêu lý do. Giữ.
- `grieg-concerto` n42: chỉ đối chiếu chung, không đếm từng ô. Giữ.
- `mussorgsky-tranh` n37: cả hai lượt cùng đọc bản Bessel 1886. Giữ.
- `mussorgsky-tranh` n38: BIS nói chữ piano của Rimsky còn trong bản phối Ravel. Giữ.
- `mussorgsky-tranh` n11: ba nguồn ghi 39 tuổi. Giữ.
- `rachmaninoff-2` n7: Henle (mục tác giả) "late-Romantic tradition". Giữ.
- `rachmaninoff-2` n18: lượt 2 đo file. Giữ.
- `brahms-intermezzo` n51: Henle ghi "ABRSM: Piano ARSM"; lượt 1 đã đọc danh sách ARSM qua Wayback. Giữ.
- `vivaldi-mua-xuan` n27, `vivaldi-mua-dong` n10, n27: lượt 2 có MusicBrainz, IMSLP, Mutopia. Giữ.
- `rachmaninoff-2` n14, n15 (bàn tay lớn): lượt 2 chỉ tìm được Classic FM. Câu không cần cho hướng dẫn nghe; giữ bỏ.
- Dòng Nguồn Burkholder, Grove (`gershwin` n33, `vivaldi-mua-dong` n32, `vivaldi-mua-xuan` n30, `brahms` n59–n61): lượt 2 chỉ xác nhận sách và bài có thật, không đọc được nội dung. Giữ bỏ. Không hồ sơ nào trong lô còn nguồn Grove, và không trang nào còn chữ "Grove".

### Soát nhãn

- Không câu `ve-site` nào chứa điều cần nguồn ngoài.
- Không câu `khuyen-tap` nào nói về sức khỏe (đã soát cả 17 câu). Câu "không gồng cổ tay" (`mussorgsky-tranh` n83) đã là `quy-tac`, nguồn BAPAM.

### Chỗ sửa trang và dữ liệu

| File | Đổi |
|---|---|
| `nghe-nhac/brahms-intermezzo.md` | Canon: "ở quãng tám dưới, chậm hơn hai phách"; câu hỏi A trở về: "phần mở đầu được rút ngắn (16 ô còn 8 ô, viết khác đi); từ đó đến hết…" |
| `nghe-nhac/debussy-preludes.md` | Dòng I của bảng: cột tìm thấy ở Delphi; bản đúc ở Louvre |
| `nghe-nhac/gershwin-rhapsody.md` | Dòng 2, 3 của bảng Theo dõi khi nghe |
| `src/data/tac-pham.yml` | `vivaldi-mua-xuan` `hinh.nghe`: ô Bão "chuyển sang giọng thứ" |

- Đều là trang và trường chưa khóa (bản ghi chỉ khóa từng phần các trường của đợt 2).
- Bảng Gershwin giữ 7 dòng, cùng thứ tự; `moc="1"` (dòng 1, phần 1 = mặt thứ nhất) không đổi, nên không cần `tools/audio`.
- `doi_chu`: 2 mục cũ cập nhật `moi` và `ly_do` (brahms n29, debussy n39); 4 mục mới (brahms n43, gershwin n25, n26, vivaldi-mua-xuan ô Bão của hình). `so-chu.mjs --doi-chu` báo đủ.
- Hồ sơ ghi lại bằng ruamel.yaml, giữ nguyên cách viết YAML: đọc rồi ghi lại không đổi byte nào trước khi sửa.

## Lượt 2 bổ sung

Không có. `node tools/khoa.mjs xuat D6-L8 --con-lai` ra 0 nhận định: mọi chỗ sửa theo câu đúng của lượt 2, hay chỉ bỏ vế lượt 2 không xác nhận. Vì vậy không có `d6-l8-gom/bo-sung.yml`.

## Kiểm

- `node tools/khoa.mjs tinh`: không lỗi.
- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 284 phép, 282 đạt, 2 bỏ qua, 0 hỏng.
- `loiHoSo` trên 16 hồ sơ: chỉ còn `nguoi.luot_2` và `nguoi.kiem_mau`.

## Chủ repo cần biết

- **Giấy phép bản thu Rachmaninoff:** Commons ghi phạm vi công cộng (`{{PD-author|Musopen}}`), IMSLP ghi CC BY-SA 3.0 cho cùng bản thu Skidmore/Musopen. Site giữ theo Commons, vì file lấy từ Commons (và `check_audio.py --network` đối chiếu với Commons); `by` đã ghi "(Musopen)". Chủ repo quyết có cần ghi thêm trong `note` không.
- **Chặng của Op. 118 số 2:** `piano/tac-pham-theo-cap` (đã khóa) xếp bài ở chặng 6 (≈ Grade 7–8), còn ABRSM xếp vào ARSM, trên Grade 8. Lô này không sửa trang ấy.
- **Hồ sơ đã khóa ngoài lô:** có thể có câu `ve-site` hay `ghi_chu` còn ghi trang của lô "chưa chuyển". Bảng ở `d6-l8.md` mục 8 cho thấy các câu trỏ tới trang của lô vẫn đúng. Không sửa (ngoài lô).
- **Mốc chưa đo:** Gershwin 6 dòng, Grieg 3 dòng, Rachmaninoff 1 dòng (như `d6-l8.md`). Dòng 2–3 của Gershwin nay ghi rõ thứ tự clarinet, ban nhạc, piano, nên dễ đo tay trên phần 1 của bản thu 1924.
- **Thuật ngữ** chưa có trong `thuat-ngu.yml`: danh sách ở `d6-l8.md`.
- **Còn trống** trong lần kiểm định cuối của 16 hồ sơ: `nguoi.luot_2`, `nguoi.kiem_mau`.
- **Mạng:** mọi yêu cầu dùng User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`:
  - Mutopia: `intermezzo.ly` của Brahms; zip `.ly` của *Pictures at an Exhibition*;
  - Louvre: trang gypsothèque.

  Agent con không dùng mạng.

## Trạng thái khóa (người gom)

- Không có lượt 2 bổ sung (`xuat D6-L8 --con-lai` ra 0): mọi chỗ đổi chữ theo câu đúng của lượt 2 hay giữ câu có nguồn review tự mở.
- Đã điền `nguoi.luot_2` cho 16 hồ sơ (8 trang, 8 bản ghi). Còn thiếu cho khóa: `nguoi.kiem_mau`.
- Mẫu kiểm: 8 nhận định ở `d6-l8-gom/kiem-mau.yml` (`xuat D6-L8 --mau 8`).

## Kiểm mẫu và khóa (06/11/2026)

Chủ repo giao Claude Opus 5.5 (phiên Cowork) kiểm mẫu thay, điền `kiem_mau` và khóa; người kiểm không phải chủ repo (`nguoi.kiem_mau` ghi rõ). 8 nhận định ở `d6-l8-gom/kiem-mau.yml`, kết quả `d6-l8-gom/kiem-mau-ket-qua.yml`: không câu nào sai. Nguồn ngoài mở lại bằng agent đọc trang web; file .ly của Mutopia đọc trên bản GitHub của MutopiaProject; câu về site kiểm trên repo. Câu chỉ kiểm được một phần ghi rõ trong `ghi_chu` của file kết quả. Khóa mọi trang và bản ghi của lô; bản build thật 231 trang (cùng D6-L1 đến D6-L10).
