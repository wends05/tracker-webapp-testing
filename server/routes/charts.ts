import express, { Request, Response } from "express";
import { pool } from "../db";
import groupExpensesByDay from "../utils/GroupExpensesByDay";

const chartRouter = express.Router();

chartRouter.get(
  "/user/:user_id/week/:week_id",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if (!user_id) {
      throw Error("User ID is required.");
    }

    try {
      // SQL Query with user_id filter
      const query = `
      SELECT
        e.total,
        e.date
      FROM
        "Expense" e
      LEFT JOIN
        "Category" c
        ON e.category_id = c.category_id
      WHERE
        c.user_id = $1
      `;

      // Pass user_id as a parameter to the query
      const { rows } = await pool.query(query, [user_id]);
      const arranged = groupExpensesByDay(rows);

      res.status(200).json({
        data: arranged,
      });
    } catch (error) {
      console.error("Error fetching weekly expenses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default chartRouter;
