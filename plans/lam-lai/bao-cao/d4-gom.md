# D4, nhánh gom: lượt 2, review, khóa (đang làm)

Nhánh `moi/d4-gom` từ `main` (`82e33f5`), Claude Opus 5.5 (phiên Cowork), 28/10/2026.

## Lượt 2

Danh sách xuất từ hồ sơ hiện tại (`node tools/khoa.mjs xuat D4-L1 D4-L2 D4-L3 D4-L4 --ra …`): 1.334 nhận định của 28 trang, chia 9 phần (`d4-gom/trang-1..9.yml`). Mỗi phần một agent Claude Sonnet 5.5, độc lập với lượt 1, theo `loi-giao/luot-2-trang.md`.

| Phần | Trang | Số | dung | sai | khong-chac | Đã nhập |
|---|---|---|---|---|---|---|
| trang-1 | 10 bài đầu tiên, bản đồ bàn phím, hai tuần đầu, mục lục | 147 | 92 | 1 | 54 | có |
| trang-2 | tư thế, sức khỏe, cách tập, học thuộc | 135 | 95 | 0 | 40 | có |
| trang-3 | bài tập ngón, bàn đạp, gam, hai tay | 152 | 95 | 1 | 56 | có |
| trang-4 | hợp âm rải, năm ngón, nốt lặp, quãng tám | 143 | 124 | 0 | 19 | có |
| trang-5 | nốt hoa mỹ, tiếng đàn | 158 | 130 | 0 | 28 | có |
| trang-6 | nhà soạn nhạc | 146 | 55 | 1 | 90 | có |
| trang-7 | lịch sử cây đàn, thể loại | 137 | 101 | 0 | 36 | có |
| trang-8 | chơi cùng người khác, thị tấu, hòa âm (mục lục, đệm giai điệu) | 150 | 132 | 0 | 18 | có |
| trang-9 | kết, mẫu galant, ứng tác | 166 | 139 | 2 | 25 | có |

Năm câu `sai` (tổng: 963 dung, 5 sai, 366 khong-chac): mau-galant n48 (bước 3 của Prinner là vii°6, không phải V4/3; câu này lượt 1 đã bỏ); ung-tac n2 ("mọi ứng tác" quá tuyệt đối; lượt 1 đã sửa thành "thường"); nha-soan-nhac n5 (*Menuet sur le nom d'Haydn* là của Ravel, M. 58; Debussy có *Hommage à Haydn*); hai-tuan-dau n39 (Đô cuối đàn, C8, không có phím đen bên phải); gam n8 (ngón 4 không phải lúc nào cũng một lần mỗi quãng tám: Si trưởng tay trái).

Ghi chú: WebSearch hết hạn mức giữa ba phần đầu; Henle, ABRSM, PDF BAPAM, PubMed bị chặn hay giới hạn. Nhiều câu `khong-chac` là do không mở được nguồn. Mốc "tập 20 phút, nghỉ 10 phút" gán cho BAPAM (tu-the, cach-tap, suc-khoe) chưa đối chiếu được tờ PDF; trang BAPAM "return to play" ghi nghỉ 3–5 phút sau 20–25 phút: review phải mở tờ PDF.

## Review

Năm agent review (Claude Opus 5.5), không làm lượt 1 hay lượt 2 của các trang: nhóm A (10 bài đầu tiên, bản đồ bàn phím, hai tuần đầu, mục lục, tư thế, sức khỏe, cách tập, học thuộc), B (bài tập ngón, bàn đạp, gam, hai tay, hợp âm rải, năm ngón, nốt lặp, quãng tám), C (nốt hoa mỹ, tiếng đàn, lịch sử cây đàn, thể loại), D (nhà soạn nhạc, chơi cùng người khác), E (thị tấu, năm trang hòa âm). Mọi mục ở `can-review.txt` (843) đã xử lý; không còn câu `ket_qua: null`; câu `ve-site` có `review` và nơi đã kiểm.

Quyết định chung:

- Mốc nghỉ BAPAM giữ "tập khoảng 20 phút, nghỉ 10 phút": nguyên văn trên trang BAPAM *The Healthy Pianist* (bapam.org.uk), link nguồn đổi từ bản PDF do bên thứ ba đăng sang trang của BAPAM. Bảng Mẫu buổi tập (cach-tap) chỉnh giờ nghỉ cho khớp.
- Grade/chặng (nha-soan-nhac, the-loai, bai-tap-ngon): chặng theo bản ghi `tac-pham.yml` đã khóa; "Grade N" chỉ giữ khi bản ấy có trong đề cương ABRSM (2021–2026) hay Henle ghi; mọi Grade ước lượng khác bỏ. Bảng étude của bai-tap-ngon bỏ cột Cấp độ.
- "Hợp âm bảy át" (như bài 11) ở mọi trang đợt 4.
- "Tai người nghe ưu tiên bè cao nhất" dẫn Trainor và cộng sự (2014), *Hearing Research* 308.
- ban-dap viết lại theo nguồn bậc 2 (Concise Oxford, Britannica, Baylor, Dolmetsch, AES, Met): una corda nói chung "búa gõ ít dây hơn" (nguồn lệch về số dây); bỏ bàn đạp tập của đàn đứng, "Chopin tự ghi bàn đạp kỹ", con/senza pedale; ∧ là nửa bàn đạp.
- Hình `keyboard-ranges`: "Đàn Stein (thời Mozart)", Graf của Beethoven 1826 (Beethoven-Haus).
- Sửa đáng kể khác: Menuet sur le nom d'Haydn của Ravel (nha-soan-nhac); Đô cuối đàn (hai-tuan-dau); ngón 4 trong gam (gam); quy tắc ngón 4–5 cho quãng tám legato (quang-tam, not-lap); Prélude Mi thứ (tieng-dan); ket ghi rõ "bốn loại kết" và đủ ba tiến trình giọng thứ; kế hoạch tuần của mục lục Hòa âm khớp Đệm giai điệu; K. 265 theo Henle và Mutopia.

Chỗ trang và dữ liệu đã khóa cần sửa theo (làm ở nhánh này, trước khi khóa): `piano/lo-trinh` "đọc trước nửa ô nhịp / một ô nhịp" (chặng 3, 4); `thuat-ngu.yml` mục `con-sordino-con-sordina`; ba trang luyện tai còn "hợp âm át bảy"; ghi chú cũ trong `bat-dau/moi-ngay.yml`.

Chữ đổi sau lượt 2 và câu mới: 156 câu ở `bo-sung.yml` (145 câu đổi chữ, 9 câu mới hay đổi nhãn, 2 mẫu lời khuyên tập) cho lượt 2 bổ sung.

### Lượt 2 bổ sung

220 câu (`bo-sung-1..3.yml`, `ket-qua-bo-sung-1..3.yml`): 195 dung, 1 sai, 24 khong-chac. Trước đó nhóm C cập nhật `cau` của 79 câu theo chữ mới trên trang (lượt 2 bổ sung chỉ đọc `cau`). Người gom giải quyết:

- ung-tac n59 (sai): ấn bản Henle của K. 265 là HN 165, không phải HN 116.
- the-loai n43: "Chopin viết 13 bản polonaise" không khớp nguồn; theo Henle (HN 217/218): bảy bản lớn in lúc sinh thời, cùng những bản thời trẻ.
- lich-su-dan n44: bỏ mốc "khoảng 1798" của đàn hươu cao cổ (Britannica: 1804), viết "đầu thế kỷ 19"; Hawkins "thường được coi là".
- ban-dap n19: ∧ trên đường kẻ bàn đạp đọc là nhả rồi nhấn lại (MEI), vài ấn bản dùng cho nửa bàn đạp.
- Các câu khong-chac còn lại: do lượt 2 bổ sung không mở được nguồn (Britannica, encyclopedia.com, OMT, IMSLP chặn hay lỗi), không phải nguồn nói khác; giữ theo nguồn lượt 1 và review đã ghi trong hồ sơ.

### Sửa trang đã khóa

- `piano/lo-trinh`: mở khóa, dòng Đọc nhạc chặng 3, 4 thành "tập nhìn trước vài nốt" và "nhìn trước xa hơn, dù hiếm khi tới trọn một ô nhịp", dẫn sang Thị tấu `#nhin-truoc`.
- `bat-dau/moi-ngay.yml`: ghi chú hai nhận định cập nhật theo bảng Mẫu buổi tập và bảng cảnh báo mới (chữ trang không đổi).
- Giữ nguyên: bản ghi `thuat-ngu.yml` `con-sordino-con-sordina` (nghĩa una corda ở Scriabin có nguồn Henle Blog; link `#ky-hieu` vẫn có); ba trang luyện tai còn "hợp âm át bảy" (đã khóa, chỉ khác cách gọi; để lần sửa sau).
