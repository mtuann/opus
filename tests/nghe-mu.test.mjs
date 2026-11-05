// Kiểm thử thành phần của lô D8-L1: nghe mù (::cong-cu{ten="blind"}) và phiếu nghe mù (::cong-cu{ten="blind-log"}),
// src/scripts/nghe-mu.js. Dựng sẵn đúng (chữ thật, data-sinh, aria-live, audio preload="none" không tự phát), không nhận
// thông số; mười bản thu, chữ và cách lưu như phần mountBlind, mountLog của recognition.js và progress.js cũ ở
// ../opus-zero/ khi có.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canTaiScript } from '../src/plugins/thanh-phan.mjs';
import { BAN_THU, BIEN_CHE, CHU_NM, THOI_KY_NM, boThuTuBan, chamNgheMu, congDiem, dongPhieu, tomTatPhieu } from '../src/scripts/nghe-mu.js';
import { THOI_KY_ND } from '../src/scripts/nhan-dien.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const JS_CU = path.resolve(ROOT, '..', 'opus-zero', 'docs', 'assets', 'js');
const coCu = fs.existsSync(JS_CU);

function dung(md, trang = 'nhan-dien/nghe-mu') {
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

/** Dữ liệu của recognition.js cũ: PERIODS, ENSEMBLES, TRACKS (chạy file với DOM giả, đọc window.OZRecognition). */
function cu() {
	const src = fs.readFileSync(path.join(JS_CU, 'recognition.js'), 'utf8');
	const hang = (ten) => vm.runInNewContext(`(${new RegExp(`const ${ten} = (\\{[^}]*\\});`).exec(src)[1]})`);
	const window = { OZReady: () => {} };
	vm.runInNewContext(src, { window, document: { addEventListener() {} }, getComputedStyle: () => ({ getPropertyValue: () => '' }) });
	// JSON: đối tượng tạo trong ngữ cảnh vm khác nguyên mẫu, deepEqual coi là khác
	const j = (x) => JSON.parse(JSON.stringify(x));
	return { PERIODS: j(hang('PERIODS')), ENSEMBLES: j(hang('ENSEMBLES')), TRACKS: j(window.OZRecognition.TRACKS) };
}

test('dựng sẵn ô nghe mù: đếm bản, nút Nghe bản thu (trình phát chưa có nguồn), hai ô chọn, hai nút, phản hồi aria-live; không nhận thông số', () => {
	const h = dung('::cong-cu{ten="blind"}');
	assert.match(h, /^<div class="oz-nghe-mu oz-tool not-content" data-cong-cu="blind" data-sinh data-pagefind-ignore>/);
	assert.match(h, /<p class="oz-stats oz-nm-dem">Bản thu 1\/10\. Tên tác phẩm được ẩn cho đến khi bạn trả lời\.<\/p>/);
	// chưa gắn nguồn: không tải gì cho tới khi người học bấm "Nghe bản thu"
	assert.match(h, /<div class="oz-nm-phat"><button type="button" class="oz-btn" data-act="play"><span aria-hidden="true">▶ <\/span>Nghe bản thu<\/button><audio controls preload="none" class="oz-nm-audio" hidden><\/audio><\/div>/);
	assert.doesNotMatch(h, /<source/);
	assert.doesNotMatch(h, /autoplay/);
	assert.match(h, /<label>Thời kỳ <select data-k="period"><option value="">– chọn –<\/option><option value="baroque">Baroque<\/option>/);
	assert.match(h, /<label>Biên chế <select data-k="ens"><option value="">– chọn –<\/option><option value="solo">Một nhạc cụ \(có thể có đệm\)<\/option>/);
	assert.match(h, /<button type="button" class="oz-btn oz-btn--primary" data-act="check">Xem đáp án<\/button><button type="button" class="oz-btn" data-act="next">Bản khác<\/button>/);
	assert.match(h, /<p class="oz-feedback" aria-live="polite">Nghe ít nhất 60 giây, chọn thời kỳ và biên chế, rồi bấm “Xem đáp án”\.<\/p>/);
	assert.match(h, /<div class="oz-nm-dap-an" hidden><\/div>/);
	assert.match(h, /<noscript data-sinh>/);
	assert.ok(canTaiScript(h));
	assert.throws(() => dung('::cong-cu{ten="blind" so="3"}'), /không nhận thông số/);
});

test('dựng sẵn phiếu nghe mù: hai bước, ô nhập có nhãn thấy được, nút Lưu, phản hồi aria-live; không nhận thông số', () => {
	const h = dung('::cong-cu{ten="blind-log"}');
	assert.match(h, /^<div class="oz-phieu-nghe-mu oz-tool not-content" data-cong-cu="blind-log" data-sinh data-pagefind-ignore>/);
	assert.match(h, /Bước 1: trước khi biết tên tác phẩm, ghi dự đoán\./);
	assert.match(h, /Bước 2: sau khi biết đáp án, ghi tên thật và thời kỳ thật\./);
	assert.match(h, /<label class="oz-nm-o">Đoán tác giả \(nếu muốn\) <input class="oz-input" data-k="g-c" maxlength="60"/);
	assert.match(h, /<label class="oz-nm-o">Tên tác phẩm thật <input class="oz-input" data-k="a-t" maxlength="120"/);
	for (const k of ['g-p', 'g-e', 'a-p']) assert.match(h, new RegExp(`<select data-k="${k}"><option value="[a-z]+">`), k);
	assert.match(h, /data-act="save">Lưu<\/button>/);
	assert.match(h, /<p class="oz-feedback" aria-live="polite"><\/p><div class="oz-nm-bang"><\/div>/);
	assert.ok(canTaiScript(h));
	assert.throws(() => dung('::cong-cu{ten="blind-log" x="1"}'), /không nhận thông số/);
});

test('mười bản thu: đủ trường, thời kỳ và biên chế có thật, nguồn phát trên Wikimedia (mp3 trước, ogg sau), trang tệp trên Commons', () => {
	assert.equal(BAN_THU.length, 10);
	assert.deepEqual(THOI_KY_NM, THOI_KY_ND, 'cùng năm thời kỳ với đoán phong cách');
	assert.equal(new Set(BAN_THU.map((b) => b.id)).size, 10);
	for (const b of BAN_THU) {
		for (const k of ['ten', 'bieu_dien', 'dau_hieu']) assert.ok(b[k]?.trim(), `${b.id}.${k}`);
		assert.ok(THOI_KY_NM[b.thoi_ky], b.id);
		assert.ok(b.dung.includes(b.thoi_ky) && b.dung.every((p) => THOI_KY_NM[p]), b.id);
		assert.ok(BIEN_CHE[b.bien_che], b.id);
		assert.match(b.trang, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, b.id);
		assert.deepEqual(b.nguon.map((n) => n.type), ['audio/mpeg', 'audio/ogg'], b.id);
		for (const n of b.nguon) assert.match(n.src, /^https:\/\/(upload|commons)\.wikimedia\.org\//, b.id);
	}
	// thế kỷ 20 chưa có bản thu (ghi chú trên trang)
	assert.ok(!BAN_THU.some((b) => b.thoi_ky === 'modern'));
});

test('bản thu, thời kỳ, biên chế như recognition.js cũ (khác: người biểu diễn hai bản Mozart ghi theo trang tệp)', { skip: !coCu && 'không có ../opus-zero/' }, () => {
	const { PERIODS, ENSEMBLES, TRACKS } = cu();
	assert.deepEqual(THOI_KY_NM, PERIODS);
	assert.deepEqual(BIEN_CHE, ENSEMBLES);
	assert.deepEqual(
		BAN_THU.map((b) => ({ id: b.id, title: b.ten, period: b.thoi_ky, ok: b.dung, ensemble: b.bien_che, clue: b.dau_hieu, page: b.trang, sources: b.nguon })),
		TRACKS.map((t) => ({ id: t.id, title: t.title, period: t.period, ok: t.ok, ensemble: t.ensemble, clue: t.clue, page: t.page, sources: t.sources })),
	);
	const khacNguoi = BAN_THU.filter((b, i) => b.bieu_dien !== TRACKS[i].performer).map((b) => b.id);
	assert.ok(khacNguoi.every((id) => ['t6', 't7'].includes(id)), khacNguoi.join(', '));
});

test('chấm: thời kỳ đúng khi nằm trong dung (Debussy: Ấn tượng hay Lãng mạn), biên chế phải đúng', () => {
	const debussy = BAN_THU.find((b) => b.id === 't10');
	assert.deepEqual(chamNgheMu(debussy, 'romantic', 'solo'), { thoiKy: true, bienChe: true });
	assert.deepEqual(chamNgheMu(debussy, 'impressionist', 'chamber'), { thoiKy: true, bienChe: false });
	assert.deepEqual(chamNgheMu(debussy, 'classical', 'solo'), { thoiKy: false, bienChe: true });
	assert.equal(CHU_NM.ketQua(true, false), 'Thời kỳ: đúng. Biên chế: chưa đúng.');
	assert.equal(CHU_NM.diem({ right: 3, total: 5 }), 'Tổng cộng (mọi lần): đoán đúng thời kỳ 3/5.');
	assert.deepEqual(congDiem(null, true), { right: 1, total: 1 });
	assert.deepEqual(congDiem({ right: 1, total: 1 }, false), { right: 1, total: 2 });
});

test('phiếu: cắt độ dài như bản cũ, thiếu tên thì không lưu; tóm tắt đếm đoán đúng, 15 dòng mới trước; bỏ dòng hỏng', () => {
	assert.equal(dongPhieu({ t: '  ', gp: 'baroque', ap: 'baroque' }, '2026-11-05'), null);
	const d = dongPhieu({ t: ` ${'a'.repeat(200)} `, gp: 'romantic', ge: 'solo', gc: ` ${'b'.repeat(80)}`, ap: 'classical' }, '2026-11-05');
	assert.deepEqual(Object.keys(d), ['d', 't', 'gp', 'ge', 'gc', 'ap']);
	assert.equal(d.t.length, 120);
	assert.equal(d.gc.length, 60);
	const log = Array.from({ length: 20 }, (_, i) => ({ d: `2026-11-${String(i + 1).padStart(2, '0')}`, t: `Bài ${i}`, gp: 'baroque', ap: i % 2 ? 'baroque' : 'classical' }));
	const tt = tomTatPhieu([...log, null, 'x']);
	assert.equal(tt.so, 20);
	assert.equal(tt.dung, 10);
	assert.equal(tt.gan.length, 15);
	assert.equal(tt.gan[0].t, 'Bài 19');
	assert.deepEqual(tomTatPhieu(undefined), { so: 0, dung: 0, gan: [] });
	assert.equal(CHU_NM.tomTat(20, 10), 'Đã ghi 20 lần nghe mù; đoán đúng thời kỳ 10/20.');
});

test('thứ tự bản thu: mỗi vòng đủ mười bản, đếm 1–10, hết vòng thì trộn lại', () => {
	let x = 7;
	const r = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
	const tiep = boThuTuBan(10, r);
	const a = Array.from({ length: 10 }, tiep);
	const b = Array.from({ length: 10 }, tiep);
	assert.deepEqual(a.map((v) => v.so), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	assert.deepEqual([...a.map((v) => v.chiSo)].sort((p, q) => p - q), [...Array(10).keys()]);
	assert.deepEqual([...b.map((v) => v.chiSo)].sort((p, q) => p - q), [...Array(10).keys()]);
	assert.notDeepEqual(a.map((v) => v.chiSo), b.map((v) => v.chiSo));
});

test('lưu như site cũ: store.blind, store.blindLog, kỹ năng style, days[ngày].styles cùng định dạng với progress.js cũ', async (t) => {
	const kho = giaTrinhDuyet(t);
	const { KHOA, datKho, ghiNgay, homNay, kyNang, layKho } = await import('../src/scripts/tien-do.js');
	// xem đáp án hai bản (đúng, sai), rồi lưu một dòng phiếu
	for (const dungTk of [true, false]) {
		datKho('blind', congDiem(layKho('blind', null), dungTk));
		ghiNgay('styles', 1);
		kyNang('style', dungTk);
	}
	const muc = dongPhieu({ t: 'Mozart K. 331', gp: 'classical', ge: 'solo', gc: 'Mozart', ap: 'classical' }, homNay());
	datKho('blindLog', [...layKho('blindLog', []), muc]);
	ghiNgay('styles', 1);
	const data = JSON.parse(kho.get(KHOA));
	assert.deepEqual(data.store.blind, { right: 1, total: 2 });
	assert.deepEqual(data.store.blindLog, [muc]);
	assert.equal(data.days[homNay()].styles, 3);
	if (!coCu) return;
	const kho2 = new Map();
	const ls = { getItem: (k) => kho2.get(k) ?? null, setItem: (k, v) => kho2.set(k, String(v)) };
	const w = {};
	vm.runInNewContext(fs.readFileSync(path.join(JS_CU, 'progress.js'), 'utf8'), { window: w, localStorage: ls, document: { dispatchEvent() {} }, CustomEvent: class {} });
	const P = w.OZProgress;
	for (const dungTk of [true, false]) {
		const st = P.getStore('blind', { right: 0, total: 0 });
		st.total++;
		if (dungTk) st.right++;
		P.setStore('blind', st);
		P.record('styles', 1);
		P.skill('style', dungTk);
	}
	const log = P.getStore('blindLog', []);
	log.push({ d: P.today(), t: 'Mozart K. 331', gp: 'classical', ge: 'solo', gc: 'Mozart', ap: 'classical' });
	P.setStore('blindLog', log);
	P.record('styles', 1);
	const cuData = JSON.parse(kho2.get('opus-zero:v1'));
	assert.deepEqual(data, cuData);
});

test('bản build: trang Nghe mù có đủ hai công cụ, không còn ô "chưa chuyển"', (t) => {
	const f = path.join(ROOT, 'dist/nhan-dien/nghe-mu/index.html');
	if (!fs.existsSync(f)) return t.skip('chưa có bản build có trang nhan-dien/nghe-mu');
	const h = fs.readFileSync(f, 'utf8');
	assert.match(h, /class="oz-nghe-mu oz-tool/);
	assert.match(h, /class="oz-phieu-nghe-mu oz-tool/);
	assert.doesNotMatch(h, /class="oz-chua-co/);
});
