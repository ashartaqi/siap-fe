"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navItems";
import type { LucideIcon } from "lucide-react";

/* ─── Per-page transition config ─────────────────────────── */
interface PageConfig {
  label: string;
  accent: string; // glow / icon colour
  bg: string; // overlay bg
  Icon: LucideIcon | React.FC<{ size?: number; className?: string }>;
}

const PAGE_CONFIGS: { prefix: string; accent: string; bg: string }[] = [
  {
    prefix: "/ucl",
    accent: "#4cc9f0",
    bg: "radial-gradient(ellipse at center, #0b0f2a 0%, #050810 100%)",
  },
  {
    prefix: "/battle",
    accent: "#ff3c3c",
    bg: "radial-gradient(ellipse at center, #120508 0%, #06020400 100%)",
  },
  {
    prefix: "/community",
    accent: "#a855f7",
    bg: "radial-gradient(ellipse at center, #0d0514 0%, #05000b 100%)",
  },
  {
    prefix: "/dream-player",
    accent: "#f97316",
    bg: "radial-gradient(ellipse at center, #0a0600 0%, #050300 100%)",
  },
  {
    prefix: "/dream-team",
    accent: "#06b6d4",
    bg: "radial-gradient(ellipse at center, #00100f 0%, #000806 100%)",
  },
  {
    prefix: "/league-standings",
    accent: "#94a3b8",
    bg: "radial-gradient(ellipse at center, #090c10 0%, #040506 100%)",
  },
  {
    prefix: "/player",
    accent: "#ec4899",
    bg: "radial-gradient(ellipse at center, #110008 0%, #080005 100%)",
  },
  {
    prefix: "/team",
    accent: "#a3e635",
    bg: "radial-gradient(ellipse at center, #060e00 0%, #030700 100%)",
  },
  {
    prefix: "/dashboard",
    accent: "#00ff66",
    bg: "radial-gradient(ellipse at center, #0b0b0b 0%, #050505 100%)",
  },
];

function getPageConfig(pathname: string): PageConfig | null {
  // Sort longest first so /dream-player matches before /dream
  const sorted = [...PAGE_CONFIGS].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );

  for (const { prefix, accent, bg } of sorted) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      // Find matching nav item for icon and label
      const navItem = NAV_ITEMS.find((item) => item.href === prefix);
      if (navItem) {
        return {
          label: navItem.label,
          accent,
          bg,
          Icon: navItem.Icon,
        };
      }
    }
  }
  return null;
}

/* ─── The overlay component ──────────────────────────────── */
export function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [config, setConfig] = useState<PageConfig | null>(null);
  const prevPathname = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't fire on first mount
    if (prevPathname.current === "") {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    const cfg = getPageConfig(pathname);
    if (!cfg) return;

    // Clear any in-progress animation
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setConfig(cfg);
      setPhase("in");
      setVisible(true);

      // hold → out → hide
      timerRef.current = setTimeout(() => {
        setPhase("hold");
        timerRef.current = setTimeout(() => {
          setPhase("out");
          timerRef.current = setTimeout(() => setVisible(false), 500);
        }, 600);
      }, 300);
    }, 0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible || !config) return null;

  const isIn = phase === "in" || phase === "hold";

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: config.bg,
        opacity: isIn ? 1 : 0,
        transform: isIn ? "scale(1)" : "scale(1.06)",
        transition: "opacity 400ms ease, transform 400ms ease",
        pointerEvents: "none",
      }}
    >
      {/* Animated rings */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        <div
          style={{
            position: "absolute",
            inset: "-24px",
            borderRadius: "50%",
            border: `1px solid ${config.accent}22`,
            animation: "ringPulse 1.2s ease-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-12px",
            borderRadius: "50%",
            border: `1px solid ${config.accent}44`,
            animation: "ringPulse 1.2s 0.3s ease-out infinite",
          }}
        />
        {/* Icon circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `${config.accent}14`,
            border: `1.5px solid ${config.accent}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.accent,
            boxShadow: `0 0 32px ${config.accent}33, 0 0 64px ${config.accent}15`,
            animation: isIn
              ? "iconPop 350ms cubic-bezier(.34,1.56,.64,1) both"
              : "none",
          }}
        >
          <config.Icon size={64} strokeWidth={1.5} />
        </div>
      </div>

      {/* Page label */}
      <p
        style={{
          fontFamily: "'Bebas Neue', serif",
          fontSize: 19,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: config.accent,
          opacity: 0.85,
          marginBottom: 6,
          animation: isIn ? "labelSlide 400ms 100ms ease both" : "none",
        }}
      >
        {config.label}
      </p>

      {/* Thin loading bar */}
      <div
        style={{
          width: 120,
          height: 2,
          borderRadius: 2,
          background: `${config.accent}22`,
          overflow: "hidden",
          animation: isIn ? "labelSlide 400ms 150ms ease both" : "none",
        }}
      >
        <div
          style={{
            height: "100%",
            background: config.accent,
            borderRadius: 2,
            animation: "loadBar 900ms ease forwards",
            boxShadow: `0 0 8px ${config.accent}`,
          }}
        />
      </div>

      <style>{`
        @keyframes ringPulse {
          0%   { opacity: 0.7; transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.5); }
        }
        @keyframes iconPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes labelSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loadBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
