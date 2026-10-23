// @ts-check
// Cấu hình site Opus (Astro và Starlight). Phiên bản và lý do: plans/lam-lai/cong-nghe.md.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
			customCss: ['./src/styles/fonts.css', './src/styles/opus.css'],
			components: {
				Footer: './src/components/Footer.astro',
				Hero: './src/components/Hero.astro',
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
