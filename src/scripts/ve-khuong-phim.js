// Khuông kép nối xuống bàn phím (đợt hình 2, ::hinh{ten="khuong-kep-phim"}, bài nhạc lý 2): khuông khóa Sol và khuông khóa
// Fa ở trên, bàn phím (veBanPhim) ở dưới; ba nốt mốc của trang (Fa3 trên dòng 4 khóa Fa, Đô giữa trên dòng kẻ phụ giữa hai
// khuông, Sol4 trên dòng 2 khóa Sol) đặt đúng trên phím của nó, nối xuống phím bằng nét đứt; dòng khóa Sol ôm (dòng 2) và
// dòng giữa hai chấm khóa Fa (dòng 4) tô màu; dòng đánh số 1–5 từ dưới lên. Module thuần, trả chuỗi SVG; dựng lúc build.
// Khóa và đầu nốt dùng ký hiệu chung của ve.js (<use href="#oz-kh-…">: MarkdownContent.astro thêm định nghĩa).
import { KY_HIEU, tamPhim, veBanPhim } from './ve.js';
import { midiCua } from './nhac-ly.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const so = (x) => String(Math.round(x * 100) / 100);

const KHE = 7.75; // một khe (hai bậc), như ve.js và abcjs
const BAC = KHE / 2;
const TRAI = 14; // lề trái của bàn phím (chỗ cho khóa: nốt Fa3 ở phím thứ hai không đè khóa Fa)
const PHAI = 12; // lề phải (số dòng)
const TREN = 20; // y của dòng 5 khuông khóa Sol (đỉnh khóa Sol cao hơn khoảng 14)
const GIUA = 31; // khoảng giữa dòng 1 khóa Sol và dòng 5 khóa Fa: Đô giữa của hai khuông cách nhau hai khe
const KHOANG_PHIM = 22; // từ dòng 1 khóa Fa đến đỉnh phím
const PHIM_RONG = 24;

/** Bậc (chữ cái) của nốt viết kiểu "F3": quãng tám × 7 + chữ cái (Đô = 0 … Si = 6), như DONG_DUOI_CUA của ve.js. */
const bacCua = (not) => Number(not.at(-1)) * 7 + 'CDEFGAB'.indexOf(not[0]);

/** Ba nốt mốc của trang (bài 2, mục "Khuông kép" và tip "Trên phím đàn"): nốt, khuông, nhãn dưới phím. */
export const MOC = [
	{ not: 'F3', khuong: ['bass'], nhan: ['Fa3', 'dòng 4', 'khóa Fa'] },
	{ not: 'C4', khuong: ['treble', 'bass'], nhan: ['Đô4', 'Đô giữa'] },
	{ not: 'G4', khuong: ['treble'], nhan: ['Sol4', 'dòng 2', 'khóa Sol'] },
];

/** Khoảng phím: Mi3 đến La4 (một phím trắng mỗi bên ngoài nốt mốc thấp nhất và cao nhất). */
export const PHIM = ['E3', 'A4'];

/**
 * Hình khuông kép nối phím. Trả { svg, rong, cao, phim: [{ m, x, y }] } (x, y: tâm đầu nốt của từng nốt mốc, theo đơn vị
 * của viewBox; kiểm thử dùng).
 */
export function veKhuongKepPhim() {
	const [thap, cao] = PHIM.map(midiCua);
	const banPhim = veBanPhim({
		thap,
		cao,
		to: MOC.map((x) => midiCua(x.not)),
		nhanPhim: MOC.map((x) => ({ m: midiCua(x.not), dong: x.nhan })),
	});
	const rongPhim = banPhim.soTrang * PHIM_RONG + 2;
	const rong = TRAI + rongPhim + PHAI;
	const cuoiDong = rong - PHAI + 2;
	// y của dòng 1 (dưới cùng) mỗi khuông; nốt ở dòng 1: Mi4 (khóa Sol), Sol2 (khóa Fa)
	const duoi = { treble: TREN + 4 * KHE, bass: TREN + 4 * KHE + GIUA + 4 * KHE };
	const goc = { treble: bacCua('E4'), bass: bacCua('G2') };
	const yNot = (khuong, not) => duoi[khuong] - (bacCua(not) - goc[khuong]) * BAC;
	const yPhim = duoi.bass + KHOANG_PHIM;

	const cacDong = [];
	const soDong = [];
	for (const k of ['treble', 'bass'])
		for (let i = 0; i < 5; i++) {
			const y = duoi[k] - i * KHE;
			// dòng mốc: dòng 2 khóa Sol (nét xoắn ôm), dòng 4 khóa Fa (giữa hai chấm)
			const moc = (k === 'treble' && i === 1) || (k === 'bass' && i === 3);
			cacDong.push(`<path${moc ? ' class="oz-kp-dong-moc"' : ''} d="M6 ${so(y)}H${so(cuoiDong)}"/>`);
			soDong.push(`<text class="oz-kp-so" x="${so(rong - 5.5)}" y="${so(y + 2.2)}">${i + 1}</text>`);
		}
	const khoa =
		`<path class="oz-kp-ngoac" d="M6 ${so(TREN)}V${so(duoi.bass)}"/>` +
		`<use href="#oz-kh-khoa-sol" x="10" y="${so(duoi.treble - KHE)}"/>` +
		`<use href="#oz-kh-khoa-fa" x="10" y="${so(duoi.bass - 3 * KHE)}"/>`;

	const phim = [];
	const not = [];
	const noi = [];
	for (const x of MOC) {
		const m = midiCua(x.not);
		const cx = TRAI + tamPhim(thap, m);
		const ys = x.khuong.map((k) => yNot(k, x.not));
		for (const [i, k] of x.khuong.entries()) {
			const y = ys[i];
			// dòng kẻ phụ của nốt nằm ngoài khuông (Đô giữa)
			if (y > duoi[k] + 0.1 || y < duoi[k] - 4 * KHE - 0.1) not.push(`<path class="oz-kp-phu" d="M${so(cx - 11)} ${so(y)}H${so(cx + 11)}"/>`);
			not.push(`<use class="oz-kp-not" href="#oz-kh-not-tron" x="${so(cx - 7.5)}" y="${so(y)}" data-not="${x.not}"/>`);
		}
		const ys2 = [...ys].sort((a, b) => a - b);
		for (let i = 0; i + 1 < ys2.length; i++) noi.push(`M${so(cx)} ${so(ys2[i] + 4.5)}V${so(ys2[i + 1] - 4.5)}`);
		noi.push(`M${so(cx)} ${so(ys2.at(-1) + 4.5)}V${so(yPhim + 1)}`); // đỉnh phím ở y 1 của bàn phím
		phim.push({ m, x: cx, y: ys });
	}

	// bàn phím: bỏ thẻ <svg> ngoài của veBanPhim, đặt phần trong vào nhóm dời xuống dưới khuông
	const trong = banPhim.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
	const caoPhim = Number(/viewBox="0 0 [\d.]+ ([\d.]+)"/.exec(banPhim.svg)[1]);
	const caoHinh = yPhim + caoPhim;
	const nhan =
		'Khuông kép nối xuống bàn phím từ Mi3 đến La4. Khóa Sol ở khuông trên, khóa Fa ở khuông dưới; dòng đánh số 1 đến 5 từ dưới lên. ' +
		'Ba nốt mốc, mỗi nốt nối xuống phím của nó: Fa3 trên dòng 4 khóa Fa (dòng nằm giữa hai chấm của khóa); ' +
		'Đô4, Đô giữa, trên dòng kẻ phụ ngay dưới khuông khóa Sol, và cũng trên dòng kẻ phụ ngay trên khuông khóa Fa; ' +
		'Sol4 trên dòng 2 khóa Sol (dòng nét xoắn của khóa ôm lấy).';
	const svg =
		`<svg class="oz-hb oz-kp" viewBox="0 0 ${so(rong)} ${so(caoHinh)}" role="img" aria-label="${esc(nhan)}">` +
		`<g aria-hidden="true"><g class="oz-hb-dong">${cacDong.join('')}</g>${khoa}<g class="oz-kp-so-dong">${soDong.join('')}</g>` +
		`<path class="oz-kp-noi" d="${noi.join('')}"/><g class="oz-hb-dong">${not.filter((s) => s.includes('oz-kp-phu')).join('')}</g>` +
		`${not.filter((s) => !s.includes('oz-kp-phu')).join('')}</g>` +
		`<g class="oz-kp-phim" transform="translate(${TRAI} ${so(yPhim)})" aria-hidden="true">${trong}</g></svg>`;
	return { svg, rong, cao: caoHinh, phim };
}

/** Hình đầy đủ cho ::hinh{ten="khuong-kep-phim"}: figure, data-sinh (chữ do thành phần dựng), chú thích chữ thật. */
export const hinhKhuongKepPhim = () =>
	`<figure class="oz-figure oz-khuong-phim not-content" data-sinh>${veKhuongKepPhim().svg}` +
	`<figcaption>Ba nốt mốc trên khuông kép và trên phím đàn: Fa3 trên dòng 4 khóa Fa, Đô giữa (Đô4) trên dòng kẻ phụ giữa hai khuông, ` +
	`Sol4 trên dòng 2 khóa Sol. Dòng đánh số từ dưới lên.</figcaption></figure>`;

// KY_HIEU nhập để chắc tên ký hiệu dùng ở trên có trong bộ ký hiệu chung
for (const k of ['khoa-sol', 'khoa-fa', 'not-tron']) if (!KY_HIEU[k]) throw new Error(`ve-khuong-phim: thiếu ký hiệu ${k}`);
