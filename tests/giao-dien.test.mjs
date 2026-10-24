// Kiểm thử giao diện (việc D1.2b): nhóm nội dung (src/nhom.mjs) và màu của nhóm, thẻ nhóm ở trang chủ, logo hai bản.
// Phần đọc dist/ chạy sau `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { NHOM, NHOM_THEM, diaChiVao, menu, nhomCuaTrang, nhomMenu, svgNhom } from '../src/nhom.mjs';

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

test('trang chủ có đủ thẻ nhóm, đúng thứ tự, tên, mô tả, màu và biểu tượng của src/nhom.mjs; thẻ dẫn tới trang mở đầu của nhóm', () => {
	const html = trangChu();
	// cả thẻ là link; trang mở đầu chưa có trong bản build thì link thành chữ "sắp có" (src/plugins/sap-co.mjs)
	const the = [
		...html.matchAll(
			/<li class="oz-the" style="--c: var\(--oz-c-([\w-]+)\)"><(?:a href="([^"]+)"|span class="oz-sap-co" data-href="([^"]+)"[^>]*)><span class="oz-icon">(.*?)<\/span><b>(.*?)<\/b> <span>(.*?)<\/span>/g,
		),
	];
	assert.deepEqual(
		the.map((m) => ({ id: m[1], href: m[2] ?? m[3], svg: m[4], ten: m[5], mo_ta: m[6] })),
		NHOM.map((n) => ({ id: n.id, href: diaChiVao(n), svg: svgNhom(n), ten: n.ten, mo_ta: n.mo_ta })),
		'thẻ ở src/content/docs/index.md khác src/nhom.mjs',
	);
	// trang mở đầu của mỗi nhóm thuộc chính nhóm ấy
	const tang = new Map(parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'trang.yml'), 'utf8')).map((r) => [r.id, r.tang]));
	for (const n of NHOM) assert.equal(nhomCuaTrang(n.vao, tang.get(n.vao))?.id, n.id, `trang mở đầu ${n.vao} không thuộc nhóm ${n.id}`);
	assert.ok(NHOM.every((n) => tang.has(n.vao)), 'trang mở đầu của nhóm phải có trong src/data/trang.yml');
});

test('menu đủ 9 nhóm theo thứ tự (8 nhóm nội dung và Thêm); trang vào đúng nhóm, theo thứ tự menu cũ; nhóm chưa có trang vẫn có', () => {
	const m = menu(
		['nhac-ly/10-hop-am-ba', 'bat-dau/tom-tat', 'bat-dau/index', 'bat-dau/bai-0', 'piano/lo-trinh', 'cap-nhat', 'nhac-cu/violin', 'nhac-cu/dan-nhac', 'index', '404', 'blog/index'],
		new Map([['nhac-cu/violin', 'ngoai-vi'], ['nhac-cu/dan-nhac', 'loi']]),
		{ 'lo-trinh': { sau: 'piano/lo-trinh', muc: [{ link: '/piano/lo-trinh/chang-1/', label: 'Chặng 1' }] } },
	);
	assert.deepEqual(m.map((g) => g.label), [...NHOM, NHOM_THEM].map((n) => n.ten));
	const theo = Object.fromEntries(m.map((g) => [g.label, g.items.map((x) => x.slug ?? x.link)]));
	assert.deepEqual(theo['Bắt đầu'], ['bat-dau', 'bat-dau/bai-0', 'bat-dau/tom-tat'], 'thứ tự như menu cũ; trang mục lục là "Tổng quan"');
	assert.equal(m[0].items[0].label, 'Tổng quan');
	assert.deepEqual(theo['Lộ trình 7 chặng'], ['piano/lo-trinh', '/piano/lo-trinh/chang-1/']);
	assert.deepEqual(theo['Đọc thêm'], ['nhac-cu/violin']);
	assert.deepEqual(theo['Nhạc cổ điển'], ['nhac-cu/dan-nhac']);
	assert.deepEqual(theo['Thêm'], ['blog', 'cap-nhat']);
	assert.deepEqual(theo['Piano'], [], 'nhóm chưa có trang: items rỗng');
	assert.equal(nhomMenu('index'), undefined);
	assert.ok(m.every((g) => g.collapsed));
});

test('thanh bên của bản build: đủ 9 nhóm, nhóm chưa có trang hiện "sắp có", nhóm có trang có link', (t) => {
	const f = fs.readdirSync(DIST, { recursive: true }).find((x) => x.endsWith('.html') && fs.readFileSync(path.join(DIST, x), 'utf8').includes('id="starlight__sidebar"'));
	if (!f) return t.skip('bản build chưa có trang nào có menu bên');
	const html = fs.readFileSync(path.join(DIST, f), 'utf8');
	// Astro thêm lớp của phạm vi CSS (astro-…) vào mọi thẻ của thành phần
	const menuBen = html.slice(html.indexOf('<ul class="top-level oz-menu'), html.indexOf('</sl-sidebar-state-persist>'));
	const nhom = menuBen
		.split(/<li class="oz-menu-nhom[ "]/)
		.slice(1)
		.map((m) => ({
			ten: /<span class="oz-menu-ten[^"]*">[\s\S]*?<\/svg><\/span><span[^>]*>([^<]+)<\/span>/.exec(m)?.[1],
			sapCo: /class="oz-menu-trong[ "]/.test(m) && m.includes('sắp có'),
			link: (m.match(/<a href=/g) ?? []).length,
		}));
	assert.deepEqual(nhom.map((n) => n.ten), [...NHOM, NHOM_THEM].map((n) => n.ten));
	for (const n of nhom) assert.ok(n.sapCo !== n.link > 0, `nhóm ${n.ten}: ${n.link} link mà ${n.sapCo ? 'có' : 'không có'} nhãn "sắp có"`);
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
