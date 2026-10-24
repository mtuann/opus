# Lượt 2 cho nhận định của trang (lô <D…-L…>, phần <x>)

Bạn kiểm định **lượt 2**, độc lập với lượt 1, cho phần nhận định ở `<file danh sách>`. Mỗi mục có:
- `trang`;
- `id`;
- `cau`: câu nhận định, tiếng Việt;
- `loai`.

**Không mở:**
- `kiem-dinh/` (hồ sơ của lượt 1);
- `plans/lam-lai/bao-cao/`, trừ file danh sách được giao;
- trang trong `src/content/docs/`.

Không chạy lệnh git. Không dùng trang nguồn mà lượt 1 đã tải.

**Chỉ đọc:**
- `plans/ben-vung/chuan-kiem-dinh.md`: mục 1, mục 2 và "Nguồn và cách mở";
- `plans/lam-lai/loi-giao/README.md`, mục quy tắc chung.

## Nguồn (bậc 2)

- Nhạc lý (định nghĩa, quy tắc): **Open Music Theory**, dẫn đúng chương. Tên gọi khác nhau thì theo nguồn này.
- Grade, cấu trúc kỳ thi: đề cương chính thức của ABRSM (đúng kỳ); Trinity, RCM khi cần; mức Henle.
- Tác phẩm, số danh mục: IMSLP, henle.de, danh mục tác phẩm.
- Wikipedia chỉ để tìm nguồn.

## Lời khuyên tập (`khuyen-tap`)

Danh sách chỉ có mẫu vài câu mỗi trang. Ghi `dung` nếu hợp lý và hợp cách dạy phổ biến, `nguon: []` được. Ghi `sai` (kèm `cau_dung`) chỉ khi rõ ràng sai hay có hại, như có nguy cơ chấn thương hay kỹ thuật sai.

## Kết quả

- `dung`: đúng như câu viết.
- `sai`: kèm `cau_dung` (câu đúng, tiếng Việt) và nguồn.
- `khong-chac`: nguồn bậc 2 không xác nhận được, hay các nguồn mâu thuẫn. Giải thích ở `ghi_chu`.

Chỉ dẫn trang đã thật sự mở và có nói điều ấy. Bản tóm tắt trang dài có thể sai: chỗ quan trọng thì đọc chữ thật của trang.

## Đầu ra

Danh sách YAML ở `<file kết quả>`, đúng thứ tự đầu vào:

```yaml
- trang: <trang>
  id: n12
  luot_2: dung
  nguon: [https://viva.pressbooks.pub/openmusictheory/chapter/intervals/]
  ghi_chu: "…"
```

- `nguon` (link đã mở) bắt buộc, trừ khi `khong-chac` hay câu là `khuyen-tap`.
- `cau_dung` bắt buộc khi `sai`.
- Kiểm file đọc được: `python3 -c "import yaml,sys; print(len(yaml.safe_load(open(sys.argv[1]))))" <file>`.

## Quy tắc

- Chỉ ghi file kết quả. Không commit, không push.
- Không đưa thông tin cá nhân của chủ repo ra ngoài.
- Xong thì trả lời: số `dung`, `sai`, `khong-chac`; mọi `sai` và `khong-chac` kèm một dòng lý do.
