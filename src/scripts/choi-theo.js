// Chơi theo (::cong-cu{ten="playalong"}) và hát lại (::cong-cu{ten="singback"}), D7-L1, chuyển từ
// ../opus-zero/docs/assets/js/playalong.js: site nghe người học qua micro (src/scripts/micro.js) hay đàn MIDI
// (src/scripts/midi.js), chấm cao độ và nhịp (src/scripts/cham-diem.js), vẽ piano roll (src/scripts/hinh-so-sanh.js).
// - Chơi theo: năm giai điệu ở Đô trưởng (cùng các bài của "10 bài đầu tiên"), bốn nhạc cụ (piano như viết; giọng hát và
//   guitar bỏ qua quãng tám; violin lên Rê trưởng), tốc độ 50–96; khuông vẽ bằng abcjs (tải khi ô tới gần màn hình);
//   bắt đầu thì đếm 4 tiếng gõ rồi nghe. Lưu như bản cũ: kỹ năng "play" (đạt khi đúng từ 80%), days[ngày].melodies.
// - Hát lại: nghe một nốt (hay hai nốt cách một quãng) rồi hát lại nốt cuối trong 3 giây; kim lệch theo cent khi đang hát,
//   bỏ qua quãng tám (giọng nam hát thấp hơn một quãng tám vẫn đúng); đúng khi lệch không quá 50 cent. Kỹ năng "sing".
// veChoiTheo, veHatLai dựng sẵn ô lúc build, mount thêm phần bấm được.
import { choiNot, chuanBi, layNgCanh, tiengGo } from './am-thanh.js';
import { boQuangTam, caoDoOnDinh, chamCaoDo, chamMidi, tomTatCham } from './cham-diem.js';
import { hangKetQua, pianoRoll, tenNot } from './hinh-so-sanh.js';
import { coMicro, dongMicro, giuMicro, midiCuaTanSo, moMicro, ngheMicro } from './micro.js';
import { coMidi, ketNoi, nghe, veTrangThaiMidi } from './midi.js';
import { ghiNgay, kyNang } from './tien-do.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const tenKhongSo = (m) => tenNot(m).replace(/-?\d+$/, '');

/** Giai điệu: [số MIDI, số phách] ở Đô trưởng (SONGS cũ). */
export const BAI = {
	twinkle: { ten: 'Twinkle, Twinkle (Ah! vous dirai-je, maman)', not: [[60, 1], [60, 1], [67, 1], [67, 1], [69, 1], [69, 1], [67, 2], [65, 1], [65, 1], [64, 1], [64, 1], [62, 1], [62, 1], [60, 2]] },
	lightly: { ten: 'Hänschen klein (Lightly Row)', not: [[67, 1], [64, 1], [64, 2], [65, 1], [62, 1], [62, 2], [60, 1], [62, 1], [64, 1], [65, 1], [67, 1], [67, 1], [67, 2]] },
	lune: { ten: 'Au clair de la lune', not: [[60, 1], [60, 1], [60, 1], [62, 1], [64, 2], [62, 2], [60, 1], [64, 1], [62, 1], [62, 1], [60, 4]] },
	ode: { ten: 'Ode to Joy (Beethoven)', not: [[64, 1], [64, 1], [65, 1], [67, 1], [67, 1], [65, 1], [64, 1], [62, 1], [60, 1], [60, 1], [62, 1], [64, 1], [64, 1.5], [62, 0.5], [62, 2]] },
	scale: { ten: 'Gam Đô trưởng đi lên', not: [[60, 1], [62, 1], [64, 1], [65, 1], [67, 1], [69, 1], [71, 1], [72, 1]] },
};
/** Nhạc cụ: dịch giọng (nửa cung) và bỏ qua quãng tám khi chấm (INSTR cũ). */
export const NHAC_CU = {
	piano: { ten: 'Piano, sáo, giọng nữ (như viết)', dich: 0, boQuang: false },
	voice: { ten: 'Giọng hát (bỏ qua quãng tám)', dich: 0, boQuang: true },
	violin: { ten: 'Violin (lên Rê trưởng, +2)', dich: 2, boQuang: false },
	guitar: { ten: 'Guitar (âm thật thấp một quãng tám)', dich: -12, boQuang: true },
};
export const TOC_DO = [50, 66, 80, 96];

const CHU_ABC = ['C', '^C', 'D', '_E', 'E', 'F', '^F', 'G', '^G', 'A', '_B', 'B'];
/** Giai điệu thành nốt ABC (L:1/8, mỗi ô 4 phách) (toAbc cũ); dịch +2 thì viết ở Rê trưởng (Fa♯, Đô♯ đã có trong hóa biểu). */
export function sangAbc(nots, dich) {
	const s = ((dich % 12) + 12) % 12;
	const chu = s === 2 ? ['C', '^C', 'D', '_E', 'E', 'F', 'F', 'G', '^G', 'A', '_B', 'B'] : CHU_ABC;
	const sua = s === 2 ? { 1: 'C', 6: 'F' } : {};
	let phach = 0;
	return nots
		.map(([m0, dai]) => {
			const m = m0 + s;
			const pc = m % 12;
			const o = Math.floor(m / 12) - 1;
			let p = sua[pc] || chu[pc];
			p = o >= 5 ? p.replace(/[A-G]/, (c) => c.toLowerCase()) + "'".repeat(o - 5) : p + ','.repeat(4 - o);
			const d = dai * 2;
			phach += dai;
			return p + (d === 1 ? '' : String(d)) + (phach % 4 === 0 ? ' |' : '');
		})
		.join(' ');
}

/** Mã ABC của khuông chơi theo. */
export function abcBai(bai, nhacCu) {
	const nc = NHAC_CU[nhacCu];
	const giong = nc.dich === 2 ? 'D' : 'C';
	return `X:1\nL:1/8\nM:4/4\nK:${giong}${nhacCu === 'guitar' ? ' clef=treble-8' : ''}\n${sangAbc(BAI[bai].not, nc.dich === -12 ? 0 : nc.dich).replace(/ \|$/, '')} |]`;
}

/** Các nốt cần chơi từ lúc `t0`, mỗi phách `phach` giây: [{ m, t0, dai }]. */
export function notCan(bai, nhacCu, t0, phach) {
	let t = t0;
	return BAI[bai].not.map(([m, so]) => {
		const n = { m: m + NHAC_CU[nhacCu].dich, t0: t, dai: so * phach };
		t += so * phach;
		return n;
	});
}

// hàng kết quả từng nốt: chuyển sang hinh-so-sanh.js (thị tấu một bè dùng chung, D7-L2)
export { hangKetQua };

const tuyChon = (o, chon) => Object.entries(o).map(([k, v]) => `<option value="${k}"${k === chon ? ' selected' : ''}>${esc(v.ten)}</option>`).join('');

export const veChoiTheo = () =>
	`<div class="oz-choi-theo oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Bài <select data-k="bai">${tuyChon(BAI)}</select></label>` +
	`<label>Nhạc cụ <select data-k="nhac-cu">${tuyChon(NHAC_CU)}</select></label>` +
	`<label>Tốc độ <select data-k="bpm">${TOC_DO.map((b) => `<option${b === 66 ? ' selected' : ''}>${b}</option>`).join('')}</select></label>` +
	`<label>Nghe bằng <select data-k="nguon"><option value="mic">Micro</option><option value="midi">Đàn MIDI</option></select></label></div>` +
	`<div class="oz-choi-theo-midi" hidden>${veTrangThaiMidi()}</div>` +
	`<div class="oz-choi-theo-khuong" role="img" aria-label="Khuông nhạc của bài đang chọn"></div>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="mau">Nghe mẫu</button>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="bat-dau">Bắt đầu (đếm 4 nhịp)</button>` +
	`<button type="button" class="oz-btn" data-act="dung" hidden>Dừng</button></div>` +
	`<p class="oz-feedback" aria-live="polite">Chọn bài, bấm “Bắt đầu”, nghe 4 tiếng đếm rồi chơi (hoặc hát) theo nhịp.</p>` +
	`<div class="oz-choi-theo-kq"></div>` +
	`<noscript data-sinh><p>Chơi theo cần JavaScript và micro hay đàn MIDI: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mountChoiTheo(goc) {
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	const phanHoi = goc.querySelector('.oz-feedback');
	const kq = goc.querySelector('.oz-choi-theo-kq');
	const khuong = goc.querySelector('.oz-choi-theo-khuong');
	const oMidi = goc.querySelector('.oz-choi-theo-midi');
	const nutBat = goc.querySelector('[data-act="bat-dau"]');
	const nutDung = goc.querySelector('[data-act="dung"]');
	let dang = null;
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	const ve = async () => {
		try {
			// abc.js chỉ chạy trong trình duyệt (đọc document khi nạp): nạp lúc cần, không nạp lúc build
			const ABCJS = await (await import('./abc.js')).taiAbcjs();
			// khung hẹp (điện thoại): để abcjs xuống dòng cho nốt đủ to, như khối ```abc (src/scripts/abc.js)
			const w = khuong.clientWidth;
			const o = { responsive: 'resize', foregroundColor: 'currentColor', paddingleft: 0, paddingright: 0 };
			if (w && w < 620) {
				o.staffwidth = Math.max(260, Math.round(w * 1.15));
				o.wrap = { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 2 };
			}
			ABCJS.renderAbc(khuong, abcBai(chon('bai').value, chon('nhac-cu').value), o);
			khuong.setAttribute('aria-label', `Khuông nhạc: ${BAI[chon('bai').value].ten}`);
		} catch {
			khuong.textContent = 'Không tải được thư viện vẽ khuông nhạc. Kiểm tra kết nối mạng rồi tải lại trang.';
		}
	};
	const mau = async () => {
		const c = layNgCanh();
		if (!c) return;
		const can = notCan(chon('bai').value, chon('nhac-cu').value, 0, 60 / Number(chon('bpm').value));
		await chuanBi(can.map((n) => n.m));
		const t = c.currentTime + 0.1;
		for (const n of can) choiNot(n.m, t + n.t0, n.dai * 0.95);
	};
	const xong = () => {
		if (!dang) return;
		const r = dang;
		dang = null;
		// dừng (hay công cụ khác nhận micro) trong lúc chờ micro, đàn MIDI: hủy, không chấm
		if (r.cho) {
			r.huy = true;
			r.nha?.();
			if (r.nguon === 'mic') dongMicro();
			return;
		}
		clearTimeout(r.hen);
		r.thoi();
		r.nha?.();
		nutDung.hidden = true;
		nutBat.hidden = false;
		const nc = NHAC_CU[chon('nhac-cu').value];
		let nots;
		let thua = '';
		if (r.nguon === 'midi') {
			const c = chamMidi(r.can, r.phim, r.phach, { boQuang: nc.boQuang });
			nots = c.nots;
			if (c.thua) thua = ` Bấm thừa ${c.thua} phím.`;
		} else nots = chamCaoDo(r.can, r.khung, { boQuang: nc.boQuang });
		const tt = tomTatCham(nots);
		kq.innerHTML = hangKetQua(nots) + pianoRoll({ can: r.can.map((n, i) => ({ ...n, ket_qua: nots[i].ket_qua })), khung: r.khung, phim: r.phim, boQuangTam: nc.boQuang });
		const thieu = nots.filter((n) => n.ket_qua === 'thieu').length;
		bao(
			`Đúng ${tt.dat}/${tt.tong} nốt (${tt.pt}%).${thua}` +
				(thieu > tt.tong / 2
					? r.nguon === 'mic'
						? ' Site nghe được rất ít: kiểm tra micro, chơi to hơn, hoặc đeo tai nghe nếu bật nghe mẫu.'
						: ' Hãy kiểm tra kết nối đàn.'
					: tt.pt === 100
						? ' Tuyệt vời! Thử tăng tốc độ.'
						: ' Ô màu đỏ: số cent cao (+) hoặc thấp (−) so với nốt đúng; 100 cent = nửa cung.'),
			tt.pt >= 80 ? 'ok' : 'bad',
		);
		kyNang('play', tt.pt >= 80);
		ghiNgay('melodies', 1);
	};
	const batDau = async () => {
		const c = layNgCanh();
		if (!c || dang) return;
		const nguon = chon('nguon').value;
		const phach = 60 / Number(chon('bpm').value);
		if (nguon === 'midi' && !coMidi()) return bao('Trình duyệt này không có MIDI trên web. Dùng Chrome hay Edge trên máy tính, hoặc chọn Micro.', 'bad');
		if (nguon === 'mic' && !coMicro()) return bao('Trình duyệt này không mở được micro.', 'bad');
		// đang chờ micro hay đàn MIDI (người dùng đang được hỏi quyền): bấm thêm thì bỏ qua
		const cho = (dang = { cho: true, nguon, huy: false, nha: null });
		try {
			if (nguon === 'midi') await ketNoi();
			else {
				cho.nha = giuMicro(xong);
				await moMicro();
			}
		} catch {
			if (cho.huy) return;
			dang = null;
			cho.nha?.();
			return bao(nguon === 'midi' ? 'Chưa kết nối được đàn MIDI.' : 'Không mở được micro. Hãy cho phép trang dùng micro rồi thử lại.', 'bad');
		}
		if (cho.huy) return;
		const nha = cho.nha;
		const t0 = c.currentTime + 0.15;
		for (let i = 0; i < 4; i++) tiengGo(t0 + i * phach, i === 0);
		const can = notCan(chon('bai').value, chon('nhac-cu').value, t0 + 4 * phach, phach);
		const het = can[can.length - 1].t0 + can[can.length - 1].dai;
		dang = { nguon, can, phach, khung: [], phim: [], nha, thoi: () => {} };
		const r = dang;
		r.thoi = nguon === 'midi' ? nghe((su) => su.loai === 'on' && r.phim.push({ t: su.luc, m: su.m })) : ngheMicro((k) => r.khung.push(k));
		nutDung.hidden = false;
		nutBat.hidden = true;
		bao('1 – 2 – 3 – 4… chơi!');
		kq.innerHTML = '';
		r.hen = setTimeout(xong, (het - c.currentTime + 0.5) * 1000);
	};
	goc.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		if (b.dataset.act === 'mau') mau();
		if (b.dataset.act === 'bat-dau') batDau();
		if (b.dataset.act === 'dung') xong();
	});
	goc.addEventListener('change', (e) => {
		const k = e.target.dataset.k;
		if (k === 'nguon') oMidi.hidden = e.target.value !== 'midi';
		if (k === 'bai' || k === 'nhac-cu') {
			kq.innerHTML = '';
			ve();
		}
	});
	ve();
}

/** Quãng của bài hát quãng đi lên: số nửa cung -> tên (IV cũ). */
export const QUANG = { 2: '2 trưởng', 3: '3 thứ', 4: '3 trưởng', 5: '4 đúng', 7: '5 đúng', 9: '6 trưởng', 12: '8 đúng' };

/** Câu hỏi mới (newQ cũ; `r`: hàm ngẫu nhiên): { goc, quang, dich } (dich: nốt cần hát). */
export function cauHat(giong, kieu, r = Math.random) {
	const nen = giong === 'low' ? 48 : 60;
	if (kieu === 'interval') {
		const ds = Object.keys(QUANG).map(Number);
		const q = ds[Math.floor(r() * ds.length)];
		const g = nen + Math.floor(r() * Math.max(1, 12 - q + 1));
		return { goc: g, quang: q, dich: g + q };
	}
	return { dich: nen + Math.floor(r() * 10) };
}

/** Kết quả hát (hàm thuần): `nghe` là cao độ ổn định (số MIDI) hay null. */
export function chamHat(nghe, dich) {
	if (nghe === null) return { dat: false, chu: 'Site chưa nghe rõ. Hãy hát to và giữ một nốt ổn định, ở nơi yên tĩnh.', ket_qua: 'thieu' };
	const d = Math.round(boQuangTam((nghe - dich) * 100));
	const dat = Math.abs(d) <= 50;
	return {
		dat,
		cent: d,
		ket_qua: dat ? 'dat' : d > 0 ? 'cao' : 'thap',
		chu: dat
			? `Đúng! Lệch ${d > 0 ? '+' : ''}${d} cent.`
			: `${d > 0 ? `Cao hơn ${d} cent` : `Thấp hơn ${-d} cent`}${Math.abs(d) >= 100 ? ` (khoảng ${Math.round(Math.abs(d) / 100)} nửa cung).` : '.'} Nghe lại và thử lần nữa.`,
	};
}

export const veHatLai = () =>
	`<div class="oz-hat-lai oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><label>Giọng <select data-k="giong"><option value="low">Nam (trầm)</option><option value="high" selected>Nữ, trẻ em (cao)</option></select></label>` +
	`<label>Bài <select data-k="kieu"><option value="unison">Hát lại một nốt</option><option value="interval">Hát quãng đi lên</option></select></label></div>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="moi">Câu mới</button>` +
	`<button type="button" class="oz-btn" data-act="nghe">Nghe lại</button>` +
	`<button type="button" class="oz-btn" data-act="hat">Hát (3 giây)</button></div>` +
	`<div class="oz-kim" aria-hidden="true"><span class="oz-kim-giua"></span><span class="oz-kim-chi"></span></div>` +
	`<p class="oz-feedback" aria-live="polite">Bấm “Câu mới”, nghe, rồi bấm “Hát” và ngân nốt cần hát (âm “a” hoặc “la”).</p>` +
	`<div class="oz-hat-lai-hinh"></div><p class="oz-stats oz-hat-lai-so"></p>` +
	`<noscript data-sinh><p>Hát lại cần JavaScript và micro: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mountHatLai(goc) {
	const chon = (k) => goc.querySelector(`[data-k="${k}"]`);
	const phanHoi = goc.querySelector('.oz-feedback');
	const so = goc.querySelector('.oz-hat-lai-so');
	const kim = goc.querySelector('.oz-kim-chi');
	const hinh = goc.querySelector('.oz-hat-lai-hinh');
	let cau = null;
	let dangHat = null;
	const luot = { dat: 0, n: 0 };
	const bao = (s, lop = '') => {
		phanHoi.textContent = s;
		phanHoi.className = `oz-feedback${lop ? ` ${lop}` : ''}`;
	};
	const phat = async () => {
		const c = layNgCanh();
		if (!cau || !c) return;
		await chuanBi([cau.goc ?? cau.dich, cau.dich]);
		const t = c.currentTime + 0.05;
		if (cau.quang) {
			choiNot(cau.goc, t, 0.9);
			choiNot(cau.dich, t + 1.0, 1.2);
		} else choiNot(cau.dich, t, 1.5);
	};
	const moi = () => {
		cau = cauHat(chon('giong').value, chon('kieu').value);
		hinh.innerHTML = '';
		bao(cau.quang ? `Nghe hai nốt (quãng ${QUANG[cau.quang]}), rồi hát lại nốt thứ hai.` : 'Nghe một nốt, rồi hát lại.');
		phat();
	};
	const thoiHat = () => {
		if (!dangHat) return;
		const h = dangHat;
		dangHat = null;
		// thôi trong lúc chờ micro mở: hủy lần mở ấy
		if (h.cho) {
			h.huy = true;
			h.nha?.();
			dongMicro();
			return;
		}
		clearTimeout(h.hen);
		h.thoi();
		h.nha();
	};
	const hat = async () => {
		if (!cau) return moi();
		if (dangHat) return;
		if (!coMicro()) return bao('Trình duyệt này không mở được micro.', 'bad');
		const cho = (dangHat = { cho: true, huy: false, nha: null });
		cho.nha = giuMicro(thoiHat);
		try {
			await moMicro();
		} catch {
			if (cho.huy) return;
			dangHat = null;
			cho.nha();
			return bao('Không mở được micro. Hãy cho phép trang dùng micro.', 'bad');
		}
		if (cho.huy) return;
		const nha = cho.nha;
		const khung = [];
		const dich = cau.dich;
		bao(`Đang nghe… hãy ngân nốt ${tenKhongSo(dich)}.`);
		const thoi = ngheMicro((k) => {
			khung.push(k);
			if (k.f > 0) kim.style.left = `${50 + Math.max(-50, Math.min(50, boQuangTam((midiCuaTanSo(k.f) - dich) * 100) / 2))}%`;
		});
		dangHat = { thoi, nha };
		dangHat.hen = setTimeout(() => {
			thoiHat();
			const ket = chamHat(caoDoOnDinh(khung), dich);
			const co = khung.filter((k) => k.f > 0);
			if (co.length) {
				const t0 = co[0].t;
				hinh.innerHTML = pianoRoll({ can: [{ m: dich, t0, dai: Math.max(0.5, co[co.length - 1].t - t0), ket_qua: ket.ket_qua }], khung: co, boQuangTam: true });
			}
			if (ket.ket_qua === 'thieu') return bao(ket.chu, 'bad');
			luot.n++;
			if (ket.dat) luot.dat++;
			kyNang('sing', ket.dat);
			bao(ket.chu, ket.dat ? 'ok' : 'bad');
			so.textContent = `Lượt này: ${luot.dat}/${luot.n} lần trong khoảng ±50 cent.`;
		}, 3000);
	};
	goc.addEventListener('click', (e) => {
		const b = e.target.closest('button[data-act]');
		if (!b) return;
		if (b.dataset.act === 'moi') moi();
		if (b.dataset.act === 'nghe') phat();
		if (b.dataset.act === 'hat') hat();
	});
}

export function mount(goc) {
	if (goc.dataset.san) return;
	if (goc.classList.contains('oz-choi-theo')) mountChoiTheo(goc);
	else mountHatLai(goc);
	goc.dataset.san = '1';
}
