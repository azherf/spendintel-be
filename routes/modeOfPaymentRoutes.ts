import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { createModeOfPayment, deleteModeOfPayment, getModeOfPayment, getModesOfPayment, updateModeOfPayment } from "../controllers/modeOfPaymentController";
import { AuthenticatedRequest } from "../types/express";

const router: Router = express.Router();

router.get("/", authMiddleware, (req, res) => getModesOfPayment(req as AuthenticatedRequest, res));
router.get("/:id", authMiddleware, (req, res) => getModeOfPayment(req as AuthenticatedRequest, res));
router.post("/", authMiddleware, (req, res) => createModeOfPayment(req as AuthenticatedRequest, res));
router.put("/:id", authMiddleware, (req, res) => updateModeOfPayment(req as AuthenticatedRequest, res));
router.delete("/:id", authMiddleware, (req, res) => deleteModeOfPayment(req as AuthenticatedRequest, res));

export default router;
