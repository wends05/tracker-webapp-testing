import express, { Request, Response } from "express";
import { pool } from "../db";
import { User } from "../utils/types";

const userRouter = express.Router();

userRouter.get("", async (req: Request, res: Response) => {
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
    console.error(error);
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

userRouter.post("", async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body as User;

    const user = await pool.query<User>(
      `INSERT INTO "User"(username, email) VALUES ($1, $2) RETURNING *`,
      [username, email]
    );

    res.json({
      user,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

userRouter.get("/:id/categories", async (req: Request, res: Response) => {
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
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});
export default userRouter;
