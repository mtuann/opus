// Integration của Astro (D1.8): sau khi Starlight dựng chỉ mục Pagefind (hook astro:build:done của Starlight, chạy
// trước vì Starlight đứng trước trong astro.config.mjs), đổi tên dist/pagefind/pagefind.js thành pagefind-goc.js và
// đặt bản bọc (src/tim-kiem/pagefind.js, boc.js, bien-the.js) vào chỗ đó: gõ "d" thay "đ" vẫn tìm ra.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const NGUON = new URL('./', import.meta.url);

export function timKiemKhongDau() {
	return {
		name: 'opus-tim-kiem',
		hooks: {
			'astro:build:done': ({ dir, logger }) => {
				const pf = new URL('./pagefind/', dir);
				const goc = fileURLToPath(new URL('pagefind.js', pf));
				if (!fs.existsSync(goc)) return logger.warn('không có pagefind/pagefind.js: chưa bọc ô tìm kiếm');
				fs.renameSync(goc, fileURLToPath(new URL('pagefind-goc.js', pf)));
				for (const f of ['pagefind.js', 'boc.js', 'bien-the.js']) fs.copyFileSync(fileURLToPath(new URL(f, NGUON)), fileURLToPath(new URL(f, pf)));
				logger.info('đã bọc pagefind.js: gõ "d" thay "đ" vẫn tìm ra');
			},
		},
	};
}
