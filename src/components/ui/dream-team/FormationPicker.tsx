"use client";

import { FORMATIONS } from "@/lib/constants";

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

export function FormationPicker({ activeId, onSelect }: Props) {
  return (
    <div className="bg-[#121411] p-[14px] rounded-xl border border-[rgba(71,72,69,0.12)]">
      <h3 className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#00ff66] mb-[10px]">
        Select Formation
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {FORMATIONS.map((f) => {
          const isActive = f.id === activeId;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              aria-pressed={isActive}
              className={[
                "flex flex-col items-center gap-[3px] px-3 py-[10px] rounded-[4px] border font-[Oxanium,sans-serif] cursor-pointer transition-[background,border-color,transform] duration-200",
                isActive
                  ? "bg-[#242723] border-[rgba(0,255,102,0.45)] shadow-[0_0_12px_rgba(0,255,102,0.1)]"
                  : "bg-[#1e201d] border-transparent hover:bg-[#242723] hover:-translate-y-px",
              ].join(" ")}
            >
              <span
                className={[
                  "font-[Bebas_Neue,sans-serif] text-[19px] tracking-[0.04em] transition-colors duration-200",
                  isActive ? "text-[#00ff66]" : "text-white/40",
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
