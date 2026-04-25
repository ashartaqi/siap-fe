"use client";

import { Trophy, Activity } from "lucide-react";
import { useGetFixtures } from "@/features/main/football";
import { groupMatchesByRound } from "@/lib/utils/footballUtils";
import { MatchNode } from "@/components/ui/ucl/MatchNode";
import { UCL_FOOTER_STATS } from "@/lib/constants";

export default function UCLPage() {
  const {
    data: matches = [],
    isLoading: loading,
    isError: error,
  } = useGetFixtures({ league: "CL", limit: 8 });

  const rounds = groupMatchesByRound(matches);
  const qfMatches = rounds[0] ?? [];
  const sfMatches = rounds[1] ?? [];
  const finalMatch = rounds[2]?.[0] ?? null;

  const qfLeft = qfMatches.slice(0, 2);
  const qfRight = qfMatches.slice(2, 4);
  const sfLeft = sfMatches[0] ?? null;
  const sfRight = sfMatches[1] ?? null;

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
      <div className="h-full min-h-0 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin w-12 h-12 rounded-full border-4 border-[rgba(100,160,255,0.4)] border-t-transparent" />
        <p className="animate-pulse text-[#7eb8ff] uppercase tracking-[0.15em] text-sm">
          Analyzing Roadmap...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center">
        <p className="text-[#60aaff] uppercase tracking-[0.1em]">
          Failed to load UCL data.
        </p>
      </div>
    );
  }

  return (
    <div className="ucl-page h-full min-h-0 flex flex-col overflow-hidden relative p-3 [overscroll-behavior:none] bg-cover bg-center bg-no-repeat bg-[url('/ucl_background.jpg')]">
      {/* Overlays */}
      <div className="absolute inset-0 bg-[rgba(2,8,30,0.62)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,8,30,0.92)_0%,transparent_28%,transparent_70%,rgba(2,8,30,0.92)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,8,30,0.70)_0%,transparent_22%,transparent_78%,rgba(2,8,30,0.70)_100%)] pointer-events-none" />
      <div className="absolute -top-[10%] -right-[5%] w-[700px] h-[700px] rounded-full pointer-events-none bg-[rgba(0,80,200,0.22)] blur-[160px]" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none bg-[rgba(0,50,160,0.18)] blur-[120px]" />
      <div className="absolute top-[40%] left-[38%] w-[500px] h-[500px] rounded-full pointer-events-none bg-[rgba(20,60,180,0.12)] blur-[200px]" />

      {/* Header */}
      <div className="relative z-10 shrink-0 mb-6 lg:mb-3 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 md:mb-3">
            <span className="px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#7eb8ff] bg-[rgba(0,80,200,0.2)] border border-[rgba(100,160,255,0.35)] shadow-[0_0_15px_rgba(0,80,200,0.15)]">
              UEFA Champions League
            </span>
            <div className="hidden sm:block h-px w-16 bg-[linear-gradient(to_right,rgba(100,160,255,0.5),transparent)]" />
          </div>
          <h1 className="font-headline italic text-[clamp(2rem,10vw,6rem)] font-black uppercase tracking-[-0.03em] leading-[0.9] bg-[linear-gradient(to_bottom,#e8f0ff_0%,#7eb8ff_55%,rgba(100,160,255,0.25)_100%)] bg-clip-text text-transparent">
            Road{" "}
            <span className="[-webkit-text-fill-color:#60aaff] drop-shadow-[0_0_22px_rgba(0,100,255,0.55)]">
              to Hungary
            </span>
          </h1>
          <p className="text-[#5a80b0] text-[11px] md:text-[13px] mt-3 max-w-[480px] uppercase tracking-[0.1em] leading-relaxed hidden sm:block">
            Follow the elite journey of the stars. Real-time tournament
            progression and team roadmap visualization.
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-[rgba(100,160,255,0.2)] backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] bg-[linear-gradient(135deg,rgba(10,25,70,0.75)_0%,rgba(5,15,45,0.85)_100%)]">
          <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#60aaff] drop-shadow-[0_0_12px_rgba(0,100,255,0.5)]" />
          <div>
            <p className="text-[#5a80b0] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 md:mb-1">
              Final Destination
            </p>
            <p className="text-[#c8dcff] text-[14px] md:text-[17px] font-black uppercase">
              Puskás Aréna • May 30
            </p>
          </div>
        </div>
      </div>

      {/* Bracket */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-start lg:justify-center overflow-x-auto lg:overflow-hidden px-4 py-8 custom-scrollbar-thin">
        <div className="w-full min-w-[1000px] lg:min-w-0 max-w-[1280px] h-full max-h-full grid grid-cols-5 items-center gap-2 mx-auto">
          {/* Col 1 — Left QF */}
          <div className="flex flex-col gap-4 min-h-0 justify-center">
            {qfLeft.map((m, i) => (
              <MatchNode key={m.id} match={m} round={`QF ${i + 1}`} />
            ))}
          </div>

          {/* Col 2 — Left SF */}
          <div className="flex justify-center">
            <div className="w-[90%]">
              {sfLeft && <MatchNode match={sfLeft} round="SEMIFINAL" />}
            </div>
          </div>

          {/* Col 3 — Final */}
          <div className="flex flex-col items-center py-2 min-h-0">
            <div className="animate-bounce mb-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#60aaff"
                stroke="#60aaff"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="w-full relative px-2">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-32 rounded-full bg-[rgba(0,80,200,0.1)] blur-[40px]" />
              {finalMatch ? (
                <MatchNode match={finalMatch} round="THE FINAL" />
              ) : (
                <div className="rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-[rgba(100,160,255,0.25)] backdrop-blur-xl bg-[linear-gradient(135deg,rgba(10,25,60,0.85)_0%,rgba(5,15,40,0.92)_100%)]">
                  <div className="px-3 py-1.5 border-b border-[rgba(100,160,255,0.15)] bg-[linear-gradient(90deg,rgba(0,80,200,0.5)_0%,rgba(0,40,120,0.3)_100%)]">
                    <span className="text-[#7eb8ff] text-[9px] font-bold uppercase tracking-[0.1em]">
                      THE FINAL
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    {["TBD", "TBD"].map((label, i) => (
                      <div key={i}>
                        {i === 1 && (
                          <div className="h-px bg-[rgba(100,160,255,0.08)] mb-2" />
                        )}
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[rgba(100,160,255,0.2)]" />
                          <span className="text-[#4a6a9a] text-[13px] font-bold uppercase tracking-[0.05em]">
                            {label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Col 4 — Right SF */}
          <div className="flex justify-center">
            <div className="w-[90%]">
              {sfRight && <MatchNode match={sfRight} round="SEMIFINAL" />}
            </div>
          </div>

          {/* Col 5 — Right QF */}
          <div className="flex flex-col gap-4 min-h-0 justify-center">
            {qfRight.map((m, i) => (
              <MatchNode key={m.id} match={m} round={`QF ${i + 3}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 shrink-0 mt-3 px-3 py-3 border-t border-[rgba(100,160,255,0.1)] flex flex-wrap justify-between items-center gap-6">
        <div className="flex gap-8">
          {footerStats.map(({ label, value, textClass }) => (
            <div key={label} className="flex flex-col">
              <span className="text-[#5a80b0] text-[9px] font-bold uppercase tracking-[0.1em] mb-1">
                {label}
              </span>
              <span className={`text-[20px] font-black italic ${textClass}`}>
                {String(value).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[#5a80b0] text-[10px] font-bold uppercase tracking-[0.1em]">
          <Activity size={12} className="text-[#60aaff]" />
          Syncing with UEFA Database
        </div>
      </div>
    </div>
  );
}
