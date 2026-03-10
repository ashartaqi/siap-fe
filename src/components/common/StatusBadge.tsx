type StatusType = "success" | "pending" | "danger" | "info";

interface StatusBadgeProps {
  label: string;
  type?: StatusType;
  pulse?: boolean;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function StatusBadge({
  label,
  type = "info",
  pulse = false,
}: StatusBadgeProps) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[type]} ${pulse ? "animate-pulse" : ""}`}
    >
      {label}
    </span>
  );
}
