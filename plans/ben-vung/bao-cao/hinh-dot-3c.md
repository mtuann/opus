# Đợt hình 3c: sơ đồ đoạn cho 13 hướng dẫn nghe, bản đồ năm đầu

Nhánh `mo/hinh-dot-3c` từ `main` (`bd1f51f`), Claude Opus 5.5, 06–07/11/2026. Theo `plans/ben-vung/de-xuat-hinh.md`, đề xuất 17 và 20. Thủ tục hình rút gọn (`plans/ben-vung/chuan-kiem-dinh.md` mục 7): mọi hình chỉ vẽ lại chữ và bảng của trang.

Hai commit: mã (hình tĩnh `nam-dau`, CSS, kiểm thử, `trang-mau.mjs`, `AGENTS.md`); trang, dữ liệu, hồ sơ và báo cáo này.

## Mã (review riêng, mức "Vừa")

Không có module mới, không đụng `src/plugins/thanh-phan.mjs` hay `src/scripts/`: sơ đồ đoạn dùng lại `::hinh-cau-truc`, bản đồ năm đầu là hình tĩnh (`::hinh` tự dùng qua `hinhTinh`).

| File | Đổi |
|---|---|
| `src/components/hinh/nam-dau.html` (mới) | HTML và CSS: chú giải ba làn và mốc; 4 quý (tên là link tới mục quý), mỗi quý 3 tháng (tên tháng là link tới mục tháng, id như `id-cu.mjs`), mỗi tháng ba dòng theo thứ tự ba cột bảng tháng (Bên đàn, Đọc nhạc và nhạc lý, Tai và nghe), tên làn trong `sr-only`; mốc ★ ở tháng 4, 5, 6, 12. Sinh một lần bằng script ở scratchpad (tiêu đề đọc từ trang), sau đó sửa thẳng file. |
| `src/styles/thanh-phan.css` | Khối `.oz-nam-dau`: màu làn bằng `--oz-h-xanh`, `--oz-h-luc`, `--oz-h-vang`, mốc `--oz-h-do` (đã có ba chế độ), viền trái 4 px và nền pha 14%; ba tháng cùng hàng, một cột khi hình hẹp hơn 30rem (container query: ở 1280 px khung nội dung hẹp hơn 40rem nên media query theo màn hình không hợp); thêm vào nhóm `print-color-adjust: exact` khi in. |
| `tests/nam-dau.test.mjs` (mới) | nam-dau: 4 quý, 12 tháng đúng chữ, thứ tự và id các tiêu đề của trang; mỗi tháng đúng ba làn theo thứ tự; mốc ở tháng 4, 5, 6, 12. Sơ đồ nghe: mỗi bản ghi có chú thích "mỗi ô một dòng của bảng X" thì số ô bằng số dòng bảng X của trang, và trang có `## Sơ đồ cấu trúc` + `::hinh-cau-truc`. |
| `tests/trinh-duyet/kiem-nam-dau.mjs` (mới) | Ba trình duyệt × 360/768/1280: không tràn ngang; mọi phần tử của bản đồ trong hình, dòng trong ô tháng, không đè nhau; ba tháng cùng hàng khi hình rộng hơn 30rem, một cột khi hẹp; link tháng tới mục có thật; ô sơ đồ đoạn trong hình, chữ không tràn khỏi ô, ô không đè nhau. Lần chạy đầu bắt lỗi thật: ở 1280 px khung nội dung chỉ khoảng 37rem nên ngưỡng 40rem (media query) không đúng; đổi sang container query. |
| `tests/danh-muc.test.mjs` | Phép "danh mục ở hai trang mục lục liệt kê đúng các trang có trong bản build": khi trang mục lục đã khóa, bỏ trang của bản ghi chưa khóa trường nào (đúng luật `coTruongDaKhoa` của trang đã khóa). Cần vì đợt này mở khóa cả 13 bản ghi (xem dưới). |
| `tools/trang-mau.mjs` | Loại khối "bản đồ năm đầu" (`class="oz-nam-dau"`). |
| `AGENTS.md` | Một mục ngắn "Đợt hình 3c". |

Sách in: hình tĩnh giữ nguyên trong sách (`oz-figure`); `::hinh-cau-truc` cũng vậy.

## Trang và dữ liệu

### Đề xuất 17: sơ đồ đoạn cho hướng dẫn nghe

Liệt kê: 15 trang `nghe-nhac/` có bản ghi mà bản ghi không có `hinh.nghe` và trang không có `::hinh-cau-truc`. Làm 13; bỏ 2:

- `nghe-nhac/ravel-bolero`: đã có sơ đồ (`::hinh{ten="bolero"}` ở mục "Sơ đồ cấu trúc"), không cần.
- `nghe-nhac/beethoven-moonlight`: bản ghi `beethoven-anh-trang` dùng chung với bài học đã khóa `piano/tac-pham/beethoven-anh-trang`; bản ghi khóa cả bản ghi, nên thêm `hinh.nghe` phải mở cả bản ghi, và khi ấy bài học đã khóa đọc bản ghi qua `chiDaKhoa` thì build hỏng. Trang nói đủ để vẽ (dòng bảng có số ô nhịp: 1–4, 5, 23–27, 28–41, 42, 60–69). Muốn làm thì phải mở cả bài học (hồ sơ thêm một lần), hay để người gom làm khi khóa lại: thêm `hinh.nghe` sáu ô theo bảng, độ dài theo số ô nhịp.

13 trang làm (mỗi trang: `khoa.mjs mo` trang và bản ghi; thêm `hinh.nghe` vào bản ghi, ghi bằng `replace_field` của `tools/audio/page.py` để đúng định dạng mà kiểm thử Python đòi):

| Trang | Ô | Vẽ lại |
|---|---|---|
| `bach-air` | 2 (độ dài 6 và 12 theo số ô nhịp) | đoạn "Điều cần biết" (hai nửa, mỗi nửa nhắc lại) và dòng 2–4 bảng Theo dõi |
| `bach-cello-1` | 6 | bảng Theo dõi khi nghe |
| `gershwin-rhapsody` | 7 | bảng Theo dõi khi nghe |
| `grieg-buoi-sang` | 5 | bảng Sơ đồ cấu trúc (hình đặt ngay trên bảng; bảng giữ) |
| `handel-hallelujah` | 6 | bảng Sơ đồ cấu trúc (như trên) |
| `mozart-eine-kleine` | 8 | bảng Theo dõi khi nghe; chú thích "trình bày – phát triển – tái hiện" theo danh sách của trang |
| `mozart-nu-hoang-bong-dem` | 5 | bảng Theo dõi khi nghe |
| `part-spiegel` | 5 | bảng Theo dõi khi nghe |
| `puccini-nessun-dorma` | 4 | bảng Sơ đồ cấu trúc (như trên) |
| `schubert-erlkonig` | 9 | bảng Theo dõi khi nghe |
| `tchaikovsky-1812` | 7 | bảng Theo dõi khi nghe |
| `tchaikovsky-ho-thien-nga` | 5 | bảng Theo dõi khi nghe |
| `vivaldi-mua-dong` | 6 | bảng Theo dõi khi nghe; ghi chú màu "Xanh: cả dàn nhạc; vàng: violin độc tấu" (theo cột Sự kiện) |

Trừ `bach-air`, độ rộng các ô bằng nhau, chú thích ghi "độ rộng các ô chỉ minh họa" (trang không cho thời lượng từng phần). Màu ô là cách vẽ. 10 trang chưa có mục "Sơ đồ cấu trúc": thêm tiêu đề theo thứ tự mẫu hướng dẫn nghe, ngay trước "Nghe kèm bản thu"; `doi_chu` ghi (tiêu đề, id `so-o-cau-truc`, chữ trong sơ đồ).

Hồ sơ trang: lần mới (`ngay`, `luot_1`), một nhận định `ve-site` mỗi trang (kể từng ô và dòng bảng tương ứng; `review` để trống), `doi_chu`. Hồ sơ bản ghi: lần mới (`ngay`, `luot_1`), một nhận định `cau-truc` (`truong: [hinh]`), nguồn là nguồn của các nhận định tương ứng trong hồ sơ trang (chép sang khi bản ghi chưa có).

### Đề xuất 20: bản đồ năm đầu

`bat-dau/lo-trinh-choi`: `::hinh{ten="nam-dau"}` ngay sau hộp "Một buổi 30 phút trong năm đầu", trước "Trước khi bắt đầu". Bảng tháng giữ nguyên (hình là bản rút gọn). Hồ sơ: n43 (`ve-site`), lần mới (`ngay`, `luot_1`). Hình có `data-sinh`, không cần `doi_chu`.

Chỗ cân nhắc để giữ "chỉ vẽ lại": chữ trong ô là rút gọn chữ ô bảng (không thêm bài, tên, thời hạn); mốc chỉ lấy câu trang đã viết (bài 8 "bàn đạp lần đầu"; danh sách việc tháng 5, 6, 12; "Cuối tháng 6 là cuối chặng đầu"; "Cuối năm đầu … khoảng chặng 2"). Đề xuất có "10 bài đầu" là một mốc: đặt ở tháng 5 ("Xong cả 10 bài"), đúng danh sách việc.

Không có câu nào cần thủ tục đủ.

## Kiểm

- `npm run build:xem`: không cảnh báo `[opus]`; `npm test` 313 đạt, 2 bỏ qua, 0 hỏng.
- `npm run build` (bản thật, 229 trang, 14 trang đang mở không có): `npm test` 313 đạt, 2 bỏ qua.
- `OPUS_TRANG="<13 trang nghe-nhac>,bat-dau/lo-trinh-choi/" npm run test:trinh-duyet`: 947 phép thử, 946 đạt, 1 bỏ qua, 0 hỏng (ba trình duyệt; axe, hiển thị 360/768/1280, sách in). Riêng `kiem-nam-dau.mjs`: 9/9.
- Không chạy Lighthouse (không có script mới; CSS thêm nhỏ, hình tĩnh không JavaScript).
- Cuối cùng build lại bản xem.

## Ảnh chụp

Không commit, ở `/private/tmp/claude-501/-Users-mitu-Desktop-work-projects-opus/7f80c6a8-7bce-46e5-8918-954e4e4384ee/scratchpad/hinh3c-anh/` (độ phân giải gấp đôi): `<trang>-360-toi.png` và `<trang>-1280.png` cho 14 trang (`lo-trinh-choi-*` là bản đồ năm đầu). Log: `…/scratchpad/hinh3c-trinh-duyet.log`, `hinh3c-test.log`, `hinh3c-test-that.log`.

## Việc cho người gom

- Review mã (mức "Vừa"), gồm sửa `tests/danh-muc.test.mjs` (kiểm thử đổi để khớp luật `coTruongDaKhoa` khi bản ghi đang mở).
- Người soát (không phải người vẽ): đối chiếu 14 hình với trang trên bản xem; ghi `review` cho nhận định ve-site: bach-air n27, bach-cello-1 n33, gershwin-rhapsody n35, grieg-buoi-sang n45, handel-hallelujah n36, mozart-eine-kleine n32, mozart-nu-hoang-bong-dem n23, part-spiegel n28, puccini-nessun-dorma n39, schubert-erlkonig n33, tchaikovsky-1812 n41, tchaikovsky-ho-thien-nga n25, vivaldi-mua-dong n34, lo-trinh-choi n43; `nguoi.review`, `nguoi.kiem_mau` cùng tên, `nguoi.luot_2`: "không cần (câu ve-site, thủ tục hình)".
- **Hồ sơ bản ghi (13)**: `khoa.mjs` không cho câu `ve-site` ở hồ sơ bản ghi ("mọi điều trong dữ liệu cần nguồn"), nên nhận định `hinh` của bản ghi là `cau-truc` có nguồn và `khoa` đòi `luot_2`. Hai cách: một người làm lượt 2 nhanh (đối chiếu ô với nhận định đã kiểm của hồ sơ trang, nguồn đã ghi) rồi điền `luot_2` từng câu và `nguoi`; hay chủ repo chọn cho thủ tục hình áp cả `hinh` của bản ghi (khi đó sửa `khoa.mjs`). Nhận định: bach-air n6, bach-cello-1 n6, gershwin-rhapsody n10, grieg-buoi-sang n6, handel-hallelujah n6, mozart-eine-kleine n9, mozart-nu-hoang-bong-dem n6, part-spiegel n5, puccini-nessun-dorma n6, schubert-erlkonig n6, tchaikovsky-1812 n6, tchaikovsky-ho-thien-nga n6, vivaldi-mua-dong n6.
- **Khóa cả bản ghi**: lời giao định mở đúng trường (`…#hinh`), nhưng 13 bản ghi khóa cả bản ghi và `khoa.mjs mo` chỉ mở được đúng khóa đang có, nên đã mở cả bản ghi. Trong lúc mở, ở bản xem `nghe-nhac/index` (đã khóa) không liệt kê 13 trang này; bản thật không đổi (13 trang chưa khóa nên không có). Khóa lại: `khoa.mjs khoa du-lieu/tac-pham/<slug>` (cả bản ghi) cùng lúc với trang.
- Ánh trăng (`nghe-nhac/beethoven-moonlight`): còn chờ, xem trên.
- Xem ảnh chụp, rồi khóa 14 trang và 13 bản ghi.
- Gộp với hai nhánh song song: `src/styles/thanh-phan.css` (khối mới ngay sau `.oz-galant-giu small`; nhóm `print-color-adjust`), `tools/trang-mau.mjs` (`KHOI`, sau "thẻ mẫu galant"), `AGENTS.md` (mục ngay sau "Đợt hình 2c") có thể xung đột vị trí; nội dung độc lập.
