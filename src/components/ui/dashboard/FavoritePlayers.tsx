"use client";

import React from "react";
import Image from "next/image";
import axiosClient from "@/lib/axiosClient";
import { Carousel } from "@/components/common/Carousel";
import { useGetTeamUpcomingFixtures } from "@/features/main/football";
import type { Player } from "@/types/football";

function PlayerItem({ player }: { player: Player }) {
  const { data: upcomingFixes = [], isLoading: loading } =
    useGetTeamUpcomingFixtures(player.club_name, 2);

  return (
    <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 relative overflow-hidden mb-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="font-headline font-black text-lg uppercase mb-1 leading-tight break-words">
            {player.short_name}
          </h4>
          <div className="flex items-center gap-2">
            <p className="text-xs text-on-surface-variant uppercase truncate max-w-[160px]">
              {player.player_positions} | {player.club_name}
            </p>
            <span className="bg-primary-container text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
              {player.overall?.toString().padStart(2, "0")} OVR
            </span>
          </div>
        </div>
        {player.player_face_url && (
          <Image
            src={player.player_face_url}
            alt={player.short_name}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-full border-2 border-primary-container/20 shadow-lg flex-none"
          />
        )}
      </div>

      <div>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
          Upcoming Fixtures
        </p>
        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-on-surface-variant animate-pulse">
              Loading fixtures...
            </p>
          ) : upcomingFixes.length === 0 ? (
            <p className="text-xs text-on-surface-variant">
              No upcoming matches.
            </p>
          ) : (
            upcomingFixes.map((f) => {
              const isHome = f.home_team
                .toLowerCase()
                .includes(player.club_name.toLowerCase());
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
            })
          )}
        </div>
      </div>
    </div>
  );
}

export function FavoritePlayers() {
  const [favoritePlayers, setFavoritePlayers] = React.useState<Player[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await axiosClient.get("/players/fav");
        if (res.data?.length) setFavoritePlayers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 h-64 animate-pulse" />
    );
  }

  if (favoritePlayers.length === 0) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-outline-variant/30 p-6 text-center text-sm text-on-surface-variant">
        No favorite players selected.
      </section>
    );
  }

  return (
    <section>
      <Carousel
        title={
          <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Favorite Players
          </h3>
        }
        currentIndex={current}
        totalItems={favoritePlayers.length}
        onIndexChange={setCurrent}
        headerClassName="mb-4"
        dotsContainerClassName="-mt-2 mb-4"
      >
        <PlayerItem
          key={favoritePlayers[current].id}
          player={favoritePlayers[current]}
        />
      </Carousel>
    </section>
  );
}
