"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Star, Activity } from "lucide-react";
import { BASE } from "@/lib/footballUtils";
import { Match } from "@/types/football";

// ─── Round grouping ──────────────────────────────────────────────────────────
// Sort matches by date, then bucket into rounds using a 7-day gap threshold.
function groupMatchesByRound(matches: Match[]): Match[][] {
  if (!matches.length) return [];

  const getTime = (m: Match) => new Date(m.date ?? m.utc_date ?? "").getTime();

  const sorted = [...matches].sort((a, b) => getTime(a) - getTime(b));

  const groups: Match[][] = [];
  let group: Match[] = [sorted[0]];
  let anchor = getTime(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    const t = getTime(sorted[i]);
    if ((t - anchor) / 86_400_000 <= 7) {
      group.push(sorted[i]);
    } else {
      groups.push(group);
      group = [sorted[i]];
      anchor = t;
    }
  }
  groups.push(group);
  return groups;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtDate(m: Match) {
  return new Date(m.date ?? m.utc_date ?? "").toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  });
}

function fmtKickoff(m: Match) {
  const d = new Date(m.date ?? m.utc_date ?? "");
  return `${d.toLocaleDateString("en-GB", { month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

// ─── MatchNode ────────────────────────────────────────────────────────────────
function MatchNode({ match, round }: { match: Match; round: string }) {
  const isT1Winner = match.winner === "HOME_TEAM";
  const isT2Winner = match.winner === "AWAY_TEAM";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isFinished = match.status === "FINISHED";
  const isTimed = match.status === "TIMED" || match.status === "SCHEDULED";

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(10,25,60,0.85) 0%, rgba(5,15,40,0.92) 100%)",
        border: "1px solid rgba(100,160,255,0.25)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Label bar */}
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(0,80,200,0.5) 0%, rgba(0,40,120,0.3) 100%)",
          borderBottom: "1px solid rgba(100,160,255,0.15)",
          padding: "6px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#7eb8ff",
            fontSize: "9px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {round}
        </span>
        {isLive && (
          <span
            className="animate-pulse"
            style={{
              color: "#60aaff",
              fontSize: "9px",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Activity size={10} /> LIVE
          </span>
        )}
        {isFinished && (
          <span style={{ color: "#4a6a9a", fontSize: "9px", fontWeight: 700 }}>
            FT
          </span>
        )}
        {isTimed && (
          <span style={{ color: "#5a80b0", fontSize: "9px", fontWeight: 700 }}>
            {fmtDate(match)}
          </span>
        )}
      </div>

      {/* Teams */}
      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Home */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isT1Winner ? "#60aaff" : "rgba(100,160,255,0.2)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: isT1Winner ? "#e8f0ff" : "#8aabdc",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                maxWidth: 110,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {match.home_team}
            </span>
          </div>
          <span
            style={{
              color: isT1Winner ? "#60aaff" : "#8aabdc",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "monospace",
              marginLeft: 8,
            }}
          >
            {isFinished || isLive ? (match.home_team_score ?? "0") : "-"}
          </span>
        </div>

        <div style={{ height: 1, background: "rgba(100,160,255,0.08)" }} />

        {/* Away */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isT2Winner ? "#60aaff" : "rgba(100,160,255,0.2)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: isT2Winner ? "#e8f0ff" : "#8aabdc",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                maxWidth: 110,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {match.away_team}
            </span>
          </div>
          <span
            style={{
              color: isT2Winner ? "#60aaff" : "#8aabdc",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "monospace",
              marginLeft: 8,
            }}
          >
            {isFinished || isLive ? (match.away_team_score ?? "0") : "-"}
          </span>
        </div>

        {isTimed && (
          <div style={{ textAlign: "center", marginTop: 2 }}>
            <span
              style={{
                color: "#4a6a9a",
                fontSize: "10px",
                fontFamily: "monospace",
              }}
            >
              {fmtKickoff(match)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UCLPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BASE}/fixtures?league=CL&limit=50`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group into rounds by date proximity
  const rounds = groupMatchesByRound(matches);
  // rounds[0] = QF (4 matches), rounds[1] = SF (2 matches), rounds[2] = Final (1 match)
  const qfMatches = rounds[0] ?? [];
  const sfMatches = rounds[1] ?? [];
  const finalMatch = rounds[2]?.[0] ?? null;

  // Split QF and SF for left / right sides
  const qfLeft = qfMatches.slice(0, 2); // QF 1 & 2
  const qfRight = qfMatches.slice(2, 4); // QF 3 & 4
  const sfLeft = sfMatches[0] ?? null; // SF 1
  const sfRight = sfMatches[1] ?? null; // SF 2

  const finished = matches.filter((m) => m.status === "FINISHED").length;
  const remaining = matches.filter(
    (m) =>
      m.status === "TIMED" ||
      m.status === "SCHEDULED" ||
      m.status === "IN_PLAY",
  ).length;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "600px",
          gap: 16,
        }}
      >
        <div
          className="animate-spin"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "4px solid rgba(100,160,255,0.4)",
            borderTopColor: "transparent",
          }}
        />
        <p
          className="animate-pulse"
          style={{
            color: "#7eb8ff",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontSize: 14,
          }}
        >
          Analyzing Roadmap...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "600px",
        }}
      >
        <p
          style={{
            color: "#60aaff",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Failed to load UCL data.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100%",
        padding: "16px",
        overflowX: "hidden",
        backgroundImage: "url('/ucl_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local",
      }}
    >
      {/* ── Overlays ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(2,8,30,0.62)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(2,8,30,0.92) 0%, transparent 28%, transparent 70%, rgba(2,8,30,0.92) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right,  rgba(2,8,30,0.70) 0%, transparent 22%, transparent 78%, rgba(2,8,30,0.70) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "rgba(0,80,200,0.22)",
          filter: "blur(160px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(0,50,160,0.18)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "38%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(20,60,180,0.12)",
          filter: "blur(200px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#7eb8ff",
                background: "rgba(0,80,200,0.2)",
                border: "1px solid rgba(100,160,255,0.35)",
                boxShadow: "0 0 15px rgba(0,80,200,0.15)",
              }}
            >
              UEFA Champions League
            </span>
            <div
              style={{
                height: 1,
                width: 64,
                background:
                  "linear-gradient(to right, rgba(100,160,255,0.5), transparent)",
              }}
            />
          </div>
          <h1
            className="font-headline italic"
            style={{
              fontSize: "clamp(2.5rem,8vw,6rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              background:
                "linear-gradient(to bottom, #e8f0ff 0%, #7eb8ff 55%, rgba(100,160,255,0.25) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Roadmap{" "}
            <span
              style={{
                WebkitTextFillColor: "#60aaff",
                filter: "drop-shadow(0 0 22px rgba(0,100,255,0.55))",
              }}
            >
              to Munich
            </span>
          </h1>
          <p
            style={{
              color: "#5a80b0",
              fontSize: 13,
              marginTop: 24,
              maxWidth: 480,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              lineHeight: 1.7,
            }}
          >
            Follow the elite journey of the stars. Real-time tournament
            progression and team roadmap visualization.
          </p>
        </div>

        {/* Venue card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: 24,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(10,25,70,0.75) 0%, rgba(5,15,45,0.85) 100%)",
            border: "1px solid rgba(100,160,255,0.2)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          <Trophy
            style={{
              width: 40,
              height: 40,
              color: "#60aaff",
              filter: "drop-shadow(0 0 12px rgba(0,100,255,0.5))",
            }}
          />
          <div>
            <p
              style={{
                color: "#5a80b0",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: 4,
              }}
            >
              Final Destination
            </p>
            <p
              style={{
                color: "#c8dcff",
                fontSize: 17,
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              Munich Football Arena • May 30
            </p>
          </div>
        </div>
      </div>

      {/* ── Bracket: QF-left | SF-left | Final | SF-right | QF-right ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          alignItems: "center",
          gap: "12px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Col 1 — Left QF */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {qfLeft.map((m, i) => (
            <MatchNode key={m.id} match={m} round={`QF ${i + 1}`} />
          ))}
        </div>

        {/* Col 2 — Left SF */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "90%" }}>
            {sfLeft && <MatchNode match={sfLeft} round="SEMIFINAL" />}
          </div>
        </div>

        {/* Col 3 — Final */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 0",
          }}
        >
          <div className="animate-bounce" style={{ marginBottom: 24 }}>
            <Star
              style={{
                width: 32,
                height: 32,
                color: "#60aaff",
                fill: "#60aaff",
              }}
            />
          </div>
          <div
            style={{ width: "100%", position: "relative", padding: "0 8px" }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                height: 128,
                borderRadius: "50%",
                background: "rgba(0,80,200,0.1)",
                filter: "blur(40px)",
              }}
            />
            {finalMatch ? (
              <MatchNode match={finalMatch} round="THE FINAL" />
            ) : (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(10,25,60,0.85) 0%, rgba(5,15,40,0.92) 100%)",
                  border: "1px solid rgba(100,160,255,0.25)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,80,200,0.5) 0%, rgba(0,40,120,0.3) 100%)",
                    borderBottom: "1px solid rgba(100,160,255,0.15)",
                    padding: "6px 12px",
                  }}
                >
                  <span
                    style={{
                      color: "#7eb8ff",
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    THE FINAL
                  </span>
                </div>
                <div
                  style={{
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {["TBD", "TBD"].map((label, i) => (
                    <React.Fragment key={i}>
                      {i === 1 && (
                        <div
                          style={{
                            height: 1,
                            background: "rgba(100,160,255,0.08)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "rgba(100,160,255,0.2)",
                          }}
                        />
                        <span
                          style={{
                            color: "#4a6a9a",
                            fontSize: 13,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Col 4 — Right SF */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "90%" }}>
            {sfRight && <MatchNode match={sfRight} round="SEMIFINAL" />}
          </div>
        </div>

        {/* Col 5 — Right QF */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {qfRight.map((m, i) => (
            <MatchNode key={m.id} match={m} round={`QF ${i + 3}`} />
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 24,
          padding: 12,
          borderTop: "1px solid rgba(100,160,255,0.1)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#5a80b0",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              Played
            </span>
            <span
              style={{
                color: "#c8dcff",
                fontSize: 20,
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              {String(finished).padStart(2, "0")}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#5a80b0",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              Remaining
            </span>
            <span
              style={{
                color: "#60aaff",
                fontSize: 20,
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              {String(remaining).padStart(2, "0")}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#5a80b0",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              Total
            </span>
            <span
              style={{
                color: "#7eb8ff",
                fontSize: 20,
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              {String(matches.length).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#5a80b0",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <Activity size={12} style={{ color: "#60aaff" }} />
          Syncing with UEFA Database
        </div>
      </div>
    </div>
  );
}
