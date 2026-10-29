// Kiểm thử thành phần của lô D3-L6: bốn công cụ luyện tai (::cong-cu interval-trainer, chord-trainer, scale-trainer,
// cadence-trainer; src/scripts/luyen-tai.js). Dựng HTML đúng (chữ thật, data-sinh, không nhận thông số), câu hỏi và cách
// chấm khớp lõi nhạc lý (quãng đúng số nửa cung, hợp âm và gam đúng nốt, kết đúng bậc), lưu đúng khóa và định dạng của
// progress.js cũ. So với JavaScript cũ ở ../opus-zero/ khi có. Bấm và nghe trên trình duyệt thật: tests/trinh-duyet/kiem-luyen-tai.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canTaiScript, coAmPiano } from '../src/plugins/thanh-phan.mjs';
import { CONG_CU_TAI, KET, QUANG, XEP_BE, boCua, cham, chuThongKe, hinhPhim, notGam, notHopAm } from '../src/scripts/luyen-tai.js';
import { GAM, HOP_AM, gam, hopAm, midi, tenChu } from '../src/scripts/nhac-ly.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const TEN = ['interval-trainer', 'chord-trainer', 'scale-trainer', 'cadence-trainer'];

function dung(md, trang = 'luyen-tai/nghe-quang') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
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

/** Các hằng ở đầu một file cũ (trước hàm mount): chạy phần ấy trong vm, trả về các tên được hỏi. */
function hangCu(ten, ...ten2) {
	const src = fs.readFileSync(path.join(JS_CU, ten), 'utf8');
	const dau = src.slice(src.indexOf('"use strict";') + 13, src.indexOf('function mount'));
	return j(vm.runInNewContext(`${dau}; ({ ${ten2.join(', ')} })`, {}));
}
/** Chạy cả file cũ (IIFE gắn vào window), trả về window của nó. */
function chayCu(ten, them = {}) {
	const window = { ...them };
	const document = { querySelectorAll: () => [], addEventListener() {}, body: {} };
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, ten), 'utf8'), { window, document, CustomEvent: class {}, localStorage: null, ...them });
	return window;
}
const coCu = fs.existsSync(JS_CU);
/** Đối tượng của vm (realm khác) thành đối tượng thường, để deepEqual so được. */
const j = (x) => JSON.parse(JSON.stringify(x));

test('dựng sẵn ô công cụ: chữ thật, data-sinh, aria-live, nút trả lời của bộ đầu tiên; trang có công cụ thì tải script và ghi nguồn mẫu âm; không nhận thông số', () => {
	const html = Object.fromEntries(TEN.map((t) => [t, dung(`::cong-cu{ten="${t}"}`)]));
	for (const [t, h] of Object.entries(html)) {
		assert.match(h, new RegExp(`^<div class="oz-lt oz-lt--[a-z-]+ oz-tool not-content" data-cong-cu="${t}" data-sinh data-pagefind-ignore>`), t);
		assert.match(h, />Câu mới<\/button><button type="button" class="oz-btn" data-act="again">Nghe lại<\/button>/);
		assert.match(h, /<p class="oz-feedback" aria-live="polite">/);
		assert.match(h, /<noscript data-sinh>/);
		assert.ok(canTaiScript(h), t);
		assert.ok(coAmPiano(h), t);
		assert.throws(() => dung(`::cong-cu{ten="${t}" set="all"}`), new RegExp(`công cụ "${t}" không nhận thông số \\(set\\)`));
	}
	const nut = (h) => [...h.matchAll(/data-d="[^"]+">([^<]+)(?:<small> ([^<]+)<\/small>)?<\/button>/g)].map((m) => (m[2] ? `${m[1]} | ${m[2]}` : m[1]));
	assert.deepEqual(nut(html['interval-trainer']), ['3 trưởng', '5 đúng', '8 đúng']);
	assert.deepEqual(nut(html['chord-trainer']), ['trưởng | sáng, vững', 'thứ | tối, buồn']);
	assert.deepEqual(nut(html['scale-trainer']), ['Gam trưởng | sáng', 'Gam thứ tự nhiên | tối']);
	assert.deepEqual(nut(html['cadence-trainer']), ['Kết trọn (V – I)', 'Kết nửa (… – V)', 'Kết plagal (IV – I)', 'Kết lừa (V – vi)']);
	assert.match(html['interval-trainer'], /aria-label="Chọn quãng"/);
	assert.match(html['interval-trainer'], />Bấm “Câu mới” để nghe hai nốt\.<\/p>/);
	assert.match(html['cadence-trainer'], />Nghe 4 hợp âm và đoán loại kết ở hai hợp âm cuối\.<\/p>/);
	assert.doesNotMatch(html['cadence-trainer'], /<select/, 'nghe kết không có ô chọn, như bản cũ');
	const chon = (h) => [...h.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map((m) => `${m[1]}=${m[2]}`);
	assert.deepEqual(chon(html['scale-trainer']), [
		'mm=Trưởng và thứ tự nhiên',
		'minors=Ba dạng gam thứ',
		'modes=Điệu thức thường gặp',
		'penta=Ngũ cung và gam 7 nốt',
		'up=Đi lên',
		'updown=Lên rồi xuống',
	]);
	// thuật ngữ đã chốt (plans/lam-lai/README.md): "hòa âm", không "hòa thanh"
	for (const h of Object.values(html)) assert.doesNotMatch(h, /hòa thanh/);
	assert.ok(Object.values(GAM).every((g) => !/hòa thanh/.test(g.ten)));
});

test('chữ, bộ câu hỏi, gợi ý và lựa chọn như JavaScript cũ', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const quang = hangCu('interval-trainer.js', 'NAMES', 'SETS');
	assert.deepEqual(QUANG, quang.NAMES);
	const bo = (t) => Object.fromEntries(CONG_CU_TAI[t].chon[0].ds.map(([v, , ds]) => [v, ds]));
	assert.deepEqual(bo('interval-trainer'), quang.SETS);
	const hop = hangCu('chord-trainer.js', 'SETS', 'HINT');
	assert.deepEqual(bo('chord-trainer'), hop.SETS);
	const gamCu = hangCu('scale-trainer.js', 'SETS', 'HINT');
	assert.deepEqual(bo('scale-trainer'), Object.fromEntries(Object.entries(gamCu.SETS).map(([k, v]) => [k, v.items])));
	assert.deepEqual(CONG_CU_TAI['scale-trainer'].chon[0].ds.map(([, t]) => t), Object.values(gamCu.SETS).map((v) => v.name));
	// tên và công thức gam, hợp âm (theory.js)
	const ly = chayCu('theory.js').OZTheory;
	for (const [k, v] of Object.entries(j(ly.SCALES))) assert.deepEqual([GAM[k].ten, GAM[k].buoc, GAM[k].chu], [v.name, v.steps, v.letters], k);
	for (const [k, v] of Object.entries(j(ly.CHORDS))) assert.deepEqual([HOP_AM[k].ten, HOP_AM[k].ky_hieu, HOP_AM[k].not], [v.name, v.sym, v.tones], k);
	// gợi ý dưới tên: so qua chữ của nút
	for (const [t, hint] of [
		['chord-trainer', hop.HINT],
		['scale-trainer', gamCu.HINT],
	])
		for (const k of Object.keys(hint)) assert.equal(CONG_CU_TAI[t].nut(k).goi_y, hint[k], k);
	// các ô chọn: cùng giá trị và chữ như innerHTML cũ
	for (const [t, f] of [
		['interval-trainer', 'interval-trainer.js'],
		['chord-trainer', 'chord-trainer.js'],
	]) {
		const cu = [...fs.readFileSync(path.join(JS_CU, f), 'utf8').matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map((m) => `${m[1]}=${m[2]}`);
		assert.deepEqual(CONG_CU_TAI[t].chon.flatMap((c) => c.ds.map(([v, n]) => `${v}=${n}`)), cu, t);
	}
	// câu chữ (lời nhắc, câu hỏi, báo sai) có nguyên văn trong file cũ
	for (const [t, f] of [
		['interval-trainer', 'interval-trainer.js'],
		['chord-trainer', 'chord-trainer.js'],
		['scale-trainer', 'scale-trainer.js'],
		['cadence-trainer', 'recognition.js'],
	]) {
		const src = fs.readFileSync(path.join(JS_CU, f), 'utf8');
		for (const k of ['dau', 'hoi', 'sai', 'nhom']) assert.ok(src.includes(CONG_CU_TAI[t][k]), `${t}.${k}: ${CONG_CU_TAI[t][k]}`);
	}
	// kết: tên, chuỗi hợp âm, xếp bè (OZRecognition)
	const rec = chayCu('recognition.js', { getComputedStyle: () => ({ getPropertyValue: () => '' }) }).OZRecognition;
	assert.deepEqual(Object.fromEntries(Object.entries(KET).map(([k, v]) => [k, { name: v.ten, seq: v.chuoi }])), j(rec.CAD));
	assert.deepEqual(XEP_BE, j(rec.VOICING));
});

test('nghe quãng: hai nốt phát cách nhau đúng số nửa cung của đáp án, ở cả ba cách phát; gốc từ Sol3 đến Sol4', () => {
	const cc = CONG_CU_TAI['interval-trainer'];
	assert.deepEqual(Object.keys(QUANG).map(Number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
	for (const [v, , ds] of cc.chon[0].ds)
		for (let i = 0; i < 40; i++) {
			const q = cc.cau(boCua(cc, v));
			assert.ok(ds.includes(q.dap) && q.goc >= 55 && q.goc <= 67, JSON.stringify(q));
			const up = cc.phat(q, { mode: 'up' }).map(([m]) => m);
			const down = cc.phat(q, { mode: 'down' }).map(([m]) => m);
			const harm = cc.phat(q, { mode: 'harm' });
			assert.equal(up[1] - up[0], q.dap);
			assert.equal(down[0] - down[1], q.dap);
			assert.equal(harm[1][0] - harm[0][0], q.dap);
			assert.ok(harm.every(([, luc]) => luc === 0), 'cùng lúc');
		}
	// tên quãng khớp số nửa cung qua lõi nhạc lý: Đô4 lên các quãng đúng tên
	const c4 = midi({ l: 0, a: 0, o: 4 });
	assert.equal(c4 + 4, midi(hopAm('C4', 'maj')[1]), '3 trưởng = 4 nửa cung');
	assert.equal(c4 + 7, midi(hopAm('C4', 'maj')[2]), '5 đúng = 7 nửa cung');
	assert.equal(c4 + 3, midi(hopAm('C4', 'min')[1]), '3 thứ = 3 nửa cung');
	assert.equal(cc.dung({ dap: 7 }), 'Đúng, quãng 5 đúng (7 nửa cung). Bấm “Câu mới” để tiếp tục.');
	assert.deepEqual(cc.hinh({ dap: 7, goc: 60 }).to, [60, 67]);
});

test('nghe hợp âm: các nốt phát đúng hợp âm (viết đúng tên qua lõi nhạc lý), rải rồi cùng lúc như bản cũ', () => {
	const cc = CONG_CU_TAI['chord-trainer'];
	const ten = (loai) => hopAm('C4', loai).map(tenChu).join(' ');
	assert.equal(ten('maj'), 'C E G');
	assert.equal(ten('dim'), 'C E♭ G♭');
	assert.equal(ten('aug'), 'C E G♯');
	assert.equal(ten('maj7'), 'C E G B');
	assert.equal(ten('dom7'), 'C E G B♭');
	assert.equal(ten('min7'), 'C E♭ G B♭');
	assert.equal(ten('hdim7'), 'C E♭ G♭ B♭');
	assert.equal(ten('dim7'), 'C E♭ G♭ B𝄫');
	for (const [v, , ds] of cc.chon[0].ds)
		for (const loai of ds) {
			const q = { dap: loai, goc: 60 };
			assert.deepEqual(notHopAm(q), hopAm('C4', loai).map(midi), loai);
			assert.deepEqual(cc.phat(q, { mode: 'block' }).map(([m]) => m), notHopAm(q));
			const ca = cc.phat(q, { mode: 'both' });
			assert.equal(ca.length, 2 * notHopAm(q).length);
			assert.ok(ca.slice(notHopAm(q).length).every(([, luc]) => luc === notHopAm(q).length * 0.35 + 0.15));
			assert.ok(v);
		}
	for (let i = 0; i < 40; i++) {
		const q = cc.cau(boCua(cc, 'sevenths'));
		assert.ok(['maj7', 'dom7', 'min7', 'hdim7', 'dim7'].includes(q.dap) && q.goc >= 52 && q.goc <= 63);
	}
	assert.equal(cc.dung({ dap: 'hdim7' }), 'Đúng: hợp âm bảy nửa giảm (4 nốt). Bấm “Câu mới” để tiếp tục.');
});

test('nghe gam: các nốt phát đúng công thức (viết đúng tên), lên rồi xuống: thứ giai điệu đi xuống như thứ tự nhiên', () => {
	const cc = CONG_CU_TAI['scale-trainer'];
	const ten = (loai) => gam('C4', loai).map(tenChu).join(' ');
	assert.equal(ten('harmonic'), 'C D E♭ F G A♭ B C');
	assert.equal(ten('dorian'), 'C D E♭ F G A B♭ C');
	assert.equal(ten('lydian'), 'C D E F♯ G A B C');
	assert.equal(ten('phrygian'), 'C D♭ E♭ F G A♭ B♭ C');
	assert.equal(ten('mixolydian'), 'C D E F G A B♭ C');
	assert.equal(ten('pentaMajor'), 'C D E G A C');
	assert.equal(ten('pentaMinor'), 'C E♭ F G B♭ C');
	for (const [, , ds] of cc.chon[0].ds)
		for (const loai of ds) {
			const q = { dap: loai, goc: 60 };
			assert.deepEqual(notGam(q), gam('C4', loai).map(midi), loai);
			assert.deepEqual(cc.phat(q, { dir: 'up' }).map(([m]) => m), notGam(q));
		}
	const len = notGam({ dap: 'melodic', goc: 57 }, 'updown');
	assert.deepEqual(len, [57, 59, 60, 62, 64, 66, 68, 69, 67, 65, 64, 62, 60, 59, 57]);
	assert.deepEqual(cc.hinh({ dap: 'melodic', goc: 57 }, { dir: 'updown' }).to, [57, 59, 60, 62, 64, 66, 68, 69]);
	assert.equal(cc.dung({ dap: 'dorian' }), 'Đúng: điệu Dorian.');
	assert.equal(cc.dung({ dap: 'major' }), 'Đúng: gam trưởng.');
});

test('nghe kết: bốn hợp âm đúng bậc ở giọng đã dịch, hai hợp âm cuối là loại kết', () => {
	const cc = CONG_CU_TAI['cadence-trainer'];
	const BAC = { I: [0, 4, 7], IV: [5, 9, 0], V: [7, 11, 2], vi: [9, 0, 4] };
	for (const [bac, ds] of Object.entries(XEP_BE)) assert.deepEqual([...new Set(ds.map((m) => m % 12))].sort(), [...BAC[bac]].sort(), bac);
	assert.deepEqual(Object.fromEntries(Object.entries(KET).map(([k, v]) => [k, v.chuoi.slice(-2).join('-')])), {
		pac: 'V-I',
		hc: 'IV-V',
		plagal: 'IV-I',
		deceptive: 'V-vi',
	});
	for (let i = 0; i < 40; i++) {
		const q = cc.cau(boCua(cc));
		assert.ok(q.dich >= -5 && q.dich <= 6);
		const ra = cc.phat(q);
		assert.equal(ra.length, 16);
		KET[q.dap].chuoi.forEach((bac, j) => assert.deepEqual(ra.slice(4 * j, 4 * j + 4).map(([m]) => m), XEP_BE[bac].map((m) => m + q.dich)));
	}
	const h = cc.hinh({ dap: 'deceptive', dich: 2 });
	assert.equal(h.chu, 'Hai hợp âm cuối: V → vi (xanh: hợp âm áp chót, vàng: hợp âm cuối)');
	assert.deepEqual(h.to2, [45, 64, 69, 73]);
	const svg = hinhPhim(h);
	assert.match(svg, /class="oz-phim-trang to-2" x="[\d.]+" y="1" width="\d+" height="\d+" rx="3" data-m="45"/);
	assert.match(svg, /data-m="47"/);
	assert.match(svg, /class="oz-phim-trang to" [^>]*data-m="71"/);
	// phím có trong cả hai hợp âm (kết trọn ở Đô: Sol4 = 67 có ở V và I) theo hợp âm cuối, như bản cũ
	const tron = hinhPhim(cc.hinh({ dap: 'pac', dich: 0 }));
	assert.match(tron, /class="oz-phim-trang to" [^>]*data-m="67"/);
	assert.match(tron, /class="oz-phim-trang to-2" [^>]*data-m="43"/);
	assert.match(svg, /aria-label="Hai hợp âm cuối của kết trên phím đàn: /);
});

test('chấm và lưu như progress.js cũ: kỹ năng chỉ tính lần trả lời đầu, câu đúng ghi vào ngày (kết tính vào chords)', (t) => {
	const kho = giaTrinhDuyet(t);
	return import('../src/scripts/tien-do.js').then(({ KHOA, homNay, soHomNay }) => {
		const phien = { dung: 0, tong: 0 };
		const q = { dap: 7, goc: 60, lanDau: true, xong: false };
		const cc = CONG_CU_TAI['interval-trainer'];
		assert.equal(cham(cc, q, '4', phien), false);
		assert.equal(cham(cc, q, '7', phien), true);
		assert.ok(q.xong);
		const q2 = { dap: 4, goc: 60, lanDau: true, xong: false };
		assert.equal(cham(cc, q2, '4', phien), true);
		assert.deepEqual(phien, { dung: 1, tong: 2 });
		const ket = { dap: 'pac', dich: 0, lanDau: true, xong: false };
		cham(CONG_CU_TAI['cadence-trainer'], ket, 'pac', phien);
		cham(CONG_CU_TAI['scale-trainer'], { dap: 'major', goc: 60, lanDau: true }, 'natural', phien);
		const data = JSON.parse(kho.get(KHOA));
		assert.equal(KHOA, 'opus-zero:v1');
		const ngay = data.days[homNay()];
		assert.equal(ngay.intervals, 2);
		assert.equal(ngay.chords, 1, 'nghe kết ghi vào chords như recognition.js cũ');
		assert.equal(ngay.scales, undefined, 'trả lời sai không ghi vào ngày');
		assert.deepEqual([data.store.skills.intervals.n, data.store.skills.intervals.c], [2, 1]);
		assert.deepEqual(data.store.skillHist.intervals[homNay()], [2, 1]);
		assert.deepEqual([data.store.skills.cadence.n, data.store.skills.cadence.c], [1, 1]);
		assert.deepEqual([data.store.skills.scales.n, data.store.skills.scales.c], [1, 0]);
		assert.equal(soHomNay('intervals'), 2);
		assert.equal(chuThongKe(cc, phien, 2), 'Lượt này: đúng ngay lần đầu 2/4. Hôm nay đã nhận đúng 2 quãng.');
		assert.equal(chuThongKe(CONG_CU_TAI['chord-trainer'], phien, 0), 'Lượt này: đúng ngay lần đầu 2/4.');
	});
});

test('cùng định dạng lưu với progress.js cũ: cùng chuỗi thao tác cho ra cùng dữ liệu', { skip: !coCu && 'không có ../opus-zero/' }, async (t) => {
	const kho = giaTrinhDuyet(t);
	const { KHOA } = await import('../src/scripts/tien-do.js');
	const phien = { dung: 0, tong: 0 };
	const cc = CONG_CU_TAI['chord-trainer'];
	const q = { dap: 'maj', goc: 60, lanDau: true, xong: false };
	cham(cc, q, 'min', phien);
	cham(cc, q, 'maj', phien);
	cham(CONG_CU_TAI['cadence-trainer'], { dap: 'hc', lanDau: true }, 'hc', phien);
	const moi = JSON.parse(kho.get(KHOA));
	const kho2 = new Map();
	const ls = { getItem: (k) => kho2.get(k) ?? null, setItem: (k, v) => kho2.set(k, String(v)) };
	const w = {};
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, 'progress.js'), 'utf8'), { window: w, localStorage: ls, document: { dispatchEvent() {} }, CustomEvent: class {} });
	w.OZProgress.skill('chords', false);
	w.OZProgress.record('chords', 1);
	w.OZProgress.skill('cadence', true);
	w.OZProgress.record('chords', 1);
	assert.deepEqual(moi, JSON.parse(kho2.get('opus-zero:v1')));
});

test('bản build: các trang luyện tai không còn ô "chưa chuyển" của bốn công cụ', (t) => {
	const DIST = path.join(ROOT, 'dist');
	if (!fs.existsSync(path.join(DIST, 'index.html'))) return t.skip('chưa có dist/: chạy npm run build (hay build:xem) trước');
	const con = [];
	for (const f of fs.readdirSync(DIST, { recursive: true }).filter((x) => x.endsWith('.html'))) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		for (const m of html.matchAll(/<p class="oz-chua-co"[^>]*>Công cụ "(interval-trainer|chord-trainer|scale-trainer|cadence-trainer)"/g)) con.push(`${f}: ${m[1]}`);
	}
	assert.deepEqual(con, []);
});

// Tên hợp âm bảy thống nhất với bài 11 và công cụ (src/scripts/nhac-ly.js): bảy trưởng, bảy át, bảy thứ, bảy nửa giảm,
// bảy giảm; không "át bảy", "trưởng bảy"… (mo/bay-at, 29/10/2026)
test('trang không gọi hợp âm bảy theo kiểu "át bảy", "trưởng bảy", "giảm bảy"', () => {
	const DOCS = path.join(import.meta.dirname, '..', 'src/content/docs');
	const sai = [];
	for (const f of fs.readdirSync(DOCS, { recursive: true }).filter((x) => x.endsWith('.md'))) {
		const s = fs.readFileSync(path.join(DOCS, f), 'utf8');
		for (const m of s.matchAll(/\b(át|trưởng|giảm) bảy\b|\bThứ bảy \(m7\)/giu)) sai.push(`${f}: ${m[0]}`);
	}
	assert.deepEqual(sai, []);
});
