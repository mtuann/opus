// Plugin Markdown của dự án cho Sätteri (cây mdast), đăng ký ở astro.config.mjs (D1.3). Lúc build, nó đổi:
// - khối ```abc thành khuông nhạc (abcjs vẽ khi tới gần màn hình), khối ```quiz thành câu hỏi kiểm tra nhanh;
// - chỉ thị một dòng ::hop-tac-pham, ::hinh-cau-truc, ::khoi-nghe, ::hoc-tiep thành thành phần dựng từ bản ghi của
//   tác phẩm mà trang khai ở frontmatter (tac_pham: <slug>).
// Cú pháp: AGENTS.md, mục "Khối đặc biệt". Chỉ thị khối (aside :::note của Starlight…) để nguyên cho Starlight.
// Viết sai (chỉ thị một dòng không có tên trong CHI_THI, thiếu tac_pham, thuộc tính lạ, quiz không có đáp án đúng, hình
// chưa có dữ liệu) thì ném lỗi: build hỏng.
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

/**
 * Chỉ thị -> { tacPham: cần tac_pham ở frontmatter?, thuocTinh: thuộc tính nhận được (dấu * là bắt buộc; "…" là nhận
 * thêm mọi thuộc tính khác), ve: hàm dựng HTML }.
 */
const CHI_THI = {
	'hop-tac-pham': { tacPham: true, ve: ({ rec }) => hopTacPham(rec) },
	'hinh-cau-truc': { tacPham: true, ve: ({ rec, trang }) => hinhCauTruc(rec, loaiTrang(trang)) },
	'khoi-nghe': { thuocTinh: ['moc'], ve: ({ rec, base, tt }) => khoiNghe(rec, base, tt.moc) },
	'hoc-tiep': { tacPham: true, ve: (c) => hocTiep(c.rec, c) },
};

/** Kiểm thuộc tính của một chỉ thị theo khai báo; trả về thông báo lỗi hay null. */
function loiThuocTinh(ten, { thuocTinh = [] }, tt) {
	const nhan = thuocTinh.map((t) => t.replace('*', ''));
	const la = Object.keys(tt).filter((k) => !nhan.includes(k));
	if (la.length && !nhan.includes('…'))
		return `::${ten} không nhận thuộc tính ${la.join(', ')}` + (nhan.length ? ` (chỉ nhận: ${nhan.join(', ')})` : '');
	const thieu = thuocTinh.filter((t) => t.endsWith('*') && !tt[t.slice(0, -1)]).map((t) => t.slice(0, -1));
	return thieu.length ? `::${ten} thiếu thuộc tính ${thieu.join(', ')}, ví dụ ::${ten}{${thieu[0]}="…"}` : null;
}

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
				// Starlight không dùng chỉ thị một dòng; tên lạ là gõ sai, để nguyên thì trang hiện dòng "::tên"
				if (!muc) throw loi(`không có chỉ thị ::${node.name} (có: ${Object.keys(CHI_THI).map((t) => '::' + t).join(', ')})`);
				const tt = node.attributes ?? {};
				if (node.children?.length) throw loi(`::${node.name} không nhận chữ, viết "::${node.name}" trên một dòng riêng`);
				const sai = loiThuocTinh(node.name, muc, tt);
				if (sai) throw loi(sai);
				const duLieu = duLieuDaKiem();
				const rec = fm.tac_pham ? duLieu['tac-pham'].find((r) => r.slug === fm.tac_pham) : undefined;
				if (muc.tacPham && !rec) throw loi(`::${node.name} cần trường tac_pham ở frontmatter (slug trong src/data/tac-pham.yml)`);
				const nguoi = new Map(duLieu['nha-soan-nhac'].map((r) => [r.id, r]));
				try {
					return { type: 'html', value: muc.ve({ rec, tt, base, trang, nguoi, tacPham: duLieu['tac-pham'] }) };
				} catch (e) {
					throw loi(e.message);
				}
			},
		};
	};
}
