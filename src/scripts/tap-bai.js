// Nút "Tôi đang tập bài này" ở hộp tác phẩm của bài học (.oz-piece-actions trong ::hop-tac-pham, D6-L1), chuyển từ mountPiece
// của ../opus-zero/docs/assets/js/practice.js. Ghi store.repertoire ở opus-zero:v1 (src/scripts/tien-do.js), cùng khóa và
// định dạng với site cũ: khóa là đường dẫn trang trong site ("piano/tac-pham/minuet-sol/"), giá trị
// { name, since, n, last, status, doneOn, updated }, status là learning, done hay removed. Danh sách bài đang tập
// (bai-dang-tap.js), kế hoạch tập (ke-hoach.js) và nhật ký (nhat-ky.js: days[ngày].piano, mucNgay) đọc dữ liệu này.
// Bốn thao tác như bản cũ: đang tập, hôm nay đã tập (mỗi ngày một buổi, ghi days[hôm nay].piano), đã chơi được, bỏ khỏi
// bài đang tập. Bản build dựng sẵn trạng thái "chưa tập" với nút tắt (dungNutTapBai), để hộp không cao lên khi script chạy;
// script bật nút và vẽ theo dữ liệu đã lưu. Khác bản cũ: dòng nhắc nói kế hoạch tập ở trang Piano (site mới không có kế
// hoạch ở trang chủ); chữ lấy từ dữ liệu đã lưu được thoát.
import { truoc } from './bai-dang-tap.js';
import { esc } from './lien-ket.js';
import { datKho, ghiNgay, homNay, layKho } from './tien-do.js';

/** Dòng nhắc khi chưa tập (bản cũ: "Bài sẽ hiện trong kế hoạch hôm nay ở trang chủ."). */
export const NHAC = 'Bài sẽ hiện trong kế hoạch tập hôm nay ở trang Piano.';

/**
 * HTML các nút theo bản ghi `r` của store.repertoire (render cũ; r có thể không có). `tat`: nút tắt (bản dựng sẵn lúc build,
 * khi script chưa chạy).
 */
export function dungNutTapBai(r, today, { tat = false } = {}) {
	r = r && typeof r === 'object' ? r : undefined;
	const st = r ? r.status : '';
	const t = tat ? ' disabled' : '';
	let h;
	if (st === 'learning') {
		h =
			(r.last === today
				? '<button type="button" class="oz-btn" disabled>Đã ghi buổi tập hôm nay</button>'
				: `<button type="button" class="oz-btn oz-btn--primary" data-a="practiced"${t}>Hôm nay đã tập bài này</button>`) +
			`<button type="button" class="oz-btn" data-a="done"${t}>Đã chơi được trọn bài</button>` +
			`<button type="button" class="oz-btn oz-btn--quiet" data-a="remove"${t}>Bỏ khỏi bài đang tập</button>`;
	} else if (st === 'done') {
		h =
			'<span class="oz-stats">Bạn đã chơi được bài này' + (r.doneOn ? ' (' + esc(r.doneOn) + ')' : '') + '.</span>' +
			`<button type="button" class="oz-btn" data-a="learning"${t}>Tập lại</button>`;
	} else {
		h = `<button type="button" class="oz-btn oz-btn--primary" data-a="learning"${t}>Tôi đang tập bài này</button>` + `<span class="oz-stats">${NHAC}</span>`;
	}
	const n = Number(r?.n) || 0;
	const khi = n && st !== 'removed' ? truoc(r.last, today) : '';
	// ngày lần cuối hỏng hay thiếu: chỉ ghi số buổi (bản cũ ghi "lần cuối ." )
	if (n && st !== 'removed') h += '<span class="oz-stats">Đã tập ' + n + ' buổi' + (khi ? ', lần cuối ' + khi : '') + '.</span>';
	return h;
}

/**
 * Áp một thao tác lên kho repertoire (update cũ; hàm thuần, để kiểm thử): trả về { rep: kho mới, buoi: có ghi thêm một buổi
 * tập hôm nay không }. `ten`: tên bài (tiêu đề trang), `bayGio`: ISO của lúc bấm.
 */
export function apThaoTac(rep, key, a, { ten, today, bayGio }) {
	rep = rep && typeof rep === 'object' && !Array.isArray(rep) ? { ...rep } : {};
	const cu = rep[key] && typeof rep[key] === 'object' ? rep[key] : null;
	const r = cu ? { ...cu } : { name: ten, since: today, n: 0, last: '' };
	let buoi = false;
	r.name = ten;
	if (a === 'learning') {
		if (!r.since || r.status === 'removed') r.since = today;
		r.status = 'learning';
	} else if (a === 'done') {
		r.status = 'done';
		r.doneOn = today;
	} else if (a === 'practiced') {
		r.status = 'learning';
		if (r.last !== today) {
			r.n = (Number(r.n) || 0) + 1;
			r.last = today;
			buoi = true;
		}
	} else if (a === 'remove') r.status = 'removed';
	else return { rep, buoi: false };
	r.updated = bayGio;
	rep[key] = r;
	return { rep, buoi };
}

/** Đường dẫn trang trong site, như pageKey cũ: "/opus/piano/tac-pham/x/" với gốc "/opus/" thành "piano/tac-pham/x/". */
export function khoaTrang(pathname, goc) {
	let p = pathname.replace(/index\.html$/, '');
	if (p.startsWith(goc)) p = p.slice(goc.length);
	return p;
}

/** Tên bài: chữ của tiêu đề trang (H1), như title() cũ. */
function tenBai() {
	const h = document.querySelector('h1#_top') ?? document.querySelector('main h1');
	return (h ? h.textContent : document.title.split(' | ')[0]).replace(/\s+/g, ' ').trim();
}

export function mount(o) {
	if (o.dataset.san) return;
	const key = khoaTrang(location.pathname, o.dataset.goc || '/');
	const ve = () => {
		o.innerHTML = dungNutTapBai(layKho('repertoire', {})?.[key], homNay());
	};
	o.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-a]');
		if (!b || b.disabled) return;
		const a = b.dataset.a;
		const { rep, buoi } = apThaoTac(layKho('repertoire', {}), key, a, { ten: tenBai(), today: homNay(), bayGio: new Date().toISOString() });
		datKho('repertoire', rep); // báo oz:progress: hộp và các ô khác trên trang vẽ lại
		if (buoi) ghiNgay('piano', 1);
		ve();
		// nút vừa bấm đã thay bằng nút khác: giữ con trỏ bàn phím trong hộp
		(o.querySelector('button[data-a]:not([disabled])') ?? o.querySelector('button'))?.focus();
	});
	document.addEventListener('oz:progress', ve);
	addEventListener('pageshow', (e) => e.persisted && ve());
	ve();
	o.dataset.san = '1';
}
