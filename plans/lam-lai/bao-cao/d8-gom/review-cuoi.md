# D8-gom: review cuối sau lượt 2 bổ sung

Ngày 05/11/2026. Người review: Claude Opus 5.5 (không làm lượt 1, lượt 2 của các câu này). Đầu vào: kết quả lượt 2 bổ sung (`ket-qua-bo-sung.yml`, `ket-qua-bo-sung-2a.yml`, `ket-qua-bo-sung-2b.yml`; 2a và 2b thay kết quả lần đầu cho cùng câu). Không khóa, không commit.

Quy ước của bước này: chữ mới chỉ là câu đúng của lượt 2, hay chỉ bỏ vế lượt 2 không xác nhận được, thì không cần lượt 2 nữa; `ghi_chu` ghi "Review cuối D8-gom: …". Vế lượt 2 chưa xác nhận mà review tự mở được nguồn bậc 1–2 thì giữ, nguồn ghi vào hồ sơ. Không câu nào được viết lại thêm điều mới, nên **không có câu nào phải chạy thêm lượt 2**.

## 1. Bốn câu lượt 2 ghi `sai`

| Trang | Id | Lượt 2 | Quyết định | Chỗ sửa trang |
|---|---|---|---|---|
| `bat-dau/hoi-dap` | n50 | sai: chế độ im lặng chỉ tắt Web Audio, không tắt "cả tiếng" | Chữ theo câu đúng (bỏ vế iOS 17). `ket_qua: da-sua`, `review: dung`. Khuông nhạc phát bằng abcjs (Web Audio), `abc.js` không đặt `audioSession`, nên vế "trong đó có tiếng của khuông nhạc" vẫn đúng (n44) | Mục "Không nghe thấy âm thanh": "tắt tiếng mà trang web phát bằng Web Audio (thẻ audio và video thì vẫn nghe được), trong đó có tiếng của khuông nhạc trên site" (`doi_chu`) |
| `piano/nghe-si` | n40 | sai: Polish Festival Orchestra lập năm 1998 | Tự mở Praemium Imperiale ("In 1998, he formed…", 39 buổi diễn năm 1999) và DG (thu hai concerto; 1999 là năm kỷ niệm). Thêm nguồn `praemium-zimerman` (bậc 2). `review: dung` | Hàng Zimerman: "năm 1998 lập … nhân 150 năm ngày mất của Chopin (1999), lưu diễn và thu hai concerto Chopin với dàn nhạc ấy" (`doi_chu`) |
| `piano/tac-pham-theo-cap` | n61 | sai: phần chính của *Mariage d'Amour* ở 3/4 | Tự xem ảnh trang 1 MN0114635: ô 1–2 ở 4/4, ô 3 và 5 ở 3/4, mục A "Faster ♩. = 50" ở 3/4. Chữ theo câu đúng. `review: dung` | Ô "Giọng · nhịp · tốc độ"; bỏ vế "đây cũng không phải một điệu valse: valse ở nhịp 3/4, còn bài này chủ yếu ở 4/4" ở đoạn "Không phải của Chopin" (cùng điều sai). Hai mục `doi_chu` |
| `piano/chon-dan` | n5 | sai: Yamaha ghi khoảng 14 lần mỗi giây | Tự mở Yamaha Musical Instrument Guide (Selection): "about 14 times per second", đàn đứng "about seven". Hai trang của Yamaha lệch nhau (Hub ghi "roughly 15"); theo câu đúng của lượt 2. Thêm nguồn `yamaha-guide-piano`. `review: dung` | Bảng loại đàn: 15 thành 14 (`doi_chu`) |

Không có câu hỏi kiểm tra nhanh nào nói cùng điều ở bốn trang này (đã tìm "15 lần", "1999", "4/4", "im lặng").

## 2. Mười câu còn `khong-chac`

| Trang | Id | Vế lượt 2 chưa xác nhận | Quyết định |
|---|---|---|---|
| `bat-dau/hoi-dap` | n2 | Người lớn "có lợi thế ở cách tự sắp xếp việc học" | **Giữ.** Câu trùng nguyên văn câu đã khóa ở `bat-dau/bai-0` n4; nguồn bậc 2 của vế này là Schneider 2008 (hồ sơ bai-0). Bỏ ở đây mà giữ ở bai-0 thì hai trang lệch nhau. Chủ repo xem lại khi kiểm mẫu (xem mục 4) |
| `bat-dau/hoi-dap` | n49 | Ký hiệu hợp âm viết bằng chữ cái; Việt Nam gọi Đô, Rê, Mi | **Giữ.** Tự mở Open Music Theory bản 1, Triads (bản 2 trả 403): ký hiệu hợp âm "begins with a capital letter … denoting the root"; thêm nguồn `omt-triads`. Vế Việt Nam theo câu đã khóa `nhac-ly/01` n8 (lượt 2 của hồ sơ ấy: dung) |
| `lich-su/viet-nam` | n36 | Đặng Thái Sơn biểu diễn *Suite*; giảng viên sáng tác ở Học viện | **Giữ.** Tự mở lại hồ sơ Hội Nhạc sĩ (bậc 2): "Hiện là giảng viên bộ môn Sáng tác tại Học viện…"; "Một số tác phẩm viết cho piano của anh (như Suite và Sonate polyphonique) đã được Đặng Thái Sơn biểu diễn" |
| `lich-su/viet-nam` | n38 | "Tốt nghiệp loại ưu" | **Bỏ vế** (trang và câu). Viet Nam News có "graduated with distintion", nhưng nguồn ấy ghi bậc 3 trong hồ sơ, và chi tiết không cần cho trang |
| `piano/chon-dan` | n27 | Thảm dưới đàn giảm tiếng truyền qua sàn | **Bỏ vế** (trang, câu, `doi_chu` mới). `ket_qua: da-sua` |
| `nhac-cu/index` | n25 | "Quãng năm kèn horn" | **Giữ.** Tự mở lại Yamaha, horn, Trivia "Mesmerizing fifths" (curl đọc được): "A 'horn fifth' is the sound of two horns playing together … loved since the days of the natural horn … appears in the melodies of many composers" |
| `nhac-cu/index` | n26 | Le-be-wohl dựa trên hình nét kèn horn, quãng 3 trưởng, 5 đúng, 6 thứ | **Giữ.** Tự mở lại PTNA: "a two-voice progression of major 3rd → perfect 5th → minor 6th", motif theo hình nét kèn horn tự nhiên |
| `nhac-cu/index` | n27 | Hợp âm rải bắt chước tiếng gảy guitar ở Scarlatti | **Giữ.** Tự mở lại Hyperion CDA67613: Kk 8 "an arpeggiated chord imitating the strumming of the open strings of the guitar" (ghi chú trước ghi nhầm Kk 430; đã ghi lại) |
| `piano/tac-pham-theo-cap` | s1 | Đoạn mở tự do và dấu ngân; vòng bốn hợp âm (lượt 2 xem ấn bản khác) | **Giữ.** Tự xem ảnh trang 1 MN0096080 (ấn bản trang link tới): "Freely, flowing", dấu ngân, móc kép, nốt hoa mỹ, tay trái rải. Vòng bốn hợp âm: lượt 2 thấy ở MN0073222 (piano solo, cùng giọng La trưởng); thêm nguồn `mn-river-73222` |
| `piano/nghe-si` | n77 | Chữ *recital* lần đầu dùng ở buổi diễn của Liszt, London 1840 | **Giữ.** Đó là nhận định n3 của trang này, lượt 2 dung (BBC Music Magazine: 9/6/1840, Hanover Square Rooms) |

Mọi câu ở mục 1 và 2 có `review: dung` và `ghi_chu` "Review cuối D8-gom: …".

## 3. Sửa thêm để hồ sơ khóa được

Bốn lời khuyên tập đã đổi chữ có `ket_qua: da-sua` mà không có nguồn, nên `khoa.mjs` báo "thiếu nguon". Đổi thành `khong-can-nguon` (lời khuyên không dính sức khỏe; chữ cũ vẫn ghi ở `ghi_chu`), như hồ sơ đã khóa `nhac-ly/30` n32: `nhan-dien/nghe-mu` n2, n11; `piano/chon-dan` n23; `piano/tac-pham-theo-cap` n36.

## 4. Kiểm điều kiện khóa của 20 trang đợt 8

Script trong thư mục nháp gọi `loiHoSo` (xuất ra từ `tools/khoa.mjs`) cho từng trang của D8-L1, D8-L2, D8-L3 theo `anh-xa.md`. Không chạy `khoa`, không ghi gì. Kết quả:

- **Cả 20 trang:** lần cuối của `lan` thiếu `nguoi.luot_2` và `nguoi.kiem_mau`. Chủ repo điền (`luot_2`: các agent lượt 2 và lượt 2 bổ sung; `kiem_mau`: lần kiểm mẫu của chủ repo).
- **`piano/nghe-si` n65, n70, n71, n72, n73: thiếu `nguon`** (các review trước không bắt được):
  - n65 ("nhiều cuộc thi phát trực tiếp các vòng thi"): lượt 1 không ghi nguồn; lượt 2 chỉ dẫn Wikipedia (Leeds, Cliburn).
  - n70–n73 (mục 30 tác phẩm): lượt 1 ghi "kiến thức chuẩn". Lượt 2 đã mở trang Henle cho một phần: Hob. XVI:52, K. 331, Op. 27/2, Op. 117, D. 899, Op. 23, Liebestraum, Gaspard, Allegro barbaro. Couperin, Partita BWV 826, Goldberg, K. 467, Op. 111, Gershwin, Ligeti, Satie… chưa có nguồn mở.
  - Cần một lượt nhỏ: thêm nguồn bậc 1–2 (Henle, IMSLP, `src/data/tac-pham.yml` cho bài đã có bản ghi) vào danh sách `nguon` của hồ sơ và vào từng nhận định. Với n65, dẫn nguồn ở hồ sơ `lich-su/duong-dai`, hay trang chính thức của các cuộc thi. Phần không tìm được nguồn thì bỏ khỏi trang. Trang này chưa khóa được tới khi xong.
- Không còn nhận định nào thiếu `ket_qua` hay lượt 2 (theo mức của tầng). Không có câu lượt 2 `sai`/`khong-chac` nào thiếu ghi chú giải quyết. Mọi câu `ve-site` có `review`. Khuông nhạc đủ.
- Điều chủ repo nên xem khi kiểm mẫu:
  - `bat-dau/hoi-dap` n2: giữ theo câu đã khóa ở bai-0. Thấy Schneider 2008 chưa đủ thì sửa cả hai trang (bai-0 theo thủ tục mở khóa).
  - Ở `piano/chon-dan` n5, hai trang của Yamaha ghi 14 và 15.

## Kiểm

- `npm run build:xem`: không có cảnh báo `[opus]`.
- `npm test`: 260 đạt, 1 bỏ qua, 0 hỏng.
- `node tools/khoa.mjs tinh`: không lỗi.
