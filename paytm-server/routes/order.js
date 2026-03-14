import express from "express";
import { handleCreateOrder } from "../controllers/order.js";

const router = express.Router();

router.post("/", handleCreateOrder);

export default router;
