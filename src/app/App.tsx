import { useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  subtitle: string;
  tone: string;
  accent: string;
  shared: string;
  sharedHint: string;
  inputs: Array<{ title: string; cadence: string; items: string[] }>;
  facts: string[];
  marts: string[];
  outputs: string[];
};

const tasks: Task[] = [
  {
    id: 1,
    title: "BT1 - Lương và sản lượng khai thác",
    subtitle: "Lương chi tiết Input → BigQuery → Data Mart → Kết quả đầu ra",
    tone: "#009b90",
    accent: "#22b8a9",
    shared: "Googlesheet",
    sharedHint: "ETL → BigQuery",
    inputs: [
      {
        title: "3 Appsheet nhập sản lượng mủ",
        cadence: "Hằng ngày",
        items: ["QR code nhận diện công nhân", "Ngày, MSNV, mủ nước/tạp/dây/phụ", "Nơi nhận, lái xe, mã chuyến"]
      },
      {
        title: "Tính lương CN khai thác",
        cadence: "Tuần + Tháng",
        items: ["GoogleSheet: kế hoạch sản lượng năm", "Appsheet: chấm điểm CL A-B-C-D", "KTKL mủ NL: cân tại nông trường", "Thực tế cân tại nhà máy", "Chênh lệch hao hụt"]
      }
    ],
    facts: ["fact_ke_hoach_sl", "fact_gn_san_luong", "fact_xac_nhan_drc", "fact_luong_cn"],
    marts: ["DM sản lượng ngày", "DM chất lượng mủ", "DM lương công nhân"],
    outputs: ["Bảng lương công nhân", "Theo dõi sản lượng", "Đối soát hao hụt"]
  },
  {
    id: 2,
    title: "BT2 - Vườn cây, khai thác và nông vụ",
    subtitle: "Nhật ký vườn cây → BigQuery → Data Mart → Dashboard vận hành",
    tone: "#0b73a8",
    accent: "#2b9dcc",
    shared: "Googlesheet",
    sharedHint: "Chuẩn hóa → BigQuery",
    inputs: [
      {
        title: "Appsheet nhật ký nông trường",
        cadence: "Hằng ngày",
        items: ["Lô, đội, tổ, công nhân", "Công việc khai thác/nông vụ", "Sản lượng và tình trạng vườn cây"]
      },
      {
        title: "Bảng kế hoạch chăm sóc",
        cadence: "Tuần + Tháng",
        items: ["Lịch cạo, lịch bón phân", "Định mức vật tư", "Kế hoạch sản lượng theo lô"]
      }
    ],
    facts: ["fact_nhat_ky_vuon", "fact_cham_soc", "fact_ke_hoach_lo", "fact_vat_tu"],
    marts: ["DM tiến độ nông vụ", "DM năng suất lô", "DM cảnh báo vườn cây"],
    outputs: ["Báo cáo nông vụ", "Dashboard năng suất", "Cảnh báo chậm tiến độ"]
  },
  {
    id: 3,
    title: "BT3 - Kho, nhập xuất và tồn mủ",
    subtitle: "Phiếu kho → BigQuery → Data Mart → Báo cáo tồn kho",
    tone: "#d98216",
    accent: "#f5a524",
    shared: "Googlesheet",
    sharedHint: "ETL kho → BigQuery",
    inputs: [
      {
        title: "Appsheet nhập/xuất kho",
        cadence: "Theo phát sinh",
        items: ["Phiếu nhập, phiếu xuất", "Loại mủ, khối lượng, độ DRC", "Kho, xe, tài xế, chuyến"]
      },
      {
        title: "Bảng quy đổi và kiểm kê",
        cadence: "Ngày + Tháng",
        items: ["Quy đổi mủ nước về khô", "Biên bản kiểm kê", "Chênh lệch thực tế và sổ sách"]
      }
    ],
    facts: ["fact_nhap_kho", "fact_xuat_kho", "fact_ton_kho", "dim_kho"],
    marts: ["DM tồn kho", "DM nhập xuất", "DM kiểm kê"],
    outputs: ["Báo cáo tồn kho", "Theo dõi nhập xuất", "Cảnh báo lệch kho"]
  },
  {
    id: 4,
    title: "BT4 - PowerBI + Excel điều hành",
    subtitle: "Fact tables → Data mart → PowerBI/Excel cho vận hành",
    tone: "#7657c8",
    accent: "#9a7ee8",
    shared: "Googlesheet",
    sharedHint: "Mapping → BigQuery",
    inputs: [
      {
        title: "Nguồn dữ liệu tổng hợp",
        cadence: "Tự động",
        items: ["Sản lượng, lương, kho", "Kế hoạch và thực hiện", "Chất lượng và hao hụt"]
      },
      {
        title: "Bảng tham số báo cáo",
        cadence: "Theo kỳ",
        items: ["Kỳ báo cáo", "Cấu trúc nông trường/đội/tổ", "Bộ chỉ tiêu quản trị"]
      }
    ],
    facts: ["fact_san_luong", "fact_luong", "fact_ton_kho", "dim_thoi_gian"],
    marts: ["DM vận hành ngày", "DM tổng hợp tháng", "DM chỉ tiêu KPI"],
    outputs: ["PowerBI dashboard", "Excel điều hành", "Bộ KPI quản trị"]
  }
];

const bt5Steps = [
  { title: "BigQuery", text: "Nguồn dữ liệu đã chuẩn hóa" },
  { title: "Query dữ liệu", text: "Lọc, gom nhóm, tính chỉ tiêu" },
  { title: "Data mart", text: "Bảng phục vụ mẫu báo cáo" },
  { title: "Báo cáo theo mẫu Tập đoàn", text: "Xuất đúng cấu trúc biểu mẫu" }
];

function ArrowMarker({ color }: { color: string }) {
  return (
    <svg width="0" height="0" aria-hidden="true">
      <defs>
        <marker id={`arrow-${color.replace("#", "")}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
    </svg>
  );
}

function InputCard({ item, color }: { item: Task["inputs"][number]; color: string }) {
  return (
    <article className="input-card" style={{ borderColor: color }}>
      <h3>{item.title}</h3>
      <ul>
        {item.items.map((line) => <li key={line}>{line}</li>)}
      </ul>
      <span>{item.cadence}</span>
    </article>
  );
}

function DataList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <section className="data-list">
      <h3 style={{ color }}>{title}</h3>
      {items.map((item) => <p key={item}>{item}</p>)}
    </section>
  );
}

function MergeFlow({ task }: { task: Task }) {
  const markerId = `arrow-${task.tone.replace("#", "")}`;

  return (
    <div className="merge-flow">
      <ArrowMarker color={task.tone} />
      <div className="input-stack">
        {task.inputs.map((item) => <InputCard key={item.title} item={item} color={task.tone} />)}
      </div>
      <div className="merge-lane" aria-hidden="true">
        <svg viewBox="0 0 180 340" preserveAspectRatio="none">
          <path d="M2 72 H58 Q76 72 76 92 V170" stroke={task.tone} markerEnd={`url(#${markerId})`} />
          <path d="M2 268 H58 Q76 268 76 248 V170" stroke={task.tone} markerEnd={`url(#${markerId})`} />
          <path d="M76 170 H176" stroke={task.tone} markerEnd={`url(#${markerId})`} />
        </svg>
      </div>
      <article className="sheet-card" style={{ borderColor: task.tone }}>
        <strong>{task.shared}</strong>
        <small>{task.sharedHint}</small>
      </article>
    </div>
  );
}

function DetailPage({ task }: { task: Task }) {
  return (
    <main className="detail-page">
      <div className="section-title" style={{ borderColor: task.tone }}>
        <div>
          <h2>{task.title}</h2>
          <p>{task.subtitle}</p>
        </div>
      </div>

      <div className="flow-grid">
        <MergeFlow task={task} />
        <div className="bigquery" style={{ background: task.tone, boxShadow: `0 16px 38px ${task.accent}66` }}>
          <strong>BIG QUERY</strong>
          <span>Data Lake → ETL → Data Warehouse</span>
        </div>
        <div className="arrow-band" style={{ color: task.tone }}>→</div>
        <DataList title="FACT / DIM Tables" items={task.facts} color={task.tone} />
        <div className="arrow-band" style={{ color: task.tone }}>→</div>
        <DataList title="Data mart" items={task.marts} color={task.tone} />
        <div className="arrow-band" style={{ color: task.tone }}>→</div>
        <DataList title="Kết quả đầu ra" items={task.outputs} color={task.tone} />
      </div>
    </main>
  );
}

function Overview({ onPick }: { onPick: (id: number) => void }) {
  return (
    <main className="overview">
      <section className="overview-band">
        <div className="overview-source">
          <h2>Nguồn nhập liệu</h2>
          <button onClick={() => onPick(1)}>Appsheet nhập sản lượng mủ</button>
          <button onClick={() => onPick(2)}>Nhật ký nông trường</button>
          <button onClick={() => onPick(3)}>Nhập xuất kho</button>
          <button onClick={() => onPick(4)}>PowerBI + Excel điều hành</button>
        </div>
        <div className="overview-core">
          <div>Googlesheet</div>
          <span>ETL</span>
          <div>BigQuery</div>
          <span>Data mart</span>
        </div>
        <div className="overview-output">
          <h2>Đầu ra</h2>
          <button>Sản lượng</button>
          <button>Lương công nhân</button>
          <button>Tồn kho</button>
          <button>Báo cáo biểu mẫu Tập đoàn</button>
        </div>
      </section>
    </main>
  );
}

function Bt5ReportPage() {
  return (
    <main className="bt5-page">
      <div className="section-title red">
        <div>
          <h2>BT5 - Báo cáo biểu mẫu Tập đoàn</h2>
          <p>Big Query → Query dữ liệu → Data mart → Báo cáo theo mẫu Tập đoàn</p>
        </div>
      </div>
      <div className="bt5-flow">
        {bt5Steps.map((step, index) => (
          <div className="bt5-step-wrap" key={step.title}>
            <article className="bt5-step">
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </article>
            {index < bt5Steps.length - 1 && <b>→</b>}
          </div>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const task = useMemo(() => tasks.find((item) => item.id === active), [active]);

  return (
    <div className="app-shell">
      <style>{css}</style>
      <header className="topbar">
        <div>
          <p>CS Chư Sê</p>
          <h1>Data flow cao su</h1>
        </div>
        <nav>
          <button className={active === 0 ? "active" : ""} onClick={() => setActive(0)}>Tổng quan</button>
          {tasks.map((item) => (
            <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>
              BT{item.id}
            </button>
          ))}
          <button className={active === 5 ? "active" : ""} onClick={() => setActive(5)}>BT5</button>
        </nav>
      </header>

      {active === 0 && <Overview onPick={setActive} />}
      {task && <DetailPage task={task} />}
      {active === 5 && <Bt5ReportPage />}
    </div>
  );
}

const css = `
:root {
  color: #06423d;
  background: #f4faf8;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: #f4faf8; }
button { font: inherit; }
.app-shell { min-height: 100vh; background: #f4faf8; }
.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  min-height: 86px;
  padding: 16px 28px;
  background: linear-gradient(90deg, #146b48, #31aa9d);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-shadow: 0 8px 22px rgba(7, 64, 55, .16);
}
.topbar p { margin: 0 0 4px; font-weight: 800; opacity: .86; }
.topbar h1 { margin: 0; font-size: 28px; line-height: 1; }
.topbar nav { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.topbar button {
  border: 1px solid rgba(255,255,255,.28);
  background: rgba(255,255,255,.16);
  color: white;
  border-radius: 8px;
  padding: 9px 14px;
  font-weight: 800;
  cursor: pointer;
}
.topbar button.active { background: white; color: #0a7f73; }
.overview, .detail-page, .bt5-page { padding: 28px; }
.overview-band {
  min-height: 620px;
  border: 1px solid #d7ebe7;
  background: white;
  display: grid;
  grid-template-columns: 290px 1fr 300px;
  gap: 36px;
  align-items: center;
  padding: 34px;
  overflow: hidden;
}
.overview-source, .overview-output {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.overview-source h2, .overview-output h2 { margin: 0 0 8px; color: #008a7f; }
.overview-source button, .overview-output button {
  text-align: left;
  min-height: 70px;
  border: 2px solid #009b90;
  background: #e8fbf7;
  color: #00756d;
  border-radius: 10px;
  padding: 14px 16px;
  font-weight: 900;
  cursor: pointer;
}
.overview-core {
  min-height: 420px;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  align-content: center;
  gap: 22px;
}
.overview-core div {
  width: min(330px, 92%);
  min-height: 74px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #0f988c;
  color: white;
  font-size: 24px;
  font-weight: 950;
  box-shadow: 0 16px 34px rgba(18, 151, 137, .24);
}
.overview-core span { color: #0f988c; font-weight: 950; font-size: 22px; }
.section-title {
  border-left: 6px solid #009b90;
  background: white;
  padding: 18px 22px;
  margin-bottom: 22px;
  box-shadow: 0 8px 20px rgba(8, 72, 65, .08);
}
.section-title.red { border-color: #e23737; }
.section-title h2 { margin: 0 0 6px; font-size: 26px; color: #008a7f; }
.section-title.red h2 { color: #df2f2f; }
.section-title p { margin: 0; font-weight: 700; color: #43736d; }
.flow-grid {
  min-height: 600px;
  background: white;
  border: 1px solid #dbeeea;
  padding: 28px;
  display: grid;
  grid-template-columns: minmax(430px, 1.2fr) 170px 52px minmax(170px, .8fr) 52px minmax(170px, .8fr) 52px minmax(190px, .9fr);
  gap: 14px;
  align-items: center;
  overflow-x: auto;
}
.merge-flow {
  display: grid;
  grid-template-columns: minmax(230px, 1fr) 138px 170px;
  gap: 0;
  align-items: center;
}
.input-stack { display: grid; gap: 28px; }
.input-card {
  min-height: 150px;
  border: 2px solid;
  border-radius: 12px;
  background: #eafbf7;
  padding: 16px 18px;
  position: relative;
}
.input-card h3 { margin: 0 0 10px; color: #008a7f; font-size: 16px; }
.input-card ul { margin: 0; padding-left: 18px; line-height: 1.45; color: #17433f; }
.input-card span {
  position: absolute;
  left: 16px;
  bottom: 10px;
  border: 1px solid #009b90;
  border-radius: 999px;
  padding: 3px 10px;
  background: white;
  color: #008a7f;
  font-size: 12px;
  font-weight: 900;
}
.merge-lane { height: 340px; }
.merge-lane svg { width: 100%; height: 100%; overflow: visible; }
.merge-lane path { fill: none; stroke-width: 2.4; stroke-dasharray: 8 8; }
.sheet-card {
  min-height: 86px;
  border: 2px solid;
  border-radius: 10px;
  background: #c8fbef;
  padding: 18px 16px;
  display: grid;
  align-content: center;
  gap: 6px;
}
.sheet-card strong { color: #008a7f; }
.sheet-card small { color: #315853; font-weight: 700; }
.bigquery {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  color: white;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 26px;
}
.bigquery strong { font-size: 16px; }
.bigquery span { font-size: 11px; font-weight: 700; }
.arrow-band { font-size: 34px; font-weight: 950; text-align: center; }
.data-list {
  min-height: 210px;
  border: 1px solid #d4e9e4;
  border-radius: 10px;
  background: #fbfffe;
  padding: 16px;
}
.data-list h3 { margin: 0 0 12px; font-size: 16px; }
.data-list p {
  margin: 0 0 8px;
  padding: 9px 10px;
  border-radius: 7px;
  background: #f1f8f6;
  color: #315651;
  font-weight: 800;
}
.bt5-flow {
  min-height: 520px;
  border: 1px solid #eed7d7;
  background: white;
  padding: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  overflow-x: auto;
}
.bt5-step-wrap { display: flex; align-items: center; gap: 18px; }
.bt5-step-wrap b { color: #e23737; font-size: 34px; }
.bt5-step {
  width: 230px;
  min-height: 138px;
  border: 2px solid #e23737;
  border-radius: 12px;
  background: #fff6f6;
  padding: 20px;
  display: grid;
  align-content: center;
  gap: 10px;
}
.bt5-step strong { color: #d12b2b; font-size: 18px; }
.bt5-step span { color: #6f3c3c; font-weight: 750; line-height: 1.45; }
@media (max-width: 980px) {
  .topbar { align-items: flex-start; flex-direction: column; }
  .overview-band { grid-template-columns: 1fr; min-height: auto; }
  .flow-grid { grid-template-columns: 1fr; }
  .merge-flow { grid-template-columns: 1fr; gap: 18px; }
  .merge-lane { display: none; }
  .bigquery { margin: 0 auto; }
  .arrow-band { transform: rotate(90deg); }
  .bt5-flow { justify-content: flex-start; }
}
`;
