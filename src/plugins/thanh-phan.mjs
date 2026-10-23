// Dựng HTML cho các thành phần trong trang (D1.3), chạy lúc build. Plugin opus-markdown.mjs gọi các hàm ở đây khi gặp
// khối ```abc, ```quiz hay một chỉ thị (::hop-tac-pham…). Chữ lấy từ dữ liệu có thể chứa Markdown trong dòng
// (*nghiêng*, [link](…)): dựng bằng chính Sätteri để giống phần còn lại của trang.
import { markdownToHtml } from 'satteri';

export const esc = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Markdown trong dòng -> HTML (bỏ thẻ <p> bao ngoài). */
export function md(s) {
	const { html } = markdownToHtml(String(s), { features: { smartPunctuation: false } });
	return html.trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}

/** Chữ thường của một chuỗi Markdown trong dòng (cho aria-label, title). */
export const chuTho = (s) => String(s).replace(/[*_`]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

// ---------- Khuông nhạc ABC ----------

/**
 * Khối ```abc: khung có tiêu đề (dòng T: ở phần đầu, dựng bằng HTML để tự xuống dòng) và chỗ abcjs vẽ khuông khi
 * khối tới gần màn hình (src/scripts/abc.js). Mã ABC nằm trong data-abc, không thành chữ của trang.
 * --he: số khuông × số hệ ước lượng, để giữ chỗ (tránh xô bố cục khi khuông vẽ xong).
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
	const be = [...new Set(nhac.map((l) => /^\s*\[V:\s*([^\]\s]+)/.exec(l)?.[1] ?? ''))];
	const he = Math.max(1, Math.round(nhac.length / Math.max(1, be.length))) * Math.max(1, be.length);
	const ten = tieuDe.join(' · ');
	return (
		`<figure class="oz-abc" style="--he:${he}">` +
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

/**
 * ::khoi-nghe: trình nghe kèm bản thu (src/scripts/nghe.js). Có bản thu trong bản ghi (ban_thu) thì gợi ý sẵn, kèm
 * mốc tham khảo; không có thì người học tự dán link hay chọn file. Bảng "Theo dõi khi nghe" ngay sau khối là nơi ghi mốc.
 */
export function khoiNghe(rec, base) {
	const ban = rec?.ban_thu?.[0];
	if (!ban) return `<div class="oz-listen"></div>`;
	const rec2 = { ...ban, parts: ban.parts.map((p) => (p.mp3 && !/^https?:/.test(p.mp3) ? { ...p, mp3: base + p.mp3 } : p)) };
	return `<div class="oz-listen" data-rec="${esc(JSON.stringify(rec2))}"></div>`;
}

/**
 * ::hoc-tiep: bài nên học tiếp, sinh từ dữ liệu: các bài cùng chặng, các bài của chặng sau, và trang nghe kèm (cap).
 * Thêm một bài học mới thì mọi trang cùng chặng tự có link tới nó, không phải sửa tay.
 */
export function hocTiep(rec, { tacPham, nguoi, base, trang }) {
	const bai = tacPham.filter((r) => r.loai === 'bai-hoc');
	const link = (r) =>
		`<a href="${base}piano/tac-pham/${r.slug}/">${md(tenTacPham(r, nguoi))}</a>`;
	const dong = [];
	if (rec.loai === 'bai-hoc') {
		const cung = bai.filter((r) => r.chang === rec.chang && r.slug !== rec.slug);
		const sau = bai.filter((r) => r.chang === rec.chang + 1);
		if (cung.length) dong.push(`<strong>Cùng chặng ${rec.chang}:</strong> ${cung.map(link).join(', ')}.`);
		if (sau.length) dong.push(`<strong>Chặng ${rec.chang + 1}:</strong> ${sau.map(link).join(', ')}.`);
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
