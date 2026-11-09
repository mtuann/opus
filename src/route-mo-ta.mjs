// Route middleware của Starlight: thay mô tả bị cắt dở bằng "…" trong thẻ meta description và og:description bằng mô
// tả trọn câu dựng từ chữ của trang (src/mo-ta.mjs). Không đổi file trang, không chạm khóa kiểm định.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { moTaDay } from './mo-ta.mjs';

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const entry = route?.entry;
	const cu = entry?.data?.description;
	if (typeof cu !== 'string' || !cu.endsWith('…')) return;
	const moi = moTaDay(cu, entry.body ?? '');
	if (moi === cu) return;
	for (const the of route.head) {
		if (the.tag !== 'meta' || !the.attrs) continue;
		if (the.attrs.name === 'description' || the.attrs.property === 'og:description' || the.attrs.name === 'twitter:description') the.attrs.content = moi;
	}
});
