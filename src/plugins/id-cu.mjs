// Plugin hast cho Sätteri (D1.4): id của tiêu đề theo đúng kiểu site cũ (Python-Markdown, toc.slugify), để link #mục của
// site cũ, trong trang và từ nơi khác, vẫn tới đúng chỗ. Luật: tách dấu (NFKD) rồi chỉ giữ ký tự ASCII, nên "đ" mất
// ("Đàn" thành "an"); bỏ ký tự không phải chữ, số, gạch dưới, gạch ngang; chữ thường; khoảng trắng và gạch liền nhau thành
// một "-"; trùng thì thêm _1, _2… Tiêu đề trang (H1 của site cũ, nay ở frontmatter) chiếm id trước.
// Chạy trước plugin id của Starlight và Astro; hai plugin đó giữ id đã có. Tiêu đề có id viết tay ({ #id }) giữ nguyên.

/** Id của một tiêu đề theo kiểu site cũ, chưa xét trùng. */
export function slugCu(chu) {
	return chu
		.normalize('NFKD')
		.replace(/[^\x00-\x7F]/g, '')
		.replace(/[^\w\s-]/g, '')
		.trim()
		.toLowerCase()
		.replace(/[-\s]+/g, '-');
}

/** Id không trùng trong `daDung`, như unique() của Python-Markdown: a, a_1, a_2…; id rỗng thành _1. */
export function khongTrung(id, daDung) {
	while (!id || daDung.has(id)) {
		const m = /^(.*)_([0-9]+)$/.exec(id);
		id = m ? `${m[1]}_${Number(m[2]) + 1}` : `${id}_1`;
	}
	daDung.add(id);
	return id;
}

export function idCu() {
	return ({ data }) => {
		const daDung = new Set();
		const tieuDe = data?.astro?.frontmatter?.title;
		if (tieuDe) khongTrung(slugCu(String(tieuDe)), daDung);
		return {
			name: 'opus-id-cu',
			element: {
				filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
				visit(node, ctx) {
					const co = node.properties?.id;
					if (typeof co === 'string' && co) daDung.add(co);
					else ctx.setProperty(node, 'id', khongTrung(slugCu(ctx.textContent(node)), daDung));
				},
			},
		};
	};
}
