// Kiểm thử thành phần của lô D3-L5: công cụ âm học (::cong-cu overtones, spectrum, tuning; src/scripts/am-hoc.js), thẻ ghi
// nhớ (flashcards; src/scripts/the-nho.js), trạng thái bài đã học ở mục lục (lesson-status; src/scripts/trang-thai-bai.js),
// bảng Từ điển dựng từ src/data/thuat-ngu.yml (tuDien, ::tu-dien). Chạy thẳng hàm và Sätteri, không cần build; so với JavaScript
// cũ ở ../opus-zero/ khi có. Bấm, nghe, phím tắt trên trình duyệt thật: tests/trinh-duyet/kiem-am-hoc.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { bangHep } from '../src/plugins/bang-hep.mjs';
import { canTaiScript, congCu, duLieuCho, tuDien } from '../src/plugins/thanh-phan.mjs';
import { AM_CO_BAN, PHO_DEN, PHO_TU, QUANG_LEN_DAY, duongPho, notGanNhat, oBoiAm, tanSoCoBan, viTri } from '../src/scripts/am-hoc.js';
import { KHOANG, MOI_NGAY, cham, congNgay, hangOn } from '../src/scripts/the-nho.js';
import { khoaBai, laBaiNhacLy, ngayHoc } from '../src/scripts/trang-thai-bai.js';
import { KHOA, datKho, ghiNgay, homNay, layKho } from '../src/scripts/tien-do.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');

function dung(md, trang = 'nhac-ly/am-hoc') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}

/** Chạy một file JavaScript cũ (IIFE gắn vào window) trong vm, trả về window của nó. */
function chayCu(ten) {
	const window = {};
	const document = { querySelectorAll: () => [], addEventListener() {} };
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, ten), 'utf8'), { window, document, CustomEvent: class {}, localStorage: null });
	return window;
}

/** Giả localStorage và document (tien-do.js ghi và báo sự kiện); trả về kho để đọc lại. */
function giaTrinhDuyet(t) {
	const kho = new Map();
	const cu = { localStorage: globalThis.localStorage, document: globalThis.document };
	globalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, String(v)) };
	globalThis.document = { dispatchEvent: () => true };
	t.after(() => Object.assign(globalThis, cu));
	return kho;
}

test('công cụ âm học: dựng sẵn ô, nút, bảng 16 bồi âm và trục phổ (chữ thật, data-sinh); trang có chúng thì tải script; không nhận thông số', () => {
	const boi = dung('::cong-cu{ten="overtones"}');
	assert.match(boi, /^<div class="oz-boi-am oz-tool not-content" data-sinh data-pagefind-ignore>/);
	assert.equal((boi.match(/class="oz-boi-am-o"/g) ?? []).length, 16);
	assert.equal((boi.match(/<input type="checkbox" data-n="\d+" checked>/g) ?? []).length, 4, 'bốn bồi âm đầu đánh dấu sẵn như bản cũ');
	for (const [, nhan] of AM_CO_BAN) assert.ok(boi.includes(`>${nhan}</option>`), nhan);
	assert.match(boi, />Nghe lần lượt 1–16<\/button>/);
	assert.match(boi, />Nghe các bồi âm đã chọn cùng lúc<\/button>/);
	// Đô2: bồi âm 5 là Mi4 thấp 14 cent, bồi âm 7 là Si♭4 thấp 31 cent (bảng ở đầu bài)
	assert.match(boi, />Mi \(E4\)<\/button><small>327,0 Hz, lệch -14 cent<\/small>/);
	assert.match(boi, />Si♭ \(B♭4\)<\/button><small>457,8 Hz, lệch -31 cent<\/small>/);
	assert.match(boi, />Đô \(C2\)<\/button><small>65,4 Hz<\/small>/);
	assert.match(boi, /<noscript data-sinh>/);

	const pho = dung('::cong-cu{ten="spectrum"}');
	assert.match(pho, /^<div class="oz-pho oz-tool not-content" data-sinh/);
	for (const chu of ['Bật micro', 'Phát Đô3: piano mẫu', 'Phát Đô3: âm tổng hợp', 'Phát Đô3: sóng sin']) assert.ok(pho.includes(`>${chu}</button>`), chu);
	assert.deepEqual([...pho.matchAll(/class="oz-pho-nhan"[^>]*>([^<]+)</g)].map((m) => m[1]), ['100', '200', '500', '1k', '2k']);
	assert.match(pho, /role="img" aria-label="Phổ tần số"/);

	const ld = dung('::cong-cu{ten="tuning"}');
	assert.match(ld, /^<div class="oz-len-day oz-tool not-content" data-sinh/);
	assert.deepEqual(
		[...ld.matchAll(/data-quang="\d">([^<]+)<small> ([^<]+)<\/small>/g)].map((m) => `${m[1]} ${m[2]}`),
		['5 đúng bình quân 700 cent', '5 đúng thuần (3:2) 702,0 cent', '3 trưởng bình quân 400 cent', '3 trưởng thuần (5:4) 386,3 cent'],
	);
	for (const html of [boi, pho, ld]) assert.ok(canTaiScript(html));
	for (const ten of ['overtones', 'spectrum', 'tuning', 'flashcards', 'lesson-status'])
		assert.throws(() => dung(`::cong-cu{ten="${ten}" f="110"}`), new RegExp(`công cụ "${ten}" không nhận thông số \\(f\\)`));
});

test('bồi âm, hệ lên dây: tên nốt gần nhất và độ lệch như acoustics.js cũ; tần số các quãng đúng', (t) => {
	assert.deepEqual(notGanNhat(440), { ten: 'La (A4)', cent: 0 });
	assert.deepEqual(notGanNhat(261.63 * 5 / 4), { ten: 'Mi (E4)', cent: -14 });
	assert.ok(Math.abs(QUANG_LEN_DAY[0][1] - 392.0) < 0.05 && Math.abs(QUANG_LEN_DAY[3][1] - 327.04) < 0.01);
	if (!fs.existsSync(JS_CU)) return t.skip('không có ../opus-zero/: bỏ phần so với JavaScript cũ');
	const cu = chayCu('acoustics.js').OZAcoustics;
	for (const [f] of AM_CO_BAN)
		for (let n = 1; n <= 16; n++) {
			const a = cu.nearest(f * n);
			assert.deepEqual(notGanNhat(f * n), { ten: a.name, cent: a.cents }, `${f} × ${n}`);
		}
	// mọi ô của ba âm cơ bản dựng được (đổi âm cơ bản trên trình duyệt dựng lại bằng chính hàm này)
	for (const [f] of AM_CO_BAN) assert.equal((oBoiAm(f).match(/<button/g) ?? []).length, 16);
});

test('phổ âm: tìm tần số cơ bản như tuner.js cũ; đường phổ nằm trong khung, thang log 50–5000 Hz', (t) => {
	const rate = 48000;
	const song = (f) => Float32Array.from({ length: 2048 }, (_, i) => 0.5 * Math.sin((2 * Math.PI * f * i) / rate) + 0.2 * Math.sin((4 * Math.PI * f * i) / rate));
	for (const f of [130.81, 220, 440]) assert.ok(Math.abs(tanSoCoBan(song(f), rate) - f) / f < 0.01, `${f} Hz`);
	assert.equal(tanSoCoBan(new Float32Array(2048), rate), -1, 'im lặng');
	if (fs.existsSync(path.join(JS_CU, 'tuner.js'))) {
		const cu = chayCu('tuner.js').OZTuner;
		for (const f of [130.81, 220, 440]) assert.equal(tanSoCoBan(song(f), rate), cu.detect(song(f), rate));
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với tuner.js cũ');
	assert.equal(viTri(PHO_TU), 0);
	assert.equal(viTri(PHO_DEN), 1);
	const d = duongPho(Float32Array.from({ length: 4096 }, () => -60), rate, 8192);
	assert.match(d, /^M/);
	for (const [, x, y] of d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)) assert.ok(x >= 0 && x <= 720 && y >= 0 && y <= 240, `${x} ${y}`);
});

test('thẻ ghi nhớ: hệ Leitner như flashcards.js cũ (0, 1, 3, 7, 16, 35 ngày; 10 thẻ mới mỗi ngày)', (t) => {
	assert.deepEqual(KHOANG, [0, 1, 3, 7, 16, 35]);
	assert.equal(MOI_NGAY, 10);
	if (fs.existsSync(JS_CU)) {
		const cu = fs.readFileSync(path.join(JS_CU, 'flashcards.js'), 'utf8');
		assert.match(cu, /INTERVALS = \[0, 1, 3, 7, 16, 35\]/);
		assert.match(cu, /NEW_PER_DAY = 10;/);
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với flashcards.js cũ');
	assert.equal(congNgay('2026-10-28', 4), '2026-11-01');
	assert.equal(congNgay('2026-12-31', 1), '2027-01-01');
	const kho = {};
	assert.deepEqual(cham(kho, 'Largo', true, '2026-10-28'), { box: 1, added: '2026-10-28', due: '2026-10-29' });
	assert.deepEqual(cham(kho, 'Largo', true, '2026-10-29'), { box: 2, added: '2026-10-28', due: '2026-11-01' });
	assert.deepEqual(cham(kho, 'Largo', false, '2026-11-01'), { box: 0, added: '2026-10-28', due: '2026-11-01' });
	for (let i = 0; i < 9; i++) cham(kho, 'Largo', true, '2026-11-01');
	assert.equal(kho.Largo.box, 5, 'hộp cao nhất là 5 (35 ngày)');
	// hàng ôn: thẻ đến hạn, rồi thẻ mới; đã thêm 3 thẻ hôm nay thì chỉ còn 7 thẻ mới
	const bo = Array.from({ length: 20 }, (_, i) => ({ id: `t${i}` }));
	const k2 = { t0: { box: 3, added: '2026-10-01', due: '2026-10-27' }, t1: { box: 1, added: '2026-10-28', due: '2026-10-29' } };
	for (const id of ['t2', 't3']) k2[id] = { box: 0, added: '2026-10-28', due: '2026-10-28' };
	const h = hangOn(bo, k2, '2026-10-28');
	assert.deepEqual([h.den, h.moi, h.nho], [3, 7, 1]);
	assert.deepEqual(h.hang.map((c) => c.id).slice(0, 4), ['t0', 't2', 't3', 't4']);
});

test('thẻ ghi nhớ: lưu ở opus-zero:v1, store.cards theo thuật ngữ { box, added, due }, đếm days[ngày].cards như site cũ', (t) => {
	const kho = giaTrinhDuyet(t);
	// dữ liệu đã có của site cũ được giữ
	kho.set(KHOA, JSON.stringify({ days: {}, store: { lessons: { '/opus-zero/nhac-ly/01-cao-do-ten-not/': '2026-01-02' } } }));
	const the = layKho('cards', {});
	cham(the, 'Allegro', true, homNay());
	datKho('cards', the);
	ghiNgay('cards', 1);
	const data = JSON.parse(kho.get('opus-zero:v1'));
	assert.deepEqual(data.store.cards, { Allegro: { box: 1, added: homNay(), due: congNgay(homNay(), 1) } });
	assert.equal(data.days[homNay()].cards, 1);
	assert.equal(data.store.lessons['/opus-zero/nhac-ly/01-cao-do-ten-not/'], '2026-01-02');
	const html = dung('::cong-cu{ten="flashcards"}', 'nhac-ly/tu-dien');
	assert.match(html, /^<div class="oz-the-nho oz-tool not-content" data-sinh data-pagefind-ignore role="group" aria-label="Thẻ ghi nhớ \(phím cách: lật thẻ; phím 1: chưa nhớ; phím 2: nhớ\)">/);
	assert.ok(canTaiScript(html));
});

test('trạng thái bài đã học: khóa bài như quiz.js cũ, nhận cả bài làm ở site cũ (/opus-zero/), chỉ đếm bài nhạc lý', () => {
	assert.equal(khoaBai('/opus/nhac-ly/01-cao-do-ten-not'), '/opus/nhac-ly/01-cao-do-ten-not/');
	assert.equal(khoaBai('/opus/nhac-ly/01-cao-do-ten-not/index.html'), '/opus/nhac-ly/01-cao-do-ten-not/');
	assert.ok(laBaiNhacLy('/opus/nhac-ly/on-tap-1/'));
	assert.ok(!laBaiNhacLy('/opus/nhac-ly/'));
	assert.ok(!laBaiNhacLy('/opus/bat-dau/kiem-tra-dau-vao/'));
	const bai = { '/opus/nhac-ly/02-khuong-nhac-khoa/': '2026-10-20', '/opus-zero/nhac-ly/03-truong-do/': '2026-01-05' };
	assert.equal(ngayHoc(bai, '/opus/nhac-ly/02-khuong-nhac-khoa/'), '2026-10-20');
	assert.equal(ngayHoc(bai, '/opus/nhac-ly/03-truong-do/'), '2026-01-05');
	assert.equal(ngayHoc(bai, '/opus/nhac-ly/04-nhip/'), undefined);
	const html = dung('::cong-cu{ten="lesson-status"}', 'nhac-ly/index');
	assert.equal(html.trim(), '<div class="oz-trang-thai-bai not-content" data-sinh data-pagefind-ignore><p class="oz-lesson-bar oz-stats"></p></div>');
	assert.ok(canTaiScript(html));
	// trang mục lục: công cụ nằm trong khối bọc mục lục, nên script tìm được các link bài
	const nguon = fs.readFileSync(path.join(DOCS, 'nhac-ly/index.md'), 'utf8');
	assert.match(nguon, /<div class="oz-lesson-status">\n\n::cong-cu\{ten="lesson-status"\}\n[\s\S]*\]\(\/opus\/nhac-ly\/32-ky-thuat-the-ky-20\/\)\n\n<\/div>/);
});

test('tuDien: bảng của một nhóm giống hệt bảng Markdown viết tay (cùng plugin bảng hẹp), theo thứ tự trong dữ liệu', () => {
	const ds = [
		{ id: 'a', thuat_ngu: 'Grave', nghia: 'Rất chậm', ghi_chu: 'Chậm *nhất*', nhom: 'Tốc độ' },
		{ id: 'b', thuat_ngu: 'p', nghia: 'Nhỏ', nhom: 'Cường độ' },
		{ id: 'c', thuat_ngu: 'Lento', nghia: 'Chậm', nhom: 'Tốc độ' },
		{ id: 'd', thuat_ngu: 'x | y', nghia: '<b>đậm</b> [link](/opus/nhac-ly/) [xấu](javascript:alert(1))', nhom: 'Lạ' },
	];
	const tay = markdownToHtml('| Thuật ngữ | Nghĩa | Ghi chú |\n|---|---|---|\n| Grave | Rất chậm | Chậm *nhất* |\n| Lento | Chậm | |', {
		hastPlugins: [bangHep()],
		features: { smartPunctuation: false },
	}).html.trim();
	assert.equal(tuDien('Tốc độ', ds), tay);
	const la = tuDien('Lạ', ds);
	assert.match(la, /<td>x \| y<\/td>/);
	assert.match(la, /&lt;b&gt;đậm&lt;\/b&gt; <a href="\/opus\/nhac-ly\/">link<\/a> xấu/);
	assert.throws(() => tuDien('Không có', ds), /::tu-dien: không có thuật ngữ nào thuộc nhóm "Không có".*\(có: Tốc độ; Cường độ; Lạ\)/);
	assert.throws(() => tuDien('', ds), /::tu-dien cần nhom/);
	// dữ liệu thật: mọi nhóm dựng được, cột đầu là "Thuật ngữ" (thẻ ghi nhớ đọc các bảng này)
	const { thuatNgu } = duLieuCho('nhac-ly/tu-dien', { khoa: { trang: {}, ban_ghi: {} } });
	for (const nhom of new Set(thuatNgu.map((r) => r.nhom))) assert.match(tuDien(nhom, thuatNgu), /^<table>\s*<thead>\s*<tr>\s*<th>Thuật ngữ<\/th>/, nhom);
});

test('tuDien ở trang đã khóa: chỉ đọc trường đã khóa của bản ghi thuật ngữ, đọc trường chưa khóa thì build hỏng', () => {
	const { thuatNgu } = duLieuCho('nhac-ly/tu-dien', { khoa: { trang: { 'nhac-ly/tu-dien': 'sha256:x' }, ban_ghi: {} } });
	assert.throws(() => tuDien('Tốc độ', thuatNgu), /du-lieu\/thuat-ngu\/[a-z0-9-]+#nhom/);
});

test('::tu-dien{nhom}: chỉ thị dựng bảng từ dữ liệu; thiếu nhom, thuộc tính lạ, nhóm lạ thì build hỏng', (t) => {
	let html;
	try {
		html = dung('::tu-dien{nhom="Tốc độ"}', 'nhac-ly/tu-dien');
	} catch (e) {
		if (/không có chỉ thị ::tu-dien/.test(e.message)) return t.skip('src/plugins/opus-markdown.mjs chưa có chỉ thị ::tu-dien');
		throw e;
	}
	const { thuatNgu } = duLieuCho('nhac-ly/tu-dien');
	assert.equal(html.trim(), tuDien('Tốc độ', thuatNgu));
	assert.doesNotMatch(html, /data-sinh/, 'bảng là chữ của trang: so chữ và tìm kiếm thấy');
	assert.throws(() => dung('::tu-dien', 'nhac-ly/tu-dien'), /tu-dien\.md: ::tu-dien thiếu thuộc tính nhom/);
	assert.throws(() => dung('::tu-dien{nhom="Tốc độ" cot="2"}', 'nhac-ly/tu-dien'), /tu-dien\.md: ::tu-dien không nhận thuộc tính cot/);
	assert.throws(() => dung('::tu-dien{nhom="Không có"}', 'nhac-ly/tu-dien'), /tu-dien\.md: ::tu-dien: không có thuật ngữ nào thuộc nhóm "Không có"/);
});

test('bản build: trang của lô D3-L5 không còn ô "chưa chuyển"; công cụ, hình phách, bảng thuật ngữ có trong trang', (t) => {
	const doc = (trang) => {
		const f = path.join(ROOT, 'dist', trang, 'index.html');
		return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
	};
	const amHoc = doc('nhac-ly/am-hoc');
	if (!amHoc) return t.skip('chưa có trang trong dist/: chạy npm run build:xem');
	for (const trang of ['nhac-ly/am-hoc', 'nhac-ly/tu-dien', 'nhac-ly/', 'nhac-ly/on-tap-1', 'nhac-ly/on-tap-2', 'nhac-ly/on-tap-3'])
		assert.doesNotMatch(doc(trang) ?? '', /oz-chua-co/, trang);
	for (const lop of ['oz-boi-am', 'oz-pho', 'oz-len-day']) assert.ok(amHoc.includes(`class="${lop} oz-tool`), lop);
	assert.match(amHoc, /aria-label="Biên độ âm thanh khi bồi âm 5 của Đô4 gặp bồi âm 4 của Mi4/);
	const tuDienHtml = doc('nhac-ly/tu-dien');
	assert.ok(tuDienHtml.includes('class="oz-the-nho oz-tool'));
	assert.equal((tuDienHtml.match(/<th[^>]*>Thuật ngữ<\/th>/g) ?? []).length, 10, 'mười bảng thuật ngữ cho thẻ ghi nhớ');
	const mucLuc = doc('nhac-ly/');
	assert.match(mucLuc, /<div class="oz-lesson-status">\s*<div class="oz-trang-thai-bai/);
});
