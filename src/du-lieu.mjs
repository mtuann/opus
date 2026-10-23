// Lớp dữ liệu của site (plans/ben-vung/README.md, mục "Lớp dữ liệu"): schema của năm bộ dữ liệu trong src/data/,
// các phép kiểm chéo giữa chúng, và bộ nạp cho content collections của Astro (src/content.config.ts).
// Dữ liệu sai (YAML hỏng, sai kiểu, trường lạ, trùng id, tham chiếu tới thứ không có) thì ném lỗi, nên build hỏng.
// Kiểm thử dùng thẳng kiemTra() trên bộ dữ liệu hỏng mẫu trong tests/du-lieu-hong/.
// Biến môi trường OPUS_DU_LIEU đổi thư mục dữ liệu (mặc định src/data), để thử build với bộ dữ liệu khác.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { z } from 'astro/zod';

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
			cap: duongDan.optional(),
			ky_nang: z.array(idChu).optional(),
			goi_y: z.boolean().optional(),
			chip: z.array(z.union([chu, z.object({ cap_do: chu }).strict()])).optional(),
			thong_tin: z.array(z.tuple([chu, chu])).optional(),
			hinh: z.record(z.string(), z.unknown()).optional(),
			ban_thu: z.array(z.unknown()).optional(),
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

/** Thư mục dữ liệu: OPUS_DU_LIEU hay src/data, tính từ thư mục gốc của dự án (chỗ chạy npm). */
export function thuMuc(goc = process.cwd()) {
	return path.resolve(goc, process.env.OPUS_DU_LIEU || 'src/data');
}

const tiengViet = { error: z.locales.vi().localeError }; // lời báo lỗi của Zod bằng tiếng Việt

/**
 * Đọc và kiểm toàn bộ dữ liệu trong `dir`. Trả về { duLieu, loi }: duLieu[ten] là mảng bản ghi đã qua schema,
 * loi là danh sách lỗi (chuỗi), rỗng khi dữ liệu đúng.
 */
export function kiemTra(dir = thuMuc()) {
	const loi = [];
	const duLieu = {};
	for (const [ten, tep] of Object.entries(TEP)) {
		const file = path.join(dir, tep);
		duLieu[ten] = [];
		let tho;
		try {
			tho = parse(fs.readFileSync(file, 'utf8'));
		} catch (e) {
			loi.push(`${tep}: ${e.code === 'ENOENT' ? 'không có file' : 'YAML hỏng: ' + e.message.split('\n')[0]}`);
			continue;
		}
		if (!Array.isArray(tho)) {
			loi.push(`${tep}: phải là một danh sách bản ghi`);
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
	loi.push(...kiemTraCheo(duLieu));
	return { duLieu, loi };
}

/** Kiểm giữa các bộ dữ liệu: tham chiếu tới thứ có thật, chặng liền nhau, năm sinh–mất chép lại phải khớp. */
function kiemTraCheo(d) {
	const loi = [];
	const nguoi = new Map(d['nha-soan-nhac'].map((r) => [r.id, r]));
	const chang = new Set(d['cap-do'].map((r) => r.id));
	const trang = new Map(d.trang.map((r) => [r.id, r]));

	const cd = [...d['cap-do']].sort((a, b) => a.id - b.id);
	cd.forEach((r, i) => {
		if (r.id !== i + 1) loi.push(`cap-do.yml: chặng phải đánh số liền từ 1 (thấy ${r.id} ở vị trí ${i + 1})`);
		if (r.grade_tu > r.grade_den) loi.push(`cap-do.yml: chặng ${r.id}: grade_tu lớn hơn grade_den`);
		if (i > 0 && r.grade_tu !== cd[i - 1].grade_den + 1)
			loi.push(`cap-do.yml: chặng ${r.id}: grade_tu phải bằng grade_den của chặng trước cộng 1`);
	});

	for (const r of d['tac-pham']) {
		const goc = `tac-pham.yml: bản ghi "${r.slug}"`;
		if (r.tac_gia && !nguoi.has(r.tac_gia)) loi.push(`${goc}: tac_gia "${r.tac_gia}" không có trong nha-soan-nhac.yml`);
		if (r.chang !== undefined && !chang.has(r.chang)) loi.push(`${goc}: chặng ${r.chang} không có trong cap-do.yml`);
		const trangChinh = (r.loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + r.slug;
		if (trang.get(trangChinh)?.tang !== 'tac-pham')
			loi.push(`${goc}: trang ${trangChinh} không có trong trang.yml với tầng tac-pham`);
		if (r.cap) {
			if (!trang.has(r.cap)) loi.push(`${goc}: cap "${r.cap}" không có trong trang.yml`);
			if (!r.cap.startsWith(r.loai === 'bai-hoc' ? 'nghe-nhac/' : 'piano/tac-pham/'))
				loi.push(`${goc}: cap của ${r.loai === 'bai-hoc' ? 'bài học phải là hướng dẫn nghe' : 'hướng dẫn nghe phải là bài học'}`);
		}
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

/** Slug của mọi tác phẩm, cho trường tac_pham ở frontmatter (src/content.config.ts). */
export function slugTacPham() {
	return new Set(napTatCa(thuMuc())['tac-pham'].map((r) => r.slug));
}

/** Bộ nạp (loader) Astro cho một bộ dữ liệu: dữ liệu sai thì ném lỗi, build hỏng. */
export function boNap(ten) {
	return {
		name: `opus-du-lieu-${ten}`,
		load: async ({ store, parseData, watcher, config }) => {
			const dir = thuMuc(fileURLToPath(config.root));
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
			watcher?.on('change', (f) => f === path.join(dir, TEP[ten]) && nap(true));
		},
	};
}
