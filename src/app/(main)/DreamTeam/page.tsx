"use client";

import { useState, useMemo } from "react";
import {
  PlayerSlotButton,
  CreateDreamTeamButton,
} from "@/components/common/Button";
import {
  useGetPlayers,
  IPlayersPayload,
  IPlayersResponse,
  IGoalKeeperResponse,
} from "@/features/main/dashboard";
import { useGetGoalkeepers } from "@/features/main/dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

type Formation = {
  id: string;
  label: string;
  description: string;
  tacticalFit: string;
  rows: string[][];
};

type SelectedPlayers = Record<
  string,
  IPlayersResponse | IGoalKeeperResponse | undefined
>;

// ─── Position categorization ──────────────────────────────────────────────────

const ATTACK_POSITIONS = ["ST", "CF", "LW", "RW", "LF", "RF", "SS"];
const MIDFIELD_POSITIONS = ["CM", "CAM", "CDM", "LM", "RM", "DM", "AM"];
const DEFENSE_POSITIONS = ["CB", "LB", "RB", "LWB", "RWB", "SW"];

function categorizePosition(
  pos: string,
): "attack" | "midfield" | "defense" | "gk" {
  if (pos === "GK") return "gk";
  if (ATTACK_POSITIONS.includes(pos)) return "attack";
  if (MIDFIELD_POSITIONS.includes(pos)) return "midfield";
  if (DEFENSE_POSITIONS.includes(pos)) return "defense";
  return "midfield";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FORMATIONS: Formation[] = [
  {
    id: "4-4-2",
    label: "4-4-2",
    description: "Classic Balance",
    tacticalFit: "A+",
    rows: [
      ["ST", "ST"],
      ["LM", "CM", "CM", "RM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "4-3-3",
    label: "4-3-3",
    description: "Offensive Width",
    tacticalFit: "A",
    rows: [
      ["LW", "ST", "RW"],
      ["CM", "CM", "CM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "3-4-3",
    label: "3-4-3",
    description: "Midfield Control",
    tacticalFit: "B+",
    rows: [
      ["LW", "ST", "RW"],
      ["LM", "CM", "CM", "RM"],
      ["CB", "CB", "CB"],
    ],
  },
  {
    id: "4-2-2-2",
    label: "4-2-2-2",
    description: "Tactical Pivot",
    tacticalFit: "A-",
    rows: [
      ["ST", "ST"],
      ["AM", "AM"],
      ["DM", "DM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

// Matches .kgm-input exactly
const INPUT =
  "w-full box-border bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,255,102,0.4)]";

// Matches .kgm-label exactly
const LABEL =
  "text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.35)]";

// ─── Player Picker Modal ──────────────────────────────────────────────────────

function PlayerPickerModal({
  onClose,
  onSelect,
  slotPosition,
  isGK = false,
  usedPlayerIds,
}: {
  onClose: () => void;
  onSelect: (player: IPlayersResponse | IGoalKeeperResponse) => void;
  slotPosition: string;
  isGK?: boolean;
  usedPlayerIds: Set<number>;
}) {
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>();
  const [minOverall, setMinOverall] = useState<number | undefined>();
  const [maxOverall, setMaxOverall] = useState<number | undefined>();
  const [position, setPosition] = useState(slotPosition);
  const [nationalityName, setNationalityName] = useState("");
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [preferredFoot, setPreferredFoot] = useState("");

  const payload: IPlayersPayload = {
    limit: 10,
    name: name || undefined,
    teamId,
    minOverall,
    maxOverall,
    position: position || undefined,
    nationalityName: nationalityName || undefined,
    minAge,
    maxAge,
    preferredFoot: preferredFoot || undefined,
  };

  const playersQuery = useGetPlayers(payload);
  const goalkeepersQuery = useGetGoalkeepers(payload);
  const {
    data: players = [],
    isLoading,
    isError,
    error,
  } = isGK ? goalkeepersQuery : playersQuery;

  return (
    /*
     * .kgm-overlay
     * position:fixed; inset:0; background:rgba(0,0,0,0.7);
     * backdrop-filter:blur(6px); z-index:1000;
     * display:flex; align-items:center; justify-content:center;
     * animation: kgm-fade-in 0.2s ease
     */
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-[1000] flex items-center justify-center animate-[kgm-fade-in_0.2s_ease]"
      onClick={onClose}
    >
      {/*
       * .kgm-modal
       * background:rgba(18,20,17,0.92); border:1px solid rgba(0,255,102,0.15);
       * border-radius:16px; width:min(680px,95vw); max-height:85vh;
       * display:flex; flex-direction:column; overflow:hidden;
       * box-shadow:0 32px 80px rgba(0,0,0,0.7);
       * animation: kgm-slide-up 0.25s ease
       */}
      <div
        className="bg-[rgba(18,20,17,0.92)] border border-[rgba(0,255,102,0.15)] rounded-2xl w-[min(680px,95vw)] max-h-[85vh] flex flex-col overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] animate-[kgm-slide-up_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/*
         * .kgm-header
         * display:flex; align-items:center; justify-content:space-between;
         * padding:16px 20px; border-bottom:1px solid rgba(71,72,69,0.2); flex-shrink:0
         */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(71,72,69,0.2)] shrink-0">
          <div className="flex items-center gap-[10px]">
            {/* .kgm-title: Bebas Neue; 22px; color:#fcfcf8; tracking:.04em */}
            <span className="font-[Bebas_Neue,sans-serif] text-[22px] text-[#fcfcf8] tracking-[0.04em]">
              Select Player
            </span>
            {/*
             * .kgm-slot-badge
             * 9px; 700; tracking:.22em; uppercase; color:#00ff66;
             * bg:rgba(0,255,102,0.08); border:1px solid rgba(0,255,102,0.2);
             * padding:4px 10px; border-radius:4px
             */}
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-[10px] py-1 rounded-[4px]">
              {slotPosition}
            </span>
          </div>
          {/*
           * .kgm-close
           * background:none; border:none; cursor:pointer;
           * color:rgba(255,255,255,0.4); font-size:20px;
           * transition:color .2s; padding:4px; line-height:1
           */}
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-[rgba(255,255,255,0.4)] text-[20px] leading-none p-1 transition-colors duration-200 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/*
         * .kgm-filters
         * display:grid; grid-template-columns:1fr 1fr; gap:10px;
         * padding:16px 20px; border-bottom:1px solid rgba(71,72,69,0.2); flex-shrink:0
         */}
        <div className="grid grid-cols-2 gap-[10px] px-5 py-4 border-b border-[rgba(71,72,69,0.2)] shrink-0">
          {/* .kgm-filter-group--full: grid-column:1/-1 */}
          <div className="col-span-2 flex flex-col gap-[5px]">
            <span className={LABEL}>Player Name</span>
            <input
              className={INPUT}
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-[5px]">
            <span className={LABEL}>Team ID</span>
            <input
              className={INPUT}
              type="number"
              placeholder="Enter team ID..."
              value={teamId ?? ""}
              onChange={(e) =>
                setTeamId(e.target.value ? +e.target.value : undefined)
              }
            />
          </div>

          <div className="flex flex-col gap-[5px]">
            <span className={LABEL}>Position</span>
            <input
              className={INPUT}
              placeholder="e.g. ST, CM, GK"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[5px]">
            <span className={LABEL}>Nationality</span>
            <input
              className={INPUT}
              placeholder="e.g. Brazil"
              value={nationalityName}
              onChange={(e) => setNationalityName(e.target.value)}
            />
          </div>

          {/* .kgm-range-row: display:flex; gap:6px; align-items:center */}
          <div className="flex flex-col gap-[5px]">
            <span className={LABEL}>Overall Rating</span>
            <div className="flex gap-[6px] items-center">
              <input
                className={INPUT}
                type="number"
                placeholder="Min"
                value={minOverall ?? ""}
                onChange={(e) =>
                  setMinOverall(e.target.value ? +e.target.value : undefined)
                }
              />
              {/* .kgm-range-sep: color rgba(255,255,255,0.2); font-size:11px */}
              <span className="text-[rgba(255,255,255,0.2)] text-[11px] shrink-0">
                –
              </span>
              <input
                className={INPUT}
                type="number"
                placeholder="Max"
                value={maxOverall ?? ""}
                onChange={(e) =>
                  setMaxOverall(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-[5px]">
            <span className={LABEL}>Age</span>
            <div className="flex gap-[6px] items-center">
              <input
                className={INPUT}
                type="number"
                placeholder="Min"
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
                value={maxAge ?? ""}
                onChange={(e) =>
                  setMaxAge(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>

          {/*
           * .kgm-select
           * bg:rgba(36,39,35,0.8); border:1px solid rgba(71,72,69,0.3); border-radius:6px;
           * padding:8px 10px; font-family Oxanium; font-size:12px; color:#fcfcf8;
           * outline:none; transition:border-color .2s; width:100%; appearance:none; cursor:pointer
           */}
          <div className="flex flex-col gap-[5px]">
            <span className={LABEL}>Preferred Foot</span>
            <select
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
              value={preferredFoot}
              onChange={(e) => setPreferredFoot(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </div>
        </div>

        {/*
         * .kgm-results
         * overflow-y:auto; flex:1; padding:16px 20px 20px
         */}
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-5">
          {/* .kgm-results-label: 9px; 700; tracking:.2em; uppercase; green; mb:10px */}
          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] mb-[10px]">
            Results
          </div>

          {/* .kgm-empty */}
          {isLoading && (
            <div className="text-center py-10 text-[12px] text-[rgba(255,255,255,0.25)] tracking-[0.1em]">
              Searching...
            </div>
          )}

          {/* .kgm-error */}
          {isError && (
            <div className="text-center py-10 text-[12px] text-[rgba(255,80,80,0.7)] tracking-[0.1em]">
              {error instanceof Error
                ? error.message
                : "Failed to fetch players"}
            </div>
          )}

          {!isLoading && !isError && players.length === 0 && (
            <div className="text-center py-10 text-[12px] text-[rgba(255,255,255,0.25)] tracking-[0.1em]">
              No players found — adjust filters
            </div>
          )}

          {!isLoading &&
            !isError &&
            players.map((p, idx) => {
              const isUsed = usedPlayerIds.has(p.id);
              return (
                /*
                 * .kgm-player-card
                 * display:flex; align-items:center; gap:12px; padding:10px 12px;
                 * border-radius:8px; background:rgba(36,39,35,0.6);
                 * border:1px solid rgba(71,72,69,0.15); margin-bottom:8px;
                 * cursor:pointer; transition:border-color .2s,background .2s,opacity .2s
                 *
                 * .kgm-player-card--used  → opacity:0.35; cursor:not-allowed
                 * :hover:not(--used)      → border rgba(0,255,102,0.3); bg rgba(0,255,102,0.04)
                 */
                <div
                  key={idx}
                  onClick={() => {
                    if (!isUsed)
                      onSelect(p as IPlayersResponse | IGoalKeeperResponse);
                  }}
                  className={[
                    "flex items-center gap-3 px-3 py-[10px] rounded-lg mb-2",
                    "bg-[rgba(36,39,35,0.6)] border border-[rgba(71,72,69,0.15)]",
                    "transition-[border-color,background,opacity] duration-200",
                    isUsed
                      ? "opacity-[0.35] cursor-not-allowed"
                      : "cursor-pointer hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.04)]",
                  ].join(" ")}
                >
                  {/*
                   * .kgm-player-avatar
                   * width:44px; height:44px; border-radius:6px; overflow:hidden;
                   * background:rgba(36,39,35,0.9); border:1px solid rgba(71,72,69,0.2);
                   * flex-shrink:0; display:flex; align-items:center; justify-content:center
                   */}
                  <div className="w-11 h-11 rounded-[6px] overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center">
                    {p.player_face_url ? (
                      /* img: width:100%; height:100%; object-fit:cover; object-position:top center */
                      <img
                        src={p.player_face_url}
                        alt={p.short_name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      /* .kgm-player-avatar-fallback: font-size:18px; color:rgba(0,255,102,0.3) */
                      <span className="material-symbols-outlined text-[18px] text-[rgba(0,255,102,0.3)]">
                        person
                      </span>
                    )}
                  </div>

                  {/* .kgm-player-info: flex:1; min-width:0 */}
                  <div className="flex-1 min-w-0">
                    {/* .kgm-player-name: 13px; font-weight:600; color:#fcfcf8; truncate */}
                    <div className="text-[13px] font-semibold text-[#fcfcf8] whitespace-nowrap overflow-hidden text-ellipsis">
                      {p.short_name}
                    </div>
                    {/* .kgm-player-meta: 10px; color rgba(255,255,255,0.35); mt:2px; tracking:.05em */}
                    <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.05em]">
                      {p.player_positions} · {p.club_name} · Age {p.age} ·{" "}
                      {p.preferred_foot} foot
                    </div>
                  </div>

                  {isUsed ? (
                    /*
                     * .kgm-used-badge
                     * 8px; 700; tracking:.15em; uppercase;
                     * color:rgba(255,100,100,0.7); bg:rgba(255,100,100,0.08);
                     * border:1px solid rgba(255,100,100,0.2); padding:2px 6px; border-radius:3px
                     */
                    <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-[rgba(255,100,100,0.7)] bg-[rgba(255,100,100,0.08)] border border-[rgba(255,100,100,0.2)] px-[6px] py-0.5 rounded-[3px] shrink-0">
                      In Squad
                    </span>
                  ) : (
                    /* .kgm-player-overall: Bebas Neue; 26px; color:#00ff66; line-height:1 */
                    <div className="font-[Bebas_Neue,sans-serif] text-[26px] text-[#00ff66] leading-none shrink-0">
                      {p.overall}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ─── Pitch row helpers ────────────────────────────────────────────────────────

function PitchRow({
  positions,
  rowIndex,
  onSlotClick,
  selectedPlayers,
}: {
  positions: string[];
  rowIndex: number;
  onSlotClick: (slotId: string, pos: string) => void;
  selectedPlayers: SelectedPlayers;
}) {
  /*
   * ≤3 slots → .kg-pitch-row--center
   *   display:flex; align-items:center; justify-content:center;
   *   gap varies: base 32px → md 56px
   *
   * >3 slots → .kg-pitch-row--spread
   *   display:flex; align-items:center; justify-content:space-between; padding:0 6px
   *   with .kg-pitch-inner-row { display:flex; gap:24px } md:gap:40px
   */
  if (positions.length <= 3) {
    return (
      <div className="flex items-center justify-center gap-8 md:gap-[56px]">
        {positions.map((pos, i) => {
          const slotId = `r${rowIndex}-c${i}-${pos}`;
          const player = selectedPlayers[slotId];
          return (
            <PlayerSlotButton
              key={slotId}
              position={pos}
              playerFaceUrl={player?.player_face_url}
              playerName={player?.short_name}
              onClick={() => onSlotClick(slotId, pos)}
            />
          );
        })}
      </div>
    );
  }

  const [left, ...rest] = positions;
  const right = rest[rest.length - 1];
  const inner = rest.slice(0, -1);
  const leftId = `r${rowIndex}-c0-${left}`;
  const rightId = `r${rowIndex}-c${positions.length - 1}-${right}`;

  return (
    <div className="flex items-center justify-between px-[6px]">
      <PlayerSlotButton
        position={left}
        playerFaceUrl={selectedPlayers[leftId]?.player_face_url}
        playerName={selectedPlayers[leftId]?.short_name}
        onClick={() => onSlotClick(leftId, left)}
      />
      <div className="flex gap-6 md:gap-10">
        {inner.map((pos, i) => {
          const slotId = `r${rowIndex}-c${i + 1}-${pos}`;
          const player = selectedPlayers[slotId];
          return (
            <PlayerSlotButton
              key={slotId}
              position={pos}
              playerFaceUrl={player?.player_face_url}
              playerName={player?.short_name}
              onClick={() => onSlotClick(slotId, pos)}
            />
          );
        })}
      </div>
      <PlayerSlotButton
        position={right}
        playerFaceUrl={selectedPlayers[rightId]?.player_face_url}
        playerName={selectedPlayers[rightId]?.short_name}
        onClick={() => onSlotClick(rightId, right)}
      />
    </div>
  );
}

function Pitch({
  formation,
  onSlotClick,
  selectedPlayers,
}: {
  formation: Formation;
  onSlotClick: (slotId: string, pos: string) => void;
  selectedPlayers: SelectedPlayers;
}) {
  const gkPlayer = selectedPlayers["GK"];

  return (
    /*
     * .kg-pitch-wrap: flex:1; min-width:0
     */
    <section className="flex-1 min-w-0">
      {/*
       * .kg-pitch
       * position:relative; width:100%; aspect-ratio:3/4;
       * background:radial-gradient(circle at center,#181a17 0%,#0d0f0c 100%);
       * border-radius:16px; overflow:hidden;
       * border:1px solid rgba(0,255,102,0.06);
       * box-shadow:0 24px 64px rgba(0,0,0,0.6)
       */}
      <div className="relative w-full aspect-[3/4] bg-[radial-gradient(circle_at_center,#181a17_0%,#0d0f0c_100%)] rounded-2xl overflow-hidden border border-[rgba(0,255,102,0.06)] shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        {/* .kg-pitch-border: position:absolute; inset:16px; border:1px solid rgba(0,255,102,0.15) */}
        <div className="absolute inset-4 border border-[rgba(0,255,102,0.15)] pointer-events-none" />

        {/*
         * .kg-pitch-penalty-top
         * position:absolute; left:16px; right:16px; top:16px; height:25%;
         * border-bottom:1px solid rgba(0,255,102,0.15)
         */}
        <div className="absolute left-4 right-4 top-4 h-1/4 border-b border-[rgba(0,255,102,0.15)] pointer-events-none" />

        {/* .kg-pitch-penalty-bottom */}
        <div className="absolute left-4 right-4 bottom-4 h-1/4 border-t border-[rgba(0,255,102,0.15)] pointer-events-none" />

        {/*
         * .kg-pitch-box-top
         * top:16px; left:50%; translateX(-50%); width:33%; height:16.666%;
         * border-left/right/bottom:1px solid rgba(0,255,102,0.15)
         */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/3 h-[16.666%] border-l border-r border-b border-[rgba(0,255,102,0.15)] pointer-events-none" />

        {/* .kg-pitch-box-bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-[16.666%] border-l border-r border-t border-[rgba(0,255,102,0.15)] pointer-events-none" />

        {/*
         * .kg-pitch-halfway
         * top:50%; left:16px; right:16px; height:1px;
         * background:rgba(0,255,102,0.15); translateY(-50%)
         */}
        <div className="absolute top-1/2 left-4 right-4 h-px -translate-y-1/2 bg-[rgba(0,255,102,0.15)] pointer-events-none" />

        {/*
         * .kg-pitch-circle
         * top:50%; left:50%; width:100px; height:100px; border-radius:50%;
         * border:1px solid rgba(0,255,102,0.15); translate(-50%,-50%)
         */}
        <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full border border-[rgba(0,255,102,0.15)] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/*
         * .kg-pitch-grid
         * position:absolute; inset:0; display:grid;
         * padding:36px 20px 80px; gap:6px;
         * gridTemplateRows: repeat(N, 1fr)
         */}
        <div
          className="absolute inset-0 grid pt-9 px-5 pb-20 gap-1.5"
          style={{ gridTemplateRows: `repeat(${formation.rows.length}, 1fr)` }}
        >
          {formation.rows.map((row, i) => (
            <PitchRow
              key={`${formation.id}-${i}`}
              positions={row}
              rowIndex={i}
              onSlotClick={onSlotClick}
              selectedPlayers={selectedPlayers}
            />
          ))}
        </div>

        {/* .kg-pitch-gk: position:absolute; bottom:12px; left:50%; translateX(-50%) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <PlayerSlotButton
            position="GK"
            isGK
            playerFaceUrl={gkPlayer?.player_face_url}
            playerName={gkPlayer?.short_name}
            onClick={() => onSlotClick("GK", "GK")}
          />
        </div>

        {/*
         * .kg-pitch-hud: position:absolute; top:16px; right:16px; text-align:right
         * .kg-hud-formation: Bebas Neue; 40px; color:rgba(0,255,102,0.07); line-height:1
         */}
        <div className="absolute top-4 right-4 text-right pointer-events-none">
          <div className="font-[Bebas_Neue,sans-serif] text-[40px] text-[rgba(0,255,102,0.07)] leading-none">
            {formation.label}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Rating Bar ───────────────────────────────────────────────────────────────

function RatingBar({
  label,
  value,
  filled,
}: {
  label: string;
  value: number | null;
  filled: boolean;
}) {
  const display = value !== null ? Math.round(value) : "–";
  const pct = value !== null ? Math.min(value, 100) : 0;

  return (
    /*
     * .kg-stat-bar: display:flex; flex-direction:column; gap:8px
     */
    <div className="flex flex-col gap-2">
      {/*
       * .kg-stat-bar-header
       * display:flex; justify-content:space-between; margin-bottom:4px;
       * font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase
       */}
      <div className="flex justify-between items-center mb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
        {/* .kg-stat-bar-label: color rgba(255,255,255,0.38) */}
        <span className="text-[rgba(255,255,255,0.38)]">{label}</span>
        {/* .kg-stat-bar-value: color dynamic */}
        <span
          className={filled ? "text-[#00ff66]" : "text-[rgba(255,255,255,0.2)]"}
        >
          {display}
        </span>
      </div>
      {/*
       * .kg-stat-bar-track
       * height:3px; background:#242723; border-radius:2px; overflow:hidden
       */}
      <div className="h-[3px] bg-[#242723] rounded-[2px] overflow-hidden">
        {/*
         * .kg-stat-bar-fill
         * height:100%; border-radius:2px;
         * transition:width 0.55s cubic-bezier(0.4,0,0.2,1)
         * background: filled ? #00ff66 : rgba(255,255,255,0.06)
         */}
        <div
          className={[
            "h-full rounded-[2px] transition-[width] duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            filled ? "bg-[#00ff66]" : "bg-[rgba(255,255,255,0.06)]",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DreamTeamPage() {
  const [activeId, setActiveId] = useState<string>("4-4-2");
  const [pickerSlot, setPickerSlot] = useState<{
    id: string;
    pos: string;
  } | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayers>({});

  const active = FORMATIONS.find((f) => f.id === activeId)!;

  const totalSlots = useMemo(
    () => active.rows.reduce((s, r) => s + r.length, 0) + 1,
    [active],
  );
  const filledSlots = Object.values(selectedPlayers).filter(Boolean).length;
  const isComplete = filledSlots === totalSlots;

  const usedPlayerIds = useMemo(() => {
    const ids = new Set<number>();
    Object.entries(selectedPlayers).forEach(([slotId, p]) => {
      if (p && slotId !== pickerSlot?.id) ids.add(p.id);
    });
    return ids;
  }, [selectedPlayers, pickerSlot]);

  const ratings = useMemo(() => {
    const buckets: Record<"attack" | "midfield" | "defense", number[]> = {
      attack: [],
      midfield: [],
      defense: [],
    };
    let gkOverall: number | null = null;
    const gk = selectedPlayers["GK"];
    if (gk) gkOverall = gk.overall;

    Object.entries(selectedPlayers).forEach(([slotId, player]) => {
      if (!player || slotId === "GK") return;
      const pos = slotId.split("-").pop() ?? "";
      const cat = categorizePosition(pos);
      if (cat !== "gk") buckets[cat].push(player.overall);
    });

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    const attack = avg(buckets.attack);
    const midfield = avg(buckets.midfield);
    const defense = avg(buckets.defense);
    const all = [
      ...buckets.attack,
      ...buckets.midfield,
      ...buckets.defense,
      ...(gkOverall !== null ? [gkOverall] : []),
    ];
    return { attack, midfield, defense, gkOverall, total: avg(all) };
  }, [selectedPlayers]);

  const handleSlotClick = (id: string, pos: string) =>
    setPickerSlot({ id, pos });

  const handlePlayerSelect = (
    player: IPlayersResponse | IGoalKeeperResponse,
  ) => {
    if (!pickerSlot) return;
    setSelectedPlayers((prev) => ({ ...prev, [pickerSlot.id]: player }));
    setPickerSlot(null);
  };

  const handleCreateDreamTeam = () => {
    const squad = Object.entries(selectedPlayers)
      .filter(([, p]) => p)
      .map(([slotId, player]) => ({ slotId, player }));
    console.log("Dream Team:", squad);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oxanium:wght@300;400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/*
       * .kg-wrap
       * --surface:#121411; --surface-hi:#1e201d; --surface-max:#242723; --green:#00ff66
       * font-family:Oxanium; color:#fcfcf8;
       * display:flex; flex-direction:column; gap:20px; width:100%; height:100%
       * @lg → flex-direction:row; align-items:flex-start
       */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-5 w-full h-full font-[Oxanium,sans-serif] text-[#fcfcf8]">
        {/*
         * .kg-left
         * display:flex; flex-direction:column; gap:12px
         * @lg: width:33.333%; flex-shrink:0
         */}
        <div className="flex flex-col gap-3 lg:w-1/3 lg:shrink-0">
          {/* Title block */}
          <div>
            {/*
             * .kg-page-title
             * Bebas Neue; 42px; tracking:-0.01em; line-height:.92; uppercase
             */}
            <h1 className="font-[Bebas_Neue,sans-serif] text-[42px] leading-[0.92] tracking-[-0.01em] uppercase">
              DREAM TEAM
            </h1>
            {/*
             * .kg-page-subtitle
             * 12px; color:#aaaba7; line-height:1.4; margin-top:5px; max-width:280px
             */}
            <p className="text-[12px] text-[#aaaba7] leading-[1.4] mt-[5px] max-w-[280px]">
              Assemble your ideal team and rise to the top.
            </p>
          </div>

          {/*
           * Formation Picker — .kg-panel
           * background:#121411; padding:14px; border-radius:12px;
           * border:1px solid rgba(71,72,69,0.12)
           */}
          <div className="bg-[#121411] p-[14px] rounded-xl border border-[rgba(71,72,69,0.12)]">
            {/*
             * .kg-panel-title
             * 10px; 700; tracking:.24em; uppercase; color:#00ff66; margin-bottom:10px
             */}
            <h3 className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#00ff66] mb-[10px]">
              Select Formation
            </h3>
            {/* .kg-formation-grid: grid 1fr 1fr; gap:8px */}
            <div className="grid grid-cols-2 gap-2">
              {FORMATIONS.map((f) => {
                const isActive = f.id === activeId;
                return (
                  /*
                   * .kg-formation-btn
                   * flex-col; items-center; gap:3px; padding:10px 12px; border-radius:4px;
                   * bg:#1e201d; border:1px transparent;
                   * transition:background .2s, border-color .2s, transform .15s; cursor:pointer
                   * :hover → bg:#242723; translateY(-1px)
                   * --active → bg:#242723; border:rgba(0,255,102,.45); shadow
                   */
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveId(f.id);
                      setSelectedPlayers({});
                    }}
                    aria-pressed={isActive}
                    className={[
                      "flex flex-col items-center gap-[3px] px-3 py-[10px] rounded-[4px] border",
                      "font-[Oxanium,sans-serif] cursor-pointer",
                      "transition-[background,border-color,transform] duration-200",
                      isActive
                        ? "bg-[#242723] border-[rgba(0,255,102,0.45)] shadow-[0_0_12px_rgba(0,255,102,0.1)]"
                        : "bg-[#1e201d] border-transparent hover:bg-[#242723] hover:-translate-y-px",
                    ].join(" ")}
                  >
                    {/*
                     * .kg-formation-label
                     * Bebas Neue; 19px; tracking:.04em;
                     * inactive → rgba(255,255,255,0.42) | active → #00ff66
                     */}
                    <span
                      className={[
                        "font-[Bebas_Neue,sans-serif] text-[19px] tracking-[0.04em] transition-colors duration-200",
                        isActive
                          ? "text-[#00ff66]"
                          : "text-[rgba(255,255,255,0.42)]",
                      ].join(" ")}
                    >
                      {f.label}
                    </span>
                    {/* .kg-formation-desc: 9px; 700; tracking:.16em; rgba(255,255,255,0.28) */}
                    <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-[rgba(255,255,255,0.28)]">
                      {f.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Squad Analysis — .kg-panel */}
          <div className="bg-[#121411] p-[14px] rounded-xl border border-[rgba(71,72,69,0.12)]">
            <h3 className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#00ff66] mb-[10px]">
              Squad Analysis
            </h3>

            {/* .kg-stat-bars: flex-col; gap:8px */}
            <div className="flex flex-col gap-2">
              <RatingBar
                label="Attack Rating"
                value={ratings.attack}
                filled={ratings.attack !== null}
              />
              <RatingBar
                label="Midfield Rating"
                value={ratings.midfield}
                filled={ratings.midfield !== null}
              />
              <RatingBar
                label="Defense Rating"
                value={ratings.defense}
                filled={ratings.defense !== null}
              />
              <RatingBar
                label="GK Rating"
                value={ratings.gkOverall}
                filled={ratings.gkOverall !== null}
              />
            </div>

            {/*
             * .kg-analysis-footer
             * display:flex; justify-content:space-between; align-items:center;
             * margin-top:12px; padding-top:12px; border-top:1px solid rgba(71,72,69,0.12)
             */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[rgba(71,72,69,0.12)]">
              <div>
                {/*
                 * .kg-score: display:block; Bebas Neue; 26px; line-height:1;
                 * filled → #00ff66 | empty → rgba(255,255,255,0.2)
                 */}
                <span
                  className={[
                    "block font-[Bebas_Neue,sans-serif] text-[26px] leading-none",
                    ratings.total !== null
                      ? "text-[#00ff66]"
                      : "text-[rgba(255,255,255,0.2)]",
                  ].join(" ")}
                >
                  {ratings.total !== null ? Math.round(ratings.total) : "–"}
                </span>
                {/* .kg-score-label: 9px; 700; tracking:.14em; white/30; mt:3px */}
                <span className="block text-[9px] font-bold tracking-[0.14em] uppercase text-[rgba(255,255,255,0.3)] mt-[3px]">
                  Total Rating
                </span>
              </div>
              <div className="text-right">
                {/* .kg-grade: Bebas Neue; 26px; #00ff66 */}
                <span className="block font-[Bebas_Neue,sans-serif] text-[26px] leading-none text-[#00ff66]">
                  {active.tacticalFit}
                </span>
                <span className="block text-[9px] font-bold tracking-[0.14em] uppercase text-[rgba(255,255,255,0.3)] mt-[3px]">
                  Tactical Fit
                </span>
              </div>
            </div>

            {/* Progress — mt:12px; pt:12px; border-top */}
            <div className="mt-3 pt-3 border-t border-[rgba(71,72,69,0.12)]">
              {/*
               * .kg-progress-header
               * flex; justify-between; 9px; 700; tracking:.18em; uppercase; mb:5px
               */}
              <div className="flex justify-between text-[9px] font-bold tracking-[0.18em] uppercase mb-[5px]">
                {/* .kg-progress-label: white/30 */}
                <span className="text-[rgba(255,255,255,0.3)]">
                  Players Selected
                </span>
                <span
                  className={
                    isComplete
                      ? "text-[#00ff66]"
                      : "text-[rgba(255,255,255,0.4)]"
                  }
                >
                  {filledSlots} / {totalSlots}
                </span>
              </div>
              {/* .kg-progress-track: height:2px; bg:#242723; border-radius:2px; overflow:hidden */}
              <div className="h-[2px] bg-[#242723] rounded-[2px] overflow-hidden">
                {/* .kg-progress-fill: bg:#00ff66; transition:width .4s cubic */}
                <div
                  className="h-full bg-[#00ff66] rounded-[2px] transition-[width] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Create Dream Team CTA */}
          <CreateDreamTeamButton
            onClick={handleCreateDreamTeam}
            disabled={!isComplete}
            filledSlots={filledSlots}
            totalSlots={totalSlots}
          />
        </div>

        {/* Pitch */}
        <Pitch
          key={activeId}
          formation={active}
          onSlotClick={handleSlotClick}
          selectedPlayers={selectedPlayers}
        />
      </div>

      {pickerSlot && (
        <PlayerPickerModal
          slotPosition={pickerSlot.pos}
          isGK={pickerSlot.pos === "GK"}
          onClose={() => setPickerSlot(null)}
          onSelect={handlePlayerSelect}
          usedPlayerIds={usedPlayerIds}
        />
      )}
    </>
  );
}
