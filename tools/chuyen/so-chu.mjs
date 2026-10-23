#!/usr/bin/env node
// So chữ hiển thị của một trang ở bản build cũ (.cache/site-cu/) và bản build mới (dist/), theo từng khối (đoạn, mục
// danh sách, ô bảng…), để biết việc chuyển cú pháp (tools/chuyen/chuyen.mjs) không làm mất hay đổi chữ (D1.4).
//   node tools/chuyen/so-chu.mjs <trang> [<trang>…] [--dist <thư mục build mới>]
// Không so phần do thành phần dựng khác cách: khuông nhạc (so tiêu đề), câu hỏi (so số câu và số lựa chọn), hình chưa
// chuyển; bỏ chữ chỉ dành cho máy đọc màn hình và link #mục cạnh tiêu đề.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = fileURLToPath(new URL('../../', import.meta.url));
export const SITE_CU = path.join(GOC, '.cache', 'site-cu');

const KHOI = new Set(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr', 'div', 'details', 'summary', 'pre', 'dt', 'dd', 'figcaption', 'blockquote', 'table', 'ul', 'ol', 'dl', 'section', 'aside', 'figure', 'hr', 'br', 'td', 'th']);
// Thẻ rỗng của HTML (không có thẻ đóng); thẻ SVG thì hoặc tự đóng (/>), hoặc có thẻ đóng riêng
const RONG = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const giaiMa = (s) =>
	s
		.replace(/&nbsp;/g, ' ')
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');

/** Tách HTML thành dãy thẻ, chú thích và chữ. */
function* tach(html) {
	const re = /<!--([\s\S]*?)-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+|<)/g;
	for (const m of html.matchAll(re)) {
		if (m[1] !== undefined) yield { loai: 'chu-thich', chu: m[1].trim() };
		else if (m[3]) {
			const tt = {};
			for (const a of m[4].matchAll(/([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) tt[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
			yield { loai: m[2] ? 'dong' : 'mo', ten: m[3].toLowerCase(), tt, tuDong: !!m[5] };
		} else yield { loai: 'chu', chu: m[6] };
	}
}

const coLop = (tt, lop) => (tt.class ?? '').split(/\s+/).includes(lop);

/** Cắt phần nội dung chính: phần tử đầu tiên khớp `laGoc(ten, tt)`, đến thẻ đóng tương ứng. */
function catNoiDung(html, laGoc) {
	const ra = [];
	let sau = 0;
	for (const t of tach(html)) {
		if (!sau) {
			if (t.loai === 'mo' && laGoc(t.ten, t.tt)) sau = 1;
			continue;
		}
		if (t.loai === 'mo' && !t.tuDong && !RONG.has(t.ten)) sau++;
		if (t.loai === 'dong' && --sau === 0) break;
		ra.push(t);
	}
	return ra;
}

/**
 * Các khối chữ hiển thị (chuỗi đã gộp khoảng trắng) của dãy thẻ `the`, bỏ cây con khớp `bo(ten, tt)`. Vùng giữa chú thích
 * <!-- fig:X --> và <!-- /fig:X --> bị bỏ nếu `boHinh(X)`.
 */
function khoiChu(the, bo, boHinh = () => false) {
	const khoi = [];
	let dang = '';
	let boSau = 0;
	let boDenHinh = null;
	let trongPre = 0; // trong khối mã: không ngắt khối theo dòng (Starlight bọc mỗi dòng mã trong một div)
	const ngat = () => {
		const s = dang.replace(/\s+/g, ' ').trim();
		if (s) khoi.push(s);
		dang = '';
	};
	for (const t of the) {
		if (boDenHinh) {
			if (t.loai === 'chu-thich' && t.chu === `/fig:${boDenHinh}`) boDenHinh = null;
			continue;
		}
		if (boSau) {
			if (t.loai === 'mo' && !t.tuDong && !RONG.has(t.ten)) boSau++;
			if (t.loai === 'dong') boSau--;
			continue;
		}
		if (t.loai === 'chu-thich') {
			const h = /^fig:([a-z0-9-]+)$/.exec(t.chu);
			if (h && boHinh(h[1])) boDenHinh = h[1];
			continue;
		}
		if (t.loai === 'mo' && bo(t.ten, t.tt)) {
			if (!t.tuDong && !RONG.has(t.ten)) boSau = 1;
			continue;
		}
		if (t.ten === 'pre') trongPre += t.loai === 'mo' ? 1 : -1;
		if (t.loai === 'chu') dang += giaiMa(t.chu);
		else if (trongPre) dang += t.ten === 'div' ? ' ' : ''; // mỗi dòng mã một div; span tô màu không thêm khoảng trắng
		else if (KHOI.has(t.ten)) ngat();
		else if (t.ten === 'td' || t.ten === 'th') dang += ' | ';
	}
	ngat();
	return khoi;
}

/** Tiêu đề khuông nhạc và số câu hỏi, lựa chọn của trang cũ: đọc từ mã ABC, mã quiz còn nằm nguyên trong HTML. */
function phanThanhPhanCu(the) {
	const abc = [];
	const quiz = { cau: 0, luaChon: 0 };
	let dang = null;
	let chu = '';
	for (const t of the) {
		if (!dang && t.loai === 'mo' && (coLop(t.tt, 'abc-notation') || coLop(t.tt, 'oz-quiz'))) {
			dang = coLop(t.tt, 'abc-notation') ? 'abc' : 'quiz';
			chu = '';
			continue;
		}
		if (dang && t.loai === 'chu') chu += giaiMa(t.chu);
		if (dang && t.loai === 'dong' && t.ten === 'div') {
			const dong = chu.split('\n').map((x) => x.trim());
			if (dang === 'abc') {
				const ten = [];
				for (const d of dong) {
					if (/^K:/.test(d)) break;
					if (/^T:/.test(d)) ten.push(d.slice(2).trim());
				}
				abc.push(ten.join(' · '));
			} else {
				quiz.cau += dong.filter((d) => d.startsWith('?')).length;
				quiz.luaChon += dong.filter((d) => /^[+-]/.test(d)).length;
			}
			dang = null;
		}
	}
	return { abc, quiz };
}

/** Như trên cho trang mới: tiêu đề trong figcaption của .oz-abc, câu hỏi dựng sẵn trong .oz-quiz. */
function phanThanhPhanMoi(the) {
	const abc = [];
	const quiz = { cau: 0, luaChon: 0 };
	for (const t of the) {
		if (t.loai !== 'mo') continue;
		if (coLop(t.tt, 'oz-abc')) abc.push('');
		if (coLop(t.tt, 'abc-notation') && t.tt['aria-label']) abc[abc.length - 1] = giaiMa(t.tt['aria-label']).replace(/^Khuông nhạc(: )?/, '');
		if (coLop(t.tt, 'oz-quiz') && t.tt['data-quiz']) {
			const ds = JSON.parse(giaiMa(t.tt['data-quiz']));
			quiz.cau += ds.length;
			quiz.luaChon += ds.reduce((n, x) => n + x.opts.length, 0);
		}
	}
	return { abc, quiz };
}

/** Id của các tiêu đề h2–h6 trong dãy thẻ (để link #mục của site cũ vẫn đúng). */
const idTieuDe = (the, bo = () => false) =>
	the.filter((t) => t.loai === 'mo' && /^h[2-6]$/.test(t.ten) && t.tt.id && !bo(t.tt.id)).map((t) => t.tt.id);

/** Khối chữ, khuông nhạc, câu hỏi của trang ở bản build cũ. */
export function docCu(html) {
	const the = catNoiDung(html, (ten, tt) => ten === 'article' && coLop(tt, 'md-content__inner'));
	const bo = (ten, tt) =>
		ten === 'h1' || ten === 'script' || ten === 'style' || coLop(tt, 'headerlink') || coLop(tt, 'md-content__button') || coLop(tt, 'md-source-file') ||
		coLop(tt, 'abc-notation') || coLop(tt, 'oz-quiz') || coLop(tt, 'oz-placement') || coLop(tt, 'footnote-backref');
	return { khoi: khoiChu(the, bo, (h) => !/^[pg]-/.test(h)), id: idTieuDe(the), ...phanThanhPhanCu(the) };
}

/** Khối chữ, khuông nhạc, câu hỏi của trang ở bản build mới. */
export function docMoi(html) {
	const the = catNoiDung(html, (ten, tt) => ten === 'div' && coLop(tt, 'sl-markdown-content'));
	const bo = (ten, tt) =>
		ten === 'script' || ten === 'style' || coLop(tt, 'sl-anchor-link') || coLop(tt, 'sr-only') || coLop(tt, 'oz-abc') || coLop(tt, 'oz-quiz') ||
		coLop(tt, 'oz-chua-co') || 'data-footnote-backref' in tt || coLop(tt, 'copy');
	return { khoi: khoiChu(the, bo), id: idTieuDe(the, (id) => id === 'footnote-label'), ...phanThanhPhanMoi(the) };
}

/** Các khối khác nhau giữa hai dãy (so theo dãy con chung dài nhất): [{ cu, moi }] với cu, moi là khối hay null. */
export function khacNhau(a, b) {
	const n = a.length;
	const m = b.length;
	const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
	for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
	const ra = [];
	let i = 0;
	let j = 0;
	while (i < n || j < m) {
		if (i < n && j < m && a[i] === b[j]) {
			i++;
			j++;
		} else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) ra.push({ cu: null, moi: b[j++] });
		else ra.push({ cu: a[i++], moi: null });
	}
	return ra;
}

const fileTrang = (goc, trang) => path.join(goc, trang === 'index' ? '' : trang.replace(/\/index$/, ''), 'index.html');

/** So một trang. Trả về { khac, abc, quiz, id, tieuDe } (mỗi mục là cặp [cũ, mới]); khac rỗng và các cặp bằng nhau là đạt. */
export function soTrang(trang, dist = path.join(GOC, 'dist')) {
	const cuHtml = fs.readFileSync(fileTrang(SITE_CU, trang), 'utf8');
	const moiHtml = fs.readFileSync(fileTrang(dist, trang), 'utf8');
	const cu = docCu(cuHtml);
	const moi = docMoi(moiHtml);
	const h1 = (html, re) =>
		giaiMa((re.exec(html)?.[1] ?? '').replace(/<a class="headerlink"[\s\S]*?<\/a>/, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
	return {
		khac: khacNhau(cu.khoi, moi.khoi),
		abc: [cu.abc, moi.abc],
		quiz: [cu.quiz, moi.quiz],
		id: [cu.id, moi.id],
		tieuDe: [h1(cuHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/), h1(moiHtml, /<h1 id="_top"[^>]*>([\s\S]*?)<\/h1>/)],
	};
}

export const dat = (kq) =>
	!kq.khac.length &&
	kq.tieuDe[0] === kq.tieuDe[1] &&
	['abc', 'quiz', 'id'].every((k) => JSON.stringify(kq[k][0]) === JSON.stringify(kq[k][1]));

// ---------- Dòng lệnh ----------
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
	const ts = process.argv.slice(2);
	const iDist = ts.indexOf('--dist');
	const dist = iDist >= 0 ? path.resolve(ts[iDist + 1]) : undefined;
	const trangs = ts.filter((t, i) => !t.startsWith('--') && (iDist < 0 || i !== iDist + 1));
	let hong = 0;
	for (const trang of trangs) {
		const kq = soTrang(trang, dist);
		if (dat(kq)) {
			console.log(`${trang}: chữ giống nhau`);
			continue;
		}
		hong++;
		console.log(`${trang}: KHÁC`);
		if (kq.tieuDe[0] !== kq.tieuDe[1]) console.log(`  tiêu đề: "${kq.tieuDe[0]}" / "${kq.tieuDe[1]}"`);
		if (JSON.stringify(kq.abc[0]) !== JSON.stringify(kq.abc[1])) console.log(`  khuông nhạc: ${JSON.stringify(kq.abc[0])} / ${JSON.stringify(kq.abc[1])}`);
		if (JSON.stringify(kq.quiz[0]) !== JSON.stringify(kq.quiz[1])) console.log(`  câu hỏi: ${JSON.stringify(kq.quiz[0])} / ${JSON.stringify(kq.quiz[1])}`);
		const idKhac = kq.id[0].filter((x, i) => x !== kq.id[1][i]);
		if (idKhac.length || kq.id[0].length !== kq.id[1].length) console.log(`  id tiêu đề: cũ ${JSON.stringify(kq.id[0])} / mới ${JSON.stringify(kq.id[1])}`);
		for (const { cu, moi } of kq.khac.slice(0, 20)) console.log(cu !== null ? `  - cũ: ${cu.slice(0, 200)}` : `  + mới: ${moi.slice(0, 200)}`);
		if (kq.khac.length > 20) console.log(`  … còn ${kq.khac.length - 20} khối khác`);
	}
	process.exit(hong ? 1 : 0);
}
