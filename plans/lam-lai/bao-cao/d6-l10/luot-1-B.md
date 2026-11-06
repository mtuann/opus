# D6-L10, lượt 1, phần B

Claude Opus 5.5 (agent con), 06/11/2026, nhánh `moi/d6-l10`. Bốn hướng dẫn nghe và bốn bản ghi cùng tên: `bizet-habanera`, `schubert-ca-hoi`, `schubert-erlkonig`, `tchaikovsky-ho-thien-nga`. Không build, không chạy kiểm thử. `node tools/khoa.mjs xuat` đọc được cả 8 hồ sơ.

## Số liệu

| Trang | Nhận định | dung | da-sua | da-bo | khong-can-nguon | chưa chắc | Khuông |
|---|---|---|---|---|---|---|---|
| nghe-nhac/bizet-habanera | 28 | 20 | 6 | 1 | 1 | 0 | 1 (da-sua) |
| nghe-nhac/schubert-ca-hoi | 30 | 22 | 7 | 0 | 1 | 0 | 0 |
| nghe-nhac/schubert-erlkonig | 32 | 24 | 6 | 1 | 1 | 0 | 1 (da-sua) |
| nghe-nhac/tchaikovsky-ho-thien-nga | 24 | 15 | 7 | 1 | 1 | 0 | 0 |
| **Cộng** | **114** | **81** | **26** | **3** | **4** | **0** | **2** |

Theo loại (cả bốn trang): cau-truc 41, ten 23, lich-su 20, nam 10, ve-site 8, so-lieu 4, khuyen-tap 4, danh-muc 3, dinh-nghia 1.

Bản ghi (lần 2, trường chưa khóa): bizet-habanera n3–n5 (thoi_ky, luyen_nghe, hinh), schubert-ca-hoi n4–n7 (thoi_ky, luyen_nghe, hinh ×2), schubert-erlkonig n4–n5, tchaikovsky-ho-thien-nga n4–n5 (thoi_ky, luyen_nghe). Tất cả `dung`. `sua-B.yml` rỗng.

## Bản nhạc đã dùng

Tải từ Internet Archive (PDF của IMSLP chặn máy), render bằng PyMuPDF, đọc từng ô:
- Habanera: bản piano–thanh nhạc Choudens (Paris, khoảng 1900, lời Ý–Đức; `carmenopraen4act00bize`, tr. 45–55) và G. Schirmer (New York, 1895, lời Pháp–Anh; `carmenoperainfou00bize`, tr. 44–54, kèm danh sách vai, tóm tắt, ngày công diễn).
- Erlkönig: Schubert-Album tập 1, Peters (Friedlaender, khoảng 1890; `schubertalbumsam00schu_0`, tr. 170–175). Hai bản khác trên IA (`imslp-d328-op1…`, `b47549919`) là bản phối của Liszt: không dùng.
- Ngũ tấu: tổng phổ trên IA (`imslp-quintet-in-a-major-d667-schubert-franz`, bản khắc cũ không rõ ấn bản, cello và contrabass chung một khuông; chương 4 tr. 29–38); Die Forelle theo Peters (tr. 197–199).
- Hồ thiên nga: tổng phổ số 10 (`imslp-lake-ballet-op20-tchaikovsky-pyotr`, file `Swan_Lake_-_No._10.pdf`, bản khắc B.B. 59, tr. 223–234).

## Nguồn hay dùng

IMSLP (wikitext qua `api.php`: năm, công diễn, cast, thời kỳ, ngày sinh mất); Tchaikovsky Research (`index.php?…&action=raw`); lời tựa Henle HN 463 (PDF trang mẫu) và trang sản phẩm; ghi chú chương trình của Chris Darwin (Sussex, có lời Stadler); Hyperion (Graham Johnson, Erlkönig); giáo trình mở Lumen Learning (Tidewater CC, chương Art Song); trang Music Humanities của Columbia (hồi ức Halévy 1904, bài opéra comique; đọc qua Wayback vì Cloudflare); COD qua encyclopedia.com (habanera); Deutsche Grammophon (DVD Carmen của Met); MusicBrainz (độ dài, bản thu Fischer-Dieskau/Moore).

## Đã sửa, đã bỏ

- **Habanera**: thêm ngày mất 3/6/1875 (n12); "một trong những opera được diễn nhiều nhất thế giới" thành thành công ở Vienna 10/1875 rồi Brussels, St. Petersburg, London, New York theo Halévy (n13); tên bài *El arreglito* của Yradier (n15); dòng 3 bảng Theo dõi: chính Carmen ngân "L'amour!", hợp xướng hát lại câu đi xuống và xen "Prends garde à toi!" (câu cũ gán "L'amour!" cho hợp xướng, sai) (n19); dòng 5 cụ thể thay "cao trào" (n21); khuông nhạc: bè trầm thật Rê2–La2–Fa3–La2 bốn ô mở đầu (khối cũ mọi nốt là Rê3 và ô 3 xuống La, bè thật giữ Rê) (khoi 1); bỏ dòng Burkholder/Grove (n27), thêm dòng ấn bản (n28).
- **Erlkönig**: "đứa con ốm … đêm bão" thành "đứa con nhỏ … đêm lộng gió" (lời Goethe: «durch Nacht und Wind», không nói ốm) ở mô tả và câu mở (n2, n10); bỏ "Điều kỳ diệu" (n11); tay trái "gầm gừ như gió bão" thành chuỗi liên ba trầm (n17); "cực kỳ khó và mệt" viết lại theo Hyperion: Schubert tự viết một bản đơn giản hóa liên ba (n18); khuông nhạc: quãng tám Sol3–Sol4 (khối cũ cao hơn một quãng tám), ♩ = 152 theo Peters (khoi 1); bỏ dòng Burkholder/Grove (n31), thêm dòng ấn bản (n32).
- **Ngũ tấu Cá hồi**: Paumgartner là "người bảo trợ âm nhạc ở Steyr, cũng chơi cello", bỏ "nghiệp dư" (n2, n10, n11); "thay vì hai violin, có một contrabass … để cello được tự do hát" thành không có violin thứ hai, theo mẫu Hummel; contrabass giải phóng piano khỏi bè trầm (n13, n14, Sussex); bỏ "(thay vì 4 thông thường)" (n15); thêm hai dòng Nguồn (n30). Bảng Theo dõi khớp tổng phổ, không đổi.
- **Hồ thiên nga**: cốt truyện theo bản 1877, bỏ "phù thủy Rothbart biến thành thiên nga" (n2, n10); "buổi công diễn đầu tiên không thành công" sai theo Tchaikovsky Research («The production went well», diễn tới 1882/83): viết lại thành n11, n12 (bản 1895 Petipa–Ivanov là gốc phiên bản phổ biến thế kỷ 20); bỏ "nổi tiếng nhất" (n13); dòng Nghe thêm: *Các điệu múa của thiên nga* (số 13, bảy phần), bỏ "thiên nga nhỏ … rất nhanh … nổi tiếng không kém" (n20); bỏ dòng Burkholder/Grove (n23), thêm dòng nguồn có link Tchaikovsky Research (n24).
- Mọi trang: số dòng và thứ tự bảng Theo dõi giữ nguyên, cột đầu "…", không có mốc. Không viết `doi_chu` (người giao dựng bằng `so-chu.mjs --doi-chu`). Không còn khoảng trắng cuối dòng.

## Chỗ chưa chắc, cần người giao để ý

- Không có nhận định `ket_qua: null`.
- Ngũ tấu n5: Henle ghi "probably … 1819"; trang viết "1819, sau một mùa hè ở Steyr" (trang sản phẩm Henle: viết sau mùa hè; lời tựa: "trong chuyến đi đầu tới Steyr"). Giữ.
- Ngũ tấu n6 "Đầu Lãng mạn": IMSLP chỉ ghi Romantic; "đầu" dựa vào khung "khoảng 1820–1900" của `lich-su/thoi-ky/lang-man` (đã khóa). Lượt 2 có thể đòi nguồn.
- Erlkönig: ♩ = 152 là chỉ dẫn in trong ngoặc ở bản Peters (bản 1821 chỉ ghi Schnell); trang ghi "theo bản ấy".
- Hồ thiên nga: tên "Điệu múa của bốn thiên nga nhỏ" (No. 13, phần IV) chưa tìm được nguồn bậc 2 đã mở, nên trang không còn nêu.
- Câu gợi hình trong bảng ("như lúc nước suối bị khuấy đục", "như nhịp bước uốn lượn", "mặt hồ ban đêm") giữ, ghi ở `ghi_chu` là hình ảnh gợi nghe của site.

## Câu `ve-site` ở hồ sơ khác trỏ tới trang của phần B

Đều còn đúng (đường dẫn và tiêu đề giữ nguyên, trang có trong `src/content/docs/`):
- `bizet-habanera`: `lich-su/opera` n62, `nhac-cu/nhac-cu-khac` n22, `lich-su/nha-soan-nhac` s5.
- `schubert-ca-hoi`: `hinh-thuc/bien-tau` n37 (chương 4 biến tấu trên *Die Forelle*); `piano/choi-cung-nguoi-khac` n8 (chương 4, bảng biên chế), n82 (contrabass thay violin thứ hai: trang nay viết cùng ý, n13), n83 (đã khóa "piano dẫn/lùi": tổng phổ cho thấy piano nghỉ suốt chủ đề, dẫn ở biến tấu 1 và 3; chữ "im lặng" của trang giờ có bản nhạc làm nguồn, n19); `nghe-nhac/schubert-impromptu` n40; `piano/tac-pham/schubert-impromptu-sol-giang` n86; `nhan-dien/the-loai` n35; `lich-su/thoi-ky/lang-man` n37; `nhan-dien/dau-van-tay` n52; `nhac-cu/index` n18.
- `schubert-erlkonig`: `piano/choi-cung-nguoi-khac` n7 (dòng "Bản thu gợi ý | Dietrich Fischer-Dieskau (baritone) và Gerald Moore (piano)" giữ nguyên; MusicBrainz: hai người thu bài nhiều lần, EMI và Orfeo), n57 (vó ngựa suốt bài, câu cuối recitative, piano nghỉ: bản Peters, n16, n27); `nhac-cu/index` n21; `nhac-ly/31-hinh-thuc-nho` n44 (Lumen: «through-composed»); `nhac-cu/nhac-cu-khac` n15, n22; `nhan-dien/the-loai` n35; `nghe-nhac/nghe-gi-tiep` n26. Dữ liệu `nha-soan-nhac/fischer` (Edwin Fischer), `moore`: trang không link tới bản ghi người, chỉ ghi tên.
- `tchaikovsky-ho-thien-nga`: `piano/tac-pham/tchaikovsky-cau-nguyen-buoi-sang` n73; `lich-su/thoi-ky/lang-man` n37; `nhan-dien/dau-van-tay` n52.

Nhiều `ghi_chu` ở các hồ sơ ấy còn ghi trang "chưa chuyển": không sửa (ngoài phần).

## Thuật ngữ chưa có trong `src/data/thuat-ngu.yml`

habanera, opera, mezzo-soprano, baritone, điệp khúc (refrain), hợp xướng (chorus), Lied (ca khúc nghệ thuật), recitative, liên ba (triplet), xuyên suốt (through-composed), ngũ tấu piano (piano quintet), chủ đề và biến tấu (theme and variations), contrabass, viola, cello, pizzicato, ballet, oboe, đàn hạc (harp), kèn horn, Scène (cảnh). Đã có: aria, tremolo, fortissimo, pianissimo, Andantino, Allegretto.

## Trường đã khóa

Không thấy chỗ sai. `bizet-habanera` không có `danh_muc` (IMSLP: «GB 9 ; WD 31»), như hồ sơ lần 1 đã ghi.

## Mạng

Mọi yêu cầu dùng `curl`/`urllib` với User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`: archive.org (tìm kiếm, metadata, tải PDF), imslp.org (`api.php`), musicbrainz.org (`ws/2`), henle.de, users.sussex.ac.uk, hyperion-records.co.uk, courses.lumenlearning.com (đọc robots.txt trước), deutschegrammophon.com (robots.txt cho phép), encyclopedia.com, en.tchaikovsky-research.net, web.archive.org (trang Columbia bị Cloudflare chặn). Tìm kiếm bằng công cụ WebSearch. Không vòng chặn nào.
