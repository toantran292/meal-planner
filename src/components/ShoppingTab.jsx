/**
 * ShoppingTab — Tab 2 & 3: thịt/cá/trứng theo từng lần đi chợ.
 */
import { aggregateIngredients, isProtein } from '../lib/calc.js';
import { IngredientDetails } from './IngredientDetails.jsx';

export function ShoppingTab({ data, tripKey, days }) {
  const agg = aggregateIngredients(data, days, isProtein);
  const entries = Object.entries(agg);

  return (
    <>
      <div className="sec">
        <div className="sec-hd">
          <span className="sec-icon">🥩</span>
          <span className="sec-title">Thịt / Cá / Trứng</span>
          <span className="sec-badge">{days[0]}→{days[days.length - 1]} only</span>
        </div>
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
