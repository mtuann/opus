"""Cấu hình căn mốc cho từng trang có bản thu gợi ý (đã dùng để tính ref hiện có trên trang, v13–v14).

PIECES[tên] = dict(page="đường dẫn trong docs/", jobs=[...]). Mỗi job căn trọn một phần của bản thu: bản nhạc
(sau segs, join) phải phủ mọi thứ phần đó chơi, từ nốt đầu tới nốt cuối.
- part: chỉ số phần trong parts của data-rec (từ 0, mặc định 0).
- src, read, qpm, tempi: nguồn bản nhạc: tên file trong sources.json. read thường đoán được từ tên (asap_…, dcml_…,
  .mid, .krn, .mei, .musicxml); "hand" là bản chép tay trong hand.py. kern, mei, musicxml, dcml cần qpm: tốc độ
  danh nghĩa, phách đen mỗi phút (chỉ để dựng bản nhạc, bộ căn tự kéo cho bằng bản thu).
- join: [dict(src=...), dict(src=...)] thay cho src: nối nhiều file liền nhau (chủ đề và từng biến tấu ở file riêng);
  chỉ số ô chạy liền qua các file (xem explore.py bars a b ...).
- Không có src hay join: các dòng trong rows là thời điểm cố định (giây trong phần), đã đo tay.
- segs: [(từ ô, đến ô)] nối các đoạn theo thứ tự bản thu chơi (dấu nhắc lại, đoạn bỏ qua); chỉ số ô trong nguồn.
- rows: {số thứ tự dòng của bảng "Theo dõi khi nghe", tính từ 0 (run.py in từ 1): vị trí}. Vị trí là chỉ số ô trong
  nguồn (có phần lẻ: 8.667 là phách 3 của ô 3/4 có chỉ số 8), 'first' (nốt đầu tiên), (đoạn, chỉ số ô) khi có
  segs, hoặc "start": lúc có tiếng đầu tiên của phần (dòng ứng với đầu một chương, một bài trong tập).
- anchors: [(vị trí, giây trong phần)] mốc neo đã biết chắc (đo trên phổ): căn từng khúc giữa các mốc neo.
- fix: {dòng: giây trong phần} giá trị đã kiểm tra tay trên phổ (khởi âm từng cao độ), dùng thay cho kết quả căn.
- check: nguồn bản nhạc thứ hai (độc lập) để đối chiếu, dạng dict(src=..., read=..., qpm=..., segs=..., rows={...}).
- wpitch, band: tham số căn (mặc định 0,6 và không giới hạn).
Giây trong anchors, fix và mốc cố định tính trong phần; run.py cộng độ dài các phần trước để ra ref.
Ghi chú bên phải: số ô trên bản nhạc in, hoặc cách đã đo mốc cố định.
"""
BACH846 = dict(src="asap_Bach_Prelude_bwv_846")
MOON = dict(src="cpm_mond_1.mid")
PATH2 = dict(src="asap_Beethoven_Piano_Sonatas_8-2")
NOCT = dict(src="kern_009-1-KI-002.krn", read="kern", qpm=90)
SCHUBERT = dict(src="asap_Schubert_Impromptu_op90_D899_3")
CLAIR = dict(src="cpm_deb_clai.mid")
LIEBES = dict(src="cpm_liz_liebestraum.mid", anchors=[(25, 61.5), (27, 73.4), (60, 133.5), (63, 145.8)])
# Mussorgsky, Những bức tranh (Mutopia, theo ấn bản Pavel Lamm): mười sáu MIDI theo thứ tự chơi; promenade-6 là
# Cum mortuis. Chỉ số ô ở đầu từng bài khi nối: Gnomus 24, Promenade 2 133, Lâu đài cổ 145, Promenade 3 252,
# Tuileries 260, Bydło 290, Promenade 4 354 (nốt đầu ở 354,4), Gà con 364, Goldenberg 467, Promenade 5 496,
# Limoges 521, Catacombae 561, Cum mortuis 591, Baba Yaga 612, Cổng lớn Kiev 823 (nốt đầu ở 823,221)
PICTURES = [dict(src="mutopia_pictures-%s.mid" % n) for n in (
    "promenade-1", "gnomus", "promenade-2", "il-vecchio-castello", "promenade-3", "tuileries", "bydlo", "promenade-4",
    "ballet", "two-jews", "promenade-5", "limoges", "catacombae", "promenade-6", "baba", "great-gate")]

PIECES = {
    "fur-elise": dict(page="piano/tac-pham/fur-elise.md", jobs=[
        dict(src="cpm_elise.mid", rows={0: 0.667, 1: 8.667, 2: 16.5, 3: 30.5, 4: 44.5, 5: 52.0, 6: 60.0, 7: 81.0, 8: 99.0, 9: 104.0},
             fix={6: 85.0, 7: 113.2})]),  # 6: A2 của ô 61 vang ở 86,3 s; 7: nốt La trầm liên tục bắt đầu 113,2 s (xem phổ)
    "bach-prelude-do": dict(page="piano/tac-pham/bach-prelude-do.md", jobs=[
        dict(BACH846, rows={0: "first", 1: 4, 2: 11, 3: 18, 4: 21, 5: 23, 6: 31, 7: 32, 8: 34},
             check=dict(src="cpm_bach_846.mid", segs=[(0, 34)], rows={1: (0, 4), 2: (0, 11), 3: (0, 18), 4: (0, 21), 5: (0, 23), 6: (0, 31), 7: (0, 32), 8: (0, 34)}))]),
    "bach-invention-1": dict(page="piano/tac-pham/bach-invention-1.md", jobs=[
        dict(src="kern_inven01.krn", read="kern", qpm=76, rows={0: "first", 1: 1, 2: 2, 3: 6, 4: 8, 5: 10, 6: 14, 7: 14.25, 8: 18})]),
    "bach-prelude-fugue-do-thu": dict(page="piano/tac-pham/bach-prelude-fugue-do-thu.md", jobs=[
        dict(part=0, src="cpm_bach_847.mid", segs=[(0, 37)], rows={0: (0, "first"), 1: (0, 4), 2: (0, 20), 3: (0, 27), 4: (0, 33)}),
        dict(part=1, src="cpm_bach_847.mid", segs=[(38, 68)], rows={5: (0, "first"), 6: (0, 40), 7: (0, 44), 8: (0, 46), 9: (0, 63)})]),
    "beethoven-anh-trang": dict(page="piano/tac-pham/beethoven-anh-trang.md", jobs=[
        dict(MOON, rows={0: "first", 1: 4.75, 2: 9, 3: 15, 4: 22.75, 5: 27, 6: 41, 7: 59},
             fix={2: 46.2, 6: 195.3},  # 2: Mi trầm + Sol♮ ở 46,2 s; 6: quãng tám Đô♯ trầm vang ở 195,3 s
             check=dict(src="kern_sonata14-1.krn", read="kern", qpm=50, rows={1: 4.75, 2: 9, 3: 15, 4: 22.75, 5: 27, 6: 41, 7: 59}))]),
    "beethoven-moonlight": dict(page="nghe-nhac/beethoven-moonlight.md", jobs=[
        dict(MOON, rows={0: "first", 1: 4.75, 2: 22.75, 3: 31, 4: 41, 5: 59}, fix={4: 195.3})]),
    "beethoven-op49-2": dict(page="piano/tac-pham/beethoven-op49-2.md", jobs=[
        dict(src="kern_sonata20-1.krn", read="kern", qpm=150, segs=[(0, 51), (0, 51), (52, 121)],
             rows={0: (0, "first"), 1: (0, 8), 2: (0, 14), 3: (0, 19.5), 4: (0, 35), 5: (1, 0), 6: (2, 52), 7: (2, 66), 8: (2, 81), 9: (2, 102)})]),
    "mozart-k545": dict(page="piano/tac-pham/mozart-k545.md", jobs=[
        # MIDI piano-midi.de viết ra cả phần trình bày nhắc lại (chỉ số 28–55); bản thu không nhắc lại
        dict(src="cpm_mz_545_1.mid", segs=[(0, 27), (56, 100)],
             rows={0: (0, "first"), 1: (0, 4), 2: (0, 12), 3: (0, 25), 5: (1, 56), 6: (1, 69), 7: (1, 85)},
             fix={6: 74.7},  # 6: Fa5–La5–Đô6 của chủ đề ở Fa trưởng: 74,7 / 75,7 / 76,2 s
             check=dict(src="kern_sonata15-1.krn", read="kern", qpm=130, rows={1: 4, 2: 12, 3: 25, 5: 28, 6: 41, 7: 57}))]),
    "pathetique-adagio": dict(page="piano/tac-pham/pathetique-adagio.md", jobs=[
        dict(PATH2, rows={0: "first", 1: 8, 2: 16, 3: 28, 4: 36, 5: 42, 6: 50, 7: 58, 8: 65},
             fix={3: 154.5},  # 3: quãng tám La♭ trầm + Đô4 ở 154,5 s
             check=dict(src="cpm_pathetique_2.mid", rows={1: 8, 2: 16, 3: 28, 4: 36, 5: 42, 6: 50, 7: 58, 8: 65}))]),
    "beethoven-pathetique": dict(page="nghe-nhac/beethoven-pathetique.md", jobs=[
        # Bản thu chương I trên Commons bị cắt ở khoảng 6:24 (giữa phần phát triển), có chơi dấu nhắc lại từ ô 11:
        # dùng MIDI piano-midi.de (đã viết ra phần nhắc lại), chỉ tới chỉ số 291
        dict(part=0, src="cpm_pathetique_1.mid", segs=[(0, 291)], rows={0: (0, "first"), 1: (0, 10), 2: (0, 50), 3: (0, 132), 4: (0, 254)}),
        dict(PATH2, part=1, rows={6: "first", 7: 16, 8: 36, 9: 50}),
        # ASAP 8-3 không khớp bản thu (thiếu đoạn): dùng MIDI piano-midi.de, chỉ số = số ô (ô 0 là nhịp lấy đà); coda từ ô 183
        dict(part=2, src="cpm_pathetique_3.mid", rows={10: "first", 11: 183})]),
    "brahms-intermezzo": dict(page="nghe-nhac/brahms-intermezzo.md", jobs=[
        dict(src="asap_Brahms_Six_Pieces_op_118_2", rows={0: "first", 1: 7.667, 2: 16, 3: 37.667, 4: 48, 5: 64, 6: 72, 7: 83.667, 8: 113.667},
             fix={5: 158.1})]),  # 5: hợp âm Fa♯ trưởng (La♯4, Fa♯4, Fa♯5) ở 158,1 s
    "chopin-ballade-1": dict(page="piano/tac-pham/chopin-ballade-1.md", jobs=[
        # neo theo phổ: đoạn valse (ô 138) bắt đầu 356 s sau chuỗi rải đi lên; chủ đề 2 trở lại (ô 166) sau chuỗi gam
        # đổ xuống, 405 s; ô 194 (meno mosso, âm nền Rê) 465,5 s
        dict(src="asap_Chopin_Ballades_1", anchors=[(137, 356.0), (165, 405.0), (193, 465.5)],
             rows={0: "first", 1: 7, 2: 39, 3: 67, 4: 93, 5: 105, 6: 137, 7: 165, 8: 193, 9: 207},
             fix={9: 506.6})]),  # coda: khởi âm trầm mạnh ở 506,6 s
    "chopin-etude": dict(page="nghe-nhac/chopin-etude.md", jobs=[
        dict(part=0, src="asap_Chopin_Etudes_op_10_3", rows={0: "first", 1: 20, 2: 37, 3: 45, 4: 53, 5: 61},
             fix={3: 157.2}),  # 3: quãng sáu kép dày đặc, hết nốt trầm, từ 157,2 s
        # ASAP 10/12 căn lệch cả chục giây ở cuối: dùng MIDI piano-midi.de (chỉ số = số ô − 1)
        dict(part=1, src="cpm_chpn_op10_e12.mid", rows={6: "first", 7: 9, 8: 28, 9: 76})]),
    "schubert-impromptu-sol-giang": dict(page="piano/tac-pham/schubert-impromptu-sol-giang.md", jobs=[
        dict(SCHUBERT, rows={0: "first", 1: 4, 2: 8, 3: 16, 4: 24, 5: 28, 6: 40, 7: 48, 8: 54, 9: 74})]),
    "schubert-impromptu": dict(page="nghe-nhac/schubert-impromptu.md", jobs=[
        dict(SCHUBERT, rows={0: "first", 1: 8, 2: 16, 3: 24, 4: 28, 5: 52, 6: 54, 7: 74})]),
    "chopin-prelude-la-truong": dict(page="piano/tac-pham/chopin-prelude-la-truong.md", jobs=[
        # bài ngắn, mỗi câu mở bằng nốt lấy đà khẽ: lấy thẳng khởi âm của nốt lấy đà (Mi4, Rê5+Fa♯5, Sol♯4, La♯4…)
        dict(src="cpm_chpn-p7.mid", rows={0: "first", 1: 2.667, 2: 4.667, 3: 6.667, 4: 8.667, 5: 10.667, 6: 12.667, 7: 14.667},
             fix={0: 0.7, 1: 4.64, 2: 8.68, 3: 12.77, 4: 17.14, 5: 20.99, 6: 25.3, 7: 30.4})]),
    "chopin-prelude-mi-thu": dict(page="piano/tac-pham/chopin-prelude-mi-thu.md", jobs=[
        dict(src="cpm_chpn-p4.mid", rows={0: "first", 1: 9, 2: 12, 3: 13, 4: 16, 5: 19, 6: 23, 7: 24},
             # 2: ô 12 (Sol4 trên hợp âm át) ở 46,3 s: Fa♯4 mở ô 10 và 11 ở 38,45 và 42,21 s, Rê5–Đô5–Si4 phách 4 của
             # ô 12 ở 48,95–50,0 s. Nguồn kern đối chiếu căn nhầm ô này vào 41,9 s (kiểm tra 10/2026)
             fix={2: 46.3},
             check=dict(src="kern_prelude28-04.krn", read="kern", qpm=60, rows={1: 9, 2: 12, 3: 13, 4: 16, 5: 19, 6: 23, 7: 24}))]),
    # kern bản in đầu (Kistner): ô 0 là nhịp lấy đà; cadenza ghi thành hai ô 33–34; mỗi câu bắt đầu bằng nhịp lấy đà
    # (móc đơn cuối ô trước)
    "chopin-nocturne-op9-2": dict(page="piano/tac-pham/chopin-nocturne-op9-2.md", jobs=[
        dict(NOCT, rows={0: "first", 1: 4.917, 2: 8.917, 3: 12.917, 4: 16.917, 5: 20.917, 6: 24.917, 7: 33, 8: 35},
             fix={7: 231.0, 8: 247.8})]),  # theo phổ: chuỗi nốt lặp rất cao của cadenza từ 231 s; hợp âm sau cadenza 247,8 s
    # kern bản in đầu: nhắc lại B+A' (ô 33–64) được viết ra thành ô 65–96, nên từ trio trở đi chỉ số = số ô + 32
    "chopin-valse-si-thu": dict(page="piano/tac-pham/chopin-valse-si-thu.md", jobs=[
        dict(src="kern_069-1-MEIf-002.krn", read="kern", qpm=150, rows={0: "first", 1: 17, 2: 33, 3: 49, 4: 65, 5: 97, 6: 113, 7: 129, 8: 145},
             fix={7: 156.2})]),  # 7: Fa♯5 lấy đà 155,7 s rồi Si trầm 156,2 s
    "chopin-fantaisie-impromptu": dict(page="piano/tac-pham/chopin-fantaisie-impromptu.md", jobs=[
        # neo theo khởi âm: quãng tám Sol♯ (hết ô 40) 60,8 s; Rê♭2 mở Largo (ô 41) 61,6 s, ô 42 64,8 s;
        # Moderato (ô 43) Rê♭2+Rê♭3 69,6 s; Presto trở lại (ô 83) 193,7 s
        dict(src="cpm_chpn_op66.mid", anchors=[(40, 61.6), (42, 69.6), (82, 193.7)],
             rows={0: "first", 1: 4, 2: 12, 3: 24, 4: 36, 5: 40, 6: 42, 7: 81, 8: 82, 9: 118},
             fix={4: 58.0, 9: 259.8})]),  # 4: đường đổ xuống từ âm vực cao bắt đầu 58 s; 9: Presto lặp lại dài như lần đầu (~54 s) nên coda ~260 s
    "clementi-sonatina": dict(page="piano/tac-pham/clementi-sonatina.md", jobs=[
        # bản thu không chơi dấu nhắc lại nào (dòng 1 để trống)
        dict(part=0, src="cpm_clementi_opus36_1_1.mid", segs=[(0, 14), (30, 52)], rows={0: (0, "first"), 2: (1, 30), 3: (1, 38)}),
        dict(part=1, src="cpm_clementi_opus36_1_2.mid", rows={4: "first", 5: 8, 6: 18}),
        # chương III: căn không ổn định (bản thu nhanh, cấu trúc không khớp MIDI), chỉ giữ mốc đầu chương
        dict(part=2, src="cpm_clementi_opus36_1_3.mid", rows={7: "first"})]),
    "debussy-clair-de-lune": dict(page="piano/tac-pham/debussy-clair-de-lune.md", jobs=[
        dict(CLAIR, rows={0: "first", 1: 14, 2: 18, 3: 26, 4: 36, 5: 42, 6: 50, 7: 65},
             fix={5: 162.3})]),  # 5: âm nền La♭ trầm của Calmato vang ở 162,3 s
    # MIDI piano-midi.de: ô 0 là nhịp lấy đà; cadenza 1 ở chỉ số 25–26, cadenza 2 ở 60–62, Tempo I (chủ đề trở lại) ở 63.
    # Bản thu 1923 rất nhiễu: neo theo phổ (cadenza 1 hình tam giác 61,5 s; Si trưởng 73,4 s; cadenza 2 chuỗi đổ xuống
    # 133,5 s; Tempo I 145,8 s)
    "liszt-liebestraum": dict(page="piano/tac-pham/liszt-liebestraum.md", jobs=[
        dict(LIEBES, rows={0: "first", 1: 25, 2: 27, 3: 37, 4: 43, 5: 60, 6: 63, 7: 78})]),
    "liszt-liebestraum-nghe": dict(page="nghe-nhac/liszt-liebestraum.md", jobs=[
        dict(LIEBES, rows={0: "first", 1: 13, 2: 25, 3: 27, 4: 37, 5: 43, 6: 60, 7: 63, 8: 78})]),
    # MIDI có nhắc lại (chỉ số 9–16 = ô 1–8 lần hai, 17–32 = ô 9–24); mỗi câu bắt đầu bằng nhịp lấy đà (phách 4 ô trước)
    "schumann-traumerei": dict(page="piano/tac-pham/schumann-traumerei.md", jobs=[
        dict(src="cpm_scn15_7.mid", rows={0: "first", 1: 4.75, 2: 8.75, 3: 16.75, 4: 20.75, 5: 24.75, 6: 28.75, 7: 31})]),
    # chép tay (hand.py): lượt 1 = ô 1–32 + kết 1 (chỉ số 0–38), lượt 2 = ô 1–32 + kết 2 (39–77)
    "satie-gymnopedie": dict(page="piano/tac-pham/satie-gymnopedie.md", jobs=[
        dict(src="satie_gymnopedie1", read="hand", qpm=66, rows={0: "first", 1: 4.333, 2: 12.333, 3: 21, 4: 32, 5: 39, 6: 60, 7: 71})]),
    # đoạn A (ô 1–16) căn bằng DTW trên khối ABC của trang; bản thu không chơi dấu nhắc lại; ô 25 ngoại suy theo tốc độ ô 9–16
    "minuet-sol": dict(page="piano/tac-pham/minuet-sol.md", jobs=[dict(rows={0: 0.9, 1: 11.5, 3: 22.2, 4: 33.0})]),
    # mốc đầu từng biến tấu = nốt đầu tiên của phần (đo trên 300 KB đầu mỗi file)
    "bach-goldberg": dict(page="nghe-nhac/bach-goldberg.md", jobs=[
        dict(part=0, rows={0: 1.76}), dict(part=1, rows={1: 0.28}), dict(part=3, rows={2: 0.14}), dict(part=10, rows={3: 0.21}),
        dict(part=13, rows={4: 0.09}), dict(part=15, rows={5: 0.46}), dict(part=16, rows={6: 0.95}), dict(part=25, rows={7: 0.0}),
        dict(part=26, rows={8: 0.42}), dict(part=30, rows={9: 0.19}), dict(part=31, rows={10: 0.07})]),
    # mỗi dòng là lúc bắt đầu một bài: thời điểm có tiếng đầu tiên của phần ("start")
    "debussy-preludes": dict(page="nghe-nhac/debussy-preludes.md", jobs=[dict(part=k, rows={k: "start"}) for k in range(12)]),
    "schumann-kinderszenen": dict(page="nghe-nhac/schumann-kinderszenen.md", jobs=[
        dict(part=0, rows={0: 0.51}), dict(part=1, rows={1: 0.23}), dict(part=3, rows={2: 0.26}), dict(part=4, rows={3: 0.35}),
        dict(part=5, rows={4: 0.23}), dict(part=6, rows={5: 0.51}), dict(part=7, rows={6: 0.91}), dict(part=9, rows={7: 0.33}),
        dict(part=10, rows={8: 0.42}), dict(part=11, rows={9: 0.33}), dict(part=12, rows={10: 0.44})]),

    # Bản thu Commons và IMSLP thêm ở v14; bản nhạc là MIDI Mutopia (chỉ số ô = số ô in − 1, hoặc tính từ nhịp lấy đà)
    # bản thu chơi A A B A B A (sau mỗi lần B đều quay lại A)
    "musette-re": dict(page="piano/tac-pham/musette-re.md", jobs=[
        dict(src="mutopia_anna-magdalena-22.mid", segs=[(0, 7), (0, 7), (8, 19), (0, 7), (8, 19), (0, 7)],
             rows={0: (0, "first"), 1: (1, 0), 2: (2, 8), 3: (2, 12), 4: (2, 18), 5: (4, 8), 6: (5, 0)})]),
    # nhịp lấy đà = móc đơn cuối ô (vị trí 5/6 của ô 6/8)
    "mendelssohn-thuyen-ca": dict(page="piano/tac-pham/mendelssohn-thuyen-ca.md", jobs=[
        dict(src="mutopia_gondellied-op19-6.mid", rows={0: "first", 1: 6.833, 2: 10.833, 3: 17, 4: 25, 5: 33.833, 6: 39})]),
    # bản thu: A A B (B không nhắc lại); A = ô 1–8, B = ô 9–24
    "mozart-minuet-k2": dict(page="piano/tac-pham/mozart-minuet-k2.md", jobs=[
        dict(src="mutopia_menuet_k2.mid", segs=[(0, 7), (0, 7), (8, 23)],
             rows={0: (0, "first"), 1: (1, 0), 2: (2, 8), 3: (2, 12), 4: (2, 16), 5: (2, 20)})]),
    # bản thu: A A B B (A = ô 1–16, B = ô 17–32); không có Minuet Sol trưởng
    "minuet-sol-thu": dict(page="piano/tac-pham/minuet-sol-thu.md", jobs=[
        dict(src="mutopia_anna-magdalena-05.mid", segs=[(0, 15), (0, 15), (16, 31), (16, 31)],
             rows={0: (0, "first"), 1: (0, 8), 2: (1, 0), 3: (2, 16), 4: (2, 24), 5: (3, 16)})]),
    # MIDI Mutopia của Melodie và Fröhlicher Landmann đã viết theo thứ tự chơi (nhịp lấy đà: ô tính từ nốt lấy đà)
    "schumann-album": dict(page="piano/tac-pham/schumann-album.md", jobs=[
        dict(part=0, src="mutopia_schumann-op68-01-melodie.mid", rows={0: "first", 1: 8, 2: 12, 3: 16}),
        # Wilder Reiter: MIDI Mutopia căn không ổn định với bản thu này; mốc theo phổ: bản thu chơi A B A (không nhắc
        # lại A), đoạn B (Fa trưởng, giai điệu ở tay trái Đô3–Fa3–La3) từ 9,5 s; A trở lại khớp đoạn đầu ở 18,5 s
        dict(part=1, rows={4: 0.4, 5: 9.5, 6: 18.5}),
        dict(part=2, src="mutopia_schumann-op68-10-gai-laboureur.mid", rows={7: "first", 8: 8, 9: 14})]),
    # thứ tự in: A 0–7, B 8–14, kết 1 = 15, kết 2 + coda 16–22; bản thu: A A B(kết 1) B(kết 2) coda
    "burgmuller-la-candeur": dict(page="piano/tac-pham/burgmuller-la-candeur.md", jobs=[
        dict(src="mutopia_25EF-01.mid", segs=[(0, 7), (0, 7), (8, 15), (8, 14), (16, 22)],
             rows={0: (0, "first"), 1: (1, 0), 2: (2, 8), 3: (2, 12), 4: (3, 8), 5: (4, 16), 6: (4, 20)})]),
    # thứ tự in: dẫn nhập 0–1, A 2–8, kết 1 = 9, kết 2 = 10, B+A' 11–25, kết 1 = 26, kết 2 = 27, coda 28–32
    "burgmuller-arabesque": dict(page="piano/tac-pham/burgmuller-arabesque.md", jobs=[
        dict(src="mutopia_25EF-02.mid", segs=[(0, 9), (2, 8), (10, 10), (11, 26), (11, 25), (27, 32)],
             rows={0: (0, "first"), 1: (0, 2), 2: (1, 2), 3: (3, 11), 4: (3, 19), 5: (4, 11), 6: (4, 19), 7: (5, 28)},
             fix={1: 3.44})]),  # 1: La4 mở đoạn A ở 3,44 s, sau bốn hợp âm dẫn nhập 1,25–2,95 s (kiểm tra 10/2026)
    # Mutopia đã viết theo thứ tự chơi (A A B A, 32 ô); có nhịp lấy đà nên ô tính từ nốt lấy đà
    "tchaikovsky-bai-ca-phap-co": dict(page="piano/tac-pham/tchaikovsky-bai-ca-phap-co.md", jobs=[
        dict(src="mutopia_16OldFrenchSong.mid", rows={0: "first", 1: 8, 2: 16, 3: 20, 4: 22, 5: 24},
             # 3: Fa♯4+La4 mở ô 21 ở 41,3 s, Rê5 nửa phách sau ở 41,8 s (kiểm tra 10/2026);
             # 4: Đô5 lấy đà 45,1 s, hợp âm ô 23 ở 45,65 s
             fix={3: 41.3, 4: 45.1})]),
    "tchaikovsky-cau-nguyen-buoi-sang": dict(page="piano/tac-pham/tchaikovsky-cau-nguyen-buoi-sang.md", jobs=[
        dict(src="mutopia_01MorningPrayer.mid", rows={0: "first", 1: 4, 2: 8, 3: 11, 4: 12, 5: 14, 6: 15, 7: 17, 8: 20},
             # 4: Mi♭5+Si4 mở ô 13 ở 36,3 s (kiểm tra 10/2026; trang đang ghi 37, lệch 0,7 s);
             # coda: hợp âm Sol (Si3+Si4) 45,3 s; bảy giảm cao Fa♯5+Đô5 48,0; Sol4+Si4 50,85; bảy giảm Đô♯4+Si♭2 58,9 s
             fix={4: 36.3, 6: 45.3, 7: 50.8, 8: 58.9})]),
    "bach-prelude-bwv939": dict(page="piano/tac-pham/bach-prelude-bwv939.md", jobs=[
        dict(src="mutopia_bwv-939.mid", rows={0: "first", 1: 3, 2: 5, 3: 8, 4: 11, 5: 12, 6: 13, 7: 14},
             fix={1: 6.2})]),  # 1: hợp âm Sol4–Đô5–Mi5 rải ở 6,2 s, tay trái Đô3–Mi3–Sol3 sau đó
    # MEI (TROMPA, ấn bản Breitkopf). Chương I: bản thu chơi dấu nhắc lại ô 9–24.
    # Chương II: bản thu chậm (♩. ≈ 33) và không chơi dấu nhắc lại nào: dòng "A nhắc lại" để trống;
    # A' (nhịp lấy đà Si4–Đô5–Rê5 ở cuối ô MEI 23) khớp đoạn mở đầu ở 76,4 s
    "beethoven-sonatina-sol": dict(page="piano/tac-pham/beethoven-sonatina-sol.md", jobs=[
        dict(part=0, src="Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei", read="mei", qpm=100, segs=[(0, 7), (8, 23), (8, 23), (24, 33)],
             rows={0: (0, "first"), 1: (1, 8), 2: (1, 16), 3: (2, 8), 4: (3, 24)}),
        dict(part=1, src="Beethoven_WoOAnh5_Nr1_2-Breitkopf.mei", read="mei", qpm=80, rows={5: "first", 7: 9, 8: 22.5, 9: 31},
             fix={8: 76.4})]),
    # bảng nốt DCML (Grieg Lyric Pieces), 23 ô, không có dấu nhắc lại
    "grieg-arietta": dict(page="piano/tac-pham/grieg-arietta.md", jobs=[
        dict(src="dcml_op12n01", read="dcml", qpm=60, rows={0: "first", 1: 4, 2: 8, 3: 10, 4: 12, 5: 16, 6: 18, 7: 22},
             fix={7: 76.8})]),  # 7: Sol5 lặp của chủ đề ở 76,7 s, bè trầm Mi♭3 ở 77,2 s

    # Hướng dẫn nghe nhạc piano, bản thu thêm ở v15 (G4b). Chưa có bản nhạc số đáng tin cho các tác phẩm có dàn nhạc:
    # chỉ ghi các dòng ứng với đầu một chương ("start"); dòng giữa chương để trống.
    # Smullyan chỉ chơi K. 380 và không chơi dấu nhắc lại: hợp âm Si trưởng khép nửa đầu ở 85,9 s, tắt hẳn ở 87,25 s;
    # nửa sau vào ở 87,5 s (khởi âm đầu tiên sau khoảng lặng)
    "scarlatti-sonata": dict(page="nghe-nhac/scarlatti-sonata.md", jobs=[dict(rows={0: "start", 3: 87.5})]),
    # chỉ có chương 3. Bốn giây đầu file là tiếng ồn nền (khoảng −50 dBFS) nên "start" bắt nhầm ở 0,1 s; theo phổ,
    # Đô trưởng vào ở 4,0 s (to rõ từ 5,0 s)
    "mozart-concerto-21": dict(page="nghe-nhac/mozart-concerto-21.md", jobs=[dict(rows={8: 4.0})]),
    # chương II: tám giây đầu là tiếng ồn nền (khoảng −64 dBFS), "start" bắt nhầm ở 1,1 s; dây câm tiếng vào ở 8,5 s
    # (hợp âm Rê♭ trưởng)
    "grieg-concerto": dict(page="nghe-nhac/grieg-concerto.md", jobs=[
        dict(part=0, rows={0: "start"}), dict(part=1, rows={6: 8.5}), dict(part=2, rows={8: "start"})]),
    "rachmaninoff-2": dict(page="nghe-nhac/rachmaninoff-2.md", jobs=[
        dict(part=0, rows={0: "start"}), dict(part=1, rows={4: "start"}), dict(part=2, rows={5: "start"})]),
    # mặt thứ nhất: 0,7 giây đầu chỉ có tiếng rè của đĩa, clarinet vào ở 0,75 s
    "gershwin-rhapsody": dict(page="nghe-nhac/gershwin-rhapsody.md", jobs=[dict(part=0, rows={0: 0.75})]),
    # MIDI Mutopia đã viết ra phần trình bày nhắc lại (chỉ số 55–109 = ô 1–55 lần hai), bản thu có chơi nhắc lại; từ phát
    # triển trở đi chỉ số = số ô + 54. Ô 11: violin hát Rê–Mi, ô 12 viola và cello đáp lại; ô 18 đoạn chuyển (sf);
    # ô 28 chủ đề 2 (Rê trưởng); ô 35 phần kết; ô 56 phát triển; ô 76 tái hiện; ô 101 chủ đề 2 ở Sol trưởng.
    # Đối chiếu: ấn bản Breitkopf 1883 trên Mutopia (137 ô, không viết ra nhắc lại)
    "mozart-eine-kleine": dict(page="nghe-nhac/mozart-eine-kleine.md", jobs=[
        dict(src="mutopia_eine-kleine-nachtmusik-mvt1.mid", rows={0: "first", 1: 10, 2: 17, 3: 27, 4: 34, 5: 110, 6: 130, 7: 155},
             check=dict(src="mutopia_MozartWA-KV525-mov-01.mid", segs=[(0, 54), (0, 54), (55, 136)],
                        rows={1: (0, 10), 2: (0, 17), 3: (0, 27), 4: (0, 34), 5: (2, 55), 6: (2, 75), 7: (2, 100)}),
             # kiểm tra trên phổ (10/2026): ô 11 bè trầm tắt, violin vào ở 19,0 s, viola và cello đáp ở 20,75 s; ô 76 bè
             # trầm vào lại ở 233,2 s. 5: căn ra 200,4 s nhưng tiếng đồng âm forte mở phần phát triển vang ở 199,2 s
             fix={5: 199.2})]),
    # MIDI Mutopia bắt đầu bằng nhịp lấy đà (móc đơn) nên ô in n bắt đầu ở chỉ số n − 1 + 0,125. Theo các chữ đánh dấu
    # trong bản LilyPond: B (chim hót) giữa ô 13; tutti lấy đà cuối ô 27; C (suối) ô 31 từ móc đơn thứ hai; Forte lấy đà
    # cuối ô 40; D (sấm sét) ô 44; tutti lấy đà cuối ô 55 (Đô♯ thứ); E (chim hót) ô 59; Tutti ô 66; Solo từ phách 3 ô 70
    # (violin I, II và viola nghỉ ô 71–75, chỉ còn bè trầm); Tutti ô 76, ritornello cuối, Piano từ phách 4 ô 79
    "vivaldi-mua-xuan": dict(page="nghe-nhac/vivaldi-mua-xuan.md", jobs=[
        # neo theo khởi âm (kiểm tra 10/2026: biến thể khởi-âm và thô→mịn cùng căn nhầm ritornello 2 vào 66 s): tutti lấy
        # đà sau khoảng lặng 70,1–70,4 s ở 70,45 s; Forte lấy đà sau khoảng lặng ở 103,2 s; tutti Đô♯ thứ lấy đà 138,05 s;
        # Đô♯ mở ô 59 (chim hót trở lại) 146,0 s.
        # Sau ô 59 căn tự động không dùng được (ô 66 ra 157,8 / 159,4 s; ô 70–79 dồn về một điểm ở hai biến thể): neo theo
        # khởi âm (10/2026). Ô 66: Sol♯5, Si2 164,49 s, Đô♯3 (cello, móc đơn lặp) và Mi4 164,58 s, mức âm từ −40 lên −28 dB;
        # Fa♯3 phách 3 ở 165,79 s, Si2 mở ô 67 ở 167,00 s. Ô 70: Mi3 cello 174,61 / 174,99 / 175,31 s, Si2 175,50 s, violin
        # độc tấu Fa♯5 ở phách 3 175,96 s rồi Si4, Rê♯5 (móc kép). Ô 76: sau trill Fa♯5–Sol♯5 (191,98–192,59 s), tutti
        # Mi3 + Mi4 + Mi5 ở 192,63 s
        dict(src="mutopia_spring-score.mid", anchors=[(27.0, 70.45), (40.0, 103.2), (55.0, 138.05), (58.125, 146.0),
                                                      (65.125, 164.5), (69.625, 175.96), (75.125, 192.63)],
             rows={0: "first", 1: 12.625, 2: 27.0, 3: 30.25, 4: 40.0, 5: 43.125, 6: 55.0, 7: 58.125, 8: 65.125, 9: 69.625,
                   10: 75.125},
             # 5: ba biến thể lệch nhau (110,9 / 115,4 / 113,2 s); quãng tám Si (Si2, Si3, Si4) mở tiếng sấm ở 111,0 s, chuỗi
             # nốt đi lên của ô 45 ở 113,5 s
             fix={5: 111.0})]),
    # Chưa có bản nhạc số trong sources.json: đo trên bản thu (10/2026). Bản nhạc (bản khắc WIMA của André Van Ryckeghem,
    # 1999; bản LilyPond chép theo bản thảo, github.com/rdj/music): nhịp lấy đà + 56 ô, A 1–16 | ‖: B 17–24 :‖ |
    # ‖: A' 25–32, C 33–40 :‖ | A'' 41–52 | coda 53–56; bản thu chơi đủ các dấu nhắc lại. Đã kiểm thêm bằng DTW trên
    # bản LilyPond (ngoài repo): cách nối có đủ nhắc lại cho chi phí thấp nhất, ba biến thể cho các mốc dưới đây trong
    # khoảng 0,8 giây. Khởi âm ở đầu đoạn: Mi4 lấy đà 0,26 s; B (Mi2 trầm, Mi5) 26,0 và 38,75 s; A' (La2 + La4 mở ô 25)
    # 51,2 s (50,4 s là hợp âm phách 3 của ô 24), lần hai Mi4 lấy đà cuối ô 40 ở 74,9 s (ô 25 ở 75,4 s); C (Mi2 trầm,
    # Si5 mở ô 33) 64,0 và 87,5 s (Mi2 87,35, Si5 87,54); A'' Mi4 lấy đà 98,3 s; coda: Đô3 mở ô 53 ở 117,6 s
    # (Đô6 118,1 s, hợp âm phách 2 118,5 s)
    "chopin-valse-la-thu": dict(page="piano/tac-pham/chopin-valse-la-thu.md", jobs=[
        dict(rows={0: 0.26, 1: 26.0, 2: 38.75, 3: 51.2, 4: 64.0, 5: 74.9, 6: 87.5, 7: 98.3, 8: 117.6})]),
    # Bản thu Chiara Bertoglio (IMSLP), một file 33:44. Neo ở đầu các bài đứng sau khoảng lặng, đo bằng khởi âm của nốt
    # đầu trong MIDI (10/2026): Gnomus Si2–Si3 88,4 s; Promenade 2 Fa3 250,9 s; Promenade 3 La♭3–La♭4 577,3 s;
    # Promenade 4 hợp âm Rê thứ (Rê5–Fa5–La5–Rê6) 843,9 s; Promenade 5 Sol4 1084,4 s; Baba Yaga Fa♯–Sol quãng tám 1553,8 s.
    # Các bài vào liền (Bydło, Goldenberg, Catacombae, Kiev) căn bằng DTW giữa các mốc neo
    "mussorgsky-tranh": dict(page="nghe-nhac/mussorgsky-tranh.md", jobs=[
        dict(join=PICTURES, anchors=[(24, 88.4), (133, 250.9), (252, 577.3), (354.4, 843.9), (496, 1084.4), (612, 1553.8)],
             rows={0: "first", 1: 24, 2: 133, 3: 252, 4: 290, 5: 354.4, 6: 467, 7: 496, 8: 561, 9: 612, 10: 823.221},
             # kiểm tra trên khởi âm (10/2026): Catacombae Si1–Si2–Si3 1272,7 s và Kiev (hợp âm Mi♭ trưởng ngân 1740,8 s)
             # khớp kết quả căn. 4: căn ra 661,5–663,0 s, nhưng hợp âm đầu của Bydło (Rê♯2, Sol♯2) vang ở 660,4 s;
             # 6: căn ra 967,8 s, quãng tám Si♭ đồng âm mở Goldenberg vang ở 969,8 s
             fix={4: 660.4, 6: 969.8})]),
    # Mozart K. 331, Luis Kolodin (IMSLP). Chương I: MIDI Mutopia của chủ đề và sáu biến tấu đã viết ra dấu nhắc lại
    # (36 ô mỗi phần, biến tấu 6: 44), bản thu chơi đủ: biến tấu 1, 3, 4, 5, 6 bắt đầu ở chỉ số 36, 108, 144, 180, 216.
    # Chương II, III: kern (Craig Sapp) nối theo thứ tự chơi bằng segs; structure cho thấy bản thu chơi mọi dấu nhắc
    # lại, Menuetto da capo không nhắc lại. Menuetto: A = 0–17, B = 18–47, Trio C = 48–63, D = 64–98, kết 1 = 99,
    # kết 2 = 100; đối chiếu bằng MIDI Mutopia (đã viết ra dấu nhắc lại, Trio ở chỉ số 96). Alla turca: mỗi đoạn mở bằng
    # một ô lẻ có nhịp lấy đà ở nửa sau (chỉ số 9, 26, 35, 44…); hành khúc La trưởng lấy đà ở 26,5, đoạn Fa♯ thứ ở
    # 35,5, coda ở 107 (ô 99)
    "mozart-k331": dict(page="nghe-nhac/mozart-k331.md", jobs=[
        dict(part=0, join=[dict(src="mutopia_KV331_1_%s.mid" % n) for n in (
            "1_tema", "2_var1", "3_var2", "4_var3", "5_var4", "6_var5", "7_var6")],
             rows={0: "first", 1: 36, 2: 108, 3: 144, 4: 180, 5: 216},
             # căn không ổn định (biến tấu 3, 4: ba biến thể lệch nhau; biến tấu 1, 5 lệch hơn 1 giây). Đo trên khởi âm
             # các nốt đầu của từng biến tấu trong MIDI (10/2026), giây trong file gốc IMSLP (nhạc vào ở 2,95 s):
             # BT1 Đô5 → Đô♯5 82,05/82,37 s, La3 + Mi4 82,6 s; BT3 La3 + Đô5 (Đô bình, sang La thứ) 250,75 s; BT4 sau hợp
             # âm kết của BT3, mức âm hạ và Đô♯5, La2–La3 vào ở 334,25 s; BT5 La3 + Đô♯5 423,55 s; BT6 La3 + Đô♯5 + Rê5 609,15 s
             fix={1: 82.05, 2: 250.75, 3: 334.25, 4: 423.55, 5: 609.15}),
        dict(part=1, src="kern_sonata11-2.krn", read="kern", qpm=120,
             segs=[(0, 17), (0, 17), (18, 47), (18, 47), (48, 63), (48, 63), (64, 98), (99, 99), (64, 98), (100, 100),
                   (0, 17), (18, 47)],
             rows={6: (0, "first"), 7: (4, 48)},
             check=dict(src="mutopia_KV331_2_1_menuetto.mid", rows={7: 96})),
        dict(part=2, src="kern_sonata11-3.krn", read="kern", qpm=112,
             segs=[(0, 8), (0, 8), (9, 25), (9, 25), (26, 34), (26, 34), (35, 43), (35, 43), (44, 60), (44, 60), (61, 69),
                   (61, 69), (70, 78), (70, 78), (79, 95), (79, 95), (96, 104), (105, 105), (96, 104), (106, 106), (107, 136)],
             rows={8: (0, "first"), 9: (4, 26.5), 10: (6, 35.5), 11: (20, 107)},
             # kiểm tra trên khởi âm (10/2026): 9: hai nốt lấy đà La5, Si5 (forte) của hành khúc ở 46,76 / 47,00 s (căn ra
             # 47,0–48,7 s); 10: lấy đà Đô♯6–Rê6 61,9 s, Fa♯3 62,3 s, khớp kết quả căn; 11: biến thể khởi-âm và thô→mịn cùng
             # căn coda vào khoảng 211 s, chỉ 3 giây trước khi hết bài; Đô♯6 nhấn mạnh mở ô 99 ở 188,6 s (biến thể thường 189,0)
             fix={9: 46.76, 11: 188.6})]),
}
