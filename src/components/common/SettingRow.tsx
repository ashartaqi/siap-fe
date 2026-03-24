import React from "react";

export interface SettingRowProps {
  label: string;
  desc?: string;
  children: React.ReactNode;
}

export function SettingRow({ label, desc, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#0D0D0D]">
      <div>
        <div className="text-[13px] font-medium text-[var(--color-text)] font-body">
          {label}
        </div>
        {desc && (
          <div className="text-[11px] text-[#3A5244] font-condensed mt-0.5">
            {desc}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
