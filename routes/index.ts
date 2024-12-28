import express, { Router } from "express";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";
import currencyRoutes from "./currencyRoutes";
import modeOfPaymentRoutes from "./modeOfPaymentRoutes";
import userRoutes from "./userRoutes";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/currencies", currencyRoutes);
router.use("/modes-of-payment", modeOfPaymentRoutes);
router.use("/user", userRoutes);


export default router;
