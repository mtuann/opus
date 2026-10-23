// Vẽ khối ```abc thành khuông nhạc kèm trình phát luyện tập (abcjs), chuyển từ ../opus-zero/docs/assets/js/abc.js:
// tốc độ (%), lặp lại, nghe từng tay, tiếng gõ nhịp; khuông tự xuống dòng trên màn hình hẹp; chế độ "giá nhạc" phóng
// to khuông và giữ màn hình sáng khi tập. Tiêu đề và chỗ giữ chiều cao đã dựng lúc build (src/plugins/thanh-phan.mjs).
// abcjs 6.7.1 (MIT) nằm trong public/vendor/, tải khi khuông đầu tiên tới gần màn hình.
const BASE = import.meta.env.BASE_URL;
const HEP = 620; // khung hẹp hơn mức này (px) thì để abcjs tự ngắt dòng cho nốt đủ to
let tai = null;

/** Tải abcjs (một lần) và CSS của trình phát. */
function taiAbcjs() {
	if (window.ABCJS) return Promise.resolve(window.ABCJS);
	tai ??= new Promise((ok, hong) => {
		const css = document.createElement('link');
		css.rel = 'stylesheet';
		css.href = `${BASE}vendor/abcjs-audio.css`;
		document.head.append(css);
		const s = document.createElement('script');
		s.src = `${BASE}vendor/abcjs-basic-min.js`;
		s.onload = () => ok(window.ABCJS);
		s.onerror = () => {
			tai = null;
			hong(new Error('không tải được abcjs'));
		};
		document.head.append(s);
	});
	return tai;
}
export const taiSan = () => taiAbcjs().catch(() => {});

/** Con trỏ: tô sáng nốt đang phát. */
function conTro() {
	let sang = [];
	const tat = () => {
		sang.forEach((e) => e.classList.remove('oz-playing'));
		sang = [];
	};
	return {
		onStart: tat,
		onFinished: tat,
		onEvent(ev) {
			tat();
			(ev.elements || []).forEach((nhom) =>
				(nhom || []).forEach((e) => {
					if (e?.classList) {
						e.classList.add('oz-playing');
						sang.push(e);
					}
				}),
			);
		},
	};
}

/** Số phách mỗi ô cho tiếng gõ nhịp (6/8 -> 2 phách, 3/8 -> 1). */
function phach(visual) {
	let m = null;
	try {
		m = visual.getMeterFraction();
	} catch {
		// không có số chỉ nhịp
	}
	const tu = m?.num || 4;
	const mau = m?.den || 4;
	if (mau === 8 && tu % 3 === 0) return Math.max(1, tu / 3);
	return Math.max(1, Math.min(12, tu));
}
function trong(n) {
	const go = [];
	const not = [];
	const luc = [];
	for (let i = 0; i < n; i++) {
		go.push('d');
		not.push(i ? 77 : 76);
		luc.push(i ? 60 : 95);
	}
	return `${go.join('')} ${not.join(' ')} ${luc.join(' ')}`;
}
/** Các bè thuộc từng khuông: [[0], [1]] với hai khuông một bè; khuông có bè chồng (&) có nhiều số. */
function beTheoKhuong(visual) {
	const dong = (visual.lines || []).find((l) => l.staff);
	if (!dong) return [];
	let i = 0;
	return dong.staff.map((st) => Array.from({ length: (st.voices || []).length || 1 }, () => i++));
}

const rong = (el) => el.clientWidth || el.parentNode?.clientWidth || 0;
const mauChu = (el) => getComputedStyle(el).color || '#000';

function ve(el) {
	const st = el._oz;
	const w = rong(el);
	const o = { responsive: 'resize', foregroundColor: mauChu(el), paddingleft: 0, paddingright: 0, add_classes: true };
	if (st.giaNhac && w) {
		o.staffwidth = Math.max(320, Math.round(w / 1.3));
		o.wrap = { minSpacing: 1.6, maxSpacing: 2.4, preferredMeasuresPerLine: 4 };
	} else if (w && w < HEP) {
		o.staffwidth = Math.max(260, Math.round(w * 1.15));
		o.wrap = { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 };
	}
	st.hep = !st.giaNhac && !!o.wrap;
	st.w = w;
	el.textContent = '';
	st.visual = window.ABCJS.renderAbc(el, st.src, o)[0];
	st.be = beTheoKhuong(st.visual);
	el.dataset.rendered = '1';
}
function thamSo(st) {
	const p = {};
	if (st.be.length === 2 && st.tay !== 'both') p.voicesOff = st.tay === 'rh' ? st.be[1] : st.be[0];
	if (st.goNhip) {
		p.drum = trong(phach(st.visual));
		p.drumBars = 1;
		p.drumIntro = 1;
	}
	return p;
}
function nap(el, nguoiDung) {
	const st = el._oz;
	st.ctrl?.setTune(st.visual, !!nguoiDung, thamSo(st)).catch(() => {
		st.audio.textContent = 'Không tải được âm thanh. Kiểm tra kết nối mạng rồi tải lại trang.';
	});
}
function veLai(el) {
	const st = el._oz;
	try {
		st.ctrl?.pause();
	} catch {
		// chưa phát
	}
	ve(el);
	nap(el, false);
}

// ---------- Chế độ giá nhạc ----------
let khoaManHinh = null;
function giuSang(bat) {
	if (bat && navigator.wakeLock?.request) {
		navigator.wakeLock
			.request('screen')
			.then((l) => (khoaManHinh = l))
			.catch(() => {});
	} else if (!bat && khoaManHinh) {
		khoaManHinh.release().catch(() => {});
		khoaManHinh = null;
	}
}
function giaNhac(el, bat) {
	const st = el._oz;
	if (bat)
		document.querySelectorAll('.oz-abc.oz-stand .abc-notation').forEach((x) => {
			if (x !== el && x._oz) giaNhac(x, false);
		});
	st.giaNhac = bat;
	st.khung.classList.toggle('oz-stand', bat);
	document.documentElement.classList.toggle('oz-stand-open', !!document.querySelector('.oz-abc.oz-stand'));
	const b = st.khung.querySelector('[data-k="stand"]');
	if (b) {
		b.setAttribute('aria-pressed', String(bat));
		b.textContent = bat ? 'Thoát giá nhạc' : 'Giá nhạc';
	}
	veLai(el);
	giuSang(bat);
	if (bat) {
		st.khung.scrollTop = 0;
		b?.focus();
	}
}
document.addEventListener('keydown', (e) => {
	if (e.key !== 'Escape') return;
	const el = document.querySelector('.oz-abc.oz-stand .abc-notation');
	if (el?._oz) giaNhac(el, false);
});
document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible' && document.querySelector('.oz-abc.oz-stand')) giuSang(true);
});

function congCu(el) {
	const st = el._oz;
	const thanh = document.createElement('div');
	thanh.className = 'oz-abc-tools';
	let h = '';
	if (st.ctrl && st.be.length === 2) {
		h +=
			'<span class="oz-hands" role="group" aria-label="Nghe tay nào">' +
			[
				['both', 'Hai tay'],
				['rh', 'Tay phải'],
				['lh', 'Tay trái'],
			]
				.map(([k, t]) => `<button type="button" data-hand="${k}" aria-pressed="${k === 'both'}">${t}</button>`)
				.join('') +
			'</span>';
	}
	if (st.ctrl) h += '<label class="oz-check"><input type="checkbox" data-k="click"> Gõ nhịp</label>';
	h +=
		'<button type="button" data-k="stand" aria-pressed="false" title="Phóng to khuông và giữ màn hình sáng khi tập (Esc để thoát)">Giá nhạc</button>';
	thanh.innerHTML = h;
	st.khung.append(thanh);
	thanh.addEventListener('click', (e) => {
		const b = e.target.closest('button');
		if (!b) return;
		if (b.dataset.hand) {
			st.tay = b.dataset.hand;
			thanh.querySelectorAll('[data-hand]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
			nap(el, true);
		} else if (b.dataset.k === 'stand') giaNhac(el, !st.giaNhac);
	});
	const c = thanh.querySelector('[data-k="click"]');
	c?.addEventListener('change', () => {
		st.goNhip = c.checked;
		nap(el, true);
	});
}

function dung(el) {
	if (el._oz) return;
	el._oz = { src: el.dataset.abc, tay: 'both', goNhip: false, giaNhac: false, khung: el.closest('.oz-abc') };
	const st = el._oz;
	ve(el);
	if (window.ABCJS.synth?.supportsAudio()) {
		st.audio = document.createElement('div');
		st.audio.className = 'abc-audio';
		st.khung.append(st.audio);
		st.ctrl = new window.ABCJS.synth.SynthController();
		st.ctrl.load(st.audio, conTro(), {
			displayPlay: true,
			displayRestart: true,
			displayProgress: true,
			displayLoop: true,
			displayWarp: true,
		});
		nap(el, false);
	}
	congCu(el);
}

export function mount(el) {
	return taiAbcjs().then(() => dung(el));
}

/** Trước khi in: vẽ đồng bộ mọi khuông chưa vẽ (abcjs đã tải). */
export function inTruoc() {
	if (!window.ABCJS) return;
	document.querySelectorAll('.abc-notation').forEach((el) => {
		if (!el._oz) dung(el);
	});
}

// Vẽ lại khi đổi sáng/tối (màu nốt) và khi khung đổi qua lại mức hẹp (xoay màn hình, đổi cỡ cửa sổ)
new MutationObserver(() =>
	setTimeout(() => document.querySelectorAll('.abc-notation').forEach((el) => el._oz && veLai(el)), 50),
).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
let hen = null;
addEventListener('resize', () => {
	clearTimeout(hen);
	hen = setTimeout(() => {
		document.querySelectorAll('.abc-notation').forEach((el) => {
			const st = el._oz;
			const w = rong(el);
			if (st && Math.abs(w - (st.w || 0)) > 40 && (st.giaNhac || w < HEP !== st.hep)) veLai(el);
		});
	}, 250);
});
