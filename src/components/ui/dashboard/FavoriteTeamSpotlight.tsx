"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShieldCheck } from "lucide-react";
import {
  useGetTeamRecentMatches,
  useGetTeamUpcomingFixtures,
} from "@/features/main/football";
import { useGetFavoriteTeam } from "@/features/main/dashboard";

export function FavoriteTeamSpotlight() {
  const { data: favTeams, isLoading: teamLoading } = useGetFavoriteTeam();
  const favoriteTeam = favTeams?.[0] ?? null;

  const { data: recentMatches = [], isLoading: recentLoading } =
    useGetTeamRecentMatches(favoriteTeam?.name);
  const { data: upcomingFixes = [], isLoading: upcomingLoading } =
    useGetTeamUpcomingFixtures(favoriteTeam?.name, 3);

  const loading = teamLoading || recentLoading || upcomingLoading;

  const recentForm = React.useMemo(() => {
    if (!favoriteTeam) return [];
    return [...recentMatches]
      .sort(
        (a, b) =>
          new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
      )
      .slice(0, 5)
      .map((m) => {
        const isHome = m.home_team
          .toLowerCase()
          .includes(favoriteTeam.name.toLowerCase());
        const winTeam = m.winner;
        if (winTeam === "DRAW") return "D";
        if (winTeam === "HOME_TEAM" && isHome) return "W";
        if (winTeam === "AWAY_TEAM" && !isHome) return "W";
        return "L";
      })
      .reverse();
  }, [recentMatches, favoriteTeam]);

  if (loading) {
    return (
      <div className="bg-surface-container-low rounded-lg h-64 animate-pulse border border-[#00fe66]/30" />
    );
  }

  if (!favoriteTeam) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-outline-variant/30 p-6 text-center text-sm text-on-surface-variant">
        No favorite team selected.
      </section>
    );
  }

  return (
    <section className="bg-surface-container-low rounded-lg border border-[#00fe66]/30 overflow-hidden">
      <div className="p-6 bg-primary-container/5 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
            My Favorite Team
          </span>
          <Heart className="w-4 h-4 text-primary-container fill-primary-container" />
        </div>
        <div className="flex items-center gap-4 mb-6">
          {favoriteTeam.logo_url ? (
            <Image
              src={favoriteTeam.logo_url}
              alt={favoriteTeam.name}
              width={56}
              height={56}
              className="w-14 h-14 object-contain rounded-lg bg-surface-container-highest p-1 border border-[#00fe66]/20 shadow-md flex-none"
            />
          ) : (
            <ShieldCheck className="w-14 h-14 text-primary-container/40 flex-none" />
          )}
          <div>
            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter">
              {favoriteTeam.name}
            </h3>
            <p className="text-on-surface-variant text-sm font-label uppercase">
              • {favoriteTeam.league_name || "League"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {recentForm.map((r, i) => (
            <span
              key={i}
              className={`w-8 h-8 rounded font-headline font-bold flex items-center justify-center text-xs ${
                r === "W"
                  ? "bg-primary-container text-on-primary"
                  : r === "L"
                    ? "bg-error text-on-error"
                    : "bg-surface-container-highest text-on-surface-variant border border-outline-variant/20"
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Upcoming Fixtures
        </p>
        <div className="space-y-3">
          {upcomingFixes.length === 0 && (
            <p className="text-xs text-on-surface-variant">
              No upcoming matches.
            </p>
          )}
          {upcomingFixes.map((f) => {
            const isHome = f.home_team
              .toLowerCase()
              .includes(favoriteTeam.name.toLowerCase());
            const opp = isHome
              ? `vs ${f.away_team} (H)`
              : `vs ${f.home_team} (A)`;
            const d = new Date(f.date ?? "").toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            });
            return (
              <div key={f.id} className="flex justify-between text-sm">
                <span className="text-on-surface-variant">{opp}</span>
                <span className="font-medium">{d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
