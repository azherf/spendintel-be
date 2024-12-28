import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getCurrencies } from "../controllers/currencyController";

const router: Router = express.Router();

router.get("/", authMiddleware, getCurrencies);

export default router;
