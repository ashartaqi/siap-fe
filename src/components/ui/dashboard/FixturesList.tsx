import React from "react";
import { Clock } from "lucide-react";

export interface Fixture {
  home: string;
  away: string;
  time: string;
  date: string;
  status: string;
  score?: string;
  min?: string;
}

export interface FixturesListProps {
  fixtures: Fixture[];
}

export function FixturesList({ fixtures }: FixturesListProps) {
  return (
    <div className="animate-fade-up delay-300 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5.5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="font-condensed font-bold text-[14px] text-[var(--color-text)] tracking-[1px]">
          FIXTURES
        </div>
        <span className="text-[11px] text-[var(--color-green)] cursor-pointer font-condensed font-semibold hover:text-[var(--color-neon)] transition-colors">
          VIEW ALL →
        </span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        {fixtures.map((f, i) => (
          <div
            key={i}
            className={`card-hover bg-[#111111] rounded-lg p-3 ${
              f.status === "live"
                ? "border border-[rgba(255,59,48,0.3)]"
                : "border border-[var(--color-border)]"
            }`}
          >
            {f.status === "live" ? (
              <div className="flex items-center gap-1.25 mb-1.5">
                <div className="live-dot" />
                <span className="text-[10px] text-[#FF3B30] font-condensed font-bold tracking-[1px]">
                  LIVE · {f.min}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mb-1.5">
                <Clock size={10} color="#3A5244" />
                <span className="text-[10px] text-[#3A5244] font-condensed">
                  {f.date} · {f.time}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--color-text)] font-condensed flex-1">
                {f.home}
              </span>
              <span
                className={`px-2.5 font-bold ${
                  f.status === "live"
                    ? "text-[16px] font-display text-[var(--color-neon)] tracking-[2px]"
                    : "text-[12px] font-condensed text-[#3A5244] tracking-[1px]"
                }`}
              >
                {f.status === "live" ? f.score : "VS"}
              </span>
              <span className="text-[13px] font-semibold text-[var(--color-text)] font-condensed flex-1 text-right">
                {f.away}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
