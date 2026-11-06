# D6-L9, lượt 1, phần B (Mozart: 4 hướng dẫn nghe và 4 bản ghi)

Người làm: Claude Opus 5.5 (D6-L9 phần B), ngày 06/11/2026, nhánh `moi/d6-l9`.

## Số liệu

**Trang** (109 nhận định):

| Trang | Nhận định | dung | da-sua | da-bo | khong-can-nguon | `doi_chu` |
|---|---|---|---|---|---|---|
| mozart-40 | 23 | 12 | 9 | 0 | 2 | 9 |
| mozart-eine-kleine | 31 | 17 | 12 | 0 | 2 | 12 |
| mozart-nu-hoang-bong-dem | 22 | 7 | 14 | 0 | 1 | 12 |
| mozart-requiem | 33 | 23 | 8 | 1 | 1 | 7 |

Theo loại: cau-truc 38, lich-su 25, nam 10, ve-site 11, ten 6, khuyen-tap 6, so-lieu 5, danh-muc 4, dinh-nghia 3, quy-tac 1. Không có khối `abc`.

**Bản ghi** (lần 2, trường `thoi_ky`, `luyen_nghe`, `hinh`, `ban_thu`), 22 nhận định: mozart-40 6, mozart-eine-kleine 5, mozart-nu-hoang-bong-dem 2, mozart-requiem 9. Theo loại: lich-su 10, cau-truc 9, ten 2, so-lieu 1. Kết quả: dung 22. `sua-B.yml` không có mục nào.

**Bản thu** `mozart-eine-kleine`: Advent Chamber Orchestra, CC BY-SA 2.0, 355,41 giây (API Commons); hai link file trả 206; `check_audio.py --static` 0 lỗi.

## Chỗ sửa chính

- **Đánh giá không nguồn** (bỏ hay viết lại): "ví dụ mẫu mực", "ví dụ trong sách giáo khoa" của hình thức sonata; "nghe buồn hơn hẳn", "rất căng", "phép màu"; "bản nhạc mở đầu quen thuộc nhất … có lẽ của cả nhạc cổ điển" (nay theo chữ Köchel online); "như tiếng cười điên loạn"; "một trong những nốt cao nhất thường gặp trong opera"; "pha triết lý"; "Câu trả lời thật thà của phần lớn người nghe là không" (Requiem, `da-bo`).
- **Sai hay lệch với bản nhạc, nguồn:**
  - mozart-40 n16: phát triển ghi tên giọng **Fa♯ thứ** (NMA ô 101–105), bỏ "rất xa": nay khớp câu đã khóa ở `nhac-ly/19-at-phu-chuyen-giong` n27. n6: chương 1 khoảng 8 phút (hai bản thu trên Commons 7:56 và 8:13).
  - mozart-eine-kleine: bỏ tên **"Mannheim rocket"** (chỉ có ở blog, Wikipedia; COD không có), tả theo NMA (bốn bè đồng âm, đi lên theo hợp âm Sol trưởng). Tên **Serenade** không do Mozart đặt, chỉ có từ bản in đầu (Köchel online), bảng ghi rõ; bỏ "dàn dây". Ngày 10/8/1787 là ngày **ghi vào danh mục**. "Cùng mùa hè với Don Giovanni" thành "cùng năm" (không có nguồn cho mùa hè). Chương bị mất là **chương 2** (minuet thứ nhất), không phải "chương minuet thứ hai". Phát triển: 20 ô, các nốt giáng đưa sang màu giọng thứ (không đủ chắc để gọi tên từng giọng). Phần kết trình bày kết **nhỏ tiếng** (p), không "dứt khoát".
  - mozart-nu-hoang-bong-dem: con dao được trao **trong lời thoại ngay trước aria** (NMA: "Siehst du hier diesen Stahl?"), không trong aria; đoạn kết là **lời thề** ("der Mutter Schwur"), không phải lời nguyền; dàn nhạc mở đầu chỉ hơn một ô; chuỗi coloratura thứ nhất: Đô6 ngắt ngắn nhắc lại rồi chùm nốt rải lên Fa6; chuỗi thứ hai dài hơn (11 so với khoảng 8 ô), bỏ "khó hơn". "Nhà hát bình dân" thành nhà hát ngoại ô của Schikaneder (Köchel); công diễn 30/9/1791, "hơn hai tháng" trước khi Mozart mất (cũ: "vài tháng"). Bản thu gợi ý: thêm McVicar, Colin Davis, DVD Opus Arte 2003 (ROH Shop, MusicBrainz).
  - mozart-requiem: "đoạn gợi ý nghe trước khoảng 15 phút" sai: Introitus đến Lacrimosa khoảng **29 phút** (bản Krips trên Commons; cả bài 54 phút). "Mozart vừa hoàn thành Cây sáo thần" thành viết xen với Cây sáo thần và *La clemenza di Tito*, nằm liệt giường từ 20/11 (lời tựa NMA). Constanze nhờ **bạn bè** của Mozart, hai lần không thành rồi tới Süssmayr (Carus); bỏ "để nhận tiền đặt hàng" (không có nguồn). Bỏ câu về giai thoại "viết cho chính mình" và Salieri trong phim *Amadeus*, thay bằng câu chung của Carus. "Trombone gắn với nhà thờ và cái chết" thành "ở thời Baroque chỉ dùng trong nhạc nhà thờ" (COD). **Thêm dòng Recordare** (NMA tr. 31: hai basset horn, 3/4, Fa trưởng, bốn giọng độc xướng).
- **Mục Nguồn** cả bốn trang: bỏ Burkholder/Grout/Palisca và Grove (chưa đọc), IMSLP dạng "tìm theo…"; thay bằng NMA trên DME, Köchel online, ISO (mozart-40), ROH Shop và MusicBrainz (nữ hoàng), bảng Carus (Requiem).
- **Thêm link**: mozart-eine-kleine trỏ chương 3 sang `/opus/hinh-thuc/minuet-trio/#i-qua-mot-tac-pham-mozart-eine-kleine-nachtmusik-chuong-3` và ghi "Trang này nói về chương 1" (gợi ý của review D6-L1-gom). Bảng "Theo dõi khi nghe" của trang này giữ đủ 8 dòng, đúng thứ tự; chỉ sửa chữ dòng 5 (thêm "cả phần trình bày được nhắc lại", khớp khoảng 63–199 giây giữa hai mốc) và dòng 6.
- Bản ghi: không sai. Hình Requiem khớp từng đoạn với bảng "Who wrote what?" của Carus và NMA (Introitus trọn; Kyrie đến Hostias "main parts"; Lacrimosa 8 ô; Sanctus, Benedictus, Agnus Dei của Süßmayr; Communio dùng lại Introitus và Kyrie).

## Chưa chắc

Không có nhận định `ket_qua: null`. Chỗ lượt 2 nên xem kỹ:

- mozart-eine-kleine n15, n24 (phát triển "màu giọng thứ"): đọc ảnh NMA tr. 46, ô 66–73 có Si♭, Mi♭, Đô♯; không gọi tên giọng.
- mozart-nu-hoang-bong-dem n13, n16: Fa6 ở ô 30–31 đọc trên ảnh 900 px đã phóng to; dòng kẻ phụ khó đếm.
- mozart-nu-hoang-bong-dem n7: bản Fricsay trên Commons dài 4:03, có thể gồm lời thoại trước aria (không nghe để kiểm); trang viết "3–4 phút".
- mozart-40 n7: "chỉ hai giao hưởng giọng thứ" dựa trên ghi chú chương trình của hai dàn nhạc (ISO, Hollywood Bowl), như hồ sơ đã khóa `nhac-ly/19-at-phu-chuyen-giong` dùng; không thấy danh mục Köchel nói thẳng.
- Năm in đầu K. 525: Köchel online "around 1837", IMSLP "1827 ca.": trang chỉ viết "nhiều năm sau khi ông mất".

## Nguồn hay dùng

- **Neue Mozart-Ausgabe trên DME** (`dme.mozarteum.at`): tìm `vsep` bằng POST tới `nmapub_srch.php?l=2` với `kvnr=<số K.>` (để `selKVKat` rỗng); mục lục `nma_toc.php?vsep=<v>&l=2`; ảnh trang `objs/ed/ucbNN_<vsep>_<trang>.jpg`, tiền tố `ucbNN` khác nhau theo tập (lấy từ `scan.php?vsep=<v>&p1=<trang>&l=2`): K. 550 `ucb12_111`, K. 525 `ucb13_125`, K. 620 `ucb09_73`, K. 626 `ucb02_13` (trang lời tựa là số âm). Mục lục có ghi "Engl. Translation" cho lời tựa nhưng link chạy bằng JavaScript; lời tựa Requiem đọc bản tiếng Đức.
- Köchel online (trang tác phẩm và trang từng phiên bản, như KV 550 (1), 550 (2); KV 626 và 626 (1)).
- IMSLP wikitext qua `api.php` (`Piece Style`, ngày, nhạc cụ).
- Carus: bảng "Who wrote what?" (`carusmedia.com/…/5162600sb.pdf`), tờ giới thiệu `…pm.pdf`, trang sản phẩm.
- COD trên Encyclopedia.com (sonata form, serenade, Singspiel, coloratura, Requiem, basset horn, trombone, Zauberflöte).
- Commons API (độ dài, giấy phép), MusicBrainz WS, ROH Shop.

## Người giao phải quyết hay làm

- **`doi_chu`**: ghi tay theo khối; cần ghép với khung `node tools/chuyen/so-chu.mjs <trang> --doi-chu` sau khi build (mô tả trang đổi ở eine-kleine, nu-hoang; Requiem giữ mô tả). Chỗ đổi tiêu đề và câu dẫn bảng ở Requiem do người giao ghi.
- `hinh-thuc/minuet-trio` (đã khóa) m26 dẫn `nghe-nhac/mozart-40` làm "hướng dẫn nghe" ở dòng *Giao hưởng số 40, chương 3*; trang này chỉ nói chương 1. Không sai, nhưng có thể làm người đọc chờ chương 3: nếu muốn sửa thì mở khóa minuet-trio ở việc riêng.
- Chú thích hình Requiem (`hinh.nghe[0].chu_thich`) gọi màu lớp `k-c` (#e9b3a6, hồng cam) là "Đỏ": đúng tương đối; nếu muốn chính xác thì đổi chữ "Đỏ" thành "Hồng" (dữ liệu chưa khóa) hay đổi màu.
- `luyen_nghe` của `mozart-eine-kleine` ("Hình thức sonata, serenade"): Köchel coi K. 525 là divertimento, tên Serenade có từ bản in đầu; NMA, IMSLP, COD vẫn gọi serenade. Giữ là hợp lý; đổi thì ghi `sua`.
- Lời User-Agent: mọi yêu cầu dùng `opus-kiem-dinh/1.0`; DuckDuckGo HTML đòi kiểm tra người (không dùng), naxos.com trả 403 (dùng MusicBrainz, ROH Shop thay).

## Thuật ngữ chưa có bản ghi trong `thuat-ngu.yml`

đoạn chuyển (transition), chủ đề 1/chủ đề 2 (first/second subject), kèn gỗ, giọng xa (remote key), đồng âm (unison), serenade, divertimento, contrabass, Singspiel, coloratura (soprano màu sắc), lời thoại nói, fugue kép (double fugue), basset horn, quãng 7 giảm, tiết tấu chấm dôi, tên các đoạn của Requiem (Introitus, Kyrie, Dies irae, Tuba mirum, Rex tremendae, Recordare, Confutatis, Lacrimosa, Offertorium, Hostias).
