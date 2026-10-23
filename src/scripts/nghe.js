// Nghe kèm bản thu (khối ::khoi-nghe), chuyển từ ../opus-zero/docs/assets/js/listen.js, giữ nguyên cách dùng: link
// YouTube, link file âm thanh (.mp3, .ogg…) hoặc file trên máy; bấm "Ghi mốc" ngay trong bảng "Theo dõi khi nghe".
// Trang có thể gợi ý sẵn một bản thu giấy phép mở (data-rec, dựng từ ban_thu của bản ghi tác phẩm), kèm mốc tham khảo
// cho từng dòng của bảng (ref: số giây trong bản thu gợi ý, null nếu chưa có); người học bật/tắt để tự so sánh.
// Mốc lưu trong trình duyệt (src/scripts/tien-do.js), riêng cho từng bản thu, và xuất được ra Markdown.
// Khác bản cũ: là module (mount), lưu qua tien-do.js, tìm bảng sau khối tiêu đề của Starlight, đọc được mốc lưu ở site cũ.
// Ngoài mấy chỗ đó, mã, tên hàm và cách viết giữ như listen.js (khoảng 35 dòng khác) để dễ đối chiếu với bản cũ.
import { datKho, layKho } from "./tien-do.js";
let apiPromise = null;

function loadApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise(function (resolve, reject) {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prev) prev(); resolve(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = function () { apiPromise = null; reject(new Error("api")); };
    document.head.appendChild(s);
  });
  return apiPromise;
}

/* Lấy mã video từ các dạng link YouTube thường gặp */
function videoId(url) {
  const s = String(url || "").trim();
  const m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/.exec(s);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
}
/* Link trực tiếp tới một file âm thanh (kể cả dạng Special:FilePath của Wikimedia Commons) */
const EXT = { mp3: "audio/mpeg", ogg: "audio/ogg", oga: "audio/ogg", opus: "audio/ogg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", flac: "audio/flac", webm: "audio/webm" };
function audioExt(url) {
  const m = /\.([a-z0-9]{2,4})(?:[?#].*)?$/i.exec(String(url || "").trim());
  return m && EXT[m[1].toLowerCase()] ? m[1].toLowerCase() : null;
}
function audioUrl(url) {
  const s = String(url || "").trim();
  if (!/^https?:\/\/[^\s/]+\.[^\s/]+\/\S+$/i.test(s) || videoId(s)) return null;
  return audioExt(s) || /\/Special:FilePath\//.test(s) ? s : null;
}
function fmt(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
}
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
/* Link mở từng phần của bản thu chỉ dẫn link */
function openLinks(parts) {
  const a = function (p, text) { return '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(text) + "</a>"; };
  return parts.length === 1 ? a(parts[0], "Mở bản thu") + "." :
    "Mở từng phần: " + parts.map(function (p, i) { return a(p, p.t || "Phần " + (i + 1)); }).join(", ") + ".";
}

/* Đổi bản thu: cất mốc của bản cũ vào byUrl, lấy lại mốc đã có của bản mới (thuần, để kiểm thử) */
function switchSource(v, k) {
  v = v || { url: "", marks: {} };
  if (v.url === k) return v;
  if (!v.url) return Object.assign({}, v, { url: k });   /* bản thu đầu tiên nhận luôn các mốc đang có */
  const by = Object.assign({}, v.byUrl || {});
  if (v.url && v.marks && Object.keys(v.marks).length) by[v.url] = v.marks;
  const out = { url: k, marks: by[k] || {} };
  delete by[k];
  if (Object.keys(by).length) out.byUrl = by;
  return out;
}

/* Bản thu gợi ý của trang: data-rec (JSON, một hoặc nhiều phần) hoặc dạng cũ data-audio.
   Phần không có mp3 mà chỉ có link (trang của file ở nguồn): bản thu chỉ dẫn link, không phát trên trang;
   mốc tham khảo vẫn hiện, tính theo file ở link. */
function readRec(root) {
  let r = null;
  if (root.dataset.rec) { try { r = JSON.parse(root.dataset.rec); } catch (e) { r = null; } }
  if (!r && root.dataset.audio) r = { by: root.dataset.credit || "", page: root.dataset.page || "", parts: [{ mp3: root.dataset.audio, src: root.dataset.audioOgg || "" }] };
  if (!r || !r.parts || !r.parts.length) return null;
  r.linkOnly = r.parts.every(function (p) { return !p.mp3 && p.link; });
  if (!r.linkOnly && !r.parts[0].mp3) return null;
  r.key = r.linkOnly ? r.parts[0].link : r.parts[0].mp3;
  r.ref = Array.isArray(r.ref) ? r.ref.map(function (x) { return typeof x === "number" && x >= 0 ? x : null; }) : [];
  return r;
}
/* Vị trí của thời điểm t (giây, tính liền qua các phần) trong danh sách phần: [phần, giây trong phần] */
function partAt(t, durs) {
  let i = 0, acc = 0;
  while (i < durs.length - 1 && t >= acc + (Number(durs[i]) || 0)) { acc += Number(durs[i]) || 0; i++; }
  return [i, Math.max(0, t - acc)];
}

/* So mốc của người học với mốc tham khảo: lệch không quá TOL giây coi là khớp */
const TOL = 2;
function compare(mark, ref) {
  const d = Math.round(mark - ref);
  if (Math.abs(d) <= TOL) return { d: d, ok: true, text: "khớp" };
  return { d: d, ok: false, text: (d > 0 ? "muộn " : "sớm ") + Math.abs(d) + " giây" };
}
/* Tóm tắt so sánh: bao nhiêu dòng có cả hai mốc, bao nhiêu dòng khớp */
function tally(marks, ref) {
  let n = 0, ok = 0;
  (ref || []).forEach(function (r, i) { if (r === null || r === undefined || marks[i] === undefined) return; n++; if (compare(marks[i], r).ok) ok++; });
  return { n: n, ok: ok };
}

/* Dòng đang nghe: mốc gần nhất không muộn hơn thời điểm đang phát (cho phép sớm 0,25 giây) */
function activeRow(t, marks) {
  let best = -1, bt = -1;
  Object.keys(marks).forEach(function (i) { const v = marks[i]; if (v <= t + 0.25 && v > bt) { bt = v; best = Number(i); } });
  return best;
}
/* Hàm thuần, cho kiểm thử (tests/nghe.test.mjs), như window.OZListen của bản cũ */
export { activeRow, audioUrl, compare, partAt, readRec, switchSource, tally, videoId };

function findTable(root) {
  const article = root.closest(".sl-markdown-content") || document;
  const heads = article.querySelectorAll("h2");
  for (let i = 0; i < heads.length; i++) {
    if (/Theo dõi khi nghe/.test(heads[i].textContent)) {
      /* Starlight bọc tiêu đề trong div.sl-heading-wrapper (kèm link #mục): bảng nằm sau khối bọc ấy */
      let el = (heads[i].closest(".sl-heading-wrapper") || heads[i]).nextElementSibling;
      while (el && el.tagName !== "H2" && !(el.classList && el.classList.contains("level-h2"))) {
        const t = el.tagName === "TABLE" ? el : el.querySelector && el.querySelector("table");
        if (t) return t;
        el = el.nextElementSibling;
      }
    }
  }
  return null;
}

export function mount(root) {
  if (root.dataset.ready) return;
  root.dataset.ready = "1";
  root.classList.add("oz-tool");
  const key = location.pathname;
  const store = function () { return layKho("listen", {}); };
  /* Site cũ ở /opus-zero/ lưu mốc theo đường dẫn cũ: vẫn đọc được (cùng tên miền nên dữ liệu còn đó) */
  const keyCu = key.replace(/^\/opus\//, "/opus-zero/");
  const mine = function () { return store()[key] || store()[keyCu] || { url: "", marks: {} }; };
  const save = function (v) { const all = store(); all[key] = v; datKho("listen", all); };
  const def = readRec(root);
  const ref = def ? def.ref : [];
  const hasRef = ref.some(function (x) { return x !== null; });
  /* Bật/tắt mốc tham khảo: nhớ riêng cho từng trang, trên máy này */
  const RKEY = "opus-zero:listen-ref";
  function refPref(on) {
    try {
      const all = JSON.parse(localStorage.getItem(RKEY) || "{}") || {};
      if (on === undefined) return !!(all[key] || all[keyCu]);
      if (on) all[key] = 1; else delete all[key];
      localStorage.setItem(RKEY, JSON.stringify(all));
    } catch (e) { /* trình duyệt chặn bộ nhớ: vẫn dùng được, chỉ không nhớ lựa chọn */ }
    return !!on;
  }
  let showRef = hasRef && refPref();

  root.innerHTML =
    '<p class="oz-stats">Nghe một bản thu: dán link YouTube hoặc link tới một file âm thanh (.mp3, .ogg…), hoặc chọn một file trên máy bạn. Rồi bấm <strong>Ghi mốc</strong> trong bảng bên dưới mỗi khi nghe thấy sự kiện tương ứng. Mốc được lưu trên máy bạn, riêng cho từng bản thu; bấm vào mốc để tua đến đó.</p>' +
    (def ? '<p class="oz-stats oz-rec">Bản thu gợi ý: ' + esc(def.by || "bản thu có giấy phép mở") + (def.note ? " (" + esc(def.note) + ")" : "") +
      (def.lic ? " · " + (def.licUrl ? '<a href="' + esc(def.licUrl) + '" target="_blank" rel="license noopener">' + esc(def.lic) + "</a>" : esc(def.lic)) : "") +
      (def.page ? ' · <a href="' + esc(def.page) + '" target="_blank" rel="noopener">' + (/imslp\.org\//.test(def.page) ? "IMSLP" : "Wikimedia Commons") + "</a>" : "") +
      (def.parts.length > 1 ? " · " + def.parts.length + " phần" : "") + ". " +
      (def.linkOnly ? openLinks(def.parts) + " Trang này chỉ dẫn link, không phát bản thu này; mốc tham khảo tính theo file ở link.</p>" :
        '<button class="oz-btn" data-act="default">Nghe bản này</button></p>') : "") +
    (hasRef ? '<div class="oz-ref-row"><label class="oz-ref-toggle"><input type="checkbox" class="oz-ref-on"> Hiện mốc tham khảo trong bảng</label>' +
      '<p class="oz-stats oz-ref-sum" aria-live="polite"></p></div>' : "") +
    '<div class="oz-row"><input type="url" class="oz-input" placeholder="Link YouTube hoặc link file .mp3, .ogg" aria-label="Link bản thu: YouTube hoặc file âm thanh">' +
    '<button class="oz-btn oz-btn--primary" data-act="load">Tải bản thu</button>' +
    '<button class="oz-btn" data-act="file">Chọn file trên máy</button>' +
    '<input type="file" accept="audio/*" hidden aria-label="Chọn file âm thanh trên máy">' +
    '<button class="oz-btn" data-act="export">Xuất mốc ra Markdown</button></div>' +
    '<div class="oz-video" hidden><div class="oz-yt"></div></div>' +
    '<audio class="oz-audio" controls preload="none" hidden></audio>' +
    '<select class="oz-input oz-part" hidden aria-label="Chọn phần của bản thu"></select>' +
    '<div class="oz-feedback" aria-live="polite"></div>';
  const input = root.querySelector('input[type="url"]'), fileIn = root.querySelector('input[type="file"]');
  const fb = root.querySelector(".oz-feedback"), box = root.querySelector(".oz-video"), audio = root.querySelector("audio"), sel = root.querySelector(".oz-part");
  let yt = null, player = null, objUrl = null, curSrc = "";
  const saved = mine().url || "";
  input.value = /^file:/.test(saved) || (def && saved === def.key) ? "" : saved;
  const say = function (msg, cls) { fb.textContent = msg; fb.className = "oz-feedback" + (cls ? " " + cls : ""); };
  const use = function (k) { const v = mine(); if (v.url !== k) { save(switchSource(v, k)); renderCells(); } };

  const table = findTable(root);
  const cells = [];
  if (table) {
    table.querySelectorAll("tbody tr").forEach(function (tr, i) {
      const td = tr.querySelector("td");
      if (!td || td.textContent.trim() !== "…") return;
      td.classList.add("oz-mark-cell");
      cells.push({ i: i, td: td, tr: tr });
    });
  }
  function renderCells() {
    const v = mine(), marks = v.marks || {};
    const onDef = !!def && v.url === def.key;
    cells.forEach(function (c) {
      c.td.innerHTML = "";
      if (marks[c.i] !== undefined) {
        const t = document.createElement("button");
        t.className = "oz-btn oz-time"; t.textContent = fmt(marks[c.i]); t.title = "Tua đến mốc này";
        t.addEventListener("click", function () { if (player) player.seek(marks[c.i]); else say("Tải bản thu trước (bản gợi ý, link hoặc file trên máy) để tua đến mốc."); });
        const x = document.createElement("button");
        x.className = "oz-btn oz-time-x"; x.textContent = "×"; x.title = "Xóa mốc"; x.setAttribute("aria-label", "Xóa mốc");
        x.addEventListener("click", function () { const v = mine(); delete v.marks[c.i]; save(v); renderCells(); });
        c.td.appendChild(t); c.td.appendChild(x);
      } else {
        const b = document.createElement("button");
        b.className = "oz-btn oz-time-add"; b.textContent = "Ghi mốc";
        b.addEventListener("click", function () {
          if (!player) { say("Hãy chọn một bản thu trước: bản gợi ý, link YouTube, link file âm thanh hoặc file trên máy.", "bad"); return; }
          const v = mine(); v.marks = v.marks || {}; v.marks[c.i] = Math.round(player.time()); save(v); renderCells();
          say("Đã ghi mốc " + fmt(v.marks[c.i]) + ".", "ok");
        });
        c.td.appendChild(b);
      }
      const r = ref[c.i];
      if (showRef && r !== null && r !== undefined) {
        const box = document.createElement("span");
        box.className = "oz-ref";
        box.appendChild(document.createTextNode("Tham khảo "));
        if (def.linkOnly) {
          /* không phát được trên trang: ghi thời điểm trong từng file (phần) để nghe theo ở nơi khác */
          const at = partAt(r, def.parts.map(function (p) { return Number(p.d) || 0; }));
          const rt = document.createElement("span");
          rt.className = "oz-ref-time"; rt.textContent = fmt(at[1]) + (def.parts.length > 1 ? ", phần " + (at[0] + 1) : "");
          box.appendChild(rt);
        } else {
          const rb = document.createElement("button");
          rb.className = "oz-btn oz-ref-time"; rb.textContent = fmt(r);
          rb.title = "Nghe từ mốc này trong bản thu gợi ý";
          rb.setAttribute("aria-label", "Mốc tham khảo " + fmt(r) + ": nghe từ đây trong bản thu gợi ý");
          rb.addEventListener("click", function () { seekRef(r); });
          box.appendChild(rb);
        }
        if (onDef && marks[c.i] !== undefined) {
          const cmp = compare(marks[c.i], r), d = document.createElement("span");
          d.className = "oz-ref-d " + (cmp.ok ? "ok" : "off"); d.textContent = cmp.text;
          box.appendChild(d);
        }
        c.td.appendChild(box);
      } else if (showRef) {
        const none = document.createElement("span");
        none.className = "oz-ref oz-ref-none";
        none.textContent = "Tham khảo: chưa có";
        none.title = "Bản thu gợi ý không có đoạn này (ví dụ nghệ sĩ không chơi dấu nhắc lại), hoặc chưa căn được mốc đủ chính xác.";
        c.td.appendChild(none);
      }
    });
    refSummary(v, onDef);
  }
  const refBox = root.querySelector(".oz-ref-on"), refSum = root.querySelector(".oz-ref-sum");
  function refSummary(v, onDef) {
    if (!refSum) return;
    if (!showRef) { refSum.textContent = "Mốc tham khảo là thời điểm từng sự kiện trong bản thu gợi ý, căn theo bản nhạc (thường lệch dưới 2 giây). Hãy tự ghi mốc trước, rồi bật lên để so sánh."; return; }
    if (def.linkOnly) { refSum.textContent = "Mốc tham khảo là thời điểm trong file ở link phía trên" + (def.parts.length > 1 ? ", tính trong từng phần" : "") + ". Muốn ghi mốc ngay tại đây, tải file về rồi bấm “Chọn file trên máy”."; return; }
    if (!onDef) { refSum.textContent = "Mốc tham khảo theo bản thu gợi ý. Bấm vào một mốc để nghe bản ấy từ đó; ghi mốc trên bản ấy để so sánh."; return; }
    const t = tally(v.marks || {}, ref);
    refSum.textContent = t.n ? "So sánh: " + t.ok + "/" + t.n + " mốc của bạn khớp với mốc tham khảo (lệch không quá " + TOL + " giây)." :
      "Bấm “Ghi mốc” khi nghe thấy từng sự kiện; bảng sẽ cho biết mốc của bạn sớm hay muộn so với mốc tham khảo.";
  }
  if (refBox) {
    refBox.checked = showRef;
    refBox.addEventListener("change", function () { showRef = refPref(refBox.checked); renderCells(); current = -2; });
  }
  function seekRef(t) {
    if (!def) return;
    if (curSrc !== def.key || !player) loadDefault();
    player.seek(t);
  }
  renderCells();
  if (!cells.length) say("Trang này không có bảng mốc thời gian; bạn vẫn có thể nghe bản thu ở đây.");
  else if (/^file:/.test(saved)) say("Lần trước bạn nghe file “" + saved.slice(5) + "” trên máy. Chọn lại đúng file ấy để dùng các mốc đã ghi.");

  /* Bản đồ nghe chạy theo bản thu: tô sáng dòng có mốc gần nhất trước thời điểm đang phát.
     Chỉ chạy khi có trình phát, dừng khi rời trang; mỗi 400 ms chỉ đổi lớp CSS nếu dòng thay đổi. */
  let timer = 0, current = -1;
  function follow() {
    clearInterval(timer);
    timer = setInterval(function () {
      if (!root.isConnected) { clearInterval(timer); return; }
      if (!player) return;
      let marks = mine().marks || {};
      if (showRef && def && curSrc === def.key) {
        const m = {}; ref.forEach(function (x, i) { if (x !== null) m[i] = x; });
        marks = Object.assign(m, marks);
      }
      const r = Object.keys(marks).length ? activeRow(player.time(), marks) : -1;
      if (r === current) return;
      current = r;
      cells.forEach(function (c) { c.tr.classList.toggle("oz-now", c.i === r); });
    }, 400);
  }
  function stopVideo() { box.hidden = true; sel.hidden = true; if (yt && yt.pauseVideo) { try { yt.pauseVideo(); } catch (e) { /* trình phát chưa sẵn sàng */ } } }
  function audioPlayer() {
    return { time: function () { return audio.currentTime || 0; },
      seek: function (t) { audio.currentTime = t; const p = audio.play(); if (p && p.catch) p.catch(function () {}); } };
  }
  /* Một phần của bản thu: thẻ <source> cho từng định dạng (mp3 trước), trình duyệt tự chọn cái phát được */
  function setSources(p) {
    audio.removeAttribute("src"); audio.innerHTML = "";
    const list = [p.mp3, p.src].filter(Boolean);
    list.forEach(function (u, j) {
      const s = document.createElement("source"); s.src = u;
      const ext = audioExt(u); if (ext) s.type = EXT[ext];
      if (j === list.length - 1) s.addEventListener("error", function () { say("Không phát được bản thu này. Hãy kiểm tra kết nối mạng; nếu là link bạn tự dán, link phải trỏ thẳng tới một file âm thanh (.mp3, .ogg…).", "bad"); });
      audio.appendChild(s);
    });
  }
  /* Phát một bản thu gồm một hoặc nhiều phần; thời gian và mốc tính liền qua các phần */
  function showParts(parts) {
    stopVideo();
    if (!audio.paused) audio.pause();
    const durs = parts.map(function (p) { return Number(p.d) || 0; });
    const offs = durs.map(function (d, i) { return durs.slice(0, i).reduce(function (a, b) { return a + b; }, 0); });
    let cur = 0;
    const play = function () { const pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); };
    function load(i, t, go) {
      cur = i; setSources(parts[i]); audio.load();
      if (parts.length > 1) sel.value = String(i);
      if (t || go) {
        const ready = function () { audio.removeEventListener("loadedmetadata", ready); if (t) audio.currentTime = t; if (go) play(); };
        audio.addEventListener("loadedmetadata", ready);
      }
    }
    audio.onended = function () { if (cur < parts.length - 1) load(cur + 1, 0, true); };
    if (parts.length > 1) {
      sel.innerHTML = parts.map(function (p, i) { return '<option value="' + i + '">' + esc(p.t || "Phần " + (i + 1)) + "</option>"; }).join("");
      sel.onchange = function () { load(Number(sel.value), 0, true); };
      sel.hidden = false;
    } else sel.hidden = true;
    audio.hidden = false;
    load(0, 0, false);
    player = {
      time: function () { return offs[cur] + (audio.currentTime || 0); },
      seek: function (t) {
        const at = partAt(t, durs);
        if (at[0] === cur && audio.readyState > 0) { audio.currentTime = at[1]; play(); } else load(at[0], at[1], true);
      }
    };
    follow();
  }
  function showYouTube(id) {
    if (!audio.paused) audio.pause();
    audio.hidden = true; sel.hidden = true;
    say("Đang tải…");
    loadApi().then(function () {
      box.hidden = false;
      const ready = function () { player = { time: function () { return yt.getCurrentTime ? yt.getCurrentTime() : 0; }, seek: function (t) { yt.seekTo(t, true); yt.playVideo(); } }; follow(); };
      if (yt && yt.loadVideoById) { yt.loadVideoById(id); say(""); ready(); return; }
      yt = new YT.Player(root.querySelector(".oz-yt"), {
        host: "https://www.youtube-nocookie.com",
        videoId: id, width: "100%", height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: { onReady: function () { say("Sẵn sàng. Bấm phát rồi “Ghi mốc” khi nghe thấy từng sự kiện. Dòng đang nghe sẽ được tô sáng theo các mốc đã ghi.", "ok"); ready(); } }
      });
    }).catch(function () { say("Không tải được trình phát YouTube. Kiểm tra kết nối mạng.", "bad"); });
  }
  function load() {
    const raw = input.value.trim(), id = videoId(raw), au = id ? null : audioUrl(raw);
    if (!id && !au) { say("Link chưa đúng. Hãy dán link YouTube (youtube.com/watch?v=… hoặc youtu.be/…) hoặc link trực tiếp tới một file âm thanh (.mp3, .ogg…).", "bad"); return; }
    use(raw); curSrc = raw;
    if (id) showYouTube(id);
    else { showParts([{ mp3: au }]); say("Sẵn sàng. Bấm phát ▶ rồi “Ghi mốc” khi nghe thấy từng sự kiện.", "ok"); }
  }
  function loadDefault() {
    use(def.key); input.value = ""; curSrc = def.key;
    showParts(def.parts);
    say(def.parts.length > 1 ? "Đã tải bản thu gợi ý, gồm " + def.parts.length + " phần; hết phần này trình phát tự sang phần sau. Bấm phát ▶; mốc của bản này được lưu riêng." : "Đã tải bản thu gợi ý. Bấm phát ▶; mốc của bản này được lưu riêng.", "ok");
  }
  fileIn.addEventListener("change", function () {
    const f = fileIn.files && fileIn.files[0]; if (!f) return;
    if (objUrl) URL.revokeObjectURL(objUrl);
    objUrl = URL.createObjectURL(f);
    use("file:" + f.name); input.value = ""; curSrc = "file:" + f.name;
    stopVideo();
    if (!audio.paused) audio.pause();
    audio.onended = null; audio.innerHTML = ""; audio.src = objUrl; audio.hidden = false; audio.load();
    player = audioPlayer(); follow();
    say("Đang dùng file “" + f.name + "” trên máy bạn; file không được gửi đi đâu. Mốc được lưu theo tên file, lần sau chọn lại đúng file này để dùng tiếp.", "ok");
  });
  function exportMd() {
    const marks = mine().marks || {};
    if (!table) return;
    const head = Array.prototype.map.call(table.querySelectorAll("thead th"), function (h) { return h.textContent.trim(); });
    const rows = Array.prototype.map.call(table.querySelectorAll("tbody tr"), function (tr, i) {
      const tds = Array.prototype.map.call(tr.querySelectorAll("td"), function (td, j) {
        return j === 0 && td.classList.contains("oz-mark-cell") ? (marks[i] !== undefined ? fmt(marks[i]) : "…") : td.textContent.trim().replace(/\|/g, "\\|");
      });
      return "| " + tds.join(" | ") + " |";
    });
    const u = mine().url || "";
    const src = /^file:/.test(u) ? "file trên máy (" + u.slice(5) + ")" : (u || "(chưa có link)");
    const md = "Bản thu: " + src + "\n\n| " + head.join(" | ") + " |\n|" + head.map(function () { return "---"; }).join("|") + "|\n" + rows.join("\n") + "\n";
    const done = function () { say("Đã sao chép. Dán vào file .md của trang này để lưu vĩnh viễn.", "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(md).then(done, function () { window.prompt("Sao chép đoạn sau:", md); });
    else window.prompt("Sao chép đoạn sau:", md);
  }
  root.addEventListener("click", function (e) {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    if (b.dataset.act === "load") load();
    if (b.dataset.act === "default") loadDefault();
    if (b.dataset.act === "file") fileIn.click();
    if (b.dataset.act === "export") exportMd();
  });
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") load(); });
}
