import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface Standing {
  pos: number;
  team: string;
  played: number;
  w: number;
  d: number;
  l: number;
  gd: string;
  pts: number;
  form: string[];
  trend: string;
}

export interface StandingsTableProps {
  standings: Standing[];
}

function FormBadge({ result }: { result: string }) {
  const isWin = result === "W";
  const isDraw = result === "D";
  
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded uppercase text-[10px] font-bold font-condensed ${
        isWin
          ? "bg-[rgba(0,165,80,0.2)] text-[#00A550]"
          : isDraw
          ? "bg-[rgba(255,165,0,0.15)] text-[#FFA500]"
          : "bg-[rgba(255,59,48,0.15)] text-[#FF3B30]"
      }`}
    >
      {result}
    </span>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp size={12} color="#00A550" />;
  if (trend === "down") return <TrendingDown size={12} color="#FF3B30" />;
  return <Minus size={12} color="#6B8F77" />;
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="animate-fade-up delay-400 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-border)] flex justify-between items-center">
        <div className="font-condensed font-bold text-[14px] text-[#f1f5e8] tracking-[1px]">
          STANDINGS
        </div>
        <span className="text-[11px] text-[var(--color-green)] cursor-pointer font-condensed font-semibold hover:text-[var(--color-neon)] transition-colors">
          FULL TABLE →
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#1A1A1A]">
            {["#", "CLUB", "P", "W", "D", "L", "GD", "PTS", "FORM", ""].map(
              (h, i) => (
                <th
                  key={i}
                  className={`px-3 py-2.5 text-[10px] text-[#3A5244] font-condensed font-bold tracking-[1px] ${
                    i > 1 ? "text-center" : "text-left"
                  }`}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr
              key={i}
              className={`table-row-hover border-b border-[#111] ${
                s.pos <= 4
                  ? "border-l-4 border-l-[#006633]"
                  : s.pos === 5 || s.pos === 6
                  ? "border-l-4 border-l-[#6B3D00]"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              <td
                className={`p-3 text-[13px] font-bold font-mono text-left ${
                  s.pos === 1 ? "text-[var(--color-neon)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                {s.pos}
              </td>
              <td className="px-1.5 py-3 text-[13px] font-semibold text-[var(--color-text)] font-condensed">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-md bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[var(--color-border)] flex items-center justify-center text-[9px] font-bold text-[var(--color-text-muted)] font-condensed">
                    {s.team.slice(0, 2).toUpperCase()}
                  </div>
                  {s.team}
                </div>
              </td>
              {[s.played, s.w, s.d, s.l, s.gd].map((v, j) => (
                <td
                  key={j}
                  className={`px-1.5 py-3 text-center text-[12px] font-mono ${
                    j === 4
                      ? String(v).startsWith("+")
                        ? "text-[var(--color-green)]"
                        : "text-[#FF3B30]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {v}
                </td>
              ))}
              <td
                className={`px-1.5 py-3 text-center text-[14px] font-bold font-display tracking-[1px] ${
                  s.pos === 1 ? "text-[var(--color-neon)]" : "text-[var(--color-text)]"
                }`}
              >
                {s.pts}
              </td>
              <td className="px-2 py-3">
                <div className="flex gap-0.5 justify-center">
                  {s.form.map((f, j) => (
                    <FormBadge key={j} result={f} />
                  ))}
                </div>
              </td>
              <td className="p-3">
                <TrendIcon trend={s.trend} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
