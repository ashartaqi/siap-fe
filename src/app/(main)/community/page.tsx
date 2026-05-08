"use client";

import { useState, useRef } from "react";
import { MessageSquare } from "lucide-react";
import {
  useGetChatMessages,
  useSendChatMessage,
} from "@/features/main/community";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { ChatMessageItem } from "@/components/common/chat/ChatMessageItem";
import { ChatInput } from "@/components/common/chat/ChatInput";
import { Toast } from "@/components/common/Toast";
import { useScrollToBottom } from "@/lib/hooks/useScrollToBottom";

export default function CommunityPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: messages = [], isLoading } = useGetChatMessages();
  const { mutate: sendMessage, isPending: isSending } = useSendChatMessage();
  const { data: currentUser } = useGetUser();
  const scrollRef = useScrollToBottom(messages);
  const lastSentAt = useRef<number>(0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (!message.trim() || isSending || now - lastSentAt.current < 2000) return;
    lastSentAt.current = now;
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
                <ChatMessageItem
                  key={msg.id}
                  username={msg.username}
                  content={msg.content}
                  created_at={msg.created_at}
                  isOwn={msg.username === currentUser?.username}
                />
              ))
            )}
          </div>

          <ChatInput
            value={message}
            onChange={setMessage}
            onSubmit={handleSend}
            isPending={isSending}
            placeholder="Type your message..."
          />
        </div>
      </div>

      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}
    </>
  );
}
