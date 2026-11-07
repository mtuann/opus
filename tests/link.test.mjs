// Kiểm thử link (D1.5): link tới trang chưa có trong bản build thành chữ "sắp có" (src/plugins/sap-co.mjs), và chữ ấy
// trỏ tới một trang trong kế hoạch mà bản build chưa có; mọi link nội bộ trong bản build (cả link tương đối) tới trang,
// file và #mục có thật; trang 404 bằng tiếng Việt, dẫn về trang chủ và ô tìm kiếm.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { parse } from 'yaml';
import { laFile, trangCuaDiaChi } from '../src/ban-build.mjs';
import { sapCo } from '../src/plugins/sap-co.mjs';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE = '/opus/';

test('địa chỉ trên site ra trang trong bản build: trang thường, trang mục lục, trang chủ; file và link ngoài thì không', () => {
	const trang = ['index', 'nhac-ly/index', 'nhac-ly/10-hop-am-ba'];
	assert.equal(trangCuaDiaChi('/opus/nhac-ly/10-hop-am-ba/#hop-am-truong', BASE, trang), 'nhac-ly/10-hop-am-ba');
	assert.equal(trangCuaDiaChi('/opus/nhac-ly/', BASE, trang), 'nhac-ly/index');
	assert.equal(trangCuaDiaChi('/opus/', BASE, trang), 'index');
	assert.equal(trangCuaDiaChi('/opus/piano/gam/', BASE, trang), undefined);
	assert.equal(trangCuaDiaChi('/opus/audio/NGUON.txt', BASE, trang), undefined);
	assert.equal(trangCuaDiaChi('https://imslp.org/', BASE, trang), undefined);
	// dấu chấm trong #mục hay trong tên trang không làm địa chỉ thành file
	assert.equal(trangCuaDiaChi('/opus/nhac-ly/10-hop-am-ba/#muc.1', BASE, trang), 'nhac-ly/10-hop-am-ba');
	assert.equal(trangCuaDiaChi('/opus/piano/op.27/', BASE, [...trang, 'piano/op.27']), 'piano/op.27');
	assert.deepEqual(['/opus/audio/NGUON.txt', '/opus/a.mp3?v=1', '/opus/x/#a.1', '/opus/piano/op.27/'].map(laFile), [true, true, false, false]);
});

test('link tới trang chưa có trong bản build thành chữ thường kèm nhãn "sắp có"; link khác giữ nguyên', () => {
	const plugin = sapCo({ base: BASE, trangCo: () => ['index', 'nhac-ly/10-hop-am-ba'] });
	const md = [
		'[Hợp âm ba](/opus/nhac-ly/10-hop-am-ba/#hop-am-truong)',
		'[Gam *trưởng*](/opus/piano/gam/#a)',
		'[Trang chủ](/opus/)',
		'[IMSLP](https://imslp.org/)',
		'[Nguồn bản thu](/opus/audio/NGUON.txt)',
		'[Mục](#muc)',
	].join(' · ');
	const html = markdownToHtml(md, { hastPlugins: [plugin] }).html;
	assert.match(html, /<a href="\/opus\/nhac-ly\/10-hop-am-ba\/#hop-am-truong">Hợp âm ba<\/a>/);
	assert.match(html, /<span class="oz-sap-co" data-href="\/opus\/piano\/gam\/#a" title="[^"]+">Gam <em>trưởng<\/em> <span class="oz-sap-co-nhan" data-pagefind-ignore[^>]*>sắp có<\/span><\/span>/);
	assert.doesNotMatch(html, /<a [^>]*href="\/opus\/piano\/gam\//, 'không còn thẻ <a> tới trang chưa có');
	for (const giu of ['href="/opus/"', 'href="https://imslp.org/"', 'href="/opus/audio/NGUON.txt"', 'href="#muc"']) assert.ok(html.includes(giu), giu);
});

test('link trong HTML thô (do chỉ thị dựng từ dữ liệu, hay viết trong trang) cũng thành "sắp có"', () => {
	const plugin = sapCo({ base: BASE, trangCo: () => ['index', 'nhac-ly/10-hop-am-ba'] });
	const html = markdownToHtml(
		'<p class="x"><a href="/opus/piano/gam/"><em>Gam</em> trưởng</a>, <a href="/opus/nhac-ly/10-hop-am-ba/#a">Hợp âm ba</a>, <a class="y" href="/opus/audio/NGUON.txt">nguồn</a></p>',
		{ hastPlugins: [plugin] },
	).html;
	assert.match(html, /<span class="oz-sap-co" data-href="\/opus\/piano\/gam\/" title="[^"]+"><em>Gam<\/em> trưởng <span class="oz-sap-co-nhan" data-pagefind-ignore>sắp có<\/span><\/span>/);
	assert.match(html, /<a href="\/opus\/nhac-ly\/10-hop-am-ba\/#a">Hợp âm ba<\/a>/);
	assert.match(html, /<a class="y" href="\/opus\/audio\/NGUON.txt">nguồn<\/a>/);
	// qua chỉ thị thật: ::hoc-tiep trỏ tới trang chặng (chưa có) và trang cùng tác phẩm
	const docs = path.join(ROOT, 'src/content/docs');
	const md = opusMarkdown({ base: BASE, docsDir: docs })({ fileURL: pathToFileURL(path.join(docs, 'nghe-nhac/liszt-liebestraum.md')) });
	const hocTiep = markdownToHtml('---\ntitle: T\ntac_pham: liszt-liebestraum\n---\n\n::hoc-tiep\n', {
		mdastPlugins: [md],
		hastPlugins: [sapCo({ base: BASE, trangCo: () => ['index'] })],
		features: { directive: true, smartPunctuation: false },
	}).html;
	assert.match(hocTiep, /<strong>Bài học:<\/strong> <span class="oz-sap-co"/);
	assert.doesNotMatch(hocTiep, /<a /);
});

const trangDist = () => {
	if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('Chưa có dist/: chạy `npm run build` trước `npm test`.');
	return fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html'));
};

/** Địa chỉ trên site của một file trong dist/: "nhac-ly/x/index.html" thành "/opus/nhac-ly/x/", "404.html" thành "/opus/404.html". */
const diaChiCua = (f) => BASE + f.replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '$1');

test('mọi link nội bộ trong nội dung các trang của bản build (cả link tương đối) tới trang, file và #mục có thật', () => {
	const id = new Map();
	const idCua = (f) => {
		if (!id.has(f)) id.set(f, new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
		return id.get(f);
	};
	const hong = [];
	for (const f of trangDist()) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		const noiDung = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
		for (const [, goc] of noiDung.matchAll(/\shref="([^"]+)"/g)) {
			const href = goc.replaceAll('&amp;', '&');
			if (href.startsWith('#')) {
				if (href.length > 1 && !idCua(path.join(DIST, f)).has(decodeURIComponent(href.slice(1)))) hong.push(`${f}: không có ${href}`);
				continue;
			}
			// link ra ngoài (https:, mailto:, //máy khác) bỏ qua; link tương đối tính theo địa chỉ của trang
			if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
			const url = new URL(href, 'http://x' + diaChiCua(f));
			if (!url.pathname.startsWith(BASE)) {
				hong.push(`${f}: ${href} ra ngoài site`);
				continue;
			}
			const p = url.pathname;
			const muc = url.hash.slice(1);
			const dich = path.join(DIST, decodeURI(p).slice(BASE.length), p.endsWith('/') ? 'index.html' : '');
			if (!fs.existsSync(dich)) hong.push(`${f}: không có ${p.endsWith('/') ? 'trang' : 'file'} ${href}`);
			else if (muc && !idCua(dich).has(decodeURIComponent(muc))) hong.push(`${f}: ${href} không có #${muc}`);
		}
	}
	assert.deepEqual(hong, []);
});

/** Trang trong kế hoạch: mọi trang của src/data/trang.yml, cộng 7 trang chặng sinh từ cap-do.yml (đợt 2). */
const trangKeHoach = () => {
	const doc = (f) => parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));
	return new Set([...doc('trang.yml').map((t) => t.id), ...doc('cap-do.yml').map((c) => `piano/lo-trinh/chang-${c.id}`)]);
};

test('chữ "sắp có" trỏ tới một trang trong kế hoạch mà bản build chưa có (bắt link gõ sai, trang bị bỏ sót khỏi bản build)', () => {
	const keHoach = trangKeHoach();
	const hong = [];
	for (const f of trangDist()) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		for (const [the] of html.matchAll(/<span class="oz-sap-co"[^>]*>/g)) {
			const href = /\sdata-href="([^"]*)"/.exec(the)?.[1]?.replaceAll('&amp;', '&');
			if (!href) {
				hong.push(`${f}: "sắp có" không có data-href`);
				continue;
			}
			const p = decodeURI(new URL(href, 'http://x').pathname.slice(BASE.length)).replace(/\/$/, '');
			if (fs.existsSync(path.join(DIST, p, 'index.html'))) hong.push(`${f}: ${href} có trong bản build mà vẫn hiện "sắp có"`);
			else if (![p || 'index', `${p}/index`].some((t) => keHoach.has(t))) hong.push(`${f}: ${href} không phải trang nào trong kế hoạch (gõ sai?)`);
		}
	}
	assert.deepEqual(hong, []);
});

test('trang 404 không có trong menu, nên không trang nào link tới nó (nút "Trước", "Tiếp" theo menu)', () => {
	const fm = parse(/^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(path.join(ROOT, 'src/content/docs/404.md'), 'utf8'))[1]);
	assert.equal(fm.sidebar?.hidden, true, 'src/content/docs/404.md cần sidebar: { hidden: true }');
	const co = trangDist().filter((f) => fs.readFileSync(path.join(DIST, f), 'utf8').includes(`href="${BASE}404/"`));
	assert.deepEqual(co, []);
});

test('trang 404 bằng tiếng Việt, dẫn về trang chủ và mở ô tìm kiếm', () => {
	trangDist();
	const html = fs.readFileSync(path.join(DIST, '404.html'), 'utf8');
	assert.match(html, /<title>Không thấy trang \| Opus<\/title>/);
	// đợt 9: hết câu "đang được làm lại"; trang chỉ cách tìm trang cũ (đổi /opus-zero/ thành /opus/)
	assert.match(html, /Trang bạn tìm không có trên Opus/);
	assert.doesNotMatch(html, /đang được làm lại/);
	assert.match(html, /<a [^>]*href="\/opus\/"[^>]*>\s*Về trang chủ/);
	assert.match(html, /<a [^>]*href="#tim-trang-khac"[^>]*data-mo-tim-kiem/);
	assert.doesNotMatch(html, /rel="(prev|next)"/, 'trang 404 không có link "Trước", "Tiếp"');
	assert.match(html, /id="tim-trang-khac"/);
	assert.doesNotMatch(html, /Page not found|This page/);
});
