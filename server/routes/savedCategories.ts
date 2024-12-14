import express, { Request, Response } from "express";
import { pool } from "../db";
import { DataResponse, SavedCategories } from "../utils/types";
import recalculateWeekSummaryWithSavedCategory from "../utils/recalculateWeekSummaryWithSavedCategory";
import recalculateSavedCategoryExpenses from "../utils/recalculateSavedCategoryExpenses";

const savedCategoriesRouter = express.Router();

savedCategoriesRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    await recalculateSavedCategoryExpenses({
      pool,
      saved_category_id: Number(id),
    });
    await recalculateWeekSummaryWithSavedCategory({
      pool,
      saved_category_id: Number(id),
    });

    const { rows } = await pool.query<SavedCategories>(
      `SELECT * FROM "Saved Categories" WHERE saved_category_id = $1`,
      [id]
    );

    res.status(200).json({
      data: rows[0],
    } satisfies DataResponse<SavedCategories>);
  } catch (error: unknown) {
    res.status(500).json({
      message: (error as Error).message,
      error: error,
    });
  }
});
savedCategoriesRouter.put("/:id", async (req: Request, res: Response) => {
  console.log("PUT request received for ID:", req.params.id);
  try {
    const { id } = req.params;
    const {
      saved_category_id,
      category_name,
      budget,
      category_color,
      amount_left,
      amount_spent,
      weekly_summary_id,
    } = req.body as SavedCategories;

    if (!saved_category_id) {
      throw Error("No saved category id given");
    }
    const data = await pool.query<SavedCategories>(
      `UPDATE "Saved Categories"
       SET
        saved_category_id = $1,
        category_name = $2,
        budget = $3,
        category_color = $4,
        amount_left = $5,
        amount_spent = $6,
        weekly_summary_id = $7
      WHERE
        saved_category_id = $8 RETURNING *
      `,
      [
        saved_category_id,
        category_name,
        budget,
        category_color,
        amount_left,
        amount_spent,
        weekly_summary_id,
        id,
      ]
    );

    await recalculateSavedCategoryExpenses({
      pool,
      saved_category_id: Number(id),
    });
    await recalculateWeekSummaryWithSavedCategory({
      pool,
      saved_category_id: Number(id),
    });

    res.status(200).json({ data: data.rows[0] });
  } catch (error: unknown) {
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

savedCategoriesRouter.get(
  "/:id/expenses",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { rows } = await pool.query(
        `SELECT * FROM "Expense" WHERE saved_category_id = $1`,
        [id]
      );

      res.status(200).json({
        data: rows,
      });
    } catch (error: unknown) {
      res.status(500).json({
        message: "An error has occured",
        error: (error as Error).message,
      });
    }
  }
);

savedCategoriesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query<SavedCategories>(
      `DELETE FROM "Saved Categories" WHERE saved_category_id = $1 RETURNING *`,
      [id]
    );

    await recalculateWeekSummaryWithSavedCategory({
      pool,
      saved_category_id: Number(id),
    });
    res.status(200).json({
      message: "Saved category successfully deleted",
      data: data.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

export default savedCategoriesRouter;
