"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { day: "Sunday", expense: 186 },
  { day: "Monday", expense: 305 },
  { day: "Tuesday", expense: 237 },
  { day: "Wednesday", expense: 73 },
  { day: "Thursday", expense: 209 },
  { day: "Friday", expense: 214 },
  { day: "Saturday", expense: 214 },
];

const chartConfig = {
  expense: {
    label: "",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function WeeklyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Dec 1 - Dec 7, 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            width={400} // Set the width
            height={300} // Set the height
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="expense" fill="var(--color-desktop)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
