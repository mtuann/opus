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

Câu viết chung chung đến mức không kiểm được ("bài này rất hay") thì viết lại cho cụ thể hoặc bỏ.

## 2. Thứ bậc nguồn

1. **Bản nhạc:** bản in đã hết bảo hộ trên IMSLP; bản gõ lại có giấy phép mở trên Mutopia. Dùng cho cấu trúc, số ô, trích đoạn, giọng.
2. **Tài liệu chuẩn:** giáo trình nhạc lý: nguồn chính là *Open Music Theory* (https://viva.pressbooks.pub/openmusictheory/, chọn ngày 24/10/2026), dẫn link tới đúng mục; khi các sách gọi tên hay định nghĩa khác nhau thì theo nguồn này. Nhận định về Grade đối chiếu với đề cương chính thức của ABRSM (đúng kỳ); chương trình thi Trinity (đúng kỳ); trang henle.de của đúng tác phẩm; trang tác phẩm trên IMSLP cho năm và số danh mục; danh mục tác phẩm của nhà soạn nhạc; trang của nhà xuất bản, hãng đĩa, thư viện.
3. **Nguồn phổ thông** (Wikipedia, blog, diễn đàn): chỉ để tìm nguồn bậc 1–2. Không dùng làm nguồn duy nhất cho nhận định nào.

Sách in (như *The AB Guide to Music Theory*) chỉ là nguồn phụ: agent không đọc được sách in, nên nhận định nào ghi nguồn sách in cũng phải có thêm một nguồn bậc 1–2 đọc được trên mạng. Thuật ngữ tiếng Việt theo `src/data/thuat-ngu.yml` (khóa ở lô D3-L5).

Hai nguồn bậc 2 mâu thuẫn nhau: ghi cả hai vào hồ sơ, viết trên trang theo nguồn gần bản gốc hơn hoặc viết chung lại ("khoảng 1810"), ghi lý do.

## 3. Kiểm định: mức theo tầng

Mức kiểm theo tầng của trang (`tang` trong `src/data/trang.yml`), chủ repo chọn ngày 24/10/2026:

| Tầng | Lượt 1 | Lượt 2 | Thêm |
|---|---|---|---|
| Lõi, Tác phẩm; bản ghi dữ liệu | agent làm lô, mọi nhận định có nguồn | agent khác, độc lập, mọi nhận định | |
| Tham chiếu có hạn | như lõi | như lõi | hồ sơ ghi ngày kiểm; `trang.yml` ghi ngày rà lại (`ra_lai`); đến hạn thì rà lại, mỗi lần là một lần kiểm định mới |
| Đọc thêm (ngoại vi) | như lõi | agent khác kiểm mẫu: khoảng 5 nhận định mỗi trang, script chọn ngẫu nhiên | |
| Khung và công cụ | không có nhận định: danh sách và con số sinh từ dữ liệu, kiểm thử tự động | | hồ sơ không có nhận định |

1. **Lượt 1 (agent A):** tách trang thành danh sách nhận định và danh sách khuông nhạc; kiểm từng mục; ghi nguồn và kết quả vào hồ sơ; sửa trang nếu sai (mỗi chỗ sửa có nguồn).
2. **Lượt 2 (agent B, độc lập):** nhận danh sách nhận định đã tách (trang Đọc thêm: chỉ mẫu ngẫu nhiên), không kèm nguồn và kết luận của lượt 1; tự tìm nguồn và cho kết quả. Sonnet đủ cho việc đối chiếu; chỗ khó (nguồn mâu thuẫn, nhận định cần đọc bản nhạc) dùng Opus.
3. **Review** (mặc định Claude; không phải người đã làm lượt 1 hay lượt 2): mọi nhận định hai lượt cho kết quả khác nhau, mọi chỗ đã sửa, mọi khuông nhạc ví dụ soạn riêng.
4. **Bạn đọc tóm tắt và kiểm mẫu:** đọc bản tóm tắt hồ sơ trong báo cáo của lô, xem ngẫu nhiên khoảng 5 nhận định mỗi lô (`node tools/khoa.mjs xuat <lô> --mau 5`), ghi kết quả vào hồ sơ. Mục đích là biết có tin được các lượt agent không; mẫu sai thì kiểm lại cả lô. Bạn không kiểm tay mọi nhận định: hơn 200 trang thì bạn thành chỗ nghẽn.

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

Lượt 1 nằm trong lời giao lô ở `plans/lam-lai/README.md` (mục "Lời giao việc mẫu").

> Bạn làm **kiểm định lượt 2** cho lô **D<đợt>-L<lô>** của repo opus. Chỉ đọc `plans/ben-vung/chuan-kiem-dinh.md` và file `plans/lam-lai/bao-cao/d<đợt>-l<lô>-nhan-dinh.yml` (danh sách nhận định, không có nguồn và kết quả). Không mở hồ sơ trong `kiem-dinh/` và báo cáo của lượt 1. Với mỗi nhận định, tự tìm nguồn theo mục 2, ghi `dung`, `sai` (kèm nguồn và câu đúng) hoặc `khong-chac`, kèm link đã mở. Ghi kết quả vào `plans/lam-lai/bao-cao/d<đợt>-l<lô>-luot-2.yml`. Không sửa trang. Không push.

> Bạn **mở khóa và sửa** trang `<đường dẫn>` của repo opus vì `<lý do: lỗi được báo, nguồn đổi>`. Đọc `AGENTS.md` và `plans/ben-vung/chuan-kiem-dinh.md` mục 7. Tạo nhánh `mo/<tên ngắn>` từ `main`. Chạy `node tools/khoa.mjs mo <trang> --ly-do "..."`, sửa, kiểm định lại những nhận định bị chạm và các nhận định cùng đoạn, điền mục mới trong `lan` của hồ sơ, khóa lại. Liệt kê trong báo cáo các trang link tới đoạn đã sửa. Khi xong: `npm run build` và `npm test` đạt; commit; báo cáo `plans/ben-vung/bao-cao/mo-<tên ngắn>.md`. Không push.
