"use client";

interface CreateDreamTeamButtonProps {
  onClick: () => void;
  disabled?: boolean;
  filledSlots: number;
  totalSlots: number;
  isUpdate?: boolean;
}

export function CreateDreamTeamButton({
  onClick,
  disabled = false,
  filledSlots,
  totalSlots,
  isUpdate = false,
}: CreateDreamTeamButtonProps) {
  const remaining = totalSlots - filledSlots;

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        className={`
          relative w-full px-5 py-[14px] rounded-lg border
          font-[Bebas_Neue,sans-serif] text-[18px] tracking-[0.1em] uppercase
          overflow-hidden flex items-center justify-center gap-2.5
          transition-[background,border-color,transform,box-shadow] duration-200
          ${
            disabled
              ? "cursor-not-allowed border-[rgba(71,72,69,0.2)] bg-[rgba(36,39,35,0.4)] text-white/20"
              : "cursor-pointer border-[rgba(0,255,102,0.4)] bg-[rgba(0,255,102,0.06)] text-[#00ff66] hover:bg-[rgba(0,255,102,0.12)] hover:border-[rgba(0,255,102,0.7)] hover:shadow-[0_0_24px_rgba(0,255,102,0.15),0_0_0_1px_rgba(0,255,102,0.1)] hover:-translate-y-px active:scale-[0.98]"
          }
        `}
      >
        <span className="font-['Material_Symbols_Outlined'] text-[18px] leading-none">
          {disabled ? "lock" : isUpdate ? "update" : "SIAP"}
        </span>
        {isUpdate ? "Update Dream Team" : "Create Dream Team"}
      </button>

      {disabled && remaining > 0 && (
        <p className="font-[Oxanium,sans-serif] text-[9px] font-bold tracking-[0.18em] uppercase text-white/25 text-center mt-1.5">
          {remaining} more player{remaining !== 1 ? "s" : ""} needed
        </p>
      )}
    </div>
  );
}
