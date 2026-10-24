// Link do JavaScript dựng (bài kiểm tra đầu vào, chặng piano, ô gợi ý tập): trang chưa có trong bản build hiện chữ kèm
// nhãn "sắp có", cùng HTML với link dựng lúc build (src/plugins/sap-co.mjs, lienKet trong src/plugins/thanh-phan.mjs).
// Bản build ghi sẵn, cho từng link, trang đích đã có chưa (cờ `co` trong dữ liệu của thành phần), nên không cần tải thêm gì.

const TITLE = 'Trang này sẽ lên site sau khi được kiểm tra lại';
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** `chu`: HTML đã thoát (dựng lúc build); `co`: trang đích có trong bản build. */
export function lienKet(href, chu, co = true) {
	return co
		? `<a href="${esc(href)}">${chu}</a>`
		: `<span class="oz-sap-co" data-href="${esc(href)}" title="${TITLE}">${chu} <span class="oz-sap-co-nhan" data-pagefind-ignore>sắp có</span></span>`;
}
