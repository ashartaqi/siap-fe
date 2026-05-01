"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, X, MessageSquare } from "lucide-react";
import {
  useGetMatchComments,
  useSendMatchComment,
} from "@/features/main/football";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { Match } from "@/types/football";
import { Toast } from "./Toast";

interface MatchCommentsModalProps {
  match: Match;
  onClose: () => void;
}

export function MatchCommentsModal({
  match,
  onClose,
}: MatchCommentsModalProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: comments = [], isLoading } = useGetMatchComments(match.id);
  const { mutate: sendComment, isPending: isSending } = useSendMatchComment(
    match.id,
  );
  const { data: currentUser } = useGetUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    sendComment(message, {
      onSuccess: () => {
        setMessage("");
        setError(null);
      },
      onError: (err: Error) => {
        console.error("Comment Error:", err);
        setError("Failed to post comment. Please try again.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.05)] w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between bg-[rgba(255,255,255,0.02)]">
          <div>
            <h3 className="font-[Bebas_Neue,sans-serif] text-xl tracking-tight uppercase">
              MATCH <span className="text-[#00ff66]">COMMENTS</span>
            </h3>
            <p className="text-[10px] text-[#aaaba7] uppercase font-bold tracking-widest">
              {match.home_team} VS {match.away_team}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] text-[#aaaba7] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-[rgba(0,255,102,0.2)] border-t-[#00ff66] rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#aaaba7] opacity-30">
              <MessageSquare size={40} className="mb-4" />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
                No comments yet
              </p>
            </div>
          ) : (
            comments.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.username === currentUser?.username ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                  <User
                    size={16}
                    className={
                      msg.username === currentUser?.username
                        ? "text-[#00ff66]"
                        : "text-[#aaaba7]"
                    }
                  />
                </div>
                <div
                  className={`flex flex-col max-w-[80%] ${msg.username === currentUser?.username ? "items-end" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-[#aaaba7]">
                      {msg.username}
                    </span>
                    <span className="text-[8px] text-[#aaaba7]/40 font-bold uppercase">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                      msg.username === currentUser?.username
                        ? "bg-[#00ff66] text-[#0b0b0b] font-bold rounded-tr-none"
                        : "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-[rgba(0,0,0,0.2)] border-t border-[rgba(255,255,255,0.05)] flex gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-[12px] outline-none focus:border-[#00ff66]/40 transition-colors placeholder:text-[#aaaba7]/30"
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="w-10 h-10 bg-[#00ff66] text-[#0b0b0b] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,255,102,0.15)]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}
    </div>
  );
}
