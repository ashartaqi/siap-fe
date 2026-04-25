"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const styles = {
    success: {
      border: "border-[rgba(0,255,102,0.3)]",
      bg: "bg-[rgba(0,255,102,0.08)]",
      icon: "✓",
      iconColor: "text-[#00ff66]",
      text: "text-[#00ff66]",
    },
    error: {
      border: "border-[rgba(255,80,80,0.3)]",
      bg: "bg-[rgba(255,80,80,0.08)]",
      icon: "✕",
      iconColor: "text-[rgba(255,80,80,0.9)]",
      text: "text-[rgba(255,80,80,0.9)]",
    },
    info: {
      border: "border-[rgba(255,215,0,0.3)]",
      bg: "bg-[rgba(255,215,0,0.08)]",
      icon: "★",
      iconColor: "text-[#ffd700]",
      text: "text-[#ffd700]",
    },
  }[type];

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[9999]
        flex items-center gap-3 px-4 py-3 rounded-xl
        border ${styles.border} ${styles.bg}
        backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        animate-[slideUpFade_0.25s_ease-out]
        min-w-[240px] max-w-[340px]
      `}
    >
      <span className={`text-[16px] font-bold ${styles.iconColor}`}>
        {styles.icon}
      </span>
      <span
        className={`text-[12px] font-semibold tracking-[0.04em] flex-1 ${styles.text}`}
      >
        {message}
      </span>
      <button
        onClick={onClose}
        className="text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.6)] text-[14px] leading-none transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
