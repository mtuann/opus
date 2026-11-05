// Dùng khi mất mạng và cài như ứng dụng (D7-L3, thay docs/sw.js, docs/assets/js/pwa.js của site cũ):
// - sau khi build xong (astro:build:done, chạy sau Pagefind và sách in), ghi dist/sw.js: phiên bản là mã băm của danh
//   sách tệp trong dist/ cùng nội dung của chúng, nên mỗi bản build có nội dung khác là một phiên bản mới, và bản mới xóa
//   bộ nhớ đệm của bản cũ (không giữ trang cũ mãi);
// - script đăng ký (thẻ <script> trong <head>, astro.config.mjs) chỉ chạy khi isSecureContext (https, localhost);
// - manifest ở public/manifest.webmanifest (tên Opus, icon 192, 512 và maskable trong public/icons/).
// Cách lưu như sw.js cũ: trang lấy mạng trước, mất mạng thì dùng bản đã lưu (chưa có thì trang chủ đã lưu); tệp tĩnh lưu
// trước (dùng bản đã lưu ngay, tải lại ngầm); bỏ qua yêu cầu Range, âm thanh và video. Soundfont của abcjs
// (paulrosen.github.io) được lưu khi đã tải một lần (bao-cao/d7-chuan-bi.md): chưa nghe lần nào mà mất mạng thì khuông vẫn
// hiện, không có tiếng. Yêu cầu tới máy khác thì để trình duyệt tự tải.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Tiền tố tên bộ nhớ đệm: chỉ xóa bộ nhớ đệm của site này (cùng tên miền còn có site cũ, "opus-zero-v…"). */
export const TIEN_TO = 'opus-sw-';
/** Máy ngoài được lưu: soundfont của abcjs. */
export const MAY_NGOAI = ['https://paulrosen.github.io/midi-js-soundfonts/'];

/** Mọi tệp trong `dist` (đường dẫn tương đối, "/" ngăn cách, theo thứ tự chữ cái), trừ sw.js. */
export function danhSachTep(dist) {
	return fs
		.readdirSync(dist, { recursive: true })
		.map((f) => f.replace(/\\/g, '/'))
		.filter((f) => f !== 'sw.js' && fs.statSync(path.join(dist, f)).isFile())
		.sort();
}

/** Phiên bản: 12 ký tự đầu mã băm SHA-256 của danh sách tệp kèm mã băm nội dung từng tệp. */
export function phienBan(dist, tep = danhSachTep(dist)) {
	const h = crypto.createHash('sha256');
	for (const f of tep) h.update(`${f}\0${crypto.createHash('sha256').update(fs.readFileSync(path.join(dist, f))).digest('hex')}\n`);
	return h.digest('hex').slice(0, 12);
}

/**
 * Tệp lưu sẵn khi cài: trang chủ cùng CSS, JavaScript (cả module nó nạp sau, như ô gợi ý tập) và font nó dùng, để mở lại
 * trang chủ khi mất mạng, kể cả khi mới xem một trang khác; trang 404, manifest và icon. Chỉ tệp có trong `dist` (cài
 * hỏng khi một tệp không tải được).
 */
export function tepLuuSan(dist, base = '/opus/') {
	const ra = [base];
	const chu = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
	for (const m of chu.matchAll(/\s(?:href|src)="([^"#?]+)"/g)) {
		const u = m[1];
		if (u.startsWith(`${base}_astro/`) || (u.startsWith(`${base}fonts/`) && u.endsWith('.woff2'))) ra.push(u);
	}
	// module JavaScript nạp từ module khác (import "./x.js", import("./x.js")): cùng thư mục _astro/
	for (let i = 0; i < ra.length; i++) {
		const u = ra[i];
		if (!u.startsWith(`${base}_astro/`) || !u.endsWith('.js')) continue;
		const f = path.join(dist, u.slice(base.length));
		if (!fs.existsSync(f)) continue;
		for (const m of fs.readFileSync(f, 'utf8').matchAll(/["'`]\.\/([\w.-]+\.(?:js|css))["'`]/g)) {
			const con = `${base}_astro/${m[1]}`;
			if (!ra.includes(con)) ra.push(con);
		}
	}
	for (const f of ['404.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png']) if (fs.existsSync(path.join(dist, f))) ra.push(base + f);
	return [...new Set(ra)].filter((u) => u === base || fs.existsSync(path.join(dist, decodeURI(u.slice(base.length)))));
}

/** Mã của service worker cho phiên bản `phien` và danh sách lưu sẵn `luuSan`. */
export function maSw({ phien, luuSan, base = '/opus/' }) {
	return `/* Service worker của Opus, sinh lúc build (src/ung-dung/ung-dung.mjs): đừng sửa tay. */
const PHIEN = ${JSON.stringify(TIEN_TO + phien)};
const GOC = ${JSON.stringify(base)};
const LUU_SAN = ${JSON.stringify(luuSan)};
const MAY_NGOAI = ${JSON.stringify(MAY_NGOAI)};

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(PHIEN).then((c) => c.addAll(LUU_SAN)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith(${JSON.stringify(TIEN_TO)}) && k !== PHIEN).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const laTrang = (r) => r.mode === "navigate" || (r.headers.get("accept") || "").includes("text/html");

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const cungSite = u.origin === self.location.origin && u.pathname.startsWith(GOC);
  if (!cungSite && !MAY_NGOAI.some((m) => r.url.startsWith(m))) return;
  // âm thanh, video và yêu cầu theo đoạn (Range): trình duyệt tự tải, không lưu
  if (r.headers.has("range") || r.destination === "audio" || r.destination === "video") return;
  if (cungSite && laTrang(r)) {
    // trang: bản mới từ mạng, mất mạng thì bản đã lưu, chưa có thì trang chủ đã lưu
    e.respondWith(
      caches.open(PHIEN).then((c) =>
        fetch(r)
          .then((res) => {
            if (res.ok) c.put(r, res.clone());
            return res;
          })
          .catch(() => c.match(r, { ignoreSearch: true }).then((hit) => hit || c.match(GOC)))
      )
    );
    return;
  }
  // tệp tĩnh: bản đã lưu ngay, tải lại ngầm
  e.respondWith(
    caches.open(PHIEN).then((c) =>
      c.match(r).then((hit) => {
        const moi = fetch(r)
          .then((res) => {
            if (res.ok) c.put(r, res.clone());
            return res;
          })
          .catch((err) => {
            if (hit) return hit;
            throw err;
          });
        if (hit) e.waitUntil(moi.catch(() => {}));
        return hit || moi;
      })
    )
  );
});
`;
}

/** Script đăng ký (trong <head> của mọi trang): chỉ khi trình duyệt có service worker và trang ở ngữ cảnh an toàn. */
export const scriptDangKy = (base = '/opus/') =>
	`if("serviceWorker"in navigator&&isSecureContext)addEventListener("load",function(){navigator.serviceWorker.register(${JSON.stringify(base + 'sw.js')},{scope:${JSON.stringify(base)}}).catch(function(){})})`;

/** Ghi `dist`/sw.js; trả về { phien, luuSan }. */
export function ghiSw(dist, base = '/opus/') {
	const phien = phienBan(dist);
	const luuSan = tepLuuSan(dist, base);
	fs.writeFileSync(path.join(dist, 'sw.js'), maSw({ phien, luuSan, base }));
	return { phien, luuSan };
}

/** Integration của Astro: ghi sw.js sau cùng (đặt sau sách in trong astro.config.mjs). */
export function ungDung({ base = '/opus/' } = {}) {
	return {
		name: 'opus-ung-dung',
		hooks: {
			'astro:build:done': ({ dir, logger }) => {
				const { phien, luuSan } = ghiSw(fileURLToPath(dir), base);
				logger.info(`đã ghi sw.js, phiên bản ${phien}, ${luuSan.length} tệp lưu sẵn`);
			},
		},
	};
}
