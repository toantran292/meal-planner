/**
 * MealCard — card 1 bữa ăn + tooltip nguyên liệu.
 * Desktop: hover. Mobile (không có hover): tap để mở/đóng tooltip.
 */
import { useState } from 'react';

export function MacroChips({ macro, withEst = false }) {
  const est = macro.estimated;
  const fmt = (v, d = 1) => (est ? `~${+v.toFixed(d)}` : `${+v.toFixed(d)}`);
  return (
    <>
      <span className="chip chip-p">P {fmt(macro.P)}g</span>
      <span className="chip chip-c">C {fmt(macro.C)}g</span>
      <span className="chip chip-f">F {fmt(macro.F)}g</span>
      <span className="chip chip-k">{fmt(macro.kcal, 0)} kcal</span>
      {withEst && est && <span className="chip chip-est">ước tính</span>}
    </>
  );
}

export function MealCard({ meal, gender }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`meal-card ${gender}${open ? ' open' : ''}`}
      onClick={() => setOpen((v) => !v)}
    >
      <span className="tip-icon">ⓘ</span>
      <div className="meal-name">{meal.name}</div>
      <div className="macros"><MacroChips macro={meal.macro} withEst /></div>

      <div className="tooltip">
        <div className="tooltip-title">🧾 {meal.name}</div>
        <div className="tooltip-ing-list">
          {meal.ingredients.map((i, idx) => (
            <div className="tooltip-ing" key={idx}>
              <span className="tooltip-ing-name">
                {i.name}
                {i.note && <span className="tooltip-ing-note"> ({i.note})</span>}
              </span>
              <span className="tooltip-ing-qty">{i.qty} {i.unit}</span>
            </div>
          ))}
        </div>
        <div className="tooltip-macros"><MacroChips macro={meal.macro} /></div>
      </div>
    </div>
  );
}
