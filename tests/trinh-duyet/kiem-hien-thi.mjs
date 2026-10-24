// Hiển thị trên ba trình duyệt, ba cỡ màn hình (AGENTS.md, mục Giao diện): không tràn ngang, không lỗi JavaScript hay lỗi
// ghi ra console, không file nào tải hỏng, mọi khối khởi tạo được (khuông vẽ xong, câu hỏi có nút, khối nghe dựng xong),
// các con của một hàng không lệch nhau; trên màn hình cảm ứng, vùng bấm từ 44 px.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { CO, TRANG, TRINH_DUYET, cuonHet, dongMayChu, goc, nguCanh, tenTrang } from './chung.mjs';

after(dongMayChu);

/**
 * Hàng (flex, grid) trong bài có con dính lề trên của Starlight (phần tử liền sau phần tử khác trong bài cách 1rem, kể cả
 * nút trong một hàng) mà con khác thì không: các con lệch nhau theo chiều dọc. Cả nút của thanh phát abcjs tràn khỏi thanh
 * (abcjs mặc định cho nút cao hơn thanh).
 */
const hangLech = () => {
	const bai = document.querySelector('.sl-markdown-content');
	if (!bai) return [];
	const thu = bai.appendChild(document.createElement('div'));
	thu.style.marginTop = 'var(--sl-content-gap-y)';
	const khoang = getComputedStyle(thu).marginTop;
	thu.remove();
	if (khoang === '0px') return ['Starlight không còn --sl-content-gap-y (đổi tên?): sửa hangLech'];
	const ten = (x) => `${x.tagName.toLowerCase()}${x.getAttribute('class') ? '.' + x.getAttribute('class').trim().split(/\s+/).join('.') : ''}`;
	const lech = [...bai.querySelectorAll('*')]
		.filter((x) => {
			const s = getComputedStyle(x);
			return /flex|grid/.test(s.display) && !(s.display.includes('flex') && s.flexDirection.startsWith('column'));
		})
		.filter((x) => {
			const le = [...x.children]
				.filter((c) => c.getClientRects().length && !/absolute|fixed/.test(getComputedStyle(c).position))
				.map((c) => getComputedStyle(c).marginTop);
			return le.includes(khoang) && le.some((m) => m !== khoang);
		})
		.map(ten);
	const tran = [...bai.querySelectorAll('.abcjs-inline-audio .abcjs-btn')]
		.filter((n) => {
			const t = n.closest('.abcjs-inline-audio').getBoundingClientRect();
			const r = n.getBoundingClientRect();
			return n.getClientRects().length && (r.top < t.top - 0.5 || r.bottom > t.bottom + 0.5);
		})
		.map((n) => `${ten(n)} tràn khỏi thanh phát`);
	return [...new Set(lech), ...tran];
};

/**
 * Phần tử bấm được thấp hay hẹp hơn 44 px: nút, ô nhập, link đứng riêng (link nằm trong câu chữ, như trong đoạn văn, mục
 * danh sách, ô bảng, thì được miễn), trừ ô chọn nằm trong nhãn bấm được, và link "bỏ qua tới nội dung" của Starlight (chỉ
 * hiện khi dùng bàn phím). Link neo cạnh tiêu đề của Starlight nới vùng bấm bằng ::after mà không đổi bố cục, nên tính cả
 * phần ấy. Cho sai số nửa px của bố cục.
 */
const nhoHon44 = () =>
	[...document.querySelectorAll(
		'a[href], button, summary, select, input:not([type=hidden]), [role=button], label:has(input), .abcjs-btn, .abcjs-midi-progress-background, .abcjs-midi-tempo',
	)]
		.filter((x) => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden' && !x.closest('[hidden], dialog:not([open])'))
		.filter((x) => !(x.matches('input[type=checkbox], input[type=radio]') && x.closest('label')))
		.filter((x) => !(x.matches('a') && x.closest('p, li, td, th, dd, dt, figcaption, blockquote, .sr-only, .sl-skip-link')))
		.map((x) => {
			const r = x.getBoundingClientRect();
			if (!x.matches('.sl-anchor-link')) return [x, r];
			const a = getComputedStyle(x, '::after');
			return [x, { width: r.width - parseFloat(a.left) - parseFloat(a.right), height: r.height - parseFloat(a.top) - parseFloat(a.bottom) }];
		})
		.filter(([, r]) => r.height < 43.5 || r.width < 43.5)
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
						const dauTrang = (await goc()) + trang;
						p.on('pageerror', (e) => loi.push(String(e)));
						p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
						p.on('requestfailed', (r) => loi.push(`tải hỏng: ${r.url()} (${r.failure()?.errorText})`));
						// trang 404 trả mã 404 là đúng; file khác của site thì phải có
						p.on('response', (r) => r.status() >= 400 && r.url() !== dauTrang && loi.push(`mã ${r.status()}: ${r.url()}`));
						await p.goto(dauTrang, { waitUntil: 'load' });
						await cuonHet(p, loi);
						assert.deepEqual(loi, [], 'lỗi JavaScript, lỗi ghi ra console, hay file tải hỏng');
						const tran = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
						assert.ok(tran <= 0, `tràn ngang ${tran} px`);
						if (co.camUng) assert.deepEqual(await p.evaluate(nhoHon44), [], 'vùng bấm dưới 44 px');
						assert.deepEqual(await p.evaluate(hangLech), [], 'con của hàng lệch nhau, hay nút tràn khỏi thanh phát');
						// Ô trống ở thanh trên vẫn chiếm chỗ (ô link mạng xã hội kèm vạch ngăn, khi không có link). Xét display của
						// chính ô, ở mọi cỡ màn hình (dưới 50rem cả nhóm bị ẩn, ô vẫn phải ẩn để lên màn rộng không hiện)
						assert.ok(await p.evaluate(() => document.querySelector('header.header .right-group')), 'thanh trên không còn .right-group: sửa phép thử');
						const oTrong = await p.evaluate(() =>
							[...document.querySelectorAll('header.header .right-group > :not(script)')]
								.filter((e) => !e.childElementCount && !e.textContent.trim() && getComputedStyle(e).display !== 'none')
								.map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`),
						);
						assert.deepEqual(oTrong, [], 'ô trống ở thanh trên');
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
