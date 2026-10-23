// @ts-check
// Cấu hình site Opus (Astro và Starlight). Phiên bản và lý do: plans/lam-lai/cong-nghe.md.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { trangTrongBan } from './src/ban-build.mjs';
import { idCu } from './src/plugins/id-cu.mjs';
import { opusMarkdown } from './src/plugins/opus-markdown.mjs';
import { sapCo } from './src/plugins/sap-co.mjs';

const site = 'https://mtuann.github.io';
const base = '/opus';

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
			mdastPlugins: [opusMarkdown({ base: `${base}/`, docsDir: fileURLToPath(new URL('./src/content/docs/', import.meta.url)) })],
			// id tiêu đề theo kiểu site cũ, để link #mục cũ vẫn đúng (D1.4), chạy trước plugin id của Starlight;
			// link tới trang chưa có trong bản build thành chữ "sắp có" (D1.5)
			hastPlugins: [idCu(), sapCo({ base: `${base}/`, trangCo: trangTrongBan })],
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
			defaultLocale: 'root',
			locales: { root: { label: 'Tiếng Việt', lang: 'vi' } },
			// Logo khuông nhạc: bản mực cho nền sáng, bản kem cho nền tối
			logo: { light: './src/assets/logo-muc.svg', dark: './src/assets/logo.svg' },
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'Mã nguồn trên GitHub', href: 'https://github.com/mtuann/opus' }],
			customCss: ['./src/styles/fonts.css', './src/styles/opus.css', './src/styles/thanh-phan.css'],
			components: {
				Footer: './src/components/Footer.astro',
				Hero: './src/components/Hero.astro',
				MarkdownContent: './src/components/MarkdownContent.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			head: [
				...preloadFonts,
				// Màu thanh trình duyệt trên điện thoại: trùng nền thanh trên cùng của site (src/styles/opus.css)
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#fbfbf9', media: '(prefers-color-scheme: light)' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#12161d', media: '(prefers-color-scheme: dark)' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}/icons/icon-192.png` } },
			],
		}),
	],
});
