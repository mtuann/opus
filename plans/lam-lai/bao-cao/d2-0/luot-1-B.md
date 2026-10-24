# D2-0, lượt 1, phần B: 39 hướng dẫn nghe (`tac-pham`, `loai: nghe`)

Hồ sơ: `kiem-dinh/du-lieu/tac-pham/<slug>.yml` (39 file). Làm ngày 24/10/2026 bởi Claude Sonnet 5.5. Chưa ghi `luot_2`, `review`, `kiem_mau`.

## Số liệu

- 39 bản ghi, 109 nhận định: `ten` 39, `tac_gia` 39, `danh_muc` 31 (8 bản ghi không có `danh_muc`: bizet-habanera, debussy-preludes, gershwin-rhapsody, mussorgsky-tranh, part-spiegel, puccini-nessun-dorma, ravel-bolero, stravinsky-sacre).
- `dung` 109, `da-sua` 0, chưa chắc 0. `sua-B.yml` là danh sách rỗng.
- Không bản ghi nào có `goi_y`, `gan_cho`, `khuyet_danh`, nên không có nhận định cho ba trường này.
- `loai: nghe` (cấu trúc) ghi ở `ghi_chu` đầu mỗi hồ sơ. Cả 39 trang cũ `../opus-zero/docs/nghe-nhac/<slug>.md` có. Ở site mới mới có `nghe-nhac/bach-goldberg.md`.
- Mọi số danh mục trỏ đúng tác phẩm cha, mọi chương nêu trong tên (chương 1, 2, 3, 4, Largo, Prelude, Air) khớp danh sách chương ở nguồn. Chỗ cần chú ý: Grieg (dưới) và ba tên chưa nêu rõ đoạn trích (mục 3 dưới).
- Cách kiểm: tóm tắt của WebFetch sai hai chỗ (nói IMSLP không có số danh mục của *Carmen*, thực ra có «GB 9 ; WD 31»; không thấy Hallelujah ở trang *Messiah* vì trang bị cắt). Nên mọi trang đã dẫn được đọc lại nguyên văn bằng curl, và một script kiểm mỗi nguồn dẫn cho nhận định `tac_gia` có tên nhà soạn nhạc, cho `danh_muc` có số danh mục: không thiếu chỗ nào. Lượt 2 nên đọc nguyên văn trang, không tin tóm tắt.

## Nhận định chưa chắc

Không có.

## Chỗ dễ bị lượt 2 hiểu khác (có `ghi_chu` trong hồ sơ, kết quả vẫn `dung`)

- `grieg-buoi-sang`: `danh_muc: Op. 23` là nhạc sân khấu *Peer Gynt*, đúng với tên "(Peer Gynt)". Khi tách thành tổ khúc, *Buổi sáng* là Op. 46 số 1 (IMSLP: Suite số 1 "do tác giả chọn từ Op. 23"; Henle: "Morgenstimmung op. 46,1"). Lượt 2 có thể đòi Op. 46.
- `scarlatti-sonata`: một chuỗi chứa ba số "K. 380, K. 141, K. 466", đúng với ba sonata (L. 23, L. 422, L. 118). "K." ở đây là số Kirkpatrick, không phải Köchel (cách gọi thông dụng; IMSLP và Henle chỉ ghi K. và L., không giải thích).
- `mozart-requiem`: tác giả Mozart; Süßmayr chỉ hoàn thành phần dở dang (IMSLP, Köchel online).
- `schubert-erlkonig`: IMSLP và Hyperion ghi thêm Op. 1; `danh_muc` chỉ ghi D. 328, đúng.
- `mozart-k331`: Köchel online ghi KV 331 (KV³ 300i).

## Vấn đề schema và chuẩn

1. Chuẩn (mục 1) không có loại nhận định cho "tác giả". Tôi dùng `lich-su`. Nên thêm loại riêng hay ghi rõ vào chuẩn.
2. `danh_muc` là một chuỗi, một cấp. Không biểu diễn được "Op. 23 (tác phẩm cha) và Op. 46 số 1 (tổ khúc)" của Grieg, hay hai hệ số như "Op. 8 số 4 = RV 297" của Vivaldi (bản ghi chỉ có Op. 8).
3. Ba tên không nêu vở hay đoạn trích; đúng nhưng chưa rõ, chủ repo quyết định có đổi không:
   - `bizet-habanera`: "Habanera", không nêu *Carmen* (các tên cùng loại như `"Nessun dorma" (Turandot)` có nêu). Gợi ý: `Habanera (Carmen)`.
   - `mozart-nu-hoang-bong-dem`: "Nữ hoàng bóng đêm", chỉ nhân vật; không nêu *Cây sáo thần* và không nêu aria (*Der Hölle Rache*, màn 2, số 14 theo IMSLP). Gợi ý: `Aria Nữ hoàng bóng đêm (Cây sáo thần)`.
   - `tchaikovsky-ho-thien-nga`: "Hồ thiên nga" là cả vở (Op. 20), trong khi trang chỉ nghe đoạn *Scène* màn 2 (số 10); trang cũ đặt tiêu đề "Hồ thiên nga, Cảnh (màn 2)". Gợi ý: thêm ", Cảnh (màn 2)".
4. Tám bản ghi không có `danh_muc`; nguồn có số cho năm bản: Bizet *Carmen* («GB 9 ; WD 31», IMSLP), Debussy *Préludes* quyển 1 («CD 125 ; L.117», IMSLP), Puccini *Turandot* (SC 91), Ravel *Boléro* (IMSLP ghi M.81 ở tên trang nhưng «M.107 ; O.81» ở ô danh mục, không nhất quán), Stravinsky (chỉ "K015" ở IMSLP, không nói danh mục nào). Gershwin, Mussorgsky, Pärt: nguồn không có số. Thêm hay không là việc biên tập, không phải lỗi.
5. Ngoài phạm vi, để đợt 6: `thoi_ky` ở bản ghi tác phẩm có giá trị ngoài danh sách thời kỳ dùng cho nhà soạn nhạc ("Beethoven cuối đời", "Ấn tượng", "Cuối Lãng mạn", "Cổ điển → Lãng mạn"), và lệch `thoi_ky` của nhà soạn nhạc (Debussy: "Ấn tượng" so với "Thế kỷ 20"; Rachmaninoff: "Cuối Lãng mạn" so với "Thế kỷ 20"; Beethoven: "Cổ điển → Lãng mạn" so với "Cổ điển/Lãng mạn"; Gershwin, Mussorgsky, Scarlatti: bản ghi tác phẩm có `thoi_ky`, nhà soạn nhạc không có).
6. Tên tiếng Việt như "Nghi lễ mùa xuân", "Những bức tranh ở phòng triển lãm" là bản dịch của site; nguồn chỉ xác nhận tác phẩm gốc.

## Nguồn dùng nhiều nhất

- IMSLP, trang tác phẩm: 38 trong 39 hồ sơ (trừ `part-spiegel`, dùng Arvo Pärt Centre và ECM).
- Henle (trang xuất bản): 19 hồ sơ, nhất là tác phẩm piano. Köchel online (kv.mozarteum.at): 6 hồ sơ Mozart. Beethoven-Haus Bonn: 3 hồ sơ Beethoven. Breitkopf: 3. Tchaikovsky Research: 2.
- Một hồ sơ mỗi nơi: Carus (Messiah), gershwin.com, Arvo Pärt Centre, ECM, catalog.puccini.it, Durand, BnF data, Hyperion, DSCH, Boosey & Hawkes, Chandos/Naxos.
- Ba nhận định chỉ có một nguồn (IMSLP, vì chỉ IMSLP liệt kê số hay chương): `ten` của bach-air (Air là chương 2), mozart-nu-hoang-bong-dem (aria màn 2, số 14), puccini-nessun-dorma (Nessun dorma màn 3, số 34).
- Không mở được: Bach-Digital (trang "Security Check", chặn bằng JavaScript, không vượt), Bärenreiter (trang rỗng), NIFC Chopin (cần JavaScript), Universal Edition, Naxos, Library of Congress, Schott, schubert-online (403), BnF catalogue (503), Deutsche Grammophon store (429). Tchaikovsky Research WebFetch trả 500 hay 429, đọc được bằng curl. Bach-Digital là nguồn chuẩn cho BWV: nếu lượt 2 vào được thì nên đối chiếu thêm.

## Việc ngoài phạm vi (cho lượt kiểm trang, không phải bản ghi)

- Trang cũ `handel-hallelujah` ghi Hallelujah là "số 44" (IMSLP: Part II, No.44); mục lục Carus (Koopman) ghi số 39: số thứ tự tùy ấn bản.
- Trang cũ `mozart-eine-kleine` ghi "Serenade"; Köchel online nói chữ "Serenade" chỉ có ở bản in đầu, xếp tác phẩm là divertimento (mảnh, mất một minuet).
- Trang cũ `bizet-habanera` nói giai điệu habanera lấy từ bài hát của Sebastián Yradier: IMSLP (Related Works) ghi "El arreglito by Sebastián Yradier (basis of the Habanera)", khớp.
