import React from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className="w-56 border-r bg-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Side bar</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
