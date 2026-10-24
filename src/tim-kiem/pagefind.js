// Bọc pagefind.js của Pagefind (D1.8): ô tìm kiếm của Starlight nạp file này thay cho bản gốc (đổi tên thành
// pagefind-goc.js lúc build, src/tim-kiem/tich-hop.mjs). Các hàm khác giữ nguyên; search, debouncedSearch, preload tìm cả
// các biến thể "đ" của câu tìm rồi gộp kết quả, nên gõ "dan" cũng ra trang có chữ "đàn" (boc.js). Đoạn trích vẫn lấy từ
// chữ thật của trang.
import * as goc from './pagefind-goc.js';
import { boc } from './boc.js';

export * from './pagefind-goc.js';

export const { options, search, debouncedSearch, preload, destroy, createInstance } = boc(goc, new URL('./', import.meta.url).pathname);
await options();
