"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { UCLIcon } from "@/components/icons/UCLIcon";

/* ─── Per-page transition config ─────────────────────────── */
interface PageConfig {
  label: string;
  accent: string; // glow / icon colour
  bg: string; // overlay bg
  icon: React.ReactNode; // SVG / emoji icon
}

const SVG = (props: { children: React.ReactNode; size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={props.size ?? 64}
    height={props.size ?? 64}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {props.children}
  </svg>
);

const PAGE_CONFIGS: { prefix: string; config: PageConfig }[] = [
  {
    prefix: "/ucl",
    config: {
      label: "Champions League",
      accent: "#4cc9f0",
      bg: "radial-gradient(ellipse at center, #0b0f2a 0%, #050810 100%)",
      icon: <UCLIcon size={64} />,
    },
  },
  {
    prefix: "/battle",
    config: {
      label: "Ultimate Battle",
      accent: "#ff3c3c",
      bg: "radial-gradient(ellipse at center, #120508 0%, #06020400 100%)",
      icon: (
        <SVG>
          {/* Crossed swords */}
          <path d="M14.5 17.5L3 6 3 3h3l11.5 11.5M8.5 8.5l-1 1M17.5 3h3v3L14 12.5M20 21L14 15M3 21l6-6" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/community",
    config: {
      label: "Community",
      accent: "#a855f7",
      bg: "radial-gradient(ellipse at center, #0d0514 0%, #05000b 100%)",
      icon: (
        <SVG>
          {/* Message bubbles */}
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/dream-player",
    config: {
      label: "Dream Player",
      accent: "#f97316",
      bg: "radial-gradient(ellipse at center, #0a0600 0%, #050300 100%)",
      icon: (
        <SVG>
          {/* Star person */}
          <circle cx="12" cy="8" r="4" />
          <path d="M12 14c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" />
          <path d="M12 1l1.5 3 3 .5-2.2 2.1.5 3.1L12 8.3l-2.8 1.4.5-3.1L7.5 4.5 10.5 4z" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/dream-team",
    config: {
      label: "Dream Team",
      accent: "#06b6d4",
      bg: "radial-gradient(ellipse at center, #00100f 0%, #000806 100%)",
      icon: (
        <SVG>
          {/* Team / formation */}
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="13" r="2" />
          <circle cx="19" cy="13" r="2" />
          <circle cx="8" cy="20" r="2" />
          <circle cx="16" cy="20" r="2" />
          <path d="M12 7v3M7 13h10M5 15l3 3M19 15l-3 3" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/league-standings",
    config: {
      label: "League Standings",
      accent: "#94a3b8",
      bg: "radial-gradient(ellipse at center, #090c10 0%, #040506 100%)",
      icon: (
        <SVG>
          {/* Bar chart */}
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="7" width="4" height="14" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/player",
    config: {
      label: "Players",
      accent: "#ec4899",
      bg: "radial-gradient(ellipse at center, #110008 0%, #080005 100%)",
      icon: (
        <SVG>
          {/* Player / person with number */}
          <circle cx="12" cy="7" r="4" />
          <path d="M4 20v-1a6 6 0 0112 0v1" />
          <path d="M9 11h6" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/team",
    config: {
      label: "Teams",
      accent: "#a3e635",
      bg: "radial-gradient(ellipse at center, #060e00 0%, #030700 100%)",
      icon: (
        <SVG>
          {/* Shield */}
          <path d="M12 2l9 4v6c0 5.25-3.75 10.15-9 11.5C6.75 22.15 3 17.25 3 12V6l9-4z" />
          <path d="M9 12l2 2 4-4" />
        </SVG>
      ),
    },
  },
  {
    prefix: "/dashboard",
    config: {
      label: "Dashboard",
      accent: "#00ff66",
      bg: "radial-gradient(ellipse at center, #0b0b0b 0%, #050505 100%)",
      icon: (
        <SVG>
          {/* Grid dashboard */}
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </SVG>
      ),
    },
  },
];

function getPageConfig(pathname: string): PageConfig | null {
  // Sort longest first so /dream-player matches before /dream
  const sorted = [...PAGE_CONFIGS].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );
  for (const { prefix, config } of sorted) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return config;
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
          {config.icon}
        </div>
      </div>

      {/* Page label */}
      <p
        style={{
          fontFamily: "'Bebas Neue', serif",
          fontSize: 13,
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
