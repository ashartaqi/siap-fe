"use client";

interface Props {
  label: string;
  value: number | null;
  filled: boolean;
}

export function RatingBar({ label, value, filled }: Props) {
  const display = value !== null ? Math.round(value) : "–";
  const pct = value !== null ? Math.min(value, 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
        <span className="text-white/40">{label}</span>
        <span className={filled ? "text-[var(--color-neon)]" : "text-white/20"}>
          {display}
        </span>
      </div>
      <div className="h-[3px] bg-white/5 rounded-[2px] overflow-hidden">
        <div
          className={[
            "h-full rounded-[2px] transition-[width] duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            filled ? "bg-[var(--color-neon)]" : "bg-white/6",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
