// Kiểm thử thành phần trong trang (D1.3): plugin Markdown của dự án dựng đúng khuông ABC, quiz và các chỉ thị từ dữ
// liệu thật; viết sai thì báo lỗi rõ. Chạy thẳng Sätteri trên đoạn Markdown mẫu, không cần build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { duLieuDaKiem } from '../src/du-lieu.mjs';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canTaiScript, docMoc, docQuiz, hinhCauTruc, khoiNghe, md } from '../src/plugins/thanh-phan.mjs';
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
	assert.match(html, /<figure class="oz-abc" style="--he:1;--he-hep:1">/);
	assert.match(html, /<figcaption class="oz-abc-title">Ví dụ một<\/figcaption>/);
	assert.match(html, /aria-label="Khuông nhạc: Ví dụ một"/);
	assert.match(html, /data-abc="X:1\nM:4\/4\nL:1\/4\nK:C\nCDEF\|G4\|\]"/);
	assert.doesNotMatch(html, /T:Ví dụ/);
	// T: sau K: là tiêu đề phần trong bản nhạc, abcjs vẽ: giữ trong data-abc, không lấy làm tiêu đề khung
	const phan = dung('```abc\nX:1\nT:Tên\nK:C\nCDEF|\nT:Phần hai\nGABc|\n```');
	assert.match(phan, /<figcaption class="oz-abc-title">Tên<\/figcaption>/);
	assert.match(phan, /data-abc="X:1\nK:C\nCDEF\|\nT:Phần hai\nGABc\|"/);
	// giữ chỗ: hai bè, hai dòng mỗi bè, 9 ô bè trên (khung hẹp ngắt khoảng 4 ô một hệ: 3 hệ)
	const bai = '```abc\nX:1\nL:1/8\nK:C\n[V:1] "C"cdef gabc|cdef gabc|cdef gabc|cdef gabc|cdef gabc|\n[V:2] C4 E4|C4 E4|C4 E4|C4 E4|C4 E4|\n[V:1] !p!cdef gabc|cdef gabc|cdef gabc|cdef gabc|]\n[V:2] C4 E4|C4 E4|C4 E4|C4 E4|]\n```';
	assert.match(dung(bai), /style="--he:4;--he-hep:6"/);
});

test('khối ```quiz: câu hỏi dựng sẵn bằng HTML, dữ liệu cho script trong data-quiz; quiz sai thì báo lỗi', () => {
	const html = dung('```quiz\n? Đô giữa là nốt nào?\n+ C4\n- C5\n> Theo ký hiệu khoa học.\n```');
	assert.match(html, /<div class="oz-quiz" data-quiz="/);
	assert.match(html, /<li><p>Đô giữa là nốt nào\?<\/p><ul><li>C4<\/li><li>C5<\/li><\/ul><\/li>/);
	assert.throws(() => docQuiz('? Câu không có đáp án đúng\n- Sai'), /không có đáp án đúng/);
	assert.throws(() => dung('```quiz\nkhông mở bằng dấu\n```'), /fur-elise\.md: khối quiz: dòng không hiểu/);
	// chữ trong câu hỏi là Markdown trong dòng; thẻ HTML thô hiện thành chữ, không thành thẻ
	const the = dung('```quiz\n? Nốt *nào* <b>đậm</b> & <img src=x onerror=alert(1)>?\n+ C4\n```');
	assert.match(the, /<p>Nốt <em>nào<\/em> &lt;b&gt;đậm&lt;\/b&gt; &amp; &lt;img src=x onerror=alert\(1\)&gt;\?<\/p>/);
	assert.doesNotMatch(the, /<b>|<img/);
});

test('Markdown trong dòng của dữ liệu: nghiêng, link; HTML thô thành chữ', () => {
	assert.equal(md('*Für Elise*, [Bàn đạp](/opus/piano/ban-dap/)'), '<em>Für Elise</em>, <a href="/opus/piano/ban-dap/">Bàn đạp</a>');
	assert.equal(md('<script>x</script> 1 < 2'), '&lt;script&gt;x&lt;/script&gt; 1 &lt; 2');
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
	// link trong dữ liệu là địa chỉ trên site mới (tools/du_lieu/tach.py đổi link .md cũ)
	const bwv847 = dung(trangTacPham('bach-prelude-fugue-do-thu', '::hop-tac-pham'), 'piano/tac-pham/bach-prelude-fugue-do-thu');
	assert.match(bwv847, /<a href="\/opus\/piano\/tac-pham\/bach-prelude-do\/">Prelude Đô trưởng BWV 846<\/a>/);
	assert.match(bwv847, /<a href="\/opus\/piano\/lo-trinh\/">lộ trình<\/a>/);
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
	// chữ của hình được thoát; ghi chú nối sau chú thích
	const gia = { slug: 'x', hinh: { 'bai-hoc': [{ chu_thich: 'Hai <đoạn>', ghi_chu: 'Ô "1" & ô 2.', doan: [['A<', 'ô 1–8', 8, 'a'], ['B', null, 4, 'b']] }] } };
	assert.equal(
		hinhCauTruc(gia, 'bai-hoc'),
		'<figure class="oz-figure"><div class="oz-form-map"><div class="oz-seg k-a" style="flex:8 1 4.6rem"><b>A&lt;</b><small>ô 1–8</small></div>' +
			'<div class="oz-seg k-b" style="flex:4 1 4.6rem"><b>B</b></div></div><figcaption>Hai &lt;đoạn&gt; Ô &quot;1&quot; &amp; ô 2.</figcaption></figure>',
	);
});

test('::hoc-tiep: trang chặng hiện tại và chặng sau, trang cùng tác phẩm; bài chọn lọc thì viết tay', () => {
	const html = dung(trangTacPham('fur-elise', '::hoc-tiep'));
	assert.equal(
		html.trim(),
		'<ul class="oz-hoc-tiep"><li><strong>Cùng chặng 4:</strong> <a href="/opus/piano/lo-trinh/chang-4/">các bài của chặng 4</a>.</li>' +
			'<li><strong>Chặng 5:</strong> <a href="/opus/piano/lo-trinh/chang-5/">các bài của chặng 5</a>.</li></ul>',
	);
	// chặng cuối: không có dòng chặng sau
	const chang7 = duLieuDaKiem()['tac-pham'].find((r) => r.loai === 'bai-hoc' && r.chang === 7);
	assert.doesNotMatch(dung(trangTacPham(chang7.slug, '::hoc-tiep'), `piano/tac-pham/${chang7.slug}`), /chang-8/);
	const traumerei = dung(trangTacPham('schumann-traumerei', '::hoc-tiep'), 'piano/tac-pham/schumann-traumerei');
	assert.match(traumerei, /<strong>Nghe kèm:<\/strong> <a href="\/opus\/nghe-nhac\/schumann-kinderszenen\/">/);
	// Trang hướng dẫn nghe dùng chung bản ghi: dẫn về bài học, không dẫn về chính nó
	const nghe = dung(trangTacPham('liszt-liebestraum', '::hoc-tiep'), 'nghe-nhac/liszt-liebestraum');
	assert.match(nghe, /<strong>Bài học:<\/strong> <a href="\/opus\/piano\/tac-pham\/liszt-liebestraum\/">/);
});

test('::khoi-nghe: không có bản thu trong dữ liệu thì để người học tự dán link; có thì gợi ý bản đầu tiên, mốc theo trang', () => {
	const khongBan = duLieuDaKiem()['tac-pham'].find((r) => r.loai === 'nghe' && !r.ban_thu);
	assert.match(dung(trangTacPham(khongBan.slug, '::khoi-nghe'), 'nghe-nhac/' + khongBan.slug), /<div class="oz-listen"><\/div>/);
	assert.throws(() => dung(trangTacPham(khongBan.slug, '::khoi-nghe{moc="1 2"}'), 'nghe-nhac/' + khongBan.slug), /có moc nhưng bản ghi không có ban_thu/);
	const docRec = (html) => JSON.parse(/data-rec="([^"]+)"/.exec(html)[1].replaceAll('&quot;', '"'));
	const goiY = docRec(dung(trangTacPham('fur-elise', '::khoi-nghe{moc="2 12 - 41"}')));
	assert.equal(goiY.by, 'V. Gao');
	assert.deepEqual(goiY.ref, [2, 12, null, 41]);
	assert.throws(() => dung(trangTacPham('fur-elise', '::khoi-nghe{moc="2 x"}')), /mốc "x" không phải số giây/);
	// file mp3 của site (đường dẫn tính từ gốc site) thêm base; link ngoài giữ nguyên
	const banGhi = { ban_thu: [{ by: 'A', parts: [{ mp3: 'audio/a.mp3', d: 60 }, { mp3: 'https://x.org/b.mp3', d: 30 }] }] };
	const rec = docRec(khoiNghe(banGhi, '/opus/'));
	assert.deepEqual(rec.parts.map((p) => p.mp3), ['/opus/audio/a.mp3', 'https://x.org/b.mp3']);
	assert.equal(rec.ref, undefined);
	// mốc tham khảo nằm ở trang (moc), vì bài học và hướng dẫn nghe dùng chung bản ghi mà bảng mốc khác nhau
	assert.deepEqual(docRec(khoiNghe(banGhi, '/opus/', '3 61 - 73')).ref, [3, 61, null, 73]);
	assert.deepEqual(docMoc(' 0  12.5 -'), [0, 12.5, null]);
	assert.throws(() => docMoc('3 1:05'), /mốc "1:05" không phải số giây/);
	assert.throws(() => khoiNghe({}, '/opus/', '3 4'), /có moc nhưng bản ghi không có ban_thu/);
});

test('chỉ thị viết sai thì báo lỗi kèm tên file, kể cả gõ sai tên; chỉ thị khối để nguyên cho Starlight', () => {
	assert.throws(() => dung('::hop-tac-pham'), /fur-elise\.md: ::hop-tac-pham cần trường tac_pham/);
	assert.throws(() => dung(trangTacPham('fur-elise', '::hop-tac-pham{x="1"}')), /::hop-tac-pham không nhận thuộc tính x/);
	assert.throws(() => dung(trangTacPham('fur-elise', '::khoi-nghe{moc="1" x="2"}')), /::khoi-nghe không nhận thuộc tính x \(chỉ nhận: moc\)/);
	assert.throws(() => dung(trangTacPham('fur-elise', '::hop-tac-pham[chữ]')), /::hop-tac-pham không nhận chữ/);
	assert.throws(() => dung(trangTacPham('fur-elise', '::hop-tac-phamm')), /fur-elise\.md: không có chỉ thị ::hop-tac-phamm \(có: ::hop-tac-pham,/);
	assert.throws(() => dung('::hinh'), /::hinh thiếu thuộc tính ten/);
	assert.doesNotThrow(() => dung(':::tip\nMẹo.\n:::'), 'chỉ thị khối (aside) là việc của Starlight');
});

test('trang nào tải bộ tải thành phần: dò trên HTML đã dựng, khớp mọi cách viết plugin dựng được', () => {
	assert.ok(canTaiScript(dung('~~~abc\nX:1\nK:C\nC|\n~~~')), 'khối ~~~abc');
	assert.ok(canTaiScript(dung('> ```quiz\n> ? Câu?\n> + Đúng\n> ```')), 'câu hỏi trong trích dẫn');
	assert.ok(canTaiScript(dung(trangTacPham('fur-elise', '::khoi-nghe'))), 'khối nghe');
	assert.ok(!canTaiScript(dung('Chữ thường, `class="oz-quiz"` trong mã, và <span class="oz-chip">chip</span>.')));
	assert.ok(!canTaiScript(dung(trangTacPham('fur-elise', '::hop-tac-pham\n\n::hinh-cau-truc\n\n::hoc-tiep'))));
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

test('::hinh và ::cong-cu chưa có thành phần: build vẫn chạy, hiện ô "chưa chuyển" (kiểm thử chặn ô này trong bản thật)', () => {
	const html = dung('::hinh{ten="circle"}\n\n::cong-cu{ten="piano" range="G4-F5" notes="A4 B4"}', 'nhac-ly/10-hop-am-ba');
	assert.match(html, /<p class="oz-chua-co" data-pagefind-ignore>Hình "circle" chưa chuyển sang site mới\.<\/p>/);
	assert.match(html, /<p class="oz-chua-co" data-pagefind-ignore>Công cụ "piano" chưa chuyển sang site mới\.<\/p>/);
});

