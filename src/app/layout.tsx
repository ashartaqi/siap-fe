import type { Metadata } from "next";
import { inter, outfit, jetbrainsMono } from "@/fonts";
import "./global.css";

export const metadata: Metadata = {
  title: "SIAP - Sports Information and Analytics Platform",
  description:
    "A modern, data-driven platform that streamlines employee management with powerful analytics, real-time insights, and smart decision-making tools.",
};

import AppProviders from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
