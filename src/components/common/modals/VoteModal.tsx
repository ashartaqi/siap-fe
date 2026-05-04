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
import { Toast } from "@/components/common/Toast";

interface VoteModalProps {
  match: Match;
  onClose: () => void;
  theme?: "green" | "blue";
}

export function VoteModal({ match, onClose, theme = "green" }: VoteModalProps) {
  const { data: userVotes = [], isLoading: voteLoading } = useGetUserVotes();

  const isBlue = theme === "blue";

  if (voteLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className={`w-full max-w-md p-8 rounded-2xl animate-pulse border shadow-2xl ${
            isBlue
              ? "bg-[#0a193c] border-[rgba(100,160,255,0.2)]"
              : "bg-surface-container-low border-outline-variant/20"
          }`}
        >
          <div
            className={`h-6 w-32 rounded mb-8 ${isBlue ? "bg-[rgba(100,160,255,0.1)]" : "bg-surface-container-highest"}`}
          />
          <div className="space-y-4">
            <div
              className={`h-20 rounded-xl ${isBlue ? "bg-[rgba(100,160,255,0.1)]" : "bg-surface-container-highest"}`}
            />
            <div
              className={`h-12 rounded-xl ${isBlue ? "bg-[rgba(100,160,255,0.1)]" : "bg-surface-container-highest"}`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <VoteModalContent
      match={match}
      onClose={onClose}
      theme={theme}
      userVote={
        userVotes.find((v) => v.fixture_id === Number(match.id)) ?? null
      }
    />
  );
}

function VoteModalContent({
  match,
  onClose,
  theme = "green",
  userVote,
}: VoteModalProps & { userVote: IVoteResponse | null }) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const createVote = useCreateVote();
  const updateVote = useUpdateVote();

  const isBlue = theme === "blue";
  const isCurrentMatch = userVote?.fixture_id === Number(match.id);
  const hasPrediction =
    match.predicted_home_score != null && match.predicted_away_score != null;

  const [homeScore, setHomeScore] = useState(
    isCurrentMatch ? userVote.prediction_home_score : 0,
  );
  const [awayScore, setAwayScore] = useState(
    isCurrentMatch ? userVote.prediction_away_score : 0,
  );

  const isPending = createVote.isPending || updateVote.isPending;

  const handleApplyPrediction = () => {
    if (hasPrediction) {
      setHomeScore(match.predicted_home_score!);
      setAwayScore(match.predicted_away_score!);
    }
  };

  const handleSubmit = () => {
    const payload = {
      fixture_id: Number(match.id),
      prediction_home_score: homeScore,
      prediction_away_score: awayScore,
    };

    const options = {
      onSuccess: () => {
        setToast({
          message: `Prediction for ${match.home_team} vs ${match.away_team} saved!`,
          type: "success",
        });
        setTimeout(onClose, 1000);
      },
      onError: () => {
        setToast({ message: "Failed to save prediction", type: "error" });
      },
    };

    if (isCurrentMatch) {
      updateVote.mutate(payload, options);
    } else {
      createVote.mutate(payload, options);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className={`relative w-full max-w-md mx-4 border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
            isBlue
              ? "bg-[#0a193c] border-[rgba(100,160,255,0.3)]"
              : "bg-surface-container-low border-outline-variant/20"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-5 border-b ${isBlue ? "border-white/5 bg-white/5" : "border-outline-variant/10"}`}
          >
            <div className="flex items-center gap-2">
              <Vote
                className={`w-5 h-5 ${isBlue ? "text-[#60aaff]" : "text-primary-container"}`}
              />
              <h3
                className={`font-headline font-bold text-lg uppercase tracking-wider ${isBlue ? "text-[#e8f0ff]" : ""}`}
              >
                {isCurrentMatch ? "Update Vote" : "Cast Vote"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${isBlue ? "hover:bg-white/10 text-[#8aabdc]" : "hover:bg-surface-container-highest text-on-surface-variant"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Match Info */}
          <div className="p-5 space-y-5">
            <div className="text-center space-y-1">
              <p
                className={`font-headline font-bold text-base ${isBlue ? "text-[#e8f0ff]" : ""}`}
              >
                {match.home_team}
              </p>
              <p
                className={`text-[10px] font-label uppercase tracking-widest ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
              >
                vs
              </p>
              <p
                className={`font-headline font-bold text-base ${isBlue ? "text-[#e8f0ff]" : ""}`}
              >
                {match.away_team}
              </p>
            </div>

            {/* AI Prediction */}
            {hasPrediction && (
              <div
                className={`p-4 rounded-xl border animate-in slide-in-from-bottom-2 duration-300 ${
                  isBlue
                    ? "bg-[#60aaff]/5 border-[#60aaff]/20"
                    : "bg-primary-container/5 border-primary-container/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${isBlue ? "bg-[#60aaff]" : "bg-primary-container"}`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${isBlue ? "text-[#60aaff]" : "text-primary-container"}`}
                    >
                      AI Neural Prediction
                    </span>
                  </div>
                  <button
                    onClick={handleApplyPrediction}
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border transition-all ${
                      isBlue
                        ? "border-[#60aaff]/40 text-[#60aaff] hover:bg-[#60aaff] hover:text-white"
                        : "border-primary-container/40 text-primary-container hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    Apply
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="text-center flex-1 min-w-0">
                    <div
                      className={`text-[9px] font-black uppercase tracking-tighter truncate mb-1 ${isBlue ? "text-[#8aabdc]" : "text-on-surface-variant"}`}
                    >
                      {match.home_team}
                    </div>
                    <div
                      className={`text-3xl font-black ${isBlue ? "text-white" : "text-on-surface"}`}
                    >
                      {match.predicted_home_score}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                    >
                      —
                    </span>
                    {match.predicted_outcome && (
                      <div
                        className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                          isBlue
                            ? "bg-[#60aaff]/10 text-[#60aaff]"
                            : "bg-primary-container/10 text-primary-container"
                        }`}
                      >
                        {match.predicted_outcome === "win"
                          ? `${match.home_team.split(" ").slice(-1)[0]} Win`
                          : match.predicted_outcome === "loss"
                            ? `${match.away_team.split(" ").slice(-1)[0]} Win`
                            : "Draw"}
                      </div>
                    )}
                  </div>

                  <div className="text-center flex-1 min-w-0">
                    <div
                      className={`text-[9px] font-black uppercase tracking-tighter truncate mb-1 ${isBlue ? "text-[#8aabdc]" : "text-on-surface-variant"}`}
                    >
                      {match.away_team}
                    </div>
                    <div
                      className={`text-3xl font-black ${isBlue ? "text-white" : "text-on-surface"}`}
                    >
                      {match.predicted_away_score}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Score Inputs */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <label
                  className={`text-[10px] font-label uppercase tracking-widest ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                >
                  {match.home_team.split(" ").slice(-1)[0]}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                    className={`w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors ${
                      isBlue
                        ? "bg-white/5 text-[#8aabdc] hover:bg-[#60aaff] hover:text-white"
                        : "bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    −
                  </button>
                  <span
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center font-headline font-black text-2xl ${
                      isBlue
                        ? "bg-black/20 border-white/10 text-[#60aaff]"
                        : "bg-surface-container-highest border-outline-variant/20 text-primary-container shadow-[inset_0_0_12px_rgba(0,255,102,0.1)]"
                    }`}
                  >
                    {homeScore}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHomeScore(Math.min(20, homeScore + 1))}
                    className={`w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors ${
                      isBlue
                        ? "bg-white/5 text-[#8aabdc] hover:bg-[#60aaff] hover:text-white"
                        : "bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              <span
                className={`font-headline font-black text-xl mt-5 ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
              >
                :
              </span>

              <div className="flex flex-col items-center gap-2">
                <label
                  className={`text-[10px] font-label uppercase tracking-widest ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                >
                  {match.away_team.split(" ").slice(-1)[0]}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                    className={`w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors ${
                      isBlue
                        ? "bg-white/5 text-[#8aabdc] hover:bg-[#60aaff] hover:text-white"
                        : "bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    −
                  </button>
                  <span
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center font-headline font-black text-2xl ${
                      isBlue
                        ? "bg-black/20 border-white/10 text-[#60aaff]"
                        : "bg-surface-container-highest border-outline-variant/20 text-primary-container shadow-[inset_0_0_12px_rgba(0,255,102,0.1)]"
                    }`}
                  >
                    {awayScore}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAwayScore(Math.min(20, awayScore + 1))}
                    className={`w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors ${
                      isBlue
                        ? "bg-white/5 text-[#8aabdc] hover:bg-[#60aaff] hover:text-white"
                        : "bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`p-5 border-t flex gap-3 ${isBlue ? "border-white/5 bg-white/5" : "border-outline-variant/10"}`}
          >
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-lg border font-label text-sm uppercase tracking-widest transition-colors ${
                isBlue
                  ? "border-white/10 text-[#8aabdc] hover:bg-white/5"
                  : "border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`flex-1 py-2.5 rounded-lg font-label font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isBlue
                  ? "bg-[#60aaff] text-white hover:shadow-[0_0_16px_rgba(0,100,255,0.4)]"
                  : "bg-primary-container text-on-primary hover:shadow-[0_0_16px_rgba(0,255,102,0.4)]"
              }`}
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
