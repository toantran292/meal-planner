/**
 * App — header + tabs + 4 panel. State: tab đang mở.
 * Data import trực tiếp từ src/data/meals.json (source of truth).
 */
import { useState } from 'react';
import data from './data/meals.json';
import { TRIP1_DAYS, TRIP2_DAYS, DAYS } from './lib/config.js';
import { ScheduleTab } from './components/ScheduleTab.jsx';
import { ShoppingTab } from './components/ShoppingTab.jsx';
import { GroceryTab } from './components/GroceryTab.jsx';

const TABS = [
  { n: 1, cls: 'tab-1', label: '📅 Lịch ăn & Dinh dưỡng' },
  { n: 2, cls: 'tab-2', label: '🗓 Chủ nhật — Thịt lần 1' },
  { n: 3, cls: 'tab-3', label: '🗓 Thứ 4 — Thịt lần 2' },
  { n: 4, cls: 'tab-4', label: '🥦 Rau củ & Đồ khô' },
];

function Panel({ n, active, header, children }) {
  return (
    <div className={`panel${active ? ' active' : ''}`} id={`p${n}`}>
      {header}
      {children}
    </div>
  );
}

const Phdr = ({ bg, title, sub, badge }) => (
  <div className="phdr" style={{ background: `var(${bg})` }}>
    <div>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
    <div className="pbadge">{badge}</div>
  </div>
);

export function App() {
  const [tab, setTab] = useState(1);

  return (
    <>
      <div className="hdr">
        <div>
          <div className="hdr-title">🛒 Lịch Đi Chợ & Dinh Dưỡng</div>
          <div className="hdr-sub">2 người · Nam & Nữ · Thứ 2 → Thứ 7 · Hover vào bữa để xem nguyên liệu chi tiết</div>
        </div>
        <div className="legend">
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--female)' }} />Nữ</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--male)' }} />Nam</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--chip-p-fg)', borderRadius: 3 }} />Protein</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--chip-c-fg)', borderRadius: 3 }} />Carb</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--chip-f-fg)', borderRadius: 3 }} />Fat</div>
          <div className="leg"><div className="leg-dot" style={{ background: 'var(--chip-k-fg)', borderRadius: 3 }} />kcal</div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.n}
            className={`tab ${t.cls}${tab === t.n ? '' : ' off'}`}
            onClick={() => setTab(t.n)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="container">
        <Panel
          n={1}
          active={tab === 1}
          header={<Phdr bg="--g1" title="Lịch ăn & Dinh dưỡng" sub="Hover vào từng bữa để xem nguyên liệu chi tiết · Nữ macro chính xác · Nam ước tính" badge="T2 → T7" />}
        >
          <ScheduleTab data={data} />
          <div className="notebox">
            <span>📌</span>
            <div>
              Macro <span className="tag tf">Nữ</span> lấy từ bảng gốc (chính xác).
              Macro <span className="tag tm">Nam</span> ước tính theo nguyên liệu chuẩn.
              Hover vào card để xem nguyên liệu từng bữa.
            </div>
          </div>
        </Panel>

        <Panel
          n={2}
          active={tab === 2}
          header={<Phdr bg="--g1" title="Lần 1 — Chủ nhật" sub="Thịt tươi cho Thứ 2 → Thứ 4 · Tổng hợp tự động từ lịch ăn" badge="T2 · T3 · T4" />}
        >
          <ShoppingTab data={data} tripKey="trip1" days={TRIP1_DAYS} />
        </Panel>

        <Panel
          n={3}
          active={tab === 3}
          header={<Phdr bg="--g2" title="Lần 2 — Thứ 4" sub="Thịt tươi cho Thứ 5 → Thứ 7 · Tổng hợp tự động từ lịch ăn" badge="T5 · T6 · T7" />}
        >
          <ShoppingTab data={data} tripKey="trip2" days={TRIP2_DAYS} />
        </Panel>

        <Panel
          n={4}
          active={tab === 4}
          header={<Phdr bg="--g4" title="Rau củ & Đồ khô" sub="Mua 1 lần Chủ nhật · Tổng hợp tự động từ lịch ăn cả tuần" badge="T2 → T7" />}
        >
          <GroceryTab data={data} days={DAYS} />
        </Panel>
      </div>
    </>
  );
}
