// Trạng thái "đã học" ở mục lục Nhạc lý (::cong-cu{ten="lesson-status"}), chuyển từ mountStatus của
// ../opus-zero/docs/assets/js/quiz.js: trong khối <div class="oz-lesson-status"> bọc mục lục, mỗi link tới một bài nhạc
// lý mà người học đã làm hết câu hỏi (store.lessons, src/scripts/quiz.js ghi; kể cả bài làm ở site cũ /opus-zero/) có dấu
// "đã học" cạnh nó; ô công cụ hiện số bài đã xong và thanh tiến độ. Bài chưa có trong bản build (chữ "sắp có", src/plugins/
// sap-co.mjs) vẫn được đếm theo địa chỉ đích (data-href).
import { layKho } from './tien-do.js';

/** Khóa bài theo đường dẫn, luôn có / ở cuối (lessonKey của quiz.js cũ). */
export const khoaBai = (p) => {
	const x = p.replace(/index\.html$/, '');
	return x.endsWith('/') ? x : x + '/';
};

/** Bài nhạc lý (không phải chính trang mục lục) theo khóa đường dẫn. */
export const laBaiNhacLy = (k) => k.includes('/nhac-ly/') && !/\/nhac-ly\/$/.test(k);

/** Ngày đã học của bài có khóa k (site mới /opus/…, hay site cũ /opus-zero/…), hay undefined. */
export const ngayHoc = (bai, k) => bai[k] ?? bai[k.replace(/^\/opus\//, '/opus-zero/')];

export function mount(goc) {
	if (goc.dataset.san) return;
	goc.dataset.san = '1';
	const vung = goc.closest('.oz-lesson-status') ?? goc.parentElement;
	const thanh = goc.querySelector('.oz-lesson-bar');
	const capNhat = () => {
		const bai = layKho('lessons', {});
		let tong = 0;
		let xong = 0;
		for (const el of vung.querySelectorAll('a[href], .oz-sap-co[data-href]')) {
			const k = khoaBai(new URL(el.getAttribute('href') ?? el.dataset.href, location.href).pathname);
			if (!laBaiNhacLy(k)) continue;
			tong++;
			el.parentNode.querySelector(':scope > .oz-done')?.remove();
			const ngay = ngayHoc(bai, k);
			if (!ngay) continue;
			xong++;
			const dau = document.createElement('span');
			dau.className = 'oz-done';
			dau.textContent = 'đã học';
			dau.title = 'Hoàn thành quiz ngày ' + ngay;
			el.after(dau);
		}
		const pt = tong ? Math.round((100 * xong) / tong) : 0;
		thanh.innerHTML =
			`Đã hoàn thành <strong>${xong}/${tong}</strong> bài. Một bài được tính là xong khi bạn làm hết quiz cuối bài.` +
			`<span class="oz-progress" role="progressbar" aria-label="Bài nhạc lý đã học" aria-valuemin="0" aria-valuemax="${tong}" aria-valuenow="${xong}"><span style="width:${pt}%"></span></span>`;
	};
	capNhat();
	// quay lại trang bằng nút Back (bfcache) sau khi làm quiz ở bài khác: đọc lại
	addEventListener('pageshow', (e) => e.persisted && capNhat());
}
