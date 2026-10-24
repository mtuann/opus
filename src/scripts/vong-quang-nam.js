// Vòng quãng năm bấm được (::cong-cu{ten="circle"}), chuyển từ mountCircle của ../opus-zero/docs/assets/js/circle.js. Vòng
// và thông tin của giọng Đô trưởng đã dựng sẵn lúc build (veVongChon, thongTinGiong trong src/scripts/ve.js); ở đây: chọn
// một giọng (bấm, hay phím mũi tên như một nhóm lựa chọn), hiện hóa biểu, các nốt, hợp âm các bậc, giọng song song, và
// nghe gam, nghe I – IV – V – I. Hóa biểu vẽ bằng SVG của site, không cần tải abcjs như bản cũ.
import { chuanBi, choiNot, layNgCanh } from './am-thanh.js';
import { gam, giongTheoChuAm, midi } from './nhac-ly.js';
import { canKyHieu, chuGiua, thongTinGiong } from './ve.js';

/** Các nốt (số MIDI) để nghe gam của giọng đang chọn: từ chủ âm quãng tám 4, cao quá Fa♯4 thì hạ một quãng tám. */
export function notGam({ giong, thu }) {
	const k = giongTheoChuAm(giong);
	let ds = gam(`${thu ? k.thu : k.chu_am}4`, thu ? 'natural' : 'major').map(midi);
	if (ds[0] > 66) ds = ds.map((m) => m - 12);
	return ds;
}

export function mount(goc) {
	if (goc.dataset.san) return;
	canKyHieu();
	const svg = goc.querySelector('svg.oz-vong-hinh');
	const tin = goc.querySelector('.oz-vong-tin');
	const giua = svg.querySelector('.oz-vong-giua-chu');
	const o = [...svg.querySelectorAll('.oz-vong-o')];
	let chon = null;
	svg.setAttribute('role', 'radiogroup');
	svg.setAttribute('aria-label', 'Vòng quãng năm: chọn một giọng (phím mũi tên trái, phải đi quanh vòng; lên, xuống đổi vòng trong, vòng ngoài)');
	for (const g of o) {
		g.setAttribute('role', 'radio');
		g.setAttribute('aria-label', g.dataset.ten);
	}
	function chonO(g, { doiTieuDiem = false } = {}) {
		chon = { giong: g.dataset.giong, thu: 'thu' in g.dataset };
		for (const x of o) {
			const la = x === g;
			x.classList.toggle('chon', la);
			x.setAttribute('aria-checked', String(la));
			x.setAttribute('tabindex', la ? '0' : '-1');
		}
		giua.textContent = chuGiua(chon);
		tin.innerHTML = thongTinGiong(chon);
		if (doiTieuDiem) g.focus();
	}
	svg.addEventListener('click', (e) => {
		const g = e.target.closest?.('.oz-vong-o');
		if (g) chonO(g);
	});
	svg.addEventListener('keydown', (e) => {
		const g = e.target.closest?.('.oz-vong-o');
		if (!g) return;
		const i = o.indexOf(g); // thứ tự: vị trí 0 ngoài, vị trí 0 trong, vị trí 1 ngoài…
		const [viTri, trong] = [Math.floor(i / 2), i % 2];
		const ke = { ArrowRight: [viTri + 1, trong], ArrowLeft: [viTri - 1, trong], ArrowDown: [viTri, 1], ArrowUp: [viTri, 0] }[e.key];
		if (ke) {
			e.preventDefault();
			chonO(o[((ke[0] + 12) % 12) * 2 + ke[1]], { doiTieuDiem: true });
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			chonO(g);
		}
	});
	tin.addEventListener('click', async (e) => {
		const b = e.target.closest?.('button[data-k]');
		const c = b && chon && layNgCanh();
		if (!c) return;
		const ds = notGam(chon);
		const r = ds[0];
		const hopAm = [
			[0, 4, 7],
			[5, 9, 12],
			[7, 11, 14],
			[0, 4, 7],
		];
		const nots = b.dataset.k === 'gam' ? ds : hopAm.flatMap((h) => [r - 12 + h[0], ...h.map((x) => r + x)]);
		await chuanBi(nots);
		const t = c.currentTime;
		if (b.dataset.k === 'gam') ds.forEach((m, i) => choiNot(m, t + i * 0.32, 0.55));
		else hopAm.forEach((h, i) => [r - 12 + h[0], ...h.map((x) => r + x)].forEach((m) => choiNot(m, t + i * 0.9, 1, 0.11)));
	});
	chonO(o.find((g) => g.classList.contains('chon')) ?? o[0]);
	goc.dataset.san = '1';
}
