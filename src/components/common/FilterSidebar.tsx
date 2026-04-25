import { type ReactNode } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  children: ReactNode;
}

export function FilterSidebar({
  isOpen,
  onToggle,
  hasActiveFilters,
  onClearFilters,
  children,
}: FilterSidebarProps) {
  return (
    <>
      <div className="lg:hidden px-5 py-3 border-b border-[rgba(71,72,69,0.2)]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between py-2 px-4 rounded-lg bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] text-[12px] font-bold tracking-[0.1em] uppercase"
        >
          <span>{isOpen ? "Hide Filters" : "Show Filters"}</span>
          <span className="text-[10px] opacity-60">{isOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      <aside
        className={`${isOpen ? "block" : "hidden"} lg:block lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-[rgba(71,72,69,0.2)] p-5 animate-in fade-in slide-in-from-top-2 duration-300 lg:animate-none`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-[Bebas_Neue,sans-serif] text-[16px] tracking-[0.08em] text-[rgba(255,255,255,0.5)]">
            Filters
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[9px] font-bold tracking-[0.15em] uppercase text-[rgba(255,100,100,0.7)] hover:text-[rgba(255,100,100,1)] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-4">{children}</div>
      </aside>
    </>
  );
}
