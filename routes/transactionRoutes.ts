import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { createTransaction, deleteTransaction, getTransaction, getTransactions, getTransactionTemplate, updateTransaction, uploadTransactions } from "../controllers/transactionController";
import { AuthenticatedRequest } from "../types/express";

const router: Router = express.Router();

router.post("/", authMiddleware, (req, res) => createTransaction(req as AuthenticatedRequest, res));
router.delete("/:id", authMiddleware, (req, res) => deleteTransaction(req as AuthenticatedRequest, res));
router.get("/template", authMiddleware, (req, res) => getTransactionTemplate(req as AuthenticatedRequest, res));
router.post("/upload", authMiddleware, (req, res) => uploadTransactions(req as AuthenticatedRequest, res));
router.get("/:id", authMiddleware, (req, res) => getTransaction(req as AuthenticatedRequest, res));
router.get("/", authMiddleware, (req, res) => getTransactions(req as AuthenticatedRequest, res));
router.put("/:id", authMiddleware, (req, res) => updateTransaction(req as AuthenticatedRequest, res));

export default router;
