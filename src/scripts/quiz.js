// Câu hỏi kiểm tra nhanh (khối ```quiz), chuyển từ ../opus-zero/docs/assets/js/quiz.js. Câu hỏi và lựa chọn đã dựng
// sẵn bằng HTML lúc build (src/plugins/thanh-phan.mjs); ở đây biến chúng thành nút bấm, trộn thứ tự lựa chọn, báo đúng
// sai, và ghi bài là "đã học" khi làm hết (cùng chỗ lưu với site cũ: store.lessons, theo đường dẫn trang).
import { ghiNgay, homNay, layKho, datKho } from './tien-do.js';

/** Khóa bài theo đường dẫn, luôn có / ở cuối (như site cũ). */
const khoaBai = (p) => (p.replace(/index\.html$/, '').endsWith('/') ? p.replace(/index\.html$/, '') : p + '/');

function tron(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function mount(root) {
	if (root.dataset.ready) return;
	root.dataset.ready = '1';
	const qs = JSON.parse(root.dataset.quiz);
	const khoa = khoaBai(location.pathname);
	root.textContent = '';
	const dau = document.createElement('p');
	dau.className = 'oz-quiz-head';
	root.append(dau);
	// Site cũ ở /opus-zero/ lưu bài đã học theo đường dẫn cũ: vẫn nhận ra (cùng tên miền nên dữ liệu còn đó)
	const khoaCu = khoa.replace(/^\/opus\//, '/opus-zero/');
	const capNhatDau = () => {
		const bai = layKho('lessons', {});
		const xong = bai[khoa] ?? bai[khoaCu];
		dau.innerHTML = `<strong>Kiểm tra nhanh</strong> <span class="oz-stats">${qs.length} câu${xong ? ', đã hoàn thành ngày ' + xong : ''}</span>`;
	};
	let daXong = 0;
	let dungNgay = 0;
	const ketQua = document.createElement('p');
	ketQua.className = 'oz-quiz-result';
	ketQua.setAttribute('aria-live', 'polite');

	qs.forEach((item, qi) => {
		const hop = document.createElement('fieldset');
		hop.className = 'oz-quiz-q';
		hop.innerHTML = `<legend><strong>${qi + 1}.</strong> ${item.q}</legend>`;
		const hang = document.createElement('div');
		hang.className = 'oz-row';
		const phanHoi = document.createElement('p');
		phanHoi.className = 'oz-feedback';
		phanHoi.setAttribute('aria-live', 'polite');
		let lanDau = true;
		let xong = false;
		tron(item.opts.slice()).forEach((o) => {
			const nut = document.createElement('button');
			nut.type = 'button';
			nut.className = 'oz-btn';
			nut.innerHTML = o.t;
			nut.addEventListener('click', () => {
				if (xong) return;
				if (o.ok) {
					xong = true;
					daXong++;
					if (lanDau) dungNgay++;
					nut.classList.add('is-correct');
					phanHoi.innerHTML = 'Đúng. ' + item.why;
					phanHoi.className = 'oz-feedback ok';
					hang.querySelectorAll('button').forEach((x) => (x.disabled = x !== nut));
					if (daXong === qs.length) hoanThanh();
				} else {
					lanDau = false;
					nut.classList.add('is-wrong');
					nut.disabled = true;
					phanHoi.textContent = 'Chưa đúng, thử lại.';
					phanHoi.className = 'oz-feedback bad';
				}
			});
			hang.append(nut);
		});
		hop.append(hang, phanHoi);
		root.append(hop);
	});
	root.append(ketQua);

	function hoanThanh() {
		ketQua.textContent =
			`Hoàn thành! Đúng ngay lần đầu ${dungNgay}/${qs.length} câu.` +
			(dungNgay === qs.length ? ' Bạn đã sẵn sàng cho bài tiếp theo.' : ' Nên đọc lại các phần còn sai trước khi sang bài mới.');
		const bai = layKho('lessons', {});
		if (!bai[khoa]) {
			bai[khoa] = homNay();
			datKho('lessons', bai);
		}
		ghiNgay('quizzes', 1);
		capNhatDau();
	}
	capNhatDau();
}
