import React from "react";

export interface Scorer {
  name: string;
  team: string;
  goals: number;
  assists: number;
  img: string;
}

export interface TopScorersProps {
  topScorers: Scorer[];
}

export function TopScorers({ topScorers }: TopScorersProps) {
  const maxGoals = topScorers.length > 0 ? topScorers[0].goals : 1;

  return (
    <div className="animate-fade-up delay-500 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="px-5.5 py-5 border-b border-[var(--color-border)] flex justify-between items-center">
        <div className="font-condensed font-bold text-[14px] text-[#f1f5e8] tracking-[1px]">
          TOP SCORERS
        </div>
        <span className="text-[11px] text-[var(--color-green)] cursor-pointer font-condensed font-semibold hover:text-[var(--color-neon)] transition-colors">
          ALL →
        </span>
      </div>
      <div className="py-3">
        {topScorers.map((p, i) => (
          <div
            key={i}
            className={`table-row-hover flex items-center gap-3 px-5.5 py-2.5 cursor-pointer ${
              i < topScorers.length - 1 ? "border-b border-[#111]" : "border-none"
            }`}
          >
            <span
              className={`w-5 text-center text-[13px] font-bold font-mono ${
                i === 0 ? "text-[var(--color-neon)]" : "text-[#3A5244]"
              }`}
            >
              {i + 1}
            </span>
            <div
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[12px] font-bold text-[var(--color-text)] font-condensed transition-all ${
                i === 0
                  ? "border-[var(--color-neon)]"
                  : "border-[var(--color-border)]"
              }`}
              style={{
                background: `linear-gradient(135deg, ${
                  ["#003D1F", "#1A0033", "#001F3D", "#1A0D00", "#001A33"][i]
                }, ${
                  ["#006633", "#4B0082", "#003D7A", "#663300", "#003D66"][i]
                })`,
              }}
            >
              {p.img}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--color-text)] font-condensed">
                {p.name}
              </div>
              <div className="text-[11px] text-[#3A5244] font-condensed">
                {p.team}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-[18px] font-bold font-display tracking-[1px] ${
                  i === 0 ? "text-[var(--color-neon)]" : "text-[var(--color-text)]"
                }`}
              >
                {p.goals}
              </div>
              <div className="text-[10px] text-[#3A5244] font-condensed">
                {p.assists} ast
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Bar chart for goals */}
      <div className="px-5.5 pb-4 pt-3 border-t border-[#111]">
        {topScorers.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] text-[#3A5244] font-condensed w-15 text-ellipsis overflow-hidden whitespace-nowrap">
              {p.name.split(" ")[1] || p.name}
            </span>
            <div className="flex-1 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(p.goals / maxGoals) * 100}%`,
                  background:
                    i === 0
                      ? "linear-gradient(90deg, #006633, #00FF7F)"
                      : "linear-gradient(90deg, #003D1F, #006633)",
                }}
              />
            </div>
            <span
              className={`text-[11px] font-mono w-6 text-right font-semibold ${
                i === 0 ? "text-[var(--color-neon)]" : "text-[var(--color-text-muted)]"
              }`}
            >
              {p.goals}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
