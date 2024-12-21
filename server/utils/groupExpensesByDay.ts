import { Expense } from "./types";

type WeekExpenseData = {
  day: string;
  expense: number;
}[];

export default function groupExpensesByDay(
  expenses: Expense[]
): WeekExpenseData {
  console.log(expenses);
  // Days of the week in order
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Initialize a map for expenses grouped by day
  const groupedExpenses: Record<string, number> = daysOfWeek.reduce(
    (acc, day) => {
      acc[day] = 0; // Initialize all days with 0 expense
      return acc;
    },
    {} as Record<string, number>
  );

  expenses.forEach((expense) => {
    const date = new Date(expense.date!);
    const dayOfWeek = daysOfWeek[date.getUTCDay() + 1];
    groupedExpenses[dayOfWeek] += expense.total;
  });

  // Convert the grouped data into the desired format
  return daysOfWeek.map((day) => ({
    day,
    expense: groupedExpenses[day],
  }));
}
