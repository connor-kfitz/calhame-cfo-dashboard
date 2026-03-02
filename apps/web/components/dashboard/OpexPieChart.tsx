"use client";

import type { OpexCompChartData } from "@repo/shared";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";

interface OpexPieChartProps {
  data: OpexCompChartData[];
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#a855f7"
];

export default function OpexPieChart({ data }: OpexPieChartProps) {
  const chartData = data
    .filter((item) => item.total > 0)
    .map((item, index) => ({
      name: item.category,
      value: Number(item.total),
      fill: COLORS[index % COLORS.length],
    }));

  const config = chartData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length] ?? "#64748b",
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle>OpEx Composition</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent/>}
              formatter={(value) => {
                const percentage = ((Number(value) / total) * 100).toFixed(1);
                return `$${Number(value).toLocaleString()} (${percentage}%)`;
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill}/>
              ))}
            </Pie>
            <Legend/>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
