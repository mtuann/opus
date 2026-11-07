// Chọn phần kiểm thử của CI theo file đổi (tools/chon-phan-ci.mjs) và chế độ chỉ trang đã đổi của trang mẫu
// (OPUS_CHI_TRANG_DOI, tools/trang-mau.mjs). Nhánh ci-gon.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { cacPhan, fileDoi, laNoiDung, phanLoai } from '../tools/chon-phan-ci.mjs';
import { KHOI, chiTrangDoi, trangMau } from '../tools/trang-mau.mjs';

test('phân loại file: nhóm nội dung', () => {
	for (const f of [
		'src/content/docs/nhac-ly/10-hop-am-ba.md',
		'src/content/docs/index.md',
		'src/data/tac-pham.yml',
		'kiem-dinh/khoa.json',
		'kiem-dinh/du-lieu/tac-pham/fur-elise.yml',
		'plans/lam-lai/README.md',
		'public/audio/NGUON.txt',
		'public/audio/fur-elise.mp3',
		'AGENTS.md',
		'README.md',
		'CLAUDE.md',
		'LICENSE',
		'LICENSE-CONTENT',
	])
		assert.ok(laNoiDung(f), f);
});

test('phân loại file: mã', () => {
	for (const f of [
		'src/scripts/abc.js',
		'src/styles/opus.css',
		'src/components/PageTitle.astro',
		'src/components/hinh/circle.html',
		'src/plugins/thanh-phan.mjs',
		'src/du-lieu.mjs',
		'src/content.config.ts',
		'src/pages/piano/lo-trinh/[chang].astro',
		'src/sach/sach.mjs',
		'src/ung-dung/sw.mjs',
		'src/tim-kiem/boc.js',
		'tools/trang-mau.mjs',
		'tools/audio/attach.py',
		'tests/link.test.mjs',
		'package.json',
		'package-lock.json',
		'astro.config.mjs',
		'.github/workflows/test.yml',
		'.nvmrc',
		'requirements.txt',
		'public/og.png',
		'public/vendor/abcjs-basic-min.js',
		'public/manifest.webmanifest',
		// file .md không ở gốc repo, ngoài nhóm nội dung: mã (như README của công cụ)
		'tools/audio/README.md',
		// tên gần giống thư mục nội dung
		'src/content/docs-cu/x.md',
		'src/data.mjs',
		'kiem-dinh.mjs',
	])
		assert.ok(!laNoiDung(f), f);
});

test('phân loại danh sách: chỉ nội dung thì noi-dung; có một file mã, rỗng hay không đọc được thì ma', () => {
	assert.equal(phanLoai(['src/content/docs/a.md', 'kiem-dinh/a.yml', 'src/data/trang.yml', 'plans/x.md']), 'noi-dung');
	assert.equal(phanLoai(['src/content/docs/a.md', 'src/scripts/abc.js']), 'ma');
	assert.equal(phanLoai(['AGENTS.md', '.github/workflows/test.yml']), 'ma');
	assert.equal(phanLoai([]), 'ma');
	assert.equal(phanLoai(null), 'ma');
	assert.equal(phanLoai(['', ' src/data/cap-do.yml ']), 'noi-dung');
});

test('các phần theo loại', () => {
	assert.deepEqual(cacPhan('noi-dung'), ['npm-test', 'chromium', 'lighthouse']);
	assert.deepEqual(cacPhan('ma'), ['npm-test', 'chromium', 'webkit', 'firefox', 'lighthouse']);
	assert.deepEqual(cacPhan('noi-dung', { du: true }), cacPhan('ma'));
	assert.deepEqual(cacPhan('noi-dung', { anhChup: true }), ['npm-test', 'chromium', 'lighthouse', 'anh-chup']);
	assert.deepEqual(cacPhan('ma', { anhChup: true }).at(-1), 'anh-chup');
});

/** Repo git tạm: main có một trang, nhánh đổi `doi` (đường dẫn -> nội dung). */
function repoTam(doi) {
	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-ci-'));
	const git = (...a) => execFileSync('git', ['-C', goc, '-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...a], { stdio: 'ignore' });
	const ghi = (f, s) => {
		fs.mkdirSync(path.dirname(path.join(goc, f)), { recursive: true });
		fs.writeFileSync(path.join(goc, f), s);
	};
	git('init', '-q', '-b', 'main');
	ghi('src/content/docs/a.md', 'a');
	git('add', '-A');
	git('commit', '-q', '-m', 'main');
	git('checkout', '-q', '-b', 'moi/x');
	for (const [f, s] of Object.entries(doi)) ghi(f, s);
	git('add', '-A');
	git('commit', '-q', '-m', 'nhánh');
	return goc;
}

test('file đổi so với main (git diff main...HEAD)', (t) => {
	const goc = repoTam({ 'src/content/docs/b.md': 'b', 'kiem-dinh/b.yml': 'x' });
	t.after(() => fs.rmSync(goc, { recursive: true, force: true }));
	assert.deepEqual(fileDoi('main', goc).sort(), ['kiem-dinh/b.yml', 'src/content/docs/b.md']);
	assert.equal(phanLoai(fileDoi('main', goc)), 'noi-dung');
	assert.equal(fileDoi('khong-co-nhanh-nay', goc), null);
	assert.equal(fileDoi('', goc), null);
	assert.equal(fileDoi('0000000000000000000000000000000000000000', goc), null);
	const goc2 = repoTam({ 'src/content/docs/b.md': 'b', 'src/scripts/x.js': 'x' });
	t.after(() => fs.rmSync(goc2, { recursive: true, force: true }));
	assert.equal(phanLoai(fileDoi('main', goc2)), 'ma');
});

test('trang mẫu: OPUS_CHI_TRANG_DOI=1 bỏ phần trang mẫu theo loại khối', (t) => {
	const goc = repoTam({ 'src/content/docs/doi/b.md': 'b' });
	t.after(() => fs.rmSync(goc, { recursive: true, force: true }));
	const dist = path.join(goc, 'dist');
	const ghi = (f, s) => {
		fs.mkdirSync(path.dirname(path.join(dist, f)), { recursive: true });
		fs.writeFileSync(path.join(dist, f), s);
	};
	ghi('index.html', '<p>trang chủ</p>');
	ghi('404.html', '<p>404</p>');
	ghi('doi/b/index.html', '<p>b</p>');
	ghi('khoi/abc/index.html', `<div ${KHOI['khuông nhạc']}"></div>`);
	ghi('khoi/quiz/index.html', `<div ${KHOI['câu hỏi']}"></div>`);
	ghi('them/index.html', '<p>thêm</p>');

	assert.equal(chiTrangDoi({}), false);
	assert.equal(chiTrangDoi({ OPUS_CHI_TRANG_DOI: '1' }), true);
	assert.deepEqual(trangMau(dist, goc, {}), ['', '404.html', 'doi/b/', 'khoi/abc/', 'khoi/quiz/']);
	assert.deepEqual(trangMau(dist, goc, { OPUS_CHI_TRANG_DOI: '1' }), ['', '404.html', 'doi/b/']);
	assert.deepEqual(trangMau(dist, goc, { OPUS_CHI_TRANG_DOI: '1', OPUS_TRANG: 'them' }), ['', '404.html', 'doi/b/', 'them/']);
});
