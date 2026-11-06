// Trang nào có trong bản build hiện tại. Bản thật (npm run build): chỉ trang đã khóa trong kiem-dinh/khoa.json (D1.6);
// bản xem (npm run build:xem, npm run dev): mọi trang trong src/content/docs/. Cả hai bản đều có 7 trang chặng sinh từ
// dữ liệu (src/pages/piano/lo-trinh/[chang].astro, D2-L1). Link tới trang không có trong bản build hiện chữ "sắp có"
// (src/plugins/sap-co.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { ban, docKhoa } from './khoa.mjs';

const DOCS = fileURLToPath(new URL('./content/docs/', import.meta.url));

/** Đường dẫn gốc của site, có "/" ở cuối (base của astro.config.mjs): link do thành phần dựng lúc build viết từ đây. */
export const DUONG_GOC = '/opus/';

/** Mọi trang trong src/content/docs/, như "nhac-ly/10-hop-am-ba", "nhac-ly/index", "index", kể cả "404". */
export function tatCaTrang() {
	return fs
		.readdirSync(DOCS, { recursive: true })
		.filter((f) => /\.mdx?$/.test(f))
		.map((f) => f.replace(/\\/g, '/').replace(/\.mdx?$/, ''))
		.sort();
}

/** Trang trong src/content/docs/ có trong bản build hiện tại (theo ban()), không tính trang 404. */
export function trangDocsTrongBan() {
	const khoa = docKhoa().trang;
	return tatCaTrang().filter((t) => t !== '404' && (ban() === 'xem' || t in khoa));
}

/**
 * 7 trang chặng ("piano/lo-trinh/chang-1"…), sinh từ cap-do.yml ở mọi bản build. Chỉ đọc id của chặng (đọc thẳng YAML,
 * vì src/du-lieu.mjs dùng file này); thư mục dữ liệu như OPUS_DU_LIEU. Dữ liệu hỏng thì không có trang nào: bộ nạp dữ
 * liệu báo lỗi đúng chỗ.
 */
export function trangChang() {
	try {
		const f = path.resolve(fileURLToPath(new URL('../', import.meta.url)), process.env.OPUS_DU_LIEU || 'src/data', 'cap-do.yml');
		const ds = parse(fs.readFileSync(f, 'utf8'));
		return Array.isArray(ds) ? ds.map((c) => Number(c?.id)).filter(Number.isInteger).sort((a, b) => a - b).map((id) => `piano/lo-trinh/chang-${id}`) : [];
	} catch {
		return [];
	}
}

/** Trang trong bản build hiện tại: trang của src/content/docs/ (theo ban()) và 7 trang chặng; không tính trang 404. */
export function trangTrongBan() {
	return [...trangDocsTrongBan(), ...trangChang()];
}

/** Địa chỉ trỏ tới file (.txt, .mp3…): đoạn cuối của đường dẫn (bỏ ?… và #…) có đuôi, không có "/" ở cuối. */
export const laFile = (diaChi) => /\.[a-z0-9]+$/i.test(diaChi.split(/[?#]/)[0]);

/**
 * Trang (trong `trang`, dạng trangTrongBan) mà địa chỉ `diaChi` (/opus/x/y/#muc) trỏ tới, hay undefined nếu không có.
 * Địa chỉ không thuộc site (không bắt đầu bằng `base`) hay trỏ tới file (có đuôi như .txt) cũng trả về undefined.
 */
export function trangCuaDiaChi(diaChi, base, trang) {
	if (!diaChi.startsWith(base) || laFile(diaChi)) return undefined;
	const p = decodeURI(diaChi.slice(base.length).split(/[?#]/)[0]).replace(/\/$/, '');
	return [p || 'index', `${p}/index`].find((t) => trang.includes(t));
}

/** Thư mục trang tác phẩm theo loại (trang chính của bản ghi: thư mục + slug). */
export const THU_MUC_TAC_PHAM = { 'bai-hoc': 'piano/tac-pham/', nghe: 'nghe-nhac/' };
/** Loại của trang tác phẩm theo đường dẫn: bai-hoc (piano/tac-pham/…), nghe (nghe-nhac/…), hay undefined. */
export const loaiTrangTacPham = (t) => Object.keys(THU_MUC_TAC_PHAM).find((l) => t.startsWith(THU_MUC_TAC_PHAM[l]));

/**
 * Trang tác phẩm và bản ghi của nó (D6-L11): Map trang -> slug, đọc từ trường tac_pham ở frontmatter của các trang trong
 * piano/tac-pham/ và nghe-nhac/ (trang không khai tac_pham, như mục lục, thì không có). Frontmatter khóa cùng trang, nên
 * cách nhận này không cần trường cap của bản ghi (có thể chưa khóa). Trang chính của bản ghi và trang cap dùng chung bản
 * ghi mang cùng một slug; trang cap có bản ghi riêng (như nghe-nhac/schumann-kinderszenen của schumann-traumerei) mang
 * slug của bản ghi ấy (tests/du-lieu.test.mjs kiểm frontmatter khớp tac-pham.yml). Dùng chung cho danh mục tác phẩm
 * (mucDanhMuc) và chương tác phẩm của sách in (chuongTacPham).
 * @param {string[]} trang trang cần đọc (mặc định: mọi trang trong src/content/docs/)
 */
export function banGhiCuaTrang(trang = tatCaTrang(), docs = DOCS) {
	const m = new Map();
	for (const t of trang) {
		if (!loaiTrangTacPham(t) || t.endsWith('/index')) continue;
		const f = path.join(docs, `${t}.md`);
		if (!fs.existsSync(f)) continue;
		const fm = parse(/^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(f, 'utf8'))?.[1] ?? '') ?? {};
		if (fm.tac_pham) m.set(t, String(fm.tac_pham));
	}
	return m;
}

/** Đường dẫn trang của một mục trong bộ docs (theo file nguồn; trang mục lục giữ đuôi /index). */
export const trangCuaMuc = (muc) => muc.filePath?.replace(/^src\/content\/docs\//, '').replace(/\.mdx?$/, '');

/**
 * Bọc bộ nạp trang: ở bản thật, bỏ trang chưa khóa khỏi bộ docs, nên Starlight không dựng trang, không đưa vào menu,
 * tìm kiếm hay sitemap. Trang 404 chỉ giữ khi đã khóa (không thì dùng trang 404 mặc định của Starlight).
 */
export function locTheoBan(loader) {
	return {
		...loader,
		load: async (ctx) => {
			await loader.load(ctx);
			if (ban() === 'xem') return;
			const khoa = docKhoa().trang;
			for (const [id, muc] of ctx.store.entries()) {
				const t = trangCuaMuc(muc);
				if (t && !(t in khoa)) ctx.store.delete(id);
			}
		},
	};
}

/**
 * Bọc plugin Markdown (mdast) của dự án: ở bản thật, trang chưa khóa không qua plugin. Bộ nạp của Starlight dựng mọi trang
 * rồi locTheoBan mới bỏ trang chưa khóa, nên không bọc thì lỗi cú pháp ở một khối (```abc, ```quiz, chỉ thị) của trang
 * chưa khóa (không lên site) làm hỏng bản build đăng lên site, và log in cảnh báo [opus] của trang ấy (review cuối đợt 1,
 * d1.md "Việc còn mở"; D2-L1 làm). Chỉ plugin này được bọc: frontmatter (schema, tac_pham) và các plugin hast vẫn chạy trên
 * mọi trang trước locTheoBan, nên lỗi ở đó của trang chưa khóa vẫn làm hỏng bản thật. Chỉ file nằm trong thư mục trang
 * (`docsDir`) mới có thể là trang chưa khóa; file khác, hay không đọc được đường dẫn (gọi thẳng Sätteri, như trong kiểm
 * thử), vẫn qua plugin.
 * @param {(ctx: { fileURL?: URL }) => object} plugin
 */
const BO = () => ({ type: 'html', value: '' });

export function chiTrangTrongBan(plugin, docsDir = DOCS) {
	return (ctx) => {
		if (ban() !== 'xem' && ctx?.fileURL) {
			const tuongDoi = path.relative(docsDir, fileURLToPath(ctx.fileURL));
			const trongDocs = tuongDoi !== '' && tuongDoi.split(/[\\/]/)[0] !== '..' && !path.isAbsolute(tuongDoi);
			const trang = tuongDoi.replace(/\\/g, '/').replace(/\.mdx?$/, '');
			// trang sẽ bị bỏ: khối mã và chỉ thị thành chỗ trống, để Expressive Code không dựng khối ```abc, ```quiz (và báo
			// "không có ngôn ngữ") cho trang không đăng
			if (trongDocs && !(trang in docKhoa().trang)) return { name: 'opus-bo-qua-trang-chua-khoa', code: BO, leafDirective: BO };
		}
		return plugin(ctx);
	};
}

/**
 * Bọc bộ nạp trang: ::danh-sach-bai của blog/index lấy tiêu đề, ngày, mô tả từ frontmatter của bài blog (D7-L3), mà Astro
 * chỉ dựng lại trang có file đổi. Frontmatter của bài nào đổi (hay thêm, bớt bài) thì xóa bộ nhớ đệm của trang, dựng lại
 * hết (như dungLaiKhiDoi của src/du-lieu.mjs).
 */
export function dungLaiKhiBlogDoi(loader) {
	return {
		...loader,
		load: async (ctx) => {
			const thuMuc = path.join(DOCS, 'blog', 'posts');
			const dau = fs.existsSync(thuMuc)
				? fs
						.readdirSync(thuMuc)
						.filter((f) => f.endsWith('.md'))
						.sort()
						.map((f) => `${f}\n${/^---\n[\s\S]*?\n---/.exec(fs.readFileSync(path.join(thuMuc, f), 'utf8'))?.[0] ?? ''}`)
						.join('\n')
				: '';
			if (ctx.meta.get('opus-blog') !== dau) {
				ctx.store.clear();
				ctx.meta.set('opus-blog', dau);
			}
			await loader.load(ctx);
		},
	};
}
