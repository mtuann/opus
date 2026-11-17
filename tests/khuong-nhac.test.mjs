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
	// hợp âm (hay [V:…]) mất "]" mà không còn "]" nào phía sau: báo lỗi, không treo (review D1.7)
	assert.deepEqual(oSai('X:1\nM:4/4\nL:1/4\nK:C\nCDEF|G A B c|\nC D [E F'), ['bè _: hợp âm mở bằng "[" mà không đóng bằng "]"']);
	assert.match(canhBao('X:1\nM:4/4\nL:1/4\nK:C\n!foo!CDEF|G4|]').join(), /Unknown decoration: foo/);
	// nhịp đổi giữa khối: trường trong dòng [M:…] (kể cả khi M: ở đầu là none), dòng M: giữa phần thân, [L:…]
	assert.deepEqual(oSai('X:1\nM:none\nL:1/8\nK:C\n[M:2/4] cdef | [M:3/4] cdefga | [M:2/4] c2 d2 |]'), []);
	assert.deepEqual(oSai('X:1\nM:none\nL:1/8\nK:C\n[M:2/4] cdef | [M:3/4] cdef | gabcde | c6 |]'), ['bè _, ô 2: 1/2, cần 3/4']);
	assert.deepEqual(oSai('X:1\nM:3/4\nL:1/4\nK:C\nCDE|FGA|\nM:2/4\nCD|EF|G2|]'), []);
	assert.deepEqual(oSai('X:1\nM:3/4\nL:1/4\nK:C\nCDE|FGA|\nM:2/4\nCDE|EF|G2|]'), ['bè _, ô 3: 3/4, cần 1/2']);
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/8\nK:C\ncdef|[L:1/16]cdefgabc|[L:1/8][M:3/4]cdefga|c6|]'), []);
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/8\nK:C\ncdef|[M:none]cdefgabc cdefgabc|[M:2/4]cdef|]'), [], 'M:none giữa khối: ô ấy không kiểm');
	assert.deepEqual(oSai('X:1\nM:none\nL:1/8\nK:C\n[V:1] [M:2/4] cdef | [M:3/4] cdefga | c6 |]\n[V:2] [M:2/4] C4 | [M:3/4] C4 | C6 |]'), ['bè 2, ô 2: 1/2, cần 3/4']);
	// vạch nhịp có kết 1, kết 2 vẫn đọc đúng
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/8\nK:C\n|:cdef|[1g4:|[2a4|]'), []);
	// dòng M:, L: giữa phần thân áp cho mọi bè (như abcjs); [M:…] trong dòng chỉ cho bè ấy
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/4\nK:C\n[V:1] CD|EF|\n[V:2] CD|EF|\nM:3/4\n[V:1] CDE|FGA|]\n[V:2] CDE|FGA|]'), []);
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/4\nK:C\nV:1\nCD|EF|\nV:2\nCD|EF|\nL:1/8\nV:1\nCDEF|CDEF|]\nV:2\nCDEF|CDEF|]'), []);
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/4\nK:C\n[V:1] CD|EF|\n[V:2] CD|EF|\n[V:1] [M:3/4] CDE|CDE|]\n[V:2] CDE|CD|]'), ['bè 2, ô 3: 3/4, cần 1/2']);
	// dòng V: đổi bè như [V:…]
	assert.deepEqual(oSai('X:1\nM:2/4\nL:1/8\nK:C\nV:1\ncdef|g4|a4|]\nV:2\nC4|G,2|C4|]'), ['bè 2, ô 2: 1/4, cần 1/2']);
	assert.deepEqual(canhBao('X:1\nM:4/4\nL:1/4\nK:C\nCDEF|G4|]'), []);
});

test('mọi khối ```abc trong các trang: abcjs không cảnh báo, ô nhịp đủ độ dài', () => {
	const { loi } = kiemThuMuc();
	assert.deepEqual(loi, [], 'xem chi tiết: node tools/khuong-nhac.mjs');
});

test('kiểm riêng một trang: đưa file .md thay cho thư mục', () => {
	const { khoi, loi } = kiemThuMuc(new URL('../src/content/docs/piano/tac-pham/bartok-romanian-folk-dances.md', import.meta.url).pathname);
	assert.ok(khoi >= 1);
	assert.deepEqual(loi, []);
});
