import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";
import authRoutes from "../modules/auth/authRoutes.js";
import browseRoutes from "../modules/browse/browseRoutes.js"

const router = Router();

router.use("/counter", counterRoutes);
router.use("/auth", authRoutes);
router.use("/browse", browseRoutes)

export default router;
