// Bốn công cụ luyện tai của lô D3-L6 (src/scripts/luyen-tai.js) chạy đúng trên ba trình duyệt: không phát tiếng trước khi
// người học bấm; "Câu mới" bằng bàn phím (Enter, phím cách) phát câu hỏi; chọn đáp án tới khi đúng (đáp án sai bị đánh dấu,
// tiêu điểm không mất), hiện hình phím đàn, lưu kỹ năng ở opus-zero:v1 như site cũ; đổi bộ thì dựng lại nút. Ở 360 px: không
// tràn ngang, nút và ô chọn từ 44 px. Trang lấy thẳng từ bản build; bản build không có trang thì bỏ qua. Chờ điều kiện, không
// chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const coTrang = (trang) => {
	const f = path.join(DIST, trang, 'index.html');
	return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('class="oz-lt ');
};
const TRANG = {
	'interval-trainer': ['luyen-tai/nghe-quang/', 'intervals', 'intervals'],
	'chord-trainer': ['luyen-tai/nghe-hop-am/', 'chords', 'chords'],
	'scale-trainer': ['luyen-tai/nghe-gam/', 'scales', 'scales'],
	'cadence-trainer': ['luyen-tai/nghe-tien-trinh/', 'cadence', 'chords'],
};

/** Đếm tiếng được phát: mỗi nốt một OscillatorNode (âm tổng hợp) hay một AudioBufferSourceNode (mẫu piano). */
const DEM_AM = () => {
	window.__ozAm = 0;
	for (const AC of [window.AudioContext, window.webkitAudioContext].filter(Boolean))
		for (const ten of ['createOscillator', 'createBufferSource']) {
			const goc = AC.prototype[ten];
			AC.prototype[ten] = function (...a) {
				window.__ozAm += 1;
				return goc.apply(this, a);
			};
		}
};

async function moTrang(ctx, trang) {
	const p = await ctx.newPage();
	await p.addInitScript(DEM_AM);
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + trang, { waitUntil: 'load' });
	const el = p.locator('.oz-lt').first();
	await el.scrollIntoViewIfNeeded();
	await p.waitForFunction(() => document.querySelector('.oz-lt')?.dataset.san, null, { timeout: 20000 });
	return { p, el, loi };
}

/** Bấm lần lượt các đáp án tới khi đúng; trả về số lần bấm. Đáp án sai: aria-disabled, tiêu điểm vẫn ở nút vừa bấm. */
async function traLoiToiKhiDung(p, el) {
	const n = await el.locator('.oz-answers button').count();
	for (let i = 0; i < n; i++) {
		const b = el.locator('.oz-answers button').nth(i);
		await b.focus();
		await p.keyboard.press('Enter');
		await p.waitForFunction(() => /\b(ok|bad)\b/.test(document.querySelector('.oz-lt .oz-feedback').className));
		if (await el.locator('.oz-feedback.ok').count()) return i + 1;
		assert.equal(await b.getAttribute('aria-disabled'), 'true');
		assert.ok(await b.evaluate((x) => x === document.activeElement), 'tiêu điểm còn ở đáp án vừa chọn');
		await p.evaluate(() => (document.querySelector('.oz-lt .oz-feedback').className = 'oz-feedback'));
	}
	throw new Error('không đáp án nào đúng');
}

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: nghe quãng ở 360 px: không tràn, vùng bấm từ 44 px; không tự phát tiếng; Enter phát câu hỏi; chọn tới khi đúng thì hiện phím và lưu`, { skip: !coTrang(TRANG['interval-trainer'][0]) && 'bản build không có trang Nghe quãng' }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, TRANG['interval-trainer'][0]);
			assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'trang tràn ngang');
			const nho = await p.evaluate(() =>
				[...document.querySelectorAll('.oz-lt :is(button, select)')]
					.map((x) => [x, x.getBoundingClientRect()])
					.filter(([, r]) => r.width && (r.height < 43.5 || r.width < 43.5))
					.map(([x, r]) => `${x.tagName} "${x.textContent.trim().slice(0, 20)}" ${Math.round(r.width)}×${Math.round(r.height)}`),
			);
			assert.deepEqual(nho, [], 'vùng bấm dưới 44 px');
			assert.equal(await p.evaluate(() => window.__ozAm), 0, 'chưa bấm thì chưa phát tiếng');
			assert.match(await el.locator('.oz-lt-so').textContent(), /^Lượt này: đúng ngay lần đầu 0\/0\. Hôm nay đã nhận đúng 0 quãng\.$/);
			await el.locator('[data-act="new"]').focus();
			await p.keyboard.press('Enter');
			assert.equal(await el.locator('.oz-feedback').textContent(), 'Quãng gì đây?');
			const am = await p.evaluate(() => !!(window.AudioContext || window.webkitAudioContext));
			if (am) await p.waitForFunction(() => window.__ozAm >= 2, null, { timeout: 5000 });
			const lan = await traLoiToiKhiDung(p, el);
			assert.match(await el.locator('.oz-feedback').textContent(), /^Đúng, quãng .+ \((4|7|12) nửa cung\)\. Bấm “Câu mới” để tiếp tục\.$/);
			assert.equal(await el.locator('.oz-lt-hinh svg.oz-phim .to').count(), 2);
			assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'hình phím làm trang tràn');
			assert.equal(await el.locator('.oz-lt-so').textContent(), `Lượt này: đúng ngay lần đầu ${lan === 1 ? 1 : 0}/1. Hôm nay đã nhận đúng 1 quãng.`);
			const data = await p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1')));
			assert.deepEqual([data.store.skills.intervals.n, data.store.skills.intervals.c], [1, lan === 1 ? 1 : 0]);
			assert.equal(Object.values(data.days)[0].intervals, 1);
			// đổi bộ: dựng lại nút, xóa câu hỏi
			await el.locator('select[data-k="set"]').selectOption('all');
			assert.equal(await el.locator('.oz-answers button').count(), 12);
			assert.equal(await el.locator('.oz-feedback').textContent(), 'Bấm “Câu mới” để nghe hai nốt.');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	for (const cc of ['chord-trainer', 'scale-trainer', 'cadence-trainer']) {
		const [trang, kyNang, ngay] = TRANG[cc];
		test(`${ten}: ${cc} ở 1280 px: phím cách phát câu hỏi, chọn tới khi đúng, lưu kỹ năng ${kyNang} và ${ngay} trong ngày`, { skip: !coTrang(trang) && `bản build không có trang ${trang}` }, async () => {
			const trinhDuyet = await loai.launch();
			try {
				const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
				const { p, el, loi } = await moTrang(ctx, trang);
				if (cc === 'chord-trainer') {
					await el.locator('select[data-k="set"]').selectOption('sevenths');
					assert.equal(await el.locator('.oz-answers button').count(), 5);
				}
				await el.locator('[data-act="new"]').focus();
				await p.keyboard.press('Space');
				await p.waitForFunction(() => /đây\?$/.test(document.querySelector('.oz-lt .oz-feedback').textContent));
				await traLoiToiKhiDung(p, el);
				await p.waitForFunction(() => document.querySelector('.oz-lt-hinh svg'));
				if (cc === 'cadence-trainer') {
					assert.match(await el.locator('.oz-lt-hinh p').textContent(), /^Hai hợp âm cuối: (V|IV) → (I|V|vi) \(xanh: hợp âm áp chót, vàng: hợp âm cuối\)$/);
					assert.ok((await el.locator('.oz-lt-hinh .to-2').count()) > 0);
				}
				const data = await p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1')));
				assert.equal(data.store.skills[kyNang].n, 1);
				assert.equal(Object.values(data.days)[0][ngay], 1);
				assert.deepEqual(loi, []);
				await ctx.close();
			} finally {
				await trinhDuyet.close();
			}
		});
	}
}
