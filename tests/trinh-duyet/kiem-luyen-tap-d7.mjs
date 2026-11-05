// Công cụ Luyện tập của lô D7-L2 chạy đúng trên ba trình duyệt: xây gam và hợp âm (phím, đàn MIDI), phiếu bài tập và giấy kẻ
// khuông (đổi đề, đáp án, in riêng: chỉ Chromium kiểm bản PDF), thu âm (micro giả, MediaRecorder, IndexedDB, so sánh, xóa),
// tiết tấu (gõ bằng phím cách), thị tấu một bè (chấm bằng đàn MIDI giả, micro bị từ chối), thị tấu hai tay (tự chấm, nhớ
// cấp), nhật ký (chuỗi ngày, bản đồ, việc, ghi chú), bảng năng lực, biểu đồ tiến bộ. Đàn MIDI giả và micro giả như
// kiem-luyen-tap.mjs. Lưu ở opus-zero:v1 như site cũ. Trang lấy từ bản build; không có thì bỏ qua. Chờ điều kiện, không chờ cố định.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DIST, TRINH_DUYET, dongMayChu, goc, khongChromium, nguCanh } from './chung.mjs';

after(dongMayChu);

const coTrang = (t, lop) => {
	const f = path.join(DIST, t, 'index.html');
	return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`class="${lop} `);
};
const bo = (t, lop) => !coTrang(t, lop) && `bản build không có trang ${t}`;

const GIA_MIDI = () => {
	const vao = { name: 'Đàn thử', onmidimessage: null };
	navigator.requestMIDIAccess = () => Promise.resolve({ inputs: new Map([['1', vao]]), onstatechange: null });
	window.__ozBam = (m) => vao.onmidimessage?.({ data: [0x90, m, 100] });
};
/** Micro giả: sóng sin 440 Hz; __ozTuChoi thì từ chối; __ozMicMo, __ozMicTat đếm luồng mở và lần dừng (như kiem-luyen-tap.mjs). */
const GIA_MICRO = () => {
	window.__ozMicTat = 0;
	window.__ozMicMo = 0;
	if (!navigator.audioSession) Object.defineProperty(navigator, 'audioSession', { value: { type: 'auto' } });
	const gia = async () => {
		if (window.__ozCho) await new Promise((ok) => setTimeout(ok, window.__ozCho));
		if (window.__ozTuChoi) throw new DOMException('không cho', 'NotAllowedError');
		window.__ozMicMo++;
		const AC = window.AudioContext || window.webkitAudioContext;
		const c = new AC();
		await c.resume?.();
		const o = c.createOscillator();
		const dich = c.createMediaStreamDestination();
		o.connect(dich);
		o.start();
		return dich.stream;
	};
	const dung = MediaStreamTrack.prototype.stop;
	MediaStreamTrack.prototype.stop = function () {
		window.__ozMicTat++;
		return dung.call(this);
	};
	if (window.MediaDevices) MediaDevices.prototype.getUserMedia = gia;
	else Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: gia } });
};
/** Số ngẫu nhiên cố định (0): câu hỏi, đề, tiết tấu biết trước. */
const KHONG_NGAU_NHIEN = () => {
	Math.random = () => 0;
};

async function moTrang(ctx, trang, chon, { midi = false, micro = false, coDinh = false, truoc = null } = {}) {
	const p = await ctx.newPage();
	if (midi) await p.addInitScript(GIA_MIDI);
	if (micro) await p.addInitScript(GIA_MICRO);
	if (coDinh) await p.addInitScript(KHONG_NGAU_NHIEN);
	if (truoc) await p.addInitScript(truoc[0], truoc[1]);
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
const homNay = (s) => Object.values(s?.days ?? {})[0] ?? {};
const chu = (el, s) => el.locator(s).textContent();

for (const [ten, loai] of Object.entries(TRINH_DUYET)) {
	test(`${ten}: xây gam và hợp âm ở 360 px: chạm phím chọn, bỏ chọn; sai thì đếm thiếu thừa; đúng thì tên nốt và lưu "builds"; đàn MIDI chọn phím`, { skip: bo('luyen-tap/xay-hop-am/', 'oz-xay') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: true });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/xay-hop-am/', '.oz-xay', { midi: true, coDinh: true });
			assert.equal(await chu(el, '.oz-xay-cau'), 'Bấm các nốt của: Hợp âm trưởng Đô (C)');
			// phím trắng: chạm gần đáy (phím đen đè lên phần trên)
			const cham = async (m) => {
				const k = el.locator(`[data-m="${m}"]`);
				await k.scrollIntoViewIfNeeded();
				const b = await k.boundingBox();
				await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height - 8);
			};
			await cham(60);
			await cham(64);
			assert.equal(await el.locator('[data-m="64"]').getAttribute('aria-pressed'), 'true');
			await el.locator('[data-act="kiem"]').tap();
			assert.match(await chu(el, '.oz-feedback'), /^Chưa đúng: thiếu 1 nốt, thừa 0 nốt\./);
			await cham(62);
			await cham(62);
			assert.equal(await el.locator('[data-m="62"]').getAttribute('aria-pressed'), 'false', 'chạm lại thì bỏ chọn');
			// đàn MIDI: Sol2 đưa về khung (Sol4)
			await p.locator('.oz-midi [data-act="noi"]').tap();
			await p.waitForFunction(() => document.querySelector('.oz-midi')?.dataset.trangThai === 'da-noi', null, { timeout: 5000 });
			await p.evaluate(() => window.__ozBam(43));
			assert.equal(await el.locator('[data-m="67"]').getAttribute('aria-pressed'), 'true');
			await el.locator('[data-act="kiem"]').tap();
			assert.equal(await chu(el, '.oz-feedback'), 'Đúng: Đô – Mi – Sol.');
			assert.equal(await chu(el, '.oz-xay-so'), 'Lượt này: đúng ngay lần đầu 0/1.');
			assert.equal(homNay(await kho(p)).builds, 1);
			// câu khác: đáp án câu trước hiện khi chưa đúng
			await p.waitForFunction(() => !document.querySelector('.oz-xay .oz-feedback').textContent, null, { timeout: 5000 });
			await el.locator('[data-act="khac"]').tap();
			assert.equal(await chu(el, '.oz-feedback'), 'Đáp án câu trước: Đô – Mi – Sol.');
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: phiếu bài tập và giấy kẻ khuông: đổi loại đề (hóa biểu vẽ bằng SVG), hiện ẩn đáp án, đổi loại khuông; in riêng ẩn phần còn lại`, { skip: bo('luyen-tap/phieu-bai-tap/', 'oz-phieu') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/phieu-bai-tap/', '.oz-phieu');
			await p.waitForFunction(() => document.querySelector('.oz-phieu-khuong svg'), null, { timeout: 15000 });
			assert.match(await chu(el, '.oz-phieu-dap-an'), /^Đáp án: 1\. (Đô|Rê|Mi|Fa|Sol|La|Si); /);
			assert.ok(await el.locator('.oz-phieu-dap-an').isHidden());
			await el.locator('[data-act="dap-an"]').click();
			assert.ok(await el.locator('.oz-phieu-dap-an').isVisible());
			assert.equal(await el.locator('[data-act="dap-an"]').getAttribute('aria-expanded'), 'true');
			await el.locator('[data-k="loai"]').selectOption('keysigs');
			assert.equal(await el.locator('.oz-phieu-de .oz-hb').count(), 8);
			assert.equal(await chu(el, '.oz-phieu-ten'), 'Phiếu bài tập: Đọc hóa biểu');
			assert.match(await chu(el, '.oz-phieu-dap-an'), /^Đáp án: 1\. \S+ trưởng \/ \S+ thứ; /);
			const giay = p.locator('.oz-giay-khuong');
			await giay.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-giay-khuong')?.dataset.san, null, { timeout: 10000 });
			assert.equal(await giay.locator('.oz-giay-net path').count(), 50);
			await giay.locator('[data-k="loai"]').selectOption('grand');
			assert.equal(await giay.locator('.oz-giay-net path').count(), 60);
			// in riêng: lệnh in giả; trong lúc in chỉ tờ giấy hiện, đáp án ẩn
			await p.evaluate(() => {
				window.__ozIn = 0;
				window.print = () => window.__ozIn++;
			});
			await giay.locator('[data-act="in"]').click();
			assert.equal(await p.evaluate(() => window.__ozIn), 1);
			assert.ok(await p.evaluate(() => document.documentElement.classList.contains('oz-in-rieng') && document.querySelector('.oz-giay').classList.contains('oz-in-day')));
			await p.emulateMedia({ media: 'print' });
			assert.ok(await p.locator('.oz-giay-trang').isVisible());
			assert.ok(await p.locator('h1').isHidden(), 'tiêu đề trang không in');
			assert.ok(await el.locator('.oz-phieu-de').isHidden(), 'phiếu không in cùng tờ giấy');
			await p.evaluate(() => dispatchEvent(new Event('afterprint')));
			assert.ok(!(await p.evaluate(() => document.documentElement.classList.contains('oz-in-rieng'))));
			// in cả trang: đáp án đang hiện vẫn không in, các nút không in
			assert.ok(await p.locator('h1').isVisible());
			assert.ok(await el.locator('.oz-phieu-dap-an').isHidden());
			assert.ok(await el.locator('[data-act="in"]').isHidden());
			await p.emulateMedia({ media: 'screen' });
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: thu âm qua micro (giả): thu, dừng thì lưu (IndexedDB) và ghi số phút; hai bản thì so sánh; xóa; micro bị từ chối thì báo`, { skip: bo('luyen-tap/thu-am/', 'oz-thu-am') }, async (t) => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 768, h: 1024, camUng: true, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/thu-am/', '.oz-thu-am', { micro: true });
			if (await el.locator('[data-act="thu"]').isDisabled()) return t.skip('trình duyệt này không có MediaRecorder');
			const thu = async (ten) => {
				await el.locator('[data-k="ten"]').fill(ten);
				await el.locator('[data-act="thu"]').tap();
				await p.waitForFunction(() => /^Đang thu 0:0[1-9]/.test(document.querySelector('.oz-thu-am-gio').textContent), null, { timeout: 8000 });
				await el.locator('[data-act="thu"]').tap();
				await p.waitForFunction((t) => /^(Đã lưu “|Không lưu được)/.test(document.querySelector('.oz-thu-am .oz-feedback').textContent), ten, { timeout: 8000 });
			};
			await thu('Minuet, ô 1–8');
			// trình duyệt không cho lưu âm thanh vào IndexedDB (WebKit của Playwright, như Safari duyệt riêng tư): vẫn nghe và tải về được
			if ((await chu(el, '.oz-feedback')).startsWith('Không lưu được')) {
				assert.equal(await el.locator('.oz-thu-am-chua-luu audio').count(), 1);
				assert.match(await el.locator('.oz-thu-am-chua-luu a[download]').getAttribute('download'), /^Minuet_ ô 1_8\.(webm|m4a)$/);
				return t.skip('trình duyệt không lưu được Blob vào IndexedDB; đã kiểm phần nghe, tải về bản chưa lưu');
			}
			assert.match(await chu(el, '.oz-feedback'), /^Đã lưu “Minuet, ô 1–8”/);
			assert.equal(await el.locator('.oz-thu-am-ban').count(), 1);
			assert.equal(await el.locator('[data-act="thu"]').textContent(), '● Thu');
			assert.equal(homNay(await kho(p)).minutes, 1);
			assert.match(await el.locator('.oz-thu-am-ban a[download]').getAttribute('download'), /^Minuet_ ô 1_8\.(webm|m4a)$/);
			assert.ok((await p.evaluate(() => window.__ozMicTat)) >= 1, 'dừng thu thì đóng micro');
			await thu('Bản hai');
			assert.equal(await el.locator('.oz-thu-am-ban strong').first().textContent(), 'Bản hai', 'bản mới ở trên');
			for (const c of await el.locator('.oz-thu-am-ban input[type=checkbox]').all()) await c.check();
			assert.ok(await el.locator('.oz-thu-am-so').isVisible());
			assert.equal(await el.locator('.oz-thu-am-ab audio').count(), 2);
			p.on('dialog', (d) => d.accept());
			await el.locator('[data-xoa]').first().tap();
			await p.waitForFunction(() => document.querySelectorAll('.oz-thu-am-ban').length === 1, null, { timeout: 5000 });
			assert.ok(await el.locator('.oz-thu-am-so').isHidden());
			// bản thu còn sau khi tải lại trang
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelectorAll('.oz-thu-am-ban').length === 1, null, { timeout: 8000 });
			// bản thu có id không phải số (bản sao lưu bị sửa tay): không hiện, không chèn thuộc tính lạ
			await p.evaluate(
				() =>
					new Promise((ok, loi) => {
						const r = indexedDB.open('opus-zero-recordings', 1);
						r.onsuccess = () => {
							const tx = r.result.transaction('rec', 'readwrite');
							tx.objectStore('rec').put({ id: '1" data-la="x', label: 'Lạ', dur: 'x', blob: new Blob(['a'], { type: 'audio/webm' }) });
							tx.oncomplete = () => (r.result.close(), ok());
							tx.onerror = () => loi(tx.error);
						};
						r.onerror = () => loi(r.error);
					}),
			);
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelectorAll('.oz-thu-am-ban').length === 1, null, { timeout: 8000 });
			assert.equal(await el.locator('[data-la]').count(), 0);
			await p.evaluate(() => (window.__ozTuChoi = true));
			await el.locator('[data-act="thu"]').tap();
			await p.waitForFunction(() => /^Không mở được micro/.test(document.querySelector('.oz-thu-am .oz-feedback').textContent), null, { timeout: 5000 });
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: tiết tấu: khuông vẽ xong; gõ bằng phím cách sau đếm vào thì có kết quả, dải nhịp và lưu kỹ năng "rhythm"`, { skip: bo('luyen-tap/tiet-tau/', 'oz-tiet-tau') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/tiet-tau/', '.oz-tiet-tau', { coDinh: true });
			await p.waitForFunction(() => document.querySelector('.oz-tiet-tau-khuong svg'), null, { timeout: 15000 });
			await el.locator('[data-k="bpm"]').selectOption('108');
			await el.locator('[data-act="bat-dau"]').click();
			assert.equal(await chu(el, '.oz-feedback'), '1 – 2 – 3 – 4 … gõ!');
			assert.match(await el.locator('.oz-go').getAttribute('class'), /dang/);
			// bấm lại khi đang gõ thì bỏ qua; gõ ba lần
			await el.locator('[data-act="bat-dau"]').click();
			await el.locator('.oz-go').focus();
			for (let i = 0; i < 3; i++) await p.keyboard.press('Space');
			await p.waitForFunction(() => /^(Chính xác! )?Gõ trúng \d\/8 nốt/.test(document.querySelector('.oz-tiet-tau .oz-feedback').textContent), null, { timeout: 15000 });
			assert.ok(await el.locator('.oz-tiet-tau-hinh svg.oz-ss').isVisible());
			assert.match(await chu(el, '.oz-ss-chu-giai'), /đúng lúc.*sớm.*muộn.*thừa/);
			assert.equal((await kho(p)).store.skills.rhythm.n, 1);
			await el.locator('[data-act="moi"]').click();
			assert.equal(await el.locator('.oz-tiet-tau-hinh').innerHTML(), '');
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: thị tấu một bè: khuông vẽ xong; chấm bằng đàn MIDI (giả): có hàng kết quả từng nốt, piano roll, lưu "sight"; micro bị từ chối thì báo`, { skip: bo('luyen-tap/thi-tau/', 'oz-thi-tau') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: true });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/thi-tau/', '.oz-thi-tau', { midi: true, micro: true });
			await p.waitForFunction(() => document.querySelector('.oz-thi-tau-khuong svg'), null, { timeout: 15000 });
			assert.match(await el.locator('.oz-thi-tau-khuong').getAttribute('aria-label'), /Đô trưởng$/);
			await el.locator('[data-k="bpm"]').selectOption('100');
			await el.locator('[data-act="cham-midi"]').click();
			await p.waitForFunction(() => /bắt đầu!$/.test(document.querySelector('.oz-thi-tau .oz-feedback').textContent), null, { timeout: 5000 });
			assert.ok(await el.locator('[data-act="dung"]').isVisible());
			// bấm đàn giữa chừng: không chặn chấm
			await p.evaluate(() => window.__ozBam(60));
			await p.waitForFunction(() => /^Đúng \d+\/\d+ nốt/.test(document.querySelector('.oz-thi-tau .oz-feedback').textContent), null, { timeout: 25000 });
			const n = await el.locator('.oz-thi-tau-kq .oz-kq').count();
			assert.ok(n >= 6, `${n} nốt`);
			assert.ok(await el.locator('.oz-thi-tau-kq svg.oz-ss').isVisible());
			const s = await kho(p);
			assert.equal(s.store.skills.sight.n, 1);
			assert.equal(homNay(s).melodies, 1);
			await p.evaluate(() => (window.__ozTuChoi = true));
			await el.locator('[data-act="cham-mic"]').click();
			await p.waitForFunction(() => /^Không mở được micro/.test(document.querySelector('.oz-thi-tau .oz-feedback').textContent), null, { timeout: 5000 });
			// giai điệu mới: kết quả cũ xóa
			await el.locator('[data-act="moi"]').click();
			assert.equal(await el.locator('.oz-thi-tau-kq').innerHTML(), '');
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: thị tấu hai tay: khuông kép vẽ xong kèm trình phát; tự chấm lưu như site cũ; cấp đã chọn được nhớ`, { skip: bo('luyen-tap/thi-tau-hai-tay/', 'oz-thi-tau-hai-tay') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 360, h: 780, camUng: true, toi: false });
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/thi-tau-hai-tay/', '.oz-thi-tau-hai-tay', {
				truoc: [() => localStorage.setItem('opus-zero:v1', JSON.stringify({ days: {}, store: { pianoLevel: { stage: 3 } } })), null],
			});
			await p.waitForFunction(() => document.querySelector('.oz-thi-tau-hai-tay .abc-notation')?.dataset.rendered, null, { timeout: 15000 });
			assert.equal(await el.locator('[data-k="cap"]').inputValue(), '3', 'cấp theo chặng piano');
			assert.match(await chu(el, '.oz-tt2-thong-tin'), / · nhịp [34]\/4 · ♩ = 66$/);
			await el.locator('[data-r="good"]').tap();
			assert.equal(await chu(el, '.oz-feedback'), 'Tốt. Bấm Bài mới để đọc tiếp.');
			assert.equal(await el.locator('[data-r="bad"]').getAttribute('aria-disabled'), 'true');
			await el.locator('[data-r="bad"]').tap({ force: true });
			let s = await kho(p);
			assert.equal(s.store.sight2Hist.length, 1, 'chỉ chấm một lần mỗi bài');
			assert.equal(s.store.sight2Hist[0].r, 'good');
			assert.equal(s.store.skills.sight2.n, 1);
			assert.equal(homNay(s).readings, 1);
			assert.match(await chu(el, '.oz-tt2-so'), /^Hôm nay đã đọc 1 bài hai tay\. Trong 1 bài gần nhất: 1 bài trôi chảy\.$/);
			await el.locator('[data-k="cap"]').selectOption('1');
			await p.waitForFunction(() => /^Đô trưởng · nhịp 4\/4/.test(document.querySelector('.oz-tt2-thong-tin').textContent), null, { timeout: 5000 });
			s = await kho(p);
			assert.equal(s.store.sight2Level, 1);
			assert.equal(await el.locator('[data-r="good"]').getAttribute('aria-disabled'), null, 'bài mới chấm lại được');
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});

	test(`${ten}: nhật ký: chuỗi ngày, bản đồ 16 tuần, tự đánh dấu việc, đánh dấu và ghi chú lưu như site cũ; bảng năng lực, biểu đồ tiến bộ đọc dữ liệu`, { skip: bo('luyen-tap/nhat-ky/', 'oz-nhat-ky') }, async () => {
		const trinhDuyet = await loai.launch();
		try {
			const ctx = await nguCanh(trinhDuyet, ten, { w: 1280, h: 800, camUng: false, toi: true });
			const ghi = () => {
				const ngay = (n) => {
					const d = new Date();
					d.setDate(d.getDate() - n);
					return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
				};
				const days = { [ngay(0)]: { tasks: {}, note: '', notes: 12, intervals: 0, minutes: 0 }, [ngay(1)]: { piano: 1 }, [ngay(2)]: { piano: 1 } };
				const store = { skills: { notes: { n: 6, c: 5, ema: 0.83, last: ngay(0) } }, skillHist: { notes: { [ngay(0)]: [4, 3] } } };
				if (!localStorage.getItem('opus-zero:v1')) localStorage.setItem('opus-zero:v1', JSON.stringify({ days, store }));
			};
			const { p, el, loi } = await moTrang(ctx, 'luyen-tap/nhat-ky/', '.oz-nhat-ky', { truoc: [ghi, null] });
			assert.equal(await chu(el, '.oz-chuoi'), 'Chuỗi 3 ngày liên tiếp');
			assert.equal(await el.locator('.oz-ban-do').getAttribute('aria-label'), 'Đã luyện tập 3 ngày trong 16 tuần gần nhất');
			const o = await el.locator('.oz-ban-do span').count();
			assert.ok(o >= 106 && o <= 112, `${o} ô`);
			assert.equal(await el.locator('.oz-ban-do span.hom-nay').count(), 1);
			assert.equal(await chu(el, '.oz-nhat-ky-hom-nay'), 'Hôm nay: 12 nốt đọc đúng.');
			assert.ok(await el.locator('[data-viec="doc-not"]').isChecked(), 'đủ 10 nốt thì tự đánh dấu');
			await el.locator('[data-viec="dan"]').check();
			await el.locator('textarea').fill('Ô 13 tay trái còn hụt nhịp.');
			await p.waitForFunction(() => Object.values(JSON.parse(localStorage.getItem('opus-zero:v1')).days).some((d) => d.note === 'Ô 13 tay trái còn hụt nhịp.'), null, { timeout: 5000 });
			const d = homNay(await kho(p));
			assert.deepEqual(d.tasks, { 'doc-not': true, dan: true });
			// bảng năng lực, biểu đồ tiến bộ
			const nl = p.locator('.oz-nang-luc');
			await nl.scrollIntoViewIfNeeded();
			await p.waitForFunction(() => document.querySelector('.oz-nang-luc')?.dataset.san && document.querySelector('.oz-tien-bo')?.dataset.san, null, { timeout: 10000 });
			assert.match(await nl.locator('tbody tr').first().textContent(), /^Đọc nốt ?83%6hôm nay$/);
			assert.match(await p.locator('.oz-tien-bo').textContent(), /Đọc nốt · 4 lượt trong 12 tuần/);
			assert.ok(await p.locator('.oz-tien-bo svg.oz-ss').isVisible());
			// tải lại: ghi chú và việc còn đó
			await p.reload({ waitUntil: 'load' });
			await p.waitForFunction(() => document.querySelector('.oz-nhat-ky')?.dataset.san, null, { timeout: 10000 });
			assert.equal(await el.locator('textarea').inputValue(), 'Ô 13 tay trái còn hụt nhịp.');
			assert.ok(await el.locator('[data-viec="dan"]').isChecked());
			assert.deepEqual(loi, []);
		} finally {
			await trinhDuyet.close();
		}
	});
}

test('chromium: in riêng giấy kẻ khuông ra PDF: một trang, chỉ có tờ giấy', { skip: khongChromium || bo('luyen-tap/phieu-bai-tap/', 'oz-giay-khuong') }, async () => {
	const trinhDuyet = await TRINH_DUYET.chromium.launch();
	try {
		const ctx = await nguCanh(trinhDuyet, 'chromium', { w: 1280, h: 800, camUng: false, toi: true });
		const { p } = await moTrang(ctx, 'luyen-tap/phieu-bai-tap/', '.oz-giay-khuong');
		await p.evaluate(() => {
			document.documentElement.classList.add('oz-in-rieng');
			document.querySelector('.oz-giay').classList.add('oz-in-day');
		});
		const pdf = (await p.pdf({ format: 'A4' })).toString('latin1');
		assert.equal((pdf.match(/\/Type\s*\/Page[^s]/g) || []).length, 1, 'một trang');
		// phiếu bài tập in riêng cũng vừa một trang
		await p.evaluate(() => {
			document.querySelector('.oz-giay').classList.remove('oz-in-day');
			document.querySelector('.oz-phieu-to').classList.add('oz-in-day');
		});
		await p.waitForFunction(() => document.querySelector('.oz-phieu-khuong svg'), null, { timeout: 15000 });
		const pdf2 = (await p.pdf({ format: 'A4' })).toString('latin1');
		assert.equal((pdf2.match(/\/Type\s*\/Page[^s]/g) || []).length, 1, 'phiếu: một trang');
	} finally {
		await trinhDuyet.close();
	}
});
