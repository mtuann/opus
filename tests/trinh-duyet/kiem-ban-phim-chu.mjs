// Bàn phím có chữ thêm (đợt hình 1: ::cong-cu{ten="piano" phai trai nhan ngoac}; veBanPhim trong src/scripts/ve.js) trên ba
// trình duyệt, ba cỡ màn hình: trang không tràn ngang; dấu số ngón nằm gọn trong phím của nó; nhãn và chữ của ngoặc không
// đè lên nhau, không đè lên phím; sau khi bàn phím chạy (ban-phim.js), tên đọc được của phím có số ngón và nhãn; có chú
// giải hai tay; bấm phím có số ngón vẫn đọc tên. Trang lấy từ bản build (mọi trang có bàn phím loại này); không có thì bỏ qua.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const DAU = 'class="oz-phim oz-phim--chu';
const TRANG = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/'))
			.filter((f) => fs.readFileSync(path.join(DIST, f), 'utf8').includes(DAU))
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];

/** Đo trong trang: mọi hình bàn phím có chữ. Trả về danh sách lỗi (chuỗi). */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	document.querySelectorAll('svg.oz-phim--chu').forEach((svg, i) => {
		const phim = new Map([...svg.querySelectorAll('[data-m]')].map((k) => [k.dataset.m, k]));
		for (const d of svg.querySelectorAll('.oz-ngon')) {
			const k = phim.get(d.dataset.phim);
			const a = hop(d.querySelector('circle, rect').getBoundingClientRect());
			const b = hop(k.getBoundingClientRect());
			if (a.l < b.l - 0.5 || a.r > b.r + 0.5 || a.t < b.t - 0.5 || a.b > b.b + 0.5) loi.push(`hình ${i}: số ngón của phím ${d.dataset.phim} ra ngoài phím`);
			// phím trắng: dấu không bị phím đen che
			if (k.classList.contains('oz-phim-trang'))
				for (const den of svg.querySelectorAll('.oz-phim-den')) if (giao(a, hop(den.getBoundingClientRect())) > 0.5) loi.push(`hình ${i}: số ngón của phím ${d.dataset.phim} bị phím đen che`);
		}
		const chu = [...svg.querySelectorAll('.oz-phim-nhan tspan, .oz-phim-ngoac-chu tspan')].map((t) => [t.textContent, hop(t.getBoundingClientRect()), t.parentNode]);
		for (let x = 0; x < chu.length; x++)
			for (let y = x + 1; y < chu.length; y++) if (chu[x][2] !== chu[y][2] && giao(chu[x][1], chu[y][1]) > 1) loi.push(`hình ${i}: chữ "${chu[x][0]}" đè lên "${chu[y][0]}"`);
		for (const [s, h] of chu) for (const k of phim.values()) if (giao(h, hop(k.getBoundingClientRect())) > 1) loi.push(`hình ${i}: chữ "${s}" đè lên phím ${k.dataset.m}`);
		const coNgon = svg.querySelector('.oz-ngon');
		const giai = svg.closest('.oz-ban-phim').querySelector('.oz-phim-chu-giai');
		if (coNgon && !(giai && giai.getBoundingClientRect().height > 0)) loi.push(`hình ${i}: thiếu chú giải hai tay`);
	});
	return loi;
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: bàn phím có số ngón, nhãn, ngoặc: không tràn, dấu nằm trong phím, chữ không đè nhau; tên đọc được có số ngón`, { skip: !TRANG.length && 'bản build không có bàn phím có chữ thêm' }, async () => {
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
					assert.deepEqual(await p.evaluate(do_), [], trang);
					// bàn phím có số ngón đầu tiên: sau khi ban-phim.js gắn phím, tên đọc được có số ngón
					const el = p.locator('.oz-ban-phim:has(.oz-ngon)').first();
					if (await el.count()) {
						await el.scrollIntoViewIfNeeded();
						await p.waitForFunction(() => document.querySelector('.oz-ban-phim:has(.oz-ngon)')?.dataset.san, null, { timeout: 20000 });
						const k = el.locator('[data-mo-ta]').first();
						const [nhanDoc, moTa, tenPhim] = await k.evaluate((x) => [x.getAttribute('aria-label'), x.dataset.moTa, x.dataset.ten]);
						assert.ok(nhanDoc.startsWith(tenPhim) && nhanDoc.endsWith(moTa), `${trang}: aria-label "${nhanDoc}"`);
						assert.match(moTa, /tay (phải|trái) ngón [1-5]/);
						if (!co.camUng) {
							await k.click();
							await p.waitForFunction((t) => document.querySelector('.oz-ban-phim:has(.oz-ngon) .oz-phim-ten')?.textContent === t, tenPhim, { timeout: 5000 });
						}
					}
					assert.deepEqual(loiTrang, [], trang);
					await p.close();
				}
				await ctx.close();
			} finally {
				await trinhDuyet.close();
			}
		});
