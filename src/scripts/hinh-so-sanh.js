// Hình phản hồi của các công cụ luyện tập (D7-L1), chuyển từ ../opus-zero/docs/assets/js/viz.js: so sánh chép giai điệu
// (compareRoll cũ) và piano roll cao độ khi chơi theo, hát lại (pianoRoll cũ). Hàm thuần trả về chuỗi SVG (kiểm thử bằng
// Node, chèn bằng innerHTML). Khác bản cũ: màu theo lớp CSS của site (src/styles/thanh-phan.css: oz-ss-dat, oz-ss-cao,
// oz-ss-thap, oz-ss-thieu; có bản sáng và tối), không viết cứng; chữ trong hình là chữ thật. D7-L2 thêm dải nhịp gõ
// (tapStrip cũ, công cụ tiết tấu), biểu đồ tiến bộ theo tuần (weekly, trendsHtml cũ, trang Nhật ký) và hàng kết quả từng nốt
// (chơi theo, thị tấu một bè).

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

/** Hàng kết quả từng nốt (resultRow cũ; chơi theo, thị tấu một bè): ✓, "thiếu", số cent hay tên phím đã bấm. */
export function hangKetQua(kq) {
	return `<div class="oz-ket-qua">${kq
		.map((r) => {
			const lop = r.ket_qua === 'dat' ? 'dat' : r.ket_qua === 'thieu' ? 'thieu' : 'sai';
			const nhan = r.ket_qua === 'dat' ? '✓' : r.ket_qua === 'thieu' ? 'thiếu' : r.cent !== undefined ? `${r.cent > 0 ? '+' : ''}${r.cent}¢` : r.bam !== undefined ? tenNot(r.bam) : '?';
			return `<span class="oz-kq oz-kq-${lop}"><b>${esc(tenNot(r.m))}</b>${esc(nhan)}</span>`;
		})
		.join('')}</div>`;
}

// ---------- Dải nhịp gõ (tiết tấu, D7-L2) ----------

/**
 * Ghép lần gõ với lúc cần gõ (finish của rhythm.js cũ): mỗi lúc cần gõ lấy lần gõ gần nhất chưa dùng, trong `dungSai` giây.
 * Trả về { trung: [[lúc cần gõ, lần gõ]…], thua: [lần gõ không ghép được] }. Hàm thuần, chấm điểm và dải nhịp dùng chung.
 */
export function ghepNhip(can, go, dungSai) {
	const con = go.slice();
	const trung = [];
	for (const e of can) {
		let tot = -1;
		let kc = 1e9;
		con.forEach((t, i) => {
			const d = Math.abs(t - e);
			if (d < kc) {
				kc = d;
				tot = i;
			}
		});
		if (tot >= 0 && kc <= dungSai) trung.push([e, con.splice(tot, 1)[0]]);
	}
	return { trung, thua: con };
}

/**
 * Dải thời gian của một lượt gõ (tapStrip cũ): vạch đậm là lúc cần gõ (`can`, giây), chấm là lần gõ (`go`): xanh lá đúng lúc
 * (lệch dưới 30 ms), xanh dương sớm, đỏ muộn, vòng xám là gõ thừa. `dau`: lúc phách đầu (sau đếm vào), `phach`: giây mỗi
 * phách, `soPhach`: số phách được vẽ. Màu theo lớp CSS (oz-ss-go-*), có chú giải bằng chữ ngay dưới.
 */
export function daiNhipGo({ can = [], go = [], phach, dau, soPhach = 8, dungSai }) {
	const W = 640;
	const L = 10;
	const x = (t) => L + ((t - dau + phach * 0.25) / (phach * (soPhach + 0.5))) * (W - 2 * L);
	let b = '';
	for (let i = 0; i <= soPhach; i++) {
		const xx = x(dau + i * phach);
		b += `<line class="${i % 4 === 0 ? 'oz-ss-o-nhip' : 'oz-ss-luoi'}" x1="${so(xx)}" x2="${so(xx)}" y1="10" y2="56"/>`;
		if (i < soPhach) b += chu(xx + 2, 66, String((i % 4) + 1), 'oz-ss-ten');
	}
	const { trung, thua } = ghepNhip(can, go, dungSai);
	for (const e of can) b += `<line class="oz-ss-can-go" x1="${so(x(e))}" x2="${so(x(e))}" y1="16" y2="50"/>`;
	for (const [e, t] of trung) {
		const d = t - e;
		b += `<circle class="oz-ss-go-${Math.abs(d) < 0.03 ? 'dat' : d < 0 ? 'som' : 'muon'}" cx="${so(x(t))}" cy="33" r="5"/>`;
	}
	for (const t of thua) b += `<circle class="oz-ss-go-thua" cx="${so(x(t))}" cy="33" r="4"/>`;
	return (
		svg(W, 70, 'Dải thời gian: vạch đậm là lúc cần gõ, chấm là lúc bạn gõ; xanh lá đúng lúc, xanh dương sớm, đỏ muộn, vòng xám là gõ thừa', b) +
		'<p class="oz-ss-chu-giai"><span class="oz-ss-go-dat">●</span> đúng lúc <span class="oz-ss-go-som">●</span> sớm ' +
		'<span class="oz-ss-go-muon">●</span> muộn <span class="oz-ss-go-thua">○</span> thừa · vạch đậm: lúc cần gõ</p>'
	);
}

// ---------- Tiến bộ theo tuần (trang Nhật ký, D7-L2) ----------

/** Thứ Hai của tuần chứa ngày iso (weekKey cũ). */
export function khoaTuan(iso) {
	const [y, m, d] = iso.split('-').map(Number);
	const x = new Date(Date.UTC(y, m - 1, d));
	x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
	return x.toISOString().slice(0, 10);
}

/** Số lượt và số đúng của `soTuan` tuần gần nhất (weekly cũ): `lich` là skillHist[kỹ năng] ({ ngày: [lượt, đúng] }). */
export function theoTuan(lich, homNay, soTuan) {
	const ra = [];
	const cuoi = new Date(`${khoaTuan(homNay)}T00:00:00Z`);
	for (let i = soTuan - 1; i >= 0; i--) {
		const d = new Date(cuoi);
		d.setUTCDate(d.getUTCDate() - 7 * i);
		ra.push({ w: d.toISOString().slice(0, 10), n: 0, c: 0 });
	}
	const chiSo = Object.fromEntries(ra.map((o, i) => [o.w, i]));
	for (const ngay of Object.keys(lich || {})) {
		const k = /^\d{4}-\d{2}-\d{2}$/.test(ngay) ? chiSo[khoaTuan(ngay)] : undefined;
		if (k === undefined || !Array.isArray(lich[ngay])) continue;
		ra[k].n += Number(lich[ngay][0]) || 0;
		ra[k].c += Number(lich[ngay][1]) || 0;
	}
	return ra;
}

/** Đường nhỏ: độ chính xác từng tuần, vạch nét đứt ở 80% (spark cũ). */
function duongNho(diem, nhan) {
	const W = 220;
	const H = 54;
	const L = 4;
	const R = 30;
	const x = (i) => L + (i / (diem.length - 1)) * (W - L - R);
	const y = (p) => 6 + (1 - p) * (H - 18);
	let duong = '';
	let cham = '';
	let cuoi = null;
	let xCuoi = 0;
	diem.forEach((p, i) => {
		if (!p.n) return;
		const pc = p.c / p.n;
		duong += `${duong ? 'L' : 'M'}${so(x(i))} ${so(y(pc))}`;
		cham += `<circle cx="${so(x(i))}" cy="${so(y(pc))}" r="2"/>`;
		cuoi = pc;
		xCuoi = x(i);
	});
	let b = `<line class="oz-ss-moc" x1="${L}" x2="${W - R}" y1="${so(y(0.8))}" y2="${so(y(0.8))}"/>` + chu(L + 1, y(0.8) - 2, '80%', 'oz-ss-ten oz-ss-nho');
	b += `<path class="oz-tb-duong" d="${duong}"/><g class="oz-tb-cham">${cham}</g>`;
	if (cuoi !== null) b += chu(xCuoi + 5, y(cuoi) + 3, `${Math.round(cuoi * 100)}%`);
	return svg(W, H, nhan, b);
}

/**
 * Biểu đồ tiến bộ (trendsHtml cũ): mỗi kỹ năng đã có lượt luyện một đường độ chính xác theo tuần, 12 tuần gần nhất.
 * `lichSu`: store.skillHist; `ten`: id kỹ năng -> tên.
 */
export function bieuDoTienBo(lichSu, homNay, ten) {
	const ids = Object.keys(lichSu || {}).filter((k) => lichSu[k] && typeof lichSu[k] === 'object' && Object.keys(lichSu[k]).length);
	if (!ids.length) return '<p class="oz-stats">Chưa có dữ liệu. Biểu đồ sẽ xuất hiện sau vài ngày luyện tập.</p>';
	return (
		'<div class="oz-tb-luoi">' +
		ids
			.map((id) => {
				const w = theoTuan(lichSu[id], homNay, 12);
				const tong = w.reduce((s, p) => s + p.n, 0);
				const t = ten[id] || id;
				return `<div class="oz-tb-o"><b>${esc(t)}</b><small> · ${tong} lượt trong 12 tuần</small>${duongNho(w, `Độ chính xác theo tuần của kỹ năng ${t}`)}</div>`;
			})
			.join('') +
		'</div><p class="oz-stats">Mỗi điểm là độ chính xác của một tuần (12 tuần gần nhất); đường nét đứt: mốc 80%.</p>'
	);
}
