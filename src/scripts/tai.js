// Bộ tải theo nhu cầu, như ../opus-zero/docs/assets/js/loader.js: mỗi trang chỉ tải công cụ nó dùng. Khối ở xa màn
// hình khởi tạo khi người đọc cuộn tới cách nó khoảng 600 px; khối ở phía trên chỗ đang đọc (kể cả trước đích của
// một link #mục) khởi tạo ngay. Trước khi in: khởi tạo hết những khối còn chờ.
// Mỗi module có mount(el); có thể có inTruoc() để vẽ đồng bộ ngay trước khi in, và taiSan() để tải trước lúc rảnh.

/** [bộ chọn, nạp module, khởi tạo ngay dù ở xa màn hình?] */
const LUAT = [
	['.abc-notation', () => import('./abc.js'), false],
	['.oz-quiz', () => import('./quiz.js'), true],
	['.oz-listen', () => import('./nghe.js'), false],
];
const LE = 600;
const cho = new Map(); // phần tử đang chờ tới gần màn hình -> hàm khởi tạo
let io = null;

function dich() {
	try {
		const id = decodeURIComponent(location.hash.slice(1));
		return id ? document.getElementById(id) : null;
	} catch {
		return null;
	}
}

/** Phần tử ở gần hay phía trên màn hình, hoặc nằm trước đích của link #mục. */
function oTruoc(el) {
	if (el.getBoundingClientRect().top < innerHeight + LE) return true;
	const t = dich();
	return !!t && t !== el && !!(el.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}

function chay(el) {
	const fn = cho.get(el);
	if (!fn) return;
	cho.delete(el);
	io?.unobserve(el);
	fn();
}

function khiGan(el, fn) {
	if (!('IntersectionObserver' in window) || oTruoc(el)) return fn();
	cho.set(el, fn);
	io ??= new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && chay(e.target)), {
		rootMargin: `${LE}px 0px`,
	});
	io.observe(el);
}

const daNap = [];
const sauKhiTai = (fn) => (document.readyState === 'complete' ? fn() : addEventListener('load', fn, { once: true }));

function quet() {
	for (const [chon, nap, ngay] of LUAT) {
		const els = document.querySelectorAll(chon);
		if (!els.length) continue;
		let mod = null;
		const lay = () => (mod ??= nap().then((m) => (daNap.push(m), m)));
		const khoi = (el) => lay().then((m) => m.mount(el)).catch((e) => console.error(e));
		els.forEach((el) => (ngay ? khoi(el) : khiGan(el, () => khoi(el))));
		// Tải sẵn lúc trình duyệt rảnh, một lúc sau khi trang đã hiện xong, để in (Ctrl+P) có đủ khuông nhạc
		sauKhiTai(() =>
			setTimeout(() => (window.requestIdleCallback ?? setTimeout)(() => lay().then((m) => m.taiSan?.())), 3000),
		);
	}
}

// Trước khi in: khởi tạo mọi khối còn chờ; module nào đã tải xong thì vẽ đồng bộ ngay (in chỉ chụp những gì đã vẽ).
// Mở các hộp thông tin đang thu gọn để in ra đủ, in xong thì thu lại.
let moTam = [];
addEventListener('beforeprint', () => {
	[...cho.keys()].forEach(chay);
	daNap.forEach((m) => m.inTruoc?.());
	moTam = [...document.querySelectorAll('details.oz-piece-info:not([open])')];
	moTam.forEach((d) => (d.open = true));
});
addEventListener('afterprint', () => {
	moTam.forEach((d) => (d.open = false));
	moTam = [];
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', quet);
else quet();
