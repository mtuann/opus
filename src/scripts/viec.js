// Danh sách việc "- [ ]" (D2-nền; ô, nhãn và mã việc data-viec do src/plugins/danh-sach-viec.mjs dựng lúc build): ô đã
// đánh dấu được nhớ trong trình duyệt, cùng khóa và định dạng với site cũ (mountChecks trong
// ../opus-zero/docs/assets/js/practice.js): kho "checks", mỗi trang ("bat-dau/lo-trinh-choi/") một bảng mã việc -> ngày
// đánh dấu. Mã việc tính như site cũ, nên việc đã đánh dấu ở site cũ vẫn hiện ở site mới.
import { datKho, ghiNgay, homNay, layKho } from './tien-do.js';

const BASE = import.meta.env.BASE_URL;

/** Trang tính từ gốc site, như site cũ: "/opus/bat-dau/lo-trinh-choi/" thành "bat-dau/lo-trinh-choi/". */
const trang = () => {
	const p = location.pathname.replace(/index\.html$/, '');
	return p.startsWith(BASE) ? p.slice(BASE.length) : p;
};

const daGan = new WeakSet();

export function mount(li) {
	const o = li.querySelector(':scope > .oz-viec-o > input');
	const ma = o?.dataset.viec;
	if (!ma || daGan.has(o)) return;
	daGan.add(o);
	const cuaTrang = (layKho('checks', {}) || {})[trang()] || {};
	if (ma in cuaTrang) o.checked = true;
	o.addEventListener('change', () => {
		const tatCa = layKho('checks', {}) || {};
		const m = tatCa[trang()] || {};
		if (o.checked) m[ma] = homNay();
		else delete m[ma];
		if (Object.keys(m).length) tatCa[trang()] = m;
		else delete tatCa[trang()];
		datKho('checks', tatCa);
		if (o.checked) ghiNgay('checks', 1);
		li.dispatchEvent(new CustomEvent('oz:check', { bubbles: true }));
	});
	// cho kiểm thử: ô đã nhận lưu
	li.dataset.san = '';
}
