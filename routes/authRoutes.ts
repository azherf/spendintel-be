import express, { Router } from "express";
import { signinUser, signupUser } from "../controllers/authController";

const router: Router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);

export default router;
