#!/usr/bin/env node
// Chép hình tĩnh của site cũ (vùng <!-- fig:tên --> … <!-- /fig:tên --> trong ../opus-zero/docs/, SVG do hook cũ sinh)
// thành src/components/hinh/<tên>.html, để ::hinh{ten="<tên>"} chèn nguyên hình lúc build (src/plugins/thanh-phan.mjs).
// Giữ nguyên chữ, hình và tên cho máy đọc màn hình; đổi cho hợp site mới:
//   - bỏ xmlns và font-family (chữ theo phông của site);
//   - màu đậm viết cứng (xanh mực, xanh lá, vàng nhựa thông, đỏ, xám, nâu gỗ) thành biến --oz-h-* (thanh-phan.css), có bản tối;
//     màu nền sáng (ô, phím tô màu) và chữ tối #1b1b1b trên nền ấy giữ nguyên vì đọc được ở cả hai chế độ;
//   - thẻ có nhiều style (fill và stroke cùng đổi) gộp làm một;
//   - <figure> thêm not-content và data-sinh (so chữ với site cũ bỏ qua, như vùng hình cũ).
//   node src/components/hinh/chuyen-hinh-cu.mjs <tên> […]  (chạy ở gốc repo, cần ../opus-zero/)
import fs from 'node:fs';
import path from 'node:path';

const GOC = path.resolve(import.meta.dirname, '../../..');
const CU = path.resolve(GOC, '../opus-zero/docs');

/** Màu viết cứng của hình cũ -> biến màu của site mới. */
export const MAU = {
	'#2f5582': 'var(--oz-h-xanh)',
	'#2e7d4f': 'var(--oz-h-luc)',
	'#b5832a': 'var(--oz-h-vang)',
	'#b3412e': 'var(--oz-h-do)',
	'#999': 'var(--oz-h-nhat)',
	// gỗ và viền nâu của hình tư thế, thế tay, số ngón (D4-L1): chế độ tối sáng hơn, kẻo chân đàn, gầm phím chìm vào nền
	'#5b4636': 'var(--oz-h-go)',
	'#8a6a55': 'var(--oz-h-nau)',
};

export function chuyenHinh(html) {
	return html
		.replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '')
		.replace(/ font-family="[^"]*"/g, '')
		.replace(/<figure class="oz-figure">/g, '<figure class="oz-figure not-content" data-sinh>')
		.replace(/ (fill|stroke)="(#[0-9a-f]{3,6})"/gi, (m, thuoc, mau) => (MAU[mau.toLowerCase()] ? ` style="${thuoc}:${MAU[mau.toLowerCase()]}"` : m))
		.replace(/<[a-z][^>]*>/gi, gopStyle);
}

/** Thẻ có cả fill và stroke đổi thành biến thì có hai thuộc tính style (trình duyệt chỉ đọc cái đầu): gộp làm một. */
function gopStyle(the) {
	const ds = [...the.matchAll(/ style="([^"]*)"/g)].map((m) => m[1]);
	if (ds.length < 2) return the;
	let mot = false;
	return the.replace(/ style="[^"]*"/g, () => (mot ? '' : ((mot = true), ` style="${ds.join(';')}"`)));
}

function tim(ten) {
	const mo = `<!-- fig:${ten} -->`;
	for (const f of fs.readdirSync(CU, { recursive: true }).filter((x) => x.endsWith('.md'))) {
		const s = fs.readFileSync(path.join(CU, f), 'utf8');
		const i = s.indexOf(mo);
		if (i < 0) continue;
		const j = s.indexOf(`<!-- /fig:${ten} -->`, i);
		return s.slice(i + mo.length, j).trim();
	}
	throw new Error(`không thấy vùng fig:${ten} trong ${CU}`);
}

if (import.meta.main) {
	for (const ten of process.argv.slice(2)) {
		const ra = path.join(import.meta.dirname, `${ten}.html`);
		fs.writeFileSync(ra, chuyenHinh(tim(ten)) + '\n');
		console.log(`đã ghi ${path.relative(GOC, ra)}`);
	}
}
