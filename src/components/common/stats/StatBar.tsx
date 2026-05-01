interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

export function StatBar({ label, value, max = 99 }: StatBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor =
    value >= 80
      ? "bg-[#00ff66]"
      : value >= 65
        ? "bg-[#ffd700]"
        : "bg-[rgba(255,80,80,0.85)]";
  const textColor =
    value >= 80
      ? "text-[#00ff66]"
      : value >= 65
        ? "text-[#ffd700]"
        : "text-[rgba(255,80,80,0.85)]";

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[rgba(255,255,255,0.4)] w-[28px] shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[4px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`text-[13px] font-[Bebas_Neue,sans-serif] leading-none w-[26px] text-right ${textColor}`}
      >
        {value}
      </span>
    </div>
  );
}
