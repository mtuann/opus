// Kiểm thử thành phần của lô D3-L1, phần lõi nhạc lý và bàn phím: tên nốt, số MIDI, gam của 15 giọng (src/scripts/nhac-ly.js),
// hình bàn phím (veBanPhim, src/scripts/ve.js), thông số của ::cong-cu{ten="piano"} (src/plugins/thanh-phan.mjs), mẫu âm
// piano (src/scripts/am-thanh.js, public/mau-am/piano/), lưu kỹ năng như site cũ (src/scripts/tien-do.js). Chạy thẳng hàm
// và Sätteri, không cần build; bấm phím, nghe, cuộn trên trình duyệt thật: tests/trinh-duyet/kiem-ban-phim.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { banPhim, canTaiScript, coAmPiano, docThongSoBanPhim, nguonAmPiano } from '../src/plugins/thanh-phan.mjs';
import { MAU, mauGanNhat, tanSo } from '../src/scripts/am-thanh.js';
import {
	GIONG,
	THU_TU_GIANG,
	THU_TU_THANG,
	chuHoaBieu,
	dauCuaHoaBieu,
	docNot,
	gam,
	laPhimDen,
	midi,
	midiCua,
	tenChu,
	tenKhoaHoc,
	tenPhim,
	tenViet,
} from '../src/scripts/nhac-ly.js';
import { khoangPhim, soPhimTrang, veBanPhim } from '../src/scripts/ve.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'samples', 'piano');

function dung(md, trang = 'nhac-ly/01-cao-do-ten-not') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}
/** Số nửa cung của một nốt trong quãng tám (0 = Đô). */
const pc = (n) => ((midi(n) % 12) + 12) % 12;

test('tên nốt và số MIDI: Đô giữa C4 = 60, La4 = 69; dấu hóa và quãng tám như theory.js cũ', () => {
	assert.equal(midiCua('C4'), 60);
	assert.equal(midiCua('A4'), 69);
	assert.equal(midiCua('C'), 60, 'không ghi quãng tám thì là quãng tám 4');
	assert.equal(midiCua('F#3'), 54);
	assert.equal(midiCua('Bb3'), 58);
	assert.equal(midiCua('Cb5'), 71, 'Đô♭5 là phím Si4');
	assert.equal(midiCua('E#4'), 65, 'Mi♯4 là phím Fa4');
	assert.equal(midiCua('Fx4'), 67);
	assert.equal(midiCua('H4'), null);
	assert.equal(midiCua('C#'), 61);
	assert.equal(tenKhoaHoc(docNot('F#4')), 'F♯4');
	assert.equal(tenViet(docNot('Bb3')), 'Si♭');
	assert.equal(tanSo(69), 440);
	assert.equal(tanSo(81), 880, 'cao hơn một quãng tám: tần số gấp đôi');
	assert.equal(tenPhim(60), 'Đô (C4)');
	assert.equal(tenPhim(61), 'Đô♯/Rê♭ (C♯/D♭4)');
	assert.equal(tenPhim(47), 'Si (B2)');
	assert.deepEqual([...Array(12)].map((_, i) => laPhimDen(60 + i)), [false, true, false, true, false, false, true, false, true, false, true, false]);
});

test('15 giọng: gam trưởng đúng tên (mỗi chữ cái một lần), dấu hóa của gam trùng hóa biểu, giọng thứ song song ở bậc 6', () => {
	assert.equal(GIONG.length, 15);
	assert.deepEqual(THU_TU_THANG, ['F', 'C', 'G', 'D', 'A', 'E', 'B']);
	assert.deepEqual(THU_TU_GIANG, [...THU_TU_THANG].reverse());
	for (const k of GIONG) {
		const g = gam(`${k.chu_am}4`, 'major');
		assert.deepEqual(
			g.slice(1).map((n, i) => (pc(n) - pc(g[i]) + 12) % 12),
			[2, 2, 1, 2, 2, 2, 1],
			`${k.chu_am} trưởng: cung – cung – nửa cung – cung – cung – cung – nửa cung`,
		);
		assert.equal(new Set(g.slice(0, 7).map((n) => n.l)).size, 7, `${k.chu_am} trưởng: mỗi tên nốt một lần`);
		const daoDau = g.slice(0, 7).filter((n) => n.a !== 0);
		assert.ok(daoDau.every((n) => n.a === Math.sign(k.n)), `${k.chu_am} trưởng: chỉ một loại dấu`);
		assert.deepEqual(daoDau.map((n) => tenChu(n)[0]).sort(), [...dauCuaHoaBieu(k.n)].sort(), `${k.chu_am} trưởng: dấu của gam là dấu của hóa biểu`);
		// giọng thứ song song: bậc 6 của gam trưởng, thấp hơn chủ âm 3 nửa cung; gam thứ tự nhiên cùng các nốt
		assert.equal(tenChu(g[5]), tenChu(docNot(k.thu)), `${k.chu_am} trưởng: giọng thứ song song là bậc 6`);
		assert.equal((pc(docNot(k.chu_am)) - pc(docNot(k.thu)) + 12) % 12, 3);
		const thu = gam(`${k.thu}4`, 'natural');
		assert.deepEqual(thu.slice(0, 7).map(tenChu).sort(), g.slice(0, 7).map(tenChu).sort(), `${k.thu} thứ tự nhiên dùng chung các nốt với ${k.chu_am} trưởng`);
	}
	assert.equal(chuHoaBieu(0), 'không có dấu hóa');
	assert.equal(chuHoaBieu(3), '3 dấu thăng: F♯, C♯, G♯');
	assert.equal(chuHoaBieu(-4), '4 dấu giáng: B♭, E♭, A♭, D♭');
});

test('mẹo đọc hóa biểu (bài 8 và công cụ luyện hóa biểu) đúng với cả 15 giọng', () => {
	for (const k of GIONG.filter((g) => g.n > 0)) {
		// dấu thăng cuối cùng, lên nửa cung, là chủ âm giọng trưởng
		const cuoi = docNot(`${dauCuaHoaBieu(k.n).at(-1)}#`);
		assert.equal((pc(cuoi) + 1) % 12, pc(docNot(k.chu_am)), `${k.chu_am} trưởng`);
	}
	for (const k of GIONG.filter((g) => g.n < -1)) {
		// dấu giáng áp chót là tên giọng trưởng
		assert.equal(`${dauCuaHoaBieu(k.n).at(-2)}b`, k.chu_am, `${k.chu_am} trưởng`);
	}
	assert.equal(GIONG.find((g) => g.n === -1).chu_am, 'F', '1 dấu giáng là Fa trưởng');
});

test('gam thứ hòa âm và giai điệu (bài 7): La thứ hòa âm có Sol♯, giai điệu đi lên có Fa♯ và Sol♯', () => {
	assert.deepEqual(gam('A3', 'harmonic').map(tenViet), ['La', 'Si', 'Đô', 'Rê', 'Mi', 'Fa', 'Sol♯', 'La']);
	assert.deepEqual(gam('A3', 'melodic').map(tenViet), ['La', 'Si', 'Đô', 'Rê', 'Mi', 'Fa♯', 'Sol♯', 'La']);
	assert.deepEqual(gam('D4', 'harmonic').map(tenViet), ['Rê', 'Mi', 'Fa', 'Sol', 'La', 'Si♭', 'Đô♯', 'Rê']);
	assert.deepEqual(gam('G3', 'major').map(midi), [55, 57, 59, 60, 62, 64, 66, 67]);
});

test('hình bàn phím: phím trắng, phím đen đúng chỗ, tên hai hệ, phím được tô; khoảng phím mở ra phím trắng', () => {
	assert.deepEqual(khoangPhim(61, 70), [60, 71]);
	assert.deepEqual(khoangPhim(48, 72), [48, 72]);
	assert.equal(soPhimTrang(48, 72), 15);
	const { svg, soTrang } = veBanPhim({ thap: 48, cao: 72, to: [48, 60, 72] });
	assert.equal(soTrang, 15);
	const trang = [...svg.matchAll(/<rect class="oz-phim-trang( to)?"[^>]*data-m="(\d+)"/g)];
	const den = [...svg.matchAll(/<rect class="oz-phim-den( to)?"[^>]*data-m="(\d+)"/g)];
	assert.equal(trang.length, 15);
	assert.equal(den.length, 10, 'Đô3 đến Đô5: 10 phím đen, nhóm 2 rồi 3');
	assert.deepEqual(den.map((m) => Number(m[2])), [49, 51, 54, 56, 58, 61, 63, 66, 68, 70]);
	assert.deepEqual(trang.filter((m) => m[1]).map((m) => Number(m[2])), [48, 60, 72], 'ba phím Đô được tô');
	// phím đen nằm giữa hai phím trắng liền nhau; không có phím đen giữa Mi–Fa, Si–Đô
	const x = (re) => [...svg.matchAll(re)].map((m) => Number(m[1]));
	const xTrang = x(/<rect class="oz-phim-trang[^"]*" x="([\d.]+)"/g);
	const xDen = x(/<rect class="oz-phim-den[^"]*" x="([\d.]+)"/g);
	assert.deepEqual(xDen, [1, 2, 4, 5, 6, 8, 9, 11, 12, 13].map((i) => xTrang[i] - 7));
	const chu = [...svg.matchAll(/<text class="oz-phim-chu" [^>]*>([^<]+)</g)].map((m) => m[1]);
	assert.deepEqual(chu.slice(0, 8), ['Đô', 'Rê', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Đô']);
	const chuCai = [...svg.matchAll(/<text class="oz-phim-chu oz-phim-chu--nho"[^>]*>([^<]+)</g)].map((m) => m[1]);
	assert.deepEqual(chuCai.filter((c) => c.startsWith('C')), ['C3', 'C4', 'C5'], 'phím Đô ghi số quãng tám');
	assert.match(svg, /role="img" aria-label="Bàn phím piano từ Đô \(C3\) đến Đô \(C5\); các phím được tô: Đô \(C3\), Đô \(C4\), Đô \(C5\)"/);
	assert.match(svg, /style="--phim:15"/);
	assert.match(svg, /data-m="61" data-ten="Đô♯\/Rê♭ \(C♯\/D♭4\)"/);
});

test('::cong-cu{ten="piano"}: thông số như khối oz-piano cũ; viết sai thì build hỏng; nút nghe theo play', () => {
	assert.deepEqual(docThongSoBanPhim({}), { thap: 60, cao: 72, to: [], hopAm: false }, 'mặc định C4-C5 như piano.js cũ');
	assert.deepEqual(docThongSoBanPhim({ range: 'C4-B4' }), { thap: 60, cao: 71, to: [], hopAm: false });
	assert.deepEqual(docThongSoBanPhim({ range: 'G3-G4', notes: 'G3 A3 B3 C4 D4 E4 F#4 G4' }).to, [55, 57, 59, 60, 62, 64, 66, 67]);
	assert.equal(docThongSoBanPhim({ range: 'F3-C5', notes: 'Bb3 Db4 Gb4 Bb4', play: 'chord' }).hopAm, true);
	assert.deepEqual(docThongSoBanPhim({ range: 'C#4-A#4' }), { thap: 60, cao: 71, to: [], hopAm: false }, 'đầu, cuối là phím đen thì mở ra phím trắng');
	for (const [ts, loi] of [
		[{ range: 'C4' }, /range "C4" phải dạng "C3-C5"/],
		[{ range: 'C5-C4' }, /từ nốt thấp tới nốt cao/],
		[{ range: 'C4-H4' }, /range "H4" không phải nốt/],
		[{ range: 'C4-C5', notes: 'C4 D' }, /notes "D" không phải nốt/],
		[{ range: 'C4-C5', notes: 'C6' }, /notes có nốt ngoài range/],
		[{ range: 'A0-C9' }, /range "C9" không phải nốt trên đàn 88 phím/],
		[{ play: 'arpeggio' }, /play chỉ nhận "chord"/],
		[{ labels: 'off' }, /không nhận thông số labels/],
	])
		assert.throws(() => docThongSoBanPhim(ts), loi, JSON.stringify(ts));
	const html = dung('::cong-cu{ten="piano" range="G3-G4" notes="G3 A3 B3 C4 D4 E4 F#4 G4"}');
	assert.match(html, /^<div class="oz-ban-phim not-content" data-sinh data-pagefind-ignore><div class="oz-phim-cuon"><svg class="oz-phim"/);
	assert.match(html, /<button type="button" class="oz-btn" data-k="nghe">Nghe các nốt được tô<\/button>/);
	assert.match(html, /<noscript data-sinh>/, 'tắt JavaScript: lời nhắc thay dòng hướng dẫn');
	assert.match(banPhim({ range: 'C4-C5', notes: 'C4 E4 G4', play: 'chord' }), /data-choi="hop-am".*Nghe hợp âm<\/button>/);
	assert.doesNotMatch(banPhim({ range: 'C4-B4' }), /data-k="nghe"/, 'không có phím được tô thì không có nút nghe');
	assert.throws(() => dung('::cong-cu{ten="piano" range="C4-C5" mau="do"}'), /01-cao-do-ten-not\.md: công cụ "piano" không nhận thông số mau/);
	assert.ok(canTaiScript(html), 'trang có bàn phím tải bộ tải thành phần');
	assert.ok(coAmPiano(html), 'trang có bàn phím ghi nguồn mẫu âm');
	assert.match(nguonAmPiano('/opus/'), /Salamander Grand Piano V3 của Alexander Holm.*CC BY 3\.0.*href="\/opus\/mau-am\/piano\/LICENSE\.txt"/);
});

test('mọi bàn phím trong các trang: thông số đọc được (cả trang thử bài 10 của D1.8)', () => {
	const trang = fs.readdirSync(DOCS, { recursive: true }).filter((f) => f.endsWith('.md'));
	let dem = 0;
	for (const f of trang) {
		for (const m of fs.readFileSync(path.join(DOCS, f), 'utf8').matchAll(/^::cong-cu\{ten="piano"([^}]*)\}$/gm)) {
			const ts = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
			assert.doesNotThrow(() => docThongSoBanPhim(ts), f);
			dem++;
		}
	}
	assert.ok(dem >= 5, `bài 1, 5, 6, 7 và bài 10 có bàn phím (thấy ${dem})`);
});

test('mẫu âm piano: 30 mẫu từ La0 đến Đô8, mỗi ba nửa cung, đủ file trong public/mau-am/piano/, kèm nguyên LICENSE.txt', () => {
	assert.equal(MAU.length, 30);
	assert.deepEqual(MAU[0], [21, 'A0']);
	assert.deepEqual(MAU.at(-1), [108, 'C8']);
	assert.deepEqual(MAU.slice(1, 4), [[24, 'C1'], [27, 'Ds1'], [30, 'Fs1']]);
	const thuMuc = path.join(ROOT, 'public/mau-am/piano');
	const file = fs.readdirSync(thuMuc).sort();
	assert.deepEqual(file, [...MAU.map(([, t]) => `${t}.mp3`), 'LICENSE.txt'].sort(), 'đúng 30 file mp3 và LICENSE.txt, không thừa');
	const giay = fs.readFileSync(path.join(thuMuc, 'LICENSE.txt'), 'utf8');
	assert.match(giay, /Salamander Grand Piano V3/);
	assert.match(giay, /Alexander Holm/);
	assert.match(giay, /Creative Commons Attribution 3\.0/);
	if (fs.existsSync(CU)) {
		for (const f of file) assert.ok(fs.readFileSync(path.join(thuMuc, f)).equals(fs.readFileSync(path.join(CU, f))), `${f} giống hệt bản của site cũ`);
	}
	// mọi phím của đàn 88 phím có mẫu cách không quá một nửa cung (phát mẫu ấy ở tốc độ khác)
	for (let m = 21; m <= 108; m++) assert.ok(Math.abs(mauGanNhat(m) - m) <= 1, `phím ${m}`);
	assert.equal(mauGanNhat(10), null, 'ngoài đàn quá xa thì không có mẫu');
});

test('lưu kỹ năng như site cũ (skill của progress.js): số lần, số đúng, độ chính xác trượt, lịch sử theo ngày', async () => {
	const kho = new Map();
	globalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, String(v)) };
	globalThis.document ??= { dispatchEvent() {} };
	try {
		const { kyNang, ghiNgay, homNay } = await import('../src/scripts/tien-do.js');
		kyNang('keysig', true);
		kyNang('keysig', false);
		ghiNgay('keysigs', 1);
		const data = JSON.parse(kho.get('opus-zero:v1'));
		const s = data.store.skills.keysig;
		assert.equal(s.n, 2);
		assert.equal(s.c, 1);
		assert.equal(s.ema, 0.7 * 0.85, 'lần đầu đúng: 0,7; rồi trượt 0,85');
		assert.equal(s.last, homNay());
		assert.deepEqual(data.store.skillHist.keysig[homNay()], [2, 1]);
		assert.equal(data.days[homNay()].keysigs, 1);
	} finally {
		delete globalThis.localStorage;
	}
});

test('bản build: không trang nào còn ô "chưa chuyển" của bàn phím, hình hóa biểu, vòng quãng năm, luyện hóa biểu (cả trang thử bài 10)', (t) => {
	const DIST = path.join(ROOT, 'dist');
	if (!fs.existsSync(path.join(DIST, 'index.html'))) return t.skip('chưa có dist/: chạy npm run build (hay build:xem) trước');
	const con = [];
	for (const f of fs.readdirSync(DIST, { recursive: true }).filter((x) => x.endsWith('.html'))) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		for (const m of html.matchAll(/<p class="oz-chua-co"[^>]*>(?:Hình|Công cụ) "(piano|keysigs|circle|keysig-quiz)"/g)) con.push(`${f}: ${m[1]}`);
	}
	assert.deepEqual(con, []);
});
