// Kiểm thử dùng khi mất mạng và cài như ứng dụng (D7-L3, src/ung-dung/): danh sách tệp, phiên bản (đổi khi nội dung đổi),
// tệp lưu sẵn, mã service worker; trên dist/: sw.js khớp bản build, manifest và icon, mọi trang có thẻ manifest và script
// đăng ký. Trang tắt mạng mở lại được: tests/trinh-duyet/kiem-ung-dung.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { MAY_NGOAI, TIEN_TO, danhSachTep, ghiSw, maSw, phienBan, scriptDangKy, tepLuuSan } from '../src/ung-dung/ung-dung.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

function distGia() {
	const d = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-sw-'));
	const ghi = (f, c) => (fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true }), fs.writeFileSync(path.join(d, f), c));
	ghi('index.html', '<link rel="stylesheet" href="/opus/_astro/a.css"><script src="/opus/_astro/b.js"></script><link rel="preload" href="/opus/fonts/f.woff2"><a href="/opus/nhac-ly/">x</a><img src="/opus/_astro/thieu.svg">');
	ghi('_astro/a.css', 'a{}');
	ghi('_astro/b.js', '1');
	ghi('fonts/f.woff2', 'f');
	ghi('nhac-ly/index.html', 'n');
	ghi('manifest.webmanifest', '{}');
	ghi('sw.js', 'cũ');
	return { d, ghi };
}

test('danhSachTep, phienBan: mọi tệp trừ sw.js, theo thứ tự; phiên bản đổi khi nội dung hay danh sách đổi', () => {
	const { d, ghi } = distGia();
	assert.deepEqual(danhSachTep(d), ['_astro/a.css', '_astro/b.js', 'fonts/f.woff2', 'index.html', 'manifest.webmanifest', 'nhac-ly/index.html']);
	const v1 = phienBan(d);
	assert.match(v1, /^[0-9a-f]{12}$/);
	ghi('sw.js', 'khác');
	assert.equal(phienBan(d), v1, 'sw.js không tính');
	ghi('nhac-ly/index.html', 'n2');
	const v2 = phienBan(d);
	assert.notEqual(v2, v1);
	ghi('them.txt', '');
	assert.notEqual(phienBan(d), v2);
	fs.rmSync(d, { recursive: true });
});

test('tepLuuSan: trang chủ, CSS, JavaScript và font của trang chủ, manifest; bỏ tệp không có trong dist', () => {
	const { d } = distGia();
	assert.deepEqual(tepLuuSan(d), ['/opus/', '/opus/_astro/a.css', '/opus/_astro/b.js', '/opus/fonts/f.woff2', '/opus/manifest.webmanifest']);
	fs.rmSync(d, { recursive: true });
});

/** Chạy mã sw.js trong vm với self, caches, fetch giả; trả về các hàm xử lý sự kiện. */
function chaySw(ma, { mang = true } = {}) {
	const kho = new Map();
	const cache = (ten) => {
		if (!kho.has(ten)) kho.set(ten, new Map());
		const m = kho.get(ten);
		return {
			addAll: async (ds) => ds.forEach((u) => m.set(u, `lưu sẵn ${u}`)),
			put: async (r, res) => m.set(r.url ?? r, res.body),
			match: async (r) => {
				const u = new URL(r.url ?? r, 'https://mtuann.github.io').pathname;
				const v = m.get(u) ?? m.get(r.url ?? r);
				return v === undefined ? undefined : { body: v, tuCache: true };
			},
		};
	};
	const nghe = {};
	const ctx = {
		self: { addEventListener: (t, f) => (nghe[t] = f), location: { origin: 'https://mtuann.github.io' }, skipWaiting: () => {}, clients: { claim: async () => {} } },
		caches: { open: async (t) => cache(t), keys: async () => [...kho.keys()], delete: async (k) => kho.delete(k) },
		fetch: async (r) => {
			if (!mang) throw new TypeError('mất mạng');
			return { ok: true, body: `mạng ${r.url}`, clone() { return this; } };
		},
		URL,
		Promise,
	};
	ctx.addEventListener = ctx.self.addEventListener;
	vm.runInNewContext(ma, ctx);
	return { nghe, kho, ctx };
}
const yeuCau = (url, { mode = 'no-cors', accept = '', destination = '', range = false } = {}) => ({
	url,
	method: 'GET',
	mode,
	destination,
	headers: { get: (k) => (k === 'accept' ? accept : null), has: (k) => k === 'range' && range },
});
async function goi(nghe, r) {
	let tra;
	const cho = [];
	nghe.fetch({ request: r, respondWith: (p) => (tra = p), waitUntil: (p) => cho.push(p) });
	return tra === undefined ? undefined : await tra;
}

test('maSw: cài thì lưu sẵn; kích hoạt thì chỉ xóa bộ nhớ đệm cũ của site này; trang lấy mạng trước, mất mạng thì bản đã lưu', async () => {
	const ma = maSw({ phien: 'abc', luuSan: ['/opus/', '/opus/_astro/a.css'] });
	const { nghe, kho } = chaySw(ma);
	let cho;
	nghe.install({ waitUntil: (p) => (cho = p) });
	await cho;
	assert.deepEqual([...kho.get(`${TIEN_TO}abc`).keys()], ['/opus/', '/opus/_astro/a.css']);
	kho.set(`${TIEN_TO}cu`, new Map());
	kho.set('opus-zero-v19', new Map());
	nghe.activate({ waitUntil: (p) => (cho = p) });
	await cho;
	assert.deepEqual([...kho.keys()].sort(), [`${TIEN_TO}abc`, 'opus-zero-v19'], 'không xóa bộ nhớ đệm của site cũ cùng tên miền');
	const trang = yeuCau('https://mtuann.github.io/opus/nhac-ly/', { mode: 'navigate' });
	assert.equal((await goi(nghe, trang)).body, 'mạng https://mtuann.github.io/opus/nhac-ly/');
	// âm thanh, Range, máy khác, ngoài /opus/: không xử lý
	assert.equal(await goi(nghe, yeuCau('https://mtuann.github.io/opus/audio/a.mp3', { destination: 'audio' })), undefined);
	assert.equal(await goi(nghe, yeuCau('https://mtuann.github.io/opus/mau-am/piano/A4.mp3', { range: true })), undefined);
	assert.equal(await goi(nghe, yeuCau('https://www.youtube.com/x')), undefined);
	assert.equal(await goi(nghe, yeuCau('https://mtuann.github.io/opus-zero/')), undefined);
	// soundfont của abcjs: lưu khi đã tải
	const sf = yeuCau(`${MAY_NGOAI[0]}abcjs/acoustic_grand_piano-mp3/C4.mp3`);
	assert.match((await goi(nghe, sf)).body, /^mạng /);
	await new Promise((ok) => setTimeout(ok, 0));
	assert.ok(kho.get(`${TIEN_TO}abc`).has(sf.url));
});

test('maSw: mất mạng thì trang đã xem và tệp đã lưu vẫn mở; trang chưa xem thì trang chủ đã lưu', async () => {
	const { nghe, kho, ctx } = chaySw(maSw({ phien: 'v', luuSan: ['/opus/'] }));
	const c = new Map([
		['/opus/', 'trang chủ'],
		['https://mtuann.github.io/opus/gam/', 'trang gam'],
		['https://mtuann.github.io/opus/_astro/a.css', 'css'],
	]);
	kho.set(`${TIEN_TO}v`, c);
	ctx.fetch = async () => {
		throw new TypeError('mất mạng');
	};
	assert.equal((await goi(nghe, yeuCau('https://mtuann.github.io/opus/gam/', { mode: 'navigate' }))).body, 'trang gam');
	assert.equal((await goi(nghe, yeuCau('https://mtuann.github.io/opus/chua-xem/', { accept: 'text/html' }))).body, 'trang chủ');
	assert.equal((await goi(nghe, yeuCau('https://mtuann.github.io/opus/_astro/a.css'))).body, 'css');
	await assert.rejects(goi(nghe, yeuCau('https://mtuann.github.io/opus/_astro/khong.js')));
});

test('scriptDangKy: chỉ đăng ký khi có service worker và ngữ cảnh an toàn, phạm vi /opus/', () => {
	const chay = ({ an, coSw = true }) => {
		const dk = [];
		const nav = coSw ? { serviceWorker: { register: (u, o) => (dk.push([u, o.scope]), Promise.resolve()) } } : {};
		const tai = [];
		vm.runInNewContext(scriptDangKy(), { navigator: nav, isSecureContext: an, addEventListener: (t, f) => tai.push(f) });
		tai.forEach((f) => f());
		return dk;
	};
	assert.deepEqual(chay({ an: true }), [['/opus/sw.js', '/opus/']]);
	assert.deepEqual(chay({ an: false }), []);
	assert.deepEqual(chay({ an: true, coSw: false }), []);
});

const coDist = fs.existsSync(path.join(DIST, 'sw.js'));

test('dist/sw.js: phiên bản khớp các tệp của bản build, tệp lưu sẵn có thật', { skip: !coDist && 'chưa build (không có dist/sw.js)' }, () => {
	const ma = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
	assert.equal(/const PHIEN = "([^"]+)"/.exec(ma)?.[1], TIEN_TO + phienBan(DIST));
	const luu = JSON.parse(/const LUU_SAN = (\[.*\]);/.exec(ma)[1]);
	assert.ok(luu.includes('/opus/') && luu.some((u) => u.endsWith('.css')), 'lưu sẵn trang chủ và CSS');
	for (const u of luu) assert.ok(u === '/opus/' || fs.existsSync(path.join(DIST, decodeURI(u.slice('/opus/'.length)))), u);
	assert.equal(ma, maSw({ phien: phienBan(DIST), luuSan: luu }));
	assert.ok(danhSachTep(DIST).includes('sach/nhac-ly-co-ban.html'), 'phiên bản tính cả sách in');
});

test('dist/: manifest (tên Opus, icon 192, 512, maskable có thật); mọi trang có thẻ manifest và script đăng ký', { skip: !coDist && 'chưa build' }, () => {
	const m = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.webmanifest'), 'utf8'));
	assert.equal(m.short_name, 'Opus');
	assert.match(m.name, /^Opus\b/);
	assert.equal(m.start_url, './');
	assert.equal(m.scope, './');
	assert.deepEqual(m.icons.map((i) => [i.sizes, i.purpose ?? 'any']), [['192x192', 'any'], ['512x512', 'any'], ['512x512', 'maskable']]);
	for (const i of m.icons) assert.ok(fs.existsSync(path.join(DIST, i.src)), i.src);
	const trang = fs.readdirSync(DIST, { recursive: true }).filter((f) => /(^|\/)index\.html$|^404\.html$/.test(f) && !f.startsWith('pagefind'));
	assert.ok(trang.length > 10);
	for (const f of trang) {
		const h = fs.readFileSync(path.join(DIST, f), 'utf8');
		assert.match(h, /<link rel="manifest" href="\/opus\/manifest\.webmanifest"\/?>/, f);
		assert.ok(h.includes(scriptDangKy()), f);
	}
});

test('ghiSw: ghi sw.js vào thư mục build', () => {
	const { d } = distGia();
	const { phien, luuSan } = ghiSw(d);
	assert.equal(fs.readFileSync(path.join(d, 'sw.js'), 'utf8'), maSw({ phien, luuSan }));
	fs.rmSync(d, { recursive: true });
});
