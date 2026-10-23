// Plugin hast cho Sätteri (D1.5): link tới một trang của site chưa có trong bản build (chưa chuyển; ở bản thật: chưa khóa)
// thành chữ thường kèm nhãn "sắp có".
// Khi trang lên site, link tự hiện lại: danh sách trang nằm trong dấu vết của dungLaiKhiDoi (src/du-lieu.mjs), nên bản
// build sau dựng lại mọi trang. Chỉ xét link tới trang (/opus/…/); link ngoài, #mục trong trang, file tĩnh giữ nguyên.
// Xét cả link trong HTML thô: HTML do chỉ thị dựng từ dữ liệu (::hoc-tiep, thong_tin của ::hop-tac-pham) và khối HTML
// viết trong trang, miễn thẻ <a> mở và đóng trong cùng một khối (AGENTS.md: link nội bộ viết bằng Markdown).
// Chữ "sắp có" giữ địa chỉ đích ở data-href: tests/link.test.mjs kiểm đích là trang trong kế hoạch mà bản build chưa có
// (bắt link gõ sai và trang bị bỏ sót khỏi trangTrongBan). Dấu cách thật trước nhãn, để chữ chép ra không dính liền.
import { laFile, trangCuaDiaChi } from '../ban-build.mjs';

const TITLE = 'Trang này sẽ lên site sau khi được kiểm tra lại';

/** @param {{ base: string, trangCo: () => string[] }} opts trangCo: danh sách trang trong bản build (trangTrongBan). */
export function sapCo({ base, trangCo }) {
	return () => {
		const trang = trangCo();
		const chuaCo = (href) => typeof href === 'string' && href.startsWith(base) && !laFile(href) && !trangCuaDiaChi(href, base, trang);
		return {
			name: 'opus-sap-co',
			element: {
				filter: ['a'],
				visit(node) {
					if (!chuaCo(node.properties?.href)) return;
					return {
						type: 'element',
						tagName: 'span',
						properties: { class: 'oz-sap-co', 'data-href': node.properties.href, title: TITLE },
						children: [
							...node.children,
							{ type: 'text', value: ' ' },
							{ type: 'element', tagName: 'span', properties: { class: 'oz-sap-co-nhan', 'data-pagefind-ignore': true }, children: [{ type: 'text', value: 'sắp có' }] },
						],
					};
				},
			},
			raw(node) {
				const moi = node.value.replace(/<a\s[^>]*?\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (the, href, chu) =>
					chuaCo(href.replaceAll('&amp;', '&'))
						? `<span class="oz-sap-co" data-href="${href}" title="${TITLE}">${chu} <span class="oz-sap-co-nhan" data-pagefind-ignore>sắp có</span></span>`
						: the,
				);
				if (moi !== node.value) return { type: 'raw', value: moi };
			},
		};
	};
}
