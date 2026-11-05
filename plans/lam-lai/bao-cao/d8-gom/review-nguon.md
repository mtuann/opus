# D8-gom: review nguồn (thay Wikipedia ở trang tham chiếu)

Người làm: Claude Sonnet 5.5 (agent con, review bổ sung; không làm lượt 1 hay lượt 2). Ngày 05/11/2026. Việc: các nhận định ở trang tham chiếu có hạn mà lượt 1 và lượt 2 chỉ dựa Wikipedia. Mỗi nhận định được thêm nguồn bậc 1–2 vào `nguon` của hồ sơ và của nhận định, kèm `ghi_chu` "Review D8-gom (nguồn thay Wikipedia): …". Nguồn Wikipedia cũ giữ nguyên.

Kết quả: `node tools/khoa.mjs tinh` không lỗi; `npm test` 260 đạt, 0 hỏng (sau `npm run build:xem`). Chưa khóa gì.

## Cách tìm nguồn

- Mở được và dùng: trang nghệ sĩ của hãng đĩa (Deutsche Grammophon, Decca, Warner Classics, Hyperion), trang chính thức của nghệ sĩ (Brendel, Hewitt, Gould), tổ chức (Viện Chopin, Marlboro Music, Queen Elisabeth, Leeds, Clara Haskil, ARIMS, Cliburn), nhà hát, dàn nhạc (SF Symphony, BSO, LA Phil, Staatsoper Berlin), Curtis, Oberlin, USC Polish Music Center, IMSLP, Library of Congress (blog), NPR, BBC Music Magazine (classical-music.com), Musicnotes, BnF.
- Không mở được (403, không vòng): Gramophone, Britannica, Pulitzer, Naxos, Sony Classical, Carnegie Hall, Wigmore Hall, Canadian Encyclopedia, culture.pl, Gulbenkian. Câu cần các trang ấy đã đổi sang nguồn khác hay sửa chữ.
- Dùng `curl` với User-Agent `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)` và đọc chữ thật của trang, không chỉ bản tóm tắt của công cụ web.
- Các tính từ tả tiếng đàn ("tiếng vàng", "lửa và tốc độ"…) giữ như trang đã quyết ở D8-gom: nhận xét của site (hộp đầu mục). Không tìm nguồn cho chúng.

## `piano/nghe-si`

Câu giữ chữ, thêm nguồn:

| Câu | Nguồn mới |
|---|---|
| n13 Paderewski | USC Polish Music Center (virtuoso; Thủ tướng 1919; Op. 14 tập I số 1 "Ménuet célèbre"); IMSLP (Menuet célèbre giọng Sol trưởng, xuất bản 1887–88) |
| n15 Hofmann | BSO (Hofmann, người được đề tặng, từ chối chơi Concerto số 3); Marston Records (gala 28/11/1937 ở Metropolitan Opera House; bản thu Golden Jubilee 1937) |
| n17 Schnabel | Library of Congress: bản thu 1932–1935 là bản đầu tiên của trọn 32 sonata |
| n19 Rubinstein | ARIMS: giã từ sân khấu năm 89 tuổi, buổi cuối 5/1976 ở Wigmore Hall |
| n22 Arrau | Decca (nghệ sĩ Chile, sinh 1903 ở Chillán); Warner Classics |
| n23 Horowitz | DG (1953 rút khỏi sân khấu; 1965 trở lại Carnegie Hall); NPR (Moskva tháng 4/1986) |
| n24 Serkin | Marlboro Music: thành lập 1951 bởi Serkin và những người khác, có Adolf Busch |
| n25 Richter | DG (gần như tự học; đĩa nhạc đồ sộ; Prokofiev đề tặng Sonata số 9; The Sofia Recital 1958); LA Phil (công diễn Sonata số 7, Moskva, 1/1943) |
| n26 Gilels | Queen Elisabeth: "Piano 1938: First Prize" |
| n27 Lipatti | Warner Classics (1917–1950; buổi cuối ở Besançon 16/9/1950; "musical clarity") |
| n29 Gould | glenngould.com (10/4/1964 buổi diễn công khai cuối; Goldberg 1955, bản cuối 1981) |
| n33 Pollini | DG (18 tuổi ở Chopin 1960; nhạc đương đại); Viện Chopin |
| n35 Lupu | NPR (Cliburn 1966, Leeds 1969); BBC Music Magazine ("preferred a chair to a piano stool") |
| n37 Uchida | Decca (giải Nhì Chopin 1970 và Leeds 1975); Viện Chopin (1970: Uchida "runner up") |
| n38 Sokolov | DG (16 tuổi, Tchaikovsky, "youngest ever"; chỉ độc tấu; đĩa gần đây là bản thu trực tiếp) |
| n42 Hamelin | Hyperion (artist page: "near-superhuman technical prowess", rarities; Études CDA67789: "12 Études in all the minor keys"; Medtner CDA67578; Kapustin CDA67433; Alkan trong bản tin 1/2025) |
| n43 Kissin | DG: 3/1984, hai concerto Chopin ở Moskva, bản thu trực tiếp |
| n45 Yuja Wang | Curtis (trích The New York Times): bốn concerto và Rhapsody Paganini ở Carnegie Hall, 28/1/2023 |
| n66 Uchida, Ashkenazy | Decca (cả hai: giải Nhì Chopin; Uchida 1970 và Leeds 1975; Ashkenazy 1955); Viện Chopin |

Câu sửa chữ (cần lượt 2 bổ sung; `ket_qua: da-sua`, kết quả lượt 2 cũ chép vào `ghi_chu`, trang và `doi_chu` đã sửa):

| Câu | Đổi gì, nguồn |
|---|---|
| n16 Cortot | Bỏ "kèm bài tập chuẩn bị"; viết ấn bản "để học" (Édition de travail) của Chopin. IMSLP: Édition de travail des œuvres de Chopin, Senart 1929 |
| n20 Kempff | Bỏ "mono/stereo" (DG chỉ ghi hai bộ 1951–56 và 1964–65). DG Kempff Edition |
| n21 Haskil | "cuộc thi (Thụy Sĩ, nay ở Vevey) có từ năm 1963". Trang Haskil: lưu trữ các kỳ từ 1963, hai năm một lần; kỳ 32 năm 2027 ở Vevey. Chỉ kết quả tìm kiếm nói các kỳ đầu ở Lucerne: trang chính thức không xác nhận, nên chữ giữ "nay ở Vevey" |
| n28 Michelangeli | "thầy của Argerich và Pollini" thành "Pollini học riêng với ông". Warner: Argerich học "from a great distance, as he claimed" (còn tranh cãi); DG Pollini xác nhận. Geneva 1939: Warner, hồ sơ báo chí Geneva |
| n30 Brendel | "tác phẩm piano độc tấu" thành "tác phẩm piano" của Beethoven. Trang chính thức: "the entire piano works", Vox, thập niên 1960 |
| n32 Argerich | Bỏ "từ thập niên 1980"; "ít bản thu độc tấu". Staatsoper Berlin; DG ("relatively few") |
| n36 Perahia | Bỏ "concerto Mozart": DG nói chỉ huy từ phím đàn concerto Beethoven với Academy of St Martin in the Fields. Leeds 1972: trang Leeds |
| n40 Zimerman | Bỏ "vừa chơi vừa chỉ huy": lập Polish Festival Orchestra (1999) và thu hai concerto Chopin với dàn nhạc ấy. DG; Viện Chopin (29/10/1975) |
| n41 Hewitt | Bỏ "1994 đến 2005"; "cho hãng Hyperion". Trang chính thức: Toronto 1985, Bach "all the major keyboard works", Couperin |
| n44 Lang Lang | Bỏ "ở châu Âu, Mỹ": SF Symphony chỉ ghi "the world's top orchestras"; Olympic 2008 |
| n46 Levit | Bỏ "hơn 50 buổi" và "(2019)"; "nhiều buổi phát trực tuyến trên Twitter từ tháng 3/2020". SF Symphony (32 sonata), Prospect (Twitter, căn hộ ở Berlin, ý tưởng 10/3/2020). Vexations "hơn 15 giờ": chỉ có Classic FM (bậc 3: Levit nói "over 20 hours"; các nguồn ghi 15,5–20 giờ), giữ vì đúng ở mọi con số |
| n47 Trifonov | "trọn bộ étude của Liszt" thành "album Transcendental (Liszt)". SF Symphony. Năm 2011 của Rubinstein và Tchaikovsky: nguồn ghi "mùa 2010–11"; năm suy từ lịch cuộc thi (5/2011, 7/2011), lượt 2 nên đối chiếu |
| n49 Lisiecki | "Chopin (concerto, nocturne, prelude) và Mozart" thay "étude, Mendelssohn" (DG không có hai thứ này) |
| n50 Bruce Liu | Bỏ "ở Montréal". Oberlin: Đặng Thái Sơn là một trong những thầy quan trọng nhất; Viện Chopin: thắng 2021 |
| n52 Yunchan Lim | Bỏ "giải Gramophone 2024" (Gramophone chặn robot); thay bằng ba giải BBC Music Magazine Awards 2025 (classical-music.com). Cliburn: người trẻ nhất, 18 tuổi |
| n64 các cuộc thi khác | "Clara Haskil ở Thụy Sĩ (từ 1963, hai năm một lần; nay ở Vevey)". Geneva 1939: Warner, hồ sơ báo chí Geneva; Argerich 1957 (Bolzano, Geneva): Staatsoper Berlin; Rubinstein (Trifonov): SF Symphony |

## Trang khác

| Câu | Quyết định |
|---|---|
| `lich-su/duong-dai` n10 (Caroline Shaw) | Giữ chữ. Thêm NPR (15/4/2013: 30 tuổi, thắng Pulitzer với Partita for 8 Voices). Trang Pulitzer chính thức 403 |
| `lich-su/duong-dai` n26 (Chopin, 5 năm một lần) | Giữ chữ. Thêm trang chính thức của cuộc thi: lập 1927, từ 1949 theo chu kỳ 5 năm; Cho 2015, Liu 2021 |
| `bat-dau/hoi-dap` n7 (*Mariage d'Amour*) | Sửa: bỏ "viết năm 1978" (như `piano/tac-pham-theo-cap` đã bỏ); "nổi tiếng qua các bản thu của Richard Clayderman". Musicnotes (MK0024235 mang cả hai tên "Chopin Spring Waltz (Mariage d'amour)"; MN0114635, bản Clayderman: "Music by Paul De Senneville") và BnF. Thêm `doi_chu` |
| `lich-su/viet-nam` n1 | Giữ chữ. Hà Nội Mới (Nhà hát Lớn xây 1901–1911 thời Pháp, nơi truyền bá nghệ thuật phương Tây); vnam.edu.vn (khóa đầu tiên của Trường Âm nhạc Việt Nam, 10/1956). Hai nhạc viện năm 1956 cũng ở nguồn cũ |

## Câu đổi chữ cho lượt 2 bổ sung

- `piano/nghe-si`: n16, n20, n21, n28, n30, n32, n36, n40, n41, n44, n46, n47, n49, n50, n52, n64 (16 câu).
- `bat-dau/hoi-dap`: n7.

Tổng 17 câu. Chỗ lượt 2 nên xem kỹ: n21 và n64 (Lucerne → Vevey chỉ có kết quả tìm kiếm, nên trang chỉ nói "nay ở Vevey"), n46 (độ dài *Vexations*), n47 (năm 2011), n52 (ba giải BBC Music Magazine).

## Còn yếu

- Vế "nghe trước" (gợi ý, `khuyen-tap`) không kiểm, như trước: vd Concerto Mozart số 24 của Haskil (K. 491), Valse và Concerto Grieg của Lipatti.
- Hồ sơ nghe-si được ghi lại bằng công cụ YAML: các nhận định và `doi_chu` đã sửa có thể đổi kiểu trích dẫn (nháy, danh sách một dòng), nội dung không đổi ngoài chỗ nói ở trên.
