"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useGetCountries } from "@/features/main/football";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function CountryPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: countries = [] } = useGetCountries();

  const filtered = useMemo(
    () =>
      countries.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [search, countries],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Click to select country"
        className="font-[Bebas_Neue,sans-serif] text-[14px] text-[#fcfcf8] hover:text-[#00ff66] transition-colors cursor-pointer truncate max-w-[72px] block text-center"
      >
        {value || "---"}
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-[rgba(18,20,17,0.97)] border border-[rgba(0,255,102,0.2)] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-44">
          <div className="p-2 border-b border-[rgba(71,72,69,0.3)]">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[4px] px-2 py-1 font-[Oxanium,sans-serif] text-[11px] text-[#fcfcf8] outline-none placeholder:text-white/20 focus:border-[rgba(0,255,102,0.4)]"
            />
          </div>
          <div className="overflow-y-auto max-h-40">
            {filtered.length === 0 ? (
              <div className="text-[10px] text-white/30 text-center py-3">
                No match
              </div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={[
                    "w-full text-left px-3 py-1.5 text-[11px] font-[Oxanium,sans-serif] transition-colors cursor-pointer block",
                    value === country
                      ? "bg-[rgba(0,255,102,0.12)] text-[#00ff66]"
                      : "text-white/60 hover:text-[#fcfcf8] hover:bg-white/5",
                  ].join(" ")}
                >
                  {country}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
