import { Router } from "express";
import counterRoutes from "../modules/counter/counterRoutes.js";

const router = Router();

router.use("/counter", counterRoutes);

export default router;
