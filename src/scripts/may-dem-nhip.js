// Máy đếm nhịp (::cong-cu{ten="metronome"}), chuyển từ ../opus-zero/docs/assets/js/metronome.js: 30–240 BPM (mặc định 80),
// nút −/+ từng nhịp, thanh kéo, tên tốc độ (Largo… Prestissimo), số phách mỗi ô nhịp (2, 3, 4, 6), nhấn phách đầu, đèn từng
// phách, gõ để đo tốc độ. Bản cũ không có phím tắt và không lưu lựa chọn; khi dừng, số phút đã chạy ghi vào days[ngày].minutes
// (opus-zero:v1, src/scripts/tien-do.js) như bản cũ.
// Nhịp chính xác: tiếng gõ được hẹn trước theo đồng hồ của AudioContext (tiengGo trong src/scripts/am-thanh.js), như bản cũ
// (lookahead scheduling): một bộ hẹn giờ 25 ms chỉ đánh thức để hẹn các tiếng trong 0,12 giây tới, lúc phát do AudioContext
// quyết, nên bộ hẹn giờ trễ vài chục ms cũng không lệch nhịp. Chỉ phát khi người dùng bấm "Bắt đầu"; mỗi lúc chỉ một máy chạy.
// Dừng khi rời trang (pagehide; bản cũ dừng khi chuyển trang trong site), không dừng khi ẩn tab, như bản cũ.
// veMayDemNhip dựng sẵn ô lúc build (src/plugins/thanh-phan.mjs), mount thêm phần bấm được.
import { layNgCanh, tiengGo } from './am-thanh.js';
import { ghiNgay } from './tien-do.js';

/** Tên tốc độ theo BPM (MARKS cũ): từ mốc trở lên. */
export const TOC_DO = [
	[40, 'Largo — rất chậm, rộng rãi'],
	[60, 'Larghetto — khá chậm'],
	[66, 'Adagio — chậm, thong thả'],
	[76, 'Andante — vừa phải, như bước đi'],
	[108, 'Moderato — vừa'],
	[120, 'Allegro — nhanh, vui'],
	[168, 'Presto — rất nhanh'],
	[200, 'Prestissimo — cực nhanh'],
];
export const BPM_THAP = 30;
export const BPM_CAO = 240;
export const BPM_DAU = 80;
export const SO_PHACH = [2, 3, 4, 6];
const PHACH_DAU = 4;
/** Hẹn trước bao nhiêu giây, và bộ hẹn giờ đánh thức mỗi bao nhiêu ms (như bản cũ). */
const HEN_TRUOC = 0.12;
const DANH_THUC = 25;

/** Tên tốc độ của bpm (markFor cũ). */
export function tenTocDo(bpm) {
	let m = TOC_DO[0][1];
	for (const [tu, ten] of TOC_DO) if (bpm >= tu) m = ten;
	return m;
}
/** BPM trong khoảng cho phép, làm tròn. */
export const gioiHan = (v) => Math.max(BPM_THAP, Math.min(BPM_CAO, Math.round(v)));
/** BPM từ các lần gõ (ms, performance.now()): trung bình khoảng cách các lần gõ trong 2,5 giây gần nhất; chưa đủ hai lần thì null. */
export function bpmTuLanGo(lanGo) {
	if (lanGo.length < 2) return null;
	const kc = lanGo.slice(1).map((t, i) => t - lanGo[i]);
	return gioiHan(60000 / (kc.reduce((s, g) => s + g, 0) / kc.length));
}

const den = (n) => '<span class="oz-beat"></span>'.repeat(n);

/** Ô máy đếm nhịp dựng sẵn (innerHTML của bản cũ, ở 80 BPM, 4 phách). data-sinh: chữ do thành phần dựng. */
export const veMayDemNhip = () =>
	`<div class="oz-may-dem-nhip oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="minus" aria-label="Giảm 1 BPM">−</button>` +
	`<span class="oz-bpm" aria-live="polite">${BPM_DAU}</span>` +
	`<button type="button" class="oz-btn" data-act="plus" aria-label="Tăng 1 BPM">+</button>` +
	`<span class="oz-stats">nhịp mỗi phút (BPM)</span></div>` +
	`<input type="range" class="oz-mdn-keo" min="${BPM_THAP}" max="${BPM_CAO}" value="${BPM_DAU}" aria-label="Tốc độ (BPM)">` +
	`<div class="oz-stats oz-mark">${tenTocDo(BPM_DAU)}</div>` +
	`<div class="oz-row"><label>Số phách mỗi ô nhịp <select data-k="beats">${SO_PHACH.map((n) => `<option${n === PHACH_DAU ? ' selected' : ''}>${n}</option>`).join('')}</select></label>` +
	`<label><input type="checkbox" data-k="accent" checked> Nhấn phách đầu</label></div>` +
	`<div class="oz-beats" aria-hidden="true">${den(PHACH_DAU)}</div>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="toggle">Bắt đầu</button>` +
	`<button type="button" class="oz-btn" data-act="tap">Gõ để đo tốc độ</button></div>` +
	`<noscript data-sinh><p>Máy đếm nhịp cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

/**
 * Lịch phát (hàm thuần, để kiểm thử): hẹn các phách từ `lich.ke` (giây) tới trước `bayGio + HEN_TRUOC`; trả về các phách
 * mới [lúc, số thứ tự trong ô nhịp, nhấn]. Mỗi phách cách nhau 60/bpm giây theo đồng hồ của AudioContext.
 */
export function henPhach(lich, bayGio, { bpm, soPhach, nhan }) {
	const ra = [];
	while (lich.ke < bayGio + HEN_TRUOC) {
		const i = lich.phach % soPhach;
		ra.push([lich.ke, i, i === 0 && nhan]);
		lich.phach++;
		lich.ke += 60 / bpm;
	}
	return ra;
}

let dangChay = null; // hàm dừng của máy đang chạy: chỉ một máy đếm nhịp chạy một lúc

export function mount(goc) {
	if (goc.dataset.san) return;
	const q = (s) => goc.querySelector(s);
	const soBpm = q('.oz-bpm');
	const keo = q('.oz-mdn-keo');
	const ten = q('.oz-mark');
	const dens = q('.oz-beats');
	const nut = q('[data-act="toggle"]');
	const chonPhach = q('[data-k="beats"]');
	const nhan = q('[data-k="accent"]');
	let bpm = BPM_DAU;
	let chay = false;
	let hen = null;
	let batDau = 0;
	let lanGo = [];
	const lich = { ke: 0, phach: 0 };
	const cho = []; // phách đã hẹn, chờ tới lúc thì sáng đèn: [lúc, số thứ tự]

	function datBpm(v) {
		bpm = gioiHan(v);
		soBpm.textContent = String(bpm);
		keo.value = String(bpm);
		ten.textContent = tenTocDo(bpm);
	}
	const veDen = () => (dens.innerHTML = den(Number(chonPhach.value)));
	function sang(i) {
		dens.querySelectorAll('.oz-beat').forEach((s, j) => {
			s.classList.toggle('on', j === i);
			s.classList.toggle('accent', j === 0 && nhan.checked);
		});
	}
	function henTiep() {
		const c = layNgCanh();
		if (!chay || !c) return;
		for (const [luc, i, manh] of henPhach(lich, c.currentTime, { bpm, soPhach: Number(chonPhach.value), nhan: nhan.checked })) {
			tiengGo(luc, manh);
			cho.push([luc, i]);
		}
		hen = setTimeout(henTiep, DANH_THUC);
	}
	function khung() {
		if (!chay) return;
		const c = layNgCanh();
		while (cho.length && cho[0][0] <= c.currentTime) sang(cho.shift()[1]);
		requestAnimationFrame(khung);
	}
	function dung() {
		if (!chay) return;
		chay = false;
		clearTimeout(hen);
		cho.length = 0;
		sang(-1);
		nut.textContent = 'Bắt đầu';
		const phut = Math.floor((Date.now() - batDau) / 60000);
		if (phut > 0) ghiNgay('minutes', phut);
		if (dangChay === dung) dangChay = null;
	}
	function batDauChay() {
		const c = layNgCanh(); // tạo trong lúc người dùng bấm, như trình duyệt đòi
		if (!c) return;
		if (dangChay) dangChay();
		dangChay = dung;
		chay = true;
		lich.phach = 0;
		lich.ke = c.currentTime + 0.08;
		batDau = Date.now();
		henTiep();
		nut.textContent = 'Dừng';
		requestAnimationFrame(khung);
	}

	goc.addEventListener('click', (e) => {
		const b = e.target.closest?.('button[data-act]');
		if (!b) return;
		const a = b.dataset.act;
		if (a === 'toggle') chay ? dung() : batDauChay();
		else if (a === 'minus') datBpm(bpm - 1);
		else if (a === 'plus') datBpm(bpm + 1);
		else if (a === 'tap') {
			const now = performance.now();
			lanGo = lanGo.filter((t) => now - t < 2500);
			lanGo.push(now);
			const v = bpmTuLanGo(lanGo);
			if (v !== null) datBpm(v);
		}
	});
	keo.addEventListener('input', () => datBpm(Number(keo.value)));
	chonPhach.addEventListener('change', () => {
		lich.phach = 0;
		veDen();
	});
	addEventListener('pagehide', dung);
	// trình duyệt giữ giá trị cũ của thanh kéo và ô chọn khi tải lại trang: đọc lại
	datBpm(Number(keo.value) || BPM_DAU);
	veDen();
	goc.dataset.san = '1';
}
