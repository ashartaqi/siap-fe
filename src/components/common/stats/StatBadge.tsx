interface StatBadgeProps {
  label: string;
  value?: number;
}

export function StatBadge({ label, value }: StatBadgeProps) {
  const pct = value ?? 0;
  const color =
    pct >= 80
      ? "text-[var(--color-neon)] border-[var(--color-neon)]/25"
      : pct >= 65
        ? "text-[#ffd700] border-[rgba(255,215,0,0.2)]"
        : "text-[rgba(255,80,80,0.85)] border-[rgba(255,80,80,0.2)]";

  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-md px-1.5 py-1 min-w-[38px] ${color}`}
    >
      <span className="text-[14px] font-[Bebas_Neue,sans-serif] leading-none">
        {value ?? "—"}
      </span>
      <span className="text-[7px] font-bold tracking-[0.15em] uppercase mt-0.5 opacity-60">
        {label}
      </span>
    </div>
  );
}
