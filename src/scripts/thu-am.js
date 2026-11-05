// Thu âm buổi tập (::cong-cu{ten="recorder"}, D7-L2), chuyển từ ../opus-zero/docs/assets/js/recorder.js: thu bằng micro
// (MediaRecorder), đặt tên, lưu trong trình duyệt (IndexedDB opus-zero-recordings, kho rec, src/scripts/kho-thu.js: cùng dạng
// bản ghi với site cũ và với bản sao lưu của src/scripts/sao-luu.js), nghe lại, tải về, xóa, chọn hai bản để so sánh (phát
// lần lượt A rồi B). Lưu xong thì ghi số phút vào days[ngày].minutes, như bản cũ. Bản thu không gửi đi đâu.
// Micro qua src/scripts/micro.js như các công cụ micro khác: nhận lượt (giuMicro) trước khi mở, tắt khử vọng, lọc ồn, tự chỉnh
// âm lượng (to nhỏ trong bản thu đúng như người học chơi), Audio Session "play-and-record" khi đang thu; công cụ khác nhận
// micro, hay rời trang, thì dừng thu và vẫn lưu phần đã thu. Bấm "Thu" lần nữa trong lúc trình duyệt đang hỏi quyền thì bỏ qua.
// Khác bản cũ: tên file tải về giữ chữ có dấu (bản cũ thay mọi chữ có dấu bằng "_"); không lưu được (bộ nhớ đầy, Safari
// duyệt riêng tư) thì vẫn hiện bản vừa thu để nghe và tải về (bản cũ chỉ báo lỗi, bản thu mất). Xóa hỏi lại bằng hộp xác nhận như cũ.
import { idb } from './kho-thu.js';
import { coMicro, dongMicro, giuMicro, luongMicro, moMicro, ngheMicro } from './micro.js';
import { ghiNgay, homNay } from './tien-do.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Giây thành "phút:giây" (fmt cũ). */
export function thoiGian(giay) {
	const s = Math.round(giay);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
/** Tên file tải về: tên bản thu (bỏ ký tự không dùng được trong tên file) và đuôi theo kiểu âm thanh. */
export function tenFile(ten, mime) {
	const goc = String(ten).replace(/[^\p{L}\p{N}\- ]+/gu, '_').trim() || 'ban-thu';
	return `${goc}.${String(mime).includes('mp4') ? 'm4a' : 'webm'}`;
}
/** Số phút ghi vào nhật ký cho một bản thu dài `giay` giây (tối thiểu 1). */
export const soPhut = (giay) => Math.max(1, Math.round(giay / 60));

export const coThuAm = () => typeof window !== 'undefined' && !!window.MediaRecorder && coMicro() && !!window.indexedDB;

export const veThuAm = () =>
	`<div class="oz-thu-am oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label class="oz-thu-am-ten">Tên bản thu <input type="text" class="oz-input" data-k="ten" maxlength="80" placeholder="Ví dụ: Minuet Sol trưởng, ô 1–8"></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="thu">● Thu</button><span class="oz-stats oz-thu-am-gio" aria-live="off"></span></div>` +
	`<p class="oz-feedback" aria-live="polite"></p>` +
	`<div class="oz-thu-am-so" hidden><p class="oz-stats">So sánh hai bản thu (nghe lần lượt hoặc cùng lúc):</p><div class="oz-thu-am-ab"></div></div>` +
	`<div class="oz-thu-am-ds"><p class="oz-stats">Chưa có bản thu nào.</p></div><p class="oz-stats oz-thu-am-cho"></p>` +
	`<noscript data-sinh><p>Thu âm cần JavaScript và micro: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const q = (s) => goc.querySelector(s);
	const phanHoi = q('.oz-feedback');
	const ds = q('.oz-thu-am-ds');
	const gio = q('.oz-thu-am-gio');
	const so = q('.oz-thu-am-so');
	const ab = q('.oz-thu-am-ab');
	const nut = q('[data-act="thu"]');
	const oTen = q('[data-k="ten"]');
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	goc.dataset.san = '1';
	if (!coThuAm()) {
		bao('Trình duyệt này không hỗ trợ thu âm. Hãy dùng Chrome, Edge, Firefox hoặc Safari bản mới.', 'bad');
		nut.disabled = true;
		return;
	}
	let urls = [];
	let dang = null;

	const veLai = async () => {
		urls.forEach((u) => URL.revokeObjectURL(u));
		urls = [];
		const recs = ((await idb('readonly', (s) => s.getAll())) || []).filter((r) => r && r.blob).sort((a, b) => b.id - a.id);
		ds.innerHTML = recs.length ? '' : '<p class="oz-stats">Chưa có bản thu nào.</p>';
		for (const r of recs) {
			// id và độ dài từ IndexedDB (có thể do bản sao lưu nhập vào): chỉ nhận số, không chèn chữ lạ vào thuộc tính
			const id = Number(r.id);
			if (!Number.isFinite(id)) continue;
			const u = URL.createObjectURL(r.blob);
			urls.push(u);
			const o = document.createElement('div');
			o.className = 'oz-thu-am-ban';
			o.innerHTML =
				`<label><input type="checkbox" data-id="${id}"> <strong>${esc(r.label)}</strong></label> ` +
				`<span class="oz-stats">${esc(r.date || '')} · ${thoiGian(Number(r.dur) || 0)}</span>` +
				`<audio controls preload="metadata" src="${u}"></audio>` +
				`<div class="oz-row"><a class="oz-btn" download="${esc(tenFile(r.label, r.mime || ''))}" href="${u}">Tải về</a>` +
				`<button type="button" class="oz-btn" data-xoa="${id}">Xóa</button></div>`;
			ds.append(o);
		}
		chonSoSanh();
		if (navigator.storage?.estimate)
			navigator.storage
				.estimate()
				.then((e) => {
					q('.oz-thu-am-cho').textContent = `Bản thu được lưu trong trình duyệt trên máy này (${((e.usage || 0) / 1048576).toFixed(1)} MB đã dùng). Xóa dữ liệu trình duyệt sẽ mất bản thu; hãy tải về những bản muốn giữ.`;
				})
				.catch(() => {});
	};

	/** Dừng thu (bấm Dừng, công cụ khác nhận micro, rời trang): lưu phần đã thu. */
	const dung = () => {
		const d = dang;
		if (!d) return;
		// đang chờ micro (người dùng đang được hỏi quyền): hủy lần mở
		if (d.cho) {
			dang = null;
			d.huy = true;
			d.nha?.();
			dongMicro();
			return;
		}
		if (d.mr.state !== 'inactive') d.mr.stop();
	};

	const luu = async (d) => {
		clearInterval(d.dem);
		gio.textContent = '';
		nut.textContent = '● Thu';
		d.thoi();
		d.nha();
		dang = null;
		const blob = new Blob(d.manh, { type: d.mr.mimeType || 'audio/webm' });
		const dur = (Date.now() - d.bat) / 1000;
		const ten = (oTen.value.trim() || `Bản thu ${new Date().toLocaleString('vi-VN')}`).slice(0, 80);
		try {
			await idb('readwrite', (s) => s.put({ id: Date.now(), label: ten, date: homNay(), dur, mime: blob.type, blob }));
			bao(`Đã lưu “${ten}” (${thoiGian(dur)}).`, 'ok');
			ghiNgay('minutes', soPhut(dur));
		} catch {
			// không lưu được (bộ nhớ đầy; Safari ở chế độ duyệt riêng tư không cho lưu âm thanh vào IndexedDB): vẫn cho nghe và
			// tải về bản vừa thu, để không mất
			await veLai().catch(() => {});
			bao('Không lưu được bản thu trong trình duyệt (bộ nhớ đầy, hoặc đang duyệt ở chế độ riêng tư). Nghe và tải về bản vừa thu ngay bên dưới.', 'bad');
			const u = URL.createObjectURL(blob);
			urls.push(u);
			const o = document.createElement('div');
			o.className = 'oz-thu-am-ban oz-thu-am-chua-luu';
			o.innerHTML =
				`<strong>${esc(ten)}</strong> <span class="oz-stats">chưa lưu · ${thoiGian(dur)}</span><audio controls preload="metadata" src="${u}"></audio>` +
				`<div class="oz-row"><a class="oz-btn" download="${esc(tenFile(ten, blob.type))}" href="${u}">Tải về</a></div>`;
			ds.querySelector(':scope > p.oz-stats')?.remove();
			ds.prepend(o);
			return;
		}
		await veLai().catch(() => {});
	};

	nut.addEventListener('click', async () => {
		if (dang) {
			if (!dang.cho) dung();
			return;
		}
		const d = (dang = { cho: true, huy: false, nha: null });
		d.nha = giuMicro(dung);
		try {
			await moMicro();
		} catch {
			if (d.huy) return;
			dang = null;
			d.nha();
			return bao('Không mở được micro. Hãy cho phép trang dùng micro.', 'bad');
		}
		if (d.huy) return;
		// giữ micro mở trong lúc thu (micro.js đóng khi không còn ai nghe)
		d.thoi = ngheMicro(() => {});
		try {
			d.mr = new MediaRecorder(luongMicro());
		} catch {
			d.thoi();
			d.nha();
			dang = null;
			return bao('Trình duyệt này không thu được âm thanh từ micro.', 'bad');
		}
		d.manh = [];
		d.mr.ondataavailable = (e) => e.data?.size && d.manh.push(e.data);
		d.mr.onstop = () => luu(d);
		// lỗi khi đang thu (micro bị rút ra…): dừng và lưu phần đã thu
		d.mr.onerror = () => dung();
		d.cho = false;
		try {
			d.mr.start();
		} catch {
			// không bắt đầu được (luồng micro vừa kết thúc…): trả micro, không kẹt ở trạng thái đang thu
			d.thoi();
			d.nha();
			dang = null;
			dongMicro();
			return bao('Trình duyệt này không thu được âm thanh từ micro.', 'bad');
		}
		d.bat = Date.now();
		nut.textContent = '■ Dừng';
		bao('');
		d.dem = setInterval(() => (gio.textContent = `Đang thu ${thoiGian((Date.now() - d.bat) / 1000)}`), 250);
	});

	ds.addEventListener('click', async (e) => {
		const x = e.target.closest('[data-xoa]');
		if (!x || !confirm('Xóa bản thu này?')) return;
		try {
			await idb('readwrite', (s) => s.delete(Number(x.dataset.xoa)));
		} catch {
			bao('Không xóa được bản thu.', 'bad');
		}
		veLai().catch(() => {});
	});

	/** Hai bản được chọn: hiện hai trình phát và nút phát lần lượt (chọn tối đa hai). */
	function chonSoSanh(moi) {
		let chon = [...ds.querySelectorAll('input[data-id]:checked')];
		if (chon.length > 2 && moi) {
			moi.checked = false;
			chon = chon.filter((x) => x !== moi);
		}
		ab.innerHTML = '';
		so.hidden = chon.length !== 2;
		if (chon.length !== 2) return;
		const as = chon.map((x, i) => {
			const a = x.closest('.oz-thu-am-ban').querySelector('audio').cloneNode();
			a.controls = true;
			a.setAttribute('aria-label', `Bản ${'AB'[i]}: ${x.closest('label').textContent.trim()}`);
			return a;
		});
		as.forEach((a, i) => {
			const p = document.createElement('p');
			p.className = 'oz-stats';
			p.textContent = `${'AB'[i]}: ${chon[i].closest('label').textContent.trim()}`;
			ab.append(p, a);
		});
		const ca = document.createElement('button');
		ca.type = 'button';
		ca.className = 'oz-btn';
		ca.textContent = 'Phát lần lượt A rồi B';
		ca.addEventListener('click', () => {
			as[0].currentTime = 0;
			as[0].play().catch(() => {});
			as[0].onended = () => {
				as[1].currentTime = 0;
				as[1].play().catch(() => {});
			};
		});
		ab.append(ca);
	}
	ds.addEventListener('change', (e) => e.target.dataset.id && chonSoSanh(e.target));

	addEventListener('pagehide', dung);
	veLai().catch(() => bao('Không mở được kho lưu trữ của trình duyệt (chế độ ẩn danh?).', 'bad'));
}
