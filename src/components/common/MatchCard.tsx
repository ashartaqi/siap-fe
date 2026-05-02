"use client";

import React, { useState } from "react";
import { Vote, Users, MessageSquare } from "lucide-react";
import { formatMatchTime, formatShortDate } from "@/lib/utils/footballUtils";
import { VoteModal } from "./modals/VoteModal";
import { ViewVotesModal } from "./modals/ViewVotesModal";
import { MatchCommentsModal } from "./modals/MatchCommentsModal";
import { Match } from "@/features/main/football/types";
import { useGetTeamByName, ITeamsResponse } from "@/features/main/dashboard";
import { TeamDetailModal } from "./modals/TeamDetailModal";

interface MatchCardProps {
  m: Match;
  variant?: "scheduled" | "finished";
  votedFixtureIds: Set<number>;
  showRound?: string;
  theme?: "green" | "blue";
  aggregateHome?: number | null;
  aggregateAway?: number | null;
  winner?: string | null;
}

export function MatchCard({
  m,
  variant = "scheduled",
  votedFixtureIds,
  showRound,
  theme = "green",
  aggregateHome,
  aggregateAway,
  winner,
}: MatchCardProps) {
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showViewVotes, setShowViewVotes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ITeamsResponse | null>(null);

  const isVotedOn = votedFixtureIds.has(Number(m.id));
  const isFinished = m.status === "FINISHED";
  const isBlue = theme === "blue";

  // Theme-based class names
  const cardClasses = `flex-none w-full max-w-[280px] border p-4 rounded-lg transition-all duration-300 backdrop-blur-xl ${
    isBlue
      ? `bg-[linear-gradient(135deg,rgba(10,25,60,0.85)_0%,rgba(5,15,40,0.92)_100%)] shadow-[0_15px_35px_rgba(0,0,0,0.4)] ${isVotedOn ? "border-[#60aaff]/60 shadow-[0_0_15px_rgba(0,100,255,0.3)]" : "border-[rgba(100,160,255,0.25)]"}`
      : `bg-surface-container-low neon-glow ${isVotedOn ? "border-primary-container/40 shadow-[0_0_12px_rgba(0,255,102,0.15)]" : "border-[#474845]/20"}`
  }`;

  const badgeClasses = `text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
    isBlue
      ? "text-[#7eb8ff] bg-[rgba(0,80,200,0.2)] border border-[rgba(100,160,255,0.2)]"
      : "text-on-surface-variant bg-surface-container-highest"
  }`;

  const roundClasses = `text-[8px] font-black uppercase tracking-widest mb-1 ${
    isBlue ? "text-[#60aaff]" : "text-primary-container"
  }`;

  const scoreLabelClasses = `font-headline font-bold text-lg shrink-0 ${
    isBlue ? "text-[#60aaff]" : ""
  }`;

  const teamNameClasses = `font-headline font-medium text-sm truncate pr-2 ${
    isBlue ? (isFinished ? "text-[#e8f0ff]" : "text-[#7eb8ff]") : ""
  }`;

  return (
    <>
      <div className={cardClasses}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-0">
            {showRound && <span className={roundClasses}>{showRound}</span>}
            <span className={badgeClasses}>
              {isFinished
                ? formatShortDate(m.date ?? "")
                : formatMatchTime(m.date ?? "")}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <TeamRow
            name={m.home_team}
            score={
              m.home_team_score !== null && m.home_team_score !== undefined
                ? m.home_team_score
                : m.home_score !== null && m.home_score !== undefined
                  ? m.home_score
                  : "-"
            }
            teamNameClasses={teamNameClasses}
            scoreLabelClasses={scoreLabelClasses}
            onTeamClick={setSelectedTeam}
            isWinner={winner === m.home_team}
            aggregate={aggregateHome}
          />
          <TeamRow
            name={m.away_team}
            score={
              m.away_team_score !== null && m.away_team_score !== undefined
                ? m.away_team_score
                : m.away_score !== null && m.away_score !== undefined
                  ? m.away_score
                  : "-"
            }
            teamNameClasses={teamNameClasses}
            scoreLabelClasses={scoreLabelClasses}
            onTeamClick={setSelectedTeam}
            dimmed
            isBlue={isBlue}
            isWinner={winner === m.away_team}
            aggregate={aggregateAway}
          />
        </div>

        {/* Action buttons */}
        <div
          className={`flex flex-col gap-2 mt-4 pt-3 border-t ${isBlue ? "border-white/5" : "border-outline-variant/10"}`}
        >
          <div className="flex gap-2">
            {!isFinished && (
              <button
                onClick={() => setShowVoteModal(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-label font-bold uppercase tracking-widest transition-all ${
                  isBlue
                    ? isVotedOn
                      ? "bg-[rgba(0,100,255,0.2)] text-[#e8f0ff] border border-[#60aaff]/40 shadow-[0_0_10px_rgba(0,100,255,0.2)]"
                      : "bg-white/5 text-[#8aabdc] hover:bg-[rgba(0,100,255,0.1)] hover:text-[#60aaff] border border-white/10"
                    : isVotedOn
                      ? "bg-primary-container/15 text-primary-container border border-primary-container/30 hover:bg-primary-container/25"
                      : "bg-surface-container-highest text-on-surface-variant hover:bg-primary-container/10 hover:text-primary-container border border-outline-variant/10"
                }`}
              >
                <Vote className="w-3.5 h-3.5" />
                {isVotedOn ? "Change" : "Vote"}
              </button>
            )}
            <button
              onClick={() => setShowViewVotes(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-label font-bold uppercase tracking-widest transition-colors ${
                isBlue
                  ? "bg-white/5 text-[#8aabdc] hover:bg-white/10 border border-white/10"
                  : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              View Votes
            </button>
          </div>

          <button
            onClick={() => setShowComments(true)}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-label font-bold uppercase tracking-widest transition-all ${
              isBlue
                ? "bg-[rgba(255,255,255,0.02)] text-[#5a80b0] hover:bg-[rgba(100,160,255,0.08)] hover:text-[#60aaff] border border-white/5 hover:border-[rgba(100,160,255,0.2)]"
                : "bg-[rgba(255,255,255,0.03)] text-[#aaaba7] hover:bg-[rgba(0,255,102,0.1)] hover:text-[#00ff66] border border-[rgba(255,255,255,0.05)] hover:border-[#00ff66]/20"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Match Chat
          </button>
        </div>
      </div>

      {showVoteModal && (
        <VoteModal
          match={m}
          theme={theme}
          onClose={() => setShowVoteModal(false)}
        />
      )}
      {showViewVotes && (
        <ViewVotesModal
          match={m}
          theme={theme}
          onClose={() => setShowViewVotes(false)}
        />
      )}
      {showComments && (
        <MatchCommentsModal
          match={m}
          theme={theme}
          onClose={() => setShowComments(false)}
        />
      )}
      {selectedTeam && (
        <TeamDetailModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </>
  );
}

function TeamRow({
  name,
  score,
  teamNameClasses,
  scoreLabelClasses,
  onTeamClick,
  dimmed,
  isBlue,
  isWinner,
  aggregate,
}: {
  name: string;
  score: string | number;
  teamNameClasses: string;
  scoreLabelClasses: string;
  onTeamClick: (team: ITeamsResponse) => void;
  dimmed?: boolean;
  isBlue?: boolean;
  isWinner?: boolean;
  aggregate?: number | null;
}) {
  const { data: team } = useGetTeamByName(name);

  return (
    <div
      className={`flex justify-between items-center group/team cursor-pointer hover:bg-white/5 p-1 -m-1 rounded transition-colors ${dimmed && !isBlue ? "text-on-surface/60" : ""} ${dimmed && isBlue ? "text-[#8aabdc]/60" : ""}`}
      onClick={() => team && onTeamClick(team)}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`${teamNameClasses} ${isWinner ? "font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""}`}
        >
          {name}
        </span>
        {isWinner && (
          <div className="w-1 h-1 rounded-full bg-[#60aaff] shadow-[0_0_8px_rgba(96,170,255,1)]" />
        )}
      </div>
      <div className="flex items-center gap-3">
        {aggregate !== null && aggregate !== undefined && (
          <span className="text-[10px] font-bold text-[#4a6a9a] bg-[rgba(100,160,255,0.1)] px-1.5 py-0.5 rounded border border-[rgba(100,160,255,0.15)]">
            AGG {aggregate}
          </span>
        )}
        <span
          className={`${scoreLabelClasses} ${isWinner ? "text-white scale-110 transition-transform" : ""}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
