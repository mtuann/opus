// Đo Lighthouse (chế độ điện thoại, mạng chậm mô phỏng như mặc định) ở tối đa ba trang của dist/, mỗi trang LH_LAN lần
// (mặc định 3), và kiểm luật 7 của kế hoạch: hiệu năng (trung vị) từ 95; trợ năng, thực hành tốt, SEO đều 100.
// Không đạt thì thoát 1: CI không đăng site. In bảng kết quả như các báo cáo.
//   npm run lighthouse                                        (sau npm run build hay npm run build:xem)
//   LH_TRANG="piano/tac-pham/fur-elise/,404.html" LH_LAN=5 npm run lighthouse
// Trang mặc định: trang chủ, rồi bài học Für Elise và hướng dẫn nghe Goldberg nếu dist/ có (bản xem, từ D1.8), không
// thì các trang thử khác hay trang 404. Chrome: bản Chromium của Playwright (npx playwright install chromium), hay
// CHROME_PATH nếu đặt. Máy chủ: tools/may-chu.mjs qua HTTP/2 như GitHub Pages.
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import { moMayChu } from '../may-chu.mjs';

const DIST = path.resolve('dist');
const UNG_VIEN = ['', 'piano/tac-pham/fur-elise/', 'nghe-nhac/bach-goldberg/', 'nhac-ly/10-hop-am-ba/', '404.html'];
const coTrang = (t) => fs.existsSync(path.join(DIST, t.endsWith('.html') ? t : path.join(t, 'index.html')));
const TRANG = process.env.LH_TRANG ? process.env.LH_TRANG.split(',') : UNG_VIEN.filter(coTrang).slice(0, 3);
const LAN = Number(process.env.LH_LAN || 3);
const NGUONG = { perf: 95, a11y: 100, bp: 100, seo: 100 };
const TEN = { perf: 'hiệu năng', a11y: 'trợ năng', bp: 'thực hành tốt', seo: 'SEO' };

const trungVi = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const giay = (ms) => (ms / 1000).toFixed(1).replace('.', ',') + ' s';
const ra = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-lighthouse-'));
const chrome = process.env.CHROME_PATH || chromium.executablePath();
const co = '--headless=new --ignore-certificate-errors' + (process.env.CI ? ' --no-sandbox' : '');

const { goc, dong } = await moMayChu({ thuMuc: DIST, http2: true });
const loi = [];
console.log(`Lighthouse, ${LAN} lần mỗi trang, ${goc}`);
console.log('| Trang | Hiệu năng | Trợ năng | Thực hành tốt | SEO | FCP | LCP | TBT | CLS | Tổng tải |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
try {
	for (const trang of TRANG) {
		const lan = [];
		for (let i = 1; i <= LAN; i++) {
			const file = path.join(ra, `${trang.replace(/\W+/g, '-') || 'trang-chu'}-${i}.json`);
			// chạy bất đồng bộ: máy chủ ở ngay tiến trình này phải còn trả lời được Lighthouse
			await promisify(execFile)(
				'npx',
				['--no-install', 'lighthouse', goc + trang, '--only-categories=performance,accessibility,best-practices,seo',
					'--output=json', `--output-path=${file}`, `--chrome-flags=${co}`, '--quiet'],
				{ timeout: 240000, env: { ...process.env, CHROME_PATH: chrome } },
			);
			const { audits: a, categories: c } = JSON.parse(fs.readFileSync(file, 'utf8'));
			lan.push({
				perf: Math.round(c.performance.score * 100),
				a11y: Math.round(c.accessibility.score * 100),
				bp: Math.round(c['best-practices'].score * 100),
				seo: Math.round(c.seo.score * 100),
				fcp: a['first-contentful-paint'].numericValue,
				lcp: a['largest-contentful-paint'].numericValue,
				tbt: a['total-blocking-time'].numericValue,
				cls: a['cumulative-layout-shift'].numericValue,
				tai: a['total-byte-weight'].numericValue,
			});
		}
		const tv = (k) => trungVi(lan.map((x) => x[k]));
		console.log(
			`| ${trang || '(trang chủ)'} | ${tv('perf')} (${lan.map((x) => x.perf).join('/')}) | ${tv('a11y')} | ${tv('bp')} | ${tv('seo')} | ` +
				`${giay(tv('fcp'))} | ${giay(tv('lcp'))} | ${Math.round(tv('tbt'))} ms | ${tv('cls').toFixed(3).replace('.', ',')} | ${Math.round(tv('tai') / 1024)} KiB |`,
		);
		for (const [k, n] of Object.entries(NGUONG)) if (tv(k) < n) loi.push(`${trang || '(trang chủ)'}: ${TEN[k]} ${tv(k)}, cần từ ${n}`);
	}
} finally {
	await dong();
}
console.log(`JSON từng lần: ${ra}`);
if (loi.length) {
	console.error(`Không đạt luật 7 của kế hoạch:\n- ${loi.join('\n- ')}`);
	process.exit(1);
}
