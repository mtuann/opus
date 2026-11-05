// Hình phản hồi của các công cụ luyện tập (D7-L1), chuyển từ ../opus-zero/docs/assets/js/viz.js: so sánh chép giai điệu
// (compareRoll cũ) và piano roll cao độ khi chơi theo, hát lại (pianoRoll cũ). Hàm thuần trả về chuỗi SVG (kiểm thử bằng
// Node, chèn bằng innerHTML). Khác bản cũ: màu theo lớp CSS của site (src/styles/thanh-phan.css: oz-ss-dat, oz-ss-cao,
// oz-ss-thap, oz-ss-thieu; có bản sáng và tối), không viết cứng; chữ trong hình là chữ thật. Dải nhịp gõ (tapStrip) và biểu
// đồ tiến bộ theo tuần chuyển cùng trang của chúng (D7-L2).

const TEN = ['Đô', 'Đô♯', 'Rê', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'Si♭', 'Si'];
const TU_NHIEN = [0, 2, 4, 5, 7, 9, 11];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const so = (x) => String(Math.round(x * 10) / 10);
/** Tên nốt kèm quãng tám: "Sol4" (name của viz.js). */
export const tenNot = (m) => {
	const r = Math.round(m);
	return TEN[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1);
};
const laTuNhien = (m) => TU_NHIEN.includes(((m % 12) + 12) % 12);
const f2m = (f) => 69 + 12 * Math.log2(f / 440);

const svg = (w, h, nhan, than) => `<svg class="oz-ss" viewBox="0 0 ${so(w)} ${so(h)}" role="img" aria-label="${esc(nhan)}">${than}</svg>`;
const chu = (x, y, s, lop = '', canh = 'start') => `<text x="${so(x)}" y="${so(y)}" text-anchor="${canh}"${lop ? ` class="${lop}"` : ''}>${esc(s)}</text>`;
/** Dòng kẻ và tên của các nốt tự nhiên từ lo đến hi (nền của hai hình). */
function luoi(lo, hi, L, W, y) {
	let b = '';
	for (let m = lo; m <= hi; m++)
		if (laTuNhien(m)) b += `<line class="oz-ss-luoi" x1="${L}" x2="${W}" y1="${so(y(m))}" y2="${so(y(m))}"/>` + chu(L - 4, y(m) + 3, tenNot(m), 'oz-ss-ten', 'end');
	return b;
}

/**
 * Chép giai điệu: mỗi cột một nốt; ô là nốt đúng (lớp oz-ss-dat khi chép đúng, oz-ss-cao khi sai), chấm là nốt chép sai,
 * nối với ô bằng vạch đứt. `dung`, `nhap`: số MIDI.
 */
export function soSanhChep(dung, nhap) {
	if (!dung.length) return '';
	const tat = dung.concat(nhap.filter((m) => m !== undefined));
	const lo = Math.min(...tat) - 1;
	const hi = Math.max(...tat) + 1;
	const L = 44;
	const W = 60 + dung.length * 52;
	const H = (hi - lo + 1) * 11 + 30;
	const y = (m) => 6 + (hi - m) * 11;
	let b = luoi(lo, hi, L, W, y);
	dung.forEach((m, i) => {
		const cx = L + 26 + i * 52;
		const dat = nhap[i] === m;
		b += `<rect class="${dat ? 'oz-ss-dat' : 'oz-ss-cao'}" x="${cx - 20}" y="${so(y(m) - 4.5)}" width="40" height="9" rx="2"/>`;
		if (nhap[i] !== undefined && !dat)
			b += `<circle class="oz-ss-cham-sai" cx="${cx}" cy="${so(y(nhap[i]))}" r="4"/><line class="oz-ss-noi" x1="${cx}" x2="${cx}" y1="${so(y(nhap[i]))}" y2="${so(y(m))}"/>`;
		b += chu(cx, H - 6, String(i + 1), 'oz-ss-ten', 'middle');
	});
	return svg(W, H, 'So sánh: ô là nốt đúng (xanh lá khi bạn chép đúng), chấm đỏ là nốt bạn chép sai', b);
}

/**
 * Piano roll: ô là nốt cần chơi (`can`: [{ m, t0, dai, ket_qua: 'dat' | 'cao' | 'thap' | 'thieu' }], giây), chấm nhỏ là cao
 * độ đo được từ micro (`khung`: [{ t, f }], Hz), chấm lớn là phím bấm trên đàn MIDI (`phim`: [{ t, m }]). `boQuangTam`: gấp
 * cao độ đo được về quãng tám gần nốt cần chơi (hát hay chơi ở quãng tám khác vẫn tính).
 */
export function pianoRoll({ can = [], khung = [], phim = [], boQuangTam = false }) {
	if (!can.length) return '';
	const t0 = can[0].t0 - 0.2;
	const t1 = can[can.length - 1].t0 + can[can.length - 1].dai + 0.2;
	const lo = Math.min(...can.map((n) => n.m)) - 2;
	const hi = Math.max(...can.map((n) => n.m)) + 2;
	const W = 640;
	const H = Math.max(120, (hi - lo + 1) * 11 + 24);
	const L = 44;
	const x = (t) => L + ((t - t0) / (t1 - t0)) * (W - L - 6);
	const y = (m) => 6 + (hi - m) * ((H - 24) / (hi - lo));
	let b = luoi(lo, hi, L, W, y);
	for (const n of can)
		b += `<rect class="oz-ss-${n.ket_qua ?? 'thieu'}" x="${so(x(n.t0))}" y="${so(y(n.m) - 4.5)}" width="${so(Math.max(2, x(n.t0 + n.dai) - x(n.t0) - 2))}" height="9" rx="2"/>`;
	let cham = '';
	for (const k of khung) {
		if (!(k.f > 0) || k.t < t0 || k.t > t1) continue;
		let m = f2m(k.f);
		if (boQuangTam) {
			const dang = can.find((n) => k.t >= n.t0 && k.t < n.t0 + n.dai);
			if (dang) {
				while (m - dang.m > 6) m -= 12;
				while (dang.m - m > 6) m += 12;
			}
		}
		if (m < lo - 0.5 || m > hi + 0.5) continue;
		cham += `<circle cx="${so(x(k.t))}" cy="${so(y(m))}" r="1.6"/>`;
	}
	if (cham) b += `<g class="oz-ss-do">${cham}</g>`;
	for (const p of phim) {
		if (p.t < t0 || p.t > t1) continue;
		b += `<circle class="oz-ss-phim" cx="${so(x(p.t))}" cy="${so(y(Math.max(lo, Math.min(hi, p.m))))}" r="3.2"/>`;
	}
	b += chu(L, H - 4, `Ô: nốt đúng (xanh lá = đạt, đỏ = cao, xanh dương = thấp, xám = thiếu) · chấm: ${phim.length ? 'phím bạn bấm' : 'cao độ bạn hát hoặc chơi'}`, 'oz-ss-chu');
	return svg(W, H, 'Piano roll so sánh nốt cần chơi với cao độ thực tế của bạn', b);
}
