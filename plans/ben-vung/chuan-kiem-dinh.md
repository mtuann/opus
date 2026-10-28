# Chuẩn kiểm định và khóa nội dung

Tài liệu này định nghĩa thế nào là một trang "đã kiểm định", hồ sơ ghi gì, và cách khóa để trang không phải đọc lại. Áp dụng cho mọi trang lên site mới (`plans/lam-lai/README.md`, luật 1): lõi ở đợt 2–5, tác phẩm ở đợt 6 và khi thêm mới, trang khung có chữ cùng đợt với mục của nó, ngoại vi ở đợt 8. Tầng Tham chiếu có hạn dùng cùng hồ sơ nhưng không khóa vĩnh viễn: mỗi lần rà theo lịch là một lần kiểm định mới.

## 1. Nhận định

Nhận định là mọi câu có thể đúng hoặc sai. Mỗi nhận định một dòng trong hồ sơ.

| Loại (`loai`) | Ví dụ | Cần nguồn |
|---|---|---|
| `dinh-nghia` | "Hợp âm ba gồm nốt gốc, quãng ba và quãng năm." | có |
| `quy-tac` | "Hai quãng năm đúng liền nhau bị tránh trong hòa âm bốn bè." | có |
| `ten` | tên tác phẩm, biệt danh, tên ấn bản, tên người chơi | có |
| `nam` | năm sinh–mất, năm sáng tác, năm in, năm thu âm | có |
| `danh-muc` | Op., K., BWV, WoO, D., S., L., Hob. | có |
| `cap-do` | Grade, chặng, mức Henle | có (chương trình thi, trang Henle của đúng tác phẩm) |
| `cau-truc` | số ô, các đoạn, giọng của từng đoạn | có (bản nhạc) |
| `lich-su` | bối cảnh, ảnh hưởng, người đề tặng | có |
| `so-lieu` | con số khác (số chương, độ dài, tốc độ máy đếm nhịp do tác giả ghi) | có |
| `khuyen-tap` | "Tập hai tay riêng trước, chậm." | không, nhưng không được trái với trang lõi khác |
| `ve-site` | câu nói về chính site: "Bài kiểm tra có 28 câu", "xem trang chặng 3", "site chia 7 chặng", số bài, link sang trang khác | không; review kiểm thẳng trên trang, thành phần hay dữ liệu đã khóa và ghi `review: dung` hay `sai`; `ghi_chu` ghi đã kiểm ở đâu. Không qua lượt 2. Không kèm nguồn ngoài, không có ở hồ sơ bản ghi dữ liệu (công cụ khóa chặn) |

- Câu viết chung chung đến mức không kiểm được ("bài này rất hay") thì viết lại cho cụ thể hoặc bỏ.
- **Lời khuyên dính tới sức khỏe** (đau, chấn thương, tư thế gây hại, thính lực) không xếp `khuyen-tap`. Xếp loại cần nguồn (`quy-tac`, `so-lieu`), nên vẫn đủ hai lượt.
- Câu `ve-site` trỏ tới trang chưa chuyển (rút từ D3-L1): review kiểm trên site cũ; `ghi_chu` ghi trang đích và điều câu nói về trang ấy. Lô chuyển trang đích phải giữ đúng điều ấy, hay sửa câu ở trang trỏ tới theo thủ tục mở khóa. Lô đó tìm các câu này bằng `grep -rn "<trang đích>" kiem-dinh/`.
- Câu `ve-site` nói về phần do thành phần sinh ra (chữ trong hình, nút, kết quả của công cụ): review kiểm trên bản xem và trong module dựng phần ấy, ghi tên module ở `ghi_chu`.
- Lời giải thích của câu hỏi kiểm tra không được dựa vào vị trí lựa chọn ("đáp án thứ hai"): thứ tự lựa chọn trộn mỗi lần.
- Câu về chính site có kèm điều kiểm được từ bên ngoài thì tách đôi. Ví dụ "bài Für Elise ở chặng 4, khoảng Grade 4–5": phần chặng là `ve-site` (khớp dữ liệu đã khóa); phần Grade là `cap-do`, cần nguồn.

Hai loại sau do chủ repo chọn ngày 24/10/2026, sau đợt 2. Lý do: ở D2-L1, khoảng 30 câu về chính site làm lượt 2 ghi "chưa chắc" và review phải gỡ từng câu.

## 2. Thứ bậc nguồn

1. **Bản nhạc:** bản in đã hết bảo hộ trên IMSLP; bản gõ lại có giấy phép mở trên Mutopia. Dùng cho cấu trúc, số ô, trích đoạn, giọng.
2. **Tài liệu chuẩn:** giáo trình nhạc lý: nguồn chính là *Open Music Theory* (https://viva.pressbooks.pub/openmusictheory/, chọn ngày 24/10/2026), dẫn link tới đúng mục; khi các sách gọi tên hay định nghĩa khác nhau thì theo nguồn này. Nhận định về Grade đối chiếu với đề cương chính thức của ABRSM (đúng kỳ); chương trình thi Trinity (đúng kỳ); trang henle.de của đúng tác phẩm; trang tác phẩm trên IMSLP cho năm và số danh mục; danh mục tác phẩm của nhà soạn nhạc; trang của nhà xuất bản, hãng đĩa, thư viện.
3. **Nguồn phổ thông** (Wikipedia, blog, diễn đàn): chỉ để tìm nguồn bậc 1–2. Không dùng làm nguồn duy nhất cho nhận định nào.

Sách in (như *The AB Guide to Music Theory*) chỉ là nguồn phụ: agent không đọc được sách in, nên nhận định nào ghi nguồn sách in cũng phải có thêm một nguồn bậc 1–2 đọc được trên mạng. Thuật ngữ tiếng Việt theo `src/data/thuat-ngu.yml` (khóa ở lô D3-L5).

Hai nguồn bậc 2 mâu thuẫn nhau: ghi cả hai vào hồ sơ, viết trên trang theo nguồn gần bản gốc hơn hoặc viết chung lại ("khoảng 1810"), ghi lý do.

### Nguồn và cách mở

Ghi từ đợt 2, để lô sau khỏi mò lại. Thấy cách mới thì thêm vào đây.

| Nguồn | Cách đọc được |
|---|---|
| Open Music Theory | Từng chương ở `https://viva.pressbooks.pub/openmusictheory/chapter/<tên>/`; mục lục ở trang đầu. Công cụ đọc web hay bị trả 403: mở bằng User-Agent của trình duyệt phổ thông, hay đọc bản lưu `web.archive.org/web/2026/<link>`. Hồ sơ vẫn ghi link gốc |
| IMSLP | Trang tác phẩm và trang `Category:<Họ>, <Tên>` mở được; cuối trang có thể loại "People from the X era" (thời kỳ). File PDF trên IMSLP bị chặn bot, và trang tải có bước chờ: không vòng qua bước ấy; lấy bản nhạc ở Mutopia, Wikimedia Commons hay Internet Archive |
| Internet Archive | Bản scan sách cũ (như Hanon, G. Schirmer 1928) tải được dạng PDF từ `archive.org/download/<mã>/…`. Ghi lần in và số trang |
| Britannica, ISO, Carleton | Cloudflare chặn công cụ: dùng nguồn khác cùng bậc, hay bản lưu Wayback Machine |
| Library of Congress | Trang HTML trả 403. Bản `.json` đọc được: `https://id.loc.gov/authorities/names/<mã>.json` |
| GND (thư viện Đức) | d-nb.info và lobid.org hay chặn: đọc qua `https://www.deutsche-biographie.de/pnd<mã GND>.html` |
| BnF | `https://data.bnf.fr/…` mở được; năm sinh, mất ở tiêu đề bản ghi. Người còn sống thường không ghi năm |
| VIAF | Hay trả 403: dùng LoC, BnF, GND thay |
| ABRSM | Trang HTML trả 403. PDF đề cương mở được ở `abrsm.org/sites/default/files/…`. Đề cương cũ (trước 2021) lấy qua Wayback Machine, như `web.archive.org/web/2020/https://us.abrsm.org/media/…`. Danh sách bằng ARSM là một PDF riêng |
| Henle | Trang sản phẩm (`henle.de/en/…/HN-<số>`) ghi mức khó 1–9, và có khi ghi "ABRSM: Grade X" |
| Bach-Digital | Trang web chặn bot. Dùng IMSLP, Henle, hay API của Bach-Digital nếu mở được |
| Köchel online, Beethoven-Haus | Trang tác phẩm mở được |
| PubMed | Trang web chặn bot: đọc bản ghi qua NCBI E-utilities, dẫn link PubMed |
| Nhạc sĩ Việt Nam | `hoinhacsi.vn` (Hội Nhạc sĩ Việt Nam); báo chính thức (Nhân Dân) khi không có nguồn tốt hơn, ghi rõ loại nguồn. Vài trang cơ quan lỗi chứng chỉ |

- Hết lượt tìm kiếm của công cụ (WebSearch) thì tìm tạm qua `https://html.duckduckgo.com/html/?q=<từ khóa>`; vẫn chỉ ghi vào hồ sơ trang đã mở, không ghi trang kết quả tìm kiếm.
- Trang dài (IMSLP, đề cương): bản tóm tắt của công cụ đọc web có khi sai hay thiếu. Chỗ quan trọng thì đọc chữ thật của trang, ví dụ `curl -sL <link> | sed 's/<[^>]*>//g' | grep -i …`, hay đọc PDF bằng thư viện.
- **Không đưa email hay thông tin cá nhân của chủ repo vào yêu cầu gửi ra ngoài** (header User-Agent, tham số, nội dung). Dịch vụ nào đòi thông tin liên hệ thì dùng `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`, hay bỏ dịch vụ ấy.

## 3. Kiểm định: mức theo tầng

Mức kiểm theo tầng của trang (`tang` trong `src/data/trang.yml`), chủ repo chọn ngày 24/10/2026:

| Tầng | Lượt 1 | Lượt 2 | Thêm |
|---|---|---|---|
| Lõi, Tác phẩm; bản ghi dữ liệu | agent làm lô, mọi nhận định có nguồn | agent khác, độc lập, mọi nhận định cần nguồn; lời khuyên tập chỉ mẫu 3 câu mỗi trang hay bản ghi (mẫu có câu sai thì kiểm hết); câu về chính site không qua lượt 2 | review kiểm câu về chính site |
| Tham chiếu có hạn | như lõi | như lõi | hồ sơ ghi ngày kiểm; `trang.yml` ghi ngày rà lại (`ra_lai`); đến hạn thì rà lại, mỗi lần là một lần kiểm định mới |
| Đọc thêm (ngoại vi) | như lõi | agent khác kiểm mẫu: khoảng 5 nhận định mỗi trang, script chọn ngẫu nhiên | |
| Khung và công cụ | không có nhận định: danh sách và con số sinh từ dữ liệu, kiểm thử tự động | | hồ sơ không có nhận định |

1. **Lượt 1 (agent A):** tách trang thành danh sách nhận định và danh sách khuông nhạc; kiểm từng mục; ghi nguồn và kết quả vào hồ sơ; sửa trang nếu sai (mỗi chỗ sửa có nguồn).
2. **Lượt 2 (agent B, độc lập):** nhận danh sách nhận định do `node tools/khoa.mjs xuat` tách ra (bỏ câu về chính site; lời khuyên tập và trang Đọc thêm: chỉ mẫu ngẫu nhiên), không kèm nguồn và kết luận của lượt 1. Không dùng chung trang nguồn đã tải với lượt 1, để giữ độc lập; tự tìm nguồn và cho kết quả. Sonnet đủ cho việc đối chiếu; chỗ khó (nguồn mâu thuẫn, nhận định cần đọc bản nhạc) dùng Opus.
3. **Review** (mặc định Claude; không phải người đã làm lượt 1 hay lượt 2): mọi nhận định hai lượt cho kết quả khác nhau, mọi chỗ đã sửa, mọi khuông nhạc ví dụ soạn riêng, và mọi câu về chính site (kiểm trên trang, thành phần, dữ liệu, rồi ghi `review`). **Soát nhãn:** câu `ve-site` thật sự chỉ nói về site, không chứa điều cần nguồn ngoài; câu `khuyen-tap` không chứa điều về sức khỏe hay sự kiện cần nguồn. Nhãn sai thì đổi loại và đưa câu ấy vào lượt 2 (`node tools/khoa.mjs xuat … --con-lai`).
4. **Bạn đọc tóm tắt và kiểm mẫu:** đọc bản tóm tắt hồ sơ trong báo cáo của lô, xem ngẫu nhiên khoảng 5 nhận định mỗi lô (`node tools/khoa.mjs xuat <lô> --mau 5`), ghi kết quả vào hồ sơ. Mục đích là biết có tin được các lượt agent không; mẫu sai thì kiểm lại cả lô. Bạn không kiểm tay mọi nhận định: hơn 200 trang thì bạn thành chỗ nghẽn.

Trang Lõi không giữ chi tiết mau cũ (tên ứng dụng, giá, thiết bị, link bản thu, sự kiện): lượt 1 viết lại câu ấy cho bền, hay chuyển sang trang tham chiếu có hạn và link tới đó (chủ repo chọn ngày 24/10/2026; danh sách câu đã thấy: `plans/lam-lai/bao-cao/d2-bang-tang.md`, mục 4 của phần phân tích). Trang Đọc thêm mà mẫu lượt 2 có nhận định sai thì lượt 2 kiểm cả trang.

Một trang chỉ được khóa khi mọi nhận định có kết quả `dung`, `da-sua` hoặc `da-bo`, đã qua đủ lượt theo tầng (trang Đọc thêm: lượt 2 đủ mẫu), và không còn chỗ hai lượt khác nhau chưa giải quyết.

## 4. Khuông nhạc

| Loại khối | Kiểm thế nào |
|---|---|
| Trích đoạn tác phẩm thật | Đối chiếu từng nốt với ấn bản ghi trên trang (công cụ đã dùng ở v12–v15: `_imslp/_scripts/abc/oz_tools_local/lyrel.py`, `_imslp/_scripts/abc/ozchk/` với file `.ly` của Mutopia; `_imslp/` chỉ có trên máy chủ repo, không trong git). Ghi ấn bản, số ô, công cụ, kết quả. |
| Ví dụ soạn cho trang (nhạc lý, kỹ thuật, bài tập chuẩn bị) | Minh họa đúng điều trang nói: giọng, hóa biểu, hợp âm, quãng, tiết tấu; số ngón chơi được; độ khó hợp chặng của trang. |
| Mọi khối | Tự động: kiểm thử khuông nhạc của site mới (không cảnh báo của abcjs, đủ phách mỗi ô; thay `abc_warn.mjs`, `abc_bars.py` của site cũ). |

## 5. Hồ sơ

Mỗi trang một file: `kiem-dinh/<đường dẫn trong src/content/docs/, bỏ .md>.yml`, ví dụ `kiem-dinh/nhac-ly/10-hop-am-ba.yml`. Bản ghi dữ liệu: `kiem-dinh/du-lieu/<tên file dữ liệu>/<id>.yml`, ví dụ `kiem-dinh/du-lieu/tac-pham/fur-elise.yml`, cùng cấu trúc, `trang` thay bằng `ban_ghi`.

```yaml
trang: src/content/docs/nhac-ly/10-hop-am-ba.md
nguon_cu: ../opus-zero/docs/nhac-ly/10-hop-am-ba.md   # trang cũ đã chuyển sang (nếu có)
tang: loi
lan:                       # mỗi lần kiểm định một mục, lần mới thêm vào cuối
  - so: 1
    ngay: 2026-11-02
    nhanh: moi/d3-l2
    ma_bam: sha256:3f2a...  # mã băm của trang lúc khóa (node tools/khoa.mjs khoa ghi)
    nguoi: {luot_1: agent, luot_2: agent, review: Claude, kiem_mau: "bạn, 3/31 nhận định"}
nguon:
  - id: omt-triads
    bac: 2
    ten: "Open Music Theory, Triads"
    link: https://viva.pressbooks.pub/openmusictheory/
nhan_dinh:
  - id: n1
    cau: "Hợp âm ba gồm ba nốt xếp chồng theo quãng ba: nốt gốc, nốt quãng ba, nốt quãng năm."
    loai: dinh-nghia
    nguon: [omt-triads]
    luot_2: dung
    ket_qua: dung
  - id: n7
    cau: "Hợp âm ba giảm có hai quãng ba thứ."
    loai: dinh-nghia
    nguon: [omt-triads]
    luot_2: dung
    ket_qua: da-sua
    ghi_chu: "Trang cũ ghi 'một quãng ba thứ và một quãng ba trưởng'; đã sửa."
khuong_nhac:
  - khoi: 1                  # thứ tự khối ```abc trong trang
    loai: vi-du-soan
    kiem: [cu-phap, giong, hop-am, so-ngon]
    ket_qua: dung
```

Giá trị `ket_qua`: `dung`, `da-sua` (kèm `ghi_chu`), `da-bo` (đã bỏ câu khỏi trang, kèm `ghi_chu`), `khong-can-nguon` (chỉ cho `khuyen-tap`).

Kết quả lượt 2 vào hồ sơ bằng `node tools/khoa.mjs nhap <file lượt 2>`, không chép tay. Mỗi nhận định có thêm `luot_2`, `luot_2_nguon` (link lượt 2 đã mở) và `luot_2_ghi_chu` (câu đúng, ghi chú). Lệnh in các nhận định cần review: hai lượt khác nhau, hay lượt 1 đã sửa, đã bỏ, chưa có kết quả. Hồ sơ bản ghi dữ liệu nên ghi thêm `truong` ở mỗi nhận định (các trường mà nhận định nói tới), để biết khóa trường nào.

Link trong `nguon` phải là trang đã mở và đọc, không phải kết quả tìm kiếm. Sách in ghi tên sách, lần in, số trang.

## 6. Khóa

- `kiem-dinh/khoa.json` ánh xạ đường dẫn trang → mã băm SHA-256 của nguồn Markdown lúc khóa.
- Mã băm tính trên cả file, kể cả frontmatter, sau khi chuẩn hóa: xuống dòng kiểu `\n`, bỏ khoảng trắng cuối dòng, đúng một `\n` ở cuối file. Vì khoảng trắng cuối dòng không vào mã băm, trang không được có khoảng trắng cuối dòng (ngắt dòng cứng viết `<br>`); kiểm thử chặn. Site mới không có vùng do công cụ sinh trong trang (hình, hộp thông tin, danh sách đều sinh lúc build từ dữ liệu), và trạng thái kiểm định không ghi vào trang, nên khóa xong thì file không đổi nữa. Chỉ thị như `::khoi-nghe` giữ nguyên trong mã băm vì chính chúng không đổi khi dữ liệu đổi.
- Bản build thật chỉ đưa trang có trong `khoa.json`; trang có trong `khoa.json` mà mã băm khác thì build hỏng, thông báo kèm cách mở khóa (`plans/lam-lai/cong-nghe.md` mục 7).
- Bản ghi trong `src/data/` khóa theo từng bản ghi: cả bản ghi, hay từng phần. Mã băm tính trên JSON của phần được khóa, tên trường xếp theo chữ cái. Thêm bản ghi mới được; sửa hay xóa phần đã khóa thì phải mở khóa.
- Khóa từng phần chỉ gồm các trường đã kiểm định, mã băm tính trên các trường ấy (công cụ khóa của D1.6: khóa `du-lieu/<bộ>/<id>#<trường>,<trường>`; hồ sơ vẫn một file cho mỗi bản ghi). Ví dụ với bản ghi tác phẩm: đợt 2 khóa `ten`, `tac_gia`, `danh_muc`, `chang`, `loai`, `goi_y` (và `grade` nếu trang chặng hiện Grade); đợt 6 khóa phần còn lại, khi đó cả bản ghi đã khóa. Trường chưa khóa sửa tự do, nhưng trang chỉ được hiện trường đã khóa (`plans/lam-lai/README.md`, Quy tắc chung).
- Thành phần, plugin, JavaScript, CSS và mẫu trang không nằm trong khóa; chúng được giữ đúng bằng kiểm thử tự động. Phần do dữ liệu sinh ra trong trang (danh sách, con số) đổi khi thêm tác phẩm mà không phá khóa, và vẫn đúng vì mọi trường trang hiện ra đã được kiểm định và khóa.

## 7. Mở khóa

Chỉ trong ba trường hợp:

1. Có lỗi được báo (issue, góp ý, phát hiện khi review trang khác).
2. Nguồn thay đổi: chương trình thi mới, ấn bản mới đáng tin hơn, link nguồn chết.
3. Đợt mở rộng lõi có trong kế hoạch.

Cách làm: `node tools/khoa.mjs mo <trang> --ly-do "..."` (ghi lý do vào hồ sơ, gỡ dòng trong `khoa.json`, thêm một mục mới vào `lan`); sửa; kiểm định **chỉ những nhận định bị chạm** cộng các nhận định cùng đoạn; điền mục mới trong `lan`; khóa lại (`node tools/khoa.mjs khoa <trang>`). Commit mở khóa và commit khóa lại nằm cùng một nhánh (`mo/<tên ngắn>`), review như một việc lẻ; trên `main` trang luôn ở trạng thái khóa. Trang lõi bị sửa một định nghĩa hay một quy tắc thì liệt kê các trang link tới đoạn đó (kiểm thử anchor có sẵn giúp tìm) và ghi trong báo cáo trang nào cần sửa theo.

Bản ghi khóa từng phần thì mở đúng khóa ấy (`du-lieu/<bộ>/<id>#<trường>,…`); sửa trường chưa khóa thì không cần mở khóa.

## 8. Lời giao việc kiểm định mẫu

Lời giao việc mẫu nằm ở `plans/lam-lai/loi-giao/`:
- lượt 1 nằm trong lời giao lô;
- lượt 2 cho trang và cho dữ liệu;
- lượt 1 cho dữ liệu;
- review mã.

Dùng lại, chỉ đổi phần trong `<>`.

> Bạn **mở khóa và sửa** trang `<đường dẫn>` của repo opus vì `<lý do: lỗi được báo, nguồn đổi>`. Đọc `AGENTS.md` và `plans/ben-vung/chuan-kiem-dinh.md` mục 7. Tạo nhánh `mo/<tên ngắn>` từ `main`. Chạy `node tools/khoa.mjs mo <trang> --ly-do "..."`, sửa, kiểm định lại những nhận định bị chạm và các nhận định cùng đoạn, điền mục mới trong `lan` của hồ sơ, khóa lại. Liệt kê trong báo cáo các trang link tới đoạn đã sửa. Khi xong: `npm run build` và `npm test` đạt; commit; báo cáo `plans/ben-vung/bao-cao/mo-<tên ngắn>.md`. Không push.
