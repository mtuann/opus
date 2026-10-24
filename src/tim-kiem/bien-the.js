// Biến thể của câu tìm cho chữ "đ" (D1.8). Pagefind tự bỏ dấu khi so (gõ "lam lai" ra "làm lại"), nhưng "đ" là một
// chữ riêng chứ không phải "d" có dấu, nên gõ "dan" không ra "đàn". Trong tiếng Việt, "đ" chỉ đứng đầu âm tiết: mỗi từ
// bắt đầu bằng "d" có thêm biến thể "đ". Tối đa 3 từ như vậy (8 biến thể); câu gốc đứng đầu.
// File này chạy trong trình duyệt (chép vào dist/pagefind/ lúc build, src/tim-kiem/tich-hop.mjs) và trong kiểm thử.
export function bienThe(cau) {
	if (typeof cau !== 'string') return [cau];
	const tu = cau.trim().split(/\s+/).filter(Boolean);
	let ds = [[]];
	let soD = 0;
	for (const t of tu) {
		if (/^d/i.test(t) && soD < 3) {
			soD++;
			ds = ds.flatMap((x) => [[...x, t], [...x, (t[0] === 'D' ? 'Đ' : 'đ') + t.slice(1)]]);
		} else ds = ds.map((x) => [...x, t]);
	}
	return soD ? ds.map((x) => x.join(' ')) : [cau];
}
