import express, { Request, Response } from "express";
import { pool } from "../db";

const weeklySummaryRouter = express.Router();

weeklySummaryRouter.get(
  "/user/:id/categories",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id);

      const result = await pool.query(
        `SELECT * FROM "Category" WHERE user_id = $1`,
        [id]
      );

      res.status(200).json({ data: result.rows });
    } catch {
      res.status(500).send("Error fetching categories");
    }
  }
);

export default weeklySummaryRouter;
