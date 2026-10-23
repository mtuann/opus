// Kiểm thử phạm vi lô (D1.6; plans/lam-lai/README.md, mục Quy tắc chung): trên nhánh moi/d<đợt>-l<lô>, mọi file khác
// với main (kể cả file chưa commit) phải thuộc phạm vi của lô, và trang khóa, đổi mã băm hay mở khóa trong
// kiem-dinh/khoa.json phải là trang của lô. Trang của lô lấy từ plans/lam-lai/anh-xa.md. Nhánh khác thì bỏ qua.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { docKhoa } from '../src/khoa.mjs';
import { trangCuaLo } from '../tools/khoa.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const git = (goc, ...ts) => execFileSync('git', ['-C', goc, ...ts], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/**
 * Phạm vi chung của một lô: trang của lô; dữ liệu; thành phần, script, file tĩnh; hồ sơ; báo cáo của lô (cả ảnh chụp,
 * danh sách nhận định, kết quả lượt 2, mẫu kiểm). Thêm theo AGENTS.md: lô làm thành phần thì đăng ký nó trong
 * src/plugins/thanh-phan.mjs, thêm CSS vào src/styles/thanh-phan.css và kiểm thử vào tests/, trừ hai kiểm thử canh cổng
 * (khóa và phạm vi).
 */
const CHUNG = [
	/^src\/(data|components|scripts)\//,
	/^public\//,
	/^kiem-dinh\//,
	/^src\/plugins\/thanh-phan\.mjs$/,
	/^src\/styles\/thanh-phan\.css$/,
	/^tests\/(?!khoa\.test\.mjs$|pham-vi\.test\.mjs$)/,
];

/** Việc kế hoạch giao riêng cho một lô, ngoài phạm vi chung (plans/lam-lai/README.md, mục của đợt). */
const THEM = {
	// trang chủ thật, 7 trang chặng sinh từ dữ liệu, menu đủ 9 nhóm
	'D2-L1': ['astro.config.mjs', 'src/nhom.mjs', 'src/styles/opus.css', 'src/pages/', 'src/ban-build.mjs'],
	// trang Từ điển sinh từ thuat-ngu.yml
	'D3-L5': ['src/pages/', 'src/ban-build.mjs'],
};

/** File `file` (đường dẫn từ gốc repo) có thuộc phạm vi của lô `lo` ("D3-L2"), với các trang `trangLo`, không. */
function trongPhamVi(file, lo, trangLo) {
	if (CHUNG.some((re) => re.test(file))) return true;
	if ((THEM[lo] ?? []).some((p) => (p.endsWith('/') ? file.startsWith(p) : file === p))) return true;
	const bc = `plans/lam-lai/bao-cao/${lo.toLowerCase()}`;
	if (file.startsWith(bc) && /^[./-]/.test(file.slice(bc.length))) return true;
	const m = /^src\/content\/docs\/(.+)\.mdx?$/.exec(file);
	if (!m) return false;
	// bài blog đổi đường dẫn theo cú pháp site mới (README, đợt 7)
	return trangLo.includes(m[1]) || (m[1].startsWith('blog/') && trangLo.some((t) => t.startsWith('blog/')));
}

/** Tên nhánh đang kiểm; trên GitHub Actions, pull request để HEAD tách rời nên lấy từ biến môi trường. */
function nhanhHienTai(goc) {
	let n = '';
	try {
		n = git(goc, 'rev-parse', '--abbrev-ref', 'HEAD');
	} catch {}
	return !n || n === 'HEAD' ? process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '' : n;
}

/** Kiểm phạm vi của nhánh `nhanh` trong repo `goc`: null nếu không phải nhánh lô, không thì { lo, loi }. */
function kiemPhamVi(goc, nhanh) {
	const m = /^moi\/(d\d+-l\d+)$/i.exec(nhanh);
	if (!m) return null;
	const lo = m[1].toUpperCase();
	const trangLo = trangCuaLo(lo, goc);
	const nen = ['main', 'origin/main'].find((b) => {
		try {
			return git(goc, 'rev-parse', '--verify', '--quiet', `${b}^{commit}`);
		} catch {
			return false;
		}
	});
	if (!nen) throw new Error('không thấy nhánh main hay origin/main để so (GitHub Actions: actions/checkout với fetch-depth: 0)');
	const chung = git(goc, 'merge-base', 'HEAD', nen);
	const file = new Set(
		[git(goc, 'diff', '--name-only', '--no-renames', chung), git(goc, 'ls-files', '--others', '--exclude-standard')].join('\n').split('\n').filter(Boolean),
	);
	const loi = [...file].sort().filter((f) => !trongPhamVi(f, lo, trangLo)).map((f) => `${f}: ngoài phạm vi của lô ${lo}`);
	let truoc = {};
	try {
		truoc = JSON.parse(git(goc, 'show', `${chung}:kiem-dinh/khoa.json`)).trang ?? {};
	} catch {}
	const nay = docKhoa(goc).trang;
	for (const t of new Set([...Object.keys(truoc), ...Object.keys(nay)]))
		if (truoc[t] !== nay[t] && !trangLo.includes(t)) loi.push(`kiem-dinh/khoa.json: trang ${t} không thuộc lô ${lo} mà ${!truoc[t] ? 'được khóa' : !nay[t] ? 'bị mở khóa' : 'đổi mã băm'}`);
	return { lo, loi };
}

test('anh-xa.md: đọc được trang của mọi lô, mỗi trang cũ thuộc đúng một lô', () => {
	const lo = [...fs.readFileSync(path.join(ROOT, 'plans/lam-lai/anh-xa.md'), 'utf8').matchAll(/^### (D\d+-L\d+) \((\d+) trang\)/gm)];
	assert.equal(lo.length, 31);
	const tatCa = [];
	for (const [, ma, so] of lo) {
		const trang = trangCuaLo(ma, ROOT);
		assert.equal(trang.length, Number(so), `${ma}: tiêu đề ghi ${so} trang mà bảng có ${trang.length}`);
		tatCa.push(...trang);
	}
	assert.equal(tatCa.length, 233);
	assert.equal(new Set(tatCa).size, 233);
	assert.deepEqual(trangCuaLo('d3-l2', ROOT).slice(0, 2), ['nhac-ly/09-quang', 'nhac-ly/10-hop-am-ba']);
});

test('phạm vi của một lô: trang của lô, thư mục chung, báo cáo của lô, phần giao riêng', () => {
	const trang = ['nhac-ly/09-quang', 'nhac-ly/10-hop-am-ba'];
	for (const f of [
		'src/content/docs/nhac-ly/10-hop-am-ba.md',
		'src/data/thuat-ngu.yml',
		'src/components/BanPhim.astro',
		'src/scripts/ban-phim.js',
		'public/vendor/x.js',
		'kiem-dinh/nhac-ly/10-hop-am-ba.yml',
		'kiem-dinh/khoa.json',
		'src/plugins/thanh-phan.mjs',
		'src/styles/thanh-phan.css',
		'tests/ban-phim.test.mjs',
		'plans/lam-lai/bao-cao/d3-l2.md',
		'plans/lam-lai/bao-cao/d3-l2/10-hop-am-ba-360.png',
		'plans/lam-lai/bao-cao/d3-l2-nhan-dinh.yml',
	])
		assert.ok(trongPhamVi(f, 'D3-L2', trang), `${f} phải thuộc phạm vi`);
	for (const f of [
		'src/content/docs/nhac-ly/01-cao-do-ten-not.md',
		'src/content/docs/index.md',
		'plans/lam-lai/bao-cao/d3-l20.md',
		'plans/lam-lai/README.md',
		'AGENTS.md',
		'astro.config.mjs',
		'package.json',
		'src/plugins/sap-co.mjs',
		'src/styles/opus.css',
		'src/khoa.mjs',
		'tools/khoa.mjs',
		'tests/khoa.test.mjs',
		'tests/pham-vi.test.mjs',
		'src/pages/tu-dien.astro',
	])
		assert.ok(!trongPhamVi(f, 'D3-L2', trang), `${f} phải ngoài phạm vi`);
	assert.ok(trongPhamVi('src/pages/tu-dien.astro', 'D3-L5', []));
	assert.ok(trongPhamVi('astro.config.mjs', 'D2-L1', ['index']));
	assert.ok(trongPhamVi('src/content/docs/index.md', 'D2-L1', ['index']));
	assert.ok(trongPhamVi('src/content/docs/blog/2026/bat-dau.md', 'D7-L3', ['blog/posts/2026-10-11-bat-dau', 'cap-nhat']));
});

test('nhánh lô trong repo thử: bắt file ngoài phạm vi (đã commit, chưa commit, file mới) và khóa trang của lô khác', () => {
	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-pham-vi-'));
	const g = (...ts) => execFileSync('git', ['-C', goc, '-c', 'user.name=thu', '-c', 'user.email=thu@example.com', ...ts], { stdio: 'ignore' });
	const ghi = (f, chu) => {
		fs.mkdirSync(path.dirname(path.join(goc, f)), { recursive: true });
		fs.writeFileSync(path.join(goc, f), chu);
	};
	try {
		g('init', '-q', '-b', 'main');
		ghi('plans/lam-lai/anh-xa.md', fs.readFileSync(path.join(ROOT, 'plans/lam-lai/anh-xa.md'), 'utf8'));
		ghi('src/content/docs/index.md', 'chủ\n');
		ghi('src/content/docs/nhac-ly/01-cao-do-ten-not.md', 'cũ\n');
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { index: 'sha256:a' }, ban_ghi: {} }));
		g('add', '-A');
		g('commit', '-q', '-m', 'nền');
		g('checkout', '-q', '-b', 'moi/d3-l2');
		ghi('src/content/docs/nhac-ly/10-hop-am-ba.md', 'mới\n');
		ghi('src/content/docs/nhac-ly/01-cao-do-ten-not.md', 'sửa\n');
		g('add', '-A');
		g('commit', '-q', '-m', 'lô');
		ghi('AGENTS.md', 'chưa commit\n');
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { 'nhac-ly/10-hop-am-ba': 'sha256:b', 'nhac-ly/01-cao-do-ten-not': 'sha256:c' }, ban_ghi: {} }));
		assert.equal(kiemPhamVi(goc, 'moi/d1-6-khoa'), null);
		assert.equal(kiemPhamVi(goc, 'main'), null);
		assert.deepEqual(kiemPhamVi(goc, 'moi/d3-l2'), {
			lo: 'D3-L2',
			loi: [
				'AGENTS.md: ngoài phạm vi của lô D3-L2',
				'src/content/docs/nhac-ly/01-cao-do-ten-not.md: ngoài phạm vi của lô D3-L2',
				'kiem-dinh/khoa.json: trang index không thuộc lô D3-L2 mà bị mở khóa',
				'kiem-dinh/khoa.json: trang nhac-ly/01-cao-do-ten-not không thuộc lô D3-L2 mà được khóa',
			],
		});
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});

test('nhánh đang làm: chỉ chạm file trong phạm vi của lô (nhánh moi/d<đợt>-l<lô>; nhánh khác bỏ qua)', (t) => {
	const nhanh = nhanhHienTai(ROOT);
	const kq = kiemPhamVi(ROOT, nhanh);
	if (!kq) return t.skip(`nhánh ${nhanh || '(không rõ)'} không phải nhánh lô`);
	assert.deepEqual(kq.loi, [], `lô ${kq.lo} chạm chỗ ngoài phạm vi (plans/lam-lai/README.md, Quy tắc chung): việc khác thì ghi vào báo cáo`);
});
