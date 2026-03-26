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
  playerFaceUrl?: string;
  playerName?: string;
}

export function PlayerSlotButton({
  position,
  isGK = false,
  onClick,
  playerFaceUrl,
  playerName,
}: PlayerSlotButtonProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!playerFaceUrl && !imgError;

  return (
    <button
      onClick={() => onClick?.()}
      type="button"
      className={`kg-slot${isGK ? " kg-slot--gk" : ""}${showImage ? " kg-slot--filled" : ""}`}
      aria-label={`${isGK ? "Goalkeeper" : "Player"} slot: ${position}`}
    >
      {showImage ? (
        <>
          <img
            src={playerFaceUrl}
            alt={playerName ?? position}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
            }}
          />
          {/* Position badge */}
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,0.55)",
              fontSize: "7px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: isGK ? "#00ff66" : "rgba(255,255,255,0.85)",
              textAlign: "center",
              padding: "2px 0",
              backdropFilter: "blur(2px)",
            }}
          >
            {position}
          </span>
        </>
      ) : (
        <>
          <span
            className={`material-symbols-outlined kg-slot-icon${isGK ? " kg-slot-icon--gk" : ""}`}
          >
            add
          </span>
          <span className={`kg-slot-label${isGK ? " kg-slot-label--gk" : ""}`}>
            {position}
          </span>
        </>
      )}
    </button>
  );
}

// ── CreateDreamTeamButton ─────────────────────────────────────────────────────

interface CreateDreamTeamButtonProps {
  onClick: () => void;
  disabled?: boolean;
  filledSlots: number;
  totalSlots: number;
}

export function CreateDreamTeamButton({
  onClick,
  disabled = false,
  filledSlots,
  totalSlots,
}: CreateDreamTeamButtonProps) {
  const remaining = totalSlots - filledSlots;

  return (
    <>
      <style>{`
        .kg-create-btn {
          position: relative;
          width: 100%;
          padding: 14px 20px;
          border-radius: 8px;
          border: 1px solid rgba(0,255,102,0.4);
          background: rgba(0,255,102,0.06);
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00ff66;
          overflow: hidden;
          transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .kg-create-btn:not(:disabled):hover {
          background: rgba(0,255,102,0.12);
          border-color: rgba(0,255,102,0.7);
          box-shadow: 0 0 24px rgba(0,255,102,0.15), 0 0 0 1px rgba(0,255,102,0.1);
          transform: translateY(-1px);
        }
        .kg-create-btn:not(:disabled):active {
          transform: scale(0.98);
        }
        .kg-create-btn:disabled {
          cursor: not-allowed;
          border-color: rgba(71,72,69,0.2);
          background: rgba(36,39,35,0.4);
          color: rgba(255,255,255,0.2);
        }
        /* Shimmer on enabled */
        .kg-create-btn:not(:disabled)::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(0,255,102,0.08) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: kg-btn-shimmer 2.4s linear infinite;
        }
        @keyframes kg-btn-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .kg-create-icon {
          font-family: 'Material Symbols Outlined';
          font-size: 18px;
          line-height: 1;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .kg-create-hint {
          font-family: 'Oxanium', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          text-align: center;
          margin-top: 6px;
        }
      `}</style>

      <div>
        <button
          type="button"
          className="kg-create-btn"
          onClick={onClick}
          disabled={disabled}
          aria-disabled={disabled}
        >
          <span className="kg-create-icon">
            {disabled ? "lock" : "emoji_events"}
          </span>
          Create Dream Team
        </button>

        {disabled && remaining > 0 && (
          <p className="kg-create-hint">
            {remaining} more player{remaining !== 1 ? "s" : ""} needed
          </p>
        )}
      </div>
    </>
  );
}
