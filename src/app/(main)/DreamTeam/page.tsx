"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Formation = {
  id: string;
  label: string;
  description: string;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  squadRating: number;
  tacticalFit: string;
  rows: string[][];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FORMATIONS: Formation[] = [
  {
    id: "4-4-2",
    label: "4-4-2",
    description: "Classic Balance",
    attackRating: 82,
    midfieldRating: 64,
    defenseRating: 91,
    squadRating: 174.5,
    tacticalFit: "A+",
    rows: [
      ["ST", "ST"],
      ["LM", "CM", "CM", "RM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "4-3-3",
    label: "4-3-3",
    description: "Offensive Width",
    attackRating: 94,
    midfieldRating: 72,
    defenseRating: 61,
    squadRating: 168.0,
    tacticalFit: "A",
    rows: [
      ["LW", "ST", "RW"],
      ["CM", "CM", "CM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "3-4-3",
    label: "3-4-3",
    description: "Midfield Control",
    attackRating: 88,
    midfieldRating: 91,
    defenseRating: 55,
    squadRating: 161.0,
    tacticalFit: "B+",
    rows: [
      ["LW", "ST", "RW"],
      ["LM", "CM", "CM", "RM"],
      ["CB", "CB", "CB"],
    ],
  },
  {
    id: "4-2-2-2",
    label: "4-2-2-2",
    description: "Tactical Pivot",
    attackRating: 79,
    midfieldRating: 88,
    defenseRating: 84,
    squadRating: 171.0,
    tacticalFit: "A-",
    rows: [
      ["ST", "ST"],
      ["AM", "AM"],
      ["DM", "DM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
];

// ─── Pitch helpers ────────────────────────────────────────────────────────────

function PitchSlot({
  position,
  isGK = false,
}: {
  position: string;
  isGK?: boolean;
}) {
  return (
    <div className={`kg-slot${isGK ? " kg-slot--gk" : ""}`}>
      <span
        className={`material-symbols-outlined kg-slot-icon${isGK ? " kg-slot-icon--gk" : ""}`}
      >
        add
      </span>
      <span className={`kg-slot-label${isGK ? " kg-slot-label--gk" : ""}`}>
        {position}
      </span>
    </div>
  );
}

function PitchRow({ positions }: { positions: string[] }) {
  if (positions.length <= 3) {
    return (
      <div className="kg-pitch-row kg-pitch-row--center">
        {positions.map((pos, i) => (
          <PitchSlot key={i} position={pos} />
        ))}
      </div>
    );
  }
  const [left, ...rest] = positions;
  const right = rest[rest.length - 1];
  const inner = rest.slice(0, -1);
  return (
    <div className="kg-pitch-row kg-pitch-row--spread">
      <PitchSlot position={left} />
      <div className="kg-pitch-inner-row">
        {inner.map((pos, i) => (
          <PitchSlot key={i} position={pos} />
        ))}
      </div>
      <PitchSlot position={right} />
    </div>
  );
}

function Pitch({ formation }: { formation: Formation }) {
  return (
    <section className="kg-pitch-wrap">
      <div className="kg-pitch">
        <div className="kg-pitch-border" />
        <div className="kg-pitch-penalty-top" />
        <div className="kg-pitch-penalty-bottom" />
        <div className="kg-pitch-box-top" />
        <div className="kg-pitch-box-bottom" />
        <div className="kg-pitch-halfway" />
        <div className="kg-pitch-circle" />
        <div
          className="kg-pitch-grid"
          style={{ gridTemplateRows: `repeat(${formation.rows.length}, 1fr)` }}
        >
          {formation.rows.map((row, i) => (
            <PitchRow key={`${formation.id}-${i}`} positions={row} />
          ))}
        </div>
        <div className="kg-pitch-gk">
          <PitchSlot position="GK" isGK />
        </div>
        <div className="kg-pitch-hud">
          <div className="kg-hud-formation">{formation.label}</div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DreamTeamPage() {
  const [activeId, setActiveId] = useState<string>("4-4-2");
  const active = FORMATIONS.find((f) => f.id === activeId)!;

  const statBars = [
    { label: "Attack Rating", value: active.attackRating },
    { label: "Midfield Rating", value: active.midfieldRating },
    { label: "Defense Rating", value: active.defenseRating },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oxanium:wght@300;400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .material-symbols-outlined {
          font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;
          font-family:'Material Symbols Outlined';
          font-style:normal;display:inline-block;line-height:1;white-space:nowrap;
        }

        /* Scoped CSS variables on the wrapper so they don't bleed into MainLayout */
        .kg-wrap {
          --surface:#121411; --surface-hi:#1e201d; --surface-max:#242723;
          --green:#00ff66; --green-dim:rgba(0,255,102,0.08);
          --green-glow:rgba(0,255,102,0.35); --pitch-line:rgba(0,255,102,0.15);
          --text:#fcfcf8; --fd:'Bebas Neue',sans-serif; --fb:'Oxanium',sans-serif;
          font-family: var(--fb);
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          height: 100%;
        }
        @media(min-width:1024px){ .kg-wrap { flex-direction: row; align-items: flex-start; } }

        .kg-page-title{font-family:var(--fd);font-size:42px;letter-spacing:-.01em;line-height:.92;color:var(--text);text-transform:uppercase}
        .kg-page-subtitle{font-size:12px;color:#aaaba7;line-height:1.4;margin-top:5px;max-width:280px}

        .kg-left{display:flex;flex-direction:column;gap:12px}
        @media(min-width:1024px){.kg-left{width:33.333%;flex-shrink:0}}

        .kg-panel{background:var(--surface);padding:14px;border-radius:12px;border:1px solid rgba(71,72,69,.12)}
        .kg-panel-title{font-family:var(--fb);font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--green);margin-bottom:10px}

        .kg-formation-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .kg-formation-btn{
          display:flex;flex-direction:column;align-items:center;gap:3px;
          padding:10px 12px;border-radius:4px;background:var(--surface-hi);
          border:1px solid transparent;transition:background .2s,border-color .2s,transform .15s;
          cursor:pointer;font-family:inherit;color:inherit;
        }
        .kg-formation-btn:hover{background:var(--surface-max);transform:translateY(-1px)}
        .kg-formation-btn:active{transform:scale(.97)}
        .kg-formation-btn--active{background:var(--surface-max);border-color:rgba(0,255,102,.45);box-shadow:0 0 12px rgba(0,255,102,.1)}
        .kg-formation-label{font-family:var(--fd);font-size:19px;letter-spacing:.04em;color:rgba(255,255,255,.42);transition:color .2s}
        .kg-formation-btn--active .kg-formation-label{color:var(--green)}
        .kg-formation-desc{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.28)}

        .kg-stat-bars{display:flex;flex-direction:column;gap:8px}
        .kg-stat-bar-header{display:flex;justify-content:space-between;margin-bottom:4px;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
        .kg-stat-bar-label{color:rgba(255,255,255,.38)}
        .kg-stat-bar-value{color:var(--green)}
        .kg-stat-bar-track{height:3px;background:var(--surface-max);border-radius:2px;overflow:hidden}
        .kg-stat-bar-fill{height:100%;background:var(--green);border-radius:2px;transition:width 0.55s cubic-bezier(0.4,0,0.2,1);}
        .kg-analysis-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid rgba(71,72,69,.12)}
        .kg-score{display:block;font-family:var(--fd);font-size:26px;color:var(--text);line-height:1}
        .kg-grade{display:block;font-family:var(--fd);font-size:26px;color:var(--green);line-height:1}
        .kg-score-label{display:block;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:3px}
        .kg-analysis-footer-right{text-align:right}

        .kg-pitch-wrap{flex:1;min-width:0}
        .kg-pitch{
          position:relative;width:100%;aspect-ratio:3/4;
          background:radial-gradient(circle at center,#181a17 0%,#0d0f0c 100%);
          border-radius:16px;overflow:hidden;
          border:1px solid rgba(0,255,102,.06);
          box-shadow:0 24px 64px rgba(0,0,0,.6);
        }
        .kg-pitch-border{position:absolute;inset:16px;border:1px solid var(--pitch-line)}
        .kg-pitch-penalty-top{position:absolute;left:16px;right:16px;top:16px;height:25%;border-bottom:1px solid var(--pitch-line)}
        .kg-pitch-penalty-bottom{position:absolute;left:16px;right:16px;bottom:16px;height:25%;border-top:1px solid var(--pitch-line)}
        .kg-pitch-box-top{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:33%;height:16.666%;border-left:1px solid var(--pitch-line);border-right:1px solid var(--pitch-line);border-bottom:1px solid var(--pitch-line)}
        .kg-pitch-box-bottom{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);width:33%;height:16.666%;border-left:1px solid var(--pitch-line);border-right:1px solid var(--pitch-line);border-top:1px solid var(--pitch-line)}
        .kg-pitch-halfway{position:absolute;top:50%;left:16px;right:16px;height:1px;background:var(--pitch-line);transform:translateY(-50%)}
        .kg-pitch-circle{position:absolute;top:50%;left:50%;width:100px;height:100px;border-radius:50%;border:1px solid var(--pitch-line);transform:translate(-50%,-50%)}
        .kg-pitch-grid{position:absolute;inset:0;display:grid;padding:36px 20px 80px;gap:6px}
        .kg-pitch-row{display:flex;align-items:center}
        .kg-pitch-row--center{justify-content:center;gap:32px}
        .kg-pitch-row--spread{justify-content:space-between;padding:0 6px}
        .kg-pitch-inner-row{display:flex;gap:24px}
        @media(min-width:768px){.kg-pitch-row--center{gap:56px}.kg-pitch-inner-row{gap:40px}}
        .kg-pitch-gk{position:absolute;bottom:12px;left:50%;transform:translateX(-50%)}

        .kg-slot{
          width:46px;height:58px;background:var(--surface-max);
          border:1px solid rgba(0,255,102,.2);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
          cursor:pointer;flex-shrink:0;
          transition:border-color .2s,background .2s,transform .2s;
          animation:slot-in 0.3s ease both;
        }
        @keyframes slot-in{from{opacity:0;transform:scale(.82) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .kg-slot:hover{border-color:var(--green);background:rgba(0,255,102,.05);transform:translateY(-2px)}
        @media(min-width:768px){.kg-slot{width:60px;height:74px}}
        .kg-slot--gk{border-style:dashed;border-color:var(--green)}
        .kg-slot--gk:hover{background:rgba(0,255,102,.07)}
        .kg-slot-icon{font-size:16px;color:rgba(0,255,102,.35);transition:color .2s}
        .kg-slot:hover .kg-slot-icon,.kg-slot-icon--gk{color:var(--green)}
        .kg-slot-label{font-size:7px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.3)}
        .kg-slot-label--gk{color:var(--green)}

        .kg-pitch-hud{position:absolute;top:16px;right:16px;text-align:right}
        .kg-hud-formation{font-family:var(--fd);font-size:40px;color:rgba(0,255,102,.07);line-height:1}
        .kg-hud-label{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--green)}
        .kg-hud-fps{font-family:var(--fd);font-size:28px;color:var(--text);line-height:1}
      `}</style>

      <div className="kg-wrap">
        {/* ── Left column ── */}
        <div className="kg-left">
          <div>
            <h1 className="kg-page-title">DREAM TEAM</h1>
            <p className="kg-page-subtitle">
              Assemble your ideal team and rise to the top.
            </p>
          </div>

          {/* Formation picker */}
          <div className="kg-panel">
            <h3 className="kg-panel-title">Select Formation</h3>
            <div className="kg-formation-grid">
              {FORMATIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  className={`kg-formation-btn${f.id === activeId ? " kg-formation-btn--active" : ""}`}
                  aria-pressed={f.id === activeId}
                >
                  <span className="kg-formation-label">{f.label}</span>
                  <span className="kg-formation-desc">{f.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div className="kg-panel">
            <h3 className="kg-panel-title">Formation Analysis</h3>
            <div className="kg-stat-bars">
              {statBars.map((bar) => (
                <div key={bar.label} className="kg-stat-bar">
                  <div className="kg-stat-bar-header">
                    <span className="kg-stat-bar-label">{bar.label}</span>
                    <span className="kg-stat-bar-value">{bar.value}%</span>
                  </div>
                  <div className="kg-stat-bar-track">
                    <div
                      className="kg-stat-bar-fill"
                      style={{ width: `${bar.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="kg-analysis-footer">
              <div>
                <span className="kg-score">{active.squadRating}</span>
                <span className="kg-score-label">Squad Rating</span>
              </div>
              <div className="kg-analysis-footer-right">
                <span className="kg-grade">{active.tacticalFit}</span>
                <span className="kg-score-label">Tactical Fit</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pitch — sibling of .kg-left, takes flex:1 on desktop ── */}
        <Pitch key={activeId} formation={active} />
      </div>
    </>
  );
}
