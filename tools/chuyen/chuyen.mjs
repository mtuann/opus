#!/usr/bin/env node
// Chuyển trang của site cũ sang cú pháp site mới (D1.4): đọc ../opus-zero/docs/<trang>.md, ghi src/content/docs/<trang>.md.
//   node tools/chuyen/chuyen.mjs <trang> [<trang>…] [--ghi-de] [--ra <thư mục gốc khác>]
//   <trang>: đường dẫn trong ../opus-zero/docs/, không có đuôi .md, ví dụ nhac-ly/10-hop-am-ba
// Cần bản build cũ ở .cache/site-cu/ (lệnh ở plans/lam-lai/README.md, Quy tắc chung) để lấy mô tả trang đúng như site cũ.
// Chỉ đổi cú pháp, không đổi chữ (luật 6 của kế hoạch). Chỗ script không tự quyết thì in cảnh báo; trang đích đã có thì
// không ghi đè nếu thiếu --ghi-de. Luật chuyển: AGENTS.md, mục "Khối đặc biệt" và "Link"; kiểm chữ: tools/chuyen/so-chu.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify, parse } from 'yaml';
import { duLieuDaKiem } from '../../src/du-lieu.mjs';
import { jsonChuan } from '../../src/khoa.mjs';

const GOC = fileURLToPath(new URL('../../', import.meta.url));
export const DOCS_CU = path.resolve(GOC, '..', 'opus-zero', 'docs');
export const SITE_CU = path.join(GOC, '.cache', 'site-cu');
const BASE = '/opus/';

/**
 * Khối bọc có chức năng ở site cũ (JavaScript điền hay đọc nội dung bên trong): giữ nội dung, thêm ô "chưa chuyển"
 * (::cong-cu) để lô của trang làm thành phần; kiểm thử khóa chặn trang đã khóa còn ô này.
 */
const BOC_CO_CHUC_NANG = {
	'lesson-status': 'quiz.js đánh dấu bài đã học',
	'piano-level': 'practice.js tính chặng từ các ô đánh dấu',
};
/** Lớp oz- của HTML thô mà site mới đã có CSS (src/styles/thanh-phan.css); lớp khác còn sót thì cảnh báo. */
const LOP_DA_CO = new Set(['oz-print-only']);

/** Loại hộp !!! của MkDocs -> loại aside của Starlight (Starlight có 4 loại). */
const ASIDE = {
	note: 'note', info: 'note', abstract: 'note', question: 'note', quote: 'note',
	tip: 'tip', hint: 'tip', example: 'tip', success: 'tip',
	warning: 'caution', caution: 'caution', attention: 'caution',
	danger: 'danger', error: 'danger', failure: 'danger', bug: 'danger',
};
/** Tên phím của pymdownx.keys -> chữ site cũ hiện; chữ cái thì in hoa, chữ số giữ nguyên. */
const PHIM = { ctrl: 'Ctrl', cmd: 'Cmd', alt: 'Alt', shift: 'Shift', space: 'Space', enter: 'Enter', esc: 'Esc', tab: 'Tab' };

/** Giải mã thực thể HTML trong giá trị thuộc tính (data-rec, mô tả của site cũ). */
const giaiMa = (s) =>
	s
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escThuocTinh = (s) => escHtml(s).replace(/"/g, '&quot;');
const RONG = /^\s*$/;

/** Trang của bản ghi tác phẩm: đường dẫn trang -> bản ghi (trang chính, và trang cap không có bản ghi riêng). */
export function banGhiTheoTrang(tacPham = duLieuDaKiem()['tac-pham']) {
	const chinh = (r) => (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug;
	const m = new Map(tacPham.map((r) => [chinh(r), r]));
	for (const r of tacPham) if (r.cap && !m.has(r.cap)) m.set(r.cap, r);
	return m;
}

const loaiTrang = (trang) => (trang.startsWith('piano/tac-pham/') ? 'bai-hoc' : trang.startsWith('nghe-nhac/') ? 'nghe' : null);

/**
 * Đổi một URL trong link Markdown: file .md (đường dẫn tương đối theo thư mục của trang) thành địa chỉ trên site mới
 * /opus/<trang>/ (trang mục lục index.md thành thư mục), giữ #mục; assets/… thành /opus/… (file tĩnh trong public/).
 * Link ngoài, mailto: và #mục trong trang giữ nguyên.
 */
export function doiLink(url, trang, canhBao = []) {
	if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('#')) return url;
	if (url.startsWith('/')) {
		canhBao.push(`link tuyệt đối, giữ nguyên: ${url}`);
		return url;
	}
	const [duongDan, muc] = url.split('#');
	const dich = path.posix.normalize(path.posix.join(path.posix.dirname(trang), decodeURI(duongDan)));
	if (dich.startsWith('..')) {
		canhBao.push(`link ra ngoài docs/: ${url}`);
		return url;
	}
	const sau = muc !== undefined ? `#${muc}` : '';
	if (duongDan.endsWith('.md')) {
		const t = dich.slice(0, -3);
		// kiểm trang đích có ở site cũ; máy không có ../opus-zero (như trên GitHub) thì bỏ phép kiểm này
		if (fs.existsSync(DOCS_CU) && !fs.existsSync(path.join(DOCS_CU, t + '.md'))) canhBao.push(`link tới trang không có ở site cũ: ${url}`);
		const p = t === 'index' ? '' : t.replace(/\/index$/, '') + '/';
		return BASE + p + sau;
	}
	if (dich.startsWith('assets/')) {
		canhBao.push(`link tới file tĩnh ${url}: cần file /${dich.slice(7)} trong public/ khi trang lên site`);
		return BASE + dich.slice(7) + sau;
	}
	canhBao.push(`link không rõ loại, giữ nguyên: ${url}`);
	return url;
}

/** Link trong một dòng: Markdown [chữ](url "tiêu đề"), định nghĩa link tham chiếu [id]: url, và href="…" của HTML thô. */
function doiLinkTrongDong(dong, trang, canhBao) {
	const dinhNghia = /^(\s*\[[^\]]+\]:\s*)(\S+)(.*)$/.exec(dong);
	if (dinhNghia) return dinhNghia[1] + doiLink(dinhNghia[2], trang, canhBao) + dinhNghia[3];
	// bỏ qua đoạn trong `code`: tách theo dấu ` rồi chỉ đổi phần ngoài
	return dong
		.split(/(`+[^`]*`+)/)
		.map((phan, i) =>
			i % 2
				? phan
				: phan
						.replace(/\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (_, u, t) => `](${doiLink(u, trang, canhBao)}${t})`)
						.replace(/(<a\b[^>]*?\shref=")([^"]+)"/g, (_, dau, u) => `${dau}${doiLink(u, trang, canhBao)}"`),
		)
		.join('');
}

/** ++ctrl+p++ -> phím như HTML của pymdownx.keys ở site cũ (chữ hiện ra: Ctrl+P). */
function doiPhim(dong) {
	return dong.replace(/\+\+([a-z0-9]+(?:\+[a-z0-9]+)*)\+\+/g, (_, ds) => {
		const phim = ds.split('+').map((k) => `<kbd>${PHIM[k] ?? (k.length === 1 ? k.toUpperCase() : k)}</kbd>`);
		return `<span class="keys">${phim.join('<span>+</span>')}</span>`;
	});
}

/** Khối thụt 4 dấu cách sau dòng mở (của !!!, ???): trả về [các dòng thân đã bỏ thụt, chỉ số dòng sau khối]. */
function layKhoi(dong, i, thut) {
	const than = [];
	let j = i + 1;
	const vao = thut + '    ';
	while (j < dong.length && (RONG.test(dong[j]) || dong[j].startsWith(vao))) {
		than.push(RONG.test(dong[j]) ? '' : dong[j].slice(vao.length));
		j++;
	}
	while (than.length && than.at(-1) === '') {
		than.pop();
		j--;
	}
	while (than.length && than[0] === '') than.shift();
	return [than, j];
}

/**
 * Chuyển phần thân (không có frontmatter) của một trang. Trả về các dòng mới. `ngucanh`: { trang, banGhi, canhBao }.
 * Không đụng vào bên trong khối mã (```abc, ```quiz… giữ nguyên).
 */
function chuyenThan(dong, ngucanh) {
	const { trang, banGhi, canhBao } = ngucanh;
	const ra = [];
	let rao = null; // rào của khối mã đang mở (``` hay ~~~)
	let sauHtml = 0; // số khối HTML có markdown đang mở
	let boThongTin = false; // đã gặp hộp tác phẩm: bỏ khối ??? info oz-piece-info (bảng thông tin) của nó, dù ở đâu
	for (let i = 0; i < dong.length; i++) {
		const l = dong[i];
		const mo = /^(\s*)(`{3,}|~{3,})/.exec(l);
		if (rao) {
			ra.push(l);
			if (mo && mo[2][0] === rao[0] && mo[2].length >= rao.length && l.trim() === mo[2]) rao = null;
			continue;
		}
		if (mo) {
			rao = mo[2];
			ra.push(l);
			continue;
		}

		// Vùng hình do tools/figures.py sinh: hình cấu trúc của bản ghi (p-…, g-…) hay hình khác
		const hinh = /^\s*<!-- fig:([a-z0-9-]+) -->\s*$/.exec(l);
		if (hinh) {
			let j = i + 1;
			while (j < dong.length && !dong[j].includes(`<!-- /fig:${hinh[1]} -->`)) j++;
			if (j === dong.length) throw new Error(`${trang}: thiếu <!-- /fig:${hinh[1]} -->`);
			if (/^[pg]-/.test(hinh[1])) {
				const loai = loaiTrang(trang);
				if (!banGhi?.hinh?.[loai]) canhBao.push(`hình ${hinh[1]}: bản ghi không có hinh.${loai}`);
				ra.push('::hinh-cau-truc');
			} else ra.push(`::hinh{ten="${hinh[1]}"}`);
			i = j;
			continue;
		}

		// Hộp tác phẩm: <div class="oz-piece" markdown> (hàng chip) và ??? info oz-piece-info "…" (bảng thông tin) sau nó;
		// ::hop-tac-pham dựng cả hai từ bản ghi, đứng ở chỗ hàng chip
		if (/^<div class="oz-piece" markdown>\s*$/.test(l)) {
			let j = i + 1;
			while (j < dong.length && dong[j].trim() !== '</div>') j++;
			let k = j + 1;
			while (k < dong.length && RONG.test(dong[k])) k++;
			if (!/^\?\?\? info oz-piece-info /.test(dong[k] ?? ''))
				canhBao.push('có chữ chen giữa hàng chip và bảng thông tin: nay đứng sau hộp tác phẩm');
			if (!banGhi) canhBao.push('hộp tác phẩm nhưng trang không có bản ghi trong tac-pham.yml');
			ra.push('::hop-tac-pham');
			boThongTin = true;
			i = j;
			continue;
		}
		if (boThongTin && /^\?\?\? info oz-piece-info /.test(l)) {
			i = layKhoi(dong, i, '')[1] - 1;
			while (ra.length && ra.at(-1) === '' && RONG.test(dong[i + 1] ?? '')) ra.pop();
			continue;
		}

		// Khối nghe: bản thu (data-rec) đã ở ban_thu của bản ghi; mốc tham khảo theo bảng của trang ở lại trong trang
		const nghe = /^\s*<div class="oz-listen"(?: data-rec="([^"]*)")?\s*><\/div>\s*$/.exec(l);
		if (nghe) {
			if (!nghe[1]) {
				ra.push('::khoi-nghe');
				continue;
			}
			const rec = JSON.parse(giaiMa(nghe[1]));
			const { ref, ...ban } = rec;
			for (const p of ban.parts) if (p.mp3 && !/^https?:/.test(p.mp3)) p.mp3 = p.mp3.replace(/^(\.\.\/)+assets\//, '');
			if (jsonChuan(ban) !== jsonChuan(banGhi?.ban_thu?.[0]))
				canhBao.push('bản thu trong data-rec khác ban_thu đầu tiên của bản ghi (hay bản ghi không có ban_thu)');
			ra.push(ref?.length ? `::khoi-nghe{moc="${ref.map((x) => (x === null ? '-' : String(x))).join(' ')}"}` : '::khoi-nghe');
			continue;
		}

		// Công cụ: <div class="oz-tên" data-…></div> rỗng, JavaScript của site cũ điền vào
		const congCu = /^\s*<div class="oz-([a-z0-9-]+)"((?:\s+data-[a-z0-9-]+(?:="[^"]*")?)*)\s*><\/div>\s*$/.exec(l);
		if (congCu) {
			const tt = [...congCu[2].matchAll(/data-([a-z0-9-]+)(?:="([^"]*)")?/g)].map(([, k, v]) => ` ${k}="${v ?? ''}"`);
			ra.push(`::cong-cu{ten="${congCu[1]}"${tt.join('')}}`);
			continue;
		}

		// Hộp !!! (aside của Starlight) và khối ??? (thu gọn, <details>)
		const hop = /^(\s*)(!!!|\?\?\?\+?)\s+([a-z-]+)((?:\s+[a-z0-9-]+)*)\s*(?:"(.*)")?\s*$/.exec(l);
		if (hop) {
			const [, thut, dau, loai, lop, tieuDeCu = ''] = hop;
			// site cũ hiện nguyên \" trong tiêu đề hộp (lỗi hiển thị); trang mới viết dấu nháy thường
			const tieuDe = tieuDeCu.replace(/\\"/g, '"');
			if (lop.trim()) canhBao.push(`hộp ${dau} ${loai} có lớp riêng (${lop.trim()}): bỏ lớp`);
			const [than, j] = layKhoi(dong, i, thut);
			const thanMoi = chuyenThan(than, ngucanh).map((x) => (x ? thut + x : x));
			if (dau === '!!!') {
				const kieu = ASIDE[loai] ?? (canhBao.push(`hộp !!! ${loai} chưa có trong bảng: thành note`), 'note');
				ra.push(`${thut}:::${kieu}${tieuDe ? `[${tieuDe.replace(/([[\]])/g, '\\$1')}]` : ''}`, ...thanMoi, `${thut}:::`);
			} else {
				ra.push(`${thut}<details${dau === '???+' ? ' open' : ''}>`, `${thut}<summary>${escHtml(tieuDe)}</summary>`, '', ...thanMoi, '', `${thut}</details>`);
			}
			i = j - 1;
			continue;
		}

		// HTML có Markdown bên trong (md_in_html): bỏ thuộc tính markdown, cách dòng trống để Markdown bên trong được đọc
		const md = /^(\s*<[a-z]+\b[^>]*?)\s+markdown(?:="[^"]*")?(\s*>)\s*$/.exec(l);
		if (md) {
			ra.push(md[1] + md[2], '');
			for (const lop of /class="([^"]*)"/.exec(md[1])?.[1].split(/\s+/) ?? []) {
				const ten = lop.replace(/^oz-/, '');
				if (lop === ten || !BOC_CO_CHUC_NANG[ten]) continue;
				ra.push(`::cong-cu{ten="${ten}"}`);
				if (!RONG.test(dong[i + 1] ?? '')) ra.push('');
				canhBao.push(`khối oz-${ten} có chức năng ở site cũ (${BOC_CO_CHUC_NANG[ten]}): thêm ô "chưa chuyển", lô của trang làm thành phần`);
			}
			sauHtml++;
			continue;
		}
		if (sauHtml && /^\s*<\/(div|section|article|aside)>\s*$/.test(l)) {
			if (ra.length && ra.at(-1) !== '') ra.push('');
			ra.push(l);
			sauHtml--;
			continue;
		}

		// Link nút của trang chủ cũ ({ .md-button }): bỏ
		let x = l;
		if (/\{\s*\.md-button[^}]*\}/.test(x)) {
			canhBao.push('bỏ { .md-button } của trang chủ cũ');
			x = x.replace(/\{\s*\.md-button[^}]*\}/g, '');
		}
		ra.push(doiPhim(doiLinkTrongDong(x, trang, canhBao)));
	}
	return ra;
}

/**
 * Chuyển nguyên một trang. `md`: nội dung file cũ; `moTa`: mô tả trang (thẻ meta description của bản build cũ).
 * Trả về { noiDung, canhBao }.
 */
export function chuyenTrang(md, { trang, moTa, banGhi }) {
	const canhBao = [];
	let fmCu = {};
	let than = md;
	const fm = /^---\n([\s\S]*?)\n---\n/.exec(md);
	if (fm) {
		fmCu = parse(fm[1]) ?? {};
		than = md.slice(fm[0].length);
	}
	const dong = than.replace(/\r\n/g, '\n').split('\n');
	while (dong.length && RONG.test(dong[0])) dong.shift();
	const h1 = /^# (.+?)\s*$/.exec(dong[0] ?? '');
	if (!h1) throw new Error(`${trang}: dòng đầu không phải tiêu đề # …`);
	dong.shift();
	while (dong.length && RONG.test(dong[0])) dong.shift();

	// Tiêu đề của Starlight là chữ thường, không đọc Markdown: bỏ dấu nghiêng, đậm, mã, link
	const tieuDe = h1[1].replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/(\*\*|\*|__|_|`)(.+?)\1/g, '$2');
	if (tieuDe !== h1[1]) canhBao.push(`tiêu đề bỏ định dạng Markdown: ${h1[1]}`);
	const { hide, ...giu } = fmCu;
	if (hide) canhBao.push('bỏ hide của frontmatter cũ');
	const dau = { title: tieuDe, ...(moTa && { description: moTa }), ...(banGhi && { tac_pham: banGhi.slug }), ...giu };
	const moi = chuyenThan(dong, { trang, banGhi, canhBao });
	while (moi.length && moi.at(-1) === '') moi.pop();
	// Bài học tác phẩm: ::hoc-tiep (trang chặng, trang cùng tác phẩm; sinh từ dữ liệu, data-sinh) ở cuối mục "Học tiếp",
	// sau các bài chọn lọc viết tay (AGENTS.md, "Mẫu trang"; thêm ở D6-0)
	if (banGhi && loaiTrang(trang) === 'bai-hoc' && !moi.includes('::hoc-tiep')) {
		const dauMuc = moi.findIndex((l) => /^## Học tiếp\s*(\{[^}]*\})?\s*$/.test(l));
		// trang thiếu mục thì để tests/tac-pham.test.mjs báo
		if (dauMuc >= 0) {
			let cuoi = moi.findIndex((l, i) => i > dauMuc && /^## /.test(l));
			if (cuoi < 0) cuoi = moi.length;
			while (cuoi > dauMuc + 1 && moi[cuoi - 1] === '') cuoi--;
			moi.splice(cuoi, 0, '', '::hoc-tiep');
		}
	}
	// lớp oz- còn sót trong HTML thô: site cũ có CSS hay JavaScript cho lớp này, site mới thì chưa. Khối có chức năng
	// chỉ được thêm ô "chưa chuyển" khi có thuộc tính markdown; thiếu thì cũng phải báo.
	const conSot = new Set(
		moi
			.join('\n')
			.match(/class="[^"]*"/g)
			?.flatMap((c) => c.slice(7, -1).split(/\s+/))
			.filter((c) => c.startsWith('oz-') && !LOP_DA_CO.has(c) && !(BOC_CO_CHUC_NANG[c.slice(3)] && moi.includes(`::cong-cu{ten="${c.slice(3)}"}`))),
	);
	for (const c of conSot)
		canhBao.push(
			BOC_CO_CHUC_NANG[c.slice(3)]
				? `khối ${c} có chức năng ở site cũ (${BOC_CO_CHUC_NANG[c.slice(3)]}) nhưng không có thuộc tính markdown: chưa thêm ô "chưa chuyển", thêm tay ::cong-cu{ten="${c.slice(3)}"}`
				: `lớp ${c} còn trong HTML thô: site cũ có CSS cho lớp này, site mới chưa có (lô của trang thêm CSS, hay bỏ lớp)`,
		);
	return { noiDung: `---\n${stringify(dau, { lineWidth: 0 })}---\n\n${moi.join('\n')}\n`, canhBao };
}

/**
 * Mô tả trang của site cũ, đọc ở .cache/site-cu/<trang>/index.html. Đọc thẻ og:description: thẻ <meta name="description">
 * của site cũ không thoát dấu nháy, nên mô tả có dấu " bị cắt ở đó (50 trang). Không có trang ở bản build cũ (bài blog:
 * địa chỉ cũ theo ngày đăng) thì trả về undefined.
 */
export function moTaCu(trang) {
	if (!fs.existsSync(SITE_CU)) throw new Error('chưa có .cache/site-cu/: build site cũ trước (plans/lam-lai/README.md, Quy tắc chung)');
	const f = path.join(SITE_CU, trang === 'index' ? '' : trang.replace(/\/index$/, ''), 'index.html');
	return fs.existsSync(f) ? moTaTuHtml(fs.readFileSync(f, 'utf8')) : undefined;
}

/** Mô tả trong HTML của bản build cũ: thẻ og:description (có thoát dấu nháy), hay undefined. */
export function moTaTuHtml(html) {
	const m = /<meta property="og:description" content="([^"]*)"/.exec(html);
	return m ? giaiMa(m[1]) : undefined;
}

// ---------- Dòng lệnh ----------
// import.meta.main: đúng cả khi đường dẫn script đi qua liên kết tượng trưng (/tmp trên macOS)
if (import.meta.main) {
	const thamSo = process.argv.slice(2);
	const ghiDe = thamSo.includes('--ghi-de');
	const iRa = thamSo.indexOf('--ra');
	const goc = iRa >= 0 ? path.resolve(thamSo[iRa + 1]) : GOC;
	const trangs = thamSo.filter((t, i) => !t.startsWith('--') && (iRa < 0 || i !== iRa + 1));
	if (!trangs.length) {
		console.error('Cần ít nhất một trang, ví dụ: node tools/chuyen/chuyen.mjs nhac-ly/10-hop-am-ba');
		process.exit(2);
	}
	const theoTrang = banGhiTheoTrang();
	let loi = 0;
	for (const trang of trangs.map((t) => t.replace(/\.md$/, ''))) {
		const nguon = path.join(DOCS_CU, trang + '.md');
		const dich = path.join(goc, 'src', 'content', 'docs', trang + '.md');
		try {
			if (!fs.existsSync(nguon)) throw new Error(`không có ${path.relative(GOC, nguon)}`);
			if (fs.existsSync(dich) && !ghiDe) throw new Error(`${path.relative(goc, dich)} đã có; thêm --ghi-de nếu muốn chuyển lại`);
			const moTa = moTaCu(trang);
			const { noiDung, canhBao } = chuyenTrang(fs.readFileSync(nguon, 'utf8'), { trang, moTa, banGhi: theoTrang.get(trang) });
			if (!moTa) canhBao.unshift('không thấy mô tả của trang ở bản build cũ (hay mô tả rỗng): frontmatter không có description');
			fs.mkdirSync(path.dirname(dich), { recursive: true });
			fs.writeFileSync(dich, noiDung);
			console.log(`${trang}: đã ghi ${path.relative(goc, dich)}${canhBao.length ? `, ${canhBao.length} cảnh báo:` : ''}`);
			for (const c of [...new Set(canhBao)]) console.log(`  - ${c}`);
		} catch (e) {
			console.error(`${trang}: ${e.message}`);
			loi++;
		}
	}
	process.exit(loi ? 1 : 0);
}
