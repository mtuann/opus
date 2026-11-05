// Micro dùng chung (D7-L1), chuyển từ ../opus-zero/docs/assets/js/mic.js và phần tìm cao độ của tuner.js: mở micro một lần
// cho cả trang, các công cụ nhận { t (giây, đồng hồ của AudioContext), f (Hz, -1 khi không rõ), rms } mỗi 30 ms qua
// ngheMicro(f); công cụ cuối cùng thôi nghe thì micro đóng. Âm thanh chỉ xử lý trong trình duyệt, không ghi, không gửi đi.
// - iPhone, iPad: khi micro mở, Audio Session là "play-and-record" (vừa phát tiếng mẫu vừa thu, AGENTS.md); đóng thì trả
//   về "playback" như src/scripts/am-thanh.js đặt khi phát.
// - Mỗi lúc chỉ một công cụ dùng micro (activeStop của tuner.js cũ): giuMicro(dung) tắt công cụ đang dùng trước.
// - Rời trang (pagehide) thì đóng micro.
// - Tắt khử vọng, lọc ồn, tự chỉnh âm lượng của trình duyệt: các bộ lọc ấy làm sai cao độ (như bản cũ).
import { layNgCanh } from './am-thanh.js';

export const coMicro = () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

/** Đặt Audio Session của Safari (iOS 16.4+): thu và phát khi micro mở, chỉ phát khi đóng. Trình duyệt khác bỏ qua. */
export function phienThu(bat) {
	try {
		if (navigator.audioSession) navigator.audioSession.type = bat ? 'play-and-record' : 'playback';
	} catch {
		// trình duyệt không cho đặt: để mặc định
	}
}

/**
 * Tần số cơ bản của một đoạn sóng (detect của tuner.js cũ: tự tương quan, nội suy parabol); im quá (RMS dưới 0,01) hay
 * không tìm được thì -1.
 */
export function tanSoCoBan(buf, rate) {
	let rms = 0;
	for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
	if (Math.sqrt(rms / buf.length) < 0.01) return -1;
	let a = 0;
	let b = buf.length - 1;
	const th = 0.2;
	for (let i = 0; i < buf.length / 2; i++)
		if (Math.abs(buf[i]) < th) {
			a = i;
			break;
		}
	for (let i = 1; i < buf.length / 2; i++)
		if (Math.abs(buf[buf.length - i]) < th) {
			b = buf.length - i;
			break;
		}
	const x = buf.slice(a, b);
	const n = x.length;
	const c = new Float32Array(n);
	for (let lag = 0; lag < n; lag++) {
		let s = 0;
		for (let i = 0; i < n - lag; i++) s += x[i] * x[i + lag];
		c[lag] = s;
	}
	let d = 0;
	while (d < n - 1 && c[d] > c[d + 1]) d++;
	let max = -1;
	let pos = -1;
	for (let i = d; i < n; i++)
		if (c[i] > max) {
			max = c[i];
			pos = i;
		}
	if (pos <= 0 || pos >= n - 1) return -1;
	const [x1, x2, x3] = [c[pos - 1], c[pos], c[pos + 1]];
	const A = (x1 + x3 - 2 * x2) / 2;
	const B = (x3 - x1) / 2;
	return rate / (A ? pos - B / (2 * A) : pos);
}

/** Số MIDI (có phần lẻ) của tần số f (freqToMidi cũ). */
export const midiCuaTanSo = (f) => 69 + 12 * Math.log2(f / 440);

let dungTruoc = null;
/** Công cụ bắt đầu dùng micro: công cụ đang dùng (nếu khác) thôi trước. Trả về hàm nhả lượt (gọi khi công cụ tắt). */
export function giuMicro(dung) {
	if (dungTruoc && dungTruoc !== dung) dungTruoc();
	dungTruoc = dung;
	return () => {
		if (dungTruoc === dung) dungTruoc = null;
	};
}

let luong = null;
let phan = null;
let dem = null;
let hen = 0;
let dangMo = null;
/** Tăng mỗi lần đóng: lần mở nào bắt đầu trước lần đóng gần nhất thì khi getUserMedia xong, đóng luồng ngay (bị hủy). */
let lanDong = 0;
const nghe = [];

function nhip() {
	if (!phan) return;
	phan.getFloatTimeDomainData(dem);
	let rms = 0;
	for (let i = 0; i < dem.length; i++) rms += dem[i] * dem[i];
	rms = Math.sqrt(rms / dem.length);
	const f = tanSoCoBan(dem, phan.context.sampleRate);
	const khung = { t: phan.context.currentTime, f: f > 25 && f < 4200 ? f : -1, rms };
	for (const fn of nghe.slice()) fn(khung);
}

/** Mở micro (một lần cho cả trang). Promise lỗi khi trình duyệt không có micro, không có Web Audio hay bị từ chối. */
export function moMicro() {
	if (luong) return Promise.resolve();
	if (dangMo) return dangMo;
	if (!coMicro()) return Promise.reject(new Error('khong-co-micro'));
	const c = layNgCanh();
	if (!c) return Promise.reject(new Error('khong-co-web-audio'));
	phienThu(true);
	const lan = lanDong;
	dangMo = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(
		(s) => {
			// đã đóng (rời trang, công cụ khác dùng micro) trong lúc chờ người dùng cho phép: đóng luồng vừa mở
			if (lan !== lanDong) {
				for (const t of s.getTracks()) t.stop();
				throw new Error('da-huy');
			}
			luong = s;
			dangMo = null;
			phan = c.createAnalyser();
			phan.fftSize = 2048;
			dem = new Float32Array(phan.fftSize);
			c.createMediaStreamSource(s).connect(phan);
			hen = setInterval(nhip, 30);
		},
		(e) => {
			if (lan === lanDong) dangMo = null;
			if (!luong) phienThu(false);
			throw e;
		},
	);
	return dangMo;
}

/** Đóng micro (dừng luồng; đèn micro của trình duyệt tắt). */
export function dongMicro() {
	lanDong++;
	clearInterval(hen);
	hen = 0;
	if (luong) for (const t of luong.getTracks()) t.stop();
	if (luong || dangMo) phienThu(false);
	luong = null;
	phan = null;
	dangMo = null;
}

export const dangMoMicro = () => !!luong;
/** Luồng micro đang mở (MediaStream), hay null: công cụ thu âm (D7-L2) ghi luồng này bằng MediaRecorder. */
export const luongMicro = () => luong;

/** Nhận khung cao độ từ micro; trả về hàm thôi nhận (không còn ai nhận thì micro đóng). */
export function ngheMicro(fn) {
	nghe.push(fn);
	return () => {
		const i = nghe.indexOf(fn);
		if (i >= 0) nghe.splice(i, 1);
		if (!nghe.length) dongMicro();
	};
}

if (typeof addEventListener === 'function')
	addEventListener('pagehide', () => {
		dungTruoc?.();
		dongMicro();
	});
