// Bàn phím piano (::cong-cu{ten="piano" range="C3-C5" notes="C3 C4 C5"}), chuyển từ mountSimple của
// ../opus-zero/docs/assets/js/piano.js. Hình bàn phím đã dựng sẵn lúc build (veBanPhim trong src/scripts/ve.js), nên hiện
// ngay, không xô bố cục; ở đây thêm phần bấm được: bấm phím thì phát tiếng (src/scripts/am-thanh.js) và đọc tên nốt; bàn
// phím máy tính: Tab vào bàn phím đàn, mũi tên chọn phím, Enter hay Space để bấm; nút nghe các nốt được tô.
// Trên màn hình cảm ứng, phím phát tiếng khi chạm (click), không phải khi vừa đặt ngón: vuốt để cuộn trang hay cuộn ngang
// bàn phím không làm phím kêu. Chuột và bút thì phát ngay khi nhấn. Mỗi lần bấm chỉ tải mẫu âm của nốt ấy (am-thanh.js).
// Không có âm thanh (trình duyệt không tạo được AudioContext) thì phím vẫn nháy và vẫn đọc tên nốt.
import { chuanBi, choiNot, layNgCanh } from './am-thanh.js';

/**
 * Thêm phần bấm được cho một hình bàn phím (svg.oz-phim do veBanPhim dựng). `thongBao`: chỗ đọc tên nốt vừa bấm (vùng
 * aria-live); `khiBam(m)`: gọi sau mỗi lần bấm. Trả về { nhay(m): nháy phím m như vừa bấm }. Dùng lại được cho công cụ
 * khác cần bàn phím (bàn phím ở trang Luyện tập, nghe chép…).
 */
export function ganBanPhim(svg, { thongBao, khiBam } = {}) {
	const phim = [...svg.querySelectorAll('[data-m]')].sort((a, b) => a.dataset.m - b.dataset.m);
	svg.setAttribute('role', 'group');
	svg.setAttribute('aria-label', `${svg.getAttribute('aria-label')}. Dùng phím mũi tên để chọn phím, Enter để nghe.`);
	const dau = phim.find((k) => k.classList.contains('to')) ?? phim[0];
	for (const k of phim) {
		k.setAttribute('role', 'button');
		k.setAttribute('tabindex', k === dau ? '0' : '-1');
		k.setAttribute('aria-label', k.dataset.ten + (k.classList.contains('to') ? ', được tô' : ''));
	}
	const nhay = (m) => {
		const k = phim.find((x) => Number(x.dataset.m) === m);
		if (!k) return;
		k.classList.add('bam');
		setTimeout(() => k.classList.remove('bam'), 260);
	};
	const bam = (k) => {
		const m = Number(k.dataset.m);
		// chỉ tải mẫu của nốt này (lần đầu có thể còn là âm tổng hợp); không tải cả khoảng phím: bàn phím 88 phím sẽ giải mã
		// đủ 30 mẫu ngay lần chạm đầu
		choiNot(m, undefined, 1.2);
		nhay(m);
		if (thongBao) thongBao.textContent = k.dataset.ten;
		khiBam?.(m);
	};
	const phimCua = (e) => e.target.closest?.('[data-m]');
	// chuột, bút: phát ngay khi nhấn; click ngay sau đó (cùng phím) bỏ qua
	let vuaNhan = null;
	svg.addEventListener('pointerdown', (e) => {
		const k = phimCua(e);
		if (!k || e.pointerType === 'touch' || e.button > 0) return;
		vuaNhan = k;
		bam(k);
	});
	svg.addEventListener('click', (e) => {
		const k = phimCua(e);
		const daBam = vuaNhan === k;
		vuaNhan = null;
		if (k && !daBam) bam(k);
	});
	svg.addEventListener('keydown', (e) => {
		const k = phimCua(e);
		// phím bổ trợ (Alt hay Cmd + mũi tên: lùi, tiến trang; Ctrl…) là việc của trình duyệt
		if (!k || e.altKey || e.ctrlKey || e.metaKey) return;
		const i = phim.indexOf(k);
		const j = { ArrowRight: i + 1, ArrowUp: i + 1, ArrowLeft: i - 1, ArrowDown: i - 1, Home: 0, End: phim.length - 1 }[e.key];
		if (j !== undefined) {
			e.preventDefault();
			const moi = phim[Math.max(0, Math.min(phim.length - 1, j))];
			k.setAttribute('tabindex', '-1');
			moi.setAttribute('tabindex', '0');
			moi.focus();
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			// giữ phím thì trình duyệt lặp keydown: chỉ lần nhấn đầu phát tiếng
			if (!e.repeat) bam(k);
		}
	});
	return { nhay };
}

/** Cuộn khung bàn phím (khi bàn phím rộng hơn khung) cho các phím được tô nằm trong tầm nhìn: vừa thì ở giữa, không vừa thì từ phím đầu. */
function cuonToiPhimTo(khung, svg) {
	if (khung.scrollWidth <= khung.clientWidth + 1) return;
	const to = [...svg.querySelectorAll('.to')].map((k) => k.getBoundingClientRect());
	if (!to.length) return;
	const goc = khung.getBoundingClientRect().left - khung.scrollLeft;
	const trai = Math.min(...to.map((r) => r.left)) - goc;
	const phai = Math.max(...to.map((r) => r.right)) - goc;
	khung.scrollLeft = phai - trai <= khung.clientWidth ? (trai + phai - khung.clientWidth) / 2 : trai - 8;
}

export function mount(goc) {
	if (goc.dataset.san) return;
	const svg = goc.querySelector('svg.oz-phim');
	if (!svg) return;
	const { nhay } = ganBanPhim(svg, { thongBao: goc.querySelector('.oz-phim-ten') });
	const khung = goc.querySelector('.oz-phim-cuon');
	const nhac = goc.querySelector('.oz-phim-ten');
	if (khung) {
		cuonToiPhimTo(khung, svg);
		// bàn phím rộng hơn khung (điện thoại): nhắc kéo ngang, tới khi người học bấm phím đầu tiên
		if (nhac && khung.scrollWidth > khung.clientWidth + 1) nhac.textContent += ' Kéo ngang để xem thêm phím.';
	}
	const nut = goc.querySelector('[data-k="nghe"]');
	// Trong lúc chờ mẫu âm (tới 2 giây), nút không bị khóa (khóa thì tiêu điểm rơi về body): aria-busy, và bấm thêm thì bỏ qua
	let dangChay = false;
	nut?.addEventListener('click', async () => {
		if (dangChay) return;
		dangChay = true;
		nut.setAttribute('aria-busy', 'true');
		const c = layNgCanh();
		const nots = [...svg.querySelectorAll('.to')].map((k) => Number(k.dataset.m)).sort((a, b) => a - b);
		const hopAm = goc.dataset.choi === 'hop-am';
		try {
			if (c) await chuanBi(nots); // tiếng piano ngay lần đầu, nếu mẫu âm tải kịp (tối đa 2 giây)
		} finally {
			nut.removeAttribute('aria-busy');
			dangChay = false;
		}
		const t = c?.currentTime ?? 0;
		nots.forEach((m, i) => {
			const luc = hopAm ? 0 : i * 0.35;
			if (c) choiNot(m, t + luc, hopAm ? 1.8 : 0.6, hopAm ? 0.14 : 0.22);
			setTimeout(() => nhay(m), luc * 1000);
		});
	});
	goc.dataset.san = '1';
}
