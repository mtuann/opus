// Kiểm thử thành phần trong trang (D1.3): plugin Markdown của dự án dựng đúng khuông ABC, quiz và các chỉ thị từ dữ
// liệu thật; viết sai thì báo lỗi rõ. Chạy thẳng Sätteri trên đoạn Markdown mẫu, không cần build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { duLieuDaKiem } from '../src/du-lieu.mjs';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { docQuiz, khoiNghe } from '../src/plugins/thanh-phan.mjs';
import { kiemDinh, ngayViet } from '../src/kiem-dinh.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');

/** Dựng một đoạn Markdown như trang src/content/docs/<trang>.md. */
function dung(md, trang = 'piano/tac-pham/fur-elise') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html;
}
const trangTacPham = (slug, than) => `---\ntitle: Thử\ntac_pham: ${slug}\n---\n\n${than}\n`;

test('khối ```abc: tiêu đề từ dòng T:, mã ABC trong data-abc (không thành chữ của trang), có giữ chỗ', () => {
	const html = dung('```abc\nX:1\nT:Ví dụ một\nM:4/4\nL:1/4\nK:C\nCDEF|G4|]\n```');
	assert.match(html, /<figure class="oz-abc" style="--he:1">/);
	assert.match(html, /<figcaption class="oz-abc-title">Ví dụ một<\/figcaption>/);
	assert.match(html, /aria-label="Khuông nhạc: Ví dụ một"/);
	assert.match(html, /data-abc="X:1\nM:4\/4\nL:1\/4\nK:C\nCDEF\|G4\|\]"/);
	assert.doesNotMatch(html, /T:Ví dụ/);
});

test('khối ```quiz: câu hỏi dựng sẵn bằng HTML, dữ liệu cho script trong data-quiz; quiz sai thì báo lỗi', () => {
	const html = dung('```quiz\n? Đô giữa là nốt nào?\n+ C4\n- C5\n> Theo ký hiệu khoa học.\n```');
	assert.match(html, /<div class="oz-quiz" data-quiz="/);
	assert.match(html, /<li><p>Đô giữa là nốt nào\?<\/p><ul><li>C4<\/li><li>C5<\/li><\/ul><\/li>/);
	assert.throws(() => docQuiz('? Câu không có đáp án đúng\n- Sai'), /không có đáp án đúng/);
	assert.throws(() => dung('```quiz\nkhông mở bằng dấu\n```'), /fur-elise\.md: khối quiz: dòng không hiểu/);
});

test('::hop-tac-pham: chip và bảng thông tin đúng như bản ghi', () => {
	const rec = duLieuDaKiem()['tac-pham'].find((r) => r.slug === 'fur-elise');
	const html = dung(trangTacPham('fur-elise', '::hop-tac-pham'));
	assert.match(html, /<div class="oz-piece">/);
	assert.equal((html.match(/class="oz-chip[ "]/g) ?? []).length, rec.chip.length, 'mỗi chip của bản ghi một <span class="oz-chip">');
	assert.match(html, /<span class="oz-chip oz-chip--level" title="Chặng 4 của lộ trình">≈ Grade 5 \(đoạn A ≈ Grade 3\)<\/span>/);
	assert.match(html, /<summary>Thông tin tác phẩm và bản nhạc nên dùng<\/summary>/);
	assert.equal((html.match(/<th scope="row">/g) ?? []).length, rec.thong_tin.length);
	assert.match(html, /<td>Ludwig van Beethoven \(1770–1827\)<\/td>/);
});

test('::hinh-cau-truc: sơ đồ các đoạn từ hinh của bản ghi, theo loại trang', () => {
	const html = dung(trangTacPham('fur-elise', '::hinh-cau-truc'));
	assert.match(html, /<figure class="oz-figure"><div class="oz-form-map">/);
	assert.equal((html.match(/class="oz-seg k-/g) ?? []).length, 6);
	assert.match(html, /<figcaption>Für Elise: rondo nhỏ A–B–A–C–A/);
	// Bản ghi dùng chung cho bài học và hướng dẫn nghe: mỗi trang lấy hình của mình
	const bai = dung(trangTacPham('liszt-liebestraum', '::hinh-cau-truc'), 'piano/tac-pham/liszt-liebestraum');
	const nghe = dung(trangTacPham('liszt-liebestraum', '::hinh-cau-truc'), 'nghe-nhac/liszt-liebestraum');
	assert.notEqual(bai, nghe);
});

test('::hoc-tiep: bài cùng chặng, bài chặng sau và trang nghe kèm, sinh từ dữ liệu', () => {
	const html = dung(trangTacPham('fur-elise', '::hoc-tiep'));
	assert.match(html, /<strong>Cùng chặng 4:<\/strong>/);
	assert.match(html, /href="\/opus\/piano\/tac-pham\/bach-prelude-do\/"/);
	assert.match(html, /<strong>Chặng 5:<\/strong>/);
	assert.doesNotMatch(html, /href="\/opus\/piano\/tac-pham\/fur-elise\/"/, 'không link tới chính nó');
	const traumerei = dung(trangTacPham('schumann-traumerei', '::hoc-tiep'), 'piano/tac-pham/schumann-traumerei');
	assert.match(traumerei, /<strong>Nghe kèm:<\/strong> <a href="\/opus\/nghe-nhac\/schumann-kinderszenen\/">/);
	// Trang hướng dẫn nghe dùng chung bản ghi: dẫn về bài học, không dẫn về chính nó
	const nghe = dung(trangTacPham('liszt-liebestraum', '::hoc-tiep'), 'nghe-nhac/liszt-liebestraum');
	assert.match(nghe, /<strong>Bài học:<\/strong> <a href="\/opus\/piano\/tac-pham\/liszt-liebestraum\/">/);
});

test('::khoi-nghe: không có bản thu trong dữ liệu thì để người học tự dán link; có thì gợi ý bản đầu tiên', () => {
	assert.match(dung(trangTacPham('fur-elise', '::khoi-nghe')), /<div class="oz-listen"><\/div>/);
	// file mp3 của site (đường dẫn tương đối) thêm base; link ngoài giữ nguyên
	const html = khoiNghe({ ban_thu: [{ by: 'A', parts: [{ mp3: 'audio/a.mp3', d: 60 }, { mp3: 'https://x.org/b.mp3', d: 30 }] }] }, '/opus/');
	const rec = JSON.parse(/data-rec="([^"]+)"/.exec(html)[1].replaceAll('&quot;', '"'));
	assert.deepEqual(rec.parts.map((p) => p.mp3), ['/opus/audio/a.mp3', 'https://x.org/b.mp3']);
});

test('chỉ thị viết sai thì báo lỗi kèm tên file; chỉ thị lạ để nguyên cho Starlight', () => {
	assert.throws(() => dung('::hop-tac-pham'), /fur-elise\.md: ::hop-tac-pham cần trường tac_pham/);
	assert.throws(() => dung(trangTacPham('fur-elise', '::hop-tac-pham{x="1"}')), /không nhận chữ hay thuộc tính/);
	assert.doesNotMatch(dung('::la-lam'), /oz-/);
});

test('huy hiệu "Đã kiểm định": chỉ khi trang có trong khoa.json; ngày của lần kiểm định gần nhất; đếm nhận định', () => {
	const khoa = { trang: { 'nhac-ly/10-hop-am-ba': 'sha256:ab', index: 'sha256:cd' } };
	const hoSo = 'lan:\n  - so: 1\n    ngay: 2026-11-02\n  - so: 2\n    ngay: 2027-01-15\nnhan_dinh:\n  - id: n1\n  - id: n2\nkhuong_nhac:\n  - khoi: 1\n';
	assert.deepEqual(kiemDinh('nhac-ly/10-hop-am-ba', khoa, hoSo), { ngay: '2027-01-15', nhanDinh: 3 });
	assert.equal(kiemDinh('nhac-ly/11-hop-am-bay', khoa, hoSo), null, 'trang chưa khóa: không có huy hiệu');
	assert.equal(kiemDinh('index', undefined, undefined), null, 'chưa có kiem-dinh/khoa.json');
	// Trang khóa mà hồ sơ không có nhận định (trang chủ tạm): nhanDinh 0, PageTitle không hiện huy hiệu
	assert.deepEqual(kiemDinh('index', khoa, 'lan:\n  - so: 1\n    ngay: 2026-10-30\n'), { ngay: '2026-10-30', nhanDinh: 0 });
	assert.equal(ngayViet('2027-01-15'), '15/1/2027');
});

