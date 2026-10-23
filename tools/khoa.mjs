#!/usr/bin/env node
// Khóa trang và bản ghi đã kiểm định (D1.6; plans/ben-vung/chuan-kiem-dinh.md mục 5–7).
//   node tools/khoa.mjs mau <mục>…                    tạo hồ sơ mẫu kiem-dinh/<mục>.yml (không ghi đè)
//   node tools/khoa.mjs khoa <mục>…                   kiểm hồ sơ đủ; ghi mã băm vào kiem-dinh/khoa.json và vào lần cuối
//                                                     trong lan của hồ sơ (lần đó phải chưa có mã băm)
//   node tools/khoa.mjs mo <mục> --ly-do "…"          gỡ khóa; ghi lý do và thêm một lần mới (để điền) vào lan của hồ sơ
//   node tools/khoa.mjs tinh [<mục>…]                 in mã băm; không có mục thì kiểm mọi mục đã khóa (lệch thì thoát 1)
//   node tools/khoa.mjs xuat <lô hay trang>… [--mau <n>] [--ra <file>]
//       danh sách nhận định cho lượt 2 (không nguồn, không kết quả); --mau n: n nhận định chọn ngẫu nhiên, kèm nguồn,
//       cho chủ repo kiểm mẫu. Lô ("D3-L2", trang lấy từ plans/lam-lai/anh-xa.md) thì mặc định ghi vào
//       plans/lam-lai/bao-cao/d3-l2-nhan-dinh.yml (với --mau: d3-l2-kiem-mau.yml); trang thì in ra màn hình
// <mục>: đường dẫn trang ("nhac-ly/10-hop-am-ba", "nhac-ly/index", "index", "404") hay bản ghi "du-lieu/<bộ>/<id>"
// ("du-lieu/tac-pham/fur-elise"). --goc <thư mục>: chạy trên bản chép của repo (kiểm thử).
import { execFileSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, parseDocument, stringify } from 'yaml';
import { GOC, docBanGhi, docKhoa, fileTrang, maBamBanGhi, maBamTrang } from '../src/khoa.mjs';

const KET_QUA = ['dung', 'da-sua', 'da-bo', 'khong-can-nguon'];
const LUOT_2 = ['dung', 'sai', 'khong-chac'];
const KET_QUA_KHUONG = ['dung', 'da-sua'];

/** Mục là bản ghi ("du-lieu/<bộ>/<id>")? Trả về "<bộ>/<id>" hay null. */
const laBanGhi = (muc) => (muc.startsWith('du-lieu/') ? muc.slice('du-lieu/'.length) : null);
const fileHoSo = (muc, goc) => path.join(goc, 'kiem-dinh', `${muc}.yml`);
const homNay = () => new Date().toISOString().slice(0, 10);
/** Những người phải ghi ở mỗi lần kiểm định (chuan-kiem-dinh.md mục 3, 5). */
const NGUOI = ['luot_1', 'luot_2', 'review', 'kiem_mau'];
const lanMoi = (so, goc) => ({ so, ngay: null, nhanh: nhanh(goc), ma_bam: null, nguoi: Object.fromEntries(NGUOI.map((k) => [k, null])) });

function nhanh(goc) {
	try {
		return execFileSync('git', ['-C', goc, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	} catch {
		return 'không rõ';
	}
}

/** Mã băm hiện tại của một mục; lỗi nếu trang hay bản ghi không có. */
function maBamMuc(muc, goc) {
	const bg = laBanGhi(muc);
	if (bg) {
		const r = docBanGhi(bg, goc);
		if (!r) throw new Error(`không có bản ghi ${bg} trong src/data/`);
		return maBamBanGhi(r);
	}
	const f = fileTrang(muc, goc);
	if (!fs.existsSync(f)) throw new Error(`không có trang ${path.relative(goc, f)}`);
	return maBamTrang(fs.readFileSync(f, 'utf8'));
}

function ghiKhoa(khoa, goc) {
	const sapXep = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
	fs.mkdirSync(path.join(goc, 'kiem-dinh'), { recursive: true });
	fs.writeFileSync(path.join(goc, 'kiem-dinh', 'khoa.json'), JSON.stringify({ trang: sapXep(khoa.trang), ban_ghi: sapXep(khoa.ban_ghi) }, null, 2) + '\n');
}

/** Số khối ```abc trong trang (hồ sơ phải có đúng chừng ấy mục khuong_nhac). */
const soKhuong = (noiDung) => (noiDung.match(/^```abc\s*$/gm) ?? []).length;

/**
 * Lỗi của hồ sơ trước khi khóa (chuan-kiem-dinh.md mục 3, 5): mọi nhận định đã qua hai lượt và có kết quả, nguồn có
 * trong danh sách nguồn, chỗ sửa và bỏ có ghi chú, chỗ hai lượt khác nhau đã giải quyết; mỗi khuông nhạc đã kiểm.
 */
export function loiHoSo(hs, muc, goc) {
	const loi = [];
	const bg = laBanGhi(muc);
	if (bg ? hs.ban_ghi !== bg : hs.trang !== `src/content/docs/${muc}.md`)
		loi.push(bg ? `ban_ghi phải là "${bg}"` : `trang phải là "src/content/docs/${muc}.md"`);
	if (!Array.isArray(hs.lan) || !hs.lan.length) loi.push('thiếu lan (các lần kiểm định)');
	else for (const k of NGUOI) if (!hs.lan.at(-1).nguoi?.[k]) loi.push(`lần kiểm định cuối: thiếu nguoi.${k}`);
	const nguon = new Set((hs.nguon ?? []).map((n) => n.id));
	for (const n of hs.nhan_dinh ?? []) {
		const ten = `nhận định ${n.id ?? '(không id)'}`;
		if (!n.id || !n.cau) loi.push(`${ten}: thiếu id hay cau`);
		if (!KET_QUA.includes(n.ket_qua)) loi.push(`${ten}: ket_qua phải là ${KET_QUA.join(', ')}`);
		if (!LUOT_2.includes(n.luot_2)) loi.push(`${ten}: chưa có kết quả lượt 2 (luot_2: ${LUOT_2.join(', ')})`);
		if ((n.ket_qua === 'da-sua' || n.ket_qua === 'da-bo') && !n.ghi_chu) loi.push(`${ten}: ${n.ket_qua} cần ghi_chu`);
		if (n.ket_qua === 'khong-can-nguon' && n.loai !== 'khuyen-tap') loi.push(`${ten}: khong-can-nguon chỉ cho loai khuyen-tap`);
		if (n.ket_qua !== 'khong-can-nguon' && n.ket_qua !== 'da-bo') {
			if (!n.nguon?.length) loi.push(`${ten}: thiếu nguon`);
			for (const id of n.nguon ?? []) if (!nguon.has(id)) loi.push(`${ten}: nguồn "${id}" không có trong danh sách nguon`);
		}
		if ((n.luot_2 === 'sai' || n.luot_2 === 'khong-chac') && n.ket_qua === 'dung' && !n.ghi_chu)
			loi.push(`${ten}: lượt 2 cho "${n.luot_2}" mà kết quả "dung": ghi_chu cách đã giải quyết`);
	}
	if (!bg) {
		const f = fileTrang(muc, goc);
		const can = fs.existsSync(f) ? soKhuong(fs.readFileSync(f, 'utf8')) : 0;
		const kn = hs.khuong_nhac ?? [];
		if (kn.length !== can) loi.push(`trang có ${can} khối abc mà khuong_nhac có ${kn.length} mục`);
		for (const k of kn) {
			if (!KET_QUA_KHUONG.includes(k.ket_qua)) loi.push(`khuông nhạc khối ${k.khoi}: ket_qua phải là ${KET_QUA_KHUONG.join(', ')}`);
			if (k.ket_qua === 'da-sua' && !k.ghi_chu) loi.push(`khuông nhạc khối ${k.khoi}: da-sua cần ghi_chu`);
		}
	}
	return loi;
}

/** Mã lô chuẩn ("d3-l2" -> "D3-L2"), hay null nếu không phải mã lô. */
export const maLo = (x) => (/^d\d+-l\d+$/i.test(x) ? x.toUpperCase() : null);

/** Các trang của lô ("D3-L2") theo bảng của lô trong plans/lam-lai/anh-xa.md. */
export function trangCuaLo(lo, goc = GOC) {
	const chu = fs.readFileSync(path.join(goc, 'plans', 'lam-lai', 'anh-xa.md'), 'utf8');
	const dong = chu.split('\n');
	const dau = dong.findIndex((l) => l.startsWith(`### ${maLo(lo)} `));
	if (dau < 0) throw new Error(`không có lô ${lo} trong plans/lam-lai/anh-xa.md`);
	const trang = [];
	for (const l of dong.slice(dau + 1)) {
		if (l.startsWith('#')) break;
		const m = /^\| `([^`]+)` \|/.exec(l);
		if (m) trang.push(m[1]);
	}
	return trang;
}

/** Hồ sơ mẫu cho một trang hay một bản ghi. */
function hoSoMau(muc, goc) {
	const bg = laBanGhi(muc);
	maBamMuc(muc, goc); // trang hay bản ghi phải có
	const dau = `# Hồ sơ kiểm định, cấu trúc ở plans/ben-vung/chuan-kiem-dinh.md mục 5. Điền xong thì khóa: node tools/khoa.mjs khoa ${muc}\n`;
	if (bg) return dau + stringify({ ban_ghi: bg, lan: [lanMoi(1, goc)], nguon: [], nhan_dinh: [] });
	const tang = (parse(fs.readFileSync(path.join(goc, 'src/data/trang.yml'), 'utf8')) ?? []).find((r) => r.id === muc)?.tang ?? null;
	const cu = path.join(goc, '..', 'opus-zero', 'docs', `${muc}.md`);
	const hs = {
		trang: `src/content/docs/${muc}.md`,
		...(fs.existsSync(cu) && { nguon_cu: `../opus-zero/docs/${muc}.md` }),
		tang,
		lan: [lanMoi(1, goc)],
		nguon: [],
		nhan_dinh: [],
		khuong_nhac: Array.from({ length: soKhuong(fs.readFileSync(fileTrang(muc, goc), 'utf8')) }, (_, i) => ({ khoi: i + 1, loai: null, kiem: [], ket_qua: null })),
	};
	return dau + stringify(hs);
}

/** Ghi ngày, nhánh và mã băm vào lần cuối trong lan của hồ sơ (lần đó chưa có mã băm: khoa đã kiểm). */
function ghiLan(fHoSo, ma, goc) {
	const doc = parseDocument(fs.readFileSync(fHoSo, 'utf8'));
	const cuoi = doc.get('lan').items.at(-1);
	for (const [k, v] of Object.entries({ ngay: homNay(), nhanh: nhanh(goc), ma_bam: ma })) cuoi.set(k, v);
	fs.writeFileSync(fHoSo, doc.toString({ lineWidth: 0 }));
}

export function lenh(thamSo, goc = GOC, in_ = console.log) {
	const [viec, ...con] = thamSo;
	const lay = (ten) => {
		const i = con.indexOf(ten);
		return i >= 0 ? con.splice(i, 2)[1] : undefined;
	};
	const iGoc = con.indexOf('--goc');
	if (iGoc >= 0) goc = path.resolve(con.splice(iGoc, 2)[1]);
	const khoa = docKhoa(goc);

	if (viec === 'mau') {
		for (const t of con) {
			const f = fileHoSo(t, goc);
			if (fs.existsSync(f)) throw new Error(`${path.relative(goc, f)} đã có`);
			fs.mkdirSync(path.dirname(f), { recursive: true });
			fs.writeFileSync(f, hoSoMau(t, goc));
			in_(`đã tạo ${path.relative(goc, f)}`);
		}
		return 0;
	}
	if (viec === 'khoa') {
		for (const muc of con) {
			const f = fileHoSo(muc, goc);
			if (!fs.existsSync(f)) throw new Error(`${muc}: chưa có hồ sơ ${path.relative(goc, f)} (tạo bằng: node tools/khoa.mjs mau ${muc})`);
			const hs = parse(fs.readFileSync(f, 'utf8')) ?? {};
			if (hs.lan?.at(-1)?.ma_bam)
				throw new Error(`${muc}: lần cuối trong lan của hồ sơ đã có mã băm. Trang hay bản ghi đã khóa thì sửa theo thủ tục mở khóa: node tools/khoa.mjs mo ${muc} --ly-do "…"`);
			const loi = loiHoSo(hs, muc, goc);
			if (loi.length) throw new Error(`${muc}: hồ sơ chưa đủ để khóa:\n- ${loi.join('\n- ')}`);
			const ma = maBamMuc(muc, goc);
			const bg = laBanGhi(muc);
			if (bg) khoa.ban_ghi[bg] = ma;
			else khoa.trang[muc] = ma;
			ghiLan(f, ma, goc);
			ghiKhoa(khoa, goc);
			in_(`đã khóa ${muc} (${ma.slice(0, 19)}…)`);
			if (!bg) {
				const fm = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(fileTrang(muc, goc), 'utf8'));
				const slug = fm && parse(fm[1])?.tac_pham;
				if (slug && !khoa.ban_ghi[`tac-pham/${slug}`]) in_(`  chú ý: bản ghi tac-pham/${slug} của trang chưa khóa (node tools/khoa.mjs khoa du-lieu/tac-pham/${slug})`);
			}
		}
		return 0;
	}
	if (viec === 'mo') {
		const lyDo = lay('--ly-do');
		const [muc] = con;
		if (!muc || !lyDo) throw new Error('cần mục và --ly-do "…"');
		const bg = laBanGhi(muc);
		const bang = bg ? khoa.ban_ghi : khoa.trang;
		const k = bg ?? muc;
		if (!(k in bang)) throw new Error(`${muc} chưa khóa`);
		delete bang[k];
		ghiKhoa(khoa, goc);
		const f = fileHoSo(muc, goc);
		if (fs.existsSync(f)) {
			const doc = parseDocument(fs.readFileSync(f, 'utf8'));
			if (!doc.has('mo_khoa')) doc.set('mo_khoa', doc.createNode([]));
			doc.get('mo_khoa').add(doc.createNode({ ngay: homNay(), nhanh: nhanh(goc), ly_do: lyDo }));
			const lan = doc.get('lan');
			lan.add(doc.createNode(lanMoi(lan.items.length + 1, goc)));
			fs.writeFileSync(f, doc.toString({ lineWidth: 0 }));
		}
		in_(`đã mở khóa ${muc}: sửa, kiểm định lại những nhận định bị chạm và các nhận định cùng đoạn, điền lần mới trong lan của hồ sơ, rồi khóa lại`);
		return 0;
	}
	if (viec === 'tinh') {
		const ds = con.length ? con : [...Object.keys(khoa.trang), ...Object.keys(khoa.ban_ghi).map((k) => `du-lieu/${k}`)];
		let lech = 0;
		for (const muc of ds) {
			const bg = laBanGhi(muc);
			const daKhoa = bg ? khoa.ban_ghi[bg] : khoa.trang[muc];
			let ma;
			try {
				ma = maBamMuc(muc, goc);
			} catch (e) {
				in_(`${muc}  ${e.message}`);
				lech++;
				continue;
			}
			const tt = !daKhoa ? 'chưa khóa' : daKhoa === ma ? 'khớp' : 'LỆCH';
			if (tt === 'LỆCH') lech++;
			in_(`${muc}  ${ma}  ${tt}`);
		}
		return lech ? 1 : 0;
	}
	if (viec === 'xuat') {
		const mau = Number(lay('--mau') ?? 0);
		const lo = con.length === 1 && maLo(con[0]);
		const ra = lay('--ra') ?? (lo ? `plans/lam-lai/bao-cao/${lo.toLowerCase()}-${mau ? 'kiem-mau' : 'nhan-dinh'}.yml` : undefined);
		const tatCa = [];
		for (const t of con.flatMap((x) => (maLo(x) ? trangCuaLo(x, goc) : [x]))) {
			const f = fileHoSo(t, goc);
			if (!fs.existsSync(f)) throw new Error(`${t}: chưa có hồ sơ`);
			const hs = parse(fs.readFileSync(f, 'utf8')) ?? {};
			const nguon = new Map((hs.nguon ?? []).map((n) => [n.id, n]));
			for (const n of hs.nhan_dinh ?? [])
				tatCa.push(mau ? { trang: t, id: n.id, cau: n.cau, loai: n.loai, nguon: (n.nguon ?? []).map((id) => ({ ten: nguon.get(id)?.ten, link: nguon.get(id)?.link })), ket_qua_luot_1: n.ket_qua } : { trang: t, id: n.id, cau: n.cau, loai: n.loai });
		}
		let ds = tatCa;
		if (mau) {
			ds = [];
			const conLai = [...tatCa];
			while (ds.length < mau && conLai.length) ds.push(conLai.splice(randomInt(conLai.length), 1)[0]);
		}
		const chu = stringify(ds, { lineWidth: 0 });
		if (ra) {
			fs.mkdirSync(path.dirname(path.resolve(goc, ra)), { recursive: true });
			fs.writeFileSync(path.resolve(goc, ra), chu);
			in_(`đã ghi ${ds.length} nhận định vào ${ra}`);
		} else in_(chu.trimEnd());
		return 0;
	}
	throw new Error('việc phải là mau, khoa, mo, tinh hay xuat (xem đầu file tools/khoa.mjs)');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
	try {
		process.exit(lenh(process.argv.slice(2)));
	} catch (e) {
		console.error(e.message);
		process.exit(1);
	}
}
