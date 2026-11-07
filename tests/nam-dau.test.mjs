// Đợt hình 3c (nhánh mo/hinh-dot-3c; plans/ben-vung/de-xuat-hinh.md, đề xuất 17 và 20): hình chỉ vẽ lại chữ của trang.
// nam-dau (bat-dau/lo-trinh-choi): bốn quý, mười hai tháng đúng tiêu đề và thứ tự của trang, link tới đúng mục, mỗi tháng
// ba mảng theo ba cột bảng. Sơ đồ đoạn của hướng dẫn nghe (hinh.nghe): mỗi ô một dòng bảng mà chú thích nói tới, để sửa
// bảng mà quên hình thì hỏng.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { hinhTinh } from '../src/plugins/thanh-phan.mjs';
import { slugCu } from '../src/plugins/id-cu.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const trang = (t) => fs.readFileSync(path.join(ROOT, 'src/content/docs', `${t}.md`), 'utf8');

test('nam-dau: bốn quý, mười hai tháng đúng tiêu đề, thứ tự và id của trang; ba mảng mỗi tháng; mốc có ★', () => {
	const md = trang('bat-dau/lo-trinh-choi');
	assert.match(md, /^::hinh\{ten="nam-dau"\}$/m);
	const tieuDe = md.split('\n').filter((l) => /^##+ (Quý|Tháng) /.test(l)).map((l) => l.replace(/^#+ /, ''));
	assert.equal(tieuDe.filter((h) => h.startsWith('Quý')).length, 4);
	assert.equal(tieuDe.filter((h) => h.startsWith('Tháng')).length, 12);
	const h = hinhTinh('nam-dau');
	const link = [...h.matchAll(/<a class="oz-nd-(quy-ten|ten)" href="#([^"]+)">(.*?)<\/a>/g)].map((m) => [m[2], m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')]);
	assert.deepEqual(
		link,
		tieuDe.map((t) => [slugCu(t), t.startsWith('Quý') ? t : t.replace(': ', ' ')]),
	);
	// mỗi tháng đúng ba mảng, theo thứ tự ba cột của bảng tháng, có tên cho máy đọc màn hình
	const cot = md.match(/^\| Bên đàn \| Đọc nhạc và nhạc lý \| Tai và nghe \|$/gm) ?? [];
	assert.equal(cot.length, 12);
	const thang = h.split('<a class="oz-nd-ten"').slice(1);
	assert.equal(thang.length, 12);
	for (const t of thang) {
		const lan = [...t.matchAll(/<span class="oz-nd-l oz-nd-(\w+)"><span class="sr-only">([^<]+): <\/span>[^<]+<\/span>/g)].map((m) => [m[1], m[2]]);
		assert.deepEqual(lan, [
			['dan', 'Bên đàn'],
			['ly', 'Đọc nhạc và nhạc lý'],
			['nghe', 'Tai và nghe'],
		]);
	}
	// mốc: tháng 4, 5, 6 và 12
	const moc = thang.map((t, i) => (t.includes('class="oz-nd-moc"') ? i + 1 : null)).filter(Boolean);
	assert.deepEqual(moc, [4, 5, 6, 12]);
});

test('sơ đồ đoạn của hướng dẫn nghe (đợt hình 3c): mỗi ô một dòng của bảng mà chú thích nói tới', () => {
	const tp = new Map(parse(fs.readFileSync(path.join(ROOT, 'src/data/tac-pham.yml'), 'utf8')).map((r) => [r.slug, r]));
	const dongBang = (md, muc) => {
		const dong = md.slice(md.indexOf(`## ${muc}`)).split('\n');
		const dau = dong.findIndex((d) => d.startsWith('|'));
		const het = dong.findIndex((d, i) => i > dau && !d.startsWith('|'));
		return het - dau - 2;
	};
	let dem = 0;
	for (const f of fs.readdirSync(path.join(ROOT, 'src/content/docs/nghe-nhac'))) {
		const md = trang(`nghe-nhac/${f.slice(0, -3)}`);
		const slug = /^tac_pham: (\S+)$/m.exec(md)?.[1];
		const so = tp.get(slug)?.hinh?.nghe;
		if (!so || so.length !== 1) continue;
		const m = /mỗi ô một dòng của bảng "([^"]+)"/.exec(so[0].chu_thich);
		if (!m) continue;
		dem++;
		assert.match(md, /^## Sơ đồ cấu trúc\n\n::hinh-cau-truc\n/m, f);
		assert.equal(so[0].doan.length, dongBang(md, m[1]), `${f}: số ô và số dòng bảng "${m[1]}"`);
	}
	assert.ok(dem >= 12, `chỉ ${dem} sơ đồ`);
});
