// Phiếu bài tập in được (::cong-cu{ten="worksheet-gen"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/worksheet.js: năm loại
// đề sinh ngẫu nhiên kèm đáp án (gọi tên nốt khóa Sol, khóa Fa: 16 nốt; gọi tên quãng hòa âm: 12 quãng; gọi tên hợp âm ba: 12
// hợp âm; đọc hóa biểu: 8 giọng), nút "Đề mới", "Hiện/ẩn đáp án", "In phiếu". Đáp án không bao giờ in ra (@media print của
// src/styles/thanh-phan.css), như trang nói.
// Khác bản cũ: "In phiếu" chỉ in phiếu (tiêu đề, dòng họ tên, đề), không in cả trang (src/scripts/in.js; bản cũ in cả trang
// mà ẩn mất dòng họ tên); đề hóa biểu vẽ bằng SVG của site (veHoaBieu), không tải abcjs; tám giọng được trộn đều (bản cũ
// trộn bằng sort ngẫu nhiên, lệch). Đề nốt, quãng, hợp âm vẽ bằng abcjs (nạp src/scripts/abc.js khi cần, không nạp lúc build).
import { inRieng } from './in.js';
import { CHU, GIONG, HOP_AM, hopAm, tenChu, tenVietCua, viet } from './nhac-ly.js';
import { canKyHieu, veHoaBieu } from './ve.js';

const SOL = ['Đô', 'Rê', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
const DAU_ABC = { '-2': '__', '-1': '_', 0: '', 1: '^', 2: '^^' };
const rnd = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const chon = (r, ds) => ds[Math.floor(r() * ds.length)];

/** Nốt {l, a, o} viết theo ABC, kèm dấu hóa (abc của theory.js cũ). */
export function abcNot(n, coDau = true) {
	const L = CHU[n.l];
	return (coDau ? DAU_ABC[n.a] : '') + (n.o >= 5 ? L.toLowerCase() + "'".repeat(n.o - 5) : L + ','.repeat(4 - n.o));
}
/** Nốt tự nhiên ở bậc v (quãng tám × 7 + chữ cái) viết theo ABC (abcOfV cũ). */
const abcBac = (v) => abcNot({ l: ((v % 7) + 7) % 7, a: 0, o: Math.floor(v / 7) });
/** Chia các nốt thành ô nhịp, `moi` nốt một ô (chunk cũ). */
export function chiaO(ds, moi) {
	const dong = [];
	for (let i = 0; i < ds.length; i += moi) dong.push(ds.slice(i, i + moi).join(' '));
	return `${dong.join(' |\n')} |]`;
}

const QUANG = [
	[2, 3, '3 thứ'],
	[2, 4, '3 trưởng'],
	[1, 2, '2 trưởng'],
	[1, 1, '2 thứ'],
	[3, 5, '4 đúng'],
	[3, 6, '4 tăng'],
	[4, 6, '5 giảm'],
	[4, 7, '5 đúng'],
	[5, 8, '6 thứ'],
	[5, 9, '6 trưởng'],
	[6, 10, '7 thứ'],
	[6, 11, '7 trưởng'],
	[7, 12, '8 đúng'],
];
const dauAbc = (khoa = '') => `X:1\nL:1/4\nM:4/4\nK:C${khoa}\n`;
function goiTenNot(r, tu, den, khoa) {
	const vs = Array.from({ length: 16 }, () => rnd(r, tu, den));
	return { abc: dauAbc(khoa) + chiaO(vs.map(abcBac), 4), dap_an: vs.map((v) => SOL[v % 7]) };
}

/** Năm loại đề (TYPES cũ): tên và hàm sinh đề { abc | hoa_bieu (số dấu của từng giọng), dap_an }. */
export const LOAI = {
	notesTreble: { ten: 'Gọi tên nốt khóa Sol', tao: (r) => goiTenNot(r, 26, 42, '') },
	notesBass: { ten: 'Gọi tên nốt khóa Fa', tao: (r) => goiTenNot(r, 14, 30, ' clef=bass') },
	intervals: {
		ten: 'Gọi tên quãng (hòa âm)',
		tao(r) {
			const ds = Array.from({ length: 12 }, () => {
				const g = chon(r, ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb3', 'Eb4']);
				const q = chon(r, QUANG);
				return { abc: `[${viet(g, [[0, 0], [q[0], q[1]]]).map((n) => abcNot(n)).join('')}]4`, dap_an: q[2] };
			});
			return { abc: dauAbc() + chiaO(ds.map((x) => x.abc), 4), dap_an: ds.map((x) => x.dap_an) };
		},
	},
	chords: {
		ten: 'Gọi tên hợp âm ba',
		tao(r) {
			const ds = Array.from({ length: 12 }, () => {
				const g = chon(r, ['C4', 'D4', 'E4', 'F4', 'G4', 'A3', 'Bb3', 'Eb4', 'B3']);
				const t = chon(r, ['maj', 'maj', 'min', 'min', 'dim', 'aug']);
				const nots = hopAm(g, t);
				return { abc: `[${nots.map((n) => abcNot(n)).join('')}]4`, dap_an: `${tenChu(nots[0])}${HOP_AM[t].ky_hieu} (${HOP_AM[t].ten.replace('Hợp âm ', '')})` };
			});
			return { abc: dauAbc() + chiaO(ds.map((x) => x.abc), 4), dap_an: ds.map((x) => x.dap_an) };
		},
	},
	keysigs: {
		ten: 'Đọc hóa biểu',
		tao(r) {
			const ds = GIONG.slice();
			for (let i = ds.length - 1; i > 0; i--) {
				const j = Math.floor(r() * (i + 1));
				[ds[i], ds[j]] = [ds[j], ds[i]];
			}
			const tam = ds.slice(0, 8);
			return { hoa_bieu: tam.map((g) => g.n), dap_an: tam.map((g) => `${tenVietCua(g.chu_am)} trưởng / ${tenVietCua(g.thu)} thứ`) };
		},
	},
};

/** Đề mới của một loại (`r`: hàm ngẫu nhiên). */
export const deBai = (loai, r = Math.random) => LOAI[loai].tao(r);
/** Dòng đáp án: "1. Sol; 2. Mi; …". */
export const chuDapAn = (ds) => ds.map((a, i) => `${i + 1}. ${a}`).join('; ');

export const vePhieu = () =>
	`<div class="oz-phieu oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row oz-khong-in"><label>Loại bài <select data-k="loai">${Object.entries(LOAI)
		.map(([k, v]) => `<option value="${k}">${v.ten}</option>`)
		.join('')}</select></label>` +
	`<button type="button" class="oz-btn" data-act="moi">Đề mới</button>` +
	`<button type="button" class="oz-btn" data-act="dap-an" aria-expanded="false">Hiện/ẩn đáp án</button>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="in">In phiếu</button></div>` +
	`<div class="oz-phieu-to">` +
	`<p class="oz-phieu-ten">Phiếu bài tập: ${LOAI.notesTreble.ten}</p>` +
	`<p class="oz-phieu-ho-ten">Họ tên: ____________________ Ngày: ____________ Điểm: ______</p>` +
	`<div class="oz-phieu-de" role="img" aria-label="Đề bài"></div></div>` +
	`<p class="oz-phieu-dap-an" hidden></p>` +
	`<noscript data-sinh><p>Phiếu bài tập cần JavaScript để sinh đề: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chonLoai = goc.querySelector('[data-k="loai"]');
	const ten = goc.querySelector('.oz-phieu-ten');
	const de = goc.querySelector('.oz-phieu-de');
	const dapAn = goc.querySelector('.oz-phieu-dap-an');
	const nutDapAn = goc.querySelector('[data-act="dap-an"]');
	let lan = 0;
	const tao = async () => {
		const loai = chonLoai.value;
		const d = deBai(loai);
		const so = ++lan;
		ten.textContent = `Phiếu bài tập: ${LOAI[loai].ten}`;
		dapAn.innerHTML = `<strong>Đáp án:</strong> ${chuDapAn(d.dap_an)}`;
		de.setAttribute('aria-label', `Đề bài: ${LOAI[loai].ten}, ${d.dap_an.length} câu`);
		if (d.hoa_bieu) {
			canKyHieu();
			de.innerHTML = `<div class="oz-phieu-luoi">${d.hoa_bieu
				.map((n, i) => `<div class="oz-phieu-o">${veHoaBieu(n)}<span>${i + 1}. ______________</span></div>`)
				.join('')}</div>`;
			return;
		}
		const dong = `<p class="oz-phieu-viet">Viết đáp án dưới mỗi nốt/hợp âm, hoặc ghi theo thứ tự: ${d.dap_an.map((_, i) => `${i + 1}. ____`).join('  ')}</p>`;
		try {
			// abc.js đọc document khi nạp: chỉ nạp trong trình duyệt, lúc cần
			const ABCJS = await (await import('./abc.js')).taiAbcjs();
			if (so !== lan) return;
			de.innerHTML = `<div class="oz-phieu-khuong"></div>${dong}`;
			ABCJS.renderAbc(de.firstElementChild, d.abc, { responsive: 'resize', foregroundColor: 'currentColor', paddingleft: 0, paddingright: 0 });
		} catch {
			if (so === lan) de.innerHTML = `<p>Không tải được thư viện vẽ khuông nhạc. Kiểm tra kết nối mạng rồi tải lại trang.</p>${dong}`;
		}
	};
	goc.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		if (b.dataset.act === 'moi') tao();
		if (b.dataset.act === 'dap-an') {
			dapAn.hidden = !dapAn.hidden;
			nutDapAn.setAttribute('aria-expanded', String(!dapAn.hidden));
		}
		if (b.dataset.act === 'in') inRieng(goc.querySelector('.oz-phieu-to'));
	});
	chonLoai.addEventListener('change', tao);
	goc.dataset.san = '1';
	return tao();
}
