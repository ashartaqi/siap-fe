import React from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  delta?: string | null;
  up?: boolean;
  live?: boolean;
  index: number;
}

export function StatCard({ label, value, sub, delta, up, live, index }: StatCardProps) {
  return (
    <div
      className="card-hover animate-fade-up bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-5 px-5.5 delay-[calc(var(--index)*80ms)]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[11px] text-[#3A5244] font-condensed tracking-[1px] uppercase font-semibold">
            {label}
          </div>
          <div className="font-display text-[40px] text-[var(--color-text)] tracking-[2px] leading-[1.1] mt-1">
            {value}
          </div>
          <div className="text-[11px] text-[#3A5244] font-condensed mt-1">
            {sub}
          </div>
        </div>
        <div className="text-right">
          {live ? (
            <div className="flex items-center gap-1.25 justify-end">
              <div className="live-dot" />
              <span className="text-[10px] text-[#FF3B30] font-condensed font-bold tracking-[1px]">
                LIVE
              </span>
            </div>
          ) : delta ? (
            <span
              className={`text-xs font-semibold font-condensed px-2 py-0.5 rounded-md ${
                up
                  ? "text-[var(--color-green)] bg-[rgba(0,165,80,0.1)]"
                  : "text-[#FF3B30] bg-[rgba(255,59,48,0.1)]"
              }`}
            >
              {delta}
            </span>
          ) : null}
        </div>
      </div>
      <div className="stat-bar mt-4">
        <div
          className="stat-bar-fill"
          style={{ width: `${60 + index * 8}%` }}
        />
      </div>
    </div>
  );
}
