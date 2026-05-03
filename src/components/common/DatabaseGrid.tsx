import { type ReactNode, type RefObject } from "react";

interface DatabaseGridProps {
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  emptySubtext: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  observerRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

export function DatabaseGrid({
  isLoading,
  isEmpty,
  emptyLabel,
  emptySubtext,
  hasActiveFilters,
  onClearFilters,
  hasNextPage,
  isFetchingNextPage,
  observerRef,
  children,
}: DatabaseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-[rgba(18,20,17,0.6)] rounded-xl h-[138px] animate-pulse border border-[rgba(71,72,69,0.1)]"
          />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <div className="w-14 h-14 rounded-full border border-[rgba(71,72,69,0.3)] flex items-center justify-center text-2xl mb-2">
          🔍
        </div>
        <p className="font-[Bebas_Neue,sans-serif] text-[22px] tracking-[0.06em] text-[rgba(255,255,255,0.3)]">
          {emptyLabel}
        </p>
        <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[0.08em] max-w-xs">
          {emptySubtext}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="mt-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--color-neon)] bg-[var(--color-neon)]/8 border border-[var(--color-neon)]/20 px-3 py-1.5 rounded-[4px] hover:bg-[var(--color-neon)]/12 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {children}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div
          ref={observerRef}
          className="h-20 w-full mt-4 flex items-center justify-center"
        >
          <div className="w-6 h-6 border-2 border-[var(--color-neon)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
