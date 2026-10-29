# Mở khóa mo/bay-at: tên hợp âm bảy ở ba trang luyện tai

Nhánh `mo/bay-at` từ `main` (`2c4edf1`), Claude Opus 5.5 (phiên Cowork), 29/10/2026. Việc còn lại ghi ở nhánh gom đợt 5; chủ repo yêu cầu sửa.

## Sửa

Bài 11 (`nhac-ly/11-hop-am-bay`, đã khóa) và công cụ (`src/scripts/nhac-ly.js`) gọi năm loại hợp âm bảy là bảy trưởng, bảy át, bảy thứ, bảy nửa giảm, bảy giảm. Ba trang luyện tai đã khóa còn gọi theo thứ tự ngược:
- `luyen-tai/nghe-gam`: "hợp âm át bảy", "tạo át bảy" (2 chỗ);
- `luyen-tai/nghe-hop-am`: bảng năm loại, câu hỏi trắc nghiệm, lời giải và chú thích nguồn Hutchinson;
- `luyen-tai/nghe-quang`: bảng quãng và câu hỏi trắc nghiệm về tritone.

Đổi theo bài 11; câu của các nhận định đổi theo. Không đổi kiến thức. Kiểm thử mới trong `tests/luyen-tai.test.mjs` chặn "át bảy", "trưởng bảy", "giảm bảy", "Thứ bảy (m7)" ở mọi trang.

## Không sửa: "Dân ca Pháp" ở 10 bài đầu tiên

Hai bài *Au clair de la lune* và *Ah! vous dirai-je, maman* vẫn ghi "Dân ca Pháp". Nguồn của hai nhận định gọi đúng như vậy: Britannica gọi giai điệu K. 265 là "French folk song"; Manitoba Education gọi *Au clair de la lune* là "a common French folk song"; BBC Music Magazine (classical-music.com) gọi là "French folk song" của tác giả vô danh, có lẽ từ thế kỷ 18. *Frère Jacques* đổi thành "bài hát Pháp truyền thống" ở kiểm mẫu đợt 4 vì có giả thuyết giai điệu của Rameau; hai bài này không có lý do ấy. Giữ nguyên.

## Kiểm định

Khóa lại ba trang; bản build thật 117 trang; `npm test` 189 pass.
