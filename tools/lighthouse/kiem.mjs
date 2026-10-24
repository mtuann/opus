// Đo Lighthouse (chế độ điện thoại, mạng chậm mô phỏng như mặc định) ở tối đa ba trang của dist/, mỗi trang LH_LAN lần
// (mặc định 3), và kiểm luật 7 của kế hoạch: hiệu năng (trung vị) từ 95; trợ năng, thực hành tốt, SEO đều 100.
// Không đạt thì thoát 1: CI không đăng site. In bảng kết quả như các báo cáo.
//   npm run lighthouse                                        (sau npm run build hay npm run build:xem)
//   LH_TRANG="piano/tac-pham/fur-elise/,404.html" LH_LAN=5 npm run lighthouse
// Trang mặc định: trang chủ, rồi trang mẫu của bản build (tools/trang-mau.mjs: trang đã đổi trên nhánh trước, rồi mỗi
// loại khối một trang), tối đa ba trang. Lighthouse quá 240 s thì ghi lỗi, không treo. Chrome: bản Chromium của Playwright (npx playwright install chromium), hay
// CHROME_PATH nếu đặt. Máy chủ: tools/may-chu.mjs qua HTTP/2 như GitHub Pages.
import { execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import { moMayChu } from '../may-chu.mjs';
import { trangMau } from '../trang-mau.mjs';

const DIST = path.resolve('dist');
// trang chủ, rồi trang mẫu của bản build (trang đã đổi trên nhánh trước, rồi mỗi loại khối một trang), trang 404 nếu
// còn chỗ; tối đa ba trang
const mau = trangMau(DIST);
const TRANG = process.env.LH_TRANG ? process.env.LH_TRANG.split(',') : [...mau.filter((t) => t !== '404.html'), ...mau.filter((t) => t === '404.html')].slice(0, 3);
const LAN = Number(process.env.LH_LAN || 3);
const NGUONG = { perf: 95, a11y: 100, bp: 100, seo: 100 };
const TEN = { perf: 'hiệu năng', a11y: 'trợ năng', bp: 'thực hành tốt', seo: 'SEO' };

const trungVi = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const giay = (ms) => (ms / 1000).toFixed(1).replace('.', ',') + ' s';
// JSON từng lần: thư mục LH_RA (CI tải lên khi hỏng), không thì một thư mục tạm
const ra = process.env.LH_RA ? (fs.mkdirSync(process.env.LH_RA, { recursive: true }), path.resolve(process.env.LH_RA)) : fs.mkdtempSync(path.join(os.tmpdir(), 'opus-lighthouse-'));
const chrome = process.env.CHROME_PATH || chromium.executablePath();
// Dấu riêng trên dòng lệnh của Chrome mà Lighthouse mở (Chrome bỏ qua cờ lạ): Lighthouse bị dừng giữa chừng thì Chrome
// còn sót, chạy tiếp trang đang đo; tìm theo dấu này để dọn
const dau = `--opus-lighthouse=${process.pid}`;
const don = () => {
	try {
		execFileSync('pkill', ['-f', '--', dau], { stdio: 'ignore' });
	} catch {} // không còn tiến trình nào: pkill thoát 1
};
const co = `--headless=new --ignore-certificate-errors ${dau}` + (process.env.CI ? ' --no-sandbox' : '');

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
			// chạy bất đồng bộ: máy chủ ở ngay tiến trình này phải còn trả lời được Lighthouse. Quá 240 s thì Lighthouse bị
			// dừng: ghi lỗi, bỏ các lần còn lại của trang (Chrome có thể còn sót, giữ kết nối: máy chủ cắt khi đóng)
			try {
				await promisify(execFile)(
					'npx',
					['--no-install', 'lighthouse', goc + trang, '--only-categories=performance,accessibility,best-practices,seo',
						'--output=json', `--output-path=${file}`, `--chrome-flags=${co}`, '--quiet'],
					{ timeout: 240000, env: { ...process.env, CHROME_PATH: chrome } },
				);
			} catch (e) {
				don();
				const lyDo = e.killed ? 'quá 240 s' : (String(e.stderr ?? '').trim().split('\n').at(-1) || e.message.split('\n')[0]);
				loi.push(`${trang || '(trang chủ)'}: Lighthouse không chạy xong (${lyDo})`);
				break;
			}
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
		if (!lan.length) continue;
		const tv = (k) => trungVi(lan.map((x) => x[k]));
		console.log(
			`| ${trang || '(trang chủ)'} | ${tv('perf')} (${lan.map((x) => x.perf).join('/')}) | ${tv('a11y')} | ${tv('bp')} | ${tv('seo')} | ` +
				`${giay(tv('fcp'))} | ${giay(tv('lcp'))} | ${Math.round(tv('tbt'))} ms | ${tv('cls').toFixed(3).replace('.', ',')} | ${Math.round(tv('tai') / 1024)} KiB |`,
		);
		for (const [k, n] of Object.entries(NGUONG)) if (tv(k) < n) loi.push(`${trang || '(trang chủ)'}: ${TEN[k]} ${tv(k)}, cần từ ${n}`);
	}
} finally {
	don();
	await dong();
}
console.log(`JSON từng lần: ${ra}`);
if (loi.length) console.error(`Không đạt luật 7 của kế hoạch:\n- ${loi.join('\n- ')}`);
// thoát ngay, không chờ thứ gì còn treo (như Chrome còn sót sau khi Lighthouse bị dừng)
process.exit(loi.length ? 1 : 0);
