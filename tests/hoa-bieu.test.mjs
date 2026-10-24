// Kiểm thử thành phần của lô D3-L1, phần hóa biểu: vẽ hóa biểu trên khuông (veHoaBieu, src/scripts/ve.js), hình mười lăm
// hóa biểu (::hinh{ten="keysigs"}), vòng quãng năm tĩnh (::hinh{ten="circle"}) và bấm được (::cong-cu{ten="circle"}), luyện
// hóa biểu (::cong-cu{ten="keysig-quiz"}). Nội dung các hình là nhận định của bài 8 (kiem-dinh/nhac-ly/08-hoa-bieu.yml):
// kiểm thử giữ chúng đúng, vì thành phần không nằm trong khóa của trang. Bấm thật trên trình duyệt:
// tests/trinh-duyet/kiem-ban-phim.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { opusMarkdown } from '../src/plugins/opus-markdown.mjs';
import { canKyHieu, canTaiScript, coAmPiano, congCuLuyenHoaBieu, congCuVongQuangNam, hinhHoaBieu, hinhVongQuangNam } from '../src/plugins/thanh-phan.mjs';
import { CAU_HOI, giongDuocHoi, meo, nutTraLoi } from '../src/scripts/luyen-hoa-bieu.js';
import { GIONG, docNot, hopAm, midi } from '../src/scripts/nhac-ly.js';
import { KY_HIEU, VONG, bacCacDau, dinhNghiaKyHieu, thongTinGiong, veHoaBieu, veVongChon } from '../src/scripts/ve.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'src/content/docs');
function dung(md, trang = 'nhac-ly/08-hoa-bieu') {
	const plugin = opusMarkdown({ base: '/opus/', docsDir: DOCS })({ fileURL: pathToFileURL(path.join(DOCS, trang + '.md')) });
	return markdownToHtml(md, { mdastPlugins: [plugin], features: { directive: true, smartPunctuation: false } }).html.trim();
}
/** Chữ hiện ra (gộp khoảng trắng thường, giữ khoảng trắng không ngắt dòng \u00a0). */
const chu = (html) => html.replace(/<[^>]+>/g, ' ').replace(/[ \t\r\n]+/g, ' ').trim();
const CHU_CAI = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** Nốt ở bậc p của khuông (p = 0: dòng dưới cùng; khóa Sol: Mi4, khóa Fa: Sol2). */
function notOBac(p, khoa) {
	const goc = khoa === 'sol' ? 2 + 7 * 4 : 4 + 7 * 2; // Mi4, Sol2 tính theo bậc chữ cái từ Đô0
	const b = goc + p;
	return `${CHU_CAI[b % 7]}${Math.floor(b / 7)}`;
}

test('vị trí các dấu trên khuông: đúng thứ tự và đúng quãng tám quen dùng, khóa Sol và khóa Fa', () => {
	assert.deepEqual(bacCacDau(7, 'sol').map((p) => notOBac(p, 'sol')), ['F5', 'C5', 'G5', 'D5', 'A4', 'E5', 'B4']);
	assert.deepEqual(bacCacDau(-7, 'sol').map((p) => notOBac(p, 'sol')), ['B4', 'E5', 'A4', 'D5', 'G4', 'C5', 'F4']);
	assert.deepEqual(bacCacDau(7, 'fa').map((p) => notOBac(p, 'fa')), ['F3', 'C3', 'G3', 'D3', 'A2', 'E3', 'B2']);
	assert.deepEqual(bacCacDau(-7, 'fa').map((p) => notOBac(p, 'fa')), ['B2', 'E3', 'A2', 'D3', 'G2', 'C3', 'F2']);
	assert.deepEqual(bacCacDau(3), bacCacDau(7).slice(0, 3));
	assert.deepEqual(bacCacDau(0), []);
});

test('hóa biểu trên khuông: đúng số dấu, đúng loại dấu, khóa; ký hiệu vẽ bằng <use> tới định nghĩa chung của trang', () => {
	for (const k of GIONG)
		for (const khoa of ['sol', 'fa']) {
			const svg = veHoaBieu(k.n, { khoa });
			assert.equal((svg.match(/href="#oz-kh-thang"/g) ?? []).length, Math.max(0, k.n), `${k.chu_am}, khóa ${khoa}`);
			assert.equal((svg.match(/href="#oz-kh-giang"/g) ?? []).length, Math.max(0, -k.n), `${k.chu_am}, khóa ${khoa}`);
			assert.equal((svg.match(new RegExp(`href="#oz-kh-khoa-${khoa}"`, 'g')) ?? []).length, 1);
			assert.equal((svg.match(/<path d="M1 /g) ?? []).length, 5, 'năm dòng kẻ');
		}
	assert.match(veHoaBieu(2), /aria-hidden="true"/, 'không có nhãn: chỉ để nhìn');
	assert.match(veHoaBieu(2, { nhan: 'Hóa biểu 2 dấu thăng' }), /role="img" aria-label="Hóa biểu 2 dấu thăng"/);
	const dn = dinhNghiaKyHieu();
	for (const ten of Object.keys(KY_HIEU)) assert.match(dn, new RegExp(`<path id="oz-kh-${ten}" d="M`));
	assert.match(dn, /class="oz-kh-dinh-nghia" width="0" height="0" aria-hidden="true"/);
	assert.ok(canKyHieu(veHoaBieu(1)) && !canKyHieu('<p>chữ</p>'));
});

test('::hinh{ten="keysigs"}: 15 ô theo bảng 15 giọng (số dấu, hóa biểu, giọng trưởng, giọng thứ song song), chú thích như hình cũ', () => {
	const html = dung('::hinh{ten="keysigs"}');
	assert.equal(html, hinhHoaBieu());
	const o = [...html.matchAll(/<li class="oz-ks">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
	assert.equal(o.length, 15);
	const mong = [
		['không dấu', 'Đô trưởng', 'La thứ'],
		['1♯', 'Sol trưởng', 'Mi thứ'],
		['2♯', 'Rê trưởng', 'Si thứ'],
		['3♯', 'La trưởng', 'Fa♯ thứ'],
		['4♯', 'Mi trưởng', 'Đô♯ thứ'],
		['5♯', 'Si trưởng', 'Sol♯ thứ'],
		['6♯', 'Fa♯ trưởng', 'Rê♯ thứ'],
		['7♯', 'Đô♯ trưởng', 'La♯ thứ'],
		['1♭', 'Fa trưởng', 'Rê thứ'],
		['2♭', 'Si♭ trưởng', 'Sol thứ'],
		['3♭', 'Mi♭ trưởng', 'Đô thứ'],
		['4♭', 'La♭ trưởng', 'Fa thứ'],
		['5♭', 'Rê♭ trưởng', 'Si♭ thứ'],
		['6♭', 'Sol♭ trưởng', 'Mi♭ thứ'],
		['7♭', 'Đô♭ trưởng', 'La♭ thứ'],
	];
	o.forEach((x, i) => {
		const [n, truong, thu] = mong[i];
		assert.match(x, new RegExp(`<span aria-hidden="true">${n}</span>`));
		assert.match(x, new RegExp(`<b>${truong}</b><small>${thu}</small>`));
		const so = Number(n[0]) || 0;
		assert.equal((x.match(n.includes('♯') ? /oz-kh-thang/g : /oz-kh-giang/g) ?? []).length, so, `${truong}: ${so} dấu trên khuông`);
	});
	assert.match(html, /<span class="sr-only">3 dấu thăng<\/span>/, 'máy đọc màn hình đọc số dấu bằng chữ');
	assert.match(html, /<figcaption>Mười lăm hóa biểu\. Dưới mỗi hóa biểu: giọng trưởng \(đậm\) và giọng thứ song song\. Dấu hóa luôn được thêm theo đúng thứ tự\.<\/figcaption>/);
	assert.match(html, /^<figure class="oz-figure oz-ks-hinh not-content" data-sinh>/, 'data-sinh: chữ do thành phần dựng');
});

test('::hinh{ten="circle"}: vòng ngoài 12 giọng trưởng theo quãng năm kèm số dấu, vòng trong giọng thứ song song; ô đồng âm ghi d♯/e♭ cùng thứ tự với F♯/G♭', () => {
	const html = dung('::hinh{ten="circle"}');
	assert.equal(html, hinhVongQuangNam());
	const t = [...html.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
	const ngoai = t.filter((_, i) => i < 36 && i % 3 === 0);
	const dau = t.filter((_, i) => i < 36 && i % 3 === 1);
	const trong = t.filter((_, i) => i < 36 && i % 3 === 2);
	assert.deepEqual(ngoai, ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F']);
	assert.deepEqual(dau, ['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯/6♭', '5♭', '4♭', '3♭', '2♭', '1♭']);
	assert.deepEqual(trong, ['a', 'e', 'b', 'f♯', 'c♯', 'g♯', 'd♯/e♭', 'b♭', 'f', 'c', 'g', 'd']);
	assert.deepEqual(t.slice(36), ['ngoài: trưởng', 'trong: thứ']);
	// đối chiếu với dữ liệu giọng: số dấu, giọng thứ song song; mỗi bước theo chiều kim đồng hồ lên một quãng 5 đúng (7 nửa cung)
	VONG.forEach((ten, i) => {
		const k = GIONG.find((g) => g.chu_am === ten[0]);
		assert.equal((midi(docNot(ten[0])) - 60 + 120) % 12, (7 * i) % 12, `${ten[0]}: vị trí ${i}`);
		assert.equal(dau[i].split('/')[0], k.n === 0 ? '0' : `${Math.abs(k.n)}${k.n > 0 ? '♯' : '♭'}`);
		for (const khac of ten.slice(1)) assert.equal(midi(docNot(khac)) % 12, midi(docNot(ten[0])) % 12, `${khac} đồng âm với ${ten[0]}`);
	});
	assert.match(html, /role="img" aria-label="Vòng quãng năm: vòng ngoài là giọng trưởng kèm số dấu hóa, vòng trong là giọng thứ song song"/);
	assert.match(html, /<figcaption>Theo chiều kim đồng hồ: thêm một dấu thăng; ngược chiều: thêm một dấu giáng\.<\/figcaption>/);
});

test('::cong-cu{ten="circle"}: 24 ô (giọng trưởng, giọng thứ song song), Đô trưởng chọn sẵn; thông tin từng giọng đúng', () => {
	const html = dung('::cong-cu{ten="circle"}');
	assert.equal(html, congCuVongQuangNam());
	assert.ok(canTaiScript(html) && coAmPiano(html) && canKyHieu(html));
	assert.throws(() => dung('::cong-cu{ten="circle" kich-thuoc="lon"}'), /không nhận thông số/);
	const o = [...veVongChon().matchAll(/<g class="oz-vong-o([^"]*)" data-giong="([^"]+)"(?: data-thu)? data-ten="([^"]+)">/g)];
	assert.equal(o.length, 24);
	assert.deepEqual(o.filter((m) => m[1].includes('chon')).map((m) => m[3]), ['Đô trưởng']);
	assert.deepEqual(o.slice(0, 4).map((m) => m[3]), ['Đô trưởng', 'La thứ', 'Sol trưởng', 'Mi thứ']);
	assert.deepEqual(o.filter((m) => m[1].includes('--thu')).map((m) => m[3]).slice(5, 8), ['Sol♯ thứ', 'Rê♯ thứ', 'Si♭ thứ']);
	assert.match(veVongChon(), />B\/C♭<\/text>.*>F♯\/G♭<\/text>.*>D♭\/C♯<\/text>/s, 'ô đồng âm khác tên như circle.js cũ');
	const g = chu(thongTinGiong({ giong: 'G', thu: false }));
	assert.match(g, /^Giọng Sol trưởng \(G major\)/);
	assert.match(g, /Hóa biểu: 1 dấu thăng: F♯\./);
	assert.match(g, /Các nốt: Sol – La – Si – Đô – Rê – Mi – Fa♯ – Sol/);
	assert.match(g, /Hợp âm các bậc: I = G, ii = Am, iii = Bm, IV = C, V = D, vi = Em, vii° = F♯°/);
	assert.match(g, /Giọng thứ song song: Mi thứ\./);
	assert.match(g, /Nghe gam Nghe I – IV – V – I$/);
	const e = chu(thongTinGiong({ giong: 'G', thu: true }));
	assert.match(e, /^Giọng Mi thứ \(E minor\).*Các nốt: Mi – Fa♯ – Sol – La – Si – Đô – Rê – Mi.*Giọng trưởng song song: Sol trưởng\.\s*Nghe gam$/);
	assert.doesNotMatch(e, /Hợp âm các bậc/);
	assert.match(chu(thongTinGiong({ giong: 'F#', thu: false })), /Cùng vị trí trên vòng: Sol♭ trưởng \(6 dấu giáng: B♭, E♭, A♭, D♭, G♭, C♭\), đồng âm khác tên\./);
	assert.match(chu(thongTinGiong({ giong: 'Db', thu: false })), /Cùng vị trí trên vòng: Đô♯ trưởng \(7 dấu thăng: .*\), đồng âm khác tên\./);
	// hợp âm các bậc của mọi giọng trưởng: I, IV, V trưởng; ii, iii, vi thứ; vii° giảm (đo bằng nửa cung)
	const loai = (nots) => [(nots[1] - nots[0] + 12) % 12, (nots[2] - nots[0] + 12) % 12].join();
	for (const k of GIONG) {
		const t = chu(thongTinGiong({ giong: k.chu_am, thu: false }));
		const hop = /Hợp âm các bậc: (.*?) Giọng thứ/.exec(t)[1].split(', ').map((x) => x.split(' = ')[1]);
		hop.forEach((h, i) => {
			const goc = h.replace(/m$|°$/, '');
			const kieu = h.endsWith('°') ? 'dim' : h.endsWith('m') ? 'min' : 'maj';
			const mong = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'][i];
			assert.equal(kieu, mong, `${k.chu_am} trưởng, bậc ${i + 1}: ${h}`);
			const nots = hopAm(`${goc.replace('♯', '#').replace('♭', 'b')}4`, kieu).map((n) => midi(n) % 12);
			assert.equal(loai(nots), { maj: '4,7', min: '3,7', dim: '3,6' }[kieu]);
		});
	}
});

test('::cong-cu{ten="keysig-quiz"}: điều khiển như circle.js cũ; câu hỏi mặc định dựng sẵn; mẹo khi sai đúng như bài 8', () => {
	const html = dung('::cong-cu{ten="keysig-quiz"}');
	assert.equal(html, congCuLuyenHoaBieu());
	assert.ok(canTaiScript(html));
	assert.match(chu(html), /^Hỏi về Giọng trưởng Giọng thứ Cả hai Phạm vi Đến 4 dấu hóa Tất cả 15 giọng Khóa Khóa Sol Khóa Fa/);
	assert.match(html, /<option value="7" selected>Tất cả 15 giọng<\/option>/);
	assert.ok(html.includes(`<p class="oz-lhb-hoi">${CAU_HOI.truong}</p>`));
	assert.equal((html.match(/data-giong=/g) ?? []).length, 15, 'dựng sẵn 15 nút của câu hỏi mặc định');
	assert.ok(html.includes(nutTraLoi('truong', 7)));
	assert.deepEqual(giongDuocHoi(4).map((k) => k.chu_am), ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab']);
	assert.equal(giongDuocHoi(7).length, 15);
	assert.match(nutTraLoi('thu', 4), /^<button type="button" class="oz-btn" data-giong="C">La thứ <small>A<\/small><\/button>/);
	assert.equal(meo(3), 'Chưa đúng. Mẹo: dấu thăng cuối cùng nằm ngay dưới chủ âm nửa cung.');
	assert.equal(meo(-2), 'Chưa đúng. Mẹo: dấu giáng áp chót chính là tên giọng (trừ Fa trưởng có 1 dấu giáng).');
	assert.equal(meo(0), 'Chưa đúng. Không có dấu hóa nào.');
	assert.throws(() => dung('::cong-cu{ten="keysig-quiz" khoa="fa"}'), /không nhận thông số/);
});
