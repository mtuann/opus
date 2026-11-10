# Thuật ngữ, bản thu, kết thúc đợt 9 (10/11/2026)

Ba việc chủ repo giao ngày 10/11/2026 (kế hoạch mở rộng mục 5.2, 5.3 và phần còn lại của đợt 9). Nhánh `mo/thuat-ngu`, `mo/ban-thu`, gộp `main`. Người gom: Claude Opus 5.5. Chủ repo chọn: dùng agent con cho thuật ngữ; tìm bản thu cho mọi trang tìm được; khối nghe chọn được nhiều bản và nhận mẫu giấy phép `{{Attribution}}` của Commons.

## 1. Thuật ngữ (`mo/thuat-ngu`)

- Danh sách gom từ ghi chú "thuat-ngu.yml chưa có" của 55 hồ sơ trang và mục 5.3, khử trùng: 233 mục, năm lô (T1 hình thức và thể loại, T2 chỉ dẫn diễn tấu, T3 nhạc lý: quãng, hợp âm, giọng, ký hiệu, T4 hòa âm, đối âm, kết, âm học, T5 piano, nhạc cụ và giọng hát).
- Lượt 1: năm agent con, mỗi lô một agent. Nguồn bậc 2 đọc được (Open Music Theory bản 2 và 1.0, Trinity College London, Merriam-Webster, Concise Oxford Dictionary of Music trên Encyclopedia.com, Britannica, Dolmetsch, AGO, giáo trình đại học mở). Lượt 2: năm agent con khác, chỉ nhận câu nhận định (không nguồn, không kết luận của lượt 1).
- Kết quả: 329 nhận định; lượt 2: 319 `dung`, 10 `khong-chac`, 0 `sai`. Review xử lý 18 mục theo lượt 2 (như episode, chaconne, ballet, larghetto, modal mixture, tonicization: "chuyển giọng" theo cách gọi của site), bỏ vế không có nguồn (viết tắt string., mv., "số nhiều Lieder"), bỏ tên "hát nói" cho recitative (trùng thể hát nói của ca trù).
- Không thêm 5 mục (không có nguồn bậc 1–2 đọc được): harmonic rhythm, secondary dominant, cent, double notes, half pedal.
- Thêm 228 bản ghi, khóa cả bản ghi; poco, molto, sempre, più, meno, assai xếp nhóm "Thay đổi tốc độ" như ma non troppo. Trang `nhac-ly/tu-dien` có thêm mục "Nhạc cụ và giọng hát" (11 bảng, thẻ ghi nhớ đọc cả bảng mới); `doi_chu` 11 khối hàng mới.
- Kiểm mẫu (Claude kiểm thay chủ repo): 10 mục ngẫu nhiên, 2 mỗi lô (ritornello, intermezzo, ritenuto, larghetto, tie, natural-minor, passing-tone, well-temperament, horn, broken-chord): 10 đúng.

## 2. Bản thu (`mo/ban-thu`)

- Tìm trên Commons bằng `tools/audio/commons.py` cho 22 hướng dẫn nghe chưa có bản thu và các mục của kế hoạch. Chỉ nhận bản dùng tự do cả ở Mỹ: tác phẩm của chính phủ Mỹ, thu trước 1923–1926, hay người giữ quyền dâng tặng (Musopen) hoặc cấp CC có nguồn rõ. Loại các bản thập niên 1930–1960 chỉ "PD ở EU" (Krips, Furtwängler, Koussevitzky, Fricsay, Casals…), bản tổng hợp từ MIDI hay synthesizer cho tác phẩm dàn nhạc, bản chuyển soạn cho sáo dọc.
- Gắn 13 bản: Bach Air (Air Force Strings, Ban nhạc Không quân Hoa Kỳ), Tổ khúc cello 1 Prelude (John Michel), Beethoven 5 bốn chương (Skidmore College Orchestra qua Musopen), Habanera (Jenny Lee Mitchell, Kevin MacLeod), Brahms 4 chương 4, Grieg "Buổi sáng", Mozart 40 chương 1 (Musopen Symphony), Dvořák Largo (Musopen), Hallelujah (Edison 1916), Der Hölle Rache (Sandra Partridge, Siam Philharmonic, Trisdee na Patalung), Erlkönig (Schumann-Heink, Victor), 1812 (Skidmore qua Musopen), Mùa đông chương 1 (John Harrison).
- "Bản thu khác" của khối nghe (thuộc tính `data-khac`, `src/scripts/nghe.js`): Scarlatti K. 141 và K. 466 (John Sankey, chơi trên bàn phím MIDI, âm thanh harpsichord tổng hợp; K. 466 giấy phép `{{Attribution}}`), K. 545 chương 2 (Jason M. C. Han). Mốc tham khảo chỉ theo bản đầu.
- Lượt 2 (agent con độc lập, đọc wikitext Commons, DAHR): 1 sai (Beethoven 5: người chơi là Skidmore College Orchestra, không phải Musopen, đã sửa), 6 chưa chắc, review giải quyết hết. Bỏ bản Mendelssohn (Hankyung Arte Philharmonic: tải từ YouTube, chưa xác nhận giấy phép CC) và bản MIT Messiah (không có xác nhận người giữ quyền), thay bằng bản Edison 1916.
- Các trang dùng bản ghi mở rồi khóa lại không đổi chữ; trang Scarlatti sửa đoạn giới thiệu bản thu (n24, n26, n43, `doi_chu`).
- `tools/audio/licenses.py` nhận `{{Attribution}}` (nhãn "ghi công tác giả, mẫu Attribution của Commons", không ngoặc để khớp mẫu `NGUON.txt`); kiểm thử Python. Review mã (Sonnet, đọc diff): một chỗ phải sửa (nhãn có ngoặc), đã sửa; thêm `aria-label` cho nút "Nghe bản này".
- `src/components/BangCuon.astro`: bảng tràn dù 1 px cũng nhận focus (axe `scrollable-region-focusable` ở bảng "Cách diễn tấu" của Từ điển, 360 px: 329 trên 328 px).

## 3. Đợt 9

- Site thật (bản `447f3e1`, sau khi sửa deploy ở `mo/sua-deploy`): Lighthouse qua PageSpeed Insights, di động: trang chủ, `bat-dau/tom-tat`, `piano/tac-pham/fur-elise` đều 100/100/100/100, TBT 0 ms.
- Link nội bộ trên site thật (đọc sitemap, tải từng trang trong trình duyệt): 242 trang, 2569 link và `#mục` khác nhau, 0 hỏng.
- `kiem-link.yml` chạy tay lần đầu (issue #1): link Open Music Theory "Inversion and Figured Bass" 404 vì OMT tách chương; sửa thành "Inversion" và "Figured Bass and Roman Numerals with Figures" ở `piano/hoa-am/dem-giai-dieu` (mở rồi khóa lại). vienamnhac.vn mở được trong trình duyệt (lỗi mạng tạm thời); 4 link hết giờ (multimatechopin, onmusic, chopin.nifc) để lần chạy tuần sau xác nhận.
- Bảng Tiến độ: đợt 9 "Xong". Còn theo dõi lỗi tới 21/11/2026.

## Kiểm

- `npm run build`, `npm test` (352 đạt), `node tools/khoa.mjs tinh`, `so-chu.mjs --doi-chu` các trang mở, `check_audio.py --static --network` (0 lỗi, 63 bản ghi có bản thu), `python3 -m unittest discover -s tools/audio/tests`.
- Chromium trên `nhac-ly/tu-dien`, `nghe-nhac/scarlatti-sonata`, `nghe-nhac/beethoven-5`, `piano/tac-pham/mozart-k545` (209 đạt). WebKit và Firefox không cài được ở máy làm việc: deploy chạy đủ ba trình duyệt (có đổi mã).
