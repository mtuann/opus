---
title: 14. Ký hiệu biểu diễn
description: Ngoài cao độ và trường độ, bản nhạc còn cho biết chơi nhanh hay chậm, to hay nhỏ, liền hay ngắt. Phần lớn các ký hiệu này dùng tiếng Ý, loại thuật ngữ được đưa…
---

Ngoài cao độ và trường độ, bản nhạc còn cho biết **chơi nhanh hay chậm, to hay nhỏ, liền hay ngắt**. Phần lớn các ký hiệu này dùng tiếng Ý, loại thuật ngữ được đưa vào từ thế kỷ 17 và dùng đến nay.

Hầu hết thuật ngữ trong bài đều có trong [từ điển thuật ngữ](/opus/nhac-ly/tu-dien/), kèm thẻ ghi nhớ để ôn.

## Tốc độ

Thuật ngữ tốc độ chính đã có ở trang [máy đếm nhịp](/opus/luyen-tap/metronome/). Các thuật ngữ thay đổi tốc độ:

| Ký hiệu | Nghĩa |
|---|---|
| *accelerando* (accel.) | Nhanh dần |
| *ritardando* (rit.), *rallentando* (rall.) | Chậm dần |
| *a tempo* | Trở lại tốc độ ban đầu |
| *rubato* | Co giãn tốc độ tự do để diễn cảm |
| *più mosso* / *meno mosso* | Nhanh hơn / chậm hơn |

## Cường độ (sắc thái)

| Ký hiệu | Tên | Nghĩa |
|---|---|---|
| **pp** | pianissimo | Rất nhỏ |
| **p** | piano | Nhỏ |
| **mp** | mezzo piano | Hơi nhỏ |
| **mf** | mezzo forte | Hơi to |
| **f** | forte | To |
| **ff** | fortissimo | Rất to |
| *cresc.* hoặc < | crescendo | To dần |
| *dim.*, *decresc.* hoặc > | diminuendo | Nhỏ dần |
| **sfz** | sforzando | Nhấn mạnh đột ngột một nốt |
| **fp** | forte-piano | To rồi nhỏ ngay |

Cây đàn piano có tên đầy đủ là *pianoforte*, nghĩa là "nhỏ – to": khác harpsichord, nó chơi to hay nhỏ theo lực ngón (clavichord cũng làm được, nhưng rất nhỏ tiếng). Xem [Lịch sử cây đàn piano](/opus/piano/lich-su-dan/).

```abc
X:1
T:Sắc thái: nhỏ, to dần, to, nhỏ dần
L:1/4
M:4/4
Q:1/4=90
K:C
!p! C D E F | !crescendo(! G A B c !crescendo)! | !f! c B A G | !diminuendo(! F E D C !diminuendo)! |]
```

## Cách diễn tấu (articulation)

| Ký hiệu | Tên | Nghĩa |
|---|---|---|
| Chấm trên/dưới nốt | staccato | Ngắt ngắn |
| Đường cong nối các nốt | legato (dấu luyến) | Chơi liền mạch |
| > | accent | Nhấn |
| Gạch ngang ngắn | tenuto | Giữ đủ độ dài, hơi nhấn |
| Vòng cung có chấm | fermata | Ngân dài tùy ý |

```abc
X:1
T:Staccato – legato – accent – tenuto – fermata
L:1/4
M:4/4
Q:1/4=90
K:C
.C .D .E .F | (G A B c) | !>!c !>!G !tenuto!E !tenuto!C | !fermata!C4 |]
```

## Thuật ngữ tính cách

*dolce* (ngọt ngào), *cantabile* (như hát), *espressivo* (diễn cảm), *con brio* (sôi nổi), *maestoso* (trang trọng), *agitato* (kích động), *grazioso* (duyên dáng), *sostenuto* (ngân giữ), *sotto voce* (khẽ khàng).

## Dấu nhắc lại và chỉ đường

| Ký hiệu | Nghĩa |
|---|---|
| Vạch kép có hai chấm, ở đầu và cuối đoạn | Nhắc lại đoạn giữa hai dấu |
| Ngoặc 1., 2. (prima/seconda volta) | Lần 1 chơi ngoặc 1, lần nhắc lại bỏ qua ngoặc 1, chơi ngoặc 2 |
| *D.C.* (Da Capo) | Quay lại từ đầu |
| *D.S.* (Dal Segno) | Quay lại từ dấu Segno |
| *Fine* | Kết thúc ở đây (sau khi quay lại) |
| *al Coda* và dấu Coda (vòng tròn có dấu cộng) | Nhảy tới phần Coda |

```abc
X:1
T:Nhắc lại với ngoặc 1 và 2
L:1/4
M:4/4
Q:1/4=110
K:C
|: C D E F |[1 G F E D :|[2 G G c2 |]
```

## Nốt hoa mỹ

| Ký hiệu | Tên | Cách chơi |
|---|---|---|
| *tr* | Láy rền (trill) | Đổi nhanh liên tục giữa nốt chính và nốt trên |
| Răng cưa ngắn, không gạch | Láy trên (upper mordent) | Nốt chính – nốt trên – nốt chính, rất nhanh |
| Răng cưa ngắn, có gạch dọc | Láy dưới (mordent) | Nốt chính – nốt dưới – nốt chính, rất nhanh |
| Hình chữ S nằm ngang | Láy quanh (turn) | Nốt trên – nốt chính – nốt dưới – nốt chính |
| Nốt nhỏ có gạch chéo | Acciaccatura | Nốt luyến cực nhanh ngay trước nốt chính |
| Nốt nhỏ không gạch | Appoggiatura | Nốt dựa, chiếm một phần độ dài nốt chính |

## Một số ký hiệu khác

- **8va** — chơi cao hơn một quãng tám so với nốt viết; **8vb** — thấp hơn một quãng tám.
- **Ped.** và dấu \* — nhấn và nhả bàn đạp vang của piano.
- **pizz.** (pizzicato) — đàn dây gảy bằng ngón tay; **arco** — trở lại kéo vĩ.

:::tip[Luyện tập kèm theo]
[Thẻ thuật ngữ](/opus/nhac-ly/tu-dien/) mỗi ngày, và [máy đếm nhịp](/opus/luyen-tap/metronome/) để cảm nhận các tốc độ Adagio, Allegro…
:::

:::tip[Trên phím đàn]
Vài ký hiệu hay gặp trên bản nhạc piano: *Ped.* và \* (nhấn và nhả bàn đạp vang), *una corda* / *tre corde* (bàn đạp trái), *m.d.* / *m.s.* (tay phải / tay trái). Xem [Bàn đạp](/opus/piano/ban-dap/) và [Nốt hoa mỹ](/opus/piano/not-hoa-my/), nơi giải thích kỹ các loại láy.
:::

```quiz
? Ký hiệu mf nghĩa là gì?
- Rất to
+ Hơi to
- Hơi nhỏ
> mezzo forte.
? "a tempo" nghĩa là gì?
- Chậm dần
+ Trở lại tốc độ ban đầu
- Tự do về tốc độ
> Thường xuất hiện sau rit. hoặc rall.
? Chấm nhỏ trên nốt nhạc nghĩa là gì?
+ Staccato, ngắt ngắn
- Chấm dôi, dài thêm một nửa
- Fermata, ngân dài
> Chấm dôi nằm bên phải nốt, staccato nằm trên hoặc dưới đầu nốt.
? D.C. al Fine nghĩa là gì?
- Nhảy tới Coda
+ Quay lại từ đầu và dừng ở chữ Fine
- Nhắc lại đoạn giữa hai dấu nhắc lại
> Da Capo: "từ đầu".
? pizzicato là kỹ thuật của nhạc cụ nào?
- Piano
+ Đàn dây như violin, cello
- Kèn đồng
> Gảy dây bằng ngón tay thay vì kéo vĩ.
```

## Nguồn

- *Open Music Theory*, [Glossary](https://viva.pressbooks.pub/openmusictheory/back-matter/glossary/).
- *The Concise Oxford Dictionary of Music* (Kennedy, Bourne) qua [Encyclopedia.com](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/rubato): các mục rubato, ritardando, accelerando, fermata, da capo, dal segno, coda, acciaccatura, appoggiatura, mordent, turn…
- Trinity College London, bảng thuật ngữ và ký hiệu (cấp độ 1-2); Dolmetsch Online, *Music Theory Online: Musical Terms*.
- Catherine Schmidt-Jones, *Understanding Basic Music Theory*: [Repeats and Other Musical Road Map Signs](https://human.libretexts.org/Bookshelves/Music/Music_Theory/Understanding_Basic_Music_Theory_(Schmidt-Jones)/02%3A_Notation_-_Time/2.09%3A_Repeats_and_Other_Musical_Road_Map_Signs).
- Xem [tài liệu tham khảo](/opus/tai-lieu-tham-khao/).
