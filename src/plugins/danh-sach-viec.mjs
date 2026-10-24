// Plugin hast cho Sätteri (D2-nền): danh sách việc "- [ ]" bấm được và có nhãn. GFM dựng <li class="task-list-item">
// với một ô đánh dấu bị khóa, không nhãn, 13 px (axe báo `label`, vùng bấm dưới 44 px). Plugin đặt ô vào một nhãn 44 px,
// đặt chữ của việc vào một khối có id để làm tên cho ô (aria-labelledby), và mở khóa ô. Script src/scripts/viec.js nhớ
// ô đã đánh dấu trong trình duyệt, như site cũ (practice.js). CSS: src/styles/thanh-phan.css.
// Mã của việc (data-viec, khóa lưu trong trình duyệt) tính lúc build, như site cũ tính trong trình duyệt: mã băm chữ của
// việc, trùng trong trang thì thêm "-2", "-3"… Chữ bỏ nhãn "sắp có" cùng dấu cách đứng trước nó (src/plugins/sap-co.mjs),
// để mã không đổi khi trang được link tới lên site, và trùng mã ở site cũ.

const laPhanTu = (n, ten) => n?.type === 'element' && (!ten || n.tagName === ten);
const laO = (n) => laPhanTu(n, 'input') && n.properties?.type === 'checkbox';
const laDanhSach = (n) => laPhanTu(n, 'ul') || laPhanTu(n, 'ol');
const lop = (n) => {
	const c = n.properties?.className ?? n.properties?.class ?? [];
	return Array.isArray(c) ? c : String(c).split(/\s+/);
};
/** Con đầu tiên không phải khoảng trắng. */
const conDau = (n) => (n.children ?? []).find((c) => !(c.type === 'text' && !c.value.trim()));
/** Mã băm chữ (djb2), như hash() của ../opus-zero/docs/assets/js/practice.js. */
export function bam(s) {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
	return (h >>> 0).toString(36);
}

/**
 * Chữ của việc như site cũ đọc (textContent của mục, bỏ ô và danh sách con, gộp khoảng trắng), nhưng bỏ nhãn "sắp có"
 * cùng dấu cách trước nó. HTML thô trong mục (hiếm) thì bỏ thẻ.
 */
export function chuViec(nodes) {
	let s = '';
	const di = (n) => {
		if (n.type === 'text') s += n.value;
		else if (n.type === 'raw') s += n.value.replace(/\s*<span class="oz-sap-co-nhan"[^>]*>[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '');
		else if (n.type === 'element' && !laO(n) && !laDanhSach(n)) {
			if (lop(n).includes('oz-sap-co-nhan')) s = s.replace(/\s+$/, '');
			else (n.children ?? []).forEach(di);
		}
	};
	nodes.forEach(di);
	return s.replace(/\s+/g, ' ').trim();
}

/** Bỏ khoảng trắng đầu của chữ đứng ngay sau ô ("[ ] Việc" thành " Việc"). */
function boCachDau(ds) {
	const [dau, ...con] = ds;
	if (dau?.type === 'text') return [{ ...dau, value: dau.value.replace(/^\s+/, '') }, ...con].filter((c) => c.type !== 'text' || c.value);
	return ds;
}

export function danhSachViec() {
	return () => {
		let so = 0;
		const daGap = {};
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
					const h = bam(chuViec(node.children));
					daGap[h] = (daGap[h] ?? 0) + 1;
					const ma = h + (daGap[h] > 1 ? `-${daGap[h]}` : '');
					const { disabled, ...thuocTinh } = o.properties;
					const nhan = {
						type: 'element',
						tagName: 'label',
						properties: { class: 'oz-viec-o' },
						children: [{ ...o, properties: { ...thuocTinh, class: 'oz-viec-hop', 'aria-labelledby': id, 'data-viec': ma } }],
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
