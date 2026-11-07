// Hình đợt 3a trên ba trình duyệt, ba cỡ màn hình: ngón bấm 12 gam trưởng (::hinh{ten="ngon-gam"}: mười hai bàn phím nhỏ
// xếp lưới; số ngón trong phím đo ở kiem-ban-phim-chu.mjs) và ký hiệu bàn đạp (hình tĩnh ky-hieu-ban-dap). Trang không tràn
// ngang; ô lưới không đè nhau, bàn phím và tên giọng nằm trong ô, tên không đè bàn phím; chữ trong hình bàn đạp nằm trong
// hình và không đè nhau, cỡ chữ đọc được. Trang lấy từ bản build; không có thì bỏ qua. Hai hình thời gian của đợt (buoc-nhay,
// buoi-tap, thang-may) đo ở kiem-thoi-gian.mjs.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const DAU = ['class="oz-figure oz-ngon-gam', 'class="oz-fig oz-fig-vua"'];
const TRANG = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/') && !f.startsWith('sach/'))
			.filter((f) => {
				const s = fs.readFileSync(path.join(DIST, f), 'utf8');
				return DAU.some((d) => s.includes(d));
			})
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];

/** Đo trong trang. Trả về danh sách lỗi (chuỗi). */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	const trong = (a, b, sai = 0.5) => a.l >= b.l - sai && a.r <= b.r + sai && a.t >= b.t - sai && a.b <= b.b + sai;
	// khung chữ gồm cả khoảng trên, dưới của phông: bớt mỗi bên 15% chiều cao để đo phần nét chữ
	const chuCua = (el) => {
		const h = hop(el.getBoundingClientRect());
		const bot = (h.b - h.t) * 0.15;
		return { ...h, t: h.t + bot, b: h.b - bot };
	};
	document.querySelectorAll('.oz-ngon-gam').forEach((fig, i) => {
		const khung = hop(fig.getBoundingClientRect());
		const o = [...fig.querySelectorAll('.oz-ngon-gam-o')];
		if (o.length !== 12) loi.push(`ngón gam ${i}: ${o.length} ô`);
		const hopO = o.map((x) => hop(x.getBoundingClientRect()));
		hopO.forEach((a, x) => {
			if (!trong(a, khung)) loi.push(`ngón gam ${i}: ô ${x} ra ngoài hình`);
			for (let y = x + 1; y < hopO.length; y++) if (giao(a, hopO[y]) > 1) loi.push(`ngón gam ${i}: ô ${x} đè ô ${y}`);
			const svg = hop(o[x].querySelector('svg').getBoundingClientRect());
			const ten = chuCua(o[x].querySelector('.oz-ngon-gam-ten'));
			if (!trong(svg, a)) loi.push(`ngón gam ${i}: bàn phím ${x} ra ngoài ô`);
			if (!trong(ten, a)) loi.push(`ngón gam ${i}: tên ${x} ra ngoài ô`);
			if (giao(ten, svg) > 1) loi.push(`ngón gam ${i}: tên ${x} đè bàn phím`);
			// phím trắng không quá nhỏ để đọc số ngón: từ 24 px
			const phim = o[x].querySelector('.oz-phim-trang').getBoundingClientRect().width;
			if (phim < 24) loi.push(`ngón gam ${i}: phím trắng ${x} chỉ ${phim.toFixed(1)} px`);
		});
	});
	document.querySelectorAll('svg.oz-fig-vua').forEach((svg, i) => {
		const khung = hop(svg.getBoundingClientRect());
		const chu = [...svg.querySelectorAll('text')].map((t) => [t.textContent, chuCua(t), parseFloat(getComputedStyle(t).fontSize) * (khung.r - khung.l) / svg.viewBox.baseVal.width]);
		for (const [s, h, co] of chu) {
			if (!trong(h, khung)) loi.push(`bàn đạp ${i}: chữ "${s}" ra ngoài hình`);
			if (co < 8.5) loi.push(`bàn đạp ${i}: chữ "${s}" cỡ ${co.toFixed(1)} px`);
		}
		for (let x = 0; x < chu.length; x++)
			for (let y = x + 1; y < chu.length; y++) if (giao(chu[x][1], chu[y][1]) > 1) loi.push(`bàn đạp ${i}: chữ "${chu[x][0]}" đè lên "${chu[y][0]}"`);
	});
	return loi;
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: ngón bấm 12 gam, ký hiệu bàn đạp: không tràn, ô không đè nhau, chữ trong hình và không đè nhau`, { skip: !TRANG.length && 'bản build không có hình của đợt 3a' }, async () => {
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
