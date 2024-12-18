import express, { Request, Response } from "express";
import { pool } from "../db";
import { Expense } from "../utils/types";
import recalculateCategoryExpenses from "../utils/recalculateCategoryExpenses";
import recalculateSavedCategoryExpenses from "../utils/recalculateWeekSummaryWithSavedCategory";
import recalculateWeekSummaryWithCategory from "../utils/recalculateWeekSummaryWithCategory";
import recalculateWeekSummaryWithSavedCategory from "../utils/recalculateWeekSummaryWithSavedCategory";

const expenseRouter = express.Router();

expenseRouter.post("", async (req: Request, res: Response) => {
  try {
    const {
      expense_name,
      price,
      quantity,
      total,
      category_id,
      date,
      saved_category_id,
    }: Expense = req.body;

    console.log("date: ", date);

    if (!category_id && !saved_category_id) {
      throw Error("Category is required.");
    }
    if (category_id) {
      const budget = await pool.query(
        'SELECT amount_left FROM "Category" WHERE category_id= $1',
        [category_id]
      );

      const remainingBudget = budget.rows[0].amount_left;

      if (total > remainingBudget) {
        throw Error("Total exceeds remaining budget.");
      }

      const result = await pool.query(
        `INSERT INTO "Expense" (expense_name, price, quantity, total, category_id, date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [expense_name, price, quantity, total, category_id, date]
      );
      await recalculateCategoryExpenses({
        pool,
        category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });

      res.status(200).json({
        data: result.rows[0],
      });
    }

    if (saved_category_id) {
      const budget = await pool.query(
        'SELECT amount_left FROM "Saved Categories" WHERE saved_category_id= $1',
        [saved_category_id]
      );

      const remainingBudget = budget.rows[0].amount_left;

      if (total > remainingBudget) {
        throw Error("Total exceeds remaining budget.");
      }

      const result = await pool.query(
        `INSERT INTO "Expense" (expense_name, price, quantity, total, saved_category_id, date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [expense_name, price, quantity, total, saved_category_id, date]
      );

      await recalculateSavedCategoryExpenses({
        pool,
        saved_category_id,
      });

      await recalculateWeekSummaryWithSavedCategory({
        pool,
        saved_category_id,
      });

      res.status(200).json({
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

//fetch the top 5 highest expenses of the week
expenseRouter.get("/highest-expenses/week", async (req: Request, res: Response) => {
  try {
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const result = await pool.query(
      `
      SELECT * FROM "Expense"
      WHERE date BETWEEN $1 AND $2
      ORDER BY total DESC
      LIMIT 5
      `,
      [currentWeekStart.toISOString(), currentWeekEnd.toISOString()]
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        data: result.rows,
      });
    } else {
      res.status(404).json({
        message: "No expenses found for the current week.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occurred",
      error: error.message,
    });
  }
});

expenseRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      'SELECT * from "Expense" WHERE expense_id = $1',
      [id]
    );

    res.status(200).json({
      data: data.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

expenseRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      expense_name,
      price,
      quantity,
      total,
      category_id,
      date,
      saved_category_id,
    }: Expense = req.body;

    const data = await pool.query(
      `UPDATE "Expense" SET expense_name = $1, price = $2, quantity = $3, total = $4, date = $5 WHERE expense_id = $6 RETURNING *`,
      [expense_name, price, quantity, total, date, id]
    );
    if (category_id) {
      await recalculateCategoryExpenses({
        pool,
        category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });

      res.status(200).json({
        data: data.rows[0],
      });
    }

    if (saved_category_id) {
      await recalculateSavedCategoryExpenses({
        pool,
        saved_category_id,
      });

      await recalculateWeekSummaryWithSavedCategory({
        pool,
        saved_category_id,
      });
      res.status(200).json({
        data: data.rows[0],
      });
    }
    throw Error("No category or saved category id provided.");
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

expenseRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedExpenseResult = await pool.query(
      'DELETE from "Expense" WHERE expense_id = $1 RETURNING *',
      [id]
    );

    const { category_id, saved_category_id } = deletedExpenseResult
      .rows[0] as Expense;

    if (!category_id) {
      throw Error("Category ID is required.");
    }

    if (category_id) {
      await recalculateCategoryExpenses({
        pool,
        category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });
    }

    if (saved_category_id) {
      await recalculateSavedCategoryExpenses({
        pool,
        saved_category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });
    }

    res.status(200).json({
      data: deletedExpenseResult.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default expenseRouter;
