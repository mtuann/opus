// Kiểm thử các công cụ Luyện tập của lô D7-L2 (src/scripts/xay.js, giay-khuong.js, phieu.js, thu-am.js, tiet-tau.js,
// thi-tau.js, thi-tau-hai-tay.js, nhat-ky.js, nang-luc.js; phần thêm của tien-do.js, hinh-so-sanh.js): hàm thuần chạy bằng
// Node, so với JavaScript cũ ở ../opus-zero/ khi có (cùng dãy số ngẫu nhiên, cùng kết quả). Bấm, gõ, micro, đàn MIDI và in
// trên trình duyệt thật: tests/trinh-duyet/kiem-luyen-tap-d7.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { canTaiScript, coAmPiano, congCu, nhatKy } from '../src/plugins/thanh-phan.mjs';
import { BO, kiemTra, taoCau, tenDapAn, veKhung } from '../src/scripts/xay.js';
import { cacKhuong, veTrang } from '../src/scripts/giay-khuong.js';
import { LOAI, abcNot, chiaO, deBai } from '../src/scripts/phieu.js';
import { soPhut, tenFile, thoiGian } from '../src/scripts/thu-am.js';
import { NHOM, abcTietTau, chamGo, lucGo, sangAbc as abcTt, taoTietTau } from '../src/scripts/tiet-tau.js';
import { GIONG_TT, abcGiaiDieu, notCan, notCua, sangAbc as abcSight, taoGiaiDieu } from '../src/scripts/thi-tau.js';
import { CAP as CAP2, capDau, chuThongKe, loiSauCham, taoBai } from '../src/scripts/thi-tau-hai-tay.js';
import { VIEC, cacNgay, chuChuoi, dongHomNay, oBanDo, tuDanhDau } from '../src/scripts/nhat-ky.js';
import { dungBangNangLuc } from '../src/scripts/nang-luc.js';
import { tinhKeHoach } from '../src/scripts/ke-hoach.js';
import { chuoiNgay, congNgay, mucNgay } from '../src/scripts/tien-do.js';
import { bieuDoTienBo, daiNhipGo, ghepNhip, khoaTuan, theoTuan } from '../src/scripts/hinh-so-sanh.js';
import { midi } from '../src/scripts/nhac-ly.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const coCu = (...ten) => ten.every((t) => fs.existsSync(path.join(JS_CU, t)));
const thuong = (x) => JSON.parse(JSON.stringify(x));
/** Chạy các file JavaScript cũ (IIFE gắn vào window) trong cùng một vm; `Math` thay được để cố định số ngẫu nhiên. */
function chayCu(ten, them = {}) {
	const window = {};
	const ctx = vm.createContext({ window, document: { querySelectorAll: () => [], addEventListener() {} }, CustomEvent: class {}, localStorage: null, ...them });
	for (const t of ten) vm.runInContext(fs.readFileSync(path.join(JS_CU, t), 'utf8'), ctx);
	return window;
}
const day = (seed) => {
	let s = seed;
	return () => ((s = (s * 1103515245 + 12345) % 2147483648), s / 2147483648);
};
const mathCo = (r) => Object.assign(Object.create(Math), { random: r });

const CONG_CU = { build: 'oz-xay', staffpaper: 'oz-giay-khuong', 'worksheet-gen': 'oz-phieu', recorder: 'oz-thu-am', rhythm: 'oz-tiet-tau', sight: 'oz-thi-tau', sight2: 'oz-thi-tau-hai-tay', journal: 'oz-nhat-ky', skills: 'oz-nang-luc', trends: 'oz-tien-bo' };

test('mười công cụ D7-L2: dựng sẵn ô (lớp như KHOI của trang mẫu, data-sinh), tải script, không nhận thông số; nguồn mẫu âm khi phát piano', async () => {
	const { KHOI } = await import('../tools/trang-mau.mjs');
	for (const [ten, lop] of Object.entries(CONG_CU)) {
		const html = congCu({ ten }, 'luyen-tap/index');
		assert.ok(html.startsWith(`<div class="${lop} oz-tool not-content" data-sinh data-pagefind-ignore`), ten);
		// đúng một loại khối của KHOI (thị tấu một bè không lẫn với hai tay)
		assert.ok(Object.values(KHOI).some((d) => html.startsWith(`<div ${d}`) || html.includes(d)), `${ten}: có dấu hiệu trong KHOI`);
		assert.ok(canTaiScript(html), `${ten}: tải bộ tải thành phần`);
		assert.throws(() => congCu({ ten, a: '1' }, 'luyen-tap/index'), /không nhận thông số/, ten);
		assert.equal(coAmPiano(html), ['build', 'rhythm', 'sight'].includes(ten), `${ten}: nguồn mẫu âm`);
	}
	assert.ok(!congCu({ ten: 'sight2' }).includes('class="oz-thi-tau oz-tool'));
	for (const ten of ['build', 'worksheet-gen', 'recorder', 'rhythm', 'sight', 'sight2', 'journal']) assert.match(congCu({ ten }), /<noscript data-sinh>/, ten);
	// link "Dữ liệu của tôi": "sắp có" khi trang Dữ liệu chưa có trong bản build
	assert.match(nhatKy(['luyen-tap/du-lieu']), /<a href="\/opus\/luyen-tap\/du-lieu\/">Dữ liệu của tôi<\/a>/);
	assert.match(nhatKy([]), /class="oz-sap-co" data-href="\/opus\/luyen-tap\/du-lieu\/"/);
});

test('xây gam và hợp âm: năm bộ bài và câu hỏi như build.js cũ; kiểm theo cao độ; nốt đàn MIDI đưa về khung', () => {
	assert.deepEqual(Object.values(BO).map((b) => b.ten), ['Hợp âm ba (4 loại)', 'Hợp âm bảy (5 loại)', 'Gam trưởng', 'Ba dạng gam thứ', 'Điệu thức và ngũ cung']);
	for (let i = 0; i < 200; i++) {
		const bo = Object.keys(BO)[i % 5];
		const c = taoCau(bo, i % 2 === 0, day(i + 7));
		const m = c.nots.map(midi);
		assert.ok(Math.min(...m) >= 60 && Math.max(...m) <= 83, `${c.ten}: trong Đô4–Si5`);
		assert.ok(kiemTra(c, m).dat);
		assert.ok(kiemTra(c, m.map((x) => x + 12 * ((x % 3) - 1))).dat, 'khác quãng tám vẫn đúng');
		if (i % 2 === 0) assert.ok(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Bb'].includes(c.goc), 'ít dấu hóa');
	}
	const r = () => 0;
	const c = taoCau('sevenths', false, r);
	assert.equal(c.ten, 'Hợp âm bảy trưởng Đô (Cmaj7)');
	assert.equal(tenDapAn(c), 'Đô – Mi – Sol – Si');
	assert.deepEqual(kiemTra(c, [60, 64, 67]), { dat: false, thieu: 1, thua: 0 });
	assert.deepEqual(kiemTra(c, [60, 64, 67, 71, 61]), { dat: false, thieu: 0, thua: 1 });
	assert.equal(taoCau('major', true, () => 0.99).ten, 'Gam trưởng Si♭');
	assert.equal(taoCau('modes', false, () => 0.9).ten, 'Ngũ cung thứ Fa♯');
	assert.deepEqual([36, 59, 60, 83, 84, 100].map(veKhung), [60, 71, 60, 83, 72, 76]);
});

test('giấy kẻ khuông: số khuông và vị trí như staffpaper.js cũ (A4, lề, khe 2 mm); khuông kép có vạch nối', () => {
	assert.equal(cacKhuong(10, 'single').length, 10);
	assert.equal(cacKhuong(12, 'grand').length, 6);
	assert.equal(cacKhuong(8, 'grand')[0].dong.length, 2);
	const d = cacKhuong(10, 'single');
	assert.equal(d[0].y0, 18);
	assert.ok(Math.abs(d[9].y0 + 8 - 285) < 1e-9, 'khuông cuối chạm lề dưới');
	assert.equal((veTrang(10, 'single').match(/<path /g) || []).length, 50);
	assert.equal((veTrang(10, 'grand').match(/<path /g) || []).length, 5 * 10 + 2 * 5);
	assert.match(veTrang(12, 'grand'), /aria-label="Giấy kẻ khuông A4: 6 khuông kép piano"/);
});

test('phiếu bài tập: đúng năm loại đề như worksheet.js cũ; đề và đáp án khớp nhau', () => {
	assert.deepEqual(Object.values(LOAI).map((l) => l.ten), ['Gọi tên nốt khóa Sol', 'Gọi tên nốt khóa Fa', 'Gọi tên quãng (hòa âm)', 'Gọi tên hợp âm ba', 'Đọc hóa biểu']);
	assert.equal(abcNot({ l: 3, a: 1, o: 4 }), '^F');
	assert.equal(abcNot({ l: 6, a: -1, o: 3 }), '_B,');
	assert.equal(abcNot({ l: 0, a: 0, o: 6 }), "c'");
	assert.equal(chiaO(['A', 'B', 'C', 'D', 'E'], 4), 'A B C D |\nE |]');
	for (let i = 0; i < 50; i++) {
		const sol = deBai('notesTreble', day(i + 1));
		assert.equal(sol.dap_an.length, 16);
		assert.match(sol.abc, /K:C\n/);
		assert.match(deBai('notesBass', day(i + 1)).abc, /K:C clef=bass\n/);
		const q = deBai('intervals', day(i + 2));
		assert.equal(q.dap_an.length, 12);
		assert.equal((q.abc.match(/\[[^\]]+\]4/g) || []).length, 12);
		assert.equal(deBai('chords', day(i + 3)).dap_an.length, 12);
		const hb = deBai('keysigs', day(i + 4));
		assert.equal(hb.hoa_bieu.length, 8);
		assert.equal(new Set(hb.hoa_bieu).size, 8, 'tám giọng khác nhau');
	}
	// đáp án đúng với nốt: Mi4 (bậc 30) là Mi
	const r = () => (30 - 26 + 0.5) / 17;
	assert.deepEqual(deBai('notesTreble', r).dap_an.slice(0, 2), ['Mi', 'Mi']);
	assert.match(deBai('notesTreble', r).abc, /^X:1\nL:1\/4\nM:4\/4\nK:C\nE E E E \|/);
	// quãng: Đô4 + 3 thứ = Đô, Mi♭
	const q = deBai('intervals', () => 0);
	assert.ok(q.abc.includes('[C_E]4'));
	assert.equal(q.dap_an[0], '3 thứ');
	const h = deBai('chords', () => 0.99);
	assert.equal(h.dap_an[0], 'B+ (tăng)');
	assert.ok(h.abc.includes('[B,^D^^F]4'));
});

test('thu âm: thời gian, tên file giữ chữ có dấu, số phút ghi nhật ký như recorder.js cũ', () => {
	assert.equal(thoiGian(0), '0:00');
	assert.equal(thoiGian(75.4), '1:15');
	assert.equal(tenFile('Minuet Sol trưởng, ô 1–8', 'audio/webm;codecs=opus'), 'Minuet Sol trưởng_ ô 1_8.webm');
	assert.equal(tenFile('///', 'audio/mp4'), '_.m4a');
	assert.equal(tenFile('', 'audio/mp4'), 'ban-thu.m4a');
	assert.deepEqual([5, 89, 91, 600].map(soPhut), [1, 1, 2, 10]);
});

test('tiết tấu: sinh tiết tấu và mã ABC như rhythm.js cũ; mỗi ô đủ 4 phách; chấm gõ sớm, muộn, thừa', (t) => {
	for (const cap of [1, 2, 3, 4])
		for (let i = 0; i < 60; i++) {
			const o = taoTietTau(cap, 2, day(i * 4 + cap));
			assert.equal(o.length, 2);
			for (const b of o) assert.equal(b.reduce((s, x) => s + x[0], 0), 48, `cấp ${cap}`);
			assert.ok(o[0].some((x) => x[1]), 'ô đầu có nốt');
		}
	assert.equal(abcTt([[[12, 1], [12, 1], [24, 1]], [[6, 1], [6, 1], [12, 0], [4, 1, 1], [4, 1, 1], [4, 0, 1], [12, 1]]]), 'B4 B4 B8 | B2B2 z4 (3B2B2z2 B4 |]');
	assert.match(abcTietTau([[[48, 1]]]), /^X:1\nM:4\/4\nL:1\/16\nK:C clef=perc stafflines=1\nB16 \|\]$/);
	assert.deepEqual(lucGo([[[12, 1], [12, 0], [24, 1]], [[48, 1]]]), [0, 2, 4]);
	if (coCu('rhythm.js')) {
		for (const cap of [1, 2, 3, 4])
			for (let i = 0; i < 40; i++) {
				const cu = chayCu(['rhythm.js'], { Math: mathCo(day(i * 7 + cap)) }).OZRhythm;
				const o = taoTietTau(cap, 2, day(i * 7 + cap));
				assert.deepEqual(thuong(cu.gen(cap, 2)), o, `cấp ${cap}`);
				assert.equal(cu.toAbc(o), abcTt(o));
			}
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với rhythm.js cũ');
	// chấm: phách 0,5 giây (120 BPM), dung sai 0,15
	const can = [10, 10.5, 11, 12];
	assert.deepEqual(chamGo(can, [10, 10.5, 11, 12], 0.5), { trung: 4, tong: 4, thua: 0, tb: 0, dat: true, chu: 'Chính xác! Gõ trúng 4/4 nốt, rất đều. Bấm “Tiết tấu mới” để tiếp tục.', dungSai: 0.15 });
	const som = chamGo(can, [9.95, 10.45, 10.95, 11.95, 13], 0.5);
	assert.equal(som.chu, 'Gõ trúng 4/4 nốt, gõ thừa 1 lần, hơi sớm, trung bình 50 ms. Bấm “Nghe mẫu” rồi thử lại.');
	assert.equal(chamGo(can, [], 0.5).chu, 'Gõ trúng 0/4 nốt. Bấm “Nghe mẫu” rồi thử lại.');
	assert.equal(chamGo(can, [10.06, 10.56, 11.3], 1).chu, 'Gõ trúng 2/4 nốt, gõ thừa 1 lần, hơi muộn, trung bình 60 ms. Bấm “Nghe mẫu” rồi thử lại.');
	// dải nhịp: mỗi lần gõ một chấm, màu theo sớm, muộn, đúng lúc, thừa
	const h = daiNhipGo({ can, go: [10.01, 10.4, 11.1, 13], phach: 0.5, dau: 10, soPhach: 8, dungSai: 0.15 });
	assert.equal((h.match(/<circle class="oz-ss-go-dat"/g) || []).length, 1);
	assert.equal((h.match(/<circle class="oz-ss-go-som"/g) || []).length, 1);
	assert.equal((h.match(/<circle class="oz-ss-go-muon"/g) || []).length, 1);
	assert.equal((h.match(/<circle class="oz-ss-go-thua"/g) || []).length, 1);
	assert.deepEqual(ghepNhip([1, 2], [1.1, 1.05, 3], 0.2), { trung: [[1, 1.05]], thua: [1.1, 3] });
});

test('thị tấu một bè: giai điệu và mã ABC như sight-reading.js cũ; 4 ô, kết bằng bậc 2 hay 7 về chủ âm', (t) => {
	for (const giong of Object.keys(GIONG_TT))
		for (const cap of [1, 2, 3])
			for (let i = 0; i < 30; i++) {
				const gd = taoGiaiDieu(giong, cap, day(i * 9 + cap));
				assert.equal(gd.o.length, 4);
				for (const o of gd.o) assert.equal(o.reduce((s, x) => s + x[1], 0), 4);
				const v = GIONG_TT[giong].v;
				const cuoi = gd.o[3];
				assert.equal(cuoi[1][0], v, 'kết ở chủ âm');
				assert.ok([v - 1, v + 1].includes(cuoi[0][0]), 'nốt trước là bậc 2 hay 7');
				const can = notCan(gd, 0, 1);
				assert.equal(can[can.length - 1].m % 12, midi(notCua(v, gd.n)) % 12);
				assert.ok(Math.max(...can.map((n) => n.m)) <= 81, 'không vượt La5');
			}
	assert.deepEqual(notCua(31, 1), { l: 3, a: 1, o: 4 }, 'Fa♯ trong Sol trưởng');
	assert.deepEqual(notCua(34, -2), { l: 6, a: -1, o: 4 }, 'Si♭ trong Si♭ trưởng');
	assert.match(abcGiaiDieu(taoGiaiDieu('Bb', 1, day(3))), /^X:1\nM:4\/4\nL:1\/8\nK:Bb\n/);
	if (coCu('theory.js', 'sight-reading.js')) {
		for (const giong of Object.keys(GIONG_TT))
			for (const cap of [1, 2, 3])
				for (let i = 0; i < 15; i++) {
					const cu = chayCu(['theory.js', 'sight-reading.js'], { Math: mathCo(day(i * 11 + cap)) }).OZSight;
					const gd = taoGiaiDieu(giong, cap, day(i * 11 + cap));
					const c = cu.gen(giong, cap);
					assert.deepEqual(thuong(c.bars), gd.o, `${giong} cấp ${cap}`);
					assert.equal(cu.toAbc(c), abcSight(gd));
				}
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với sight-reading.js cũ');
});

test('thị tấu hai tay: bài như sight2.js cũ (cùng dãy ngẫu nhiên); phách mạnh tay phải trong hợp âm; cấp mặc định; gợi ý lên cấp', (t) => {
	const HOP = { I: [1, 3, 5], IV: [4, 6, 1], V: [5, 7, 2] };
	for (const cap of [1, 2, 3, 4])
		for (let i = 0; i < 80; i++) {
			const b = taoBai(cap, day(i * 13 + cap));
			assert.ok(CAP2[cap].giong.includes(b.key));
			assert.equal(b.rh.length, 4);
			const n = b.meter === '3/4' ? 3 : 4;
			for (const o of [...b.rh, ...b.lh]) if (o) assert.equal(o.reduce((s, x) => s + x[1], 0), n);
			for (const o of [...b.rh, ...b.lh]) if (o) for (const [d] of o) assert.ok(d >= 1 && d <= 5, 'thế năm ngón');
			const cuoi = (b.rh[3] ?? b.lh[3]).at(-1);
			assert.equal(cuoi[0], 1, 'kết về chủ âm');
			if (b.plan)
				b.plan.forEach((ch, k) => {
					let tt = 0;
					for (const [d, dai] of b.rh[k]) {
						if ((n === 3 ? [0] : [0, 2]).includes(tt)) assert.ok(HOP[ch].includes(d), `cấp ${cap} ô ${k}: phách mạnh trong hợp âm ${ch}`);
						tt += dai;
					}
				});
			assert.match(b.abc, /%%score \{RH LH\}/);
		}
	if (coCu('sight2.js')) {
		const cu = chayCu(['sight2.js']).OZSight2;
		for (const cap of [1, 2, 3, 4])
			for (let i = 0; i < 50; i++) assert.deepEqual(taoBai(cap, day(i * 5 + cap)), thuong(cu.gen(cap, day(i * 5 + cap))), `cấp ${cap}`);
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với sight2.js cũ');
	assert.equal(capDau(3, { stage: 6 }), 3);
	assert.equal(capDau(0, { stage: 6 }), 4);
	assert.equal(capDau(0, { stage: 2 }), 2);
	assert.equal(capDau(0, null), 1);
	const h = (r, l = 2) => ({ d: '2026-11-05', l, r });
	assert.match(loiSauCham('good', 2, [h('good'), h('good'), h('some'), h('good'), h('good')]), /sẵn sàng lên cấp 3\.$/);
	assert.equal(loiSauCham('good', 2, [h('good'), h('good'), h('some'), h('some'), h('good')]), 'Tốt. Bấm Bài mới để đọc tiếp.');
	assert.doesNotMatch(loiSauCham('good', 4, Array(5).fill(h('good', 4))), /lên cấp/);
	assert.equal(chuThongKe(2, [h('good'), h('bad')]), 'Hôm nay đã đọc 2 bài hai tay. Trong 2 bài gần nhất: 1 bài trôi chảy.');
	assert.equal(chuThongKe(0, []), 'Hôm nay đã đọc 0 bài hai tay.');
});

test('nhật ký: mức ngày, chuỗi ngày, dòng hôm nay, tự đánh dấu, bản đồ 16 tuần như progress.js và journal.js cũ', (t) => {
	assert.equal(VIEC.length, 5);
	const ngay = [{}, { notes: 10 }, { piano: 1 }, { piano: 1, minutes: 5, quizzes: 1 }, { tasks: { dan: true, nghe: false } }, { readings: 3 }, { chords: 4, rhythms: 6 }];
	assert.deepEqual(ngay.map(mucNgay), [0, 1, 2, 3, 1, 1, 1]);
	if (coCu('progress.js')) {
		const cu = chayCu(['progress.js']).OZProgress;
		const r = day(5);
		const truong = ['notes', 'intervals', 'minutes', 'chords', 'keysigs', 'rhythms', 'melodies', 'builds', 'scales', 'styles', 'cards', 'quizzes', 'piano', 'checks', 'readings'];
		for (let i = 0; i < 300; i++) {
			const d = { tasks: { dan: r() < 0.3, nghe: r() < 0.3 } };
			for (const k of truong) if (r() < 0.3) d[k] = Math.floor(r() * 12);
			assert.equal(mucNgay(d), cu.level(d));
		}
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với progress.js cũ');
	const days = { '2026-11-03': { piano: 1 }, '2026-11-04': { notes: 12 }, '2026-11-01': { piano: 1 } };
	assert.equal(chuoiNgay(days, '2026-11-05'), 2, 'hôm nay chưa tập: chuỗi tới hôm qua');
	assert.equal(chuoiNgay({ ...days, '2026-11-05': { piano: 1 } }, '2026-11-05'), 3);
	assert.equal(chuoiNgay(days, '2026-11-07'), 0);
	assert.equal(congNgay('2026-03-01', -1), '2026-02-28');
	assert.equal(chuChuoi(0), 'Chưa có chuỗi ngày nào. Hôm nay là ngày đầu tiên.');
	assert.equal(chuChuoi(4), 'Chuỗi 4 ngày liên tiếp');
	assert.equal(dongHomNay({}), 'Hôm nay chưa có hoạt động nào.');
	assert.equal(dongHomNay({ notes: 3, chords: 2, minutes: 0, readings: 1 }), 'Hôm nay: 3 nốt đọc đúng, 2 hợp âm, 1 bài thị tấu hai tay.');
	const d = { notes: 10, intervals: 4, chords: 3, scales: 3, cards: 9, tasks: {} };
	assert.ok(tuDanhDau(d));
	assert.deepEqual(d.tasks, { 'doc-not': true, 'luyen-tai': true });
	assert.ok(!tuDanhDau(d));
	// 16 cột: thứ Năm 05/11/2026 thì 15 tuần đầy và 4 ngày; ô cuối là hôm nay
	const c = cacNgay(days, '2026-11-05');
	assert.equal(c.length, 15 * 7 + 4);
	assert.equal(c[0].ngay, '2026-07-20');
	assert.equal(new Date(`${c[0].ngay}T00:00:00Z`).getUTCDay(), 1, 'bắt đầu từ thứ Hai');
	assert.ok(c.at(-1).hom_nay);
	assert.equal(cacNgay({}, '2026-11-09').length, 15 * 7 + 1);
	const bd = oBanDo(c);
	assert.equal(bd.nhan, 'Đã luyện tập 3 ngày trong 16 tuần gần nhất');
	assert.match(bd.html, /<span class="l2" title="2026-11-03"><\/span>/);
});

test('bảng năng lực và biểu đồ tiến bộ: như mountSkills, trendsHtml của site cũ', (t) => {
	const data = { goc: '/opus/', trang: ['luyen-tap/doc-not/'] };
	const h = dungBangNangLuc(tinhKeHoach({ today: '2026-11-05', skills: { notes: { n: 6, c: 5, ema: 0.83, last: '2026-11-03' } } }), data);
	assert.match(h, /<a href="\/opus\/luyen-tap\/doc-not\/">Đọc nốt<\/a><\/td><td><span class="oz-thanh" aria-hidden="true"><span style="width:83%"><\/span><\/span> 83%<\/td><td>6<\/td><td>2 ngày trước<\/td>/);
	assert.match(h, /<tr class="oz-khoa"><td><span class="oz-sap-co" data-href="\/opus\/luyen-tap\/hoa-bieu\/"/);
	assert.equal((h.match(/<tr/g) || []).length, 15);
	assert.equal(khoaTuan('2026-11-05'), '2026-11-02');
	assert.equal(khoaTuan('2026-11-02'), '2026-11-02');
	const w = theoTuan({ '2026-11-03': [4, 3], '2026-11-05': [2, 2], '2026-10-28': [5, 1], '2025-01-01': [9, 9], hong: [1, 1] }, '2026-11-05', 12);
	assert.equal(w.length, 12);
	assert.deepEqual(w.at(-1), { w: '2026-11-02', n: 6, c: 5 });
	assert.deepEqual(w.at(-2), { w: '2026-10-26', n: 5, c: 1 });
	if (coCu('viz.js')) {
		const cu = chayCu(['viz.js']).OZViz;
		const lich = { '2026-11-03': [4, 3], '2026-11-05': [2, 2], '2026-10-28': [5, 1], '2026-08-01': [3, 0] };
		assert.deepEqual(theoTuan(lich, '2026-11-05', 12), thuong(cu.weekly(lich, '2026-11-05', 12)));
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với viz.js cũ');
	assert.equal(bieuDoTienBo({}, '2026-11-05', {}), '<p class="oz-stats">Chưa có dữ liệu. Biểu đồ sẽ xuất hiện sau vài ngày luyện tập.</p>');
	const b = bieuDoTienBo({ notes: { '2026-11-03': [4, 3] }, play: {} }, '2026-11-05', { notes: 'Đọc nốt' });
	assert.match(b, /<b>Đọc nốt<\/b><small> · 4 lượt trong 12 tuần<\/small>/);
	assert.match(b, />75%<\/text>/);
	assert.doesNotMatch(b, /play/);
});
