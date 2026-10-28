// Kế hoạch tập hôm nay (::cong-cu{ten="plan"} ở mục lục Piano), chuyển từ phần .oz-plan của
// ../opus-zero/docs/assets/js/plan.js: buổi tập gợi ý (bên đàn, đọc nhạc, nhạc lý, nghe), chọn theo dữ liệu người học đã
// lưu ở opus-zero:v1 (src/scripts/tien-do.js; site mới và site cũ cùng khóa): chặng piano (store.pianoLevel), bài đang tập
// (store.repertoire), độ chính xác từng kỹ năng (store.skills), bài nhạc lý đã xong (store.lessons), thẻ ghi nhớ đến hạn
// (store.cards). Chỉ đọc, không ghi gì. Phần .oz-skills (bảng năng lực) cùng file cũ chưa trang nào của site mới dùng.
// tinhKeHoach là compute() cũ, giữ nguyên tên trường của kết quả (kind, name, url, mins, reason) để so được với bản cũ
// (tests/piano-d4.test.mjs). dungKeHoach dựng HTML như mountPlan cũ; khác bản cũ: chữ lấy từ dữ liệu đã lưu (tên bài đang
// tập) được thoát, địa chỉ lạ thì không thành link, trang chưa có trong bản build hiện "sắp có" (src/scripts/lien-ket.js).
// Ô dựng sẵn lúc build với kế hoạch của người chưa lưu gì (src/plugins/thanh-phan.mjs), nên người mới không thấy ô đổi.
import { esc, lienKet } from './lien-ket.js';
import { homNay, layKho } from './tien-do.js';

/** Kỹ năng: id, tên, đường dẫn, bài nhạc lý cần xong để mở (hay null), số phút gợi ý (SKILLS cũ). */
export const KY_NANG = [
	['notes', 'Đọc nốt', 'luyen-tap/doc-not/', null, 5],
	['rhythm', 'Tiết tấu', 'luyen-tap/tiet-tau/', null, 5],
	['intervals', 'Nhận biết quãng', 'luyen-tai/nghe-quang/#luyen-voi-cong-cu', null, 5],
	['keysig', 'Hóa biểu', 'luyen-tap/hoa-bieu/', '08-hoa-bieu', 4],
	['scales', 'Nhận biết gam', 'luyen-tai/nghe-gam/#luyen-voi-cong-cu', '07-gam-thu', 4],
	['chords', 'Nhận biết hợp âm', 'luyen-tai/nghe-hop-am/#luyen-voi-cong-cu', '10-hop-am-ba', 5],
	['sight', 'Thị tấu một bè', 'luyen-tap/thi-tau/', '06-gam-truong', 5],
	['sight2', 'Thị tấu hai tay', 'luyen-tap/thi-tau-hai-tay/', '02-khuong-nhac-khoa', 5],
	['dictation', 'Chép giai điệu', 'luyen-tap/chep-giai-dieu/', '09-quang', 5],
	['sing', 'Hát lại', 'luyen-tap/hat-lai/', '09-quang', 4],
	['cadence', 'Nhận biết kết', 'luyen-tai/nghe-tien-trinh/#luyen-voi-cong-cu', '13-ket', 4],
	['texture', 'Nhận biết kết cấu', 'nhan-dien/luyen-nghe/', '28-ket-cau', 4],
	['style', 'Đoán phong cách', 'nhan-dien/luyen-nghe/', '28-ket-cau', 5],
	['play', 'Chơi theo', 'luyen-tap/choi-theo/', null, 6],
];
/** Bài nhạc lý theo thứ tự gợi ý (LESSONS cũ: 28–31 trước 21) và tên (LESSON_NAMES). */
export const BAI_NHAC_LY = [
	['01-cao-do-ten-not', 'Cao độ và tên nốt'],
	['02-khuong-nhac-khoa', 'Khuông nhạc và khóa'],
	['03-truong-do', 'Trường độ và dấu lặng'],
	['04-nhip', 'Nhịp và số chỉ nhịp'],
	['05-dau-hoa', 'Cung, nửa cung và dấu hóa'],
	['06-gam-truong', 'Gam trưởng'],
	['07-gam-thu', 'Gam thứ'],
	['08-hoa-bieu', 'Hóa biểu và vòng quãng năm'],
	['09-quang', 'Quãng'],
	['10-hop-am-ba', 'Hợp âm ba'],
	['11-hop-am-bay', 'Hợp âm bảy và thể đảo'],
	['12-hoa-am-chuc-nang', 'Hòa âm chức năng'],
	['13-ket', 'Kết và câu nhạc'],
	['14-ky-hieu-bieu-dien', 'Ký hiệu biểu diễn'],
	['15-tiet-tau-nang-cao', 'Tiết tấu nâng cao'],
	['16-dieu-thuc-ngu-cung', 'Điệu thức và ngũ cung'],
	['17-khoa-do-dich-giong', 'Khóa Đô và dịch giọng'],
	['18-am-ngoai-hop-am', 'Âm ngoài hợp âm'],
	['19-at-phu-chuyen-giong', 'Át phụ và chuyển giọng'],
	['20-doc-tong-pho', 'Đọc tổng phổ'],
	['28-ket-cau', 'Kết cấu âm nhạc'],
	['29-chuoi-hoa-am', 'Chuỗi hòa âm'],
	['30-phat-trien-motip', 'Phát triển môtip'],
	['31-hinh-thuc-nho', 'Hình thức nhỏ'],
	['21-hoa-am-bon-be', 'Hòa âm bốn bè'],
	['22-doi-am', 'Đối âm'],
	['23-hop-am-muon', 'Hợp âm mượn'],
	['24-napoli-sau-tang', 'Napoli và sáu tăng'],
	['25-be-tram-so', 'Bè trầm số'],
	['26-phan-tich', 'Phân tích một tác phẩm'],
	['27-ky-hieu-hop-am', 'Ký hiệu hợp âm pop và jazz'],
	['32-ky-thuat-the-ky-20', 'Kỹ thuật thế kỷ 20'],
];
/** Gam khởi động của tuần theo chặng (KEYS_ALL, KEYS_BY_STAGE), thế tay năm ngón ở chặng 1 (FIVE). */
export const GAM_MOI_TUAN = [
	'Đô trưởng và La thứ',
	'Sol trưởng và Mi thứ',
	'Rê trưởng và Si thứ',
	'La trưởng và Fa♯ thứ',
	'Mi trưởng và Đô♯ thứ',
	'Si trưởng và Sol♯ thứ',
	'Fa♯ trưởng và Rê♯ thứ',
	'Rê♭ trưởng và Si♭ thứ',
	'La♭ trưởng và Fa thứ',
	'Mi♭ trưởng và Đô thứ',
	'Si♭ trưởng và Sol thứ',
	'Fa trưởng và Rê thứ',
];
export const GAM_THEO_CHANG = {
	2: ['Đô trưởng và La thứ', 'Sol trưởng và Mi thứ', 'Fa trưởng và Rê thứ', 'Rê trưởng và Si thứ'],
	3: [
		'Đô trưởng và La thứ',
		'Sol trưởng và Mi thứ',
		'Fa trưởng và Rê thứ',
		'Rê trưởng và Si thứ',
		'La trưởng và Fa♯ thứ',
		'Si♭ trưởng và Sol thứ',
		'Mi♭ trưởng và Đô thứ',
		'Mi trưởng và Đô♯ thứ',
	],
};
export const NAM_NGON = ['Đô', 'Sol', 'Fa', 'Rê', 'La'];

/** Mọi trang (đường dẫn trong site, bỏ #mục) mà kế hoạch có thể dẫn tới, trừ bài đang tập: build kiểm có trong kế hoạch site. */
export const TRANG_KE_HOACH = [
	...new Set([
		...KY_NANG.map((k) => k[2].split('#')[0]),
		...BAI_NHAC_LY.map(([b]) => `nhac-ly/${b}/`),
		'piano/nam-ngon/',
		'piano/gam/',
		'piano/hai-tuan-dau/',
		'piano/tac-pham-theo-cap/',
		'nhac-ly/tu-dien/',
		'nghe-nhac/',
	]),
];

const ngayUTC = (iso) => {
	const [y, m, d] = iso.split('-').map(Number);
	return Date.UTC(y, m - 1, d);
};
/** Số ngày từ ngày iso đến hôm nay (daysSince); chưa có ngày thì 99. */
export const soNgayTu = (iso, homNay) => (iso ? Math.round((ngayUTC(homNay) - ngayUTC(iso)) / 86400000) : 99);
/** Số thứ tự của tuần (tuần bắt đầu từ thứ Hai), weekIndex cũ. */
const tuanThu = (homNay) => Math.floor((ngayUTC(homNay) / 86400000 + 3) / 7);

/** Phần khởi động (warmup cũ). */
export function khoiDong(chang, homNay) {
	const w = tuanThu(homNay);
	if (chang <= 1)
		return { kind: 'piano', name: 'Khởi động: thế tay năm ngón ở ' + NAM_NGON[w % NAM_NGON.length] + ' trưởng, từng tay rồi hai tay', url: 'piano/nam-ngon/', mins: 5, reason: 'khởi động tuần này' };
	const ds = GAM_THEO_CHANG[chang] || GAM_MOI_TUAN;
	return { kind: 'piano', name: 'Khởi động: gam ' + ds[w % ds.length] + (chang >= 4 ? ', hai tay, hai quãng tám' : ', từng tay rồi hai tay'), url: 'piano/gam/', mins: 5, reason: 'gam của tuần' };
}

/** Phần bên đàn (pianoItems cũ): khởi động, rồi tối đa hai bài đang tập lâu chưa tập nhất. */
function benDan(piano, homNay) {
	const rep = piano.rep || {};
	const dangTap = Object.keys(rep)
		.filter((k) => rep[k] && rep[k].status === 'learning')
		.map((k) => ({ url: k, name: rep[k].name || k, last: rep[k].last || '' }))
		.sort((a, b) => (a.last < b.last ? -1 : a.last > b.last ? 1 : 0));
	const chang = piano.stage || (dangTap.length ? 2 : 0);
	if (!chang) return [{ kind: 'piano', name: 'Bên đàn: Hai tuần đầu tiên', url: 'piano/hai-tuan-dau/', mins: 15, reason: 'bắt đầu từ đây nếu bạn mới học' }];
	const ra = [khoiDong(chang, homNay)];
	dangTap.slice(0, 2).forEach((r) => {
		const d = soNgayTu(r.last, homNay);
		ra.push({ kind: 'piece', name: 'Tập bài: ' + r.name, url: r.url, mins: dangTap.length > 1 ? 10 : 15, reason: !r.last ? 'mới thêm' : d === 0 ? 'đã tập hôm nay' : d + ' ngày chưa tập' });
	});
	if (!dangTap.length) ra.push({ kind: 'piece', name: 'Chọn một bài cho chặng ' + chang, url: 'piano/tac-pham-theo-cap/', mins: 5, reason: 'chưa có bài đang tập' });
	return ra;
}

/**
 * Kế hoạch hôm nay (compute cũ, hàm thuần): state = { today, skills, lessons (tên bài nhạc lý đã xong -> ngày), cardsDue,
 * piano: { stage, rep } }. Trả về { plan, rows, total } như bản cũ.
 */
export function tinhKeHoach(state) {
	const today = state.today;
	const skills = state.skills || {};
	const done = state.lessons || {};
	const rows = KY_NANG.map((s) => {
		const st = skills[s[0]] || { n: 0, c: 0, ema: 0.5, last: '' };
		const unlocked = st.n > 0 || !s[3] || !!done[s[3]];
		const days = soNgayTu(st.last, today);
		const weak = st.n < 5 ? 0.4 : 1 - st.ema;
		const stale = st.n === 0 ? 0.5 : Math.min(days, 7) / 7;
		let score = weak * 0.7 + stale * 0.3;
		if (st.n >= 5 && st.ema < 0.7) score += 0.2; // ưu tiên sửa điểm yếu đã biết
		if (s[0] === 'play' && st.n === 0) score -= 0.4; // cần micro hay đàn: chỉ gợi ý khi đã từng dùng
		const reason =
			st.n === 0 ? 'chưa luyện lần nào' : st.n >= 5 && st.ema < 0.7 ? 'độ chính xác gần đây ' + Math.round(st.ema * 100) + '%' : days >= 3 ? days + ' ngày chưa luyện' : 'duy trì';
		return { id: s[0], name: s[1], url: s[2], mins: s[4], unlocked, n: st.n, ema: st.ema, days, score, reason };
	});
	const pick = [];
	let fresh = 0;
	rows
		.filter((r) => r.unlocked)
		.sort((a, b) => b.score - a.score)
		.forEach((r) => {
			if (pick.length >= 3) return;
			if (r.n === 0) {
				if (fresh >= 1 && rows.some((x) => x.unlocked && x.n > 0 && pick.indexOf(x) < 0)) return;
				fresh++;
			}
			pick.push(r);
		});
	const plan = benDan(state.piano || {}, today);
	const next = BAI_NHAC_LY.find(([k]) => !done[k]);
	if (next) plan.push({ kind: 'lesson', name: 'Bài học: ' + next[1], url: 'nhac-ly/' + next[0] + '/', mins: 8, reason: 'bài tiếp theo chưa xong' });
	if (state.cardsDue > 0) plan.push({ kind: 'cards', name: 'Ôn ' + state.cardsDue + ' thẻ thuật ngữ', url: 'nhac-ly/tu-dien/', mins: 3, reason: 'thẻ đến hạn hôm nay' });
	pick.slice(0, 2).forEach((r) => plan.push({ kind: 'skill', name: r.name, url: r.url, mins: r.mins, reason: r.reason }));
	plan.push({ kind: 'listen', name: 'Nghe chủ động một tác phẩm', url: 'nghe-nhac/', mins: 6, reason: 'mỗi ngày một chút' });
	return { plan, rows, total: plan.reduce((s, p) => s + p.mins, 0) };
}

/** Bài nhạc lý đã xong (lessonsDone cũ): khóa của store.lessons (/opus/nhac-ly/x/ hay /opus-zero/nhac-ly/x/) -> x. */
export function baiDaXong(lessons) {
	const xong = {};
	if (lessons && typeof lessons === 'object')
		for (const k of Object.keys(lessons)) {
			const m = /nhac-ly\/([^/]+)\/?$/.exec(k);
			if (m) xong[m[1]] = lessons[k];
		}
	return xong;
}

/** Dữ liệu cho tinhKeHoach từ kho đã lưu (current() cũ); `kho(tên, mặc định)` đọc store. */
export function trangThaiTu(kho, today) {
	const cards = kho('cards', {}) || {};
	const lv = kho('pianoLevel', null);
	return {
		today,
		skills: kho('skills', {}) || {},
		lessons: baiDaXong(kho('lessons', {})),
		cardsDue: Object.keys(cards).filter((k) => cards[k] && cards[k].due <= today).length,
		piano: { stage: (lv && lv.stage) || 0, rep: kho('repertoire', {}) || {} },
	};
}

/** Địa chỉ trong site lưu ở dữ liệu (khóa bài đang tập): chỉ dạng "a/b/" (chữ thường, số, gạch ngang). */
export const laDuongDan = (u) => typeof u === 'string' && /^[a-z0-9-]+(\/[a-z0-9-]+)*\/(#[a-z0-9-]+)?$/.test(u);

/**
 * Link tới trang trong site: `data.goc` (/opus/), `data.trang` (các trang có trong bản build, dạng "a/b/"). Trang chưa có
 * hiện "sắp có"; địa chỉ lạ (dữ liệu hỏng) thì chỉ là chữ.
 */
export function lienKetTrang(url, chu, data) {
	if (!laDuongDan(url)) return chu;
	return lienKet(data.goc + url, chu, data.trang.includes(url.split('#')[0]));
}

/** HTML của kế hoạch (mountPlan cũ). */
export function dungKeHoach(kq, data) {
	return (
		`<p class="oz-stats">Buổi tập hôm nay (khoảng ${kq.total} phút), bắt đầu bên đàn, rồi đến đọc nhạc, nhạc lý và nghe; site tự chọn dựa trên việc bạn đã tập:</p>` +
		`<ol class="oz-plan-list">` +
		kq.plan.map((p) => `<li>${lienKetTrang(p.url, esc(p.name), data)} <span class="oz-stats">· ${p.mins} phút · ${esc(p.reason)}</span></li>`).join('') +
		`</ol>`
	);
}

export function mount(goc) {
	if (goc.dataset.san) return;
	const data = JSON.parse(goc.dataset.keHoach);
	const ve = () => (goc.innerHTML = dungKeHoach(tinhKeHoach(trangThaiTu(layKho, homNay())), data));
	ve();
	document.addEventListener('oz:progress', ve);
	// quay lại trang bằng nút Back (bfcache) sau khi luyện ở trang khác: đọc lại
	addEventListener('pageshow', (e) => e.persisted && ve());
	goc.dataset.san = '1';
}
