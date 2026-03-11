import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";
import authRoutes from "../modules/auth/authRoutes.js";

const router = Router();

router.use("/counter", counterRoutes);
router.use("/auth", authRoutes);

export default router;
