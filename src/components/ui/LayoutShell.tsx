"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearToken } from "@/lib/auth/token";
import { NAV_ITEMS } from "@/lib/navItems";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isUCL = pathname === "/UCL";

  const handleLogout = async () => {
    await clearToken();
    router.push("/login");
  };

  const navClasses = `
    ${isCollapsed ? "w-20" : "w-64"} 
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    fixed lg:relative z-50 h-screen
    border-r border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col gap-8 
    transition-all duration-300 ease-in-out
  `;

  return (
    <div
      className={`flex font-body ${isUCL ? "h-screen overflow-hidden" : "min-h-screen"} bg-[var(--color-black)]`}
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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-neon)] flex items-center justify-center shrink-0 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
            <svg
              viewBox="0 0 24 24"
              className="w-[18px] h-[18px] fill-[var(--color-black)]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display text-xl tracking-[1px] text-[var(--color-text)] uppercase mt-1">
            SI<span className="text-[var(--color-neon)]">A</span>P
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-neon)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-none stroke-current stroke-2"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className={navClasses}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center gap-3 transition-all duration-300 hover:opacity-80 active:scale-95"
        >
          <div className="w-8 h-8 bg-[var(--color-neon)] flex items-center justify-center shrink-0 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
            <svg
              viewBox="0 0 24 24"
              className="w-[18px] h-[18px] fill-[var(--color-black)]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="font-display text-2xl tracking-[2px] text-[var(--color-text)] uppercase mt-1 animate-in fade-in duration-300">
              SI<span className="text-[var(--color-neon)]">A</span>P
            </div>
          )}
        </button>

        <ul className="space-y-1.5 flex-1">
          {NAV_ITEMS.map(({ href, label, Icon, iconHoverClass }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={isCollapsed ? label : undefined}
                  className={`group flex items-center ${isCollapsed ? "lg:justify-center" : "gap-3 px-4"} py-3 text-[13px] font-condensed font-semibold rounded-lg transition-all ${
                    active
                      ? "text-[var(--color-neon)] bg-[rgba(59,130,246,0.08)] border-l-2 border-[var(--color-neon)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(59,130,246,0.08)]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors shrink-0 ${active ? "stroke-[var(--color-neon)]" : iconHoverClass}`}
                  />
                  {(!isCollapsed || isMobileMenuOpen) && (
                    <span className="animate-in fade-in lg:slide-in-from-left-2 duration-300">
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`group flex items-center ${isCollapsed ? "lg:justify-center" : "gap-3 px-4"} w-full py-3 text-[13px] font-condensed font-semibold text-[#ff4444] hover:text-[#ff6666] hover:bg-[rgba(255,68,68,0.08)] rounded-lg border border-[rgba(255,68,68,0.2)] hover:border-[rgba(255,68,68,0.4)] transition-all`}
        >
          <LogOut size={18} className="transition-colors shrink-0" />
          {(!isCollapsed || isMobileMenuOpen) && (
            <span className="animate-in fade-in lg:slide-in-from-left-2 duration-300">
              LOGOUT
            </span>
          )}
        </button>
      </nav>

      <main
        className={`flex-1 p-4 md:p-8 pt-20 lg:pt-8 bg-[var(--color-black)] text-[var(--color-text)] ${
          isUCL ? "min-h-0 overflow-hidden" : "overflow-y-auto h-screen"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
