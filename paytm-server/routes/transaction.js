import express from "express";
import {
  createTransaction,
  createInitialFunds,
} from "../controllers/transaction.js";
import { auth, authSystemUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", auth, createTransaction);

router.post("/deposit", authSystemUser, createInitialFunds);

export default router;
