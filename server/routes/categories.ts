import express, { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import { Category, Expense } from "../utils/types";
import recalculateCategoryExpenses from "../utils/recalculateCategoryExpenses";
import recalculateWeekSummaryWithCategory from "../utils/recalculateWeekSummaryWithCategory";

const categoryRouter = express.Router();

categoryRouter.post(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        budget,
        category_color,
        category_name,
        description,
        user_id,
        amount_left,
        amount_spent,
      } = req.body as Category;
      const { rows: categoryRows } = await pool.query<Category>(
        `INSERT INTO "Category" (
        budget,
        category_color,
        category_name,
        user_id,
        description,
        amount_left,
        amount_spent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [
          budget,
          category_color,
          category_name,
          user_id,
          description,
          amount_left,
          amount_spent,
        ]
      );

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id: Number(categoryRows[0].category_id),
      });
      res.status(200).json({ data: categoryRows[0] });
    } catch (error: unknown) {
      next(error);
    }
  }
);

categoryRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await recalculateCategoryExpenses({
        pool,
        category_id: Number(id),
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id: Number(id),
      });

      const data = await pool.query<Category>(
        'SELECT * FROM "Category" WHERE category_id = $1',
        [id]
      );

      if (data.rows.length === 0) {
        throw new Error("Category not found");
      }
      res.json({
        data: data.rows[0],
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

categoryRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        category_name,
        budget,
        category_color,
        amount_left,
        amount_spent,
        description,
        user_id,
      } = req.body as Category;

      const data = await pool.query<Category>(
        `UPDATE "Category" SET
        category_name = $1,
        budget = $2,
        category_color = $3,
        amount_left = $4,
        amount_spent = $5,
        description = $6,
        user_id = $7
      WHERE category_id = $8 RETURNING *`,
        [
          category_name,
          budget,
          category_color,
          amount_left,
          amount_spent,
          description,
          user_id,
          id,
        ]
      );

      await recalculateCategoryExpenses({
        pool,
        category_id: Number(id),
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id: Number(id),
      });

      res.json({
        data: data.rows[0],
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

categoryRouter.get(
  "/:id/expenses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await pool.query<Expense>(
        'SELECT * FROM "Expense" WHERE category_id = $1',
        [id]
      );

      await recalculateCategoryExpenses({
        pool,
        category_id: Number(id),
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id: Number(id),
      });

      res.status(200).json({
        data: data.rows,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

categoryRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await pool.query<Category>(
        'DELETE FROM "Category" WHERE category_id = $1 RETURNING *',
        [id]
      );

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id: Number(data.rows[0].category_id),
        user_id: data.rows[0].user_id,
      });

      res.status(200).json({
        message: "Category successfully deleted",
        data: data.rows[0],
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

export default categoryRouter;
