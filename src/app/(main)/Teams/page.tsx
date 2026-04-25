"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Image from "next/image";
import {
  useInfiniteTeams,
  ITeamsResponse,
  ITeamsPayload,
} from "@/features/main/dashboard";

// ── StatBadge ─────────────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value?: number }) {
  const pct = value ?? 0;
  const color =
    pct >= 80
      ? "text-[#00ff66] border-[rgba(0,255,102,0.25)]"
      : pct >= 65
        ? "text-[#ffd700] border-[rgba(255,215,0,0.2)]"
        : "text-[rgba(255,80,80,0.85)] border-[rgba(255,80,80,0.2)]";

  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-md px-1.5 py-1 min-w-[38px] ${color}`}
    >
      <span className="text-[14px] font-[Bebas_Neue,sans-serif] leading-none">
        {value ?? "—"}
      </span>
      <span className="text-[7px] font-bold tracking-[0.15em] uppercase mt-0.5 opacity-60">
        {label}
      </span>
    </div>
  );
}

// ── TeamCard ──────────────────────────────────────────────────────────────────

function TeamCard({ team }: { team: ITeamsResponse }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="
        relative bg-[rgba(18,20,17,0.92)] border border-[rgba(71,72,69,0.2)]
        hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.03)]
        rounded-xl overflow-hidden transition-all duration-200 flex flex-col
        cursor-pointer group
      "
    >
      {/* Top: Logo + Identity */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(71,72,69,0.12)]">
        <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center p-1">
          {team.logo_url && !imgErr ? (
            <Image
              src={team.logo_url}
              alt={team.name}
              width={52}
              height={52}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              unoptimized
              onError={() => setImgErr(true)}
            />
          ) : (
            <span className="text-[rgba(0,255,102,0.3)] text-2xl">🛡️</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-[Bebas_Neue,sans-serif] text-[20px] text-[#fcfcf8] leading-none truncate">
              {team.name}
            </span>
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 tracking-[0.05em] truncate">
            {team.league_name} · {team.nationality_name}
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.25)] mt-0.5 tracking-[0.05em] truncate">
            🏟️ {team.home_stadium}
          </div>
        </div>

        <div className="font-[Bebas_Neue,sans-serif] text-[38px] text-[#00ff66] leading-none shrink-0">
          {team.overall}
        </div>
      </div>

      {/* Bottom: stats */}
      <div className="flex gap-2 px-4 py-3 justify-around">
        <StatBadge label="ATT" value={team.attack} />
        <StatBadge label="MID" value={team.midfield} />
        <StatBadge label="DEF" value={team.defence} />
      </div>
    </div>
  );
}

// ── Teams Page Content ────────────────────────────────────────────────────────

function TeamsPageContent() {
  const observerTarget = useRef<HTMLDivElement>(null);

  const payload: ITeamsPayload = {
    limit: 50,
  };

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTeams(payload);

  const teams = useMemo(() => data?.pages.flat() || [], [data?.pages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-[#0a0b09] text-[#fcfcf8] font-[Oxanium,sans-serif]">
      {/* ── Page Header ── */}
      <div className="border-b border-[rgba(71,72,69,0.2)] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-[Bebas_Neue,sans-serif] text-[28px] tracking-[0.06em] text-[#fcfcf8]">
            Teams Database
          </h1>
          {isFetching && (
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2.5 py-1 rounded-[4px] animate-pulse">
              Updating…
            </span>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-5">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-[rgba(18,20,17,0.6)] rounded-xl h-[138px] animate-pulse border border-[rgba(71,72,69,0.1)]"
              />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-14 h-14 rounded-full border border-[rgba(71,72,69,0.3)] flex items-center justify-center text-2xl mb-2">
              🔍
            </div>
            <p className="font-[Bebas_Neue,sans-serif] text-[22px] tracking-[0.06em] text-[rgba(255,255,255,0.3)]">
              No Teams Found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
            {(hasNextPage || isFetchingNextPage) && (
              <div
                ref={observerTarget}
                className="h-20 w-full mt-4 flex items-center justify-center"
              >
                <div className="w-6 h-6 border-2 border-[#00ff66] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0b09] flex items-center justify-center text-[#00ff66] font-[Bebas_Neue]">
          Loading...
        </div>
      }
    >
      <TeamsPageContent />
    </Suspense>
  );
}
