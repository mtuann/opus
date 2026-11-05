// Chấm điểm khi chơi theo, hát theo (D7-L1; thị tấu ở D7-L2 dùng lại), chuyển từ ../opus-zero/docs/assets/js/assess.js. Hàm
// thuần, không đụng tới trình duyệt (kiểm thử: tests/micro.test.mjs). Kết quả mỗi nốt: ket_qua 'dat' (đạt), 'cao', 'thap'
// hay 'thieu' (không nghe thấy, không bấm), cùng lớp màu của hình piano roll (src/scripts/hinh-so-sanh.js).
import { midiCuaTanSo } from './micro.js';

export function trungVi(a) {
	const s = a.slice().sort((x, y) => x - y);
	const n = s.length;
	return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN;
}

/** Gấp độ lệch (cent) về trong ±600 (bỏ qua quãng tám). */
export function boQuangTam(cent) {
	let d = cent;
	while (d > 600) d -= 1200;
	while (d < -600) d += 1200;
	return d;
}

/**
 * Chấm cao độ từ micro (assessPitch cũ): `can` [{ m, t0, dai }] (giây), `khung` [{ t, f }]. Mỗi nốt lấy trung vị cao độ đo
 * được trong khoảng 20%–85% độ dài nốt; dưới 2 khung có tiếng thì thiếu. `boQuang`: bỏ qua quãng tám; `dungSai`: cent (50).
 */
export function chamCaoDo(can, khung, { boQuang = false, dungSai = 50 } = {}) {
	return can.map((n) => {
		const a = n.t0 + n.dai * 0.2;
		const b = n.t0 + n.dai * 0.85;
		const ms = khung.filter((k) => k.t >= a && k.t <= b && k.f > 0).map((k) => midiCuaTanSo(k.f));
		if (ms.length < 2) return { m: n.m, ket_qua: 'thieu' };
		const nghe = trungVi(ms);
		let lech = (nghe - n.m) * 100;
		if (boQuang) lech = boQuangTam(lech);
		lech = Math.round(lech);
		return { m: n.m, nghe, cent: lech, ket_qua: Math.abs(lech) <= dungSai ? 'dat' : lech > 0 ? 'cao' : 'thap' };
	});
}

/**
 * Chấm từ đàn MIDI (assessMidi cũ): mỗi nốt ghép với lần bấm gần nhất trong cửa sổ max(0,12 giây, 35% phách) quanh lúc
 * bắt đầu của nốt; lần bấm không ghép được là bấm thừa. Trả về { nots, thua }.
 */
export function chamMidi(can, phim, phach, { boQuang = false } = {}) {
	const cua = Math.max(0.12, phach * 0.35);
	const da = new Set();
	const nots = can.map((n) => {
		let tot = -1;
		let kc = 1e9;
		phim.forEach((p, i) => {
			if (da.has(i)) return;
			const d = Math.abs(p.t - n.t0);
			if (d <= cua && d < kc) {
				kc = d;
				tot = i;
			}
		});
		if (tot < 0) return { m: n.m, ket_qua: 'thieu' };
		da.add(tot);
		const p = phim[tot];
		const dung = boQuang ? (((p.m - n.m) % 12) + 12) % 12 === 0 : p.m === n.m;
		return { m: n.m, bam: p.m, lech_ms: Math.round((p.t - n.t0) * 1000), ket_qua: dung ? 'dat' : p.m > n.m ? 'cao' : 'thap' };
	});
	return { nots, thua: phim.length - da.size };
}

/** Hát lại một nốt (stablePitch cũ): cao độ ổn định nhất trong các khung có tiếng; dưới 5 khung, hay không ổn định, thì null. */
export function caoDoOnDinh(khung) {
	const ms = khung.filter((k) => k.f > 0).map((k) => midiCuaTanSo(k.f));
	if (ms.length < 5) return null;
	const tv = trungVi(ms);
	const gan = ms.filter((m) => Math.abs(m - tv) < 0.5);
	return gan.length >= ms.length * 0.5 ? trungVi(gan) : null;
}

/** Tóm tắt: { dat, tong, pt (phần trăm) }. */
export function tomTatCham(nots) {
	const dat = nots.filter((n) => n.ket_qua === 'dat').length;
	return { dat, tong: nots.length, pt: nots.length ? Math.round((100 * dat) / nots.length) : 0 };
}
