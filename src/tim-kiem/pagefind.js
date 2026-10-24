// Bọc pagefind.js của Pagefind (D1.8): ô tìm kiếm của Starlight nạp file này thay cho bản gốc (đổi tên thành
// pagefind-goc.js lúc build, src/tim-kiem/tich-hop.mjs). Mọi hàm giữ nguyên, trừ search và debouncedSearch: tìm cả các
// biến thể "đ" của câu tìm (bien-the.js) rồi gộp kết quả, nên gõ "dan" cũng ra trang có chữ "đàn". Đoạn trích vẫn lấy
// từ chữ thật của trang.
import * as goc from './pagefind-goc.js';
import { bienThe } from './bien-the.js';

export * from './pagefind-goc.js';

// Bản gốc tự tìm thư mục chỉ mục theo tên file của nó (pagefind.js); đổi tên rồi thì phải báo thẳng thư mục. options()
// của Pagefind đặt lại mọi tùy chọn mỗi lần gọi (ô tìm kiếm gọi với excerptLength), nên lần nào cũng kèm basePath.
const BASE = new URL('./', import.meta.url).pathname;
export const options = (tuyChon = {}) => goc.options({ basePath: BASE, ...tuyChon });
await options();

export async function search(cau, tuyChon) {
	const ds = bienThe(cau);
	if (ds.length === 1) return goc.search(cau, tuyChon);
	const kq = await Promise.all(ds.map((t) => goc.search(t, tuyChon)));
	const theoId = new Map();
	for (const k of kq) for (const r of k?.results ?? []) if (!theoId.has(r.id) || r.score > theoId.get(r.id).score) theoId.set(r.id, r);
	const results = [...theoId.values()].sort((a, b) => b.score - a.score);
	return { ...kq[0], results, unfilteredResultCount: results.length };
}

let lan = 0;
export async function debouncedSearch(cau, tuyChon, cho = 300) {
	const t = ++lan;
	await new Promise((ok) => setTimeout(ok, cho));
	if (t !== lan) return null;
	const kq = await search(cau, tuyChon);
	return t === lan ? kq : null;
}
