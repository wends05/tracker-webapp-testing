import express, { Request, Response } from "express";
import { pool } from "../db";
import Expense from "../types/Expense";

const expenseRouter = express.Router();

expenseRouter.post("", async (req: Request, res: Response) => {
try {
  console.log("p")
  const {expense_name, price, quantity, total, category_id}: Expense = req.body
  const result = await pool.query(
    'INSERT INTO "Expense"(expense_name, price, quantity, total, category_id) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [expense_name, price, quantity, total, category_id]
  )

res.status(200).json({
  data: result.rows[0]
})

} catch (error: any) {
  res.status(500).json({
    message: "An error has occured",
    error: error.message,
  });
}
})

expenseRouter.put(":expense_id", async (req: Request, res: Response) => {
  try {
    const { expense_id } = req.params;
    const { expense_name, price, quantity, total }: Expense = req.body;
    const data = await pool.query(
      'UPDATE "Expense" SET expense_name = $1, price = $2, quantity = $3, total = $4 WHERE expense_id = $5 RETURNING *',
      [expense_name, price, quantity, total, expense_id]
    );

    res.json({
      data: data.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default expenseRouter;
