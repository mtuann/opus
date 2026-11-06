# D6-L10 lượt 1, phần A: Beethoven 5, Beethoven Op. 132, Mendelssohn Concerto violin, Tchaikovsky 1812

Người làm: Claude Opus 5.5, agent con, D6-L10 phần A (06/11/2026). Mỗi trang do một fork làm; ghi chú từng trang dưới đây. File sửa dữ liệu `sua-A.yml`: không có mục.

## Tóm tắt

| Trang | Nhận định | dung | da-sua | da-bo | khong-can-nguon | Bản ghi (lần 2) |
|---|---|---|---|---|---|---|
| beethoven-5 | 39 | 28 | 8 | 1 | 2 | 9 (n4–n12), đều dung |
| beethoven-op132 | 32 | 21 | 10 | 1 | 0 | 6 (n4–n9), đều dung |
| mendelssohn-violin | 34 | 28 | 5 | 1 | 0 | 8 (n4–n11), đều dung |
| tchaikovsky-1812 | 40 | 11 | 28 | 1 | 0 | 2 (n4–n5), đều dung |

- Không có `ket_qua: null`. Một khuông nhạc (beethoven-5, khối 1): đúng.
- Số dòng, thứ tự bảng Theo dõi khi nghe không đổi ở cả bốn trang (9, 5, 8, 7 dòng); cột đầu vẫn `…`. Không trang nào có mốc.
- Chưa viết `doi_chu` (người giao dựng bằng `so-chu.mjs --doi-chu`).
- Trường đã khóa của bốn bản ghi: không thấy sai.
- Câu `ve-site` ở hồ sơ khác trỏ tới bốn trang: vẫn đúng hết (chi tiết từng trang).

## Beethoven, Giao hưởng số 5 (nghe-nhac/beethoven-5, tac-pham/beethoven-5)

Số liệu
- Trang: 39 nhận định. Loại: cau-truc 23, lich-su 5, nam 4, ve-site 3, ten 2, so-lieu 2, khuyen-tap 2, danh-muc 1. dung 28, da-sua 8 (n2, n11, n12, n22, n26, n30, n38), da-bo 1 (n37), khong-can-nguon 2.
- Khuông nhạc khối 1 (ô 1–5, rút gọn): khớp từng nốt với tổng phổ Eulenburg ô 1–5 (Sol Sol Sol | Mi♭ ngân | Fa Fa Fa | Rê nối Rê, ngân ở ô 5); `Q:1/2=108` khớp chỉ dẫn máy đếm nhịp in trên tổng phổ (lời tựa Altmann: của Beethoven, AMZ 17/12/1817).
- Bản ghi lần 2: n4–n12 (thoi_ky 1, luyen_nghe 1, hinh 7), đều dung.

Sửa, bỏ
- n11, n2: bỏ "nổi tiếng nhất lịch sử âm nhạc" ở thân trang và description.
- n12: "phách đầu tiên là dấu lặng" thành "đầu ô nhịp, đúng vào phách mạnh, là một dấu lặng ngắn" (lặng móc đơn trong ô 2/4, không chiếm cả phách).
- n26: dòng 1 bảng, "cả dàn nhạc đồng âm" thành "đàn dây và clarinet đồng âm" (tổng phổ ô 1–5).
- n22: "chủ đề 2 … được kèn horn giới thiệu" thành "chủ đề 2 … ở violin; ngay trước đó, kèn horn dẫn vào bằng chính nhịp …" (horn ô 59–62, chủ đề 2 ô 63 ở violin 1 *p dolce*). Giữ ý "horn dẫn vào chủ đề 2".
- n30: "phần lớn bản thu chơi nhắc lại" thành "bản nhạc ghi dấu nhắc lại, nên nhiều bản thu chơi lại phần trình bày".
- n37 (bỏ): dòng Burkholder/Grove. n38: thêm dòng nguồn Beethoven-Haus (năm sáng tác, công diễn).

Câu ve-site ở hồ sơ khác: `hinh-thuc/scherzo` s28, `hinh-thuc/sonata` n32, `nhac-cu/dan-nhac` d27, `nhac-ly/20-doc-tong-pho` n21/n28 (trang nay viết "kèn horn dẫn vào"), `nhac-ly/30-phat-trien-motip` n5, `nhac-ly/07-gam-thu` n3/n17, `cap-nhat` n65, `nhan-dien/dau-van-tay` n52, `lich-su/nha-soan-nhac` s5: đều đúng.

Nguồn: tổng phổ Eulenburg No. 402 (Unger) trên Internet Archive `symphonyno5cmino0000unse` (ảnh trang qua PyMuPDF); IMSLP (api.php); Beethoven-Haus ("Early 1804 to March 1808"); MusicBrainz (Kleiber DG 2530 516, thu 3–4/1974 ở Musikverein, 32:59; Karajan 31:21); Bernstein 1963 (Internet Archive, 35:10); chú giải Buffalo Phil, NAC, Burgess Hill SO; DG; Eighteenth-Century Music (Cambridge, Dahlhaus về Hoffmann 1810).

Người giao quyết
- `thoi_ky` "Cổ điển → Lãng mạn": ghi dung (nguồn riêng cho Giao hưởng số 5); lưu ý review D6-L5 chọn "Cổ điển" cho Pathétique.
- `hinh.nghe` ô III độ rộng 0.9 (tỉ lệ thời lượng thật khoảng 0.7): không sai, đổi là tùy chọn.
- Chú giải Buffalo Phil nằm trên audienceaccess.co, không tên người viết.

Thuật ngữ thiếu: trio, biến tấu, biến tấu kép, đồng âm (unison; file chỉ có "đồng âm khác tên"), dấu nhắc lại, chủ đề, con moto. Trang viết "dấu ngân", bản ghi `fermata` có nghĩa "ngân dài tùy ý".

## Beethoven, Tứ tấu Op. 132 chương 3 (nghe-nhac/beethoven-op132, tac-pham/beethoven-op132)

Số liệu
- Trang: 32 nhận định. Loại: lich-su 10, cau-truc 9, ten 6, ve-site 3, nam 2, danh-muc 1, dinh-nghia 1, so-lieu 1. dung 21, da-sua 10, da-bo 1. Không có khuông nhạc.
- Bản ghi lần 2: n4–n9 (thoi_ky 1, luyen_nghe 1, hinh 4), đều dung.

Sửa, bỏ
- n2, n9: "Mùa xuân năm 1825 … ốm nặng và có lúc tưởng không qua khỏi" thành "tháng 4/1825 … lâm bệnh" (Cooper/CMS: "In April … he fell ill", Braunhofer khám 18/4/1825); description sửa theo.
- n8: chương 3 "15–18 phút" thành "15–20 phút" (MusicBrainz: Végh 14:29, Amadeus 16:01, Takács 17:12, Guarneri 19:20).
- n14: bỏ "thánh ca Trung cổ", "ngưng đọng, ngoài thời gian"; viết theo Cooper ("antiquated quality").
- n16: "nhiều nhạc sĩ coi là đỉnh cao của toàn bộ âm nhạc phương Tây" thành câu theo Cooper (các tứ tấu cuối cần thời gian mới được đón nhận; nay Op. 132 được coi là một trong những tứ tấu hay nhất).
- n17 (bỏ): "chương này là cửa vào tốt nhất".
- n20, n22: dòng A, B của bảng viết theo tổng phổ (thánh ca nốt trắng, bốn bè cùng chuyển hợp âm; B nhịp 3/8), bỏ so sánh cảm nhận.
- n26: dòng A'' sai: tổng phổ có *f*, *sf* ở cả bốn bè, không phải "cao trào lặng lẽ"; nay: hình giai điệu chuyền qua các bè, căng tới cao trào (*f*, *sf*), lắng xuống, kết *pp*.
- n29: "gần như điếc hoàn toàn" thành "đã điếc nặng (bác sĩ phải viết vào sổ hội thoại)" (Cooper; Beethoven-Haus "Beethoven's ear").
- n32: thêm dòng Nguồn chú giải Cooper (CMS, link ngoài).

Câu ve-site: bài 16 (đã khóa, có Lydian), `luyen-tap/ban-phim` có "Điệu Lydian" (công cụ `piano-explorer`, `GAM` trong `src/scripts/nhac-ly.js`), `nghe-nhac/mau` (chưa khóa, "sắp có" ở bản thật). Hồ sơ khác: `lich-su/nha-soan-nhac` s5 đúng.

Nguồn: tổng phổ Breitkopf GA Serie 6 Nr. 51 (1863, bản in lại Dover) trên Internet Archive `imslp-quartet-no15-op132-beethoven-ludwig-van`; Beethoven-Haus (trang tác phẩm, "Beethoven's ear"); Barry Cooper/CMS; IMSLP (api.php, template Late Quartets); Open Music Theory, Diatonic Modes (Wayback); MusicBrainz.

Người giao quyết
- IMSLP ghi 1823–25 (từ lúc nhận đặt hàng Galitzin); Beethoven-Haus, Cooper ghi 1825. Trang giữ "1825" (n5).
- "Năm tứ tấu cuối" (n15) không tính *Große Fuge* Op. 133.
- Dòng Nguồn mới (n32) có link ngoài, lychee sẽ kiểm: giữ hay không.

Thuật ngữ thiếu: điệu thức (mode), Lydian, chorale (thánh ca), molto.

## Mendelssohn, Concerto violin cung Mi thứ (nghe-nhac/mendelssohn-violin, tac-pham/mendelssohn-violin)

Số liệu
- Trang: 34 nhận định. Loại: cau-truc 15, lich-su 8, ve-site 4, nam 3, ten 3, danh-muc 1. dung 28, da-sua 5 (n8, n11, n24, n32, n33), da-bo 1 (n12). Không có khuông nhạc.
- Bản ghi lần 2: n4–n11 (thoi_ky, luyen_nghe, hinh 6), đều dung.

Sửa, bỏ
- n8: độ dài "26–28 phút" thành "24–27 phút" (MusicBrainz: Heifetz/Toscanini 23:49, Hahn 26:09, Jansen 26:50; Cleveland 25 phút).
- n11: thư từ "về từng chi tiết kỹ thuật" thành "bàn cả những chi tiết kỹ thuật của phần violin" (BSO).
- n12 (bỏ): "một trong những concerto violin được biểu diễn nhiều nhất mọi thời đại".
- n24: dòng Andante bỏ so sánh "ca khúc không lời"; nay "violin hát một giai điệu êm, dịu" (Indianapolis).
- n32, n33: mục Nguồn: IMSLP trỏ thẳng trang tác phẩm, thêm tổng phổ Breitkopf trên Internet Archive, chú giải BSO (Ledbetter) và Cleveland.

Tổng phổ (Breitkopf Partitur-Bibliothek Part. B. 480): violin vào nửa sau ô 2; chủ đề 2 ở sáo, clarinet *pp* Sol trưởng trên Sol dây buông của violin; cadenza viết đủ nốt trước tái hiện; tái hiện: sáo, oboe, violin I vào lại chủ đề trong lúc độc tấu rải hợp âm; bassoon giữ nốt sang Andante (Đô trưởng 6/8); cầu nối Allegretto non troppo Mi thứ; chương 3 Mi trưởng mở bằng horn, trumpet, bassoon, timpani. Mọi câu cấu trúc khớp.

Câu ve-site ở hồ sơ khác: `hinh-thuc/concerto` n27, `nhac-cu/violin` n18, `hinh-thuc/sonata` n33 (cadenza trước tái hiện), `lich-su/thoi-ky/lang-man` n37: đúng.

Nguồn: Internet Archive `ldpd_11898794_000` (Columbia); IMSLP (api.php: 1838–16/9/1844, công diễn 13/3/1845 với David, Gade chỉ huy); chú giải BSO và Aspen (Ledbetter: nốt bassoon "to forestall intrusive applause"), Cleveland (Laki), Indianapolis; Carnegie Mellon (John Ito) cho câu "khác với Mozart"; LoC; MusicBrainz.

Người giao quyết: giữ so sánh "nhạc tiên của *Giấc mộng đêm hè*" (Indianapolis, BSO "fairy music"); hai link ngoài mới ở mục Nguồn (lychee kiểm).

Thuật ngữ thiếu: concertmaster, appassionato, molto, hợp âm rải (arpeggio), dây buông.

## Tchaikovsky, 1812 Overture (nghe-nhac/tchaikovsky-1812, tac-pham/tchaikovsky-1812)

Số liệu
- Trang: 40 nhận định. Loại: lich-su 17, cau-truc 13, ten 5, nam 3, ve-site 2, danh-muc 1, so-lieu 1. dung 11, da-sua 28, da-bo 1. Không có khuông nhạc.
- Bản ghi lần 2: n4 (thoi_ky), n5 (luyen_nghe), đều dung. Bản ghi không có `hinh`.

Sửa, bỏ
- n4: "*Ouverture solennelle "1812"*" thành "Overture lễ hội *Năm 1812* (*1812 год*)" (Tchaikovsky Research, IMSLP, bìa tổng phổ; tên tiếng Pháp chỉ thấy ở tên track).
- n2, n6, n7, n11: viết tháng 9–11/1880, "theo đặt hàng"; ra mắt chính thức 20/8/1882 ở Moscow; n16 (mới): trước đó có hai buổi ở Ozerki, Pavlovsk.
- n12, n13: bỏ vế "viết cho lễ khánh thành nhà thờ là ngộ nhận" (Tchaikovsky Research: lễ thánh hiến là một trong ba dịp được gợi ý; bản in đầu có phụ đề về lễ thánh hiến).
- n15: bỏ "chiếc lều cạnh nhà thờ đang xây dở" (chỉ Wikipedia); nay: hội trường triển lãm, Altani chỉ huy, triển lãm dời sang 1882.
- n17, n19: "thánh ca Chính thống giáo" thành lời cầu nguyện *Lạy Chúa, xin cứu dân Ngài*; thêm năm 1833 của *God Save the Tsar*, hai giai điệu Nga.
- n20–n23: đoạn đại bác viết theo tổng phổ (đại bác ở cao trào [15], Largo trở lại với chuông, phần kết có quốc ca và đại bác); câu mới: Tchaikovsky muốn dùng trống lớn treo của nhà hát; đại bác thật ở buổi ngoài trời (Boston Pops 4/7 từ 1974; Boston Globe 1998, Boston.com 2015).
- n24, n25: trích thư 1880 ("very loud and noisy… lacking in artistic merit"); "nổi tiếng nhất thế giới" thành "trong số tác phẩm được biết đến và diễn nhiều nhất của Tchaikovsky; ông chỉ huy nó 13 lần".
- n9: thể loại thêm dàn nhạc lớn, chuông, "đại bác", ban nhạc kèn tùy chọn.
- n26–n32: bảy dòng bảng viết lại theo tổng phổ (cùng số dòng, thứ tự): mở đầu viola và cello solo rồi kèn gỗ; dòng 2 Andante oboe, clarinet, horn trên trống con (bỏ "kèn trận xa dần: quân Pháp"); *Marseillaise* lần đầu ở horn, ô 119; hai giai điệu Nga (dân ca *Bên cổng* ở sáo, cor anglais); trận chiến; cao trào đại bác (bỏ "Marseillaise gãy vụn"); Largo với chuông rồi phần kết.
- n33, n35: câu hỏi: bỏ giả định "mỗi lần yếu đi" (Tchaikovsky Research ghi năm lần trích); "nghe bộ gõ và kèn đồng" thành gợi ý theo tổng phổ (trống con, horn, đại bác).
- n38 (bỏ): dòng Burkholder/Grove. n39: thêm dòng nguồn Tchaikovsky Research.

Đọc ít chắc: nhãn "C-ne" ở Largo [16] đọc là Campane (OUP, BHSO cũng nói có chuông); số ô của chữ tập [15] ước theo số ô in chân trang.

Câu ve-site ở hồ sơ khác: `hinh-thuc/overture` n22, n23 (trang mới không trái mục "Đi qua một tác phẩm" và n17 của overture), `nhac-cu/trumpet` n27 (câu "bộ gõ và kèn đồng" đã viết lại, không trái biên chế), n28, `cap-nhat` n70 (9–11/1880, 20/8/1882): đúng. `ghi_chu` của overture n22, trumpet n27/n28 còn ghi "chưa chuyển": lỗi thời, ngoài lô.

Nguồn: Tchaikovsky Research, The Year 1812 (chữ thật qua curl); IMSLP (api.php); tổng phổ Muzyka 1983 (theo Toàn tập 1961) trên Internet Archive `31761034924530` (bản này thay *God Save the Tsar* ở coda, chỗ ấy theo Tchaikovsky Research ô 388–398); MusicBrainz (Karajan 15:23, Doráti 14:48, Kunzel 15:40, Detroit 16:25, Gergiev 14:37: "khoảng 15 phút" đúng); Boston Globe, Boston.com, OUP blog (Barbour 2013).

Người giao quyết: trang không còn tên *Ouverture solennelle* (muốn giữ thì cần nguồn bậc 1–2).

Thuật ngữ thiếu: giusto, cor anglais, trống con, trống lục lạc, ban nhạc kèn (banda).

## Mạng

Mọi yêu cầu curl dùng User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`; không vòng chặn bot; PDF IMSLP không tải. Có dùng thêm WebSearch, WebFetch để tìm nguồn; hồ sơ chỉ ghi trang đã mở.
