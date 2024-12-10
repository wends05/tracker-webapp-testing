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
import { useQuery } from "@tanstack/react-query";
import getUser from "@/utils/getUser";
import { User } from "@/utils/types";

interface WeekData {
  day: string;
  expense: number;
}

const chartConfig = {
  expense: {
    label: "",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface WeeklyChartProps {
  week: number | null;
}

export function WeeklyChart({ week }: WeeklyChartProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: weeklyData } = useQuery<WeekData[]>({
    enabled: !!user,
    queryKey: ["weekchart", week],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/charts/user/${user?.user_id}/week/${week}`
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw Error(errorMessage);
      }

      const { data } = await response.json();
      return data;
    },
  });

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
            data={weeklyData}
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
