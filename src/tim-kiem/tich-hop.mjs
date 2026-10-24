// Integration của Astro (D1.8): sau khi Starlight dựng chỉ mục Pagefind (hook astro:build:done của Starlight, chạy
// trước vì Starlight đứng trước trong astro.config.mjs), đổi tên dist/pagefind/pagefind.js thành pagefind-goc.js và
// đặt bản bọc (src/tim-kiem/pagefind.js, boc.js, bien-the.js) vào chỗ đó: gõ "d" thay "đ" vẫn tìm ra.
//
// Trước khi bọc, kiểm chỉ mục đủ: Starlight gọi pagefind.close() ngay khi Pagefind báo đã ghi xong, mà close() dừng
// tiến trình ghi, nên có lần file ghi dở nằm lại rỗng (lần đăng site 9498fb2: pagefind-entry.json rỗng, ô tìm kiếm báo
// "Failed to load Pagefind metadata"). Thiếu thì dựng lại chỉ mục, chờ ghi xong mới đóng; vẫn thiếu thì build hỏng.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as pagefind from 'pagefind';

const NGUON = new URL('./', import.meta.url);
const LAN_DUNG_LAI = 2;

/** Mọi file trong thư mục (đệ quy). */
const moiFile = (thuMuc) => fs.readdirSync(thuMuc, { recursive: true }).map((f) => path.join(thuMuc, f)).filter((f) => fs.statSync(f).isFile());

/**
 * Chỗ thiếu của chỉ mục Pagefind ở thư mục `pf` (đường dẫn): có pagefind.js; pagefind-entry.json đọc được, có ít nhất
 * một ngôn ngữ và file pf_meta của từng ngôn ngữ; không file nào rỗng. Trả về danh sách chỗ thiếu (rỗng là đủ). Dùng lại
 * trong tests/tim-kiem.test.mjs.
 */
export function thieuChiMuc(pf) {
	if (!fs.existsSync(pf)) return ['không có thư mục pagefind/'];
	const thieu = [];
	if (!fs.existsSync(path.join(pf, 'pagefind.js'))) thieu.push('không có pagefind.js');
	try {
		const entry = JSON.parse(fs.readFileSync(path.join(pf, 'pagefind-entry.json'), 'utf8'));
		const ngonNgu = Object.values(entry.languages ?? {});
		if (!ngonNgu.length) thieu.push('pagefind-entry.json không có ngôn ngữ nào');
		for (const { hash } of ngonNgu) if (!fs.existsSync(path.join(pf, `pagefind.${hash}.pf_meta`))) thieu.push(`không có pagefind.${hash}.pf_meta`);
	} catch (e) {
		thieu.push(`pagefind-entry.json không đọc được (${e.message})`);
	}
	for (const f of moiFile(pf)) if (fs.statSync(f).size === 0) thieu.push(`${path.relative(pf, f)} rỗng`);
	return thieu;
}

/** Dựng lại chỉ mục như Starlight làm (src/integrations/pagefind.ts của Starlight), nhưng chờ file ghi đủ rồi mới đóng. */
async function dungLai(dir, pf) {
	try {
		const { index, errors } = await pagefind.createIndex();
		if (errors.length) throw new Error(errors.join('; '));
		const them = await index.addDirectory({ path: fileURLToPath(dir) });
		if (them.errors.length) throw new Error(them.errors.join('; '));
		const ghi = await index.writeFiles({ outputPath: pf });
		if (ghi.errors.length) throw new Error(ghi.errors.join('; '));
		for (let i = 0; i < 100 && thieuChiMuc(pf).length; i++) await new Promise((ok) => setTimeout(ok, 100));
	} finally {
		await pagefind.close();
	}
}

export function timKiemKhongDau() {
	return {
		name: 'opus-tim-kiem',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const pf = new URL('./pagefind/', dir);
				const thuMuc = fileURLToPath(pf);
				if (!fs.existsSync(thuMuc)) return logger.warn('không có dist/pagefind/ (Starlight không dựng chỉ mục): chưa bọc ô tìm kiếm');
				for (let lan = 1; thieuChiMuc(thuMuc).length; lan++) {
					const thieu = thieuChiMuc(thuMuc);
					if (lan > LAN_DUNG_LAI) throw new Error(`chỉ mục Pagefind vẫn thiếu sau ${LAN_DUNG_LAI} lần dựng lại: ${thieu.join('; ')}`);
					logger.warn(`chỉ mục Pagefind thiếu (${thieu.join('; ')}): dựng lại, lần ${lan}`);
					await dungLai(dir, thuMuc);
				}
				const goc = fileURLToPath(new URL('pagefind.js', pf));
				fs.renameSync(goc, fileURLToPath(new URL('pagefind-goc.js', pf)));
				for (const f of ['pagefind.js', 'boc.js', 'bien-the.js']) fs.copyFileSync(fileURLToPath(new URL(f, NGUON)), fileURLToPath(new URL(f, pf)));
				logger.info('đã bọc pagefind.js: gõ "d" thay "đ" vẫn tìm ra');
			},
		},
	};
}
