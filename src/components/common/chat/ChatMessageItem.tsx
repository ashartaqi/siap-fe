interface ChatMessageItemProps {
  username: string;
  content: string;
  created_at: string;
  isOwn: boolean;
  size?: "sm" | "md";
  theme?: "green" | "blue";
}

export function ChatMessageItem({
  username,
  content,
  created_at,
  isOwn,
  size = "md",
  theme = "green",
}: ChatMessageItemProps) {
  const isBlue = theme === "blue";
  const avatarSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? 16 : 20;
  const textSize = size === "sm" ? "text-[12px]" : "text-[13px]";
  const nameSize = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <div
        className={`${avatarSize} rounded-full border shrink-0 flex items-center justify-center ${
          isBlue
            ? "bg-white/5 border-white/10"
            : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"
        }`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            isOwn
              ? isBlue
                ? "text-[#60aaff]"
                : "text-[#00ff66]"
              : "text-[#aaaba7]"
          }
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <div className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`${nameSize} font-bold tracking-widest uppercase text-[#aaaba7]`}
          >
            {username}
          </span>
          <span className="text-[8px] text-[#aaaba7]/50 font-bold uppercase">
            {new Date(created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div
          className={`px-4 py-3 rounded-2xl ${textSize} leading-relaxed ${
            isOwn
              ? isBlue
                ? "bg-[#60aaff] text-white font-bold rounded-tr-none shadow-[0_0_20px_rgba(0,100,255,0.15)]"
                : "bg-[#00ff66] text-[#0b0b0b] font-bold rounded-tr-none shadow-[0_0_20px_rgba(0,255,102,0.15)]"
              : isBlue
                ? "bg-white/5 border border-white/10 rounded-tl-none"
                : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-tl-none"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
