// Luyện đọc hóa biểu (::cong-cu{ten="keysig-quiz"}), chuyển từ mountQuiz của ../opus-zero/docs/assets/js/circle.js: hiện
// một hóa biểu, người học chọn giọng trưởng hay giọng thứ của nó; sai thì có mẹo, đúng thì sang câu khác. Chọn được loại
// câu hỏi, phạm vi (đến 4 dấu hóa hay cả 15 giọng), khóa Sol hay khóa Fa. Lưu như site cũ: kỹ năng "keysig"
// (store.skills, chỉ tính lần trả lời đầu của mỗi câu) và số hóa biểu đã đọc đúng trong ngày (days[ngày].keysigs).
// Phần điều khiển dựng sẵn lúc build (src/plugins/thanh-phan.mjs); hóa biểu vẽ bằng SVG của site (src/scripts/ve.js).
import { GIONG, chuHoaBieu, tenChuCua, tenVietCua } from './nhac-ly.js';
import { ghiNgay, kyNang } from './tien-do.js';
import { canKyHieu, veHoaBieu } from './ve.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Mẹo khi trả lời sai, theo hóa biểu (n dấu: dương là dấu thăng, âm là dấu giáng) và loại câu hỏi, như mục "Đọc hóa biểu
 * ra tên giọng" của bài 8: tìm giọng trưởng trước; câu hỏi về giọng thứ thì nhắc thêm giọng thứ song song thấp hơn 3 nửa cung
 * (circle.js cũ chỉ có câu cho giọng trưởng, hiện cả khi hỏi giọng thứ, nên dễ dẫn sai: lượt 1, hồ sơ bài 8, n45 và n46).
 */
export function meo(n, loai = 'truong') {
	const truong =
		n > 0
			? 'dấu thăng cuối cùng, đi lên nửa cung, là chủ âm của giọng trưởng'
			: n < 0
				? 'dấu giáng áp chót là tên giọng trưởng (riêng 1 dấu giáng là Fa trưởng)'
				: 'không có dấu hóa nào là Đô trưởng';
	return `Chưa đúng. Mẹo: ${truong}.` + (loai === 'thu' ? ' Giọng thứ song song thấp hơn chủ âm giọng trưởng 3 nửa cung.' : '');
}

/** Các giọng được hỏi: hóa biểu có tối đa `toiDa` dấu hóa. */
export const giongDuocHoi = (toiDa) => GIONG.filter((k) => Math.abs(k.n) <= toiDa);

/** Câu hỏi theo loại (giọng trưởng hay giọng thứ). */
export const CAU_HOI = { truong: 'Hóa biểu này là của giọng trưởng nào?', thu: 'Hóa biểu này là của giọng thứ nào?' };

/**
 * Các nút trả lời (mỗi giọng được hỏi một nút: "Sol trưởng G", "Mi thứ E"), theo thứ tự của bảng 15 giọng. Dùng cả lúc build
 * (dựng sẵn cho câu hỏi mặc định: giọng trưởng, cả 15 giọng, nên khi script chạy, ô không đổi chiều cao) và trong trình duyệt.
 */
export const nutTraLoi = (loai, toiDa) =>
	giongDuocHoi(toiDa)
		.map((p) => {
			const ten = loai === 'truong' ? p.chu_am : p.thu;
			return `<button type="button" class="oz-btn" data-giong="${p.chu_am}">${esc(tenVietCua(ten))} ${loai === 'truong' ? 'trưởng' : 'thứ'} <small>${esc(tenChuCua(ten))}</small></button>`;
		})
		.join('');

export function mount(goc) {
	if (goc.dataset.san) return;
	canKyHieu();
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	const hinh = goc.querySelector('.oz-lhb-hinh');
	const hoi = goc.querySelector('.oz-lhb-hoi');
	const traLoi = goc.querySelector('.oz-lhb-chon');
	const phanHoi = goc.querySelector('.oz-feedback');
	const so = goc.querySelector('.oz-lhb-so');
	const phien = { dung: 0, tong: 0 };
	let cau = null;
	let truoc = null;

	function tiep() {
		const ds = giongDuocHoi(Number(chon('pham-vi').value));
		let k;
		do k = ds[Math.floor(Math.random() * ds.length)];
		while (ds.length > 1 && k === truoc);
		truoc = k;
		const loai = chon('loai').value === 'ca-hai' ? (Math.random() < 0.5 ? 'truong' : 'thu') : chon('loai').value;
		cau = { k, loai, xong: false, lanDau: true };
		const khoa = chon('khoa').value;
		hinh.innerHTML = veHoaBieu(k.n, { khoa, nhan: `Hóa biểu ${khoa === 'fa' ? 'khóa Fa' : 'khóa Sol'}, ${chuHoaBieu(k.n)}` });
		hoi.textContent = CAU_HOI[loai];
		traLoi.innerHTML = nutTraLoi(loai, Number(chon('pham-vi').value));
		phanHoi.textContent = '';
		phanHoi.className = 'oz-feedback';
	}
	traLoi.addEventListener('click', (e) => {
		const b = e.target.closest?.('button[data-giong]');
		if (!b || !cau || cau.xong) return;
		if (b.dataset.giong === cau.k.chu_am) {
			cau.xong = true;
			if (cau.lanDau) {
				phien.tong++;
				phien.dung++;
				kyNang('keysig', true);
			}
			b.classList.add('is-correct');
			ghiNgay('keysigs', 1);
			phanHoi.textContent = `Đúng. ${chuHoaBieu(cau.k.n)[0].toUpperCase()}${chuHoaBieu(cau.k.n).slice(1)}. Giọng trưởng ${tenChuCua(cau.k.chu_am)}, giọng thứ song song ${tenChuCua(cau.k.thu)}.`;
			phanHoi.className = 'oz-feedback ok';
			setTimeout(tiep, 1400);
		} else {
			if (cau.lanDau) {
				phien.tong++;
				cau.lanDau = false;
				kyNang('keysig', false);
			}
			b.classList.add('is-wrong');
			b.disabled = true;
			phanHoi.textContent = meo(cau.k.n, cau.loai);
			phanHoi.className = 'oz-feedback bad';
		}
		so.textContent = `Lượt này: đúng ngay lần đầu ${phien.dung}/${phien.tong}.`;
	});
	chon('tiep').addEventListener('click', tiep);
	for (const k of ['loai', 'pham-vi', 'khoa']) chon(k).addEventListener('change', tiep);
	tiep();
	goc.dataset.san = '1';
}
