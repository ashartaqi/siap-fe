"use client";

import React, { useState } from "react";

export interface Formation {
  id: string;
  label: string;
  description: string;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  squadRating: number;
  tacticalFit: string;
  rows: string[][];
}

// ── Button ────────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`w-full bg-[var(--auth-green)] text-[var(--auth-black)] border-none rounded-md font-outfit font-extrabold text-[16px] tracking-[3px] uppercase p-4 cursor-pointer relative overflow-hidden transition-all duration-200 hover:bg-[var(--auth-green-dim)] active:scale-[0.98] group/btn animate-[fadeUp_0.6s_0.35s_ease_both] ${className}`}
      {...rest}
    >
      <span className="relative z-10 block">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-500 group-hover/btn:translate-x-full" />
    </button>
  );
}

// ── FormationButtons ──────────────────────────────────────────────────────────

interface FormationButtonsProps {
  formations: Formation[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export function FormationButtons({
  formations,
  activeId,
  setActiveId,
}: FormationButtonsProps) {
  return (
    <div className="kg-formation-grid">
      {formations.map((f) => (
        <button
          key={f.id}
          onClick={() => setActiveId(f.id)}
          className={`kg-formation-btn${f.id === activeId ? " kg-formation-btn--active" : ""}`}
          aria-pressed={f.id === activeId}
          type="button"
        >
          <span className="kg-formation-label">{f.label}</span>
          <span className="kg-formation-desc">{f.description}</span>
        </button>
      ))}
    </div>
  );
}

// ── PlayerSlotButton ──────────────────────────────────────────────────────────

interface PlayerSlotButtonProps {
  position: string;
  isGK?: boolean;
  onClick?: () => void;
}

export function PlayerSlotButton({
  position,
  isGK = false,
  onClick,
}: PlayerSlotButtonProps) {
  return (
    <button
      onClick={(e) => {
        console.log("slot clicked: ", position);
        onClick?.();
      }}
      type="button"
      className={`kg-slot${isGK ? " kg-slot--gk" : ""}`}
      aria-label={`${isGK ? "Goalkeeper" : "Player"} slot: ${position}`}
    >
      <span
        className={`material-symbols-outlined kg-slot-icon${isGK ? " kg-slot-icon--gk" : ""}`}
      >
        add
      </span>
      <span className={`kg-slot-label${isGK ? " kg-slot-label--gk" : ""}`}>
        {position}
      </span>
    </button>
  );
}

// ── Pitch (internal) ──────────────────────────────────────────────────────────

function PitchRow({ positions }: { positions: string[] }) {
  const handleSlotClick = (pos: string) => {
    console.log(`Clicked slot: ${pos}`); // replace with your logic
  };

  if (positions.length <= 3) {
    return (
      <div className="kg-pitch-row kg-pitch-row--center">
        {positions.map((pos, i) => (
          <PlayerSlotButton
            key={i}
            position={pos}
            onClick={() => handleSlotClick(pos)}
          />
        ))}
      </div>
    );
  }

  const [left, ...rest] = positions;
  const right = rest[rest.length - 1];
  const inner = rest.slice(0, -1);

  return (
    <div className="kg-pitch-row kg-pitch-row--spread">
      <PlayerSlotButton position={left} onClick={() => handleSlotClick(left)} />
      <div className="kg-pitch-inner-row">
        {inner.map((pos, i) => (
          <PlayerSlotButton
            key={i}
            position={pos}
            onClick={() => handleSlotClick(pos)}
          />
        ))}
      </div>
      <PlayerSlotButton
        position={right}
        onClick={() => handleSlotClick(right)}
      />
    </div>
  );
}

function Pitch({ formation }: { formation: Formation }) {
  return (
    <section className="kg-pitch-wrap">
      <div className="kg-pitch">
        {/* Static pitch markings */}
        <div className="kg-pitch-border" />
        <div className="kg-pitch-penalty-top" />
        <div className="kg-pitch-penalty-bottom" />
        <div className="kg-pitch-box-top" />
        <div className="kg-pitch-box-bottom" />
        <div className="kg-pitch-halfway" />
        <div className="kg-pitch-circle" />

        {/* Dynamic player rows — row count matches current formation */}
        <div
          className="kg-pitch-grid"
          style={{ gridTemplateRows: `repeat(${formation.rows.length}, 1fr)` }}
        >
          {formation.rows.map((row, i) => (
            <PitchRow key={`${formation.id}-${i}`} positions={row} />
          ))}
        </div>

        {/* GK always pinned at the bottom */}
        <div className="kg-pitch-gk">
          <PlayerSlotButton position="GK" isGK />
        </div>

        {/* HUD overlay */}
        <div className="kg-pitch-hud">
          <div className="kg-hud-formation">{formation.label}</div>
        </div>
      </div>
    </section>
  );
}

// ── FormationController ───────────────────────────────────────────────────────

interface FormationControllerProps {
  formations: Formation[];
}

export function FormationController({ formations }: FormationControllerProps) {
  const [activeId, setActiveId] = useState(formations[0].id);
  const active = formations.find((f) => f.id === activeId)!;

  const statBars = [
    { label: "Attack Rating", value: active.attackRating },
    { label: "Midfield Rating", value: active.midfieldRating },
    { label: "Defense Rating", value: active.defenseRating },
  ];

  return (
    <>
      {/* ── 1. Formation selector ── */}
      <div className="kg-panel">
        <h3 className="kg-panel-title">Select Formation</h3>
        <FormationButtons
          formations={formations}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </div>

      {/* ── 2. Formation analysis ── */}
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

      {/* ── 3. Pitch ── */}
      <Pitch key={activeId} formation={active} />
    </>
  );
}
