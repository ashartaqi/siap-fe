"use client";

import React, { useState } from "react";
import { X, Vote } from "lucide-react";
import { Match } from "@/features/main/football/types";
import {
  useGetUserVotes,
  useCreateVote,
  useUpdateVote,
  IVoteResponse,
} from "@/features/main/football";

interface VoteModalProps {
  match: Match;
  onClose: () => void;
}

export function VoteModal({ match, onClose }: VoteModalProps) {
  const { data: userVotes = [], isLoading: voteLoading } = useGetUserVotes();

  if (voteLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="w-full max-w-md p-8 bg-surface-container-low rounded-2xl animate-pulse border border-outline-variant/20 shadow-2xl">
          <div className="h-6 w-32 bg-surface-container-highest rounded mb-8" />
          <div className="space-y-4">
            <div className="h-20 bg-surface-container-highest rounded-xl" />
            <div className="h-12 bg-surface-container-highest rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <VoteModalContent
      match={match}
      onClose={onClose}
      userVote={
        userVotes.find((v) => v.fixture_id === Number(match.id)) ?? null
      }
    />
  );
}

function VoteModalContent({
  match,
  onClose,
  userVote,
}: VoteModalProps & { userVote: IVoteResponse | null }) {
  const createVote = useCreateVote();
  const updateVote = useUpdateVote();

  const isCurrentMatch = userVote?.fixture_id === Number(match.id);

  const [homeScore, setHomeScore] = useState(
    isCurrentMatch ? userVote.prediction_home_score : 0,
  );
  const [awayScore, setAwayScore] = useState(
    isCurrentMatch ? userVote.prediction_away_score : 0,
  );

  const isPending = createVote.isPending || updateVote.isPending;

  const handleSubmit = () => {
    const payload = {
      fixture_id: Number(match.id),
      prediction_home_score: homeScore,
      prediction_away_score: awayScore,
    };
    if (isCurrentMatch) {
      updateVote.mutate(payload, { onSuccess: () => onClose() });
    } else {
      createVote.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-primary-container" />
            <h3 className="font-headline font-bold text-lg uppercase tracking-wider">
              {isCurrentMatch ? "Update Vote" : "Cast Vote"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Match Info */}
        <div className="p-5 space-y-6">
          <div className="text-center space-y-1">
            <p className="font-headline font-bold text-base">
              {match.home_team}
            </p>
            <p className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">
              vs
            </p>
            <p className="font-headline font-bold text-base">
              {match.away_team}
            </p>
          </div>

          {/* Score Inputs */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                {match.home_team.split(" ").slice(-1)[0]}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface font-bold text-lg flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-12 rounded-xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-headline font-black text-2xl text-primary-container shadow-[inset_0_0_12px_rgba(0,255,102,0.1)]">
                  {homeScore}
                </span>
                <button
                  type="button"
                  onClick={() => setHomeScore(Math.min(20, homeScore + 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface font-bold text-lg flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <span className="font-headline font-black text-xl text-on-surface-variant mt-5">
              :
            </span>

            <div className="flex flex-col items-center gap-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                {match.away_team.split(" ").slice(-1)[0]}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface font-bold text-lg flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-12 rounded-xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-headline font-black text-2xl text-primary-container shadow-[inset_0_0_12px_rgba(0,255,102,0.1)]">
                  {awayScore}
                </span>
                <button
                  type="button"
                  onClick={() => setAwayScore(Math.min(20, awayScore + 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface font-bold text-lg flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-outline-variant/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-outline-variant/20 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary font-label font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_16px_rgba(0,255,102,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? "Submitting…"
              : isCurrentMatch
                ? "Update Vote"
                : "Submit Vote"}
          </button>
        </div>
      </div>
    </div>
  );
}
