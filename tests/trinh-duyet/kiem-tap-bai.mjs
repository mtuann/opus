// Nút "Tôi đang tập bài này" ở hộp tác phẩm (D6-L1, src/scripts/tap-bai.js) chạy đúng trên ba trình duyệt: bấm đủ bốn thao
// tác như practice.js cũ, ghi store.repertoire và days[hôm nay].piano ở opus-zero:v1; dữ liệu đã lưu từ site cũ hiện đúng
// trạng thái; ô bài đang tập ở mục lục Piano đọc được bài vừa thêm. Vùng bấm từ 44 px trên màn hình cảm ứng; không tràn
// ngang. Trang lấy thẳng từ bản build; bản build không có trang thì bỏ qua. Chờ điều kiện, không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

/** Một bài học có hộp tác phẩm trong bản build (ưu tiên trang của lô D6-L1). */
const TRANG = ['piano/tac-pham/minuet-sol', 'piano/tac-pham/fur-elise', 'piano/tac-pham/schumann-album'].find((t) => {
	const f = path.join(DIST, t, 'index.html');
	return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('class="oz-piece-actions ');
});
const KHOA = TRANG && TRANG + '/';
const bo = !TRANG && 'bản build không có bài học có hộp tác phẩm';
const coMucLuc = fs.existsSync(path.join(DIST, 'piano', 'index.html')) && fs.readFileSync(path.join(DIST, 'piano', 'index.html'), 'utf8').includes('class="oz-bai-dang-tap ');

async function moTrang(ctx, truocKhiMo) {
	const p = await ctx.newPage();
	if (truocKhiMo) await p.addInitScript(truocKhiMo, KHOA);
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + TRANG + '/', { waitUntil: 'load' });
	await p.waitForFunction(() => document.querySelector('.oz-piece-actions')?.dataset.san, null, { timeout: 20000 });
	return { p, hop: p.locator('.oz-piece-actions'), loi };
}
const kho = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1') || 'null'));
const nut = (hop) => hop.locator('button').evaluateAll((bs) => bs.map((b) => b.textContent + (b.disabled ? ' (tắt)' : '')));

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: tập bài, hôm nay đã tập, đã chơi được, bỏ, tập lại (ghi opus-zero:v1 như site cũ)`, { skip: bo }, async () => {
		const b = await loai.launch();
		try {
			const ctx = await nguCanh(b, ten, CO[2]);
			const { p, hop, loi } = await moTrang(ctx);
			const tieuDe = (await p.locator('h1#_top').textContent()).trim();
			assert.deepEqual(await nut(hop), ['Tôi đang tập bài này'], 'chưa tập: nút đã bật');
			await hop.getByRole('button', { name: 'Tôi đang tập bài này' }).click();
			await p.waitForFunction(() => document.querySelector('.oz-piece-actions button')?.textContent === 'Hôm nay đã tập bài này');
			let d = await kho(p);
			const r = d.store.repertoire[KHOA];
			assert.equal(r.status, 'learning');
			assert.equal(r.name, tieuDe);
			assert.equal(r.n, 0);
			assert.deepEqual(await nut(hop), ['Hôm nay đã tập bài này', 'Đã chơi được trọn bài', 'Bỏ khỏi bài đang tập']);
			// bàn phím: con trỏ ở lại trong hộp sau khi vẽ lại
			assert.ok(await p.evaluate(() => document.querySelector('.oz-piece-actions').contains(document.activeElement)));
			await hop.getByRole('button', { name: 'Hôm nay đã tập bài này' }).click();
			await p.waitForFunction(() => /Đã tập 1 buổi, lần cuối hôm nay\./.test(document.querySelector('.oz-piece-actions').textContent));
			d = await kho(p);
			const homNay = await p.evaluate(() => {
				const x = new Date();
				return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
			});
			assert.equal(d.store.repertoire[KHOA].n, 1);
			assert.equal(d.store.repertoire[KHOA].last, homNay);
			assert.equal(d.days[homNay].piano, 1);
			assert.deepEqual((await nut(hop))[0], 'Đã ghi buổi tập hôm nay (tắt)');
			await hop.getByRole('button', { name: 'Đã chơi được trọn bài' }).click();
			await p.waitForFunction(() => /Bạn đã chơi được bài này/.test(document.querySelector('.oz-piece-actions').textContent));
			assert.equal((await kho(p)).store.repertoire[KHOA].doneOn, homNay);
			await hop.getByRole('button', { name: 'Tập lại' }).click();
			await hop.getByRole('button', { name: 'Bỏ khỏi bài đang tập' }).click();
			await p.waitForFunction(() => document.querySelector('.oz-piece-actions button')?.textContent === 'Tôi đang tập bài này');
			d = await kho(p);
			assert.equal(d.store.repertoire[KHOA].status, 'removed');
			assert.equal(d.days[homNay].piano, 1, 'không ghi thêm buổi');
			// đọc lại sau khi tải lại trang
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-piece-actions')?.dataset.san);
			// đã bỏ: như bản cũ, không hiện số buổi
			assert.deepEqual(await nut(hop), ['Tôi đang tập bài này']);
			assert.doesNotMatch(await hop.textContent(), /Đã tập/);
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await b.close();
		}
	});

	test(`${ten}: dữ liệu đã lưu từ site cũ hiện đúng; mục lục Piano đọc bài vừa thêm`, { skip: bo }, async () => {
		const b = await loai.launch();
		try {
			const ctx = await nguCanh(b, ten, CO[0]);
			// dữ liệu như site cũ lưu: bài đang tập, tập lần cuối 2026-10-01
			const { p, hop, loi } = await moTrang(ctx, (k) => {
				if (!sessionStorage.getItem('oz-da-dat'))
					localStorage.setItem('opus-zero:v1', JSON.stringify({ days: {}, store: { repertoire: { [k]: { name: 'Bài cũ', since: '2026-09-01', n: 7, last: '2026-10-01', status: 'learning' } } } }));
				sessionStorage.setItem('oz-da-dat', '1');
			});
			assert.deepEqual(await nut(hop), ['Hôm nay đã tập bài này', 'Đã chơi được trọn bài', 'Bỏ khỏi bài đang tập']);
			assert.match(await hop.textContent(), /Đã tập 7 buổi, lần cuối \d+ ngày trước\./);
			// 360 px, cảm ứng: vùng bấm từ 44 px, hộp không tràn ngang
			for (const h of await hop.locator('button').evaluateAll((bs) => bs.map((x) => x.getBoundingClientRect().height))) assert.ok(h >= 44, `nút cao ${h} px`);
			assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
			if (coMucLuc) {
				await p.goto((await goc()) + 'piano/', { waitUntil: 'load' });
				await p.waitForFunction(() => document.querySelector('.oz-bai-dang-tap')?.dataset.san);
				const o = p.locator('.oz-bai-dang-tap');
				assert.equal(await o.isVisible(), true);
				assert.match(await o.textContent(), /Bài cũ · 7 buổi/);
			}
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await b.close();
		}
	});
}
