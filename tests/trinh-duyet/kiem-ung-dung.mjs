// Dùng khi mất mạng và sách in (D7-L3) trên ba trình duyệt: service worker (dist/sw.js) cài và điều khiển trang; trang đã
// xem mở lại được khi tắt mạng (context.setOffline), trang chưa xem thì ra trang chủ đã lưu; sách in vẽ xong mọi khuông
// rồi mới bật nút in, không lỗi; Chromium: PDF khổ A4 nhiều trang. Ngữ cảnh ở đây cho phép service worker (chung.mjs chặn
// mặc định). Chờ điều kiện, không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRINH_DUYET, dongMayChu, goc, khongChromium } from './chung.mjs';

after(dongMayChu);

const coSw = fs.existsSync(path.join(DIST, 'sw.js'));
// trang đã xem: trang có khuông nhạc (abcjs tải từ public/vendor/) nếu có trong bản build, không thì trang chủ
const TRANG_XEM = ['nhac-ly/02-khuong-nhac-khoa/', 'bat-dau/'].find((t) => fs.existsSync(path.join(DIST, t, 'index.html'))) ?? '';
const SACH = 'sach/nhac-ly-co-ban.html';
const coSach = fs.existsSync(path.join(DIST, SACH));

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: service worker điều khiển trang; tắt mạng thì trang đã xem mở lại được, trang chưa xem ra trang chủ đã lưu`, { skip: !coSw && 'bản build không có sw.js' }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await trinhDuyet.newContext({ serviceWorkers: 'allow', viewport: { width: 1280, height: 800 } });
			const p = await ctx.newPage();
			const loi = [];
			p.on('pageerror', (e) => loi.push(String(e)));
			const g = await goc();
			await p.goto(g + TRANG_XEM, { waitUntil: 'load' });
			// sw.js cài xong (lưu sẵn), kích hoạt và nhận điều khiển trang (clients.claim)
			await p.waitForFunction(() => navigator.serviceWorker?.controller?.state === 'activated', null, { timeout: 20000 });
			const phien = await p.evaluate(async () => (await caches.keys()).filter((k) => k.startsWith('opus-sw-')));
			assert.equal(phien.length, 1, 'một bộ nhớ đệm của phiên bản này');
			// xem lại khi service worker đã điều khiển: trang và tệp của nó vào bộ nhớ đệm
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(
				async ([u]) => !!(await (await caches.open((await caches.keys()).find((k) => k.startsWith('opus-sw-')))).match(u)),
				[g + TRANG_XEM],
				{ timeout: 20000, polling: 200 },
			);
			const tieuDe = await p.locator('h1').first().textContent();
			await ctx.setOffline(true);
			await p.reload({ waitUntil: 'load' });
			assert.equal(await p.locator('h1').first().textContent(), tieuDe, 'trang đã xem mở lại khi mất mạng');
			if (TRANG_XEM.startsWith('nhac-ly/')) {
				// khuông vẽ được khi mất mạng: abcjs đã lưu khi xem
				await p.locator('.abc-notation').first().scrollIntoViewIfNeeded();
				await p.waitForFunction(() => document.querySelector('.abc-notation')?.dataset.rendered, null, { timeout: 20000 });
			}
			await p.goto(g + 'chua-xem-trang-nay/', { waitUntil: 'load' });
			assert.equal(new URL(p.url()).pathname, '/opus/chua-xem-trang-nay/');
			assert.ok(await p.locator('.hero, [data-has-hero]').count(), 'trang chưa xem: trang chủ đã lưu');
			await ctx.setOffline(false);
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: sách in vẽ xong khuông rồi mới bật nút "In / Lưu PDF", không lỗi; câu hỏi kèm đáp án`, { skip: !coSach && `bản build không có ${SACH}` }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const p = await trinhDuyet.newPage({ viewport: { width: 1280, height: 800 } });
			const loi = [];
			p.on('pageerror', (e) => loi.push(String(e)));
			p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
			await p.goto((await goc()) + SACH, { waitUntil: 'load' });
			await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
			const nut = p.locator('#print');
			assert.equal(await nut.isEnabled(), true);
			assert.equal((await nut.textContent()).trim(), 'In / Lưu PDF');
			const { khuong, daVe, cau, dapAn } = await p.evaluate(() => ({
				khuong: document.querySelectorAll('.abc-notation').length,
				daVe: document.querySelectorAll('.abc-notation[data-rendered] svg').length,
				cau: document.querySelectorAll('.book-quiz').length,
				dapAn: document.querySelectorAll('.book-answers').length,
			}));
			assert.ok(khuong > 0, 'sách có khuông nhạc');
			assert.equal(daVe, khuong, 'mọi khuông đã vẽ');
			assert.ok(cau > 0 && dapAn > 0, 'có câu hỏi và đáp án');
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});
}

test('chromium: sách in ra PDF khổ A4, nhiều trang (bìa, mục lục, mỗi chương một trang mới)', { skip: khongChromium || (!coSach && `bản build không có ${SACH}`) }, async () => {
	const trinhDuyet = await TRINH_DUYET.chromium.launch();
	try {
		const p = await trinhDuyet.newPage();
		await p.goto((await goc()) + SACH, { waitUntil: 'load' });
		await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
		const soChuong = Number(await p.getAttribute('body', 'data-so-chuong'));
		await p.emulateMedia({ media: 'print' });
		assert.equal(await p.locator('.toolbar').isVisible(), false, 'thanh nút ẩn khi in');
		const pdf = (await p.pdf({ preferCSSPageSize: true })).toString('latin1');
		const trang = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
		assert.ok(trang >= soChuong + 1, `PDF ${trang} trang, sách ${soChuong} chương`);
		const khung = /\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/.exec(pdf);
		assert.ok(khung && Math.abs(Number(khung[1]) - 595.92) < 2 && Math.abs(Number(khung[2]) - 842.88) < 2, `khổ A4 (${khung?.slice(1).join(' × ')})`);
	} finally {
		await trinhDuyet.close();
	}
});

test('chromium: khi service worker điều khiển trang, tìm kiếm vẫn ra kết quả ("dan"), cả lần mở thứ hai; chỉ mục không lưu từng biến thể ?ts=', { skip: khongChromium || (!coSw && 'bản build không có sw.js') }, async () => {
	const trinhDuyet = await TRINH_DUYET.chromium.launch();
	try {
		const ctx = await trinhDuyet.newContext({ serviceWorkers: 'allow' });
		const p = await ctx.newPage();
		await p.goto(await goc(), { waitUntil: 'load' });
		await p.waitForFunction(() => navigator.serviceWorker?.controller?.state === 'activated', null, { timeout: 20000 });
		const tim = () =>
			p.evaluate(async () => {
				const pf = await import(`/opus/pagefind/pagefind.js?lan=${Math.random()}`);
				const kq = await pf.search('dan');
				return kq.results.length;
			});
		const lan1 = await tim();
		assert.ok(lan1 > 0, 'có kết quả');
		await p.reload({ waitUntil: 'load' });
		assert.equal(await tim(), lan1, 'lần mở thứ hai cùng số kết quả');
		const khoa = await p.evaluate(async () => {
			const c = await caches.open((await caches.keys()).find((k) => k.startsWith('opus-sw-')));
			return (await c.keys()).map((r) => r.url).filter((u) => u.includes('pagefind-entry.json') || u.includes('pagefind.js'));
		});
		assert.ok(khoa.every((u) => !u.includes('?')), `không lưu địa chỉ có ?…: ${khoa.join(', ')}`);
		await ctx.close();
	} finally {
		await trinhDuyet.close();
	}
});
