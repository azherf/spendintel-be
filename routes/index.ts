import express, { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import currencyRoutes from "./currencyRoutes";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/currencies", currencyRoutes);


export default router;
