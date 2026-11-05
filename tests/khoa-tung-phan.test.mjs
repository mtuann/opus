// Hồ sơ của bản ghi khóa từng phần khi lô sau kiểm định thêm trường (D6-L1): `mau` thêm lần kiểm định mới, lượt 1 ghi nhận
// định cho trường chưa khóa; khóa cũ vẫn "hồ sơ đủ" (chỉ xét lần đã ghi khóa ấy và nhận định chạm trường đã khóa), còn khóa
// trường mới hay khóa cả bản ghi thì đòi đủ hai lượt cho mọi nhận định của chúng.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { loiHoSo } from '../tools/khoa.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const NGUOI = { luot_1: 'A', luot_2: 'B', review: 'C', kiem_mau: 'D' };
const hs = () => ({
	ban_ghi: 'tac-pham/x',
	lan: [
		{ so: 1, ma_bam: 'sha256:1', nguoi: NGUOI, truong: ['chang', 'ten'] },
		{ so: 2, ma_bam: null, nguoi: { luot_1: 'A2', luot_2: null, review: null, kiem_mau: null } },
	],
	nguon: [{ id: 'g', bac: 2, ten: 'G', link: 'https://example.org/' }],
	nhan_dinh: [
		{ id: 'n1', cau: 'Tên.', loai: 'ten', truong: ['ten'], nguon: ['g'], ket_qua: 'dung', luot_2: 'dung' },
		{ id: 'n2', cau: 'Chặng.', loai: 'cap-do', truong: ['chang'], nguon: ['g'], ket_qua: 'dung', luot_2: 'dung' },
		// lượt 1 của lô sau, chưa có lượt 2
		{ id: 'n3', cau: 'Giọng.', loai: 'cau-truc', truong: ['giong'], nguon: ['g'], ket_qua: 'dung' },
		{ id: 'n4', cau: 'Chip.', loai: 'cau-truc', truong: ['chip', 'giong'], nguon: ['g'], ket_qua: 'dung' },
	],
});

test('khóa từng phần cũ vẫn đủ khi hồ sơ có lần kiểm định mới đang làm', () => {
	const ma = { maBam: 'sha256:1' };
	assert.deepEqual(loiHoSo(hs(), 'du-lieu/tac-pham/x#chang,ten', ROOT, ma), []);
	assert.deepEqual(loiHoSo(hs(), 'du-lieu/tac-pham/x#ten,chang', ROOT, ma), [], 'thứ tự trường không quan trọng');
});

test('nhận định mới chạm trường đã khóa thì vẫn bị xét', () => {
	const h = hs();
	h.nhan_dinh[2].truong = ['giong', 'ten'];
	assert.match(loiHoSo(h, 'du-lieu/tac-pham/x#chang,ten', ROOT, { maBam: 'sha256:1' }).join(' | '), /nhận định n3: chưa có kết quả lượt 2/);
	const h2 = hs();
	delete h2.nhan_dinh[2].truong;
	assert.match(loiHoSo(h2, 'du-lieu/tac-pham/x#chang,ten', ROOT, { maBam: 'sha256:1' }).join(' | '), /nhận định n3: chưa có kết quả lượt 2/, 'không ghi truong: xét');
	const h3 = hs();
	h3.lan[0].nguoi = { ...NGUOI, kiem_mau: null };
	assert.match(loiHoSo(h3, 'du-lieu/tac-pham/x#chang,ten', ROOT, { maBam: 'sha256:1' }).join(' | '), /lần kiểm định 1: thiếu nguoi\.kiem_mau/);
});

test('khóa trường mới hay cả bản ghi: đòi lần cuối đủ người và mọi nhận định của các trường ấy qua hai lượt', () => {
	const moi = loiHoSo(hs(), 'du-lieu/tac-pham/x#chip,giong', ROOT).join(' | ');
	assert.match(moi, /lần kiểm định cuối: thiếu nguoi\.luot_2/);
	assert.match(moi, /nhận định n3: chưa có kết quả lượt 2/);
	assert.match(moi, /nhận định n4: chưa có kết quả lượt 2/);
	assert.doesNotMatch(moi, /nhận định n1/);
	const ca = loiHoSo(hs(), 'du-lieu/tac-pham/x', ROOT).join(' | ');
	assert.match(ca, /lần kiểm định cuối: thiếu nguoi\.review/);
	assert.match(ca, /nhận định n3: chưa có kết quả lượt 2/);
	const du = hs();
	du.lan[1].nguoi = NGUOI;
	for (const n of du.nhan_dinh) n.luot_2 = 'dung';
	assert.deepEqual(loiHoSo(du, 'du-lieu/tac-pham/x', ROOT), []);
	assert.deepEqual(loiHoSo(du, 'du-lieu/tac-pham/x#chip,giong', ROOT), []);
});

test('mở khóa rồi khóa lại đúng các trường cũ: lệnh khoa xét lần mới (mo vừa thêm), thiếu người thì chặn', () => {
	// mo ghi lý do và thêm một lần mới (nguoi trống) vào cuối lan; lần 1 vẫn có truong [chang, ten] và đủ người
	const h = hs();
	h.lan = [{ ...h.lan[0], ma_bam: 'sha256:1' }, { so: 2, ly_do_mo: 'sửa tên', ma_bam: null, nguoi: { luot_1: null, luot_2: null, review: null, kiem_mau: null } }];
	h.nhan_dinh = h.nhan_dinh.slice(0, 2);
	const khoa = loiHoSo(h, 'du-lieu/tac-pham/x#chang,ten', ROOT).join(' | ');
	assert.match(khoa, /lần kiểm định cuối: thiếu nguoi\.luot_1/);
	assert.match(khoa, /thiếu nguoi\.kiem_mau/);
	h.lan[1].nguoi = NGUOI;
	assert.deepEqual(loiHoSo(h, 'du-lieu/tac-pham/x#chang,ten', ROOT), []);
	// mã băm không có trong lan (khóa lạ): xét lần cuối
	h.lan[1].nguoi = { ...NGUOI, review: null };
	assert.match(loiHoSo(h, 'du-lieu/tac-pham/x#chang,ten', ROOT, { maBam: 'sha256:khac' }).join(' | '), /lần kiểm định cuối: thiếu nguoi\.review/);
});

test('truong của nhận định bản ghi phải có trong schema của bộ', () => {
	const h = hs();
	h.nhan_dinh[2].truong = ['giongg'];
	h.nhan_dinh[3].truong = 'chipp';
	const loi = loiHoSo(h, 'du-lieu/tac-pham/x#chang,ten', ROOT, { maBam: 'sha256:1' }).join(' | ');
	assert.match(loi, /nhận định n3: truong giongg không có trong bộ tac-pham/);
	assert.match(loi, /nhận định n4: truong chipp không có trong bộ tac-pham/);
});
