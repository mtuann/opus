// Sách in được (D7-L3, thay ../opus-zero/hooks/books.py): sau khi build xong (astro:build:done), mỗi cuốn trong SACH thành
// một trang HTML độc lập dist/sach/<id>.html, ghép từ HTML đã dựng của các trang có trong bản build (bản thật: chỉ trang
// đã khóa; chương chưa có thì bỏ, bìa ghi số chương). Như bản cũ: bìa, mục lục, mỗi chương một trang mới, khuông nhạc vẽ
// bằng abcjs (public/vendor/), câu hỏi kiểm tra thành câu hỏi kèm đáp án cuối chương, <details> mở sẵn, công cụ bấm được
// bị bỏ, link thành địa chỉ đầy đủ (bấm được trong PDF), id tiêu đề có tiền tố chương. Người đọc mở sách rồi In → Lưu PDF.
// Trang bat-dau/sach-in link tới từng cuốn: [Mở sách](/opus/sach/<id>.html).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THU_MUC_TAC_PHAM, banGhiCuaTrang } from '../ban-build.mjs';
import { duLieuDaKiem } from '../du-lieu.mjs';
import { dinhNghiaKyHieu } from '../scripts/ve.js';
import { chuCua, docCay, doiCon, ghi, lop, tim, timHet } from './html.mjs';

/** Trang giới thiệu sách (link tới từng cuốn): sách chỉ dựng khi trang này có trong bản build. */
export const TRANG_SACH_IN = 'bat-dau/sach-in';

const L = (...ten) => ten.map((n) => `nhac-ly/${n}/`);

/**
 * Thứ tự chương tác phẩm đã có (BOOKS của books.py cũ, D7-L3): bài học theo chặng như bảng mục lục cũ, hướng dẫn nghe theo
 * menu cũ. Danh sách chương lấy từ dữ liệu (chuongTacPham, D6-L11); thứ tự này chỉ để giữ chỗ của các trang đã có.
 */
export const THU_TU_TAC_PHAM = {
	'bai-hoc': ['mozart-minuet-k2', 'minuet-sol', 'minuet-sol-thu', 'musette-re', 'schumann-album', 'burgmuller-la-candeur', 'tchaikovsky-bai-ca-phap-co', 'beethoven-sonatina-sol', 'clementi-sonatina', 'burgmuller-arabesque', 'bach-prelude-bwv939', 'tchaikovsky-cau-nguyen-buoi-sang', 'chopin-prelude-la-truong', 'grieg-arietta', 'satie-gymnopedie', 'bach-prelude-do', 'chopin-prelude-mi-thu', 'fur-elise', 'beethoven-op49-2', 'bach-invention-1', 'chopin-valse-la-thu', 'mendelssohn-thuyen-ca', 'mozart-k545', 'schumann-traumerei', 'beethoven-anh-trang', 'chopin-valse-si-thu', 'pathetique-adagio', 'chopin-nocturne-op9-2', 'bach-prelude-fugue-do-thu', 'debussy-clair-de-lune', 'schubert-impromptu-sol-giang', 'chopin-fantaisie-impromptu', 'liszt-liebestraum', 'chopin-ballade-1'],
	nghe: ['scarlatti-sonata', 'bach-goldberg', 'mozart-k331', 'mozart-concerto-21', 'beethoven-pathetique', 'beethoven-moonlight', 'schubert-impromptu', 'chopin-etude', 'schumann-kinderszenen', 'liszt-liebestraum', 'grieg-concerto', 'mussorgsky-tranh', 'brahms-intermezzo', 'rachmaninoff-2', 'debussy-preludes', 'gershwin-rhapsody', 'vivaldi-mua-xuan', 'vivaldi-mua-dong', 'bach-cello-1', 'bach-air', 'handel-hallelujah', 'haydn-94', 'mozart-40', 'mozart-nu-hoang-bong-dem', 'mozart-requiem', 'mozart-eine-kleine', 'beethoven-5', 'beethoven-op132', 'schubert-erlkonig', 'schubert-ca-hoi', 'mendelssohn-violin', 'bizet-habanera', 'tchaikovsky-ho-thien-nga', 'tchaikovsky-1812', 'brahms-4', 'dvorak-9-largo', 'grieg-buoi-sang', 'puccini-nessun-dorma', 'ravel-bolero', 'stravinsky-sacre', 'shostakovich-5', 'part-spiegel'],
};

/**
 * Chương tác phẩm của sách (D6-L11), đọc từ dữ liệu để tác phẩm thêm sau đợt 6 tự vào sách: các trang trong thư mục của
 * loại (piano/tac-pham/ hay nghe-nhac/) khai tac_pham là một bản ghi của src/data/tac-pham.yml (`cuaTrang`,
 * banGhiCuaTrang của src/ban-build.mjs, dùng chung với danh mục tác phẩm): trang chính của bản ghi, trang cap dùng chung bản
 * ghi (như nghe-nhac/beethoven-moonlight của beethoven-anh-trang) và trang cap có bản ghi riêng (là trang chính của bản ghi
 * ấy) đều vào một lần.
 * Trang có trong THU_TU_TAC_PHAM giữ thứ tự ấy; trang mới: bài học chen vào trước bài đầu tiên có chặng lớn hơn (không có thì
 * cuối; bài học trong THU_TU_TAC_PHAM xếp tăng dần theo chặng, giữ thứ tự cũ trong cùng chặng, như menu: chủ repo chọn 09/11/2026), hướng dẫn nghe thêm vào cuối; nhiều
 * trang mới thì theo thứ tự trong tac-pham.yml. Trang thứ tự cũ mà dữ liệu không còn thì bỏ. Chỉ đọc slug, loai, chang để
 * xếp chương: chương chỉ vào sách khi trang có trong bản build (bản thật: trang đã khóa), nên không hiện trường nào của bản ghi.
 * @returns {string[]} địa chỉ như "piano/tac-pham/fur-elise/"
 */
export function chuongTacPham(loai, tacPham = duLieuDaKiem()['tac-pham'], thuTu = THU_TU_TAC_PHAM[loai], cuaTrang = banGhiCuaTrang()) {
	const goc = THU_MUC_TAC_PHAM[loai];
	const chang = new Map(); // trang -> chặng (bài học)
	const trang = [];
	for (const r of tacPham) {
		for (const [t, s] of cuaTrang) {
			if (s !== r.slug || !t.startsWith(goc)) continue;
			trang.push(t);
			if (r.loai === 'bai-hoc' && r.chang !== undefined) chang.set(t, r.chang);
		}
	}
	const co = new Set(trang);
	const ds = thuTu.map((n) => goc + n).filter((t) => co.has(t));
	for (const t of trang) {
		if (ds.includes(t)) continue;
		let i = -1;
		if (loai === 'bai-hoc' && chang.has(t)) i = ds.findIndex((x) => (chang.get(x) ?? 0) > chang.get(t));
		ds.splice(i < 0 ? ds.length : i, 0, t);
	}
	return ds.map((t) => `${t}/`);
}

/**
 * Bảy cuốn như BOOKS của books.py cũ (cùng id, tên, thứ tự chương). Mô tả không ghi số trang hay số bài: sách chỉ gồm
 * trang có trong bản build, số chương ghi ở bìa.
 */
export const SACH = [
	{
		id: 'nhac-ly-co-ban',
		ten: 'Nhạc lý cơ bản',
		mo_ta: 'Bài 1–14 và ba bài ôn tập: từ tên nốt đến hòa âm chức năng và ký hiệu biểu diễn.',
		trang: L('01-cao-do-ten-not', '02-khuong-nhac-khoa', '03-truong-do', '04-nhip', '05-dau-hoa', 'on-tap-1', '06-gam-truong', '07-gam-thu', '08-hoa-bieu', '09-quang', 'on-tap-2', '10-hop-am-ba', '11-hop-am-bay', '12-hoa-am-chuc-nang', '13-ket', '14-ky-hieu-bieu-dien', 'on-tap-3'),
	},
	{
		id: 'nhac-ly-nang-cao',
		ten: 'Nhạc lý nâng cao',
		mo_ta: 'Bài 15–32 và âm học: tiết tấu nâng cao, điệu thức, chuyển giọng, hòa âm bốn bè, đối âm, kết cấu, hình thức.',
		trang: L('15-tiet-tau-nang-cao', '16-dieu-thuc-ngu-cung', '17-khoa-do-dich-giong', '18-am-ngoai-hop-am', '19-at-phu-chuyen-giong', '20-doc-tong-pho', 'am-hoc', '21-hoa-am-bon-be', '22-doi-am', '23-hop-am-muon', '24-napoli-sau-tang', '25-be-tram-so', '26-phan-tich', '27-ky-hieu-hop-am', '28-ket-cau', '29-chuoi-hoa-am', '30-phat-trien-motip', '31-hinh-thuc-nho', '32-ky-thuat-the-ky-20'),
	},
	{
		id: 'tom-tat-thuat-ngu',
		ten: 'Tóm tắt và thuật ngữ',
		mo_ta: 'Tờ tóm tắt nhạc lý và từ điển thuật ngữ.',
		trang: ['bat-dau/tom-tat/', 'nhac-ly/tu-dien/'],
	},
	{
		id: 'lich-su',
		ten: 'Lịch sử nhạc cổ điển và văn học piano',
		mo_ta: 'Các thời kỳ, nhà soạn nhạc, opera, nhạc cổ điển và nhạc truyền thống Việt Nam; lịch sử cây đàn piano, các thể loại, nhà soạn nhạc và nghệ sĩ piano.',
		trang: ['lich-su/', 'lich-su/thoi-ky/trung-co/', 'lich-su/thoi-ky/phuc-hung/', 'lich-su/thoi-ky/baroque/', 'lich-su/thoi-ky/co-dien/', 'lich-su/thoi-ky/lang-man/', 'lich-su/thoi-ky/the-ky-20/', 'lich-su/duong-dai/', 'lich-su/nha-soan-nhac/', 'lich-su/nu-nha-soan-nhac/', 'lich-su/opera/', 'lich-su/viet-nam/', 'lich-su/nhac-truyen-thong-viet-nam/', 'piano/lich-su-dan/', 'piano/the-loai/', 'piano/nha-soan-nhac/', 'piano/nghe-si/'],
	},
	{
		id: 'huong-dan-nghe',
		ten: 'Hướng dẫn nghe',
		mo_ta: 'Cách đọc tên tác phẩm và bản thu, cùng các hướng dẫn nghe từng bước, có chỗ để ghi mốc thời gian bằng tay.',
		get trang() {
			return ['nghe-nhac/doc-ten-tac-pham/', ...chuongTacPham('nghe')];
		},
	},
	{
		id: 'piano-ky-thuat',
		ten: 'Piano: kỹ thuật và cách tập',
		mo_ta: 'Lộ trình 7 chặng và lộ trình năm đầu, chọn đàn, tư thế, bản đồ bàn phím, hai tuần đầu tiên, năm ngón, gam và ngón bấm, hợp âm và hình đệm, tạo tiếng đàn, bàn đạp, nốt hoa mỹ, phối hợp hai tay, quãng tám và bước nhảy, nốt lặp và nốt kép, bài tập ngón, cách tập, thị tấu, học thuộc và biểu diễn, chơi cùng người khác, giữ tay khỏe; hòa âm bên phím và ứng tác.',
		trang: ['piano/lo-trinh/', 'bat-dau/lo-trinh-choi/', ...['chon-dan', 'tu-the', 'ban-do-ban-phim', 'hai-tuan-dau', 'nam-ngon', 'gam', 'hop-am-rai', 'tieng-dan', 'ban-dap', 'not-hoa-my', 'hai-tay', 'quang-tam-buoc-nhay', 'not-lap-not-kep', 'bai-tap-ngon', 'cach-tap', 'thi-tau', 'hoc-thuoc-bieu-dien', 'choi-cung-nguoi-khac', 'suc-khoe', 'hoa-am', 'hoa-am/ket', 'hoa-am/dem-giai-dieu', 'hoa-am/mau-galant', 'hoa-am/ung-tac'].map((n) => `piano/${n}/`)],
	},
	{
		id: 'piano-tac-pham',
		ten: 'Piano: 10 bài đầu tiên và bài học tác phẩm',
		mo_ta: '10 bài hai tay có số ngón, tác phẩm theo cấp độ và các bài học tác phẩm, từ Minuet Fa trưởng của Mozart đến Ballade số 1 của Chopin: cấu trúc, chỗ khó, bài tập chuẩn bị, kế hoạch tập.',
		get trang() {
			return ['piano/10-bai-dau-tien/', 'piano/tac-pham-theo-cap/', ...chuongTacPham('bai-hoc')];
		},
	},
];

/**
 * Phần tử bị bỏ khỏi sách: công cụ bấm được (lớp oz-tool, bàn phím chỉ tô phím, trạng thái bài, khối nghe), dòng ghi nguồn mẫu âm
 * của công cụ, ô "chưa chuyển", phần chỉ để xem trên màn hình (oz-khong-in), <noscript>, script, link # cạnh tiêu đề.
 */
const LOP_BO = new Set(['oz-tool', 'oz-ban-phim', 'oz-trang-thai-bai', 'oz-listen', 'oz-nguon-am', 'oz-chua-co', 'oz-khong-in', 'sl-anchor-link']);
/**
 * Bàn phím có chữ thêm (số ngón, nhãn, ngoặc: svg.oz-phim--chu, đợt hình 1) là hình của bài, nên giữ trong sách như khi in
 * trang (@media print): chỉ bỏ dòng tên nốt và nút nghe (oz-phim-ten, oz-row) bên trong. Bàn phím chỉ tô phím thì vẫn bỏ.
 */
const laHinhPhim = (n) => lop(n).includes('oz-ban-phim') && !!tim(n, (x) => x.ten === 'svg' && lop(x).includes('oz-phim--chu'));
const LOP_BO_TRONG_HINH_PHIM = ['oz-phim-ten', 'oz-row'];
const laBo = (n) => n.ten === 'noscript' || n.ten === 'script' || (!laHinhPhim(n) && lop(n).some((c) => LOP_BO.has(c)));
/** Phần tử là công cụ (để bỏ cả mục chỉ dẫn tới nó), khác phần bỏ vì chỉ là phần phụ. */
const laCongCu = (n) => !laHinhPhim(n) && lop(n).some((c) => ['oz-tool', 'oz-ban-phim', 'oz-listen'].includes(c));

const CHU_CAI = 'ABCDEFGH';
const khoangTrang = (n) => 'chu' in n && !n.chu.trim();
const laTieuDe2 = (n) => !('chu' in n) && (n.ten === 'h2' || lop(n).includes('level-h2'));

const giaiMa = (s) =>
	s
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Câu hỏi kiểm tra nhanh (data-quiz của khối .oz-quiz, src/plugins/thanh-phan.mjs: chữ là HTML trong dòng đã dựng) thành
 * danh sách câu hỏi kèm lựa chọn A, B, C… theo thứ tự trong trang, và đáp án (chữ cái đúng, giải thích) cho cuối chương.
 * @returns {{ cauHoi: string, dapAn: string[] }}
 */
export function cauHoiIn(duLieu, batDau = 1) {
	const cau = duLieu.map((q) => `<li>${q.q}<ol type="A">${q.opts.map((o) => `<li>${o.t}</li>`).join('')}</ol></li>`);
	const dapAn = duLieu.map((q, i) => {
		const dung = q.opts.flatMap((o, j) => (o.ok ? [CHU_CAI[j]] : []));
		return `<li><strong>${batDau + i}. ${dung.join(', ')}</strong>${q.why ? ` — ${q.why}` : ''}</li>`;
	});
	return {
		cauHoi: `<div class="book-quiz"><p><strong>Kiểm tra nhanh</strong> <span class="muted">(đáp án ở cuối chương)</span></p><ol start="${batDau}">${cau.join('')}</ol></div>`,
		dapAn,
	};
}

/** Phần nội dung của một trang đã dựng: tiêu đề (h1, chữ thường) và cây của div.sl-markdown-content; không có thì null. */
export function docTrang(html) {
	const cay = docCay(html);
	const noiDung = tim(cay, (n) => n.ten === 'div' && lop(n).includes('sl-markdown-content'));
	if (!noiDung) return null;
	const h1 = tim(cay, (n) => n.ten === 'h1');
	const dau = tim(cay, (n) => n.ten === 'head');
	const css = dau ? timHet(dau, (n) => n.ten === 'style' || (n.ten === 'link' && n.tt.rel === 'stylesheet')).map(ghi) : [];
	return { ten: h1 ? giaiMa(chuCua(h1)).replace(/\s+/g, ' ').trim() : '', noiDung, css };
}

/**
 * Một chương của sách từ cây nội dung của trang `url` ("nhac-ly/01-cao-do-ten-not/"), chương số `so`: bỏ công cụ (và mục
 * chỉ có lời dẫn tới công cụ), câu hỏi thành câu hỏi in kèm đáp án cuối chương, <details> mở sẵn, id có tiền tố
 * "c<số>-", link thành địa chỉ đầy đủ trên `site` (như "https://mtuann.github.io/opus/"). Trả về HTML của chương.
 */
export function lamChuong(noiDung, url, so, site) {
	const dapAn = [];
	let soCau = 1;
	doiCon(noiDung, (con, cha) => {
		if (laHinhPhim(cha)) return con.filter((n) => 'chu' in n || !(n.ten === 'noscript' || lop(n).some((c) => LOP_BO_TRONG_HINH_PHIM.includes(c))));
		const coCongCu = con.some((n) => !('chu' in n) && laCongCu(n));
		let ra = con.filter((n) => 'chu' in n || !laBo(n));
		// mục h2 chỉ còn lời dẫn (nhiều nhất một đoạn) tới công cụ vừa bỏ: bỏ cả mục, như books.py cũ
		if (coCongCu) {
			const giu = [];
			for (let i = 0; i < ra.length; i++) {
				if (!laTieuDe2(ra[i])) {
					giu.push(ra[i]);
					continue;
				}
				let j = i + 1;
				while (j < ra.length && !laTieuDe2(ra[j])) j++;
				const trongMuc = ra.slice(i + 1, j).filter((n) => !khoangTrang(n));
				const goc = con.slice(con.indexOf(ra[i]) + 1, j < ra.length ? con.indexOf(ra[j]) : con.length);
				const boCongCu = goc.some((n) => !('chu' in n) && laCongCu(n));
				if (boCongCu && trongMuc.length <= 1 && trongMuc.every((n) => n.ten === 'p')) i = j - 1;
				else giu.push(ra[i]);
			}
			ra = giu;
		}
		return ra.map((n) => {
			if ('chu' in n || !lop(n).includes('oz-quiz')) return n;
			const { cauHoi, dapAn: d } = cauHoiIn(JSON.parse(giaiMa(n.tt['data-quiz'] ?? '[]')), soCau);
			soCau += d.length;
			dapAn.push(...d);
			return { chu: cauHoi };
		});
	});
	for (const d of timHet(noiDung, (n) => n.ten === 'details')) if (!('open' in d.tt)) d.tho += ' open';
	let html = ghi(noiDung);
	const tienTo = `c${so}-`;
	const goc = new URL(url, site);
	html = html
		.replace(/\s(id|for|aria-labelledby|aria-describedby)="([^"]+)"/g, (_, a, v) => ` ${a}="${v.split(/\s+/).map((x) => tienTo + x).join(' ')}"`)
		.replace(/url\(#([^)]+)\)/g, (_, v) => `url(#${tienTo}${v})`)
		.replace(/\shref="([^"]*)"/g, (_, h) => {
			const d = giaiMa(h);
			// ký hiệu hóa biểu (<use href="#oz-kh-…">) dùng định nghĩa chung của cả cuốn
			if (d.startsWith('#oz-kh-')) return ` href="${h}"`;
			if (d.startsWith('#')) return ` href="#${tienTo}${esc(d.slice(1))}"`;
			if (/^[a-z][a-z0-9+.-]*:/i.test(d)) return ` href="${esc(d)}"`;
			return ` href="${esc(new URL(d, goc).href)}"`;
		});
	return html + (dapAn.length ? `<div class="book-answers"><p><strong>Đáp án kiểm tra nhanh</strong></p><ol class="plain">${dapAn.join('')}</ol></div>` : '');
}

/** Ngày dạng 05/11/2026. */
export const ngayIn = (d = new Date()) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const CSS = `
:root { color-scheme: light; --ink: #1f3a5f; --muted: #555; --line: #ccc; }
body { color: #111; background: #fff; line-height: 1.55; max-width: 46rem; margin: 0 auto; padding: 1.5rem; font-size: 11pt; }
h1, h2, h3 { color: var(--ink); line-height: 1.25; font-family: var(--oz-heading, Georgia, serif); }
.cover h1 { font-size: 2.6rem; margin: 0.2rem 0; }
.chapter > h1 { font-size: 1.7rem; margin: 0 0 1rem; }
.sl-markdown-content h2 { font-size: 1.25rem; margin-top: 1.6rem; }
.sl-markdown-content h3 { font-size: 1.05rem; }
a { color: var(--ink); }
table { border-collapse: collapse; width: 100%; margin: 0.8rem 0; font-size: 0.92em; }
th, td { border: 1px solid var(--line); padding: 0.3rem 0.45rem; text-align: left; vertical-align: top; }
th { background: #f2f4f7; }
.starlight-aside, details { border-left: 4px solid var(--ink); background: #f6f8fb; padding: 0.4rem 0.8rem; margin: 0.8rem 0; }
.starlight-aside__title, summary { font-weight: 600; }
.starlight-aside__icon { width: 1em; height: 1em; vertical-align: -0.1em; }
.abc-notation { min-height: 0 !important; margin: 0.4rem 0 0.8rem; }
.abc-notation svg { max-width: 100%; }
figure { margin: 0.8rem 0 1.1rem; break-inside: avoid; }
figcaption { font-size: 0.85em; color: var(--muted); margin-top: 0.25rem; }
.book-quiz { border: 1px solid var(--line); padding: 0.5rem 1rem; margin: 1rem 0; }
.book-quiz ol ol { margin: 0.2rem 0 0.5rem; }
.book-answers { font-size: 0.9em; border-top: 2px solid var(--line); margin-top: 1.4rem; padding-top: 0.4rem; }
ol.plain { list-style: none; padding-left: 0; }
.muted { color: var(--muted); font-weight: 400; }
.cover { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; border-bottom: 3px double var(--ink); margin-bottom: 1.5rem; }
.toc ol { columns: 2; column-gap: 2rem; }
.chapter { break-before: page; }
.toolbar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid var(--line); padding: 0.5rem 0; margin-bottom: 1rem; z-index: 2; }
.toolbar button { font: inherit; min-height: 44px; padding: 0.45rem 0.9rem; border-radius: 8px; border: 1px solid var(--ink); background: var(--ink); color: #fff; cursor: pointer; }
.toolbar button[disabled] { opacity: 0.6; cursor: wait; }
.oz-sap-co-nhan { font-size: 0.8em; color: var(--muted); }
@media print {
  body { max-width: none; padding: 0; }
  .toolbar { display: none; }
  a { text-decoration: none; }
  h2, h3 { break-after: avoid; }
  table, .oz-abc, .book-quiz, .starlight-aside, details { break-inside: avoid; }
  .toc { break-after: page; }
  @page { size: A4; margin: 15mm 14mm; }
}
`;

/**
 * Trang HTML của một cuốn sách. `chuong`: [{ url, ten, html }] (html đã qua lamChuong); `css`: thẻ CSS của trang site
 * (để hình, bảng, aside có màu và font như trên site); `base`: "/opus/"; `site`: địa chỉ đầy đủ của site.
 */
export function trangSach(sach, chuong, { css = [], ngay = ngayIn(), base = '/opus/', site = 'https://mtuann.github.io/opus/' } = {}) {
	const kyHieu = chuong.some((c) => c.html.includes('href="#oz-kh-')) ? dinhNghiaKyHieu() : '';
	const tong = sach.trang.length;
	const soChuong =
		chuong.length === 0
			? 'Chưa có chương nào: các trang của cuốn này chưa lên site'
			: chuong.length < tong
				? `${chuong.length} chương (các trang đã lên site; trang khác sẽ có trong sách khi lên site)`
				: `${chuong.length} chương`;
	return `<!doctype html>
<html lang="vi" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(sach.ten)} · Opus</title>
<meta name="description" content="${esc(sach.mo_ta)}">
<meta name="robots" content="noindex">
${[...new Set(css)].join('\n')}
<style>${CSS}</style></head>
<body data-so-chuong="${chuong.length}">
<div class="toolbar"><button id="print" type="button">In / Lưu PDF</button> <span class="muted">Chọn “Lưu dưới dạng PDF” trong hộp thoại in để có file PDF.</span></div>
<main>
<section class="cover"><p class="muted">Opus</p><h1>${esc(sach.ten)}</h1><p>${esc(sach.mo_ta)}</p>
<p class="muted">Bản in ngày ${esc(ngay)} · ${esc(soChuong)} · Bản trực tuyến: <a href="${esc(site)}">${esc(site)}</a></p>
<p class="muted">Nội dung theo giấy phép CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/): được chia sẻ và chỉnh sửa nếu ghi nguồn và chia sẻ lại theo cùng giấy phép. Bản thu, font và nội dung trích từ nguồn khác giữ giấy phép riêng.</p></section>
${chuong.length ? `<nav class="toc" aria-label="Mục lục"><h2>Mục lục</h2><ol>${chuong.map((c, i) => `<li><a href="#chuong-${i + 1}">${esc(c.ten)}</a></li>`).join('')}</ol></nav>` : ''}
${chuong.map((c, i) => `<section class="chapter" id="chuong-${i + 1}" data-url="${esc(c.url)}"><h1>${esc(c.ten)}</h1><div class="sl-markdown-content">${c.html}</div></section>`).join('\n')}
</main>
${kyHieu}
<script src="${base}vendor/abcjs-basic-min.js"></script>
<script>
(function () {
  var btn = document.getElementById("print");
  // nút bật sẵn (trang tắt JavaScript vẫn in được bằng lệnh In); có JavaScript thì tắt tới khi vẽ xong khuông
  btn.disabled = true; btn.textContent = "Đang vẽ khuông nhạc…";
  function xong() { document.body.setAttribute("data-ready", "1"); btn.disabled = false; btn.textContent = "In / Lưu PDF"; }
  try {
    if (window.ABCJS) document.querySelectorAll(".abc-notation[data-abc]").forEach(function (el) {
      el.textContent = "";
      ABCJS.renderAbc(el, el.getAttribute("data-abc"), { responsive: "resize", foregroundColor: "#000", paddingleft: 0, paddingright: 0 });
      el.setAttribute("data-rendered", "1");
    });
  } catch (e) { console.error(e); }
  xong();
  btn.addEventListener("click", function () { window.print(); });
})();
</script>
</body></html>
`;
}

/**
 * Dựng mọi cuốn vào `dist`/sach/, khi bản build có trang bat-dau/sach-in (không thì không có sách nào). Trang của cuốn đọc ở `dist`/<url>/index.html: không có (chưa có trong bản build) thì bỏ
 * chương. Trả về [{ id, chuong: [url…] }].
 */
export function dungSach(dist, { base = '/opus/', site = 'https://mtuann.github.io', ngay = ngayIn() } = {}) {
	const diaChi = new URL(base, site).href;
	// sách chỉ lên cùng trang Sách in được (bản thật: khi trang ấy đã khóa), vì chữ trên bìa là chữ của site chưa kiểm định
	// riêng; không có trang ấy thì không có dist/sach/
	if (!fs.existsSync(path.join(dist, TRANG_SACH_IN, 'index.html'))) {
		fs.rmSync(path.join(dist, 'sach'), { recursive: true, force: true });
		return [];
	}
	fs.mkdirSync(path.join(dist, 'sach'), { recursive: true });
	return SACH.map((s) => {
		const chuong = [];
		const css = [];
		for (const url of s.trang) {
			const f = path.join(dist, url, 'index.html');
			if (!fs.existsSync(f)) continue;
			const t = docTrang(fs.readFileSync(f, 'utf8'));
			if (!t) throw new Error(`sách ${s.id}: không đọc được nội dung của ${url}`);
			css.push(...t.css);
			chuong.push({ url, ten: t.ten || url, html: lamChuong(t.noiDung, url, chuong.length + 1, diaChi) });
		}
		fs.writeFileSync(path.join(dist, 'sach', `${s.id}.html`), trangSach(s, chuong, { css, ngay, base, site: diaChi }));
		return { id: s.id, chuong: chuong.map((c) => c.url) };
	});
}

/** Integration của Astro: dựng sách sau khi build xong (cả bản thật và bản xem). */
export function sachIn() {
	return {
		name: 'opus-sach',
		hooks: {
			'astro:build:done': ({ dir, logger }) => {
				const ra = dungSach(fileURLToPath(dir));
				if (!ra.length) return logger.info(`không dựng sách in: bản build không có trang ${TRANG_SACH_IN}`);
				const tong = (id) => SACH.find((s) => s.id === id).trang.length;
				logger.info(`đã dựng ${ra.length} cuốn sách in: ${ra.map((s) => `${s.id} (${s.chuong.length}/${tong(s.id)} chương)`).join(', ')}`);
			},
		},
	};
}
