import { Pool } from "pg";
import getLastSunday from "./getLastSunday";
import { Category, WeeklySummary } from "./types";

interface RecalculatedWeek {
  total_spent: number;
  total_budget: number;
}

interface recalculateWeekProps {
  pool: Pool;
  category_id: number;
}
// recalculate the weekly summary based on the expenses of a category
export default async function recalculateWeekSummaryWithCategory({
  pool,
  category_id,
}: recalculateWeekProps) {
  // get category
  const { rows: userIdRows } = await pool.query<Category>(
    `SELECT user_id FROM "Category" WHERE category_id = $1`,
    [category_id]
  );

  // get user_id by category
  const userId = userIdRows[0].user_id;

  const { rows: calculatedWeekBudgetAndExpendedRows } =
    await pool.query<RecalculatedWeek>(
      `SELECT SUM(budget) as total_budget, SUM(amount_spent) as total_spent FROM "Category" WHERE user_id = $1`,
      [userId]
    );

  const { total_budget, total_spent } = calculatedWeekBudgetAndExpendedRows[0];

  const total_not_spent = total_budget || 0 - total_spent || 0;
  const lastSunday = getLastSunday();
  await pool.query<WeeklySummary>(
    `UPDATE "Weekly Summary" SET total_budget = $1, total_spent = $2, total_not_spent = $3 WHERE date_start = $4`,
    [total_budget, total_spent, total_not_spent, lastSunday]
  );
}
