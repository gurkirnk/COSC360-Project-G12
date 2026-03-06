import { Router } from "express";
import { incrementCounter } from "../controllers/counterController.js";

const router = Router();

router.post("/counter/increment", incrementCounter);

export default router;
