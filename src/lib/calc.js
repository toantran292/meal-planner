/**
 * js/calc.js
 * Logic tính toán thuần (không đụng DOM): cộng macro, tổng hợp nguyên liệu.
 */

import { SLOTS, PROTEIN_KEYWORDS } from './config.js';

/** Cộng dồn macro của 1 bữa vào accumulator { P, C, F, kcal }. */
export function addMacro(acc, macro) {
  acc.P    += macro.P    || 0;
  acc.C    += macro.C    || 0;
  acc.F    += macro.F    || 0;
  acc.kcal += macro.kcal || 0;
  return acc;
}

/** Tổng macro 1 ngày cho 1 giới (nu | nam) từ schedule. */
export function dayMacro(data, day, gender) {
  const acc = { P: 0, C: 0, F: 0, kcal: 0 };
  const sched = data.schedule[day][gender];
  for (const slot of SLOTS) {
    addMacro(acc, data.meals[sched[slot]].macro);
  }
  return acc;
}

/** True nếu tên nguyên liệu là protein (thịt/cá/trứng). */
export function isProtein(name) {
  const lc = name.toLowerCase();
  return PROTEIN_KEYWORDS.some(k => lc.includes(k));
}

/**
 * Gom & cộng dồn nguyên liệu qua nhiều ngày.
 * @param {object}   data   - { meals, schedule }
 * @param {string[]} days   - vd ['T2','T3','T4']
 * @param {(name:string)=>boolean} keep - giữ nguyên liệu nào (vd isProtein)
 * @returns {Object<string, {unit, total, details[]}>}
 */
export function aggregateIngredients(data, days, keep) {
  const agg = {};
  for (const day of days) {
    const sched = data.schedule[day];
    for (const gender of ['nu', 'nam']) {
      for (const slot of SLOTS) {
        const meal = data.meals[sched[gender][slot]];
        for (const ing of meal.ingredients) {
          if (!keep(ing.name)) continue;
          if (!agg[ing.name]) agg[ing.name] = { unit: ing.unit, total: 0, details: [] };
          agg[ing.name].total += ing.qty;
          agg[ing.name].details.push({
            day, slot, gender,
            mealName: meal.name,
            qty: ing.qty,
            note: ing.note || '',
          });
        }
      }
    }
  }
  return agg;
}
