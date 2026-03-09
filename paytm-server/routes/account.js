import express from "express";
import {
  createAccount,
  fetchUserAccounts,
  fetchAccountBalance,
} from "../controllers/account.js";

const router = express.Router();

router.post("/create", createAccount);

router.get("/", fetchUserAccounts);

router.get("/balance/:accountId", fetchAccountBalance);

export default router;
