// Ba hình tĩnh vẽ lại bảng của trang (đợt hình 2: am-ngoai, sáu thẻ đường nét của âm ngoài hợp âm; tong-pho, thứ tự bè
// trong tổng phổ; galant, tám mẫu với bậc khoanh tròn) trên ba trình duyệt, ba cỡ màn hình: trang không tràn ngang; chữ
// trong hình SVG không đè nhau, không ra ngoài hình; chấm nốt không đè chữ; nội dung mỗi thẻ không tràn khỏi thẻ; thẻ
// galant: vòng tròn tròn đều, bước thứ i của giai điệu và bass cùng cột. Trang lấy từ bản build (mọi trang có các hình này).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const DAU = ['class="oz-fig-grid oz-nct"', 'oz-tong-pho', 'class="oz-fig-grid oz-galant"'];
const TRANG = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/'))
			.filter((f) => {
				const s = fs.readFileSync(path.join(DIST, f), 'utf8');
				return DAU.some((d) => s.includes(d));
			})
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];

/** Đo trong trang: trả về danh sách lỗi (chuỗi) và số hình đã đo. */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	const svg = [...document.querySelectorAll('.oz-nct svg, svg.oz-tong-pho')];
	svg.forEach((s, i) => {
		const khung = hop(s.getBoundingClientRect());
		if (khung.r - khung.l < 100) loi.push(`hình ${i}: hẹp quá (${Math.round(khung.r - khung.l)} px)`);
		// khung chữ của trình duyệt gồm cả khoảng trên, dưới của phông: bớt mỗi bên 15% để đo phần nét chữ
		const chu = [...s.querySelectorAll('text')].map((t) => {
			const h = hop(t.getBoundingClientRect());
			const bot = (h.b - h.t) * 0.15;
			return [t.textContent, { ...h, t: h.t + bot, b: h.b - bot }];
		});
		for (let x = 0; x < chu.length; x++)
			for (let y = x + 1; y < chu.length; y++) if (giao(chu[x][1], chu[y][1]) > 1) loi.push(`hình ${i}: chữ "${chu[x][0]}" đè lên "${chu[y][0]}"`);
		for (const [c, h] of chu) if (h.l < khung.l - 0.5 || h.r > khung.r + 0.5 || h.t < khung.t - 0.5 || h.b > khung.b + 0.5) loi.push(`hình ${i}: chữ "${c}" ra ngoài hình`);
		for (const n of s.querySelectorAll('circle, rect'))
			for (const [c, h] of chu) if (giao(hop(n.getBoundingClientRect()), h) > 1) loi.push(`hình ${i}: chữ "${c}" đè lên chấm hay thanh`);
	});
	const the = [...document.querySelectorAll('.oz-nct-the, .oz-galant-the')];
	for (const t of the) {
		const k = hop(t.getBoundingClientRect());
		const ten = t.querySelector('b').textContent;
		for (const c of t.querySelectorAll('*')) {
			const h = hop(c.getBoundingClientRect());
			if (h.l < k.l - 0.5 || h.r > k.r + 0.5 || h.b > k.b + 0.5) loi.push(`thẻ "${ten}": ${c.className || c.tagName} tràn khỏi thẻ`);
		}
		if (!t.classList.contains('oz-galant-the')) continue;
		for (const c of t.querySelectorAll('.oz-galant-giu small')) if (c.getClientRects().length !== 1 || c.getBoundingClientRect().right > c.parentElement.getBoundingClientRect().right + 0.5) loi.push(`thẻ "${ten}": chữ "giữ nguyên" xuống dòng hay ra ngoài thanh`);
		const [gd, bass] = [...t.querySelectorAll('.oz-galant-hang')].map((h) => [...h.querySelectorAll(':scope > .oz-galant-bac, :scope > .oz-galant-cach, :scope > .oz-galant-giu')]);
		for (const o of t.querySelectorAll('.oz-galant-bac')) {
			const r = o.getBoundingClientRect();
			if (Math.abs(r.width - r.height) > 1) loi.push(`thẻ "${ten}": vòng "${o.textContent}" không tròn`);
		}
		if (bass.length === 1 && bass[0].classList.contains('oz-galant-giu')) continue;
		if (gd.length !== bass.length) loi.push(`thẻ "${ten}": số ô hai hàng khác nhau`);
		gd.forEach((o, i) => {
			const a = o.getBoundingClientRect(), b = bass[i]?.getBoundingClientRect();
			if (b && Math.abs(a.left + a.width / 2 - (b.left + b.width / 2)) > 1) loi.push(`thẻ "${ten}": bước ${i + 1} của giai điệu và bass không cùng cột`);
		});
	}
	return [loi, svg.length + the.length];
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: hình vẽ lại bảng (âm ngoài hợp âm, tổng phổ, mẫu galant): không tràn, chữ không đè nhau, không ra ngoài hình`, { skip: !TRANG.length && 'bản build không có các hình này' }, async () => {
			const trinhDuyet = await loai.launch();
			try {
				const ctx = await nguCanh(trinhDuyet, ten, co);
				for (const trang of TRANG) {
					const p = await ctx.newPage();
					const loiTrang = [];
					p.on('pageerror', (e) => loiTrang.push(String(e)));
					await p.goto((await goc()) + trang, { waitUntil: 'load' });
					await p.evaluate(() => document.fonts.ready);
					assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, `${trang}: trang tràn ngang`);
					const [loi, so] = await p.evaluate(do_);
					assert.ok(so > 0, `${trang}: không thấy hình`);
					assert.deepEqual(loi, [], trang);
					assert.deepEqual(loiTrang, [], trang);
					await p.close();
				}
				await ctx.close();
			} finally {
				await trinhDuyet.close();
			}
		});
