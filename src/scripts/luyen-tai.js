// Bốn công cụ luyện tai (D3-L6): nghe quãng (::cong-cu{ten="interval-trainer"}), nghe hợp âm (chord-trainer), nghe gam
// (scale-trainer) và nghe kết (cadence-trainer), chuyển từ ../opus-zero/docs/assets/js/interval-trainer.js,
// chord-trainer.js, scale-trainer.js và phần .oz-cadence-trainer của recognition.js; thêm nhận biết kết cấu
// (texture-trainer, D5-L3, phần .oz-texture-trainer của recognition.js). Cùng một cách chơi: chọn bộ câu hỏi,
// bấm "Câu mới" để nghe, chọn đáp án; sai thì nghe lại (kết cấu: không tự phát lại, như bản cũ) và chọn tiếp, đúng thì
// hiện các nốt trên hình phím đàn (kết cấu: không có hình).
// Các hàm dựng HTML ở đầu file chạy cả lúc build (src/plugins/thanh-phan.mjs dựng sẵn ô, lựa chọn bộ, nút trả lời của bộ
// đầu tiên: chữ thật, ô không đổi chiều cao khi script chạy) lẫn trên trình duyệt (đổi bộ thì dựng lại nút). mount(el)
// thêm phần bấm được. Tiếng qua src/scripts/am-thanh.js (mẫu piano; chỉ phát khi người học bấm). Lưu như site cũ
// (src/scripts/tien-do.js, khóa opus-zero:v1): kỹ năng intervals, chords, scales, cadence, texture (store.skills và
// skillHist, chỉ tính lần trả lời đầu của mỗi câu) và số câu đúng trong ngày (days[ngày].intervals, chords, scales; kết
// tính vào chords, kết cấu vào styles).
// Khác bản cũ: đáp án đã chọn sai không bị khóa hẳn (aria-disabled, để tiêu điểm bàn phím không rơi mất); đổi bộ ở công cụ
// gam cũng xóa dòng phản hồi như ba công cụ kia; tên gam trong lời báo đúng chỉ viết thường chữ đầu ("điệu Dorian").
import { GAM, HOP_AM } from './nhac-ly.js';
import { khoangPhim, veBanPhim } from './ve.js';
import { chuanBi, choiNot, layNgCanh } from './am-thanh.js';
import { ghiNgay, kyNang, soHomNay } from './tien-do.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ngauNhien = (n, r = Math.random) => Math.floor(r() * n);
const chon1 = (ds, r) => ds[ngauNhien(ds.length, r)];
const thuongDau = (s) => s[0].toLowerCase() + s.slice(1);

// ---------- Nghe quãng ----------

/** Tên quãng theo số nửa cung (NAMES của interval-trainer.js). */
export const QUANG = {
	1: '2 thứ',
	2: '2 trưởng',
	3: '3 thứ',
	4: '3 trưởng',
	5: '4 đúng',
	6: '4 tăng / 5 giảm',
	7: '5 đúng',
	8: '6 thứ',
	9: '6 trưởng',
	10: '7 thứ',
	11: '7 trưởng',
	12: '8 đúng',
};

// ---------- Nghe hợp âm, nghe gam: gợi ý dưới tên (HINT) ----------

const GOI_Y_HOP_AM = {
	maj: 'sáng, vững',
	min: 'tối, buồn',
	dim: 'căng, bất ổn',
	aug: 'lơ lửng, kỳ lạ',
	maj7: 'mềm, mơ màng',
	dom7: 'căng, muốn đi tiếp',
	min7: 'êm, hơi buồn',
	hdim7: 'u tối, lưng chừng',
	dim7: 'rất căng, kịch tính',
};
const GOI_Y_GAM = {
	major: 'sáng',
	natural: 'tối',
	harmonic: 'bước nhảy lạ gần cuối',
	melodic: 'lên như trưởng ở cuối',
	dorian: 'thứ nhưng sáng ở bậc 6',
	mixolydian: 'trưởng nhưng hạ bậc 7',
	lydian: 'trưởng có bậc 4 nâng',
	phrygian: 'thứ, bước đầu chỉ nửa cung',
	pentaMajor: '5 nốt, sáng',
	pentaMinor: '5 nốt, tối',
};

// ---------- Nghe kết (âm thanh tổng hợp của recognition.js: bốn hợp âm, giọng dịch ngẫu nhiên) ----------

/** Bốn loại kết: tên và chuỗi bốn hợp âm (CAD). */
export const KET = {
	pac: { ten: 'Kết trọn (V – I)', chuoi: ['I', 'IV', 'V', 'I'] },
	hc: { ten: 'Kết nửa (… – V)', chuoi: ['I', 'vi', 'IV', 'V'] },
	plagal: { ten: 'Kết plagal (IV – I)', chuoi: ['I', 'V', 'IV', 'I'] },
	deceptive: { ten: 'Kết lừa (V – vi)', chuoi: ['I', 'IV', 'V', 'vi'] },
};
/** Cách xếp bè của từng hợp âm ở Đô trưởng (VOICING): bè trầm và ba bè trên, số MIDI. */
export const XEP_BE = { I: [48, 64, 67, 72], IV: [41, 65, 69, 72], V: [43, 62, 67, 71], vi: [45, 64, 69, 72] };

// ---------- Nhận biết kết cấu (recognition.js: Frère Jacques theo bốn kết cấu, giọng và tốc độ ngẫu nhiên) ----------

/** Giai điệu Frère Jacques (FJ): [số MIDI, số phách]. */
export const FJ = [
	[60, 1], [62, 1], [64, 1], [60, 1], [60, 1], [62, 1], [64, 1], [60, 1], [64, 1], [65, 1], [67, 2], [64, 1], [65, 1], [67, 2],
	[67, 0.5], [69, 0.5], [67, 0.5], [65, 0.5], [64, 1], [60, 1], [67, 0.5], [69, 0.5], [67, 0.5], [65, 0.5], [64, 1], [60, 1], [60, 1], [55, 1], [60, 2], [60, 1], [55, 1], [60, 2],
];
/** Bốn kết cấu (TEX). */
export const KET_CAU = { mono: 'Đơn âm', homo: 'Chủ điệu', poly: 'Phức điệu', hetero: 'Dị âm' };
/** Hợp âm đệm của kết cấu chủ điệu, mỗi hợp âm hai phách: I và V ở Đô trưởng. */
const DEM_FJ = [[48, 52, 55], [48, 52, 55], [48, 52, 55], [48, 52, 55], [48, 52, 55], [43, 47, 50], [48, 52, 55], [43, 47, 50]];

/** Một bè của giai điệu (line cũ): từ lúc `t0`, mỗi phách `nhip` giây, dịch `dich` nửa cung, tới `toi` phách. */
function beFJ(t0, nhip, dich, am, toi) {
	const ra = [];
	let t = t0;
	let n = 0;
	for (const [m, d] of FJ) {
		if (toi && n >= toi) break;
		ra.push([m + dich, t, d * nhip * 0.95, am]);
		t += d * nhip;
		n += d;
	}
	return ra;
}

/** Các nốt của câu kết cấu (play cũ): [số MIDI, lúc bắt đầu, độ dài, âm lượng]. */
export function notKetCau(q) {
	const [t0, nhip, s] = [0.05, q.nhip, q.dich];
	if (q.dap === 'mono') return beFJ(t0, nhip, s, 0.22, 16);
	if (q.dap === 'homo') return [...beFJ(t0, nhip, s, 0.22, 16), ...DEM_FJ.flatMap((ch, i) => ch.map((m) => [m + s, t0 + i * 2 * nhip, 2 * nhip * 0.95, 0.09]))];
	if (q.dap === 'poly') return [...beFJ(t0, nhip, s, 0.2, 24), ...beFJ(t0 + 8 * nhip, nhip, s - 12, 0.2, 16)];
	// dị âm: giai điệu, cùng lúc một bản cao hơn quãng tám có thêm nốt luyến láy ở mỗi nốt từ một phách
	const ra = beFJ(t0, nhip, s, 0.2, 16);
	let t = t0;
	let n = 0;
	for (const [x, phach] of FJ) {
		if (n >= 16) break;
		const m = x + s + 12;
		const d = phach * nhip;
		if (phach >= 1) ra.push([m, t, d * 0.45, 0.12], [m + 2, t + d * 0.5, d * 0.22, 0.12], [m, t + d * 0.75, d * 0.22, 0.12]);
		else ra.push([m, t, d * 0.9, 0.12]);
		t += d;
		n += phach;
	}
	return ra;
}

/**
 * Năm công cụ: các ô chọn (ô đầu là bộ câu hỏi; giá trị đầu là mặc định), câu chữ, kỹ năng và trường trong ngày được lưu,
 * cách ra câu hỏi (`cau`: q.dap là đáp án), các nốt phát (`phat`: [số MIDI, lúc bắt đầu (giây), độ dài, âm lượng]), lời báo
 * đúng và các phím tô trên hình phím đàn (`hinh`).
 */
export const CONG_CU_TAI = {
	'interval-trainer': {
		lop: 'oz-lt--quang',
		chon: [
			{
				k: 'set',
				nhan: 'Bộ quãng',
				ds: [
					['start', 'Khởi động: 3 trưởng, 5 đúng, 8 đúng', [4, 7, 12]],
					['basic', 'Cơ bản: thêm 3 thứ, 4 đúng', [3, 4, 5, 7, 12]],
					['more', 'Mở rộng: thêm 2 trưởng, 6 trưởng', [2, 3, 4, 5, 7, 9, 12]],
					['all', 'Tất cả 12 quãng', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
				],
			},
			{
				k: 'mode',
				nhan: 'Cách phát',
				ds: [
					['up', 'Lần lượt, đi lên'],
					['down', 'Lần lượt, đi xuống'],
					['harm', 'Cùng lúc'],
				],
			},
		],
		nhom: 'Chọn quãng',
		dau: 'Bấm “Câu mới” để nghe hai nốt.',
		hoi: 'Quãng gì đây?',
		sai: 'Chưa đúng. Nghe lại và thử lựa chọn khác.',
		kyNang: 'intervals',
		ngay: 'intervals',
		nut: (n) => ({ chu: QUANG[n] }),
		// gốc từ Sol3 (55) đến Sol4 (67)
		cau: (bo, r) => ({ dap: chon1(bo, r), goc: 55 + ngauNhien(13, r) }),
		phat: (q, { mode }) => {
			const [duoi, tren] = [q.goc, q.goc + Number(q.dap)];
			if (mode === 'harm') return [[duoi, 0, 1.6, 0.18], [tren, 0, 1.6, 0.18]];
			const [a, b] = mode === 'down' ? [tren, duoi] : [duoi, tren];
			return [[a, 0, 0.9], [b, 0.8, 1.2]];
		},
		dung: (q) => `Đúng, quãng ${QUANG[q.dap]} (${q.dap} nửa cung). Bấm “Câu mới” để tiếp tục.`,
		hinh: (q) => ({ to: [q.goc, q.goc + Number(q.dap)], nhan: 'Hai nốt vừa nghe trên phím đàn' }),
		hom_nay: 'quãng',
	},
	'chord-trainer': {
		lop: 'oz-lt--hop-am',
		chon: [
			{
				k: 'set',
				nhan: 'Bộ hợp âm',
				ds: [
					['two', 'Trưởng và thứ', ['maj', 'min']],
					['triads', '4 loại hợp âm ba', ['maj', 'min', 'dim', 'aug']],
					['sevenths', '5 loại hợp âm bảy', ['maj7', 'dom7', 'min7', 'hdim7', 'dim7']],
				],
			},
			{
				k: 'mode',
				nhan: 'Cách phát',
				ds: [
					['block', 'Cùng lúc'],
					['arp', 'Rải từng nốt'],
					['both', 'Rải rồi cùng lúc'],
				],
			},
		],
		nhom: 'Chọn loại hợp âm',
		dau: 'Bấm “Câu mới” để nghe một hợp âm.',
		hoi: 'Hợp âm gì đây?',
		sai: 'Chưa đúng. Nghe lại và chú ý màu sắc của hợp âm.',
		kyNang: 'chords',
		ngay: 'chords',
		nut: (t) => ({ chu: HOP_AM[t].ten.replace('Hợp âm ', ''), goi_y: GOI_Y_HOP_AM[t] }),
		// nốt gốc từ Mi3 (52) đến Re♯4 (63)
		cau: (bo, r) => ({ dap: chon1(bo, r), goc: 52 + ngauNhien(12, r) }),
		phat: (q, { mode }) => {
			const nots = notHopAm(q);
			const ra = [];
			let t = 0;
			if (mode !== 'block') {
				nots.forEach((m, i) => ra.push([m, i * 0.35, 0.7]));
				t = nots.length * 0.35 + 0.15;
			}
			if (mode !== 'arp') nots.forEach((m) => ra.push([m, t, 1.8, 0.13]));
			return ra;
		},
		dung: (q) => `Đúng: ${HOP_AM[q.dap].ten.toLowerCase()} (${HOP_AM[q.dap].not.length} nốt). Bấm “Câu mới” để tiếp tục.`,
		hinh: (q) => ({ to: notHopAm(q), nhan: 'Các nốt của hợp âm vừa nghe' }),
	},
	'scale-trainer': {
		lop: 'oz-lt--gam',
		chon: [
			{
				k: 'set',
				nhan: 'Bộ gam',
				ds: [
					['mm', 'Trưởng và thứ tự nhiên', ['major', 'natural']],
					['minors', 'Ba dạng gam thứ', ['natural', 'harmonic', 'melodic']],
					['modes', 'Điệu thức thường gặp', ['major', 'natural', 'dorian', 'mixolydian', 'lydian', 'phrygian']],
					['penta', 'Ngũ cung và gam 7 nốt', ['pentaMajor', 'pentaMinor', 'major', 'natural']],
				],
			},
			{
				k: 'dir',
				nhan: 'Hướng',
				ds: [
					['up', 'Đi lên'],
					['updown', 'Lên rồi xuống'],
				],
			},
		],
		nhom: 'Chọn gam',
		dau: 'Bấm “Câu mới” để nghe một gam.',
		hoi: 'Gam gì đây?',
		sai: 'Chưa đúng. Nghe lại, chú ý bậc 3, 6 và 7.',
		kyNang: 'scales',
		ngay: 'scales',
		nut: (t) => ({ chu: GAM[t].ten, goi_y: GOI_Y_GAM[t] }),
		// chủ âm từ Sol3 (55) đến Re4 (62)
		cau: (bo, r) => ({ dap: chon1(bo, r), goc: 55 + ngauNhien(8, r) }),
		phat: (q, { dir }) => notGam(q, dir).map((m, i) => [m, i * 0.3, 0.5]),
		dung: (q) => `Đúng: ${thuongDau(GAM[q.dap].ten)}.`,
		// gam lên rồi xuống: chỉ tô nửa đi lên
		hinh: (q, { dir }) => {
			const ds = notGam(q, dir);
			return { to: ds.slice(0, ds.length > 9 ? Math.ceil(ds.length / 2) : ds.length), nhan: 'Các nốt của gam vừa nghe (đi lên)' };
		},
	},
	'cadence-trainer': {
		lop: 'oz-lt--ket',
		chon: [],
		bo: Object.keys(KET),
		nhom: 'Chọn loại kết',
		dau: 'Nghe 4 hợp âm và đoán loại kết ở hai hợp âm cuối.',
		hoi: 'Kết gì đây?',
		sai: 'Chưa đúng. Chú ý hợp âm cuối: nghe như dừng hẳn, lơ lửng, hay rẽ hướng?',
		kyNang: 'cadence',
		ngay: 'chords',
		nut: (k) => ({ chu: KET[k].ten }),
		// giọng dịch từ -5 đến +6 nửa cung so với Đô trưởng
		cau: (bo, r) => ({ dap: chon1(bo, r), dich: ngauNhien(12, r) - 5 }),
		phat: (q) => KET[q.dap].chuoi.flatMap((bac, i) => XEP_BE[bac].map((m) => [m + q.dich, 0.05 + i, i === 3 ? 1.8 : 1, 0.12])),
		dung: (q) => `Đúng: ${KET[q.dap].chuoi.join(' → ')}. Bấm “Câu mới” để tiếp tục.`,
		hinh: (q) => {
			const [ap, cuoi] = KET[q.dap].chuoi.slice(-2);
			return {
				chu: `Hai hợp âm cuối: ${ap} → ${cuoi} (xanh: hợp âm áp chót, vàng: hợp âm cuối)`,
				to2: XEP_BE[ap].map((m) => m + q.dich),
				to: XEP_BE[cuoi].map((m) => m + q.dich),
				nhan: 'Hai hợp âm cuối của kết trên phím đàn',
			};
		},
	},
	'texture-trainer': {
		lop: 'oz-lt--ket-cau',
		chon: [],
		bo: Object.keys(KET_CAU),
		nhom: 'Chọn kết cấu',
		dau: 'Cùng một giai điệu được phát theo một trong bốn kết cấu. Hãy đoán kết cấu (xem bài 28).',
		hoi: 'Kết cấu gì đây?',
		sai: 'Chưa đúng. Đếm xem có mấy đường nét độc lập.',
		kyNang: 'texture',
		ngay: 'styles',
		// chọn sai: không tự phát lại (bản cũ); người học bấm "Nghe lại"
		phatLaiKhiSai: false,
		nut: (k) => ({ chu: KET_CAU[k] }),
		// giọng dịch từ -3 đến +3 nửa cung, mỗi phách 0,38 đến 0,5 giây
		cau: (bo, r = Math.random) => ({ dap: chon1(bo, r), dich: ngauNhien(7, r) - 3, nhip: 0.38 + r() * 0.12 }),
		phat: (q) => notKetCau(q),
		dung: (q) => `Đúng: ${KET_CAU[q.dap]}. Bấm “Câu mới” để tiếp tục.`,
	},
};

/** Các nốt (số MIDI) của hợp âm trong câu hỏi: nốt gốc cộng số nửa cung của từng nốt (HOP_AM của nhac-ly.js). */
export const notHopAm = (q) => HOP_AM[q.dap].not.map(([, s]) => q.goc + s);

/** Các nốt của gam trong câu hỏi: đi lên tới quãng tám; "updown" thì đi xuống lại (gam thứ giai điệu đi xuống như thứ tự nhiên). */
export function notGam(q, dir = 'up') {
	const len = GAM[q.dap].buoc.concat([12]).map((s) => q.goc + s);
	if (dir !== 'updown') return len;
	const xuong = (q.dap === 'melodic' ? GAM.natural : GAM[q.dap]).buoc.slice().reverse().map((s) => q.goc + s);
	return len.concat(xuong);
}

/** Các đáp án của bộ đang chọn (giá trị của ô chọn đầu tiên; công cụ không có ô chọn thì cả bộ). */
export const boCua = (cc, bo) => cc.bo ?? (cc.chon[0].ds.find(([v]) => v === bo) ?? cc.chon[0].ds[0])[2];

/** Nút trả lời của bộ: tên, gợi ý nhỏ dưới tên (hợp âm, gam). */
export const nutTraLoi = (cc, bo) =>
	boCua(cc, bo)
		.map((d) => {
			const { chu, goi_y } = cc.nut(d);
			return `<button type="button" class="oz-btn" data-d="${d}">${esc(chu)}${goi_y ? `<small> ${esc(goi_y)}</small>` : ''}</button>`;
		})
		.join('');

/** Dòng thống kê (stats): lượt này, và với nghe quãng, số quãng đã nhận đúng hôm nay. */
export const chuThongKe = (cc, phien, homNay) =>
	`Lượt này: đúng ngay lần đầu ${phien.dung}/${phien.tong}.` + (cc.hom_nay ? ` Hôm nay đã nhận đúng ${homNay} ${cc.hom_nay}.` : '');

/** Hình phím đàn của câu vừa đúng (miniKeys cũ): hai phím trắng thêm mỗi bên, mở ra tới phím trắng. */
export function hinhPhim({ to = [], to2 = [], nhan }) {
	const ca = [...to, ...to2];
	const [thap, cao] = khoangPhim(Math.min(...ca) - 2, Math.max(...ca) + 2);
	return veBanPhim({ thap, cao, to, to2, nhan }).svg;
}

/**
 * Ô công cụ dựng sẵn (lúc build): ô chọn bộ và cách phát, nút "Câu mới", "Nghe lại", các nút trả lời của bộ đầu tiên,
 * dòng phản hồi (aria-live), chỗ hiện hình phím đàn, dòng thống kê. data-sinh: chữ do thành phần dựng (trang cũ dựng bằng
 * JavaScript nên bản build cũ không có chữ này).
 */
export function veLuyenTai(ten) {
	const cc = CONG_CU_TAI[ten];
	const chon = cc.chon
		.map(({ k, nhan, ds }) => `<label>${nhan} <select data-k="${k}">${ds.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</select></label>`)
		.join('');
	return (
		`<div class="oz-lt ${cc.lop} oz-tool not-content" data-cong-cu="${ten}" data-sinh data-pagefind-ignore>` +
		(chon ? `<div class="oz-row">${chon}</div>` : '') +
		`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="new">Câu mới</button>` +
		`<button type="button" class="oz-btn" data-act="again">Nghe lại</button></div>` +
		`<div class="oz-row oz-answers" role="group" aria-label="${cc.nhom}">${nutTraLoi(cc)}</div>` +
		`<p class="oz-feedback" aria-live="polite">${esc(cc.dau)}</p><div class="oz-lt-hinh"></div><p class="oz-stats oz-lt-so"></p>` +
		`<noscript data-sinh><p>Luyện tai cần JavaScript: bật JavaScript trong trình duyệt để nghe và làm bài.</p></noscript></div>`
	);
}

/**
 * Chấm một lần chọn và lưu như site cũ: lần trả lời đầu của câu tính vào kỹ năng (đúng hay sai) và vào phiên; đúng thì
 * ghi thêm một câu trong ngày. Trả về true khi đúng.
 */
export function cham(cc, q, d, phien) {
	const dung = String(d) === String(q.dap);
	if (q.lanDau) {
		q.lanDau = false;
		phien.tong++;
		if (dung) phien.dung++;
		kyNang(cc.kyNang, dung);
	}
	if (dung) {
		q.xong = true;
		ghiNgay(cc.ngay, 1);
	}
	return dung;
}

export function mount(goc) {
	if (goc.dataset.san) return;
	const cc = CONG_CU_TAI[goc.dataset.congCu];
	if (!cc) return;
	const o = (k) => goc.querySelector(`[data-k="${k}"]`);
	const giaTri = () => Object.fromEntries(cc.chon.map(({ k }) => [k, o(k).value]));
	const traLoi = goc.querySelector('.oz-answers');
	const phanHoi = goc.querySelector('.oz-feedback');
	const hinh = goc.querySelector('.oz-lt-hinh');
	const so = goc.querySelector('.oz-lt-so');
	const phien = { dung: 0, tong: 0 };
	let q = null;
	let dangTai = false;

	const bao = (chu, lop = '') => {
		phanHoi.textContent = chu;
		phanHoi.className = `oz-feedback${lop ? ' ' + lop : ''}`;
	};
	const thongKe = () => (so.textContent = chuThongKe(cc, phien, cc.hom_nay ? soHomNay(cc.ngay) : 0));

	/** Phát câu hỏi. Lần đầu: chờ mẫu âm piano (tối đa 2 giây, nút báo aria-busy, không khóa nút để tiêu điểm không mất). */
	async function phat(nut) {
		if (!q) return;
		const c = layNgCanh(); // tạo ngay trong lúc người học bấm, như trình duyệt đòi
		if (!c) return bao('Trình duyệt này không hỗ trợ Web Audio.');
		const ds = cc.phat(q, giaTri());
		if (nut) {
			if (dangTai) return;
			dangTai = true;
			nut.setAttribute('aria-busy', 'true');
			try {
				await chuanBi(ds.map(([m]) => m));
			} finally {
				nut.removeAttribute('aria-busy');
				dangTai = false;
			}
		}
		const t = c.currentTime;
		for (const [m, luc, dai, am] of ds) choiNot(m, t + luc, dai, am);
	}

	function cauMoi(nut) {
		q = { ...cc.cau(boCua(cc, cc.chon[0] && o(cc.chon[0].k).value)), lanDau: true, xong: false };
		for (const b of traLoi.querySelectorAll('button')) {
			b.classList.remove('is-correct', 'is-wrong');
			b.removeAttribute('aria-disabled');
		}
		hinh.innerHTML = '';
		bao(cc.hoi);
		phat(nut);
	}

	traLoi.addEventListener('click', (e) => {
		const b = e.target.closest?.('button[data-d]');
		if (!b || !q || q.xong || b.getAttribute('aria-disabled') === 'true') return;
		if (cham(cc, q, b.dataset.d, phien)) {
			b.classList.add('is-correct');
			bao(cc.dung(q), 'ok');
			const h = cc.hinh?.(q, giaTri());
			if (h) hinh.innerHTML = (h.chu ? `<p class="oz-stats">${esc(h.chu)}</p>` : '') + hinhPhim(h);
		} else {
			b.classList.add('is-wrong');
			b.setAttribute('aria-disabled', 'true');
			bao(cc.sai, 'bad');
			if (cc.phatLaiKhiSai !== false) phat();
		}
		thongKe();
	});
	goc.addEventListener('click', (e) => {
		const b = e.target.closest?.('button[data-act]');
		if (!b || dangTai) return; // đang chờ mẫu âm cho lần bấm trước: bỏ qua, như nút nghe của bàn phím
		if (b.dataset.act === 'new') cauMoi(b);
		else if (b.dataset.act === 'again') phat(b);
	});
	if (cc.chon[0])
		o(cc.chon[0].k).addEventListener('change', () => {
			traLoi.innerHTML = nutTraLoi(cc, o(cc.chon[0].k).value);
			q = null;
			hinh.innerHTML = '';
			bao(cc.dau);
		});
	// trình duyệt giữ lựa chọn cũ khi tải lại trang: dựng nút theo bộ đang chọn
	if (cc.chon[0] && o(cc.chon[0].k).selectedIndex > 0) traLoi.innerHTML = nutTraLoi(cc, o(cc.chon[0].k).value);
	if (cc.hom_nay) thongKe();
	goc.dataset.san = '1';
}
