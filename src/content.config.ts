// Bộ sưu tập của Starlight: trang (docs) và chữ giao diện (i18n, src/content/i18n/vi.json).
// D1.2 thêm trường riêng của site (tac_pham) và năm bộ dữ liệu trong src/data/.
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
