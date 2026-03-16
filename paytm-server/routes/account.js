import express from "express";
import {
  createAccount,
  fetchUserAccounts,
  fetchAccountBalance,
  fetchAllAccounts,
} from "../controllers/account.js";

const router = express.Router();

router.post("/create", createAccount);

router.get("/", fetchUserAccounts);

router.get("/balance/:accountId", fetchAccountBalance);

router.get("/all/:accountId", fetchAllAccounts);

export default router;
