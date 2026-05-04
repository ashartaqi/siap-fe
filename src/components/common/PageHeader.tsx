import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  isFetching: boolean;
  children?: ReactNode;
}

export function PageHeader({ title, isFetching, children }: PageHeaderProps) {
  return (
    <div className="border-b border-[rgba(71,72,69,0.2)] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="font-[Bebas_Neue,sans-serif] text-[28px] tracking-[0.06em] text-[#fcfcf8]">
          {title}
        </h1>
        {isFetching && (
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--color-neon)] bg-[var(--color-neon)]/8 border border-[var(--color-neon)]/20 px-2.5 py-1 rounded-[4px] animate-pulse">
            Syncing Live Data…
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
