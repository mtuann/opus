// Kiểm thử của lô D8-L1: ngày kiểm và ngày rà lại của trang tham chiếu có hạn (src/kiem-dinh.mjs, dòng oz-ra-lai dưới
// tiêu đề), script tools/ra-lai.mjs của workflow hằng tuần, và cấu hình hai workflow ra-lai.yml, kiem-link.yml.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { dongRaLai, loiRaLai, soThang, thangKiem, thangViet } from '../src/kiem-dinh.mjs';
import { denHan, diaChi, noiDungIssue, thangNay } from '../tools/ra-lai.mjs';
import { BAN_THU } from '../src/scripts/nghe-mu.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const HO_SO = 'lan:\n  - so: 1\n    ngay: 2026-11-05\n';

test('thangKiem: tháng của lần cuối trong lan, chỉ khi trang đã khóa', () => {
	const khoa = { trang: { a: 'sha256:x' } };
	assert.equal(thangKiem('a', khoa, HO_SO), '2026-11');
	assert.equal(thangKiem('a', khoa, HO_SO + '  - so: 2\n    ngay: 2027-02-01\n'), '2027-02');
	assert.equal(thangKiem('b', khoa, HO_SO), null, 'chưa khóa');
	assert.equal(thangKiem('a', khoa, 'lan:\n  - so: 1\n    ngay: null\n'), null);
});

test('dongRaLai: tháng kiểm và tháng rà lại; chưa khóa ghi "chưa kiểm định"; không có ra_lai thì không có dòng', () => {
	assert.equal(thangViet('2027-04'), '4/2027');
	assert.equal(dongRaLai('2026-11', '2027-04'), 'Kiểm tra lần cuối: tháng 11/2026 · rà lại tháng 4/2027');
	assert.equal(dongRaLai(null, '2027-10'), 'Kiểm tra lần cuối: chưa kiểm định · rà lại tháng 10/2027');
	assert.equal(dongRaLai('2026-11', undefined), null);
});

test('loiRaLai: ra_lai phải sau tháng kiểm, không quá 12 tháng', () => {
	assert.equal(soThang('2026-11', '2027-04'), 5);
	assert.equal(loiRaLai('2026-11', '2027-04'), null);
	assert.equal(loiRaLai('2026-11', '2027-11'), null);
	assert.match(loiRaLai('2026-11', '2027-12'), /quá 12 tháng/);
	assert.match(loiRaLai('2027-02', '2027-01'), /không sau/);
	assert.match(loiRaLai('2027-01', '2027-01'), /không sau/);
});

test('denHan: trang có ra_lai từ tháng này trở về trước, quá hạn lâu nhất trước; trang không có ra_lai bỏ qua', () => {
	const ds = [
		{ id: 'a', tang: 'tham-chieu', ra_lai: '2027-04', ly_do_ra_lai: 'lịch diễn' },
		{ id: 'b', tang: 'tham-chieu', ra_lai: '2027-01' },
		{ id: 'c', tang: 'tham-chieu', ra_lai: '2027-05' },
		{ id: 'd', tang: 'loi' },
	];
	const trangThai = (id) => ({ khoa: id === 'b', kiem: id === 'b' ? '2026-11' : null });
	assert.deepEqual(denHan(ds, '2026-12', trangThai), []);
	const r = denHan(ds, '2027-04', trangThai);
	assert.deepEqual(
		r.map((x) => [x.id, x.tre, x.khoa]),
		[
			['b', 3, true],
			['a', 0, false],
		],
	);
	const md = noiDungIssue(r, '05/04/2027');
	assert.match(md, /thấy 2 trang/);
	assert.match(md, /\| \[`b`\]\(https:\/\/mtuann\.github\.io\/opus\/b\/\) \| 1\/2027 \(quá hạn 3 tháng\) \| đã khóa, kiểm tháng 11\/2026 \|/);
	assert.match(md, /\| \[`a`\][^|]*\| 4\/2027 \(đến hạn tháng này\) \| chưa khóa: đặt lại `ra_lai` khi khóa \| lịch diễn \|/);
	assert.match(md, /node tools\/khoa\.mjs mo <trang>/);
	assert.equal(diaChi('index'), 'https://mtuann.github.io/opus/');
	assert.equal(diaChi('nhac-ly/index'), 'https://mtuann.github.io/opus/nhac-ly/');
	assert.equal(diaChi('tai-nguyen'), 'https://mtuann.github.io/opus/tai-nguyen/');
	assert.equal(thangNay(new Date(Date.UTC(2027, 0, 31))), '2027-01');
});

test('tools/ra-lai.mjs: thoát 1 khi có trang đến hạn và ghi nội dung issue; 0 khi không; tháng sai thì 2', (t) => {
	const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-ra-lai-'));
	t.after(() => fs.rmSync(tam, { recursive: true, force: true }));
	const chay = (...a) => spawnSync(process.execPath, ['tools/ra-lai.mjs', ...a], { cwd: ROOT, encoding: 'utf8' });
	const ra = path.join(tam, 'issue.md');
	const co = chay('--thang', '2099-01', '--ra', ra);
	assert.equal(co.status, 1, co.stderr);
	assert.match(fs.readFileSync(ra, 'utf8'), /\| \[`tai-nguyen`\]/);
	assert.equal(chay('--thang', '2000-01').status, 0);
	assert.equal(chay('--thang', '2027-13').status, 2);
});

test('đủ 11 trang tham chiếu có hạn (10 trang của đợt 8 và trang ke-hoach), trang nào cũng có ra_lai', () => {
	const trang = parse(fs.readFileSync(path.join(ROOT, 'src/data/trang.yml'), 'utf8')).filter((r) => r.tang === 'tham-chieu');
	assert.equal(trang.length, 11);
	for (const r of trang) assert.ok(r.ra_lai, r.id);
});

test('workflow ra-lai.yml, kiem-link.yml: chạy hằng tuần, bấm chạy tay được, chỉ đọc repo và mở issue', () => {
	for (const [ten, nhan] of [
		['ra-lai', 'ra-lai'],
		['kiem-link', 'link-hong'],
	]) {
		const chu = fs.readFileSync(path.join(ROOT, `.github/workflows/${ten}.yml`), 'utf8');
		const wf = parse(chu);
		assert.equal(wf.on.schedule[0].cron, '0 2 * * 1', ten);
		assert.ok('workflow_dispatch' in wf.on, ten);
		assert.deepEqual(wf.permissions, { contents: 'read', issues: 'write' }, ten);
		assert.match(chu, new RegExp(`--label ${nhan} --state open`), ten);
		assert.match(chu, new RegExp(`labels: ${nhan}`), ten);
		assert.match(chu, /gh issue close/, ten);
	}
	const link = fs.readFileSync(path.join(ROOT, '.github/workflows/kiem-link.yml'), 'utf8');
	for (const g of ['"src/content/docs/**/*.md"', '"src/data/*.yml"', '"src/scripts/nghe-mu.js"']) assert.ok(link.includes(g), g);
	assert.match(link, /--accept "100\.\.=103,200\.\.=299,403,429"/);
	assert.match(link, /abrsm/);
	// module nghe mù: mọi link bản thu nằm nguyên văn trong file (lychee đọc chữ của file)
	const mod = fs.readFileSync(path.join(ROOT, 'src/scripts/nghe-mu.js'), 'utf8');
	for (const b of BAN_THU) for (const u of [b.trang, ...b.nguon.map((n) => n.src)]) assert.ok(mod.includes(u), u);
});

test('denHan: trang tầng khác có ra_soat cũng được liệt kê, đánh dấu rà soát hằng năm (09/11/2026)', () => {
	const ds = [
		{ id: 'a', tang: 'tham-chieu', ra_lai: '2027-04' },
		{ id: 'b', tang: 'khung', ra_soat: '2027-03', ly_do_ra_soat: 'Web MIDI' },
		{ id: 'c', tang: 'loi' },
	];
	const r = denHan(ds, '2027-04');
	assert.deepEqual(r.map((x) => [x.id, x.ra_lai, !!x.soat, x.ly_do]), [['b', '2027-03', true, 'Web MIDI'], ['a', '2027-04', false, undefined]]);
	assert.match(noiDungIssue(r, '05/04/2027'), /3\/2027 \(quá hạn 1 tháng\), rà soát hằng năm \(`ra_soat`\)/);
});
