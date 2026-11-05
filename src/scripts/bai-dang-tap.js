// Bài đang tập (::cong-cu{ten="repertoire"}, thông số compact; ở mục lục Piano), chuyển từ mountRepertoire của
// ../opus-zero/docs/assets/js/practice.js: danh sách bài đang tập và bài đã chơi được, đọc store.repertoire ở opus-zero:v1
// (src/scripts/tien-do.js; site mới và site cũ cùng khóa, cùng định dạng: khóa là đường dẫn trang trong site như
// "piano/tac-pham/fur-elise/", giá trị { name, since, n, last, status, doneOn, updated }). Danh sách chỉ đọc, không có thao
// tác riêng (như bản cũ); các nút ghi vào store.repertoire nằm ở thẻ đầu bài học tác phẩm (.oz-piece, đợt 6).
// compact: chưa có bài nào thì ẩn cả ô (bản cũ: data-compact); không compact thì hiện lời nhắc. Khác bản cũ: chữ lấy từ dữ
// liệu đã lưu được thoát, khóa lạ thì không thành link, trang chưa có trong bản build hiện "sắp có".
import { esc } from './lien-ket.js';
import { lienKetTrang } from './ke-hoach.js';
import { homNay, layKho } from './tien-do.js';

/** "hôm nay", "hôm qua", "3 ngày trước" (ago cũ). */
export function truoc(iso, today) {
	// ngày lưu trong trình duyệt có thể hỏng: không phải YYYY-MM-DD thì không ghi "lần cuối …"
	if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso ?? '')) || !/^\d{4}-\d{2}-\d{2}$/.test(String(today ?? ''))) return '';
	const t = today.split('-').map(Number);
	const a = String(iso).split('-').map(Number);
	const d = Math.round((Date.UTC(t[0], t[1] - 1, t[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
	return d <= 0 ? 'hôm nay' : d === 1 ? 'hôm qua' : d + ' ngày trước';
}

/**
 * HTML của danh sách (render cũ), hay null khi `compact` mà chưa có bài nào (ô ẩn). `rep`: store.repertoire; `data`: goc,
 * trang (trang có trong bản build), muc_luc (link "bài học tác phẩm": href, co).
 */
export function dungBaiDangTap(rep, { compact, today, data }) {
	rep = rep && typeof rep === 'object' ? rep : {};
	const rows = Object.keys(rep)
		.filter((k) => rep[k] && typeof rep[k] === 'object')
		.map((k) => Object.assign({ key: k }, rep[k]))
		.filter((r) => r.status === 'learning' || r.status === 'done');
	const learning = rows.filter((r) => r.status === 'learning').sort((a, b) => ((a.last || '') < (b.last || '') ? -1 : 1));
	const done = rows.filter((r) => r.status === 'done').sort((a, b) => ((a.doneOn || '') < (b.doneOn || '') ? 1 : -1));
	if (compact && !rows.length) return null;
	const li = (r, them) => `<li>${lienKetTrang(r.key, esc(r.name || r.key), data)} <span class="oz-stats">${them}</span></li>`;
	let h = '<p class="oz-tool-title">Bài đang tập</p>';
	h += learning.length
		? '<ul class="oz-rep-list">' + learning.map((r) => li(r, r.last ? '· ' + (Number(r.n) || 0) + ' buổi · lần cuối ' + truoc(r.last, today) : '· mới thêm')).join('') + '</ul>'
		: `<p class="oz-stats">Chưa có bài nào. Mở một ${lienKetTrang(data.muc_luc, 'bài học tác phẩm', data)} và bấm "Tôi đang tập bài này".</p>`;
	if (done.length) h += '<p class="oz-tool-title">Đã chơi được</p><ul class="oz-rep-list">' + done.map((r) => li(r, r.doneOn ? '· ' + esc(r.doneOn) : '')).join('') + '</ul>';
	return h;
}

export function mount(goc) {
	if (goc.dataset.san) return;
	const data = JSON.parse(goc.dataset.baiDangTap);
	const compact = goc.hasAttribute('data-compact');
	const ve = () => {
		const html = dungBaiDangTap(layKho('repertoire', {}), { compact, today: homNay(), data });
		goc.hidden = html === null;
		if (html !== null) goc.innerHTML = html;
	};
	ve();
	document.addEventListener('oz:progress', ve);
	addEventListener('pageshow', (e) => e.persisted && ve());
	goc.dataset.san = '1';
}
