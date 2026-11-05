// Tiết tấu (::cong-cu{ten="rhythm"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/rhythm.js: một tiết tấu 2 ô nhịp 4/4 ngẫu
// nhiên theo bốn cấp (1: tròn, trắng, đen; 2: thêm móc đơn, dấu lặng; 3: chấm dôi, đảo phách; 4: liên ba, móc kép), vẽ trên
// khuông một dòng (abcjs, nạp src/scripts/abc.js khi cần). "Bắt đầu gõ": 4 tiếng đếm vào rồi người học gõ theo từng nốt bằng
// nút "Gõ" hay phím cách; site ghép mỗi lần gõ với nốt gần nhất (dung sai min(150 ms, 30% phách)), báo số nốt trúng, gõ thừa,
// xu hướng sớm hay muộn (trung bình, ms) và vẽ dải nhịp (daiNhipGo, src/scripts/hinh-so-sanh.js). "Nghe mẫu": tiếng đếm và
// tiếng nốt. Thời điểm theo đồng hồ của AudioContext (tiếng đếm hẹn trước, như máy đếm nhịp). Lưu như bản cũ: kỹ năng
// "rhythm", days[ngày].rhythms khi gõ đúng hết.
// Khác bản cũ: bấm "Bắt đầu gõ" hay "Nghe mẫu" trong lúc đang gõ thì bỏ qua (bản cũ cho nghe mẫu chồng lên lượt gõ thì không,
// nhưng vẫn cho đổi tiết tấu giữa chừng: nay "Tiết tấu mới" dừng lượt đang gõ).
import { choiNot, layNgCanh, tiengGo } from './am-thanh.js';
import { daiNhipGo, ghepNhip } from './hinh-so-sanh.js';
import { ghiNgay, kyNang } from './tien-do.js';

/** Đơn vị: 1/12 phách (nốt đen = 12). Mỗi nhóm là danh sách [độ dài, là nốt, liên ba] (CELLS cũ). */
export const NHOM = {
	1: [[[12, 1]], [[12, 1]], [[24, 1]], [[48, 1]]],
	2: [[[12, 1]], [[12, 1]], [[24, 1]], [[6, 1], [6, 1]], [[6, 1], [6, 1]], [[12, 0]]],
	3: [[[12, 1]], [[24, 1]], [[6, 1], [6, 1]], [[12, 0]], [[18, 1], [6, 1]], [[6, 1], [12, 1], [6, 1]], [[6, 0], [6, 1]]],
	4: [
		[[12, 1]],
		[[6, 1], [6, 1]],
		[[4, 1, 1], [4, 1, 1], [4, 1, 1]],
		[[4, 1, 1], [4, 1, 1], [4, 1, 1]],
		[[3, 1], [3, 1], [3, 1], [3, 1]],
		[[9, 1], [3, 1]],
		[[6, 1], [3, 1], [3, 1]],
		[[3, 1], [3, 1], [6, 1]],
		[[6, 0], [6, 1]],
		[[6, 1], [12, 1], [6, 1]],
	],
};
export const CAP = { 1: '1: tròn, trắng, đen', 2: '2: thêm móc đơn, dấu lặng', 3: '3: chấm dôi, đảo phách', 4: '4: liên ba, móc kép' };
export const TOC_DO = [60, 72, 90, 108];
const dai = (c) => c.reduce((s, x) => s + x[0], 0);

/** Tiết tấu mới (gen cũ; `r`: hàm ngẫu nhiên): `soO` ô nhịp, mỗi ô 48 đơn vị; ô đầu luôn có nốt. */
export function taoTietTau(cap, soO = 2, r = Math.random) {
	const ra = [];
	for (let b = 0; b < soO; b++) {
		let con = 48;
		const o = [];
		while (con > 0) {
			const vt = 48 - con;
			const hop = NHOM[cap].filter((c) => {
				const L = dai(c);
				if (L > con) return false;
				if (L >= 24) return vt % L === 0; // nhóm dài bắt đầu ở phách mạnh
				return vt % 12 === 0 || L === 12 - (vt % 12);
			});
			const c = hop[Math.floor(r() * hop.length)];
			c.forEach((x) => o.push(x));
			con -= dai(c);
		}
		ra.push(o);
	}
	if (!ra[0].some((x) => x[1])) ra[0][0] = [ra[0][0][0], 1];
	return ra;
}

const DUR = { 3: '', 6: '2', 9: '3', 12: '4', 18: '6', 24: '8', 48: '16' };
/** Tiết tấu thành mã ABC (L:1/16; toAbc cũ): nốt viết B, dấu lặng z, móc đơn trong cùng phách nối đuôi. */
export function sangAbc(cacO) {
	return (
		cacO
			.map((o) => {
				let t = 0;
				let ra = '';
				let truoc = null;
				let i = 0;
				while (i < o.length) {
					const x = o[i];
					if (x[2]) {
						// nhóm liên ba: 3 nốt, mỗi nốt 4 đơn vị, viết như 3 móc đơn
						const g = o
							.slice(i, i + 3)
							.map((y) => `${y[1] ? 'B' : 'z'}2`)
							.join('');
						ra += `${ra ? ' ' : ''}(3${g}`;
						t += 12;
						i += 3;
						truoc = null;
						continue;
					}
					const tok = (x[1] ? 'B' : 'z') + DUR[x[0]];
					const noi = truoc && truoc.not && x[1] && truoc.d <= 6 && x[0] <= 6 && Math.floor(truoc.t / 12) === Math.floor(t / 12);
					ra += (ra && !noi ? ' ' : '') + tok;
					truoc = { d: x[0], t, not: x[1] };
					t += x[0];
					i++;
				}
				return ra;
			})
			.join(' | ') + ' |]'
	);
}

export const abcTietTau = (cacO) => `X:1\nM:4/4\nL:1/16\nK:C clef=perc stafflines=1\n${sangAbc(cacO)}`;

/** Lúc bắt đầu của từng nốt (không tính dấu lặng), theo phách (onsets cũ). */
export function lucGo(cacO) {
	const ra = [];
	let t = 0;
	for (const o of cacO)
		for (const x of o) {
			if (x[1]) ra.push(t / 12);
			t += x[0];
		}
	return ra;
}

/**
 * Chấm một lượt gõ (finish cũ, hàm thuần): `can`, `go` (giây), `phach` (giây mỗi phách). Trả về { trung, tong, thua, tb (ms,
 * trung bình lệch của các lần trúng), dat (trúng hết, không thừa), chu, dungSai }.
 */
export function chamGo(can, go, phach) {
	const dungSai = Math.min(0.15, phach * 0.3);
	const { trung, thua } = ghepNhip(can, go, dungSai);
	const lech = trung.map(([e, t]) => t - e);
	const tb = lech.length ? Math.round((1000 * lech.reduce((a, b) => a + b, 0)) / lech.length) : 0;
	const xuHuong = Math.abs(tb) < 25 ? 'rất đều' : tb < 0 ? `hơi sớm, trung bình ${-tb} ms` : `hơi muộn, trung bình ${tb} ms`;
	const dat = trung.length === can.length && thua.length === 0;
	const chu =
		`${dat ? 'Chính xác! ' : ''}Gõ trúng ${trung.length}/${can.length} nốt${thua.length ? `, gõ thừa ${thua.length} lần` : ''}${lech.length ? `, ${xuHuong}` : ''}.` +
		(dat ? ' Bấm “Tiết tấu mới” để tiếp tục.' : ' Bấm “Nghe mẫu” rồi thử lại.');
	return { trung: trung.length, tong: can.length, thua: thua.length, tb, dat, chu, dungSai };
}

const DAU = 'Đọc tiết tấu, bấm “Bắt đầu gõ”, nghe 4 tiếng đếm vào rồi gõ theo.';

export const veTietTau = () =>
	`<div class="oz-tiet-tau oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Cấp độ <select data-k="cap">${Object.entries(CAP)
		.map(([k, v]) => `<option value="${k}">${v}</option>`)
		.join('')}</select></label>` +
	`<label>Tốc độ <select data-k="bpm">${TOC_DO.map((b) => `<option${b === 72 ? ' selected' : ''}>${b}</option>`).join('')}</select></label>` +
	`<label><input type="checkbox" data-k="dem" checked> Giữ tiếng đếm khi gõ</label></div>` +
	`<div class="oz-tiet-tau-khuong" role="img" aria-label="Tiết tấu hai ô nhịp"></div>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="bat-dau">Bắt đầu gõ</button>` +
	`<button type="button" class="oz-btn" data-act="mau">Nghe mẫu</button>` +
	`<button type="button" class="oz-btn" data-act="moi">Tiết tấu mới</button></div>` +
	`<button type="button" class="oz-go" data-act="go" aria-label="Gõ (hoặc nhấn phím cách)">Gõ<small>hoặc nhấn phím cách</small></button>` +
	`<p class="oz-feedback" aria-live="polite">${DAU}</p><div class="oz-tiet-tau-hinh"></div>` +
	`<noscript data-sinh><p>Công cụ tiết tấu cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	const khuong = goc.querySelector('.oz-tiet-tau-khuong');
	const phanHoi = goc.querySelector('.oz-feedback');
	const hinh = goc.querySelector('.oz-tiet-tau-hinh');
	const nutGo = goc.querySelector('.oz-go');
	let cacO = null;
	let luot = null;
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	const ve = async () => {
		const ma = abcTietTau(cacO);
		try {
			// abc.js đọc document khi nạp: chỉ nạp trong trình duyệt, lúc cần
			const ABCJS = await (await import('./abc.js')).taiAbcjs();
			if (ma !== abcTietTau(cacO)) return;
			const w = khuong.clientWidth;
			const o = { responsive: 'resize', foregroundColor: 'currentColor', paddingleft: 0, paddingright: 0, scale: 1.2 };
			// khung hẹp: mỗi ô nhịp một dòng, cho nốt đủ to
			if (w && w < 620) {
				o.staffwidth = Math.max(260, Math.round(w * 1.15));
				o.wrap = { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 1 };
			}
			ABCJS.renderAbc(khuong, ma, o);
		} catch {
			khuong.textContent = 'Không tải được thư viện vẽ khuông nhạc. Kiểm tra kết nối mạng rồi tải lại trang.';
		}
	};
	const ketThuc = () => {
		if (!luot) return;
		const l = luot;
		luot = null;
		clearTimeout(l.hen);
		nutGo.classList.remove('dang');
		const can = lucGo(cacO).map((o) => l.dau + o * l.phach);
		const kq = chamGo(can, l.go, l.phach);
		bao(kq.chu, kq.dat ? 'ok' : 'bad');
		if (kq.dat) ghiNgay('rhythms', 1);
		kyNang('rhythm', kq.dat);
		hinh.innerHTML = daiNhipGo({ can, go: l.go, phach: l.phach, dau: l.dau, soPhach: 8, dungSai: kq.dungSai });
	};
	const moi = () => {
		if (luot) {
			clearTimeout(luot.hen);
			luot = null;
			nutGo.classList.remove('dang');
		}
		hinh.innerHTML = '';
		cacO = taoTietTau(Number(chon('cap').value), 2);
		ve();
		bao(DAU);
	};
	/** Hẹn tiếng đếm vào (4 phách), tiếng đếm trong lúc gõ, tiếng nốt mẫu; trả về { dau, phach, het } (giây) hay null. */
	const hen = (coNot, coDem) => {
		const c = layNgCanh();
		if (!c) return null;
		const phach = 60 / Number(chon('bpm').value);
		const t0 = c.currentTime + 0.15;
		for (let i = 0; i < 4; i++) tiengGo(t0 + i * phach, i === 0);
		const dau = t0 + 4 * phach;
		if (coDem) for (let i = 0; i < 8; i++) tiengGo(dau + i * phach, i % 4 === 0);
		if (coNot) for (const o of lucGo(cacO)) choiNot(72, dau + o * phach, 0.25, 0.25);
		return { dau, phach, het: dau + 8 * phach };
	};
	const batDau = () => {
		if (luot) return;
		const s = hen(false, chon('dem').checked);
		if (!s) return;
		luot = { ...s, go: [] };
		nutGo.classList.add('dang');
		nutGo.focus();
		hinh.innerHTML = '';
		bao('1 – 2 – 3 – 4 … gõ!');
		luot.hen = setTimeout(ketThuc, (s.het - layNgCanh().currentTime + 0.4) * 1000);
	};
	const go = () => {
		if (!luot) return;
		const t = layNgCanh().currentTime;
		if (t >= luot.dau - luot.phach * 0.5) luot.go.push(t);
		nutGo.classList.add('trung');
		setTimeout(() => nutGo.classList.remove('trung'), 90);
	};
	goc.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		const a = b.dataset.act;
		if (a === 'moi') moi();
		if (a === 'bat-dau') batDau();
		if (a === 'mau' && !luot) hen(true, true);
	});
	// gõ khi vừa nhấn (pointerdown), không chờ nhả tay: click đến muộn hơn
	nutGo.addEventListener('pointerdown', (e) => {
		e.preventDefault();
		go();
	});
	goc.addEventListener('keydown', (e) => {
		if (e.code !== 'Space' || e.target.matches('select, input, textarea')) return;
		// phím cách trên nút khác (Bắt đầu, Nghe mẫu…) vẫn bấm nút ấy khi chưa gõ
		if (!luot && e.target.matches('button:not(.oz-go)')) return;
		e.preventDefault();
		if (!e.repeat) go();
	});
	chon('cap').addEventListener('change', moi);
	moi();
	goc.dataset.san = '1';
}
