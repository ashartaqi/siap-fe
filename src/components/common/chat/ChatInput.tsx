import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isPending,
  placeholder = "Type a message...",
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-[rgba(0,0,0,0.2)] border-t border-[rgba(255,255,255,0.05)] flex gap-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3 text-[13px] outline-none focus:border-[#00ff66]/50 transition-colors placeholder:text-[#aaaba7]/30"
      />
      <button
        type="submit"
        disabled={!value.trim() || isPending}
        className="w-12 h-12 bg-[#00ff66] text-[#0b0b0b] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,255,102,0.2)]"
      >
        <Send size={20} />
      </button>
    </form>
  );
}
