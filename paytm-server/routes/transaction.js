import express from "express";
import {
  createTransaction,
  depositFundsToWallet,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/create", createTransaction);

router.post("/deposit", depositFundsToWallet);

export default router;
