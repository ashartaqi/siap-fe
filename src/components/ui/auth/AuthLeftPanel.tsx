import React from "react";

interface AuthLeftPanelProps {
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}

export function AuthLeftPanel({ label, title, children }: AuthLeftPanelProps) {
  return (
    <div className="hidden md:flex flex-col justify-center px-16 py-14 border-r border-[var(--auth-border)] relative overflow-hidden group">
      {/* Right green gradient border effect */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--auth-green)] to-transparent opacity-40"></div>

      {/* Brand */}
      <div className="flex items-center gap-3.5 mb-14 animate-[fadeUp_0.6s_ease_both]">
        <div className="w-11 h-11 bg-[var(--auth-green)] flex items-center justify-center shrink-0 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px] fill-[var(--auth-black)]"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="font-outfit font-black text-2xl tracking-[4px] text-[var(--auth-text)] uppercase">
          SI<span className="text-[var(--auth-green)]">A</span>P
        </div>
      </div>

      {/* Hero Label */}
      <div className="font-outfit font-semibold text-[11px] tracking-[4px] uppercase text-[var(--auth-green)] mb-4 animate-[fadeUp_0.6s_0.1s_ease_both]">
        {label}
      </div>

      {/* Hero Title */}
      <h1 className="font-outfit font-black text-[clamp(40px,5vw,72px)] leading-[0.92] uppercase text-[var(--auth-text)] mb-7 animate-[fadeUp_0.6s_0.2s_ease_both]">
        {title}
      </h1>

      {/* Children (Stats or Perks) */}
      <div className="animate-[fadeUp_0.6s_0.3s_ease_both]">{children}</div>
    </div>
  );
}
