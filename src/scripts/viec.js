// Danh sách việc "- [ ]" (D2-nền; ô và nhãn do src/plugins/danh-sach-viec.mjs dựng): ô đã đánh dấu được nhớ trong trình
// duyệt, cùng khóa và định dạng với site cũ (mountChecks trong ../opus-zero/docs/assets/js/practice.js): kho "checks",
// mỗi trang ("bat-dau/lo-trinh-choi/") một bảng mã việc -> ngày đánh dấu. Mã việc là mã băm chữ của việc, trùng thì thêm
// "-2", "-3"… như site cũ, nên việc đã đánh dấu ở site cũ vẫn hiện ở site mới.
import { datKho, ghiNgay, homNay, layKho } from './tien-do.js';

const BASE = import.meta.env.BASE_URL;

/** Trang tính từ gốc site, như site cũ: "/opus/bat-dau/lo-trinh-choi/" thành "bat-dau/lo-trinh-choi/". */
const trang = () => {
	const p = location.pathname.replace(/index\.html$/, '');
	return p.startsWith(BASE) ? p.slice(BASE.length) : p;
};

/** Mã băm chữ (djb2), như hash() của site cũ. */
function bam(s) {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
	return (h >>> 0).toString(36);
}

/** Chữ của việc như site cũ: bỏ danh sách con và ô; bỏ cả nhãn "sắp có", để mã không đổi khi trang được link tới lên site. */
function chuViec(li) {
	const c = li.cloneNode(true);
	c.querySelectorAll('ul, ol, .oz-viec-o, .oz-sap-co-nhan').forEach((x) => x.remove());
	return c.textContent.replace(/\s+/g, ' ').trim();
}

const daGap = {};

export function mount(li) {
	const o = li.querySelector(':scope > .oz-viec-o > input');
	if (!o || o.dataset.viec) return;
	const h = bam(chuViec(li));
	daGap[h] = (daGap[h] || 0) + 1;
	const ma = h + (daGap[h] > 1 ? '-' + daGap[h] : '');
	o.dataset.viec = ma;
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
}
