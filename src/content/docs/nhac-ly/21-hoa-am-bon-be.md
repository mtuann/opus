---
title: 21. Hòa âm bốn bè
description: Phần Hòa âm mở rộng và phân tích (bài 21–27) dành cho bạn đã vững các bài trước. Bài đầu tiên dạy cách viết hợp âm cho bốn giọng hát, cách mà Bach viết hàng…
---

Phần **Hòa âm mở rộng và phân tích** (bài 21–27) dành cho bạn đã vững các bài trước. Bài đầu tiên dạy cách **viết** hợp âm cho bốn giọng hát, cách mà Bach viết hàng trăm bài thánh ca (chorale).

## Bốn bè và âm vực

| Bè | Giọng | Âm vực thường dùng | Khuông |
|---|---|---|---|
| **S** (soprano) | Nữ cao | Đô4 – Sol5 | Khóa Sol, đuôi nốt hướng lên |
| **A** (alto) | Nữ trầm | Sol3 – Rê5 | Khóa Sol, đuôi nốt hướng xuống |
| **T** (tenor) | Nam cao | Đô3 – Sol4 | Khóa Fa, đuôi nốt hướng lên |
| **B** (bass) | Nam trầm | Fa2 – Rê4 | Khóa Fa, đuôi nốt hướng xuống |


::hinh{ten="ranges-satb"}

## Xếp một hợp âm

Hợp âm ba có 3 nốt mà có 4 bè, nên phải **nhân đôi** một nốt.

1. **Bè bass** chơi nốt quyết định thể của hợp âm (xem [bài 11](/opus/nhac-ly/11-hop-am-bay/)).
2. Với hợp âm ba thể gốc, thường **nhân đôi nốt gốc**.
3. **Không bao giờ nhân đôi cảm âm** (bậc 7), vì nó phải đi lên chủ âm, nhân đôi sẽ sinh quãng 8 song song.
4. **Khoảng cách**: S–A và A–T không quá một quãng 8; T–B có thể xa hơn.
5. Các bè **không bắt chéo** nhau (alto không cao hơn soprano…).

## Dẫn bè: bốn quy tắc vàng

1. **Giữ nốt chung** giữa hai hợp âm ở cùng một bè, nếu có.
2. Các bè trên đi **bước liền** hoặc bước nhảy nhỏ; bè bass được nhảy.
3. **Cấm quãng 5 và quãng 8 song song**: hai bè đang cách nhau quãng 5 (hoặc 8) không được cùng chuyển sang một quãng 5 (hoặc 8) khác. Chúng làm hai bè "dính" vào nhau, mất tính độc lập.
4. **Giải quyết đúng**: cảm âm đi **lên** chủ âm; nốt 7 của hợp âm bảy đi **xuống** bước liền.

Ưu tiên **chuyển động ngược** (một bè lên, bè kia xuống) giữa bè ngoài cùng (soprano và bass).

Nhìn các bè như những đường giai điệu:

::hinh{ten="voice-leading"}

## Ví dụ: I – IV – V – I ở Đô trưởng

```abc
X:1
T:I – IV – V – I, dẫn bè đúng
L:1/2
M:4/2
Q:1/2=60
%%score {S B}
V:S clef=treble
V:B clef=bass
K:C
[V:S] [Ec] [Fc] [DB] [Ec] |]
[V:B] [C,G,] [F,,A,] [G,,G,] [C,G,] |]
```

Đọc từ dưới lên ở mỗi hợp âm: bass – tenor (khuông dưới), alto – soprano (khuông trên).

- I → IV: soprano **giữ** Đô (nốt chung); alto và tenor đi lên bước liền, bass nhảy xuống quãng 5 tới Fa.
- IV → V: bass đi **lên** bước liền (Fa → Sol), ba bè trên đi xuống ngược chiều; không có quãng song song cấm.
- V → I: **cảm âm Si đi lên Đô** ở soprano; tenor giữ Sol (nốt chung).

**Lỗi cần tránh**, quãng 5 song song:

```abc
X:2
T:Sai: quãng 5 song song (Đô–Sol rồi Rê–La)
L:1/2
M:2/2
K:C clef=bass
[C,G,] [D,A,] |]
```

## Bài tập viết

1. Viết I – V – I ở Sol trưởng cho bốn bè (bass: Sol – Rê – Sol).
2. Viết I – vi – IV – V – I ở Đô trưởng. Kiểm tra từng cặp bè xem có quãng 5 hoặc 8 song song không.
3. Lấy một bài thánh ca của Bach trong [IMSLP](https://imslp.org/) (tìm "371 Chorales"), chọn 4 ô nhịp và gọi tên từng hợp âm.

```quiz
? Với hợp âm ba thể gốc, nên nhân đôi nốt nào?
+ Nốt gốc
- Nốt ba
- Cảm âm
> Nhân đôi nốt gốc cho âm thanh vững nhất.
? Vì sao không nhân đôi cảm âm?
+ Vì nó phải đi lên chủ âm, nhân đôi sẽ gây quãng 8 song song
- Vì cảm âm nghe không hay
- Vì cảm âm quá cao
> Cả hai bè sẽ cùng đi lên chủ âm.
? Khoảng cách nào được phép lớn hơn một quãng 8?
- Soprano – alto
- Alto – tenor
+ Tenor – bass
> Các bè trên giữ gần nhau.
? Trong V7 → I, nốt 7 của hợp âm bảy đi đâu?
+ Xuống bước liền
- Lên bước liền
- Giữ nguyên
> Ví dụ Fa đi xuống Mi trong G7 → C.
```

## Nguồn

- Open Music Theory: [Chords in SATB style](https://viva.pressbooks.pub/openmusictheory/chapter/chords-in-satb-style/); [First-Species Counterpoint](https://viva.pressbooks.pub/openmusictheory/chapter/first-species-counterpoint/).
- Andre Mount, *Fundamentals, Function, and Form*: [14. Three- and Four-Voice Progressions](https://milnepublishing.geneseo.edu/fundamentals-function-form/chapter/14-three-and-four-voice-progressions/); sách bài tập, [Guide to SATB part-writing](https://milnepublishing.geneseo.edu/fundamentals-function-form-workbook/front-matter/guide-to-satb-part-writing/).
- Iowa State University, *Comprehensive Musicianship*: [10.1 Chord Voicing and Voice Leading: General Principles](https://iastate.pressbooks.pub/comprehensivemusicianship/chapter/10-1-chord-voicing-and-voice-leading-general-principles-tutorial/).
- *The Concise Oxford Dictionary of Music* (Encyclopedia.com): [soprano](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/soprano), [alto](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/alto), [tenor](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/tenor), [bass](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/bass).
- IMSLP: Bach, [371 Vierstimmige Choralgesänge](https://imslp.org/wiki/371_Vierstimmige_Choralges%C3%A4nge_(Bach,_Johann_Sebastian)).
- Xem [tài liệu tham khảo](/opus/tai-lieu-tham-khao/).
