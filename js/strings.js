/* Chuỗi chữ hiển thị trên giao diện — sửa câu chữ tại đây */

const STR = {
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
  tabMap: "Bản đồ",
  nSpots: "{n} quán",
  noSpots: "Chưa có quán — thêm vào CONFIG.food trong js/data.js",
  reviews: "{n} đánh giá",
  openMaps: "Google Maps",
  noFoodPhoto: "Chưa có ảnh",
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
};

// t("ride", { km: 12, time: "1h05" }) → chuỗi trong STR, thay các {biến}
function t(key, vars) {
  const v = STR[key] ?? key;
  if (typeof v !== "string" || !vars) return v;
  return v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
