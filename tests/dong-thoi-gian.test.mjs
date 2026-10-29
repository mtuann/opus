// Kiểm thử thành phần của lô D5-L1: dòng thời gian nhà soạn nhạc (::dong-thoi-gian), bảng dữ liệu của nó
// (::bang-nha-soan-nhac), biểu đồ vòng đời từ 1650 (::hinh{ten="lifespans"}), cùng dựng từ src/data/nha-soan-nhac.yml
// (src/scripts/dong-thoi-gian.js); và năm sinh–mất viết cạnh tên trong chữ các trang lich-su/ phải khớp dữ liệu.
// Chạy thẳng hàm và Sätteri, không cần build; phần cuối kiểm bản build khi có.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { duLieuDaKiem } from '../src/du-lieu.mjs';
import { docKhoa } from '../src/khoa.mjs';
import { bangNhaSoanNhac, dongThoiGian, duLieuCho, hinh } from '../src/plugins/thanh-phan.mjs';
import {
	NGUOI_VONG_DOI,
	THOI_KY,
	chonNguoi,
	docDanhSach,
	mauThoiKy,
	namLechTrongChu,
	tieuDeNguoi,
	veDongThoiGian,
	veVongDoi,
} from '../src/scripts/dong-thoi-gian.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const TRANG = 'lich-su/dong-thoi-gian';
const KHONG_KHOA = { trang: {}, ban_ghi: {} };

function dung(md, { trang = TRANG, khoa = () => KHONG_KHOA } = {}) {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS, khoa })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}

/** Danh sách nguoi của ::dong-thoi-gian trên trang thật. */
const nguonTrang = () => fs.readFileSync(path.join(DOCS, TRANG + '.md'), 'utf8');
const dsTrang = () => /::dong-thoi-gian\{nguoi="([^"]*)"\}/.exec(nguonTrang())[1];

const GIA = new Map([
	['a', { id: 'a', ten: 'An A', sinh: 1300, mat: 1377, khoang: true, thoi_ky: 'Trung cổ' }],
	['b', { id: 'b', ten: 'Bình B', sinh: 1685, mat: 1750, thoi_ky: 'Baroque', cach_viet_khac: ['B. B.'] }],
	['c', { id: 'c', ten: 'Chi C', sinh: 1935, mat: null, thoi_ky: 'Đương đại' }],
	['d', { id: 'd', ten: 'Dũng D', sinh: 1685, mat: 1759, thoi_ky: 'Cổ điển/Lãng mạn' }],
	['e', { id: 'e', ten: 'Em E', mau_thuan: [] }],
	['f', { id: 'f', ten: 'Phương F' }],
]);

test('docDanhSach, chonNguoi: id, cách viết khác của tên; id lạ, trùng, tên lạ, chưa có năm thì báo lỗi', () => {
	assert.deepEqual(docDanhSach(' a, b:B. B. ,c '), [{ id: 'a' }, { id: 'b', ten: 'B. B.' }, { id: 'c' }]);
	assert.throws(() => docDanhSach(' , '), /rỗng/);
	assert.throws(() => docDanhSach('a,b,a'), /trùng: a/);
	const [a, b, c] = chonNguoi(docDanhSach('a,b:B. B.,c'), GIA);
	assert.deepEqual(a, { id: 'a', ten: 'An A', sinh: 1300, mat: 1377, khoang: true, thoiKy: 'Trung cổ' });
	assert.equal(b.ten, 'B. B.');
	assert.equal(c.mat, null);
	assert.throws(() => chonNguoi(docDanhSach('x'), GIA), /không có nhà soạn nhạc id "x"/);
	assert.throws(() => chonNguoi(docDanhSach('b:Bach'), GIA), /"Bach" không phải ten hay cach_viet_khac/);
	assert.throws(() => chonNguoi(docDanhSach('e'), GIA), /mau_thuan/);
	assert.throws(() => chonNguoi(docDanhSach('f'), GIA), /chưa có năm sinh/);
	assert.equal(tieuDeNguoi(a), 'An A (khoảng 1300–1377), Trung cổ');
	assert.equal(tieuDeNguoi(c), 'Chi C (sinh 1935), Đương đại');
	assert.equal(mauThoiKy('Cổ điển/Lãng mạn'), THOI_KY.find((t) => t.ten === 'Cổ điển').mau);
	assert.equal(mauThoiKy(''), '#b0b0b0');
});

test('veDongThoiGian: một thanh mỗi người, xếp theo năm sinh, <title>, người còn sống tới năm nay và khác lớp, năm khoảng, dải thời kỳ', () => {
	const ds = chonNguoi(docDanhSach('c,d,a,b'), GIA);
	const html = veDongThoiGian(ds, { namNay: 2026 });
	assert.equal((html.match(/<rect class="oz-dtg-thanh"/g) ?? []).length, 4);
	assert.equal((html.match(/<rect class="oz-dtg-dai"/g) ?? []).length, THOI_KY.length);
	const tieuDe = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
	// cùng năm sinh 1685: giữ thứ tự danh sách (d trước b)
	assert.deepEqual(tieuDe, ['An A (khoảng 1300–1377), Trung cổ', 'Dũng D (1685–1759), Cổ điển/Lãng mạn', 'Bình B (1685–1750), Baroque', 'Chi C (sinh 1935), Đương đại']);
	assert.match(html, />An A \(~1300–1377\)<\/text>/);
	assert.match(html, />Chi C \(sinh 1935\)<\/text>/);
	assert.equal((html.match(/class="oz-dtg-hang oz-dtg-con-song"/g) ?? []).length, 1);
	// thanh người còn sống dài tới năm nay: rộng như một người sinh 1935 mất 2026
	const rong = (h, ten) => Number(new RegExp(`<title>${ten}[^<]*</title><rect class="oz-dtg-thanh" x="[^"]*" y="[^"]*" width="([^"]*)"`).exec(h)[1]);
	const gia2026 = veDongThoiGian(chonNguoi(docDanhSach('c,d,a,b'), new Map([...GIA, ['c', { ...GIA.get('c'), mat: 2026 }]])), { namNay: 2026 });
	assert.equal(rong(html, 'Chi C'), rong(gia2026, 'Chi C'));
	assert.ok(rong(veDongThoiGian(ds, { namNay: 2030 }), 'Chi C') > rong(html, 'Chi C'));
	// SVG tĩnh, không script, màu theo lớp (CSS có bản tối, sáng, in), có tên cho máy đọc màn hình, khung cuộn được bằng phím
	assert.doesNotMatch(html, /<script|\son[a-z]+=/);
	assert.match(html, /^<figure class="oz-figure oz-dtg not-content" data-sinh data-pagefind-ignore><div class="oz-dtg-khung" tabindex="0" role="region" aria-label="[^"]+"><svg class="oz-dtg-svg" viewBox="0 0 1000 \d+" role="img" aria-label="Dòng thời gian 4 nhà soạn nhạc[^"]*1 người còn sống/);
	assert.doesNotMatch(html.replace(/ fill="#[0-9a-f]{6}"/g, ''), /(fill|stroke)="#/);
});

test('bảng Markdown của danh sách: thứ tự danh sách, ~ cho năm sinh khoảng, ô Mất trống khi còn sống', () => {
	const html = bangNhaSoanNhac(docDanhSach('c,a,b:B. B.'), GIA);
	const hang = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => [...m[1].matchAll(/<t[hd][^>]*>([^<]*)<\/t[hd]>/g)].map((x) => x[1]));
	assert.deepEqual(hang, [
		['Nhà soạn nhạc', 'Sinh', 'Mất', 'Thời kỳ'],
		['Chi C', '1935', '', 'Đương đại'],
		['An A', '~1300', '1377', 'Trung cổ'],
		['B. B.', '1685', '1750', 'Baroque'],
	]);
});

test('dữ liệu thật: danh sách của trang dòng thời gian đủ người, tên và năm như bảng cũ; mọi người đã khóa đủ trường', () => {
	const ds = docDanhSach(dsTrang());
	const { nguoi } = duLieuCho(TRANG, { khoa: KHONG_KHOA });
	const p = chonNguoi(ds, nguoi);
	assert.equal(p.length, 52);
	assert.equal(p.filter((x) => x.mat === null).length, 5);
	assert.deepEqual(p.filter((x) => x.khoang).map((x) => x.id), ['machaut', 'josquin', 'palestrina', 'tallis', 'byrd']);
	// trang khóa thì chỉ thị chỉ đọc trường đã khóa: danh sách hiện chỉ gồm người đã khóa đủ ten, sinh, mat, khoang, thoi_ky
	// (và cach_viet_khac với người hiện tên khác), nên khóa trang không làm build hỏng
	const khoa = docKhoa();
	const daKhoaTrang = { ...khoa, trang: { ...khoa.trang, [TRANG]: 'sha256:x' } };
	assert.doesNotThrow(() => dongThoiGian(dsTrang(), duLieuCho(TRANG, { khoa: daKhoaTrang }).nguoi, 2026));
	assert.doesNotThrow(() => hinh('lifespans', 'lich-su/nha-soan-nhac'));
	// người của hình vòng đời: có trong danh sách của trang, cùng cách viết tên
	const trang = new Set(dsTrang().split(','));
	for (const x of NGUOI_VONG_DOI.split(',')) assert.ok(trang.has(x), x);
});

test('trang đã khóa: ::dong-thoi-gian, ::bang-nha-soan-nhac, lifespans chỉ đọc trường đã khóa của bản ghi người', () => {
	const khoa = (truong) => () => ({ trang: { [TRANG]: 'sha256:x', 'lich-su/nha-soan-nhac': 'sha256:x' }, ban_ghi: { [`nha-soan-nhac/bach#${truong}`]: 'sha256:x', 'nha-soan-nhac/part#khoang,mat,sinh,ten,thoi_ky': 'sha256:x' } });
	assert.throws(() => dung('::dong-thoi-gian{nguoi="part,bach"}', { khoa: khoa('khoang,mat,sinh,ten') }), /trang đã khóa lich-su\/dong-thoi-gian \(::dong-thoi-gian\) hiện trường chưa khóa du-lieu\/nha-soan-nhac\/bach#thoi_ky/);
	assert.throws(() => dung('::dong-thoi-gian{nguoi="part,bach:J. S. Bach"}', { khoa: khoa('khoang,mat,sinh,ten,thoi_ky') }), /du-lieu\/nha-soan-nhac\/bach#cach_viet_khac/);
	assert.match(dung('::dong-thoi-gian{nguoi="part,bach"}', { khoa: khoa('khoang,mat,sinh,ten,thoi_ky') }), /<title>Johann Sebastian Bach \(1685–1750\), Baroque<\/title>/);
	assert.throws(() => dung('::bang-nha-soan-nhac{nguoi="bach"}', { khoa: khoa('mat,sinh,ten,thoi_ky') }), /du-lieu\/nha-soan-nhac\/bach#khoang/);
	// trang chưa khóa: đọc được mọi trường
	assert.match(dung('::bang-nha-soan-nhac{nguoi="bach"}', { trang: 'lich-su/opera' }), /<td>Johann Sebastian Bach<\/td>/);
	// lifespans dựng bằng duLieuCho(trang): trang khóa mà người chưa khóa thì build hỏng
	const nguoiKhoa = duLieuCho('lich-su/nha-soan-nhac', { khoa: { trang: { 'lich-su/nha-soan-nhac': 'sha256:x' }, ban_ghi: {} } }).nguoi;
	assert.throws(() => veVongDoi(chonNguoi(docDanhSach(NGUOI_VONG_DOI), nguoiKhoa)), /trang đã khóa lich-su\/nha-soan-nhac hiện trường chưa khóa du-lieu\/nha-soan-nhac\/strozzi#/);
});

test('::dong-thoi-gian, ::bang-nha-soan-nhac: bảng dùng lại danh sách của biểu đồ trước nó; thiếu nguoi, thuộc tính lạ thì build hỏng', () => {
	const html = dung('::dong-thoi-gian{nguoi="part,bach:J. S. Bach"}\n\nchữ\n\n::bang-nha-soan-nhac');
	assert.equal((html.match(/<rect class="oz-dtg-thanh"/g) ?? []).length, 2);
	assert.match(html, /<td>Arvo Pärt<\/td>\s*<td>1935<\/td>\s*<td><\/td>/);
	assert.match(html, /<td>J. S. Bach<\/td>\s*<td>1685<\/td>\s*<td>1750<\/td>\s*<td>Baroque<\/td>/);
	assert.throws(() => dung('::bang-nha-soan-nhac'), /không có nguoi mà trước nó trong trang không có ::dong-thoi-gian/);
	assert.throws(() => dung('::dong-thoi-gian'), /::dong-thoi-gian thiếu thuộc tính nguoi/);
	assert.throws(() => dung('::dong-thoi-gian{nguoi="bach" tu="1650"}'), /không nhận thuộc tính tu/);
	assert.throws(() => dung('::dong-thoi-gian{nguoi="khong-co"}'), /lich-su\/dong-thoi-gian\.md: không có nhà soạn nhạc id "khong-co"/);
});

test('lifespans: dựng từ dữ liệu như hình cũ (từ 1650, người mất sau 1660, màu thời kỳ, mũi tên năm sinh trước 1650)', () => {
	const { nguoi } = duLieuCho('lich-su/nha-soan-nhac', { khoa: KHONG_KHOA });
	const html = veVongDoi(chonNguoi(docDanhSach(NGUOI_VONG_DOI), nguoi), { namNay: 2026 });
	const ten = [...html.matchAll(/text-anchor="end" font-weight="400" fill="currentColor">([^<]*)</g)].map((m) => m[1]);
	assert.equal(ten.length, 45);
	assert.deepEqual(ten.slice(0, 5), ['Barbara Strozzi', 'Henry Purcell', 'Antonio Vivaldi', 'J. S. Bach', 'G. F. Handel']);
	assert.equal(ten.at(-1), 'Caroline Shaw');
	assert.match(html, />← 1619<\/text>/);
	assert.match(html, /<figure class="oz-figure not-content" data-sinh><svg class="oz-fig oz-fig-wide" viewBox="0 0 680 535" role="img" aria-label="Biểu đồ vòng đời/);
	// màu chỉ là màu thời kỳ (nền sáng) và chữ tối trên nền ấy; còn lại currentColor
	const mau = new Set([...html.matchAll(/fill="(#[0-9a-f]+)"/g)].map((m) => m[1]));
	for (const m of mau) assert.ok([...THOI_KY.map((t) => t.mau), '#1b1b1b'].includes(m), m);
	assert.equal(hinh('lifespans', 'lich-su/nha-soan-nhac').replace(/<title>[^<]*<\/title>/g, '').length > 1000, true);
});

/** Năm sinh–mất cạnh tên trong chữ các trang lich-su/ phải khớp nha-soan-nhac.yml (đợt 5: trang đọc năm từ dữ liệu). */
test('namLechTrongChu: bắt năm lệch, thiếu hay thừa "khoảng", người còn sống', () => {
	const ds = [...GIA.values()];
	assert.deepEqual(namLechTrongChu('**An A** (khoảng 1300–1377), Bình B (1685–1750), Chi C (sinh 1935), B. B. (c. 1685–1750)', ds).map((x) => x.chu), ['B. B. (c. 1685–1750)']);
	const lech = namLechTrongChu('### An A (1300–1377)\n\nChi C (1935–2020) và Bình B (1686–1750); Chi C (1935–)', ds);
	assert.deepEqual(lech.map((x) => [x.dong, x.chu, x.duLieu]), [
		[1, 'An A (1300–1377)', 'khoảng 1300–1377'],
		[3, 'Chi C (1935–2020)', '1935–'],
		[3, 'Bình B (1686–1750)', '1685–1750'],
	]);
});

test('trang lich-su/: năm sinh–mất ghi cạnh tên nhà soạn nhạc khớp nha-soan-nhac.yml', () => {
	const banGhi = duLieuDaKiem()['nha-soan-nhac'];
	const thuMuc = path.join(DOCS, 'lich-su');
	const loi = [];
	let soCho = 0;
	for (const f of fs.readdirSync(thuMuc, { recursive: true }).filter((x) => x.endsWith('.md'))) {
		const chu = fs.readFileSync(path.join(thuMuc, f), 'utf8');
		for (const x of namLechTrongChu(chu, banGhi)) loi.push(`lich-su/${f}:${x.dong}: "${x.chu}", nha-soan-nhac.yml (${x.id}): ${x.duLieu}`);
		soCho += (chu.match(/\((?:khoảng |c\. |~)?(?:sinh )?\d{3,4}(?:–\d{0,4})?\)/g) ?? []).length;
	}
	assert.ok(soCho >= 37);
	assert.deepEqual(loi, []);
});

test('bản build: trang dòng thời gian có biểu đồ và bảng từ dữ liệu, không còn ô "chưa chuyển"', (t) => {
	const f = path.join(ROOT, 'dist/lich-su/dong-thoi-gian/index.html');
	if (!fs.existsSync(f)) return t.skip('chưa có trang trong dist/: chạy npm run build:xem');
	const html = fs.readFileSync(f, 'utf8');
	assert.doesNotMatch(html, /oz-chua-co/);
	assert.equal((html.match(/<rect class="oz-dtg-thanh"/g) ?? []).length, 52);
	assert.equal((html.match(/oz-dtg-con-song/g) ?? []).length, 5);
	assert.match(html, /<td>Guillaume de Machaut<\/td>\s*<td>~1300<\/td>/);
	assert.match(html, /<td>J. S. Bach<\/td>/);
	const n = path.join(ROOT, 'dist/lich-su/nha-soan-nhac/index.html');
	if (fs.existsSync(n)) assert.match(fs.readFileSync(n, 'utf8'), /aria-label="Biểu đồ vòng đời các nhà soạn nhạc từ năm 1650/);
});
