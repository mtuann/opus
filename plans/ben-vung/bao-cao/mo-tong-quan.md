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

## Thấy nhưng không sửa (để chủ repo quyết)

1. **Link báo lỗi và giấy phép mã nguồn trỏ repo cũ** (`opus-zero/issues` ở `tai-nguyen`, `tai-lieu-tham-khao`, `bat-dau/hoi-dap`, bài blog 07/11; `opus-zero/blob/main/LICENSE` ở `tai-lieu-tham-khao`): đã có trong `ke-hoach-mo-rong.md` mục 1 (đổi khi repo `mtuann/opus` công khai), nên không động.
2. **Thứ tự bài học trong menu bên** theo menu cũ (`THU_TU` ở `src/nhom.mjs`, `THU_TU_TAC_PHAM` ở `src/sach/sach.mjs`), không tăng dần theo chặng: Valse La thứ (chặng 5) đứng trước năm bài chặng 4; Valse Si thứ (chặng 6) trước Invention số 1 (chặng 4), K. 545, *Träumerei*, *Ánh trăng* (chặng 5). Có chủ ý (chú thích ở `sach.mjs`), nhưng người đọc dễ hiểu menu là thứ tự độ khó. Đổi thì sửa hai danh sách và kiểm thử của sách.
3. **`description` bị cắt "…"** ở 193 trang (sinh từ đoạn đầu của site cũ), hiện trong kết quả tìm kiếm và thẻ chia sẻ. Sửa là mở khóa hàng loạt; nên làm một đợt riêng nếu cần.
4. `cap-nhat` chưa ghi các đợt hình (1, 3A, 3B, 3C) và trang Kế hoạch: để phiên làm đợt hình ghi khi xong, tránh đụng nhau.
