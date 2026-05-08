export interface PageTheme {
  "--color-black": string;
  "--color-surface": string;
  "--color-border": string;
  "--color-text": string;
  "--color-text-muted": string;
  "--color-neon": string;
  background: string;
}

// Base theme — black & neon green (Dashboard, default)
const THEME_EMERALD: PageTheme = {
  "--color-black": "#0b0b0b",
  "--color-surface": "#111111",
  "--color-border": "#1e1e1e",
  "--color-text": "#f0f0f0",
  "--color-text-muted": "#a0a0a0",
  "--color-neon": "#00ff66",
  background:
    "radial-gradient(ellipse at 10% 0%, rgba(0,255,102,0.06) 0%, #0b0b0b 60%)",
};

// UCL — deep navy & sky blue (Champions League prestige)
const THEME_SAPPHIRE: PageTheme = {
  "--color-black": "#0b0f2a",
  "--color-surface": "#111a3a",
  "--color-border": "#1f2d5c",
  "--color-text": "#e6ecff",
  "--color-text-muted": "#b0c4ff",
  "--color-neon": "#4cc9f0",
  background:
    "radial-gradient(ellipse at 20% 10%, rgba(30,64,175,0.5) 0%, #0b0f2a 60%)",
};

// Battle — deep maroon & blood red (Combat arena)
const THEME_CRIMSON: PageTheme = {
  "--color-black": "#120508",
  "--color-surface": "#1e0a0d",
  "--color-border": "#3d1015",
  "--color-text": "#ffe8e8",
  "--color-text-muted": "#ffb3b3",
  "--color-neon": "#ff3c3c",
  background:
    "radial-gradient(ellipse at 80% 0%, rgba(200,20,20,0.18) 0%, #120508 60%)",
};

// Community — deep violet & electric purple (Social hub)
const THEME_VIOLET: PageTheme = {
  "--color-black": "#0d0514",
  "--color-surface": "#160c22",
  "--color-border": "#2e1450",
  "--color-text": "#f0e6ff",
  "--color-text-muted": "#d8a4ff",
  "--color-neon": "#a855f7",
  background:
    "radial-gradient(ellipse at 50% 0%, rgba(120,40,200,0.2) 0%, #0d0514 60%)",
};

// Dream Player — deep indigo & electric orange (Scouting lab)
const THEME_AMBER: PageTheme = {
  "--color-black": "#0a0600",
  "--color-surface": "#160b00",
  "--color-border": "#3a1f00",
  "--color-text": "#fff0d6",
  "--color-text-muted": "#f0a050",
  "--color-neon": "#f97316",
  background:
    "radial-gradient(circle at 50% 20%, rgba(251, 191, 36, 0.22) 0%, rgba(249, 115, 22, 0.1) 40%, #0a0600 80%)",
};

// Dream Team — dark teal & cyan (Formation builder)
const THEME_CYAN: PageTheme = {
  "--color-black": "#00100f",
  "--color-surface": "#001a18",
  "--color-border": "#003832",
  "--color-text": "#d6fffe",
  "--color-text-muted": "#7de8e0",
  "--color-neon": "#06b6d4",
  background:
    "radial-gradient(ellipse at 80% -10%, rgba(6,182,212,0.25) 0%, rgba(139,92,246,0.12) 50%, #00100f 85%)",
};

// League Standings — dark slate & cool silver (Data & stats)
const THEME_SILVER: PageTheme = {
  "--color-black": "#090c10",
  "--color-surface": "#101520",
  "--color-border": "#1e2535",
  "--color-text": "#e2e8f0",
  "--color-text-muted": "#94a3b8",
  "--color-neon": "#94a3b8",
  background:
    "radial-gradient(ellipse at 50% 0%, rgba(226,232,240,0.25) 0%, #090c10 65%)",
};

// Players — deep rose & hot pink (Player discovery)
const THEME_ROSE: PageTheme = {
  "--color-black": "#110008",
  "--color-surface": "#1e0011",
  "--color-border": "#420022",
  "--color-text": "#ffe6f5",
  "--color-text-muted": "#f8a8d4",
  "--color-neon": "#ec4899",
  background:
    "radial-gradient(circle at 10% 10%, rgba(236,72,153,0.25) 0%, rgba(56,189,248,0.1) 40%, #110008 80%)",
};

// Teams — dark moss & chartreuse (Club hub)
const THEME_LIME: PageTheme = {
  "--color-black": "#060e00",
  "--color-surface": "#0d1a00",
  "--color-border": "#1f3d00",
  "--color-text": "#edffd6",
  "--color-text-muted": "#a8e060",
  "--color-neon": "#a3e635",
  background:
    "radial-gradient(circle at 90% 10%, rgba(163,230,53,0.25) 0%, rgba(250,204,21,0.12) 40%, #060e00 80%)",
};

// Map path prefixes → themes (most specific first)
const THEME_MAP: { prefix: string; theme: PageTheme }[] = [
  { prefix: "/ucl", theme: THEME_SAPPHIRE },
  { prefix: "/battle", theme: THEME_CRIMSON },
  { prefix: "/community", theme: THEME_VIOLET },
  { prefix: "/dream-player", theme: THEME_AMBER },
  { prefix: "/dream-team", theme: THEME_CYAN },
  { prefix: "/league-standings", theme: THEME_SILVER },
  { prefix: "/player", theme: THEME_ROSE },
  { prefix: "/team", theme: THEME_LIME },
];

export function getTheme(pathname: string): PageTheme {
  for (const { prefix, theme } of THEME_MAP) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return theme;
    }
  }
  return THEME_EMERALD;
}
