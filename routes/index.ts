import express, { Router } from "express";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";
import currencyRoutes from "./currencyRoutes";
import userRoutes from "./userRoutes";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/currencies", currencyRoutes);


export default router;
