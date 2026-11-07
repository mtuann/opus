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
import { chiDaKhoa, coTruongDaKhoa, duLieuDaKiem } from '../src/du-lieu.mjs';
import { truongDaKhoa } from '../src/khoa.mjs';
import { banGhiCuaTrang, tatCaTrang } from '../src/ban-build.mjs';
import { parse } from 'yaml';
import { banGhiKhung, trangChinh, trangKhung } from '../tools/them-tac-pham.mjs';

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
// trang -> bản ghi, như frontmatter tac_pham (banGhiCuaTrang): trang cap nghe-nhac/liebestraum dùng chung bản ghi liebestraum
const CUA = new Map(TRANG.map((t) => [t, t.split('/').pop()]));
const ten = (h) => [...h.matchAll(/<p class="oz-dm-ten"><a href="\/opus\/([^"]+)\/">/g)].map((m) => m[1]);

test('mucDanhMuc: mỗi trang tác phẩm có trong bản build một mục, kể cả trang cap dùng chung bản ghi; chỉ trang có trong bản build', () => {
	const m = mucDanhMuc({ tacPham: R, nguoi, trang: TRANG, cuaTrang: CUA });
	assert.deepEqual(m.map((x) => x.trang).sort(), [...TRANG].sort());
	const lt = m.find((x) => x.trang === 'nghe-nhac/liebestraum');
	assert.equal(lt.loai, 'nghe');
	assert.equal(lt.chang, undefined, 'trang nghe không có chặng');
	assert.equal(lt.moTa, 'Cadenza');
	assert.equal(lt.kem, 'piano/tac-pham/liebestraum');
	assert.equal(m.find((x) => x.trang === 'piano/tac-pham/liebestraum').moTa, 'Quãng tám');
	// thiếu trang trong bản build: không có mục
	assert.deepEqual(
		mucDanhMuc({ tacPham: R, nguoi, trang: ['nghe-nhac/requiem'], cuaTrang: CUA }).map((x) => x.trang),
		['nghe-nhac/requiem'],
	);
	// trang cap có bản ghi riêng thì không thành mục thứ hai của bản ghi này
	const rieng = [...R, { slug: 'liebestraum-x', loai: 'nghe', tac_gia: 'liszt', ten: 'X' }];
	rieng[2] = { ...R[2], cap: 'nghe-nhac/liebestraum-x' };
	const cua2 = new Map([...CUA].filter(([t]) => t !== 'nghe-nhac/liebestraum'));
	cua2.set('nghe-nhac/liebestraum-x', 'liebestraum-x');
	const m2 = mucDanhMuc({ tacPham: rieng, nguoi, trang: [...TRANG, 'nghe-nhac/liebestraum-x'], cuaTrang: cua2 });
	assert.equal(m2.filter((x) => x.trang === 'nghe-nhac/liebestraum-x').length, 1);
	assert.equal(m2.find((x) => x.trang === 'nghe-nhac/liebestraum-x').rec.slug, 'liebestraum-x');
	// trang cùng tác phẩm của trang chính: trang cap (có bản ghi riêng) khi cap đọc được
	assert.equal(m2.find((x) => x.trang === 'piano/tac-pham/liebestraum').kem, 'nghe-nhac/liebestraum-x');
	// trang trong bản build mà frontmatter không khai tac_pham (như mục lục), hay bản ghi không có trong tacPham: không có mục
	assert.deepEqual(mucDanhMuc({ tacPham: R.filter((r) => r.slug !== 'goldberg'), nguoi, trang: [...TRANG, 'nghe-nhac/index'], cuaTrang: CUA }).map((x) => x.trang).sort(), TRANG.filter((t) => t !== 'nghe-nhac/goldberg').sort());
});

test('mucDanhMuc: xếp theo năm sinh tác giả, rồi tên; theoChang: chặng, Grade trước', () => {
	assert.deepEqual(
		mucDanhMuc({ tacPham: R, nguoi, trang: TRANG, cuaTrang: CUA }).map((x) => x.trang),
		['nghe-nhac/goldberg', 'piano/tac-pham/prelude', 'nghe-nhac/requiem', 'piano/tac-pham/k545', 'nghe-nhac/liebestraum', 'piano/tac-pham/liebestraum'],
	);
	assert.deepEqual(
		mucDanhMuc({ tacPham: R.filter((r) => r.loai === 'bai-hoc'), nguoi, trang: TRANG, cuaTrang: CUA, theoChang: true })
			.filter((x) => x.loai === 'bai-hoc')
			.map((x) => x.rec.slug),
		['prelude', 'k545', 'liebestraum'],
	);
});

test('mucDanhMuc, danhMucTacPham: ở trang đã khóa không đọc trường chưa khóa (bản ghi qua chiDaKhoa); trường ấy không hiện', () => {
	const mo = new Set(['loai', 'thoi_ky', 'ky_nang_chinh', 'luyen_nghe', 'cap']); // chưa khóa
	const daKhoa = (bo, id, t) => bo !== 'tac-pham' || !mo.has(t);
	const boc = (r) =>
		new Proxy(r, {
			get(o, k) {
				if (typeof k === 'string' && mo.has(k)) throw new Error(`đọc trường chưa khóa ${k}`);
				return Reflect.get(o, k);
			},
		});
	const h = danhMucTacPham({ tacPham: R.map(boc), nguoi, daKhoa }, { trang: TRANG, cuaTrang: CUA });
	assert.doesNotMatch(h, /Baroque|Cadenza|Alberti/);
	assert.doesNotMatch(h, /data-loc="thoi-ky"/, 'không có thời kỳ thì không có ô lọc thời kỳ');
	assert.match(h, /Chặng 4<\/a>, ≈ Grade 4–5/);
	// cap, loai chưa khóa: trang nào thuộc bản ghi nào đọc từ frontmatter (khóa cùng trang), nên trang cap dùng chung bản ghi
	// vẫn có mục, loại theo đường dẫn, và hai trang trỏ sang nhau
	assert.equal(ten(h).length, 6);
	assert.match(h, /<li data-loai="nghe" data-tac-gia="liszt"><p class="oz-dm-ten"><a href="\/opus\/nghe-nhac\/liebestraum\/">/);
	assert.match(h, /Cùng tác phẩm: <a href="\/opus\/nghe-nhac\/liebestraum\/">hướng dẫn nghe<\/a>/);
});

test('danhMucTacPham: bộ lọc, mục, "sắp có" cho trang cùng tác phẩm chưa có trong bản build; loai lạ thì báo lỗi', () => {
	const h = danhMucTacPham({ tacPham: R, nguoi }, { trang: TRANG, cuaTrang: CUA });
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
	const thieu = danhMucTacPham({ tacPham: R, nguoi }, { trang: TRANG.filter((t) => t !== 'nghe-nhac/liebestraum'), cuaTrang: CUA });
	assert.match(thieu, /Cùng tác phẩm: <span class="oz-sap-co" data-href="\/opus\/nghe-nhac\/liebestraum\/"[^>]*>hướng dẫn nghe <span class="oz-sap-co-nhan"/);
	// loai="bai-hoc": chỉ bài học, xếp theo chặng, không có ô lọc loại hay chữ loại
	const bh = danhMucTacPham({ loai: 'bai-hoc', tacPham: R, nguoi }, { trang: TRANG, cuaTrang: CUA });
	assert.deepEqual(ten(bh), ['piano/tac-pham/prelude', 'piano/tac-pham/k545', 'piano/tac-pham/liebestraum']);
	assert.doesNotMatch(bh, /data-loc="loai"|oz-dm-loai/);
	// loai="nghe": không có chặng
	assert.doesNotMatch(danhMucTacPham({ loai: 'nghe', tacPham: R, nguoi }, { trang: TRANG, cuaTrang: CUA }), /data-loc="chang"|data-chang/);
	assert.throws(() => danhMucTacPham({ loai: 'x', tacPham: R, nguoi }, { trang: TRANG, cuaTrang: CUA }), /loai "x"/);
	assert.match(danhMucTacPham({ loai: 'nghe', tacPham: R, nguoi }, { trang: ['index'], cuaTrang: CUA }), /^<p class="oz-danh-muc-trong" data-sinh>Chưa có hướng dẫn nghe nào/);
});

test('khoa.json hiện tại, trang mục lục đã khóa: trang cap dùng chung bản ghi vào danh mục dù cap của bản ghi chưa khóa', () => {
	// như plugin dựng ở trang đã khóa (opus-markdown.mjs): bản ghi qua chiDaKhoa, bỏ bản ghi chưa khóa trường nào; giả như mọi
	// trang trong src/content/docs/ có trong bản build (bản thật: khi chúng đã khóa)
	const daKhoa = truongDaKhoa();
	const du = duLieuDaKiem();
	const tacPham = du['tac-pham'].map((r) => chiDaKhoa(r, 'tac-pham', 'kiểm thử danh mục', daKhoa)).filter((r) => coTruongDaKhoa(r, 'tac-pham', daKhoa));
	const nguoiK = new Map(du['nha-soan-nhac'].map((r) => [r.id, chiDaKhoa(r, 'nha-soan-nhac', 'kiểm thử danh mục', daKhoa)]));
	const h = danhMucTacPham({ tacPham, nguoi: nguoiK, daKhoa }, { trang: tatCaTrang() });
	const ds = ten(h);
	for (const t of ['nghe-nhac/beethoven-moonlight', 'nghe-nhac/liszt-liebestraum', 'nghe-nhac/schubert-impromptu'])
		if (tatCaTrang().includes(t)) assert.ok(ds.includes(t), `${t} không có trong danh mục`);
	assert.equal(new Set(ds).size, ds.length, 'trùng mục');
});

test('danh-muc.js: hop so data-* của mục với lựa chọn (cả tên có gạch nối); docLoc bỏ ô "Tất cả"', () => {
	const ds = { loai: 'bai-hoc', chang: '4', thoiKy: 'Baroque', tacGia: 'bach' };
	assert.equal(hop(ds, {}), true);
	assert.equal(hop(ds, { chang: '4', 'thoi-ky': 'Baroque', 'tac-gia': 'bach' }), true);
	assert.equal(hop(ds, { chang: '5' }), false);
	assert.equal(hop({ loai: 'nghe' }, { chang: '4' }), false, 'mục không có chặng không hợp lựa chọn chặng');
	assert.deepEqual(docLoc([{ value: '', dataset: { loc: 'loai' } }, { value: '3', dataset: { loc: 'chang' } }]), { chang: '3' });
});

/** Trang -> bản ghi của các bản ghi trong bộ nhớ: trang chính, và trang cap không phải trang chính của bản ghi khác. */
const cuaTu = (ds) => {
	const m = new Map(ds.map((r) => [trangChinh(r.slug, r.loai), r.slug]));
	for (const r of ds) if (r.cap && !m.has(r.cap)) m.set(r.cap, r.slug);
	return m;
};

test('chuongTacPham: thứ tự đã có giữ nguyên; bài học mới chen theo chặng, hướng dẫn nghe mới thêm cuối; cap dùng chung bản ghi', () => {
	const tp = duLieuDaKiem()['tac-pham'];
	// dữ liệu hiện có: các trang của thứ tự cũ (BOOKS của books.py) giữ đúng thứ tự ấy; tác phẩm thêm sau (them-tac-pham.mjs,
	// nhánh them/<slug> không sửa src/sach/ hay tests/) chen vào mà không làm hỏng phép thử
	// (chương lấy theo frontmatter của trang, nên trang chưa chuyển sang site mới chưa thành chương)
	const cua = banGhiCuaTrang();
	for (const loai of ['bai-hoc', 'nghe']) {
		const goc = loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/';
		const cu = THU_TU_TAC_PHAM[loai].filter((n) => cua.has(goc + n)).map((n) => `${goc}${n}/`);
		assert.ok(cu.length > 0, loai);
		const ds = chuongTacPham(loai, tp);
		assert.deepEqual(ds.filter((t) => cu.includes(t)), cu, loai);
		assert.equal(new Set(ds).size, ds.length, `${loai}: trùng chương`);
	}
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
	assert.deepEqual(chuongTacPham('bai-hoc', ds, thuTu, cuaTu(ds)), ['a2', 'b3', 'moi3', 'c5', 'moi7'].map((n) => `piano/tac-pham/${n}/`));
	assert.deepEqual(chuongTacPham('nghe', ds, ['b3', 'n1'], cuaTu(ds)), ['nghe-nhac/b3/', 'nghe-nhac/n1/', 'nghe-nhac/nmoi/']);
	// trang trong thứ tự cũ mà dữ liệu không còn thì bỏ
	const mot = [{ slug: 'n1', loai: 'nghe' }];
	assert.deepEqual(chuongTacPham('nghe', mot, ['x', 'n1'], cuaTu(mot)), ['nghe-nhac/n1/']);
	// hai cuốn có tác phẩm đọc từ đây
	assert.deepEqual(SACH.find((s) => s.id === 'piano-tac-pham').trang.slice(2), chuongTacPham('bai-hoc'));
	assert.deepEqual(SACH.find((s) => s.id === 'huong-dan-nghe').trang.slice(1), chuongTacPham('nghe'));
});

test('chuongTacPham: thứ tự cũ không tăng dần theo chặng: bài mới chen trước bài đầu tiên có chặng lớn hơn', () => {
	// chặng 4 rồi 5, 6, rồi một bài chặng 4 lạc giữa vùng 5–6: bài chặng 4 mới đứng trước bài chặng 5 đầu tiên, không sau bài lạc
	const ds = [
		['a3', 3], ['b4', 4], ['c5', 5], ['d6', 6], ['e4', 4], ['f6', 6], ['moi4', 4], ['moi4b', 4], ['moi1', 1], ['moi9', 9],
	].map(([slug, chang]) => ({ slug, loai: 'bai-hoc', chang }));
	assert.deepEqual(
		chuongTacPham('bai-hoc', ds, ['a3', 'b4', 'c5', 'd6', 'e4', 'f6'], cuaTu(ds)),
		['moi1', 'a3', 'b4', 'moi4', 'moi4b', 'c5', 'd6', 'e4', 'f6', 'moi9'].map((n) => `piano/tac-pham/${n}/`),
	);
});

test('chuongTacPham: bản ghi mới như them-tac-pham.mjs tạo (bản ghi và trang khung) tự vào đúng một cuốn, một lần', () => {
	const du = duLieuDaKiem();
	const tp = du['tac-pham'];
	const nguoiThat = new Map(du['nha-soan-nhac'].map((p) => [p.id, p]));
	const cua = banGhiCuaTrang();
	const tacGia = tp.find((r) => r.tac_gia).tac_gia;
	for (const [o, cuon, khac] of [
		[{ slug: 'thu-bai-moi', loai: 'bai-hoc', tacGia, ten: 'Bài thử', chang: 4, grade: 'Grade 4' }, 'bai-hoc', 'nghe'],
		[{ slug: 'thu-nghe-moi', loai: 'nghe', tacGia, ten: 'Bản thử' }, 'nghe', 'bai-hoc'],
	]) {
		const r = banGhiKhung(o, nguoiThat);
		const trang = trangChinh(r.slug, r.loai);
		const fm = parse(/^---\n([\s\S]*?)\n---/.exec(trangKhung(r, nguoiThat))[1]);
		assert.equal(fm.tac_pham, r.slug, 'trang khung khai tac_pham');
		const cua2 = new Map([...cua, [trang, fm.tac_pham]]);
		const ds = chuongTacPham(cuon, [...tp, r], undefined, cua2);
		assert.equal(ds.filter((t) => t === `${trang}/`).length, 1, `${o.slug}: không vào ${cuon} đúng một lần`);
		assert.deepEqual(ds.filter((t) => t !== `${trang}/`), chuongTacPham(cuon, tp, undefined, cua), `${o.slug}: chương cũ đổi`);
		assert.ok(!chuongTacPham(khac, [...tp, r], undefined, cua2).includes(`${trang}/`), `${o.slug}: lọt vào cuốn kia`);
		if (cuon === 'bai-hoc') {
			// chen trước bài đầu tiên có chặng lớn hơn
			const chang = new Map(tp.filter((x) => x.loai === 'bai-hoc').map((x) => [`piano/tac-pham/${x.slug}/`, x.chang]));
			const i = ds.indexOf(`${trang}/`);
			assert.ok(i === ds.length - 1 || chang.get(ds[i + 1]) > o.chang, `${o.slug}: chen sai chỗ`);
			assert.ok(ds.slice(0, i).every((t) => !(chang.get(t) > o.chang)), `${o.slug}: có bài chặng lớn hơn đứng trước`);
		}
	}
});

test('dist/: danh mục ở hai trang mục lục liệt kê đúng các trang tác phẩm có trong bản build', { skip: !coDist && 'chưa build' }, () => {
	const coTrang = (t) => fs.existsSync(path.join(DIST, t, 'index.html'));
	// trang tác phẩm: trang khai tac_pham ở frontmatter (cách danh mục nhận trang của bản ghi), có trong bản build
	const cuaTrang = banGhiCuaTrang();
	const tatCa = [...cuaTrang.keys()].filter(coTrang).sort();
	// trang mục lục đã khóa bỏ qua bản ghi chưa khóa trường nào (coTruongDaKhoa): ở bản xem, bản ghi đang mở khóa cả bản
	// ghi (như khi thêm hinh vào bản ghi đã khóa) thì trang của nó có trong bản build mà không vào danh mục
	const khoa = JSON.parse(fs.readFileSync(path.join(ROOT, 'kiem-dinh/khoa.json'), 'utf8'));
	const daKhoa = truongDaKhoa();
	const coKhoa = (t) => coTruongDaKhoa({ slug: cuaTrang.get(t) }, 'tac-pham', daKhoa);
	for (const [trang, loc] of [
		['piano/tac-pham', (t) => t.startsWith('piano/tac-pham/')],
		['nghe-nhac', () => true],
	]) {
		const f = path.join(DIST, trang, 'index.html');
		if (!fs.existsSync(f)) continue;
		const h = fs.readFileSync(f, 'utf8');
		const ds = ten(h);
		const trangKhoa = `${trang}/index` in khoa.trang;
		assert.deepEqual([...ds].sort(), tatCa.filter(loc).filter((t) => !trangKhoa || coKhoa(t)), trang);
		assert.equal(new Set(ds).size, ds.length, `${trang}: trùng mục`);
		assert.match(h, new RegExp(`Hiện ${ds.length} trên ${ds.length} trang\\.`));
		// trang mục lục có danh mục thì tải bộ tải thành phần (script lọc)
		assert.ok(canTaiScript(h), `${trang}: không tải bộ tải thành phần`);
	}
	assert.ok(tatCaTrang().includes('nghe-nhac/index') && tatCaTrang().includes('piano/tac-pham/index'));
});
