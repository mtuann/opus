// Khóa trang và bản ghi (D1.6; plans/ben-vung/chuan-kiem-dinh.md mục 6): mã băm, đọc kiem-dinh/khoa.json, kiểm mã băm
// lúc build, và bản build đang dựng (bản thật hay bản xem). Dùng chung cho bản build (src/content.config.ts,
// src/ban-build.mjs) và công cụ tools/khoa.mjs, để chỉ có một cách tính mã băm.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const GOC = fileURLToPath(new URL('../', import.meta.url));

/**
 * Bản build đang dựng: "that" (bản thật, mặc định: chỉ trang đã khóa) hay "xem" (bản xem: mọi trang, trang chưa khóa có
 * dải "Chưa kiểm định"). Đặt bằng biến môi trường OPUS_BAN (npm run build:xem, npm run dev).
 */
export const ban = () => (process.env.OPUS_BAN === 'xem' ? 'xem' : 'that');

const maBam = (chu) => 'sha256:' + createHash('sha256').update(chu).digest('hex');

/** Chuẩn hóa nguồn Markdown trước khi băm: xuống dòng kiểu \n, bỏ khoảng trắng cuối dòng, đúng một \n ở cuối file. */
export const chuanHoaTrang = (chu) =>
	chu
		.replace(/\r\n?/g, '\n')
		.split('\n')
		.map((l) => l.replace(/[ \t]+$/, ''))
		.join('\n')
		.replace(/\n*$/, '\n');

export const maBamTrang = (chu) => maBam(chuanHoaTrang(chu));

/** JSON của bản ghi với khóa xếp theo chữ cái ở mọi cấp, không khoảng trắng. */
export const jsonChuan = (x) =>
	JSON.stringify(x, (_, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) : v));

export const maBamBanGhi = (banGhi) => maBam(jsonChuan(banGhi));

/** Đường dẫn file của trang trong src/content/docs/ ("nhac-ly/index" -> …/nhac-ly/index.md). */
export const fileTrang = (trang, goc = GOC) => path.join(goc, 'src', 'content', 'docs', `${trang}.md`);

/** Bộ dữ liệu -> file trong src/data/; khóa của bản ghi là "<bộ>/<id>" (tac-pham dùng slug). */
const TEP_DU_LIEU = { 'cap-do': 'cap-do.yml', 'nha-soan-nhac': 'nha-soan-nhac.yml', 'tac-pham': 'tac-pham.yml', 'thuat-ngu': 'thuat-ngu.yml', trang: 'trang.yml' };

/** Bản ghi "<bộ>/<id>" đọc thẳng từ YAML (chưa qua schema), hay undefined. */
export function docBanGhi(khoaBanGhi, goc = GOC) {
	const [bo, ...phan] = khoaBanGhi.split('/');
	const id = phan.join('/');
	if (!TEP_DU_LIEU[bo]) return undefined;
	const ds = parse(fs.readFileSync(path.join(goc, 'src', 'data', TEP_DU_LIEU[bo]), 'utf8')) ?? [];
	return ds.find((r) => String(bo === 'tac-pham' ? r.slug : r.id) === id);
}

/** Nội dung kiem-dinh/khoa.json: { trang: { đường dẫn: mã băm }, ban_ghi: { "<bộ>/<id>": mã băm } }. */
export function docKhoa(goc = GOC) {
	const f = path.join(goc, 'kiem-dinh', 'khoa.json');
	const k = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
	return { trang: k.trang ?? {}, ban_ghi: k.ban_ghi ?? {} };
}

/**
 * Kiểm mọi mục đã khóa: trang và bản ghi phải còn, mã băm phải khớp. Trả về danh sách lỗi (chuỗi); rỗng là đạt.
 * Build gọi hàm này ở cả bản thật và bản xem (src/content.config.ts): lệch thì build hỏng.
 */
export function kiemKhoa(goc = GOC) {
	const { trang, ban_ghi } = docKhoa(goc);
	const loi = [];
	const cachMo = (muc) => `sửa theo thủ tục mở khóa: node tools/khoa.mjs mo ${muc} --ly-do "…" (plans/ben-vung/chuan-kiem-dinh.md mục 7)`;
	for (const [t, ma] of Object.entries(trang)) {
		const f = fileTrang(t, goc);
		if (!fs.existsSync(f)) loi.push(`trang ${t} đã khóa nhưng không còn file ${path.relative(goc, f)}`);
		else if (maBamTrang(fs.readFileSync(f, 'utf8')) !== ma) loi.push(`trang ${t} đã khóa mà nội dung đã đổi (mã băm lệch); ${cachMo(t)}`);
	}
	for (const [k, ma] of Object.entries(ban_ghi)) {
		const r = docBanGhi(k, goc);
		if (!r) loi.push(`bản ghi ${k} đã khóa nhưng không còn trong src/data/`);
		else if (maBamBanGhi(r) !== ma) loi.push(`bản ghi ${k} đã khóa mà đã đổi (mã băm lệch); ${cachMo(`du-lieu/${k}`)}`);
	}
	return loi;
}
