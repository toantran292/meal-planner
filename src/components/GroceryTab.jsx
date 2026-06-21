/**
 * GroceryTab — Tab 4: rau củ & đồ khô (non-protein), gom theo category.
 * Cho phép chọn ngày cần mua (mặc định = cả tuần).
 */
import { useState } from 'react';
import { CATEGORIES, DAYS } from '../lib/config.js';
import { aggregateIngredients, isProtein } from '../lib/calc.js';
import { IngredientDetails } from './IngredientDetails.jsx';
import { DayPicker } from './DayPicker.jsx';

const displayQty = (name, total, unit) =>
  name.toLowerCase().includes('cơm trắng')
    ? `${total}g ≈ ${(total / 1000 * 1.3).toFixed(1)}kg gạo`
    : `${total}${unit}`;

export function GroceryTab({ data, days }) {
  const [selected, setSelected] = useState(days);

  const toggleDay = (d) =>
    setSelected((cur) =>
      cur.includes(d)
        ? cur.filter((x) => x !== d)
        : DAYS.filter((x) => cur.includes(x) || x === d));

  const agg = aggregateIngredients(data, selected, (name) => !isProtein(name));
  const matchedKeywords = Object.values(CATEGORIES).flatMap((c) => c.keywords);

  const badge = selected.length === DAYS.length
    ? `cả tuần ${DAYS[0]}→${DAYS[DAYS.length - 1]}`
    : `${selected.length} ngày: ${selected.join(' · ')}`;

  // các category có ít nhất 1 dòng
  const cats = Object.entries(CATEGORIES)
    .map(([catName, { emoji, keywords }]) => ({
      catName,
      emoji,
      rows: Object.entries(agg).filter(([name]) =>
        keywords.some((k) => name.toLowerCase().includes(k))),
    }))
    .filter((c) => c.rows.length > 0);

  // nguyên liệu non-protein chưa thuộc category nào
  const uncategorized = Object.entries(agg).filter(([name]) =>
    !matchedKeywords.some((k) => name.toLowerCase().includes(k)));

  return (
    <>
      <div className="picker-bar">
        <DayPicker selected={selected} onToggle={toggleDay} />
      </div>

      {selected.length === 0 ? (
        <div className="sec"><div className="empty-state">Chọn ít nhất 1 ngày để xem danh sách rau củ & đồ khô.</div></div>
      ) : (
        <>
          {cats.map(({ catName, emoji, rows }) => (
            <div className="sec" key={catName}>
              <div className="sec-hd">
                <span className="sec-icon">{emoji}</span>
                <span className="sec-title">{catName}</span>
                <span className="sec-badge">{badge}</span>
              </div>
              <table>
                <thead>
                  <tr><th>Nguyên liệu</th><th>Tổng</th><th>Chi tiết dùng</th></tr>
                </thead>
                <tbody>
                  {rows.map(([name, d]) => (
                    <tr key={name}>
                      <td><strong>{name}</strong></td>
                      <td className="qty">{displayQty(name, d.total, d.unit)}</td>
                      <td><IngredientDetails details={d.details} unit={d.unit} withNote /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-icon">📦</span><span className="sec-title">Khác</span>
              </div>
              <table>
                <thead><tr><th>Tên</th><th>Tổng</th><th>Chi tiết</th></tr></thead>
                <tbody>
                  {uncategorized.map(([name, d]) => (
                    <tr key={name}>
                      <td><strong>{name}</strong></td>
                      <td className="qty">{d.total}{d.unit}</td>
                      <td className="sm">các bữa</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="notebox">
        <span>💡</span>
        <div>Check sẵn ở nhà: <strong>tỏi, hành khô, muối, tiêu</strong>. Rau lá để ngăn mát 3–4 ngày · Rau củ cứng để cả tuần.</div>
      </div>
    </>
  );
}
