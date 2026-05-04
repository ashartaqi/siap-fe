import { Swords } from "lucide-react";

interface BattleLoadingScreenProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export function BattleLoadingScreen({
  title,
  subtitle,
  icon,
}: BattleLoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-40 h-40 flex items-center justify-center mb-12">
        <div className="absolute inset-0 border-4 border-[rgba(0,255,102,0.1)] border-t-[#00ff66] rounded-full animate-spin" />
        {icon ? (
          icon
        ) : (
          <Swords size={60} className="text-[#00ff66] animate-pulse" />
        )}
      </div>
      <h2 className="text-3xl font-[Bebas_Neue] uppercase tracking-[0.4em] text-[#00ff66] animate-bounce text-center">
        {title}
      </h2>
      <div className="text-[10px] text-[#555] uppercase tracking-[0.6em] mt-4 text-center">
        {subtitle}
      </div>
    </div>
  );
}
