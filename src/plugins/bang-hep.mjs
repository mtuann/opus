// Plugin hast cho Sätteri (D2-nền): bảng nhiều cột không bị ép ở màn hình hẹp. Cách chia cột tự động của trình duyệt
// thu mọi cột cho vừa khung 360 px, nên cột nhiều chữ chỉ còn khoảng 90 px và bảng cao vọt (bảng 4 cột của Für Elise:
// 2947 px; site cũ 1677 px). Plugin đặt cho ô tiêu đề của mỗi cột một độ rộng tối thiểu theo ô dài chữ nhất của cột
// (--oz-cot, CSS ở src/styles/thanh-phan.css): cột nhiều chữ đủ rộng, bảng rộng hơn khung thì cuộn ngang trong khung
// (Starlight), trang không tràn. Màn hình rộng thì đủ chỗ, độ rộng tối thiểu không đổi gì.
// Đo ở Für Elise, 360 px: 0,1125rem mỗi chữ (khoảng 1,8 px), tối đa 18rem: bảng 4 cột còn 1127 px, bảng 3 cột từ 2578
// còn 1626 px.

const REM_MOI_CHU = 0.1125;
const TOI_DA = 18;
/** Cột ngắn hơn chừng này (rem) thì để trình duyệt tự chia. */
const TOI_THIEU = 4;

const laPhanTu = (n, ...ten) => n?.type === 'element' && ten.includes(n.tagName);
const chuCua = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(chuCua).join(''));
/** Các hàng của bảng (trong thead, tbody, tfoot hay nằm thẳng trong table). */
const hang = (bang) => (bang.children ?? []).flatMap((c) => (laPhanTu(c, 'tr') ? [c] : laPhanTu(c, 'thead', 'tbody', 'tfoot') ? c.children.filter((r) => laPhanTu(r, 'tr')) : []));
const o = (tr) => tr.children.filter((c) => laPhanTu(c, 'th', 'td'));

export function bangHep() {
	return () => ({
		name: 'opus-bang-hep',
		element: {
			filter: ['table'],
			visit(node) {
				const ds = hang(node);
				if (!ds.length) return;
				const dai = [];
				for (const tr of ds) o(tr).forEach((c, i) => (dai[i] = Math.max(dai[i] ?? 0, chuCua(c).replace(/\s+/g, ' ').trim().length)));
				const dau = ds[0];
				let doi = false;
				const conMoi = dau.children.map((c) => {
					if (!laPhanTu(c, 'th', 'td')) return c;
					const i = o(dau).indexOf(c);
					const rong = Math.min(TOI_DA, Math.round(dai[i] * REM_MOI_CHU * 10) / 10);
					if (rong < TOI_THIEU) return c;
					doi = true;
					const style = [c.properties?.style, `--oz-cot: ${rong}rem`].filter(Boolean).join('; ');
					return { ...c, properties: { ...c.properties, style } };
				});
				if (!doi) return;
				// thay hàng đầu trong cây của bảng
				const thay = (n) => (n === dau ? { ...dau, children: conMoi } : n.children ? { ...n, children: n.children.map(thay) } : n);
				return thay(node);
			},
		},
	});
}
