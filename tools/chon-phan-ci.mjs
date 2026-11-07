// Chọn phần kiểm thử của CI theo file đổi (nhánh ci-gon). Nhánh chỉ đổi nội dung (trang, dữ liệu, hồ sơ kiểm định, kế
// hoạch, bản thu, file .md ở gốc repo) thì không đổi mã: ba trình duyệt cho cùng kết quả, các thành phần đã kiểm ở main.
// Khi ấy test.yml chỉ chạy npm test, Chromium trên trang đã đổi (OPUS_CHI_TRANG_DOI=1, tools/trang-mau.mjs) và
// Lighthouse. Đổi bất cứ file nào khác (mã, kiểm thử, công cụ, gói, workflow, file tĩnh khác) thì chạy đủ.
//
//   node tools/chon-phan-ci.mjs [--nen origin/main] [--du] [--anh-chup]   in kieu=, cac-phan=, chi-trang-doi= (và ghi vào
//                                                                       $GITHUB_OUTPUT khi có)
//   node tools/chon-phan-ci.mjs --nen <commit> --kieu                    chỉ in noi-dung hay ma (deploy.yml)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GOC = fileURLToPath(new URL('../', import.meta.url));

/** Nhóm nội dung: thư mục (có "/" ở cuối) hay mẫu tên file ở gốc repo. */
export const NHOM_NOI_DUNG = ['src/content/docs/', 'src/data/', 'kiem-dinh/', 'plans/', 'public/audio/'];
const GOC_NOI_DUNG = [/^[^/]+\.md$/, /^LICENSE[^/]*$/];

/** File thuộc nhóm nội dung (không phải mã)? */
export const laNoiDung = (f) => NHOM_NOI_DUNG.some((d) => f.startsWith(d)) || GOC_NOI_DUNG.some((m) => m.test(f));

/**
 * Loại thay đổi: "noi-dung" khi mọi file đổi đều thuộc nhóm nội dung; "ma" khi có file khác, hay khi danh sách rỗng hoặc
 * không đọc được (không biết thì chạy đủ).
 * @param {string[] | null} files
 */
export function phanLoai(files) {
	const ds = (files ?? []).map((f) => f.trim()).filter(Boolean);
	return ds.length && ds.every(laNoiDung) ? 'noi-dung' : 'ma';
}

/** Các phần (matrix của test.yml) cho một loại thay đổi. */
export function cacPhan(kieu, { du = false, anhChup = false } = {}) {
	const p = kieu === 'noi-dung' && !du ? ['npm-test', 'chromium', 'lighthouse'] : ['npm-test', 'chromium', 'webkit', 'firefox', 'lighthouse'];
	return anhChup ? [...p, 'anh-chup'] : p;
}

/** File đổi từ `nen` tới HEAD (git diff nen...HEAD), hay null khi không có `nen` hoặc git hỏng. */
export function fileDoi(nen, goc = GOC) {
	if (!nen || /^0+$/.test(nen)) return null;
	try {
		return execFileSync('git', ['-C', goc, 'diff', '--name-only', `${nen}...HEAD`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
			.split('\n')
			.filter(Boolean);
	} catch {
		return null;
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const args = process.argv.slice(2);
	const lay = (ten) => {
		const i = args.indexOf(ten);
		return i >= 0 ? (args[i + 1] ?? '') : undefined;
	};
	const nen = lay('--nen') ?? 'origin/main';
	const files = fileDoi(nen);
	const kieu = phanLoai(files);
	if (args.includes('--kieu')) {
		console.log(kieu);
	} else {
		const du = args.includes('--du');
		const ra = {
			kieu,
			'cac-phan': JSON.stringify(cacPhan(kieu, { du, anhChup: args.includes('--anh-chup') })),
			'chi-trang-doi': kieu === 'noi-dung' && !du ? '1' : '',
		};
		console.error(files === null ? `Không đọc được file đổi so với "${nen}": chạy đủ.` : `${files.length} file đổi so với ${nen}${files.length ? ':\n  ' + files.join('\n  ') : ''}`);
		const dong = Object.entries(ra).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
		process.stdout.write(dong);
		if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, dong);
	}
}
