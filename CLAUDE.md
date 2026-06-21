# meal-planner — CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc với project này.

---

## Stack

**React 18 + Vite 5** (ES modules, JSX). Build ra static → deploy GitHub Pages
qua GitHub Actions (`.github/workflows/deploy.yml`). `base` = `/meal-planner/`
khi build (xem `vite.config.js`).

## Cấu trúc project

```
meal-planner/
├── index.html              # Vite entry — chỉ có <div id="root"> + main.jsx
├── vite.config.js          # base path + plugin react
├── package.json            # scripts: dev / build / preview
├── src/
│   ├── main.jsx            # bootstrap React, import style.css
│   ├── App.jsx             # header + tabs + 4 panel (state tab)
│   ├── style.css           # toàn bộ styling (CSS variables, components)
│   ├── components/
│   │   ├── MealCard.jsx        # card 1 bữa + tooltip (+ MacroChips)
│   │   ├── ScheduleTab.jsx     # Tab 1: lịch ăn tuần + tổng macro/ngày
│   │   ├── ShoppingTab.jsx     # Tab 2&3: thịt theo lần đi chợ
│   │   ├── GroceryTab.jsx      # Tab 4: rau củ & đồ khô theo category
│   │   └── IngredientDetails.jsx # dòng "Nữ T2 Tra Món: 100g" dùng chung
│   ├── lib/
│   │   ├── config.js       # hằng số: DAYS, SLOTS, PROTEIN_KEYWORDS, CATEGORIES…
│   │   ├── calc.js         # addMacro, dayMacro, isProtein, aggregateIngredients
│   │   └── format.js       # slotText (bỏ emoji)
│   └── data/
│       └── meals.json      # ← SOURCE OF TRUTH cho toàn bộ data
└── CLAUDE.md               # File này
```

`meals.json` được **import trực tiếp** trong `App.jsx` (không fetch).

---

## Chạy local

```bash
npm install      # lần đầu
npm run dev      # dev server + hot reload (HMR) tại http://localhost:5173
npm run build    # build production ra dist/
npm run preview  # xem thử bản build
```

---

## Data model (`src/data/meals.json`)

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

## Logic tính toán (`src/lib/calc.js`)

Logic thuần (không đụng DOM), dùng chung cho mọi tab:

- `addMacro(acc, macro)` — cộng dồn macro vào accumulator.
- `dayMacro(data, day, gender)` — tổng macro 1 ngày của 1 giới.
- `isProtein(name)` — true nếu tên nguyên liệu thuộc `PROTEIN_KEYWORDS`.
- `aggregateIngredients(data, days, keep)` — gom & sum nguyên liệu qua các ngày,
  `keep(name)` quyết định giữ nguyên liệu nào (vd `isProtein` cho tab thịt,
  `n => !isProtein(n)` cho tab rau củ). Trả về `{ name: {unit, total, details[]} }`.

Component (`src/components/*.jsx`) chỉ lo render từ kết quả của `calc.js`.

---

## Thêm category mới cho tab Rau củ

Trong `src/lib/config.js`, thêm key vào object `CATEGORIES`:

```js
export const CATEGORIES = {
  'Rau củ & Trái cây': { emoji: '🥦', keywords: ['chuối', 'đậu bắp', ...] },
  'Tên category mới':  { emoji: '🧂', keywords: ['từ khóa 1', 'từ khóa 2'] }, // ← thêm
};
```

Keywords dùng `includes()` nên chỉ cần substring (lowercase).

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

## Lưu ý quan trọng

- **Macro Nữ** = chính xác từ bảng gốc (không sửa)
- **Macro Nam** = ước tính (`"estimated": true`) — có thể cập nhật sau nếu có data chính xác
- Khi thêm nguyên liệu protein mới, thêm keyword vào `PROTEIN_KEYWORDS` trong `src/lib/config.js`
- `Cơm trắng` được xử lý đặc biệt: hiển thị thêm quy đổi kg gạo (xem `GroceryTab.jsx`)
- Tooltip dùng pure CSS hover (`:hover`) — không cần JS event.
  Lưu ý: `.meal-card:hover` có `z-index:50` để tooltip không bị card sau đè (do `filter` tạo stacking context).
