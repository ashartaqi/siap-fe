interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121411] border border-[rgba(71,72,69,0.3)] p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="font-[Bebas_Neue] text-2xl text-[#fcfcf8] tracking-wider mb-2">
          {title}
        </h3>
        <div className="text-[12px] text-[rgba(255,255,255,0.6)] leading-relaxed mb-6">
          {message}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-[rgba(71,72,69,0.3)] text-[11px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-[#00ff66] text-[#0a0b09] text-[11px] font-bold tracking-widest uppercase hover:bg-[#00e65c] transition-colors shadow-[0_0_20px_rgba(0,255,102,0.2)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
