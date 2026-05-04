interface EmptyNodeProps {
  round: string;
}

export function EmptyNode({ round }: EmptyNodeProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-[rgba(100,160,255,0.15)] backdrop-blur-2xl bg-[linear-gradient(135deg,rgba(10,25,60,0.8)_0%,rgba(5,15,40,0.9)_100%)] w-full opacity-60">
      <div className="px-3 py-1.5 border-b border-[rgba(100,160,255,0.1)] bg-[rgba(0,80,200,0.2)]">
        <span className="text-[#7eb8ff] text-[8px] font-bold uppercase tracking-[0.2em]">
          {round}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[rgba(100,160,255,0.1)]" />
          <div className="h-2 w-20 bg-[rgba(100,160,255,0.05)] rounded" />
        </div>
        <div className="h-px bg-[rgba(100,160,255,0.05)]" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[rgba(100,160,255,0.1)]" />
          <div className="h-2 w-24 bg-[rgba(100,160,255,0.05)] rounded" />
        </div>
      </div>
    </div>
  );
}
