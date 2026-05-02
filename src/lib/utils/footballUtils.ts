import type { Match, KnockoutTie } from "@/features/main/football/types";

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
    BL1: "Bundesliga",
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

export function calculateAge(dob: string): number {
  const birthday = new Date(dob);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function transformKnockoutTies(matches: Match[]): KnockoutTie[] {
  const tiesMap: Record<string, Match[]> = {};

  matches.forEach((m) => {
    const key = [m.home_team, m.away_team].sort().join("_");
    if (!tiesMap[key]) tiesMap[key] = [];
    tiesMap[key].push(m);
  });

  const ties: KnockoutTie[] = Object.entries(tiesMap).map(([key, legs]) => {
    // Sort legs by date
    legs.sort(
      (a, b) =>
        new Date(a.date || a.utc_date || "").getTime() -
        new Date(b.date || b.utc_date || "").getTime(),
    );

    const leg1 = legs[0];
    const leg2 = legs[1];

    const home_team = leg1.home_team;
    const away_team = leg1.away_team;

    let aggregate_home: number | null = null;
    let aggregate_away: number | null = null;
    let winner: string | null = null;

    const getScore = (m: Match, isHome: boolean) => {
      if (isHome) return m.home_team_score ?? m.home_score ?? 0;
      return m.away_team_score ?? m.away_score ?? 0;
    };

    const isFinished = (m: Match) => m.status === "FINISHED";

    if (leg1 && isFinished(leg1)) {
      aggregate_home = getScore(leg1, true);
      aggregate_away = getScore(leg1, false);
    }

    if (leg2 && isFinished(leg2)) {
      // In leg 2, leg1.home_team is leg2.away_team
      aggregate_home = (aggregate_home ?? 0) + getScore(leg2, false);
      aggregate_away = (aggregate_away ?? 0) + getScore(leg2, true);
    }

    if (leg1 && leg2 && isFinished(leg1) && isFinished(leg2)) {
      if (aggregate_home! > aggregate_away!) winner = home_team;
      else if (aggregate_away! > aggregate_home!) winner = away_team;
    } else if (leg1 && isFinished(leg1) && !leg2) {
      if (aggregate_home! > aggregate_away!) winner = home_team;
      else if (aggregate_away! > aggregate_home!) winner = away_team;
    }

    return {
      id: key,
      home_team,
      away_team,
      leg1,
      leg2,
      aggregate_home,
      aggregate_away,
      winner,
      status: leg2 ? leg2.status : leg1.status,
      date: leg1.date || leg1.utc_date || "",
    };
  });

  // Sort ties by earliest match date
  return ties.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
