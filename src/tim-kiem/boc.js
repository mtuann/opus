// Phần bọc pagefind.js của Pagefind (D1.8): tìm cả các biến thể "đ" của câu tìm (bien-the.js) rồi gộp kết quả. Viết thành
// hàm nhận module gốc, để kiểm thử được với một bản gốc giả (tests/tim-kiem.test.mjs); src/tim-kiem/pagefind.js gọi với
// pagefind-goc.js của bản build. File này chạy trong trình duyệt (chép vào dist/pagefind/ lúc build) và trong kiểm thử.
import { bienThe } from './bien-the.js';

/**
 * Gộp kết quả tìm của các biến thể: mỗi kết quả (theo id) một lần, giữ điểm cao nhất; xếp theo điểm giảm dần, cùng điểm
 * thì kết quả gặp trước (của câu gốc) đứng trước. Các trường khác (thời gian…) lấy theo câu gốc.
 */
export function gopKetQua(ds) {
	const theoId = new Map();
	for (const k of ds)
		for (const r of k?.results ?? []) {
			const cu = theoId.get(r.id);
			if (!cu) theoId.set(r.id, { r, thu: theoId.size });
			else if (r.score > cu.r.score) cu.r = r;
		}
	const results = [...theoId.values()].sort((a, b) => b.r.score - a.r.score || a.thu - b.thu).map((x) => x.r);
	return { ...(ds.find(Boolean) ?? {}), results, unfilteredResultCount: results.length };
}

/**
 * Bọc module gốc `goc` của Pagefind (chỉ mục ở thư mục `base`): giữ mọi hàm, thay options, search, debouncedSearch,
 * preload, destroy, createInstance.
 */
export function boc(goc, base) {
	// Bản gốc tự tìm thư mục chỉ mục theo tên file của nó (pagefind.js); đổi tên rồi thì phải báo thẳng thư mục. Trước khi
	// Pagefind khởi tạo, options() thay hết tùy chọn cũ (ô tìm kiếm gọi options({ excerptLength }) khi mở), nên lần nào
	// cũng kèm basePath.
	const options = (tuyChon = {}) => goc.options({ basePath: base, ...tuyChon });

	async function search(cau, tuyChon) {
		const ds = bienThe(cau);
		// Tìm có bộ lọc hay sắp xếp riêng: số đếm theo bộ lọc và thứ tự sắp xếp của nhiều lần tìm không gộp đúng được.
		// Site không dùng hai thứ này, nên khi có thì tìm như bản gốc (không thêm biến thể). Ô tìm kiếm luôn gửi filters: {}
		// rỗng: rỗng thì không tính.
		const co = (x) => x && Object.keys(x).length > 0;
		if (ds.length === 1 || co(tuyChon?.filters) || co(tuyChon?.sort)) return goc.search(cau, tuyChon);
		return gopKetQua(await Promise.all(ds.map((t) => goc.search(t, tuyChon))));
	}

	// Như bản gốc: chờ `cho` ms; có lần gọi mới hơn thì trả null, kể cả khi lần gọi mới đến lúc đang tìm.
	let lan = 0;
	async function debouncedSearch(cau, tuyChon, cho = 300) {
		const t = ++lan;
		await new Promise((ok) => setTimeout(ok, cho));
		if (t !== lan) return null;
		const kq = await search(cau, tuyChon);
		return t === lan ? kq : null;
	}

	const preload = (cau, tuyChon) => Promise.all(bienThe(cau).map((t) => goc.preload(t, tuyChon))).then(() => {});

	// destroy() của bản gốc bỏ hết tùy chọn: đặt lại basePath cho lần dùng sau
	async function destroy() {
		await goc.destroy();
		await options();
	}

	const createInstance = (tuyChon = {}) => goc.createInstance({ basePath: base, ...tuyChon });

	return { options, search, debouncedSearch, preload, destroy, createInstance };
}
