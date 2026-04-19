"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  type?: string;
  readOnly?: boolean;
}

export function EditableText({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  maxLength,
  min,
  max,
  type = "text",
  readOnly = false,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);
  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    let trimmed = draft.trim();
    if (type === "number" && min !== undefined && max !== undefined) {
      const n = Number(trimmed);
      if (!isNaN(n)) trimmed = String(Math.min(max, Math.max(min, n)));
    }
    onChange(trimmed || value);
  };

  if (editing && !readOnly) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        maxLength={maxLength}
        min={min}
        max={max}
        className={[
          "bg-transparent border-b border-[rgba(0,255,102,0.5)] outline-none text-[#00ff66] transition-colors",
          inputClassName ?? className ?? "",
        ].join(" ")}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <span
      onClick={() => !readOnly && setEditing(true)}
      title={readOnly ? undefined : "Click to edit"}
      className={[
        "transition-colors group/edit relative",
        readOnly ? "" : "cursor-text hover:text-[#00ff66]",
        className ?? "",
      ].join(" ")}
    >
      {value || placeholder}
      {!readOnly && (
        <span className="absolute -top-0.5 -right-2 w-1 h-1 rounded-full bg-[rgba(0,255,102,0.5)] opacity-0 group-hover/edit:opacity-100 transition-opacity" />
      )}
    </span>
  );
}
