"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`w-full bg-[var(--auth-green)] text-[var(--auth-black)] border-none rounded-md font-outfit font-extrabold text-[16px] tracking-[3px] uppercase p-4 cursor-pointer relative overflow-hidden transition-all duration-200 hover:bg-[var(--auth-green-dim)] active:scale-[0.98] group/btn animate-[fadeUp_0.6s_0.35s_ease_both] ${className}`}
      {...rest}
    >
      <span className="relative z-10 block">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-500 group-hover/btn:translate-x-full" />
    </button>
  );
}
