---
title: 28. Kết cấu âm nhạc
description: "Kết cấu (texture) mô tả có bao nhiêu đường nét âm nhạc vang lên cùng lúc và chúng liên hệ với nhau thế nào. Nó giống như cách dệt của một tấm vải: một sợi…"
---

**Kết cấu** (texture) mô tả **có bao nhiêu đường nét âm nhạc vang lên cùng lúc và chúng liên hệ với nhau thế nào**. Nó giống như cách dệt của một tấm vải: một sợi, nhiều sợi song song, hay nhiều sợi đan chéo. Đây là một trong những manh mối để [nhận diện thời kỳ](/opus/nhan-dien/): đơn âm thường gặp ở nhạc Trung cổ, phức điệu ở nhạc Phục hưng và Baroque, chủ điệu ở nhạc Cổ điển và Lãng mạn.

## Bốn loại kết cấu

Tất cả ví dụ dưới đây dùng cùng một giai điệu (*Frère Jacques*) để bạn chỉ chú ý đến kết cấu.

### Đơn âm (monophony)

**Một giai điệu duy nhất**, không có đệm. Nhiều người cùng hát một giai điệu (kể cả cách nhau quãng 8) vẫn là đơn âm.

```abc
X:1
T:Đơn âm
L:1/8
M:4/4
Q:1/4=100
K:C
C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |]
```

*Gặp ở:* thánh ca Gregorian, Debussy *Syrinx* cho sáo độc tấu, phần mở đầu một fugue (chủ đề vang lên một mình).

### Chủ điệu (homophony)

**Một giai điệu chính** cùng **phần đệm hợp âm**. Phần đệm có thể là những hợp âm cùng tiết tấu với giai điệu (như thánh ca bốn bè), hoặc hình đệm riêng (như bè Alberti của Mozart, hợp âm rải của Chopin).

```abc
X:2
T:Chủ điệu
L:1/8
M:4/4
Q:1/4=100
%%score {M A}
V:M clef=treble
V:A clef=bass
K:C
[V:M] C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |]
[V:A] [C,G,]4 [C,G,]4 | [C,G,]4 [C,G,]4 | [C,G,]4 [B,,G,]4 | [C,G,]4 [B,,G,]4 |]
```

*Gặp ở:* nhiều nhạc Cổ điển và Lãng mạn, thánh ca, rất nhiều bài hát pop.

### Phức điệu (polyphony)

**Nhiều giai điệu độc lập** vang cùng lúc, bè nào cũng quan trọng. Một loại quen thuộc là **phức điệu mô phỏng**: các bè lần lượt bắt chước cùng một giai điệu, như canon và fugue.

```abc
X:3
T:Phức điệu (canon hai bè)
L:1/8
M:4/4
Q:1/4=100
%%score (V1 V2)
V:V1 clef=treble
V:V2 clef=treble
K:C
[V:V1] C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |
[V:V2] z8 | z8 | C2D2 E2C2 | C2D2 E2C2 |]
```

*Gặp ở:* nhạc Phục hưng, fugue và invention của Bach, các đoạn phát triển trong giao hưởng.

### Dị âm (heterophony)

**Cùng một giai điệu**, nhưng **mỗi người chơi một phiên bản hơi khác** (thường là trang trí thêm), vang lên cùng lúc. Các bè lúc trùng nhau, lúc tách ra.

```abc
X:4
T:Dị âm
L:1/8
M:4/4
Q:1/4=90
%%score (V1 V2)
V:V1 clef=treble
V:V2 clef=treble
K:C
[V:V1] C2D2 E2C2 | C2D2 E2C2 | E2F2 G4 | E2F2 G4 |]
[V:V2] cd d/e/d e2dc | cd d/e/d e2dc | ef f/g/f g4 | ef f/g/f g4 |]
```

*Gặp ở:* **nhạc truyền thống Việt Nam** (đờn ca tài tử: các nhạc cụ cùng chơi một bài bản theo cách riêng, xem [trang này](/opus/lich-su/nhac-truyen-thong-viet-nam/)), gamelan, nhạc Ả Rập; trong nhạc cổ điển phương Tây thì hiếm.

## Nhìn thấy kết cấu

::hinh{ten="texture-rolls"}

## Nghe kết cấu như thế nào?

1. **Đếm số đường nét độc lập** bạn theo dõi được. Một: đơn âm. Một rõ ràng, các bè khác "đứng sau": chủ điệu. Hai trở lên ngang hàng nhau: phức điệu.
2. **Thử hát theo**: nếu chỉ có một giai điệu để hát, đó là đơn âm hoặc chủ điệu. Nếu bạn phải chọn một trong nhiều giai điệu, đó là phức điệu.
3. **Để ý sự thay đổi**: nhiều tác phẩm đổi kết cấu liên tục. Một fugue bắt đầu đơn âm rồi thành phức điệu; một chương giao hưởng có thể chuyển từ chủ điệu sang phức điệu ở phần phát triển.

Luyện tai bằng [công cụ nhận biết kết cấu](/opus/nhan-dien/luyen-nghe/).

## Ngoài loại kết cấu: độ dày và âm vực

- **Dày hay mỏng**: bao nhiêu nhạc cụ, bao nhiêu nốt vang cùng lúc.
- **Âm vực**: các bè dồn sát nhau hay trải rộng từ rất trầm đến rất cao.

```quiz
? Một dàn hợp xướng cùng hát một giai điệu, nam và nữ cách nhau quãng 8. Đó là kết cấu gì?
+ Đơn âm
- Chủ điệu
- Phức điệu
> Vẫn chỉ có một giai điệu.
? Bè Alberti của Mozart đệm cho giai điệu tay phải tạo kết cấu gì?
+ Chủ điệu
- Phức điệu
- Dị âm
> Một giai điệu chính và phần đệm.
? Fugue chủ yếu có kết cấu gì?
- Đơn âm
- Chủ điệu
+ Phức điệu
> Nhiều bè độc lập bắt chước nhau.
? Kết cấu nào đặc trưng cho đờn ca tài tử?
+ Dị âm
- Chủ điệu
- Đơn âm
> Các nhạc cụ cùng chơi một bài bản theo cách riêng.
```

## Nguồn

- Open Music Theory, chương [Texture](https://viva.pressbooks.pub/openmusictheory/chapter/texture/) (Mark Gotham, Samuel Brady): bốn loại kết cấu đơn âm, dị âm, chủ điệu, phức điệu; chủ điệu gồm kiểu các bè cùng tiết tấu (như thánh ca) và kiểu giai điệu có đệm; phức điệu gắn với fugue và canon; một tác phẩm thường đổi kết cấu.
- Open Music Theory, chương [High Baroque Fugal Exposition](https://viva.pressbooks.pub/openmusictheory/chapter/high-baroque-fugal-exposition/) (Mark Gotham): fugue mở đầu bằng một bè nêu chủ đề, rồi các bè khác lần lượt vào.
- Giáo trình mở khác: Lumen Learning, *Music 101*, [Texture](https://courses.lumenlearning.com/vccs-tcc-mus121-1/chapter/texture/); Clark và cộng sự, *Understanding Music: Past and Present*, [1.8 Texture](https://human.libretexts.org/Courses/Sauk_Valley_Community_College/Book:_Understanding_Music_-_Past_and_Present_(Clark_et_al.)/01:_Music_Fundamentals/1.08:_Texture); Craig Cummings, [IC Theory: Texture](https://musictech.ithaca.edu/MusicTech/ICTheory/OnlineText/TheoryI/Unit%20I/Texture/Texture.html) (Ithaca College); Justin R. Hunter, *Music in World Cultures*, [1 Fundamentals](https://uark.pressbooks.pub/musicinworldcultures/chapter/chapter-1/); Antoni Pizà, *Listening to the World*, [1.2 The Music of the Arab World](https://human.libretexts.org/Bookshelves/Music/Ethnomusicology/Listening_to_The_World_-_A_Brief_Survey_of_World_Music_(Piza)/01:_Music_in_Africa_the_Arab_World_India_and_China/1.02:_The_Music_of_the_Arab_World).
- *The Concise Oxford Dictionary of Music* (Encyclopedia.com): [Alberti bass](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/alberti-bass), [monophony](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/monophony), [polyphony](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/polyphony), [heterophony](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/heterophony), [canon](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/canon).
- Macmillan Learning, *Listen*: [Classical Counterpoint](https://digfir-published.macmillanusa.com/listen8e/listen8e_ch12_16.html) (phần phát triển thường có kết cấu đối âm).
- Bản nhạc: IMSLP, [Syrinx (Debussy)](https://imslp.org/wiki/Syrinx_(Debussy,_Claude)); Mutopia, Mozart [Sonata K. 545](https://www.mutopiaproject.org/cgibin/make-table.cgi?searchingfor=K.+545) và Chopin [Nocturne Op. 9](https://www.mutopiaproject.org/cgibin/make-table.cgi?Composer=ChopinFF&Instrument=Piano) (bè đệm tay trái).
- Wikipedia: [Texture (music)](https://en.wikipedia.org/wiki/Texture_%28music%29) (độ dày và âm vực; thánh ca Gregorian là đơn âm, fugue là phức điệu), [Monophony](https://en.wikipedia.org/wiki/Monophony) (nhiều người cùng hát một giai điệu, kể cả cách nhau quãng 8, vẫn là đơn âm), [Homophony](https://en.wikipedia.org/wiki/Homophony) (bè Alberti là một kiểu đệm chủ điệu; Nocturne Op. 62 số 2 của Chopin), [Alberti bass](https://en.wikipedia.org/wiki/Alberti_bass), [Polyphony](https://en.wikipedia.org/wiki/Polyphony) (thuật ngữ thường dùng cho nhạc cuối Trung cổ và Phục hưng; fugue cũng là phức điệu, thường được gọi là đối âm), [Heterophony](https://en.wikipedia.org/wiki/Heterophony) (đặc trưng của gamelan Indonesia, nhạc cổ điển Ả Rập và nhiều truyền thống ngoài phương Tây; khá hiếm trong nhạc cổ điển phương Tây trước thế kỷ 20), [Syrinx (Debussy)](https://en.wikipedia.org/wiki/Syrinx_%28Debussy%29) (cho sáo độc tấu).
- Nguyễn Thanh Thủy, Stefan Östersjö, "[Claiming Space: Structural aspects of heterophony in the Vietnamese tradition of Vọng Cổ Performance](https://www.erudit.org/fr/revues/is/2021-v41-n1-is09705/1114852ar/)", *Intersections* 41, số 1 (tóm tắt trên Érudit): đờn ca tài tử được phân tích như một lối dị âm trang trí giữa các nghệ nhân.
- Xem [tài liệu tham khảo](/opus/tai-lieu-tham-khao/).
