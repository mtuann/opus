# Thêm tác phẩm: Backer Grøndahl, *Klage* Op. 36 số 1 (hướng dẫn nghe)

Nhánh `them/backer-grondahl-klage`, 17/11/2026. Hướng dẫn nghe số 2 ở mục 7 của `plans/ben-vung/lo-trinh-them-tac-pham.md`: hướng dẫn nghe đầu tiên của site về một nhà soạn nhạc nữ. Lượt 1, lượt 2, review; chưa kiểm mẫu, chưa khóa.

## Kết quả

- Tác giả mới `backer-grondahl` cuối `src/data/nha-soan-nhac.yml` (Agathe Backer Grøndahl, 1847–1907, Lãng mạn), hồ sơ `kiem-dinh/du-lieu/nha-soan-nhac/backer-grondahl.yml` (3 nhận định; IMSLP, LoC n79091195, Store norske leksikon / Norsk biografisk leksikon). Tên viết không gạch nối như bản in và SNL (IMSLP, LoC viết "Backer-Grøndahl").
- Trang `nghe-nhac/backer-grondahl-klage`, bản ghi `backer-grondahl-klage` (`loai: nghe`, `hinh.nghe` sáu ô theo giây của bản thu), dòng `trang.yml`, hai hồ sơ (trang 50 nhận định, bản ghi 6).
- Bản nhạc: IMSLP #82783 (tập 1, số 1–5). Bản quét này **không phải** bản in Brødrene Hals 1895 mà là bản in của Norsk Musikforlag, Kristiania, số bản in 3837 (bìa "Norsk Musikforlag Kristiania", chân trang "Norsk Musikforlag, Kristiania. 3837"); IMSLP ghi nó là bản in lại "after 1909" của ấn bản Brødrene Hals [1895], B.H.M. 838. Chữ "Kristiania" cho thấy in trước khi thành phố đổi tên Oslo (1925), nên hết bảo hộ ở Mỹ; không dùng #11480 (Norsk Musikforlag 1945, "revised edition", cùng số 3837). Trang và `doi_chieu` ghi đúng như vậy.
- Trích đoạn: ô 1–2 (tay phải một mình, tay trái nghỉ), một khuông, hai lớp `&`; chép tay từ bản quét ở 300 dpi với đường dóng dòng kẻ do máy dò. Rê cuối phách 2 viết `^D` (bản in không in lại dấu thăng vì còn hiệu lực trong ô), nên abcjs in thêm dấu thăng nhắc lại.
- Bản thu: Commons `Klage-grondahl.ogg`, Tjako van Schie (thu tại nhà, 2014), `{{self|cc-by-sa-4.0}}`, 80,93 s, phát được (đọc lại trang mô tả 17/11/2026). Tám mốc `1 17 33 43 55 66 71 76`, đo bằng librosa (RMS, onset kèm cao độ ở CQT, hai quãng lặng 31–32 s và 64–66 s); không có bản số (Mutopia, kern) nên không dùng `tools/audio/align`.
- So sánh bản thu: Anne Le Bozec (Aparté AP374, 2025; MusicBrainz, bản thu thương mại duy nhất của *Klage* ở đó).
- Link: `lich-su/nu-nha-soan-nhac`, ba bài học nhà soạn nhạc nữ (`chaminade-pierrette`, `chaminade-automne`, `clara-schumann-scherzo-2`), `nghe-nhac/grieg-concerto` (bà chơi concerto này ở London và Paris năm 1889), `chopin-prelude-mi-thu`, `piano/ban-do-ban-phim`, `piano/ban-dap`, `nhac-ly/05-dau-hoa`, `nhac-ly/12-hoa-am-chuc-nang`.

## Chọn lựa

- Không xếp chặng: bài không có trong đề cương thi (khảo sát G6; pianosyllabus không có), trang chỉ nói "site chưa xếp *Klage* vào chặng nào" và tả cái khó đọc được trên bản nhạc.
- Năm: trang chỉ ghi năm in 1895 (IMSLP, dẫn Norsk bokfortegnelse); mô tả Commons ghi "year of composition: 1895" nhưng không có nguồn, không dùng.
- Năm ra mắt: SNL ghi 1868 ở một câu và "debutkonserten i 1869" ở câu sau; trang bỏ năm, chỉ giữ "Grieg chỉ huy".
- Cấu trúc: hai câu bốn ô (ô 1–4 tay phải một mình; ô 5–8 tay trái vào, rit.), câu đầu trở lại (ô 9–10) rồi dâng lên (ô 11–14) tới chỗ *f* duy nhất (ô 15, cũng là chỗ đầu tiên có Ped.), lịm dần (ô 17–20). Bài dừng trên hợp âm Si trưởng (át của Mi thứ) có fermata; hai ô cuối tay phải nghỉ.

## Chỗ chưa chắc

- Mốc ô 15 (55) và ô 19 (71) sai số khoảng ±1 s (ô 15 bắt đầu khi tay trái còn nghỉ phách 1; ô 18 không có onset rõ).
- Lời đề tặng in "Frithjof Backer Grøndahl"; trang viết đó là con trai bà, Fridtjof (SNL). Không có nguồn nói thẳng lời đề tặng là cho ông, nhưng bà chỉ có một con trai tên này.
- "Phần ca khúc với ca sĩ Karen Vourc'h" (đĩa Le Bozec) suy từ tên đĩa và người cùng ghi tên trên MusicBrainz.
- Hợp âm ô 19 chỉ tả chung (hợp âm chậm của tay trái): đọc đầu nốt khóa Fa ở ô này chưa chắc tới từng nốt.

## Kiểm thử

- `node tools/khuong-nhac.mjs`: 401 khối, 0 lỗi.
- `npm run build:xem`: đạt.
- `npm test`: 353 đạt, 1 bỏ qua, 1 hỏng: `tests/chuyen.test.mjs` (so chữ với site cũ, chạy vì máy có `.cache/site-cu/`) báo `doi_chu` thiếu ở `lich-su/nu-nha-soan-nhac` và `piano/tac-pham-theo-cap`. Hai trang này nhánh không sửa; chỗ khác là các dòng Chaminade, Clara Schumann, Gretchaninov đã gộp vào `main` trước đó (lỗi có sẵn ở `main`, trên CI tự bỏ qua vì không có `.cache/site-cu/`). `tests/pham-vi.test.mjs`, `tac-pham.test.mjs`, `link.test.mjs`, `ban-thu.test.mjs` đạt.
- `OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet`: 430/430 đạt; sau commit chạy lại với `OPUS_TRANG="nghe-nhac/backer-grondahl-klage/"` để chắc trang mới vào trang mẫu.

## Review

Claude (agent riêng, không làm lượt 1, lượt 2), 17/11/2026. Mọi nhận định của ba hồ sơ có `review`: `dung`, trừ n41 của trang (`sai`, đã sửa). Sửa thêm cho thận trọng (`da-sua`, review `dung`): n21, n43, n49 của trang, n4 của bản ghi tác phẩm.

- n41 (lượt 2 sai): bản quét tr. 3 hệ 5 ở 250 dpi: *morendo* in ở nửa sau ô 18, sát vạch ô 19; ô 19 chỉ có *rit.* Dòng 7 bảng "Theo dõi khi nghe" thành "**Lịm dần** (ô 19): *morendo* (ghi từ cuối ô 18), *rit.*; …": giữ dòng bắt đầu ở ô 19 để mốc 71 vẫn đúng chỗ. Câu "Cuối cùng là *morendo* và *rit.*" ở phần đầu và ô "Lịm dần, ô 17–20" của sơ đồ không gắn ô 19 nên giữ.
- Khối abc 1 (ô 1–2) so từng nốt với tr. 2 hệ 1 ở 450 dpi, dòng kẻ đo bằng máy và lưới cao độ phủ lên ảnh: hai bè, dấu hóa, trường độ, luyến, chấm *portato*, *p dolce* khớp; không sửa.
- Ấn bản, bản quyền: IMSLP (API) ghi file là bản in lại "Norsk Musikforlag, n.d.(after 1909), plate 3837" của ấn bản Brødrene Hals [1895], Copyright Public Domain. Bản quét ghi "Kristiania" (tên dùng tới hết 1924) nên in trước 1925, hết bảo hộ ở Mỹ; tác giả mất 1907. Trang (mục Nguồn) và `doi_chieu` thêm "bản in lại (sau năm 1909)" để không đọc nhầm thành bản in đầu.
- Tác giả: snl.no (JSON) sinh 1.12.1847 Holmestrand, mất 4.6.1907 Ormøya; bản in và SNL viết "Agathe Backer Grøndahl" không gạch nối, IMSLP, LoC, MusicBrainz có gạch nối. Trang và dữ liệu chỉ dùng một cách viết nên không thêm `cach_viet_khac`; "Fridtjof Backer-Grøndahl" (có gạch nối) là tên người con, đúng như SNL.
- Đề tặng: bìa trong "Til Frithjof Backer Grøndahl."; SNL: ba con lớn lên là Nils, Anders, Fridtjof (1885–1959). Không nguồn nào nói thẳng lời đề tặng cho Fridtjof, nên đoạn "Tập nhạc tặng con trai" đổi thành "**Lời đề tặng.**", viết "nhiều khả năng tập nhạc tặng cậu bé; bản in không nói rõ".
- Đĩa Anne Le Bozec: MusicBrainz (API) xác nhận release, Aparté AP374, 2025-01-31, *Klage* 98 880 ms, Le Bozec ghi nhạc cụ piano; không ghi vai của Karen Vourc'h, nên "phần ca khúc với ca sĩ Karen Vourc'h" thành "đĩa có cả ca khúc, đứng tên cùng Karen Vourc'h".
- Sự kiện kiểm lại ngẫu nhiên trên nguồn: Kjerulf 1857, Kullak ở Berlin, Bülow và Liszt, Grieg chỉ huy buổi ra mắt (năm 1868/1869 lệch trong SNL, trang bỏ năm là đúng), London và Paris 1889, điếc dần, 250 ca khúc và 150 bài piano, 48 fantasistykker (SNL); tên mười bài và năm in 1895 (IMSLP); f duy nhất và Ped. đầu tiên ở ô 15, Mi1 ở ô 17, hợp âm Si trưởng có fermata ở ô 20 (bản quét). Đều khớp.
- Mốc đo lại (librosa onset, CQT trên ogg Commons): ô 5 17,19 s, ô 9 32,91 s, ô 17 66,01 s, ô 19 70,72 s, ô 20 76,05 s: khớp 17, 33, 66, 71, 76; không đổi mốc, không chạy `attach.py`. Giấy phép bản thu: Commons API `{{self|cc-by-sa-4.0}}`, LicenseShortName CC BY-SA 4.0, 80,93 s.
- Chữ, thuật ngữ: Andantino, dolce, portato, morendo, rit., dim., cresc., fermata, Ped. khớp `thuat-ngu.yml`; câu chữ rõ, không sửa thêm.
- Kiểm thử: `npm run build:xem` đạt; `npm test` 353 đạt, 1 bỏ qua, 1 hỏng: `tests/chuyen.test.mjs` (`doi_chu` của `lich-su/nu-nha-soan-nhac`, `piano/tac-pham-theo-cap`), lỗi đã sửa ở `main`, nhánh chưa rebase; không sửa ở đây.

## Chỗ vướng của quy trình

1. `them-tac-pham.mjs` đặt `title` là "Grøndahl: …" (lấy từ cuối tên tác giả có khoảng trắng): sửa tay thành "Backer Grøndahl: …".
2. `attach.py` không có `--ref` thì xóa mốc đã viết tay trong trang; chạy lại với `--ref`.
3. File IMSLP ghi trong lộ trình là "Brødrene Hals [1895]" nhưng bản quét là bản in lại của Norsk Musikforlag: nên đọc bìa và chân trang trước khi ghi ấn bản.

## Việc ngoài phạm vi (nhánh `mo/`, có mở khóa)

- `lich-su/nu-nha-soan-nhac` (đã khóa): thêm Agathe Backer Grøndahl vào mục "Thế kỷ 19" (Na Uy; nghệ sĩ piano, ca khúc và tiểu phẩm piano) kèm link sang hướng dẫn nghe này.
- Ghi `doi_chu` còn thiếu của `lich-su/nu-nha-soan-nhac` và `piano/tac-pham-theo-cap` (lỗi `tests/chuyen.test.mjs` ở máy có `.cache/site-cu/`).

## Kiểm mẫu và khóa

Claude (agent riêng) kiểm thay chủ repo 5 nhận định mẫu (trang n5, n20, n41, n48; bản ghi n2) trên IMSLP, bản quét, dữ liệu site: 5 đúng. Khóa trang, bản ghi tác phẩm, bản ghi tác giả 17/11/2026.
