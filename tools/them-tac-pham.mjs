#!/usr/bin/env node
// Tạo khung cho một tác phẩm mới (D6-0; plans/ben-vung/them-tac-pham.md mục 2), sau khi ứng viên đã được duyệt:
//   node tools/them-tac-pham.mjs <slug> --loai bai-hoc|nghe --tac-gia <id> --ten "<tên>" [--chang <1–7> --grade "Grade 3"]
//        [--danh-muc "Op. 12 số 1"] [--thoi-ky "Lãng mạn"] [--cap <trang cùng tác phẩm>] [--ngay <yyyy-mm-dd>]
//        [--khuyet-danh] [--goc <thư mục repo>]
// Bài học (--loai bai-hoc) cần --chang và --grade. Tác giả phải có trong src/data/nha-soan-nhac.yml (chưa có thì thêm bản
// ghi ở đó trước, kèm hồ sơ kiểm định); tác phẩm khuyết danh: --khuyet-danh thay cho --tac-gia.
// Làm:
//   1. thêm một bản ghi ở cuối src/data/tac-pham.yml: trường như bản ghi cùng loại đã có (chip, thong_tin, hinh khung,
//      them_ngay), chỗ cần điền ghi "[[điền: …]]"; ban_thu không có (tools/audio/attach.py ghi);
//   2. thêm một dòng tầng tac-pham vào src/data/trang.yml (dữ liệu bắt trang chính của bản ghi phải có tầng tac-pham);
//   3. tạo trang src/content/docs/piano/tac-pham/<slug>.md hay nghe-nhac/<slug>.md theo mẫu của AGENTS.md (mục "Mẫu trang"),
//      đủ các mục bắt buộc;
//   4. tạo hồ sơ kiểm định mẫu của trang và của bản ghi (node tools/khoa.mjs mau).
// Dữ liệu sau khi thêm phải qua schema và kiểm chéo (src/du-lieu.mjs); không qua thì trả lại các file như cũ.
// Chỗ "[[điền: …]]" còn sót thì tests/tac-pham.test.mjs hỏng: điền hết (hay bỏ trường không dùng) trước khi gộp.
// Viết bằng Node, không Python như kế hoạch ghi lúc đầu (tools/them_tac_pham.py): dùng chung schema và kiểm chéo của
// src/du-lieu.mjs, lệnh mau của tools/khoa.mjs và gói yaml (giữ chú thích, kiểu viết của file) với bản build.
import fs from 'node:fs';
import path from 'node:path';
import { parse, parseDocument, isSeq, isScalar, visit } from 'yaml';
import { kiemTra } from '../src/du-lieu.mjs';
import { GOC } from '../src/khoa.mjs';
import { lenh as lenhKhoa } from './khoa.mjs';

/** Dấu chỗ cần điền trong bản ghi và trang khung. */
export const DIEN = '[[điền:';
/** Chỗ cần điền; gợi ý không chứa dấu ngoặc vuông, để tìm và thay được bằng một biểu thức. */
const d = (goi_y) => `${DIEN} ${goi_y}]]`;

/** Mục của trang theo loại (AGENTS.md, "Mẫu trang"; thứ tự như mọi trang của site cũ). */
export const MUC = {
	'bai-hoc': ['Vì sao nên học bài này', 'Bối cảnh', 'Nghe trước khi tập', 'Theo dõi khi nghe', 'Cấu trúc', 'Chỗ khó và cách tập', 'Bài tập chuẩn bị', 'Kế hoạch tập', 'Diễn tấu', 'Lỗi thường gặp', 'Học tiếp', 'Kiểm tra nhanh', 'Nguồn'],
	nghe: ['Điều cần biết trước khi nghe', 'Sơ đồ cấu trúc', 'Nghe kèm bản thu', 'Theo dõi khi nghe', 'Câu hỏi để nghe chủ động', 'So sánh bản thu', 'Nếu bạn muốn chơi', 'Ghi chép của bạn', 'Nguồn'],
};

export const trangChinh = (slug, loai) => (loai === 'bai-hoc' ? 'piano/tac-pham/' : 'nghe-nhac/') + slug;

const homNay = () => {
	const n = new Date();
	return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
};

/** "Ludwig van Beethoven (1770–1827)" theo nha-soan-nhac.yml (như dòng Nhà soạn nhạc của các bản ghi đã có). */
function tenNam(p) {
	if (!p) return 'Khuyết danh';
	if (p.sinh === undefined) return `${p.ten} ${d('năm sinh–mất')}`;
	const k = p.khoang ? 'khoảng ' : '';
	return p.mat === null ? `${p.ten} (sinh ${k}${p.sinh})` : `${p.ten} (${k}${p.sinh}–${p.mat})`;
}

/** Bản ghi khung (thứ tự trường như schema của src/du-lieu.mjs). */
export function banGhiKhung(o, nguoi) {
	const p = o.tacGia ? nguoi.get(o.tacGia) : null;
	const r = { slug: o.slug, loai: o.loai };
	if (o.khuyetDanh) r.khuyet_danh = true;
	else r.tac_gia = o.tacGia;
	r.ten = o.ten;
	r.danh_muc = o.danhMuc ?? d('số danh mục, như Op. 12 số 1; không có thì bỏ trường này');
	if (o.loai === 'bai-hoc') {
		r.giong = d('giọng, như Đô trưởng');
		r.nhip = d('nhịp, như 3/4');
	}
	r.thoi_ky = o.thoiKy ?? p?.thoi_ky ?? d('thời kỳ');
	if (o.loai === 'bai-hoc') {
		r.chang = o.chang;
		r.grade = o.grade;
		r.ky_nang_chinh = d('kỹ năng chính, một dòng');
	} else r.luyen_nghe = d('luyện nghe gì, một dòng');
	r.doi_chieu = d('nguồn đối chiếu trích đoạn: Mutopia, kern… hay chép tay từ bản in (ghi ấn bản); không có trích đoạn thì bỏ trường này');
	if (o.cap) r.cap = o.cap;
	if (o.loai === 'bai-hoc') {
		r.goi_y = false;
		r.chip = [d('giọng · nhịp'), d('đặc điểm'), { cap_do: `≈ ${o.grade}` }, d('hình thức, số ô nhịp')];
		r.thong_tin = [
			['Nhà soạn nhạc', tenNam(p)],
			['Tác phẩm', d('tên đầy đủ, số danh mục')],
			['Sáng tác / xuất bản', d('năm, nơi, nguồn')],
			['Giọng · nhịp · tốc độ', d('giọng · nhịp · tốc độ')],
			['Hình thức', d('hình thức, các đoạn')],
			['Độ khó', d(`Khoảng ABRSM ${o.grade} (ước lượng hay theo chương trình thi nào)`)],
			['Kỹ năng chính', d('kỹ năng chính')],
			['Bản nhạc', d('IMSLP kèm gợi ý tìm, bản Urtext nên dùng')],
		];
	}
	r.hinh = { [o.loai]: [{ chu_thich: d('một câu về sơ đồ các đoạn'), doan: [[d('Đoạn A'), d('ô 1–8 · giọng'), 8, 'a']] }] };
	r.them_ngay = o.ngay ?? homNay();
	return r;
}

/** Trang khung theo mẫu của AGENTS.md ("Mẫu trang"). */
export function trangKhung(r, nguoi) {
	const p = r.tac_gia ? nguoi.get(r.tac_gia) : null;
	const ho = p ? p.ten.split(' ').at(-1) : d('Nhà soạn nhạc');
	const dau = ['---', `title: "${ho}: ${r.ten.replace(/"/g, '\\"')}"`, `description: "${d('một câu tóm tắt cho máy tìm kiếm và khi chia sẻ link')}"`, `tac_pham: ${r.slug}`, '---', ''];
	const bang = ['| Thời điểm | Sự kiện |', '|---|---|', `| … | **${d('Tên đoạn')}** (${d('ô 1–8')}): ${d('điều tai nghe thấy')} |`];
	const dongTheoDoi = 'Dán link một bản thu vào khung phía trên (hoặc chọn một file trên máy), rồi bấm ghi mốc khi bạn nghe thấy từng sự kiện.';
	const quiz = ['```quiz', `? ${d('câu hỏi về chính trang này')}`, `+ ${d('đáp án đúng')}`, `- ${d('đáp án sai')}`, `- ${d('đáp án sai')}`, `> ${d('giải thích, không dựa vào vị trí lựa chọn')}`, '```'];
	const nguon = [`- ${d('nguồn, mỗi nguồn một link Markdown tới trang nguồn')}`];
	let than;
	if (r.loai === 'bai-hoc')
		than = [
			d('Một hai câu mở đầu.'),
			'',
			'::hop-tac-pham',
			'',
			'## Vì sao nên học bài này',
			'',
			`- **${d('Cụm in đậm.')}** ${d('3–5 gạch đầu dòng')}`,
			'',
			'## Bối cảnh',
			'',
			d('bối cảnh sáng tác, có nguồn'),
			'',
			'## Nghe trước khi tập',
			'',
			d('3–4 câu hỏi để nghe; vài nghệ sĩ thật sự gắn với tác phẩm'),
			'',
			'::khoi-nghe',
			'',
			'## Theo dõi khi nghe',
			'',
			dongTheoDoi,
			'',
			...bang,
			'',
			'## Cấu trúc',
			'',
			'::hinh-cau-truc',
			'',
			'| Đoạn | Ô nhịp | Nội dung | Điều cần chú ý |',
			'|---|---|---|---|',
			`| ${d('A')} | ${d('1–8')} | ${d('nội dung')} | ${d('điều cần chú ý')} |`,
			'',
			'## Chỗ khó và cách tập',
			'',
			'| Chỗ khó | Vì sao khó | Cách tập |',
			'|---|---|---|',
			`| ${d('ít nhất 5 dòng')} | ${d('vì sao')} | ${d('cách tập')} |`,
			'',
			'## Bài tập chuẩn bị',
			'',
			`### 1. ${d('tên bài tập')}`,
			'',
			d('2–3 bài tập, mỗi bài một khối abc soạn cho trang này (hai tay, có số ngón) và 1–3 câu cách dùng; thêm khối abc thì sửa khuong_nhac trong hồ sơ'),
			'',
			'## Kế hoạch tập',
			'',
			d('một câu dẫn: số tuần, phút mỗi ngày'),
			'',
			'| Tuần | Việc chính | Máy đếm nhịp |',
			'|---|---|---|',
			`| 1 | ${d('việc chính')} | ${d('♩ = 60')} |`,
			'',
			'## Diễn tấu',
			'',
			'### Tốc độ và nhịp',
			'',
			d('tốc độ, sắc thái, phát âm, bàn đạp, ấn bản: chọn mục phù hợp'),
			'',
			'## Lỗi thường gặp',
			'',
			`- ${d('lỗi và cách sửa')}`,
			'',
			'## Học tiếp',
			'',
			`- ${d('2–5 bài chọn lọc, mỗi bài một link Markdown tới trang có thật, như /opus/piano/gam/')}`,
			'',
			'::hoc-tiep',
			'',
			'## Kiểm tra nhanh',
			'',
			...quiz,
			'',
			'## Nguồn',
			'',
			...nguon,
		];
	else
		than = [
			'| Mục | Thông tin |',
			'|---|---|',
			`| Nhà soạn nhạc | ${tenNam(p)} |`,
			`| Tên đầy đủ | ${d('tên đầy đủ, số danh mục')} |`,
			`| Sáng tác | ${d('năm, nơi xuất bản')} |`,
			`| Thời kỳ | ${d('thời kỳ')} |`,
			`| Thể loại | ${d('thể loại')} |`,
			`| Độ dài | ${d('khoảng … phút')} |`,
			'',
			'## Điều cần biết trước khi nghe',
			'',
			`**${d('Cụm in đậm.')}** ${d('vài đoạn, nghe bằng tai người chơi đàn')}`,
			'',
			'## Sơ đồ cấu trúc',
			'',
			'::hinh-cau-truc',
			'',
			'## Nghe kèm bản thu',
			'',
			d('một câu giới thiệu bản thu (tools/audio/attach.py ghi bản thu vào bản ghi; không có bản thu hợp lệ thì khối để người học tự dán link)'),
			'',
			'::khoi-nghe',
			'',
			'## Theo dõi khi nghe',
			'',
			dongTheoDoi,
			'',
			...bang,
			'',
			'## Câu hỏi để nghe chủ động',
			'',
			`1. ${d('4–6 câu hỏi')}`,
			'',
			'## So sánh bản thu',
			'',
			`- ${d('2–4 nghệ sĩ, không bịa năm hay hãng')}`,
			'',
			'## Nếu bạn muốn chơi',
			'',
			d('cấp và chặng thật, link bài học'),
			'',
			'## Ghi chép của bạn',
			'',
			'*(Dùng [mẫu ghi chép](/opus/nghe-nhac/mau/) để điền cảm nhận.)*',
			'',
			'## Nguồn',
			'',
			...nguon,
		];
	return [...dau, ...than, ''].join('\n');
}

/** Mục bắt buộc của hướng dẫn nghe (cả 42 trang của site cũ đều có); mục khác của MUC.nghe có thể thiếu hay đổi tên. */
const MUC_BUOC_NGHE = ['Nghe kèm bản thu', 'Ghi chép của bạn', 'Nguồn'];
/** Trường bắt buộc của bản ghi theo loại (mọi bản ghi cùng loại của site cũ đều có); tac_gia hay khuyet_danh kiểm riêng. */
export const TRUONG_BUOC = {
	'bai-hoc': ['ten', 'thoi_ky', 'chang', 'grade', 'ky_nang_chinh', 'chip', 'thong_tin', 'hinh'],
	nghe: ['ten', 'thoi_ky', 'luyen_nghe'],
};
/** Dòng của bảng thông tin ở bài học (AGENTS.md cũ, "Mẫu trang"); "Sáng tác" thay cho "Sáng tác / xuất bản" cũng được. */
const DONG_THONG_TIN = ['Nhà soạn nhạc', 'Tác phẩm', 'Sáng tác / xuất bản', 'Giọng · nhịp · tốc độ', 'Hình thức', 'Độ khó', 'Kỹ năng chính', 'Bản nhạc'];

/**
 * Lỗi của một trang tác phẩm và bản ghi của nó (kiểm thử tac_pham, plans/ben-vung/them-tac-pham.md mục 4): mục bắt buộc
 * đúng thứ tự (AGENTS.md, "Mẫu trang"), chỉ thị đúng mục, bảng "Theo dõi khi nghe" có cột đầu "…", mục Nguồn có link,
 * bản ghi đủ trường, không còn chỗ "[[điền: …]]". Khuông nhạc, link, schema, giấy phép bản thu: các kiểm thử khác.
 * @param {{ trang: string, chu: string, rec: object }} o trang ("piano/tac-pham/x"), nguồn Markdown, bản ghi (chưa qua chiDaKhoa)
 */
export function loiTacPham({ trang, chu, rec }) {
	const loai = trang.startsWith('piano/tac-pham/') ? 'bai-hoc' : 'nghe';
	const loi = [];
	if (chu.includes(DIEN)) loi.push(`trang còn ${chu.split(DIEN).length - 1} chỗ "${DIEN} …]]"`);
	if (JSON.stringify(rec).includes(DIEN)) loi.push(`bản ghi còn chỗ "${DIEN} …]]"`);
	// mục (H2) và chỉ thị theo thứ tự trong trang; bỏ khối mã
	const dong = chu.replace(/^```[\s\S]*?^```/gm, '').split('\n');
	const muc = [];
	const chiThi = [];
	for (const l of dong) {
		const h = /^## (.+?)\s*(?:\{[^}]*\})?\s*$/.exec(l);
		if (h) muc.push(h[1]);
		const c = /^::([a-z-]+)/.exec(l);
		if (c) chiThi.push([c[1], muc.at(-1) ?? null]);
	}
	const chuan = MUC[loai];
	const biet = muc.filter((m) => chuan.includes(m));
	if (biet.some((m, i) => i && chuan.indexOf(m) < chuan.indexOf(biet[i - 1]))) loi.push(`mục không đúng thứ tự của mẫu: ${biet.join(' → ')}`);
	const buoc = loai === 'bai-hoc' ? chuan : MUC_BUOC_NGHE;
	const thieu = buoc.filter((m) => !muc.includes(m));
	if (thieu.length) loi.push(`thiếu mục: ${thieu.map((m) => `## ${m}`).join(', ')}`);
	const o = (ten) => chiThi.filter(([t]) => t === ten).map(([, m]) => m);
	const canO = (ten, noi) => {
		const ds = o(ten);
		if (ds.length !== 1) loi.push(`cần đúng một ::${ten}${noi !== undefined ? ` (trong ${noi === null ? 'phần mở đầu, trước mục đầu tiên' : `mục "${noi}"`})` : ''}, có ${ds.length}`);
		else if (noi !== undefined && ds[0] !== noi) loi.push(`::${ten} phải ở ${noi === null ? 'phần mở đầu, trước mục đầu tiên' : `mục "${noi}"`}, đang ở ${ds[0] === null ? 'phần mở đầu' : `mục "${ds[0]}"`}`);
	};
	if (loai === 'bai-hoc') {
		canO('hop-tac-pham', null);
		canO('khoi-nghe', 'Nghe trước khi tập');
		canO('hinh-cau-truc', 'Cấu trúc');
		canO('hoc-tiep', 'Học tiếp');
		const kt = chu.split(/^## Kiểm tra nhanh\s*$/m)[1]?.split(/^## /m)[0] ?? '';
		if (muc.includes('Kiểm tra nhanh') && !/^```quiz\s*$/m.test(kt)) loi.push('mục "Kiểm tra nhanh" cần khối ```quiz');
	} else {
		canO('khoi-nghe', 'Nghe kèm bản thu');
		if (rec.hinh?.nghe) canO('hinh-cau-truc');
		else if (o('hinh-cau-truc').length) loi.push('có ::hinh-cau-truc mà bản ghi không có hinh.nghe');
	}
	// bảng "Theo dõi khi nghe": cột đầu mỗi dòng là "…" (người học ghi mốc)
	const theoDoi = chu.split(/^## Theo dõi khi nghe\s*$/m)[1]?.split(/^## /m)[0];
	if (theoDoi !== undefined) {
		const hang = theoDoi.split('\n').filter((l) => l.startsWith('|')).slice(2);
		if (!hang.length) loi.push('mục "Theo dõi khi nghe" cần bảng | Thời điểm | Sự kiện |');
		const sai = hang.filter((l) => l.split('|')[1].trim() !== '…');
		if (sai.length) loi.push(`bảng "Theo dõi khi nghe": cột đầu phải là "…" (${sai.length} dòng khác)`);
	}
	const nguon = chu.split(/^## Nguồn\s*$/m)[1]?.split(/^## /m)[0];
	// link ra ngoài hay tới trang của site (trang tham chiếu ghi nguồn)
	if (nguon !== undefined && !/\]\((https?:\/\/|\/opus\/)|<https?:\/\//.test(nguon)) loi.push('mục "Nguồn" cần ít nhất một link');
	// bản ghi
	const r = rec ?? {};
	if (r.loai !== loai && trang !== r.cap) loi.push(`bản ghi ${r.slug} có loai ${r.loai}, trang là ${loai}`);
	if (r.loai === loai) {
		if (!r.tac_gia === !r.khuyet_danh) loi.push('bản ghi cần tac_gia hay khuyet_danh');
		const thieuTruong = TRUONG_BUOC[loai].filter((t) => r[t] === undefined || (t === 'hinh' && !r.hinh?.[loai]));
		if (thieuTruong.length) loi.push(`bản ghi ${r.slug} thiếu trường: ${thieuTruong.join(', ')}`);
		if (loai === 'bai-hoc' && r.thong_tin) {
			const ten = r.thong_tin.map(([m]) => (m === 'Sáng tác' ? 'Sáng tác / xuất bản' : m));
			if (JSON.stringify(ten) !== JSON.stringify(DONG_THONG_TIN)) loi.push(`thong_tin của ${r.slug} cần đúng các dòng: ${DONG_THONG_TIN.join(', ')}`);
		}
	}
	return loi;
}

/** Viết bản ghi theo kiểu của tac-pham.yml: danh sách toàn giá trị đơn (hàng bảng, đoạn) viết một dòng. */
function yamlBanGhi(r) {
	const doc = parseDocument('[]');
	doc.contents = doc.createNode([r]);
	visit(doc, {
		Seq(_, n) {
			if (n.items.every((x) => isScalar(x))) n.flow = true;
		},
	});
	return doc.toString({ lineWidth: 0, indentSeq: false, flowCollectionPadding: false, singleQuote: true });
}

/**
 * Thêm tác phẩm vào repo ở `goc`. Trả về danh sách file đã tạo hay đổi (đường dẫn từ gốc). Sai thì ném lỗi, không để lại
 * thay đổi nào.
 */
export function them(o, goc = GOC, in_ = console.log) {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(o.slug ?? '')) throw new Error('slug chỉ gồm a–z, 0–9 và dấu gạch ngang, ví dụ mozart-alla-turca');
	if (!['bai-hoc', 'nghe'].includes(o.loai)) throw new Error('--loai phải là bai-hoc hay nghe');
	if (!o.ten) throw new Error('thiếu --ten "<tên tác phẩm>"');
	if (!o.tacGia === !o.khuyetDanh) throw new Error('cần đúng một trong hai: --tac-gia <id>, --khuyet-danh');
	if (o.loai === 'bai-hoc' && (!o.chang || !o.grade)) throw new Error('bài học cần --chang <1–7> và --grade "Grade …" (theo khảo sát đã duyệt)');
	if (o.chang !== undefined && !(Number.isInteger(o.chang) && o.chang >= 1 && o.chang <= 7)) throw new Error('--chang là số từ 1 đến 7');
	if (o.ngay !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(o.ngay)) throw new Error('--ngay dạng yyyy-mm-dd');
	const f = {
		tacPham: path.join(goc, 'src/data/tac-pham.yml'),
		trangYml: path.join(goc, 'src/data/trang.yml'),
		nguoi: path.join(goc, 'src/data/nha-soan-nhac.yml'),
	};
	const tacPham = parse(fs.readFileSync(f.tacPham, 'utf8'));
	const nguoi = new Map(parse(fs.readFileSync(f.nguoi, 'utf8')).map((p) => [p.id, p]));
	const trang = trangChinh(o.slug, o.loai);
	const fTrang = path.join(goc, 'src/content/docs', `${trang}.md`);
	if (tacPham.some((r) => r.slug === o.slug)) throw new Error(`tac-pham.yml đã có bản ghi ${o.slug}`);
	if (fs.existsSync(fTrang)) throw new Error(`${path.relative(goc, fTrang)} đã có`);
	if (o.tacGia && !nguoi.has(o.tacGia))
		throw new Error(`nha-soan-nhac.yml chưa có "${o.tacGia}": thêm bản ghi tác giả trước (ten, sinh, mat, thoi_ky; có hồ sơ kiểm định), rồi chạy lại`);
	if (o.cap && !/^(piano\/tac-pham|nghe-nhac)\/[a-z0-9-]+$/.test(o.cap)) throw new Error('--cap là trang cùng tác phẩm, như nghe-nhac/mozart-k331');
	const trangYml = fs.readFileSync(f.trangYml, 'utf8');
	if (parse(trangYml).some((x) => x.id === trang)) throw new Error(`trang.yml đã có ${trang}`);

	const r = banGhiKhung(o, nguoi);
	const cu = { [f.tacPham]: fs.readFileSync(f.tacPham, 'utf8'), [f.trangYml]: trangYml };
	const noi = (chu, them) => chu.replace(/\n*$/, '\n') + them;
	const tao = [];
	try {
		fs.writeFileSync(f.tacPham, noi(cu[f.tacPham], yamlBanGhi(r)));
		fs.writeFileSync(f.trangYml, noi(trangYml, `- id: ${trang}\n  tang: tac-pham\n`));
		const { loi } = kiemTra(path.join(goc, 'src/data'));
		if (loi.length) throw new Error(`dữ liệu sau khi thêm không qua kiểm tra (src/du-lieu.mjs):\n- ${loi.join('\n- ')}`);
		fs.mkdirSync(path.dirname(fTrang), { recursive: true });
		fs.writeFileSync(fTrang, trangKhung(r, nguoi));
		tao.push(fTrang);
		for (const muc of [trang, `du-lieu/tac-pham/${o.slug}`]) {
			const hs = path.join(goc, 'kiem-dinh', `${muc}.yml`);
			if (fs.existsSync(hs)) throw new Error(`${path.relative(goc, hs)} đã có`);
			lenhKhoa(['mau', muc, '--goc', goc], goc, () => {});
			tao.push(hs);
		}
	} catch (e) {
		for (const [file, chu] of Object.entries(cu)) fs.writeFileSync(file, chu);
		for (const file of tao) fs.rmSync(file, { force: true });
		throw e;
	}
	const doi = [f.tacPham, f.trangYml, ...tao].map((x) => path.relative(goc, x));
	in_(`đã thêm ${o.slug} (${o.loai}):\n${doi.map((x) => `  ${x}`).join('\n')}`);
	in_(
		[
			'Tiếp theo (plans/ben-vung/them-tac-pham.md, mục 3–6):',
			`  - điền mọi chỗ "${DIEN} …]]" trong bản ghi và trang (hay bỏ trường không dùng: danh_muc, doi_chieu; hướng dẫn nghe không có sơ đồ thì bỏ hinh và ::hinh-cau-truc);`,
			`  - bản thu: python3 tools/audio/attach.py ${o.slug} … (tools/audio/README.md); mốc: --ref hay tools/audio/align/;`,
			'  - thêm khối abc thì sửa khuong_nhac trong hồ sơ của trang; ghi lượt 1 vào hồ sơ;',
			`  - npm run build:xem && npm test (tests/tac-pham.test.mjs kiểm trang và bản ghi).`,
		].join('\n'),
	);
	return doi;
}

function docThamSo(ts) {
	// slug là tham số đầu tiên
	const o = { slug: ts[0]?.startsWith('--') ? undefined : ts[0] };
	const lay = (ten) => {
		const i = ts.indexOf(ten);
		return i >= 0 ? ts[i + 1] : undefined;
	};
	o.loai = lay('--loai');
	o.tacGia = lay('--tac-gia');
	o.ten = lay('--ten');
	o.chang = lay('--chang') !== undefined ? Number(lay('--chang')) : undefined;
	o.grade = lay('--grade');
	o.danhMuc = lay('--danh-muc');
	o.thoiKy = lay('--thoi-ky');
	o.cap = lay('--cap');
	o.ngay = lay('--ngay');
	o.khuyetDanh = ts.includes('--khuyet-danh');
	return { o, goc: lay('--goc') ? path.resolve(lay('--goc')) : GOC };
}

if (import.meta.main) {
	const ts = process.argv.slice(2);
	if (!ts.length || ts.includes('--help') || ts.includes('-h')) {
		console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'));
		process.exit(ts.length ? 0 : 2);
	}
	try {
		const { o, goc } = docThamSo(ts);
		them(o, goc);
	} catch (e) {
		console.error(`them-tac-pham: ${e.message}`);
		process.exit(1);
	}
}
