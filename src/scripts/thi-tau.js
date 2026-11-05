// Thị tấu một bè (::cong-cu{ten="sight"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/sight-reading.js: giai điệu 4 ô nhịp
// 4/4 ngẫu nhiên ở năm giọng (Đô, Sol, Fa, Rê, Si♭ trưởng), ba cấp (1: đen, trắng, bước gần; 2: thêm móc đơn, nhảy quãng; 3:
// thêm chấm dôi), ô cuối luôn là bậc 2 hay bậc 7 rồi về chủ âm. Nút: nghe chủ âm, đếm vào (4 tiếng gõ), nghe đáp án, giai
// điệu mới; "Chơi và được chấm" bằng đàn MIDI (src/scripts/midi.js; ô kết nối là ::cong-cu{ten="midi-status"} trên trang)
// hay micro (src/scripts/micro.js: nhận lượt trước khi mở, bấm lặp trong lúc chờ quyền thì bỏ qua, bị tắt trong lúc chờ thì
// hủy), chấm bằng src/scripts/cham-diem.js, hình piano roll và hàng kết quả của src/scripts/hinh-so-sanh.js. Khuông vẽ bằng
// abcjs (nạp src/scripts/abc.js khi cần), xuống dòng trên màn hình hẹp như chơi theo. Lưu như bản cũ: kỹ năng "sight" (đạt
// khi đúng từ 80%), days[ngày].melodies mỗi lần nghe đáp án hay được chấm.
// Khác bản cũ: hàng kết quả ghi cả tên nốt cần chơi (như chơi theo); có nút "Dừng" trong lúc được chấm.
import { choiNot, chuanBi, layNgCanh, tiengGo } from './am-thanh.js';
import { chamCaoDo, chamMidi, tomTatCham } from './cham-diem.js';
import { hangKetQua, pianoRoll } from './hinh-so-sanh.js';
import { coMicro, dongMicro, giuMicro, moMicro, ngheMicro } from './micro.js';
import { coMidi, ketNoi, nghe } from './midi.js';
import { CHU, dauCuaHoaBieu, midi } from './nhac-ly.js';
import { ghiNgay, kyNang } from './tien-do.js';

/** Giọng: bậc của chủ âm (quãng tám × 7 + chữ cái; Đô4 = 28), số dấu hóa (KEYS cũ). */
export const GIONG_TT = { C: { v: 28, n: 0, ten: 'Đô trưởng' }, G: { v: 32, n: 1, ten: 'Sol trưởng' }, F: { v: 31, n: -1, ten: 'Fa trưởng' }, D: { v: 29, n: 2, ten: 'Rê trưởng' }, Bb: { v: 34, n: -2, ten: 'Si♭ trưởng' } };
export const CAP = { 1: '1: đen, trắng, bước gần', 2: '2: thêm móc đơn, nhảy quãng', 3: '3: thêm chấm dôi' };
export const TOC_DO = [60, 80, 100];

/** Nốt {l, a, o} ở bậc v trong giọng có n dấu (noteOf cũ). */
export function notCua(v, n) {
	const l = ((v % 7) + 7) % 7;
	const dau = dauCuaHoaBieu(n).includes(CHU[l]) ? Math.sign(n) : 0;
	return { l, a: dau, o: Math.floor(v / 7) };
}

/** Giai điệu mới (gen cũ; `r`: hàm ngẫu nhiên): { giong, n, o (4 ô, mỗi ô [[bậc, số phách]…]) }. */
export function taoGiaiDieu(giong, cap, r = Math.random) {
	const k = GIONG_TT[giong];
	const lo = k.v - 2;
	const hi = Math.min(k.v + (cap >= 2 ? 9 : 5), 40); // không vượt quá La5
	const boDai = { 1: [[1], [1], [2]], 2: [[1], [1], [2], [0.5, 0.5]], 3: [[1], [2], [0.5, 0.5], [1.5, 0.5], [3]] };
	const o = [];
	let v = k.v + [0, 2, 4][Math.floor(r() * 3)];
	for (let b = 0; b < 4; b++) {
		const nhom = [];
		let con = 4;
		if (b === 3) {
			// ô cuối: đi về chủ âm từ bậc 2 hay bậc 7
			const truoc = r() < 0.5 ? k.v + 1 : k.v - 1;
			nhom.push([truoc >= lo ? truoc : k.v + 1, 2]);
			nhom.push([k.v, 2]);
			o.push(nhom);
			break;
		}
		while (con > 0) {
			const vua = boDai[cap].filter((d) => {
				const L = d.reduce((a, c) => a + c, 0);
				return L <= con && !(L === 1.5 + 0.5 && con !== 4 && con !== 2) && !(L === 3 && con !== 4);
			});
			const d = vua[Math.floor(r() * vua.length)];
			for (const dur of d) {
				nhom.push([v, dur]);
				const x = r();
				let buoc = x < 0.55 ? (r() < 0.5 ? 1 : -1) : x < 0.8 ? (r() < 0.5 ? 2 : -2) : x < 0.9 ? 0 : r() < 0.5 ? 4 : -3;
				if (cap === 1 && Math.abs(buoc) > 2) buoc = buoc > 0 ? 2 : -2;
				v = Math.max(lo, Math.min(hi, v + buoc));
				con -= dur;
			}
		}
		o.push(nhom);
	}
	return { giong, n: k.n, o };
}

/** Nốt viết theo ABC, không ghi dấu hóa (hóa biểu đã có). */
function abcKhongDau(n) {
	const L = CHU[n.l];
	return n.o >= 5 ? L.toLowerCase() + "'".repeat(n.o - 5) : L + ','.repeat(4 - n.o);
}
/** Giai điệu thành mã ABC (L:1/8; toAbc cũ): móc đơn trong cùng phách nối đuôi. */
export function sangAbc(gd) {
	return (
		gd.o
			.map((nhom) => {
				let t = 0;
				let ra = '';
				let eTruoc = null;
				let tTruoc = 0;
				for (const [v, dur] of nhom) {
					const e = Math.round(dur * 2);
					const tok = abcKhongDau(notCua(v, gd.n)) + (e === 1 ? '' : String(e));
					const noi = eTruoc === 1 && e === 1 && Math.floor(tTruoc) === Math.floor(t);
					ra += (ra && !noi ? ' ' : '') + tok;
					eTruoc = e;
					tTruoc = t;
					t += dur;
				}
				return ra;
			})
			.join(' | ') + ' |]'
	);
}
export const abcGiaiDieu = (gd) => `X:1\nM:4/4\nL:1/8\nK:${gd.giong}\n${sangAbc(gd)}`;

/** Các nốt cần chơi từ lúc `t0`, mỗi phách `phach` giây: [{ m, t0, dai }]. */
export function notCan(gd, t0, phach) {
	const ra = [];
	let t = t0;
	for (const nhom of gd.o)
		for (const [v, dur] of nhom) {
			ra.push({ m: midi(notCua(v, gd.n)), t0: t, dai: dur * phach });
			t += dur * phach;
		}
	return ra;
}

const tuyChon = (o, chon) => Object.entries(o).map(([k, v]) => `<option value="${k}"${k === chon ? ' selected' : ''}>${typeof v === 'string' ? v : v.ten}</option>`).join('');

export const veThiTau = () =>
	`<div class="oz-thi-tau oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Giọng <select data-k="giong">${tuyChon(GIONG_TT)}</select></label>` +
	`<label>Cấp độ <select data-k="cap">${tuyChon(CAP)}</select></label>` +
	`<label>Tốc độ <select data-k="bpm">${TOC_DO.map((b) => `<option${b === 80 ? ' selected' : ''}>${b}</option>`).join('')}</select></label></div>` +
	`<div class="oz-thi-tau-khuong" role="img" aria-label="Giai điệu thị tấu"></div>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="chu-am">Nghe chủ âm</button>` +
	`<button type="button" class="oz-btn" data-act="dem">Đếm vào</button>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="nghe">Nghe đáp án</button>` +
	`<button type="button" class="oz-btn" data-act="moi">Giai điệu mới</button></div>` +
	`<div class="oz-row"><span class="oz-stats">Chơi và được chấm:</span>` +
	`<button type="button" class="oz-btn" data-act="cham-midi">Bằng đàn MIDI</button>` +
	`<button type="button" class="oz-btn" data-act="cham-mic">Bằng micro (hát hoặc nhạc cụ)</button>` +
	`<button type="button" class="oz-btn" data-act="dung" hidden>Dừng</button>` +
	`<label><input type="checkbox" data-k="quang" checked> Bỏ qua quãng tám</label></div>` +
	`<p class="oz-feedback" aria-live="polite"></p><div class="oz-thi-tau-kq"></div>` +
	`<p class="oz-stats">Cách tập: nghe chủ âm, nhìn giai điệu 30 giây, đọc tên nốt, rồi bấm “Đếm vào” và hát (hoặc đàn) theo nhịp. Muốn được chấm điểm, bấm một trong hai nút ở dòng “Chơi và được chấm”. Cuối cùng bấm “Nghe đáp án” để so sánh.</p>` +
	`<noscript data-sinh><p>Thị tấu cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	const khuong = goc.querySelector('.oz-thi-tau-khuong');
	const phanHoi = goc.querySelector('.oz-feedback');
	const kq = goc.querySelector('.oz-thi-tau-kq');
	const nutDung = goc.querySelector('[data-act="dung"]');
	let gd = null;
	let dang = null;
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	const ve = async () => {
		const ma = abcGiaiDieu(gd);
		try {
			// abc.js đọc document khi nạp: chỉ nạp trong trình duyệt, lúc cần
			const ABCJS = await (await import('./abc.js')).taiAbcjs();
			if (ma !== abcGiaiDieu(gd)) return;
			const w = khuong.clientWidth;
			const o = { responsive: 'resize', foregroundColor: 'currentColor', paddingleft: 0, paddingright: 0 };
			if (w && w < 620) {
				o.staffwidth = Math.max(260, Math.round(w * 1.15));
				o.wrap = { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 2 };
			}
			ABCJS.renderAbc(khuong, ma, o);
			khuong.setAttribute('aria-label', `Giai điệu thị tấu bốn ô nhịp, ${GIONG_TT[gd.giong].ten}`);
		} catch {
			khuong.textContent = 'Không tải được thư viện vẽ khuông nhạc. Kiểm tra kết nối mạng rồi tải lại trang.';
		}
	};
	const moi = () => {
		huy();
		gd = taoGiaiDieu(chon('giong').value, Number(chon('cap').value));
		kq.innerHTML = '';
		bao('');
		ve();
	};
	const phach = () => 60 / Number(chon('bpm').value);
	/** Đếm vào 4 tiếng gõ; có nốt thì phát cả giai điệu (play cũ). */
	const phat = async (coNot) => {
		const c = layNgCanh();
		if (!c) return;
		const p = phach();
		if (coNot) await chuanBi(notCan(gd, 0, p).map((n) => n.m));
		const t0 = c.currentTime + 0.1;
		for (let i = 0; i < 4; i++) tiengGo(t0 + i * p, i === 0);
		if (!coNot) return;
		for (const n of notCan(gd, t0 + 4 * p, p)) choiNot(n.m, n.t0, n.dai * 0.95 + 0.1);
		ghiNgay('melodies', 1);
	};
	/** Thôi lượt chấm đang chờ quyền (micro, đàn MIDI), không chấm. */
	function huy() {
		if (!dang) return;
		const r = dang;
		dang = null;
		if (r.cho) {
			r.huy = true;
			r.nha?.();
			if (r.nguon === 'mic') dongMicro();
			return;
		}
		clearTimeout(r.hen);
		r.thoi();
		r.nha?.();
		nutDung.hidden = true;
		bao('');
	}
	const xong = () => {
		const r = dang;
		if (!r || r.cho) return huy();
		dang = null;
		clearTimeout(r.hen);
		r.thoi();
		r.nha?.();
		nutDung.hidden = true;
		const boQuang = chon('quang').checked;
		const nots = r.nguon === 'midi' ? chamMidi(r.can, r.phim, r.phach, { boQuang }).nots : chamCaoDo(r.can, r.khung, { boQuang });
		const tt = tomTatCham(nots);
		kq.innerHTML = hangKetQua(nots) + pianoRoll({ can: r.can.map((n, i) => ({ ...n, ket_qua: nots[i].ket_qua })), khung: r.khung, phim: r.phim, boQuangTam: boQuang });
		bao(`Đúng ${tt.dat}/${tt.tong} nốt (${tt.pt}%).${tt.pt === 100 ? ' Xuất sắc!' : ' Bấm “Nghe đáp án” để so sánh.'}`, tt.pt >= 80 ? 'ok' : 'bad');
		kyNang('sight', tt.pt >= 80);
		ghiNgay('melodies', 1);
	};
	const cham = async (nguon) => {
		const c = layNgCanh();
		if (!c || dang) return;
		if (nguon === 'midi' && !coMidi()) return bao('Trình duyệt này không hỗ trợ MIDI. Hãy dùng Chrome hoặc Edge, hoặc chấm bằng micro.', 'bad');
		if (nguon === 'mic' && !coMicro()) return bao('Trình duyệt này không mở được micro.', 'bad');
		// đang chờ micro hay đàn MIDI (người dùng đang được hỏi quyền): bấm thêm thì bỏ qua
		const cho = (dang = { cho: true, nguon, huy: false, nha: null });
		try {
			if (nguon === 'midi') await ketNoi();
			else {
				cho.nha = giuMicro(huy);
				await moMicro();
			}
		} catch {
			if (cho.huy) return;
			dang = null;
			cho.nha?.();
			return bao(nguon === 'midi' ? 'Chưa kết nối được đàn MIDI.' : 'Không mở được micro. Hãy cho phép trang dùng micro.', 'bad');
		}
		if (cho.huy) return;
		const p = phach();
		const t0 = c.currentTime + 0.15;
		for (let i = 0; i < 4; i++) tiengGo(t0 + i * p, i === 0);
		const can = notCan(gd, t0 + 4 * p, p);
		const het = can[can.length - 1].t0 + can[can.length - 1].dai;
		const r = (dang = { nguon, can, phach: p, khung: [], phim: [], nha: cho.nha, thoi: () => {} });
		r.thoi = nguon === 'midi' ? nghe((su) => su.loai === 'on' && r.phim.push({ t: su.luc, m: su.m })) : ngheMicro((k) => r.khung.push(k));
		kq.innerHTML = '';
		nutDung.hidden = false;
		bao('1 – 2 – 3 – 4… bắt đầu!');
		r.hen = setTimeout(xong, (het - c.currentTime + 0.5) * 1000);
	};
	goc.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		const a = b.dataset.act;
		if (a === 'cham-midi') cham('midi');
		if (a === 'cham-mic') cham('mic');
		if (a === 'dung') huy();
		if (a === 'moi') moi();
		if (a === 'nghe') phat(true);
		if (a === 'dem') phat(false);
		if (a === 'chu-am' && layNgCanh()) choiNot(midi(notCua(GIONG_TT[gd.giong].v, gd.n)), undefined, 1.5);
	});
	chon('giong').addEventListener('change', moi);
	chon('cap').addEventListener('change', moi);
	moi();
	goc.dataset.san = '1';
}
