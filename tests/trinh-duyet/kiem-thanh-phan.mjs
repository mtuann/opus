// Thành phần chạy đúng trên trình duyệt (các phép thử review D1.3 giao cho D1.7): chế độ giá nhạc thoát được bằng cách
// chạm vào nút; mở thẳng link #mục thì đích đứng đúng chỗ sau khi các khối phía trên khởi tạo; in ngay sau khi mở trang
// vẫn có đủ khuông nhạc; câu hỏi báo sai rồi đúng. Chỉ chạy khi bản build có trang dùng các khối này (bản xem, từ D1.8).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRANG, TRINH_DUYET, dongMayChu, goc, khongChromium, nguCanh, trangCo, CHROMIUM } from './chung.mjs';

after(dongMayChu);
const KHUONG = trangCo('oz-abc');
const QUIZ = trangCo('oz-quiz');
const VIEC = trangCo('task-list-item oz-viec');
const PLACEMENT = trangCo('oz-placement');
const MUC_DO = trangCo('oz-muc-do');
const GOI_Y = trangCo('oz-goi-y');
/** Trang mẫu có menu bên (không phải trang splash, trang 404). */
const CO_MENU = TRANG.filter((t) => !t.endsWith('.html') && fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8').includes('id="starlight__sidebar"'));
/** Kho học trong trình duyệt (opus-zero:v1). */
const kho = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1') || '{}').store ?? {});
const khongCo = (khoi) => `bản build không có trang nào có ${khoi}`;

/**
 * Trong trang: mọi khối nằm trước phần tử `id` đã dựng xong: khuông đã vẽ, câu hỏi có nút, khối nghe có con, bàn phím và
 * công cụ hóa biểu đã gắn phần bấm được. Không chờ một
 * khoảng cố định: máy chậm (WebKit trên máy của GitHub) vẽ khuông lâu hơn mọi khoảng ấy.
 */
function khoiTruocDaDung(id) {
	const t = document.getElementById(id);
	return ![
		...[...document.querySelectorAll('.abc-notation')].filter((e) => !e.dataset.rendered),
		...[...document.querySelectorAll('.oz-quiz')].filter((e) => !e.querySelector('button')),
		...[...document.querySelectorAll('.oz-listen')].filter((e) => !e.childElementCount),
		...document.querySelectorAll('.oz-ban-phim:not([data-san]), .oz-vong:not([data-san]), .oz-lhb:not([data-san])'),
	].filter((e) => e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING).length;
}

/**
 * Chờ các khối trước đích dựng xong, font đã nạp, rồi hai khung hình: lúc ấy phần giữ đích của src/scripts/tai.js (chạy
 * sau khi các khối phía trên khởi tạo xong, và lại khi font tải xong) đã chạy, bố cục đã yên, mới đo vị trí đích.
 */
async function choBoCucYen(p, id) {
	await p.waitForFunction(khoiTruocDaDung, id, { timeout: 30000, polling: 100 });
	await p.evaluate(() => document.fonts.ready.then(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))));
}

/**
 * Id của tiêu đề cuối trong nội dung trang (h2 đến h4: có trang chỉ có h3, như bat-dau/tom-tat): phía trên nó có mọi khối
 * của trang. Đọc trong một ngữ cảnh riêng, để lần mở trang#id sau đó là một lần tải mới, không dùng lại gì của lần này.
 */
async function tieuDeCuoi(trinhDuyet, trang) {
	const ctx = await trinhDuyet.newContext();
	try {
		const p = await ctx.newPage();
		await p.goto((await goc()) + trang, { waitUntil: 'domcontentloaded' });
		return await p.evaluate(() => [...document.querySelectorAll('.sl-markdown-content :is(h2, h3, h4)[id]')].at(-1).id);
	} finally {
		await ctx.close();
	}
}

/** Mở thẳng trang#id trong một trang mới (tải mới, không phải đổi # trong cùng tài liệu), chờ bố cục yên, rồi đo vị trí đích. */
async function viTriDich(ctx, trang, id, truocKhiMo) {
	const p = await ctx.newPage();
	await truocKhiMo?.(p);
	await p.goto((await goc()) + trang + '#' + encodeURIComponent(id), { waitUntil: 'load' });
	await choBoCucYen(p, id);
	const truoc = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
	const dung = await p.evaluate((id) => (document.getElementById(id).scrollIntoView(), document.getElementById(id).getBoundingClientRect().top), id);
	return [truoc, dung];
}

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
			for (const trang of KHUONG) {
				const id = await tieuDeCuoi(trinhDuyet, trang);
				for (const co of [{ w: 360, h: 780, camUng: true }, { w: 1280, h: 800, camUng: false }]) {
					const ctx = await nguCanh(trinhDuyet, ten, co);
					const [truoc, dung] = await viTriDich(ctx, trang, id);
					assert.ok(Math.abs(truoc - dung) <= 3, `${trang}, ${co.w} px: #${id} ở ${Math.round(truoc)} px, đúng chỗ là ${Math.round(dung)} px`);
					await ctx.close();
				}
			}
		} finally {
			await trinhDuyet.close();
		}
	});

	// Font về trễ (mạng chậm), sau khi các khối phía trên đã dựng: chữ xuống dòng khác, đích bị đẩy đi; phần giữ đích của
	// src/scripts/tai.js kiểm lại khi font tải xong. Một trang (trang có khuông dài nhất), 1280 px, font trễ 2,5 giây.
	test(`${ten}: mở thẳng link #mục khi font về trễ thì đích vẫn đứng đúng chỗ`, { skip: !KHUONG.length && khongCo('khuông nhạc') }, async () => {
		const kichThuoc = (t) => fs.statSync(path.join(DIST, t, 'index.html')).size;
		const trang = [...KHUONG].sort((a, b) => kichThuoc(b) - kichThuoc(a))[0];
		const trinhDuyet = await loai.launch();
		try {
			const id = await tieuDeCuoi(trinhDuyet, trang);
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false });
			const [truoc, dung] = await viTriDich(ctx, trang, id, (p) =>
				p.route('**/*.woff2', async (r) => {
					await new Promise((ok) => setTimeout(ok, 2500));
					await r.continue();
				}),
			);
			assert.ok(Math.abs(truoc - dung) <= 3, `${trang}, font trễ: #${id} ở ${Math.round(truoc)} px, đúng chỗ là ${Math.round(dung)} px`);
			await ctx.close();
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
			// các khối trước đích cũ (khởi tạo ngay khi mở trang) dựng xong sau khi abcjs về: lúc ấy trang có bị kéo về đích cũ
			// thì đã bị kéo
			await choBoCucYen(p, cuoi);
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
			await p.waitForFunction(() => document.querySelector('li.oz-viec')?.hasAttribute('data-san'), null, { timeout: 20000 });
			const h = await nhan.boundingBox();
			await p.touchscreen.tap(h.x + 4, h.y + 4);
			assert.ok(await o.isChecked(), 'chạm góc nhãn mà ô không đánh dấu');
			const ma = await o.getAttribute('data-viec');
			const kho = await p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1')).store.checks);
			assert.match(kho[VIEC[0]]?.[ma] ?? '', /^\d{4}-\d{2}-\d{2}$/, `kho checks: ${JSON.stringify(kho)}`);
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('li.oz-viec')?.hasAttribute('data-san'), null, { timeout: 20000 });
			assert.ok(await o.isChecked(), 'tải lại trang thì mất dấu');
			await o.uncheck();
			assert.equal(await p.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('opus-zero:v1')).store.checks)), '{}', 'bỏ dấu mà kho còn');
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// D2-L1: bài kiểm tra đầu vào, phần nhạc lý (placement.js)
	test(`${ten}: kiểm tra đầu vào, nhạc lý: trả lời hết thì có bảng kết quả và bài nên bắt đầu, lưu như site cũ, làm lại được`, { skip: !PLACEMENT.length && khongCo('bài kiểm tra nhạc lý') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const p = await ctx.newPage();
			await p.goto((await goc()) + PLACEMENT[0], { waitUntil: 'load' });
			const hop = p.locator('.oz-placement').first();
			await hop.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-placement .oz-btn'), null, { timeout: 20000 });
			const { bai } = JSON.parse(await hop.getAttribute('data-placement'));
			// bài đầu: đúng hết; còn lại: "Tôi chưa biết"
			for (let i = 0, k = 0; i < bai.length; i++)
				for (const c of bai[i].cau) {
					const t = i === 0 ? c.opts.find((o) => o.ok).t : 'Tôi chưa biết';
					await hop.evaluate((el, t) => {
						const mau = document.createElement('div');
						mau.innerHTML = t;
						[...el.querySelectorAll('.oz-btn')].find((b) => b.innerHTML === mau.innerHTML).click();
					}, t);
					k++;
				}
			await p.waitForFunction(() => document.querySelector('.oz-placement table'), null, { timeout: 5000 });
			assert.equal(await hop.locator('tbody tr').count(), bai.length, 'mỗi bài một dòng kết quả');
			assert.match(await hop.locator('.oz-feedback').innerText(), new RegExp(`bài ${bai[1].n}:`));
			const luu = (await kho(p)).placement;
			assert.equal(luu?.start, bai[1].n, `kho placement: ${JSON.stringify(luu)}`);
			assert.match(luu?.date ?? '', /^\d{4}-\d{2}-\d{2}$/);
			// link tới bài chưa lên site là chữ "sắp có", như link dựng lúc build: mỗi bài trong bảng và bài gợi ý (dòng đầu)
			// là một link hay một chữ "sắp có", tùy bài đã có trong bản build chưa
			const linkHaySapCo = await hop.locator('tbody a, .oz-feedback a, .oz-sap-co').count();
			assert.equal(linkHaySapCo, bai.length + 1, 'mỗi bài (và bài gợi ý) một link hay một chữ "sắp có"');
			await hop.getByRole('button', { name: 'Làm lại' }).click();
			assert.match(await hop.locator('.oz-pl-dau').innerText(), /^Câu 1\//);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// D2-L1: chặng piano tự đánh giá (muc-do.js)
	test(`${ten}: kiểm tra đầu vào, piano: đánh dấu hai trong ba việc của nhóm đầu thì ra chặng 2, lưu như site cũ`, { skip: !MUC_DO.length && khongCo('phần chặng piano') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const p = await ctx.newPage();
			await p.goto((await goc()) + MUC_DO[0], { waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-muc-do p'), null, { timeout: 20000 });
			assert.match(await p.locator('.oz-muc-do').innerText(), /Chưa đánh dấu gì/);
			const o = p.locator('.oz-piano-level ul').first().locator(':scope > li.oz-viec > .oz-viec-o');
			for (const i of [0, 1]) {
				await o.nth(i).scrollIntoViewIfNeeded();
				await o.nth(i).tap();
			}
			await p.waitForFunction(() => /Chặng của bạn: 2\./.test(document.querySelector('.oz-muc-do')?.textContent ?? ''), null, { timeout: 5000 });
			assert.equal((await kho(p)).pianoLevel?.stage, 2);
			// trang chủ đọc chặng vừa lưu
			if (GOI_Y.includes('')) {
				await p.goto(await goc(), { waitUntil: 'load' });
				await p.waitForFunction(() => /Chặng của bạn: 2\./.test(document.querySelector('.oz-goi-y')?.textContent ?? ''), null, { timeout: 20000 });
			}
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// D2-L1: ô gợi ý tập ở trang chủ (goi-y.js)
	test(`${ten}: ô gợi ý tập: chưa lưu gì thì mời làm bài kiểm tra; có chặng, bài nhạc lý đã lưu thì gợi ý theo chặng, mục lên đầu`, { skip: !GOI_Y.length && khongCo('ô gợi ý tập') }, async () => {
		const trinhDuyet = await loai.launch();
		// ô đứng trước các lối vào ("Bạn đang ở đâu?") không; tiêu đề của mục đứng ngay trước ô
		const viTri = () =>
			[...document.querySelectorAll('.oz-goi-y')].map((o) => [
				!!(o.compareDocumentPosition(document.querySelector('.oz-loi-vao')) & Node.DOCUMENT_POSITION_FOLLOWING),
				o.previousElementSibling?.querySelector('h2')?.textContent,
			])[0];
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const p = await ctx.newPage();
			await p.goto((await goc()) + GOI_Y[0], { waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-goi-y')?.dataset.ready, null, { timeout: 20000 });
			assert.match(await p.locator('.oz-goi-y').innerText(), /Chưa có chặng của bạn/);
			assert.deepEqual(await p.evaluate(viTri), [false, 'Hôm nay tập gì?'], 'người mới: mục ở sau các lối vào');
			// lưu như site mới: chặng 3, bài nhạc lý 4 (tên và địa chỉ)
			await p.evaluate(() =>
				localStorage.setItem(
					'opus-zero:v1',
					JSON.stringify({ days: {}, store: { pianoLevel: { stage: 3, date: '2026-10-20' }, placement: { date: '2026-10-20', start: 4, ten: 'Bài thử', href: '/opus/nhac-ly/04-thu/' } } }),
				),
			);
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-goi-y.oz-goi-y--rieng'), null, { timeout: 20000 });
			const chu = await p.locator('.oz-goi-y').innerText();
			assert.match(chu, /Chặng của bạn: 3\. /);
			assert.match(chu, /Nhạc lý: bắt đầu từ bài 4: Bài thử/);
			const d = JSON.parse(await p.locator('.oz-goi-y').getAttribute('data-goi-y'));
			assert.equal(await p.locator('.oz-goi-y-bai > li').count(), d.chang[2].goi_y.length);
			assert.deepEqual(await p.evaluate(viTri), [true, 'Hôm nay tập gì?'], 'có gợi ý riêng: mục lên trước các lối vào');
			// dữ liệu của site cũ: chỉ có kết quả nhạc lý, số bài dạng chuỗi
			await p.evaluate(() => localStorage.setItem('opus-zero:v1', JSON.stringify({ days: {}, store: { placement: { date: '2026-10-01', start: '4' } } })));
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-goi-y.oz-goi-y--rieng'), null, { timeout: 20000 });
			const cu = await p.locator('.oz-goi-y').innerText();
			assert.match(cu, /Chưa có chặng piano của bạn/);
			assert.match(cu, /Nhạc lý: bắt đầu từ bài 4 \(các bài nhạc lý/);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	// D2-L1 (d1.md, Việc còn mở): link của menu bên và mục lục "Trên trang này" trên cảm ứng cao từ 44 px
	test(`${ten}: menu bên và mục lục "Trên trang này" trên cảm ứng: vùng bấm từ 44 px`, { skip: !CO_MENU.length && khongCo('menu bên') }, async () => {
		const trinhDuyet = await loai.launch();
		const thap = () =>
			[...document.querySelectorAll('.sidebar-content a, .sidebar-content summary, .oz-menu-trong, mobile-starlight-toc .dropdown a, starlight-toc a')]
				.filter((x) => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden')
				.map((x) => [x.textContent.trim().slice(0, 30), Math.round(x.getBoundingClientRect().height)])
				.filter(([, h]) => h < 43.5);
		try {
			for (const co of [{ w: 360, h: 780, camUng: true }, { w: 768, h: 1024, camUng: true }]) {
				const ctx = await nguCanh(trinhDuyet, ten, co);
				const p = await ctx.newPage();
				await p.goto((await goc()) + CO_MENU[0], { waitUntil: 'load' });
				await p.locator('.sl-menu-button').click();
				await p.waitForFunction(() => document.querySelector('.sidebar-content a')?.getClientRects().length, null, { timeout: 5000 });
				assert.deepEqual(await p.evaluate(thap), [], `${co.w} px, menu bên`);
				await p.locator('.sl-menu-button').click();
				const muc = p.locator('#starlight__mobile-toc > summary');
				if (await muc.count()) {
					await muc.click();
					assert.deepEqual(await p.evaluate(thap), [], `${co.w} px, mục lục`);
				}
				await ctx.close();
			}
		} finally {
			await trinhDuyet.close();
		}
	});

	// D2-L1: trang splash (trang chủ) không có menu bên: ô chọn sáng, tối hiện ở thanh trên trên điện thoại
	test(`${ten}: trang chủ trên điện thoại có ô chọn sáng, tối, đổi được`, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true });
			const p = await ctx.newPage();
			await p.goto(await goc(), { waitUntil: 'load' });
			const chon = p.locator('header starlight-theme-select select');
			assert.ok(await chon.isVisible(), 'ô chọn sáng, tối không hiện');
			await chon.selectOption('light');
			assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'light');
			await chon.selectOption('dark');
			assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'dark');
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});
}

test('chromium: in ngay sau khi mở trang vẫn có đủ khuông nhạc (sau khoảng một giây)', { skip: khongChromium || (!KHUONG.length && khongCo('khuông nhạc')) }, async () => {
	const trinhDuyet = await CHROMIUM.launch();
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
