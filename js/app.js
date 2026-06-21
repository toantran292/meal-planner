/**
 * meal-planner/js/app.js
 * Loads meals.json → renders schedule + shopping lists dynamically
 */

const DAYS  = ['T2','T3','T4','T5','T6','T7'];
const SLOTS = ['sang','trua','toi'];
const SLOT_LABEL = { sang: '☀️ Sáng', trua: '🌤 Trưa', toi: '🌙 Tối' };

// T2-T4 = trip1 (Chủ nhật); T5-T7 = trip2 (Thứ 4)
const TRIP1_DAYS = ['T2','T3','T4'];
const TRIP2_DAYS = ['T5','T6','T7'];

let DATA = null;

// ── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('data/meals.json');
    DATA = await res.json();
    renderAll();
  } catch (e) {
    document.body.innerHTML = `<p style="padding:2rem;color:red">❌ Không load được data/meals.json: ${e}</p>`;
  }
});

// ── RENDER ALL ───────────────────────────────────────────────
function renderAll() {
  renderScheduleTab();
  renderShoppingTab('trip1', TRIP1_DAYS, 'p2');
  renderShoppingTab('trip2', TRIP2_DAYS, 'p3');
  renderGroceryTab();
}

// ══════════════════════════════════════════════════════════════
//  TAB 1 — LỊCH ĂN & DINH DƯỠNG
// ══════════════════════════════════════════════════════════════
function renderScheduleTab() {
  const wrap = document.getElementById('p1-content');
  if (!wrap) return;

  // Split into 2 rows: T2-T4 and T5-T7
  const rows = [
    { label: 'Thứ 2 — Thứ 3 — Thứ 4', days: ['T2','T3','T4'] },
    { label: 'Thứ 5 — Thứ 6 — Thứ 7', days: ['T5','T6','T7'] },
  ];

  let html = '';
  for (const row of rows) {
    html += `<div class="sec">
      <div class="sec-hd">
        <span class="sec-icon">📅</span>
        <span class="sec-title">${row.label}</span>
      </div>
      <div class="week-grid">`;

    for (const day of row.days) {
      const sched = DATA.schedule[day];
      html += `<div class="day-col"><div class="day-label">${dayLabel(day)}</div>`;

      let nuDay = { P:0, C:0, F:0, kcal:0 };
      let namDay = { P:0, C:0, F:0, kcal:0 };

      for (const slot of SLOTS) {
        html += `<div class="meal-slot"><div class="meal-time">${SLOT_LABEL[slot]}</div>`;

        // Nữ
        const nuMeal = DATA.meals[sched.nu[slot]];
        html += renderMealCard(nuMeal, 'f');
        addMacro(nuDay, nuMeal.macro);

        // Nam
        const namMeal = DATA.meals[sched.nam[slot]];
        html += renderMealCard(namMeal, 'm');
        addMacro(namDay, namMeal.macro);

        html += `</div>`; // meal-slot
      }

      html += `</div>`; // day-col

      // Day total row appended after the grid closes — inject as separate element
      // We'll add it inside the day-col before closing
      // Actually re-open: add total inside day-col
    }

    html += `</div></div>`; // week-grid + sec
  }

  // Re-render with totals properly inside day-col
  html = '';
  for (const row of rows) {
    html += `<div class="sec">
      <div class="sec-hd">
        <span class="sec-icon">📅</span>
        <span class="sec-title">${row.label}</span>
      </div>
      <div class="week-grid">`;

    for (const day of row.days) {
      const sched = DATA.schedule[day];
      let nuDay  = { P:0, C:0, F:0, kcal:0 };
      let namDay = { P:0, C:0, F:0, kcal:0 };

      let dayHtml = '';
      for (const slot of SLOTS) {
        dayHtml += `<div class="meal-slot"><div class="meal-time">${SLOT_LABEL[slot]}</div>`;
        const nuMeal  = DATA.meals[sched.nu[slot]];
        const namMeal = DATA.meals[sched.nam[slot]];
        dayHtml += renderMealCard(nuMeal, 'f');
        dayHtml += renderMealCard(namMeal, 'm');
        addMacro(nuDay,  nuMeal.macro);
        addMacro(namDay, namMeal.macro);
        dayHtml += `</div>`;
      }

      html += `<div class="day-col">
        <div class="day-label">${dayLabel(day)}</div>
        ${dayHtml}
        <div class="day-total">
          <span><span class="tag tf">Nữ</span> P ${nuDay.P.toFixed(1)}g · C ${nuDay.C.toFixed(1)}g · F ${nuDay.F.toFixed(1)}g · <b>${Math.round(nuDay.kcal)} kcal</b></span>
          <span><span class="tag tm">Nam</span> P ~${Math.round(namDay.P)}g · C ~${Math.round(namDay.C)}g · F ~${Math.round(namDay.F)}g · <b>~${Math.round(namDay.kcal)} kcal</b></span>
        </div>
      </div>`;
    }

    html += `</div></div>`;
  }

  wrap.innerHTML = html;
}

// ── render one meal card with hover tooltip ──────────────────
function renderMealCard(meal, gender) {
  const isEst = meal.macro.estimated;
  const fmt = (v, d=1) => isEst ? `~${+v.toFixed(d)}` : `${+v.toFixed(d)}`;

  const ingRows = meal.ingredients.map(i => `
    <div class="tooltip-ing">
      <span class="tooltip-ing-name">${i.name}${i.note ? ` <span class="tooltip-ing-note">(${i.note})</span>` : ''}</span>
      <span class="tooltip-ing-qty">${i.qty} ${i.unit}</span>
    </div>`).join('');

  return `
  <div class="meal-card ${gender}">
    <span class="tip-icon">ⓘ</span>
    <div class="meal-name">${meal.name}</div>
    <div class="macros">
      <span class="chip chip-p">P ${fmt(meal.macro.P)}g</span>
      <span class="chip chip-c">C ${fmt(meal.macro.C)}g</span>
      <span class="chip chip-f">F ${fmt(meal.macro.F)}g</span>
      <span class="chip chip-k">${fmt(meal.macro.kcal,0)} kcal</span>
      ${isEst ? '<span class="chip chip-est">ước tính</span>' : ''}
    </div>
    <div class="tooltip">
      <div class="tooltip-title">🧾 ${meal.name}</div>
      <div class="tooltip-ing-list">${ingRows}</div>
      <div class="tooltip-macros">
        <span class="chip chip-p">P ${fmt(meal.macro.P)}g</span>
        <span class="chip chip-c">C ${fmt(meal.macro.C)}g</span>
        <span class="chip chip-f">F ${fmt(meal.macro.F)}g</span>
        <span class="chip chip-k">${fmt(meal.macro.kcal,0)} kcal</span>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
//  TAB 2 & 3 — SHOPPING: THỊT THEO LẦN ĐI CHỢ
// ══════════════════════════════════════════════════════════════
function renderShoppingTab(tripKey, days, panelId) {
  const wrap = document.getElementById(`${panelId}-content`);
  if (!wrap) return;

  // Aggregate all ingredients for meat/protein items across trip days
  // Filter only protein items (thịt, cá, trứng)
  const PROTEIN_KEYWORDS = [
    'bò beefsteak','bò thăn nội','bắp bò','gân','ức gà phi-lê','ức gà phi lê',
    'má đùi gà','nạc heo','cá hồi','trứng gà'
  ];

  const agg = {}; // name → { qty, unit, details: [{day, slot, gender, mealName, qty}] }

  for (const day of days) {
    const sched = DATA.schedule[day];
    for (const gender of ['nu','nam']) {
      for (const slot of SLOTS) {
        const meal = DATA.meals[sched[gender][slot]];
        for (const ing of meal.ingredients) {
          const lc = ing.name.toLowerCase();
          if (!PROTEIN_KEYWORDS.some(k => lc.includes(k))) continue;

          if (!agg[ing.name]) agg[ing.name] = { unit: ing.unit, total: 0, details: [] };
          agg[ing.name].total += ing.qty;
          agg[ing.name].details.push({
            day, slot, gender,
            mealName: meal.name,
            qty: ing.qty,
            note: ing.note || ''
          });
        }
      }
    }
  }

  let rows = '';
  for (const [name, data] of Object.entries(agg)) {
    const detailLines = data.details.map(d =>
      `<span class="tag t${d.gender === 'nu' ? 'f' : 'm'}">${d.gender === 'nu' ? 'Nữ' : 'Nam'}</span>
       <span class="sm">${d.day} ${SLOT_LABEL[d.slot].replace(/[^\w\s]/gu,'')} — ${d.mealName}: ${d.qty}${data.unit}</span>`
    ).join('<br>');

    rows += `<tr>
      <td><strong>${name}</strong></td>
      <td class="qty">${data.total}${data.unit}</td>
      <td>${detailLines}</td>
    </tr>`;
  }

  // Egg summary
  wrap.innerHTML = `
    <div class="sec">
      <div class="sec-hd">
        <span class="sec-icon">🥩</span>
        <span class="sec-title">Thịt / Cá / Trứng</span>
        <span class="sec-badge">${days[0]}→${days[days.length-1]} only</span>
      </div>
      <table>
        <thead><tr><th>Nguyên liệu</th><th>Tổng</th><th>Chi tiết từng bữa</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="notebox notebox-blue">
      <span>🥦</span>
      <div>${tripKey === 'trip1'
        ? 'Rau củ, tinh bột, gia vị mua 1 lần Chủ nhật cho cả tuần — xem tab <strong>Rau củ & Đồ khô</strong>.'
        : 'Rau củ, tinh bột, gia vị đã mua Chủ nhật — <strong>chỉ ghé mua thịt là xong!</strong>'
      }</div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════
//  TAB 4 — RAU CỦ & ĐỒ KHÔ (non-protein ingredients)
// ══════════════════════════════════════════════════════════════
function renderGroceryTab() {
  const wrap = document.getElementById('p4-content');
  if (!wrap) return;

  const PROTEIN_KEYWORDS = [
    'bò beefsteak','bò thăn nội','bắp bò','gân','ức gà phi-lê','ức gà phi lê',
    'má đùi gà','nạc heo','cá hồi','trứng gà'
  ];

  // Group by category
  const CATEGORIES = {
    'Rau củ & Trái cây': [
      'chuối','đậu bắp','đậu que','bắp (ngô)','bông cải xanh','bông cải trắng',
      'nấm tươi','ớt chuông','cà chua','cải ngọt','bí đỏ','cà rốt','khoai tây',
      'hành tây','rau củ hỗn hợp','xà lách','bắp cải trắng','giá đỗ','hẹ',
      'khóm','rau muống','rau lang'
    ],
    'Tinh bột / Ngũ cốc': [
      'cơm trắng','gạo lứt','gạo trắng','yến mạch','bột yến mạch','bánh mì nguyên cám',
      'cơm gạo lứt'
    ],
    'Sữa / Phô mai / Chất béo': [
      'sữa tươi 0 đường','sữa tươi không đường','sữa chua ít đường','phô mai lát',
      'bơ quả (avocado)','bơ đậu phộng','mật ong','nước dừa tươi'
    ],
    'Gia vị & Khác': [
      'sốt takoyaki','bột cacao nguyên chất','bột matcha nguyên chất','rong biển nori',
      'dầu ăn','nước cốt chanh'
    ],
  };

  const agg = {};

  for (const day of DAYS) {
    const sched = DATA.schedule[day];
    for (const gender of ['nu','nam']) {
      for (const slot of SLOTS) {
        const meal = DATA.meals[sched[gender][slot]];
        for (const ing of meal.ingredients) {
          const lc = ing.name.toLowerCase();
          if (PROTEIN_KEYWORDS.some(k => lc.includes(k))) continue;

          if (!agg[ing.name]) agg[ing.name] = { unit: ing.unit, total: 0, details: [] };
          agg[ing.name].total += ing.qty;
          agg[ing.name].details.push({
            day, slot, gender,
            mealName: meal.name,
            qty: ing.qty,
            note: ing.note || ''
          });
        }
      }
    }
  }

  let html = '';

  for (const [catName, keywords] of Object.entries(CATEGORIES)) {
    const catEmoji = {
      'Rau củ & Trái cây': '🥦',
      'Tinh bột / Ngũ cốc': '🌾',
      'Sữa / Phô mai / Chất béo': '🥛',
      'Gia vị & Khác': '🫙',
    }[catName] || '📦';

    let rows = '';
    for (const [name, data] of Object.entries(agg)) {
      if (!keywords.some(k => name.toLowerCase().includes(k))) continue;

      const detailLines = data.details.map(d =>
        `<span class="tag t${d.gender === 'nu' ? 'f' : 'm'}">${d.gender === 'nu' ? 'Nữ' : 'Nam'}</span>
         <span class="sm">${d.day} ${SLOT_LABEL[d.slot].replace(/[^\w\s]/gu,'')} ${d.mealName}: ${d.qty}${data.unit}${d.note ? ` (${d.note})` : ''}</span>`
      ).join('<br>');

      const displayQty = name.toLowerCase().includes('cơm trắng')
        ? `${data.total}g ≈ ${(data.total/1000*1.3).toFixed(1)}kg gạo`
        : `${data.total}${data.unit}`;

      rows += `<tr>
        <td><strong>${name}</strong></td>
        <td class="qty">${displayQty}</td>
        <td>${detailLines}</td>
      </tr>`;
    }

    if (!rows) continue;

    html += `<div class="sec">
      <div class="sec-hd">
        <span class="sec-icon">${catEmoji}</span>
        <span class="sec-title">${catName}</span>
        <span class="sec-badge">cả tuần T2→T7</span>
      </div>
      <table>
        <thead><tr><th>Nguyên liệu</th><th>Tổng</th><th>Chi tiết dùng</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  // Anything not categorized
  let uncatRows = '';
  for (const [name, data] of Object.entries(agg)) {
    const lc = name.toLowerCase();
    if (PROTEIN_KEYWORDS.some(k => lc.includes(k))) continue;
    const allKw = Object.values(CATEGORIES).flat();
    if (allKw.some(k => lc.includes(k))) continue;
    uncatRows += `<tr><td><strong>${name}</strong></td><td class="qty">${data.total}${data.unit}</td><td class="sm">các bữa</td></tr>`;
  }
  if (uncatRows) {
    html += `<div class="sec">
      <div class="sec-hd"><span class="sec-icon">📦</span><span class="sec-title">Khác</span></div>
      <table><thead><tr><th>Tên</th><th>Tổng</th><th>Chi tiết</th></tr></thead>
      <tbody>${uncatRows}</tbody></table></div>`;
  }

  html += `<div class="notebox">
    <span>💡</span>
    <div>Check sẵn ở nhà: <strong>tỏi, hành khô, muối, tiêu</strong>. Rau lá để ngăn mát 3–4 ngày · Rau củ cứng để cả tuần.</div>
  </div>`;

  wrap.innerHTML = html;
}

// ── HELPERS ──────────────────────────────────────────────────
function addMacro(acc, macro) {
  acc.P    += macro.P    || 0;
  acc.C    += macro.C    || 0;
  acc.F    += macro.F    || 0;
  acc.kcal += macro.kcal || 0;
}

function dayLabel(d) {
  const map = { T2:'Thứ 2', T3:'Thứ 3', T4:'Thứ 4', T5:'Thứ 5', T6:'Thứ 6', T7:'Thứ 7' };
  return map[d] || d;
}

// ── TAB SWITCHING ─────────────────────────────────────────────
window.sw = function(n) {
  [1,2,3,4].forEach(i => document.getElementById('p'+i).classList.toggle('active', i===n));
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('off', i+1!==n));
};
