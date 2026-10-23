// Trang nào có trong bản build hiện tại. Bản thật (npm run build): chỉ trang đã khóa trong kiem-dinh/khoa.json (D1.6);
// bản xem (npm run build:xem, npm run dev): mọi trang trong src/content/docs/. Link tới trang không có trong bản build
// hiện chữ "sắp có" (src/plugins/sap-co.mjs).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ban, docKhoa } from './khoa.mjs';

const DOCS = fileURLToPath(new URL('./content/docs/', import.meta.url));

/** Mọi trang trong src/content/docs/, như "nhac-ly/10-hop-am-ba", "nhac-ly/index", "index", kể cả "404". */
export function tatCaTrang() {
	return fs
		.readdirSync(DOCS, { recursive: true })
		.filter((f) => /\.mdx?$/.test(f))
		.map((f) => f.replace(/\\/g, '/').replace(/\.mdx?$/, ''))
		.sort();
}

/** Trang trong bản build hiện tại (theo ban()), không tính trang 404. */
export function trangTrongBan() {
	const khoa = docKhoa().trang;
	return tatCaTrang().filter((t) => t !== '404' && (ban() === 'xem' || t in khoa));
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
