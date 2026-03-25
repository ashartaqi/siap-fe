import React from "react";
import { LucideIcon } from "lucide-react";

export interface SectionDef {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SettingsSidebarProps {
  sections: SectionDef[];
  activeSection: string;
  onSelect: (id: string) => void;
}

export function SettingsSidebar({
  sections,
  activeSection,
  onSelect,
}: SettingsSidebarProps) {
  return (
    <div className="animate-fade-up w-[200px] shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 h-fit sticky top-[92px]">
      {sections.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id;
        return (
          <div
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-all duration-150 border-l-2 ${
              isActive
                ? "bg-[rgba(0,102,51,0.25)] border-l-[var(--color-neon)]"
                : "bg-transparent border-l-transparent hover:bg-[#111]"
            }`}
          >
            <Icon
              size={15}
              color={isActive ? "var(--color-neon)" : "var(--color-text-muted)"}
              strokeWidth={1.5}
            />
            <span
              className={`text-[13px] font-condensed transition-colors ${
                isActive
                  ? "font-bold text-[var(--color-text)]"
                  : "font-normal text-[var(--color-text-muted)] group-hover:text-[#a0bcae]"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
