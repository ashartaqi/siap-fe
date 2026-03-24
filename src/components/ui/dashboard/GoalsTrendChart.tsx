"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface GoalsTrendChartProps {
  data: Array<{ gw: string; goals: number; conceded: number }>;
}

export function GoalsTrendChart({ data }: GoalsTrendChartProps) {
  return (
    <div className="animate-fade-up delay-200 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-5.5 px-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="font-condensed font-bold text-[14px] text-[var(--color-text)] tracking-[1px]">
            GOALS TREND
          </div>
          <div className="text-[11px] text-[#3A5244] font-condensed tracking-[1px]">
            GW26 – GW32
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 bg-[var(--color-neon)] rounded-sm" />
            <span className="text-[11px] text-[var(--color-text-muted)] font-condensed">
              Scored
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 bg-[#FF3B30] rounded-sm" />
            <span className="text-[11px] text-[var(--color-text-muted)] font-condensed">
              Conceded
            </span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="goalsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-neon)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--color-neon)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="concededGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF3B30" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="gw"
            tick={{
              fill: "#3A5244",
              fontSize: 11,
              fontFamily: "var(--font-condensed)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: "#3A5244",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontFamily: "var(--font-condensed)",
            }}
            labelStyle={{ color: "var(--color-text-muted)" }}
            itemStyle={{ color: "var(--color-text)" }}
          />
          <Area
            type="monotone"
            dataKey="goals"
            stroke="var(--color-neon)"
            strokeWidth={2}
            fill="url(#goalsGrad)"
            dot={{ fill: "var(--color-neon)", r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="conceded"
            stroke="#FF3B30"
            strokeWidth={2}
            fill="url(#concededGrad)"
            dot={{ fill: "#FF3B30", r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
