"use client";

import { Trophy, Activity } from "lucide-react";
import { useGetFixtures } from "@/features/main/football";
import { transformKnockoutTies } from "@/lib/utils/footballUtils";
import { MatchNode } from "@/components/ui/ucl/MatchNode";
import { UCL_FOOTER_STATS } from "@/lib/constants";
import { UCLIcon } from "@/components/icons/UCLIcon";

export default function UCLPage() {
  const {
    data: matches = [],
    isLoading: loading,
    isError: error,
  } = useGetFixtures({ league: "CL" });

  const ties = transformKnockoutTies(matches);

  // Stage Assignment (NO HARDCODING TEAMS)
  // First 4 ties -> Quarter Finals
  // Next 2 ties -> Semi Finals
  // Last 1 tie -> Final
  const qfTies = ties.slice(0, 4);
  const sfTies = ties.slice(4, 6);
  const finalTie = ties[6] ?? null;

  // Mapping to UI positions
  const qfLeft = qfTies.slice(0, 2);
  const qfRight = qfTies.slice(2, 4);
  const sfLeft = sfTies[0] ?? null;
  const sfRight = sfTies[1] ?? null;

  const finished = matches.filter((m) => m.status === "FINISHED").length;
  const remaining = matches.filter(
    (m) =>
      m.status === "TIMED" ||
      m.status === "SCHEDULED" ||
      m.status === "IN_PLAY",
  ).length;

  const footerStats = [
    { ...UCL_FOOTER_STATS[0], value: finished },
    { ...UCL_FOOTER_STATS[1], value: remaining },
    { ...UCL_FOOTER_STATS[2], value: matches.length },
  ];

  if (loading) {
    return (
      <div className="h-full min-h-0 flex flex-col items-center justify-center gap-6 bg-[#02081e]">
        <div className="relative">
          <div className="absolute inset-0 bg-[#60aaff]/20 blur-[30px] rounded-full animate-pulse" />
          <UCLIcon
            size={80}
            className="text-[#60aaff] relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(96,170,255,0.4)]"
          />
        </div>
        <p className="animate-pulse text-[#7eb8ff] uppercase tracking-[0.25em] text-[10px] font-black italic">
          Fetching European Elite...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center bg-[#02081e]">
        <p className="text-[#60aaff] uppercase tracking-[0.1em] font-bold">
          Failed to load UCL data.
        </p>
      </div>
    );
  }

  return (
    <div className="ucl-page h-full min-h-0 flex flex-col overflow-hidden relative p-3 [overscroll-behavior:none] bg-cover bg-center bg-no-repeat bg-[url('/ucl_background.jpg')] bg-[#02081e]">
      {/* Overlays */}
      <div className="absolute inset-0 bg-[rgba(2,8,30,0.65)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,8,30,0.95)_0%,transparent_25%,transparent_75%,rgba(2,8,30,0.95)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,8,30,0.75)_0%,transparent_20%,transparent_80%,rgba(2,8,30,0.75)_100%)] pointer-events-none" />
      <div className="absolute -top-[10%] -right-[5%] w-[700px] h-[700px] rounded-full pointer-events-none bg-[rgba(0,80,200,0.25)] blur-[160px]" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none bg-[rgba(0,50,160,0.2)] blur-[120px]" />

      {/* Header */}
      <div className="relative z-10 shrink-0 mb-4 lg:mb-2 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 md:mb-3">
            <span className="px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#7eb8ff] bg-[rgba(0,80,200,0.2)] border border-[rgba(100,160,255,0.35)]">
              UEFA Champions League
            </span>
          </div>
          <h1 className="font-headline italic text-[clamp(2rem,8vw,5rem)] font-black uppercase tracking-[-0.03em] leading-[0.9] bg-[linear-gradient(to_bottom,#e8f0ff_0%,#7eb8ff_55%,rgba(100,160,255,0.25)_100%)] bg-clip-text text-transparent">
            Road{" "}
            <span className="[-webkit-text-fill-color:#60aaff] drop-shadow-[0_0_20px_rgba(0,100,255,0.5)]">
              to Hungary
            </span>
          </h1>
          <p className="text-[#5a80b0] text-[11px] md:text-[12px] mt-2 max-w-[450px] uppercase tracking-[0.1em] font-medium hidden sm:block">
            KNOCKOUT PHASE • 2023/24 SEASON
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-[rgba(100,160,255,0.15)] backdrop-blur-2xl shadow-2xl bg-[linear-gradient(135deg,rgba(10,25,70,0.8)_0%,rgba(5,15,45,0.9)_100%)]">
          <Trophy className="w-8 h-8 md:w-9 md:h-9 text-[#60aaff] drop-shadow-[0_0_10px_rgba(0,100,255,0.4)]" />
          <div>
            <p className="text-[#5a80b0] text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5">
              Grand Final
            </p>
            <p className="text-[#c8dcff] text-[13px] md:text-[15px] font-black uppercase">
              Puskás arena - budapest • May 30
            </p>
          </div>
        </div>
      </div>

      {/* Bracket */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-start lg:justify-center overflow-x-auto lg:overflow-hidden px-4 py-4 custom-scrollbar-thin">
        <div className="w-full min-w-[1100px] lg:min-w-0 max-w-[1400px] h-full max-h-full grid grid-cols-5 items-center gap-4 mx-auto">
          {/* Col 1 — Left QF */}
          <div className="flex flex-col gap-8 min-h-0 justify-center">
            {qfLeft.map((tie, i) => (
              <div key={tie.id} className="relative">
                <MatchNode tie={tie} round={`QUARTER FINAL`} />
                {/* Connector to SF */}
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-[rgba(100,160,255,0.2)]" />
              </div>
            ))}
          </div>

          {/* Col 2 — Left SF */}
          <div className="flex justify-center relative">
            {/* Vertical connector from QFs */}
            <div className="absolute -left-4 top-1/4 bottom-1/4 w-[2px] bg-[rgba(100,160,255,0.2)]" />
            <div className="w-full relative">
              {sfLeft ? (
                <MatchNode tie={sfLeft} round="SEMI FINAL" />
              ) : (
                <EmptyNode round="SEMI FINAL" />
              )}
              {/* Connector to Final */}
              <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-[rgba(100,160,255,0.2)]" />
            </div>
          </div>

          {/* Col 3 — Final */}
          <div className="flex flex-col items-center py-2 min-h-0">
            <div className="animate-pulse mb-4">
              <Trophy
                size={32}
                className="text-[#60aaff] drop-shadow-[0_0_15px_rgba(0,100,255,0.6)]"
              />
            </div>
            <div className="w-full relative px-2">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-32 rounded-full bg-[rgba(0,80,200,0.15)] blur-[50px] pointer-events-none" />
              {finalTie ? (
                <MatchNode tie={finalTie} round="THE FINAL" />
              ) : (
                <EmptyNode round="THE FINAL" />
              )}
            </div>
          </div>

          {/* Col 4 — Right SF */}
          <div className="flex justify-center relative">
            <div className="w-full relative">
              {/* Connector from Final */}
              <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-[rgba(100,160,255,0.2)]" />
              {sfRight ? (
                <MatchNode tie={sfRight} round="SEMI FINAL" />
              ) : (
                <EmptyNode round="SEMI FINAL" />
              )}
              {/* Vertical connector to QFs */}
              <div className="absolute -right-4 top-1/4 bottom-1/4 w-[2px] bg-[rgba(100,160,255,0.2)]" />
            </div>
          </div>

          {/* Col 5 — Right QF */}
          <div className="flex flex-col gap-8 min-h-0 justify-center">
            {qfRight.map((tie, i) => (
              <div key={tie.id} className="relative">
                {/* Connector from SF */}
                <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-[rgba(100,160,255,0.2)]" />
                <MatchNode tie={tie} round={`QUARTER FINAL`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 shrink-0 mt-2 px-4 py-3 border-t border-[rgba(100,160,255,0.1)] flex justify-between items-center bg-[rgba(2,8,30,0.4)] backdrop-blur-md">
        <div className="flex gap-10">
          {footerStats.map(({ label, value, textClass }) => (
            <div key={label} className="flex flex-col">
              <span className="text-[#5a80b0] text-[9px] font-bold uppercase tracking-[0.2em] mb-1">
                {label}
              </span>
              <span
                className={`text-[22px] font-black italic tracking-tighter ${textClass}`}
              >
                {String(value).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5 text-[#5a80b0] text-[10px] font-bold uppercase tracking-[0.15em]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#60aaff] animate-pulse shadow-[0_0_8px_rgba(96,170,255,0.8)]" />
          Live Tournament Data
        </div>
      </div>
    </div>
  );
}

function EmptyNode({ round }: { round: string }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-[rgba(100,160,255,0.15)] backdrop-blur-2xl bg-[linear-gradient(135deg,rgba(10,25,60,0.8)_0%,rgba(5,15,40,0.9)_100%)] w-full opacity-60">
      <div className="px-3 py-1.5 border-b border-[rgba(100,160,255,0.1)] bg-[rgba(0,80,200,0.2)]">
        <span className="text-[#7eb8ff] text-[8px] font-bold uppercase tracking-[0.2em]">
          {round}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[rgba(100,160,255,0.1)]" />
          <div className="h-2 w-20 bg-[rgba(100,160,255,0.05)] rounded" />
        </div>
        <div className="h-px bg-[rgba(100,160,255,0.05)]" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[rgba(100,160,255,0.1)]" />
          <div className="h-2 w-24 bg-[rgba(100,160,255,0.05)] rounded" />
        </div>
      </div>
    </div>
  );
}
