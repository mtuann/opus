// Giấy kẻ khuông in được (::cong-cu{ten="staffpaper"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/staffpaper.js: trang A4
// (210 × 297 mm, lề 15 mm, khe 2 mm), khuông đơn hay khuông kép piano (cặp khuông có vạch nối hai đầu), 8, 10 hay 12 khuông mỗi
// trang (khuông kép: một nửa số cặp). Nút "In giấy kẻ khuông" chỉ in tờ giấy (lớp oz-in-rieng trên <html>, CSS ở
// @media print của src/styles/thanh-phan.css), như bản cũ; in cả trang (Ctrl+P) thì tờ giấy in cùng bài, bỏ các nút.
// Khác bản cũ: tờ giấy dựng sẵn lúc build (khuông đơn, 10 khuông), nét theo màu chữ của site (in ra vẫn đen trên trắng).
import { inRieng } from './in.js';

const so = (x) => String(Math.round(x * 100) / 100);
export const SO_KHUONG = [8, 10, 12];

/** Các khuông của một trang (page cũ): [{ y (mm, dòng trên cùng), kep }]; vạch nối của khuông kép. Hàm thuần, để kiểm thử. */
export function cacKhuong(n, loai) {
	const tren = 18;
	const duoi = 285;
	const khe = 2;
	const kep = loai === 'grand';
	const soCum = kep ? Math.floor(n / 2) : n;
	const cao = kep ? 8 * khe + 10 : 4 * khe;
	const buoc = (duoi - tren - cao) / Math.max(1, soCum - 1);
	const ra = [];
	for (let s = 0; s < soCum; s++) {
		const y0 = tren + s * buoc;
		ra.push({ y0, dong: kep ? [y0, y0 + 4 * khe + 10] : [y0], cao });
	}
	return ra;
}

/** Tờ giấy kẻ khuông bằng SVG (viewBox theo mm). */
export function veTrang(n, loai) {
	const trai = 15;
	const phai = 195;
	let b = '';
	for (const c of cacKhuong(n, loai)) {
		for (const y of c.dong) for (let i = 0; i < 5; i++) b += `<path d="M${trai} ${so(y + i * 2)}H${phai}"/>`;
		if (loai === 'grand') b += `<path class="oz-giay-noi" d="M${trai} ${so(c.y0)}V${so(c.y0 + c.cao)}"/><path d="M${phai} ${so(c.y0)}V${so(c.y0 + c.cao)}"/>`;
	}
	const ten = `Giấy kẻ khuông A4: ${loai === 'grand' ? `${Math.floor(n / 2)} khuông kép piano` : `${n} khuông đơn`}`;
	return `<svg class="oz-giay-trang" viewBox="0 0 210 297" role="img" aria-label="${ten}"><g class="oz-giay-net">${b}</g></svg>`;
}

export const veGiayKhuong = () =>
	`<div class="oz-giay-khuong oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row oz-khong-in"><label>Loại <select data-k="loai"><option value="single">Khuông đơn</option><option value="grand">Khuông kép (piano)</option></select></label>` +
	`<label>Số khuông mỗi trang <select data-k="n">${SO_KHUONG.map((n) => `<option${n === 10 ? ' selected' : ''}>${n}</option>`).join('')}</select></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="in">In giấy kẻ khuông</button></div>` +
	`<div class="oz-giay oz-vung-in">${veTrang(10, 'single')}</div>` +
	`<noscript data-sinh><p>Đổi loại khuông và in riêng tờ giấy cần JavaScript; vẫn in được cả trang bằng lệnh in của trình duyệt.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	const giay = goc.querySelector('.oz-giay');
	const ve = () => (giay.innerHTML = veTrang(Number(chon('n').value), chon('loai').value));
	goc.addEventListener('change', ve);
	goc.querySelector('[data-act="in"]').addEventListener('click', () => inRieng(giay));
	// trình duyệt giữ lựa chọn cũ khi tải lại trang: vẽ theo lựa chọn ấy
	ve();
	goc.dataset.san = '1';
}
