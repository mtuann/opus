// So cao độ qua micro (::cong-cu{ten="tuner"}, D7-L1), chuyển từ ../opus-zero/docs/assets/js/tuner.js: nốt gần nhất, tần
// số, kim lệch (±50 cent) và lời nhắc lên dây; chọn nhạc cụ thì so với dây chuẩn gần nhất (violin, guitar) và có nút nghe
// từng dây chuẩn. Micro dùng chung (src/scripts/micro.js): mỗi lúc một công cụ nghe, đóng khi rời trang; tần số làm mượt
// như bản cũ (75% giá trị trước, 25% giá trị mới).
// veSoCaoDo dựng sẵn ô lúc build, mount thêm phần bấm được.
import { choiNot, layNgCanh } from './am-thanh.js';
import { coMicro, dongMicro, giuMicro, midiCuaTanSo, moMicro, ngheMicro } from './micro.js';

const TEN = ['Đô', 'Đô♯', 'Rê', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'Si♭', 'Si'];
const CHU = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
/** Dây chuẩn của từng nhạc cụ: [nhãn, số MIDI] (STRINGS cũ). */
export const DAY = {
	violin: [
		['Sol (G3)', 55],
		['Rê (D4)', 62],
		['La (A4)', 69],
		['Mi (E5)', 76],
	],
	guitar: [
		['Mi (E2)', 40],
		['La (A2)', 45],
		['Rê (D3)', 50],
		['Sol (G3)', 55],
		['Si (B3)', 59],
		['Mi (E4)', 64],
	],
};

/** Đọc một tần số (đã làm mượt) với nhạc cụ `nhacCu`: { ten ("La A4"), cent, dung (lệch dưới 5 cent), loi (lời nhắc) }. */
export function docTanSo(f, nhacCu = 'chromatic') {
	const m = midiCuaTanSo(f);
	const ds = DAY[nhacCu];
	const dich = ds ? ds.reduce((tot, [, x]) => (Math.abs(x - m) < Math.abs(tot - m) ? x : tot), ds[0][1]) : Math.round(m);
	const cent = Math.round((m - dich) * 100);
	const pc = ((dich % 12) + 12) % 12;
	const dung = Math.abs(cent) < 5;
	return {
		ten: `${TEN[pc]} ${CHU[pc]}${Math.floor(dich / 12) - 1}`,
		cent,
		dung,
		loi: dung ? 'Đúng cao độ' : cent < 0 ? `Thấp ${-cent} cent: lên dây căng hơn` : `Cao ${cent} cent: chùng dây xuống`,
	};
}

export const veSoCaoDo = () =>
	`<div class="oz-so-cao-do oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Nhạc cụ <select data-k="nhac-cu"><option value="chromatic">Tự do (mọi nốt)</option><option value="violin">Violin</option><option value="guitar">Guitar</option></select></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="mic">Bật micro</button></div>` +
	`<div class="oz-so-cao-do-hien"><div class="oz-so-cao-do-not">–</div><div class="oz-stats oz-so-cao-do-hz">Chưa nghe thấy âm thanh</div>` +
	`<div class="oz-kim" aria-hidden="true"><span class="oz-kim-giua"></span><span class="oz-kim-chi"></span></div>` +
	`<p class="oz-stats oz-so-cao-do-cent" aria-live="polite"></p></div>` +
	`<div class="oz-row oz-so-cao-do-day"></div>` +
	`<p class="oz-stats">Kim ở giữa và chữ chuyển màu xanh là đúng cao độ (lệch dưới 5 cent). Âm thanh từ micro chỉ được xử lý trong trình duyệt, không ghi âm và không gửi đi đâu.</p>` +
	`<noscript data-sinh><p>So cao độ cần JavaScript và micro: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chon = goc.querySelector('[data-k="nhac-cu"]');
	const not = goc.querySelector('.oz-so-cao-do-not');
	const hz = goc.querySelector('.oz-so-cao-do-hz');
	const cent = goc.querySelector('.oz-so-cao-do-cent');
	const kim = goc.querySelector('.oz-kim-chi');
	const day = goc.querySelector('.oz-so-cao-do-day');
	const nut = goc.querySelector('[data-act="mic"]');
	let thoi = null;
	let nha = null;
	let muot = null;
	/** Đang chờ micro mở (người dùng đang được hỏi quyền): bấm thêm thì bỏ qua; tắt trong lúc chờ thì hủy. */
	let cho = null;
	const nutDay = () => {
		const ds = DAY[chon.value];
		day.innerHTML = ds
			? `<span class="oz-stats">Nghe dây chuẩn:</span>${ds.map(([nhan, m]) => `<button type="button" class="oz-btn" data-m="${m}">${nhan}</button>`).join('')}`
			: '';
	};
	day.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-m]');
		if (b && layNgCanh()) choiNot(Number(b.dataset.m), undefined, 2.5, 0.25);
	});
	const tat = () => {
		// tắt trong lúc chờ micro mở: hủy lần mở ấy (micro.js đóng luồng khi getUserMedia xong)
		if (cho) {
			cho.huy = true;
			dongMicro();
		}
		thoi?.();
		thoi = null;
		nha?.();
		nha = null;
		muot = null;
		nut.textContent = 'Bật micro';
	};
	const bat = async () => {
		if (!coMicro()) return void (cent.textContent = 'Trình duyệt này không mở được micro. Hãy thử Chrome, Edge, Firefox hoặc Safari bản mới.');
		if (cho) return;
		// nhận lượt trước (công cụ đang nghe thôi, micro có thể đóng), rồi mới mở micro
		const lan = (cho = { huy: false });
		nha = giuMicro(tat);
		nut.setAttribute('aria-busy', 'true');
		try {
			await moMicro();
		} catch {
			if (!lan.huy) {
				nha?.();
				nha = null;
				cent.textContent = 'Không mở được micro. Hãy cho phép trang dùng micro trong cài đặt trình duyệt rồi thử lại.';
			}
			return;
		} finally {
			cho = null;
			nut.removeAttribute('aria-busy');
		}
		if (lan.huy) return;
		nut.textContent = 'Tắt micro';
		cent.textContent = 'Đang nghe… hãy hát, gảy hoặc kéo một dây.';
		thoi = ngheMicro(({ f }) => {
			if (!(f > 25 && f < 4200)) return;
			muot = muot ? muot * 0.75 + f * 0.25 : f;
			const d = docTanSo(muot, chon.value);
			not.textContent = d.ten;
			hz.textContent = `${muot.toFixed(1).replace('.', ',')} Hz`;
			kim.style.left = `${50 + Math.max(-50, Math.min(50, d.cent))}%`;
			not.classList.toggle('dung', d.dung);
			cent.textContent = d.loi;
		});
	};
	nut.addEventListener('click', () => (thoi ? tat() : cho ? undefined : bat()));
	chon.addEventListener('change', nutDay);
	nutDay();
	goc.dataset.san = '1';
}
