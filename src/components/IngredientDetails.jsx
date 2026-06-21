/**
 * IngredientDetails — render danh sách "Nữ T2 Tra Tên món: 100g (note)"
 * dùng chung cho bảng tab Thịt và tab Rau củ.
 */
import { Fragment } from 'react';
import { slotText } from '../lib/format.js';

export function IngredientDetails({ details, unit, withNote = false }) {
  return details.map((d, i) => {
    const tag = d.gender === 'nu' ? 'f' : 'm';
    const label = d.gender === 'nu' ? 'Nữ' : 'Nam';
    const note = withNote && d.note ? ` (${d.note})` : '';
    return (
      <Fragment key={i}>
        {i > 0 && <br />}
        <span className={`tag t${tag}`}>{label}</span>{' '}
        <span className="sm">{d.day} {slotText(d.slot)} {d.mealName}: {d.qty}{unit}{note}</span>
      </Fragment>
    );
  });
}
