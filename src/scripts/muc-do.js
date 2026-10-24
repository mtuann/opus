// Chặng piano của bạn (khối oz-piano-level ở trang kiểm tra đầu vào), chuyển từ mountLevel của
// ../opus-zero/docs/assets/js/practice.js: mỗi danh sách "- [ ]" trong khối là một chặng; làm được hai phần ba số việc của
// một nhóm (hai trong ba) là xong chặng ấy, đếm liền từ nhóm đầu. Hiện chặng và bài nên bắt đầu; khi người học đánh dấu
// thì lưu chặng như site cũ (store.pianoLevel: stage, date, updated) để trang chủ gợi ý bài.
// Dữ liệu (tên chặng, Grade, bài nên bắt đầu, link kèm cờ "có trong bản build") ở data-chang: src/plugins/thanh-phan.mjs.
import { lienKet } from './lien-ket.js';
import { datKho, homNay, layKho } from './tien-do.js';

/** Chặng theo số ô đã đánh dấu của từng nhóm ([đã đánh dấu, tổng]), tối đa `toiDa` (hàm thuần, để kiểm thử). */
export function tinhChang(nhom, toiDa) {
	let s = 1;
	for (const [da, tong] of nhom) {
		if (tong && da >= Math.ceil((tong * 2) / 3)) s++;
		else break;
	}
	return Math.min(s, toiDa);
}

export async function mount(root) {
	if (root.dataset.ready) return;
	root.dataset.ready = '1';
	// nạp lúc dùng (viec.js đọc import.meta.env của Vite, nên không nạp được khi kiểm thử tinhChang bằng Node)
	const { mount: ganViec } = await import('./viec.js');
	const { chang, lo_trinh } = JSON.parse(root.dataset.chang);
	const khoi = root.closest('.oz-piano-level') ?? root.parentElement;
	const ds = [...khoi.querySelectorAll('ul')].filter((ul) => ul.querySelector(':scope > li.oz-viec'));
	// ô đã đánh dấu (lưu trong trình duyệt) phải hiện trước khi đếm
	khoi.querySelectorAll('li.oz-viec').forEach(ganViec);

	function hien(luu) {
		const s = tinhChang(
			ds.map((ul) => {
				const o = [...ul.querySelectorAll(':scope > li.oz-viec > .oz-viec-o > input')];
				return [o.filter((x) => x.checked).length, o.length];
			}),
			chang.length,
		);
		const c = chang[s - 1];
		const daLuu = layKho('pianoLevel', null);
		if (luu) datKho('pianoLevel', { stage: s, date: homNay(), updated: new Date().toISOString() });
		const coDanh = !!khoi.querySelector('li.oz-viec input:checked');
		root.innerHTML =
			(coDanh || luu || daLuu
				? `<p><strong>Chặng của bạn: ${lienKet(c.trang.href, `${c.id}. ${c.ten}`, c.trang.co)}</strong> (${c.grade}).</p>`
				: `<p>Chưa đánh dấu gì: nếu bạn mới bắt đầu, đó là <strong>${lienKet(c.trang.href, `chặng ${c.id}. ${c.ten}`, c.trang.co)}</strong>.</p>`) +
			(c.goi_y.length ? `<p class="oz-stats">Nên bắt đầu với: ${c.goi_y.map((x) => lienKet(x.href, x.ten, x.co)).join(', ')}.</p>` : '') +
			`<p class="oz-stats">Chi tiết từng chặng: ${lienKet(lo_trinh.href, 'lộ trình piano', lo_trinh.co)}.</p>` +
			(luu || daLuu ? '<p class="oz-stats">Đã lưu. Trang chủ sẽ gợi ý bài theo chặng này.</p>' : '');
	}
	khoi.addEventListener('oz:check', () => hien(true));
	hien(false);
}
