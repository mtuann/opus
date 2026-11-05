// Tra hợp âm và gam trên phím (::cong-cu{ten="piano-explorer"}, D7-L1), chuyển từ mountExplorer của
// ../opus-zero/docs/assets/js/piano.js: chọn nốt gốc (14 tên, cả tên trùng âm như Đô♯ và Rê♭) và loại (11 gam, 9 hợp âm
// của src/scripts/nhac-ly.js), các phím của lựa chọn được tô trên bàn phím Đô3–Đô6, dòng tên các nốt (tên Việt và chữ cái),
// nút "Nghe": gam phát lần lượt; hợp âm rải rồi cùng lúc. Bấm phím thì phát tiếng như bàn phím thường (ganBanPhim của
// src/scripts/ban-phim.js), phím của đàn MIDI cũng sáng lên. Chủ âm từ Fa♯ trở lên bắt đầu ở quãng tám 3, để gam nằm gọn
// trong bàn phím (như bản cũ).
// veTraPhim dựng sẵn ô lúc build, ở lựa chọn đầu (gam Đô trưởng), mount thêm phần bấm được.
import { chuanBi, choiNot, layNgCanh } from './am-thanh.js';
import { ganBanPhim } from './ban-phim.js';
import { GAM, HOP_AM, gam, hopAm, midi, midiCua, tenChu, tenChuCua, tenViet, tenVietCua } from './nhac-ly.js';
import { veBanPhim } from './ve.js';

export const GOC = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const THAP = 48;
export const CAO = 84;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Các nốt của lựa chọn (`loai`: "s:major", "c:dom7"…) từ nốt gốc `goc` ("Bb"): { nots, nhan } (hàm thuần, để kiểm thử). */
export function luaChon(goc, loai) {
	const dau = midiCua(goc + '4') >= 66 ? goc + '3' : goc + '4';
	const [k, ten] = loai.split(':');
	const nots = k === 's' ? gam(dau, ten) : hopAm(dau, ten);
	const nhan = k === 's' ? `${GAM[ten].ten} ${tenVietCua(goc)}` : `${HOP_AM[ten].ten} ${tenVietCua(goc)} (${tenChuCua(goc)}${HOP_AM[ten].ky_hieu})`;
	return { nots, m: nots.map(midi), nhan, hopAm: k === 'c' };
}

/** Dòng tên: "Gam trưởng Đô: Đô <small>C</small> – Rê <small>D</small> …" (HTML). */
export const dongTen = ({ nots, nhan }) =>
	`<strong>${esc(nhan)}:</strong> ${nots.map((n) => `${esc(tenViet(n))} <small>${esc(tenChu(n))}</small>`).join(' – ')}`;

const tuyChon = () =>
	`<optgroup label="Gam">${Object.entries(GAM)
		.map(([k, v]) => `<option value="s:${k}">${esc(v.ten)}</option>`)
		.join('')}</optgroup>` +
	`<optgroup label="Hợp âm">${Object.entries(HOP_AM)
		.map(([k, v]) => `<option value="c:${k}">${esc(v.ten)}</option>`)
		.join('')}</optgroup>`;

export function veTraPhim() {
	const dau = luaChon('C', 's:major');
	return (
		`<div class="oz-tra-phim oz-tool not-content" data-sinh data-pagefind-ignore>` +
		`<div class="oz-row"><label>Nốt gốc <select data-k="goc">${GOC.map((g) => `<option value="${g}">${esc(tenVietCua(g))} (${esc(tenChuCua(g))})</option>`).join('')}</select></label>` +
		`<label>Loại <select data-k="loai">${tuyChon()}</select></label>` +
		`<button type="button" class="oz-btn oz-btn--primary" data-act="nghe">Nghe</button></div>` +
		`<p class="oz-tra-phim-ten" aria-live="polite">${dongTen(dau)}</p>` +
		`<div class="oz-phim-cuon">${veBanPhim({ thap: THAP, cao: CAO, to: dau.m }).svg}</div>` +
		`<p class="oz-stats oz-phim-ten" aria-live="polite">Bấm vào phím để nghe và xem tên nốt.</p>` +
		`<noscript data-sinh><p>Bật JavaScript trong trình duyệt để chọn gam, hợp âm khác và nghe.</p></noscript></div>`
	);
}

export function mount(goc) {
	if (goc.dataset.san) return;
	const svg = goc.querySelector('svg.oz-phim');
	const chonGoc = goc.querySelector('[data-k="goc"]');
	const chonLoai = goc.querySelector('[data-k="loai"]');
	const ten = goc.querySelector('.oz-tra-phim-ten');
	// nhãn của hình không kèm danh sách phím được tô (đổi theo lựa chọn; dòng tên ở trên đọc các nốt)
	svg.setAttribute('aria-label', `Bàn phím piano từ Đô3 đến Đô6; các phím được tô là các nốt đang chọn`);
	const { nhay } = ganBanPhim(svg, { thongBao: goc.querySelector('.oz-phim-ten') });
	let hien = luaChon('C', 's:major');
	const capNhat = () => {
		hien = luaChon(chonGoc.value, chonLoai.value);
		for (const k of svg.querySelectorAll('[data-m]')) {
			const to = hien.m.includes(Number(k.dataset.m));
			k.classList.toggle('to', to);
			k.setAttribute('aria-label', k.dataset.ten + (to ? ', được tô' : ''));
		}
		ten.innerHTML = dongTen(hien);
	};
	chonGoc.addEventListener('change', capNhat);
	chonLoai.addEventListener('change', capNhat);
	const nut = goc.querySelector('[data-act="nghe"]');
	let dangChay = false;
	nut.addEventListener('click', async () => {
		if (dangChay) return;
		const c = layNgCanh();
		if (!c) return;
		dangChay = true;
		nut.setAttribute('aria-busy', 'true');
		try {
			await chuanBi(hien.m);
		} finally {
			nut.removeAttribute('aria-busy');
			dangChay = false;
		}
		const t = c.currentTime;
		const buoc = hien.hopAm ? 0.3 : 0.32;
		hien.m.forEach((m, i) => {
			choiNot(m, t + i * buoc, 0.6);
			setTimeout(() => nhay(m), i * buoc * 1000);
		});
		if (hien.hopAm) for (const m of hien.m) choiNot(m, t + hien.m.length * 0.3 + 0.2, 1.8, 0.13);
	});
	// trình duyệt giữ lựa chọn cũ khi tải lại trang: dựng theo lựa chọn đang hiện
	capNhat();
	goc.dataset.san = '1';
}
