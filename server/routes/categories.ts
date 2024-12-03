import express, { Request, Response } from "express";
import { pool } from "../db";
import { Category } from "../utils/types";
import recalculateCategoryExpenses from "../utils/recalculateCategoryExpenses";

const categoryRouter = express.Router();

categoryRouter.post("", async (req: Request, res: Response) => {
  try {
    const {
      budget,
      category_color,
      category_name,
      description,
      user_id,
      amount_left,
      amount_spent,
    }: Category = req.body;
    const data = await pool.query(
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
    res.status(200).json({ data: data.rows[0] });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

categoryRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      'SELECT * FROM "Category" WHERE category_id = $1',
      [id]
    );

    await recalculateCategoryExpenses({
      pool,
      category_id: Number(id),
    });

    if (data.rows.length === 0) {
      throw new Error("Category not found");
    }
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

categoryRouter.put("/:id", async (req: Request, res: Response) => {
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
    }: Category = req.body;

    const data = await pool.query(
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

categoryRouter.get("/:id/expenses", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      'SELECT * FROM "Expense" WHERE category_id = $1',
      [id]
    );

    await recalculateCategoryExpenses({
      pool,
      category_id: Number(id),
    });

    res.status(200).json({
      data: data.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

categoryRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      'DELETE FROM "Category" WHERE category_id = $1 RETURNING *',
      [id]
    );

    res.status(200).json({
      message: "Category successfully deleted",
      data: data.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default categoryRouter;
