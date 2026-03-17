import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";
import authRoutes from "../modules/auth/authRoutes.js";
import browseRoutes from "../modules/browse/browseRoutes.js";
import listRoutes from "../modules/list/listRoutes.js";

const router = Router();

router.use("/counter", counterRoutes);
router.use("/auth", authRoutes);
router.use("/browse", browseRoutes)
router.use("/list", listRoutes)

export default router;
