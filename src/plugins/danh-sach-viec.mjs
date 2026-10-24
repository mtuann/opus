// Plugin hast cho Sätteri (D2-nền): danh sách việc "- [ ]" bấm được và có nhãn. GFM dựng <li class="task-list-item">
// với một ô đánh dấu bị khóa, không nhãn, 13 px (axe báo `label`, vùng bấm dưới 44 px). Plugin đặt ô vào một nhãn 44 px,
// đặt chữ của việc vào một khối có id để làm tên cho ô (aria-labelledby), và mở khóa ô. Script src/scripts/viec.js nhớ
// ô đã đánh dấu trong trình duyệt, như site cũ (practice.js). CSS: src/styles/thanh-phan.css.

const laPhanTu = (n, ten) => n?.type === 'element' && (!ten || n.tagName === ten);
const laO = (n) => laPhanTu(n, 'input') && n.properties?.type === 'checkbox';
const laDanhSach = (n) => laPhanTu(n, 'ul') || laPhanTu(n, 'ol');
const lop = (n) => {
	const c = n.properties?.className ?? n.properties?.class ?? [];
	return Array.isArray(c) ? c : String(c).split(/\s+/);
};
/** Con đầu tiên không phải khoảng trắng. */
const conDau = (n) => (n.children ?? []).find((c) => !(c.type === 'text' && !c.value.trim()));
/** Bỏ khoảng trắng đầu của chữ đứng ngay sau ô ("[ ] Việc" thành " Việc"). */
function boCachDau(ds) {
	const [dau, ...con] = ds;
	if (dau?.type === 'text') return [{ ...dau, value: dau.value.replace(/^\s+/, '') }, ...con].filter((c) => c.type !== 'text' || c.value);
	return ds;
}

export function danhSachViec() {
	return () => {
		let so = 0;
		return {
			name: 'opus-danh-sach-viec',
			element: {
				filter: ['li'],
				visit(node) {
					if (!lop(node).includes('task-list-item')) return;
					// mục gọn: <li><input> chữ…</li>; mục thưa (có dòng trống giữa các mục): <li><p><input> chữ…</p>…</li>
					const dau = conDau(node);
					const thua = laPhanTu(dau, 'p') && laO(conDau(dau));
					const o = thua ? conDau(dau) : dau;
					if (!laO(o)) return;
					const id = `oz-viec-${++so}`;
					const { disabled, ...thuocTinh } = o.properties;
					const nhan = {
						type: 'element',
						tagName: 'label',
						properties: { class: 'oz-viec-o' },
						children: [{ ...o, properties: { ...thuocTinh, class: 'oz-viec-hop', 'aria-labelledby': id } }],
					};
					const bo = (ds) => boCachDau(ds.filter((c) => c !== o));
					const con = thua ? [{ ...dau, children: bo(dau.children) }, ...node.children.filter((c) => c !== dau)] : bo(node.children);
					const chu = con.filter((c) => !laDanhSach(c));
					const { className, class: _, ...conLai } = node.properties;
					return {
						...node,
						properties: { ...conLai, class: [...lop(node).filter(Boolean), 'oz-viec'].join(' ') },
						children: [
							nhan,
							{ type: 'element', tagName: thua ? 'div' : 'span', properties: { class: 'oz-viec-chu', id }, children: chu },
							...con.filter(laDanhSach),
						],
					};
				},
			},
		};
	};
}
