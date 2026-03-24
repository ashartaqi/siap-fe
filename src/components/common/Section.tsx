import React from "react";

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-8">
      <div className="text-[10px] font-condensed font-bold tracking-[2px] text-[#3A5244] uppercase mb-3 pb-2 border-b border-[#111]">
        {title}
      </div>
      {children}
    </div>
  );
}
