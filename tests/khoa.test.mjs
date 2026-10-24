// Kiểm thử khóa (D1.6): mã băm (chuẩn hóa nguồn, JSON của bản ghi), mọi mục trong kiem-dinh/khoa.json còn khớp và có hồ sơ
// đủ, công cụ tools/khoa.mjs (mẫu, khóa, tính, mở, xuất) trên một bản chép nhỏ, lọc trang theo bản build, và trên bản build:
// trang đã khóa không có dải "Chưa kiểm định" hay ô "chưa chuyển" (hình, công cụ chưa có thành phần), trang chưa khóa (chỉ
// ở bản xem) có dải.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse, stringify } from 'yaml';
import { locTheoBan } from '../src/ban-build.mjs';
import { chiDaKhoa, schema } from '../src/du-lieu.mjs';
import { chuanHoaTrang, docKhoa, jsonChuan, kiemKhoa, maBamBanGhi, maBamTrang, truongDaKhoa } from '../src/khoa.mjs';
import { MAU_NGOAI_VI, lenh, loiHoSo } from '../tools/khoa.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

test('mã băm của trang không đổi theo kiểu xuống dòng, khoảng trắng cuối dòng, số dòng trống cuối file', () => {
	const goc = '---\ntitle: A\n---\n\nChữ.\n';
	assert.equal(chuanHoaTrang('---\r\ntitle: A  \r\n---\r\n\r\nChữ.\t\r\n\r\n\r\n'), goc);
	assert.equal(maBamTrang(goc), maBamTrang('---\ntitle: A\n---\n\nChữ.'));
	assert.notEqual(maBamTrang(goc), maBamTrang(goc.replace('Chữ.', 'Chữ!')));
	assert.match(maBamTrang(goc), /^sha256:[0-9a-f]{64}$/);
});

test('mã băm của bản ghi không đổi theo thứ tự khóa, ở mọi cấp', () => {
	assert.equal(jsonChuan({ b: 1, a: { d: [2, { y: 1, x: 2 }], c: 'ê' } }), '{"a":{"c":"ê","d":[2,{"x":2,"y":1}]},"b":1}');
	assert.equal(maBamBanGhi({ slug: 'x', ten: 'A' }), maBamBanGhi({ ten: 'A', slug: 'x' }));
	assert.notEqual(maBamBanGhi({ slug: 'x', ten: 'A' }), maBamBanGhi({ slug: 'x', ten: 'B' }));
});

test('mọi mục trong kiem-dinh/khoa.json còn khớp mã băm và có hồ sơ đủ', () => {
	assert.deepEqual(kiemKhoa(), []);
	const { trang, ban_ghi } = docKhoa();
	assert.ok('index' in trang && '404' in trang, 'trang chủ tạm và trang 404 phải được khóa (D1.6)');
	for (const muc of [...Object.keys(trang), ...Object.keys(ban_ghi).map((k) => `du-lieu/${k}`)]) {
		const f = path.join(ROOT, 'kiem-dinh', `${muc.split('#')[0]}.yml`);
		assert.ok(fs.existsSync(f), `${muc}: thiếu hồ sơ kiem-dinh/${muc}.yml`);
		const hs = parse(fs.readFileSync(f, 'utf8'));
		assert.deepEqual(loiHoSo(hs, muc, ROOT), [], `hồ sơ của ${muc} chưa đủ`);
		const [, bo, truong] = /^du-lieu\/([^/]+)\/[^#]+(?:#(.+))?$/.exec(muc) ?? [];
		for (const t of truong?.split(',') ?? []) assert.ok(t in schema[bo].shape, `${muc}: bộ ${bo} không có trường ${t}`);
		// trang: lần cuối ghi mã băm đang khóa; bản ghi khóa từng phần qua nhiều lần: một lần nào đó ghi mã băm của khóa ấy
		if (muc.startsWith('du-lieu/')) assert.ok(hs.lan.some((l) => l.ma_bam === ban_ghi[muc.slice(8)]), `${muc}: hồ sơ không có lần nào ghi mã băm đang khóa`);
		else assert.equal(hs.lan.at(-1).ma_bam, trang[muc], `${muc}: lần cuối trong hồ sơ phải ghi mã băm đang khóa`);
	}
});

test('công cụ khóa trên bản chép nhỏ: mẫu, khóa (đòi hồ sơ đủ), tính, mở khóa, khóa lại, xuất nhận định', () => {
	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-khoa-'));
	try {
		const ghi = (f, chu) => {
			fs.mkdirSync(path.dirname(path.join(goc, f)), { recursive: true });
			fs.writeFileSync(path.join(goc, f), chu);
		};
		ghi('src/content/docs/nhac-ly/a.md', '---\ntitle: A\n---\n\nChữ.\n\n```abc\nX:1\nK:C\nC|\n```\n');
		ghi('src/data/trang.yml', '- id: nhac-ly/a\n  tang: loi\n');
		ghi('src/data/tac-pham.yml', '- slug: x\n  loai: nghe\n  ten: X\n');
		ghi('plans/lam-lai/anh-xa.md', '### D9-L1 (1 trang)\n\n| Trang cũ | Tầng |\n|---|---|\n| `nhac-ly/a` | lõi |\n\n### D9-L2 (1 trang)\n');
		const chay = (...ts) => lenh([...ts, '--goc', goc], ROOT, () => {});
		const doc = (f) => parse(fs.readFileSync(path.join(goc, f), 'utf8'));
		const khoaJson = () => doc('kiem-dinh/khoa.json');
		const fHoSo = path.join(goc, 'kiem-dinh/nhac-ly/a.yml');
		/** Sửa hồ sơ: thay chuỗi hay biểu thức `cu` bằng `moi`. */
		const sua = (f, ...cap) => {
			let chu = fs.readFileSync(f, 'utf8');
			for (let i = 0; i < cap.length; i += 2) chu = chu.replace(cap[i], cap[i + 1]);
			fs.writeFileSync(f, chu);
		};
		const NGUOI = [/luot_1: null\n(\s+)luot_2: null\n(\s+)review: null\n(\s+)kiem_mau: null/, 'luot_1: agent A\n$1luot_2: agent B\n$2review: Claude\n$3kiem_mau: "chủ repo, 1/1"'];

		chay('mau', 'nhac-ly/a');
		const hs = parse(fs.readFileSync(fHoSo, 'utf8'));
		assert.equal(hs.tang, 'loi');
		assert.equal(hs.khuong_nhac.length, 1, 'mỗi khối abc một mục khuong_nhac');
		assert.throws(() => chay('mau', 'nhac-ly/a'), /đã có/);
		assert.throws(() => chay('khoa', 'nhac-ly/a'), /chưa đủ để khóa[\s\S]*thiếu nguoi\.luot_1[\s\S]*khuông nhạc khối 1: ket_qua/);

		// điền hồ sơ: chỗ đã sửa thiếu ghi chú, nhận định chưa qua lượt 2, lượt 2 "khong-chac" chưa giải quyết thì bị chặn
		const nhanDinh = (...ds) => sua(fHoSo, /nhan_dinh: \[\]|nhan_dinh:\n(  - .*\n?)+/, `nhan_dinh:\n${ds.map((d) => `  - { id: ${d}, loai: dinh-nghia, nguon: [s1] }`).join('\n')}\n`);
		sua(fHoSo, 'nguon: []', 'nguon:\n  - { id: s1, bac: 2, ten: Sách A }', /loai: null\n(\s+)kiem: \[\]\n(\s+)ket_qua: null/, 'loai: vi-du-soan\n$1kiem: [cu-phap]\n$2ket_qua: dung', ...NGUOI);
		nhanDinh('n1, cau: Câu một., luot_2: dung, ket_qua: dung', 'n2, cau: Câu hai., luot_2: sai, ket_qua: da-sua');
		assert.throws(() => chay('khoa', 'nhac-ly/a'), /n2: da-sua cần ghi_chu/);
		nhanDinh('n1, cau: Câu một., ket_qua: dung');
		assert.throws(() => chay('khoa', 'nhac-ly/a'), /n1: chưa có kết quả lượt 2/);
		nhanDinh('n1, cau: Câu một., luot_2: khong-chac, ket_qua: dung');
		assert.throws(() => chay('khoa', 'nhac-ly/a'), /n1: lượt 2 cho "khong-chac" mà kết quả "dung": ghi_chu/);
		nhanDinh('n1, cau: Câu một., luot_2: dung, ket_qua: dung');
		chay('khoa', 'nhac-ly/a');
		const ma = khoaJson().trang['nhac-ly/a'];
		assert.match(ma, /^sha256:/);
		assert.deepEqual(parse(fs.readFileSync(fHoSo, 'utf8')).lan.map((l) => l.ma_bam), [ma]);
		assert.equal(chay('tinh'), 0);
		assert.throws(() => chay('khoa', 'nhac-ly/a'), /trang đã khóa[\s\S]*mo nhac-ly\/a/);
		// không lách được thủ tục mở khóa: sửa trang đã khóa rồi mau, khoa thì bị chặn (review D1.6)
		assert.throws(() => chay('mau', 'nhac-ly/a'), /nhac-ly\/a đang khóa[\s\S]*mo nhac-ly\/a/);

		// sửa trang đã khóa: tính ra lệch; mở khóa gỡ khỏi khoa.json, ghi lý do, thêm lần mới để điền; điền rồi khóa lại
		fs.appendFileSync(path.join(goc, 'src/content/docs/nhac-ly/a.md'), '\nThêm.\n');
		assert.equal(chay('tinh'), 1);
		chay('mo', 'nhac-ly/a', '--ly-do', 'Có lỗi được báo');
		assert.deepEqual(khoaJson().trang, {});
		const moRa = parse(fs.readFileSync(fHoSo, 'utf8'));
		assert.equal(moRa.mo_khoa[0].ly_do, 'Có lỗi được báo');
		assert.deepEqual(moRa.lan.map((l) => [l.so, l.ma_bam]), [[1, ma], [2, null]]);
		assert.throws(() => chay('khoa', 'nhac-ly/a'), /thiếu nguoi\.review/);
		sua(fHoSo, ...NGUOI);
		chay('khoa', 'nhac-ly/a');
		const lan = parse(fs.readFileSync(fHoSo, 'utf8')).lan;
		assert.equal(lan.length, 2);
		assert.equal(lan[1].ma_bam, khoaJson().trang['nhac-ly/a']);
		assert.notEqual(lan[1].ma_bam, ma);

		// xuất danh sách nhận định cho lượt 2: không nguồn, không kết quả; theo lô thì ghi vào báo cáo của lô; --mau: kèm nguồn
		chay('xuat', 'nhac-ly/a', '--ra', 'xuat.yml');
		assert.deepEqual(doc('xuat.yml'), [{ trang: 'nhac-ly/a', id: 'n1', cau: 'Câu một.', loai: 'dinh-nghia' }]);
		chay('xuat', 'D9-L1');
		assert.deepEqual(doc('plans/lam-lai/bao-cao/d9-l1-nhan-dinh.yml'), doc('xuat.yml'));
		chay('xuat', 'd9-l1', '--mau', '5');
		const mau = doc('plans/lam-lai/bao-cao/d9-l1-kiem-mau.yml');
		assert.equal(mau[0].nguon[0].ten, 'Sách A');
		assert.equal(mau[0].ket_qua_luot_1, 'dung');
		assert.throws(() => chay('xuat', 'D9-L3'), /không có lô D9-L3/);

		// bản ghi dữ liệu: hồ sơ mẫu, khóa theo bản ghi; bản ghi không có thì báo lỗi
		assert.throws(() => chay('mau', 'du-lieu/tac-pham/khong-co'), /không có bản ghi tac-pham\/khong-co/);
		chay('mau', 'du-lieu/tac-pham/x');
		const fBanGhi = path.join(goc, 'kiem-dinh/du-lieu/tac-pham/x.yml');
		assert.equal(parse(fs.readFileSync(fBanGhi, 'utf8')).ban_ghi, 'tac-pham/x');
		sua(fBanGhi, ...NGUOI);
		assert.throws(() => chay('khoa', 'du-lieu/tac-pham/x#ten'), /chưa có nhận định nào: bản ghi cần ít nhất một nhận định/);
		sua(fBanGhi, 'nguon: []', 'nguon:\n  - { id: s1, bac: 2, ten: Sách A }', 'nhan_dinh: []', 'nhan_dinh:\n  - { id: n1, cau: Tên X., loai: ten-goi, nguon: [s1], luot_2: dung, ket_qua: dung }');
		// khóa từng phần: chỉ các trường đã kiểm định (đợt 2 khóa vài trường của bản ghi tác phẩm, đợt 6 khóa cả bản ghi)
		assert.throws(() => chay('khoa', 'du-lieu/tac-pham/x#ten,chnag'), /bộ tac-pham không có trường chnag/);
		chay('khoa', 'du-lieu/tac-pham/x#ten, loai,ten');
		assert.deepEqual(Object.keys(khoaJson().ban_ghi), ['tac-pham/x#loai,ten'], 'trường xếp theo chữ cái, không trùng');
		assert.deepEqual(parse(fs.readFileSync(fBanGhi, 'utf8')).lan.at(-1).truong, ['loai', 'ten']);
		const fTacPham = path.join(goc, 'src/data/tac-pham.yml');
		sua(fTacPham, 'ten: X\n', 'ten: X\n  grade: G\n');
		assert.deepEqual(kiemKhoa(goc), [], 'trường chưa khóa sửa tự do');
		assert.throws(() => chay('khoa', 'du-lieu/tac-pham/x#loai,ten'), /khóa này đã có/);
		sua(fTacPham, 'ten: X', 'ten: Z');
		assert.match(kiemKhoa(goc).join(), /bản ghi tac-pham\/x#loai,ten đã khóa mà đã đổi/);
		sua(fTacPham, 'ten: Z', 'ten: X');
		assert.throws(() => chay('mo', 'du-lieu/tac-pham/x', '--ly-do', 'thử'), /chưa khóa; bản ghi đang khóa từng phần: du-lieu\/tac-pham\/x#loai,ten/);
		// khóa thêm trường: lần kiểm định mới (mau thêm vào hồ sơ của bản ghi đang khóa từng phần), rồi khóa; khóa cũ nằm trọn
		// trong khóa mới thì được thay
		assert.throws(() => chay('khoa', 'du-lieu/tac-pham/x#grade,loai,ten'), /đã có mã băm/);
		chay('mau', 'du-lieu/tac-pham/x');
		assert.equal(parse(fs.readFileSync(fBanGhi, 'utf8')).lan.length, 2);
		assert.throws(() => chay('mau', 'du-lieu/tac-pham/x'), /lần cuối trong lan chưa khóa/);
		sua(fBanGhi, ...NGUOI);
		// khóa rời (không chứa khóa cũ): khóa cũ vẫn còn
		chay('khoa', 'du-lieu/tac-pham/x#grade');
		assert.deepEqual(Object.keys(khoaJson().ban_ghi), ['tac-pham/x#grade', 'tac-pham/x#loai,ten'], 'khóa rời không thay khóa cũ');
		chay('mau', 'du-lieu/tac-pham/x');
		sua(fBanGhi, ...NGUOI);
		chay('khoa', 'du-lieu/tac-pham/x#grade,loai,ten');
		assert.deepEqual(Object.keys(khoaJson().ban_ghi), ['tac-pham/x#grade,loai,ten'], 'khóa từng phần mới thay khóa cũ nằm trọn trong nó');
		// khóa cả bản ghi khi một trường đã khóa bị sửa: bị chặn, phải mở khóa trước (review D1.6)
		chay('mau', 'du-lieu/tac-pham/x');
		sua(fBanGhi, ...NGUOI);
		sua(fTacPham, 'ten: X', 'ten: Z');
		assert.throws(() => chay('khoa', 'du-lieu/tac-pham/x'), /khóa du-lieu\/tac-pham\/x#grade,loai,ten đã lệch[\s\S]*mo du-lieu\/tac-pham\/x#grade,loai,ten/);
		sua(fTacPham, 'ten: Z', 'ten: X');
		chay('khoa', 'du-lieu/tac-pham/x');
		assert.deepEqual(Object.keys(khoaJson().ban_ghi), ['tac-pham/x'], 'khóa cả bản ghi thay khóa từng phần');
		assert.throws(() => chay('mau', 'du-lieu/tac-pham/x'), /du-lieu\/tac-pham\/x đang khóa/);
		assert.throws(() => chay('khoa', 'du-lieu/tac-pham/x#ten'), /đã khóa cả bản ghi/);
		assert.throws(() => chay('mo', 'du-lieu/tac-pham/x#ten', '--ly-do', 'thử'), /đang khóa cả bản ghi, mở bằng: node tools\/khoa\.mjs mo du-lieu\/tac-pham\/x /);
		// hồ sơ hỏng (sửa tay mất lan): mo từ chối trước khi gỡ khóa
		const giuBanGhi = fs.readFileSync(fBanGhi);
		sua(fBanGhi, /^lan:\n(?:[ -].*\n)+/m, '');
		assert.throws(() => chay('mo', 'du-lieu/tac-pham/x', '--ly-do', 'thử'), /hồ sơ .* hỏng/);
		assert.ok('tac-pham/x' in khoaJson().ban_ghi, 'khóa còn nguyên');
		fs.writeFileSync(fBanGhi, giuBanGhi);
		// mở khóa phải ghi được lý do vào hồ sơ: không có hồ sơ thì không mở
		const giu = fs.readFileSync(fHoSo);
		fs.rmSync(fHoSo);
		assert.throws(() => chay('mo', 'nhac-ly/a', '--ly-do', 'thử'), /không có hồ sơ kiem-dinh\/nhac-ly\/a\.yml/);
		assert.ok('nhac-ly/a' in khoaJson().trang, 'khóa còn nguyên');
		fs.writeFileSync(fHoSo, giu);
		assert.equal(chay('tinh'), 0);

		// build hỏng khi mục đã khóa đổi hay mất (kiemKhoa; src/content.config.ts gọi lúc nạp cấu hình)
		assert.deepEqual(kiemKhoa(goc), []);
		sua(path.join(goc, 'src/data/tac-pham.yml'), 'ten: X', 'ten: Y');
		fs.rmSync(path.join(goc, 'src/content/docs/nhac-ly/a.md'));
		const loi = kiemKhoa(goc);
		assert.equal(loi.length, 2);
		assert.match(loi[0], /trang nhac-ly\/a đã khóa nhưng không còn file src\/content\/docs\/nhac-ly\/a\.md/);
		assert.match(loi[1], /bản ghi tac-pham\/x đã khóa mà đã đổi[\s\S]*node tools\/khoa\.mjs mo du-lieu\/tac-pham\/x/);
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});

test('trang Đọc thêm (ngoại vi): một lượt, lượt 2 chỉ kiểm mẫu khoảng 5 nhận định mỗi trang (chuan-kiem-dinh.md mục 3)', () => {
	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-khoa-nv-'));
	try {
		const ghi = (f, chu) => {
			fs.mkdirSync(path.dirname(path.join(goc, f)), { recursive: true });
			fs.writeFileSync(path.join(goc, f), chu);
		};
		ghi('src/content/docs/lich-su/opera.md', '---\ntitle: Opera\n---\n\nChữ.\n');
		ghi('src/data/trang.yml', '- id: lich-su/opera\n  tang: ngoai-vi\n');
		const chay = (...ts) => lenh([...ts, '--goc', goc], ROOT, () => {});
		chay('mau', 'lich-su/opera');
		const f = path.join(goc, 'kiem-dinh/lich-su/opera.yml');
		const nhanDinh = (soLuot2) =>
			Array.from({ length: 7 }, (_, i) => `  - { id: n${i + 1}, cau: Câu ${i + 1}., loai: lich-su, nguon: [s1], ket_qua: dung${i < soLuot2 ? ', luot_2: dung' : ''} }`).join('\n');
		const dien = (soLuot2) =>
			fs.writeFileSync(
				f,
				fs
					.readFileSync(f, 'utf8')
					.replace(/nhan_dinh:(?: \[\]|\n(?:  - .*\n?)+)/, `nhan_dinh:\n${nhanDinh(soLuot2)}\n`)
					.replace('nguon: []', 'nguon:\n  - { id: s1, bac: 2, ten: Sách A }')
					.replace(/luot_1: null\n(\s+)luot_2: null\n(\s+)review: null\n(\s+)kiem_mau: null/, 'luot_1: agent A\n$1luot_2: agent B (mẫu)\n$2review: Claude\n$3kiem_mau: "chủ repo, 1/1"'),
			);
		dien(4);
		assert.equal(parse(fs.readFileSync(f, 'utf8')).tang, 'ngoai-vi');
		assert.throws(() => chay('khoa', 'lich-su/opera'), new RegExp(`lượt 2 phải kiểm mẫu ít nhất ${MAU_NGOAI_VI} nhận định \\(mới có 4\\)`));
		// nhận định ngoài mẫu không cần luot_2
		assert.doesNotMatch(loiHoSo(parse(fs.readFileSync(f, 'utf8')), 'lich-su/opera', goc).join(), /chưa có kết quả lượt 2/);
		// tầng lấy từ trang.yml, không tin hồ sơ: trang đổi sang Lõi sau khi lập hồ sơ thì không khóa được với mẫu (review)
		const fTang = path.join(goc, 'src/data/trang.yml');
		fs.writeFileSync(fTang, '- id: lich-su/opera\n  tang: loi\n');
		dien(5);
		assert.throws(() => chay('khoa', 'lich-su/opera'), /hồ sơ ghi tang: ngoai-vi mà src\/data\/trang\.yml ghi loi[\s\S]*chưa có kết quả lượt 2/);
		fs.writeFileSync(fTang, '- id: lich-su/opera\n  tang: ngoai-vi\n');
		// mẫu lượt 2 có nhận định sai: lượt 2 phải kiểm cả trang
		fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('id: n1, cau: Câu 1., loai: lich-su, nguon: [s1], ket_qua: dung, luot_2: dung', 'id: n1, cau: Câu 1., loai: lich-su, nguon: [s1], ket_qua: da-sua, ghi_chu: đã sửa, luot_2: sai'));
		assert.throws(() => chay('khoa', 'lich-su/opera'), /mẫu lượt 2 có nhận định sai, nên lượt 2 phải kiểm cả trang \(mới có 5\/7\)/);
		dien(5);
		chay('khoa', 'lich-su/opera');
		// lượt 2 của trang Đọc thêm nhận đúng 5 nhận định ngẫu nhiên
		chay('xuat', 'lich-su/opera', '--ra', 'xuat.yml');
		const xuat = parse(fs.readFileSync(path.join(goc, 'xuat.yml'), 'utf8'));
		assert.equal(xuat.length, MAU_NGOAI_VI);
		assert.equal(new Set(xuat.map((n) => n.id)).size, MAU_NGOAI_VI);
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});

test('lệnh chạy được qua đường dẫn có liên kết tượng trưng (như /tmp trên macOS): không im lặng thoát', () => {
	const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-lien-ket-'));
	try {
		fs.symlinkSync(ROOT, path.join(tam, 'repo'));
		const ra = execFileSync(process.execPath, [path.join(tam, 'repo', 'tools', 'khoa.mjs'), 'tinh'], { encoding: 'utf8' });
		assert.match(ra, /^index\s+sha256:\S+\s+khớp$/m);
	} finally {
		fs.rmSync(tam, { recursive: true, force: true });
	}
});

test('nguồn trang viết theo cách công cụ khóa hiểu: chỉ .md, không khoảng trắng cuối dòng, khối abc mở bằng ```abc ở đầu dòng', () => {
	const docs = path.join(ROOT, 'src/content/docs');
	const loi = [];
	for (const f of fs.readdirSync(docs, { recursive: true }).filter((x) => /\.mdx?$/.test(x))) {
		// fileTrang() chỉ tìm .md: trang .mdx dựng được ở bản xem mà không khóa được
		if (f.endsWith('.mdx')) loi.push(`${f}: viết .md, không .mdx`);
		const dong = fs.readFileSync(path.join(docs, f), 'utf8').split('\n');
		dong.forEach((l, i) => {
			// mã băm bỏ khoảng trắng cuối dòng, nên hai dấu cách ngắt dòng cứng không được khóa: ngắt dòng viết <br>
			if (/[ \t]+$/.test(l)) loi.push(`${f}:${i + 1}: khoảng trắng cuối dòng`);
			// công cụ khóa đếm khuông nhạc theo dòng ```abc; kiểu hàng rào khác plugin vẫn dựng mà hồ sơ không đếm
			if (/^\s*(`{3,}|~{3,})\s*abc\b/.test(l) && !/^```abc\s*$/.test(l)) loi.push(`${f}:${i + 1}: khối abc mở bằng \`\`\`abc ở đầu dòng`);
		});
	}
	assert.deepEqual(loi, []);
});

test('bản thật bỏ trang chưa khóa khỏi bộ docs; bản xem giữ mọi trang', async () => {
	const tao = () => {
		const muc = new Map([
			['index', { filePath: 'src/content/docs/index.md' }],
			['nhac-ly/x', { filePath: 'src/content/docs/nhac-ly/x.md' }],
		]);
		return { store: { entries: () => [...muc], delete: (id) => muc.delete(id) }, muc };
	};
	const cu = process.env.OPUS_BAN;
	try {
		delete process.env.OPUS_BAN;
		const that = tao();
		await locTheoBan({ name: 'thu', load: async () => {} }).load(that);
		assert.deepEqual([...that.muc.keys()], ['index'], 'bản thật chỉ giữ trang đã khóa');
		process.env.OPUS_BAN = 'xem';
		const xem = tao();
		await locTheoBan({ name: 'thu', load: async () => {} }).load(xem);
		assert.deepEqual([...xem.muc.keys()], ['index', 'nhac-ly/x']);
	} finally {
		if (cu === undefined) delete process.env.OPUS_BAN;
		else process.env.OPUS_BAN = cu;
	}
});

test('bản build: trang đã khóa không có dải "Chưa kiểm định" hay ô "chưa chuyển"; trang chưa khóa có dải', () => {
	if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('Chưa có dist/: chạy `npm run build` trước `npm test`.');
	const khoa = docKhoa().trang;
	const loi = [];
	for (const f of fs.readdirSync(path.join(ROOT, 'src/content/docs'), { recursive: true }).filter((x) => /\.mdx?$/.test(x))) {
		const t = f.replace(/\\/g, '/').replace(/\.mdx?$/, '');
		const html = path.join(DIST, t === '404' ? '404.html' : path.join(t === 'index' ? '' : t.replace(/\/index$/, ''), 'index.html'));
		if (!fs.existsSync(html)) continue;
		const noiDung = fs.readFileSync(html, 'utf8');
		const coDai = noiDung.includes('class="oz-chua-kiem-dinh"');
		if (t in khoa && coDai) loi.push(`${t}: đã khóa mà có dải "Chưa kiểm định"`);
		if (t in khoa && noiDung.includes('class="oz-chua-co"')) loi.push(`${t}: đã khóa mà có hình hay công cụ "chưa chuyển"`);
		if (!(t in khoa) && !coDai) loi.push(`${t}: chưa khóa mà không có dải "Chưa kiểm định" (bản thật không được có trang này)`);
	}
	assert.deepEqual(loi, []);
});

test('nhap: đưa kết quả lượt 2 vào hồ sơ (kèm link, câu đúng); có dòng sai thì không ghi gì; in nhận định cần review', () => {
	const goc = fs.mkdtempSync(path.join(os.tmpdir(), 'opus-nhap-'));
	try {
		const ghi = (f, chu) => {
			fs.mkdirSync(path.dirname(path.join(goc, f)), { recursive: true });
			fs.writeFileSync(path.join(goc, f), chu);
		};
		ghi('src/data/nha-soan-nhac.yml', '- id: a\n  ten: A\n  sinh: 1900\n  mat: 1950\n');
		const chay = (...ts) => {
			const ra = [];
			lenh([...ts, '--goc', goc], ROOT, (x) => ra.push(x));
			return ra.join('\n');
		};
		chay('mau', 'du-lieu/nha-soan-nhac/a');
		const f = path.join(goc, 'kiem-dinh/du-lieu/nha-soan-nhac/a.yml');
		fs.writeFileSync(
			f,
			fs
				.readFileSync(f, 'utf8')
				.replace('nguon: []', 'nguon:\n  - { id: s, bac: 2, ten: S, link: "https://x" }')
				.replace('nhan_dinh: []', 'nhan_dinh:\n  - { id: n1, cau: A sinh 1900., loai: nam, nguon: [s], ket_qua: dung }\n  - { id: n2, cau: Tên là A., loai: ten, nguon: [s], ket_qua: da-sua, ghi_chu: x }\n  - { id: n3, cau: A mất 1950., loai: nam, nguon: [s], ket_qua: dung }'),
		);
		const truoc = fs.readFileSync(f, 'utf8');
		const dong = (id, luot2, them = '') => `- { trang: du-lieu/nha-soan-nhac/a, id: ${id}, luot_2: ${luot2}${them} }\n`;
		ghi('l2.yml', dong('n1', 'dung', ', nguon: ["https://y"]') + dong('n9', 'dung', ', nguon: ["https://y"]'));
		assert.throws(() => chay('nhap', 'l2.yml'), /dòng 2 .*hồ sơ không có nhận định n9/);
		ghi('l2.yml', dong('n1', 'co', ', nguon: ["https://y"]') + dong('n2', 'sai', ', nguon: ["https://z"]') + dong('n3', 'dung'));
		const loi = (() => {
			try {
				chay('nhap', 'l2.yml');
			} catch (e) {
				return e.message;
			}
		})();
		assert.match(loi, /dòng 1 .*luot_2 phải là dung, sai, khong-chac/);
		assert.match(loi, /dòng 2 .*sai cần cau_dung hay ghi_chu/);
		assert.match(loi, /dòng 3 .*dung cần nguon/);
		assert.equal(fs.readFileSync(f, 'utf8'), truoc, 'có dòng sai thì không ghi gì');
		ghi('l2.yml', dong('n1', 'dung', ', nguon: ["https://y"]') + dong('n2', 'sai', ', nguon: ["https://z"], cau_dung: Tên là B.'));
		const ra = chay('nhap', 'l2.yml');
		const hs = parse(fs.readFileSync(f, 'utf8'));
		assert.equal(hs.nhan_dinh[0].luot_2, 'dung');
		assert.deepEqual(hs.nhan_dinh[0].luot_2_nguon, ['https://y']);
		assert.equal(hs.nhan_dinh[1].luot_2, 'sai');
		assert.equal(hs.nhan_dinh[1].luot_2_ghi_chu, 'câu đúng: Tên là B.');
		assert.equal(hs.nhan_dinh[2].luot_2, undefined);
		assert.match(fs.readFileSync(f, 'utf8'), /^# Hồ sơ kiểm định/, 'giữ dòng chú thích đầu hồ sơ');
		assert.match(ra, /đã nhập 2 kết quả lượt 2 vào 1 hồ sơ: 1 dung, 1 sai, 0 khong-chac/);
		assert.match(ra, /còn 1 nhận định trong các hồ sơ ấy chưa có lượt 2/);
		assert.match(ra, /cần review \(1\):\n {2}du-lieu\/nha-soan-nhac\/a n2: lượt 1 da-sua, lượt 2 sai/);

		// nhập lại: phần của lượt 2 thay hẳn, không sót câu đúng hay link của lần trước
		ghi('l2.yml', dong('n2', 'dung', ', nguon: ["https://w"]'));
		chay('nhap', 'l2.yml');
		const lai = parse(fs.readFileSync(f, 'utf8')).nhan_dinh[1];
		assert.equal(lai.luot_2, 'dung');
		assert.deepEqual(lai.luot_2_nguon, ['https://w']);
		assert.equal(lai.luot_2_ghi_chu, undefined);

		// lời khuyên tập: không cần nguồn, khong-can-nguon mà lượt 2 dung thì không phải review
		const them = parse(fs.readFileSync(f, 'utf8'));
		them.nhan_dinh.push({ id: 'n4', cau: 'Tập chậm.', loai: 'khuyen-tap', ket_qua: 'khong-can-nguon' });
		fs.writeFileSync(f, stringify(them));
		ghi('l2.yml', dong('n4', 'dung'));
		assert.doesNotMatch(chay('nhap', 'l2.yml'), /cần review/);
		// `nguon:` để trống (null) với khong-chac: như không ghi nguồn
		ghi('l2.yml', '- { trang: du-lieu/nha-soan-nhac/a, id: n3, luot_2: khong-chac, nguon: , ghi_chu: chưa tìm được }\n');
		assert.match(chay('nhap', 'l2.yml'), /1 khong-chac/);

		// nguon không phải danh sách; hai nhận định cùng id; hồ sơ đã khóa; hồ sơ thứ hai hỏng YAML: không ghi file nào
		ghi('src/data/nha-soan-nhac.yml', '- id: a\n  ten: A\n  sinh: 1900\n  mat: 1950\n- id: b\n  ten: B\n  sinh: 1800\n  mat: 1850\n- id: c\n  ten: C\n  sinh: 1700\n  mat: 1750\n');
		chay('mau', 'du-lieu/nha-soan-nhac/b', 'du-lieu/nha-soan-nhac/c');
		const fb = path.join(goc, 'kiem-dinh/du-lieu/nha-soan-nhac/b.yml');
		const fc = path.join(goc, 'kiem-dinh/du-lieu/nha-soan-nhac/c.yml');
		fs.writeFileSync(fb, fs.readFileSync(fb, 'utf8').replace('nhan_dinh: []', 'nhan_dinh: [{ id: n1, cau: x, loai: ten }, { id: n1, cau: y, loai: ten }]').replace('ma_bam: null', 'ma_bam: sha256:x'));
		fs.writeFileSync(fc, fs.readFileSync(fc, 'utf8') + 'nhan_dinh: [\n');
		const giuA = fs.readFileSync(f, 'utf8');
		ghi('l2.yml', dong('n1', 'dung', ', nguon: "https://y"') + dong('n3', 'dung', ', nguon: ["https://y"]').replace('/a,', '/b,') + dong('n1', 'dung', ', nguon: ["https://y"]').replace('/a,', '/c,') + dong('n3', 'dung', ', nguon: ["https://y"]'));
		const loi2 = (() => {
			try {
				chay('nhap', 'l2.yml');
			} catch (e) {
				return e.message;
			}
		})();
		assert.match(loi2, /dòng 1 .*nguon phải là danh sách link/);
		assert.match(loi2, /dòng 2 .*b\.yml đã khóa/);
		assert.match(loi2, /dòng 3 .*c\.yml đọc YAML lỗi/);
		assert.equal(fs.readFileSync(f, 'utf8'), giuA, 'dòng 4 đúng mà vẫn không ghi, vì có dòng sai');
		fs.writeFileSync(fb, fs.readFileSync(fb, 'utf8').replace('ma_bam: sha256:x', 'ma_bam: null'));
		ghi('l2.yml', dong('n1', 'dung', ', nguon: ["https://y"]').replace('/a,', '/b,'));
		assert.throws(() => chay('nhap', 'l2.yml'), /hồ sơ có 2 nhận định cùng id n1/);
	} finally {
		fs.rmSync(goc, { recursive: true, force: true });
	}
});

test('chiDaKhoa: đọc id và trường đã khóa được; trường chưa khóa, kể cả trường chưa có, thì lỗi ghi rõ bản ghi và trường', () => {
	const daKhoa = truongDaKhoa({ trang: {}, ban_ghi: { 'tac-pham/x#ten': 'a', 'tac-pham/x#chang,grade': 'b', 'nha-soan-nhac/y': 'c' } });
	const r = chiDaKhoa({ slug: 'x', ten: 'X', chang: 2, chip: ['a'] }, 'tac-pham', 'trang thử', daKhoa);
	assert.equal(r.slug, 'x');
	assert.equal(r.ten, 'X');
	assert.equal(r.chang, 2, 'các khóa từng phần của một bản ghi cộng dồn');
	assert.equal(r.grade, undefined, 'trường đã khóa mà bản ghi chưa có: đọc được (khóa giữ trường ấy chưa có)');
	assert.throws(() => r.chip, /^Error: trang thử hiện trường chưa khóa du-lieu\/tac-pham\/x#chip/);
	assert.throws(() => r.danh_muc, /#danh_muc/, 'trường chưa có mà chưa khóa: thêm vào dữ liệu thì sẽ hiện mà chưa kiểm định');
	assert.ok('chip' in r, 'hỏi có trường không thì không chặn');
	assert.throws(() => JSON.stringify(r), /#chip/, 'chép cả bản ghi ra trang là hiện mọi trường');
	assert.equal(chiDaKhoa({ id: 'y', ten: 'Y', sinh: 1 }, 'nha-soan-nhac', 'trang thử', daKhoa).sinh, 1, 'khóa cả bản ghi');
	assert.throws(() => chiDaKhoa({ id: 'z', ten: 'Z' }, 'nha-soan-nhac', 'trang thử', daKhoa).ten, /nha-soan-nhac\/z#ten/);
});
