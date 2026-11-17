# Báo cáo: thêm hướng dẫn nghe Bartók, Sonatina Sz. 55 (hướng dẫn nghe số 3 của lộ trình)

Nhánh `them/bartok-sonatina`, 17/11/2026. Mục 7 của `plans/ben-vung/lo-trinh-them-tac-pham.md`, hướng dẫn nghe số 3 (Thế kỷ 20). Tới lượt 1 kiểm định: chưa có lượt 2, review, kiểm mẫu; chưa khóa.

## Kết quả

- Trang `nghe-nhac/bartok-sonatina`, bản ghi `bartok-sonatina` (`loai: nghe`) cuối `tac-pham.yml`, dòng `trang.yml`, hai hồ sơ (trang: 35 nhận định, trong đó 2 `ve-site`, không có khuông; bản ghi: 9 nhận định). Xuất cho lượt 2: 42 nhận định.
- Trang theo mẫu hướng dẫn nghe: bảng đầu trang; Điều cần biết (giai điệu múa Romania, cùng bản thảo 1915 với *Romanian Folk Dances*, bảng năm giai điệu và nơi Bartók ghi lại theo chú thích của bản in, hai bản in và hai tốc độ, nghe bằng tai người chơi piano, ký hiệu bàn đạp); sơ đồ cấu trúc; khối nghe; bảng Theo dõi khi nghe 9 dòng; câu hỏi; So sánh bản thu (cuộn đàn Bartók 1927, Jandó trên Naxos, bản dàn nhạc *Transylvanian Dances*); Nếu bạn muốn chơi; Nguồn.
- Link sang hai bài học Bartók `piano/tac-pham/bartok-romanian-folk-dances` (hai chỗ) và `bartok-for-children`, cùng `lich-su/thoi-ky/the-ky-20`, chặng 6, `piano/nha-soan-nhac#bela-bartok-18811945`.
- Cấp độ (đọc lại 17/11/2026): ABRSM Grade 7, danh sách C số 4, "Bagpipers: Allegretto (1st movt from Sonatina)", ở cả đề cương 2025–2026 và 2027–2028. Henle HN 1401: mức 4, "ABRSM: Piano Grade 7". Trang nói Grade 7 là chặng 6 của site.
- Bản thu: Commons `Bartok_-_Sonatina.ogg`, La Pianista, thu 2009, 220,6 s, phát được. Giấy phép đọc ở trang mô tả: phần bản thu `{{self|cc-by-sa-3.0|GFDL}}`, phần sáng tác `{{PD-old-auto-1923|1945}}`. `commons.py rec` báo "phạm vi công cộng" (đọc nhầm mẫu của phần sáng tác, như khảo sát G6 đã ghi): sửa JSON thành CC BY-SA 3.0 rồi `attach.py --json`. Chín mốc.

## Ấn bản: bản quét IMSLP là bản sửa

Lời giao nêu chỗ chưa thống nhất (khảo sát: bản in đầu số 3929, mọi bản quét IMSLP là bản sửa 3953; IMSLP #893630 ghi "First edition", 1919, số 3953). Đã kiểm trên bản quét **trước khi viết**:

- Chân mọi trang nhạc (tr. 3–9): "R. és Tsa 3953". Bìa và tr. 3 ghi "Copyright 1919 by Rózsavölgyi & Cº": đó là năm bản quyền gốc, giữ khi in lại.
- Cuối mỗi chương có "Aufführungsdauer / Durée d'exécution" (1′30″, 32″, 1′45″); tr. 3 có chú thích ký hiệu bàn đạp; chương 1 ghi *Allegretto* (♩ = 86).
- Lời bình của ấn bản Henle (László Somfai, 2016; PDF mẫu trên henle.de): bản in đầu là "R. és Tsa 3929", copyright 1919; bản sửa không ghi năm, **đầu thập niên 1930**, dùng lại bản khắc của bản in đầu với số mới 3953, thêm thời lượng, sửa tốc độ (chương 1 từ *Molto moderato* ♩ = 74 thành *Allegretto* ♩ = 86) và thêm chú thích ký hiệu bàn đạp ở trang đầu.

Kết luận: khảo sát đúng; IMSLP ghi nhầm. #893630 là bản sửa đầu thập niên 1930. Trang IMSLP (wikitext 17/11/2026) không có bản quét nào của bản in 3929: các file khác là Dover 1982 và EMB 1952 (in lại), Muzgiz 1933, Boosey & Hawkes 1950 ("Revised version").

**Bản quyền và chọn lựa.** Bartók mất 1945: hết bảo hộ ở Việt Nam. Lộ trình (mục 2) đòi ấn bản dùng cho trích đoạn in từ 1930 trở về trước; bản sửa in đầu thập niên 1930 nên không dùng được, và không có bản số mở. Hai bài học Bartók đã có chỉ chép từ bản in đầu (Rozsnyai 1909; UE 1918 đã kiểm là bản in trước bản sửa 1934). Làm giống thế: **trang không có trích đoạn (khối abc)**. Mô tả cấu trúc (số ô, tay nào mang giai điệu, hóa biểu, nhịp, chữ tốc độ) đọc trên bản quét 3953; đó là sự kiện về tác phẩm, không chép nốt. Chữ tốc độ trong bảng Theo dõi khi nghe được ghi rõ là theo bản sửa, và trang kể chuyện hai bản in (theo Henle). Muốn thêm trích đoạn về sau: cần bản quét bản in đầu 3929 (Henle dùng bản ở Bartók-Archiv, Budapest, Z. 27), chưa có trên IMSLP.

## Mốc và sơ đồ

Đo trên file gốc Commons bằng librosa (`.venv-audio`): độ to RMS tìm khoảng lặng, `chroma_cqt` từng giây, `onset_detect` kèm chroma. Không dùng `tools/audio/align` (không có MIDI hay kern mở). Mốc: 2 (nốt đầu 2,55 s), 29 (*Allegro* 29,33 s), 51 (*Tempo I* 51,06 s), 85 (chương 2), 96 (ô 9 chương 2, 96,43 s), 119 (chương 3), 148 (*Sostenuto* 148,70 s), 161 (tay phải lặp La–Si từ 160,91 s), 191 (coda 191,19 s, sau quãng lặng 189,3–191,3 s). Chi tiết trong `ghi_chu` hồ sơ trang. Sơ đồ `hinh.nghe` tám ô, độ dài theo các mốc ấy.

## Nguồn

Bản quét IMSLP #893630 (`../opus-zero/_imslp/`); wikitext IMSLP (API); Henle HN 1401 (trang sản phẩm và PDF lời bình); đề cương ABRSM 2025–2026 và 2027–2028 (PDF); Commons (API, wikitext và imageinfo); MusicWeb International (điểm đĩa Jandó, Naxos 8.554718). Tên làng trong bảng: bỏ đuôi chỉ nơi chốn tiếng Hungary của chú thích (Cserbelen → Cserbel…); tên tiếng Romania viết như bản in.

## Chỗ chưa chắc

- Bảng tốc độ trong PDF của Henle mất định dạng cột; thứ tự cột (bản 1919, bản sửa, cuộn đàn 1927, người chơi dân gian) suy từ câu văn của Henle ("Bartók đã tăng tốc độ chương 1 và 3 ở bản sửa") và từ bản quét 3953 (khớp cột bản sửa). Câu *Molto moderato* ♩ = 74 của bản 1919 dựa vào cách đọc ấy (hồ sơ n14).
- Năm của tập Bihar trên bản quét trông như "1918" (bộ chữ đậm làm chữ số 3 giống 8, như "3953" trông như "8958"); Henle ghi 1913; trang theo 1913.
- IMSLP ghi in lần đầu "1919 - Vienna: Universal Edition, Simultaneously issued by Rózsavölgyi"; Henle chỉ nói Rózsavölgyi. Trang theo Henle.
- Trang không nói chương hay đoạn nào ở giọng gì (điệu thức dân gian, nốt trầm Rê–La; thể loại Commons ghi nhiều điệu thức nhưng không phải nguồn bậc 1–2). Chỉ nói hóa biểu đổi.
- Đĩa Jandó: MusicWeb ghi thu ở "Phoenix Studio, Prague" tháng 10/1999; trang không ghi nơi, năm thu (chưa có nguồn thứ hai).
- Khảo sát ghi bài có trong ABRSM 2021–2028; lượt này chỉ đọc lại đề cương 2025–2026 và 2027–2028 (ở 2025–2026 bài không có nhãn NEW, tức có từ kỳ trước).

## Chỗ vướng của quy trình

- `commons.py rec` đọc nhầm giấy phép khi trang mô tả có mẫu PD cho phần sáng tác (đã biết từ khảo sát G6); `attach.py --json` với JSON đã sửa nhận ngay. Nên để `commons.py` ưu tiên mục "For the Recording" hay báo khi trang có hai mục giấy phép.
- `commons.py rec` sinh `"t": ""` và `"note": ""` cho bản thu một phần; đã bỏ `t`, điền `note` tay.
- `them-tac-pham.mjs` tạo `title` "Bartók: Sonatina" (đã thêm số Sz. 55 như các trang khác).

## Kiểm thử

- `node tools/khuong-nhac.mjs`: 400 khối, 0 lỗi. `npm run build:xem` đạt.
- `npm test`: 353 đạt, 2 bỏ qua, 0 hỏng (gồm `tests/tac-pham.test.mjs`, `tests/pham-vi.test.mjs`, `tests/link.test.mjs`, `tests/ban-thu.test.mjs`).
- `OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet`: 430/430 đạt (trang mẫu; trang mới chưa commit nên chưa vào trang đã đổi); thêm `OPUS_CHI_TRANG_DOI=1 OPUS_TRANG=nghe-nhac/bartok-sonatina/`: 193 đạt, 4 bỏ qua, 0 hỏng.

## Việc ngoài phạm vi

- `piano/tac-pham-theo-cap` và `piano/nha-soan-nhac` (đã khóa) chưa nhắc Sonatina; có thể thêm dòng chặng 6 (ABRSM Grade 7) ở nhánh `mo/` sau khi gộp.
- Trang `lich-su/thoi-ky/the-ky-20` có thể link sang hướng dẫn nghe này (nhánh `mo/`).
- Thuật ngữ trang dùng mà `thuat-ngu.yml` chưa có: sonatina, *longa*, *leggero*, cuộn đàn tự động (piano roll), kèn túi.

## File chủ repo phải tải

Không có (bản quét #893630 đã tải; bản thu ở Commons).
