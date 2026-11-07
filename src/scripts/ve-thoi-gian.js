// Lưới phách và dải thời gian (thành phần B của plans/ben-vung/de-xuat-hinh.md; đợt hình 2a). Mỗi hình là vài hàng chồng
// nhau trên cùng một trục thời gian chia n phần đều: ô theo phách và phần chia của phách (đậm: phách mạnh, vừa: phách vừa),
// chữ đếm trong ô, thanh ngang "phím đang giữ" (hai tay, legato, staccato), khối ô nhịp của câu và đoạn nhạc.
// Dựng lúc build thành HTML và CSS (chữ thật, cỡ chữ không nhỏ đi theo bề rộng như chữ trong SVG); vị trí theo phần trăm của
// trục nên tỉ lệ thời gian giữ nguyên ở mọi cỡ màn hình. Hình chỉ vẽ lại chữ, bảng, khuông của trang dùng nó (::hinh{ten}).

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pt = (x) => `${Math.round(x * 10000) / 10000}%`;

/**
 * Hình nốt nhỏ (SVG trong dòng, màu chữ): 'tron', 'trang', 'den', 'don' (móc đơn), 'kep' (móc kép); `cham`: chấm dôi.
 * Như cột "Hình dạng" của bài 3: đầu rỗng hay đặc, có đuôi hay không, số móc.
 */
export function hinhNot(loai, { cham = false } = {}) {
	const rong = cham ? 16 : 12;
	const ruot = loai === 'tron' || loai === 'trang' ? 'fill="none" stroke="currentColor" stroke-width="1.6"' : 'fill="currentColor"';
	let p = '';
	if (loai === 'tron') p = `<ellipse cx="6" cy="17" rx="5.3" ry="3.7" ${ruot}/>`;
	else {
		p = `<ellipse cx="5" cy="19" rx="4.1" ry="2.9" transform="rotate(-20 5 19)" ${ruot}/><path d="M8.7 18V2" stroke="currentColor" stroke-width="1.3"/>`;
		const moc = loai === 'don' ? 1 : loai === 'kep' ? 2 : 0;
		for (let i = 0; i < moc; i++) p += `<path d="M8.7 ${2 + i * 4.5}c0 3 3.6 4 3.3 8" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
	}
	if (cham) p += `<circle cx="13.6" cy="18.5" r="1.4" fill="currentColor"/>`;
	return `<svg class="oz-tg-not" viewBox="0 0 ${rong} 24" width="${rong * 0.05}em" height="1.2em" aria-hidden="true" focusable="false">${p}</svg>`;
}

/**
 * Dựng một hình từ mô tả: { n: số phần của trục, moTa: tên đọc được của cả hình (aria-label), chuThich: chú thích dưới hình,
 * hang: [{ ten: nhãn hàng (HTML tin cậy, trong module), nhom: hàng đầu của một nhóm (cách trên), lan: số làn (mặc định 1),
 * cao: 'thap' (hàng thấp) | 'cao', vach: [vị trí vạch dọc mờ], muc: [{ bat, dai, chu (HTML tin cậy), lop, lan }] }] }.
 * Lớp của mục: 'manh' | 'vua' | 'nhe' (phách theo độ mạnh), 'o' (ô thường), 'chia' (phần chia của phách), 'co' (ô có nốt),
 * 'phai' | 'trai' (thanh của tay phải, tay trái), 'thanh' (thanh "phím đang giữ"), 'tuy-y' (phần ngân tùy ý), 'chu' (chữ
 * không khung), 'a' | 'b' | 'c' (khối chất liệu), 'ket' (ô kết).
 */
export function veThoiGian({ n, moTa, chuThich, hang, lop = '' }) {
	const loi = kiemMoTa({ n, moTa, hang });
	if (loi) throw new Error(`hình thời gian: ${loi}`);
	const h = hang.map((r) => {
		const lan = r.lan ?? 1;
		const vach = (r.vach ?? []).map((x) => `<span class="oz-tg-vach" style="left:${pt((x / n) * 100)}"></span>`).join('');
		const muc = r.muc
			.map((m) => {
				const top = lan > 1 ? `;top:${pt(((m.lan ?? 0) / lan) * 100)};height:${pt(100 / lan)}` : '';
				return `<span class="oz-tg-muc oz-tg--${m.lop ?? 'o'}" style="left:${pt((m.bat / n) * 100)};width:${pt((m.dai / n) * 100)}${top}">${m.chu ? `<span>${m.chu}</span>` : ''}</span>`;
			})
			.join('');
		const lopHang = ['oz-tg-hang', r.nhom && 'oz-tg-hang--nhom', r.cao && `oz-tg-hang--${r.cao}`].filter(Boolean).join(' ');
		return `<div class="${lopHang}"${lan > 1 ? ` style="--lan:${lan}"` : ''}><span class="oz-tg-ten">${r.ten ?? ''}</span><div class="oz-tg-truc">${vach}${muc}</div></div>`;
	});
	return (
		`<figure class="oz-figure oz-tg${lop ? ` ${lop}` : ''} not-content" data-sinh>` +
		`<div class="oz-tg-khung" role="img" aria-label="${esc(moTa)}">${h.join('')}</div>` +
		(chuThich ? `<figcaption>${chuThich}</figcaption>` : '') +
		`</figure>`
	);
}

/** Lỗi của mô tả hình (mục ra ngoài trục, làn sai…), hay null. Dùng khi dựng và trong kiểm thử. */
export function kiemMoTa({ n, moTa, hang }) {
	if (!(Number.isInteger(n) && n > 0)) return `n phải là số nguyên dương`;
	if (!moTa) return 'thiếu moTa';
	for (const [i, r] of hang.entries()) {
		const lan = r.lan ?? 1;
		for (const m of r.muc) {
			if (!(m.bat >= 0 && m.dai > 0 && m.bat + m.dai <= n + 1e-9)) return `hàng ${i}: mục ${JSON.stringify(m)} ra ngoài trục 0–${n}`;
			if ((m.lan ?? 0) >= lan) return `hàng ${i}: làn ${m.lan} ngoài ${lan} làn`;
		}
		for (const x of r.vach ?? []) if (!(x >= 0 && x <= n)) return `hàng ${i}: vạch ${x} ngoài trục`;
	}
	return null;
}

// ---------- Các hình của trang (chỉ vẽ lại chữ, bảng, khuông của trang ghi ở chú thích từng hàm) ----------

/** Dãy ô liền nhau dài `dai`, chữ lần lượt từ `chu`, lớp `lop` (hay hàm theo chỉ số). */
const day = (chu, dai, lop = 'o', bat = 0) => chu.map((c, i) => ({ bat: bat + i * dai, dai, chu: c, lop: typeof lop === 'function' ? lop(i) : lop }));

/**
 * nhac-ly/04-nhip, bảng "Số chỉ nhịp" (cột "Cảm giác") và đoạn "Nhịp đơn và nhịp kép": mỗi nhịp hai hàng trên trục 8 móc
 * đơn; hàng trên là phách (mạnh, vừa, nhẹ như bảng), hàng dưới là móc đơn: nhịp đơn mỗi phách chia đôi, 6/8 mỗi phách chia ba
 * và đếm "1-2-3-4-5-6", nhấn 1 và 4.
 */
function hinhNhip() {
	const lopCua = { MẠNH: 'manh', vừa: 'vua', nhẹ: 'nhe' };
	const phach = (cam, dai) => cam.map((c, i) => ({ bat: i * dai, dai, chu: c, lop: lopCua[c] }));
	const chia = (so, chu = []) => Array.from({ length: so }, (_, i) => ({ bat: i, dai: 1, chu: chu[i] ?? '', lop: 'chia' }));
	const nhip = (ten, cam, dai, chuChia) => [
		{ ten: `<b>${ten}</b>`, nhom: true, muc: phach(cam, dai) },
		{ ten: '', cao: 'thap', muc: chia(cam.length * dai, chuChia) },
	];
	return veThoiGian({
		n: 8,
		moTa:
			'Phách mạnh và nhẹ của bốn nhịp, trên cùng một trục tám nốt móc đơn. 2/4: MẠNH – nhẹ, mỗi phách hai móc đơn. ' +
			'3/4: MẠNH – nhẹ – nhẹ, mỗi phách hai móc đơn. 4/4: MẠNH – nhẹ – vừa – nhẹ, mỗi phách hai móc đơn. ' +
			'6/8: sáu móc đơn đếm 1 đến 6, nhóm thành 2 phách, mỗi phách ba móc đơn; nhấn vào 1 (mạnh) và 4 (vừa).',
		chuThich:
			'Hàng trên: phách (đậm: mạnh, vừa: vừa, nhạt: nhẹ). Hàng dưới: nốt móc đơn. Nhịp đơn chia mỗi phách làm hai; 6/8 chia mỗi phách làm ba, nên chỉ có 2 phách lớn.',
		hang: [
			...nhip('2/4', ['MẠNH', 'nhẹ'], 2),
			...nhip('3/4', ['MẠNH', 'nhẹ', 'nhẹ'], 2),
			...nhip('4/4', ['MẠNH', 'nhẹ', 'vừa', 'nhẹ'], 2),
			...nhip('6/8', ['MẠNH', 'vừa'], 3, ['<b>1</b>', '2', '3', '<b>4</b>', '5', '6']),
		],
	});
}

/** luyen-tai/nghe-tiet-tau, "Nhịp đơn và nhịp kép": hai phách cùng độ dài; nhịp đơn đếm "1 và 2 và", nhịp kép "1 la li 2 la li". */
function hinhNhipDonKep() {
	const phach = [
		{ bat: 0, dai: 6, chu: 'phách 1', lop: 'manh' },
		{ bat: 6, dai: 6, chu: 'phách 2', lop: 'nhe' },
	];
	const dem = (chu, dai) => day(chu, dai, (i) => (i % (6 / dai) ? 'chia' : 'co'));
	return veThoiGian({
		n: 12,
		moTa:
			'Hai phách cùng độ dài. Nhịp đơn: mỗi phách chia 2, đếm 1 và 2 và. Nhịp kép: mỗi phách chia 3, đếm 1 la li 2 la li.',
		chuThich: 'Cùng hai phách: nhịp đơn chia mỗi phách làm 2 (đếm "và" một lần), nhịp kép chia làm 3 (đếm "la li").',
		hang: [
			{ ten: '<b>Nhịp đơn</b>', nhom: true, muc: phach },
			{ ten: 'chia 2', cao: 'thap', muc: dem(['1', 'và', '2', 'và'], 3) },
			{ ten: '<b>Nhịp kép</b>', nhom: true, muc: phach },
			{ ten: 'chia 3', cao: 'thap', muc: dem(['1', 'la', 'li', '2', 'la', 'li'], 2) },
		],
	});
}

/**
 * luyen-tai/nghe-tiet-tau, "Gõ lại tiết tấu": câu "đen – móc đơn móc đơn – đen" trong nhịp 4/4, đếm "1 và 2 và 3 và 4 và";
 * nốt rơi vào 1, 2, "và", 3.
 */
function hinhDemTo() {
	const coNot = new Set([0, 2, 3, 4]);
	return veThoiGian({
		n: 8,
		moTa:
			'Câu đen – móc đơn móc đơn – đen trong nhịp 4/4, đếm 1 và 2 và 3 và 4 và. Nốt rơi vào 1, 2, và (sau 2), 3. ' +
			'Nốt đen dài hai vị trí đếm, móc đơn một vị trí.',
		chuThich: 'Mỗi âm tiết đếm là một vị trí; ô tô đậm là vị trí có nốt: 1, 2, "và", 3.',
		hang: [
			{ ten: 'Đếm', muc: day(['1', 'và', '2', 'và', '3', 'và', '4', 'và'], 1, (i) => (coNot.has(i) ? 'co' : 'chia')) },
			{
				ten: 'Nốt',
				cao: 'thap',
				muc: [
					{ bat: 0, dai: 2, lop: 'thanh' },
					{ bat: 2, dai: 1, lop: 'thanh' },
					{ bat: 3, dai: 1, lop: 'thanh' },
					{ bat: 4, dai: 2, lop: 'thanh' },
				],
			},
			{
				ten: 'Hình nốt',
				cao: 'thap',
				muc: [
					{ bat: 0, dai: 2, chu: 'đen', lop: 'chu' },
					{ bat: 2, dai: 2, chu: '2 móc đơn', lop: 'chu' },
					{ bat: 4, dai: 2, chu: 'đen', lop: 'chu' },
				],
			},
		],
	});
}

/**
 * nhac-ly/03-truong-do, bảng "Các hình nốt": một ô nhịp 4 phách (nốt đen bằng 1 phách) lấp bằng 1 nốt tròn, 2 trắng, 4 đen,
 * 8 móc đơn, 16 móc kép (như khuông đầu bài, thêm hàng móc kép theo bảng); mỗi hình nốt dài gấp đôi hình nhỏ hơn kế tiếp.
 */
function hinhTruongDo() {
	const tang = [
		['tron', 'Nốt tròn', '4'],
		['trang', 'Nốt trắng', '2'],
		['den', 'Nốt đen', '1'],
		['don', 'Nốt móc đơn', '½'],
		['kep', 'Nốt móc kép', '¼'],
	];
	return veThoiGian({
		n: 16,
		lop: 'oz-tg--not',
		moTa:
			'Một ô nhịp 4 phách chia đôi dần: 1 nốt tròn (4 phách) bằng 2 nốt trắng (2 phách mỗi nốt), bằng 4 nốt đen (1 phách), ' +
			'bằng 8 nốt móc đơn (nửa phách), bằng 16 nốt móc kép (một phần tư phách).',
		chuThich: 'Cùng một ô nhịp 4 phách (nốt đen bằng 1 phách): mỗi hình nốt dài gấp đôi hình nốt nhỏ hơn kế tiếp.',
		hang: [
			{ ten: 'Phách', cao: 'thap', muc: day(['1', '2', '3', '4'], 4, 'chia') },
			...tang.map(([loai, ten, so], k) => {
				const dai = 16 / 2 ** k;
				return {
					ten: `${hinhNot(loai)} ${ten} <small>(${so} phách)</small>`,
					muc: Array.from({ length: 2 ** k }, (_, i) => ({ bat: i * dai, dai, chu: hinhNot(loai), lop: k % 2 ? 'b' : 'a' })),
				};
			}),
		],
	});
}

/** nhac-ly/03-truong-do, "Dấu chấm dôi": nốt trắng chấm dôi = 2 + 1 = 3 phách; nốt đen chấm dôi = 1 + ½ = 1½ phách. */
function hinhChamDoi() {
	return veThoiGian({
		n: 16,
		lop: 'oz-tg--not',
		moTa: 'Chấm dôi làm nốt dài thêm một nửa: nốt trắng chấm dôi bằng 2 cộng 1, là 3 phách; nốt đen chấm dôi bằng 1 cộng nửa, là 1 phách rưỡi.',
		chuThich: 'Phần sau dấu cộng là độ dài chấm dôi thêm vào: một nửa độ dài của chính nốt.',
		hang: [
			{ ten: 'Phách', cao: 'thap', muc: day(['1', '2', '3', '4'], 4, 'chia') },
			{
				ten: `${hinhNot('trang', { cham: true })} Trắng chấm dôi <small>(3 phách)</small>`,
				muc: [
					{ bat: 0, dai: 8, chu: `${hinhNot('trang')} 2`, lop: 'a' },
					{ bat: 8, dai: 4, chu: '+ 1', lop: 'b' },
				],
			},
			{
				ten: `${hinhNot('den', { cham: true })} Đen chấm dôi <small>(1½ phách)</small>`,
				muc: [
					{ bat: 0, dai: 4, chu: `${hinhNot('den')} 1`, lop: 'a' },
					{ bat: 4, dai: 2, chu: '+ ½', lop: 'b' },
				],
			},
		],
	});
}

/**
 * piano/hai-tay, bảng "Lưới 6": tay phải (chơi ba) đánh ở 1, 3, 5; tay trái (chơi hai) ở 1, 4; câu đọc "Một – ly cà phê"
 * (Một ở 1, ly ở 3, cà ở 4, phê ở 5). Mỗi nốt là một thanh dài tới nốt sau của cùng tay: ba nốt đều và hai nốt đều.
 */
function hinhHaiChoiBa() {
	return veThoiGian({
		n: 6,
		moTa:
			'Hai chọi ba trên lưới 6 phần của một phách. Tay phải chơi ba nốt đều, ở phần 1, 3, 5. Tay trái chơi hai nốt đều, ở phần 1 và 4. ' +
			'Câu đọc: Một ở phần 1 (hai tay cùng đánh), ly ở 3, cà ở 4, phê ở 5.',
		chuThich: 'Thanh là độ dài mỗi nốt. Nốt thứ hai của tay trái rơi giữa "ly" và "phê", đúng vào chữ "cà".',
		hang: [
			{ ten: 'Lưới 6', cao: 'thap', muc: day(['1', '2', '3', '4', '5', '6'], 1, 'chia') },
			{ ten: 'Tay phải (chơi ba)', muc: day(['', '', ''], 2, 'phai') },
			{ ten: 'Tay trái (chơi hai)', muc: day(['', ''], 3, 'trai') },
			{
				ten: 'Câu đọc',
				cao: 'thap',
				muc: [
					{ bat: 0, dai: 1, chu: '<b>Một</b>', lop: 'chu' },
					{ bat: 2, dai: 1, chu: 'ly', lop: 'chu' },
					{ bat: 3, dai: 1, chu: 'cà', lop: 'chu' },
					{ bat: 4, dai: 1, chu: 'phê', lop: 'chu' },
				],
			},
		],
	});
}

/**
 * piano/hai-tay, bảng "Lưới 12": tay phải (chơi bốn) ở 1, 4, 7, 10; tay trái (chơi ba) ở 1, 5, 9; đọc "một hai ba" bốn lần;
 * hình chung 3 – 1 – 2 – 2 – 1 – 3.
 */
function hinhBaChoiBon() {
	return veThoiGian({
		n: 12,
		moTa:
			'Ba chọi bốn trên lưới 12 phần. Tay phải chơi bốn nốt đều, ở phần 1, 4, 7, 10. Tay trái chơi ba nốt đều, ở phần 1, 5, 9. ' +
			'Đọc bốn nhóm "một hai ba". Hình chung, tính theo phần lưới: 3, 1, 2, 2, 1, 3.',
		chuThich: 'Tay trái đánh ở chữ "một" đầu tiên, chữ "hai" của nhóm thứ hai, chữ "ba" của nhóm thứ ba. Hàng cuối: khoảng cách giữa các nốt của hai tay, tính theo phần lưới.',
		hang: [
			{ ten: 'Lưới 12', cao: 'thap', muc: day(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 1, 'chia') },
			{ ten: 'Tay phải (chơi bốn)', muc: day(['', '', '', ''], 3, 'phai') },
			{ ten: 'Tay trái (chơi ba)', muc: day(['', '', ''], 4, 'trai') },
			{ ten: 'Đọc', cao: 'thap', muc: day(Array.from({ length: 12 }, (_, i) => ['<b>một</b>', 'hai', 'ba'][i % 3]), 1, 'chu') },
			{
				ten: 'Hình chung',
				cao: 'thap',
				muc: [
					[0, 3],
					[3, 1],
					[4, 2],
					[6, 2],
					[8, 1],
					[9, 3],
				].map(([bat, dai]) => ({ bat, dai, chu: String(dai), lop: 'o' })),
			},
		],
	});
}

/**
 * Bốn nốt Đô Rê Mi Fa, mỗi nốt 12 phần, giữ phím `giu` phần; làn so le để thấy chỗ hở, chỗ chồng. Thanh ngắn hơn 5 phần không
 * ghi tên nốt (ở 360 px không đủ chỗ; tên đã có ở các hàng trên).
 */
const bonNot = (giu, lop = 'thanh', lan = 2) =>
	['Đô', 'Rê', 'Mi', 'Fa'].map((chu, i) => ({ bat: i * 12, dai: giu, chu: giu >= 5 ? chu : '', lop, lan: lan > 1 ? i % 2 : 0 }));
const VACH_NOT = [0, 12, 24, 36, 48];

/**
 * piano/tieng-dan, "Legato: nối liền bằng ngón": hở (nhả sớm), nối đúng (ngón trước rời phím đúng lúc ngón sau chạm đáy
 * phím), legatissimo (chồng nhau một chút xíu), dính (nhả muộn, hai nốt kêu chồng lên nhau).
 */
function hinhLegato() {
	return veThoiGian({
		n: 54,
		moTa:
			'Bốn nốt Đô, Rê, Mi, Fa; mỗi thanh là lúc phím đang giữ. Hở: nhả sớm, có khoảng trống giữa hai nốt. ' +
			'Nối đúng: nốt trước nhả đúng lúc nốt sau xuống. Legatissimo: hai nốt chồng nhau một chút xíu. Dính: nhả muộn, hai nốt chồng lên nhau.',
		chuThich: 'Mỗi thanh là lúc phím đang được giữ; vạch dọc mờ là lúc nốt sau bắt đầu. Chỗ cần nghe là chỗ nối giữa hai thanh; độ hở, độ chồng chỉ để so sánh, không phải số đo.',
		hang: [
			{ ten: '<b>Hở</b> (nhả sớm)', lan: 2, vach: VACH_NOT, muc: bonNot(8) },
			{ ten: '<b>Nối đúng</b>', lan: 2, nhom: true, vach: VACH_NOT, muc: bonNot(12) },
			{ ten: '<b>Legatissimo</b> (chồng một chút xíu)', lan: 2, nhom: true, vach: VACH_NOT, muc: bonNot(14) },
			{ ten: '<b>Dính</b> (nhả muộn)', lan: 2, nhom: true, vach: VACH_NOT, muc: bonNot(18, 'dinh') },
		],
	});
}

/**
 * piano/tieng-dan, "Staccato và các kiểu ngắt" (bảng, và ví dụ "Cùng bốn nốt, năm cách phát âm"): độ dài tương đối, theo chữ
 * của bảng: staccato ngắn, có khoảng lặng phía sau; staccatissimo rất ngắn; portato hơi tách; tenuto giữ đủ giá trị.
 */
function hinhKieuNgat() {
	const hang = [
		['<b>Legato</b> (nối liền)', 12],
		['<b>Tenuto</b> (giữ đủ giá trị)', 12],
		['<b>Portato</b> (hơi tách)', 9],
		['<b>Staccato</b> (ngắn)', 5],
		['<b>Staccatissimo</b> (rất ngắn)', 3],
	];
	return veThoiGian({
		n: 48,
		moTa:
			'Cùng bốn nốt Đô, Rê, Mi, Fa; thanh là lúc phím đang giữ. Legato: nối liền. Tenuto: giữ đủ giá trị. Portato: hơi tách. ' +
			'Staccato: ngắn, có khoảng lặng phía sau. Staccatissimo: rất ngắn.',
		chuThich: 'Độ dài thanh chỉ để so sánh theo chữ của bảng ("giữ đủ giá trị", "hơi tách", "ngắn", "rất ngắn"), không phải số đo.',
		hang: hang.map(([ten, giu], i) => ({ ten, nhom: i > 0, vach: VACH_NOT, muc: bonNot(giu, 'thanh', 1) })),
	});
}

/**
 * nhac-ly/14-ky-hieu-bieu-dien, bảng "Cách diễn tấu": staccato ngắt ngắn, legato chơi liền mạch, tenuto giữ đủ độ dài,
 * fermata ngân dài tùy ý. Accent ("Nhấn") nói về độ nhấn, không về độ dài, nên không vẽ.
 */
function hinhDienTau() {
	return veThoiGian({
		n: 48,
		moTa:
			'Độ dài nốt theo ký hiệu, trên bốn nốt Đô, Rê, Mi, Fa: staccato ngắt ngắn; legato chơi liền mạch; tenuto giữ đủ độ dài. ' +
			'Fermata: một nốt ngân dài tùy ý.',
		chuThich: 'Thanh là lúc phím đang giữ; độ dài chỉ để so sánh. Phần gạch đứt của fermata: ngân dài tùy ý.',
		hang: [
			{ ten: '<b>Staccato</b> (ngắt ngắn)', vach: VACH_NOT, muc: bonNot(5, 'thanh', 1) },
			{ ten: '<b>Legato</b> (liền mạch)', nhom: true, vach: VACH_NOT, muc: bonNot(12, 'thanh', 1) },
			{ ten: '<b>Tenuto</b> (giữ đủ độ dài)', nhom: true, vach: VACH_NOT, muc: bonNot(12, 'thanh', 1) },
			{
				ten: '<b>Fermata</b> (ngân dài tùy ý)',
				nhom: true,
				vach: [0, 12],
				muc: [
					{ bat: 0, dai: 12, chu: 'Đô', lop: 'thanh' },
					{ bat: 12, dai: 24, chu: 'tùy ý', lop: 'tuy-y' },
				],
			},
		],
	});
}

const ONHIP = { ten: 'Ô nhịp', cao: 'thap', muc: day(['1', '2', '3', '4', '5', '6', '7', '8'], 1, 'chia') };

/**
 * nhac-ly/13-ket, "Câu nhạc và đoạn nhạc" (Ode to Joy): câu hỏi ô 1–4 dừng ở Rê (kết nửa), câu trả lời ô 5–8 giống câu đầu
 * ở ba ô nhịp đầu, kết ở Đô (kết trọn).
 */
function hinhDoanNhac() {
	return veThoiGian({
		n: 8,
		moTa:
			'Đoạn nhạc Ode to Joy, 8 ô nhịp. Câu hỏi: ô 1 đến 4, kết nửa ở ô 4. Câu trả lời: ô 5 đến 8, giống câu hỏi ở ba ô nhịp đầu (ô 5 đến 7 giống ô 1 đến 3), kết trọn ở ô 8.',
		chuThich: 'Cùng màu là cùng chất liệu: câu trả lời giống câu hỏi ở ba ô nhịp đầu, rồi kết khác.',
		hang: [
			ONHIP,
			{
				ten: 'Đoạn nhạc',
				muc: [
					{ bat: 0, dai: 4, chu: '<b>Câu hỏi</b>', lop: 'o' },
					{ bat: 4, dai: 4, chu: '<b>Câu trả lời</b>', lop: 'o' },
				],
			},
			{
				ten: 'Chất liệu',
				cao: 'cao',
				muc: [
					{ bat: 0, dai: 3, chu: 'ô 1–3', lop: 'a' },
					{ bat: 3, dai: 1, chu: 'kết<br>nửa', lop: 'ket' },
					{ bat: 4, dai: 3, chu: 'giống ô 1–3', lop: 'a' },
					{ bat: 7, dai: 1, chu: 'kết<br>trọn', lop: 'c' },
				],
			},
		],
	});
}

/**
 * nhac-ly/30-phat-trien-motip, bảng "Cấu trúc câu nhạc": câu 8 ô nhịp; trình bày ô 1–4 (ý cơ bản 2 ô nhịp, rồi nhắc lại),
 * tiếp nối ô 5–8 (chia nhỏ thành mảnh ngắn hơn, dồn dập hơn, rồi kết). Bảng không ghi độ dài từng mảnh, nên không chia ô 5–8.
 */
function hinhCauNhac() {
	return veThoiGian({
		n: 8,
		moTa:
			'Câu nhạc 8 ô nhịp. Trình bày, ô 1 đến 4: ý cơ bản 2 ô nhịp (ô 1, 2), rồi nhắc lại (ô 3, 4). ' +
			'Tiếp nối, ô 5 đến 8: chia nhỏ ý cơ bản thành mảnh ngắn hơn, dồn dập hơn, rồi kết.',
		chuThich: 'Câu nghe như nói – nhắc lại – rồi dồn tới.',
		hang: [
			ONHIP,
			{
				ten: 'Câu',
				muc: [
					{ bat: 0, dai: 4, chu: '<b>Trình bày</b>', lop: 'o' },
					{ bat: 4, dai: 4, chu: '<b>Tiếp nối</b>', lop: 'o' },
				],
			},
			{
				ten: 'Nội dung',
				cao: 'cao',
				muc: [
					{ bat: 0, dai: 2, chu: 'ý cơ bản', lop: 'a' },
					{ bat: 2, dai: 2, chu: 'nhắc lại', lop: 'a' },
					{ bat: 4, dai: 4, chu: 'chia nhỏ, dồn dập hơn → kết', lop: 'b' },
				],
			},
		],
	});
}

/** Tên hình (::hinh{ten="…"}) -> hàm dựng HTML. Thêm vào HINH của src/plugins/thanh-phan.mjs. Lỗi mô tả ghi tên hình. */
const HAM = {
	nhip: hinhNhip,
	'nhip-don-kep': hinhNhipDonKep,
	'dem-to': hinhDemTo,
	'truong-do': hinhTruongDo,
	'cham-doi': hinhChamDoi,
	'hai-choi-ba': hinhHaiChoiBa,
	'ba-choi-bon': hinhBaChoiBon,
	legato: hinhLegato,
	'kieu-ngat': hinhKieuNgat,
	'dien-tau': hinhDienTau,
	'doan-nhac': hinhDoanNhac,
	'cau-nhac': hinhCauNhac,
};
export const HINH_THOI_GIAN = Object.fromEntries(
	Object.entries(HAM).map(([ten, f]) => [
		ten,
		() => {
			try {
				return f();
			} catch (e) {
				throw new Error(`::hinh{ten="${ten}"}: ${e.message}`);
			}
		},
	]),
);
