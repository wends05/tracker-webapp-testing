import express, { Request, Response } from "express";
import categoryRouter from "./routes/categories";
import { pool } from "./db";


const app = express()
const port = 3000

app.use(express.json())
app.use("/category", categoryRouter)

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello world!"
  })
})


app.listen(port, async () => {
  console.log("Listening to ", port)
  await pool.connect()
})