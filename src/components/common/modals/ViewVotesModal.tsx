"use client";

import React from "react";
import { X, Users, Trophy } from "lucide-react";
import { Match } from "@/features/main/football/types";
import { useGetFixtureVotes } from "@/features/main/football";

interface ViewVotesModalProps {
  match: Match;
  onClose: () => void;
  theme?: "green" | "blue";
}

export function ViewVotesModal({
  match,
  onClose,
  theme = "green",
}: ViewVotesModalProps) {
  const { data: votes, isLoading } = useGetFixtureVotes(Number(match.id));
  const isBlue = theme === "blue";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg mx-4 border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
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
            <Users
              className={`w-5 h-5 ${isBlue ? "text-[#60aaff]" : "text-primary-container"}`}
            />
            <h3
              className={`font-headline font-bold text-lg uppercase tracking-wider ${isBlue ? "text-[#e8f0ff]" : ""}`}
            >
              Community Votes
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isBlue ? "hover:bg-white/10 text-[#8aabdc]" : "hover:bg-surface-container-highest text-on-surface-variant"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Info + AI Prediction */}
        <div className="px-5 pt-4 pb-3 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`font-headline font-bold text-sm ${isBlue ? "text-[#e8f0ff]" : ""}`}
            >
              {match.home_team}
            </span>
            <span
              className={`text-[10px] font-label uppercase ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
            >
              vs
            </span>
            <span
              className={`font-headline font-bold text-sm ${isBlue ? "text-[#e8f0ff]" : ""}`}
            >
              {match.away_team}
            </span>
          </div>

          {match.predicted_home_score != null &&
            match.predicted_away_score != null && (
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                  isBlue
                    ? "bg-[#60aaff]/5 border-[#60aaff]/20"
                    : "bg-primary-container/5 border-primary-container/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBlue ? "bg-[#60aaff]" : "bg-primary-container"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${isBlue ? "text-[#60aaff]" : "text-primary-container"}`}
                  >
                    AI Prediction
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div
                      className={`text-[9px] font-black uppercase tracking-tighter truncate max-w-[60px] ${isBlue ? "text-[#8aabdc]" : "text-on-surface-variant"}`}
                    >
                      {match.home_team.split(" ").slice(-1)[0]}
                    </div>
                    <div
                      className={`text-xl font-black ${isBlue ? "text-white" : "text-on-surface"}`}
                    >
                      {match.predicted_home_score}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-black ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                  >
                    —
                  </span>
                  <div className="text-center">
                    <div
                      className={`text-[9px] font-black uppercase tracking-tighter truncate max-w-[60px] ${isBlue ? "text-[#8aabdc]" : "text-on-surface-variant"}`}
                    >
                      {match.away_team.split(" ").slice(-1)[0]}
                    </div>
                    <div
                      className={`text-xl font-black ${isBlue ? "text-white" : "text-on-surface"}`}
                    >
                      {match.predicted_away_score}
                    </div>
                  </div>
                  {match.predicted_outcome && (
                    <div
                      className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ml-1 ${
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
              </div>
            )}
        </div>

        {/* Votes List */}
        <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-14 rounded-lg animate-pulse ${isBlue ? "bg-white/5" : "bg-surface-container-highest"}`}
                />
              ))}
            </div>
          ) : !votes || votes.length === 0 ? (
            <div className="text-center py-8">
              <Trophy
                className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isBlue ? "text-[#60aaff]" : "text-on-surface-variant"}`}
              />
              <p
                className={`text-sm font-label ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
              >
                No votes yet. Be the first to predict!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header */}
              <div
                className={`grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-2 border-b ${isBlue ? "border-white/5" : "border-outline-variant/10"}`}
              >
                <span
                  className={`text-[10px] font-label uppercase tracking-widest ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                >
                  User
                </span>
                <span
                  className={`text-[10px] font-label uppercase tracking-widest text-center w-16 ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                >
                  Home
                </span>
                <span
                  className={`text-[10px] font-label uppercase tracking-widest text-center w-16 ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                >
                  Away
                </span>
              </div>

              {votes.map((vote) => (
                <div
                  key={vote.id}
                  className={`grid grid-cols-[1fr_auto_auto] gap-4 items-center px-3 py-3 rounded-lg transition-colors ${
                    isBlue
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-surface-container-highest/50 hover:bg-surface-container-highest"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-none border ${
                        isBlue
                          ? "bg-[#60aaff]/10 border-[#60aaff]/30"
                          : "bg-primary-container/20 border-primary-container/30"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-headline font-bold uppercase ${isBlue ? "text-[#60aaff]" : "text-primary-container"}`}
                      >
                        {vote.first_name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-headline font-medium text-sm truncate ${isBlue ? "text-[#e8f0ff]" : ""}`}
                      >
                        {vote.first_name}
                      </p>
                      <p
                        className={`text-[10px] font-label truncate ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
                      >
                        @{vote.username}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`w-16 text-center font-headline font-black text-lg ${isBlue ? "text-[#60aaff]" : "text-primary-container"}`}
                  >
                    {vote.prediction_home_score}
                  </span>
                  <span
                    className={`w-16 text-center font-headline font-black text-lg ${isBlue ? "text-[#e8f0ff]" : "text-on-surface-variant"}`}
                  >
                    {vote.prediction_away_score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-5 border-t flex justify-between items-center ${isBlue ? "border-white/5 bg-white/5" : "border-outline-variant/10"}`}
        >
          <span
            className={`text-[10px] font-label uppercase tracking-widest ${isBlue ? "text-[#5a80b0]" : "text-on-surface-variant"}`}
          >
            {votes?.length ?? 0} vote{(votes?.length ?? 0) !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClose}
            className={`py-2 px-6 rounded-lg border font-label text-sm uppercase tracking-widest transition-colors ${
              isBlue
                ? "border-white/10 text-[#8aabdc] hover:bg-white/5"
                : "border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
