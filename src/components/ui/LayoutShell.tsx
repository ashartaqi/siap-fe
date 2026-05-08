"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronDown, ChevronRight, Coins } from "lucide-react";
import { clearToken } from "@/lib/auth/token";
import { logout } from "@/features/auth/apis/logout";
import { NAV_ITEMS } from "@/lib/navItems";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { useRewards } from "@/components/providers/RewardProvider";
import { useQueryClient } from "@tanstack/react-query";
import { getTheme } from "@/lib/themes";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { data: user } = useGetUser();
  const { addReward } = useRewards();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const theme = getTheme(pathname);
  const isUCL = pathname === "/ucl" || pathname.startsWith("/ucl/");

  useEffect(() => {
    const pending = localStorage.getItem("pending_login_reward");
    if (pending) {
      localStorage.removeItem("pending_login_reward");
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      addReward(parseInt(pending, 10), "Daily Login Bonus");
    }
  }, [addReward, queryClient]);

  const handleLogout = async () => {
    await logout().catch(() => {});
    clearToken();
    router.push("/login");
  };

  const navClasses = `
    ${isCollapsed ? "w-20" : "w-64"} 
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    fixed lg:relative z-50 h-screen
    border-r border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-xl p-6 flex flex-col gap-8 
    transition-all duration-700 ease-in-out
  `;

  return (
    <div
      className={`flex font-body ${isUCL ? "h-screen overflow-hidden" : "min-h-screen"} bg-[var(--color-black)]`}
      style={
        {
          ...theme,
          "--color-neon-rgb": hexToRgb(theme["--color-neon"]),
          background: theme.background,
          transition:
            "background-color 700ms ease, color 700ms ease, background 700ms ease",
        } as React.CSSProperties
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[var(--color-black)] px-3 py-1.5 rounded-full border border-[var(--color-neon)]/30">
            <Coins className="w-4 h-4 text-[var(--color-neon)]" />
            <span className="text-[16px] font-bold text-[var(--color-text)]">
              {user?.bb_balance ?? 0}{" "}
              <span className="text-[var(--color-neon)]">BB</span>
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
      </div>

      {/* Desktop Currency Display */}
      <div className="hidden lg:flex fixed top-8 right-8 z-50">
        <div className="flex items-center gap-2 bg-[var(--color-surface)]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-border)] shadow-xl animate-in slide-in-from-top-4 duration-500">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-neon)]/10 flex items-center justify-center">
            <Coins className="w-5 h-5 text-[var(--color-neon)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Balance
            </span>
            <span className="text-xl font-display font-bold text-[var(--color-text)] -mt-1">
              {user?.bb_balance ?? 0}{" "}
              <span className="text-[var(--color-neon)] text-base">BB</span>
            </span>
          </div>
        </div>
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
          {NAV_ITEMS.map(({ href, label, Icon, iconHoverClass, subItems }) => {
            const active =
              pathname === href ||
              (subItems && subItems.some((sub) => pathname === sub.href));
            const isExpanded = expandedItem === label;

            return (
              <li key={href} className="relative">
                {subItems ? (
                  <>
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : label)}
                      className={`group w-full flex items-center ${isCollapsed ? "lg:justify-center" : "gap-3 px-4"} py-3 text-[18px] font-condensed font-semibold rounded-lg transition-all ${
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
                        <>
                          <span className="flex-1 text-left animate-in fade-in lg:slide-in-from-left-2 duration-300">
                            {label}
                          </span>
                          {isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </>
                      )}
                    </button>
                    {isExpanded && (!isCollapsed || isMobileMenuOpen) && (
                      <ul className="mt-1 ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {subItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block py-2 text-[15px] font-bold uppercase tracking-widest transition-colors ${
                                pathname === sub.href
                                  ? "text-[var(--color-neon)]"
                                  : "text-[var(--color-text-muted)] hover:text-[var(--color-neon)]"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={isCollapsed ? label : undefined}
                    className={`group flex items-center ${isCollapsed ? "lg:justify-center" : "gap-3 px-4"} py-3 text-[18px] font-condensed font-semibold rounded-lg transition-all ${
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
                )}
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`group flex items-center ${isCollapsed ? "lg:justify-center" : "gap-3 px-4"} w-full py-3 text-[18px] font-condensed font-semibold text-[#ff4444] hover:text-[#ff6666] hover:bg-[rgba(255,68,68,0.08)] rounded-lg border border-[rgba(255,68,68,0.2)] hover:border-[rgba(255,68,68,0.4)] transition-all`}
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
        className={`flex-1 p-4 md:p-8 pt-20 lg:pt-8 text-[var(--color-text)] transition-all duration-700 ease-in-out ${
          isUCL ? "min-h-0 overflow-hidden" : "overflow-y-auto h-screen"
        }`}
        style={{ background: "transparent" }}
      >
        {children}
      </main>
    </div>
  );
}
