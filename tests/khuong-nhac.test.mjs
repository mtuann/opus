// Kiểm thử khuông nhạc (chuan-kiem-dinh.md mục 4, "Mọi khối"; thay abc_warn.mjs, abc_bars.py của site cũ): mọi khối
// ```abc trong src/content/docs/ được abcjs đọc không cảnh báo, và mỗi ô nhịp đủ độ dài (tools/khuong-nhac.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canhBao, kiemThuMuc, oSai } from '../tools/khuong-nhac.mjs';

test('bắt được ô nhịp sai độ dài, bè chồng lệch nhau, cảnh báo của abcjs; khối đúng thì không báo', () => {
	assert.deepEqual(oSai('X:1\nM:4/4\nL:1/4\nK:C\nCDEF|GAB|c4|]'), ['bè _, ô 2: 3/4, cần 1']);
	// nhịp lấy đà, liên ba, ô kết ngắn: đúng
	assert.deepEqual(oSai('X:1\nM:3/4\nL:1/8\nK:C\nE2|A2 (3cBA G2|A4 z2|]'), []);
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/8\nK:C\nc2 & C2 E2 | d4 |]'), ['bè _, ô 1: các bè chồng dài khác nhau, cần 1/2']);
	// mỗi bè ([V:…]) kiểm riêng
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/8\nK:C\n[V:1] cdef|g4|a4|]\n[V:2] C4|G,2|C4|]'), ['bè 2, ô 2: 1/4, cần 1/2']);
	assert.deepEqual(oSai('X:1\nM:none\nL:1/4\nK:C\nCDE|]'), [], 'không có nhịp: không kiểm độ dài');
	assert.match(canhBao('X:1\nM:4/4\nL:1/4\nK:C\n!foo!CDEF|G4|]').join(), /Unknown decoration: foo/);
	assert.deepEqual(canhBao('X:1\nM:4/4\nL:1/4\nK:C\nCDEF|G4|]'), []);
});

test('mọi khối ```abc trong các trang: abcjs không cảnh báo, ô nhịp đủ độ dài', () => {
	const { loi } = kiemThuMuc();
	assert.deepEqual(loi, [], 'xem chi tiết: node tools/khuong-nhac.mjs');
});
