# D8, nhánh gom: lượt 2, review (chờ chủ repo kiểm mẫu và khóa)

Nhánh `moi/d8-gom` từ `main`, 05/11/2026. Gom 20 trang của đợt 8: D8-L1 (10 trang tham chiếu có hạn), D8-L2 (8 trang Nhạc cụ, Đọc thêm), D8-L3 (2 trang Đọc thêm). Chủ repo giao agent làm theo đề xuất, review sau (05/11/2026). Người gom: Claude Opus 5.5.

## Lượt 2

Danh sách xuất từ hồ sơ (`xuat D8-L1`, `D8-L2`, `D8-L3`; gộp ở `d8-gom/trang.yml`): 392 nhận định. Trang tham chiếu có hạn: mọi nhận định trừ `ve-site` (lời khuyên tập lấy mẫu 3 câu). Trang Đọc thêm: 5 câu mẫu mỗi trang (`d8-chuan-bi.md`, "Đã chọn" 1). `nhac-cu/index` (tầng khung, có chữ viết tay về âm nhạc): 23 câu. Ba phần, mỗi phần một agent Claude Sonnet 5.5, độc lập với lượt 1:

| Phần | Trang | Số | dung | sai | khong-chac |
|---|---|---|---|---|---|
| `trang-1.yml` | hỏi đáp, ứng dụng, Âm nhạc hôm nay, Việt Nam, nghe mù, chọn đàn | 134 | 109 | 0 | 25 |
| `trang-2.yml` | nghệ sĩ piano, Tác phẩm theo cấp độ | 128 | 109 | 0 | 19 |
| `trang-3.yml` | thầy và thi, tài nguyên, 10 trang Đọc thêm | 130 | 101 | 0 | 29 |

Đã `nhap`; danh sách cần review in ở `can-review-{1,2,3}.txt`.

## Review

Ba người review Claude Opus 5.5, không làm lượt 1, lượt 2 của trang mình review; chi tiết từng câu ở các file trong `d8-gom/`:

- `review-tham-chieu.md` (9 trang D8-L1, trừ Tác phẩm theo cấp độ): 64 câu `ve-site`, 63 dung, 1 sai (`chon-dan` n15: bỏ "hoặc Bluetooth MIDI", trang Kết nối MIDI chỉ hướng dẫn cáp USB). `hoi-dap`: "ít nhất 9 bài đầu" sửa theo `bat-dau/lo-trinh-nghe` đã khóa (6 bài nhạc lý: 1, 4, 6, 7, 12, 13). `viet-nam`: bỏ đoạn năm nhạc sĩ chỉ có nguồn là bài người dùng tải lên. `chon-dan`: bỏ con số polyphony 128 (chỉ có nguồn cửa hàng), viết theo FAQ Kawai.
- `review-doc-them.md` (10 trang Đọc thêm): 57 câu `ve-site`, 56 dung, 1 sai (`nhac-cu/index` n30: trang guitar không có phần "vai trò"). Nguyễn Thị Nhung (sinh 16/8/1936, Hà Nội) giữ: ba nguồn lượt 1 khớp (Hội Nhạc sĩ, Dân trí, TTVH). "Liu" trong khối abc giữ: luận án Cồ Huy Hùng (2016) tr. 88–89. Bỏ `cello` n27 (không nguồn bậc 1–2).
- `review-tac-pham-theo-cap.md`: 19 câu `ve-site` đều dung. **Kiểm từng hàng** của các bảng theo chặng (100 hàng, khoảng 170 tác phẩm không có bản ghi; người gom chọn kiểm hết trước khi khóa vì trang tham chiếu kiểm như lõi): 7 nhận định `r1`–`r7` kèm khoảng 110 nguồn (IMSLP, Henle…), 34 chỗ sửa trang. Nocturne Op. 72 số 1 (không có bản ghi) giữ chặng 5, thêm "có trong danh sách Grade 8 của ABRSM 2027–2028, Henle mức 5". *Twilight*: Classic FM nói bài có trong nhạc phim, trái câu cũ: bỏ câu ấy.
- `review-nguon.md`: 39 nhận định (35 ở `piano/nghe-si`) mà cả hai lượt chỉ có Wikipedia: thêm nguồn bậc 1–2 (hãng đĩa, cuộc thi, dàn nhạc, Viện Chopin…); 17 câu viết lại cho khớp nguồn.

## Lượt 2 bổ sung

80 câu đổi chữ hay mới thêm sau review (`bo-sung.yml`, `xuat … --con-lai`). Lần đầu (Sonnet): 13 dung, 2 sai, 65 khong-chac, phần lớn vì không mở trang nguồn. 65 câu khong-chac làm lại (Opus, hai phần `bo-sung-2a.yml`, `bo-sung-2b.yml`, mở thật trang nguồn): 53 dung, 2 sai, 10 khong-chac. Đã `nhap` cả ba file.

`review-cuoi.md`: bốn câu sai sửa theo `cau_dung` của lượt 2 (`hoi-dap` n50: chế độ im lặng của iPhone chỉ tắt Web Audio; `nghe-si` n40: Polish Festival Orchestra lập 1998; `tac-pham-theo-cap` n61: *Mariage d'Amour* phần chính 3/4; `chon-dan` n5: Yamaha khoảng 14 lần mỗi giây). Mười câu khong-chac: hai câu bỏ vế không xác nhận được, sáu câu có nguồn bậc 1–2 review tự mở, hai câu dựa vào nhận định đã kiểm (`nghe-si` n3; `bat-dau/bai-0` n4 đã khóa). Quy ước: chữ mới chỉ là `cau_dung` của lượt 2 hay chỉ bỏ bớt vế lượt 2 không xác nhận thì không chạy thêm lượt 2. `nghe-si` n65, n70–n73 (không có nguồn, các review trước bỏ sót) thêm nguồn bậc 1–2, không đổi chữ.

## Trạng thái khóa

- `node tools/khoa.mjs tinh` không lỗi; `npm run build:xem` không cảnh báo `[opus]`; `npm test` 260 đạt, 1 bỏ qua.
- Đã điền `nguoi.luot_2` (và `nguoi.review`) cho 20 hồ sơ. Kiểm điều kiện khóa (gọi `loiHoSo` của `tools/khoa.mjs`, không ghi gì): cả 20 trang chỉ còn thiếu `nguoi.kiem_mau`.
- **Mẫu kiểm cho chủ repo**: 12 nhận định ở `d8-gom/kiem-mau.yml` (`xuat D8-L1 D8-L2 D8-L3 --mau 12`). Nên xem thêm:
  - `bat-dau/hoi-dap` n2: câu trùng nguyên văn `bat-dau/bai-0` n4 đã khóa (Schneider 2008); thấy chưa đủ thì sửa cả hai, bai-0 theo thủ tục mở khóa.
  - `piano/nghe-si` n28, n64: năm Michelangeli thắng Geneva (chương trình cuộc thi ghi 1939, cáo phó AP ghi 1940; theo cuộc thi). n70–n73: "một trong những sonata cuối" của Haydn và "khoảng nửa giờ" của Sonata Si thứ Liszt là suy từ nguồn (IMSLP số 62, Henle 1794; IMSLP 25–30 phút).
  - `piano/tac-pham-theo-cap` r1, r3: nhãn thời kỳ Diabelli "Thế kỷ 19, phong cách Cổ điển" (IMSLP gắn Op. 149, 151 nhãn Romantic, Op. 168 Classical).
- Khóa: `node tools/khoa.mjs khoa <trang>` cho 20 trang, sau khi điền `kiem_mau`. Khóa sau tháng 12/2026 thì đặt lại `ra_lai` 2027-01 của ba trang ABRSM (`tests/du-lieu.test.mjs` chặn); `lich-su/nhac-truyen-thong-viet-nam` có dòng "Cập nhật lần cuối: 11/2026" viết tay (trang Đọc thêm, không có dòng tự động), đổi tháng nếu khóa muộn.

## Cần chủ repo biết

- ABRSM 2027–2028 xếp vài bài cao hơn chặng của site (trang chỉ ghi chặng, không phải nhận định sai): *Toccatina* Kabalevsky Grade 4 (site chặng 3), *Wilder Reiter* Grade 3 (chặng 2), *The Little Shepherd* Grade 7 (chặng 5). Quyết ở lần rà lại tháng 1/2027.
- Khuông nhạc (`abc.js`, Web Audio) câm khi iPhone ở chế độ im lặng; sửa bằng `navigator.audioSession` là việc thành phần mức Vừa (D7-L1 đã làm cho công cụ). Trang `hoi-dap` nay nói đúng như vậy.
- Khoảng 25 thuật ngữ trang Nhạc cụ dùng chưa có bản ghi ở `thuat-ngu.yml` (`d8-l2.md`), cùng vài thuật ngữ của D8-L3 (`d8-l3.md`): thêm ở một việc dữ liệu riêng.
- `tools/chuyen/chuyen.mjs` không đặt nháy cho `description` có dấu `:` (`d8-l2.md`); sửa tay rồi. Sửa `src/scripts/*.js` mà plugin dùng lúc build thì trang không tự dựng lại (`d8-l1.md`). Hai việc mức Vừa, làm riêng.
- Kiểm thử trình duyệt chập chờn hai lần trong đợt: một phép ở trang Nghe mù (chạy lại đạt), `firefox: thu âm qua micro (giả)` (`kiem-luyen-tap-d7.mjs:189`, D8-L3). Theo dõi ở CI.
- Hai workflow hằng tuần (`ra-lai.yml`, `kiem-link.yml`) chưa chạy thật: lần đầu bấm chạy tay ở tab Actions.
