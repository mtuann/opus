# mo/tong-quan: rà các trang tổng quan (09/11/2026)

Chủ repo yêu cầu: rà toàn bộ nội dung tổng quan của site, sửa chỗ cần sửa, không động tới phần mở rộng (`ke-hoach`, `plans/ben-vung/ke-hoach-mo-rong.md`).

## Phạm vi đã rà

Trang chủ, 404, `cap-nhat`, `tai-nguyen`, `tai-lieu-tham-khao`, `blog/index`, các trang mục lục (`bat-dau`, `piano`, `piano/lo-trinh`, `piano/tac-pham`, `nhac-ly`, `luyen-tai`, `luyen-tap`, `nghe-nhac`, `hinh-thuc`, `nhan-dien`, `lich-su`, `nhac-cu`), `bat-dau/tom-tat`. Kiểm thêm bằng máy:

- mọi link nội bộ và neo `#…` trong bản build (243 trang) đều tới trang và mục có thật;
- mỗi trang mục lục link tới đủ các trang trong thư mục của mình (danh mục tác phẩm và hướng dẫn nghe sinh từ dữ liệu);
- con số trên các trang tổng quan: 34 bài học, 7 chặng, 32 bài nhạc lý, 6 bài luyện tai, quiz ở mọi bài nhạc lý, hộp "Trên phím đàn" ở bài 1–14;
- các chuỗi "Chọn bài theo mục tiêu" ở `piano/tac-pham` đi từ chặng thấp lên chặng cao theo dữ liệu đã khóa.

## Đã sửa (mở khóa, khóa lại)

| Trang | Sửa | Hồ sơ |
|---|---|---|
| `lich-su/index` | Trang vào của nhóm Nhạc cổ điển (thẻ trang chủ: "Thời kỳ, hình thức, nhà soạn nhạc") chưa link tới các mục khác của nhóm: thêm một đoạn link tới Hình thức và thể loại, Nghe để nhận diện, Nhà soạn nhạc, Nhập môn opera, Dàn nhạc giao hưởng, Nhạc cổ điển ở Việt Nam | n64 (ve-site), lần 2 |
| `nhac-cu/index` | Trang vào của nhóm Đọc thêm (thẻ trang chủ: "Nhạc cụ, nhạc truyền thống Việt Nam, nhà soạn nhạc nữ") chưa link tới hai trang Việt Nam và nhà soạn nhạc nữ: thêm một câu | n33 (ve-site), lần 2 |
| `piano/index` | "kèm bản thu gợi ý khi có" thành "và một bản thu gợi ý": cả 34 bài học đã có bản thu kiểm ở đợt 6 | n18, lần 2 |
| `bat-dau/bai-0` | Như trên | n17, lần 2 |

## Thấy nhưng không sửa lúc rà; chủ repo quyết sau (09/11/2026)

1. **Link báo lỗi và giấy phép mã nguồn trỏ repo cũ**: chủ repo chọn bỏ mọi nhắc tới Opus Zero và trỏ repo `mtuann/opus` dù repo còn riêng tư. Làm ở `mo/bo-opus-zero`: 11 trang mở khóa, sửa, khóa lại (trang chủ, 404, `tai-nguyen`, `tai-lieu-tham-khao`, `bat-dau/hoi-dap`, `ke-hoach`, `blog/index`, bốn bài blog); link MIT ở chân trang; `LICENSE-CONTENT`, `public/vendor/abcjs-LICENSE.txt` bỏ tên site cũ; kiểm thử "không link repo" thay bằng hai kiểm thử (link MIT; bản build không còn "opus-zero"/"Opus Zero", trừ `cap-nhat`). Còn lại: nhật ký phiên bản 1–15 ở `cap-nhat` (phiên khác đang sửa trang này để ghi các đợt hình; làm sau khi phiên ấy gộp, rồi bỏ ngoại lệ trong `tests/khung.test.mjs`). Khóa `localStorage` (`opus-zero:v1`…) và tên IndexedDB giữ nguyên: đổi thì mất tiến độ người học đã lưu; người đọc không thấy.
2. **Thứ tự bài học trong menu bên**: đã xếp tăng dần theo chặng, giữ thứ tự cũ trong cùng chặng (`THU_TU` ở `src/nhom.mjs`, `THU_TU_TAC_PHAM` ở `src/sach/sach.mjs`, nên sách in cũng theo); kiểm thử ở `tests/giao-dien.test.mjs`. Nút trang trước/trang sau của Starlight đi theo menu, nên cũng theo chặng.
3. **`description` bị cắt "…"**: không mở khóa 193 trang (tránh đụng phiên đang làm hình). Thẻ meta description và og:description dựng lúc build từ chính chữ của trang, nối tới hết câu đang dở (`src/mo-ta.mjs`, route middleware `src/route-mo-ta.mjs`); frontmatter giữ nguyên, nên `tools/chuyen/so-chu.mjs` so mô tả theo frontmatter. Còn một trang kết bằng "…" là chữ của chính trang (`hinh-thuc`). Kiểm thử: `tests/mo-ta.test.mjs`.
4. `cap-nhat` chưa ghi các đợt hình và trang Kế hoạch: phiên khác đang làm.
