// Dùng chung cho kiểm thử trình duyệt (D1.7): máy chủ tĩnh trên dist/, trang mẫu lấy từ bản build (tools/trang-mau.mjs), ba trình duyệt,
// ba cỡ màn hình, cuộn hết trang để các khối khởi tạo. Chạy: npm run test:trinh-duyet (sau npm run build hay build:xem;
// cần trình duyệt của Playwright: npx playwright install chromium webkit firefox).
import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { moMayChu } from '../../tools/may-chu.mjs';
import { trangMau } from '../../tools/trang-mau.mjs';

export const DIST = path.resolve(import.meta.dirname, '../../dist');

/** Trang mẫu: trang chủ, trang 404, trang đã đổi trên nhánh, mỗi loại khối một trang. Chưa build thì báo lỗi. */
export const TRANG = trangMau(DIST);
export const tenTrang = (t) => t || '(trang chủ)';

/** Trang có khối cần JavaScript (khuông nhạc, câu hỏi, khối nghe) trong bản build. */
export const trangCo = (lop) => TRANG.filter((t) => !t.endsWith('.html') && fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').includes(`class="${lop}`));

/**
 * Trình duyệt được kiểm: cả ba, hay chỉ những trình duyệt ghi trong OPUS_TRINH_DUYET ("webkit", "chromium,firefox"). CI chạy
 * mỗi trình duyệt ở một job, song song (.github/actions/kiem-thu). Phép thử chỉ chạy trên Chromium (axe, in, API tìm kiếm)
 * bỏ qua khi không có Chromium: xem CO_CHROMIUM.
 */
/**
 * Service worker (dist/sw.js, D7-L3) chặn mặc định trong mọi ngữ cảnh: yêu cầu do service worker trả lời thì route() của
 * Playwright không thấy (phép thử làm chậm mẫu âm, font, abcjs), và bộ nhớ đệm của nó làm phép thử phụ thuộc nhau. Phép
 * thử dùng khi mất mạng mở ngữ cảnh với serviceWorkers: 'allow'.
 */
const chanSw = (o = {}) => ({ serviceWorkers: 'block', ...o });
const bocTrinhDuyet = (b) =>
	new Proxy(b, {
		get(t, k) {
			if (k === 'newContext' || k === 'newPage') return (o) => t[k](chanSw(o));
			const v = Reflect.get(t, k);
			return typeof v === 'function' ? v.bind(t) : v;
		},
	});
const bocLoai = (loai) =>
	new Proxy(loai, {
		get(t, k) {
			if (k === 'launch') return async (o) => bocTrinhDuyet(await t.launch(o));
			const v = Reflect.get(t, k);
			return typeof v === 'function' ? v.bind(t) : v;
		},
	});
/** Chromium với service worker chặn mặc định, cho phép thử chỉ chạy trên Chromium (axe, in, API tìm kiếm). */
export const CHROMIUM = bocLoai(chromium);
const CA_BA = { chromium: CHROMIUM, webkit: bocLoai(webkit), firefox: bocLoai(firefox) };
const CHON = (process.env.OPUS_TRINH_DUYET ?? '').split(',').map((x) => x.trim()).filter(Boolean);
for (const t of CHON) if (!(t in CA_BA)) throw new Error(`OPUS_TRINH_DUYET: không có trình duyệt "${t}" (có: ${Object.keys(CA_BA).join(', ')})`);
export const TRINH_DUYET = CHON.length ? Object.fromEntries(CHON.map((t) => [t, CA_BA[t]])) : CA_BA;
/** Lý do bỏ qua phép thử chỉ chạy trên Chromium, hay false khi có Chromium. */
export const khongChromium = !('chromium' in TRINH_DUYET) && 'OPUS_TRINH_DUYET không có chromium';

/** Cỡ màn hình theo AGENTS.md (mục Giao diện): 360 và 768 px có cảm ứng, 1280 px dùng chuột. */
export const CO = [
	{ ten: '360 px, tối', w: 360, h: 780, camUng: true, toi: true },
	{ ten: '768 px', w: 768, h: 1024, camUng: true, toi: false },
	{ ten: '1280 px', w: 1280, h: 800, camUng: false, toi: false },
];

/** Ngữ cảnh trình duyệt cho một cỡ màn hình (Firefox không có chế độ điện thoại của Playwright). */
export const nguCanh = (trinhDuyet, ten, co) =>
	trinhDuyet.newContext({
		viewport: { width: co.w, height: co.h },
		hasTouch: co.camUng,
		isMobile: ten !== 'firefox' && co.camUng,
		colorScheme: co.toi ? 'dark' : 'light',
	});

let mayChu = null;
/** Địa chỉ gốc của máy chủ tĩnh (mở một lần cho cả tiến trình kiểm thử). */
export async function goc() {
	mayChu ??= await moMayChu({ thuMuc: DIST });
	return mayChu.goc;
}
export const dongMayChu = () => mayChu?.dong();

/**
 * Chạy trong trang: các khối chưa dựng xong (khuông chưa vẽ, câu hỏi chưa có nút, khối nghe còn rỗng, bàn phím và công cụ
 * hóa biểu chưa gắn phần bấm được). `ten`: trả tên các
 * khối ấy; không thì cuộn tới khối đầu tiên còn chờ, và trả true khi không còn khối nào chờ.
 */
function khoiCho(ten) {
	const cho = [
		...[...document.querySelectorAll('.abc-notation')].filter((e) => !e.dataset.rendered),
		...[...document.querySelectorAll('.oz-quiz')].filter((e) => !e.querySelector('button')),
		...[...document.querySelectorAll('.oz-listen')].filter((e) => !e.childElementCount),
		// bàn phím, vòng quãng năm, luyện hóa biểu (D3-L1): hình dựng sẵn, script gắn phần bấm được rồi đặt data-san
		...document.querySelectorAll('.oz-ban-phim:not([data-san]), .oz-vong:not([data-san]), .oz-lhb:not([data-san])'),
		// công cụ âm học, thẻ ghi nhớ, trạng thái bài đã học (D3-L5): như trên
		...document.querySelectorAll(':is(.oz-boi-am, .oz-pho, .oz-len-day, .oz-the-nho, .oz-trang-thai-bai):not([data-san])'),
		// bốn công cụ luyện tai (D3-L6): như trên
		...document.querySelectorAll('.oz-lt:not([data-san])'),
		// máy đếm nhịp, bài đang tập, kế hoạch tập (D4-L1): như trên
		...document.querySelectorAll(':is(.oz-may-dem-nhip, .oz-bai-dang-tap, .oz-ke-hoach):not([data-san])'),
		// công cụ Luyện tập (D7-L1): như trên
		...document.querySelectorAll(
			':is(.oz-midi, .oz-chon-am, .oz-tra-phim, .oz-doc-not, .oz-chep, .oz-sao-luu, .oz-so-cao-do, .oz-choi-theo, .oz-hat-lai):not([data-san])',
		),
		// công cụ Luyện tập (D7-L2): như trên
		...document.querySelectorAll(
			':is(.oz-xay, .oz-giay-khuong, .oz-phieu, .oz-thu-am, .oz-tiet-tau, .oz-thi-tau, .oz-thi-tau-hai-tay, .oz-nhat-ky, .oz-nang-luc, .oz-tien-bo):not([data-san])',
		),
	];
	if (ten) return cho.map((e) => `${e.className} "${e.textContent.trim().slice(0, 30)}"`);
	cho[0]?.scrollIntoView({ block: 'center' });
	return !cho.length;
}

/**
 * Cuộn hết trang (để các khối ở xa khởi tạo), rồi chờ khuông vẽ xong, câu hỏi và khối nghe dựng xong. Máy chậm (WebKit
 * trên máy của GitHub) có thể bỏ lỡ một khối khi cuộn nhanh qua nó: IntersectionObserver chỉ xét lúc trình duyệt vẽ lại,
 * mà trình duyệt đang bận (như lúc nạp abcjs). Người đọc cuộn tới gần khối thì khối khởi tạo; lúc chờ, phép thử cũng
 * cuộn tới từng khối còn chờ (khuông, rồi câu hỏi, rồi khối nghe), như người đọc. Chờ quá lâu thì lỗi ghi khối nào còn
 * chờ, kèm `loi` (lỗi trên trang mà phép thử gom được); lỗi khác (trang đóng, trình duyệt hỏng) giữ nguyên.
 */
export async function cuonHet(p, loi = []) {
	const cao = await p.evaluate(() => document.documentElement.scrollHeight);
	for (let y = 0; y < cao; y += 400) {
		await p.evaluate((y) => scrollTo(0, y), y);
		await p.waitForTimeout(40);
	}
	await p.waitForFunction(khoiCho, false, { timeout: 20000, polling: 250 }).catch(async (e) => {
		if (e.name !== 'TimeoutError') throw e;
		const cho = await p.evaluate(khoiCho, true).catch(() => ['(không đọc được trang)']);
		throw new Error(`khối chưa dựng xong sau 20 giây: ${cho.join('; ')}; lỗi trên trang: ${loi.join(' | ') || 'không có'}`, { cause: e });
	});
	await p.evaluate(() => scrollTo(0, 0));
}
