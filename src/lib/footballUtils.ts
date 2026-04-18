export const BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/live";

export const FIXTURE_LEAGUES = [
  { key: "FL1", label: "Ligue 1", badge: "L1" },
  { key: "SA", label: "Serie A", badge: "SA" },
  { key: "PL", label: "Premier League", badge: "PL" },
  { key: "PPL", label: "Primeira Liga", badge: "PPL" },
  { key: "PD", label: "La Liga", badge: "LL" },
  { key: "BL", label: "Bundesliga", badge: "BL" },
  { key: "CL", label: "Champions League", badge: "CL" },
];

export const STANDING_LEAGUES = [
  { key: "PL", label: "Premier League", badge: "PL" },
  { key: "PD", label: "La Liga", badge: "LL" },
  { key: "SA", label: "Serie A", badge: "SA" },
  { key: "BL1", label: "Bundesliga", badge: "BL" },
  { key: "FL1", label: "Ligue 1", badge: "L1" },
];

export const LEAGUES_WITH_ACCENT = [
  { key: "PL", label: "Premier League", badge: "PL", accent: "#3b0764" },
  { key: "PD", label: "La Liga", badge: "LL", accent: "#7c1d1d" },
  { key: "SA", label: "Serie A", badge: "SA", accent: "#1e3a5f" },
  { key: "BL", label: "Bundesliga", badge: "BL", accent: "#431407" },
  { key: "FL1", label: "Ligue 1", badge: "L1", accent: "#052e16" },
  { key: "PPL", label: "Primeira Liga", badge: "PPL", accent: "#3b1f00" },
];

export function isUpcoming(status: string) {
  return ["TIMED", "SCHEDULED", "POSTPONED"].includes(status);
}

export function formatMatchTime(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function leagueName(key: string) {
  return FIXTURE_LEAGUES.find((l) => l.key === key)?.label ?? key;
}

export function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

export function fmtTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function abbrev(name: string = "") {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return name.slice(0, 3).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
