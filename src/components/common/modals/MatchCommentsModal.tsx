"use client";

import { useState } from "react";
import { X, MessageSquare } from "lucide-react";
import {
  useGetMatchComments,
  useSendMatchComment,
} from "@/features/main/football";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { ChatMessageItem } from "@/components/common/chat/ChatMessageItem";
import { ChatInput } from "@/components/common/chat/ChatInput";
import { Toast } from "../Toast";
import { Match } from "@/features/main/football/types";
import { useScrollToBottom } from "@/lib/hooks/useScrollToBottom";

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
  const scrollRef = useScrollToBottom(comments);

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
              <ChatMessageItem
                key={msg.id}
                username={msg.username}
                content={msg.content}
                created_at={msg.created_at}
                isOwn={msg.username === currentUser?.username}
                size="sm"
              />
            ))
          )}
        </div>

        <ChatInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSend}
          isPending={isSending}
          placeholder="Write a comment..."
        />
      </div>

      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}
    </div>
  );
}
