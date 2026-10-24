// Âm thanh dùng chung cho các công cụ (bàn phím, vòng quãng năm; sau này máy đếm nhịp, luyện tai…), chuyển từ
// ../opus-zero/docs/assets/js/audio.js. Mặc định dùng mẫu âm piano thật (Salamander Grand Piano, Alexander Holm, CC BY
// 3.0: public/mau-am/piano/LICENSE.txt), một mẫu mỗi ba nửa cung, nốt ở giữa thì phát mẫu gần nhất ở tốc độ khác; mẫu chưa
// tải xong, hay người dùng chọn âm tổng hợp, thì phát âm tổng hợp. Lựa chọn lưu ở cùng khóa với site cũ (opus-zero:sound).
// Khác bản cũ: không tải cả 30 mẫu (khoảng 2 MB, giải mã ra khoảng 170 MB) ngay lần phát đầu, mà tải theo vùng: công cụ
// gọi taiTruoc với các nốt sắp dùng (bàn phím: các phím quanh chỗ người học bắt đầu bấm, src/scripts/ban-phim.js), mẫu
// gần nốt đang bấm giải mã trước. Bộ nhớ có giới hạn: mẫu đã giải mã chỉ giữ 4 giây đầu (catMau), giữ tối đa GIOI_HAN_MAU
// mẫu (bỏ mẫu lâu không dùng nhất), giải mã tối đa GIAI_MA_CUNG_LUC mẫu một lúc (mỗi mẫu đầy đủ chiếm khoảng 6 MB khi giải mã).
// Giải mã bằng OfflineAudioContext, không cần thao tác của người dùng, nên tải trước được cả khi chưa bấm (rê chuột, chạm).
// Module chỉ đụng tới trình duyệt khi được gọi (tạo AudioContext trong lúc người dùng bấm, như trình duyệt đòi). Không tạo
// được AudioContext thì mọi hàm phát im lặng bỏ qua: công cụ vẫn chạy phần hình (tên nốt, phím nháy).

const KHOA = 'opus-zero:sound';
const TEN = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
const NGUON = `${import.meta.env?.BASE_URL ?? '/opus/'}mau-am/piano/`;
/** Số mẫu đã giải mã giữ cùng lúc (mỗi mẫu 4 giây, khoảng 1,4 MB): đủ cho một vùng ±12 nửa cung (tối đa 9 mẫu) và hơn. */
export const GIOI_HAN_MAU = 12;
/** Số mẫu giải mã cùng lúc: mẫu đầy đủ (16 giây) chỉ tồn tại trong lúc giải mã, nên giới hạn này chặn đỉnh bộ nhớ. */
export const GIAI_MA_CUNG_LUC = 2;

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
let giaiMa = null; // OfflineAudioContext chỉ dùng để giải mã mẫu
const bo = new Map(); // số MIDI của mẫu -> AudioBuffer; thứ tự là thứ tự dùng (đầu: lâu không dùng nhất)
const dangTai = new Map(); // số MIDI của mẫu -> { p: promise, uuTien }
const hang = []; // mẫu đã tải, chờ giải mã: { viec, ab, ok, hong }
let dangGiai = 0;
let lanGoi = 0; // tăng mỗi lần gọi tải: lần gọi sau ưu tiên hơn
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
/** Các mẫu đang giữ (số MIDI), từ mẫu lâu không dùng nhất đến mẫu vừa dùng. */
export const mauDaGiu = () => [...bo.keys()];
export const khiDoi = (f) => nghe.push(f);
const baoTin = () => nghe.forEach((f) => f(trangThai()));

/**
 * AudioContext dùng chung (tạo lần đầu khi người dùng bấm). Trình duyệt không có Web Audio, hay không tạo được (ném lỗi,
 * ví dụ đã quá số AudioContext cho phép), thì null.
 */
export function layNgCanh() {
	if (!ngCanh) {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return null;
		try {
			ngCanh = new AC();
		} catch {
			return null;
		}
		// iPhone: Web Audio mặc định theo công tắc im lặng; "playback" phát như trình nghe nhạc (Audio Session API, Safari 17+)
		try {
			if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback';
		} catch {
			// trình duyệt không cho đặt: để mặc định
		}
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
	// "suspended" (chưa có thao tác của người dùng) hay "interrupted" (iOS: cuộc gọi, chuyển ứng dụng): đánh thức lại
	if (ngCanh.state !== 'running') ngCanh.resume?.()?.catch?.(() => {});
	return ngCanh;
}
const dauRa = () => (layNgCanh(), chinh);

/** Số giây giữ lại của mỗi mẫu: đủ cho nốt dài nhất các công cụ phát (khoảng 2,5 giây), cả khi phát chậm hơn một nửa cung. */
export const DAI_MAU = 4;

/**
 * Cắt mẫu đã giải mã còn DAI_MAU giây đầu, làm nhỏ dần 50 ms cuối (không có tiếng "tách" nếu nốt kéo tới đó); mẫu ngắn hơn
 * thì giữ nguyên. Mẫu đầy đủ (16 giây, khoảng 6 MB sau khi giải mã) không còn ai giữ nên được giải phóng.
 */
export function catMau(c, buf) {
	const n = Math.min(buf.length, Math.round(DAI_MAU * buf.sampleRate));
	if (n >= buf.length) return buf;
	const moi = c.createBuffer(buf.numberOfChannels, n, buf.sampleRate);
	const mo = Math.min(n, Math.round(0.05 * buf.sampleRate));
	for (let k = 0; k < buf.numberOfChannels; k++) {
		const ra = moi.getChannelData(k);
		ra.set(buf.getChannelData(k).subarray(0, n));
		for (let i = 0; i < mo; i++) ra[n - mo + i] *= 1 - i / mo;
	}
	return moi;
}

/** Ngữ cảnh để giải mã mẫu: OfflineAudioContext (không phát tiếng, không cần thao tác của người dùng); không có thì null. */
function ngCanhGiaiMa() {
	if (!giaiMa) {
		const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
		if (!OAC) return null;
		try {
			giaiMa = new OAC(2, 1, 44100);
		} catch {
			return null;
		}
	}
	return giaiMa;
}

/** Mẫu m đã giải mã (đánh dấu vừa dùng), hay undefined. */
function layMau(m) {
	const buf = bo.get(m);
	if (buf) {
		bo.delete(m);
		bo.set(m, buf);
	}
	return buf;
}
/** Giữ mẫu vừa giải mã; quá GIOI_HAN_MAU mẫu thì bỏ mẫu lâu không dùng nhất (nốt đang phát vẫn giữ mẫu của nó tới hết). */
function giuMau(m, buf) {
	bo.delete(m);
	bo.set(m, buf);
	while (bo.size > GIOI_HAN_MAU) bo.delete(bo.keys().next().value);
}

/** Giải mã lần lượt (tối đa GIAI_MA_CUNG_LUC mẫu một lúc), mẫu ưu tiên cao trước. */
function giaiTiep() {
	while (dangGiai < GIAI_MA_CUNG_LUC && hang.length) {
		let k = 0;
		for (let i = 1; i < hang.length; i++) if (hang[i].viec.uuTien > hang[k].viec.uuTien) k = i;
		const { ab, ok, hong } = hang.splice(k, 1)[0];
		const c = ngCanhGiaiMa();
		dangGiai++;
		// decodeAudioData vừa gọi lại (trình duyệt cũ) vừa trả promise (trình duyệt mới): bắt cả hai, kẻo file hỏng (hay
		// nhận trang HTML thay mp3) thành lỗi "unhandled rejection"
		new Promise((xong, loi) => c.decodeAudioData(ab, xong, loi)?.catch?.(loi))
			.then((buf) => catMau(c, buf))
			.then(ok, hong)
			.finally(() => {
				dangGiai--;
				giaiTiep();
			});
	}
}

/**
 * Tải và giải mã một mẫu (một lần), ưu tiên `uuTien` (lớn hơn: giải mã trước). Đã có thì đánh dấu vừa dùng; đang tải thì
 * nâng ưu tiên. Hỏng (mất mạng, file lỗi) thì lần sau thử lại, nốt ấy phát âm tổng hợp.
 */
function taiMau(m, uuTien = ++lanGoi * 100) {
	if (layMau(m)) return Promise.resolve();
	const dang = dangTai.get(m);
	if (dang) {
		dang.uuTien = Math.max(dang.uuTien, uuTien);
		return dang.p;
	}
	const ten = MAU.find(([x]) => x === m)?.[1];
	if (!ten || !ngCanhGiaiMa() || typeof fetch !== 'function') return Promise.resolve();
	const viec = { uuTien };
	viec.p = fetch(`${NGUON}${ten}.mp3`)
		.then((r) => {
			if (!r.ok) throw new Error(`mẫu âm ${ten}: HTTP ${r.status}`);
			return r.arrayBuffer();
		})
		.then(
			(ab) =>
				new Promise((ok, hong) => {
					hang.push({ viec, ab, ok, hong });
					giaiTiep();
				}),
		)
		.then((buf) => {
			giuMau(m, buf);
			baoTin();
		})
		.catch(() => {})
		.finally(() => dangTai.delete(m));
	dangTai.set(m, viec);
	return viec.p;
}

/**
 * Bắt đầu tải (không cần chờ) các mẫu cho các nốt `nots` (số MIDI), mẫu gần nốt `tam` giải mã trước; lần gọi sau ưu tiên
 * hơn lần gọi trước. Tối đa GIOI_HAN_MAU mẫu, gần `tam` nhất. Chế độ âm tổng hợp thì không tải gì. Trả về promise xong
 * khi các mẫu ấy đã tải (hay hỏng).
 */
export function taiTruoc(nots, tam = nots[0]) {
	if (cheDo() !== 'piano' || !nots.length) return Promise.resolve();
	const can = [...new Set(nots.map(mauCan).filter((x) => x !== null))]
		.sort((a, b) => Math.abs(a - tam) - Math.abs(b - tam))
		.slice(0, GIOI_HAN_MAU);
	const lan = ++lanGoi * 100;
	return Promise.all(can.map((m, i) => taiMau(m, lan - i)));
}

/** Tải trước các mẫu cần cho các nốt sắp phát (số MIDI), như taiTruoc; chờ tối đa `cho` mili giây. */
export function chuanBi(nots, cho = 2000) {
	if (cheDo() !== 'piano') return Promise.resolve();
	return Promise.race([taiTruoc(nots), new Promise((ok) => setTimeout(ok, cho))]);
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

/**
 * Phát một nốt: số MIDI, lúc bắt đầu (giây theo AudioContext; bỏ trống là ngay), độ dài (giây, đến khoảng 3 giây: mẫu chỉ
 * giữ DAI_MAU giây), âm lượng 0–1 (playNote). Mẫu của nốt chưa có thì tải (lần sau có tiếng piano), lần này phát âm tổng hợp.
 */
export function choiNot(m, luc, dai = 1, am = 0.22) {
	const c = layNgCanh();
	if (!c) return;
	const t = (luc ?? c.currentTime) + 0.02;
	const mau = cheDo() === 'piano' ? mauCan(m) : null;
	const buf = mau === null ? undefined : layMau(mau);
	if (mau !== null && !buf) taiMau(mau); // lần sau có tiếng piano
	if (!buf) return amTongHop(c, m, t, dai, am);
	const src = c.createBufferSource();
	const g = c.createGain();
	src.buffer = buf;
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
