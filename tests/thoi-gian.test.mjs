// Kiểm thử lưới phách, dải thời gian (thành phần B, đợt hình 2a; src/scripts/ve-thoi-gian.js): mô tả hình hợp lệ, HTML có
// tên đọc được và data-sinh, vị trí mục đúng tỉ lệ thời gian, số liệu khớp chữ trang (hai chọi ba, ba chọi bốn, nhịp, trường
// độ), ::hinh{ten} dựng hình. Hiển thị trên trình duyệt thật: tests/trinh-duyet/kiem-thoi-gian.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { HINH_THOI_GIAN, hinhNot, kiemMoTa, veThoiGian } from '../src/scripts/ve-thoi-gian.js';

const DOCS = path.resolve(import.meta.dirname, '..', 'src/content/docs');

function dung(md, trang = 'nhac-ly/04-nhip') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}

/** Các hàng của hình: [{ ten, muc: [{ lop, trai, rong, chu }] }] (vị trí theo phần trăm). */
function hang(html) {
	return [...html.matchAll(/<div class="oz-tg-hang[^"]*"[^>]*><span class="oz-tg-ten">(.*?)<\/span><div class="oz-tg-truc">(.*?)<\/div><\/div>/g)].map(([, ten, truc]) => ({
		ten: ten.replace(/<svg.*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim(),
		muc: [...truc.matchAll(/<span class="oz-tg-muc oz-tg--([a-z-]+)" style="left:([\d.]+)%;width:([\d.]+)%[^"]*">(?:<span>(.*?)<\/span>)?<\/span>/g)].map(([, lop, trai, rong, chu = '']) => ({
			lop,
			trai: +trai,
			rong: +rong,
			chu: chu.replace(/<svg.*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
		})),
	}));
}
const tim = (html, ten) => hang(html).find((h) => h.ten.startsWith(ten));
const gan = (a, b) => Math.abs(a - b) < 0.01;

test('mọi hình: dựng được, có figure data-sinh, role="img" và aria-label, mục nằm trong trục', () => {
	assert.ok(Object.keys(HINH_THOI_GIAN).length >= 12);
	for (const [ten, f] of Object.entries(HINH_THOI_GIAN)) {
		const h = f();
		assert.match(h, /^<figure class="oz-figure oz-tg[^"]*not-content" data-sinh><div class="oz-tg-khung" role="img" aria-label="[^"]{20,}">/, ten);
		assert.match(h, /<figcaption>[^<]/, ten);
		const r = hang(h);
		assert.ok(r.length >= 2, `${ten}: ít nhất hai hàng`);
		for (const { muc } of r) for (const m of muc) assert.ok(m.trai >= 0 && m.rong > 0 && m.trai + m.rong <= 100.001, `${ten}: ${JSON.stringify(m)}`);
	}
});

test('kiemMoTa: bắt mục ra ngoài trục, làn sai, vạch sai, thiếu moTa', () => {
	const r = (muc, them = {}) => ({ n: 4, moTa: 'x', hang: [{ ten: 'a', muc, ...them }] });
	assert.equal(kiemMoTa(r([{ bat: 0, dai: 4 }])), null);
	assert.match(kiemMoTa(r([{ bat: 2, dai: 3 }])), /ra ngoài trục/);
	assert.match(kiemMoTa(r([{ bat: -1, dai: 1 }])), /ra ngoài trục/);
	assert.match(kiemMoTa(r([{ bat: 0, dai: 0 }])), /ra ngoài trục/);
	assert.match(kiemMoTa(r([{ bat: 0, dai: 1, lan: 1 }])), /làn/);
	assert.equal(kiemMoTa(r([{ bat: 0, dai: 1, lan: 1 }], { lan: 2 })), null);
	assert.match(kiemMoTa(r([{ bat: 0, dai: 1 }], { vach: [5] })), /vạch/);
	assert.match(kiemMoTa({ n: 4, moTa: '', hang: [] }), /moTa/);
	assert.match(kiemMoTa({ n: 0, moTa: 'x', hang: [] }), /n phải/);
	assert.throws(() => veThoiGian(r([{ bat: 3, dai: 2 }])), /hình thời gian: hàng 0/);
});

test('làn: mục ở làn 1 của hàng hai làn nằm nửa dưới', () => {
	const h = veThoiGian({ n: 2, moTa: 'x', hang: [{ ten: 'a', lan: 2, muc: [{ bat: 0, dai: 1 }, { bat: 1, dai: 1, lan: 1 }] }] });
	assert.match(h, /style="--lan:2"/);
	assert.match(h, /left:50%;width:50%;top:50%;height:50%/);
});

test('hai chọi ba (piano/hai-tay, bảng Lưới 6): tay phải ở 1, 3, 5; tay trái ở 1, 4; Một – ly cà phê ở 1, 3, 4, 5', () => {
	const h = HINH_THOI_GIAN['hai-choi-ba']();
	const vi = (ten) => tim(h, ten).muc.map((m) => Math.round((m.trai / 100) * 6) + 1);
	assert.deepEqual(vi('Tay phải'), [1, 3, 5]);
	assert.deepEqual(vi('Tay trái'), [1, 4]);
	assert.deepEqual(vi('Câu đọc'), [1, 3, 4, 5]);
	assert.deepEqual(tim(h, 'Câu đọc').muc.map((m) => m.chu), ['Một', 'ly', 'cà', 'phê']);
	// ba nốt đều, hai nốt đều, cùng một phách
	for (const [ten, so] of [['Tay phải', 3], ['Tay trái', 2]]) for (const m of tim(h, ten).muc) assert.ok(gan(m.rong, 100 / so));
});

test('ba chọi bốn (bảng Lưới 12): tay phải 1, 4, 7, 10; tay trái 1, 5, 9; hình chung 3 – 1 – 2 – 2 – 1 – 3 khớp hai tay', () => {
	const h = HINH_THOI_GIAN['ba-choi-bon']();
	const vi = (ten) => tim(h, ten).muc.map((m) => Math.round((m.trai / 100) * 12));
	assert.deepEqual(vi('Tay phải').map((x) => x + 1), [1, 4, 7, 10]);
	assert.deepEqual(vi('Tay trái').map((x) => x + 1), [1, 5, 9]);
	const chung = [...new Set([...vi('Tay phải'), ...vi('Tay trái')])].sort((a, b) => a - b);
	const khoang = chung.map((x, i) => (chung[i + 1] ?? 12) - x);
	assert.deepEqual(khoang, [3, 1, 2, 2, 1, 3]);
	assert.deepEqual(tim(h, 'Hình chung').muc.map((m) => +m.chu), khoang);
	assert.deepEqual(tim(h, 'Hình chung').muc.map((m) => Math.round((m.rong / 100) * 12)), khoang);
	// đọc "một hai ba" bốn lần; tay trái đánh ở "một" đầu, "hai" nhóm hai, "ba" nhóm ba
	const doc = tim(h, 'Đọc').muc.map((m) => m.chu);
	assert.deepEqual(vi('Tay trái').map((x) => doc[x]), ['một', 'hai', 'ba']);
});

test('nhịp (nhac-ly/04-nhip): cảm giác theo bảng, nhịp đơn chia đôi, 6/8 chia ba, 3/4 và 6/8 cùng sáu móc đơn', () => {
	const r = hang(HINH_THOI_GIAN.nhip());
	const nhom = {};
	for (let i = 0; i < r.length; i += 2) nhom[r[i].ten] = [r[i].muc, r[i + 1].muc];
	assert.deepEqual(Object.keys(nhom), ['2/4', '3/4', '4/4', '6/8']);
	const cam = (t) => nhom[t][0].map((m) => m.chu).join(' – ');
	assert.equal(cam('2/4'), 'MẠNH – nhẹ');
	assert.equal(cam('3/4'), 'MẠNH – nhẹ – nhẹ');
	assert.equal(cam('4/4'), 'MẠNH – nhẹ – vừa – nhẹ');
	assert.deepEqual(nhom['6/8'][1].map((m) => m.chu), ['1', '2', '3', '4', '5', '6']);
	for (const [t, chia] of [['2/4', 2], ['3/4', 2], ['4/4', 2], ['6/8', 3]]) {
		const [phach, moc] = nhom[t];
		assert.equal(moc.length, phach.length * chia, t);
		for (const m of phach) assert.ok(gan(m.rong, (chia / 8) * 100), t);
	}
	assert.ok(gan(nhom['3/4'][1].at(-1).trai, nhom['6/8'][1].at(-1).trai));
	// phách mạnh tô đậm, vừa tô vừa
	assert.deepEqual(nhom['4/4'][0].map((m) => m.lop), ['manh', 'nhe', 'vua', 'nhe']);
});

test('trường độ (nhac-ly/03-truong-do): 1 tròn = 2 trắng = 4 đen = 8 móc đơn = 16 móc kép trên 4 phách; chấm dôi 2 + 1, 1 + ½', () => {
	const r = hang(HINH_THOI_GIAN['truong-do']());
	assert.deepEqual(
		r.slice(1).map((h) => [h.ten, h.muc.length]),
		[['Nốt tròn (4 phách)', 1], ['Nốt trắng (2 phách)', 2], ['Nốt đen (1 phách)', 4], ['Nốt móc đơn (½ phách)', 8], ['Nốt móc kép (¼ phách)', 16]],
	);
	for (const h of r.slice(1)) for (const m of h.muc) assert.ok(gan(m.rong, 100 / h.muc.length));
	const c = hang(HINH_THOI_GIAN['cham-doi']());
	assert.deepEqual(c[1].muc.map((m) => [m.chu, m.rong]), [['2', 50], ['+ 1', 25]]);
	assert.deepEqual(c[2].muc.map((m) => [m.chu, m.rong]), [['1', 25], ['+ ½', 12.5]]);
});

test('legato (piano/tieng-dan): hở có khe, nối đúng chạm nhau, legatissimo chồng ít, dính chồng nhiều hơn', () => {
	const r = hang(HINH_THOI_GIAN.legato());
	const chong = (h) => h.muc[0].trai + h.muc[0].rong - h.muc[1].trai;
	const [ho, dung_, legatissimo, dinh] = r.map(chong);
	assert.ok(ho < 0 && gan(dung_, 0) && legatissimo > 0 && dinh > legatissimo, `${ho} ${dung_} ${legatissimo} ${dinh}`);
});

test('hình nốt: tròn và trắng đầu rỗng, đen đặc, móc đơn một móc, móc kép hai móc, chấm dôi', () => {
	assert.match(hinhNot('tron'), /fill="none"/);
	assert.doesNotMatch(hinhNot('tron'), /<path/);
	assert.match(hinhNot('trang'), /fill="none"/);
	assert.doesNotMatch(hinhNot('den'), /fill="none" stroke/);
	assert.equal(hinhNot('don').match(/<path/g).length, 2);
	assert.equal(hinhNot('kep').match(/<path/g).length, 3);
	assert.match(hinhNot('trang', { cham: true }), /<circle/);
	assert.match(hinhNot('den'), /aria-hidden="true"/);
});

test('::hinh{ten} dựng hình thời gian', () => {
	const h = dung('::hinh{ten="nhip"}\n');
	assert.match(h, /class="oz-figure oz-tg not-content" data-sinh/);
	assert.match(dung('::hinh{ten="hai-choi-ba"}\n', 'piano/hai-tay'), /Tay phải \(chơi ba\)/);
});
