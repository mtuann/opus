# D7, nhánh gom: lượt 2, review, khóa (đang làm)

Nhánh `moi/d7-gom` từ `main` (`3f1172b`), 05/11/2026. Gom 17 trang `luyen-tap/` của D7-L1 (9 trang) và D7-L2 (8 trang): 282 nhận định, 178 câu về chính site (`ve-site`). D7-L3 sẽ vào nhánh này sau.

## Lượt 2

Danh sách xuất từ hồ sơ (`node tools/khoa.mjs xuat D7-L1 D7-L2 --ra …`, `d7-gom/trang.yml`): 89 nhận định cần lượt 2 (câu `ve-site` không qua lượt 2; lời khuyên tập chỉ mẫu 3 câu mỗi trang), chia 2 phần. Mỗi phần một agent Claude Sonnet 5.5, độc lập với lượt 1, theo `loi-giao/luot-2-trang.md`.

| Phần | File | Số | dung | sai | khong-chac | Đã nhập |
|---|---|---|---|---|---|---|
| trang-1 | `d7-gom/trang-1.yml`, kết quả `ket-qua-trang-1.yml` | 48 | 47 | 0 | 1 | có |
| trang-2 | `d7-gom/trang-2.yml`, kết quả `ket-qua-trang-2.yml` | 41 | 36 | 0 | 5 | có |

Tổng: 83 dung, 0 sai, 6 khong-chac. Lượt 2 nêu thêm: câu "Dùng Chrome, Edge hay Opera trên máy tính" (ô MIDI) thiếu Firefox, vì Firefox từ bản 108 cũng có MIDI trên web (caniuse, MDN).

## Review

Claude Opus 5.5, không làm lượt 1 hay lượt 2 của các trang này.

**Câu về chính site (178):** kiểm trên trang, bản xem (`dist/`) và module dựng phần ấy (`src/scripts/…`). Kết quả: 178 `review: dung`, 0 sai. `ghi_chu` mỗi câu có thêm "Review D7-gom: …" ghi đã kiểm ở đâu. Có hai câu `ket_qua: null` của lượt 1 nay đã xong, vì người giao đã sửa module theo đề nghị của lượt 1:

- `chep-giai-dieu` n10: nhãn `CAP[1]` của `chep.js` nay là "Cấp 1: 4 nốt, đi liền bậc, kết ở Đô". Ghi `da-sua`, câu ghi lại theo nhãn mới.
- `thi-tau` n12: chữ "Cách tập" của `thi-tau.js` nay nói "bấm một trong hai nút ở dòng “Chơi và được chấm”". Câu ghi lại theo chữ ấy.

Mười hai câu `ve-site` của trang D7-L1 trỏ tới trang D7-L2. Nay mọi trang đích đã có, nên các câu được kiểm trên chính trang đích, và đều khớp: `index` n2, n3, n10, n11, n12, n14, n17, n27, n29, n31; `ket-noi-midi` n8; `hat-lai` n10. Thêm `hat-lai` n27: trang `piano/choi-cung-nguoi-khac` nay đã có ở site mới, với id `song-tau-voi-mot-nhac-cu`.

**Soát nhãn:** không có câu `ve-site` nào chứa điều cần nguồn ngoài. Không có câu `khuyen-tap` nào nói về sức khỏe. Không đổi loại câu nào.

**Mười một câu hai lượt lệch:**

| Câu | Quyết định |
|---|---|
| `metronome` n12, n14, n16, n18, n20, n22 | Bỏ cột "Khoảng BPM" khỏi bảng (`da-bo`), kể cả hàng Presto cho nhất quán. Theo tiền lệ review D3-gom ở Từ điển, và theo Dolmetsch: "there is a wide variation associated with each mark". Không thấy lý do mạnh để giữ: máy đếm nhịp vẫn hiện tên thuật ngữ gần nhất cạnh số BPM (`TOC_DO`). Câu n10 viết lại: "Mỗi thuật ngữ chỉ một vùng tốc độ, không gắn với một số BPM cố định: các nguồn ghi những khoảng BPM rất khác nhau, và nghệ sĩ có quyền diễn giải." Ghi `doi_chu` cho 7 chỗ |
| `phieu-bai-tap` n7 | Giữ chữ của lượt 1 ("một trong những cách học có hiệu quả ghi nhớ cao nhất"); hai lượt cùng dẫn Dunlosky 2013 |
| `thu-am` n16 | Bỏ vế ": loa nhỏ làm mất tiếng trầm và bàn đạp" (`da-bo`), vì không có nguồn bậc 1–2. Giữ lời khuyên nghe bằng tai nghe |
| `tiet-tau` n8 | Giữ việc lượt 1 đã bỏ câu "Đa số người mới có xu hướng gõ sớm". Lượt 2 chỉ thấy điều này ở kết quả tìm kiếm, chưa mở bài |
| `choi-theo` n8 | Giữ câu, ghi `dung`. Thêm nguồn bậc 2: Open Music Theory, "Reading Clefs" (khóa Sol có số 8: hát hay chơi thấp hơn nốt viết một quãng tám; dùng cho giọng tenor, guitar, bass) |
| `hat-lai` n8 | Viết nhẹ hơn cho khớp nguồn (Pfordresher & Halpern 2013): "Hát luyện mối liên hệ giữa tai và giọng: muốn hát đúng một cao độ, bạn cần nghe trong đầu cao độ ấy trước khi phát ra nó." |
| `hat-lai` n28 | Bỏ ngoặc "(mặc định thường 440 hay 442 Hz)": chỉ một trang đã mở (Roland, 442 Hz), không đủ cho chữ "thường". Phần còn lại lượt 2 đã ghi `dung` |

**Ô MIDI và trình duyệt** (lượt 2 nêu): sửa chữ ở bốn chỗ:

- `src/scripts/midi.js` (`trangThai`): "Trình duyệt này không có MIDI trên web. Safari và mọi trình duyệt trên iPhone, iPad đều chưa có; trên máy tính, hãy thử Chrome, Edge hay Firefox."
- `choi-theo.js`, `thi-tau.js`: "Hãy mở trang bằng trình duyệt khác (như Chrome, Edge hay Firefox trên máy tính), hoặc …"
- Trang `ket-noi-midi`: "Mở site bằng một trình duyệt có MIDI trên web, như Chrome, Edge, Firefox hay Opera trên máy tính. … ; khi đó ô ở trên sẽ báo."

Kiểm thử `kiem-luyen-tap.mjs` khớp phần đầu câu ("Trình duyệt này không có MIDI trên web"), nên không phải sửa. Các câu `so-lieu` trích chữ này (`ban-phim` n13, `chep-giai-dieu` n12, `doc-not` n13, `choi-theo` n14, `ket-noi-midi` n3) được ghi lại theo chữ mới.

**Cần chủ repo biết:**

- Trang đã khóa `luyen-tai/choi-bang-tai` (dòng 71) viết "Bắt đầu ở cấp 1: bốn nốt, chỉ đi liền bậc". Nhãn công cụ nay là "đi liền bậc, kết ở Đô", vì nốt cuối có thể là bước nhảy. Muốn khớp thì phải mở khóa (lô này không được sửa trang ngoài phạm vi).
- Trang `nhat-ky` (n2, n9) nói tới nút "Hôm nay đã tập bài này" và "Tôi đang tập bài này" ở đầu bài học tác phẩm. Hai nút này chưa có ở site mới; theo kế hoạch chúng có ở đợt 6 (thẻ `.oz-piece`). Nếu trang `nhat-ky` lên site thật trước đợt 6, hai câu này nói tới nút chưa có. Trang `piano/tac-pham/` hiện là "sắp có" ở bản thật.
- Chữ "(A4)" ở trang `phieu-bai-tap` (n3, n16) chỉ là khổ phiếu được dàn cho. Site không đặt `@page`, nên khổ giấy do hộp thoại in quyết. Giữ như lượt 1.

## Lượt 2 bổ sung

Bảy câu có chữ đổi sau lượt 2 (`d7-gom/bo-sung.yml`, xuất bằng `xuat D7-L1 D7-L2 --con-lai`): năm câu về MIDI và trình duyệt (`ban-phim` n13, `chep-giai-dieu` n12, `choi-theo` n14, `doc-not` n13, `ket-noi-midi` n3), `hat-lai` n8, `metronome` n10. Kết quả lượt 2 cũ của các câu này đã gỡ khỏi hồ sơ (ghi lại trong `ghi_chu`).

Kết quả (`d7-gom/ket-qua-bo-sung.yml`, đã `nhap`): 6 dung, 0 sai, 1 khong-chac. Lượt 2 mở caniuse (Web MIDI: Chrome 43, Edge 79, Firefox 108, Opera 30; Safari và iOS không có) và Dolmetsch (khoảng BPM chỉ gần đúng, khác nhau giữa các nguồn).

- Khong-chac: `hat-lai` n8, vì lượt 2 không mở được toàn văn bài nghiên cứu (Springer, PMC chặn). Người gom giữ chữ: review đã đọc Pfordresher & Halpern 2013, và chữ đã viết nhẹ theo nguồn. Câu được thêm vào mẫu kiểm của chủ repo (`kiem-mau.yml`, mục thứ 11).

## Kiểm thử

`npm run build:xem`; `npm test`: 210 pass, 1 skip (`pham-vi`: nhánh gom không phải nhánh lô); `node --test tests/trinh-duyet/kiem-luyen-tap.mjs tests/trinh-duyet/kiem-luyen-tap-d7.mjs`: 45 pass, 1 skip (WebKit không lưu Blob vào IndexedDB, như trước).

## Kiểm mẫu và khóa

10 nhận định mẫu ở `d7-gom/kiem-mau.yml` (`xuat D7-L1 D7-L2 --mau 10`). Đã điền `nguoi.luot_2` và `nguoi.review` cho 17 hồ sơ; `kiem_mau` để trống.

Chờ chủ repo: kiểm mẫu, rồi `khoa` 17 trang sau khi có kết quả lượt 2 bổ sung.

## D7-L3

Sáu trang: `bat-dau/sach-in`, `blog/index`, ba bài `blog/posts/2026-10-*`, `cap-nhat` (254 nhận định, 211 `ve-site` ở lượt 1). Theo quyết định của người điều phối: giữ nhật ký phiên bản 1–15 của Opus Zero ở `cap-nhat`, giữ hướng dẫn in đã rút ngắn ở `sach-in`.

### Lượt 2

42 nhận định (`d7-gom/trang-3.yml`, kết quả `ket-qua-trang-3.yml`, đã `nhap`): 25 dung, 0 sai, 17 khong-chac. `nhap` báo 28 câu cần review (`d7-gom/can-review-l3.txt`).

### Review

Claude Opus 5.5, không làm lượt 1 hay lượt 2 của các trang này. Hai agent con đọc `cap-nhat` (câu `ve-site`, chia đôi theo id) trên `../opus-zero` (file, `git log`, `git show`) và repo mới; một agent con tra nguồn ngoài (Commons, IMSLP, Classic FM…). Người review quyết định và ghi hồ sơ.

**Câu về chính site (214 sau khi đổi nhãn):** 209 `review: dung`, 5 `sai`, đã sửa. `ghi_chu` mỗi câu có thêm "Review D7-gom: …" ghi chỗ đã kiểm (`src/sach/sach.mjs`, `dist/sach/*.html`, `dist/sw.js`, `src/plugins/thanh-phan.mjs`, commit của site cũ…).

- `sach-in` n26–n29 (chữ sinh ra của sách): `dung`, khớp nguyên văn `SACH[i].mo_ta`, `trangSach`, `cauHoiIn` và danh sách trang của từng cuốn.
- Ba câu lượt 1 để trống nay kiểm được: `cap-nhat` n117 (commit `2e32c84`: khoảng 49 hình), n133 (`SKILLS` của `plan.js` ở `04fd9fc`: 13), n140 (`2a686e6`: 16 mục `###` mới).
- Năm câu sai: `cap-nhat` n45 (lý do "IMSLP không cho nhúng file" là điều về dịch vụ ngoài, bỏ vế này, `da-bo`), n48 ("phạm vi công cộng" trái với mục phiên bản 15 của chính trang, thành "trên Wikimedia Commons"), n125 (102 KB → 47 KB không đo lại được), n143 ("8 hướng dẫn nghe"), n144 ("11 công cụ"): git gộp phiên bản 2–3, nên bỏ số, giữ ý.

**Soát nhãn:** `cap-nhat` n80 (file *Pathétique* trên Commons dài 6:24) đổi `ve-site` thành `so-lieu` (Commons API: 384,5 giây); n45 cũng chứa điều ngoài site, đã bỏ.

**Câu cần review và câu `khong-chac`:**

| Câu | Quyết định |
|---|---|
| `sach-in` n16 | Sửa: "Ở ô chọn đích đến (máy in), chọn lưu thành PDF (trên Chrome: Lưu dưới dạng PDF)". Chrome Help tiếng Việt: "chọn đích đến", "Lưu dưới dạng PDF"; Firefox: "Destination", "Save to PDF" |
| `sach-in` n18 | Sửa: "Nếu hộp thoại in có mục in đầu trang và chân trang (thường nằm trong phần cài đặt thêm), nên tắt…". Nguồn: Mozilla Support (bản lưu Wayback); không mở được trang Chrome nói về mục này |
| `sach-in` n19, n20 | Giữ, `dung`: Chrome Help (Android): More → Share → Print, "tap Save as PDF"; Apple, Print from iPhone: nút Chia sẻ hay Thêm rồi In |
| `trong-tam-piano` n3 | Sửa: bỏ vế so sánh "một trong số ít nhạc cụ" (không có nguồn bậc 1–2) |
| `trong-tam-piano` n5 | Bỏ: "kho nhạc lớn hơn bất kỳ nhạc cụ nào" chỉ có nguồn bậc 3 |
| `trong-tam-piano` n6 | Sửa: "Kho nhạc chơi được trên piano trải từ Bach đến Rachmaninoff" (Bach viết cho đàn phím trước piano; Henle HN 14 in cho piano solo) |
| `trong-tam-piano` n17 | Giữ: IMSLP, Minuet K. 2, F major |
| `phien-ban-15` n14 | Bỏ câu về động cơ của người lớn học đàn (không có nguồn); tên hai bài chuyển vào câu `ve-site` sau |
| `phien-ban-15` n22 | `dung`: Library of Congress: bản thu 10/6/1924 của Whiteman và Gershwin, thu lại năm 1927 "also with Gershwin" |
| `cap-nhat` n18 | `dung`: Classic FM, Brilliant Classics, Radio Swiss Classic |
| `cap-nhat` n22, n88 | `dung`: metadata Commons và trang IMSLP của đúng file |
| `cap-nhat` n26 | Giữ 1956 và 1948 theo Commons (nơi site cũ dẫn link); nguồn ghi 1956–1957 chỉ ở bậc 3 |
| `cap-nhat` n27 | `dung`: copyright.gov (bản thu phát hành 1947–1956: 95 + 15 năm) |
| `cap-nhat` n28 | `dung`: đoạn C dài 8 ô (ô 33–40), A' và C nhắc lại cùng nhau (ô 25–40). PDF IMSLP bị chặn; đếm trên bản LilyPond `rdj/music` mà site cũ dùng. Site mới chưa có trang `piano/tac-pham/chopin-valse-la-thu` (đợt 6), nên không có trang đã khóa để đối chiếu |
| `cap-nhat` n34 | Sửa cho khớp trang đã khóa `hinh-thuc/minuet-trio`: "trio thường đổi giọng, hoặc đổi trưởng – thứ trên cùng chủ âm" |
| `cap-nhat` n35 | `dung`: Mutopia BWV Anh. 126 (A B A, như trang đã khóa `nhac-ly/31`) |
| `cap-nhat` n48 | Như trên: "(1956, trên Wikimedia Commons)" |
| `cap-nhat` n49, n60, n61, n69, n70 | `dung`: Commons (12 file), IMSLP (Op. 4, 35, 58; Op. 85, 102), Met, Tchaikovsky Research và LoC |
| `cap-nhat` n55 | Bỏ "bài hay bị gọi nhầm là Spring Waltz" (chỉ có nguồn bậc 3); câu `ve-site` n54 sửa theo |
| `cap-nhat` n58 | Sửa: Henle HN 1062 (bậc 2) nói biệt danh có từ khi Beethoven còn sống, trái với "chỉ phổ biến sau khi Beethoven mất" (Wikipedia). Câu mới: "biệt danh Ánh trăng (gắn với hình ảnh mặt hồ dưới trăng mà Rellstab viết về chương 1)" |
| `cap-nhat` n59 | `dung`: Hi-Fi+ "Recorded: 1974 (Symphony No 5)"; trang DG trả 429 |
| `cap-nhat` n91 | Giữ "khoảng năm 1823–1824" (Henle: 1823; Wikipedia: 1824) |
| `cap-nhat` n130 | `dung`: FreePats và `public/mau-am/piano/LICENSE.txt` (CC BY 3.0) |

Nguồn Wikipedia ở hai bài blog bị ghi `bac: 2`, nay ghi lại là 3; `phien-ban-15` n18, n21 thêm Classic FM, LoC.

Chữ đổi ghi `doi_chu`: `sach-in`, `cap-nhat` khớp `so-chu --doi-chu` ("doi_chu đã đủ"); hai bài blog ghi tay, so với `.cache/site-cu/blog/2026/10/…`.

### Lượt 2 bổ sung

Bảy câu (`d7-gom/bo-sung-l3.yml`, `xuat D7-L3 --con-lai`): `sach-in` n16, n18; `trong-tam-piano` n3, n6; `cap-nhat` n34, n58 (chữ đổi sau lượt 2: kết quả lượt 2 cũ đã gỡ khỏi hồ sơ, chép vào `ghi_chu`), n80 (đổi nhãn).

Kết quả (`d7-gom/ket-qua-bo-sung-l3.yml`, đã `nhap`): 4 dung (`sach-in` n16, n18 theo Mozilla Support; `cap-nhat` n34 theo Open Music Theory 5.12, n58), 0 sai, 3 khong-chac. Người gom giữ chữ cả ba, ghi chú vào hồ sơ và thêm vào mẫu kiểm (`kiem-mau-l3.yml`, ba mục cuối):

- `trong-tam-piano` n3, n6: lượt 2 không mở được nguồn nói thẳng (Wikipedia 404, Britannica 403); review đã viết lại câu cho nhẹ, n6 dẫn Henle HN 14.
- `cap-nhat` n80: trang Commons không nói file dừng ở đâu; review đo độ dài qua Commons API (384,52 s) và đối chiếu mốc tham khảo của trang hướng dẫn nghe (phần phát triển từ 312 s).

Phép thử `kiem-ung-dung.mjs` hỏng một lần ở lần chạy đầu của review ("error loading dynamically imported module … ui-core"); người gom chạy lại 18 lần (6 lần mỗi trình duyệt) đều đạt, và `ui-core` có trong danh sách lưu sẵn: có lẽ do `dist/` đang dựng lại. Theo dõi trên CI.

### Kiểm thử

`npm run build:xem` không cảnh báo `[opus]`; `npm test` 238 đạt, 1 bỏ qua (`pham-vi`); `node --test tests/trinh-duyet/kiem-ung-dung.mjs` 8 đạt. Lần chạy đầu có một lần hỏng ("error loading dynamically imported module … ui-core"), ba lần sau đều đạt: có thể chập chờn khi mất mạng, nên theo dõi.

### Kiểm mẫu

5 nhận định ở `d7-gom/kiem-mau-l3.yml` (`xuat D7-L3 --mau 5`). Đã điền `nguoi.luot_2` và `nguoi.review` cho 6 hồ sơ; `kiem_mau` để trống. Chờ chủ repo: kiểm mẫu, lượt 2 bổ sung, rồi khóa 6 trang.

## Kiểm mẫu và khóa (05/11/2026)

Chủ repo giao Claude Opus 5.5 (phiên Cowork) kiểm mẫu thay, điền `kiem_mau` và khóa. Người kiểm không phải chủ repo; `nguoi.kiem_mau` ghi rõ điều này.

- D7-L1, D7-L2: 11 nhận định ở `d7-gom/kiem-mau.yml`, kết quả `d7-gom/kiem-mau-ket-qua.yml`: 11 đúng (hat-lai n8 có điều kiện: Pfordresher và Halpern 2013 là bằng chứng tương quan). Câu `ve-site` kiểm lại trên mã (`doc-not.js`, `phieu.js`, `thu-am.js`, `tien-do.js`).
- D7-L3: 8 nhận định ở `d7-gom/kiem-mau-l3.yml`, kết quả `d7-gom/kiem-mau-l3-ket-qua.yml`: 8 đúng (cap-nhat n80 có điều kiện: Commons API 384,5 giây, file bị cắt vì 0,4 giây cuối còn -18 dB; vị trí "giữa phần phát triển" chưa nghe kiểm).
- Khóa 23 trang. `khoa tinh` khớp; bản build thật 160 trang (cùng đợt 8); `npm test` 281 pass. Kiểm thử trình duyệt không chạy được trên máy kiểm (thiếu trình duyệt Playwright); chạy ở CI.
