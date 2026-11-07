// Kiểm thử lớp dữ liệu (D1.2): dữ liệu thật trong src/data/ đúng schema và kiểm chéo; bộ dữ liệu hỏng mẫu trong
// tests/du-lieu-hong/ bị bắt đủ từng lỗi và làm build hỏng; mỗi trang trong src/content/docs/ có một tầng trong trang.yml.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { dauVet, dungLaiKhiDoi, kiemTra, tepDauVet } from '../src/du-lieu.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const BAI_BLOG = /^blog\/posts\/\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

test('dữ liệu trong src/data/ đúng schema và kiểm chéo, đủ số bản ghi đã tách', () => {
	const { duLieu, loi } = kiemTra(path.join(ROOT, 'src/data'));
	assert.deepEqual(loi, []);
	assert.equal(duLieu['cap-do'].length, 7);
	// 233 trang của site cũ (plans/lam-lai/anh-xa.md); sau đợt 6 có thêm trang tác phẩm mới (tools/them-tac-pham.mjs):
	// tầng tac-pham, là trang chính của một bản ghi; từ đợt 9 có thêm bài blog mới (blog/posts/<yyyy-mm-dd>-<tên>, tầng khung)
	const cu = new Set([...fs.readFileSync(path.join(ROOT, 'plans/lam-lai/anh-xa.md'), 'utf8').matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]));
	const trangChinh = new Set(duLieu['tac-pham'].map((r) => (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug));
	assert.equal(duLieu.trang.filter((t) => cu.has(t.id)).length, 233, 'trang.yml phải có đủ 233 trang của site cũ');
	assert.deepEqual(duLieu.trang.filter((t) => !cu.has(t.id) && !(t.tang === 'tac-pham' && trangChinh.has(t.id)) && !(t.tang === 'khung' && BAI_BLOG.test(t.id))).map((t) => t.id), [], 'trang ngoài site cũ chỉ là trang tác phẩm mới hay bài blog mới');
	assert.equal(duLieu['tac-pham'].filter((r) => r.loai === 'bai-hoc' && cu.has(`piano/tac-pham/${r.slug}`)).length, 34, 'đủ 34 bài học của site cũ');
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

test('dấu vết dựng lại tính schema, mọi plugin Markdown và hình tĩnh; dữ liệu không còn link .md của site cũ', () => {
	const tep = tepDauVet();
	// dấu vết đổi khi nội dung một file trong danh sách đổi (đọc qua fs.readFileSync, thay tạm để thử)
	const goc = fs.readFileSync;
	const truoc = dauVet();
	try {
		for (const f of tep) {
			fs.readFileSync = (p, ...r) => (String(p).endsWith(f) ? Buffer.from('đã sửa') : goc(p, ...r));
			assert.notEqual(dauVet(), truoc, `${f} đổi mà dấu vết không đổi`);
		}
	} finally {
		fs.readFileSync = goc;
	}
	assert.equal(dauVet(), truoc);
	assert.ok(tep.includes('src/du-lieu.mjs'));
	for (const f of fs.readdirSync(path.join(ROOT, 'src/plugins'))) assert.ok(tep.includes(`src/plugins/${f}`), f);
	// hình tĩnh: ::hinh chèn nguyên file lúc dựng, sửa hình thì trang phải dựng lại (mo/d5-hinh)
	for (const f of fs.readdirSync(path.join(ROOT, 'src/components/hinh')).filter((x) => x.endsWith('.html'))) assert.ok(tep.includes(`src/components/hinh/${f}`), f);
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

test('trang tác phẩm khai đúng tac_pham: trang chính của mỗi bản ghi, và trang cap dùng chung bản ghi ấy', () => {
	const tp = parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'tac-pham.yml'), 'utf8'));
	const chinh = (r) => (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug;
	const cuaTrang = new Map(tp.map((r) => [chinh(r), r.slug]));
	// trang cap không có bản ghi riêng: viết về đúng tác phẩm này, dùng chung bản ghi (AGENTS.md, mục Dữ liệu)
	for (const r of tp) if (r.cap && !cuaTrang.has(r.cap)) cuaTrang.set(r.cap, r.slug);
	const loi = [];
	for (const [trang, slug] of cuaTrang) {
		const f = path.join(ROOT, 'src', 'content', 'docs', `${trang}.md`);
		if (!fs.existsSync(f)) continue; // trang chưa chuyển
		const fm = parse(/^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(f, 'utf8'))?.[1] ?? '') ?? {};
		if (fm.tac_pham !== slug) loi.push(`${trang}.md: frontmatter phải có tac_pham: ${slug} (đang: ${fm.tac_pham ?? 'không có'})`);
	}
	assert.deepEqual(loi, []);
});

test('trang tham chiếu có hạn đã khóa: ra_lai sau tháng kiểm của hồ sơ, không quá 12 tháng (D8-L1)', async () => {
	const { loiRaLai, thangKiem } = await import('../src/kiem-dinh.mjs');
	const trang = parse(fs.readFileSync(path.join(ROOT, 'src/data/trang.yml'), 'utf8'));
	const khoa = JSON.parse(fs.readFileSync(path.join(ROOT, 'kiem-dinh/khoa.json'), 'utf8'));
	const loi = [];
	for (const r of trang.filter((x) => x.ra_lai && khoa.trang?.[x.id])) {
		const hs = path.join(ROOT, 'kiem-dinh', `${r.id}.yml`);
		const kiem = thangKiem(r.id, khoa, fs.existsSync(hs) ? fs.readFileSync(hs, 'utf8') : undefined);
		if (!kiem) loi.push(`${r.id}: đã khóa mà lần cuối trong lan của hồ sơ không có ngày`);
		else if (loiRaLai(kiem, r.ra_lai)) loi.push(`${r.id}: ${loiRaLai(kiem, r.ra_lai)}`);
	}
	assert.deepEqual(loi, []);
});
