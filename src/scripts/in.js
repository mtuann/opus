// In riêng một phần của trang (D7-L2: giấy kẻ khuông, phiếu bài tập), như lớp oz-printing / oz-print-now của site cũ: thêm
// lớp oz-in-rieng vào <html> và oz-in-day vào phần cần in, gọi lệnh in của trình duyệt, in xong (afterprint) thì gỡ. CSS ở
// @media print của src/styles/thanh-phan.css: mọi thứ không chứa phần ấy thì không in. In cả trang (Ctrl+P) không qua đây.

/** In riêng phần tử `el` (gọi trong lúc người dùng bấm nút). */
export function inRieng(el) {
	const html = document.documentElement;
	const go = () => {
		html.classList.remove('oz-in-rieng');
		el.classList.remove('oz-in-day');
	};
	html.classList.add('oz-in-rieng');
	el.classList.add('oz-in-day');
	addEventListener('afterprint', go, { once: true });
	try {
		window.print();
	} catch {
		go();
	}
}
