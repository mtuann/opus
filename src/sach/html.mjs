// Cây HTML tối giản cho sách in (src/sach/sach.mjs): đọc HTML đã dựng của trang trong dist/ (do chính site sinh ra, nên
// đúng cú pháp), bỏ hay sửa vài phần tử, rồi ghi lại. Không phải bộ đọc HTML đầy đủ: không tự đóng thẻ như trình duyệt
// (<p> gặp <div>…), chỉ hiểu thẻ rỗng, thẻ tự đóng (SVG), chú thích, và nội dung thô của <script>, <style>.

/** Thẻ rỗng của HTML: không có thẻ đóng. */
const RONG = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
/** Thẻ có nội dung thô (không đọc thẻ bên trong). */
const THO = new Set(['script', 'style']);

const RE_THE = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;

/** Đọc thuộc tính từ chuỗi thuộc tính thô của thẻ. */
export function docThuocTinh(tho) {
	const tt = {};
	for (const a of tho.matchAll(/([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) tt[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
	return tt;
}

/**
 * Đọc HTML thành cây: nút chữ { chu }, nút phần tử { ten, tho (chuỗi thuộc tính thô), tt (thuộc tính), con }.
 * Thẻ đóng không khớp thẻ đang mở thì đóng tới thẻ cùng tên gần nhất (HTML đúng thì không xảy ra).
 */
export function docCay(html) {
	const goc = { ten: '#goc', tho: '', tt: {}, con: [] };
	const chong = [goc];
	let i = 0;
	const chu = (s) => s && chong.at(-1).con.push({ chu: s });
	RE_THE.lastIndex = 0;
	for (let m; (m = RE_THE.exec(html)); ) {
		chu(html.slice(i, m.index));
		i = RE_THE.lastIndex;
		if (!m[2]) {
			chu(m[0]); // chú thích: giữ nguyên
			continue;
		}
		const ten = m[2].toLowerCase();
		if (m[1]) {
			const k = chong.map((n) => n.ten).lastIndexOf(ten);
			if (k > 0) chong.length = k;
			continue;
		}
		const nut = { ten, tho: m[3], tt: docThuocTinh(m[3]), con: [] };
		chong.at(-1).con.push(nut);
		if (THO.has(ten)) {
			const het = html.indexOf(`</${ten}`, i);
			const cuoi = het < 0 ? html.length : het;
			nut.con.push({ chu: html.slice(i, cuoi) });
			i = het < 0 ? html.length : html.indexOf('>', het) + 1;
			RE_THE.lastIndex = i;
			continue;
		}
		if (m[4] || RONG.has(ten)) {
			nut.tuDong = !!m[4];
			nut.rong = true;
			continue;
		}
		chong.push(nut);
	}
	chu(html.slice(i));
	return goc;
}

/** Ghi cây (hay một nút) thành HTML. */
export function ghi(nut) {
	if ('chu' in nut) return nut.chu;
	const trong = nut.con.map(ghi).join('');
	if (nut.ten === '#goc') return trong;
	if (nut.rong) return `<${nut.ten}${nut.tho}${nut.tuDong ? '/' : ''}>`;
	return `<${nut.ten}${nut.tho}>${trong}</${nut.ten}>`;
}

/** Lớp của phần tử. */
export const lop = (nut) => (nut.tt?.class ?? '').split(/\s+/).filter(Boolean);

/** Phần tử đầu tiên (theo thứ tự trong trang) khớp `dk`, hay undefined. */
export function tim(nut, dk) {
	for (const c of nut.con ?? []) {
		if (!('chu' in c) && dk(c)) return c;
		const t = 'chu' in c ? undefined : tim(c, dk);
		if (t) return t;
	}
	return undefined;
}

/** Mọi phần tử khớp `dk`. */
export function timHet(nut, dk, ra = []) {
	for (const c of nut.con ?? []) {
		if ('chu' in c) continue;
		if (dk(c)) ra.push(c);
		timHet(c, dk, ra);
	}
	return ra;
}

/** Chữ của một nút (bỏ thẻ; chưa giải mã thực thể). */
export const chuCua = (nut) => ('chu' in nut ? nut.chu : nut.ten === 'script' || nut.ten === 'style' ? '' : nut.con.map(chuCua).join(''));

/** Duyệt cây, đổi danh sách con của từng phần tử bằng `f(con, cha)` (từ dưới lên). */
export function doiCon(nut, f) {
	if ('chu' in nut) return;
	for (const c of nut.con) doiCon(c, f);
	nut.con = f(nut.con, nut);
}
