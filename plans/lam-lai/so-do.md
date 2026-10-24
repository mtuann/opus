# Sơ đồ kế hoạch làm lại

Bản vẽ để nắm nhanh kế hoạch. Chữ trong `README.md` là chuẩn: sơ đồ khác chữ thì sửa sơ đồ. GitHub tự vẽ các khối `mermaid` dưới đây; sửa chúng như sửa chữ.

## 1. Mười đợt, làm lần lượt (tác phẩm sau cùng)

```mermaid
flowchart TB
  subgraph G1["Chuẩn bị: chưa đăng gì ở /opus/"]
    direction LR
    D0["Đợt 0<br/>Dựng repo mới opus<br/>site cũ ở ../opus-zero/"] --> D1["Đợt 1<br/>Nền kỹ thuật<br/>D1.1 đến D1.8"]
  end
  subgraph G2["Nền tảng: đủ 100 trang lõi sau đợt 5"]
    direction LR
    D2["Đợt 2<br/>Khung cấp độ, lối vào<br/>1 lô, 9 trang"] --> D3["Đợt 3<br/>Nhạc lý, luyện tai<br/>6 lô, 45 trang"] --> D4["Đợt 4<br/>Piano nền tảng<br/>4 lô, 28 trang"] --> D5["Đợt 5<br/>Nhạc cổ điển nền tảng<br/>3 lô, 26 trang"]
  end
  subgraph G3["Phần còn lại: tác phẩm sau cùng"]
    direction LR
    D7["Đợt 7<br/>Công cụ, sách in, blog<br/>3 lô, 23 trang"] --> D8["Đợt 8<br/>Tham chiếu, Đọc thêm<br/>3 lô, 21 trang"] --> D6["Đợt 6<br/>Tác phẩm<br/>11 lô, 81 trang"] --> D9["Đợt 9<br/>Hoàn tất<br/>mọi địa chỉ cũ chạy lại"]
  end
  G1 --> G2 --> G3
```

Từ đợt 2, mỗi lô gộp vào `main` là trang của lô lên https://mtuann.github.io/opus/. Đợt 6 (tác phẩm) làm sau đợt 8; số đợt giữ nguyên để tên lô và nhánh không đổi. Số trang tính cả trang mục lục; tổng 31 lô, 233 trang cũ.

## 2. Một lô đi qua những bước nào

```mermaid
flowchart TB
  A["Bạn giao lô"] --> B["Agent: chuyển trang,<br/>tách dữ liệu,<br/>kiểm định lượt 1"]
  B --> C["Agent khác: lượt 2 độc lập"]
  C --> D["CI trên bản xem:<br/>build, kiểm thử, ảnh chụp"]
  D --> E{"Review"}
  E -->|cần sửa| B
  E -->|đạt| F["Bạn kiểm khoảng<br/>10 nhận định"]
  F --> G["Agent khóa"]
  G --> H["Bạn gộp vào main, push"]
  H --> I["Trang lên site thật"]
```

## 3. Trang nào lên site

```mermaid
flowchart LR
  T["Trang trong<br/>src/content/docs/"] --> Q{"Có trong<br/>kiem-dinh/khoa.json?"}
  Q -->|chưa| X["Chỉ ở bản xem,<br/>có dải Chưa kiểm định;<br/>link tới nó hiện sắp có"]
  Q -->|có| H{"Mã băm<br/>còn khớp?"}
  H -->|khớp| P["Bản thật:<br/>đăng lên site"]
  H -->|lệch| F["Build hỏng:<br/>sửa theo thủ tục mở khóa"]
```

## 4. Lớp dữ liệu và các tầng

```mermaid
flowchart TB
  DATA["src/data/<br/>có schema,<br/>khóa theo bản ghi<br/>hay từng trường<br/><br/>cap-do.yml: 7 chặng<br/>tac-pham.yml: 73 bản ghi<br/>nha-soan-nhac.yml<br/>thuat-ngu.yml<br/>trang.yml: tầng, ngày rà"]
  PAGES["src/content/docs/<br/>Markdown,<br/>khóa theo trang<br/><br/>số trang theo tầng:<br/>Lõi: 100<br/>Tác phẩm: 79<br/>Tham chiếu có hạn: 7<br/>Đọc thêm: 13"]
  GEN["Sinh lúc build,<br/>không viết tay<br/><br/>trang chủ, mục lục,<br/>7 trang chặng,<br/>danh mục tác phẩm,<br/>sách in, Cập nhật,<br/>con số về site"]
  DATA -->|năm, cấp độ, số danh mục| PAGES
  DATA -->|danh sách, con số| GEN
```

Trang tác phẩm dẫn link về trang lõi để giải thích khái niệm, không giải thích lại. Thêm một tác phẩm chỉ thêm một bản ghi, một trang và một hồ sơ; mọi danh sách và con số tự cập nhật lúc build (`../ben-vung/them-tac-pham.md`).

## 5. Menu của site mới

```mermaid
flowchart LR
  OZ(["Opus"]) --> M1["Bắt đầu<br/>Bài 0, kiểm tra đầu vào,<br/>lộ trình năm đầu,<br/>lộ trình nghe, mỗi ngày,<br/>tóm tắt một tờ"]
  OZ --> M2["Lộ trình 7 chặng<br/>tổng quan,<br/>7 trang chặng<br/>sinh từ dữ liệu"]
  OZ --> M3["Nhạc lý và luyện tai<br/>bài theo nhóm, ôn tập,<br/>Từ điển, luyện tai"]
  OZ --> M4["Piano<br/>bắt đầu bên phím,<br/>kỹ thuật, tập luyện,<br/>hòa âm bên phím,<br/>văn học piano"]
  OZ --> M5["Nhạc cổ điển<br/>dòng thời gian, thời kỳ,<br/>hình thức, nhận diện,<br/>nhà soạn nhạc"]
  OZ --> M6["Tác phẩm<br/>danh mục lọc theo chặng,<br/>thời kỳ, tác giả;<br/>34 bài học,<br/>45 hướng dẫn nghe"]
  OZ --> M7["Luyện tập<br/>17 công cụ"]
  OZ --> M8["Đọc thêm<br/>13 trang ngoài lộ trình"]
  OZ --> M9["Thêm<br/>Cập nhật, blog,<br/>tài nguyên,<br/>tài liệu tham khảo,<br/>sách in"]
```

## 6. Trang cũ theo tầng

```mermaid
pie showData title 233 trang cũ theo tầng
  "Lõi" : 100
  "Tác phẩm" : 79
  "Khung và công cụ" : 34
  "Đọc thêm (ngoại vi)" : 13
  "Tham chiếu có hạn" : 7
```

Lõi kiểm định một lần rồi khóa; tác phẩm kiểm từng trang, sau đó chỉ thêm; tham chiếu rà theo ngày; khung sinh từ dữ liệu và kiểm tự động. Chi tiết: `../ben-vung/README.md`, `../ben-vung/kiem-ke.md`.
