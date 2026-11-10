#!/usr/bin/env node
// Trang tham chiếu có hạn đến hạn rà lại (D8-L1): đọc ra_lai (và ra_soat của trang tầng khác) của src/data/trang.yml, liệt kê trang có ra_lai từ tháng này
// trở về trước, kèm trạng thái khóa (kiem-dinh/khoa.json) và tháng kiểm của hồ sơ. Workflow hằng tuần
// .github/workflows/ra-lai.yml dùng bản liệt kê làm nội dung issue "Trang cần rà lại" (nhãn ra-lai); không chặn deploy.
//
//   node tools/ra-lai.mjs                 # in danh sách; thoát 1 khi có trang đến hạn, 0 khi không
//   node tools/ra-lai.mjs --ra issue.md   # ghi thêm nội dung issue (Markdown) vào file
//   node tools/ra-lai.mjs --thang 2027-04 # coi như đang ở tháng 4/2027 (để thử)
//
// Phần tính là hàm thuần (denHan, noiDungIssue), có kiểm thử ở tests/ra-lai.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { soThang, thangKiem, thangViet } from '../src/kiem-dinh.mjs';

const GOC = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://mtuann.github.io/opus/';

/** Tháng hiện tại ("2026-11") theo giờ UTC, như máy của GitHub. */
export const thangNay = (d = new Date()) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

/**
 * Trang đến hạn: ra_lai từ tháng `thang` trở về trước, quá hạn lâu nhất trước.
 * @param {{ id: string, tang: string, ra_lai?: string, ly_do_ra_lai?: string }[]} dsTrang bản ghi của trang.yml
 * @param {string} thang tháng hiện tại, "2026-11"
 * @param {(id: string) => { khoa: boolean, kiem: string | null }} trangThai khóa và tháng kiểm của từng trang
 * @returns {{ id: string, ra_lai: string, ly_do?: string, tre: number, khoa: boolean, kiem: string | null }[]}
 */
export function denHan(dsTrang, thang, trangThai = () => ({ khoa: false, kiem: null })) {
	return dsTrang
		.map((r) => (r.ra_lai ? r : r.ra_soat ? { ...r, ra_lai: r.ra_soat, ly_do_ra_lai: r.ly_do_ra_soat, soat: true } : r))
		.filter((r) => r.ra_lai && soThang(r.ra_lai, thang) >= 0)
		.map((r) => ({ id: r.id, ra_lai: r.ra_lai, ly_do: r.ly_do_ra_lai, tre: soThang(r.ra_lai, thang), ...(r.soat ? { soat: true } : {}), ...trangThai(r.id) }))
		.sort((a, b) => b.tre - a.tre || a.id.localeCompare(b.id));
}

/** Địa chỉ trang trên site: "nhac-ly/index" -> ".../nhac-ly/", "tai-nguyen" -> ".../tai-nguyen/". */
export const diaChi = (id) => SITE + (id === 'index' ? '' : id.replace(/(^|\/)index$/, '$1').replace(/\/?$/, '/'));

/** Nội dung issue (Markdown) cho danh sách trang đến hạn, ghi ngày kiểm `ngay` ("05/11/2026"). */
export function noiDungIssue(ds, ngay) {
	const dong = ds.map((r) => {
		const han = r.tre === 0 ? 'đến hạn tháng này' : `quá hạn ${r.tre} tháng`;
		const kiem = r.khoa ? `đã khóa, kiểm tháng ${r.kiem ? thangViet(r.kiem) : '?'}` : 'chưa khóa: đặt lại `ra_lai` khi khóa';
		return `| [\`${r.id}\`](${diaChi(r.id)}) | ${thangViet(r.ra_lai)} (${han})${r.soat ? ', rà soát hằng năm (`ra_soat`)' : ''} | ${kiem} | ${r.ly_do ?? ''} |`;
	});
	return [
		`Lần kiểm tra tự động ngày ${ngay}: \`node tools/ra-lai.mjs\` thấy ${ds.length} trang tham chiếu có hạn đến hạn rà lại (\`ra_lai\` trong \`src/data/trang.yml\`).`,
		'',
		'| Trang | Rà lại | Trạng thái | Lý do của hạn |',
		'|---|---|---|---|',
		...dong,
		'',
		'Cách rà lại (`plans/ben-vung/chuan-kiem-dinh.md` mục 3 và 7): mỗi lần rà là một lần kiểm định mới. Trên nhánh `mo/ra-lai-<trang>`:',
		'',
		'1. `node tools/khoa.mjs mo <trang> --ly-do "rà lại theo lịch (ra_lai)"`;',
		'2. kiểm lại các nhận định dễ cũ (giá, ứng dụng, cuộc thi, lịch diễn, chương trình thi, link), sửa trang khi cần, điền lần mới trong `lan` của hồ sơ;',
		'3. đặt `ra_lai` (hay `ra_soat`) mới trong `src/data/trang.yml` (sau tháng kiểm, không quá 12 tháng), rồi `node tools/khoa.mjs khoa <trang>`.',
		'',
		'Issue tự đóng khi không còn trang nào đến hạn.',
		'',
	].join('\n');
}

/** Khóa và tháng kiểm của trang, đọc từ kiem-dinh/ (khoa.json, hồ sơ). */
export function docTrangThai(goc = GOC) {
	const tep = path.join(goc, 'kiem-dinh/khoa.json');
	const khoa = fs.existsSync(tep) ? JSON.parse(fs.readFileSync(tep, 'utf8')) : {};
	return (id) => {
		const hs = path.join(goc, 'kiem-dinh', `${id}.yml`);
		const hoSo = fs.existsSync(hs) ? fs.readFileSync(hs, 'utf8') : undefined;
		return { khoa: !!khoa.trang?.[id], kiem: thangKiem(id, khoa, hoSo) };
	};
}

const chay = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (chay) {
	const thamSo = process.argv.slice(2);
	const lay = (ten) => {
		const i = thamSo.indexOf(ten);
		return i >= 0 ? thamSo[i + 1] : undefined;
	};
	const thang = lay('--thang') ?? thangNay();
	if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(thang)) {
		console.error(`--thang phải dạng năm-tháng, ví dụ 2027-04 (nhận: ${thang})`);
		process.exit(2);
	}
	const dsTrang = parse(fs.readFileSync(path.join(GOC, 'src/data/trang.yml'), 'utf8'));
	const ds = denHan(dsTrang, thang, docTrangThai());
	const d = new Date();
	const ngay = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
	if (!ds.length) console.log(`Tháng ${thangViet(thang)}: không trang nào đến hạn rà lại.`);
	else for (const r of ds) console.log(`${r.id}: rà lại tháng ${thangViet(r.ra_lai)}${r.tre ? ` (quá hạn ${r.tre} tháng)` : ''}${r.khoa ? '' : ', chưa khóa'}`);
	const ra = lay('--ra');
	if (ra) fs.writeFileSync(ra, noiDungIssue(ds, ngay));
	process.exit(ds.length ? 1 : 0);
}
