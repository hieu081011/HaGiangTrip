/* =====================================================================
 * DỮ LIỆU CHUYẾN ĐI — sửa toàn bộ chuyến đi tại đây
 * ---------------------------------------------------------------------
 * trip.startDate : 'YYYY-MM-DD' để hiện ngày cụ thể + đánh dấu hoạt động
 *                  "đang diễn ra"
 *
 * places : danh sách địa điểm (key = id dùng ở days.route / extras / schedule)
 *   type    : 'city' | 'sight' | 'view' | 'food' | 'stay' | 'fuel'
 *             'via' = điểm chỉ dùng để nắn tuyến đi qua một con đường
 *             (không hiện marker / thẻ, vẫn có trong link Google Maps)
 *   lat/lng : toạ độ (Google Maps: nhấn giữ vào điểm → copy số)
 *   images  : [{ src: 'https://...jpg', caption: '...' }]
 *             (để trống → hiện ảnh minh hoạ)
 *   info    : [[nhãn, giá trị], ...]
 *   tips    : chuỗi lưu ý
 *
 * days : từng ngày
 *   route    : thứ tự các điểm xe chạy qua → vẽ theo đường bộ thật (OSRM)
 *   extras   : điểm hiện trên bản đồ nhưng không ảnh hưởng tuyến
 *              (homestay, quán ăn, cây xăng…)
 *   schedule : [{ time: '07:00', end: '07:45', title, type, place: 'id', note }]
 *     type   : 'eat' | 'sight' | 'stay' | 'move' | 'other'
 *
 * ⚠ Toạ độ hiện tại là ước lượng — nên kiểm tra lại trên Google Maps.
 * ===================================================================== */
const CONFIG = {
  trip: {
    title: "Hà Giang Loop - DeepC",
    subtitle: "3 ngày · 2 đêm · Cung Đông Bắc",
    startDate: null, // ví dụ '2026-11-20'
  },

  places: {
    hagiang: {
      name: "TP. Hà Giang",
      type: "city",
      lat: 22.8233,
      lng: 104.9836,
      desc: "Điểm xuất phát và kết thúc. Thuê xe máy, đổ đầy xăng, mua áo mưa trước khi lên cao nguyên.",
      info: [
        ["Việc cần làm", "Nhận xe, kiểm tra phanh/lốp, chụp ảnh cột mốc Km0"],
        ["Ghi chú", "Mang theo CCCD, GPLX"],
      ],
      images: [
        {
          src: "images/hagiang.jpg",
        },
      ],
    },
    quanba: {
      name: "Cổng Trời & Núi Đôi Quản Bạ",
      type: "view",
      lat: 23.06,
      lng: 104.998,
      desc: "Điểm dừng chân đầu tiên trên cao nguyên, ngắm thung lũng Tam Sơn và cặp Núi Đôi.",
      info: [
        ["Thời gian", "~45 phút"],
        ["Phí", "Miễn phí"],
      ],
      tips: "Có trạm dừng chân, WC và quán nước.",
      images: [
        {
          src: "images/quanba.jpg",
        },
      ],
    },
    yenminh: {
      name: "Thị trấn Yên Minh",
      type: "city",
      lat: 23.1205,
      lng: 105.1418,
      desc: "Thị trấn trung chuyển giữa hành trình, nghỉ trưa ngày 1.",
      info: [["Việc cần làm", "Ăn uống, đổ xăng"]],
      images: [
        {
          src: "images/yenminh.jpg",
        },
      ],

    },
    thamma: {
      name: "Dốc Thẩm Mã",
      type: "view",
      lat: 23.2045,
      lng: 105.233,
      desc: "Con dốc uốn lượn nổi tiếng, góc chụp đẹp nhất là từ trên đỉnh dốc nhìn xuống.",
      info: [["Thời gian", "~30 phút"]],
      tips: "Đứng sát mép đường, cẩn thận xe tải đổ dốc.",
      images: [
        {
          src: "images/thamma.jpg",
        },
      ],
    },

    nhavuong: {
      name: "Dinh thự họ Vương",
      type: "sight",
      lat: 23.2437,
      lng: 105.2697,
      desc: 'Dinh thự của "Vua Mèo" Vương Chính Đức tại Sà Phìn, kiến trúc pha trộn Hmông – Hán – Pháp.',
      info: [
        ["Thời gian", "~45 phút"],
        ["Vé", "[GIÁ VÉ]"],
      ],
      images: [
        {
          src: "images/nhavuong.jpg",
        },
      ],
    },
    lungcu: {
      name: "Cột cờ Lũng Cú",
      type: "sight",
      lat: 23.3637,
      lng: 105.3165,
      desc: "Điểm cực Bắc Tổ quốc. Leo khoảng 300 bậc thang lên chân cột cờ.",
      info: [
        ["Thời gian", "~1 giờ"],
        ["Vé", "[GIÁ VÉ]"],
      ],
      tips: "Gió lớn, mang áo khoác. Lên sớm ngắm bình minh – hỏi trước giờ mở cửa cột cờ.",
      images: [
        {
          src: "images/lungcu.jpg",
        },
      ],
    },
    dongvan: {
      name: "Phố cổ Đồng Văn",
      type: "city",
      lat: 23.2786,
      lng: 105.3618,
      desc: "Tối ngày 1 ra dạo phố cổ, ăn lẩu và uống cà phê bên những ngôi nhà trình tường.",
      info: [["Việc cần làm", "Dạo phố, ăn tối"]],
      images: [
        {
          src: "images/dongvan.jpg",
        },
      ],
    },
    mapileng: {
      name: "Đèo Mã Pì Lèng",
      type: "view",
      lat: 23.229,
      lng: 105.408,
      desc: 'Một trong "tứ đại đỉnh đèo", nhìn xuống hẻm Tu Sản và dòng Nho Quế xanh ngọc.',
      info: [["Thời gian", "~45 phút"]],
      tips: "Dừng tại khu vực Mã Pì Lèng Panorama để chụp ảnh.",
      images: [
        {
          src: "images/mapileng.jpg",
        },
      ],
    },
    nhoque: {
      name: "Sông Nho Quế – Hẻm Tu Sản",
      type: "sight",
      lat: 23.224,
      lng: 105.4165,
      desc: "Đi thuyền dưới lòng hẻm Tu Sản, một trong những hẻm vực sâu nhất Đông Nam Á.",
      info: [
        ["Thời gian", "~2–3 giờ (cả đi bộ xuống bến)"],
        ["Vé thuyền", "[GIÁ VÉ]"],
      ],
      tips: "Đường xuống bến dốc, đi giày bám tốt.",
      images: [
        {
          src: "images/nhoque.jpg",
        },
      ],
    },
    meovac: {
      name: "Thị trấn Mèo Vạc",
      type: "city",
      lat: 23.161,
      lng: 105.4085,
      desc: "Nghỉ trưa ngày 2, đổ xăng trước khi đi Du Già.",
      info: [["Việc cần làm", "Ăn trưa, đổ xăng"]],
      images: [
        {
          src: "images/meovac.jpg",
        },
      ],
    },
    via_dt176: {
      name: "Đường tỉnh 176",
      type: "via", // điểm nằm giữa ĐT.176, chỉ để nắn tuyến
      lat: 23.0716,
      lng: 105.25,
    },
    dugia: {
      name: "Làng Du Già",
      type: "city",
      lat: 22.931,
      lng: 105.224,
      desc: "Thung lũng yên bình của người Tày giữa núi đá, nghỉ đêm 2. Nhiều homestay, ruộng bậc thang và suối mát.",
      info: [["Việc cần làm", "Nhận phòng, dạo làng, ăn tối"]],
      tips: "Ít cây xăng – đổ đầy ở Mèo Vạc trước khi đi.",
      images: [
        {
          src: "images/dugia.jpg",
        },
      ],
    },
    thacdugia: {
      name: "Thác Du Già",
      type: "view",
      lat: 22.9256,
      lng: 105.1977,
      desc: "Thác nước nhiều tầng cách làng Du Già khoảng 3 km, có hồ nước để tắm khi trời nắng.",
      info: [["Thời gian", "~1 giờ"]],
      tips: "Đá trơn, đi dép bám tốt.",
      images: [],
    },
    via_tl181a: {
      name: "TL181 – Sáng Pá",
      type: "via", // nắn tuyến Du Già → Lùng Tám theo TL181 (qua Đường Thượng)
      lat: 22.9741,
      lng: 105.1608,
    },
    via_tl181b: {
      name: "TL181 – Lồ Lố Thàng",
      type: "via",
      lat: 22.9941,
      lng: 105.0881,
    },
    lungtam: {
      name: "Làng dệt lanh Lùng Tám",
      type: "sight",
      lat: 23.0493,
      lng: 105.0438,
      desc: "Làng nghề dệt vải lanh truyền thống của người Hmông, xem quy trình se sợi, nhuộm chàm, vẽ sáp ong.",
      info: [["Thời gian", "~30 phút"]],
      tips: "Toạ độ là trung tâm xã Lùng Tám – hỏi đường tới HTX dệt lanh.",
      images: [],
    },
    rungthong: {
      name: "Rừng thông Yên Minh",
      type: "view",
      lat: 23.108,
      lng: 105.115,
      desc: "Rừng thông xanh mát trên đường về, điểm dừng chụp ảnh nhẹ nhàng.",
      info: [["Thời gian", "~30 phút"]],
      images: [],
    },
    bacsum: {
      name: "Đèo Bắc Sum",
      type: "view",
      lat: 22.991,
      lng: 104.985,
      desc: "Đèo dài với những khúc cua tay áo, góc nhìn đẹp khi đổ đèo về Hà Giang.",
      info: [["Thời gian", "~20 phút"]],
      tips: "Đổ đèo về số thấp, không bóp phanh liên tục.",
      images: [],
    },

    /* Homestay đã đặt */
    hs1: {
      name: "Vieille Maison de Ma Lé",
      type: "stay",
      lat: 23.3077752,
      lng: 105.3029446,
      desc: "Homestay đêm 1 ở xã Ma Lé, nằm trên đường Đồng Văn – Lũng Cú: cách phố cổ Đồng Văn ~12 km, cách cột cờ Lũng Cú ~15 km.",
      info: [
        ["Đêm", "Đêm 1 (ngày 1 → ngày 2)"],
        ["SĐT", "0822894526"],
        ["Giá", "1600000 VND"],
      ],
      images: [{ src: "images/hs1.jpg" }],
    },
    hs2: {
      name: "Du Gia Yen Homestay",
      type: "stay",
      lat: 22.929057,
      lng: 105.2217831,
      desc: "Homestay đêm 2 ở làng Du Già, cạnh hồ nước giữa thung lũng.",
      info: [
        ["Đêm", "Đêm 2 (ngày 2 → ngày 3)"],
        ["SĐT", "0985919345"],
        ["Giá", "1000000 VNĐ"],
      ],
      images: [{ src: "images/hs2.jpg" }],
    },
  },

  days: [
    {
      id: "d1",
      label: "Ngày 1",
      title: "Hà Giang → Ma Lé · tối dạo Đồng Văn",
      color: "#D9480F",
      route: [
        "hagiang",
        "quanba",
        "yenminh",
        "thamma",
        "nhavuong",
        "hs1", // nhận phòng, gửi đồ
        "dongvan", // tối ra phố cổ
        "hs1", // về homestay ngủ
      ],
      extras: [],
      schedule: [
        {
          time: "06:30",
          end: "07:30",
          title: "Ăn sáng, nhận xe máy",
          type: "eat",
          place: "hagiang",
          note: "Kiểm tra xe, đổ đầy xăng",
        },
        {
          time: "07:30",
          title: "Xuất phát lên Quản Bạ",
          type: "move",
          note: "~45 km",
        },
        {
          time: "09:00",
          end: "09:45",
          title: "Cổng Trời & Núi Đôi Quản Bạ",
          type: "sight",
          place: "quanba",
        },
        {
          time: "11:30",
          end: "13:00",
          title: "Ăn trưa tại Yên Minh",
          type: "eat",
          place: "yenminh",
        },
        {
          time: "14:00",
          end: "14:30",
          title: "Dốc Thẩm Mã",
          type: "sight",
          place: "thamma",
        },
        {
          time: "15:15",
          end: "16:00",
          title: "Dinh thự họ Vương",
          type: "sight",
          place: "nhavuong",
        },
        {
          time: "16:30",
          end: "17:45",
          title: "Nhận phòng Vieille Maison de Ma Lé, gửi đồ, nghỉ ngơi",
          type: "stay",
          place: "hs1",
          note: "~21 km từ Dinh thự họ Vương, ~30 phút. Hỏi homestay giờ mở cửa cột cờ Lũng Cú sáng mai",
        },
        {
          time: "17:45",
          title: "Ra phố cổ Đồng Văn",
          type: "move",
          note: "~12 km, ~20 phút",
        },
        {
          time: "18:00",
          end: "19:00",
          title: "Dạo phố cổ Đồng Văn",
          type: "sight",
          place: "dongvan",
          note: "Phố cổ lên đèn, cà phê phố cổ",
        },
        {
          time: "19:00",
          end: "20:00",
          title: "Ăn tối tại Đồng Văn",
          type: "eat",
          place: "dongvan",
        },
        {
          time: "20:15",
          title: "Về homestay Ma Lé, nghỉ sớm",
          type: "stay",
          place: "hs1",
          note: "~12 km đường đèo buổi tối: đi chậm, đi theo đoàn. Sáng mai xuất phát sớm lên Lũng Cú",
        },
      ],
    },
    {
      id: "d2",
      label: "Ngày 2",
      title: "Lũng Cú → Nho Quế → Mèo Vạc → Du Già",
      color: "#1864AB",
      route: [
        "hs1",
        "lungcu",
        "hs1", // quay về homestay Ma Lé trả phòng
        "mapileng",
        "nhoque",
        "meovac",
        "via_dt176", // Mèo Vạc → Mậu Duệ theo ĐT.176, rồi xuống Du Già
        "dugia",
      ],
      extras: ["hs2"],
      schedule: [
        {
          time: "06:00",
          title: "Xuất phát lên Lũng Cú",
          type: "move",
          place: "hs1",
          note: "Để đồ ở homestay. ~15 km, ~25 phút",
        },
        {
          time: "06:30",
          end: "07:30",
          title: "Cột cờ Lũng Cú",
          type: "sight",
          place: "lungcu",
          note: "Ngắm bình minh, vắng khách",
        },
        {
          time: "07:30",
          end: "08:00",
          title: "Ăn sáng gần Lũng Cú",
          type: "eat",
          place: "lungcu",
        },
        {
          time: "08:00",
          title: "Quay về homestay Ma Lé",
          type: "move",
          note: "~14 km, ~20 phút",
        },
        {
          time: "08:30",
          end: "09:00",
          title: "Trả phòng Vieille Maison de Ma Lé",
          type: "stay",
          place: "hs1",
          note: "Lấy đồ, chằng buộc lên xe",
        },
        {
          time: "09:30",
          end: "10:00",
          title: "Đèo Mã Pì Lèng",
          type: "sight",
          place: "mapileng",
          note: "~25 km từ Ma Lé, qua Đồng Văn",
        },
        {
          time: "10:15",
          end: "12:00",
          title: "Đi thuyền sông Nho Quế – hẻm Tu Sản",
          type: "sight",
          place: "nhoque",
          note: "Rút gọn còn ~1h45 để kịp về Du Già trước tối",
        },
        {
          time: "12:15",
          end: "13:00",
          title: "Ăn trưa tại Mèo Vạc",
          type: "eat",
          place: "meovac",
        },
        {
          time: "13:00",
          end: "13:15",
          title: "Đổ đầy xăng",
          type: "other",
          place: "meovac",
          note: "Đoạn Mậu Duệ → Du Già ít cây xăng",
        },
        {
          time: "13:15",
          title: "Di chuyển về Du Già",
          type: "move",
          note: "~76 km: ĐT.176 tới Mậu Duệ rồi đường núi xuống Du Già, ~3h30. Cố đến trước khi trời tối",
        },
        {
          time: "17:00",
          title: "Nhận phòng homestay Du Già",
          type: "stay",
          place: "hs2",
        },
        {
          time: "19:00",
          title: "Ăn tối, giao lưu",
          type: "eat",
          place: "dugia",
        },
      ],
    },
    {
      id: "d3",
      label: "Ngày 3",
      title: "Du Già → Hà Giang",
      color: "#2B8A3E",
      route: [
        "dugia",
        "thacdugia",
        "via_tl181a", // TL181 qua Đường Thượng
        "via_tl181b",
        "lungtam",
        "quanba",
        "bacsum",
        "hagiang",
      ],
      extras: [],
      schedule: [
        {
          time: "07:30",
          end: "08:30",
          title: "Ăn sáng, trả phòng",
          type: "eat",
          place: "dugia",
        },
        {
          time: "08:45",
          end: "09:45",
          title: "Thác Du Già",
          type: "sight",
          place: "thacdugia",
          note: "Tắm thác nếu trời nắng",
        },
        {
          time: "09:45",
          title: "Đi TL181 qua Đường Thượng về Lùng Tám",
          type: "move",
          note: "~41 km đường núi, ~3 giờ, đi chậm",
        },
        {
          time: "12:45",
          end: "13:15",
          title: "Làng dệt lanh Lùng Tám",
          type: "sight",
          place: "lungtam",
          note: "Bỏ qua nếu đến muộn",
        },
        {
          time: "13:30",
          end: "14:30",
          title: "Ăn trưa tại Quản Bạ",
          type: "eat",
          place: "quanba",
          note: "Thị trấn Tam Sơn, dưới chân Cổng Trời",
        },
        {
          time: "14:30",
          title: "Xuất phát về TP. Hà Giang",
          type: "move",
          note: "~56 km qua đèo Bắc Sum, ~1h30",
        },
        {
          time: "15:00",
          end: "15:10",
          title: "Đèo Bắc Sum",
          type: "sight",
          place: "bacsum",
          note: "Dừng nhanh chụp ảnh. Đổ đèo về số thấp",
        },
        {
          time: "16:00",
          title: "Về TP. Hà Giang, trả xe",
          type: "other",
          place: "hagiang",
        },
        {
          time: "18:00",
          end: "19:00",
          title: "Ăn tối, kết thúc hành trình",
          type: "eat",
          place: "hagiang",
        },
      ],
    },
  ],
};
/* ======================= HẾT CONFIG ======================= */
