// Hiển thị trên ba trình duyệt, ba cỡ màn hình (AGENTS.md, mục Giao diện): không tràn ngang, không lỗi JavaScript, mọi
// khối khởi tạo được (khuông vẽ xong, câu hỏi có nút, khối nghe dựng xong); trên màn hình cảm ứng, vùng bấm từ 44 px.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { CO, TRANG, TRINH_DUYET, cuonHet, dongMayChu, goc, nguCanh, tenTrang } from './chung.mjs';

after(dongMayChu);

/** Phần tử bấm được (trừ link trong câu chữ, và ô chọn nằm trong nhãn bấm được) thấp hay hẹp hơn 44 px. */
const nhoHon44 = () =>
	[...document.querySelectorAll(
		'button, summary, select, input:not([type=hidden]), [role=button], label:has(input), .abcjs-btn, .abcjs-midi-progress-background, .abcjs-midi-tempo',
	)]
		.filter((x) => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden' && !x.closest('[hidden], dialog:not([open])'))
		.filter((x) => !(x.matches('input[type=checkbox], input[type=radio]') && x.closest('label')))
		.map((x) => [x, x.getBoundingClientRect()])
		.filter(([, r]) => r.height < 44 || r.width < 44)
		.map(([x, r]) => `${x.tagName.toLowerCase()}${x.className && typeof x.className === 'string' ? '.' + x.className.trim().split(/\s+/).join('.') : ''} ${Math.round(r.width)}×${Math.round(r.height)}`);

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(ten, async (t) => {
		const trinhDuyet = await loai.launch();
		try {
			for (const co of CO) {
				const ctx = await nguCanh(trinhDuyet, ten, co);
				for (const trang of TRANG) {
					await t.test(`${co.ten}: ${tenTrang(trang)}`, async () => {
						const p = await ctx.newPage();
						const loi = [];
						p.on('pageerror', (e) => loi.push(String(e)));
						await p.goto((await goc()) + trang, { waitUntil: 'load' });
						await cuonHet(p);
						assert.deepEqual(loi, [], 'lỗi JavaScript');
						const tran = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
						assert.ok(tran <= 0, `tràn ngang ${tran} px`);
						if (co.camUng) assert.deepEqual(await p.evaluate(nhoHon44), [], 'vùng bấm dưới 44 px');
						await p.close();
					});
				}
				await ctx.close();
			}
		} finally {
			await trinhDuyet.close();
		}
	});
}
