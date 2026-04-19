"use client";

export function PositionBadge({ pos, qual }: { pos: number; qual: string }) {
  const base =
    "inline-flex items-center justify-center w-[22px] h-[22px] rounded-[5px] text-[0.72rem] font-bold font-mono";

  if (qual === "champions")
    return (
      <span
        className={`${base} bg-[rgba(59,130,246,0.18)] text-[#93c5fd] border border-[rgba(59,130,246,0.35)]`}
      >
        {pos}
      </span>
    );
  if (qual === "europa")
    return (
      <span
        className={`${base} bg-[rgba(245,158,11,0.15)] text-[#fcd34d] border border-[rgba(245,158,11,0.3)]`}
      >
        {pos}
      </span>
    );
  if (qual === "conference")
    return (
      <span
        className={`${base} bg-[rgba(16,185,129,0.15)] text-[#2ad432] border border-[rgba(16,185,129,0.3)]`}
      >
        {pos}
      </span>
    );
  if (qual === "relegation")
    return (
      <span
        className={`${base} bg-[rgba(239,68,68,0.15)] text-[#fca5a5] border border-[rgba(239,68,68,0.3)]`}
      >
        {pos}
      </span>
    );
  return <span className={`${base} text-[#6b6b78]`}>{pos}</span>;
}
