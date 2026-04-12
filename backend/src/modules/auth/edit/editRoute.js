import { Router } from "express";
import { editController } from "./editController.js";
import { requireAuth } from "../tokens/authMiddleware.js";

const editRoutes = Router();

editRoutes.put("/", requireAuth, editController);

export default editRoutes;