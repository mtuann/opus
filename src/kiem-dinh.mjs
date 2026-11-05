// Trạng thái kiểm định của một trang, cho huy hiệu "Đã kiểm định" dưới tiêu đề (src/components/PageTitle.astro).
// Trạng thái không ghi trong trang (để mã băm không đổi khi khóa) mà đọc lúc build từ kiem-dinh/:
// khoa.json { "trang": { "<đường dẫn trang>": "sha256:…" } } (ghi bằng node tools/khoa.mjs) và hồ sơ
// kiem-dinh/<đường dẫn trang>.yml (plans/ben-vung/chuan-kiem-dinh.md mục 5).
import { parse } from 'yaml';

/**
 * null khi trang chưa khóa; còn không thì { ngay, nhanDinh }: ngày của lần kiểm định gần nhất ("2026-11-02") và số
 * nhận định cộng số khuông nhạc đã kiểm trong hồ sơ. Trang khóa mà hồ sơ không có nhận định (trang chủ tạm, trang 404)
 * thì nhanDinh là 0: không có gì để kiểm, không hiện huy hiệu.
 * @param {string} trang đường dẫn trang, như "nhac-ly/10-hop-am-ba" (trang mục lục: "nhac-ly/index")
 * @param {{ trang?: Record<string, string> } | undefined} khoa nội dung kiem-dinh/khoa.json
 * @param {string | undefined} hoSo chữ của kiem-dinh/<trang>.yml
 */
export function kiemDinh(trang, khoa, hoSo) {
	if (!khoa?.trang?.[trang]) return null;
	const hs = (hoSo && parse(hoSo)) || {};
	const ngay = hs.lan?.at(-1)?.ngay;
	return { ngay: ngay ? String(ngay) : null, nhanDinh: (hs.nhan_dinh ?? []).length + (hs.khuong_nhac ?? []).length };
}

/** "2026-11-02" -> "2/11/2026", không phụ thuộc bộ dữ liệu ngôn ngữ của Node. */
export const ngayViet = (ngay) => {
	const [n, t, d] = ngay.split('-').map(Number);
	return `${d}/${t}/${n}`;
};

// ---------- Ngày kiểm và ngày rà lại của trang tham chiếu có hạn (D8-L1) ----------
// Trang tầng tham-chieu (src/data/trang.yml) có ra_lai ("2027-04"): đến tháng ấy thì rà lại, mỗi lần là một lần kiểm định
// mới (plans/ben-vung/chuan-kiem-dinh.md mục 3). Dòng "Kiểm tra lần cuối: tháng 11/2026 · rà lại tháng 4/2027" hiện tự động
// dưới tiêu đề (PageTitle.astro, lớp oz-ra-lai), thay dòng ngày viết tay của trang cũ: khóa trang thì không phải mở khóa chỉ
// để đổi ngày.

/** "2027-04" -> "4/2027". */
export const thangViet = (thang) => {
	const [n, t] = String(thang).split('-').map(Number);
	return `${t}/${n}`;
};

/** Tháng kiểm ("2026-11") của trang đã khóa: tháng của lần kiểm định cuối trong hồ sơ; chưa khóa hay chưa có ngày: null. */
export function thangKiem(trang, khoa, hoSo) {
	const kd = kiemDinh(trang, khoa, hoSo);
	return kd?.ngay ? kd.ngay.slice(0, 7) : null;
}

/**
 * Chữ của dòng ngày kiểm và ngày rà lại: "Kiểm tra lần cuối: tháng 11/2026 · rà lại tháng 4/2027"; trang chưa khóa (bản
 * xem) ghi "chưa kiểm định" thay tháng kiểm. Không có ra_lai (trang không phải tham chiếu có hạn): null.
 */
export function dongRaLai(kiem, raLai) {
	if (!raLai) return null;
	return `Kiểm tra lần cuối: ${kiem ? `tháng ${thangViet(kiem)}` : 'chưa kiểm định'} · rà lại tháng ${thangViet(raLai)}`;
}

/** Số tháng từ tháng `a` tới tháng `b` ("2026-11", "2027-04" -> 5). */
export const soThang = (a, b) => {
	const [na, ta] = a.split('-').map(Number);
	const [nb, tb] = b.split('-').map(Number);
	return (nb - na) * 12 + (tb - ta);
};

/**
 * Lỗi của ra_lai so với tháng kiểm (bao-cao/d8-chuan-bi.md, "Đã chọn" 4): ra_lai phải sau tháng kiểm và không quá 12 tháng
 * sau đó. Đúng thì null.
 */
export function loiRaLai(kiem, raLai) {
	const n = soThang(kiem, raLai);
	if (n <= 0) return `ra_lai ${raLai} không sau tháng kiểm ${kiem}`;
	if (n > 12) return `ra_lai ${raLai} quá 12 tháng sau tháng kiểm ${kiem}`;
	return null;
}
