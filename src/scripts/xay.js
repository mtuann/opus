// Xây gam và hợp âm (::cong-cu{ten="build"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/build.js: site yêu cầu một gam
// hay hợp âm (năm bộ bài: hợp âm ba, hợp âm bảy, gam trưởng, ba dạng gam thứ, điệu thức và ngũ cung; "Chỉ giọng ít dấu
// hóa": tám nốt gốc đầu), người học bấm chọn từng phím trên bàn phím Đô4–Si5 (bấm lại để bỏ chọn) hay trên đàn MIDI (nốt
// ngoài khung được đưa về khung, như bản cũ; ô kết nối MIDI là ::cong-cu{ten="midi-status"} trên trang), rồi kiểm tra theo
// cao độ (không phân biệt Fa♯ với Sol♭); đúng thì hiện tên nốt chính xác. Lưu như bản cũ: days[ngày].builds.
// Khác bản cũ: bàn phím dựng sẵn lúc build bằng SVG của site (veBanPhim, ganBanPhim của src/scripts/ban-phim.js: chuột,
// chạm, mũi tên và Enter); phím đã chọn được tô và đọc "đã chọn" cho máy đọc màn hình (aria-pressed).
import { choiNot, chuanBi, layNgCanh } from './am-thanh.js';
import { ganBanPhim } from './ban-phim.js';
import { nghe } from './midi.js';
import { GAM, HOP_AM, gam, hopAm, midi, tenChuCua, tenViet, tenVietCua } from './nhac-ly.js';
import { ghiNgay } from './tien-do.js';
import { veBanPhim } from './ve.js';

export const GOC = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Bb', 'Eb', 'Ab', 'F#', 'Db'];
/** Bộ bài (SETS cũ): c: hợp âm, s: gam. */
export const BO = {
	triads: { ten: 'Hợp âm ba (4 loại)', muc: ['c:maj', 'c:min', 'c:dim', 'c:aug'] },
	sevenths: { ten: 'Hợp âm bảy (5 loại)', muc: ['c:maj7', 'c:dom7', 'c:min7', 'c:hdim7', 'c:dim7'] },
	major: { ten: 'Gam trưởng', muc: ['s:major'] },
	minor: { ten: 'Ba dạng gam thứ', muc: ['s:natural', 's:harmonic', 's:melodic'] },
	modes: { ten: 'Điệu thức và ngũ cung', muc: ['s:dorian', 's:phrygian', 's:lydian', 's:mixolydian', 's:pentaMajor', 's:pentaMinor'] },
};
export const THAP = 60;
export const CAO = 83;

/** Câu hỏi (next cũ; `r`: hàm ngẫu nhiên): { kieu, loai, goc, nots (nốt {l, a, o}), ten }. */
export function taoCau(bo, itDau, r = Math.random) {
	const b = BO[bo];
	const ds = itDau ? GOC.slice(0, 8) : GOC;
	const [kieu, loai] = b.muc[Math.floor(r() * b.muc.length)].split(':');
	const g = ds[Math.floor(r() * ds.length)];
	const nots = kieu === 's' ? gam(`${g}4`, loai).slice(0, -1) : hopAm(`${g}4`, loai);
	const ten = kieu === 's' ? `${GAM[loai].ten} ${tenVietCua(g)}` : `${HOP_AM[loai].ten} ${tenVietCua(g)} (${tenChuCua(g)}${HOP_AM[loai].ky_hieu})`;
	return { kieu, loai, goc: g, nots, ten };
}

/** Cao độ (0–11) khác nhau, xếp tăng (pcs cũ). */
export const lopCaoDo = (ds) => [...new Set(ds.map((m) => ((m % 12) + 12) % 12))].sort((a, b) => a - b);

/** Kiểm tra (check cũ): `chon` là số MIDI các phím đã chọn. { dat, thieu, thua }. */
export function kiemTra(cau, chon) {
	const can = lopCaoDo(cau.nots.map(midi));
	const co = lopCaoDo(chon);
	return { dat: can.length === co.length && can.every((x, i) => x === co[i]), thieu: can.filter((x) => !co.includes(x)).length, thua: co.filter((x) => !can.includes(x)).length };
}

/** Tên các nốt của đáp án: "Đô – Mi – Sol". */
export const tenDapAn = (cau) => cau.nots.map(tenViet).join(' – ');

/** Đưa nốt từ đàn MIDI về khung bàn phím trên màn hình. */
export function veKhung(m) {
	let x = m;
	while (x < THAP) x += 12;
	while (x > CAO) x -= 12;
	return x;
}

export const veXay = () =>
	`<div class="oz-xay oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Bài tập <select data-k="bo">${Object.entries(BO)
		.map(([k, v]) => `<option value="${k}">${v.ten}</option>`)
		.join('')}</select></label>` +
	`<label><input type="checkbox" data-k="it-dau" checked> Chỉ giọng ít dấu hóa</label></div>` +
	`<p class="oz-xay-cau" aria-live="polite">Bấm “Câu khác” để có câu hỏi.</p>` +
	`<div class="oz-phim-cuon">${veBanPhim({ thap: THAP, cao: CAO }).svg}</div>` +
	`<p class="oz-stats oz-phim-ten" aria-live="polite">Bấm phím để chọn hoặc bỏ chọn (hoặc dùng mũi tên và Enter). Chọn trong một quãng tám, bắt đầu từ nốt gốc.</p>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="kiem">Kiểm tra</button>` +
	`<button type="button" class="oz-btn" data-act="xoa">Xóa chọn</button>` +
	`<button type="button" class="oz-btn" data-act="nghe">Nghe các nốt đã chọn</button>` +
	`<button type="button" class="oz-btn" data-act="khac">Câu khác</button></div>` +
	`<p class="oz-feedback" aria-live="polite"></p><p class="oz-stats oz-xay-so"></p>` +
	`<noscript data-sinh><p>Xây gam và hợp âm cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chonBo = goc.querySelector('[data-k="bo"]');
	const itDau = goc.querySelector('[data-k="it-dau"]');
	const oCau = goc.querySelector('.oz-xay-cau');
	const phanHoi = goc.querySelector('.oz-feedback');
	const so = goc.querySelector('.oz-xay-so');
	const svg = goc.querySelector('svg.oz-phim');
	const chon = new Set();
	const luot = { dung: 0, tong: 0 };
	let cau = null;
	let lanDau = true;
	let hen = 0;
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	const to = () => {
		for (const k of svg.querySelectorAll('[data-m]')) {
			const co = chon.has(Number(k.dataset.m));
			k.classList.toggle('to', co);
			k.setAttribute('aria-pressed', String(co));
		}
	};
	const doi = (m) => {
		if (chon.has(m)) chon.delete(m);
		else chon.add(m);
		to();
	};
	ganBanPhim(svg, { thongBao: goc.querySelector('.oz-phim-ten'), khiBam: doi, midi: false });
	nghe((su) => su.loai === 'on' && goc.isConnected && doi(veKhung(su.m)));
	const moi = () => {
		clearTimeout(hen);
		cau = taoCau(chonBo.value, itDau.checked);
		oCau.innerHTML = `Bấm các nốt của: <strong>${cau.ten}</strong>`;
		chon.clear();
		to();
		bao('');
		lanDau = true;
	};
	const kiem = () => {
		if (!cau) return;
		const kq = kiemTra(cau, [...chon]);
		if (kq.dat) {
			if (lanDau) {
				luot.dung++;
				luot.tong++;
			}
			lanDau = false;
			bao(`Đúng: ${tenDapAn(cau)}.`, 'ok');
			ghiNgay('builds', 1);
			clearTimeout(hen);
			hen = setTimeout(moi, 1600);
		} else {
			if (lanDau) {
				luot.tong++;
				lanDau = false;
			}
			bao(`Chưa đúng: thiếu ${kq.thieu} nốt, thừa ${kq.thua} nốt. Bấm Kiểm tra lần nữa sau khi sửa, hoặc Câu khác để xem đáp án.`, 'bad');
		}
		so.textContent = `Lượt này: đúng ngay lần đầu ${luot.dung}/${luot.tong}.`;
	};
	goc.addEventListener('click', async (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		const a = b.dataset.act;
		if (a === 'kiem') kiem();
		if (a === 'xoa') {
			chon.clear();
			to();
		}
		if (a === 'khac') {
			const truoc = cau && !phanHoi.classList.contains('ok') ? `Đáp án câu trước: ${tenDapAn(cau)}.` : phanHoi.textContent;
			moi();
			bao(truoc);
		}
		if (a === 'nghe') {
			const c = layNgCanh();
			if (!c || !chon.size) return;
			const ds = [...chon].sort((x, y) => x - y);
			await chuanBi(ds);
			const t = c.currentTime + 0.05;
			ds.forEach((m, i) => choiNot(m, t + i * 0.3, 0.6));
		}
	});
	chonBo.addEventListener('change', moi);
	itDau.addEventListener('change', moi);
	moi();
	goc.dataset.san = '1';
}
