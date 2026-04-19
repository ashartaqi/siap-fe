"use client";

import { FixturesStrip } from "@/components/common/Fixtures";
import { LatestResults } from "@/components/common/LatestResults";
import { FavoriteTeamSpotlight } from "@/components/ui/dashboard/FavoriteTeamSpotlight";
import { FavoritePlayers } from "@/components/ui/dashboard/FavoritePlayers";

export default function DashboardPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary kinetic-grid min-h-screen">
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <section className="space-y-4">
          <h2 className="font-headline font-bold text-xl uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse" />
            Fixtures
          </h2>
          <FixturesStrip />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Latest Results
              </h2>
              <LatestResults />
            </section>

            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Neural Predictions
              </h2>
              <div className="space-y-3">
                {[
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
                ].map(
                  ({ home, away, homeLabel, awayLabel, winPct, drawPct }) => (
                    <div
                      key={home + away}
                      className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                          <span className="font-headline font-medium text-sm">
                            {home}
                          </span>
                          <span className="text-on-surface-variant text-xs font-label">
                            VS
                          </span>
                          <span className="font-headline font-medium text-sm">
                            {away}
                          </span>
                        </div>
                        <span className="text-primary-container font-headline font-black text-xl">
                          {winPct}%{" "}
                          <span className="text-[10px] font-label align-middle uppercase ml-1">
                            Win Prob
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 h-3 rounded-full overflow-hidden bg-surface-container-highest">
                        <div
                          className="bg-primary-container h-full shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                          style={{ width: `${winPct}%` }}
                        />
                        <div
                          className="bg-outline-variant h-full"
                          style={{ width: `${drawPct}%` }}
                        />
                        <div
                          className="bg-surface-bright h-full"
                          style={{ width: `${100 - winPct - drawPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                        <span>{homeLabel}</span>
                        <span>Draw</span>
                        <span>{awayLabel}</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <FavoriteTeamSpotlight />
            <FavoritePlayers />
          </aside>
        </div>
      </main>
    </div>
  );
}
