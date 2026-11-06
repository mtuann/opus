// Danh mục tác phẩm (D6-L11): ::danh-muc-tac-pham dựng từ src/data/ các trang tác phẩm có trong bản build, bộ lọc theo
// loại, chặng, thời kỳ, tác giả (src/scripts/danh-muc.js); trường chưa khóa của bản ghi coi như không có ở trang đã khóa.
// Sách in: chương tác phẩm đọc từ dữ liệu, giữ thứ tự đã có (chuongTacPham của src/sach/sach.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { canTaiScript, danhMucTacPham, mucDanhMuc } from '../src/plugins/thanh-phan.mjs';
import { docLoc, hop } from '../src/scripts/danh-muc.js';
import { SACH, THU_TU_TAC_PHAM, chuongTacPham } from '../src/sach/sach.mjs';
import { duLieuDaKiem } from '../src/du-lieu.mjs';
import { tatCaTrang } from '../src/ban-build.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const coDist = fs.existsSync(path.join(DIST, 'index.html'));

const nguoi = new Map([
	['bach', { id: 'bach', ten: 'Johann Sebastian Bach', sinh: 1685 }],
	['mozart', { id: 'mozart', ten: 'Wolfgang Amadeus Mozart', sinh: 1756 }],
	['liszt', { id: 'liszt', ten: 'Franz Liszt', sinh: 1811 }],
]);
const R = [
	{ slug: 'k545', loai: 'bai-hoc', tac_gia: 'mozart', ten: 'Sonata K. 545', chang: 5, grade: 'Grade 6', thoi_ky: 'Cổ điển', ky_nang_chinh: 'Alberti' },
	{ slug: 'prelude', loai: 'bai-hoc', tac_gia: 'bach', ten: 'Prelude', chang: 4, grade: 'Grade 4–5', thoi_ky: 'Baroque', ky_nang_chinh: 'Hợp âm rải' },
	// bài học dùng chung bản ghi với hướng dẫn nghe cùng tên (trang cap không có bản ghi riêng)
	{ slug: 'liebestraum', loai: 'bai-hoc', tac_gia: 'liszt', ten: '*Liebestraum*', chang: 7, grade: 'Sau Grade 8', thoi_ky: 'Lãng mạn', luyen_nghe: 'Cadenza', ky_nang_chinh: 'Quãng tám', cap: 'nghe-nhac/liebestraum' },
	{ slug: 'requiem', loai: 'nghe', tac_gia: 'mozart', ten: 'Requiem', thoi_ky: 'Cổ điển', luyen_nghe: 'Hợp xướng' },
	{ slug: 'goldberg', loai: 'nghe', tac_gia: 'bach', ten: 'Goldberg', thoi_ky: 'Baroque', luyen_nghe: 'Canon' },
];
const TRANG = ['piano/tac-pham/k545', 'piano/tac-pham/prelude', 'piano/tac-pham/liebestraum', 'nghe-nhac/liebestraum', 'nghe-nhac/requiem', 'nghe-nhac/goldberg'];
const ten = (h) => [...h.matchAll(/<p class="oz-dm-ten"><a href="\/opus\/([^"]+)\/">/g)].map((m) => m[1]);

test('mucDanhMuc: mỗi trang tác phẩm có trong bản build một mục, kể cả trang cap dùng chung bản ghi; chỉ trang có trong bản build', () => {
	const m = mucDanhMuc({ tacPham: R, nguoi, trang: TRANG });
	assert.deepEqual(m.map((x) => x.trang).sort(), [...TRANG].sort());
	const lt = m.find((x) => x.trang === 'nghe-nhac/liebestraum');
	assert.equal(lt.loai, 'nghe');
	assert.equal(lt.chang, undefined, 'trang nghe không có chặng');
	assert.equal(lt.moTa, 'Cadenza');
	assert.equal(lt.kem, 'piano/tac-pham/liebestraum');
	assert.equal(m.find((x) => x.trang === 'piano/tac-pham/liebestraum').moTa, 'Quãng tám');
	// thiếu trang trong bản build: không có mục
	assert.deepEqual(
		mucDanhMuc({ tacPham: R, nguoi, trang: ['nghe-nhac/requiem'] }).map((x) => x.trang),
		['nghe-nhac/requiem'],
	);
	// trang cap có bản ghi riêng thì không thành mục thứ hai của bản ghi này
	const rieng = [...R, { slug: 'liebestraum-x', loai: 'nghe', tac_gia: 'liszt', ten: 'X' }];
	rieng[2] = { ...R[2], cap: 'nghe-nhac/liebestraum-x' };
	const m2 = mucDanhMuc({ tacPham: rieng, nguoi, trang: [...TRANG, 'nghe-nhac/liebestraum-x'] });
	assert.equal(m2.filter((x) => x.trang === 'nghe-nhac/liebestraum-x').length, 1);
	assert.equal(m2.find((x) => x.trang === 'nghe-nhac/liebestraum-x').rec.slug, 'liebestraum-x');
});

test('mucDanhMuc: xếp theo năm sinh tác giả, rồi tên; theoChang: chặng, Grade trước', () => {
	assert.deepEqual(
		mucDanhMuc({ tacPham: R, nguoi, trang: TRANG }).map((x) => x.trang),
		['nghe-nhac/goldberg', 'piano/tac-pham/prelude', 'nghe-nhac/requiem', 'piano/tac-pham/k545', 'nghe-nhac/liebestraum', 'piano/tac-pham/liebestraum'],
	);
	assert.deepEqual(
		mucDanhMuc({ tacPham: R.filter((r) => r.loai === 'bai-hoc'), nguoi, trang: TRANG, theoChang: true })
			.filter((x) => x.loai === 'bai-hoc')
			.map((x) => x.rec.slug),
		['prelude', 'k545', 'liebestraum'],
	);
});

test('mucDanhMuc, danhMucTacPham: ở trang đã khóa không đọc trường chưa khóa (bản ghi qua chiDaKhoa); trường ấy không hiện', () => {
	const mo = new Set(['thoi_ky', 'ky_nang_chinh', 'luyen_nghe', 'cap']); // chưa khóa
	const daKhoa = (bo, id, t) => bo !== 'tac-pham' || !mo.has(t);
	const boc = (r) =>
		new Proxy(r, {
			get(o, k) {
				if (typeof k === 'string' && mo.has(k)) throw new Error(`đọc trường chưa khóa ${k}`);
				return Reflect.get(o, k);
			},
		});
	const h = danhMucTacPham({ tacPham: R.map(boc), nguoi, daKhoa }, { trang: TRANG });
	assert.doesNotMatch(h, /Baroque|Cadenza|Alberti|Cùng tác phẩm/);
	assert.doesNotMatch(h, /data-loc="thoi-ky"/, 'không có thời kỳ thì không có ô lọc thời kỳ');
	assert.match(h, /Chặng 4<\/a>, ≈ Grade 4–5/);
	// cap chưa khóa: trang cap dùng chung bản ghi không biết được, nên không có mục
	assert.equal(ten(h).length, 5);
});

test('danhMucTacPham: bộ lọc, mục, "sắp có" cho trang cùng tác phẩm chưa có trong bản build; loai lạ thì báo lỗi', () => {
	const h = danhMucTacPham({ tacPham: R, nguoi }, { trang: TRANG });
	assert.match(h, /^<div class="oz-danh-muc" data-sinh>/);
	for (const loc of ['loai', 'chang', 'thoi-ky', 'tac-gia']) assert.match(h, new RegExp(`<select id="oz-dm-${loc}" data-loc="${loc}">`), loc);
	assert.match(h, /<label class="oz-dm-o" for="oz-dm-chang"><span>Chặng<\/span>/);
	assert.match(h, /<option value="7">Chặng 7<\/option>/);
	// thời kỳ theo năm sinh nhỏ nhất của tác giả có mục mang thời kỳ ấy; tác giả theo năm sinh
	assert.deepEqual([...h.matchAll(/data-loc="thoi-ky">([\s\S]*?)<\/select>/g)][0][1].match(/value="[^"]+"/g), ['value="Baroque"', 'value="Cổ điển"', 'value="Lãng mạn"']);
	assert.deepEqual([...h.matchAll(/data-loc="tac-gia">([\s\S]*?)<\/select>/g)][0][1].match(/value="[^"]+"/g), ['value="bach"', 'value="mozart"', 'value="liszt"']);
	assert.match(h, /<li data-loai="bai-hoc" data-chang="7" data-thoi-ky="Lãng mạn" data-tac-gia="liszt"><p class="oz-dm-ten"><a href="\/opus\/piano\/tac-pham\/liebestraum\/">Liszt: <em>Liebestraum<\/em><\/a>/);
	assert.match(h, /<p class="oz-dm-kem">Cùng tác phẩm: <a href="\/opus\/nghe-nhac\/liebestraum\/">hướng dẫn nghe<\/a><\/p>/);
	assert.match(h, /Hiện 6 trên 6 trang\./);
	assert.match(h, /<p class="oz-dm-trong" hidden>/);
	// trang cùng tác phẩm chưa có trong bản build: "sắp có", không thành mục
	const thieu = danhMucTacPham({ tacPham: R, nguoi }, { trang: TRANG.filter((t) => t !== 'nghe-nhac/liebestraum') });
	assert.match(thieu, /Cùng tác phẩm: <span class="oz-sap-co" data-href="\/opus\/nghe-nhac\/liebestraum\/"[^>]*>hướng dẫn nghe <span class="oz-sap-co-nhan"/);
	// loai="bai-hoc": chỉ bài học, xếp theo chặng, không có ô lọc loại hay chữ loại
	const bh = danhMucTacPham({ loai: 'bai-hoc', tacPham: R, nguoi }, { trang: TRANG });
	assert.deepEqual(ten(bh), ['piano/tac-pham/prelude', 'piano/tac-pham/k545', 'piano/tac-pham/liebestraum']);
	assert.doesNotMatch(bh, /data-loc="loai"|oz-dm-loai/);
	// loai="nghe": không có chặng
	assert.doesNotMatch(danhMucTacPham({ loai: 'nghe', tacPham: R, nguoi }, { trang: TRANG }), /data-loc="chang"|data-chang/);
	assert.throws(() => danhMucTacPham({ loai: 'x', tacPham: R, nguoi }, { trang: TRANG }), /loai "x"/);
	assert.match(danhMucTacPham({ loai: 'nghe', tacPham: R, nguoi }, { trang: ['index'] }), /^<p class="oz-danh-muc-trong" data-sinh>Chưa có hướng dẫn nghe nào/);
});

test('danh-muc.js: hop so data-* của mục với lựa chọn (cả tên có gạch nối); docLoc bỏ ô "Tất cả"', () => {
	const ds = { loai: 'bai-hoc', chang: '4', thoiKy: 'Baroque', tacGia: 'bach' };
	assert.equal(hop(ds, {}), true);
	assert.equal(hop(ds, { chang: '4', 'thoi-ky': 'Baroque', 'tac-gia': 'bach' }), true);
	assert.equal(hop(ds, { chang: '5' }), false);
	assert.equal(hop({ loai: 'nghe' }, { chang: '4' }), false, 'mục không có chặng không hợp lựa chọn chặng');
	assert.deepEqual(docLoc([{ value: '', dataset: { loc: 'loai' } }, { value: '3', dataset: { loc: 'chang' } }]), { chang: '3' });
});

test('chuongTacPham: thứ tự đã có giữ nguyên; bài học mới chen theo chặng, hướng dẫn nghe mới thêm cuối; cap dùng chung bản ghi', () => {
	const tp = duLieuDaKiem()['tac-pham'];
	// dữ liệu hiện có: đúng thứ tự cũ (BOOKS của books.py)
	assert.deepEqual(chuongTacPham('bai-hoc', tp), THU_TU_TAC_PHAM['bai-hoc'].map((n) => `piano/tac-pham/${n}/`));
	assert.deepEqual(chuongTacPham('nghe', tp), THU_TU_TAC_PHAM.nghe.map((n) => `nghe-nhac/${n}/`));
	const thuTu = ['a2', 'b3', 'c5'];
	const ds = [
		{ slug: 'c5', loai: 'bai-hoc', chang: 5 },
		{ slug: 'a2', loai: 'bai-hoc', chang: 2 },
		{ slug: 'b3', loai: 'bai-hoc', chang: 3, cap: 'nghe-nhac/b3' },
		{ slug: 'moi3', loai: 'bai-hoc', chang: 3 },
		{ slug: 'moi7', loai: 'bai-hoc', chang: 7 },
		{ slug: 'n1', loai: 'nghe' },
		{ slug: 'nmoi', loai: 'nghe' },
	];
	assert.deepEqual(chuongTacPham('bai-hoc', ds, thuTu), ['a2', 'b3', 'moi3', 'c5', 'moi7'].map((n) => `piano/tac-pham/${n}/`));
	assert.deepEqual(chuongTacPham('nghe', ds, ['b3', 'n1']), ['nghe-nhac/b3/', 'nghe-nhac/n1/', 'nghe-nhac/nmoi/']);
	// trang trong thứ tự cũ mà dữ liệu không còn thì bỏ
	assert.deepEqual(chuongTacPham('nghe', [{ slug: 'n1', loai: 'nghe' }], ['x', 'n1']), ['nghe-nhac/n1/']);
	// hai cuốn có tác phẩm đọc từ đây
	assert.deepEqual(SACH.find((s) => s.id === 'piano-tac-pham').trang.slice(2), chuongTacPham('bai-hoc'));
	assert.deepEqual(SACH.find((s) => s.id === 'huong-dan-nghe').trang.slice(1), chuongTacPham('nghe'));
});

test('dist/: danh mục ở hai trang mục lục liệt kê đúng các trang tác phẩm có trong bản build', { skip: !coDist && 'chưa build' }, () => {
	const tp = duLieuDaKiem()['tac-pham'];
	const coTrang = (t) => fs.existsSync(path.join(DIST, t, 'index.html'));
	const chinh = tp.map((r) => (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug);
	const capChung = tp.filter((r) => r.cap && !chinh.includes(r.cap)).map((r) => r.cap);
	const tatCa = [...chinh, ...capChung].filter(coTrang).sort();
	for (const [trang, loc] of [
		['piano/tac-pham', (t) => t.startsWith('piano/tac-pham/')],
		['nghe-nhac', () => true],
	]) {
		const f = path.join(DIST, trang, 'index.html');
		if (!fs.existsSync(f)) continue;
		const h = fs.readFileSync(f, 'utf8');
		const ds = ten(h);
		assert.deepEqual([...ds].sort(), tatCa.filter(loc), trang);
		assert.equal(new Set(ds).size, ds.length, `${trang}: trùng mục`);
		assert.match(h, new RegExp(`Hiện ${ds.length} trên ${ds.length} trang\\.`));
		// trang mục lục có danh mục thì tải bộ tải thành phần (script lọc)
		assert.ok(canTaiScript(h), `${trang}: không tải bộ tải thành phần`);
	}
	assert.ok(tatCaTrang().includes('nghe-nhac/index') && tatCaTrang().includes('piano/tac-pham/index'));
});
