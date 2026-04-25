"use client";

import { Suspense } from "react";

function TeamsPageContent() {
  return (
    <div className="min-h-screen bg-[#0a0b09] text-[#fcfcf8] font-[Oxanium,sans-serif]">
      {/* ── Page Header ── */}
      <div className="border-b border-[rgba(71,72,69,0.2)] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-[Bebas_Neue,sans-serif] text-[28px] tracking-[0.06em] text-[#fcfcf8]">
            Teams Database
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 max-w-[1600px] mx-auto">
        {/* ── Teams Grid Placeholder ── */}
        <main className="flex-1 p-5">
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-14 h-14 rounded-full border border-[rgba(71,72,69,0.3)] flex items-center justify-center text-2xl mb-2">
              🛡️
            </div>
            <p className="font-[Bebas_Neue,sans-serif] text-[22px] tracking-[0.06em] text-[rgba(255,255,255,0.3)]">
              Teams Database Coming Soon
            </p>
            <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[0.08em] max-w-xs">
              We are working on bringing you the most comprehensive teams
              database.
            </p>
          </div>
        </main>
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
