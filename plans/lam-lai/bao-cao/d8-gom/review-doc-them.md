# Review D8-gom: phần Đọc thêm (nhạc cụ, nhạc truyền thống, nhà soạn nhạc nữ)

Claude Opus 5.5, không làm lượt 1 hay lượt 2 của các trang này. Mười trang: `nhac-cu/cello`, `clarinet`, `guitar`, `nhac-cu-khac`, `sao`, `trumpet`, `violin`, `index` (D8-L2); `lich-su/nhac-truyen-thong-viet-nam`, `lich-su/nu-nha-soan-nhac` (D8-L3).

Hai agent con tra nguồn ngoài: một cho nhạc cụ, một cho nhạc Việt Nam và nhà soạn nhạc nữ. Cả hai chỉ đọc, không sửa file. Người review đọc lại các trích dẫn chính (PTNA, TTVH, Yamaha), rồi quyết định và ghi hồ sơ. Ghi chú review trong hồ sơ bắt đầu bằng "Review D8-gom:".

Hồ sơ dùng số nhận định `n…`. Bảng sau đổi các mã báo cáo lô còn dùng sang số trong hồ sơ:

| Mã trong báo cáo lô | Số trong hồ sơ |
|---|---|
| `nhac-cu-khac` h5 | n8 |
| `nhac-cu-khac` c4 | n44 |
| `sao` t16 | n17 |
| `trumpet` a27 | n27 |
| `index` x22 | n24 |
| `index` x25 | n27 |
| `index` x29 | n31 |

## Câu về chính site

Sau khi đổi nhãn còn 57 câu: 56 `review: dung`, 1 `sai` (đã sửa). Các câu được kiểm trên:

- chính trang;
- trang đích: `dan-nhac`, `tai-lieu-tham-khao`, bài 16, bài 17, `am-hoc`, `opera`, `phuc-hung`, `fugue`, `lich-su-dan`, `luyen-nghe`;
- `src/data/trang.yml`, cho link "sắp có";
- `src/scripts/so-cao-do.js`, cho máy lên dây có chế độ violin và guitar;
- `../opus-zero`, cho hướng dẫn nghe chưa chuyển.

Câu sai:

- `nhac-cu/index` n30: mục "Các trang trong mục này" nói sáu trang nhạc cụ đều có phần "vai trò", nhưng `guitar.md` không có mục Vai trò. Đã bỏ "vai trò," khỏi câu và ghi `doi_chu`.

## Soát nhãn

- `nhac-truyen-thong-viet-nam` n9 ("18 link ở mục Nguồn mở được và nói đúng điều ghi bên cạnh") nói về trang ngoài, nên đổi `ve-site` thành `lich-su` (như `nu-nha-soan-nhac` n103, n104). Nguồn là 18 link ấy. Câu này đưa vào lượt 2 bổ sung.
- Không câu `khuyen-tap` nào nói về sức khỏe.
- Chín câu `khuyen-tap` có `ket_qua` `da-sua` hay `dung` mà không có nguồn, nên `khoa.mjs` báo "thiếu nguon". Đã đổi `ket_qua` thành `khong-can-nguon`, ghi chú giữ lại lý do sửa chữ. Chín câu ấy: `cello` n26, `clarinet` n28, `guitar` n19, `violin` n26, `sao` n24, `nhac-cu-khac` n51, `index` n2, `nhac-truyen-thong` n82, n83.

## Câu chưa có kết quả, khong-chac, nguồn yếu

| Câu | Quyết định |
|---|---|
| `guitar` n2, n3 | `da-sua` (chữ lượt 1 giữ). Yamaha (hãng đàn): cần đàn rộng hơn khoảng 1 cm (52 mm so với 43 mm), "played with fingers-not picks" |
| `guitar` n4 | `dung`. Open Music Theory, Reading Clefs: "guitarists … often uses the octave treble clef" |
| `guitar` n13 | `dung`. IMSLP BWV 996: viết cho lute, có các bản "For Guitar" |
| `nhac-cu-khac` n8 (countertenor Sol3–Sol5 trong hình) | `dung`. Hình dùng chung với `lich-su/opera` (đã khóa); review D5-gom vẽ countertenor như contralto, theo World Encyclopedia ("same register as the female contralto") và Met Opera. Britannica: "adult male alto voice". Không sửa hình |
| `nhac-cu-khac` n27 (organ "vua của các nhạc cụ") | Giữ. COD nói đúng lý do "because of its normal large size". Lời Mozart mà lượt 2 dẫn là một cách giải thích khác, không trái |
| `nhac-cu-khac` n44, `index` n31 (harpsichord) | Giữ. World Encyclopedia (Oxford): "principal keyboard instrument from 1500 to 1750, but was replaced by the piano" |
| `sao` n17 (K. 313 "số 1") | Giữ. IMSLP, Alternative Title: "Flute Concerto No. 1" |
| `trumpet` n27 (1812 Overture) | Sửa (`da-sua`, loại `so-lieu`). Không nguồn nào nói kèn đồng nổi ở đoạn trận chiến. Câu mới theo biên chế của Tchaikovsky Research: "bộ kèn đồng của tác phẩm có 2 trumpet cùng 2 cornet, 4 horn, 3 trombone và tuba" |
| `trumpet` n37, n38; `sao` n6 | Giữ việc lượt 1 đã bỏ |
| `clarinet` n11 (clarinet La hợp bản nhiều dấu thăng) | Giữ. COD, Transposing instruments: "with the A instrument … notated in the key of D, i.e. 3 sharps fewer" |
| `violin` n27 (Suzuki, Alfred) | Giữ. Trang danh mục alfred.com/suzuki liệt kê "Suzuki Violin School" |
| `cello` n27 (người lớn dùng đàn 4/4) | Bỏ (`da-bo`). Không tìm được nguồn bậc 1–2 |
| `index` n7, n9 (âm sắc) | Giữ. Chữ dịch sát tính từ của VSL, là mô tả có nguồn, không phải nhận xét riêng của site |
| `index` n14, n17, n19 | Giữ, theo COD (Concerto, Chamber music, Piano trio) |
| `index` n20 (Erlkönig) | Giữ. Thêm The Open University: "the rhythm of a horse galloping" |
| `index` n24 | Giữ. Hai ví dụ ngay dưới có nguồn bậc 2 (PTNA, Hyperion) |
| `index` n25, n26 (Les Adieux) | Viết lại. Bỏ "tù và săn bắn" và "hợp âm thứ ba … bất ngờ" (chỉ có nguồn bậc 3). PTNA Piano Music Encyclopedia: "a natural horn figure … (a two-voice progression of major 3rd → perfect 5th → minor 6th)"; Yamaha: horn fifths. Câu mới: "Lối hai bè quen thuộc của kèn horn tự nhiên ("quãng năm kèn horn") gợi tiếng kèn horn. Ba hợp âm *Le-be-wohl* … dựa trên một hình nét kèn horn tự nhiên: hai bè đi qua quãng 3 trưởng, quãng 5 đúng, quãng 6 thứ." Chi tiết quãng 3, 5, 6 của trang cũ nay đã có nguồn |
| `index` n27 (Scarlatti, trước là x25) | Viết lại. Hyperion (Angela Hewitt) gắn nốt lặp với mandolin và castanet; với guitar thì là hợp âm rải ("imitating the strumming of the open strings of the guitar"). Câu mới: "Trong các sonata của Scarlatti có những hợp âm rải bắt chước tiếng gảy dây guitar" |
| `nhac-truyen-thong` n25 (Liu ứng với Đô cao) | `dung`, giữ khối abc. Cồ Huy Hùng, luận án tiến sĩ 2016 (Học viện Âm nhạc Quốc gia VN), tr. 88–89: Hò là sol thì Líu là sol cao. `khuong-nhac.mjs`: 239 khối, 0 lỗi |
| `nhac-truyen-thong` n29 (đàn nguyệt, bốn nốt một phím) | Giữ. Đây là chữ của Nguyễn Vĩnh Bảo (1970, PDF đọc được). Thêm luận án Cồ Huy Hùng: nhấn trên một phím lên quãng 3, quãng 4 |
| `nhac-truyen-thong` n64 (cải lương) | Giữ. Vĩnh Bảo ("French theater"); Britannica (Wayback): "influence of European drama"; SGGP: "đầu thế kỷ XX" |
| `nhac-truyen-thong` n70 (Út Trà Ôn) | Giữ việc bỏ |
| `nhac-truyen-thong` n71 (Minh Vương, Lệ Thủy) | Giữ. SGGP 2024 (NSND Minh Vương, giải Khôi nguyên Vọng cổ), VnExpress 2019 ("Nghệ sĩ cải lương Lệ Thủy") |
| `nhac-truyen-thong` n54 (NSND Thanh Ngoan) | Giữ. Chính bài Znews ghi "Nghệ sĩ Nhân dân năm 2019", giám đốc từ 2012, nghỉ hưu 2022 |
| `nhac-truyen-thong` n79 (Puccini, *Mo Li Hua*) | Giữ. Thêm Met Opera và Lyric Opera of Chicago (bản lưu Wayback), bậc 2 |
| `nhac-truyen-thong` n81 (câu mở đầu và mô tả trang) | Viết lại. "Người Việt học nhạc cổ điển … thường đã quen …" không có nguồn. Câu mới: "Nhạc truyền thống Việt Nam có những thang âm, nhạc cụ và cách nghe riêng, khác nhạc cổ điển phương Tây." (Vĩnh Bảo) |
| `nu-nha-soan-nhac` n78 (Nguyễn Thị Nhung, sinh 1936, Hà Nội) | `dung`, không bỏ mục. Mở lại ba trang lượt 1 đã dẫn. Hội Nhạc sĩ VN (Wayback): "sinh ngày 16 tháng 8 năm 1936 tại Hà Nội". TTVH 2011 (Wayback). Dân trí 2017: "sinh ngày 16/8/1936 tại Hà Nội". Lượt 2 không tìm ra người này vì chỉ tìm qua công cụ tìm kiếm |
| `nu-nha-soan-nhac` n39 (*Gaelic*) | Giữ chữ "được coi là giao hưởng lớn đầu tiên … sáng tác và xuất bản". Thêm Library of Congress: "the first American woman to compose and publish a large scale musical work, her Gaelic Symphony"; thêm Orchestre Métropolitain |
| `nu-nha-soan-nhac` n24 (sáu ca khúc của Fanny) | Giữ. Henle HN 1610 kể tên ba bài ở Op. 8 và ba bài ở Op. 9 |
| `nu-nha-soan-nhac` n100 (dấu vân tay Sa Huỳnh) | Viết lại, vì nguồn cũ là bậc 3. Theo TTVH 2021: "các ca khúc trong album *Human* đi qua những chặng đường của đời người, những suy nghĩ về cuộc sống" |

**Các câu lượt 1 đã sửa hay đã bỏ còn lại** (khoảng 130 câu): đã đọc ghi chú và nguồn từng câu. Chỗ sửa đều có trích dẫn từ nguồn bậc 1–2, nên giữ, không ghi thêm. Một chỗ cần biết: `trumpet` n25 (Brandenburg số 2, trumpet ở chương 1 và 3) dựa vào một trang bậc 3 (trumpetstudio.com) cộng với IMSLP.

## Chỗ sửa trang (đã ghi `doi_chu`)

`so-chu --doi-chu` trên bản dựng riêng báo "doi_chu đã đủ" cho cả năm trang có sửa:

- `nhac-cu/index`: các câu n25–n27 và n30;
- `nhac-cu/trumpet`: n27;
- `nhac-cu/cello`: bỏ câu cỡ 4/4;
- `lich-su/nhac-truyen-thong-viet-nam`: câu mở đầu và mô tả trang;
- `lich-su/nu-nha-soan-nhac`: n100.

## Lượt 2 bổ sung

Bảy câu:

- `nhac-cu/index` n25, n26, n27: chữ đổi sau lượt 2. Đã gỡ kết quả lượt 2 cũ, chép vào `ghi_chu`. Trang tầng khung nên mọi câu cần lượt 2, và `khoa.mjs` báo thiếu cho đến khi có kết quả;
- `nhac-cu/trumpet` n27: chữ mới;
- `lich-su/nhac-truyen-thong-viet-nam` n9 (đổi nhãn) và n81 (chữ mới);
- `lich-su/nu-nha-soan-nhac` n100: chữ mới.

Ở các trang Đọc thêm, mẫu 5 câu của lượt 2 vẫn đủ: review không gỡ kết quả lượt 2 nào ở các trang ấy.

## Chủ repo cần biết

- Luận án Cồ Huy Hùng viết "Líu" (có dấu); khối abc và trang viết "Liu" như trang cũ. Muốn thêm dấu thì đổi trọn mã abc và ghi `doi_chu`.
- `nhac-truyen-thong` n2 ghi "Cập nhật lần cuối: 11/2026": đổi tháng nếu khóa sau tháng 11.
- Hình `ranges-voices` dùng chung với trang đã khóa `lich-su/opera`. Countertenor được vẽ trùng contralto: đây là cách thể hiện, không phải âm vực có nguồn ghi riêng.
- Đã điền `nguoi.review` cho 10 hồ sơ. `luot_2` và `kiem_mau` để người gom và chủ repo điền.
- Kiểm thử: `node tools/khoa.mjs tinh` đạt; `node --test tests/chuyen.test.mjs tests/khoa.test.mjs tests/du-lieu.test.mjs` đạt (38/38); `node tools/khuong-nhac.mjs` 0 lỗi. Bản dựng riêng ở scratchpad (`dist-doc-them`) không có cảnh báo `[opus]`.
