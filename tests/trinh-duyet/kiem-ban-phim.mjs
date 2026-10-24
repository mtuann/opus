// Bàn phím piano, vòng quãng năm, luyện hóa biểu (D3-L1) chạy đúng trên ba trình duyệt: bấm bằng chuột, chạm, bàn phím máy
// tính; mỗi lần bấm phát đúng một nốt; tải mẫu âm piano; vùng bấm trên cảm ứng; trang không tràn ngang; trợ năng (axe) ở
// trang có các thành phần này. Trang lấy thẳng từ bản build (mọi trang có thành phần), không chỉ từ trang mẫu, để thành
// phần được kiểm cả khi trang của nó không nằm trong số trang mẫu. Bản build chưa có trang nào có thành phần thì bỏ qua.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);
const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');

/** Mọi trang của bản build (đường dẫn "nhac-ly/01-…/"), theo thứ tự chữ cái. */
const tatCa = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/'))
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];
const coLop = (lop) => tatCa.filter((t) => fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').includes(`class="${lop}`));
const BAN_PHIM = coLop('oz-ban-phim');
const VONG = coLop('oz-vong ');
const LUYEN = coLop('oz-lhb ');
/** Trang có bàn phím với phím được tô (có nút nghe). */
const BAN_PHIM_TO = BAN_PHIM.filter((t) => fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').includes('data-k="nghe"'));
const khongCo = (khoi) => `bản build không có trang nào có ${khoi}`;

/**
 * Đếm nốt được phát: mỗi nốt mẫu âm một AudioBufferSourceNode, mỗi nốt tổng hợp hai OscillatorNode (src/scripts/am-thanh.js).
 * __ozNot: mọi nốt; __ozTongHop: nốt phát âm tổng hợp (mẫu âm chưa có).
 */
const DEM_NOT = () => {
	window.__ozNot = 0;
	window.__ozTongHop = 0;
	for (const AC of [window.AudioContext, window.webkitAudioContext].filter(Boolean)) {
		const { createBufferSource: nguon, createOscillator: daoDong } = AC.prototype;
		AC.prototype.createBufferSource = function (...a) {
			window.__ozNot += 1;
			return nguon.apply(this, a);
		};
		AC.prototype.createOscillator = function (...a) {
			window.__ozNot += 0.5;
			window.__ozTongHop += 0.5;
			return daoDong.apply(this, a);
		};
	}
};
const soNot = (p) => p.evaluate(() => window.__ozNot ?? 0);
/** Số MIDI của một file mẫu âm (C4.mp3 = 60, Ds4.mp3 = 63), như MAU của src/scripts/am-thanh.js. */
const TEN_MAU = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
const midiMau = (url) => {
	const [, t, o] = /\/([A-G]s?)(\d)\.mp3$/.exec(url);
	return TEN_MAU.indexOf(t) + 12 * (Number(o) + 1);
};
const laMp3 = (url) => /\/mau-am\/piano\/[^/]+\.mp3$/.test(url);
/** Bàn phím có nhiều phím trắng nhất (kịch bản bấm đi lên): trang 1, Đô3–Đô5, 15 phím trắng. */
const BAN_PHIM_DAI = BAN_PHIM.map((t) => [t, fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').split('oz-phim-trang').length]).sort((a, b) => b[1] - a[1])[0]?.[0];
const coAmThanh = (p) => p.evaluate(() => !!(window.AudioContext || window.webkitAudioContext));

async function moTrang(ctx, trang, chon) {
	const p = await ctx.newPage();
	await p.addInitScript(DEM_NOT);
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + trang, { waitUntil: 'load' });
	const el = p.locator(chon).first();
	await el.scrollIntoViewIfNeeded();
	await p.waitForFunction((c) => document.querySelector(c)?.dataset.san, chon, { timeout: 20000 });
	return { p, el, loi };
}

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: bàn phím trên điện thoại: phím trắng từ 44 px, phím đen từ 24 px, cuộn trong khung; chạm phím thì đọc tên, phát một nốt, tải mẫu âm`, { skip: !BAN_PHIM.length && khongCo('bàn phím') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, BAN_PHIM[0], '.oz-ban-phim');
			assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'trang tràn ngang');
			const co = await el.evaluate((g) => ({
				trang: Math.min(...[...g.querySelectorAll('.oz-phim-trang')].map((k) => k.getBoundingClientRect().width)),
				den: Math.min(...[...g.querySelectorAll('.oz-phim-den')].flatMap((k) => [k.getBoundingClientRect().width, k.getBoundingClientRect().height])),
				cao: Math.min(...[...g.querySelectorAll('.oz-phim-trang')].map((k) => k.getBoundingClientRect().height)),
				tran: g.querySelector('.oz-phim-cuon').scrollWidth > g.querySelector('.oz-phim-cuon').clientWidth + 1,
				nhac: g.querySelector('.oz-phim-ten').textContent,
			}));
			// đủ 44 px thật, không nhờ sai số nửa px (CSS cộng lề của viewBox)
			assert.ok(co.trang >= 44 - 0.01 && co.cao >= 44, `phím trắng ${co.trang.toFixed(2)}×${co.cao.toFixed(1)} px`);
			assert.ok(co.den >= 24, `phím đen ${co.den.toFixed(1)} px`);
			if (co.tran) assert.match(co.nhac, /Kéo ngang để xem thêm phím\.$/);
			// chạm phần dưới của một phím trắng đang hiện trong khung (phần không có phím đen đè lên)
			const k = await el.evaluate((g) => {
				const khung = g.querySelector('.oz-phim-cuon').getBoundingClientRect();
				const ph = [...g.querySelectorAll('.oz-phim-trang')].find((x) => {
					const r = x.getBoundingClientRect();
					return r.left >= khung.left && r.right <= khung.right;
				});
				const r = ph.getBoundingClientRect();
				return { m: ph.dataset.m, ten: ph.dataset.ten, x: r.left + r.width / 2, y: r.bottom - 12 };
			});
			const amThanh = await coAmThanh(p);
			// chạm lần đầu: tải mẫu của vùng ±12 nửa cung quanh phím (trong khoảng của bàn phím), không tải cả bộ 30 mẫu
			const taiMp3 = [];
			p.on('request', (r) => laMp3(r.url()) && taiMp3.push(r.url()));
			const mau = amThanh ? p.waitForResponse((r) => laMp3(r.url()), { timeout: 10000 }) : null;
			await p.touchscreen.tap(k.x, k.y);
			await p.waitForFunction((t) => document.querySelector('.oz-phim-ten')?.textContent === t, k.ten, { timeout: 5000 });
			if (amThanh) {
				assert.equal((await mau).status(), 200, 'mẫu âm piano tải được');
				await p.waitForTimeout(300);
				assert.equal(await soNot(p), 1, 'chạm một lần, phát đúng một nốt');
				const cac = await el.evaluate((g) => [...g.querySelectorAll('[data-m]')].map((x) => Number(x.dataset.m)));
				const [thap, cao] = [Math.min(...cac), Math.max(...cac)];
				const da = taiMp3.map(midiMau);
				const m = Number(k.m);
				assert.ok(da.length >= 1 && da.length <= 9 && new Set(da).size === da.length, `tải ${da.length} mẫu: ${da.join(', ')}`);
				assert.ok(da.some((x) => Math.abs(x - m) <= 1), `chưa tải mẫu của chính phím vừa chạm (${m}): ${da.join(', ')}`);
				for (const x of da) assert.ok(Math.abs(x - m) <= 13 && x >= thap - 1 && x <= cao + 1, `mẫu ${x} ngoài vùng của phím ${m} (bàn phím ${thap}–${cao})`);
			}
			assert.equal(await p.evaluate(() => scrollX), 0, 'chạm phím không cuộn trang');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// Vuốt qua bàn phím (cuộn trang hay cuộn ngang khung): trình duyệt gửi pointerdown (chạm) rồi pointercancel khi nhận cử chỉ
	// cuộn, không có click. Phím không được kêu, không đổi dòng tên nốt. Bỏ phần chặn chạm ở pointerdown thì phép thử hỏng.
	test(`${ten}: bàn phím: vuốt qua phím (chạm rồi trình duyệt hủy để cuộn) không phát nốt nào`, { skip: !BAN_PHIM.length && khongCo('bàn phím') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const { p, el, loi } = await moTrang(ctx, BAN_PHIM[0], '.oz-ban-phim');
			const truoc = await el.locator('.oz-phim-ten').textContent();
			await el.evaluate((g) => {
				const k = g.querySelector('.oz-phim-trang');
				const r = k.getBoundingClientRect();
				const chung = { bubbles: true, cancelable: true, composed: true, pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: r.left + r.width / 2, clientY: r.bottom - 10 };
				k.dispatchEvent(new PointerEvent('pointerdown', { ...chung, button: 0, buttons: 1 }));
				k.dispatchEvent(new PointerEvent('pointermove', { ...chung, clientY: r.bottom - 60, buttons: 1 }));
				k.dispatchEvent(new PointerEvent('pointercancel', { ...chung, buttons: 0 }));
			});
			await p.waitForTimeout(300);
			assert.equal(await soNot(p), 0, 'vuốt mà phím kêu');
			assert.equal(await el.locator('.oz-phim-ten').textContent(), truoc, 'vuốt mà dòng tên nốt đổi');
			assert.equal(await el.locator('.bam').count(), 0, 'vuốt mà phím nháy');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// Kịch bản của review mã: bấm lần lượt các phím trắng đi lên, mỗi lần cách 350 ms. Tải mẫu theo từng nốt thì 9/15 lần
	// là âm tổng hợp (15/15 khi mạng trễ 400 ms); tải trước theo vùng thì chỉ lần đầu, và lần thứ hai khi mạng chậm.
	// Cho tới 3 lần: đo được 2, máy CI chậm (WebKit) có thể thêm một lần.
	test(`${ten}: bàn phím: bấm lần lượt các phím trắng đi lên (Đô3–Đô5, mỗi lần cách 350 ms): tối đa 3 lần âm tổng hợp, cả khi mạng trễ 400 ms`, { skip: !BAN_PHIM_DAI && khongCo('bàn phím') }, async (t) => {
		const trinhDuyet = await loai.launch();
		try {
			for (const tre of [0, 400]) {
				const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false });
				if (tre) await ctx.route(/\/mau-am\/piano\/[^/]+\.mp3$/, async (r) => (await new Promise((ok) => setTimeout(ok, tre)), r.continue()));
				const { p, el, loi } = await moTrang(ctx, BAN_PHIM_DAI, '.oz-ban-phim');
				if (!(await coAmThanh(p))) return t.skip('trình duyệt không có Web Audio');
				const taiMp3 = [];
				p.on('request', (r) => laMp3(r.url()) && taiMp3.push(midiMau(r.url())));
				const phim = await el.evaluate((g) =>
					[...g.querySelectorAll('.oz-phim-trang')]
						.map((k) => {
							const r = k.getBoundingClientRect();
							return { m: Number(k.dataset.m), x: r.left + r.width / 2, y: r.bottom - 12 };
						})
						.sort((a, b) => a.m - b.m),
				);
				for (const [i, k] of phim.entries()) {
					// 350 ms là nhịp bấm của người học trong kịch bản, không phải chờ cho xong việc gì
					if (i) await p.waitForTimeout(350);
					await p.mouse.click(k.x, k.y);
				}
				await p.waitForFunction((n) => window.__ozNot >= n, phim.length, { timeout: 5000 });
				const tongHop = await p.evaluate(() => window.__ozTongHop);
				t.diagnostic(`mạng trễ ${tre} ms: ${tongHop}/${phim.length} lần âm tổng hợp; tải ${taiMp3.length} mẫu`);
				assert.equal(await soNot(p), phim.length, 'mỗi lần bấm một nốt');
				if (tongHop > 2) {
					// trình duyệt không giải mã được mp3 (máy thiếu bộ giải mã): không đo được kịch bản này
					const giaiDuoc = await p.evaluate(async (u) => {
						try {
							await new OfflineAudioContext(2, 1, 44100).decodeAudioData(await (await fetch(u)).arrayBuffer());
							return true;
						} catch {
							return false;
						}
					}, `${await goc()}mau-am/piano/C4.mp3`);
					if (!giaiDuoc) return t.skip('trình duyệt này không giải mã được mp3');
				}
				assert.ok(tongHop <= 3, `${tongHop}/${phim.length} lần âm tổng hợp (mạng trễ ${tre} ms)`);
				assert.ok(taiMp3.length <= 9 && new Set(taiMp3).size === taiMp3.length, `tải ${taiMp3.length} mẫu (tối đa 9, mỗi mẫu một lần): ${taiMp3.join(', ')}`);
				assert.deepEqual(loi, []);
				await ctx.close();
			}
		} finally {
			await trinhDuyet.close();
		}
	});

	// Nút nghe trong lúc chờ mẫu âm (mạng chậm): người dùng cảm ứng không thấy con trỏ, nên phải có vạch chờ nhìn thấy được;
	// nút không đổi cỡ; người dùng chọn giảm chuyển động thì vạch đứng yên.
	test(`${ten}: nút nghe đang chờ mẫu âm: có vạch chờ ở đáy nút, nút không đổi cỡ; giảm chuyển động thì vạch đứng yên`, { skip: !BAN_PHIM_TO.length && khongCo('bàn phím có phím được tô') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			for (const giam of [false, true]) {
				const ctx = await trinhDuyet.newContext({ viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: ten !== 'firefox', reducedMotion: giam ? 'reduce' : 'no-preference' });
				await ctx.route(/\/mau-am\/piano\/[^/]+\.mp3$/, async (r) => (await new Promise((ok) => setTimeout(ok, 1200)), r.continue()));
				const { p, el } = await moTrang(ctx, BAN_PHIM_TO[0], '.oz-ban-phim:has([data-k="nghe"])');
				const nut = el.locator('[data-k="nghe"]');
				const truoc = await nut.boundingBox();
				await nut.tap();
				await p.waitForFunction(() => document.querySelector('.oz-ban-phim [data-k="nghe"][aria-busy="true"]'), null, { timeout: 5000 });
				const cho = await nut.evaluate((b) => {
					const s = getComputedStyle(b, '::after');
					const r = b.getBoundingClientRect();
					return { content: s.content, cao: s.height, rong: parseFloat(s.width), trong: b.clientWidth, ten: s.animationName, vien: getComputedStyle(b).borderBottomStyle, w: r.width, h: r.height };
				});
				assert.equal(cho.content, '""', 'không có vạch chờ');
				assert.equal(cho.cao, '3px');
				assert.ok(Math.abs(cho.w - truoc.width) < 0.5 && Math.abs(cho.h - truoc.height) < 0.5, `nút đổi cỡ: ${truoc.width}×${truoc.height} thành ${cho.w}×${cho.h}`);
				if (giam) {
					assert.equal(cho.ten, 'none', 'giảm chuyển động mà vạch vẫn chạy');
					assert.ok(Math.abs(cho.rong - cho.trong) < 1, `giảm chuyển động: vạch đứng yên, dài hết nút (${cho.rong} / ${cho.trong} px)`);
					assert.equal(cho.vien, 'dashed');
				} else assert.equal(cho.ten, 'oz-cho');
				await p.waitForFunction(() => !document.querySelector('.oz-ban-phim [data-k="nghe"][aria-busy]'), null, { timeout: 8000 });
				assert.ok(['none', 'normal', ''].includes(await nut.evaluate((b) => getComputedStyle(b, '::after').content)), 'vạch chờ còn sau khi tải xong');
				await ctx.close();
			}
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: bàn phím bằng chuột và bàn phím máy tính: một lần bấm một nốt; mũi tên chọn phím, Enter đọc tên`, { skip: !BAN_PHIM.length && khongCo('bàn phím') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false });
			const { p, el, loi } = await moTrang(ctx, BAN_PHIM[0], '.oz-ban-phim');
			const phim = el.locator('[data-m]');
			const so = await phim.count();
			assert.equal(await el.locator('[role="button"][data-m]').count(), so, 'mọi phím là nút');
			assert.equal(await el.locator('[data-m][tabindex="0"]').count(), 1, 'một điểm dừng Tab cho cả bàn phím');
			// chuột: bấm một phím đen, đúng một nốt (nhấn chuột phát ngay; click sau đó không phát lại)
			const den = el.locator('.oz-phim-den').first();
			await den.click();
			await p.waitForFunction((t) => document.querySelector('.oz-phim-ten')?.textContent === t, await den.getAttribute('data-ten'), { timeout: 5000 });
			if (await coAmThanh(p)) {
				await p.waitForTimeout(100);
				assert.equal(await soNot(p), 1, 'bấm chuột một lần, phát đúng một nốt');
			}
			// bàn phím máy tính
			const dau = el.locator('[data-m][tabindex="0"]');
			const m0 = Number(await dau.getAttribute('data-m'));
			await dau.focus();
			await p.keyboard.press('ArrowRight');
			const m1 = await p.evaluate(() => Number(document.activeElement.dataset.m));
			const thuTu = (await phim.evaluateAll((ks) => ks.map((k) => Number(k.dataset.m)))).sort((a, b) => a - b);
			assert.equal(m1, thuTu[thuTu.indexOf(m0) + 1], 'mũi tên phải: phím kế tiếp (cả phím đen)');
			// giữ Enter: trình duyệt lặp keydown, chỉ lần đầu phát tiếng
			const truocEnter = await soNot(p);
			await p.keyboard.down('Enter');
			await p.keyboard.down('Enter');
			await p.keyboard.down('Enter');
			await p.keyboard.up('Enter');
			assert.equal(await el.locator('.oz-phim-ten').textContent(), await el.locator(`[data-m="${m1}"]`).getAttribute('data-ten'));
			if (await coAmThanh(p)) {
				await p.waitForTimeout(100);
				assert.equal((await soNot(p)) - truocEnter, 1, 'giữ Enter mà phát lặp');
			}
			// phím bổ trợ (Alt + mũi tên: lùi, tiến trang) để cho trình duyệt: không đổi phím đang chọn, không phát
			await p.evaluate(() =>
				document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true, cancelable: true })),
			);
			assert.equal(await p.evaluate(() => Number(document.activeElement.dataset.m)), m1, 'Alt + mũi tên mà bàn phím đổi phím');
			const khongChan = await p.evaluate(() => {
				const ev = new KeyboardEvent('keydown', { key: 'ArrowLeft', metaKey: true, bubbles: true, cancelable: true });
				document.activeElement.dispatchEvent(ev);
				return !ev.defaultPrevented;
			});
			assert.ok(khongChan, 'Cmd + mũi tên bị chặn');
			await p.keyboard.press('End');
			assert.equal(await p.evaluate(() => Number(document.activeElement.dataset.m)), thuTu.at(-1));
			assert.equal(await el.locator('[data-m][tabindex="0"]').count(), 1);
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: bàn phím: nút nghe nháy lần lượt mọi phím được tô và phát từng nốt`, { skip: !BAN_PHIM_TO.length && khongCo('bàn phím có phím được tô') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false });
			const { p, el } = await moTrang(ctx, BAN_PHIM_TO[0], '.oz-ban-phim:has([data-k="nghe"])');
			const to = (await el.locator('.to').evaluateAll((ks) => ks.map((k) => Number(k.dataset.m)))).sort((a, b) => a - b);
			const nhay = el.evaluate(
				(g, n) =>
					new Promise((ok) => {
						const da = new Set();
						new MutationObserver(() => {
							g.querySelectorAll('.bam').forEach((k) => da.add(Number(k.dataset.m)));
							if (da.size >= n) ok([...da].sort((a, b) => a - b));
						}).observe(g, { subtree: true, attributes: true, attributeFilter: ['class'] });
						setTimeout(() => ok([...da].sort((a, b) => a - b)), 8000);
					}),
				to.length,
			);
			// bấm bằng bàn phím máy tính (người dùng bàn phím mất chỗ đang đứng nếu nút bị khóa): tiêu điểm ở lại trên nút
			const nut = el.locator('[data-k="nghe"]');
			await nut.focus();
			await p.keyboard.press('Enter');
			assert.equal(await nut.isDisabled(), false, 'nút bị khóa');
			assert.ok(await nut.evaluate((b) => document.activeElement === b), 'tiêu điểm rời khỏi nút');
			assert.deepEqual(await nhay, to, 'mọi phím được tô đều nháy');
			if (await coAmThanh(p)) assert.equal(await soNot(p), to.length, 'mỗi phím được tô một nốt');
			assert.equal(await nut.getAttribute('aria-busy'), null, 'nút còn aria-busy sau khi phát');
			assert.ok(await nut.evaluate((b) => document.activeElement === b), 'tiêu điểm rời khỏi nút sau khi phát');
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: vòng quãng năm: chạm hay bấm một ô thì hiện giọng ấy; phím mũi tên đi quanh vòng; ô từ 44 px trên điện thoại`, { skip: !VONG.length && khongCo('vòng quãng năm') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, VONG[0], '.oz-vong');
			const nho = await el.locator('.oz-vong-o').evaluateAll((os) =>
				os.map((o) => o.getBoundingClientRect()).filter((r) => r.width < 43.5 || r.height < 43.5).map((r) => `${r.width.toFixed(0)}×${r.height.toFixed(0)}`),
			);
			assert.deepEqual(nho, [], 'ô nhỏ hơn 44 px');
			const sol = el.locator('.oz-vong-o[data-giong="G"]:not([data-thu])');
			const r = await sol.boundingBox();
			await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2);
			await p.waitForFunction(() => /Giọng Sol trưởng \(G major\)/.test(document.querySelector('.oz-vong-tin')?.textContent ?? ''), null, { timeout: 5000 });
			assert.equal(await sol.getAttribute('aria-checked'), 'true');
			assert.equal(await el.locator('[aria-checked="true"]').count(), 1);
			assert.equal(await el.locator('.oz-vong-giua-chu').textContent(), 'G');
			assert.match(await el.locator('.oz-vong-tin').textContent(), /1 dấu thăng: F♯\./);
			assert.equal(await el.locator('.oz-vong-tin use[href="#oz-kh-thang"]').count(), 1, 'hóa biểu một dấu thăng');
			assert.equal(await p.evaluate(() => !!document.getElementById('oz-kh-khoa-sol')), true, 'định nghĩa ký hiệu có trong trang');
			// bàn phím máy tính: phải đi theo chiều kim đồng hồ (Rê), xuống vào vòng trong (si thứ), trái về Sol… (mi thứ)
			await sol.focus();
			await p.keyboard.press('ArrowRight');
			assert.match(await el.locator('.oz-vong-tin').textContent(), /Giọng Rê trưởng \(D major\)/);
			await p.keyboard.press('ArrowDown');
			assert.match(await el.locator('.oz-vong-tin').textContent(), /Giọng Si thứ \(B minor\).*Giọng trưởng song song: Rê trưởng\./);
			await p.keyboard.press('ArrowLeft');
			assert.equal(await p.evaluate(() => document.activeElement.dataset.ten), 'Mi thứ');
			const truoc = await soNot(p);
			await el.locator('[data-k="gam"]').click();
			if (await coAmThanh(p)) {
				await p.waitForFunction((n) => window.__ozNot >= n + 8, truoc, { timeout: 5000 });
				assert.equal((await soNot(p)) - truoc, 8, 'nghe gam: 8 nốt');
			}
			assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'trang tràn ngang');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: luyện hóa biểu: chọn sai thì có mẹo, chọn đúng thì "Đúng" và lưu như site cũ; đổi khóa Fa thì vẽ khóa Fa`, { skip: !LUYEN.length && khongCo('luyện hóa biểu') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const { p, el, loi } = await moTrang(ctx, LUYEN[0], '.oz-lhb');
			const nhan = await el.locator('.oz-lhb-hinh svg').getAttribute('aria-label');
			const m = /khóa Sol, (?:không có dấu hóa|(\d) dấu (thăng|giáng))/.exec(nhan);
			assert.ok(m, `nhãn hóa biểu: ${nhan}`);
			const n = m[1] ? Number(m[1]) * (m[2] === 'thăng' ? 1 : -1) : 0;
			const dung = { 0: 'C', 1: 'G', 2: 'D', 3: 'A', 4: 'E', 5: 'B', 6: 'F#', 7: 'C#', '-1': 'F', '-2': 'Bb', '-3': 'Eb', '-4': 'Ab', '-5': 'Db', '-6': 'Gb', '-7': 'Cb' }[n];
			const sai = el.locator(`.oz-lhb-chon button:not([data-giong="${dung}"])`).first();
			await sai.tap();
			assert.match(await el.locator('.oz-feedback').textContent(), /^Chưa đúng\. Mẹo: .*giọng trưởng/);
			assert.ok(await sai.isDisabled());
			await el.locator(`.oz-lhb-chon button[data-giong="${dung}"]`).tap();
			assert.match(await el.locator('.oz-feedback').textContent(), /^Đúng\./);
			assert.match(await el.locator('.oz-lhb-so').textContent(), /đúng ngay lần đầu 0\/1\./);
			const luu = await p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1')));
			assert.deepEqual([luu.store.skills.keysig.n, luu.store.skills.keysig.c], [1, 0], 'kỹ năng keysig: một lần, sai ở lần đầu');
			assert.equal(Object.values(luu.days)[0].keysigs, 1, 'một hóa biểu đọc đúng trong ngày');
			await el.locator('select[data-k="khoa"]').selectOption('fa');
			await p.waitForFunction(() => document.querySelector('.oz-lhb-hinh use[href="#oz-kh-khoa-fa"]'), null, { timeout: 5000 });
			assert.match(await el.locator('.oz-lhb-hinh svg').getAttribute('aria-label'), /khóa Fa/);
			const nut = await el.locator('select, button').evaluateAll((xs) => xs.map((x) => x.getBoundingClientRect()).filter((r) => r.width < 43.5 || r.height < 43.5).length);
			assert.equal(nut, 0, 'nút và ô chọn từ 44 px trên cảm ứng');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});
}

// Trợ năng ở mọi trang có các thành phần này (kiem-tro-nang.mjs chỉ chạy ở trang mẫu): sau khi đã bấm thử, hai chế độ.
test('axe: trang có bàn phím, vòng quãng năm, luyện hóa biểu không vi phạm (sau khi bấm thử)', { skip: !BAN_PHIM.length && !VONG.length && !LUYEN.length && khongCo('các thành phần này') }, async (t) => {
	const trinhDuyet = await chromium.launch();
	try {
		for (const [w, h, scheme] of [
			[360, 780, 'dark'],
			[1280, 800, 'light'],
		]) {
			const ctx = await trinhDuyet.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
			for (const trang of [...new Set([...BAN_PHIM, ...VONG, ...LUYEN])])
				await t.test(`${w} px, ${scheme === 'dark' ? 'tối' : 'sáng'}: ${trang}`, async () => {
					const p = await ctx.newPage();
					await p.goto((await goc()) + trang, { waitUntil: 'load' });
					for (const chon of ['.oz-ban-phim', '.oz-vong', '.oz-lhb']) {
						const el = p.locator(chon).first();
						if (!(await el.count())) continue;
						await el.scrollIntoViewIfNeeded();
						await p.waitForFunction((c) => document.querySelector(c)?.dataset.san, chon, { timeout: 20000 });
					}
					// bấm bằng sự kiện (phần giữa phím trắng có thể nằm dưới phím đen)
					const bam = (c) => p.locator(c).first().evaluate((x) => x.dispatchEvent(new MouseEvent('click', { bubbles: true })));
					if (await p.locator('.oz-phim-trang').count()) await bam('.oz-phim-trang');
					if (await p.locator('.oz-vong-o').count()) await bam('.oz-vong-o[data-thu][data-giong="A"]');
					if (await p.locator('.oz-lhb-chon button').count()) await p.locator('.oz-lhb-chon button').first().click();
					await p.addScriptTag({ path: AXE });
					const vp = await p.evaluate(
						async () =>
							(await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map(
								(v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`,
							),
					);
					assert.deepEqual(vp, []);
					await p.close();
				});
			await ctx.close();
		}
	} finally {
		await trinhDuyet.close();
	}
});
