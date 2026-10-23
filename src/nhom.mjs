// Nhóm nội dung của site (menu mới, plans/lam-lai/so-do.md mục 5): tên, màu, biểu tượng, một dòng mô tả.
// Màu theo nhóm giúp người đọc nhìn là biết mình đang ở mục nào: nhãn trên tiêu đề trang (src/components/PageTitle.astro),
// thẻ ở trang chủ. Mã màu khai ở src/styles/opus.css (--oz-c-<id>), có bản sáng và tối.
// Trang thuộc nhóm nào: theo đường dẫn và tầng của trang, như luật nhom_menu() của plans/lam-lai/anh_xa.py; với 233 trang
// cũ thì kết quả giống hệt (bảng: plans/lam-lai/anh-xa.md; tests/giao-dien.test.mjs so đủ). Với trang mới thì khác hai
// chỗ: trang dưới piano/lo-trinh/ (các trang chặng của đợt 2) vào Lộ trình, nhom_menu() cho vào Piano; trang ngoài mọi
// mục đã biết không có nhãn, nhom_menu() cho vào Nhạc cổ điển. Nhóm thứ chín của menu, "Thêm", không có nhãn.

/** Biểu tượng nét (24×24, stroke = currentColor), dùng chung cho nhãn và thẻ. */
const BIEU_TUONG = {
	'bat-dau': '<path d="M5 21V4h10l-1.5 3L15 10H5"/>',
	'lo-trinh': '<circle cx="5" cy="18" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="19" cy="5" r="2"/><path d="M6.5 16.5 10.5 10.5M13.6 7.8l3.8-1.8"/>',
	'nhac-ly': '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
	piano: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v8M12 5v14M16 5v8M8 13v6M16 13v6"/>',
	'co-dien': '<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-6 10 6z"/>',
	'tac-pham': '<path d="M6 3h9l4 4v14H6z"/><path d="M9 10h7M9 13h7M9 16h7"/>',
	'luyen-tap': '<path d="M8 21h8l-2.5-17h-3z"/><path d="M12 15l5-9"/>',
	'doc-them': '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
};

/** Các nhóm, theo thứ tự của menu. */
export const NHOM = [
	{ id: 'bat-dau', ten: 'Bắt đầu', mo_ta: 'Bài 0, kiểm tra đầu vào, mỗi ngày tập gì' },
	{ id: 'lo-trinh', ten: 'Lộ trình 7 chặng', mo_ta: 'Từ con số 0 đến sau Grade 8' },
	{ id: 'nhac-ly', ten: 'Nhạc lý và luyện tai', mo_ta: 'Nốt, quãng, hợp âm, nghe ra hòa âm' },
	{ id: 'piano', ten: 'Piano', mo_ta: 'Tư thế, kỹ thuật, cách tập, hòa âm bên phím' },
	{ id: 'co-dien', ten: 'Nhạc cổ điển', mo_ta: 'Thời kỳ, hình thức, nhà soạn nhạc' },
	{ id: 'tac-pham', ten: 'Tác phẩm', mo_ta: 'Bài học từng tác phẩm và hướng dẫn nghe' },
	{ id: 'luyen-tap', ten: 'Luyện tập', mo_ta: 'Đọc nốt, luyện tai, máy đếm nhịp' },
	{ id: 'doc-them', ten: 'Đọc thêm', mo_ta: 'Nhạc cụ, opera, nhạc Việt Nam' },
].map((n) => ({ ...n, bieu_tuong: BIEU_TUONG[n.id] }));

/** Trang của nhóm "Thêm", ngoài mục blog. */
const THEM = ['cap-nhat', 'tai-nguyen', 'tai-lieu-tham-khao', 'bat-dau/sach-in'];

/** [đầu đường dẫn, nhóm], thử theo thứ tự như nhom_menu(). */
const THEO_DUONG_DAN = [
	['bat-dau', 'bat-dau'],
	['piano/lo-trinh', 'lo-trinh'],
	['piano/tac-pham', 'tac-pham'],
	['nghe-nhac', 'tac-pham'],
	['piano', 'piano'],
	['nhac-ly', 'nhac-ly'],
	['luyen-tai', 'nhac-ly'],
	['luyen-tap', 'luyen-tap'],
];

/** Mục của nhóm Nhạc cổ điển; trang tầng ngoại vi trong các mục này thuộc Đọc thêm. */
const CO_DIEN = ['lich-su', 'hinh-thuc', 'nhan-dien'];

/**
 * Nhóm của trang có đường dẫn `id` (ví dụ "nhac-ly/10-hop-am-ba"; trang mục lục viết "nhac-ly" hay "nhac-ly/index")
 * và tầng `tang` trong src/data/trang.yml; undefined với trang chủ, nhóm Thêm và trang không thuộc mục nào.
 */
export function nhomCuaTrang(id, tang) {
	const thuoc = (dau) => id === dau || id.startsWith(dau + '/');
	if (THEM.includes(id) || thuoc('blog')) return undefined;
	let ma = THEO_DUONG_DAN.find(([dau]) => thuoc(dau))?.[1];
	if (!ma && (tang === 'ngoai-vi' || thuoc('nhac-cu'))) ma = 'doc-them';
	if (!ma && CO_DIEN.some(thuoc)) ma = 'co-dien';
	return NHOM.find((n) => n.id === ma);
}

/** SVG biểu tượng của một nhóm. */
export const svgNhom = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${n.bieu_tuong}</svg>`;
