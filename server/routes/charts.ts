import express, { Request, Response } from "express";
import { pool } from "../db";
import groupExpensesByDay from "../utils/groupExpensesByDay";
import { Expense } from "../utils/types";
import getLastSunday from "../utils/getLastSunday";

const chartRouter = express.Router();

chartRouter.get(
  "/user/:user_id/weekly_summary/:weekly_summary_id",
  async (req: Request, res: Response) => {
    const { user_id, weekly_summary_id } = req.params;

    try {
      if (parseInt(weekly_summary_id) != 0) {
        // SQL Query with user_id filter
        const query = `SELECT e.total, e.date
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

        const date_start = new Date(getLastSunday()).toDateString();
        const date_end = new Date(
          new Date(date_start).setDate(new Date(date_start).getDate() + 6)
        ).toDateString();

        res.status(200).json({
          data: {
            arranged,
            date_start,
            date_end,
          },
        });
      } else {
        const { rows } = await pool.query(
          `SELECT e.total, e.date, sc.date_start, sc.date_end FROM "Expense" e
              LEFT JOIN
                "Saved Categories" sc
              ON
                e.saved_category_id = sc.saved_category_id
              WHERE
                sc.weekly_summary_id = $1
            `,
          [weekly_summary_id]
        );

        console.log(rows);

        const arranged = groupExpensesByDay(rows);
        res.status(200).json({
          data: {
            arranged,
            date_start: rows[0].date_start,
            date_end: rows[0].date_end,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching weekly expenses:", error);
      res.status(500).json({ error: "Internal Server Error", message: error });
    }
  }
);

export default chartRouter;
