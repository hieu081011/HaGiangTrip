/* Logic hiển thị bản đồ + lịch trình. Dữ liệu chuyến đi nằm ở js/data.js,
 * chuỗi giao diện song ngữ nằm ở js/i18n.js */

const ICONS = {
  city: '<path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M10 21v-6h4v6"/>',
  sight: '<path d="M3 21h18M6 21V10M18 21V10M12 3 3 9h18z"/>',
  view: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 6h3v12"/>',
  stay: '<path d="M3 18V7M3 13h18v5M21 18v-3a3 3 0 0 0-3-3h-7v1"/><circle cx="7" cy="10" r="1.5"/>',
  fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10M14 8l3 2v8a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
  eat: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 6h3v12"/>',
  move: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h5l3-6h4l-3 6M9 8h4"/>',
  other: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  nav: '<path d="m3 11 18-8-8 18-2-8z"/>',
  img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>',
};
// màu theo loại; tên loại hiển thị lấy từ js/i18n.js (types)
const TYPE = {
  city: { color: "#495057", bg: "#F1F3F5" },
  sight: { color: "#7048E8", bg: "#F3F0FF" },
  view: { color: "#0C8599", bg: "#E3FAFC" },
  food: { color: "#E8590C", bg: "#FFF4E6" },
  eat: { color: "#E8590C", bg: "#FFF4E6" },
  stay: { color: "#C2255C", bg: "#FFF0F6" },
  fuel: { color: "#5C940D", bg: "#F4FCE3" },
  move: { color: "#1864AB", bg: "#E7F5FF" },
  other: { color: "#495057", bg: "#F1F3F5" },
};
const typeLabel = (k) => t("types")[k] || t("types").other;
const svg = (k, stroke = "currentColor") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.other}</svg>`;
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
const P = CONFIG.places;
const dayById = (id) => CONFIG.days.find((d) => d.id === id);
const dayDate = (i) => {
  if (!CONFIG.trip.startDate) return null;
  const d = new Date(CONFIG.trip.startDate + "T00:00:00");
  d.setDate(d.getDate() + i);
  return d;
};
const fmtDate = (d) =>
  d
    ? d.toLocaleDateString(LANG === "vi" ? "vi-VN" : "en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      })
    : "";
const gmapsPoint = (p) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
// các điểm dừng thật của 1 ngày (bỏ điểm 'via' chỉ dùng để nắn tuyến)
const stopsOf = (d) => d.route.filter((id) => P[id].type !== "via");
const gmapsDay = (d) =>
  "https://www.google.com/maps/dir/" +
  d.route.map((id) => `${P[id].lat},${P[id].lng}`).join("/");
const imgSearch = (p) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(p.name.replace(/[\[\]]/g, "") + " Hà Giang")}`;

/* Header */
function renderHeader() {
  $("#tripTitle").textContent = tr(CONFIG.trip, "title");
  $("#tripSub").textContent = tr(CONFIG.trip, "subtitle");
  // nút hiện ngôn ngữ sẽ chuyển sang
  $("#btnLang span").textContent = LANG === "vi" ? "EN" : "VI";
  $("#btnLang").setAttribute("aria-label", t("switchLang"));
}

/* ---------------- MAP ---------------- */
const map = L.map("map", {
  zoomControl: false,
  attributionControl: true,
  preferCanvas: true, // vẽ tuyến bằng canvas — nhẹ hơn SVG trên điện thoại
}).setView([23.1, 105.2], 9);
const layers = [
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }),
  L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: "© OpenTopoMap, © OpenStreetMap",
  }),
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, attribution: "© Esri" },
  ),
];
let layerIdx = 0;
layers[0].addTo(map);
$("#btnLayer").onclick = () => {
  map.removeLayer(layers[layerIdx]);
  layerIdx = (layerIdx + 1) % layers.length;
  layers[layerIdx].addTo(map);
  toast(t("layers")[layerIdx]);
};

let currentDay = "all";
const dayLayers = {}; // id -> {casing, line, markers:[], stats}

function pinIcon(day, n, dim) {
  return L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div class="pin${dim ? " dim" : ""}" style="background:${day.color}">${n}</div>`,
  });
}
function extraIcon(p) {
  return L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div class="pin extra" style="border-color:${TYPE[p.type].color};color:${TYPE[p.type].color}">${svg(p.type)}</div>`,
  });
}

function cacheGet(k) {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch (e) {
    return null;
  }
}
function cacheSet(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}

// Đơn giản hoá tuyến (Douglas–Peucker) với sai số ~tol mét:
// OSRM trả về hàng nghìn điểm, mắt thường không phân biệt được sau khi rút gọn
function simplifyRoute(latlngs, tol = 8) {
  const lat0 = (latlngs[0][0] * Math.PI) / 180;
  const pts = latlngs.map((ll, i) => {
    const p = L.point(ll[1] * 111320 * Math.cos(lat0), ll[0] * 110540);
    p._i = i;
    return p;
  });
  return L.LineUtil.simplify(pts, tol).map((p) => latlngs[p._i]);
}

async function fetchRoute(day) {
  const coords = day.route
    .map((id) => `${P[id].lng},${P[id].lat}`)
    .join(";");
  const key = "hg-route-v2-" + coords;
  try {
    localStorage.removeItem("hg-route-v1-" + coords); // bản cache cũ chưa rút gọn
  } catch (e) {}
  const cached = cacheGet(key);
  if (cached) return cached;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("route " + r.status);
  const j = await r.json();
  if (!j.routes || !j.routes[0]) throw new Error("no route");
  const rt = j.routes[0];
  const out = {
    latlngs: simplifyRoute(
      rt.geometry.coordinates.map((c) => [c[1], c[0]]),
    ),
    km: rt.distance / 1000,
    min: rt.duration / 60,
  };
  cacheSet(key, out);
  return out;
}

function buildDay(day, idx) {
  const straight = day.route.map((id) => [P[id].lat, P[id].lng]);
  const casing = L.polyline(straight, {
    color: "#fff",
    weight: 9,
    opacity: 0.9,
    dashArray: "2 10",
  }).addTo(map);
  const line = L.polyline(straight, {
    color: day.color,
    weight: 5,
    opacity: 0.9,
    dashArray: "2 10",
  }).addTo(map);
  const markers = [];
  stopsOf(day).forEach((id, i) => {
    const m = L.marker([P[id].lat, P[id].lng], {
      icon: pinIcon(day, i + 1),
      riseOnHover: true,
    })
      .addTo(map)
      .bindTooltip(tr(P[id], "name"), {
        className: "lbl",
        direction: "top",
        offset: [0, -14],
      })
      .on("click", () => openPlace(id, day.id));
    m._num = i + 1;
    m._id = id;
    markers.push(m);
  });
  (day.extras || []).forEach((id) => {
    const m = L.marker([P[id].lat, P[id].lng], { icon: extraIcon(P[id]) })
      .addTo(map)
      .bindTooltip(tr(P[id], "name"), {
        className: "lbl",
        direction: "top",
        offset: [0, -14],
      })
      .on("click", () => openPlace(id, day.id));
    m._extra = id;
    m._id = id;
    markers.push(m);
  });
  line.on("click", () => selectDay(day.id));
  casing.on("click", () => selectDay(day.id));
  dayLayers[day.id] = { casing, line, markers, stats: null };

  fetchRoute(day)
    .then((res) => {
      casing.setLatLngs(res.latlngs);
      line.setLatLngs(res.latlngs);
      casing.setStyle({ dashArray: null });
      line.setStyle({ dashArray: null });
      dayLayers[day.id].stats = res;
      applyDayStyle();
      renderTray();
      renderSchedule();
    })
    .catch(() => toast(t("routeFail", { day: tr(day, "label") })));
}

function applyDayStyle() {
  CONFIG.days.forEach((d) => {
    const L_ = dayLayers[d.id];
    if (!L_) return;
    const active = currentDay === "all" || currentDay === d.id;
    L_.line.setStyle({
      opacity: active ? 0.95 : 0.2,
      weight: currentDay === d.id ? 7 : 5,
    });
    L_.casing.setStyle({
      opacity: active ? 0.95 : 0.15,
      weight: currentDay === d.id ? 11 : 9,
    });
    // viền trắng phải nằm ngay dưới đường màu của chính nó
    if (active) {
      L_.casing.bringToFront();
      L_.line.bringToFront();
    }
    L_.markers.forEach((m) => {
      if (m._extra) {
        active ? m.addTo(map) : map.removeLayer(m);
        return;
      }
      m.setIcon(pinIcon(d, m._num, !active));
      m.setZIndexOffset(active ? 1000 : 0);
    });
  });
  if (currentDay !== "all") {
    dayLayers[currentDay].casing.bringToFront();
    dayLayers[currentDay].line.bringToFront();
  }
}

function fitView() {
  const pts = [];
  CONFIG.days.forEach((d) => {
    if (currentDay !== "all" && currentDay !== d.id) return;
    pts.push(...dayLayers[d.id].line.getLatLngs());
    (d.extras || []).forEach((id) => pts.push([P[id].lat, P[id].lng]));
  });
  if (!pts.length) return;
  const wide = window.innerWidth >= 900;
  map.fitBounds(L.latLngBounds(pts), {
    paddingTopLeft: [wide ? 430 : 20, 70],
    paddingBottomRight: [wide ? 70 : 20, wide ? 150 : 170],
  });
}

function selectDay(id) {
  currentDay = id;
  document
    .querySelectorAll("#dayChips .chip")
    .forEach((c) => c.setAttribute("aria-pressed", c.dataset.day === id));
  closeSheet();
  applyDayStyle();
  renderTray();
  fitView();
}

function renderChips() {
  const chips = [
    { id: "all", label: t("allDays"), color: null },
    ...CONFIG.days.map((d) => ({ ...d, label: tr(d, "label") })),
  ];
  $("#dayChips").innerHTML = chips
    .map(
      (c) =>
        `<button class="chip" data-day="${c.id}" aria-pressed="${c.id === currentDay}">${c.color ? `<span class="sw" style="background:${c.color}"></span>` : ""}${esc(c.label)}</button>`,
    )
    .join("");
  $("#dayChips").onclick = (e) => {
    const b = e.target.closest(".chip");
    if (b) selectDay(b.dataset.day);
  };
}

const hm = (min) => {
  const m = Math.round(min); // làm tròn trước để không ra "4h60"
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
};
const stat = (s) =>
  s ? t("ride", { km: Math.round(s.km), time: hm(s.min) }) : t("calc");

function renderTray() {
  const head = $("#trayHead"),
    stops = $("#stops");
  if (currentDay === "all") {
    const tot = CONFIG.days.reduce(
      (a, d) => a + (dayLayers[d.id]?.stats?.km || 0),
      0,
    );
    head.innerHTML = `<span class="dot" style="background:var(--accent)"></span><div><h2>${t("nDays", { n: CONFIG.days.length })} · ${tot ? Math.round(tot) + " km" : "…"}</h2><p>${t("tapDay")}</p></div>`;
    stops.innerHTML = CONFIG.days
      .map(
        (d, i) => `<button class="stop daycard" data-day="${d.id}">
<span class="num" style="background:${d.color}">${i + 1}</span>
<span><b>${esc(tr(d, "title"))}</b><small>${stat(dayLayers[d.id]?.stats)}</small></span></button>`,
      )
      .join("");
  } else {
    const d = dayById(currentDay),
      i = CONFIG.days.indexOf(d);
    head.innerHTML = `<span class="dot" style="background:${d.color}"></span>
<div><h2>${esc(tr(d, "label"))}${dayDate(i) ? " · " + fmtDate(dayDate(i)) : ""}</h2><p>${stat(dayLayers[d.id]?.stats)}</p></div>
<a class="gm" href="${gmapsDay(d)}" target="_blank" rel="noopener">${svg("nav")}Google Maps</a>`;
    const items = stopsOf(d)
      .map((id, k) => ({ id, k: k + 1 }))
      .concat((d.extras || []).map((id) => ({ id, k: null })));
    stops.innerHTML = items
      .map(({ id, k }) => {
        const p = P[id],
          s = d.schedule.find((x) => x.place === id);
        return `<button class="stop" data-place="${id}" data-day="${d.id}">
  ${k ? `<span class="num" style="background:${d.color}">${k}</span>` : `<span class="ic" style="color:${TYPE[p.type].color}">${svg(p.type)}</span>`}
  <span><b>${esc(tr(p, "name"))}</b><small>${s ? s.time + " · " : ""}${typeLabel(p.type)}</small></span></button>`;
      })
      .join("");
  }
}
$("#stops").onclick = (e) => {
  const b = e.target.closest(".stop");
  if (!b) return;
  if (b.dataset.place) openPlace(b.dataset.place, b.dataset.day);
  else selectDay(b.dataset.day);
};
// con lăn chuột chỉ cuộn dọc → đổi thành cuộn ngang cho dải thẻ
$("#stops").addEventListener(
  "wheel",
  (e) => {
    const s = e.currentTarget;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (s.scrollWidth <= s.clientWidth) return;
    e.preventDefault();
    s.scrollLeft += e.deltaY;
  },
  { passive: false },
);

/* Detail sheet */
let openedPlace = null; // { id, dayId } — để dịch lại sheet khi đổi ngôn ngữ
function openPlace(id, dayId, pan = true) {
  const p = P[id],
    d = dayById(dayId),
    ty = TYPE[p.type] || TYPE.other,
    name = tr(p, "name"),
    desc = tr(p, "desc"),
    info = tr(p, "info"),
    tips = tr(p, "tips");
  openedPlace = { id, dayId };
  const acts = [];
  CONFIG.days.forEach((dd) =>
    dd.schedule.forEach((s) => {
      if (s.place === id) acts.push({ ...s, day: dd });
    }),
  );
  const gallery =
    p.images && p.images.length
      ? `<div class="gallery">${p.images.map((im) => `<figure><img src="${esc(im.src)}" alt="${esc(im.caption || name)}" loading="lazy">${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`
      : `<div class="ph" style="background:${d ? d.color : "var(--ink)"}">
   <svg class="mtn" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 100 L70 30 L120 70 L190 10 L260 65 L310 35 L400 90 L400 100Z" fill="#fff"/></svg>
   ${svg("img", "#fff").replace("<svg", '<svg width="28" height="28"')}
   <b>${esc(name)}</b><span>${esc(t("noPhoto"))}</span></div>`;
  $("#sheetBody").innerHTML = `
${gallery}
<div class="badges">
<span class="badge" style="background:${ty.bg};color:${ty.color}">${typeLabel(p.type)}</span>
${acts.map((a) => `<span class="badge" style="background:${a.day.color};color:#fff">${esc(tr(a.day, "label"))} · ${a.time}</span>`).join("")}
</div>
<h3 id="sheetTitle">${esc(name)}</h3>
${desc ? `<p class="desc">${esc(desc)}</p>` : ""}
${acts.length ? `<ul class="sched-at">${acts.map((a) => `<li><b>${a.time}</b><span>${esc(tr(a, "title"))}${a.note ? " – " + esc(tr(a, "note")) : ""}</span></li>`).join("")}</ul>` : ""}
${
info && info.length
  ? `<ul class="info">${info.map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}
  <li><span>${t("coords")}</span><span>${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</span></li></ul>`
  : ""
}
${tips ? `<div class="tips"><b>${t("tips")}</b>${esc(tips)}</div>` : ""}
<div class="acts">
<a class="btn pri" href="${gmapsPoint(p)}" target="_blank" rel="noopener">${svg("nav")}${t("directions")}</a>
<a class="btn" href="${imgSearch(p)}" target="_blank" rel="noopener">${svg("img")}${t("photos")}</a>
</div>`;
  $("#sheet").classList.add("open");
  if (!pan) return;
  $("#sheet .sc").scrollTop = 0;
  map.panTo([p.lat, p.lng], { animate: true });
}
function closeSheet() {
  $("#sheet").classList.remove("open");
  openedPlace = null;
}
$("#sheetClose").onclick = closeSheet;
map.on("click", closeSheet);
/* vuốt xuống để đóng */
(() => {
  let y0 = null;
  const g = $("#sheet");
  g.addEventListener(
    "touchstart",
    (e) => {
      if ($("#sheet .sc").scrollTop <= 0) y0 = e.touches[0].clientY;
    },
    { passive: true },
  );
  g.addEventListener("touchend", (e) => {
    if (y0 !== null && e.changedTouches[0].clientY - y0 > 80)
      closeSheet();
    y0 = null;
  });
})();

/* Locate */
let meMarker = null,
  watchId = null;
$("#btnLocate").onclick = () => {
  if (!navigator.geolocation)
    return toast(t("noGeo"));
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    $("#btnLocate").classList.remove("on");
    if (meMarker) map.removeLayer(meMarker);
    meMarker = null;
    return;
  }
  $("#btnLocate").classList.add("on");
  toast(t("locating"));
  let first = true;
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const ll = [pos.coords.latitude, pos.coords.longitude];
      if (!meMarker)
        meMarker = L.circleMarker(ll, {
          radius: 9,
          color: "#fff",
          weight: 3,
          fillColor: "#1C7ED6",
          fillOpacity: 1,
        }).addTo(map);
      else meMarker.setLatLng(ll);
      if (first) {
        map.setView(ll, 13);
        first = false;
      }
    },
    () => {
      toast(t("geoFail"));
      $("#btnLocate").classList.remove("on");
      watchId = null;
    },
    { enableHighAccuracy: true, maximumAge: 15000 },
  );
};
$("#btnFit").onclick = fitView;

let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------------- SCHEDULE ---------------- */
const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
function renderSchedule() {
  const now = new Date(),
    nowMin = now.getHours() * 60 + now.getMinutes();
  $("#schChips").innerHTML = CONFIG.days
    .map(
      (d) =>
        `<a class="chip" href="#sec-${d.id}" style="text-decoration:none"><span class="sw" style="background:${d.color}"></span>${esc(tr(d, "label"))}</a>`,
    )
    .join("");
  $("#schList").innerHTML = CONFIG.days
    .map((d, i) => {
      const date = dayDate(i),
        isToday = date && date.toDateString() === now.toDateString();
      let nowIdx = -1;
      if (isToday)
        d.schedule.forEach((s, k) => {
          if (toMin(s.time) <= nowMin) nowIdx = k;
        });
      return `<section class="day-sec" id="sec-${d.id}">
<div class="day-hd" style="background:${d.color}">
  <div><div class="n">${esc(tr(d, "label"))}${date ? " · " + fmtDate(date) : ""}</div><h2>${esc(tr(d, "title"))}</h2>
  <p>${t("nActs", { n: d.schedule.length })}</p></div>
  <div class="meta">${dayLayers[d.id]?.stats ? Math.round(dayLayers[d.id].stats.km) + " km" : ""}</div>
</div>
<ol class="tl">${d.schedule
  .map((s, k) => {
    const ty = TYPE[s.type] || TYPE.other,
      p = s.place && P[s.place],
      pname = p ? tr(p, "name") : "";
    const cls = isToday
      ? k === nowIdx
        ? " now"
        : k < nowIdx
          ? " past"
          : ""
      : "";
    return `<li class="it${cls}">
    <div class="t">${s.time}${s.end ? `<small>– ${s.end}</small>` : ""}</div>
    <div class="d" style="border-color:${ty.color};color:${ty.color}">${svg(s.type)}</div>
    <div class="c">
      <h4>${esc(tr(s, "title"))}</h4>
      ${s.note ? `<p>${esc(tr(s, "note"))}</p>` : ""}
      <div class="row">
        <span class="tag" style="background:${ty.bg};color:${ty.color}">${typeLabel(s.type)}</span>
        ${cls === " now" ? `<span class="tag nowtag">${t("now")}</span>` : ""}
        ${p ? `<button class="mapbtn" data-place="${s.place}" data-day="${d.id}" aria-label="${esc(t("showOnMap", { name: pname }))}">${svg("pin")}${esc(pname.length > 22 ? t("tabMap") : pname)}</button>` : ""}
      </div>
    </div></li>`;
  })
  .join("")}</ol></section>`;
    })
    .join("");
}
$("#schList").onclick = (e) => {
  const b = e.target.closest(".mapbtn");
  if (!b) return;
  switchView("mapView");
  selectDay(b.dataset.day);
  setTimeout(() => {
    openPlace(b.dataset.place, b.dataset.day);
    map.setView([P[b.dataset.place].lat, P[b.dataset.place].lng], 13);
  }, 350);
};

/* ---------------- TABS ---------------- */
function switchView(id) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.toggle("active", v.id === id));
  document
    .querySelectorAll("nav.tabs button")
    .forEach((b) =>
      b.setAttribute("aria-selected", b.dataset.view === id),
    );
  if (id === "mapView") setTimeout(() => map.invalidateSize(), 50);
  try {
    localStorage.setItem("hg-view", id);
  } catch (e) {}
}
document.querySelector("nav.tabs").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) switchView(b.dataset.view);
};

/* ---------------- NGÔN NGỮ ---------------- */
function renderLang() {
  applyStaticI18n();
  renderHeader();
  renderChips();
  renderTray();
  renderSchedule();
  Object.values(dayLayers).forEach((L_) =>
    L_.markers.forEach((m) => m.setTooltipContent(tr(P[m._id], "name"))),
  );
  if (openedPlace) openPlace(openedPlace.id, openedPlace.dayId, false);
}
$("#btnLang").onclick = () => {
  LANG = LANG === "vi" ? "en" : "vi";
  try {
    localStorage.setItem("hg-lang", LANG);
  } catch (e) {}
  renderLang();
  toast(t("langName"));
};

/* ---------------- INIT ---------------- */
applyStaticI18n();
renderHeader();
renderChips();
CONFIG.days.forEach(buildDay);
applyDayStyle();
renderTray();
renderSchedule();
setTimeout(fitView, 60);
try {
  const v = localStorage.getItem("hg-view");
  if (v === "scheduleView") switchView(v);
} catch (e) {}
