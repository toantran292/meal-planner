/**
 * ScheduleTab — Tab 1: lịch ăn cả tuần + tổng macro mỗi ngày.
 */
import { SLOTS, SLOT_LABEL, DAY_LABEL } from '../lib/config.js';
import { dayMacro } from '../lib/calc.js';
import { MealCard } from './MealCard.jsx';

const ROWS = [
  { label: 'Thứ 2 — Thứ 3 — Thứ 4', days: ['T2', 'T3', 'T4'] },
  { label: 'Thứ 5 — Thứ 6 — Thứ 7', days: ['T5', 'T6', 'T7'] },
];

function DayColumn({ data, day }) {
  const sched = data.schedule[day];
  const nu = dayMacro(data, day, 'nu');
  const nam = dayMacro(data, day, 'nam');

  return (
    <div className="day-col">
      <div className="day-label">{DAY_LABEL[day] || day}</div>

      {SLOTS.map((slot) => (
        <div className="meal-slot" key={slot}>
          <div className="meal-time">{SLOT_LABEL[slot]}</div>
          <MealCard meal={data.meals[sched.nu[slot]]} gender="f" />
          <MealCard meal={data.meals[sched.nam[slot]]} gender="m" />
        </div>
      ))}

      <div className="day-total">
        <span>
          <span className="tag tf">Nữ</span> P {nu.P.toFixed(1)}g · C {nu.C.toFixed(1)}g · F {nu.F.toFixed(1)}g · <b>{Math.round(nu.kcal)} kcal</b>
        </span>
        <span>
          <span className="tag tm">Nam</span> P ~{Math.round(nam.P)}g · C ~{Math.round(nam.C)}g · F ~{Math.round(nam.F)}g · <b>~{Math.round(nam.kcal)} kcal</b>
        </span>
      </div>
    </div>
  );
}

export function ScheduleTab({ data }) {
  return (
    <>
      {ROWS.map((row) => (
        <div className="sec" key={row.label}>
          <div className="sec-hd">
            <span className="sec-icon">📅</span>
            <span className="sec-title">{row.label}</span>
          </div>
          <div className="week-grid">
            {row.days.map((day) => (
              <DayColumn data={data} day={day} key={day} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
