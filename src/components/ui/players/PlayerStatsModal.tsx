"use client";

import React from "react";
import {
  X,
  Heart,
  Zap,
  Target,
  Share2,
  Footprints,
  Shield,
  Dumbbell,
  Flag,
  MapPin,
  Hash,
  Star,
  Ruler,
  Weight,
  Briefcase,
} from "lucide-react";
import type { IPlayersResponse } from "@/features/main/dashboard";

interface Props {
  player: IPlayersResponse;
  isFav: boolean;
  onToggleFav: () => void;
  onClose: () => void;
}

type StatKey =
  | "pace"
  | "shooting"
  | "passing"
  | "dribbling"
  | "defending"
  | "physic";

const STAT_DEFS: { key: StatKey; label: string; Icon: React.ElementType }[] = [
  { key: "pace", label: "Pace", Icon: Zap },
  { key: "shooting", label: "Shooting", Icon: Target },
  { key: "passing", label: "Passing", Icon: Share2 },
  { key: "dribbling", label: "Dribbling", Icon: Footprints },
  { key: "defending", label: "Defending", Icon: Shield },
  { key: "physic", label: "Physical", Icon: Dumbbell },
];

export function PlayerStatsModal({
  player,
  isFav,
  onToggleFav,
  onClose,
}: Props) {
  const stats = player.player_stats;
  const overall = player.overall;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[min(1000px,98vw)] max-h-[95vh] overflow-y-auto rounded-[2rem] border border-[rgba(169,255,172,0.15)] bg-[rgba(10,12,9,0.98)] shadow-[0_40px_120px_rgba(0,0,0,1)] animate-[fadeUp_0.3s_ease] scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(71,72,69,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,72,69,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[rgba(0,254,102,0.04)] animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[rgba(0,254,102,0.06)] animate-spin-slow-reverse pointer-events-none" />

        {/* Buttons */}
        <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border backdrop-blur-sm ${
              isFav
                ? "bg-[rgba(0,254,102,0.15)] border-[rgba(0,254,102,0.4)] text-[#00fe66] scale-110 shadow-[0_0_20px_rgba(0,254,102,0.2)]"
                : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white/40 hover:text-[#00fe66] hover:border-[rgba(0,254,102,0.3)] hover:scale-110"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white/50 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Background Name Watermark */}
        <div className="absolute top-10 left-10 pointer-events-none select-none z-0 opacity-10">
          <h2
            className="font-[Bebas_Neue,sans-serif] leading-[0.85] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(60px,12vw,120px)",
              color: "rgba(252,252,248,0.5)",
            }}
          >
            {player.short_name.split(" ").map((w, i) => (
              <React.Fragment key={i}>
                {w}
                <br />
              </React.Fragment>
            ))}
          </h2>
        </div>

        {/* Content Layout */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 p-8 py-20">
          {/* Left Stats Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto order-2 lg:order-1">
            {STAT_DEFS.slice(0, 3).map(({ key, label, Icon }) => (
              <StatBar
                key={key}
                label={label}
                value={stats?.[key] ?? 0}
                icon={<Icon className="w-5 h-5" />}
                side="left"
              />
            ))}
          </div>

          {/* Center Column: Photo + Main Info */}
          <div className="flex-1 flex flex-col items-center order-1 lg:order-2 min-w-[300px]">
            {/* Player Photo with Glow */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-[#00fe66] opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[rgba(0,254,102,0.2)] shadow-[0_0_50px_rgba(0,254,102,0.1)] bg-[rgba(15,18,14,0.9)]">
                {player.player_face_url ? (
                  <img
                    src={player.player_face_url}
                    alt={player.short_name}
                    className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl font-[Bebas_Neue,sans-serif] text-[rgba(0,254,102,0.2)]">
                      {player.short_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Pulsing Dots around image */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00fe66] animate-pulse shadow-[0_0_15px_#00fe66]" />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00fe66] animate-pulse shadow-[0_0_15px_#00fe66]"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00fe66] animate-pulse shadow-[0_0_15px_#00fe66]"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00fe66] animate-pulse shadow-[0_0_15px_#00fe66]"
                style={{ animationDelay: "1.5s" }}
              />
            </div>

            {/* Main Player Card */}
            <div className="w-full max-w-[420px] rounded-[2.5rem] p-8 flex flex-col gap-6 bg-[rgba(18,22,17,0.9)] backdrop-blur-2xl border border-[rgba(169,255,172,0.18)] shadow-2xl relative overflow-hidden">
              {/* Accent Gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00fe66] to-transparent opacity-50" />

              <div className="flex items-center gap-6">
                <div className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[rgba(0,254,102,0.25)] to-[rgba(0,254,102,0.05)] border border-[rgba(0,254,102,0.4)] shadow-[0_0_30px_rgba(0,254,102,0.1)]">
                  <span className="text-[42px] leading-none font-[Bebas_Neue,sans-serif] text-[#00fe66]">
                    {overall}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[32px] leading-none uppercase tracking-tight text-white font-[Bebas_Neue,sans-serif] block truncate">
                    {player.short_name}
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.3em] uppercase text-[#00fe66]/70 font-[Oxanium,sans-serif] block mt-1">
                    {player.positions?.join(" · ")}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,254,102,0.2)] to-transparent" />

              <div className="grid grid-cols-3 gap-y-6">
                <InfoChip
                  icon={<Flag className="w-4 h-4 text-[#00fe66]" />}
                  label="Nat"
                  value={player.nationality_name}
                />
                <InfoChip
                  icon={<MapPin className="w-4 h-4 text-[#00fe66]" />}
                  label="Club"
                  value={player.club_name ?? "—"}
                />
                <InfoChip
                  icon={<Hash className="w-4 h-4 text-[#00fe66]" />}
                  label="Age"
                  value={String(player.age)}
                />
                <InfoChip
                  icon={<Star className="w-4 h-4 text-[#00fe66]" />}
                  label="Foot"
                  value={player.preferred_foot}
                />
                <InfoChip
                  icon={<Ruler className="w-4 h-4 text-[#00fe66]" />}
                  label="Height"
                  value={`${player.height_cm}cm`}
                />
                <InfoChip
                  icon={<Weight className="w-4 h-4 text-[#00fe66]" />}
                  label="Weight"
                  value={`${player.weight_kg}kg`}
                />
                <InfoChip
                  icon={<Briefcase className="w-4 h-4 text-[#00fe66]" />}
                  label="W/R"
                  value={player.work_rate}
                />
                <InfoChip
                  icon={<Star className="w-4 h-4 text-[#00fe66]" />}
                  label="Skill"
                  value={`${player.skill_moves}★`}
                />
                <InfoChip
                  icon={<Star className="w-4 h-4 text-[#00fe66]" />}
                  label="W.Foot"
                  value={`${player.weak_foot}★`}
                />
              </div>
            </div>
          </div>

          {/* Right Stats Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto order-3">
            {STAT_DEFS.slice(3).map(({ key, label, Icon }) => (
              <StatBar
                key={key}
                label={label}
                value={stats?.[key] ?? 0}
                icon={<Icon className="w-5 h-5" />}
                side="right"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Individual Stat Bar Component ── */
function StatBar({
  label,
  value,
  icon,
  side,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  side: "left" | "right";
}) {
  const color =
    value >= 85
      ? "#00fe66"
      : value >= 75
        ? "#86efac"
        : value >= 60
          ? "#fbbf24"
          : "#f87171";

  return (
    <div
      className={`flex items-center gap-4 ${side === "right" ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Visual Connector */}
      <div
        className={`hidden lg:block w-20 h-px ${
          side === "left"
            ? "bg-gradient-to-l from-[rgba(0,254,102,0.3)] to-transparent"
            : "bg-gradient-to-r from-[rgba(0,254,102,0.3)] to-transparent"
        }`}
      />
      {/* Stat Card */}
      <div className="p-5 rounded-2xl w-60 flex flex-col gap-2 backdrop-blur-xl border bg-[rgba(18,22,17,0.8)] border-[rgba(169,255,172,0.12)] hover:border-[rgba(0,254,102,0.4)] transition-all duration-300 group shadow-lg">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase font-[Oxanium,sans-serif] group-hover:text-white/60 transition-colors">
            {label}
          </span>
          <span className="text-[#00fe66] group-hover:scale-110 transition-transform">
            {icon}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-[42px] leading-none font-[Bebas_Neue,sans-serif]"
            style={{ color }}
          >
            {value}
          </span>
          <span className="text-[10px] text-white/20 font-[Oxanium,sans-serif] uppercase font-bold">
            / 100
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{
              width: `${Math.min(value, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Info Detail Chip Component ── */
function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2">
      <div className="flex items-center gap-1.5">
        <span className="opacity-80 scale-90">{icon}</span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase font-[Oxanium,sans-serif]">
          {label}
        </span>
      </div>
      <span
        className="font-[Bebas_Neue,sans-serif] text-[16px] text-white tracking-wide truncate block text-center w-full"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
