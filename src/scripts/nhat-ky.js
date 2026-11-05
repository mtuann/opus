// Nhật ký luyện tập (::cong-cu{ten="journal"}, D7-L2), chuyển từ phần .oz-journal của ../opus-zero/docs/assets/js/journal.js:
// chuỗi ngày liên tiếp, bản đồ 16 tuần (mỗi ô một ngày, cột là tuần bắt đầu từ thứ Hai, màu đậm theo mức hoạt động 0–3 của
// mucNgay), dòng tóm tắt hôm nay, năm việc của hôm nay (ba việc tự đánh dấu khi đạt mốc ở công cụ: 10 nốt đọc đúng; 10 quãng,
// hợp âm hay gam nhận đúng; một quiz hay 10 thẻ), ghi chú của hôm nay (lưu sau 0,4 giây ngừng gõ), link tới trang Dữ liệu. Lưu
// ở opus-zero:v1 như site cũ (days[ngày].tasks, days[ngày].note: src/scripts/tien-do.js). Vẽ lại khi tiến độ đổi (oz:progress)
// và khi quay lại trang bằng nút Back.
// Khác bản cũ: mục "Hôm nay" là nhãn của công cụ, không phải tiêu đề h2 (không lọt vào cấu trúc tiêu đề của trang); ô dựng
// sẵn lúc build cho người chưa lưu gì; link Dữ liệu dựng lúc build ("sắp có" khi trang ấy chưa có trong bản build).
import { chuoiNgay, congNgay, datGhiChu, datViec, docTienDo, ghiTienDo, homNay, mucNgay, ngayCua } from './tien-do.js';

/** Việc của hôm nay (TASKS cũ). */
export const VIEC = [
	['dan', 'Tập đàn: khởi động, gam và bài đang tập (20–45 phút)'],
	['doc-not', 'Đọc nốt 5 phút (tự đánh dấu khi đọc đúng 10 nốt)'],
	['luyen-tai', 'Luyện tai 5 phút (tự đánh dấu khi nhận đúng 10 quãng hoặc hợp âm)'],
	['nhac-ly', 'Học hoặc ôn nhạc lý 10 phút (tự đánh dấu khi làm xong một quiz hoặc ôn 10 thẻ thuật ngữ)'],
	['nghe', 'Nghe chủ động một tác phẩm và ghi vài dòng'],
];
/** Hoạt động trong ngày và cách gọi (todayLine cũ). */
const HOAT_DONG = [
	['notes', 'nốt đọc đúng'],
	['intervals', 'quãng'],
	['chords', 'hợp âm'],
	['keysigs', 'hóa biểu'],
	['rhythms', 'tiết tấu gõ đúng'],
	['scales', 'gam nhận đúng'],
	['builds', 'gam/hợp âm tự xây'],
	['melodies', 'giai điệu thị tấu'],
	['styles', 'câu nhận diện'],
	['cards', 'thẻ thuật ngữ'],
	['quizzes', 'quiz bài học'],
	['minutes', 'phút máy đếm nhịp'],
	['piano', 'buổi tập bài'],
	['readings', 'bài thị tấu hai tay'],
	['checks', 'mục đã đánh dấu xong'],
];

/** Dòng tóm tắt một ngày (todayLine cũ). */
export function dongHomNay(d) {
	const ds = HOAT_DONG.filter(([k]) => d?.[k]).map(([k, t]) => `${d[k]} ${t}`);
	return ds.length ? `Hôm nay: ${ds.join(', ')}.` : 'Hôm nay chưa có hoạt động nào.';
}

/** Tự đánh dấu việc khi đạt mốc ở công cụ (refresh cũ); trả về true nếu có đổi. */
export function tuDanhDau(d) {
	const t = (d.tasks ??= {});
	let doi = false;
	const dat = (k, dk) => {
		if (dk && !t[k]) {
			t[k] = true;
			doi = true;
		}
	};
	dat('doc-not', (d.notes || 0) >= 10);
	dat('luyen-tai', (d.intervals || 0) + (d.chords || 0) + (d.scales || 0) >= 10);
	dat('nhac-ly', (d.quizzes || 0) >= 1 || (d.cards || 0) >= 10);
	return doi;
}

/** Chữ của chuỗi ngày (bản cũ). */
export const chuChuoi = (s) => (s === 0 ? 'Chưa có chuỗi ngày nào. Hôm nay là ngày đầu tiên.' : `Chuỗi ${s} ngày liên tiếp`);

/** Các ngày của bản đồ: 16 tuần tính tới hôm nay, bắt đầu từ thứ Hai của 15 tuần trước. [{ ngay, muc, hom_nay }]. */
export function cacNgay(days, hom) {
	const [y, m, d] = hom.split('-').map(Number);
	const thu = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // thứ Hai = 0
	const ra = [];
	for (let k = congNgay(hom, -thu - 7 * 15); k <= hom; k = congNgay(k, 1)) ra.push({ ngay: k, muc: mucNgay(days?.[k]), hom_nay: k === hom });
	return ra;
}
/** HTML các ô của bản đồ, kèm nhãn cho máy đọc màn hình. */
export function oBanDo(ngay) {
	const co = ngay.filter((x) => x.muc).length;
	const html = ngay
		.map((x) => `<span${x.muc || x.hom_nay ? ` class="${[x.muc ? `l${x.muc}` : '', x.hom_nay ? 'hom-nay' : ''].filter(Boolean).join(' ')}"` : ''} title="${x.ngay}${x.muc ? '' : ': chưa luyện tập'}"></span>`)
		.join('');
	return { html, nhan: `Đã luyện tập ${co} ngày trong 16 tuần gần nhất` };
}

/** Ô dựng sẵn lúc build (người chưa lưu gì); `lienKetDuLieu`: HTML của link tới trang Dữ liệu. */
export const veNhatKy = (lienKetDuLieu) =>
	`<div class="oz-nhat-ky oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<p class="oz-chuoi">${chuChuoi(0)}</p>` +
	`<div class="oz-ban-do" role="img" aria-label="Đã luyện tập 0 ngày trong 16 tuần gần nhất">${'<span></span>'.repeat(16 * 7)}</div>` +
	`<p class="oz-stats oz-nhat-ky-hom-nay">${dongHomNay({})}</p>` +
	`<p class="oz-tool-title">Hôm nay</p>` +
	`<div class="oz-viec-ngay">${VIEC.map(([k, t]) => `<label><input type="checkbox" data-viec="${k}"> ${t}</label>`).join('')}</div>` +
	`<label class="oz-nhat-ky-nhan" for="oz-nhat-ky-ghi-chu">Ghi chú hôm nay: học được gì, chỗ nào còn khó</label>` +
	`<textarea id="oz-nhat-ky-ghi-chu" class="oz-input" rows="3" placeholder="Ví dụ: đã thuộc các nốt trên dòng kẻ khóa Sol, còn nhầm Rê và Fa ở khe."></textarea>` +
	`<p class="oz-stats">Dữ liệu chỉ lưu trong trình duyệt này. Sao lưu, chuyển sang máy khác hoặc xóa: xem ${lienKetDuLieu}.</p>` +
	`<noscript data-sinh><p>Nhật ký luyện tập cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const q = (s) => goc.querySelector(s);
	const banDo = q('.oz-ban-do');
	const ghiChu = q('textarea');
	const ve = () => {
		const data = docTienDo();
		const hom = homNay();
		const d = ngayCua(data, hom);
		if (tuDanhDau(d)) ghiTienDo(data);
		for (const c of goc.querySelectorAll('[data-viec]')) c.checked = !!d.tasks?.[c.dataset.viec];
		if (document.activeElement !== ghiChu) ghiChu.value = d.note || '';
		q('.oz-chuoi').textContent = chuChuoi(chuoiNgay(data.days, hom));
		q('.oz-nhat-ky-hom-nay').textContent = dongHomNay(d);
		const { html, nhan } = oBanDo(cacNgay(data.days, hom));
		banDo.innerHTML = html;
		banDo.setAttribute('aria-label', nhan);
	};
	goc.addEventListener('change', (e) => e.target.dataset.viec && datViec(e.target.dataset.viec, e.target.checked));
	let hen = 0;
	ghiChu.addEventListener('input', () => {
		clearTimeout(hen);
		hen = setTimeout(() => {
			datGhiChu(ghiChu.value);
			ve();
		}, 400);
	});
	document.addEventListener('oz:progress', ve);
	addEventListener('pageshow', (e) => e.persisted && ve());
	ve();
	goc.dataset.san = '1';
}
