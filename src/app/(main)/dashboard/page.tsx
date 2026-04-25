"use client";

import { FixturesStrip } from "@/components/common/Fixtures";
import { LatestResults } from "@/components/common/LatestResults";
import { FavoriteTeamSpotlight } from "@/components/ui/dashboard/FavoriteTeamSpotlight";
import { FavoritePlayers } from "@/components/ui/dashboard/FavoritePlayers";
import { NEURAL_PREDICTIONS } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary kinetic-grid min-h-screen">
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 relative z-10">
        <section className="space-y-4">
          <h2 className="font-headline font-bold text-lg md:text-xl uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary-container rounded-sm shadow-[0_0_8px_rgba(0,255,102,0.4)]" />
            Live Fixtures
          </h2>
          <FixturesStrip />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 md:gap-8">
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Latest Results
              </h2>
              <LatestResults />
            </section>

            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-5 bg-primary-container rounded-full" />
                Neural Predictions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {NEURAL_PREDICTIONS.map(
                  ({ home, away, homeLabel, awayLabel, winPct, drawPct }) => (
                    <div
                      key={home + away}
                      className="bg-surface-container-low p-4 md:p-6 rounded-lg border border-outline-variant/10 neon-glow"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className="font-headline font-medium text-sm">
                            {home}
                          </span>
                          <span className="text-on-surface-variant text-[10px] font-label">
                            VS
                          </span>
                          <span className="font-headline font-medium text-sm">
                            {away}
                          </span>
                        </div>
                        <span className="text-primary-container font-headline font-black text-lg md:text-xl">
                          {winPct}%{" "}
                          <span className="text-[9px] md:text-[10px] font-label align-middle uppercase ml-1 opacity-60">
                            Win Prob
                          </span>
                        </span>
                      </div>
                      <div className="flex h-3 rounded-full overflow-hidden bg-surface-container-highest">
                        <div
                          className="bg-primary-container h-full shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                          style={{ width: `${winPct}%` }}
                        />
                        <div
                          className="bg-outline-variant h-full"
                          style={{ width: `${drawPct}%` }}
                        />
                        <div className="bg-surface-bright h-full flex-1" />
                      </div>
                      <div className="flex justify-between mt-3 font-label text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest">
                        <span className="truncate max-w-[80px]">
                          {homeLabel}
                        </span>
                        <span>Draw</span>
                        <span className="truncate max-w-[80px] text-right">
                          {awayLabel}
                        </span>
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
