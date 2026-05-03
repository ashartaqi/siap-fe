"use client";

import React from "react";
import Image from "next/image";

interface Props {
  label: string;
  value: number;
  icon: React.ReactNode;
  connectorWidth: string;
  side: "left" | "right";
  filled: boolean;
  active: boolean;
  onClick: () => void;
  readOnly: boolean;
  playerName?: string;
  playerFaceUrl?: string;
}

export function StatCard({
  label,
  value,
  icon,
  connectorWidth,
  side,
  filled,
  active,
  onClick,
  readOnly,
  playerName,
  playerFaceUrl,
}: Props) {
  return (
    <div
      onClick={readOnly ? undefined : onClick}
      className={[
        "group relative flex items-center gap-4 transition-transform duration-200",
        readOnly ? "cursor-default" : "cursor-pointer hover:scale-105",
      ].join(" ")}
    >
      {side === "right" && (
        <div
          className={[
            `hidden md:block ${connectorWidth} h-px bg-gradient-to-r from-[rgba(169,255,172,0.4)] to-transparent transition-opacity duration-200`,
            active ? "opacity-100" : "opacity-50 group-hover:opacity-100",
          ].join(" ")}
        />
      )}
      <div
        className={[
          "p-4 rounded-xl w-48 flex flex-col gap-1 backdrop-blur-md border transition-[border-color,background,box-shadow] duration-200",
          active
            ? "bg-[var(--color-black)] border-[var(--color-neon)] shadow-[0_0_16px_var(--color-neon)]"
            : "bg-[var(--color-surface)] border-[var(--color-border)] group-hover:border-[var(--color-neon)]",
        ].join(" ")}
      >
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase font-[Oxanium,sans-serif]">
            {label}
          </span>
          <span className="text-[var(--color-neon)] w-4 h-4">{icon}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div
            className={[
              "text-[30px] leading-none font-[Bebas_Neue,sans-serif]",
              filled ? "text-white" : "text-white/15",
            ].join(" ")}
          >
            {filled ? value : "–"}
          </div>
          {filled && (playerFaceUrl || playerName) && (
            <div className="flex items-center gap-1.5 min-w-0">
              {playerFaceUrl && (
                <Image
                  src={playerFaceUrl}
                  alt={playerName ?? ""}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover border border-[var(--color-border)] shrink-0"
                  unoptimized
                  loading="eager"
                />
              )}
              {playerName && (
                <span className="text-[9px] font-bold text-white/50 truncate max-w-[64px] uppercase tracking-wide font-[Oxanium,sans-serif]">
                  {playerName}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-neon)] transition-all duration-700"
            style={{ width: filled ? `${Math.min(value, 100)}%` : "0%" }}
          />
        </div>
        {!readOnly && (
          <div className="text-[8px] font-bold tracking-[0.15em] uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-neon)]">
            {filled ? "Change player →" : "Assign player →"}
          </div>
        )}
      </div>
      {side === "left" && (
        <div
          className={[
            `hidden md:block ${connectorWidth} h-px bg-gradient-to-l from-[rgba(169,255,172,0.4)] to-transparent transition-opacity duration-200`,
            active ? "opacity-100" : "opacity-50 group-hover:opacity-100",
          ].join(" ")}
        />
      )}
    </div>
  );
}
