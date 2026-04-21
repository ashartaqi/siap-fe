"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ALL_POSITIONS } from "@/lib/constants";

interface Props {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  /** Positions list from the backend (via useGetPlayerAttributes). Falls back to ALL_POSITIONS. */
  positions?: string[];
}

export function PositionPicker({
  value,
  onChange,
  readOnly = false,
  positions,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const positionList =
    positions && positions.length > 0 ? positions : ALL_POSITIONS;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !readOnly && setOpen((o) => !o)}
        className={[
          "flex items-center gap-0.5 font-[Oxanium,sans-serif] text-[10px] font-bold tracking-widest uppercase mt-0.5 text-[#00fe66] transition-colors",
          readOnly ? "cursor-default" : "cursor-pointer hover:text-white",
        ].join(" ")}
      >
        {value}
        {!readOnly && <ChevronDown className="w-2.5 h-2.5 opacity-60" />}
      </button>
      {open && !readOnly && (
        <div className="absolute bottom-full mb-1 left-0 z-50 bg-[rgba(18,20,17,0.97)] border border-[rgba(0,255,102,0.2)] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-28">
          <div className="grid grid-cols-3 gap-px p-1 max-h-40 overflow-y-auto">
            {positionList.map((pos) => (
              <button
                key={pos}
                onClick={() => {
                  onChange(pos);
                  setOpen(false);
                }}
                className={[
                  "text-[9px] font-bold tracking-wider uppercase py-1 rounded-[3px] transition-colors cursor-pointer",
                  value === pos
                    ? "bg-[rgba(0,255,102,0.15)] text-[#00ff66]"
                    : "text-white/40 hover:text-[#fcfcf8] hover:bg-white/5",
                ].join(" ")}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
