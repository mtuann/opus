// Kiểm thử các công cụ Luyện tập của lô D7-L1 (src/scripts/midi.js, chon-am.js, tra-phim.js, doc-not.js, chep.js, sao-luu.js,
// micro.js, cham-diem.js, so-cao-do.js, choi-theo.js, hinh-so-sanh.js): hàm thuần chạy bằng Node, so với JavaScript cũ ở
// ../opus-zero/ khi có (cùng dữ liệu vào, cùng kết quả). Bấm, nghe, micro và đàn MIDI giả trên trình duyệt thật:
// tests/trinh-duyet/kiem-luyen-tap.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canTaiScript, coAmPiano, congCu } from '../src/plugins/thanh-phan.mjs';
import { docThongDiep } from '../src/scripts/midi.js';
import { chuTrangThai } from '../src/scripts/chon-am.js';
import { GOC, luaChon } from '../src/scripts/tra-phim.js';
import { PHAM_VI, chonNot, haySai, thongTin, trongSo } from '../src/scripts/doc-not.js';
import { CAP, cham, taoCau } from '../src/scripts/chep.js';
import { DINH_DANG, chuanHoa, gop, moTa, thayDoi } from '../src/scripts/sao-luu.js';
import { tanSoCoBan } from '../src/scripts/micro.js';
import { caoDoOnDinh, chamCaoDo, chamMidi, tomTatCham } from '../src/scripts/cham-diem.js';
import { DAY, docTanSo } from '../src/scripts/so-cao-do.js';
import { BAI, NHAC_CU, abcBai, cauHat, chamHat, notCan, sangAbc } from '../src/scripts/choi-theo.js';
import { pianoRoll, soSanhChep } from '../src/scripts/hinh-so-sanh.js';
import { veNotDon } from '../src/scripts/ve.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const coCu = (ten) => fs.existsSync(path.join(JS_CU, ten));
// dữ liệu tạo trong vm có prototype khác: so theo nội dung
const thuong = (x) => JSON.parse(JSON.stringify(x));

/** Chạy file JavaScript cũ (IIFE gắn vào window) trong vm; `Math` thay được để cố định số ngẫu nhiên. */
function chayCu(ten, them = {}) {
	const window = {};
	const document = { querySelectorAll: () => [], addEventListener() {} };
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, ten), 'utf8'), { window, document, CustomEvent: class {}, localStorage: null, ...them });
	return window;
}

function dung(md, trang) {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}

const CONG_CU = ['midi-status', 'sound-setting', 'piano-explorer', 'note-reader', 'dictation', 'data', 'tuner', 'playalong', 'singback'];
const LOP = { 'midi-status': 'oz-midi', 'sound-setting': 'oz-chon-am', 'piano-explorer': 'oz-tra-phim', 'note-reader': 'oz-doc-not', dictation: 'oz-chep', data: 'oz-sao-luu', tuner: 'oz-so-cao-do', playalong: 'oz-choi-theo', singback: 'oz-hat-lai' };

test('chín công cụ D7-L1: dựng sẵn ô (lớp như KHOI của trang mẫu, chữ do thành phần dựng có data-sinh), tải script, không nhận thông số', async () => {
	const { KHOI } = await import('../tools/trang-mau.mjs');
	const dau = Object.values(KHOI);
	for (const ten of CONG_CU) {
		const html = congCu({ ten }, 'luyen-tap/index');
		assert.ok(html.startsWith(`<div class="${LOP[ten]} oz-tool not-content" data-sinh data-pagefind-ignore>`), ten);
		assert.ok(dau.some((d) => html.includes(d)), `${ten}: có dấu hiệu trong KHOI`);
		assert.ok(canTaiScript(html), `${ten}: trang tải bộ tải thành phần`);
		assert.match(html, /<noscript data-sinh>/, `${ten}: báo khi không có JavaScript`);
		assert.throws(() => congCu({ ten, a: '1' }, 'luyen-tap/index'), /không nhận thông số/, ten);
	}
	// công cụ phát tiếng piano: trang tự ghi nguồn mẫu âm
	for (const ten of CONG_CU.filter((t) => t !== 'data')) assert.ok(coAmPiano(congCu({ ten }, 'luyen-tap/index')), ten);
	assert.ok(!coAmPiano(congCu({ ten: 'data' }, 'luyen-tap/index')));
	// chỉ thị trong trang
	const html = dung('::cong-cu{ten="tuner"}\n\n::cong-cu{ten="singback"}', 'luyen-tap/hat-lai');
	assert.match(html, /class="oz-so-cao-do oz-tool/);
	assert.match(html, /class="oz-hat-lai oz-tool/);
	// chép giai điệu có sẵn ô kết nối MIDI bên trong, như bản cũ; chơi theo có ô MIDI ẩn tới khi chọn đàn MIDI
	assert.match(congCu({ ten: 'dictation' }, 'luyen-tap/chep-giai-dieu'), /<div class="oz-midi oz-tool/);
	assert.match(congCu({ ten: 'playalong' }, 'luyen-tap/choi-theo'), /<div class="oz-choi-theo-midi" hidden><div class="oz-midi oz-tool/);
});

test('MIDI: thông điệp nốt bật, nốt tắt (cả nốt bật có lực 0) như midi.js cũ; thông điệp khác bỏ qua', () => {
	assert.deepEqual(docThongDiep([0x90, 60, 100]), { loai: 'on', m: 60, luc_do: 100 });
	assert.deepEqual(docThongDiep([0x93, 61, 1]), { loai: 'on', m: 61, luc_do: 1 }, 'kênh khác');
	assert.deepEqual(docThongDiep([0x90, 60, 0]), { loai: 'off', m: 60, luc_do: 0 });
	assert.deepEqual(docThongDiep([0x80, 60, 64]), { loai: 'off', m: 60, luc_do: 0 });
	assert.equal(docThongDiep([0xb0, 64, 127]), null, 'pedal');
});

test('chọn âm thanh: dòng trạng thái theo chế độ và số mẫu đã tải (tải theo vùng, giữ tối đa 12 mẫu)', () => {
	assert.equal(chuTrangThai({ che_do: 'synth', da_tai: 3, tong: 30 }), 'Đang dùng âm tổng hợp.');
	assert.match(chuTrangThai({ che_do: 'piano', da_tai: 0, tong: 30 }), /^Mẫu âm piano \(30 mẫu, khoảng 2 MB cả bộ\) được tải dần/);
	assert.equal(chuTrangThai({ che_do: 'piano', da_tai: 5, tong: 30 }), 'Đã tải 5 mẫu âm piano quanh các phím đã dùng (giữ tối đa 12 mẫu).');
	// 2 MB: cỡ thật của bộ mẫu
	const tong = fs.readdirSync(path.join(ROOT, 'public/mau-am/piano')).filter((f) => f.endsWith('.mp3')).reduce((s, f) => s + fs.statSync(path.join(ROOT, 'public/mau-am/piano', f)).size, 0);
	assert.ok(tong > 1.5e6 && tong < 2.5e6, `${tong} byte`);
});

test('tra hợp âm và gam: nốt và nhãn như mountExplorer của piano.js cũ; gam nằm trong bàn phím Đô3–Đô6', () => {
	assert.deepEqual(luaChon('C', 's:major').m, [60, 62, 64, 65, 67, 69, 71, 72]);
	assert.equal(luaChon('C', 's:major').nhan, 'Gam trưởng Đô');
	assert.equal(luaChon('Bb', 'c:dom7').nhan, 'Hợp âm bảy át Si♭ (B♭7)');
	assert.deepEqual(luaChon('F#', 'c:maj').m, [54, 58, 61], 'từ Fa♯ trở lên: quãng tám 3');
	for (const g of GOC)
		for (const l of ['s:major', 's:pentaMinor', 's:melodic', 'c:dim7', 'c:aug']) {
			const { m } = luaChon(g, l);
			assert.ok(Math.min(...m) >= 48 && Math.max(...m) <= 84, `${g} ${l}`);
		}
});

test('đọc nốt: phạm vi, thông tin nốt và trọng số như note-reader.js cũ; nốt kế không lặp; ba nốt hay sai nhất', () => {
	assert.deepEqual(thongTin(30), { chu: 2, o: 4, m: 64, khoa_hoc: 'E4' });
	assert.deepEqual(thongTin(26), { chu: 5, o: 3, m: 57, khoa_hoc: 'A3' });
	assert.equal(trongSo(undefined), 1.6);
	assert.equal(trongSo([3, 1]), 1 + (4 * 2) / 5);
	for (const khoa of Object.keys(PHAM_VI))
		for (const pv of ['basic', 'ledger']) {
			const [tu, den] = PHAM_VI[khoa][pv];
			for (let i = 0; i < 200; i++) {
				const v = chonNot({ khoa, phamVi: pv, uuTien: true, thongKe: {}, truoc: tu, ngauNhien: Math.random() });
				assert.ok(v >= tu && v <= den && v !== tu, `${khoa} ${pv}: ${v}`);
			}
		}
	// nốt hay sai được chọn nhiều hơn
	const tk = { 'treble:35': [10, 9] };
	let n = 0;
	for (let i = 0; i < 2000; i++) if (chonNot({ khoa: 'treble', phamVi: 'basic', uuTien: true, thongKe: tk, ngauNhien: i / 2000 }) === 35) n++;
	assert.ok(n > 2000 / 11 * 1.5, `${n}`);
	assert.deepEqual(haySai({ 'treble:30': [4, 2], 'bass:18': [3, 0], 'treble:35': [2, 2], 'alto:28': [5, 1] }), ['Mi E4 (khóa Sol, sai 50%)', 'Đô C4 (khóa Đô alto, sai 20%)']);
	// hình: khuông trống lúc build, nốt có dòng kẻ phụ đúng số
	assert.doesNotMatch(veNotDon('treble', null), /oz-not-dau/);
	const ke = (s) => (s.match(/<path d="M54 /g) ?? []).length;
	assert.equal(ke(veNotDon('treble', 26)), 2, 'La3 khóa Sol: hai dòng kẻ phụ dưới');
	assert.equal(ke(veNotDon('treble', 42)), 2, 'Đô6 khóa Sol: hai dòng kẻ phụ trên');
	assert.equal(ke(veNotDon('alto', 28)), 0, 'Đô4 khóa Đô alto: dòng giữa');
	assert.equal(ke(veNotDon('bass', 30)), 2, 'Mi4 khóa Fa: Đô4 và Mi4 trên khuông');
});

test('chép giai điệu: câu như gen của dictation.js cũ (cùng số ngẫu nhiên), bắt đầu và kết ở chủ âm; chấm từng nốt', (t) => {
	const day = (seed) => {
		let s = seed;
		return () => ((s = (s * 1103515245 + 12345) % 2147483648), s / 2147483648);
	};
	for (const cap of Object.keys(CAP).map(Number))
		for (let i = 0; i < 50; i++) {
			const c = taoCau(cap, day(i + 1));
			assert.equal(c.length, CAP[cap].n);
			assert.equal(c[0], 60);
			assert.ok([60, 72].includes(c[c.length - 1]));
			assert.ok(c.every((m) => m >= 60 && m <= 72));
		}
	if (coCu('dictation.js')) {
		// cùng dãy số ngẫu nhiên thì cùng câu
		for (let i = 0; i < 30; i++)
			for (const cap of [1, 2, 3]) {
				const M = Object.create(Math);
				M.random = day(i * 3 + cap);
				assert.deepEqual(thuong(chayCu('dictation.js', { Math: M }).OZDictation.gen(cap)), taoCau(cap, day(i * 3 + cap)), `cấp ${cap}`);
			}
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với dictation.js cũ');
	assert.deepEqual(cham([60, 64, 67, 60], [60, 64, 67, 60]), { dung: 4, dat: true, chu: 'Hoàn toàn chính xác! ✓ Đô · ✓ Mi · ✓ Sol · ✓ Đô' });
	assert.equal(cham([60, 64], [60, 65]).chu, 'Đúng 1/2 nốt. ✓ Đô · ✗ Mi (bạn nhập Fa)');
	const h = soSanhChep([60, 64], [60, 65]);
	assert.match(h, /^<svg class="oz-ss" viewBox="0 0 164 /);
	assert.equal((h.match(/class="oz-ss-dat"/g) ?? []).length, 1);
	assert.equal((h.match(/class="oz-ss-cham-sai"/g) ?? []).length, 1);
});

// ---------- Sao lưu ----------

/** Dữ liệu học ngẫu nhiên (gen của ../opus-zero/tests/data.mjs). */
function sinh(rnd) {
	const chon = (a) => a[Math.floor(rnd() * a.length)];
	const ngay = () => `2026-${String(1 + Math.floor(rnd() * 10)).padStart(2, '0')}-${String(1 + Math.floor(rnd() * 28)).padStart(2, '0')}`;
	const days = {};
	for (let i = 0; i < 1 + rnd() * 15; i++)
		days[ngay()] = { tasks: { 'doc-not': rnd() < 0.5, nghe: rnd() < 0.3 }, note: rnd() < 0.3 ? chon(['Tập gam Sol', 'Nghe Mozart 40', 'Khó phần hóa biểu']) : '', notes: Math.floor(rnd() * 30), intervals: Math.floor(rnd() * 20), minutes: Math.floor(rnd() * 10) };
	const store = { lessons: {}, skills: {}, cards: {}, noteStats: {}, blindLog: [], listen: {}, checks: {}, repertoire: {}, skillHist: {} };
	for (const l of ['01-cao-do-ten-not', '08-hoa-bieu']) if (rnd() < 0.5) store.lessons[`/opus/nhac-ly/${l}/`] = ngay();
	for (const s of ['notes', 'intervals', 'dictation']) if (rnd() < 0.6) store.skills[s] = { n: Math.floor(rnd() * 50), c: 0, ema: rnd(), last: ngay() };
	for (const c of ['Allegro', 'Largo']) if (rnd() < 0.6) store.cards[c] = { box: Math.floor(rnd() * 5), due: ngay(), added: ngay() };
	for (const k of ['treble:30', 'bass:20']) if (rnd() < 0.6) store.noteStats[k] = [Math.floor(rnd() * 20), Math.floor(rnd() * 5)];
	for (let i = 0; i < rnd() * 4; i++) store.blindLog.push({ d: ngay(), t: chon(['Bach', 'Mozart']), gp: 'baroque', ge: 'solo', gc: '', ap: 'baroque' });
	if (rnd() < 0.5) store.listen['/opus/nghe-nhac/ravel-bolero/'] = { url: rnd() < 0.5 ? 'https://youtu.be/abcdefghijk' : '', marks: { 0: 5, 2: Math.floor(rnd() * 99) } };
	if (rnd() < 0.5) store.listen['/opus/piano/tac-pham/fur-elise/'] = rnd() < 0.5 ? { url: 'https://example.org/a.mp3', marks: { 1: 7 }, byUrl: { 'file:a.mp3': { 0: 3 } } } : { url: 'file:a.mp3', marks: { 0: 4 } };
	for (const pg of ['piano/lo-trinh/']) if (rnd() < 0.6) store.checks[pg] = { a1: ngay() };
	for (const pc of ['piano/tac-pham/fur-elise/']) if (rnd() < 0.6) store.repertoire[pc] = { name: pc, status: chon(['learning', 'removed']), updated: `${ngay()}T0${Math.floor(rnd() * 10)}:00:00Z` };
	if (rnd() < 0.5) store.pianoLevel = { stage: 1 + Math.floor(rnd() * 7), updated: `${ngay()}T12:00:00Z` };
	if (rnd() < 0.3) store.placement = { done: true };
	for (const sk of ['notes']) if (rnd() < 0.7) store.skillHist[sk] = { [ngay()]: [5, 3] };
	return { days, store };
}

test('sao lưu: gộp như data.js cũ (cùng dữ liệu, cùng kết quả); gộp lại không đổi gì; không mất dữ liệu của máy nào', (t) => {
	let seed = 7;
	const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed / 2147483648);
	const cu = coCu('data.js') ? chayCu('data.js').OZData : null;
	if (!cu) t.diagnostic('không có ../opus-zero/: bỏ phần so với data.js cũ');
	for (let i = 0; i < 200; i++) {
		const dt = sinh(rnd);
		const mt = sinh(rnd);
		const { gop: a, bao_cao } = gop(mt, dt);
		if (cu) assert.deepEqual(a, thuong(cu.merge(thuong(mt), thuong(dt)).merged));
		assert.deepEqual(gop(a, dt).gop, a, 'gộp lại cùng file');
		assert.equal(thayDoi(gop(a, dt).bao_cao, 0).tong, 0, 'gộp lại: không có thay đổi để xem trước');
		assert.deepEqual(gop(mt, mt).gop.days, mt.days);
		for (const p of [dt, mt]) {
			for (const [d, x] of Object.entries(p.days)) {
				assert.ok(a.days[d]);
				assert.ok((a.days[d].notes || 0) >= (x.notes || 0));
				if (x.note) assert.ok(a.days[d].note.includes(x.note));
			}
			for (const l of Object.keys(p.store.lessons)) assert.ok(a.store.lessons[l]);
		}
		if (cu) assert.deepEqual(moTa(a), Object.fromEntries(Object.entries(thuong(cu.describe(thuong(a)))).map(([k, v], j) => [Object.keys(moTa(a))[j], v])));
		assert.ok(bao_cao.ngay_them >= 0);
	}
});

test('sao lưu: nhận file của site cũ (format opus-zero-backup, và bản rất cũ chỉ có days, store); file sai thì báo bằng chữ', () => {
	const tien = { days: { '2026-10-01': { notes: 3, tasks: {}, note: '' } }, store: { lessons: { '/opus-zero/nhac-ly/01-cao-do-ten-not/': '2026-10-01' } } };
	const moi = chuanHoa({ format: DINH_DANG, version: 2, exported: '2026-10-02T08:00:00Z', progress: tien, settings: { sound: 'synth', midiAuto: '1' }, recordings: [] });
	assert.deepEqual(moi, { progress: tien, settings: { sound: 'synth', midiAuto: '1' }, recordings: [], exported: '2026-10-02T08:00:00Z' });
	assert.deepEqual(chuanHoa(tien).progress, tien);
	assert.throws(() => chuanHoa([]), /Không phải file sao lưu hợp lệ/);
	assert.throws(() => chuanHoa({ format: DINH_DANG, progress: {} }), /thiếu dữ liệu tiến độ/);
	assert.throws(() => chuanHoa({ a: 1 }), /Không nhận ra định dạng file/);
	const { tong, html } = thayDoi(gop({ days: {} }, tien).bao_cao, 2);
	assert.equal(tong, 4);
	assert.equal(html, '<li>thêm 1 ngày luyện tập</li><li>thêm 1 bài đã học</li><li>thêm 2 bản thu âm</li>');
});

// ---------- Micro, chấm điểm ----------

const RATE = 48000;
const song = (f, n = 2048) => Float32Array.from({ length: n }, (_, i) => 0.5 * Math.sin((2 * Math.PI * f * i) / RATE));

test('micro: tìm cao độ như tuner.js cũ; so cao độ đọc nốt gần nhất, dây chuẩn gần nhất, lời nhắc lên dây', (t) => {
	for (const f of [110, 196, 440, 659.25]) assert.ok(Math.abs(tanSoCoBan(song(f), RATE) - f) / f < 0.01, `${f} Hz`);
	if (coCu('tuner.js')) {
		const cu = chayCu('tuner.js').OZTuner;
		for (const f of [110, 196, 440]) assert.equal(tanSoCoBan(song(f), RATE), cu.detect(song(f), RATE));
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với tuner.js cũ');
	assert.deepEqual(docTanSo(440), { ten: 'La A4', cent: 0, dung: true, loi: 'Đúng cao độ' });
	assert.equal(docTanSo(440 * 2 ** (-20 / 1200)).loi, 'Thấp 20 cent: lên dây căng hơn');
	assert.equal(docTanSo(440 * 2 ** (30 / 1200)).loi, 'Cao 30 cent: chùng dây xuống');
	// guitar: so với dây gần nhất (La2 = 110 Hz), không phải nốt gần nhất
	assert.equal(docTanSo(116, 'guitar').ten, 'La A2');
	assert.deepEqual(DAY.violin.map(([, m]) => m), [55, 62, 69, 76]);
});

test('chấm điểm: cao độ từ micro (trung vị, bỏ qua quãng tám), đàn MIDI (cửa sổ thời gian, bấm thừa), hát một nốt, như assess.js cũ', (t) => {
	const can = [
		{ m: 60, t0: 0, dai: 1 },
		{ m: 64, t0: 1, dai: 1 },
		{ m: 67, t0: 2, dai: 1 },
	];
	const f = (m) => 440 * 2 ** ((m - 69) / 12);
	const khung = [];
	for (let x = 0; x < 3; x += 0.05) khung.push({ t: x, f: x < 1 ? f(60) : x < 2 ? f(64.8) : -1 });
	const kq = chamCaoDo(can, khung);
	assert.deepEqual(kq.map((n) => n.ket_qua), ['dat', 'cao', 'thieu']);
	assert.equal(kq[1].cent, 80);
	assert.deepEqual(tomTatCham(kq), { dat: 1, tong: 3, pt: 33 });
	assert.equal(chamCaoDo([{ m: 72, t0: 0, dai: 1 }], khung, { boQuang: true })[0].ket_qua, 'dat', 'bỏ qua quãng tám');
	const m = chamMidi(can, [{ t: 0.05, m: 60 }, { t: 1.02, m: 62 }, { t: 1.5, m: 70 }], 1);
	assert.deepEqual(m.nots.map((n) => n.ket_qua), ['dat', 'thap', 'thieu']);
	assert.equal(m.thua, 1);
	assert.equal(caoDoOnDinh(Array.from({ length: 10 }, () => ({ f: 440 }))), 69);
	assert.equal(caoDoOnDinh([{ f: 440 }]), null);
	if (coCu('assess.js')) {
		const cu = chayCu('assess.js').OZAssess;
		const kqCu = cu.assessPitch(can.map((n) => ({ t0: n.t0, dur: n.dai, midi: n.m })), khung, {});
		assert.deepEqual(kq.map((n) => n.cent ?? null), thuong(kqCu).map((n) => n.cents ?? null));
		const mCu = cu.assessMidi(can.map((n) => ({ t0: n.t0, dur: n.dai, midi: n.m })), [{ t: 0.05, midi: 60 }, { t: 1.02, midi: 62 }, { t: 1.5, midi: 70 }], 1, {});
		assert.equal(mCu.extra, m.thua);
		assert.deepEqual(thuong(mCu.notes).map((n) => n.status), ['ok', 'low', 'missing']);
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với assess.js cũ');
});

test('chơi theo, hát lại: nốt ABC như toAbc của playalong.js cũ; nốt cần chơi theo nhạc cụ; câu hát và kết quả', (t) => {
	if (coCu('playalong.js')) {
		const cu = chayCu('playalong.js').OZPlayalong;
		for (const [k, b] of Object.entries(BAI))
			for (const nc of Object.values(NHAC_CU)) {
				const d = nc.dich === -12 ? 0 : nc.dich;
				assert.equal(sangAbc(b.not, d), cu.toAbc(cu.SONGS[k].notes, d), `${k} ${d}`);
			}
	} else t.diagnostic('không có ../opus-zero/: bỏ phần so với playalong.js cũ');
	assert.match(abcBai('twinkle', 'violin'), /^X:1\nL:1\/8\nM:4\/4\nK:D\n/);
	assert.match(abcBai('scale', 'guitar'), /^X:1\nL:1\/8\nM:4\/4\nK:C clef=treble-8\n/);
	assert.deepEqual(notCan('scale', 'guitar', 1, 0.5).slice(0, 2), [{ m: 48, t0: 1, dai: 0.5 }, { m: 50, t0: 1.5, dai: 0.5 }]);
	for (let i = 0; i < 100; i++) {
		const c = cauHat('high', 'interval');
		assert.ok(c.dich - c.goc === c.quang && c.goc >= 60 && c.dich <= 72 + 12);
		const n = cauHat('low', 'unison');
		assert.ok(n.dich >= 48 && n.dich < 58);
	}
	assert.equal(chamHat(69.2, 69).chu, 'Đúng! Lệch +20 cent.');
	assert.equal(chamHat(57, 69).dat, true, 'thấp một quãng tám vẫn đúng');
	assert.equal(chamHat(71, 69).chu, 'Cao hơn 200 cent (khoảng 2 nửa cung). Nghe lại và thử lần nữa.');
	assert.equal(chamHat(null, 69).ket_qua, 'thieu');
	const roll = pianoRoll({ can: [{ m: 60, t0: 0, dai: 1, ket_qua: 'dat' }], khung: [{ t: 0.5, f: 261.63 }] });
	assert.match(roll, /class="oz-ss-dat"/);
	assert.match(roll, /<g class="oz-ss-do"><circle/);
	assert.equal(pianoRoll({ can: [] }), '');
});
