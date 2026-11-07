// Đợt hình 3c: bản đồ năm đầu (hình tĩnh nam-dau, bat-dau/lo-trinh-choi) và sơ đồ đoạn của hướng dẫn nghe
// (::hinh-cau-truc) trên ba trình duyệt, ba cỡ màn hình: trang không tràn ngang; mỗi dòng, nhãn và ô nằm trong khung
// của nó; chữ không đè nhau; ba tháng một quý cùng hàng khi hình rộng hơn 30rem, một cột khi hẹp hơn (360 px); link tháng tới đúng
// mục có thật. Trang lấy từ bản build (mọi trang có các hình này).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const DAU = ['class="oz-nam-dau"', 'class="oz-form-map"'];
const TRANG = fs.existsSync(DIST)
	? fs
			.readdirSync(DIST, { recursive: true })
			.map((f) => f.replace(/\\/g, '/'))
			.filter((f) => f.endsWith('/index.html') && (f.startsWith('nghe-nhac/') || f.startsWith('bat-dau/')))
			.filter((f) => {
				const s = fs.readFileSync(path.join(DIST, f), 'utf8');
				return DAU.some((d) => s.includes(d)) && (s.includes('class="oz-nam-dau"') || /mỗi ô một dòng của bảng/.test(s));
			})
			.map((f) => f.slice(0, -'index.html'.length))
			.sort()
	: [];

/** Đo trong trang: trả về danh sách lỗi (chuỗi) và số hình đã đo. */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	const trong = (c, k) => c.l >= k.l - 0.5 && c.r <= k.r + 0.5 && c.t >= k.t - 0.5 && c.b <= k.b + 0.5;
	const nd = [...document.querySelectorAll('.oz-nam-dau')];
	for (const h of nd) {
		const khung = hop(h.getBoundingClientRect());
		for (const c of h.querySelectorAll('*')) if (c.getClientRects().length && !c.closest('.sr-only') && !trong(hop(c.getBoundingClientRect()), khung)) loi.push(`năm đầu: ${c.className || c.tagName} ra ngoài hình`);
		const thang = [...h.querySelectorAll('.oz-nd-thang > li')];
		if (thang.length !== 12) loi.push(`năm đầu: ${thang.length} tháng`);
		for (const t of thang) {
			const k = hop(t.getBoundingClientRect());
			const ten = t.querySelector('.oz-nd-ten b').textContent;
			const dong = [...t.querySelectorAll(':scope > *')].map((c) => [c, hop(c.getBoundingClientRect())]);
			for (const [c, r] of dong) if (!trong(r, k)) loi.push(`${ten}: ${c.className} tràn khỏi ô tháng`);
			for (let x = 0; x < dong.length; x++) for (let y = x + 1; y < dong.length; y++) if (giao(dong[x][1], dong[y][1]) > 1) loi.push(`${ten}: dòng đè nhau`);
			const id = decodeURIComponent(t.querySelector('a').getAttribute('href').slice(1));
			if (!document.getElementById(id)) loi.push(`${ten}: không có mục #${id}`);
		}
		// ba tháng một quý: cùng hàng khi hình rộng hơn 30rem (container query), một cột khi hẹp hơn
		const rong = khung.r - khung.l > 30 * parseFloat(getComputedStyle(document.documentElement).fontSize);
		for (const q of h.querySelectorAll('.oz-nd-thang')) {
			const tren = [...q.children].map((c) => Math.round(c.getBoundingClientRect().top));
			const cungHang = new Set(tren).size === 1;
			if (rong && !cungHang) loi.push('năm đầu: ba tháng không cùng hàng khi đủ chỗ');
			if (!rong && cungHang) loi.push('năm đầu: màn hẹp mà ba tháng vẫn cùng hàng');
		}
	}
	const so = [...document.querySelectorAll('.oz-form-map')];
	for (const m of so) {
		const khung = hop(m.getBoundingClientRect());
		const o = [...m.querySelectorAll('.oz-seg')].map((s) => [s, hop(s.getBoundingClientRect())]);
		for (const [s, r] of o) {
			if (!trong(r, khung)) loi.push(`sơ đồ: ô "${s.querySelector('b').textContent}" ra ngoài hình`);
			for (const c of s.querySelectorAll('b, small')) if (!trong(hop(c.getBoundingClientRect()), r)) loi.push(`sơ đồ: chữ "${c.textContent}" tràn khỏi ô`);
		}
		for (let x = 0; x < o.length; x++) for (let y = x + 1; y < o.length; y++) if (giao(o[x][1], o[y][1]) > 1) loi.push(`sơ đồ: ô "${o[x][0].textContent}" đè ô "${o[y][0].textContent}"`);
	}
	return [loi, nd.length + so.length];
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: bản đồ năm đầu và sơ đồ đoạn (đợt hình 3c): không tràn, không đè, link tới mục có thật`, { skip: !TRANG.length && 'bản build không có các hình này' }, async () => {
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
