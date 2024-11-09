import express, { Request, Response } from "express";
import { pool } from "../db";

const categoryRouter = express.Router();

categoryRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category_name, budget, background_color, background_image_url } = req.body;

    const data = await pool.query(
      'UPDATE "Category" SET category_name = $1, budget = $2, background_color = $3, background_image_url = $4 WHERE id = $5 RETURNING *',
      [category_name, budget, background_color, background_image_url, id]
    );

    res.json({
      data: data.rows[0],
    })
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default categoryRouter;
