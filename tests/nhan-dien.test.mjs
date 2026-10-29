// Kiểm thử thành phần của lô D5-L3: ví dụ phong cách (::cong-cu{ten="style-example" id="…"}), đoán phong cách
// (style-trainer; src/scripts/nhan-dien.js) và nhận biết kết cấu (texture-trainer; src/scripts/luyen-tai.js). Dựng sẵn đúng
// (chữ thật, data-sinh, aria-live), không nhận thông số lạ, id lạ thì build hỏng; dữ liệu (mã ABC, dấu hiệu, giai điệu,
// đáp án), chữ, cách phát và cách lưu như recognition.js và progress.js cũ ở ../opus-zero/ khi có.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canTaiScript, coAmPiano } from '../src/plugins/thanh-phan.mjs';
import { CHU_ND, THOI_KY_ND, VI_DU, boThuTu, chamPhongCach, chuDauHieu } from '../src/scripts/nhan-dien.js';
import { CONG_CU_TAI, FJ, KET_CAU, boCua, cham, notKetCau } from '../src/scripts/luyen-tai.js';
import { canhBao, oSai } from '../tools/khuong-nhac.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const coCu = fs.existsSync(JS_CU);
const j = (x) => JSON.parse(JSON.stringify(x));
const giaiMa = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, (_, k) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[k]);

function dung(md, trang = 'nhan-dien/luyen-nghe') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}

function giaTrinhDuyet(t) {
	const kho = new Map();
	const cu = { localStorage: globalThis.localStorage, document: globalThis.document };
	globalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, String(v)) };
	globalThis.document = { dispatchEvent: () => true };
	t.after(() => Object.assign(globalThis, cu));
	return kho;
}

/** Bộ sinh số ngẫu nhiên cố định (cùng dãy cho bản cũ và bản mới). */
function dayNgauNhien(hat) {
	let x = hat;
	return () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
}

/**
 * Chạy recognition.js cũ với một DOM giả: `goc` là ô .oz-texture-trainer (nhận sự kiện bấm), OZAudio ghi lại các nốt phát.
 * Trả về window (OZRecognition), hàm bấm và danh sách nốt.
 */
function chayCu({ random } = {}) {
	const nghe = [];
	const nghe2 = {};
	const el = () => ({ textContent: '', className: '', dataset: {}, classList: { add() {}, remove() {} }, appendChild() {}, querySelectorAll: () => [], addEventListener() {} });
	const goc = {
		dataset: {},
		classList: { add() {} },
		innerHTML: '',
		querySelector: () => el(),
		addEventListener: (k, f) => (nghe2[k] = f),
	};
	const OZAudio = { getCtx: () => ({ currentTime: 0 }), playNote: (...a) => nghe.push(a) };
	const window = { OZReady: (f) => f(), OZAudio };
	const document = {
		querySelectorAll: (s) => (s === '.oz-texture-trainer' ? [goc] : []),
		addEventListener() {},
		createElement: () => el(),
		body: {},
	};
	const ctx = { window, document, OZAudio, getComputedStyle: () => ({ getPropertyValue: () => '' }) };
	if (random) ctx.Math = Object.assign(Object.create(Math), { random });
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, 'recognition.js'), 'utf8'), ctx);
	const bam = (act) => nghe2.click({ target: { closest: () => ({ dataset: { act } }) } });
	return { window, bam, nghe };
}

test('dựng sẵn ô đoán phong cách và nhận biết kết cấu: chữ thật, data-sinh, aria-live, các nút; không nhận thông số', () => {
	const pc = dung('::cong-cu{ten="style-trainer"}');
	assert.match(pc, /^<div class="oz-nd oz-tool not-content" data-cong-cu="style-trainer" data-sinh data-pagefind-ignore>/);
	assert.match(pc, /<p class="oz-stats">Nghe một đoạn ngắn \(bấm nút phát\), rồi đoán thời kỳ\. Khuông nhạc và các dấu hiệu chỉ hiện sau khi bạn trả lời\.<\/p>/);
	assert.deepEqual([...pc.matchAll(/data-p="([a-z]+)">([^<]+)</g)].map((m) => `${m[1]}=${m[2]}`), [
		'baroque=Baroque',
		'classical=Cổ điển',
		'romantic=Lãng mạn',
		'impressionist=Ấn tượng',
		'modern=Thế kỷ 20',
	]);
	assert.match(pc, /role="group" aria-label="Chọn thời kỳ"/);
	assert.match(pc, /<p class="oz-feedback" aria-live="polite">Bấm nút phát ở trên để nghe\.<\/p>/);
	assert.match(pc, /<ul class="oz-clues" hidden><\/ul>/);
	assert.match(pc, /data-act="next">Đoạn khác<\/button>/);
	assert.match(pc, /<div class="oz-nd-khuong oz-hidden-staff" aria-hidden="true"><\/div>/);
	assert.match(pc, /<noscript data-sinh>/);
	assert.ok(canTaiScript(pc));
	assert.ok(!coAmPiano(pc), 'đoán phong cách phát bằng abcjs, không dùng mẫu âm piano');

	const kc = dung('::cong-cu{ten="texture-trainer"}');
	assert.match(kc, /^<div class="oz-lt oz-lt--ket-cau oz-tool not-content" data-cong-cu="texture-trainer" data-sinh data-pagefind-ignore>/);
	assert.deepEqual([...kc.matchAll(/data-d="([a-z]+)">([^<]+)</g)].map((m) => `${m[1]}=${m[2]}`), ['mono=Đơn âm', 'homo=Chủ điệu', 'poly=Phức điệu', 'hetero=Dị âm']);
	assert.match(kc, /aria-label="Chọn kết cấu"/);
	assert.match(kc, /<p class="oz-feedback" aria-live="polite">Cùng một giai điệu được phát theo một trong bốn kết cấu\. Hãy đoán kết cấu \(xem bài 28\)\.<\/p>/);
	assert.doesNotMatch(kc, /<select/);
	assert.ok(canTaiScript(kc) && coAmPiano(kc), 'kết cấu phát bằng mẫu âm piano: trang có dòng ghi nguồn');

	for (const t of ['style-trainer', 'texture-trainer'])
		assert.throws(() => dung(`::cong-cu{ten="${t}" id="x"}`), new RegExp(`công cụ "${t}" không nhận thông số \\(id\\)`));
});

test('ví dụ phong cách: khuông của đúng đoạn, dòng dấu hiệu; id lạ, thiếu id, thông số lạ thì build hỏng', () => {
	assert.deepEqual(Object.keys(VI_DU), ['baroque-1', 'baroque-2', 'classical-1', 'classical-2', 'romantic-1', 'romantic-2', 'impressionist-1', 'impressionist-2', 'modern-1', 'modern-2']);
	for (const [id, vd] of Object.entries(VI_DU)) {
		const h = dung(`::cong-cu{ten="style-example" id="${id}"}`, 'nhan-dien/so-sanh-thoi-ky');
		assert.match(h, new RegExp(`^<div class="oz-vd-phong-cach" data-vd="${id}" data-sinh${vd.prog === 0 ? '' : ' data-khong-tay'}><figure class="oz-abc"`), id);
		assert.equal(giaiMa(/data-abc="([^"]*)"/.exec(h)[1]), vd.abc, id);
		assert.ok(h.includes(`<p class="oz-stats">${chuDauHieu(vd).replace(/"/g, '&quot;')}</p></div>`), id);
		assert.ok(canTaiScript(h));
		assert.ok(vd.thoi_ky in THOI_KY_ND && id.startsWith(vd.thoi_ky));
	}
	assert.equal(chuDauHieu(VI_DU['impressionist-2']), 'Dấu hiệu: Giai điệu đi xuống theo gam toàn cung (xem bài 32); Hợp âm tăng ngân suốt bên dưới; Mơ hồ, không có chủ âm rõ ràng.');
	assert.throws(() => dung('::cong-cu{ten="style-example" id="baroque-3"}'), /công cụ "style-example": id "baroque-3" không có \(có: baroque-1, /);
	assert.throws(() => dung('::cong-cu{ten="style-example"}'), /công cụ "style-example": id "" không có/);
	assert.throws(() => dung('::cong-cu{ten="style-example" id="baroque-1" period="baroque"}'), /công cụ "style-example" không nhận thông số period \(nhận: id\)/);
});

test('mã ABC của mười đoạn: abcjs đọc không cảnh báo, ô nhịp đủ độ dài', () => {
	for (const [id, vd] of Object.entries(VI_DU)) {
		assert.deepEqual(canhBao(vd.abc), [], id);
		assert.deepEqual(oSai(vd.abc), [], id);
		assert.match(vd.abc, new RegExp(`%%MIDI program ${vd.prog}\\n`));
	}
});

test('dữ liệu và chữ như recognition.js cũ', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const { window } = chayCu();
	const rec = window.OZRecognition;
	// lượt 1 kiểm định D5-L3 sửa vài trường (hồ sơ kiem-dinh/nhan-dien/so-sanh-thoi-ky.yml): phần còn lại như file cũ
	const DA_SUA = {
		'baroque-1': ['clues'],
		'classical-1': ['abc', 'clues'],
		'romantic-2': ['clues'],
		'impressionist-1': ['clues'],
		'modern-1': ['abc'],
		'modern-2': ['clues'],
	};
	const moi = Object.fromEntries(Object.entries(VI_DU).map(([k, v]) => [k, { period: v.thoi_ky, prog: v.prog, abc: v.abc, clues: v.dau_hieu }]));
	const cu = j(rec.EX);
	for (const [k, ts] of Object.entries(DA_SUA))
		for (const tr of ts) {
			assert.notDeepEqual(moi[k][tr], cu[k][tr], `${k}.${tr} đã sửa`);
			cu[k][tr] = moi[k][tr];
		}
	assert.deepEqual(moi, cu);
	assert.deepEqual(FJ, j(rec.FJ));
	const src = fs.readFileSync(path.join(JS_CU, 'recognition.js'), 'utf8');
	const hang = (ten) => vm.runInNewContext(`(${new RegExp(`const ${ten} = (\\{[^}]*\\});`).exec(src)[1]})`);
	assert.deepEqual(THOI_KY_ND, j(hang('PERIODS')));
	assert.deepEqual(KET_CAU, j(hang('TEX')));
	// câu chữ có nguyên văn trong file cũ
	for (const k of ['dan', 'nhom', 'dau', 'sai']) assert.ok(src.includes(CHU_ND[k]), `${k}: ${CHU_ND[k]}`);
	assert.ok(src.includes('"Đúng: " + PERIODS[cur.period] + ". Các dấu hiệu:"') && CHU_ND.dung('modern') === 'Đúng: Thế kỷ 20. Các dấu hiệu:');
	assert.ok(src.includes('"Lượt này: đúng ngay lần đầu " + session.right + "/" + session.total + "."'));
	assert.equal(CHU_ND.diem({ dung: 2, tong: 3 }), 'Lượt này: đúng ngay lần đầu 2/3.');
	assert.ok(src.includes('"Dấu hiệu: " + ex.clues.join("; ") + "."'));
	assert.ok(src.includes('>Đoạn khác</button>'));
	const cc = CONG_CU_TAI['texture-trainer'];
	for (const k of ['dau', 'hoi', 'sai', 'nhom']) assert.ok(src.includes(cc[k]), `texture-trainer.${k}: ${cc[k]}`);
	assert.ok(src.includes('"Đúng: " + TEX[q.type] + ". Bấm “Câu mới” để tiếp tục."'));
	assert.equal(cc.dung({ dap: 'poly' }), 'Đúng: Phức điệu. Bấm “Câu mới” để tiếp tục.');
});

test('nhận biết kết cấu: cùng dãy số ngẫu nhiên thì cùng câu hỏi và cùng các nốt phát như recognition.js cũ', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const cc = CONG_CU_TAI['texture-trainer'];
	const gap = new Set();
	for (let hat = 1; hat <= 60; hat++) {
		const cu = chayCu({ random: dayNgauNhien(hat) });
		cu.bam('new');
		const q = cc.cau(boCua(cc), dayNgauNhien(hat));
		gap.add(q.dap);
		assert.ok(q.dich >= -3 && q.dich <= 3 && q.nhip >= 0.38 && q.nhip < 0.5);
		assert.deepEqual(notKetCau(q), cu.nghe, `hạt ${hat}: ${JSON.stringify(q)}`);
		assert.deepEqual(cc.phat(q), notKetCau(q));
	}
	assert.deepEqual([...gap].sort(), Object.keys(KET_CAU).sort(), 'gặp đủ bốn kết cấu');
});

test('nhận biết kết cấu: số bè đúng kết cấu', () => {
	const q = (dap) => ({ dap, dich: 0, nhip: 0.4 });
	const cungLuc = (ds) => Math.max(...ds.map(([, t]) => ds.filter(([, u, d]) => u <= t + 1e-9 && t < u + d - 1e-9).length));
	assert.equal(cungLuc(notKetCau(q('mono'))), 1, 'đơn âm: một nốt mỗi lúc');
	assert.equal(notKetCau(q('mono')).length, 14, 'đơn âm: 16 phách đầu của giai điệu');
	assert.equal(cungLuc(notKetCau(q('homo'))), 4, 'chủ điệu: giai điệu và hợp âm ba');
	// phức điệu: bè thứ hai (thấp hơn quãng tám, Đô3 = 48) vào sau 8 phách, như canon
	const poly = notKetCau(q('poly'));
	const vao = poly.find(([m]) => m === 48);
	assert.ok(Math.abs(vao[1] - (0.05 + 8 * 0.4)) < 1e-9);
	assert.equal(cungLuc(poly), 2);
	assert.equal(cungLuc(notKetCau(q('hetero'))), 2, 'dị âm: hai bản cùng giai điệu vang cùng lúc');
});

test('chấm và lưu như progress.js cũ: kỹ năng style chỉ tính lần trả lời đầu, đoạn đoán đúng ghi vào styles; kết cấu vào texture và styles', async (t) => {
	const kho = giaTrinhDuyet(t);
	const { KHOA, homNay } = await import('../src/scripts/tien-do.js');
	const phien = { dung: 0, tong: 0 };
	const q = { id: 'baroque-1', thoi_ky: 'baroque', lanDau: true, xong: false };
	assert.equal(chamPhongCach(q, 'classical', phien), false);
	assert.equal(chamPhongCach(q, 'baroque', phien), true);
	assert.ok(q.xong);
	assert.equal(chamPhongCach({ thoi_ky: 'modern', lanDau: true }, 'modern', phien), true);
	assert.deepEqual(phien, { dung: 1, tong: 2 });
	const pk = { dung: 0, tong: 0 };
	cham(CONG_CU_TAI['texture-trainer'], { dap: 'mono', lanDau: true }, 'homo', pk);
	const data = JSON.parse(kho.get(KHOA));
	assert.equal(data.days[homNay()].styles, 2);
	assert.deepEqual([data.store.skills.style.n, data.store.skills.style.c], [2, 1]);
	assert.deepEqual([data.store.skills.texture.n, data.store.skills.texture.c], [1, 0]);
	if (!coCu) return;
	// cùng chuỗi thao tác qua progress.js cũ cho ra cùng dữ liệu
	const kho2 = new Map();
	const ls = { getItem: (k) => kho2.get(k) ?? null, setItem: (k, v) => kho2.set(k, String(v)) };
	const w = {};
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, 'progress.js'), 'utf8'), { window: w, localStorage: ls, document: { dispatchEvent() {} }, CustomEvent: class {} });
	w.OZProgress.skill('style', false);
	w.OZProgress.record('styles', 1);
	w.OZProgress.skill('style', true);
	w.OZProgress.record('styles', 1);
	w.OZProgress.skill('texture', false);
	assert.deepEqual(data, JSON.parse(kho2.get('opus-zero:v1')));
});

test('thứ tự các đoạn: mỗi vòng đủ mười đoạn, hết vòng thì trộn lại', () => {
	const tiep = boThuTu(dayNgauNhien(7));
	const vong = (n) => Array.from({ length: n }, tiep);
	const a = vong(10);
	const b = vong(10);
	assert.deepEqual([...a].sort(), Object.keys(VI_DU).sort());
	assert.deepEqual([...b].sort(), Object.keys(VI_DU).sort());
	assert.notDeepEqual(a, b);
});

test('bản build: trang nhận diện có đủ công cụ, không còn ô "chưa chuyển"', (t) => {
	const f = (x) => path.join(ROOT, 'dist', x, 'index.html');
	if (!fs.existsSync(f('nhan-dien/luyen-nghe'))) return t.skip('chưa có trang trong dist/: chạy npm run build:xem');
	const ln = fs.readFileSync(f('nhan-dien/luyen-nghe'), 'utf8');
	assert.match(ln, /data-cong-cu="style-trainer"/);
	assert.match(ln, /data-cong-cu="texture-trainer"/);
	assert.match(ln, /class="oz-nguon-am"/);
	assert.doesNotMatch(ln, /oz-chua-co/);
	const ss = fs.readFileSync(f('nhan-dien/so-sanh-thoi-ky'), 'utf8');
	assert.equal((ss.match(/<div class="oz-vd-phong-cach"/g) ?? []).length, 10);
	assert.doesNotMatch(ss, /oz-chua-co/);
});
