// Nhận diện phong cách (D5-L3): mười đoạn nhạc ngắn viết theo đặc trưng từng thời kỳ, chuyển từ phần .oz-style-example và
// .oz-style-trainer của ../opus-zero/docs/assets/js/recognition.js (nghe kết, nhận biết kết cấu: src/scripts/luyen-tai.js).
// - ::cong-cu{ten="style-example" id="baroque-1"}: khuông nhạc của một đoạn kèm dòng "Dấu hiệu: …"; dựng lúc build như
//   khối ```abc (src/plugins/thanh-phan.mjs, khuongAbc), src/scripts/abc.js vẽ khuông và trình phát.
// - ::cong-cu{ten="style-trainer"}: đoán thời kỳ của mười đoạn. Ô (lời dẫn, năm nút thời kỳ, dòng phản hồi aria-live, nút
//   "Đoạn khác") dựng sẵn lúc build (veDoanPhongCach: chữ thật, ô không đổi chiều cao khi script chạy); mount(el) thêm phần
//   bấm được: tải abcjs (như abc.js), vẽ khuông ẩn và trình phát của abcjs (âm sắc theo %%MIDI program của từng đoạn:
//   harpsichord, piano, dàn dây, marimba, là một phần của bài; chỉ phát khi người học bấm), trả lời xong thì hiện khuông
//   và các dấu hiệu.
// Lưu như site cũ (src/scripts/tien-do.js, khóa opus-zero:v1): kỹ năng style (chỉ lần trả lời đầu của mỗi đoạn) và số
// đoạn đoán đúng trong ngày (days[ngày].styles).
// Khác bản cũ: đáp án đã chọn sai không bị khóa hẳn (aria-disabled, như luyện tai); khuông hiện ra thì máy đọc màn hình
// đọc được (bỏ aria-hidden).
import { ghiNgay, kyNang } from './tien-do.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Năm thời kỳ (PERIODS của recognition.js). */
export const THOI_KY_ND = { baroque: 'Baroque', classical: 'Cổ điển', romantic: 'Lãng mạn', impressionist: 'Ấn tượng', modern: 'Thế kỷ 20' };

/** Phần đầu chung của các đoạn: hai khuông, cùng một âm sắc (H của recognition.js). */
const dauBe = (prog) => `%%score {1 2}\nV:1 clef=treble\n%%MIDI program ${prog}\nV:2 clef=bass\n%%MIDI program ${prog}\n`;

/** Mười đoạn nhạc (EX): thời kỳ, âm sắc (số chương trình MIDI), mã ABC, các dấu hiệu. */
export const VI_DU = {
	"baroque-1": {
		thoi_ky: "baroque",
		prog: 6,
		abc:
			"X:1\nL:1/16\nM:4/4\nQ:1/4=80\n" +
			dauBe(6) +
			"K:G\n[V:1] G2B2 d2g2 f2a2 d2f2 | e2g2 c2e2 d2f2 B2d2 | c2e2 A2c2 B2d2 G2B2 | A4 !trill!A3G G8 |]\n[V:2] G,4 B,4 D,4 D4 | C,4 C4 B,,4 B,4 | A,,4 A,4 G,,4 G,4 | D,4 D4 G,,8 |]",
		dau_hieu: [
			"Harpsichord",
			"Chuyển động móc đơn liên tục, nhịp đều",
			"Chuỗi đi xuống: cùng một hình nốt lặp lại thấp dần (xem bài 29)",
			"Bè trầm nhảy quãng 8, đi đều từng phách",
			"Láy rền (trill) ở kết",
		],
	},
	"baroque-2": {
		thoi_ky: "baroque",
		prog: 6,
		abc:
			"X:1\nL:1/8\nM:4/4\nQ:1/4=88\n" +
			dauBe(6) +
			"K:Dm\n[V:1] D2 A2 F E D ^C | D E F G A4 | F2 E2 D G F E | F G A _B c4 | d2 ^c2 d4 |]\n[V:2] z8 | z8 | D,2 A,2 F, E, D, ^C, | D, E, F, G, A,4 | B,2 A,2 D,4 |]",
		dau_hieu: [
			"Harpsichord",
			"Mở đầu bằng một giai điệu đơn độc, rồi bè thứ hai vào bằng chính giai điệu đó: phức điệu mô phỏng, kiểu fugue",
			"Giọng thứ với cảm âm Đô♯",
			"Hai bè độc lập, quan trọng ngang nhau",
		],
	},
	"classical-1": {
		thoi_ky: "classical",
		prog: 0,
		abc:
			"X:1\nL:1/8\nM:4/4\nQ:1/4=112\n" +
			dauBe(0) +
			"K:C\n[V:1] E2 G2 c3 B | A2 c2 G4 | F2 A2 E2 G2 | D6 z2 | E2 G2 c3 B | A2 c2 G4 | F2 D2 G2 B,2 | C6 z2 |]\n[V:2] C,G,E,G, C,G,E,G, | F,CA,C E,CG,C | F,CA,C C,G,E,G, | B,,G,D,G, B,,G,D,G, | C,G,E,G, C,G,E,G, | F,CA,C E,CG,C | D,A,F,A, G,,D,B,,D, | C,G,E,G, C,4 |]",
		dau_hieu: [
			"Piano",
			"Tay trái đệm kiểu Alberti (thấp – cao – giữa – cao)",
			"Câu nhạc 4 + 4 ô nhịp: câu hỏi dừng ở kết nửa, câu trả lời kết trọn",
			"Chủ điệu rõ ràng, giai điệu đơn giản, hòa âm chủ yếu I – IV – V",
		],
	},
	"classical-2": {
		thoi_ky: "classical",
		prog: 0,
		abc:
			"X:1\nL:1/4\nM:3/4\nQ:1/4=126\n" +
			dauBe(0) +
			"K:G\n[V:1] d B G | c A F | G B d | A3 | d B G | c A F | G A F | G3 |]\n[V:2] G, [B,D] [B,D] | D, [A,C] [A,C] | G, [B,D] [B,D] | D, [F,A,] [F,A,] | G, [B,D] [B,D] | D, [A,C] [A,C] | E, C, D, | G,3 |]",
		dau_hieu: [
			"Nhịp 3/4 kiểu minuet, đệm \"bùm – chát – chát\"",
			"Hai câu 4 ô nhịp cân đối, kết nửa rồi kết trọn",
			"Hòa âm đơn giản, trong sáng, gần như chỉ có I và V",
		],
	},
	"romantic-1": {
		thoi_ky: "romantic",
		prog: 0,
		abc:
			"X:1\nL:1/8\nM:3/4\nQ:1/4=60\n" +
			dauBe(0) +
			"K:C\n[V:1] e4 c' b | _b4 a g | f4 e d | ^g4 b d' | c'4 a f | c'4 _a f | \"^rit.\"b4 ^g e | a6 |]\n[V:2] A,,E,CEC E, | ^C,G,_B,E_B, G, | D,A,FAF A, | E,,B,,^G,D^G, B,, | F,,C,A,FA, C, | F,,C,_A,F_A, C, | E,,B,,^G,D^G, B,, | A,,E,C A,3 |]",
		dau_hieu: [
			"Tay trái rải hợp âm trải rộng hơn một quãng 8",
			"Hợp âm bảy giảm ở ô nhịp 2 (nửa cung, căng thẳng)",
			"Fa trưởng chuyển sang Fa thứ ở ô nhịp 6 (nốt La hạ nửa cung thành La♭)",
			"Giai điệu có bước nhảy rộng, giàu cảm xúc; chậm dần (rit.) trước kết",
		],
	},
	"romantic-2": {
		thoi_ky: "romantic",
		prog: 48,
		abc:
			"X:1\nL:1/4\nM:4/4\nQ:1/4=60\n" +
			dauBe(48) +
			"K:C\n[V:1] !p![EGc]4 | !crescendo(![_E_Ac]4 | !crescendo)![E^GB]4 | !f![EGc]4 |]\n[V:2] C,4 | _A,,4 | E,4 | C,4 |]",
		dau_hieu: [
			"Dàn dây, âm thanh dày và ấm",
			"Các hợp âm trưởng cách nhau quãng 3 (Đô – La♭ – Mi – Đô): liên hệ quãng 3 nửa cung",
			"Ba bè trên chỉ dịch tối đa nửa cung (bè trầm nhảy quãng 3), nhưng màu sắc đổi hẳn",
			"To dần rồi bùng lên",
		],
	},
	"impressionist-1": {
		thoi_ky: "impressionist",
		prog: 0,
		abc:
			"X:1\nL:1/4\nM:4/4\nQ:1/4=60\n" +
			dauBe(0) +
			"K:C\n[V:1] !pp![DFAc]2 [EGBd]2 | [FAce]2 [EGBd]2 | [DFAc]2 [CEGB]2 | [DFAc]4 |]\n[V:2] C,,4- | C,,4- | C,,4- | C,,4 |]",
		dau_hieu: [
			"Rất nhỏ (pp)",
			"Các hợp âm bảy chuyển động song song, mọi bè cùng đi một hướng (planing), không theo quy tắc dẫn bè",
			"Một nốt trầm giữ suốt (âm nền)",
			"Không có kết, không có cảm giác \"về nhà\"",
		],
	},
	"impressionist-2": {
		thoi_ky: "impressionist",
		prog: 0,
		abc:
			"X:1\nL:1/4\nM:4/4\nQ:1/4=66\n" +
			dauBe(0) +
			"K:C\n[V:1] !pp!c2 _B2 | _A2 ^F2 | E2 D2 | C4 |]\n[V:2] [C,E,^G,]4- | [C,E,^G,]4- | [C,E,^G,]4- | [C,E,^G,]4 |]",
		dau_hieu: [
			"Giai điệu đi xuống theo gam toàn cung (xem bài 32)",
			"Hợp âm tăng ngân suốt bên dưới",
			"Mơ hồ, không có chủ âm rõ ràng",
		],
	},
	"modern-1": {
		thoi_ky: "modern",
		prog: 12,
		abc:
			"X:1\nL:1/8\nM:4/4\nQ:1/4=132\n" +
			dauBe(12) +
			"K:C\n[V:1] e b d' b e b d' b | e b d' b e b d' b | e b d' e' e b d' e' | e b d' e' e b d' e' | e b d' ^f' e b d' ^f' | e b d' ^f' e b d' ^f' |]\n[V:2] [E,B,]8 | [E,B,]8 | [E,B,]8 | [E,B,]8 | [E,B,]8 | [E,B,]8 |]",
		dau_hieu: [
			"Marimba",
			"Một mẫu ngắn lặp đi lặp lại (ostinato)",
			"Mẫu thay đổi rất chậm, mỗi lần chỉ đổi một nốt",
			"Hòa âm gần như đứng yên: chủ nghĩa tối giản",
		],
	},
	"modern-2": {
		thoi_ky: "modern",
		prog: 48,
		abc:
			"X:1\nL:1/8\nM:2/4\nQ:1/4=104\n" +
			dauBe(48) +
			"K:C\n[V:1] [_EG_B_d]2 [_EG_B_d] [_EG_B_d] | !>![_EG_B_d] [_EG_B_d] [_EG_B_d] !>![_EG_B_d] | [_EG_B_d] !>![_EG_B_d] [_EG_B_d]2 | [_EG_B_d] [_EG_B_d] !>![_EG_B_d] [_EG_B_d] |]\n[V:2] [_F,,_A,,_C,]2 [_F,,_A,,_C,] [_F,,_A,,_C,] | !>![_F,,_A,,_C,] [_F,,_A,,_C,] [_F,,_A,,_C,] !>![_F,,_A,,_C,] | [_F,,_A,,_C,] !>![_F,,_A,,_C,] [_F,,_A,,_C,]2 | [_F,,_A,,_C,] [_F,,_A,,_C,] !>![_F,,_A,,_C,] [_F,,_A,,_C,] |]",
		dau_hieu: [
			"Dàn dây dậm một hợp âm nghịch tai lặp đi lặp lại",
			"Hai hợp âm chồng lên nhau (hợp âm ghép): Mi♭7 trên Fa♭ trưởng, như hợp âm trong Le Sacre du printemps",
			"Trọng âm thay đổi từ ô này sang ô khác, không theo một mẫu đều",
		],
	},
};

/** Dòng dưới khuông của ::cong-cu{ten="style-example"} (như mountExample cũ). */
export const chuDauHieu = (vd) => `Dấu hiệu: ${vd.dau_hieu.join('; ')}.`;

const LOI_DAN = 'Nghe một đoạn ngắn (bấm nút phát), rồi đoán thời kỳ. Khuông nhạc và các dấu hiệu chỉ hiện sau khi bạn trả lời.';
export const CHU_ND = {
	dan: LOI_DAN,
	nhom: 'Chọn thời kỳ',
	dau: 'Bấm nút phát ở trên để nghe.',
	sai: 'Chưa đúng. Nghe lại: để ý nhạc cụ, kết cấu và hòa âm.',
	dung: (k) => `Đúng: ${THOI_KY_ND[k]}. Các dấu hiệu:`,
	diem: (phien) => `Lượt này: đúng ngay lần đầu ${phien.dung}/${phien.tong}.`,
};

/**
 * Ô đoán phong cách dựng sẵn (lúc build): lời dẫn, chỗ trình phát, khuông ẩn, năm nút thời kỳ, dòng phản hồi (aria-live),
 * danh sách dấu hiệu (ẩn), nút "Đoạn khác", dòng điểm. data-sinh: chữ do thành phần dựng (trang cũ dựng bằng JavaScript).
 */
export const veDoanPhongCach = () =>
	`<div class="oz-nd oz-tool not-content" data-cong-cu="style-trainer" data-sinh data-pagefind-ignore>` +
	`<p class="oz-stats">${esc(LOI_DAN)}</p><div class="abc-audio oz-nd-nghe"></div>` +
	`<div class="oz-nd-khuong oz-hidden-staff" aria-hidden="true"></div>` +
	`<div class="oz-row oz-answers" role="group" aria-label="${CHU_ND.nhom}">` +
	Object.entries(THOI_KY_ND)
		.map(([k, t]) => `<button type="button" class="oz-btn" data-p="${k}">${esc(t)}</button>`)
		.join('') +
	`</div><p class="oz-feedback" aria-live="polite">${esc(CHU_ND.dau)}</p><ul class="oz-clues" hidden></ul>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="next">Đoạn khác</button></div>` +
	`<p class="oz-stats oz-score"></p>` +
	`<noscript data-sinh><p>Đoán phong cách cần JavaScript: bật JavaScript trong trình duyệt để nghe và làm bài.</p></noscript></div>`;

/**
 * Chấm một lần chọn và lưu như site cũ: lần trả lời đầu của đoạn tính vào kỹ năng style và vào lượt (phien); đúng thì ghi
 * thêm một đoạn trong ngày (styles). Trả về true khi đúng.
 */
export function chamPhongCach(q, p, phien) {
	const dung = p === q.thoi_ky;
	if (q.lanDau) {
		phien.tong++;
		if (dung) phien.dung++;
		kyNang('style', dung);
	}
	q.lanDau = false;
	if (dung) {
		q.xong = true;
		ghiNgay('styles', 1);
	}
	return dung;
}

/** Trộn tại chỗ (Fisher–Yates, như shuffle cũ). */
export function tron(a, r = Math.random) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(r() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** Thứ tự các đoạn: lần lượt theo một thứ tự trộn; hết một vòng thì trộn lại (next() cũ). */
export function boThuTu(r = Math.random) {
	const thuTu = tron(Object.keys(VI_DU), r);
	let i = -1;
	let daChay = false;
	return () => {
		i = (i + 1) % thuTu.length;
		if (i === 0 && daChay) tron(thuTu, r);
		daChay = true;
		return thuTu[i];
	};
}

export async function mount(goc) {
	if (goc.dataset.san) return;
	goc.dataset.san = '1';
	const nghe = goc.querySelector('.oz-nd-nghe');
	const khuong = goc.querySelector('.oz-nd-khuong');
	const traLoi = goc.querySelector('.oz-answers');
	const phanHoi = goc.querySelector('.oz-feedback');
	const dauHieu = goc.querySelector('.oz-clues');
	const diem = goc.querySelector('.oz-score');
	const phien = { dung: 0, tong: 0 };
	const tiep = boThuTu();
	let q = null;
	let ctrl = null;
	let abc = null;
	try {
		abc = await import('./abc.js');
		await abc.taiAbcjs();
	} catch {
		abc = null;
	}

	const bao = (chu, lop = '') => {
		phanHoi.textContent = chu;
		phanHoi.className = `oz-feedback${lop ? ' ' + lop : ''}`;
	};
	/** Vẽ khuông (ẩn) và gắn trình phát của abcjs, như renderExample cũ. Chữ màu theo chữ của trang (currentColor). */
	function ve(vd) {
		khuong.textContent = '';
		nghe.textContent = '';
		if (!abc || !window.ABCJS) {
			nghe.textContent = 'Không tải được thư viện khuông nhạc.';
			return null;
		}
		const ABCJS = window.ABCJS;
		const visual = ABCJS.renderAbc(khuong, vd.abc, { responsive: 'resize', foregroundColor: 'currentColor', paddingleft: 0, paddingright: 0 })[0];
		if (!ABCJS.synth?.supportsAudio()) return null;
		abc.ngoaiImLang();
		const c = new ABCJS.synth.SynthController();
		c.load(nghe, abc.conTro(), { displayPlay: true, displayRestart: true, displayProgress: true });
		c.setTune(visual, false).catch(() => {
			nghe.textContent = 'Không tải được âm thanh.';
		});
		return c;
	}
	function doanKhac() {
		try {
			ctrl?.pause();
		} catch {
			// chưa phát
		}
		const id = tiep();
		q = { id, thoi_ky: VI_DU[id].thoi_ky, lanDau: true, xong: false };
		khuong.classList.add('oz-hidden-staff');
		khuong.setAttribute('aria-hidden', 'true');
		dauHieu.hidden = true;
		dauHieu.textContent = '';
		for (const b of traLoi.querySelectorAll('button')) {
			b.classList.remove('is-correct', 'is-wrong');
			b.removeAttribute('aria-disabled');
		}
		bao(CHU_ND.dau);
		ctrl = ve(VI_DU[id]);
	}

	traLoi.addEventListener('click', (e) => {
		const b = e.target.closest?.('button[data-p]');
		if (!b || !q || q.xong || b.getAttribute('aria-disabled') === 'true') return;
		if (!chamPhongCach(q, b.dataset.p, phien)) {
			b.classList.add('is-wrong');
			b.setAttribute('aria-disabled', 'true');
			bao(CHU_ND.sai, 'bad');
			return;
		}
		b.classList.add('is-correct');
		bao(CHU_ND.dung(q.thoi_ky), 'ok');
		khuong.classList.remove('oz-hidden-staff');
		khuong.removeAttribute('aria-hidden');
		for (const c of VI_DU[q.id].dau_hieu) {
			const li = document.createElement('li');
			li.textContent = c;
			dauHieu.append(li);
		}
		dauHieu.hidden = false;
		diem.textContent = CHU_ND.diem(phien);
	});
	goc.querySelector('[data-act="next"]').addEventListener('click', doanKhac);
	doanKhac();
}
