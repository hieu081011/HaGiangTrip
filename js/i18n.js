/* Chuỗi giao diện song ngữ + hàm chọn ngôn ngữ.
 * Nội dung chuyến đi (địa điểm, lịch trình) dịch trong js/data.js qua trường `en`. */

const I18N = {
  vi: {
    docTitle: "Phượt Hà Giang",
    switchLang: "Switch to English",
    langName: "Tiếng Việt",
    mapAria: "Bản đồ hành trình",
    chooseDay: "Chọn ngày",
    locate: "Vị trí của tôi",
    fit: "Xem toàn tuyến",
    layer: "Đổi kiểu bản đồ",
    close: "Đóng",
    tabMap: "Bản đồ",
    tabSchedule: "Lịch trình",
    layers: ["Bản đồ đường", "Địa hình", "Vệ tinh"],
    allDays: "Toàn tuyến",
    nDays: "{n} ngày",
    tapDay: "Chạm vào một ngày để xem chi tiết",
    ride: "{km} km · ~{time} chạy xe",
    calc: "Đang tính quãng đường…",
    routeFail:
      "Không tải được đường bộ thực tế cho {day} – đang hiển thị đường nối thẳng",
    noPhoto: 'Chưa có ảnh · thêm URL ảnh vào CONFIG hoặc bấm "Xem ảnh"',
    coords: "Toạ độ",
    tips: "Lưu ý",
    directions: "Chỉ đường",
    photos: "Xem ảnh",
    noGeo: "Thiết bị không hỗ trợ định vị",
    locating: "Đang lấy vị trí…",
    geoFail: "Không lấy được vị trí – kiểm tra quyền định vị",
    nActs: "{n} hoạt động",
    now: "Đang diễn ra",
    showOnMap: "Xem {name} trên bản đồ",
    types: {
      city: "Thị trấn",
      sight: "Tham quan",
      view: "Ngắm cảnh",
      food: "Ăn uống",
      eat: "Ăn uống",
      stay: "Nghỉ ngơi",
      fuel: "Xăng",
      move: "Di chuyển",
      other: "Khác",
    },
  },
  en: {
    docTitle: "Hà Giang Loop - DeepC",
    switchLang: "Chuyển sang tiếng Việt",
    langName: "English",
    mapAria: "Trip map",
    chooseDay: "Choose a day",
    locate: "My location",
    fit: "Show whole route",
    layer: "Change map style",
    close: "Close",
    tabMap: "Map",
    tabSchedule: "Itinerary",
    layers: ["Street map", "Terrain", "Satellite"],
    allDays: "Whole loop",
    nDays: "{n} days",
    tapDay: "Tap a day for details",
    ride: "{km} km · ~{time} riding",
    calc: "Calculating distance…",
    routeFail:
      "Couldn't load the road route for {day} – showing straight lines",
    noPhoto: 'No photo yet · add image URLs in CONFIG or tap "Photos"',
    coords: "Coordinates",
    tips: "Tips",
    directions: "Directions",
    photos: "Photos",
    noGeo: "Location isn't supported on this device",
    locating: "Getting your location…",
    geoFail: "Couldn't get your location – check location permission",
    nActs: "{n} activities",
    now: "Happening now",
    showOnMap: "Show {name} on the map",
    types: {
      city: "Town",
      sight: "Sightseeing",
      view: "Viewpoint",
      food: "Food",
      eat: "Food",
      stay: "Stay",
      fuel: "Fuel",
      move: "Ride",
      other: "Other",
    },
  },
};

// Ngôn ngữ đã chọn trước đó, không có thì theo ngôn ngữ trình duyệt
let LANG = (() => {
  try {
    const saved = localStorage.getItem("hg-lang");
    if (saved && I18N[saved]) return saved;
  } catch (e) {}
  return /^vi\b/i.test(navigator.language || "vi") ? "vi" : "en";
})();

// t("ride", { km: 12, time: "1h05" }) → chuỗi giao diện theo ngôn ngữ hiện tại
function t(key, vars) {
  const v = I18N[LANG][key] ?? I18N.vi[key] ?? key;
  if (typeof v !== "string" || !vars) return v;
  return v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

// tr(place, "name") → bản dịch trong obj.en nếu có, không thì bản tiếng Việt
function tr(obj, field) {
  if (LANG !== "vi" && obj.en && obj.en[field] != null) return obj.en[field];
  return obj[field];
}

// Chữ cố định trong index.html: data-i18n (nội dung), data-i18n-aria (aria-label)
function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.title = t("docTitle");
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document
    .querySelectorAll("[data-i18n-aria]")
    .forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
}
