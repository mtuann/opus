# Mở khóa mo/sua-nho: sửa các lệch nhỏ của kế hoạch mở rộng mục 4

Nhánh `mo/sua-nho` từ `main` (`2b121e3`), Claude Opus 5.5 (phiên Cowork), 07/11/2026. Chủ repo yêu cầu sửa luôn các chỗ sai, lệch nguồn ở mức nhỏ ghi trong `plans/ben-vung/ke-hoach-mo-rong.md` và cập nhật kế hoạch.

## Mở khóa và sửa

| Trang hay bản ghi | Sửa | Căn cứ |
|---|---|---|
| `piano/not-lap-not-kep`, `piano/quang-tam-buoc-nhay` | Valse Si thứ từ hàng chặng 5 sang hàng chặng 6 của bảng theo chặng | `tac-pham.yml` (đã khóa): `chopin-valse-si-thu` chặng 6, Grade 7–8; `d6-l4-gom` |
| `hinh-thuc/minuet-trio` | Link "Hướng dẫn nghe chương 1/2"; câu dẫn "cùng tác phẩm với hướng dẫn nghe chương 1" | Ba hướng dẫn nghe nói chương 1 (Eine kleine, số 40), chương 2 (số 94); `d6-l9-gom`, `d6-l1-gom` |
| `piano/lo-trinh` n37 | "khoảng 4–5 phút" | Ba bản thu Liebestraum trên Commons 3:58–4:43; `d6-l6` |
| `schumann-traumerei` n54, n72 | Nốt dưới "thật nhỏ (khối ghi *p*)"; "các bè độc lập hơn (hai bè ngang nhau)" | Khối bài tập 1 ghi `!p!`; `d6-l4-gom` |
| `mozart-k545` n55 | "sang Fa (ô 2: sang Mi)" | Khối bài tập 2: ô 2 ngón 1 ở Mi; `d6-l4-gom` |
| `debussy-clair-de-lune` n61 | Vòng cung ở ô 1–3, ô cuối đi lên rồi giữ hợp âm kết | Khối bài tập 3; `d6-l5-gom` |
| `schubert-impromptu-sol-giang` n61 | "phần lớn với móc đơn chùm sáu (bài láy rền dùng móc kép)" | Khối láy rền `L:1/16`; `d6-l5-gom` |
| `schumann-album` n69 | "có lẽ là bản nổi tiếng nhất" | Xếp hạng tuyệt đối không có nguồn; `d6-l4` |
| `du-lieu/tac-pham/bizet-habanera` | Thêm `danh_muc: GB 9; WD 31` | IMSLP Carmen (API, 07/11/2026) |

Chỉ sửa hồ sơ (trang không đổi, không mở khóa): `chopin-nocturne-op9-2` n9 thành `khuyen-tap`; `nghe-nhac/liszt-liebestraum` n35 bỏ chữ "Link"; `piano/not-lap-not-kep` n11 bỏ chữ "Sol♯" sai ở câu hồ sơ.

Đã xem, không sửa: xem kế hoạch mục 4.2.

## Kiểm định

Mỗi sửa đổi đối chiếu với chỗ báo cáo D6 đã chỉ ra (khối nhạc trên trang, dữ liệu đã khóa, IMSLP), ghi ở `ghi_chu` của nhận định và `doi_chu`. Không có lượt 2 ngoài, không kiểm mẫu riêng: chủ repo đọc diff trước khi push (ghi ở `nguoi` của lần kiểm định mới). Khóa lại 9 trang và bản ghi; `khoa tinh` khớp; bản build thật 243 trang; `npm test` 302 pass.
