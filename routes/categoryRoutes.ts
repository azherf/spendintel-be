import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController";
import { AuthenticatedRequest } from "../types/express";

const router: Router = express.Router();

router.get("/", authMiddleware, (req, res) => getCategories(req as AuthenticatedRequest, res));
router.post("/", authMiddleware, (req, res) => createCategory(req as AuthenticatedRequest, res));
router.put("/", authMiddleware, (req, res) => updateCategory(req as AuthenticatedRequest, res));
router.delete("/", authMiddleware, (req, res) => deleteCategory(req as AuthenticatedRequest, res));

export default router;
