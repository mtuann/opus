#!/usr/bin/env node
// Ảnh chụp trang cho review (quyết định ngày 24/10/2026: ảnh do CI chụp, không commit vào repo; báo cáo của lô chỉ giữ
// tối đa 4 ảnh tiêu biểu). Chụp mọi trang nhánh đang làm đã đổi so với main, cộng các trang mẫu (tools/trang-mau.mjs), ở
// 360 px (cảm ứng) và 1280 px, cả trang, sau khi các khối (khuông, câu hỏi, khối nghe) đã dựng. test.yml chạy script này
// sau kiểm thử và lưu thư mục ảnh thành tệp của lần chạy (artifact "anh-chup", giữ 7 ngày). Một trang chụp hỏng thì bỏ qua
// trang ấy (ghi ra log), không làm hỏng cả lần chạy: ảnh chỉ để xem, kiểm thử trình duyệt mới là phép kiểm.
//   node tools/chup-anh.mjs [thư mục ra, mặc định anh-chup]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { cuonHet } from '../tests/trinh-duyet/chung.mjs';
import { moMayChu } from './may-chu.mjs';
import { fileCua, trangDaDoi, trangMau } from './trang-mau.mjs';

const GOC = fileURLToPath(new URL('../', import.meta.url));
const DIST = path.join(GOC, 'dist');
const RA = path.resolve(process.argv[2] ?? 'anh-chup');
const CO = [
	{ ten: '360', w: 360, h: 780, camUng: true },
	{ ten: '1280', w: 1280, h: 800, camUng: false },
];

const trang = [...new Set([...trangDaDoi(GOC).filter((t) => fs.existsSync(fileCua(DIST, t))), ...trangMau(DIST, GOC)])];
fs.mkdirSync(RA, { recursive: true });
const mayChu = await moMayChu({ thuMuc: DIST });
const trinhDuyet = await chromium.launch();
try {
	for (const co of CO) {
		const ctx = await trinhDuyet.newContext({ viewport: { width: co.w, height: co.h }, hasTouch: co.camUng, isMobile: co.camUng });
		for (const t of trang) {
			const p = await ctx.newPage();
			try {
				await p.goto(mayChu.goc + t, { waitUntil: 'load' });
				await cuonHet(p).catch(() => {}); // khối chưa dựng xong thì vẫn chụp: kiểm thử trình duyệt đã báo lỗi ấy
				await p.evaluate(() => document.fonts.ready);
				const ten = (t.replace(/\.html$/, '').replace(/\/$/, '').replace(/\//g, '--') || 'trang-chu') + `-${co.ten}.jpg`;
				await p.screenshot({ path: path.join(RA, ten), fullPage: true, type: 'jpeg', quality: 70 });
			} catch (e) {
				console.error(`không chụp được ${t || '(trang chủ)'} ở ${co.ten} px: ${e.message}`);
			} finally {
				await p.close();
			}
		}
		await ctx.close();
	}
} finally {
	await trinhDuyet.close();
	await mayChu.dong();
}
console.log(`đã chụp ${trang.length} trang × ${CO.length} cỡ vào ${path.relative(process.cwd(), RA) || RA}`);
