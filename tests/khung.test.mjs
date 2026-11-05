// Kiểm thử khung site (D1.1) trên bản đã build trong dist/: chạy sau `npm run build`.
// Kiểm: địa chỉ dưới /opus/ và dạng thư mục, tiếng Việt, trang chủ tạm, font tự host, mọi tài nguyên nội bộ có thật,
// phiên bản gói ghim chính xác, Node trong .nvmrc đủ yêu cầu của Astro. Link giữa các trang và anchor: D1.5.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://mtuann.github.io';
const BASE = '/opus/';
const NOTICE = 'Opus đang được làm lại; từng phần sẽ lên sau khi được kiểm tra lại từ đầu.';

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		return e.isDirectory() ? walk(p) : [p];
	});
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
	throw new Error('Chưa có dist/index.html: chạy `npm run build` trước `npm test`.');
}
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const cssFiles = files.filter((f) => f.endsWith('.css'));
const rel = (f) => path.relative(DIST, f);

/** Đường dẫn trên site (/opus/…) thành file trong dist/, hoặc null nếu không thuộc site. */
function distFile(url) {
	const clean = decodeURI(url.split(/[?#]/)[0]);
	if (!clean.startsWith(BASE)) return null;
	const p = path.join(DIST, clean.slice(BASE.length));
	return clean.endsWith('/') ? path.join(p, 'index.html') : p;
}

/** Tài nguyên trang nạp: src của script, img, source; href của link (stylesheet, preload, icon…). */
function assetRefs(html) {
	const refs = [...html.matchAll(/<(?:script|img|source|iframe|audio|video)\b[^>]*?\ssrc="([^"]+)"/g)].map((m) => m[1]);
	for (const m of html.matchAll(/<link\b[^>]*>/g)) {
		const rel = /\srel="([^"]+)"/.exec(m[0])?.[1] ?? '';
		const href = /\shref="([^"]+)"/.exec(m[0])?.[1];
		// canonical là địa chỉ đầy đủ của trang, không phải tài nguyên
		if (href && rel !== 'canonical') refs.push(href);
	}
	return refs;
}
const cssUrls = (css) => [...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((m) => m[1]).filter((u) => !u.startsWith('data:'));

test('trang chủ tạm: tiếng Việt, câu thông báo của kế hoạch, thẻ cho điện thoại và máy tìm kiếm', () => {
	const html = read(path.join(DIST, 'index.html'));
	assert.match(html, /<html lang="vi"/);
	assert.ok(html.includes(NOTICE), 'thiếu câu thông báo trang chủ tạm (plans/lam-lai/README.md, D1.1)');
	assert.match(html, /<title>Opus<\/title>/);
	assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"\/?>/);
	assert.match(html, /<meta name="description" content="[^"]+"/);
	assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}${BASE}"/?>`));
});

test('hộp tìm kiếm nói tiếng Việt (src/content/i18n/vi.json), không còn chữ tiếng Anh của Pagefind', () => {
	const html = read(path.join(DIST, 'index.html'));
	const raw = /<site-search[^>]*\sdata-translations="([^"]+)"/.exec(html)?.[1];
	assert.ok(raw, 'không thấy data-translations của hộp tìm kiếm');
	const t = JSON.parse(raw.replaceAll('&quot;', '"').replaceAll('&amp;', '&'));
	for (const key of ['zero_results', 'one_result', 'many_results', 'load_more', 'clear_search']) {
		assert.ok(t[key], `thiếu chữ ${key}`);
		assert.doesNotMatch(t[key], /\b(results?|Clear|Load more)\b/, `${key} còn tiếng Anh: ${t[key]}`);
	}
});

test('mọi trang dạng thư mục (…/index.html), có trang 404.html cho GitHub Pages', () => {
	assert.ok(fs.existsSync(path.join(DIST, '404.html')));
	// sách in (D7-L3) là file /opus/sach/<id>.html như site cũ, không phải trang của Starlight
	const odd = htmlFiles.map(rel).filter((f) => f !== '404.html' && path.basename(f) !== 'index.html' && !/^sach\/[a-z0-9-]+\.html$/.test(f));
	assert.deepEqual(odd, [], 'trang không theo dạng thư mục');
});

test('sitemap chỉ có địa chỉ dưới https://mtuann.github.io/opus/, kết thúc bằng /', () => {
	const sitemaps = files.filter((f) => /sitemap-\d+\.xml$/.test(f));
	assert.ok(sitemaps.length > 0, 'không có sitemap');
	const locs = sitemaps.flatMap((f) => [...read(f).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
	assert.ok(locs.includes(SITE + BASE), 'sitemap thiếu trang chủ');
	for (const loc of locs) {
		assert.ok(loc.startsWith(SITE + BASE) && loc.endsWith('/'), `địa chỉ lạ trong sitemap: ${loc}`);
	}
});

test('mọi đường dẫn nội bộ có base /opus/ và mọi tài nguyên nạp đều có trong dist/', () => {
	const problems = [];
	for (const f of htmlFiles) {
		const html = read(f);
		for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
			if (!m[1].startsWith(BASE)) problems.push(`${rel(f)}: thiếu base: ${m[1]}`);
		}
		for (const ref of assetRefs(html)) {
			const target = distFile(ref);
			if (ref.startsWith('/') && (!target || !fs.existsSync(target))) problems.push(`${rel(f)}: không có tài nguyên ${ref}`);
		}
	}
	for (const f of cssFiles) {
		for (const u of cssUrls(read(f))) {
			const target = distFile(u);
			if (u.startsWith('/') && (!target || !fs.existsSync(target))) problems.push(`${rel(f)}: không có ${u}`);
		}
	}
	assert.deepEqual(problems, []);
});

test('font tự host: không gọi Google Fonts, mọi font khai báo đều có, không thừa file, có giấy phép OFL', () => {
	for (const f of [...htmlFiles, ...cssFiles]) {
		assert.doesNotMatch(read(f), /fonts\.(googleapis|gstatic)\.com/, `${rel(f)} gọi Google Fonts`);
	}
	const used = new Set(cssFiles.flatMap((f) => cssUrls(read(f))).filter((u) => u.endsWith('.woff2')).map((u) => path.basename(u)));
	const shipped = fs.readdirSync(path.join(ROOT, 'public', 'fonts')).filter((f) => f.endsWith('.woff2'));
	assert.ok(used.size > 0, 'CSS không khai báo font nào');
	assert.deepEqual([...used].sort(), shipped.sort(), 'font trong public/fonts/ khác font khai báo trong CSS');
	for (const lic of ['OFL-BeVietnamPro.txt', 'OFL-Literata.txt']) {
		assert.ok(fs.existsSync(path.join(DIST, 'fonts', lic)), `thiếu ${lic}`);
	}
	const html = read(path.join(DIST, 'index.html'));
	const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+\.woff2)"/g)].map((m) => path.basename(m[1]));
	assert.ok(preloads.length > 0 && preloads.every((p) => used.has(p)), `font nạp trước không khớp CSS: ${preloads}`);
});

test('script và stylesheet chỉ từ site, không từ nguồn ngoài', () => {
	for (const f of htmlFiles) {
		const html = read(f);
		const external = [
			...[...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]),
			...[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map((m) => /href="([^"]+)"/.exec(m[0])?.[1] ?? ''),
		].filter((u) => !u.startsWith(BASE));
		assert.deepEqual(external, [], `${rel(f)} nạp tài nguyên ngoài site`);
	}
});

test('phiên bản gói ghim chính xác trong package.json, khớp package-lock.json', () => {
	const pkg = readJson(path.join(ROOT, 'package.json'));
	const lock = readJson(path.join(ROOT, 'package-lock.json'));
	const deps = { ...pkg.dependencies, ...pkg.devDependencies };
	for (const [name, version] of Object.entries(deps)) {
		assert.match(version, /^\d+\.\d+\.\d+$/, `${name}: "${version}" không phải phiên bản chính xác`);
		assert.equal(lock.packages[`node_modules/${name}`]?.version, version, `${name}: package-lock.json khác package.json`);
	}
});

test('Node trong .nvmrc và Node đang chạy đủ yêu cầu của Astro', () => {
	const parse = (v) => v.replace(/^[^\d]*/, '').split('.').map(Number);
	const atLeast = (have, need) => {
		for (let i = 0; i < need.length; i++) {
			if ((have[i] ?? 0) !== need[i]) return (have[i] ?? 0) > need[i];
		}
		return true;
	};
	const engine = readJson(path.join(ROOT, 'node_modules', 'astro', 'package.json')).engines.node;
	const need = parse(/>=\s*([\d.]+)/.exec(engine)[1]);
	const nvmrc = read(path.join(ROOT, '.nvmrc')).trim();
	assert.match(nvmrc, /^\d+$/, '.nvmrc ghi số phiên bản chính, ví dụ 24');
	// .nvmrc chỉ ghi số chính (lấy bản vá mới nhất), nên phải lớn hơn hẳn số chính tối thiểu, hoặc bằng nếu yêu cầu là x.0.0
	assert.ok(Number(nvmrc) > need[0] || (Number(nvmrc) === need[0] && need[1] === 0 && need[2] === 0), `.nvmrc ${nvmrc} không đủ ${engine}`);
	assert.ok(atLeast(parse(process.versions.node), need), `Node ${process.versions.node} không đủ ${engine}`);
});

test('không link tới repo trên GitHub khi repo còn riêng tư (người đọc mở ra trang 404; chủ repo bỏ tạm ngày 24/10/2026)', () => {
	// Repo công khai thì thêm lại biểu tượng GitHub (astro.config.mjs) và link MIT (src/components/Footer.astro), bỏ kiểm thử này.
	const DIST = path.join(path.resolve(import.meta.dirname, '..'), 'dist');
	const co = fs
		.readdirSync(DIST, { recursive: true })
		.filter((f) => f.endsWith('.html'))
		.filter((f) => /href="https:\/\/github\.com\/mtuann\/opus(?![\w-])/i.test(fs.readFileSync(path.join(DIST, f), 'utf8')));
	assert.deepEqual(co, []);
});
