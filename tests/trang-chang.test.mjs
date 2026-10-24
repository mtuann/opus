// Kiểm thử trên bản build (D2-L1): 7 trang chặng sinh từ dữ liệu (src/pages/piano/lo-trinh/[chang].astro) có ở mọi bản
// build, đúng dữ liệu đã khóa, không có dải "Chưa kiểm định"; menu có tên 7 chặng; ô gợi ý tập ở trang chủ mang đúng dữ
// liệu. Chạy sau `npm run build` hay `npm run build:xem`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { duLieuDaKiem } from '../src/du-lieu.mjs';
import { BAT_DAU_CHANG_1, ganDung, gradeChang } from '../src/plugins/thanh-phan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const du = duLieuDaKiem();
const capDo = [...du['cap-do']].sort((a, b) => a.id - b.id);
const giaiMa = (s) => s.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

function docTrang(duongDan) {
	if (!fs.existsSync(path.join(DIST, 'index.html')) && !fs.existsSync(path.join(DIST, '404.html')))
		throw new Error('Chưa có dist/: chạy `npm run build` trước `npm test`.');
	const f = path.join(DIST, duongDan, 'index.html');
	assert.ok(fs.existsSync(f), `bản build thiếu ${duongDan}/ (trang chặng có ở mọi bản build)`);
	return fs.readFileSync(f, 'utf8');
}

/** Các mục của một danh sách bài (<ul class="…">): địa chỉ (link hay "sắp có") và chữ Grade. */
const muc = (html, lop) =>
	[...(new RegExp(`<ul class="${lop}">([\\s\\S]*?)</ul>`).exec(html)?.[1] ?? '').matchAll(/<li>(?:<a href="([^"]+)"|<span class="oz-sap-co" data-href="([^"]+)")[\s\S]*?(?:<span class="oz-chang-bai-grade">([^<]*)<\/span>)?<\/li>/g)].map(
		(m) => [m[1] ?? m[2], m[3] ? giaiMa(m[3]) : undefined],
	);

test('7 trang chặng: tiêu đề, nhãn nhóm, sơ đồ có chặng đang xem, số liệu của chặng như cap-do.yml; không có dải "Chưa kiểm định"', () => {
	assert.equal(capDo.length, 7);
	for (const c of capDo) {
		const html = docTrang(`piano/lo-trinh/chang-${c.id}`);
		const ten = `Chặng ${c.id}. ${c.ten}`;
		assert.match(html, new RegExp(`<title>${ten} \\| Opus</title>`), `chặng ${c.id}: tiêu đề trang`);
		assert.match(html, new RegExp(`<h1 id="_top"[^>]*>${ten}</h1>`), `chặng ${c.id}: H1`);
		assert.match(html, /<p class="oz-nhom" style="--c: var\(--oz-c-lo-trinh\)"[^>]*>[\s\S]*?<\/span>\s*Lộ trình 7 chặng\s*<\/p>/, `chặng ${c.id}: nhãn nhóm`);
		assert.doesNotMatch(html, /class="oz-chua-kiem-dinh"/, `chặng ${c.id}: trang luôn đăng không có dải "Chưa kiểm định"`);
		assert.match(html, /<figure class="oz-chang-hinh oz-chang-hinh--gon" data-sinh>/, `chặng ${c.id}: sơ đồ bản gọn`);
		const hienTai = [...html.matchAll(/<a href="\/opus\/piano\/lo-trinh\/chang-(\d)\/" aria-current="page"><span class="oz-chang-so"/g)].map((m) => Number(m[1]));
		assert.deepEqual(hienTai, [c.id], `chặng ${c.id}: sơ đồ đánh dấu đúng chặng đang xem`);
		const soLieu = [...(/<dl class="oz-chang-so-lieu">([\s\S]*?)<\/dl>/.exec(html)?.[1] ?? '').matchAll(/<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g)].map((m) => [m[1], giaiMa(m[2])]);
		assert.deepEqual(soLieu, [
			['Tương đương (ABRSM)', gradeChang(c)],
			['Mốc thời gian', c.moc_thoi_gian],
			['Thời lượng tập', c.thoi_luong],
		]);
	}
});

test('trang chặng liệt kê đúng bài học tác phẩm của chặng (bài có goi_y trước), kèm Grade; chặng 1: trang khởi đầu', () => {
	const diaChi = (r) => `/opus/piano/tac-pham/${r.slug}/`;
	for (const c of capDo) {
		const html = docTrang(`piano/lo-trinh/chang-${c.id}`);
		const bai = du['tac-pham'].filter((r) => r.loai === 'bai-hoc' && r.chang === c.id);
		const danhSach = [...html.matchAll(/<ul class="oz-chang-bai">/g)].length;
		const tatCa = [...html.matchAll(/<ul class="oz-chang-bai">([\s\S]*?)<\/ul>/g)].flatMap((m) => muc(`<ul class="oz-chang-bai">${m[1]}</ul>`, 'oz-chang-bai'));
		if (!bai.length) {
			assert.equal(c.id, 1, 'chỉ chặng 1 chưa có bài học tác phẩm');
			assert.deepEqual(tatCa.map(([d]) => d), BAT_DAU_CHANG_1.map(([d]) => `/opus/${d}`));
			continue;
		}
		const goiY = bai.filter((r) => r.goi_y);
		const khac = bai.filter((r) => !r.goi_y);
		assert.equal(danhSach, (goiY.length ? 1 : 0) + (khac.length ? 1 : 0), `chặng ${c.id}: số danh sách`);
		assert.deepEqual(
			tatCa,
			[...goiY, ...khac].map((r) => [diaChi(r), ganDung(r.grade)]),
			`chặng ${c.id}: bài và Grade theo tac-pham.yml`,
		);
		if (goiY.length) assert.match(html, /<h3 id="nen-bat-dau">Nên bắt đầu<\/h3>/);
	}
});

test('menu của trang chặng: tên 7 chặng ngay sau trang lộ trình (nếu trang ấy có trong bản build), trang đang xem được đánh dấu', () => {
	const html = docTrang('piano/lo-trinh/chang-4');
	const menuBen = html.slice(html.indexOf('<ul class="top-level oz-menu'), html.indexOf('</sl-sidebar-state-persist>'));
	const ds = [...menuBen.matchAll(/<a href="\/opus\/piano\/lo-trinh\/([^"]*)"( aria-current="page")?[^>]*><span[^>]*>([^<]+)<\/span>/g)].map((m) => [m[1], !!m[2], m[3]]);
	const chang = ds.filter(([d]) => d.startsWith('chang-'));
	assert.deepEqual(
		chang,
		capDo.map((c) => [`chang-${c.id}/`, c.id === 4, `Chặng ${c.id}. ${c.ten}`]),
	);
	if (ds.length > chang.length) assert.equal(ds[0][0], '', 'trang lộ trình đứng trước 7 trang chặng');
});

test('trang chủ: ô gợi ý tập mang chặng, bài nên bắt đầu (goi_y của dữ liệu), cờ "có trong bản build" đúng với dist/', (t) => {
	const f = path.join(DIST, 'index.html');
	if (!fs.existsSync(f)) return t.skip('bản build chưa có trang chủ');
	const html = fs.readFileSync(f, 'utf8');
	const m = /<div class="oz-goi-y oz-tool" data-goi-y="([^"]*)">/.exec(html);
	assert.ok(m, 'trang chủ thiếu ô gợi ý tập');
	const d = JSON.parse(giaiMa(m[1]));
	const coTrongDist = (href) => fs.existsSync(path.join(DIST, decodeURI(href).replace(/^\/opus\//, ''), 'index.html'));
	assert.deepEqual(d.chang.map((c) => c.id), capDo.map((c) => c.id));
	for (const c of d.chang) {
		const mong = c.id === 1 ? BAT_DAU_CHANG_1.map(([x]) => `/opus/${x}`) : du['tac-pham'].filter((r) => r.loai === 'bai-hoc' && r.chang === c.id && r.goi_y).map((r) => `/opus/piano/tac-pham/${r.slug}/`);
		assert.deepEqual(c.goi_y.map((x) => x.href), mong, `chặng ${c.id}: bài nên bắt đầu`);
		for (const x of [c.trang, ...c.goi_y]) assert.equal(x.co, coTrongDist(x.href), `${x.href}: cờ "có trong bản build" sai`);
	}
	for (const x of [d.kiem_tra, d.nhac_ly, d.nang_cao]) assert.equal(x.co, coTrongDist(x.href), `${x.href}: cờ "có trong bản build" sai`);
	const nhacLy = fs.existsSync(path.join(DIST, 'nhac-ly'))
		? fs
				.readdirSync(path.join(DIST, 'nhac-ly'), { withFileTypes: true })
				.filter((e) => e.isDirectory() && fs.existsSync(path.join(DIST, 'nhac-ly', e.name, 'index.html')))
				.map((e) => `/opus/nhac-ly/${e.name}/`)
		: [];
	assert.deepEqual([...d.bai_nhac_ly].sort(), nhacLy.sort(), 'danh sách bài nhạc lý của bản build');
});
