// Kiểm thử sách in (D7-L3, src/sach/): hàm thuần (câu hỏi thành câu hỏi in kèm đáp án, bỏ công cụ, id có tiền tố chương,
// link đầy đủ) và bảy cuốn trong dist/sach/ của bản build vừa dựng: đủ chương có trong bản build, theo thứ tự; không còn
// công cụ, câu hỏi bấm được hay script của trang; mọi link nội bộ trỏ tới trang có thật. Mở sách, vẽ khuông và in PDF trên
// trình duyệt: tests/trinh-duyet/kiem-ung-dung.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SACH, cauHoiIn, docTrang, lamChuong, trangSach } from '../src/sach/sach.mjs';
import { docCay, ghi } from '../src/sach/html.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://mtuann.github.io/opus/';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

test('html.mjs: đọc rồi ghi lại giữ nguyên HTML (thẻ rỗng, SVG tự đóng, chú thích, script)', () => {
	const h = '<div class="a"><p>x<br>y</p><!-- c --><svg><use href="#k"/></svg><script>if (a<b) x("</p>")</script><img src="/a.png"></div>';
	assert.equal(ghi(docCay(h)), h);
});

test('cauHoiIn: lựa chọn A, B, C theo thứ tự trong trang, đáp án (cả câu nhiều đáp án đúng) và giải thích, đánh số tiếp', () => {
	const { cauHoi, dapAn } = cauHoiIn(
		[
			{ q: 'Một?', opts: [{ t: 'a', ok: false }, { t: '<em>b</em>', ok: true }], why: 'Vì <strong>b</strong>.' },
			{ q: 'Hai?', opts: [{ t: 'x', ok: true }, { t: 'y', ok: false }, { t: 'z', ok: true }], why: '' },
		],
		3,
	);
	assert.match(cauHoi, /<ol start="3"><li>Một\?<ol type="A"><li>a<\/li><li><em>b<\/em><\/li><\/ol><\/li><li>Hai\?/);
	assert.deepEqual(dapAn, ['<li><strong>3. B</strong> — Vì <strong>b</strong>.</li>', '<li><strong>4. A, C</strong></li>']);
});

test('lamChuong: bỏ công cụ (và mục chỉ dẫn tới nó), câu hỏi kèm đáp án cuối chương, details mở, id và link đổi', () => {
	const quiz = esc(JSON.stringify([{ q: 'Q?', opts: [{ t: 'đúng', ok: true }, { t: 'sai', ok: false }], why: 'W' }]));
	const html =
		'<div class="sl-markdown-content">' +
		'<div class="sl-heading-wrapper level-h2"><h2 id="muc-1">Mục 1</h2><a class="sl-anchor-link" href="#muc-1">#</a></div>' +
		'<p>Xem <a href="#muc-2">mục 2</a>, <a href="/opus/nhac-ly/04-nhip/#x">bài 4</a>, <a href="../05-dau-hoa/">bài 5</a>, <a href="https://imslp.org/">IMSLP</a>.</p>' +
		'<div class="oz-quiz" data-quiz="' + quiz + '"><p>Kiểm tra nhanh</p><ol><li>Q?</li></ol></div>' +
		'<details><summary>Đáp án</summary><p>Đô</p></details>' +
		'<svg><use href="#oz-kh-sol"></use><path fill="url(#g)"/></svg>' +
		'<div class="sl-heading-wrapper level-h2"><h2 id="luyen">Luyện với công cụ</h2></div><p>Bấm để nghe.</p>' +
		'<div class="oz-lt oz-tool not-content" data-sinh><button>Nghe</button></div>' +
		'<div class="sl-heading-wrapper level-h2"><h2 id="muc-2">Mục 2</h2></div><p>Chữ.</p>' +
		'<div class="oz-ban-phim not-content"><svg></svg></div><p>Còn chữ sau bàn phím.</p>' +
		'<noscript><p>Cần JavaScript.</p></noscript><p class="oz-nguon-am" data-sinh>Mẫu âm.</p>' +
		'</div>';
	const t = docTrang(`<html><head><style>x{}</style><link rel="stylesheet" href="/opus/_astro/a.css"></head><body><h1 id="_top">3. Trường độ</h1>${html}</body></html>`);
	assert.equal(t.ten, '3. Trường độ');
	assert.deepEqual(t.css, ['<style>x{}</style>', '<link rel="stylesheet" href="/opus/_astro/a.css">']);
	const c = lamChuong(t.noiDung, 'nhac-ly/04-nhip/', 2, SITE);
	assert.doesNotMatch(c, /oz-tool|oz-ban-phim|oz-quiz|noscript|oz-nguon-am|sl-anchor-link|Luyện với công cụ|Bấm để nghe/);
	// mục 2 còn chữ khác ngoài công cụ: giữ mục, chỉ bỏ công cụ
	assert.match(c, /<h2 id="c2-muc-2">Mục 2<\/h2>/);
	assert.match(c, /Còn chữ sau bàn phím/);
	assert.match(c, /<h2 id="c2-muc-1">/);
	assert.match(c, /href="#c2-muc-2"/);
	assert.match(c, /href="https:\/\/mtuann\.github\.io\/opus\/nhac-ly\/04-nhip\/#x"/);
	assert.match(c, /href="https:\/\/mtuann\.github\.io\/opus\/nhac-ly\/05-dau-hoa\/"/);
	assert.match(c, /href="https:\/\/imslp\.org\/"/);
	assert.match(c, /<use href="#oz-kh-sol">/);
	assert.match(c, /fill="url\(#c2-g\)"/);
	assert.match(c, /<details open>/);
	assert.match(c, /<div class="book-quiz">.*<li>Q\?<ol type="A"><li>đúng<\/li><li>sai<\/li><\/ol><\/li>/);
	assert.match(c, /<div class="book-answers">.*<li><strong>1\. A<\/strong> — W<\/li>/);
});

test('trangSach: bìa ghi số chương; chưa có chương nào thì nói vậy, không có mục lục', () => {
	const s = { id: 'x', ten: 'Sách thử', mo_ta: 'Mô tả.', trang: ['a/', 'b/', 'c/'] };
	const hai = trangSach(s, [{ url: 'a/', ten: 'A', html: '<p>a</p>' }, { url: 'c/', ten: 'C', html: '<p>c</p>' }], { ngay: '05/11/2026' });
	assert.match(hai, /Bản in ngày 05\/11\/2026 · 2 chương \(các trang đã lên site/);
	assert.match(hai, /<li><a href="#chuong-1">A<\/a><\/li><li><a href="#chuong-2">C<\/a><\/li>/);
	assert.match(hai, /<button id="print" type="button" disabled>Đang vẽ khuông nhạc…<\/button>/);
	assert.match(hai, /<script src="\/opus\/vendor\/abcjs-basic-min\.js"><\/script>/);
	const rong = trangSach(s, []);
	assert.match(rong, /Chưa có chương nào/);
	assert.doesNotMatch(rong, /class="toc"/);
	assert.match(trangSach(s, ['a/', 'b/', 'c/'].map((url) => ({ url, ten: url, html: '' }))), /· 3 chương ·/);
});

const coDist = fs.existsSync(path.join(DIST, 'sach'));
const trangCo = (url) => fs.existsSync(path.join(DIST, url, 'index.html'));

test('dist/sach/: bảy cuốn, mỗi cuốn đủ chương có trong bản build, đúng thứ tự', { skip: !coDist && 'chưa build (không có dist/sach/)' }, () => {
	assert.deepEqual(fs.readdirSync(path.join(DIST, 'sach')).sort(), SACH.map((s) => `${s.id}.html`).sort());
	for (const s of SACH) {
		const h = fs.readFileSync(path.join(DIST, 'sach', `${s.id}.html`), 'utf8');
		const chuong = [...h.matchAll(/<section class="chapter" id="chuong-(\d+)" data-url="([^"]+)">/g)];
		assert.deepEqual(chuong.map((m) => m[2]), s.trang.filter(trangCo), s.id);
		assert.deepEqual(chuong.map((m) => Number(m[1])), chuong.map((_, i) => i + 1), s.id);
		assert.match(h, new RegExp(chuong.length ? `· ${chuong.length} chương` : 'Chưa có chương nào'), s.id);
	}
});

test('dist/sach/: không còn công cụ, câu hỏi bấm được, khối nghe hay script của trang; câu hỏi có đáp án cuối chương', { skip: !coDist && 'chưa build' }, () => {
	for (const s of SACH) {
		const h = fs.readFileSync(path.join(DIST, 'sach', `${s.id}.html`), 'utf8');
		assert.doesNotMatch(h, /class="[^"]*\b(oz-tool|oz-ban-phim|oz-listen|oz-quiz|oz-chua-co|sl-anchor-link)\b/, s.id);
		assert.doesNotMatch(h, /<noscript|data-quiz=|data-pagefind-body/, s.id);
		assert.equal((h.match(/<script\b/g) ?? []).length, 2, `${s.id}: chỉ abcjs và script vẽ khuông, in`);
		for (const ch of h.split('<section class="chapter"').slice(1)) {
			const soCau = (ch.match(/<div class="book-quiz">/g) ?? []).length;
			assert.equal(ch.includes('<div class="book-answers">'), soCau > 0, `${s.id}: chương có câu hỏi thì có đáp án`);
		}
		assert.doesNotMatch(h.replace(/<details[^>]*\sopen[\s>]/g, ''), /<details[\s>]/, `${s.id}: <details> mở sẵn`);
	}
});

test('dist/sach/: link nội bộ đầy đủ (https://mtuann.github.io/opus/…), trỏ tới trang có trong bản build; #mục có id', { skip: !coDist && 'chưa build' }, () => {
	const loi = [];
	for (const s of SACH) {
		const h = fs.readFileSync(path.join(DIST, 'sach', `${s.id}.html`), 'utf8');
		const id = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
		const than = h.slice(h.indexOf('<main>'), h.indexOf('</main>'));
		for (const [, href] of than.matchAll(/\shref="([^"]*)"/g)) {
			const d = href.replace(/&amp;/g, '&');
			if (d.startsWith('#')) {
				if (!d.startsWith('#oz-kh-') && !id.has(d.slice(1))) loi.push(`${s.id}: không có #${d.slice(1)}`);
			} else if (!/^(https?:|mailto:)/.test(d)) loi.push(`${s.id}: link không đầy đủ ${d}`);
			else if (d.startsWith(SITE)) {
				const p = decodeURI(d.slice(SITE.length).split(/[?#]/)[0]);
				if (!(p.endsWith('/') ? trangCo(p) : fs.existsSync(path.join(DIST, p)))) loi.push(`${s.id}: link tới ${p} không có trong bản build`);
			}
		}
	}
	assert.deepEqual(loi, []);
});

test('dist/: trang Sách in được (khi có trong bản build) mở đủ bảy cuốn bằng link Markdown', { skip: !coDist && 'chưa build' }, () => {
	const f = path.join(DIST, 'bat-dau', 'sach-in', 'index.html');
	if (!fs.existsSync(f)) return;
	const h = fs.readFileSync(f, 'utf8');
	for (const s of SACH) assert.match(h, new RegExp(`<a href="/opus/sach/${s.id}\\.html">Mở sách</a>`), s.id);
});
