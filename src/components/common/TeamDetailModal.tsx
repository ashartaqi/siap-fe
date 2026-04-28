"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  useGetTeamRecentMatches,
  useGetTeamUpcomingFixtures,
} from "@/features/main/football";
import {
  type ITeamsResponse,
  type IPlayersResponse,
  type IPlayersPayload,
} from "@/features/main/dashboard";
import { InfoPill } from "@/components/common/InfoPill";
import { StatBar } from "@/components/common/StatBar";
import { PlayerDetailModal } from "@/components/common/PlayerDetailModal";
import { PlayerBrowserList } from "@/components/common/PlayerBrowserList";
import {
  INPUT,
  LABEL,
  ALL_POSITIONS_WITH_GK,
  PREFERRED_FEET,
} from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface TeamDetailModalProps {
  team: ITeamsResponse;
  onClose: () => void;
}

export function TeamDetailModal({ team, onClose }: TeamDetailModalProps) {
  const [imgErr, setImgErr] = useState(false);
  const [activeTab, setActiveTab] = useState<"fixtures" | "players">(
    "fixtures",
  );
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayersResponse | null>(
    null,
  );

  // Squad filter state — teamId is always locked to team.id
  const [squadName, setSquadName] = useState("");
  const [squadPosition, setSquadPosition] = useState("");
  const [squadNationality, setSquadNationality] = useState("");
  const [squadFoot, setSquadFoot] = useState("");
  const [squadMinOverall, setSquadMinOverall] = useState<number | undefined>();
  const [squadMaxOverall, setSquadMaxOverall] = useState<number | undefined>();
  const [squadMinAge, setSquadMinAge] = useState<number | undefined>();
  const [squadMaxAge, setSquadMaxAge] = useState<number | undefined>();

  const dName = useDebounce(squadName, 400);
  const dPosition = useDebounce(squadPosition, 400);
  const dNationality = useDebounce(squadNationality, 400);
  const dMinOverall = useDebounce(squadMinOverall, 400);
  const dMaxOverall = useDebounce(squadMaxOverall, 400);
  const dMinAge = useDebounce(squadMinAge, 400);
  const dMaxAge = useDebounce(squadMaxAge, 400);

  const squadPayload: IPlayersPayload = {
    limit: 15,
    teamId: team.id,
    name: dName || undefined,
    position: dPosition || undefined,
    nationalityName: dNationality || undefined,
    preferredFoot: squadFoot || undefined,
    minOverall: dMinOverall,
    maxOverall: dMaxOverall,
    minAge: dMinAge,
    maxAge: dMaxAge,
  };

  const { data: recentMatches = [], isLoading: recentLoading } =
    useGetTeamRecentMatches(team.name);
  const { data: upcomingFixtures = [], isLoading: upcomingLoading } =
    useGetTeamUpcomingFixtures(team.name, 5);

  const recentForm = useMemo(() => {
    return [...recentMatches]
      .sort(
        (a, b) =>
          new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
      )
      .slice(0, 5)
      .map((m) => {
        const isHome = m.home_team
          .toLowerCase()
          .includes(team.name.toLowerCase());
        if (m.winner === "DRAW") return "D";
        if (m.winner === "HOME_TEAM" && isHome) return "W";
        if (m.winner === "AWAY_TEAM" && !isHome) return "W";
        return "L";
      })
      .reverse();
  }, [recentMatches, team.name]);

  const isNational = team.league_name === "Friendly International";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-[8px] z-[1000] flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-[rgba(14,16,13,0.98)] border border-[rgba(71,72,69,0.3)] rounded-2xl w-[min(580px,100%)] max-h-[90vh] overflow-y-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col">
          {/* Header */}
          <div className="relative flex items-start gap-4 p-6 border-b border-[rgba(71,72,69,0.15)]">
            <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.25)] shrink-0 flex items-center justify-center p-2">
              {team.logo_url && !imgErr ? (
                <Image
                  src={team.logo_url}
                  alt={team.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  unoptimized
                  onError={() => setImgErr(true)}
                />
              ) : (
                <span className="text-4xl text-[rgba(0,255,102,0.25)]">🛡️</span>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-[Bebas_Neue,sans-serif] text-[28px] text-[#fcfcf8] leading-none">
                    {team.name}
                  </h2>
                  <p className="text-[11px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.04em]">
                    {isNational ? "National Team" : team.league_name} ·{" "}
                    {team.nationality_name}
                  </p>
                </div>
                <div className="font-[Bebas_Neue,sans-serif] text-[44px] text-[#00ff66] leading-none shrink-0">
                  {team.overall}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[rgba(255,255,255,0.3)] hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-6">
            {/* Info pills */}
            <div className="flex flex-col gap-2">
              <InfoPill label="Stadium" value={team.home_stadium || "—"} />
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-xl">
              <button
                onClick={() => setActiveTab("fixtures")}
                className={`
                flex-1 py-2 rounded-lg text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200
                ${
                  activeTab === "fixtures"
                    ? "bg-[#00ff66] text-[#0a0b09] shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                    : "text-[rgba(255,255,255,0.4)] hover:text-white"
                }
              `}
              >
                Future Fixtures
              </button>
              <button
                onClick={() => setActiveTab("players")}
                className={`
                flex-1 py-2 rounded-lg text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200
                ${
                  activeTab === "players"
                    ? "bg-[#00ff66] text-[#0a0b09] shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                    : "text-[rgba(255,255,255,0.4)] hover:text-white"
                }
              `}
              >
                Players
              </button>
            </div>

            {/* Stat bars */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] mb-3">
                Team Ratings
              </p>
              <div className="flex flex-col gap-2.5">
                <StatBar label="ATT" value={team.attack} />
                <StatBar label="MID" value={team.midfield} />
                <StatBar label="DEF" value={team.defence} />
              </div>
            </div>

            {activeTab === "fixtures" ? (
              <>
                {/* Recent form */}
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] mb-3">
                    Recent Form
                  </p>
                  {recentLoading ? (
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded bg-[rgba(255,255,255,0.05)] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : recentForm.length === 0 ? (
                    <p className="text-[11px] text-[rgba(255,255,255,0.25)]">
                      No recent results available.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      {recentForm.map((r, i) => (
                        <span
                          key={i}
                          className={[
                            "w-8 h-8 rounded font-[Bebas_Neue,sans-serif] text-[16px] flex items-center justify-center",
                            r === "W"
                              ? "bg-[rgba(0,255,102,0.15)] text-[#00ff66] border border-[rgba(0,255,102,0.3)]"
                              : r === "L"
                                ? "bg-[rgba(255,80,80,0.12)] text-[rgba(255,80,80,0.9)] border border-[rgba(255,80,80,0.25)]"
                                : "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)]",
                          ].join(" ")}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming fixtures */}
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] mb-3">
                    Upcoming Fixtures
                  </p>
                  {upcomingLoading ? (
                    <div className="flex flex-col gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 rounded-lg bg-[rgba(255,255,255,0.04)] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : upcomingFixtures.length === 0 ? (
                    <p className="text-[11px] text-[rgba(255,255,255,0.25)]">
                      No upcoming fixtures available.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {upcomingFixtures.map((f) => {
                        const isHome = f.home_team
                          .toLowerCase()
                          .includes(team.name.toLowerCase());
                        const opponent = isHome ? f.away_team : f.home_team;
                        const venue = isHome ? "H" : "A";
                        const date = new Date(f.date ?? "").toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          },
                        );
                        return (
                          <div
                            key={f.id}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[rgba(36,39,35,0.5)] border border-[rgba(71,72,69,0.15)]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={[
                                  "text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded shrink-0",
                                  isHome
                                    ? "text-[#00ff66] bg-[rgba(0,255,102,0.1)] border border-[rgba(0,255,102,0.2)]"
                                    : "text-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]",
                                ].join(" ")}
                              >
                                {venue}
                              </span>
                              <span className="text-[12px] text-[#fcfcf8] truncate">
                                vs {opponent}
                              </span>
                            </div>
                            <span className="text-[11px] text-[rgba(255,255,255,0.35)] shrink-0 ml-3">
                              {date}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── Players tab: filtered infinite-scroll squad ── */
              <div className="flex flex-col gap-3">
                {/* Filters — teamId is locked, no club input shown */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Name – full width */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className={LABEL}>Player Name</span>
                    <input
                      className={INPUT}
                      placeholder="Search by name…"
                      value={squadName}
                      onChange={(e) => setSquadName(e.target.value)}
                    />
                  </div>

                  {/* Position */}
                  <div className="flex flex-col gap-1">
                    <span className={LABEL}>Position</span>
                    <select
                      className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-2.5 py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)] transition-colors"
                      value={squadPosition}
                      onChange={(e) => setSquadPosition(e.target.value)}
                    >
                      <option value="">All Positions</option>
                      {ALL_POSITIONS_WITH_GK.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred foot */}
                  <div className="flex flex-col gap-1">
                    <span className={LABEL}>Preferred Foot</span>
                    <select
                      className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-2.5 py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)] transition-colors"
                      value={squadFoot}
                      onChange={(e) => setSquadFoot(e.target.value)}
                    >
                      <option value="">Any</option>
                      {PREFERRED_FEET.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nationality – full width */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className={LABEL}>Nationality</span>
                    <input
                      className={INPUT}
                      placeholder="e.g. Brazil"
                      value={squadNationality}
                      onChange={(e) => setSquadNationality(e.target.value)}
                    />
                  </div>

                  {/* Overall */}
                  <div className="flex flex-col gap-1">
                    <span className={LABEL}>Overall</span>
                    <div className="flex gap-1.5 items-center">
                      <input
                        className={INPUT}
                        type="number"
                        placeholder="Min"
                        min={1}
                        max={99}
                        value={squadMinOverall ?? ""}
                        onChange={(e) =>
                          setSquadMinOverall(
                            e.target.value ? +e.target.value : undefined,
                          )
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
                        value={squadMaxOverall ?? ""}
                        onChange={(e) =>
                          setSquadMaxOverall(
                            e.target.value ? +e.target.value : undefined,
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1">
                    <span className={LABEL}>Age</span>
                    <div className="flex gap-1.5 items-center">
                      <input
                        className={INPUT}
                        type="number"
                        placeholder="Min"
                        min={15}
                        max={45}
                        value={squadMinAge ?? ""}
                        onChange={(e) =>
                          setSquadMinAge(
                            e.target.value ? +e.target.value : undefined,
                          )
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
                        max={45}
                        value={squadMaxAge ?? ""}
                        onChange={(e) =>
                          setSquadMaxAge(
                            e.target.value ? +e.target.value : undefined,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Infinite-scroll player list */}
                <PlayerBrowserList
                  payload={squadPayload}
                  onSelectPlayer={setSelectedPlayer}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          isFavorite={false}
          favLoading={false}
          onClose={() => setSelectedPlayer(null)}
          onToggleFavorite={() => {}}
        />
      )}
    </>
  );
}
