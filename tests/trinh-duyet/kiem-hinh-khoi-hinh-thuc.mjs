// Sáu hình tĩnh của đợt hình 3 (khối hình thức minuet–trio, scherzo, concerto Cổ điển, overture, Moldau; Erlkönig) trên ba
// trình duyệt, ba cỡ màn hình: trang không tràn ngang; chữ trong mỗi ô không tràn khỏi ô; ô "nhanh" của overture cao hơn
// ô "chậm" và cùng đáy; hình Erlkönig: chữ SVG không đè nhau, không ra ngoài hình, nhãn "cao hơn"/"cao nhất" không đè cột,
// ba cột tiếng kêu cao dần. Trang lấy từ bản build (mọi trang có các hình này).
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CO, DIST, TRINH_DUYET, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const TEN = ['hinh-thuc/minuet-trio/', 'hinh-thuc/scherzo/', 'hinh-thuc/concerto/', 'hinh-thuc/overture/', 'hinh-thuc/symphonic-poem/', 'nghe-nhac/schubert-erlkonig/'];
const TRANG = TEN.filter((t) => fs.existsSync(path.join(DIST, t, 'index.html')));

/** Đo trong trang: trả về danh sách lỗi (chuỗi) và số hình đã đo. */
function do_() {
	const loi = [];
	const hop = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
	const giao = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
	const hinh = [...document.querySelectorAll('figure.oz-figure')].filter((f) => f.querySelector('.oz-form-map, svg.oz-erlkonig'));
	for (const f of hinh) {
		const khungHinh = hop(f.getBoundingClientRect());
		for (const o of f.querySelectorAll('.oz-seg')) {
			const k = hop(o.getBoundingClientRect());
			const ten = o.querySelector('b').textContent;
			if (k.l < khungHinh.l - 0.5 || k.r > khungHinh.r + 0.5) loi.push(`ô "${ten}" ra ngoài hình`);
			for (const c of o.children) {
				const h = hop(c.getBoundingClientRect());
				if (h.l < k.l - 0.5 || h.r > k.r + 0.5 || h.t < k.t - 0.5 || h.b > k.b + 0.5) loi.push(`ô "${ten}": ${c.tagName} tràn khỏi ô`);
			}
		}
		for (const m of f.querySelectorAll('.oz-form-toc-do')) {
			const o = [...m.querySelectorAll('.oz-seg')];
			const nhanh = o.filter((x) => x.classList.contains('oz-seg-nhanh')).map((x) => x.getBoundingClientRect());
			const cham = o.filter((x) => !x.classList.contains('oz-seg-nhanh')).map((x) => x.getBoundingClientRect());
			for (const n of nhanh) for (const c of cham) {
				if (n.height <= c.height + 4) loi.push('overture: ô nhanh không cao hơn ô chậm');
				if (Math.abs(n.top - c.top) < 30 && Math.abs(n.bottom - c.bottom) > 0.5) loi.push('overture: ô nhanh và ô chậm cùng hàng không cùng đáy');
			}
		}
		const s = f.querySelector('svg.oz-erlkonig');
		if (!s) continue;
		const khung = hop(s.getBoundingClientRect());
		if (khung.r - khung.l < 250) loi.push(`Erlkönig: hình hẹp quá (${Math.round(khung.r - khung.l)} px)`);
		// khung chữ của trình duyệt gồm cả khoảng trên, dưới của phông: bớt mỗi bên 15% để đo phần nét chữ
		const chu = [...s.querySelectorAll('text')].map((t) => {
			const h = hop(t.getBoundingClientRect());
			const bot = (h.b - h.t) * 0.15;
			return [t.textContent, { ...h, t: h.t + bot, b: h.b - bot }];
		});
		for (let x = 0; x < chu.length; x++)
			for (let y = x + 1; y < chu.length; y++) if (giao(chu[x][1], chu[y][1]) > 1) loi.push(`Erlkönig: chữ "${chu[x][0]}" đè lên "${chu[y][0]}"`);
		for (const [c, h] of chu) if (h.l < khung.l - 0.5 || h.r > khung.r + 0.5 || h.t < khung.t - 0.5 || h.b > khung.b + 0.5) loi.push(`Erlkönig: chữ "${c}" ra ngoài hình`);
		const rect = [...s.querySelectorAll('rect')].map((r) => [r, hop(r.getBoundingClientRect())]);
		// chữ ngoài ô (nhãn làn, "cao hơn", "cao nhất") không đè ô; chữ trong ô nằm trọn trong ô của nó
		for (const [c, h] of chu) {
			const trong = rect.filter(([, r]) => giao(r, h) > 1);
			if (trong.length > 1) loi.push(`Erlkönig: chữ "${c}" đè hai ô`);
			for (const [, r] of trong) if (h.l < r.l - 0.5 || h.r > r.r + 0.5 || h.t < r.t - 0.5 || h.b > r.b + 0.5) loi.push(`Erlkönig: chữ "${c}" tràn khỏi ô`);
		}
		const keu = rect.filter(([r]) => r.getAttribute('fill') === '#e9b3a6').map(([, r]) => r).sort((a, b) => a.l - b.l);
		if (keu.length !== 3 || !(keu[0].b - keu[0].t < keu[1].b - keu[1].t && keu[1].b - keu[1].t < keu[2].b - keu[2].t)) loi.push('Erlkönig: ba cột tiếng kêu không cao dần');
	}
	return [loi, hinh.length];
}

for (const [ten, loai] of Object.entries(TRINH_DUYET))
	for (const co of CO)
		test(`${ten}, ${co.ten}: khối hình thức và Erlkönig (đợt hình 3): không tràn, chữ không đè nhau, không ra ngoài ô`, { skip: !TRANG.length && 'bản build không có các trang này' }, async () => {
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
