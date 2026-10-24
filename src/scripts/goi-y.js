// Ô gợi ý tập ở trang chủ (::cong-cu{ten="goi-y-tap"}), như khối "Hôm nay" của trang chủ cũ (plan.js, practice.js của
// ../opus-zero/docs/assets/js/): đọc chặng piano (store.pianoLevel) và kết quả phần nhạc lý (store.placement) đã lưu ở trang
// kiểm tra đầu vào, của site mới hay site cũ (cùng khóa opus-zero:v1), rồi gợi ý bài theo chặng. Chưa lưu gì thì giữ phần
// dựng sẵn lúc build (lời mời làm bài kiểm tra). Có gợi ý riêng thì đưa mục này lên trước mục các lối vào của trang chủ,
// như homeOrder() của trang chủ cũ. Dữ liệu (chặng, bài nên bắt đầu, link kèm cờ "có trong bản build") ở data-goi-y:
// goiYTap trong src/plugins/thanh-phan.mjs.
import { esc, lienKet } from './lien-ket.js';
import { layKho } from './tien-do.js';

/**
 * Phần gợi ý theo dữ liệu đã lưu (hàm thuần, để kiểm thử): HTML, hay null khi chưa lưu gì dùng được. Dữ liệu lưu trong
 * trình duyệt có thể cũ hay hỏng: chặng ngoài 1–7, bài nhạc lý không phải số, địa chỉ không phải bài nhạc lý của site
 * thì bỏ qua.
 */
export function dungGoiY(data, mucDo, xepLop) {
	const { chang, kiem_tra, nhac_ly, nang_cao, bai_nhac_ly } = data;
	const c = Number.isInteger(mucDo?.stage) ? chang.find((x) => x.id === mucDo.stage) : undefined;
	let nhacLy = '';
	if (xepLop?.start === 'done') nhacLy = `bạn đã nắm phần nền tảng; tiếp với ${lienKet(nang_cao.href, 'phần nâng cao', nang_cao.co)}.`;
	else if (Number.isInteger(xepLop?.start) && xepLop.start > 0) {
		const n = xepLop.start;
		// bài lưu ở site mới có tên và địa chỉ; site cũ chỉ lưu số bài: dẫn tới mục lục nhạc lý
		const href = typeof xepLop.href === 'string' && xepLop.href.startsWith(nhac_ly.href) && /^[a-z0-9-]+\/$/.test(xepLop.href.slice(nhac_ly.href.length)) ? xepLop.href : null;
		const ten = typeof xepLop.ten === 'string' && xepLop.ten.trim() ? `bài ${n}: ${esc(xepLop.ten.trim())}` : `bài ${n}`;
		nhacLy = href
			? `bắt đầu từ ${lienKet(href, ten, bai_nhac_ly.includes(href))}.`
			: `bắt đầu từ ${ten} (${lienKet(nhac_ly.href, 'các bài nhạc lý', nhac_ly.co)}).`;
	}
	if (!c && !nhacLy) return null;
	return (
		(c
			? `<p><strong>Chặng của bạn: ${lienKet(c.trang.href, `${c.id}. ${c.ten}`, c.trang.co)}</strong> (<span class="oz-khong-ngat">${c.grade}</span>).</p>` +
				(c.goi_y.length
					? `<p>Nên bắt đầu với:</p><ul class="oz-goi-y-bai">${c.goi_y.map((x) => `<li>${lienKet(x.href, x.ten, x.co)}</li>`).join('')}</ul>`
					: '')
			: `<p><strong>Chưa có chặng piano của bạn:</strong> đánh dấu những việc bạn làm được ở ${lienKet(kiem_tra.href, 'bài kiểm tra đầu vào', kiem_tra.co)}.</p>`) +
		(nhacLy ? `<p><strong>Nhạc lý:</strong> ${nhacLy}</p>` : '') +
		`<p class="oz-stats">Đã tiến bộ? Làm lại ${lienKet(kiem_tra.href, 'bài kiểm tra đầu vào', kiem_tra.co)} để cập nhật gợi ý.</p>`
	);
}

/** Tiêu đề mục (h2, hay khung bọc tiêu đề của Starlight) đứng ngay trước phần tử `el`. */
const tieuDeTruoc = (el) => {
	const t = el.previousElementSibling;
	return t && (t.matches('h2') || t.matches('.sl-heading-wrapper.level-h2')) ? t : null;
};

export function mount(root) {
	if (root.dataset.ready) return;
	root.dataset.ready = '1';
	const html = dungGoiY(JSON.parse(root.dataset.goiY), layKho('pianoLevel', null), layKho('placement', null));
	if (!html) return;
	root.innerHTML = html;
	root.classList.add('oz-goi-y--rieng');
	// Trang chủ: đưa mục này (tiêu đề và ô) lên trước mục các lối vào ("Bạn đang ở đâu?"), như homeOrder() cũ
	const tieuDe = tieuDeTruoc(root);
	const loiVao = document.querySelector('.oz-loi-vao');
	const tieuDeLoiVao = loiVao && tieuDeTruoc(loiVao);
	if (tieuDe && tieuDeLoiVao && root.compareDocumentPosition(tieuDeLoiVao) & Node.DOCUMENT_POSITION_PRECEDING) tieuDeLoiVao.before(tieuDe, root);
}
