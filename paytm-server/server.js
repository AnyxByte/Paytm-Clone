import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/auth.js";
import accountRouter from "./routes/account.js";
import transactionRouter from "./routes/transaction.js";
import orderRouter from "./routes/order.js";
import cookieParser from "cookie-parser";
import { auth } from "./middlewares/auth.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

await connectDb();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/accounts", auth, accountRouter);
app.use("/api/transactions", auth, transactionRouter);
app.use("/api/create-order", auth, orderRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
