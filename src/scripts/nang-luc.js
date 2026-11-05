// Bảng năng lực từng kỹ năng (::cong-cu{ten="skills"}, phần .oz-skills của ../opus-zero/docs/assets/js/plan.js) và biểu đồ
// tiến bộ theo tuần (::cong-cu{ten="trends"}, phần .oz-trends của viz.js), D7-L2, trang Nhật ký. Chỉ đọc opus-zero:v1
// (store.skills, store.lessons, store.skillHist: src/scripts/tien-do.js), không ghi gì.
// - Bảng năng lực: các hàng của tinhKeHoach (src/scripts/ke-hoach.js, cùng bản cũ): kỹ năng, độ chính xác gần đây (ema), số lần,
//   lần cuối; kỹ năng mờ khi chưa học xong bài nhạc lý tương ứng. Link tới công cụ hiện "sắp có" khi trang ấy chưa có trong
//   bản build (như kế hoạch tập).
// - Biểu đồ tiến bộ: bieuDoTienBo của src/scripts/hinh-so-sanh.js, tên kỹ năng theo KY_NANG.
// Ô dựng sẵn lúc build cho người chưa lưu gì; vẽ lại khi tiến độ đổi (oz:progress) và khi quay lại trang bằng nút Back.
// Khác bản cũ: thanh độ chính xác có chữ phần trăm ngay cạnh (như cũ) và là phần tử trang trí (aria-hidden).
import { KY_NANG, lienKetTrang, tinhKeHoach, trangThaiTu } from './ke-hoach.js';
import { bieuDoTienBo } from './hinh-so-sanh.js';
import { homNay, layKho } from './tien-do.js';

/** HTML bảng năng lực (mountSkills cũ) từ kết quả của tinhKeHoach. */
export function dungBangNangLuc(kq, data) {
	return (
		'<div class="oz-nang-luc-cuon"><table class="oz-nang-luc-bang"><thead><tr><th>Kỹ năng</th><th>Độ chính xác gần đây</th><th>Số lần</th><th>Lần cuối</th></tr></thead><tbody>' +
		kq.rows
			.map((x) => {
				const pt = x.n ? Math.round(x.ema * 100) : null;
				return (
					`<tr${x.unlocked ? '' : ' class="oz-khoa"'}><td>${lienKetTrang(x.url, x.name, data)}${x.unlocked ? '' : ' <span class="oz-stats">(mở sau bài học tương ứng)</span>'}</td><td>` +
					(pt === null ? '<span class="oz-stats">–</span>' : `<span class="oz-thanh" aria-hidden="true"><span style="width:${pt}%"></span></span> ${pt}%`) +
					`</td><td>${x.n}</td><td>${x.n ? (x.days === 0 ? 'hôm nay' : `${x.days} ngày trước`) : '–'}</td></tr>`
				);
			})
			.join('') +
		'</tbody></table></div>'
	);
}

export const TEN_KY_NANG = Object.fromEntries(KY_NANG.map(([id, ten]) => [id, ten]));

/** Hai ô dựng sẵn lúc build: dữ liệu link (`data`: { goc, trang }) như kế hoạch tập. */
export const veNangLuc = (data) =>
	`<div class="oz-nang-luc oz-tool not-content" data-sinh data-pagefind-ignore data-lien-ket="${data ? String(JSON.stringify(data)).replace(/&/g, '&amp;').replace(/"/g, '&quot;') : ''}">` +
	dungBangNangLuc(tinhKeHoach({ today: '2000-01-01' }), data) +
	`</div>`;
export const veTienBo = () =>
	`<div class="oz-tien-bo oz-tool not-content" data-sinh data-pagefind-ignore>${bieuDoTienBo({}, '2000-01-01', TEN_KY_NANG)}</div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const nangLuc = goc.classList.contains('oz-nang-luc');
	const data = nangLuc ? JSON.parse(goc.dataset.lienKet) : null;
	const ve = () => {
		const hom = homNay();
		goc.innerHTML = nangLuc ? dungBangNangLuc(tinhKeHoach(trangThaiTu(layKho, hom)), data) : bieuDoTienBo(layKho('skillHist', {}), hom, TEN_KY_NANG);
	};
	ve();
	document.addEventListener('oz:progress', ve);
	addEventListener('pageshow', (e) => e.persisted && ve());
	goc.dataset.san = '1';
}
