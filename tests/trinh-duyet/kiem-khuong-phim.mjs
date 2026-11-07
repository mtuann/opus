// Khuông kép nối phím (đợt hình 2, ::hinh{ten="khuong-kep-phim"}; src/scripts/ve-khuong-phim.js) trên ba trình duyệt, ba cỡ
// màn hình: trang không tràn ngang; đầu nốt mốc nằm thẳng trên phím của nó và không đè khóa; số dòng, nhãn dưới phím không đè
// nhau, không đè phím, không ra ngoài hình; nét nối chạm tới phím. Trang lấy từ bản build (mọi trang có hình này); không có
// thì bỏ qua.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const DAU = 'class="oz-figure oz-khuong-phim';
const TRANG = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/'))
			.filter((f) => fs.readFileSync(path.join(DIST, f), 'utf8').includes(DAU))
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];

/** Đo trong trang: mọi hình khuông kép nối phím. Trả về danh sách lỗi (chuỗi). */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	document.querySelectorAll('figure.oz-khuong-phim').forEach((fig, i) => {
		const svg = fig.querySelector('svg.oz-kp');
		const khung = hop(svg.getBoundingClientRect());
		const fk = hop(fig.getBoundingClientRect());
		if (khung.r > fk.r + 0.5 || khung.l < fk.l - 0.5) loi.push(`hình ${i}: hình rộng hơn khung`);
		if (!fig.querySelector('figcaption')?.getBoundingClientRect().height) loi.push(`hình ${i}: thiếu chú thích`);
		const phim = new Map([...svg.querySelectorAll('[data-m]')].map((k) => [k.dataset.m, k]));
		const khoa = [...svg.querySelectorAll('use[href^="#oz-kh-khoa"]')].map((u) => hop(u.getBoundingClientRect()));
		// đầu nốt: tâm thẳng trên tâm phím (lệch dưới 1 px), không đè khóa
		const cuaNot = { F3: 53, C4: 60, G4: 67 };
		for (const n of svg.querySelectorAll('.oz-kp-not')) {
			const a = hop(n.getBoundingClientRect());
			const k = hop(phim.get(String(cuaNot[n.dataset.not])).getBoundingClientRect());
			const lech = Math.abs((a.l + a.r) / 2 - (k.l + k.r) / 2);
			if (lech > 1) loi.push(`hình ${i}: nốt ${n.dataset.not} lệch phím ${lech.toFixed(1)} px`);
			for (const c of khoa) if (giao(a, c) > 0.5) loi.push(`hình ${i}: nốt ${n.dataset.not} đè lên khóa`);
		}
		// nét nối: chạm tới đỉnh phím
		// (đo hình học bằng getBBox, không đo khung có nét vẽ: Firefox tính cả phần nét)
		const duoi = (el) => {
			const h = el.getBBox();
			const d = svg.createSVGPoint();
			[d.x, d.y] = [h.x, h.y + h.height];
			const tren = svg.createSVGPoint();
			[tren.x, tren.y] = [h.x, h.y];
			return [d.matrixTransform(el.getScreenCTM()).y, tren.matrixTransform(el.getScreenCTM()).y];
		};
		const noi = duoi(svg.querySelector('.oz-kp-noi'))[0];
		const dinh = Math.min(...[...phim.values()].map((k) => duoi(k)[1]));
		if (Math.abs(noi - dinh) > 1) loi.push(`hình ${i}: nét nối không chạm phím (${noi.toFixed(1)} / ${dinh.toFixed(1)})`);
		const chu = [...svg.querySelectorAll('.oz-phim-nhan tspan, .oz-kp-so')].map((t) => {
			// bớt mỗi bên 15% khung chữ (khoảng trên, dưới của phông) để đo phần nét chữ
			const h = hop(t.getBoundingClientRect());
			const bot = (h.b - h.t) * 0.15;
			return [t.textContent, { ...h, t: h.t + bot, b: h.b - bot }, t.parentNode];
		});
		if (chu.length < 10 + 8) loi.push(`hình ${i}: thiếu chữ (${chu.length})`);
		for (let x = 0; x < chu.length; x++)
			for (let y = x + 1; y < chu.length; y++) if (chu[x][2] !== chu[y][2] && giao(chu[x][1], chu[y][1]) > 1) loi.push(`hình ${i}: chữ "${chu[x][0]}" đè lên "${chu[y][0]}"`);
		for (const [s, h] of chu) if (h.l < khung.l - 0.5 || h.r > khung.r + 0.5 || h.t < khung.t - 0.5 || h.b > khung.b + 0.5) loi.push(`hình ${i}: chữ "${s}" ra ngoài hình`);
		for (const [s, h] of chu) for (const k of phim.values()) if (giao(h, hop(k.getBoundingClientRect())) > 1) loi.push(`hình ${i}: chữ "${s}" đè lên phím ${k.dataset.m}`);
		// chữ đủ lớn để đọc: nhãn từ 7 px
		const coChu = parseFloat(getComputedStyle(svg.querySelector('.oz-phim-nhan')).fontSize) * (khung.r - khung.l) / svg.viewBox.baseVal.width;
		if (coChu < 7) loi.push(`hình ${i}: chữ nhãn chỉ ${coChu.toFixed(1)} px`);
	});
	return loi;
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: khuông kép nối phím: không tràn, nốt mốc thẳng trên phím, chữ không đè nhau`, { skip: !TRANG.length && 'bản build không có khuông kép nối phím' }, async () => {
			const trinhDuyet = await loai.launch();
			try {
				const ctx = await nguCanh(trinhDuyet, ten, co);
				for (const trang of TRANG) {
					const p = await ctx.newPage();
					const loiTrang = [];
					p.on('pageerror', (e) => loiTrang.push(String(e)));
					await p.goto((await goc()) + trang, { waitUntil: 'load' });
					await p.evaluate(() => document.fonts.ready);
					await p.locator('figure.oz-khuong-phim').first().scrollIntoViewIfNeeded();
					assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, `${trang}: trang tràn ngang`);
					assert.deepEqual(await p.evaluate(do_), [], trang);
					assert.deepEqual(loiTrang, [], trang);
					await p.close();
				}
				await ctx.close();
			} finally {
				await trinhDuyet.close();
			}
		});
