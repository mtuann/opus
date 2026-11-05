// Trợ năng (axe-core, WCAG 2.2 AA và best-practice) trên các trang mẫu, Chromium, 360 px tối và 1280 px sáng,
// sau khi các khối đã khởi tạo và đã bấm thử một câu hỏi, bàn phím, vòng quãng năm, luyện hóa biểu (để kiểm cả trạng thái
// sau khi dùng).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { TRANG, cuonHet, dongMayChu, goc, khongChromium, tenTrang, CHROMIUM } from './chung.mjs';

after(dongMayChu);
const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const NHAN = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test('axe: không vi phạm', { skip: khongChromium }, async (t) => {
	const trinhDuyet = await CHROMIUM.launch();
	try {
		// hai tổ hợp đủ cả hai cỡ và hai chế độ màu (bốn tổ hợp gấp đôi thời gian mà chưa bắt thêm lỗi nào): độ tương phản
		// theo chế độ màu, bố cục theo cỡ màn hình
		for (const [w, h, scheme] of [
			[360, 780, 'dark'],
			[1280, 800, 'light'],
		]) {
			const ctx = await trinhDuyet.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
			for (const trang of TRANG)
				await t.test(`${w} px, ${scheme === 'dark' ? 'tối' : 'sáng'}: ${tenTrang(trang)}`, async () => {
					const p = await ctx.newPage();
					await p.goto((await goc()) + trang, { waitUntil: 'load' });
					await cuonHet(p);
					const nut = p.locator('.oz-quiz button').first();
					if (await nut.count()) await nut.click();
					// bàn phím, vòng quãng năm, luyện hóa biểu: bấm thử như phép axe của kiem-ban-phim.mjs (phép ấy bỏ các trang
					// mẫu, đã kiểm ở đây). Bấm bằng sự kiện: phần giữa phím trắng có thể nằm dưới phím đen
					const bam = (c) => p.locator(c).first().evaluate((x) => x.dispatchEvent(new MouseEvent('click', { bubbles: true })));
					if (await p.locator('.oz-phim-trang').count()) await bam('.oz-phim-trang');
					if (await p.locator('.oz-vong-o[data-thu][data-giong="A"]').count()) await bam('.oz-vong-o[data-thu][data-giong="A"]');
					if (await p.locator('.oz-lhb-chon button').count()) await p.locator('.oz-lhb-chon button').first().click();
					await p.addScriptTag({ path: AXE });
					const vp = await p.evaluate(
						async (nhan) =>
							(await axe.run(document, { runOnly: { type: 'tag', values: nhan } })).violations.map(
								(v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`,
							),
						NHAN,
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
