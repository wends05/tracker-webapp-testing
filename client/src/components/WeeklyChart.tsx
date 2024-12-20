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
import { BackendError } from "@/interfaces/ErrorResponse";

interface WeekData {
  day: string;
  expense: number;
}

interface WeeklyDataResult {
  arranged: WeekData[];
  date_start: string;
  date_end: string;
}

const chartConfig = {
  expense: {
    label: "Expense",
    color: "#7A958F",
  },
} satisfies ChartConfig;

interface WeeklyChartProps {
  weekly_summary_id: number | null;
  isRecent?: boolean;
}

export function WeeklyChart({
  weekly_summary_id,
  isRecent = false,
}: WeeklyChartProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: weeklyData } = useQuery<WeeklyDataResult>({
    enabled: !!user,
    queryKey: ["weekchart", weekly_summary_id ?? undefined],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/charts/user/${user?.user_id}/weekly_summary/${weekly_summary_id ?? 0}/?isRecent=${isRecent}`
      );

      if (!response.ok) {
        const error = (await response.json()) as BackendError;
        throw Error(error.message);
      }

      const { data } = (await response.json()) as { data: WeeklyDataResult };
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          {weeklyData?.date_start} - {weeklyData?.date_end}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={weeklyData?.arranged}
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
