"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearToken } from "@/lib/auth/token";
import { NAV_ITEMS } from "@/lib/navItems";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isUCL = pathname === "/UCL";

  const handleLogout = async () => {
    await clearToken();
    router.push("/login");
  };

  return (
    <div
      className={`flex font-body ${isUCL ? "h-screen overflow-hidden" : "min-h-screen"}`}
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
          {NAV_ITEMS.map(({ href, label, Icon, iconHoverClass }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-3 px-4 py-3 text-[13px] font-condensed font-semibold rounded-lg transition-all ${
                    active
                      ? "text-[var(--color-neon)] bg-[rgba(59,130,246,0.08)] border-l-2 border-[var(--color-neon)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors ${active ? "stroke-[var(--color-neon)]" : iconHoverClass}`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-4 py-3 text-[13px] font-condensed font-semibold text-[#ff4444] hover:text-[#ff6666] hover:bg-[rgba(255,68,68,0.08)] rounded-lg border border-[rgba(255,68,68,0.2)] hover:border-[rgba(255,68,68,0.4)] transition-all"
        >
          <LogOut size={18} className="transition-colors" />
          LOGOUT
        </button>
      </nav>

      <main
        className={`flex-1 p-8 bg-[var(--color-black)] text-[var(--color-text)] ${
          isUCL ? "min-h-0 overflow-hidden" : "overflow-y-auto h-screen"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
