import express, { Request, Response } from "express";
import { pool } from "../db";

const userRouter = express.Router();

userRouter.post("", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

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

    const createdUser = await pool.query(
      'INSERT INTO "User"(email) VALUES($1) RETURNING *',
      [email]
    );
    res.status(200).json({
      data: createdUser.rows[0],
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default userRouter;
