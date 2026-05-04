"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import {
  useGetTeamRecentMatches,
  useGetTeamUpcomingFixtures,
} from "@/features/main/football";
import {
  useGetFavoriteTeam,
  useAddFavoriteTeam,
  useRemoveFavoriteTeam,
  ITeamsResponse,
} from "@/features/main/dashboard";
import { TeamDetailModal } from "@/components/common/modals/TeamDetailModal";
import { FavoriteButton } from "@/components/common/buttons/FavoriteButton";
import { Toast } from "@/components/common/Toast";

export function FavoriteTeamSpotlight() {
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "blue";
  } | null>(null);
  const { data: favTeams, isLoading: teamLoading } = useGetFavoriteTeam();
  const favoriteTeam = (favTeams?.[0] as unknown as ITeamsResponse) ?? null;

  const removeFav = useRemoveFavoriteTeam();

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

  const handleStarClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!favoriteTeam) return;
    removeFav.mutate(favoriteTeam.id, {
      onSuccess: () => {
        setToast({
          message: `${favoriteTeam.name} removed from favorites`,
          type: "info",
        });
      },
      onError: () => {
        setToast({
          message: `Failed to remove ${favoriteTeam.name}`,
          type: "error",
        });
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-surface-container-low rounded-lg h-64 animate-pulse border border-[#00fe66]/30" />
    );
  }

  if (!favoriteTeam) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-outline-variant/30 p-6 text-center text-base text-on-surface-variant">
        No favorite team selected.
      </section>
    );
  }

  return (
    <>
      <section
        className="relative bg-surface-container-low rounded-lg border border-[#00fe66]/30 overflow-hidden cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={() => setShowDetail(true)}
      >
        <FavoriteButton isFavorite={true} onClick={handleStarClick} />

        <div className="p-6 bg-primary-container/5 border-b border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label text-[13px] uppercase tracking-widest text-primary-container">
              My Favorite Team
            </span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            {favoriteTeam.logo_url ? (
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={favoriteTeam.logo_url}
                  alt={favoriteTeam.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-lg bg-surface-container-highest p-1 border border-[#00fe66]/20 shadow-md transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  unoptimized
                  loading="eager"
                />
              </div>
            ) : (
              <ShieldCheck className="w-14 h-14 text-primary-container/40 flex-none" />
            )}
            <div>
              <h3 className="font-headline font-black text-3xl uppercase tracking-tighter group-hover:text-[#00ff66] transition-colors">
                {favoriteTeam.name}
              </h3>
              <p className="text-on-surface-variant text-base font-label uppercase">
                • {favoriteTeam.league_name || "League"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {recentForm.map((r, i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded font-headline font-bold flex items-center justify-center text-sm ${
                  r === "W"
                    ? "bg-primary-container text-on-primary shadow-[0_0_10px_rgba(0,255,102,0.3)]"
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
          <p className="font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
            Upcoming Fixtures
          </p>
          <div className="space-y-2">
            {upcomingFixes.length === 0 && (
              <p className="text-[13px] text-on-surface-variant italic">
                No upcoming matches.
              </p>
            )}
            {upcomingFixes.map((f) => {
              const isHome = f.home_team
                .toLowerCase()
                .includes(favoriteTeam.name.toLowerCase());
              const opp = isHome ? f.away_team : f.home_team;
              const d = new Date(f.date ?? "").toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              });
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between bg-surface-container-highest/30 px-3 py-2 rounded border border-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[12px] font-bold px-1.5 py-0.5 rounded ${isHome ? "bg-primary-container/20 text-[#00ff66]" : "bg-white/5 text-on-surface-variant"}`}
                    >
                      {isHome ? "H" : "A"}
                    </span>
                    <span className="text-[15px] font-medium truncate">
                      vs {opp}
                    </span>
                  </div>
                  <span className="text-[14px] text-on-surface-variant font-bold tabular-nums ml-2 shrink-0">
                    {d}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showDetail && (
        <TeamDetailModal
          team={favoriteTeam}
          onClose={() => setShowDetail(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
