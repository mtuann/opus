// Lớp dữ liệu của site (plans/ben-vung/README.md, mục "Lớp dữ liệu"): schema của năm bộ dữ liệu trong src/data/,
// các phép kiểm chéo giữa chúng, và bộ nạp cho content collections của Astro (src/content.config.ts).
// Dữ liệu sai (YAML hỏng, sai kiểu, trường lạ, trùng id, tham chiếu tới thứ không có) thì ném lỗi, nên build hỏng.
// Kiểm thử dùng thẳng kiemTra() trên bộ dữ liệu hỏng mẫu trong tests/du-lieu-hong/.
// Biến môi trường OPUS_DU_LIEU đổi thư mục dữ liệu (mặc định src/data), để thử build với bộ dữ liệu khác.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { z } from 'astro/zod';
import { trangTrongBan } from './ban-build.mjs';
import { ban, docKhoa, truongDaKhoa } from './khoa.mjs';

/** Tên bộ dữ liệu -> file trong thư mục dữ liệu. */
export const TEP = {
	'cap-do': 'cap-do.yml',
	'nha-soan-nhac': 'nha-soan-nhac.yml',
	'tac-pham': 'tac-pham.yml',
	'thuat-ngu': 'thuat-ngu.yml',
	trang: 'trang.yml',
};

const chu = z.string().trim().min(1);
const idChu = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id chỉ gồm a–z, 0–9 và dấu gạch ngang');
const duongDan = z.string().regex(/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/, 'đường dẫn trang như "nhac-ly/10-hop-am-ba"');
const nam = z.number().int().min(800).max(2100);

export const TANG = ['loi', 'tac-pham', 'tham-chieu', 'khung', 'ngoai-vi'];

/** Loại đoạn của hình cấu trúc (màu của ô): a, b, c (tương phản), dev (phát triển), cad (kết, âm nền), coda, intro, x. */
export const LOAI_DOAN = ['a', 'b', 'c', 'dev', 'cad', 'coda', 'intro', 'x'];

/**
 * Một bản thu gợi ý cho khối nghe, cùng dạng data-rec của site cũ để src/scripts/nghe.js đọc thẳng: người chơi (by),
 * giấy phép (lic, licUrl), ghi chú (note), trang của bản thu ở nguồn (page), các phần (parts: file mp3 hay link, file gốc,
 * tiêu đề phần t, thời lượng d giây). File mp3 của site viết từ gốc site, không có base: audio/x.mp3. Mốc tham khảo
 * theo bảng của từng trang nên nằm trong trang (::khoi-nghe{moc="…"}), không ở đây.
 */
const banThu = z
	.object({
		by: chu,
		lic: chu,
		licUrl: z.url().optional(),
		note: chu.optional(),
		page: z.url(),
		parts: z
			.array(
				z
					.object({ mp3: chu.optional(), src: z.url().optional(), link: z.url().optional(), t: chu.optional(), d: z.number().positive() })
					.strict()
					.refine((p) => p.mp3 || p.link, 'mỗi phần cần mp3 hay link'),
			)
			.min(1),
	})
	.strict();

/** Một sơ đồ các đoạn: mỗi đoạn [nhãn, chú thích nhỏ (có thể rỗng), độ rộng (gần đúng số ô nhịp), loại]. */
const soDo = z
	.object({
		chu_thich: chu,
		doan: z.array(z.tuple([chu, z.string(), z.number().positive(), z.enum(LOAI_DOAN)])).min(1),
		ghi_chu: chu.optional(),
	})
	.strict();

/** Schema của từng bộ dữ liệu. Trường lạ là lỗi (strict), để gõ sai tên trường không lọt qua. */
export const schema = {
	// 7 chặng của lộ trình. grade_tu, grade_den: 0 là trước Grade 1, 9 là sau Grade 8.
	'cap-do': z
		.object({
			id: z.number().int().min(1).max(7),
			ten: chu,
			nhan_grade: chu,
			tuong_duong: chu,
			grade_tu: z.number().int().min(0).max(9),
			grade_den: z.number().int().min(0).max(9),
			moc_thoi_gian: chu,
			thoi_luong: chu,
		})
		.strict(),

	// Mọi người có năm sinh–mất trên site. Người còn sống: mat: null. Site cũ ghi hai năm khác nhau: mau_thuan, chưa chọn.
	'nha-soan-nhac': z
		.object({
			id: idChu,
			ten: chu,
			sinh: nam.optional(),
			mat: nam.nullable().optional(),
			khoang: z.literal(true).optional(),
			mau_thuan: z
				.array(z.object({ sinh: nam, mat: nam.nullable(), trang: z.array(chu).min(1) }).strict())
				.min(2)
				.optional(),
			cach_viet_khac: z.array(chu).optional(),
			thoi_ky: chu.optional(),
		})
		.strict()
		.superRefine((r, ctx) => {
			if (r.mau_thuan) {
				if (r.sinh !== undefined || r.mat !== undefined)
					ctx.addIssue({ code: 'custom', message: 'đã có mau_thuan thì không ghi sinh, mat (chọn xong thì bỏ mau_thuan)' });
				return;
			}
			if (r.sinh === undefined) ctx.addIssue({ code: 'custom', path: ['sinh'], message: 'thiếu năm sinh' });
			if (r.mat === undefined)
				ctx.addIssue({ code: 'custom', path: ['mat'], message: 'thiếu năm mất (người còn sống: mat: null)' });
			if (r.sinh !== undefined && r.mat != null && r.mat < r.sinh)
				ctx.addIssue({ code: 'custom', path: ['mat'], message: 'năm mất trước năm sinh' });
		}),

	// Một bản ghi cho mỗi tác phẩm có bài học hay hướng dẫn nghe (plans/ben-vung/them-tac-pham.md, mục 2).
	'tac-pham': z
		.object({
			slug: idChu,
			loai: z.enum(['bai-hoc', 'nghe']),
			tac_gia: idChu.optional(),
			gan_cho: z.literal(true).optional(),
			khuyet_danh: z.literal(true).optional(),
			ten: chu,
			thuoc: chu.optional(),
			danh_muc: chu.optional(),
			giong: chu.optional(),
			nhip: chu.optional(),
			nam: z.object({ gia_tri: chu, nguon: chu.optional() }).strict().optional(),
			thoi_ky: chu.optional(),
			chang: z.number().int().min(1).max(7).optional(),
			grade: chu.optional(),
			ky_nang_chinh: chu.optional(),
			luyen_nghe: chu.optional(),
			an_ban: z.object({ ten: chu, nguon: z.url() }).strict().optional(),
			doi_chieu: chu.optional(),
			// Trang của cùng tác phẩm: dùng chung bản ghi này khi trang ấy không có bản ghi riêng (liszt-liebestraum và
			// nghe-nhac/liszt-liebestraum); còn không là tác phẩm lớn hơn có bản ghi riêng (Träumerei và Kinderszenen),
			// khi đó hai bản ghi trỏ cap sang nhau.
			cap: duongDan.optional(),
			ky_nang: z.array(idChu).optional(),
			goi_y: z.boolean().optional(),
			chip: z.array(z.union([chu, z.object({ cap_do: chu }).strict()])).optional(),
			thong_tin: z.array(z.tuple([chu, chu])).optional(),
			// Hình cấu trúc theo trang: bai-hoc ở trang bài học, nghe ở trang hướng dẫn nghe dùng bản ghi này
			hinh: z.object({ 'bai-hoc': z.array(soDo).min(1).optional(), nghe: z.array(soDo).min(1).optional() }).strict().optional(),
			ban_thu: z.array(banThu).min(1).optional(),
			them_ngay: z.iso.date().optional(),
		})
		.strict()
		.superRefine((r, ctx) => {
			if (r.loai === 'bai-hoc' && (r.chang === undefined || r.grade === undefined))
				ctx.addIssue({ code: 'custom', message: 'bài học phải có chang và grade' });
			if (!r.tac_gia === !r.khuyet_danh)
				ctx.addIssue({ code: 'custom', path: ['tac_gia'], message: 'cần đúng một trong hai: tac_gia, khuyet_danh: true' });
			if (r.gan_cho && !r.tac_gia) ctx.addIssue({ code: 'custom', path: ['gan_cho'], message: 'gan_cho cần tac_gia' });
		}),

	// Thuật ngữ và định nghĩa (thay các bảng của nhac-ly/tu-dien.md cũ).
	'thuat-ngu': z.object({ id: idChu, thuat_ngu: chu, nghia: chu, ghi_chu: chu.optional(), nhom: chu }).strict(),

	// Tầng của mọi trang; trang tham chiếu có hạn có ngày rà lại (năm-tháng).
	trang: z
		.object({
			id: duongDan,
			tang: z.enum(TANG),
			ra_lai: z
				.string()
				.regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'ra_lai dạng năm-tháng, ví dụ 2027-01')
				.optional(),
			ly_do_ra_lai: chu.optional(),
		})
		.strict()
		.superRefine((r, ctx) => {
			if ((r.tang === 'tham-chieu') !== (r.ra_lai !== undefined))
				ctx.addIssue({ code: 'custom', path: ['ra_lai'], message: 'trang tham chiếu có hạn phải có ra_lai; trang khác thì không' });
			if (r.ly_do_ra_lai && !r.ra_lai)
				ctx.addIssue({ code: 'custom', path: ['ly_do_ra_lai'], message: 'ly_do_ra_lai cần ra_lai' });
		}),
};

/** Khóa (id) của một bản ghi: tac-pham dùng slug, các bộ khác dùng id. */
export const khoa = (ten, r) => String(ten === 'tac-pham' ? r?.slug : r?.id);

/**
 * Bản ghi chỉ cho đọc trường đã khóa (trang chỉ hiện trường đã khóa: plans/lam-lai/README.md, Quy tắc chung). Đọc một
 * trường chưa khóa, kể cả trường bản ghi chưa có, thì ném lỗi ghi rõ bản ghi và trường: build hỏng. Đọc id (slug, id)
 * luôn được; hỏi bản ghi có trường không (`in`) thì không chặn. Dùng ở chỗ dựng trang đã khóa (chỉ thị trong trang:
 * src/plugins/opus-markdown.mjs) và trang luôn đăng (trang chặng, ô gợi ý tập ở trang chủ).
 * @param {string} noi chỗ đọc, cho thông báo lỗi, ví dụ "trang đã khóa piano/tac-pham/fur-elise"
 */
export function chiDaKhoa(banGhi, bo, noi, daKhoa = truongDaKhoa()) {
	const id = khoa(bo, banGhi);
	const truong = new Set(Object.keys(schema[bo].shape));
	const truongId = bo === 'tac-pham' ? 'slug' : 'id';
	return new Proxy(banGhi, {
		get(t, k, r) {
			if (typeof k === 'string' && k !== truongId && truong.has(k) && !daKhoa(bo, id, k))
				throw new Error(`${noi} hiện trường chưa khóa du-lieu/${bo}/${id}#${k}: kiểm định và khóa trường ấy (node tools/khoa.mjs khoa du-lieu/${bo}/${id}#…), hay đừng hiện nó`);
			return Reflect.get(t, k, r);
		},
	});
}

/** Thư mục gốc của dự án: thư mục cha của src/, nơi có file này. */
const GOC = fileURLToPath(new URL('../', import.meta.url));

/** Thư mục dữ liệu: OPUS_DU_LIEU (tương đối với thư mục gốc) hay src/data. */
export function thuMuc() {
	return path.resolve(GOC, process.env.OPUS_DU_LIEU || 'src/data');
}

const tiengViet = { error: z.locales.vi().localeError }; // lời báo lỗi của Zod bằng tiếng Việt

/**
 * Đọc và kiểm toàn bộ dữ liệu trong `dir`. Trả về { duLieu, loi }: duLieu[ten] là mảng bản ghi đã qua schema,
 * loi là danh sách lỗi (chuỗi), rỗng khi dữ liệu đúng.
 */
export function kiemTra(dir = thuMuc()) {
	const loi = [];
	const duLieu = {};
	const hong = new Set(); // bộ không đọc được (thiếu file, YAML hỏng, không phải danh sách, rỗng): bỏ qua kiểm chéo với nó
	for (const [ten, tep] of Object.entries(TEP)) {
		const file = path.join(dir, tep);
		duLieu[ten] = [];
		let tho;
		try {
			tho = parse(fs.readFileSync(file, 'utf8'));
		} catch (e) {
			loi.push(`${tep}: ${e.code === 'ENOENT' ? 'không có file' : 'YAML hỏng: ' + e.message.split('\n')[0]}`);
			hong.add(ten);
			continue;
		}
		if (!Array.isArray(tho) || !tho.length) {
			loi.push(`${tep}: ${Array.isArray(tho) ? 'không có bản ghi nào' : 'phải là một danh sách bản ghi'}`);
			hong.add(ten);
			continue;
		}
		const daCo = new Set();
		tho.forEach((r, i) => {
			const k = khoa(ten, r);
			const ten_ban_ghi = r && (r.id ?? r.slug) !== undefined ? `"${k}"` : `thứ ${i + 1}`;
			if (r && (r.id ?? r.slug) !== undefined) {
				if (daCo.has(k)) loi.push(`${tep}: trùng id "${k}"`);
				daCo.add(k);
			}
			const kq = schema[ten].safeParse(r, tiengViet);
			if (!kq.success) {
				for (const issue of kq.error.issues) {
					const truong = issue.path.length ? issue.path.join('.') + ': ' : '';
					loi.push(`${tep}: bản ghi ${ten_ban_ghi}: ${truong}${issue.message}`);
				}
			} else {
				duLieu[ten].push(kq.data);
			}
		});
	}
	loi.push(...kiemTraCheo(duLieu, hong));
	return { duLieu, loi };
}

/** Khoảng Grade (0: trước Grade 1, 9: sau Grade 8) của chuỗi như "Grade 4–5", "≈ Grade 3", "Grade 8 trở lên". */
function khoangGrade(g) {
	const s = g.replace(/≈|\bkhoảng\b|\bABRSM\b/gi, ' ').trim().toLowerCase();
	if (s.startsWith('trước')) return [0, 0];
	if (s.startsWith('sau') || s.includes('trở lên')) return [9, 9];
	const n = (s.match(/\d+/g) ?? []).map(Number);
	return n.length ? [Math.min(...n), Math.max(...n)] : null;
}

/**
 * Kiểm giữa các bộ dữ liệu: tham chiếu tới thứ có thật, chặng liền nhau, Grade hợp chặng, năm sinh–mất và cấp độ chép
 * lại trong bản ghi phải khớp trường gốc. Bộ hỏng ở mức file (trong `hong`) thì bỏ qua các phép kiểm cần nó, để một lỗi
 * không kéo theo hàng chục lỗi "không có".
 */
function kiemTraCheo(d, hong) {
	const loi = [];
	const nguoi = new Map(d['nha-soan-nhac'].map((r) => [r.id, r]));
	const chang = new Map(d['cap-do'].map((r) => [r.id, r]));
	const trang = new Map(d.trang.map((r) => [r.id, r]));
	const co = (ten) => !hong.has(ten);

	const theoTen = new Map();
	for (const p of d['nha-soan-nhac']) {
		if (theoTen.has(p.ten) && theoTen.get(p.ten) !== p.id)
			loi.push(`nha-soan-nhac.yml: "${p.ten}" có hai id: "${theoTen.get(p.ten)}" và "${p.id}"`);
		theoTen.set(p.ten, p.id);
	}

	const cd = [...d['cap-do']].sort((a, b) => a.id - b.id);
	cd.forEach((r, i) => {
		if (r.id !== i + 1) loi.push(`cap-do.yml: chặng phải đánh số liền từ 1 (thấy ${r.id} ở vị trí ${i + 1})`);
		if (r.grade_tu > r.grade_den) loi.push(`cap-do.yml: chặng ${r.id}: grade_tu lớn hơn grade_den`);
		if (i > 0 && r.grade_tu !== cd[i - 1].grade_den + 1)
			loi.push(`cap-do.yml: chặng ${r.id}: grade_tu phải bằng grade_den của chặng trước cộng 1`);
	});

	const trangChinh = (r) => (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug;
	const theoTrangChinh = new Map(d['tac-pham'].map((r) => [trangChinh(r), r]));
	const theoCap = new Map();
	for (const r of d['tac-pham']) {
		const goc = `tac-pham.yml: bản ghi "${r.slug}"`;
		if (co('nha-soan-nhac') && r.tac_gia && !nguoi.has(r.tac_gia))
			loi.push(`${goc}: tac_gia "${r.tac_gia}" không có trong nha-soan-nhac.yml`);
		const chang_r = chang.get(r.chang);
		if (co('cap-do') && r.chang !== undefined && !chang_r) loi.push(`${goc}: chặng ${r.chang} không có trong cap-do.yml`);
		const kGrade = r.grade ? khoangGrade(r.grade) : null;
		if (chang_r && r.grade) {
			const hop = (x) => chang_r.grade_tu <= x && x <= chang_r.grade_den;
			if (!kGrade || !(hop(kGrade[0]) || hop(kGrade[1])))
				loi.push(`${goc}: grade "${r.grade}" không hợp chặng ${r.chang} (${chang_r.nhan_grade})`);
		}
		if (co('trang') && trang.get(trangChinh(r))?.tang !== 'tac-pham')
			loi.push(`${goc}: trang ${trangChinh(r)} không có trong trang.yml với tầng tac-pham`);
		// cap: trang của cùng tác phẩm (dùng chung bản ghi này khi trang ấy không có bản ghi riêng), hay tác phẩm lớn
		// hơn có bản ghi riêng (khi đó hai bản ghi trỏ cap sang nhau). Một trang chỉ là cap của một bản ghi.
		if (r.cap) {
			if (co('trang') && !trang.has(r.cap)) loi.push(`${goc}: cap "${r.cap}" không có trong trang.yml`);
			if (!r.cap.startsWith(r.loai === 'bai-hoc' ? 'nghe-nhac/' : 'piano/tac-pham/'))
				loi.push(`${goc}: cap của ${r.loai === 'bai-hoc' ? 'bài học phải là hướng dẫn nghe' : 'hướng dẫn nghe phải là bài học'}`);
			if (theoCap.has(r.cap)) loi.push(`${goc}: cap "${r.cap}" đã là cap của bản ghi "${theoCap.get(r.cap)}"`);
			theoCap.set(r.cap, r.slug);
			const kia = theoTrangChinh.get(r.cap);
			if (kia && kia.cap !== trangChinh(r))
				loi.push(`${goc}: cap "${r.cap}" có bản ghi riêng "${kia.slug}", nên "${kia.slug}" phải có cap "${trangChinh(r)}"`);
		}
		// Hình của loại trang nào thì bản ghi phải có trang loại ấy (trang chính, hay trang cap dùng chung bản ghi)
		const coTrang = (loai) => r.loai === loai || (r.cap && !theoTrangChinh.has(r.cap) && r.cap.startsWith(loai === 'nghe' ? 'nghe-nhac/' : 'piano/tac-pham/'));
		for (const loai of Object.keys(r.hinh ?? {}))
			if (!coTrang(loai)) loi.push(`${goc}: có hinh.${loai} nhưng không có trang ${loai === 'nghe' ? 'hướng dẫn nghe' : 'bài học'} dùng bản ghi này`);
		// Phần chép nguyên văn từ trang cũ phải khớp trường gốc: chip cấp độ chứa grade, dòng tác giả có tên tác giả
		const chipCapDo = (r.chip ?? []).find((c) => typeof c === 'object')?.cap_do;
		const kChip = chipCapDo ? khoangGrade(chipCapDo.split('(')[0]) : null; // phần trong ngoặc là cấp của một đoạn
		if (chipCapDo && kGrade && String(kChip) !== String(kGrade))
			loi.push(`${goc}: chip cấp độ "${chipCapDo}" không khớp grade "${r.grade}"`);
		const dongTacGia = (r.thong_tin ?? []).find(([muc]) => muc === 'Nhà soạn nhạc')?.[1];
		const tg = nguoi.get(r.tac_gia);
		const dongTen = dongTacGia?.replace(/^Gán cho /, '');
		if (dongTen && tg && ![tg.ten, ...(tg.cach_viet_khac ?? [])].some((t) => dongTen.startsWith(t)))
			loi.push(`${goc}: dòng "Nhà soạn nhạc" của thong_tin không mở đầu bằng tên ${tg.ten} (tac_gia "${r.tac_gia}")`);
		// Năm sinh–mất chép trong bảng thông tin phải khớp nha-soan-nhac.yml
		for (const [muc, noiDung] of r.thong_tin ?? []) {
			for (const p of nguoi.values()) {
				if (p.sinh === undefined) continue;
				for (const ten of [p.ten, ...(p.cach_viet_khac ?? [])]) {
					const m = noiDung.match(new RegExp(`${ten.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\((\\d{3,4})[–-](\\d{3,4})\\)`));
					if (m && (Number(m[1]) !== p.sinh || Number(m[2]) !== p.mat))
						loi.push(`${goc}: thong_tin "${muc}" ghi ${ten} (${m[1]}–${m[2]}), nha-soan-nhac.yml ghi ${p.sinh}–${p.mat}`);
				}
			}
		}
	}
	return loi;
}

let daNap; // kiểm một lần cho mọi bộ trong cùng một lần build
function napTatCa(dir) {
	if (!daNap || daNap.dir !== dir) daNap = { dir, ...kiemTra(dir) };
	if (daNap.loi.length)
		throw new Error(`Dữ liệu trong ${path.relative(process.cwd(), dir) || '.'} sai (${daNap.loi.length} lỗi):\n- ${daNap.loi.join('\n- ')}`);
	return daNap.duLieu;
}

/** Toàn bộ dữ liệu đã qua schema và kiểm chéo, cho plugin Markdown (src/plugins/); dữ liệu sai thì ném lỗi. */
export const duLieuDaKiem = () => napTatCa(thuMuc());

/** Slug của mọi tác phẩm, cho trường tac_pham ở frontmatter (src/content.config.ts). */
export function slugTacPham() {
	return new Set(napTatCa(thuMuc())['tac-pham'].map((r) => r.slug));
}

/** Bộ nạp (loader) Astro cho một bộ dữ liệu: dữ liệu sai thì ném lỗi, build hỏng. */
export function boNap(ten) {
	return {
		name: `opus-du-lieu-${ten}`,
		load: async ({ store, parseData, watcher, logger }) => {
			const dir = thuMuc();
			const nap = async (lai) => {
				if (lai) daNap = undefined;
				const duLieu = napTatCa(dir);
				store.clear();
				for (const r of duLieu[ten]) {
					const id = khoa(ten, r);
					store.set({ id, data: await parseData({ id, data: r }) });
				}
			};
			await nap(false);
			watcher?.add(path.join(dir, TEP[ten]));
			// Đang chạy npm run dev mà file dữ liệu hỏng: báo lỗi, giữ dữ liệu cũ đến khi file sửa xong
			watcher?.on('change', (f) => f === path.join(dir, TEP[ten]) && nap(true).catch((e) => logger.error(e.message)));
		},
	};
}

/**
 * File mã mà HTML đã dựng của trang phụ thuộc: schema, bản build và khóa (src/khoa.mjs), danh sách trang trong bản
 * build (src/ban-build.mjs), mọi plugin trong src/plugins/ (thêm plugin thì tự tính) và mọi hình tĩnh
 * src/components/hinh/*.html (::hinh chèn nguyên file lúc dựng; mo/d5-hinh: sửa hình mà trang giữ HTML cũ).
 */
export const tepDauVet = () => [
	'src/du-lieu.mjs',
	'src/ban-build.mjs',
	'src/khoa.mjs',
	...fs.readdirSync(path.join(GOC, 'src/plugins')).sort().map((f) => `src/plugins/${f}`),
	// module của src/scripts/ mà plugin dùng lúc build (chữ dựng sẵn của công cụ, hình vẽ): sửa thì trang phải dựng lại
	...fs.readdirSync(path.join(GOC, 'src/scripts')).filter((f) => /\.m?js$/.test(f)).sort().map((f) => `src/scripts/${f}`),
	...fs.readdirSync(path.join(GOC, 'src/components/hinh')).filter((f) => f.endsWith('.html')).sort().map((f) => `src/components/hinh/${f}`),
];

/**
 * Dấu vết của những gì HTML đã dựng của trang phụ thuộc, ngoài chính trang: dữ liệu, các file ở tepDauVet(), bản build
 * (thật hay xem), khóa và danh sách trang trong bản build.
 */
export function dauVet() {
	const h = createHash('sha256');
	for (const tep of Object.values(TEP)) {
		const f = path.join(thuMuc(), tep);
		h.update(fs.existsSync(f) ? fs.readFileSync(f) : `không có ${tep}`);
	}
	for (const f of tepDauVet()) h.update(fs.readFileSync(path.join(GOC, f)));
	// bản build (thật hay xem), khóa và danh sách trang trong bản build: thêm hay khóa trang thì link "sắp có" ở trang khác
	// thành link (src/plugins/sap-co.mjs)
	h.update(ban());
	h.update(JSON.stringify(docKhoa()));
	h.update(trangTrongBan().join('\n'));
	return h.digest('hex');
}

/**
 * Bọc bộ nạp trang (docsLoader của Starlight). Astro giữ HTML đã dựng của trang giữa các lần build và chỉ dựng lại trang
 * có file đổi; chỉ thị (::hop-tac-pham…) lấy chữ từ src/data/ lúc dựng, nên dữ liệu hay plugin đổi mà trang không đổi
 * thì trang vẫn mang HTML cũ. Ở đây: dấu vết khác lần trước thì xóa bộ nhớ đệm của trang, dựng lại hết.
 * Đang chạy npm run dev mà sửa src/data/, hay thêm, xóa trang: khởi động lại npm run dev để chỉ thị và link "sắp có"
 * cập nhật.
 */
export function dungLaiKhiDoi(loader) {
	return {
		...loader,
		load: async (ctx) => {
			const moi = dauVet();
			if (ctx.meta.get('opus-du-lieu') !== moi) {
				ctx.store.clear();
				ctx.meta.set('opus-du-lieu', moi);
			}
			await loader.load(ctx);
		},
	};
}
