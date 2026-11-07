// Nhóm nội dung của site (menu mới, plans/lam-lai/so-do.md mục 5): tên, màu, biểu tượng, một dòng mô tả.
// Màu theo nhóm giúp người đọc nhìn là biết mình đang ở mục nào: nhãn trên tiêu đề trang (src/components/PageTitle.astro),
// thẻ ở trang chủ. Mã màu khai ở src/styles/opus.css (--oz-c-<id>), có bản sáng và tối.
// Trang thuộc nhóm nào: theo đường dẫn và tầng của trang, như luật nhom_menu() của plans/lam-lai/anh_xa.py; với 233 trang
// cũ thì kết quả giống hệt (bảng: plans/lam-lai/anh-xa.md; tests/giao-dien.test.mjs so đủ). Với trang mới thì khác hai
// chỗ: trang dưới piano/lo-trinh/ (các trang chặng của đợt 2) vào Lộ trình, nhom_menu() cho vào Piano; trang ngoài mọi
// mục đã biết không có nhãn, nhom_menu() cho vào Nhạc cổ điển. Nhóm thứ chín của menu, "Thêm", không có nhãn.
// Menu bên (thanh bên của Starlight) dựng ở menu() dưới đây: đủ 9 nhóm, trang trong mỗi nhóm theo thứ tự menu của site cũ
// (THU_TU); nhóm chưa có trang nào trong bản build vẫn hiện, kèm nhãn "sắp có" (src/components/Sidebar.astro).

/** Biểu tượng nét (24×24, stroke = currentColor), dùng chung cho nhãn và thẻ. */
const BIEU_TUONG = {
	'bat-dau': '<path d="M5 21V4h10l-1.5 3L15 10H5"/>',
	'lo-trinh': '<circle cx="5" cy="18" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="19" cy="5" r="2"/><path d="M6.5 16.5 10.5 10.5M13.6 7.8l3.8-1.8"/>',
	'nhac-ly': '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
	piano: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v8M12 5v14M16 5v8M8 13v6M16 13v6"/>',
	'co-dien': '<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-6 10 6z"/>',
	'tac-pham': '<path d="M6 3h9l4 4v14H6z"/><path d="M9 10h7M9 13h7M9 16h7"/>',
	'luyen-tap': '<path d="M8 21h8l-2.5-17h-3z"/><path d="M12 15l5-9"/>',
	'doc-them': '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
	them: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
};

/** Các nhóm, theo thứ tự của menu. `vao`: trang mở đầu của nhóm (thẻ nhóm ở trang chủ dẫn tới đây). */
export const NHOM = [
	{ id: 'bat-dau', ten: 'Bắt đầu', mo_ta: 'Bài 0, kiểm tra đầu vào, mỗi ngày tập gì', vao: 'bat-dau/index' },
	{ id: 'lo-trinh', ten: 'Lộ trình 7 chặng', mo_ta: 'Từ con số 0 đến sau Grade 8', vao: 'piano/lo-trinh' },
	{ id: 'nhac-ly', ten: 'Nhạc lý và luyện tai', mo_ta: 'Nốt, quãng, hợp âm, nghe ra hòa âm', vao: 'nhac-ly/index' },
	{ id: 'piano', ten: 'Piano', mo_ta: 'Tư thế, kỹ thuật, cách tập, hòa âm bên phím', vao: 'piano/index' },
	{ id: 'co-dien', ten: 'Nhạc cổ điển', mo_ta: 'Thời kỳ, hình thức, nhà soạn nhạc', vao: 'lich-su/index' },
	{ id: 'tac-pham', ten: 'Tác phẩm', mo_ta: 'Bài học từng tác phẩm và hướng dẫn nghe', vao: 'piano/tac-pham/index' },
	{ id: 'luyen-tap', ten: 'Luyện tập', mo_ta: 'Đọc nốt, luyện tai, máy đếm nhịp', vao: 'luyen-tap/index' },
	{ id: 'doc-them', ten: 'Đọc thêm', mo_ta: 'Nhạc cụ, nhạc truyền thống Việt Nam, nhà soạn nhạc nữ', vao: 'nhac-cu/index' },
].map((n) => ({ ...n, bieu_tuong: BIEU_TUONG[n.id] }));

/** Trang của nhóm "Thêm", ngoài mục blog. */
const THEM = ['cap-nhat', 'ke-hoach', 'tai-nguyen', 'tai-lieu-tham-khao', 'bat-dau/sach-in'];

/** [đầu đường dẫn, nhóm], thử theo thứ tự như nhom_menu(). */
const THEO_DUONG_DAN = [
	['bat-dau', 'bat-dau'],
	['piano/lo-trinh', 'lo-trinh'],
	['piano/tac-pham', 'tac-pham'],
	['nghe-nhac', 'tac-pham'],
	['piano', 'piano'],
	['nhac-ly', 'nhac-ly'],
	['luyen-tai', 'nhac-ly'],
	['luyen-tap', 'luyen-tap'],
];

/** Mục của nhóm Nhạc cổ điển; trang tầng ngoại vi trong các mục này thuộc Đọc thêm. */
const CO_DIEN = ['lich-su', 'hinh-thuc', 'nhan-dien'];

/**
 * Nhóm của trang có đường dẫn `id` (ví dụ "nhac-ly/10-hop-am-ba"; trang mục lục viết "nhac-ly" hay "nhac-ly/index")
 * và tầng `tang` trong src/data/trang.yml; undefined với trang chủ, nhóm Thêm và trang không thuộc mục nào.
 */
export function nhomCuaTrang(id, tang) {
	const thuoc = (dau) => id === dau || id.startsWith(dau + '/');
	if (THEM.includes(id) || thuoc('blog')) return undefined;
	let ma = THEO_DUONG_DAN.find(([dau]) => thuoc(dau))?.[1];
	// nhac-cu/: Đọc thêm, trừ trang Lõi (dan-nhac: lộ trình nghe hiểu cần, duyệt bảng tầng 24/10/2026) thuộc Nhạc cổ điển
	if (!ma && (tang === 'ngoai-vi' || (thuoc('nhac-cu') && tang !== 'loi'))) ma = 'doc-them';
	if (!ma && (CO_DIEN.some(thuoc) || thuoc('nhac-cu'))) ma = 'co-dien';
	return NHOM.find((n) => n.id === ma);
}

/** Địa chỉ trang mở đầu của nhóm trên site ("bat-dau/index" thành "/opus/bat-dau/"). */
export const diaChiVao = (n, base = '/opus/') => base + n.vao.replace(/(^|\/)index$/, '$1').replace(/([^/])$/, '$1/');

/** SVG biểu tượng của một nhóm. */
export const svgNhom = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${n.bieu_tuong}</svg>`;

/** Nhóm thứ chín của menu (cuối thanh bên): không có màu, nhãn trên tiêu đề hay thẻ ở trang chủ. */
export const NHOM_THEM = { id: 'them', ten: 'Thêm', mo_ta: 'Cập nhật, blog, tài nguyên, tài liệu tham khảo, sách in', bieu_tuong: BIEU_TUONG.them };

/**
 * Thứ tự trang trong menu, kèm tên ngắn khi tên ngắn khác tiêu đề trang: theo menu của site cũ (nav trong
 * ../opus-zero/mkdocs.yml ở commit 5d08189), ba bài blog xếp sau trang blog, bài mới trước. Trang mục lục của một mục
 * (…/index) hiện là "Tổng quan". Trang không có ở đây (trang mới) xếp sau, theo chữ cái.
 */
const THU_TU = [
	['bat-dau/index'],
	['bat-dau/bai-0', 'Bài 0: Trước khi bắt đầu'],
	['bat-dau/kiem-tra-dau-vao', 'Kiểm tra đầu vào'],
	['bat-dau/lo-trinh-choi', 'Lộ trình piano năm đầu'],
	['bat-dau/lo-trinh-nghe', 'Lộ trình nghe hiểu và nhạc lý'],
	['bat-dau/moi-ngay', 'Thói quen mỗi ngày'],
	['bat-dau/tom-tat', 'Tóm tắt một tờ'],
	['bat-dau/sach-in', 'Sách in được (PDF)'],
	['bat-dau/hoi-dap', 'Hỏi đáp'],
	['bat-dau/ung-dung', 'Cài như ứng dụng'],
	['piano/index'],
	['piano/lo-trinh', 'Lộ trình: từ 0 đến nâng cao'],
	['piano/chon-dan', 'Chọn đàn và góc tập'],
	['piano/tu-the', 'Tư thế và thế tay'],
	['piano/ban-do-ban-phim', 'Bản đồ bàn phím'],
	['piano/hai-tuan-dau', 'Hai tuần đầu tiên'],
	['piano/10-bai-dau-tien', '10 bài đầu tiên (hai tay)'],
	['piano/nam-ngon', 'Vị trí năm ngón'],
	['piano/gam', 'Gam và ngón bấm'],
	['piano/hop-am-rai', 'Hợp âm và hình đệm'],
	['piano/tieng-dan', 'Tạo tiếng đàn'],
	['piano/ban-dap', 'Bàn đạp'],
	['piano/not-hoa-my', 'Nốt hoa mỹ'],
	['piano/hai-tay', 'Phối hợp hai tay'],
	['piano/quang-tam-buoc-nhay', 'Quãng tám và bước nhảy'],
	['piano/not-lap-not-kep', 'Nốt lặp và nốt kép'],
	['piano/bai-tap-ngon', 'Bài tập ngón và étude'],
	['piano/cach-tap', 'Cách tập hiệu quả'],
	['piano/thi-tau', 'Đọc nhạc và thị tấu'],
	['piano/hoc-thuoc-bieu-dien', 'Học thuộc và biểu diễn'],
	['piano/choi-cung-nguoi-khac', 'Chơi cùng người khác'],
	['piano/suc-khoe', 'Giữ đôi tay khỏe'],
	['piano/thay-va-thi', 'Học với thầy và thi cấp'],
	['piano/hoa-am/index'],
	['piano/hoa-am/ket', 'Kết ở mọi giọng'],
	['piano/hoa-am/dem-giai-dieu', 'Đệm cho một giai điệu'],
	['piano/hoa-am/mau-galant', 'Các mẫu hòa âm thời Cổ điển'],
	['piano/hoa-am/ung-tac', 'Ứng tác cổ điển: bắt đầu từ đâu'],
	['piano/tac-pham-theo-cap', 'Tác phẩm theo cấp độ'],
	['piano/tac-pham/index'],
	['piano/tac-pham/mozart-minuet-k2', 'Mozart: Minuet Fa trưởng, K. 2'],
	['piano/tac-pham/minuet-sol', 'Petzold: Minuet Sol trưởng'],
	['piano/tac-pham/minuet-sol-thu', 'Petzold: Minuet Sol thứ'],
	['piano/tac-pham/musette-re', 'Musette Rê trưởng'],
	['piano/tac-pham/schumann-album', 'Schumann: Album für die Jugend'],
	['piano/tac-pham/burgmuller-la-candeur', 'Burgmüller: La candeur'],
	['piano/tac-pham/tchaikovsky-bai-ca-phap-co', 'Tchaikovsky: Bài ca Pháp cổ'],
	['piano/tac-pham/beethoven-sonatina-sol', 'Sonatina Sol trưởng, Anh. 5 số 1'],
	['piano/tac-pham/clementi-sonatina', 'Clementi: Sonatina Op. 36 số 1'],
	['piano/tac-pham/burgmuller-arabesque', 'Burgmüller: Arabesque'],
	['piano/tac-pham/bach-prelude-bwv939', 'Bach: Prelude nhỏ BWV 939'],
	['piano/tac-pham/tchaikovsky-cau-nguyen-buoi-sang', 'Tchaikovsky: Cầu nguyện buổi sáng'],
	['piano/tac-pham/chopin-valse-la-thu', 'Chopin: Valse La thứ'],
	['piano/tac-pham/chopin-prelude-la-truong', 'Chopin: Prélude La trưởng'],
	['piano/tac-pham/grieg-arietta', 'Grieg: Arietta'],
	['piano/tac-pham/satie-gymnopedie', 'Satie: Gymnopédie số 1'],
	['piano/tac-pham/bach-prelude-do', 'Bach: Prelude Đô trưởng'],
	['piano/tac-pham/chopin-prelude-mi-thu', 'Chopin: Prélude Mi thứ'],
	['piano/tac-pham/fur-elise', 'Beethoven: Für Elise'],
	['piano/tac-pham/beethoven-op49-2', 'Beethoven: Sonata Op. 49 số 2'],
	['piano/tac-pham/mendelssohn-thuyen-ca', 'Mendelssohn: Thuyền ca Venice'],
	['piano/tac-pham/chopin-valse-si-thu', 'Chopin: Valse Si thứ'],
	['piano/tac-pham/bach-invention-1', 'Bach: Invention số 1'],
	['piano/tac-pham/mozart-k545', 'Mozart: Sonata K. 545'],
	['piano/tac-pham/schumann-traumerei', 'Schumann: Träumerei'],
	['piano/tac-pham/beethoven-anh-trang', 'Beethoven: Ánh trăng, chương 1'],
	['piano/tac-pham/pathetique-adagio', 'Beethoven: Pathétique, chương 2'],
	['piano/tac-pham/chopin-nocturne-op9-2', 'Chopin: Nocturne Op. 9 số 2'],
	['piano/tac-pham/bach-prelude-fugue-do-thu', 'Bach: Prelude và fugue Đô thứ'],
	['piano/tac-pham/schubert-impromptu-sol-giang', 'Schubert: Impromptu Sol♭ trưởng'],
	['piano/tac-pham/debussy-clair-de-lune', 'Debussy: Clair de lune'],
	['piano/tac-pham/chopin-fantaisie-impromptu', 'Chopin: Fantaisie-Impromptu'],
	['piano/tac-pham/liszt-liebestraum', 'Liszt: Liebestraum số 3'],
	['piano/tac-pham/chopin-ballade-1', 'Chopin: Ballade số 1'],
	['piano/lich-su-dan', 'Lịch sử cây đàn piano'],
	['piano/the-loai', 'Các thể loại nhạc piano'],
	['piano/nha-soan-nhac', 'Nhà soạn nhạc cho piano'],
	['piano/nghe-si', 'Nghệ sĩ piano và bản thu'],
	['nhac-ly/index'],
	['nhac-ly/01-cao-do-ten-not', '1. Cao độ và tên nốt'],
	['nhac-ly/02-khuong-nhac-khoa', '2. Khuông nhạc và khóa'],
	['nhac-ly/03-truong-do', '3. Trường độ và dấu lặng'],
	['nhac-ly/04-nhip', '4. Nhịp và số chỉ nhịp'],
	['nhac-ly/05-dau-hoa', '5. Cung, nửa cung và dấu hóa'],
	['nhac-ly/on-tap-1', 'Ôn tập 1'],
	['nhac-ly/06-gam-truong', '6. Gam trưởng'],
	['nhac-ly/07-gam-thu', '7. Gam thứ'],
	['nhac-ly/08-hoa-bieu', '8. Hóa biểu và vòng quãng năm'],
	['nhac-ly/09-quang', '9. Quãng'],
	['nhac-ly/on-tap-2', 'Ôn tập 2'],
	['nhac-ly/10-hop-am-ba', '10. Hợp âm ba'],
	['nhac-ly/11-hop-am-bay', '11. Hợp âm bảy và thể đảo'],
	['nhac-ly/12-hoa-am-chuc-nang', '12. Hòa âm chức năng'],
	['nhac-ly/13-ket', '13. Kết và câu nhạc'],
	['nhac-ly/14-ky-hieu-bieu-dien', '14. Ký hiệu biểu diễn'],
	['nhac-ly/on-tap-3', 'Ôn tập 3'],
	['nhac-ly/15-tiet-tau-nang-cao', '15. Tiết tấu nâng cao'],
	['nhac-ly/16-dieu-thuc-ngu-cung', '16. Điệu thức và gam ngũ cung'],
	['nhac-ly/17-khoa-do-dich-giong', '17. Khóa Đô và dịch giọng'],
	['nhac-ly/18-am-ngoai-hop-am', '18. Âm ngoài hợp âm'],
	['nhac-ly/19-at-phu-chuyen-giong', '19. Át phụ và chuyển giọng'],
	['nhac-ly/20-doc-tong-pho', '20. Đọc tổng phổ'],
	['nhac-ly/am-hoc', 'Âm học cơ bản'],
	['nhac-ly/21-hoa-am-bon-be', '21. Hòa âm bốn bè'],
	['nhac-ly/22-doi-am', '22. Đối âm'],
	['nhac-ly/23-hop-am-muon', '23. Hợp âm mượn'],
	['nhac-ly/24-napoli-sau-tang', '24. Napoli và sáu tăng'],
	['nhac-ly/25-be-tram-so', '25. Bè trầm số'],
	['nhac-ly/26-phan-tich', '26. Phân tích một tác phẩm'],
	['nhac-ly/27-ky-hieu-hop-am', '27. Ký hiệu hợp âm pop và jazz'],
	['nhac-ly/28-ket-cau', '28. Kết cấu âm nhạc'],
	['nhac-ly/29-chuoi-hoa-am', '29. Chuỗi hòa âm'],
	['nhac-ly/30-phat-trien-motip', '30. Phát triển môtip và cấu trúc câu'],
	['nhac-ly/31-hinh-thuc-nho', '31. Hình thức nhỏ'],
	['nhac-ly/32-ky-thuat-the-ky-20', '32. Kỹ thuật thế kỷ 20'],
	['nhac-ly/tu-dien', 'Từ điển thuật ngữ'],
	['luyen-tap/index'],
	['luyen-tai/index'],
	['luyen-tai/nghe-quang', 'Nghe quãng'],
	['luyen-tai/nghe-hop-am', 'Nghe hợp âm'],
	['luyen-tai/nghe-gam', 'Nghe gam và điệu thức'],
	['luyen-tai/nghe-tiet-tau', 'Nghe tiết tấu'],
	['luyen-tai/nghe-tien-trinh', 'Nghe tiến trình hòa âm'],
	['luyen-tai/choi-bang-tai', 'Chơi theo tai bên phím đàn'],
	['luyen-tap/doc-not', 'Đọc nốt'],
	['luyen-tap/hoa-bieu', 'Hóa biểu và vòng quãng năm'],
	['luyen-tap/tiet-tau', 'Tiết tấu'],
	['luyen-tap/thi-tau', 'Thị tấu một bè'],
	['luyen-tap/thi-tau-hai-tay', 'Thị tấu hai tay'],
	['luyen-tap/phieu-bai-tap', 'Phiếu bài tập và giấy kẻ khuông'],
	['luyen-tap/chep-giai-dieu', 'Chép giai điệu'],
	['luyen-tap/choi-theo', 'Chơi theo'],
	['luyen-tap/hat-lai', 'Hát lại và máy lên dây'],
	['luyen-tap/thu-am', 'Thu âm buổi tập'],
	['luyen-tap/ket-noi-midi', 'Kết nối đàn MIDI'],
	['luyen-tap/ban-phim', 'Bàn phím piano'],
	['luyen-tap/xay-hop-am', 'Xây gam và hợp âm'],
	['luyen-tap/metronome', 'Máy đếm nhịp'],
	['luyen-tap/nhat-ky', 'Nhật ký luyện tập'],
	['luyen-tap/du-lieu', 'Dữ liệu của tôi'],
	['nghe-nhac/index'],
	['nghe-nhac/doc-ten-tac-pham', 'Đọc tên tác phẩm và bản thu'],
	['nghe-nhac/nghe-gi-tiep', 'Nghe gì tiếp'],
	['nghe-nhac/mau', 'Mẫu ghi chép'],
	['nghe-nhac/scarlatti-sonata', 'Scarlatti: Ba bản sonata'],
	['nghe-nhac/bach-goldberg', 'Bach: Biến tấu Goldberg'],
	['nghe-nhac/mozart-k331', 'Mozart: Sonata K. 331'],
	['nghe-nhac/mozart-concerto-21', 'Mozart: Concerto piano số 21'],
	['nghe-nhac/beethoven-pathetique', 'Beethoven: Sonata Pathétique'],
	['nghe-nhac/beethoven-moonlight', 'Beethoven: Sonata Ánh trăng'],
	['nghe-nhac/schubert-impromptu', 'Schubert: Impromptu Sol♭ trưởng'],
	['nghe-nhac/chopin-etude', 'Chopin: Étude Op. 10'],
	['nghe-nhac/schumann-kinderszenen', 'Schumann: Kinderszenen'],
	['nghe-nhac/liszt-liebestraum', 'Liszt: Liebestraum số 3'],
	['nghe-nhac/grieg-concerto', 'Grieg: Concerto piano'],
	['nghe-nhac/mussorgsky-tranh', 'Mussorgsky: Những bức tranh'],
	['nghe-nhac/brahms-intermezzo', 'Brahms: Intermezzo Op. 118 số 2'],
	['nghe-nhac/rachmaninoff-2', 'Rachmaninoff: Concerto piano số 2'],
	['nghe-nhac/debussy-preludes', 'Debussy: Préludes, quyển 1'],
	['nghe-nhac/gershwin-rhapsody', 'Gershwin: Rhapsody in Blue'],
	['nghe-nhac/vivaldi-mua-xuan', 'Vivaldi: Mùa xuân'],
	['nghe-nhac/vivaldi-mua-dong', 'Vivaldi: Mùa đông'],
	['nghe-nhac/bach-cello-1', 'Bach: Tổ khúc cello số 1'],
	['nghe-nhac/bach-air', 'Bach: Air (Tổ khúc số 3)'],
	['nghe-nhac/handel-hallelujah', 'Handel: Hallelujah (Messiah)'],
	['nghe-nhac/haydn-94', 'Haydn: Giao hưởng Surprise'],
	['nghe-nhac/mozart-40', 'Mozart: Giao hưởng số 40'],
	['nghe-nhac/mozart-nu-hoang-bong-dem', 'Mozart: Nữ hoàng bóng đêm'],
	['nghe-nhac/mozart-requiem', 'Mozart: Requiem'],
	['nghe-nhac/mozart-eine-kleine', 'Mozart: Eine kleine Nachtmusik'],
	['nghe-nhac/beethoven-5', 'Beethoven: Giao hưởng số 5'],
	['nghe-nhac/beethoven-op132', 'Beethoven: Tứ tấu Op. 132'],
	['nghe-nhac/schubert-erlkonig', 'Schubert: Erlkönig'],
	['nghe-nhac/schubert-ca-hoi', 'Schubert: Con cá hồi'],
	['nghe-nhac/mendelssohn-violin', 'Mendelssohn: Concerto violin'],
	['nghe-nhac/bizet-habanera', 'Bizet: Habanera'],
	['nghe-nhac/tchaikovsky-ho-thien-nga', 'Tchaikovsky: Hồ thiên nga'],
	['nghe-nhac/tchaikovsky-1812', 'Tchaikovsky: 1812 Overture'],
	['nghe-nhac/brahms-4', 'Brahms: Giao hưởng số 4'],
	['nghe-nhac/dvorak-9-largo', 'Dvořák: Giao hưởng số 9, Largo'],
	['nghe-nhac/grieg-buoi-sang', 'Grieg: Buổi sáng (Peer Gynt)'],
	['nghe-nhac/puccini-nessun-dorma', 'Puccini: Nessun dorma'],
	['nghe-nhac/ravel-bolero', 'Ravel: Boléro'],
	['nghe-nhac/stravinsky-sacre', 'Stravinsky: Nghi lễ mùa xuân'],
	['nghe-nhac/shostakovich-5', 'Shostakovich: Giao hưởng số 5'],
	['nghe-nhac/part-spiegel', 'Pärt: Spiegel im Spiegel'],
	['hinh-thuc/index'],
	['hinh-thuc/sonata', 'Hình thức sonata'],
	['hinh-thuc/fugue', 'Fugue'],
	['hinh-thuc/bien-tau', 'Chủ đề và biến tấu'],
	['hinh-thuc/rondo', 'Rondo'],
	['hinh-thuc/concerto', 'Concerto và ritornello'],
	['hinh-thuc/minuet-trio', 'Minuet và Trio'],
	['hinh-thuc/scherzo', 'Scherzo'],
	['hinh-thuc/overture', 'Overture'],
	['hinh-thuc/symphonic-poem', 'Symphonic poem'],
	['nhan-dien/index'],
	['nhan-dien/so-sanh-thoi-ky', 'So sánh các thời kỳ'],
	['nhan-dien/the-loai', 'Nhận diện thể loại'],
	['nhan-dien/dau-van-tay', 'Dấu vân tay nhà soạn nhạc'],
	['nhan-dien/luyen-nghe', 'Luyện nghe nhận diện'],
	['nhan-dien/nghe-mu', 'Nghe mù'],
	['nhac-cu/index'],
	['nhac-cu/dan-nhac', 'Dàn nhạc giao hưởng'],
	['nhac-cu/violin', 'Violin'],
	['nhac-cu/cello', 'Cello'],
	['nhac-cu/guitar', 'Guitar cổ điển'],
	['nhac-cu/sao', 'Sáo'],
	['nhac-cu/clarinet', 'Clarinet'],
	['nhac-cu/trumpet', 'Trumpet'],
	['nhac-cu/nhac-cu-khac', 'Giọng hát, organ, harpsichord'],
	['lich-su/index'],
	['lich-su/dong-thoi-gian', 'Dòng thời gian'],
	['lich-su/thoi-ky/trung-co', 'Trung cổ'],
	['lich-su/thoi-ky/phuc-hung', 'Phục hưng'],
	['lich-su/thoi-ky/baroque', 'Baroque'],
	['lich-su/thoi-ky/co-dien', 'Cổ điển'],
	['lich-su/thoi-ky/lang-man', 'Lãng mạn'],
	['lich-su/thoi-ky/the-ky-20', 'Thế kỷ 20'],
	['lich-su/nha-soan-nhac', 'Nhà soạn nhạc'],
	['lich-su/nu-nha-soan-nhac', 'Các nhà soạn nhạc nữ'],
	['lich-su/opera', 'Nhập môn opera'],
	['lich-su/viet-nam', 'Nhạc cổ điển ở Việt Nam'],
	['lich-su/nhac-truyen-thong-viet-nam', 'Nhạc truyền thống Việt Nam'],
	['lich-su/duong-dai', 'Âm nhạc hôm nay'],
	['blog/index'],
	['blog/posts/2026-10-23-phien-ban-15'],
	['blog/posts/2026-10-21-trong-tam-piano'],
	['blog/posts/2026-10-11-bat-dau'],
	['tai-nguyen', 'Tài nguyên'],
	['tai-lieu-tham-khao', 'Tài liệu tham khảo'],
	['cap-nhat', 'Cập nhật'],
	['ke-hoach', 'Kế hoạch phát triển'],
];

/** Nhóm menu của trang (id như trong NHOM, hay "them"); undefined với trang chủ và trang 404. */
export function nhomMenu(id, tang) {
	if (id === 'index' || id === '404') return undefined;
	if (THEM.includes(id) || id === 'blog' || id.startsWith('blog/')) return 'them';
	return nhomCuaTrang(id, tang)?.id;
}

/**
 * Cấu hình thanh bên của Starlight (sidebar): đủ 9 nhóm theo thứ tự menu. Mỗi nhóm có các trang của `trang` (trang trong
 * bản build, như trangTrongBan()) thuộc nhóm ấy, theo THU_TU; `them`: mục thêm vào nhóm, đứng ngay sau trang `sau`, ví dụ
 * trang chặng: { 'lo-trinh': { sau: 'piano/lo-trinh', muc: [{ link: '/piano/lo-trinh/chang-1/', label: 'Chặng 1' }] } }.
 * Nhóm chưa có trang nào: items rỗng, src/components/Sidebar.astro hiện tên nhóm kèm nhãn "sắp có". Nhóm thu gọn, trừ
 * nhóm có trang đang xem (Starlight tự mở).
 * @param {string[]} trang
 * @param {Map<string, string>} tang tầng của trang (src/data/trang.yml): trang Đọc thêm xếp theo tầng
 */
export function menu(trang, tang = new Map(), them = {}) {
	const viTri = new Map(THU_TU.map(([t], i) => [t, i]));
	const tenNgan = new Map(THU_TU.filter(([, l]) => l).map(([t, l]) => [t, l]));
	return [...NHOM, NHOM_THEM].map((n) => {
		const ds = trang
			.filter((t) => nhomMenu(t, tang.get(t)) === n.id)
			.sort((a, b) => (viTri.get(a) ?? Infinity) - (viTri.get(b) ?? Infinity) || a.localeCompare(b));
		const items = ds.map((t) => {
			const label = /(^|\/)index$/.test(t) ? 'Tổng quan' : tenNgan.get(t);
			return { slug: t.replace(/\/?index$/, ''), ...(label && { label }) };
		});
		const { sau, muc = [] } = them[n.id] ?? {};
		const i = ds.indexOf(sau);
		items.splice(i < 0 ? items.length : i + 1, 0, ...muc);
		return { label: n.ten, collapsed: true, items };
	});
}
