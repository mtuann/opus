---
title: Âm học cơ bản
description: 'Bài này trả lời những câu hỏi "vì sao" mà các bài trước bỏ ngỏ: vì sao quãng 8 và quãng 5 nghe hòa hợp, vì sao violin và sáo chơi cùng một nốt mà nghe khác…'
---

Bài này trả lời những câu hỏi "vì sao" mà các bài trước bỏ ngỏ: vì sao quãng 8 và quãng 5 nghe hòa hợp, vì sao violin và sáo chơi cùng một nốt mà nghe khác nhau, và vì sao dàn nhạc Baroque lên dây thấp hơn dàn nhạc hiện đại. Nên đọc sau [bài 9: Quãng](/opus/nhac-ly/09-quang/).

## Âm thanh là gì?

Âm thanh là **dao động** truyền đi trong không khí (hay vật chất khác). Một nốt nhạc có ba đặc tính:

| Đặc tính | Vật lý | Ta nghe thấy |
|---|---|---|
| **Cao độ** | Tần số (số dao động mỗi giây, đơn vị Hz) | Cao hay thấp |
| **Cường độ** | Biên độ dao động | To hay nhỏ |
| **Âm sắc** | Tỉ lệ các **bồi âm** trong âm thanh | "Giọng" riêng của từng nhạc cụ |

Tai người nghe được khoảng 20 Hz đến 20.000 Hz. Phím thấp nhất của piano (La0) khoảng 27,5 Hz, phím cao nhất (Đô8) khoảng 4.186 Hz.

## Chuỗi bồi âm

Khi một dây đàn rung, nó không chỉ rung cả dây (âm **cơ bản**), mà đồng thời rung từng nửa dây, từng một phần ba dây, từng một phần tư dây… Mỗi kiểu rung tạo ra một tần số gấp **2, 3, 4, 5… lần** âm cơ bản. Đó là các **bồi âm** (*harmonics*). Bài này đánh số từ âm cơ bản, như các giáo trình vật lý: âm cơ bản là bồi âm số 1, gấp đôi tần số là số 2, và cứ thế. (Một số tài liệu dùng *overtones* cho các bồi âm trên âm cơ bản và đánh số lệch một: overtone thứ nhất là bồi âm số 2.) Ta không nghe chúng như những nốt riêng, nhưng chúng hòa vào nhau thành âm thanh ta nghe.

Chuỗi bồi âm trên nốt Đô2:

| Bồi âm số | Tỉ lệ tần số | Nốt gần nhất | Quãng so với bồi âm trước |
|---|---|---|---|
| 1 | 1 | Đô2 | (âm cơ bản) |
| 2 | 2 | Đô3 | quãng 8 |
| 3 | 3 | Sol3 | quãng 5 |
| 4 | 4 | Đô4 | quãng 4 |
| 5 | 5 | Mi4 (thấp hơn 14 cent) | quãng 3 trưởng |
| 6 | 6 | Sol4 | quãng 3 thứ |
| 7 | 7 | Si♭4 (thấp hơn khoảng 31 cent) | |
| 8 | 8 | Đô5 | |

Các bồi âm 1 đến 10 trên nốt Đô2, ghi trên khuông (bồi âm 7 thực tế thấp hơn Si♭ khá nhiều):

```abc
X:1
L:1/4
M:none
K:C clef=bass
C,,2 C,2 G,2 [K:clef=treble] C2 E2 G2 _B2 c2 d2 e2 |]
w: 1 2 3 4 5 6 7 8 9 10
```


Hãy để ý: **các bồi âm 4, 5, 6 chính là hợp âm Đô trưởng** (Đô – Mi – Sol, tỉ lệ tần số 4 : 5 : 6). Hợp âm trưởng nằm sẵn trong chuỗi bồi âm của nốt.

Nghe từng bồi âm và thử ghép chúng lại:

::cong-cu{ten="overtones"}

## Vì sao có quãng "hòa hợp"?

Theo cách giải thích cổ điển của Helmholtz, hai nốt có tỉ lệ tần số **đơn giản** thì có nhiều bồi âm trùng nhau, nên tai nghe chúng "hòa" vào nhau:

| Quãng | Tỉ lệ (thuần) | Phân loại (bài 9) |
|---|---|---|
| 8 đúng | 2 : 1 | Thuận hoàn toàn |
| 5 đúng | 3 : 2 | Thuận hoàn toàn |
| 4 đúng | 4 : 3 | Tùy ngữ cảnh: thuận giữa hai bè trên, nghịch khi có bè trầm |
| 3 trưởng | 5 : 4 | Thuận không hoàn toàn |
| 3 thứ | 6 : 5 | Thuận không hoàn toàn |
| 2 thứ | 16 : 15 | Nghịch |

Đây là lời giải thích vật lý cho bảng [thuận tai và nghịch tai](/opus/nhac-ly/09-quang/) ở bài 9. Nhưng quan niệm quãng nào là "thuận" đã đổi nhiều qua lịch sử và khác nhau giữa các nền văn hóa; một số nhà soạn nhạc thế kỷ 20 còn dùng quãng nghịch tai ngang hàng với thuận tai.

## Âm sắc

Nhìn bồi âm bằng mắt: bấm các nút để so phổ của sóng sin, âm tổng hợp và piano thật, hoặc bật micro.

::cong-cu{ten="spectrum"}

1. **Phát Đô3: sóng sin**: chỉ có **một** đỉnh, vì sóng sin không có bồi âm. Âm thanh "trơn", nhạt.
2. **Phát Đô3: âm tổng hợp**: có vài đỉnh ở bồi âm 1, 2, 3…
3. **Phát Đô3: piano mẫu**: rất nhiều đỉnh, mạnh yếu khác nhau, và chúng **tắt dần** theo thời gian khác nhau. Đó là âm sắc của cây đàn piano thật.
4. **Bật micro** rồi hát hoặc huýt sáo: huýt sáo cho phổ chỉ có một đỉnh trội, các bồi âm yếu; giọng hát có nhiều bồi âm hơn, và mỗi nguyên âm ("a", "u"…) cho các đỉnh mạnh yếu khác nhau. Nếu có đàn cơ, chơi một nốt trầm rồi một nốt cao và so số đỉnh bồi âm.

Sáo, ở âm vực trung, gần như chỉ có âm cơ bản và rất ít bồi âm khác, nên nghe tròn và trong. Clarinet ở âm vực trầm có các bồi âm **lẻ** (1, 3, 5, 7) mạnh hơn hẳn các bồi âm chẵn, tạo âm sắc "rỗng" đặc trưng. Sáo và oboe chơi cùng một nốt vẫn nghe khác nhau vì tỉ lệ bồi âm khác nhau; âm sắc càng "sáng" thì các bồi âm cao càng mạnh. Thử chọn chỉ các ô lẻ (1, 3, 5, 7) trong công cụ ở trên rồi nghe cùng lúc.

Bồi âm còn là cách **chơi** một số nhạc cụ:

- **Kèn đồng không có van** (như kèn trumpet tự nhiên thời Bach) chỉ chơi được các nốt trong chuỗi bồi âm của ống kèn. Người chơi đổi nốt bằng cách thay đổi môi; người chơi kèn horn thời Mozart còn đặt bàn tay vào loa kèn để chỉnh cao độ một số nốt.
- **Đàn bầu** của Việt Nam chỉ có một dây, không có phím bấm, và được chơi bằng **bồi âm**; người chơi uốn vòi đàn để dây căng hay chùng, đổi cao độ lên xuống.
- Nghệ sĩ violin, cello, guitar dùng **bồi âm** (harmonics) để tạo những nốt cao trong veo như tiếng sáo.

## Hệ thống lên dây

Nếu lên dây sao cho mọi quãng 5 đều thuần (3 : 2) rồi đi hết vòng 12 quãng 5, ta **không quay về đúng** nốt ban đầu: dư ra khoảng 23,5 cent, gọi là **dấu phẩy Pythagore**. Không có cách nào để mọi quãng đều thuần ở mọi giọng. Lịch sử các hệ lên dây ở phương Tây là lịch sử của những cách thỏa hiệp:

| Hệ thống | Ý tưởng | Thời kỳ |
|---|---|---|
| **Pythagore** | Mọi quãng 5 thuần; quãng 3 trưởng rất chói | Trung cổ, còn dùng đến Phục hưng |
| **Mean-tone** | Quãng 3 trưởng thuần; một vài giọng chơi được rất hay, các giọng xa thì không dùng được | Phục hưng, Baroque |
| **Bình quân cải tiến** (well temperament) | Mọi giọng đều chơi được, nhưng mỗi giọng có "màu" hơi khác | Thế kỷ 18–19, bắt đầu từ cuối Baroque; *Bình quân luật* của Bach thường được cho là viết cho kiểu lên dây này (hệ chính xác Bach dùng thì đã có nhiều đề xuất khác nhau) |
| **Bình quân** (equal temperament) | Chia quãng 8 thành 12 nửa cung **bằng hệt nhau**: mỗi nửa cung = 100 cent, tỉ lệ ¹²√2 ≈ 1,0595 | Chuẩn cho piano từ khoảng giữa thế kỷ 19 đến nay |

Hệ bình quân cho phép chơi ở mọi giọng và chuyển giọng tự do, đổi lại mọi quãng (trừ quãng 8) đều lệch một chút so với quãng thuần. Quãng 5 bình quân chỉ lệch 2 cent, gần như không nghe ra; quãng 3 trưởng bình quân **rộng hơn 14 cent** so với quãng thuần, và tai luyện tốt nghe thấy tiếng "rung" (phách) của nó:

::cong-cu{ten="tuning"}

Nhìn thấy "phách" (bản in được của thí nghiệm trên):

::hinh{ten="beats"}

Ca sĩ, nhạc công kèn và nhiều nhạc cụ dây không cố định cao độ nên khi hát hoặc chơi hợp âm họ thường điều chỉnh về phía quãng thuần. Đó có thể là một lý do dàn hợp xướng không nhạc đệm hay một dàn dây giỏi nghe "trong" đến vậy.

## Chuẩn cao độ: La = 440 Hz?

Cao độ của nốt La4 không phải lúc nào cũng là 440 Hz:

- **440 Hz** được một hội nghị quốc tế ở London khuyến nghị năm 1939, và trở thành tiêu chuẩn ISO 16. Đây là chuẩn phổ biến nhất hiện nay, cũng là chuẩn của [máy lên dây](/opus/luyen-tap/hat-lai/#may-len-day) trên site này.
- Các nhóm chơi nhạc Baroque bằng nhạc cụ cổ thường dùng **415 Hz**, thấp hơn gần đúng nửa cung. Đó là lý do khi nghe một bản thu Bach "theo phong cách lịch sử", bạn có thể thấy nó thấp hơn bản nhạc in nửa cung (xem [Đọc tên tác phẩm và bản thu](/opus/nghe-nhac/doc-ten-tac-pham/)).

## Tự kiểm tra

```quiz
? Bồi âm số 3 của nốt Đô2 là nốt gì?
+ Sol3
- Mi3
- Đô3
> Gấp 3 lần tần số, cao hơn bồi âm số 2 (Đô3) một quãng 5.
? Tỉ lệ tần số của quãng 5 thuần là bao nhiêu?
- 2 : 1
+ 3 : 2
- 5 : 4
> 2 : 1 là quãng 8, 5 : 4 là quãng 3 trưởng.
? Trong hệ bình quân, một nửa cung bằng bao nhiêu cent?
+ 100
- 50
- 12
> Quãng 8 = 1200 cent chia đều cho 12 nửa cung.
? Điều gì quyết định âm sắc của một nhạc cụ?
- Tần số âm cơ bản
+ Tỉ lệ các bồi âm
- Âm lượng
> Cùng cao độ, khác tỉ lệ bồi âm thì khác "giọng".
? Nhạc Baroque bằng nhạc cụ cổ thường lên dây La4 ở bao nhiêu?
- 440 Hz
- 443 Hz
+ 415 Hz
> Thấp hơn chuẩn hiện đại gần đúng nửa cung.
```

## Nguồn

- Quãng thuận tai và nghịch tai: [Open Music Theory, Intervals](https://viva.pressbooks.pub/openmusictheory/chapter/intervals/) và [Introduction to Species Counterpoint](https://viva.pressbooks.pub/openmusictheory/chapter/species-counterpoint/).
- Vật lý của âm thanh và bồi âm: [OpenStax, College Physics 2e, 17.5](https://openstax.org/books/college-physics-2e/pages/17-5-sound-interference-and-resonance-standing-waves-in-air-columns) và [17.6](https://openstax.org/books/college-physics-2e/pages/17-6-hearing); Schmidt-Jones, *Understanding Basic Music Theory* ([5.3](https://human.libretexts.org/Bookshelves/Music/Music_Theory/Understanding_Basic_Music_Theory_%28Schmidt-Jones%29/05%3A_The_Physical_Basis/5.03%3A_Harmonic_Series_I-_Timbre_and_Octaves), [6.6](https://human.libretexts.org/Bookshelves/Music/Music_Theory/Understanding_Basic_Music_Theory_%28Schmidt-Jones%29/06%3A_Notes_and_Scales/6.06%3A_Harmonic_Series_II-_Harmonics_Intervals_and_Instruments), [8.2](https://human.libretexts.org/Bookshelves/Music/Music_Theory/Understanding_Basic_Music_Theory_%28Schmidt-Jones%29/08%3A_Challenges/8.02%3A_Tuning_System)).
- Chuẩn cao độ: [ISO 16:1975](https://www.iso.org/standard/3601.html).
- Xem [tài liệu tham khảo](/opus/tai-lieu-tham-khao/).
