"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useGetPlayers,
  IPlayersPayload,
  IPlayersResponse,
} from "@/features/main/dashboard";
import { INPUT, LABEL, ALL_POSITIONS } from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";

// ── StatBadge ─────────────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value?: number }) {
  const pct = value ?? 0;
  const color =
    pct >= 80
      ? "text-[#00ff66] border-[rgba(0,255,102,0.25)]"
      : pct >= 65
        ? "text-[#ffd700] border-[rgba(255,215,0,0.2)]"
        : "text-[rgba(255,80,80,0.85)] border-[rgba(255,80,80,0.2)]";

  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-md px-1.5 py-1 min-w-[38px] ${color}`}
    >
      <span className="text-[14px] font-[Bebas_Neue,sans-serif] leading-none">
        {value ?? "—"}
      </span>
      <span className="text-[7px] font-bold tracking-[0.15em] uppercase mt-0.5 opacity-60">
        {label}
      </span>
    </div>
  );
}

// ── PlayerCard ────────────────────────────────────────────────────────────────

function PlayerCard({ player }: { player: IPlayersResponse }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-[rgba(18,20,17,0.92)] border border-[rgba(71,72,69,0.2)] hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.03)] rounded-xl overflow-hidden transition-all duration-200 flex flex-col">
      {/* Top: avatar + identity */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(71,72,69,0.12)]">
        <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center">
          {player.player_face_url && !imgErr ? (
            <Image
              src={player.player_face_url}
              alt={player.short_name}
              width={52}
              height={52}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              unoptimized
              onError={() => setImgErr(true)}
            />
          ) : (
            <span className="text-[rgba(0,255,102,0.3)] text-2xl">👤</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-[Bebas_Neue,sans-serif] text-[20px] text-[#fcfcf8] leading-none truncate">
              {player.short_name}
            </span>
            <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2 py-0.5 rounded-[4px]">
              {player.positions?.join(" · ") ?? "—"}
            </span>
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 tracking-[0.05em] truncate">
            {player.club_name} · {player.nationality_name} · Age {player.age}
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.25)] mt-0.5 tracking-[0.05em]">
            {player.preferred_foot} foot · {player.work_rate}
          </div>
        </div>

        <div className="font-[Bebas_Neue,sans-serif] text-[38px] text-[#00ff66] leading-none shrink-0">
          {player.overall}
        </div>
      </div>

      {/* Bottom: stats */}
      {player.goalkeeper_stats ? (
        <div className="flex gap-1.5 flex-wrap px-4 py-3 justify-between">
          <StatBadge label="DIV" value={player.goalkeeper_stats.diving} />
          <StatBadge label="HAN" value={player.goalkeeper_stats.handling} />
          <StatBadge label="KIC" value={player.goalkeeper_stats.kicking} />
          <StatBadge label="POS" value={player.goalkeeper_stats.positioning} />
          <StatBadge label="REF" value={player.goalkeeper_stats.reflexes} />
          <StatBadge label="SPD" value={player.goalkeeper_stats.speed} />
        </div>
      ) : (
        <div className="flex gap-1.5 flex-wrap px-4 py-3 justify-between">
          <StatBadge label="PAC" value={player.player_stats?.pace} />
          <StatBadge label="SHO" value={player.player_stats?.shooting} />
          <StatBadge label="PAS" value={player.player_stats?.passing} />
          <StatBadge label="DRI" value={player.player_stats?.dribbling} />
          <StatBadge label="DEF" value={player.player_stats?.defending} />
          <StatBadge label="PHY" value={player.player_stats?.physic} />
        </div>
      )}
    </div>
  );
}

// ── Players Page ───────────────────────────────────────────────────────────────

const ALL_POSITIONS_WITH_GK = [...ALL_POSITIONS, "GK"];
const FEET = ["Left", "Right"];

export default function PlayersPage() {
  const [name, setName] = useState("");
  const [nationalityName, setNationalityName] = useState("");
  const [position, setPosition] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [minOverall, setMinOverall] = useState<number | undefined>();
  const [maxOverall, setMaxOverall] = useState<number | undefined>();
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();

  // Debounce free-text / number inputs so backend only fires after user stops typing
  const dName = useDebounce(name, 500);
  const dNationality = useDebounce(nationalityName, 500);
  const dMinOverall = useDebounce(minOverall, 500);
  const dMaxOverall = useDebounce(maxOverall, 500);
  const dMinAge = useDebounce(minAge, 500);
  const dMaxAge = useDebounce(maxAge, 500);

  const payload: IPlayersPayload = {
    limit: 50,
    name: dName || undefined,
    nationalityName: dNationality || undefined,
    position: position || undefined,
    preferredFoot: preferredFoot || undefined,
    minOverall: dMinOverall,
    maxOverall: dMaxOverall,
    minAge: dMinAge,
    maxAge: dMaxAge,
  };

  const { data: players = [], isLoading, isFetching } = useGetPlayers(payload);

  const hasActiveFilters =
    !!name ||
    !!nationalityName ||
    !!position ||
    !!preferredFoot ||
    minOverall !== undefined ||
    maxOverall !== undefined ||
    minAge !== undefined ||
    maxAge !== undefined;

  function clearFilters() {
    setName("");
    setNationalityName("");
    setPosition("");
    setPreferredFoot("");
    setMinOverall(undefined);
    setMaxOverall(undefined);
    setMinAge(undefined);
    setMaxAge(undefined);
  }

  return (
    <div className="min-h-screen bg-[#0a0b09] text-[#fcfcf8] font-[Oxanium,sans-serif]">
      {/* ── Page Header ── */}
      <div className="border-b border-[rgba(71,72,69,0.2)] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-[Bebas_Neue,sans-serif] text-[28px] tracking-[0.06em] text-[#fcfcf8]">
            Players Database
          </h1>
          {isFetching && (
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2.5 py-1 rounded-[4px] animate-pulse">
              Updating…
            </span>
          )}
        </div>
        {!isLoading && (
          <span className={LABEL}>
            {players.length} player{players.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-0 max-w-[1600px] mx-auto">
        {/* ── Filters sidebar ── */}
        <aside className="lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-[rgba(71,72,69,0.2)] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-[Bebas_Neue,sans-serif] text-[16px] tracking-[0.08em] text-[rgba(255,255,255,0.5)]">
              Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[9px] font-bold tracking-[0.15em] uppercase text-[rgba(255,100,100,0.7)] hover:text-[rgba(255,100,100,1)] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Player Name</span>
              <input
                className={INPUT}
                placeholder="Search by name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Nationality */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Nationality</span>
              <input
                className={INPUT}
                placeholder="e.g. Brazil, England"
                value={nationalityName}
                onChange={(e) => setNationalityName(e.target.value)}
              />
            </div>

            {/* Position */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Position</span>
              <select
                className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">All Positions</option>
                {ALL_POSITIONS_WITH_GK.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Foot */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Preferred Foot</span>
              <select
                className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value)}
              >
                <option value="">Any</option>
                {FEET.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Overall Rating */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Overall Rating</span>
              <div className="flex gap-1.5 items-center">
                <input
                  className={INPUT}
                  type="number"
                  placeholder="Min"
                  min={1}
                  max={99}
                  value={minOverall ?? ""}
                  onChange={(e) =>
                    setMinOverall(e.target.value ? +e.target.value : undefined)
                  }
                />
                <span className="text-[rgba(255,255,255,0.2)] text-[11px] shrink-0">
                  –
                </span>
                <input
                  className={INPUT}
                  type="number"
                  placeholder="Max"
                  min={1}
                  max={99}
                  value={maxOverall ?? ""}
                  onChange={(e) =>
                    setMaxOverall(e.target.value ? +e.target.value : undefined)
                  }
                />
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Age</span>
              <div className="flex gap-1.5 items-center">
                <input
                  className={INPUT}
                  type="number"
                  placeholder="Min"
                  min={15}
                  max={50}
                  value={minAge ?? ""}
                  onChange={(e) =>
                    setMinAge(e.target.value ? +e.target.value : undefined)
                  }
                />
                <span className="text-[rgba(255,255,255,0.2)] text-[11px] shrink-0">
                  –
                </span>
                <input
                  className={INPUT}
                  type="number"
                  placeholder="Max"
                  min={15}
                  max={50}
                  value={maxAge ?? ""}
                  onChange={(e) =>
                    setMaxAge(e.target.value ? +e.target.value : undefined)
                  }
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Players Grid ── */}
        <main className="flex-1 p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[rgba(18,20,17,0.6)] rounded-xl h-[138px] animate-pulse border border-[rgba(71,72,69,0.1)]"
                />
              ))}
            </div>
          ) : players.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <div className="w-14 h-14 rounded-full border border-[rgba(71,72,69,0.3)] flex items-center justify-center text-2xl mb-2">
                🔍
              </div>
              <p className="font-[Bebas_Neue,sans-serif] text-[22px] tracking-[0.06em] text-[rgba(255,255,255,0.3)]">
                No Players Found
              </p>
              <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[0.08em] max-w-xs">
                Try adjusting your filters to find players.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-3 py-1.5 rounded-[4px] hover:bg-[rgba(0,255,102,0.12)] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
