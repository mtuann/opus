// Kiểm thử tìm kiếm không dấu (D1.8): biến thể "đ" của câu tìm (src/tim-kiem/bien-the.js), và bản build có bản bọc
// pagefind.js thay bản gốc (src/tim-kiem/tich-hop.mjs). Truy vấn thật trên trình duyệt: tests/trinh-duyet/kiem-tim-kiem.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { bienThe } from '../src/tim-kiem/bien-the.js';

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
	assert.ok(fs.existsSync(path.join(pf, 'pagefind-goc.js')) && fs.existsSync(path.join(pf, 'bien-the.js')));
});
