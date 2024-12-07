import { Expense } from "./types";

export default function groupExpensesByDay(expenses: Expense[]): any[] {
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

  // convert the for loop into a .map / .foreach / .reduce

  for (const expense of expenses) {
    const date = new Date(expense.date!); // Parse the ISO date string
    const dayOfWeek = daysOfWeek[date.getUTCDay()]; // Get the day of the week (0 = Sunday, ..., 6 = Saturday)
    groupedExpenses[dayOfWeek] += expense.total; // Sum the total expense for that day
  }

  // Convert the grouped data into the desired format
  return daysOfWeek.map((day) => ({
    day,
    expense: groupedExpenses[day],
  }));
}
