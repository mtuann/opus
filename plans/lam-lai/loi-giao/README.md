# Lời giao việc mẫu

Rút từ đợt 2: D2-0 (dữ liệu) và D2-L1 (lô trang). Dùng lại cho mọi lô, chỉ đổi phần trong `<>`. Lô sau thấy thiếu thì sửa file ở đây, đừng soạn lời mới.

| File | Giao cho | Model |
|---|---|---|
| `lo.md` | agent làm lô: chuyển trang, thành phần, kiểm định lượt 1, hồ sơ, báo cáo | Opus nếu lô có thành phần hay công cụ mới (như bàn phím ở D3-L1); Sonnet nếu lô chủ yếu chuyển chữ và kiểm định |
| `luot-2-trang.md` | lượt 2 cho nhận định của trang | Sonnet |
| `luot-1-du-lieu.md` | lượt 1 cho bản ghi dữ liệu (việc dữ liệu riêng như D2-0) | Sonnet |
| `luot-2-du-lieu.md` | lượt 2 cho bản ghi dữ liệu | Sonnet |
| `review-ma.md` | review phần mã của lô hay nhánh, theo "Ba mức review" của kế hoạch | Sonnet (mức lớn), Haiku (vừa, kiểm lại) |

## Cách chạy cho đỡ tốn

Chủ repo chọn ngày 24/10/2026, sau đợt 2. Lý do: đợt 2 chạm giới hạn sử dụng hai lần, các agent dừng giữa chừng.

- **Tối đa 2–3 agent nặng cùng lúc**, tính cả agent con của agent làm lô. Agent làm lô dùng tối đa 2 agent con.
- Việc nặng (lượt 1, lượt 2) bắt đầu ở đầu một khung giới hạn. Bị dừng giữa chừng thì gửi tin cho chính agent ấy để nó làm tiếp, đừng mở agent mới.
- Lượt 2 chia phần khi một phần quá khoảng 150 nhận định; ít hơn thì một agent.
- Các lô làm lần lượt. Chỉ chồng phần việc nhẹ (chờ CI, chờ chủ repo kiểm mẫu) với việc của lô sau.
- Review mã chỉ đọc diff và chạy đúng phép thử liên quan; CI chạy đủ.
- Ảnh chụp do CI chụp khi push nhánh (`tools/chup-anh.mjs`, tệp `anh-chup` của lần chạy, giữ 7 ngày). Báo cáo giữ tối đa 4 ảnh tiêu biểu.

## Quy tắc chung cho mọi lời giao

- Không push. Không sửa `../opus-zero/`. Không sửa `.claude/`.
- **Không đưa email hay thông tin cá nhân của chủ repo vào yêu cầu gửi ra ngoài** (header User-Agent, tham số, nội dung). Dịch vụ nào đòi thông tin liên hệ thì dùng `opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)`. Nhắc quy tắc này cho agent con.
- Nguồn bị chặn và cách vòng: `plans/ben-vung/chuan-kiem-dinh.md`, mục "Nguồn và cách mở".
- Node 24: `export PATH=<thư mục có node 24>:$PATH` (theo máy); repo ghi `.nvmrc`.
