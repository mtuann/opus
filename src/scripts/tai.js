// Bộ tải theo nhu cầu, như ../opus-zero/docs/assets/js/loader.js: mỗi trang chỉ tải công cụ nó dùng. Khối ở xa màn
// hình khởi tạo khi người đọc cuộn tới cách nó khoảng 600 px; khối ở phía trên chỗ đang đọc (kể cả trước đích của
// một link #mục) khởi tạo ngay, rồi cuộn lại cho đích đứng đúng chỗ. Trước khi in: khởi tạo hết những khối còn chờ.
// Mỗi module có mount(el); có thể có inTruoc() để vẽ đồng bộ ngay trước khi in, và taiSan() để tải trước lúc rảnh.

/** [bộ chọn, nạp module, khởi tạo ngay dù ở xa màn hình?] */
const LUAT = [
	['.abc-notation', () => import('./abc.js'), false],
	['.oz-quiz', () => import('./quiz.js'), true],
	['.oz-listen', () => import('./nghe.js'), false],
	['.oz-viec', () => import('./viec.js'), true],
	['.oz-placement', () => import('./placement.js'), false],
	// khởi tạo ngay: người học đánh dấu ở danh sách phía trên trước khi cuộn tới ô kết quả, chặng vẫn được lưu
	['.oz-muc-do', () => import('./muc-do.js'), true],
	// khởi tạo ngay: ô gợi ý tập ở trang chủ có gợi ý riêng thì chuyển mục của nó lên đầu, làm sớm cho đỡ xô bố cục
	['.oz-goi-y', () => import('./goi-y.js'), true],
	// bàn phím, vòng quãng năm, luyện hóa biểu (D3-L1): hình đã dựng sẵn lúc build, script chỉ thêm phần bấm được
	['.oz-ban-phim', () => import('./ban-phim.js'), false],
	['.oz-vong', () => import('./vong-quang-nam.js'), false],
	['.oz-lhb', () => import('./luyen-hoa-bieu.js'), false],
	// công cụ âm học, thẻ ghi nhớ (D3-L5): ô đã dựng sẵn lúc build
	['.oz-boi-am, .oz-pho, .oz-len-day', () => import('./am-hoc.js'), false],
	['.oz-the-nho', () => import('./the-nho.js'), false],
	// bốn công cụ luyện tai (D3-L6): ô dựng sẵn lúc build
	['.oz-lt', () => import('./luyen-tai.js'), false],
	// đoán phong cách (D5-L3): ô dựng sẵn; script tải abcjs, vẽ khuông ẩn và trình phát
	['.oz-nd', () => import('./nhan-dien.js'), false],
	// khởi tạo ngay: dấu "đã học" ở mục lục, người đọc thấy ngay khi mở trang
	['.oz-trang-thai-bai', () => import('./trang-thai-bai.js'), true],
	// máy đếm nhịp (D4-L1): ô dựng sẵn, script thêm phần bấm được
	['.oz-may-dem-nhip', () => import('./may-dem-nhip.js'), false],
	// khởi tạo ngay: bài đang tập (đầu mục lục Piano: ô ẩn hiện ra khi có bài) và kế hoạch tập theo dữ liệu đã lưu, để ô đổi
	// trước khi người đọc cuộn tới
	['.oz-bai-dang-tap', () => import('./bai-dang-tap.js'), true],
	['.oz-ke-hoach', () => import('./ke-hoach.js'), true],
	// công cụ Luyện tập (D7-L1). Khởi tạo ngay: ô MIDI (tự kết nối lại, để các công cụ khác trên trang nhận nốt từ đàn) và
	// ô sao lưu (tóm tắt dữ liệu đang lưu), như loader.js cũ
	['.oz-midi', () => import('./midi.js'), true],
	['.oz-sao-luu', () => import('./sao-luu.js'), true],
	['.oz-chon-am', () => import('./chon-am.js'), false],
	['.oz-tra-phim', () => import('./tra-phim.js'), false],
	['.oz-doc-not', () => import('./doc-not.js'), false],
	['.oz-chep', () => import('./chep.js'), false],
	['.oz-so-cao-do', () => import('./so-cao-do.js'), false],
	['.oz-choi-theo, .oz-hat-lai', () => import('./choi-theo.js'), false],
	// công cụ Luyện tập (D7-L2). Khởi tạo ngay: nhật ký (chuỗi ngày, việc hôm nay ở đầu trang Nhật ký)
	['.oz-xay', () => import('./xay.js'), false],
	['.oz-giay-khuong', () => import('./giay-khuong.js'), false],
	['.oz-phieu', () => import('./phieu.js'), false],
	['.oz-thu-am', () => import('./thu-am.js'), false],
	['.oz-tiet-tau', () => import('./tiet-tau.js'), false],
	['.oz-thi-tau', () => import('./thi-tau.js'), false],
	['.oz-thi-tau-hai-tay', () => import('./thi-tau-hai-tay.js'), false],
	['.oz-nhat-ky', () => import('./nhat-ky.js'), true],
	['.oz-nang-luc, .oz-tien-bo', () => import('./nang-luc.js'), false],
	// nghe mù và phiếu nghe mù (D8-L1): ô dựng sẵn; bản thu chỉ tải khi người học bấm phát
	['.oz-nghe-mu, .oz-phieu-nghe-mu', () => import('./nghe-mu.js'), false],
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

// Người đọc tự cuộn trong lúc chờ thì thôi, không kéo về đích nữa. Bấm chuột hay chạm (pointerdown, mousedown), như lúc
// bắt đầu kéo thanh cuộn, cũng tính là tự cuộn.
let lanCuon = 0;
for (const ev of ['wheel', 'touchmove', 'keydown', 'pointerdown', 'mousedown']) addEventListener(ev, () => lanCuon++, { passive: true });

/**
 * Sau khi các khối phía trên khởi tạo xong: đích của link #mục bị đẩy đi thì cuộn lại cho đúng. Làm lại một lần nữa khi
 * font tải xong: font về sau các khối (mạng chậm) làm chữ phía trên xuống dòng khác, đích lại bị đẩy đi, ở cả trình duyệt
 * có overflow-anchor (đo ở bản build: font về trễ 2,5 giây thì đích lệch tới hàng trăm px, ở cả ba trình duyệt). Thôi,
 * không kéo về đích cũ, khi người đọc đã tự cuộn (bánh xe, chạm, bàn phím, bấm chuột hay chạm vào thanh cuộn: lanCuon), hay
 * đã sang đích khác (bấm mục lục khi các khối còn đang tải). Cuộn không qua các sự kiện ấy (tìm chữ bằng Ctrl+F, máy đọc
 * màn hình di chuyển trong trang) lúc đang tải thì chưa nhận ra: vẫn bị kéo về đích cũ.
 */
function giuDich(viec, t, tren) {
	const lan = lanCuon;
	const giu = () => {
		if (t && lan === lanCuon && dich() === t && Math.abs(t.getBoundingClientRect().top - tren) > 2) t.scrollIntoView();
	};
	const xong = Promise.all(viec);
	xong.then(giu);
	Promise.all([xong, document.fonts?.ready]).then(giu);
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
