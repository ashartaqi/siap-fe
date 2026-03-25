"use client";

import React from "react";
import {
  Share2,
  Dumbbell,
  Zap,
  Footprints,
  Target,
  Shield,
} from "lucide-react";

export default function DreamPlayerPage() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary overflow-hidden h-screen w-full kinetic-grid flex items-center justify-center relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .kinetic-grid {
            background-image:
              linear-gradient(to right, rgba(71, 72, 69, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 72, 69, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
          }
          .player-glow {
            filter: drop-shadow(0 0 15px rgba(0, 255, 102, 0.4));
          }
          .stat-card-glass {
            background: rgba(18, 20, 17, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(169, 255, 172, 0.1);
          }
          .connector-line {
            background: linear-gradient(90deg, rgba(169, 255, 172, 0.4), transparent);
            height: 1px;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-slow-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-slow { animation: spin-slow 20s linear infinite; }
          .animate-spin-slow-reverse { animation: spin-slow-reverse 30s linear infinite; }
          .delay-700 { animation-delay: 700ms; }
          .delay-1000 { animation-delay: 1000ms; }
        `,
        }}
      />

      {/* Hero Identity */}
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-on-surface opacity-10">
          DREAM
          <br />
          PLAYER
        </h1>
      </div>

      {/* Main Interactive Canvas */}
      <main className="relative w-full max-w-7xl h-full flex flex-col md:flex-row items-center justify-center gap-8 px-6">
        {/* Left Stats Cluster */}
        <div className="flex flex-col gap-6 z-20 w-full md:w-auto order-2 md:order-1">
          {/* Passing */}
          <div className="group relative flex items-center gap-4 transition-transform hover:scale-105">
            <div className="stat-card-glass p-4 rounded-xl w-48 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                  Passing
                </span>
                <Share2 className="text-primary w-4 h-4" />
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                94
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00fe66] w-[94%]"></div>
              </div>
            </div>
            <div className="hidden md:block w-16 connector-line rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Physical */}
          <div className="group relative flex items-center gap-4 transition-transform hover:scale-105">
            <div className="stat-card-glass p-4 rounded-xl w-48 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                  Physical
                </span>
                <Dumbbell className="text-primary w-4 h-4" />
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                88
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00fe66] w-[88%]"></div>
              </div>
            </div>
            <div className="hidden md:block w-24 connector-line rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Pace */}
          <div className="group relative flex items-center gap-4 transition-transform hover:scale-105">
            <div className="stat-card-glass p-4 rounded-xl w-48 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                  Pace
                </span>
                <Zap className="text-primary w-4 h-4" />
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                97
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00fe66] w-[97%]"></div>
              </div>
            </div>
            <div className="hidden md:block w-32 connector-line rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Center Player */}
        <div className="relative flex-1 flex flex-col items-center justify-center h-2/3 md:h-full order-1 md:order-2">
          <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-primary/5 animate-spin-slow"></div>
          <div className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full border border-primary/10 animate-spin-slow-reverse"></div>
          <div className="relative z-10 h-full flex items-center">
            <img
              alt="Player Silhouette"
              className="h-[80%] md:h-[90%] object-contain player-glow mix-blend-screen brightness-125 saturate-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNDEJWQe0nPD_yN1t2Hg1SBgMI-dAIRD8YTLy0R27wpcj-qDt6F9Jh5Rx-hsHGaUnBcXkDqIvu3mkWYPzEL_yaTkSTGZilhl7e3X3VO5c3ZB_KwDnNGYC4Cfvh8ZjEob0Q7iBpUhflT2BjJOzoCyJbIFh0nwwfLIS_GYsHlez0tj0ZUrp61mT4kX7fntmredK2TWLq8I8sOEMIm_xFoDPW9QJJca6OufWq1WbkMqm-TneaNm4aeCGydW9B8XHe-Fr2pk4H6jkbl4g"
            />
          </div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-primary animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.8)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-primary animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.8)] delay-700"></div>
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-primary animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.8)] delay-1000"></div>
        </div>

        {/* Right Stats Cluster */}
        <div className="flex flex-col gap-6 z-20 w-full md:w-auto order-3">
          {/* Dribbling */}
          <div className="group relative flex items-center gap-4 transition-transform hover:scale-105">
            <div className="hidden md:block w-32 connector-line opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="stat-card-glass p-4 rounded-xl w-48 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                  Dribbling
                </span>
                <Footprints className="text-primary w-4 h-4" />
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                91
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00fe66] w-[91%]"></div>
              </div>
            </div>
          </div>

          {/* Shooting */}
          <div className="group relative flex items-center gap-4 transition-transform hover:scale-105">
            <div className="hidden md:block w-24 connector-line opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="stat-card-glass p-4 rounded-xl w-48 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] tracking-widests text-on-surface-variant uppercase">
                  Shooting
                </span>
                <Target className="text-primary w-4 h-4" />
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                95
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00fe66] w-[95%]"></div>
              </div>
            </div>
          </div>

          {/* Defending */}
          <div className="group relative flex items-center gap-4 transition-transform hover:scale-105">
            <div className="hidden md:block w-16 connector-line opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="stat-card-glass p-4 rounded-xl w-48 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                  Defending
                </span>
                <Shield className="text-primary w-4 h-4" />
              </div>
              <div className="font-headline text-3xl font-bold text-on-surface">
                62
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00fe66] w-[62%]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(13,15,12,0.8)_100%)]"></div>
    </div>
  );
}
