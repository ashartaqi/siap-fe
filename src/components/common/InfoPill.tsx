interface InfoPillProps {
  label: string;
  value: string | number;
}

export function InfoPill({ label, value }: InfoPillProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.25)] rounded-lg px-3 py-2 gap-0.5">
      <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[rgba(255,255,255,0.35)]">
        {label}
      </span>
      <span className="text-[12px] font-semibold text-[#fcfcf8] text-center">
        {value}
      </span>
    </div>
  );
}
