import express, { Request, Response } from "express";
import categoryRouter from "./routes/categories";
import { pool } from "./db";
import userRouter from "./routes/users";
import cors from "cors";
import expenseRouter from "./routes/expense";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(cors());
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/expense", expenseRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello world!",
  });
});

app.listen(port, async () => {
  console.log("Listening to ", port);
  await pool.connect();
});
