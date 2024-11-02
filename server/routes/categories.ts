import express, { Request, Response } from 'express';
import { pool } from '../db'

const categoryRouter = express.Router();

categoryRouter.get("/", async (req: Request, res: Response) => {
  try {
    const data = await pool.query('SELECT * FROM "Category"')
    
    res.status(200).json({
      data: data.rows
    })

  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message 
    })
  }
})

export default categoryRouter