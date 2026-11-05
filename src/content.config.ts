// Bộ sưu tập của site: trang (docs, của Starlight), chữ giao diện (i18n) và năm bộ dữ liệu trong src/data/.
// Schema, kiểm chéo và bộ nạp của dữ liệu ở src/du-lieu.mjs; dữ liệu sai thì build hỏng.
// Trạng thái kiểm định không ghi trong trang: đọc từ kiem-dinh/ lúc build (D1.6), để mã băm của trang không đổi khi khóa.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { dungLaiKhiBlogDoi, locTheoBan } from './ban-build.mjs';
import { boNap, dungLaiKhiDoi, schema, slugTacPham } from './du-lieu.mjs';
import { kiemKhoa } from './khoa.mjs';

// Đọc và kiểm toàn bộ dữ liệu ngay khi nạp cấu hình; sai thì ném lỗi tại đây.
const tacPham = slugTacPham();

// Trang và bản ghi đã khóa mà đổi thì build hỏng, ở cả bản thật và bản xem (plans/ben-vung/chuan-kiem-dinh.md mục 6)
const loiKhoa = kiemKhoa();
if (loiKhoa.length) throw new Error(`Khóa trong kiem-dinh/khoa.json không khớp (${loiKhoa.length} lỗi):\n- ${loiKhoa.join('\n- ')}`);

const duLieu = (ten: keyof typeof schema) => defineCollection({ loader: boNap(ten), schema: schema[ten] });

export const collections = {
	docs: defineCollection({
		// dựng lại mọi trang khi src/data/, plugin Markdown, khóa (xem dungLaiKhiDoi) hay frontmatter bài blog đổi; bản thật bỏ
		// trang chưa khóa
		loader: dungLaiKhiBlogDoi(dungLaiKhiDoi(locTheoBan(docsLoader()))),
		schema: docsSchema({
			extend: z.object({
				// Slug bản ghi trong src/data/tac-pham.yml; chỉ trang tác phẩm (bài học, hướng dẫn nghe) có trường này
				tac_pham: z
					.string()
					.refine((s) => tacPham.has(s), { message: 'không có bản ghi này trong src/data/tac-pham.yml' })
					.optional(),
				// Ngày đăng của bài blog (blog/posts/<yyyy-mm-dd>-<tên>.md, D7-L3): ::danh-sach-bai xếp bài theo ngày này
				date: z.coerce.date().optional(),
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
