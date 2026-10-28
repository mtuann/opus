// Công cụ của lô D3-L5 chạy đúng trên ba trình duyệt: chuỗi bồi âm (đổi âm cơ bản dựng lại bảng, bấm ô phát một âm), so sánh
// hệ lên dây (mỗi nút phát hai âm), phổ âm (phát sóng sin thì đường phổ được vẽ); thẻ ghi nhớ (phím cách lật thẻ, phím 2
// "nhớ", lưu store.cards ở opus-zero:v1 như site cũ); dấu "đã học" ở mục lục Nhạc lý từ store.lessons (cả bài làm ở site cũ).
// Ở 360 px: không tràn ngang, nút từ 44 px. Trang lấy thẳng từ bản build; bản build không có trang nào có công cụ thì bỏ qua.
// Chờ điều kiện (data-san, chữ đổi), không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const coTrang = (trang, lop) => {
	const f = path.join(DIST, trang, 'index.html');
	return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`class="${lop}`);
};
const AM_HOC = 'nhac-ly/am-hoc/';
const TU_DIEN = 'nhac-ly/tu-dien/';
const MUC_LUC = 'nhac-ly/';
const khongCo = (khoi) => `bản build không có ${khoi}`;

/** Đếm âm được phát: mỗi âm của phatTanSo một OscillatorNode (src/scripts/am-thanh.js). */
const DEM_AM = () => {
	window.__ozDaoDong = 0;
	for (const AC of [window.AudioContext, window.webkitAudioContext].filter(Boolean)) {
		const goc = AC.prototype.createOscillator;
		AC.prototype.createOscillator = function (...a) {
			window.__ozDaoDong += 1;
			return goc.apply(this, a);
		};
	}
};

async function moTrang(ctx, trang, chon) {
	const p = await ctx.newPage();
	await p.addInitScript(DEM_AM);
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + trang, { waitUntil: 'load' });
	const el = p.locator(chon).first();
	await el.scrollIntoViewIfNeeded();
	await p.waitForFunction((c) => document.querySelector(c)?.dataset.san, chon, { timeout: 20000 });
	return { p, el, loi };
}
const tranNgang = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const coAmThanh = (p) => p.evaluate(() => !!(window.AudioContext || window.webkitAudioContext));

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: công cụ âm học ở 360 px: không tràn, nút từ 44 px; đổi âm cơ bản dựng lại bảng; bấm thì phát âm; phổ được vẽ`, { skip: !coTrang(AM_HOC, 'oz-boi-am') && khongCo('trang Âm học') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, AM_HOC, '.oz-boi-am');
			assert.equal(await tranNgang(p), 0, 'trang tràn ngang');
			const nho = await p.evaluate(() =>
				[...document.querySelectorAll(':is(.oz-boi-am, .oz-pho, .oz-len-day) :is(button, select, label:has(input))')]
					.map((x) => [x, x.getBoundingClientRect()])
					.filter(([, r]) => r.width && (r.height < 43.5 || r.width < 43.5))
					.map(([x, r]) => `${x.tagName} "${x.textContent.trim()}" ${Math.round(r.width)}×${Math.round(r.height)}`),
			);
			assert.deepEqual(nho, [], 'vùng bấm dưới 44 px');
			await el.locator('select').selectOption('110');
			await p.waitForFunction(() => document.querySelector('.oz-boi-am-o button')?.textContent === 'La (A2)');
			const am = await coAmThanh(p);
			await el.locator('[data-nghe="3"]').click();
			if (am) await p.waitForFunction(() => window.__ozDaoDong === 1, null, { timeout: 5000 });
			const ld = p.locator('.oz-len-day');
			await ld.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-len-day')?.dataset.san);
			await ld.locator('[data-quang="2"]').click();
			if (am) await p.waitForFunction(() => window.__ozDaoDong === 3, null, { timeout: 5000 });
			const pho = p.locator('.oz-pho');
			await pho.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-pho')?.dataset.san);
			await pho.locator('[data-act="sine"]').click();
			if (am) await p.waitForFunction(() => (document.querySelector('.oz-pho-duong')?.getAttribute('d') ?? '').startsWith('M'), null, { timeout: 5000 });
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: thẻ ghi nhớ: phím cách lật thẻ, phím 2 "nhớ" lưu store.cards như site cũ; dữ liệu cũ được giữ`, { skip: !coTrang(TU_DIEN, 'oz-the-nho') && khongCo('trang Từ điển') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			await ctx.addInitScript(() => {
				if (!sessionStorage.getItem('da-dat')) {
					localStorage.setItem('opus-zero:v1', JSON.stringify({ days: {}, store: { lessons: { '/opus-zero/nhac-ly/04-nhip/': '2026-01-01' } } }));
					sessionStorage.setItem('da-dat', '1');
				}
			});
			const { p, el, loi } = await moTrang(ctx, TU_DIEN, '.oz-the-nho');
			const truoc = await el.locator('.oz-tn-truoc').textContent();
			assert.ok(truoc.trim(), 'thẻ đầu tiên có chữ');
			assert.match(await el.locator('.oz-tn-so').textContent(), /^Bộ thẻ: \d+ thuật ngữ\. Đã nhớ chắc: 0\. Cần ôn hôm nay: 0\. Thẻ mới hôm nay: 10\.$/);
			await el.focus();
			await p.keyboard.press('Space');
			await p.waitForFunction(() => !document.querySelector('.oz-tn-sau').hidden);
			await p.keyboard.press('2');
			await p.waitForFunction((t) => document.querySelector('.oz-tn-truoc').textContent !== t, truoc);
			const data = await p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1')));
			const the = data.store.cards[truoc.trim()];
			assert.equal(the.box, 1);
			assert.match(the.added, /^\d{4}-\d{2}-\d{2}$/);
			assert.match(the.due, /^\d{4}-\d{2}-\d{2}$/);
			assert.equal(data.store.lessons['/opus-zero/nhac-ly/04-nhip/'], '2026-01-01');
			assert.equal(Object.values(data.days)[0].cards, 1);
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: mục lục Nhạc lý: dấu "đã học" cạnh bài đã làm hết câu hỏi (site mới và site cũ), số bài đã xong`, { skip: !coTrang(MUC_LUC, 'oz-trang-thai-bai') && khongCo('trang mục lục Nhạc lý') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			await ctx.addInitScript(() =>
				localStorage.setItem(
					'opus-zero:v1',
					JSON.stringify({ days: {}, store: { lessons: { '/opus/nhac-ly/01-cao-do-ten-not/': '2026-10-20', '/opus-zero/nhac-ly/02-khuong-nhac-khoa/': '2026-01-05' } } }),
				),
			);
			const { p, el, loi } = await moTrang(ctx, MUC_LUC, '.oz-trang-thai-bai');
			assert.equal(await p.locator('.oz-lesson-status .oz-done').count(), 2);
			assert.match(await el.textContent(), /^Đã hoàn thành 2\/\d+ bài\./);
			assert.equal(await tranNgang(p), 0, 'trang tràn ngang');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});
}
