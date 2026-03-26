import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";
import authRoutes from "../modules/auth/authRoutes.js";
import browseRoutes from "../modules/browse/browseRoutes.js";
import listRoutes from "../modules/list/listRoutes.js";
import imageRouter from "../modules/images/imageRouter.js";

const router = Router();

router.use("/counter", counterRoutes);
router.use("/auth", authRoutes);
router.use("/browse", browseRoutes);
router.use("/list", listRoutes);
router.use("/images", imageRouter);

export default router;
