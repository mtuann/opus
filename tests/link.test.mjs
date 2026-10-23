// Kiểm thử link (D1.5): link tới trang chưa có trong bản build thành chữ "sắp có" (src/plugins/sap-co.mjs); mọi link
// nội bộ trong bản build tới trang và #mục có thật; trang 404 bằng tiếng Việt, dẫn về trang chủ và ô tìm kiếm.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { parse } from 'yaml';
import { trangCuaDiaChi } from '../src/ban-build.mjs';
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
	assert.match(html, /<span class="oz-sap-co" title="[^"]+">Gam <em>trưởng<\/em><span class="oz-sap-co-nhan" data-pagefind-ignore[^>]*>sắp có<\/span><\/span>/);
	assert.doesNotMatch(html, /href="\/opus\/piano\/gam\//);
	for (const giu of ['href="/opus/"', 'href="https://imslp.org/"', 'href="/opus/audio/NGUON.txt"', 'href="#muc"']) assert.ok(html.includes(giu), giu);
});

test('link trong HTML thô (do chỉ thị dựng từ dữ liệu, hay viết trong trang) cũng thành "sắp có"', () => {
	const plugin = sapCo({ base: BASE, trangCo: () => ['index', 'nhac-ly/10-hop-am-ba'] });
	const html = markdownToHtml(
		'<p class="x"><a href="/opus/piano/gam/"><em>Gam</em> trưởng</a>, <a href="/opus/nhac-ly/10-hop-am-ba/#a">Hợp âm ba</a>, <a class="y" href="/opus/audio/NGUON.txt">nguồn</a></p>',
		{ hastPlugins: [plugin] },
	).html;
	assert.match(html, /<span class="oz-sap-co" title="[^"]+"><em>Gam<\/em> trưởng<span class="oz-sap-co-nhan" data-pagefind-ignore>sắp có<\/span><\/span>/);
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

test('mọi link nội bộ trong nội dung các trang của bản build tới trang có thật, và #mục có thật', () => {
	const id = new Map();
	const idCua = (f) => {
		if (!id.has(f)) id.set(f, new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
		return id.get(f);
	};
	const hong = [];
	for (const f of trangDist()) {
		const html = fs.readFileSync(path.join(DIST, f), 'utf8');
		const noiDung = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
		for (const [, href] of noiDung.matchAll(/\shref="([^"]+)"/g)) {
			if (href.startsWith('#')) {
				if (href.length > 1 && !idCua(path.join(DIST, f)).has(decodeURIComponent(href.slice(1)))) hong.push(`${f}: không có ${href}`);
				continue;
			}
			if (!href.startsWith(BASE)) continue;
			const [p, muc] = href.split('#');
			const dich = path.join(DIST, decodeURI(p).slice(BASE.length), p.endsWith('/') ? 'index.html' : '');
			if (!fs.existsSync(dich)) hong.push(`${f}: không có trang ${href}`);
			else if (muc && !idCua(dich).has(decodeURIComponent(muc))) hong.push(`${f}: ${href} không có #${muc}`);
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
	assert.match(html, /Opus đang được làm lại/);
	assert.match(html, /<a [^>]*href="\/opus\/"[^>]*>\s*Về trang chủ/);
	assert.match(html, /<a [^>]*href="#tim-trang-khac"[^>]*data-mo-tim-kiem/);
	assert.doesNotMatch(html, /rel="(prev|next)"/, 'trang 404 không có link "Trước", "Tiếp"');
	assert.match(html, /id="tim-trang-khac"/);
	assert.doesNotMatch(html, /Page not found|This page/);
});
