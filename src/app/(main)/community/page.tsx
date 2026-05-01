"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import {
  useGetChatMessages,
  useSendChatMessage,
} from "@/features/main/community";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { Toast } from "@/components/common/Toast";

export default function CommunityPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: messages = [], isLoading } = useGetChatMessages();
  const { mutate: sendMessage, isPending: isSending } = useSendChatMessage();
  const { data: currentUser } = useGetUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    sendMessage(message, {
      onSuccess: () => {
        setMessage("");
        setError(null);
      },
      onError: (err: Error) => {
        console.error("Chat Error:", err);
        setError("Failed to send message. Please try again.");
      },
    });
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto font-[Oxanium,sans-serif] text-[#fcfcf8]">
        <div className="mb-6">
          <h1 className="font-[Bebas_Neue,sans-serif] text-[42px] leading-none tracking-tight uppercase">
            COMMUNITY <span className="text-[#00ff66]">CHAT</span>
          </h1>
          <p className="text-[12px] text-[#aaaba7] tracking-wider uppercase mt-2">
            Connect with other managers and discuss tactics
          </p>
        </div>

        <div className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-[rgba(0,255,102,0.2)] border-t-[#00ff66] rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#aaaba7] opacity-50">
                <MessageSquare size={48} className="mb-4" />
                <p className="text-sm font-bold tracking-widest uppercase">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.username === currentUser?.username ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                    <User
                      size={20}
                      className={
                        msg.username === currentUser?.username
                          ? "text-[#00ff66]"
                          : "text-[#aaaba7]"
                      }
                    />
                  </div>
                  <div
                    className={`flex flex-col max-w-[70%] ${msg.username === currentUser?.username ? "items-end" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#aaaba7]">
                        {msg.username}
                      </span>
                      <span className="text-[8px] text-[#aaaba7]/50 font-bold uppercase">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                        msg.username === currentUser?.username
                          ? "bg-[#00ff66] text-[#0b0b0b] font-bold rounded-tr-none shadow-[0_0_20px_rgba(0,255,102,0.15)]"
                          : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="p-4 bg-[rgba(0,0,0,0.2)] border-t border-[rgba(255,255,255,0.05)] flex gap-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3 text-[13px] outline-none focus:border-[#00ff66]/50 transition-colors placeholder:text-[#aaaba7]/30"
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="w-12 h-12 bg-[#00ff66] text-[#0b0b0b] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,255,102,0.2)]"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}
    </>
  );
}
