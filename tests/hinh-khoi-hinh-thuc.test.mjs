// Sáu hình tĩnh của đợt hình 3 (nhánh mo/hinh-dot-3b; plans/ben-vung/de-xuat-hinh.md, đề xuất 18, 22–25) chỉ vẽ lại chữ
// và bảng của trang: form-minuet-trio (hinh-thuc/minuet-trio), form-scherzo (hinh-thuc/scherzo, Giao hưởng số 5),
// form-concerto-co-dien (hinh-thuc/concerto), form-overture (hinh-thuc/overture), form-moldau (hinh-thuc/symphonic-poem),
// erlkonig (nghe-nhac/schubert-erlkonig). Sửa bảng mà quên sửa hình (hay ngược lại) thì hỏng.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hinhTinh } from '../src/plugins/thanh-phan.mjs';

const DOCS = path.resolve(import.meta.dirname, '../src/content/docs');
const trang = (t) => fs.readFileSync(path.join(DOCS, `${t}.md`), 'utf8');
/** Các dòng của bảng Markdown đầu tiên sau `muc`, bỏ dòng tiêu đề và dòng kẻ. */
function bang(md, muc) {
	const dong = md.slice(md.indexOf(muc)).split('\n');
	const dau = dong.findIndex((d) => d.startsWith('|'));
	const het = dong.findIndex((d, i) => i > dau && !d.startsWith('|'));
	return dong.slice(dau + 2, het).map((d) => d.slice(1, -1).split('|').map((o) => o.trim()));
}
const tron = (s) => s.replace(/\*\*?/g, '');
/** Các ô (oz-seg) của hình: lớp màu, tên (b), dòng phụ (small, bỏ thẻ). */
const o = (h) => [...h.matchAll(/<div class="oz-seg ([^"]*)" style="[^"]*"><b>([^<]*)<\/b>(?:<small>(.*?)<\/small>)?<\/div>/g)].map((m) => ({ lop: m[1], ten: m[2], phu: (m[3] ?? '').replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'") }));
/** Hình đứng ngay sau dòng `sau` của trang (một dòng trống ở giữa). */
const ngaySau = (md, sau, ten) => assert.ok(md.includes(`${sau}\n\n::hinh{ten="${ten}"}\n`), `${ten}: phải đứng ngay sau "${sau.slice(0, 40)}…"`);

test('mỗi hình một file, một figure; trang dùng đúng một lần', () => {
	for (const [t, ten] of [['hinh-thuc/minuet-trio', 'form-minuet-trio'], ['hinh-thuc/scherzo', 'form-scherzo'], ['hinh-thuc/concerto', 'form-concerto-co-dien'], ['hinh-thuc/overture', 'form-overture'], ['hinh-thuc/symphonic-poem', 'form-moldau'], ['nghe-nhac/schubert-erlkonig', 'erlkonig']]) {
		const h = hinhTinh(ten);
		assert.ok(h, ten);
		assert.equal((h.match(/<figure/g) ?? []).length, 1, ten);
		assert.equal(trang(t).split(`::hinh{ten="${ten}"}`).length - 1, 1, `${t}: ${ten}`);
	}
});

test('form-minuet-trio: ba ô theo ba dòng bảng "Cấu trúc: ABA"; ký hiệu hai đoạn có tái hiện chép câu dưới bảng', () => {
	const md = trang('hinh-thuc/minuet-trio');
	const dong = bang(md, '## Cấu trúc: ABA');
	ngaySau(md, `| ${dong.at(-1).join(' | ')} |`, 'form-minuet-trio');
	const h = hinhTinh('form-minuet-trio');
	const oo = o(h);
	assert.deepEqual(oo.map((x) => x.ten), dong.map((d) => tron(d[0])));
	assert.deepEqual(oo.map((x) => x.lop), ['k-a', 'k-c', 'k-a']);
	assert.equal(oo[0].phu, "‖: a :‖ ‖: b a' :‖");
	assert.ok(md.includes("‖: a :‖ ‖: b a' :‖"));
	assert.match(dong[1][1], /Tương phản, thường dịu hơn minuet; thường đổi giọng/);
	assert.match(dong[2][1], /Chơi lại minuet từ đầu \(thường không nhắc lại/);
});

test('form-scherzo: năm ô theo năm dòng bảng Giao hưởng số 5; chương 3 là Scherzo – Trio – Scherzo da capo – Đoạn chuyển', () => {
	const md = trang('hinh-thuc/scherzo');
	const dong = bang(md, '## Đi qua một tác phẩm: Beethoven');
	ngaySau(md, `| ${dong.at(-1).join(' | ')} |`, 'form-scherzo');
	const h = hinhTinh('form-scherzo');
	const oo = o(h);
	assert.deepEqual(oo.slice(0, 4).map((x) => x.ten), dong.slice(0, 4).map((d) => d[0]));
	assert.equal(dong[4][0], '→ Chương 4');
	assert.deepEqual([...h.matchAll(/oz-form-khoi-ten">([^<]*)</g)].map((m) => m[1]), ['Chương 3', 'Chương 4']);
	assert.deepEqual(oo.map((x) => x.phu), ['Đô thứ', 'Đô trưởng, đối âm', 'pizzicato, rất nhỏ', 'không ngắt', 'attacca, Đô trưởng']);
	assert.match(md, /scherzo cung \*\*Đô thứ\*\*/);
	assert.match(dong[1][1], /Đô trưởng\*\*, viết đối âm/);
	assert.match(dong[2][1], /pizzicato\*\* và rất nhỏ/);
	assert.match(dong[4][1], /attacca\), ở \*\*Đô trưởng/);
	assert.equal(oo[0].lop, oo[2].lop);
});

test('form-concerto-co-dien: ba chương nhanh – chậm – nhanh; chương 1 dàn nhạc rồi độc tấu, cadenza, dàn nhạc kết', () => {
	const md = trang('hinh-thuc/concerto');
	ngaySau(md, '- **Chương 3**: nhanh, thường ở hình thức rondo.', 'form-concerto-co-dien');
	assert.match(md, /thường có \*\*3 chương: nhanh – chậm – nhanh\*\*/);
	assert.match(md, /phần trình bày của \*\*dàn nhạc\*\* trước, rồi một phần trình bày của \*\*nghệ sĩ độc tấu\*\*/);
	assert.match(md, /dàn nhạc dừng lại trên một hợp âm, nghệ sĩ độc tấu chơi một mình .* rồi dàn nhạc vào lại để kết/);
	const h = hinhTinh('form-concerto-co-dien');
	assert.deepEqual([...h.matchAll(/oz-form-khoi-ten">([^<]*)</g)].map((m) => m[1]), ['Chương 1: nhanh', 'Chương 2', 'Chương 3']);
	const oo = o(h);
	assert.deepEqual(oo.map((x) => `${x.ten}/${x.phu}`), ['Dàn nhạc/trình bày', 'Độc tấu/trình bày', '…/', 'Cadenza/độc tấu một mình', 'Dàn nhạc/vào lại để kết', 'Chậm/', 'Nhanh/thường là rondo']);
	// dàn nhạc xanh, độc tấu vàng: như hình ritornello cùng trang
	assert.deepEqual(oo.slice(0, 5).map((x) => x.lop), ['k-a', 'k-b', 'k-x', 'k-b', 'k-a']);
	assert.match(hinhTinh('form-ritornello'), /cả dàn nhạc \(xanh\) xen kẽ đoạn độc tấu \(vàng\)/);
	// không vẽ phần nào trang không kể (phát triển, tái hiện)
	assert.doesNotMatch(h, /Phát triển|Tái hiện|phát triển|tái hiện/);
});

test('form-overture: Pháp chậm – nhanh – chậm, Ý nhanh – chậm – nhanh như danh sách "Hai gốc Baroque"; ô nhanh cao hơn', () => {
	const md = trang('hinh-thuc/overture');
	ngaySau(md, '- **Overture Ý** (nhanh – chậm – nhanh): là **mẫu cho những bản giao hưởng đầu tiên**, vốn có ba chương; về sau giao hưởng thường có bốn chương.', 'form-overture');
	assert.match(md, /\*\*Overture Pháp\*\* \(Lully\): chậm – nhanh – chậm; phần chậm mở đầu có tiết tấu chấm \(dotted\), phần nhanh theo lối bắt chước/);
	const h = hinhTinh('form-overture');
	const khoi = h.split('oz-form-khoi-ten').slice(1);
	assert.deepEqual(khoi.map((k) => k.match(/^">([^<]*)</)[1]), ['Overture Pháp (Lully)', 'Overture Ý']);
	const toc = khoi.map((k) => o(k).map((x) => x.ten.toLowerCase()).join(' – '));
	assert.deepEqual(toc, ['chậm – nhanh – chậm', 'nhanh – chậm – nhanh']);
	assert.deepEqual(o(khoi[0]).map((x) => x.phu), ['tiết tấu chấm', 'lối bắt chước', '']);
	// ô nhanh có lớp oz-seg-nhanh (cao hơn), cùng màu; ô chậm cùng màu khác
	for (const x of o(h)) assert.equal(x.lop, x.ten === 'Nhanh' ? 'k-c oz-seg-nhanh' : 'k-a', x.ten);
	assert.match(h, /mẫu cho những bản giao hưởng đầu tiên, vốn có ba chương/);
});

test('form-moldau: bảy ô theo bảy dòng bảng Moldau; giai điệu Moldau ở đoạn 2 và 7, cùng màu', () => {
	const md = trang('hinh-thuc/symphonic-poem');
	const dong = bang(md, '## Đi qua một tác phẩm: Smetana');
	assert.equal(dong.length, 7);
	ngaySau(md, `| ${dong.at(-1).join(' | ')} |`, 'form-moldau');
	const oo = o(hinhTinh('form-moldau'));
	assert.deepEqual(oo.map((x) => x.ten.split('. ')[0]), dong.map((d) => d[0]));
	// tên ô là đầu cột "Sự kiện" (rút gọn: thợ săn, qua Prague)
	oo.forEach((x, i) => assert.ok(dong[i][1].startsWith(x.ten.split('. ')[1]), x.ten));
	const coMoldau = dong.map((d) => d[2].includes('*Moldau*'));
	assert.deepEqual(oo.map((x) => x.phu.includes('Moldau')), coMoldau);
	assert.deepEqual(coMoldau, [false, true, false, false, false, false, true]);
	assert.ok(oo.every((x, i) => (x.lop === 'k-a') === coMoldau[i]));
	// chữ dòng phụ có trong cột "Nghe gì" hay "Sự kiện" của cùng dòng
	const tu = { 1: ['sáo', 'hợp thành sông'], 3: ['kèn horn'], 4: ['polka'], 5: ['Sáo và clarinet', 'violin', 'đàn hạc'], 6: ['dữ dội nhất'] };
	for (const [i, cum] of Object.entries(tu)) for (const c of cum) assert.ok(dong[i - 1].join(' ').includes(c), `${i}: ${c}`);
});

test('erlkonig: bốn vai theo bảng nhân vật; dòng 4–7 của bảng Theo dõi khi nghe theo thứ tự; ba tiếng kêu cao dần', () => {
	const md = trang('nghe-nhac/schubert-erlkonig');
	const nv = bang(md, '**Một ca sĩ hát cả bốn vai**');
	const theoDoi = bang(md, '## Theo dõi khi nghe');
	ngaySau(md, `| ${theoDoi.at(-1).join(' | ')} |`, 'erlkonig');
	const h = hinhTinh('erlkonig');
	const oo = o(h);
	assert.deepEqual(oo.map((x) => x.ten), nv.map((d) => d[0]));
	// dòng phụ của mỗi vai: các cụm lấy từ cột "Cách Schubert viết"
	const cum = [['Âm vực giữa', 'trung tính'], ['Âm vực thấp', 'trấn an'], ['Âm vực cao', 'hoảng loạn'], ['Ngọt ngào', 'giọng trưởng', 'rất nhỏ (pp)']];
	cum.forEach((cc, i) => cc.forEach((c) => {
		assert.ok(tron(nv[i][1]).includes(c), `bảng: ${c}`);
		assert.ok(oo[i].phu.toLowerCase().includes(c.toLowerCase()), `hình: ${c}`);
	}));
	// dòng 4–7 của bảng: Vua tinh 1; con kêu 1, cha trấn an; Vua tinh 2, con kêu 2 cao hơn; Vua tinh 3, con kêu 3 cao nhất
	assert.match(theoDoi[3][1], /^\*\*Vua tinh\*\* lần 1/);
	assert.match(theoDoi[4][1], /^Đứa con kêu "Cha ơi!" lần 1; cha trấn an/);
	assert.match(theoDoi[5][1], /^Vua tinh lần 2, rồi đứa con kêu lần 2, \*\*cao hơn\*\*/);
	assert.match(theoDoi[6][1], /^Vua tinh lần 3: .* Đứa con kêu lần 3, \*\*cao nhất\*\*/);
	const mau = { '#b6dcc1': 'VT', '#e9b3a6': 'con', '#a9c7e8': 'cha' };
	const rect = [...h.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="[\d.]+" height="([\d.]+)" rx="4" fill="(#[0-9a-f]{6})"\/>/g)].map((m) => ({ x: +m[1], y: +m[2], cao: +m[3], ai: mau[m[4]] }));
	rect.sort((a, b) => a.x - b.x);
	assert.deepEqual(rect.map((r) => r.ai), ['VT', 'con', 'cha', 'VT', 'con', 'VT', 'con']);
	const keu = rect.filter((r) => r.ai === 'con');
	assert.ok(keu[0].cao < keu[1].cao && keu[1].cao < keu[2].cao, 'ba tiếng kêu cao dần');
	assert.ok(keu.every((r) => r.y + r.cao === keu[0].y + keu[0].cao), 'cột tiếng kêu cùng đáy');
	// màu vai trong hình dưới bằng màu ô vai ở trên
	const lopMau = { 'k-cad': '#b6dcc1', 'k-c': '#e9b3a6', 'k-a': '#a9c7e8' };
	for (const x of oo.filter((x) => lopMau[x.lop])) assert.ok(h.includes(`fill="${lopMau[x.lop]}"`), x.ten);
	assert.deepEqual([...h.matchAll(/<text[^>]*>(cao hơn|cao nhất)<\/text>/g)].map((m) => m[1]), ['cao hơn', 'cao nhất']);
	assert.match(md, /mỗi lần kêu lại \*\*cao hơn một chút\*\*/);
});
