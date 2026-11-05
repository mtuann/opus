// Kiểm thử của lô D8-L1: trang Tác phẩm theo cấp độ (piano/tac-pham-theo-cap) là chữ viết tay, nhưng bài nào có bản ghi
// trong src/data/tac-pham.yml thì chặng ghi trên trang phải khớp trường chang của bản ghi (đã khóa ở D2-0), và tiêu đề
// mỗi chặng khớp src/data/cap-do.yml (tên, Grade). Như tests/dong-thoi-gian.test.mjs với năm sinh–mất viết tay.
// Chặng của một bài trên trang được đọc ở bốn chỗ:
// - link tới bài học ở ô đầu của một hàng trong bảng của mục "## Chặng N": chặng N;
// - link tới bài học có "(chặng N)" ngay sau;
// - bảng có cột "Chặng…" (như bảng mức Henle): ô đầu có link tới bài học thì ô của cột ấy bắt đầu bằng chặng của bài;
// - bảng có cột ghi "(chặng)" (như cột "Đi qua trước (chặng)"): link tới bài học có "(N)" ngay sau.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { duLieuDaKiem } from '../src/du-lieu.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const TRANG = path.join(ROOT, 'src/content/docs/piano/tac-pham-theo-cap.md');
const LINK = /\]\(\/opus\/piano\/tac-pham\/([a-z0-9-]+)\/(?:#[^)]*)?\)/g;

/** Ô của một hàng bảng Markdown (bỏ | đầu và cuối; \| không tách ô). */
const oCua = (dong) =>
	dong
		.trim()
		.replace(/^\||\|$/g, '')
		.split(/(?<!\\)\|/)
		.map((s) => s.trim());

/**
 * Chặng ghi trên trang cho từng link tới bài học: [{ dong, slug, chang, cho }]. Hàm thuần trên chữ Markdown, để kiểm
 * được cả trang giả.
 */
export function changTrenTrang(md) {
	const ra = [];
	let muc = null; // chặng của mục ## đang đọc
	let tieuDe = null; // ô tiêu đề của bảng đang đọc
	const dong = md.split('\n');
	dong.forEach((l, i) => {
		const h = /^## (?:Chặng (\d)\b)?/.exec(l);
		if (h) muc = h[1] ? Number(h[1]) : null;
		if (!l.startsWith('|')) {
			tieuDe = null;
		} else if (!tieuDe) {
			tieuDe = oCua(l);
			return;
		} else if (/^\|[\s|:-]+\|$/.test(l.trim())) {
			return;
		}
		const so = i + 1;
		// link có "(chặng N)" ngay sau, ở bất cứ đâu
		for (const m of l.matchAll(new RegExp(LINK.source + String.raw`\s*\(chặng (\d)\)`, 'g')))
			ra.push({ dong: so, slug: m[1], chang: Number(m[2]), cho: '(chặng N)' });
		if (!tieuDe) return;
		const o = oCua(l);
		const dau = [...(o[0] ?? '').matchAll(LINK)].map((m) => m[1]);
		// ô đầu của bảng trong mục "## Chặng N"
		if (muc && dau.length === 1 && !tieuDe.some((t) => /chặng/i.test(t)))
			ra.push({ dong: so, slug: dau[0], chang: muc, cho: `bảng của chặng ${muc}` });
		tieuDe.forEach((t, k) => {
			if (k === 0) return;
			// cột "Chặng…": ô bắt đầu bằng số chặng của bài ở ô đầu
			if (/^chặng/i.test(t) && dau.length === 1) {
				const n = /^(\d)/.exec(o[k] ?? '');
				ra.push({ dong: so, slug: dau[0], chang: n ? Number(n[1]) : NaN, cho: `cột "${t}"` });
			}
			// cột "… (chặng)": mỗi link có "(N)" ngay sau
			if (/\(chặng\)/i.test(t))
				for (const m of (o[k] ?? '').matchAll(new RegExp(LINK.source + String.raw`\s*\((\d)\)`, 'g')))
					ra.push({ dong: so, slug: m[1], chang: Number(m[2]), cho: `cột "${t}"` });
		});
	});
	return ra;
}

test('changTrenTrang: đọc chặng ở bảng của mục, "(chặng N)", cột Chặng và cột "(chặng)"', () => {
	const md = [
		'## Chặng 2. Sơ cấp',
		'',
		'| Tác phẩm | Thời kỳ |',
		'|---|---|',
		'| [A](/opus/piano/tac-pham/a/) | Baroque |',
		'| Không link | xem [B](/opus/piano/tac-pham/b/) |',
		'',
		'Đi qua trước: [C](/opus/piano/tac-pham/c/) (chặng 3).',
		'',
		'## Cách đọc',
		'',
		'| Tác phẩm | Chặng ở site | Mức |',
		'|---|---|---|',
		'| [D](/opus/piano/tac-pham/d/) | 5 (chương 1) | 7 |',
		'',
		'| Bài bạn mơ | Chặng | Đi qua trước (chặng) |',
		'|---|---|---|',
		'| [E](/opus/piano/tac-pham/e/) | 6 | [F](/opus/piano/tac-pham/f/) (4), G (2) |',
	].join('\n');
	const ra = changTrenTrang(md).map(({ slug, chang }) => `${slug}:${chang}`);
	assert.deepEqual(ra, ['a:2', 'c:3', 'd:5', 'e:6', 'f:4']);
});

test('piano/tac-pham-theo-cap: chặng của bài có bản ghi khớp tac-pham.yml', () => {
	const du = duLieuDaKiem();
	const ban = new Map(du['tac-pham'].map((r) => [r.slug, r]));
	const ds = changTrenTrang(fs.readFileSync(TRANG, 'utf8'));
	assert.ok(ds.length >= 30, `chỉ đọc được ${ds.length} chỗ ghi chặng`);
	const lech = [];
	for (const { dong, slug, chang, cho } of ds) {
		const r = ban.get(slug);
		if (!r) lech.push(`dòng ${dong}: không có bản ghi ${slug}`);
		else if (r.chang !== chang) lech.push(`dòng ${dong} (${cho}): ${slug} ghi chặng ${chang}, dữ liệu chặng ${r.chang} (${r.grade})`);
	}
	assert.deepEqual(lech, []);
});

test('piano/tac-pham-theo-cap: tiêu đề mỗi chặng khớp cap-do.yml (tên, Grade)', () => {
	const md = fs.readFileSync(TRANG, 'utf8');
	const tieuDe = [...md.matchAll(/^## Chặng (\d)\. (.+)$/gm)].map((m) => [Number(m[1]), m[2]]);
	const cap = duLieuDaKiem()['cap-do'];
	assert.equal(tieuDe.length, cap.length);
	for (const c of cap) {
		const t = tieuDe.find(([n]) => n === c.id)?.[1];
		const grade = c.grade_tu === 0 ? `(${c.nhan_grade})` : c.grade_tu === 9 ? `(${c.tuong_duong})` : `(≈ ${c.nhan_grade})`;
		assert.equal(t, `${c.ten} ${grade}`, `chặng ${c.id}`);
	}
});
