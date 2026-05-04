interface InfoPillProps {
  label: string;
  value: string | number;
  theme?: "green" | "blue";
}

export function InfoPill({ label, value, theme = "green" }: InfoPillProps) {
  const isBlue = theme === "blue";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 gap-0.5 border ${
        isBlue
          ? "bg-[rgba(10,25,70,0.8)] border-[rgba(100,160,255,0.2)]"
          : "bg-[rgba(36,39,35,0.8)] border-[rgba(71,72,69,0.25)]"
      }`}
    >
      <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[rgba(255,255,255,0.35)]">
        {label}
      </span>
      <span className="text-[12px] font-semibold text-[#fcfcf8] text-center">
        {value}
      </span>
    </div>
  );
}
