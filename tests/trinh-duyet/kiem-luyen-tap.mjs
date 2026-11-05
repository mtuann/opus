// Công cụ Luyện tập của lô D7-L1 chạy đúng trên ba trình duyệt: đọc nốt (nút, phím chữ, đàn MIDI), chép giai điệu, tra gam
// và hợp âm, chọn âm thanh, sao lưu (tải về, chọn file, gộp), so cao độ và hát lại (micro), chơi theo, ô MIDI và bàn phím nhận
// nốt từ đàn. Đàn MIDI giả bằng navigator.requestMIDIAccess (như ../opus-zero/tests/browser.mjs); micro giả bằng
// getUserMedia (gắn lên MediaDevices.prototype) trả về sóng sin có tần số biết trước (window.__ozTanSo), hay từ chối (window.__ozTuChoi). Lưu ở opus-zero:v1
// như site cũ. Trang lấy thẳng từ bản build; bản build không có trang thì bỏ qua. Chờ điều kiện, không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRINH_DUYET, dongHoAmChay, dongMayChu, goc, nguCanh } from './chung.mjs';

after(dongMayChu);

const coTrang = (t, lop) => {
	const f = path.join(DIST, t, 'index.html');
	return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`class="${lop} `);
};
const bo = (t, lop) => !coTrang(t, lop) && `bản build không có trang ${t}`;

/** Đàn MIDI giả: một đầu vào "Đàn thử"; window.__ozBam(m) gửi nốt bật. */
const GIA_MIDI = () => {
	const vao = { name: 'Đàn thử', onmidimessage: null };
	navigator.requestMIDIAccess = () => Promise.resolve({ inputs: new Map([['1', vao]]), onstatechange: null });
	window.__ozBam = (m) => vao.onmidimessage?.({ data: [0x90, m, 100] });
};
/**
 * Micro giả: sóng sin ở window.__ozTanSo Hz (0: im lặng); __ozTuChoi thì từ chối; __ozCho: số ms chờ trước khi mở (như lúc
 * người dùng đang được hỏi quyền); __ozMicMo, __ozMicTat đếm số luồng đã mở và số lần dừng luồng. Audio Session của Safari
 * giả khi trình duyệt không có (navigator.audioSession.type).
 */
const GIA_MICRO = () => {
	window.__ozTanSo = 440;
	window.__ozMicTat = 0;
	window.__ozMicMo = 0;
	if (!navigator.audioSession) Object.defineProperty(navigator, 'audioSession', { value: { type: 'auto' } });
	// gắn lên prototype: WebKit có lúc thay đối tượng navigator.mediaDevices, thuộc tính gắn vào đối tượng cũ thì mất
	const gia = async () => {
		if (window.__ozCho) await new Promise((ok) => setTimeout(ok, window.__ozCho));
		if (window.__ozTuChoi) throw new DOMException('không cho', 'NotAllowedError');
		window.__ozMicMo++;
		const AC = window.AudioContext || window.webkitAudioContext;
		const c = new AC();
		await c.resume?.();
		const o = c.createOscillator();
		const g = c.createGain();
		const dich = c.createMediaStreamDestination();
		o.connect(g).connect(dich);
		o.start();
		const dat = () => {
			o.frequency.value = window.__ozTanSo || 440;
			g.gain.value = window.__ozTanSo ? 0.5 : 0;
		};
		dat();
		setInterval(dat, 50);
		return dich.stream;
	};
	// đếm lần dừng luồng ở prototype (WebKit trả về đối tượng track khác nhau mỗi lần getTracks)
	const dung = MediaStreamTrack.prototype.stop;
	MediaStreamTrack.prototype.stop = function () {
		window.__ozMicTat++;
		return dung.call(this);
	};
	if (window.MediaDevices) MediaDevices.prototype.getUserMedia = gia;
	else Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: gia } });
};

async function moTrang(ctx, trang, chon, { midi = true, micro = false } = {}) {
	const p = await ctx.newPage();
	if (midi) await p.addInitScript(GIA_MIDI);
	if (micro) await p.addInitScript(GIA_MICRO);
	const loi = [];
	p.on('pageerror', (e) => loi.push(String(e)));
	p.on('console', (m) => m.type() === 'error' && loi.push(`console: ${m.text()}`));
	await p.goto((await goc()) + trang, { waitUntil: 'load' });
	const el = p.locator(chon).first();
	await el.scrollIntoViewIfNeeded();
	await p.waitForFunction((c) => document.querySelector(c)?.dataset.san, chon, { timeout: 20000 });
	return { p, el, loi };
}
const kho = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('opus-zero:v1') || 'null'));
const coAm = (p) => p.evaluate(() => !!(window.AudioContext || window.webkitAudioContext));

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: đọc nốt ở 360 px: chạm sai thì "Chưa đúng", chạm đúng thì "Đúng" và lưu như site cũ; phím chữ và đàn MIDI trả lời được`, { skip: bo('luyen-tap/doc-not/', 'oz-doc-not') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/doc-not/', '.oz-doc-not');
			await el.locator('[data-k="tieng"]').uncheck();
			// đáp án đúng: đọc từ thống kê sau khi trả lời sai (bản ghi noteStats "<khóa>:<bậc>")
			const chu = async () => {
				const s = await kho(p);
				const k = Object.keys(s?.store?.noteStats ?? {}).pop();
				return k ? ((Number(k.split(':')[1]) % 7) + 7) % 7 : null;
			};
			await el.locator('.oz-answers button').first().tap();
			let dung = await chu();
			if ((await el.locator('.oz-feedback').textContent()).startsWith('Đúng')) dung = 0;
			else {
				assert.match(await el.locator('.oz-feedback').textContent(), /^Chưa đúng\. Đếm dòng và khe/);
				assert.equal(await el.locator('.oz-answers button').first().getAttribute('aria-disabled'), 'true');
				await el.locator(`.oz-answers button[data-i="${dung}"]`).tap();
			}
			assert.match(await el.locator('.oz-feedback').textContent(), /^Đúng\. Đây là /);
			const s = await kho(p);
			assert.equal(s.store.skills.notes.n, 1);
			assert.equal(Object.values(s.days)[0].notes, 1);
			// nốt kế (sau 0,9 giây): phím chữ trên bàn phím máy tính
			await p.waitForFunction(() => !document.querySelector('.oz-doc-not .oz-feedback').textContent, null, { timeout: 5000 });
			const nhan = await el.locator('.oz-doc-not-khuong svg').getAttribute('aria-label');
			assert.equal(nhan, 'Một nốt nhạc trên khuông khóa Sol');
			await el.locator('.oz-doc-not-khuong').focus();
			await p.keyboard.press('KeyC');
			assert.match(await el.locator('.oz-feedback').textContent(), /^(Đúng|Chưa đúng)/);
			// đàn MIDI: ô kết nối trên trang, rồi bấm phím đen thì nhắc
			await p.locator('.oz-midi [data-act="noi"]').tap();
			await p.waitForFunction(() => document.querySelector('.oz-midi')?.dataset.trangThai === 'da-noi', null, { timeout: 5000 });
			assert.equal(await p.locator('.oz-midi-chu').textContent(), 'Đã kết nối: Đàn thử.');
			await p.waitForFunction(() => !document.querySelector('.oz-doc-not .oz-feedback.ok'), null, { timeout: 5000 });
			await p.evaluate(() => window.__ozBam(61));
			assert.match(await el.locator('.oz-feedback').textContent(), /^(Phím đen: nốt trên khuông là một nốt tự nhiên|Đúng)/);
			assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, 'trang tràn ngang');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: chép giai điệu: câu mới, nhập đủ nốt bằng phím và đàn MIDI, kiểm tra thì có kết quả từng nốt và hình so sánh, lưu kỹ năng`, { skip: bo('luyen-tap/chep-giai-dieu/', 'oz-chep') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/chep-giai-dieu/', '.oz-chep');
			await el.locator('[data-act="moi"]').click();
			assert.equal(await el.locator('.oz-feedback').textContent(), 'Nghe, rồi nhập 4 nốt.');
			await el.locator('[data-act="kiem"]').click();
			assert.equal(await el.locator('.oz-feedback').textContent(), 'Còn thiếu 4 nốt.');
			await el.locator('.oz-midi [data-act="noi"]').click();
			await p.waitForFunction(() => document.querySelector('.oz-chep .oz-midi')?.dataset.trangThai === 'da-noi', null, { timeout: 5000 });
			for (const m of [60, 62]) await p.evaluate((x) => window.__ozBam(x), m);
			// bấm gần đáy phím trắng (phần trên có phím đen đè lên)
			for (const m of [64, 60]) {
				const phim = el.locator(`.oz-phim-trang[data-m="${m}"]`);
				const r = await phim.boundingBox();
				await phim.click({ position: { x: r.width / 2, y: r.height - 8 } });
			}
			assert.equal(await el.locator('.oz-chep-nhap').textContent(), 'Đã nhập 4/4: Đô – Rê – Mi – Đô');
			await el.locator('[data-act="kiem"]').click();
			assert.match(await el.locator('.oz-feedback').textContent(), /^(Hoàn toàn chính xác! |Đúng \d\/4 nốt\. )✓ Đô/);
			assert.equal(await el.locator('.oz-chep-hinh svg.oz-ss').count(), 1);
			assert.equal((await kho(p)).store.skills.dictation.n, 1);
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: tra gam và hợp âm: đổi nốt gốc và loại thì tô đúng phím và đổi dòng tên; phím đàn MIDI sáng lên trên bàn phím`, { skip: bo('luyen-tap/ban-phim/', 'oz-tra-phim') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/ban-phim/', '.oz-tra-phim');
			assert.equal(await el.locator('svg.oz-phim .to').count(), 8, 'gam Đô trưởng');
			await el.locator('[data-k="goc"]').selectOption('Bb');
			await el.locator('[data-k="loai"]').selectOption('c:dom7');
			assert.match(await el.locator('.oz-tra-phim-ten').textContent(), /^Hợp âm bảy át Si♭ \(B♭7\): Si♭ B♭ – Rê D – Fa F – La♭ A♭$/);
			assert.deepEqual(await el.locator('svg.oz-phim .to').evaluateAll((xs) => xs.map((x) => Number(x.dataset.m)).sort((a, b) => a - b)), [58, 62, 65, 68]);
			await p.locator('.oz-midi [data-act="noi"]').click();
			await p.waitForFunction(() => document.querySelector('.oz-midi')?.dataset.trangThai === 'da-noi', null, { timeout: 5000 });
			await p.evaluate(() => window.__ozBam(64));
			assert.equal(await el.locator('.oz-phim-ten').textContent(), 'Mi (E4) (đàn MIDI)');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: chọn âm thanh và sao lưu: lựa chọn lưu ở opus-zero:sound; tải file sao lưu, chọn lại chính file ấy thì "không có gì mới", file của site cũ thì xem trước rồi gộp`, { skip: bo('luyen-tap/du-lieu/', 'oz-sao-luu') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/du-lieu/', '.oz-sao-luu');
			await p.evaluate(() => localStorage.setItem('opus-zero:v1', JSON.stringify({ days: { '2026-10-01': { notes: 3, tasks: {}, note: '' } }, store: {} })));
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-sao-luu')?.dataset.san, null, { timeout: 20000 });
			await p.waitForFunction(() => /^1 ngày có luyện tập/.test(document.querySelector('.oz-sao-luu-tom-tat li')?.textContent), null, { timeout: 5000 });
			const [tai] = await Promise.all([p.waitForEvent('download'), el.locator('[data-act="xuat"]').click()]);
			assert.match(tai.suggestedFilename(), /^opus-\d{4}-\d\d-\d\d\.json$/);
			const file = await tai.path();
			const ra = JSON.parse(fs.readFileSync(file, 'utf8'));
			assert.equal(ra.format, 'opus-zero-backup');
			assert.equal(ra.version, 2);
			assert.equal(ra.progress.days['2026-10-01'].notes, 3);
			await el.locator('[data-k="file"]').setInputFiles(file);
			await p.waitForFunction(() => !document.querySelector('.oz-sao-luu-xem').hidden, null, { timeout: 5000 });
			assert.match(await el.locator('.oz-sao-luu-xem').textContent(), /File này không có gì mới so với dữ liệu trên máy/);
			// file của site cũ: thêm một ngày và một bài
			const cu = { format: 'opus-zero-backup', version: 2, exported: '2026-10-20T08:00:00Z', progress: { days: { '2026-10-02': { notes: 5, tasks: {}, note: 'Tập gam Sol' } }, store: { lessons: { '/opus-zero/nhac-ly/01-cao-do-ten-not/': '2026-10-02' } } }, settings: { sound: 'synth' }, recordings: [] };
			await el.locator('[data-k="file"]').setInputFiles({ name: 'opus-zero-2026-10-20.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(cu)) });
			await p.waitForFunction(() => document.querySelector('.oz-sao-luu-xem [data-act="gop"]'), null, { timeout: 5000 });
			assert.deepEqual(await el.locator('.oz-sao-luu-xem li').allTextContents(), ['thêm 1 ngày luyện tập', 'thêm 1 bài đã học']);
			await el.locator('.oz-sao-luu-xem [data-act="gop"]').click();
			await p.waitForFunction(() => document.querySelector('.oz-sao-luu .oz-feedback').textContent === 'Đã gộp xong.', null, { timeout: 5000 });
			const s = await kho(p);
			assert.deepEqual(Object.keys(s.days).sort(), ['2026-10-01', '2026-10-02']);
			assert.equal(await p.evaluate(() => localStorage.getItem('opus-zero:sound')), 'synth', 'lựa chọn âm thanh của file (máy chưa chọn)');
			// file sai
			await el.locator('[data-k="file"]').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"a":1}') });
			await p.waitForFunction(() => /Không nhận ra định dạng file/.test(document.querySelector('.oz-sao-luu .oz-feedback').textContent), null, { timeout: 5000 });
			// xóa tiến độ (hộp xác nhận)
			p.once('dialog', (d) => d.accept());
			await el.locator('[data-act="xoa-tien-do"]').click();
			assert.equal(await p.evaluate(() => localStorage.getItem('opus-zero:v1')), null);
			assert.deepEqual(loi, []);
			// chọn âm thanh ở trang Tổng quan
			const { el: am } = await moTrang(ctx, 'luyen-tap/', '.oz-chon-am');
			await am.locator('input[value="piano"]').check();
			assert.equal(await am.page().evaluate(() => localStorage.getItem('opus-zero:sound')), 'piano');
			assert.match(await am.locator('.oz-chon-am-chu').textContent(), /^(Mẫu âm piano|Đã tải \d+ mẫu âm piano)/);
			await am.locator('input[value="synth"]').check();
			assert.equal(await am.locator('.oz-chon-am-chu').textContent(), 'Đang dùng âm tổng hợp.');
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: so cao độ và hát lại qua micro (giả): 440 Hz là "La A4"; hát đúng nốt thì "Đúng!"; mỗi lúc một công cụ nghe; micro bị từ chối thì báo`, { skip: bo('luyen-tap/hat-lai/', 'oz-so-cao-do') }, async (t) => {
		const trinhDuyet = await loai.launch();
		try {
			if (!(await dongHoAmChay(trinhDuyet))) return t.skip('đồng hồ âm thanh không chạy (máy không có thiết bị âm thanh)');
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, loi } = await moTrang(ctx, 'luyen-tap/hat-lai/', '.oz-so-cao-do', { micro: true });
			if (!(await coAm(p))) return t.skip('trình duyệt không có Web Audio');
			const may = p.locator('.oz-so-cao-do');
			await may.locator('[data-act="mic"]').tap();
			await p.waitForFunction(() => document.querySelector('.oz-so-cao-do-not').textContent === 'La A4', null, { timeout: 8000 });
			assert.equal(await may.locator('[data-act="mic"]').textContent(), 'Tắt micro');
			await p.waitForFunction(() => document.querySelector('.oz-so-cao-do-cent').textContent === 'Đúng cao độ', null, { timeout: 8000 });
			// hát lại: công cụ kia thôi nghe
			const hat = p.locator('.oz-hat-lai');
			await hat.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-hat-lai')?.dataset.san, null, { timeout: 20000 });
			await hat.locator('[data-act="moi"]').tap();
			await hat.locator('[data-act="hat"]').tap();
			await p.waitForFunction(() => /^Đang nghe… hãy ngân nốt /.test(document.querySelector('.oz-hat-lai .oz-feedback').textContent), null, { timeout: 8000 });
			assert.equal(await may.locator('[data-act="mic"]').textContent(), 'Bật micro', 'so cao độ thôi nghe');
			const tenNot = /ngân nốt (.+)\.$/.exec(await hat.locator('.oz-feedback').textContent())[1];
			const pc = ['Đô', 'Đô♯', 'Rê', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'Si♭', 'Si'].indexOf(tenNot);
			await p.evaluate((m) => (window.__ozTanSo = 440 * 2 ** ((m - 69) / 12)), 60 + pc);
			await p.waitForFunction(() => /^(Đúng!|Cao hơn|Thấp hơn|Site chưa nghe rõ)/.test(document.querySelector('.oz-hat-lai .oz-feedback').textContent), null, { timeout: 10000 });
			assert.match(await hat.locator('.oz-feedback').textContent(), /^Đúng! Lệch [+-]?\d+ cent\.$/);
			assert.equal(await hat.locator('.oz-hat-lai-hinh svg.oz-ss').count(), 1);
			assert.equal((await kho(p)).store.skills.sing.n, 1);
			assert.ok((await p.evaluate(() => window.__ozMicTat)) >= 1, 'luồng micro được dừng');
			// bị từ chối
			await p.evaluate(() => (window.__ozTuChoi = true));
			await may.locator('[data-act="mic"]').tap();
			await p.waitForFunction(() => /^Không mở được micro/.test(document.querySelector('.oz-so-cao-do-cent').textContent), null, { timeout: 5000 });
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: micro: bấm hai lần trong lúc chờ cho phép chỉ mở một lần, tắt thì dừng mọi luồng; rời trang hay đổi công cụ trong lúc chờ thì luồng vừa mở được đóng; Audio Session về playback`, { skip: bo('luyen-tap/hat-lai/', 'oz-so-cao-do') }, async (t) => {
		const trinhDuyet = await loai.launch();
		try {
			if (!(await dongHoAmChay(trinhDuyet))) return t.skip('đồng hồ âm thanh không chạy (máy không có thiết bị âm thanh)');
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, loi } = await moTrang(ctx, 'luyen-tap/hat-lai/', '.oz-so-cao-do', { micro: true });
			if (!(await coAm(p))) return t.skip('trình duyệt không có Web Audio');
			const nut = p.locator('.oz-so-cao-do [data-act="mic"]');
			const so = () => p.evaluate(() => [window.__ozMicMo, window.__ozMicTat]);
			// bấm hai lần khi micro chưa mở
			await p.evaluate(() => (window.__ozCho = 400));
			await nut.click();
			await nut.click();
			await p.waitForFunction(() => document.querySelector('.oz-so-cao-do-not').textContent === 'La A4', null, { timeout: 8000 });
			assert.equal(await p.evaluate(() => navigator.audioSession.type), 'play-and-record');
			await nut.click();
			assert.equal(await nut.textContent(), 'Bật micro');
			const [mo, tat] = await so();
			assert.equal(mo, 1, 'chỉ mở một luồng');
			assert.equal(tat, mo, 'dừng mọi luồng đã mở');
			assert.equal(await p.evaluate(() => navigator.audioSession.type), 'playback');
			// rời trang trong lúc chờ: luồng mở sau đó được dừng ngay
			await nut.click();
			await p.evaluate(() => dispatchEvent(new Event('pagehide')));
			await p.waitForFunction(() => window.__ozMicMo === 2 && window.__ozMicTat === 2, null, { timeout: 5000 });
			assert.equal(await p.evaluate(() => navigator.audioSession.type), 'playback');
			// đổi công cụ trong lúc chờ: hát lại nhận micro, so cao độ không giữ luồng nào
			await nut.click();
			const hat = p.locator('.oz-hat-lai');
			await hat.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-hat-lai')?.dataset.san, null, { timeout: 20000 });
			await hat.locator('[data-act="moi"]').click();
			await hat.locator('[data-act="hat"]').click();
			await p.waitForFunction(() => /^Đang nghe… hãy ngân nốt /.test(document.querySelector('.oz-hat-lai .oz-feedback').textContent), null, { timeout: 8000 });
			await p.waitForFunction(() => /^(Đúng!|Cao hơn|Thấp hơn|Site chưa nghe rõ)/.test(document.querySelector('.oz-hat-lai .oz-feedback').textContent), null, { timeout: 10000 });
			const [mo2, tat2] = await so();
			assert.equal(tat2, mo2, `mọi luồng đã dừng (${mo2} mở, ${tat2} dừng)`);
			assert.equal(await p.evaluate(() => navigator.audioSession.type), 'playback');
			assert.equal(await nut.textContent(), 'Bật micro');
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: chơi theo: khuông vẽ bằng abcjs; chọn đàn MIDI thì hiện ô kết nối; bắt đầu rồi dừng thì chấm từng nốt (thiếu hết khi im lặng)`, { skip: bo('luyen-tap/choi-theo/', 'oz-choi-theo') }, async (t) => {
		const trinhDuyet = await loai.launch();
		try {
			if (!(await dongHoAmChay(trinhDuyet))) return t.skip('đồng hồ âm thanh không chạy (máy không có thiết bị âm thanh)');
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/choi-theo/', '.oz-choi-theo', { micro: true });
			if (!(await coAm(p))) return t.skip('trình duyệt không có Web Audio');
			await p.waitForFunction(() => document.querySelector('.oz-choi-theo-khuong svg'), null, { timeout: 15000 });
			await el.locator('[data-k="bai"]').selectOption('scale');
			assert.equal(await el.locator('.oz-choi-theo-midi').isHidden(), true);
			await el.locator('[data-k="nguon"]').selectOption('midi');
			assert.equal(await el.locator('.oz-choi-theo-midi').isVisible(), true);
			await el.locator('[data-k="nguon"]').selectOption('mic');
			await p.evaluate(() => (window.__ozTanSo = 0));
			await el.locator('[data-act="bat-dau"]').click();
			await p.waitForFunction(() => document.querySelector('.oz-choi-theo .oz-feedback').textContent === '1 – 2 – 3 – 4… chơi!', null, { timeout: 8000 });
			await el.locator('[data-act="dung"]').click();
			assert.match(await el.locator('.oz-feedback').textContent(), /^Đúng 0\/8 nốt \(0%\)\. Site nghe được rất ít/);
			assert.equal(await el.locator('.oz-kq-thieu').count(), 8);
			assert.equal(await el.locator('.oz-choi-theo-kq svg.oz-ss').count(), 1);
			assert.equal((await kho(p)).store.skills.play.n, 1);
			assert.deepEqual(loi, []);
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: ô MIDI khi trình duyệt không có Web MIDI: báo và khóa nút; đã cho phép thì lần sau tự kết nối lại`, { skip: bo('luyen-tap/ket-noi-midi/', 'oz-midi') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: false });
			const p0 = await ctx.newPage();
			await p0.addInitScript(() => {
				delete Navigator.prototype.requestMIDIAccess;
				delete navigator.requestMIDIAccess;
			});
			await p0.goto((await goc()) + 'luyen-tap/ket-noi-midi/', { waitUntil: 'load' });
			await p0.waitForFunction(() => document.querySelector('.oz-midi')?.dataset.san, null, { timeout: 20000 });
			assert.equal(await p0.locator('.oz-midi').getAttribute('data-trang-thai'), 'khong-ho-tro');
			assert.match(await p0.locator('.oz-midi-chu').textContent(), /^Trình duyệt này không có MIDI trên web/);
			assert.equal(await p0.locator('.oz-midi [data-act="noi"]').isDisabled(), true);
			await p0.close();
			const { p } = await moTrang(ctx, 'luyen-tap/ket-noi-midi/', '.oz-midi');
			await p.locator('.oz-midi [data-act="noi"]').tap();
			await p.waitForFunction(() => document.querySelector('.oz-midi').dataset.trangThai === 'da-noi', null, { timeout: 5000 });
			assert.equal(await p.evaluate(() => localStorage.getItem('opus-zero:midi-auto')), '1');
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-midi')?.dataset.trangThai === 'da-noi', null, { timeout: 10000 });
			await ctx.close();
		} finally {
			await trinhDuyet.close();
		}
	});
}
