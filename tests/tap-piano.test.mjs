// Kiểm thử thành phần của lô D4-L1 (mục Piano): máy đếm nhịp (::cong-cu{ten="metronome"}, src/scripts/may-dem-nhip.js),
// bài đang tập (repertoire, src/scripts/bai-dang-tap.js), kế hoạch tập hôm nay (plan, src/scripts/ke-hoach.js). Dựng HTML
// đúng (chữ thật, data-sinh, thông số lạ thì build hỏng); đọc store đúng khóa và định dạng cũ, ra cùng kết quả với
// JavaScript cũ (../opus-zero/docs/assets/js/metronome.js, practice.js, plan.js chạy trong vm) khi có thư mục ấy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { baiDangTap, canTaiScript, coAmPiano, duongDanTrang, keHoach } from '../src/plugins/thanh-phan.mjs';
import { BPM_CAO, BPM_THAP, TOC_DO, bpmTuLanGo, henPhach, tenTocDo, veMayDemNhip } from '../src/scripts/may-dem-nhip.js';
import { dungBaiDangTap, truoc } from '../src/scripts/bai-dang-tap.js';
import { BAI_NHAC_LY, KY_NANG, TRANG_KE_HOACH, baiDaXong, dungKeHoach, tinhKeHoach, trangThaiTu } from '../src/scripts/ke-hoach.js';
import { KHOA, layKho } from '../src/scripts/tien-do.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const coCu = fs.existsSync(JS_CU);
const j = (x) => JSON.parse(JSON.stringify(x));

function dung(md, trang = 'piano/index') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html.trim();
}
const chu = (h) => h.replace(/<noscript[\s\S]*?<\/noscript>/g, '').replace(/<[^>]+>/g, '');

/**
 * Chạy một file JavaScript cũ (IIFE) trong vm. `chon`: bộ chọn -> các phần tử giả mà document.querySelectorAll trả về;
 * OZReady chạy init ngay. Trả về window của nó.
 */
function chayCu(ten, { chon = {}, them = {} } = {}) {
	const window = { OZReady: (f) => f(), ...them };
	const document = {
		querySelectorAll: (s) => chon[s] ?? [],
		querySelector: (s) => (s === 'link[rel="manifest"]' ? { href: 'https://x.test/opus/manifest.json' } : null),
		addEventListener() {},
		body: { contains: () => true },
	};
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, ten), 'utf8'), { window, document, location: { href: 'https://x.test/opus/piano/' }, URL, CustomEvent: class {}, ...them });
	return window;
}
/** Phần tử giả cho mount cũ: ghi lại innerHTML, hidden. */
const oGia = (thuocTinh = []) => ({ dataset: {}, classList: { add() {} }, hasAttribute: (a) => thuocTinh.includes(a), hidden: false, innerHTML: '' });
/** OZProgress giả: đọc kho `store`, hôm nay là `ngay`. */
const tienDoGia = (store, ngay) => ({ getStore: (k, md) => (store[k] !== undefined ? store[k] : md), today: () => ngay, load: () => ({ days: {}, store }) });

// ---------- dựng HTML lúc build ----------

test('dựng sẵn ba công cụ: chữ thật, data-sinh, không ghi nguồn mẫu âm; thông số lạ thì build hỏng', () => {
	const mdn = dung('::cong-cu{ten="metronome"}', 'piano/hai-tuan-dau');
	assert.equal(mdn, veMayDemNhip());
	assert.match(mdn, /^<div class="oz-may-dem-nhip oz-tool not-content" data-sinh data-pagefind-ignore>/);
	assert.match(mdn, /<span class="oz-bpm" aria-live="polite">80<\/span>/);
	assert.match(mdn, /<input type="range" class="oz-mdn-keo" min="30" max="240" value="80" aria-label="Tốc độ \(BPM\)">/);
	assert.match(mdn, /<div class="oz-stats oz-mark">Andante — vừa phải, như bước đi<\/div>/);
	assert.equal((mdn.match(/class="oz-beat"/g) ?? []).length, 4);
	assert.equal((mdn.match(/<button type="button"/g) ?? []).length, 4);
	const rep = dung('::cong-cu{ten="repertoire" compact=""}');
	assert.match(rep, /^<div class="oz-bai-dang-tap oz-tool not-content" data-sinh data-pagefind-ignore data-compact hidden data-bai-dang-tap="[^"]+"><\/div>$/);
	const rep2 = dung('::cong-cu{ten="repertoire"}');
	assert.match(rep2, /<p class="oz-tool-title">Bài đang tập<\/p><p class="oz-stats">Chưa có bài nào\. Mở một .*bài học tác phẩm.* và bấm "Tôi đang tập bài này"\.<\/p><\/div>$/);
	const plan = dung('::cong-cu{ten="plan"}');
	assert.match(plan, /^<div class="oz-ke-hoach oz-tool not-content" data-sinh data-pagefind-ignore data-ke-hoach="[^"]+"><p class="oz-stats">Buổi tập hôm nay \(khoảng 39 phút\)/);
	for (const h of [mdn, rep, rep2, plan]) {
		assert.ok(canTaiScript(h));
		assert.ok(!coAmPiano(h), 'không phát tiếng piano: không cần dòng ghi nguồn mẫu âm');
	}
	assert.throws(() => dung('::cong-cu{ten="metronome" bpm="60"}'), /công cụ "metronome" không nhận thông số \(bpm\)/);
	assert.throws(() => dung('::cong-cu{ten="plan" compact=""}'), /công cụ "plan" không nhận thông số \(compact\)/);
	assert.throws(() => dung('::cong-cu{ten="repertoire" gon=""}'), /công cụ "repertoire" không nhận thông số gon/);
	assert.throws(() => dung('::cong-cu{ten="repertoire" compact="1"}'), /compact không nhận giá trị/);
});

test('link của bài đang tập và kế hoạch: trang chưa có trong bản build hiện "sắp có"; mọi trang kế hoạch dẫn tới có trong kế hoạch site', () => {
	assert.deepEqual(['index', 'piano/index', 'piano/gam', 'piano/tac-pham/index'].map(duongDanTrang), ['', 'piano/', 'piano/gam/', 'piano/tac-pham/']);
	const ds = ['piano/hai-tuan-dau', 'piano/tac-pham/index', 'piano/tac-pham/fur-elise', 'nghe-nhac/bach-goldberg', 'nhac-ly/01-cao-do-ten-not', 'piano/tu-the'];
	const data = JSON.parse(baiDangTap({ compact: '' }, ds).match(/data-bai-dang-tap="([^"]+)"/)[1].replaceAll('&quot;', '"'));
	assert.deepEqual(data, {
		goc: '/opus/',
		trang: ['nhac-ly/01-cao-do-ten-not/', 'piano/hai-tuan-dau/', 'piano/tac-pham/', 'piano/tac-pham/fur-elise/', 'nghe-nhac/bach-goldberg/'],
		muc_luc: 'piano/tac-pham/',
	});
	const h = keHoach(ds);
	assert.match(h, /<a href="\/opus\/piano\/hai-tuan-dau\/">Bên đàn: Hai tuần đầu tiên<\/a>/);
	assert.match(h, /<span class="oz-sap-co" data-href="\/opus\/luyen-tap\/doc-not\/"[^>]*>Đọc nốt <span class="oz-sap-co-nhan"/);
	const keHoachSite = new Set(parse(fs.readFileSync(path.join(ROOT, 'src/data/trang.yml'), 'utf8')).map((t) => duongDanTrang(t.id)));
	for (const t of TRANG_KE_HOACH) assert.ok(keHoachSite.has(t), `${t} không có trong src/data/trang.yml`);
	// dữ liệu đã lưu hỏng: địa chỉ lạ không thành link, chữ được thoát
	const r = dungBaiDangTap({ 'javascript:alert(1)//': { status: 'learning', name: '<img src=x>' } }, { compact: true, today: '2026-10-28', data });
	assert.doesNotMatch(r, /<a |<img/);
	assert.match(r, /&lt;img src=x&gt;/);
});

// ---------- máy đếm nhịp ----------

test('máy đếm nhịp: tên tốc độ, khoảng BPM, chữ và nút như metronome.js cũ', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const src = fs.readFileSync(path.join(JS_CU, 'metronome.js'), 'utf8');
	const cu = vm.runInNewContext(`${src.slice(src.indexOf('"use strict";') + 13, src.indexOf('function mount'))}; ({ MARKS, markFor })`, {});
	assert.deepEqual(TOC_DO, j(cu.MARKS));
	for (let b = BPM_THAP; b <= BPM_CAO; b++) assert.equal(tenTocDo(b), cu.markFor(b), b);
	assert.match(src, /Math\.max\(30, Math\.min\(240,/);
	assert.match(src, /setBpm\(80\)/);
	const htmlCu = vm.runInNewContext(src.match(/root\.innerHTML =\s*([\s\S]*?);\n/)[1], {});
	// chữ giống hệt (bản mới điền sẵn tên tốc độ và đèn phách mà bản cũ điền khi chạy)
	assert.equal(chu(veMayDemNhip()).replace(tenTocDo(80), ''), chu(htmlCu));
	const thuoc = (h, ten) => [...h.matchAll(new RegExp(` ${ten}="([^"]*)"`, 'g'))].map((m) => m[1]);
	for (const t of ['data-act', 'aria-label', 'data-k', 'min', 'max', 'value']) assert.deepEqual(thuoc(veMayDemNhip(), t), thuoc(htmlCu, t), t);
	assert.match(src, /OZProgress\.record\("minutes", mins\)/);
});

test('máy đếm nhịp: hẹn phách theo đồng hồ của AudioContext, cách đều 60/BPM, nhấn phách đầu ô nhịp; gõ để đo tốc độ', () => {
	const lich = { ke: 1, phach: 0 };
	const a = henPhach(lich, 0.9, { bpm: 120, soPhach: 3, nhan: true });
	assert.deepEqual(a, [[1, 0, true]], 'chỉ hẹn trong 0,12 giây tới');
	const b = henPhach(lich, 2.4, { bpm: 120, soPhach: 3, nhan: true });
	assert.deepEqual(b, [
		[1.5, 1, false],
		[2, 2, false],
		[2.5, 0, true],
	]);
	assert.deepEqual(henPhach(lich, 2.4, { bpm: 120, soPhach: 3, nhan: true }), [], 'đã hẹn thì không hẹn lại');
	assert.deepEqual(henPhach({ ke: 0, phach: 0 }, 0, { bpm: 60, soPhach: 4, nhan: false }), [[0, 0, false]]);
	assert.equal(bpmTuLanGo([0]), null);
	assert.equal(bpmTuLanGo([0, 500, 1000, 1500]), 120);
	assert.equal(bpmTuLanGo([0, 100]), 240, 'giới hạn trên');
	assert.equal(bpmTuLanGo([0, 2400]), 30, 'giới hạn dưới');
});

/** Ô máy đếm nhịp giả (đủ cho mount): các phần tử theo bộ chọn, ghi lại chữ và trình nghe sự kiện. */
function oMayDemNhip() {
	const el = (x = {}) => ({ textContent: '', innerHTML: '', value: '', checked: false, nghe: {}, addEventListener(ev, f) { this.nghe[ev] = f; }, querySelectorAll: () => [], ...x });
	const p = {
		'.oz-bpm': el(),
		'.oz-mdn-keo': el({ value: '80' }),
		'.oz-mark': el(),
		'.oz-beats': el(),
		'[data-act="toggle"]': el({ textContent: 'Bắt đầu', dataset: { act: 'toggle' } }),
		'[data-k="beats"]': el({ value: '3' }),
		'[data-k="accent"]': el({ checked: true }),
	};
	const goc = el({ dataset: {}, querySelector: (q) => p[q] });
	const bam = (nut) => goc.nghe.click({ target: { closest: () => nut } });
	return { goc, p, bam: () => bam(p['[data-act="toggle"]']) };
}

test('máy đếm nhịp: chỉ phát khi bấm, tiếng gõ hẹn theo đồng hồ AudioContext, nhấn phách đầu; một máy chạy một lúc; dừng thì ghi số phút vào days[ngày].minutes; dừng khi rời trang', async (t) => {
	const src = fs.readFileSync(path.join(ROOT, 'src/scripts/may-dem-nhip.js'), 'utf8');
	assert.doesNotMatch(src, /setInterval/, 'không dùng setInterval làm nhịp');
	const kho = new Map();
	const go = []; // [lúc, tần số] của mỗi tiếng gõ
	const nghe = {};
	const ng = { currentTime: 0, state: 'running', destination: {} };
	const nut = () => ({ gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (x) => x });
	ng.createGain = nut;
	ng.createOscillator = () => ({ frequency: { value: 0 }, connect: (x) => x, start(luc) { go.push([luc, this.frequency.value]); }, stop() {} });
	const cu = { ...globalThis };
	Object.assign(globalThis, {
		window: { AudioContext: class { constructor() { return ng; } } },
		localStorage: { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, v) },
		document: { dispatchEvent: () => true },
		addEventListener: (ev, f) => (nghe[ev] ??= []).push(f),
		requestAnimationFrame: () => 0,
	});
	t.after(() => {
		for (const k of ['window', 'localStorage', 'document', 'addEventListener', 'requestAnimationFrame']) globalThis[k] = cu[k];
	});
	const { mount } = await import('../src/scripts/may-dem-nhip.js');
	const a = oMayDemNhip();
	const b = oMayDemNhip();
	mount(a.goc);
	mount(b.goc);
	assert.equal(a.p['.oz-mark'].textContent, 'Andante — vừa phải, như bước đi');
	assert.deepEqual(go, [], 'chưa bấm thì không phát');
	const dongHo = Date.now;
	const bayGio = Date.now();
	try {
		a.bam();
		assert.equal(a.p['[data-act="toggle"]'].textContent, 'Dừng');
		assert.deepEqual(go, [[0.08, 1500]], 'phách đầu (nhấn) hẹn ngay sau lúc bấm');
		ng.currentTime = 1.5; // 80 BPM: 0,75 giây một phách; ô nhịp 3 phách
		await new Promise((ok) => setTimeout(ok, 60));
		assert.deepEqual(go.map(([l, f]) => [Math.round(l * 100) / 100, f]), [
			[0.08, 1500],
			[0.83, 1000],
			[1.58, 1000],
		]);
		ng.currentTime = 2.3;
		await new Promise((ok) => setTimeout(ok, 60));
		assert.deepEqual(go.at(-1).map((x) => Math.round(x * 100) / 100), [2.33, 1500], 'phách đầu ô nhịp sau được nhấn');
		// bấm máy thứ hai: máy đầu dừng; 2,5 phút sau dừng máy thứ hai: ghi 2 phút
		b.bam();
		assert.equal(a.p['[data-act="toggle"]'].textContent, 'Bắt đầu');
		Date.now = () => bayGio + 150_000;
		b.bam();
		assert.equal(b.p['[data-act="toggle"]'].textContent, 'Bắt đầu');
		const ngay = Object.values(JSON.parse(kho.get('opus-zero:v1')).days);
		assert.deepEqual(ngay.map((d) => d.minutes), [2]);
		// rời trang khi đang chạy: dừng (và ghi phút)
		Date.now = () => bayGio + 150_000;
		a.bam();
		Date.now = () => bayGio + 300_000;
		for (const f of nghe.pagehide) f();
		assert.equal(a.p['[data-act="toggle"]'].textContent, 'Bắt đầu');
		assert.deepEqual(Object.values(JSON.parse(kho.get('opus-zero:v1')).days).map((d) => d.minutes), [4]);
		const n = go.length;
		ng.currentTime = 9;
		await new Promise((ok) => setTimeout(ok, 60));
		assert.equal(go.length, n, 'đã dừng thì không hẹn thêm');
	} finally {
		Date.now = dongHo;
	}
});

// ---------- bài đang tập ----------

const REP = {
	'piano/tac-pham/fur-elise/': { name: 'Beethoven: Für Elise', since: '2026-10-01', n: 5, last: '2026-10-27', status: 'learning', updated: 'x' },
	'piano/tac-pham/minuet-sol/': { name: 'Petzold: Minuet <Sol> & "trưởng"', since: '2026-10-20', n: 0, last: '', status: 'learning' },
	'piano/tac-pham/mozart-k545/': { name: 'Mozart: K. 545', n: 2, last: '2026-10-10', status: 'learning' },
	'piano/tac-pham/clementi-sonatina/': { name: 'Clementi', status: 'done', doneOn: '2026-09-01' },
	'piano/tac-pham/bach-prelude-do/': { name: 'Bach', status: 'done', doneOn: '2026-10-02' },
	'piano/tac-pham/chopin/': { name: 'Chopin', status: 'removed', n: 3 },
	'nghe-nhac/bach-goldberg/': { status: 'done' },
};
const TAT_CA = { goc: '/opus/', trang: [...Object.keys(REP), 'piano/tac-pham/x/', 'piano/tac-pham/', ...TRANG_KE_HOACH], muc_luc: 'piano/tac-pham/' };

test('bài đang tập: cùng HTML với mountRepertoire của practice.js cũ (compact và không, có bài và chưa có)', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const ngay = '2026-10-28';
	for (const [store, compact] of [
		[{ repertoire: REP }, true],
		[{ repertoire: REP }, false],
		[{}, true],
		[{}, false],
		[{ repertoire: { 'piano/tac-pham/x/': { name: 'X', status: 'done' } } }, false],
	]) {
		const o = oGia(compact ? ['data-compact'] : []);
		chayCu('practice.js', { chon: { '.oz-repertoire': [o] }, them: { OZProgress: tienDoGia(store, ngay) } });
		const moi = dungBaiDangTap(store.repertoire ?? {}, { compact, today: ngay, data: TAT_CA });
		assert.equal(moi === null, o.hidden, 'ẩn khi compact và chưa có bài');
		if (moi !== null) assert.equal(moi, o.innerHTML.replaceAll('https://x.test/opus/', '/opus/'));
	}
	assert.equal(truoc('2026-10-28', '2026-10-28'), 'hôm nay');
	assert.equal(truoc('2026-10-27', '2026-10-28'), 'hôm qua');
	assert.equal(truoc('2026-09-28', '2026-10-28'), '30 ngày trước');
});

test('bài đang tập: đọc store.repertoire ở khóa opus-zero:v1 (dữ liệu site cũ), thứ tự như bản cũ', (t) => {
	const kho = new Map([[KHOA, JSON.stringify({ days: {}, store: { repertoire: REP } })]]);
	const cu = globalThis.localStorage;
	globalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, v) };
	t.after(() => (globalThis.localStorage = cu));
	assert.equal(KHOA, 'opus-zero:v1');
	const h = dungBaiDangTap(layKho('repertoire', {}), { compact: true, today: '2026-10-28', data: TAT_CA });
	const ten = [...h.matchAll(/<li><a href="\/opus\/([^"]+)">/g)].map((m) => m[1]);
	assert.deepEqual(ten, [
		'piano/tac-pham/minuet-sol/',
		'piano/tac-pham/mozart-k545/',
		'piano/tac-pham/fur-elise/',
		'piano/tac-pham/bach-prelude-do/',
		'piano/tac-pham/clementi-sonatina/',
		'nghe-nhac/bach-goldberg/',
	]);
	assert.match(h, /Beethoven: Für Elise<\/a> <span class="oz-stats">· 5 buổi · lần cuối hôm qua<\/span>/);
	assert.match(h, /Petzold: Minuet &lt;Sol&gt; &amp; &quot;trưởng&quot;<\/a> <span class="oz-stats">· mới thêm/);
	assert.match(h, />nghe-nhac\/bach-goldberg\/<\/a> <span class="oz-stats"><\/span>/, 'không có tên thì hiện khóa, như bản cũ');
});

// ---------- kế hoạch tập ----------

/** Bộ sinh số giả ngẫu nhiên có hạt (mulberry32), để lần chạy nào cũng cùng các trạng thái. */
function ngauNhien(hat) {
	return () => {
		hat = (hat + 0x6d2b79f5) | 0;
		let t = Math.imul(hat ^ (hat >>> 15), 1 | hat);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const ngayTruoc = (n) => new Date(Date.UTC(2026, 9, 28 - n)).toISOString().slice(0, 10);
function trangThaiNgauNhien(r) {
	const skills = {};
	for (const [id] of KY_NANG) if (r() < 0.6) skills[id] = { n: Math.floor(r() * 12), c: 0, ema: r(), last: r() < 0.2 ? '' : ngayTruoc(Math.floor(r() * 12)) };
	const lessons = {};
	for (const [b] of BAI_NHAC_LY) if (r() < 0.4) lessons[b] = ngayTruoc(3);
	const rep = {};
	for (let i = 0; i < Math.floor(r() * 4); i++)
		rep[`piano/tac-pham/bai-${i}/`] = { name: `Bài ${i}`, status: ['learning', 'done', 'removed'][Math.floor(r() * 3)], last: r() < 0.3 ? '' : ngayTruoc(Math.floor(r() * 9)), n: 2 };
	return { today: ngayTruoc(Math.floor(r() * 20) - 10), skills, lessons, cardsDue: r() < 0.5 ? 0 : Math.floor(r() * 9), piano: { stage: Math.floor(r() * 8), rep } };
}

test('kế hoạch tập: cùng kết quả với compute() của plan.js cũ trên 400 trạng thái', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const { OZPlan } = chayCu('plan.js', { them: { OZProgress: tienDoGia({}, '2026-10-28') } });
	assert.deepEqual(KY_NANG, j(OZPlan.SKILLS));
	const r = ngauNhien(4);
	for (let i = 0; i < 400; i++) {
		const st = trangThaiNgauNhien(r);
		assert.deepEqual(tinhKeHoach(st), j(OZPlan.compute(st)), JSON.stringify(st));
	}
	// người chưa lưu gì: kế hoạch dựng sẵn lúc build
	assert.deepEqual(tinhKeHoach({ today: '2000-01-01' }), j(OZPlan.compute({ today: '2026-10-28' })));
	// danh sách bài nhạc lý, tên bài như LESSONS, LESSON_NAMES cũ
	const src = fs.readFileSync(path.join(JS_CU, 'plan.js'), 'utf8');
	const cu = vm.runInNewContext(`${src.slice(src.indexOf('"use strict";') + 13, src.indexOf('function siteBase'))}; ({ LESSONS, LESSON_NAMES })`, {});
	assert.deepEqual(BAI_NHAC_LY, j(cu.LESSONS.map((k) => [k, cu.LESSON_NAMES[k]])));
});

test('kế hoạch tập: đọc store như plan.js cũ (pianoLevel, repertoire, skills, lessons cả site cũ, cards đến hạn) và cùng HTML với mountPlan', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const ngay = '2026-10-28';
	const store = {
		pianoLevel: { stage: 3, date: '2026-10-01' },
		repertoire: REP,
		skills: { notes: { n: 8, c: 4, ema: 0.5, last: '2026-10-20' }, intervals: { n: 2, c: 2, ema: 0.8, last: ngay } },
		lessons: { '/opus/nhac-ly/01-cao-do-ten-not/': '2026-10-01', '/opus-zero/nhac-ly/02-khuong-nhac-khoa/': '2026-10-02' },
		cards: { a: { due: '2026-10-27' }, b: { due: '2026-10-29' }, c: { due: ngay } },
	};
	const o = oGia();
	chayCu('plan.js', { chon: { '.oz-plan': [o] }, them: { OZProgress: tienDoGia(store, ngay) } });
	const kho = (k, md) => (store[k] !== undefined ? store[k] : md);
	const st = trangThaiTu(kho, ngay);
	assert.equal(st.cardsDue, 2);
	assert.deepEqual(Object.keys(baiDaXong(store.lessons)), ['01-cao-do-ten-not', '02-khuong-nhac-khoa']);
	assert.equal(dungKeHoach(tinhKeHoach(st), TAT_CA), o.innerHTML.replaceAll('https://x.test/opus/', '/opus/').replaceAll('Minuet <Sol> & "trưởng"', 'Minuet &lt;Sol&gt; &amp; &quot;trưởng&quot;'));
	assert.match(o.innerHTML, /Ôn 2 thẻ thuật ngữ/);
});

// ---------- bản build ----------

test('bản build: năm trang của lô không còn ô "chưa chuyển"; có đủ công cụ và hình', (t) => {
	const doc = (p) => {
		const f = path.join(ROOT, 'dist', p, 'index.html');
		return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
	};
	const trang = ['piano', 'piano/hai-tuan-dau', 'piano/tu-the', 'piano/ban-do-ban-phim', 'piano/10-bai-dau-tien'].map(doc);
	if (trang.includes(null)) return t.skip('chưa có trang trong dist/: chạy npm run build:xem');
	const [mucLuc, haiTuan, tuThe, banDo] = trang;
	for (const h of trang) assert.doesNotMatch(h, /oz-chua-co/);
	assert.match(mucLuc, /class="oz-bai-dang-tap [^"]*" data-sinh data-pagefind-ignore data-compact hidden/);
	assert.match(mucLuc, /class="oz-ke-hoach /);
	assert.equal((mucLuc.match(/<div class="oz-path">/g) ?? []).length, 4);
	assert.match(haiTuan, /class="oz-may-dem-nhip /);
	assert.equal((tuThe.match(/<figure class="oz-figure not-content" data-sinh><svg/g) ?? []).length, 3);
	assert.match(banDo, /aria-label="Bàn phím piano 88 phím từ A0 đến C8/);
});
