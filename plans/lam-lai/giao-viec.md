# Giao việc cho người mới

Cho chủ repo khi giao một phần việc làm lại site cho agent, LLM hay người khác; và cho người nhận biết đọc gì trước.

## 1. Bản chuẩn nằm ở đâu

- **Bản chuẩn là các file `.md` trong repo mới `mtuann/opus`:** `AGENTS.md`, `plans/lam-lai/`, `plans/ben-vung/`. Chữ thường, ai có repo cũng đọc được, agent đọc tốt nhất, sửa có lịch sử. Sơ đồ nằm trong `so-do.md`, viết bằng Mermaid: GitHub tự vẽ thành hình, sửa như sửa chữ.
- **Hai tài liệu Claude Docs là bản trình bày cho người,** có biểu đồ và sơ đồ, nhưng chỉ người được chia sẻ mới mở được:
  - "Opus Zero: kế hoạch làm lại site theo đợt": https://claude.ai/artifact/512CAjWi2xmyqsTYkqANXS
  - "Opus Zero: kế hoạch phát triển bền vững": https://claude.ai/artifact/PMnBEmGUxUfMzyZXufYmxi
- Hai bản khác nhau thì file trong repo đúng. Sửa kế hoạch: sửa file trong repo trước, rồi nhờ Claude cập nhật tài liệu cho khớp.

## 2. Đưa tài liệu có hình cho người khác

| Người nhận | Cách |
|---|---|
| Người trong tổ chức của bạn trên claude.ai | Mở tài liệu, bấm **Share**, thêm tên, chọn quyền xem, góp ý hoặc sửa |
| Người ngoài | Xem ở **Share** có cho tạo link công khai không; không có thì bấm tên tài liệu → **Export** → PDF hoặc Word (hay chép sang Google Docs, Notion), mở file kiểm sơ đồ còn đủ rồi mới gửi. Kèm link `so-do.md` trên GitHub nếu thiếu hình |
| Agent, LLM | Không gửi bản xuất; đưa file `.md` trong repo (mục 3) |

- Bản xuất Markdown mất hình: mỗi sơ đồ thành một dòng chữ thay thế. Đừng dùng Markdown để gửi cho người đọc.
- Bản xuất là ảnh chụp lúc xuất; kế hoạch đổi thì xuất lại.

## 3. Gửi gì cho người nhận

**Người nhận làm trong repo** (Claude Code, Codex, Cursor, người lập trình):

- Quyền vào repo `mtuann/opus` (đã push commit đầu tiên ở đợt 0). Họ tự đọc file theo mục 4.
- Họ làm ở máy khác thì clone thêm repo cũ vào thư mục cạnh: `git clone https://github.com/mtuann/opus-zero.git ../opus-zero`.
- Lời giao việc, chép từ mục "Lời giao việc mẫu" của `README.md` (đổi số đợt, lô). Một phiên một việc.
- `_imslp/` chỉ có trong thư mục cũ trên máy bạn (không có trong git). Thư mục này chỉ cần từ đợt 6 (đối chiếu nốt, căn mốc bản thu IMSLP). Làm trên máy bạn thì dùng thẳng `../opus-zero/_imslp/`; máy khác thì gửi riêng, bỏ tài liệu có giấy phép dùng cá nhân.

**Người nhận không vào được repo** (LLM trong khung chat): đính kèm file theo việc.

| Việc | File đính kèm |
|---|---|
| Góp ý kế hoạch | `plans/lam-lai/README.md`, `so-do.md`, `cong-nghe.md`, `plans/ben-vung/README.md` |
| Kiểm định lượt 2 một lô | `plans/ben-vung/chuan-kiem-dinh.md` và file nhận định của lô (`plans/lam-lai/bao-cao/d<đợt>-l<lô>-nhan-dinh.yml`); không gửi hồ sơ của lượt 1 |
| Kiểm một trang cũ | `plans/ben-vung/chuan-kiem-dinh.md`, trang trong `../opus-zero/docs/`, các mục Quy tắc nội dung và Bản quyền của `AGENTS.md` |
| Viết code, chuyển trang | Không hợp: việc cần chạy build và kiểm thử; giao cho agent làm trong repo |

## 4. Người nhận đọc theo thứ tự nào

1. `AGENTS.md`: quy tắc chung. Claude Code tự đọc qua `CLAUDE.md`; agent khác phải được bảo đọc (lời giao việc mẫu đã ghi).
2. `plans/lam-lai/README.md`: Quyết định, Tiến độ, Bảy luật, Quy tắc chung, rồi đúng mục đợt của việc mình.
3. Theo việc: `cong-nghe.md` (đợt 0, đợt 1 và mọi việc code); `anh-xa.md` (danh sách trang của lô); `../ben-vung/chuan-kiem-dinh.md` (mọi lô có kiểm định); `../ben-vung/them-tac-pham.md` (thêm tác phẩm sau đợt 6).
4. Khi cần biết vì sao: `so-do.md`, `../ben-vung/README.md`, `../ben-vung/kiem-ke.md`.

Không cần đọc: `../opus-zero/plans/ke-hoach-v15.md`, `../opus-zero/plans/bao-cao-v15/` (lịch sử site cũ); `../opus-zero/AGENTS.md` (sổ tay site cũ, chỉ để tra cú pháp cũ khi chuyển trang).

## 5. Một vòng giao việc

1. Ghi các quyết định còn chờ ở mục "Quyết định" của `README.md` (đánh `[x]`, ghi lựa chọn), commit, push. Đợt 0 không cần chờ.
2. Mở một phiên mới cho người nhận trong thư mục `opus/`, dán lời giao việc.
3. Người nhận làm trên nhánh riêng, viết báo cáo trong `plans/lam-lai/bao-cao/`, không push.
4. Nhờ review bằng lời mẫu trong `README.md`; người review ghi kết quả vào cuối báo cáo.
5. Đọc kết luận review; từ đợt 2, đọc tóm tắt hồ sơ và xem ngẫu nhiên khoảng 5 nhận định mỗi lô; gộp vào `main`, push.
6. Cuối mỗi đợt: review cả đợt, cập nhật bảng Tiến độ.

Phiên mới không nhớ phiên cũ: điều gì cần nhớ phải nằm trong file (báo cáo, bảng Tiến độ, mục Quyết định).
