// Hình vẽ bằng SVG dùng chung lúc build (src/plugins/thanh-phan.mjs) và trong trình duyệt: bàn phím piano, hóa biểu trên
// khuông, vòng quãng năm. Module thuần, trả về chuỗi HTML; chữ trong hình là chữ thật, màu theo CSS của site
// (src/styles/thanh-phan.css, có bản sáng và tối).
// Hình khóa Sol, khóa Fa, khóa Đô, dấu thăng, dấu giáng, đầu nốt tròn lấy từ abcjs 6.7.1 (giấy phép MIT, Paul Rosen và Gregory Dyke; xem
// public/vendor/abcjs-LICENSE.txt), cùng đơn vị với abcjs: một khe của khuông cao 7,75.
import {
	CHU,
	HOP_AM,
	SOLFEGE,
	chuHoaBieu,
	dauCuaHoaBieu,
	gam,
	giongTheoChuAm,
	laPhimDen,
	tenChu,
	tenChuCua,
	tenPhim,
	tenViet,
	tenVietCua,
} from './nhac-ly.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const so = (x) => String(Math.round(x * 100) / 100);

// ---------- Hóa biểu ----------

/**
 * Đường viền các ký hiệu (gốc tọa độ: khóa Sol ở dòng 2, khóa Fa ở dòng 4, khóa Đô ở giữa hình, đúng dòng của Đô giữa;
 * dấu hóa và đầu nốt ở đúng cao độ của nó).
 */
export const KY_HIEU = {
	'khoa-sol': 'M9.69-37.41c.09-.09 .24-.06 .36 0c.12 .09 .57 .6 .96 1.11c1.77 2.34 3.21 5.85 3.57 8.73c.21 1.56 .03 3.27-.45 4.86c-.69 2.31-1.92 4.47-4.23 7.44c-.3 .39-.57 .72-.6 .75c-.03 .06 0 .15 .18 .78c.54 1.68 1.38 4.44 1.68 5.49l.09 .42l.39 0c1.47 .09 2.76 .51 3.96 1.29c1.83 1.23 3.06 3.21 3.39 5.52c.09 .45 .12 1.29 .06 1.74c-.09 1.02-.33 1.83-.75 2.73c-.84 1.71-2.28 3.06-4.02 3.72l-.33 .12l.03 1.26c0 1.74-.06 3.63-.21 4.62c-.45 3.06-2.19 5.49-4.47 6.21c-.57 .18-.9 .21-1.59 .21c-.69 0-1.02-.03-1.65-.21c-1.14-.27-2.13-.84-2.94-1.65c-.99-.99-1.56-2.16-1.71-3.54c-.09-.81 .06-1.53 .45-2.13c.63-.99 1.83-1.56 3-1.53c1.5 .09 2.64 1.32 2.73 2.94c.06 1.47-.93 2.7-2.37 2.97c-.45 .06-.84 .03-1.29-.09l-.21-.09l.09 .12c.39 .54 .78 .93 1.32 1.26c1.35 .87 3.06 1.02 4.35 .36c1.44-.72 2.52-2.28 2.97-4.35c.15-.66 .24-1.5 .3-3.03c.03-.84 .03-2.94 0-3c-.03 0-.18 0-.36 .03c-.66 .12-.99 .12-1.83 .12c-1.05 0-1.71-.06-2.61-.3c-4.02-.99-7.11-4.35-7.8-8.46c-.12-.66-.12-.99-.12-1.83c0-.84 0-1.14 .15-1.92c.36-2.28 1.41-4.62 3.3-7.29l2.79-3.6c.54-.66 .96-1.2 .96-1.23c0-.03-.09-.33-.18-.69c-.96-3.21-1.41-5.28-1.59-7.68c-.12-1.38-.15-3.09-.06-3.96c.33-2.67 1.38-5.07 3.12-7.08c.36-.42 .99-1.05 1.17-1.14zm2.01 4.71c-.15-.3-.3-.54-.3-.54c-.03 0-.18 .09-.3 .21c-2.4 1.74-3.87 4.2-4.26 7.11c-.06 .54-.06 1.41-.03 1.89c.09 1.29 .48 3.12 1.08 5.22c.15 .42 .24 .78 .24 .81c0 .03 .84-1.11 1.23-1.68c1.89-2.73 2.88-5.07 3.15-7.53c.09-.57 .12-1.74 .06-2.37c-.09-1.23-.27-1.92-.87-3.12zm-2.94 20.7c-.21-.72-.39-1.32-.42-1.32c0 0-1.2 1.47-1.86 2.37c-2.79 3.63-4.02 6.3-4.35 9.3c-.03 .21-.03 .69-.03 1.08c0 .69 0 .75 .06 1.11c.12 .54 .27 .99 .51 1.47c.69 1.38 1.83 2.55 3.42 3.42c.96 .54 2.07 .9 3.21 1.08c.78 .12 2.04 .12 2.94-.03c.51-.06 .45-.03 .42-.3c-.24-3.33-.72-6.33-1.62-10.08c-.09-.39-.18-.75-.18-.78c-.03-.03-.42 0-.81 .09c-.9 .18-1.65 .57-2.22 1.14c-.72 .72-1.08 1.65-1.05 2.64c.06 .96 .48 1.83 1.23 2.58c.36 .36 .72 .63 1.17 .9c.33 .18 .36 .21 .42 .33c.18 .42-.18 .9-.6 .87c-.18-.03-.84-.36-1.26-.63c-.78-.51-1.38-1.11-1.86-1.83c-1.77-2.7-.99-6.42 1.71-8.19c.3-.21 .81-.48 1.17-.63c.3-.09 1.02-.3 1.14-.3c.06 0 .09 0 .09-.03c.03-.03-.51-1.92-1.23-4.26zm3.78 7.41c-.18-.03-.36-.06-.39-.06c-.03 0 0 .21 .18 1.02c.75 3.18 1.26 6.3 1.5 9.09c.06 .72 0 .69 .51 .42c.78-.36 1.44-.96 1.98-1.77c1.08-1.62 1.2-3.69 .3-5.55c-.81-1.62-2.31-2.79-4.08-3.15z',
	'khoa-fa': 'M6.3-7.8c.36-.03 1.65 0 2.13 .03c3.6 .42 6.03 2.1 6.93 4.86c.27 .84 .36 1.5 .36 2.58c0 .9-.03 1.35-.18 2.16c-.78 3.78-3.54 7.08-8.37 9.96c-1.74 1.05-3.87 2.13-6.18 3.12c-.39 .18-.75 .33-.81 .36c-.06 .03-.15 .06-.18 .06c-.15 0-.33-.18-.33-.33c0-.15 .06-.21 .51-.48c3-1.77 5.13-3.21 6.84-4.74c.51-.45 1.59-1.5 1.95-1.95c1.89-2.19 2.88-4.32 3.15-6.78c.06-.42 .06-1.77 0-2.19c-.24-2.01-.93-3.63-2.04-4.71c-.63-.63-1.29-1.02-2.07-1.2c-1.62-.39-3.36 .15-4.56 1.44c-.54 .6-1.05 1.47-1.32 2.22l-.09 .21l.24-.12c.39-.21 .63-.24 1.11-.24c.3 0 .45 0 .66 .06c1.92 .48 2.85 2.55 1.95 4.38c-.45 .99-1.41 1.62-2.46 1.71c-1.47 .09-2.91-.87-3.39-2.25c-.18-.57-.21-1.32-.03-2.28c.39-2.25 1.83-4.2 3.81-5.19c.69-.36 1.59-.6 2.37-.69zm11.58 2.52c.84-.21 1.71 .3 1.89 1.14c.3 1.17-.72 2.19-1.89 1.89c-.99-.21-1.5-1.32-1.02-2.25c.18-.39 .6-.69 1.02-.78zm0 7.5c.84-.21 1.71 .3 1.89 1.14c.21 .87-.3 1.71-1.14 1.89c-.87 .21-1.71-.3-1.89-1.14c-.21-.84 .3-1.71 1.14-1.89z',
	thang: 'M5.73-11.19c.21-.12 .54-.03 .66 .24c.06 .12 .06 .21 .06 2.31c0 1.23 0 2.22 .03 2.22c0 0 .27-.12 .6-.24c.69-.27 .78-.3 .96-.15c.21 .15 .21 .18 .21 1.38c0 1.02 0 1.11-.06 1.2c-.03 .06-.09 .12-.12 .15c-.06 .03-.42 .21-.84 .36l-.75 .33l-.03 2.43c0 1.32 0 2.43 .03 2.43c0 0 .27-.12 .6-.24c.69-.27 .78-.3 .96-.15c.21 .15 .21 .18 .21 1.38c0 1.02 0 1.11-.06 1.2c-.03 .06-.09 .12-.12 .15c-.06 .03-.42 .21-.84 .36l-.75 .33l-.03 2.52c0 2.28-.03 2.55-.06 2.64c-.21 .36-.72 .36-.93 0c-.03-.09-.06-.33-.06-2.43l0-2.31l-1.29 .51l-1.26 .51l0 2.43c0 2.58 0 2.52-.15 2.67c-.06 .09-.27 .18-.36 .18c-.12 0-.33-.09-.39-.18c-.15-.15-.15-.09-.15-2.43c0-1.23 0-2.22-.03-2.22c0 0-.27 .12-.6 .24c-.69 .27-.78 .3-.96 .15c-.21-.15-.21-.18-.21-1.38c0-1.02 0-1.11 .06-1.2c.03-.06 .09-.12 .12-.15c.06-.03 .42-.21 .84-.36l.78-.33l0-2.43c0-1.32 0-2.43-.03-2.43c0 0-.27 .12-.6 .24c-.69 .27-.78 .3-.96 .15c-.21-.15-.21-.18-.21-1.38c0-1.02 0-1.11 .06-1.2c.03-.06 .09-.12 .12-.15c.06-.03 .42-.21 .84-.36l.78-.33l0-2.52c0-2.28 .03-2.55 .06-2.64c.21-.36 .72-.36 .93 0c.03 .09 .06 .33 .06 2.43l.03 2.31l1.26-.51l1.26-.51l0-2.43c0-2.28 0-2.43 .06-2.55c.06-.12 .12-.18 .27-.24zm-.33 10.65l0-2.43l-1.29 .51l-1.26 .51l0 2.46l0 2.43l.09-.03c.06-.03 .63-.27 1.29-.51l1.17-.48l0-2.46z',
	giang: 'M-.36-14.07c.33-.06 .87 0 1.08 .15c.06 .03 .06 .36-.03 5.25c-.06 2.85-.09 5.19-.09 5.19c0 .03 .12-.03 .24-.12c.63-.42 1.41-.66 2.19-.72c.81-.03 1.47 .21 2.04 .78c.57 .54 .87 1.26 .93 2.04c.03 .57-.09 1.08-.36 1.62c-.42 .81-1.02 1.38-2.82 2.61c-1.14 .78-1.44 1.02-1.8 1.44c-.18 .18-.39 .39-.45 .42c-.27 .18-.57 .15-.81-.06c-.06-.09-.12-.18-.15-.27c-.03-.06-.09-3.27-.18-8.34c-.09-4.53-.15-8.58-.18-9.03l0-.78l.12-.06c.06-.03 .18-.09 .27-.12zm3.18 11.01c-.21-.12-.54-.15-.81-.06c-.54 .15-.99 .63-1.17 1.26c-.06 .3-.12 2.88-.06 3.87c.03 .42 .03 .81 .06 .9l.03 .12l.45-.39c.63-.54 1.26-1.17 1.56-1.59c.3-.42 .6-.99 .72-1.41c.18-.69 .09-1.47-.18-2.07c-.15-.3-.33-.51-.6-.63z',
	'khoa-do': 'M.06-14.94l.09-.06l1.92 0l1.92 0l.09 .06l.06 .09l0 14.85l0 14.82l-.06 .09l-.09 .06l-1.92 0l-1.92 0l-.09-.06l-.06-.09l0-14.82l0-14.85zm5.37 0c.09-.06 .09-.06 .57-.06c.45 0 .45 0 .54 .06l.06 .09l0 7.14l0 7.11l.09-.06c.18-.18 .72-.84 .96-1.2c.3-.45 .66-1.17 .84-1.65c.36-.9 .57-1.83 .6-2.79c.03-.48 .03-.54 .09-.63c.12-.18 .36-.21 .54-.12c.18 .09 .21 .15 .24 .66c.06 .87 .21 1.56 .57 2.22c.51 1.02 1.26 1.68 2.22 1.92c.21 .06 .33 .06 .78 .06c.45 0 .57 0 .84-.06c.45-.12 .81-.33 1.08-.6c.57-.57 .87-1.41 .99-2.88c.06-.54 .06-3 0-3.57c-.21-2.58-.84-3.87-2.16-4.5c-.48-.21-1.17-.36-1.77-.36c-.69 0-1.29 .27-1.5 .72c-.06 .15-.06 .21-.06 .42c0 .24 0 .3 .06 .45c.12 .24 .24 .39 .63 .66c.42 .3 .57 .48 .69 .72c.06 .15 .06 .21 .06 .48c0 .39-.03 .63-.21 .96c-.3 .6-.87 1.08-1.5 1.26c-.27 .06-.87 .06-1.14 0c-.78-.24-1.44-.87-1.65-1.68c-.12-.42-.09-1.17 .09-1.71c.51-1.65 1.98-2.82 3.81-3.09c.84-.09 2.46 .03 3.51 .27c2.22 .57 3.69 1.8 4.44 3.75c.36 .93 .57 2.13 .57 3.36c0 1.44-.48 2.73-1.38 3.81c-1.26 1.5-3.27 2.43-5.28 2.43c-.48 0-.51 0-.75-.09c-.15-.03-.48-.21-.78-.36c-.69-.36-.87-.42-1.26-.42c-.27 0-.3 0-.51 .09c-.57 .3-.81 .9-.81 2.1c0 1.23 .24 1.83 .81 2.13c.21 .09 .24 .09 .51 .09c.39 0 .57-.06 1.26-.42c.3-.15 .63-.33 .78-.36c.24-.09 .27-.09 .75-.09c2.01 0 4.02 .93 5.28 2.4c.9 1.11 1.38 2.4 1.38 3.84c0 1.5-.3 2.88-.84 3.96c-.78 1.59-2.19 2.64-4.17 3.15c-1.05 .24-2.67 .36-3.51 .27c-1.83-.27-3.3-1.44-3.81-3.09c-.18-.54-.21-1.29-.09-1.74c.15-.6 .63-1.2 1.23-1.47c.36-.18 .57-.21 .99-.21c.42 0 .63 .03 1.02 .21c.42 .21 .84 .63 1.05 1.05c.18 .36 .21 .6 .21 .96c0 .3 0 .36-.06 .51c-.12 .24-.27 .42-.69 .72c-.57 .42-.69 .63-.69 1.08c0 .24 0 .3 .06 .45c.12 .21 .3 .39 .57 .54c.42 .18 .87 .21 1.53 .15c1.08-.15 1.8-.57 2.34-1.32c.54-.75 .84-1.83 .99-3.51c.06-.57 .06-3.03 0-3.57c-.12-1.47-.42-2.31-.99-2.88c-.27-.27-.63-.48-1.08-.6c-.27-.06-.39-.06-.84-.06c-.45 0-.57 0-.78 .06c-1.14 .27-2.01 1.17-2.46 2.49c-.21 .57-.3 .99-.33 1.65c-.03 .51-.06 .57-.24 .66c-.12 .06-.27 .06-.39 0c-.21-.09-.21-.15-.24-.75c-.09-1.92-.78-3.72-2.01-5.19c-.18-.21-.36-.42-.39-.45l-.09-.06l0 7.11l0 7.14l-.06 .09c-.09 .06-.09 .06-.54 .06c-.48 0-.48 0-.57-.06l-.06-.09l0-14.82l0-14.85z',
	'not-tron': 'M6.51-4.05c.51-.03 2.01 0 2.52 .03c1.41 .18 2.64 .51 3.72 1.08c1.2 .63 1.95 1.41 2.19 2.31c.09 .33 .09 .9 0 1.23c-.24 .9-.99 1.68-2.19 2.31c-1.08 .57-2.28 .9-3.75 1.08c-.66 .06-2.31 .06-2.97 0c-1.47-.18-2.67-.51-3.75-1.08c-1.2-.63-1.95-1.41-2.19-2.31c-.09-.33-.09-.9 0-1.23c.24-.9 .99-1.68 2.19-2.31c1.2-.63 2.61-.99 4.23-1.11zm.57 .66c-.87-.15-1.53 0-2.04 .51c-.15 .15-.24 .27-.33 .48c-.24 .51-.36 1.08-.33 1.77c.03 .69 .18 1.26 .42 1.77c.6 1.17 1.74 1.98 3.18 2.22c1.11 .21 1.95-.15 2.34-.99c.24-.51 .36-1.08 .33-1.8c-.06-1.11-.45-2.04-1.17-2.76c-.63-.63-1.47-1.05-2.4-1.2z',
};
/** Tiền tố id của các ký hiệu dùng chung trong trang (<symbol>, vẽ bằng <use>). */
const ID = 'oz-kh-';

/**
 * Định nghĩa các ký hiệu một lần cho cả trang (svg ẩn, các hình hóa biểu dùng lại bằng <use href="#oz-kh-…">). Trình duyệt
 * dựng hình hóa biểu lúc chạy (vòng quãng năm, luyện hóa biểu) thì thêm định nghĩa này khi trang chưa có.
 */
export const dinhNghiaKyHieu = () =>
	`<svg class="oz-kh-dinh-nghia" width="0" height="0" aria-hidden="true" focusable="false"><defs>${Object.entries(KY_HIEU)
		.map(([ten, d]) => `<path id="${ID}${ten}" d="${d}"/>`)
		.join('')}</defs></svg>`;

/**
 * Trong trình duyệt: thêm định nghĩa ký hiệu vào trang một lần, nếu trang chưa có (trang có hình hóa biểu dựng lúc build thì
 * đã có, do src/components/MarkdownContent.astro thêm).
 */
export function canKyHieu() {
	if (document.getElementById(`${ID}khoa-sol`)) return;
	const d = document.createElement('div');
	d.innerHTML = dinhNghiaKyHieu();
	document.body.append(d.firstElementChild);
}

const KHE = 7.75; // một khe của khuông (hai bậc cao độ)
const DONG_TREN = 16; // y của dòng kẻ trên cùng
const DONG_DUOI = DONG_TREN + 4 * KHE;
/** Bậc của từng dấu trên khóa Sol, tính từ dòng dưới cùng (Mi4 = 0, mỗi dòng hay khe một bậc). */
const BAC_THANG = { F: 8, C: 5, G: 9, D: 6, A: 3, E: 7, B: 4 };
const BAC_GIANG = { B: 4, E: 7, A: 3, D: 6, G: 2, C: 5, F: 1 };
/** Khóa Fa: cùng chữ thấp hơn khóa Sol hai bậc (dòng dưới cùng là Sol2). */
const LECH_KHOA = { sol: 0, fa: -2 };
export const RONG_HOA_BIEU = 101;
export const CAO_HOA_BIEU = 61;

/** Bậc (tính từ dòng dưới cùng) của các dấu trong hóa biểu có n dấu, theo khóa ("sol", "fa"). */
export function bacCacDau(n, khoa = 'sol') {
	const bac = n > 0 ? BAC_THANG : BAC_GIANG;
	return dauCuaHoaBieu(n).map((L) => bac[L] + LECH_KHOA[khoa]);
}

/**
 * Hóa biểu trên một khuông nhỏ (khóa Sol hay khóa Fa, n dấu: dương là dấu thăng, âm là dấu giáng), như hình abcjs vẽ ở
 * site cũ. Cần định nghĩa ký hiệu (dinhNghiaKyHieu) ở đâu đó trong trang. `nhan`: chữ cho máy đọc màn hình (không có thì
 * hình chỉ để nhìn, aria-hidden).
 */
export function veHoaBieu(n, { khoa = 'sol', nhan = '' } = {}) {
	const dong = Array.from({ length: 5 }, (_, i) => `<path d="M1 ${so(DONG_TREN + i * KHE)}H${RONG_HOA_BIEU - 1}"/>`).join('');
	const khoaY = khoa === 'fa' ? DONG_DUOI - 3 * KHE : DONG_DUOI - KHE;
	const buoc = n > 0 ? 9.5 : 8;
	const dau = bacCacDau(n, khoa)
		.map((b, i) => `<use href="#${ID}${n > 0 ? 'thang' : 'giang'}" x="${so(30 + i * buoc)}" y="${so(DONG_DUOI - (b * KHE) / 2)}"/>`)
		.join('');
	const vaiTro = nhan ? `role="img" aria-label="${esc(nhan)}"` : 'aria-hidden="true"';
	return (
		`<svg class="oz-hb" viewBox="0 0 ${RONG_HOA_BIEU} ${CAO_HOA_BIEU}" ${vaiTro} focusable="false">` +
		`<g class="oz-hb-dong">${dong}</g><use href="#${ID}khoa-${khoa}" x="5" y="${so(khoaY)}"/>${dau}</svg>`
	);
}

// ---------- Một nốt trên khuông (đọc nốt, D7-L1) ----------

/** Nốt ở dòng dưới cùng của từng khóa, đánh số theo bậc: quãng tám × 7 + chữ cái (Đô = 0 … Si = 6), như note-reader.js cũ. */
export const DONG_DUOI_CUA = { treble: 30, bass: 18, alto: 24, tenor: 22 };
/** Ký hiệu và y (gốc của hình) của từng khóa: Sol ở dòng 2, Fa ở dòng 4, Đô alto ở dòng 3, Đô tenor ở dòng 4. */
const KHOA_NOT = { treble: ['khoa-sol', 1], bass: ['khoa-fa', 3], alto: ['khoa-do', 2], tenor: ['khoa-do', 3] };
const RONG_NOT = 100;
const NOT_X = 58;

/**
 * Khuông năm dòng với một khóa (`khoa`: treble, bass, alto, tenor) và một nốt tròn ở bậc `v` (như DONG_DUOI_CUA), kèm dòng
 * kẻ phụ; `v` null thì khuông trống (ô đọc nốt dựng sẵn lúc build, trước khi chọn nốt). Khung cao đủ cho hai dòng kẻ phụ
 * trên và dưới (phạm vi "thêm dòng kẻ phụ" của note-reader.js cũ), nên đổi nốt không đổi cỡ hình.
 */
export function veNotDon(khoa, v, { nhan = '' } = {}) {
	const dong = Array.from({ length: 5 }, (_, i) => `<path d="M1 ${so(DONG_TREN + i * KHE)}H${RONG_NOT - 1}"/>`).join('');
	const [kh, dongKhoa] = KHOA_NOT[khoa];
	let phu = '';
	let dau = '';
	if (v !== null && v !== undefined) {
		const b = v - DONG_DUOI_CUA[khoa];
		const y = (bac) => so(DONG_DUOI - (bac * KHE) / 2);
		const cac = [];
		for (let c = -2; c >= b; c -= 2) cac.push(c);
		for (let c = 10; c <= b; c += 2) cac.push(c);
		phu = cac.map((c) => `<path d="M${NOT_X - 4} ${y(c)}H${NOT_X + 19}"/>`).join('');
		dau = `<use class="oz-not-dau" href="#${ID}not-tron" x="${NOT_X}" y="${y(b)}"/>`;
	}
	const vaiTro = nhan ? `role="img" aria-label="${esc(nhan)}"` : 'aria-hidden="true"';
	return (
		`<svg class="oz-hb oz-not-don" viewBox="0 -8 ${RONG_NOT} ${DONG_DUOI + 3 * KHE + 10}" ${vaiTro} focusable="false">` +
		`<g class="oz-hb-dong">${dong}${phu}</g><use href="#${ID}${kh}" x="5" y="${so(DONG_DUOI - dongKhoa * KHE)}"/>${dau}</svg>`
	);
}

// ---------- Bàn phím ----------

const PHIM_RONG = 24;
const PHIM_CAO = 104;
const DEN_RONG = 14;
const DEN_CAO = 64;

/**
 * Khoảng phím từ hai nốt viết bằng số MIDI: đầu hay cuối rơi vào phím đen thì mở rộng ra phím trắng bên cạnh, như
 * parseRange của piano.js cũ.
 */
export function khoangPhim(thap, cao) {
	return [laPhimDen(thap) ? thap - 1 : thap, laPhimDen(cao) ? cao + 1 : cao];
}

/** Số phím trắng từ thap đến cao (số MIDI, kể cả hai đầu). */
export function soPhimTrang(thap, cao) {
	let n = 0;
	for (let m = thap; m <= cao; m++) if (!laPhimDen(m)) n++;
	return n;
}

/** Tâm (x) của phím m trên hình bàn phím bắt đầu ở phím trắng `thap` (đơn vị của viewBox). */
export function tamPhim(thap, m) {
	const x = 1 + (soPhimTrang(thap, m) - (laPhimDen(m) ? 0 : 1)) * PHIM_RONG;
	return laPhimDen(m) ? x : x + PHIM_RONG / 2;
}

const DONG = 7.5; // cao một dòng chữ của nhãn và ngoặc (cỡ chữ 6,5)
/** Bề rộng ước lượng của một dòng chữ cỡ 6,5 (để xếp các ngoặc không đè chữ lên nhau). */
const rongChu = (s) => [...s].length * 3.6;
const TAY = { phai: 'tay phải', trai: 'tay trái' };

/** Xếp các ngoặc vào tầng: tầng 0 sát bàn phím; ngoặc chồng lên ngoặc khác (cả phần chữ) thì lên tầng trên. */
function xepNgoac(thap, ngoac) {
	const tang = []; // mỗi tầng: khoảng x đã dùng, gồm cả chữ
	return [...ngoac]
		.sort((a, b) => a.tu - b.tu || a.den - b.den)
		.map((n) => {
			const [x1, x2] = [tamPhim(thap, n.tu), tamPhim(thap, n.den)];
			const giua = (x1 + x2) / 2;
			const nua = Math.max(...n.dong.map(rongChu)) / 2;
			const [trai, phai] = [Math.min(x1, giua - nua), Math.max(x2, giua + nua)];
			let t = tang.findIndex((ds) => ds.every(([a, b]) => b <= trai + 0.5 || a >= phai - 0.5));
			if (t < 0) t = tang.push([]) - 1;
			tang[t].push([trai, phai]);
			return { ...n, x1, x2, giua, t };
		});
}

/**
 * Bàn phím piano bằng SVG, từ phím `thap` đến `cao` (số MIDI, hai đầu là phím trắng), tô các phím trong `to`. Phím trắng
 * ghi tên hai hệ (Đô, Rê… và chữ cái; phím Đô ghi cả số quãng tám: C4). Mỗi phím mang data-m (số MIDI) và
 * data-ten (tên đọc lên khi bấm). Hình dựng sẵn lúc build để hiện ngay, không xô bố cục; src/scripts/ban-phim.js thêm
 * phần bấm được (vai trò nút, phím mũi tên) khi trang chạy JavaScript. Hình phím của công cụ luyện tai (src/scripts/luyen-tai.js)
 * tô thêm nhóm phím thứ hai `to2` (lớp to-2, màu khác; phím có cả trong `to` thì theo `to`) và đặt nhãn riêng `nhan`.
 *
 * Chữ thêm trên hình (đợt hình 1; ::cong-cu{ten="piano" phai trai nhan ngoac}):
 * - `ngon`: [{ m, tay: 'phai' | 'trai', so }]: số ngón trên phím; tay phải trong hình tròn, tay trái trong hình vuông bo góc
 *   (hai màu, và khác hình để không chỉ dựa vào màu); hai tay chung một phím thì hai dấu cạnh nhau.
 * - `nhanPhim`: [{ m, dong: [chữ…] }]: nhãn ngắn (tối đa ba dòng); phím trắng ghi dưới bàn phím, phím đen ghi trên.
 * - `ngoac`: [{ tu, den, dong: [chữ…] }]: ngoặc nối tâm hai phím, chữ phía trên; ngoặc chồng nhau thì xếp tầng.
 * Chữ trong hình là chữ thật (aria-hidden: số ngón và nhãn đã ở aria-label của từng phím qua data-mo-ta, và ở aria-label
 * của cả hình).
 */
export function veBanPhim({ thap, cao, to = [], to2 = [], nhan: nhanRieng, ngon = [], nhanPhim = [], ngoac = [] }) {
	const ngoacXep = xepNgoac(thap, ngoac);
	const soDong = (ds) => Math.max(0, ...ds.map((n) => n.dong.length));
	const tangCao = [];
	for (const n of ngoacXep) tangCao[n.t] = Math.max(tangCao[n.t] ?? 0, n.dong.length * DONG + 6);
	const caoNgoac = tangCao.reduce((a, b) => a + b, 0);
	const nhanDen = nhanPhim.filter((n) => laPhimDen(n.m));
	const nhanTrang = nhanPhim.filter((n) => !laPhimDen(n.m));
	// nhãn của hai phím kề nhau (phím trắng cạnh nhau, hay phím đen cùng nhóm) dài quá khoảng cách giữa hai phím thì xếp so
	// le hai hàng (phím thứ hai, thứ tư… lùi xa bàn phím hơn): phím trắng chỉ lùi các dòng sau dòng đầu khi dòng đầu vừa
	// (dòng đầu thẳng hàng, như số nửa cung), không thì lùi cả nhãn; phím đen lùi cả nhãn
	const dangDe = (ds, tu, den) =>
		[...ds]
			.sort((a, b) => a.m - b.m)
			.some((n, i, xs) => {
				const tr = xs[i - 1];
				if (!tr || tamPhim(thap, n.m) - tamPhim(thap, tr.m) > PHIM_RONG + 0.5) return false;
				const r = (x) => Math.max(0, ...x.dong.slice(tu, den).map(rongChu)) / 2;
				return r(tr) + r(n) > PHIM_RONG - 1.5;
			});
	const thuTu = (m) => Math.floor((tamPhim(thap, m) - 1) / PHIM_RONG); // vị trí phím, để chọn hàng so le
	const lDen = soDong(nhanDen);
	const soLeDen = dangDe(nhanDen, 0);
	const caoNhanDen = nhanDen.length ? (soLeDen ? 2 : 1) * lDen * DONG + 3 : 0;
	const y0 = caoNgoac + caoNhanDen; // đỉnh phím
	const lTrang = soDong(nhanTrang);
	const soLeTrang = dangDe(nhanTrang, 0, 1) ? 'ca' : dangDe(nhanTrang, 1) ? 'sau' : '';
	const caoNhanTrang = nhanTrang.length ? (lTrang + (soLeTrang === 'ca' ? lTrang : soLeTrang ? lTrang - 1 : 0)) * DONG + 4 : 0;
	const moTa = new Map();
	const themMoTa = (m, s) => moTa.set(m, [...(moTa.get(m) ?? []), s]);
	for (const n of ngon) themMoTa(n.m, `${TAY[n.tay]} ngón ${n.so}`);
	for (const n of nhanPhim) themMoTa(n.m, n.dong.join(', '));
	const trang = [];
	const den = [];
	let x = 1;
	const coTo = (m) => (to.includes(m) ? ' to' : to2.includes(m) ? ' to-2' : '');
	const dataMoTa = (m) => (moTa.has(m) ? ` data-mo-ta="${esc(moTa.get(m).join('; '))}"` : '');
	for (let m = thap; m <= cao; m++) {
		if (laPhimDen(m)) continue;
		const pc = ((m % 12) + 12) % 12;
		const l = [0, 2, 4, 5, 7, 9, 11].indexOf(pc);
		const giua = so(x + PHIM_RONG / 2);
		trang.push(
			`<rect class="oz-phim-trang${coTo(m)}" x="${x}" y="${so(1 + y0)}" width="${PHIM_RONG}" height="${PHIM_CAO}" rx="3" data-m="${m}" data-ten="${esc(tenPhim(m))}"${dataMoTa(m)}/>` +
				// chữ trên phím chỉ để nhìn: tên phím đã ở aria-label của nút (ban-phim.js), không đọc lặp
				`<text class="oz-phim-chu" x="${giua}" y="${so(y0 + PHIM_CAO - 7)}" aria-hidden="true">${SOLFEGE[l]}</text>` +
				`<text class="oz-phim-chu oz-phim-chu--nho" x="${giua}" y="${so(y0 + PHIM_CAO - 19)}" aria-hidden="true">${CHU[l]}${l === 0 ? Math.floor(m / 12) - 1 : ''}</text>`,
		);
		if (m + 1 <= cao && laPhimDen(m + 1))
			den.push(
				`<rect class="oz-phim-den${coTo(m + 1)}" x="${so(x + PHIM_RONG - DEN_RONG / 2)}" y="${so(1 + y0)}" width="${DEN_RONG}" height="${DEN_CAO}" rx="2" data-m="${m + 1}" data-ten="${esc(tenPhim(m + 1))}"${dataMoTa(m + 1)}/>`,
			);
		x += PHIM_RONG;
	}
	const soTrang = trang.length;

	// số ngón: phím trắng ở ngay dưới phím đen (y 71), phím đen ở cuối phím đen; hai tay chung phím thì đặt cạnh (hay chồng) nhau
	const dau = [];
	const theoPhim = ngon.reduce((mp, n) => mp.set(n.m, [...(mp.get(n.m) ?? []), n]), new Map());
	for (const [m, ds] of theoPhim) {
		const cx = tamPhim(thap, m);
		const laDen = laPhimDen(m);
		const hai = ds.length > 1;
		const r = laDen ? (hai ? 5 : 6) : hai ? 5.5 : 7;
		[...ds].sort((a, b) => (a.tay === 'trai' ? 0 : 1) - (b.tay === 'trai' ? 0 : 1)).forEach((n, i) => {
			const dx = hai && !laDen ? (i ? 6 : -6) : 0;
			const cy = y0 + (laDen ? (hai ? (i ? 56 : 44) : 53) : 71);
			const [px, py] = [cx + dx, cy];
			const hinh =
				n.tay === 'phai'
					? `<circle cx="${so(px)}" cy="${so(py)}" r="${r}"/>`
					: `<rect x="${so(px - r)}" y="${so(py - r)}" width="${2 * r}" height="${2 * r}" rx="${so(r / 3)}"/>`;
			dau.push(`<g class="oz-ngon oz-ngon--${n.tay}" data-phim="${m}" aria-hidden="true">${hinh}<text x="${so(px)}" y="${so(py + (hai ? 2.6 : 3))}"${hai ? ' class="oz-ngon-nho"' : ''}>${n.so}</text></g>`);
		});
	}

	// nhãn: phím đen ở dải trên (sát đỉnh phím), phím trắng ở dải dưới
	const dongChu = (ds, cx, yDau, lop, lui = 0) =>
		`<text class="${lop}" aria-hidden="true">${ds.map((s, i) => `<tspan x="${so(cx)}" y="${so(yDau + i * DONG + (i ? lui : 0))}">${esc(s)}</tspan>`).join('')}</text>`;
	const nhanSvg = [
		...nhanDen.map((n) => {
			const lui = soLeDen && thuTu(n.m) % 2 ? lDen * DONG : 0;
			return dongChu(n.dong, tamPhim(thap, n.m), y0 - 4 - (n.dong.length - 1) * DONG - lui, 'oz-phim-nhan');
		}),
		...nhanTrang.map((n) => {
			const le = soLeTrang && thuTu(n.m) % 2;
			const yDau = y0 + PHIM_CAO + 2 + 6.5 + (le && soLeTrang === 'ca' ? lTrang * DONG : 0);
			return dongChu(n.dong, tamPhim(thap, n.m), yDau, 'oz-phim-nhan', le && soLeTrang === 'sau' ? (lTrang - 1) * DONG : 0);
		}),
	];

	// ngoặc: tầng 0 ở ngay trên dải nhãn phím đen
	const dayTang = [];
	let yTang = caoNgoac;
	tangCao.forEach((h, t) => {
		dayTang[t] = yTang; // y của nét ngang (đáy tầng)
		yTang -= h;
	});
	const ngoacSvg = ngoacXep.map((n) => {
		const y = dayTang[n.t] - 2;
		return (
			`<g class="oz-phim-ngoac" aria-hidden="true"><path d="M${so(n.x1)} ${so(y + 3)}V${so(y)}H${so(n.x2)}V${so(y + 3)}"/>` +
			dongChu(n.dong, n.giua, y - 2.5 - (n.dong.length - 1) * DONG, 'oz-phim-ngoac-chu') +
			`</g>`
		);
	});

	let nhan = nhanRieng
		? `${nhanRieng}: ${[...new Set([...to2, ...to])].map(tenPhim).join(', ')}`
		: `Bàn phím piano từ ${tenPhim(thap)} đến ${tenPhim(cao)}` + (to.length ? `; các phím được tô: ${to.map(tenPhim).join(', ')}` : '');
	for (const tay of ['phai', 'trai']) {
		const ds = ngon.filter((n) => n.tay === tay).sort((a, b) => a.m - b.m);
		if (ds.length) nhan += `; ${TAY[tay]}: ${ds.map((n) => `ngón ${n.so} trên ${tenPhim(n.m)}`).join(', ')}`;
	}
	if (nhanPhim.length) nhan += `; nhãn: ${[...nhanPhim].sort((a, b) => a.m - b.m).map((n) => `${tenPhim(n.m)}: ${n.dong.join(', ')}`).join(', ')}`;
	if (ngoac.length) nhan += `; ngoặc: ${[...ngoac].sort((a, b) => a.tu - b.tu).map((n) => `${tenPhim(n.tu)} đến ${tenPhim(n.den)}: ${n.dong.join(', ')}`).join(', ')}`;
	const coChu = ngon.length || nhanPhim.length || ngoac.length;
	const caoHinh = y0 + PHIM_CAO + 2 + caoNhanTrang;
	return {
		soTrang,
		svg:
			`<svg class="oz-phim${coChu ? ' oz-phim--chu' : ''}" viewBox="0 0 ${soTrang * PHIM_RONG + 2} ${so(caoHinh)}" role="img" aria-label="${esc(nhan)}" style="--phim:${soTrang}">` +
			(ngoacSvg.length ? `<g class="oz-phim-nhom">${ngoacSvg.join('')}</g>` : '') +
			`<g class="oz-phim-nhom">${trang.join('')}</g><g class="oz-phim-nhom">${den.join('')}</g>` +
			(dau.length || nhanSvg.length ? `<g class="oz-phim-nhom">${nhanSvg.join('')}${dau.join('')}</g>` : '') +
			`</svg>`,
	};
}

// ---------- Vòng quãng năm ----------

/** Mười hai vị trí trên vòng, theo chiều kim đồng hồ từ Đô ở đỉnh: các tên giọng trưởng ở vị trí ấy (RING của circle.js). */
export const VONG = [['C'], ['G'], ['D'], ['A'], ['E'], ['B', 'Cb'], ['F#', 'Gb'], ['Db', 'C#'], ['Ab'], ['Eb'], ['Bb'], ['F']];

/** Tên giọng thứ viết chữ thường như hình cũ: "f♯" (chủ âm viết kiểu "F#"). */
export const chuThuong = (t) => tenChuCua(t).toLowerCase();

const goc = (doNghieng) => ((doNghieng - 90) * Math.PI) / 180; // vị trí i trên vòng: 30·i độ, 0 ở đỉnh, theo chiều kim đồng hồ
const diem = (cx, cy, r, a) => `${so(cx + r * Math.cos(a))} ${so(cy + r * Math.sin(a))}`;

/**
 * Vòng quãng năm tĩnh (::hinh{ten="circle"}, như circle_svg của tools/figures.py cũ): vòng ngoài 12 giọng trưởng kèm số dấu
 * hóa, vòng trong giọng thứ song song. Ô đồng âm khác tên ghi "F♯/G♭", "6♯/6♭", và giọng thứ cùng thứ tự: "d♯/e♭" (hình
 * cũ ghi "e♭/d♯", ngược thứ tự; lô D2-L1 đã sửa như vậy ở tờ tóm tắt).
 */
export function veVongQuangNam() {
	const truong = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
	const thu = ['a', 'e', 'b', 'f♯', 'c♯', 'g♯', 'd♯/e♭', 'b♭', 'f', 'c', 'g', 'd'];
	const dau = ['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯/6♭', '5♭', '4♭', '3♭', '2♭', '1♭'];
	const c = 110;
	const chu = (x, y, s, co, dam = false, nhat = false) =>
		`<text x="${so(x)}" y="${so(y)}" font-size="${co}"${dam ? ' font-weight="600"' : ''}${nhat ? ' class="oz-vong-nhat"' : ''}>${s}</text>`;
	const p = [104, 66, 34].map((r) => `<circle cx="${c}" cy="${c}" r="${r}" class="oz-vong-duong"/>`);
	for (let i = 0; i < 12; i++) {
		const a = goc(i * 30);
		const [x, y] = [c + 86 * Math.cos(a), c + 86 * Math.sin(a)];
		p.push(chu(x, y + 1, truong[i], truong[i].length > 2 ? 9 : 12, true));
		p.push(chu(x, y + 11, dau[i], 6.5, false, true));
		p.push(chu(c + 51 * Math.cos(a), c + 51 * Math.sin(a) + 3, thu[i], thu[i].length > 2 ? 7.5 : 9.5));
		const a2 = goc(i * 30 + 15);
		p.push(`<path d="M${diem(c, c, 66, a2)}L${diem(c, c, 104, a2)}" class="oz-vong-ke"/>`);
	}
	p.push(chu(c, c - 2, 'ngoài: trưởng', 7), chu(c, c + 8, 'trong: thứ', 7));
	return (
		`<svg class="oz-fig oz-fig-circle oz-vong-tinh" viewBox="0 0 220 220" role="img" ` +
		`aria-label="Vòng quãng năm: vòng ngoài là giọng trưởng kèm số dấu hóa, vòng trong là giọng thứ song song">${p.join('')}</svg>`
	);
}

const VONG_C = 160;
const VONG_NGOAI = [106, 156];
const VONG_TRONG = [58, 106];

/** Hình quạt của vị trí i giữa hai bán kính (vòng quãng năm bấm được). */
function quat(i, [r1, r2]) {
	const [a1, a2] = [goc(i * 30 - 15), goc(i * 30 + 15)];
	return `M${diem(VONG_C, VONG_C, r2, a1)}A${r2} ${r2} 0 0 1 ${diem(VONG_C, VONG_C, r2, a2)}L${diem(VONG_C, VONG_C, r1, a2)}A${r1} ${r1} 0 0 0 ${diem(VONG_C, VONG_C, r1, a1)}Z`;
}

/** Tên một ô của vòng bấm được: giọng trưởng ("F♯/G♭", như circle.js cũ) hay giọng thứ song song của tên đầu ("d♯"). */
export const tenO = (ten, thu) => (thu ? chuThuong(giongTheoChuAm(ten[0]).thu) : ten.map(tenChuCua).join('/'));

/**
 * Vòng quãng năm bấm được (::cong-cu{ten="circle"}, như mountCircle của circle.js cũ): 24 ô hình quạt, vòng ngoài giọng
 * trưởng, vòng trong giọng thứ song song; giữa vòng là giọng đang chọn. Mỗi ô có data-giong (chủ âm của giọng trưởng ở vị
 * trí ấy) và data-thu (ô giọng thứ). src/scripts/vong-quang-nam.js thêm phần bấm được (nhóm lựa chọn, phím mũi tên).
 */
export function veVongChon(chon = { giong: 'C', thu: false }) {
	const o = [];
	VONG.forEach((ten, i) => {
		for (const thu of [false, true]) {
			const a = goc(i * 30);
			const r = thu ? (VONG_TRONG[0] + VONG_TRONG[1]) / 2 : (VONG_NGOAI[0] + VONG_NGOAI[1]) / 2;
			const nhan = tenO(ten, thu);
			const dangChon = chon.giong === ten[0] && chon.thu === thu;
			o.push(
				`<g class="oz-vong-o${thu ? ' oz-vong-o--thu' : ''}${dangChon ? ' chon' : ''}" data-giong="${ten[0]}"${thu ? ' data-thu' : ''} data-ten="${esc(tenGiong(ten[0], thu))}">` +
					`<path d="${quat(i, thu ? VONG_TRONG : VONG_NGOAI)}"/>` +
					`<text x="${so(VONG_C + r * Math.cos(a))}" y="${so(VONG_C + r * Math.sin(a) + 5)}"${nhan.length > 3 ? ' class="oz-vong-dai"' : ''}>${esc(nhan)}</text></g>`,
			);
		}
	});
	return (
		`<svg class="oz-vong-hinh" viewBox="0 0 320 320" role="img" aria-label="Vòng quãng năm: vòng ngoài là giọng trưởng, vòng trong là giọng thứ song song">` +
		`${o.join('')}<circle class="oz-vong-giua" cx="${VONG_C}" cy="${VONG_C}" r="${VONG_TRONG[0] - 2}"/>` +
		`<text class="oz-vong-giua-chu" x="${VONG_C}" y="${VONG_C + 5}">${esc(chuGiua(chon))}</text></svg>`
	);
}

/** Tên đầy đủ của giọng ở một ô: "Sol trưởng", "Mi thứ". */
export function tenGiong(chuAm, thu) {
	const k = giongTheoChuAm(chuAm);
	return thu ? `${tenVietCua(k.thu)} thứ` : `${tenVietCua(k.chu_am)} trưởng`;
}
/** Chữ giữa vòng: tên giọng đang chọn, viết chữ cái ("G", "e"). */
export const chuGiua = ({ giong, thu }) => (thu ? chuThuong(giongTheoChuAm(giong).thu) : tenChuCua(giong));

const BAC_LA_MA = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const LOAI_BAC = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];

/**
 * Phần thông tin của giọng đang chọn trên vòng quãng năm bấm được (như select() của circle.js cũ): tên, hóa biểu (hình và
 * chữ), các nốt của gam, hợp âm các bậc (giọng trưởng), giọng song song, giọng đồng âm khác tên ở cùng vị trí, nút nghe.
 */
export function thongTinGiong({ giong, thu }) {
	const k = giongTheoChuAm(giong);
	const chuAm = thu ? k.thu : k.chu_am;
	const notGam = gam(`${chuAm}4`, thu ? 'natural' : 'major');
	const tieuDe = thu ? `Giọng ${tenVietCua(k.thu)} thứ (${tenChuCua(k.thu)} minor)` : `Giọng ${tenVietCua(k.chu_am)} trưởng (${tenChuCua(k.chu_am)} major)`;
	const p = [
		`<p class="oz-vong-ten"><strong>${esc(tieuDe)}</strong></p>`,
		`<div class="oz-vong-hb">${veHoaBieu(k.n, { nhan: `Hóa biểu ${chuHoaBieu(k.n)}` })}</div>`,
		`<p><strong>Hóa biểu:</strong> ${esc(chuHoaBieu(k.n))}.</p>`,
		`<p><strong>Các nốt:</strong> ${notGam.map(tenViet).join('\u00a0– ')}</p>`,
	];
	if (!thu)
		p.push(
			`<p><strong>Hợp âm các bậc:</strong> ${notGam
				.slice(0, 7)
				.map((n, i) => `${BAC_LA_MA[i]}\u00a0=\u00a0${tenChu(n)}${HOP_AM[LOAI_BAC[i]].ky_hieu}`)
				.join(', ')}</p>`,
		);
	p.push(`<p>${thu ? `Giọng trưởng song song: ${tenVietCua(k.chu_am)} trưởng.` : `Giọng thứ song song: ${tenVietCua(k.thu)} thứ.`}</p>`);
	const viTri = VONG.find((v) => v[0] === k.chu_am);
	if (!thu && viTri?.length > 1) {
		const khac = giongTheoChuAm(viTri[1]);
		p.push(`<p>Cùng vị trí trên vòng: ${tenVietCua(khac.chu_am)} trưởng (${esc(chuHoaBieu(khac.n))}), đồng âm khác tên.</p>`);
	}
	p.push(
		`<div class="oz-row"><button type="button" class="oz-btn oz-btn--primary" data-k="gam">Nghe gam</button>` +
			(thu ? '' : `<button type="button" class="oz-btn" data-k="hop-am">Nghe I – IV – V – I</button>`) +
			`</div>`,
	);
	return p.join('');
}

/**
 * Vòng chức năng hòa âm (::hinh{ten="functions"}, bài 12; như vùng <!-- fig:functions --> cũ): ba ô Chủ, Hạ át, Át và
 * ba mũi tên rời nhà, chuẩn bị, về nhà. Chỉ dựng lúc build. Màu ô theo lớp (src/styles/thanh-phan.css), chữ trong ô
 * luôn tối vì nền ô sáng ở cả hai chế độ.
 */
export function veChucNang() {
	const o = [
		['oz-cn-chu', 130, 10, 'CHỦ', 'I · vi'],
		['oz-cn-ha-at', 250, 120, 'HẠ ÁT', 'IV · ii'],
		['oz-cn-at', 10, 120, 'ÁT', 'V · V7 · vii°'],
	];
	const ten = (x, y, s, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="oz-cn-mui-chu">${s}</text>`;
	const mui = [
		[215, 48, 275, 112, ten(268, 70, 'rời nhà', 'start')],
		[245, 155, 110, 155, ten(177, 172, 'chuẩn bị', 'middle')],
		[70, 112, 130, 48, ten(72, 70, 'về nhà', 'end')],
	].map(([x1, y1, x2, y2, chu]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="oz-cn-mui" marker-end="url(#oz-cn-dau)"/>${chu}`);
	const hop = o.map(
		([lop, x, y, a, b]) =>
			`<g class="${lop}"><rect x="${x}" y="${y}" width="80" height="40" rx="10"/>` +
			`<text x="${x + 40}" y="${y + 17}" font-weight="700">${a}</text><text x="${x + 40}" y="${y + 32}" class="oz-cn-phu">${b}</text></g>`,
	);
	return (
		`<svg class="oz-fig oz-chuc-nang" viewBox="0 0 340 182" role="img" ` +
		`aria-label="Vòng chức năng hòa âm: Chủ (I, vi) rời nhà sang Hạ át (IV, ii), chuẩn bị cho Át (V, V7, vii°), rồi về nhà ở Chủ">` +
		`<defs><marker id="oz-cn-dau" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">` +
		`<path d="M0 0L10 5L0 10z" class="oz-cn-dau"/></marker></defs>${mui.join('')}${hop.join('')}</svg>`
	);
}

/**
 * Bảy điệu thức trên phím trắng (::hinh{ten="modes"}, bài 16; như vùng <!-- fig:modes --> cũ): tám phím trắng Đô–Đô,
 * mỗi phím từ Đô đến Si tô một màu và ghi tên điệu thức bắt đầu ở đó, nhãn so le hai hàng cho khỏi chồng nhau.
 */
export const DIEU_THUC = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
export function veDieuThuc() {
	const w = 54;
	const p = [];
	for (let i = 0; i < 8; i++) {
		const x = 1 + i * w;
		p.push(
			`<rect x="${x}" y="1" width="${w}" height="100" rx="2" class="oz-dt-phim${i < 7 ? ` oz-dt-${i}` : ''}"/>` +
				`<text x="${x + w / 2}" y="92" class="oz-dt-not">${SOLFEGE[i % 7]}</text>`,
		);
	}
	// phím đen sau Đô, Rê, Fa, Sol, La
	for (const i of [0, 1, 3, 4, 5]) p.push(`<rect x="${1 + (i + 1) * w - 15}" y="1" width="30" height="60" rx="1.5" class="oz-dt-den"/>`);
	DIEU_THUC.forEach((ten, i) => {
		const x = 1 + i * w + w / 2;
		const y = i % 2 ? 124 : 110;
		p.push(`<line x1="${x}" y1="102" x2="${x}" y2="${y}" class="oz-dt-ke"/><text x="${x}" y="${y + 10}" class="oz-dt-ten">${ten}</text>`);
	});
	return (
		`<svg class="oz-fig oz-dieu-thuc" viewBox="0 0 434 142" role="img" ` +
		`aria-label="Bảy điệu thức trên phím trắng: ${DIEU_THUC.map((t, i) => `${t} ${i ? '' : 'bắt đầu '}từ ${SOLFEGE[i]}`).join(', ')}">${p.join('')}</svg>`
	);
}
