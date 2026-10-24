// Kiểm thử giao diện (việc D1.2b): nhóm nội dung (src/nhom.mjs) và màu của nhóm, thẻ nhóm ở trang chủ, logo hai bản.
// Phần đọc dist/ chạy sau `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { NHOM, nhomCuaTrang, svgNhom } from '../src/nhom.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CSS = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'opus.css'), 'utf8');

/** Khai báo biến CSS trong khối có bộ chọn `selector` (khối phẳng, không lồng) của opus.css. */
function bien(selector) {
	const i = CSS.indexOf(`${selector} {`);
	assert.ok(i >= 0, `opus.css thiếu khối ${selector}`);
	const khoi = CSS.slice(i, CSS.indexOf('\n}', i));
	return Object.fromEntries([...khoi.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]));
}
const TOI = bien(':root');
const SANG = { ...TOI, ...bien(":root[data-theme='light']") };

/** Giá trị cuối của một biến (lần theo var(...)) trong một chế độ. */
function giaTri(che_do, ten) {
	let v = che_do[ten];
	for (let i = 0; v && v.startsWith('var(') && i < 10; i++) v = che_do[/var\((--[\w-]+)\)/.exec(v)[1]];
	return v;
}

/** Tỉ lệ tương phản WCAG giữa hai màu dạng #rrggbb. */
function tuongPhan(a, b) {
	const sang = (hex) => {
		const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [x, y] = [sang(a), sang(b)].sort((m, n) => n - m);
	return (x + 0.05) / (y + 0.05);
}

test('trang thuộc nhóm đúng như plans/lam-lai/anh-xa.md, đủ 233 trang cũ (tầng lấy từ src/data/trang.yml)', () => {
	const tang = new Map(parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'trang.yml'), 'utf8')).map((r) => [r.id, r.tang]));
	const anhXa = fs.readFileSync(path.join(ROOT, 'plans', 'lam-lai', 'anh-xa.md'), 'utf8');
	const dong = [...anhXa.matchAll(/^\| `([^`]+)` \| [^|]+ \| ([^|]+) \|$/gm)].map((m) => [m[1], m[2].trim()]);
	assert.equal(dong.length, 233, 'anh-xa.md không còn đủ 233 dòng trang');
	const theoTen = Object.fromEntries(NHOM.map((n) => [n.ten, n.id]));
	// "Trang chủ" và "Thêm" không có nhãn nhóm
	const lech = dong
		.filter(([id, ten]) => (theoTen[ten] ?? null) !== (nhomCuaTrang(id, tang.get(id))?.id ?? null))
		.map(([id, ten]) => `${id}: anh-xa.md ghi ${ten}, src/nhom.mjs cho ${nhomCuaTrang(id, tang.get(id))?.ten ?? 'không nhóm'}`);
	assert.deepEqual(lech, []);
});

test('trang ngoài 233 trang cũ: trang chặng của đợt 2, trang mục lục viết không đuôi /index, trang lạ', () => {
	const nhom = (id, tang) => nhomCuaTrang(id, tang)?.id;
	assert.equal(nhom('piano/lo-trinh/chang-1'), 'lo-trinh');
	assert.equal(nhom('nhac-ly'), 'nhac-ly');
	assert.equal(nhom('piano/tac-pham'), 'tac-pham');
	assert.equal(nhom('nhac-cu'), 'doc-them');
	assert.equal(nhom('bat-dau/sach-in'), undefined);
	assert.equal(nhom('lich-su/opera', 'ngoai-vi'), 'doc-them');
	assert.equal(nhom('lich-su/baroque', 'loi'), 'co-dien');
	assert.equal(nhom('index'), undefined);
	assert.equal(nhom('404'), undefined);
	assert.equal(nhom('pianola/x'), undefined);
});

test('khi in, opus.css dùng đúng bảng màu của chế độ sáng', () => {
	const i = CSS.indexOf('@media print {\n\t:root {');
	assert.ok(i >= 0, 'opus.css thiếu khối @media print { :root { … } }');
	const khoi = CSS.slice(i, CSS.indexOf('\n\t}', i));
	const inRa = Object.fromEntries([...khoi.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]));
	assert.deepEqual(inRa, bien(":root[data-theme='light']"));
});

test('mỗi nhóm có tên, mô tả, biểu tượng và màu ở cả hai chế độ, chữ màu nhóm đủ tương phản trên nền trang', () => {
	assert.equal(new Set(NHOM.map((n) => n.id)).size, NHOM.length, 'id nhóm trùng');
	const nen = { tối: giaTri(TOI, '--sl-color-black'), sáng: giaTri(SANG, '--sl-color-black') };
	for (const n of NHOM) {
		assert.ok(n.ten && n.mo_ta && n.bieu_tuong, `nhóm ${n.id} thiếu tên, mô tả hay biểu tượng`);
		for (const [ten, che_do] of [['tối', TOI], ['sáng', SANG]]) {
			const mau = giaTri(che_do, `--oz-c-${n.id}`);
			assert.match(mau ?? '', /^#[0-9a-f]{6}$/i, `--oz-c-${n.id} (chế độ ${ten}) chưa khai trong opus.css`);
			// Nhãn nhóm trên tiêu đề là chữ nhỏ màu nhóm: cần từ 4,5:1 (WCAG AA)
			const tp = tuongPhan(mau, nen[ten]);
			assert.ok(tp >= 4.5, `--oz-c-${n.id} chế độ ${ten}: tương phản ${tp.toFixed(2)} < 4,5 trên ${nen[ten]}`);
		}
	}
});

const DIST = path.join(ROOT, 'dist');
const trangChu = () => {
	const f = path.join(DIST, 'index.html');
	if (!fs.existsSync(f)) throw new Error('Chưa có dist/index.html: chạy `npm run build` trước `npm test`.');
	return fs.readFileSync(f, 'utf8');
};

test('trang chủ có đủ thẻ nhóm, đúng thứ tự, tên, mô tả, màu và biểu tượng của src/nhom.mjs', () => {
	const html = trangChu();
	const the = [...html.matchAll(/<li class="oz-the" style="--c: var\(--oz-c-([\w-]+)\)"><span class="oz-icon">(.*?)<\/span><b>(.*?)<\/b> <span>(.*?)<\/span><\/li>/g)];
	assert.deepEqual(
		the.map((m) => ({ id: m[1], svg: m[2], ten: m[3], mo_ta: m[4] })),
		NHOM.map((n) => ({ id: n.id, svg: svgNhom(n), ten: n.ten, mo_ta: n.mo_ta })),
		'thẻ ở src/content/docs/index.md khác src/nhom.mjs',
	);
});

test('thanh trên có logo hai bản: mực cho nền sáng, kem cho nền tối', () => {
	const html = trangChu();
	const logo = [...html.matchAll(/<img[^>]*class="([^"]*)"[^>]*src="[^"]*\/(logo(?:-muc)?)\.[\w-]+\.svg"/g)].map((m) => [m[2], m[1]]);
	assert.equal(logo.length, 2, `cần hai logo, thấy ${logo.length}`);
	assert.ok(logo.some(([ten, cls]) => ten === 'logo' && cls.includes('light:sl-hidden')), 'logo kem phải ẩn ở chế độ sáng');
	assert.ok(logo.some(([ten, cls]) => ten === 'logo-muc' && cls.includes('dark:sl-hidden')), 'logo mực phải ẩn ở chế độ tối');
});

test('CSS đã nén không có khai báo rỗng (bộ nén biến `border-image: none` thành `border-image:`, AGENTS.md mục Giao diện)', () => {
	trangChu();
	const dir = path.join(DIST, '_astro');
	const rong = fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.css'))
		.flatMap((f) => [...fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/[\w-]+:(?=[;}])/g)].map((m) => `${f}: ${m[0]}`));
	assert.deepEqual(rong, []);
});

test('phần chỉ để in (.oz-print-only, giữ từ site cũ khi chuyển trang) ẩn trên màn hình, hiện khi in, trong CSS đã nén', () => {
	trangChu();
	const dir = path.join(DIST, '_astro');
	let manHinh = fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.css'))
		.map((f) => fs.readFileSync(path.join(dir, f), 'utf8'))
		.join('\n');
	// tách các khối @media (đếm ngoặc) khỏi phần còn lại; giữ nội dung các khối @media print
	const khiIn = [];
	for (let m; (m = /@media([^{]*)\{/.exec(manHinh)); ) {
		let i = m.index + m[0].length;
		for (let sau = 1; sau && i < manHinh.length; i++) sau += { '{': 1, '}': -1 }[manHinh[i]] ?? 0;
		if (m[1].trim() === 'print') khiIn.push(manHinh.slice(m.index + m[0].length, i - 1));
		manHinh = manHinh.slice(0, m.index) + manHinh.slice(i);
	}
	assert.match(manHinh, /(^|[},\n])\.oz-print-only\{display:none\}/, 'trên màn hình: thiếu .oz-print-only{display:none}');
	assert.ok(khiIn.some((k) => /(^|[},])\.oz-print-only\{display:block\}/.test(k)), 'khi in: thiếu .oz-print-only{display:block} trong @media print');
});


test('mỗi trang đã dựng mang nhãn nhóm của nó (tên, màu nhóm) phía trên tiêu đề, như src/nhom.mjs', (t) => {
	const DOCS = path.join(ROOT, 'src', 'content', 'docs');
	const DIST = path.join(ROOT, 'dist');
	const tang = new Map((parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'trang.yml'), 'utf8')) ?? []).map((r) => [r.id, r.tang]));
	const loi = [];
	let co = 0;
	for (const f of fs.readdirSync(DOCS, { recursive: true }).filter((x) => /\.mdx?$/.test(x))) {
		const trang = f.replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const ra = path.join(DIST, trang === 'index' ? '' : trang.replace(/(^|\/)index$/, ''), trang === '404' ? '../404.html' : 'index.html');
		if (!fs.existsSync(ra)) continue; // trang không có trong bản build này (bản thật: chưa khóa)
		const html = fs.readFileSync(ra, 'utf8');
		const nhom = nhomCuaTrang(trang, tang.get(trang));
		const nhan = /<p class="oz-nhom" style="--c: var\(--oz-c-([\w-]+)\)"[^>]*>[\s\S]*?<\/span>\s*([^<]*?)\s*<\/p>/.exec(html);
		if (!nhom) {
			if (nhan) loi.push(`${trang}: không thuộc nhóm nào mà có nhãn "${nhan[2]}"`);
			continue;
		}
		co++;
		if (!nhan) loi.push(`${trang}: thiếu nhãn nhóm "${nhom.ten}"`);
		else if (nhan[1] !== nhom.id || nhan[2] !== nhom.ten) loi.push(`${trang}: nhãn "${nhan[2]}" (màu ${nhan[1]}), phải là "${nhom.ten}" (màu ${nhom.id})`);
	}
	assert.deepEqual(loi, []);
	// bản thật đầu đợt 2 chỉ có trang chủ và trang 404, không thuộc nhóm nào
	if (!co) t.skip('bản build chưa có trang nào thuộc một nhóm');
});
