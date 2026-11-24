# Lộ trình thêm tác phẩm (giao cho agent)

Chốt ngày 16/11/2026 (chủ repo chọn): làm **đợt 2 (Thế kỷ 20) và đợt 3 (nhà soạn nhạc nữ) trước đợt 1**, để cân lại thời kỳ (bài học hiện 17/34 Lãng mạn, chưa có Thế kỷ 20, chưa có nhà soạn nhạc nữ). File này là lời giao việc đầy đủ cho agent thêm tác phẩm: thứ tự, từng bài, việc phải làm và điều kiện "xong". Đánh số đợt giữ như `ke-hoach-mo-rong.md` mục 6.1 (đợt 1–5) để khỏi lệch với các báo cáo cũ.

Hiện trạng khi chốt (bài học theo chặng 2–7): 7, 5, 8, 5, 5, 4 (34 bài). Hướng dẫn nghe: 46 trang, Lãng mạn 14, Cổ điển 8, Baroque 7, Thế kỷ 20 4, Ấn tượng 1, Đương đại 1.

## 1. Thứ tự

| Lượt | Đợt | Việc | Chặng thêm vào |
|---|---|---|---|
| 1 | 2 | Bartók, *For Children* I/1 và I/6 (bản 1909). **Bài đầu tiên kiêm chạy thử quy trình** `them-tac-pham.md` sau làm lại: ghi mọi chỗ vướng của công cụ vào báo cáo | 2 |
| 2 | 2 | Gretchaninov, *Grandfather's Album* Op. 119, 2–3 bài (cần bản ghi tác giả mới) | 3 |
| 3 | 2 | Bartók, *Romanian Folk Dances* Sz. 56 | 5 |
| 4 | 3 | Chaminade, *Pierrette* Op. 41 | 6 |
| 5 | 3 | Clara Schumann, Scherzo số 2 Op. 14 | 6 |
| 6 | 3 | Chaminade, *Automne* Op. 35 số 2 (chốt 16/11/2026: không có bản thu Hensel được nhận) | 7 |
| 7 | 1 | Debussy, Arabesque số 1 | 6 |
| 8 | 1 | Rachmaninoff, Prelude Đô♯ thứ Op. 3 số 2 | 7 |
| 9 | 1 | Mozart, *Alla turca* (K. 331, chương 3), cặp với `nghe-nhac/mozart-k331` | 6 |
| 10 | 4 | Đã khảo sát và duyệt 24/11/2026 (`plans/ben-vung/khao-sat-dot-4.md`): Bach, Prelude và Fugue Sol thứ BWV 861 (chặng 7); Scarlatti, Sonata K. 208 (chặng 5); Haydn, Sonata Hob. XVI:27 chương 3 (chặng 5). Để sau: *Pathétique* trọn sonata, Scarlatti K. 380 | 5–7 |
| 11 | 5 | Khảo sát bản quyền rồi thêm tác phẩm Việt Nam hết bảo hộ, bài chặng 1–2 dùng dân ca Việt Nam | 1–6 |

Hướng dẫn nghe xen giữa các lượt, mỗi lượt bài học xong có thể làm một hướng dẫn nghe (mục 5).

Sau lượt 6 chặng 6 có 7 bài, chặng 7 có 5; sau lượt 9 chặng 6 có 9 bài: lượt 7–9 chỉ làm khi lượt 1–6 đã khóa. Nếu chặng 6 quá đông thì bỏ bớt một bài đợt 1 (gợi ý giữ Arabesque vì Ấn tượng còn mỏng, giữ Rachmaninoff vì lấp chặng 7).

## 2. Quy tắc chung (mọi lượt)

- Đọc trước: `AGENTS.md`, `plans/ben-vung/them-tac-pham.md` (quy trình, bảng file được chạm, lời giao mẫu), `plans/ben-vung/chuan-kiem-dinh.md` (nguồn, hồ sơ, khóa), khảo sát gốc `../opus-zero/plans/v16/khao-sat-g6.md` (mục của bài; khảo sát làm 22–23/10/2026, giấy phép và đề cương phải đọc lại).
- Mỗi tác phẩm một nhánh `them/<slug>` từ `main`; `tools/them-tac-pham.mjs` tạo khung; chỉ chạm file ở bảng mục 4 của `them-tac-pham.md` (`tests/pham-vi.test.mjs` chặn). Việc ngoài bảng (sửa trang đã khóa khác, bản ghi khác) làm ở nhánh riêng `mo/<việc>` theo thủ tục mở khóa, sau khi nhánh `them/` đã gộp.
- Kiểm định: lượt 1 do agent làm bài; lượt 2 do **một agent khác** chỉ nhận câu nhận định (`node tools/khoa.mjs xuat`), không đọc nguồn và kết luận của lượt 1; review đọc trang mới, bản ghi, hồ sơ (ít nhất 5 sự kiện ngẫu nhiên, trích đoạn so nguồn, giấy phép bản thu). Kiểm mẫu: chủ repo, hay Claude kiểm thay khi chủ repo giao, ghi rõ ở `nguoi.kiem_mau`.
- Bản quyền (tính đến 2026): tác giả mất từ 1975 trở về trước (Việt Nam) và ấn bản dùng cho trích đoạn xuất bản từ 1930 trở về trước (Mỹ). Bản thu: PD, CC0, CC BY, CC BY-SA 2.0–4.0, mẫu `{{Attribution}}` của Commons (`tools/audio/licenses.py`); phải dùng tự do cả ở Mỹ (bản thu 1926–1956 "PD ở EU" thì không). Không nhận NC, ND, nhạc dựng từ MIDI hay synthesizer.
- Cấp độ: đề cương ABRSM, Trinity (đúng kỳ), trang Henle của đúng tác phẩm; không có thì ước lượng và ghi "(ước lượng)" như các bài đã có. Chặng suy từ Grade: chặng 2 Grade 1–2, 3 Grade 3, 4 Grade 4–5, 5 Grade 6, 6 Grade 7–8, 7 sau Grade 8.
- Trích đoạn thật đối chiếu từng nốt với ấn bản hết bảo hộ (`chuan-kiem-dinh.md` mục 4); bài nào không có bản số mở thì chép tay từ bản quét và ghi trong hồ sơ.
- Bản thu IMSLP: chỉ dẫn link (khối nghe không phát, mốc tính theo file ở link). Cần file gốc để đo độ dài và căn mốc: **chủ repo tải tay** (không vượt cổng tải IMSLP) vào `../opus-zero/_imslp/` hay thư mục ở `OPUS_IMSLP`; agent ghi danh sách file cần tải vào báo cáo trước khi bắt đầu lượt. File cho lượt 1–9 và hướng dẫn nghe 1–3 đã tải đủ ngày 16/11/2026: mục 9.
- Mỗi lượt xong khi: `npm run build:xem`, `npm test` (gồm `tests/tac-pham.test.mjs`, `tests/pham-vi.test.mjs`) đạt; trang và bản ghi đã khóa; `npm run build` đạt; `OPUS_TRINH_DUYET=chromium npm run test:trinh-duyet` đạt trên trang mới; báo cáo `plans/ben-vung/bao-cao/them-<slug>.md` (nguồn, chỗ chưa chắc, file chủ repo phải tải, việc ngoài phạm vi); commit; gộp `main` khi chủ repo đồng ý. Không push.
- Sau mỗi đợt (nhánh `mo/`, có mở khóa): cập nhật `piano/tac-pham-theo-cap` (bài có bản ghi thì chặng phải khớp, `tests/tac-pham-theo-cap.test.mjs`), dòng tác phẩm ở `piano/nha-soan-nhac` nếu có ghi Grade lệch, danh sách "Thứ tự dự định" ở trang `ke-hoach`, và mục 6 của `ke-hoach-mo-rong.md`.

## 3. Đợt 2: Thế kỷ 20 (lượt 1–3)

### Lượt 1. Bartók, *For Children* Sz. 42, bản gốc 1909, tập I số 1 và số 6

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `bartok-for-children` (một trang cho hai bài), `bartok` (đã có trong `nha-soan-nhac.yml`) |
| Chặng, cấp | Chặng 2. Số 1: ABRSM Grade 1 (2015–2016), Trinity Grade 2 (từ 2023); Henle HN 1225: số 1 mức 1, số 6 mức 2 |
| Ấn bản | Rozsnyai, Budapest, 1909, R.K. 376 (IMSLP #893790). **Không dùng bản sửa Boosey & Hawkes 1946** (còn bảo hộ ở Mỹ): không lấy tên bài, số máy đếm nhịp của bản sửa |
| Đối chiếu | Không có bản số mở: chép tay từ bản quét Rozsnyai (bài rất ngắn). Bảng đổi số bản gốc và bản sửa: khảo sát G6, mục "Ghi chú: *For Children*" |
| Bản thu | Mississippi College Piano Pedagogy, CC BY-SA 4.0, IMSLP #469932 (số 1, 0:30), #469925 (số 6, 0:45): chỉ dẫn link, hai phần |
| Kỹ năng | Giai điệu dân ca trong thế tay hẹp, phát âm rõ (số 1); tay trái giữ giai điệu, điệu thức Rê Dorian (số 6) |
| Chủ repo tải | `PMLP3084-Children_At_Play_Bartok.mp3`, `PMLP3084-Study_for_Left_Hand_Bartok.mp3` (để đo độ dài, căn mốc tay) |
| Ghi chú | Hai bài ngắn: bảng "Theo dõi khi nghe" 5–6 dòng. Ghi trong báo cáo mọi chỗ công cụ `them-tac-pham.mjs`, `attach.py`, kiểm thử chưa hợp (đây là lượt chạy thử) |

### Lượt 2. Gretchaninov, *Grandfather's Album* (*Das Großvaterbuch*) Op. 119

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `gretchaninov-op119`; tác giả mới `gretchaninov` (Alexander Gretchaninov, 1864–1956): thêm bản ghi vào `nha-soan-nhac.yml` kèm hồ sơ (kiểm năm sinh–mất, thời kỳ) trước khi chạy `them-tac-pham.mjs` |
| Chọn bài | Gợi ý số 1 (*Meine liebe Mutti!*), số 4 (*Auf der Wiese*), số 7 (*Traurige Geschichte*); chốt sau khi xem bản nhạc |
| Chặng, cấp | Chặng 3, ước Grade 3 (không có trong ABRSM 2011–2028 và Trinity; pianosyllabus: số 1 AMEB 3, số 2 và 4 RCM 4) |
| Ấn bản | Schott, Mainz, khoảng 1929, số bản in 32355 (IMSLP #269926, #270502, #272596); hết bảo hộ ở Mỹ từ 1/1/2025 |
| Đối chiếu | Chép tay từ bản quét Schott |
| Bản thu | Jörg Römgens, CC BY-SA 4.0, IMSLP #517116–#517128 (số 1–13): chỉ dẫn link. Bản MCPP là NC: không nhận |
| Chủ repo tải | Các file `PMLP437344-GRETCHANINOV_-_Op.119_No.<N>_-_….mp3` của các bài đã chọn |
| Ghi chú | Thay cho Op. 98 trong `piano/tac-pham-theo-cap` (Op. 98 không có bản thu được nhận); sửa trang ấy ở nhánh `mo/` sau đợt |

### Lượt 3. Bartók, *Romanian Folk Dances* Sz. 56

| Mục | Nội dung |
|---|---|
| Slug | `bartok-romanian-folk-dances` |
| Chặng, cấp | Chặng 5 (trang `tac-pham-theo-cap` đã xếp chặng 5), ước Grade 6 cả bộ; từng điệu: số 3 ABRSM Grade 4 (2015–2016), số 4 Trinity Grade 5; Henle HN 1402: 3, 2, 3, 3, 4, 4 |
| Ấn bản | Universal Edition, U.E. 5802, 1918 (in lại không đổi 1921–1926). **Không dùng bản sửa UE 1934** (có thể còn bảo hộ ở Mỹ đến hết 2029). Bản quét IMSLP #918136: phải kiểm là bản in trước 1934 (không ghi thời lượng, không có "(1915)" sau ô cuối, điệu 4 tên *Tanz der Butschumer*) |
| Đối chiếu | Mutopia chỉ có điệu số 2 (thư mục `rom_folk_dance_1_bartok`, PD, theo UE 1918); năm điệu còn lại chép tay |
| Bản thu | Chris Breemer, CC0 1.0, IMSLP #991622, trọn sáu điệu, 5:22: chỉ dẫn link; mốc đo tay (mỗi điệu sau một quãng nghỉ) |
| Chủ repo tải | `PMLP3387-bartok-romanian-folk-dances-breemer.mp3` |
| Ghi chú | File Commons "Bartok - Romanian Folk Dances.ogg" là bản dàn nhạc: không dùng. Nếu bản quét không chứng minh được là bản trước 1934 thì dừng, ghi báo cáo, chuyển sang thay thế: Granados, *Cuentos de la juventud* Op. 1 (chặng 4; bản thu Chris Breemer CC0, IMSLP #937398) |

## 4. Đợt 3: nhà soạn nhạc nữ (lượt 4–6)

Liên hệ trang `lich-su/nu-nha-soan-nhac` (đã khóa): thêm link từ trang ấy sang bài mới là việc ngoài phạm vi, làm ở nhánh `mo/` sau đợt.

### Lượt 4. Chaminade, *Pierrette (Air de ballet)* Op. 41

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `chaminade-pierrette`, `chaminade` (đã có) |
| Chặng, cấp | Chặng 6. ABRSM Grade 8, danh sách C (2021–2028) |
| Ấn bản | Năm và nhà xuất bản lần đầu chưa kiểm (khảo sát): tra danh mục Citron hay BnF (`data.bnf.fr`). Bản quét IMSLP: M. Bernard, St. Petersburg (không năm); Carl Fischer 1914 |
| Đối chiếu | Không có bản số mở: chép tay |
| Bản thu | Luis Kolodin, CC BY-SA 4.0, IMSLP #848447: chỉ dẫn link; độ dài chưa kiểm |
| Chủ repo tải | `PMLP17439-chaminade-pierrette-op.41.mp3` |
| Kỹ năng | Vũ khúc ballet nhẹ, staccato và nốt lặp nhanh, chuyển giọng |

### Lượt 5. Clara Schumann, Scherzo số 2 Đô thứ Op. 14

| Mục | Nội dung |
|---|---|
| Slug, tác giả | `clara-schumann-scherzo-2`, `clara-schumann` (đã có) |
| Chặng, cấp | Chặng 6, ước Grade 8 (bằng chứng yếu: chỉ pianosyllabus PS 8). Tìm thêm bằng chứng; không có thì ghi "(ước lượng)" |
| Ấn bản | In 1845, Breitkopf & Härtel; bản quét IMSLP là *Pianoforte-Werke* Breitkopf 1879, số bản in 15120 |
| Đối chiếu | Chép tay |
| Bản thu | Luis Kolodin (IMSLP ghi nhà phát hành "Felipe Sarro"), CC BY-SA 4.0, IMSLP #292506: chỉ dẫn link. Ghi `by` đúng như IMSLP, kèm ghi chú về Felipe Sarro |
| Chủ repo tải | `PMLP90408-FSarro_ClaraSchumann_Scherzo_Op.14.mp3` |
| Ghi chú | Trước khi viết, tìm lại bản thu mở cho Op. 15 (ABRSM Grade 7–8, 2023–2028); có thì đổi sang Op. 15 số 4 hay số 1 (bằng chứng cấp mạnh hơn) |

### Lượt 6. Chaminade, *Automne* Op. 35 số 2

| Mục | Nội dung |
|---|---|
| Đã chốt | 16/11/2026: không có bản thu được nhận cho Hensel, *Mélodie* Op. 4 số 2 (Commons, trang IMSLP Op. 4 không có; chủ repo tra Musopen bằng trình duyệt: không có). Làm thay thế *Automne* |
| Hensel (không làm) | `hensel-melodie-op4-2`, tác giả `fanny-mendelssohn` (đã có, `cach_viet_khac`: "Fanny Mendelssohn Hensel"). Chặng 6: ABRSM Grade 7 danh sách B (2021–2028), Trinity Grade 7. Ấn bản Schlesinger, Berlin, 1847, S. 3294. Bản số WIMA (CC BY-NC-SA) chỉ dùng trên máy để đối chiếu, căn mốc |
| Làm: thay thế | Chaminade, *Automne*, *Études de concert* Op. 35 số 2: `chaminade-automne`, **chặng 7** (pianosyllabus mức diploma); Enoch, Paris, [1886]; bản thu Commons eldüendesüarez, CC BY-SA 4.0, 385,6 s, **phát được**. Lấp chặng 7 nhưng thành hai bài Chaminade. Bản nhạc đã tải: IMSLP #768244 (Enoch, trọn Op. 35). *Klage* của Backer Grøndahl chuyển sang hướng dẫn nghe (mục 7) |

## 5. Đợt 1: những bài người học hay hỏi (lượt 7–9)

### Lượt 7. Debussy, Arabesque số 1

`debussy-arabesque-1`, `debussy`. Chặng 6, ước Grade 7 (không có trong ABRSM, Trinity; pianosyllabus AMEB 7, RCM 10; Henle HN 380 mức 4). Ấn bản: Durand et Schoenewerk 1891; Durand & Fils 1904 (IMSLP #255354). Đối chiếu: Mutopia `DebussyC/L66/debussy_Arabesque_1` (PD, theo Durand 1904). Bản thu: Commons, Patrizia Prati, CC BY-SA 4.0, 292,99 s, **phát được** (thay thế: eldüendesüarez, 240,0 s). Mốc căn bằng `tools/audio/align` với MIDI Mutopia (thêm vào `sources.json`). Kỹ năng: hai chọi ba, hợp âm rải qua hai tay, bàn đạp nửa.

### Lượt 8. Rachmaninoff, Prelude Đô♯ thứ Op. 3 số 2

`rachmaninoff-prelude-do-thang-thu`, `rachmaninoff`. Chặng 7 ("Grade 8 trở lên": ABRSM chỉ có Op. 3 số 1, 3, 4 ở Grade 8; pianosyllabus mức diploma; Henle HN 1211 mức 5). Ấn bản Gutheil, Moskva, 1893 (IMSLP #868299). Đối chiếu: Mutopia `RachmaninoffS/O3/rach-prelude-op3-no2` (CC BY-SA 4.0, theo Bosworth 1896 / UE 1910) và đối chiếu thêm với Gutheil. Bản thu: Commons, chính tác giả, Edison 1919 (phát hành 12/1920, PD ở Mỹ), 227,91 s, **phát được**; ồn mặt đĩa nên căn mốc có thể phải đo tay (thay thế: Martin Wörner, CC BY-SA 4.0, 232,84 s). Sau đợt: sửa chặng ở `piano/tac-pham-theo-cap` (đang chặng 6) và Grade ở `piano/nha-soan-nhac` (nhánh `mo/`).

### Lượt 9. Mozart, *Alla turca*

`mozart-alla-turca`, `mozart`, `cap: nghe-nhac/mozart-k331`. Chặng 6: ABRSM Grade 8 danh sách A (2025–2026; không có ở 2027–2028); Henle HN 1300 mức 6. Ấn bản Artaria 1784 (IMSLP #292670); Alte Mozart-Ausgabe 1878. Đối chiếu: Mutopia `KV331_3_RondoAllaTurca` (PD; đã có trong `sources.json`), kern `sonata11-3.krn`. Bản thu: Commons, Romuald Greiss (thu 2000), PD-author, 180,53 s, **phát được** (thay thế: Luis Kolodin, IMSLP #815841, đã có trong `_imslp/`). **Việc ngoài phạm vi:** bản ghi `mozart-k331` (đã khóa) phải trỏ `cap` ngược lại, và đoạn "Năm bài học…" ở `piano/tac-pham/index`: làm ở nhánh `mo/` có mở khóa, sau khi `them/mozart-alla-turca` gộp.

## 6. Đợt 4 và 5 (lượt 10–11): khảo sát trước

Chưa có khảo sát đủ. Agent làm khảo sát như mục 1 của `them-tac-pham.md` (bảng: bản quyền, ấn bản, nguồn đối chiếu, bản thu, cấp, chỗ đứng), ghi `plans/ben-vung/khao-sat-dot-4.md` (hay `-dot-5.md`), chủ repo duyệt rồi mới viết.

- **Haydn** (chưa có bài nào): một sonata hay một chương, chặng 4–5; ưu tiên bài có trong ABRSM 2025–2028, có Mutopia hay kern (`craigsapp/haydn-piano-sonatas` nếu có), có bản thu phát được.
- **Chặng 7 không Lãng mạn**: một sonata Beethoven trọn vẹn (gợi ý *Pathétique*: đã có `nghe-nhac/beethoven-pathetique`, MIDI piano-midi ba chương trong `sources.json`, cặp `cap`); một Prelude và Fugue khác của Bình quân luật (đã có BWV 847 ở chặng 6). Kèm bài lõi về canon và mô phỏng nếu bài Bach cần (nguyên tắc lõi: `ke-hoach-mo-rong.md` mục 6).
- **Scarlatti** (chỉ có hướng dẫn nghe): bài học K. 380 (Henle mức 5, ABRSM Grade 7) cặp với `nghe-nhac/scarlatti-sonata`; đã có MIDI IMSLP K. 380 (`sources.json`, `imslp_Scarlatti_K380.mid`) để căn mốc.
- **Đợt 5, Việt Nam**: khảo sát riêng bản quyền (tác giả mất từ 1975 trở về trước; dân ca không tác giả), nguồn bản nhạc, bản thu; bài chặng 1–2 dùng dân ca Việt Nam soạn cho trang.

## 7. Hướng dẫn nghe (xen giữa các lượt)

Theo `ke-hoach-mo-rong.md` mục 6.2, ưu tiên mảng mỏng và bài đã có bản thu phát được:

| Thứ tự | Hướng dẫn nghe | Ghi chú |
|---|---|---|
| 1 | Debussy, *Golliwogg's Cakewalk* (Ấn tượng) | Commons eldüendesüarez CC BY 4.0, phát được; Durand 1908 |
| 2 | Backer Grøndahl, *Klage* Op. 36 số 1 (nhà soạn nhạc nữ) | *Automne* đã làm ở lượt 6. Commons, Tjako van Schie, CC BY-SA 4.0, 81 s, phát được; cần bản ghi tác giả mới `backer-grondahl`. Bản nhạc: Brødrene Hals [1895], IMSLP #82783 (không dùng #11480: bản "sửa" 1945) |
| 3 | Bartók, Sonatina Sz. 55 (Thế kỷ 20) | Commons La Pianista, CC BY-SA 3.0 (`commons.py` báo nhầm PD: đọc trang mô tả); trích đoạn phải theo bản in 1919. Chưa thống nhất: khảo sát ghi số bản in 3929 và bản quét IMSLP là bản sửa, nhưng IMSLP #893630 (đăng 2024) ghi "First edition", Rózsavölgyi 1919, số bản in 3953: kiểm trên bản quét trước khi viết |
| 4 | Mở thêm chương: *Ánh trăng* đủ ba chương; chương 3 cho `haydn-94`, `mozart-40`, `mozart-eine-kleine` | Sửa trang đã khóa: nhánh `mo/`, có mở khóa |

Hướng dẫn nghe dùng `node tools/them-tac-pham.mjs <slug> --loai nghe …`, cùng quy trình và điều kiện xong như bài học.

## 8. Lời giao mẫu

> Bạn làm **lượt N** của `plans/ben-vung/lo-trinh-them-tac-pham.md` trong repo opus: thêm **<tên>** (slug `<slug>`). Đọc `AGENTS.md`, `plans/ben-vung/them-tac-pham.md`, `plans/ben-vung/chuan-kiem-dinh.md`, mục 2 và mục của lượt N trong file lộ trình, và mục của bài trong `../opus-zero/plans/v16/khao-sat-g6.md`. Trước khi viết: đọc lại giấy phép bản thu và đề cương thi; liệt kê file IMSLP chủ repo cần tải tay. Tạo nhánh `them/<slug>` từ `main`, chỉ chạm file trong bảng mục 4 của `them-tac-pham.md`. Lượt 2 kiểm định giao cho một agent khác (không đưa nguồn, kết luận của lượt 1). Khi xong: các điều kiện ở mục 2 đạt, báo cáo `plans/ben-vung/bao-cao/them-<slug>.md`, commit. Không push, không gộp `main` khi chủ repo chưa đồng ý.

## 9. File đã tải (chủ repo, 16/11/2026)

Trong `../opus-zero/_imslp/`, tên file có tiền tố `IMSLP<số>-`. Link tải: `https://imslp.org/wiki/Special:ImagefromIndex/<số>`.

| Lượt | Bản thu | Bản nhạc |
|---|---|---|
| 1 | #469932 (số 1), #469925 (số 6) | #893790 (Rozsnyai 1909) |
| 2 | #517116 (số 1), #517119 (số 4), #517122 (số 7) | #269926 (Schott [1929]) |
| 3 | #991622 (Breemer) | #918136 (UE; còn phải kiểm là bản in trước 1934) |
| 4 | #848447 (Kolodin; đuôi `.mp3` nhưng là m4a, ffmpeg đọc được) | #07257 (M. Bernard) |
| 5 | #292506 (Kolodin / Felipe Sarro) | #611197 (Breitkopf 1879; không dùng #41477: W. Müller khoảng 1965) |
| 6 | Commons, không cần tải | #768244 (Enoch [1886]) |
| 7 | Commons; dự phòng #809126 (Kolodin) | #255354 (Durand 1904) |
| 8 | Commons; dự phòng #928449 (German Kitkin, flac) | #868299 (bản khắc Gutheil 1893, Boosey & Hawkes in lại 1992) |
| 9 | Commons; dự phòng #815841 (Kolodin, có từ trước) | #292670 (Artaria 1784) |
| Nghe 1 | Commons | #252526 (*Children's Corner*, Durand 1908) |
| Nghe 2 | Commons | #82783 (Op. 36 tập 1, Brødrene Hals [1895]) |
| Nghe 3 | Commons | #893630 (Rózsavölgyi 1919) |

Còn chưa tải: lượt 10–11 (chưa khảo sát).
