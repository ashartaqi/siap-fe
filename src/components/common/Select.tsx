import React, { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

export function Select({ options, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`px-3 py-2 bg-[#0D0D0D] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] font-condensed cursor-pointer outline-none ${className}`}
      {...props}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
