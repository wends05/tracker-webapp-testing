import express, { Request, Response } from "express";
import { pool } from "../db";

const userRouter = express.Router();

userRouter.get("", async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw Error("No email provided");
    }

    const user = await pool.query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);

    if (user.rows[0]) {
      res.status(200).json({ data: user.rows[0] });
      return;
    }

    throw Error("User not found");
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

userRouter.post("", async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;

    const user = await pool.query(
      'INSERT INTO "User"(username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );

    res.json({
      user
    })
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default userRouter;
