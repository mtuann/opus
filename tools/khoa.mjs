#!/usr/bin/env node
// Khóa trang và bản ghi đã kiểm định (D1.6; plans/ben-vung/chuan-kiem-dinh.md mục 5–7).
//   node tools/khoa.mjs mau <mục>…                    tạo hồ sơ mẫu kiem-dinh/<mục>.yml; bản ghi đang khóa từng phần thì
//                                                     thêm một lần kiểm định mới (để điền) vào lan, để khóa thêm trường hay
//                                                     khóa cả bản ghi. Mục đang khóa thì từ chối: muốn sửa thì mo
//   node tools/khoa.mjs khoa <mục>…                   kiểm hồ sơ đủ; ghi mã băm vào kiem-dinh/khoa.json và vào lần cuối
//                                                     trong lan của hồ sơ (lần đó phải chưa có mã băm). Mục đang khóa thì
//                                                     từ chối; khóa từng phần cũ của bản ghi phải còn khớp
//   node tools/khoa.mjs mo <mục> --ly-do "…"          gỡ khóa; ghi lý do và thêm một lần mới (để điền) vào lan của hồ sơ
//   node tools/khoa.mjs tinh [<mục>…]                 in mã băm; không có mục thì kiểm mọi mục đã khóa (lệch thì thoát 1)
//   node tools/khoa.mjs xuat <lô hay trang>… [--mau <n> | --con-lai] [--ra <file>]
//       danh sách nhận định cho lượt 2 (không nguồn, không kết quả; bỏ câu về chính site; trang Đọc thêm chỉ 5 nhận
//       định ngẫu nhiên mỗi trang; lời khuyên tập chỉ 3 câu mỗi trang hay bản ghi); --con-lai: chỉ phần còn thiếu sau khi
//       đã nhập kết quả (mẫu chưa đủ, hay mẫu có câu sai nên phải kiểm mọi câu còn lại);
//       --mau n: n nhận định chọn ngẫu nhiên, kèm nguồn,
//       cho chủ repo kiểm mẫu. Lô ("D3-L2", trang lấy từ plans/lam-lai/anh-xa.md) thì mặc định ghi vào
//       plans/lam-lai/bao-cao/d3-l2-nhan-dinh.yml (với --mau: d3-l2-kiem-mau.yml); trang thì in ra màn hình
//   node tools/khoa.mjs nhap <file kết quả lượt 2>
//       đưa kết quả lượt 2 (danh sách { trang, id, luot_2: dung|sai|khong-chac, nguon: [link], cau_dung?, ghi_chu? },
//       plans/lam-lai/loi-giao/luot-2-trang.md) vào hồ sơ: luot_2 của từng nhận định, kèm luot_2_nguon, luot_2_ghi_chu. Kiểm hết trước,
//       một dòng sai thì không ghi gì. In các nhận định cần review (hai lượt khác nhau, lượt 1 đã sửa, bỏ hay chưa có kết quả)
//       và số nhận định còn thiếu lượt 2 trong các hồ sơ ấy
// <mục>: đường dẫn trang ("nhac-ly/10-hop-am-ba", "nhac-ly/index", "index", "404") hay bản ghi "du-lieu/<bộ>/<id>"
// ("du-lieu/tac-pham/fur-elise"). Khóa từng phần bản ghi: "du-lieu/<bộ>/<id>#<trường>,<trường>" (chỉ các trường đã kiểm
// định, chuan-kiem-dinh.md mục 6); khóa cả bản ghi thì thay các khóa từng phần của nó. Hồ sơ vẫn là một file cho mỗi
// bản ghi. --goc <thư mục>: chạy trên bản chép của repo (kiểm thử).
import { execFileSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parse, parseDocument, stringify } from 'yaml';
import { schema } from '../src/du-lieu.mjs';
import { GOC, chuanKhoaBanGhi, docBanGhi, docKhoa, fileTrang, maBamKhoaBanGhi, maBamTrang, tachKhoaBanGhi } from '../src/khoa.mjs';

const KET_QUA = ['dung', 'da-sua', 'da-bo', 'khong-can-nguon'];
const LUOT_2 = ['dung', 'sai', 'khong-chac'];
const KET_QUA_KHUONG = ['dung', 'da-sua'];
/** Trang Đọc thêm (tầng ngoại vi): lượt 2 chỉ kiểm mẫu, chừng này nhận định mỗi trang (chuan-kiem-dinh.md mục 3). */
export const MAU_NGOAI_VI = 5;
/** Lời khuyên tập (loai khuyen-tap): lượt 2 chỉ kiểm mẫu, chừng này câu mỗi trang hay bản ghi (chuan-kiem-dinh.md mục 3). */
export const MAU_KHUYEN_TAP = 3;
/** Câu nói về chính site (loai ve-site): review kiểm trên trang và dữ liệu, không qua lượt 2. */
const VE_SITE = 've-site';

/** Tầng của trang trong src/data/trang.yml, hay null nếu trang không có ở đó (như trang 404). */
const tangTrong = (muc, goc) => (parse(fs.readFileSync(path.join(goc, 'src/data/trang.yml'), 'utf8')) ?? []).find((r) => r.id === muc)?.tang ?? null;

/** `n` phần tử chọn ngẫu nhiên của `ds` (cả `ds` nếu ít hơn). */
const chonNgauNhien = (ds, n) => {
	const conLai = [...ds];
	const ra = [];
	while (ra.length < n && conLai.length) ra.push(conLai.splice(randomInt(conLai.length), 1)[0]);
	return ra;
};

/** Mục là bản ghi ("du-lieu/<bộ>/<id>[#<trường>,…]")? Trả về khóa viết chuẩn ("<bộ>/<id>[#…]") hay null. */
const laBanGhi = (muc) => (muc.startsWith('du-lieu/') ? chuanKhoaBanGhi(muc.slice('du-lieu/'.length)) : null);
/** Hồ sơ của mục: một file cho mỗi trang hay mỗi bản ghi (khóa từng phần dùng chung hồ sơ của bản ghi). */
const fileHoSo = (muc, goc) => path.join(goc, 'kiem-dinh', `${muc.split('#')[0]}.yml`);
/** Ngày theo giờ máy (không theo UTC: ở Việt Nam, trước 7 giờ sáng UTC còn là hôm trước). */
const homNay = () => {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
/** Trường của từng bộ dữ liệu theo schema (src/du-lieu.mjs): khóa từng phần chỉ nhận các tên này. */
const TRUONG = Object.fromEntries(Object.entries(schema).map(([bo, s]) => [bo, Object.keys(s.shape)]));
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
		const ma = maBamKhoaBanGhi(bg, goc);
		if (!ma) throw new Error(`không có bản ghi ${tachKhoaBanGhi(bg).banGhi} trong src/data/`);
		return ma;
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
	const bg = laBanGhi(muc) && tachKhoaBanGhi(laBanGhi(muc)).banGhi;
	if (bg ? hs.ban_ghi !== bg : hs.trang !== `src/content/docs/${muc}.md`)
		loi.push(bg ? `ban_ghi phải là "${bg}"` : `trang phải là "src/content/docs/${muc}.md"`);
	if (!Array.isArray(hs.lan) || !hs.lan.length) loi.push('thiếu lan (các lần kiểm định)');
	else for (const k of NGUOI) if (!hs.lan.at(-1).nguoi?.[k]) loi.push(`lần kiểm định cuối: thiếu nguoi.${k}`);
	// tầng lấy từ src/data/trang.yml (mức kiểm theo tầng): hồ sơ ghi khác thì sửa hồ sơ, không tin hồ sơ
	const tang = bg ? null : tangTrong(muc, goc);
	if (!bg && (hs.tang ?? null) !== tang) loi.push(`hồ sơ ghi tang: ${hs.tang ?? null} mà src/data/trang.yml ghi ${tang}: sửa tang trong hồ sơ`);
	// chỉ trang khung (và trang 404, không có tầng) được khóa với hồ sơ không có nhận định; khác thì cần ghi_chu giải thích
	if ((bg || (tang && tang !== 'khung')) && !(hs.nhan_dinh ?? []).length && !hs.ghi_chu)
		loi.push(`chưa có nhận định nào: ${bg ? 'bản ghi' : `trang tầng ${tang}`} cần ít nhất một nhận định đã kiểm, hay ghi_chu giải thích vì sao không có`);
	const nguon = new Set((hs.nguon ?? []).map((n) => n.id));
	// lượt 2 chỉ kiểm mẫu ở trang Đọc thêm (mọi nhận định) và ở lời khuyên tập; câu về chính site không qua lượt 2
	const motLuot = tang === 'ngoai-vi';
	const mauLuot2 = (n) => motLuot || n.loai === 'khuyen-tap' || n.loai === VE_SITE;
	for (const n of hs.nhan_dinh ?? []) {
		const ten = `nhận định ${n.id ?? '(không id)'}`;
		if (!n.id || !n.cau) loi.push(`${ten}: thiếu id hay cau`);
		if (!KET_QUA.includes(n.ket_qua)) loi.push(`${ten}: ket_qua phải là ${KET_QUA.join(', ')}`);
		if (!LUOT_2.includes(n.luot_2) && !(mauLuot2(n) && n.luot_2 == null)) loi.push(`${ten}: chưa có kết quả lượt 2 (luot_2: ${LUOT_2.join(', ')})`);
		if ((n.ket_qua === 'da-sua' || n.ket_qua === 'da-bo') && !n.ghi_chu) loi.push(`${ten}: ${n.ket_qua} cần ghi_chu`);
		if (n.ket_qua === 'khong-can-nguon' && n.loai !== 'khuyen-tap') loi.push(`${ten}: khong-can-nguon chỉ cho loai khuyen-tap`);
		// câu về chính site: review kiểm trên trang, thành phần hay dữ liệu đã khóa và ghi kết quả (review); ghi_chu ghi đã
		// kiểm ở đâu. Không qua lượt 2, nên không cho dùng để né lượt 2: không có ở bản ghi dữ liệu, không kèm nguồn ngoài
		if (n.loai === VE_SITE) {
			if (bg) loi.push(`${ten}: bản ghi dữ liệu không có câu về chính site (mọi điều trong dữ liệu cần nguồn)`);
			if (n.nguon?.length) loi.push(`${ten}: câu về chính site không ghi nguồn ngoài; có điều cần nguồn ngoài thì xếp loại khác (qua lượt 2)`);
			if (!n.ghi_chu) loi.push(`${ten}: câu về chính site cần ghi_chu ghi đã kiểm trên trang, thành phần hay dữ liệu nào`);
			if (!['dung', 'sai'].includes(n.review)) loi.push(`${ten}: câu về chính site cần kết quả review (review: dung hay sai)`);
			if (n.review === 'sai' && n.ket_qua === 'dung') loi.push(`${ten}: review ghi sai mà kết quả dung: sửa câu (da-sua) hay bỏ (da-bo)`);
		}
		if (n.ket_qua !== 'khong-can-nguon' && n.ket_qua !== 'da-bo' && n.loai !== VE_SITE) {
			if (!n.nguon?.length) loi.push(`${ten}: thiếu nguon`);
			for (const id of n.nguon ?? []) if (!nguon.has(id)) loi.push(`${ten}: nguồn "${id}" không có trong danh sách nguon`);
		}
		if ((n.luot_2 === 'sai' || n.luot_2 === 'khong-chac') && n.ket_qua === 'dung' && !n.ghi_chu)
			loi.push(`${ten}: lượt 2 cho "${n.luot_2}" mà kết quả "dung": ghi_chu cách đã giải quyết`);
	}
	// lời khuyên tập (trang không phải Đọc thêm): lượt 2 kiểm mẫu MAU_KHUYEN_TAP câu; mẫu có câu sai thì kiểm hết các câu ấy
	const khuyen = motLuot ? [] : (hs.nhan_dinh ?? []).filter((n) => n.loai === 'khuyen-tap');
	if (khuyen.length) {
		const co = khuyen.filter((n) => LUOT_2.includes(n.luot_2)).length;
		const sai = khuyen.some((n) => n.luot_2 === 'sai');
		const can = sai ? khuyen.length : Math.min(MAU_KHUYEN_TAP, khuyen.length);
		if (co < can)
			loi.push(sai ? `lời khuyên tập: mẫu lượt 2 có câu sai, nên lượt 2 phải kiểm mọi lời khuyên tập (mới có ${co}/${can})` : `lời khuyên tập: lượt 2 phải kiểm mẫu ít nhất ${can} câu (mới có ${co})`);
	}
	if (motLuot) {
		const ds = (hs.nhan_dinh ?? []).filter((n) => n.loai !== VE_SITE);
		const co = ds.filter((n) => LUOT_2.includes(n.luot_2)).length;
		// mẫu có nhận định sai thì lượt 2 kiểm cả trang (chuan-kiem-dinh.md mục 3)
		const can = ds.some((n) => n.luot_2 === 'sai') ? ds.length : Math.min(MAU_NGOAI_VI, ds.length);
		if (co < can)
			loi.push(can === ds.length && ds.some((n) => n.luot_2 === 'sai') ? `trang Đọc thêm: mẫu lượt 2 có nhận định sai, nên lượt 2 phải kiểm cả trang (mới có ${co}/${can})` : `trang Đọc thêm: lượt 2 phải kiểm mẫu ít nhất ${can} nhận định (mới có ${co})`);
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

/**
 * Nhận định của hồ sơ cần lượt 2, theo mức của tầng (chuan-kiem-dinh.md mục 3): mọi nhận định cần nguồn; lời khuyên tập
 * và trang Đọc thêm thì một mẫu (`chon(ds, k)` chọn k câu); câu về chính site không qua lượt 2. `conLai`: chỉ phần còn
 * thiếu, tính cả kết quả lượt 2 đã nhập: mẫu chưa đủ thì thêm cho đủ, mẫu đã có câu sai thì mọi câu còn lại.
 */
function conCanLuot2(hs, chon = chonNgauNhien, conLai = false) {
	const co = (n) => conLai && LUOT_2.includes(n.luot_2);
	const mau = (nhom, k) => {
		const chua = nhom.filter((n) => !co(n));
		if (conLai && nhom.some((n) => n.luot_2 === 'sai')) return chua;
		return chon(chua, Math.max(0, Math.min(k, nhom.length) - nhom.filter(co).length));
	};
	const ds = (hs.nhan_dinh ?? []).filter((n) => n.loai !== VE_SITE);
	if (hs.tang === 'ngoai-vi') return mau(ds, MAU_NGOAI_VI);
	return [...ds.filter((n) => n.loai !== 'khuyen-tap' && !co(n)), ...mau(ds.filter((n) => n.loai === 'khuyen-tap'), MAU_KHUYEN_TAP)];
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
	if (bg) return dau + stringify({ ban_ghi: tachKhoaBanGhi(bg).banGhi, lan: [lanMoi(1, goc)], nguon: [], nhan_dinh: [] });
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

/**
 * Ghi ngày, nhánh và mã băm vào lần cuối trong lan của hồ sơ (lần đó chưa có mã băm: khoa đã kiểm); khóa từng phần
 * thì ghi cả các trường đã khóa.
 */
function ghiLan(fHoSo, ma, goc, truong) {
	const doc = parseDocument(fs.readFileSync(fHoSo, 'utf8'));
	const cuoi = doc.get('lan').items.at(-1);
	for (const [k, v] of Object.entries({ ngay: homNay(), nhanh: nhanh(goc), ma_bam: ma })) cuoi.set(k, v);
	if (truong) cuoi.set('truong', doc.createNode(truong, { flow: true }));
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
			if (fs.existsSync(f)) {
				// hồ sơ đã có: chỉ bản ghi đang khóa từng phần được thêm lần mới (khóa thêm trường hay khóa cả bản ghi). Trang hay
				// bản ghi đang khóa thì phải mở khóa (lệnh mo tự thêm lần mới), để mọi lần sửa đều có lý do (chuẩn mục 7)
				const bg = laBanGhi(t);
				const ten = bg ? `du-lieu/${tachKhoaBanGhi(bg).banGhi}` : t;
				if (bg ? khoa.ban_ghi[tachKhoaBanGhi(bg).banGhi] : khoa.trang[t])
					throw new Error(`${ten} đang khóa: muốn sửa thì mở khóa trước (node tools/khoa.mjs mo ${ten} --ly-do "…"); lệnh mo tự thêm lần kiểm định mới vào hồ sơ`);
				const doc = parseDocument(fs.readFileSync(f, 'utf8'));
				const lan = doc.get('lan');
				if (!lan?.items.at(-1)?.get('ma_bam')) throw new Error(`${path.relative(goc, f)} đã có, lần cuối trong lan chưa khóa: điền lần đó rồi khóa`);
				lan.add(doc.createNode(lanMoi(lan.items.length + 1, goc)));
				fs.writeFileSync(f, doc.toString({ lineWidth: 0 }));
				in_(`đã thêm lần kiểm định ${lan.items.length} vào ${path.relative(goc, f)}`);
				continue;
			}
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
			const bg = laBanGhi(muc);
			const { banGhi, truong } = bg ? tachKhoaBanGhi(bg) : {};
			const mo = (x) => `node tools/khoa.mjs mo ${x} --ly-do "…"`;
			// đã khóa thì phải mở khóa trước (chuan-kiem-dinh.md mục 7): không khóa đè
			if (!bg && khoa.trang[muc]) throw new Error(`${muc}: trang đã khóa. Muốn sửa thì mở khóa trước: ${mo(muc)}`);
			if (bg && khoa.ban_ghi[banGhi]) throw new Error(`${muc}: bản ghi ${banGhi} đã khóa cả bản ghi. Muốn sửa thì mở khóa trước: ${mo(`du-lieu/${banGhi}`)}`);
			if (bg && khoa.ban_ghi[bg]) throw new Error(`${muc}: khóa này đã có. Muốn sửa thì mở khóa trước: ${mo(`du-lieu/${bg}`)}`);
			// khóa từng phần cũ của bản ghi phải còn khớp: khóa mới không được che chỗ đã sửa ở trường đã khóa
			const phanCu = bg ? Object.keys(khoa.ban_ghi).filter((k) => k.startsWith(`${banGhi}#`)) : [];
			for (const k of phanCu)
				if (maBamKhoaBanGhi(k, goc) !== khoa.ban_ghi[k]) throw new Error(`${muc}: khóa du-lieu/${k} đã lệch (trường đã khóa bị sửa). Mở khóa trước: ${mo(`du-lieu/${k}`)}`);
			if (truong) {
				const bo = banGhi.split('/')[0];
				const la = truong.filter((t) => !TRUONG[bo]?.includes(t));
				if (la.length) throw new Error(`${muc}: bộ ${bo} không có trường ${la.join(', ')} (trường có: ${(TRUONG[bo] ?? []).join(', ')})`);
				const r = docBanGhi(banGhi, goc);
				const chuaCo = r ? truong.filter((t) => !(t in r)) : [];
				if (chuaCo.length) in_(`  chú ý: bản ghi ${banGhi} chưa có trường ${chuaCo.join(', ')}; khóa vẫn giữ trường ấy chưa có`);
			}
			const hs = parse(fs.readFileSync(f, 'utf8')) ?? {};
			if (hs.lan?.at(-1)?.ma_bam)
				throw new Error(`${muc}: lần cuối trong lan của hồ sơ đã có mã băm. Trang hay bản ghi đã khóa thì sửa theo thủ tục mở khóa: node tools/khoa.mjs mo ${muc} --ly-do "…"`);
			const loi = loiHoSo(hs, muc, goc);
			if (loi.length) throw new Error(`${muc}: hồ sơ chưa đủ để khóa:\n- ${loi.join('\n- ')}`);
			const ma = maBamMuc(muc, goc);
			// khóa cả bản ghi thay mọi khóa từng phần cũ; khóa từng phần mới thay khóa cũ có các trường nằm trọn trong nó
			for (const k of phanCu) if (!truong || tachKhoaBanGhi(k).truong.every((t) => truong.includes(t))) delete khoa.ban_ghi[k];
			if (bg) khoa.ban_ghi[bg] = ma;
			else khoa.trang[muc] = ma;
			ghiLan(f, ma, goc, truong);
			ghiKhoa(khoa, goc);
			in_(`đã khóa ${muc} (${ma.slice(0, 19)}…)`);
			if (!bg) {
				const fm = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(fileTrang(muc, goc), 'utf8'));
				const slug = fm && parse(fm[1])?.tac_pham;
				// khóa từng phần cũng tính: chỉ thị đọc trường chưa khóa thì build báo (chiDaKhoa, src/du-lieu.mjs)
				if (slug && !Object.keys(khoa.ban_ghi).some((k) => k.split('#')[0] === `tac-pham/${slug}`))
					in_(`  chú ý: bản ghi tac-pham/${slug} của trang chưa khóa trường nào (node tools/khoa.mjs khoa du-lieu/tac-pham/${slug}…)`);
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
		if (!(k in bang)) {
			const banGhi = bg && tachKhoaBanGhi(bg).banGhi;
			if (bg && banGhi !== bg && khoa.ban_ghi[banGhi]) throw new Error(`${muc} chưa khóa riêng: bản ghi đang khóa cả bản ghi, mở bằng: node tools/khoa.mjs mo du-lieu/${banGhi} --ly-do "…"`);
			const phan = bg ? Object.keys(khoa.ban_ghi).filter((x) => x.startsWith(`${banGhi}#`)) : [];
			throw new Error(`${muc} chưa khóa` + (phan.length ? `; bản ghi đang khóa từng phần: ${phan.map((x) => `du-lieu/${x}`).join(', ')}` : ''));
		}
		// lý do mở khóa ghi vào hồ sơ: không có hồ sơ, hay hồ sơ hỏng, thì không mở (đọc hồ sơ trước khi gỡ khóa)
		const f = fileHoSo(muc, goc);
		if (!fs.existsSync(f)) throw new Error(`${muc}: không có hồ sơ ${path.relative(goc, f)} để ghi lý do mở khóa`);
		const doc = parseDocument(fs.readFileSync(f, 'utf8'));
		if (doc.errors.length || !doc.get('lan')?.items) throw new Error(`${muc}: hồ sơ ${path.relative(goc, f)} hỏng (đọc YAML lỗi hay thiếu lan): sửa hồ sơ trước khi mở khóa`);
		delete bang[k];
		ghiKhoa(khoa, goc);
		if (!doc.has('mo_khoa')) doc.set('mo_khoa', doc.createNode([]));
		doc.get('mo_khoa').add(doc.createNode({ ngay: homNay(), nhanh: nhanh(goc), ly_do: lyDo }));
		const lan = doc.get('lan');
		lan.add(doc.createNode(lanMoi(lan.items.length + 1, goc)));
		fs.writeFileSync(f, doc.toString({ lineWidth: 0 }));
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
		const iConLai = con.indexOf('--con-lai');
		const conLai = iConLai >= 0 && Boolean(con.splice(iConLai, 1));
		const lo = con.length === 1 && maLo(con[0]);
		const ra = lay('--ra') ?? (lo ? `plans/lam-lai/bao-cao/${lo.toLowerCase()}-${mau ? 'kiem-mau' : 'nhan-dinh'}.yml` : undefined);
		const tatCa = [];
		for (const t of con.flatMap((x) => (maLo(x) ? trangCuaLo(x, goc) : [x]))) {
			const f = fileHoSo(t, goc);
			if (!fs.existsSync(f)) throw new Error(`${t}: chưa có hồ sơ`);
			const hs = parse(fs.readFileSync(f, 'utf8')) ?? {};
			const nguon = new Map((hs.nguon ?? []).map((n) => [n.id, n]));
			// kiểm mẫu của chủ repo: mọi nhận định; lượt 2: những nhận định còn cần lượt 2 (conCanLuot2)
			const cho = mau ? (hs.nhan_dinh ?? []) : conCanLuot2(hs, chonNgauNhien, conLai);
			for (const n of cho)
				tatCa.push(
					mau
						? { trang: t, id: n.id, cau: n.cau, loai: n.loai, nguon: (n.nguon ?? []).map((id) => ({ ten: nguon.get(id)?.ten, link: nguon.get(id)?.link })), ket_qua_luot_1: n.ket_qua, ...(n.ghi_chu && { ghi_chu: n.ghi_chu }) }
						: { trang: t, id: n.id, cau: n.cau, loai: n.loai },
				);
		}
		const ds = mau ? chonNgauNhien(tatCa, mau) : tatCa;
		const chu = stringify(ds, { lineWidth: 0 });
		if (ra) {
			fs.mkdirSync(path.dirname(path.resolve(goc, ra)), { recursive: true });
			fs.writeFileSync(path.resolve(goc, ra), chu);
			in_(`đã ghi ${ds.length} nhận định vào ${ra}`);
		} else in_(chu.trimEnd());
		return 0;
	}
	if (viec === 'nhap') {
		const [file] = con;
		if (!file) throw new Error('cần file kết quả lượt 2, ví dụ plans/lam-lai/bao-cao/d3-l2-luot-2.yml');
		const ds = parse(fs.readFileSync(path.resolve(goc, file), 'utf8'));
		if (!Array.isArray(ds)) throw new Error(`${file}: phải là danh sách kết quả`);
		const loi = [];
		const hoSo = new Map(); // file hồ sơ -> { doc, dong: [[nhận định, dòng kết quả]] }, hay null nếu hồ sơ không nhập được
		const daGap = new Set();
		ds.forEach((d, i) => {
			const ten = `dòng ${i + 1} (${d?.trang ?? '?'}, ${d?.id ?? '?'})`;
			if (!d?.trang || !d?.id) return loi.push(`${ten}: thiếu trang hay id`);
			if (!LUOT_2.includes(d.luot_2)) return loi.push(`${ten}: luot_2 phải là ${LUOT_2.join(', ')}`);
			// `nguon:` để trống (null) như không ghi
			if (d.nguon != null && (!Array.isArray(d.nguon) || d.nguon.some((x) => typeof x !== 'string')))
				return loi.push(`${ten}: nguon phải là danh sách link`);
			if (d.luot_2 === 'sai' && !d.cau_dung && !d.ghi_chu) loi.push(`${ten}: sai cần cau_dung hay ghi_chu`);
			if (daGap.has(`${d.trang}#${d.id}`)) return loi.push(`${ten}: trùng dòng trước`);
			daGap.add(`${d.trang}#${d.id}`);
			const f = fileHoSo(d.trang, goc);
			if (!hoSo.has(f)) {
				// hồ sơ hỏng hay đã khóa thì không nhập vào (báo một lần cho mỗi hồ sơ)
				let doc = null;
				if (!fs.existsSync(f)) loi.push(`${ten}: chưa có hồ sơ ${path.relative(goc, f)}`);
				else {
					doc = parseDocument(fs.readFileSync(f, 'utf8'));
					if (doc.errors.length) loi.push(`${ten}: hồ sơ ${path.relative(goc, f)} đọc YAML lỗi (${doc.errors[0].message})`), (doc = null);
					else if (doc.get('lan')?.items?.at(-1)?.get('ma_bam'))
						loi.push(`${ten}: hồ sơ ${path.relative(goc, f)} đã khóa (lần cuối trong lan có mã băm): mở khóa trước`), (doc = null);
				}
				hoSo.set(f, doc && { doc, dong: [] });
			}
			const hs = hoSo.get(f);
			if (!hs) return;
			const trungId = (hs.doc.get('nhan_dinh')?.items ?? []).filter((x) => x.get('id') === d.id);
			if (trungId.length > 1) return loi.push(`${ten}: hồ sơ có ${trungId.length} nhận định cùng id ${d.id}`);
			const nd = trungId[0];
			if (!nd) return loi.push(`${ten}: hồ sơ không có nhận định ${d.id}`);
			// lời khuyên tập (khuyen-tap) không cần nguồn
			if (d.luot_2 !== 'khong-chac' && !d.nguon?.length && nd.get('loai') !== 'khuyen-tap') loi.push(`${ten}: ${d.luot_2} cần nguon (link đã mở)`);
			hs.dong.push([nd, d]);
		});
		if (loi.length) throw new Error(`${file}: chưa nhập gì, vì:\n- ${loi.join('\n- ')}`);
		const dem = Object.fromEntries(LUOT_2.map((k) => [k, 0]));
		const canReview = [];
		let thieu = 0;
		// dựng hết rồi mới ghi: lỗi lúc dựng thì chưa file nào bị ghi
		const ghiRa = [];
		for (const [f, { doc, dong }] of hoSo) {
			for (const [nd, d] of dong) {
				nd.set('luot_2', d.luot_2);
				// nhập lại thì thay hẳn phần của lượt 2, không để sót link hay ghi chú của lần trước
				nd.delete('luot_2_nguon');
				nd.delete('luot_2_ghi_chu');
				if (d.nguon?.length) nd.set('luot_2_nguon', doc.createNode(d.nguon, { flow: true }));
				const ghiChu = [d.cau_dung && `câu đúng: ${d.cau_dung}`, d.ghi_chu].filter(Boolean).join('; ');
				if (ghiChu) nd.set('luot_2_ghi_chu', ghiChu);
				dem[d.luot_2]++;
				const kq = nd.get('ket_qua');
				if (d.luot_2 !== 'dung' || !['dung', 'khong-can-nguon'].includes(kq)) canReview.push(`${d.trang} ${d.id}: lượt 1 ${kq ?? 'chưa có kết quả'}, lượt 2 ${d.luot_2}`);
			}
			ghiRa.push([f, doc.toString({ lineWidth: 0 })]);
			thieu += conCanLuot2(doc.toJSON(), (ds, k) => ds.slice(0, k), true).length;
		}
		for (const [f, chu] of ghiRa) fs.writeFileSync(f, chu);
		in_(`đã nhập ${ds.length} kết quả lượt 2 vào ${hoSo.size} hồ sơ: ${LUOT_2.map((k) => `${dem[k]} ${k}`).join(', ')}`);
		if (thieu) in_(`các hồ sơ ấy còn ${thieu} nhận định cần lượt 2 (theo mức của tầng): xuất phần còn thiếu bằng node tools/khoa.mjs xuat … --con-lai`);
		if (canReview.length) in_(`cần review (${canReview.length}):\n  ${canReview.join('\n  ')}`);
		return 0;
	}
	throw new Error('việc phải là mau, khoa, mo, tinh, xuat hay nhap (xem đầu file tools/khoa.mjs)');
}

// import.meta.main: đúng cả khi đường dẫn script đi qua liên kết tượng trưng (/tmp trên macOS)
if (import.meta.main) {
	try {
		process.exit(lenh(process.argv.slice(2)));
	} catch (e) {
		console.error(e.message);
		process.exit(1);
	}
}
