# meal-planner — CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc với project này.

---

## Cấu trúc project

```
meal-planner/
├── index.html          # Shell HTML - không chứa content, chỉ layout
├── css/
│   └── style.css       # Toàn bộ styling (CSS variables, components)
├── js/
│   └── app.js          # Logic render + tính toán tổng hợp
├── data/
│   └── meals.json      # ← SOURCE OF TRUTH cho toàn bộ data
└── CLAUDE.md           # File này
```

---

## Data model (`data/meals.json`)

### Cấu trúc meals object

```json
{
  "meals": {
    "<meal_id>": {
      "id": "string",
      "name": "string (tên hiển thị)",
      "gender": "nu | nam",
      "slot": "sang | trua | toi",
      "macro": {
        "P": number,        // Protein (g)
        "C": number,        // Carb (g)
        "F": number,        // Fat (g)
        "kcal": number,     // Calories
        "estimated": true   // optional - chỉ có ở Nam (macro ước tính)
      },
      "ingredients": [
        {
          "name": "string",   // tên nguyên liệu
          "qty": number,      // số lượng
          "unit": "g | ml",   // đơn vị
          "note": "string"    // optional: "1 quả", "2 lát", v.v.
        }
      ]
    }
  },
  "schedule": {
    "T2": {
      "nu":  { "sang": "<meal_id>", "trua": "<meal_id>", "toi": "<meal_id>" },
      "nam": { "sang": "<meal_id>", "trua": "<meal_id>", "toi": "<meal_id>" }
    }
    // T3, T4, T5, T6, T7 tương tự
  }
}
```

### Quy tắc đặt ID

Format: `{gender}_{slot}_{code}_{tên_rút_gọn}`

- Gender: `nu` hoặc `nam`
- Slot: `sang`, `trua`, `toi`
- Code: `s1`, `s2`... cho sáng; `t1`, `t2`... cho trưa; `d1`, `d2`... cho tối
- Tên: snake_case, bỏ dấu

Ví dụ: `nu_sang_s1_oat_banana_cacao`, `nam_toi_d3_beefsteak_salad_xa_lach`

---

## Quy trình cập nhật data

### Thêm món mới

1. Thêm entry vào `meals` object trong `meals.json`
2. Đặt ID theo convention trên
3. Cập nhật `schedule` nếu cần gán món vào ngày

### Sửa nguyên liệu

Chỉ sửa trong `meals.json` → app tự tính lại tất cả:
- Macro chips hiển thị trên meal card
- Tooltip nguyên liệu khi hover
- Tổng thịt tab Chủ nhật / Thứ 4
- Tổng rau củ đồ khô tab 4

### Thay lịch ăn

Chỉ sửa `schedule` object — không cần sửa `meals`.

---

## Logic tính toán (`js/app.js`)

### `renderShoppingTab(tripKey, days, panelId)`
- Lọc ingredients theo `PROTEIN_KEYWORDS`
- Gom tất cả bữa trong `days` (T2-T4 hoặc T5-T7)
- Group by ingredient name, sum qty

### `renderGroceryTab()`
- Lọc ngược lại (non-protein)
- Group by `CATEGORIES` object
- Tính tổng cả tuần T2→T7

### `renderMealCard(meal, gender)`
- Render card + tooltip HTML
- Tooltip hiển thị ingredients table khi CSS hover

---

## Thêm category mới cho tab Rau củ

Trong `js/app.js`, tìm object `CATEGORIES` và thêm key mới:

```js
const CATEGORIES = {
  'Rau củ & Trái cây': ['chuối', 'đậu bắp', ...],
  'Tên category mới': ['từ khóa 1', 'từ khóa 2'],  // ← thêm vào đây
};
```

Keywords dùng `includes()` nên chỉ cần substring (lowercase, không dấu không cần thiết).

---

## CSS variables chính

```css
--male: #1A4A7A      /* màu Nam */
--female: #7A2D6A    /* màu Nữ */
--g1: #2D6A4F        /* tab 1 / Chủ nhật */
--g2: #B5451B        /* tab 2 / Thứ 4 */
--g3: #5C6BC0        /* tab 3 */
--g4: #6B4A1E        /* tab 4 / Rau củ */
```

---

## Chạy local

Cần serve qua HTTP vì `fetch('data/meals.json')` không chạy được từ `file://`:

```bash
# Python
cd meal-planner
python3 -m http.server 8080

# Node
npx serve .

# hoặc dùng Live Server trong VS Code
```

Mở `http://localhost:8080`

---

## Lưu ý quan trọng

- **Macro Nữ** = chính xác từ bảng gốc (không sửa)
- **Macro Nam** = ước tính (`"estimated": true`) — có thể cập nhật sau nếu có data chính xác
- Khi thêm nguyên liệu protein mới, thêm keyword vào `PROTEIN_KEYWORDS` trong `app.js`
- `Cơm trắng` được xử lý đặc biệt: hiển thị thêm quy đổi kg gạo
- Tooltip dùng pure CSS hover (`:hover`) — không cần JS event
