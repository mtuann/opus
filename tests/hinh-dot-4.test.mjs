// Đợt hình 4 (plans/ben-vung/de-xuat-hinh.md, đề xuất 12 và 15): hình tĩnh bo-may-dan, giam-am, ba-ban-dap, ghe-cao-thap.
// Chữ hình nói lại chữ trang: sửa bảng hay đoạn của trang thì sửa hình theo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const hinh = (t) => fs.readFileSync(path.join(ROOT, 'src/components/hinh', `${t}.html`), 'utf8');
const trang = (t) => fs.readFileSync(path.join(ROOT, 'src/content/docs', `${t}.md`), 'utf8');
const the = (s) => [...s.matchAll(/<div class="oz-nct-the"><b>([^<]*)<\/b>.*?<small>([^<]*)<\/small><\/div>/g)].map((m) => [m[1], m[2]]);

test('mỗi hình đặt ở đúng trang', () => {
	const DUNG = {
		'bo-may-dan': ['piano/lich-su-dan', 'piano/tieng-dan'],
		'giam-am': ['piano/ban-dap'],
		'ba-ban-dap': ['piano/ban-dap'],
		'ghe-cao-thap': ['piano/tu-the'],
	};
	for (const [ten, cac] of Object.entries(DUNG)) for (const t of cac) assert.match(trang(t), new RegExp(`^::hinh\\{ten="${ten}"\\}$`, 'm'), `${t}: ${ten}`);
});

test('ghe-cao-thap: ba thẻ theo dòng "Chiều cao" của bảng "Ghế và khoảng cách"', () => {
	const dong = trang('piano/tu-the').split('\n').find((d) => d.startsWith('| **Chiều cao** |'));
	assert.ok(dong);
	assert.deepEqual(the(hinh('ghe-cao-thap')).map(([t]) => t), ['Ghế quá thấp', 'Vừa', 'Ghế quá cao']);
	assert.deepEqual(the(hinh('ghe-cao-thap')).map(([, m]) => m), ['Cẳng tay dốc lên.', 'Cẳng tay gần song song với mặt phím.', 'Cẳng tay dốc xuống nhiều.']);
	for (const cum of ['Cẳng tay gần song song với mặt phím', 'cẳng tay dốc lên là ghế quá thấp', 'dốc xuống nhiều là ghế quá cao']) assert.ok(dong.includes(cum), cum);
});

test('ba-ban-dap: vị trí và tên theo bảng "Ba bàn đạp"', () => {
	const s = trang('piano/ban-dap');
	const h = hinh('ba-ban-dap');
	for (const [viTri, ten, chu] of [['Trái', 'Una corda', 'una corda'], ['Giữa', 'Bàn đạp giữ âm', 'giữ âm (sostenuto)'], ['Phải', 'Bàn đạp vang', 'bàn đạp vang']]) {
		assert.match(s, new RegExp(`^\\| ${viTri} \\| \\*\\*${ten}\\*\\*`, 'm'), viTri);
		assert.ok(h.includes(`>${viTri}</text>`) && h.includes(`>${chu}</text>`), viTri);
	}
});

test('bo-may-dan, giam-am: thẻ theo thứ tự, mỗi thẻ có tên cho máy đọc màn hình', () => {
	assert.deepEqual(the(hinh('bo-may-dan')).map(([t]) => t), ['1. Phím nghỉ', '2. Bấm: búa gõ dây', '3. Giữ phím: dây ngân']);
	assert.deepEqual(the(hinh('giam-am')).map(([t]) => t), ['Không bấm gì', 'Bấm một phím', 'Nhấn bàn đạp vang', 'Độ sâu bàn đạp']);
	// thứ tự trên thước độ sâu: đỉnh, nửa bàn đạp, điểm bắt, đáy (từ trên xuống)
	const y = (chu) => Number(hinh('giam-am').match(new RegExp(`y="([\\d.]+)"[^>]*>${chu}</text>`))[1]);
	assert.ok(y('đỉnh') < y('nửa bàn đạp') && y('nửa bàn đạp') < y('điểm bắt') && y('điểm bắt') < y('đáy'));
});
