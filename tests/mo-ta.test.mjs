// Mô tả trang trọn câu (src/mo-ta.mjs, src/route-mo-ta.mjs; chủ repo chọn ngày 09/11/2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { moTaDay } from '../src/mo-ta.mjs';

const DIST = path.join(path.resolve(import.meta.dirname, '..'), 'dist');

test('mô tả không cắt dở thì giữ nguyên', () => {
	assert.equal(moTaDay('Một câu trọn.', 'Một câu trọn. Câu sau.'), 'Một câu trọn.');
});

test('nối tiếp tới hết câu đang dở, bỏ cú pháp markdown của thân bài', () => {
	const than = 'Giới thiệu\n\nĐây là **một chương sonata** trọn vẹn mà bản in đầu gọi là "sonata dễ": [122 ô nhịp](/opus/x/), đủ trình bày và tái hiện. Câu sau không lấy.\n';
	assert.equal(
		moTaDay('Một chương sonata trọn vẹn mà bản in đầu gọi là "sonata dễ": 122 ô…', than),
		'Đây là một chương sonata trọn vẹn mà bản in đầu gọi là "sonata dễ": 122 ô nhịp, đủ trình bày và tái hiện.',
	);
});

test('không coi Op. 9, K. 545, J. S. là hết câu', () => {
	const than = 'Nocturne Op. 9 số 2 và Sonata K. 545 của J. S. Bach không, của Mozart là hai bài nhiều người tập. Câu sau.';
	assert.equal(moTaDay('Nocturne Op. 9 số 2 và Sonata K. 545 của J. S. Bach…', than), than.slice(0, than.indexOf(' Câu sau.')));
});

test('không thấy đoạn tương ứng: bỏ mẩu câu dở nếu trước đó có câu trọn, không thì giữ nguyên', () => {
	assert.equal(moTaDay('Câu đầu trọn vẹn ở đây. Câu sau bị cắt…', 'Chữ khác hẳn.'), 'Câu đầu trọn vẹn ở đây.');
	assert.equal(moTaDay('Chỉ một câu bị cắt…', 'Chữ khác hẳn.'), 'Chỉ một câu bị cắt…');
});

test('bản build: thẻ meta description và og:description trùng nhau, không cắt dở (trừ trang mà chính chữ trang kết bằng "…")', (t) => {
	if (!fs.existsSync(DIST)) return t.skip('chưa build');
	const KET_BANG_BA_CHAM = new Set(['hinh-thuc']); // "…giao hưởng, concerto, sonata…" là chữ của trang
	const cat = [];
	for (const f of fs.readdirSync(DIST, { recursive: true }).filter((x) => x.endsWith('index.html'))) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		const d = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
		const og = /<meta property="og:description" content="([^"]*)"/.exec(html)?.[1];
		if (d === undefined) continue;
		assert.equal(og, d, `${f}: og:description khác description`);
		const trang = path.dirname(f);
		if (d.endsWith('…') && !KET_BANG_BA_CHAM.has(trang)) cat.push(trang);
	}
	assert.deepEqual(cat, []);
});
