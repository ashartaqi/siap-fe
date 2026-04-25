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
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2.5 py-1 rounded-[4px] animate-pulse">
            Updating…
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
