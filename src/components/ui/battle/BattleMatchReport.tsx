import React from "react";
import type { IMatchSimulationStats } from "@/features/main/battle/apis/battle";

interface BattleMatchReportProps {
  stats: IMatchSimulationStats;
  log: string[];
}

const STAT_ROWS: {
  key1: keyof IMatchSimulationStats;
  key2: keyof IMatchSimulationStats;
  label: string;
  format?: (v: number) => string;
}[] = [
  {
    key1: "possession1",
    key2: "possession2",
    label: "Possession",
    format: (v) => `${v}%`,
  },
  { key1: "shots1", key2: "shots2", label: "Shots" },
  {
    key1: "xg1",
    key2: "xg2",
    label: "Expected Goals (xG)",
    format: (v) => v.toFixed(2),
  },
];

export function BattleMatchReport({ stats, log }: BattleMatchReportProps) {
  return (
    <div className="w-full max-w-4xl bg-[#121212] border border-[#333] rounded-3xl p-8 flex flex-col gap-8">
      <h3 className="text-[#00ff66] font-[Bebas_Neue] text-2xl tracking-widest text-center uppercase">
        MATCH REPORT
      </h3>

      <div className="grid grid-cols-3 gap-4 text-center">
        {STAT_ROWS.map(({ key1, key2, label, format }) => (
          <React.Fragment key={key1}>
            <div className="text-[#aaaba7] font-bold">
              {format ? format(stats[key1] as number) : stats[key1]}
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#555]">
              {label}
            </div>
            <div className="text-[#aaaba7] font-bold">
              {format ? format(stats[key2] as number) : stats[key2]}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 max-h-60 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
        {log.map((entry, idx) => (
          <div
            key={idx}
            className="text-[11px] text-[#888] font-mono tracking-wider"
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
