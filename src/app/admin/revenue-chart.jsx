"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const data = [{
  month: "Jan",
  revenue: 4200,
  orders: 28
}, {
  month: "Feb",
  revenue: 5100,
  orders: 34
}, {
  month: "Mar",
  revenue: 4800,
  orders: 31
}, {
  month: "Apr",
  revenue: 6300,
  orders: 42
}, {
  month: "May",
  revenue: 7100,
  orders: 48
}, {
  month: "Jun",
  revenue: 6800,
  orders: 45
}, {
  month: "Jul",
  revenue: 8200,
  orders: 56
}, {
  month: "Aug",
  revenue: 7600,
  orders: 51
}, {
  month: "Sep",
  revenue: 9100,
  orders: 62
}, {
  month: "Oct",
  revenue: 9800,
  orders: 67
}, {
  month: "Nov",
  revenue: 11200,
  orders: 78
}, {
  month: "Dec",
  revenue: 12400,
  orders: 84
}];
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)"
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)"
  }
};
export function RevenueChart() {
  return <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{
        left: -8,
        right: 8,
        top: 8,
        bottom: 0
      }}>
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{
          fill: "var(--muted-foreground)",
          fontSize: 12
        }} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{
          fill: "var(--muted-foreground)",
          fontSize: 12
        }} />
          <Tooltip cursor={{
          stroke: "var(--border)",
          strokeWidth: 1
        }} content={<ChartTooltipContent formatter={(value, name) => {
          const num = Number(value);
          if (name === "revenue") return [`$${num.toLocaleString()}`, "Revenue"];
          return [String(num), "Orders"];
        }} />} />
          <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} fill="url(#fillRevenue)" dot={false} activeDot={{
          r: 4,
          fill: "var(--color-revenue)"
        }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>;
}

// Re-export for parity / future expansion
export { ChartTooltip };
