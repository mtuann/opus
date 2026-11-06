// Danh mục tác phẩm (D6-L11, ::danh-muc-tac-pham; src/scripts/danh-muc.js) chạy đúng trên ba trình duyệt: chọn chặng, thời
// kỳ, tác giả, loại thì chỉ còn mục hợp mọi lựa chọn, dòng đếm đổi theo; không mục nào hợp thì hiện dòng báo; "Bỏ lọc" hiện
// lại hết. Ô chọn và nút từ 44 px trên màn hình cảm ứng, không tràn ngang ở 360 px. Trang lấy thẳng từ bản build; bản build
// không có trang mục lục nào có danh mục thì bỏ qua. Chờ điều kiện, không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const coDanhMuc = (t) => {
	const f = path.join(DIST, t, 'index.html');
	return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('class="oz-danh-muc"');
};
const NGHE = coDanhMuc('nghe-nhac') && 'nghe-nhac';
const BAI_HOC = coDanhMuc('piano/tac-pham') && 'piano/tac-pham';
const bo = !NGHE && !BAI_HOC && 'bản build không có trang mục lục có danh mục tác phẩm';

async function moTrang(ctx, trang) {
	const p = await ctx.newPage();
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + trang + '/', { waitUntil: 'load' });
	await p.waitForFunction(() => document.querySelector('.oz-danh-muc')?.dataset.san, null, { timeout: 20000 });
	return { p, loi };
}
/** Số mục đang hiện và chữ của dòng đếm. */
const dangHien = (p) =>
	p.evaluate(() => ({
		n: [...document.querySelectorAll('.oz-dm-ds > li')].filter((li) => !li.hidden && li.offsetParent !== null).length,
		tong: document.querySelectorAll('.oz-dm-ds > li').length,
		dem: document.querySelector('.oz-dm-dem').textContent,
		trong: !document.querySelector('.oz-dm-trong').hidden,
	}));
/** Các giá trị (khác "Tất cả") của một ô chọn. */
const giaTri = (p, loc) => p.locator(`select[data-loc="${loc}"] option`).evaluateAll((os) => os.map((o) => o.value).filter(Boolean));

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: lọc danh mục theo loại, chặng, thời kỳ, tác giả; dòng đếm; bỏ lọc`, { skip: bo }, async () => {
		const b = await loai.launch();
		try {
			const ctx = await nguCanh(b, ten, CO[2]);
			const { p, loi } = await moTrang(ctx, NGHE || BAI_HOC);
			const dau = await dangHien(p);
			assert.equal(dau.n, dau.tong);
			assert.equal(dau.dem, `Hiện ${dau.tong} trên ${dau.tong} trang.`);
			assert.equal(await p.locator('.oz-dm-bo').isDisabled(), true);
			// chặng: chỉ bài học của chặng ấy
			const chang = (await giaTri(p, 'chang'))[0];
			await p.locator('select[data-loc="chang"]').selectOption(chang);
			const sau = await dangHien(p);
			assert.ok(sau.n > 0 && sau.n < dau.tong, `chặng ${chang}: ${sau.n}`);
			assert.equal(sau.dem, `Hiện ${sau.n} trên ${dau.tong} trang.`);
			assert.ok(
				await p.evaluate((c) => [...document.querySelectorAll('.oz-dm-ds > li:not([hidden])')].every((li) => li.dataset.chang === c && li.dataset.loai === 'bai-hoc'), chang),
			);
			assert.equal(await p.locator('.oz-dm-bo').isDisabled(), false);
			// thêm tác giả không có bài nào ở chặng ấy: không còn mục, có dòng báo
			const tacGia = await giaTri(p, 'tac-gia');
			const khong = await p.evaluate(
				([c, ds]) => ds.find((g) => ![...document.querySelectorAll('.oz-dm-ds > li')].some((li) => li.dataset.chang === c && li.dataset.tacGia === g)),
				[chang, tacGia],
			);
			await p.locator('select[data-loc="tac-gia"]').selectOption(khong);
			const rong = await dangHien(p);
			assert.equal(rong.n, 0);
			assert.equal(rong.trong, true);
			// bỏ lọc: hiện lại hết, mọi ô về "Tất cả"
			await p.locator('.oz-dm-bo').click();
			const lai = await dangHien(p);
			assert.equal(lai.n, dau.tong);
			assert.equal(lai.trong, false);
			assert.deepEqual(await p.locator('select[data-loc]').evaluateAll((s) => s.map((x) => x.value).filter(Boolean)), []);
			// thời kỳ và loại (trang nghe nhạc có ô loại)
			const thoiKy = (await giaTri(p, 'thoi-ky'))[0];
			await p.locator('select[data-loc="thoi-ky"]').selectOption(thoiKy);
			assert.ok(await p.evaluate((t) => [...document.querySelectorAll('.oz-dm-ds > li:not([hidden])')].every((li) => li.dataset.thoiKy === t), thoiKy));
			if (await p.locator('select[data-loc="loai"]').count()) {
				await p.locator('select[data-loc="loai"]').selectOption('nghe');
				const n = await dangHien(p);
				assert.ok(n.n > 0);
				assert.ok(await p.evaluate(() => [...document.querySelectorAll('.oz-dm-ds > li:not([hidden])')].every((li) => li.dataset.loai === 'nghe' && !li.dataset.chang)));
			}
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await b.close();
		}
	});

	test(`${ten}: 360 px cảm ứng: ô chọn và nút từ 44 px, không tràn ngang`, { skip: bo }, async () => {
		const b = await loai.launch();
		try {
			const ctx = await nguCanh(b, ten, CO[0]);
			for (const t of [NGHE, BAI_HOC].filter(Boolean)) {
				const { p, loi } = await moTrang(ctx, t);
				for (const h of await p.locator('.oz-dm-loc select, .oz-dm-loc button').evaluateAll((es) => es.map((e) => e.getBoundingClientRect().height)))
					assert.ok(h >= 44, `${t}: ô cao ${h} px`);
				assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${t}: tràn ngang`);
				assert.ok(await p.evaluate(() => document.querySelector('.oz-danh-muc').getBoundingClientRect().right <= innerWidth));
				assert.deepEqual(loi, []);
				await p.close();
			}
			await ctx.close();
		} finally {
			await b.close();
		}
	});
}
