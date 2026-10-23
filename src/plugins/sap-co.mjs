// Plugin hast cho Sätteri (D1.5): link tới một trang của site chưa có trong bản build thành chữ thường kèm nhãn "sắp có".
// Khi trang lên site, link tự hiện lại: danh sách trang nằm trong dấu vết của dungLaiKhiDoi (src/du-lieu.mjs), nên bản
// build sau dựng lại mọi trang. Chỉ xét link tới trang (/opus/…/); link ngoài, #mục trong trang, file tĩnh giữ nguyên.
import { trangCuaDiaChi } from '../ban-build.mjs';

/** @param {{ base: string, trangCo: () => string[] }} opts trangCo: danh sách trang trong bản build (trangTrongBan). */
export function sapCo({ base, trangCo }) {
	return () => {
		const trang = trangCo();
		return {
			name: 'opus-sap-co',
			element: {
				filter: ['a'],
				visit(node) {
					const href = node.properties?.href;
					if (typeof href !== 'string' || !href.startsWith(base) || /\.[a-z0-9]+(?:[?#]|$)/i.test(href)) return;
					if (trangCuaDiaChi(href, base, trang)) return;
					return {
						type: 'element',
						tagName: 'span',
						properties: { class: 'oz-sap-co', title: 'Trang này sẽ lên site sau khi được kiểm tra lại' },
						children: [
							...node.children,
							{ type: 'element', tagName: 'span', properties: { class: 'oz-sap-co-nhan', 'data-pagefind-ignore': true }, children: [{ type: 'text', value: 'sắp có' }] },
						],
					};
				},
			},
		};
	};
}
