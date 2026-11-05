// Tiến độ của người học trong trình duyệt (localStorage), cùng khóa và định dạng với site cũ
// (../opus-zero/docs/assets/js/progress.js), để site mới đọc được dữ liệu đã lưu: cùng tên miền mtuann.github.io.
// Đợt 7 chuyển đủ các phần còn lại (nhật ký, kế hoạch, sao lưu). Dữ liệu chỉ nằm trên máy người học.
export const KHOA = 'opus-zero:v1';

export function homNay() {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function doc() {
	try {
		const data = JSON.parse(localStorage.getItem(KHOA) || 'null');
		if (data && typeof data === 'object' && data.days) return data;
	} catch {
		// localStorage bị chặn hay dữ liệu hỏng: coi như chưa có gì
	}
	return { days: {} };
}

function ghi(data) {
	try {
		localStorage.setItem(KHOA, JSON.stringify(data));
		return true;
	} catch {
		return false;
	}
}

const bao = () => document.dispatchEvent(new CustomEvent('oz:progress'));

/** Ghi một hoạt động trong ngày, ví dụ ghiNgay("quizzes", 1). */
export function ghiNgay(truong, soLuong = 1) {
	const data = doc();
	const ngay = (data.days[homNay()] ??= { tasks: {}, note: '', notes: 0, intervals: 0, minutes: 0 });
	ngay[truong] = (ngay[truong] || 0) + soLuong;
	ghi(data);
	bao();
}

/** Số đã ghi hôm nay của một hoạt động (days[hôm nay][trường], như getDay của site cũ), ví dụ soHomNay("intervals"). */
export const soHomNay = (truong) => doc().days[homNay()]?.[truong] || 0;

/** Kho dài hạn (không theo ngày): bài đã học, mốc nghe… */
export function layKho(ten, macDinh) {
	const data = doc();
	return data.store && data.store[ten] !== undefined ? data.store[ten] : macDinh;
}

export function datKho(ten, giaTri) {
	const data = doc();
	(data.store ??= {})[ten] = giaTri;
	ghi(data);
	bao();
}

/**
 * Theo dõi một kỹ năng (skill của progress.js cũ, cùng chỗ lưu): số lần, số đúng, độ chính xác trượt (ema), ngày luyện cuối;
 * kèm lịch sử theo ngày (store.skillHist[kỹ năng][ngày] = [số lượt, số đúng]) để vẽ biểu đồ tiến bộ ở trang Luyện tập.
 */
export function kyNang(id, dung) {
	const data = doc();
	const kho = (data.store ??= {});
	const tat = (kho.skills ??= {});
	const s = (tat[id] ??= { n: 0, c: 0, ema: 0.5, last: '' });
	s.n++;
	if (dung) s.c++;
	s.ema = s.n === 1 ? (dung ? 0.7 : 0.3) : s.ema * 0.85 + (dung ? 1 : 0) * 0.15;
	s.last = homNay();
	const lich = ((kho.skillHist ??= {})[id] ??= {});
	const [luot, dungLuot] = lich[s.last] ?? [0, 0];
	lich[s.last] = [luot + 1, dungLuot + (dung ? 1 : 0)];
	ghi(data);
	bao();
}

// ---------- Nhật ký luyện tập (D7-L2): việc trong ngày, ghi chú, mức hoạt động, chuỗi ngày (progress.js cũ) ----------

/** Toàn bộ tiến độ đã lưu ({ days, store }; load cũ). */
export const docTienDo = doc;
/** Ghi lại toàn bộ tiến độ, không báo sự kiện (save cũ: nhật ký tự đánh dấu việc lúc vẽ lại, báo thì vẽ lại mãi). */
export const ghiTienDo = ghi;
/** Ngày `key` trong `data`, tạo mới nếu chưa có (getDay cũ). */
export const ngayCua = (data, key) => (data.days[key] ??= { tasks: {}, note: '', notes: 0, intervals: 0, minutes: 0 });

/** Đánh dấu một việc của hôm nay (setTask cũ). */
export function datViec(viec, xong) {
	const data = doc();
	const ngay = ngayCua(data, homNay());
	(ngay.tasks ??= {})[viec] = !!xong;
	ghi(data);
	bao();
}

/** Ghi chú của hôm nay (setNote cũ; không báo sự kiện, như bản cũ). */
export function datGhiChu(chu) {
	const data = doc();
	ngayCua(data, homNay()).note = chu;
	ghi(data);
}

/** Mức hoạt động của một ngày, 0–3 (level cũ). */
export function mucNgay(d) {
	if (!d) return 0;
	let diem = Object.values(d.tasks || {}).filter(Boolean).length;
	if ((d.notes || 0) >= 10) diem += 1;
	if ((d.intervals || 0) >= 10) diem += 1;
	if ((d.minutes || 0) >= 5) diem += 1;
	if ((d.chords || 0) + (d.keysigs || 0) + (d.rhythms || 0) + (d.melodies || 0) + (d.builds || 0) + (d.scales || 0) + (d.styles || 0) >= 10) diem += 1;
	if ((d.cards || 0) >= 10 || (d.quizzes || 0) >= 1) diem += 1;
	if ((d.piano || 0) >= 1) diem += 2; // đã ngồi vào đàn tập bài
	if ((d.checks || 0) >= 1) diem += 1;
	if ((d.readings || 0) >= 3) diem += 1; // thị tấu hai tay
	if (diem === 0) return 0;
	if (diem <= 1) return 1;
	if (diem <= 3) return 2;
	return 3;
}

/** Ngày iso (YYYY-MM-DD) lùi hay tiến `n` ngày, theo lịch (không lệch vì giờ mùa hè). */
export function congNgay(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const x = new Date(Date.UTC(y, m - 1, d + n));
	return x.toISOString().slice(0, 10);
}

/** Số ngày luyện tập liên tiếp tính tới hôm nay (streak cũ): hôm nay chưa tập thì vẫn tính chuỗi tới hôm qua. */
export function chuoiNgay(days, hom = homNay()) {
	let d = hom;
	let n = 0;
	if (mucNgay(days[d]) === 0) d = congNgay(d, -1);
	while (mucNgay(days[d]) > 0) {
		n++;
		d = congNgay(d, -1);
	}
	return n;
}
