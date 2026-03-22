import express from "express";
import {
  createTransaction,
  depositFundsToWallet,
  handleGetTransaction,
  withdrawFunds,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/create", createTransaction);

router.post("/deposit", depositFundsToWallet);

router.get("/:accountId", handleGetTransaction);

router.post("/withdraw", withdrawFunds);

export default router;
