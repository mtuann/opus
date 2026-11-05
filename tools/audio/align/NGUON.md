# Nguồn bản nhạc số dùng để căn mốc

Bộ căn mốc (`run.py`) cần bản nhạc dạng số của tác phẩm. Các file dưới đây được tải về máy bằng `fetch.py` (danh sách đầy đủ, link và sha256 trong `sources.json`). Chúng **không đưa lên git và không đăng lên site**: site chỉ ghi thời điểm đo trên bản thu (mảng `ref` trong `data-rec`), không chép nội dung bản nhạc số. Một số bộ chỉ cho dùng phi thương mại (NC); dùng trên máy để căn mốc cho một site giáo dục phi lợi nhuận là đúng phạm vi đó, nhưng đừng phân phối lại các file.

Giấy phép ghi ở đây là giấy phép chính chủ ghi trong kho hoặc trong file, đã đọc ngày 22/10/2026. Link GitHub trong `sources.json` ghim theo commit, để tải lại đúng bản đã dùng.

## Các bộ dữ liệu

| Bộ (`set` trong sources.json) | Nguồn | Giấy phép | Dùng cho |
|---|---|---|---|
| `asap` | ASAP (Aligned Scores and Performances), https://github.com/fosfrancesco/asap-dataset: `midi_score.mid` và `midi_score_annotations.txt` (phách, ô nhịp) | CC BY-NC-SA 4.0 (README của kho) | Bach Prelude BWV 846; Beethoven Sonata số 8, chương II; Brahms Op. 118 số 2; Chopin Ballade số 1, Étude Op. 10 số 3; Schubert Impromptu D. 899 số 3 |
| `piano-midi` | Bernd Krüger, http://www.piano-midi.de (MIDI chơi theo bản nhạc, có sắc thái) | CC BY-SA 3.0 Đức (ghi công: Bernd Krueger, http://www.piano-midi.de). Site chặn yêu cầu tự động (mã 418), nên câu giấy phép được đọc qua bản trích trong tệp bản quyền của gói Debian `midicsv`: "The MIDI, audio(MP3, OGG) and video files of Bernd Krueger are licensed under the cc-by-sa Germany License" | 18 file `cpm_*.mid`: Für Elise, Ánh trăng (chương I), Pathétique (ba chương), Bach BWV 846 và 847, Chopin Prelude số 4 và 7, Étude Op. 10 số 12, Fantaisie-Impromptu, Clementi Op. 36 số 1, *Clair de lune*, *Liebestraum* số 3, K. 545 (chương I), *Träumerei*. Phải tải tay bằng trình duyệt; link trong `sources.json` theo mẫu `midis/<tác giả>/<tên>.mid` của site, chưa mở thử được. Bản đã dùng nằm trong `_imslp/_scripts/align/src/` |
| `kernscores-beethoven` | Craig Stuart Sapp, https://github.com/craigsapp/beethoven-piano-sonatas (theo ấn bản Durand 1915) | Kho không ghi giấy phép | Sonata số 14 (chương I, để đối chiếu), số 20 (chương I) |
| `kernscores-mozart` | Craig Stuart Sapp, https://github.com/craigsapp/mozart-piano-sonatas (theo Alte Mozart-Ausgabe) | CC BY-NC-SA 4.0 (`LICENSE.txt`) | K. 545, chương I (`sonata15-1.krn`); K. 331, cả ba chương (`sonata11-1a.krn` đến `-1g` là chủ đề và sáu biến tấu, `sonata11-2.krn`, `sonata11-3.krn`); đều để đối chiếu |
| `kernscores-chopin-preludes` | Craig Stuart Sapp, https://github.com/craigsapp/chopin-preludes | Kho không ghi giấy phép; file ghi "Copyright 2001 by Craig Stuart Sapp" | Prelude Op. 28 số 4 (để đối chiếu) |
| `kernscores-bach` | KernScores (https://kern.humdrum.org), Invention số 1 BWV 772 | File ghi "Copyright 1994, David Huron. Rights to all derivative electronic formats reserved." | Invention số 1. Tháng 10/2026 KernScores chuyển hướng sang trang bảo trì, nên `fetch.py` đánh dấu tải tay; bản đã dùng nằm trong `_imslp/_scripts/align/src/` |
| `chopin-first-editions` | Viện Fryderyk Chopin (NIFC), https://github.com/pl-wnifc/humdrum-chopin-first-editions | CC BY 4.0 (`LICENSE.txt`) | Nocturne Op. 9 số 2 (bản Kistner), Valse Op. 69 số 2 |
| `dcml-grieg` | DCML, https://github.com/DCMLab/grieg_lyric_pieces: bảng nốt và ô nhịp TSV | CC BY-NC-SA 4.0 (README và `LICENSE`) | Grieg Arietta Op. 12 số 1 |
| `trompa-beethoven` | Werner Goebl (mdw), dự án TROMPA, https://github.com/trompamusic-encodings/Beethoven_WoOAnh5_BreitkopfHaertel: MEI theo ấn bản Breitkopf & Härtel | CC BY 4.0 (`LICENSE.md`) | Sonatina Sol trưởng Anh. 5 số 1, hai chương |
| `mutopia` | Mutopia Project, https://www.mutopiaproject.org: file MIDI do Mutopia dựng từ bản LilyPond (`ly` trong sources.json là bản nguồn); bài nhiều phần được đóng gói thành `<tên>-mids.zip`, `member` trong sources.json là file lấy ra | Theo từng bài, xem bảng dưới | 39 file, xem bảng dưới |

Bản chép tay trong `hand.py`: Gymnopédie số 1 (Satie, xuất bản 1888, phạm vi công cộng), chép cao độ và trường độ theo bản LilyPond của https://github.com/rileylev/gymnopedie (kho không ghi giấy phép).

## Mutopia: giấy phép từng bài

| File | Tác phẩm | Mã Mutopia | Giấy phép (trường `license`/`copyright` trong file `.ly`) |
|---|---|---|---|
| `mutopia_bwv-939.mid` | Bach: Prelude Đô trưởng BWV 939 | Mutopia-2008/11/06-1593 | CC BY-SA 3.0 |
| `mutopia_anna-magdalena-05.mid` | Petzold: Minuet Sol thứ BWV Anh. 115 | Mutopia-2015/08/21-76 | Phạm vi công cộng |
| `mutopia_anna-magdalena-22.mid` | Musette Rê trưởng BWV Anh. 126 | Mutopia-2013/01/06-79 | Phạm vi công cộng |
| `mutopia_menuet_k2.mid` | Mozart: Minuet Fa trưởng K. 2 | Mutopia-2016/11/30-1770 | Phạm vi công cộng |
| `mutopia_schumann-op68-01-melodie.mid` | Schumann: Melodie Op. 68 số 1 | Mutopia-2007/02/11-647 | CC BY-SA 2.5 |
| `mutopia_schumann-op68-10-gai-laboureur.mid` | Schumann: Fröhlicher Landmann Op. 68 số 10 | Mutopia-2007/02/11-659 | CC BY-SA 2.5 |
| `mutopia_25EF-01.mid` | Burgmüller: La candeur Op. 100 số 1 | Mutopia-2013/01/12-202 | Phạm vi công cộng |
| `mutopia_25EF-02.mid` | Burgmüller: Arabesque Op. 100 số 2 | Mutopia-2013/01/12-203 | Phạm vi công cộng |
| `mutopia_01MorningPrayer.mid` | Tchaikovsky: Cầu nguyện buổi sáng Op. 39 số 1 | Mutopia-2015/07/09-2032 | Phạm vi công cộng |
| `mutopia_16OldFrenchSong.mid` | Tchaikovsky: Bài ca Pháp cổ Op. 39 số 16 | Mutopia-2015/11/27-2080 | Phạm vi công cộng |
| `mutopia_gondellied-op19-6.mid` | Mendelssohn: *Venetianisches Gondellied* Op. 19 số 6 | Mutopia-2009/06/12-1679 | CC BY 3.0 |
| `mutopia_eine-kleine-nachtmusik-mvt1.mid` | Mozart: *Eine kleine Nachtmusik* K. 525, chương 1 (MIDI viết ra phần trình bày nhắc lại) | Mutopia-2007/01/01-900 | Phạm vi công cộng |
| `mutopia_MozartWA-KV525-mov-01.mid` | Mozart: *Eine kleine Nachtmusik* K. 525, chương 1, theo ấn bản Breitkopf & Härtel 1883 (file trong `MozartWA-KV525-mids.zip`; dùng để đối chiếu) | Mutopia-2018/08/04-2230 | Phạm vi công cộng |
| `mutopia_spring-score.mid` | Vivaldi: *La primavera* (Mùa xuân) Op. 8 số 1, chương 1 (file trong `spring-mids.zip`; `spring-score-1.mid`, `-2.mid` là chương 2, 3) | Mutopia-2010/02/08-301 | CC BY-SA 3.0 |
| `mutopia_KV331_1_1_tema.mid` … `mutopia_KV331_1_7_var6.mid` | Mozart: Sonata La trưởng K. 331, chương 1: chủ đề và sáu biến tấu (bảy file, MIDI viết ra dấu nhắc lại; theo ấn bản Breitkopf & Härtel) | Mutopia-2005/10/29-614 đến -617, Mutopia-2005/10/30-618 đến -620 | Phạm vi công cộng |
| `mutopia_KV331_2_1_menuetto.mid` | Mozart: K. 331, chương 2 (Menuetto và Trio, viết ra dấu nhắc lại) | Mutopia-2005/10/29-613 | Phạm vi công cộng |
| `mutopia_KV331_3_RondoAllaTurca.mid` | Mozart: K. 331, chương 3 (*Alla turca*, viết ra dấu nhắc lại) | Mutopia-2015/08/13-108 | Phạm vi công cộng |
| `mutopia_pictures-promenade-1.mid` … `mutopia_pictures-great-gate.mid` | Mussorgsky: *Những bức tranh ở phòng triển lãm*, bản piano theo ấn bản Pavel Lamm (16 file trong `pictures-at-an-exhibition-mids.zip`; `promenade-6` là *Cum mortuis*) | Mutopia-2016/12/31-475 | CC BY-SA 4.0 |

Ở v14, 11 MIDI đầu tiên trong bảng được dựng trên máy bằng LilyPond 2.25.12 từ file `.ly`. Nay `fetch.py` tải MIDI dựng sẵn của Mutopia: cùng nốt với bản v14, trừ hai nốt ở La candeur (không ảnh hưởng căn mốc). Hai bài Minuet K. 2 và Minuet Sol thứ ở v14 dùng bản đã viết ra dấu nhắc lại; nay `pieces.py` nối đoạn bằng `segs`, cho ra đúng từng nốt như trước. Các file thêm ở v15 (K. 525, *Mùa xuân*, K. 331) lấy thẳng từ Mutopia.

## Thêm một nguồn mới

1. Tìm bản nhạc số đúng tác phẩm và đúng chương; mở file xem đầu file ghi tác phẩm gì (năm 2026 phát hiện file `sonata16-1.krn` dùng để đối chiếu K. 545 ở v13 thật ra là sonata Si♭ trưởng K. Anh. 136).
2. Đọc giấy phép trong kho hoặc trong file, thêm một dòng vào bảng trên (hoặc bảng Mutopia).
3. Thêm một mục vào `sources.json`: tên file, `set`, `url` (GitHub thì ghim theo commit), `sha256`; `manual: true` nếu phải tải tay.
4. `python3 tools/audio/align/fetch.py <tên file>`, rồi `python3 tools/audio/align/explore.py bars <tên file>` để xem chỉ số ô.
