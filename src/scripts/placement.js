// Bài kiểm tra đầu vào, phần nhạc lý (khối ```placement), chuyển từ ../opus-zero/docs/assets/js/placement.js: hỏi lần lượt
// từng câu, thứ tự lựa chọn trộn mỗi lần, thêm "Tôi chưa biết"; cuối bài có bảng kết quả theo bài và bài nên bắt đầu.
// Kết quả lưu như site cũ (store.placement: ngày, bài bắt đầu hay "done"), thêm tên và địa chỉ bài để trang chủ gợi ý.
// Dữ liệu (chữ đã dựng thành HTML lúc build, link kèm cờ "có trong bản build") ở data-placement: src/plugins/thanh-phan.mjs.
import { lienKet } from './lien-ket.js';
import { datKho, homNay } from './tien-do.js';

function tron(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** Chữ thuần của một đoạn HTML (tên bài, để lưu). */
const chuThuan = (html) => {
	const d = document.createElement('div');
	d.innerHTML = html;
	return d.textContent.trim();
};

/** Kết quả theo bài: mỗi bài đã nắm khi đúng mọi câu; bài nên bắt đầu là bài đầu tiên chưa nắm (hàm thuần, để kiểm thử). */
export function ketQua(bai, traLoi) {
	let i = 0;
	const theoBai = bai.map((b) => {
		const r = traLoi.slice(i, (i += b.cau.length));
		return { b, nam: r.length === b.cau.length && r.every(Boolean), dung: r.filter(Boolean).length, tong: b.cau.length };
	});
	return { theoBai, batDau: theoBai.find((x) => !x.nam)?.b ?? null };
}

export function mount(root) {
	if (root.dataset.ready) return;
	root.dataset.ready = '1';
	const { bai, nang_cao } = JSON.parse(root.dataset.placement);
	const cau = bai.flatMap((b) => b.cau.map((c) => ({ b, c })));
	const traLoi = [];
	root.innerHTML =
		'<p class="oz-stats oz-pl-dau" aria-live="polite"></p><progress class="oz-pl-tien" max="' + cau.length + '" value="0"></progress><div class="oz-pl-than"></div>';
	const dau = root.querySelector('.oz-pl-dau');
	const tien = root.querySelector('.oz-pl-tien');
	const than = root.querySelector('.oz-pl-than');
	let daBam = false; // chỉ đưa focus vào câu mới sau khi người học đã bấm (không cướp focus lúc mở trang)

	function hien() {
		const i = traLoi.length;
		if (i >= cau.length) return xong();
		const { b, c } = cau[i];
		dau.textContent = `Câu ${i + 1}/${cau.length} (kiến thức bài ${b.n})`;
		tien.value = i;
		tien.setAttribute('aria-label', `Đã làm ${i}/${cau.length} câu`);
		than.innerHTML = `<p class="oz-pl-cau" tabindex="-1"><strong>${c.q}</strong></p><div class="oz-row"></div>`;
		const hang = than.querySelector('.oz-row');
		for (const o of [...tron(c.opts.slice()), { t: 'Tôi chưa biết', ok: false }]) {
			const nut = document.createElement('button');
			nut.type = 'button';
			nut.className = 'oz-btn';
			nut.innerHTML = o.t;
			nut.addEventListener('click', () => {
				traLoi.push(o.ok);
				daBam = true;
				hien();
			});
			hang.append(nut);
		}
		if (daBam) than.querySelector('.oz-pl-cau').focus({ preventScroll: true });
	}

	function xong() {
		const { theoBai, batDau } = ketQua(bai, traLoi);
		dau.textContent = 'Kết quả';
		tien.value = cau.length;
		tien.setAttribute('aria-label', 'Đã làm hết');
		const goiY = batDau
			? `Gợi ý: bắt đầu từ ${lienKet(batDau.href, `<strong>bài ${batDau.n}: ${batDau.ten}</strong>`, batDau.co)}.` +
				(batDau.n > 1 ? ' Các bài trước đó bạn có thể đọc lướt và làm quiz cuối bài để đánh dấu đã học.' : ' Đây là điểm khởi đầu tốt cho người mới.')
			: `Bạn đã nắm chắc phần nền tảng. Hãy làm các bài ôn tập rồi chuyển sang ${lienKet(nang_cao.href, 'phần nâng cao', nang_cao.co)}.`;
		than.innerHTML =
			`<p class="oz-feedback ok" tabindex="-1">${goiY}</p>` +
			'<table><thead><tr><th scope="col">Bài</th><th scope="col">Kết quả</th></tr></thead><tbody>' +
			theoBai
				.map(({ b, nam, dung, tong }) => `<tr><td>${lienKet(b.href, `${b.n}. ${b.ten}`, b.co)}</td><td>${nam ? '<span class="oz-pl-nam">Đã nắm</span>' : `Cần học (${dung}/${tong})`}</td></tr>`)
				.join('') +
			'</tbody></table>';
		const lai = document.createElement('button');
		lai.type = 'button';
		lai.className = 'oz-btn';
		lai.textContent = 'Làm lại';
		lai.addEventListener('click', () => {
			traLoi.length = 0;
			hien();
		});
		than.append(lai);
		than.querySelector('.oz-feedback').focus({ preventScroll: true });
		datKho('placement', batDau ? { date: homNay(), start: batDau.n, ten: chuThuan(batDau.ten), href: batDau.href } : { date: homNay(), start: 'done' });
	}

	hien();
}
