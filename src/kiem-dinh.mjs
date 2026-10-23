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
