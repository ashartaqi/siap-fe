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
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "analytics", label: "Analytics Prefs", icon: BarChart2 },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "data", label: "Data & Export", icon: Download },
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_GOALS_TREND = [
  { gw: "GW26", goals: 28, conceded: 19 },
  { gw: "GW27", goals: 31, conceded: 22 },
  { gw: "GW28", goals: 25, conceded: 18 },
  { gw: "GW29", goals: 35, conceded: 24 },
  { gw: "GW30", goals: 29, conceded: 20 },
  { gw: "GW31", goals: 38, conceded: 27 },
  { gw: "GW32", goals: 33, conceded: 21 },
];

export const MOCK_STANDINGS = [
  {
    pos: 1,
    team: "Liverpool",
    played: 31,
    w: 23,
    d: 5,
    l: 3,
    gd: "+47",
    pts: 74,
    form: ["W", "W", "D", "W", "W"],
    trend: "up",
  },
  {
    pos: 2,
    team: "Arsenal",
    played: 31,
    w: 21,
    d: 6,
    l: 4,
    gd: "+38",
    pts: 69,
    form: ["W", "W", "W", "D", "W"],
    trend: "up",
  },
  {
    pos: 3,
    team: "Man City",
    played: 31,
    w: 19,
    d: 7,
    l: 5,
    gd: "+29",
    pts: 64,
    form: ["L", "W", "W", "D", "W"],
    trend: "same",
  },
  {
    pos: 4,
    team: "Chelsea",
    played: 31,
    w: 18,
    d: 5,
    l: 8,
    gd: "+18",
    pts: 59,
    form: ["W", "L", "W", "W", "L"],
    trend: "down",
  },
  {
    pos: 5,
    team: "Aston Villa",
    played: 31,
    w: 16,
    d: 8,
    l: 7,
    gd: "+14",
    pts: 56,
    form: ["D", "W", "L", "W", "W"],
    trend: "up",
  },
  {
    pos: 6,
    team: "Tottenham",
    played: 31,
    w: 15,
    d: 6,
    l: 10,
    gd: "+8",
    pts: 51,
    form: ["L", "W", "W", "L", "D"],
    trend: "down",
  },
  {
    pos: 7,
    team: "Newcastle",
    played: 31,
    w: 14,
    d: 8,
    l: 9,
    gd: "+11",
    pts: 50,
    form: ["W", "D", "W", "W", "L"],
    trend: "same",
  },
];

export const MOCK_TOP_SCORERS = [
  { name: "M. Salah", team: "Liverpool", goals: 24, assists: 14, img: "MS" },
  { name: "E. Haaland", team: "Man City", goals: 21, assists: 6, img: "EH" },
  { name: "A. Isak", team: "Newcastle", goals: 18, assists: 5, img: "AI" },
  { name: "B. Saka", team: "Arsenal", goals: 16, assists: 11, img: "BS" },
  { name: "C. Palmer", team: "Chelsea", goals: 15, assists: 13, img: "CP" },
];

export const MOCK_FIXTURES = [
  {
    home: "Arsenal",
    away: "Liverpool",
    time: "12:30",
    date: "Sat 20 Apr",
    status: "upcoming",
  },
  {
    home: "Man City",
    away: "Chelsea",
    time: "15:00",
    date: "Sat 20 Apr",
    status: "upcoming",
  },
  {
    home: "Tottenham",
    away: "Newcastle",
    time: "17:30",
    date: "Sat 20 Apr",
    status: "live",
    score: "1-2",
    min: "64'",
  },
  {
    home: "Aston Villa",
    away: "Man Utd",
    time: "14:00",
    date: "Sun 21 Apr",
    status: "upcoming",
  },
];

export const MOCK_RADAR_DATA = [
  { stat: "Attack", lfc: 92, afc: 85 },
  { stat: "Defence", lfc: 88, afc: 82 },
  { stat: "Possession", lfc: 79, afc: 84 },
  { stat: "Pressing", lfc: 91, afc: 78 },
  { stat: "Set Pieces", lfc: 76, afc: 80 },
  { stat: "Transition", lfc: 88, afc: 75 },
];

export const MOCK_STAT_CARDS = [
  {
    label: "Total Goals",
    value: "892",
    sub: "GW 1-32",
    delta: "+12%",
    up: true,
  },
  {
    label: "Avg per Match",
    value: "2.79",
    sub: "This season",
    delta: "+0.3",
    up: true,
  },
  {
    label: "Live Matches",
    value: "3",
    sub: "Right now",
    delta: null,
    live: true,
  },
  {
    label: "Cards Issued",
    value: "1,247",
    sub: "Season total",
    delta: "-8%",
    up: false,
  },
];
