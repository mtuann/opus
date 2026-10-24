# D2-0, lượt 1, phần D: 73 người ở `nha-soan-nhac` (từ Prokofiev đến Yunchan Lim)

Hồ sơ: `kiem-dinh/du-lieu/nha-soan-nhac/<id>.yml` (73 file, id theo lời giao). Làm ngày 24/10/2026 bởi Claude Sonnet 5.5. Chưa ghi `luot_2`, `review`, `kiem_mau`. `src/data/` chưa sửa.

## Số liệu

- 73 bản ghi, 159 nhận định: `ten` 73, `nam` 73 (`sinh` và `mat` chung một nhận định), `lich-su` 13 (`thoi_ky`).
- `dung` 151, `da-sua` 0, chưa chắc 8. `sua-D.yml` là danh sách rỗng: mọi tên, năm sinh–mất, còn sống/đã mất đều đúng.
- 30 người đã mất, khớp năm mất (kể cả Brendel 2025, Gubaidulina 2025, Pollini 2024, Senneville 2023, Saariaho 2023, Lupu 2022, Kapustin 2020). 43 người còn sống (`mat: null`): không ai có tin mất đến 24/10/2026.
- Không bản ghi nào có `khoang`, `cach_viet_khac`, `mau_thuan`. 13 bản ghi có `thoi_ky`: 6 "Thế kỷ 20" (đã mất), 7 "Đương đại" (Gubaidulina, Saariaho đã mất; Pärt, Reich, Glass, Adams, Shaw còn sống).
- 10 id mơ hồ (moore, adams, chin, wang, cho, liu, lu, lim, shaw, montgomery): đã xác định người theo `ten` và cách trang cũ dùng, ghi ở `ghi_chu` đầu hồ sơ.

## Nhận định chưa chắc (`ket_qua: null`, 8)

1. `thoi_ky: Đương đại` (n3) của gubaidulina, part, reich, glass, adams, saariaho. Nguồn ngoài không phân định được: IMSLP chỉ có nhóm "Modern era", chung cho Thế kỷ 20 và đương đại (cùng nhóm với Shostakovich, Messiaen, Britten). Site tự định nghĩa Thế kỷ 20 ~1900–2000, Đương đại 2000–nay; sáu người này viết ở cả hai bên mốc 2000. Trang cũ tự mâu thuẫn: `lich-su/dong-thoi-gian.md` và `duong-dai.md` ghi "Đương đại", còn `lich-su/nha-soan-nhac.md` xếp Pärt, Reich, Glass, Adams dưới mục "Thế kỷ 20" (`lich-su/index.md` cũng liệt kê Reich, Glass trong "Tên tuổi" của Thế kỷ 20; `duong-dai.md` gọi Gubaidulina "quan trọng nhất cuối thế kỷ 20"; `opera.md` xếp Saariaho vào "Thế kỷ 20 đến nay"). Chủ repo chọn một cách cho cả sáu: giữ "Đương đại" hay đổi "Thế kỷ 20/Đương đại" (dạng A/B của schema).
2. `nguyen-manh-duy-linh` n2: không nguồn nào đã mở nêu năm sinh 1980 (Wikipedia tiếng Việt và Wikidata ghi nhưng không dẫn nguồn; trang nghệ sĩ của HBSO không mở được vì chứng chỉ SSL hết hạn). Bằng chứng còn hoạt động chỉ đến 8/2023; không có tin mất.
3. `sa-huynh` n2: không nguồn nào nêu năm sinh; hai bài báo (3/2021 "33 tuổi", 5/2011 "sáng tác năm 19 tuổi") cùng suy ra 1988. Có hai người nghệ danh Sa Huỳnh (nhạc sĩ con gái Triều Dâng là người của hồ sơ này; ca sĩ bolero sinh 1987 ở Quảng Bình là người khác). Ngoài dữ liệu: kết quả tìm kiếm ghi tên thật của nhạc sĩ là Lương Sa Huỳnh, còn trang cũ `lich-su/nu-nha-soan-nhac.md` ghi "Nguyễn Sa Huỳnh": lô của trang đó nên kiểm.

## Chỗ `dung` nhưng cần review

- `lili-boulanger` n3 ("Thế kỷ 20"): IMSLP xếp "People from the Romantic era", Hyperion không gán thời kỳ. Giữ theo mốc ~1900–2000 của site (mọi tác phẩm 1909–1918); đã ghi ở `ghi_chu`.
- Bằng chứng còn sống yếu hơn: ashkenazy (nghỉ biểu diễn từ 1/2020; mốc mới nhất đã mở là blog đề 6/7/2026), yiruma (trang chính thức bỏ từ 2021; mở được bài 11/2023; buổi Carnegie Hall 10/2025 chỉ thấy qua tìm kiếm, trang bị chặn), dang-huu-phuc (giải thưởng Hội Nhạc sĩ 12/2024), tran-kim-ngoc (bài Hội Nhạc sĩ 7/2025), lim (một nguồn bậc 2), kurtag (100 tuổi; trang Học viện Liszt 11/10/2026). Pires đã đột quỵ và ngừng biểu diễn (Barbican, Philharmonie de Paris hủy buổi 4/2026) nhưng còn sống (bản tin 5–9/2026).
- Năm sinh chỉ có nguồn báo hoặc ít nguồn bậc 2: luong-hue-trinh (Viet Nam News 2019), nghiem-phu-phi (trang của gia đình và RFA 2008), do-nhuan (Hội Nhạc sĩ cho năm, báo QĐND cho ngày), montgomery (trang dàn nhạc), senneville (chỉ BnF và GND).
- Ngày lệch giữa nguồn, năm trùng: Kabalevsky (mất 14/2 IMSLP, 27/2 GND), Lipatti (sinh 1/4 IMSLP, 19/3 GND, khác lịch), Hoàng Việt (hồ sơ Hội Nhạc sĩ gõ "31/12/967"), Đặng Hữu Phúc (hồ sơ Hội 1/7/1953; Wikipedia tiếng Việt 4/6/1953, chỉ để tham khảo). IMSLP chưa ghi ngày mất của Gubaidulina.

## Vấn đề schema và việc chủ repo cần quyết

- Không có loại nhận định riêng cho thời kỳ: dùng `lich-su`.
- Khóa `mat: null` của 43 người còn sống sẽ sai ngày họ mất (phải mở khóa). Đề nghị chỉ khóa `mat` cho người đã mất; với người sống khóa từng phần `du-lieu/nha-soan-nhac/<id>#ten,sinh`. Muốn vậy cần tách n2 thành hai nhận định (năm sinh; còn sống) ở lượt 2 hay review, vì hiện `sinh` và `mat` chung một nhận định.
- Chưa nên khóa `thoi_ky` của sáu người ở mục 1 cho đến khi chọn xong.

## Nguồn

- Dùng nhiều nhất: Deutsche Biographie (bản sao dữ liệu GND; 60 lần), BnF data.bnf.fr (25, chỉ cho người đã mất vì trang người sống không ghi năm), IMSLP category (24; không có trang cho Saariaho, Adams, Shaw, Chin, Montgomery, Thorvaldsdottir, Max Richter, Adès, Kapustin), Deutsche Grammophon, Hội Nhạc sĩ Việt Nam (hoinhacsi.vn), Boosey & Hawkes, Wise Music, Hyperion, Warner, ECM, Harrison Parrott, K.D. Schmid, Salzburg và Lucerne Festival, trang chính thức của nghệ sĩ.
- WebFetch bị chặn ở id.loc.gov, viaf.org, d-nb.info, lobid.org, stevereich.com, earbox.com, carnegiehall.org, oxforddnb.com, prestomusic.com, bbc.co.uk, web.archive.org: dùng bản sao GND (Deutsche Biographie) thay d-nb.info, hãng đĩa và nhà xuất bản thay các trang còn lại. Wikipedia, Wikidata chỉ dùng để tìm mã và nguồn, không dẫn.
- Cách kiểm: viết hồ sơ xong, đọc lại nguyên văn mọi trang đã dẫn bằng HTTP thường (bài học của phần B: tóm tắt của WebFetch có thể sai) rồi đối chiếu bằng script. 109 ngày/năm trong `ghi_chu` (IMSLP, GND, BnF, Hyperion) khớp hết. 38 nhận định có câu trích không nằm trong trang dùng cho chính nhận định đó; đã xem từng chỗ: là tên theo thư viện khác (nằm ở nguồn khác của hồ sơ), chữ ghép hay viết lại, chữ của trang cũ, hay lỗi bỏ dấu của script; không chỗ nào sai. Hai trang không đọc được bằng HTTP thường (aso.org, colinscolumn.com) chỉ có tóm tắt của WebFetch. Về còn sống, quét thêm bản tin cáo phó hằng tháng của Classical Music Daily (1–10/2026 và vài tháng 2024–2025) và danh sách "Deaths in <tháng>" của Wikipedia từ 1/2022 đến 24/10/2026 (chỉ để tìm, không dẫn), rồi tìm "dies/obituary" cho người cao tuổi: không có tên nào trong 43 người.

## Việc ngoài phạm vi, để lô trang xử lý

- `docs/piano/nghe-si.md` (hàng Maria João Pires) chưa nói bà đã ngừng biểu diễn (2025–2026).
- `luonghuetrinh.com` (trang cá nhân của Lương Huệ Trinh) hiện bị chiếm làm trang rác: không link tới.
