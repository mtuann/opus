// Thẻ ghi nhớ có ôn tập ngắt quãng (hệ Leitner) ở trang Từ điển (::cong-cu{ten="flashcards"}), chuyển từ
// ../opus-zero/docs/assets/js/flashcards.js. Thẻ lấy từ các bảng có cột đầu "Thuật ngữ" trên cùng trang (dựng từ
// src/data/thuat-ngu.yml bằng ::tu-dien). Lưu như site cũ, ở khóa opus-zero:v1 (src/scripts/tien-do.js): store.cards
// theo thuật ngữ = { box, added, due } (ngày dạng 2026-10-28), và số thẻ đã ôn trong ngày (days[ngày].cards). Phím: cách
// (Space) lật thẻ, 1 chưa nhớ, 2 nhớ, khi ô công cụ đang được chọn.
import { datKho, ghiNgay, homNay, layKho } from './tien-do.js';

/** Số ngày chờ theo từng hộp. */
export const KHOANG = [0, 1, 3, 7, 16, 35];
/** Số thẻ mới mỗi ngày. */
export const MOI_NGAY = 10;

/** Ngày iso (2026-10-28) cộng n ngày. */
export function congNgay(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const x = new Date(y, m - 1, d + n);
	return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

/** Thẻ từ các bảng có cột đầu "Thuật ngữ" trong `pham_vi`: { id: chữ của ô đầu, truoc: HTML ô đầu, sau: HTML các cột còn lại }. */
export function docBo(phamVi) {
	const bo = [];
	for (const bang of phamVi.querySelectorAll('table')) {
		const th = [...bang.querySelectorAll('thead th')];
		if (!th.length || th[0].textContent.trim() !== 'Thuật ngữ') continue;
		const dau = th.map((h) => h.textContent.trim());
		for (const tr of bang.querySelectorAll('tbody tr')) {
			const td = [...tr.querySelectorAll('td')];
			if (!td.length) continue;
			bo.push({
				id: td[0].textContent.trim(),
				truoc: td[0].innerHTML,
				sau: td
					.slice(1)
					.map((c, i) => `<p><span class="oz-stats">${dau[i + 1]}:</span> ${c.innerHTML}</p>`)
					.join(''),
			});
		}
	}
	return bo;
}

/** Hàng ôn hôm nay: thẻ đến hạn, rồi thẻ mới (tối đa MOI_NGAY thẻ được thêm trong ngày); kèm số liệu cho dòng thống kê. */
export function hangOn(bo, kho, ngay) {
	const den = bo.filter((c) => kho[c.id] && kho[c.id].due <= ngay);
	const daThem = Object.keys(kho).filter((k) => kho[k].added === ngay).length;
	const moi = bo.filter((c) => !kho[c.id]).slice(0, Math.max(0, MOI_NGAY - daThem));
	const nho = Object.keys(kho).filter((k) => kho[k].box >= 3).length;
	return { hang: den.concat(moi), den: den.length, moi: moi.length, nho };
}

/** Chấm một thẻ (nhớ hay chưa) vào kho (sửa tại chỗ), như grade() của bản cũ. */
export function cham(kho, id, nho, ngay) {
	const s = kho[id] || { box: 0, added: ngay };
	s.box = nho ? Math.min(s.box + 1, KHOANG.length - 1) : 0;
	s.due = congNgay(ngay, nho ? KHOANG[s.box] : 0);
	kho[id] = s;
	return s;
}

const nut = (chu, chinh = false) => {
	const b = document.createElement('button');
	b.type = 'button';
	b.className = 'oz-btn' + (chinh ? ' oz-btn--primary' : '');
	b.textContent = chu;
	return b;
};

export function mount(goc) {
	if (goc.dataset.san) return;
	goc.dataset.san = '1';
	const bo = docBo(goc.closest('.sl-markdown-content') ?? document);
	const thongKe = goc.querySelector('.oz-tn-so');
	const truoc = goc.querySelector('.oz-tn-truoc');
	const sau = goc.querySelector('.oz-tn-sau');
	const hang = goc.querySelector('.oz-tn-nut');
	if (!bo.length) {
		thongKe.textContent = 'Không tìm thấy bảng thuật ngữ nào trên trang này.';
		return;
	}
	let doi = [];
	let dang = null;
	const kho = () => layKho('cards', {});
	function dung() {
		const k = hangOn(bo, kho(), homNay());
		doi = k.hang;
		thongKe.textContent = `Bộ thẻ: ${bo.length} thuật ngữ. Đã nhớ chắc: ${k.nho}. Cần ôn hôm nay: ${k.den}. Thẻ mới hôm nay: ${k.moi}.`;
	}
	function hien() {
		sau.hidden = true;
		hang.textContent = '';
		if (!doi.length) {
			dang = null;
			truoc.innerHTML = '<strong>Xong phần ôn hôm nay.</strong>';
			sau.hidden = false;
			sau.innerHTML = '<p>Quay lại vào ngày mai: thẻ nhớ tốt sẽ được hỏi thưa dần (1, 3, 7, 16, 35 ngày).</p>';
			const them = nut('Ôn thêm 10 thẻ ngẫu nhiên');
			them.addEventListener('click', () => {
				doi = bo
					.slice()
					.sort(() => Math.random() - 0.5)
					.slice(0, 10)
					.map((c) => ({ ...c, them: true }));
				hien();
			});
			hang.append(them);
			giuTieuDiem();
			return;
		}
		dang = doi[0];
		truoc.innerHTML = dang.truoc;
		sau.innerHTML = dang.sau;
		const lat = nut('Lật thẻ', true);
		lat.addEventListener('click', latThe);
		hang.append(lat);
		giuTieuDiem();
	}
	function latThe() {
		sau.hidden = false;
		hang.textContent = '';
		for (const [nho, chu] of [
			[false, 'Chưa nhớ'],
			[true, 'Nhớ'],
		]) {
			const b = nut(chu, nho);
			b.addEventListener('click', () => chamThe(nho));
			hang.append(b);
		}
		giuTieuDiem();
	}
	function chamThe(nho) {
		doi.shift();
		if (!dang.them) {
			const k = kho();
			cham(k, dang.id, nho, homNay());
			datKho('cards', k);
			if (!nho) doi.push(dang); // hỏi lại cuối buổi
		}
		ghiNgay('cards', 1);
		hien();
	}
	// nút vừa bấm bị thay thì tiêu điểm về ô công cụ (không sang nút mới: phím cách lúc ấy sẽ bấm nhầm "Chưa nhớ"), để
	// phím tắt vẫn chạy
	let coTieuDiem = false;
	goc.addEventListener('focusin', () => (coTieuDiem = true));
	goc.addEventListener('focusout', (e) => (coTieuDiem = goc.contains(e.relatedTarget) || !e.relatedTarget));
	function giuTieuDiem() {
		if (coTieuDiem && !goc.contains(document.activeElement)) goc.focus({ preventScroll: true });
	}
	goc.addEventListener('keydown', (e) => {
		if (e.target.matches('input, select, textarea')) return;
		if (e.code === 'Space' && dang && sau.hidden) {
			e.preventDefault();
			latThe();
		} else if (dang && !sau.hidden && (e.key === '1' || e.key === '2')) chamThe(e.key === '2');
	});
	goc.tabIndex = 0;
	dung();
	hien();
}
