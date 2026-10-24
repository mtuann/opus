# Lượt 2 cho bản ghi dữ liệu (<việc>, phần <x>)

Như `luot-2-trang.md`, với các chỗ khác sau.

- **Đầu vào:** `<file danh sách>`, xuất bằng `node tools/khoa.mjs xuat du-lieu/<bộ>/<id> … --ra <file>`. `trang` là `du-lieu/<bộ>/<id>`.
- **Không mở `src/data/`:** kiểm câu nhận định, không phải file dữ liệu.
- **Không mở** `kiem-dinh/` và `plans/lam-lai/bao-cao/<việc>/`.
- **Nguồn:**
  - người: IMSLP, BnF, LoC (`.json`), GND (qua deutsche-biographie.de), trang nghệ sĩ của hãng đĩa hay đại diện;
  - nhạc sĩ Việt Nam: `hoinhacsi.vn`, cơ quan chính thức; báo chính thức khi không có nguồn tốt hơn, ghi rõ.
- **Không có nguồn bậc 2 nào nêu năm sinh** thì ghi `khong-chac`. Đừng suy năm từ tuổi nêu trong bài báo.
- **Người còn sống:** câu "còn sống" kiểm tới thời điểm hiện tại. Tìm tin mất, bản tin cáo phó.
- **Thời kỳ:** theo cách chia của site (Trung cổ, Phục hưng, Baroque, Cổ điển, Lãng mạn, Thế kỷ 20, Đương đại, hay "A/B").
  - `dung` khi xếp hợp lý;
  - `sai` khi rõ ràng sai;
  - `khong-chac` khi các nguồn thật sự lệch nhau.
