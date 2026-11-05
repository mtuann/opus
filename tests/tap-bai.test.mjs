// Kiểm thử nút "Tôi đang tập bài này" ở hộp tác phẩm (D6-L1; src/scripts/tap-bai.js, hopTacPham trong
// src/plugins/thanh-phan.mjs): dựng sẵn đúng lúc build (nút tắt, data-sinh, không in, không vào chỉ mục tìm kiếm); cùng HTML
// và cùng dữ liệu ghi với mountPiece của ../opus-zero/docs/assets/js/practice.js (chạy trong vm, khi có thư mục ấy); dữ liệu
// ghi ở opus-zero:v1 đọc được bởi bài đang tập (bai-dang-tap.js), kế hoạch tập (ke-hoach.js) và nhật ký (mucNgay).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canTaiScript } from '../src/plugins/thanh-phan.mjs';
import { NHAC, apThaoTac, dungNutTapBai, khoaTrang } from '../src/scripts/tap-bai.js';
import { dungBaiDangTap, truoc } from '../src/scripts/bai-dang-tap.js';
import { tinhKeHoach, trangThaiTu } from '../src/scripts/ke-hoach.js';
import { KHOA, datKho, docTienDo, ghiNgay, layKho, mucNgay } from '../src/scripts/tien-do.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const coCu = fs.existsSync(path.join(JS_CU, 'practice.js'));

function dung(md, trang = 'piano/tac-pham/minuet-sol') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html.trim();
}

test('hộp tác phẩm dựng sẵn hàng nút: trạng thái chưa tập, nút tắt, data-sinh, không in, có bộ tải', () => {
	const html = dung('---\ntac_pham: minuet-sol\n---\n\n::hop-tac-pham');
	const m = /<div class="oz-piece-actions oz-khong-in" data-sinh data-pagefind-ignore data-goc="\/opus\/">(.*?)<\/div><\/div>$/.exec(html);
	assert.ok(m, 'hàng nút ở cuối hộp .oz-piece');
	assert.equal(m[1], `<button type="button" class="oz-btn oz-btn--primary" data-a="learning" disabled>Tôi đang tập bài này</button><span class="oz-stats">${NHAC}</span>`);
	assert.equal(m[1], dungNutTapBai(undefined, '', { tat: true }));
	assert.ok(canTaiScript(html), 'trang có hộp tác phẩm tải bộ tải thành phần');
	const tai = fs.readFileSync(path.join(ROOT, 'src/scripts/tai.js'), 'utf8');
	assert.match(tai, /\['\.oz-piece-actions', \(\) => import\('\.\/tap-bai\.js'\), true\]/);
	// in và sách in bỏ hàng nút
	const css = fs.readFileSync(path.join(ROOT, 'src/styles/thanh-phan.css'), 'utf8');
	assert.match(css, /@media print \{\s*\.oz-piece-actions \{\s*display: none !important;/);
	assert.match(fs.readFileSync(path.join(ROOT, 'src/sach/sach.mjs'), 'utf8'), /'oz-khong-in'/);
});

test('khóa trang như pageKey cũ', () => {
	assert.equal(khoaTrang('/opus/piano/tac-pham/minuet-sol/', '/opus/'), 'piano/tac-pham/minuet-sol/');
	assert.equal(khoaTrang('/opus/piano/tac-pham/minuet-sol/index.html', '/opus/'), 'piano/tac-pham/minuet-sol/');
	assert.equal(khoaTrang('/khac/x/', '/opus/'), '/khac/x/');
});

test('nút theo trạng thái: chữ lấy từ dữ liệu được thoát; số buổi lạ không làm hỏng', () => {
	assert.match(dungNutTapBai({ status: 'done', doneOn: '<b>' }, '2026-11-05'), /\(&lt;b&gt;\)/);
	assert.doesNotMatch(dungNutTapBai({ status: 'learning', n: 'x', last: '' }, '2026-11-05'), /Đã tập/);
	assert.match(dungNutTapBai({ status: 'learning', n: 2, last: '2026-11-05' }, '2026-11-05'), /disabled>Đã ghi buổi tập hôm nay/);
	assert.equal(dungNutTapBai('hỏng', '2026-11-05'), dungNutTapBai(undefined, '2026-11-05'));
	// ngày hỏng: không ghi "lần cuối NaN ngày trước"
	assert.match(dungNutTapBai({ status: 'learning', n: 2, last: 'x' }, '2026-11-05'), /Đã tập 2 buổi\.<\/span>$/);
	assert.equal(truoc('2026-13-xx', '2026-11-05'), '');
	assert.equal(truoc(20261101, '2026-11-05'), '');
	assert.equal(apThaoTac([], 'a/', 'learning', { ten: 'A', today: '2026-11-05', bayGio: 'x' }).rep['a/'].status, 'learning');
	assert.deepEqual(apThaoTac({}, 'a/', 'la', { ten: 'A', today: '2026-11-05', bayGio: 'x' }), { rep: {}, buoi: false });
});

/**
 * Chạy mountPiece của practice.js cũ trong vm trên một thẻ giả. Trả về { box, bam(a), store, ghi }: box.innerHTML là phần cũ
 * vẽ; bam(a) mô phỏng bấm nút data-a; store là kho đang lưu; ghi đếm record("piano").
 */
function chayCu(store, ngay, { ten = 'Petzold: Minuet Sol trưởng', trang = '/opus/piano/tac-pham/minuet-sol/' } = {}) {
	const nghe = {};
	const box = { className: '', innerHTML: '', addEventListener: (ev, f) => (nghe[ev] = f) };
	const the = { dataset: {}, appendChild() {} };
	const ghi = { piano: 0 };
	const tienDo = {
		getStore: (k, md) => (store[k] !== undefined ? JSON.parse(JSON.stringify(store[k])) : md),
		setStore: (k, v) => (store[k] = JSON.parse(JSON.stringify(v))),
		today: () => ngay,
		record: (k, n) => (ghi[k] = (ghi[k] || 0) + n),
	};
	const window = { OZReady: (f) => f(), OZProgress: tienDo };
	const document = {
		querySelectorAll: (s) => (s === '.oz-piece' ? [the] : []),
		querySelector: (s) => (s === 'link[rel="manifest"]' ? { href: 'https://x.test/opus/manifest.webmanifest' } : s === '.md-content h1' ? { textContent: ten + '¶' } : null),
		createElement: () => box,
		addEventListener() {},
		body: { contains: () => true },
	};
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, 'practice.js'), 'utf8'), { window, document, location: { href: 'https://x.test' + trang, pathname: trang }, URL, CustomEvent: class {} });
	const bam = (a) => {
		nghe.click({ target: { closest: () => ({ dataset: { a } }) } });
	};
	return { box, bam, store, ghi };
}

const bo = (rep) => JSON.parse(JSON.stringify(rep, (k, v) => (k === 'updated' ? undefined : v)));

test('cùng HTML và cùng dữ liệu ghi với mountPiece của practice.js cũ', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const key = 'piano/tac-pham/minuet-sol/';
	const ngay = '2026-11-05';
	const TRANG_THAI = [
		undefined,
		{ name: 'X', since: '2026-10-01', n: 0, last: '', status: 'learning' },
		{ name: 'X', since: '2026-10-01', n: 3, last: '2026-11-03', status: 'learning' },
		{ name: 'X', since: '2026-10-01', n: 4, last: ngay, status: 'learning' },
		{ name: 'X', since: '2026-10-01', n: 4, last: '2026-11-04', status: 'done', doneOn: '2026-11-04' },
		{ name: 'X', since: '2026-10-01', status: 'done' },
		{ name: 'X', since: '2026-10-01', n: 2, last: '2026-10-01', status: 'removed' },
	];
	for (const r of TRANG_THAI) {
		// vẽ
		const cu = chayCu(r ? { repertoire: { [key]: r } } : {}, ngay);
		// khác có chủ ý: dòng nhắc nói kế hoạch tập ở trang Piano (site mới không có kế hoạch ở trang chủ)
		assert.equal(dungNutTapBai(r, ngay), cu.box.innerHTML.replace('Bài sẽ hiện trong kế hoạch hôm nay ở trang chủ.', NHAC), String(JSON.stringify(r)));
		// từng thao tác: cùng kho mới, cùng số buổi ghi vào ngày
		for (const a of ['learning', 'practiced', 'done', 'remove']) {
			const c = chayCu(r ? { repertoire: { [key]: r, 'khac/': { name: 'K', status: 'learning' } } } : {}, ngay);
			const truoc = JSON.parse(JSON.stringify(c.store.repertoire ?? {}));
			c.bam(a);
			const moi = apThaoTac(truoc, key, a, { ten: 'Petzold: Minuet Sol trưởng', today: ngay, bayGio: '2026-11-05T00:00:00.000Z' });
			assert.deepEqual(bo(moi.rep), bo(c.store.repertoire), `${JSON.stringify(r)} + ${a}`);
			assert.equal(moi.buoi ? 1 : 0, c.ghi.piano, `${JSON.stringify(r)} + ${a}: số buổi`);
			assert.equal(typeof moi.rep[key].updated, 'string');
		}
	}
});

test('ghi ở opus-zero:v1: bài đang tập, kế hoạch tập và nhật ký đọc được', (t) => {
	const kho = new Map();
	const cu = { localStorage: globalThis.localStorage, document: globalThis.document };
	globalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, v) };
	const bao = [];
	globalThis.document = { dispatchEvent: (e) => bao.push(e.type) };
	t.after(() => Object.assign(globalThis, cu));
	// dữ liệu site cũ đang có: một bài khác và một ngày đã ghi
	kho.set(KHOA, JSON.stringify({ days: { '2026-11-01': { tasks: {}, note: '', notes: 0, intervals: 0, minutes: 0, piano: 1 } }, store: { repertoire: { 'piano/tac-pham/fur-elise/': { name: 'Beethoven: Für Elise', since: '2026-10-01', n: 5, last: '2026-11-01', status: 'learning' } } } }));
	const key = 'piano/tac-pham/minuet-sol/';
	const homNay = (() => {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	})();
	for (const a of ['learning', 'practiced']) {
		const { rep, buoi } = apThaoTac(layKho('repertoire', {}), key, a, { ten: 'Petzold: Minuet Sol trưởng, BWV Anh. 114', today: homNay, bayGio: new Date().toISOString() });
		datKho('repertoire', rep);
		if (buoi) ghiNgay('piano', 1);
	}
	assert.ok(bao.includes('oz:progress'));
	const data = JSON.parse(kho.get('opus-zero:v1'));
	assert.deepEqual(Object.keys(data.store.repertoire).sort(), ['piano/tac-pham/fur-elise/', key]);
	assert.equal(data.store.repertoire[key].n, 1);
	assert.equal(data.days[homNay].piano, 1);
	assert.equal(data.days['2026-11-01'].piano, 1, 'ngày cũ giữ nguyên');
	assert.ok(mucNgay(docTienDo().days[homNay]) >= 2, 'nhật ký tính buổi tập bên đàn');
	// bài đang tập (mục lục Piano, trang Nhật ký)
	const h = dungBaiDangTap(layKho('repertoire', {}), { compact: true, today: homNay, data: { goc: '/opus/', trang: [key, 'piano/tac-pham/fur-elise/'], muc_luc: 'piano/tac-pham/' } });
	assert.match(h, /<a href="\/opus\/piano\/tac-pham\/minuet-sol\/">Petzold: Minuet Sol trưởng, BWV Anh\. 114<\/a> <span class="oz-stats">· 1 buổi · lần cuối hôm nay<\/span>/);
	// kế hoạch tập hôm nay (trang Piano): bài có trong phần bên đàn
	const kh = tinhKeHoach(trangThaiTu((k, md) => layKho(k, md), homNay));
	assert.ok(kh.plan.some((p) => p.kind === 'piece' && p.url === key && p.name === 'Tập bài: Petzold: Minuet Sol trưởng, BWV Anh. 114'));
	// bấm lần nữa trong ngày: không thêm buổi
	const lai = apThaoTac(layKho('repertoire', {}), key, 'practiced', { ten: 'T', today: homNay, bayGio: 'x' });
	assert.equal(lai.buoi, false);
	assert.equal(lai.rep[key].n, 1);
});
