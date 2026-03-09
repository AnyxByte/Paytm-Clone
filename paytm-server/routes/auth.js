import express from "express";
import { handleUserLogin, handleUserRegister } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", handleUserRegister);
router.post("/login", handleUserLogin);

export default router;
