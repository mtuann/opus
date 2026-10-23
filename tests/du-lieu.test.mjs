// Kiểm thử lớp dữ liệu (D1.2): dữ liệu thật trong src/data/ đúng schema và kiểm chéo; bộ dữ liệu hỏng mẫu trong
// tests/du-lieu-hong/ bị bắt đủ từng lỗi và làm build hỏng; mỗi trang trong src/content/docs/ có một tầng trong trang.yml.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { dungLaiKhiDoi, kiemTra, tepDauVet } from '../src/du-lieu.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

test('dữ liệu trong src/data/ đúng schema và kiểm chéo, đủ số bản ghi đã tách', () => {
	const { duLieu, loi } = kiemTra(path.join(ROOT, 'src/data'));
	assert.deepEqual(loi, []);
	assert.equal(duLieu['cap-do'].length, 7);
	assert.equal(duLieu.trang.length, 233, 'trang.yml phải có đủ 233 trang của site cũ');
	assert.equal(duLieu['tac-pham'].filter((r) => r.loai === 'bai-hoc').length, 34, 'đủ 34 bài học');
	assert.ok(duLieu['thuat-ngu'].length >= 150);
	assert.ok(duLieu['nha-soan-nhac'].length >= 100);
});

test('bộ dữ liệu hỏng mẫu: mỗi lỗi cố ý đều bị bắt', () => {
	const { loi } = kiemTra(path.join(ROOT, 'tests/du-lieu-hong'));
	const canBat = [
		'cap-do.yml: chặng phải đánh số liền từ 1',
		'cap-do.yml: chặng 3: grade_tu lớn hơn grade_den',
		'nha-soan-nhac.yml: trùng id "beethoven"',
		'nha-soan-nhac.yml: bản ghi "chopin": mat: thiếu năm mất',
		'nha-soan-nhac.yml: bản ghi "liszt"', // trường lạ nam_sinh
		'nha-soan-nhac.yml: bản ghi "Mozart": id:',
		'tac-pham.yml: bản ghi "fur-elise": chang:',
		'tac-pham.yml: bản ghi "fur-elise": hinh.bai-hoc.0.doan.1.3:',
		'tac-pham.yml: bản ghi "fur-elise": ban_thu.0.page:',
		'tac-pham.yml: bản ghi "fur-elise": ban_thu.0.parts.0: mỗi phần cần mp3 hay link',
		'tac-pham.yml: bản ghi "bagatelle": có hinh.nghe nhưng không có trang hướng dẫn nghe dùng bản ghi này',
		'tac-pham.yml: bản ghi "ballade": tac_gia "chopin-sai" không có',
		'tac-pham.yml: bản ghi "ballade": chặng 2 không có trong cap-do.yml',
		'tac-pham.yml: bản ghi "ballade": cap "nghe-nhac/khong-co" không có',
		'tac-pham.yml: bản ghi "bagatelle": thong_tin "Nhà soạn nhạc" ghi Ludwig van Beethoven (1770–1828)',
		'tac-pham.yml: bản ghi "bai-nghe": loai:',
		'tac-pham.yml: bản ghi "sonatina": grade "Grade 5" không hợp chặng 1',
		'tac-pham.yml: bản ghi "sonatina": cap "nghe-nhac/khong-co" đã là cap của bản ghi "ballade"',
		'tac-pham.yml: bản ghi "sonatina": chip cấp độ "≈ Grade 5–6" không khớp grade "Grade 5"',
		'tac-pham.yml: bản ghi "sonatina": dòng "Nhà soạn nhạc" của thong_tin không mở đầu bằng tên Ludwig van Beethoven',
		'thuat-ngu.yml: YAML hỏng',
		'trang.yml: bản ghi "piano/thay-va-thi": ra_lai:',
		'trang.yml: bản ghi "piano/chon-dan": ra_lai:',
		'trang.yml: bản ghi "nhac-ly/bai-1": tang:',
	];
	for (const c of canBat) assert.ok(loi.some((l) => l.startsWith(c)), `không bắt được lỗi: ${c}\nCác lỗi bắt được:\n${loi.join('\n')}`);
	assert.ok(loi.some((l) => l.includes('nam_sinh')), 'không bắt được trường lạ nam_sinh');
});

test('file dữ liệu rỗng hay hỏng: báo một lỗi, không kéo theo hàng loạt lỗi "không có"', () => {
	const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-du-lieu-'));
	try {
		for (const f of fs.readdirSync(path.join(ROOT, 'src/data'))) fs.copyFileSync(path.join(ROOT, 'src/data', f), path.join(tam, f));
		fs.writeFileSync(path.join(tam, 'tac-pham.yml'), '[]\n');
		assert.deepEqual(kiemTra(tam).loi, ['tac-pham.yml: không có bản ghi nào']);
		fs.copyFileSync(path.join(ROOT, 'src/data/tac-pham.yml'), path.join(tam, 'tac-pham.yml'));
		fs.writeFileSync(path.join(tam, 'nha-soan-nhac.yml'), '- id: a\n  id: b\n');
		const { loi } = kiemTra(tam);
		assert.equal(loi.length, 1, loi.join('\n'));
		assert.match(loi[0], /^nha-soan-nhac\.yml: YAML hỏng/);
	} finally {
		fs.rmSync(tam, { recursive: true, force: true });
	}
});

test('build hỏng khi dữ liệu sai (astro sync với OPUS_DU_LIEU=tests/du-lieu-hong)', () => {
	const r = spawnSync(process.execPath, [path.join(ROOT, 'node_modules/astro/bin/astro.mjs'), 'sync'], {
		cwd: ROOT,
		env: { ...process.env, OPUS_DU_LIEU: 'tests/du-lieu-hong' },
		encoding: 'utf8',
	});
	assert.notEqual(r.status, 0, 'astro sync phải hỏng');
	assert.match(r.stdout + r.stderr, /Dữ liệu trong tests\/du-lieu-hong sai \(\d+ lỗi\)/);
});

test('bộ nạp trang xóa HTML đã dựng khi dữ liệu đổi, giữ nguyên khi không đổi (dungLaiKhiDoi, D1.3)', async () => {
	const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-du-lieu-'));
	const cu = process.env.OPUS_DU_LIEU;
	try {
		fs.cpSync(path.join(ROOT, 'src/data'), tam, { recursive: true });
		process.env.OPUS_DU_LIEU = tam;
		let xoa = 0;
		let nap = 0;
		const ctx = { meta: new Map(), store: { clear: () => xoa++ } };
		const loader = dungLaiKhiDoi({ name: 'thu', load: async () => nap++ });
		await loader.load(ctx); // lần đầu: chưa có dấu vết, dựng hết
		await loader.load(ctx); // không đổi gì: giữ HTML đã dựng
		fs.appendFileSync(path.join(tam, 'tac-pham.yml'), '\n# sửa một bản ghi\n');
		await loader.load(ctx); // dữ liệu đổi: dựng lại hết
		assert.deepEqual({ xoa, nap }, { xoa: 2, nap: 3 });
	} finally {
		if (cu === undefined) delete process.env.OPUS_DU_LIEU;
		else process.env.OPUS_DU_LIEU = cu;
		fs.rmSync(tam, { recursive: true, force: true });
	}
});

test('dấu vết dựng lại tính schema và mọi plugin Markdown; dữ liệu không còn link .md của site cũ', () => {
	const tep = tepDauVet();
	assert.ok(tep.includes('src/du-lieu.mjs'));
	for (const f of fs.readdirSync(path.join(ROOT, 'src/plugins'))) assert.ok(tep.includes(`src/plugins/${f}`), f);
	for (const f of fs.readdirSync(path.join(ROOT, 'src/data')))
		assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'), /\]\([^)\s]*\.md[#)]/, `${f}: link .md cũ (tools/du_lieu/tach.py đổi thành /opus/…/)`);
});

test('mỗi trang trong src/content/docs/ có đúng một tầng trong src/data/trang.yml', () => {
	const tang = new Map(parse(fs.readFileSync(path.join(ROOT, 'src/data/trang.yml'), 'utf8')).map((r) => [r.id, r.tang]));
	const docs = path.join(ROOT, 'src/content/docs');
	const trang = fs
		.readdirSync(docs, { recursive: true })
		.filter((f) => /\.mdx?$/.test(f))
		.map((f) => f.replace(/\\/g, '/').replace(/\.mdx?$/, ''))
		.filter((t) => t !== '404'); // trang 404 là trang mới của khung (D1.5), không có ở site cũ
	assert.ok(trang.length > 0);
	const thieu = trang.filter((t) => !tang.has(t));
	assert.deepEqual(thieu, [], 'trang chưa có tầng trong trang.yml');
});
