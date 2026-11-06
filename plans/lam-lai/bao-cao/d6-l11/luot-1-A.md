# D6-L11, lượt 1, phần A

Người làm: Claude Opus 5.5 (D6-L11 lượt 1, phần A), ngày 06/11/2026, nhánh `moi/d6-l11`.

Phần A gồm 4 hướng dẫn nghe (tầng Tác phẩm): `nghe-nhac/brahms-4`, `dvorak-9-largo`, `grieg-buoi-sang`, `puccini-nessun-dorma`. Kèm lần 2 của 4 bản ghi `tac-pham/` cùng tên, cho các trường chưa khóa: `thoi_ky`, `luyen_nghe`, và `hinh` (chỉ `brahms-4`, `dvorak-9-largo` có). Không build, không chạy `npm`. Cả 8 hồ sơ đọc được bằng `node tools/khoa.mjs xuat`.

## Số liệu

**Trang:** 134 nhận định.

| Hồ sơ | Tổng | dung | da-sua | da-bo | khong-can-nguon | mục `doi_chu` |
|---|---|---|---|---|---|---|
| brahms-4 | 27 | 13 | 13 | 0 | 1 | 12 |
| dvorak-9-largo | 25 | 13 | 12 | 0 | 0 | 10 |
| grieg-buoi-sang | 44 | 18 | 21 | 1 | 4 | 17 |
| puccini-nessun-dorma | 38 | 13 | 22 | 1 | 2 | 17 |
| **Cộng** | **134** | **57** | **68** | **2** | **7** | **56** |

Theo loại: `cau-truc` 53, `lich-su` 39, `ve-site` 10, `nam` 9, `khuyen-tap` 7, `ten` 6, `danh-muc` 5, `dinh-nghia` 3, `so-lieu` 2.

Khuông nhạc: không trang nào có khối `abc`.

**Bản ghi (lần 2):** 12 nhận định. 11 câu `dung`; 1 câu `da-sua` (`brahms-4` n7, ô "BT 16–30, Mi thứ, dồn dập" của `hinh.nghe`), có mục trong `sua-A.yml`.

## Chỗ sửa chính

- **Đọc bản nhạc** (ảnh quét; không có bản Mutopia cho cả bốn tác phẩm):
  - **Brahms:** bản in đầu tiên (Simrock 1886) do Brahms-Institut Lübeck số hóa.
    - Chủ đề do kèn chơi f, đàn dây nghỉ. Trombone chỉ có ở chương 4: danh sách nhạc cụ của chương 1–3 không có Posaunen.
    - Dòng 1–3: chủ đề không "chuyển dần vào bè trầm". Biến tấu 1 là đàn dây pizzicato, biến tấu 2 là kèn gỗ hát, biến tấu 3 là f ben marc.
    - Dòng 4–11: thêm vế "tới biến tấu 11 nhạc lắng xuống".
    - Dòng 12 (3/2): bỏ "buồn, tự do, gần như ngừng thời gian".
    - Dòng 13–15: ghi đúng trombone, bassoon, horn pp.
    - Dòng 16: f rồi ff.
    - Dòng 17–30 không "ngày càng dồn dập": có những đoạn pp.
    - Coda: bỏ vế "một trong số ít giao hưởng thế kỷ 19 kết ở giọng thứ" (không có nguồn).
    - Đã đếm ô: biến tấu 12 bắt đầu ở ô 97, biến tấu 16 ở ô 129, chữ K ở ô 225, chữ L ở ô 241, Più Allegro ở ô 253. Như vậy 30 biến tấu, mỗi biến tấu 8 ô.
  - **Dvořák:** tổng phổ Simrock của Royal Academy of Music, trên Internet Archive. Viết lại năm dòng của bảng Theo dõi:
    - hợp âm mở đầu ppp, bắt đầu bằng Mi trưởng;
    - đàn dây con sordino;
    - Un poco più mosso rồi Poco meno mosso, trên contrabass pizz.;
    - đoạn Đô♯ trưởng có láy và có chủ đề của chương 1 và chương 2;
    - đàn dây chỉ còn vài người, có chỗ solo.
  - **Grieg:** tổng phổ màn 4 (Mus.ms. 6900) ở Thư viện Quốc gia Na Uy. Đây là bản in Peters của Suite I, dùng làm khúc dạo đầu màn 4.
    - Sáo vào p, không phải pp. Nền lúc mở đầu là clarinet và bassoon, đàn dây chưa chơi.
    - Lần forte đầu tiên không phải cao trào duy nhất: đoạn giữa còn ff ở chữ C và D.
    - Kèn horn không "gọi khẽ": Grieg ghi "Solo mf (sehr hervortretend)".
    - Giai điệu trở lại ở cello, mf cantabile.
    - Bỏ các hình ảnh "mặt trời ló dạng" và "như buổi sáng đã bắt đầu hẳn".
  - **Puccini:** tổng phổ Ricordi P.R. 117 trên Internet Archive. Ở tiếng "Vin-ce-rò!" cuối aria:
    - nốt Si cao trên "-ce-" là một nốt móc kép;
    - nốt ngân dài là nốt La trên "-rò".

    Trang cũ viết "nốt Si cao ngân dài", và câu hỏi khẳng định "các tenor hiện đại thường ngân dài" mà không có nguồn. Đã viết lại theo tổng phổ và đổi câu hỏi thành lời mời tự so sánh.
- **Lịch sử:**
  - Brahms:
    - "nhìn về quá khứ hơn ai hết; Bach, Handel, Phục hưng" đổi thành "quan tâm sâu tới âm nhạc quá khứ: học đối âm, nghiên cứu nhạc Bach", theo Baker's.
    - Chủ đề phỏng theo chaconne của BWV 150, không phải "bè trầm" (Brahms-Institut: ở đầu chương chủ đề nằm ở sáo, oboe 1 và trombone 1).
  - Dvořák:
    - Bỏ hình ảnh "lá thư… nỗi nhớ quê hương Bohemia". Thay bằng câu của antonin-dvorak.cz: nét Mỹ đan với nét Séc.
    - Thêm tên William Arms Fisher.
    - Bỏ vế "nhiều người tưởng là spiritual cổ": chỉ có nguồn bậc 3.
  - Grieg:
    - Năm sáng tác đổi từ 1875 thành 1874–1875 (COD, IMSLP).
    - Chuyện màn 4 viết lại theo bản dịch Archer (1892). Bạn đồng hành cướp du thuyền ở cảnh 1–2. Cảnh Peer ngồi trên cây đuổi khỉ là cảnh 4.
    - **Phát hiện:** ghi chú dán trong tổng phổ màn 4 nói bản nhạc lúc đầu viết để mở cảnh 5, "Sáng sớm" (vùng núi đá nhìn ra sa mạc). Trang đã thêm câu này.
    - Bỏ câu "gần như ai nghe cũng tưởng… Na Uy".
  - Puccini:
    - "Mới phối khí xong hai màn đầu và một phần màn 3" đổi thành "vở đã gần xong, chỉ còn thiếu phần cuối màn 3" (COD, EWB, IMSLP).
    - Bỏ "từ bản phác thảo" và chi tiết "hạ đũa".
    - Lời Toscanini viết gián tiếp theo EWB. Thêm "phần Alfano diễn từ đêm thứ hai" (IMSLP).
    - Bỏ "môtip gắn với công chúa" của *Mạt lỵ hoa*. Sheppard (JRMA 2015) chỉ nói giai điệu này là "token of Chinese music".
    - Bỏ "World Cup 1990" ở dòng bản thu (chỉ có nguồn bậc 3). Thay bằng bản thu trọn vở của Mehta (Decca 1973, theo MusicBrainz).
- **Câu `ve-site` sửa:**
  - `dvorak-9-largo` n21: trang `nhac-cu/dan-nhac` không nói gì về cor anglais, nên đổi thành "Về oboe, xem…".
  - `puccini` n36: trang `lich-su/opera` có mục "Opera ở Việt Nam" nhưng không có "nhạc kịch Việt Nam".
  - `grieg` n15: thêm anchor `#edvard-grieg-18431907`.
- **Đã bỏ:**
  - `grieg-buoi-sang` n21 ("gần như ai nghe cũng tưởng… Na Uy");
  - `puccini-nessun-dorma` n35 ("người chưa từng nghe opera cũng thuộc lòng").
- **Mục Nguồn** của cả 4 trang: bỏ link "tìm trên IMSLP", Burkholder/Grout/Palisca và Grove (chưa đọc). Thay bằng link thẳng tới nguồn đã đọc; đã thử, mọi link trả 200.
- **Mô tả trang** (`description`) của `brahms-4` và `puccini-nessun-dorma` sửa theo đoạn đầu; đã ghi ở `doi_chu`.

## Chưa chắc

- `brahms-4` n4, Brahms chỉ huy buổi đầu: COD (mục Brahms) ghi "cond. Bülow". Tờ chương trình gốc ("Unter persönlicher Leitung des Meisters") và lời tựa Henle nói Brahms chỉ huy. Đã giữ theo tờ chương trình.
- `brahms-4` n12, số biến tấu: Brahms-Institut viết "mehr als 30", Burkhardt (1912) "32 Veränderungen". Đếm trên bản in ra 30 biến tấu 8 ô, 4 ô nối và coda từ ô 253. Đã giữ "30 biến tấu và một coda".
  - Phép đếm dựa vào các mốc (ô 97, 129, 225, 241, 253) và các trang đã đếm ô. Chưa đếm tay từng ô của tr. 79–92.
- `grieg-buoi-sang` n20: ghi chú về cảnh 5 là chữ tay dán trên bản in, không rõ ai viết.
- `grieg-buoi-sang` n26: "khoảng ô 21 trên khoảng 90 ô" là ước lượng, tính từ số ô mỗi trang. Trang chỉ viết "khá sớm, ngay ở phần đầu".
- Giấy phép: bản số hóa của Thư viện Quốc gia Na Uy ghi CC BY-NC-ND. Chỉ đọc để kiểm, không chép hình.

## Nguồn hay dùng

- **Bản nhạc** (đọc ảnh):
  - Brahms-Portal (Brahms-Institut Lübeck): bản in đầu tiên op. 98, CC0, IIIF qua `https://www.brahms-portal.de/api/v1/records/<dc…>/manifest/`.
  - Internet Archive:
    - Dvořák: Simrock, `13836-3001`;
    - Turandot: Ricordi, `giacomopuccinitu0000vari`;
    - lời opera 1926: `turandotdrammali02adam`;
    - bản piano Peer Gynt của Grieg: `31761045200615`.
  - Thư viện Quốc gia Na Uy: tổng phổ Peer Gynt màn 4, Mus.ms. 6900. Tìm qua `https://api.nb.no/catalog/v1/items?q=…&filter=mediatype:musikkmanuskripter`, ảnh IIIF qua `…/catalog/v1/iiif/<id>/manifest`.
- **Lời tựa, giới thiệu:**
  - Henle HN 9856 (Pascall), cùng bản ở Breitkopf PB 16103;
  - Werkeinführung của Brahms-Institut (đọc qua `lidoresolver`) và tờ chương trình Meiningen 25/10/1885;
  - antonin-dvorak.cz (trang tác phẩm, tiểu sử);
  - catalog.puccini.it;
  - booklet audite (Grieg); trang OMI về facsimile Morgenstimmung.
- **Từ điển** (Encyclopedia.com): COD (chaconne, cor anglais, pastoral, Grieg, Puccini, Turandot); Baker's (Brahms); EWB (Puccini).
- Store norske leksikon (Grieg).
- IMSLP: wikitext qua `api.php`.
- MusicBrainz API: độ dài, bản thu.
- Bản dịch *Peer Gynt* của Archer (1892) trên Internet Archive.
- **Không dùng được:**
  - Gallica (Cloudflare); iris.unive.it (Cloudflare);
  - metopera.org (hàng đợi); Lyric Opera (403);
  - Papers Past (Incapsula); archives.nyphil.org (403);
  - bản Kalmus và Norton trên Internet Archive (chỉ cho mượn).
- **Cách mở mới**, có thể thêm vào `chuan-kiem-dinh.md`, mục "Nguồn và cách mở":
  - Brahms-Portal có IIIF manifest và LIDO (`/lidoresolver?id=dc…`). LIDO của bản ghi tác phẩm (`dc00007469`) liệt kê mọi đối tượng liên quan: bản in đầu, các tờ chương trình.
  - API của Thư viện Quốc gia Na Uy (`api.nb.no/catalog/v1`) có bản thảo, bản in Grieg, kèm IIIF.

## Việc cho người giao

1. Build bản xem, chạy `node tools/chuyen/so-chu.mjs <trang> --doi-chu`, ghép với `doi_chu` viết tay.
   - `doi_chu` do script tách theo khối: đoạn văn, dòng bảng, mục danh sách, mô tả trang. Mỗi mục `cu`/`moi` là chữ Markdown của khối.
   - Mục Nguồn có số dòng khác bản cũ, nên ghi `moi` thành danh sách.
2. Áp `sua-A.yml` hay không: `brahms-4`, ô "BT 16–30" của `hinh.nghe`.
3. Câu ở hồ sơ khác trỏ tới các trang này vẫn đúng:
   - `hinh-thuc/bien-tau` n12 (brahms-4 là passacaglia);
   - `piano/10-bai-dau-tien` n88 và n81 (Largo, Rê♭ trưởng, 1893);
   - `nghe-nhac/grieg-concerto` n14;
   - `nghe-nhac/nghe-gi-tiep` n26;
   - `nhan-dien/dau-van-tay` n52, `lich-su/nha-soan-nhac` s5, `lich-su/thoi-ky/lang-man` n37.
4. Trang có link mới ra ngoài: brahms-portal.de, nb.no, antonin-dvorak.cz, catalog.puccini.it, snl.no, encyclopedia.com, doi.org, Internet Archive. Lychee hằng tuần sẽ kiểm. Link IMSLP có dấu ngoặc trong địa chỉ, giống các trang đã khóa khác.
5. Nhãn giáp ranh cho review:
   - `dvorak-9-largo` n21 là `ve-site` có kết quả `da-sua`.
   - `grieg-buoi-sang` n40, n42 xếp `khuyen-tap`: câu hỏi nghe đã sửa cùng n26 và n18.

## Thuật ngữ chưa có bản ghi trong `thuat-ngu.yml`

passacaglia, chaconne, ostinato, cor anglais, spiritual, nhạc sân khấu (incidental music), khúc dạo đầu (prelude), pastorale, tenor, hợp xướng (chorus), dramma lirico. (Đã có: Coda, pizzicato, espressivo, con sordino, trill, cantabile, aria, Allegretto.)
