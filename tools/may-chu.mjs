// Máy chủ tĩnh cho kiểm thử trình duyệt và Lighthouse (D1.7): phục vụ dist/ dưới /opus/ như GitHub Pages, địa chỉ
// không có thì trả trang 404.html với mã 404, nén gzip, Cache-Control: max-age=600. Theo tools/lighthouse/serve.mjs
// của site cũ.
// Lighthouse cần HTTP/2 như GitHub Pages: qua HTTP/1.1, mọi file cùng nguồn chen nhau qua 6 kết nối, số đo sai. HTTP/2
// dùng chứng chỉ tự ký (openssl tạo trong thư mục tạm), nên Chrome cần cờ --ignore-certificate-errors.
//   node tools/may-chu.mjs [thư mục, mặc định dist] [cổng, mặc định 4321] [--http2]
import fs from 'node:fs';
import http from 'node:http';
import http2 from 'node:http2';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PREFIX = '/opus/';
const LOAI = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.webmanifest': 'application/manifest+json',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml',
	'.mp3': 'audio/mpeg',
	'.woff2': 'font/woff2',
	'.pf_meta': 'application/octet-stream',
	'.pf_fragment': 'application/octet-stream',
	'.pf_index': 'application/octet-stream',
	'.wasm': 'application/wasm',
	'.pagefind': 'application/octet-stream',
};
const CHU = /^(text\/|application\/(json|javascript|manifest\+json|xml)|image\/svg)/;

function chungChi() {
	const thu = path.join(os.tmpdir(), 'opus-may-chu');
	if (!fs.existsSync(path.join(thu, 'cert.pem'))) {
		fs.mkdirSync(thu, { recursive: true });
		execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '30', '-subj', '/CN=localhost',
			'-keyout', path.join(thu, 'key.pem'), '-out', path.join(thu, 'cert.pem')], { stdio: 'ignore' });
	}
	return { key: fs.readFileSync(path.join(thu, 'key.pem')), cert: fs.readFileSync(path.join(thu, 'cert.pem')) };
}

/**
 * Mở máy chủ; trả về { goc: "http(s)://localhost:<cổng>/opus/", dong() }. Cổng 0: hệ điều hành chọn cổng trống.
 * @param {{ thuMuc?: string, cong?: number, http2?: boolean }} tuyChon
 */
export function moMayChu({ thuMuc = 'dist', cong = 0, http2: h2 = false } = {}) {
	const goc = path.resolve(thuMuc);
	if (!fs.existsSync(path.join(goc, 'index.html'))) throw new Error(`Chưa có ${thuMuc}/index.html: chạy npm run build (hay build:xem) trước.`);
	const xuLy = (req, res) => {
		const url = decodeURIComponent(req.url.split('?')[0]);
		if (url === '/opus') {
			res.writeHead(301, { location: PREFIX });
			return res.end();
		}
		let file = path.join(goc, url.slice(PREFIX.length));
		if (!url.startsWith(PREFIX) || !file.startsWith(goc)) {
			res.writeHead(404);
			return res.end();
		}
		if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
		const coFile = fs.existsSync(file);
		if (!coFile) file = path.join(goc, '404.html');
		const loai = LOAI[path.extname(file)] || 'application/octet-stream';
		const dau = { 'content-type': loai, 'cache-control': 'max-age=600' };
		const than = fs.readFileSync(file);
		const ma = coFile ? 200 : 404;
		if (CHU.test(loai) && /gzip/.test(req.headers['accept-encoding'] || '')) {
			res.writeHead(ma, { ...dau, 'content-encoding': 'gzip', vary: 'Accept-Encoding' });
			return res.end(zlib.gzipSync(than, { level: 6 }));
		}
		res.writeHead(ma, dau);
		res.end(than);
	};
	const mayChu = h2 ? http2.createSecureServer({ ...chungChi(), allowHTTP1: true }, xuLy) : http.createServer(xuLy);
	return new Promise((ok) =>
		mayChu.listen(cong, () =>
			ok({
				goc: `${h2 ? 'https' : 'http'}://localhost:${mayChu.address().port}${PREFIX}`,
				dong: () => new Promise((xong) => mayChu.close(() => xong())),
			}),
		),
	);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
	const [thuMuc = 'dist', cong = '4321'] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
	const { goc } = await moMayChu({ thuMuc, cong: Number(cong), http2: process.argv.includes('--http2') });
	console.log(`Phục vụ ${thuMuc}/ tại ${goc}`);
}
