// Kiểm thử việc chuyển trang (D1.4): luật chuyển cú pháp của tools/chuyen/chuyen.mjs trên các đoạn mẫu; id tiêu đề theo
// kiểu site cũ (src/plugins/id-cu.mjs, so với kết quả Python-Markdown của site cũ); và, khi máy có bản build site cũ ở
// .cache/site-cu/, chữ hiển thị của mọi trang đã chuyển trong dist/ phải giống trang cũ (tools/chuyen/so-chu.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chuyenTrang, doiLink, moTaTuHtml } from '../tools/chuyen/chuyen.mjs';
import { SITE_CU, dat, docCu, docMoi, soTrang } from '../tools/chuyen/so-chu.mjs';
import { khongTrung, slugCu } from '../src/plugins/id-cu.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

/** Chuyển một trang mẫu (thân sau tiêu đề), trả về phần thân mới và cảnh báo. */
function chuyen(than, { trang = 'nhac-ly/thu', banGhi, moTa = 'Mô tả.' } = {}) {
	const { noiDung, canhBao } = chuyenTrang(`# Tiêu đề thử\n\n${than}\n`, { trang, moTa, banGhi });
	return { than: noiDung.split('\n---\n\n')[1].trimEnd(), fm: noiDung.split('\n---\n')[0], canhBao };
}

test('tiêu đề thành frontmatter title (bỏ định dạng Markdown), kèm description, tac_pham, giữ trường cũ trừ hide', () => {
	const { noiDung } = chuyenTrang('---\ndate: 2026-10-11\nhide: [toc]\n---\n# Beethoven: Sonata *Pathétique*\n\nChữ.\n', {
		trang: 'nghe-nhac/beethoven-pathetique',
		moTa: 'Mô tả "có nháy".',
		banGhi: { slug: 'beethoven-pathetique' },
	});
	assert.equal(
		noiDung,
		'---\ntitle: "Beethoven: Sonata Pathétique"\ndescription: Mô tả "có nháy".\ntac_pham: beethoven-pathetique\ndate: 2026-10-11\n---\n\nChữ.\n',
	);
	assert.throws(() => chuyenTrang('Chữ không có tiêu đề.\n', { trang: 'x' }), /dòng đầu không phải tiêu đề/);
});

test('hộp !!! thành aside của Starlight; hộp ??? thành <details>; thân bỏ thụt 4 dấu cách; nháy trong tiêu đề', () => {
	const { than } = chuyen('!!! tip "Một buổi 30 phút"\n    Dòng một.\n\n    - mục\n\nSau hộp.\n\n!!! warning "Về \\"đau\\""\n    Dừng.');
	assert.equal(than, ':::tip[Một buổi 30 phút]\nDòng một.\n\n- mục\n:::\n\nSau hộp.\n\n:::caution[Về "đau"]\nDừng.\n:::');
	const hoi = chuyen('??? question "Muộn không?"\n    Không <muộn>.\n\n???+ success "Đáp án"\n    A.').than;
	assert.equal(hoi, '<details>\n<summary>Muộn không?</summary>\n\nKhông <muộn>.\n\n</details>\n\n<details open>\n<summary>Đáp án</summary>\n\nA.\n\n</details>');
	assert.equal(chuyen('!!! example "Luyện tập"\n    X.').than, ':::tip[Luyện tập]\nX.\n:::');
	assert.equal(chuyen('!!! info "Ghi chú"\n    X.').than, ':::note[Ghi chú]\nX.\n:::');
});

test('link tới file .md thành địa chỉ /opus/…/, giữ #mục; index.md thành thư mục; link ngoài và #mục trong trang giữ nguyên', () => {
	const cb = [];
	assert.equal(doiLink('../piano/hai-tuan-dau.md#truoc-ngay-au-tien', 'bat-dau/bai-0', cb), '/opus/piano/hai-tuan-dau/#truoc-ngay-au-tien');
	assert.equal(doiLink('tac-pham/index.md', 'piano/tac-pham-theo-cap', cb), '/opus/piano/tac-pham/');
	assert.equal(doiLink('index.md', 'bat-dau/bai-0', cb), '/opus/bat-dau/');
	assert.equal(doiLink('../index.md', 'bat-dau/bai-0', cb), '/opus/');
	assert.equal(doiLink('https://imslp.org/', 'x/y', cb), 'https://imslp.org/');
	assert.equal(doiLink('#muc', 'x/y', cb), '#muc');
	assert.equal(doiLink('assets/audio/NGUON.txt', 'cap-nhat', cb), '/opus/audio/NGUON.txt');
	assert.match(cb.join('\n'), /cần file \/audio\/NGUON\.txt trong public\//);
	const { than } = chuyen('Xem [Bài 0](../bat-dau/bai-0.md) và `[mã](x.md)`.\n\n[tham-chieu]: ../bat-dau/bai-0.md#a');
	assert.equal(than, 'Xem [Bài 0](/opus/bat-dau/bai-0/) và `[mã](x.md)`.\n\n[tham-chieu]: /opus/bat-dau/bai-0/#a');
});

test('khối mã giữ nguyên (```abc, ```quiz…), kể cả chữ trông như cú pháp cũ bên trong', () => {
	const ma = '```abc\nX:1\nT:!!! tip "x"\nK:C\nC|\n```\n\n```quiz\n? Câu [a](b.md)?\n+ Đúng\n```';
	assert.equal(chuyen(ma).than, ma);
});

test('phím ++…++ thành <kbd> như site cũ (chữ hiện ra: Ctrl+P, Space, C)', () => {
	assert.equal(
		chuyen('Bấm ++ctrl+p++, ++space++ hay ++c++.').than,
		'Bấm <span class="keys"><kbd>Ctrl</kbd><span>+</span><kbd>P</kbd></span>, <span class="keys"><kbd>Space</kbd></span> hay <span class="keys"><kbd>C</kbd></span>.',
	);
});

test('HTML có Markdown bên trong: bỏ thuộc tính markdown, cách dòng trống để Markdown bên trong được đọc', () => {
	const { than } = chuyen('<div class="oz-path" markdown>\n### Tôi chưa từng chơi đàn\nĐọc [Bài 0](bat-dau/bai-0.md).\n</div>');
	assert.equal(than, '<div class="oz-path">\n\n### Tôi chưa từng chơi đàn\nĐọc [Bài 0](/opus/nhac-ly/bat-dau/bai-0/).\n\n</div>');
});

test('khối bọc có chức năng ở site cũ thêm ô "chưa chuyển"; lớp oz- chỉ có CSS thì cảnh báo; phần chỉ để in giữ nguyên', () => {
	const trang = chuyen('<div class="oz-lesson-status" markdown>\n\n1. [Bài 1](01-cao-do-ten-not.md)\n\n</div>');
	assert.equal(trang.than, '<div class="oz-lesson-status">\n\n::cong-cu{ten="lesson-status"}\n\n1. [Bài 1](/opus/nhac-ly/01-cao-do-ten-not/)\n\n</div>');
	assert.match(trang.canhBao.join(), /khối oz-lesson-status có chức năng ở site cũ/);
	assert.match(chuyen('<div class="oz-piano-level" markdown>\n\n- [ ] Việc\n\n</div>').than, /::cong-cu\{ten="piano-level"\}/);
	// thiếu thuộc tính markdown: không thêm được ô, nhưng phải báo
	assert.match(chuyen('<div class="oz-lesson-status"><ol><li>Bài 1</li></ol></div>').canhBao.join(), /oz-lesson-status có chức năng ở site cũ .* không có thuộc tính markdown/);
	const css =chuyen('<div class="oz-paths" markdown>\n\n<div class="oz-path" markdown>\n\nChữ.\n\n</div>\n\n</div>');
	assert.deepEqual(css.canhBao.filter((c) => c.startsWith('lớp')).length, 2);
	assert.doesNotMatch(css.than, /cong-cu/);
	const inRa = chuyen('<div class="oz-print-only" markdown>\n\n*Bản in.*\n\n</div>');
	assert.deepEqual(inRa.canhBao, [], 'oz-print-only: site mới có CSS (ẩn trên màn hình, hiện khi in)');
});

test('href trong HTML thô: file .md thành địa chỉ; link tương đối khác (ra ngoài docs/) thì cảnh báo', () => {
	const { than, canhBao } = chuyen('<p><a href="../piano/gam.md#c">Gam</a> · <a class="x" href="../../sach/a.html">Sách</a> · <a href="https://x.org/">X</a></p>', { trang: 'bat-dau/thu' });
	assert.equal(than, '<p><a href="/opus/piano/gam/#c">Gam</a> · <a class="x" href="../../sach/a.html">Sách</a> · <a href="https://x.org/">X</a></p>');
	assert.deepEqual(canhBao, ['link ra ngoài docs/: ../../sach/a.html']);
	assert.equal(doiLink('/opus-zero/piano/', 'x/y'), '/opus-zero/piano/', 'link tuyệt đối giữ nguyên');
});

test('mô tả trang đọc từ og:description: thẻ description của site cũ không thoát dấu nháy', () => {
	const html = '<meta name="description" content="Bốn nốt "ngắn – dài" nổi tiếng"><meta property="og:description" content="Bốn nốt &#34;ngắn – dài&#34; nổi tiếng">';
	assert.equal(moTaTuHtml(html), 'Bốn nốt "ngắn – dài" nổi tiếng');
	assert.equal(moTaTuHtml('<meta name="description" content="x">'), undefined);
});

test('so-chu so chữ từng câu hỏi (cả lựa chọn, đáp án đúng, giải thích) và trọn mã ABC; không thấy phần nội dung thì báo lỗi', () => {
	const cu = (quiz, abc) => `<article class="md-content__inner"><div class="oz-quiz">${quiz}</div><div class="abc-notation">${abc}</div></article>`;
	const moi = (quiz, abc) =>
		`<div class="sl-markdown-content"><div class="oz-quiz" data-quiz="${JSON.stringify(quiz).replaceAll('"', '&quot;')}"></div>` +
		`<figure class="oz-abc"><div class="abc-notation" aria-label="Khuông nhạc: Ví dụ" data-abc="${abc}"></div></figure></div>`;
	const quizMoi = [{ q: 'Nốt nào?', opts: [{ t: 'Đô', ok: true }, { t: 'Rê', ok: false }], why: 'Vì <em>vậy</em>.' }];
	const a = docCu(cu('? Nốt nào?\n+ Đô\n- Rê\n> Vì vậy.\n', 'X:1\nT:Ví dụ\nK:C\nCDE|\n'));
	const b = docMoi(moi(quizMoi, 'X:1\nK:C\nCDE|'));
	assert.deepEqual(a.quiz, b.quiz);
	assert.deepEqual(a.abc, b.abc);
	assert.notDeepEqual(a.quiz, docMoi(moi([{ ...quizMoi[0], opts: [{ t: 'Đô', ok: true }, { t: 'Mi', ok: false }] }], 'X:1\nK:C\nCDE|')).quiz, 'đổi chữ một lựa chọn');
	assert.notDeepEqual(a.quiz, docMoi(moi([{ ...quizMoi[0], opts: [{ t: 'Đô', ok: false }, { t: 'Rê', ok: true }] }], 'X:1\nK:C\nCDE|')).quiz, 'đổi đáp án đúng');
	assert.notDeepEqual(a.abc, docMoi(moi(quizMoi, 'X:1\nK:C\nCDEF|')).abc, 'thêm một nốt');
	assert.throws(() => docCu('<main>chữ</main>'), /không thấy phần nội dung/);
});

test('khối công cụ <div class="oz-…"> rỗng thành ::cong-cu, thuộc tính data-* thành thông số', () => {
	assert.equal(chuyen('<div class="oz-metronome"></div>').than, '::cong-cu{ten="metronome"}');
	assert.equal(
		chuyen('<div class="oz-piano" data-range="G3-G4" data-notes="B3 D4 F#4" data-play="chord"></div>\n\n<div class="oz-repertoire" data-compact></div>').than,
		'::cong-cu{ten="piano" range="G3-G4" notes="B3 D4 F#4" play="chord"}\n\n::cong-cu{ten="repertoire" compact=""}',
	);
});

test('vùng hình: hình cấu trúc của bản ghi thành ::hinh-cau-truc, hình khác thành ::hinh{ten}', () => {
	const banGhi = { slug: 'fur-elise', hinh: { 'bai-hoc': [{}] } };
	const bai = chuyen('A\n\n<!-- fig:p-fur-elise -->\n<figure>…</figure>\n<!-- /fig:p-fur-elise -->\n\nB', { trang: 'piano/tac-pham/fur-elise', banGhi });
	assert.equal(bai.than, 'A\n\n::hinh-cau-truc\n\nB');
	assert.deepEqual(bai.canhBao, []);
	assert.equal(chuyen('<!-- fig:circle -->\n<svg></svg>\n<!-- /fig:circle -->').than, '::hinh{ten="circle"}');
	assert.match(chuyen('<!-- fig:g-x -->\n<!-- /fig:g-x -->', { trang: 'nghe-nhac/x', banGhi: { slug: 'x' } }).canhBao[0], /không có hinh\.nghe/);
	assert.throws(() => chuyen('<!-- fig:circle -->\n<svg></svg>'), /thiếu <!-- \/fig:circle -->/);
});

test('hộp tác phẩm (hàng chip và bảng thông tin) thành ::hop-tac-pham; chữ chen giữa thì báo', () => {
	const banGhi = { slug: 'x' };
	const vao = '<div class="oz-piece" markdown>\n<span class="oz-chip">Đô</span>\n</div>\n\n??? info oz-piece-info "Thông tin"\n\n    | Mục | Thông tin |\n    |---|---|\n    | A | B |\n\n## Tiếp';
	const kq = chuyen(vao, { trang: 'piano/tac-pham/x', banGhi });
	assert.equal(kq.than, '::hop-tac-pham\n\n## Tiếp');
	assert.deepEqual(kq.canhBao, []);
	const chen = chuyen(vao.replace('</div>\n\n', '</div>\n\n*Chỉ muốn nghe?* Đọc phần sau.\n\n'), { trang: 'piano/tac-pham/x', banGhi });
	assert.equal(chen.than, '::hop-tac-pham\n\n*Chỉ muốn nghe?* Đọc phần sau.\n\n## Tiếp');
	assert.match(chen.canhBao.join('\n'), /chữ chen giữa hàng chip và bảng thông tin/);
});

test('khối nghe: bản thu đã ở ban_thu của bản ghi, mốc tham khảo ở lại trong trang (::khoi-nghe{moc})', () => {
	const ban = { by: 'A', lic: 'CC BY 4.0', page: 'https://x.org/', parts: [{ mp3: 'audio/a.mp3', d: 60 }] };
	const rec = { ...ban, parts: [{ mp3: '../../../assets/audio/a.mp3', d: 60 }], ref: [3, null, 41] };
	const thuocTinh = JSON.stringify(rec).replace(/"/g, '&quot;');
	const kq = chuyen(`<div class="oz-listen" data-rec="${thuocTinh}"></div>`, { trang: 'piano/tac-pham/x', banGhi: { slug: 'x', ban_thu: [ban] } });
	assert.equal(kq.than, '::khoi-nghe{moc="3 - 41"}');
	assert.deepEqual(kq.canhBao, []);
	assert.match(chuyen(`<div class="oz-listen" data-rec="${thuocTinh}"></div>`, { trang: 'piano/tac-pham/x', banGhi: { slug: 'x' } }).canhBao[0], /khác ban_thu/);
	assert.equal(chuyen('<div class="oz-listen"></div>').than, '::khoi-nghe');
});

test('id tiêu đề theo kiểu site cũ: giống Python-Markdown (toc.slugify, unique) của site cũ', () => {
	// Kết quả lấy từ markdown.extensions.toc trong .venv của ../opus-zero (Python-Markdown của site cũ)
	const mau = {
		'Trước ngày đầu tiên': 'truoc-ngay-au-tien',
		'Đô – Mi – Sol': 'o-mi-sol',
		'Hợp âm 7 (V7)': 'hop-am-7-v7',
		'Mozart: K. 545, chương 1': 'mozart-k-545-chuong-1',
		'Tiết tấu "đảo phách"': 'tiet-tau-ao-phach',
		'A–B–A': 'aba',
		'  Khoảng trắng  thừa ': 'khoang-trang-thua',
		'C♯ và D♭': 'c-va-d',
		'Đàn': 'an',
		'Bài tập 1.2': 'bai-tap-12',
		'Lời_cảm_ơn': 'loi_cam_on',
	};
	for (const [chu, id] of Object.entries(mau)) assert.equal(slugCu(chu), id, chu);
	const daDung = new Set();
	assert.deepEqual(['a', 'a', 'a', 'a_1', '', ''].map((x) => khongTrung(x, daDung)), ['a', 'a_1', 'a_2', 'a_3', '_1', '_2']);
});

const trangDaChuyen = fs.existsSync(path.join(ROOT, 'src/content/docs'))
	? fs
			.readdirSync(path.join(ROOT, 'src/content/docs'), { recursive: true })
			.filter((f) => f.endsWith('.md'))
			.map((f) => f.replace(/\\/g, '/').replace(/\.md$/, ''))
			.filter((t) => t !== 'index' && fs.existsSync(path.join(SITE_CU, t.replace(/\/index$/, ''), 'index.html')))
	: [];

/** Trang không so được với bản cũ, kèm lý do (không có phần nội dung kiểu thường ở bản build cũ). */
const KHONG_SO = { 'blog/index': 'bản cũ là trang danh sách bài do plugin blog của MkDocs tự sinh; blog làm lại ở đợt 7' };

test(
	'chữ hiển thị và id tiêu đề của mọi trang đã chuyển giống trang ở bản build cũ (cần .cache/site-cu/ và npm run build)',
	{ skip: !fs.existsSync(SITE_CU) && 'máy này chưa build site cũ ở .cache/site-cu/ (plans/lam-lai/README.md, Quy tắc chung)' },
	() => {
		const khac = [];
		for (const t of trangDaChuyen.filter((t) => !KHONG_SO[t] && fs.existsSync(path.join(DIST, t.replace(/\/index$/, ''), 'index.html')))) {
			try {
				if (!dat(soTrang(t, DIST))) khac.push(t);
			} catch (e) {
				khac.push(`${t}: không so được: ${e.message}`);
			}
		}
		assert.deepEqual(khac, [], 'xem chỗ khác bằng: node tools/chuyen/so-chu.mjs <trang>');
	},
);
