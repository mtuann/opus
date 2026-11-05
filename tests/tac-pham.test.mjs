// Kiểm thử tac_pham (D6-0; plans/ben-vung/them-tac-pham.md mục 4): mọi trang tác phẩm (bài học, hướng dẫn nghe có
// tac_pham ở frontmatter) đủ mục bắt buộc theo mẫu của AGENTS.md, đúng thứ tự, chỉ thị đúng mục, bản ghi đủ trường, không
// còn chỗ "[[điền: …]]" (loiTacPham, tools/them-tac-pham.mjs). Phần khác của mục 4 ở kiểm thử khác: schema và tác giả
// (du-lieu.test.mjs), khuông nhạc (khuong-nhac.test.mjs), bản thu và giấy phép (ban-thu.test.mjs), link và anchor
// (link.test.mjs), mục đối chiếu khuông nhạc trong hồ sơ (tools/khoa.mjs khoa). Công cụ tạo khung chạy trên thư mục tạm.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { kiemTra } from '../src/du-lieu.mjs';
import { DIEN, MUC, loiTacPham, them, trangKhung, banGhiKhung } from '../tools/them-tac-pham.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');

/**
 * Trang đã chuyển trước khi có ::hoc-tiep (D1.8): lỗi còn chờ lô của trang sửa. Lô sửa xong thì xóa dòng ở đây (kiểm thử
 * hỏng khi lỗi không còn, để danh sách không cũ).
 */
const CHO_LO = {
	'piano/tac-pham/fur-elise': { lo: 'D6-L3', loi: ['cần đúng một ::hoc-tiep (trong mục "Học tiếp"), có 0'] },
};

const docTrang = (f) => {
	const chu = fs.readFileSync(f, 'utf8');
	return { chu, fm: parse(/^---\n([\s\S]*?)\n---/.exec(chu)?.[1] ?? '') ?? {} };
};

test('mọi trang tác phẩm: đủ mục theo mẫu, đúng thứ tự, chỉ thị đúng mục, bản ghi đủ trường, không còn chỗ [[điền]]', () => {
	const recs = new Map(parse(fs.readFileSync(path.join(ROOT, 'src/data/tac-pham.yml'), 'utf8')).map((r) => [r.slug, r]));
	let so = 0;
	for (const thu of ['piano/tac-pham', 'nghe-nhac']) {
		for (const f of fs.readdirSync(path.join(DOCS, thu)).filter((x) => x.endsWith('.md'))) {
			const trang = `${thu}/${f.slice(0, -3)}`;
			const { chu, fm } = docTrang(path.join(DOCS, thu, f));
			if (!fm.tac_pham) continue;
			so++;
			assert.ok(recs.has(fm.tac_pham), `${trang}: không có bản ghi ${fm.tac_pham}`);
			assert.deepEqual(loiTacPham({ trang, chu, rec: recs.get(fm.tac_pham) }), CHO_LO[trang]?.loi ?? [], `${trang} (mẫu trang: AGENTS.md, "Mẫu trang")`);
		}
	}
	assert.ok(so >= 2);
	for (const t of Object.keys(CHO_LO)) assert.ok(fs.existsSync(path.join(DOCS, `${t}.md`)), `CHO_LO: ${t} không còn, xóa dòng`);
});

test('loiTacPham: bắt mục thiếu, sai thứ tự, chỉ thị sai mục, bảng theo dõi, Nguồn không link, bản ghi thiếu trường', () => {
	const nguoi = new Map([['x', { id: 'x', ten: 'Anh X', sinh: 1800, mat: 1850, thoi_ky: 'Lãng mạn' }]]);
	const rec = banGhiKhung({ slug: 'b', loai: 'bai-hoc', tacGia: 'x', ten: 'Bài', chang: 2, grade: 'Grade 1' }, nguoi);
	const chu = trangKhung(rec, nguoi);
	// khung: chỉ còn chỗ cần điền (và mục Nguồn chưa có link)
	const loi = loiTacPham({ trang: 'piano/tac-pham/b', chu, rec });
	assert.deepEqual(loi.map((l) => l.replace(/\d+/, 'n')), ['trang còn n chỗ "[[điền: …]]"', 'bản ghi còn chỗ "[[điền: …]]"', 'mục "Nguồn" cần ít nhất một link']);
	// điền mọi chỗ bằng một link (mục Nguồn cần link)
	const sach = (s) => s.replaceAll(/\[\[điền: [^\]]*\]\]/g, '[chữ](https://x.org/)');
	const recSach = JSON.parse(sach(JSON.stringify(rec)));
	assert.deepEqual(loiTacPham({ trang: 'piano/tac-pham/b', chu: sach(chu), rec: recSach }), []);
	const sai = (thay, ...mong) => {
		const l = loiTacPham({ trang: 'piano/tac-pham/b', chu: thay(sach(chu)), rec: recSach });
		for (const m of mong) assert.ok(l.some((x) => x.includes(m)), `${m}: ${JSON.stringify(l)}`);
	};
	sai((s) => s.replace('## Bối cảnh\n', ''), 'thiếu mục: ## Bối cảnh');
	sai((s) => s.replace('## Diễn tấu', '## Tạm').replace('## Lỗi thường gặp', '## Diễn tấu').replace('## Tạm', '## Lỗi thường gặp'), 'không đúng thứ tự');
	sai((s) => s.replace('::hoc-tiep\n', ''), '::hoc-tiep');
	sai((s) => s.replace('\n::khoi-nghe\n', '\n').replace('## Cấu trúc\n', '## Cấu trúc\n\n::khoi-nghe\n'), '::khoi-nghe phải ở mục "Nghe trước khi tập"');
	sai((s) => s.replace('::hop-tac-pham\n', '').replace('## Bối cảnh\n', '## Bối cảnh\n\n::hop-tac-pham\n'), 'phần mở đầu');
	sai((s) => s.replace('| … |', '| 0:12 |'), 'cột đầu phải là "…"');
	sai((s) => s.replace(/## Nguồn\n[\s\S]*$/, '## Nguồn\n\n- Sách in.\n'), 'mục "Nguồn" cần ít nhất một link');
	sai((s) => s.replace('```quiz', '```text'), '```quiz');
	const thieu = loiTacPham({ trang: 'piano/tac-pham/b', chu: sach(chu), rec: { ...recSach, ky_nang_chinh: undefined, thong_tin: recSach.thong_tin.slice(1) } });
	assert.ok(thieu.some((l) => l.includes('thiếu trường: ky_nang_chinh')));
	assert.ok(thieu.some((l) => l.includes('thong_tin của b cần đúng các dòng')));
	// hướng dẫn nghe: mục bắt buộc ít hơn; ::hinh-cau-truc theo hinh.nghe của bản ghi
	const n = banGhiKhung({ slug: 'n', loai: 'nghe', tacGia: 'x', ten: 'Nghe' }, nguoi);
	const chuN = sach(trangKhung(n, nguoi));
	const recN = JSON.parse(sach(JSON.stringify(n)));
	assert.deepEqual(loiTacPham({ trang: 'nghe-nhac/n', chu: chuN, rec: recN }), []);
	assert.deepEqual(loiTacPham({ trang: 'nghe-nhac/n', chu: chuN.replace(/## So sánh bản thu\n[\s\S]*?(?=## Nếu)/, ''), rec: recN }), []);
	assert.match(loiTacPham({ trang: 'nghe-nhac/n', chu: chuN, rec: { ...recN, hinh: undefined } }).join(), /có ::hinh-cau-truc mà bản ghi không có hinh\.nghe/);
	assert.match(loiTacPham({ trang: 'nghe-nhac/n', chu: chuN.replace('## Ghi chép của bạn', '## Ghi chép'), rec: recN }).join(), /thiếu mục: ## Ghi chép của bạn/);
	assert.deepEqual(MUC.nghe.at(-1), 'Nguồn');
});

/** Bản chép tối thiểu của repo cho công cụ: src/data, kiem-dinh/khoa.json, thư mục trang. */
function repoTam() {
	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-them-tac-pham-'));
	fs.cpSync(path.join(ROOT, 'src/data'), path.join(goc, 'src/data'), { recursive: true });
	fs.mkdirSync(path.join(goc, 'kiem-dinh'), { recursive: true });
	fs.copyFileSync(path.join(ROOT, 'kiem-dinh/khoa.json'), path.join(goc, 'kiem-dinh/khoa.json'));
	fs.mkdirSync(path.join(goc, 'src/content/docs'), { recursive: true });
	return goc;
}

test('them-tac-pham: thêm bản ghi ở cuối, một dòng trang.yml, trang khung đủ mục, hồ sơ mẫu; dữ liệu qua kiểm tra', () => {
	const goc = repoTam();
	const doc = (f) => fs.readFileSync(path.join(goc, f), 'utf8');
	try {
		const truoc = { tp: doc('src/data/tac-pham.yml'), trang: doc('src/data/trang.yml') };
		const doi = them({ slug: 'mozart-alla-turca', loai: 'bai-hoc', tacGia: 'mozart', ten: 'Rondo alla turca', chang: 5, grade: 'Grade 6', danhMuc: 'K. 331', ngay: '2027-01-15' }, goc, () => {});
		assert.deepEqual(doi, [
			'src/data/tac-pham.yml',
			'src/data/trang.yml',
			'src/content/docs/piano/tac-pham/mozart-alla-turca.md',
			'kiem-dinh/piano/tac-pham/mozart-alla-turca.yml',
			'kiem-dinh/du-lieu/tac-pham/mozart-alla-turca.yml',
		]);
		// chỉ thêm ở cuối, không sửa dòng có sẵn (them-tac-pham.md mục 4)
		assert.ok(doc('src/data/tac-pham.yml').startsWith(truoc.tp));
		assert.equal(doc('src/data/trang.yml'), truoc.trang + '- id: piano/tac-pham/mozart-alla-turca\n  tang: tac-pham\n');
		const { duLieu, loi } = kiemTra(path.join(goc, 'src/data'));
		assert.deepEqual(loi, []);
		const r = duLieu['tac-pham'].at(-1);
		assert.equal(r.slug, 'mozart-alla-turca');
		assert.deepEqual([r.tac_gia, r.chang, r.grade, r.danh_muc, r.thoi_ky, r.them_ngay, r.goi_y], ['mozart', 5, 'Grade 6', 'K. 331', 'Cổ điển', '2027-01-15', false]);
		assert.deepEqual(r.thong_tin[0], ['Nhà soạn nhạc', 'Wolfgang Amadeus Mozart (1756–1791)']);
		assert.equal(r.ban_thu, undefined);
		// kiểu viết như tac-pham.yml: hàng bảng một dòng, không đệm khoảng trắng trong []
		assert.match(doc('src/data/tac-pham.yml'), /\n  - \[Nhà soạn nhạc, Wolfgang Amadeus Mozart \(1756–1791\)\]\n/);
		const chu = doc('src/content/docs/piano/tac-pham/mozart-alla-turca.md');
		assert.match(chu, /^---\ntitle: "Mozart: Rondo alla turca"\n/);
		assert.ok(loiTacPham({ trang: 'piano/tac-pham/mozart-alla-turca', chu, rec: r }).every((l) => l.includes(DIEN) || l.includes('Nguồn')));
		const hs = parse(doc('kiem-dinh/piano/tac-pham/mozart-alla-turca.yml'));
		assert.equal(hs.trang, 'src/content/docs/piano/tac-pham/mozart-alla-turca.md');
		assert.equal(hs.tang, 'tac-pham');
		assert.equal(parse(doc('kiem-dinh/du-lieu/tac-pham/mozart-alla-turca.yml')).ban_ghi, 'tac-pham/mozart-alla-turca');
		// hướng dẫn nghe, cùng repo
		them({ slug: 'debussy-arabesque-nghe', loai: 'nghe', tacGia: 'debussy', ten: 'Arabesque số 1' }, goc, () => {});
		assert.deepEqual(kiemTra(path.join(goc, 'src/data')).loi, []);
		assert.match(doc('src/content/docs/nghe-nhac/debussy-arabesque-nghe.md'), /\| Nhà soạn nhạc \| Claude Debussy \(1862–1918\) \|/);
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});

test('them-tac-pham: sai thì báo và không để lại thay đổi nào', () => {
	const goc = repoTam();
	const doc = (f) => fs.readFileSync(path.join(goc, f), 'utf8');
	try {
		const truoc = [doc('src/data/tac-pham.yml'), doc('src/data/trang.yml')];
		const thu = (o, re) => {
			assert.throws(() => them({ loai: 'bai-hoc', tacGia: 'mozart', ten: 'T', chang: 3, grade: 'Grade 3', ...o }, goc, () => {}), re);
			assert.deepEqual([doc('src/data/tac-pham.yml'), doc('src/data/trang.yml')], truoc);
			assert.deepEqual(fs.readdirSync(path.join(goc, 'src/content/docs')), []);
			assert.deepEqual(fs.readdirSync(path.join(goc, 'kiem-dinh')), ['khoa.json']);
		};
		thu({ slug: 'fur-elise' }, /đã có bản ghi fur-elise/);
		thu({ slug: 'Sai Ten' }, /slug chỉ gồm/);
		thu({ slug: 'moi', tacGia: 'khong-co-ai' }, /nha-soan-nhac\.yml chưa có "khong-co-ai"/);
		thu({ slug: 'moi', chang: undefined }, /cần --chang/);
		thu({ slug: 'moi', khuyetDanh: true }, /đúng một trong hai/);
		// cap tới trang có bản ghi riêng: bản ghi kia phải trỏ lại (sửa bản ghi đã có: việc riêng), kiểm chéo bắt và trả lại
		thu({ slug: 'moi', cap: 'nghe-nhac/mozart-k331' }, /phải có cap "piano\/tac-pham\/moi"/);
		// chip cấp độ lấy từ grade; grade không hợp chặng thì kiểm chéo bắt
		thu({ slug: 'moi', chang: 1, grade: 'Grade 8' }, /Grade/);
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});
