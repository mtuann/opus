// Kiểm thử phạm vi lô (D1.6; plans/lam-lai/README.md, mục Quy tắc chung): trên nhánh moi/d<đợt>-l<lô>, mọi file khác
// với main (kể cả file chưa commit) phải thuộc phạm vi của lô; trang khóa, đổi mã băm hay mở khóa trong
// kiem-dinh/khoa.json phải là trang của lô; khóa bản ghi đã có ở main không đổi, không bị gỡ (mở khóa đi nhánh mo/…).
// Trang của lô lấy từ plans/lam-lai/anh-xa.md. Nhánh khác thì bỏ qua.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { docKhoa, maBamKhoaBanGhi, tachKhoaBanGhi } from '../src/khoa.mjs';
import { trangCuaLo } from '../tools/khoa.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const git = (goc, ...ts) => execFileSync('git', ['-C', goc, ...ts], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/**
 * Phạm vi chung của một lô: trang của lô; dữ liệu; thành phần, script, file tĩnh; hồ sơ (của trang trong lô, của bản ghi,
 * và khoa.json); báo cáo của lô (cả ảnh chụp,
 * danh sách nhận định, kết quả lượt 2, mẫu kiểm). Thêm theo AGENTS.md: lô làm thành phần thì đăng ký nó trong
 * src/plugins/thanh-phan.mjs, thêm CSS vào src/styles/thanh-phan.css và kiểm thử vào tests/, trừ hai kiểm thử canh cổng
 * (khóa và phạm vi).
 */
const CHUNG = [
	/^src\/(data|components|scripts)\//,
	/^public\//,
	/^kiem-dinh\/(khoa\.json$|du-lieu\/)/,
	/^src\/plugins\/thanh-phan\.mjs$/,
	/^src\/styles\/thanh-phan\.css$/,
	/^tests\/(?!khoa\.test\.mjs$|pham-vi\.test\.mjs$)/,
];

/** Việc kế hoạch giao riêng cho một lô, ngoài phạm vi chung (plans/lam-lai/README.md, mục của đợt). */
const THEM = {
	// trang chủ thật, 7 trang chặng sinh từ dữ liệu, menu đủ 9 nhóm
	'D2-L1': ['astro.config.mjs', 'src/nhom.mjs', 'src/styles/opus.css', 'src/pages/', 'src/ban-build.mjs'],
	// trang Từ điển sinh từ thuat-ngu.yml
	// chỉ thị ::tu-dien đăng ký trong plugin đọc trang
	'D3-L5': ['src/pages/', 'src/ban-build.mjs', 'src/plugins/opus-markdown.mjs'],
	// chỉ thị ::dong-thoi-gian, ::bang-nha-soan-nhac (dòng thời gian từ nha-soan-nhac.yml) đăng ký trong plugin đọc trang
	'D5-L1': ['src/plugins/opus-markdown.mjs'],
	// sách in sinh lúc build từ trang có trong bản build (thay books.py cũ), service worker và manifest (dùng khi mất mạng,
	// cài như ứng dụng), danh sách bài blog và nhật ký tác phẩm mới ở trang Cập nhật (chỉ thị trong plugin đọc trang),
	// frontmatter của bài blog (date)
	'D7-L3': ['astro.config.mjs', 'src/content.config.ts', 'src/ban-build.mjs', 'src/plugins/opus-markdown.mjs', 'src/sach/', 'src/ung-dung/'],
	// hai workflow hằng tuần (trang cần rà lại, link ra ngoài), script của chúng, ngày kiểm và ngày rà lại ở đầu trang tham
	// chiếu (đọc hồ sơ qua src/kiem-dinh.mjs)
	'D8-L1': ['.github/workflows/ra-lai.yml', '.github/workflows/kiem-link.yml', 'tools/ra-lai.mjs', 'tools/kiem-link.mjs', 'src/kiem-dinh.mjs'],
	// danh mục tác phẩm sinh từ dữ liệu (trang mới trong src/pages/, lọc theo chặng, thời kỳ, tác giả, loại), cùng hai
	// trang mục lục piano/tac-pham/index, nghe-nhac/index của lô; menu (src/nhom.mjs) và sách in có tác phẩm (src/sach/)
	// đọc danh sách tác phẩm từ dữ liệu, để tác phẩm thêm sau đợt 6 tự vào (D6-0 chọn, plans/lam-lai/bao-cao/d6-0.md)
	// hồ sơ bản ghi khóa từng phần: lần kiểm định mới cho trường chưa khóa (đợt 6 khóa nốt bản ghi tác phẩm) không làm khóa
	// cũ thành "hồ sơ chưa đủ" (loiHoSo của tools/khoa.mjs, tests/khoa-tung-phan.test.mjs); nên gộp riêng vào main trước lô
	'D6-L1': ['tools/khoa.mjs', 'tests/khoa.test.mjs', 'tests/pham-vi.test.mjs'],
	'D6-L11': ['src/pages/', 'src/ban-build.mjs', 'src/nhom.mjs', 'src/sach/', 'src/plugins/opus-markdown.mjs'],
};

/** File `file` (đường dẫn từ gốc repo) có thuộc phạm vi của lô `lo` ("D3-L2"), với các trang `trangLo`, không. */
function trongPhamVi(file, lo, trangLo) {
	if (CHUNG.some((re) => re.test(file))) return true;
	if ((THEM[lo] ?? []).some((p) => (p.endsWith('/') ? file.startsWith(p) : file === p))) return true;
	// hồ sơ kiểm định của trang: chỉ của trang trong lô
	const hs = /^kiem-dinh\/(.+)\.yml$/.exec(file);
	if (hs) return trangLo.includes(hs[1]);
	const bc = `plans/lam-lai/bao-cao/${lo.toLowerCase()}`;
	if (file.startsWith(bc) && /^[./-]/.test(file.slice(bc.length))) return true;
	const m = /^src\/content\/docs\/(.+)\.mdx?$/.exec(file);
	if (!m) return false;
	// bài blog đổi đường dẫn theo cú pháp site mới (README, đợt 7)
	return trangLo.includes(m[1]) || (m[1].startsWith('blog/') && trangLo.some((t) => t.startsWith('blog/')));
}

/**
 * Nhánh thêm một tác phẩm sau đợt 6, them/<slug> (plans/ben-vung/them-tac-pham.md mục 4): chỉ tạo file của tác phẩm và
 * nối thêm vào dữ liệu, không sửa dòng có sẵn. `file`: đường dẫn từ gốc; trả về true nếu được chạm.
 */
export function trongPhamViThem(file, slug) {
	const ten = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return [
		/^src\/data\/(tac-pham|nha-soan-nhac|trang)\.yml$/,
		new RegExp(`^src/content/docs/(piano/tac-pham|nghe-nhac)/${ten}\\.md$`),
		new RegExp(`^kiem-dinh/(piano/tac-pham|nghe-nhac)/${ten}\\.yml$`),
		new RegExp(`^kiem-dinh/du-lieu/tac-pham/${ten}\\.yml$`),
		/^kiem-dinh\/du-lieu\/nha-soan-nhac\/[a-z0-9-]+\.yml$/,
		/^kiem-dinh\/khoa\.json$/,
		// file của tác phẩm: <slug>.mp3 hay <slug>-<số phần>.mp3 (không khớp file của tác phẩm khác có slug dài hơn)
		new RegExp(`^public/audio/${ten}(-\\d+)?\\.mp3$`),
		/^public\/audio\/NGUON\.txt$/,
		new RegExp(`^plans/ben-vung/bao-cao/them-${ten}\\.md$`),
	].some((re) => re.test(file));
}

/** File chỉ được nối thêm ở cuối trên nhánh them/<slug>: dữ liệu dùng chung và tệp nguồn âm thanh. */
const CHI_NOI = ['src/data/tac-pham.yml', 'src/data/nha-soan-nhac.yml', 'src/data/trang.yml', 'public/audio/NGUON.txt'];
/** File đã có được sửa trên nhánh them/<slug>: CHI_NOI (nối thêm) và khoa.json (thêm khóa); file khác phải là file mới. */
const DUOC_SUA = new Set([...CHI_NOI, 'kiem-dinh/khoa.json']);

/** Kiểm nhánh them/<slug> trong repo `goc`: null nếu không phải nhánh ấy, không thì { slug, loi }. */
function kiemPhamViThem(goc, nhanh) {
	const m = /^them\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(nhanh);
	if (!m) return null;
	const slug = m[1];
	const nen = ['main', 'origin/main'].find((b) => {
		try {
			return git(goc, 'rev-parse', '--verify', '--quiet', `${b}^{commit}`);
		} catch {
			return false;
		}
	});
	if (!nen) throw new Error('không thấy nhánh main hay origin/main để so');
	const chung = git(goc, 'merge-base', 'HEAD', nen);
	const tach = (chu) => chu.split('\n').filter(Boolean);
	const moi = new Set([...tach(git(goc, 'diff', '--name-only', '--no-renames', '--diff-filter=A', chung)), ...tach(git(goc, 'ls-files', '--others', '--exclude-standard'))]);
	const file = new Set([...tach(git(goc, 'diff', '--name-only', '--no-renames', chung)), ...moi]);
	const loi = [];
	for (const f of [...file].sort()) {
		if (!trongPhamViThem(f, slug)) loi.push(`${f}: ngoài phạm vi của nhánh them/${slug} (them-tac-pham.md mục 4)`);
		else if (!moi.has(f) && !DUOC_SUA.has(f)) loi.push(`${f}: file đã có, nhánh them/${slug} chỉ được tạo file mới (sửa file có sẵn là việc riêng)`);
	}
	const cu = (f) => {
		try {
			return execFileSync('git', ['-C', goc, 'show', `${chung}:${f}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
		} catch {
			return '';
		}
	};
	for (const f of CHI_NOI.filter((x) => file.has(x))) {
		const truoc = cu(f).replace(/\n*$/, '\n');
		if (!fs.readFileSync(path.join(goc, f), 'utf8').startsWith(truoc)) loi.push(`${f}: chỉ được nối thêm ở cuối, không sửa dòng có sẵn`);
	}
	// khoa.json: khóa đã có giữ nguyên; khóa mới chỉ của trang và bản ghi của tác phẩm (và tác giả mới)
	if (file.has('kiem-dinh/khoa.json')) {
		let truoc = {};
		try {
			truoc = JSON.parse(cu('kiem-dinh/khoa.json'));
		} catch {}
		const nay = docKhoa(goc);
		// tác giả vừa thêm vào cuối nha-soan-nhac.yml trên nhánh này
		const idNguoi = (chu) => new Set([...chu.matchAll(/^- id: ([a-z0-9-]+)\s*$/gm)].map((x) => x[1]));
		const nguoiCu = idNguoi(cu('src/data/nha-soan-nhac.yml'));
		const nguoiMoi = [...idNguoi(fs.existsSync(path.join(goc, 'src/data/nha-soan-nhac.yml')) ? fs.readFileSync(path.join(goc, 'src/data/nha-soan-nhac.yml'), 'utf8') : '')].filter((x) => !nguoiCu.has(x));
		for (const bang of ['trang', 'ban_ghi']) {
			for (const [k, v] of Object.entries(truoc[bang] ?? {})) if (nay[bang][k] !== v) loi.push(`kiem-dinh/khoa.json: ${k} đã khóa ở main mà bị đổi hay gỡ`);
			for (const k of Object.keys(nay[bang]).filter((x) => !(x in (truoc[bang] ?? {}))))
				if (!(bang === 'trang' ? [`piano/tac-pham/${slug}`, `nghe-nhac/${slug}`].includes(k) : k.split('#')[0] === `tac-pham/${slug}` || nguoiMoi.some((id) => k.split('#')[0] === `nha-soan-nhac/${id}`)))
					loi.push(`kiem-dinh/khoa.json: khóa mới ${k} không thuộc tác phẩm ${slug}`);
		}
	}
	return { slug, loi };
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
		truoc = JSON.parse(git(goc, 'show', `${chung}:kiem-dinh/khoa.json`));
	} catch {}
	const nay = docKhoa(goc);
	const [tTruoc, tNay] = [truoc.trang ?? {}, nay.trang];
	for (const t of new Set([...Object.keys(tTruoc), ...Object.keys(tNay)]))
		if (tTruoc[t] !== tNay[t] && !trangLo.includes(t)) loi.push(`kiem-dinh/khoa.json: trang ${t} không thuộc lô ${lo} mà ${!tTruoc[t] ? 'được khóa' : !tNay[t] ? 'bị mở khóa' : 'đổi mã băm'}`);
	// bản ghi: khóa mới thì cho. Khóa đã có ở main không được đổi mã băm hay bị gỡ, trừ khóa từng phần được thay bằng khóa
	// rộng hơn của cùng bản ghi (cả bản ghi, hay nhiều trường hơn), khi các trường đã khóa vẫn y như cũ
	for (const [k, ma] of Object.entries(truoc.ban_ghi ?? {})) {
		if (nay.ban_ghi[k] === ma) continue;
		if (k in nay.ban_ghi) {
			loi.push(`kiem-dinh/khoa.json: bản ghi ${k} đã khóa ở main mà đổi mã băm`);
			continue;
		}
		const { banGhi, truong } = tachKhoaBanGhi(k);
		const thay = truong && Object.keys(nay.ban_ghi).some((x) => {
			const moi = tachKhoaBanGhi(x);
			return moi.banGhi === banGhi && (!moi.truong || truong.every((t) => moi.truong.includes(t)));
		});
		if (!thay) loi.push(`kiem-dinh/khoa.json: bản ghi ${k} đã khóa ở main mà bị gỡ`);
		else if (maBamKhoaBanGhi(k, goc) !== ma) loi.push(`kiem-dinh/khoa.json: bản ghi ${k} được thay bằng khóa rộng hơn mà trường đã khóa bị sửa`);
	}
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
		'kiem-dinh/du-lieu/tac-pham/fur-elise.yml',
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
		'kiem-dinh/index.yml',
		'kiem-dinh/nhac-ly/01-cao-do-ten-not.yml',
	])
		assert.ok(!trongPhamVi(f, 'D3-L2', trang), `${f} phải ngoài phạm vi`);
	assert.ok(trongPhamVi('src/pages/tu-dien.astro', 'D3-L5', []));
	assert.ok(trongPhamVi('astro.config.mjs', 'D2-L1', ['index']));
	assert.ok(trongPhamVi('src/content/docs/index.md', 'D2-L1', ['index']));
	assert.ok(trongPhamVi('src/content/docs/blog/2026/bat-dau.md', 'D7-L3', ['blog/posts/2026-10-11-bat-dau', 'cap-nhat']));
});

test('nhánh lô trong repo thử: bắt file ngoài phạm vi (đã commit, chưa commit, file mới), hồ sơ và khóa trang của lô khác, khóa bản ghi bị đổi hay gỡ', () => {
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
		const DU_LIEU = (y, w) => `- slug: u\n  ten: U\n- slug: v\n  ten: V\n  loai: nghe\n- slug: w\n  ten: ${w}\n- slug: x\n  ten: X\n- slug: y\n  ten: ${y}\n- slug: z\n  ten: Z\n`;
		ghi('src/data/tac-pham.yml', DU_LIEU('Y', 'W'));
		ghi('kiem-dinh/index.yml', 'trang: src/content/docs/index.md\n');
		const ma = (k) => maBamKhoaBanGhi(k, goc);
		const khoaBg = (...ks) => Object.fromEntries(ks.map((k) => [k, ma(k)]));
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { index: 'sha256:a' }, ban_ghi: khoaBg('tac-pham/u#ten', 'tac-pham/v#loai,ten', 'tac-pham/w#ten', 'tac-pham/x#ten', 'tac-pham/y#ten', 'tac-pham/z#ten') }));
		g('add', '-A');
		g('commit', '-q', '-m', 'nền');
		g('checkout', '-q', '-b', 'moi/d3-l2');
		ghi('src/content/docs/nhac-ly/10-hop-am-ba.md', 'mới\n');
		ghi('src/content/docs/nhac-ly/01-cao-do-ten-not.md', 'sửa\n');
		g('add', '-A');
		g('commit', '-q', '-m', 'lô');
		ghi('AGENTS.md', 'chưa commit\n');
		ghi('kiem-dinh/index.yml', 'trang: src/content/docs/index.md\nghi_chu: sửa lén\n');
		// u: khóa giữ nguyên (không báo); v: thu hẹp khóa (#loai,ten thành #ten); w: sửa trường đã khóa rồi thay bằng khóa
		// cả bản ghi; x: khóa cả bản ghi thay khóa từng phần, dữ liệu không đổi (được); y: sửa trường đã khóa rồi tính lại
		// mã băm bằng tay; z: gỡ khóa
		ghi('src/data/tac-pham.yml', DU_LIEU('Y2', 'W2'));
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { 'nhac-ly/10-hop-am-ba': 'sha256:b', 'nhac-ly/01-cao-do-ten-not': 'sha256:c' }, ban_ghi: khoaBg('tac-pham/u#ten', 'tac-pham/v#ten', 'tac-pham/w', 'tac-pham/x', 'tac-pham/y#ten') }));
		assert.equal(kiemPhamVi(goc, 'moi/d1-6-khoa'), null);
		assert.equal(kiemPhamVi(goc, 'main'), null);
		assert.deepEqual(kiemPhamVi(goc, 'moi/d3-l2'), {
			lo: 'D3-L2',
			loi: [
				'AGENTS.md: ngoài phạm vi của lô D3-L2',
				'kiem-dinh/index.yml: ngoài phạm vi của lô D3-L2',
				'src/content/docs/nhac-ly/01-cao-do-ten-not.md: ngoài phạm vi của lô D3-L2',
				'kiem-dinh/khoa.json: trang index không thuộc lô D3-L2 mà bị mở khóa',
				'kiem-dinh/khoa.json: trang nhac-ly/01-cao-do-ten-not không thuộc lô D3-L2 mà được khóa',
				'kiem-dinh/khoa.json: bản ghi tac-pham/v#loai,ten đã khóa ở main mà bị gỡ',
				'kiem-dinh/khoa.json: bản ghi tac-pham/w#ten được thay bằng khóa rộng hơn mà trường đã khóa bị sửa',
				'kiem-dinh/khoa.json: bản ghi tac-pham/y#ten đã khóa ở main mà đổi mã băm',
				'kiem-dinh/khoa.json: bản ghi tac-pham/z#ten đã khóa ở main mà bị gỡ',
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

test('phạm vi nhánh them/<slug>: chỉ file của tác phẩm, dữ liệu chỉ nối thêm ở cuối', () => {
	for (const f of [
		'src/data/tac-pham.yml',
		'src/data/trang.yml',
		'src/data/nha-soan-nhac.yml',
		'src/content/docs/piano/tac-pham/mozart-alla-turca.md',
		'src/content/docs/nghe-nhac/mozart-alla-turca.md',
		'kiem-dinh/piano/tac-pham/mozart-alla-turca.yml',
		'kiem-dinh/du-lieu/tac-pham/mozart-alla-turca.yml',
		'kiem-dinh/du-lieu/nha-soan-nhac/satie.yml',
		'kiem-dinh/khoa.json',
		'public/audio/mozart-alla-turca.mp3',
		'public/audio/mozart-alla-turca-2.mp3',
		'public/audio/NGUON.txt',
		'plans/ben-vung/bao-cao/them-mozart-alla-turca.md',
	])
		assert.ok(trongPhamViThem(f, 'mozart-alla-turca'), f);
	for (const f of [
		'src/data/cap-do.yml',
		'src/content/docs/piano/tac-pham/fur-elise.md',
		'src/content/docs/piano/gam.md',
		'kiem-dinh/piano/tac-pham/fur-elise.yml',
		'kiem-dinh/du-lieu/tac-pham/fur-elise.yml',
		'public/audio/fur-elise.mp3',
		'public/audio/mozart-alla-turca-sonata-1.mp3',
		'src/plugins/thanh-phan.mjs',
		'AGENTS.md',
	])
		assert.ok(!trongPhamViThem(f, 'mozart-alla-turca'), f);

	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-pham-vi-them-'));
	const g = (...ts) => execFileSync('git', ['-C', goc, '-c', 'user.name=thu', '-c', 'user.email=thu@example.com', ...ts], { stdio: 'ignore' });
	const ghi = (f, chu) => {
		fs.mkdirSync(path.dirname(path.join(goc, f)), { recursive: true });
		fs.writeFileSync(path.join(goc, f), chu);
	};
	try {
		g('init', '-q', '-b', 'main');
		ghi('src/data/tac-pham.yml', '- slug: u\n  ten: U\n');
		ghi('src/data/trang.yml', '- id: a\n  tang: loi\n');
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { a: 'sha256:a' }, ban_ghi: { 'tac-pham/u#ten': 'sha256:u' } }));
		g('add', '-A');
		g('commit', '-q', '-m', 'nền');
		g('checkout', '-q', '-b', 'them/moi');
		ghi('src/data/tac-pham.yml', '- slug: u\n  ten: U\n- slug: moi\n  ten: Mới\n');
		ghi('src/data/trang.yml', '- id: a\n  tang: loi\n- id: piano/tac-pham/moi\n  tang: tac-pham\n');
		ghi('src/content/docs/piano/tac-pham/moi.md', 'trang\n');
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { a: 'sha256:a', 'piano/tac-pham/moi': 'sha256:m' }, ban_ghi: { 'tac-pham/u#ten': 'sha256:u', 'tac-pham/moi': 'sha256:n' } }));
		assert.deepEqual(kiemPhamViThem(goc, 'them/moi'), { slug: 'moi', loi: [] });
		assert.equal(kiemPhamViThem(goc, 'moi/d6-l1'), null);
		// sửa dòng có sẵn, file ngoài phạm vi, khóa của mục khác
		ghi('src/data/tac-pham.yml', '- slug: u\n  ten: U sửa\n- slug: moi\n  ten: Mới\n');
		ghi('src/content/docs/piano/gam.md', 'sửa\n');
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { 'piano/tac-pham/moi': 'sha256:m', b: 'sha256:b' }, ban_ghi: { 'tac-pham/u#ten': 'sha256:u2' } }));
		assert.deepEqual(kiemPhamViThem(goc, 'them/moi').loi, [
			'src/content/docs/piano/gam.md: ngoài phạm vi của nhánh them/moi (them-tac-pham.md mục 4)',
			'src/data/tac-pham.yml: chỉ được nối thêm ở cuối, không sửa dòng có sẵn',
			'kiem-dinh/khoa.json: a đã khóa ở main mà bị đổi hay gỡ',
			'kiem-dinh/khoa.json: khóa mới b không thuộc tác phẩm moi',
			'kiem-dinh/khoa.json: tac-pham/u#ten đã khóa ở main mà bị đổi hay gỡ',
		]);
		// file đã có ở main (dù tên khớp mẫu) chỉ được tạo mới, không sửa; khóa tác giả chỉ của tác giả vừa thêm
		g('checkout', '-q', '--', '.');
		fs.rmSync(path.join(goc, 'src/content/docs/piano/gam.md'), { force: true });
		g('checkout', '-q', 'main');
		ghi('public/audio/moi.mp3', 'cũ');
		ghi('kiem-dinh/du-lieu/nha-soan-nhac/x.yml', 'cũ\n');
		ghi('src/data/nha-soan-nhac.yml', '- id: x\n  ten: X\n');
		g('add', '-A');
		g('commit', '-q', '-m', 'file đã có');
		g('checkout', '-q', '-B', 'them/moi');
		ghi('public/audio/moi.mp3', 'sửa');
		ghi('kiem-dinh/du-lieu/nha-soan-nhac/x.yml', 'sửa\n');
		ghi('src/data/nha-soan-nhac.yml', '- id: x\n  ten: X\n- id: y\n  ten: Y\n');
		ghi('kiem-dinh/du-lieu/nha-soan-nhac/y.yml', 'mới\n');
		ghi('kiem-dinh/khoa.json', JSON.stringify({ trang: { a: 'sha256:a' }, ban_ghi: { 'tac-pham/u#ten': 'sha256:u', 'nha-soan-nhac/y': 'sha256:y', 'nha-soan-nhac/x#ten': 'sha256:x' } }));
		assert.deepEqual(kiemPhamViThem(goc, 'them/moi').loi, [
			'kiem-dinh/du-lieu/nha-soan-nhac/x.yml: file đã có, nhánh them/moi chỉ được tạo file mới (sửa file có sẵn là việc riêng)',
			'public/audio/moi.mp3: file đã có, nhánh them/moi chỉ được tạo file mới (sửa file có sẵn là việc riêng)',
			'kiem-dinh/khoa.json: khóa mới nha-soan-nhac/x#ten không thuộc tác phẩm moi',
		]);
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});

test('nhánh đang làm them/<slug>: chỉ chạm file của tác phẩm (nhánh khác bỏ qua)', (t) => {
	const nhanh = nhanhHienTai(ROOT);
	const kq = kiemPhamViThem(ROOT, nhanh);
	if (!kq) return t.skip(`nhánh ${nhanh || '(không rõ)'} không phải nhánh them/<slug>`);
	assert.deepEqual(kq.loi, [], `nhánh them/${kq.slug} chạm chỗ ngoài phạm vi (plans/ben-vung/them-tac-pham.md mục 4): việc khác là việc riêng`);
});
