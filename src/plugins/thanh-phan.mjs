// Dựng HTML cho các thành phần trong trang (D1.3), chạy lúc build. Plugin opus-markdown.mjs gọi các hàm ở đây khi gặp
// khối ```abc, ```quiz hay một chỉ thị (::hop-tac-pham…). Chữ lấy từ dữ liệu và chữ trong câu hỏi là Markdown trong
// dòng (*nghiêng*, [link](…)), dựng bằng chính Sätteri để giống phần còn lại của trang; thẻ HTML thô không dùng được.
import { markdownToHtml } from 'satteri';

export const esc = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** HTML đã dựng của trang có khối cần JavaScript (khuông nhạc, câu hỏi, khối nghe, danh sách việc) không:
 * MarkdownContent.astro chỉ tải bộ tải thành phần ở những trang này. */
export const canTaiScript = (html) => /\sclass="(?:[^"]*\s)?(?:abc-notation|oz-quiz|oz-listen|oz-viec)[\s"]/.test(html);

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

/** Hình đã có thành phần: tên (như vùng <!-- fig:tên --> của site cũ) -> hàm dựng HTML. */
const HINH = {};

/** ::hinh{ten="…"}: hình minh họa không thuộc bản ghi tác phẩm (vùng <!-- fig:… --> của trang cũ, trừ hình cấu trúc). */
export function hinh(ten, trang) {
	return HINH[ten] ? HINH[ten]() : chuaChuyen('hình', ten, trang);
}

/** Công cụ đã có thành phần: tên (như khối <div class="oz-tên"> của site cũ) -> hàm dựng HTML từ thông số. */
const CONG_CU = {};

/** ::cong-cu{ten="…" …}: công cụ luyện tập; thuộc tính khác là thông số (data-* của khối oz- cũ). */
export function congCu({ ten, ...thongSo }, trang) {
	return CONG_CU[ten] ? CONG_CU[ten](thongSo) : chuaChuyen('công cụ', ten, trang);
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
