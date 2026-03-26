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
    <>
      <style>{`
        .kgm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:kgm-fade-in 0.2s ease}
        @keyframes kgm-fade-in{from{opacity:0}to{opacity:1}}
        .kgm-modal{background:rgba(18,20,17,0.92);border:1px solid rgba(0,255,102,0.15);border-radius:16px;width:min(680px,95vw);max-height:85vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.7);animation:kgm-slide-up 0.25s ease}
        @keyframes kgm-slide-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .kgm-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(71,72,69,0.2);flex-shrink:0}
        .kgm-title{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#fcfcf8;letter-spacing:.04em}
        .kgm-slot-badge{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#00ff66;background:rgba(0,255,102,0.08);border:1px solid rgba(0,255,102,0.2);padding:4px 10px;border-radius:4px}
        .kgm-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.4);font-size:20px;transition:color .2s;padding:4px;line-height:1}
        .kgm-close:hover{color:#fff}
        .kgm-filters{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:16px 20px;border-bottom:1px solid rgba(71,72,69,0.2);flex-shrink:0}
        .kgm-filter-group{display:flex;flex-direction:column;gap:5px}
        .kgm-filter-group--full{grid-column:1/-1}
        .kgm-label{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
        .kgm-input{background:rgba(36,39,35,0.8);border:1px solid rgba(71,72,69,0.3);border-radius:6px;padding:8px 10px;font-family:'Oxanium',sans-serif;font-size:12px;color:#fcfcf8;outline:none;transition:border-color .2s;width:100%;box-sizing:border-box}
        .kgm-input:focus{border-color:rgba(0,255,102,0.4)}
        .kgm-input::placeholder{color:rgba(255,255,255,0.2)}
        .kgm-range-row{display:flex;gap:6px;align-items:center}
        .kgm-range-sep{color:rgba(255,255,255,0.2);font-size:11px}
        .kgm-select{background:rgba(36,39,35,0.8);border:1px solid rgba(71,72,69,0.3);border-radius:6px;padding:8px 10px;font-family:'Oxanium',sans-serif;font-size:12px;color:#fcfcf8;outline:none;transition:border-color .2s;width:100%;appearance:none;cursor:pointer}
        .kgm-select:focus{border-color:rgba(0,255,102,0.4)}
        .kgm-results{overflow-y:auto;flex:1;padding:16px 20px 20px}
        .kgm-results-label{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#00ff66;margin-bottom:10px}
        .kgm-empty{text-align:center;padding:40px 0;font-size:12px;color:rgba(255,255,255,0.25);letter-spacing:.1em}
        .kgm-error{text-align:center;padding:40px 0;font-size:12px;color:rgba(255,80,80,0.7);letter-spacing:.1em}
        .kgm-player-card{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;background:rgba(36,39,35,0.6);border:1px solid rgba(71,72,69,0.15);margin-bottom:8px;cursor:pointer;transition:border-color .2s,background .2s,opacity .2s}
        .kgm-player-card:hover:not(.kgm-player-card--used){border-color:rgba(0,255,102,0.3);background:rgba(0,255,102,0.04)}
        .kgm-player-card--used{opacity:0.35;cursor:not-allowed}
        .kgm-player-avatar{width:44px;height:44px;border-radius:6px;overflow:hidden;background:rgba(36,39,35,0.9);border:1px solid rgba(71,72,69,0.2);flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .kgm-player-avatar img{width:100%;height:100%;object-fit:cover;object-position:top center}
        .kgm-player-avatar-fallback{font-size:18px;color:rgba(0,255,102,0.3)}
        .kgm-player-info{flex:1;min-width:0}
        .kgm-player-name{font-size:13px;font-weight:600;color:#fcfcf8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .kgm-player-meta{font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px;letter-spacing:.05em}
        .kgm-player-overall{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#00ff66;line-height:1;flex-shrink:0}
        .kgm-used-badge{font-size:8px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,100,100,0.7);background:rgba(255,100,100,0.08);border:1px solid rgba(255,100,100,0.2);padding:2px 6px;border-radius:3px;flex-shrink:0}
      `}</style>

      <div className="kgm-overlay" onClick={onClose}>
        <div className="kgm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="kgm-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="kgm-title">Select Player</span>
              <span className="kgm-slot-badge">{slotPosition}</span>
            </div>
            <button className="kgm-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="kgm-filters">
            <div className="kgm-filter-group kgm-filter-group--full">
              <span className="kgm-label">Player Name</span>
              <input
                className="kgm-input"
                placeholder="Search by name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="kgm-filter-group kgm-filter-group--full">
              <span className="kgm-label">Team ID</span>
              <input
                className="kgm-input"
                type="number"
                placeholder="Enter team ID..."
                value={teamId ?? ""}
                onChange={(e) =>
                  setTeamId(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
            <div className="kgm-filter-group">
              <span className="kgm-label">Position</span>
              <input
                className="kgm-input"
                placeholder="e.g. ST, CM, GK"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="kgm-filter-group">
              <span className="kgm-label">Nationality</span>
              <input
                className="kgm-input"
                placeholder="e.g. Brazil"
                value={nationalityName}
                onChange={(e) => setNationalityName(e.target.value)}
              />
            </div>
            <div className="kgm-filter-group">
              <span className="kgm-label">Overall Rating</span>
              <div className="kgm-range-row">
                <input
                  className="kgm-input"
                  type="number"
                  placeholder="Min"
                  value={minOverall ?? ""}
                  onChange={(e) =>
                    setMinOverall(e.target.value ? +e.target.value : undefined)
                  }
                />
                <span className="kgm-range-sep">–</span>
                <input
                  className="kgm-input"
                  type="number"
                  placeholder="Max"
                  value={maxOverall ?? ""}
                  onChange={(e) =>
                    setMaxOverall(e.target.value ? +e.target.value : undefined)
                  }
                />
              </div>
            </div>
            <div className="kgm-filter-group">
              <span className="kgm-label">Age</span>
              <div className="kgm-range-row">
                <input
                  className="kgm-input"
                  type="number"
                  placeholder="Min"
                  value={minAge ?? ""}
                  onChange={(e) =>
                    setMinAge(e.target.value ? +e.target.value : undefined)
                  }
                />
                <span className="kgm-range-sep">–</span>
                <input
                  className="kgm-input"
                  type="number"
                  placeholder="Max"
                  value={maxAge ?? ""}
                  onChange={(e) =>
                    setMaxAge(e.target.value ? +e.target.value : undefined)
                  }
                />
              </div>
            </div>
            <div className="kgm-filter-group">
              <span className="kgm-label">Preferred Foot</span>
              <select
                className="kgm-select"
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>
            </div>
          </div>

          <div className="kgm-results">
            <div className="kgm-results-label">Results</div>
            {isLoading && <div className="kgm-empty">Searching...</div>}
            {isError && (
              <div className="kgm-error">
                {error instanceof Error
                  ? error.message
                  : "Failed to fetch players"}
              </div>
            )}
            {!isLoading && !isError && players.length === 0 && (
              <div className="kgm-empty">No players found — adjust filters</div>
            )}
            {!isLoading &&
              !isError &&
              players.map((p, idx) => {
                const isUsed = usedPlayerIds.has(p.id);
                return (
                  <div
                    key={idx}
                    className={`kgm-player-card${isUsed ? " kgm-player-card--used" : ""}`}
                    onClick={() => {
                      if (!isUsed)
                        onSelect(p as IPlayersResponse | IGoalKeeperResponse);
                    }}
                  >
                    <div className="kgm-player-avatar">
                      {p.player_face_url ? (
                        <img
                          src={p.player_face_url}
                          alt={p.short_name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="material-symbols-outlined kgm-player-avatar-fallback">
                          person
                        </span>
                      )}
                    </div>
                    <div className="kgm-player-info">
                      <div className="kgm-player-name">{p.short_name}</div>
                      <div className="kgm-player-meta">
                        {p.player_positions} · {p.club_name} · Age {p.age} ·{" "}
                        {p.preferred_foot} foot
                      </div>
                    </div>
                    {isUsed ? (
                      <span className="kgm-used-badge">In Squad</span>
                    ) : (
                      <div className="kgm-player-overall">{p.overall}</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Pitch helpers ────────────────────────────────────────────────────────────

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
  if (positions.length <= 3) {
    return (
      <div className="kg-pitch-row kg-pitch-row--center">
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
    <div className="kg-pitch-row kg-pitch-row--spread">
      <PlayerSlotButton
        position={left}
        playerFaceUrl={selectedPlayers[leftId]?.player_face_url}
        playerName={selectedPlayers[leftId]?.short_name}
        onClick={() => onSlotClick(leftId, left)}
      />
      <div className="kg-pitch-inner-row">
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
    <section className="kg-pitch-wrap">
      <div className="kg-pitch">
        <div className="kg-pitch-border" style={{ pointerEvents: "none" }} />
        <div
          className="kg-pitch-penalty-top"
          style={{ pointerEvents: "none" }}
        />
        <div
          className="kg-pitch-penalty-bottom"
          style={{ pointerEvents: "none" }}
        />
        <div className="kg-pitch-box-top" style={{ pointerEvents: "none" }} />
        <div
          className="kg-pitch-box-bottom"
          style={{ pointerEvents: "none" }}
        />
        <div className="kg-pitch-halfway" style={{ pointerEvents: "none" }} />
        <div className="kg-pitch-circle" style={{ pointerEvents: "none" }} />
        <div
          className="kg-pitch-grid"
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
        <div className="kg-pitch-gk">
          <PlayerSlotButton
            position="GK"
            isGK
            playerFaceUrl={gkPlayer?.player_face_url}
            playerName={gkPlayer?.short_name}
            onClick={() => onSlotClick("GK", "GK")}
          />
        </div>
        <div className="kg-pitch-hud">
          <div className="kg-hud-formation">{formation.label}</div>
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
    <div className="kg-stat-bar">
      <div className="kg-stat-bar-header">
        <span className="kg-stat-bar-label">{label}</span>
        <span
          className="kg-stat-bar-value"
          style={{ color: filled ? "var(--green)" : "rgba(255,255,255,0.2)" }}
        >
          {display}
        </span>
      </div>
      <div className="kg-stat-bar-track">
        <div
          className="kg-stat-bar-fill"
          style={{
            width: `${pct}%`,
            background: filled ? "var(--green)" : "rgba(255,255,255,0.06)",
          }}
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

  // Total slots for this formation (outfield + GK)
  const totalSlots = useMemo(
    () => active.rows.reduce((s, r) => s + r.length, 0) + 1,
    [active],
  );
  const filledSlots = Object.values(selectedPlayers).filter(Boolean).length;
  const isComplete = filledSlots === totalSlots;

  // IDs already in the squad — excluding the slot currently being picked so user can swap
  const usedPlayerIds = useMemo(() => {
    const ids = new Set<number>();
    Object.entries(selectedPlayers).forEach(([slotId, p]) => {
      if (p && slotId !== pickerSlot?.id) ids.add(p.id);
    });
    return ids;
  }, [selectedPlayers, pickerSlot]);

  // Live ratings computed from players' overall values
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
    const total = avg(all);

    return { attack, midfield, defense, gkOverall, total };
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
    // TODO: wire to your API / route
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

      <style>{`
        .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';font-style:normal;display:inline-block;line-height:1;white-space:nowrap}
        .kg-wrap{--surface:#121411;--surface-hi:#1e201d;--surface-max:#242723;--green:#00ff66;--pitch-line:rgba(0,255,102,0.15);--text:#fcfcf8;--fd:'Bebas Neue',sans-serif;--fb:'Oxanium',sans-serif;font-family:var(--fb);color:var(--text);display:flex;flex-direction:column;gap:20px;width:100%;height:100%}
        @media(min-width:1024px){.kg-wrap{flex-direction:row;align-items:flex-start}}
        .kg-page-title{font-family:var(--fd);font-size:42px;letter-spacing:-.01em;line-height:.92;text-transform:uppercase}
        .kg-page-subtitle{font-size:12px;color:#aaaba7;line-height:1.4;margin-top:5px;max-width:280px}
        .kg-left{display:flex;flex-direction:column;gap:12px}
        @media(min-width:1024px){.kg-left{width:33.333%;flex-shrink:0}}
        .kg-panel{background:var(--surface);padding:14px;border-radius:12px;border:1px solid rgba(71,72,69,.12)}
        .kg-panel-title{font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--green);margin-bottom:10px}
        .kg-formation-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .kg-formation-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 12px;border-radius:4px;background:var(--surface-hi);border:1px solid transparent;transition:background .2s,border-color .2s,transform .15s;cursor:pointer;font-family:inherit;color:inherit}
        .kg-formation-btn:hover{background:var(--surface-max);transform:translateY(-1px)}
        .kg-formation-btn--active{background:var(--surface-max);border-color:rgba(0,255,102,.45);box-shadow:0 0 12px rgba(0,255,102,.1)}
        .kg-formation-label{font-family:var(--fd);font-size:19px;letter-spacing:.04em;color:rgba(255,255,255,.42);transition:color .2s}
        .kg-formation-btn--active .kg-formation-label{color:var(--green)}
        .kg-formation-desc{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.28)}
        .kg-stat-bars{display:flex;flex-direction:column;gap:8px}
        .kg-stat-bar-header{display:flex;justify-content:space-between;margin-bottom:4px;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
        .kg-stat-bar-label{color:rgba(255,255,255,.38)}
        .kg-stat-bar-track{height:3px;background:var(--surface-max);border-radius:2px;overflow:hidden}
        .kg-stat-bar-fill{height:100%;border-radius:2px;transition:width 0.55s cubic-bezier(0.4,0,0.2,1)}
        .kg-analysis-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid rgba(71,72,69,.12)}
        .kg-score{display:block;font-family:var(--fd);font-size:26px;line-height:1}
        .kg-grade{display:block;font-family:var(--fd);font-size:26px;color:var(--green);line-height:1}
        .kg-score-label{display:block;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:3px}
        .kg-analysis-footer-right{text-align:right}
        .kg-progress-header{display:flex;justify-content:space-between;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:5px}
        .kg-progress-label{color:rgba(255,255,255,.3)}
        .kg-progress-track{height:2px;background:var(--surface-max);border-radius:2px;overflow:hidden}
        .kg-progress-fill{height:100%;border-radius:2px;background:var(--green);transition:width .4s cubic-bezier(0.4,0,0.2,1)}
        .kg-pitch-wrap{flex:1;min-width:0}
        .kg-pitch{position:relative;width:100%;aspect-ratio:3/4;background:radial-gradient(circle at center,#181a17 0%,#0d0f0c 100%);border-radius:16px;overflow:hidden;border:1px solid rgba(0,255,102,.06);box-shadow:0 24px 64px rgba(0,0,0,.6)}
        .kg-pitch-border{position:absolute;inset:16px;border:1px solid var(--pitch-line)}
        .kg-pitch-penalty-top{position:absolute;left:16px;right:16px;top:16px;height:25%;border-bottom:1px solid var(--pitch-line)}
        .kg-pitch-penalty-bottom{position:absolute;left:16px;right:16px;bottom:16px;height:25%;border-top:1px solid var(--pitch-line)}
        .kg-pitch-box-top{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:33%;height:16.666%;border-left:1px solid var(--pitch-line);border-right:1px solid var(--pitch-line);border-bottom:1px solid var(--pitch-line)}
        .kg-pitch-box-bottom{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);width:33%;height:16.666%;border-left:1px solid var(--pitch-line);border-right:1px solid var(--pitch-line);border-top:1px solid var(--pitch-line)}
        .kg-pitch-halfway{position:absolute;top:50%;left:16px;right:16px;height:1px;background:var(--pitch-line);transform:translateY(-50%)}
        .kg-pitch-circle{position:absolute;top:50%;left:50%;width:100px;height:100px;border-radius:50%;border:1px solid var(--pitch-line);transform:translate(-50%,-50%)}
        .kg-pitch-grid{position:absolute;inset:0;display:grid;padding:36px 20px 80px;gap:6px}
        .kg-pitch-row{display:flex;align-items:center}
        .kg-pitch-row--center{justify-content:center;gap:32px}
        .kg-pitch-row--spread{justify-content:space-between;padding:0 6px}
        .kg-pitch-inner-row{display:flex;gap:24px}
        @media(min-width:768px){.kg-pitch-row--center{gap:56px}.kg-pitch-inner-row{gap:40px}}
        .kg-pitch-gk{position:absolute;bottom:12px;left:50%;transform:translateX(-50%)}
        .kg-slot{width:46px;height:58px;background:var(--surface-max);border:1px solid rgba(0,255,102,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;flex-shrink:0;transition:border-color .2s,background .2s,transform .2s;animation:slot-in 0.3s ease both;position:relative;overflow:hidden;border-radius:4px;padding:0}
        @keyframes slot-in{from{opacity:0;transform:scale(.82) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .kg-slot:hover{border-color:var(--green);background:rgba(0,255,102,.05);transform:translateY(-2px)}
        @media(min-width:768px){.kg-slot{width:60px;height:74px}}
        .kg-slot--gk{border-style:dashed;border-color:var(--green)}
        .kg-slot--filled{border-color:rgba(0,255,102,.5)}
        .kg-slot--filled:hover{border-color:var(--green);transform:translateY(-2px) scale(1.04)}
        .kg-slot-icon{font-size:16px;color:rgba(0,255,102,.35);transition:color .2s}
        .kg-slot:hover .kg-slot-icon,.kg-slot-icon--gk{color:var(--green)}
        .kg-slot-label{font-size:7px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.3)}
        .kg-slot-label--gk{color:var(--green)}
        .kg-pitch-hud{position:absolute;top:16px;right:16px;text-align:right}
        .kg-hud-formation{font-family:var(--fd);font-size:40px;color:rgba(0,255,102,.07);line-height:1}
      `}</style>

      <div className="kg-wrap">
        <div className="kg-left">
          <div>
            <h1 className="kg-page-title">DREAM TEAM</h1>
            <p className="kg-page-subtitle">
              Assemble your ideal team and rise to the top.
            </p>
          </div>

          {/* Formation picker */}
          <div className="kg-panel">
            <h3 className="kg-panel-title">Select Formation</h3>
            <div className="kg-formation-grid">
              {FORMATIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveId(f.id);
                    setSelectedPlayers({});
                  }}
                  className={`kg-formation-btn${f.id === activeId ? " kg-formation-btn--active" : ""}`}
                  aria-pressed={f.id === activeId}
                >
                  <span className="kg-formation-label">{f.label}</span>
                  <span className="kg-formation-desc">{f.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Squad Analysis */}
          <div className="kg-panel">
            <h3 className="kg-panel-title">Squad Analysis</h3>
            <div className="kg-stat-bars">
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
            <div className="kg-analysis-footer">
              <div>
                <span
                  className="kg-score"
                  style={{
                    color:
                      ratings.total !== null
                        ? "var(--green)"
                        : "rgba(255,255,255,0.2)",
                  }}
                >
                  {ratings.total !== null ? Math.round(ratings.total) : "–"}
                </span>
                <span className="kg-score-label">Total Rating</span>
              </div>
              <div className="kg-analysis-footer-right">
                <span className="kg-grade">{active.tacticalFit}</span>
                <span className="kg-score-label">Tactical Fit</span>
              </div>
            </div>

            {/* Fill progress */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid rgba(71,72,69,.12)",
              }}
            >
              <div className="kg-progress-header">
                <span className="kg-progress-label">Players Selected</span>
                <span
                  style={{
                    color: isComplete ? "var(--green)" : "rgba(255,255,255,.4)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {filledSlots} / {totalSlots}
                </span>
              </div>
              <div className="kg-progress-track">
                <div
                  className="kg-progress-fill"
                  style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Create Dream Team */}
          <CreateDreamTeamButton
            onClick={handleCreateDreamTeam}
            disabled={!isComplete}
            filledSlots={filledSlots}
            totalSlots={totalSlots}
          />
        </div>

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
