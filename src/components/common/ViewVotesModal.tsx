"use client";

import React from "react";
import { X, Users, Trophy } from "lucide-react";
import { Match } from "@/types/football";
import { useGetFixtureVotes } from "@/features/main/football";

interface ViewVotesModalProps {
  match: Match;
  onClose: () => void;
}

export function ViewVotesModal({ match, onClose }: ViewVotesModalProps) {
  const { data: votes, isLoading } = useGetFixtureVotes(Number(match.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-container" />
            <h3 className="font-headline font-bold text-lg uppercase tracking-wider">
              Community Votes
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
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-center gap-3">
            <span className="font-headline font-bold text-sm">
              {match.home_team}
            </span>
            <span className="text-on-surface-variant text-[10px] font-label uppercase">
              vs
            </span>
            <span className="font-headline font-bold text-sm">
              {match.away_team}
            </span>
          </div>
        </div>

        {/* Votes List */}
        <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-surface-container-highest rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : !votes || votes.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm font-label">
                No votes yet. Be the first to predict!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-2 border-b border-outline-variant/10">
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  User
                </span>
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant text-center w-16">
                  Home
                </span>
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant text-center w-16">
                  Away
                </span>
              </div>

              {votes.map((vote) => (
                <div
                  key={vote.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-3 py-3 rounded-lg bg-surface-container-highest/50 hover:bg-surface-container-highest transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary-container/20 border border-primary-container/30 flex items-center justify-center flex-none">
                      <span className="text-[10px] font-headline font-bold text-primary-container uppercase">
                        {vote.first_name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline font-medium text-sm truncate">
                        {vote.first_name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-label truncate">
                        @{vote.username}
                      </p>
                    </div>
                  </div>
                  <span className="w-16 text-center font-headline font-black text-lg text-primary-container">
                    {vote.prediction_home_score}
                  </span>
                  <span className="w-16 text-center font-headline font-black text-lg text-on-surface-variant">
                    {vote.prediction_away_score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-outline-variant/10 flex justify-between items-center">
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
            {votes?.length ?? 0} vote{(votes?.length ?? 0) !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg border border-outline-variant/20 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:bg-surface-container-highest transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
