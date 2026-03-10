"use client";

import { StatusBadge } from "@/components/common/StatusBadge";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <StatusBadge label="temp" />
    </div>
  );
}
