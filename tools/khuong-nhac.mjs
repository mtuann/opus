// Kiểm mọi khối ```abc trong các trang (chuan-kiem-dinh.md mục 4, "Mọi khối"), thay tests/abc_warn.mjs và
// tests/abc_bars.py của site cũ:
// - abcjs không cảnh báo gì khi đọc khối (cú pháp abcjs không hiểu, nốt không vẽ được: lỗi abcjs bỏ qua lặng lẽ);
// - mỗi ô nhịp đủ độ dài theo M: (ô đầu và ô cuối được ngắn hơn: nhịp lấy đà, ô kết), từng bè một; các bè chồng trong
//   một ô (&) phải dài bằng nhau. Nhịp đổi giữa khối (trường trong dòng [M:2/4], hay dòng M: giữa phần thân) thì ô từ
//   đó theo nhịp mới; [L:…] cũng vậy.
// Đọc abcjs đúng bản site dùng (public/vendor/abcjs-basic-min.js).
//   node tools/khuong-nhac.mjs [thư mục trang hay một file .md, mặc định src/content/docs]
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

/** Giá trị của trường M: -> { M: độ dài ô (null: không có nhịp), ghep: nhịp kép (6/8, 9/8, 12/8) }. */
function docNhip(v) {
	v = v.trim();
	return { M: v === 'none' || v === '' ? null : v === 'C' ? ps(4, 4) : v === 'C|' ? ps(2, 2) : docPs(v), ghep: /^(6|9|12)\//.test(v) };
}

/** Độ dài từng ô nhịp của phần thân một bè (như bar_lengths của abc_bars.py). Ô các bè chồng lệch nhau: null. */
export function doDaiO(than, L, ghep = false) {
	return cacO(than, L, ghep, null).map((x) => x.d);
}

/** Từng ô nhịp của phần thân một bè: [{ d: độ dài (null: bè chồng lệch nhau), M: nhịp của ô }]. M: nhịp lúc bắt
 * đầu; trường trong dòng [M:…], [L:…] đổi nhịp, độ dài mặc định từ chỗ đó (đứng đầu ô thì áp cho cả ô ấy). */
function cacO(than, L, ghep, M) {
	const s = than
		.replace(/"[^"]*"/g, '') // chữ, ký hiệu hợp âm
		.replace(/![^!]*!/g, '') // ký hiệu trang trí
		.replace(/\[(?![ML]:)[A-Z]:[^\]]*\]/g, '') // trường trong dòng (trừ M:, L:, đọc ở dưới)
		.replace(/\{[^}]*\}/g, ''); // nốt hoa mỹ không chiếm thời gian
	const o = [];
	let nhipO = M; // nhịp của ô đang đọc
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
		const truong = /^\[([ML]):([^\]]*)\]/.exec(s.slice(i));
		if (truong) {
			if (truong[1] === 'L') L = docPs(truong[2].trim());
			else {
				({ M, ghep } = docNhip(truong[2]));
				if (!chong.length && bang(cur, ps(0))) nhipO = M;
			}
			i += truong[0].length;
			continue;
		}
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
			// "[" chỉ thuộc vạch nhịp khi là "[|", "[1", "[2"; "[M:…]" ngay sau vạch là trường trong dòng
			while (j < s.length && ('|:]12'.includes(s[j]) || (s[j] === '[' && '|12'.includes(s[j + 1] ?? '')))) j++;
			if (s.slice(i, j).includes('|')) {
				if (chong.length) {
					chong.push(cur);
					cur = chong.every((x) => bang(x, chong[0])) ? chong[0] : null;
					chong = [];
				}
				o.push({ d: cur, M: nhipO });
				cur = ps(0);
				nhipO = M;
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
	if (cur && !bang(cur, ps(0))) o.push({ d: cur, M: nhipO });
	return o;
}

/** Ô nhịp sai độ dài của một khối: danh sách chuỗi "bè …, ô …: … khác …". */
export function oSai(abc) {
	// phần đầu (tới K:) đặt nhịp, độ dài mặc định; dòng M:, L: trong phần thân áp cho mọi bè, từ chỗ đó
	let L = ps(1, 8);
	let nhip = { M: null, ghep: false };
	const dong = abc.split('\n');
	const dauThan = dong.findIndex((l) => /^K:/.test(l));
	const dau = dauThan < 0 ? dong : dong.slice(0, dauThan + 1);
	for (const l of dau) {
		if (/^L:/.test(l)) L = docPs(l.slice(2).trim());
		else if (/^M:/.test(l)) nhip = docNhip(l.slice(2));
	}
	const be = new Map();
	// dòng M:, L: giữa phần thân áp cho mọi bè từ chỗ đó (như abcjs), kể cả bè bắt đầu sau dòng ấy; [M:…] trong dòng
	// chỉ áp cho bè của dòng
	const chung = [];
	const vao = (k, x) => {
		if (!be.has(k)) be.set(k, [...chung]);
		be.get(k).push(x);
	};
	let k = '_';
	let coNhip = Boolean(nhip.M);
	for (const l of dauThan < 0 ? [] : dong.slice(dauThan + 1)) {
		if (/^[ML]:/.test(l)) {
			const f = `[${l.slice(0, 2)}${l.slice(2).trim()}]`;
			chung.push(f);
			for (const v of be.values()) v.push(f);
			if (/^M:/.test(l) && docNhip(l.slice(2)).M) coNhip = true;
			continue;
		}
		if (/^V:/.test(l)) k = l.slice(2).trim().split(/\s/)[0];
		if (/^[A-Za-z]:/.test(l) || l.startsWith('%') || !l.trim()) continue;
		const mv = /^\[V:([^\]]+)\]\s*(.*)$/.exec(l);
		if (mv) k = mv[1].trim();
		if (/\[M:\s*(?!none\s*\])[^\]\s]/.test(l)) coNhip = true;
		vao(k, mv ? mv[2] : l);
	}
	if (!coNhip) return [];
	const sai = [];
	for (const [k, phan] of be) {
		let o;
		try {
			o = cacO(phan.join(' '), L, nhip.ghep, nhip.M);
		} catch (e) {
			sai.push(`bè ${k}: ${e.message}`);
			continue;
		}
		o.forEach(({ d, M }, i) => {
			if (!M) return; // ô không có nhịp (M:none): không kiểm
			if (d && bang(d, M)) return;
			// ô đầu và ô cuối được ngắn hơn (nhịp lấy đà, ô kết)
			if (d && nhoHon(d, M) && (i === 0 || i === o.length - 1)) return;
			sai.push(`bè ${k}, ô ${i + 1}: ${d ? chu(d) : 'các bè chồng dài khác nhau'}, cần ${chu(M)}`);
		});
	}
	return sai;
}

/** Mọi khối ```abc (hay ~~~abc) trong các trang .md của thư mục (hay của một file): [{ khoa: "<trang>#<k>", abc }]. */
export function cacKhoi(thuMuc = path.join(GOC, 'src/content/docs')) {
	const ra = [];
	const motFile = fs.statSync(thuMuc).isFile();
	const goc = motFile ? path.dirname(thuMuc) : thuMuc;
	const ds = motFile ? [path.basename(thuMuc)] : fs.readdirSync(thuMuc, { recursive: true }).filter((x) => /\.mdx?$/.test(x)).sort();
	for (const f of ds) {
		const trang = f.replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const chuTrang = fs.readFileSync(path.join(goc, f), 'utf8');
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
