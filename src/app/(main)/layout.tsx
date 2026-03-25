import React from "react";
import Link from "next/link";
import { LayoutDashboard, Settings, Users, UserStar } from "lucide-react";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-black)] text-[var(--color-text)] font-body">
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
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(0,255,127,0.05)] rounded-lg transition-all"
            >
              <LayoutDashboard
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />{" "}
              DASHBOARD
            </Link>
          </li>
          <li>
            <Link
              href="/DreamPlayer"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(0,255,127,0.05)] rounded-lg transition-all"
            >
              <UserStar
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />{" "}
              DREAM PLAYER
            </Link>
          </li>
          <li>
            <Link
              href="/DreamTeam"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(0,255,127,0.05)] rounded-lg transition-all"
            >
              <Users
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />{" "}
              DREAM TEAM
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(0,255,127,0.05)] rounded-lg transition-all"
            >
              <Settings
                size={18}
                className="group-hover:stroke-[var(--color-neon)] transition-colors"
              />{" "}
              SETTINGS
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
