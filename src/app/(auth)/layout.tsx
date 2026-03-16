import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen font-sans text-[var(--auth-text)] bg-[var(--auth-black)] selection:bg-[var(--auth-green-glow)] overflow-hidden md:overflow-auto">
      <div className="auth-bg"></div>
      <div className="auth-grid-lines"></div>
      <div className="relative z-10 min-h-screen grid grid-cols-1 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}
