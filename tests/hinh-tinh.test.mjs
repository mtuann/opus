// Hình tĩnh chép từ site cũ (src/components/hinh/*.html, D3-L3): ::hinh chèn nguyên SVG; màu theo biến của site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MAU, chuyenHinh } from '../src/components/hinh/chuyen-hinh-cu.mjs';
import { THU_MUC_HINH, hinh, hinhTinh } from '../src/plugins/thanh-phan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const FILE = fs.readdirSync(THU_MUC_HINH).filter((f) => f.endsWith('.html'));
/** Màu viết cứng còn được giữ: nền sáng (ô, phím, dải) và chữ tối trên nền ấy, trắng của vòng tròn chứa chữ tối. */
const MAU_GIU = new Set([
	// màu của vật được vẽ (D4-L1): phím trắng, phím đen và viền phím, da tay, thân đàn, ghế, áo; nằm trên nền sáng của chính vật
	'#ffffff', '#1b1d22', '#4a4a4a', '#f3d27a', '#bcd6f2', '#f1d3b8', '#d9c9a3', '#b0a48a', '#9fb5cf', '#4a5d73',
	'#1b1b1b', '#fff', '#a9c7e8', '#f1d9a0', '#c9b6dd', '#7aa6d6', '#9fd0d0', '#8cc49a', '#e0b45e', '#c9a0dc', '#e98f7a', '#f3e3b8', '#e9b3a6', '#b6dcc1', '#d6d6d6']);

test('chuyenHinh: bỏ xmlns, font-family; màu đậm thành biến; figure có not-content và data-sinh; chữ giữ nguyên', () => {
	const cu = '<figure class="oz-figure"><svg class="oz-fig" viewBox="0 0 10 10" role="img" aria-label="A" xmlns="http://www.w3.org/2000/svg" font-family="X"><line stroke="#2F5582"/><text fill="#1b1b1b">Đô</text><text fill="#999">b</text></svg><figcaption>C</figcaption></figure>';
	assert.equal(
		chuyenHinh(cu),
		'<figure class="oz-figure not-content" data-sinh><svg class="oz-fig" viewBox="0 0 10 10" role="img" aria-label="A"><line style="stroke:var(--oz-h-xanh)"/><text fill="#1b1b1b">Đô</text><text style="fill:var(--oz-h-nhat)">b</text></svg><figcaption>C</figcaption></figure>',
	);
	// fill và stroke cùng đổi thành biến: một thuộc tính style (D3-L5, hình beats)
	assert.equal(chuyenHinh('<polygon fill="#2E7D4F" fill-opacity=".35" stroke="#2e7d4f"/>'), '<polygon style="fill:var(--oz-h-luc);stroke:var(--oz-h-luc)" fill-opacity=".35"/>');
});

test('mỗi hình tĩnh: figure not-content, data-sinh, có chú thích; SVG có tên cho máy đọc màn hình; không phông, không màu đậm viết cứng', () => {
	assert.ok(FILE.length >= 7);
	for (const f of FILE) {
		const s = fs.readFileSync(path.join(THU_MUC_HINH, f), 'utf8');
		const fig = s.match(/<figure[^>]*>/g) ?? [];
		assert.ok(fig.length && fig.every((x) => x === '<figure class="oz-figure not-content" data-sinh>'), f);
		assert.equal((s.match(/<figcaption>/g) ?? []).length, fig.length, `${f}: mỗi hình một chú thích`);
		// hình SVG: mỗi SVG có tên cho máy đọc màn hình; hình HTML (sơ đồ ô như hình cấu trúc) đọc thẳng chữ trong ô
		const svg = s.match(/<svg[^>]*>/g) ?? [];
		assert.ok(svg.every((x) => / role="img" aria-label="[^"]{10,}"/.test(x)), f);
		assert.doesNotMatch(s, /font-family|xmlns=|<script|\son[a-z]+=/i, f);
		const la = [...s.matchAll(/(?:fill|stroke)="(#[0-9a-f]{3,6})"/gi)].map((m) => m[1].toLowerCase()).filter((m) => !MAU_GIU.has(m));
		assert.deepEqual(la, [], `${f}: màu đậm phải là biến (${Object.keys(MAU).join(', ')})`);
		assert.doesNotMatch(s, /<[^>]* style="[^"]*"[^>]* style="/, `${f}: một thẻ hai thuộc tính style`);
		assert.doesNotMatch(s, / id="/, `${f}: không id (trùng khi hai hình trên một trang)`);
	}
});

test('::hinh dùng hình tĩnh khi không có thành phần riêng; tên lạ thì không đọc file', () => {
	for (const f of FILE) {
		const ten = f.slice(0, -5);
		assert.equal(hinh(ten, 'nhac-ly/19-at-phu-chuyen-giong'), hinhTinh(ten));
	}
	assert.equal(hinhTinh('../package'), null);
	assert.equal(hinhTinh('khong-co'), null);
});

test('biến màu của hình tĩnh có ở chế độ tối (:root), sáng và khi in', () => {
	const css = fs.readFileSync(path.join(ROOT, 'src/styles/thanh-phan.css'), 'utf8');
	for (const bien of Object.values(MAU).map((v) => v.slice(4, -1))) assert.equal(css.split(`${bien}:`).length - 1, 3, bien);
});

test('bản build: trang dùng hình tĩnh có nguyên hình, không còn ô "chưa chuyển"', (t) => {
	const f = path.join(ROOT, 'dist/nhac-ly/21-hoa-am-bon-be/index.html');
	if (!fs.existsSync(f)) return t.skip('chưa có trang trong dist/: chạy npm run build:xem');
	const html = fs.readFileSync(f, 'utf8');
	assert.doesNotMatch(html, /oz-chua-co/);
	assert.equal((html.match(/<figure class="oz-figure not-content" data-sinh><svg/g) ?? []).length, 3);
});
