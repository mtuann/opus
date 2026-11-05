// Kiểm thử của lô D8-L2: dòng "ngoài lộ trình" ở đầu trang Đọc thêm (src/components/PageTitle.astro, lớp
// oz-ngoai-lo-trinh): hiện tự động cho trang tầng ngoai-vi (src/data/trang.yml), không viết tay trong trang, không vào
// chỉ mục tìm kiếm; trang tầng khác không có. Phần trên dist/ chạy khi đã build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const trang = parse(fs.readFileSync(path.join(ROOT, 'src/data/trang.yml'), 'utf8'));
const ds = Array.isArray(trang) ? trang : (trang.trang ?? Object.values(trang)[0]);
const NGOAI_VI = ds.filter((t) => t.tang === 'ngoai-vi').map((t) => t.id);
const html = (id) => path.join(DIST, id.endsWith('/index') ? id.slice(0, -6) : id, 'index.html');
const coBuild = fs.existsSync(path.join(DIST, 'index.html'));

test('trang.yml: có trang ngoại vi; trang ngoại vi không tự viết dòng "ngoài lộ trình" trong chữ', () => {
	assert.ok(NGOAI_VI.length >= 7, 'ít nhất bảy trang nhạc cụ');
	for (const id of NGOAI_VI) {
		const f = path.join(ROOT, 'src/content/docs', `${id}.md`);
		if (!fs.existsSync(f)) continue;
		assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /ngoài lộ trình|oz-ngoai-lo-trinh/i, `${id}: dòng này hiện tự động`);
	}
});

test('dist/: trang ngoại vi có dòng ngoài lộ trình (một dòng, link tới lộ trình, ngoài chỉ mục tìm kiếm); trang tầng khác không có', { skip: !coBuild && 'chưa build' }, () => {
	let thay = 0;
	for (const t of ds) {
		const f = html(t.id);
		if (!fs.existsSync(f)) continue;
		const h = fs.readFileSync(f, 'utf8');
		const so = (h.match(/class="oz-ngoai-lo-trinh"/g) ?? []).length;
		if (t.tang === 'ngoai-vi') {
			thay++;
			assert.equal(so, 1, `${t.id}: đúng một dòng`);
			const m = /<p class="oz-ngoai-lo-trinh"([^>]*)>([\s\S]*?)<\/p>/.exec(h);
			assert.match(m[1], /data-pagefind-ignore/, `${t.id}: ngoài chỉ mục tìm kiếm`);
			assert.match(m[2], /Đọc thêm, ngoài lộ trình: không cần cho các chặng\./);
			assert.match(m[2], /<a href="\/opus\/piano\/lo-trinh\/"/);
			assert.ok(h.indexOf('<h1') < h.indexOf('oz-ngoai-lo-trinh'), `${t.id}: dưới tiêu đề`);
		} else {
			assert.equal(so, 0, `${t.id}: tầng ${t.tang} không có dòng này`);
		}
	}
	assert.ok(thay > 0 || NGOAI_VI.every((id) => !fs.existsSync(html(id))), 'bản build có trang ngoại vi thì kiểm được');
});
