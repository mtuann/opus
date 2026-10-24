// Âm thanh dùng chung cho các công cụ (bàn phím, vòng quãng năm; sau này máy đếm nhịp, luyện tai…), chuyển từ
// ../opus-zero/docs/assets/js/audio.js. Mặc định dùng mẫu âm piano thật (Salamander Grand Piano, Alexander Holm, CC BY
// 3.0: public/mau-am/piano/LICENSE.txt), một mẫu mỗi ba nửa cung, nốt ở giữa thì phát mẫu gần nhất ở tốc độ khác; mẫu chưa
// tải xong, hay người dùng chọn âm tổng hợp, thì phát âm tổng hợp. Lựa chọn lưu ở cùng khóa với site cũ (opus-zero:sound).
// Khác bản cũ: chỉ tải các mẫu cần cho những nốt sắp phát (chuanBi), không tải cả 30 mẫu (khoảng 2 MB) ngay lần phát đầu.
// Module chỉ đụng tới trình duyệt khi được gọi (tạo AudioContext trong lúc người dùng bấm, như trình duyệt đòi).

const KHOA = 'opus-zero:sound';
const TEN = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
const NGUON = `${import.meta.env?.BASE_URL ?? '/opus/'}mau-am/piano/`;

/** Các mẫu âm: La0 (21) đến Đô8 (108), mỗi ba nửa cung một mẫu: [số MIDI, tên file không đuôi]. */
export const MAU = Array.from({ length: 30 }, (_, i) => 21 + 3 * i).map((m) => [m, TEN[m % 12] + (Math.floor(m / 12) - 1)]);
/** Mẫu gần nhất của nốt m (số MIDI của mẫu), trong số các mẫu `co`; xa quá 4 nửa cung thì null. */
export function mauGanNhat(m, co = MAU.map(([x]) => x)) {
	let tot = null;
	let xa = 99;
	for (const k of co) {
		const d = Math.abs(k - m);
		if (d < xa) [tot, xa] = [k, d];
	}
	return xa <= 4 ? tot : null;
}
/** Mẫu cần để phát nốt m bằng tiếng piano (mẫu gần nhất trong cả bộ). */
const mauCan = (m) => mauGanNhat(m);

let ngCanh = null;
let chinh = null;
const bo = new Map(); // số MIDI của mẫu -> AudioBuffer
const dangTai = new Map(); // số MIDI của mẫu -> promise
const nghe = [];

export function cheDo() {
	try {
		return localStorage.getItem(KHOA) || 'piano';
	} catch {
		return 'piano';
	}
}
export function datCheDo(v) {
	try {
		localStorage.setItem(KHOA, v);
	} catch {
		// trình duyệt chặn lưu: chỉ đổi trong lần này
	}
	baoTin();
}
export const trangThai = () => ({ che_do: cheDo(), da_tai: bo.size, tong: MAU.length });
export const khiDoi = (f) => nghe.push(f);
const baoTin = () => nghe.forEach((f) => f(trangThai()));

/** AudioContext dùng chung (tạo lần đầu khi người dùng bấm); trình duyệt không có Web Audio thì null. */
export function layNgCanh() {
	if (!ngCanh) {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return null;
		ngCanh = new AC();
		chinh = ngCanh.createGain();
		chinh.gain.value = 0.9;
		// bộ nén nhẹ: hợp âm nhiều nốt không bị rè
		if (ngCanh.createDynamicsCompressor) {
			const nen = ngCanh.createDynamicsCompressor();
			try {
				nen.threshold.value = -10;
				nen.knee.value = 12;
				nen.ratio.value = 6;
				nen.attack.value = 0.003;
				nen.release.value = 0.2;
			} catch {
				// trình duyệt cũ: để mặc định
			}
			chinh.connect(nen);
			nen.connect(ngCanh.destination);
		} else chinh.connect(ngCanh.destination);
	}
	if (ngCanh.state === 'suspended') ngCanh.resume?.();
	return ngCanh;
}
const dauRa = () => (layNgCanh(), chinh);

/** Tải một mẫu (một lần); hỏng (mất mạng) thì lần sau thử lại, nốt ấy phát âm tổng hợp. */
function taiMau(m) {
	if (bo.has(m)) return Promise.resolve();
	if (dangTai.has(m)) return dangTai.get(m);
	const c = layNgCanh();
	const ten = MAU.find(([x]) => x === m)?.[1];
	if (!c || !ten || typeof fetch !== 'function') return Promise.resolve();
	const p = fetch(`${NGUON}${ten}.mp3`)
		.then((r) => {
			if (!r.ok) throw new Error(`mẫu âm ${ten}: HTTP ${r.status}`);
			return r.arrayBuffer();
		})
		.then((ab) => new Promise((ok, hong) => c.decodeAudioData(ab, ok, hong)))
		.then((buf) => {
			bo.set(m, buf);
			baoTin();
		})
		.catch(() => {})
		.finally(() => dangTai.delete(m));
	dangTai.set(m, p);
	return p;
}

/**
 * Tải trước các mẫu cần cho các nốt sắp phát (số MIDI); chờ tối đa `cho` mili giây. Chế độ âm tổng hợp thì không tải gì.
 * Gọi trong lúc người dùng bấm (tạo AudioContext).
 */
export function chuanBi(nots, cho = 2000) {
	if (cheDo() !== 'piano' || !layNgCanh()) return Promise.resolve();
	const can = [...new Set(nots.map(mauCan).filter((x) => x !== null))];
	return Promise.race([Promise.all(can.map(taiMau)), new Promise((ok) => setTimeout(ok, cho))]);
}

export const tanSo = (m) => 440 * 2 ** ((m - 69) / 12);

function amTongHop(c, m, t, d, dinh) {
	const g = c.createGain();
	g.gain.setValueAtTime(0.0001, t);
	g.gain.exponentialRampToValueAtTime(dinh, t + 0.015);
	g.gain.exponentialRampToValueAtTime(dinh * 0.35, t + 0.25);
	g.gain.exponentialRampToValueAtTime(0.0001, t + d);
	g.connect(dauRa());
	const f = tanSo(m);
	for (const [loai, boi, to] of [
		['triangle', 1, 1],
		['sine', 2, 0.25],
	]) {
		const o = c.createOscillator();
		const og = c.createGain();
		o.type = loai;
		o.frequency.value = f * boi;
		og.gain.value = to;
		o.connect(og);
		og.connect(g);
		o.start(t);
		o.stop(t + d + 0.05);
	}
}

/** Phát một nốt: số MIDI, lúc bắt đầu (giây theo AudioContext; bỏ trống là ngay), độ dài (giây), âm lượng 0–1 (playNote). */
export function choiNot(m, luc, dai = 1, am = 0.22) {
	const c = layNgCanh();
	if (!c) return;
	const t = (luc ?? c.currentTime) + 0.02;
	const mau = cheDo() === 'piano' ? mauCan(m) : null;
	if (mau !== null && !bo.has(mau)) taiMau(mau); // lần sau có tiếng piano
	if (mau === null || !bo.has(mau)) return amTongHop(c, m, t, dai, am);
	const src = c.createBufferSource();
	const g = c.createGain();
	src.buffer = bo.get(mau);
	src.playbackRate.value = 2 ** ((m - mau) / 12);
	const to = Math.min(1, am * 3.2);
	g.gain.setValueAtTime(to, t);
	g.gain.setValueAtTime(to, t + Math.max(0.05, dai - 0.05));
	g.gain.exponentialRampToValueAtTime(0.0001, t + dai + 0.35);
	src.connect(g);
	g.connect(dauRa());
	src.start(t);
	src.stop(t + dai + 0.4);
}

/** Tiếng gõ nhịp ngắn (máy đếm nhịp); `nhan`: phách mạnh (click). */
export function tiengGo(luc, nhan) {
	const c = layNgCanh();
	if (!c) return;
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = 'square';
	o.frequency.value = nhan ? 1500 : 1000;
	g.gain.setValueAtTime(0.0001, luc);
	g.gain.exponentialRampToValueAtTime(nhan ? 0.3 : 0.18, luc + 0.002);
	g.gain.exponentialRampToValueAtTime(0.0001, luc + 0.05);
	o.connect(g);
	g.connect(dauRa());
	o.start(luc);
	o.stop(luc + 0.06);
}
