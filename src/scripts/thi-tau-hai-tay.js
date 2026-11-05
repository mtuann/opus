// Thị tấu hai tay (::cong-cu{ten="sight2"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/sight2.js: bài 4 ô nhịp cho hai tay
// trên khuông kép theo bốn cấp (mỗi tay ở thế năm ngón từ chủ âm, số ngón ở nốt đầu mỗi tay; phách mạnh của tay phải luôn là
// âm của hợp âm tay trái; bài kết về chủ âm). Bài dựng thành khối khuông nhạc của site (src/scripts/abc.js: trình phát, tốc
// độ, nghe từng tay, gõ nhịp, giá nhạc). Người học chơi trên đàn của mình rồi tự chấm một trong ba mức; bốn trên năm bài gần
// nhất ở một cấp trôi chảy thì gợi ý lên cấp. Lưu như bản cũ (opus-zero:v1): kỹ năng "sight2" (đạt khi "Trôi chảy"),
// days[ngày].readings, store.sight2Hist (50 lần gần nhất), store.sight2Level (cấp đã chọn; chưa chọn thì theo chặng piano,
// store.pianoLevel, tối đa 4).
// taoBai là gen() cũ, hàm thuần (`rnd`), giữ đúng thứ tự gọi số ngẫu nhiên để so được với bản cũ (tests/luyen-tap-d7.test.mjs).
// Khác bản cũ: nút tự chấm sau khi chấm dùng aria-disabled (giữ tiêu điểm) thay vì disabled.
import { layKho, datKho, ghiNgay, kyNang, soHomNay, homNay } from './tien-do.js';

const CHU_CAI = 'CDEFGAB';
/** Bậc tuyệt đối (Đô4 = 28: quãng tám × 7 + chữ cái) thành nốt ABC (abcNote cũ). */
export function abcNot(v) {
	const l = CHU_CAI[((v % 7) + 7) % 7];
	const o = Math.floor(v / 7);
	return o >= 5 ? l.toLowerCase() + "'".repeat(o - 5) : l + ','.repeat(4 - o);
}
/** Giọng: [K: của ABC, tên, chủ âm tay phải, chủ âm tay trái] (KEYS cũ). */
export const GIONG = {
	C: ['C', 'Đô trưởng', 28, 21],
	G: ['G', 'Sol trưởng', 32, 18],
	F: ['F', 'Fa trưởng', 31, 17],
	D: ['D', 'Rê trưởng', 29, 22],
	Am: ['Am', 'La thứ', 33, 19],
	Dm: ['Dm', 'Rê thứ', 29, 22],
	Em: ['Em', 'Mi thứ', 30, 23],
};
/** Bốn cấp (LEVELS cũ). */
export const CAP = {
	1: { ten: 'Đô trưởng, hai tay lần lượt', giong: ['C'], nhip: ['4/4'], q: 60 },
	2: { ten: 'tay trái giữ nốt dài', giong: ['C', 'G', 'F'], nhip: ['4/4', '3/4'], q: 60 },
	3: { ten: 'tay trái theo hợp âm, có móc đơn', giong: ['C', 'G', 'F', 'Am', 'Dm'], nhip: ['4/4', '3/4'], q: 66 },
	4: { ten: 'hợp âm rải, nhịp chấm dôi', giong: ['G', 'D', 'F', 'Em', 'Dm'], nhip: ['4/4', '3/4'], q: 72 },
};
/** Tiết tấu một ô (đơn vị: phách nốt đen) theo nhịp và cấp (RHY cũ). */
const TIET_TAU = {
	'4/4': {
		1: [[4], [2, 2], [1, 1, 2], [2, 1, 1], [1, 1, 1, 1]],
		2: [[2, 2], [1, 1, 2], [2, 1, 1], [1, 1, 1, 1], [3, 1]],
		3: [[1, 1, 1, 1], [0.5, 0.5, 1, 2], [1, 0.5, 0.5, 2], [2, 0.5, 0.5, 1], [1, 1, 2], [2, 1, 1]],
		4: [[1.5, 0.5, 1, 1], [1.5, 0.5, 2], [1, 1, 1.5, 0.5], [0.5, 0.5, 0.5, 0.5, 2], [2, 1, 1], [1, 0.5, 0.5, 2]],
	},
	'3/4': {
		2: [[3], [2, 1], [1, 1, 1], [1, 2]],
		3: [[2, 1], [1, 1, 1], [0.5, 0.5, 1, 1], [1, 0.5, 0.5, 1], [1, 2]],
		4: [[1.5, 0.5, 1], [0.5, 0.5, 1, 1], [2, 1], [1, 1, 1], [1, 0.5, 0.5, 1]],
	},
};
const KE_HOACH = [
	['I', 'V', 'V', 'I'],
	['I', 'IV', 'V', 'I'],
	['I', 'I', 'V', 'I'],
];
const HOP_AM = { I: [1, 3, 5], IV: [4, 6, 1], V: [5, 7, 2] };
/** Tay trái theo hợp âm, các bậc trong thế năm ngón (LH cũ). */
const TAY_TRAI = {
	3: {
		'4/4': { I: [[1, 2], [5, 2]], IV: [[4, 2], [1, 2]], V: [[5, 2], [2, 2]] },
		'3/4': { I: [[1, 2], [5, 1]], IV: [[4, 2], [1, 1]], V: [[5, 2], [2, 1]] },
	},
	4: {
		'4/4': { I: [[1, 1], [5, 1], [3, 1], [5, 1]], IV: [[4, 1], [1, 1], [4, 1], [1, 1]], V: [[5, 1], [2, 1], [4, 1], [2, 1]] },
		'3/4': { I: [[1, 1], [5, 1], [3, 1]], IV: [[4, 1], [1, 1], [4, 1]], V: [[5, 1], [2, 1], [4, 1]] },
	},
};

const chon = (a, rnd) => a[Math.floor(rnd() * a.length)];
const kep = (d) => Math.max(1, Math.min(5, d));
function ganHopAm(cac, truoc, rnd) {
	const tot = Math.min(...cac.map((d) => Math.abs(d - truoc)));
	let c = cac.filter((d) => Math.abs(d - truoc) <= tot + 1);
	const di = c.filter((d) => d !== truoc);
	if (di.length && rnd() < 0.75) c = di; // tránh đứng yên một chỗ
	return chon(c, rnd);
}
function buocTu(truoc, rnd, nhay) {
	const r = rnd();
	const s = r < 0.44 ? 1 : r < 0.88 ? -1 : r < 0.94 ? 0 : (rnd() < 0.5 ? 1 : -1) * (nhay ? 2 : 1);
	const d = truoc + s;
	return d < 1 || d > 5 ? kep(truoc - s) : d;
}
/** Một ô giai điệu (bậc 1–5) theo hợp âm; phách mạnh luôn là âm của hợp âm; không lặp một nốt quá hai lần liền (melodyBar cũ). */
function oGiaiDieu(hopAm, tietTau, st, manh, rnd, nhay, cuoi) {
	const am = hopAm ? HOP_AM[hopAm].filter((d) => d >= 1 && d <= 5) : null;
	const ra = [];
	let t = 0;
	tietTau.forEach((dai, i) => {
		const laManh = am && manh.indexOf(t) >= 0;
		let d;
		if (cuoi && i === tietTau.length - 1) d = 1;
		else if (laManh) d = ganHopAm(am, st.prev, rnd);
		else d = buocTu(st.prev, rnd, nhay);
		if (!(cuoi && i === tietTau.length - 1) && d === st.prev && st.prev === st.prev2) {
			const khac = laManh ? am.filter((x) => x !== d) : [kep(d + 1), kep(d - 1)].filter((x) => x !== d);
			if (khac.length) d = ganHopAm(khac, st.prev, rnd);
		}
		ra.push([d, dai]);
		st.prev2 = st.prev;
		st.prev = d;
		t += dai;
	});
	return ra;
}
const soPhach = (m) => (m === '3/4' ? 3 : 4);

/** Bài mới (gen cũ): { level, key, keyName, meter, q, plan, rh, lh, abc } (tên trường như bản cũ). */
export function taoBai(cap, rnd = Math.random) {
	const L = CAP[cap] || CAP[1];
	const key = chon(L.giong, rnd);
	const meter = chon(L.nhip, rnd);
	const n = soPhach(meter);
	const manh = meter === '3/4' ? [0] : [0, 2];
	const cuoi = meter === '3/4' ? [3] : chon([[4], [2, 2]], rnd);
	const rh = [];
	const lh = [];
	let plan = null;
	if (cap <= 1) {
		// hai ô tay phải rồi hai ô tay trái, mỗi tay một giai điệu ở thế năm ngón
		const st = { prev: chon([1, 3, 5], rnd), prev2: 0 };
		for (let b = 0; b < 2; b++) {
			rh.push(oGiaiDieu(null, chon(TIET_TAU['4/4'][1], rnd), st, manh, rnd, false, false));
			lh.push(null);
		}
		const sl = { prev: chon([3, 5], rnd), prev2: 0 };
		rh.push(null);
		lh.push(oGiaiDieu(null, chon(TIET_TAU['4/4'][1], rnd), sl, manh, rnd, false, false));
		rh.push(null);
		lh.push(oGiaiDieu(null, cuoi, sl, manh, rnd, false, true));
	} else {
		plan = chon(KE_HOACH, rnd);
		const st = { prev: chon([1, 3, 5], rnd), prev2: 0 };
		plan.forEach((ch, b) => {
			const het = b === 3;
			rh.push(oGiaiDieu(ch, het ? cuoi : chon(TIET_TAU[meter][cap], rnd), st, manh, rnd, cap >= 3, het));
			if (cap === 2 || het) lh.push([[{ I: 1, IV: 4, V: 5 }[ch], n]]);
			else lh.push(TAY_TRAI[cap][meter][ch].map((x) => x.slice()));
		});
	}
	const k = GIONG[key];
	return { level: cap, key, keyName: k[1], meter, q: L.q, plan, rh, lh, abc: sangAbc(k, meter, L.q, rh, lh, n) };
}

const donVi = (phach) => {
	const u = Math.round(phach * 2);
	return u === 1 ? '' : String(u);
};
function be(cacO, chuAm, n, ngon) {
	let dau = true;
	return (
		cacO
			.map((o) => {
				if (!o) return `z${donVi(n)}`;
				let ra = '';
				let t = 0;
				let eTruoc = false;
				let phachTruoc = -1;
				for (const [d, dai] of o) {
					const tok = (dau ? `!${ngon(d)}!` : '') + abcNot(chuAm + d - 1) + donVi(dai);
					dau = false;
					const e = dai === 0.5;
					const noi = e && eTruoc && Math.floor(t) === phachTruoc;
					ra += (ra && !noi ? ' ' : '') + tok;
					eTruoc = e;
					phachTruoc = Math.floor(t);
					t += dai;
				}
				return ra;
			})
			.join(' | ') + ' |]'
	);
}
function sangAbc(k, meter, q, rh, lh, n) {
	return [
		'X:1',
		`M:${meter}`,
		'L:1/8',
		`Q:1/4=${q}`,
		'%%score {RH LH}',
		'V:RH clef=treble',
		'V:LH clef=bass',
		`K:${k[0]}`,
		`[V:RH] ${be(rh, k[2], n, (d) => d)}`,
		`[V:LH] ${be(lh, k[3], n, (d) => 6 - d)}`,
	].join('\n');
}

/** Ba mức tự chấm (RATES cũ) và lời nhắn (FEED cũ). */
export const MUC = [
	['good', 'Trôi chảy'],
	['some', 'Vấp vài chỗ'],
	['bad', 'Phải dừng nhiều'],
];
export const LOI = {
	good: 'Tốt. Bấm Bài mới để đọc tiếp.',
	some: 'Lần sau nhìn kỹ hơn trước khi chơi và chọn tốc độ chậm hơn một chút.',
	bad: 'Thử chậm hơn hẳn hoặc lùi một cấp: giữ nhịp quan trọng hơn đúng từng nốt.',
};

/** Cấp mặc định (defaultLevel cũ): cấp đã chọn, không thì theo chặng piano (1–4), không thì 1. */
export function capDau(daChon, chang) {
	if (daChon) return daChon;
	return chang?.stage ? Math.max(1, Math.min(4, chang.stage)) : 1;
}

/** Lời nhắn sau khi tự chấm: thêm gợi ý lên cấp khi bốn trên năm bài gần nhất của cấp này trôi chảy. */
export function loiSauCham(muc, cap, lichSu) {
	let s = LOI[muc];
	const cung = lichSu.filter((h) => h.l === cap).slice(-5);
	if (cap < 4 && cung.length === 5 && cung.filter((h) => h.r === 'good').length >= 4) s += ` Bốn trên năm bài gần nhất trôi chảy: bạn đã sẵn sàng lên cấp ${cap + 1}.`;
	return s;
}

/** Dòng thống kê (stats cũ). */
export function chuThongKe(soBai, lichSu) {
	const gan = lichSu.slice(-10);
	const tot = gan.filter((h) => h.r === 'good').length;
	return `Hôm nay đã đọc ${soBai} bài hai tay.${gan.length ? ` Trong ${gan.length} bài gần nhất: ${tot} bài trôi chảy.` : ''}`;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const veThiTauHaiTay = () =>
	`<div class="oz-thi-tau-hai-tay oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Cấp <select data-k="cap">${Object.entries(CAP)
		.map(([k, v]) => `<option value="${k}">${k} · ${v.ten}</option>`)
		.join('')}</select></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="moi">Bài mới</button><span class="oz-stats oz-tt2-thong-tin"></span></div>` +
	`<div class="oz-tt2-khuong"><figure class="oz-abc" style="--he:2;--he-hep:2"><div class="oz-tt2-cho" aria-hidden="true"></div></figure></div>` +
	`<p class="oz-stats">Nhìn bài khoảng 30 giây, chơi một lượt không dừng, rồi mới bấm nghe để so sánh. Bạn chơi thế nào?</p>` +
	`<div class="oz-row oz-tt2-muc" role="group" aria-label="Tự chấm">${MUC.map(([k, t]) => `<button type="button" class="oz-btn" data-r="${k}">${t}</button>`).join('')}</div>` +
	`<p class="oz-feedback" aria-live="polite"></p><p class="oz-stats oz-tt2-so"></p>` +
	`<noscript data-sinh><p>Thị tấu hai tay cần JavaScript để tạo bài: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const q = (s) => goc.querySelector(s);
	const chonCap = q('[data-k="cap"]');
	const khung = q('.oz-tt2-khuong');
	const phanHoi = q('.oz-feedback');
	const nutMuc = [...goc.querySelectorAll('[data-r]')];
	let cap = capDau(layKho('sight2Level', 0), layKho('pianoLevel', null));
	let bai = null;
	let daCham = false;
	chonCap.value = String(cap);
	const thongKe = () => (q('.oz-tt2-so').textContent = chuThongKe(soHomNay('readings'), layKho('sight2Hist', []) || []));
	const moi = async () => {
		bai = taoBai(cap);
		daCham = false;
		// bài cũ đang phát thì dừng trước khi thay
		try {
			khung.querySelector('.abc-notation')?._oz?.ctrl?.pause();
		} catch {
			// chưa phát
		}
		khung.innerHTML =
			`<figure class="oz-abc" style="--he:2;--he-hep:2"><div class="abc-notation" role="img" aria-label="${esc(`Khuông nhạc: bài thị tấu hai tay, ${bai.keyName}, nhịp ${bai.meter}`)}" data-abc="${esc(bai.abc)}"></div></figure>`;
		q('.oz-tt2-thong-tin').textContent = `${bai.keyName} · nhịp ${bai.meter} · ♩ = ${bai.q}`;
		for (const b of nutMuc) b.removeAttribute('aria-disabled');
		phanHoi.textContent = '';
		phanHoi.className = 'oz-feedback';
		try {
			// abc.js đọc document khi nạp: chỉ nạp trong trình duyệt, lúc cần
			await (await import('./abc.js')).mount(khung.querySelector('.abc-notation'));
		} catch {
			khung.querySelector('.abc-notation').textContent = 'Không tải được thư viện vẽ khuông nhạc. Kiểm tra kết nối mạng rồi tải lại trang.';
		}
	};
	chonCap.addEventListener('change', () => {
		cap = Number(chonCap.value) || 1;
		datKho('sight2Level', cap);
		moi();
	});
	q('[data-act="moi"]').addEventListener('click', moi);
	q('.oz-tt2-muc').addEventListener('click', (e) => {
		const b = e.target.closest('[data-r]');
		if (!b || daCham || !bai) return;
		daCham = true;
		const muc = b.dataset.r;
		for (const x of nutMuc) x.setAttribute('aria-disabled', 'true');
		kyNang('sight2', muc === 'good');
		ghiNgay('readings', 1);
		const lich = (layKho('sight2Hist', []) || []).concat([{ d: homNay(), l: cap, r: muc }]);
		datKho('sight2Hist', lich.slice(-50));
		phanHoi.textContent = loiSauCham(muc, cap, lich);
		phanHoi.className = `oz-feedback${muc === 'good' ? ' ok' : muc === 'bad' ? ' bad' : ''}`;
		thongKe();
	});
	thongKe();
	goc.dataset.san = '1';
	return moi();
}
