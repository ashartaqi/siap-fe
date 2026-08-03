import React from "react";

// Turns **bold** segments into stat chips when they lead with a number
// (e.g. "**34.1 km/h top speed**" -> chip), otherwise plain emphasis.
// This is the signature "stat chip" element from the Ask SIAP design brief —
// themed via var(--color-neon)/var(--color-border) so it follows whatever
// page theme is registered for /ask in lib/themes.ts.
export function formatAnswer(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.+?\*\*)/g);

  return parts.map((part, i) => {
    const match = part.match(/^\*\*(.+?)\*\*$/);
    if (!match) return <React.Fragment key={i}>{part}</React.Fragment>;

    const inner = match[1];
    const numMatch = inner.match(/^([\d.]+%?(?:\/[\d.]+)?)\s*(.*)$/);

    if (numMatch && numMatch[1]) {
      const [, num, label] = numMatch;
      return (
        <span
          key={i}
          className="inline-flex items-baseline gap-1.5 rounded-[3px] border border-[var(--color-neon)]/35 bg-[var(--color-neon)]/10 px-1.5 py-0.5 mx-0.5"
        >
          <span className="font-[JetBrains_Mono,monospace] font-semibold text-[13px] text-[var(--color-neon)]">
            {num}
          </span>
          {label && (
            <span className="font-[JetBrains_Mono,monospace] text-[9.5px] uppercase tracking-wide text-[var(--color-text-muted)]">
              {label}
            </span>
          )}
        </span>
      );
    }

    return (
      <strong key={i} className="font-semibold text-[var(--color-neon)]">
        {inner}
      </strong>
    );
  });
}
