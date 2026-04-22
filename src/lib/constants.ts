import {
  User,
  Bell,
  Shield,
  Palette,
  BarChart2,
  Download,
  Monitor,
  Moon,
  Share2,
  Dumbbell,
  Zap,
  Footprints,
  Target,
} from "lucide-react";
import type { ComponentType } from "react";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const TOKEN_KEY = "token";

// ─── Football Leagues ─────────────────────────────────────────────────────────

export const CURRENT_SEASON = "2025 / 26";

export const LEAGUES_WITH_ACCENT = [
  { key: "PL", label: "Premier League", badge: "PL", accent: "#3b0764" },
  { key: "PD", label: "La Liga", badge: "LL", accent: "#7c1d1d" },
  { key: "SA", label: "Serie A", badge: "SA", accent: "#1e3a5f" },
  { key: "BL1", label: "Bundesliga", badge: "BL1", accent: "#431407" },
  { key: "FL1", label: "Ligue 1", badge: "L1", accent: "#052e16" },
  { key: "PPL", label: "Primeira Liga", badge: "PPL", accent: "#3b1f00" },
];

/** All leagues used for fixture queries (matches backend FIXTURE_LEAGUES) */
export const FIXTURE_LEAGUES = [
  { key: "FL1", label: "Ligue 1", badge: "L1" },
  { key: "SA", label: "Serie A", badge: "SA" },
  { key: "PL", label: "Premier League", badge: "PL" },
  { key: "PPL", label: "Primeira Liga", badge: "PPL" },
  { key: "PD", label: "La Liga", badge: "LL" },
  { key: "BL1", label: "Bundesliga", badge: "BL1" },
  { key: "CL", label: "Champions League", badge: "CL" },
];

// ─── Player Positions ─────────────────────────────────────────────────────────

/** Attacking positions — mirrors backend VALID_PLAYER_POSITIONS.attacking */
export const ATTACK_POSITIONS = ["LW", "ST", "RW", "CF", "LF", "RF", "SS"];
/** Midfield positions — mirrors backend VALID_PLAYER_POSITIONS.midfield */
export const MIDFIELD_POSITIONS = ["CM", "CAM", "CDM", "LM", "RM", "DM", "AM"];
/** Defensive positions — mirrors backend VALID_PLAYER_POSITIONS.defense */
export const DEFENSE_POSITIONS = ["CB", "LB", "RB", "LWB", "RWB", "SW", "GK"];

/** All outfield positions (mirrors backend ALL_POSITIONS, used as fallback) */
export const ALL_POSITIONS = [
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

// ─── Settings — Profile ───────────────────────────────────────────────────────

export const FAVORITE_TEAMS = [
  "Arsenal",
  "Chelsea",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Tottenham",
  "Newcastle",
  "Aston Villa",
  "Real Madrid",
  "Barcelona",
  "Atletico Madrid",
  "Bayern Munich",
  "Borussia Dortmund",
  "PSG",
  "Juventus",
  "AC Milan",
  "Inter Milan",
  "Napoli",
  "Porto",
  "Benfica",
];

export const SETTINGS_LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Primeira Liga",
];

// ─── Shared Input Styling ─────────────────────────────────────────────────────

export const INPUT =
  "w-full box-border bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,255,102,0.4)]";

export const LABEL =
  "text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(255,255,255,0.35)]";

// ─── Dream Player ─────────────────────────────────────────────────────────────

export const CENTER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNDEJWQe0nPD_yN1t2Hg1SBgMI-dAIRD8YTLy0R27wpcj-qDt6F9Jh5Rx-hsHGaUnBcXkDqIvu3mkWYPzEL_yaTkSTGZilhl7e3X3VO5c3ZB_KwDnNGYC4Cfvh8ZjEob0Q7iBpUhflT2BjJOzoCyJbIFh0nwwfLIS_GYsHlez0tj0ZUrp61mT4kX7fntmredK2TWLq8I8sOEMIm_xFoDPW9QJJca6OufWq1WbkMqm-TneaNm4aeCGydW9B8XHe-Fr2pk4H6jkbl4g";

export const STAT_FIELD_MAP = {
  pace: "pace",
  shooting: "shooting",
  passing: "passing",
  dribbling: "dribbling",
  defending: "defending",
  physic: "physic",
} as const;

export const DEFAULT_IDENTITY = {
  name: "Your Player",
  position: "ST",
  nationality: "---",
  shirt_number: 7,
  preferred_foot: "Right" as const,
};

export const DEFAULT_STATS = {
  pace: 0,
  shooting: 0,
  passing: 0,
  dribbling: 0,
  defending: 0,
  physic: 0,
};

export const DEFAULT_SLOT_PLAYERS = {
  pace: undefined,
  shooting: undefined,
  passing: undefined,
  dribbling: undefined,
  defending: undefined,
  physic: undefined,
};

export const DEFAULT_PAGE_STATE = {
  identity: DEFAULT_IDENTITY,
  stats: DEFAULT_STATS,
  mode: "edit" as const,
};

export interface StatDefinition {
  key: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  connectorWidth: string;
}

export const LEFT_STATS: StatDefinition[] = [
  { key: "passing", label: "Passing", Icon: Share2, connectorWidth: "w-16" },
  { key: "physic", label: "Physical", Icon: Dumbbell, connectorWidth: "w-24" },
  { key: "pace", label: "Pace", Icon: Zap, connectorWidth: "w-32" },
];

export const RIGHT_STATS: StatDefinition[] = [
  {
    key: "dribbling",
    label: "Dribbling",
    Icon: Footprints,
    connectorWidth: "w-32",
  },
  { key: "shooting", label: "Shooting", Icon: Target, connectorWidth: "w-24" },
  {
    key: "defending",
    label: "Defending",
    Icon: Shield,
    connectorWidth: "w-16",
  },
];

// ─── Settings Sections ────────────────────────────────────────────────────────

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

// ─── Settings Options ─────────────────────────────────────────────────────────

export const THEME_OPTIONS = [
  {
    label: "Dark (Default)",
    icon: Moon,
    active: true,
    colors: ["#000", "#0A0A0A", "#00FF7F"],
  },
  {
    label: "OLED Black",
    icon: Monitor,
    active: false,
    colors: ["#000", "#000", "#00A550"],
  },
  {
    label: "Light",
    icon: Monitor,
    active: false,
    colors: ["#F5F5F5", "#fff", "#006633"],
  },
];

export const ACCENT_COLORS = [
  "#00FF7F",
  "#00BFFF",
  "#FF6B35",
  "#FFD700",
  "#FF3B9A",
  "#A855F7",
];

export const TIMEZONE_OPTIONS = [
  "Asia/Karachi (PKT)",
  "Europe/London (GMT)",
  "America/New_York (EST)",
  "Asia/Dubai (GST)",
];

export const MATCH_CLOCK_OPTIONS = ["MM:SS", "Minutes only", "24h Clock"];

export const LANGUAGE_OPTIONS = [
  "English (UK)",
  "English (US)",
  "Urdu",
  "Arabic",
  "Spanish",
];

export const NOTIFICATION_SOUNDS = [
  "Default",
  "Whistle",
  "Stadium Roar",
  "None",
];

export const EXPORT_ITEMS = [
  {
    label: "Match History",
    desc: "All tracked matches & stats",
    format: "CSV",
  },
  {
    label: "Player Analytics",
    desc: "Custom metrics & xG data",
    format: "JSON",
  },
  { label: "Team Reports", desc: "Season performance reports", format: "PDF" },
  { label: "Full Data Dump", desc: "Everything in one archive", format: "ZIP" },
];

export const DATA_RETENTION_OPTIONS = [
  "Never",
  "6 months",
  "1 year",
  "2 years",
];

export const PRIMARY_STAT_OPTIONS = [
  "Goals",
  "Assists",
  "xG",
  "Pass Accuracy",
  "Tackles",
];

export const XG_MODEL_OPTIONS = [
  "Standard",
  "Advanced (Body Part)",
  "Post-shot xG",
];

export const POSSESSION_METRICS = ["PPDA", "Press Intensity", "Build-up Index"];

export const DASHBOARD_WIDGETS = [
  "Live Scores",
  "Top Scorers",
  "League Standings",
  "Goals Trend Chart",
  "Upcoming Fixtures",
  "Team Comparison Radar",
];
