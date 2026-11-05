// Nghe mù và phiếu nghe mù (lô D8-L1, src/scripts/nghe-mu.js) chạy đúng trên ba trình duyệt: không tải hay phát bản thu
// nào trước khi người học bấm phát; chưa chọn thì nhắc; chọn đúng thì hiện đáp án, link trang tệp, lưu store.blind, kỹ năng
// style, days[ngày].styles (chỉ lần xem đầu của mỗi bản); "Bản khác" đặt lại ô; bản thu lỗi thì báo; phiếu lưu blindLog và
// vẽ bảng. Mạng tới Wikimedia bị chặn (route), để không phụ thuộc mạng (trừ WebKit: tầng media của nó không qua route). Trang lấy từ bản build; không có thì bỏ qua. Chờ
// điều kiện, không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';
import { BAN_THU, BIEN_CHE, THOI_KY_NM } from '../../src/scripts/nghe-mu.js';

after(dongMayChu);

const TRANG = 'nhan-dien/nghe-mu/';
const f = path.join(DIST, TRANG, 'index.html');
const bo = !(fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('class="oz-nghe-mu ')) && `bản build không có trang ${TRANG}`;
const kho = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1') || 'null'));
const homNay = (s) => Object.values(s?.days ?? {})[0] ?? {};

async function moTrang(ctx, chon) {
	const p = await ctx.newPage();
	const wiki = [];
	// chặn mạng tới Wikimedia: ghi lại yêu cầu, trả lỗi
	await p.route(/wikimedia\.org/, (r) => {
		wiki.push(r.request().url());
		return r.abort();
	});
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && !/wikimedia|Failed to load resource/.test(m.text()) && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + TRANG, { waitUntil: 'load' });
	const el = p.locator(chon).first();
	await el.scrollIntoViewIfNeeded();
	await p.waitForFunction((c) => document.querySelector(c)?.dataset.san, chon, { timeout: 20000 });
	return { p, el, loi, wiki };
}

/** Bản thu đang chọn: đọc nguồn mp3 trong thẻ <audio>. */
const banDangChon = async (el) => {
	const src = await el.locator('audio source').first().getAttribute('src');
	return BAN_THU.find((b) => b.nguon[0].src === src);
};

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: nghe mù ở 360 px: không tải bản thu khi chưa bấm; nhắc khi chưa chọn; bản thu lỗi thì báo; đúng thì hiện đáp án và lưu; Bản khác đặt lại`, { skip: bo }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi, wiki } = await moTrang(ctx, '.oz-nghe-mu');
			const chu = (s) => el.locator(s).textContent();
			assert.equal(await chu('.oz-nm-dem'), 'Bản thu 1/10. Tên tác phẩm được ẩn cho đến khi bạn trả lời.');
			assert.equal(await el.locator('audio source').count(), 0, 'chưa bấm thì chưa gắn nguồn');
			assert.ok(await el.locator('audio').isHidden());
			// trang không tràn ngang; ô chọn và nút cao từ 44 px trên màn hình cảm ứng
			assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
			for (const s of ['select', 'button']) {
				for (const h of await el.locator(s).evaluateAll((ds) => ds.filter((d) => d.offsetParent).map((d) => d.getBoundingClientRect().height))) assert.ok(h >= 44, `${s} cao ${h} px`);
			}
			await el.locator('[data-act="check"]').tap();
			assert.equal(await chu('.oz-feedback'), 'Hãy chọn cả thời kỳ và biên chế trước.');
			assert.equal(await kho(p), null, 'chưa trả lời thì chưa lưu');
			assert.deepEqual(wiki, [], 'chưa bấm Nghe bản thu thì không tải bản thu');
			// bấm Nghe bản thu: gắn nguồn, hiện trình phát; mạng bị chặn nên báo lỗi, gợi ý bấm Bản khác
			const cao = await el.locator('.oz-nm-phat').evaluate((d) => d.getBoundingClientRect().height);
			await el.locator('[data-act="play"]').tap();
			assert.ok(await el.locator('audio').isVisible());
			assert.ok(await el.locator('[data-act="play"]').isHidden());
			assert.ok(Math.abs((await el.locator('.oz-nm-phat').evaluate((d) => d.getBoundingClientRect().height)) - cao) <= 2, 'ô không đổi chiều cao');
			assert.equal(await el.locator('audio source').count(), 2);
			// WebKit tải âm thanh bằng tầng media riêng, không qua route của Playwright: không chặn được, nên không thử lỗi tải
			if (ten !== 'webkit') {
				await p.waitForFunction(() => document.querySelector('.oz-nghe-mu .oz-feedback').textContent.startsWith('Không phát được'), null, { timeout: 15000 });
				assert.equal(await chu('.oz-feedback'), 'Không phát được bản thu này. Bấm “Bản khác”.');
				assert.ok(wiki.length > 0, 'bấm phát thì mới tải');
			}
			const ban = await banDangChon(el);
			assert.ok(ban, 'nguồn phát là một trong mười bản thu');
			await el.locator('audio').evaluate((a) => a.pause());
			await el.locator('[data-k="period"]').selectOption(ban.thoi_ky);
			await el.locator('[data-k="ens"]').selectOption(ban.bien_che);
			await el.locator('[data-act="check"]').tap();
			assert.equal(await chu('.oz-feedback'), 'Thời kỳ: đúng. Biên chế: đúng.');
			assert.match(await el.locator('.oz-feedback').getAttribute('class'), /\bok\b/);
			const dapAn = el.locator('.oz-nm-dap-an');
			assert.ok(await dapAn.isVisible());
			assert.equal(await dapAn.locator('strong').textContent(), ban.ten);
			assert.match(await dapAn.textContent(), new RegExp(`Thời kỳ: ${THOI_KY_NM[ban.thoi_ky]}\\. Biên chế: ${BIEN_CHE[ban.bien_che].replace(/[()]/g, '\\$&')}\\.`));
			assert.equal(await dapAn.locator('a').getAttribute('href'), ban.trang);
			assert.equal(await chu('.oz-score'), 'Tổng cộng (mọi lần): đoán đúng thời kỳ 1/1.');
			// xem lại đáp án cùng bản: không tính thêm
			await el.locator('[data-act="check"]').tap();
			let s = await kho(p);
			assert.deepEqual(s.store.blind, { right: 1, total: 1 });
			assert.equal(homNay(s).styles, 1);
			assert.deepEqual([s.store.skills.style.n, s.store.skills.style.c], [1, 1]);
			// bản khác: ô đặt lại, đếm 2/10, đáp án ẩn
			await el.locator('[data-act="next"]').tap();
			assert.equal(await chu('.oz-nm-dem'), 'Bản thu 2/10. Tên tác phẩm được ẩn cho đến khi bạn trả lời.');
			assert.ok(await dapAn.isHidden());
			assert.equal(await el.locator('[data-k="period"]').inputValue(), '');
			assert.ok(await el.locator('audio').isHidden(), 'bản mới: trình phát ẩn, chờ bấm');
			assert.equal(await el.locator('audio source').count(), 0);
			await el.locator('[data-act="play"]').tap();
			const ban2 = await banDangChon(el);
			assert.notEqual(ban2.id, ban.id);
			// sai thời kỳ: tính một lần trả lời, không đúng
			const sai = Object.keys(THOI_KY_NM).find((k) => !ban2.dung.includes(k));
			await el.locator('[data-k="period"]').selectOption(sai);
			await el.locator('[data-k="ens"]').selectOption(ban2.bien_che);
			await el.locator('[data-act="check"]').tap();
			assert.equal(await chu('.oz-feedback'), 'Thời kỳ: chưa đúng. Biên chế: đúng.');
			s = await kho(p);
			assert.deepEqual(s.store.blind, { right: 1, total: 2 });
			assert.equal(homNay(s).styles, 2);
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: phiếu nghe mù ở 1280 px: thiếu tên thì nhắc; lưu thì vẽ bảng (mới trước), đếm đoán đúng; tải lại trang vẫn còn`, { skip: bo }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, el, loi } = await moTrang(ctx, '.oz-phieu-nghe-mu');
			await el.locator('[data-act="save"]').click();
			assert.equal(await el.locator('.oz-feedback').textContent(), 'Hãy ghi tên tác phẩm thật.');
			assert.equal(await el.locator('table').count(), 0);
			const ghi = async (gp, gc, t, ap) => {
				await el.locator('[data-k="g-p"]').selectOption(gp);
				await el.locator('[data-k="g-e"]').selectOption('orchestra');
				await el.locator('[data-k="g-c"]').fill(gc);
				await el.locator('[data-k="a-t"]').fill(t);
				await el.locator('[data-k="a-p"]').selectOption(ap);
				await el.locator('[data-act="save"]').click();
			};
			await ghi('classical', 'Haydn', 'Mozart, Giao hưởng số 40', 'classical');
			assert.equal(await el.locator('.oz-feedback').textContent(), 'Đã lưu.');
			assert.equal(await el.locator('[data-k="a-t"]').inputValue(), '', 'ô tên xóa sau khi lưu');
			await ghi('baroque', '', '<b>Brahms</b>, Giao hưởng số 4', 'romantic');
			assert.equal(await el.locator('.oz-nm-bang .oz-stats').textContent(), 'Đã ghi 2 lần nghe mù; đoán đúng thời kỳ 1/2.');
			const hang = await el.locator('tbody tr').evaluateAll((ds) => ds.map((d) => [...d.cells].slice(1).map((c) => c.textContent)));
			assert.deepEqual(hang, [
				['<b>Brahms</b>, Giao hưởng số 4', 'Baroque', 'Lãng mạn'],
				['Mozart, Giao hưởng số 40', 'Cổ điển (Haydn)', 'Cổ điển ✓'],
			]);
			assert.equal(await el.locator('tbody b').count(), 0, 'chữ người học gõ không thành HTML');
			const s = await kho(p);
			assert.equal(s.store.blindLog.length, 2);
			assert.deepEqual(Object.keys(s.store.blindLog[0]), ['d', 't', 'gp', 'ge', 'gc', 'ap']);
			assert.equal(homNay(s).styles, 2);
			await p.reload({ waitUntil: 'load' });
			await p.locator('.oz-phieu-nghe-mu').scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelectorAll('.oz-phieu-nghe-mu tbody tr').length === 2, null, { timeout: 20000 });
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});
}
