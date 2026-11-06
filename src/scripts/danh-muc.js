// Bộ lọc của danh mục tác phẩm (::danh-muc-tac-pham, D6-L11; HTML dựng lúc build ở danhMucTacPham của
// src/plugins/thanh-phan.mjs). Mỗi ô chọn có data-loc (loai, chang, thoi-ky, tac-gia); mỗi mục <li> mang cùng tên ở
// data-*. Mục hiện khi hợp mọi ô đang chọn; không chọn gì ("Tất cả") thì hiện hết. Không lưu gì. Trình duyệt giữ lựa chọn
// khi người đọc quay lại trang (nút Lùi): lúc khởi tạo áp ngay lựa chọn đang có.

/** Lựa chọn đang có của các ô: { tên: giá trị } (bỏ ô "Tất cả"). */
export function docLoc(oChon) {
	const loc = {};
	for (const o of oChon) if (o.value) loc[o.dataset.loc] = o.value;
	return loc;
}

/** Mục có data-* (`ds`, như element.dataset với tên đã đổi sang camelCase hay giữ gạch nối) hợp bộ lọc `loc` không. */
export function hop(ds, loc) {
	for (const [k, v] of Object.entries(loc)) {
		const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
		if ((ds[camel] ?? ds[k]) !== v) return false;
	}
	return true;
}

export function mount(goc) {
	if (goc.dataset.san) return;
	goc.dataset.san = '1';
	const oChon = [...goc.querySelectorAll('select[data-loc]')];
	const muc = [...goc.querySelectorAll('.oz-dm-ds > li')];
	const dem = goc.querySelector('.oz-dm-dem');
	const trong = goc.querySelector('.oz-dm-trong');
	const bo = goc.querySelector('.oz-dm-bo');
	const ap = () => {
		const loc = docLoc(oChon);
		let n = 0;
		for (const li of muc) {
			const co = hop(li.dataset, loc);
			li.hidden = !co;
			if (co) n++;
		}
		if (dem) dem.textContent = `Hiện ${n} trên ${muc.length} trang.`;
		if (trong) trong.hidden = n > 0;
		if (bo) bo.disabled = !Object.keys(loc).length;
	};
	for (const o of oChon) o.addEventListener('change', ap);
	bo?.addEventListener('click', () => {
		for (const o of oChon) o.value = '';
		ap();
		oChon[0]?.focus();
	});
	ap();
}
