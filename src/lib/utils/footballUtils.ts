import type { Match } from "@/types/football";

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
  const leagues: Record<string, string> = {
    FL1: "Ligue 1",
    SA: "Serie A",
    PL: "Premier League",
    PPL: "Primeira Liga",
    PD: "La Liga",
    BL: "Bundesliga",
    CL: "Champions League",
  };
  return leagues[key] ?? key;
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

export function getQualification(
  pos: number,
  leagueKey: string,
  totalTeams: number,
): string {
  let clLimit = 4;
  let elLimit = [5];
  let colLimit = 6;

  if (leagueKey === "PL") {
    clLimit = 5;
    elLimit = [6];
    colLimit = 7;
  } else if (leagueKey === "FL1") {
    clLimit = 3;
    elLimit = [4];
    colLimit = 5;
  } else if (leagueKey === "PPL") {
    clLimit = 2;
    elLimit = [3, 4];
    colLimit = 5;
  }

  if (pos > totalTeams - 3) return "relegation";
  if (pos <= clLimit) return "champions";
  if (elLimit.includes(pos)) return "europa";
  if (pos === colLimit) return "conference";
  return "neutral";
}

export function groupMatchesByRound(matches: Match[]): Match[][] {
  if (!matches.length) return [];
  const getTime = (m: Match) => new Date(m.date ?? m.utc_date ?? "").getTime();
  const sorted = [...matches].sort((a, b) => getTime(a) - getTime(b));
  const groups: Match[][] = [];
  let group: Match[] = [sorted[0]];
  let anchor = getTime(sorted[0]);
  for (let i = 1; i < sorted.length; i++) {
    const t = getTime(sorted[i]);
    if ((t - anchor) / 86_400_000 <= 7) {
      group.push(sorted[i]);
    } else {
      groups.push(group);
      group = [sorted[i]];
      anchor = t;
    }
  }
  groups.push(group);
  return groups;
}

export function fmtMatchDate(m: Match) {
  return new Date(m.date ?? m.utc_date ?? "").toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  });
}

export function fmtKickoff(m: Match) {
  const d = new Date(m.date ?? m.utc_date ?? "");
  return `${d.toLocaleDateString("en-GB", { month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}
