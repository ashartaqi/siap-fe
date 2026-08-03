"use client";

import { useState } from "react";
import { AskResponse } from "@/features/main/ask";
import { formatAnswer } from "./formatAnswer";

export function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-end self-end max-w-[88%]">
      <div className="rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md bg-[var(--color-neon)] px-4 py-3 text-[14px] font-semibold text-[var(--color-black)]">
        {text}
      </div>
    </div>
  );
}

export function BotBubble({ answer, sources, degraded }: AskResponse) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div className="flex flex-col items-start self-start max-w-[88%]">
      <div className="mb-1.5 px-1 font-[JetBrains_Mono,monospace] text-[9.5px] uppercase tracking-widest text-[var(--color-text-muted)]">
        SIAP
      </div>

      <div className="rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[14px] leading-relaxed text-[var(--color-text)]">
        {formatAnswer(answer)}
      </div>

      {degraded && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-[3px] border border-orange-400/40 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] uppercase tracking-wide text-orange-400">
          <span>⚠</span>
          Degraded — broader fallback search used
        </div>
      )}

      {sources.length > 0 && (
        <>
          <button
            onClick={() => setSourcesOpen((o) => !o)}
            className="mt-2 px-1 font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] underline underline-offset-4 hover:text-[var(--color-neon)]"
          >
            {sourcesOpen ? "Hide sources" : `Show ${sources.length} sources`}
          </button>
          {sourcesOpen && (
            <div className="mt-2 border-l-2 border-[var(--color-neon)]/40 pl-2.5">
              {sources.map((s, i) => (
                <div
                  key={i}
                  className="border-b border-[var(--color-border)] py-1 font-[JetBrains_Mono,monospace] text-[10.5px] text-[var(--color-text-muted)] last:border-b-0"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex flex-col items-start self-start max-w-[88%]">
      <div className="mb-1.5 px-1 font-[JetBrains_Mono,monospace] text-[9.5px] uppercase tracking-widest text-[var(--color-text-muted)]">
        SIAP
      </div>
      <div className="flex gap-1 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-muted)]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
