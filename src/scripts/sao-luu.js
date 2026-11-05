// Dữ liệu học (::cong-cu{ten="data"}, D7-L1), chuyển từ ../opus-zero/docs/assets/js/data.js: xem, sao lưu, khôi phục (gộp,
// không ghi đè) và xóa dữ liệu học lưu trong trình duyệt. Cùng định dạng file với site cũ (format "opus-zero-backup",
// version 2: progress, settings, recordings, exported), nên file xuất ở site cũ khôi phục được ở đây và ngược lại; nhận cả
// bản rất cũ chỉ có { days, store }. Cùng các khóa: opus-zero:v1 (tiến độ, src/scripts/tien-do.js), opus-zero:sound
// (âm thanh), opus-zero:midi-auto (đàn MIDI); bản thu âm ở IndexedDB opus-zero-recordings, kho rec (của công cụ thu âm).
// Hàm gộp là hàm thuần và gộp cùng một bản sao lưu nhiều lần cho kết quả như gộp một lần (kiểm thử: tests/sao-luu.test.mjs).
// Khác bản cũ: file tải về tên opus-<ngày>.json (site đổi tên), chữ "tải từ Opus Zero" thành "tải từ trang Dữ liệu".
// veSaoLuu dựng sẵn ô lúc build, mount đọc dữ liệu và thêm phần bấm được.
import { KHOA, homNay } from './tien-do.js';

export const DINH_DANG = 'opus-zero-backup';
export const KHOA_AM = 'opus-zero:sound';
export const KHOA_MIDI = 'opus-zero:midi-auto';
/** Các số đếm theo ngày (NUM_FIELDS cũ): gộp lấy số lớn hơn. */
export const TRUONG_SO = ['notes', 'intervals', 'chords', 'keysigs', 'rhythms', 'melodies', 'cards', 'quizzes', 'minutes', 'builds', 'scales', 'styles', 'piano', 'checks', 'readings'];
/** Các phần của kho có luật gộp riêng; phần khác giữ của máy này, thêm khi chưa có. */
const KHO_RIENG = ['lessons', 'skills', 'skillHist', 'cards', 'noteStats', 'blind', 'blindLog', 'listen', 'checks', 'repertoire', 'pianoLevel'];

const laDoiTuong = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const sao = (x) => (x === undefined ? x : JSON.parse(JSON.stringify(x)));

/** File đã đọc (JSON) thành { progress, settings, recordings, exported }; không đúng định dạng thì ném lỗi có chữ để hiện. */
export function chuanHoa(obj) {
	if (!laDoiTuong(obj)) throw new Error('Không phải file sao lưu hợp lệ.');
	if (obj.format === DINH_DANG) {
		if (!laDoiTuong(obj.progress) || !laDoiTuong(obj.progress.days)) throw new Error('File sao lưu bị thiếu dữ liệu tiến độ.');
		return {
			progress: obj.progress,
			settings: laDoiTuong(obj.settings) ? obj.settings : {},
			recordings: Array.isArray(obj.recordings) ? obj.recordings : [],
			exported: obj.exported || '',
		};
	}
	if (laDoiTuong(obj.days)) return { progress: obj, settings: {}, recordings: [], exported: '' };
	throw new Error('Không nhận ra định dạng file. Hãy chọn file .json tải từ trang Dữ liệu của site.');
}

/** Gộp một ngày (mergeDay cũ): số đếm lấy lớn hơn, việc đã làm hợp lại, ghi chú nối khi khác nhau. */
export function gopNgay(a, b = {}) {
	const ra = sao(a || {});
	b ||= {};
	for (const f of TRUONG_SO) {
		const v = Math.max(Number(ra[f]) || 0, Number(b[f]) || 0);
		if (v || f in ra || f in b) ra[f] = v;
	}
	ra.tasks = { ...(ra.tasks || {}) };
	for (const k of Object.keys(b.tasks || {})) ra.tasks[k] = !!(ra.tasks[k] || b.tasks[k]);
	const na = (ra.note || '').trim();
	const nb = (b.note || '').trim();
	if (!na) ra.note = nb;
	else if (nb && na !== nb && !na.includes(nb)) ra.note = nb.includes(na) ? nb : `${na}\n---\n${nb}`;
	return ra;
}

/** Gộp tiến độ `den` vào `co` (merge cũ): trả về { gop, bao_cao } (số mục thêm hay cập nhật, để xem trước). */
export function gop(co, den) {
	co = laDoiTuong(co) && laDoiTuong(co.days) ? co : { days: {} };
	const L = sao(co);
	const I = sao(den);
	const bc = { ngay_them: 0, ngay_bo_sung: 0, bai_them: 0, ky_nang: 0, the: 0, nghe_mu: 0, moc_nghe: 0, viec: 0, bai_tap: 0 };
	L.store ||= {};
	const S = L.store;
	const IS = I.store || {};
	for (const d of Object.keys(I.days || {})) {
		if (!L.days[d]) {
			L.days[d] = gopNgay({}, I.days[d]);
			bc.ngay_them++;
			continue;
		}
		const m = gopNgay(L.days[d], I.days[d]);
		if (JSON.stringify(m) !== JSON.stringify(L.days[d])) {
			L.days[d] = m;
			bc.ngay_bo_sung++;
		}
	}
	// bài đã học: hợp lại, giữ ngày sớm nhất
	if (IS.lessons) {
		S.lessons ||= {};
		for (const k of Object.keys(IS.lessons)) {
			if (!S.lessons[k]) {
				S.lessons[k] = IS.lessons[k];
				bc.bai_them++;
			} else if (IS.lessons[k] < S.lessons[k]) S.lessons[k] = IS.lessons[k];
		}
	}
	// kỹ năng: lấy bản luyện gần đây hơn; cùng ngày thì bản có nhiều lượt hơn
	if (IS.skills) {
		S.skills ||= {};
		for (const k of Object.keys(IS.skills)) {
			const a = S.skills[k];
			const b = IS.skills[k];
			if (!a || (b.last || '') > (a.last || '') || ((b.last || '') === (a.last || '') && (b.n || 0) > (a.n || 0)))
				if (JSON.stringify(a) !== JSON.stringify(b)) {
					S.skills[k] = b;
					bc.ky_nang++;
				}
		}
	}
	// thẻ ghi nhớ: giữ tiến độ tốt hơn (hộp cao hơn; cùng hộp thì hạn ôn muộn hơn)
	if (IS.cards) {
		S.cards ||= {};
		for (const k of Object.keys(IS.cards)) {
			const a = S.cards[k];
			const b = IS.cards[k];
			if (!a || (b.box || 0) > (a.box || 0) || ((b.box || 0) === (a.box || 0) && (b.due || '') > (a.due || '')))
				if (JSON.stringify(a) !== JSON.stringify(b)) {
					S.cards[k] = { ...b, added: a && a.added && a.added < (b.added || '9') ? a.added : b.added };
					bc.the++;
				}
		}
	}
	// thống kê từng nốt: lấy số lớn hơn (không cộng, để gộp lại nhiều lần vẫn đúng)
	if (IS.noteStats) {
		S.noteStats ||= {};
		for (const k of Object.keys(IS.noteStats)) {
			const a = S.noteStats[k] || [0, 0];
			const b = IS.noteStats[k] || [0, 0];
			S.noteStats[k] = (b[0] || 0) > (a[0] || 0) ? b.slice() : a.slice();
		}
	}
	// lịch sử kỹ năng theo ngày: mỗi (kỹ năng, ngày) lấy bản có nhiều lượt hơn
	if (IS.skillHist) {
		S.skillHist ||= {};
		for (const k of Object.keys(IS.skillHist)) {
			const a = (S.skillHist[k] ||= {});
			const b = IS.skillHist[k] || {};
			for (const d of Object.keys(b)) if (!a[d] || (b[d][0] || 0) > (a[d][0] || 0)) a[d] = b[d].slice();
		}
	}
	if (IS.blind) {
		const a = S.blind || { right: 0, total: 0 };
		S.blind = (IS.blind.total || 0) > (a.total || 0) ? IS.blind : a;
	}
	// phiếu nghe mù: nối lại, bỏ bản trùng, xếp theo ngày
	if (Array.isArray(IS.blindLog)) {
		S.blindLog ||= [];
		const khoa = (r) => [r.d, r.t, r.gp, r.ge, r.gc, r.ap].join('|');
		const da = new Set(S.blindLog.map(khoa));
		for (const r of IS.blindLog)
			if (!da.has(khoa(r))) {
				S.blindLog.push(r);
				da.add(khoa(r));
				bc.nghe_mu++;
			}
		S.blindLog.sort((x, y) => ((x.d || '') < (y.d || '') ? -1 : (x.d || '') > (y.d || '') ? 1 : 0));
	}
	// mốc nghe: giữ link và mốc của máy này, thêm mốc còn thiếu; mốc của bản thu khác cất riêng (byUrl)
	if (IS.listen) {
		S.listen ||= {};
		for (const p of Object.keys(IS.listen)) {
			const a = S.listen[p];
			const b = IS.listen[p];
			if (!a) {
				S.listen[p] = b;
				bc.moc_nghe++;
				continue;
			}
			const them = (dich, nguon) => {
				for (const i of Object.keys(nguon || {})) if (dich[i] === undefined) dich[i] = nguon[i];
			};
			const vao = (u, m) => {
				if (!m || !Object.keys(m).length) return;
				if (u === a.url) them(a.marks, m);
				else {
					a.byUrl ||= {};
					a.byUrl[u] ||= {};
					them(a.byUrl[u], m);
				}
			};
			if (!a.url && b.url) a.url = b.url;
			a.marks ||= {};
			if (!b.url || b.url === a.url) them(a.marks, b.marks);
			else vao(b.url, b.marks);
			if (laDoiTuong(b.byUrl)) for (const u of Object.keys(b.byUrl)) vao(u, b.byUrl[u]);
		}
	}
	// danh sách việc đã đánh dấu: hợp lại, giữ ngày sớm nhất
	if (laDoiTuong(IS.checks)) {
		S.checks = laDoiTuong(S.checks) ? S.checks : {};
		for (const pg of Object.keys(IS.checks)) {
			const a = (S.checks[pg] = laDoiTuong(S.checks[pg]) ? S.checks[pg] : {});
			const b = laDoiTuong(IS.checks[pg]) ? IS.checks[pg] : {};
			for (const i of Object.keys(b)) {
				if (a[i] === undefined) {
					a[i] = b[i];
					bc.viec++;
				} else if (b[i] && b[i] < a[i]) a[i] = b[i];
			}
		}
	}
	// bài đang tập: mỗi bài lấy bản cập nhật sau cùng
	if (laDoiTuong(IS.repertoire)) {
		S.repertoire = laDoiTuong(S.repertoire) ? S.repertoire : {};
		for (const k of Object.keys(IS.repertoire)) {
			const a = S.repertoire[k];
			const b = IS.repertoire[k];
			if (laDoiTuong(b) && (!a || (b.updated || '') > (a.updated || ''))) {
				S.repertoire[k] = b;
				bc.bai_tap++;
			}
		}
	}
	// chặng piano tự đánh giá: lấy lần đánh giá sau cùng
	if (laDoiTuong(IS.pianoLevel) && (!laDoiTuong(S.pianoLevel) || (IS.pianoLevel.updated || '') > (S.pianoLevel.updated || ''))) S.pianoLevel = IS.pianoLevel;
	// các phần khác (như kết quả kiểm tra đầu vào): giữ của máy này, thêm nếu chưa có
	for (const k of Object.keys(IS)) if (!KHO_RIENG.includes(k) && S[k] === undefined) S[k] = IS[k];
	return { gop: L, bao_cao: bc };
}

/** Tóm tắt dữ liệu (describe cũ): số ngày có luyện tập, khoảng ngày, bài, kỹ năng, thẻ, nghe mù, mốc nghe, bài đang tập… */
export function moTa(p) {
	p = laDoiTuong(p) && laDoiTuong(p.days) ? p : { days: {} };
	const s = p.store || {};
	const co = Object.keys(p.days)
		.filter((d) => {
			const x = p.days[d];
			return TRUONG_SO.some((f) => x[f]) || Object.values(x.tasks || {}).some(Boolean) || (x.note || '').trim();
		})
		.sort();
	return {
		ngay: co.length,
		dau: co[0] || '',
		cuoi: co[co.length - 1] || '',
		bai: Object.keys(s.lessons || {}).length,
		ky_nang: Object.keys(s.skills || {}).length,
		the: Object.keys(s.cards || {}).length,
		nghe_mu: (s.blindLog || []).length,
		moc_nghe: Object.keys(s.listen || {}).length,
		bai_tap: Object.keys(s.repertoire || {}).filter((k) => s.repertoire[k] && s.repertoire[k].status !== 'removed').length,
		viec: Object.keys(s.checks || {}).reduce((n, k) => n + Object.keys(s.checks[k] || {}).length, 0),
		ghi_chu: co.filter((d) => (p.days[d].note || '').trim()).length,
	};
}

const mb = (n) => `${(n / 1048576).toFixed(1).replace('.', ',')} MB`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Danh sách tóm tắt (HTML). `thu`: { n, bytes } của bản thu âm, hay null khi không đọc được. */
export function tomTat(s, thu) {
	return (
		'<ul>' +
		`<li>${s.ngay} ngày có luyện tập${s.dau ? ` (từ ${s.dau} đến ${s.cuoi})` : ''}, ${s.ghi_chu} ngày có ghi chú</li>` +
		`<li>${s.bai} bài đã hoàn thành quiz; năng lực của ${s.ky_nang} kỹ năng</li>` +
		`<li>${s.the} thẻ thuật ngữ đang ôn; ${s.nghe_mu} lần nghe mù; mốc nghe ở ${s.moc_nghe} trang</li>` +
		`<li>${s.bai_tap} bài trong danh sách bài đang tập; ${s.viec} mục đã đánh dấu xong</li>` +
		(thu ? `<li>${thu.n} bản thu âm (${mb(thu.bytes)})</li>` : '') +
		'</ul>'
	);
}

/** Danh sách thay đổi khi gộp (HTML, các dòng <li>), và tổng số thay đổi. */
export function thayDoi(bc, soThuMoi) {
	const dong = [
		[bc.ngay_them, (n) => `thêm ${n} ngày luyện tập`],
		[bc.ngay_bo_sung, (n) => `bổ sung số liệu cho ${n} ngày đã có`],
		[bc.bai_them, (n) => `thêm ${n} bài đã học`],
		[bc.ky_nang, (n) => `cập nhật năng lực ${n} kỹ năng (lấy bản mới hơn)`],
		[bc.the, (n) => `cập nhật ${n} thẻ thuật ngữ`],
		[bc.nghe_mu, (n) => `thêm ${n} lần nghe mù`],
		[bc.moc_nghe, (n) => `thêm mốc nghe ở ${n} trang`],
		[bc.viec, (n) => `thêm ${n} mục đã đánh dấu xong`],
		[bc.bai_tap, (n) => `cập nhật ${n} bài đang tập`],
		[soThuMoi, (n) => `thêm ${n} bản thu âm`],
	].filter(([n]) => n);
	return { tong: dong.reduce((s, [n]) => s + n, 0), html: dong.map(([n, f]) => `<li>${f(n)}</li>`).join('') };
}

export const veSaoLuu = () =>
	`<div class="oz-sao-luu oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<p class="oz-tool-title">Đang lưu trên máy này</p><div class="oz-sao-luu-tom-tat" aria-live="polite">Đang đọc…</div>` +
	`<p class="oz-tool-title">Tải bản sao lưu</p>` +
	`<div class="oz-row"><label><input type="checkbox" data-k="thu"> Kèm bản thu âm (file sẽ lớn hơn nhiều)</label></div>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="xuat">Tải file sao lưu (.json)</button></div>` +
	`<p class="oz-tool-title">Khôi phục từ bản sao lưu</p>` +
	`<p class="oz-stats">Dữ liệu trong file được <strong>gộp</strong> với dữ liệu trên máy này, không ghi đè. Bạn sẽ xem trước những gì thay đổi rồi mới xác nhận.</p>` +
	`<div class="oz-row"><label class="oz-btn oz-chon-file">Chọn file sao lưu<input type="file" accept="application/json,.json" data-k="file"></label></div>` +
	`<div class="oz-sao-luu-xem" hidden></div>` +
	`<p class="oz-feedback" aria-live="polite"></p>` +
	`<p class="oz-tool-title">Xóa dữ liệu</p>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="xoa-tien-do">Xóa tiến độ học</button><button type="button" class="oz-btn" data-act="xoa-thu">Xóa mọi bản thu âm</button></div>` +
	`<noscript data-sinh><p>Sao lưu dữ liệu học cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

// ---------- Trong trình duyệt ----------

const DB = 'opus-zero-recordings';
const KHO_THU = 'rec';
/** Một việc trên kho bản thu (IndexedDB); trình duyệt không có IndexedDB thì null. */
function idb(che, viec) {
	return new Promise((ok, hong) => {
		if (!window.indexedDB) return ok(null);
		const r = indexedDB.open(DB, 1);
		r.onupgradeneeded = () => r.result.createObjectStore(KHO_THU, { keyPath: 'id' });
		r.onerror = () => hong(r.error);
		r.onsuccess = () => {
			const t = r.result.transaction(KHO_THU, che);
			const q = viec(t.objectStore(KHO_THU));
			t.oncomplete = () => (r.result.close(), ok(q && q.result));
			t.onerror = () => (r.result.close(), hong(t.error));
		};
	});
}
const banThu = () =>
	idb('readonly', (s) => s.getAll())
		.then((x) => x || [])
		.catch(() => []);
const blobThanhB64 = (blob) =>
	new Promise((ok) => {
		const fr = new FileReader();
		fr.onload = () => ok(String(fr.result).split(',')[1] || '');
		fr.readAsDataURL(blob);
	});
function b64ThanhBlob(b64, loai) {
	const bin = atob(b64);
	const u = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
	return new Blob([u], { type: loai || 'audio/webm' });
}
function docMay() {
	try {
		const d = JSON.parse(localStorage.getItem(KHOA) || 'null');
		return laDoiTuong(d) && laDoiTuong(d.days) ? d : { days: {} };
	} catch {
		return { days: {} };
	}
}
function ghiMay(d) {
	localStorage.setItem(KHOA, JSON.stringify(d));
	document.dispatchEvent(new CustomEvent('oz:progress'));
}
const docKhoa = (k) => {
	try {
		return localStorage.getItem(k);
	} catch {
		return null;
	}
};

export function mount(goc) {
	if (goc.dataset.san) return;
	const phanHoi = goc.querySelector('.oz-feedback');
	const tom = goc.querySelector('.oz-sao-luu-tom-tat');
	const xem = goc.querySelector('.oz-sao-luu-xem');
	const bao = (s, ok) => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${ok === undefined ? '' : ok ? ' ok' : ' bad'}`;
	};
	const lamMoi = () =>
		banThu().then((ds) => {
			tom.innerHTML = tomTat(moTa(docMay()), { n: ds.length, bytes: ds.reduce((s, r) => s + (r.blob ? r.blob.size : 0), 0) });
		});
	const taiVe = (ten, chu) => {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([chu], { type: 'application/json' }));
		a.download = ten;
		document.body.append(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(a.href), 2000);
	};
	goc.querySelector('[data-act="xuat"]').addEventListener('click', async () => {
		const kem = goc.querySelector('[data-k="thu"]').checked;
		bao('Đang chuẩn bị…');
		const ds = kem
			? await Promise.all((await banThu()).map(async (r) => ({ id: r.id, label: r.label, date: r.date, dur: r.dur, mime: r.mime, data: await blobThanhB64(r.blob) })))
			: [];
		const ra = {
			format: DINH_DANG,
			version: 2,
			exported: new Date().toISOString(),
			progress: docMay(),
			settings: { sound: docKhoa(KHOA_AM), midiAuto: docKhoa(KHOA_MIDI) },
			recordings: ds,
		};
		taiVe(`opus-${homNay()}${kem ? '-kem-ban-thu' : ''}.json`, JSON.stringify(ra));
		bao(`Đã tải file sao lưu${ds.length ? ` (kèm ${ds.length} bản thu)` : ''}. Hãy giữ file ở nơi an toàn (Google Drive, email cho chính mình…).`, true);
	});
	goc.querySelector('[data-k="file"]').addEventListener('change', async (e) => {
		const f = e.target.files && e.target.files[0];
		e.target.value = '';
		if (!f) return;
		let den;
		try {
			den = chuanHoa(JSON.parse(await f.text()));
		} catch (loi) {
			xem.hidden = true;
			return bao(loi instanceof SyntaxError ? 'File không đọc được (không phải JSON).' : loi.message || 'File không đọc được.', false);
		}
		const kq = gop(docMay(), den.progress);
		const co = new Set((await banThu()).map((x) => x.id));
		const thuMoi = den.recordings.filter((x) => x && x.id && !co.has(x.id) && x.data);
		const td = thayDoi(kq.bao_cao, thuMoi.length);
		xem.hidden = false;
		xem.innerHTML =
			`<p><strong>File: ${esc(f.name)}</strong>${den.exported ? ` (tạo lúc ${esc(String(den.exported).slice(0, 16).replace('T', ' '))})` : ''}</p>` +
			(td.tong
				? `<p>Sau khi gộp sẽ:</p><ul>${td.html}</ul><div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="gop">Gộp vào máy này</button><button type="button" class="oz-btn" data-act="huy">Hủy</button></div>`
				: '<p>File này không có gì mới so với dữ liệu trên máy: không cần gộp.</p>');
		bao('');
		xem.querySelector('[data-act="gop"]')?.addEventListener('click', async () => {
			try {
				ghiMay(kq.gop);
			} catch {
				return bao('Không ghi được dữ liệu (bộ nhớ trình duyệt đầy?).', false);
			}
			try {
				if (den.settings.sound && !docKhoa(KHOA_AM)) localStorage.setItem(KHOA_AM, den.settings.sound);
			} catch {
				// không lưu được lựa chọn âm thanh: giữ mặc định
			}
			try {
				await Promise.all(thuMoi.map((x) => idb('readwrite', (s) => s.put({ id: x.id, label: x.label, date: x.date, dur: x.dur, mime: x.mime, blob: b64ThanhBlob(x.data, x.mime) }))));
				bao('Đã gộp xong.', true);
			} catch {
				bao('Đã gộp tiến độ, nhưng không lưu được bản thu âm.', false);
			}
			xem.hidden = true;
			lamMoi();
		});
		xem.querySelector('[data-act="huy"]')?.addEventListener('click', () => {
			xem.hidden = true;
			bao('Đã hủy, không có gì thay đổi.');
		});
	});
	goc.querySelector('[data-act="xoa-tien-do"]').addEventListener('click', () => {
		if (!confirm('Xóa toàn bộ tiến độ học trên máy này? Nên tải file sao lưu trước. Không thể hoàn tác.')) return;
		try {
			localStorage.removeItem(KHOA);
		} catch {
			// trình duyệt chặn: không có gì để xóa
		}
		document.dispatchEvent(new CustomEvent('oz:progress'));
		bao('Đã xóa tiến độ học.', true);
		lamMoi();
	});
	goc.querySelector('[data-act="xoa-thu"]').addEventListener('click', () => {
		if (!confirm('Xóa mọi bản thu âm trên máy này? Không thể hoàn tác.')) return;
		idb('readwrite', (s) => s.clear())
			.then(() => bao('Đã xóa mọi bản thu âm.', true))
			.catch(() => bao('Không xóa được bản thu âm.', false))
			.finally(lamMoi);
	});
	document.addEventListener('oz:progress', lamMoi);
	lamMoi();
	goc.dataset.san = '1';
}
