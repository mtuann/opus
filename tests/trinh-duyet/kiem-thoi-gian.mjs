// Lưới phách, dải thời gian (::hinh nhip, truong-do, hai-choi-ba, legato…; src/scripts/ve-thoi-gian.js, đợt hình 2a) trên ba
// trình duyệt, ba cỡ màn hình: trang không tràn ngang; mọi mục nằm trong trục của hàng, trục nằm trong hình; chữ trong ô
// không ra ngoài ô, chữ của hai mục không đè nhau, nhãn hàng không đè lên trục; tỉ lệ thời gian giữ đúng (vị trí đo được
// khớp phần trăm trong HTML). Trang lấy từ bản build (mọi trang có hình loại này); không có thì bỏ qua.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const DAU = 'class="oz-figure oz-tg';
const TRANG = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/') && !f.startsWith('sach/'))
			.filter((f) => fs.readFileSync(path.join(DIST, f), 'utf8').includes(DAU))
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];

/** Đo trong trang: mọi hình thời gian. Trả về danh sách lỗi (chuỗi). */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	const trong = (a, b, sai = 0.5) => a.l >= b.l - sai && a.r <= b.r + sai && a.t >= b.t - sai && a.b <= b.b + sai;
	// khung chữ gồm cả khoảng trên, dưới của phông: bớt mỗi bên 15% chiều cao để đo phần nét chữ
	const chuCua = (el) => {
		const r = document.createRange();
		r.selectNodeContents(el);
		const h = hop(r.getBoundingClientRect());
		const bot = (h.b - h.t) * 0.15;
		return { ...h, t: h.t + bot, b: h.b - bot };
	};
	document.querySelectorAll('figure.oz-tg').forEach((fig, i) => {
		const khung = hop(fig.getBoundingClientRect());
		const chu = [];
		fig.querySelectorAll('.oz-tg-hang').forEach((hang, j) => {
			const truc = hang.querySelector('.oz-tg-truc');
			const t = hop(truc.getBoundingClientRect());
			if (!trong(t, khung)) loi.push(`hình ${i} hàng ${j}: trục ra ngoài hình`);
			const ten = hang.querySelector('.oz-tg-ten');
			if (ten.textContent.trim() && ten.getClientRects().length) {
				const c = chuCua(ten);
				if (!trong(c, khung)) loi.push(`hình ${i} hàng ${j}: nhãn ra ngoài hình`);
				if (giao(c, t) > 1) loi.push(`hình ${i} hàng ${j}: nhãn "${ten.textContent}" đè lên trục`);
				chu.push([ten.textContent, c]);
			}
			for (const m of truc.querySelectorAll('.oz-tg-muc')) {
				const o = hop(m.getBoundingClientRect());
				if (!trong(o, t)) loi.push(`hình ${i} hàng ${j}: mục ra ngoài trục`);
				// vị trí đo được khớp phần trăm trong HTML (tỉ lệ thời gian)
				const trai = parseFloat(m.style.left);
				if (Math.abs(o.l - (t.l + ((t.r - t.l) * trai) / 100)) > 1.5) loi.push(`hình ${i} hàng ${j}: mục lệch vị trí ${trai}%`);
				const s = m.firstElementChild;
				if (s && s.textContent.trim()) {
					const c = chuCua(s);
					if (!trong(c, o, 1)) loi.push(`hình ${i} hàng ${j}: chữ "${s.textContent}" ra ngoài ô`);
					chu.push([s.textContent, c]);
				}
			}
		});
		for (let x = 0; x < chu.length; x++)
			for (let y = x + 1; y < chu.length; y++) if (giao(chu[x][1], chu[y][1]) > 1) loi.push(`hình ${i}: chữ "${chu[x][0]}" đè lên "${chu[y][0]}"`);
	});
	return loi;
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: lưới phách, dải thời gian: không tràn, mục trong trục, chữ trong ô và không đè nhau`, { skip: !TRANG.length && 'bản build không có hình thời gian' }, async () => {
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
					assert.deepEqual(loiTrang, [], trang);
					await p.close();
				}
				await ctx.close();
			} finally {
				await trinhDuyet.close();
			}
		});
