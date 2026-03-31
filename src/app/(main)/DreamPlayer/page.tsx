"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Share2,
  Dumbbell,
  Zap,
  Footprints,
  Target,
  Shield,
  Flag,
  Hash,
  Star,
  Plus,
  User,
  MapPin,
  ChevronDown,
} from "lucide-react";
import {
  useGetPlayers,
  IPlayersPayload,
  IPlayersResponse,
  IGoalKeeperResponse,
} from "@/features/main/dashboard";
import { useGetGoalkeepers } from "@/features/main/dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatKey =
  | "pace"
  | "shooting"
  | "passing"
  | "dribbling"
  | "defending"
  | "physic";

interface PlayerIdentity {
  name: string;
  position: string;
  nationality: string;
  shirt_number: number;
  preferred_foot: "Left" | "Right";
}

interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
}

type SlotPlayers = Record<
  StatKey,
  (IPlayersResponse | IGoalKeeperResponse) | undefined
>;

// ─── Shared primitives (mirrors DreamTeam exactly) ────────────────────────────

const INPUT =
  "w-full box-border bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,255,102,0.4)]";

const LABEL =
  "text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.35)]";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_IDENTITY: PlayerIdentity = {
  name: "Your Player",
  position: "ST",
  nationality: "---",
  shirt_number: 7,
  preferred_foot: "Right",
};

const DEFAULT_STATS: PlayerStats = {
  pace: 0,
  shooting: 0,
  passing: 0,
  dribbling: 0,
  defending: 0,
  physic: 0,
};

const DEFAULT_SLOT_PLAYERS: SlotPlayers = {
  pace: undefined,
  shooting: undefined,
  passing: undefined,
  dribbling: undefined,
  defending: undefined,
  physic: undefined,
};

// The center image is fixed — it never changes regardless of player selection
const CENTER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNDEJWQe0nPD_yN1t2Hg1SBgMI-dAIRD8YTLy0R27wpcj-qDt6F9Jh5Rx-hsHGaUnBcXkDqIvu3mkWYPzEL_yaTkSTGZilhl7e3X3VO5c3ZB_KwDnNGYC4Cfvh8ZjEob0Q7iBpUhflT2BjJOzoCyJbIFh0nwwfLIS_GYsHlez0tj0ZUrp61mT4kX7fntmredK2TWLq8I8sOEMIm_xFoDPW9QJJca6OufWq1WbkMqm-TneaNm4aeCGydW9B8XHe-Fr2pk4H6jkbl4g";

const POSITIONS = [
  "ST",
  "CF",
  "LW",
  "RW",
  "LF",
  "RF",
  "SS",
  "CM",
  "CAM",
  "CDM",
  "LM",
  "RM",
  "DM",
  "AM",
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "SW",
];

// ─── Stat → backend field mapping ─────────────────────────────────────────────

const STAT_FIELD_MAP: Record<StatKey, keyof IPlayersResponse> = {
  pace: "pace",
  shooting: "shooting",
  passing: "passing",
  dribbling: "dribbling",
  defending: "defending",
  physic: "physic",
};

// ─── Countries ──────────────────
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// ─── Country picker function ────────────

function CountryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      COUNTRIES.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase()),
      ).slice(0, 30),
    [search],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Click to select country"
        className="font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] hover:text-[#00ff66] transition-colors duration-150 cursor-pointer truncate max-w-[72px] block text-center"
      >
        {value || "---"}
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-[rgba(18,20,17,0.97)] border border-[rgba(0,255,102,0.2)] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-44">
          <div className="p-2 border-b border-[rgba(71,72,69,0.3)]">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[4px] px-2 py-1 font-[Oxanium,sans-serif] text-[11px] text-[#fcfcf8] outline-none placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,255,102,0.4)]"
            />
          </div>
          <div className="overflow-y-auto max-h-40">
            {filtered.length === 0 ? (
              <div className="text-[10px] text-[rgba(255,255,255,0.3)] text-center py-3">
                No match
              </div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={[
                    "w-full text-left px-3 py-[6px] text-[11px] font-[Oxanium,sans-serif] transition-colors duration-100 cursor-pointer block",
                    value === country
                      ? "bg-[rgba(0,255,102,0.12)] text-[#00ff66]"
                      : "text-[rgba(255,255,255,0.6)] hover:text-[#fcfcf8] hover:bg-[rgba(255,255,255,0.05)]",
                  ].join(" ")}
                >
                  {country}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getStatValue(
  player: IPlayersResponse | IGoalKeeperResponse,
  stat: StatKey,
): number {
  const field = STAT_FIELD_MAP[stat];
  const raw = (player as IPlayersResponse)[field];
  return typeof raw === "number" ? raw : 0;
}

// ─── Editable field — click to edit, blur/enter to confirm ───────────────────

function EditableText({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  maxLength,
  min,
  max,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string; // wrapper class
  inputClassName?: string; // extra classes on input
  maxLength?: number;
  min?: number;
  max?: number;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);
  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    let trimmed = draft.trim();
    if (type === "number" && min !== undefined && max !== undefined) {
      const n = Number(trimmed);
      if (!isNaN(n)) trimmed = String(Math.min(max, Math.max(min, n)));
    }
    onChange(trimmed || value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        maxLength={maxLength}
        min={min}
        max={max}
        className={[
          "bg-transparent border-b border-[rgba(0,255,102,0.5)] outline-none text-[#00ff66]",
          "transition-[border-color] duration-150",
          inputClassName ?? className ?? "",
        ].join(" ")}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={[
        "cursor-text hover:text-[#00ff66] transition-colors duration-150 group/edit relative",
        className ?? "",
      ].join(" ")}
    >
      {value || placeholder}
      {/* tiny edit dot */}
      <span className="absolute -top-0.5 -right-2 w-1 h-1 rounded-full bg-[rgba(0,255,102,0.5)] opacity-0 group-hover/edit:opacity-100 transition-opacity duration-150" />
    </span>
  );
}

// ─── Foot toggle ──────────────────────────────────────────────────────────────

function FootToggle({
  value,
  onChange,
}: {
  value: "Left" | "Right";
  onChange: (v: "Left" | "Right") => void;
}) {
  return (
    <button
      onClick={() => onChange(value === "Left" ? "Right" : "Left")}
      title="Click to toggle foot"
      className="font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] hover:text-[#00ff66] transition-colors duration-150 cursor-pointer"
    >
      {value.toUpperCase()}
    </button>
  );
}

// ─── Position picker (small inline dropdown) ──────────────────────────────────

function PositionPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-0.5 font-[Oxanium,sans-serif] text-[10px] font-bold tracking-widest uppercase mt-0.5 text-[#00fe66] hover:text-white transition-colors duration-150 cursor-pointer"
      >
        {value}
        <ChevronDown className="w-2.5 h-2.5 opacity-60" />
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-50 bg-[rgba(18,20,17,0.97)] border border-[rgba(0,255,102,0.2)] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-28">
          <div className="grid grid-cols-3 gap-px p-1 max-h-40 overflow-y-auto">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                onClick={() => {
                  onChange(pos);
                  setOpen(false);
                }}
                className={[
                  "text-[9px] font-bold tracking-wider uppercase py-1 rounded-[3px] transition-colors duration-100 cursor-pointer",
                  value === pos
                    ? "bg-[rgba(0,255,102,0.15)] text-[#00ff66]"
                    : "text-[rgba(255,255,255,0.4)] hover:text-[#fcfcf8] hover:bg-[rgba(255,255,255,0.05)]",
                ].join(" ")}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Player Picker Modal (identical pattern to DreamTeam) ─────────────────────

function PlayerPickerModal({
  onClose,
  onSelect,
  slotPosition,
  statLabel,
  isGK = false,
  usedPlayerIds,
}: {
  onClose: () => void;
  onSelect: (player: IPlayersResponse | IGoalKeeperResponse) => void;
  slotPosition: string;
  statLabel: string;
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
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[rgba(18,20,17,0.92)] border border-[rgba(0,255,102,0.15)] rounded-2xl w-[min(680px,95vw)] max-h-[85vh] flex flex-col overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(71,72,69,0.2)] shrink-0">
          <div className="flex items-center gap-[10px]">
            <span className="font-[Bebas_Neue,sans-serif] text-[22px] text-[#fcfcf8] tracking-[0.04em]">
              Select Player
            </span>
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-[10px] py-1 rounded-[4px]">
              {statLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-[rgba(255,255,255,0.4)] text-[20px] leading-none p-1 transition-colors duration-200 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-[10px] px-5 py-4 border-b border-[rgba(71,72,69,0.2)] shrink-0">
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

        {/* Results */}
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-5">
          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] mb-[10px]">
            Results
          </div>

          {isLoading && (
            <div className="text-center py-10 text-[12px] text-[rgba(255,255,255,0.25)] tracking-[0.1em]">
              Searching...
            </div>
          )}

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
                  <div className="w-11 h-11 rounded-[6px] overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center">
                    {p.player_face_url ? (
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
                      <span className="material-symbols-outlined text-[18px] text-[rgba(0,255,102,0.3)]">
                        person
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#fcfcf8] whitespace-nowrap overflow-hidden text-ellipsis">
                      {p.short_name}
                    </div>
                    <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.05em]">
                      {p.player_positions} · {p.club_name} · Age {p.age} ·{" "}
                      {p.preferred_foot} foot
                    </div>
                  </div>

                  {isUsed ? (
                    <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-[rgba(255,100,100,0.7)] bg-[rgba(255,100,100,0.08)] border border-[rgba(255,100,100,0.2)] px-[6px] py-0.5 rounded-[3px] shrink-0">
                      In Squad
                    </span>
                  ) : (
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

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  connectorWidth,
  side,
  filled,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  connectorWidth: string;
  side: "left" | "right";
  filled: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-center gap-4 transition-transform duration-200 hover:scale-105 cursor-pointer"
    >
      {side === "right" && (
        <div
          className={[
            `hidden md:block ${connectorWidth} h-px bg-gradient-to-r from-[rgba(169,255,172,0.4)] to-transparent`,
            "transition-opacity duration-200",
            active ? "opacity-100" : "opacity-50 group-hover:opacity-100",
          ].join(" ")}
        />
      )}

      <div
        className={[
          "p-4 rounded-xl w-48 flex flex-col gap-1 backdrop-blur-md border",
          "transition-[border-color,background,box-shadow] duration-200",
          active
            ? "bg-[rgba(0,255,102,0.08)] border-[rgba(0,255,102,0.45)] shadow-[0_0_16px_rgba(0,255,102,0.15)]"
            : "bg-[rgba(18,20,17,0.7)] border-[rgba(169,255,172,0.1)] group-hover:border-[rgba(0,255,102,0.25)]",
        ].join(" ")}
      >
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase font-[Oxanium,sans-serif]">
            {label}
          </span>
          <span className="text-[#00fe66] w-4 h-4">{icon}</span>
        </div>
        <div
          className={[
            "text-[30px] leading-none font-[Bebas_Neue,sans-serif]",
            filled ? "text-white" : "text-[rgba(255,255,255,0.15)]",
          ].join(" ")}
        >
          {filled ? value : "–"}
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#00fe66] transition-all duration-700"
            style={{ width: filled ? `${Math.min(value, 100)}%` : "0%" }}
          />
        </div>
        <div className="text-[8px] font-bold tracking-[0.15em] uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[rgba(0,255,102,0.5)]">
          {filled ? "Change player →" : "Assign player →"}
        </div>
      </div>

      {side === "left" && (
        <div
          className={[
            `hidden md:block ${connectorWidth} h-px bg-gradient-to-l from-[rgba(169,255,172,0.4)] to-transparent`,
            "transition-opacity duration-200",
            active ? "opacity-100" : "opacity-50 group-hover:opacity-100",
          ].join(" ")}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DreamPlayerPage() {
  const [identity, setIdentity] = useState<PlayerIdentity>(DEFAULT_IDENTITY);
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);
  const [slotPlayers, setSlotPlayers] =
    useState<SlotPlayers>(DEFAULT_SLOT_PLAYERS);
  const [activeSlot, setActiveSlot] = useState<StatKey | null>(null);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────

  const overall = useMemo(() => {
    const values = Object.values(stats).filter((v) => v > 0);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [stats]);

  const usedPlayerIds = useMemo<Set<number>>(() => {
    const ids = new Set<number>();
    (
      Object.entries(slotPlayers) as [
        StatKey,
        (IPlayersResponse | IGoalKeeperResponse) | undefined,
      ][]
    ).forEach(([key, p]) => {
      if (p && key !== activeSlot) ids.add(p.id);
    });
    return ids;
  }, [slotPlayers, activeSlot]);

  const hasAnyPlayer = Object.values(slotPlayers).some(Boolean);
  const allSlotsFilled = (Object.keys(DEFAULT_SLOT_PLAYERS) as StatKey[]).every(
    (k) => slotPlayers[k],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openModal = (stat: StatKey) => setActiveSlot(stat);
  const closeModal = () => setActiveSlot(null);

  const patchIdentity = <K extends keyof PlayerIdentity>(
    key: K,
    value: PlayerIdentity[K],
  ) => setIdentity((prev) => ({ ...prev, [key]: value }));

  const handlePlayerSelect = (p: IPlayersResponse | IGoalKeeperResponse) => {
    if (!activeSlot) return;
    const statValue = getStatValue(p, activeSlot);
    setSlotPlayers((prev) => ({ ...prev, [activeSlot]: p }));
    setStats((prev) => ({ ...prev, [activeSlot]: statValue }));
    setActiveSlot(null);
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
      console.log("Dream Player:", { identity, stats, slotPlayers });
      setTimeout(() => setCreated(false), 2500);
    }, 1400);
  };

  // ── Stat card definitions ──────────────────────────────────────────────────

  const LEFT_STATS: {
    key: StatKey;
    label: string;
    icon: React.ReactNode;
    connectorWidth: string;
  }[] = [
    {
      key: "passing",
      label: "Passing",
      icon: <Share2 className="w-4 h-4" />,
      connectorWidth: "w-16",
    },
    {
      key: "physic",
      label: "Physical",
      icon: <Dumbbell className="w-4 h-4" />,
      connectorWidth: "w-24",
    },
    {
      key: "pace",
      label: "Pace",
      icon: <Zap className="w-4 h-4" />,
      connectorWidth: "w-32",
    },
  ];

  const RIGHT_STATS: {
    key: StatKey;
    label: string;
    icon: React.ReactNode;
    connectorWidth: string;
  }[] = [
    {
      key: "dribbling",
      label: "Dribbling",
      icon: <Footprints className="w-4 h-4" />,
      connectorWidth: "w-32",
    },
    {
      key: "shooting",
      label: "Shooting",
      icon: <Target className="w-4 h-4" />,
      connectorWidth: "w-24",
    },
    {
      key: "defending",
      label: "Defending",
      icon: <Shield className="w-4 h-4" />,
      connectorWidth: "w-16",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

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
        @keyframes spin-slow         { from { transform:rotate(0deg);   } to { transform:rotate(360deg);  } }
        @keyframes spin-slow-reverse { from { transform:rotate(360deg); } to { transform:rotate(0deg);    } }
        @keyframes create-flash {
          0%   { opacity:0; transform:translateX(-50%) scale(0.95); }
          30%  { opacity:1; transform:translateX(-50%) scale(1.02); }
          70%  { opacity:1; transform:translateX(-50%) scale(1);    }
          100% { opacity:0; transform:translateX(-50%) scale(0.98); }
        }
        .animate-spin-slow         { animation: spin-slow         20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 30s linear infinite; }
        .animate-delay-700         { animation-delay:  700ms; }
        .animate-delay-1000        { animation-delay: 1000ms; }
        .animate-create-flash      { animation: create-flash 2.5s ease forwards; }
        .player-glow               { filter: drop-shadow(0 0 18px rgba(0,255,102,0.45)); }
      `}</style>

      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0d0f0c] text-[#fcfcf8] font-[Oxanium,sans-serif]"
        style={{
          backgroundImage: `
            linear-gradient(to right,  rgba(71,72,69,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,72,69,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Toast */}
        {created && (
          <div className="animate-create-flash fixed top-8 left-1/2 z-50 px-7 py-3 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-[#00fe66] bg-[rgba(0,254,102,0.12)] border border-[rgba(0,254,102,0.4)] backdrop-blur-md font-[Oxanium,sans-serif]">
            PLAYER CREATED SUCCESSFULLY
          </div>
        )}

        {/* Watermark */}
        <div className="absolute top-8 left-8 pointer-events-none select-none z-0">
          <h1
            className="font-[Bebas_Neue,sans-serif] leading-[0.95] tracking-[-0.01em]"
            style={{
              fontSize: "clamp(48px,10vw,80px)",
              color: "rgba(252,252,248,0.06)",
            }}
          >
            DREAM
            <br />
            PLAYER
          </h1>
        </div>

        {/* ── Main layout ─────────────────────────────────────────────────── */}
        <main className="relative w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-8 pt-16 z-10">
          {/* LEFT STAT CARDS */}
          <div className="flex flex-col gap-6 z-20 w-full md:w-auto order-2 md:order-1">
            {LEFT_STATS.map(({ key, label, icon, connectorWidth }) => (
              <StatCard
                key={key}
                label={label}
                value={stats[key]}
                icon={icon}
                connectorWidth={connectorWidth}
                side="left"
                filled={stats[key] > 0}
                active={activeSlot === key}
                onClick={() => openModal(key)}
              />
            ))}
          </div>

          {/* ── CENTER PLAYER ───────────────────────────────────────────── */}
          <div
            className="relative flex-1 flex flex-col items-center justify-center order-1 md:order-2"
            style={{ height: "520px" }}
          >
            {/* Orbital rings */}
            <div className="absolute w-[380px] h-[380px] rounded-full border border-[rgba(0,254,102,0.05)] animate-spin-slow" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-[rgba(0,254,102,0.08)] animate-spin-slow-reverse" />

            {/* Player image — FIXED, never changes */}
            <div className="relative z-10 h-full flex items-end justify-center pb-24 pointer-events-none">
              <img
                src={CENTER_IMAGE}
                alt="Player"
                className="player-glow mix-blend-screen brightness-125 saturate-50 select-none"
                style={{ height: 320, objectFit: "contain" }}
              />
            </div>

            {/* Pulse dots */}
            <div className="absolute top-1/4    left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#00fe66] animate-pulse                    shadow-[0_0_10px_rgba(0,255,102,0.8)]" />
            <div className="absolute top-1/2    left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#00fe66] animate-pulse animate-delay-700  shadow-[0_0_10px_rgba(0,255,102,0.8)]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#00fe66] animate-pulse animate-delay-1000 shadow-[0_0_10px_rgba(0,255,102,0.8)]" />

            {/* ── Player info card (all fields editable) ─────────────────── */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(340px,90vw)]">
              <div className="rounded-2xl px-5 py-4 flex flex-col gap-3 bg-[rgba(18,20,17,0.85)] backdrop-blur-xl border border-[rgba(169,255,172,0.15)]">
                {/* Row 1: overall + name + position */}
                <div className="flex items-center gap-3">
                  {/* Overall badge */}
                  <div className="px-3 py-1 rounded-2xl bg-gradient-to-br from-[rgba(0,254,102,0.18)] to-[rgba(0,254,102,0.04)] border border-[rgba(0,254,102,0.3)] shrink-0">
                    <span
                      className={[
                        "text-[26px] leading-none font-[Bebas_Neue,sans-serif]",
                        overall > 0
                          ? "text-[#00fe66]"
                          : "text-[rgba(0,254,102,0.3)]",
                      ].join(" ")}
                    >
                      {overall > 0 ? overall : "–"}
                    </span>
                  </div>

                  {/* Name (editable) + position picker */}
                  <div className="min-w-0 flex-1">
                    <EditableText
                      value={identity.name}
                      onChange={(v) => patchIdentity("name", v)}
                      placeholder="Player Name"
                      maxLength={22}
                      className="text-[20px] leading-none uppercase tracking-wide text-[#fcfcf8] font-[Bebas_Neue,sans-serif] block w-full"
                      inputClassName="text-[20px] leading-none uppercase tracking-wide w-full font-[Bebas_Neue,sans-serif]"
                    />
                    <PositionPicker
                      value={identity.position}
                      onChange={(v) => patchIdentity("position", v)}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[rgba(0,254,102,0.1)]" />

                {/* Row 2: nationality · shirt · foot — all editable */}
                <div className="grid grid-cols-3 gap-x-3">
                  {/* Nationality */}
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Flag className="w-3 h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Nat
                      </span>
                    </div>
                    <CountryPicker
                      value={identity.nationality}
                      onChange={(v) => patchIdentity("nationality", v)}
                    />
                  </div>

                  {/* Shirt number */}
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Shirt
                      </span>
                    </div>
                    <EditableText
                      value={String(identity.shirt_number)}
                      onChange={(v) => {
                        const n = parseInt(v, 10);
                        if (!isNaN(n) && n >= 1 && n <= 99)
                          patchIdentity("shirt_number", n);
                      }}
                      placeholder="7"
                      maxLength={2}
                      min={1}
                      max={99}
                      type="number"
                      className="font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] text-center block w-full"
                      inputClassName="font-[Bebas_Neue,sans-serif] text-[14px] text-center w-[40px]"
                    />
                  </div>

                  {/* Strong foot — toggle Left / Right on click */}
                  <div className="flex flex-col items-center gap-[3px]">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#00fe66] opacity-70" />
                      <span className="text-[8px] font-bold tracking-widest text-white/35 uppercase font-[Oxanium,sans-serif]">
                        Foot
                      </span>
                    </div>
                    <FootToggle
                      value={identity.preferred_foot}
                      onChange={(v) => patchIdentity("preferred_foot", v)}
                    />
                  </div>
                </div>

                {/* Edit hint */}
                <p className="text-[8px] text-[rgba(255,255,255,0.2)] tracking-[0.12em] uppercase text-center -mb-1">
                  Click any field to edit · Click foot to toggle
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT STAT CARDS */}
          <div className="flex flex-col gap-6 z-20 w-full md:w-auto order-3">
            {RIGHT_STATS.map(({ key, label, icon, connectorWidth }) => (
              <StatCard
                key={key}
                label={label}
                value={stats[key]}
                icon={icon}
                connectorWidth={connectorWidth}
                side="right"
                filled={stats[key] > 0}
                active={activeSlot === key}
                onClick={() => openModal(key)}
              />
            ))}
          </div>
        </main>

        {/* Create Player Button */}
        <div className="relative z-30 flex flex-col items-center gap-3 pb-10">
          {creating && (
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00fe66] animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!hasAnyPlayer || creating}
            className={[
              "relative overflow-hidden flex items-center gap-3 px-12 py-[14px] rounded-xl",
              "border-none cursor-pointer uppercase font-bold tracking-[0.1em] text-[0.85rem]",
              "transition-[transform,box-shadow,opacity] duration-150 font-[Oxanium,sans-serif]",
              hasAnyPlayer && !creating
                ? "text-[#0d0f0c] bg-gradient-to-br from-[#00fe66] to-[#00c44f] shadow-[0_0_24px_rgba(0,254,102,0.25),0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(0,254,102,0.4),0_8px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97]"
                : "text-[rgba(0,254,102,0.3)] bg-[rgba(0,254,102,0.05)] border border-[rgba(0,254,102,0.12)] cursor-not-allowed",
            ].join(" ")}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4" strokeWidth={3} />
            {creating ? "Creating Player..." : "Create Player"}
          </button>

          <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 font-[Oxanium,sans-serif]">
            {allSlotsFilled
              ? "All attributes assigned — ready to create"
              : "Click any attribute card to assign a player"}
          </p>
        </div>

        {/* Vignette overlay */}
      </div>

      {/* Player Picker Modal */}
      {activeSlot !== null && (
        <PlayerPickerModal
          slotPosition={identity.position || "ST"}
          isGK={identity.position === "GK"}
          statLabel={activeSlot.toUpperCase()}
          onClose={closeModal}
          onSelect={handlePlayerSelect}
          usedPlayerIds={usedPlayerIds}
        />
      )}
    </>
  );
}
