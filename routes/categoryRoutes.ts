import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categoryController";
import { AuthenticatedRequest } from "../types/express";

const router: Router = express.Router();

router.get("/", authMiddleware, (req, res) => getCategories(req as AuthenticatedRequest, res));
router.get("/:id", authMiddleware, (req, res) => getCategory(req as AuthenticatedRequest, res));
router.post("/", authMiddleware, (req, res) => createCategory(req as AuthenticatedRequest, res));
router.put("/:id", authMiddleware, (req, res) => updateCategory(req as AuthenticatedRequest, res));
router.delete("/:id", authMiddleware, (req, res) => deleteCategory(req as AuthenticatedRequest, res));

export default router;
