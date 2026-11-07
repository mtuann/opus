---
title: 17. Khóa Đô và dịch giọng
description: "Ngoài khóa Sol và khóa Fa, còn một khóa thứ ba: khóa Đô. Hình của nó vẽ cách điệu từ chữ C, và điểm giữa của khóa chỉ vào dòng nào thì dòng đó là…"
---

## Khóa Đô

Ngoài khóa Sol và khóa Fa, còn một khóa thứ ba: **khóa Đô**. Hình của nó vẽ cách điệu từ chữ C, và **điểm giữa của khóa chỉ vào dòng nào thì dòng đó là Đô giữa (C4)**. Khóa Đô có thể đặt ở nhiều dòng, nhưng hai vị trí còn dùng ngày nay là:

| Khóa | Đô giữa ở | Dùng cho |
|---|---|---|
| **Khóa Đô alto** | Dòng 3 (dòng giữa) | **Viola** |
| **Khóa Đô tenor** | Dòng 4 | Âm vực cao của **cello**, **bassoon**, **trombone** |

```abc
X:1
T:Cùng các nốt Đô3 – Đô4 – Sol4 ở khóa Sol, khóa Đô alto, khóa Fa
L:1/2
M:none
K:C clef=treble
C, C G |]
K:C clef=alto
C, C G |]
K:C clef=bass
C, C G |]
```

Vì sao lại cần thêm khóa? Để nốt của một nhạc cụ **nằm gọn trong khuông**, ít dòng kẻ phụ. Âm vực viola nằm giữa violin và cello, nên khóa alto đặt nó vừa khít vào 5 dòng kẻ.

Các nốt trên dòng của khóa alto, từ dưới lên: **Fa – La – Đô – Mi – Sol** (F3 A3 C4 E4 G4). Khóa tenor: **Rê – Fa – La – Đô – Mi** (D3 F3 A3 C4 E4).

Luyện đọc: [công cụ đọc nốt](/opus/luyen-tap/doc-not/), chọn "Khóa Đô (alto)" hoặc "Khóa Đô (tenor)".

Nghe thử một giai điệu quen thuộc ở khóa alto — bấm phát, vừa nghe vừa đọc tên từng nốt theo vị trí trên khuông:

```abc
X:2
T:Ode to Joy ở khóa Đô alto
L:1/4
M:4/4
Q:1/4=90
K:C clef=alto
E E F G | G F E D | C C D E | E3/2 D/ D2 |]
```

## Dịch giọng

**Dịch giọng** (transposition) là chuyển toàn bộ bản nhạc lên hoặc xuống một quãng cố định, giữ nguyên giai điệu. Cách làm:

1. Chọn quãng dịch, ví dụ lên **2 trưởng** (Đô → Rê).
2. Đổi **hóa biểu** sang giọng mới (Đô trưởng → Rê trưởng: thêm Fa♯, Đô♯).
3. Dịch **mọi nốt** lên cùng số bậc (Đô → Rê, Mi → Fa♯ theo hóa biểu, Sol → La…).
4. Kiểm tra lại **dấu hóa bất thường**: một dấu thăng có thể thành dấu bình hoặc thăng kép tùy giọng mới.

```abc
X:1
T:Ode to Joy ở Đô trưởng, rồi dịch lên Rê trưởng
L:1/4
M:4/4
K:C
E E F G | G F E D |]
K:D
F F G A | A G F E |]
```

Ca sĩ thường dịch giọng để vừa âm vực; người đệm đàn phải đọc và dịch ngay khi chơi.

## Nhạc cụ dịch giọng

Một số nhạc cụ được viết bản nhạc ở cao độ **khác** với âm thanh thật vang lên. Lý do chủ yếu là lịch sử (kèn horn, kèn trumpet thời chưa có van chỉ chơi được các nốt của một âm gốc, nên phải đổi ống nối để đổi âm gốc) và để người chơi dùng cùng một thế bấm khi đổi giữa các loại nhạc cụ trong cùng họ.

| Nhạc cụ | Viết Đô thì vang lên | Ghi chú |
|---|---|---|
| Clarinet in B♭, trumpet in B♭ | **Si♭** (thấp hơn 2 trưởng) | |
| Clarinet in A | **La** (thấp hơn 3 thứ) | Hay dùng ở giọng có nhiều dấu thăng |
| Kèn horn in F | **Fa** (thấp hơn 5 đúng) | |
| Saxophone alto in E♭ | **Mi♭** (thấp hơn 6 trưởng) | |
| Guitar, contrabass | **Đô** thấp hơn một quãng tám | Để tránh quá nhiều dòng kẻ phụ dưới khuông |
| Piccolo | **Đô** cao hơn một quãng tám | |

Bốn dòng đầu của bảng trên phím đàn: nốt viết Đô4, và ngoặc nối tới âm vang lên của từng nhạc cụ, ghi tên nhạc cụ và quãng thấp hơn.

::cong-cu{ten="piano" range="D3-C4" notes="Eb3 F3 A3 Bb3 C4" nhan="C4:viết_Đô" ngoac="Bb3-C4:clarinet,_trumpet_in_B♭:_2_trưởng A3-C4:clarinet_in_A:_3_thứ F3-C4:horn_in_F:_5_đúng Eb3-C4:saxophone_alto_in_E♭:_6_trưởng"}

Khi đọc **tổng phổ** (bài 20), bè clarinet in B♭ có hóa biểu khác với các bè còn lại: đó không phải lỗi in, mà là nhạc cụ dịch giọng.

## Bài tập viết

1. Viết 4 nốt đầu *Ode to Joy* (Mi Mi Fa Sol ở Đô trưởng) ở giọng Fa trưởng và Si♭ trưởng.
2. Nghệ sĩ clarinet in B♭ đọc nốt Rê. Âm thanh thật là gì?
3. Muốn clarinet in B♭ phát ra âm Đô thật, phải viết nốt gì?

<details>
<summary>Đáp án</summary>

1. Fa trưởng: La La Si♭ Đô. Si♭ trưởng: Rê Rê Mi♭ Fa.
2. Đô (thấp hơn Rê một quãng 2 trưởng).
3. Rê (viết cao hơn 2 trưởng).

</details>

```quiz
? Khóa Đô alto đặt Đô giữa ở dòng nào?
+ Dòng 3
- Dòng 4
- Dòng 1
> Dòng giữa của khuông.
? Nhạc cụ nào đọc khóa Đô alto?
+ Viola
- Violin
- Contrabass
> Viola có âm vực giữa violin và cello.
? Clarinet in B♭ viết Đô thì âm thanh thật là gì?
+ Si♭ thấp hơn
- Đô
- Rê cao hơn
> Thấp hơn một quãng 2 trưởng.
? Dịch giọng từ Đô trưởng lên Rê trưởng cần thêm những dấu hóa nào?
+ Fa♯ và Đô♯
- Si♭
- Fa♯
> Rê trưởng có 2 dấu thăng.
? Guitar được viết ở cao độ nào so với âm thanh thật?
+ Cao hơn một quãng tám
- Đúng cao độ
- Thấp hơn một quãng tám
> Âm thanh thật thấp hơn nốt viết một quãng tám.
```

## Nguồn

- *Open Music Theory*: [Clefs](https://viva.pressbooks.pub/openmusictheory/chapter/clefs/); [Major Scales, Scale Degrees, and Key Signatures](https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/).
- *Encyclopaedia Britannica*: [Clef](https://www.britannica.com/print/article/120899).
- José Rodríguez Alvira, teoria.com: [bảng nhạc cụ dịch giọng](https://www.teoria.com/en/articles/transposing/03.php). *The Oxford Dictionary of Music* (qua encyclopedia.com): [transposing instruments](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/transposing-instruments), [transposition](https://www.encyclopedia.com/arts/dictionaries-thesauruses-pictures-and-press-releases/transposition). *LilyPond Music Glossary*: [transposing instrument](https://lilypond.org/doc/v2.25/Documentation/music-glossary/transposing-instrument).
- Beethoven, *Ode to Joy*: [bản Mutopia](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=528) (Sol trưởng, dịch xuống Đô trưởng); giai điệu gốc ở Giao hưởng số 9, chương 4 (Rê trưởng).
- Xem [tài liệu tham khảo](/opus/tai-lieu-tham-khao/).
