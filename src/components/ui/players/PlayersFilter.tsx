"use client";

import { X, ChevronDown } from "lucide-react";
import {
  COUNTRIES,
  LEAGUES_WITH_ACCENT,
  LEAGUE_TEAMS,
  POSITION_GROUPS,
} from "@/lib/constants";

export interface PlayersFilterValues {
  search: string;
  position: string;
  nationality: string;
  league: string;
  team: string;
}

interface PlayersFilterProps {
  values: PlayersFilterValues;
  onChange: (partial: Partial<PlayersFilterValues>) => void;
  onClear: () => void;
}

export function PlayersFilter({
  values,
  onChange,
  onClear,
}: PlayersFilterProps) {
  const { position, nationality, league, team } = values;
  const teamsForLeague = league ? (LEAGUE_TEAMS[league] ?? []) : [];
  const hasActive = position || nationality || league || team;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/15 animate-[fadeUp_0.25s_ease]">
      <FilterSelect
        label="Position"
        value={position}
        onChange={(v) => onChange({ position: v })}
      >
        <option value="">All Positions</option>
        {POSITION_GROUPS.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </optgroup>
        ))}
      </FilterSelect>

      <FilterSelect
        label="Nationality"
        value={nationality}
        onChange={(v) => onChange({ nationality: v })}
      >
        <option value="">All Nationalities</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        label="League"
        value={league}
        onChange={(v) => onChange({ league: v, team: "" })}
      >
        <option value="">All Leagues</option>
        {LEAGUES_WITH_ACCENT.map((l) => (
          <option key={l.key} value={l.key}>
            {l.label}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        label="Team"
        value={team}
        onChange={(v) => onChange({ team: v })}
        disabled={!league}
      >
        <option value="">
          {league ? "All Teams" : "Select a league first"}
        </option>
        {teamsForLeague.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </FilterSelect>

      {hasActive && (
        <div className="col-span-2 md:col-span-4 flex justify-end">
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-primary-container/70 hover:text-primary-container transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 font-label">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none cursor-pointer transition-colors focus:border-primary-container/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
      </div>
    </div>
  );
}
