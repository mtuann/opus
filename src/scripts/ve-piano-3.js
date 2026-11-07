// Hình của đợt hình 3a (plans/ben-vung/de-xuat-hinh.md, đề xuất 7, 14, 30): ngón bấm 12 gam trưởng trên phím (dùng lại
// veBanPhim của đợt hình 1), bước nhảy, buổi tập 30 phút và thang máy đếm nhịp (dùng lại veThoiGian của đợt hình 2a).
// Mỗi hình chỉ vẽ lại chữ, bảng của trang ghi ở chú thích từng hàm; dùng qua ::hinh{ten}.

import { laPhimDen, gam, midi, tenViet } from './nhac-ly.js';
import { veBanPhim } from './ve.js';
import { veThoiGian } from './ve-thoi-gian.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- Ngón bấm 12 gam trưởng (piano/gam) ----------

/**
 * Bảng "Bảng ngón bấm 12 gam trưởng" của piano/gam, chép nguyên từng ô: giọng (cột "Giọng"), chủ âm để dựng gam, tay phải,
 * tay trái (một quãng tám đi lên; số trong ngoặc chỉ dùng ở đầu mút), ngón 4 tay phải, ngón 4 tay trái.
 * tests/piano-3.test.mjs so từng dòng với bảng trong trang.
 */
export const NGON_GAM = [
	['Đô', 'C4', '1 2 3 1 2 3 4 (5)', '(5) 4 3 2 1 3 2 1', 'Si', 'Rê'],
	['Sol', 'G4', '1 2 3 1 2 3 4 (5)', '(5) 4 3 2 1 3 2 1', 'Fa♯', 'La'],
	['Rê', 'D4', '1 2 3 1 2 3 4 (5)', '(5) 4 3 2 1 3 2 1', 'Đô♯', 'Mi'],
	['La', 'A4', '1 2 3 1 2 3 4 (5)', '(5) 4 3 2 1 3 2 1', 'Sol♯', 'Si'],
	['Mi', 'E4', '1 2 3 1 2 3 4 (5)', '(5) 4 3 2 1 3 2 1', 'Rê♯', 'Fa♯'],
	['Si', 'B4', '1 2 3 1 2 3 4 (5)', '(4) 3 2 1 4 3 2 1', 'La♯', 'Fa♯'],
	['Fa♯ = Sol♭', 'F#4', '2 3 4 1 2 3 1 2', '4 3 2 1 3 2 1 4', 'La♯ = Si♭', 'Fa♯ = Sol♭'],
	['Rê♭ = Đô♯', 'Db4', '2 3 1 2 3 4 1 2', '3 2 1 4 3 2 1 3', 'Si♭', 'Sol♭'],
	['La♭', 'Ab4', '3 4 1 2 3 1 2 3', '3 2 1 4 3 2 1 3', 'Si♭', 'Rê♭'],
	['Mi♭', 'Eb4', '3 1 2 3 4 1 2 3', '3 2 1 4 3 2 1 3', 'Si♭', 'La♭'],
	['Si♭', 'Bb4', '4 1 2 3 1 2 3 4', '3 2 1 4 3 2 1 3', 'Si♭', 'Mi♭'],
	['Fa', 'F4', '1 2 3 4 1 2 3 (4)', '(5) 4 3 2 1 3 2 1', 'Si♭', 'Sol'],
].map(([giong, chuAm, phai, trai, bon_phai, bon_trai]) => ({ giong, chuAm, phai, trai, bon_phai, bon_trai }));

/** "1 2 3 (5)" -> [{ so, mut }]: mut là số trong ngoặc (chỉ dùng ở đầu mút của gam). */
export function docNgon(s) {
	return s.split(' ').map((x) => {
		const m = /^(\()?([1-5])\)?$/.exec(x);
		if (!m) throw new Error(`ngón "${x}" không đọc được`);
		return { so: Number(m[2]), mut: !!m[1] };
	});
}

/** Một giọng: tám nốt (tên Việt, số MIDI), số ngón hai tay, và bàn phím chín phím trắng từ chủ âm (hay phím trắng ngay dưới). */
export function gamCo(g) {
	const not = gam(g.chuAm, 'major').map((n) => ({ ten: tenViet(n), m: midi(n) }));
	const phai = docNgon(g.phai);
	const trai = docNgon(g.trai);
	if (phai.length !== 8 || trai.length !== 8) throw new Error(`${g.giong}: mỗi tay phải có 8 số ngón`);
	const thap = laPhimDen(not[0].m) ? not[0].m - 1 : not[0].m;
	let cao = thap;
	for (let trang = 1; trang < 9; ) if (!laPhimDen(++cao)) trang++;
	return { not, phai, trai, thap, cao };
}

const doc = (not, ngon) => not.map((n, i) => `${n.ten} ${ngon[i].so}${ngon[i].mut ? ' (chỉ ở đầu mút)' : ''}`).join(', ');

/**
 * piano/gam, "Bảng ngón bấm 12 gam trưởng" (và "Cách đọc bảng": số trong ngoặc chỉ dùng ở đầu mút): mười hai bàn phím nhỏ
 * theo thứ tự của bảng, mỗi bàn phím một quãng tám đi lên, số ngón tay phải (tròn) và tay trái (vuông) trên từng phím của
 * gam như veBanPhim (đợt hình 1). Số trong ngoặc vẽ viền đứt (lớp oz-ngon--mut). Hình tĩnh, không bấm được.
 */
export function hinhNgonGam() {
	const o = NGON_GAM.map((g) => {
		const { not, phai, trai, thap, cao } = gamCo(g);
		const ngon = [
			...not.map((n, i) => ({ m: n.m, tay: 'phai', so: phai[i].so })),
			...not.map((n, i) => ({ m: n.m, tay: 'trai', so: trai[i].so })),
		];
		let { svg } = veBanPhim({ thap, cao, to: not.map((n) => n.m), ngon });
		const ten = `${g.giong} trưởng`;
		const moTa = `${ten}, một quãng tám đi lên. Tay phải: ${doc(not, phai)}. Tay trái: ${doc(not, trai)}.`;
		svg = svg.replace(/ aria-label="[^"]*"/, ` aria-label="${esc(moTa)}"`);
		for (const [tay, ds] of [['phai', phai], ['trai', trai]])
			ds.forEach((x, i) => {
				if (!x.mut) return;
				const cu = `<g class="oz-ngon oz-ngon--${tay}" data-phim="${not[i].m}"`;
				if (!svg.includes(cu)) throw new Error(`${ten}: không thấy dấu ngón của phím ${not[i].m}`);
				svg = svg.replace(cu, `<g class="oz-ngon oz-ngon--${tay} oz-ngon--mut" data-phim="${not[i].m}"`);
			});
		return `<div class="oz-ngon-gam-o"><b class="oz-ngon-gam-ten" aria-hidden="true">${esc(ten)}</b>${svg}</div>`;
	});
	const dau = (tay, mut) =>
		`<svg class="oz-ngon oz-ngon--${tay}${mut ? ' oz-ngon--mut' : ''}" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false">` +
		(tay === 'phai' ? '<circle cx="7" cy="7" r="6"/>' : '<rect x="1" y="1" width="12" height="12" rx="2.2"/>') +
		`</svg>`;
	return (
		`<figure class="oz-figure oz-ngon-gam not-content" data-sinh>` +
		`<div class="oz-ngon-gam-luoi">${o.join('')}</div>` +
		`<p class="oz-phim-chu-giai"><span>${dau('phai')} số ngón tay phải</span> <span>${dau('trai')} số ngón tay trái</span> ` +
		`<span>${dau('phai', true)}${dau('trai', true)} số trong ngoặc của bảng</span></p>` +
		`<figcaption>Bảng ngón bấm trên phím: mỗi giọng một quãng tám đi lên, theo thứ tự của bảng. Viền đứt là số trong ngoặc, ` +
		`chỉ dùng ở đầu mút của gam (nốt cao nhất của tay phải, nốt thấp nhất của tay trái).</figcaption></figure>`
	);
}

// ---------- Dải thời gian (veThoiGian) ----------

/**
 * piano/quang-tam-buoc-nhay, "Bước nhảy: nhảy sớm, đánh đúng lúc" (đoạn đầu và gạch "Đường đi thấp"): hai cách đi từ nốt
 * trước (phách 1) tới nốt đích (phách 2). Gộp làm một: tay vừa bay vừa đập xuống, vừa trễ vừa trượt. Tách hai việc: rời nốt
 * trước ngay khi nó đã kêu, vòng thấp, đến đích sớm, chạm nhẹ mặt phím, chờ, rồi đánh đúng lúc. Độ dài chỉ để so sánh.
 */
function hinhBuocNhay() {
	return veThoiGian({
		n: 16,
		moTa:
			'Bước nhảy từ nốt trước (phách 1) tới nốt đích (phách 2). Gộp làm một (lỗi): đánh nốt trước, rồi tay vừa bay vừa đập xuống, ' +
			'nên nốt đích vừa trễ vừa trượt, sau phách 2. Tách hai việc: đánh nốt trước, rời ngay khi nó đã kêu, bay vòng thấp, ' +
			'đến đích sớm, chạm nhẹ mặt phím và chờ, rồi đánh đúng phách 2.',
		chuThich:
			'Một bước nhảy là hai việc: di chuyển và đánh. Gộp làm một thì vừa trễ vừa trượt; tách ra thì tay đến đích sớm, chạm nhẹ mặt phím, ' +
			'chờ, rồi mới đánh đúng lúc bằng một động tác ngắn từ sát phím. Độ dài các ô chỉ để so sánh, không phải số đo.',
		hang: [
			{
				ten: '<b>Phách</b>',
				muc: [
					{ bat: 0, dai: 8, chu: 'phách 1: nốt trước', lop: 'manh' },
					{ bat: 8, dai: 8, chu: 'phách 2: nốt đích', lop: 'vua' },
				],
			},
			{
				ten: '<b>Gộp làm một</b> <small>(lỗi)</small>',
				nhom: true,
				cao: 'cao',
				vach: [8],
				muc: [
					{ bat: 0, dai: 2, chu: 'đánh', lop: 'co' },
					{ bat: 2, dai: 7, chu: 'vừa bay vừa đập xuống', lop: 'tuy-y' },
					{ bat: 9, dai: 3, chu: 'trễ, trượt', lop: 'ket' },
				],
			},
			{
				ten: '<b>Tách hai việc</b>',
				nhom: true,
				cao: 'cao',
				vach: [8],
				muc: [
					{ bat: 0, dai: 2, chu: 'đánh', lop: 'co' },
					{ bat: 2, dai: 3, chu: 'rời ngay, bay thấp', lop: 'a' },
					{ bat: 5, dai: 3, chu: 'chạm phím, chờ', lop: 'c' },
					{ bat: 8, dai: 3, chu: 'đánh đúng lúc', lop: 'co' },
				],
			},
		],
	});
}

/** bat-dau/moi-ngay, bảng "Buổi 30 phút (chuẩn)": 3 + 5 + 15 + 5 + 2 phút, theo thứ tự của bảng, trên trục 30 phút. */
export const BUOI_30 = [
	['Khởi động', 3, 'a'],
	['Kỹ thuật', 5, 'b'],
	['Bài đang học', 15, 'c'],
	['Đọc nốt, thị tấu', 5, 'ket'],
	['Nhật ký', 2, 'nhe'],
];

function hinhBuoiTap() {
	const moc = BUOI_30.reduce((ds, [, p]) => [...ds, ds.at(-1) + p], [0]);
	const vach = moc.slice(1, -1);
	return veThoiGian({
		n: moc.at(-1),
		moTa: `Buổi tập 30 phút chia theo thứ tự: ${BUOI_30.map(([t, p]) => `${t.toLowerCase()} ${p} phút`).join(', ')}.`,
		chuThich: 'Buổi 30 phút theo bảng trên: mỗi việc một thanh, dài theo số phút, nối tiếp nhau từ phút 0 đến phút 30.',
		hang: BUOI_30.map(([ten, p, lop], i) => ({
			ten: `${ten} <small>${p} phút</small>`,
			cao: 'thap',
			vach,
			muc: [{ bat: moc[i], dai: p, chu: String(p), lop }],
		})),
	});
}

/** piano/cach-tap, bảng "Ví dụ một thang máy đếm nhịp": [ngày, bắt đầu, cao nhất trong buổi] (♩ =). */
export const THANG_MAY = [
	[1, 60, 68],
	[2, 64, 72],
	[3, 66, 76],
	[4, 68, 76],
];

/**
 * Thang máy đếm nhịp: mỗi ngày một thanh từ tốc độ bắt đầu tới cao nhất trong buổi, trên trục ♩ = 58–78; vạch đứt ở mỗi
 * ngày từ ngày 2 là mức cao nhất hôm trước (cột "Ghi chú" ngày 2: bắt đầu thấp hơn mức cao nhất hôm qua).
 */
function hinhThangMay() {
	const GOC = 58;
	const vi = (t) => t - GOC;
	return veThoiGian({
		n: 20,
		moTa:
			'Thang máy đếm nhịp bốn ngày, tốc độ nốt đen: ' +
			THANG_MAY.map(([d, a, b]) => `ngày ${d} bắt đầu ${a}, cao nhất ${b}`).join('; ') +
			'. Mỗi ngày bắt đầu thấp hơn mức cao nhất hôm trước; ngày 3 và ngày 4 cao nhất cùng ở 76.',
		chuThich:
			'Mỗi thanh đi từ tốc độ bắt đầu tới tốc độ cao nhất trong buổi (♩ =). Vạch đứt: mức cao nhất hôm trước, ngày sau bắt đầu thấp hơn vạch ấy. ' +
			'Tốc độ không tăng đều mỗi ngày.',
		hang: [
			{ ten: '<b>♩ =</b>', cao: 'thap', muc: [60, 64, 68, 72, 76].map((t) => ({ bat: vi(t) - 2, dai: 4, chu: String(t), lop: 'chu' })) },
			...THANG_MAY.map(([d, a, b], i) => ({
				ten: `Ngày ${d}`,
				vach: i ? [vi(THANG_MAY[i - 1][2])] : [],
				muc: [{ bat: vi(a), dai: b - a, chu: `${a} → ${b}`, lop: 'a' }],
			})),
		],
	});
}

const HAM = { 'ngon-gam': hinhNgonGam, 'buoc-nhay': hinhBuocNhay, 'buoi-tap': hinhBuoiTap, 'thang-may': hinhThangMay };

/** Hình của đợt 3a cho HINH của src/plugins/thanh-phan.mjs: lỗi ghi tên hình. */
export const HINH_PIANO_3 = Object.fromEntries(
	Object.entries(HAM).map(([ten, f]) => [
		ten,
		() => {
			try {
				return f();
			} catch (e) {
				throw new Error(`::hinh{ten="${ten}"}: ${e.message}`);
			}
		},
	]),
);
