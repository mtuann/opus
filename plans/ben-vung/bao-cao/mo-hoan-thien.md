# mo/hoan-thien: việc còn lại của kế hoạch mở rộng, trừ thêm bài mới (09/11/2026)

Chủ repo: làm hết mục 3 (việc agent làm được), mục 2 (quyết định) giao Claude chốt, riêng `grade` lệch nguồn giữ cách ước lượng của site. Kết quả từng mục ghi ngay trong `plans/ben-vung/ke-hoach-mo-rong.md` (mục 2, 3, 4.3, 5.2, 7).

## Đã sửa trang hay dữ liệu (mở khóa, khóa lại)

| Mục | Trang, bản ghi | Sửa |
|---|---|---|
| 3.8 | `du-lieu/tac-pham/bach-invention-1` n28, `du-lieu/tac-pham/rachmaninoff-2` n9 (cùng hai trang dùng bản ghi, không đổi chữ) | `note` của bản thu ghi rõ giấy phép (Commons API và IMSLP wikitext đọc lại 09/11/2026) |
| 4.3.2 | `beethoven-sonatina-sol` n18, `clementi-sonatina` n19, `tchaikovsky-bai-ca-phap-co` n23 (cùng ba bài học, chỉ đổi dòng Độ khó của hộp thông tin; `doi_chu` ghi) | "(ước lượng)" thay bằng đề cương ABRSM, dữ kiện như n4 đã qua lượt 2 |
| 5.2 | `nghe-nhac/schubert-impromptu` | Mốc dòng 3: 94 giây (ô 24), đo bằng `tools/audio/align/run.py` (ba biến thể 94,2 / 94,0 / 94,2) |

## Mã và công cụ

- Bộ lọc Thời kỳ của danh mục gom về bảy thời kỳ (`THOI_KY`, `NHOM_THOI_KY`, `src/plugins/thanh-phan.mjs`); kiểm thử.
- `ra_soat` trong `src/data/trang.yml` (schema `src/du-lieu.mjs`, `tools/ra-lai.mjs`); kiểm thử.
- `commons.license_templates`, `check_audio.py`; kiểm thử Python.
- `src/scripts/thu-am.js`: id bản thu không trùng.
- `src/content/i18n/vi.json`: chữ nút chép khối mã.

## Kiểm

`npm run build` (243 trang), `npm test`, `node tools/khoa.mjs tinh`; kiểm thử trình duyệt Chromium trên trang danh mục, các trang đã sửa và `kiem-luyen-tap-d7.mjs`; Lighthouse ba trang (mục 7.2).

## Không làm được, để lại

- 4.3.1 Scarlatti: không mở được bản nhạc (xem kế hoạch).
- 5.2 các mốc còn lại: cần người nghe đo tay.
- 7.1 khuông câm trên iPhone im lặng: cần thử trên máy thật.

## Bổ sung: Scarlatti (nhánh `mo/scarlatti`, 09/11/2026)

- Chủ repo tải tay ba MIDI trên IMSLP (K. 380, K. 141, K. 466; Pierre Gouin, Les Éditions Outremontaises 2013, CC BY-SA 4.0), để ở `.cache/imslp/` (không đưa lên git), và gửi ảnh trang 1 bản Longo.
- Đọc MIDI (mido): K. 380 nửa đầu 40 ô kết ở Si trưởng, nửa sau 38 ô về Mi trưởng, ô 20–25 và 36–40 trở lại dịch xuống quãng năm ở ô 58–63, 66–69, 74–78 (đoạn "vần"); K. 141 kết Rê thứ; K. 466 nửa đầu 34 ô kết ở Đô thứ, nửa sau 42 ô về Fa thứ. Hồ sơ `nghe-nhac/scarlatti-sonata` (mở rồi khóa lại): n14, n29, n30, n31 lượt 2 từ `khong-chac` thành `dung`, n28 ghi ô của môtip mới.
- Mốc K. 380 dòng 2: ô 19 (môtip nốt lặp nhịp chấm có trill ở Si trưởng, "a tempo" ở bản Longo), 36,6 giây ở cả ba biến thể của `tools/audio/align`; trang ghi 37. Dòng 4 (ô 41) căn lại ra 87,5–87,6 giây, khớp mốc 88 đã có. Job mới trong `pieces.py`, file ở `sources.json` (bộ `imslp-outremontaises`, tải tay), `NGUON.md`.
- Kiểm: `npm run build`, `npm test`, `khoa.mjs tinh`, `so-chu.mjs --doi-chu`, `check_audio.py --static`, Chromium trên trang đổi (207 đạt).
