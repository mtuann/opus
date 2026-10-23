// Bộ sưu tập của site: trang (docs, của Starlight), chữ giao diện (i18n) và năm bộ dữ liệu trong src/data/.
// Schema, kiểm chéo và bộ nạp của dữ liệu ở src/du-lieu.mjs; dữ liệu sai thì build hỏng.
// Trạng thái kiểm định không ghi trong trang: đọc từ kiem-dinh/ lúc build (D1.6), để mã băm của trang không đổi khi khóa.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { boNap, schema, slugTacPham } from './du-lieu.mjs';

// Đọc và kiểm toàn bộ dữ liệu ngay khi nạp cấu hình; sai thì ném lỗi tại đây.
const tacPham = slugTacPham();

const duLieu = (ten: keyof typeof schema) => defineCollection({ loader: boNap(ten), schema: schema[ten] });

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Slug bản ghi trong src/data/tac-pham.yml; chỉ trang tác phẩm (bài học, hướng dẫn nghe) có trường này
				tac_pham: z
					.string()
					.refine((s) => tacPham.has(s), { message: 'không có bản ghi này trong src/data/tac-pham.yml' })
					.optional(),
			}),
		}),
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
	'cap-do': duLieu('cap-do'),
	'nha-soan-nhac': duLieu('nha-soan-nhac'),
	'tac-pham': duLieu('tac-pham'),
	'thuat-ngu': duLieu('thuat-ngu'),
	trang: duLieu('trang'),
};
