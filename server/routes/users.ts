import express, { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import { User } from "../utils/types";

const userRouter = express.Router();

userRouter.get("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw Error("No email provided");
    }

    const user = await pool.query<User>(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (user.rows[0]) {
      res.status(200).json({ data: user.rows[0] });
      return;
    }

    throw Error("User not found");
  } catch (error: unknown) {
    next(error);
  }
});

userRouter.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body as User;

    if (!username || !email) {
      throw Error("Username or email not provided");
    }

    const { rows: userRows } = await pool.query<User>(
      `INSERT INTO "User"(username, email) VALUES ($1, $2) RETURNING *`,
      [username, email]
    );

    res.json({
      data: userRows[0],
    });
  } catch (error: unknown) {
    next(error);
  }
});

userRouter.get(
  "/:id/categories",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await pool.query(
        'SELECT * FROM "Category" WHERE user_id = $1 ORDER BY category_id',
        [id]
      );

      res.json({
        data: data.rows,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);
export default userRouter;
