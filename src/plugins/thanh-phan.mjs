// Dựng HTML cho các thành phần trong trang (D1.3), chạy lúc build. Plugin opus-markdown.mjs gọi các hàm ở đây khi gặp
// khối ```abc, ```quiz hay một chỉ thị (::hop-tac-pham…). Chữ lấy từ dữ liệu và chữ trong câu hỏi là Markdown trong
// dòng (*nghiêng*, [link](…)), dựng bằng chính Sätteri để giống phần còn lại của trang; thẻ HTML thô không dùng được.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdownToHtml } from 'satteri';
import { DUONG_GOC, trangCuaDiaChi, trangTrongBan } from '../ban-build.mjs';
import { chiDaKhoa, duLieuDaKiem } from '../du-lieu.mjs';
import { docKhoa, truongDaKhoa } from '../khoa.mjs';
import { GIONG, midiCua, soDauGon, tenVietCua } from '../scripts/nhac-ly.js';
import { khoangPhim, thongTinGiong, veBanPhim, veChucNang, veDieuThuc, veHoaBieu, veVongChon, veVongQuangNam } from '../scripts/ve.js';
import { CAU_HOI, nutTraLoi } from '../scripts/luyen-hoa-bieu.js';
import { veBoiAm, veLenDay, vePho } from '../scripts/am-hoc.js';
import { veLuyenTai } from '../scripts/luyen-tai.js';
import { veMayDemNhip } from '../scripts/may-dem-nhip.js';
import { TRANG_KE_HOACH, dungKeHoach, tinhKeHoach } from '../scripts/ke-hoach.js';
import { dungBaiDangTap } from '../scripts/bai-dang-tap.js';
import { bangHep } from './bang-hep.mjs';

export const esc = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** HTML đã dựng của trang có khối cần JavaScript (khuông nhạc, câu hỏi, khối nghe, danh sách việc, bài kiểm tra đầu vào,
 * chặng piano, ô gợi ý tập, bàn phím, vòng quãng năm, luyện hóa biểu, công cụ âm học, thẻ ghi nhớ, trạng thái bài đã học,
 * luyện tai, máy đếm nhịp, bài đang tập, kế hoạch tập)
 * không: MarkdownContent.astro chỉ tải bộ tải thành phần ở những trang này. */
export const canTaiScript = (html) =>
	/\sclass="(?:[^"]*\s)?(?:abc-notation|oz-quiz|oz-listen|oz-viec|oz-placement|oz-muc-do|oz-goi-y|oz-ban-phim|oz-vong|oz-lhb|oz-boi-am|oz-pho|oz-len-day|oz-the-nho|oz-trang-thai-bai|oz-lt|oz-may-dem-nhip|oz-bai-dang-tap|oz-ke-hoach)[\s"]/.test(html);

/** HTML đã dựng có hình hóa biểu (vẽ bằng <use href="#oz-kh-…">) không: MarkdownContent.astro thêm định nghĩa ký hiệu một lần. */
export const canKyHieu = (html) => html.includes('href="#oz-kh-');

/**
 * Trang có công cụ phát tiếng piano (bàn phím, vòng quãng năm, luyện tai) không: MarkdownContent.astro ghi nguồn của mẫu âm (CC BY 3.0
 * đòi ghi tác giả) một lần ở cuối bài, cạnh mục Nguồn.
 */
export const coAmPiano = (html) => /\sclass="(?:[^"]*\s)?(?:oz-ban-phim|oz-vong|oz-lt)[\s"]/.test(html);

/** Dòng ghi nguồn mẫu âm piano (public/mau-am/piano/LICENSE.txt); data-sinh: không phải chữ của trang. */
export const nguonAmPiano = (base = DUONG_GOC) =>
	`<p class="oz-nguon-am" data-sinh>Tiếng piano của công cụ trên trang: mẫu âm Salamander Grand Piano V3 của Alexander Holm, giấy phép ` +
	`<a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> (<a href="${base}mau-am/piano/LICENSE.txt">nguồn</a>).</p>`;

/**
 * Địa chỉ link được dùng trong dữ liệu: trên site (/…, không phải //máy-khác), #mục, http(s), mailto. Khác (như
 * javascript:, data:) thì bỏ link.
 */
const DIA_CHI_DUOC = /^(\/(?!\/)|#|https?:\/\/|mailto:)/i;
const chuCua = (n) => (typeof n.value === 'string' ? n.value : (n.children ?? []).map(chuCua).join(''));

/**
 * Plugin mdast cho chữ của dữ liệu: thẻ HTML thô (nút html, trong dòng hay khối) thành nút chữ, nên hiện ra đúng như
 * viết; link có địa chỉ lạ thành chữ thường; ảnh thành chữ thay thế của nó. Link và ảnh kiểu tham chiếu ([chữ][x] cùng
 * dòng [x]: địa chỉ) thành chữ: dữ liệu không dùng, và địa chỉ của chúng nằm ở nút khác, không kiểm cùng lúc được.
 */
const chuAnToan = {
	name: 'chu-an-toan',
	html: (node) => ({ type: 'text', value: node.value }),
	link: (node) => (DIA_CHI_DUOC.test(node.url.trim()) ? undefined : { type: 'text', value: chuCua(node) }),
	image: (node) => ({ type: 'text', value: node.alt ?? '' }),
	linkReference: (node) => ({ type: 'text', value: chuCua(node) }),
	imageReference: (node) => ({ type: 'text', value: node.alt ?? '' }),
};

/**
 * Markdown trong dòng -> HTML (bỏ thẻ <p> bao ngoài). Thẻ HTML thô hiện thành chữ; đoạn mã `…` và link tự động
 * <https://…> vẫn đúng; link chỉ tới địa chỉ an toàn. Thoát trên cây Markdown chứ không trên chữ nguồn, để mọi cách viết
 * backtick đều theo đúng CommonMark (review nhánh sửa nhỏ D1.3).
 */
export function md(s) {
	const { html } = markdownToHtml(String(s), { mdastPlugins: [chuAnToan], features: { smartPunctuation: false } });
	return html.trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}

// ---------- Khuông nhạc ABC ----------

/**
 * Khối ```abc: khung có tiêu đề (dòng T: ở phần đầu, dựng bằng HTML để tự xuống dòng) và chỗ abcjs vẽ khuông khi
 * khối tới gần màn hình (src/scripts/abc.js). Mã ABC nằm trong data-abc, không thành chữ của trang.
 * --he: số khuông × số hệ ước lượng, để giữ chỗ (tránh xô bố cục khi khuông vẽ xong); --he-hep: như --he khi khung
 * hẹp (dưới 620 px abcjs tự ngắt dòng, khoảng 4 ô một hệ), như hàm guess() của site cũ.
 */
export function khuongAbc(src) {
	const tieuDe = [];
	const dong = [];
	let dau = true;
	for (const l of src.replace(/\s+$/, '').split('\n')) {
		if (dau && /^T:/.test(l)) {
			tieuDe.push(l.slice(2).trim());
			continue;
		}
		if (/^K:/.test(l)) dau = false;
		dong.push(l);
	}
	const nhac = dong.filter((l) => l.trim() && !/^\s*%/.test(l) && !/^[A-Za-z]:/.test(l));
	const giong = (l) => /^\s*\[V:\s*([^\]\s]+)/.exec(l)?.[1] ?? '';
	const be = [...new Set(nhac.map(giong))];
	const soBe = Math.max(1, be.length);
	const soHe = Math.max(1, Math.round(nhac.length / soBe));
	// khung hẹp: đếm ô có nốt của bè đầu (bỏ [V:…], hợp âm "…", ký hiệu !…!), 4 ô một hệ
	const o = nhac
		.filter((l) => giong(l) === be[0])
		.join(' ')
		.replace(/\[V:[^\]]*\]|"[^"]*"|![^!]*!/g, '')
		.split('|')
		.filter((x) => /[A-Ga-gz]/.test(x)).length;
	const he = soHe * soBe;
	const heHep = Math.max(soHe, Math.ceil(o / 4)) * soBe;
	const ten = tieuDe.join(' · ');
	return (
		`<figure class="oz-abc" style="--he:${he};--he-hep:${heHep}">` +
		(ten ? `<figcaption class="oz-abc-title">${esc(ten)}</figcaption>` : '') +
		`<div class="abc-notation" role="img" aria-label="${esc(ten ? 'Khuông nhạc: ' + ten : 'Khuông nhạc')}" data-abc="${esc(dong.join('\n'))}"></div>` +
		`</figure>`
	);
}

// ---------- Câu hỏi kiểm tra nhanh ----------

/** Đọc khối ```quiz: "? câu hỏi", "+ đáp án đúng", "- đáp án sai", "> giải thích". */
export function docQuiz(src) {
	const qs = [];
	let q = null;
	for (const raw of src.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line) continue;
		const tag = line[0];
		const text = line.slice(1).trim();
		if (tag === '?') qs.push((q = { q: text, opts: [], why: '' }));
		else if (q && (tag === '+' || tag === '-')) q.opts.push({ t: text, ok: tag === '+' });
		else if (q && tag === '>') q.why += (q.why ? ' ' : '') + text;
		else throw new Error(`khối quiz: dòng không hiểu "${line}" (dòng phải mở bằng ?, +, - hoặc >)`);
	}
	for (const x of qs) if (!x.opts.some((o) => o.ok)) throw new Error(`khối quiz: câu "${x.q}" không có đáp án đúng (+)`);
	if (!qs.length) throw new Error('khối quiz rỗng');
	return qs;
}

/**
 * Khối ```quiz: danh sách câu hỏi và lựa chọn dựng sẵn bằng HTML (đọc được khi chưa có JavaScript và khi in);
 * src/scripts/quiz.js biến thành nút bấm, trộn thứ tự lựa chọn, báo đúng sai.
 */
export function quiz(src) {
	const qs = docQuiz(src);
	const data = qs.map((x) => ({ q: md(x.q), opts: x.opts.map((o) => ({ t: md(o.t), ok: o.ok })), why: md(x.why) }));
	return (
		`<div class="oz-quiz" data-quiz="${esc(JSON.stringify(data))}">` +
		`<p class="oz-quiz-head"><strong>Kiểm tra nhanh</strong> <span class="oz-stats">${qs.length} câu</span></p>` +
		`<ol class="oz-quiz-list">` +
		data.map((x) => `<li><p>${x.q}</p><ul>${x.opts.map((o) => `<li>${o.t}</li>`).join('')}</ul></li>`).join('') +
		`</ol></div>`
	);
}

// ---------- Tác phẩm: hộp thông tin, hình cấu trúc, khối nghe, học tiếp ----------

/** Tên ngắn của tác giả trong danh sách ("Beethoven: …"): họ với tên phương Tây, cả tên với tên Việt. */
export function tenNgan(nguoi) {
	if (!nguoi) return '';
	return /[đĐăĂâÂêÊôÔơƠưƯ\u1EA0-\u1EF9]/.test(nguoi.ten) ? nguoi.ten : nguoi.ten.split(' ').at(-1);
}

/** "Tác giả: Tên tác phẩm" như các bảng danh sách cũ. */
export function tenTacPham(rec, nguoi) {
	const tg = rec.khuyet_danh ? '' : tenNgan(nguoi.get(rec.tac_gia));
	return tg ? `${tg}: ${rec.ten}` : rec.ten;
}

/** Chip cấp độ: Grade và chặng của bài học (≈ ABRSM). */
export function chipCapDo(rec, chu = null) {
	return `<span class="oz-chip oz-chip--level" title="Chặng ${rec.chang} của lộ trình">${md(chu ?? '≈ ' + rec.grade)}</span>`;
}

/**
 * ::hop-tac-pham: hàng chip (giọng · nhịp, tốc độ, cấp độ, hình thức) và bảng "Thông tin tác phẩm và bản nhạc nên
 * dùng" thu gọn, cả hai dựng từ bản ghi trong src/data/tac-pham.yml.
 */
export function hopTacPham(rec) {
	const chip = (rec.chip ?? []).map((c) =>
		typeof c === 'string' ? `<span class="oz-chip">${md(c)}</span>` : chipCapDo(rec, c.cap_do),
	);
	const hang = (rec.thong_tin ?? [])
		.map(([muc, noi]) => `<tr><th scope="row">${md(muc)}</th><td>${md(noi)}</td></tr>`)
		.join('');
	return (
		`<div class="oz-piece">` +
		(chip.length ? `<p class="oz-chips">${chip.join(' ')}</p>` : '') +
		(hang
			? `<details class="oz-piece-info"><summary>Thông tin tác phẩm và bản nhạc nên dùng</summary>` +
				`<table><thead><tr><th scope="col">Mục</th><th scope="col">Thông tin</th></tr></thead><tbody>${hang}</tbody></table></details>`
			: '') +
		`</div>`
	);
}

/**
 * ::hinh-cau-truc: sơ đồ các đoạn của tác phẩm (như form_map của tools/figures.py cũ), lấy từ hinh của bản ghi theo
 * loại trang (`loai`: bai-hoc hay nghe). Mỗi đoạn rộng theo trọng số (gần đúng số ô nhịp hay thời lượng), màu theo loại
 * đoạn (LOAI_DOAN trong src/du-lieu.mjs). Một trang có thể có nhiều sơ đồ (nhiều chương, nhiều bài trong một tập).
 */
export function hinhCauTruc(rec, loai) {
	const ds = rec.hinh?.[loai];
	if (!ds) throw new Error(`bản ghi "${rec.slug}" chưa có hinh.${loai} trong src/data/tac-pham.yml`);
	return ds
		.map(({ chu_thich, doan, ghi_chu }) => {
			const o = doan
				.map(
					([nhan, nho, ts, k]) =>
						`<div class="oz-seg k-${k}" style="flex:${ts} 1 4.6rem"><b>${esc(nhan)}</b>${nho ? `<small>${esc(nho)}</small>` : ''}</div>`,
				)
				.join('');
			return `<figure class="oz-figure"><div class="oz-form-map">${o}</div><figcaption>${esc(chu_thich)}${ghi_chu ? ' ' + esc(ghi_chu) : ''}</figcaption></figure>`;
		})
		.join('');
}

/** moc="3 61 - 73": số giây của mốc tham khảo cho từng dòng bảng "Theo dõi khi nghe"; "-" là dòng chưa có mốc. */
export function docMoc(chu) {
	if (!chu.trim()) throw new Error('::khoi-nghe: moc rỗng (không có mốc thì bỏ cả thuộc tính moc)');
	return chu
		.trim()
		.split(/\s+/)
		.map((x) => {
			if (x === '-') return null;
			// chỉ số giây viết thường (12, 12.5): không nhận 0x10, 1e2, số âm
			const n = Number(x);
			if (!/^\d+(\.\d+)?$/.test(x) || !Number.isFinite(n)) throw new Error(`::khoi-nghe: mốc "${x}" không phải số giây (dòng chưa có mốc ghi "-")`);
			return n;
		});
}

/**
 * ::khoi-nghe: trình nghe kèm bản thu (src/scripts/nghe.js). Có bản thu trong bản ghi (ban_thu) thì gợi ý bản đầu tiên,
 * kèm mốc tham khảo `moc` của trang (nếu có); không có thì người học tự dán link hay chọn file. Bảng "Theo dõi khi
 * nghe" ngay sau khối là nơi ghi mốc. Dữ liệu cho script cùng dạng data-rec của site cũ.
 * Mốc nằm ở trang, không ở bản ghi: bài học và hướng dẫn nghe dùng chung bản ghi (và bản thu) nhưng mỗi trang có bảng
 * "Theo dõi khi nghe" riêng. Mốc đi theo bản thu: không mốc nào quá độ dài bản thu (số mốc so với số dòng của bảng thì
 * src/plugins/opus-markdown.mjs kiểm), để đổi bản thu hay sửa bảng mà quên mốc thì build hỏng.
 */
export function khoiNghe(rec, base, moc) {
	const ban = rec?.ban_thu?.[0];
	if (!ban) {
		if (moc !== undefined) throw new Error('::khoi-nghe có moc nhưng bản ghi không có ban_thu');
		return `<div class="oz-listen"></div>`;
	}
	const parts = ban.parts.map((p) => (p.mp3 && !/^https?:/.test(p.mp3) ? { ...p, mp3: base + p.mp3 } : p));
	const ref = moc !== undefined ? docMoc(moc) : undefined;
	const dai = parts.every((p) => typeof p.d === 'number') ? parts.reduce((t, p) => t + p.d, 0) : undefined;
	const qua = ref?.find((x) => x !== null && dai !== undefined && x > dai);
	if (qua !== undefined) throw new Error(`::khoi-nghe: mốc ${qua} giây quá độ dài bản thu (${dai} giây)`);
	const rec2 = { ...ban, parts, ...(ref && { ref }) };
	return `<div class="oz-listen" data-rec="${esc(JSON.stringify(rec2))}"></div>`;
}

// ---------- Hình minh họa, công cụ: thành phần các lô thêm dần ----------

/**
 * Ô thay cho hình hay công cụ chưa có thành phần: build vẫn chạy để xem trang (bản xem), có cảnh báo; kiểm thử chặn
 * ô này trong bản thật. Lô đầu tiên chuyển trang dùng hình hay công cụ ấy thì làm thành phần và thêm vào HINH, CONG_CU.
 */
function chuaChuyen(loai, ten, trang) {
	console.warn(`[opus] ${trang}: ${loai} "${ten}" chưa có thành phần trên site mới`);
	return `<p class="oz-chua-co" data-pagefind-ignore>${esc(loai[0].toUpperCase() + loai.slice(1))} "${esc(ten)}" chưa chuyển sang site mới.</p>`;
}

// ---------- Dữ liệu cho thành phần dựng từ dữ liệu ----------

/**
 * Dữ liệu cho hình, công cụ và trang sinh từ dữ liệu: chặng (cap-do, xếp theo id), tác phẩm, người (theo id). Ở trang đã
 * khóa, hay với thứ luôn đăng (`luonKhoa`: trang chặng, ô gợi ý tập ở trang chủ), bản ghi chỉ cho đọc trường đã khóa
 * (chiDaKhoa, src/du-lieu.mjs): đọc trường chưa khóa thì build hỏng (plans/lam-lai/README.md, Quy tắc chung).
 * @param {string} noi trang đang dựng ("piano/lo-trinh"), hay tên chỗ luôn đăng ("trang chặng 3")
 */
export function duLieuCho(noi, { luonKhoa = false, khoa = docKhoa() } = {}) {
	const daKhoa = luonKhoa || khoa.trang[noi] ? truongDaKhoa(khoa) : null;
	const ten = luonKhoa ? noi : `trang đã khóa ${noi}`;
	const boc = (bo) => (r) => (daKhoa ? chiDaKhoa(r, bo, ten, daKhoa) : r);
	const d = duLieuDaKiem();
	return {
		capDo: d['cap-do'].map(boc('cap-do')).sort((a, b) => a.id - b.id),
		tacPham: d['tac-pham'].map(boc('tac-pham')),
		nguoi: new Map(d['nha-soan-nhac'].map((r) => [r.id, boc('nha-soan-nhac')(r)])),
		thuatNgu: d['thuat-ngu'].map(boc('thuat-ngu')),
	};
}

/**
 * Tên tác phẩm trong danh sách (trang chặng, gợi ý tập): "Tác giả: tên" như các bảng danh sách cũ. Tên giữ nguyên trường
 * ten, kể cả số danh mục khi ten có (35 bản ghi; số danh mục không ghi thêm lần nữa). Bài khuyết danh, hay gán cho (ten đã
 * ghi "(gán cho …)"): chỉ tên. Markdown trong dòng, như mọi chữ của dữ liệu.
 */
export function tenTrongDanhSach(rec, nguoi) {
	return rec.khuyet_danh || rec.gan_cho ? rec.ten : tenTacPham(rec, nguoi);
}

/** Trang chính của bản ghi tác phẩm: bài học (piano/tac-pham/…) hay hướng dẫn nghe (nghe-nhac/…). */
export const trangTacPham = (rec) => (rec.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + rec.slug;

/** Grade tương đương (ABRSM) như trong trang: "≈ Grade 3"; "trước Grade 1", "diploma trở lên", "Sau Grade 8" giữ nguyên. */
export const ganDung = (grade) => (/^Grade/.test(grade) ? `≈ ${grade}` : grade);

/** Grade tương đương của chặng (trường tuong_duong của cap-do.yml). */
export const gradeChang = (c) => ganDung(c.tuong_duong);

/** Địa chỉ trang chặng (sinh ở src/pages/piano/lo-trinh/[chang].astro). */
export const diaChiChang = (id, base = DUONG_GOC) => `${base}piano/lo-trinh/chang-${id}/`;

/** Trang (địa chỉ /opus/…/) có trong bản build này không; dùng cho link do JavaScript dựng ("sắp có" như sap-co.mjs). */
export const coTrongBan = (href, trang = trangTrongBan()) => !!trangCuaDiaChi(href, DUONG_GOC, trang);

const TITLE_SAP_CO = 'Trang này sẽ lên site sau khi được kiểm tra lại';

/**
 * Link dựng ngoài plugin Markdown (trang sinh trong src/pages/): trang chưa có trong bản build thành chữ kèm nhãn "sắp có",
 * cùng HTML với src/plugins/sap-co.mjs và src/scripts/lien-ket.js (tests/khung-d2.test.mjs so ba bên). `chu` là HTML (đã thoát).
 */
export function lienKet(href, chu, co = true) {
	return co
		? `<a href="${esc(href)}">${chu}</a>`
		: `<span class="oz-sap-co" data-href="${esc(href)}" title="${TITLE_SAP_CO}">${chu} <span class="oz-sap-co-nhan" data-pagefind-ignore>sắp có</span></span>`;
}

// ---------- Hình: lộ trình 7 chặng ----------

/**
 * Sơ đồ 7 chặng (::hinh{ten="lo-trinh"} ở trang lộ trình; đầu mỗi trang chặng), sinh từ cap-do.yml: số, tên, Grade tương
 * đương, mốc thời gian, thời lượng tập; mỗi chặng dẫn sang trang chặng. Màn hình rộng: bậc thang đi lên; hẹp: danh sách
 * dọc nối bằng một đường, hay (`gon`, ở trang chặng) một hàng 7 vòng số, để phần của chặng đang xem không bị đẩy xuống
 * dưới màn hình đầu. `hienTai`: chặng của trang đang xem (aria-current). data-sinh: phần sinh từ dữ liệu (so chữ với site
 * cũ bỏ qua, tests/chuyen.test.mjs).
 */
export function hinhLoTrinh(capDo, { hienTai, base = DUONG_GOC, gon = false } = {}) {
	const muc = capDo
		.map(
			(c) =>
				`<li style="--i:${c.id}"><a href="${diaChiChang(c.id, base)}"${c.id === hienTai ? ' aria-current="page"' : ''}>` +
				`<span class="oz-chang-so" aria-hidden="true">${c.id}</span>` +
				`<span class="oz-chang-chu"><b><span class="oz-chang-n">Chặng ${c.id}. </span>${esc(c.ten)}</b>` +
				`<span class="oz-chang-grade">${esc(gradeChang(c))}</span>` +
				`<span class="oz-chang-tg"><span>${esc(c.moc_thoi_gian)}</span> <span>${esc(c.thoi_luong)}</span></span></span></a></li>`,
		)
		.join('');
	return (
		`<figure class="oz-chang-hinh${gon ? ' oz-chang-hinh--gon' : ''}" data-sinh><ol>${muc}</ol>` +
		`<figcaption>Mỗi chặng: Grade tương đương (ABRSM), mốc thời gian, thời lượng tập gợi ý.</figcaption></figure>`
	);
}

// ---------- Hình: mười lăm hóa biểu, vòng quãng năm (bài nhạc lý 8; D3-L1) ----------

/**
 * Mười lăm hóa biểu (::hinh{ten="keysigs"}, như vùng <!-- fig:keysigs --> cũ do tools/keysigs.mjs vẽ bằng abcjs): mỗi ô
 * một hóa biểu trên khóa Sol, số dấu hóa, giọng trưởng và giọng thứ song song; thứ tự không dấu, 1 đến 7 dấu thăng, 1 đến 7
 * dấu giáng. Ký hiệu vẽ bằng <use> tới định nghĩa chung của trang (MarkdownContent.astro thêm). data-sinh: chữ do thành phần
 * dựng (so chữ với site cũ bỏ qua, như vùng hình của trang cũ).
 */
export function hinhHoaBieu() {
	const o = GIONG.map(
		(k) =>
			`<li class="oz-ks"><span class="oz-ks-n"><span aria-hidden="true">${soDauGon(k.n)}</span><span class="sr-only">${k.n === 0 ? 'không dấu hóa' : `${Math.abs(k.n)} dấu ${k.n > 0 ? 'thăng' : 'giáng'}`}</span></span>` +
			`${veHoaBieu(k.n)}<b>${tenVietCua(k.chu_am)} trưởng</b><small>${tenVietCua(k.thu)} thứ</small></li>`,
	);
	return (
		`<figure class="oz-figure oz-ks-hinh not-content" data-sinh><ol class="oz-ks-luoi" aria-label="Mười lăm hóa biểu">${o.join('')}</ol>` +
		`<figcaption>Mười lăm hóa biểu. Dưới mỗi hóa biểu: giọng trưởng (đậm) và giọng thứ song song. Dấu hóa luôn được thêm theo đúng thứ tự.</figcaption></figure>`
	);
}

/** Vòng quãng năm tĩnh (::hinh{ten="circle"}, như vùng <!-- fig:circle --> cũ); data-sinh như trên. */
export const hinhVongQuangNam = () =>
	`<figure class="oz-figure not-content" data-sinh>${veVongQuangNam()}<figcaption>Theo chiều kim đồng hồ: thêm một dấu thăng; ngược chiều: thêm một dấu giáng.</figcaption></figure>`;

/** Vòng chức năng hòa âm (::hinh{ten="functions"}, bài 12); data-sinh như trên. */
export const hinhChucNang = () =>
	`<figure class="oz-figure not-content" data-sinh>${veChucNang()}<figcaption>Câu chuyện cơ bản của hòa âm: ổn định → rời đi → căng thẳng → trở về.</figcaption></figure>`;

/** Bảy điệu thức trên phím trắng (::hinh{ten="modes"}, bài 16); data-sinh như trên. */
export const hinhDieuThuc = () =>
	`<figure class="oz-figure not-content" data-sinh>${veDieuThuc()}<figcaption>Mỗi điệu thức là gam phím trắng bắt đầu từ một nốt khác. Phím tô màu là nốt bắt đầu.</figcaption></figure>`;

/** Hình đã có thành phần: tên (như vùng <!-- fig:tên --> của site cũ, hay hình mới) -> hàm dựng HTML (trang đang dựng). */
const HINH = {
	'lo-trinh': (trang) => hinhLoTrinh(duLieuCho(trang).capDo),
	keysigs: () => hinhHoaBieu(),
	circle: () => hinhVongQuangNam(),
	functions: () => hinhChucNang(),
	modes: () => hinhDieuThuc(),
};

/** ::hinh{ten="…"}: hình minh họa không thuộc bản ghi tác phẩm (vùng <!-- fig:… --> của trang cũ, trừ hình cấu trúc). */
export function hinh(ten, trang) {
	if (HINH[ten]) return HINH[ten](trang);
	const tinh = hinhTinh(ten);
	return tinh ?? chuaChuyen('hình', ten, trang);
}

/** Thư mục hình tĩnh chép từ site cũ (src/components/hinh/chuyen-hinh-cu.mjs). */
export const THU_MUC_HINH = fileURLToPath(new URL('../components/hinh/', import.meta.url));

/** Hình tĩnh <tên>.html (nguyên SVG của hình cũ, màu theo biến của site); không có thì null. */
export function hinhTinh(ten) {
	if (!/^[a-z0-9-]+$/.test(ten)) return null;
	const f = path.join(THU_MUC_HINH, `${ten}.html`);
	return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null;
}

// ---------- Công cụ: bài kiểm tra đầu vào ----------

const DOCS = fileURLToPath(new URL('../content/docs/', import.meta.url));

/**
 * Khối ```placement của trang (bài kiểm tra nhạc lý, như site cũ): "@ số | tên bài | đường dẫn trong site", rồi các câu
 * "? câu hỏi", "+ đáp án đúng", "- đáp án sai". Plugin chỉ báo tên công cụ (src/plugins/opus-markdown.mjs), nên đọc khối từ
 * nguồn của trang; mỗi trang một khối.
 */
export function docPlacement(src) {
	const bai = [];
	let b = null;
	let q = null;
	for (const raw of src.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line) continue;
		const [tag, text] = [line[0], line.slice(1).trim()];
		if (tag === '@') {
			const [n, ten, duongDan, ...thua] = text.split('|').map((x) => x.trim());
			if (!/^\d+$/.test(n ?? '') || !ten || !/^[a-z0-9-]+(\/[a-z0-9-]+)*\/$/.test(duongDan ?? '') || thua.length)
				throw new Error(`khối placement: dòng "${line}" phải dạng "@ số | tên bài | đường/dẫn/"`);
			bai.push((b = { n: Number(n), ten, duong_dan: duongDan, cau: [] }));
			q = null;
		} else if (tag === '?' && b) b.cau.push((q = { q: text, opts: [] }));
		else if (q && (tag === '+' || tag === '-')) q.opts.push({ t: text, ok: tag === '+' });
		else throw new Error(`khối placement: dòng không hiểu "${line}" (dòng mở bằng @, ?, + hoặc -)`);
	}
	if (!bai.length) throw new Error('khối placement rỗng');
	for (const x of bai) {
		if (!x.cau.length) throw new Error(`khối placement: bài ${x.n} không có câu hỏi`);
		for (const c of x.cau) if (!c.opts.some((o) => o.ok)) throw new Error(`khối placement: câu "${c.q}" không có đáp án đúng (+)`);
	}
	return bai;
}

/** Khối ```placement của trang `trang` (đọc từ src/content/docs/); trang phải có đúng một khối. */
function khoiPlacement(trang) {
	const nguon = fs.readFileSync(path.join(DOCS, `${trang}.md`), 'utf8');
	const khoi = [...nguon.matchAll(/^```placement[ \t]*\n([\s\S]*?)^```[ \t]*$/gm)].map((m) => m[1]);
	if (khoi.length !== 1) throw new Error(`trang có ${khoi.length} khối placement; mỗi trang chỉ một khối`);
	return khoi[0];
}

/**
 * Lời nhắc cho trình duyệt tắt JavaScript, trong ô công cụ do script dựng (script thay cả ô khi chạy). data-sinh: chữ do
 * thành phần dựng, không phải chữ của trang (so chữ với site cũ bỏ qua, tests/chuyen.test.mjs).
 */
const canJs = (chu) => `<noscript data-sinh><p>${esc(chu)}</p></noscript>`;

/** Bài nhạc lý gợi ý khi đã nắm hết phần nền tảng (như placement.js cũ). */
const BAI_NANG_CAO = 'nhac-ly/15-tiet-tau-nang-cao/';

/**
 * Công cụ placement: hỏi lần lượt từng câu (thứ tự lựa chọn trộn, thêm "Tôi chưa biết"), cuối bài có bảng kết quả theo bài
 * và bài nên bắt đầu; kết quả lưu như site cũ (store.placement). src/scripts/placement.js dựng giao diện từ data-placement:
 * chữ đã dựng thành HTML, link tới bài kèm cờ có trong bản build chưa (link chưa có hiện "sắp có").
 */
export function placement(src) {
	const ds = trangTrongBan();
	const lk = (duongDan) => ({ href: DUONG_GOC + duongDan, co: coTrongBan(DUONG_GOC + duongDan, ds) });
	const data = {
		bai: docPlacement(src).map((b) => ({
			n: b.n,
			ten: md(b.ten),
			...lk(b.duong_dan),
			cau: b.cau.map((c) => ({ q: md(c.q), opts: c.opts.map((o) => ({ t: md(o.t), ok: o.ok })) })),
		})),
		nang_cao: lk(BAI_NANG_CAO),
	};
	return `<div class="oz-placement oz-tool" data-placement="${esc(JSON.stringify(data))}">${canJs('Phần nhạc lý cần JavaScript: bật JavaScript trong trình duyệt để làm bài.')}</div>`;
}

// ---------- Công cụ: chặng piano của bạn (tự đánh giá ở trang kiểm tra đầu vào) ----------

/** Bài nên bắt đầu ở chặng 1 (trang của site, không phải bản ghi tác phẩm), như SUGGEST[1] của practice.js cũ. */
export const BAT_DAU_CHANG_1 = [
	['piano/hai-tuan-dau/', 'Hai tuần đầu tiên'],
	['piano/10-bai-dau-tien/', '10 bài đầu tiên (hai tay)'],
];

/**
 * Mỗi chặng: số, tên, Grade, trang chặng, và các bài nên bắt đầu (bản ghi bài học có goi_y ở chặng ấy; chặng 1: Hai tuần
 * đầu tiên, 10 bài đầu tiên). Dùng cho công cụ chặng piano và ô gợi ý tập ở trang chủ.
 */
export function goiYTheoChang({ capDo, tacPham, nguoi }, ds = trangTrongBan()) {
	const lk = (href, ten) => ({ href, ten, co: coTrongBan(href, ds) });
	return capDo.map((c) => ({
		id: c.id,
		ten: esc(c.ten),
		grade: esc(gradeChang(c)),
		trang: lk(diaChiChang(c.id), ''),
		goi_y:
			c.id === 1
				? BAT_DAU_CHANG_1.map(([d, t]) => lk(DUONG_GOC + d, esc(t)))
				: tacPham.filter((r) => r.loai === 'bai-hoc' && r.chang === c.id && r.goi_y).map((r) => lk(`${DUONG_GOC}${trangTacPham(r)}/`, md(tenTrongDanhSach(r, nguoi)))),
	}));
}

/**
 * Công cụ piano-level (khối oz-piano-level của trang kiểm tra đầu vào, như practice.js cũ): đếm việc đã đánh dấu ở các
 * danh sách "- [ ]" trong khối; làm được hai trong ba việc của một nhóm là xong chặng ấy. Hiện chặng của bạn và bài nên bắt
 * đầu; lưu chặng (store.pianoLevel, như site cũ) để trang chủ gợi ý. src/scripts/muc-do.js dựng từ data-chang.
 */
export function mucDoPiano(duLieu) {
	const data = { chang: goiYTheoChang(duLieu), lo_trinh: { href: `${DUONG_GOC}piano/lo-trinh/`, co: coTrongBan(`${DUONG_GOC}piano/lo-trinh/`) } };
	return `<div class="oz-muc-do oz-tool" aria-live="polite" data-chang="${esc(JSON.stringify(data))}">${canJs('Cần bật JavaScript trong trình duyệt để tính chặng của bạn.')}</div>`;
}

// ---------- Công cụ: ô gợi ý tập ở trang chủ ----------

/**
 * Ô gợi ý tập (::cong-cu{ten="goi-y-tap"} ở trang chủ), như khối "Hôm nay" của trang chủ cũ, chọn bài theo chặng như
 * practice.js cũ. Dựng sẵn lúc build cho người chưa có kết quả: lời mời làm bài kiểm tra đầu vào. Người đã có chặng
 * (store.pianoLevel, lưu ở trang kiểm tra đầu vào của site mới hay site cũ) thấy chặng của mình, bài nên bắt đầu (goi_y và
 * chang của dữ liệu; chặng 1: Hai tuần đầu tiên, 10 bài đầu tiên) và trang chặng; có kết quả phần nhạc lý
 * (store.placement) thì thấy bài nhạc lý nên bắt đầu. src/scripts/goi-y.js dựng phần riêng ấy từ data-goi-y. Trang chủ
 * luôn đăng, nên chỉ đọc trường đã khóa (luonKhoa). Link kèm cờ "có trong bản build" (co); bài nhạc lý lưu trong trình
 * duyệt thì so với danh sách bài nhạc lý của bản build (bai_nhac_ly), nên link tới bài chưa lên vẫn hiện "sắp có".
 */
export function goiYTap(duLieu = duLieuCho('ô gợi ý tập ở trang chủ', { luonKhoa: true }), ds = trangTrongBan()) {
	const lk = (d) => ({ href: DUONG_GOC + d, co: coTrongBan(DUONG_GOC + d, ds) });
	const data = {
		chang: goiYTheoChang(duLieu, ds),
		kiem_tra: lk('bat-dau/kiem-tra-dau-vao/'),
		nhac_ly: lk('nhac-ly/'),
		nang_cao: lk(BAI_NANG_CAO),
		bai_nhac_ly: ds.filter((t) => /^nhac-ly\/[^/]+$/.test(t) && t !== 'nhac-ly/index').map((t) => `${DUONG_GOC}${t}/`),
	};
	return (
		`<div class="oz-goi-y oz-tool" data-goi-y="${esc(JSON.stringify(data))}">` +
		`<p><strong>Chưa có chặng của bạn.</strong> Làm ${lienKet(data.kiem_tra.href, 'bài kiểm tra đầu vào', data.kiem_tra.co)}: ` +
		`ô này sẽ gợi ý bài nên tập theo chặng của bạn.</p>` +
		`<p class="oz-stats">Kết quả chỉ lưu trong trình duyệt trên máy của bạn.</p></div>`
	);
}

// ---------- Công cụ: bàn phím piano, vòng quãng năm, luyện hóa biểu (D3-L1) ----------

/** Nốt viết kiểu "C4", "F#3", "Bb5" (phải có số quãng tám) -> số MIDI trên đàn 88 phím, hay lỗi ghi rõ chỗ sai. */
function notPhim(chu, ten) {
	const m = /^[A-G](?:#|b)?\d$/.test(chu) ? midiCua(chu) : null;
	if (m === null || m < 21 || m > 108) throw new Error(`công cụ "piano": ${ten} "${chu}" không phải nốt trên đàn 88 phím (viết như C4, F#3, Bb5)`);
	return m;
}

/**
 * Thông số của bàn phím (như data-range, data-notes, data-play của khối oz-piano cũ): range="C3-C5" (mặc định C4-C5, như
 * piano.js cũ; đầu hay cuối là phím đen thì mở rộng ra phím trắng bên cạnh), notes="C3 C4 C5" (phím được tô; phải nằm
 * trong khoảng), play="chord" (nút nghe phát cùng lúc như hợp âm). Viết sai hay thông số lạ thì build hỏng.
 */
export function docThongSoBanPhim({ range = 'C4-C5', notes = '', play, ...thua }) {
	const la = Object.keys(thua);
	if (la.length) throw new Error(`công cụ "piano" không nhận thông số ${la.join(', ')} (nhận: range, notes, play)`);
	const hai = String(range).split('-');
	if (hai.length !== 2) throw new Error(`công cụ "piano": range "${range}" phải dạng "C3-C5"`);
	const [thap, cao] = khoangPhim(notPhim(hai[0], 'range'), notPhim(hai[1], 'range'));
	if (thap >= cao) throw new Error(`công cụ "piano": range "${range}" phải từ nốt thấp tới nốt cao`);
	const to = String(notes).split(/\s+/).filter(Boolean).map((n) => notPhim(n, 'notes'));
	const ngoai = to.filter((m) => m < thap || m > cao);
	if (ngoai.length) throw new Error(`công cụ "piano": notes có nốt ngoài range "${range}"`);
	if (play !== undefined && play !== 'chord') throw new Error(`công cụ "piano": play chỉ nhận "chord" (gặp "${play}")`);
	return { thap, cao, to: [...new Set(to)], hopAm: play === 'chord' };
}

/**
 * Bàn phím piano (::cong-cu{ten="piano" …}, như khối oz-piano của piano.js cũ): hình bàn phím dựng sẵn (veBanPhim, hiện cả
 * khi chưa có JavaScript), dòng đọc tên nốt vừa bấm, nút nghe các nốt được tô (khi có notes). src/scripts/ban-phim.js thêm
 * phần bấm được. Không có khung viền như các công cụ khác, để bàn phím dùng hết bề ngang của bài.
 */
export function banPhim(thongSo) {
	const { thap, cao, to, hopAm } = docThongSoBanPhim(thongSo);
	return (
		`<div class="oz-ban-phim not-content" data-sinh data-pagefind-ignore${hopAm ? ' data-choi="hop-am"' : ''}>` +
		// khung cuộn nhận tiêu điểm tới khi ban-phim.js gắn phím (bàn phím ở xa màn hình khởi tạo muộn, và khi không có
		// JavaScript): người dùng bàn phím máy tính vẫn Tab tới và cuộn được (axe: scrollable-region-focusable)
		`<div class="oz-phim-cuon" tabindex="0" role="group" aria-label="Bàn phím piano, cuộn ngang">${veBanPhim({ thap, cao, to }).svg}</div>` +
		`<p class="oz-stats oz-phim-ten" aria-live="polite">Bấm vào phím để nghe và xem tên nốt.</p>` +
		(to.length ? `<div class="oz-row"><button type="button" class="oz-btn" data-k="nghe">${hopAm ? 'Nghe hợp âm' : 'Nghe các nốt được tô'}</button></div>` : '') +
		`${canJs('Bật JavaScript trong trình duyệt để bấm phím và nghe.')}</div>`
	);
}

/**
 * Vòng quãng năm bấm được (::cong-cu{ten="circle"}, như khối oz-circle của circle.js cũ): vòng và thông tin của giọng Đô
 * trưởng dựng sẵn; src/scripts/vong-quang-nam.js cho chọn giọng khác và nghe.
 */
export const congCuVongQuangNam = () =>
	`<div class="oz-vong oz-tool not-content" data-sinh data-pagefind-ignore><div class="oz-vong-luoi">${veVongChon()}` +
	`<div class="oz-vong-tin" aria-live="polite">${thongTinGiong({ giong: 'C', thu: false })}</div></div>` +
	`${canJs('Bật JavaScript trong trình duyệt để chọn giọng khác và nghe thử.')}</div>`;

/**
 * Luyện đọc hóa biểu (::cong-cu{ten="keysig-quiz"}, như khối oz-keysig-quiz của circle.js cũ): phần điều khiển, khuông trống,
 * câu hỏi và các nút trả lời của câu hỏi mặc định (giọng trưởng, cả 15 giọng) dựng sẵn, nên khi src/scripts/luyen-hoa-bieu.js
 * chọn hóa biểu đầu tiên, ô không đổi chiều cao (không xô phần dưới).
 */
export function congCuLuyenHoaBieu() {
	const chon = (k, nhan, ds) =>
		`<label>${nhan} <select data-k="${k}">${ds.map(([v, t, dangChon]) => `<option value="${v}"${dangChon ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`;
	return (
		`<div class="oz-lhb oz-tool not-content" data-sinh data-pagefind-ignore><div class="oz-row">` +
		chon('loai', 'Hỏi về', [
			['truong', 'Giọng trưởng'],
			['thu', 'Giọng thứ'],
			['ca-hai', 'Cả hai'],
		]) +
		chon('pham-vi', 'Phạm vi', [
			['4', 'Đến 4 dấu hóa'],
			['7', 'Tất cả 15 giọng', true],
		]) +
		chon('khoa', 'Khóa', [
			['sol', 'Khóa Sol'],
			['fa', 'Khóa Fa'],
		]) +
		`</div><div class="oz-lhb-hinh">${veHoaBieu(0)}</div><p class="oz-lhb-hoi">${CAU_HOI.truong}</p>` +
		`<div class="oz-row oz-lhb-chon" role="group" aria-label="Chọn giọng">${nutTraLoi('truong', 7)}</div>` +
		`<p class="oz-feedback" aria-live="polite"></p><div class="oz-row"><button type="button" class="oz-btn" data-k="tiep">Câu khác</button></div>` +
		`<p class="oz-stats oz-lhb-so"></p>${canJs('Luyện hóa biểu cần JavaScript: bật JavaScript trong trình duyệt để làm bài.')}</div>`
	);
}

// ---------- Công cụ: âm học, thẻ ghi nhớ, trạng thái bài đã học (D3-L5) ----------

/**
 * Ô công cụ âm học (::cong-cu overtones, spectrum, tuning; như các khối oz-overtones, oz-spectrum, oz-tuning của
 * acoustics.js, spectrum.js cũ): nút, bảng bồi âm, trục của phổ dựng sẵn (src/scripts/am-hoc.js); script thêm tiếng và hình
 * phổ. data-sinh: chữ do thành phần dựng (trang cũ dựng bằng JavaScript nên bản build cũ không có chữ này).
 */
const congCuAmHoc = (lop, than, canJsChu) =>
	`<div class="${lop} oz-tool not-content" data-sinh data-pagefind-ignore>${than}${canJs(canJsChu)}</div>`;

/**
 * Thẻ ghi nhớ (::cong-cu{ten="flashcards"}, như khối oz-flashcards của flashcards.js cũ): khung thẻ dựng sẵn để giữ chỗ;
 * src/scripts/the-nho.js đọc thẻ từ các bảng "Thuật ngữ" của trang.
 */
export const theNho = () =>
	`<div class="oz-the-nho oz-tool not-content" data-sinh data-pagefind-ignore role="group" aria-label="Thẻ ghi nhớ (phím cách: lật thẻ; phím 1: chưa nhớ; phím 2: nhớ)">` +
	`<p class="oz-stats oz-tn-so"></p><div class="oz-tn-the" aria-live="polite"><div class="oz-tn-truoc"></div><div class="oz-tn-sau" hidden></div></div>` +
	`<div class="oz-row oz-tn-nut"></div>${canJs('Thẻ ghi nhớ cần JavaScript: bật JavaScript trong trình duyệt để ôn.')}</div>`;

/**
 * Trạng thái bài đã học (::cong-cu{ten="lesson-status"}, đặt trong khối <div class="oz-lesson-status"> bọc mục lục, như
 * quiz.js cũ): dòng số bài đã xong và thanh tiến độ; src/scripts/trang-thai-bai.js điền và thêm dấu "đã học" cạnh link bài.
 */
export const trangThaiBai = () =>
	`<div class="oz-trang-thai-bai not-content" data-sinh data-pagefind-ignore><p class="oz-lesson-bar oz-stats"></p></div>`;

// ---------- Công cụ: máy đếm nhịp, bài đang tập, kế hoạch tập (D4-L1) ----------

/** Trang dạng trangTrongBan ("piano/gam", "piano/index", "index") -> đường dẫn trong site có / ở cuối ("piano/gam/", "piano/", ""). */
export const duongDanTrang = (t) => (t === 'index' ? '' : t.replace(/\/index$/, '') + '/');

/**
 * Link cho bài đang tập và kế hoạch tập (dựng trên trình duyệt từ dữ liệu đã lưu): gốc site và các trang có trong bản build
 * mà hai công cụ có thể dẫn tới (trang của kế hoạch, bài học tác phẩm, hướng dẫn nghe: khóa của store.repertoire), để
 * trang chưa có hiện "sắp có".
 */
export function lienKetCongCuTap(ds = trangTrongBan()) {
	const co = new Set(ds.map(duongDanTrang));
	const them = [...co].filter((t) => /^(piano\/tac-pham|nghe-nhac)\/[a-z0-9-]+\/$/.test(t));
	return { goc: DUONG_GOC, trang: [...TRANG_KE_HOACH.filter((t) => co.has(t)), ...(co.has('piano/tac-pham/') ? ['piano/tac-pham/'] : []), ...them] };
}

/**
 * Bài đang tập (::cong-cu{ten="repertoire"}, như khối oz-repertoire của practice.js cũ; src/scripts/bai-dang-tap.js đọc
 * store.repertoire). compact="" (data-compact cũ): chưa có bài nào thì ẩn cả ô, nên dựng sẵn ô ẩn; không compact thì dựng sẵn
 * lời nhắc của danh sách rỗng. Thông số khác thì build hỏng.
 */
export function baiDangTap({ compact, ...thua }, ds = trangTrongBan()) {
	const la = Object.keys(thua);
	if (la.length) throw new Error(`công cụ "repertoire" không nhận thông số ${la.join(', ')} (nhận: compact)`);
	if (compact !== undefined && compact !== '') throw new Error(`công cụ "repertoire": compact không nhận giá trị (viết compact="", gặp "${compact}")`);
	const gon = compact !== undefined;
	const data = { ...lienKetCongCuTap(ds), muc_luc: 'piano/tac-pham/' };
	const html = gon ? '' : dungBaiDangTap({}, { compact: false, today: '', data });
	return `<div class="oz-bai-dang-tap oz-tool not-content" data-sinh data-pagefind-ignore${gon ? ' data-compact hidden' : ''} data-bai-dang-tap="${esc(JSON.stringify(data))}">${html}</div>`;
}

/**
 * Kế hoạch tập hôm nay (::cong-cu{ten="plan"}, như khối oz-plan của plan.js cũ; src/scripts/ke-hoach.js): dựng sẵn kế hoạch
 * của người chưa lưu gì (không phụ thuộc ngày), script tính lại theo dữ liệu đã lưu.
 */
export function keHoach(ds = trangTrongBan()) {
	const data = lienKetCongCuTap(ds);
	const html = dungKeHoach(tinhKeHoach({ today: '2000-01-01' }), data);
	return `<div class="oz-ke-hoach oz-tool not-content" data-sinh data-pagefind-ignore data-ke-hoach="${esc(JSON.stringify(data))}">${html}</div>`;
}

/** Công cụ đã có thành phần: tên (như khối <div class="oz-tên"> của site cũ) -> hàm dựng HTML (thông số, trang). */
const CONG_CU = {
	placement: (_, trang) => placement(khoiPlacement(trang)),
	'piano-level': (_, trang) => mucDoPiano(duLieuCho(trang)),
	'goi-y-tap': () => goiYTap(),
	piano: (thongSo) => banPhim(thongSo),
	circle: () => congCuVongQuangNam(),
	'keysig-quiz': () => congCuLuyenHoaBieu(),
	overtones: () => congCuAmHoc('oz-boi-am', veBoiAm(), 'Bật JavaScript trong trình duyệt để nghe các bồi âm.'),
	spectrum: () => congCuAmHoc('oz-pho', vePho(), 'Phổ âm cần JavaScript: bật JavaScript trong trình duyệt để xem.'),
	tuning: () => congCuAmHoc('oz-len-day', veLenDay(), 'Bật JavaScript trong trình duyệt để nghe so sánh các quãng.'),
	flashcards: () => theNho(),
	'lesson-status': () => trangThaiBai(),
	// luyện tai (D3-L6): src/scripts/luyen-tai.js
	'interval-trainer': () => veLuyenTai('interval-trainer'),
	'chord-trainer': () => veLuyenTai('chord-trainer'),
	'scale-trainer': () => veLuyenTai('scale-trainer'),
	'cadence-trainer': () => veLuyenTai('cadence-trainer'),
	// máy đếm nhịp, bài đang tập, kế hoạch tập (D4-L1)
	metronome: () => veMayDemNhip(),
	repertoire: (thongSo) => baiDangTap(thongSo),
	plan: () => keHoach(),
};
/** Công cụ không có thông số: viết thêm thuộc tính thì build hỏng (gõ nhầm, hay chép từ khối cũ). */
const KHONG_THONG_SO = new Set([
	'placement',
	'piano-level',
	'goi-y-tap',
	'circle',
	'keysig-quiz',
	'overtones',
	'spectrum',
	'tuning',
	'flashcards',
	'lesson-status',
	'interval-trainer',
	'chord-trainer',
	'scale-trainer',
	'cadence-trainer',
	'metronome',
	'plan',
]);

/** ::cong-cu{ten="…" …}: công cụ luyện tập; thuộc tính khác là thông số (data-* của khối oz- cũ). */
export function congCu({ ten, ...thongSo }, trang) {
	if (!CONG_CU[ten]) return chuaChuyen('công cụ', ten, trang);
	if (KHONG_THONG_SO.has(ten) && Object.keys(thongSo).length)
		throw new Error(`công cụ "${ten}" không nhận thông số (${Object.keys(thongSo).join(', ')})`);
	return CONG_CU[ten](thongSo, trang);
}

// ---------- Từ điển thuật ngữ (D3-L5) ----------

/** Ô bảng Markdown: Markdown trong dòng của dữ liệu, | thoát, xuống dòng thành khoảng trắng. */
const oBang = (s) => String(s ?? '').replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|');

/**
 * ::tu-dien{nhom="…"}: bảng | Thuật ngữ | Nghĩa | Ghi chú | của một nhóm trong src/data/thuat-ngu.yml (thuat_ngu, nghia,
 * ghi_chu; theo thứ tự trong file). Dựng như một bảng Markdown viết tay (cùng Sätteri, cùng plugin bảng hẹp), nên HTML
 * giống hệt bảng cũ: so chữ với site cũ và tìm kiếm thấy chữ (không data-sinh), thẻ ghi nhớ đọc được. Chữ là Markdown
 * trong dòng như các trường dữ liệu khác (thẻ HTML thô hiện thành chữ). Nhóm không có thuật ngữ nào thì build hỏng.
 * @param {string} nhom tên nhóm (trường nhom)
 * @param {object[]} thuatNgu bản ghi thuật ngữ (duLieuCho(trang).thuatNgu: trang đã khóa chỉ đọc trường đã khóa)
 */
export function tuDien(nhom, thuatNgu) {
	if (!String(nhom ?? '').trim()) throw new Error('::tu-dien cần nhom, ví dụ ::tu-dien{nhom="Tốc độ"}');
	const ds = thuatNgu.filter((r) => r.nhom === nhom);
	if (!ds.length) {
		const co = [...new Set(thuatNgu.map((r) => r.nhom))];
		throw new Error(`::tu-dien: không có thuật ngữ nào thuộc nhóm "${nhom}" trong src/data/thuat-ngu.yml (có: ${co.join('; ')})`);
	}
	const bang = ['| Thuật ngữ | Nghĩa | Ghi chú |', '|---|---|---|', ...ds.map((r) => `| ${oBang(r.thuat_ngu)} | ${oBang(r.nghia)} | ${oBang(r.ghi_chu)} |`)].join('\n');
	const { html } = markdownToHtml(bang, { mdastPlugins: [chuAnToan], hastPlugins: [bangHep()], features: { smartPunctuation: false } });
	return html.trim();
}

/**
 * ::hoc-tiep: phần sinh từ dữ liệu của mục "Học tiếp", đặt sau 2–5 bài chọn lọc viết tay (mẫu bài học cũ): trang của
 * chặng hiện tại và chặng sau (danh sách mọi bài nằm ở trang chặng, không chép lại vào từng bài) và trang cùng tác phẩm
 * (cap: bài học và hướng dẫn nghe trỏ sang nhau).
 */
export function hocTiep(rec, { tacPham, nguoi, base, trang }) {
	const dong = [];
	if (rec.loai === 'bai-hoc') {
		const chang = (n, nhan) => `<strong>${nhan}:</strong> <a href="${base}piano/lo-trinh/chang-${n}/">các bài của chặng ${n}</a>.`;
		dong.push(chang(rec.chang, `Cùng chặng ${rec.chang}`));
		if (tacPham.some((r) => r.loai === 'bai-hoc' && r.chang === rec.chang + 1)) dong.push(chang(rec.chang + 1, `Chặng ${rec.chang + 1}`));
	}
	if (rec.cap) {
		// Trang cùng tác phẩm hay tác phẩm lớn hơn: trang chính của bản ghi và trang cap trỏ sang nhau
		const chinh = (rec.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + rec.slug;
		const kia = trang === rec.cap ? chinh : rec.cap;
		const banGhiKia = tacPham.find((r) => (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug === kia) ?? rec;
		const nhan = kia.startsWith('nghe-nhac/') ? 'Nghe kèm' : 'Bài học';
		dong.push(`<strong>${nhan}:</strong> <a href="${base}${kia}/">${md(tenTacPham(banGhiKia, nguoi))}</a>.`);
	}
	if (!dong.length) return '';
	return `<ul class="oz-hoc-tiep">${dong.map((d) => `<li>${d}</li>`).join('')}</ul>`;
}
