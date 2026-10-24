// Kiểm thử thành phần của lô D2-L1: sơ đồ 7 chặng (::hinh{ten="lo-trinh"}), bài kiểm tra đầu vào (khối ```placement), chặng
// piano tự đánh giá (::cong-cu{ten="piano-level"}), ô gợi ý tập ở trang chủ (::cong-cu{ten="goi-y-tap"}), tên tác phẩm trong
// danh sách, link do JavaScript dựng ("sắp có" như link dựng lúc build), trang chặng trong danh sách trang của bản build, và
// bọc plugin ở bản thật (trang chưa khóa không qua plugin). Chạy thẳng hàm và Sätteri, không cần build; trang chặng và ô gợi ý
// trên bản build: tests/trang-chang.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { chiTrangTrongBan, trangChang, trangDocsTrongBan, trangTrongBan } from '../src/ban-build.mjs';
import { chiDaKhoa, duLieuDaKiem } from '../src/du-lieu.mjs';
import { sapCo } from '../src/plugins/sap-co.mjs';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import {
	canTaiScript,
	congCu,
	docPlacement,
	duLieuCho,
	ganDung,
	goiYTap,
	goiYTheoChang,
	gradeChang,
	hinh,
	hinhLoTrinh,
	lienKet,
	placement,
	tenTrongDanhSach,
} from '../src/plugins/thanh-phan.mjs';
import { lienKet as lienKetJs } from '../src/scripts/lien-ket.js';
import { dungGoiY } from '../src/scripts/goi-y.js';
import { tinhChang } from '../src/scripts/muc-do.js';
import { ketQua } from '../src/scripts/placement.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const giaiMa = (s) => s.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const json = (html, ten) => JSON.parse(giaiMa(new RegExp(`${ten}="([^"]*)"`).exec(html)[1]));

test('link do JavaScript dựng: cùng HTML với link dựng lúc build (src/plugins/sap-co.mjs), cả khi trang đã có lẫn chưa có', () => {
	const chu = '<em>Gam</em> trưởng';
	const quaPlugin = (trangCo) => markdownToHtml(`<p><a href="/opus/piano/gam/">${chu}</a></p>`, { hastPlugins: [sapCo({ base: '/opus/', trangCo: () => trangCo })] }).html;
	assert.equal(`<p>${lienKet('/opus/piano/gam/', chu, false)}</p>`, quaPlugin([]).trim());
	assert.equal(`<p>${lienKet('/opus/piano/gam/', chu, true)}</p>`, quaPlugin(['piano/gam']).trim());
	for (const co of [true, false]) assert.equal(lienKetJs('/opus/piano/gam/', chu, co), lienKet('/opus/piano/gam/', chu, co), 'script và build dựng giống nhau');
});

test('tên tác phẩm trong danh sách: "Tác giả: tên" như bảng cũ, số danh mục không ghi lại; khuyết danh, gán cho thì chỉ tên', () => {
	const { tacPham, nguoi } = duLieuCho('thử');
	const ten = (slug) => tenTrongDanhSach(tacPham.find((r) => r.slug === slug), nguoi);
	assert.equal(ten('fur-elise'), 'Beethoven: *Für Elise* WoO 59');
	assert.equal(ten('debussy-clair-de-lune'), 'Debussy: *Clair de lune*');
	assert.equal(ten('musette-re'), 'Musette Rê trưởng, BWV Anh. 126');
	assert.match(ten('beethoven-sonatina-sol'), /^Sonatina Sol trưởng, Anh\. 5 số 1 \(gán cho Beethoven\)$/);
});

test('Grade của chặng như trong trang: "≈ Grade 3"; trước Grade 1 và diploma giữ nguyên', () => {
	assert.equal(gradeChang({ tuong_duong: 'Grade 3' }), '≈ Grade 3');
	assert.equal(gradeChang({ tuong_duong: 'trước Grade 1' }), 'trước Grade 1');
	assert.equal(gradeChang({ tuong_duong: 'diploma trở lên' }), 'diploma trở lên');
	// Grade của bài (trường grade của tac-pham.yml) như chip cấp độ của bài học
	assert.equal(ganDung('Grade 8 trở lên'), '≈ Grade 8 trở lên');
	assert.equal(ganDung('Sau Grade 8'), 'Sau Grade 8');
});

test('trang chặng có trong danh sách trang của mọi bản build (link tới trang chặng không thành "sắp có"); menu đọc trang docs riêng', () => {
	const chang = duLieuDaKiem()['cap-do'].map((c) => `piano/lo-trinh/chang-${c.id}`).sort();
	assert.deepEqual(trangChang(), chang);
	const cu = process.env.OPUS_BAN;
	try {
		for (const b of [undefined, 'xem']) {
			if (b === undefined) delete process.env.OPUS_BAN;
			else process.env.OPUS_BAN = b;
			assert.deepEqual(trangTrongBan(), [...trangDocsTrongBan(), ...chang]);
			assert.ok(!trangDocsTrongBan().some((t) => t.includes('/chang-')));
		}
	} finally {
		if (cu === undefined) delete process.env.OPUS_BAN;
		else process.env.OPUS_BAN = cu;
	}
});

test('sơ đồ 7 chặng: mỗi chặng tên, Grade, mốc thời gian, thời lượng từ cap-do.yml, dẫn sang trang chặng; chặng đang xem có aria-current', () => {
	const { capDo } = duLieuCho('thử');
	const html = hinhLoTrinh(capDo, { hienTai: 3 });
	const muc = [...html.matchAll(/<li style="--i:(\d)"><a href="([^"]+)"( aria-current="page")?>[\s\S]*?<b><span class="oz-chang-n">Chặng \d\. <\/span>([^<]+)<\/b><span class="oz-chang-grade">([^<]+)<\/span><span class="oz-chang-tg"><span>([^<]+)<\/span> <span>([^<]+)<\/span>/g)];
	assert.deepEqual(
		muc.map((m) => [Number(m[1]), m[2], !!m[3], m[4], m[5], m[6], m[7]]),
		capDo.map((c) => [c.id, `/opus/piano/lo-trinh/chang-${c.id}/`, c.id === 3, c.ten, gradeChang(c), c.moc_thoi_gian, c.thoi_luong]),
	);
	assert.match(html, /^<figure class="oz-chang-hinh" data-sinh>/, 'data-sinh: so chữ với site cũ bỏ qua phần sinh từ dữ liệu');
	assert.equal(hinh('lo-trinh', 'piano/lo-trinh'), hinhLoTrinh(capDo));
	// trang chặng: bản gọn (màn hẹp: một hàng vòng số), cùng nội dung
	const gon = hinhLoTrinh(capDo, { hienTai: 3, gon: true });
	assert.equal(gon.replace(' oz-chang-hinh--gon', ''), html);
});

test('trang đã khóa: hình và công cụ dựng từ dữ liệu chỉ đọc trường đã khóa; thứ luôn đăng (luonKhoa) thì luôn chặn', () => {
	const khoaTrang = { trang: { 'piano/lo-trinh': 'x' }, ban_ghi: {} };
	assert.throws(() => hinhLoTrinh(duLieuCho('piano/lo-trinh', { khoa: khoaTrang }).capDo), /trang đã khóa piano\/lo-trinh hiện trường chưa khóa du-lieu\/cap-do\/1#ten/);
	const caCapDo = Object.fromEntries(duLieuDaKiem()['cap-do'].map((c) => [`cap-do/${c.id}`, 'x']));
	assert.match(hinhLoTrinh(duLieuCho('piano/lo-trinh', { khoa: { ...khoaTrang, ban_ghi: caCapDo } }).capDo), /Chặng 7/);
	// chưa khóa trang thì không chặn; luôn đăng thì chặn dù không có trang nào khóa
	assert.match(hinhLoTrinh(duLieuCho('piano/lo-trinh', { khoa: { trang: {}, ban_ghi: {} } }).capDo), /Chặng 7/);
	assert.throws(() => goiYTheoChang(duLieuCho('ô gợi ý tập', { luonKhoa: true, khoa: { trang: {}, ban_ghi: caCapDo } }), []), /ô gợi ý tập hiện trường chưa khóa du-lieu\/tac-pham\//);
	// chiDaKhoa vẫn cho đọc id
	assert.equal(chiDaKhoa({ id: 2, ten: 'x' }, 'cap-do', 'thử', () => false).id, 2);
});

test('khối placement: đọc bài, câu, đáp án; viết sai thì báo lỗi rõ', () => {
	const bai = docPlacement('@ 1 | Cao độ và tên nốt | nhac-ly/01-cao-do-ten-not/\n? Nốt Sol là gì?\n+ G\n- F\n@ 2 | Khóa | nhac-ly/02-khuong-nhac-khoa/\n? Hỏi?\n+ Đúng\n');
	assert.deepEqual(bai.map((b) => [b.n, b.ten, b.duong_dan, b.cau.length]), [[1, 'Cao độ và tên nốt', 'nhac-ly/01-cao-do-ten-not/', 1], [2, 'Khóa', 'nhac-ly/02-khuong-nhac-khoa/', 1]]);
	assert.deepEqual(bai[0].cau[0].opts, [{ t: 'G', ok: true }, { t: 'F', ok: false }]);
	assert.throws(() => docPlacement('@ 1 | Tên\n? Câu?\n+ A\n'), /phải dạng "@ số \| tên bài \| đường\/dẫn\/"/);
	assert.throws(() => docPlacement('@ 1 | Tên | a/b/\n? Câu?\n- A\n'), /không có đáp án đúng/);
	assert.throws(() => docPlacement('@ 1 | Tên | a/b/\n'), /bài 1 không có câu hỏi/);
	assert.throws(() => docPlacement('? Câu?\n+ A\n'), /dòng không hiểu/);
	assert.throws(() => docPlacement(''), /rỗng/);
});

test('công cụ placement: chữ dựng thành HTML (thẻ thô thành chữ), link tới bài kèm cờ có trong bản build; bộ tải thành phần nạp script', () => {
	const html = placement('@ 10 | Hợp âm ba | nhac-ly/10-hop-am-ba/\n? Rê – Fa – La là *loại* gì?\n+ Thứ <b>x</b>\n- Trưởng\n@ 1 | Tên nốt | nhac-ly/01-cao-do-ten-not/\n? A?\n+ B\n');
	assert.match(html, /^<div class="oz-placement oz-tool" data-placement="/);
	const d = json(html, 'data-placement');
	assert.equal(d.bai[0].cau[0].q, 'Rê – Fa – La là <em>loại</em> gì?');
	assert.equal(d.bai[0].cau[0].opts[0].t, 'Thứ &lt;b&gt;x&lt;/b&gt;');
	assert.deepEqual([d.bai[0].href, d.bai[1].href, d.nang_cao.href], ['/opus/nhac-ly/10-hop-am-ba/', '/opus/nhac-ly/01-cao-do-ten-not/', '/opus/nhac-ly/15-tiet-tau-nang-cao/']);
	assert.ok(d.bai.every((b) => typeof b.co === 'boolean'));
	assert.ok(canTaiScript(html));
	// trang thật: khối của trang, qua plugin như lúc build; thông số lạ thì báo
	const trang = 'bat-dau/kiem-tra-dau-vao';
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	const that = markdownToHtml('```placement\n(đọc từ nguồn của trang)\n```\n', { mdastPlugins: [plugin] }).html;
	assert.equal(json(that, 'data-placement').bai.length, 14);
	assert.throws(() => congCu({ ten: 'placement', x: '1' }, trang), /không nhận thông số/);
});

test('kết quả placement: bài đã nắm khi đúng mọi câu; bài nên bắt đầu là bài đầu tiên chưa nắm; "Tôi chưa biết" tính là chưa đúng', () => {
	const bai = [{ n: 1, cau: [{}, {}] }, { n: 2, cau: [{}, {}] }, { n: 3, cau: [{}] }];
	assert.deepEqual(ketQua(bai, [true, true, true, false, true]).batDau.n, 2);
	assert.equal(ketQua(bai, [true, true, true, true, true]).batDau, null);
	assert.deepEqual(ketQua(bai, [true, false, true, true, false]).theoBai.map((x) => [x.nam, x.dung, x.tong]), [[false, 1, 2], [true, 2, 2], [false, 0, 1]]);
});

test('chặng piano tự đánh giá: hai trong ba việc của một nhóm là xong chặng, đếm liền từ nhóm đầu, tối đa chặng cuối', () => {
	assert.equal(tinhChang([], 7), 1);
	assert.equal(tinhChang([[2, 3], [3, 3], [1, 3]], 7), 3);
	assert.equal(tinhChang([[1, 3], [3, 3]], 7), 1, 'nhóm đầu chưa xong thì không tính nhóm sau');
	assert.equal(tinhChang(Array(6).fill([3, 3]), 7), 7);
	assert.equal(tinhChang(Array(9).fill([3, 3]), 7), 7);
});

test('công cụ piano-level: mỗi chặng tên, Grade, trang chặng, bài nên bắt đầu (bài học có goi_y của chặng; chặng 1: trang khởi đầu)', () => {
	const html = congCu({ ten: 'piano-level' }, 'bat-dau/kiem-tra-dau-vao');
	assert.match(html, /^<div class="oz-muc-do oz-tool" aria-live="polite" data-chang="/);
	const { chang, lo_trinh } = json(html, 'data-chang');
	const { capDo, tacPham } = duLieuCho('thử');
	assert.deepEqual(chang.map((c) => c.id), capDo.map((c) => c.id));
	assert.deepEqual(chang[0].goi_y.map((x) => x.href), ['/opus/piano/hai-tuan-dau/', '/opus/piano/10-bai-dau-tien/']);
	for (const c of chang.slice(1))
		assert.deepEqual(
			c.goi_y.map((x) => x.href),
			tacPham.filter((r) => r.loai === 'bai-hoc' && r.chang === c.id && r.goi_y).map((r) => `/opus/piano/tac-pham/${r.slug}/`),
		);
	assert.equal(chang[2].trang.href, '/opus/piano/lo-trinh/chang-3/');
	assert.equal(lo_trinh.href, '/opus/piano/lo-trinh/');
	assert.ok(canTaiScript(html));
});

test('ô gợi ý tập: dữ liệu theo chặng (goi_y, chang), luôn đăng nên chỉ đọc trường đã khóa; phần dựng sẵn mời làm bài kiểm tra', () => {
	const ds = ['bat-dau/kiem-tra-dau-vao', 'nhac-ly/index', 'nhac-ly/10-hop-am-ba', 'piano/lo-trinh/chang-3'];
	const html = goiYTap(duLieuCho('thử', { luonKhoa: true }), ds);
	assert.match(html, /^<div class="oz-goi-y oz-tool" data-goi-y="/);
	assert.ok(canTaiScript(html));
	assert.match(html, /<strong>Chưa có chặng của bạn\.<\/strong> Làm <a href="\/opus\/bat-dau\/kiem-tra-dau-vao\/">bài kiểm tra đầu vào<\/a>/);
	const d = json(html, 'data-goi-y');
	assert.deepEqual(d.chang, goiYTheoChang(duLieuCho('thử'), ds));
	assert.deepEqual([d.kiem_tra, d.nhac_ly, d.nang_cao], [
		{ href: '/opus/bat-dau/kiem-tra-dau-vao/', co: true },
		{ href: '/opus/nhac-ly/', co: true },
		{ href: '/opus/nhac-ly/15-tiet-tau-nang-cao/', co: false },
	]);
	assert.deepEqual(d.bai_nhac_ly, ['/opus/nhac-ly/10-hop-am-ba/']);
	// luôn đăng: bản ghi chưa khóa thì build hỏng, dù không có trang nào khóa
	const caCapDo = Object.fromEntries(duLieuDaKiem()['cap-do'].map((c) => [`cap-do/${c.id}`, 'x']));
	assert.throws(() => goiYTap(duLieuCho('ô gợi ý tập ở trang chủ', { luonKhoa: true, khoa: { trang: {}, ban_ghi: caCapDo } }), ds), /ô gợi ý tập ở trang chủ hiện trường chưa khóa du-lieu\/tac-pham\//);
	assert.equal(congCu({ ten: 'goi-y-tap' }, 'index'), goiYTap());
	assert.throws(() => congCu({ ten: 'goi-y-tap', chang: '3' }, 'index'), /không nhận thông số/);
});

test('ô gợi ý tập trong trình duyệt: chặng và bài nhạc lý đã lưu (site mới, site cũ); dữ liệu hỏng thì bỏ qua', () => {
	const d = json(goiYTap(duLieuCho('thử', { luonKhoa: true }), ['nhac-ly/index', 'nhac-ly/04-nhip', 'piano/lo-trinh/chang-3']), 'data-goi-y');
	assert.equal(dungGoiY(d, null, null), null, 'chưa lưu gì: giữ phần dựng sẵn');
	assert.equal(dungGoiY(d, { stage: '3' }, { start: 'x' }), null, 'chặng không phải số, bài không phải số');
	assert.equal(dungGoiY(d, { stage: 9 }, null), null, 'chặng ngoài 1–7');
	const c3 = dungGoiY(d, { stage: 3, date: '2026-10-20' }, null);
	assert.match(c3, /Chặng của bạn: <a href="\/opus\/piano\/lo-trinh\/chang-3\/">3\. Sơ trung cấp<\/a><\/strong> \(<span class="oz-khong-ngat">≈ Grade 3<\/span>\)/);
	const goiY = d.chang[2].goi_y;
	assert.ok(goiY.length > 0);
	for (const x of goiY) assert.ok(c3.includes(lienKetJs(x.href, x.ten, x.co)), `thiếu bài nên bắt đầu ${x.href}`);
	assert.doesNotMatch(c3, /Nhạc lý:/);
	// bài nhạc lý lưu ở site mới: tên và địa chỉ; có trong bản build thì là link, chưa có thì "sắp có"
	assert.match(dungGoiY(d, null, { start: 4, ten: 'Nhịp <b>', href: '/opus/nhac-ly/04-nhip/' }), /Chưa có chặng piano của bạn[\s\S]*<strong>Nhạc lý:<\/strong> bắt đầu từ <a href="\/opus\/nhac-ly\/04-nhip\/">bài 4: Nhịp &lt;b&gt;<\/a>\./);
	assert.match(dungGoiY(d, null, { start: 5, ten: 'Quãng', href: '/opus/nhac-ly/05-quang/' }), /<span class="oz-sap-co" data-href="\/opus\/nhac-ly\/05-quang\/"[^>]*>bài 5: Quãng <span class="oz-sap-co-nhan"/);
	// site cũ chỉ lưu số bài; địa chỉ lạ thì không dùng
	for (const lop of [{ start: 4 }, { start: 4, href: 'javascript:alert(1)' }, { start: 4, href: '/opus/piano/gam/' }, { start: 4, href: '/opus/nhac-ly/../x/' }])
		assert.match(dungGoiY(d, null, lop), /bắt đầu từ bài 4 \(<a href="\/opus\/nhac-ly\/">các bài nhạc lý<\/a>\)\./, JSON.stringify(lop));
	assert.match(dungGoiY(d, { stage: 7 }, { start: 'done' }), /bạn đã nắm phần nền tảng; tiếp với <span class="oz-sap-co" data-href="\/opus\/nhac-ly\/15-tiet-tau-nang-cao\/"/);
});

test('bản thật: trang chưa khóa không qua plugin của dự án (lỗi cú pháp không làm hỏng bản build đăng lên site); bản xem thì có', () => {
	const ctx = (trang) => ({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	const goc = () => ({ name: 'goc' });
	const cu = process.env.OPUS_BAN;
	try {
		delete process.env.OPUS_BAN;
		const bo = chiTrangTrongBan(goc)(ctx('piano/tac-pham/fur-elise'));
		assert.equal(bo.name, 'opus-bo-qua-trang-chua-khoa');
		assert.deepEqual(bo.code({ lang: 'abc' }), { type: 'html', value: '' }, 'khối ```abc không sang Expressive Code');
		assert.equal(chiTrangTrongBan(goc)(ctx('404')).name, 'goc', 'trang đã khóa vẫn qua plugin');
		assert.equal(chiTrangTrongBan(goc)({}).name, 'goc', 'không biết trang (kiểm thử gọi thẳng): vẫn qua plugin');
		process.env.OPUS_BAN = 'xem';
		assert.equal(chiTrangTrongBan(goc)(ctx('piano/tac-pham/fur-elise')).name, 'goc');
	} finally {
		if (cu === undefined) delete process.env.OPUS_BAN;
		else process.env.OPUS_BAN = cu;
	}
});
