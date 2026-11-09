// @ts-check
// Cấu hình site Opus (Astro và Starlight). Phiên bản và lý do: plans/lam-lai/cong-nghe.md.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { DUONG_GOC, chiTrangTrongBan, trangDocsTrongBan, trangTrongBan } from './src/ban-build.mjs';
import { duLieuDaKiem } from './src/du-lieu.mjs';
import { menu } from './src/nhom.mjs';
import { duLieuCho } from './src/plugins/thanh-phan.mjs';
import { bangHep } from './src/plugins/bang-hep.mjs';
import { danhSachViec } from './src/plugins/danh-sach-viec.mjs';
import { idCu } from './src/plugins/id-cu.mjs';
import { opusMarkdown } from './src/plugins/opus-markdown.mjs';
import { sapCo } from './src/plugins/sap-co.mjs';
import { timKiemKhongDau } from './src/tim-kiem/tich-hop.mjs';
import { sachIn } from './src/sach/sach.mjs';
import { ungDung } from './src/ung-dung/ung-dung.mjs';

const site = 'https://mtuann.github.io';
// Tầng của trang (src/data/trang.yml): trang Đọc thêm xếp nhóm theo tầng. Dữ liệu sai thì báo lỗi ngay ở đây, như khi nạp
// bộ dữ liệu (src/du-lieu.mjs).
const tang = new Map(duLieuDaKiem().trang.map((r) => [r.id, r.tang]));
// Trang chặng trong menu, ngay sau trang lộ trình: "Chặng 3. Sơ trung cấp". Menu có ở mọi trang (luôn đăng), nên tên chặng
// chỉ đọc trường đã khóa (chiDaKhoa).
const trangChangMenu = duLieuCho('menu bên', { luonKhoa: true }).capDo.map((c) => ({ link: `/piano/lo-trinh/chang-${c.id}/`, label: `Chặng ${c.id}. ${c.ten}` }));
const base = DUONG_GOC.replace(/\/$/, ''); // '/opus'

// Font của màn hình đầu (chữ thường và tiêu đề, bộ latin và vietnamese): nạp trước để chữ hiện đúng font
// ngay lần vẽ đầu, như overrides/main.html của site cũ.
const preloadFonts = [
	'be-vietnam-pro-400-normal-latin',
	'be-vietnam-pro-400-normal-vietnamese',
	'literata-600-normal-latin',
	'literata-600-normal-vietnamese',
].map((name) => ({
	tag: /** @type {const} */ ('link'),
	attrs: { rel: 'preload', href: `${base}/fonts/${name}.woff2`, as: 'font', type: 'font/woff2', crossorigin: '' },
}));

export default defineConfig({
	site,
	base,
	// Địa chỉ dạng thư mục như site cũ: /opus/piano/gam/
	trailingSlash: 'always',
	build: { format: 'directory' },
	markdown: {
		// Sätteri, bộ xử lý Markdown mặc định của Astro 7 (plans/lam-lai/cong-nghe.md mục 2), cộng plugin của dự án:
		// khối ```abc, ```quiz và các chỉ thị ::hop-tac-pham… (cú pháp: AGENTS.md, mục "Khối đặc biệt").
		processor: satteri({
			// bản thật: trang chưa khóa không qua plugin của dự án (chiTrangTrongBan)
			mdastPlugins: [chiTrangTrongBan(opusMarkdown({ base: `${base}/`, docsDir: fileURLToPath(new URL('./src/content/docs/', import.meta.url)) }))],
			// id tiêu đề theo kiểu site cũ, để link #mục cũ vẫn đúng (D1.4), chạy trước plugin id của Starlight;
			// link tới trang chưa có trong bản build thành chữ "sắp có" (D1.5); danh sách việc "- [ ]" có nhãn, bấm được; bảng
			// nhiều cột không bị ép ở màn hình hẹp (D2-nền)
			hastPlugins: [idCu(), sapCo({ base: `${base}/`, trangCo: trangTrongBan }), danhSachViec(), bangHep()],
			features: {
				smartPunctuation: false, // giữ nguyên dấu nháy, gạch ngang như chữ của site cũ (Astro mặc định bật)
				headingAttributes: true, // ## Tiêu đề { #id }: id viết tay
				definitionList: true,
				gfm: { footnotes: { label: 'Chú thích', backLabel: 'Quay lại chỗ chú thích {reference}' } },
			},
		}),
	},
	integrations: [
		starlight({
			title: 'Opus',
			description: 'Sổ tay tiếng Việt học piano cổ điển cho người lớn tự học, từ con số 0.',
			// Mô tả bị cắt dở "…" của trang chuyển từ site cũ: thẻ meta lấy trọn câu từ chữ của trang (src/mo-ta.mjs)
			routeMiddleware: './src/route-mo-ta.mjs',
			defaultLocale: 'root',
			locales: { root: { label: 'Tiếng Việt', lang: 'vi' } },
			// Logo khuông nhạc: bản mực cho nền sáng, bản kem cho nền tối
			logo: { light: './src/assets/logo-muc.svg', dark: './src/assets/logo.svg' },
			favicon: '/favicon.svg',
			// Menu đủ 9 nhóm (src/nhom.mjs), chỉ trang có trong bản build này; nhóm chưa có trang hiện "sắp có"
			// (src/components/Sidebar.astro). Đang chạy npm run dev mà thêm, xóa trang thì khởi động lại để menu cập nhật.
			sidebar: menu(trangDocsTrongBan(), tang, { 'lo-trinh': { sau: 'piano/lo-trinh', muc: trangChangMenu } }),
			// Biểu tượng GitHub (link tới repo): bỏ tạm khi repo còn riêng tư, vì người đọc mở ra trang 404 (chủ repo chọn
			// 24/10/2026). Repo công khai thì thêm lại: social: [{ icon: 'github', label: 'Mã nguồn trên GitHub', href: … }]
			customCss: ['./src/styles/fonts.css', './src/styles/opus.css', './src/styles/thanh-phan.css'],
			components: {
				Banner: './src/components/Banner.astro',
				Footer: './src/components/Footer.astro',
				Hero: './src/components/Hero.astro',
				MarkdownContent: './src/components/MarkdownContent.astro',
				PageTitle: './src/components/PageTitle.astro',
				Sidebar: './src/components/Sidebar.astro',
			},
			head: [
				...preloadFonts,
				// Màu thanh trình duyệt trên điện thoại: trùng nền thanh trên cùng của site (src/styles/opus.css)
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#fbfbf9', media: '(prefers-color-scheme: light)' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#12161d', media: '(prefers-color-scheme: dark)' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}/icons/icon-192.png` } },
				// Cài như ứng dụng và dùng khi mất mạng (D7-L3, src/ung-dung/): manifest; script đăng ký service worker do
				// ungDung() chèn vào <head> (bản build đăng ký, máy chủ thử gỡ)
				{ tag: 'link', attrs: { rel: 'manifest', href: `${base}/manifest.webmanifest` } },
				// Ảnh khi chia sẻ link (Facebook, Zalo, X…), như site cũ: tên site trên khuông nhạc, dải phím đàn (public/og.png,
				// 1200×630; Starlight đã có og:title, og:description, twitter:card)
				{ tag: 'meta', attrs: { property: 'og:image', content: `${site}${base}/og.png` } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'Opus: học piano cổ điển từ con số 0' } },
			],
		}),
		// sau Starlight: bọc pagefind.js mà Starlight vừa dựng (gõ "d" thay "đ" vẫn tìm ra)
		timKiemKhongDau(),
		// sách in (dist/sach/<id>.html, D7-L3) dựng từ trang đã có trong dist/; sau Pagefind nên không vào chỉ mục tìm kiếm
		sachIn(),
		// sau cùng: sw.js lấy phiên bản từ mọi tệp của dist/, kể cả sách in và chỉ mục tìm kiếm
		ungDung({ base: `${base}/` }),
	],
});
