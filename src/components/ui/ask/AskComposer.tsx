"use client";

import { ArrowUp } from "lucide-react";

interface AskComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function AskComposer({
  value,
  onChange,
  onSubmit,
  isPending,
}: AskComposerProps) {
  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-black)]/95 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-[var(--color-neon)]/60">
        <span className="font-[JetBrains_Mono,monospace] text-[var(--color-neon)]/60">
          &gt;
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Ask about a player, stat, or comparison…"
          className="flex-1 bg-transparent py-2.5 text-[14px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]/70"
        />
        <button
          onClick={onSubmit}
          disabled={isPending || !value.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-neon)] text-[var(--color-black)] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
