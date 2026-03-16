"use client";

import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export function Input({
  label,
  icon,
  error,
  type = "text",
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5 animate-[fadeUp_0.6s_ease_both] group/input">
      <label className="block text-[11px] font-semibold tracking-[2px] uppercase text-[var(--auth-muted)] mb-2.5">
        {label}
      </label>
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--auth-muted)] transition-colors duration-200 pointer-events-none group-focus-within/input:text-[var(--auth-green)]">
            {icon}
          </div>
        )}

        <input
          type={currentType}
          className={`w-full bg-[var(--auth-card)] border ${
            error
              ? "border-[var(--auth-error)]"
              : "border-[var(--auth-border)] focus:border-[var(--auth-green)] focus:ring-[3px] focus:ring-[var(--auth-green-glow)]"
          } rounded-md text-[var(--auth-text)] font-sans text-[15px] outline-none transition-all duration-200 ${
            icon ? "pl-11" : "pl-4"
          } pr-4 py-3 placeholder-[var(--auth-muted)]/50`}
          {...rest}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--auth-muted)] hover:text-[var(--auth-green)] p-1 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-[18px] h-[18px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-[18px] h-[18px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="text-[12px] text-[var(--auth-error)] mt-1.5 animate-[fadeUp_0.3s_ease]">
          {error}
        </div>
      )}
    </div>
  );
}
