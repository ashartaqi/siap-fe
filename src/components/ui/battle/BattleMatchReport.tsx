"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, FastForward, SkipForward } from "lucide-react";
import type { IMatchSimulationStats } from "@/features/main/battle/apis/battle";

interface BattleMatchReportProps {
  stats: IMatchSimulationStats;
  log: string[];
  onSimulationComplete?: () => void;
}

const EVENT_KEYWORDS = {
  goal: ["GOAL", "scores", "nets", "puts it away"],
  shot: ["shoots", "shot", "fires", "attempt", "off target"],
  save: ["save", "saves", "keeper", "denied", "parried"],
  foul: ["foul", "tackle", "card", "yellow", "red"],
  chance: ["chance", "opportunity", "break"],
};

function getEventIcon(entry: string): string {
  const lower = entry.toLowerCase();
  if (EVENT_KEYWORDS.goal.some((k) => lower.includes(k.toLowerCase())))
    return "⚽";
  if (EVENT_KEYWORDS.save.some((k) => lower.includes(k.toLowerCase())))
    return "🧤";
  if (EVENT_KEYWORDS.shot.some((k) => lower.includes(k.toLowerCase())))
    return "🎯";
  if (EVENT_KEYWORDS.foul.some((k) => lower.includes(k.toLowerCase())))
    return "🟨";
  if (EVENT_KEYWORDS.chance.some((k) => lower.includes(k.toLowerCase())))
    return "💥";
  return "▶";
}

function getEventColor(entry: string): string {
  const lower = entry.toLowerCase();
  if (EVENT_KEYWORDS.goal.some((k) => lower.includes(k.toLowerCase())))
    return "text-[#00ff66]";
  if (EVENT_KEYWORDS.save.some((k) => lower.includes(k.toLowerCase())))
    return "text-[#60aaff]";
  if (EVENT_KEYWORDS.shot.some((k) => lower.includes(k.toLowerCase())))
    return "text-[#ffd700]";
  if (EVENT_KEYWORDS.foul.some((k) => lower.includes(k.toLowerCase())))
    return "text-[#ff8c44]";
  return "text-[#888]";
}

const STAT_ROWS: {
  key1: keyof IMatchSimulationStats;
  key2: keyof IMatchSimulationStats;
  label: string;
  format?: (v: number) => string;
}[] = [
  {
    key1: "possession1",
    key2: "possession2",
    label: "Possession",
    format: (v) => `${v}%`,
  },
  { key1: "shots1", key2: "shots2", label: "Shots" },
  { key1: "xg1", key2: "xg2", label: "xG", format: (v) => v.toFixed(2) },
];

export function BattleMatchReport({
  stats,
  log,
  onSimulationComplete,
}: BattleMatchReportProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFast, setIsFast] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speed = isFast ? 120 : 600;

  const advance = useCallback(() => {
    setVisibleCount((prev) => {
      if (prev >= log.length) {
        setIsPlaying(false);
        setIsDone(true);
        onSimulationComplete?.();
        return prev;
      }
      return prev + 1;
    });
  }, [log.length, onSimulationComplete]);

  useEffect(() => {
    if (!isPlaying || isDone) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(advance, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isDone, speed, advance]);

  // Auto-scroll to latest entry
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount]);

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisibleCount(log.length);
    setIsPlaying(false);
    setIsDone(true);
    onSimulationComplete?.();
  };

  const togglePlayPause = () => setIsPlaying((p) => !p);
  const toggleSpeed = () => setIsFast((f) => !f);

  const progress = log.length > 0 ? (visibleCount / log.length) * 100 : 100;

  return (
    <div className="w-full max-w-4xl bg-[#0d0d0d] border border-[#1e1e1e] rounded-3xl overflow-hidden flex flex-col gap-0 shadow-2xl">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-[#1a1a1a] flex items-center justify-between">
        <h3 className="text-[#00ff66] font-[Bebas_Neue] text-2xl tracking-widest uppercase">
          Match Simulation
        </h3>
        {!isDone && (
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              title={isPlaying ? "Pause" : "Play"}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#aaaba7] hover:text-white"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={toggleSpeed}
              title={isFast ? "Normal Speed" : "Fast Forward"}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                isFast
                  ? "bg-[rgba(0,255,102,0.1)] border-[rgba(0,255,102,0.3)] text-[#00ff66]"
                  : "bg-white/5 border-white/10 text-[#aaaba7] hover:text-white hover:bg-white/10"
              }`}
            >
              <FastForward size={14} />
            </button>
            <button
              onClick={handleSkip}
              title="Skip to End"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-[rgba(255,100,100,0.1)] hover:border-[rgba(255,100,100,0.3)] hover:text-[#ff6464] transition-colors text-[#aaaba7]"
            >
              <SkipForward size={14} />
            </button>
          </div>
        )}
        {isDone && (
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2 py-1 rounded">
            Full Time
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#1a1a1a] w-full">
        <div
          className="h-full bg-[#00ff66] transition-all duration-300 shadow-[0_0_6px_rgba(0,255,102,0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Match Log */}
      <div className="px-6 py-4 max-h-72 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
        {log.slice(0, visibleCount).map((entry, idx) => {
          const icon = getEventIcon(entry);
          const color = getEventColor(entry);
          const isNew = idx === visibleCount - 1;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                isNew
                  ? "bg-white/5 animate-in fade-in slide-in-from-left-2 duration-300"
                  : ""
              }`}
            >
              <span className="text-[14px] shrink-0 mt-0.5">{icon}</span>
              <span className={`text-[11px] font-mono tracking-wider ${color}`}>
                {entry}
              </span>
            </div>
          );
        })}
        {!isDone && visibleCount < log.length && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      {/* Stats - only shown when done */}
      {isDone && (
        <div className="border-t border-[#1a1a1a] px-8 py-6 animate-in fade-in duration-500">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#555] mb-4 text-center">
            Match Stats
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {STAT_ROWS.map(({ key1, key2, label, format }) => (
              <div key={key1} className="contents">
                <div className="text-[#aaaba7] font-bold text-sm">
                  {format ? format(stats[key1] as number) : stats[key1]}
                </div>
                <div className="text-[9px] tracking-widest uppercase text-[#444] self-center">
                  {label}
                </div>
                <div className="text-[#aaaba7] font-bold text-sm">
                  {format ? format(stats[key2] as number) : stats[key2]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
