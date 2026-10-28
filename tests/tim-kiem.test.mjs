// Kiểm thử tìm kiếm không dấu (D1.8): biến thể "đ" của câu tìm (src/tim-kiem/bien-the.js), phần bọc với một bản gốc giả
// (src/tim-kiem/boc.js: gộp kết quả, basePath, tìm có độ trễ, tải trước), và bản build có bản bọc pagefind.js thay bản gốc
// (src/tim-kiem/tich-hop.mjs). Truy vấn thật trên trình duyệt: tests/trinh-duyet/kiem-tim-kiem.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { bienThe } from '../src/tim-kiem/bien-the.js';
import { boc, gopKetQua } from '../src/tim-kiem/boc.js';
import { thieuChiMuc } from '../src/tim-kiem/tich-hop.mjs';

const DIST = path.resolve(import.meta.dirname, '../dist');

test('biến thể "đ": mỗi từ bắt đầu bằng d có thêm bản đ, câu gốc đứng đầu, tối đa 3 từ', () => {
	assert.deepEqual(bienThe('dan'), ['dan', 'đan']);
	assert.deepEqual(bienThe('Dan bau'), ['Dan bau', 'Đan bau']);
	assert.deepEqual(bienThe('hop am ba'), ['hop am ba'], 'không có từ bắt đầu bằng d: chỉ câu gốc');
	assert.deepEqual(bienThe('  do  truong '), ['do truong', 'đo truong']);
	assert.deepEqual(bienThe('do dan'), ['do dan', 'do đan', 'đo dan', 'đo đan']);
	assert.equal(bienThe('d1 d2 d3 d4').length, 8, 'tối đa 3 từ có biến thể');
	assert.deepEqual(bienThe('đàn'), ['đàn']);
	assert.deepEqual(bienThe(null), [null]);
});

test('bản build: pagefind.js là bản bọc, bản gốc đổi tên thành pagefind-goc.js', () => {
	if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('Chưa có dist/: chạy `npm run build` trước `npm test`.');
	const pf = path.join(DIST, 'pagefind');
	assert.match(fs.readFileSync(path.join(pf, 'pagefind.js'), 'utf8'), /from '\.\/pagefind-goc\.js'/);
	for (const f of ['pagefind-goc.js', 'boc.js', 'bien-the.js']) assert.ok(fs.existsSync(path.join(pf, f)), `thiếu dist/pagefind/${f}`);
});

/** Bản gốc giả của Pagefind: ghi lại mọi lần gọi; search trả kết quả theo bảng `kq` (câu tìm -> [[id, điểm]…]). */
function gocGia(kq = {}) {
	const goi = [];
	return {
		goi,
		options: async (o) => void goi.push(['options', o]),
		search: async (cau, o) => (goi.push(['search', cau, o]), { results: (kq[cau] ?? []).map(([id, score]) => ({ id, score })), timings: { cau } }),
		preload: async (cau) => void goi.push(['preload', cau]),
		destroy: async () => void goi.push(['destroy']),
		createInstance: (o) => (goi.push(['createInstance', o]), {}),
	};
}

test('bản build: chỉ mục Pagefind đủ (pagefind-entry.json đọc được, có ngôn ngữ, không file nào rỗng hay ghi dở)', () => {
	// lần đăng site 9498fb2: pagefind-entry.json rỗng do Pagefind bị đóng khi đang ghi (src/tim-kiem/tich-hop.mjs)
	assert.deepEqual(thieuChiMuc(path.join(DIST, 'pagefind')), []);
});

test('chỉ mục Pagefind thiếu thì thieuChiMuc báo đúng chỗ thiếu', () => {
	const tam = fs.mkdtempSync(path.join(import.meta.dirname, '.tam-pagefind-'));
	try {
		fs.writeFileSync(path.join(tam, 'pagefind-entry.json'), '');
		fs.mkdirSync(path.join(tam, 'index'));
		fs.writeFileSync(path.join(tam, 'index', 'vi_1.pf_index'), '');
		const thieu = thieuChiMuc(tam);
		assert.equal(thieu.length, 4, thieu.join('; '));
		assert.ok(thieu.includes('không có pagefind.js'), thieu.join('; '));
		assert.ok(thieu.some((x) => /^pagefind-entry\.json không đọc được/.test(x)), thieu.join('; '));
		assert.ok(thieu.includes('pagefind-entry.json rỗng') && thieu.includes(path.join('index', 'vi_1.pf_index') + ' rỗng'), thieu.join('; '));
		fs.writeFileSync(path.join(tam, 'pagefind.js'), 'x');
		fs.writeFileSync(path.join(tam, 'pagefind-entry.json'), '{"languages":{}}');
		fs.writeFileSync(path.join(tam, 'index', 'vi_1.pf_index'), zlib.gzipSync('x'));
		assert.deepEqual(thieuChiMuc(tam), ['pagefind-entry.json không có ngôn ngữ nào']);
		fs.writeFileSync(path.join(tam, 'pagefind-entry.json'), '{"languages":{"vi":{"hash":"vi_1"}}}');
		assert.deepEqual(thieuChiMuc(tam), ['không có pagefind.vi_1.pf_meta']);
		fs.writeFileSync(path.join(tam, 'pagefind.vi_1.pf_meta'), zlib.gzipSync('x'));
		assert.deepEqual(thieuChiMuc(tam), []);
		// ghi dở (bị cắt ở ranh giới 4 KiB, lần chạy 40705500055): gzip không giải nén được, JavaScript không đọc được
		fs.writeFileSync(path.join(tam, 'pagefind.vi_1.pf_meta'), zlib.gzipSync('x'.repeat(5000)).subarray(0, 10));
		fs.writeFileSync(path.join(tam, 'pagefind.js'), 'export function f() {');
		assert.deepEqual(thieuChiMuc(tam).sort(), ['pagefind.js ghi dở', 'pagefind.vi_1.pf_meta ghi dở']);
		assert.deepEqual(thieuChiMuc(path.join(tam, 'khong-co')), ['không có thư mục pagefind/']);
	} finally {
		fs.rmSync(tam, { recursive: true, force: true });
	}
});

test('gộp kết quả các biến thể: mỗi trang một lần, giữ điểm cao nhất, xếp theo điểm, cùng điểm thì câu gốc trước', () => {
	const kq = gopKetQua([
		{ results: [{ id: 'a', score: 5 }, { id: 'b', score: 2 }], timings: 1 },
		{ results: [{ id: 'b', score: 7 }, { id: 'c', score: 2 }, { id: 'a', score: 1 }], timings: 2 },
	]);
	assert.deepEqual(kq.results.map((r) => [r.id, r.score]), [['b', 7], ['a', 5], ['c', 2]]);
	assert.equal(kq.unfilteredResultCount, 3);
	assert.equal(kq.timings, 1, 'các trường khác lấy theo câu gốc');
	const ngang = gopKetQua([{ results: [{ id: 'x', score: 3 }] }, { results: [{ id: 'y', score: 3 }] }]);
	assert.deepEqual(ngang.results.map((r) => r.id), ['x', 'y'], 'cùng điểm: kết quả của câu gốc đứng trước');
	assert.deepEqual(gopKetQua([null, { results: [{ id: 'z', score: 1 }] }]).results.map((r) => r.id), ['z']);
});

test('phần bọc: mọi lần gọi options kèm basePath; search tìm cả biến thể "đ"; có bộ lọc hay sắp xếp thì tìm như bản gốc', async () => {
	const g = gocGia({ dan: [['dan', 1]], 'đan': [['dan-dd', 4]] });
	const b = boc(g, '/opus/pagefind/');
	await b.options();
	await b.options({ excerptLength: 20 });
	assert.deepEqual(g.goi.splice(0), [['options', { basePath: '/opus/pagefind/' }], ['options', { basePath: '/opus/pagefind/', excerptLength: 20 }]]);
	const kq = await b.search('dan');
	assert.deepEqual(kq.results.map((r) => r.id), ['dan-dd', 'dan']);
	assert.deepEqual(g.goi.splice(0).map((x) => x[1]), ['dan', 'đan']);
	await b.search('dan', { filters: { loai: 'bai-hoc' } });
	await b.search('dan', { sort: { ngay: 'desc' } });
	await b.search('hop am');
	assert.deepEqual(g.goi.splice(0).map((x) => x[1]), ['dan', 'dan', 'hop am'], 'không thêm biến thể');
	// ô tìm kiếm của Pagefind luôn gửi filters: {} rỗng: vẫn tìm cả biến thể
	await b.search('dan', { filters: {}, sort: {} });
	assert.deepEqual(g.goi.splice(0).map((x) => x[1]), ['dan', 'đan']);
	await b.preload('do dan');
	assert.deepEqual(g.goi.splice(0).map((x) => x[1]), ['do dan', 'do đan', 'đo dan', 'đo đan'], 'tải trước cả biến thể');
	await b.destroy();
	assert.deepEqual(g.goi.splice(0), [['destroy'], ['options', { basePath: '/opus/pagefind/' }]], 'sau destroy đặt lại basePath');
	b.createInstance({ indexWeight: 2 });
	assert.deepEqual(g.goi.splice(0), [['createInstance', { basePath: '/opus/pagefind/', indexWeight: 2 }]]);
});

test('phần bọc: tìm có độ trễ trả null cho lần gõ đã bị lần sau thay, kể cả khi lần sau đến lúc đang tìm', async () => {
	const g = gocGia({ a: [['1', 1]], ab: [['2', 1]], abc: [['3', 1]] });
	const b = boc(g, '/');
	const [k1, k2] = await Promise.all([b.debouncedSearch('a', {}, 20), b.debouncedSearch('ab', {}, 20)]);
	assert.equal(k1, null);
	assert.deepEqual(k2.results.map((r) => r.id), ['2']);
	// lần gọi mới đến khi lần trước đã qua thời gian chờ và đang tìm: lần trước cũng trả null
	let tha;
	g.search = async (cau) => (await new Promise((ok) => (tha = ok)), { results: [{ id: cau, score: 1 }] });
	const dang = b.debouncedSearch('abc', {}, 5);
	await new Promise((ok) => setTimeout(ok, 20));
	const sau = b.debouncedSearch('abcd', {}, 5);
	tha();
	assert.equal(await dang, null);
	await new Promise((ok) => setTimeout(ok, 20));
	tha();
	assert.deepEqual((await sau).results.map((r) => r.id), ['abcd']);
});
