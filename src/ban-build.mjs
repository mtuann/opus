// Trang nào có trong bản build hiện tại (D1.5): link tới trang không có thì hiện chữ "sắp có" (src/plugins/sap-co.mjs).
// Hiện mọi trang trong src/content/docs/ đều vào bản build; D1.6 tách bản thật (chỉ trang đã khóa) và bản xem.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = fileURLToPath(new URL('./content/docs/', import.meta.url));

/** Đường dẫn các trang trong bản build, như "nhac-ly/10-hop-am-ba", "nhac-ly/index", "index"; không tính trang 404. */
export function trangTrongBan() {
	return fs
		.readdirSync(DOCS, { recursive: true })
		.filter((f) => /\.mdx?$/.test(f))
		.map((f) => f.replace(/\\/g, '/').replace(/\.mdx?$/, ''))
		.filter((t) => t !== '404')
		.sort();
}

/**
 * Trang (trong `trang`, dạng trangTrongBan) mà địa chỉ `diaChi` (/opus/x/y/#muc) trỏ tới, hay undefined nếu không có.
 * Địa chỉ không thuộc site (không bắt đầu bằng `base`) hay trỏ tới file (có đuôi như .txt) cũng trả về undefined.
 */
export function trangCuaDiaChi(diaChi, base, trang) {
	if (!diaChi.startsWith(base)) return undefined;
	const p = decodeURI(diaChi.slice(base.length).split(/[?#]/)[0]).replace(/\/$/, '');
	if (/\.[a-z0-9]+$/i.test(p)) return undefined;
	return [p || 'index', `${p}/index`].find((t) => trang.includes(t));
}
