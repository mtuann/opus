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
import { DAI_MAU, GIAI_MA_CUNG_LUC, GIOI_HAN_MAU, MAU, catMau, choThuLai, mauDaGiu, mauGanNhat, taiTruoc, tanSo, trangThai } from '../src/scripts/am-thanh.js';
import { VUNG_TAI, vungQuanh } from '../src/scripts/ban-phim.js';
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
import { DIEU_THUC, khoangPhim, soPhimTrang, veBanPhim, veChucNang, veDieuThuc } from '../src/scripts/ve.js';

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
	assert.equal((svg.match(/<text /g) ?? []).length, 30, 'mỗi phím trắng hai dòng chữ');
	assert.equal((svg.match(/<text [^>]*aria-hidden="true"/g) ?? []).length, 30, 'chữ trên phím chỉ để nhìn: tên đã ở aria-label của nút');
	assert.match(svg, /data-m="61" data-ten="Đô♯\/Rê♭ \(C♯\/D♭4\)"/);
});

test('::cong-cu{ten="piano"}: thông số như khối oz-piano cũ; viết sai thì build hỏng; nút nghe theo play', () => {
	const RONG = { ngon: [], nhanPhim: [], ngoac: [] };
	assert.deepEqual(docThongSoBanPhim({}), { thap: 60, cao: 72, to: [], hopAm: false, ...RONG }, 'mặc định C4-C5 như piano.js cũ');
	assert.deepEqual(docThongSoBanPhim({ range: 'C4-B4' }), { thap: 60, cao: 71, to: [], hopAm: false, ...RONG });
	assert.deepEqual(docThongSoBanPhim({ range: 'G3-G4', notes: 'G3 A3 B3 C4 D4 E4 F#4 G4' }).to, [55, 57, 59, 60, 62, 64, 66, 67]);
	assert.equal(docThongSoBanPhim({ range: 'F3-C5', notes: 'Bb3 Db4 Gb4 Bb4', play: 'chord' }).hopAm, true);
	assert.deepEqual(docThongSoBanPhim({ range: 'C#4-A#4' }), { thap: 60, cao: 71, to: [], hopAm: false, ...RONG }, 'đầu, cuối là phím đen thì mở ra phím trắng');
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
	assert.match(html, /^<div class="oz-ban-phim not-content" data-sinh data-pagefind-ignore><div class="oz-phim-cuon" tabindex="0" role="group" aria-label="Bàn phím piano, cuộn ngang"><svg class="oz-phim"/);
	assert.match(html, /<button type="button" class="oz-btn" data-k="nghe">Nghe các nốt được tô<\/button>/);
	assert.match(html, /<noscript data-sinh>/, 'tắt JavaScript: lời nhắc thay dòng hướng dẫn');
	assert.match(banPhim({ range: 'C4-C5', notes: 'C4 E4 G4', play: 'chord' }), /data-choi="hop-am".*Nghe hợp âm<\/button>/);
	assert.doesNotMatch(banPhim({ range: 'C4-B4' }), /data-k="nghe"/, 'không có phím được tô thì không có nút nghe');
	assert.throws(() => dung('::cong-cu{ten="piano" range="C4-C5" mau="do"}'), /01-cao-do-ten-not\.md: công cụ "piano" không nhận thông số mau/);
	assert.ok(canTaiScript(html), 'trang có bàn phím tải bộ tải thành phần');
	assert.ok(coAmPiano(html), 'trang có bàn phím ghi nguồn mẫu âm');
	assert.match(nguonAmPiano('/opus/'), /Salamander Grand Piano V3 của Alexander Holm.*CC BY 3\.0.*href="\/opus\/mau-am\/piano\/LICENSE\.txt"/);
});

test('::cong-cu{ten="piano"}: số ngón (phai, trai), nhãn (nhan), ngoặc (ngoac) của đợt hình 1; viết sai thì build hỏng', () => {
	const ts = docThongSoBanPhim({ range: 'F3-G4', phai: 'C4:1 D4:2 E4:3 F4:4 G4:5', trai: 'F3:5 G3:4 A3:3 B3:2 C4:1' });
	assert.deepEqual(ts.ngon.slice(0, 2), [{ m: 60, tay: 'phai', so: 1 }, { m: 62, tay: 'phai', so: 2 }]);
	assert.deepEqual(ts.ngon.filter((n) => n.m === 60).map((n) => n.tay), ['phai', 'trai'], 'hai ngón cái chung Đô giữa');
	assert.deepEqual(ts.to, [53, 55, 57, 59, 60, 62, 64, 65, 67], 'phím có số ngón là phím được tô, không trùng, theo cao độ');
	assert.deepEqual(docThongSoBanPhim({ range: 'C3-C5', notes: 'C5 C3 C4' }).to, [72, 48, 60], 'không có số ngón: giữ thứ tự của notes (HTML cũ không đổi)');
	assert.deepEqual(docThongSoBanPhim({ nhan: 'C4:0|1_đúng F#4:6|4_tăng|5_giảm' }).nhanPhim, [
		{ m: 60, dong: ['0', '1 đúng'] },
		{ m: 66, dong: ['6', '4 tăng', '5 giảm'] },
	]);
	assert.deepEqual(docThongSoBanPhim({ ngoac: 'E4-F4:½ C4-E4:3_trưởng|4_nửa_cung' }).ngoac, [
		{ tu: 64, den: 65, dong: ['½'] },
		{ tu: 60, den: 64, dong: ['3 trưởng', '4 nửa cung'] },
	]);
	for (const [t, loi] of [
		[{ phai: 'C4' }, /phai "C4" phải dạng "C4:1"/],
		[{ phai: 'C4:6' }, /số ngón phải từ 1 đến 5/],
		[{ trai: 'C4:1 C4:2' }, /trai ghi hai lần phím C4/],
		[{ phai: 'C3:1' }, /phai có nốt ngoài range/],
		[{ trai: 'H4:1' }, /trai "H4" không phải nốt/],
		[{ nhan: 'C4:' }, /nhan "C4:" thiếu chữ/],
		[{ nhan: 'C4:a|b|c|d' }, /quá ba dòng/],
		[{ nhan: 'C4:a C4:b' }, /nhan ghi hai lần phím C4/],
		[{ ngoac: 'E4:½' }, /ngoac "E4:½" phải dạng "E4-F4:½"/],
		[{ ngoac: 'F4-E4:½' }, /phải từ nốt thấp tới nốt cao/],
		[{ ngoac: 'C4-D6:x' }, /ngoac "D6"|ngoac có nốt ngoài range/],
		[{ ngon: 'C4:1' }, /không nhận thông số ngon \(nhận: range, notes, play, phai, trai, nhan, ngoac\)/],
	])
		assert.throws(() => docThongSoBanPhim(t), loi, JSON.stringify(t));

	// SVG: dấu số ngón (tròn: tay phải, vuông: tay trái), chữ thật, mô tả trong aria-label của hình và của từng phím
	const { svg } = veBanPhim(docThongSoBanPhim({ range: 'F3-G4', phai: 'C4:1 F#4:4', trai: 'F3:5 C4:1', nhan: 'G4:mở|rộng Bb3:x', ngoac: 'E4-F4:½' }));
	assert.match(svg, /^<svg class="oz-phim oz-phim--chu" viewBox="0 0 218 /);
	assert.equal((svg.match(/<g class="oz-ngon oz-ngon--phai" data-phim="\d+" aria-hidden="true"><circle /g) ?? []).length, 2);
	assert.equal((svg.match(/<g class="oz-ngon oz-ngon--trai" data-phim="\d+" aria-hidden="true"><rect /g) ?? []).length, 2);
	assert.match(svg, /<text x="[\d.]+" y="[\d.]+" class="oz-ngon-nho">1<\/text>/, 'hai tay chung một phím: dấu nhỏ hơn');
	assert.match(svg, /data-m="60" data-ten="Đô \(C4\)" data-mo-ta="tay phải ngón 1; tay trái ngón 1"/);
	assert.match(svg, /data-m="67" data-ten="Sol \(G4\)" data-mo-ta="mở, rộng"/);
	assert.match(svg, /<text class="oz-phim-nhan" aria-hidden="true"><tspan x="205" y="[\d.]+">mở<\/tspan><tspan x="205" y="[\d.]+">rộng<\/tspan><\/text>/);
	assert.match(svg, /<g class="oz-phim-ngoac" aria-hidden="true"><path d="M157 [\d.]+V[\d.]+H181V[\d.]+"\/><text class="oz-phim-ngoac-chu" aria-hidden="true"><tspan x="169" /, 'ngoặc từ tâm Mi4 đến tâm Fa4');
	assert.match(
		svg,
		/aria-label="Bàn phím piano từ Fa \(F3\) đến Sol \(G4\); các phím được tô: [^"]*; tay phải: ngón 1 trên Đô \(C4\), ngón 4 trên Fa♯\/Sol♭ \(F♯\/G♭4\); tay trái: ngón 5 trên Fa \(F3\), ngón 1 trên Đô \(C4\); nhãn: La♯\/Si♭ \(A♯\/B♭3\): x, Sol \(G4\): mở, rộng; ngoặc: Mi \(E4\) đến Fa \(F4\): ½"/,
	);
	// nhãn phím đen ở trên bàn phím, nhãn phím trắng ở dưới; ngoặc ở trên cùng
	const y = (re) => Number(re.exec(svg)[1]);
	const dinhPhim = y(/<rect class="oz-phim-trang[^"]*" x="1" y="([\d.]+)"/);
	assert.ok(y(/<tspan x="73" y="([\d.]+)">x</) < dinhPhim, 'nhãn phím đen (Si♭3) trên đỉnh phím');
	assert.ok(y(/<tspan x="205" y="([\d.]+)">mở</) > dinhPhim + 104, 'nhãn phím trắng dưới bàn phím');
	assert.ok(y(/<tspan x="169" y="([\d.]+)">½</) < y(/<tspan x="73" y="([\d.]+)">x</), 'ngoặc trên nhãn phím đen');
	// ngoặc chồng nhau thì xếp tầng: Đô4–Đô5 lên tầng trên hai ngoặc Đô4–Mi4, Mi4–Đô5 (chung đầu Mi4 thì cùng tầng)
	const hai = veBanPhim(docThongSoBanPhim({ ngoac: 'C4-E4:a E4-C5:b C4-C5:c' })).svg;
	const ngang = Object.fromEntries([...hai.matchAll(/<path d="M[\d.]+ [\d.]+V([\d.]+)H[\d.]+V[\d.]+"\/><text[^>]*><tspan x="[\d.]+" y="[\d.]+">(\w)</g)].map((m) => [m[2], Number(m[1])]));
	assert.equal(ngang.a, ngang.b);
	assert.ok(ngang.c < ngang.a);
	// nhãn dài quá bề rộng phím: dòng sau dòng đầu xếp so le hai hàng (dòng đầu thẳng hàng); nhãn ngắn thì một hàng
	const dongNhan = (svg2) => Object.fromEntries([...svg2.matchAll(/<text class="oz-phim-nhan"[^>]*><tspan x="([\d.]+)" y="([\d.]+)">[^<]*<\/tspan>(?:<tspan x="[\d.]+" y="([\d.]+)">)?/g)].map((m) => [m[1], [Number(m[2]), Number(m[3])]]));
	const le = dongNhan(veBanPhim(docThongSoBanPhim({ nhan: 'C4:0|1_đúng D4:2|2_trưởng E4:4|3_trưởng' })).svg);
	assert.equal(le[13][0], le[37][0], 'dòng đầu (số) thẳng hàng');
	assert.equal(le[13][1], le[61][1]);
	assert.ok(le[37][1] > le[13][1], 'Rê4 lùi xuống hàng dưới');
	const ngan = dongNhan(veBanPhim(docThongSoBanPhim({ nhan: 'C4:0|a D4:2|b' })).svg);
	assert.equal(ngan[13][1], ngan[37][1], 'nhãn ngắn: không so le');
	// chữ dài ở phím đầu, phím cuối: dịch vào trong hình
	const mep = veBanPhim(docThongSoBanPhim({ range: 'C4-E4', nhan: 'C4:một_nhãn_dài E4:nhãn_dài_nữa' })).svg;
	const xs = [...mep.matchAll(/<tspan x="([\d.]+)"[^>]*>([^<]+)</g)].map((m) => [Number(m[1]), m[2]]);
	for (const [x, s2] of xs) assert.ok(x - (s2.length * 3.6) / 2 >= 1 && x + (s2.length * 3.6) / 2 <= 3 * 24 + 1, `${s2} ở x ${x}`);
	assert.ok(xs[0][0] > 13 && xs[1][0] < 61, 'đã dịch vào trong');
	// không có chữ thêm: hình như trước (các bàn phím đã khóa không đổi)
	assert.doesNotMatch(veBanPhim({ thap: 60, cao: 72, to: [60] }).svg, /oz-phim--chu|oz-ngon|data-mo-ta|y="(?!1"|\d+(\.\d+)?" aria-hidden)/);
	assert.match(veBanPhim({ thap: 60, cao: 72 }).svg, /viewBox="0 0 194 106"/);

	// công cụ: chú giải hai tay (chữ thật), nút nghe các phím có số ngón
	const html = banPhim({ range: 'C3-G4', phai: 'C4:1 G4:5', trai: 'C3:5' });
	assert.match(html, /<p class="oz-phim-chu-giai"><span><svg class="oz-ngon oz-ngon--phai"[^>]*aria-hidden="true"[^>]*>.*?<\/svg> số ngón tay phải<\/span> <span><svg class="oz-ngon oz-ngon--trai".*?<\/svg> số ngón tay trái<\/span><\/p>/);
	assert.match(html, /data-k="nghe">Nghe các nốt được tô</);
	assert.doesNotMatch(banPhim({ range: 'C4-C5', nhan: 'C4:0' }), /oz-phim-chu-giai|data-k="nghe"/, 'chỉ có nhãn: không chú giải tay, không nút nghe');
	assert.match(dung('::cong-cu{ten="piano" range="C4-C5" phai="C4:1" ngoac="E4-F4:½"}'), /oz-phim--chu/);
	assert.throws(() => dung('::cong-cu{ten="piano" range="C4-C5" phai="C4:7"}'), /01-cao-do-ten-not\.md: công cụ "piano": phai "C4:7": số ngón phải từ 1 đến 5/);
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

test('mẫu âm đã giải mã chỉ giữ 4 giây đầu (bộ nhớ), chép đúng từng giá trị của từng kênh, 50 ms cuối nhỏ dần; mẫu ngắn hơn giữ nguyên', () => {
	// createBuffer như trình duyệt: bộ đệm mới toàn số 0. Mẫu nguồn: mỗi kênh một dốc riêng, để thấy chép thiếu, chép lệch
	// hay lẫn kênh (bỏ dòng chép trong catMau thì phép thử hỏng)
	const rong = (kenh, dai, tan) => {
		const du = Array.from({ length: kenh }, () => new Float32Array(dai));
		return { numberOfChannels: kenh, length: dai, sampleRate: tan, getChannelData: (k) => du[k] };
	};
	const doc = (kenh, dai, tan) => {
		const b = rong(kenh, dai, tan);
		for (let k = 0; k < kenh; k++) b.getChannelData(k).forEach((_, i, a) => (a[i] = (k + 1) * 1e6 + i));
		return b;
	};
	const c = { createBuffer: rong };
	const tan = 48000;
	const day = doc(2, tan * 7, tan);
	const cat = catMau(c, day);
	const n = tan * DAI_MAU;
	const mo = tan * 0.05;
	assert.equal(DAI_MAU, 4);
	assert.equal(cat.length, n);
	assert.equal(cat.numberOfChannels, 2);
	assert.equal(cat.sampleRate, tan);
	for (let k = 0; k < 2; k++) {
		const ra = cat.getChannelData(k);
		const vao = day.getChannelData(k);
		const lech = ra.subarray(0, n - mo).findIndex((x, i) => x !== vao[i]);
		assert.equal(lech, -1, `kênh ${k}: phần trước 50 ms cuối phải chép nguyên (mẫu ${lech}: ${ra[lech]} thay vì ${vao[lech]})`);
		for (const i of [0, 1, mo / 2, mo - 1]) {
			const can = vao[n - mo + i] * (1 - i / mo);
			assert.ok(Math.abs(ra[n - mo + i] - can) <= can * 1e-6 + 1e-6, `kênh ${k}, mẫu ${n - mo + i}: ${ra[n - mo + i]} thay vì ${can}`);
		}
		assert.ok(ra.at(-1) < vao[n - 1] / mo + 1, `kênh ${k}: nhỏ dần về gần 0 ở cuối, không có tiếng tách`);
		assert.equal(vao[n - 1], (k + 1) * 1e6 + n - 1, `kênh ${k}: mẫu nguồn không bị sửa`);
	}
	assert.equal(cat.getChannelData(1)[1000], 2e6 + 1000, 'kênh 2 là kênh 2 của nguồn');
	const ngan = doc(1, tan * 3, tan);
	assert.equal(catMau(c, ngan), ngan, 'mẫu ngắn hơn 4 giây giữ nguyên');
});

test('tải mẫu theo vùng: vùng ±12 nửa cung quanh phím; lần gọi sau và mẫu gần trước; giải mã tối đa 2 mẫu một lúc; giữ tối đa 12 mẫu, bỏ mẫu có yêu cầu cũ nhất; hỏng thì chờ lâu dần rồi thử lại', async () => {
	const cac = Array.from({ length: 25 }, (_, i) => 48 + i); // Đô3–Đô5
	assert.equal(VUNG_TAI, 12);
	assert.deepEqual(vungQuanh(48, cac), cac.slice(0, 13));
	assert.deepEqual(vungQuanh(60, cac), cac);
	assert.deepEqual(vungQuanh(72, cac), cac.slice(12));
	const soMidi = (url) => MAU.find(([, t]) => `${t}.mp3` === url.split('/').pop())[0];
	const lay = [];
	const giai = [];
	const hongTai = new Set([75]);
	const hongGiai = new Set([78]);
	let dang = 0;
	let toiDa = 0;
	const rong = (kenh, dai, tan) => {
		const du = Array.from({ length: kenh }, () => new Float32Array(dai));
		return { numberOfChannels: kenh, length: dai, sampleRate: tan, getChannelData: (k) => du[k] };
	};
	const fetchGoc = globalThis.fetch;
	globalThis.fetch = async (url) => {
		const m = soMidi(url);
		lay.push(m);
		return hongTai.has(m) ? { ok: false, status: 404 } : { ok: true, arrayBuffer: async () => ({ m }) };
	};
	// như trình duyệt mới: vừa gọi lại vừa trả promise; mẫu 16 giây (100 mẫu mỗi giây cho nhẹ)
	globalThis.OfflineAudioContext = class {
		createBuffer = rong;
		decodeAudioData(ab, ok, hong) {
			giai.push(ab.m);
			toiDa = Math.max(toiDa, ++dang);
			return new Promise((xong, loi) =>
				setTimeout(() => {
					dang--;
					if (hongGiai.has(ab.m)) {
						const e = new Error('mp3 hỏng');
						hong(e);
						loi(e);
					} else {
						const b = rong(2, 1600, 100);
						ok(b);
						xong(b);
					}
				}, 0),
			);
		}
	};
	const loiLot = [];
	const batLoi = (e) => loiLot.push(e);
	process.on('unhandledRejection', batLoi);
	try {
		// bấm Đô3 rồi, trước khi kịp giải mã, bấm Đô5: vùng của lần bấm sau giải mã trước, mẫu gần phím trước
		await Promise.all([taiTruoc(vungQuanh(48, cac), 48), taiTruoc(vungQuanh(72, cac), 72)]);
		assert.deepEqual(giai, [48, 51, 72, 69, 66, 63, 60, 54, 57], 'thứ tự giải mã');
		assert.deepEqual([...lay].sort((a, b) => a - b), [48, 51, 54, 57, 60, 63, 66, 69, 72], 'mỗi mẫu tải một lần');
		assert.equal(trangThai().da_tai, 9);
		// thứ tự giữ theo lần yêu cầu, không theo lúc giải mã xong (D4-L1): Đô3 giải mã đầu tiên nhưng vùng của nó được yêu cầu
		// trước, mẫu xa Đô3 nhất (57) là yêu cầu cũ nhất; vùng Đô5 yêu cầu sau, dù 60, 63… giải mã sau 48, 51
		assert.deepEqual(mauDaGiu(), [57, 54, 51, 48, 60, 63, 66, 69, 72]);
		// dùng lại Đô3: thành mẫu vừa dùng
		await taiTruoc([48]);
		assert.equal(mauDaGiu().at(-1), 48);
		assert.equal(lay.length, 9, 'mẫu đã có thì không tải lại');
		// đàn 88 phím, bấm ở quãng cao: thêm 9 mẫu, bộ nhớ vẫn giữ tối đa 12, bỏ các mẫu lâu không dùng nhất
		const dan88 = Array.from({ length: 88 }, (_, i) => 21 + i);
		await taiTruoc(vungQuanh(96, dan88), 96);
		assert.equal(GIOI_HAN_MAU, 12);
		assert.equal(trangThai().da_tai, 12);
		assert.deepEqual(mauDaGiu().slice(0, 3), [69, 72, 48], 'còn các mẫu yêu cầu hay dùng gần đây nhất');
		for (const m of [51, 54, 57, 60, 63, 66]) assert.ok(!mauDaGiu().includes(m), `mẫu ${m} (yêu cầu cũ nhất) đã bỏ`);
		// tải hỏng (HTTP 404) hay giải mã hỏng: không lỗi lọt ra ngoài, không giữ mẫu; lần sau tải lại
		await taiTruoc([75, 78], 75);
		assert.ok(!mauDaGiu().includes(75) && !mauDaGiu().includes(78));
		// hỏng liền nhau thì chờ lâu dần (1, 2, 4… giây, tối đa 60) trước khi tải lại: trong lúc chờ không tải
		assert.deepEqual([1, 2, 3, 7, 20].map(choThuLai), [1000, 2000, 4000, 60_000, 60_000]);
		const bayGio = Date.now();
		const dongHo = Date.now;
		try {
			await taiTruoc([75], 75);
			assert.equal(lay.filter((m) => m === 75).length, 1, 'chưa tới lúc thử lại');
			Date.now = () => bayGio + 1100;
			await taiTruoc([75], 75);
			assert.equal(lay.filter((m) => m === 75).length, 2, 'sau 1 giây: thử lại');
			Date.now = () => bayGio + 2500;
			await taiTruoc([75], 75);
			assert.equal(lay.filter((m) => m === 75).length, 2, 'hỏng lần hai: chờ 2 giây');
			hongTai.clear();
			hongGiai.clear();
			Date.now = () => bayGio + 3200;
			await taiTruoc([75], 75);
			assert.equal(lay.filter((m) => m === 75).length, 3, 'sau 2 giây: thử lại');
			Date.now = () => bayGio + 5000;
			await taiTruoc([75, 78], 75);
		} finally {
			Date.now = dongHo;
		}
		assert.ok(mauDaGiu().includes(75) && mauDaGiu().includes(78), 'thử lại sau khi hỏng');
		assert.equal(lay.filter((m) => m === 75).length, 3);
		assert.equal(GIAI_MA_CUNG_LUC, 2);
		assert.equal(toiDa, 2, 'giải mã tối đa 2 mẫu một lúc');
		await new Promise((ok) => setTimeout(ok, 10));
		assert.deepEqual(loiLot, [], 'lỗi "unhandled rejection"');
	} finally {
		process.off('unhandledRejection', batLoi);
		delete globalThis.OfflineAudioContext;
		globalThis.fetch = fetchGoc;
	}
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

test('bản build: không trang nào còn ô "chưa chuyển" của bàn phím, hình hóa biểu, vòng quãng năm, luyện hóa biểu, vòng chức năng, bảy điệu thức (cả trang thử bài 10)', (t) => {
	const DIST = path.join(ROOT, 'dist');
	if (!fs.existsSync(path.join(DIST, 'index.html'))) return t.skip('chưa có dist/: chạy npm run build (hay build:xem) trước');
	const con = [];
	for (const f of fs.readdirSync(DIST, { recursive: true }).filter((x) => x.endsWith('.html'))) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		for (const m of html.matchAll(/<p class="oz-chua-co"[^>]*>(?:Hình|Công cụ) "(piano|keysigs|circle|keysig-quiz|functions|modes)"/g)) con.push(`${f}: ${m[1]}`);
	}
	assert.deepEqual(con, []);
});

test('vòng chức năng (bài 12): ba ô Chủ, Hạ át, Át với các hợp âm, ba mũi tên có chữ; tên cho máy đọc màn hình như hình cũ', () => {
	const svg = veChucNang();
	const chu = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
	assert.deepEqual(chu.sort(), ['CHỦ', 'HẠ ÁT', 'I · vi', 'IV · ii', 'V · V7 · vii°', 'chuẩn bị', 'rời nhà', 'về nhà', 'ÁT'].sort());
	assert.match(svg, /role="img" aria-label="Vòng chức năng hòa âm: Chủ \(I, vi\) rời nhà sang Hạ át \(IV, ii\), chuẩn bị cho Át \(V, V7, vii°\), rồi về nhà ở Chủ"/);
	assert.equal((svg.match(/marker-end=/g) ?? []).length, 3);
	assert.doesNotMatch(svg, /fill="#|font-family/, 'màu và phông theo CSS của site');
});

test('bảy điệu thức (bài 16): tám phím trắng Đô–Đô, năm phím đen đúng chỗ, mỗi điệu thức ghi dưới phím bắt đầu của nó', () => {
	const svg = veDieuThuc();
	const trang = [...svg.matchAll(/<rect x="([\d.]+)" y="1" width="54"[^>]*class="([^"]*)"\/><text[^>]*>([^<]*)</g)];
	assert.deepEqual(trang.map((m) => m[3]), ['Đô', 'Rê', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Đô']);
	assert.ok(trang.slice(0, 7).every((m, i) => m[2].includes(`oz-dt-${i}`)) && !/oz-dt-\d/.test(trang[7][2]), 'bảy phím đầu tô màu, Đô trên không tô');
	// phím đen nằm giữa Đô–Rê, Rê–Mi, Fa–Sol, Sol–La, La–Si: tâm ở ranh giới hai phím trắng
	const den = [...svg.matchAll(/<rect x="([\d.]+)" y="1" width="30"/g)].map((m) => (Number(m[1]) + 15 - 1) / 54);
	assert.deepEqual(den, [1, 2, 4, 5, 6]);
	const ten = [...svg.matchAll(/<line x1="([\d.]+)"[^>]*\/><text[^>]*class="oz-dt-ten">([^<]*)</g)].map((m) => [m[2], (Number(m[1]) - 28) / 54]);
	assert.deepEqual(ten, DIEU_THUC.map((t, i) => [t, i]));
	assert.ok(
		svg.includes('aria-label="Bảy điệu thức trên phím trắng: Ionian bắt đầu từ Đô, Dorian từ Rê, Phrygian từ Mi, Lydian từ Fa, Mixolydian từ Sol, Aeolian từ La, Locrian từ Si"'),
		'tên cho máy đọc màn hình như hình cũ',
	);
});
