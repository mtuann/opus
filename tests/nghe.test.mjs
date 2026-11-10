// Kiểm thử các hàm thuần của khối nghe (src/scripts/nghe.js), chép từ kiểm thử của listen.js ở site cũ
// (../opus-zero/tests/unit.mjs), và khóa tiến độ của người học (src/scripts/tien-do.js) giữ như site cũ.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../src/scripts/nghe.js';
import { KHOA, ghiNgay } from '../src/scripts/tien-do.js';

test('đọc link YouTube và link file âm thanh; đổi bản thu giữ mốc riêng từng bản; vị trí trong nhiều phần', () => {
	assert.equal(L.audioUrl('https://example.org/nhac/a.mp3'), 'https://example.org/nhac/a.mp3');
	assert.equal(L.audioUrl('https://commons.wikimedia.org/wiki/Special:FilePath/FurElise.ogg'), 'https://commons.wikimedia.org/wiki/Special:FilePath/FurElise.ogg');
	assert.equal(L.audioUrl('https://example.org/a.mp3?x=1'), 'https://example.org/a.mp3?x=1');
	assert.equal(L.audioUrl('https://youtu.be/dQw4w9WgXcQ'), null);
	assert.equal(L.audioUrl('https://example.org/trang.html'), null);
	assert.equal(L.audioUrl('ftp://example.org/a.mp3'), null);
	const s1 = L.switchSource({ url: '', marks: { 0: 3 } }, 'https://youtu.be/dQw4w9WgXcQ');
	assert.deepEqual([s1.url, s1.marks[0]], ['https://youtu.be/dQw4w9WgXcQ', 3]); // bản đầu tiên nhận mốc đang có
	const s2 = L.switchSource(s1, 'file:ban-thu.mp3');
	assert.deepEqual([Object.keys(s2.marks).length, s2.byUrl['https://youtu.be/dQw4w9WgXcQ'][0]], [0, 3]);
	const s3 = L.switchSource({ ...s2, marks: { 1: 9 } }, 'https://youtu.be/dQw4w9WgXcQ');
	assert.deepEqual([s3.marks[0], s3.byUrl['file:ban-thu.mp3'][1]], [3, 9]); // quay lại bản cũ: mốc cũ trở về
	assert.equal(L.switchSource(s3, s3.url), s3);
	assert.deepEqual(L.partAt(0, [10, 20]), [0, 0]);
	assert.deepEqual(L.partAt(9.5, [10, 20]), [0, 9.5]);
	assert.deepEqual(L.partAt(10, [10, 20]), [1, 0]); // đúng ranh giới: sang phần sau
	assert.deepEqual(L.partAt(35, [10, 20]), [1, 25]); // quá cuối: vẫn ở phần cuối
	assert.deepEqual(L.partAt(5, [10]), [0, 5]);
	assert.equal(L.videoId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
	assert.equal(L.videoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30'), 'dQw4w9WgXcQ');
	assert.equal(L.videoId('không phải link'), null);
});

test('mốc tham khảo: so sánh, tóm tắt, đọc dữ liệu của khối (data-rec)', () => {
	assert.deepEqual({ ...L.compare(12, 12) }, { d: 0, ok: true, text: 'khớp' });
	assert.equal(L.compare(14, 12).ok, true); // lệch 2 giây vẫn coi là khớp
	assert.deepEqual([L.compare(15, 12).ok, L.compare(15, 12).text], [false, 'muộn 3 giây']);
	assert.equal(L.compare(7, 12).text, 'sớm 5 giây');
	assert.deepEqual({ ...L.tally({ 0: 3, 1: 40, 3: 99 }, [2, 30, null, 99]) }, { n: 3, ok: 2 }); // dòng không có mốc tham khảo bị bỏ
	assert.deepEqual({ ...L.tally({}, [1, 2]) }, { n: 0, ok: 0 });
	const el = (rec) => ({ dataset: { rec: JSON.stringify(rec) } });
	const r = L.readRec(el({ by: 'X', parts: [{ mp3: 'https://x.org/a.mp3', d: 10 }], ref: [1, null, -4, '7', 30] }));
	assert.deepEqual(r.ref, [1, null, null, null, 30]); // chỉ nhận số không âm
	assert.equal(r.key, 'https://x.org/a.mp3');
	assert.deepEqual(L.readRec(el({ parts: [{ mp3: 'https://x.org/a.mp3' }] })).ref, []);
	// bản thu chỉ dẫn link: mọi phần có link, không có mp3; khóa là link phần đầu
	const lo = L.readRec(el({ by: 'Y', parts: [{ t: 'I', link: 'https://imslp.org/wiki/Special:ImagefromIndex/1', d: 60 }, { t: 'II', link: 'https://imslp.org/wiki/Special:ImagefromIndex/2', d: 30 }], ref: [5, 70] }));
	assert.deepEqual([lo.linkOnly, lo.key], [true, 'https://imslp.org/wiki/Special:ImagefromIndex/1']);
	assert.deepEqual(L.partAt(70, lo.parts.map((p) => p.d)), [1, 10]); // mốc 70 giây là giây 10 của phần 2
	assert.equal(L.readRec(el({ parts: [{ t: 'I', link: 'https://x.org/1' }, { t: 'II', mp3: 'https://x.org/2.mp3' }] })), null); // trộn hai kiểu
	assert.equal(L.readRec(el({ by: 'Z', parts: [{ mp3: 'https://x.org/a.mp3', d: 1 }] })).linkOnly, false);
});

test('bản đồ nghe chọn đúng dòng đang nghe', () => {
	const marks = { 0: 5, 2: 40, 3: 90 };
	assert.equal(L.activeRow(3, marks), -1);
	assert.equal(L.activeRow(10, marks), 0);
	assert.equal(L.activeRow(39.8, marks), 2); // cho phép sớm 0,25 giây
	assert.equal(L.activeRow(500, marks), 3);
});

test('tiến độ lưu ở khóa opus-zero:v1 như site cũ; ghi thêm không làm mất dữ liệu cũ', () => {
	assert.equal(KHOA, 'opus-zero:v1');
	// cùng dạng dữ liệu thật của site cũ (progress.js, data.js): bài đã học, bài đang tập nằm trong store
	const kho = new Map([[KHOA, JSON.stringify({ days: { '2026-10-01': { quizzes: 2 } }, store: { lessons: { '/opus-zero/nhac-ly/10-hop-am-ba/': '2026-10-01' }, repertoire: { a: 1 } } })]]);
	const cu = { localStorage: globalThis.localStorage, document: globalThis.document };
	try {
		globalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, v) };
		globalThis.document = { dispatchEvent: () => true };
		ghiNgay('quizzes', 1);
		const data = JSON.parse(kho.get(KHOA));
		assert.equal(data.days['2026-10-01'].quizzes, 2);
		assert.deepEqual(data.store.lessons, { '/opus-zero/nhac-ly/10-hop-am-ba/': '2026-10-01' });
		assert.deepEqual(data.store.repertoire, { a: 1 });
		assert.equal(Object.values(data.days).at(-1).quizzes, 1);
	} finally {
		globalThis.localStorage = cu.localStorage;
		globalThis.document = cu.document;
	}
});

test('bản thu khác (data-khac, mo/ban-thu): đọc danh sách, bỏ bản chỉ dẫn link, khóa là mp3 phần đầu', () => {
	const el = (khac) => ({ dataset: { khac: JSON.stringify(khac) } });
	const a = L.readKhac(el([{ by: 'A', parts: [{ mp3: 'https://x.org/a.mp3', d: 5 }] }, { by: 'B', parts: [{ link: 'https://x.org/b', d: 5 }] }]));
	assert.deepEqual(a.map((r) => [r.by, r.key]), [['A', 'https://x.org/a.mp3']]);
	assert.deepEqual(L.readKhac({ dataset: {} }), []);
	assert.deepEqual(L.readKhac({ dataset: { khac: 'hỏng' } }), []);
});
