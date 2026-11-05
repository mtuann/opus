// Chọn âm thanh cho các công cụ (::cong-cu{ten="sound-setting"}, D7-L1), chuyển từ mountSetting của
// ../opus-zero/docs/assets/js/audio.js: mẫu âm piano thật hay âm tổng hợp, cùng khóa và giá trị với site cũ
// (opus-zero:sound: "piano", "synth"; cheDo, datCheDo của src/scripts/am-thanh.js), nút nghe thử (Đô–Mi–Sol–Đô rải rồi
// cùng lúc). Dòng trạng thái theo cách site mới tải mẫu: tải theo vùng phím đang dùng, giữ tối đa GIOI_HAN_MAU mẫu (bản cũ
// tải đủ 30 mẫu một lần, nên câu "Đã tải đủ 30 mẫu" không còn đúng).
// veChonAm dựng sẵn ô lúc build (src/plugins/thanh-phan.mjs), mount thêm phần bấm được.
import { GIOI_HAN_MAU, MAU, cheDo, chuanBi, choiNot, datCheDo, khiDoi, layNgCanh, trangThai } from './am-thanh.js';

const THU = [60, 64, 67, 72];

/** Dòng trạng thái (hàm thuần, để kiểm thử). */
export function chuTrangThai({ che_do, da_tai, tong }) {
	if (che_do === 'synth') return 'Đang dùng âm tổng hợp.';
	if (!da_tai) return `Mẫu âm piano (${tong} mẫu, khoảng 2 MB cả bộ) được tải dần khi bạn bấm phát: mỗi lần vài mẫu quanh phím đang dùng.`;
	return `Đã tải ${da_tai} mẫu âm piano quanh các phím đã dùng (giữ tối đa ${GIOI_HAN_MAU} mẫu).`;
}

export const veChonAm = () =>
	`<div class="oz-chon-am oz-tool not-content" data-sinh data-pagefind-ignore>` +
	`<fieldset class="oz-row"><legend class="oz-stats">Âm thanh cho các công cụ:</legend>` +
	`<label><input type="radio" name="oz-am" value="piano" checked> Đàn piano thật (mẫu âm)</label>` +
	`<label><input type="radio" name="oz-am" value="synth"> Âm tổng hợp (nhẹ, không cần tải)</label></fieldset>` +
	`<div class="oz-row"><button type="button" class="oz-btn" data-act="thu">Nghe thử</button></div>` +
	`<p class="oz-stats oz-chon-am-chu" aria-live="polite">${chuTrangThai({ che_do: 'piano', da_tai: 0, tong: MAU.length })}</p>` +
	`<noscript data-sinh><p>Chọn âm thanh cần JavaScript: bật JavaScript trong trình duyệt để dùng.</p></noscript></div>`;

export function mount(goc) {
	if (goc.dataset.san) return;
	const chu = goc.querySelector('.oz-chon-am-chu');
	const hien = () => (chu.textContent = chuTrangThai(trangThai()));
	for (const r of goc.querySelectorAll('input[name="oz-am"]')) {
		r.checked = r.value === cheDo();
		r.addEventListener('change', () => r.checked && datCheDo(r.value));
	}
	khiDoi(hien);
	hien();
	const nut = goc.querySelector('[data-act="thu"]');
	let dangChay = false;
	nut.addEventListener('click', async () => {
		if (dangChay) return;
		const c = layNgCanh();
		if (!c) return void (chu.textContent = 'Trình duyệt này không phát được âm thanh (không có Web Audio).');
		dangChay = true;
		nut.setAttribute('aria-busy', 'true');
		try {
			await chuanBi(THU);
		} finally {
			nut.removeAttribute('aria-busy');
			dangChay = false;
		}
		const t = c.currentTime;
		THU.forEach((m, i) => choiNot(m, t + i * 0.3, 0.8));
		for (const m of THU) choiNot(m, t + 1.3, 1.5, 0.12);
		hien();
	});
	goc.dataset.san = '1';
}
