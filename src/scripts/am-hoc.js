// Ba công cụ của bài Âm học (D3-L5): chuỗi bồi âm (::cong-cu{ten="overtones"}), phổ âm (spectrum) và so sánh hệ lên dây
// (tuning), chuyển từ ../opus-zero/docs/assets/js/acoustics.js và spectrum.js. Các hàm dựng HTML ở đầu file chạy cả lúc
// build (src/plugins/thanh-phan.mjs dựng sẵn ô, nút, bảng bồi âm, trục của phổ: chữ thật, đọc được khi chưa có JavaScript)
// lẫn trên trình duyệt (đổi âm cơ bản thì dựng lại bảng). mount(el) thêm phần bấm được. Tiếng qua src/scripts/am-thanh.js:
// sóng sin cho bồi âm, sóng răng cưa cho hệ lên dây (như bản cũ); phổ âm nghe ở đầu ra chung của site hay micro.
// Khác bản cũ: phổ vẽ bằng SVG, nhãn trục là chữ HTML (đọc được, không nhỏ lại ở màn hình hẹp); nút micro bật và tắt được;
// số thập phân viết dấu phẩy.
import { chuanBiPiano, choiNot, dauRa, layNgCanh, phatTanSo } from './am-thanh.js';
import { giuMicro, phienThu, tanSoCoBan } from './micro.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
/** Số viết kiểu Việt: dấu phẩy thập phân. */
export const so = (x, le = 1) => x.toFixed(le).replace('.', ',');

const TEN = ['Đô', 'Đô♯', 'Rê', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'Si♭', 'Si'];
const CHU = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];

/** Nốt gần nhất của một tần số (nearest của acoustics.js cũ): tên "Mi (E4)" và độ lệch (cent, làm tròn). */
export function notGanNhat(f) {
	const m = 69 + 12 * Math.log2(f / 440);
	const r = Math.round(m);
	const i = ((r % 12) + 12) % 12;
	return { ten: `${TEN[i]} (${CHU[i]}${Math.floor(r / 12) - 1})`, cent: Math.round((m - r) * 100) };
}

// ---------- Chuỗi bồi âm ----------

/** Các âm cơ bản chọn được: [tần số, nhãn]. */
export const AM_CO_BAN = [
	[65.406, 'Đô2 (65,4 Hz)'],
	[110, 'La2 (110 Hz)'],
	[130.81, 'Đô3 (130,8 Hz)'],
];

/** 16 ô bồi âm của âm cơ bản f: số thứ tự (4 ô đầu đánh dấu sẵn), nút nghe mang tên nốt gần nhất, tần số và độ lệch. */
export function oBoiAm(f) {
	let html = '';
	for (let n = 1; n <= 16; n++) {
		const { ten, cent } = notGanNhat(f * n);
		const lech = Math.abs(cent) >= 5 ? `, lệch ${cent > 0 ? '+' : ''}${cent} cent` : '';
		html +=
			`<div class="oz-boi-am-o"><label><input type="checkbox" data-n="${n}"${n <= 4 ? ' checked' : ''}> ${n}</label>` +
			`<button type="button" class="oz-btn" data-nghe="${n}" aria-label="Nghe bồi âm ${n}: ${esc(ten)}">${esc(ten)}</button>` +
			`<small>${so(f * n)} Hz${lech}</small></div>`;
	}
	return html;
}

/** Ô công cụ chuỗi bồi âm, dựng sẵn với âm cơ bản Đô2. */
export const veBoiAm = () =>
	`<div class="oz-row"><label>Âm cơ bản <select data-k="f">${AM_CO_BAN.map(([f, t]) => `<option value="${f}">${t}</option>`).join('')}</select></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="seq">Nghe lần lượt 1–16</button>` +
	`<button type="button" class="oz-btn" data-act="mix">Nghe các bồi âm đã chọn cùng lúc</button></div>` +
	`<div class="oz-boi-am-luoi" role="group" aria-label="Các bồi âm">${oBoiAm(AM_CO_BAN[0][0])}</div>` +
	`<p class="oz-stats">Bấm vào từng ô để nghe một bồi âm. Đánh dấu nhiều ô rồi nghe cùng lúc để thấy âm sắc thay đổi: cùng một cao độ, nhưng tỉ lệ bồi âm khác nhau cho ra "giọng" khác nhau, giống như sáo và oboe.</p>`;

// ---------- So sánh hệ lên dây ----------

/** Đô4 và các nốt trên: [nhãn, tần số, độ rộng quãng]. */
export const DO4 = 261.63;
export const QUANG_LEN_DAY = [
	['5 đúng bình quân', DO4 * 2 ** (7 / 12), '700 cent'],
	['5 đúng thuần (3:2)', (DO4 * 3) / 2, '702,0 cent'],
	['3 trưởng bình quân', DO4 * 2 ** (4 / 12), '400 cent'],
	['3 trưởng thuần (5:4)', (DO4 * 5) / 4, '386,3 cent'],
];

export const veLenDay = () =>
	`<p class="oz-stats">Mỗi nút phát Đô4 cùng nốt trên trong 3 giây. Hãy nghe kỹ: quãng 3 trưởng bình quân có tiếng "rung" (phách) nhanh, còn quãng thuần đứng yên, trong veo.</p>` +
	`<div class="oz-row">${QUANG_LEN_DAY.map(([t, , c], i) => `<button type="button" class="oz-btn" data-quang="${i}">${t}<small> ${c}</small></button>`).join('')}</div>`;

// ---------- Phổ âm ----------

/** Khoảng tần số của phổ (thang log) và các vạch chia. */
export const PHO_TU = 50;
export const PHO_DEN = 5000;
const VACH = [100, 200, 500, 1000, 2000];
/** Vị trí ngang (0–1) của tần số f trên phổ. */
export const viTri = (f) => Math.log(f / PHO_TU) / Math.log(PHO_DEN / PHO_TU);
/** Khung vẽ của phổ: rộng 720, cao 240 (đơn vị của viewBox; hình co giãn theo khung). */
const R = 720;
const C = 240;

export const PHO_GOI_Y =
	'Trục ngang: tần số (thang log, 50–5000 Hz); trục dọc: cường độ. Các vạch mờ đánh dấu bồi âm 1, 2, 3… của âm cơ bản được phát hiện.';

export const vePho = () =>
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="mic">Bật micro</button>` +
	`<button type="button" class="oz-btn" data-act="piano">Phát Đô3: piano mẫu</button>` +
	`<button type="button" class="oz-btn" data-act="synth">Phát Đô3: âm tổng hợp</button>` +
	`<button type="button" class="oz-btn" data-act="sine">Phát Đô3: sóng sin</button></div>` +
	`<div class="oz-pho-khung" role="img" aria-label="Phổ tần số">` +
	`<svg class="oz-pho-hinh" viewBox="0 0 ${R} ${C}" preserveAspectRatio="none" aria-hidden="true">` +
	VACH.map((f) => `<line class="oz-pho-vach" x1="${(R * viTri(f)).toFixed(1)}" x2="${(R * viTri(f)).toFixed(1)}" y1="0" y2="${C}"/>`).join('') +
	`<g class="oz-pho-boi"></g><path class="oz-pho-duong" d=""/></svg>` +
	VACH.map((f) => `<span class="oz-pho-nhan" style="left:${(100 * viTri(f)).toFixed(2)}%">${f >= 1000 ? f / 1000 + 'k' : f}</span>`).join('') +
	`</div><p class="oz-stats oz-pho-tin" aria-live="polite">${PHO_GOI_Y}</p>`;

// tìm cao độ dùng chung với các công cụ micro của trang Luyện tập (D7-L1): ở src/scripts/micro.js
export { tanSoCoBan };

/** Đường phổ (thuộc tính d của path) từ cường độ theo dB của từng dải (getFloatFrequencyData). */
export function duongPho(data, rate, fftSize) {
	let d = '';
	for (let i = 1; i < data.length; i++) {
		const f = (i * rate) / fftSize;
		if (f < PHO_TU || f > PHO_DEN) continue;
		const y = C - Math.max(0, Math.min(1, (data[i] + 110) / 90)) * (C - 16);
		d += `${d ? 'L' : 'M'}${(R * viTri(f)).toFixed(1)} ${y.toFixed(1)}`;
	}
	return d;
}

// ---------- Phần bấm được ----------

function mountBoiAm(goc) {
	const luoi = goc.querySelector('.oz-boi-am-luoi');
	const chon = goc.querySelector('[data-k="f"]');
	const f = () => Number(chon.value);
	chon.addEventListener('change', () => (luoi.innerHTML = oBoiAm(f())));
	goc.addEventListener('click', (e) => {
		const nut = e.target.closest('button');
		if (!nut) return;
		const c = layNgCanh();
		if (!c) return;
		const t = c.currentTime + 0.05;
		if (nut.dataset.nghe) return phatTanSo(f() * Number(nut.dataset.nghe), { luc: t, dai: 1.2, am: 0.2 });
		if (nut.dataset.act === 'seq') for (let n = 1; n <= 16; n++) phatTanSo(f() * n, { luc: t + (n - 1) * 0.45, dai: 0.5, am: 0.18 });
		if (nut.dataset.act === 'mix') {
			const ns = [...luoi.querySelectorAll('input:checked')].map((x) => Number(x.dataset.n));
			for (const n of ns) phatTanSo(f() * n, { luc: t, dai: 2.2, am: ((0.25 / Math.max(1, ns.length)) / Math.sqrt(n)) * 2 });
		}
	});
}

function mountLenDay(goc) {
	goc.addEventListener('click', (e) => {
		const nut = e.target.closest('button[data-quang]');
		const c = nut && layNgCanh();
		if (!c) return;
		const t = c.currentTime + 0.05;
		phatTanSo(DO4, { luc: t, dai: 3, am: 0.16, loai: 'sawtooth' });
		phatTanSo(QUANG_LEN_DAY[Number(nut.dataset.quang)][1], { luc: t, dai: 3, am: 0.16, loai: 'sawtooth' });
	});
}

function mountPho(goc) {
	const svg = goc.querySelector('.oz-pho-hinh');
	const duong = svg.querySelector('.oz-pho-duong');
	const boi = svg.querySelector('.oz-pho-boi');
	const tin = goc.querySelector('.oz-pho-tin');
	const nutMic = goc.querySelector('[data-act="mic"]');
	let phan = null; // AnalyserNode đang vẽ
	let nghe = null; // AnalyserNode gắn vào đầu ra chung của site
	let mic = null; // { luong, phan, nha }
	let choMic = null; // đang chờ micro mở: { huy }
	let raf = 0;
	let du = null;
	let song = null;
	const ve = () => {
		if (!phan || !goc.isConnected) return;
		if (!du || du.length !== phan.frequencyBinCount) [du, song] = [new Float32Array(phan.frequencyBinCount), new Float32Array(phan.fftSize)];
		phan.getFloatFrequencyData(du);
		phan.getFloatTimeDomainData(song);
		const rate = phan.context.sampleRate;
		duong.setAttribute('d', duongPho(du, rate, phan.fftSize));
		const f0 = tanSoCoBan(song.subarray(0, 2048), rate);
		if (f0 > 40 && f0 < 2000) {
			let v = '';
			for (let h = 1; h <= 16 && f0 * h < PHO_DEN; h++) {
				const x = (R * viTri(f0 * h)).toFixed(1);
				v += `<line x1="${x}" x2="${x}" y1="14" y2="${C}"/>`;
			}
			boi.innerHTML = v;
			tin.textContent = `Âm cơ bản khoảng ${so(f0)} Hz. Các vạch nét đứt là bồi âm 1, 2, 3… Hãy so độ cao của các đỉnh giữa piano, âm tổng hợp và sóng sin.`;
		}
		raf = requestAnimationFrame(ve);
	};
	const chay = (a) => {
		phan = a;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(ve);
	};
	const taoPhan = (c) => {
		const a = c.createAnalyser();
		a.fftSize = 8192;
		a.smoothingTimeConstant = 0.6;
		return a;
	};
	const tatMic = () => {
		if (!mic) return;
		mic.luong.getTracks().forEach((t) => t.stop());
		mic.nha();
		phienThu(false);
		if (phan === mic.phan) phan = null;
		mic = null;
		nutMic.textContent = 'Bật micro';
	};
	goc.addEventListener('click', async (e) => {
		const nut = e.target.closest('button[data-act]');
		const c = nut && layNgCanh();
		if (!c) return;
		const viec = nut.dataset.act;
		if (viec === 'mic') {
			if (mic) return tatMic();
			if (choMic) return;
			// mỗi lúc một công cụ dùng micro: nhận lượt trước (công cụ khác thôi nghe, đặt Audio Session về playback), rồi mới
			// đặt Audio Session thu và phát (Safari trên iPhone; AGENTS.md, Sau D3-L1; src/scripts/micro.js) và mở micro
			const cho = (choMic = { huy: false });
			const nha = giuMicro(() => {
				cho.huy = true;
				tatMic();
			});
			phienThu(true);
			try {
				const luong = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
				// công cụ khác nhận micro trong lúc chờ người dùng cho phép: đóng luồng vừa mở
				if (cho.huy) return void luong.getTracks().forEach((t) => t.stop());
				const a = taoPhan(c);
				c.createMediaStreamSource(luong).connect(a);
				mic = { luong, phan: a, nha };
				nutMic.textContent = 'Tắt micro';
				chay(a);
			} catch {
				nha();
				if (!cho.huy) {
					phienThu(false);
					tin.textContent = 'Không mở được micro.';
				}
			} finally {
				choMic = null;
			}
			return;
		}
		if (!nghe) {
			nghe = taoPhan(c);
			dauRa().connect(nghe);
		}
		chay(nghe);
		if (viec === 'piano') {
			await chuanBiPiano([48]);
			choiNot(48, c.currentTime + 0.05, 2.5, 0.3, 'piano');
		}
		if (viec === 'synth') choiNot(48, c.currentTime + 0.05, 2.5, 0.3, 'tong-hop');
		if (viec === 'sine') phatTanSo(130.81, { luc: c.currentTime + 0.05, dai: 2.5, am: 0.3 });
	});
	addEventListener('pagehide', () => {
		cancelAnimationFrame(raf);
		tatMic();
	});
}

export function mount(goc) {
	if (goc.dataset.san) return;
	goc.dataset.san = '1';
	if (goc.classList.contains('oz-boi-am')) mountBoiAm(goc);
	else if (goc.classList.contains('oz-len-day')) mountLenDay(goc);
	else if (goc.classList.contains('oz-pho')) mountPho(goc);
}
