# Kiểm kê trang: tầng đề xuất và số liệu

Sinh bằng `python3 plans/ben-vung/kiem_ke.py` trên commit `5d08189 2026-10-23`. Đây là **đề xuất**: bạn duyệt tầng của từng trang, nhất là các trang tham chiếu có hạn và ngày rà lại; sau khi duyệt, việc D1.2 của `plans/lam-lai/README.md` chuyển bảng này thành `src/data/trang.yml`. Đường dẫn trang tính trong `docs/` của site cũ (từ repo mới là `../opus-zero/docs/`).

Cột: **Chữ** là số chữ ngoài khối code; **Khuông** là số khối ABC (trong ngoặc: số khối ghi "soạn cho trang này"); **Nguồn** là trang có mục `## Nguồn`; **Sửa** là số commit đã thêm hoặc sửa trang ở site cũ.

## Tổng theo tầng

| Tầng | Trang | Chữ | Khuông | Thiếu mục Nguồn | Giữ đúng bằng cách |
|---|---|---|---|---|---|
| Lõi | 100 | 130.728 | 233 | 13 | Kiểm định một lần rồi khóa (đợt 2–5) |
| Tác phẩm | 79 | 148.405 | 127 | 3 | Kiểm định từng trang rồi khóa (trang có sẵn: đợt 6; trang mới: them-tac-pham.md) |
| Tham chiếu có hạn | 7 | 20.153 | 0 | 3 | Rà theo ngày ghi trong cột Rà lại (chuyển ở đợt 8) |
| Khung và công cụ | 34 | 23.499 | 0 | 31 | Sinh từ dữ liệu; kiểm thử tự động (chuyển cùng đợt với mục của nó) |
| Ngoại vi | 13 | 11.552 | 1 | 1 | Vào mục Đọc thêm với dòng "ngoài lộ trình" (chuyển ở đợt 8) |
| **Cộng** | **233** | **334.337** | **361** | **51** | |

## Quy tắc xếp tầng

- **Lõi:** nền tảng nhạc lý, luyện tai, piano (kỹ thuật, cách tập, hòa âm bên phím, lộ trình 7 chặng), nhạc cổ điển (thời kỳ, hình thức, nhận diện, nhà soạn nhạc) và các trang bắt đầu. Nội dung ít đổi theo thời gian.
- **Tác phẩm:** mỗi trang viết về một tác phẩm hoặc một tập: bài học trong `piano/tac-pham/`, hướng dẫn nghe trong `nghe-nhac/`. Thêm mới theo `them-tac-pham.md`.
- **Tham chiếu có hạn:** nội dung đổi theo thời gian (chương trình thi, ứng dụng, giá đàn, tài nguyên). Cột Rà lại là ngày đề xuất.
- **Khung và công cụ:** trang chủ, trang mục lục, trang công cụ luyện tập, nhật ký Cập nhật, blog. Danh sách và con số trong các trang này sẽ sinh từ dữ liệu.
- **Ngoại vi:** ngoài trọng tâm piano cổ điển: nhạc cụ khác, opera, nhạc Việt Nam, nhạc đương đại, nữ nhà soạn nhạc. Vào mục Đọc thêm (đã chọn ngày 23/10/2026).

## Lõi (100 trang)

| Trang | Nhóm | Chữ | Khuông | Nguồn | Sửa |
|---|---|---|---|---|---|
| `bat-dau/bai-0` | Bắt đầu | 740 | 0 (0) | **thiếu** | 3 |
| `bat-dau/kiem-tra-dau-vao` | Bắt đầu | 478 | 0 (0) | **thiếu** | 2 |
| `bat-dau/lo-trinh-choi` | Bắt đầu | 2169 | 0 (0) | **thiếu** | 5 |
| `bat-dau/lo-trinh-nghe` | Bắt đầu | 1519 | 0 (0) | **thiếu** | 5 |
| `bat-dau/moi-ngay` | Bắt đầu | 567 | 0 (0) | **thiếu** | 3 |
| `bat-dau/tom-tat` | Bắt đầu | 667 | 10 (0) | **thiếu** | 2 |
| `luyen-tai/choi-bang-tai` | Luyện tai | 2380 | 3 (3) | có | 1 |
| `luyen-tai/nghe-gam` | Luyện tai | 782 | 0 (0) | có | 2 |
| `luyen-tai/nghe-hop-am` | Luyện tai | 682 | 2 (0) | có | 2 |
| `luyen-tai/nghe-quang` | Luyện tai | 678 | 0 (0) | có | 2 |
| `luyen-tai/nghe-tien-trinh` | Luyện tai | 992 | 4 (0) | có | 3 |
| `luyen-tai/nghe-tiet-tau` | Luyện tai | 651 | 0 (0) | có | 2 |
| `hinh-thuc/bien-tau` | Nhạc cổ điển nền tảng | 604 | 1 (0) | có | 3 |
| `hinh-thuc/concerto` | Nhạc cổ điển nền tảng | 474 | 0 (0) | có | 1 |
| `hinh-thuc/fugue` | Nhạc cổ điển nền tảng | 620 | 0 (0) | có | 3 |
| `hinh-thuc/minuet-trio` | Nhạc cổ điển nền tảng | 907 | 0 (0) | có | 4 |
| `hinh-thuc/overture` | Nhạc cổ điển nền tảng | 731 | 0 (0) | có | 4 |
| `hinh-thuc/rondo` | Nhạc cổ điển nền tảng | 324 | 0 (0) | có | 2 |
| `hinh-thuc/scherzo` | Nhạc cổ điển nền tảng | 857 | 0 (0) | có | 6 |
| `hinh-thuc/sonata` | Nhạc cổ điển nền tảng | 787 | 0 (0) | có | 2 |
| `hinh-thuc/symphonic-poem` | Nhạc cổ điển nền tảng | 886 | 0 (0) | có | 4 |
| `lich-su/dong-thoi-gian` | Nhạc cổ điển nền tảng | 940 | 0 (0) | có | 5 |
| `lich-su/nha-soan-nhac` | Nhạc cổ điển nền tảng | 3127 | 0 (0) | có | 6 |
| `lich-su/thoi-ky/baroque` | Nhạc cổ điển nền tảng | 650 | 1 (0) | có | 4 |
| `lich-su/thoi-ky/co-dien` | Nhạc cổ điển nền tảng | 528 | 1 (0) | có | 2 |
| `lich-su/thoi-ky/lang-man` | Nhạc cổ điển nền tảng | 598 | 1 (0) | có | 3 |
| `lich-su/thoi-ky/phuc-hung` | Nhạc cổ điển nền tảng | 485 | 1 (0) | có | 3 |
| `lich-su/thoi-ky/the-ky-20` | Nhạc cổ điển nền tảng | 569 | 2 (0) | có | 3 |
| `lich-su/thoi-ky/trung-co` | Nhạc cổ điển nền tảng | 523 | 1 (0) | có | 2 |
| `nhan-dien/dau-van-tay` | Nhạc cổ điển nền tảng | 866 | 0 (0) | có | 2 |
| `nhan-dien/luyen-nghe` | Nhạc cổ điển nền tảng | 239 | 0 (0) | **thiếu** | 2 |
| `nhan-dien/nghe-mu` | Nhạc cổ điển nền tảng | 661 | 0 (0) | **thiếu** | 2 |
| `nhan-dien/so-sanh-thoi-ky` | Nhạc cổ điển nền tảng | 890 | 0 (0) | có | 3 |
| `nhan-dien/the-loai` | Nhạc cổ điển nền tảng | 410 | 0 (0) | có | 2 |
| `nhac-ly/01-cao-do-ten-not` | Nhạc lý | 639 | 1 (0) | có | 5 |
| `nhac-ly/02-khuong-nhac-khoa` | Nhạc lý | 631 | 5 (0) | có | 4 |
| `nhac-ly/03-truong-do` | Nhạc lý | 483 | 4 (0) | có | 4 |
| `nhac-ly/04-nhip` | Nhạc lý | 480 | 3 (0) | có | 5 |
| `nhac-ly/05-dau-hoa` | Nhạc lý | 568 | 2 (0) | có | 6 |
| `nhac-ly/06-gam-truong` | Nhạc lý | 553 | 2 (0) | có | 4 |
| `nhac-ly/07-gam-thu` | Nhạc lý | 667 | 3 (0) | có | 4 |
| `nhac-ly/08-hoa-bieu` | Nhạc lý | 1333 | 0 (0) | có | 4 |
| `nhac-ly/09-quang` | Nhạc lý | 811 | 1 (0) | có | 4 |
| `nhac-ly/10-hop-am-ba` | Nhạc lý | 567 | 2 (0) | có | 4 |
| `nhac-ly/11-hop-am-bay` | Nhạc lý | 596 | 3 (0) | có | 4 |
| `nhac-ly/12-hoa-am-chuc-nang` | Nhạc lý | 575 | 3 (0) | có | 5 |
| `nhac-ly/13-ket` | Nhạc lý | 501 | 5 (0) | có | 5 |
| `nhac-ly/14-ky-hieu-bieu-dien` | Nhạc lý | 679 | 3 (0) | có | 4 |
| `nhac-ly/15-tiet-tau-nang-cao` | Nhạc lý | 641 | 5 (0) | có | 3 |
| `nhac-ly/16-dieu-thuc-ngu-cung` | Nhạc lý | 919 | 2 (0) | có | 4 |
| `nhac-ly/17-khoa-do-dich-giong` | Nhạc lý | 606 | 3 (0) | có | 3 |
| `nhac-ly/18-am-ngoai-hop-am` | Nhạc lý | 581 | 4 (0) | có | 4 |
| `nhac-ly/19-at-phu-chuyen-giong` | Nhạc lý | 780 | 2 (0) | có | 4 |
| `nhac-ly/20-doc-tong-pho` | Nhạc lý | 703 | 1 (0) | có | 3 |
| `nhac-ly/21-hoa-am-bon-be` | Nhạc lý | 667 | 2 (0) | có | 4 |
| `nhac-ly/22-doi-am` | Nhạc lý | 630 | 1 (0) | có | 2 |
| `nhac-ly/23-hop-am-muon` | Nhạc lý | 413 | 2 (0) | có | 1 |
| `nhac-ly/24-napoli-sau-tang` | Nhạc lý | 496 | 2 (0) | có | 1 |
| `nhac-ly/25-be-tram-so` | Nhạc lý | 523 | 1 (0) | có | 2 |
| `nhac-ly/26-phan-tich` | Nhạc lý | 621 | 1 (0) | có | 3 |
| `nhac-ly/27-ky-hieu-hop-am` | Nhạc lý | 658 | 1 (0) | có | 2 |
| `nhac-ly/28-ket-cau` | Nhạc lý | 922 | 4 (0) | có | 4 |
| `nhac-ly/29-chuoi-hoa-am` | Nhạc lý | 867 | 2 (0) | có | 6 |
| `nhac-ly/30-phat-trien-motip` | Nhạc lý | 1010 | 2 (0) | có | 3 |
| `nhac-ly/31-hinh-thuc-nho` | Nhạc lý | 1431 | 0 (0) | có | 7 |
| `nhac-ly/32-ky-thuat-the-ky-20` | Nhạc lý | 1210 | 5 (0) | có | 4 |
| `nhac-ly/am-hoc` | Nhạc lý | 1399 | 1 (0) | có | 5 |
| `nhac-ly/on-tap-1` | Nhạc lý | 69 | 0 (0) | **thiếu** | 1 |
| `nhac-ly/on-tap-2` | Nhạc lý | 58 | 0 (0) | **thiếu** | 1 |
| `nhac-ly/on-tap-3` | Nhạc lý | 51 | 0 (0) | **thiếu** | 1 |
| `nhac-ly/tu-dien` | Nhạc lý | 1482 | 0 (0) | **thiếu** | 4 |
| `piano/10-bai-dau-tien` | Piano nền tảng | 2303 | 11 (0) | có | 2 |
| `piano/bai-tap-ngon` | Piano nền tảng | 2396 | 5 (0) | có | 2 |
| `piano/ban-dap` | Piano nền tảng | 3362 | 2 (0) | có | 3 |
| `piano/ban-do-ban-phim` | Piano nền tảng | 1630 | 2 (0) | có | 1 |
| `piano/cach-tap` | Piano nền tảng | 2540 | 1 (0) | có | 2 |
| `piano/choi-cung-nguoi-khac` | Piano nền tảng | 3328 | 3 (0) | có | 1 |
| `piano/gam` | Piano nền tảng | 3138 | 4 (0) | có | 2 |
| `piano/hai-tay` | Piano nền tảng | 2194 | 10 (0) | có | 3 |
| `piano/hai-tuan-dau` | Piano nền tảng | 2548 | 3 (0) | có | 2 |
| `piano/hoa-am/dem-giai-dieu` | Piano nền tảng | 2053 | 5 (0) | có | 2 |
| `piano/hoa-am/index` | Piano nền tảng | 1369 | 0 (0) | có | 2 |
| `piano/hoa-am/ket` | Piano nền tảng | 2079 | 5 (0) | có | 2 |
| `piano/hoa-am/mau-galant` | Piano nền tảng | 3108 | 10 (0) | có | 2 |
| `piano/hoa-am/ung-tac` | Piano nền tảng | 2221 | 6 (5) | có | 1 |
| `piano/hoc-thuoc-bieu-dien` | Piano nền tảng | 3131 | 2 (0) | có | 1 |
| `piano/hop-am-rai` | Piano nền tảng | 2388 | 9 (0) | có | 2 |
| `piano/lich-su-dan` | Piano nền tảng | 2498 | 0 (0) | có | 2 |
| `piano/lo-trinh` | Piano nền tảng | 3840 | 0 (0) | có | 5 |
| `piano/nam-ngon` | Piano nền tảng | 1379 | 9 (1) | có | 2 |
| `piano/nha-soan-nhac` | Piano nền tảng | 6277 | 0 (0) | có | 4 |
| `piano/not-hoa-my` | Piano nền tảng | 3596 | 14 (0) | có | 1 |
| `piano/not-lap-not-kep` | Piano nền tảng | 2431 | 6 (6) | có | 1 |
| `piano/quang-tam-buoc-nhay` | Piano nền tảng | 2660 | 6 (6) | có | 1 |
| `piano/suc-khoe` | Piano nền tảng | 2444 | 0 (0) | có | 1 |
| `piano/the-loai` | Piano nền tảng | 3163 | 0 (0) | có | 3 |
| `piano/thi-tau` | Piano nền tảng | 1925 | 5 (0) | có | 2 |
| `piano/tieng-dan` | Piano nền tảng | 2616 | 6 (0) | có | 2 |
| `piano/tu-the` | Piano nền tảng | 2152 | 4 (0) | có | 1 |
| `tai-lieu-tham-khao` | Tài liệu tham khảo | 1158 | 0 (0) | **thiếu** | 6 |

## Tác phẩm (79 trang)

| Trang | Loại | Chữ | Khuông | Bản thu | Nguồn | Sửa |
|---|---|---|---|---|---|---|
| `nghe-nhac/bach-air` | hướng dẫn nghe | 449 | 0 (0) | không | có | 2 |
| `nghe-nhac/bach-cello-1` | hướng dẫn nghe | 464 | 0 (0) | không | có | 4 |
| `nghe-nhac/bach-goldberg` | hướng dẫn nghe | 1336 | 1 (0) | có | có | 3 |
| `nghe-nhac/beethoven-5` | hướng dẫn nghe | 656 | 1 (0) | không | có | 5 |
| `nghe-nhac/beethoven-moonlight` | hướng dẫn nghe | 597 | 0 (0) | có | có | 5 |
| `nghe-nhac/beethoven-op132` | hướng dẫn nghe | 529 | 0 (0) | không | có | 3 |
| `nghe-nhac/beethoven-pathetique` | hướng dẫn nghe | 1377 | 0 (0) | có | có | 4 |
| `nghe-nhac/bizet-habanera` | hướng dẫn nghe | 410 | 1 (0) | không | có | 4 |
| `nghe-nhac/brahms-4` | hướng dẫn nghe | 509 | 0 (0) | không | có | 3 |
| `nghe-nhac/brahms-intermezzo` | hướng dẫn nghe | 1286 | 0 (0) | có | có | 4 |
| `nghe-nhac/chopin-etude` | hướng dẫn nghe | 1449 | 0 (0) | có | có | 5 |
| `nghe-nhac/debussy-preludes` | hướng dẫn nghe | 2138 | 0 (0) | có | có | 2 |
| `nghe-nhac/doc-ten-tac-pham` | hướng dẫn nghe | 1241 | 0 (0) | không | **thiếu** | 3 |
| `nghe-nhac/dvorak-9-largo` | hướng dẫn nghe | 515 | 0 (0) | không | có | 4 |
| `nghe-nhac/gershwin-rhapsody` | hướng dẫn nghe | 590 | 0 (0) | có | có | 4 |
| `nghe-nhac/grieg-buoi-sang` | hướng dẫn nghe | 733 | 0 (0) | không | có | 1 |
| `nghe-nhac/grieg-concerto` | hướng dẫn nghe | 1345 | 0 (0) | có | có | 3 |
| `nghe-nhac/handel-hallelujah` | hướng dẫn nghe | 857 | 0 (0) | không | có | 2 |
| `nghe-nhac/haydn-94` | hướng dẫn nghe | 408 | 1 (0) | không | có | 4 |
| `nghe-nhac/liszt-liebestraum` | hướng dẫn nghe | 1237 | 0 (0) | có | có | 5 |
| `nghe-nhac/mau` | hướng dẫn nghe | 124 | 0 (0) | không | **thiếu** | 3 |
| `nghe-nhac/mendelssohn-violin` | hướng dẫn nghe | 506 | 0 (0) | không | có | 3 |
| `nghe-nhac/mozart-40` | hướng dẫn nghe | 442 | 0 (0) | không | có | 5 |
| `nghe-nhac/mozart-concerto-21` | hướng dẫn nghe | 1427 | 0 (0) | có | có | 2 |
| `nghe-nhac/mozart-eine-kleine` | hướng dẫn nghe | 456 | 0 (0) | có | có | 4 |
| `nghe-nhac/mozart-k331` | hướng dẫn nghe | 1274 | 0 (0) | có | có | 4 |
| `nghe-nhac/mozart-nu-hoang-bong-dem` | hướng dẫn nghe | 392 | 0 (0) | không | có | 3 |
| `nghe-nhac/mozart-requiem` | hướng dẫn nghe | 604 | 0 (0) | không | có | 3 |
| `nghe-nhac/mussorgsky-tranh` | hướng dẫn nghe | 1633 | 0 (0) | có | có | 3 |
| `nghe-nhac/nghe-gi-tiep` | hướng dẫn nghe | 537 | 0 (0) | không | **thiếu** | 3 |
| `nghe-nhac/part-spiegel` | hướng dẫn nghe | 387 | 1 (0) | không | có | 4 |
| `nghe-nhac/puccini-nessun-dorma` | hướng dẫn nghe | 772 | 0 (0) | không | có | 1 |
| `nghe-nhac/rachmaninoff-2` | hướng dẫn nghe | 554 | 0 (0) | có | có | 4 |
| `nghe-nhac/ravel-bolero` | hướng dẫn nghe | 529 | 0 (0) | không | có | 3 |
| `nghe-nhac/scarlatti-sonata` | hướng dẫn nghe | 1234 | 0 (0) | có | có | 3 |
| `nghe-nhac/schubert-ca-hoi` | hướng dẫn nghe | 482 | 0 (0) | không | có | 3 |
| `nghe-nhac/schubert-erlkonig` | hướng dẫn nghe | 463 | 1 (0) | không | có | 3 |
| `nghe-nhac/schubert-impromptu` | hướng dẫn nghe | 1377 | 0 (0) | có | có | 4 |
| `nghe-nhac/schumann-kinderszenen` | hướng dẫn nghe | 1501 | 0 (0) | có | có | 4 |
| `nghe-nhac/shostakovich-5` | hướng dẫn nghe | 532 | 0 (0) | không | có | 3 |
| `nghe-nhac/stravinsky-sacre` | hướng dẫn nghe | 461 | 0 (0) | không | có | 4 |
| `nghe-nhac/tchaikovsky-1812` | hướng dẫn nghe | 459 | 0 (0) | không | có | 3 |
| `nghe-nhac/tchaikovsky-ho-thien-nga` | hướng dẫn nghe | 360 | 0 (0) | không | có | 3 |
| `nghe-nhac/vivaldi-mua-dong` | hướng dẫn nghe | 551 | 0 (0) | không | có | 3 |
| `nghe-nhac/vivaldi-mua-xuan` | hướng dẫn nghe | 575 | 0 (0) | có | có | 8 |
| `piano/tac-pham/bach-invention-1` | bài học | 2704 | 3 (2) | có | có | 5 |
| `piano/tac-pham/bach-prelude-bwv939` | bài học | 3269 | 4 (3) | có | có | 3 |
| `piano/tac-pham/bach-prelude-do` | bài học | 3223 | 3 (2) | có | có | 5 |
| `piano/tac-pham/bach-prelude-fugue-do-thu` | bài học | 4258 | 6 (3) | có | có | 4 |
| `piano/tac-pham/beethoven-anh-trang` | bài học | 4291 | 4 (3) | có | có | 3 |
| `piano/tac-pham/beethoven-op49-2` | bài học | 4230 | 4 (3) | có | có | 3 |
| `piano/tac-pham/beethoven-sonatina-sol` | bài học | 3503 | 5 (3) | có | có | 3 |
| `piano/tac-pham/burgmuller-arabesque` | bài học | 2402 | 3 (3) | có | có | 3 |
| `piano/tac-pham/burgmuller-la-candeur` | bài học | 3593 | 4 (3) | có | có | 3 |
| `piano/tac-pham/chopin-ballade-1` | bài học | 3448 | 3 (3) | có | có | 4 |
| `piano/tac-pham/chopin-fantaisie-impromptu` | bài học | 3960 | 4 (3) | có | có | 4 |
| `piano/tac-pham/chopin-nocturne-op9-2` | bài học | 3149 | 3 (3) | có | có | 5 |
| `piano/tac-pham/chopin-prelude-la-truong` | bài học | 3563 | 4 (3) | có | có | 5 |
| `piano/tac-pham/chopin-prelude-mi-thu` | bài học | 2765 | 2 (2) | có | có | 5 |
| `piano/tac-pham/chopin-valse-la-thu` | bài học | 3028 | 3 (3) | có | có | 7 |
| `piano/tac-pham/chopin-valse-si-thu` | bài học | 3500 | 4 (3) | có | có | 3 |
| `piano/tac-pham/clementi-sonatina` | bài học | 2705 | 3 (3) | có | có | 4 |
| `piano/tac-pham/debussy-clair-de-lune` | bài học | 2787 | 3 (3) | có | có | 5 |
| `piano/tac-pham/fur-elise` | bài học | 2910 | 4 (3) | có | có | 4 |
| `piano/tac-pham/grieg-arietta` | bài học | 3840 | 3 (3) | có | có | 3 |
| `piano/tac-pham/liszt-liebestraum` | bài học | 3282 | 3 (3) | có | có | 4 |
| `piano/tac-pham/mendelssohn-thuyen-ca` | bài học | 4177 | 4 (3) | có | có | 2 |
| `piano/tac-pham/minuet-sol-thu` | bài học | 3182 | 4 (3) | có | có | 3 |
| `piano/tac-pham/minuet-sol` | bài học | 3004 | 4 (3) | có | có | 5 |
| `piano/tac-pham/mozart-k545` | bài học | 3086 | 3 (3) | có | có | 4 |
| `piano/tac-pham/mozart-minuet-k2` | bài học | 3154 | 4 (3) | có | có | 3 |
| `piano/tac-pham/musette-re` | bài học | 3306 | 4 (3) | có | có | 3 |
| `piano/tac-pham/pathetique-adagio` | bài học | 2707 | 3 (3) | có | có | 5 |
| `piano/tac-pham/satie-gymnopedie` | bài học | 2449 | 2 (2) | có | có | 5 |
| `piano/tac-pham/schubert-impromptu-sol-giang` | bài học | 4444 | 4 (3) | có | có | 4 |
| `piano/tac-pham/schumann-album` | bài học | 2911 | 3 (3) | có | có | 3 |
| `piano/tac-pham/schumann-traumerei` | bài học | 2608 | 3 (3) | có | có | 5 |
| `piano/tac-pham/tchaikovsky-bai-ca-phap-co` | bài học | 3505 | 4 (3) | có | có | 3 |
| `piano/tac-pham/tchaikovsky-cau-nguyen-buoi-sang` | bài học | 3704 | 4 (3) | có | có | 4 |

## Tham chiếu có hạn (7 trang)

| Trang | Chữ | Nguồn | Sửa | Rà lại |
|---|---|---|---|---|
| `bat-dau/hoi-dap` | 1995 | **thiếu** | 6 | 2027-04 |
| `bat-dau/ung-dung` | 266 | **thiếu** | 2 | 2027-04 |
| `piano/chon-dan` | 2010 | có | 1 | 2027-10 |
| `piano/nghe-si` | 3616 | có | 2 | 2027-10 |
| `piano/tac-pham-theo-cap` | 8419 | có | 4 | 2027-01 (danh sách bài thi ABRSM) |
| `piano/thay-va-thi` | 2971 | có | 2 | 2027-01 (chương trình ABRSM 2027–2028) |
| `tai-nguyen` | 876 | **thiếu** | 5 | 2027-04 |

## Khung và công cụ (34 trang)

| Trang | Chữ | Khuông | Nguồn | Sửa |
|---|---|---|---|---|
| `bat-dau/index` | 618 | 0 | không | 6 |
| `bat-dau/sach-in` | 444 | 0 | không | 5 |
| `blog/index` | 53 | 0 | không | 2 |
| `blog/posts/2026-10-11-bat-dau` | 94 | 0 | không | 2 |
| `blog/posts/2026-10-21-trong-tam-piano` | 487 | 0 | không | 2 |
| `blog/posts/2026-10-23-phien-ban-15` | 596 | 0 | không | 1 |
| `cap-nhat` | 5509 | 0 | không | 15 |
| `hinh-thuc/index` | 885 | 0 | có | 8 |
| `index` | 633 | 0 | không | 12 |
| `lich-su/index` | 1060 | 0 | có | 4 |
| `luyen-tai/index` | 914 | 0 | không | 7 |
| `luyen-tap/ban-phim` | 153 | 0 | không | 3 |
| `luyen-tap/chep-giai-dieu` | 136 | 0 | không | 1 |
| `luyen-tap/choi-theo` | 212 | 0 | không | 4 |
| `luyen-tap/doc-not` | 227 | 0 | không | 3 |
| `luyen-tap/du-lieu` | 241 | 0 | không | 1 |
| `luyen-tap/hat-lai` | 417 | 0 | không | 3 |
| `luyen-tap/hoa-bieu` | 141 | 0 | không | 2 |
| `luyen-tap/index` | 777 | 0 | không | 10 |
| `luyen-tap/ket-noi-midi` | 267 | 0 | không | 2 |
| `luyen-tap/metronome` | 219 | 0 | không | 3 |
| `luyen-tap/nhat-ky` | 238 | 0 | không | 6 |
| `luyen-tap/phieu-bai-tap` | 300 | 0 | không | 2 |
| `luyen-tap/thi-tau-hai-tay` | 562 | 0 | không | 2 |
| `luyen-tap/thi-tau` | 154 | 0 | không | 3 |
| `luyen-tap/thu-am` | 363 | 0 | không | 3 |
| `luyen-tap/tiet-tau` | 166 | 0 | không | 1 |
| `luyen-tap/xay-hop-am` | 156 | 0 | không | 2 |
| `nghe-nhac/index` | 1250 | 0 | không | 8 |
| `nhac-cu/index` | 680 | 0 | không | 7 |
| `nhac-ly/index` | 839 | 0 | không | 4 |
| `nhan-dien/index` | 590 | 0 | không | 2 |
| `piano/index` | 1920 | 0 | không | 4 |
| `piano/tac-pham/index` | 2198 | 0 | có | 4 |

## Ngoại vi (13 trang)

| Trang | Chữ | Khuông | Nguồn | Sửa |
|---|---|---|---|---|
| `lich-su/duong-dai` | 637 | 0 | không | 2 |
| `lich-su/nhac-truyen-thong-viet-nam` | 2212 | 1 | có | 4 |
| `lich-su/nu-nha-soan-nhac` | 1165 | 0 | có | 3 |
| `lich-su/opera` | 1476 | 0 | có | 6 |
| `lich-su/viet-nam` | 2090 | 0 | có | 3 |
| `nhac-cu/cello` | 460 | 0 | có | 4 |
| `nhac-cu/clarinet` | 465 | 0 | có | 4 |
| `nhac-cu/dan-nhac` | 706 | 0 | có | 4 |
| `nhac-cu/guitar` | 265 | 0 | có | 6 |
| `nhac-cu/nhac-cu-khac` | 680 | 0 | có | 6 |
| `nhac-cu/sao` | 436 | 0 | có | 4 |
| `nhac-cu/trumpet` | 554 | 0 | có | 4 |
| `nhac-cu/violin` | 406 | 0 | có | 7 |
