"use client";

import { FixturesStrip } from "@/components/common/Fixtures";
import { LatestResults } from "@/components/common/LatestResults";
import { FavoriteTeamSpotlight } from "@/components/ui/dashboard/FavoriteTeamSpotlight";
import { FavoritePlayers } from "@/components/ui/dashboard/FavoritePlayers";

export default function DashboardPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary kinetic-grid min-h-screen">
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 relative z-10">
        <section className="space-y-4">
          <h2 className="font-headline font-bold text-xl md:text-2xl uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary-container rounded-sm shadow-[0_0_8px_rgba(0,255,102,0.4)]" />
            Live Fixtures
          </h2>
          <FixturesStrip />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 md:gap-8">
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest">
                Latest Results
              </h2>
              <LatestResults />
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
