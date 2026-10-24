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
