import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";
import authRoutes from "../modules/auth/authRoutes.js";
import listRoutes from "../modules/listing/listRoutes.js";
import imageRouter from "../modules/images/imageRouter.js";
import commentRoutes from "../modules/comments/commentRoutes.js";
import messageRoutes from "../modules/messages/messageRoutes.js";
import reservationRoutes from "../modules/reservations/reservationRoutes.js";

const router = Router();

router.use("/counter", counterRoutes);
router.use("/auth", authRoutes);
router.use("/list", listRoutes);
router.use("/images", imageRouter);
router.use("/comments", commentRoutes);
router.use("/messages", messageRoutes);
router.use("/reservations", reservationRoutes);

export default router;
