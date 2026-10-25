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
 * en : bản tiếng Anh, đặt cạnh bản tiếng Việt ở trip / place / day / schedule
 *      vd. en: { name, desc, info, tips }  hoặc  en: { title, note }
 *      Trường nào thiếu trong `en` sẽ tự hiện bản tiếng Việt.
 *
 * ⚠ Toạ độ hiện tại là ước lượng — nên kiểm tra lại trên Google Maps.
 * ===================================================================== */
const CONFIG = {
  trip: {
    title: "Hà Giang Loop - DeepC",
    subtitle: "3 ngày · 2 đêm · Cung Đông Bắc",
    startDate: null, // ví dụ '2026-11-20'
    en: {
      title: "Hà Giang Loop",
      subtitle: "3 days · 2 nights · Northeast loop",
    },
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
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp1a8u6bmaeu3b1eoT-34k0UAYgZvcFJ58dl2RKeIfIQ&s=10",
        },
      ],
      en: {
        name: "Hà Giang City",
        desc: "Start and finish point. Rent motorbikes, fill up the tank and buy rain ponchos before heading up to the plateau.",
        info: [
          [
            "To do",
            "Pick up bikes, check brakes/tyres, photo at the Km0 marker",
          ],
          ["Note", "Bring your ID card and driving licence"],
        ],
      },
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
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzXhz-SA49M2rteH1FPVytYIl3403rpmbrp5hzbHIvIlC6L0FzfUGxliI&s=10",
        },
      ],
      en: {
        name: "Quản Bạ Heaven Gate & Twin Mountains",
        desc: "First stop on the plateau, overlooking Tam Sơn valley and the Twin Mountains.",
        info: [
          ["Duration", "~45 min"],
          ["Fee", "Free"],
        ],
        tips: "Rest stop with toilets and drinks.",
      },
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
          src: "https://baohagiang.vn/file/4028eaa4679b32c401679c0c74382a7e/092024/thi_tran_ym_2_20240902141920.jpg",
        },
      ],

      en: {
        name: "Yên Minh Town",
        desc: "Transit town halfway along the route, lunch stop on day 1.",
        info: [["To do", "Eat, refuel"]],
      },
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
          src: "https://lh3.googleusercontent.com/grass-cs/AABkmLebEb0FXfpYeCRhZTKw3EQ15IRUYLrCBxGXBkQMADqrFCZ9F5YchKtxKNPYmZBvdC2oe8H4qQM1R44LXlNA1XQ82WczeeMh4Q2p1fBQuo7Xxe3oKqbX55flnbRGjU111cYOb5ViYBWSTnAE=w289-h312-n-k-no",
        },
      ],
      en: {
        name: "Thẩm Mã Slope",
        desc: "Famous zigzag slope – the best shot is from the top looking down.",
        info: [["Duration", "~30 min"]],
        tips: "Stay close to the roadside and watch out for trucks coming downhill.",
      },
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
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZdN2i0pUgn-EfgllJH2dBXNvYVVG-HPmzJjh1ePmFYw&s=10",
        },
      ],
      en: {
        name: "Vương Family Mansion",
        desc: 'Mansion of the "Hmông King" Vương Chính Đức in Sà Phìn, blending Hmông, Chinese and French architecture.',
        info: [
          ["Duration", "~45 min"],
          ["Ticket", "[PRICE]"],
        ],
      },
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
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKiEuO6jUNnYaA41p-mjJLKLA9tIk5RrRfdpK_lnQa-Q&s=10",
        },
      ],
      en: {
        name: "Lũng Cú Flag Tower",
        desc: "Vietnam's northernmost point. About 300 steps up to the base of the flag tower.",
        info: [
          ["Duration", "~1 hour"],
          ["Ticket", "[PRICE]"],
        ],
        tips: "Very windy – bring a jacket. Go early for sunrise; check the tower's opening hours beforehand.",
      },
    },
    dongvan: {
      name: "Phố cổ Đồng Văn",
      type: "city",
      lat: 23.2786,
      lng: 105.3618,
      desc: "Nghỉ đêm 1. Dạo phố cổ buổi tối, ăn lẩu và uống cà phê bên những ngôi nhà trình tường.",
      info: [["Việc cần làm", "Nhận phòng, ăn tối, dạo phố"]],
      images: [
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVSrerkXH6WJlJnD09Uq7B4ndw7gtsXj62AfMhgQc04g&s=10",
        },
      ],
      en: {
        name: "Đồng Văn Old Quarter",
        desc: "Night 1. Stroll the old quarter in the evening, with hotpot and coffee among rammed-earth houses.",
        info: [["To do", "Check in, dinner, walk around"]],
      },
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
          src: "https://viptrip.vn/public/upload/chinh-phuc-deo-ma-pi-leng-tu-dai-dinh-deo-cua-vung-nui-dat-bac-6-1642064878_09-07-2025_438315690.jpeg",
        },
      ],
      en: {
        name: "Mã Pì Lèng Pass",
        desc: 'One of the "four great passes", overlooking Tu Sản canyon and the jade-green Nho Quế river.',
        info: [["Duration", "~45 min"]],
        tips: "Stop at the Mã Pì Lèng Panorama area for photos.",
      },
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
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuH8XyQ6EYA_yUfl9wCmiF-C2I9gEFOHAPW1U3v5qpow&s=10",
        },
      ],
      en: {
        name: "Nho Quế River – Tu Sản Canyon",
        desc: "Boat trip through Tu Sản, one of the deepest canyons in Southeast Asia.",
        info: [
          ["Duration", "~2–3 hours (incl. walking down to the pier)"],
          ["Boat ticket", "[PRICE]"],
        ],
        tips: "Steep path down to the pier – wear shoes with good grip.",
      },
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
          src: "https://images.baoangiang.com.vn/image/news/2026/20260107/origin/giu-hon-cao-nguyen-d_6322_1767780119.jpg",
        },
      ],
      en: {
        name: "Mèo Vạc Town",
        desc: "Lunch stop on day 2; refuel before heading to Du Già.",
        info: [["To do", "Lunch, refuel"]],
      },
    },
    via_dt176: {
      name: "Đường tỉnh 176",
      type: "via", // điểm nằm giữa ĐT.176, chỉ để nắn tuyến
      lat: 23.0716,
      lng: 105.25,
      en: {
        name: "Provincial Road 176",
      },
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
          src: "https://mia.vn/media/uploads/blog-du-lich/kham-pha-du-gia-ha-giang-xu-ban-tien-noi-dia-dau-to-quoc-01-1661957004.jpeg",
        },
      ],
      en: {
        name: "Du Già Village",
        desc: "Peaceful Tày valley among limestone mountains, night 2. Plenty of homestays, rice terraces and cool streams.",
        info: [["To do", "Check in, village walk, dinner"]],
        tips: "Few petrol stations – fill up in Mèo Vạc first.",
      },
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
      en: {
        name: "Du Già Waterfall",
        desc: "Multi-tiered waterfall about 3 km from Du Già village, with a pool for swimming on sunny days.",
        info: [["Duration", "~1 hour"]],
        tips: "Slippery rocks – wear sandals with good grip.",
      },
    },
    via_tl181a: {
      name: "TL181 – Sáng Pá",
      type: "via", // nắn tuyến Du Già → Lùng Tám theo TL181 (qua Đường Thượng)
      lat: 22.9741,
      lng: 105.1608,
      en: {
        name: "Road TL181 – Sáng Pá",
      },
    },
    via_tl181b: {
      name: "TL181 – Lồ Lố Thàng",
      type: "via",
      lat: 22.9941,
      lng: 105.0881,
      en: {
        name: "Road TL181 – Lồ Lố Thàng",
      },
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
      en: {
        name: "Lùng Tám Linen Weaving Village",
        desc: "Traditional Hmông linen weaving village: see spinning, indigo dyeing and beeswax batik.",
        info: [["Duration", "~30 min"]],
        tips: "Coordinates are the Lùng Tám commune centre – ask the way to the linen cooperative.",
      },
    },
    rungthong: {
      name: "Rừng thông Yên Minh",
      type: "view",
      lat: 23.108,
      lng: 105.115,
      desc: "Rừng thông xanh mát trên đường về, điểm dừng chụp ảnh nhẹ nhàng.",
      info: [["Thời gian", "~30 phút"]],
      images: [],
      en: {
        name: "Yên Minh Pine Forest",
        desc: "Cool pine forest along the way, an easy photo stop.",
        info: [["Duration", "~30 min"]],
      },
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
      en: {
        name: "Bắc Sum Pass",
        desc: "Long pass with hairpin bends and great views on the descent to Hà Giang.",
        info: [["Duration", "~20 min"]],
        tips: "Use a low gear downhill instead of braking constantly.",
      },
    },

    /* Ví dụ homestay / quán ăn — thay bằng nơi thật khi đặt xong */
    hs1: {
      name: "[Homestay đêm 1 – Đồng Văn]",
      type: "stay",
      lat: 23.2795,
      lng: 105.36,
      desc: "Thay bằng tên, toạ độ và SĐT homestay đã đặt.",
      info: [
        ["SĐT", "[SĐT]"],
        ["Giá", "[GIÁ]"],
      ],
      images: [],
      en: {
        name: "[Homestay night 1 – Đồng Văn]",
        desc: "Replace with the booked homestay's name, coordinates and phone number.",
        info: [
          ["Phone", "[PHONE]"],
          ["Price", "[PRICE]"],
        ],
      },
    },
    hs2: {
      name: "[Homestay đêm 2 – Du Già]",
      type: "stay",
      lat: 22.9315,
      lng: 105.2255,
      desc: "Thay bằng tên, toạ độ và SĐT homestay đã đặt.",
      info: [
        ["SĐT", "[SĐT]"],
        ["Giá", "[GIÁ]"],
      ],
      images: [],
      en: {
        name: "[Homestay night 2 – Du Già]",
        desc: "Replace with the booked homestay's name, coordinates and phone number.",
        info: [
          ["Phone", "[PHONE]"],
          ["Price", "[PRICE]"],
        ],
      },
    },
  },

  days: [
    {
      id: "d1",
      label: "Ngày 1",
      title: "Hà Giang → Đồng Văn",
      color: "#D9480F",
      en: {
        label: "Day 1",
        title: "Hà Giang → Đồng Văn",
      },
      route: ["hagiang", "quanba", "yenminh", "thamma", "nhavuong", "dongvan"],
      extras: ["hs1"],
      schedule: [
        {
          time: "06:30",
          end: "07:30",
          title: "Ăn sáng, nhận xe máy",
          type: "eat",
          place: "hagiang",
          note: "Kiểm tra xe, đổ đầy xăng",
          en: {
            title: "Breakfast, pick up the motorbikes",
            note: "Check the bike, fill up the tank",
          },
        },
        {
          time: "07:30",
          title: "Xuất phát lên Quản Bạ",
          type: "move",
          note: "~45 km",
          en: {
            title: "Ride up to Quản Bạ",
          },
        },
        {
          time: "09:00",
          end: "09:45",
          title: "Cổng Trời & Núi Đôi Quản Bạ",
          type: "sight",
          place: "quanba",
          en: {
            title: "Quản Bạ Heaven Gate & Twin Mountains",
          },
        },
        {
          time: "11:30",
          end: "13:00",
          title: "Ăn trưa tại Yên Minh",
          type: "eat",
          place: "yenminh",
          en: {
            title: "Lunch in Yên Minh",
          },
        },
        {
          time: "14:00",
          end: "14:30",
          title: "Dốc Thẩm Mã",
          type: "sight",
          place: "thamma",
          en: {
            title: "Thẩm Mã Slope",
          },
        },
        {
          time: "15:15",
          end: "16:00",
          title: "Dinh thự họ Vương",
          type: "sight",
          place: "nhavuong",
          en: {
            title: "Vương Family Mansion",
          },
        },
        {
          time: "16:30",
          title: "Nhận phòng homestay Đồng Văn",
          type: "stay",
          place: "hs1",
          note: "~14 km từ Dinh thự họ Vương. Hỏi homestay giờ mở cửa cột cờ Lũng Cú sáng mai",
          en: {
            title: "Check in at the Đồng Văn homestay",
            note: "~14 km from the Vương Mansion. Ask the homestay about the Lũng Cú tower opening hours tomorrow morning",
          },
        },
        {
          time: "17:00",
          end: "18:30",
          title: "Dạo phố cổ Đồng Văn",
          type: "sight",
          place: "dongvan",
          note: "Ngắm hoàng hôn, cà phê phố cổ",
          en: {
            title: "Stroll around Đồng Văn Old Quarter",
            note: "Sunset, coffee in the old quarter",
          },
        },
        {
          time: "19:00",
          title: "Ăn tối, nghỉ sớm",
          type: "eat",
          place: "dongvan",
          note: "Sáng mai xuất phát sớm lên Lũng Cú",
          en: {
            title: "Dinner, early night",
            note: "Early start to Lũng Cú tomorrow",
          },
        },
      ],
    },
    {
      id: "d2",
      label: "Ngày 2",
      title: "Lũng Cú → Nho Quế → Mèo Vạc → Du Già",
      color: "#1864AB",
      en: {
        label: "Day 2",
        title: "Lũng Cú → Nho Quế → Mèo Vạc → Du Già",
      },
      route: [
        "dongvan",
        "lungcu",
        "hs1", // quay về homestay Đồng Văn trả phòng
        "mapileng",
        "nhoque",
        "meovac",
        "via_dt176", // Mèo Vạc → Mậu Duệ theo ĐT.176, rồi xuống Du Già
        "dugia",
      ],
      extras: ["hs2"],
      schedule: [
        {
          time: "05:45",
          title: "Xuất phát lên Lũng Cú",
          type: "move",
          place: "dongvan",
          note: "Để đồ ở homestay. ~27 km, ~40 phút",
          en: {
            title: "Ride up to Lũng Cú",
            note: "Leave luggage at the homestay. ~27 km, ~40 min",
          },
        },
        {
          time: "06:30",
          end: "07:30",
          title: "Cột cờ Lũng Cú",
          type: "sight",
          place: "lungcu",
          note: "Ngắm bình minh, vắng khách",
          en: {
            title: "Lũng Cú Flag Tower",
            note: "Sunrise, few visitors",
          },
        },
        {
          time: "07:30",
          end: "08:00",
          title: "Ăn sáng gần Lũng Cú",
          type: "eat",
          place: "lungcu",
          en: {
            title: "Breakfast near Lũng Cú",
          },
        },
        {
          time: "08:00",
          title: "Quay về Đồng Văn",
          type: "move",
          note: "~25 km, ~40 phút",
          en: {
            title: "Back to Đồng Văn",
            note: "~25 km, ~40 min",
          },
        },
        {
          time: "08:45",
          end: "09:15",
          title: "Trả phòng homestay Đồng Văn",
          type: "stay",
          place: "hs1",
          note: "Lấy đồ, chằng buộc lên xe",
          en: {
            title: "Check out of the Đồng Văn homestay",
            note: "Collect the bags and strap them onto the bikes",
          },
        },
        {
          time: "09:30",
          end: "10:00",
          title: "Đèo Mã Pì Lèng",
          type: "sight",
          place: "mapileng",
          note: "~13 km từ Đồng Văn",
          en: {
            title: "Mã Pì Lèng Pass",
            note: "~13 km from Đồng Văn",
          },
        },
        {
          time: "10:15",
          end: "12:00",
          title: "Đi thuyền sông Nho Quế – hẻm Tu Sản",
          type: "sight",
          place: "nhoque",
          note: "Rút gọn còn ~1h45 để kịp về Du Già trước tối",
          en: {
            title: "Boat trip on the Nho Quế – Tu Sản Canyon",
            note: "Shortened to ~1h45 to reach Du Già before dark",
          },
        },
        {
          time: "12:15",
          end: "13:00",
          title: "Ăn trưa tại Mèo Vạc",
          type: "eat",
          place: "meovac",
          en: {
            title: "Lunch in Mèo Vạc",
          },
        },
        {
          time: "13:00",
          end: "13:15",
          title: "Đổ đầy xăng",
          type: "other",
          place: "meovac",
          note: "Đoạn Mậu Duệ → Du Già ít cây xăng",
          en: {
            title: "Fill up the tank",
            note: "Few petrol stations between Mậu Duệ and Du Già",
          },
        },
        {
          time: "13:15",
          title: "Di chuyển về Du Già",
          type: "move",
          note: "~76 km: ĐT.176 tới Mậu Duệ rồi đường núi xuống Du Già, ~3h30. Cố đến trước khi trời tối",
          en: {
            title: "Ride to Du Già",
            note: "~76 km: road ĐT.176 to Mậu Duệ, then a mountain road down to Du Già, ~3h30. Try to arrive before dark",
          },
        },
        {
          time: "17:00",
          title: "Nhận phòng homestay Du Già",
          type: "stay",
          place: "hs2",
          en: {
            title: "Check in at the Du Già homestay",
          },
        },
        {
          time: "19:00",
          title: "Ăn tối, giao lưu",
          type: "eat",
          place: "dugia",
          en: {
            title: "Dinner, hang out",
          },
        },
      ],
    },
    {
      id: "d3",
      label: "Ngày 3",
      title: "Du Già → Hà Giang",
      color: "#2B8A3E",
      en: {
        label: "Day 3",
        title: "Du Già → Hà Giang",
      },
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
          en: {
            title: "Breakfast, check out",
          },
        },
        {
          time: "08:45",
          end: "09:45",
          title: "Thác Du Già",
          type: "sight",
          place: "thacdugia",
          note: "Tắm thác nếu trời nắng",
          en: {
            title: "Du Già Waterfall",
            note: "Swim if it's sunny",
          },
        },
        {
          time: "09:45",
          title: "Đi TL181 qua Đường Thượng về Lùng Tám",
          type: "move",
          note: "~41 km đường núi, ~3 giờ, đi chậm",
          en: {
            title: "Ride road TL181 via Đường Thượng to Lùng Tám",
            note: "~41 km of mountain road, ~3 hours, ride slowly",
          },
        },
        {
          time: "12:45",
          end: "13:15",
          title: "Làng dệt lanh Lùng Tám",
          type: "sight",
          place: "lungtam",
          note: "Bỏ qua nếu đến muộn",
          en: {
            title: "Lùng Tám Linen Weaving Village",
            note: "Skip if running late",
          },
        },
        {
          time: "13:30",
          end: "14:30",
          title: "Ăn trưa tại Quản Bạ",
          type: "eat",
          place: "quanba",
          note: "Thị trấn Tam Sơn, dưới chân Cổng Trời",
          en: {
            title: "Lunch in Quản Bạ",
            note: "Tam Sơn town, below Heaven Gate",
          },
        },
        {
          time: "14:30",
          end: "15:15",
          title: "Cà phê ngắm Núi Đôi, nghỉ chân",
          type: "other",
          place: "quanba",
          en: {
            title: "Coffee with a view of the Twin Mountains, rest",
          },
        },
        {
          time: "15:45",
          end: "16:30",
          title: "Đèo Bắc Sum",
          type: "sight",
          place: "bacsum",
          note: "Đổ đèo về số thấp",
          en: {
            title: "Bắc Sum Pass",
            note: "Use a low gear on the descent",
          },
        },
        {
          time: "17:30",
          title: "Về TP. Hà Giang, trả xe",
          type: "other",
          place: "hagiang",
          en: {
            title: "Back to Hà Giang City, return the bikes",
          },
        },
        {
          time: "18:00",
          end: "19:00",
          title: "Ăn tối, kết thúc hành trình",
          type: "eat",
          place: "hagiang",
          en: {
            title: "Dinner, end of the trip",
          },
        },
      ],
    },
  ],
};
/* ======================= HẾT CONFIG ======================= */
