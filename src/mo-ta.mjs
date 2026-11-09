// Mô tả trang (thẻ meta description, og:description) cho trang có `description` bị cắt dở bằng "…". 193 trang chuyển từ
// site cũ mang description là đoạn đầu bài cắt ở khoảng 160 ký tự, nên kết quả tìm kiếm và thẻ chia sẻ hiện câu bị cụt.
// Chủ repo chọn ngày 09/11/2026: không mở khóa từng trang mà dựng mô tả lúc build từ chính chữ của trang (đã kiểm định),
// nối tiếp tới hết câu đang dở. Không thêm chữ mới. Dùng ở src/route-mo-ta.mjs (route middleware của Starlight).
//   1. Tìm đoạn văn đầu tiên của thân bài mở đầu như description (25 ký tự đầu, bỏ cú pháp markdown khi so). Thấy thì
//      lấy đoạn ấy tới hết câu chứa chỗ bị cắt; câu ấy dài quá (hơn 120 ký tự sau chỗ cắt) thì tới hết câu trước đó.
//   2. Không thấy (chữ của trang đã sửa sau khi description được sinh): bỏ mẩu câu dở ở cuối description, nếu trước
//      đó còn ít nhất một câu trọn.
//   3. Không làm được cả hai: giữ nguyên.

/** Bỏ cú pháp markdown và HTML, gộp khoảng trắng. */
export function chuTron(s) {
	return String(s)
		.replace(/<[^>]+>/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/\*\*|__/g, '')
		.replace(/(^|[^\p{L}\p{N}])[*_]([^*_\n]+)[*_](?=$|[^\p{L}\p{N}])/gu, '$1$2')
		.replace(/`([^`]*)`/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

const chuan = (s) => s.replace(/["“”'‘’]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/** Vị trí (sau dấu) các chỗ hết câu trong `p`: . ! ? … rồi khoảng trắng và chữ hoa, ngoặc, nháy; hay hết đoạn. */
function hetCau(p) {
	const ra = [];
	const re = /[.!?…](?=\s+[\p{Lu}"“(]|\s*$)/gu;
	let m;
	while ((m = re.exec(p))) {
		const truoc = p.slice(Math.max(0, m.index - 4), m.index);
		// chữ viết tắt: tên viết tắt một chữ hoa (J. S. Bach), Op., No., BWV…
		if (/(^|[\s(])\p{Lu}$/u.test(truoc) || /(^|[^\p{L}])(Op|No|Nr|St|Dr|Mr|BWV|Hob|vs)$/u.test(truoc)) continue;
		ra.push(m.index + 1);
	}
	return ra;
}

/**
 * @param {string} moTa description trong frontmatter
 * @param {string} than thân bài (markdown, không có frontmatter)
 * @returns {string} mô tả dùng cho thẻ meta
 */
export function moTaDay(moTa, than) {
	const d = String(moTa ?? '');
	if (!d.endsWith('…')) return d;
	const truoc = chuan(chuTron(d.slice(0, -1)));
	if (truoc.length >= 20 && than) {
		const doan = String(than)
			.split(/\n\s*\n/)
			.map((x) => x.trim())
			.filter((x) => x && !/^(#|:::|::|<|\||```|[-*+]\s|\d+\.\s|>)/.test(x))
			.map(chuTron);
		// đoạn có 25 ký tự đầu của description ở ngay đầu đoạn (cho phép lệch vài chữ, như "Đây là " thêm vào trước)
		const dau = truoc.slice(0, 25);
		const p = doan.find((x) => {
			const i = chuan(x).indexOf(dau);
			return i >= 0 && i <= 10;
		});
		if (p) {
			// độ lệch do dấu nháy bị bỏ khi so: tính vị trí cắt trên chữ gốc
			const nhay = (p.slice(0, truoc.length + 10).match(/["“”'‘’]/g) ?? []).length;
			const cat = truoc.length + nhay - 3;
			const ds = hetCau(p);
			const sau = ds.find((i) => i >= cat);
			// câu đang dở quá dài: lấy tới hết câu trước chỗ cắt, nếu đủ dài
			const truocCat = ds.filter((i) => i >= 80 && i < cat).pop();
			if (sau && sau <= cat + 120) return p.slice(0, sau);
			if (truocCat) return p.slice(0, truocCat);
			return sau ? p.slice(0, sau) : p;
		}
	}
	const goc = d.slice(0, -1);
	const cuoi = hetCau(goc).filter((i) => i < goc.length - 1).pop();
	return cuoi ? goc.slice(0, cuoi) : d;
}
