// Thành phần chạy đúng trên trình duyệt (các phép thử review D1.3 giao cho D1.7): chế độ giá nhạc thoát được bằng cách
// chạm vào nút; mở thẳng link #mục thì đích đứng đúng chỗ sau khi các khối phía trên khởi tạo; in ngay sau khi mở trang
// vẫn có đủ khuông nhạc; câu hỏi báo sai rồi đúng. Chỉ chạy khi bản build có trang dùng các khối này (bản xem, từ D1.8).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { DIST, TRINH_DUYET, dongMayChu, goc, nguCanh, trangCo } from './chung.mjs';

after(dongMayChu);
const KHUONG = trangCo('oz-abc');
const QUIZ = trangCo('oz-quiz');
const VIEC = trangCo('task-list-item oz-viec');
const khongCo = (khoi) => `bản build không có trang nào có ${khoi}`;

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: giá nhạc mở được, chạm nút "Thoát giá nhạc" thì thoát (360 px, cảm ứng)`, { skip: !KHUONG.length && khongCo('khuông nhạc') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const p = await ctx.newPage();
			await p.goto((await goc()) + KHUONG[0], { waitUntil: 'load' });
			const khung = p.locator('figure.oz-abc').first();
			await khung.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.abc-notation')?.dataset.rendered, null, { timeout: 20000 });
			const nut = khung.locator('[data-k="stand"]');
			await nut.tap();
			await p.waitForTimeout(300);
			assert.ok(await p.evaluate(() => document.documentElement.classList.contains('oz-stand-open')), 'giá nhạc không mở');
			const h = await nut.boundingBox();
			const trung = await p.evaluate(
				({ x, y, width, height }) =>
					[[x + width / 2, y + height / 2], [x + width / 2, y + 3], [x + width / 2, y + height - 3], [x + 3, y + height / 2], [x + width - 3, y + height / 2]].map(
						([a, b]) => !!document.elementFromPoint(a, b)?.closest('[data-k="stand"]'),
					),
				h,
			);
			assert.deepEqual(trung, [true, true, true, true, true], 'nút thoát bị thứ khác che (giữa nút và giữa bốn cạnh)');
			await p.touchscreen.tap(h.x + h.width / 2, h.y + h.height / 2);
			await p.waitForTimeout(300);
			assert.ok(!(await p.evaluate(() => document.documentElement.classList.contains('oz-stand-open'))), 'chạm nút mà không thoát');
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// mọi trang mẫu có khuông nhạc (review D1.7: chỉ một trang thì WebKit lệch ở trang khác mà kiểm thử không thấy)
	test(`${ten}: mở thẳng link #mục thì đích đứng đúng chỗ, ở 360 và 1280 px`, { skip: !KHUONG.length && khongCo('khuông nhạc') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			for (const trang of KHUONG)
				for (const co of [{ w: 360, h: 780, camUng: true }, { w: 1280, h: 800, camUng: false }]) {
					const ctx = await nguCanh(trinhDuyet, ten, co);
					const p = await ctx.newPage();
					// tiêu đề cuối của bài: phía trên có mọi khối của trang. Tiêu đề h2 đến h4: có trang chỉ có h3 (bat-dau/tom-tat)
					await p.goto((await goc()) + trang, { waitUntil: 'load' });
					const id = await p.evaluate(() => [...document.querySelectorAll('.sl-markdown-content :is(h2, h3, h4)[id]')].at(-1).id);
					await p.goto((await goc()) + trang + '#' + encodeURIComponent(id), { waitUntil: 'load' });
					await p.waitForTimeout(3000);
					const truoc = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
					const dung = await p.evaluate((id) => (document.getElementById(id).scrollIntoView(), document.getElementById(id).getBoundingClientRect().top), id);
					assert.ok(Math.abs(truoc - dung) <= 3, `${trang}, ${co.w} px: #${id} ở ${Math.round(truoc)} px, đúng chỗ là ${Math.round(dung)} px`);
					await ctx.close();
				}
		} finally {
			await trinhDuyet.close();
		}
	});

	// review D1.3: mạng chậm, mở link #mục rồi sang mục khác (như bấm mục lục) khi khuông còn đang tải: khi abcjs về, không
	// bị kéo về đích cũ. Trang có nhiều khuông nhất, abcjs về trễ 3 giây.
	test(`${ten}: mở link #mục rồi sang mục khác khi khuông còn đang tải thì không bị kéo về đích cũ`, { skip: !KHUONG.length && khongCo('khuông nhạc') }, async () => {
		const soKhuong = (t) => fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').split('class="oz-abc"').length;
		const trang = [...KHUONG].sort((a, b) => soKhuong(b) - soKhuong(a))[0];
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false });
			const xem = await ctx.newPage();
			await xem.goto((await goc()) + trang, { waitUntil: 'domcontentloaded' });
			const ids = await xem.evaluate(() => [...document.querySelectorAll('.sl-markdown-content :is(h2, h3, h4)[id]')].map((h) => h.id));
			await xem.close();
			const [dau, cuoi] = [ids[0], ids.at(-1)];
			const p = await ctx.newPage();
			await p.route('**/abcjs-basic-min.js', async (r) => {
				await new Promise((ok) => setTimeout(ok, 3000));
				await r.continue();
			});
			await p.goto((await goc()) + trang + '#' + encodeURIComponent(cuoi), { waitUntil: 'domcontentloaded' });
			await p.waitForTimeout(500);
			await p.evaluate((id) => (location.hash = id), dau);
			await p.waitForTimeout(5000);
			const truoc = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, dau);
			const dung = await p.evaluate((id) => (document.getElementById(id).scrollIntoView(), document.getElementById(id).getBoundingClientRect().top), dau);
			assert.ok(Math.abs(truoc - dung) <= 3, `${trang}: #${dau} ở ${Math.round(truoc)} px, đúng chỗ là ${Math.round(dung)} px (bị kéo về #${cuoi}?)`);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: câu hỏi báo sai rồi đúng, kèm giải thích`, { skip: !QUIZ.length && khongCo('câu hỏi') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false });
			const p = await ctx.newPage();
			await p.goto((await goc()) + QUIZ[0], { waitUntil: 'load' });
			const quiz = p.locator('.oz-quiz').first();
			await quiz.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-quiz button'), null, { timeout: 20000 });
			const cau = JSON.parse(await quiz.getAttribute('data-quiz'))[0];
			const sai = cau.opts.find((o) => !o.ok);
			const dung = cau.opts.find((o) => o.ok);
			const hop = quiz.locator('.oz-quiz-q').first();
			// nút của một đáp án: so HTML của nút với HTML của đáp án (thứ tự nút trộn mỗi lần)
			const bam = (t) =>
				hop.evaluate((el, t) => {
					const mau = document.createElement('div');
					mau.innerHTML = t;
					[...el.querySelectorAll('button')].find((b) => b.innerHTML === mau.innerHTML).click();
				}, t);
			if (sai) {
				await bam(sai.t);
				assert.match(await hop.locator('.oz-feedback').innerText(), /Chưa đúng/);
			}
			await bam(dung.t);
			assert.match(await hop.locator('.oz-feedback').innerText(), /^Đúng\./);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// D2-nền: chạm cả vùng nhãn (không chỉ ô 20 px) thì đánh dấu; lưu như site cũ (store.checks[trang][mã] = ngày), nên tải
	// lại trang, hay mở site cũ cùng tên miền, vẫn thấy
	test(`${ten}: danh sách việc: chạm góc nhãn thì đánh dấu, lưu như site cũ, tải lại vẫn còn`, { skip: !VIEC.length && khongCo('danh sách việc') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const p = await ctx.newPage();
			await p.goto((await goc()) + VIEC[0], { waitUntil: 'load' });
			const nhan = p.locator('li.oz-viec > .oz-viec-o').first();
			const o = nhan.locator('input');
			await nhan.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-viec-hop')?.dataset.viec, null, { timeout: 20000 });
			const h = await nhan.boundingBox();
			await p.touchscreen.tap(h.x + 4, h.y + 4);
			assert.ok(await o.isChecked(), 'chạm góc nhãn mà ô không đánh dấu');
			const ma = await o.getAttribute('data-viec');
			const kho = await p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1')).store.checks);
			assert.match(kho[VIEC[0]]?.[ma] ?? '', /^\d{4}-\d{2}-\d{2}$/, `kho checks: ${JSON.stringify(kho)}`);
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-viec-hop')?.dataset.viec, null, { timeout: 20000 });
			assert.ok(await o.isChecked(), 'tải lại trang thì mất dấu');
			await o.uncheck();
			assert.equal(await p.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('opus-zero:v1')).store.checks)), '{}', 'bỏ dấu mà kho còn');
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});
}

test('chromium: in ngay sau khi mở trang vẫn có đủ khuông nhạc (sau khoảng một giây)', { skip: !KHUONG.length && khongCo('khuông nhạc') }, async () => {
	const trinhDuyet = await chromium.launch();
	try {
		const p = await trinhDuyet.newPage({ viewport: { width: 1280, height: 300 } });
		await p.goto((await goc()) + KHUONG[0], { waitUntil: 'load' });
		await p.waitForTimeout(1500);
		await p.pdf(); // phát beforeprint: khối còn chờ được khởi tạo, khuông được vẽ đồng bộ
		const [ve, tong] = await p.evaluate(() => [document.querySelectorAll('.abc-notation[data-rendered]').length, document.querySelectorAll('.abc-notation').length]);
		assert.equal(ve, tong, `${ve}/${tong} khuông được vẽ khi in`);
	} finally {
		await trinhDuyet.close();
	}
});
