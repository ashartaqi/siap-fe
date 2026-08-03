"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useAskSiap } from "@/features/main/ask";
import type { AskResponse } from "@/features/main/ask";
import type { TAxiosError } from "@/types/api";
import { extractErrorMessage } from "@/lib/utils/errorUtils";
import { useScrollToBottom } from "@/lib/hooks/useScrollToBottom";
import {
  UserBubble,
  BotBubble,
  TypingBubble,
} from "@/components/ui/ask/AskMessageBubble";
import { AskComposer } from "@/components/ui/ask/AskComposer";
import { Toast } from "@/components/common/Toast";

const EXAMPLE_QUESTIONS = [
  "Who are the fastest strikers?",
  "How many left-footed strikers are there?",
  "Compare Mbappé and Haaland",
  "Best young center-backs under 21",
];

type Message =
  | { kind: "user"; text: string }
  | { kind: "bot"; data: AskResponse };

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: ask, isPending } = useAskSiap();
  const scrollRef = useScrollToBottom(messages);

  const handleSend = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isPending) return;

    setInput("");
    setMessages((m) => [...m, { kind: "user", text: trimmed }]);

    ask(trimmed, {
      onSuccess: (data) => {
        setMessages((m) => [...m, { kind: "bot", data }]);
      },
      onError: (err: Error) => {
        const axiosErr = err as TAxiosError;
        if (axiosErr.response?.status === 429) {
          setError("Hit the rate limit — try again in a minute.");
        } else {
          console.error("Ask SIAP error:", axiosErr);
          setError(extractErrorMessage(axiosErr));
        }
      },
    });
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto text-[var(--color-text)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="font-[Bebas_Neue,sans-serif] text-[36px] leading-none tracking-tight uppercase">
              ASK <span className="text-[var(--color-neon)]">SIAP</span>
            </h1>
            <p className="text-[11px] text-[var(--color-text-muted)] tracking-wider uppercase mt-1.5">
              Query 31,000+ players in plain language
            </p>
          </div>
          <div className="live-dot" />
        </div>

        <div className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.015)] overflow-hidden flex flex-col shadow-2xl">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 flex flex-col gap-4"
          >
            {messages.length === 0 ? (
              <div className="m-auto max-w-md text-center px-4 py-8">
                <Sparkles
                  size={40}
                  className="mx-auto mb-4 text-[var(--color-neon)] opacity-60"
                />
                <h2 className="font-[Bebas_Neue,sans-serif] text-[20px] uppercase tracking-wide text-[var(--color-text-muted)] mb-5">
                  Ask anything about the database
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-left rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-3 text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-neon)]/50"
                    >
                      <span className="text-[var(--color-neon)] font-[JetBrains_Mono,monospace]">
                        ▸{" "}
                      </span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m, i) =>
                  m.kind === "user" ? (
                    <UserBubble key={i} text={m.text} />
                  ) : (
                    <BotBubble key={i} {...m.data} />
                  ),
                )}
                {isPending && <TypingBubble />}
              </div>
            )}
          </div>

          <AskComposer
            value={input}
            onChange={setInput}
            onSubmit={() => handleSend(input)}
            isPending={isPending}
          />
        </div>
      </div>

      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}
    </>
  );
}
