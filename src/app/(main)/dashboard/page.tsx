"use client";

import React from "react";
import { Star, BarChart } from "lucide-react";
import { Heart, CircleDot, ShieldCheck, Timer } from "lucide-react";

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
      `,
        }}
      />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 relative z-10">
        {/* SECTION 1: Current Fixtures (Horizontal Scroll) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>
              Live Fixtures
            </h2>
            <span className="font-label text-xs text-on-surface-variant uppercase">
              Updated 2s ago
            </span>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
            {/* Match Card 1 */}
            <div className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-primary-container px-2 py-0.5 bg-primary-container/10 rounded uppercase">
                  Live 64
                </span>
                <Star className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">ARS</span>
                  <span className="font-headline font-bold text-lg">2</span>
                </div>
                <div className="flex justify-between items-center text-on-surface/40">
                  <span className="font-headline font-medium text-sm">MCI</span>
                  <span className="font-headline font-bold text-lg">1</span>
                </div>
              </div>
            </div>
            {/* Match Card 2 */}
            <div className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                  20:00 GMT
                </span>
                <Star className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">LIV</span>
                  <span className="font-headline font-bold text-lg text-on-surface-variant">
                    -
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">CHE</span>
                  <span className="font-headline font-bold text-lg text-on-surface-variant">
                    -
                  </span>
                </div>
              </div>
            </div>
            {/* Match Card 3 */}
            <div className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-primary-container px-2 py-0.5 bg-primary-container/10 rounded uppercase">
                  Live 12
                </span>
                <Star className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">TOT</span>
                  <span className="font-headline font-bold text-lg">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">NEW</span>
                  <span className="font-headline font-bold text-lg">0</span>
                </div>
              </div>
            </div>
            {/* Match Card 4 */}
            <div className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                  Full Time
                </span>
                <Star className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">MUN</span>
                  <span className="font-headline font-bold text-lg">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-headline font-medium text-sm">BHA</span>
                  <span className="font-headline font-bold text-lg">3</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Latest Match Results */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Latest Results
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 border-l-4 border-[#00fe66] flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase">
                      Sat, 14 Oct
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-primary-container">
                        W
                      </span>
                      <span className="font-headline text-sm">
                        Liverpool 3 - 0 Everton
                      </span>
                    </div>
                  </div>
                  <BarChart className="w-5 h-5 text-on-surface-variant group-hover:text-primary-container transition-colors" />
                </div>
                <div className="bg-surface-container-low p-4 border-l-4 border-[#ff7351] flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase">
                      Sat, 14 Oct
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-error">
                        L
                      </span>
                      <span className="font-headline text-sm">
                        Wolves 1 - 2 Aston Villa
                      </span>
                    </div>
                  </div>
                  <BarChart className="w-5 h-5 text-on-surface-variant group-hover:text-primary-container transition-colors" />
                </div>
                <div className="bg-surface-container-low p-4 border-l-4 border-[#474845] flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase">
                      Sun, 15 Oct
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-on-surface-variant">
                        D
                      </span>
                      <span className="font-headline text-sm">
                        Fulham 0 - 0 Palace
                      </span>
                    </div>
                  </div>
                  <BarChart className="w-5 h-5 text-on-surface-variant group-hover:text-primary-container transition-colors" />
                </div>
                <div className="bg-surface-container-low p-4 border-l-4 border-[#00fe66] flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase">
                      Sun, 15 Oct
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-primary-container">
                        W
                      </span>
                      <span className="font-headline text-sm">
                        Chelsea 4 - 1 Burnley
                      </span>
                    </div>
                  </div>
                  <BarChart className="w-5 h-5 text-on-surface-variant group-hover:text-primary-container transition-colors" />
                </div>
              </div>
            </section>

            {/* Top Scorers */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Top Scorers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-low border border-[#00fe66]/20 p-6 rounded-lg relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <span className="font-headline font-black text-6xl text-primary-container/20">
                      01
                    </span>
                    <div>
                      <h3 className="font-headline font-black text-2xl uppercase tracking-tight">
                        E. Haaland
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Manchester City
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-headline font-black text-4xl text-primary-container">
                        12
                      </span>
                      <span className="font-label text-xs uppercase text-on-surface-variant mb-1">
                        Goals
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div className="h-full bg-primary-container shadow-[0_0_8px_rgba(0,255,102,0.6)] w-[85%]"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low border border-[#474845]/20 p-6 rounded-lg relative group">
                  <div className="relative z-10 space-y-4">
                    <span className="font-headline font-black text-6xl text-on-surface-variant/20">
                      02
                    </span>
                    <div>
                      <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                        M. Salah
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Liverpool FC
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-headline font-black text-4xl text-on-surface">
                        09
                      </span>
                      <span className="font-label text-xs uppercase text-on-surface-variant mb-1">
                        Goals
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div className="h-full bg-on-surface-variant w-[65%]"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low border border-[#474845]/20 p-6 rounded-lg relative group">
                  <div className="relative z-10 space-y-4">
                    <span className="font-headline font-black text-6xl text-on-surface-variant/20">
                      03
                    </span>
                    <div>
                      <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                        Son H.M.
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Tottenham
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-headline font-black text-4xl text-on-surface">
                        07
                      </span>
                      <span className="font-label text-xs uppercase text-on-surface-variant mb-1">
                        Goals
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div className="h-full bg-on-surface-variant w-[45%]"></div>
                    </div>
                  </div>
                </div>
              </div>
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
            <section className="bg-surface-container-low rounded-lg border border-[#00fe66]/30 overflow-hidden">
              <div className="p-6 bg-primary-container/5 border-b border-[#474845]/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
                    My Favorite Team
                  </span>
                  <Heart className="w-4 h-4 text-primary-container fill-primary-container" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-headline font-black text-2xl uppercase tracking-tighter">
                      Arsenal FC
                    </h3>
                    <p className="text-on-surface-variant text-sm font-label uppercase">
                      1st • Premier League
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="w-8 h-8 rounded bg-primary-container text-on-primary font-headline font-bold flex items-center justify-center text-xs">
                    W
                  </span>
                  <span className="w-8 h-8 rounded bg-primary-container text-on-primary font-headline font-bold flex items-center justify-center text-xs">
                    W
                  </span>
                  <span className="w-8 h-8 rounded bg-primary-container text-on-primary font-headline font-bold flex items-center justify-center text-xs">
                    W
                  </span>
                  <span className="w-8 h-8 rounded bg-surface-container-highest text-on-surface-variant font-headline font-bold flex items-center justify-center text-xs border border-[#474845]/20">
                    D
                  </span>
                  <span className="w-8 h-8 rounded bg-primary-container text-on-primary font-headline font-bold flex items-center justify-center text-xs">
                    W
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Upcoming Fixtures
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">
                      vs Sevilla (A)
                    </span>
                    <span className="font-medium">Tue, 24 Oct</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">
                      vs Sheff Utd (H)
                    </span>
                    <span className="font-medium">Sat, 28 Oct</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">
                      vs West Ham (A)
                    </span>
                    <span className="font-medium">Wed, 01 Nov</span>
                  </div>
                </div>
              </div>
            </section>

            {/* League Table */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                League Table
              </h2>
              <div className="bg-surface-container-low rounded-lg overflow-hidden border border-[#474845]/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-[#474845]/10">
                      <th className="p-4 font-bold">Pos</th>
                      <th className="p-4 font-bold">Club</th>
                      <th className="p-4 font-bold text-center">P</th>
                      <th className="p-4 font-bold text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="bg-primary-container/5 border-b border-[#474845]/5">
                      <td className="p-4 font-headline font-bold text-primary-container">
                        01
                      </td>
                      <td className="p-4 font-medium uppercase tracking-tighter">
                        Arsenal
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">
                        8
                      </td>
                      <td className="p-4 text-right font-bold">20</td>
                    </tr>
                    <tr className="bg-primary-container/5 border-b border-[#474845]/5">
                      <td className="p-4 font-headline font-bold text-primary-container">
                        02
                      </td>
                      <td className="p-4 font-medium uppercase tracking-tighter">
                        Tottenham
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">
                        8
                      </td>
                      <td className="p-4 text-right font-bold">20</td>
                    </tr>
                    <tr className="bg-primary-container/5 border-b border-[#474845]/5">
                      <td className="p-4 font-headline font-bold text-primary-container">
                        03
                      </td>
                      <td className="p-4 font-medium uppercase tracking-tighter">
                        Man City
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">
                        8
                      </td>
                      <td className="p-4 text-right font-bold">18</td>
                    </tr>
                    <tr className="border-b border-[#474845]/5">
                      <td className="p-4 font-headline font-bold text-on-surface-variant">
                        04
                      </td>
                      <td className="p-4 font-medium uppercase tracking-tighter">
                        Liverpool
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">
                        8
                      </td>
                      <td className="p-4 text-right font-bold">17</td>
                    </tr>
                    <tr>
                      <td
                        className="p-2 bg-surface-container-highest/20 text-center text-[8px] uppercase tracking-[0.2em] text-on-surface-variant"
                        colSpan={4}
                      >
                        Relegation Zone
                      </td>
                    </tr>
                    <tr className="bg-error/5 border-t border-[#474845]/5">
                      <td className="p-4 font-headline font-bold text-error">
                        18
                      </td>
                      <td className="p-4 font-medium uppercase tracking-tighter opacity-60">
                        Burnley
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">
                        8
                      </td>
                      <td className="p-4 text-right font-bold">4</td>
                    </tr>
                    <tr className="bg-error/5 border-t border-[#474845]/5">
                      <td className="p-4 font-headline font-bold text-error">
                        19
                      </td>
                      <td className="p-4 font-medium uppercase tracking-tighter opacity-60">
                        Bournemouth
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">
                        8
                      </td>
                      <td className="p-4 text-right font-bold">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Favorite Player Card */}
            <section className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10 relative overflow-hidden">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
                Player Focus
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h4 className="font-headline font-black text-lg uppercase">
                    B. Saka
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Right Winger | ARS
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                    <span>Passing Accuracy</span>
                    <span className="text-primary-container">89%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest">
                    <div className="h-full bg-primary-container w-[89%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                    <span>Successful Dribbles</span>
                    <span className="text-primary-container">74%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest">
                    <div className="h-full bg-primary-container w-[74%]"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-surface-container-highest p-3 rounded text-center">
                    <span className="block font-headline font-black text-xl">
                      05
                    </span>
                    <span className="text-[8px] uppercase text-on-surface-variant font-bold tracking-widest">
                      Goals
                    </span>
                  </div>
                  <div className="bg-surface-container-highest p-3 rounded text-center">
                    <span className="block font-headline font-black text-xl">
                      04
                    </span>
                    <span className="text-[8px] uppercase text-on-surface-variant font-bold tracking-widest">
                      Assists
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* League Average */}
            <section className="bg-surface-container-low p-6 rounded-lg space-y-6">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest border-b border-[#474845]/10 pb-4">
                League Average
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CircleDot className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-xs font-medium uppercase text-on-surface-variant">
                      Avg Goals / Game
                    </span>
                  </div>
                  <span className="font-headline font-bold text-primary-container">
                    2.84
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-xs font-medium uppercase text-on-surface-variant">
                      Clean Sheets
                    </span>
                  </div>
                  <span className="font-headline font-bold text-primary-container">
                    22%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-xs font-medium uppercase text-on-surface-variant">
                      Effective Play
                    </span>
                  </div>
                  <span className="font-headline font-bold text-primary-container">
                    56m
                  </span>
                </div>
              </div>
              <div className="pt-4 space-y-3">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
                  Trending Now
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-medium border border-[#474845]/10 cursor-pointer hover:border-[#00fe66]/40">
                    #NorthLondonDerby
                  </span>
                  <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-medium border border-[#474845]/10 cursor-pointer hover:border-[#00fe66]/40">
                    #HaalandRecord
                  </span>
                  <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-medium border border-[#474845]/10 cursor-pointer hover:border-[#00fe66]/40">
                    #VARAnalysis
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
