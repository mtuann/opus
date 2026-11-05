// Chép giai điệu (::cong-cu{ten="dictation"}, D7-L1), chuyển từ ../opus-zero/docs/assets/js/dictation.js: nghe một câu nhạc
// ngắn trong Đô trưởng (bắt đầu ở Đô4, kết ở Đô4 hay Đô5; cấp 1: 4 nốt bước liền, cấp 2: 6 nốt có bước nhảy, cấp 3: 8 nốt)
// rồi nhập lại bằng bàn phím trên màn hình (Sol3–Fa5) hay đàn MIDI (ô kết nối nằm ngay trong công cụ, như bản cũ). Kiểm tra
// thì đánh dấu từng nốt và vẽ hình so sánh (soSanhChep, src/scripts/hinh-so-sanh.js). Lưu như bản cũ: kỹ năng "dictation",
// số câu chép đúng hoàn toàn trong ngày (days[ngày].melodies).
// veChep dựng sẵn ô lúc build, mount thêm phần bấm được.
import { choiNot, chuanBi, layNgCanh } from './am-thanh.js';
import { ganBanPhim } from './ban-phim.js';
import { soSanhChep } from './hinh-so-sanh.js';
import { nghe, veTrangThaiMidi } from './midi.js';
import { ghiNgay, kyNang } from './tien-do.js';
import { veBanPhim } from './ve.js';

export const CAP = {
	// nốt cuối luôn là Đô (Đô4 hay Đô5), nên có thể là một bước nhảy: nhãn nói rõ (lượt 1, hồ sơ chep-giai-dieu n10)
	1: { ten: 'Cấp 1: 4 nốt, đi liền bậc, kết ở Đô', n: 4 },
	2: { ten: 'Cấp 2: 6 nốt, có bước nhảy', n: 6 },
	3: { ten: 'Cấp 3: 8 nốt', n: 8 },
};
const GAM = [0, 2, 4, 5, 7, 9, 11, 12];
const TEN = ['Đô', 'Đô♯', 'Rê', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'Si♭', 'Si'];
export const ten = (m) => TEN[((m % 12) + 12) % 12];
export const THAP = 55;
export const CAO = 77;
const DAU = 'Bấm “Câu mới”. Giai điệu luôn bắt đầu bằng Đô (Đô4); bạn nhập tất cả các nốt, kể cả nốt đầu.';

/** Câu nhạc mới (gen cũ; `r`: hàm ngẫu nhiên trong [0, 1)): bắt đầu Đô4, kết ở chủ âm, các bậc trong Đô4–Đô5. */
export function taoCau(cap, r = Math.random) {
	const n = CAP[cap].n;
	const ra = [60];
	let bac = 0;
	while (ra.length < n - 1) {
		const x = r();
		let buoc = cap === 1 ? (x < 0.5 ? 1 : -1) : x < 0.45 ? 1 : x < 0.75 ? -1 : x < 0.88 ? 2 : -2;
		if (cap === 3 && r() < 0.15) buoc = r() < 0.5 ? 4 : -3;
		bac = Math.max(0, Math.min(7, bac + buoc));
		ra.push(60 + GAM[bac]);
	}
	ra.push(r() < 0.5 ? 60 : 72);
	return ra;
}

/** Kết quả kiểm tra: { dung (số nốt đúng), dat (đúng hết), chu ("✓ Đô · ✗ Mi (bạn nhập Fa) …") }. */
export function cham(cau, nhap) {
	let dung = 0;
	const dau = cau.map((m, i) => {
		const ok = nhap[i] === m;
		if (ok) dung++;
		return `${ok ? '✓' : '✗'} ${ten(m)}${ok ? '' : ` (bạn nhập ${ten(nhap[i])})`}`;
	});
	const dat = dung === cau.length;
	return { dung, dat, chu: `${dat ? 'Hoàn toàn chính xác! ' : `Đúng ${dung}/${cau.length} nốt. `}${dau.join(' · ')}` };
}

export const veChep = () =>
	`<div class="oz-chep oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Cấp độ <select data-k="cap">${Object.entries(CAP)
		.map(([k, v]) => `<option value="${k}">${v.ten}</option>`)
		.join('')}</select></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="moi">Câu mới</button>` +
	`<button type="button" class="oz-btn" data-act="nghe">Nghe lại</button>` +
	`<button type="button" class="oz-btn" data-act="chu-am">Nghe chủ âm Đô</button></div>` +
	veTrangThaiMidi() +
	`<p class="oz-stats oz-chep-nhap" aria-live="polite"></p>` +
	`<div class="oz-phim-cuon">${veBanPhim({ thap: THAP, cao: CAO }).svg}</div>` +
	`<p class="oz-stats oz-phim-ten" aria-live="polite">Bấm vào phím để nhập nốt.</p>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="xoa">Xóa nốt cuối</button>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="kiem">Kiểm tra</button></div>` +
	`<p class="oz-feedback" aria-live="polite">${DAU}</p><div class="oz-chep-hinh"></div>` +
	`<p class="oz-stats oz-chep-so"></p>` +
	`<noscript data-sinh><p>Chép giai điệu cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chon = goc.querySelector('[data-k="cap"]');
	const oNhap = goc.querySelector('.oz-chep-nhap');
	const phanHoi = goc.querySelector('.oz-feedback');
	const hinh = goc.querySelector('.oz-chep-hinh');
	const so = goc.querySelector('.oz-chep-so');
	let cau = null;
	let nhap = [];
	let daKiem = false;
	const luot = { dat: 0, n: 0 };
	const hienNhap = () => {
		oNhap.textContent = cau ? `Đã nhập ${nhap.length}/${cau.length}: ${nhap.length ? nhap.map(ten).join(' – ') : '(chưa có)'}` : '';
	};
	const them = (m) => {
		if (!cau || daKiem || nhap.length >= cau.length) return;
		nhap.push(m);
		hienNhap();
	};
	ganBanPhim(goc.querySelector('svg.oz-phim'), { thongBao: goc.querySelector('.oz-phim-ten'), khiBam: them, midi: false });
	nghe((su) => su.loai === 'on' && goc.isConnected && them(su.m));
	const phat = async () => {
		if (!cau) return;
		const c = layNgCanh();
		if (!c) return;
		await chuanBi(cau);
		const t = c.currentTime + 0.05;
		cau.forEach((m, i) => choiNot(m, t + i * 0.6, 0.55));
	};
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	goc.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		const a = b.dataset.act;
		if (a === 'moi') {
			hinh.innerHTML = '';
			cau = taoCau(Number(chon.value));
			nhap = [];
			daKiem = false;
			bao(`Nghe, rồi nhập ${cau.length} nốt.`);
			hienNhap();
			phat();
		}
		if (a === 'nghe') phat();
		if (a === 'chu-am' && layNgCanh()) choiNot(60, undefined, 1.2);
		if (a === 'xoa' && !daKiem) {
			nhap.pop();
			hienNhap();
		}
		if (a === 'kiem' && cau) {
			if (nhap.length < cau.length) return bao(`Còn thiếu ${cau.length - nhap.length} nốt.`, 'bad');
			if (daKiem) return;
			daKiem = true;
			const kq = cham(cau, nhap);
			luot.n++;
			if (kq.dat) luot.dat++;
			kyNang('dictation', kq.dat);
			if (kq.dat) ghiNgay('melodies', 1);
			bao(kq.chu, kq.dat ? 'ok' : 'bad');
			hinh.innerHTML = soSanhChep(cau, nhap);
			so.textContent = `Lượt này: ${luot.dat}/${luot.n} câu chép đúng hoàn toàn.`;
		}
	});
	goc.dataset.san = '1';
}
