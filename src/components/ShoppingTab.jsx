/**
 * ShoppingTab — Tab 2 & 3: thịt/cá/trứng theo từng lần đi chợ.
 * Cho phép chọn ngày cần mua (mặc định = các ngày của lần đi chợ đó).
 */
import { useState } from 'react';
import { DAYS } from '../lib/config.js';
import { aggregateIngredients, isProtein } from '../lib/calc.js';
import { IngredientDetails } from './IngredientDetails.jsx';
import { DayPicker } from './DayPicker.jsx';

export function ShoppingTab({ data, tripKey, days }) {
  const [selected, setSelected] = useState(days);

  const toggleDay = (d) =>
    setSelected((cur) =>
      cur.includes(d)
        ? cur.filter((x) => x !== d)
        // giữ đúng thứ tự T2…T7
        : DAYS.filter((x) => cur.includes(x) || x === d));

  const agg = aggregateIngredients(data, selected, isProtein);
  const entries = Object.entries(agg);

  return (
    <>
      <div className="sec">
        <div className="sec-hd">
          <span className="sec-icon">🥩</span>
          <span className="sec-title">Thịt / Cá / Trứng</span>
          <span className="sec-badge">
            {selected.length ? `${selected.length} ngày: ${selected.join(' · ')}` : 'chưa chọn ngày'}
          </span>
        </div>

        <div className="sec-toolbar">
          <DayPicker selected={selected} onToggle={toggleDay} />
        </div>

        {selected.length === 0 ? (
          <div className="empty-state">Chọn ít nhất 1 ngày để xem danh sách thịt cần mua.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Nguyên liệu</th><th>Tổng</th><th>Chi tiết từng bữa</th></tr>
            </thead>
            <tbody>
              {entries.map(([name, d]) => (
                <tr key={name}>
                  <td><strong>{name}</strong></td>
                  <td className="qty">{d.total}{d.unit}</td>
                  <td><IngredientDetails details={d.details} unit={d.unit} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="notebox notebox-blue">
        <span>🥦</span>
        <div>
          {tripKey === 'trip1'
            ? <>Rau củ, tinh bột, gia vị mua 1 lần Chủ nhật cho cả tuần — xem tab <strong>Rau củ & Đồ khô</strong>.</>
            : <>Rau củ, tinh bột, gia vị đã mua Chủ nhật — <strong>chỉ ghé mua thịt là xong!</strong></>}
        </div>
      </div>
    </>
  );
}
