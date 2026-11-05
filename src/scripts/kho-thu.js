// Kho bản thu âm trong trình duyệt (D7-L2), dùng chung cho công cụ thu âm (src/scripts/thu-am.js) và sao lưu
// (src/scripts/sao-luu.js): IndexedDB "opus-zero-recordings", kho "rec", khóa "id", như recorder.js cũ, nên bản thu đã lưu ở
// site cũ (cùng tên miền) vẫn đọc được. Mỗi bản ghi: { id (Date.now() lúc lưu), label, date (YYYY-MM-DD), dur (giây), mime,
// blob }. Dữ liệu chỉ nằm trên máy người học.

export const DB = 'opus-zero-recordings';
export const KHO_THU = 'rec';

/** Một việc trên kho bản thu (`che`: readonly, readwrite); trình duyệt không có IndexedDB thì null. */
export function idb(che, viec) {
	return new Promise((ok, hong) => {
		if (!window.indexedDB) return ok(null);
		const r = indexedDB.open(DB, 1);
		r.onupgradeneeded = () => r.result.createObjectStore(KHO_THU, { keyPath: 'id' });
		r.onerror = () => hong(r.error);
		r.onsuccess = () => {
			const db = r.result;
			let q;
			try {
				const t = db.transaction(KHO_THU, che);
				t.oncomplete = () => (db.close(), ok(q && q.result));
				t.onerror = () => (db.close(), hong(t.error));
				// hủy (hết chỗ lưu…): báo lỗi, không treo
				t.onabort = () => (db.close(), hong(t.error || new Error('giao dịch bị hủy')));
				q = viec(t.objectStore(KHO_THU));
			} catch (e) {
				db.close();
				hong(e);
			}
		};
	});
}

/** Mọi bản thu (lỗi hay không có IndexedDB thì rỗng). */
export const banThu = () =>
	idb('readonly', (s) => s.getAll())
		.then((x) => x || [])
		.catch(() => []);
