// Nghe mù (D8-L1), chuyển từ phần .oz-blind (mountBlind) và .oz-blind-log (mountLog) của
// ../opus-zero/docs/assets/js/recognition.js:
// - ::cong-cu{ten="blind"} (lớp oz-nghe-mu): mười bản thu thật trên Wikimedia Commons (BAN_THU), lần lượt theo một thứ tự
//   trộn; người học chọn thời kỳ và biên chế rồi bấm "Xem đáp án": hiện tên tác phẩm, người biểu diễn, dấu hiệu và link tới
//   trang tệp (nguồn, giấy phép). Không tải, không phát gì cho tới khi người học bấm "Nghe bản thu": khi ấy mới gắn nguồn
//   vào thẻ <audio> (trình phát của trình duyệt) và phát. Gắn nguồn sẵn thì trình duyệt tải trước một phần bản thu, kể
//   cả với preload="none" (đo ở Chromium, WebKit, Firefox).
// - ::cong-cu{ten="blind-log"} (lớp oz-phieu-nghe-mu): phiếu nghe mù cho bản thu của riêng người học: ghi dự đoán (thời
//   kỳ, biên chế, tác giả) rồi tên và thời kỳ thật; bảng 15 lần gần nhất và tỉ lệ đoán đúng thời kỳ.
// Ô dựng sẵn lúc build (veNgheMu, vePhieuNgheMu: chữ thật, ô không đổi chiều cao khi script chạy); mount(el) thêm phần bấm
// được. Lưu như site cũ (src/scripts/tien-do.js, khóa opus-zero:v1): store.blind = { right, total } (lần xem đáp án đầu của
// mỗi bản), store.blindLog = [{ d, t, gp, ge, gc, ap }], kỹ năng style, số câu trong ngày days[ngày].styles (mỗi lần xem
// đáp án đầu và mỗi lần lưu phiếu, như record("styles", 1) cũ).
// Khác bản cũ: ô nhập của phiếu có nhãn thấy được (bản cũ chỉ có chữ gợi ý trong ô); bảng phiếu dựng bằng textContent;
// người biểu diễn của bản Mozart ghi theo trang tệp (bản cũ: "xem trang tệp").
import { datKho, ghiNgay, homNay, kyNang, layKho } from './tien-do.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Năm thời kỳ (PERIODS của recognition.js; cùng khóa với THOI_KY_ND của nhan-dien.js). */
export const THOI_KY_NM = { baroque: 'Baroque', classical: 'Cổ điển', romantic: 'Lãng mạn', impressionist: 'Ấn tượng', modern: 'Thế kỷ 20' };
/** Bốn loại biên chế (ENSEMBLES cũ). */
export const BIEN_CHE = {
	solo: 'Một nhạc cụ (có thể có đệm)',
	chamber: 'Nhóm thính phòng (mỗi bè một người)',
	orchestra: 'Dàn nhạc',
	concerto: 'Dàn nhạc và nghệ sĩ độc tấu',
};

/**
 * Mười bản thu (TRACKS cũ): tên tác phẩm, người biểu diễn, thời kỳ (thoi_ky) và các thời kỳ được tính đúng (dung), biên
 * chế, dấu hiệu, trang tệp trên Wikimedia Commons (nguồn và giấy phép), nguồn phát (mp3 chuyển mã của Commons trước, ogg
 * gốc sau). Workflow kiểm link hằng tuần (.github/workflows/kiem-link.yml) đọc cả file này.
 */
export const BAN_THU = [
	{
		id: "t1",
		ten: "J. S. Bach, Brandenburg Concerto số 6, BWV 1051, chương 2 (Adagio ma non tanto)",
		bieu_dien: "Advent Chamber Orchestra",
		thoi_ky: "baroque",
		dung: ["baroque"],
		bien_che: "chamber",
		dau_hieu: "Hai viola song tấu, cello và harpsichord đệm: kết cấu phức điệu, bè trầm đi đều không ngừng, tiếng harpsichord lách tách phía sau. Chương chậm này chỉ dùng nhóm nhỏ, dù cả tác phẩm là concerto.",
		trang: "https://commons.wikimedia.org/wiki/File:Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/37/Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg/Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bach_-_Brandenburg_Concerto_6_-_2._Adagio.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t2",
		ten: "J. S. Bach, Brandenburg Concerto số 4, BWV 1049, chương 1 (Allegro)",
		bieu_dien: "Kevin MacLeod (incompetech.com)",
		thoi_ky: "baroque",
		dung: ["baroque"],
		bien_che: "concerto",
		dau_hieu: "Một nhóm độc tấu (violin và hai sáo dọc) đối đáp với dàn dây: concerto grosso. Nhịp đều như máy, nhiều chuỗi, các đoạn tutti quay lại như ritornello.",
		trang: "https://commons.wikimedia.org/wiki/File:Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3b/Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga/Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Brandenburg_Concerto_No._4_in_G%2C_Movement_I_%28Allegro%29%2C_BWV_1049_%28ISRC_USUAN1100303%29.oga", type: "audio/ogg" },
		],
	},
	{
		id: "t3",
		ten: "Vivaldi, Concerto \"Mùa xuân\" cung Mi trưởng, Op. 8 số 1, RV 269, chương 1 (Allegro)",
		bieu_dien: "John Harrison (violin), Robert Turizziani chỉ huy, Wichita State University Chamber Players",
		thoi_ky: "baroque",
		dung: ["baroque"],
		bien_che: "concerto",
		dau_hieu: "Dàn dây mở đầu đồng loạt bằng chủ đề tươi sáng, rồi violin độc tấu đối đáp xen kẽ các đoạn tutti quay lại (ritornello); chuyển động liên tục, nhiều chuỗi: concerto Baroque.",
		trang: "https://commons.wikimedia.org/wiki/File:Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/ff/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga", type: "audio/ogg" },
		],
	},
	{
		id: "t4",
		ten: "J. S. Bach, Concerto violin cung Mi trưởng, BWV 1042, chương 2 (Adagio)",
		bieu_dien: "Advent Chamber Orchestra, Jacques Israelievitch (violin)",
		thoi_ky: "baroque",
		dung: ["baroque"],
		bien_che: "concerto",
		dau_hieu: "Violin độc tấu hát trên một bè trầm lặp lại trang nghiêm của dàn dây: dấu hiệu Baroque của bè trầm liên tục và bè trầm lặp.",
		trang: "https://commons.wikimedia.org/wiki/File:Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/4/44/Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg/Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bach_Emaj_Violin_Concerto_-_2._Adagio_sempre_Piano.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t5",
		ten: "Mozart, Eine kleine Nachtmusik, K. 525, chương 1",
		bieu_dien: "Advent Chamber Orchestra",
		thoi_ky: "classical",
		dung: ["classical"],
		bien_che: "orchestra",
		dau_hieu: "Mở đầu bằng hợp âm rải đi lên đồng loạt; câu nhạc ngắn, cân đối, hỏi – đáp; chủ điệu rõ ràng; tương phản to – nhỏ; hình thức sonata.",
		trang: "https://commons.wikimedia.org/wiki/File:Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/2/24/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t6",
		ten: "Mozart, Giao hưởng số 40, K. 550, chương 4",
		bieu_dien: "Fulda Symphonic Orchestra, Simon Schindler chỉ huy (thu năm 2001)",
		thoi_ky: "classical",
		dung: ["classical"],
		bien_che: "orchestra",
		dau_hieu: "Chủ đề hợp âm rải vọt lên (\"tên lửa\") rồi trả lời nhẹ nhàng: câu hỏi – câu trả lời kiểu Cổ điển; dàn nhạc Cổ điển cỡ nhỏ; tương phản mạnh nhẹ đột ngột; Sol thứ đầy kịch tính.",
		trang: "https://commons.wikimedia.org/wiki/File:Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/16/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t7",
		ten: "Mozart, Ngũ tấu đàn dây cung Sol thứ, K. 516, chương 4",
		bieu_dien: "Roxana Pavel Goldstein, Elizabeth Choi (violin), Elias Goldstein, Sally Chisholm (viola), Jocelyn Butler (cello)",
		thoi_ky: "classical",
		dung: ["classical"],
		bien_che: "chamber",
		dau_hieu: "Năm nhạc cụ dây, mỗi bè một người: nhạc thính phòng. Mở đầu Adagio u buồn ở Sol thứ, rồi chuyển sang Allegro Sol trưởng tươi sáng với giai điệu có đệm rõ ràng.",
		trang: "https://commons.wikimedia.org/wiki/File:Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/68/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t8",
		ten: "Beethoven, Bagatelle \"Für Elise\" cung La thứ, WoO 59",
		bieu_dien: "V. Gao (piano)",
		thoi_ky: "classical",
		dung: ["classical"],
		bien_che: "solo",
		dau_hieu: "Piano độc tấu; mở đầu bằng hình nốt láy móc đơn day dứt ở La thứ, xen kẽ các đoạn tươi sáng; cấu trúc rondo nhỏ, câu nhạc cân đối: Cổ điển.",
		trang: "https://commons.wikimedia.org/wiki/File:FurElise.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7b/FurElise.ogg/FurElise.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/FurElise.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t9",
		ten: "Chopin, Nocturne cung Si trưởng, Op. 9 số 3",
		bieu_dien: "Patrizia Prati (piano)",
		thoi_ky: "romantic",
		dung: ["romantic"],
		bien_che: "solo",
		dau_hieu: "Piano độc tấu; giai điệu dài như hát trên hợp âm rải rộng ở tay trái; rubato rõ; hòa âm nhiều nửa cung: Lãng mạn.",
		trang: "https://commons.wikimedia.org/wiki/File:Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fd/Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg/Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Fryderyk_Chopin_-_Nocturne_op._9_n.3_H-dur_-_Patrizia_Prati.ogg", type: "audio/ogg" },
		],
	},
	{
		id: "t10",
		ten: "Debussy, Arabesque số 2 (khoảng 1890)",
		bieu_dien: "Patrizia Prati (piano)",
		thoi_ky: "impressionist",
		dung: ["impressionist","romantic"],
		bien_che: "solo",
		dau_hieu: "Piano độc tấu, hình nốt lấp lánh, nhẹ như nước, hòa âm mềm và màu sắc. Đây là tác phẩm thời trẻ của Debussy, nằm giữa Lãng mạn muộn và Ấn tượng, nên cả hai câu trả lời đều được tính đúng.",
		trang: "https://commons.wikimedia.org/wiki/File:Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg",
		nguon: [
			{ src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg/Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg.mp3", type: "audio/mpeg" },
			{ src: "https://commons.wikimedia.org/wiki/Special:FilePath/Claude_Debussy_-_Deuxi%C3%A8me_Arabesque_-_Patrizia_Prati.ogg", type: "audio/ogg" },
		],
	},
];

/** Chữ của hai công cụ (như bản cũ). */
export const CHU_NM = {
	dau: 'Nghe ít nhất 60 giây, chọn thời kỳ và biên chế, rồi bấm “Xem đáp án”.',
	dem: (i, n) => `Bản thu ${i}/${n}. Tên tác phẩm được ẩn cho đến khi bạn trả lời.`,
	chuaChon: 'Hãy chọn cả thời kỳ và biên chế trước.',
	loi: 'Không phát được bản thu này. Bấm “Bản khác”.',
	ketQua: (tk, bc) => `${tk ? 'Thời kỳ: đúng. ' : 'Thời kỳ: chưa đúng. '}${bc ? 'Biên chế: đúng.' : 'Biên chế: chưa đúng.'}`,
	diem: (st) => `Tổng cộng (mọi lần): đoán đúng thời kỳ ${st.right}/${st.total}.`,
	chuaTen: 'Hãy ghi tên tác phẩm thật.',
	daLuu: 'Đã lưu.',
	tomTat: (so, dung) => `Đã ghi ${so} lần nghe mù; đoán đúng thời kỳ ${dung}/${so}.`,
};

const luaChon = (obj, rong) =>
	(rong ? '<option value="">– chọn –</option>' : '') + Object.entries(obj).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

/** Ô nghe mù dựng sẵn (lúc build). data-sinh: chữ do thành phần dựng (trang cũ dựng bằng JavaScript). */
export const veNgheMu = () =>
	`<div class="oz-nghe-mu oz-tool not-content" data-cong-cu="blind" data-sinh data-pagefind-ignore>` +
	`<p class="oz-stats oz-nm-dem">${esc(CHU_NM.dem(1, BAN_THU.length))}</p>` +
	`<div class="oz-nm-phat"><button type="button" class="oz-btn" data-act="play"><span aria-hidden="true">▶ </span>Nghe bản thu</button>` +
	`<audio controls preload="none" class="oz-nm-audio" hidden></audio></div>` +
	`<div class="oz-row"><label>Thời kỳ <select data-k="period">${luaChon(THOI_KY_NM, true)}</select></label>` +
	`<label>Biên chế <select data-k="ens">${luaChon(BIEN_CHE, true)}</select></label></div>` +
	`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-act="check">Xem đáp án</button>` +
	`<button type="button" class="oz-btn" data-act="next">Bản khác</button></div>` +
	`<p class="oz-feedback" aria-live="polite">${esc(CHU_NM.dau)}</p><div class="oz-nm-dap-an" hidden></div>` +
	`<p class="oz-stats oz-score"></p>` +
	`<noscript data-sinh><p>Nghe mù cần JavaScript: bật JavaScript trong trình duyệt để nghe và làm bài.</p></noscript></div>`;

/** Phiếu nghe mù dựng sẵn (lúc build). */
export const vePhieuNgheMu = () =>
	`<div class="oz-phieu-nghe-mu oz-tool not-content" data-cong-cu="blind-log" data-sinh data-pagefind-ignore>` +
	`<p class="oz-stats">Bước 1: trước khi biết tên tác phẩm, ghi dự đoán.</p>` +
	`<div class="oz-row"><label>Thời kỳ <select data-k="g-p">${luaChon(THOI_KY_NM)}</select></label>` +
	`<label>Biên chế <select data-k="g-e">${luaChon(BIEN_CHE)}</select></label>` +
	`<label class="oz-nm-o">Đoán tác giả (nếu muốn) <input class="oz-input" data-k="g-c" maxlength="60" autocomplete="off"></label></div>` +
	`<p class="oz-stats">Bước 2: sau khi biết đáp án, ghi tên thật và thời kỳ thật.</p>` +
	`<div class="oz-row"><label class="oz-nm-o">Tên tác phẩm thật <input class="oz-input" data-k="a-t" maxlength="120" autocomplete="off"></label>` +
	`<label>Thời kỳ thật <select data-k="a-p">${luaChon(THOI_KY_NM)}</select></label>` +
	`<button type="button" class="oz-btn oz-btn--primary" data-act="save">Lưu</button></div>` +
	`<p class="oz-feedback" aria-live="polite"></p><div class="oz-nm-bang"></div>` +
	`<noscript data-sinh><p>Phiếu nghe mù cần JavaScript: bật JavaScript trong trình duyệt để ghi và lưu.</p></noscript></div>`;

/** Chấm một lần trả lời: thời kỳ đúng khi nằm trong `dung` của bản thu (Debussy: cả Ấn tượng lẫn Lãng mạn). */
export const chamNgheMu = (ban, thoiKy, bienChe) => ({ thoiKy: ban.dung.includes(thoiKy), bienChe: bienChe === ban.bien_che });

/** Cộng một lần trả lời vào thống kê { right, total } (store.blind cũ); trả về bản mới. */
export const congDiem = (st, dung) => ({ right: (st?.right || 0) + (dung ? 1 : 0), total: (st?.total || 0) + 1 });

/** Một dòng phiếu từ các ô (cắt độ dài như bản cũ: tên 120, tác giả 60 ký tự). Thiếu tên thật thì trả về null. */
export function dongPhieu({ t, gp, ge, gc, ap }, ngay) {
	const ten = String(t ?? '').trim().slice(0, 120);
	if (!ten) return null;
	return { d: ngay, t: ten, gp, ge, gc: String(gc ?? '').trim().slice(0, 60), ap };
}

/** Tóm tắt phiếu: số lần, số lần đoán đúng thời kỳ, 15 dòng gần nhất (mới trước). */
export function tomTatPhieu(log) {
	const ds = Array.isArray(log) ? log.filter((r) => r && typeof r === 'object') : [];
	return { so: ds.length, dung: ds.filter((r) => r.gp === r.ap).length, gan: ds.slice(-15).reverse() };
}

/** Thứ tự các bản: lần lượt theo một thứ tự trộn (Fisher–Yates); hết một vòng thì trộn lại. */
export function boThuTuBan(n, r = Math.random) {
	const thuTu = [...Array(n).keys()];
	const tron = () => {
		for (let i = thuTu.length - 1; i > 0; i--) {
			const j = Math.floor(r() * (i + 1));
			[thuTu[i], thuTu[j]] = [thuTu[j], thuTu[i]];
		}
	};
	tron();
	let i = -1;
	return () => {
		i++;
		if (i === n) {
			i = 0;
			tron();
		}
		return { so: i + 1, chiSo: thuTu[i] };
	};
}

function ganNgheMu(goc) {
	const q = (s) => goc.querySelector(s);
	const audio = q('audio');
	const nutPhat = q('[data-act="play"]');
	const phanHoi = q('.oz-feedback');
	const dapAn = q('.oz-nm-dap-an');
	const diem = q('.oz-score');
	const chon = (k) => q(`[data-k="${k}"]`);
	const tiep = boThuTuBan(BAN_THU.length);
	let ban = null;
	let daXem = false;
	const bao = (chu, lop = '') => {
		phanHoi.textContent = chu;
		phanHoi.className = `oz-feedback${lop ? ' ' + lop : ''}`;
	};
	function banKhac() {
		const { so, chiSo } = tiep();
		ban = BAN_THU[chiSo];
		daXem = false;
		// bỏ nguồn của bản trước, ẩn trình phát: bản mới chỉ tải khi người học bấm "Nghe bản thu"
		audio.pause();
		audio.textContent = '';
		audio.load();
		audio.hidden = true;
		nutPhat.hidden = false;
		chon('period').value = '';
		chon('ens').value = '';
		dapAn.hidden = true;
		dapAn.textContent = '';
		bao(CHU_NM.dau);
		q('.oz-nm-dem').textContent = CHU_NM.dem(so, BAN_THU.length);
	}
	function phat() {
		if (!audio.querySelector('source')) {
			for (const n of ban.nguon) {
				const s = document.createElement('source');
				s.src = n.src;
				s.type = n.type;
				audio.append(s);
			}
			audio.load();
		}
		nutPhat.hidden = true;
		audio.hidden = false;
		audio.focus();
		audio.play().catch(() => {
			// bị chặn hay lỗi tải: trình phát vẫn hiện, lỗi tải báo ở sự kiện error
		});
	}
	function xem() {
		const tk = chon('period').value;
		const bc = chon('ens').value;
		if (!tk || !bc) return bao(CHU_NM.chuaChon, 'bad');
		const kq = chamNgheMu(ban, tk, bc);
		if (!daXem) {
			datKho('blind', congDiem(layKho('blind', null), kq.thoiKy));
			ghiNgay('styles', 1);
			kyNang('style', kq.thoiKy);
		}
		daXem = true;
		bao(CHU_NM.ketQua(kq.thoiKy, kq.bienChe), kq.thoiKy && kq.bienChe ? 'ok' : 'bad');
		dapAn.innerHTML =
			`<p><strong>${esc(ban.ten)}</strong><br>Thời kỳ: ${esc(THOI_KY_NM[ban.thoi_ky])}. Biên chế: ${esc(BIEN_CHE[ban.bien_che])}.</p>` +
			`<p>${esc(ban.dau_hieu)}</p>` +
			`<p class="oz-stats">Biểu diễn: ${esc(ban.bieu_dien)}. Nguồn và giấy phép: <a href="${esc(ban.trang)}" target="_blank" rel="noopener">trang tệp trên Wikimedia Commons</a>.</p>`;
		dapAn.hidden = false;
		diem.textContent = CHU_NM.diem(layKho('blind', { right: 0, total: 0 }));
	}
	goc.addEventListener('click', (e) => {
		const b = e.target.closest?.('button[data-act]');
		if (b?.dataset.act === 'play') phat();
		if (b?.dataset.act === 'next') banKhac();
		if (b?.dataset.act === 'check') xem();
	});
	// lỗi của thẻ <source> không nổi bọt: nghe ở pha bắt
	audio.addEventListener('error', () => bao(CHU_NM.loi, 'bad'), true);
	banKhac();
}

function ganPhieu(goc) {
	const q = (s) => goc.querySelector(s);
	const phanHoi = q('.oz-feedback');
	const bang = q('.oz-nm-bang');
	const o = (k) => q(`[data-k="${k}"]`);
	const tenTk = (k) => THOI_KY_NM[k] ?? String(k ?? '');
	function ve() {
		const { so, dung, gan } = tomTatPhieu(layKho('blindLog', []));
		bang.textContent = '';
		if (!so) return;
		const p = document.createElement('p');
		p.className = 'oz-stats';
		p.textContent = CHU_NM.tomTat(so, dung);
		const khung = document.createElement('div');
		khung.className = 'oz-nm-cuon';
		const t = document.createElement('table');
		const dong = (the, o4) => {
			const tr = document.createElement('tr');
			for (const x of o4) {
				const c = document.createElement(the);
				c.textContent = x;
				tr.append(c);
			}
			return tr;
		};
		const dau = document.createElement('thead');
		dau.append(dong('th', ['Ngày', 'Tác phẩm', 'Đoán', 'Thật']));
		const than = document.createElement('tbody');
		for (const r of gan) than.append(dong('td', [r.d, r.t, tenTk(r.gp) + (r.gc ? ` (${r.gc})` : ''), tenTk(r.ap) + (r.gp === r.ap ? ' ✓' : '')]));
		t.append(dau, than);
		khung.append(t);
		bang.append(p, khung);
	}
	q('[data-act="save"]').addEventListener('click', () => {
		const muc = dongPhieu({ t: o('a-t').value, gp: o('g-p').value, ge: o('g-e').value, gc: o('g-c').value, ap: o('a-p').value }, homNay());
		if (!muc) {
			phanHoi.textContent = CHU_NM.chuaTen;
			phanHoi.className = 'oz-feedback bad';
			o('a-t').focus();
			return;
		}
		const log = layKho('blindLog', []);
		datKho('blindLog', [...(Array.isArray(log) ? log : []), muc]);
		ghiNgay('styles', 1);
		phanHoi.textContent = CHU_NM.daLuu;
		phanHoi.className = 'oz-feedback ok';
		o('a-t').value = '';
		o('g-c').value = '';
		ve();
	});
	// dữ liệu đổi ở thẻ khác hay khi nhập bản sao lưu: vẽ lại
	document.addEventListener('oz:progress', ve);
	addEventListener('pageshow', (e) => e.persisted && ve());
	ve();
}

export function mount(goc) {
	if (goc.dataset.san) return;
	if (goc.classList.contains('oz-nghe-mu')) ganNgheMu(goc);
	else ganPhieu(goc);
	goc.dataset.san = '1';
}
