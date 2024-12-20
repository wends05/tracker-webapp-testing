import { Pool } from "pg";
import { WeeklySummary } from "./types";

interface RecalculatedWeek {
  total_spent: number;
  total_budget: number;
}

interface recalculateWeekSummaryProps {
  pool: Pool;
  weekly_summary_id: number;
  user_id: number;
}

export default async function recalculateWeekSummary({
  pool,
  weekly_summary_id,
  user_id,
}: recalculateWeekSummaryProps) {
  const { rows: calculatedWeekBudgetAndExpendedRows } =
    await pool.query<RecalculatedWeek>(
      `SELECT SUM(budget) as total_budget, SUM(amount_spent) as total_spent FROM "Category" WHERE user_id = $1`,
      [user_id]
    );

  const { total_budget, total_spent } =
    calculatedWeekBudgetAndExpendedRows[0] as RecalculatedWeek;
  console.log(total_budget, total_spent);

  const total_not_spent = total_budget - total_spent;

  await pool.query<WeeklySummary>(
    `UPDATE "Weekly Summary" SET total_budget = $1, total_spent = $2, total_not_spent = $3 WHERE weekly_summary_id = $4 AND user_id = $5`,
    [total_budget, total_spent, total_not_spent, weekly_summary_id, user_id]
  );
}
