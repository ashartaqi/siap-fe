"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  UserStar,
  Table2,
} from "lucide-react";
import { UCLIcon } from "@/components/icons/UCLIcon";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isUCL = pathname === "/UCL";

  return (
    <div
      className="flex min-h-screen font-body"
      style={
        isUCL
          ? ({
              "--color-black": "#0b0f2a",
              "--color-surface": "#111a3a",
              "--color-border": "#1f2d5c",
              "--color-text": "#e6ecff",
              "--color-text-muted": "#8fa4ff",
              "--color-neon": "#4cc9f0",
              background:
                "radial-gradient(circle at 20% 20%, #1e40af 0%, #0b0f2a 60%)",
            } as React.CSSProperties)
          : undefined
      }
    >
      <nav className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-neon)] flex items-center justify-center shrink-0 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
            <svg
              viewBox="0 0 24 24"
              className="w-[18px] h-[18px] fill-[var(--color-black)]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="font-display text-2xl tracking-[2px] text-[var(--color-text)] uppercase mt-1">
            SI<span className="text-[var(--color-neon)]">A</span>P
          </div>
        </div>

        <ul className="space-y-1.5 flex-1">
          <li>
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-all"
            >
              <LayoutDashboard
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />
              DASHBOARD
            </Link>
          </li>

          <li>
            <Link
              href="/dream-player"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-all"
            >
              <UserStar
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />
              DREAM PLAYER
            </Link>
          </li>

          <li>
            <Link
              href="/dream-team"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-all"
            >
              <Users
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />
              DREAM TEAM
            </Link>
          </li>

          <li>
            <Link
              href="/league-standings"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-all"
            >
              <Table2
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />
              LEAGUE STANDINGS
            </Link>
          </li>

          <li>
            <Link
              href="/UCL"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-all"
            >
              <UCLIcon
                size={18}
                className="group-hover:fill-[var(--color-neon)] transition-colors"
              />
              UCL
            </Link>
          </li>

          <li>
            <Link
              href="/settings"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)] rounded-lg transition-all"
            >
              <Settings
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />
              SETTINGS
            </Link>
          </li>
        </ul>
      </nav>

      <main
        className={`flex-1 p-8 bg-[var(--color-black)] text-[var(--color-text)] ${
          isUCL ? "overflow-hidden h-screen" : "overflow-y-auto h-screen"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
