"use client";

import { IFormation } from "@/features/main/football";

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
  formations: IFormation[];
}

export function FormationPicker({ activeId, onSelect, formations }: Props) {
  return (
    <div className="bg-[var(--color-surface)] p-[14px] rounded-xl border border-[var(--color-border)]">
      <h3 className="text-[10px] font-bold tracking-[0.24em] uppercase text-[var(--color-neon)] mb-[10px]">
        Select Formation
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {formations.map((f) => {
          const isActive = f.id === activeId;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              aria-pressed={isActive}
              className={[
                "flex flex-col items-center gap-[3px] px-3 py-[10px] rounded-[4px] border font-[Oxanium,sans-serif] cursor-pointer transition-[background,border-color,transform] duration-200",
                isActive
                  ? "bg-white/5 border-[var(--color-neon)]/45 shadow-[0_0_12px_rgba(var(--color-neon-rgb),0.1)]"
                  : "bg-white/5 border-transparent hover:bg-white/10 hover:-translate-y-px",
              ].join(" ")}
            >
              <span
                className={[
                  "font-[Bebas_Neue,sans-serif] text-[19px] tracking-[0.04em] transition-colors duration-200",
                  isActive ? "text-[var(--color-neon)]" : "text-white/40",
                ].join(" ")}
              >
                {f.label}
              </span>
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-white/30">
                {f.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
