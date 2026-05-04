"use client";

import React, { useState } from "react";

export interface ToggleProps {
  defaultChecked?: boolean;
}

export function Toggle({ defaultChecked = true }: ToggleProps) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full cursor-pointer transition-all duration-300 ease-out border ${
        on
          ? "bg-[rgba(0,102,51,0.5)] border-[var(--color-green-mid)]"
          : "bg-[var(--color-surface-3)] border-[var(--color-border)]"
      }`}
    >
      <div
        className={`absolute top-[2px] w-4 h-4 rounded-full transition-all duration-300 ease-out ${
          on
            ? "left-[23px] bg-[var(--color-neon)] shadow-[0_0_8px_rgba(0,255,127,0.4)]"
            : "left-[3px] bg-[var(--color-text-muted)] shadow-none"
        }`}
      />
    </div>
  );
}
