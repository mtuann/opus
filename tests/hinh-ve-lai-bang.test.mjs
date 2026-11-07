// Ba hình tĩnh của đợt hình 2 (nhánh mo/hinh-dot-2c; plans/ben-vung/de-xuat-hinh.md, đề xuất 19, 21, 26) chỉ vẽ lại bảng
// của trang: am-ngoai (sáu thẻ đường nét, nhac-ly/18-am-ngoai-hop-am) khớp từng dòng bảng "Các loại chính"; tong-pho
// (thứ tự bè, nhac-ly/20-doc-tong-pho) khớp bảng "Thứ tự các bè" và dùng màu của hình chỗ ngồi (seating). galant (tám mẫu, piano/hoa-am/mau-galant) khớp bảng đầu trang.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hinhTinh } from '../src/plugins/thanh-phan.mjs';

const DOCS = path.resolve(import.meta.dirname, '../src/content/docs');
const trang = (t) => fs.readFileSync(path.join(DOCS, `${t}.md`), 'utf8');
/** Các dòng của bảng Markdown đầu tiên sau tiêu đề `## <muc>`, bỏ dòng tiêu đề và dòng kẻ. */
function bang(md, muc) {
	const dong = md.slice(md.indexOf(`## ${muc}`)).split('\n');
	const dau = dong.findIndex((d) => d.startsWith('|'));
	const het = dong.findIndex((d, i) => i > dau && !d.startsWith('|'));
	return dong.slice(dau + 2, het).map((d) => d.slice(1, -1).split('|').map((o) => o.trim()));
}
const tron = (s) => s.replace(/\*\*/g, '').replace(/\s*\([^)]*\)/g, '');
const thuong = (s) => s[0].toLowerCase() + s.slice(1);
const boThe = (s) => s.replace(/<[^>]+>/g, '');

test('am-ngoai: sáu thẻ theo thứ tự bảng "Các loại chính"; tên, "đến", "rời" đúng chữ của bảng', () => {
	const md = trang('nhac-ly/18-am-ngoai-hop-am');
	assert.match(md, /^::hinh\{ten="am-ngoai"\}$/m);
	const dong = bang(md, 'Các loại chính');
	assert.equal(dong.length, 6);
	const h = hinhTinh('am-ngoai');
	const the = [...h.matchAll(/<div class="oz-nct-the"><b>([^<]*)<\/b>(<svg[\s\S]*?<\/svg>)<small>([^<]*)<\/small><\/div>/g)];
	assert.equal(the.length, 6);
	dong.forEach(([ten, den, roi], i) => {
		const [, t, svg, nho] = the[i];
		assert.equal(t, tron(ten));
		const chuDen = thuong(tron(den)), chuRoi = thuong(tron(roi));
		// âm nền: hai cột bảng là một câu ("một nốt giữ dài ở bè trầm, trong khi hợp âm bên trên thay đổi")
		assert.equal(nho, t === 'Âm nền' ? `${chuDen}, ${thuong(chuRoi)}` : `đến: ${chuDen}; rời: ${chuRoi}`, t);
		const rong = (svg.match(/fill="none" style="stroke:var\(--oz-h-do\)"/g) ?? []).length;
		assert.equal(rong, t === 'Âm nền' ? 0 : 1, `${t}: một âm ngoài hợp âm (chấm rỗng)`);
		assert.match(svg, /^<svg class="oz-fig" viewBox="[^"]+" role="img" aria-label="[^"]{20,}">/);
	});
	// tên nốt dưới chấm: cột ví dụ của bảng (nốt dựa: Sol – Rê – Đô như khuông "Nốt dựa" của trang)
	const ten = the.map(([, , svg]) => [...svg.matchAll(/<text[^>]*y="74"[^>]*>([^<]*)</g)].map((m) => m[1]).join(' '));
	assert.deepEqual(ten, ['Đô Rê Mi', 'Mi Fa Mi', 'Fa Fa Mi', 'Sol Rê Đô', 'Đô Đô', 'Sol']);
	assert.match(md, /nhảy tới Rê ở phách mạnh, rồi bước về Đô/);
	assert.match(md, /\[V:V1\] G4 \| d2 c2 \|\]/);
});

test('tong-pho: các bộ và nhạc cụ theo thứ tự bảng "Thứ tự các bè"; màu các bộ như hình seating', () => {
	const md = trang('nhac-ly/20-doc-tong-pho');
	assert.match(md, /^::hinh\{ten="tong-pho"\}\n\n::hinh\{ten="seating"\}$/m);
	const dong = bang(md, 'Thứ tự các bè');
	const h = hinhTinh('tong-pho');
	const chu = [...h.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
	// tên bộ theo đúng thứ tự dòng bảng
	const bo = dong.map((d) => tron(d[1]));
	assert.deepEqual(bo, ['Bộ gỗ', 'Bộ đồng', 'Bộ gõ', 'Đàn hạc, piano, celesta', 'Độc tấu, hợp xướng', 'Bộ dây']);
	const viTri = (s) => chu.findIndex((x) => s.startsWith(x.replace(/,$/, '')));
	const thuTu = bo.map(viTri);
	assert.ok(thuTu.every((x, i) => x >= 0 && (i === 0 || x > thuTu[i - 1])), `thứ tự bộ: ${thuTu}`);
	// tên viết tắt: theo cột "Nhạc cụ" (chữ trong ngoặc, hay tên không có ngoặc như Tuba); Vln. I, Vln. II là hai bè
	const vietTat = dong
		.flatMap((d) => d[2].split(', ').filter((x) => x && !x.startsWith('(')))
		.map((x) => x.match(/\(([^)]*)\)/)?.[1] ?? x)
		.filter((x) => !x.startsWith('các nhạc cụ'))
		.map((x) => ({ 'Violin I': 'Vln. I', 'Vln.': 'Vln. II' })[x] ?? x);
	assert.deepEqual(vietTat, ['Fl.', 'Ob.', 'Cl.', 'Bsn.', 'Hn.', 'Tpt.', 'Trb.', 'Tuba', 'Timp.', 'Perc.', 'Vln. I', 'Vln. II', 'Vla.', 'Vcl.', 'DB']);
	const be = chu.filter((x) => vietTat.includes(x));
	assert.deepEqual(be, vietTat);
	assert.ok(chu.includes('(nếu có)'));
	// mỗi bè một khuông năm dòng (cộng một khuông cho đàn hạc…, một cho độc tấu…), khuông "nếu có" nét đứt
	assert.equal((h.match(/<line [^>]*stroke-width="\.6"/g) ?? []).length, (vietTat.length + 2) * 5);
	assert.equal((h.match(/stroke-dasharray="4 3"/g) ?? []).length, 5);
	// màu thanh ngoặc của từng bộ = màu ô của bộ ấy trong hình chỗ ngồi
	const s = hinhTinh('seating');
	const mauCho = (chuO) => s.match(new RegExp(`fill="(#[0-9a-f]{6})"[^>]*/><text[^>]*>${chuO}<`))[1];
	const ngoac = [...h.matchAll(/<rect [^>]*fill="(#[0-9a-f]{6})"\/>/g)].map((m) => m[1]);
	assert.deepEqual(ngoac, [mauCho('Clarinet'), mauCho('Trumpet'), mauCho('Timpani · bộ gõ'), mauCho('Harp'), mauCho('Violin 1')]);
	assert.match(boThe(h), /bộ gỗ trên cùng, bộ dây dưới cùng/);
});

test('galant: tám thẻ theo bảng đầu trang mau-galant; giai điệu và bass đúng chữ của bảng, cùng số bước', () => {
	const md = trang('piano/hoa-am/mau-galant');
	assert.match(md, /^::hinh\{ten="galant"\}$/m);
	const dong = bang(md, 'Mẫu là gì, và từ đâu ra');
	assert.equal(dong.length, 8);
	const h = hinhTinh('galant');
	const the = [...h.matchAll(/<div class="oz-galant-the"><b>([^<]*)<\/b>(<div class="oz-galant-hang oz-galant-gd">.*?<\/div>)(<div class="oz-galant-hang oz-galant-bass">.*?<\/div>)<\/div>/g)];
	assert.equal(the.length, 8);
	/** Đọc lại một hàng thành chữ như bảng: bậc nối bằng "–", "…" giữ nguyên, thanh dài thành "N giữ nguyên". */
	const docHang = (s) => {
		const o = [...s.matchAll(/<span class="oz-galant-(bac|cach)">([^<]*)<\/span>/g)].map((m) => m[2]);
		if (s.includes('oz-galant-giu')) return `${o[0]} giữ nguyên`;
		return o.join('–').replace(/–…–/g, ' … ');
	};
	const buoc = (s) => (s.match(/oz-galant-bac/g) ?? []).length;
	dong.forEach(([ten, gd, bass], i) => {
		const [, t, hGd, hBass] = the[i];
		assert.equal(t, ten);
		assert.equal(docHang(hGd), gd, `${ten}: giai điệu`);
		assert.equal(docHang(hBass), bass, `${ten}: bass`);
		if (!bass.includes('giữ nguyên')) assert.equal(buoc(hGd), buoc(hBass), `${ten}: cùng số bước`);
		else assert.match(hBass, new RegExp(`--n:${buoc(hGd)}"`), `${ten}: thanh giữ dài bằng số bước giai điệu`);
	});
	// trang đã nói cách đọc vòng tròn: số là bậc, giai điệu trên, bass dưới
	assert.match(md, /số trong vòng tròn là bậc: phía trên khuông là giai điệu, phía dưới là bass/);
});
