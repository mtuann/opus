// Đọc nốt (::cong-cu{ten="note-reader"}, D7-L1), chuyển từ ../opus-zero/docs/assets/js/note-reader.js: một nốt ngẫu nhiên
// trên khuông (khóa Sol, Fa, cả hai, Đô alto, Đô tenor; trong khuông hay thêm dòng kẻ phụ), người học chọn tên nốt (Đô Rê Mi
// hay C D E). Trả lời bằng nút, bằng bàn phím máy tính (chữ C–B hay số 1–7) hay bằng phím của đàn MIDI (src/scripts/midi.js).
// "Ưu tiên nốt hay sai": nốt chưa gặp hay hay sai hiện nhiều hơn, theo thống kê từng nốt lưu ở store.noteStats như bản cũ
// ("<khóa>:<bậc>": [số lần, số lần sai lần đầu]); kỹ năng "notes" và số nốt đọc đúng trong ngày (days[ngày].notes) như bản cũ.
// Khác bản cũ: nốt vẽ bằng SVG của site (veNotDon trong src/scripts/ve.js), không tải abcjs, nên ô hiện ngay và không có
// việc dài khi đổi nốt.
// veDocNot dựng sẵn ô lúc build (khuông trống), mount chọn nốt đầu và thêm phần bấm được.
import { choiNot, layNgCanh } from './am-thanh.js';
import { nghe } from './midi.js';
import { CHU, SOLFEGE, TU_NHIEN } from './nhac-ly.js';
import { kyNang, layKho, datKho, ghiNgay, soHomNay } from './tien-do.js';
import { canKyHieu, veNotDon } from './ve.js';

export const TEN_KHOA = { treble: 'khóa Sol', bass: 'khóa Fa', alto: 'khóa Đô alto', tenor: 'khóa Đô tenor' };
/** Phạm vi theo bậc (quãng tám × 7 + chữ cái), như RANGES cũ. */
export const PHAM_VI = {
	treble: { basic: [29, 39], ledger: [26, 42] }, // D4–G5 | A3–C6
	bass: { basic: [17, 27], ledger: [14, 30] }, // F2–B3 | C2–E4
	alto: { basic: [23, 33], ledger: [20, 36] }, // E3–G4 | B2–D5 (dòng giữa là Đô giữa)
	tenor: { basic: [21, 31], ledger: [18, 34] }, // C3–E4 | G2–B4 (dòng 4 là Đô giữa)
};

/** Bậc v thành { chu (chỉ số chữ cái), o (quãng tám), m (số MIDI), khoa_hoc ("A3") } (info cũ). */
export function thongTin(v) {
	const chu = ((v % 7) + 7) % 7;
	const o = Math.floor(v / 7);
	return { chu, o, m: 12 * (o + 1) + TU_NHIEN[chu], khoa_hoc: CHU[chu] + o };
}

/** Trọng số chọn nốt khi ưu tiên nốt hay sai: chưa gặp 1,6; đã gặp 1 + 4 × (sai + 1) / (lần + 2) (như bản cũ). */
export const trongSo = (e) => (e ? 1 + (4 * (e[1] + 1)) / (e[0] + 2) : 1.6);

/** Chọn nốt kế (hàm thuần: `ngauNhien` trong [0, 1)): không lặp nốt vừa hiện (khi phạm vi có hơn một nốt). */
export function chonNot({ khoa, phamVi, uuTien, thongKe, truoc, ngauNhien = Math.random() }) {
	const [tu, den] = PHAM_VI[khoa][phamVi];
	const cac = [];
	const so = [];
	for (let x = tu; x <= den; x++) {
		if (x === truoc && den > tu) continue;
		cac.push(x);
		so.push(uuTien ? trongSo(thongKe[`${khoa}:${x}`]) : 1);
	}
	let chon = ngauNhien * so.reduce((a, b) => a + b, 0);
	for (let j = 0; j < cac.length; j++) {
		chon -= so[j];
		if (chon <= 0) return cac[j];
	}
	return cac[cac.length - 1];
}

/** Ba nốt hay sai nhất (đã gặp từ 3 lần, có sai): "Mi E5 (khóa Sol, sai 40%)" (weakest cũ). */
export function haySai(thongKe) {
	return Object.keys(thongKe)
		.filter((k) => thongKe[k][0] >= 3 && thongKe[k][1] > 0)
		.sort((a, b) => thongKe[b][1] / thongKe[b][0] - thongKe[a][1] / thongKe[a][0])
		.slice(0, 3)
		.map((k) => {
			const [khoa, v] = k.split(':');
			const t = thongTin(Number(v));
			return `${SOLFEGE[t.chu]} ${t.khoa_hoc} (${TEN_KHOA[khoa]}, sai ${Math.round((100 * thongKe[k][1]) / thongKe[k][0])}%)`;
		});
}

const nhanNut = (i, ten) => (ten === 'sol' ? `${SOLFEGE[i]}<small>${CHU[i]}</small>` : `${CHU[i]}<small>${SOLFEGE[i]}</small>`);
const nutTraLoi = (ten) =>
	CHU.map((c, i) => `<button type="button" class="oz-btn oz-answer-btn" data-i="${i}" title="Phím tắt: ${c} hoặc ${i + 1}">${nhanNut(i, ten)}</button>`).join('');

export const veDocNot = () =>
	`<div class="oz-doc-not oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row">` +
	`<label>Khóa <select data-k="khoa"><option value="treble">Khóa Sol</option><option value="bass">Khóa Fa</option><option value="both">Sol và Fa</option><option value="alto">Khóa Đô (alto)</option><option value="tenor">Khóa Đô (tenor)</option></select></label>` +
	`<label>Phạm vi <select data-k="pham-vi"><option value="basic">Trong khuông</option><option value="ledger">Thêm dòng kẻ phụ</option></select></label>` +
	`<label>Tên nốt <select data-k="ten"><option value="sol">Đô Rê Mi</option><option value="let">C D E</option></select></label>` +
	`<label><input type="checkbox" data-k="tieng" checked> Phát âm thanh</label>` +
	`<label><input type="checkbox" data-k="uu-tien" checked> Ưu tiên nốt hay sai</label></div>` +
	`<div class="oz-doc-not-khuong" tabindex="0" role="group" aria-label="Nốt cần đọc. Gõ chữ C đến B hay số 1 đến 7 để trả lời.">${veNotDon('treble', null)}</div>` +
	`<div class="oz-row oz-answers" role="group" aria-label="Chọn tên nốt">${nutTraLoi('sol')}</div>` +
	`<p class="oz-feedback" aria-live="polite"></p>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="bo-qua">Bỏ qua</button><button type="button" class="oz-btn" data-act="nghe">Nghe nốt này</button></div>` +
	`<p class="oz-stats oz-doc-not-so">Lượt này: đúng ngay lần đầu 0/0. Hôm nay đã đọc đúng 0 nốt.</p>` +
	`<noscript data-sinh><p>Đọc nốt cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	canKyHieu();
	const khuong = goc.querySelector('.oz-doc-not-khuong');
	const traLoi = goc.querySelector('.oz-answers');
	const phanHoi = goc.querySelector('.oz-feedback');
	const so = goc.querySelector('.oz-doc-not-so');
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	let hien = null;
	let khoa = 'treble';
	let lanDau = true;
	let khoaNut = false;
	const luot = { dung: 0, tong: 0 };

	const thongKe = () => layKho('noteStats', {});
	const ghiThongKe = (sai) => {
		kyNang('notes', !sai);
		const tk = thongKe();
		const e = tk[`${khoa}:${hien}`] ?? [0, 0];
		e[0]++;
		if (sai) e[1]++;
		tk[`${khoa}:${hien}`] = e;
		datKho('noteStats', tk);
	};
	const capNhatSo = () => {
		const pt = luot.tong ? Math.round((luot.dung / luot.tong) * 100) : 0;
		let s = `Lượt này: đúng ngay lần đầu ${luot.dung}/${luot.tong}${luot.tong ? ` (${pt}%)` : ''}. Hôm nay đã đọc đúng ${soHomNay('notes')} nốt.`;
		const w = haySai(thongKe());
		if (w.length) s += ` Hay sai nhất: ${w.join('; ')}.`;
		so.textContent = s;
	};
	const ve = () => {
		khuong.innerHTML = veNotDon(khoa, hien, { nhan: `Một nốt nhạc trên khuông ${TEN_KHOA[khoa]}` });
	};
	const tiep = () => {
		const chonKhoa = chon('khoa').value;
		khoa = chonKhoa === 'both' ? (Math.random() < 0.5 ? 'treble' : 'bass') : chonKhoa;
		hien = chonNot({ khoa, phamVi: chon('pham-vi').value, uuTien: chon('uu-tien').checked, thongKe: thongKe(), truoc: hien });
		lanDau = true;
		khoaNut = false;
		phanHoi.textContent = '';
		phanHoi.className = 'oz-feedback';
		for (const b of traLoi.querySelectorAll('button')) {
			b.classList.remove('is-correct', 'is-wrong');
			b.removeAttribute('aria-disabled');
		}
		ve();
	};
	const ngheNot = () => {
		if (hien !== null && layNgCanh()) choiNot(thongTin(hien).m, undefined, 1.2);
	};
	const tra = (i) => {
		if (khoaNut || hien === null) return;
		const t = thongTin(hien);
		const nut = traLoi.querySelector(`[data-i="${i}"]`);
		if (i === t.chu) {
			khoaNut = true;
			nut.classList.add('is-correct');
			if (lanDau) {
				luot.tong++;
				luot.dung++;
				ghiThongKe(false);
			}
			ghiNgay('notes', 1);
			phanHoi.textContent = `Đúng. Đây là ${SOLFEGE[t.chu]} (${t.khoa_hoc}).`;
			phanHoi.className = 'oz-feedback ok';
			if (chon('tieng').checked) ngheNot();
			capNhatSo();
			setTimeout(tiep, 900);
		} else {
			if (lanDau) {
				luot.tong++;
				lanDau = false;
				ghiThongKe(true);
			}
			nut.classList.add('is-wrong');
			// không khóa hẳn nút (disabled làm mất tiêu điểm): aria-disabled, bấm lại thì bỏ qua
			nut.setAttribute('aria-disabled', 'true');
			phanHoi.textContent = 'Chưa đúng. Đếm dòng và khe từ dưới lên rồi thử lại.';
			phanHoi.className = 'oz-feedback bad';
			capNhatSo();
		}
	};
	traLoi.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-i]');
		if (b && b.getAttribute('aria-disabled') !== 'true') tra(Number(b.dataset.i));
	});
	goc.querySelector('[data-act="bo-qua"]').addEventListener('click', tiep);
	goc.querySelector('[data-act="nghe"]').addEventListener('click', ngheNot);
	chon('khoa').addEventListener('change', tiep);
	chon('pham-vi').addEventListener('change', tiep);
	chon('ten').addEventListener('change', () => {
		for (const b of traLoi.querySelectorAll('button')) b.innerHTML = nhanNut(Number(b.dataset.i), chon('ten').value);
	});
	// đàn MIDI: bấm phím có tên nốt đúng (nốt trên khuông là nốt tự nhiên, nên phím đen không phải câu trả lời)
	nghe((su) => {
		if (su.loai !== 'on' || !goc.isConnected || hien === null) return;
		const i = TU_NHIEN.indexOf(((su.m % 12) + 12) % 12);
		if (i < 0) {
			phanHoi.textContent = 'Phím đen: nốt trên khuông là một nốt tự nhiên (phím trắng).';
			phanHoi.className = 'oz-feedback bad';
			return;
		}
		tra(i);
	});
	goc.addEventListener('keydown', (e) => {
		if (e.target.matches('select, input, textarea') || e.altKey || e.ctrlKey || e.metaKey) return;
		let i = CHU.indexOf(e.key.toUpperCase());
		if (i < 0 && /^[1-7]$/.test(e.key)) i = Number(e.key) - 1;
		if (i >= 0) {
			e.preventDefault();
			tra(i);
		}
	});
	tiep();
	capNhatSo();
	goc.dataset.san = '1';
}
