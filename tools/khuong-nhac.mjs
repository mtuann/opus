// Kiểm mọi khối ```abc trong các trang (chuan-kiem-dinh.md mục 4, "Mọi khối"), thay tests/abc_warn.mjs và
// tests/abc_bars.py của site cũ:
// - abcjs không cảnh báo gì khi đọc khối (cú pháp abcjs không hiểu, nốt không vẽ được: lỗi abcjs bỏ qua lặng lẽ);
// - mỗi ô nhịp đủ độ dài theo M: (ô đầu và ô cuối được ngắn hơn: nhịp lấy đà, ô kết), từng bè một; các bè chồng trong
//   một ô (&) phải dài bằng nhau.
// Đọc abcjs đúng bản site dùng (public/vendor/abcjs-basic-min.js).
//   node tools/khuong-nhac.mjs [thư mục trang, mặc định src/content/docs]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const GOC = fileURLToPath(new URL('../', import.meta.url));

/** "<trang>#<thứ tự khối, đếm từ 1>" -> lý do: khối có cảnh báo đã biết và chấp nhận được. */
export const BO_QUA = {};

let abcjs = null;
function ABCJS() {
	if (!abcjs) {
		const hop = { module: { exports: {} }, window: {}, console };
		hop.exports = hop.module.exports;
		vm.runInNewContext(fs.readFileSync(path.join(GOC, 'public/vendor/abcjs-basic-min.js'), 'utf8'), hop);
		abcjs = hop.module.exports.parseOnly ? hop.module.exports : hop.window.ABCJS;
	}
	return abcjs;
}

/** Cảnh báo của abcjs cho một khối (chữ thường, bỏ thẻ HTML). */
export function canhBao(abc) {
	const tune = ABCJS().parseOnly(abc)[0];
	return ((tune && tune.warnings) || []).map((w) => w.replace(/<[^>]+>/g, '').trim());
}

// ---------- Độ dài ô nhịp: phân số nhỏ ----------
const ucln = (a, b) => (b ? ucln(b, a % b) : Math.abs(a));
const ps = (t, m = 1) => {
	const g = ucln(t, m) || 1;
	return m < 0 ? [-t / g, -m / g] : [t / g, m / g];
};
const cong = ([a, b], [c, d]) => ps(a * d + c * b, b * d);
const nhan = ([a, b], [c, d]) => ps(a * c, b * d);
const bang = ([a, b], [c, d]) => a * d === c * b;
const nhoHon = ([a, b], [c, d]) => a * d < c * b;
const chu = ([a, b]) => (b === 1 ? `${a}` : `${a}/${b}`);
const docPs = (s) => {
	const [t, m] = s.split('/').map(Number);
	return ps(t, m || 1);
};

/** Độ dài ghi sau nốt: số, "/", số ("3/2", "/", "//", "2"). Trả về [độ dài, vị trí sau đó]. */
function docDoDai(s, i) {
	const m = /^(\d*)(\/*)(\d*)/.exec(s.slice(i));
	let v = ps(m[1] ? Number(m[1]) : 1);
	if (m[2]) v = nhan(v, ps(1, m[3] ? Number(m[3]) : 2 ** m[2].length));
	return [v, i + m[0].length];
}

/** Độ dài từng ô nhịp của phần thân một bè (như bar_lengths của abc_bars.py). Ô các bè chồng lệch nhau: null. */
export function doDaiO(than, L, ghep = false) {
	const s = than
		.replace(/"[^"]*"/g, '') // chữ, ký hiệu hợp âm
		.replace(/![^!]*!/g, '') // ký hiệu trang trí
		.replace(/\[[A-Z]:[^\]]*\]/g, '') // trường trong dòng
		.replace(/\{[^}]*\}/g, ''); // nốt hoa mỹ không chiếm thời gian
	const o = [];
	let cur = ps(0);
	let i = 0;
	let lien = 0; // số nốt còn lại của nhóm liên ba…
	let heSo = ps(1);
	let chong = [];
	const them = (v) => {
		if (lien) {
			v = nhan(v, heSo);
			lien--;
		}
		cur = cong(cur, v);
	};
	while (i < s.length) {
		const c = s[i];
		if (c === '(' && /\d/.test(s[i + 1] ?? '')) {
			// (p:q:r: p nốt trong thời gian của q nốt, cho r nốt tiếp theo
			const m = /^\((\d)(?::(\d)?)?(?::(\d))?/.exec(s.slice(i));
			const p = Number(m[1]);
			const q = m[2] ? Number(m[2]) : ({ 2: 3, 3: 2, 4: 3, 6: 2, 8: 3 }[p] ?? (ghep ? 3 : 2));
			lien = m[3] ? Number(m[3]) : p;
			heSo = ps(q, p);
			i += m[0].length;
			continue;
		}
		if (c === '&') {
			// các bè chồng trong cùng ô: mỗi bè phải đủ độ dài ô
			chong.push(cur);
			cur = ps(0);
			i++;
			continue;
		}
		if ('|:]'.includes(c) || (c === '[' && '|12'.includes(s[i + 1] ?? ''))) {
			let j = i;
			while (j < s.length && '|:]12['.includes(s[j])) j++;
			if (s.slice(i, j).includes('|')) {
				if (chong.length) {
					chong.push(cur);
					cur = chong.every((x) => bang(x, chong[0])) ? chong[0] : null;
					chong = [];
				}
				o.push(cur);
				cur = ps(0);
			}
			i = j;
			continue;
		}
		if (c === '[') {
			// hợp âm: độ dài của nốt đầu trong ngoặc nhân độ dài sau ngoặc
			const j = s.indexOf(']', i);
			// không có "]" phía sau: abcjs cũng báo; dừng ở đây (đọc tiếp từ -1 thì vòng lặp không tiến, treo)
			if (j < 0) throw new Error('hợp âm mở bằng "[" mà không đóng bằng "]"');
			const trong = s.slice(i + 1, j);
			const m = /^[_^=]*[A-Ga-gz][,']*/.exec(trong);
			const [dTrong] = docDoDai(trong, m ? m[0].length : 0);
			const [d, k] = docDoDai(s, j + 1);
			them(nhan(nhan(L, dTrong), d));
			i = k;
			continue;
		}
		if ('_^='.includes(c)) {
			i++;
			continue;
		}
		if ('ABCDEFGabcdefgzx'.includes(c)) {
			i++;
			while (i < s.length && ",'".includes(s[i])) i++;
			const [d, k] = docDoDai(s, i);
			them(nhan(L, d));
			i = k;
			continue;
		}
		i++;
	}
	if (cur && !bang(cur, ps(0))) o.push(cur);
	return o;
}

/** Ô nhịp sai độ dài của một khối: danh sách chuỗi "bè …, ô …: … khác …". */
export function oSai(abc) {
	let L = ps(1, 8);
	let M = null;
	let ghep = false;
	const dong = abc.split('\n');
	for (const l of dong) {
		if (/^L:/.test(l)) L = docPs(l.slice(2).trim());
		else if (/^M:/.test(l)) {
			const v = l.slice(2).trim();
			M = v === 'none' || v === '' ? null : v === 'C' ? ps(4, 4) : v === 'C|' ? ps(2, 2) : docPs(v);
			ghep = /^(6|9|12)\//.test(v);
		}
	}
	if (!M) return [];
	const be = new Map();
	for (const l of dong) {
		if (/^[A-Za-z]:/.test(l) || l.startsWith('%') || !l.trim()) continue;
		const mv = /^\[V:([^\]]+)\]\s*(.*)$/.exec(l);
		const k = mv ? mv[1].trim() : '_';
		be.set(k, [...(be.get(k) ?? []), mv ? mv[2] : l]);
	}
	const sai = [];
	for (const [k, phan] of be) {
		let o;
		try {
			o = doDaiO(phan.join(' '), L, ghep);
		} catch (e) {
			sai.push(`bè ${k}: ${e.message}`);
			continue;
		}
		o.forEach((d, i) => {
			if (d && bang(d, M)) return;
			if (d && nhoHon(d, M) && (i === 0 || i === o.length - 1)) return;
			sai.push(`bè ${k}, ô ${i + 1}: ${d ? chu(d) : 'các bè chồng dài khác nhau'}, cần ${chu(M)}`);
		});
	}
	return sai;
}

/** Mọi khối ```abc (hay ~~~abc) trong các trang .md của thư mục: [{ khoa: "<trang>#<k>", abc }]. */
export function cacKhoi(thuMuc = path.join(GOC, 'src/content/docs')) {
	const ra = [];
	for (const f of fs.readdirSync(thuMuc, { recursive: true }).filter((x) => /\.mdx?$/.test(x)).sort()) {
		const trang = f.replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const chuTrang = fs.readFileSync(path.join(thuMuc, f), 'utf8');
		let k = 0;
		for (const m of chuTrang.matchAll(/^(```|~~~)abc[ \t]*\n([\s\S]*?)^\1[ \t]*$/gm)) ra.push({ khoa: `${trang}#${++k}`, abc: m[2] });
	}
	return ra;
}

/** Kiểm mọi khối của thư mục; trả về { khoi: số khối, loi: [chuỗi] }. */
export function kiemThuMuc(thuMuc) {
	const khoi = cacKhoi(thuMuc);
	const loi = [];
	for (const { khoa, abc } of khoi) {
		if (BO_QUA[khoa]) continue;
		for (const c of canhBao(abc)) loi.push(`${khoa}: abcjs cảnh báo: ${c.slice(0, 300)}`);
		for (const o of oSai(abc)) loi.push(`${khoa}: ${o}`);
	}
	return { khoi: khoi.length, loi };
}

// import.meta.main: đúng cả khi đường dẫn script đi qua liên kết tượng trưng (/tmp trên macOS)
if (import.meta.main) {
	const { khoi, loi } = kiemThuMuc(process.argv[2] ? path.resolve(process.argv[2]) : undefined);
	for (const l of loi) console.log(`✗ ${l}`);
	console.log(`khuông nhạc: ${khoi} khối, ${loi.length} lỗi`);
	process.exit(loi.length ? 1 : 0);
}
