// Plugin Markdown của dự án cho Sätteri (cây mdast), đăng ký ở astro.config.mjs (D1.3). Lúc build, nó đổi:
// - khối ```abc thành khuông nhạc (abcjs vẽ khi tới gần màn hình), khối ```quiz thành câu hỏi kiểm tra nhanh;
// - chỉ thị một dòng ::hop-tac-pham, ::hinh-cau-truc, ::khoi-nghe, ::hoc-tiep thành thành phần dựng từ bản ghi của
//   tác phẩm mà trang khai ở frontmatter (tac_pham: <slug>).
// Cú pháp: AGENTS.md, mục "Khối đặc biệt". Chỉ thị khác (aside :::note của Starlight…) để nguyên cho Starlight.
// Viết sai (chỉ thị thiếu tac_pham, quiz không có đáp án đúng, hình chưa có dữ liệu) thì ném lỗi: build hỏng.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { duLieuDaKiem } from '../du-lieu.mjs';
import { hinhCauTruc, hocTiep, hopTacPham, khoiNghe, khuongAbc, quiz } from './thanh-phan.mjs';

/** Loại của trang tác phẩm theo đường dẫn: bai-hoc (piano/tac-pham/), nghe (nghe-nhac/). */
function loaiTrang(trang) {
	if (trang.startsWith('piano/tac-pham/')) return 'bai-hoc';
	if (trang.startsWith('nghe-nhac/')) return 'nghe';
	throw new Error('::hinh-cau-truc chỉ dùng ở trang bài học (piano/tac-pham/) hay hướng dẫn nghe (nghe-nhac/)');
}

/** Chỉ thị -> [cần tac_pham ở frontmatter?, hàm dựng HTML]. */
const CHI_THI = {
	'hop-tac-pham': [true, ({ rec }) => hopTacPham(rec)],
	'hinh-cau-truc': [true, ({ rec, trang }) => hinhCauTruc(rec, loaiTrang(trang))],
	'khoi-nghe': [false, ({ rec, base }) => khoiNghe(rec, base)],
	'hoc-tiep': [true, (c) => hocTiep(c.rec, c)],
};

/**
 * @param {{ base: string, docsDir: string }} opts base: đường dẫn gốc của site, có / ở cuối (ví dụ "/opus/");
 *   docsDir: thư mục trang (src/content/docs), để biết đường dẫn của trang đang dựng.
 */
export function opusMarkdown({ base, docsDir }) {
	return ({ fileURL, data }) => {
		const file = fileURLToPath(fileURL);
		const trang = path.relative(docsDir, file).replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const loi = (msg) => new Error(`${path.relative(process.cwd(), file)}: ${msg}`);
		// Astro tách frontmatter trước khi gọi Sätteri và đưa vào data.astro; chạy thẳng Sätteri (kiểm thử) thì đọc nút yaml
		let fm = data?.astro?.frontmatter ?? {};
		return {
			name: 'opus-markdown',
			yaml(node) {
				fm = parse(node.value) ?? {};
			},
			code(node) {
				try {
					if (node.lang === 'abc') return { type: 'html', value: khuongAbc(node.value) };
					if (node.lang === 'quiz') return { type: 'html', value: quiz(node.value) };
				} catch (e) {
					throw loi(e.message);
				}
			},
			leafDirective(node) {
				const muc = CHI_THI[node.name];
				if (!muc) return;
				const [canTacPham, ve] = muc;
				if (node.children?.length || Object.keys(node.attributes ?? {}).length)
					throw loi(`::${node.name} không nhận chữ hay thuộc tính, viết đúng "::${node.name}" trên một dòng riêng`);
				const duLieu = duLieuDaKiem();
				const rec = fm.tac_pham ? duLieu['tac-pham'].find((r) => r.slug === fm.tac_pham) : undefined;
				if (canTacPham && !rec) throw loi(`::${node.name} cần trường tac_pham ở frontmatter (slug trong src/data/tac-pham.yml)`);
				const nguoi = new Map(duLieu['nha-soan-nhac'].map((r) => [r.id, r]));
				try {
					return { type: 'html', value: ve({ rec, base, trang, nguoi, tacPham: duLieu['tac-pham'] }) };
				} catch (e) {
					throw loi(e.message);
				}
			},
		};
	};
}
