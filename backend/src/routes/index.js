import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";
import authRoutes from "../modules/auth/authRoutes.js";
import listRoutes from "../modules/listing/listRoutes.js";
import imageRouter from "../modules/images/imageRouter.js";
import commentRoutes from "../modules/comments/commentRoutes.js";
import messageRoutes from "../modules/messages/messageRoutes.js";

const router = Router();

router.use("/counter", counterRoutes);
router.use("/auth", authRoutes);
router.use("/list", listRoutes);
router.use("/images", imageRouter);
router.use("/comments", commentRoutes);

export default router;
