// Kiểm thử blog và trang Cập nhật (D7-L3): ::danh-sach-bai (bài có trong bản build, mới trước, tiêu đề, ngày, mô tả) và
// ::tac-pham-moi (tác phẩm có them_ngay mà trang chính có trong bản build, mới trước; ở trang đã khóa chỉ đọc trường đã
// khóa), hàm thuần ở src/plugins/thanh-phan.mjs; trên dist/: trang blog và Cập nhật dựng đúng.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { danhSachBai, docBaiBlog, ngayVN, tacPhamMoi } from '../src/plugins/thanh-phan.mjs';
import { tatCaTrang } from '../src/ban-build.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

test('ngayVN: năm-tháng-ngày (chuỗi hay Date) thành ngày/tháng/năm; sai dạng thì báo lỗi', () => {
	assert.equal(ngayVN('2026-10-11'), '11/10/2026');
	assert.equal(ngayVN(new Date('2026-10-23T00:00:00Z')), '23/10/2026');
	assert.throws(() => ngayVN('11/10/2026'), /năm-tháng-ngày/);
});

test('danhSachBai: mới trước, cùng ngày theo tên trang; tiêu đề là link, ngày, mô tả Markdown; rỗng thì một dòng', () => {
	const h = danhSachBai([
		{ trang: 'blog/posts/2026-10-11-a', title: 'A & B', date: '2026-10-11', description: 'Mô tả *a*.' },
		{ trang: 'blog/posts/2026-10-23-c', title: 'C', date: '2026-10-23', description: 'c' },
		{ trang: 'blog/posts/2026-10-23-b', title: 'B', date: '2026-10-23', description: 'b' },
	]);
	assert.deepEqual([...h.matchAll(/<a href="\/opus\/(blog\/posts\/[^"]+)\/">/g)].map((m) => m[1]), ['blog/posts/2026-10-23-b', 'blog/posts/2026-10-23-c', 'blog/posts/2026-10-11-a']);
	assert.match(h, /^<ul class="oz-ds-bai" data-sinh>/);
	assert.match(h, />A &amp; B<\/a>/);
	assert.match(h, /<time datetime="2026-10-11">11\/10\/2026<\/time>/);
	assert.match(h, /Mô tả <em>a<\/em>\./);
	assert.equal(danhSachBai([]), '<p class="oz-ds-bai" data-sinh>Chưa có bài nào.</p>');
});

test('docBaiBlog: chỉ bài có trong bản build, đọc title, date, description ở frontmatter; thiếu thì báo lỗi', () => {
	const d = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-blog-'));
	fs.mkdirSync(path.join(d, 'blog/posts'), { recursive: true });
	fs.writeFileSync(path.join(d, 'blog/posts/2026-10-11-a.md'), '---\ntitle: Bài A\ndate: 2026-10-11\ndescription: "Mở đầu."\n---\n\nChữ.\n');
	fs.writeFileSync(path.join(d, 'blog/posts/2026-10-12-b.md'), '---\ntitle: Bài B\ndate: 2026-10-12\n---\n');
	assert.deepEqual(docBaiBlog(['index', 'blog/index', 'blog/posts/2026-10-11-a'], d), [{ trang: 'blog/posts/2026-10-11-a', title: 'Bài A', date: '2026-10-11', description: 'Mở đầu.' }]);
	assert.throws(() => docBaiBlog(['blog/posts/2026-10-12-b'], d), /thiếu description/);
	fs.rmSync(d, { recursive: true });
});

test('bài blog thật: đường dẫn blog/posts/<yyyy-mm-dd>-<tên>, frontmatter có date khớp tên file và description', () => {
	const bai = tatCaTrang().filter((t) => t.startsWith('blog/posts/'));
	assert.ok(bai.length >= 3);
	for (const b of docBaiBlog(bai)) {
		assert.match(b.trang, /^blog\/posts\/\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/);
		assert.equal(b.date, b.trang.slice('blog/posts/'.length, 'blog/posts/'.length + 10), b.trang);
	}
});

const nguoi = new Map([['mozart', { ten: 'Wolfgang Amadeus Mozart', ten_ngan: 'Mozart' }]]);
const rec = (slug, loai, them_ngay, ten = slug) => ({ slug, loai, them_ngay, ten, tac_gia: 'mozart' });

test('tacPhamMoi: chỉ tác phẩm có them_ngay mà trang chính có trong bản build, mới trước; rỗng thì một dòng', () => {
	const ds = [rec('a', 'bai-hoc', '2026-12-01', '*Minuet*'), rec('b', 'nghe', '2027-01-05'), rec('c', 'bai-hoc', undefined), rec('d', 'nghe', '2027-02-01')];
	const h = tacPhamMoi(ds, nguoi, ['piano/tac-pham/a', 'nghe-nhac/b', 'piano/tac-pham/c']);
	assert.deepEqual([...h.matchAll(/<a href="\/opus\/([^"]+)\/">/g)].map((m) => m[1]), ['nghe-nhac/b', 'piano/tac-pham/a']);
	assert.match(h, /<time datetime="2026-12-01">01\/12\/2026<\/time>: <a href="\/opus\/piano\/tac-pham\/a\/">[^<]*<em>Minuet<\/em><\/a> <span class="oz-tac-pham-moi-loai">\(bài học\)<\/span>/);
	assert.match(h, /\(hướng dẫn nghe\)/);
	assert.match(tacPhamMoi(ds, nguoi, ['index']), /^<p class="oz-tac-pham-moi" data-sinh>Chưa có tác phẩm nào trên site/);
});

test('tacPhamMoi: không đọc them_ngay của tác phẩm chưa có trong bản build (trang đã khóa đọc bản ghi qua chiDaKhoa)', () => {
	const khoa = (r, cam) =>
		new Proxy(r, {
			get(t, k) {
				if (cam.includes(k)) throw new Error(`đọc trường chưa khóa ${k} của ${t.slug}`);
				return Reflect.get(t, k);
			},
		});
	// x: chưa có trong bản build, loai, them_ngay, ten chưa khóa: không được đọc
	const ds = [khoa(rec('a', 'bai-hoc', '2026-12-01'), []), khoa(rec('x', 'bai-hoc', '2026-12-02'), ['loai', 'them_ngay', 'ten'])];
	assert.match(tacPhamMoi(ds, nguoi, ['piano/tac-pham/a']), /tac-pham\/a\//);
	assert.throws(() => tacPhamMoi(ds, nguoi, ['piano/tac-pham/x']), /loai|them_ngay/);
});

test('dist/: trang blog liệt kê các bài có trong bản build, mới trước; bài có ngày đăng; Cập nhật có nhật ký tác phẩm mới', { skip: !fs.existsSync(path.join(DIST, 'index.html')) && 'chưa build' }, () => {
	const f = path.join(DIST, 'blog', 'index.html');
	if (fs.existsSync(f)) {
		const h = fs.readFileSync(f, 'utf8');
		const co = tatCaTrang().filter((t) => t.startsWith('blog/posts/') && fs.existsSync(path.join(DIST, t, 'index.html')));
		const link = [...h.matchAll(/<p class="oz-ds-bai-ten"><a href="\/opus\/([^"]+)\/">/g)].map((m) => m[1]);
		assert.deepEqual(link, [...co].sort().reverse());
		for (const t of co) assert.match(fs.readFileSync(path.join(DIST, t, 'index.html'), 'utf8'), /<p class="oz-ngay-dang"[^>]*>\s*Ngày đăng: <time datetime="\d{4}-\d{2}-\d{2}">/, t);
	}
	const c = path.join(DIST, 'cap-nhat', 'index.html');
	if (fs.existsSync(c)) assert.match(fs.readFileSync(c, 'utf8'), /class="oz-tac-pham-moi"/);
});
