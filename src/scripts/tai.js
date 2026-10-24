// Bộ tải theo nhu cầu, như ../opus-zero/docs/assets/js/loader.js: mỗi trang chỉ tải công cụ nó dùng. Khối ở xa màn
// hình khởi tạo khi người đọc cuộn tới cách nó khoảng 600 px; khối ở phía trên chỗ đang đọc (kể cả trước đích của
// một link #mục) khởi tạo ngay, rồi cuộn lại cho đích đứng đúng chỗ. Trước khi in: khởi tạo hết những khối còn chờ.
// Mỗi module có mount(el); có thể có inTruoc() để vẽ đồng bộ ngay trước khi in, và taiSan() để tải trước lúc rảnh.

/** [bộ chọn, nạp module, khởi tạo ngay dù ở xa màn hình?] */
const LUAT = [
	['.abc-notation', () => import('./abc.js'), false],
	['.oz-quiz', () => import('./quiz.js'), true],
	['.oz-listen', () => import('./nghe.js'), false],
];
const LE = 600;
const cho = new Map(); // phần tử đang chờ tới gần màn hình -> hàm khởi tạo (trả về promise)
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

// Người đọc tự cuộn trong lúc chờ thì thôi, không kéo về đích nữa
let lanCuon = 0;
for (const ev of ['wheel', 'touchmove', 'keydown']) addEventListener(ev, () => lanCuon++, { passive: true });

/**
 * Sau khi các khối phía trên khởi tạo xong: đích của link #mục bị đẩy đi thì cuộn lại cho đúng. Thôi, không kéo về đích
 * cũ, khi người đọc đã cuộn bằng bánh xe, chạm hay bàn phím (lanCuon), hay đã sang đích khác (bấm mục lục khi các khối
 * còn đang tải). Kéo thanh cuộn hay tìm chữ (Ctrl+F) lúc đang tải thì chưa nhận ra: vẫn bị kéo về đích cũ.
 */
function giuDich(viec, t, tren) {
	const lan = lanCuon;
	Promise.all(viec).then(() => {
		if (t && lan === lanCuon && dich() === t && Math.abs(t.getBoundingClientRect().top - tren) > 2) t.scrollIntoView();
	});
}

// Trình duyệt có overflow-anchor tự giữ chỗ đang đọc khi phần phía trên cao lên; trình duyệt không có thì tự cuộn bù
const TU_GIU = !!globalThis.CSS?.supports?.('overflow-anchor', 'auto');

function chay(el) {
	const fn = cho.get(el);
	if (!fn) return Promise.resolve();
	cho.delete(el);
	io?.unobserve(el);
	return fn();
}

function khiGan(el, fn) {
	if (!('IntersectionObserver' in window) || oTruoc(el)) return fn();
	cho.set(el, fn);
	io ??= new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && chay(e.target)), {
		rootMargin: `${LE}px 0px`,
	});
	io.observe(el);
	return Promise.resolve();
}

const daNap = [];
const sauKhiTai = (fn) => (document.readyState === 'complete' ? fn() : addEventListener('load', fn, { once: true }));
const khiRanh = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 5000 }) : setTimeout(fn, 3000));

function quet() {
	const t = dich();
	const tren = t?.getBoundingClientRect().top ?? 0;
	const ngayBayGio = [];
	for (const [chon, nap, ngay] of LUAT) {
		const els = document.querySelectorAll(chon);
		if (!els.length) continue;
		let mod = null;
		// tải hỏng (mất mạng, hay trang mở từ trước một lần deploy đổi tên file) thì lần sau thử lại
		const lay = () =>
			(mod ??= nap().then(
				(m) => (daNap.push(m), m),
				(e) => {
					mod = null;
					throw e;
				},
			));
		const khoi = (el) => {
			const truocMat = !TU_GIU && el.getBoundingClientRect().bottom <= 0;
			const cao = truocMat ? document.documentElement.scrollHeight : 0;
			return lay()
				.then((m) => m.mount(el))
				.then(() => truocMat && scrollBy(0, document.documentElement.scrollHeight - cao))
				.catch((e) => console.error(e));
		};
		els.forEach((el) => ngayBayGio.push(ngay ? khoi(el) : khiGan(el, () => khoi(el))));
		// Tải sẵn lúc trình duyệt rảnh, để in (Ctrl+P) có đủ khuông nhạc
		sauKhiTai(() => khiRanh(() => lay().then((m) => m.taiSan?.(), () => {})));
	}
	giuDich(ngayBayGio, t, tren);
}

// Bấm link #mục trong trang: khởi tạo các khối còn chờ ở phía trên đích, rồi giữ đích đúng chỗ
addEventListener('hashchange', () => {
	const t = dich();
	if (!t || !cho.size) return;
	const tren = t.getBoundingClientRect().top;
	giuDich([...cho.keys()].filter(oTruoc).map(chay), t, tren);
});

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
