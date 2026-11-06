// Plugin Markdown của dự án cho Sätteri (cây mdast), đăng ký ở astro.config.mjs (D1.3). Lúc build, nó đổi:
// - khối ```abc thành khuông nhạc (abcjs vẽ khi tới gần màn hình), khối ```quiz thành câu hỏi kiểm tra nhanh;
// - chỉ thị một dòng ::hop-tac-pham, ::hinh-cau-truc, ::khoi-nghe, ::hoc-tiep thành thành phần dựng từ bản ghi của
//   tác phẩm mà trang khai ở frontmatter (tac_pham: <slug>);
// - chỉ thị ::hinh{ten="…"} (hình minh họa) và ::cong-cu{ten="…" …} (công cụ luyện tập) thành thành phần cùng tên, hay
//   một ô "chưa chuyển" khi lô đầu tiên dùng nó chưa làm thành phần (D1.4).
// Cú pháp: AGENTS.md, mục "Khối đặc biệt". Chỉ thị khối (aside :::note của Starlight…) để nguyên cho Starlight.
// Viết sai (chỉ thị một dòng không có tên trong CHI_THI, thiếu tac_pham, thuộc tính lạ, quiz không có đáp án đúng, hình
// chưa có dữ liệu) thì ném lỗi: build hỏng. Trang đã khóa mà chỉ thị hiện một trường dữ liệu chưa khóa cũng vậy (D2-nền):
// bản ghi đưa cho chỉ thị chỉ cho đọc trường đã khóa (chiDaKhoa).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { chiDaKhoa, coTruongDaKhoa, duLieuDaKiem } from '../du-lieu.mjs';
import { docKhoa, truongDaKhoa } from '../khoa.mjs';
import { bangNhaSoanNhac, congCu, danhSachBai, docBaiBlog, docMoc, dongThoiGian, duLieuCho, hinh, hinhCauTruc, danhMucTacPham, hocTiep, hopTacPham, khoiNghe, khuongAbc, quiz, tacPhamMoi, tuDien } from './thanh-phan.mjs';
import { docDanhSach } from '../scripts/dong-thoi-gian.js';

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
	hinh: { thuocTinh: ['ten*'], ve: ({ tt, trang }) => hinh(tt.ten, trang) },
	// thuộc tính khác của ::cong-cu là thông số của công cụ (data-* của khối oz- ở site cũ)
	'cong-cu': { thuocTinh: ['ten*', '…'], ve: ({ tt, trang }) => congCu(tt, trang) },
	// bảng thuật ngữ của một nhóm, dựng từ src/data/thuat-ngu.yml (D3-L5, trang Từ điển)
	'tu-dien': { thuocTinh: ['nhom*'], ve: ({ tt, trang }) => tuDien(tt.nhom, duLieuCho(trang).thuatNgu) },
	// dòng thời gian nhà soạn nhạc và bảng dữ liệu của nó, dựng từ src/data/nha-soan-nhac.yml (D5-L1): nguoi="id,id:tên,…";
	// ::bang-nha-soan-nhac không ghi nguoi thì dùng danh sách của ::dong-thoi-gian đứng trước nó trong trang
	'dong-thoi-gian': {
		thuocTinh: ['nguoi*'],
		ve: ({ tt, nguoi, rieng }) => {
			const { html, ds } = dongThoiGian(tt.nguoi, nguoi);
			rieng.dsNguoi = ds;
			return html;
		},
	},
	'bang-nha-soan-nhac': {
		thuocTinh: ['nguoi'],
		ve: ({ tt, nguoi, rieng }) => {
			if (tt.nguoi === undefined && !rieng.dsNguoi)
				throw new Error('::bang-nha-soan-nhac không có nguoi mà trước nó trong trang không có ::dong-thoi-gian{nguoi="…"}');
			return bangNhaSoanNhac(tt.nguoi === undefined ? rieng.dsNguoi : docDanhSach(tt.nguoi), nguoi);
		},
	},
	// danh sách bài blog có trong bản build (trang blog/index) và nhật ký tác phẩm mới theo them_ngay (trang Cập nhật), D7-L3
	'danh-sach-bai': { ve: ({ base }) => danhSachBai(docBaiBlog(), base) },
	'tac-pham-moi': { ve: ({ tacPham, nguoi, base }) => tacPhamMoi(tacPham, nguoi, undefined, base) },
	// danh mục các trang tác phẩm có trong bản build, lọc theo loại, chặng, thời kỳ, tác giả (D6-L11; trang
	// piano/tac-pham/index: loai="bai-hoc", nghe-nhac/index: mọi loại); trường chưa khóa của bản ghi coi như không có
	'danh-muc-tac-pham': {
		thuocTinh: ['loai'],
		ve: ({ tt, tacPham, nguoi, daKhoa, base }) => danhMucTacPham({ loai: tt.loai, tacPham, nguoi, daKhoa }, { base }),
	},
};

/** Tiêu đề mục chứa bảng mốc, ngay sau ::khoi-nghe{moc}. */
const TIEU_DE_MOC = 'Theo dõi khi nghe';

/** Chữ của một nút mdast (nối mọi nút chữ, mã trong dòng bên trong). */
const chuCua = (n) => (typeof n.value === 'string' ? n.value : (n.children ?? []).map(chuCua).join(''));

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
 * @param {{ base: string, docsDir: string, khoa?: () => object }} opts base: đường dẫn gốc của site, có / ở cuối (ví dụ
 *   "/opus/"); docsDir: thư mục trang (src/content/docs), để biết đường dẫn của trang đang dựng; khoa: đọc khoa.json
 *   (kiểm thử thay bằng bản giả).
 */
export function opusMarkdown({ base, docsDir, khoa = docKhoa }) {
	return ({ fileURL, data }) => {
		const file = fileURLToPath(fileURL);
		const trang = path.relative(docsDir, file).replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const loi = (msg) => new Error(`${path.relative(process.cwd(), file)}: ${msg}`);
		// Astro tách frontmatter trước khi gọi Sätteri và đưa vào data.astro; chạy thẳng Sätteri (kiểm thử) thì đọc nút yaml
		let fm = data?.astro?.frontmatter ?? {};
		// ::khoi-nghe{moc} vừa gặp: { so: số mốc, trongMuc: đã tới tiêu đề "Theo dõi khi nghe" chưa }, chờ bảng của mục ấy
		// (Sätteri duyệt theo thứ tự trong trang). Trang hết mà chưa gặp bảng thì chưa bắt được: Sätteri không báo lúc hết cây.
		let choMoc = null;
		// trạng thái riêng của trang cho các chỉ thị (danh sách người của ::dong-thoi-gian cho ::bang-nha-soan-nhac)
		const rieng = {};
		return {
			name: 'opus-markdown',
			yaml(node) {
				fm = parse(node.value) ?? {};
			},
			code(node) {
				try {
					if (node.lang === 'abc') return { type: 'html', value: khuongAbc(node.value) };
					if (node.lang === 'quiz') return { type: 'html', value: quiz(node.value) };
					// bài kiểm tra đầu vào (khối ```placement của site cũ): đợt 2 làm thành phần
					if (node.lang === 'placement') return { type: 'html', value: congCu({ ten: 'placement' }, trang) };
				} catch (e) {
					throw loi(e.message);
				}
			},
			// mốc đi theo dòng của bảng "Theo dõi khi nghe" (mục đứng ngay sau khối nghe, AGENTS.md mục Mẫu trang): nhiều mốc
			// hơn số dòng là mốc thừa (bảng đã sửa, hay bản thu đã đổi)
			heading(node) {
				if (choMoc === null) return;
				if (choMoc.trongMuc) throw loi(`::khoi-nghe có moc mà mục "${TIEU_DE_MOC}" không có bảng`);
				if (chuCua(node).trim() !== TIEU_DE_MOC) throw loi(`::khoi-nghe có moc mà mục ngay sau không phải "${TIEU_DE_MOC}" (gặp "${chuCua(node).trim()}")`);
				choMoc.trongMuc = true;
			},
			table(node) {
				if (!choMoc?.trongMuc) return;
				const [so, soDong] = [choMoc.so, node.children.length - 1];
				choMoc = null;
				if (so > soDong) throw loi(`::khoi-nghe có ${so} mốc mà bảng "${TIEU_DE_MOC}" ngay sau chỉ có ${soDong} dòng`);
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
				// trang đã khóa: chỉ thị chỉ được đọc trường đã khóa của bản ghi
				const k = khoa();
				const daKhoa = k.trang[trang] ? truongDaKhoa(k) : null;
				const boc = (bo) => (r) => (daKhoa ? chiDaKhoa(r, bo, `trang đã khóa ${trang} (::${node.name})`, daKhoa) : r);
				const tatCa = duLieu['tac-pham'].map(boc('tac-pham'));
				const rec = fm.tac_pham ? tatCa.find((r) => r.slug === fm.tac_pham) : undefined;
				// danh sách (Học tiếp, tác phẩm mới…) của trang đã khóa bỏ qua tác phẩm chưa khóa trường nào (coTruongDaKhoa)
				const tacPham = daKhoa ? tatCa.filter((r) => coTruongDaKhoa(r, 'tac-pham', daKhoa)) : tatCa;
				if (muc.tacPham && !rec) throw loi(`::${node.name} cần trường tac_pham ở frontmatter (slug trong src/data/tac-pham.yml)`);
				const nguoi = new Map(duLieu['nha-soan-nhac'].map((r) => [r.id, boc('nha-soan-nhac')(r)]));
				try {
					const html = muc.ve({ rec, tt, base, trang, nguoi, tacPham, tatCa, rieng, daKhoa });
					if (node.name === 'khoi-nghe' && choMoc) throw new Error(`khối nghe trước có moc mà chưa gặp bảng "${TIEU_DE_MOC}"`);
					if (node.name === 'khoi-nghe' && tt.moc !== undefined) choMoc = { so: docMoc(tt.moc).length, trongMuc: false };
					return { type: 'html', value: html };
				} catch (e) {
					throw loi(e.message);
				}
			},
		};
	};
}
