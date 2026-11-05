// Đàn phím MIDI (::cong-cu{ten="midi-status"}, D7-L1), chuyển từ ../opus-zero/docs/assets/js/midi.js: Web MIDI API (Chrome,
// Edge, Firefox từ bản 108, Opera trên máy tính; Safari và trình duyệt trên iPhone, iPad không có). Module chung: mọi công cụ nhận nốt từ đàn
// qua nghe(f); ô trạng thái (oz-midi) có nút kết nối, dòng trạng thái và lựa chọn phát tiếng khi bấm phím. Đã cho phép
// một lần thì lần sau ô trạng thái tự kết nối lại (opus-zero:midi-auto, như bản cũ; bản sao lưu ở trang Dữ liệu giữ khóa
// này). Như bản cũ, chỉ ô trạng thái mở kết nối: trang không có ô ấy thì đàn không gửi nốt tới bàn phím trong bài.
// Sự kiện: { loai: 'on' | 'off', m (số MIDI), luc (giây, theo đồng hồ của AudioContext nếu đã có, để chấm nhịp cùng đồng
// hồ với tiếng phát), luc_do (tiếng mạnh 0–127) }.
// veTrangThaiMidi dựng sẵn ô lúc build (src/plugins/thanh-phan.mjs); trình duyệt không có Web MIDI thì mount báo ngay.
import { choiNot, layNgCanh } from './am-thanh.js';

export const KHOA_TU_DONG = 'opus-zero:midi-auto';

const ngheNot = [];
const ngheTrangThai = [];
let truyCap = null;
let dangNoi = null;
/** Phát tiếng của site khi bấm phím đàn (tắt khi đàn đã có loa riêng); mọi ô trạng thái trên trang dùng chung. */
let phatTieng = true;

export const coMidi = () => typeof navigator !== 'undefined' && !!navigator.requestMIDIAccess;

const dauVao = () => (truyCap ? [...truyCap.inputs.values()] : []);

/** Trạng thái để hiện: { trang_thai: 'khong-ho-tro' | 'chua-noi' | 'khong-thay-dan' | 'da-noi', chu }. */
export function trangThai() {
	if (!coMidi()) return { trang_thai: 'khong-ho-tro', chu: 'Trình duyệt này không có MIDI trên web. Safari và mọi trình duyệt trên iPhone, iPad đều chưa có; trên máy tính, hãy thử Chrome, Edge hay Firefox.' };
	if (!truyCap) return { trang_thai: 'chua-noi', chu: 'Chưa kết nối đàn MIDI.' };
	const ds = dauVao();
	return ds.length
		? { trang_thai: 'da-noi', chu: `Đã kết nối: ${ds.map((i) => i.name).join(', ')}.` }
		: { trang_thai: 'khong-thay-dan', chu: 'Đã cho phép MIDI nhưng chưa thấy đàn nào. Cắm đàn qua USB rồi bật lại.' };
}

/** Thông điệp MIDI (3 byte) thành sự kiện nốt; thông điệp khác (pedal, đổi tiếng…) thì null. Hàm thuần, để kiểm thử. */
export function docThongDiep([lenh, not, luc]) {
	const loai = lenh & 0xf0;
	if (loai === 0x90 && luc > 0) return { loai: 'on', m: not, luc_do: luc };
	if (loai === 0x80 || (loai === 0x90 && luc === 0)) return { loai: 'off', m: not, luc_do: 0 };
	return null;
}

function nhan(tin) {
	const su = docThongDiep(tin.data);
	if (!su) return;
	const c = layNgCanh();
	su.luc = c ? c.currentTime : performance.now() / 1000;
	if (su.loai === 'on' && phatTieng) choiNot(su.m, undefined, 0.9, 0.12 + (su.luc_do / 127) * 0.18);
	for (const f of ngheNot.slice()) {
		try {
			f(su);
		} catch {
			// lỗi của một công cụ không chặn các công cụ khác
		}
	}
}

function gan() {
	for (const i of dauVao()) i.onmidimessage = nhan;
	const s = trangThai();
	for (const f of ngheTrangThai) f(s);
}

/** Xin quyền và kết nối (một lần cho cả trang). Trả về promise; bị từ chối hay không có Web MIDI thì lỗi. */
export function ketNoi() {
	if (!coMidi()) return Promise.reject(new Error('khong-ho-tro'));
	if (truyCap) return (gan(), Promise.resolve(truyCap));
	dangNoi ??= navigator.requestMIDIAccess().then(
		(a) => {
			truyCap = a;
			a.onstatechange = gan;
			gan();
			try {
				localStorage.setItem(KHOA_TU_DONG, '1');
			} catch {
				// trình duyệt chặn lưu: lần sau bấm kết nối lại
			}
			return a;
		},
		(e) => {
			dangNoi = null;
			throw e;
		},
	);
	return dangNoi;
}

/** Nhận sự kiện nốt từ đàn; trả về hàm thôi nhận. */
export function nghe(f) {
	ngheNot.push(f);
	return () => {
		const i = ngheNot.indexOf(f);
		if (i >= 0) ngheNot.splice(i, 1);
	};
}
export const khiDoiTrangThai = (f) => ngheTrangThai.push(f);
export const daKetNoi = () => trangThai().trang_thai === 'da-noi';

/** Ô trạng thái dựng sẵn (innerHTML của bản cũ). data-sinh: chữ do thành phần dựng. */
export const veTrangThaiMidi = () =>
	`<div class="oz-midi oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="noi">Kết nối đàn MIDI</button>` +
	`<label><input type="checkbox" data-k="tieng" checked> Phát âm thanh khi bấm phím</label></div>` +
	`<p class="oz-stats oz-midi-chu" aria-live="polite">Chưa kết nối đàn MIDI.</p>` +
	`<noscript data-sinh><p>Kết nối đàn MIDI cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chu = goc.querySelector('.oz-midi-chu');
	const nut = goc.querySelector('[data-act="noi"]');
	const hien = (s) => {
		chu.textContent = s.chu;
		goc.dataset.trangThai = s.trang_thai;
	};
	khiDoiTrangThai(hien);
	hien(trangThai());
	// không có Web MIDI: nút không làm được gì, khóa đi (dòng trạng thái đã nói lý do)
	if (!coMidi()) nut.disabled = true;
	const tieng = goc.querySelector('[data-k="tieng"]');
	tieng.checked = phatTieng;
	tieng.addEventListener('change', () => {
		phatTieng = tieng.checked;
		for (const o of document.querySelectorAll('.oz-midi [data-k="tieng"]')) o.checked = phatTieng;
	});
	nut.addEventListener('click', () => {
		ketNoi().catch(() => hien({ trang_thai: 'chua-noi', chu: 'Chưa được cho phép dùng MIDI. Cho phép trong cài đặt trang của trình duyệt rồi bấm lại.' }));
	});
	// đã từng cho phép: tự kết nối lại khi mở trang (trình duyệt nhớ quyền, không hỏi lại)
	try {
		if (localStorage.getItem(KHOA_TU_DONG) === '1' && coMidi()) ketNoi().catch(() => {});
	} catch {
		// trình duyệt chặn đọc: chờ người học bấm
	}
	goc.dataset.san = '1';
}
