"use client";

import Image from "next/image";
import { useState } from "react";
import type { IPlayersResponse } from "@/features/main/dashboard";

import { calculateAge } from "@/lib/utils/footballUtils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatRow({
  label,
  value,
  max = 99,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor =
    value >= 80 ? "#00ff66" : value >= 65 ? "#ffd700" : "rgba(255,80,80,0.85)";

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[rgba(255,255,255,0.4)] w-[36px] shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[4px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span
        className="text-[13px] font-[Bebas_Neue,sans-serif] leading-none w-[26px] text-right"
        style={{ color: barColor }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.25)] rounded-lg px-3 py-2 gap-0.5">
      <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[rgba(255,255,255,0.35)]">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-[#fcfcf8]">{value}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PlayerDetailModalProps {
  player: IPlayersResponse;
  isFavorite: boolean;
  favLoading: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export function PlayerDetailModal({
  player,
  isFavorite,
  favLoading,
  onClose,
  onToggleFavorite,
}: PlayerDetailModalProps) {
  const [imgErr, setImgErr] = useState(false);
  const isGK = !!player.goalkeeper_stats;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-[8px] z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="
          bg-[rgba(14,16,13,0.98)] border border-[rgba(71,72,69,0.3)]
          rounded-2xl w-[min(560px,100%)] max-h-[90vh] overflow-y-auto
          shadow-[0_40px_100px_rgba(0,0,0,0.8)]
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative flex items-start gap-4 p-6 border-b border-[rgba(71,72,69,0.15)]">
          {/* Avatar */}
          <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.25)] shrink-0 flex items-center justify-center">
            {player.player_face_url && !imgErr ? (
              <Image
                src={player.player_face_url}
                alt={player.short_name}
                width={80}
                height={80}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                unoptimized
                onError={() => setImgErr(true)}
              />
            ) : (
              <span className="text-4xl text-[rgba(0,255,102,0.25)]">👤</span>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-[Bebas_Neue,sans-serif] text-[28px] text-[#fcfcf8] leading-none">
                  {player.short_name}
                </h2>
                <p className="text-[11px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.04em]">
                  {player.long_name}
                </p>
              </div>

              {/* OVR badge */}
              <div className="font-[Bebas_Neue,sans-serif] text-[44px] text-[#00ff66] leading-none shrink-0">
                {player.overall}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {player.positions?.map((pos) => (
                <span
                  key={pos}
                  className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2 py-0.5 rounded-[4px]"
                >
                  {pos}
                </span>
              ))}
              <span className="text-[10px] text-[rgba(255,255,255,0.3)] tracking-[0.05em]">
                {player.club_name} · {player.nationality_name}
              </span>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[rgba(255,255,255,0.3)] hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 flex flex-col gap-6">
          {/* Quick info pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <InfoPill label="Age" value={calculateAge(player.dob)} />
            <InfoPill
              label="DOB"
              value={player.dob ? formatDate(player.dob) : "—"}
            />
            <InfoPill label="Height" value={`${player.height_cm} cm`} />
            <InfoPill label="Weight" value={`${player.weight_kg} kg`} />
            <InfoPill label="Foot" value={player.preferred_foot} />
            <InfoPill label="Weak Foot" value={"★".repeat(player.weak_foot)} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <InfoPill label="Skill" value={"★".repeat(player.skill_moves)} />
            <InfoPill label="Work Rate" value={player.work_rate} />
            <InfoPill label="Nationality" value={player.nationality_name} />
          </div>

          {/* Stats */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] mb-3">
              {isGK ? "Goalkeeper Stats" : "Player Stats"}
            </p>
            <div className="flex flex-col gap-2.5">
              {isGK ? (
                <>
                  <StatRow
                    label="DIV"
                    value={player.goalkeeper_stats!.diving}
                  />
                  <StatRow
                    label="HAN"
                    value={player.goalkeeper_stats!.handling}
                  />
                  <StatRow
                    label="KIC"
                    value={player.goalkeeper_stats!.kicking}
                  />
                  <StatRow
                    label="POS"
                    value={player.goalkeeper_stats!.positioning}
                  />
                  <StatRow
                    label="REF"
                    value={player.goalkeeper_stats!.reflexes}
                  />
                  <StatRow label="SPD" value={player.goalkeeper_stats!.speed} />
                </>
              ) : (
                <>
                  <StatRow label="PAC" value={player.player_stats?.pace ?? 0} />
                  <StatRow
                    label="SHO"
                    value={player.player_stats?.shooting ?? 0}
                  />
                  <StatRow
                    label="PAS"
                    value={player.player_stats?.passing ?? 0}
                  />
                  <StatRow
                    label="DRI"
                    value={player.player_stats?.dribbling ?? 0}
                  />
                  <StatRow
                    label="DEF"
                    value={player.player_stats?.defending ?? 0}
                  />
                  <StatRow
                    label="PHY"
                    value={player.player_stats?.physic ?? 0}
                  />
                </>
              )}
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={onToggleFavorite}
            disabled={favLoading}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-xl
              font-[Oxanium,sans-serif] text-[13px] font-bold tracking-[0.1em] uppercase
              border transition-all duration-200
              ${
                isFavorite
                  ? "border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.07)] text-[#ffd700] hover:bg-[rgba(255,80,80,0.08)] hover:border-[rgba(255,80,80,0.35)] hover:text-[rgba(255,80,80,0.9)]"
                  : "border-[rgba(0,255,102,0.25)] bg-[rgba(0,255,102,0.06)] text-[#00ff66] hover:bg-[rgba(0,255,102,0.12)]"
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            <span className="text-[16px]">{isFavorite ? "★" : "☆"}</span>
            {favLoading
              ? "Saving…"
              : isFavorite
                ? "Remove from Favourites"
                : "Add to Favourites"}
          </button>
        </div>
      </div>
    </div>
  );
}
