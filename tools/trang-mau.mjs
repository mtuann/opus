// Trang mẫu cho kiểm thử trình duyệt và Lighthouse (D1.7, sửa theo review): lấy từ chính bản build, để trang của mọi lô
// đều được kiểm. Thứ tự: trang chủ, trang 404, các trang nhánh đang làm đã đổi so với main (tối đa TOI_DA_TRANG_DOI: trang của lô), rồi
// với mỗi loại khối, trang đầu tiên (theo thứ tự chữ cái) có khối ấy; cộng trang ghi trong biến môi trường OPUS_TRANG
// ("nhac-ly/10-hop-am-ba/,piano/gam/").
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = fileURLToPath(new URL('../', import.meta.url));

/** Dấu hiệu của từng loại khối trong HTML đã dựng. */
export const KHOI = {
	'khuông nhạc': 'class="oz-abc',
	'câu hỏi': 'class="oz-quiz',
	'khối nghe': 'class="oz-listen',
	'hộp tác phẩm': 'class="oz-piece',
	'hình cấu trúc': 'class="oz-figure',
	'bảng': '<table',
	'khối thu gọn': '<details',
	'chữ "sắp có"': 'class="oz-sap-co"',
	'ô "chưa chuyển"': 'class="oz-chua-co',
	'danh sách việc': 'class="task-list-item oz-viec',
	'trang chặng': 'class="oz-chang-hinh oz-chang-hinh--gon',
	'bài kiểm tra đầu vào': 'class="oz-placement',
	'chọn chặng piano': 'class="oz-muc-do',
	'ô gợi ý tập': 'class="oz-goi-y',
	'bàn phím': 'class="oz-ban-phim',
	'hóa biểu': 'class="oz-hb"',
	'mười lăm hóa biểu': 'oz-ks-hinh',
	'vòng quãng năm tĩnh': 'oz-vong-tinh',
	'vòng quãng năm bấm được': 'class="oz-vong oz-tool',
	'luyện hóa biểu': 'class="oz-lhb',
	'vòng chức năng': 'class="oz-fig oz-chuc-nang"',
	'bảy điệu thức': 'class="oz-fig oz-dieu-thuc"',
	'hình tĩnh SVG': '<figure class="oz-figure not-content" data-sinh><svg',
	'hình tĩnh lưới': '<figure class="oz-figure not-content" data-sinh><div class="oz-fig-grid',
	'công cụ âm học': 'oz-boi-am',
	'thẻ ghi nhớ': 'class="oz-the-nho',
	'trạng thái bài': 'class="oz-trang-thai-bai',
	'luyện tai': 'class="oz-lt oz-tool',
	'máy đếm nhịp': 'class="oz-may-dem-nhip',
	'bài đang tập': 'class="oz-bai-dang-tap',
	'kế hoạch buổi tập': 'class="oz-ke-hoach',
	'dòng thời gian': 'class="oz-figure oz-dtg',
	'ví dụ phong cách': 'class="oz-vd-phong-cach"',
	'đoán phong cách': 'class="oz-nd oz-tool',
	// công cụ Luyện tập của D7-L1 (lớp chốt ở plans/lam-lai/bao-cao/d7-chuan-bi.md; thành phần do lô làm)
	'trạng thái MIDI': 'class="oz-midi',
	'tra hợp âm, gam trên phím': 'class="oz-tra-phim',
	'chép giai điệu': 'class="oz-chep',
	'chơi theo': 'class="oz-choi-theo',
	'hát lại': 'class="oz-hat-lai',
	'đọc nốt': 'class="oz-doc-not',
	'sao lưu dữ liệu học': 'class="oz-sao-luu',
	'so cao độ': 'class="oz-so-cao-do',
	'chọn âm thanh': 'class="oz-chon-am',
	// công cụ Luyện tập của D7-L2 (lớp chốt ở bước chuẩn bị D7-L2, AGENTS.md mục D7-L2; thành phần do lô làm)
	'xây gam và hợp âm': 'class="oz-xay',
	'giấy kẻ khuông': 'class="oz-giay-khuong',
	'phiếu bài tập': 'class="oz-phieu',
	'thu âm': 'class="oz-thu-am',
	'tiết tấu': 'class="oz-tiet-tau',
	'thị tấu một bè': 'class="oz-thi-tau oz-tool',
	'thị tấu hai tay': 'class="oz-thi-tau-hai-tay',
	'nhật ký': 'class="oz-nhat-ky',
	'bảng năng lực': 'class="oz-nang-luc',
	'biểu đồ tiến bộ': 'class="oz-tien-bo',
	// D7-L3 (chốt ở bước chuẩn bị D7-L3, AGENTS.md mục D7-L3; thành phần do lô làm)
	'danh sách bài blog': 'class="oz-ds-bai',
	'nhật ký tác phẩm mới': 'class="oz-tac-pham-moi',
	'link sách in': 'href="/opus/sach/',
	// D8 (chốt ở nhánh chuẩn bị đợt 8, plans/lam-lai/bao-cao/d8-chuan-bi.md; thành phần do lô làm)
	'nghe mù': 'class="oz-nghe-mu',
	'phiếu nghe mù': 'class="oz-phieu-nghe-mu',
	'ngày rà lại': 'class="oz-ra-lai',
	'dòng ngoài lộ trình': 'class="oz-ngoai-lo-trinh',
};

/** Số trang đã đổi của nhánh được lấy làm mẫu: một lô của đợt 3 có tới 8 trang. */
export const TOI_DA_TRANG_DOI = 8;

/** File HTML của một trang mẫu ("" là trang chủ, "404.html", "nhac-ly/x/"). */
export const fileCua = (dist, t) => path.join(dist, t.endsWith('.html') ? t : path.join(t, 'index.html'));

/** Mọi trang của bản build, theo thứ tự chữ cái: "", "404.html", "nhac-ly/10-hop-am-ba/"… */
function tatCa(dist) {
	return fs
		.readdirSync(dist, { recursive: true })
		.map((f) => f.replace(/\\/g, '/'))
		.filter((f) => f.endsWith('index.html') && !f.startsWith('pagefind/') && !f.startsWith('_astro/'))
		.map((f) => f.slice(0, -'index.html'.length))
		.sort();
}

/** Trang (trong src/content/docs/) nhánh đang làm đã đổi so với main; rỗng nếu đang ở main hay không đọc được git. */
export function trangDaDoi(goc = GOC) {
	const git = (...ts) => execFileSync('git', ['-C', goc, ...ts], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	try {
		const nen = ['main', 'origin/main'].find((b) => {
			try {
				return git('rev-parse', '--verify', '--quiet', `${b}^{commit}`);
			} catch {
				return false;
			}
		});
		if (!nen) return [];
		const doi = git('diff', '--name-only', '--diff-filter=AM', git('merge-base', 'HEAD', nen), '--', 'src/content/docs');
		return doi
			.split('\n')
			.map((f) => /^src\/content\/docs\/(.+)\.md$/.exec(f)?.[1])
			.filter(Boolean)
			.map((t) => (t === 'index' ? '' : t.replace(/(^|\/)index$/, '') + '/').replace(/^\/$/, ''));
	} catch {
		return [];
	}
}

/** Danh sách trang mẫu của bản build ở `dist`. */
export function trangMau(dist, goc = GOC) {
	if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error(`Chưa có ${path.relative(goc, dist) || dist}/index.html: chạy npm run build (hay build:xem) trước.`);
	const co = tatCa(dist);
	const html = new Map(co.map((t) => [t, fs.readFileSync(fileCua(dist, t), 'utf8')]));
	const ra = ['', ...(fs.existsSync(path.join(dist, '404.html')) ? ['404.html'] : [])];
	ra.push(...trangDaDoi(goc).filter((t) => html.has(t)).slice(0, TOI_DA_TRANG_DOI));
	for (const dau of Object.values(KHOI)) {
		const t = co.find((x) => x && html.get(x).includes(dau));
		if (t !== undefined) ra.push(t);
	}
	for (const t of (process.env.OPUS_TRANG ?? '').split(',').map((x) => x.trim()).filter(Boolean)) {
		const t2 = t.endsWith('.html') || t.endsWith('/') ? t : t + '/';
		if (!fs.existsSync(fileCua(dist, t2))) throw new Error(`OPUS_TRANG: bản build không có trang ${t2}`);
		ra.push(t2);
	}
	return [...new Set(ra)];
}
