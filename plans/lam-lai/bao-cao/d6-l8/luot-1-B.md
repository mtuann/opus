# D6-L8, lượt 1, phần B

Claude Opus 5.5 (agent con), 06/11/2026, nhánh `moi/d6-l8`. Năm hướng dẫn nghe và năm bản ghi cùng tên: `grieg-concerto`, `gershwin-rhapsody`, `rachmaninoff-2`, `vivaldi-mua-dong`, `vivaldi-mua-xuan`. Không build, không chạy kiểm thử. `node tools/khoa.mjs xuat` đọc được cả 10 hồ sơ.

## Số liệu

| Trang | Nhận định | dung | da-sua | da-bo | khong-can-nguon | chưa chắc |
|---|---|---|---|---|---|---|
| nghe-nhac/grieg-concerto | 71 | 56 | 11 | 0 | 3 | 1 |
| nghe-nhac/gershwin-rhapsody | 34 | 23 | 8 | 0 | 0 | 3 |
| nghe-nhac/rachmaninoff-2 | 31 | 23 | 6 | 2 | 0 | 0 |
| nghe-nhac/vivaldi-mua-dong | 33 | 24 | 8 | 0 | 0 | 1 |
| nghe-nhac/vivaldi-mua-xuan | 31 | 28 | 2 | 0 | 0 | 1 |
| **Cộng** | **200** | **154** | **35** | **2** | **3** | **6** |

Theo loại (cả năm trang): cau-truc 64, lich-su 47, ten 32, ve-site 20, nam 16, so-lieu 7, danh-muc 5, khuyen-tap 3, cap-do 3, dinh-nghia 3.

Bản ghi (lần 2): grieg-concerto n4–n13 (10), gershwin-rhapsody n4–n9 (6), rachmaninoff-2 n4–n10 (7), vivaldi-mua-dong n4–n5 (2), vivaldi-mua-xuan n4–n10 (7). Tất cả `dung`. Không có mục nào trong `sua-B.yml`.

## Bản nhạc đã dùng

- Grieg: tổng phổ ba chương quét trên Internet Archive (`imslp-concerto-op16-grieg-edvard`) và bản hai piano Grainger (Schirmer 1920, `edvardgriegconce0000unse`). PDF trên IMSLP chặn máy.
- Rachmaninoff: tổng phổ quét trên Internet Archive (`rachmaninoff-1901-piano-concerto-no.-2-op.-18-full-score`).
- Gershwin: bản piano độc tấu © 1924 New World Music (Internet Archive `rhapsodyinblue00geor`), chỉ đọc.
- Vivaldi: Mutopia 301 (Mùa xuân) và 351 (Mùa đông), `.ly` và PDF, theo Performers' Facsimiles; Teoria cho phân đoạn Mùa xuân.

## Đã sửa, đã bỏ

- Grieg: Søllerød không còn "gần Copenhagen" (n15); bỏ lý do Grieg vắng mặt "bận biểu diễn ở Christiania" (n17); Liszt thị tấu "từ bản viết tay trước các vị khách" (n18); "sửa ít nhất bảy lần" thành sửa nhiều lần, bản sửa cuối mùa hè 1907, mất 4/9/1907 (n20, Henle, BSO); bỏ năm 1858 của buổi Clara Schumann (n25); halling viết lại theo Store norske leksikon, bỏ vế fiddle Hardanger (n28); Lipatti, Zimerman bỏ lời khen, thêm năm, hãng (n53, n54); "biểu diễn chuyên nghiệp" thêm nguồn RCM LRCM (n58); Notturno bỏ "chặng 6, ≈ Grade 7–8", thay bằng RCM Level 9 (n63); thêm dòng Henle ở mục Nguồn (n69).
- Gershwin: độ dài 16–17 thành 15 phút (n8, IMSLP); Broadway (n11, LoC); "huyền thoại" (n13); thêm câu láy rền và 17 nốt (n14); câu chuyện Gorman theo SF Symphony, bỏ "nổi tiếng nhất" (n15); nghĩa "rhapsody" theo COD (n17); bản 1942 "lâu nay được chơi và thu âm nhiều nhất" (n20, IMSLP); dòng 4 bảng Theo dõi ghi Andantino moderato, Mi trưởng thay cho "chủ đề nổi tiếng nhất" (n27).
- Rachmaninoff: ngày công diễn 27/10/1901 (lịch cũ), Siloti chỉ huy (n6); "nổi tiếng và được biểu diễn nhiều nhất" theo Henle (n13); bỏ câu bàn tay lớn và hợp âm rộng (n14, n15, da-bo: không có nguồn bậc 2 đọc được); dòng 1 bảng Theo dõi bỏ "nhà thờ Nga" (n19); Full Moon and Empty Arms bỏ năm 1945 (n26); "ảnh hưởng mạnh đến nhạc phim Hollywood" thành tên phim có nguồn (n27); thêm dòng Henle ở mục Nguồn (n29).
- Mùa đông: năm sáng tác "khoảng 1718–1720" thành "trước năm 1725 (IMSLP ghi năm 1723)" (n5); thêm nhà in Le Cène (n6); "từng bè lần lượt vào" (n16); bốn dòng bảng Theo dõi (n23, n26, n27, n28): bản nhạc không có "hợp âm dằn mạnh"; đoạn "răng va" (ô 47) là chất liệu mới của violin độc tấu, không phải "quay lại ở Fa thứ"; phần kết là dàn nhạc trở lại đoạn "giậm chân" rồi hai lần kết V–i; thêm dòng Mutopia ở mục Nguồn (n31).
- Mùa xuân: "ví dụ sớm và nổi tiếng nhất" thành "ví dụ nổi tiếng" (n12); ritornello "điệp khúc nhỏ" thành "lần quay lại nhỏ" cho khớp COD và trang đã khóa `hinh-thuc/concerto` (n14).

## Chưa chắc

- Grieg n22: concerto Schumann cũng mở đầu bằng cú "đổ" của piano: chưa mở được bản nhạc Op. 54.
- Gershwin n25, n26: ai chơi chủ đề ngay sau tiếng clarinet (bản đã mở là bản piano độc tấu); cần tổng phổ hay bản hai piano 1924.
- Gershwin n33, Mùa đông n32, Mùa xuân n30: dòng Nguồn "Burkholder, Grout, Palisca; Grove Music Online" (sách in, không mở được). Người giao chọn giữ như tài liệu đọc thêm hay bỏ.

## Cho người giao

- Mốc: không đổi số dòng hay thứ tự dòng ở bảng Theo dõi nào; chỉ đổi chữ trong ô. Mốc giữ nguyên.
- Mùa đông không có `ban_thu`. Commons có bản thu chương 1 của John Harrison (208,8 giây, CC BY-SA 4.0, cùng bộ với bản Mùa xuân), nếu muốn thêm sau.
- Mô tả trang (`description`) của Mùa xuân vẫn là chữ cũ ("một trong những ví dụ…", cắt trước chữ đã sửa); không đổi vì lấy từ `og:description` cũ.
- Câu ở hồ sơ khác vẫn đúng: `nhac-cu/clarinet` n24, `blog/posts/2026-10-23-phien-ban-15` n20, `piano/tac-pham/grieg-arietta` n21, n81 (năm 1868), `cap-nhat` n31, `hinh-thuc/concerto` n12, n24, n28, n29, `hinh-thuc/rondo` n25, `nhac-cu/violin` n17, `lich-su/thoi-ky/baroque` n46, `nhac-ly/29-chuoi-hoa-am` n23.
- Trường đã khóa: không thấy sai.

## Thuật ngữ chưa có trong `thuat-ngu.yml` (cho D3-L5)

halling, syncopation (đảo phách), rhapsody, blues, jazz, alla marcia, ritornello, tutti, solo, tasto solo, sonnet, bè trầm liên tục (basso continuo), âm nhạc miêu tả (programme music).

## Nguồn hay dùng

IMSLP (wikitext qua `api.php`); Henle (lời tựa PDF của HN 719, HN 1214; trang HN 1020); Internet Archive (bản nhạc quét); Mutopia (`.ly`, PDF); Wikimedia Commons (API); Library of Congress (blog, National Jukebox `.json`, authority `.json`); chú giải của BSO, Berliner Philharmoniker, LA Phil, Utah Symphony, SF Symphony, Boston Baroque; Stony Brook Libraries; COD qua Encyclopedia.com; Store norske leksikon; RCM Piano Syllabus 2022; MusicBrainz; Deutsche Grammophon.
