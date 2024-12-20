import express, { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import { Category, Expense } from "../utils/types";
import recalculateCategoryExpenses from "../utils/recalculateCategoryExpenses";
import recalculateSavedCategoryExpenses from "../utils/recalculateSavedCategoryExpenses";
import recalculateWeekSummaryWithCategory from "../utils/recalculateWeekSummaryWithCategory";
import recalculateWeekSummaryWithSavedCategory from "../utils/recalculateWeekSummaryWithSavedCategory";

const expenseRouter = express.Router();

expenseRouter.post(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        expense_name,
        price,
        quantity,
        total,
        category_id,
        date,
        saved_category_id,
      } = req.body as Expense;

      console.log("date: ", date);
      console.log("category_id: ", category_id);
      console.log("saved_category_id: ", saved_category_id);
      if (category_id) {
        const budget = await pool.query<Category>(
          `SELECT amount_left FROM "Category" WHERE category_id= $1`,
          [category_id]
        );

        const remainingBudget = budget.rows[0].amount_left;

        if (total > remainingBudget) {
          throw Error("Total exceeds remaining budget.");
        }

        const result = await pool.query<Expense>(
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
        const budget = await pool.query<Category>(
          `SELECT amount_left FROM "Saved Categories" WHERE saved_category_id= $1`,
          [saved_category_id]
        );

        const remainingBudget = budget.rows[0].amount_left;

        if (total > remainingBudget) {
          throw Error("Total exceeds remaining budget.");
        }

        const result = await pool.query<Expense>(
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
    } catch (error: unknown) {
      next(error);
    }
  }
);

//fetch the top 5 highest expenses of the week
expenseRouter.get(
  "/user/:id/highest-expenses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT * FROM "Expense"
          INNER JOIN "Category"
            ON "Expense".category_id = "Category".category_id
          WHERE
            "Category".user_id = $1
          ORDER BY total DESC
          LIMIT 5
        `,
        [id]
      );

      if (result.rows.length > 0) {
        res.status(200).json({
          data: result.rows,
        });
      } else {
        res.status(200).json({
          message: "No expenses found for the current week.",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

expenseRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await pool.query<Expense>(
        `SELECT * from "Expense" WHERE expense_id = $1`,
        [id]
      );

      res.status(200).json({
        data: data.rows[0],
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

expenseRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
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
      } = req.body as Expense;

      const data = await pool.query<Expense>(
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
        return;
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
        return;
      }
      throw Error("No category or saved category id provided.");
    } catch (error: unknown) {
      next(error);
    }
  }
);

expenseRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deletedExpenseResult = await pool.query<Expense>(
        `DELETE from "Expense" WHERE expense_id = $1 RETURNING *`,
        [id]
      );

      const { category_id, saved_category_id } = deletedExpenseResult
        .rows[0] as Expense;

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

        await recalculateWeekSummaryWithSavedCategory({
          pool,
          saved_category_id,
        });
      }

      res.status(200).json({
        data: deletedExpenseResult.rows[0],
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

export default expenseRouter;
