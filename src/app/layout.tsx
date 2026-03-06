import type { Metadata } from "next";
import { inter, outfit, jetbrainsMono } from "@/fonts";
import "./global.css";

export const metadata: Metadata = {
  title: "SIAP - Sistem Informasi Administrasi Pegawai",
  description: "Next-gen Employee Management System (SIAP HR)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
