// Khuông kép nối phím (đợt hình 2, ::hinh{ten="khuong-kep-phim"}; src/scripts/ve-khuong-phim.js): ba nốt mốc đứng đúng dòng
// của khóa và đúng trên phím của nó, phím mốc được tô và có nhãn, dòng mốc tô màu, hình có tên đọc được. Chạy thẳng hàm,
// không cần build; đo trên trình duyệt thật (chữ không đè, không tràn): tests/trinh-duyet/kiem-khuong-phim.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canKyHieu } from '../src/plugins/thanh-phan.mjs';
import { midiCua } from '../src/scripts/nhac-ly.js';
import { MOC, PHIM, hinhKhuongKepPhim, veKhuongKepPhim } from '../src/scripts/ve-khuong-phim.js';
import { tamPhim } from '../src/scripts/ve.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const KHE = 7.75;

test('ba nốt mốc của trang: Fa3 (khóa Fa), Đô4 (cả hai khuông), Sol4 (khóa Sol)', () => {
	assert.deepEqual(
		MOC.map((x) => [x.not, x.khuong]),
		[
			['F3', ['bass']],
			['C4', ['treble', 'bass']],
			['G4', ['treble']],
		],
	);
});

test('nốt mốc đứng đúng dòng: Sol4 dòng 2 khóa Sol, Fa3 dòng 4 khóa Fa, Đô4 trên dòng kẻ phụ ngay ngoài mỗi khuông', () => {
	const { svg, phim } = veKhuongKepPhim();
	// y của năm dòng mỗi khuông, đọc từ SVG (dòng 1 là dòng dưới cùng)
	const dong = [...svg.matchAll(/<path(?: class="oz-kp-dong-moc")? d="M6 ([\d.]+)H/g)].map((m) => Number(m[1]));
	assert.equal(dong.length, 10);
	const sol = dong.slice(0, 5); // dòng 1 → 5 khóa Sol
	const fa = dong.slice(5);
	for (const k of [sol, fa]) for (let i = 1; i < 5; i++) assert.ok(Math.abs(k[i - 1] - k[i] - KHE) < 0.01, 'dòng cách đều một khe, đánh số từ dưới lên');
	const [f3, c4, g4] = phim;
	assert.deepEqual(g4.y, [sol[1]]);
	assert.deepEqual(f3.y, [fa[3]]);
	assert.ok(Math.abs(c4.y[0] - (sol[0] + KHE)) < 0.01, 'Đô4 một khe dưới dòng 1 khóa Sol');
	assert.ok(Math.abs(c4.y[1] - (fa[4] - KHE)) < 0.01, 'Đô4 một khe trên dòng 5 khóa Fa');
	// dòng mốc tô màu: đúng dòng 2 khóa Sol và dòng 4 khóa Fa
	const moc = [...svg.matchAll(/class="oz-kp-dong-moc" d="M6 ([\d.]+)H/g)].map((m) => Number(m[1]));
	assert.deepEqual(moc, [sol[1], fa[3]]);
	// dòng kẻ phụ chỉ có ở Đô4 (hai đoạn)
	assert.equal((svg.match(/oz-kp-phu/g) ?? []).length, 2);
});

test('nốt mốc đứng thẳng trên phím của nó; phím mốc được tô, có nhãn; nét nối xuống tới đỉnh phím', () => {
	const { svg, phim } = veKhuongKepPhim();
	const thap = midiCua(PHIM[0]);
	const dich = Number(/class="oz-kp-phim" transform="translate\(([\d.]+) /.exec(svg)[1]);
	for (const p of phim) {
		assert.equal(p.x, dich + tamPhim(thap, p.m));
		// đầu nốt (rộng 15) đặt lệch trái 7,5 để tâm ở p.x
		for (const y of p.y) assert.ok(svg.includes(`href="#oz-kh-not-tron" x="${p.x - 7.5}" y="${y}"`), `đầu nốt ${p.m} ở ${p.x}, ${y}`);
		assert.match(svg, new RegExp(`class="oz-phim-trang to" [^>]*data-m="${p.m}"`));
		assert.ok(svg.includes(`M${p.x} `), `nét nối ở x ${p.x}`);
	}
	// chỉ ba phím được tô
	assert.equal((svg.match(/oz-phim-(trang|den) to"/g) ?? []).length, 3);
	for (const x of MOC) for (const s of x.nhan) assert.ok(svg.includes(`>${s}</tspan>`), `nhãn "${s}"`);
});

test('tên đọc được của hình, chữ trong hình ẩn với máy đọc, số dòng 1–5 cho mỗi khuông', () => {
	const { svg } = veKhuongKepPhim();
	assert.match(svg, /^<svg class="oz-hb oz-kp" viewBox="0 0 [\d.]+ [\d.]+" role="img" aria-label="Khuông kép nối xuống bàn phím/);
	const nhan = /aria-label="([^"]+)"/.exec(svg)[1];
	for (const s of ['Fa3 trên dòng 4 khóa Fa', 'Đô4, Đô giữa', 'Sol4 trên dòng 2 khóa Sol', 'từ dưới lên']) assert.ok(nhan.includes(s), s);
	assert.equal((svg.match(/role=/g) ?? []).length, 1, 'chỉ một vai trò: cả hình');
	assert.deepEqual([...svg.matchAll(/class="oz-kp-so"[^>]*>(\d)</g)].map((m) => m[1]).join(''), '1234512345');
	assert.ok(canKyHieu(svg), 'khóa và đầu nốt dùng ký hiệu chung (trang thêm định nghĩa)');
});

test('::hinh{ten="khuong-kep-phim"} dựng hình có chú thích, data-sinh', () => {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, 'nhac-ly/02-khuong-nhac-khoa.md')) });
	const html = markdownToHtml('::hinh{ten="khuong-kep-phim"}\n', { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
	assert.ok(html.includes(hinhKhuongKepPhim()));
	assert.match(html, /<figure class="oz-figure oz-khuong-phim not-content" data-sinh><svg/);
	assert.match(html, /<figcaption>Ba nốt mốc/);
	assert.ok(fs.readFileSync(path.join(DOCS, 'nhac-ly/02-khuong-nhac-khoa.md'), 'utf8').includes('::hinh{ten="khuong-kep-phim"}'));
});
