// Lõi nhạc lý dùng chung (chuyển từ ../opus-zero/docs/assets/js/theory.js): tên nốt hai hệ, số MIDI, gam, hợp âm, 15 giọng
// và hóa biểu. Module thuần (không đụng tới trình duyệt), nên dùng được cả lúc build (src/plugins/thanh-phan.mjs dựng bàn
// phím, hình hóa biểu, vòng quãng năm) lẫn trong trình duyệt (bàn phím, vòng quãng năm, luyện hóa biểu), và kiểm thử
// bằng Node (tests/ban-phim.test.mjs). Tên hàm cũ ghi trong ngoặc ở chú thích từng hàm, để dễ đối chiếu.

export const CHU = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const SOLFEGE = ['Đô', 'Rê', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
/** Số nửa cung từ Đô tới từng nốt tự nhiên (NAT). */
export const TU_NHIEN = [0, 2, 4, 5, 7, 9, 11];
const KY_HIEU = { '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' };

/** Công thức gam, tính theo nửa cung từ chủ âm (SCALES). */
export const GAM = {
	major: { ten: 'Gam trưởng', buoc: [0, 2, 4, 5, 7, 9, 11] },
	natural: { ten: 'Gam thứ tự nhiên', buoc: [0, 2, 3, 5, 7, 8, 10] },
	harmonic: { ten: 'Gam thứ hòa âm', buoc: [0, 2, 3, 5, 7, 8, 11] },
	melodic: { ten: 'Gam thứ giai điệu (đi lên)', buoc: [0, 2, 3, 5, 7, 9, 11] },
	dorian: { ten: 'Điệu Dorian', buoc: [0, 2, 3, 5, 7, 9, 10] },
	phrygian: { ten: 'Điệu Phrygian', buoc: [0, 1, 3, 5, 7, 8, 10] },
	lydian: { ten: 'Điệu Lydian', buoc: [0, 2, 4, 6, 7, 9, 11] },
	mixolydian: { ten: 'Điệu Mixolydian', buoc: [0, 2, 4, 5, 7, 9, 10] },
	locrian: { ten: 'Điệu Locrian', buoc: [0, 1, 3, 5, 6, 8, 10] },
	// gam năm nốt: `chu` là bậc chữ cái của từng nốt (letters), để viết đúng tên (ngũ cung trưởng bỏ bậc 4 và 7)
	pentaMajor: { ten: 'Ngũ cung trưởng', buoc: [0, 2, 4, 7, 9], chu: [0, 1, 2, 4, 5] },
	pentaMinor: { ten: 'Ngũ cung thứ', buoc: [0, 3, 5, 7, 10], chu: [0, 2, 3, 4, 6] },
};
/** Hợp âm ba và hợp âm bảy: [bậc chữ cái tính từ nốt gốc, số nửa cung] (CHORDS). */
export const HOP_AM = {
	maj: { ten: 'Hợp âm trưởng', ky_hieu: '', not: [[0, 0], [2, 4], [4, 7]] },
	min: { ten: 'Hợp âm thứ', ky_hieu: 'm', not: [[0, 0], [2, 3], [4, 7]] },
	dim: { ten: 'Hợp âm giảm', ky_hieu: '°', not: [[0, 0], [2, 3], [4, 6]] },
	aug: { ten: 'Hợp âm tăng', ky_hieu: '+', not: [[0, 0], [2, 4], [4, 8]] },
	maj7: { ten: 'Hợp âm bảy trưởng', ky_hieu: 'maj7', not: [[0, 0], [2, 4], [4, 7], [6, 11]] },
	dom7: { ten: 'Hợp âm bảy át', ky_hieu: '7', not: [[0, 0], [2, 4], [4, 7], [6, 10]] },
	min7: { ten: 'Hợp âm bảy thứ', ky_hieu: 'm7', not: [[0, 0], [2, 3], [4, 7], [6, 10]] },
	hdim7: { ten: 'Hợp âm bảy nửa giảm', ky_hieu: 'ø7', not: [[0, 0], [2, 3], [4, 6], [6, 10]] },
	dim7: { ten: 'Hợp âm bảy giảm', ky_hieu: '°7', not: [[0, 0], [2, 3], [4, 6], [6, 9]] },
};

/**
 * 15 giọng trưởng (KEYS): chủ âm, số dấu hóa (dương: dấu thăng, âm: dấu giáng), chủ âm của giọng thứ song song. Thứ tự:
 * không dấu, 1 đến 7 dấu thăng, 1 đến 7 dấu giáng (như bảng 15 giọng của bài 8).
 */
export const GIONG = [
	{ chu_am: 'C', n: 0, thu: 'A' },
	{ chu_am: 'G', n: 1, thu: 'E' },
	{ chu_am: 'D', n: 2, thu: 'B' },
	{ chu_am: 'A', n: 3, thu: 'F#' },
	{ chu_am: 'E', n: 4, thu: 'C#' },
	{ chu_am: 'B', n: 5, thu: 'G#' },
	{ chu_am: 'F#', n: 6, thu: 'D#' },
	{ chu_am: 'C#', n: 7, thu: 'A#' },
	{ chu_am: 'F', n: -1, thu: 'D' },
	{ chu_am: 'Bb', n: -2, thu: 'G' },
	{ chu_am: 'Eb', n: -3, thu: 'C' },
	{ chu_am: 'Ab', n: -4, thu: 'F' },
	{ chu_am: 'Db', n: -5, thu: 'Bb' },
	{ chu_am: 'Gb', n: -6, thu: 'Eb' },
	{ chu_am: 'Cb', n: -7, thu: 'Ab' },
];
/** Thứ tự dấu thăng và dấu giáng trên hóa biểu (SHARP_ORDER, FLAT_ORDER). */
export const THU_TU_THANG = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const THU_TU_GIANG = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

/** "F#4", "Bb3", "Cb5", "C" -> { l: chỉ số chữ cái, a: dấu hóa, o: quãng tám } (không có số: quãng tám 4); sai thì null (parse). */
export function docNot(s) {
	const m = /^([A-Ga-g])(##|bb|#|b|x)?(-?\d+)?$/.exec(String(s).trim());
	if (!m) return null;
	const a = { '#': 1, '##': 2, x: 2, b: -1, bb: -2 }[m[2]] || 0;
	return { l: CHU.indexOf(m[1].toUpperCase()), a, o: m[3] === undefined ? 4 : Number(m[3]) };
}
/** Số MIDI của nốt (Đô giữa C4 = 60) (midi). */
export const midi = (n) => 12 * (n.o + 1) + TU_NHIEN[n.l] + n.a;
/** Số MIDI của nốt viết bằng chữ, hay null (midiOf). */
export function midiCua(s) {
	const n = docNot(s);
	return n ? midi(n) : null;
}
/** Tên chữ cái kèm dấu: "F♯" (letterName). */
export const tenChu = (n) => CHU[n.l] + KY_HIEU[n.a];
/** Tên Việt kèm dấu: "Fa♯" (viName). */
export const tenViet = (n) => SOLFEGE[n.l] + KY_HIEU[n.a];
/** Tên khoa học: "F♯4" (sci). */
export const tenKhoaHoc = (n) => tenChu(n) + n.o;

/** Xây chuỗi nốt đúng tên (mỗi chữ cái một lần) từ nốt gốc và công thức [[bậc chữ cái, nửa cung]…] (spell). */
export function viet(goc, congThuc) {
	const r = typeof goc === 'string' ? docNot(goc) : goc;
	const pcGoc = TU_NHIEN[r.l] + r.a;
	return congThuc.map(([bac, nua]) => {
		const l = (r.l + bac) % 7;
		const vong = Math.floor((r.l + bac) / 7);
		return { l, a: pcGoc + nua - (TU_NHIEN[l] + 12 * vong), o: r.o + vong };
	});
}
/** Gam từ chủ âm, kèm nốt thứ tám (scale). */
export const gam = (goc, loai) => viet(goc, GAM[loai].buoc.map((b, i) => [GAM[loai].chu?.[i] ?? i, b]).concat([[7, 12]]));
/** Hợp âm ba hay hợp âm bảy từ nốt gốc (chord). */
export const hopAm = (goc, loai) => viet(goc, HOP_AM[loai].not);

/** Giọng theo chủ âm của giọng trưởng ("Bb") (keyByTonic). */
export const giongTheoChuAm = (t) => GIONG.find((k) => k.chu_am === t);
/** Tên giọng viết chữ cái: "B♭" (prettyKey). */
export const tenChuCua = (t) => tenChu(docNot(t));
/** Tên giọng viết tiếng Việt: "Si♭" (prettyKeyVi). */
export const tenVietCua = (t) => tenViet(docNot(t));
/** Các dấu của hóa biểu có n dấu: ["F", "C"] (n = 2) hay ["B", "E", "A"] (n = -3). */
export const dauCuaHoaBieu = (n) => (n > 0 ? THU_TU_THANG.slice(0, n) : THU_TU_GIANG.slice(0, -n));
/** "2 dấu thăng: F♯, C♯", "không có dấu hóa" (sigText). */
export function chuHoaBieu(n) {
	if (n === 0) return 'không có dấu hóa';
	const ds = dauCuaHoaBieu(n).map((L) => L + (n > 0 ? '♯' : '♭'));
	return `${Math.abs(n)} ${n > 0 ? 'dấu thăng' : 'dấu giáng'}: ${ds.join(', ')}`;
}
/** Số dấu hóa viết gọn như hình cũ: "không dấu", "3♯", "2♭". */
export const soDauGon = (n) => (n === 0 ? 'không dấu' : `${Math.abs(n)}${n > 0 ? '♯' : '♭'}`);

/** Tên mười hai cao độ trong một quãng tám, theo số nửa cung từ Đô (PC_NAMES, PC_LETTERS của piano.js). */
export const CAO_DO_VIET = ['Đô', 'Đô♯/Rê♭', 'Rê', 'Rê♯/Mi♭', 'Mi', 'Fa', 'Fa♯/Sol♭', 'Sol', 'Sol♯/La♭', 'La', 'La♯/Si♭', 'Si'];
export const CAO_DO_CHU = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
const PHIM_DEN = [1, 3, 6, 8, 10];
/** Phím của số MIDI m là phím đen không. */
export const laPhimDen = (m) => PHIM_DEN.includes(((m % 12) + 12) % 12);
/** Tên phím như bàn phím cũ: "Đô♯/Rê♭ (C♯/D♭4)" (nameOf của piano.js). */
export function tenPhim(m) {
	const pc = ((m % 12) + 12) % 12;
	return `${CAO_DO_VIET[pc]} (${CAO_DO_CHU[pc]}${Math.floor(m / 12) - 1})`;
}
