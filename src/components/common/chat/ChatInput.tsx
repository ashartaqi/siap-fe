import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  placeholder?: string;
  theme?: "green" | "blue";
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isPending,
  placeholder = "Type a message...",
  theme = "green",
}: ChatInputProps) {
  const isBlue = theme === "blue";

  return (
    <form
      onSubmit={onSubmit}
      className={`p-4 border-t flex gap-3 ${isBlue ? "bg-black/20 border-white/5" : "bg-[rgba(0,0,0,0.2)] border-[rgba(255,255,255,0.05)]"}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 rounded-xl px-5 py-3 text-[13px] outline-none transition-colors placeholder:text-[#aaaba7]/30 ${
          isBlue
            ? "bg-white/5 border-white/10 focus:border-[#60aaff]/50"
            : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] focus:border-[#00ff66]/50"
        }`}
      />
      <button
        type="submit"
        disabled={!value.trim() || isPending}
        className={`w-12 h-12 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg ${
          isBlue
            ? "bg-[#60aaff] text-white shadow-[0_0_20px_rgba(0,100,255,0.2)]"
            : "bg-[#00ff66] text-[#0b0b0b] shadow-[0_0_20px_rgba(0,255,102,0.2)]"
        }`}
      >
        <Send size={20} />
      </button>
    </form>
  );
}
