import { Pie, PieChart } from "recharts";

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
import { SavedCategories } from "@/utils/types";
import { useEffect, useState } from "react";

interface IPieChartData {
  category: string;
  spent: number;
  fill: string;
}

const chartConfig = {
  spent: {
    label: "Spent",
  },
} satisfies ChartConfig;

interface CategoryGraphProps {
  categories: SavedCategories[];
}

export function CategoryGraph({ categories }: CategoryGraphProps) {
  const [data, setData] = useState<IPieChartData[]>([]);

  useEffect(() => {
    const sortedCategories = categories
      .sort((a, b) => b.amount_spent - a.amount_spent)
      .slice(0, 5);

    const chartData = sortedCategories.map((category) => ({
      category: category.category_name,
      spent: category.amount_spent,
      fill: category.category_color,
    }));

    setData(chartData);
    console.log(chartData);
  }, [categories]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Spent Categories</CardTitle>
        <CardDescription>Highest Spending Categories</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="spent"
              nameKey="category"
              innerRadius={50}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
