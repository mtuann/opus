---
title: Âm học cơ bản
description: 'Bài này trả lời những câu hỏi "vì sao" mà các bài trước bỏ ngỏ: vì sao quãng 8 và quãng 5 nghe hòa hợp, vì sao violin và sáo chơi cùng một nốt mà nghe khác…'
---

Bài này trả lời những câu hỏi "vì sao" mà các bài trước bỏ ngỏ: vì sao quãng 8 và quãng 5 nghe hòa hợp, vì sao violin và sáo chơi cùng một nốt mà nghe khác nhau, và vì sao dàn nhạc Baroque lên dây thấp hơn dàn nhạc hiện đại. Nên đọc sau [bài 9: Quãng](/opus/nhac-ly/09-quang/).

## Âm thanh là gì?

Âm thanh là **dao động** truyền qua không khí. Một nốt nhạc có ba đặc tính:

| Đặc tính | Vật lý | Ta nghe thấy |
|---|---|---|
| **Cao độ** | Tần số (số dao động mỗi giây, đơn vị Hz) | Cao hay thấp |
| **Cường độ** | Biên độ dao động | To hay nhỏ |
| **Âm sắc** | Tỉ lệ các **bồi âm** trong âm thanh | "Giọng" riêng của từng nhạc cụ |

Tai người nghe được khoảng 20 Hz đến 20.000 Hz. Phím thấp nhất của piano (La0) khoảng 27,5 Hz, phím cao nhất (Đô8) khoảng 4.186 Hz.

## Chuỗi bồi âm

Khi một dây đàn rung, nó không chỉ rung cả dây (âm **cơ bản**), mà đồng thời rung từng nửa dây, từng một phần ba dây, từng một phần tư dây… Mỗi kiểu rung tạo ra một tần số gấp **2, 3, 4, 5… lần** âm cơ bản. Đó là các **bồi âm** (overtones, harmonics). Ta không nghe chúng như những nốt riêng, nhưng chúng hòa vào nhau thành âm thanh ta nghe.

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


Hãy để ý: **các bồi âm 4, 5, 6 chính là hợp âm Đô trưởng** (Đô – Mi – Sol). Hợp âm trưởng có sẵn trong tự nhiên, bên trong mỗi nốt nhạc.

Nghe từng bồi âm và thử ghép chúng lại:

::cong-cu{ten="overtones"}

## Vì sao có quãng "hòa hợp"?

Hai nốt có tỉ lệ tần số **đơn giản** thì có nhiều bồi âm trùng nhau, nên tai nghe chúng "hòa" vào nhau:

| Quãng | Tỉ lệ (thuần) | Cảm giác |
|---|---|---|
| 8 đúng | 2 : 1 | Gần như một nốt |
| 5 đúng | 3 : 2 | Rất vững, rỗng |
| 4 đúng | 4 : 3 | Vững |
| 3 trưởng | 5 : 4 | Ngọt, sáng |
| 3 thứ | 6 : 5 | Ngọt, tối |
| 2 thứ | 16 : 15 | Chói, nghịch |

Đây là lời giải thích vật lý cho bảng [thuận tai và nghịch tai](/opus/nhac-ly/09-quang/) ở bài 9. Nhưng cảm giác "thuận" và "nghịch" còn phụ thuộc vào văn hóa và thói quen nghe: âm nhạc thế kỷ 20 dùng nghịch tai như màu sắc, và nhiều nền âm nhạc khác có quan niệm hòa hợp riêng.

## Âm sắc

Nhìn bồi âm bằng mắt: bấm các nút để so phổ của sóng sin, âm tổng hợp và piano thật, hoặc bật micro.

::cong-cu{ten="spectrum"}

1. **Phát Đô3: sóng sin**: chỉ có **một** đỉnh, vì sóng sin không có bồi âm. Âm thanh "trơn", nhạt.
2. **Phát Đô3: âm tổng hợp**: có vài đỉnh ở bồi âm 1, 2, 3…
3. **Phát Đô3: piano mẫu**: rất nhiều đỉnh, mạnh yếu khác nhau, và chúng **tắt dần** theo thời gian khác nhau. Đó là âm sắc của cây đàn piano thật.
4. **Bật micro** rồi hát hoặc huýt sáo: huýt sáo cho phổ gần như sóng sin; giọng hát nguyên âm "a" có nhiều bồi âm hơn "u". Nếu có đàn cơ, chơi một nốt trầm rồi một nốt cao và so số đỉnh bồi âm.

Sáo gần như chỉ có âm cơ bản và vài bồi âm yếu, nên nghe tròn và trong. Clarinet có các bồi âm **lẻ** (1, 3, 5, 7) mạnh hơn hẳn các bồi âm chẵn, tạo âm sắc "rỗng" đặc trưng. Violin và oboe có rất nhiều bồi âm mạnh, nên nghe sáng và giàu. Thử chọn chỉ các ô lẻ (1, 3, 5, 7) trong công cụ ở trên rồi nghe cùng lúc.

Bồi âm còn là cách **chơi** một số nhạc cụ:

- **Kèn đồng không có van** (như kèn trumpet tự nhiên thời Bach) chỉ chơi được các nốt trong chuỗi bồi âm. Người chơi đổi nốt bằng cách thay đổi môi; người chơi kèn horn thời Mozart còn bịt bàn tay vào loa kèn để có thêm những nốt nằm giữa.
- **Đàn bầu** của Việt Nam dùng một dây duy nhất, và gần như mọi nốt đều là **bồi âm**: người chơi chạm nhẹ cạnh bàn tay vào các điểm chia dây trong khi gảy, còn cần đàn uốn cao độ lên xuống.
- Nghệ sĩ violin, cello, guitar dùng **bồi âm** (harmonics) để tạo những nốt cao trong veo như tiếng sáo.

## Hệ thống lên dây

Nếu lên dây sao cho mọi quãng 5 đều thuần (3 : 2) rồi đi hết vòng 12 quãng 5, ta **không quay về đúng** nốt ban đầu: dư ra khoảng 23,5 cent, gọi là **dấu phẩy Pythagore**. Không có cách nào để mọi quãng đều thuần ở mọi giọng. Lịch sử âm nhạc phương Tây là lịch sử của các cách thỏa hiệp:

| Hệ thống | Ý tưởng | Thời kỳ |
|---|---|---|
| **Pythagore** | Mọi quãng 5 thuần; quãng 3 trưởng rất chói | Trung cổ |
| **Mean-tone** | Quãng 3 trưởng thuần; một vài giọng chơi được rất hay, các giọng xa thì không dùng được | Phục hưng, Baroque |
| **Bình quân cải tiến** (well temperament) | Mọi giọng đều chơi được, nhưng mỗi giọng có "màu" hơi khác | Cuối Baroque; *Bình quân luật* của Bach dành cho kiểu lên dây này |
| **Bình quân** (equal temperament) | Chia quãng 8 thành 12 nửa cung **bằng hệt nhau**: mỗi nửa cung = 100 cent, tỉ lệ ¹²√2 ≈ 1,0595 | Chuẩn cho piano từ thế kỷ 19 đến nay |

Hệ bình quân cho phép chơi ở mọi giọng và chuyển giọng tự do, đổi lại mọi quãng (trừ quãng 8) đều lệch một chút so với quãng thuần. Quãng 5 bình quân chỉ lệch 2 cent, gần như không nghe ra; quãng 3 trưởng bình quân **rộng hơn 14 cent** so với quãng thuần, và tai luyện tốt nghe thấy tiếng "rung" (phách) của nó:

::cong-cu{ten="tuning"}

Nhìn thấy "phách" (bản in được của thí nghiệm trên):

::hinh{ten="beats"}

Ca sĩ, dàn dây và kèn không cố định cao độ nên thường tự điều chỉnh về phía quãng thuần khi hát hoặc chơi hợp âm. Đó là một lý do một tứ tấu đàn dây hay dàn hợp xướng giỏi nghe "trong" đến vậy.

## Chuẩn cao độ: La = 440 Hz?

Cao độ của nốt La4 không phải lúc nào cũng là 440 Hz:

- **440 Hz** được một hội nghị quốc tế ở London khuyến nghị năm 1939, và trở thành tiêu chuẩn ISO 16. Đây là chuẩn phổ biến nhất hiện nay, cũng là chuẩn của [máy lên dây](/opus/luyen-tap/hat-lai/#may-len-day) trên site này.
- Nhiều dàn nhạc châu Âu lên dây cao hơn một chút, khoảng **442–443 Hz**, cho âm thanh sáng hơn.
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

- [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/); [musictheory.net](https://www.musictheory.net/lessons).
- Xem [tài liệu tham khảo](/opus/tai-lieu-tham-khao/).
