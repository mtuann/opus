// Kiểm thử hình đợt 3a (src/scripts/ve-piano-3.js, hình tĩnh ky-hieu-ban-dap): số liệu trong hình khớp bảng của trang
// (ngón bấm 12 gam trưởng, buổi 30 phút, thang máy đếm nhịp), HTML có tên đọc được và data-sinh, ::hinh{ten} dựng hình.
// Hiển thị trên trình duyệt thật: tests/trinh-duyet/kiem-piano-3.mjs, kiem-ban-phim-chu.mjs, kiem-thoi-gian.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BUOI_30, HINH_PIANO_3, NGON_GAM, THANG_MAY, docNgon, gamCo, hinhNgonGam } from '../src/scripts/ve-piano-3.js';
import { hinh } from '../src/plugins/thanh-phan.mjs';
import { tenViet, docNot } from '../src/scripts/nhac-ly.js';

const DOCS = path.resolve(import.meta.dirname, '..', 'src/content/docs');
const doc = (trang) => fs.readFileSync(path.join(DOCS, trang + '.md'), 'utf8');

/** Các dòng của bảng Markdown ngay sau tiêu đề `muc` trong trang (bỏ dòng tiêu đề bảng và dòng kẻ). */
function bang(trang, muc) {
	const s = doc(trang);
	const sau = s.slice(s.indexOf(muc));
	const dong = sau.split('\n');
	const dau = dong.findIndex((d) => d.startsWith('|'));
	const ket = [];
	for (let i = dau + 2; i < dong.length && dong[i].startsWith('|'); i++) ket.push(dong[i].split('|').slice(1, -1).map((x) => x.trim()));
	return ket;
}

test('ngón bấm 12 gam: dữ liệu khớp từng dòng "Bảng ngón bấm 12 gam trưởng" của piano/gam', () => {
	const dong = bang('piano/gam', '## Bảng ngón bấm 12 gam trưởng');
	assert.equal(dong.length, 12);
	assert.deepEqual(
		NGON_GAM.map((g) => [g.giong, g.phai, g.trai, g.bon_phai, g.bon_trai]),
		dong,
	);
});

test('ngón bấm 12 gam: tên chủ âm khớp cột "Giọng"; cột "Ngón 4" khớp nốt có ngón 4 (không kể số trong ngoặc)', () => {
	const cung = (a, b) => a.split(' = ').includes(b) || b.split(' = ').includes(a);
	for (const g of NGON_GAM) {
		const { not, phai, trai } = gamCo(g);
		assert.equal(not.length, 8, g.giong);
		assert.ok(g.giong.split(' = ').includes(tenViet(docNot(g.chuAm))), `${g.giong}: chủ âm ${g.chuAm}`);
		assert.equal(not[7].m - not[0].m, 12, g.giong);
		for (const [tay, cot] of [[phai, g.bon_phai], [trai, g.bon_trai]]) {
			const bon = [...new Set(not.filter((n, i) => tay[i].so === 4 && !tay[i].mut).map((n) => n.ten))];
			assert.equal(bon.length, 1, `${g.giong}: ngón 4 ${bon}`);
			// cột ghi tên đồng âm (Fa♯ = Sol♭) hay tên theo cách viết khác của giọng (Rê♭ trưởng: Sol♭)
			assert.ok(cung(cot, bon[0]) || cot === bon[0], `${g.giong}: cột "${cot}", hình ${bon[0]}`);
		}
	}
	assert.deepEqual(docNgon('(5) 4 1'), [{ so: 5, mut: true }, { so: 4, mut: false }, { so: 1, mut: false }]);
	assert.throws(() => docNgon('6'), /không đọc được/);
});

test('ngón bấm 12 gam: HTML có 12 bàn phím, mỗi phím của gam có số ngón hai tay, số trong ngoặc viền đứt; tên đọc được', () => {
	const h = hinhNgonGam();
	assert.match(h, /^<figure class="oz-figure oz-ngon-gam not-content" data-sinh>/);
	assert.match(h, /<figcaption>[^<]/);
	assert.match(h, /class="oz-phim-chu-giai"/);
	const o = [...h.matchAll(/<div class="oz-ngon-gam-o">(.*?)<\/svg><\/div>/g)].map((m) => m[1]);
	assert.equal(o.length, 12);
	o.forEach((s, i) => {
		const g = NGON_GAM[i];
		const { not, phai, trai } = gamCo(g);
		assert.ok(s.includes(`>${g.giong} trưởng</b>`), g.giong);
		assert.match(s, / role="img" aria-label="[^"]{40,}"/);
		assert.ok(s.includes(`aria-label="${g.giong} trưởng, một quãng tám đi lên.`), g.giong);
		assert.equal((s.match(/<rect class="oz-phim-trang/g) ?? []).length, 9, `${g.giong}: chín phím trắng`);
		for (const [tay, ds] of [['phai', phai], ['trai', trai]])
			not.forEach((n, j) => {
				const m = new RegExp(`<g class="oz-ngon oz-ngon--${tay}( oz-ngon--mut)?" data-phim="${n.m}" aria-hidden="true">.*?<text[^>]*>(\\d)</text></g>`).exec(s);
				assert.ok(m, `${g.giong} ${tay} ${n.ten}`);
				assert.equal(Number(m[2]), ds[j].so, `${g.giong} ${tay} ${n.ten}`);
				assert.equal(!!m[1], ds[j].mut, `${g.giong} ${tay} ${n.ten}: viền đứt`);
			});
		assert.equal((s.match(/class="oz-ngon /g) ?? []).length, 16, `${g.giong}: 16 dấu`);
	});
	// số trong ngoặc của bảng: Đô, Sol, Rê, La, Mi, Si, Fa có hai; giọng phím đen không có
	assert.equal((h.match(/oz-ngon--mut" data-phim/g) ?? []).length, 14);
});

test('buổi 30 phút: khớp bảng "Buổi 30 phút (chuẩn)" của bat-dau/moi-ngay; thanh nối tiếp từ 0 đến 30', () => {
	const dong = bang('bat-dau/moi-ngay', '## Buổi 30 phút (chuẩn)');
	assert.deepEqual(BUOI_30.map(([, p]) => `${p} phút`), dong.map((d) => d[0]));
	BUOI_30.forEach(([ten], i) => assert.ok(dong[i][1].toLowerCase().includes(ten.split(',')[0].toLowerCase()), `${ten} / ${dong[i][1]}`));
	const h = HINH_PIANO_3['buoi-tap']();
	const muc = [...h.matchAll(/class="oz-tg-muc oz-tg--[a-z]+" style="left:([\d.]+)%;width:([\d.]+)%"><span>(\d+)<\/span>/g)].map((m) => [+m[1], +m[2], +m[3]]);
	let t = 0;
	for (const [trai, rong, p] of muc) {
		assert.ok(Math.abs(trai - (t / 30) * 100) < 0.01 && Math.abs(rong - (p / 30) * 100) < 0.01, `${p} phút`);
		t += p;
	}
	assert.equal(t, 30);
});

test('thang máy đếm nhịp: khớp bảng của piano/cach-tap; mỗi ngày bắt đầu thấp hơn mức cao nhất hôm trước', () => {
	const dong = bang('piano/cach-tap', '### Ví dụ một thang máy đếm nhịp');
	assert.deepEqual(THANG_MAY.map(([d, a, b]) => [String(d), `♩ = ${a}`, `♩ = ${b}`]), dong.map((d) => d.slice(0, 3)));
	for (let i = 1; i < THANG_MAY.length; i++) assert.ok(THANG_MAY[i][1] < THANG_MAY[i - 1][2]);
	const h = HINH_PIANO_3['thang-may']();
	for (const [, a, b] of THANG_MAY) {
		const m = new RegExp(`left:([\\d.]+)%;width:([\\d.]+)%"><span>${a} → ${b}</span>`).exec(h);
		assert.ok(m, `${a} → ${b}`);
		assert.ok(Math.abs(+m[1] - ((a - 58) / 20) * 100) < 0.01 && Math.abs(+m[2] - ((b - a) / 20) * 100) < 0.01);
	}
});

test('bước nhảy: chữ của hình có trong mục "Bước nhảy" của trang; nốt đích của cách đúng ở đúng phách 2', () => {
	const h = HINH_PIANO_3['buoc-nhay']();
	const s = doc('piano/quang-tam-buoc-nhay');
	for (const tu of ['vừa bay vừa đập xuống', 'vừa trễ vừa trượt', 'đến đích sớm', 'chạm nhẹ mặt phím', 'đánh đúng lúc', 'Đường đi thấp']) assert.ok(s.includes(tu), tu);
	assert.match(h, /left:50%;width:18\.75%"><span>đánh đúng lúc<\/span>/);
	assert.match(h, /left:56\.25%;width:18\.75%"><span>trễ, trượt<\/span>/);
});

test('::hinh{ten} dựng các hình của đợt 3a; hình tĩnh ký hiệu bàn đạp có đủ chữ của bảng', () => {
	for (const [ten, f] of Object.entries(HINH_PIANO_3)) {
		assert.equal(hinh(ten, 'piano/gam'), f());
		assert.match(f(), /data-sinh/);
		assert.match(f(), /role="img" aria-label="[^"]{20,}"/);
	}
	const bd = hinh('ky-hieu-ban-dap', 'piano/ban-dap');
	for (const chu of ['>Ped.<', '>✱<', 'nhấn', 'nhả rồi nhấn lại', '(đổi bàn đạp)', '(∧)']) assert.ok(bd.includes(chu), chu);
	// đường kẻ: vạch dọc ở hai đầu, một chỗ gãy nhọn ở đầu ô 2 (x 182, cùng chữ Ped. thứ hai)
	assert.match(bd, /<path d="M14 116V128H172L182 117L192 128H346V116"/);
	assert.match(bd, /<text x="184" y="91"[^>]*>Ped\.<\/text>/);
	assert.match(doc('piano/ban-dap'), /chỗ gãy nhọn \(∧\) trên đường kẻ là nhả rồi nhấn lại ngay \(đổi bàn đạp\)/);
});
