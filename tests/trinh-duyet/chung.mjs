// Dùng chung cho kiểm thử trình duyệt (D1.7): máy chủ tĩnh trên dist/, trang mẫu có trong bản build, ba trình duyệt,
// ba cỡ màn hình, cuộn hết trang để các khối khởi tạo. Chạy: npm run test:trinh-duyet (sau npm run build hay build:xem;
// cần trình duyệt của Playwright: npx playwright install chromium webkit firefox).
import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { moMayChu } from '../../tools/may-chu.mjs';

export const DIST = path.resolve(import.meta.dirname, '../../dist');

/** Trang mẫu: trang chủ, trang 404, và các trang thử của D1.8 khi bản build có (bản xem). */
const UNG_VIEN = ['', '404.html', 'nhac-ly/10-hop-am-ba/', 'piano/tac-pham/fur-elise/', 'nghe-nhac/bach-goldberg/'];
export const TRANG = UNG_VIEN.filter((t) => fs.existsSync(path.join(DIST, t.endsWith('.html') ? t : path.join(t, 'index.html'))));
export const tenTrang = (t) => t || '(trang chủ)';

/** Trang có khối cần JavaScript (khuông nhạc, câu hỏi, khối nghe) trong bản build. */
export const trangCo = (lop) => TRANG.filter((t) => !t.endsWith('.html') && fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').includes(`class="${lop}`));

export const TRINH_DUYET = { chromium, webkit, firefox };

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

/** Cuộn hết trang (để các khối ở xa khởi tạo), rồi chờ khuông vẽ xong, câu hỏi và khối nghe dựng xong. */
export async function cuonHet(p) {
	const cao = await p.evaluate(() => document.documentElement.scrollHeight);
	for (let y = 0; y < cao; y += 400) {
		await p.evaluate((y) => scrollTo(0, y), y);
		await p.waitForTimeout(40);
	}
	await p.waitForFunction(
		() =>
			[...document.querySelectorAll('.abc-notation')].every((e) => e.dataset.rendered) &&
			[...document.querySelectorAll('.oz-quiz')].every((e) => e.querySelector('button')) &&
			[...document.querySelectorAll('.oz-listen')].every((e) => e.childElementCount),
		null,
		{ timeout: 20000 },
	);
	await p.evaluate(() => scrollTo(0, 0));
}
