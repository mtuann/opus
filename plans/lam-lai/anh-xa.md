# Ánh xạ trang cũ sang site mới

Sinh bằng `python3 plans/lam-lai/anh_xa.py` trên commit `5d08189 2026-10-23`. Mỗi trang của site cũ thuộc đúng một lô. Đường dẫn giữ nguyên: `../opus-zero/docs/<trang>.md` (site cũ) thành `src/content/docs/<trang>.md` ở site mới; trên web, `/opus-zero/<trang>/` thành `/opus/<trang>/` (riêng bài blog: xem đợt 7 trong `README.md`). Tầng lấy từ `plans/ben-vung/kiem-ke.md`; bạn đổi tầng ở đó thì chạy lại script này.

Ngoài các trang dưới đây, site mới có 7 trang mới sinh từ dữ liệu: 7 trang chặng `piano/lo-trinh/chang-1` đến `chang-7` (đợt 2). Danh mục tác phẩm (đợt 6) không thành trang riêng: D6-L11 làm thành chỉ thị `::danh-muc-tac-pham` trong hai trang mục lục `piano/tac-pham/index` và `nghe-nhac/index`. Đợt 9 đối chiếu lại (`bao-cao/d9.md`): cả 233 trang dưới đây có trang cùng đường dẫn trên site mới, không trang nào gộp hay bỏ. Bài blog mới viết sau khi chuyển (như bài thông báo của đợt 9) không thuộc bảng này.

## Tổng theo đợt

| Đợt | Nội dung | Lô | Trang cũ |
|---|---|---|---|
| 2 | Khung cấp độ và lối vào | 1 | 9 |
| 3 | Nhạc lý và luyện tai | 6 | 45 |
| 4 | Piano nền tảng | 4 | 28 |
| 5 | Nhạc cổ điển nền tảng | 3 | 27 |
| 6 | Tác phẩm | 11 | 81 |
| 7 | Công cụ, sách in, blog, Cập nhật | 3 | 23 |
| 8 | Tham chiếu có hạn và Đọc thêm | 3 | 20 |
| **Cộng** | | **31** | **233** |

## Đợt 2. Khung cấp độ và lối vào

### D2-L1 (9 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `bat-dau/bai-0` | lõi | Bắt đầu |
| `bat-dau/kiem-tra-dau-vao` | lõi | Bắt đầu |
| `bat-dau/lo-trinh-choi` | lõi | Bắt đầu |
| `bat-dau/lo-trinh-nghe` | lõi | Bắt đầu |
| `bat-dau/moi-ngay` | lõi | Bắt đầu |
| `bat-dau/tom-tat` | lõi | Bắt đầu |
| `index` | khung | Trang chủ |
| `piano/lo-trinh` | lõi | Lộ trình 7 chặng |
| `bat-dau/index` | khung | Bắt đầu |

## Đợt 3. Nhạc lý và luyện tai

### D3-L1 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-ly/01-cao-do-ten-not` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/02-khuong-nhac-khoa` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/03-truong-do` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/04-nhip` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/05-dau-hoa` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/06-gam-truong` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/07-gam-thu` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/08-hoa-bieu` | lõi | Nhạc lý và luyện tai |

### D3-L2 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-ly/09-quang` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/10-hop-am-ba` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/11-hop-am-bay` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/12-hoa-am-chuc-nang` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/13-ket` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/14-ky-hieu-bieu-dien` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/15-tiet-tau-nang-cao` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/16-dieu-thuc-ngu-cung` | lõi | Nhạc lý và luyện tai |

### D3-L3 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-ly/17-khoa-do-dich-giong` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/18-am-ngoai-hop-am` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/19-at-phu-chuyen-giong` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/20-doc-tong-pho` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/21-hoa-am-bon-be` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/22-doi-am` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/23-hop-am-muon` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/24-napoli-sau-tang` | lõi | Nhạc lý và luyện tai |

### D3-L4 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-ly/25-be-tram-so` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/26-phan-tich` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/27-ky-hieu-hop-am` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/28-ket-cau` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/29-chuoi-hoa-am` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/30-phat-trien-motip` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/31-hinh-thuc-nho` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/32-ky-thuat-the-ky-20` | lõi | Nhạc lý và luyện tai |

### D3-L5 (6 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-ly/am-hoc` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/on-tap-1` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/on-tap-2` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/on-tap-3` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/tu-dien` | lõi | Nhạc lý và luyện tai |
| `nhac-ly/index` | khung | Nhạc lý và luyện tai |

### D3-L6 (7 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `luyen-tai/choi-bang-tai` | lõi | Nhạc lý và luyện tai |
| `luyen-tai/nghe-gam` | lõi | Nhạc lý và luyện tai |
| `luyen-tai/nghe-hop-am` | lõi | Nhạc lý và luyện tai |
| `luyen-tai/nghe-quang` | lõi | Nhạc lý và luyện tai |
| `luyen-tai/nghe-tien-trinh` | lõi | Nhạc lý và luyện tai |
| `luyen-tai/nghe-tiet-tau` | lõi | Nhạc lý và luyện tai |
| `luyen-tai/index` | khung | Nhạc lý và luyện tai |

## Đợt 4. Piano nền tảng

### D4-L1 (5 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/10-bai-dau-tien` | lõi | Piano |
| `piano/ban-do-ban-phim` | lõi | Piano |
| `piano/hai-tuan-dau` | lõi | Piano |
| `piano/tu-the` | lõi | Piano |
| `piano/index` | khung | Piano |

### D4-L2 (10 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/bai-tap-ngon` | lõi | Piano |
| `piano/ban-dap` | lõi | Piano |
| `piano/gam` | lõi | Piano |
| `piano/hai-tay` | lõi | Piano |
| `piano/hop-am-rai` | lõi | Piano |
| `piano/nam-ngon` | lõi | Piano |
| `piano/not-hoa-my` | lõi | Piano |
| `piano/not-lap-not-kep` | lõi | Piano |
| `piano/quang-tam-buoc-nhay` | lõi | Piano |
| `piano/tieng-dan` | lõi | Piano |

### D4-L3 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/cach-tap` | lõi | Piano |
| `piano/choi-cung-nguoi-khac` | lõi | Piano |
| `piano/hoc-thuoc-bieu-dien` | lõi | Piano |
| `piano/lich-su-dan` | lõi | Piano |
| `piano/nha-soan-nhac` | lõi | Piano |
| `piano/suc-khoe` | lõi | Piano |
| `piano/the-loai` | lõi | Piano |
| `piano/thi-tau` | lõi | Piano |

### D4-L4 (5 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/hoa-am/dem-giai-dieu` | lõi | Piano |
| `piano/hoa-am/ket` | lõi | Piano |
| `piano/hoa-am/mau-galant` | lõi | Piano |
| `piano/hoa-am/ung-tac` | lõi | Piano |
| `piano/hoa-am/index` | lõi | Piano |

## Đợt 5. Nhạc cổ điển nền tảng

### D5-L1 (10 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `lich-su/dong-thoi-gian` | lõi | Nhạc cổ điển |
| `lich-su/nha-soan-nhac` | lõi | Nhạc cổ điển |
| `lich-su/opera` | lõi | Nhạc cổ điển |
| `lich-su/thoi-ky/baroque` | lõi | Nhạc cổ điển |
| `lich-su/thoi-ky/co-dien` | lõi | Nhạc cổ điển |
| `lich-su/thoi-ky/lang-man` | lõi | Nhạc cổ điển |
| `lich-su/thoi-ky/phuc-hung` | lõi | Nhạc cổ điển |
| `lich-su/thoi-ky/the-ky-20` | lõi | Nhạc cổ điển |
| `lich-su/thoi-ky/trung-co` | lõi | Nhạc cổ điển |
| `lich-su/index` | khung | Nhạc cổ điển |

### D5-L2 (10 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `hinh-thuc/bien-tau` | lõi | Nhạc cổ điển |
| `hinh-thuc/concerto` | lõi | Nhạc cổ điển |
| `hinh-thuc/fugue` | lõi | Nhạc cổ điển |
| `hinh-thuc/minuet-trio` | lõi | Nhạc cổ điển |
| `hinh-thuc/overture` | lõi | Nhạc cổ điển |
| `hinh-thuc/rondo` | lõi | Nhạc cổ điển |
| `hinh-thuc/scherzo` | lõi | Nhạc cổ điển |
| `hinh-thuc/sonata` | lõi | Nhạc cổ điển |
| `hinh-thuc/symphonic-poem` | lõi | Nhạc cổ điển |
| `hinh-thuc/index` | khung | Nhạc cổ điển |

### D5-L3 (7 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-cu/dan-nhac` | lõi | Nhạc cổ điển |
| `nhan-dien/dau-van-tay` | lõi | Nhạc cổ điển |
| `nhan-dien/luyen-nghe` | lõi | Nhạc cổ điển |
| `nhan-dien/so-sanh-thoi-ky` | lõi | Nhạc cổ điển |
| `nhan-dien/the-loai` | lõi | Nhạc cổ điển |
| `tai-lieu-tham-khao` | lõi | Thêm |
| `nhan-dien/index` | khung | Nhạc cổ điển |

## Đợt 6. Tác phẩm

### D6-L1 (7 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/tac-pham/burgmuller-la-candeur` | tác phẩm | Tác phẩm |
| `piano/tac-pham/minuet-sol` | tác phẩm | Tác phẩm |
| `piano/tac-pham/minuet-sol-thu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/mozart-minuet-k2` | tác phẩm | Tác phẩm |
| `piano/tac-pham/musette-re` | tác phẩm | Tác phẩm |
| `piano/tac-pham/schumann-album` | tác phẩm | Tác phẩm |
| `piano/tac-pham/tchaikovsky-bai-ca-phap-co` | tác phẩm | Tác phẩm |

### D6-L2 (6 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/tac-pham/bach-prelude-bwv939` | tác phẩm | Tác phẩm |
| `piano/tac-pham/beethoven-sonatina-sol` | tác phẩm | Tác phẩm |
| `piano/tac-pham/burgmuller-arabesque` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-valse-la-thu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/clementi-sonatina` | tác phẩm | Tác phẩm |
| `piano/tac-pham/tchaikovsky-cau-nguyen-buoi-sang` | tác phẩm | Tác phẩm |

### D6-L3 (7 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `piano/tac-pham/bach-prelude-do` | tác phẩm | Tác phẩm |
| `piano/tac-pham/beethoven-op49-2` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-prelude-la-truong` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-prelude-mi-thu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/fur-elise` | tác phẩm | Tác phẩm |
| `piano/tac-pham/grieg-arietta` | tác phẩm | Tác phẩm |
| `piano/tac-pham/satie-gymnopedie` | tác phẩm | Tác phẩm |

### D6-L4 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/beethoven-moonlight` | tác phẩm | Tác phẩm |
| `nghe-nhac/schumann-kinderszenen` | tác phẩm | Tác phẩm |
| `piano/tac-pham/bach-invention-1` | tác phẩm | Tác phẩm |
| `piano/tac-pham/beethoven-anh-trang` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-valse-si-thu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/mendelssohn-thuyen-ca` | tác phẩm | Tác phẩm |
| `piano/tac-pham/mozart-k545` | tác phẩm | Tác phẩm |
| `piano/tac-pham/schumann-traumerei` | tác phẩm | Tác phẩm |

### D6-L5 (7 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/beethoven-pathetique` | tác phẩm | Tác phẩm |
| `nghe-nhac/schubert-impromptu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/bach-prelude-fugue-do-thu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-nocturne-op9-2` | tác phẩm | Tác phẩm |
| `piano/tac-pham/debussy-clair-de-lune` | tác phẩm | Tác phẩm |
| `piano/tac-pham/pathetique-adagio` | tác phẩm | Tác phẩm |
| `piano/tac-pham/schubert-impromptu-sol-giang` | tác phẩm | Tác phẩm |

### D6-L6 (4 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/liszt-liebestraum` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-ballade-1` | tác phẩm | Tác phẩm |
| `piano/tac-pham/chopin-fantaisie-impromptu` | tác phẩm | Tác phẩm |
| `piano/tac-pham/liszt-liebestraum` | tác phẩm | Tác phẩm |

### D6-L7 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/bach-goldberg` | tác phẩm | Tác phẩm |
| `nghe-nhac/chopin-etude` | tác phẩm | Tác phẩm |
| `nghe-nhac/doc-ten-tac-pham` | tác phẩm | Tác phẩm |
| `nghe-nhac/mau` | tác phẩm | Tác phẩm |
| `nghe-nhac/mozart-concerto-21` | tác phẩm | Tác phẩm |
| `nghe-nhac/mozart-k331` | tác phẩm | Tác phẩm |
| `nghe-nhac/nghe-gi-tiep` | tác phẩm | Tác phẩm |
| `nghe-nhac/scarlatti-sonata` | tác phẩm | Tác phẩm |

### D6-L8 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/brahms-intermezzo` | tác phẩm | Tác phẩm |
| `nghe-nhac/debussy-preludes` | tác phẩm | Tác phẩm |
| `nghe-nhac/gershwin-rhapsody` | tác phẩm | Tác phẩm |
| `nghe-nhac/grieg-concerto` | tác phẩm | Tác phẩm |
| `nghe-nhac/mussorgsky-tranh` | tác phẩm | Tác phẩm |
| `nghe-nhac/rachmaninoff-2` | tác phẩm | Tác phẩm |
| `nghe-nhac/vivaldi-mua-dong` | tác phẩm | Tác phẩm |
| `nghe-nhac/vivaldi-mua-xuan` | tác phẩm | Tác phẩm |

### D6-L9 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/bach-air` | tác phẩm | Tác phẩm |
| `nghe-nhac/bach-cello-1` | tác phẩm | Tác phẩm |
| `nghe-nhac/handel-hallelujah` | tác phẩm | Tác phẩm |
| `nghe-nhac/haydn-94` | tác phẩm | Tác phẩm |
| `nghe-nhac/mozart-40` | tác phẩm | Tác phẩm |
| `nghe-nhac/mozart-eine-kleine` | tác phẩm | Tác phẩm |
| `nghe-nhac/mozart-nu-hoang-bong-dem` | tác phẩm | Tác phẩm |
| `nghe-nhac/mozart-requiem` | tác phẩm | Tác phẩm |

### D6-L10 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/beethoven-5` | tác phẩm | Tác phẩm |
| `nghe-nhac/beethoven-op132` | tác phẩm | Tác phẩm |
| `nghe-nhac/bizet-habanera` | tác phẩm | Tác phẩm |
| `nghe-nhac/mendelssohn-violin` | tác phẩm | Tác phẩm |
| `nghe-nhac/schubert-ca-hoi` | tác phẩm | Tác phẩm |
| `nghe-nhac/schubert-erlkonig` | tác phẩm | Tác phẩm |
| `nghe-nhac/tchaikovsky-1812` | tác phẩm | Tác phẩm |
| `nghe-nhac/tchaikovsky-ho-thien-nga` | tác phẩm | Tác phẩm |

### D6-L11 (10 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nghe-nhac/brahms-4` | tác phẩm | Tác phẩm |
| `nghe-nhac/dvorak-9-largo` | tác phẩm | Tác phẩm |
| `nghe-nhac/grieg-buoi-sang` | tác phẩm | Tác phẩm |
| `nghe-nhac/part-spiegel` | tác phẩm | Tác phẩm |
| `nghe-nhac/puccini-nessun-dorma` | tác phẩm | Tác phẩm |
| `nghe-nhac/ravel-bolero` | tác phẩm | Tác phẩm |
| `nghe-nhac/shostakovich-5` | tác phẩm | Tác phẩm |
| `nghe-nhac/stravinsky-sacre` | tác phẩm | Tác phẩm |
| `nghe-nhac/index` | khung | Tác phẩm |
| `piano/tac-pham/index` | khung | Tác phẩm |

## Đợt 7. Công cụ, sách in, blog, Cập nhật

### D7-L1 (9 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `luyen-tap/ban-phim` | khung | Luyện tập |
| `luyen-tap/chep-giai-dieu` | khung | Luyện tập |
| `luyen-tap/choi-theo` | khung | Luyện tập |
| `luyen-tap/doc-not` | khung | Luyện tập |
| `luyen-tap/du-lieu` | khung | Luyện tập |
| `luyen-tap/hat-lai` | khung | Luyện tập |
| `luyen-tap/hoa-bieu` | khung | Luyện tập |
| `luyen-tap/ket-noi-midi` | khung | Luyện tập |
| `luyen-tap/index` | khung | Luyện tập |

### D7-L2 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `luyen-tap/metronome` | khung | Luyện tập |
| `luyen-tap/nhat-ky` | khung | Luyện tập |
| `luyen-tap/phieu-bai-tap` | khung | Luyện tập |
| `luyen-tap/thi-tau` | khung | Luyện tập |
| `luyen-tap/thi-tau-hai-tay` | khung | Luyện tập |
| `luyen-tap/thu-am` | khung | Luyện tập |
| `luyen-tap/tiet-tau` | khung | Luyện tập |
| `luyen-tap/xay-hop-am` | khung | Luyện tập |

### D7-L3 (6 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `bat-dau/sach-in` | khung | Thêm |
| `blog/posts/2026-10-11-bat-dau` | khung | Thêm |
| `blog/posts/2026-10-21-trong-tam-piano` | khung | Thêm |
| `blog/posts/2026-10-23-phien-ban-15` | khung | Thêm |
| `cap-nhat` | khung | Thêm |
| `blog/index` | khung | Thêm |

## Đợt 8. Tham chiếu có hạn và Đọc thêm

### D8-L1 (10 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `bat-dau/hoi-dap` | tham chiếu | Bắt đầu |
| `bat-dau/ung-dung` | tham chiếu | Bắt đầu |
| `lich-su/duong-dai` | tham chiếu | Nhạc cổ điển |
| `lich-su/viet-nam` | tham chiếu | Nhạc cổ điển |
| `nhan-dien/nghe-mu` | tham chiếu | Nhạc cổ điển |
| `piano/chon-dan` | tham chiếu | Piano |
| `piano/nghe-si` | tham chiếu | Piano |
| `piano/tac-pham-theo-cap` | tham chiếu | Piano |
| `piano/thay-va-thi` | tham chiếu | Piano |
| `tai-nguyen` | tham chiếu | Thêm |

### D8-L2 (8 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `nhac-cu/cello` | ngoại vi | Đọc thêm |
| `nhac-cu/clarinet` | ngoại vi | Đọc thêm |
| `nhac-cu/guitar` | ngoại vi | Đọc thêm |
| `nhac-cu/nhac-cu-khac` | ngoại vi | Đọc thêm |
| `nhac-cu/sao` | ngoại vi | Đọc thêm |
| `nhac-cu/trumpet` | ngoại vi | Đọc thêm |
| `nhac-cu/violin` | ngoại vi | Đọc thêm |
| `nhac-cu/index` | khung | Đọc thêm |

### D8-L3 (2 trang)

| Trang cũ | Tầng | Nhóm menu mới |
|---|---|---|
| `lich-su/nhac-truyen-thong-viet-nam` | ngoại vi | Đọc thêm |
| `lich-su/nu-nha-soan-nhac` | ngoại vi | Đọc thêm |
