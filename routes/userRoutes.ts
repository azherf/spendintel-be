import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { changePassword, getUser, updateUser } from "../controllers/userController";
import { AuthenticatedRequest } from "../types/express";

const router: Router = express.Router();

router.get("/", authMiddleware, (req, res) => getUser(req as AuthenticatedRequest, res));
router.put("/change-password", authMiddleware, (req, res) => changePassword(req as AuthenticatedRequest, res));
router.put("/:id", authMiddleware, (req, res) => updateUser(req as AuthenticatedRequest, res));

export default router;
