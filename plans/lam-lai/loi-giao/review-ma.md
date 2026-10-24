# Review mã (<nhánh>, mức <nhỏ/vừa/lớn>)

Theo "Ba mức review" của `plans/lam-lai/README.md`. Mức nhỏ không cần review. Mức vừa: Haiku hay Sonnet đọc diff. Mức lớn: Sonnet hay Opus, có vòng kiểm lại.

> Review mã của nhánh `<nhánh>` trong worktree `<đường dẫn>`. Xem diff: `git -C <wt> diff main...HEAD -- . ':!kiem-dinh' ':!plans'`. Trang trong `src/content/docs/` đã có quy trình kiểm định riêng; chỉ xem khi mã dựa vào chúng.
>
> Đọc:
> - báo cáo của nhánh;
> - `AGENTS.md`: Giao diện, Mẫu trang và khối đặc biệt, Khóa;
> - mục "Ba mức review" của kế hoạch.
>
> CI chạy đủ, nên **không chạy `npm run build`, `npm test` hay kiểm thử trình duyệt**. Được chạy từng file kiểm thử (`node --test tests/<file>`) và script thử viết ở thư mục tạm ngoài repo.
>
> Không sửa file, không commit, không push. Không đưa thông tin cá nhân nào vào yêu cầu gửi ra ngoài.
>
> Ưu tiên, theo thứ tự:
> 1. `<phần rủi ro nhất: khóa, lọc bản build, lọc HTML hay link, workflow>`;
> 2. đọc dữ liệu qua `chiDaKhoa`;
> 3. link "sắp có" ở lúc build và trong JavaScript;
> 4. trợ năng: nhãn, vùng bấm 44 px, bàn phím, khi tắt JavaScript;
> 5. kiểm thử có bắt đúng điều nó nói không, có kiểm thử nào rỗng.
>
> Trả lời tiếng Anh, dưới 400 chữ:
> - "must fix": mỗi mục có file:dòng, tình huống hỏng cụ thể, cách sửa;
> - "should fix";
> - "fine".
>
> Bỏ qua chuyện văn phong.

**Vòng kiểm lại** (mức lớn): gửi tin cho chính agent review, kèm commit sửa và cách các mục đã sửa. Trả lời "re-check passed", hay các mục phải sửa còn lại.
