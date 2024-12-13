import express, { Request, Response } from "express";
import { pool } from "../db";
import groupExpensesByDay from "../utils/groupExpensesByDay";
import { Expense } from "../utils/types";

const chartRouter = express.Router();

chartRouter.get(
  "/user/:user_id/week/:week_id",
  async (req: Request, res: Response) => {
    const { user_id, week_id } = req.params;

    try {
      if (parseInt(week_id) != 0) {
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
        const { rows } = await pool.query<Expense>(query, [user_id]);
        const arranged = groupExpensesByDay(rows);

        res.status(200).json({
          data: arranged,
        });
      } else {
        const { rows } = await pool.query<Expense>(
          `SELECT e.total, e.date FROM "Expense" e
              LEFT JOIN
                "Saved Categories" sc
              ON
                e.saved_category_id = sc.saved_category_id
              WHERE
                sc.weekly_summary_id = $1
            `,
          [week_id]
        );

        console.log(rows);

        const arranged = groupExpensesByDay(rows);
        res.status(200).json({
          data: arranged,
        });
      }
    } catch (error) {
      console.error("Error fetching weekly expenses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default chartRouter;
