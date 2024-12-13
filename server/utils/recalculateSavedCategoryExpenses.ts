import { Pool } from "pg";

interface RecalculatedSavedCategory {
  amount_spent: number;
  amount_left: number;
}

interface RecalculateSavedExpensesProps {
  pool: Pool;
  saved_category_id: number;
}

// get current week and recalculate the weekly summary based on the expenses of a category
export default async function recalculateSavedCategoryExpenses({
  pool,
  saved_category_id,
}: RecalculateSavedExpensesProps) {
  const { rows: totalExpenseRows } = await pool.query(
    `SELECT SUM(total) as total_expenses FROM "Expense" WHERE saved_category_id = $1`,
    [saved_category_id]
  );

  const { rows: savedCategoryBudgetRows } = await pool.query(
    `SELECT budget FROM "Saved Category" WHERE saved_category_id = $1`,
    [saved_category_id]
  );

  const totalExpended = totalExpenseRows[0].total_expenses || 0;
  const budget = savedCategoryBudgetRows[0].budget || 0;
  const amount_left = budget - totalExpended;

  console.log(totalExpended, budget, amount_left);

  if (amount_left < 0) {
    throw Error("Expenses exceeded the budget");
  }

  await pool.query(
    `UPDATE "Saved Category" SET amount_left = $1, amount_spent = $2 WHERE saved_category_id = $3`,
    [amount_left, totalExpended, saved_category_id]
  );

  return {
    amount_left,
    amount_spent: totalExpenseRows[0],
  } satisfies RecalculatedSavedCategory;
}
