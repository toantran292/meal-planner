/**
 * DayPicker — chip chọn ngày (T2…T7) để lọc danh sách đi chợ.
 */
import { DAYS, DAY_LABEL } from '../lib/config.js';

export function DayPicker({ selected, onToggle }) {
  return (
    <div className="day-picker">
      <span className="day-picker-label">Chọn ngày cần mua:</span>
      <div className="day-chips">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            className={`day-chip${selected.includes(d) ? ' on' : ''}`}
            onClick={() => onToggle(d)}
            aria-pressed={selected.includes(d)}
          >
            {DAY_LABEL[d]}
          </button>
        ))}
      </div>
    </div>
  );
}
