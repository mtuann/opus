// Máy chủ tĩnh cho kiểm thử trình duyệt và Lighthouse (D1.7): phục vụ dist/ dưới /opus/ như GitHub Pages, địa chỉ
// không có thì trả trang 404.html với mã 404, nén gzip, Cache-Control: max-age=600, Range (tua bản thu). Theo
// tools/lighthouse/serve.mjs của site cũ. Chỉ nghe trên máy này (127.0.0.1).
// Lighthouse cần HTTP/2 như GitHub Pages: qua HTTP/1.1, mọi file cùng nguồn chen nhau qua 6 kết nối, số đo sai. HTTP/2
// dùng chứng chỉ tự ký (openssl tạo trong thư mục tạm), nên Chrome cần cờ --ignore-certificate-errors.
//   node tools/may-chu.mjs [thư mục, mặc định dist] [cổng, mặc định 4400] [--http2]
import fs from 'node:fs';
import http from 'node:http';
import http2 from 'node:http2';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';

const PREFIX = '/opus/';
const MAY = '127.0.0.1';
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
 * Mở máy chủ; trả về { goc: "http(s)://127.0.0.1:<cổng>/opus/", dong() }. Cổng 0: hệ điều hành chọn cổng trống. dong()
 * cắt mọi kết nối còn mở (trình duyệt bị dừng giữa chừng vẫn giữ kết nối), nên không phải chờ.
 * @param {{ thuMuc?: string, cong?: number, http2?: boolean }} tuyChon
 */
export function moMayChu({ thuMuc = 'dist', cong = 0, http2: h2 = false } = {}) {
	const goc = path.resolve(thuMuc);
	if (!fs.existsSync(path.join(goc, 'index.html'))) throw new Error(`Chưa có ${thuMuc}/index.html: chạy npm run build (hay build:xem) trước.`);
	const xuLy = (req, res) => {
		let url;
		try {
			url = decodeURIComponent(req.url.split('?')[0]);
		} catch {
			res.writeHead(400);
			return res.end();
		}
		if (url === '/opus') {
			res.writeHead(301, { location: PREFIX });
			return res.end();
		}
		let file = path.join(goc, url.slice(PREFIX.length));
		// trong dist/ thôi: so cả dấu phân cách, để thư mục anh em như dist-x không lọt
		if (!url.startsWith(PREFIX) || (file !== goc && !file.startsWith(goc + path.sep))) {
			res.writeHead(404);
			return res.end();
		}
		if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
		const coFile = fs.existsSync(file);
		if (!coFile) file = path.join(goc, '404.html');
		const loai = LOAI[path.extname(file)] || 'application/octet-stream';
		const dau = { 'content-type': loai, 'cache-control': 'max-age=600', 'accept-ranges': 'bytes' };
		const than = fs.readFileSync(file);
		const ma = coFile ? 200 : 404;
		// Range (như GitHub Pages): trình nghe tua bản thu mp3
		const range = coFile && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
		if (range && (range[1] || range[2])) {
			const cuoi = range[1] ? Math.min(range[2] ? Number(range[2]) : than.length - 1, than.length - 1) : than.length - 1;
			const dauRa = range[1] ? Number(range[1]) : Math.max(than.length - Number(range[2]), 0);
			if (dauRa > cuoi) {
				res.writeHead(416, { 'content-range': `bytes */${than.length}` });
				return res.end();
			}
			res.writeHead(206, { ...dau, 'content-range': `bytes ${dauRa}-${cuoi}/${than.length}`, 'content-length': cuoi - dauRa + 1 });
			return res.end(than.subarray(dauRa, cuoi + 1));
		}
		if (CHU.test(loai) && /gzip/.test(req.headers['accept-encoding'] || '')) {
			res.writeHead(ma, { ...dau, 'content-encoding': 'gzip', vary: 'Accept-Encoding' });
			return res.end(zlib.gzipSync(than, { level: 6 }));
		}
		res.writeHead(ma, dau);
		res.end(than);
	};
	const mayChu = h2 ? http2.createSecureServer({ ...chungChi(), allowHTTP1: true }, xuLy) : http.createServer(xuLy);
	const ketNoi = new Set();
	mayChu.on('connection', (s) => {
		ketNoi.add(s);
		s.on('close', () => ketNoi.delete(s));
	});
	return new Promise((ok) =>
		mayChu.listen(cong, MAY, () =>
			ok({
				goc: `${h2 ? 'https' : 'http'}://${MAY}:${mayChu.address().port}${PREFIX}`,
				dong: () =>
					new Promise((xong) => {
						mayChu.close(() => xong());
						for (const s of ketNoi) s.destroy();
					}),
			}),
		),
	);
}

// import.meta.main: đúng cả khi đường dẫn script đi qua liên kết tượng trưng (/tmp trên macOS)
if (import.meta.main) {
	const [thuMuc = 'dist', cong = '4400'] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
	const { goc } = await moMayChu({ thuMuc, cong: Number(cong), http2: process.argv.includes('--http2') });
	console.log(`Phục vụ ${thuMuc}/ tại ${goc}`);
}
