"use client";

interface Props {
  value: "Left" | "Right";
  onChange: (v: "Left" | "Right") => void;
  readOnly?: boolean;
}

export function FootToggle({ value, onChange, readOnly = false }: Props) {
  return (
    <button
      onClick={() => !readOnly && onChange(value === "Left" ? "Right" : "Left")}
      title={readOnly ? undefined : "Click to toggle foot"}
      className={[
        "font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] transition-colors",
        readOnly ? "cursor-default" : "cursor-pointer hover:text-[#00ff66]",
      ].join(" ")}
    >
      {value.toUpperCase()}
    </button>
  );
}
