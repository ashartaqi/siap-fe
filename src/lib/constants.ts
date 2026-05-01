import {
  User,
  Shield,
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

// ─── League Standings ─────────────────────────────────────────────────────────

export const LEAGUE_LOGOS: Record<string, string> = {
  PL: "/premierleague.jpg",
  PD: "/laliga.png",
  SA: "/serieA.png",
  BL1: "/bundesliga.png",
  FL1: "/ligue1.png",
  PPL: "/premieraliga.png",
};

export const STANDINGS_LEGEND = [
  { dotClass: "bg-[#3b82f6]", label: "Champions League" },
  { dotClass: "bg-[#f59e0b]", label: "Europa League" },
  { dotClass: "bg-[#10b981]", label: "Conference League" },
  { dotClass: "bg-[#ef4444]", label: "Relegation" },
] as const;

// ─── UCL ──────────────────────────────────────────────────────────────────────

/** Static label + colour metadata for the UCL bracket footer. Pair with runtime values. */
export const UCL_FOOTER_STATS = [
  { label: "Played", textClass: "text-[#c8dcff]" },
  { label: "Remaining", textClass: "text-[#60aaff]" },
  { label: "Total", textClass: "text-[#7eb8ff]" },
] as const;

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const NEURAL_PREDICTIONS = [
  {
    home: "ARS",
    away: "MCI",
    homeLabel: "Arsenal Win",
    awayLabel: "Man City Win",
    winPct: 68,
    drawPct: 12,
  },
  {
    home: "LIV",
    away: "CHE",
    homeLabel: "Liverpool Win",
    awayLabel: "Chelsea Win",
    winPct: 54,
    drawPct: 26,
  },
] as const;

// ─── Auth / Register ──────────────────────────────────────────────────────────

export const REGISTER_PERKS = [
  {
    title: "Live Match Data",
    desc: "real-time scores, stats, and updates from global leagues.",
  },
  {
    title: "AI Predictions",
    desc: "machine-learning powered win probabilities for every match.",
  },
  {
    title: "Dream Team Builder",
    desc: "assemble your fantasy squad and track chemistry scores.",
  },
  {
    title: "Leaderboard & Voting",
    desc: "compete with fans, vote on outcomes, earn points.",
  },
] as const;

export const PASSWORD_STRENGTH_LEVELS = [
  {
    widthClass: "w-1/5",
    bgClass: "bg-[#ff4d4d]",
    textClass: "text-[#ff4d4d]",
    label: "Very Weak",
  },
  {
    widthClass: "w-2/5",
    bgClass: "bg-[#ff8c00]",
    textClass: "text-[#ff8c00]",
    label: "Weak",
  },
  {
    widthClass: "w-3/5",
    bgClass: "bg-[#ffd700]",
    textClass: "text-[#ffd700]",
    label: "Fair",
  },
  {
    widthClass: "w-4/5",
    bgClass: "bg-[#7fff00]",
    textClass: "text-[#7fff00]",
    label: "Good",
  },
  {
    widthClass: "w-full",
    bgClass: "bg-[#00e640]",
    textClass: "text-[#00e640]",
    label: "Strong",
  },
] as const;

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

// ─── Players ──────────────────────────────────────────────────────────────────

export const PREFERRED_FEET = ["Left", "Right"] as const;

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

/** All outfield + GK — use when GK must be included (e.g. Players page filter) */
export const ALL_POSITIONS_WITH_GK = [...ALL_POSITIONS, "GK"];

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
