import express from "express";
import {
  createTransaction,
  depositFundsToWallet,
  handleGetTransaction,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/create", createTransaction);

router.post("/deposit", depositFundsToWallet);

router.get("/:accountId", handleGetTransaction);

export default router;
