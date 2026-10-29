// Dòng thời gian các nhà soạn nhạc (D5-L1), dựng lúc build từ src/data/nha-soan-nhac.yml: biểu đồ vòng đời đầy đủ
// (::dong-thoi-gian, trang lich-su/dong-thoi-gian; thay timeline.js của site cũ, vẽ lúc chạy từ bảng chép tay), bảng dữ
// liệu của nó (::bang-nha-soan-nhac) và biểu đồ vòng đời từ 1650 (::hinh{ten="lifespans"}, thay hình tĩnh cũ của
// tools/figures.py). Năm sinh–mất, "khoảng" và thời kỳ luôn lấy từ dữ liệu, nên không lệch với trang nhà soạn nhạc.
// Module thuần, trả về chuỗi HTML (SVG không cần JavaScript); chữ là chữ thật, màu theo CSS của site (thanh-phan.css:
// .oz-dtg…), currentColor cho chữ, nên đúng ở chế độ tối, sáng và khi in.
// Bản ghi đưa vào là bản ghi người (ở trang đã khóa: bọc chiDaKhoa); module chỉ đọc ten, sinh, mat, khoang, thoi_ky, và
// cach_viet_khac khi trang chọn một cách viết khác của tên.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const so = (x) => (Math.round(x * 10) / 10).toFixed(1);

/**
 * Các thời kỳ: tên (như thoi_ky của dữ liệu), năm của dải nền trên dòng thời gian (như timeline.js cũ), màu (như PER của
 * tools/figures.py cũ; cùng màu với hình periods). Màu sáng, chữ trên nó luôn tối (#1b1b1b), đọc được ở cả hai chế độ.
 */
export const THOI_KY = [
	{ ten: 'Trung cổ', tu: 1050, den: 1400, mau: '#d9c9a3' },
	{ ten: 'Phục hưng', tu: 1400, den: 1600, mau: '#c7d9a3' },
	{ ten: 'Baroque', tu: 1600, den: 1750, mau: '#e0b45e' },
	{ ten: 'Cổ điển', tu: 1750, den: 1820, mau: '#7aa6d6' },
	{ ten: 'Lãng mạn', tu: 1820, den: 1900, mau: '#e98f7a' },
	{ ten: 'Thế kỷ 20', tu: 1900, den: 2000, mau: '#c9a0dc' },
	{ ten: 'Đương đại', tu: 2000, den: 2030, mau: '#9fd0d0' },
];
/** Màu của người không ghi thời kỳ, hay thời kỳ lạ (như figures.py cũ). */
export const MAU_KHAC = '#b0b0b0';
/** Màu theo thoi_ky; "Cổ điển/Lãng mạn" lấy thời kỳ đầu (như figures.py cũ). */
export const mauThoiKy = (thoiKy) => THOI_KY.find((t) => t.ten === String(thoiKy ?? '').split('/')[0].trim())?.mau ?? MAU_KHAC;

/**
 * Danh sách người của chỉ thị: "hildegard,bach:J. S. Bach,…" (id trong nha-soan-nhac.yml, thêm ":tên" để hiện một cách
 * viết khác của tên, phải là ten hay một cach_viet_khac của bản ghi). Trả về [{ id, ten? }].
 */
export function docDanhSach(chu) {
	const ds = String(chu ?? '')
		.split(',')
		.map((x) => x.trim())
		.filter(Boolean)
		.map((x) => {
			const i = x.indexOf(':');
			return i < 0 ? { id: x } : { id: x.slice(0, i).trim(), ten: x.slice(i + 1).trim() };
		});
	if (!ds.length) throw new Error('danh sách nguoi rỗng, ví dụ nguoi="hildegard,bach:J. S. Bach"');
	const trung = ds.map((x) => x.id).filter((id, i, a) => a.indexOf(id) !== i);
	if (trung.length) throw new Error(`nguoi có id trùng: ${[...new Set(trung)].join(', ')}`);
	return ds;
}

/**
 * Người của danh sách, từ bản ghi (`nguoi`: Map id -> bản ghi): { id, ten, sinh, mat (null: còn sống), khoang, thoiKy }.
 * Id lạ, bản ghi chưa có năm sinh hay có hai năm chưa chọn (mau_thuan), tên hiện không phải cách viết của bản ghi thì ném lỗi.
 */
export function chonNguoi(ds, nguoi) {
	return ds.map(({ id, ten }) => {
		const r = nguoi.get(id);
		if (!r) throw new Error(`không có nhà soạn nhạc id "${id}" trong src/data/nha-soan-nhac.yml`);
		if ('mau_thuan' in r) throw new Error(`${id}: bản ghi còn mau_thuan (hai năm sinh–mất chưa chọn)`);
		const sinh = r.sinh;
		if (typeof sinh !== 'number') throw new Error(`${id}: bản ghi chưa có năm sinh`);
		const tenGoc = r.ten;
		if (ten !== undefined && ten !== tenGoc && !(r.cach_viet_khac ?? []).includes(ten))
			throw new Error(`${id}: "${ten}" không phải ten hay cach_viet_khac của bản ghi (ten: ${tenGoc})`);
		return { id, ten: ten ?? tenGoc, sinh, mat: r.mat ?? null, khoang: r.khoang === true, thoiKy: r.thoi_ky ?? '' };
	});
}

/** Năm của một người như trong chữ trang: "1685–1750", "khoảng 1300–1377", "sinh 1935" (gon: "~1300–1377"). */
export function namCua(p, { gon = false } = {}) {
	if (p.mat === null) return `sinh ${p.khoang ? (gon ? '~' : 'khoảng ') : ''}${p.sinh}`;
	return `${p.khoang ? (gon ? '~' : 'khoảng ') : ''}${p.sinh}–${p.mat}`;
}

/** Chữ khi di chuột hay đọc: "Tên (sinh–mất), thời kỳ". */
export const tieuDeNguoi = (p) => `${p.ten} (${namCua(p)})${p.thoiKy ? `, ${p.thoiKy}` : ''}`;

/** Xếp theo năm sinh; cùng năm sinh thì giữ thứ tự của danh sách (Bach trước Handel, như bảng). */
const theoNamSinh = (ds) => ds.map((p, i) => [p, i]).sort((a, b) => a[0].sinh - b[0].sinh || a[1] - b[1]).map(([p]) => p);

/**
 * Dòng thời gian đầy đủ (::dong-thoi-gian): mỗi người một thanh từ năm sinh tới năm mất (còn sống: tới `namNay`, màu
 * khác), xếp theo năm sinh; dải nền các thời kỳ; tên và năm cạnh thanh (đọc được cả khi chạm, không cần chú giải nổi);
 * <title> "Tên (sinh–mất), thời kỳ" cho di chuột. SVG rộng: khung cuộn ngang ở màn hình hẹp (thanh-phan.css).
 */
export function veDongThoiGian(nguoi, { namNay = new Date().getFullYear() } = {}) {
	const ds = theoNamSinh(nguoi);
	const tu = 1080;
	const den = Math.max(2030, Math.ceil((namNay + 4) / 10) * 10);
	const [W, HANG, TREN, TRAI, PHAI] = [1000, 19, 38, 8, 8];
	const H = TREN + ds.length * HANG + 12;
	const x = (y) => TRAI + ((y - tu) / (den - tu)) * (W - TRAI - PHAI);
	const b = [];
	for (const t of THOI_KY) {
		const [x1, x2] = [Math.max(0, x(t.tu)), Math.min(W, x(Math.min(t.den, den)))];
		b.push(`<rect class="oz-dtg-dai" x="${so(x1)}" y="0" width="${so(x2 - x1)}" height="${H}" fill="${t.mau}"/>`);
		// tên thời kỳ giữa dải; dải hẹp ở mép phải (Đương đại) thì lùi vào cho khỏi bị cắt (chữ 11,5: khoảng 6,5 đơn vị một ký tự)
		const giua = Math.min((x1 + x2) / 2, W - 4 - (t.ten.length * 6.5) / 2);
		b.push(`<text class="oz-dtg-thoi-ky" x="${so(giua)}" y="15" text-anchor="middle">${esc(t.ten)}</text>`);
	}
	for (let y = 1100; y <= den - 30; y += 100) {
		b.push(`<line class="oz-dtg-luoi" x1="${so(x(y))}" y1="${TREN - 4}" x2="${so(x(y))}" y2="${H - 4}"/>`);
		b.push(`<text class="oz-dtg-nam" x="${so(x(y))}" y="${TREN - 8}" text-anchor="middle">${y}</text>`);
	}
	ds.forEach((p, i) => {
		const y = TREN + i * HANG;
		const cuoi = p.mat ?? namNay;
		const nhan = `${p.ten} (${namCua(p, { gon: true })})`;
		// chữ cỡ 10,5: khoảng 5,6 đơn vị mỗi ký tự; không đủ chỗ bên phải thì đặt bên trái thanh
		const phai = x(cuoi) + 5 + nhan.length * 5.6 <= W - 2;
		b.push(
			`<g class="oz-dtg-hang${p.mat === null ? ' oz-dtg-con-song' : ''}"><title>${esc(tieuDeNguoi(p))}</title>` +
				`<rect class="oz-dtg-thanh" x="${so(x(p.sinh))}" y="${y + 3}" width="${so(Math.max(3, x(cuoi) - x(p.sinh)))}" height="${HANG - 7}" rx="3"/>` +
				`<text class="oz-dtg-ten" x="${so(phai ? x(cuoi) + 5 : x(p.sinh) - 5)}" y="${y + HANG - 6}"${phai ? '' : ' text-anchor="end"'}>${esc(nhan)}</text></g>`,
		);
	});
	const songs = ds.filter((p) => p.mat === null).length;
	const nhan =
		`Dòng thời gian ${ds.length} nhà soạn nhạc, xếp theo năm sinh, từ ${ds[0].ten} (${namCua(ds[0])}) đến ${ds.at(-1).ten} (${namCua(ds.at(-1))})` +
		(songs ? `; ${songs} người còn sống` : '') +
		'. Năm sinh, năm mất của từng người có trong bảng "Dữ liệu biểu đồ".';
	return (
		`<figure class="oz-figure oz-dtg not-content" data-sinh data-pagefind-ignore>` +
		`<div class="oz-dtg-khung" tabindex="0" role="region" aria-label="Dòng thời gian (cuộn ngang để xem hết)">` +
		`<svg class="oz-dtg-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(nhan)}">${b.join('')}</svg></div></figure>`
	);
}

/** Người trên biểu đồ vòng đời từ 1650 (hình lifespans cũ: người trong bảng của trang dòng thời gian mất sau 1660). */
export const NGUOI_VONG_DOI =
	'strozzi,purcell,vivaldi,bach:J. S. Bach,handel:G. F. Handel,haydn,mozart:W. A. Mozart,beethoven:L. van Beethoven,schubert,' +
	'fanny-mendelssohn,mendelssohn,chopin,schumann,liszt,wagner,verdi,clara-schumann,brahms,bizet,tchaikovsky:P. I. Tchaikovsky,' +
	'dvorak,grieg,puccini,elgar,mahler,debussy,sibelius,rachmaninoff,ravel,bartok,stravinsky,price,prokofiev,lili-boulanger,' +
	'shostakovich,messiaen,gubaidulina,britten,hoang-viet,part,reich,glass,adams,saariaho,shaw';

/**
 * Biểu đồ vòng đời từ năm `tu` (::hinh{ten="lifespans"}; như lifespans_svg của tools/figures.py cũ): tên bên trái trục,
 * thanh tô màu theo thời kỳ, người sinh trước `tu` có mũi tên chỉ năm sinh; còn sống: thanh tới `namNay`. Hình gọn cho
 * trang nhà soạn nhạc và khi in.
 */
export function veVongDoi(nguoi, { tu = 1650, namNay = new Date().getFullYear() } = {}) {
	const den = Math.max(2030, Math.ceil((namNay + 4) / 10) * 10);
	const [L, W, RH] = [150, 680, 11];
	const ds = nguoi
		.map((p) => ({ ...p, cuoi: p.mat ?? namNay }))
		.filter((p) => p.cuoi > tu + 10)
		.sort((a, b) => a.sinh - b.sinh || a.cuoi - b.cuoi || (a.ten < b.ten ? -1 : a.ten > b.ten ? 1 : 0));
	const x = (y) => L + ((y - tu) / (den - tu)) * (W - L - 10);
	const H = 30 + ds.length * RH + 10;
	const t = (xx, yy, s, size, anchor, fill = 'currentColor', op = '') =>
		`<text x="${so(xx)}" y="${so(yy)}" font-size="${size}" text-anchor="${anchor}" font-weight="400" fill="${fill}"${op ? ` fill-opacity="${op}"` : ''}>${esc(s)}</text>`;
	const b = [];
	for (let y = tu; y <= den; y += 50) {
		b.push(`<line x1="${so(x(y))}" y1="16" x2="${so(x(y))}" y2="${H - 6}" stroke="currentColor" stroke-opacity=".15"/>`);
		b.push(t(x(y), 12, String(y), 8, 'middle', 'currentColor', '0.7'));
	}
	ds.forEach((p, i) => {
		const yy = 22 + i * RH;
		const a2 = Math.max(p.sinh, tu);
		b.push(`<g><title>${esc(tieuDeNguoi(p))}</title>`);
		b.push(t(L - 6, yy + 8, p.ten, 8, 'end'));
		b.push(`<rect x="${so(x(a2))}" y="${yy + 1}" width="${so(x(p.cuoi) - x(a2))}" height="${RH - 3}" rx="2" fill="${mauThoiKy(p.thoiKy)}"/>`);
		if (p.sinh < tu) b.push(t(x(tu) + 2, yy + 8, `← ${p.khoang ? '~' : ''}${p.sinh}`, 6.5, 'start', '#1b1b1b'));
		b.push('</g>');
	});
	return (
		`<figure class="oz-figure not-content" data-sinh><svg class="oz-fig oz-fig-wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ vòng đời các nhà soạn nhạc từ năm ${tu} đến nay, tô màu theo thời kỳ; nhà soạn nhạc sinh trước ${tu} có mũi tên chỉ năm sinh">` +
		b.join('') +
		`</svg><figcaption>Vòng đời các nhà soạn nhạc từ năm ${tu} (thanh kéo dài đến nay: còn sống), màu theo thời kỳ. Các nhà soạn nhạc trước đó (Hildegard, Machaut, Josquin, Palestrina, Monteverdi…) xem ở bảng dòng thời gian và trang các thời kỳ.</figcaption></figure>`
	);
}

/** Bảng "Nhà soạn nhạc | Sinh | Mất | Thời kỳ" (Markdown) theo thứ tự của danh sách; năm sinh khoảng ghi "~"; còn sống: ô Mất trống. */
export function bangMarkdown(nguoi) {
	const o = (s) => String(s ?? '').replace(/\|/g, '\\|');
	return [
		'| Nhà soạn nhạc | Sinh | Mất | Thời kỳ |',
		'|---|---|---|---|',
		...nguoi.map((p) => `| ${o(p.ten)} | ${p.khoang ? '~' : ''}${p.sinh} | ${p.mat ?? ''} | ${o(p.thoiKy)} |`),
	].join('\n');
}

// ---------- Năm sinh–mất viết trong chữ trang ----------

const thoat = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Chỗ chữ `chu` ghi năm cạnh tên một người có năm trong dữ liệu ("Tên (1567–1643)", "**Tên** (khoảng 1300–1377)",
 * "Tên (c. 1300–1377)", "Tên (~1300–1377)", "Tên (sinh 1935)", "Tên (1935–)") mà lệch dữ liệu: năm khác, có hay thiếu
 * "khoảng", ghi còn sống mà dữ liệu có năm mất hay ngược lại. Tên là ten hay cach_viet_khac. Trả về
 * [{ dong, viTri, chu, id, duLieu }] theo thứ tự trong chữ (dong đếm từ 1).
 * @param {object[]} banGhi bản ghi nha-soan-nhac (đủ trường)
 */
export function namLechTrongChu(chu, banGhi) {
	const lech = [];
	const dongCua = (i) => chu.slice(0, i).split('\n').length;
	for (const r of banGhi) {
		if (typeof r.sinh !== 'number') continue;
		for (const ten of [r.ten, ...(r.cach_viet_khac ?? [])]) {
			const re = new RegExp(
				`(?<![\\p{L}.])${thoat(ten)}(?![\\p{L}])\\**\\s+\\((?:(khoảng|c\\.|ca\\.|~)\\s*)?(?:sinh\\s+(\\d{3,4})|(\\d{3,4})\\s*[–-]\\s*(\\d{3,4})?)\\)`,
				'gu',
			);
			for (const m of chu.matchAll(re)) {
				const khoang = !!m[1];
				const sinh = Number(m[2] ?? m[3]);
				const mat = m[4] ? Number(m[4]) : null;
				const dung = sinh === r.sinh && mat === (r.mat ?? null) && khoang === (r.khoang === true);
				if (!dung)
					lech.push({
						dong: dongCua(m.index),
						viTri: m.index,
						chu: m[0],
						id: r.id,
						duLieu: `${r.khoang ? 'khoảng ' : ''}${r.sinh}–${r.mat ?? ''}`,
					});
			}
		}
	}
	return lech.sort((a, b) => a.viTri - b.viTri);
}
