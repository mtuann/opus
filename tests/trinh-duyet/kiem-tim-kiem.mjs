// Tìm kiếm trên bản build (D1.8): bộ truy vấn của ../opus-zero/tests/search.mjs (trang đích phải nằm trong 5 kết quả
// đầu; truy vấn nào có trang đích chưa có trong bản build thì bỏ qua), và gõ "dan" phải ra trang có chữ "đàn", cả qua API
// lẫn qua ô tìm kiếm của Starlight. API là pagefind.js của bản build (bản bọc, src/tim-kiem/pagefind.js).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { DIST, TRINH_DUYET, dongMayChu, goc } from './chung.mjs';

after(dongMayChu);

/** [câu tìm, trang phải nằm trong 5 kết quả đầu]: chép từ ../opus-zero/tests/search.mjs. */
const BO = [
	['hợp âm ba', 'nhac-ly/10-hop-am-ba/'], ['hop am ba', 'nhac-ly/10-hop-am-ba/'],
	['điệu thức', 'nhac-ly/16-dieu-thuc-ngu-cung/'], ['dieu thuc', 'nhac-ly/16-dieu-thuc-ngu-cung/'],
	['doc not', 'luyen-tap/doc-not/'], ['hoa bieu', 'nhac-ly/08-hoa-bieu/'],
	['dan bau', 'lich-su/nhac-truyen-thong-viet-nam/'], ['dau van tay', 'nhan-dien/dau-van-tay/'],
	['nghe mu', 'nhan-dien/nghe-mu/'], ['Boléro', 'nghe-nhac/ravel-bolero/'],
	['bàn đạp', 'piano/ban-dap/'], ['ban dap', 'piano/ban-dap/'], ['ngon bam', 'piano/gam/'],
	['lay tren lay duoi', 'piano/not-hoa-my/'], ['Goldberg', 'nghe-nhac/bach-goldberg/'],
	['la candeur', 'piano/tac-pham/burgmuller-la-candeur/'], ['schemata', 'piano/hoa-am/mau-galant/'], ['ung tac', 'piano/hoa-am/ung-tac/'],
	['fantaisie impromptu', 'piano/tac-pham/chopin-fantaisie-impromptu/'], ['gondellied', 'piano/tac-pham/mendelssohn-thuyen-ca/'],
	['quang tam', 'piano/quang-tam-buoc-nhay/'], ['bốn tay', 'piano/choi-cung-nguoi-khac/'], ['senza sordino', 'piano/tac-pham/beethoven-anh-trang/'],
	['máy lên dây', 'luyen-tap/hat-lai/'], ['giay ke khuong', 'luyen-tap/phieu-bai-tap/'], ['cathédrale engloutie', 'nghe-nhac/debussy-preludes/'],
];
const coTrang = (t) => fs.existsSync(path.join(DIST, t, 'index.html'));
/**
 * Trang mà câu tìm "dan" chỉ khớp được qua chữ "đ": sau khi bỏ dấu (như Pagefind làm), phần nội dung có từ "đan" (đàn,
 * đản…) mà không có từ "dan" (dân, dán, dẫn…). Không có bản bọc pagefind.js thì gõ "dan" không ra các trang này.
 */
const chiCoDan = () =>
	fs
		.readdirSync(DIST, { recursive: true })
		.filter((f) => f.endsWith('index.html'))
		.filter((f) => {
			const html = fs.readFileSync(path.join(DIST, f), 'utf8');
			const tu = new Set(
				html
					.slice(html.indexOf('<main'), html.indexOf('</main>'))
					.replace(/<[^>]+>/g, ' ')
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.split(/[^a-zđ0-9]+/),
			);
			return tu.has('đan') && !tu.has('dan');
		})
		.map((f) => '/opus/' + f.replace(/index\.html$/, ''));

/** Trang (địa chỉ, bỏ #mục) của kết quả tìm, theo thứ tự, không trùng. */
async function tim(p, cau) {
	return p.evaluate(async (cau) => {
		const pf = await import('/opus/pagefind/pagefind.js');
		const kq = await pf.search(cau);
		const ds = await Promise.all(kq.results.slice(0, 20).map((r) => r.data()));
		return { so: kq.results.length, trang: [...new Set(ds.map((d) => d.url.split('#')[0]))] };
	}, cau);
}

test('tìm kiếm qua pagefind.js của bản build', async (t) => {
	const trinhDuyet = await chromium.launch();
	try {
		const p = await trinhDuyet.newPage();
		await p.goto(await goc(), { waitUntil: 'load' });
		const co = BO.filter(([, trang]) => coTrang(trang));
		for (const [cau, trang] of co)
			await t.test(`"${cau}" ra ${trang} trong 5 kết quả đầu`, async () => {
				const ds = (await tim(p, cau)).trang.slice(0, 5);
				assert.ok(ds.includes('/opus/' + trang), `5 kết quả đầu: ${ds.join(', ')}`);
			});
		const dan = chiCoDan();
		await t.test(`"dan" ra cả trang chỉ có chữ "đ…an" như "đàn" (${dan.length} trang)`, { skip: !dan.length && 'bản build chưa có trang chỉ có "đàn" mà không có "dan"' }, async () => {
			const { trang } = await tim(p, 'dan');
			assert.deepEqual(dan.filter((x) => !trang.includes(x)), [], `kết quả: ${trang.join(', ')}`);
		});
		t.diagnostic(`${co.length}/${BO.length} truy vấn của site cũ có trang đích trong bản build`);
	} finally {
		await trinhDuyet.close();
	}
});

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	test(`${ten}: ô tìm kiếm của Starlight dùng bản bọc: gõ "dan" ra đúng số kết quả như pagefind.js của bản build, không lỗi`, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const p = await trinhDuyet.newPage({ viewport: { width: 1280, height: 800 } });
			const loi = [];
			p.on('pageerror', (e) => loi.push(String(e)));
			p.on('console', (m) => m.type() === 'error' && loi.push(m.text()));
			await p.goto(await goc(), { waitUntil: 'load' });
			// Ô tìm kiếm chạy trước, như với người đọc thật: nó gọi options() trước khi Pagefind khởi tạo, lúc mà options()
			// thay hết tùy chọn cũ. Gọi pagefind.js trước thì Pagefind đã khởi tạo đúng basePath, che mất lỗi này.
			await p.click('site-search button[data-open-modal]');
			await p.locator('.pagefind-ui__search-input').fill('dan');
			await p
				.waitForFunction(() => /\d+ kết quả/.test(document.querySelector('.pagefind-ui__message')?.textContent ?? ''), null, { timeout: 15000 })
				.catch(() => assert.fail(`ô tìm kiếm không ra kết quả; lỗi: ${loi.join(' | ') || 'không có'}`));
			const tin = await p.locator('.pagefind-ui__message').innerText();
			const { so } = await tim(p, 'dan');
			assert.equal(Number(/(\d+) kết quả/.exec(tin)[1]), so, `ô tìm kiếm báo "${tin}"`);
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});
