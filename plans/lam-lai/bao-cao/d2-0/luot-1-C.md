# D2-0, lượt 1, phần C: `nha-soan-nhac`, 73 người đầu

Claude Sonnet 5.5, 24/10/2026. Hồ sơ: `kiem-dinh/du-lieu/nha-soan-nhac/<id>.yml` cho 73 id, từ `hildegard` đến `rubinstein`. Sửa dữ liệu: `sua-C.yml`. Chưa sửa gì trong `src/data/`.

## Số liệu

| | |
|---|---|
| Bản ghi | 73 |
| Nhận định | 193: tên 80 (73 tên và 7 `cach_viet_khac`), năm 74, thời kỳ 39 |
| `dung` | 186 |
| `da-sua` | 5 |
| chưa chắc (`null`) | 2 |

Cả 5 chỗ `da-sua` đều là thêm `khoang: true` cho năm sinh ước chừng: `machaut`, `josquin`, `tallis`, `palestrina`, `byrd`. Không có tên hay năm nào sai. Năm sinh và năm mất của 69 người có trang IMSLP khớp dữ liệu; BnF khớp cả 73, trừ ba chỗ ghi dưới đây.

## Nhận định chưa chắc (2)

1. `cristofori` n3, `mat: 1731`. Ngày mất 27/1/1731 là theo lịch Florence (năm bắt đầu 25/3), tức 27/1/1732 theo lịch hiện hành. Pollens (Cambridge University Press) và BnF ghi 1732; GND (qua Deutsche Biographie) ghi 1731; trang cũ của site ghi 1731 theo bài của Met (bài này chưa mở được: máy chủ trả 429). Năm sinh 1655 (n2) đã `dung`. Cần chọn: giữ 1731 kèm chú thích lịch Florence, hay đổi thành 1732.
2. `debussy` n3, `thoi_ky: Thế kỷ 20`. IMSLP chỉ xếp "Romantic". Nhãn hãng đĩa không thống nhất (Naxos dẫn lời nhạc trưởng gọi ông "the most important French composer of the twentieth century"; Warner nhắc "late-romantic" và Impressionism; Deutsche Grammophon không gán thời kỳ). Cần chọn: giữ "Thế kỷ 20" (đúng định nghĩa 1900–2000 của site) hay đổi thành "Lãng mạn/Thế kỷ 20" như Sibelius.

## Đã ghi `dung` nhưng chủ lô nên biết

- `beethoven` `thoi_ky: Cổ điển/Lãng mạn`: IMSLP chỉ xếp "Classical"; cơ sở cho nhãn chuyển tiếp là Deutsche Grammophon ("massive leap from Classicism to Romanticism"). `schubert` ("Lãng mạn") và `rachmaninoff` ("Thế kỷ 20") nằm trong hai era IMSLP liệt kê; `sibelius` khớp cả hai.
- `byrd`: IMSLP "ca.1540", BnF "1543?", GND 1543. Giữ 1540 và thêm `khoang`.
- `strozzi`: BnF còn ghi "1619-1664?" (bản ghi cũ); IMSLP và GND ghi mất 11/11/1677. Dữ liệu 1677 đúng.
- `dao-tan`: ông là nhà soạn tuồng, không có nguồn của cơ quan âm nhạc. Nguồn bậc 2 mở được: Tạp chí Văn hóa Nghệ thuật (Bộ VHTTDL) và BnF (BnF ghi tên đảo "Tâń Ðào"). Trang VUSTA (bậc 3) chỉ để đối chiếu. Trang `gialai.gov.vn` lỗi chứng chỉ khi tải.
- Tên khác tiêu đề IMSLP hoặc BnF nhưng có trong danh sách tên khác của IMSLP: `hildegard`, `josquin`, `palestrina` (tên ngắn), `jacquet-de-la-guerre` (IMSLP không dấu), `petzold` (IMSLP và BnF ghi Pezold), `fanny-mendelssohn` (Fanny Hensel), `tchaikovsky`, `beach`, `scriabin`. Gợi ý, không bắt buộc: thêm `cach_viet_khac: [Christian Pezold]` cho `petzold` và `[Fanny Hensel]` cho `fanny-mendelssohn`.
- `tchaikovsky` `cach_viet_khac: [P. I. Tchaikovsky]`: dạng viết tắt; IMSLP không liệt kê đúng chuỗi này, danh mục của Tchaikovsky Research dùng "P. I. Čajkovskij".

## Nhận diện id không rõ ràng

`ghi_chu` đầu hồ sơ của 17 bản ghi nêu người nào và trang cũ dùng tên ở đâu: `scarlatti` (Domenico), `couperin` (François le Grand), `stein` (Johann Andreas, thợ làm đàn ở Augsburg), `kellner` (Johann Peter), `rothschild` (Charlotte de), `fischer` (Edwin, không phải Fischer-Dieskau), `clarke` (Rebecca), `price` (Florence), `beach` (Amy), cùng `hofmann`, `heller`, `burgmuller`, `rubinstein` (Arthur), `field`, `petzold`, `cristofori`, `dao-tan`. Cả 17 khớp với cách trang cũ dùng.

## Vấn đề schema

- `khoang` là một cờ cho cả cặp `sinh`, `mat`; ở 5 người trên chỉ năm sinh ước chừng, năm mất chắc chắn.
- `sinh`, `mat` là số nguyên, không diễn đạt được khi nguồn nêu hai năm (Josquin "um 1450 oder 1440", Palestrina "um 1514 oder 1529") hay hai lịch (Cristofori 1731/1732).
- `thoi_ky` là chuỗi tự do, không có tập giá trị để kiểm. IMSLP "Early 20th century" tương ứng "Thế kỷ 20" của site.
- `nha-soan-nhac.yml` lẫn người không phải nhà soạn nhạc (Cristofori và Stein: thợ đàn; Rellstab: nhà thơ; Đào Tấn: nhà soạn tuồng; Fischer, Cortot, Schnabel, Hofmann, Rubinstein: nghệ sĩ; Nadia Boulanger: giáo sư). Không có trường vai trò; không ảnh hưởng tên và năm.

## Nguồn dùng nhiều nhất

- IMSLP, trang `Category:<người>` (69 hồ sơ; không có trang cho Cristofori, Stein, Hofmann, Đào Tấn).
- BnF `data.bnf.fr/ark:/12148/cb…` (73 hồ sơ). Mã ark lấy từ Wikidata, chỉ làm đầu mối, không dẫn.
- Deutsche Biographie (bản sao GND và bài NDB): `strozzi`, `cristofori`, `hofmann`, `byrd`, `josquin`, `palestrina`, `stein`.
- Deutsche Grammophon, Warner, Naxos (thời kỳ của Beethoven, Debussy); Tchaikovsky Research; Pollens (Cambridge UP) cho Cristofori.
- Không mở được: id.loc.gov và viaf.org (403), d-nb.info (Anubis chặn), `metmuseum.org` (429), `gialai.gov.vn` (lỗi chứng chỉ). Lượt 2 sẽ gặp cùng giới hạn.

## Khác

- Bảng ở `lich-su/dong-thoi-gian.md` của site cũ ghi các năm sinh của 5 người trên không có "khoảng"; khi `khoang: true` được áp dụng, biểu đồ và chữ trong trang cần theo.
- `node tools/khoa.mjs mau` nhận nhiều id một lần; trong zsh phải truyền mảng, không truyền biến chuỗi.
