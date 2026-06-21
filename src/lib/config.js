/**
 * js/config.js
 * Toàn bộ hằng số & cấu hình — sửa ở đây, không đụng logic.
 */

export const DAYS  = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const SLOTS = ['sang', 'trua', 'toi'];

export const SLOT_LABEL = { sang: '☀️ Sáng', trua: '🌤 Trưa', toi: '🌙 Tối' };

export const DAY_LABEL = {
  T2: 'Thứ 2', T3: 'Thứ 3', T4: 'Thứ 4',
  T5: 'Thứ 5', T6: 'Thứ 6', T7: 'Thứ 7',
};

// T2-T4 = trip1 (đi chợ Chủ nhật); T5-T7 = trip2 (đi chợ Thứ 4)
export const TRIP1_DAYS = ['T2', 'T3', 'T4'];
export const TRIP2_DAYS = ['T5', 'T6', 'T7'];

// Nguyên liệu protein (thịt / cá / trứng) — dùng để tách tab thịt vs rau củ
export const PROTEIN_KEYWORDS = [
  'bò beefsteak', 'bò thăn nội', 'bắp bò', 'gân', 'ức gà phi-lê', 'ức gà phi lê',
  'má đùi gà', 'nạc heo', 'cá hồi', 'trứng gà',
];

// Phân loại nguyên liệu non-protein cho tab Rau củ & Đồ khô.
// Mỗi category: { emoji, keywords[] } — keyword match bằng includes() (lowercase).
export const CATEGORIES = {
  'Rau củ & Trái cây': {
    emoji: '🥦',
    keywords: [
      'chuối', 'đậu bắp', 'đậu que', 'bắp (ngô)', 'bông cải xanh', 'bông cải trắng',
      'nấm tươi', 'ớt chuông', 'cà chua', 'cải ngọt', 'bí đỏ', 'cà rốt', 'khoai tây',
      'hành tây', 'rau củ hỗn hợp', 'xà lách', 'bắp cải trắng', 'giá đỗ', 'hẹ',
      'khóm', 'rau muống', 'rau lang',
    ],
  },
  'Tinh bột / Ngũ cốc': {
    emoji: '🌾',
    keywords: [
      'cơm trắng', 'gạo lứt', 'gạo trắng', 'yến mạch', 'bột yến mạch',
      'bánh mì nguyên cám', 'cơm gạo lứt',
    ],
  },
  'Sữa / Phô mai / Chất béo': {
    emoji: '🥛',
    keywords: [
      'sữa tươi 0 đường', 'sữa tươi không đường', 'sữa chua ít đường', 'phô mai lát',
      'bơ quả (avocado)', 'bơ đậu phộng', 'mật ong', 'nước dừa tươi',
    ],
  },
  'Gia vị & Khác': {
    emoji: '🫙',
    keywords: [
      'sốt takoyaki', 'bột cacao nguyên chất', 'bột matcha nguyên chất', 'rong biển nori',
      'dầu ăn', 'nước cốt chanh',
    ],
  },
};
