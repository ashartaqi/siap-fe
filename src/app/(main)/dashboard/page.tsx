"use client";

import React from "react";
import Link from "next/link";
import axiosClient from "@/lib/axiosClient";
import { Carousel } from "@/components/common/Carousel";
import { Heart, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { Match, Player, Club } from "@/types/football";
import { BASE } from "@/lib/footballUtils";
import { LeagueTableCarousel } from "@/components/common/LeagueStandings";
import { FixturesStrip } from "@/components/common/Fixtures";
import { LatestResults } from "@/components/common/LatestResults";

// ─── Favorite Team Spotlight ──────────────────────────────────────────────────

function FavoriteTeamSpotlight() {
  const [favoriteTeam, setFavoriteTeam] = React.useState<Club | null>(null);
  const [recentForm, setRecentForm] = React.useState<string[]>([]);
  const [upcomingFixes, setUpcomingFixes] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const _res = await axiosClient.get("/teams/fav");
        const favTeams = _res.data;
        if (favTeams && favTeams.length > 0) {
          const team = favTeams[0];
          setFavoriteTeam(team);

          const fetchRecent = async (role: string) => {
            const res = await fetch(
              `${BASE}/fixtures?limit=5&status_filter=FINISHED&${role}=${team.name}`,
            );
            return res.ok ? await res.json() : [];
          };
          const homeRecent = await fetchRecent("home_team");
          const awayRecent = await fetchRecent("away_team");
          const allRecent = [...homeRecent, ...awayRecent]
            .sort(
              (a: Match, b: Match) =>
                new Date(b.date ?? "").getTime() -
                new Date(a.date ?? "").getTime(),
            )
            .slice(0, 5);

          const form = allRecent.map((m: Match) => {
            const isHome = m.home_team
              .toLowerCase()
              .includes(team.name.toLowerCase());
            const winTeam = m.winner;
            if (winTeam === "DRAW") return "D";
            if (winTeam === "HOME_TEAM" && isHome) return "W";
            if (winTeam === "AWAY_TEAM" && !isHome) return "W";
            return "L";
          });
          setRecentForm(form.reverse());

          const fetchUpcoming = async (role: string) => {
            const res1 = await fetch(
              `${BASE}/fixtures?limit=5&status_filter=SCHEDULED&${role}=${team.name}`,
            );
            const res2 = await fetch(
              `${BASE}/fixtures?limit=5&status_filter=TIMED&${role}=${team.name}`,
            );
            const d1 = res1.ok ? await res1.json() : [];
            const d2 = res2.ok ? await res2.json() : [];
            return [...d1, ...d2];
          };
          const homeUp = await fetchUpcoming("home_team");
          const awayUp = await fetchUpcoming("away_team");
          const allUp = [...homeUp, ...awayUp]
            .filter((m: Match) => new Date(m.date ?? "") > new Date())
            .sort(
              (a: Match, b: Match) =>
                new Date(a.date ?? "").getTime() -
                new Date(b.date ?? "").getTime(),
            )
            .slice(0, 3);

          setUpcomingFixes(allUp);
        }
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
      <div className="bg-surface-container-low rounded-lg h-64 animate-pulse border border-[#00fe66]/30"></div>
    );
  }

  if (!favoriteTeam) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-[#474845]/30 p-6 text-center text-sm text-on-surface-variant">
        No favorite team selected.
      </section>
    );
  }

  return (
    <section className="bg-surface-container-low rounded-lg border border-[#00fe66]/30 overflow-hidden">
      <div className="p-6 bg-primary-container/5 border-b border-[#474845]/10">
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
                    : "bg-surface-container-highest text-on-surface-variant border border-[#474845]/20"
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

// ─── Favorite Player Card ─────────────────────────────────────────────────────

function PlayerItem({ player }: { player: Player }) {
  const [upcomingFixes, setUpcomingFixes] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadFixtures() {
      try {
        const teamName = player.club_name;
        const res1 = await fetch(
          `${BASE}/fixtures?limit=5&status_filter=SCHEDULED&home_team=${teamName}`,
        );
        const res2 = await fetch(
          `${BASE}/fixtures?limit=5&status_filter=TIMED&home_team=${teamName}`,
        );
        const home1 = res1.ok ? await res1.json() : [];
        const home2 = res2.ok ? await res2.json() : [];

        const res3 = await fetch(
          `${BASE}/fixtures?limit=5&status_filter=SCHEDULED&away_team=${teamName}`,
        );
        const res4 = await fetch(
          `${BASE}/fixtures?limit=5&status_filter=TIMED&away_team=${teamName}`,
        );
        const away1 = res3.ok ? await res3.json() : [];
        const away2 = res4.ok ? await res4.json() : [];

        const allUp = [...home1, ...home2, ...away1, ...away2]
          .filter((m: Match) => new Date(m.date ?? "") > new Date())
          .sort(
            (a: Match, b: Match) =>
              new Date(a.date ?? "").getTime() -
              new Date(b.date ?? "").getTime(),
          )
          .slice(0, 2); // get only next 2 fixtures!

        setUpcomingFixes(allUp);
      } catch (e) {
        console.error("Failed to load player fixtures", e);
      } finally {
        setLoading(false);
      }
    }
    loadFixtures();
  }, [player]);

  return (
    <div className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10 relative overflow-hidden mb-4">
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

function FavoritePlayers() {
  const [favoritePlayers, setFavoritePlayers] = React.useState<Player[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const _res = await axiosClient.get("/players/fav");
        const favPlayers = _res.data;
        if (favPlayers && favPlayers.length > 0) {
          setFavoritePlayers(favPlayers);
        }
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
      <div className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10 h-64 animate-pulse"></div>
    );
  }

  if (favoritePlayers.length === 0) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-[#474845]/30 p-6 text-center text-sm text-on-surface-variant">
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary kinetic-grid min-h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; }
        .kinetic-grid {
            background-image: 
                linear-gradient(to right, rgba(71, 72, 69, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(71, 72, 69, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .neon-glow:hover {
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.2);
            border-color: rgba(0, 255, 102, 0.4) !important;
        }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #242723; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FF66; }
        .league-scroll::-webkit-scrollbar { width: 4px; }
        .league-scroll::-webkit-scrollbar-track { background: transparent; }
        .league-scroll::-webkit-scrollbar-thumb { background: #242723; border-radius: 10px; }
        .league-scroll::-webkit-scrollbar-thumb:hover { background: #00FF66; }
      `,
        }}
      />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 relative z-10">
        {/* SECTION 1: Live + Upcoming Fixtures */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>
              Fixtures
            </h2>
          </div>
          <FixturesStrip />
        </section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Latest Match Results — last 7 days, FINISHED */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Latest Results
              </h2>
              <LatestResults />
            </section>

            {/* Neural Predictions */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Neural Predictions
              </h2>
              <div className="space-y-3">
                <div className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-medium text-sm">
                        ARS
                      </span>
                      <span className="text-on-surface-variant text-xs font-label">
                        VS
                      </span>
                      <span className="font-headline font-medium text-sm">
                        MCI
                      </span>
                    </div>
                    <span className="text-primary-container font-headline font-black text-xl">
                      68%{" "}
                      <span className="text-[10px] font-label align-middle uppercase ml-1">
                        Win Prob
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-3 rounded-full overflow-hidden bg-surface-container-highest">
                    <div
                      className="bg-primary-container h-full shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                      style={{ width: "68%" }}
                    ></div>
                    <div
                      className="bg-outline-variant h-full"
                      style={{ width: "12%" }}
                    ></div>
                    <div
                      className="bg-surface-bright h-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span>Arsenal Win</span>
                    <span>Draw</span>
                    <span>Man City Win</span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-medium text-sm">
                        LIV
                      </span>
                      <span className="text-on-surface-variant text-xs font-label">
                        VS
                      </span>
                      <span className="font-headline font-medium text-sm">
                        CHE
                      </span>
                    </div>
                    <span className="text-primary-container font-headline font-black text-xl">
                      54%{" "}
                      <span className="text-[10px] font-label align-middle uppercase ml-1">
                        Win Prob
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-3 rounded-full overflow-hidden bg-surface-container-highest">
                    <div
                      className="bg-primary-container h-full shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                      style={{ width: "54%" }}
                    ></div>
                    <div
                      className="bg-outline-variant h-full"
                      style={{ width: "26%" }}
                    ></div>
                    <div
                      className="bg-surface-bright h-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span>Liverpool Win</span>
                    <span>Draw</span>
                    <span>Chelsea Win</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-8">
            {/* Favorite Team Spotlight */}
            <FavoriteTeamSpotlight />

            {/* League Table */}
            <section className="space-y-4">
              <LeagueTableCarousel />
            </section>

            {/* Favorite Player Card(s) */}
            <FavoritePlayers />
          </aside>
        </div>
      </main>
    </div>
  );
}
